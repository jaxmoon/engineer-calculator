import type { CalculationResult } from '@/types/calculator'
import type { HistoryItem } from '@/types/history'

const STORAGE_KEY = 'calculator-history'
const MAX_HISTORY_SIZE = 100

/**
 * Service for managing calculation history with localStorage persistence
 */
export class HistoryService {
  private history: HistoryItem[] = []

  constructor() {
    this.loadFromStorage()
  }

  /**
   * Add a calculation result to history
   */
  addItem(calc: CalculationResult): HistoryItem {
    const item: HistoryItem = {
      id: this.generateId(),
      expression: calc.expression,
      result: calc.value,
      error: calc.error,
      timestamp: new Date(),
    }

    this.history.unshift(item) // Add to beginning (most recent first)

    // Limit history size
    if (this.history.length > MAX_HISTORY_SIZE) {
      this.history = this.history.slice(0, MAX_HISTORY_SIZE)
    }

    this.saveToStorage()
    return item
  }

  /**
   * Get all history items
   */
  getAll(): HistoryItem[] {
    return [...this.history]
  }

  /**
   * Get history item by ID
   */
  getById(id: string): HistoryItem | undefined {
    return this.history.find((item) => item.id === id)
  }

  /**
   * Delete history item by ID
   */
  deleteById(id: string): void {
    this.history = this.history.filter((item) => item.id !== id)
    this.saveToStorage()
  }

  /**
   * Clear all history
   */
  clear(): void {
    this.history = []
    this.saveToStorage()
  }

  /**
   * Search history by expression
   */
  search(query: string): HistoryItem[] {
    const lowerQuery = query.toLowerCase()
    return this.history.filter((item) =>
      item.expression.toLowerCase().includes(lowerQuery)
    )
  }

  /**
   * Get most recent N items
   */
  getRecent(count: number): HistoryItem[] {
    return this.history.slice(0, count)
  }

  /**
   * Generate unique ID for history item
   */
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Load history from localStorage
   */
  private loadFromStorage(): void {
    if (typeof window === 'undefined') return

    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        // Convert timestamp strings back to Date objects
        this.history = parsed.map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp),
        }))
      }
    } catch (error) {
      console.error('Failed to load history from localStorage:', error)
      this.history = []
    }
  }

  /**
   * Save history to localStorage
   */
  private saveToStorage(): void {
    if (typeof window === 'undefined') return

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.history))
    } catch (error) {
      console.error('Failed to save history to localStorage:', error)
      // Handle quota exceeded error
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        // Remove oldest items and try again
        this.history = this.history.slice(0, Math.floor(MAX_HISTORY_SIZE / 2))
        this.saveToStorage()
      }
    }
  }
}
