import LiveTrades from '../components/tradelog/LiveTrades'
import OrderLog from '../components/tradelog/OrderLog'

function TradeMonitor() {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-4">Trade Monitor</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LiveTrades />
        <OrderLog />
      </div>
    </div>
  )
}

export default TradeMonitor
