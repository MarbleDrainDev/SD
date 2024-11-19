import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

class Node {
  constructor(port) {
    this.id = uuidv4();
    this.port = port;
    this.isLeader = false;
    this.nodes = new Map();
    this.electionInProgress = false;
    this.timeout = null;
    this.heartbeatInterval = null;
    this.logFile = path.join(process.cwd(), `node-${port}-logs.txt`);
  }

  log(message) {
    const timestamp = new Date().toISOString();
    const logMessage = `${timestamp} - ${message}\n`;
    fs.appendFileSync(this.logFile, logMessage);
    console.log(message);
    io.emit('log', logMessage);
  }

  start() {
    io.on('connection', (socket) => {
      this.log(`New connection: ${socket.id}`);

      socket.on('register', (data) => {
        this.nodes.set(data.id, { 
          socket, 
          lastHeartbeat: Date.now(),
          status: 'active'
        });
        this.broadcastNodes();
        if (!this.electionInProgress && this.nodes.size === 1) {
          this.startElection();
        }
      });

      socket.on('election', (message) => {
        this.log(`Received election message from ${message.id}`);
        if (message.id > this.id) {
          socket.emit('ok');
          this.startElection();
        }
      });

      socket.on('coordinator', (message) => {
        this.isLeader = message.id === this.id;
        this.electionInProgress = false;
        this.log(`New coordinator elected: ${message.id}`);
        this.broadcastNodes();
      });

      socket.on('heartbeat', () => {
        const node = this.nodes.get(socket.id);
        if (node) {
          node.lastHeartbeat = Date.now();
          node.status = 'active';
        }
      });

      socket.on('disconnect', () => {
        this.log(`Node disconnected: ${socket.id}`);
        this.nodes.delete(socket.id);
        this.broadcastNodes();
        if (this.nodes.size === 0) {
          this.startElection();
        }
      });
    });

    server.listen(this.port, () => {
      this.log(`Node running on port ${this.port}`);
      this.startHeartbeat();
    });
  }

  startElection() {
    this.electionInProgress = true;
    this.log('Starting election process');
    let higherNodes = 0;

    this.nodes.forEach((node, id) => {
      if (id > this.id) {
        higherNodes++;
        node.socket.emit('election', { id: this.id });
      }
    });

    if (higherNodes === 0) {
      this.becomeLeader();
    }

    this.timeout = setTimeout(() => {
      if (this.electionInProgress) {
        this.becomeLeader();
      }
    }, 5000);
  }

  becomeLeader() {
    this.isLeader = true;
    this.electionInProgress = false;
    this.log(`Node ${this.id} became leader`);
    this.nodes.forEach((node) => {
      node.socket.emit('coordinator', { id: this.id });
    });
    this.broadcastNodes();
  }

  startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      const now = Date.now();
      this.nodes.forEach((node, id) => {
        if (now - node.lastHeartbeat > 10000) {
          node.status = 'failed';
          this.log(`Node ${id} failed heartbeat check`);
          this.nodes.delete(id);
          this.broadcastNodes();
          if (this.nodes.size === 0) {
            this.startElection();
          }
        } else {
          node.socket.emit('heartbeat');
        }
      });
    }, 5000);
  }

  broadcastNodes() {
    const nodesStatus = {
      nodes: Array.from(this.nodes.entries()).map(([id, node]) => ({
        id,
        status: node.status,
        isLeader: id === this.id && this.isLeader
      })),
      leader: this.isLeader ? this.id : null,
      electionInProgress: this.electionInProgress
    };
    io.emit('nodes-status', nodesStatus);
  }
}

const port = process.env.PORT || Math.floor(Math.random() * 1000) + 3000;
const node = new Node(port);
node.start();