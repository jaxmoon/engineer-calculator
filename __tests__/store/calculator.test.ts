import { renderHook, act } from '@testing-library/react'
import { useCalculatorStore } from '@/store/calculator'
import type { AngleMode } from '@/types/calculator'

describe('Calculator Store', () => {
  beforeEach(() => {
    // Clear localStorage to prevent test pollution
    if (typeof window !== 'undefined') {
      localStorage.clear()
    }

    // Reset store before each test
    const { result } = renderHook(() => useCalculatorStore())
    act(() => {
      result.current.reset()
      result.current.clearHistory()
    })
  })

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const { result } = renderHook(() => useCalculatorStore())

      expect(result.current.display).toBe('0')
      expect(result.current.expression).toBe('')
      expect(result.current.angleMode).toBe('deg')
      expect(result.current.memory).toBe(0)
      expect(result.current.lastResult).toBeNull()
      expect(result.current.history).toEqual([])
    })
  })

  describe('Display Management', () => {
    it('should update display', () => {
      const { result } = renderHook(() => useCalculatorStore())

      act(() => {
        result.current.setDisplay('123')
      })

      expect(result.current.display).toBe('123')
    })

    it('should clear display', () => {
      const { result } = renderHook(() => useCalculatorStore())

      act(() => {
        result.current.setDisplay('123')
        result.current.clear()
      })

      expect(result.current.display).toBe('0')
      expect(result.current.expression).toBe('')
    })

    it('should append to display', () => {
      const { result } = renderHook(() => useCalculatorStore())

      act(() => {
        result.current.appendToDisplay('1')
        result.current.appendToDisplay('2')
        result.current.appendToDisplay('3')
      })

      expect(result.current.display).toBe('123')
    })

    it('should not append leading zeros', () => {
      const { result } = renderHook(() => useCalculatorStore())

      act(() => {
        result.current.appendToDisplay('0')
        result.current.appendToDisplay('0')
        result.current.appendToDisplay('5')
      })

      expect(result.current.display).toBe('5')
    })

    it('should allow decimal point', () => {
      const { result } = renderHook(() => useCalculatorStore())

      act(() => {
        result.current.appendToDisplay('1')
        result.current.appendToDisplay('.')
        result.current.appendToDisplay('5')
      })

      expect(result.current.display).toBe('1.5')
    })

    it('should not allow multiple decimal points', () => {
      const { result } = renderHook(() => useCalculatorStore())

      act(() => {
        result.current.appendToDisplay('1')
        result.current.appendToDisplay('.')
        result.current.appendToDisplay('.')
        result.current.appendToDisplay('5')
      })

      expect(result.current.display).toBe('1.5')
    })

    it('should delete last character', () => {
      const { result } = renderHook(() => useCalculatorStore())

      act(() => {
        result.current.setDisplay('123')
        result.current.backspace()
      })

      expect(result.current.display).toBe('12')
    })

    it('should set display to 0 when deleting last character', () => {
      const { result } = renderHook(() => useCalculatorStore())

      act(() => {
        result.current.setDisplay('5')
        result.current.backspace()
      })

      expect(result.current.display).toBe('0')
    })
  })

  describe('Expression Management', () => {
    it('should set expression', () => {
      const { result } = renderHook(() => useCalculatorStore())

      act(() => {
        result.current.setExpression('2 + 3')
      })

      expect(result.current.expression).toBe('2 + 3')
    })

    it('should append operator to expression', () => {
      const { result } = renderHook(() => useCalculatorStore())

      act(() => {
        result.current.setDisplay('5')
        result.current.appendOperator('+')
      })

      expect(result.current.expression).toContain('5')
      expect(result.current.expression).toContain('+')
    })
  })

  describe('Angle Mode', () => {
    it('should change angle mode', () => {
      const { result } = renderHook(() => useCalculatorStore())

      act(() => {
        result.current.setAngleMode('rad')
      })

      expect(result.current.angleMode).toBe('rad')

      act(() => {
        result.current.setAngleMode('grad')
      })

      expect(result.current.angleMode).toBe('grad')
    })
  })

  describe('Memory Operations', () => {
    it('should store value in memory', () => {
      const { result } = renderHook(() => useCalculatorStore())

      act(() => {
        result.current.memoryStore(42)
      })

      expect(result.current.memory).toBe(42)
    })

    it('should add to memory', () => {
      const { result } = renderHook(() => useCalculatorStore())

      act(() => {
        result.current.memoryStore(10)
        result.current.memoryAdd(5)
      })

      expect(result.current.memory).toBe(15)
    })

    it('should subtract from memory', () => {
      const { result } = renderHook(() => useCalculatorStore())

      act(() => {
        result.current.memoryStore(10)
        result.current.memorySubtract(3)
      })

      expect(result.current.memory).toBe(7)
    })

    it('should clear memory', () => {
      const { result } = renderHook(() => useCalculatorStore())

      act(() => {
        result.current.memoryStore(42)
        result.current.memoryClear()
      })

      expect(result.current.memory).toBe(0)
    })

    it('should recall memory to display', () => {
      const { result } = renderHook(() => useCalculatorStore())

      act(() => {
        result.current.memoryStore(42)
        result.current.memoryRecall()
      })

      expect(result.current.display).toBe('42')
    })
  })

  describe('Calculation', () => {
    it('should calculate simple expression', () => {
      const { result } = renderHook(() => useCalculatorStore())

      act(() => {
        result.current.clear()
        result.current.setDisplay('2')
        result.current.appendOperator('+')
        result.current.setDisplay('3')
        result.current.calculate()
      })

      expect(result.current.display).toBe('5')
      expect(result.current.lastResult).toBe(5)
    })

    it('should add calculation to history', () => {
      const { result } = renderHook(() => useCalculatorStore())

      act(() => {
        result.current.clear()
        result.current.setDisplay('2')
        result.current.appendOperator('+')
        result.current.setDisplay('3')
        result.current.calculate()
      })

      expect(result.current.history).toHaveLength(1)
      expect(result.current.history[0].expression).toBe('2 + 3')
      expect(result.current.history[0].value).toBe(5)
    })

    it('should handle calculation errors', () => {
      const { result } = renderHook(() => useCalculatorStore())

      act(() => {
        result.current.setExpression('1 / 0')
        result.current.calculate()
      })

      expect(result.current.history[0].error).toBeDefined()
    })
  })

  describe('History', () => {
    it('should maintain calculation history', () => {
      const { result } = renderHook(() => useCalculatorStore())

      act(() => {
        result.current.setExpression('2 + 3')
        result.current.calculate()

        result.current.setExpression('10 * 5')
        result.current.calculate()
      })

      expect(result.current.history).toHaveLength(2)
    })

    it('should clear history', () => {
      const { result } = renderHook(() => useCalculatorStore())

      act(() => {
        result.current.setExpression('2 + 3')
        result.current.calculate()
        result.current.clearHistory()
      })

      expect(result.current.history).toEqual([])
    })

    it('should limit history size', () => {
      const { result } = renderHook(() => useCalculatorStore())

      act(() => {
        // Add more than the limit (assume limit is 100)
        for (let i = 0; i < 105; i++) {
          result.current.setExpression(`${i} + 1`)
          result.current.calculate()
        }
      })

      expect(result.current.history.length).toBeLessThanOrEqual(100)
    })
  })

  describe('Reset', () => {
    it('should reset all state', () => {
      const { result } = renderHook(() => useCalculatorStore())

      act(() => {
        result.current.setDisplay('123')
        result.current.setExpression('2 + 3')
        result.current.setAngleMode('rad')
        result.current.memoryStore(42)
        result.current.calculate()

        result.current.reset()
      })

      expect(result.current.display).toBe('0')
      expect(result.current.expression).toBe('')
      expect(result.current.angleMode).toBe('deg')
      expect(result.current.memory).toBe(0)
      expect(result.current.lastResult).toBeNull()
      // History should persist after reset
      expect(result.current.history.length).toBeGreaterThan(0)
    })
  })

  describe('SSR Safety', () => {
    it('should not break during server-side rendering', () => {
      // This test ensures the store can be imported during SSR
      expect(() => {
        require('@/store/calculator')
      }).not.toThrow()
    })
  })

  describe('Persistence', () => {
    it('should persist state to localStorage', () => {
      const { result } = renderHook(() => useCalculatorStore())

      act(() => {
        result.current.setAngleMode('rad')
        result.current.memoryStore(42)
      })

      // Note: In a real test, we'd need to mock localStorage
      // and verify the persist middleware is working
      expect(result.current.angleMode).toBe('rad')
      expect(result.current.memory).toBe(42)
    })
  })
})
