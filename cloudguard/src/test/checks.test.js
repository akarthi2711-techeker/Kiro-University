/**
 * Data integrity tests for src/data/checks.js
 *
 * These tests ensure the static checklist data is well-formed.
 * They act as a contract: if someone edits checks.js, these tests
 * immediately catch structural regressions.
 */
import { describe, it, expect } from 'vitest'
import * as fc from 'fast-check'
import { DEFAULT_CHECKS, STATUS } from '../data/checks.js'

const VALID_CATEGORIES = ['Identity', 'Data', 'Network', 'Visibility', 'Resilience']
const VALID_STATUSES   = ['pending', 'passed', 'failed']

describe('DEFAULT_CHECKS data integrity', () => {
  it('contains exactly 10 checks', () => {
    expect(DEFAULT_CHECKS).toHaveLength(10)
  })

  it('every check has a non-empty string id', () => {
    for (const check of DEFAULT_CHECKS) {
      expect(typeof check.id).toBe('string')
      expect(check.id.trim().length).toBeGreaterThan(0)
    }
  })

  it('all check ids are unique', () => {
    const ids = DEFAULT_CHECKS.map((c) => c.id)
    const unique = new Set(ids)
    expect(unique.size).toBe(ids.length)
  })

  it('all check ids are kebab-case (lowercase letters and hyphens only)', () => {
    for (const check of DEFAULT_CHECKS) {
      expect(check.id).toMatch(/^[a-z][a-z0-9-]*$/)
    }
  })

  it('every check has a non-empty name', () => {
    for (const check of DEFAULT_CHECKS) {
      expect(typeof check.name).toBe('string')
      expect(check.name.trim().length).toBeGreaterThan(0)
    }
  })

  it('every check has a non-empty explanation (at least 20 chars)', () => {
    for (const check of DEFAULT_CHECKS) {
      expect(typeof check.explanation).toBe('string')
      expect(check.explanation.trim().length).toBeGreaterThanOrEqual(20)
    }
  })

  it('every check has a non-empty recommendation (at least 20 chars)', () => {
    for (const check of DEFAULT_CHECKS) {
      expect(typeof check.recommendation).toBe('string')
      expect(check.recommendation.trim().length).toBeGreaterThanOrEqual(20)
    }
  })

  it('every check belongs to a valid category', () => {
    for (const check of DEFAULT_CHECKS) {
      expect(VALID_CATEGORIES).toContain(check.category)
    }
  })

  it('all five categories are represented at least once', () => {
    const usedCategories = new Set(DEFAULT_CHECKS.map((c) => c.category))
    for (const cat of VALID_CATEGORIES) {
      expect(usedCategories.has(cat)).toBe(true)
    }
  })

  it('check objects do not have a status property (status is runtime-only)', () => {
    for (const check of DEFAULT_CHECKS) {
      expect(check).not.toHaveProperty('status')
    }
  })

  it('every check that has an awsExample has a non-empty string value (at least 20 chars)', () => {
    for (const check of DEFAULT_CHECKS) {
      if ('awsExample' in check) {
        expect(typeof check.awsExample).toBe('string')
        expect(check.awsExample.trim().length).toBeGreaterThanOrEqual(20)
      }
    }
  })

  it('all 10 checks include an awsExample field', () => {
    const withExample = DEFAULT_CHECKS.filter((c) => c.awsExample && c.awsExample.trim().length > 0)
    expect(withExample).toHaveLength(10)
  })
})

describe('STATUS constants', () => {
  it('defines exactly three valid statuses', () => {
    const values = Object.values(STATUS)
    expect(values).toHaveLength(3)
    expect(values).toContain('pending')
    expect(values).toContain('passed')
    expect(values).toContain('failed')
  })

  it('STATUS values match the expected string literals', () => {
    expect(STATUS.PENDING).toBe('pending')
    expect(STATUS.PASSED).toBe('passed')
    expect(STATUS.FAILED).toBe('failed')
  })
})

// ─── Property-based: checks are well-formed ─────────────────────────────────

describe('DEFAULT_CHECKS – property-based structure verification', () => {
  it('every check satisfies all required field constraints', () => {
    // For each check, verify it against the full schema using fast-check's
    // modelRun pattern — we test the property "for all checks, constraints hold"
    fc.assert(
      fc.property(
        fc.constantFrom(...DEFAULT_CHECKS),
        (check) => {
          const hasId       = typeof check.id === 'string' && check.id.length > 0
          const hasName     = typeof check.name === 'string' && check.name.length > 0
          const hasExpl     = typeof check.explanation === 'string' && check.explanation.length >= 20
          const hasRec      = typeof check.recommendation === 'string' && check.recommendation.length >= 20
          const validCat    = VALID_CATEGORIES.includes(check.category)
          const noStatus    = !('status' in check)
          const validAws    = !('awsExample' in check) ||
            (typeof check.awsExample === 'string' && check.awsExample.trim().length >= 20)
          return hasId && hasName && hasExpl && hasRec && validCat && noStatus && validAws
        }
      )
    )
  })
})
