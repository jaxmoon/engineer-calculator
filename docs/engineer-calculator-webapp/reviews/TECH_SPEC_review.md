# Review of TECH_SPEC.md

**Document Type**: tech_spec
**Reviewed by**: Codex CLI
**Date**: 2025-10-31 14:50:28

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
session id: 019a38cf-ff6f-7db2-9f20-c0bcd277bcd7
--------
user
Please review this tech spec document and provide detailed feedback.

You are a senior software engineer reviewing a Technical Specification.
Provide constructive feedback on:
1. Architecture and design decisions
2. API design and data models
3. Security considerations
4. Performance and scalability
5. Testing strategy
6. Potential technical risks

Format your review as:
## Strengths
[List what's well done]

## Issues
[List problems found, with severity: Critical/Major/Minor]

## Suggestions
[Specific recommendations for improvement]

Document to review:
---
# Technical Specification

## Document Information
- **Feature Name**: Engineer Calculator Web App
- **Created**: 2025-10-31
- **Engineer**: Feature Planning Team
- **Status**: Draft
- **Related PRD**: [PRD.md](./PRD.md)

## Overview
The Engineer Calculator Web App is a client-side, responsive web application built with Next.js and TypeScript. It leverages Math.js for precise scientific calculations, uses localStorage for history persistence, and implements a mobile-first responsive design with Tailwind CSS. The application requires no backend infrastructure, making it fast, secure, and cost-effective.

## Architecture
### System Architecture
```
┌──────────────────────────────────────────────────────────────┐
│                      User's Browser                          │
│  ┌────────────────────────────────────────────────────────┐  │
│  │              Next.js App (Client-Side)                 │  │
│  │                                                        │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐ │  │
│  │  │  Calculator  │  │   History    │  │    Unit     │ │  │
│  │  │  Component   │  │  Component   │  │  Converter  │ │  │
│  │  └──────┬───────┘  └──────┬───────┘  └──────┬──────┘ │  │
│  │         │                 │                 │         │  │
│  │         └─────────────────┼─────────────────┘         │  │
│  │                           │                           │  │
│  │                  ┌────────▼─────────┐                 │  │
│  │                  │   State Layer    │                 │  │
│  │                  │ (Zustand/Context)│                 │  │
│  │                  └────────┬─────────┘                 │  │
│  │                           │                           │  │
│  │         ┌─────────────────┼─────────────────┐         │  │
│  │         │                 │                 │         │  │
│  │  ┌──────▼───────┐  ┌──────▼───────┐ ┌──────▼──────┐  │  │
│  │  │   Math.js    │  │ localStorage │ │   Utils     │  │  │
│  │  │   Engine     │  │    (5MB)     │ │  (Helpers)  │  │  │
│  │  └──────────────┘  └──────────────┘ └─────────────┘  │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘

Deployment:
┌─────────────┐
│   Vercel    │ ← Static Deployment (SSG)
│     CDN     │ ← Global Edge Network
└─────────────┘
```

### Component Breakdown
#### Frontend
- **Framework**: Next.js 14+ (App Router, Static Site Generation)
- **Language**: TypeScript 5+
- **Styling**: Tailwind CSS 3+
- **State Management**: Zustand (lightweight, no boilerplate)
- **Key Components**:
  - `Calculator`: Main calculator interface with button grid and display
  - `Display`: Shows current expression and result
  - `ButtonGrid`: Scientific calculator button layout
  - `HistoryPanel`: Sidebar showing calculation history
  - `StatisticsCalculator`: Data input and statistical analysis
  - `UnitConverter`: Multi-category unit conversion tool
  - `ModeToggle`: Degree/Radian mode switcher
  - `ThemeToggle`: Light/Dark mode switcher (P1)

#### Libraries & Utilities
- **Math Engine**: Math.js (v12+) - Arbitrary precision, scientific functions
- **Storage**: localStorage API - History persistence
- **Validation**: Zod (v3+) - Input validation and type safety
- **Testing**: Jest + React Testing Library + Playwright
- **Build Tools**: Next.js built-in (Turbopack/Webpack)

#### Infrastructure
- **Hosting**: Vercel (Static Site Generation + Global CDN)
- **Database**: None (fully client-side)
- **Cache**: Browser cache + localStorage
- **CDN**: Vercel Edge Network (automatic)

## Data Model
### LocalStorage Schema
Since this is a client-side application, we use localStorage for persistence:

```typescript
// History Entry Schema
interface HistoryEntry {
  id: string;              // UUID v4
  expression: string;      // "sin(45) + log(10)"
  result: string;          // "1.70710678"
  timestamp: number;       // Unix timestamp
  mode: 'deg' | 'rad';     // Angle mode used
}

// Storage Schema
interface CalculatorStorage {
  version: string;         // "1.0" - for future migrations
  history: HistoryEntry[]; // Max 100 entries (FIFO)
  preferences: {
    angleMode: 'deg' | 'rad';
    theme: 'light' | 'dark';
    historyLimit: number;  // Default 100
  };
}

// Example localStorage structure:
// Key: "calculator-state"
// Value: JSON.stringify(CalculatorStorage)
```

### Data Flow
1. **Calculation Flow**:
   - User inputs expression via button clicks or keyboard
   - Input validated in real-time (Zod schema)
   - Expression built in state (Zustand store)
   - On "=" press, Math.js evaluates expression
   - Result displayed and saved to history
   - History persisted to localStorage

2. **History Flow**:
   - New calculation creates HistoryEntry
   - Entry added to beginning of history array
   - If history > 100 entries, remove oldest
   - Persist to localStorage
   - UI updates reactively from Zustand store

3. **Unit Conversion Flow**:
   - User selects category (length, weight, temp)
   - Enters value and source unit
   - Selects target unit
   - Conversion calculated using predefined tables
   - Result displayed instantly

## API Design
**Note**: This is a fully client-side application with no backend API. All data processing occurs in the browser.

### Internal Module APIs
The application exposes TypeScript modules with clear interfaces:

#### Calculator Engine API
```typescript
// lib/calculator/engine.ts
import { create, all } from 'mathjs';

const math = create(all, {
  precision: 14,        // Decimal precision
  number: 'BigNumber'   // Use BigNumber for accuracy
});

interface CalculationResult {
  success: boolean;
  result?: string;
  error?: string;
}

export class CalculatorEngine {
  /**
   * Evaluate mathematical expression
   * @param expression - Mathematical expression string
   * @param angleMode - 'deg' or 'rad' for trig functions
   * @returns Calculation result or error
   */
  evaluate(expression: string, angleMode: 'deg' | 'rad'): CalculationResult {
    try {
      // Configure angle mode
      if (angleMode === 'deg') {
        math.config({ angles: 'deg' });
      } else {
        math.config({ angles: 'rad' });
      }

      // Evaluate expression
      const result = math.evaluate(expression);

      return {
        success: true,
        result: math.format(result, { precision: 14 })
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Invalid expression'
      };
    }
  }

  /**
   * Calculate statistical measures
   * @param data - Array of numbers
   * @returns Statistical results
   */
  calculateStatistics(data: number[]): StatisticsResult {
    return {
      mean: math.mean(data),
      median: math.median(data),
      std: math.std(data, 'uncorrected'),    // Population std
      variance: math.variance(data, 'uncorrected'),
      count: data.length
    };
  }
}
```

#### Unit Converter API
```typescript
// lib/converter/units.ts
interface ConversionResult {
  value: number;
  fromUnit: string;
  toUnit: string;
}

export class UnitConverter {
  /**
   * Convert between units
   * @param value - Numeric value to convert
   * @param fromUnit - Source unit (e.g., 'km')
   * @param toUnit - Target unit (e.g., 'mi')
   * @param category - Unit category ('length', 'weight', 'temperature')
   * @returns Converted value
   */
  convert(
    value: number,
    fromUnit: string,
    toUnit: string,
    category: UnitCategory
  ): ConversionResult {
    const conversionTable = this.getConversionTable(category);

    // Convert to base unit, then to target unit
    const baseValue = value * conversionTable[fromUnit].toBase;
    const result = baseValue / conversionTable[toUnit].toBase;

    return { value: result, fromUnit, toUnit };
  }
}
```

#### History Service API
```typescript
// lib/storage/history.ts
export class HistoryService {
  private readonly STORAGE_KEY = 'calculator-state';
  private readonly MAX_HISTORY = 100;

  /**
   * Save calculation to history
   */
  addEntry(entry: Omit<HistoryEntry, 'id' | 'timestamp'>): void {
    const storage = this.getStorage();
    const newEntry: HistoryEntry = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      ...entry
    };

    storage.history.unshift(newEntry);

    // Trim to max size
    if (storage.history.length > this.MAX_HISTORY) {
      storage.history = storage.history.slice(0, this.MAX_HISTORY);
    }

    this.saveStorage(storage);
  }

  /**
   * Get all history entries
   */
  getHistory(): HistoryEntry[] {
    return this.getStorage().history;
  }

  /**
   * Clear all history
   */
  clearHistory(): void {
    const storage = this.getStorage();
    storage.history = [];
    this.saveStorage(storage);
  }

  /**
   * Delete specific entry
   */
  deleteEntry(id: string): void {
    const storage = this.getStorage();
    storage.history = storage.history.filter(entry => entry.id !== id);
    this.saveStorage(storage);
  }

  private getStorage(): CalculatorStorage {
    const data = localStorage.getItem(this.STORAGE_KEY);
    if (!data) {
      return this.getDefaultStorage();
    }
    return JSON.parse(data);
  }

  private saveStorage(storage: CalculatorStorage): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(storage));
  }
}
```

## Implementation Details
### Frontend Implementation
#### Project Structure
```
engineer-calculator/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── layout.tsx                # Root layout
│   │   ├── page.tsx                  # Home page (calculator)
│   │   └── globals.css               # Global styles
│   ├── components/
│   │   ├── calculator/
│   │   │   ├── Calculator.tsx        # Main calculator
│   │   │   ├── Display.tsx           # Display component
│   │   │   ├── ButtonGrid.tsx        # Button layout
│   │   │   ├── Button.tsx            # Individual button
│   │   │   └── ModeToggle.tsx        # Deg/Rad toggle
│   │   ├── history/
│   │   │   ├── HistoryPanel.tsx      # History sidebar
│   │   │   └── HistoryItem.tsx       # Single history entry
│   │   ├── statistics/
│   │   │   ├── StatisticsCalculator.tsx
│   │   │   └── DataInput.tsx
│   │   ├── converter/
│   │   │   ├── UnitConverter.tsx
│   │   │   └── CategorySelector.tsx
│   │   └── ui/                       # Reusable UI components
│   │       ├── Button.tsx
│   │       └── Panel.tsx
│   ├── lib/
│   │   ├── calculator/
│   │   │   ├── engine.ts             # Math.js wrapper
│   │   │   └── validation.ts         # Input validation
│   │   ├── converter/
│   │   │   ├── units.ts              # Unit conversion
│   │   │   └── tables.ts             # Conversion tables
│   │   ├── storage/
│   │   │   └── history.ts            # localStorage service
│   │   └── utils/
│   │       ├── format.ts             # Number formatting
│   │       └── keyboard.ts           # Keyboard handlers
│   ├── store/
│   │   └── calculator.ts             # Zustand store
│   ├── types/
│   │   ├── calculator.ts             # Type definitions
│   │   └── history.ts
│   └── constants/
│       ├── buttons.ts                # Button configurations
│       └── units.ts                  # Unit definitions
├── tests/
│   ├── unit/                         # Jest unit tests
│   ├── integration/                  # Integration tests
│   └── e2e/                          # Playwright E2E tests
├── public/
│   └── icons/                        # App icons
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

#### State Management (Zustand)
```typescript
// src/store/calculator.ts
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface CalculatorState {
  // Current state
  expression: string;
  result: string;
  angleMode: 'deg' | 'rad';
  history: HistoryEntry[];

  // Actions
  appendToExpression: (value: string) => void;
  setExpression: (expression: string) => void;
  calculate: () => void;
  clear: () => void;
  toggleAngleMode: () => void;
  loadHistoryEntry: (entry: HistoryEntry) => void;
  deleteHistoryEntry: (id: string) => void;
  clearHistory: () => void;
}

export const useCalculatorStore = create<CalculatorState>()(
  devtools(
    persist(
      (set, get) => ({
        expression: '',
        result: '',
        angleMode: 'deg',
        history: [],

        appendToExpression: (value) =>
          set((state) => ({
            expression: state.expression + value
          })),

        setExpression: (expression) =>
          set({ expression }),

        calculate: () => {
          const { expression, angleMode } = get();
          const engine = new CalculatorEngine();
          const result = engine.evaluate(expression, angleMode);

          if (result.success) {
            set({ result: result.result });
            // Add to history
            const historyService = new HistoryService();
            historyService.addEntry({ expression, result: result.result!, mode: angleMode });
          }
        },

        // ... other actions
      }),
      {
        name: 'calculator-storage',
        partialize: (state) => ({
          angleMode: state.angleMode,
          history: state.history
        })
      }
    )
  )
);
```

#### Component Examples
```typescript
// src/components/calculator/Calculator.tsx
'use client';

import { useCalculatorStore } from '@/store/calculator';
import { Display } from './Display';
import { ButtonGrid } from './ButtonGrid';
import { ModeToggle } from './ModeToggle';

export function Calculator() {
  const { expression, result, angleMode } = useCalculatorStore();

  return (
    <div className="flex flex-col gap-4 w-full max-w-md mx-auto p-4">
      <ModeToggle mode={angleMode} />
      <Display expression={expression} result={result} />
      <ButtonGrid />
    </div>
  );
}

// src/components/calculator/Display.tsx
interface DisplayProps {
  expression: string;
  result: string;
}

export function Display({ expression, result }: DisplayProps) {
  return (
    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 min-h-[100px]">
      <div className="text-right text-gray-600 dark:text-gray-400 text-sm mb-2">
        {expression || '0'}
      </div>
      <div className="text-right text-3xl font-bold">
        {result || '0'}
      </div>
    </div>
  );
}
```

#### Routing
```
/ → Calculator Home Page (Main Interface)
  - Calculator component
  - History panel (collapsible sidebar)
  - Statistics tab
  - Unit converter tab

No additional routes needed (single-page application)
```

### Responsive Design Strategy
```typescript
// Tailwind breakpoints:
// sm: 640px  - Small tablets
// md: 768px  - Tablets
// lg: 1024px - Desktop
// xl: 1280px - Large desktop

// Mobile-first approach:
<ButtonGrid className="
  grid grid-cols-4 gap-2        /* Mobile: 4 columns */
  md:grid-cols-5 md:gap-3       /* Tablet: 5 columns */
  lg:gap-4                       /* Desktop: larger gaps */
">
  <Button className="
    h-12 text-lg                 /* Mobile: smaller buttons */
    md:h-14 md:text-xl           /* Tablet: medium */
    lg:h-16 lg:text-2xl          /* Desktop: larger */
  " />
</ButtonGrid>
```

## Security Considerations
### Data Protection
- **Encryption at Rest**: Not required (client-side only, no sensitive data)
- **Encryption in Transit**: HTTPS enforced in production (Vercel automatic)
- **PII Handling**: No personal data collected or stored

### Input Validation
```typescript
// Prevent code injection via Math.js
const SAFE_EXPRESSION_PATTERN = /^[0-9+\-*/().sincotanlgexpqrt\s]+$/;

function validateExpression(expr: string): boolean {
  // Block dangerous patterns
  if (expr.includes('eval') || expr.includes('Function')) {
    return false;
  }

  // Allow only safe characters
  return SAFE_EXPRESSION_PATTERN.test(expr);
}
```

### XSS Prevention
- React's built-in XSS protection (auto-escaping)
- No `dangerouslySetInnerHTML` usage
- Content Security Policy headers via Next.js config

### Content Security Policy
```typescript
// next.config.js
const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline';
  style-src 'self' 'unsafe-inline';
  img-src 'self' blob: data:;
  font-src 'self';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests;
`;
```

## Performance Optimization
### Frontend
- **Code Splitting**:
  - Statistics calculator lazy-loaded
  - Unit converter lazy-loaded
  - Theme provider code-split

```typescript
// Lazy load non-critical features
const StatisticsCalculator = dynamic(
  () => import('@/components/statistics/StatisticsCalculator'),
  { loading: () => <LoadingSpinner /> }
);
```

- **Bundle Size Optimization**:
  - Target: < 200KB gzipped JS bundle
  - Tree-shake Math.js (only import needed functions)
  - Optimize Tailwind (purge unused classes)

```typescript
// Only import needed Math.js functions
import { create, all } from 'mathjs';

const math = create({
  // Only include needed functions
  sinDependencies,
  cosDependencies,
  tanDependencies,
  logDependencies,
  // ...
});
```

- **Image Optimization**: Next.js Image component with WebP format
- **Font Optimization**: Next.js Font optimization (preload, subset)

### Performance Targets
| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| First Contentful Paint (FCP) | < 1.5s | Lighthouse |
| Largest Contentful Paint (LCP) | < 2.5s | Lighthouse |
| Time to Interactive (TTI) | < 3.0s | Lighthouse |
| First Input Delay (FID) | < 100ms | Lighthouse |
| Cumulative Layout Shift (CLS) | < 0.1 | Lighthouse |
| Total Bundle Size | < 200KB gzipped | webpack-bundle-analyzer |
| Calculation Response | < 50ms | Custom performance marks |

## Testing Strategy
### Unit Tests (Jest + React Testing Library)
- **Coverage Target**: 85%+
- **Key Areas**:
  - [ ] CalculatorEngine: All math operations
  - [ ] UnitConverter: All conversion paths
  - [ ] HistoryService: CRUD operations
  - [ ] Validation functions: Edge cases
  - [ ] Utility functions: Format, parse
  - [ ] React components: Rendering, interactions

```typescript
// Example unit test
describe('CalculatorEngine', () => {
  const engine = new CalculatorEngine();

  it('should calculate sin(30) = 0.5 in degree mode', () => {
    const result = engine.evaluate('sin(30)', 'deg');
    expect(result.success).toBe(true);
    expect(Number(result.result)).toBeCloseTo(0.5, 5);
  });

  it('should handle division by zero', () => {
    const result = engine.evaluate('1/0', 'deg');
    expect(result.success).toBe(false);
    expect(result.error).toContain('division by zero');
  });
});
```

### Integration Tests
- [ ] History persistence (localStorage integration)
- [ ] Calculator + History integration
- [ ] Mode switching affects calculations
- [ ] Theme persistence

### E2E Tests (Playwright)
```typescript
// tests/e2e/calculator.spec.ts
test('complete calculation flow', async ({ page }) => {
  await page.goto('/');

  // Perform calculation: sin(45) + log(10)
  await page.click('text=sin');
  await page.fill('input[role="textbox"]', '45');
  await page.click('text=+');
  await page.click('text=log');
  await page.fill('input[role="textbox"]', '10');
  await page.click('text==');

  // Verify result
  await expect(page.locator('[data-testid="result"]'))
    .toHaveText(/1.707/);

  // Check history
  await page.click('[data-testid="history-toggle"]');
  await expect(page.locator('[data-testid="history-item"]').first())
    .toContainText('sin(45) + log(10)');
});

test('mobile responsive design', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
  await page.goto('/');

  // Verify buttons are touch-friendly
  const button = page.locator('button:has-text("7")');
  const box = await button.boundingBox();
  expect(box?.width).toBeGreaterThan(44); // iOS minimum touch target
  expect(box?.height).toBeGreaterThan(44);
});
```

### Test Data
```typescript
// Test fixtures
export const testCalculations = [
  { expr: 'sin(30)', mode: 'deg', expected: '0.5' },
  { expr: 'log(100)', mode: 'deg', expected: '2' },
  { expr: 'sqrt(16)', mode: 'deg', expected: '4' },
];

export const testHistoryEntries: HistoryEntry[] = [
  {
    id: '1',
    expression: 'sin(45)',
    result: '0.70710678',
    timestamp: Date.now() - 1000,
    mode: 'deg'
  },
];
```

## Deployment Strategy
### Environments
- **Development**: `http://localhost:3000` (local dev server)
- **Preview**: Auto-generated Vercel preview URLs per PR
- **Production**: `https://engineer-calculator.vercel.app` (or custom domain)

### CI/CD Pipeline (GitHub Actions + Vercel)
```
[Push to main]
    ↓
[GitHub Actions]
    ├─→ [Lint (ESLint + Prettier)]
    ├─→ [Type Check (tsc)]
    ├─→ [Unit Tests (Jest)] ────────────→ [Fail] → [Notify]
    ├─→ [Build (Next.js)]               ↓
    └─→ [E2E Tests (Playwright)]        [Pass]
                ↓                         ↓
           [Vercel Auto-Deploy] ──→ [Production]
                ↓
      [Lighthouse CI Check]
                ↓
    [Performance Budget Verification]
```

**GitHub Actions Workflow**:
```yaml
# .github/workflows/ci.yml
name: CI/CD

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Lint
        run: npm run lint

      - name: Type check
        run: npm run type-check

      - name: Unit tests
        run: npm run test:coverage

      - name: Build
        run: npm run build

      - name: E2E tests
        run: npm run test:e2e

      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

### Vercel Configuration
```json
// vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

### Feature Flags (Optional for P1+)
Using environment variables for gradual rollout:
```typescript
// Feature flags for gradual feature rollout
const FEATURES = {
  DARK_MODE: process.env.NEXT_PUBLIC_FEATURE_DARK_MODE === 'true',
  GRAPH_PLOTTING: process.env.NEXT_PUBLIC_FEATURE_GRAPHS === 'true',
  PWA: process.env.NEXT_PUBLIC_FEATURE_PWA === 'true',
};
```

## Monitoring & Observability
### Logging (Client-Side)
```typescript
// lib/utils/logger.ts
class Logger {
  private static instance: Logger;

  info(message: string, data?: any) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[INFO] ${message}`, data);
    }
  }

  error(message: string, error?: Error) {
    console.error(`[ERROR] ${message}`, error);

    // Send to error tracking service (Sentry)
    if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
      Sentry.captureException(error, { extra: { message } });
    }
  }
}
```

### Metrics (Vercel Analytics)
- **Core Web Vitals**: Auto-tracked by Vercel
- **Custom Events**:
  - Calculation performed (count)
  - History item clicked (count)
  - Unit conversion used (count, category)
  - Error occurred (count, type)

```typescript
// Track custom events
import { Analytics } from '@vercel/analytics/react';

function trackCalculation(expression: string) {
  if (typeof window !== 'undefined' && window.va) {
    window.va('track', 'calculation', { expression });
  }
}
```

### Error Tracking (Sentry - Optional P1)
```typescript
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,
  environment: process.env.NODE_ENV,
  beforeSend(event) {
    // Scrub sensitive data
    if (event.request) {
      delete event.request.cookies;
    }
    return event;
  },
});
```

### Dashboards
- **Vercel Analytics**: Real-time usage, performance, errors
- **Lighthouse CI**: Historical performance trends
- **GitHub Actions**: Build and test status

## Dependencies
### External Services
- **Vercel**: Hosting and CDN (free tier sufficient)
- **Sentry** (Optional P1): Error tracking
- **Vercel Analytics** (Optional P1): Usage analytics

### Libraries & Packages
#### Core Dependencies
```json
{
  "dependencies": {
    "next": "^14.2.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "typescript": "^5.4.0",
    "mathjs": "^12.4.0",
    "zustand": "^4.5.0",
    "zod": "^3.22.0",
    "tailwindcss": "^3.4.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.0"
  },
  "devDependencies": {
    "@types/node": "^20.11.0",
    "@types/react": "^18.2.0",
    "@testing-library/react": "^14.2.0",
    "@testing-library/jest-dom": "^6.4.0",
    "@playwright/test": "^1.42.0",
    "jest": "^29.7.0",
    "jest-environment-jsdom": "^29.7.0",
    "eslint": "^8.57.0",
    "eslint-config-next": "^14.2.0",
    "prettier": "^3.2.0",
    "@vercel/analytics": "^1.2.0"
  }
}
```

## Migration Plan
**Not applicable** - This is a new project with no existing data to migrate.

## Timeline & Milestones
| Milestone | Tasks | Target Date | Priority |
|-----------|-------|-------------|----------|
| **M1: Core Calculator** | Basic arithmetic, scientific functions, responsive UI, keyboard support | Week 1 (Day 7) | P0 |
| **M2: History & Statistics** | History panel, localStorage persistence, statistical functions | Week 2 (Day 10) | P0 |
| **M3: Unit Converter** | Unit conversion for length, weight, temperature categories | Week 2 (Day 14) | P0 |
| **M4: Polish & Testing** | E2E tests, accessibility, performance optimization, bug fixes | Week 2 (Day 14) | P0 |

**Detailed breakdown will be in individual TASK files.**

## Open Technical Questions
1. Should we use BigNumber for all calculations or only for specific precision-critical operations?
2. What is the optimal history size limit to balance UX and localStorage performance?
3. Should keyboard shortcuts be configurable by users?
4. Do we need to support copy/paste of results with preserved precision?

## Alternatives Considered
### Alternative 1: Vanilla JavaScript (No Framework)
- **Pros**: Smallest bundle size, fastest initial load, no framework overhead
- **Cons**: More boilerplate, no built-in routing/optimization, harder to maintain
- **Decision**: Not chosen - Next.js provides significant DX improvements and built-in optimizations worth the small overhead

### Alternative 2: React Context API (Instead of Zustand)
- **Pros**: No additional dependency, built into React
- **Cons**: More boilerplate, performance issues with frequent updates, no devtools
- **Decision**: Not chosen - Zustand provides better performance and DX for calculator state updates

### Alternative 3: React + Vite (Instead of Next.js)
- **Pros**: Faster dev server, simpler configuration
- **Cons**: No built-in SSG, no image optimization, manual routing setup
- **Decision**: Not chosen - Next.js provides better production optimizations and deployment integration with Vercel

### Alternative 4: Backend API for Calculations
- **Pros**: More control over precision, centralized logic
- **Cons**: Adds latency, requires server infrastructure, unnecessary complexity
- **Decision**: Not chosen - Client-side calculations are instant and sufficient for this use case

## References
- [Math.js Documentation](https://mathjs.org/docs/index.html)
- [Next.js App Router Guide](https://nextjs.org/docs/app)
- [Zustand Documentation](https://docs.pmnd.rs/zustand/getting-started/introduction)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Web Content Accessibility Guidelines (WCAG) 2.1](https://www.w3.org/WAI/WCAG21/quickref/)
- [Playwright Testing Documentation](https://playwright.dev/docs/intro)

## Revision History
| Date | Version | Changes | Author |
|------|---------|---------|--------|
| 2025-10-31 | 1.0 | Initial draft | Feature Planning Team |
---

Provide your review now:


thinking
**Providing detailed technical review**

I'll analyze the specification carefully, highlighting architecture, state management, security, performance, and testing aspects. I’ll identify critical and major issues like invalid angle config, mismatched persistent storage keys causing stale history, unsafe CSP settings, incomplete regex patterns affecting expression safety, as well as other usability and performance concerns. I'll also capture strengths and structure the review with clear severity ratings and references to spec sections as best I can without line numbers.
thinking
**Summarizing critical and major issues**

I’m organizing key problems like the critical persistence key mismatch causing stale history, SSR access to browser-only APIs causing errors, incomplete expression validation regex, and unsafe CSP settings. I also note unrealistic performance expectations and several minor gaps in error handling and feature implementation. I'll ensure these issues tie to spec sections clearly for a structured review.
codex
## Strengths
- Clear single-route, client-first architecture and component breakdown that maps well to the required features.
- Thoughtful testing plan spanning unit, integration, and E2E layers, with concrete tooling and sample tests.
- Deployment/CI story is detailed, including linting, coverage reporting, and performance checks.
- Data flow narratives (calculation, history, converter) make intent explicit and help future contributors onboard quickly.

## Issues
- Critical – `CalculatorEngine.evaluate` (Technical Specification, Calculator Engine API): `math.config({ angles: 'deg'|'rad' })` is not a supported Math.js option, so the degree/radian toggle will silently do nothing and trig results in degree mode will be wrong. Unit tests relying on degree mode will fail.
- Critical – `HistoryService` vs Zustand store (Technical Specification, History Service API & State Management): history is saved under the key `calculator-state`, while the persisted store uses `calculator-storage`; the store never updates its own `history` array when `addEntry` runs. The UI will not reflect new history entries until a reload, making the core history feature unusable.
- Major – SSR/client boundary (Technical Specification, History Service API & State Management): both the store and `HistoryService` touch `localStorage`/`crypto.randomUUID` at module scope. In Next.js App Router builds these modules execute during SSR/SSG, leading to `ReferenceError: localStorage is not defined` and hydration mismatches unless they are explicitly made client-only.
- Major – Expression validation (Technical Specification, Security Considerations): `SAFE_EXPRESSION_PATTERN` excludes operators such as `^`, `%`, scientific constants, function commas, etc. It will block common scientific expressions while still not guaranteeing Math.js safety (`import`, `createUnit`, `derivative` remain available). This undermines both functionality and the security goal.
- Major – CSP policy (Technical Specification, Security Considerations > Content Security Policy): shipping with `script-src 'unsafe-inline' 'unsafe-eval'` negates much of the claimed XSS protection. `'unsafe-eval'` is especially risky given third-party libs and contradicts the “fast, secure” positioning.
- Major – Performance target realism (Technical Specification, Performance Optimization): the spec targets `<200KB gzipped` bundle while including Math.js (BigNumber build), Zustand, Tailwind, Playwright instrumentation, etc. Math.js alone typically exceeds that budget unless a custom build tree-shakes aggressively. The plan doesn’t specify how to achieve it.
- Minor – History limit preference (Technical Specification, Data Model & HistoryService): `preferences.historyLimit` is defined but `HistoryService` hardcodes `MAX_HISTORY = 100`, so user-configurable limits won’t work.
- Minor – History storage resilience (Technical Specification, History Service API): `JSON.parse` on tampered/corrupted localStorage will throw and break the app with no recovery path or schema migration handling.
- Minor – Unit converter robustness (Technical Specification, Unit Converter API): `conversionTable[fromUnit]` assumes perfect data; a missing unit key (mismatch with UI config) will throw. Defensive checks and meaningful errors are absent.

## Suggestions
- Fix degree/radian handling: either convert inputs manually when `angleMode === 'deg'` or rely on Math.js units (`sin(math.unit(45, 'deg'))`) and verify with dedicated tests.
- Reconcile persistence: use a single source of truth by having Zustand’s `persist` middleware manage history (with `createJSONStorage(() => localStorage)`), or have the store subscribe to `HistoryService` updates. Ensure both use the same storage key and keep in-memory state in sync.
1. Mark store/history modules as client-only (`'use client'`) and guard all storage/crypto access with runtime checks to avoid SSR failures.
2. Replace the simplistic regex with a safer parser strategy: whitelist Math.js functions explicitly and disable dangerous ones via `math.import({ import: () => { throw ... }}, { override: true })`. Expand validation coverage tests for legitimate expressions.
3. Harden the CSP by removing `'unsafe-eval'`/`'unsafe-inline'` in production; if inline styles/scripts are required, switch to hashed policies or CSS modules.
4. Revisit bundle budget: quantify current Math.js footprint, outline a custom build (only required dependencies) or evaluate lighter alternatives; adjust the target if necessary.
5. Respect and surface user-configured history limits, and wrap localStorage reads with try/catch plus versioned migrations.
6. Add validation in `UnitConverter.convert` for unknown units/categories and surface a user-friendly error path to avoid hard crashes.
7. Expand the testing plan to cover the SSR/client boundary (e.g., store hydration), expression validation bypass attempts, and performance budgets with realistic sample bundles.
tokens used
12,921
## Strengths
- Clear single-route, client-first architecture and component breakdown that maps well to the required features.
- Thoughtful testing plan spanning unit, integration, and E2E layers, with concrete tooling and sample tests.
- Deployment/CI story is detailed, including linting, coverage reporting, and performance checks.
- Data flow narratives (calculation, history, converter) make intent explicit and help future contributors onboard quickly.

## Issues
- Critical – `CalculatorEngine.evaluate` (Technical Specification, Calculator Engine API): `math.config({ angles: 'deg'|'rad' })` is not a supported Math.js option, so the degree/radian toggle will silently do nothing and trig results in degree mode will be wrong. Unit tests relying on degree mode will fail.
- Critical – `HistoryService` vs Zustand store (Technical Specification, History Service API & State Management): history is saved under the key `calculator-state`, while the persisted store uses `calculator-storage`; the store never updates its own `history` array when `addEntry` runs. The UI will not reflect new history entries until a reload, making the core history feature unusable.
- Major – SSR/client boundary (Technical Specification, History Service API & State Management): both the store and `HistoryService` touch `localStorage`/`crypto.randomUUID` at module scope. In Next.js App Router builds these modules execute during SSR/SSG, leading to `ReferenceError: localStorage is not defined` and hydration mismatches unless they are explicitly made client-only.
- Major – Expression validation (Technical Specification, Security Considerations): `SAFE_EXPRESSION_PATTERN` excludes operators such as `^`, `%`, scientific constants, function commas, etc. It will block common scientific expressions while still not guaranteeing Math.js safety (`import`, `createUnit`, `derivative` remain available). This undermines both functionality and the security goal.
- Major – CSP policy (Technical Specification, Security Considerations > Content Security Policy): shipping with `script-src 'unsafe-inline' 'unsafe-eval'` negates much of the claimed XSS protection. `'unsafe-eval'` is especially risky given third-party libs and contradicts the “fast, secure” positioning.
- Major – Performance target realism (Technical Specification, Performance Optimization): the spec targets `<200KB gzipped` bundle while including Math.js (BigNumber build), Zustand, Tailwind, Playwright instrumentation, etc. Math.js alone typically exceeds that budget unless a custom build tree-shakes aggressively. The plan doesn’t specify how to achieve it.
- Minor – History limit preference (Technical Specification, Data Model & HistoryService): `preferences.historyLimit` is defined but `HistoryService` hardcodes `MAX_HISTORY = 100`, so user-configurable limits won’t work.
- Minor – History storage resilience (Technical Specification, History Service API): `JSON.parse` on tampered/corrupted localStorage will throw and break the app with no recovery path or schema migration handling.
- Minor – Unit converter robustness (Technical Specification, Unit Converter API): `conversionTable[fromUnit]` assumes perfect data; a missing unit key (mismatch with UI config) will throw. Defensive checks and meaningful errors are absent.

## Suggestions
- Fix degree/radian handling: either convert inputs manually when `angleMode === 'deg'` or rely on Math.js units (`sin(math.unit(45, 'deg'))`) and verify with dedicated tests.
- Reconcile persistence: use a single source of truth by having Zustand’s `persist` middleware manage history (with `createJSONStorage(() => localStorage)`), or have the store subscribe to `HistoryService` updates. Ensure both use the same storage key and keep in-memory state in sync.
1. Mark store/history modules as client-only (`'use client'`) and guard all storage/crypto access with runtime checks to avoid SSR failures.
2. Replace the simplistic regex with a safer parser strategy: whitelist Math.js functions explicitly and disable dangerous ones via `math.import({ import: () => { throw ... }}, { override: true })`. Expand validation coverage tests for legitimate expressions.
3. Harden the CSP by removing `'unsafe-eval'`/`'unsafe-inline'` in production; if inline styles/scripts are required, switch to hashed policies or CSS modules.
4. Revisit bundle budget: quantify current Math.js footprint, outline a custom build (only required dependencies) or evaluate lighter alternatives; adjust the target if necessary.
5. Respect and surface user-configured history limits, and wrap localStorage reads with try/catch plus versioned migrations.
6. Add validation in `UnitConverter.convert` for unknown units/categories and surface a user-friendly error path to avoid hard crashes.
7. Expand the testing plan to cover the SSR/client boundary (e.g., store hydration), expression validation bypass attempts, and performance budgets with realistic sample bundles.
