import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

export function useNodeConnection() {
  const [nodes, setNodes] = useState([]);
  const [leader, setLeader] = useState(null);
  const [logs, setLogs] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const MAIN_NODE_URL = import.meta.env.VITE_MAIN_NODE_URL || 'http://localhost:3000';
    const socket = io(MAIN_NODE_URL);

    socket.on('connect', () => {
      setIsConnected(true);
      setLogs(prev => [...prev, `${new Date().toISOString()} - Connected to node`]);
      socket.emit('register', { id: socket.id });
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
      setLogs(prev => [...prev, `${new Date().toISOString()} - Disconnected from node`]);
    });

    socket.on('nodes-status', (status) => {
      setNodes(status.nodes);
      setLeader(status.leader);
      if (status.electionInProgress) {
        setLogs(prev => [...prev, `${new Date().toISOString()} - Election in progress`]);
      }
    });

    socket.on('log', (message) => {
      setLogs(prev => [...prev, message]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return { nodes, leader, logs, isConnected };
}