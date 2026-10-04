import { useState } from 'react'
import { useChecklist } from '../context/ChecklistContext.jsx'
import StatusBadge from '../components/StatusBadge.jsx'
import { STATUS } from '../data/checks.js'
import './Checklist.css'

const FILTER_OPTIONS = ['all', 'pending', 'passed', 'failed']

export default function Checklist() {
  const { checks, updateStatus } = useChecklist()
  const [filter, setFilter] = useState('all')
  const [expandedId, setExpandedId] = useState(null)

  const visible = filter === 'all' ? checks : checks.filter((c) => c.status === filter)

  return (
    <div className="checklist-page">
      <div className="page-header">
        <h1 className="page-title">Security Checklist</h1>
        <p className="page-sub">Review each practice and mark it as Passed or Failed</p>
      </div>

      {/* Filter bar */}
      <div className="filter-bar">
        {FILTER_OPTIONS.map((opt) => (
          <button
            key={opt}
            className={`filter-btn ${filter === opt ? 'filter-btn--active' : ''}`}
            onClick={() => setFilter(opt)}
          >
            {opt.charAt(0).toUpperCase() + opt.slice(1)}
            <span className="filter-count">
              {opt === 'all'
                ? checks.length
                : checks.filter((c) => c.status === opt).length}
            </span>
          </button>
        ))}
      </div>

      {visible.length === 0 && (
        <div className="empty-state card">
          <p>No checks match the current filter.</p>
        </div>
      )}

      <ul className="check-list" role="list">
        {visible.map((check) => (
          <CheckItem
            key={check.id}
            check={check}
            index={checks.indexOf(check) + 1}
            isExpanded={expandedId === check.id}
            onToggle={() => setExpandedId(expandedId === check.id ? null : check.id)}
            onStatusChange={(status) => updateStatus(check.id, status)}
          />
        ))}
      </ul>
    </div>
  )
}

function CheckItem({ check, index, isExpanded, onToggle, onStatusChange }) {
  return (
    <li className={`check-item card ${check.status === 'failed' ? 'check-item--failed' : ''}`}>
      <div className="check-item-header" onClick={onToggle} role="button" tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && onToggle()}
        aria-expanded={isExpanded}
      >
        <div className="check-item-left">
          <span className="check-index">{index}</span>
          <div className="check-item-title-group">
            <span className="check-name">{check.name}</span>
            <span className="check-category">{check.category}</span>
          </div>
        </div>
        <div className="check-item-right">
          <StatusBadge status={check.status} />
          <span className="check-expand-icon">{isExpanded ? '▲' : '▼'}</span>
        </div>
      </div>

      {isExpanded && (
        <div className="check-item-body">
          <p className="check-explanation">{check.explanation}</p>
          <div className="check-actions">
            <span className="check-actions-label">Mark as:</span>
            {Object.values(STATUS).map((s) => (
              <button
                key={s}
                className={`status-btn status-btn--${s} ${check.status === s ? 'status-btn--active' : ''}`}
                onClick={() => onStatusChange(s)}
                aria-pressed={check.status === s}
              >
                {s === 'passed' && '✓ '}
                {s === 'failed' && '✗ '}
                {s === 'pending' && '○ '}
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>
      )}
    </li>
  )
}
