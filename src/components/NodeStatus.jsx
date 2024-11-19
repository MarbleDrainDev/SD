import React from 'react';

export function NodeStatus({ nodes, leader }) {
  const getNodeStatusColor = (node) => {
    if (node.isLeader) return 'bg-green-100 border-green-500';
    if (node.status === 'failed') return 'bg-red-100 border-red-500';
    return 'bg-gray-100 border-gray-300';
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Nodes Status</h2>
      <div className="space-y-2">
        {nodes.map((node) => (
          <div 
            key={node.id}
            className={`p-3 rounded border ${getNodeStatusColor(node)}`}
          >
            <div className="flex justify-between items-center">
              <span className="font-mono">{node.id}</span>
              <span className={`px-2 py-1 rounded text-sm ${
                node.isLeader ? 'bg-green-500 text-white' : 
                node.status === 'failed' ? 'bg-red-500 text-white' :
                'bg-gray-500 text-white'
              }`}>
                {node.isLeader ? 'Leader' : node.status}
              </span>
            </div>
          </div>
        ))}
        {nodes.length === 0 && (
          <div className="text-gray-500 text-center py-4">
            No nodes connected
          </div>
        )}
      </div>
    </div>
  );
}