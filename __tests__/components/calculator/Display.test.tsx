import { render, screen } from '@testing-library/react'
import { Display } from '@/components/calculator/Display'

describe('Display Component', () => {
  it('should render display value', () => {
    render(<Display value="123" expression="" />)
    expect(screen.getByText('123')).toBeInTheDocument()
  })

  it('should render expression when provided', () => {
    render(<Display value="5" expression="2 + 3" />)
    expect(screen.getByText('2 + 3')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('should render zero by default', () => {
    render(<Display value="0" expression="" />)
    expect(screen.getByText('0')).toBeInTheDocument()
  })

  it('should handle long numbers', () => {
    const longNumber = '123456789012345'
    render(<Display value={longNumber} expression="" />)
    expect(screen.getByText(longNumber)).toBeInTheDocument()
  })

  it('should render error state', () => {
    render(<Display value="Error" expression="" />)
    expect(screen.getByText('Error')).toBeInTheDocument()
  })

  it('should have proper styling classes', () => {
    const { container } = render(<Display value="123" expression="" />)
    const display = container.querySelector('[data-testid="calculator-display"]')
    expect(display).toBeInTheDocument()
  })
})
