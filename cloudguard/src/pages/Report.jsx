import { useState } from 'react'
import { useChecklist } from '../context/ChecklistContext.jsx'
import ScoreRing from '../components/ScoreRing.jsx'
import { getLabelClass } from '../utils/score.js'
import './Report.css'

export default function Report() {
  const { checks, summary, resetAll } = useChecklist()
  const { score, passed, failed, pending, label } = summary
  const labelClass = getLabelClass(label)
  const [confirmReset, setConfirmReset] = useState(false)

  const failedChecks = checks.filter((c) => c.status === 'failed')
  const passedChecks = checks.filter((c) => c.status === 'passed')

  function handleReset() {
    if (confirmReset) {
      resetAll()
      setConfirmReset(false)
    } else {
      setConfirmReset(true)
    }
  }

  return (
    <div className="report-page">
      <div className="page-header">
        <h1 className="page-title">Security Report</h1>
        <p className="page-sub">Summary of your current cloud security assessment</p>
      </div>

      {/* Score summary */}
      <div className="card report-summary">
        <div className="report-score-col">
          <ScoreRing score={score} label={label} />
          <span className={`security-label security-label--${labelClass}`}>{label}</span>
        </div>
        <div className="report-stats-col">
          <h2 className="card-title">Assessment Summary</h2>
          <div className="report-stat-row">
            <span className="report-stat-icon passed-icon">✓</span>
            <span className="report-stat-text">Passed</span>
            <span className="report-stat-value">{passed}</span>
          </div>
          <div className="report-stat-row">
            <span className="report-stat-icon failed-icon">✗</span>
            <span className="report-stat-text">Failed</span>
            <span className="report-stat-value">{failed}</span>
          </div>
          <div className="report-stat-row">
            <span className="report-stat-icon pending-icon">○</span>
            <span className="report-stat-text">Pending</span>
            <span className="report-stat-value">{pending}</span>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      {failedChecks.length > 0 && (
        <div className="card recommendations">
          <h2 className="card-title recommendations-title">
            ⚠ Recommendations ({failedChecks.length})
          </h2>
          <p className="recommendations-intro">
            Address these failed checks to improve your security posture:
          </p>
          <ul className="rec-list">
            {failedChecks.map((check) => (
              <li key={check.id} className="rec-item">
                <div className="rec-item-header">
                  <span className="rec-item-icon">🔴</span>
                  <span className="rec-item-name">{check.name}</span>
                  <span className="rec-item-cat">{check.category}</span>
                </div>
                <p className="rec-item-text">{check.recommendation}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Passed checks */}
      {passedChecks.length > 0 && (
        <div className="card passed-section">
          <h2 className="card-title passed-title">✓ What You're Doing Well ({passedChecks.length})</h2>
          <ul className="passed-list">
            {passedChecks.map((check) => (
              <li key={check.id} className="passed-item">
                <span className="passed-item-icon">✓</span>
                <span className="passed-item-name">{check.name}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Empty state */}
      {failedChecks.length === 0 && passedChecks.length === 0 && (
        <div className="card empty-state">
          <p>No checks have been reviewed yet. Head to the Checklist page to get started.</p>
        </div>
      )}

      {/* All green */}
      {failedChecks.length === 0 && passedChecks.length > 0 && (
        <div className="card all-good">
          <p>🎉 All reviewed checks have passed! Keep up the great security practices.</p>
        </div>
      )}

      {/* Reset */}
      <div className="card reset-card">
        <div className="reset-card-content">
          <div>
            <h3 className="reset-title">Reset Assessment</h3>
            <p className="reset-desc">
              This will clear all check statuses and start fresh. This action cannot be undone.
            </p>
          </div>
          <div className="reset-actions">
            {confirmReset && (
              <span className="reset-confirm-text">Are you sure?</span>
            )}
            <button
              className={`btn ${confirmReset ? 'btn--danger' : 'btn--secondary'}`}
              onClick={handleReset}
            >
              {confirmReset ? 'Yes, Reset Everything' : 'Reset Assessment'}
            </button>
            {confirmReset && (
              <button className="btn btn--ghost" onClick={() => setConfirmReset(false)}>
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
