/**
 * Unit conversion categories
 */
export type UnitCategory = 'length' | 'weight' | 'temperature' | 'volume' | 'area'

/**
 * Unit type within a category
 */
export interface Unit {
  symbol: string
  name: string
  toBase: number // Multiplier to convert to base unit
  offset?: number // Offset for temperature conversions
}

/**
 * Conversion result
 */
export interface ConversionResult {
  value: number
  fromUnit: string
  toUnit: string
  category: UnitCategory
}
