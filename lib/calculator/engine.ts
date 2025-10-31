import { create, all, MathJsInstance, ConfigOptions } from 'mathjs'
import type { AngleMode } from '@/types/calculator'
import { validateExpression, sanitizeExpression } from './validation'
import { ANGLE_CONVERSION, DISPLAY_THRESHOLDS, ERROR_MESSAGES } from './constants'

/**
 * Calculator Engine using Math.js
 * Handles mathematical expressions and angle mode conversions
 */
export class CalculatorEngine {
  private math: MathJsInstance
  private angleMode: AngleMode = 'deg'

  constructor() {
    // Create a math.js instance with all functions
    this.math = create(all, {
      number: 'BigNumber',
      precision: 64,
    } as ConfigOptions)
  }

  /**
   * Sets the angle mode for trigonometric functions
   * @param mode - Angle mode ('deg', 'rad', 'grad')
   */
  public setAngleMode(mode: AngleMode): void {
    this.angleMode = mode
  }

  /**
   * Gets the current angle mode
   * @returns Current angle mode
   */
  public getAngleMode(): AngleMode {
    return this.angleMode
  }

  /**
   * Evaluates a mathematical expression
   * @param expression - Mathematical expression to evaluate
   * @returns Evaluated result as a number
   * @throws Error if expression is invalid
   */
  public evaluate(expression: string): number {
    // Validate expression
    const validation = validateExpression(expression)
    if (!validation.valid) {
      throw new Error(validation.error)
    }

    // Sanitize expression
    const sanitized = sanitizeExpression(expression)

    try {
      // Create scope with angle-mode-aware trig functions
      const scope = this.createTrigScope()

      // Evaluate using math.js with custom scope
      const result = this.math.evaluate(sanitized, scope)

      // Convert result to number
      const numResult = typeof result === 'number' ? result : Number(result.toString())

      // Check for invalid results
      if (isNaN(numResult)) {
        throw new Error(ERROR_MESSAGES.NOT_A_NUMBER)
      }

      if (!isFinite(numResult)) {
        throw new Error(ERROR_MESSAGES.INFINITE_RESULT)
      }

      return numResult
    } catch (error) {
      if (error instanceof Error) {
        // Provide more user-friendly error messages
        throw this.translateError(error)
      }
      throw new Error(ERROR_MESSAGES.UNKNOWN_ERROR)
    }
  }

  /**
   * Formats a number result for display
   * @param value - Number to format
   * @returns Formatted string
   */
  public formatResult(value: number): string {
    // Handle special cases
    if (value === 0) return '0'
    if (isNaN(value)) return 'Error'
    if (!isFinite(value)) return 'Infinity'

    const abs = Math.abs(value)

    // Use scientific notation for very large or very small numbers
    if (
      abs > DISPLAY_THRESHOLDS.SCIENTIFIC_NOTATION_LARGE ||
      (abs < DISPLAY_THRESHOLDS.SCIENTIFIC_NOTATION_SMALL && abs > 0)
    ) {
      return value.toExponential()
    }

    // Remove unnecessary trailing zeros
    const str = value.toString()
    return str
  }

  /**
   * Creates a scope with angle-mode-aware trigonometric functions
   * @returns Scope object with custom trig functions
   */
  private createTrigScope(): Record<string, any> {
    const toRad = this.getToRadiansFactor()
    const fromRad = this.getFromRadiansFactor()
    const fromRadBig = this.math.bignumber(fromRad)

    return {
      // Forward trig functions (take angle as input)
      sin: (x: number) => this.math.sin(x * toRad),
      cos: (x: number) => this.math.cos(x * toRad),
      tan: (x: number) => this.math.tan(x * toRad),

      // Inverse trig functions (return angle)
      asin: (x: number) => this.math.multiply(this.math.asin(x), fromRadBig),
      acos: (x: number) => this.math.multiply(this.math.acos(x), fromRadBig),
      atan: (x: number) => this.math.multiply(this.math.atan(x), fromRadBig),
    }
  }

  /**
   * Gets conversion factor from current angle mode to radians
   * @returns Conversion factor
   */
  private getToRadiansFactor(): number {
    switch (this.angleMode) {
      case 'rad':
        return 1
      case 'deg':
        return ANGLE_CONVERSION.DEG_TO_RAD
      case 'grad':
        return ANGLE_CONVERSION.GRAD_TO_RAD
      default:
        return ANGLE_CONVERSION.DEG_TO_RAD
    }
  }

  /**
   * Gets conversion factor from radians to current angle mode
   * @returns Conversion factor
   */
  private getFromRadiansFactor(): number {
    switch (this.angleMode) {
      case 'rad':
        return 1
      case 'deg':
        return ANGLE_CONVERSION.RAD_TO_DEG
      case 'grad':
        return ANGLE_CONVERSION.RAD_TO_GRAD
      default:
        return ANGLE_CONVERSION.RAD_TO_DEG
    }
  }

  /**
   * Translates Math.js errors to user-friendly messages
   * @param error - Original error from Math.js
   * @returns User-friendly error
   */
  private translateError(error: Error): Error {
    const message = error.message.toLowerCase()

    if (message.includes('divide') || message.includes('infinity')) {
      return new Error(ERROR_MESSAGES.DIVISION_BY_ZERO)
    }
    if (message.includes('sqrt')) {
      return new Error(ERROR_MESSAGES.SQRT_NEGATIVE)
    }
    if (message.includes('log')) {
      return new Error(ERROR_MESSAGES.LOG_NON_POSITIVE)
    }
    if (message.includes('factorial')) {
      return new Error(ERROR_MESSAGES.FACTORIAL_INVALID)
    }
    if (message.includes('unexpected') || message.includes('syntax')) {
      return new Error(ERROR_MESSAGES.INVALID_SYNTAX)
    }

    // Return original error if no translation found
    return error
  }
}
