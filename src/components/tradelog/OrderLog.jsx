const logs = [
  { time: '10:00:01', message: 'BUY SPY 450C @ 1.23' },
  { time: '10:00:05', message: 'SELL SPY 450C @ 1.25' },
  { time: '10:01:00', message: 'BUY QQQ 380P @ 2.50' },
];

function OrderLog() {
  return (
    <div className="bg-card p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Order Execution Log</h3>
      <div className="font-mono text-sm">
        {logs.map((log, index) => (
          <div key={index}>
            <span className="text-muted-foreground mr-2">{log.time}</span>
            <span>{log.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OrderLog;
