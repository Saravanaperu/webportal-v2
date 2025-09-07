import PnlStats from '../components/performance/PnlStats'
import TradeStats from '../components/performance/TradeStats'
import CapitalStats from '../components/performance/CapitalStats'

function PnlPerformance() {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-4">P&L & Performance</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <PnlStats />
        <TradeStats />
        <CapitalStats />
      </div>
    </div>
  )
}

export default PnlPerformance
