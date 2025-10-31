import { handleKeyboardInput, isValidCalculatorKey } from '@/lib/utils/keyboard'

describe('Keyboard Handler', () => {
  describe('isValidCalculatorKey', () => {
    it('should accept number keys', () => {
      expect(isValidCalculatorKey('0')).toBe(true)
      expect(isValidCalculatorKey('5')).toBe(true)
      expect(isValidCalculatorKey('9')).toBe(true)
    })

    it('should accept operator keys', () => {
      expect(isValidCalculatorKey('+')).toBe(true)
      expect(isValidCalculatorKey('-')).toBe(true)
      expect(isValidCalculatorKey('*')).toBe(true)
      expect(isValidCalculatorKey('/')).toBe(true)
    })

    it('should accept special keys', () => {
      expect(isValidCalculatorKey('Enter')).toBe(true)
      expect(isValidCalculatorKey('Escape')).toBe(true)
      expect(isValidCalculatorKey('Backspace')).toBe(true)
    })

    it('should accept decimal point', () => {
      expect(isValidCalculatorKey('.')).toBe(true)
      expect(isValidCalculatorKey(',')).toBe(true)
    })

    it('should reject invalid keys', () => {
      expect(isValidCalculatorKey('a')).toBe(false)
      expect(isValidCalculatorKey('A')).toBe(false)
      expect(isValidCalculatorKey('Tab')).toBe(false)
    })

    it('should accept parentheses', () => {
      expect(isValidCalculatorKey('(')).toBe(true)
      expect(isValidCalculatorKey(')')).toBe(true)
    })
  })

  describe('handleKeyboardInput', () => {
    it('should map number keys correctly', () => {
      expect(handleKeyboardInput('5')).toBe('5')
      expect(handleKeyboardInput('0')).toBe('0')
    })

    it('should map operator keys correctly', () => {
      expect(handleKeyboardInput('+')).toBe('+')
      expect(handleKeyboardInput('-')).toBe('-')
      expect(handleKeyboardInput('*')).toBe('*')
      expect(handleKeyboardInput('/')).toBe('/')
    })

    it('should map Enter to equals', () => {
      expect(handleKeyboardInput('Enter')).toBe('=')
    })

    it('should map Escape to clear', () => {
      expect(handleKeyboardInput('Escape')).toBe('clear')
    })

    it('should map Backspace correctly', () => {
      expect(handleKeyboardInput('Backspace')).toBe('backspace')
    })

    it('should map Delete to clear', () => {
      expect(handleKeyboardInput('Delete')).toBe('clear')
    })

    it('should map comma to decimal point', () => {
      expect(handleKeyboardInput(',')).toBe('.')
    })

    it('should return null for unmapped keys', () => {
      expect(handleKeyboardInput('a')).toBeNull()
      expect(handleKeyboardInput('Tab')).toBeNull()
    })
  })
})
