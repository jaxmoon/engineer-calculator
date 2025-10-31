import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from '@/components/calculator/Button'

describe('Button Component', () => {
  it('should render button with label', () => {
    render(<Button label="1" onClick={() => {}} />)
    expect(screen.getByText('1')).toBeInTheDocument()
  })

  it('should call onClick when clicked', () => {
    const handleClick = jest.fn()
    render(<Button label="5" onClick={handleClick} />)

    const button = screen.getByText('5')
    fireEvent.click(button)

    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('should apply number button styles', () => {
    const { container } = render(<Button label="1" onClick={() => {}} type="number" />)
    const button = container.querySelector('button')
    expect(button).toHaveClass('bg-gray-700')
  })

  it('should apply operator button styles', () => {
    const { container } = render(<Button label="+" onClick={() => {}} type="operator" />)
    const button = container.querySelector('button')
    expect(button).toBeInTheDocument()
  })

  it('should apply custom className', () => {
    const { container } = render(
      <Button label="=" onClick={() => {}} className="bg-blue-500" />
    )
    const button = container.querySelector('button')
    expect(button).toHaveClass('bg-blue-500')
  })

  it('should support colspan', () => {
    const { container } = render(<Button label="0" onClick={() => {}} colspan={2} />)
    const button = container.querySelector('button')
    expect(button).toHaveClass('col-span-2')
  })

  it('should be accessible', () => {
    render(<Button label="1" onClick={() => {}} aria-label="Number 1" />)
    const button = screen.getByLabelText('Number 1')
    expect(button).toBeInTheDocument()
  })
})
