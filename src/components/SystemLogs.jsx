import React from 'react';

export function SystemLogs({ logs }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg overflow-y-auto">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">System Logs</h2>
      <div className="space-y-2">
        {logs.map((log, index) => (
          <div key={index} className="bg-gray-100 p-2 rounded-lg hover:bg-gray-200 transition-colors duration-300">
            <span className="font-mono text-gray-800">{log}</span>
          </div>
        ))}
      </div>
    </div>
  );
}