import { useState, useEffect } from 'react';
import { getTrades, cancelOrder } from '../../services/tradeService';
import { useSocket, useSocketSubscription } from '../../hooks/useSocket';
import { Button } from '@/components/ui/button';

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

  const handleCancel = async (orderId) => {
    try {
        await cancelOrder(orderId);
        // The trades list will be updated via the 'trades:update' socket event
    } catch (error) {
        alert('Failed to cancel order.');
    }
  };

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
              <th className="text-left p-2">Status</th>
              <th className="text-left p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {trades.map((trade) => (
              <tr key={trade.id} className="border-b">
                <td className="p-2">{trade.symbol}</td>
                <td className="p-2">{trade.entry}</td>
                <td className="p-2">{trade.status}</td>
                <td className="p-2">
                  {/* Find the first pending order for this trade to allow cancellation */}
                  {trade.orders && trade.orders.find(o => o.status === 'PENDING') &&
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleCancel(trade.orders.find(o => o.status === 'PENDING').id)}
                    >
                        Cancel
                    </Button>
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default LiveTrades;
