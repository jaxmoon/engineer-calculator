import { StatisticsCalculator } from '@/lib/calculator/statistics'
import type { HistoryItem } from '@/types/history'

describe('StatisticsCalculator', () => {
  let calculator: StatisticsCalculator

  beforeEach(() => {
    calculator = new StatisticsCalculator()
  })

  const createHistoryItem = (expression: string, result: number): HistoryItem => ({
    id: Math.random().toString(),
    expression,
    result,
    timestamp: new Date(),
  })

  describe('calculate', () => {
    it('should return zero statistics for empty history', () => {
      const stats = calculator.calculate([])

      expect(stats.count).toBe(0)
      expect(stats.sum).toBe(0)
      expect(stats.average).toBe(0)
      expect(stats.min).toBe(0)
      expect(stats.max).toBe(0)
      expect(stats.median).toBe(0)
    })

    it('should calculate count', () => {
      const history = [
        createHistoryItem('1 + 1', 2),
        createHistoryItem('2 + 2', 4),
        createHistoryItem('3 + 3', 6),
      ]

      const stats = calculator.calculate(history)
      expect(stats.count).toBe(3)
    })

    it('should calculate sum', () => {
      const history = [
        createHistoryItem('1 + 1', 2),
        createHistoryItem('2 + 2', 4),
        createHistoryItem('3 + 3', 6),
      ]

      const stats = calculator.calculate(history)
      expect(stats.sum).toBe(12)
    })

    it('should calculate average', () => {
      const history = [
        createHistoryItem('1 + 1', 2),
        createHistoryItem('2 + 2', 4),
        createHistoryItem('3 + 3', 6),
      ]

      const stats = calculator.calculate(history)
      expect(stats.average).toBe(4)
    })

    it('should find minimum', () => {
      const history = [
        createHistoryItem('10 - 5', 5),
        createHistoryItem('20 - 5', 15),
        createHistoryItem('5 - 3', 2),
      ]

      const stats = calculator.calculate(history)
      expect(stats.min).toBe(2)
    })

    it('should find maximum', () => {
      const history = [
        createHistoryItem('10 - 5', 5),
        createHistoryItem('20 - 5', 15),
        createHistoryItem('5 - 3', 2),
      ]

      const stats = calculator.calculate(history)
      expect(stats.max).toBe(15)
    })

    it('should calculate median for odd count', () => {
      const history = [
        createHistoryItem('1', 1),
        createHistoryItem('2', 2),
        createHistoryItem('3', 3),
        createHistoryItem('4', 4),
        createHistoryItem('5', 5),
      ]

      const stats = calculator.calculate(history)
      expect(stats.median).toBe(3)
    })

    it('should calculate median for even count', () => {
      const history = [
        createHistoryItem('1', 1),
        createHistoryItem('2', 2),
        createHistoryItem('3', 3),
        createHistoryItem('4', 4),
      ]

      const stats = calculator.calculate(history)
      expect(stats.median).toBe(2.5)
    })

    it('should handle single item', () => {
      const history = [createHistoryItem('42', 42)]

      const stats = calculator.calculate(history)
      expect(stats.count).toBe(1)
      expect(stats.sum).toBe(42)
      expect(stats.average).toBe(42)
      expect(stats.min).toBe(42)
      expect(stats.max).toBe(42)
      expect(stats.median).toBe(42)
    })

    it('should handle negative numbers', () => {
      const history = [
        createHistoryItem('-5', -5),
        createHistoryItem('10', 10),
        createHistoryItem('-3', -3),
      ]

      const stats = calculator.calculate(history)
      expect(stats.sum).toBe(2)
      expect(stats.min).toBe(-5)
      expect(stats.max).toBe(10)
    })

    it('should handle decimal numbers', () => {
      const history = [
        createHistoryItem('1.5', 1.5),
        createHistoryItem('2.5', 2.5),
        createHistoryItem('3.5', 3.5),
      ]

      const stats = calculator.calculate(history)
      expect(stats.sum).toBe(7.5)
      expect(stats.average).toBe(2.5)
    })

    it('should skip error results', () => {
      const history: HistoryItem[] = [
        createHistoryItem('2 + 2', 4),
        {
          id: '3',
          expression: '1 / 0',
          result: 'Error',
          error: 'Division by zero',
          timestamp: new Date(),
        },
        createHistoryItem('3 + 3', 6),
      ]

      const stats = calculator.calculate(history)
      expect(stats.count).toBe(2) // Should skip error
      expect(stats.sum).toBe(10)
    })

    it('should handle large numbers', () => {
      const history = [
        createHistoryItem('1000000', 1000000),
        createHistoryItem('2000000', 2000000),
      ]

      const stats = calculator.calculate(history)
      expect(stats.sum).toBe(3000000)
      expect(stats.average).toBe(1500000)
    })
  })

  describe('calculateFor Period', () => {
    it('should filter by date range', () => {
      const now = new Date()
      const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000)
      const twoDaysAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000)

      const history: HistoryItem[] = [
        { ...createHistoryItem('1', 1), timestamp: now },
        { ...createHistoryItem('2', 2), timestamp: yesterday },
        { ...createHistoryItem('3', 3), timestamp: twoDaysAgo },
      ]

      const stats = calculator.calculateForPeriod(history, yesterday, now)
      expect(stats.count).toBe(2) // Should include yesterday and today
    })
  })
})
