/**
 * Tests for src/utils/storage.js
 *
 * localStorage is provided by jsdom (configured in vite.config.js)
 * and reset before each test by src/test/setup.js.
 */
import { describe, it, expect, vi } from 'vitest'
import { loadChecks, saveChecks, clearChecks } from '../utils/storage.js'

// ─── loadChecks ──────────────────────────────────────────────────────────────

describe('loadChecks', () => {
  it('returns null when localStorage is empty', () => {
    expect(loadChecks()).toBeNull()
  })

  it('returns the stored array after saving', () => {
    const checks = [{ id: 'mfa', status: 'passed' }]
    saveChecks(checks)
    expect(loadChecks()).toEqual(checks)
  })

  it('returns null when stored value is not valid JSON', () => {
    localStorage.setItem('cloudguard_checks', 'not-json{{{')
    expect(loadChecks()).toBeNull()
  })

  it('returns null when stored value is a JSON object (not array)', () => {
    localStorage.setItem('cloudguard_checks', JSON.stringify({ id: 'mfa' }))
    expect(loadChecks()).toBeNull()
  })

  it('returns null when stored value is a JSON number', () => {
    localStorage.setItem('cloudguard_checks', '42')
    expect(loadChecks()).toBeNull()
  })

  it('returns null when stored value is null JSON', () => {
    localStorage.setItem('cloudguard_checks', 'null')
    expect(loadChecks()).toBeNull()
  })

  it('returns an empty array when an empty array is stored', () => {
    saveChecks([])
    expect(loadChecks()).toEqual([])
  })

  it('round-trips multiple checks correctly', () => {
    const checks = [
      { id: 'mfa', status: 'passed' },
      { id: 'root-account', status: 'failed' },
      { id: 'encryption', status: 'pending' },
    ]
    saveChecks(checks)
    expect(loadChecks()).toEqual(checks)
  })
})

// ─── saveChecks ──────────────────────────────────────────────────────────────

describe('saveChecks', () => {
  it('stores JSON string under the correct key', () => {
    const checks = [{ id: 'mfa', status: 'passed' }]
    saveChecks(checks)
    const raw = localStorage.getItem('cloudguard_checks')
    expect(raw).toBe(JSON.stringify(checks))
  })

  it('overwrites previously saved data', () => {
    saveChecks([{ id: 'mfa', status: 'passed' }])
    saveChecks([{ id: 'mfa', status: 'failed' }])
    expect(loadChecks()).toEqual([{ id: 'mfa', status: 'failed' }])
  })

  it('handles localStorage quota errors silently', () => {
    // Simulate a full localStorage by making setItem throw
    vi.spyOn(Storage.prototype, 'setItem').mockImplementationOnce(() => {
      throw new DOMException('QuotaExceededError')
    })
    // Should not throw
    expect(() => saveChecks([{ id: 'mfa', status: 'passed' }])).not.toThrow()
  })
})

// ─── clearChecks ─────────────────────────────────────────────────────────────

describe('clearChecks', () => {
  it('removes the cloudguard_checks key from localStorage', () => {
    saveChecks([{ id: 'mfa', status: 'passed' }])
    clearChecks()
    expect(localStorage.getItem('cloudguard_checks')).toBeNull()
  })

  it('does not throw when called on empty localStorage', () => {
    expect(() => clearChecks()).not.toThrow()
  })

  it('results in loadChecks returning null after clearing', () => {
    saveChecks([{ id: 'mfa', status: 'passed' }])
    clearChecks()
    expect(loadChecks()).toBeNull()
  })

  it('does not remove unrelated localStorage keys', () => {
    localStorage.setItem('other_app_key', 'some-value')
    saveChecks([{ id: 'mfa', status: 'passed' }])
    clearChecks()
    expect(localStorage.getItem('other_app_key')).toBe('some-value')
  })
})
