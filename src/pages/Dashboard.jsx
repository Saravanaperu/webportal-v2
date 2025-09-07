import Chart from '../components/dashboard/Chart'
import LivePnl from '../components/dashboard/LivePnl'
import PositionTracker from '../components/dashboard/PositionTracker'
import SystemStatus from '../components/dashboard/SystemStatus'

function Dashboard() {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-4">Dashboard</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Chart />
        </div>
        <div className="space-y-6">
          <LivePnl />
          <PositionTracker />
          <SystemStatus />
        </div>
      </div>
    </div>
  )
}

export default Dashboard
