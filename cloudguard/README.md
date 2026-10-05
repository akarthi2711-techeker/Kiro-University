# 🛡️ CloudGuard – Cloud Security Checklist

CloudGuard is a beginner-friendly, browser-only web application that helps students and newcomers to cloud computing self-assess their security posture. It guides users through ten fundamental cloud security practices, tracks which ones are in place, calculates a live security score, and generates a prioritised list of recommendations.

---

## Why It Was Built

Cloud security mistakes are the most common cause of data breaches, yet many students completing cloud courses never form the habit of checking basic security hygiene. CloudGuard provides a simple, judgment-free starting point: a checklist that explains *why* each practice matters and tells you *what to do* if something is missing — all without requiring an account or an internet connection.

---

## Main Features

| Feature | Description |
|---------|-------------|
| **Security Score** | A 0–100 score calculated live from your self-reported check statuses |
| **10 Security Checks** | Covering Identity, Data, Network, Visibility, and Resilience domains |
| **Dashboard** | Animated score ring, stat cards (Passed / Failed / Pending / Total), category breakdown, and assessment progress bar |
| **Interactive Checklist** | Expand any check to read its explanation, then mark it Passed, Failed, or Pending in one click |
| **Status Filtering** | Filter the checklist to show only Pending, Passed, or Failed items |
| **Security Report** | Full report with per-check recommendations for every failed item and a summary of what's going well |
| **LocalStorage Persistence** | Progress is saved automatically and survives page refreshes — no account needed |
| **Reset Assessment** | Start fresh at any time (requires a confirmation click to prevent accidents) |
| **Responsive Layout** | Works on desktop, tablet, and phone |

---

## Technology Stack

| Tool | Version | Purpose |
|------|---------|---------|
| **React** | 18 | UI components, hooks, Context API |
| **React Router** | v6 | Client-side routing (three pages, no server) |
| **Vite** | 5 | Development server and production bundler |
| **JavaScript (ES modules)** | — | Plain JS — no TypeScript — to keep the code readable for beginners |
| **CSS** | — | Per-component CSS files with CSS custom properties for theming |
| **Browser LocalStorage** | — | Persistence with zero backend |
| **Vitest** | 2 | Unit and property-based test runner |
| **fast-check** | 3 | Property-based testing library |

---

## How to Install

```bash
# Clone or download the project, then:
cd cloudguard
npm install
```

Requires Node.js 18 or later.

---

## How to Run Locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Other Commands

```bash
npm run build      # Production build → dist/
npm run preview    # Preview the production build locally
npm test           # Run all tests once
npm run test:watch # Run tests in watch mode
```

---

## How the Security Score Works

```
scored = passed + failed
score  = scored === 0 ? 0 : round(passed / scored × 100)
```

- Only checks you have actively reviewed (Passed or Failed) contribute to the score.
- **Pending** checks are neutral — they represent "not yet evaluated", not "failing".
- This means the score honestly reflects your assessed practices, not assumptions about unreviewed ones.

| Score | Status Label | Meaning |
|-------|-------------|---------|
| ≥ 80 | Good | Core practices are in place |
| 50–79 | Needs Attention | Some gaps to address |
| < 50 | Critical | Significant risks present |
| 0 reviewed | Not Started | No checks evaluated yet |

The score updates instantly every time you change a check's status.

---

## How LocalStorage Is Used

All state is stored in the browser's `localStorage` under a single key: `cloudguard_checks`.

The stored value is a JSON array of `{ id, status }` pairs — only the IDs and current statuses, not the full check text. On every status change, the array is serialised and saved. On page load, the saved statuses are merged back onto the canonical check definitions, so any future checks added to the app will appear automatically as Pending.

```
Key:   cloudguard_checks
Value: [{"id":"mfa","status":"passed"},{"id":"root-account","status":"failed"}, ...]
```

If localStorage is empty, corrupted, or unavailable, the app falls back gracefully to all checks in Pending state. The "Reset Assessment" button calls `localStorage.removeItem('cloudguard_checks')` and resets all statuses to Pending.

No data ever leaves the browser. There is no server, no analytics, and no external API calls.

---

## How Kiro Features Were Used

This project was built spec-first using Kiro's structured development features.

### Spec (`.kiro/specs/cloudguard-checklist/`)

The spec was written *before* implementation and drove every decision:

| File | Contents |
|------|---------|
| `requirements.md` | Six user stories (REQ-1 to REQ-6) with concrete acceptance criteria |
| `design.md` | Architecture diagram, data model, state management approach, routing table, score formula, LocalStorage format, component hierarchy |
| `tasks.md` | Phased implementation checklist (9 phases) used to track progress |

### Steering Documents (`.kiro/steering/`)

Steering files give Kiro persistent context so every code suggestion automatically respects project conventions:

| File | Loaded | Purpose |
|------|--------|---------|
| `project-standards.md` | Always | Tech stack rules, file naming, code style, testing requirements |
| `security-domain.md` | Always | Security domain knowledge: the ten checks, score formula, label thresholds, guidelines for adding new checks, scope limitations |
| `component-patterns.md` | On `.jsx`/`.css` files | Component structure template, CSS conventions, accessibility requirements, context usage pattern |

### Hooks (`.kiro/hooks/` at workspace level)

Three automation hooks run without any manual intervention:

| Hook | Trigger | What it does |
|------|---------|-------------|
| `lint-on-save.json` | PostFileSave on `.js`/`.jsx`/`.css` | Runs ESLint to catch unused variables and common mistakes immediately on save |
| `test-after-task.json` | PostTaskExec | Runs `npm test` automatically after each spec task is marked complete |
| `security-checks-review.json` | PostFileSave on `checks.js` | An agent hook: whenever `src/data/checks.js` is saved, Kiro reviews the check definitions for structural validity (unique ids, non-empty fields, valid categories) |

### Custom Agent (`.kiro/agents/security-reviewer.md`)

The **CloudGuard Security Reviewer** is a custom Kiro agent that specialises in this project's domain. When activated, it reviews:
- Security check content for factual accuracy and beginner clarity
- The score calculation for edge-case correctness
- Storage code for safe JSON handling
- Whether recommendations are actionable for a beginner

It references `src/data/checks.js` live via `#[[file:src/data/checks.js]]` so its review is always based on the current check definitions.

### Property-Based Testing (fast-check)

`src/test/score.test.js` uses fast-check to verify mathematical invariants of the score formula across hundreds of randomly generated inputs. These properties are verified:

- Score is always in the range `[0, 100]`
- All-passed checks always produce score = 100
- All-failed checks always produce score = 0
- All-pending checks always produce score = 0, label = "Not Started"
- Converting a failed check to passed never *decreases* the score
- Adding more pending checks never changes the score
- `passed + failed + pending` always equals the total check count

Property-based tests catch edge cases that hand-picked example tests can miss (e.g., arithmetic edge cases with large or unusual input combinations).

---

## Project Structure

```
cloudguard/
├── public/
│   └── shield.svg                  # Favicon
├── src/
│   ├── main.jsx                    # React entry point
│   ├── App.jsx                     # Router setup and route definitions
│   ├── styles/
│   │   └── global.css              # CSS custom properties, shared utility classes
│   ├── data/
│   │   └── checks.js               # Static definitions for the 10 security checks
│   ├── utils/
│   │   ├── score.js                # Score calculation, label mapping (pure functions)
│   │   └── storage.js              # LocalStorage read / write / clear helpers
│   ├── context/
│   │   └── ChecklistContext.jsx    # Global state: checks, summary, updateStatus, resetAll
│   ├── components/
│   │   ├── Layout.jsx / .css       # App shell: topbar, navigation, footer
│   │   ├── ScoreRing.jsx / .css    # Animated SVG circular progress ring
│   │   └── StatusBadge.jsx / .css  # Passed / Failed / Pending pill badge
│   ├── pages/
│   │   ├── Dashboard.jsx / .css    # Route /  — score hero, stats, category breakdown
│   │   ├── Checklist.jsx / .css    # Route /checklist — filterable checklist with expand/collapse
│   │   └── Report.jsx / .css       # Route /report — recommendations and reset
│   └── test/
│       ├── setup.js                # Vitest setup: clears localStorage before each test
│       ├── score.test.js           # 24 tests: unit + 6 property-based (fast-check)
│       ├── storage.test.js         # 15 tests: loadChecks, saveChecks, clearChecks
│       └── checks.test.js          # 13 tests: data integrity + property-based schema check
├── .kiro/
│   ├── steering/
│   │   ├── project-standards.md
│   │   ├── security-domain.md
│   │   └── component-patterns.md
│   ├── specs/
│   │   └── cloudguard-checklist/
│   │       ├── requirements.md
│   │       ├── design.md
│   │       └── tasks.md
│   └── agents/
│       └── security-reviewer.md
├── .kiro/hooks/                    # At workspace root level (one level up)
│   ├── lint-on-save.json
│   ├── test-after-task.json
│   └── security-checks-review.json
├── index.html
├── vite.config.js
├── package.json
└── README.md
```

---

## Limitations

CloudGuard is a **learning and self-reflection tool**, not a compliance scanner:

- Check statuses are **self-reported** — the app cannot inspect your actual cloud environment.
- It does **not** map to any compliance standard (SOC 2, ISO 27001, CIS Benchmarks, NIST CSF, etc.).
- It is **not** a substitute for a professional security assessment or audit.
- Results are stored **only in your browser** — they are lost if you clear browser data or use a different browser.

---

## MCP Usage

The [MCP filesystem server](https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem) was used during development to inspect and improve this project without leaving the Kiro IDE.

### Operations performed

| MCP Operation | Tool used | Purpose |
|---------------|-----------|--------|
| Inspect project tree | `mcp_filesystem_directory_tree` | Mapped every file and directory in the project (excluding `node_modules` and `dist`) |
| Read source files | `mcp_filesystem_read_multiple_files` | Read `checks.js`, `score.js`, `storage.js`, `ChecklistContext.jsx`, `Dashboard.jsx`, `Checklist.jsx`, `Report.jsx`, `checks.test.js`, `score.test.js`, `security-domain.md`, `README.md` in parallel |
| Get file metadata | `mcp_filesystem_get_file_info` | Checked sizes and timestamps before editing |
| Rewrite data file | `mcp_filesystem_write_file` | Rewrote `src/data/checks.js` to add AWS-specific console paths to all 10 checks |
| Patch UI component | `mcp_filesystem_edit_file` | Added the AWS example block to `Checklist.jsx` |
| Patch styles | `mcp_filesystem_edit_file` | Added `.check-aws-example` styles to `Checklist.css` |
| Update tests | `mcp_filesystem_edit_file` | Added two new assertions to `checks.test.js` covering the `awsExample` field |
| Update README | `mcp_filesystem_edit_file` | Added this MCP Usage section |

### What the improvement does

Each of the 10 security checks now includes an `awsExample` field — a concrete AWS Console navigation path or CLI command that tells students *exactly* where to go to implement that practice. The field appears as an amber-highlighted block in the expanded checklist view, below the explanation text. It is optional in the data schema so the checks remain vendor-neutral by default, but the guidance is always there for AWS users.

---

## License

MIT — free to use, modify, and share for educational purposes.
