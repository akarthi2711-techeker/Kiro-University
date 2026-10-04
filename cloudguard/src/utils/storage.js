const STORAGE_KEY = 'cloudguard_checks'

/**
 * Load checks from LocalStorage.
 * Returns null if nothing is stored yet.
 * @returns {Array|null}
 */
export function loadChecks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return null
    return parsed
  } catch {
    return null
  }
}

/**
 * Save checks array to LocalStorage.
 * @param {Array} checks
 */
export function saveChecks(checks) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(checks))
  } catch {
    // Storage quota exceeded or private browsing – fail silently
  }
}

/**
 * Remove all CloudGuard data from LocalStorage.
 */
export function clearChecks() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // Ignore
  }
}
