import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { startStrategy, stopStrategy } from '../../services/botService';

function StrategyControl() {
  const [loading, setLoading] = useState(false);

  const handleStart = async () => {
    setLoading(true);
    try {
      // In a real app, the selected strategy would come from state
      await startStrategy('Scalper V1');
      // Handle success (e.g., show a notification)
    } catch (error) {
      // Handle error
    } finally {
      setLoading(false);
    }
  };

  const handleStop = async () => {
    setLoading(true);
    try {
      await stopStrategy();
      // Handle success
    } catch (error) {
      // Handle error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-card p-4 rounded-lg flex items-center justify-between">
      <h3 className="text-lg font-semibold">Strategy Control</h3>
      <div className="flex gap-2">
        <Button onClick={handleStart} disabled={loading}>
          {loading ? 'Starting...' : 'Start'}
        </Button>
        <Button onClick={handleStop} disabled={loading} variant="destructive">
          {loading ? 'Stopping...' : 'Stop'}
        </Button>
      </div>
    </div>
  );
}

export default StrategyControl;
