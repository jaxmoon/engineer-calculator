import { render, screen, fireEvent } from '@testing-library/react'
import { ButtonGrid } from '@/components/calculator/ButtonGrid'

describe('ButtonGrid Component', () => {
  const mockOnButtonClick = jest.fn()

  beforeEach(() => {
    mockOnButtonClick.mockClear()
  })

  it('should render all calculator buttons', () => {
    render(<ButtonGrid onButtonClick={mockOnButtonClick} />)

    // Check for some key buttons
    expect(screen.getByText('0')).toBeInTheDocument()
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('9')).toBeInTheDocument()
    expect(screen.getByText('+')).toBeInTheDocument()
    expect(screen.getByText('=')).toBeInTheDocument()
  })

  it('should call onButtonClick with correct value when number clicked', () => {
    render(<ButtonGrid onButtonClick={mockOnButtonClick} />)

    const button = screen.getByText('5')
    fireEvent.click(button)

    expect(mockOnButtonClick).toHaveBeenCalledWith('5', 'number')
  })

  it('should call onButtonClick with correct value when operator clicked', () => {
    render(<ButtonGrid onButtonClick={mockOnButtonClick} />)

    const button = screen.getByText('+')
    fireEvent.click(button)

    expect(mockOnButtonClick).toHaveBeenCalledWith('+', 'operator')
  })

  it('should render memory buttons', () => {
    render(<ButtonGrid onButtonClick={mockOnButtonClick} />)

    expect(screen.getByText('MC')).toBeInTheDocument()
    expect(screen.getByText('MR')).toBeInTheDocument()
    expect(screen.getByText('M+')).toBeInTheDocument()
  })

  it('should render function buttons', () => {
    render(<ButtonGrid onButtonClick={mockOnButtonClick} />)

    expect(screen.getByText('sin')).toBeInTheDocument()
    expect(screen.getByText('cos')).toBeInTheDocument()
    expect(screen.getByText('√')).toBeInTheDocument()
  })

  it('should render special buttons', () => {
    render(<ButtonGrid onButtonClick={mockOnButtonClick} />)

    expect(screen.getByText('C')).toBeInTheDocument()
    expect(screen.getByText('⌫')).toBeInTheDocument()
  })

  it('should use grid layout', () => {
    const { container } = render(<ButtonGrid onButtonClick={mockOnButtonClick} />)
    const grid = container.querySelector('[data-testid="button-grid"]')
    expect(grid).toBeInTheDocument()
    // Check that rows use grid layout
    const gridRows = container.querySelectorAll('.grid')
    expect(gridRows.length).toBeGreaterThan(0)
  })
})
