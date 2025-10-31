# Review of TASK_M2_HISTORY_STATISTICS.md

**Document Type**: task
**Reviewed by**: Codex CLI
**Date**: 2025-10-31 14:51:51

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
session id: 019a38d2-1d7b-7eb1-bc47-7347a68e38e0
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
# TASK: History & Statistics Implementation

## Task Information
- **Task ID**: TASK-002
- **Milestone**: M2
- **Priority**: P0
- **Estimate**: 3-4 days
- **Assigned**: Development Team
- **Status**: Not Started
- **Related PRD**: [PRD.md](./PRD.md)
- **Related Tech Spec**: [TECH_SPEC.md](./TECH_SPEC.md)

## Overview
Implement calculation history tracking with localStorage persistence and statistical analysis functions (mean, median, standard deviation, variance). Users can view, reload, and manage their calculation history, and perform statistical calculations on data sets.

## Context
### Why This Task
Engineering students need to review previous calculations to verify their work and track their problem-solving process. Statistical functions are essential for analyzing lab data and experimental results. This task enhances the calculator's utility for academic work.

### Dependencies
- **Prerequisite Tasks**:
  - [x] TASK-001: Core Calculator (needs calculator engine and state management)
- **Blocks Tasks**: None

## TDD Implementation Steps

### Phase 1: RED (Write Failing Tests)

#### Test Cases

```typescript
// __tests__/lib/storage/history.test.ts
import { HistoryService } from '@/lib/storage/history';
import { HistoryEntry } from '@/types/history';

describe('HistoryService', () => {
  let service: HistoryService;

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    service = new HistoryService();
  });

  describe('addEntry', () => {
    it('should add entry to history', () => {
      service.addEntry({
        expression: '2+3',
        result: '5',
        mode: 'deg'
      });

      const history = service.getHistory();
      expect(history).toHaveLength(1);
      expect(history[0].expression).toBe('2+3');
      expect(history[0].result).toBe('5');
    });

    it('should add timestamp and ID automatically', () => {
      service.addEntry({
        expression: '2+3',
        result: '5',
        mode: 'deg'
      });

      const history = service.getHistory();
      expect(history[0].id).toBeDefined();
      expect(history[0].timestamp).toBeGreaterThan(0);
    });

    it('should add new entries to beginning of history', () => {
      service.addEntry({ expression: 'first', result: '1', mode: 'deg' });
      service.addEntry({ expression: 'second', result: '2', mode: 'deg' });

      const history = service.getHistory();
      expect(history[0].expression).toBe('second');
      expect(history[1].expression).toBe('first');
    });

    it('should limit history to 100 entries', () => {
      // Add 110 entries
      for (let i = 0; i < 110; i++) {
        service.addEntry({
          expression: `${i}+${i}`,
          result: `${i * 2}`,
          mode: 'deg'
        });
      }

      const history = service.getHistory();
      expect(history).toHaveLength(100);
      expect(history[0].expression).toBe('109+109'); // Most recent
    });

    it('should persist to localStorage', () => {
      service.addEntry({
        expression: '2+3',
        result: '5',
        mode: 'deg'
      });

      // Create new instance to simulate page reload
      const newService = new HistoryService();
      const history = newService.getHistory();

      expect(history).toHaveLength(1);
      expect(history[0].expression).toBe('2+3');
    });
  });

  describe('getHistory', () => {
    it('should return empty array when no history', () => {
      const history = service.getHistory();
      expect(history).toEqual([]);
    });

    it('should return all history entries', () => {
      service.addEntry({ expression: '1+1', result: '2', mode: 'deg' });
      service.addEntry({ expression: '2+2', result: '4', mode: 'deg' });

      const history = service.getHistory();
      expect(history).toHaveLength(2);
    });
  });

  describe('deleteEntry', () => {
    it('should delete entry by ID', () => {
      service.addEntry({ expression: '1+1', result: '2', mode: 'deg' });
      service.addEntry({ expression: '2+2', result: '4', mode: 'deg' });

      const history = service.getHistory();
      const idToDelete = history[0].id;

      service.deleteEntry(idToDelete);

      const updatedHistory = service.getHistory();
      expect(updatedHistory).toHaveLength(1);
      expect(updatedHistory[0].expression).toBe('1+1');
    });

    it('should persist deletion to localStorage', () => {
      service.addEntry({ expression: '1+1', result: '2', mode: 'deg' });
      const history = service.getHistory();
      service.deleteEntry(history[0].id);

      const newService = new HistoryService();
      expect(newService.getHistory()).toHaveLength(0);
    });
  });

  describe('clearHistory', () => {
    it('should clear all history', () => {
      service.addEntry({ expression: '1+1', result: '2', mode: 'deg' });
      service.addEntry({ expression: '2+2', result: '4', mode: 'deg' });

      service.clearHistory();

      expect(service.getHistory()).toHaveLength(0);
    });

    it('should persist clear to localStorage', () => {
      service.addEntry({ expression: '1+1', result: '2', mode: 'deg' });
      service.clearHistory();

      const newService = new HistoryService();
      expect(newService.getHistory()).toHaveLength(0);
    });
  });
});

// __tests__/lib/calculator/statistics.test.ts
import { StatisticsCalculator } from '@/lib/calculator/statistics';

describe('StatisticsCalculator', () => {
  let calculator: StatisticsCalculator;

  beforeEach(() => {
    calculator = new StatisticsCalculator();
  });

  describe('calculateStatistics', () => {
    it('should calculate mean of numbers', () => {
      const result = calculator.calculate([1, 2, 3, 4, 5]);
      expect(result.mean).toBe(3);
    });

    it('should calculate median of odd count', () => {
      const result = calculator.calculate([1, 2, 3, 4, 5]);
      expect(result.median).toBe(3);
    });

    it('should calculate median of even count', () => {
      const result = calculator.calculate([1, 2, 3, 4]);
      expect(result.median).toBe(2.5);
    });

    it('should calculate standard deviation (population)', () => {
      const result = calculator.calculate([2, 4, 4, 4, 5, 5, 7, 9]);
      expect(result.stdDev).toBeCloseTo(2, 1);
    });

    it('should calculate variance', () => {
      const result = calculator.calculate([2, 4, 4, 4, 5, 5, 7, 9]);
      expect(result.variance).toBeCloseTo(4, 0);
    });

    it('should return count', () => {
      const result = calculator.calculate([1, 2, 3, 4, 5]);
      expect(result.count).toBe(5);
    });

    it('should return min and max', () => {
      const result = calculator.calculate([3, 1, 4, 1, 5, 9]);
      expect(result.min).toBe(1);
      expect(result.max).toBe(9);
    });

    it('should handle single value', () => {
      const result = calculator.calculate([5]);
      expect(result.mean).toBe(5);
      expect(result.median).toBe(5);
      expect(result.stdDev).toBe(0);
    });

    it('should throw error for empty array', () => {
      expect(() => calculator.calculate([])).toThrow('Data set cannot be empty');
    });

    it('should handle negative numbers', () => {
      const result = calculator.calculate([-5, -3, -1, 1, 3]);
      expect(result.mean).toBe(-1);
    });

    it('should handle decimal numbers', () => {
      const result = calculator.calculate([1.5, 2.5, 3.5]);
      expect(result.mean).toBeCloseTo(2.5, 5);
    });
  });
});

// __tests__/components/history/HistoryPanel.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { HistoryPanel } from '@/components/history/HistoryPanel';
import { useCalculatorStore } from '@/store/calculator';

// Mock the store
jest.mock('@/store/calculator');

describe('HistoryPanel', () => {
  const mockHistory = [
    {
      id: '1',
      expression: 'sin(30)',
      result: '0.5',
      timestamp: Date.now() - 1000,
      mode: 'deg' as const
    },
    {
      id: '2',
      expression: '2+3',
      result: '5',
      timestamp: Date.now() - 2000,
      mode: 'deg' as const
    }
  ];

  beforeEach(() => {
    (useCalculatorStore as jest.Mock).mockReturnValue({
      history: mockHistory,
      deleteHistoryEntry: jest.fn(),
      clearHistory: jest.fn(),
      loadHistoryEntry: jest.fn()
    });
  });

  it('should render history panel', () => {
    render(<HistoryPanel />);
    expect(screen.getByTestId('history-panel')).toBeInTheDocument();
  });

  it('should display history entries', () => {
    render(<HistoryPanel />);
    expect(screen.getByText('sin(30)')).toBeInTheDocument();
    expect(screen.getByText('0.5')).toBeInTheDocument();
    expect(screen.getByText('2+3')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('should show empty state when no history', () => {
    (useCalculatorStore as jest.Mock).mockReturnValue({
      history: [],
      deleteHistoryEntry: jest.fn(),
      clearHistory: jest.fn(),
      loadHistoryEntry: jest.fn()
    });

    render(<HistoryPanel />);
    expect(screen.getByText(/no history/i)).toBeInTheDocument();
  });

  it('should call loadHistoryEntry when item clicked', () => {
    const mockLoad = jest.fn();
    (useCalculatorStore as jest.Mock).mockReturnValue({
      history: mockHistory,
      deleteHistoryEntry: jest.fn(),
      clearHistory: jest.fn(),
      loadHistoryEntry: mockLoad
    });

    render(<HistoryPanel />);
    fireEvent.click(screen.getByText('sin(30)'));

    expect(mockLoad).toHaveBeenCalledWith(mockHistory[0]);
  });

  it('should call deleteHistoryEntry when delete clicked', () => {
    const mockDelete = jest.fn();
    (useCalculatorStore as jest.Mock).mockReturnValue({
      history: mockHistory,
      deleteHistoryEntry: mockDelete,
      clearHistory: jest.fn(),
      loadHistoryEntry: jest.fn()
    });

    render(<HistoryPanel />);
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    fireEvent.click(deleteButtons[0]);

    expect(mockDelete).toHaveBeenCalledWith('1');
  });

  it('should call clearHistory when clear all clicked', () => {
    const mockClear = jest.fn();
    (useCalculatorStore as jest.Mock).mockReturnValue({
      history: mockHistory,
      deleteHistoryEntry: jest.fn(),
      clearHistory: mockClear,
      loadHistoryEntry: jest.fn()
    });

    render(<HistoryPanel />);
    fireEvent.click(screen.getByRole('button', { name: /clear all/i }));

    expect(mockClear).toHaveBeenCalled();
  });
});

// __tests__/components/statistics/StatisticsCalculator.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { StatisticsCalculator } from '@/components/statistics/StatisticsCalculator';

describe('StatisticsCalculator Component', () => {
  it('should render statistics calculator', () => {
    render(<StatisticsCalculator />);
    expect(screen.getByTestId('statistics-calculator')).toBeInTheDocument();
  });

  it('should accept data input', () => {
    render(<StatisticsCalculator />);
    const input = screen.getByPlaceholderText(/enter numbers/i);

    fireEvent.change(input, { target: { value: '1, 2, 3, 4, 5' } });
    expect(input).toHaveValue('1, 2, 3, 4, 5');
  });

  it('should calculate statistics when button clicked', () => {
    render(<StatisticsCalculator />);
    const input = screen.getByPlaceholderText(/enter numbers/i);
    fireEvent.change(input, { target: { value: '1, 2, 3, 4, 5' } });

    fireEvent.click(screen.getByRole('button', { name: /calculate/i }));

    expect(screen.getByText(/mean.*3/i)).toBeInTheDocument();
    expect(screen.getByText(/median.*3/i)).toBeInTheDocument();
  });

  it('should show error for invalid input', () => {
    render(<StatisticsCalculator />);
    const input = screen.getByPlaceholderText(/enter numbers/i);
    fireEvent.change(input, { target: { value: 'invalid' } });

    fireEvent.click(screen.getByRole('button', { name: /calculate/i }));

    expect(screen.getByText(/invalid.*input/i)).toBeInTheDocument();
  });

  it('should clear results when clear clicked', () => {
    render(<StatisticsCalculator />);
    const input = screen.getByPlaceholderText(/enter numbers/i);
    fireEvent.change(input, { target: { value: '1, 2, 3' } });
    fireEvent.click(screen.getByRole('button', { name: /calculate/i }));

    expect(screen.getByText(/mean/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /clear/i }));
    expect(screen.queryByText(/mean/i)).not.toBeInTheDocument();
  });
});
```

#### Test Checklist
- [x] **Happy Path**: History CRUD operations, statistical calculations
- [x] **Edge Cases**: Empty history, single value, 100+ entries
- [x] **Error Cases**: Empty data set, invalid input
- [x] **Integration Points**: localStorage persistence, UI interactions
- [x] **Performance**: History operations < 50ms

#### Expected Test Results (Before Implementation)
```bash
❌ All tests should FAIL
Total: ~35 tests, 35 failed

Failures:
- HistoryService is not defined
- StatisticsCalculator is not defined
- HistoryPanel component not found
- StatisticsCalculator component not found
```

### Phase 2: GREEN (Make Tests Pass)

#### Implementation

```typescript
// src/types/history.ts
export interface HistoryEntry {
  id: string;
  expression: string;
  result: string;
  timestamp: number;
  mode: 'deg' | 'rad';
}

export interface CalculatorStorage {
  version: string;
  history: HistoryEntry[];
  preferences: {
    angleMode: 'deg' | 'rad';
    theme: 'light' | 'dark';
    historyLimit: number;
  };
}

// src/lib/storage/history.ts
import { HistoryEntry, CalculatorStorage } from '@/types/history';

export class HistoryService {
  private readonly STORAGE_KEY = 'calculator-state';
  private readonly MAX_HISTORY = 100;

  addEntry(entry: Omit<HistoryEntry, 'id' | 'timestamp'>): void {
    const storage = this.getStorage();
    const newEntry: HistoryEntry = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      ...entry
    };

    storage.history.unshift(newEntry);

    if (storage.history.length > this.MAX_HISTORY) {
      storage.history = storage.history.slice(0, this.MAX_HISTORY);
    }

    this.saveStorage(storage);
  }

  getHistory(): HistoryEntry[] {
    return this.getStorage().history;
  }

  deleteEntry(id: string): void {
    const storage = this.getStorage();
    storage.history = storage.history.filter(entry => entry.id !== id);
    this.saveStorage(storage);
  }

  clearHistory(): void {
    const storage = this.getStorage();
    storage.history = [];
    this.saveStorage(storage);
  }

  private getStorage(): CalculatorStorage {
    const data = localStorage.getItem(this.STORAGE_KEY);
    if (!data) {
      return this.getDefaultStorage();
    }
    try {
      return JSON.parse(data);
    } catch {
      return this.getDefaultStorage();
    }
  }

  private saveStorage(storage: CalculatorStorage): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(storage));
  }

  private getDefaultStorage(): CalculatorStorage {
    return {
      version: '1.0',
      history: [],
      preferences: {
        angleMode: 'deg',
        theme: 'light',
        historyLimit: 100
      }
    };
  }
}

// src/lib/calculator/statistics.ts
import { create, all } from 'mathjs';

const math = create(all);

export interface StatisticsResult {
  mean: number;
  median: number;
  stdDev: number;
  variance: number;
  count: number;
  min: number;
  max: number;
}

export class StatisticsCalculator {
  calculate(data: number[]): StatisticsResult {
    if (data.length === 0) {
      throw new Error('Data set cannot be empty');
    }

    return {
      mean: math.mean(data),
      median: math.median(data),
      stdDev: math.std(data, 'uncorrected'),
      variance: math.variance(data, 'uncorrected'),
      count: data.length,
      min: math.min(data),
      max: math.max(data)
    };
  }

  parseInput(input: string): number[] {
    const numbers = input
      .split(/[,\s]+/)
      .filter(s => s.trim())
      .map(s => parseFloat(s.trim()));

    if (numbers.some(n => isNaN(n))) {
      throw new Error('Invalid input: contains non-numeric values');
    }

    return numbers;
  }
}

// src/components/history/HistoryPanel.tsx
'use client';

import { useCalculatorStore } from '@/store/calculator';
import { HistoryItem } from './HistoryItem';

export function HistoryPanel() {
  const { history, deleteHistoryEntry, clearHistory, loadHistoryEntry } =
    useCalculatorStore();

  if (history.length === 0) {
    return (
      <div
        className="p-4 text-center text-gray-500"
        data-testid="history-panel"
      >
        No history yet. Start calculating!
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 p-4" data-testid="history-panel">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold">History</h3>
        <button
          onClick={clearHistory}
          className="text-sm text-red-600 hover:text-red-700"
        >
          Clear All
        </button>
      </div>

      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        {history.map((entry) => (
          <HistoryItem
            key={entry.id}
            entry={entry}
            onLoad={() => loadHistoryEntry(entry)}
            onDelete={() => deleteHistoryEntry(entry.id)}
          />
        ))}
      </div>
    </div>
  );
}

// src/components/history/HistoryItem.tsx
import { HistoryEntry } from '@/types/history';
import { formatDistanceToNow } from 'date-fns';

interface HistoryItemProps {
  entry: HistoryEntry;
  onLoad: () => void;
  onDelete: () => void;
}

export function HistoryItem({ entry, onLoad, onDelete }: HistoryItemProps) {
  return (
    <div
      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
      onClick={onLoad}
    >
      <div className="flex-1">
        <div className="text-sm font-mono">{entry.expression}</div>
        <div className="text-xs text-gray-500">
          = {entry.result} ({entry.mode})
        </div>
        <div className="text-xs text-gray-400">
          {formatDistanceToNow(entry.timestamp, { addSuffix: true })}
        </div>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="text-red-500 hover:text-red-700 ml-2"
        aria-label="Delete"
      >
        ✕
      </button>
    </div>
  );
}

// src/components/statistics/StatisticsCalculator.tsx
'use client';

import { useState } from 'react';
import { StatisticsCalculator as StatsCalc } from '@/lib/calculator/statistics';

export function StatisticsCalculator() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const calculator = new StatsCalc();

  const handleCalculate = () => {
    try {
      setError('');
      const data = calculator.parseInput(input);
      const stats = calculator.calculate(data);
      setResult(stats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid input');
      setResult(null);
    }
  };

  const handleClear = () => {
    setInput('');
    setResult(null);
    setError('');
  };

  return (
    <div className="p-4" data-testid="statistics-calculator">
      <h3 className="font-semibold mb-4">Statistics Calculator</h3>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter numbers separated by commas or spaces"
        className="w-full p-2 border rounded mb-2"
        rows={3}
      />

      <div className="flex gap-2 mb-4">
        <button
          onClick={handleCalculate}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Calculate
        </button>
        <button
          onClick={handleClear}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          Clear
        </button>
      </div>

      {error && (
        <div className="text-red-500 mb-2">{error}</div>
      )}

      {result && (
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>Mean: {result.mean.toFixed(4)}</div>
            <div>Median: {result.median.toFixed(4)}</div>
            <div>Std Dev: {result.stdDev.toFixed(4)}</div>
            <div>Variance: {result.variance.toFixed(4)}</div>
            <div>Count: {result.count}</div>
            <div>Min: {result.min}</div>
            <div>Max: {result.max}</div>
          </div>
        </div>
      )}
    </div>
  );
}

// Update src/store/calculator.ts to include history
import { HistoryService } from '@/lib/storage/history';
import { HistoryEntry } from '@/types/history';

interface CalculatorState {
  // ... existing state
  history: HistoryEntry[];
  deleteHistoryEntry: (id: string) => void;
  clearHistory: () => void;
  loadHistoryEntry: (entry: HistoryEntry) => void;
}

export const useCalculatorStore = create<CalculatorState>((set, get) => {
  const historyService = new HistoryService();

  return {
    // ... existing state and actions

    history: historyService.getHistory(),

    calculate: () => {
      const { expression, angleMode } = get();
      // ... existing calculation logic

      if (calcResult.success) {
        set({ result: calcResult.result! });

        // Add to history
        historyService.addEntry({
          expression,
          result: calcResult.result!,
          mode: angleMode
        });

        // Update history in state
        set({ history: historyService.getHistory() });
      }
    },

    deleteHistoryEntry: (id) => {
      historyService.deleteEntry(id);
      set({ history: historyService.getHistory() });
    },

    clearHistory: () => {
      historyService.clearHistory();
      set({ history: [] });
    },

    loadHistoryEntry: (entry) => {
      set({
        expression: entry.expression,
        result: entry.result,
        angleMode: entry.mode
      });
    }
  };
});
```

#### Implementation Checklist
- [x] HistoryService with localStorage persistence
- [x] StatisticsCalculator with all statistical functions
- [x] HistoryPanel UI component
- [x] StatisticsCalculator UI component
- [x] Integration with Zustand store
- [x] All test cases passing

#### Expected Test Results (After Implementation)
```bash
✅ All tests should PASS
Total: ~35 tests, 35 passed

 PASS  __tests__/lib/storage/history.test.ts
 PASS  __tests__/lib/calculator/statistics.test.ts
 PASS  __tests__/components/history/HistoryPanel.test.tsx
 PASS  __tests__/components/statistics/StatisticsCalculator.test.tsx
```

### Phase 3: REFACTOR (Improve Code Quality)

#### Refactoring Goals
- [x] **Code Structure**: Separate storage, business logic, and UI
- [x] **Error Handling**: Graceful degradation for localStorage issues
- [x] **Performance**: Memoize statistics results
- [x] **Accessibility**: ARIA labels, keyboard navigation
- [x] **Type Safety**: Comprehensive TypeScript types
- [x] **Documentation**: JSDoc comments

#### Refactored Code

```typescript
// src/lib/storage/history.ts (Refactored with better error handling)
/**
 * Service for managing calculation history with localStorage persistence
 */
export class HistoryService {
  private readonly STORAGE_KEY = 'calculator-state';
  private readonly MAX_HISTORY = 100;
  private readonly VERSION = '1.0';

  /**
   * Adds a new calculation to history
   * @param entry - Calculation entry without ID and timestamp
   * @throws Never - errors are caught and logged
   */
  addEntry(entry: Omit<HistoryEntry, 'id' | 'timestamp'>): void {
    try {
      const storage = this.getStorage();
      const newEntry: HistoryEntry = {
        id: this.generateId(),
        timestamp: Date.now(),
        ...entry
      };

      storage.history = this.addToHistory(storage.history, newEntry);
      this.saveStorage(storage);
    } catch (error) {
      console.error('Failed to add history entry:', error);
    }
  }

  /**
   * Retrieves all history entries
   * @returns Array of history entries, newest first
   */
  getHistory(): HistoryEntry[] {
    try {
      return this.getStorage().history;
    } catch (error) {
      console.error('Failed to get history:', error);
      return [];
    }
  }

  /**
   * Deletes a specific history entry
   * @param id - ID of entry to delete
   */
  deleteEntry(id: string): void {
    try {
      const storage = this.getStorage();
      storage.history = storage.history.filter(entry => entry.id !== id);
      this.saveStorage(storage);
    } catch (error) {
      console.error('Failed to delete history entry:', error);
    }
  }

  /**
   * Clears all history entries
   */
  clearHistory(): void {
    try {
      const storage = this.getStorage();
      storage.history = [];
      this.saveStorage(storage);
    } catch (error) {
      console.error('Failed to clear history:', error);
    }
  }

  private addToHistory(history: HistoryEntry[], newEntry: HistoryEntry): HistoryEntry[] {
    const updated = [newEntry, ...history];
    return updated.slice(0, this.MAX_HISTORY);
  }

  private generateId(): string {
    return crypto.randomUUID();
  }

  private getStorage(): CalculatorStorage {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (!data) {
        return this.getDefaultStorage();
      }
      const parsed = JSON.parse(data);
      return this.validateStorage(parsed);
    } catch {
      return this.getDefaultStorage();
    }
  }

  private validateStorage(data: any): CalculatorStorage {
    // Validate and migrate if needed
    if (data.version !== this.VERSION) {
      return this.migrateStorage(data);
    }
    return data;
  }

  private migrateStorage(oldData: any): CalculatorStorage {
    // Migration logic for future versions
    return this.getDefaultStorage();
  }

  private saveStorage(storage: CalculatorStorage): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(storage));
    } catch (error) {
      // Handle quota exceeded error
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        console.warn('Storage quota exceeded, clearing old entries');
        storage.history = storage.history.slice(0, 50);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(storage));
      }
    }
  }

  private getDefaultStorage(): CalculatorStorage {
    return {
      version: this.VERSION,
      history: [],
      preferences: {
        angleMode: 'deg',
        theme: 'light',
        historyLimit: this.MAX_HISTORY
      }
    };
  }
}
```

#### Refactoring Checklist
- [x] Tests still pass
- [x] Error handling improved
- [x] localStorage quota handling
- [x] Version migration support
- [x] JSDoc comments added
- [x] Accessibility improvements

## Acceptance Criteria

### Functional Requirements
- [x] **History Tracking**: All calculations automatically saved
- [x] **History Display**: Chronological list, newest first
- [x] **History Actions**: Click to reload, delete individual, clear all
- [x] **Persistence**: History survives page reload
- [x] **Statistics**: Mean, median, std dev, variance, min, max
- [x] **Input Parsing**: Comma or space separated numbers
- [x] **Error Handling**: Invalid input, empty data set

### Code Quality Requirements
- [x] All tests pass
- [x] Code coverage ≥ 85%
- [x] No ESLint errors
- [x] localStorage gracefully handles errors

### Documentation Requirements
- [x] JSDoc for public APIs
- [x] Usage examples in components

## Test Coverage

### Unit Tests
```bash
Coverage:
- history.test.ts: 95%
- statistics.test.ts: 95%
```

### Integration Tests
- [x] History persistence across page reloads
- [x] Statistics calculator with UI

## Implementation Notes

### Files to Create
- [x] `src/types/history.ts`
- [x] `src/lib/storage/history.ts`
- [x] `src/lib/calculator/statistics.ts`
- [x] `src/components/history/HistoryPanel.tsx`
- [x] `src/components/history/HistoryItem.tsx`
- [x] `src/components/statistics/StatisticsCalculator.tsx`

### Files to Modify
- [x] `src/store/calculator.ts` - Add history state and actions

### Dependencies to Add
- [x] `date-fns` - Relative time formatting

## Estimated Context Size
**Estimated tokens**: ~18k tokens

### Code Volume Breakdown
- Implementation: ~1,000 lines
- Tests: ~750 lines
- Total: ~1,750 lines ≈ 18k tokens

## Verification Steps

1. **Run Tests**:
```bash
npm test __tests__/lib/storage
npm test __tests__/lib/calculator/statistics
npm test __tests__/components/history
npm test __tests__/components/statistics
```

2. **Manual Testing**:
- [x] Perform calculation, verify it appears in history
- [x] Click history item, verify it loads
- [x] Delete history item, verify it's removed
- [x] Reload page, verify history persists
- [x] Enter statistics data, verify results

## Potential Issues & Solutions

### Issue 1: localStorage Quota Exceeded
**Solution**: Implemented quota handling, reduce history to 50 entries on error

### Issue 2: Date Formatting Performance
**Solution**: Use date-fns for efficient relative time formatting

## Resources
- [LocalStorage API](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- [Math.js Statistics Functions](https://mathjs.org/docs/reference/functions.html#statistics-functions)
- [date-fns Documentation](https://date-fns.org/)

## Completion Checklist
- [x] ✅ Phase 1 (RED): Tests written and failing
- [x] ✅ Phase 2 (GREEN): Tests passing
- [x] ✅ Phase 3 (REFACTOR): Code improved
- [x] All acceptance criteria met
- [x] Code reviewed
- [x] Tests passing in CI/CD
- [x] Documentation updated

## Revision History
| Date | Version | Changes | Author |
|------|---------|---------|--------|
| 2025-10-31 | 1.0 | Initial task created | Feature Planning Team |
---

Provide your review now:

thinking
**Reviewing specification clarity and issues**

I’m carefully analyzing the document’s strengths and weaknesses, especially regarding TDD feasibility, environment compatibility like localStorage in SSR contexts, missing dependency mentions, acceptance criteria clarity, and testing coverage claims. I’ll organize feedback by severity to help lead decisions and suggest improvements to better align the spec with realistic implementation needs.
codex
## Strengths
- Clear narrative on why history/statistics matter plus cross-links to PRD/tech spec.
- RED phase enumerates concrete unit and UI tests that hit key happy paths and several edge/error cases.
- GREEN phase outlines end-to-end wiring from types → storage → UI, showing awareness of persistence, store integration, and UI hooks.
- Verification steps call out both automated and manual checks, reinforcing the TDD intent.

## Issues
- Critical – `HistoryService` is instantiated inside the Zustand store at module scope, which will execute `localStorage` calls during SSR or in Node-based tests; this will crash the app/test runner unless guarded for `window` availability.
- Major – The implementation plan depends on `mathjs`, but the dependencies section only mentions `date-fns`; forgetting to declare/install `mathjs` will break both the build and the statistics tests.
- Major – TDD section drifts from RED to GREEN prematurely by prescribing full implementation details (and even refactored code), reducing clarity on what the actual development steps should be and blurring ownership between spec and execution.
- Major – Acceptance criteria are all pre-checked, offering no clarity on what still needs validation and making the document read as if the feature already shipped.
- Major – Refactor goals call for memoization, accessibility tweaks, and localStorage error handling, but the plan lacks corresponding tests; the “95% coverage” claim is unsubstantiated.
- Minor – “History operations < 50 ms” is listed as a performance requirement without measurement guidance, tooling, or acceptance test, so it is not verifiable.
- Minor – Time estimate (3–4 days) seems optimistic for the breadth of storage, statistics logic, UI work, store integration, and extensive testing.

## Suggestions
1. Gate all storage access behind runtime checks (e.g., instantiate `HistoryService` lazily on the client or shim `localStorage` for SSR/tests).
2. Update the dependency plan to include `mathjs` (and any tree-shaking considerations) and ensure install instructions cover it.
3. Rework the TDD roadmap so RED only lists desired failing tests, GREEN references implementation themes rather than verbatim code, and REFACTOR focuses on objectives plus supporting tests.
4. Switch acceptance criteria and checklists from pre-checked boxes to actionable “to verify” items, ideally mapping each to its validating test/manual step.
5. Expand the test coverage plan to include cases for storage failure scenarios, SSR-safe behavior, and the post-refactor accessibility/memoization goals.
6. Revisit the effort estimate after scoping setup, implementation, testing, and review tasks; if 3–4 days is firm, call out assumptions (e.g., existing components/utilities) that make it achievable.
tokens used
9,820
## Strengths
- Clear narrative on why history/statistics matter plus cross-links to PRD/tech spec.
- RED phase enumerates concrete unit and UI tests that hit key happy paths and several edge/error cases.
- GREEN phase outlines end-to-end wiring from types → storage → UI, showing awareness of persistence, store integration, and UI hooks.
- Verification steps call out both automated and manual checks, reinforcing the TDD intent.

## Issues
- Critical – `HistoryService` is instantiated inside the Zustand store at module scope, which will execute `localStorage` calls during SSR or in Node-based tests; this will crash the app/test runner unless guarded for `window` availability.
- Major – The implementation plan depends on `mathjs`, but the dependencies section only mentions `date-fns`; forgetting to declare/install `mathjs` will break both the build and the statistics tests.
- Major – TDD section drifts from RED to GREEN prematurely by prescribing full implementation details (and even refactored code), reducing clarity on what the actual development steps should be and blurring ownership between spec and execution.
- Major – Acceptance criteria are all pre-checked, offering no clarity on what still needs validation and making the document read as if the feature already shipped.
- Major – Refactor goals call for memoization, accessibility tweaks, and localStorage error handling, but the plan lacks corresponding tests; the “95% coverage” claim is unsubstantiated.
- Minor – “History operations < 50 ms” is listed as a performance requirement without measurement guidance, tooling, or acceptance test, so it is not verifiable.
- Minor – Time estimate (3–4 days) seems optimistic for the breadth of storage, statistics logic, UI work, store integration, and extensive testing.

## Suggestions
1. Gate all storage access behind runtime checks (e.g., instantiate `HistoryService` lazily on the client or shim `localStorage` for SSR/tests).
2. Update the dependency plan to include `mathjs` (and any tree-shaking considerations) and ensure install instructions cover it.
3. Rework the TDD roadmap so RED only lists desired failing tests, GREEN references implementation themes rather than verbatim code, and REFACTOR focuses on objectives plus supporting tests.
4. Switch acceptance criteria and checklists from pre-checked boxes to actionable “to verify” items, ideally mapping each to its validating test/manual step.
5. Expand the test coverage plan to include cases for storage failure scenarios, SSR-safe behavior, and the post-refactor accessibility/memoization goals.
6. Revisit the effort estimate after scoping setup, implementation, testing, and review tasks; if 3–4 days is firm, call out assumptions (e.g., existing components/utilities) that make it achievable.
