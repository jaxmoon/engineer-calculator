/**
 * Store configuration constants
 */

/**
 * LocalStorage key for calculator state persistence
 */
export const STORAGE_KEY = 'calculator-storage'

/**
 * Maximum number of history items to keep in memory
 */
export const MAX_HISTORY_SIZE = 100

/**
 * Fields to persist in localStorage
 */
export const PERSISTED_FIELDS = ['angleMode', 'memory', 'history'] as const
