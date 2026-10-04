---
inclusion: fileMatch
fileMatchPattern: "src/**/*.{jsx,css}"
---

# CloudGuard – Component & CSS Patterns

## Component Structure
Every React component in this project follows this pattern:

```jsx
// 1. Imports (React hooks, other components, utils, CSS)
import { useState } from 'react'
import './ComponentName.css'

// 2. Named or default export
export default function ComponentName({ prop1, prop2 }) {
  // 3. Hooks at the top
  const [state, setState] = useState(initialValue)

  // 4. Derived values / handlers
  function handleClick() { ... }

  // 5. JSX return
  return (
    <div className="component-name">
      ...
    </div>
  )
}
```

## CSS Conventions
- Root element class matches component name in kebab-case: `ComponentName` → `.component-name`
- Use CSS custom properties from `global.css` for colors, spacing, and radius.
- Never hardcode hex colors — always reference a `--variable`.
- Responsive breakpoints: `600px` (mobile), `900px` (tablet).

## Accessibility
- Interactive elements that are not `<button>` or `<a>` must have `role`, `tabIndex`, and keyboard event handlers.
- All SVG elements used decoratively get `aria-hidden="true"`.
- SVGs conveying information get `aria-label`.
- Color is never the sole indicator of state (always pair with text or icon).

## Context Usage
Access checklist state via the `useChecklist()` hook:

```jsx
import { useChecklist } from '../context/ChecklistContext.jsx'

function MyComponent() {
  const { checks, summary, updateStatus, resetAll } = useChecklist()
  ...
}
```

Never import `ChecklistContext` directly or call `useContext` with it outside the context file.
