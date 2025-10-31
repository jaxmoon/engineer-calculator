/**
 * History item representing a single calculation
 */
export interface HistoryItem {
  id: string
  expression: string
  result: number | string
  error?: string
  timestamp: Date
}

/**
 * Statistics calculated from history
 */
export interface Statistics {
  count: number
  sum: number
  average: number
  min: number
  max: number
  median: number
}
