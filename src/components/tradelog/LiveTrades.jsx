const trades = [
  { symbol: 'SPY 450C', entry: 1.23, sl: 1.00, target: 2.00, status: 'Open' },
  { symbol: 'QQQ 380P', entry: 2.50, sl: 2.00, target: 4.00, status: 'Open' },
  { symbol: 'IWM 220C', entry: 0.80, sl: 0.60, target: 1.50, status: 'Closed' },
];

function LiveTrades() {
  return (
    <div className="bg-card p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Live Trades</h3>
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
    </div>
  );
}

export default LiveTrades;
