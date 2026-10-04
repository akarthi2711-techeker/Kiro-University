# CloudGuard – Design

## Architecture Overview

CloudGuard is a client-only React SPA. There is no server component.

```
Browser
  └─ React App (Vite bundle)
       ├─ React Router (client-side routing)
       ├─ ChecklistContext (global state)
       │    ├─ src/data/checks.js       (static check definitions)
       │    ├─ src/utils/score.js       (score calculation)
       │    └─ src/utils/storage.js     (localStorage read/write)
       └─ Pages
            ├─ Dashboard  /
            ├─ Checklist  /checklist
            └─ Report     /report
```

## Data Model

### Check (static definition in `checks.js`)
```js
{
  id: string,           // kebab-case unique identifier
  name: string,         // display name
  explanation: string,  // why this matters (shown when expanded)
  recommendation: string, // what to do if failed (shown in report)
  category: string,     // 'Identity' | 'Data' | 'Network' | 'Visibility' | 'Resilience'
}
```

### Check (runtime, stored in LocalStorage)
```js
{
  ...staticFields,
  status: 'pending' | 'passed' | 'failed'
}
```

### Summary (computed by `calculateScore`)
```js
{
  score: number,   // 0–100
  passed: number,
  failed: number,
  pending: number,
  label: string,   // 'Good' | 'Needs Attention' | 'Critical' | 'Not Started' | 'No Data'
}
```

## State Management

All mutable state lives in `ChecklistContext`. The context:
1. Initialises from LocalStorage (merging saved statuses onto DEFAULT_CHECKS).
2. Exposes `checks` array and `summary` computed value.
3. Exposes `updateStatus(id, newStatus)` and `resetAll()` mutators.
4. Syncs to LocalStorage via `useEffect` on every `checks` change.

Components are read-only consumers. They call mutators but never manipulate state directly.

## Routing

| Path | Component | Description |
|------|-----------|-------------|
| `/` | `Dashboard` | Score ring, stat cards, progress, category breakdown |
| `/checklist` | `Checklist` | Filterable list of check items with expand/status controls |
| `/report` | `Report` | Full report with recommendations and reset button |

## Score Calculation

```
scored = passed + failed
score  = scored === 0 ? 0 : round(passed / scored * 100)
```

Invariants verified by property-based tests:
- Score is always in [0, 100].
- All-passed → score = 100.
- All-failed → score = 0.
- All-pending → score = 0 (not started).
- Adding a passing check never decreases the score.

## LocalStorage Format

Key: `cloudguard_checks`
Value: JSON array of `{ id, status }` pairs.

On load, the saved array is merged with `DEFAULT_CHECKS` by matching `id`. Unknown ids in saved data are ignored. New checks that exist in `DEFAULT_CHECKS` but not in saved data default to `pending`.

## Component Hierarchy

```
App
└─ ChecklistProvider
   └─ Layout (topbar + nav + footer wrapper)
      └─ Routes
         ├─ Dashboard
         │   ├─ ScoreRing
         │   └─ CategoryBreakdown (internal)
         ├─ Checklist
         │   ├─ FilterBar (internal)
         │   └─ CheckItem (internal)
         │       └─ StatusBadge
         └─ Report
             ├─ ScoreRing
             └─ StatusBadge
```
