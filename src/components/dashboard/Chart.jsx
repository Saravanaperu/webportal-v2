import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useSocket, useSocketSubscription } from '../../hooks/useSocket';

const MAX_TICKS = 20;

function Chart({ symbol = 'NIFTY' }) {
  const [ticks, setTicks] = useState([]);

  useSocketSubscription([`market:${symbol}`]);
  useSocket('market:tick', (tick) => {
    if (tick.symbol === symbol) {
      setTicks((prevTicks) => {
        const newTicks = [...prevTicks, tick];
        if (newTicks.length > MAX_TICKS) {
          return newTicks.slice(newTicks.length - MAX_TICKS);
        }
        return newTicks;
      });
    }
  });

  return (
    <div className="bg-card p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">TradingView Chart (1-min) - {symbol}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={ticks}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="ts" tickFormatter={(ts) => new Date(ts).toLocaleTimeString()} />
          <YAxis domain={['dataMin', 'dataMax']} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="ltp" stroke="#8884d8" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default Chart;
