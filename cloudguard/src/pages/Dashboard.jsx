import { Link } from 'react-router-dom'
import { useChecklist } from '../context/ChecklistContext.jsx'
import ScoreRing from '../components/ScoreRing.jsx'
import { getLabelClass } from '../utils/score.js'
import './Dashboard.css'

export default function Dashboard() {
  const { checks, summary } = useChecklist()
  const { score, passed, failed, pending, label } = summary
  const labelClass = getLabelClass(label)
  const total = checks.length

  return (
    <div className="dashboard">
      <div className="page-header">
        <h1 className="page-title">Security Dashboard</h1>
        <p className="page-sub">Your cloud security posture at a glance</p>
      </div>

      {/* Score hero */}
      <div className="score-hero card">
        <ScoreRing score={score} label={label} />
        <div className="score-hero-info">
          <span className={`security-label security-label--${labelClass}`}>
            {label}
          </span>
          <p className="score-hero-desc">
            {label === 'Not Started'
              ? 'Head to the Checklist and start marking items to generate your score.'
              : label === 'Good'
              ? 'Great work! Keep reviewing and maintaining these practices.'
              : label === 'Needs Attention'
              ? 'Some checks are failing. Review and fix the highlighted items.'
              : 'Several critical practices are missing. Address these as soon as possible.'}
          </p>
          <Link to="/checklist" className="btn btn--primary">
            Go to Checklist →
          </Link>
        </div>
      </div>

      {/* Stat cards */}
      <div className="stat-grid">
        <div className="stat-card stat-card--passed">
          <div className="stat-card-icon">✓</div>
          <div className="stat-card-value">{passed}</div>
          <div className="stat-card-label">Passed</div>
        </div>
        <div className="stat-card stat-card--failed">
          <div className="stat-card-icon">✗</div>
          <div className="stat-card-value">{failed}</div>
          <div className="stat-card-label">Failed</div>
        </div>
        <div className="stat-card stat-card--pending">
          <div className="stat-card-icon">○</div>
          <div className="stat-card-value">{pending}</div>
          <div className="stat-card-label">Pending</div>
        </div>
        <div className="stat-card stat-card--total">
          <div className="stat-card-icon">⊞</div>
          <div className="stat-card-value">{total}</div>
          <div className="stat-card-label">Total Checks</div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="card progress-card">
        <div className="progress-card-header">
          <span>Assessment Progress</span>
          <span>{total - pending} / {total} reviewed</span>
        </div>
        <div className="progress-bar-track" role="progressbar" aria-valuenow={total - pending} aria-valuemin={0} aria-valuemax={total}>
          <div
            className="progress-bar-fill"
            style={{ width: `${((total - pending) / total) * 100}%` }}
          />
        </div>
        <p className="progress-hint">
          {pending === total
            ? 'No checks reviewed yet. Open the checklist to get started.'
            : pending === 0
            ? 'All checks reviewed!'
            : `${pending} check${pending !== 1 ? 's' : ''} still pending.`}
        </p>
      </div>

      {/* Category breakdown */}
      <CategoryBreakdown checks={checks} />
    </div>
  )
}

function CategoryBreakdown({ checks }) {
  const categories = [...new Set(checks.map((c) => c.category))]

  return (
    <div className="card category-card">
      <h2 className="card-title">By Category</h2>
      <div className="category-list">
        {categories.map((cat) => {
          const items = checks.filter((c) => c.category === cat)
          const catPassed = items.filter((c) => c.status === 'passed').length
          const catFailed = items.filter((c) => c.status === 'failed').length
          const pct = items.length ? Math.round((catPassed / items.length) * 100) : 0
          return (
            <div key={cat} className="category-row">
              <div className="category-row-meta">
                <span className="category-name">{cat}</span>
                <span className="category-score">{catPassed}/{items.length} passed</span>
              </div>
              <div className="progress-bar-track small">
                <div
                  className={`progress-bar-fill ${catFailed > 0 ? 'fill--warning' : ''}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
