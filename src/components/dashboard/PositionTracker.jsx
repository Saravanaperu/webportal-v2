import { useState, useEffect } from 'react';
import { getPositions } from '../../services/brokerService';
import { useSocket, useSocketSubscription } from '../../hooks/useSocket';

function PositionTracker() {
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        const data = await getPositions();
        setPositions(data);
      } catch (error) {
        // Handle error
      } finally {
        setLoading(false);
      }
    };
    fetchPositions();
  }, []);

  useSocketSubscription(['trades']);
  useSocket('trades:update', (data) => {
    setPositions(data);
  });

  return (
    <div className="bg-card p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Position Tracker</h3>
      {loading ? (
        <p>Loading...</p>
      ) : positions.length > 0 ? (
        positions.map((pos, index) => (
          <p key={index} className="text-lg">
            {pos.symbol} {pos.qty} @ {pos.avgPrice}
          </p>
        ))
      ) : (
        <p>No open positions.</p>
      )}
    </div>
  );
}

export default PositionTracker;
