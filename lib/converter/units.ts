import type { UnitCategory, ConversionResult } from '@/types/converter'
import { getUnitsForCategory } from './tables'

/**
 * Unit converter class
 */
export class UnitConverter {
  /**
   * Convert value between units in the same category
   */
  convert(
    value: number,
    fromUnit: string,
    toUnit: string,
    category: UnitCategory
  ): ConversionResult {
    const units = getUnitsForCategory(category)

    if (!units[fromUnit]) {
      throw new Error(`Unknown unit: ${fromUnit}`)
    }

    if (!units[toUnit]) {
      throw new Error(`Unknown unit: ${toUnit}`)
    }

    let result: number

    if (category === 'temperature') {
      // Special handling for temperature
      result = this.convertTemperature(value, fromUnit, toUnit, units)
    } else {
      // Standard conversion via base unit
      const baseValue = value * units[fromUnit].toBase
      result = baseValue / units[toUnit].toBase
    }

    return {
      value: result,
      fromUnit,
      toUnit,
      category,
    }
  }

  /**
   * Convert temperature with offset handling
   */
  private convertTemperature(
    value: number,
    fromUnit: string,
    toUnit: string,
    units: Record<string, any>
  ): number {
    // Convert to Celsius first (base unit)
    let celsius: number

    if (fromUnit === 'C') {
      celsius = value
    } else if (fromUnit === 'F') {
      celsius = (value - 32) * (5 / 9)
    } else if (fromUnit === 'K') {
      celsius = value - 273.15
    } else {
      throw new Error(`Unknown temperature unit: ${fromUnit}`)
    }

    // Convert from Celsius to target unit
    if (toUnit === 'C') {
      return celsius
    } else if (toUnit === 'F') {
      return celsius * (9 / 5) + 32
    } else if (toUnit === 'K') {
      return celsius + 273.15
    } else {
      throw new Error(`Unknown temperature unit: ${toUnit}`)
    }
  }

  /**
   * Get formatted result string
   */
  formatResult(result: ConversionResult): string {
    return `${result.value} ${result.toUnit}`
  }
}
