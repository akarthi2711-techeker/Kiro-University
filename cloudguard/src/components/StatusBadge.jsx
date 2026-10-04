import './StatusBadge.css'

const CONFIG = {
  passed: { label: 'Passed', icon: '✓' },
  failed: { label: 'Failed', icon: '✗' },
  pending: { label: 'Pending', icon: '○' },
}

export default function StatusBadge({ status }) {
  const { label, icon } = CONFIG[status] ?? CONFIG.pending
  return (
    <span className={`status-badge status-badge--${status}`}>
      <span className="status-badge-icon">{icon}</span>
      {label}
    </span>
  )
}
