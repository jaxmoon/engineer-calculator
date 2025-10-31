/**
 * Button types for calculator
 */
export type ButtonType = 'number' | 'operator' | 'function' | 'special'

/**
 * Button configuration interface
 */
export interface ButtonConfig {
  label: string
  value: string
  type: ButtonType
  className?: string
  colspan?: number
}

/**
 * Calculator button layout configuration
 */
export const CALCULATOR_BUTTONS: ButtonConfig[][] = [
  // Row 1: Memory and special functions
  [
    { label: 'MC', value: 'MC', type: 'special' },
    { label: 'MR', value: 'MR', type: 'special' },
    { label: 'M+', value: 'M+', type: 'special' },
    { label: 'M-', value: 'M-', type: 'special' },
    { label: 'MS', value: 'MS', type: 'special' },
  ],
  // Row 2: Advanced functions
  [
    { label: 'sin', value: 'sin', type: 'function' },
    { label: 'cos', value: 'cos', type: 'function' },
    { label: 'tan', value: 'tan', type: 'function' },
    { label: '√', value: 'sqrt', type: 'function' },
    { label: 'x²', value: '^2', type: 'function' },
  ],
  // Row 3: More functions
  [
    { label: 'ln', value: 'log', type: 'function' },
    { label: 'log', value: 'log10', type: 'function' },
    { label: 'π', value: 'pi', type: 'function' },
    { label: 'e', value: 'e', type: 'function' },
    { label: 'x!', value: '!', type: 'function' },
  ],
  // Row 4: Clear and backspace
  [
    { label: 'C', value: 'clear', type: 'special', className: 'bg-red-500 hover:bg-red-600' },
    { label: '⌫', value: 'backspace', type: 'special' },
    { label: '(', value: '(', type: 'operator' },
    { label: ')', value: ')', type: 'operator' },
    { label: '÷', value: '/', type: 'operator', className: 'bg-orange-500 hover:bg-orange-600' },
  ],
  // Row 5: Numbers 7-9
  [
    { label: '7', value: '7', type: 'number' },
    { label: '8', value: '8', type: 'number' },
    { label: '9', value: '9', type: 'number' },
    { label: '×', value: '*', type: 'operator', className: 'bg-orange-500 hover:bg-orange-600' },
    { label: 'xʸ', value: '^', type: 'operator' },
  ],
  // Row 6: Numbers 4-6
  [
    { label: '4', value: '4', type: 'number' },
    { label: '5', value: '5', type: 'number' },
    { label: '6', value: '6', type: 'number' },
    { label: '−', value: '-', type: 'operator', className: 'bg-orange-500 hover:bg-orange-600' },
    { label: '1/x', value: 'inverse', type: 'function' },
  ],
  // Row 7: Numbers 1-3
  [
    { label: '1', value: '1', type: 'number' },
    { label: '2', value: '2', type: 'number' },
    { label: '3', value: '3', type: 'number' },
    { label: '+', value: '+', type: 'operator', className: 'bg-orange-500 hover:bg-orange-600' },
    { label: '±', value: 'negate', type: 'function' },
  ],
  // Row 8: Zero and decimal
  [
    { label: '0', value: '0', type: 'number', colspan: 2 },
    { label: '.', value: '.', type: 'number' },
    { label: '=', value: '=', type: 'special', className: 'bg-blue-500 hover:bg-blue-600', colspan: 2 },
  ],
]

/**
 * Keyboard shortcuts mapping
 */
export const KEYBOARD_SHORTCUTS: Record<string, string> = {
  '0': '0',
  '1': '1',
  '2': '2',
  '3': '3',
  '4': '4',
  '5': '5',
  '6': '6',
  '7': '7',
  '8': '8',
  '9': '9',
  '+': '+',
  '-': '-',
  '*': '*',
  '/': '/',
  '^': '^',
  '.': '.',
  ',': '.',
  Enter: '=',
  '=': '=',
  Escape: 'clear',
  Backspace: 'backspace',
  Delete: 'clear',
  '(': '(',
  ')': ')',
}
