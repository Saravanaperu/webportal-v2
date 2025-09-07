import { Routes, Route } from 'react-router-dom'
import MainLayout from './components/layout/MainLayout'
import Dashboard from './pages/Dashboard'
import TradeMonitor from './pages/TradeMonitor'
import BotControls from './pages/BotControls'
import ConfigPanel from './pages/ConfigPanel'
import StrategyParams from './pages/StrategyParams'
import AlertsLogs from './pages/AlertsLogs'
import PnlPerformance from './pages/PnlPerformance'

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="trade-monitor" element={<TradeMonitor />} />
        <Route path="bot-controls" element={<BotControls />} />
        <Route path="config-panel" element={<ConfigPanel />} />
        <Route path="strategy-params" element={<StrategyParams />} />
        <Route path="alerts-logs" element={<AlertsLogs />} />
        <Route path="pnl-performance" element={<PnlPerformance />} />
      </Route>
    </Routes>
  )
}

export default App
