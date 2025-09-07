import { useState, useEffect } from 'react';
import { getTrades } from '../../services/tradeService';
import { useSocket, useSocketSubscription } from '../../hooks/useSocket';

function LiveTrades() {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrades = async () => {
      try {
        const data = await getTrades();
        setTrades(data);
      } catch (error) {
        // Handle error
      } finally {
        setLoading(false);
      }
    };
    fetchTrades();
  }, []);

  useSocketSubscription(['trades']);
  useSocket('trades:update', (data) => {
    setTrades(data);
  });

  return (
    <div className="bg-card p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Live Trades</h3>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-2">Symbol</th>
              <th className="text-left p-2">Entry</th>
              <th className="text-left p-2">SL</th>
              <th className="text-left p-2">Target</th>
              <th className="text-left p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {trades.map((trade, index) => (
              <tr key={index} className="border-b">
                <td className="p-2">{trade.symbol}</td>
                <td className="p-2">{trade.entry}</td>
                <td className="p-2">{trade.sl}</td>
                <td className="p-2">{trade.target}</td>
                <td className="p-2">{trade.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default LiveTrades;
