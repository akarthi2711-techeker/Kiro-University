import { NavLink } from 'react-router-dom'
import './Layout.css'

const navItems = [
  { to: '/', label: 'Dashboard', icon: '⊞' },
  { to: '/checklist', label: 'Checklist', icon: '✔' },
  { to: '/report', label: 'Report', icon: '📋' },
]

export default function Layout({ children }) {
  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar-brand">
          <span className="topbar-icon">🛡️</span>
          <span className="topbar-title">CloudGuard</span>
          <span className="topbar-sub">Cloud Security Checklist</span>
        </div>
        <nav className="topbar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                'nav-link' + (isActive ? ' nav-link--active' : '')
              }
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </header>
      <main className="page-content">{children}</main>
      <footer className="footer">
        <p>CloudGuard · Built for learning cloud security basics · No data leaves your browser</p>
      </footer>
    </div>
  )
}
