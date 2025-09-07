import { useState } from 'react';
import { useSocket, useSocketSubscription } from '../../hooks/useSocket';

function LivePnl() {
  const [pnl, setPnl] = useState(null);

  useSocketSubscription(['pnl']);
  useSocket('pnl:update', (data) => {
    setPnl(data);
  });

  const pnlValue = pnl ? pnl.total : 0;
  const pnlColor = pnlValue >= 0 ? 'text-green-500' : 'text-red-500';

  return (
    <div className="bg-card p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Live P&L</h3>
      {pnl === null ? (
        <p>Loading...</p>
      ) : (
        <p className={`text-2xl font-bold ${pnlColor}`}>
          {pnlValue >= 0 ? '+' : ''}${pnlValue.toFixed(2)}
        </p>
      )}
    </div>
  );
}

export default LivePnl;
