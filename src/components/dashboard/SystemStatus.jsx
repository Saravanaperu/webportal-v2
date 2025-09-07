import { useState } from 'react';
import { useSocket, useSocketSubscription } from '../../hooks/useSocket';

function SystemStatus() {
  const [status, setStatus] = useState(null);

  useSocketSubscription(['status']);
  useSocket('status:update', (data) => {
    setStatus(data);
  });

  const isConnected = status ? status.broker === 'connected' : false;
  const statusColor = isConnected ? 'bg-green-500' : 'bg-red-500';
  const statusText = isConnected ? 'All systems normal' : 'Broker disconnected';

  return (
    <div className="bg-card p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-2">System Status</h3>
      {status === null ? (
        <p>Loading...</p>
      ) : (
        <div className="flex items-center">
          <span className={`w-3 h-3 ${statusColor} rounded-full mr-2`}></span>
          <p>{statusText}</p>
        </div>
      )}
    </div>
  );
}

export default SystemStatus;
