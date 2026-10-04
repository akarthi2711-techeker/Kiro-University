/**
 * Tests for src/utils/score.js
 *
 * Covers:
 *  - Unit tests for known inputs
 *  - Property-based tests (fast-check) for invariants
 */
import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import { calculateScore, getStatusLabel, getLabelClass } from '../utils/score.js'

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Build a checks array from counts of each status. */
function makeChecks({ passed = 0, failed = 0, pending = 0 }) {
  return [
    ...Array(passed).fill({ status: 'passed' }),
    ...Array(failed).fill({ status: 'failed' }),
    ...Array(pending).fill({ status: 'pending' }),
  ]
}

// ─── calculateScore: unit tests ─────────────────────────────────────────────

describe('calculateScore', () => {
  it('returns score 0 and "Not Started" when no checks are assessed', () => {
    const result = calculateScore(makeChecks({ pending: 5 }))
    expect(result.score).toBe(0)
    expect(result.label).toBe('Not Started')
  })

  it('returns score 0 and "No Data" for an empty array', () => {
    const result = calculateScore([])
    expect(result.score).toBe(0)
    expect(result.label).toBe('No Data')
  })

  it('returns score 0 and "No Data" for null/undefined input', () => {
    expect(calculateScore(null).score).toBe(0)
    expect(calculateScore(undefined).score).toBe(0)
  })

  it('returns score 100 when all checks are passed', () => {
    const result = calculateScore(makeChecks({ passed: 10 }))
    expect(result.score).toBe(100)
    expect(result.label).toBe('Good')
  })

  it('returns score 0 when all checks are failed', () => {
    const result = calculateScore(makeChecks({ failed: 10 }))
    expect(result.score).toBe(0)
    expect(result.label).toBe('Critical')
  })

  it('returns score 50 for equal passed and failed', () => {
    const result = calculateScore(makeChecks({ passed: 5, failed: 5 }))
    expect(result.score).toBe(50)
    expect(result.label).toBe('Needs Attention')
  })

  it('returns score 75 for 3 passed, 1 failed', () => {
    const result = calculateScore(makeChecks({ passed: 3, failed: 1 }))
    expect(result.score).toBe(75)
  })

  it('excludes pending checks from score calculation', () => {
    const withPending = calculateScore(makeChecks({ passed: 3, failed: 1, pending: 6 }))
    const withoutPending = calculateScore(makeChecks({ passed: 3, failed: 1 }))
    expect(withPending.score).toBe(withoutPending.score)
  })

  it('counts pending checks correctly in summary', () => {
    const result = calculateScore(makeChecks({ passed: 2, failed: 2, pending: 6 }))
    expect(result.passed).toBe(2)
    expect(result.failed).toBe(2)
    expect(result.pending).toBe(6)
  })

  it('returns score 80 boundary label "Good"', () => {
    const result = calculateScore(makeChecks({ passed: 8, failed: 2 }))
    expect(result.score).toBe(80)
    expect(result.label).toBe('Good')
  })

  it('returns "Needs Attention" at score 79', () => {
    // 79 passed out of 100 scored → 79%
    const result = calculateScore(makeChecks({ passed: 79, failed: 21 }))
    expect(result.score).toBe(79)
    expect(result.label).toBe('Needs Attention')
  })
})

// ─── calculateScore: property-based tests ───────────────────────────────────

describe('calculateScore – property-based invariants (fast-check)', () => {
  /**
   * Arbitrary: generates { passed, failed, pending } with small non-negative integers.
   */
  const countsArb = fc.record({
    passed:  fc.integer({ min: 0, max: 20 }),
    failed:  fc.integer({ min: 0, max: 20 }),
    pending: fc.integer({ min: 0, max: 20 }),
  })

  it('score is always in [0, 100]', () => {
    fc.assert(
      fc.property(countsArb, ({ passed, failed, pending }) => {
        const result = calculateScore(makeChecks({ passed, failed, pending }))
        return result.score >= 0 && result.score <= 100
      })
    )
  })

  it('all-passed checks → score = 100 (when at least one check)', () => {
    fc.assert(
      fc.property(fc.integer({ min: 1, max: 20 }), (n) => {
        const result = calculateScore(makeChecks({ passed: n }))
        return result.score === 100
      })
    )
  })

  it('all-failed checks → score = 0 (when at least one check)', () => {
    fc.assert(
      fc.property(fc.integer({ min: 1, max: 20 }), (n) => {
        const result = calculateScore(makeChecks({ failed: n }))
        return result.score === 0
      })
    )
  })

  it('only-pending checks → score = 0 and label = "Not Started"', () => {
    fc.assert(
      fc.property(fc.integer({ min: 1, max: 20 }), (n) => {
        const result = calculateScore(makeChecks({ pending: n }))
        return result.score === 0 && result.label === 'Not Started'
      })
    )
  })

  it('converting a failed check to passed never decreases the score', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 10 }),
        fc.integer({ min: 1, max: 10 }), // at least 1 failed so we can convert one
        fc.integer({ min: 0, max: 10 }),
        (passed, failed, pending) => {
          const before = calculateScore(makeChecks({ passed, failed, pending }))
          // Convert one failed → passed
          const after = calculateScore(makeChecks({ passed: passed + 1, failed: failed - 1, pending }))
          return after.score >= before.score
        }
      )
    )
  })

  it('adding a pending check does not change the score', () => {
    fc.assert(
      fc.property(countsArb, fc.integer({ min: 1, max: 10 }), (counts, extra) => {
        const before = calculateScore(makeChecks(counts))
        const after  = calculateScore(makeChecks({ ...counts, pending: counts.pending + extra }))
        return before.score === after.score
      })
    )
  })

  it('passed count + failed count + pending count = total checks', () => {
    fc.assert(
      fc.property(countsArb, ({ passed, failed, pending }) => {
        const total = passed + failed + pending
        const result = calculateScore(makeChecks({ passed, failed, pending }))
        return result.passed + result.failed + result.pending === total
      })
    )
  })
})

// ─── getStatusLabel ──────────────────────────────────────────────────────────

describe('getStatusLabel', () => {
  it('returns "Not Started" when scored = 0', () => {
    expect(getStatusLabel(0, 0)).toBe('Not Started')
  })
  it('returns "Good" for score >= 80', () => {
    expect(getStatusLabel(80, 10)).toBe('Good')
    expect(getStatusLabel(100, 10)).toBe('Good')
  })
  it('returns "Needs Attention" for 50 <= score < 80', () => {
    expect(getStatusLabel(50, 10)).toBe('Needs Attention')
    expect(getStatusLabel(79, 10)).toBe('Needs Attention')
  })
  it('returns "Critical" for score < 50', () => {
    expect(getStatusLabel(0, 10)).toBe('Critical')
    expect(getStatusLabel(49, 10)).toBe('Critical')
  })
})

// ─── getLabelClass ───────────────────────────────────────────────────────────

describe('getLabelClass', () => {
  it('maps all known labels to CSS class strings', () => {
    expect(getLabelClass('Good')).toBe('good')
    expect(getLabelClass('Needs Attention')).toBe('warning')
    expect(getLabelClass('Critical')).toBe('critical')
    expect(getLabelClass('Not Started')).toBe('neutral')
    expect(getLabelClass('No Data')).toBe('neutral')
  })

  it('returns "neutral" for unknown labels', () => {
    expect(getLabelClass('Something else')).toBe('neutral')
  })
})
