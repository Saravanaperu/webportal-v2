import { useState, useEffect } from 'react';
import { useSocket, useSocketSubscription } from '../../hooks/useSocket';
import { getOrderLogs } from '../../services/tradeService'; // Re-using for initial logs

function LogStream() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInitialLogs = async () => {
      try {
        // Fetch recent logs to populate the view initially
        const initialLogs = await getOrderLogs(); // Assuming this returns recent logs
        setLogs(initialLogs);
      } catch (error) {
        // Handle error
      } finally {
        setLoading(false);
      }
    };
    fetchInitialLogs();
  }, []);

  useSocketSubscription(['logs']);
  useSocket('logs:append', (newLog) => {
    setLogs((prevLogs) => [newLog, ...prevLogs]);
  });

  return (
    <div className="bg-card p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Real-time Log Stream</h3>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="font-mono text-sm bg-muted text-muted-foreground p-4 rounded-lg h-64 overflow-y-auto">
          {logs.map((log, index) => (
            <div key={index}>
              <span className="text-primary mr-2">{new Date(log.ts).toLocaleTimeString()}</span>
              <span>{log.message}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default LogStream;
