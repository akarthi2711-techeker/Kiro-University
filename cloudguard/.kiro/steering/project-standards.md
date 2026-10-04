---
inclusion: always
---

# CloudGuard – Project Standards

## Overview
CloudGuard is a static React + Vite web application. It runs entirely in the browser with no backend, no authentication, and no external API calls. All state is persisted in browser LocalStorage.

## Technology Stack
- **React 18** with functional components and hooks only (no class components)
- **React Router v6** for client-side routing
- **Vite 5** as the build tool and dev server
- **Plain JavaScript (ES modules)** — no TypeScript
- **CSS modules per component** — no CSS-in-JS, no Tailwind
- **Vitest + fast-check** for unit and property-based testing

## Code Style Rules
1. Use named exports for components, default exports are acceptable for page-level components.
2. Keep components small and focused. Extract sub-components when JSX exceeds ~60 lines.
3. Business logic (score calculation, storage) lives in `src/utils/` — never inside components.
4. Static data definitions live in `src/data/` — not inline in components.
5. Global shared state uses React Context (`src/context/`). No Redux, no Zustand.
6. All user-facing strings are written in plain English. No i18n required for this project.
7. CSS files are co-located with their component files inside `src/components/` or `src/pages/`.

## File Naming Conventions
- React components: `PascalCase.jsx`
- Utility modules: `camelCase.js`
- CSS files: match their component name exactly, e.g., `Layout.css` for `Layout.jsx`
- Test files: `*.test.js` placed in `src/test/`

## LocalStorage Key
The single LocalStorage key used is `cloudguard_checks`. Do not add additional keys without updating `src/utils/storage.js`.

## Security Considerations for the Codebase
- Never `eval()` any data read from LocalStorage.
- Always validate the shape of parsed JSON before using it (see `storage.js`).
- No user-supplied data is rendered as raw HTML (no `dangerouslySetInnerHTML`).

## Testing Requirements
- Score calculation logic must have 100% unit test coverage.
- Property-based tests (fast-check) are required for `calculateScore` to verify invariants.
- Storage helpers must be tested with a mocked localStorage.
- Run tests with: `npm test`
