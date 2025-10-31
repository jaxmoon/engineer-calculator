# Engineer Calculator

Advanced calculator for engineers with history, statistics, and unit conversion.

## Features

- **Core Calculator**: Scientific calculator with trigonometric functions, logarithms, and more
- **History & Statistics**: Track calculation history and compute statistics
- **Unit Converter**: Convert between various units (length, weight, temperature, etc.)

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Math Engine**: Math.js
- **Testing**: Jest, React Testing Library, Playwright

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run tests
npm test

# Run E2E tests
npm run test:e2e

# Build for production
npm run build
```

## Development

This project follows TDD (Test-Driven Development) methodology:
1. RED: Write failing tests
2. GREEN: Implement code to pass tests
3. REFACTOR: Improve code quality

## Project Structure

```
├── app/              # Next.js app router pages
├── components/       # React components
├── lib/              # Business logic
│   ├── calculator/   # Calculator engine
│   ├── converter/    # Unit converter
│   ├── storage/      # History storage
│   └── utils/        # Utilities
├── store/            # Zustand state management
├── types/            # TypeScript types
├── __tests__/        # Unit & integration tests
└── e2e/              # E2E tests
```

## License

MIT
