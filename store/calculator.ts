import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { CalculatorEngine } from '@/lib/calculator/engine'
import type { AngleMode, CalculatorState, CalculationResult } from '@/types/calculator'
import { STORAGE_KEY, MAX_HISTORY_SIZE } from './constants'

/**
 * Calculator store actions
 */
interface CalculatorActions {
  // Display management
  setDisplay: (value: string) => void
  appendToDisplay: (value: string) => void
  clear: () => void
  backspace: () => void

  // Expression management
  setExpression: (expression: string) => void
  appendOperator: (operator: string) => void

  // Angle mode
  setAngleMode: (mode: AngleMode) => void

  // Memory operations
  memoryStore: (value: number) => void
  memoryRecall: () => void
  memoryAdd: (value: number) => void
  memorySubtract: (value: number) => void
  memoryClear: () => void

  // Calculation
  calculate: () => void

  // History
  clearHistory: () => void

  // Reset
  reset: () => void
}

/**
 * Complete calculator store type
 */
type CalculatorStore = CalculatorState & CalculatorActions

/**
 * Initial state for the calculator
 */
const initialState: CalculatorState = {
  display: '0',
  expression: '',
  angleMode: 'deg',
  memory: 0,
  lastResult: null,
  history: [],
}

/**
 * Calculator engine instance (shared across store)
 */
let calculatorEngine: CalculatorEngine | null = null

/**
 * Get or create calculator engine instance
 * @returns Singleton calculator engine
 */
const getEngine = (): CalculatorEngine => {
  if (!calculatorEngine) {
    calculatorEngine = new CalculatorEngine()
  }
  return calculatorEngine
}

/**
 * Check if we're running in a browser environment
 * Used for SSR safety
 */
const isBrowser = typeof window !== 'undefined'

/**
 * Builds the full expression from current state
 * @param expression - Current expression
 * @param display - Current display value
 * @returns Complete expression to evaluate
 */
const buildFullExpression = (expression: string, display: string): string => {
  return expression ? `${expression}${display}` : display
}

/**
 * Creates a successful calculation history entry
 * @param expression - The evaluated expression
 * @param result - The numerical result
 * @returns History entry
 */
const createSuccessHistoryEntry = (
  expression: string,
  result: number
): CalculationResult => ({
  value: result,
  expression,
})

/**
 * Creates an error calculation history entry
 * @param expression - The evaluated expression
 * @param errorMessage - The error message
 * @returns History entry with error
 */
const createErrorHistoryEntry = (
  expression: string,
  errorMessage: string
): CalculationResult => ({
  value: 'Error',
  expression,
  error: errorMessage,
})

/**
 * Calculator store using Zustand with persistence
 */
export const useCalculatorStore = create<CalculatorStore>()(
  persist(
    (set, get) => ({
      // Initial state
      ...initialState,

      // Display management
      setDisplay: (value: string) => {
        set({ display: value })
      },

      appendToDisplay: (value: string) => {
        const { display } = get()

        // Handle initial zero
        if (display === '0' && value !== '.') {
          set({ display: value })
          return
        }

        // Prevent multiple decimal points
        if (value === '.' && display.includes('.')) {
          return
        }

        set({ display: display + value })
      },

      clear: () => {
        set({
          display: '0',
          expression: '',
        })
      },

      backspace: () => {
        const { display } = get()

        if (display.length <= 1) {
          set({ display: '0' })
        } else {
          set({ display: display.slice(0, -1) })
        }
      },

      // Expression management
      setExpression: (expression: string) => {
        set({ expression })
      },

      appendOperator: (operator: string) => {
        const { display, expression } = get()

        // Add current display to expression if not already there
        const newExpression = expression
          ? `${expression} ${operator} `
          : `${display} ${operator} `

        set({
          expression: newExpression,
          display: '0',
        })
      },

      // Angle mode
      setAngleMode: (mode: AngleMode) => {
        const engine = getEngine()
        engine.setAngleMode(mode)
        set({ angleMode: mode })
      },

      // Memory operations
      memoryStore: (value: number) => {
        set({ memory: value })
      },

      memoryRecall: () => {
        const { memory } = get()
        set({ display: memory.toString() })
      },

      memoryAdd: (value: number) => {
        const { memory } = get()
        set({ memory: memory + value })
      },

      memorySubtract: (value: number) => {
        const { memory } = get()
        set({ memory: memory - value })
      },

      memoryClear: () => {
        set({ memory: 0 })
      },

      // Calculation
      calculate: () => {
        const { expression, display, history } = get()
        const engine = getEngine()

        // Build full expression
        const fullExpression = buildFullExpression(expression, display)

        try {
          // Evaluate expression
          const result = engine.evaluate(fullExpression)
          const formattedResult = engine.formatResult(result)

          // Create history entry
          const historyEntry = createSuccessHistoryEntry(fullExpression, result)

          // Add to history (limit size)
          const newHistory = [historyEntry, ...history].slice(0, MAX_HISTORY_SIZE)

          // Update state
          set({
            display: formattedResult,
            expression: '',
            lastResult: result,
            history: newHistory,
          })
        } catch (error) {
          // Handle calculation errors
          const errorMessage = error instanceof Error ? error.message : 'Unknown error'

          // Create error history entry
          const historyEntry = createErrorHistoryEntry(fullExpression, errorMessage)

          // Add to history
          const newHistory = [historyEntry, ...history].slice(0, MAX_HISTORY_SIZE)

          set({
            display: 'Error',
            expression: '',
            history: newHistory,
          })
        }
      },

      // History
      clearHistory: () => {
        set({ history: [] })
      },

      // Reset
      reset: () => {
        const { history } = get()
        set({
          ...initialState,
          history, // Preserve history on reset
        })
      },
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => (isBrowser ? localStorage : ({} as any))),
      // Only persist specific fields to localStorage
      partialize: (state) => ({
        angleMode: state.angleMode,
        memory: state.memory,
        history: state.history,
      }),
    }
  )
)
