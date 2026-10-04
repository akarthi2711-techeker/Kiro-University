# CloudGuard – Implementation Tasks

## Status Legend
- [ ] Not started
- [x] Completed

---

## Phase 1: Project Setup
- [x] Scaffold Vite + React project
- [x] Configure `package.json` with React, React Router, Vitest, fast-check
- [x] Create `vite.config.js` with React plugin and Vitest config
- [x] Set up `index.html` entry point

## Phase 2: Core Data Layer
- [x] Define `DEFAULT_CHECKS` array in `src/data/checks.js`
- [x] Implement `calculateScore` in `src/utils/score.js`
- [x] Implement `getStatusLabel` and `getLabelClass` helpers
- [x] Implement `loadChecks`, `saveChecks`, `clearChecks` in `src/utils/storage.js`

## Phase 3: State Management
- [x] Create `ChecklistContext` with Provider and `useChecklist` hook
- [x] Implement `updateStatus` mutator
- [x] Implement `resetAll` mutator
- [x] Wire LocalStorage persistence via `useEffect`

## Phase 4: UI Components
- [x] `Layout` – topbar, nav links, footer
- [x] `ScoreRing` – animated SVG circle with score display
- [x] `StatusBadge` – colored pill for pending/passed/failed

## Phase 5: Pages
- [x] `Dashboard` – score hero, stat cards, progress bar, category breakdown
- [x] `Checklist` – filter bar, expandable check items, status buttons
- [x] `Report` – score summary, recommendations, passed list, reset button

## Phase 6: Styling
- [x] `global.css` – CSS custom properties, card, button, badge, progress bar base styles
- [x] Component and page CSS files

## Phase 7: Kiro Configuration
- [x] `.kiro/steering/project-standards.md`
- [x] `.kiro/steering/security-domain.md`
- [x] `.kiro/steering/component-patterns.md`
- [x] `.kiro/specs/cloudguard-checklist/requirements.md`
- [x] `.kiro/specs/cloudguard-checklist/design.md`
- [x] `.kiro/specs/cloudguard-checklist/tasks.md` (this file)
- [x] Hooks: lint on save, test after task
- [x] Custom agent: security review agent

## Phase 8: Testing
- [x] `src/test/setup.js` – jsdom localStorage mock
- [x] `src/test/score.test.js` – unit + property-based tests for calculateScore
- [x] `src/test/storage.test.js` – unit tests for storage helpers
- [x] `src/test/checks.test.js` – data integrity tests for DEFAULT_CHECKS

## Phase 9: Documentation
- [x] `README.md`
