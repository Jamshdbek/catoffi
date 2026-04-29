/**
 * Format seconds to display time string.
 * @param {number} s - Seconds
 * @returns {string} - Formatted time (MM:SS or HH:MM:SS)
 */
export function fmt(s) {
  s = Math.max(0, Math.floor(s))
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  if (h > 0) {
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
  }
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
}

/**
 * Short format like "45m", "1h 30m", "2h"
 */
export function fmtShort(s) {
  const m = Math.floor(s / 60)
  if (m >= 60) {
    const hours = Math.floor(m / 60)
    const mins = m % 60
    return mins ? `${hours}h ${mins}m` : `${hours}h`
  }
  return `${m}m`
}

/**
 * Parse a time input string like "25:00", "1:30:00", or "25" (minutes)
 * @returns {number|NaN} - Seconds or NaN if invalid
 */
export function parseInput(str) {
  if (!str || typeof str !== 'string') return NaN
  str = str.trim()
  if (!str) return NaN

  // Just a number = minutes
  if (/^\d+$/.test(str)) {
    return parseInt(str, 10) * 60
  }

  const parts = str.split(':').map(p => parseInt(p, 10))
  if (parts.some(isNaN)) return NaN

  if (parts.length === 2) return parts[0] * 60 + parts[1]
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2]
  return NaN
}
