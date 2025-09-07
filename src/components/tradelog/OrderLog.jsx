import { useState, useEffect } from 'react';
import { getOrderLogs } from '../../services/tradeService';
import { useSocket, useSocketSubscription } from '../../hooks/useSocket';

function OrderLog() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const data = await getOrderLogs();
        setLogs(data);
      } catch (error) {
        // Handle error
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  useSocketSubscription(['orders']);
  useSocket('orders:execution', (newLog) => {
    setLogs((prevLogs) => [newLog, ...prevLogs]);
  });

  return (
    <div className="bg-card p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Order Execution Log</h3>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="font-mono text-sm">
          {logs.map((log, index) => (
            <div key={index}>
              <span className="text-muted-foreground mr-2">{new Date(log.ts).toLocaleTimeString()}</span>
              <span>{log.message}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OrderLog;
