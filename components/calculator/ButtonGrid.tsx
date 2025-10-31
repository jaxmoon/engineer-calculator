import React from 'react'
import { Button } from './Button'
import { CALCULATOR_BUTTONS } from '@/constants/buttons'
import type { ButtonType } from '@/constants/buttons'

interface ButtonGridProps {
  onButtonClick: (value: string, type: ButtonType) => void
}

export const ButtonGrid: React.FC<ButtonGridProps> = ({ onButtonClick }) => {
  return (
    <div data-testid="button-grid" className="space-y-2">
      {CALCULATOR_BUTTONS.map((row, rowIndex) => (
        <div key={rowIndex} className="grid grid-cols-5 gap-2">
          {row.map((button, buttonIndex) => (
            <Button
              key={`${rowIndex}-${buttonIndex}`}
              label={button.label}
              onClick={() => onButtonClick(button.value, button.type)}
              type={button.type}
              className={button.className}
              colspan={button.colspan}
            />
          ))}
        </div>
      ))}
    </div>
  )
}
