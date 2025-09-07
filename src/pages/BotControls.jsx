import StrategyControl from '../components/botcontrols/StrategyControl'
import ModeSelector from '../components/botcontrols/ModeSelector'
import StrategySelector from '../components/botcontrols/StrategySelector'

function BotControls() {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-4">Bot Controls</h2>
      <div className="space-y-6">
        <StrategyControl />
        <ModeSelector />
        <StrategySelector />
      </div>
    </div>
  )
}

export default BotControls
