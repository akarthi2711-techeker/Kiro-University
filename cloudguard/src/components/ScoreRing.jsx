import './ScoreRing.css'

/**
 * Circular SVG progress ring showing a 0–100 score.
 */
export default function ScoreRing({ score, label }) {
  const radius = 54
  const circumference = 2 * Math.PI * radius
  const progress = Math.max(0, Math.min(100, score))
  const offset = circumference - (progress / 100) * circumference

  const colorMap = {
    Good: '#22c55e',
    'Needs Attention': '#f59e0b',
    Critical: '#ef4444',
    'Not Started': '#64748b',
    'No Data': '#64748b',
  }
  const color = colorMap[label] ?? '#4f8ef7'

  return (
    <div className="score-ring">
      <svg width="140" height="140" viewBox="0 0 140 140" aria-label={`Security score: ${score} out of 100`}>
        {/* Background track */}
        <circle
          cx="70"
          cy="70"
          r={radius}
          fill="none"
          stroke="#1e293b"
          strokeWidth="12"
        />
        {/* Progress arc */}
        <circle
          cx="70"
          cy="70"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 70 70)"
          style={{ transition: 'stroke-dashoffset 0.5s ease' }}
        />
      </svg>
      <div className="score-ring-text">
        <span className="score-ring-number">{score}</span>
        <span className="score-ring-max">/100</span>
      </div>
    </div>
  )
}
