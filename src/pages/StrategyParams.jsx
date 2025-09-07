import IndicatorSettings from '../components/strategy/IndicatorSettings'
import TradeSettings from '../components/strategy/TradeSettings'

function StrategyParams() {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-4">Strategy Parameters</h2>
      <div className="space-y-6">
        <IndicatorSettings />
        <TradeSettings />
      </div>
    </div>
  )
}

export default StrategyParams
