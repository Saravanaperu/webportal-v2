const logs = [
  { time: '10:00:01', message: 'Strategy started' },
  { time: '10:00:05', message: 'Looking for setups...' },
  { time: '10:01:00', message: 'Potential setup found for SPY 450C' },
];

function LogStream() {
  return (
    <div className="bg-card p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Real-time Log Stream</h3>
      <div className="font-mono text-sm bg-muted text-muted-foreground p-4 rounded-lg h-64 overflow-y-auto">
        {logs.map((log, index) => (
          <div key={index}>
            <span className="text-primary mr-2">{log.time}</span>
            <span>{log.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LogStream;
