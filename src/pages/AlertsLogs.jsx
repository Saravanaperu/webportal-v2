import LogStream from '../components/alerts/LogStream'
import DiscordConfig from '../components/alerts/DiscordConfig'

function AlertsLogs() {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-4">Alerts & Logs</h2>
      <div className="space-y-6">
        <LogStream />
        <DiscordConfig />
      </div>
    </div>
  )
}

export default AlertsLogs
