# Review of TASK_M3_UNIT_CONVERTER.md

**Document Type**: task
**Reviewed by**: Codex CLI
**Date**: 2025-10-31 14:52:40

---

OpenAI Codex v0.50.0 (research preview)
--------
workdir: /Users/kyungwonmoon/Documents/GitHub/lecture/engineer-calculator
model: gpt-5-codex
provider: openai
approval: never
sandbox: workspace-write [workdir, /tmp, $TMPDIR]
reasoning effort: none
reasoning summaries: auto
session id: 019a38d2-9ca8-7571-9fd4-a4f5077420fa
--------
user
Please review this task document and provide detailed feedback.

You are a technical lead reviewing a task specification.
Provide constructive feedback on:
1. Task clarity and completeness
2. TDD approach (Red-Green-Refactor)
3. Acceptance criteria
4. Test coverage
5. Implementation approach
6. Time estimates

Format your review as:
## Strengths
[List what's well done]

## Issues
[List problems found, with severity: Critical/Major/Minor]

## Suggestions
[Specific recommendations for improvement]

Document to review:
---
# TASK: Unit Converter Implementation

## Task Information
- **Task ID**: TASK-003
- **Milestone**: M3
- **Priority**: P0
- **Estimate**: 2-3 days
- **Assigned**: Development Team
- **Status**: Not Started
- **Related PRD**: [PRD.md](./PRD.md)
- **Related Tech Spec**: [TECH_SPEC.md](./TECH_SPEC.md)

## Overview
Implement unit conversion functionality for length, weight, and temperature categories. Users can convert between different units bidirectionally with high precision and clear UI feedback.

## Context
### Why This Task
Engineering students frequently need to convert between different unit systems (metric/imperial) when solving problems. Having an integrated unit converter saves time and reduces errors from manual conversion calculations.

### Dependencies
- **Prerequisite Tasks**:
  - [x] TASK-001: Core Calculator (needs UI framework and utilities)
- **Blocks Tasks**: None

## TDD Implementation Steps

### Phase 1: RED (Write Failing Tests)

#### Test Cases

```typescript
// __tests__/lib/converter/units.test.ts
import { UnitConverter } from '@/lib/converter/units';

describe('UnitConverter', () => {
  let converter: UnitConverter;

  beforeEach(() => {
    converter = new UnitConverter();
  });

  describe('Length Conversions', () => {
    it('should convert meters to kilometers', () => {
      const result = converter.convert(1000, 'm', 'km', 'length');
      expect(result.value).toBe(1);
    });

    it('should convert kilometers to meters', () => {
      const result = converter.convert(1, 'km', 'm', 'length');
      expect(result.value).toBe(1000);
    });

    it('should convert meters to centimeters', () => {
      const result = converter.convert(1, 'm', 'cm', 'length');
      expect(result.value).toBe(100);
    });

    it('should convert inches to centimeters', () => {
      const result = converter.convert(1, 'in', 'cm', 'length');
      expect(result.value).toBeCloseTo(2.54, 2);
    });

    it('should convert feet to meters', () => {
      const result = converter.convert(1, 'ft', 'm', 'length');
      expect(result.value).toBeCloseTo(0.3048, 4);
    });

    it('should convert miles to kilometers', () => {
      const result = converter.convert(1, 'mi', 'km', 'length');
      expect(result.value).toBeCloseTo(1.60934, 5);
    });

    it('should handle same unit conversion', () => {
      const result = converter.convert(5, 'm', 'm', 'length');
      expect(result.value).toBe(5);
    });
  });

  describe('Weight Conversions', () => {
    it('should convert kilograms to grams', () => {
      const result = converter.convert(1, 'kg', 'g', 'weight');
      expect(result.value).toBe(1000);
    });

    it('should convert grams to kilograms', () => {
      const result = converter.convert(1000, 'g', 'kg', 'weight');
      expect(result.value).toBe(1);
    });

    it('should convert kilograms to pounds', () => {
      const result = converter.convert(1, 'kg', 'lb', 'weight');
      expect(result.value).toBeCloseTo(2.20462, 5);
    });

    it('should convert pounds to kilograms', () => {
      const result = converter.convert(1, 'lb', 'kg', 'weight');
      expect(result.value).toBeCloseTo(0.453592, 6);
    });

    it('should convert pounds to ounces', () => {
      const result = converter.convert(1, 'lb', 'oz', 'weight');
      expect(result.value).toBe(16);
    });

    it('should convert milligrams to grams', () => {
      const result = converter.convert(1000, 'mg', 'g', 'weight');
      expect(result.value).toBe(1);
    });
  });

  describe('Temperature Conversions', () => {
    it('should convert Celsius to Fahrenheit', () => {
      const result = converter.convert(0, 'C', 'F', 'temperature');
      expect(result.value).toBe(32);
    });

    it('should convert Fahrenheit to Celsius', () => {
      const result = converter.convert(32, 'F', 'C', 'temperature');
      expect(result.value).toBe(0);
    });

    it('should convert Celsius to Kelvin', () => {
      const result = converter.convert(0, 'C', 'K', 'temperature');
      expect(result.value).toBe(273.15);
    });

    it('should convert Kelvin to Celsius', () => {
      const result = converter.convert(273.15, 'K', 'C', 'temperature');
      expect(result.value).toBe(0);
    });

    it('should convert Fahrenheit to Kelvin', () => {
      const result = converter.convert(32, 'F', 'K', 'temperature');
      expect(result.value).toBeCloseTo(273.15, 2);
    });

    it('should handle 100°C to °F (boiling point)', () => {
      const result = converter.convert(100, 'C', 'F', 'temperature');
      expect(result.value).toBe(212);
    });

    it('should handle same unit conversion', () => {
      const result = converter.convert(25, 'C', 'C', 'temperature');
      expect(result.value).toBe(25);
    });
  });

  describe('Error Handling', () => {
    it('should throw error for invalid category', () => {
      expect(() =>
        converter.convert(1, 'm', 'kg', 'invalid' as any)
      ).toThrow('Invalid category');
    });

    it('should throw error for invalid source unit', () => {
      expect(() =>
        converter.convert(1, 'invalid', 'kg', 'weight')
      ).toThrow('Invalid unit');
    });

    it('should throw error for invalid target unit', () => {
      expect(() =>
        converter.convert(1, 'kg', 'invalid', 'weight')
      ).toThrow('Invalid unit');
    });

    it('should throw error for mismatched categories', () => {
      expect(() =>
        converter.convert(1, 'm', 'kg', 'length')
      ).toThrow('Unit mismatch');
    });

    it('should handle negative values', () => {
      const result = converter.convert(-10, 'm', 'cm', 'length');
      expect(result.value).toBe(-1000);
    });

    it('should handle zero', () => {
      const result = converter.convert(0, 'kg', 'g', 'weight');
      expect(result.value).toBe(0);
    });
  });

  describe('Precision', () => {
    it('should maintain precision for small values', () => {
      const result = converter.convert(0.001, 'kg', 'mg', 'weight');
      expect(result.value).toBe(1);
    });

    it('should maintain precision for large values', () => {
      const result = converter.convert(1000000, 'm', 'km', 'length');
      expect(result.value).toBe(1000);
    });
  });

  describe('getSupportedUnits', () => {
    it('should return all length units', () => {
      const units = converter.getSupportedUnits('length');
      expect(units).toContain('m');
      expect(units).toContain('km');
      expect(units).toContain('cm');
      expect(units).toContain('in');
      expect(units).toContain('ft');
    });

    it('should return all weight units', () => {
      const units = converter.getSupportedUnits('weight');
      expect(units).toContain('kg');
      expect(units).toContain('g');
      expect(units).toContain('lb');
      expect(units).toContain('oz');
    });

    it('should return all temperature units', () => {
      const units = converter.getSupportedUnits('temperature');
      expect(units).toContain('C');
      expect(units).toContain('F');
      expect(units).toContain('K');
    });
  });
});

// __tests__/components/converter/UnitConverter.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { UnitConverter } from '@/components/converter/UnitConverter';

describe('UnitConverter Component', () => {
  it('should render unit converter', () => {
    render(<UnitConverter />);
    expect(screen.getByTestId('unit-converter')).toBeInTheDocument();
  });

  it('should show category selector', () => {
    render(<UnitConverter />);
    expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
  });

  it('should display length category by default', () => {
    render(<UnitConverter />);
    const categorySelect = screen.getByLabelText(/category/i);
    expect(categorySelect).toHaveValue('length');
  });

  it('should change category when selected', () => {
    render(<UnitConverter />);
    const categorySelect = screen.getByLabelText(/category/i);

    fireEvent.change(categorySelect, { target: { value: 'weight' } });
    expect(categorySelect).toHaveValue('weight');
  });

  it('should update unit options when category changes', () => {
    render(<UnitConverter />);

    // Initially length units
    expect(screen.getByText('Meters')).toBeInTheDocument();

    // Change to weight
    const categorySelect = screen.getByLabelText(/category/i);
    fireEvent.change(categorySelect, { target: { value: 'weight' } });

    // Now weight units
    expect(screen.getByText('Kilograms')).toBeInTheDocument();
  });

  it('should accept value input', () => {
    render(<UnitConverter />);
    const input = screen.getByLabelText(/value/i);

    fireEvent.change(input, { target: { value: '100' } });
    expect(input).toHaveValue(100);
  });

  it('should convert when units selected', () => {
    render(<UnitConverter />);

    // Enter value
    const input = screen.getByLabelText(/value/i);
    fireEvent.change(input, { target: { value: '1000' } });

    // Select from unit: meters
    const fromUnit = screen.getByLabelText(/from/i);
    fireEvent.change(fromUnit, { target: { value: 'm' } });

    // Select to unit: kilometers
    const toUnit = screen.getByLabelText(/to/i);
    fireEvent.change(toUnit, { target: { value: 'km' } });

    // Check result
    expect(screen.getByTestId('conversion-result')).toHaveTextContent('1');
  });

  it('should show error for invalid input', () => {
    render(<UnitConverter />);
    const input = screen.getByLabelText(/value/i);

    fireEvent.change(input, { target: { value: 'invalid' } });

    expect(screen.getByText(/invalid.*input/i)).toBeInTheDocument();
  });

  it('should clear result when clear clicked', () => {
    render(<UnitConverter />);

    const input = screen.getByLabelText(/value/i);
    fireEvent.change(input, { target: { value: '100' } });

    fireEvent.click(screen.getByRole('button', { name: /clear/i }));

    expect(input).toHaveValue(null);
  });

  it('should swap units when swap clicked', () => {
    render(<UnitConverter />);

    const fromUnit = screen.getByLabelText(/from/i);
    const toUnit = screen.getByLabelText(/to/i);

    fireEvent.change(fromUnit, { target: { value: 'm' } });
    fireEvent.change(toUnit, { target: { value: 'km' } });

    fireEvent.click(screen.getByRole('button', { name: /swap/i }));

    expect(fromUnit).toHaveValue('km');
    expect(toUnit).toHaveValue('m');
  });
});
```

#### Test Checklist
- [x] **Happy Path**: All conversion types work correctly
- [x] **Edge Cases**: Same unit, zero, negative values
- [x] **Error Cases**: Invalid units, mismatched categories
- [x] **Integration Points**: UI interactions, category changes
- [x] **Precision**: Small and large values maintain accuracy

#### Expected Test Results (Before Implementation)
```bash
❌ All tests should FAIL
Total: ~50 tests, 50 failed

Failures:
- UnitConverter class not defined
- UnitConverter component not found
- Conversion functions not implemented
```

### Phase 2: GREEN (Make Tests Pass)

#### Implementation

```typescript
// src/types/converter.ts
export type UnitCategory = 'length' | 'weight' | 'temperature';

export interface ConversionResult {
  value: number;
  fromUnit: string;
  toUnit: string;
  category: UnitCategory;
}

export interface UnitDefinition {
  name: string;
  symbol: string;
  toBase: number; // Conversion factor to base unit
}

// src/lib/converter/tables.ts
import { UnitCategory, UnitDefinition } from '@/types/converter';

export const UNIT_TABLES: Record<UnitCategory, Record<string, UnitDefinition>> = {
  length: {
    // Base unit: meter (m)
    'm': { name: 'Meters', symbol: 'm', toBase: 1 },
    'km': { name: 'Kilometers', symbol: 'km', toBase: 1000 },
    'cm': { name: 'Centimeters', symbol: 'cm', toBase: 0.01 },
    'mm': { name: 'Millimeters', symbol: 'mm', toBase: 0.001 },
    'in': { name: 'Inches', symbol: 'in', toBase: 0.0254 },
    'ft': { name: 'Feet', symbol: 'ft', toBase: 0.3048 },
    'yd': { name: 'Yards', symbol: 'yd', toBase: 0.9144 },
    'mi': { name: 'Miles', symbol: 'mi', toBase: 1609.34 }
  },
  weight: {
    // Base unit: kilogram (kg)
    'kg': { name: 'Kilograms', symbol: 'kg', toBase: 1 },
    'g': { name: 'Grams', symbol: 'g', toBase: 0.001 },
    'mg': { name: 'Milligrams', symbol: 'mg', toBase: 0.000001 },
    'lb': { name: 'Pounds', symbol: 'lb', toBase: 0.453592 },
    'oz': { name: 'Ounces', symbol: 'oz', toBase: 0.0283495 }
  },
  temperature: {
    // Special case: non-linear conversions
    'C': { name: 'Celsius', symbol: '°C', toBase: 1 },
    'F': { name: 'Fahrenheit', symbol: '°F', toBase: 1 },
    'K': { name: 'Kelvin', symbol: 'K', toBase: 1 }
  }
};

// src/lib/converter/units.ts
import { UnitCategory, ConversionResult } from '@/types/converter';
import { UNIT_TABLES } from './tables';

export class UnitConverter {
  /**
   * Convert value from one unit to another
   * @param value - Numeric value to convert
   * @param fromUnit - Source unit symbol
   * @param toUnit - Target unit symbol
   * @param category - Unit category
   * @returns Conversion result
   */
  convert(
    value: number,
    fromUnit: string,
    toUnit: string,
    category: UnitCategory
  ): ConversionResult {
    this.validateCategory(category);
    this.validateUnit(fromUnit, category);
    this.validateUnit(toUnit, category);

    // Special handling for temperature (non-linear)
    if (category === 'temperature') {
      return {
        value: this.convertTemperature(value, fromUnit, toUnit),
        fromUnit,
        toUnit,
        category
      };
    }

    // Linear conversion: value → base → target
    const table = UNIT_TABLES[category];
    const baseValue = value * table[fromUnit].toBase;
    const result = baseValue / table[toUnit].toBase;

    return {
      value: result,
      fromUnit,
      toUnit,
      category
    };
  }

  /**
   * Get all supported units for a category
   * @param category - Unit category
   * @returns Array of unit symbols
   */
  getSupportedUnits(category: UnitCategory): string[] {
    this.validateCategory(category);
    return Object.keys(UNIT_TABLES[category]);
  }

  /**
   * Get unit definition
   * @param unit - Unit symbol
   * @param category - Unit category
   * @returns Unit definition
   */
  getUnitInfo(unit: string, category: UnitCategory): UnitDefinition {
    this.validateCategory(category);
    this.validateUnit(unit, category);
    return UNIT_TABLES[category][unit];
  }

  private validateCategory(category: UnitCategory): void {
    if (!UNIT_TABLES[category]) {
      throw new Error(`Invalid category: ${category}`);
    }
  }

  private validateUnit(unit: string, category: UnitCategory): void {
    const table = UNIT_TABLES[category];
    if (!table[unit]) {
      throw new Error(`Invalid unit: ${unit} for category ${category}`);
    }
  }

  private convertTemperature(value: number, from: string, to: string): number {
    if (from === to) {
      return value;
    }

    // Convert to Celsius first
    let celsius: number;
    switch (from) {
      case 'C':
        celsius = value;
        break;
      case 'F':
        celsius = (value - 32) * 5 / 9;
        break;
      case 'K':
        celsius = value - 273.15;
        break;
      default:
        throw new Error(`Unknown temperature unit: ${from}`);
    }

    // Convert from Celsius to target
    switch (to) {
      case 'C':
        return celsius;
      case 'F':
        return (celsius * 9 / 5) + 32;
      case 'K':
        return celsius + 273.15;
      default:
        throw new Error(`Unknown temperature unit: ${to}`);
    }
  }
}

// src/components/converter/UnitConverter.tsx
'use client';

import { useState } from 'react';
import { UnitConverter as Converter } from '@/lib/converter/units';
import { UnitCategory } from '@/types/converter';
import { CategorySelector } from './CategorySelector';
import { UnitSelector } from './UnitSelector';

export function UnitConverter() {
  const [category, setCategory] = useState<UnitCategory>('length');
  const [value, setValue] = useState<number | ''>('');
  const [fromUnit, setFromUnit] = useState('m');
  const [toUnit, setToUnit] = useState('km');
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState('');

  const converter = new Converter();

  const handleConvert = () => {
    if (value === '' || isNaN(Number(value))) {
      setError('Invalid input: Please enter a valid number');
      setResult(null);
      return;
    }

    try {
      setError('');
      const conversionResult = converter.convert(
        Number(value),
        fromUnit,
        toUnit,
        category
      );
      setResult(conversionResult.value);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Conversion error');
      setResult(null);
    }
  };

  const handleCategoryChange = (newCategory: UnitCategory) => {
    setCategory(newCategory);
    setResult(null);
    setError('');

    // Reset units to first available units in new category
    const units = converter.getSupportedUnits(newCategory);
    setFromUnit(units[0]);
    setToUnit(units[1] || units[0]);
  };

  const handleSwap = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
    if (result !== null && value !== '') {
      setResult(Number(value));
      setValue(result);
    }
  };

  const handleClear = () => {
    setValue('');
    setResult(null);
    setError('');
  };

  // Auto-convert when inputs change
  useState(() => {
    if (value !== '') {
      handleConvert();
    }
  });

  return (
    <div className="p-4" data-testid="unit-converter">
      <h3 className="font-semibold mb-4">Unit Converter</h3>

      <CategorySelector
        value={category}
        onChange={handleCategoryChange}
      />

      <div className="space-y-4 mt-4">
        <div>
          <label htmlFor="value-input" className="block text-sm mb-1">
            Value
          </label>
          <input
            id="value-input"
            type="number"
            value={value}
            onChange={(e) => {
              setValue(e.target.value === '' ? '' : Number(e.target.value));
              handleConvert();
            }}
            className="w-full p-2 border rounded"
            placeholder="Enter value"
          />
        </div>

        <div className="grid grid-cols-[1fr,auto,1fr] gap-2 items-end">
          <UnitSelector
            label="From"
            value={fromUnit}
            onChange={setFromUnit}
            category={category}
            converter={converter}
          />

          <button
            onClick={handleSwap}
            className="mb-2 p-2 bg-gray-200 rounded hover:bg-gray-300"
            aria-label="Swap units"
          >
            ⇄
          </button>

          <UnitSelector
            label="To"
            value={toUnit}
            onChange={setToUnit}
            category={category}
            converter={converter}
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleConvert}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Convert
          </button>
          <button
            onClick={handleClear}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Clear
          </button>
        </div>

        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}

        {result !== null && (
          <div
            className="bg-gray-50 dark:bg-gray-800 p-4 rounded"
            data-testid="conversion-result"
          >
            <div className="text-2xl font-bold">
              {result.toFixed(6)}
            </div>
            <div className="text-sm text-gray-600">
              {converter.getUnitInfo(toUnit, category).name}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// src/components/converter/CategorySelector.tsx
import { UnitCategory } from '@/types/converter';

interface CategorySelectorProps {
  value: UnitCategory;
  onChange: (category: UnitCategory) => void;
}

export function CategorySelector({ value, onChange }: CategorySelectorProps) {
  return (
    <div>
      <label htmlFor="category-select" className="block text-sm mb-1">
        Category
      </label>
      <select
        id="category-select"
        value={value}
        onChange={(e) => onChange(e.target.value as UnitCategory)}
        className="w-full p-2 border rounded"
      >
        <option value="length">Length</option>
        <option value="weight">Weight</option>
        <option value="temperature">Temperature</option>
      </select>
    </div>
  );
}

// src/components/converter/UnitSelector.tsx
import { UnitCategory } from '@/types/converter';
import { UnitConverter } from '@/lib/converter/units';

interface UnitSelectorProps {
  label: string;
  value: string;
  onChange: (unit: string) => void;
  category: UnitCategory;
  converter: UnitConverter;
}

export function UnitSelector({
  label,
  value,
  onChange,
  category,
  converter
}: UnitSelectorProps) {
  const units = converter.getSupportedUnits(category);

  return (
    <div>
      <label htmlFor={`${label}-unit`} className="block text-sm mb-1">
        {label}
      </label>
      <select
        id={`${label}-unit`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-2 border rounded"
      >
        {units.map((unit) => {
          const info = converter.getUnitInfo(unit, category);
          return (
            <option key={unit} value={unit}>
              {info.name}
            </option>
          );
        })}
      </select>
    </div>
  );
}
```

#### Implementation Checklist
- [x] UnitConverter class with all conversion logic
- [x] Conversion tables for all unit categories
- [x] Special temperature conversion handling
- [x] UnitConverter UI component
- [x] Category and unit selectors
- [x] All test cases passing

#### Expected Test Results (After Implementation)
```bash
✅ All tests should PASS
Total: ~50 tests, 50 passed

 PASS  __tests__/lib/converter/units.test.ts
 PASS  __tests__/components/converter/UnitConverter.test.tsx
```

### Phase 3: REFACTOR (Improve Code Quality)

#### Refactoring Goals
- [x] **Code Structure**: Separate conversion logic, tables, and UI
- [x] **Type Safety**: Comprehensive TypeScript types
- [x] **Precision**: Proper rounding and formatting
- [x] **UX**: Auto-convert on input change
- [x] **Documentation**: JSDoc comments

#### Refactored Code

```typescript
// src/lib/converter/units.ts (Refactored with better structure)
/**
 * Unit conversion service supporting length, weight, and temperature
 */
export class UnitConverter {
  /**
   * Converts a value from one unit to another within the same category
   *
   * @param value - Numeric value to convert
   * @param fromUnit - Source unit symbol (e.g., 'm', 'kg', 'C')
   * @param toUnit - Target unit symbol (e.g., 'km', 'lb', 'F')
   * @param category - Unit category ('length', 'weight', 'temperature')
   * @returns Conversion result with converted value and metadata
   * @throws {Error} If category or units are invalid
   *
   * @example
   * const converter = new UnitConverter();
   * const result = converter.convert(1000, 'm', 'km', 'length');
   * // Returns: { value: 1, fromUnit: 'm', toUnit: 'km', category: 'length' }
   */
  convert(
    value: number,
    fromUnit: string,
    toUnit: string,
    category: UnitCategory
  ): ConversionResult {
    this.validateInputs(value, fromUnit, toUnit, category);

    if (category === 'temperature') {
      return this.convertWithMetadata(
        this.convertTemperature(value, fromUnit, toUnit),
        fromUnit,
        toUnit,
        category
      );
    }

    return this.convertWithMetadata(
      this.convertLinear(value, fromUnit, toUnit, category),
      fromUnit,
      toUnit,
      category
    );
  }

  /**
   * Performs linear conversion (length, weight)
   * Formula: value → base unit → target unit
   */
  private convertLinear(
    value: number,
    fromUnit: string,
    toUnit: string,
    category: UnitCategory
  ): number {
    if (fromUnit === toUnit) {
      return value;
    }

    const table = UNIT_TABLES[category];
    const baseValue = value * table[fromUnit].toBase;
    return baseValue / table[toUnit].toBase;
  }

  /**
   * Performs temperature conversion (non-linear)
   * Uses Celsius as intermediate unit
   */
  private convertTemperature(value: number, from: string, to: string): number {
    if (from === to) {
      return value;
    }

    const celsius = this.toCelsius(value, from);
    return this.fromCelsius(celsius, to);
  }

  private toCelsius(value: number, from: string): number {
    const converters = {
      'C': (v: number) => v,
      'F': (v: number) => (v - 32) * 5 / 9,
      'K': (v: number) => v - 273.15
    };

    const converter = converters[from as keyof typeof converters];
    if (!converter) {
      throw new Error(`Unknown temperature unit: ${from}`);
    }

    return converter(value);
  }

  private fromCelsius(celsius: number, to: string): number {
    const converters = {
      'C': (c: number) => c,
      'F': (c: number) => (c * 9 / 5) + 32,
      'K': (c: number) => c + 273.15
    };

    const converter = converters[to as keyof typeof converters];
    if (!converter) {
      throw new Error(`Unknown temperature unit: ${to}`);
    }

    return converter(celsius);
  }

  private convertWithMetadata(
    value: number,
    fromUnit: string,
    toUnit: string,
    category: UnitCategory
  ): ConversionResult {
    return { value, fromUnit, toUnit, category };
  }

  private validateInputs(
    value: number,
    fromUnit: string,
    toUnit: string,
    category: UnitCategory
  ): void {
    this.validateCategory(category);
    this.validateUnit(fromUnit, category);
    this.validateUnit(toUnit, category);

    if (isNaN(value) || !isFinite(value)) {
      throw new Error('Invalid value: must be a finite number');
    }
  }

  // ... rest of validation methods
}
```

#### Refactoring Checklist
- [x] Tests still pass
- [x] Code more modular and readable
- [x] Temperature conversion refactored
- [x] Proper error messages
- [x] JSDoc comments comprehensive

## Acceptance Criteria

### Functional Requirements
- [x] **Length Conversions**: m, km, cm, mm, in, ft, yd, mi
- [x] **Weight Conversions**: kg, g, mg, lb, oz
- [x] **Temperature Conversions**: C, F, K
- [x] **Bidirectional**: Any unit to any unit in same category
- [x] **Precision**: Results accurate to 6 decimal places
- [x] **Error Handling**: Invalid units, categories handled

### Code Quality Requirements
- [x] All tests pass
- [x] Code coverage ≥ 90%
- [x] No ESLint errors
- [x] Proper TypeScript types

### Documentation Requirements
- [x] JSDoc for all public methods
- [x] Usage examples in components

## Test Coverage

### Unit Tests
```bash
Coverage:
- units.test.ts: 95%
- UnitConverter.test.tsx: 90%
```

### Integration Tests
- [x] Category change updates available units
- [x] Swap units functionality
- [x] Auto-convert on input change

## Implementation Notes

### Files to Create
- [x] `src/types/converter.ts`
- [x] `src/lib/converter/tables.ts`
- [x] `src/lib/converter/units.ts`
- [x] `src/components/converter/UnitConverter.tsx`
- [x] `src/components/converter/CategorySelector.tsx`
- [x] `src/components/converter/UnitSelector.tsx`

### Files to Modify
- None

## Estimated Context Size
**Estimated tokens**: ~12k tokens

### Code Volume Breakdown
- Implementation: ~700 lines
- Tests: ~500 lines
- Total: ~1,200 lines ≈ 12k tokens

## Verification Steps

1. **Run Tests**:
```bash
npm test __tests__/lib/converter
npm test __tests__/components/converter
```

2. **Manual Testing**:
- [x] Convert 1000m to km (expect 1)
- [x] Convert 1kg to lb (expect ~2.2)
- [x] Convert 0°C to °F (expect 32)
- [x] Swap units and verify recalculation
- [x] Change category and verify units update

## Potential Issues & Solutions

### Issue 1: Floating Point Precision
**Solution**: Round to 6 decimal places, use toFixed() for display

### Issue 2: Temperature Edge Cases
**Solution**: Special handling for absolute zero, careful testing

## Resources
- [Unit Conversion Standards](https://www.nist.gov/pml/weights-and-measures/metric-si/si-units)
- [Temperature Conversion Formulas](https://www.rapidtables.com/convert/temperature/)

## Completion Checklist
- [x] ✅ Phase 1 (RED): Tests written and failing
- [x] ✅ Phase 2 (GREEN): Tests passing
- [x] ✅ Phase 3 (REFACTOR): Code improved
- [x] All acceptance criteria met

## Revision History
| Date | Version | Changes | Author |
|------|---------|---------|--------|
| 2025-10-31 | 1.0 | Initial task created | Feature Planning Team |
---

Provide your review now:

thinking
**Evaluating detailed TDD document**

I’m carefully reviewing the document’s strengths, issues, and suggestions around testing clarity, implementation bugs, and acceptance criteria mismatches—especially on React state handling, decimal precision, and test expectations. There is a lot to unpack about auto-convert bugs, test failures, and documentation gaps, so I’m laying out the critique with referencing line numbers and severity rankings.
codex
## Strengths
- Scope is well framed: length/weight/temperature coverage, bidirectional conversions, precision expectations, and UI behaviors are all surfaced early.
- Dependencies and file structure are mapped out, including new TypeScript types, conversion tables, and UI subcomponents, which should help the team orient quickly.
- TDD intent is visible with concrete test cases that exercise lib and UI layers, plus a checklist that differentiates happy path, edge cases, and error handling.
- Acceptance criteria enumerate functional and non-functional goals (precision, error handling, linting, typing) which is a good baseline for done-ness.

## Issues
- Major – `src/components/converter/UnitConverter.tsx:55`: Input `onChange` calls `setValue(...)` and immediately invokes `handleConvert()`, but `handleConvert` reads `value` from state, so it sees the stale pre-change value. Result: the first keystroke flags an error or uses the old number, breaking the “auto-convert on input change” requirement and several proposed tests.
- Major – `src/components/converter/UnitConverter.tsx:103`: Attempting to auto-run conversion via `useState(() => { ... })` is incorrect; this hook is never re-run after the initial render. Conversions won’t refresh when units or category change, contradicting the refactor goal and expected UX.
- Major – `src/components/converter/UnitConverter.tsx:87`: Conversion results are displayed with `result.toFixed(6)`, yet `__tests__/components/converter/UnitConverter.test.tsx` expects `'1'`. Tests will fail even after correct implementation; acceptance criteria (“six decimal places”) and tests are out of sync.
- Major – `__tests__/components/converter/UnitConverter.test.tsx:79`: “Invalid input” scenario types `'invalid'` into a `type="number"` field; browsers won’t allow that value, so the test can’t reproduce the error path it claims to cover.
- Minor – `__tests__/components/converter/UnitConverter.test.tsx:100`: Clear-button assertion expects `input` value `null`, but implementation resets to empty string. Either the test or the behavior spec needs adjustment.
- Minor – Coverage targets (≥90%) are stated but there’s no instruction to run coverage (e.g., `npm test -- --coverage`). Without tooling guidance, that acceptance criterion is untestable.
- Minor – Time estimate (2–3 days) feels optimistic given ~1,200 lines of code/tests plus refactor requirements; risk of spillover if integration or UX polish is needed.

## Suggestions
- Fix state handling in `UnitConverter`: pass the raw event value into `handleConvert` or trigger conversion from a `useEffect` keyed on `value`, `fromUnit`, `toUnit`, and `category`. Replace the stray `useState` call with `useEffect` for auto-convert semantics.
- Align display precision with tests: either update tests to expect `1.000000` (matching acceptance criteria) or adjust the component to display trimmed values when decimals are zero—document the decision.
- Rework the “invalid input” test to mimic a realistic failure case (e.g., allow empty string, or switch input to `type="text"` if free-form typing is required) and update the spec accordingly.
- Update the clear-button expectation and acceptance criteria so implementation and tests agree on the cleared state representation.
- Document how to gather coverage (command, thresholds) or relax the criterion to “coverage report reviewed” so the team knows how to prove compliance.
- Revisit the 2–3 day estimate after addressing the above adjustments; if scope stays at the current size, consider bumping to ~4 days or explicitly calling out assumptions (e.g., reuse of existing component scaffolding).
tokens used
10,925
## Strengths
- Scope is well framed: length/weight/temperature coverage, bidirectional conversions, precision expectations, and UI behaviors are all surfaced early.
- Dependencies and file structure are mapped out, including new TypeScript types, conversion tables, and UI subcomponents, which should help the team orient quickly.
- TDD intent is visible with concrete test cases that exercise lib and UI layers, plus a checklist that differentiates happy path, edge cases, and error handling.
- Acceptance criteria enumerate functional and non-functional goals (precision, error handling, linting, typing) which is a good baseline for done-ness.

## Issues
- Major – `src/components/converter/UnitConverter.tsx:55`: Input `onChange` calls `setValue(...)` and immediately invokes `handleConvert()`, but `handleConvert` reads `value` from state, so it sees the stale pre-change value. Result: the first keystroke flags an error or uses the old number, breaking the “auto-convert on input change” requirement and several proposed tests.
- Major – `src/components/converter/UnitConverter.tsx:103`: Attempting to auto-run conversion via `useState(() => { ... })` is incorrect; this hook is never re-run after the initial render. Conversions won’t refresh when units or category change, contradicting the refactor goal and expected UX.
- Major – `src/components/converter/UnitConverter.tsx:87`: Conversion results are displayed with `result.toFixed(6)`, yet `__tests__/components/converter/UnitConverter.test.tsx` expects `'1'`. Tests will fail even after correct implementation; acceptance criteria (“six decimal places”) and tests are out of sync.
- Major – `__tests__/components/converter/UnitConverter.test.tsx:79`: “Invalid input” scenario types `'invalid'` into a `type="number"` field; browsers won’t allow that value, so the test can’t reproduce the error path it claims to cover.
- Minor – `__tests__/components/converter/UnitConverter.test.tsx:100`: Clear-button assertion expects `input` value `null`, but implementation resets to empty string. Either the test or the behavior spec needs adjustment.
- Minor – Coverage targets (≥90%) are stated but there’s no instruction to run coverage (e.g., `npm test -- --coverage`). Without tooling guidance, that acceptance criterion is untestable.
- Minor – Time estimate (2–3 days) feels optimistic given ~1,200 lines of code/tests plus refactor requirements; risk of spillover if integration or UX polish is needed.

## Suggestions
- Fix state handling in `UnitConverter`: pass the raw event value into `handleConvert` or trigger conversion from a `useEffect` keyed on `value`, `fromUnit`, `toUnit`, and `category`. Replace the stray `useState` call with `useEffect` for auto-convert semantics.
- Align display precision with tests: either update tests to expect `1.000000` (matching acceptance criteria) or adjust the component to display trimmed values when decimals are zero—document the decision.
- Rework the “invalid input” test to mimic a realistic failure case (e.g., allow empty string, or switch input to `type="text"` if free-form typing is required) and update the spec accordingly.
- Update the clear-button expectation and acceptance criteria so implementation and tests agree on the cleared state representation.
- Document how to gather coverage (command, thresholds) or relax the criterion to “coverage report reviewed” so the team knows how to prove compliance.
- Revisit the 2–3 day estimate after addressing the above adjustments; if scope stays at the current size, consider bumping to ~4 days or explicitly calling out assumptions (e.g., reuse of existing component scaffolding).
