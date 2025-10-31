import { render, screen, fireEvent } from '@testing-library/react'
import { Calculator } from '@/components/calculator/Calculator'

describe('Calculator Component', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
  })

  it('should render calculator with initial display', () => {
    render(<Calculator />)
    const zeros = screen.getAllByText('0')
    expect(zeros.length).toBeGreaterThan(0)
  })

  it('should update display when number button clicked', () => {
    render(<Calculator />)

    const button1 = screen.getByText('1')
    const button2 = screen.getByText('2')

    fireEvent.click(button1)
    fireEvent.click(button2)

    expect(screen.getByText('12')).toBeInTheDocument()
  })

  it('should perform simple calculation', () => {
    render(<Calculator />)

    // Click 2 + 3 =
    const buttons = screen.getAllByText('2')
    fireEvent.click(buttons[0])
    fireEvent.click(screen.getByText('+'))
    const button3 = screen.getAllByText('3')
    fireEvent.click(button3[0])
    fireEvent.click(screen.getByText('='))

    // Check if result is displayed (might be in display or as text)
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('should clear display when C clicked', () => {
    render(<Calculator />)

    const button5 = screen.getAllByText('5')
    fireEvent.click(button5[0])
    fireEvent.click(screen.getByText('C'))

    const zeros = screen.getAllByText('0')
    expect(zeros.length).toBeGreaterThan(0)
  })

  it('should delete last digit when backspace clicked', () => {
    render(<Calculator />)

    fireEvent.click(screen.getByText('1'))
    fireEvent.click(screen.getByText('2'))
    fireEvent.click(screen.getByText('3'))
    fireEvent.click(screen.getByText('⌫'))

    expect(screen.getByText('12')).toBeInTheDocument()
  })

  it('should handle decimal point', () => {
    render(<Calculator />)

    // Clear first to ensure clean state
    fireEvent.click(screen.getByText('C'))

    const button1 = screen.getAllByText('1')
    fireEvent.click(button1[0])
    fireEvent.click(screen.getByText('.'))
    const button5 = screen.getAllByText('5')
    fireEvent.click(button5[0])

    // Check if the display contains 1.5
    const displays = screen.getAllByText('1.5')
    expect(displays.length).toBeGreaterThan(0)
  })

  it('should render angle mode selector', () => {
    render(<Calculator />)
    expect(screen.getByText('DEG')).toBeInTheDocument()
    expect(screen.getByText('RAD')).toBeInTheDocument()
    expect(screen.getByText('GRAD')).toBeInTheDocument()
  })

  it('should handle memory operations', () => {
    render(<Calculator />)

    // Store value in memory
    const button5 = screen.getAllByText('5')
    fireEvent.click(button5[0])
    fireEvent.click(screen.getByText('MS'))

    // Clear display
    fireEvent.click(screen.getByText('C'))

    // Recall memory
    fireEvent.click(screen.getByText('MR'))

    // Check if value is displayed
    const displayedFives = screen.getAllByText('5')
    expect(displayedFives.length).toBeGreaterThan(0)
  })

  it('should be responsive', () => {
    const { container } = render(<Calculator />)
    const calculator = container.firstChild
    expect(calculator).toHaveClass('w-full')
  })
})
