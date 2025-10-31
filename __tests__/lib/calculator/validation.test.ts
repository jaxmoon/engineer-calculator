import { validateExpression, validateNumber } from '@/lib/calculator/validation'

describe('Calculator Validation', () => {
  describe('validateNumber', () => {
    it('should accept valid integers', () => {
      expect(validateNumber('123').valid).toBe(true)
      expect(validateNumber('0').valid).toBe(true)
      expect(validateNumber('999999').valid).toBe(true)
    })

    it('should accept valid decimals', () => {
      expect(validateNumber('123.456').valid).toBe(true)
      expect(validateNumber('0.1').valid).toBe(true)
      expect(validateNumber('.5').valid).toBe(true)
    })

    it('should accept negative numbers', () => {
      expect(validateNumber('-123').valid).toBe(true)
      expect(validateNumber('-0.5').valid).toBe(true)
    })

    it('should accept scientific notation', () => {
      expect(validateNumber('1e10').valid).toBe(true)
      expect(validateNumber('1.5e-5').valid).toBe(true)
      expect(validateNumber('-2.3e+8').valid).toBe(true)
    })

    it('should reject invalid numbers', () => {
      expect(validateNumber('abc').valid).toBe(false)
      expect(validateNumber('12.34.56').valid).toBe(false)
      expect(validateNumber('').valid).toBe(false)
      expect(validateNumber('--5').valid).toBe(false)
    })

    it('should reject Infinity and NaN strings', () => {
      const infResult = validateNumber('Infinity')
      expect(infResult.valid).toBe(false)
      if (!infResult.valid) {
        expect(infResult.error.toLowerCase()).toContain('infinite')
      }

      const nanResult = validateNumber('NaN')
      expect(nanResult.valid).toBe(false)
      if (!nanResult.valid) {
        expect(nanResult.error).toContain('valid number')
      }
    })
  })

  describe('validateExpression', () => {
    it('should accept valid arithmetic expressions', () => {
      expect(validateExpression('2 + 2').valid).toBe(true)
      expect(validateExpression('10 - 5').valid).toBe(true)
      expect(validateExpression('3 * 4').valid).toBe(true)
      expect(validateExpression('8 / 2').valid).toBe(true)
    })

    it('should accept expressions with parentheses', () => {
      expect(validateExpression('(2 + 3) * 4').valid).toBe(true)
      expect(validateExpression('((1 + 2) * (3 + 4))').valid).toBe(true)
    })

    it('should accept function calls', () => {
      expect(validateExpression('sqrt(16)').valid).toBe(true)
      expect(validateExpression('sin(30)').valid).toBe(true)
      expect(validateExpression('log(100)').valid).toBe(true)
    })

    it('should reject unbalanced parentheses', () => {
      const result1 = validateExpression('(2 + 3')
      expect(result1.valid).toBe(false)
      if (!result1.valid) {
        expect(result1.error).toContain('parenthes')
      }

      const result2 = validateExpression('2 + 3)')
      expect(result2.valid).toBe(false)
      if (!result2.valid) {
        expect(result2.error).toContain('parenthes')
      }
    })

    it('should reject empty expressions', () => {
      const result = validateExpression('')
      expect(result.valid).toBe(false)
      if (!result.valid) {
        expect(result.error).toContain('empty')
      }
    })

    it('should reject expressions with invalid characters', () => {
      const result = validateExpression('2 + $ + 3')
      expect(result.valid).toBe(false)
      if (!result.valid) {
        expect(result.error).toContain('invalid')
      }
    })

    it('should reject expressions ending with operators', () => {
      expect(validateExpression('2 +').valid).toBe(false)
      expect(validateExpression('3 *').valid).toBe(false)
    })

    it('should reject division by zero in obvious cases', () => {
      const result = validateExpression('5 / 0')
      expect(result.valid).toBe(false)
      if (!result.valid) {
        expect(result.error).toContain('zero')
      }
    })
  })
})
