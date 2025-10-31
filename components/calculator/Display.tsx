import React from 'react'

interface DisplayProps {
  value: string
  expression: string
}

export const Display: React.FC<DisplayProps> = ({ value, expression }) => {
  return (
    <div
      data-testid="calculator-display"
      className="bg-gray-800 p-6 rounded-lg mb-4 text-right"
    >
      {/* Expression display */}
      {expression && (
        <div className="text-gray-400 text-sm mb-2 h-6 overflow-hidden overflow-ellipsis">
          {expression}
        </div>
      )}

      {/* Main display */}
      <div
        className={`text-4xl font-bold text-white overflow-hidden overflow-ellipsis ${
          value === 'Error' ? 'text-red-400' : ''
        }`}
      >
        {value}
      </div>
    </div>
  )
}
