/**
 * Angle mode for trigonometric calculations
 */
export type AngleMode = 'deg' | 'rad' | 'grad'

/**
 * Operation types supported by the calculator
 */
export type Operation =
  | 'add'
  | 'subtract'
  | 'multiply'
  | 'divide'
  | 'power'
  | 'root'
  | 'sqrt'
  | 'sin'
  | 'cos'
  | 'tan'
  | 'asin'
  | 'acos'
  | 'atan'
  | 'log'
  | 'ln'
  | 'exp'
  | 'factorial'
  | 'abs'
  | 'negate'
  | 'inverse'
  | 'percent'

/**
 * Result of a calculation
 */
export interface CalculationResult {
  value: number | string
  expression: string
  error?: string
}

/**
 * Calculator state
 */
export interface CalculatorState {
  display: string
  expression: string
  angleMode: AngleMode
  memory: number
  lastResult: number | null
  history: CalculationResult[]
}

/**
 * Validation error
 */
export interface ValidationError {
  valid: false
  error: string
}

/**
 * Validation success
 */
export interface ValidationSuccess {
  valid: true
}

export type ValidationResult = ValidationSuccess | ValidationError
