import type { HistoryItem } from '@/types/history'
import type { Statistics } from '@/types/history'

/**
 * Calculator for computing statistics from history
 */
export class StatisticsCalculator {
  /**
   * Calculate statistics from history items
   */
  calculate(history: HistoryItem[]): Statistics {
    // Filter out error results and convert to numbers
    const numbers = history
      .filter((item) => typeof item.result === 'number')
      .map((item) => item.result as number)

    if (numbers.length === 0) {
      return {
        count: 0,
        sum: 0,
        average: 0,
        min: 0,
        max: 0,
        median: 0,
      }
    }

    const count = numbers.length
    const sum = numbers.reduce((acc, n) => acc + n, 0)
    const average = sum / count
    const min = Math.min(...numbers)
    const max = Math.max(...numbers)
    const median = this.calculateMedian(numbers)

    return {
      count,
      sum,
      average,
      min,
      max,
      median,
    }
  }

  /**
   * Calculate statistics for a specific time period
   */
  calculateForPeriod(history: HistoryItem[], startDate: Date, endDate: Date): Statistics {
    const filtered = history.filter((item) => {
      const timestamp = item.timestamp.getTime()
      return timestamp >= startDate.getTime() && timestamp <= endDate.getTime()
    })

    return this.calculate(filtered)
  }

  /**
   * Calculate median value
   */
  private calculateMedian(numbers: number[]): number {
    if (numbers.length === 0) return 0

    const sorted = [...numbers].sort((a, b) => a - b)
    const mid = Math.floor(sorted.length / 2)

    if (sorted.length % 2 === 0) {
      // Even count: average of two middle values
      return (sorted[mid - 1] + sorted[mid]) / 2
    } else {
      // Odd count: middle value
      return sorted[mid]
    }
  }
}
