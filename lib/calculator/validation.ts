import type { ValidationResult } from '@/types/calculator'

/**
 * Validates if a string represents a valid number
 * @param input - String to validate
 * @returns ValidationResult indicating if valid and error message if not
 */
export function validateNumber(input: string): ValidationResult {
  if (!input || input.trim() === '') {
    return {
      valid: false,
      error: 'Input cannot be empty',
    }
  }

  // Check for special cases
  if (input === 'Infinity' || input === '-Infinity') {
    return {
      valid: false,
      error: 'Infinite values are not allowed',
    }
  }

  if (input === 'NaN') {
    return {
      valid: false,
      error: 'Not a valid number',
    }
  }

  // Try to parse the number
  const num = Number(input)

  if (isNaN(num)) {
    return {
      valid: false,
      error: 'Not a valid number format',
    }
  }

  if (!isFinite(num)) {
    return {
      valid: false,
      error: 'Number must be finite',
    }
  }

  return { valid: true }
}

/**
 * Validates if a string represents a valid mathematical expression
 * @param expression - Expression to validate
 * @returns ValidationResult indicating if valid and error message if not
 */
export function validateExpression(expression: string): ValidationResult {
  if (!expression || expression.trim() === '') {
    return {
      valid: false,
      error: 'Expression cannot be empty',
    }
  }

  const trimmed = expression.trim()

  // Check for balanced parentheses
  let parenCount = 0
  for (const char of trimmed) {
    if (char === '(') parenCount++
    if (char === ')') parenCount--
    if (parenCount < 0) {
      return {
        valid: false,
        error: 'Unbalanced parentheses: too many closing parentheses',
      }
    }
  }

  if (parenCount > 0) {
    return {
      valid: false,
      error: 'Unbalanced parentheses: missing closing parentheses',
    }
  }

  // Check for invalid characters (allow letters for functions, numbers, operators, and parentheses)
  const validChars = /^[0-9a-zA-Z+\-*/^().%\s,]+$/
  if (!validChars.test(trimmed)) {
    return {
      valid: false,
      error: 'Expression contains invalid characters',
    }
  }

  // Check for consecutive operators (except for unary minus)
  const consecutiveOps = /[+*/^]\s*[+*/^]/
  if (consecutiveOps.test(trimmed)) {
    return {
      valid: false,
      error: 'Invalid syntax: consecutive operators',
    }
  }

  // Check if expression ends with an operator
  const endsWithOperator = /[+\-*/^]$/
  if (endsWithOperator.test(trimmed)) {
    return {
      valid: false,
      error: 'Expression cannot end with an operator',
    }
  }

  // Check for obvious division by zero
  const divByZero = /\/\s*0(?:\s|$|[+\-*/^)])/
  if (divByZero.test(trimmed)) {
    return {
      valid: false,
      error: 'Division by zero is not allowed',
    }
  }

  return { valid: true }
}

/**
 * Sanitizes an expression by removing extra whitespace
 * @param expression - Expression to sanitize
 * @returns Sanitized expression
 */
export function sanitizeExpression(expression: string): string {
  return expression.trim().replace(/\s+/g, ' ')
}
