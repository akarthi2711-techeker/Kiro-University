import { STATUS } from '../data/checks.js'

/**
 * Calculate the security score and summary counts from an array of checks.
 *
 * Score rules:
 *  - Each PASSED check contributes equally toward 100 points.
 *  - FAILED checks count against the score.
 *  - PENDING checks are neutral (not counted either way).
 *
 * Formula:
 *   scored = passed + failed  (checks that have been evaluated)
 *   score  = scored === 0 ? 0 : Math.round((passed / scored) * 100)
 *
 * This keeps the score honest: it reflects only what has been assessed.
 *
 * @param {Array<{status: string}>} checks
 * @returns {{ score: number, passed: number, failed: number, pending: number, label: string }}
 */
export function calculateScore(checks) {
  if (!Array.isArray(checks) || checks.length === 0) {
    return { score: 0, passed: 0, failed: 0, pending: 0, label: 'No Data' }
  }

  const passed = checks.filter((c) => c.status === STATUS.PASSED).length
  const failed = checks.filter((c) => c.status === STATUS.FAILED).length
  const pending = checks.filter((c) => c.status === STATUS.PENDING).length

  const scored = passed + failed
  const score = scored === 0 ? 0 : Math.round((passed / scored) * 100)

  const label = getStatusLabel(score, scored)

  return { score, passed, failed, pending, label }
}

/**
 * Map a numeric score to a human-readable status label.
 * @param {number} score  0–100
 * @param {number} scored number of checks actually assessed
 * @returns {string}
 */
export function getStatusLabel(score, scored) {
  if (scored === 0) return 'Not Started'
  if (score >= 80) return 'Good'
  if (score >= 50) return 'Needs Attention'
  return 'Critical'
}

/**
 * Returns the CSS class modifier for a status label.
 * @param {string} label
 * @returns {string}
 */
export function getLabelClass(label) {
  const map = {
    Good: 'good',
    'Needs Attention': 'warning',
    Critical: 'critical',
    'Not Started': 'neutral',
    'No Data': 'neutral',
  }
  return map[label] ?? 'neutral'
}
