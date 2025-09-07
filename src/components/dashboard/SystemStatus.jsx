import { useState } from 'react';
import { useSocket, useSocketSubscription } from '../../hooks/useSocket';

const StatusIndicator = ({ status, text, statusText }) => {
    const statusColor = status ? 'bg-green-500' : 'bg-red-500';
    return (
      <div className="flex items-center justify-between text-sm">
        <span>{text}</span>
        <div className="flex items-center">
          <span className={`w-2.5 h-2.5 ${statusColor} rounded-full mr-2`}></span>
          <span className="font-semibold">{statusText}</span>
        </div>
      </div>
    );
  };

function SystemStatus() {
  const [status, setStatus] = useState(null);

  useSocketSubscription(['status']);
  useSocket('status:update', (data) => {
    setStatus(data);
  });

  return (
    <div className="bg-card p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">System Status</h3>
      {status === null ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-3">
            <StatusIndicator
                status={status.broker === 'Connected'}
                text="Broker"
                statusText={status.broker}
            />
            <StatusIndicator
                status={status.strategy !== 'Stopped'}
                text="Strategy"
                statusText={status.strategy}
            />
            <StatusIndicator
                status={status.market === 'Open'}
                text="Market"
                statusText={status.market}
            />
        </div>
      )}
    </div>
  );
}

export default SystemStatus;
