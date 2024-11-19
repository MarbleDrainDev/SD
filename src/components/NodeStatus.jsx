import React from 'react';
import { Crown, AlertCircle, CheckCircle } from 'lucide-react';

export function NodeStatus({ nodes, leader }) {
  const getNodeStatusColor = (node) => {
    if (node.isLeader) return 'bg-gradient-to-r from-green-400 to-green-600 border-green-500';
    if (node.status === 'failed') return 'bg-gradient-to-r from-red-400 to-red-600 border-red-500';
    return 'bg-gradient-to-r from-gray-400 to-gray-600 border-gray-300';
  };

  const getNodeStatusIcon = (node) => {
    if (node.isLeader) return <Crown className="text-yellow-300" />;
    if (node.status === 'failed') return <AlertCircle className="text-red-300" />;
    return <CheckCircle className="text-gray-300" />;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg overflow-y-auto">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Nodes Status</h2>
      <div className="space-y-4">
        {nodes.map((node) => (
          <div 
            key={node.id}
            className={`p-4 rounded-lg border ${getNodeStatusColor(node)} hover:shadow-xl transition-shadow duration-300`}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                {getNodeStatusIcon(node)}
                <span className="font-mono text-white">{node.id}</span>
              </div>
              <span className={`px-3 py-1 rounded text-sm font-semibold ${
                node.isLeader ? 'bg-green-700 text-white' : 
                node.status === 'failed' ? 'bg-red-700 text-white' :
                'bg-gray-700 text-white'
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