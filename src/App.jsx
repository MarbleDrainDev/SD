import React from 'react';
import { NodeStatus } from './components/NodeStatus';
import { SystemLogs } from './components/SystemLogs';
import { useNodeConnection } from './hooks/useNodeConnection';
import './index.css';

export function App() {
  const { nodes, leader, logs } = useNodeConnection();

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 text-white flex items-center justify-center p-8">
      <div className="max-w-4xl w-full bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-8 text-gray-800 text-center">Distributed System Dashboard</h1>
        
        <div className="grid grid-cols-2 gap-8 h-96">
          <NodeStatus nodes={nodes} leader={leader} />
          <SystemLogs logs={logs} />
        </div>
      </div>
    </div>
  );
}