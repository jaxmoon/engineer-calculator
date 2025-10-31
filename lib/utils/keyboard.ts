import { KEYBOARD_SHORTCUTS } from '@/constants/buttons'

/**
 * Checks if a keyboard key is valid for calculator input
 * @param key - The keyboard key pressed
 * @returns True if the key is valid for calculator input
 */
export function isValidCalculatorKey(key: string): boolean {
  return key in KEYBOARD_SHORTCUTS
}

/**
 * Handles keyboard input and maps it to calculator actions
 * @param key - The keyboard key pressed
 * @returns The calculator action to perform, or null if invalid
 */
export function handleKeyboardInput(key: string): string | null {
  if (!isValidCalculatorKey(key)) {
    return null
  }

  return KEYBOARD_SHORTCUTS[key]
}

/**
 * Sets up keyboard event listener for calculator
 * @param callback - Function to call with the mapped key
 * @returns Cleanup function to remove the event listener
 */
export function setupKeyboardListener(callback: (key: string) => void): () => void {
  const handleKeyDown = (event: KeyboardEvent) => {
    const mappedKey = handleKeyboardInput(event.key)

    if (mappedKey !== null) {
      event.preventDefault()
      callback(mappedKey)
    }
  }

  window.addEventListener('keydown', handleKeyDown)

  return () => {
    window.removeEventListener('keydown', handleKeyDown)
  }
}
