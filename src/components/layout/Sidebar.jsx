import { NavLink } from 'react-router-dom'
import { Home, BarChart2, ChevronsRight, Settings, Sliders, AlertTriangle, PieChart } from 'lucide-react'

const navItems = [
  { to: '/', label: 'Dashboard', icon: Home },
  { to: '/trade-monitor', label: 'Trade Monitor', icon: BarChart2 },
  { to: '/bot-controls', label: 'Bot Controls', icon: ChevronsRight },
  { to: '/config-panel', label: 'Config Panel', icon: Settings },
  { to: '/strategy-params', label: 'Strategy Parameters', icon: Sliders },
  { to: '/alerts-logs', label: 'Alerts & Logs', icon: AlertTriangle },
  { to: '/pnl-performance', label: 'P&L & Performance', icon: PieChart },
]

function Sidebar() {
  return (
    <aside className="w-64 bg-sidebar text-sidebar-foreground p-4">
      <div className="text-2xl font-bold mb-8">Trading Bot</div>
      <nav>
        <ul>
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-lg transition-colors ${
                    isActive ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'hover:bg-sidebar-accent/50'
                  }`
                }
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}

export default Sidebar
