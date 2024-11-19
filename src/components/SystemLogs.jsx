import React, { useRef, useEffect } from 'react';

export function SystemLogs({ logs }) {
  const logsEndRef = useRef(null);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">System Logs</h2>
      <div className="h-96 overflow-y-auto bg-gray-50 p-4 rounded">
        {logs.map((log, index) => (
          <div key={index} className="text-sm font-mono py-1 border-b border-gray-200 break-all">
            {log}
          </div>
        ))}
        <div ref={logsEndRef} />
      </div>
    </div>
  );
}