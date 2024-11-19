import React from 'react';
import { NodeStatus } from './components/NodeStatus';
import { SystemLogs } from './components/SystemLogs';
import { useNodeConnection } from './hooks/useNodeConnection';

export function App() {
  const { nodes, leader, logs } = useNodeConnection();

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Distributed System Dashboard</h1>
        
        <div className="grid grid-cols-2 gap-8">
          <NodeStatus nodes={nodes} leader={leader} />
          <SystemLogs logs={logs} />
        </div>
      </div>
    </div>
  );
}