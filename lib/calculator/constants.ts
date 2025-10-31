/**
 * Mathematical constants and conversion factors
 */

/**
 * Conversion factors for angle modes
 */
export const ANGLE_CONVERSION = {
  DEG_TO_RAD: Math.PI / 180,
  RAD_TO_DEG: 180 / Math.PI,
  GRAD_TO_RAD: Math.PI / 200,
  RAD_TO_GRAD: 200 / Math.PI,
} as const

/**
 * Display formatting thresholds
 */
export const DISPLAY_THRESHOLDS = {
  SCIENTIFIC_NOTATION_LARGE: 1e15,
  SCIENTIFIC_NOTATION_SMALL: 1e-6,
} as const

/**
 * Error messages for common calculator errors
 */
export const ERROR_MESSAGES = {
  DIVISION_BY_ZERO: 'Division by zero',
  SQRT_NEGATIVE: 'Cannot take square root of negative number',
  LOG_NON_POSITIVE: 'Logarithm of non-positive number',
  FACTORIAL_INVALID: 'Factorial is only defined for non-negative integers',
  INVALID_SYNTAX: 'Invalid syntax',
  NOT_A_NUMBER: 'Result is not a number',
  INFINITE_RESULT: 'Result is infinite',
  UNKNOWN_ERROR: 'Unknown error during calculation',
} as const
