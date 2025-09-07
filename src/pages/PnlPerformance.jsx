import { useState, useEffect } from 'react';
import PnlStats from '../components/performance/PnlStats';
import TradeStats from '../components/performance/TradeStats';
import CapitalStats from '../components/performance/CapitalStats';
import { getStatsSummary } from '../services/statsService';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

function PnlPerformance() {
  const [stats, setStats] = useState(null);
  const [scope, setScope] = useState('daily');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const data = await getStatsSummary(scope);
        setStats(data);
      } catch (error) {
        // Handle error
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [scope]);

  return (
    <div>
      <h2 className="text-3xl font-bold mb-4">P&L & Performance</h2>
      <Tabs value={scope} onValueChange={setScope}>
        <TabsList>
          <TabsTrigger value="daily">Daily</TabsTrigger>
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
        </TabsList>
        <TabsContent value={scope}>
          {loading ? (
            <p>Loading...</p>
          ) : stats ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
              <PnlStats pnl={stats.pnl} />
              <TradeStats winLossRatio={stats.winLossRatio} avgRR={stats.avgRR} />
              <CapitalStats deployment={stats.capitalDeployment} />
            </div>
          ) : (
            <p>No stats available.</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default PnlPerformance;
