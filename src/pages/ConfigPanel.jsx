import RiskConfig from '../components/config/RiskConfig'
import ApiConfig from '../components/config/ApiConfig'
import SessionScheduler from '../components/config/SessionScheduler'

function ConfigPanel() {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-4">Configuration Panel</h2>
      <div className="space-y-6">
        <RiskConfig />
        <ApiConfig />
        <SessionScheduler />
      </div>
    </div>
  )
}

export default ConfigPanel
