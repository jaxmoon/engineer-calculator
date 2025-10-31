import type { Unit, UnitCategory } from '@/types/converter'

/**
 * Unit conversion tables
 */
export const CONVERSION_TABLES: Record<UnitCategory, Record<string, Unit>> = {
  length: {
    m: { symbol: 'm', name: 'Meter', toBase: 1 },
    km: { symbol: 'km', name: 'Kilometer', toBase: 1000 },
    cm: { symbol: 'cm', name: 'Centimeter', toBase: 0.01 },
    mm: { symbol: 'mm', name: 'Millimeter', toBase: 0.001 },
    mi: { symbol: 'mi', name: 'Mile', toBase: 1609.34 },
    yd: { symbol: 'yd', name: 'Yard', toBase: 0.9144 },
    ft: { symbol: 'ft', name: 'Foot', toBase: 0.3048 },
    in: { symbol: 'in', name: 'Inch', toBase: 0.0254 },
  },
  weight: {
    kg: { symbol: 'kg', name: 'Kilogram', toBase: 1 },
    g: { symbol: 'g', name: 'Gram', toBase: 0.001 },
    mg: { symbol: 'mg', name: 'Milligram', toBase: 0.000001 },
    lb: { symbol: 'lb', name: 'Pound', toBase: 0.453592 },
    oz: { symbol: 'oz', name: 'Ounce', toBase: 0.0283495 },
    ton: { symbol: 'ton', name: 'Metric Ton', toBase: 1000 },
  },
  temperature: {
    C: { symbol: '°C', name: 'Celsius', toBase: 1, offset: 0 },
    F: { symbol: '°F', name: 'Fahrenheit', toBase: 5 / 9, offset: -32 },
    K: { symbol: 'K', name: 'Kelvin', toBase: 1, offset: -273.15 },
  },
  volume: {
    l: { symbol: 'L', name: 'Liter', toBase: 1 },
    ml: { symbol: 'mL', name: 'Milliliter', toBase: 0.001 },
    m3: { symbol: 'm³', name: 'Cubic Meter', toBase: 1000 },
    gal: { symbol: 'gal', name: 'Gallon', toBase: 3.78541 },
    qt: { symbol: 'qt', name: 'Quart', toBase: 0.946353 },
    pt: { symbol: 'pt', name: 'Pint', toBase: 0.473176 },
    cup: { symbol: 'cup', name: 'Cup', toBase: 0.236588 },
  },
  area: {
    m2: { symbol: 'm²', name: 'Square Meter', toBase: 1 },
    km2: { symbol: 'km²', name: 'Square Kilometer', toBase: 1000000 },
    ha: { symbol: 'ha', name: 'Hectare', toBase: 10000 },
    acre: { symbol: 'acre', name: 'Acre', toBase: 4046.86 },
    ft2: { symbol: 'ft²', name: 'Square Foot', toBase: 0.092903 },
  },
}

/**
 * Get all units for a category
 */
export function getUnitsForCategory(category: UnitCategory): Record<string, Unit> {
  return CONVERSION_TABLES[category]
}

/**
 * Get all available categories
 */
export function getAllCategories(): UnitCategory[] {
  return Object.keys(CONVERSION_TABLES) as UnitCategory[]
}
