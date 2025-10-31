import React from 'react'
import type { ButtonType } from '@/constants/buttons'

interface ButtonProps {
  label: string
  onClick: () => void
  type?: ButtonType
  className?: string
  colspan?: number
  'aria-label'?: string
}

export const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  type = 'number',
  className = '',
  colspan = 1,
  'aria-label': ariaLabel,
}) => {
  // Base styles
  const baseStyles = 'px-4 py-3 rounded-lg font-semibold text-white transition-colors duration-150'

  // Type-specific styles
  const typeStyles = {
    number: 'bg-gray-700 hover:bg-gray-600',
    operator: 'bg-gray-600 hover:bg-gray-500',
    function: 'bg-gray-600 hover:bg-gray-500',
    special: 'bg-gray-600 hover:bg-gray-500',
  }

  // Colspan class mapping (Tailwind needs full class names)
  const colspanClasses: Record<number, string> = {
    1: '',
    2: 'col-span-2',
    3: 'col-span-3',
    4: 'col-span-4',
    5: 'col-span-5',
  }

  const colspanStyle = colspanClasses[colspan] || ''

  const finalClassName = `${baseStyles} ${typeStyles[type]} ${colspanStyle} ${className}`.trim()

  return (
    <button
      onClick={onClick}
      className={finalClassName}
      aria-label={ariaLabel || label}
      type="button"
    >
      {label}
    </button>
  )
}
