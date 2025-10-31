# 병렬 실행 전략 (Parallel Execution Strategy)

## 📊 의존성 분석 (Dependency Analysis)

### Dependency Graph
```
┌─────────────────────────────────────────────────────────────┐
│                      TASK-001                               │
│                  Core Calculator                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Calculator   │  │   Zustand    │  │     UI       │     │
│  │   Engine     │  │    Store     │  │  Framework   │     │
│  │  (Math.js)   │  │              │  │  (Tailwind)  │     │
│  └───────┬──────┘  └───────┬──────┘  └───────┬──────┘     │
│          │                 │                  │             │
└──────────┼─────────────────┼──────────────────┼─────────────┘
           │                 │                  │
           ▼                 ▼                  ▼
    ┌──────────────┐   ┌──────────────┐
    │  TASK-002    │   │  TASK-003    │
    │   History    │   │     Unit     │
    │      &       │   │  Converter   │
    │  Statistics  │   │              │
    └──────────────┘   └──────────────┘
         (독립)            (독립)
```

### 의존성 매트릭스

| Task | Depends On | Blocks | Can Start When |
|------|------------|--------|----------------|
| **TASK-001** | None | TASK-002, TASK-003 | Immediately |
| **TASK-002** | TASK-001 (Engine + Store) | None | TASK-001 Phase 2 완료 후 |
| **TASK-003** | TASK-001 (UI Framework) | None | TASK-001 Phase 2 완료 후 |

**핵심 발견**:
- ✅ TASK-002와 TASK-003은 **서로 독립적** → 병렬 실행 가능
- ⚠️ 둘 다 TASK-001의 **Phase 2 (GREEN)** 완료를 기다려야 함
- 🎯 Critical Path: TASK-001 → TASK-002 (가장 긴 경로)

---

## 🏗️ 3-Phase 병렬 실행 전략

### Phase 0: 프로젝트 인프라 (공통 선행 작업)
**Duration**: 0.5일
**Parallelization**: ❌ 순차적 (단일 작업)

```bash
┌─────────────────────────────────────────────────────────┐
│ Phase 0: Infrastructure Setup (0.5 days)                │
├─────────────────────────────────────────────────────────┤
│ 1. Next.js 14 + TypeScript 프로젝트 초기화              │
│ 2. Dependencies 설치                                     │
│    - mathjs, zustand, date-fns                          │
│    - @testing-library/react, jest, playwright           │
│ 3. 프로젝트 구조 생성                                    │
│ 4. Jest/Playwright 설정                                 │
│ 5. Tailwind CSS 설정                                    │
│ 6. ESLint/Prettier 설정                                 │
└─────────────────────────────────────────────────────────┘
```

**산출물**:
- `package.json`, `tsconfig.json`, `jest.config.js`, `playwright.config.ts`
- 기본 프로젝트 디렉토리 구조

---

### Phase 1: TASK-001 Foundation (병렬 준비)
**Duration**: 2-3일
**Parallelization**: ⚠️ 부분 병렬 (모듈별 분리)

#### 1A: Calculator Engine (Track A)
```typescript
┌─────────────────────────────────────────────┐
│ Track A: Calculator Engine (2 days)        │
├─────────────────────────────────────────────┤
│ RED Phase (0.5일):                          │
│ - engine.test.ts 작성 (~45 tests)          │
│ - validation.test.ts 작성                  │
│                                             │
│ GREEN Phase (1일):                          │
│ - CalculatorEngine 구현                    │
│ - Math.js 각도 처리 (unit-based)           │
│ - Input validation                         │
│                                             │
│ REFACTOR Phase (0.5일):                     │
│ - Error handling 개선                      │
│ - JSDoc 추가                               │
└─────────────────────────────────────────────┘
```

**파일**:
- `src/lib/calculator/engine.ts`
- `src/lib/calculator/validation.ts`
- `__tests__/lib/calculator/engine.test.ts`
- `__tests__/lib/calculator/validation.test.ts`

#### 1B: State Management (Track B - 병렬)
```typescript
┌─────────────────────────────────────────────┐
│ Track B: Zustand Store (1.5 days)          │
├─────────────────────────────────────────────┤
│ RED Phase (0.5일):                          │
│ - store 테스트 작성                         │
│                                             │
│ GREEN Phase (0.5일):                        │
│ - Zustand store 구현                       │
│ - SSR guards 추가                          │
│ - Persist middleware 설정                  │
│                                             │
│ REFACTOR Phase (0.5일):                     │
│ - Storage key 통일                         │
│ - Type safety 강화                         │
└─────────────────────────────────────────────┘
```

**파일**:
- `src/store/calculator.ts`
- `src/types/calculator.ts`
- `__tests__/store/calculator.test.ts`

#### 1C: UI Components (Track C - 병렬)
```typescript
┌─────────────────────────────────────────────┐
│ Track C: UI Framework (2.5 days)           │
├─────────────────────────────────────────────┤
│ RED Phase (1일):                            │
│ - Calculator.test.tsx                      │
│ - Display.test.tsx                         │
│ - ButtonGrid.test.tsx                      │
│ - Keyboard handler tests                   │
│                                             │
│ GREEN Phase (1일):                          │
│ - Calculator, Display, ButtonGrid 구현     │
│ - Responsive layout (Tailwind)            │
│ - Keyboard handler                         │
│                                             │
│ REFACTOR Phase (0.5일):                     │
│ - Button config 추출                       │
│ - Accessibility 개선                       │
└─────────────────────────────────────────────┘
```

**파일**:
- `src/components/calculator/Calculator.tsx`
- `src/components/calculator/Display.tsx`
- `src/components/calculator/ButtonGrid.tsx`
- `src/components/calculator/Button.tsx`
- `src/lib/utils/keyboard.ts`
- `src/constants/buttons.ts`

**Synchronization Point 1**:
- Track A, B, C 모두 GREEN Phase 완료 후 통합 테스트
- Duration: 0.5일

---

### Phase 2: TASK-002 & TASK-003 (완전 병렬)
**Duration**: 3-4일 (최대값 기준)
**Parallelization**: ✅ 완전 병렬

#### 2A: History & Statistics (Track A)
```typescript
┌─────────────────────────────────────────────┐
│ Track A: TASK-002 (3-4 days)               │
├─────────────────────────────────────────────┤
│ RED Phase (1일):                            │
│ - HistoryService tests (~20 tests)         │
│ - StatisticsCalculator tests (~15 tests)  │
│ - HistoryPanel component tests            │
│                                             │
│ GREEN Phase (1.5일):                        │
│ - HistoryService 구현                      │
│ - StatisticsCalculator 구현               │
│ - HistoryPanel UI 구현                    │
│ - Store에 history 통합                    │
│                                             │
│ REFACTOR Phase (0.5-1일):                  │
│ - localStorage 에러 처리                   │
│ - Quota exceeded 핸들링                   │
│ - date-fns 통합                           │
└─────────────────────────────────────────────┘
```

**파일**:
- `src/lib/storage/history.ts`
- `src/lib/calculator/statistics.ts`
- `src/components/history/HistoryPanel.tsx`
- `src/components/history/HistoryItem.tsx`
- `src/components/statistics/StatisticsCalculator.tsx`
- `src/types/history.ts`

#### 2B: Unit Converter (Track B - 병렬)
```typescript
┌─────────────────────────────────────────────┐
│ Track B: TASK-003 (2-3 days)               │
├─────────────────────────────────────────────┤
│ RED Phase (1일):                            │
│ - UnitConverter tests (~50 tests)          │
│ - Component tests                          │
│                                             │
│ GREEN Phase (1일):                          │
│ - UnitConverter 클래스 구현                │
│ - Conversion tables 정의                   │
│ - Temperature special handling            │
│ - UI components 구현                       │
│                                             │
│ REFACTOR Phase (0-1일):                    │
│ - Temperature 로직 리팩토링                │
│ - Precision 개선                           │
└─────────────────────────────────────────────┘
```

**파일**:
- `src/lib/converter/units.ts`
- `src/lib/converter/tables.ts`
- `src/components/converter/UnitConverter.tsx`
- `src/components/converter/CategorySelector.tsx`
- `src/components/converter/UnitSelector.tsx`
- `src/types/converter.ts`

**Synchronization Point 2**:
- Track A, B 모두 완료 후 통합 테스트
- Duration: 0.5일

---

### Phase 3: 통합 & 검증
**Duration**: 1일
**Parallelization**: ⚠️ 부분 병렬

```typescript
┌─────────────────────────────────────────────┐
│ Phase 3: Integration & Verification (1 day)│
├─────────────────────────────────────────────┤
│ 1. E2E 테스트 작성 & 실행 (0.5일)          │
│    - Complete calculation flow             │
│    - History access and reload             │
│    - Unit conversion                       │
│    - Responsive design                     │
│                                             │
│ 2. Performance & Accessibility (0.5일)      │
│    - Lighthouse CI                         │
│    - Bundle size 분석                      │
│    - Cross-browser testing                 │
│    - Accessibility audit                   │
└─────────────────────────────────────────────┘
```

---

## 📅 Timeline with Swim Lanes

```
Day │ Phase 0 │  Phase 1 (TASK-001)  │    Phase 2 (Parallel)    │ Phase 3 │
────┼─────────┼──────────────────────┼──────────────────────────┼─────────┤
0.5 │ ▓▓▓▓▓▓  │                      │                          │         │
    │ Infra   │                      │                          │         │
────┼─────────┼──────────────────────┼──────────────────────────┼─────────┤
1.0 │         │ ▓▓▓▓▓▓ Engine (A)    │                          │         │
    │         │ ▓▓▓▓ Store (B)       │                          │         │
    │         │ ▓▓▓▓▓▓▓ UI (C)       │                          │         │
────┼─────────┼──────────────────────┼──────────────────────────┼─────────┤
2.0 │         │ ▓▓▓▓▓▓ Engine (A)    │                          │         │
    │         │ ▓▓▓ Store (B)        │                          │         │
    │         │ ▓▓▓▓▓▓▓ UI (C)       │                          │         │
────┼─────────┼──────────────────────┼──────────────────────────┼─────────┤
2.5 │         │ ▓ Engine (A)         │                          │         │
    │         │                      │                          │         │
    │         │ ▓▓▓▓ UI (C)          │                          │         │
────┼─────────┼──────────────────────┼──────────────────────────┼─────────┤
3.0 │         │ 🔄 Integration       │                          │         │
────┼─────────┼──────────────────────┼──────────────────────────┼─────────┤
3.5 │         │                      │ ▓▓▓▓▓▓ History (A)       │         │
    │         │                      │ ▓▓▓▓▓▓ Units (B)         │         │
────┼─────────┼──────────────────────┼──────────────────────────┼─────────┤
4.5 │         │                      │ ▓▓▓▓▓▓▓ History (A)      │         │
    │         │                      │ ▓▓▓▓▓ Units (B)          │         │
────┼─────────┼──────────────────────┼──────────────────────────┼─────────┤
5.5 │         │                      │ ▓▓▓▓▓▓▓ History (A)      │         │
    │         │                      │ ▓▓ Units (B)             │         │
────┼─────────┼──────────────────────┼──────────────────────────┼─────────┤
6.5 │         │                      │ ▓▓▓ History (A)          │         │
    │         │                      │                          │         │
────┼─────────┼──────────────────────┼──────────────────────────┼─────────┤
7.0 │         │                      │ 🔄 Integration           │         │
────┼─────────┼──────────────────────┼──────────────────────────┼─────────┤
7.5 │         │                      │                          │ ▓▓▓▓▓▓  │
    │         │                      │                          │ E2E     │
────┼─────────┼──────────────────────┼──────────────────────────┼─────────┤
8.0 │         │                      │                          │ ▓▓▓     │
    │         │                      │                          │ Verify  │
────┼─────────┴──────────────────────┴──────────────────────────┴─────────┤
Total: 8.0 days (vs. 10-13 days sequential)
```

**Time Saved**: 2-5 days (20-38% faster) 🎯

---

## 📦 파일/모듈 소유권 매트릭스

### 공통 파일 (Phase 0)
| File | Owner | Notes |
|------|-------|-------|
| `package.json` | Infrastructure | 모든 dependencies |
| `tsconfig.json` | Infrastructure | TypeScript config |
| `jest.config.js` | Infrastructure | Test config |
| `tailwind.config.ts` | Infrastructure | Style config |

### TASK-001 전용 파일 (Phase 1)
| File Path | Track | Can Modify |
|-----------|-------|------------|
| `src/lib/calculator/engine.ts` | A | Only Track A |
| `src/lib/calculator/validation.ts` | A | Only Track A |
| `src/store/calculator.ts` | B | Only Track B |
| `src/components/calculator/*` | C | Only Track C |
| `src/lib/utils/keyboard.ts` | C | Only Track C |
| `src/constants/buttons.ts` | C | Only Track C |

### TASK-002 전용 파일 (Phase 2 - Track A)
| File Path | Owner | Conflict Risk |
|-----------|-------|---------------|
| `src/lib/storage/history.ts` | TASK-002 | ❌ Low |
| `src/lib/calculator/statistics.ts` | TASK-002 | ❌ Low |
| `src/components/history/*` | TASK-002 | ❌ Low |
| `src/components/statistics/*` | TASK-002 | ❌ Low |
| `src/types/history.ts` | TASK-002 | ❌ Low |

### TASK-003 전용 파일 (Phase 2 - Track B)
| File Path | Owner | Conflict Risk |
|-----------|-------|---------------|
| `src/lib/converter/units.ts` | TASK-003 | ❌ Low |
| `src/lib/converter/tables.ts` | TASK-003 | ❌ Low |
| `src/components/converter/*` | TASK-003 | ❌ Low |
| `src/types/converter.ts` | TASK-003 | ❌ Low |

### 공유 파일 (조심!)
| File Path | Shared By | Conflict Risk | Strategy |
|-----------|-----------|---------------|----------|
| `src/store/calculator.ts` | TASK-001, TASK-002 | ⚠️ Medium | TASK-001 먼저 완성, TASK-002가 extend |
| `src/app/page.tsx` | TASK-001, TASK-002, TASK-003 | ⚠️ High | Phase 3에서 통합 |
| `src/types/calculator.ts` | TASK-001, TASK-002 | ⚠️ Medium | TASK-001 먼저 정의 |

---

## 🔀 통합 전략 (Integration Strategy)

### Synchronization Point 1 (After Phase 1)
**목적**: TASK-001의 3개 track 통합

**체크리스트**:
1. ✅ CalculatorEngine이 store에서 호출 가능한지 확인
2. ✅ Store가 UI components에서 사용 가능한지 확인
3. ✅ Keyboard handler가 UI와 통합되는지 확인
4. ✅ 모든 unit tests pass (85%+ coverage)
5. ✅ Manual test: 브라우저에서 계산 동작 확인

**Integration Tests**:
```typescript
// __tests__/integration/calculator-flow.test.tsx
describe('Calculator Integration', () => {
  it('should perform end-to-end calculation', () => {
    render(<Calculator />);
    // Click 2, +, 3, =
    // Verify result = 5
  });
});
```

### Synchronization Point 2 (After Phase 2)
**목적**: TASK-002, TASK-003 통합

**체크리스트**:
1. ✅ History가 calculator state와 연동되는지 확인
2. ✅ Statistics calculator가 독립적으로 동작하는지 확인
3. ✅ Unit converter가 독립적으로 동작하는지 확인
4. ✅ localStorage quota 핸들링 작동하는지 확인
5. ✅ 모든 features가 responsive design을 유지하는지 확인

**Integration Tests**:
```typescript
// __tests__/integration/full-app.test.tsx
describe('Full App Integration', () => {
  it('should calculate, save to history, and reload', () => {
    // Perform calculation
    // Check history updated
    // Click history item
    // Verify calculation reloaded
  });
});
```

---

## ⚠️ 병렬 개발 리스크 & 완화 전략

### Risk 1: Merge Conflicts
**Probability**: Medium
**Impact**: Medium

**Mitigation**:
- 🛡️ 파일 소유권 매트릭스 엄격히 준수
- 🛡️ 공유 파일(`src/store/calculator.ts`)은 TASK-001 완료 후 freeze
- 🛡️ 매일 sync: `git pull --rebase origin main`
- 🛡️ Small, frequent commits with clear prefixes:
  - `feat(engine):`, `feat(history):`, `feat(converter):`

### Risk 2: 인터페이스 불일치
**Probability**: High
**Impact**: High

**Mitigation**:
- 🛡️ Phase 1에서 **TypeScript interfaces 먼저 정의**
- 🛡️ `src/types/` 디렉토리 공유 타입 선언
- 🛡️ Store interface는 TASK-001에서 완성 후 freeze
- 🛡️ Code review 필수

### Risk 3: Test Suite 충돌
**Probability**: Low
**Impact**: Low

**Mitigation**:
- 🛡️ 각 task는 독립적인 test 파일 사용
- 🛡️ Test naming convention:
  - `engine.test.ts`, `history.test.ts`, `units.test.ts`
- 🛡️ Shared test utilities: `__tests__/utils/` 에 분리

### Risk 4: Performance Degradation
**Probability**: Medium
**Impact**: Medium

**Mitigation**:
- 🛡️ Bundle size monitoring: webpack-bundle-analyzer
- 🛡️ Lazy loading for heavy features:
  ```typescript
  const StatisticsCalculator = dynamic(() => import('@/components/statistics/StatisticsCalculator'));
  ```
- 🛡️ Math.js tree-shaking (custom build)
- 🛡️ Lighthouse CI on every PR

---

## 🚀 실행 계획 (Step-by-Step)

### Day 0.5: Infrastructure
```bash
# 1명 또는 1 agent
1. npx create-next-app@latest
2. npm install mathjs zustand date-fns
3. npm install -D jest @testing-library/react playwright
4. Configure Jest, Playwright, Tailwind
5. Commit: "chore: project setup"
```

### Day 1-3: Phase 1 (TASK-001) - 3 Parallel Tracks
```bash
# Track A (Agent/Dev 1): Calculator Engine
git checkout -b feat/calculator-engine
- Write engine tests (RED)
- Implement CalculatorEngine (GREEN)
- Refactor with JSDoc (REFACTOR)
Commit: "feat(engine): implement calculator engine with Math.js"

# Track B (Agent/Dev 2): State Management
git checkout -b feat/state-management
- Write store tests (RED)
- Implement Zustand store (GREEN)
- Add SSR guards (REFACTOR)
Commit: "feat(store): implement calculator state with Zustand"

# Track C (Agent/Dev 3): UI Components
git checkout -b feat/ui-components
- Write component tests (RED)
- Implement Calculator, Display, ButtonGrid (GREEN)
- Add responsive design (REFACTOR)
Commit: "feat(ui): implement calculator UI components"
```

### Day 3.5: Synchronization Point 1
```bash
# Main branch에 merge
git checkout main
git merge feat/calculator-engine
git merge feat/state-management
git merge feat/ui-components

# Integration test 실행
npm test

# Manual verification
npm run dev
# Test in browser

# 문제 없으면 proceed
Commit: "feat: complete TASK-001 core calculator"
```

### Day 4-7: Phase 2 (TASK-002 & TASK-003) - 2 Parallel Tracks
```bash
# Track A (Agent/Dev 1): History & Statistics
git checkout -b feat/history-statistics
- Write history tests (RED)
- Implement HistoryService (GREEN)
- Add error handling (REFACTOR)
- Write statistics tests (RED)
- Implement StatisticsCalculator (GREEN)
- Integrate with store
Commit: "feat(history): implement history and statistics"

# Track B (Agent/Dev 2): Unit Converter
git checkout -b feat/unit-converter
- Write converter tests (RED)
- Implement UnitConverter (GREEN)
- Implement conversion tables
- Add temperature special handling (REFACTOR)
Commit: "feat(converter): implement unit conversion"
```

### Day 7: Synchronization Point 2
```bash
# Main branch에 merge
git checkout main
git merge feat/history-statistics
git merge feat/unit-converter

# Integration test
npm test

# Resolve conflicts if any
```

### Day 7.5-8: Phase 3 (Integration & Verification)
```bash
# E2E tests
npx playwright test

# Performance audit
npm run build
npm run analyze

# Accessibility audit
npm run lighthouse

# Final commit
Commit: "feat: complete all 3 tasks - calculator ready for launch"
```

---

## 📈 성공 지표

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Timeline** | 8 days | vs. 10-13 days sequential (2-5 days saved) |
| **Test Coverage** | 85%+ | `npm run test:coverage` |
| **Merge Conflicts** | < 5 conflicts | Git log |
| **Build Success** | First try | CI/CD pipeline |
| **Performance** | Lighthouse 90+ | Lighthouse CI |
| **Bundle Size** | < 250KB gzipped | webpack-bundle-analyzer |

---

## 🎯 핵심 원칙 (Critical Success Factors)

1. **엄격한 파일 소유권 준수**
   - 각 track은 지정된 파일만 수정
   - 공유 파일은 사전 합의 후 수정

2. **Interface-First Development**
   - Phase 1에서 모든 TypeScript interfaces 정의
   - 변경 시 모든 track에 통보

3. **Daily Sync**
   - 매일 main branch sync
   - Rebase 우선: `git pull --rebase`

4. **TDD 엄수**
   - RED → GREEN → REFACTOR 순서 준수
   - 테스트 없이 코드 작성 금지

5. **Synchronization Points는 필수**
   - Skip 금지
   - 모든 integration test pass 확인

---

## 📝 결론

**예상 타임라인**:
- Sequential: 10-13 days
- Parallel: **8 days** ✅
- **Time Saved: 2-5 days (20-38% faster)**

**병렬 실행 가능 여부**: ✅ **가능**
- Phase 1: 부분 병렬 (3 tracks)
- Phase 2: 완전 병렬 (2 tracks, 독립적)

**권장 전략**:
1. Phase 0-1은 foundation이므로 철저히 진행
2. Phase 2에서 최대 병렬화 활용
3. Synchronization points에서 철저히 검증

**다음 단계**:
이 전략을 기반으로 각 Phase를 순차적으로 실행하거나, 여러 agent/developer를 활용해 병렬 실행 시작

---

**Generated**: 2025-10-31
**Author**: Feature Planning Team
**Status**: Ready for Execution ✅
