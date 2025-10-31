'use client'

import React, { useEffect } from 'react'
import { Display } from './Display'
import { ButtonGrid } from './ButtonGrid'
import { useCalculatorStore } from '@/store/calculator'
import { setupKeyboardListener } from '@/lib/utils/keyboard'
import type { ButtonType } from '@/constants/buttons'
import type { AngleMode } from '@/types/calculator'

export const Calculator: React.FC = () => {
  const {
    display,
    expression,
    angleMode,
    memory,
    setDisplay,
    appendToDisplay,
    clear,
    backspace,
    appendOperator,
    setAngleMode,
    memoryStore,
    memoryRecall,
    memoryAdd,
    memorySubtract,
    memoryClear,
    calculate,
  } = useCalculatorStore()

  // Set up keyboard listener
  useEffect(() => {
    const cleanup = setupKeyboardListener((key) => {
      handleButtonClick(key, 'special')
    })

    return cleanup
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleButtonClick = (value: string, type: ButtonType) => {
    switch (type) {
      case 'number':
        if (value === '.') {
          appendToDisplay(value)
        } else {
          appendToDisplay(value)
        }
        break

      case 'operator':
        if (value === '(' || value === ')') {
          // Handle parentheses by adding to expression
          appendToDisplay(value)
        } else {
          appendOperator(value)
        }
        break

      case 'function':
        handleFunction(value)
        break

      case 'special':
        handleSpecial(value)
        break
    }
  }

  const handleFunction = (func: string) => {
    const currentValue = parseFloat(display)

    switch (func) {
      case 'sin':
      case 'cos':
      case 'tan':
      case 'sqrt':
      case 'log':
      case 'log10':
        // Add function to expression
        appendOperator(func + '(')
        setDisplay('')
        break

      case '^2':
        appendOperator('^')
        setDisplay('2')
        break

      case 'pi':
        setDisplay('pi')
        break

      case 'e':
        setDisplay('e')
        break

      case '!':
        appendOperator('factorial(')
        break

      case 'inverse':
        if (currentValue !== 0) {
          setDisplay((1 / currentValue).toString())
        }
        break

      case 'negate':
        if (display !== '0') {
          setDisplay((currentValue * -1).toString())
        }
        break
    }
  }

  const handleSpecial = (action: string) => {
    switch (action) {
      case 'clear':
        clear()
        break

      case 'backspace':
        backspace()
        break

      case '=':
        calculate()
        break

      case 'MC':
        memoryClear()
        break

      case 'MR':
        memoryRecall()
        break

      case 'M+':
        memoryAdd(parseFloat(display))
        break

      case 'M-':
        memorySubtract(parseFloat(display))
        break

      case 'MS':
        memoryStore(parseFloat(display))
        break
    }
  }

  const handleAngleModeChange = (mode: AngleMode) => {
    setAngleMode(mode)
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-gray-900 rounded-xl shadow-2xl">
      {/* Header with angle mode selector */}
      <div className="flex justify-between items-center mb-4">
        <div className="text-white font-semibold">Engineer Calculator</div>
        <div className="flex gap-2">
          {(['deg', 'rad', 'grad'] as AngleMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => handleAngleModeChange(mode)}
              className={`px-3 py-1 rounded ${
                angleMode === mode
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {mode.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Memory indicator */}
      {memory !== 0 && (
        <div className="text-gray-400 text-sm mb-2">Memory: {memory}</div>
      )}

      {/* Display */}
      <Display value={display} expression={expression} />

      {/* Button Grid */}
      <ButtonGrid onButtonClick={handleButtonClick} />
    </div>
  )
}
