import { CalculatorEngine } from '@/lib/calculator/engine'
import type { AngleMode } from '@/types/calculator'

describe('CalculatorEngine', () => {
  let engine: CalculatorEngine

  beforeEach(() => {
    engine = new CalculatorEngine()
  })

  describe('Basic Arithmetic Operations', () => {
    it('should add two numbers', () => {
      expect(engine.evaluate('2 + 3')).toBe(5)
      expect(engine.evaluate('10.5 + 20.3')).toBeCloseTo(30.8)
    })

    it('should subtract two numbers', () => {
      expect(engine.evaluate('10 - 3')).toBe(7)
      expect(engine.evaluate('5.5 - 2.2')).toBeCloseTo(3.3)
    })

    it('should multiply two numbers', () => {
      expect(engine.evaluate('4 * 5')).toBe(20)
      expect(engine.evaluate('2.5 * 4')).toBe(10)
    })

    it('should divide two numbers', () => {
      expect(engine.evaluate('10 / 2')).toBe(5)
      expect(engine.evaluate('7 / 2')).toBe(3.5)
    })

    it('should handle complex expressions', () => {
      expect(engine.evaluate('2 + 3 * 4')).toBe(14)
      expect(engine.evaluate('(2 + 3) * 4')).toBe(20)
      expect(engine.evaluate('10 / 2 + 3 * 2')).toBe(11)
    })

    it('should throw error on division by zero', () => {
      expect(() => engine.evaluate('5 / 0')).toThrow()
    })
  })

  describe('Power and Root Operations', () => {
    it('should calculate power', () => {
      expect(engine.evaluate('2 ^ 3')).toBe(8)
      expect(engine.evaluate('10 ^ 2')).toBe(100)
      expect(engine.evaluate('2 ^ -1')).toBe(0.5)
    })

    it('should calculate square root', () => {
      expect(engine.evaluate('sqrt(16)')).toBe(4)
      expect(engine.evaluate('sqrt(2)')).toBeCloseTo(1.414, 3)
      expect(engine.evaluate('sqrt(0)')).toBe(0)
    })

    it('should throw error on square root of negative number', () => {
      expect(() => engine.evaluate('sqrt(-1)')).toThrow()
    })
  })

  describe('Trigonometric Functions - Degrees', () => {
    beforeEach(() => {
      engine.setAngleMode('deg')
    })

    it('should calculate sine in degrees', () => {
      expect(engine.evaluate('sin(0)')).toBeCloseTo(0)
      expect(engine.evaluate('sin(30)')).toBeCloseTo(0.5)
      expect(engine.evaluate('sin(90)')).toBeCloseTo(1)
    })

    it('should calculate cosine in degrees', () => {
      expect(engine.evaluate('cos(0)')).toBeCloseTo(1)
      expect(engine.evaluate('cos(60)')).toBeCloseTo(0.5)
      expect(engine.evaluate('cos(90)')).toBeCloseTo(0)
    })

    it('should calculate tangent in degrees', () => {
      expect(engine.evaluate('tan(0)')).toBeCloseTo(0)
      expect(engine.evaluate('tan(45)')).toBeCloseTo(1)
    })
  })

  describe('Trigonometric Functions - Radians', () => {
    beforeEach(() => {
      engine.setAngleMode('rad')
    })

    it('should calculate sine in radians', () => {
      expect(engine.evaluate('sin(0)')).toBeCloseTo(0)
      expect(engine.evaluate('sin(pi / 2)')).toBeCloseTo(1)
    })

    it('should calculate cosine in radians', () => {
      expect(engine.evaluate('cos(0)')).toBeCloseTo(1)
      expect(engine.evaluate('cos(pi)')).toBeCloseTo(-1)
    })

    it('should calculate tangent in radians', () => {
      expect(engine.evaluate('tan(0)')).toBeCloseTo(0)
      expect(engine.evaluate('tan(pi / 4)')).toBeCloseTo(1)
    })
  })

  describe('Inverse Trigonometric Functions', () => {
    beforeEach(() => {
      engine.setAngleMode('deg')
    })

    it('should calculate arcsine', () => {
      expect(engine.evaluate('asin(0)')).toBeCloseTo(0)
      expect(engine.evaluate('asin(0.5)')).toBeCloseTo(30)
      expect(engine.evaluate('asin(1)')).toBeCloseTo(90)
    })

    it('should calculate arccosine', () => {
      expect(engine.evaluate('acos(1)')).toBeCloseTo(0)
      expect(engine.evaluate('acos(0.5)')).toBeCloseTo(60)
      expect(engine.evaluate('acos(0)')).toBeCloseTo(90)
    })

    it('should calculate arctangent', () => {
      expect(engine.evaluate('atan(0)')).toBeCloseTo(0)
      expect(engine.evaluate('atan(1)')).toBeCloseTo(45)
    })
  })

  describe('Logarithmic Functions', () => {
    it('should calculate natural logarithm', () => {
      expect(engine.evaluate('log(e)')).toBeCloseTo(1)
      expect(engine.evaluate('log(1)')).toBeCloseTo(0)
    })

    it('should calculate base-10 logarithm', () => {
      expect(engine.evaluate('log10(10)')).toBeCloseTo(1)
      expect(engine.evaluate('log10(100)')).toBeCloseTo(2)
      expect(engine.evaluate('log10(1)')).toBeCloseTo(0)
    })

    it('should calculate exponential', () => {
      expect(engine.evaluate('exp(0)')).toBeCloseTo(1)
      expect(engine.evaluate('exp(1)')).toBeCloseTo(Math.E)
    })

    it('should throw error on log of non-positive numbers', () => {
      expect(() => engine.evaluate('log(0)')).toThrow()
      expect(() => engine.evaluate('log(-1)')).toThrow()
    })
  })

  describe('Constants', () => {
    it('should support pi constant', () => {
      expect(engine.evaluate('pi')).toBeCloseTo(Math.PI)
      expect(engine.evaluate('2 * pi')).toBeCloseTo(2 * Math.PI)
    })

    it('should support e constant', () => {
      expect(engine.evaluate('e')).toBeCloseTo(Math.E)
      expect(engine.evaluate('e ^ 2')).toBeCloseTo(Math.E ** 2)
    })
  })

  describe('Factorial', () => {
    it('should calculate factorial', () => {
      expect(engine.evaluate('factorial(0)')).toBe(1)
      expect(engine.evaluate('factorial(1)')).toBe(1)
      expect(engine.evaluate('factorial(5)')).toBe(120)
      expect(engine.evaluate('factorial(10)')).toBe(3628800)
    })

    it('should throw error on negative factorial', () => {
      expect(() => engine.evaluate('factorial(-1)')).toThrow()
    })

    it('should throw error on non-integer factorial', () => {
      expect(() => engine.evaluate('factorial(2.5)')).toThrow()
    })
  })

  describe('Absolute Value and Sign', () => {
    it('should calculate absolute value', () => {
      expect(engine.evaluate('abs(5)')).toBe(5)
      expect(engine.evaluate('abs(-5)')).toBe(5)
      expect(engine.evaluate('abs(0)')).toBe(0)
    })

    it('should negate numbers', () => {
      expect(engine.evaluate('-(5)')).toBe(-5)
      expect(engine.evaluate('-(-5)')).toBe(5)
    })
  })

  describe('Angle Mode Management', () => {
    it('should get and set angle mode', () => {
      expect(engine.getAngleMode()).toBe('deg')

      engine.setAngleMode('rad')
      expect(engine.getAngleMode()).toBe('rad')

      engine.setAngleMode('grad')
      expect(engine.getAngleMode()).toBe('grad')
    })

    it('should affect trigonometric calculations', () => {
      engine.setAngleMode('deg')
      const degResult = engine.evaluate('sin(90)')

      engine.setAngleMode('rad')
      const radResult = engine.evaluate('sin(pi/2)')

      expect(degResult).toBeCloseTo(radResult)
    })
  })

  describe('Precision and Rounding', () => {
    it('should handle floating point precision', () => {
      expect(engine.evaluate('0.1 + 0.2')).toBeCloseTo(0.3)
    })

    it('should format results appropriately', () => {
      const result = engine.evaluate('1 / 3')
      expect(typeof result).toBe('number')
      expect(result).toBeCloseTo(0.333333, 5)
    })
  })

  describe('Error Handling', () => {
    it('should throw error on invalid syntax', () => {
      expect(() => engine.evaluate('2 + + 3')).toThrow()
      expect(() => engine.evaluate('2 * * 3')).toThrow()
    })

    it('should throw error on undefined functions', () => {
      expect(() => engine.evaluate('foo(5)')).toThrow()
    })

    it('should throw error on empty expression', () => {
      expect(() => engine.evaluate('')).toThrow()
    })

    it('should provide meaningful error messages', () => {
      try {
        engine.evaluate('1 / 0')
        fail('Should have thrown an error')
      } catch (error) {
        expect(error).toBeInstanceOf(Error)
        expect((error as Error).message).toBeTruthy()
      }
    })
  })

  describe('Format Result', () => {
    it('should format numbers with appropriate precision', () => {
      expect(engine.formatResult(1.23456789)).toBe('1.23456789')
      expect(engine.formatResult(1000000)).toBe('1000000')
    })

    it('should use scientific notation for very large numbers', () => {
      const result = engine.formatResult(1.23e20)
      expect(result).toContain('e')
    })

    it('should use scientific notation for very small numbers', () => {
      const result = engine.formatResult(1.23e-10)
      expect(result).toContain('e')
    })

    it('should handle zero', () => {
      expect(engine.formatResult(0)).toBe('0')
    })

    it('should handle negative numbers', () => {
      expect(engine.formatResult(-123.456)).toBe('-123.456')
    })
  })
})
