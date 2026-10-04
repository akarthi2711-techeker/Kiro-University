import { createContext, useContext, useEffect, useState } from 'react'
import { DEFAULT_CHECKS, STATUS } from '../data/checks.js'
import { loadChecks, saveChecks, clearChecks } from '../utils/storage.js'
import { calculateScore } from '../utils/score.js'

const ChecklistContext = createContext(null)

/**
 * Merge saved statuses onto the canonical DEFAULT_CHECKS list.
 * This ensures new checks are always shown even if localStorage is stale.
 */
function mergeWithDefaults(savedChecks) {
  const savedMap = Object.fromEntries(savedChecks.map((c) => [c.id, c.status]))
  return DEFAULT_CHECKS.map((check) => ({
    ...check,
    status: savedMap[check.id] ?? STATUS.PENDING,
  }))
}

export function ChecklistProvider({ children }) {
  const [checks, setChecks] = useState(() => {
    const saved = loadChecks()
    if (saved) return mergeWithDefaults(saved)
    return DEFAULT_CHECKS.map((c) => ({ ...c, status: STATUS.PENDING }))
  })

  // Persist to localStorage whenever checks change
  useEffect(() => {
    saveChecks(checks)
  }, [checks])

  /**
   * Update the status of a single check by id.
   * @param {string} id
   * @param {string} newStatus  – one of STATUS.*
   */
  function updateStatus(id, newStatus) {
    setChecks((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
    )
  }

  /**
   * Reset all checks back to pending and clear localStorage.
   */
  function resetAll() {
    const fresh = DEFAULT_CHECKS.map((c) => ({ ...c, status: STATUS.PENDING }))
    clearChecks()
    setChecks(fresh)
  }

  const summary = calculateScore(checks)

  return (
    <ChecklistContext.Provider value={{ checks, summary, updateStatus, resetAll }}>
      {children}
    </ChecklistContext.Provider>
  )
}

export function useChecklist() {
  const ctx = useContext(ChecklistContext)
  if (!ctx) throw new Error('useChecklist must be used inside ChecklistProvider')
  return ctx
}
