import { HistoryService } from '@/lib/storage/history'
import type { CalculationResult } from '@/types/calculator'

describe('HistoryService', () => {
  let service: HistoryService

  beforeEach(() => {
    // Clear localStorage BEFORE creating service
    localStorage.clear()
    service = new HistoryService()
  })

  describe('addItem', () => {
    it('should add item to history', () => {
      const calc: CalculationResult = {
        expression: '2 + 3',
        value: 5,
      }

      const item = service.addItem(calc)

      expect(item.id).toBeDefined()
      expect(item.expression).toBe('2 + 3')
      expect(item.result).toBe(5)
      expect(item.timestamp).toBeInstanceOf(Date)
    })

    it('should generate unique IDs', () => {
      const calc1: CalculationResult = { expression: '2 + 2', value: 4 }
      const calc2: CalculationResult = { expression: '3 + 3', value: 6 }

      const item1 = service.addItem(calc1)
      const item2 = service.addItem(calc2)

      expect(item1.id).not.toBe(item2.id)
    })

    it('should handle error calculations', () => {
      const calc: CalculationResult = {
        expression: '1 / 0',
        value: 'Error',
        error: 'Division by zero',
      }

      const item = service.addItem(calc)

      expect(item.error).toBe('Division by zero')
      expect(item.result).toBe('Error')
    })
  })

  describe('getAll', () => {
    it('should return empty array initially', () => {
      expect(service.getAll()).toEqual([])
    })

    it('should return all history items', () => {
      service.addItem({ expression: '1 + 1', value: 2 })
      service.addItem({ expression: '2 + 2', value: 4 })

      const history = service.getAll()
      expect(history).toHaveLength(2)
    })

    it('should return items in reverse chronological order', () => {
      const item1 = service.addItem({ expression: '1 + 1', value: 2 })
      const item2 = service.addItem({ expression: '2 + 2', value: 4 })

      const history = service.getAll()
      expect(history[0].id).toBe(item2.id) // Most recent first
      expect(history[1].id).toBe(item1.id)
    })
  })

  describe('getById', () => {
    it('should return item by ID', () => {
      const item = service.addItem({ expression: '5 + 5', value: 10 })

      const found = service.getById(item.id)
      expect(found).toBeDefined()
      expect(found?.expression).toBe('5 + 5')
    })

    it('should return undefined for non-existent ID', () => {
      const found = service.getById('non-existent')
      expect(found).toBeUndefined()
    })
  })

  describe('deleteById', () => {
    it('should delete item by ID', () => {
      const item = service.addItem({ expression: '3 + 3', value: 6 })

      service.deleteById(item.id)

      expect(service.getById(item.id)).toBeUndefined()
      expect(service.getAll()).toHaveLength(0)
    })

    it('should not error when deleting non-existent ID', () => {
      expect(() => service.deleteById('non-existent')).not.toThrow()
    })
  })

  describe('clear', () => {
    it('should clear all history', () => {
      service.addItem({ expression: '1 + 1', value: 2 })
      service.addItem({ expression: '2 + 2', value: 4 })

      service.clear()

      expect(service.getAll()).toEqual([])
    })
  })

  describe('persistence', () => {
    it('should persist to localStorage', () => {
      service.addItem({ expression: '7 + 7', value: 14 })

      // Create new instance to test persistence
      const newService = new HistoryService()
      const history = newService.getAll()

      expect(history).toHaveLength(1)
      expect(history[0].expression).toBe('7 + 7')
    })

    it('should handle corrupted localStorage data', () => {
      localStorage.setItem('calculator-history', 'invalid json')

      // Should not throw and return empty array
      const newService = new HistoryService()
      expect(newService.getAll()).toEqual([])
    })
  })

  describe('quota management', () => {
    it('should limit history size to max items', () => {
      // Add more than max items (assume max is 100)
      for (let i = 0; i < 105; i++) {
        service.addItem({ expression: `${i} + 1`, value: i + 1 })
      }

      const history = service.getAll()
      expect(history.length).toBeLessThanOrEqual(100)
    })
  })

  describe('search', () => {
    it('should search by expression', () => {
      service.addItem({ expression: '2 + 2', value: 4 })
      service.addItem({ expression: '3 * 3', value: 9 })
      service.addItem({ expression: '2 + 3', value: 5 })

      const results = service.search('2 +')
      expect(results).toHaveLength(2)
    })

    it('should return empty array when no matches', () => {
      service.addItem({ expression: '1 + 1', value: 2 })

      const results = service.search('xyz')
      expect(results).toEqual([])
    })
  })

  describe('getRecent', () => {
    it('should return most recent N items', () => {
      for (let i = 0; i < 10; i++) {
        service.addItem({ expression: `${i} + 1`, value: i + 1 })
      }

      const recent = service.getRecent(5)
      expect(recent).toHaveLength(5)
    })

    it('should return all items if N is greater than count', () => {
      service.addItem({ expression: '1 + 1', value: 2 })
      service.addItem({ expression: '2 + 2', value: 4 })

      const recent = service.getRecent(10)
      expect(recent).toHaveLength(2)
    })
  })
})
