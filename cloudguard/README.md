# 🛡️ CloudGuard – Cloud Security Checklist

> A beginner-friendly, browser-only cloud security self-assessment tool built with React and Vite.  
> Built as part of the **Kiro University** challenge to demonstrate spec-driven development with AI-assisted tooling.

![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-deployed-brightgreen)
![Tests](https://img.shields.io/badge/tests-54%20passing-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)

---

## 🌐 Live Demo

**[https://akarthi2711-techeker.github.io/Kiro-University/](https://akarthi2711-techeker.github.io/Kiro-University/)**

---

## 📖 What Is CloudGuard?

CloudGuard helps students and beginners in cloud computing answer one simple question:

> *"Are the basic security practices actually in place in my cloud account?"*

It provides a 10-item security checklist covering the most important cloud security fundamentals. For each item you mark as Passed, Failed, or Pending — CloudGuard calculates a live security score, explains why each practice matters, shows you the exact AWS Console path to fix it, and generates a prioritised recommendation report.

**Everything runs in your browser. No account. No backend. No internet connection required after the page loads.**

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔢 **Security Score** | Live 0–100 score calculated from your self-reported check statuses |
| ✅ **10 Security Checks** | Covering Identity, Data, Network, Visibility, and Resilience domains |
| 🖥️ **Dashboard** | Animated score ring, stat cards, category breakdown, assessment progress bar |
| 📋 **Interactive Checklist** | Expand any check to read the explanation + AWS Console path, then mark it |
| 🔍 **Status Filtering** | Filter by All / Pending / Passed / Failed |
| 🔶 **AWS Examples** | Every check shows the exact AWS Console navigation path to implement it |
| 📊 **Security Report** | Actionable per-check recommendations for every failed item |
| 💾 **Auto-Save** | Progress saved to browser LocalStorage — survives page refresh |
| 🔄 **Reset Assessment** | Start fresh with a two-step confirmation |
| 📱 **Responsive** | Works on desktop, tablet, and mobile |

---

## 🔒 The 10 Security Checks

| # | Check | Category |
|---|-------|----------|
| 1 | Enable Multi-Factor Authentication (MFA) | Identity |
| 2 | Protect the Root / Admin Account | Identity |
| 3 | Restrict Public Storage Access | Data |
| 4 | Use Least-Privilege IAM Permissions | Identity |
| 5 | Restrict Security Group / Firewall Rules | Network |
| 6 | Enable Encryption at Rest and in Transit | Data |
| 7 | Enable Logging and Monitoring | Visibility |
| 8 | Maintain Regular Backups | Resilience |
| 9 | Keep Software and Dependencies Updated | Resilience |
| 10 | Review Permissions Regularly | Identity |

---

## 🛠️ Technology Stack

| Tool | Version | Purpose |
|------|---------|---------|
| **React** | 18 | UI components, hooks, Context API |
| **React Router** | v6 | Client-side routing with HashRouter |
| **Vite** | 5 | Development server and production bundler |
| **JavaScript** | ES2021 | Plain JS — no TypeScript — beginner-readable |
| **CSS** | — | Per-component files with CSS custom properties |
| **LocalStorage** | — | Client-side persistence, zero backend |
| **Vitest** | 2 | Test runner |
| **fast-check** | 3 | Property-based testing |
| **GitHub Actions** | — | CI/CD pipeline for GitHub Pages deployment |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18 or later
- npm 9 or later

### Install & Run

```bash
# 1. Clone the repository
git clone https://github.com/akarthi2711-techeker/Kiro-University.git
cd Kiro-University/cloudguard

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open **[http://localhost:5173/Kiro-University/](http://localhost:5173/Kiro-University/)** in your browser.

### All Commands

```bash
npm run dev        # Start development server (hot reload)
npm run build      # Production build → dist/
npm run preview    # Preview the production build locally
npm test           # Run all 54 tests once
npm run test:watch # Run tests in watch mode
```

---

## 📐 How the Security Score Works

```
scored = passed + failed
score  = scored === 0 ? 0 : round(passed / scored × 100)
```

- Only **Passed** and **Failed** checks contribute to the score
- **Pending** checks are neutral — "not yet evaluated", not "failing"
- Score updates **instantly** on every status change

| Score | Label | Meaning |
|-------|-------|---------|
| ≥ 80 | ✅ Good | Core practices are in place |
| 50–79 | ⚠️ Needs Attention | Some gaps to address |
| < 50 | 🔴 Critical | Significant risks present |
| 0 reviewed | — | Not Started |

---

## 💾 How LocalStorage Works

All state is stored under the key `cloudguard_checks` as a JSON array:

```json
[
  { "id": "mfa", "status": "passed" },
  { "id": "root-account", "status": "failed" },
  { "id": "encryption", "status": "pending" }
]
```

- Saved automatically on every status change
- Restored on page load by merging saved statuses onto the canonical check list
- Falls back to all-Pending if storage is empty or corrupted
- Cleared completely when you click "Reset Assessment"
- **No data ever leaves the browser**

---

## 📁 Project Structure

```
cloudguard/
├── public/
│   └── shield.svg                  # Favicon
├── src/
│   ├── main.jsx                    # App entry point (HashRouter)
│   ├── App.jsx                     # Route definitions
│   ├── styles/
│   │   └── global.css              # CSS custom properties, shared utilities
│   ├── data/
│   │   └── checks.js               # 10 security check definitions + awsExample
│   ├── utils/
│   │   ├── score.js                # Score calculation (pure functions)
│   │   └── storage.js              # LocalStorage helpers
│   ├── context/
│   │   └── ChecklistContext.jsx    # Global state via React Context
│   ├── components/
│   │   ├── Layout.jsx / .css       # Topbar, nav, footer
│   │   ├── ScoreRing.jsx / .css    # Animated SVG score ring
│   │   └── StatusBadge.jsx / .css  # Status pill (Passed/Failed/Pending)
│   ├── pages/
│   │   ├── Dashboard.jsx / .css    # Route / — score + stats + breakdown
│   │   ├── Checklist.jsx / .css    # Route /checklist — interactive list
│   │   └── Report.jsx / .css       # Route /report — recommendations + reset
│   └── test/
│       ├── setup.js                # Vitest setup (clears localStorage)
│       ├── score.test.js           # 24 tests: unit + property-based
│       ├── storage.test.js         # 15 tests: LocalStorage helpers
│       └── checks.test.js          # 15 tests: data integrity + awsExample
├── .kiro/
│   ├── steering/                   # Always-on Kiro context documents
│   ├── specs/cloudguard-checklist/ # Requirements, design, tasks
│   └── agents/security-reviewer.md # Custom Kiro security review agent
├── .github/
│   └── workflows/deploy.yml        # GitHub Actions CI/CD → GitHub Pages
├── index.html
├── vite.config.js                  # base: '/Kiro-University/' for GitHub Pages
└── package.json
```

---

## 🤖 Kiro University Features

This project was built spec-first as part of the Kiro University challenge, using every required Kiro feature with a real purpose.

### 1. Spec-Driven Development (`.kiro/specs/`)

The spec was written **before** any code and drove every implementation decision:

| File | Contents |
|------|---------|
| `requirements.md` | 6 user stories (REQ-1 to REQ-6) with acceptance criteria |
| `design.md` | Architecture, data model, routing, score formula, component hierarchy |
| `tasks.md` | 9-phase implementation checklist — all phases completed |

### 2. Steering Documents (`.kiro/steering/`)

Persistent context loaded by Kiro automatically:

| File | When loaded | Purpose |
|------|-------------|---------|
| `project-standards.md` | Always | Tech stack rules, naming, code style, test requirements |
| `security-domain.md` | Always | Domain knowledge: checks, score formula, label thresholds |
| `component-patterns.md` | On `.jsx`/`.css` saves | Component structure, CSS conventions, accessibility rules |

### 3. Hooks (`.kiro/hooks/` — workspace level)

Automation that runs without any manual trigger:

| Hook | Trigger | Action |
|------|---------|--------|
| `lint-on-save.json` | PostFileSave on `.js/.jsx/.css` | Runs ESLint on save |
| `test-after-task.json` | PostTaskExec | Runs `npm test` after every spec task |
| `security-checks-review.json` | PostFileSave on `checks.js` | Agent verifies check data integrity |

### 4. Custom Agent (`.kiro/agents/security-reviewer.md`)

A specialised Kiro agent that reviews:
- Security content for accuracy and beginner clarity
- Score calculation for edge-case correctness
- Storage code for safe JSON handling

Uses `#[[file:src/data/checks.js]]` to always read live check definitions.

### 5. Property-Based Testing (fast-check)

`src/test/score.test.js` verifies 6 mathematical invariants across hundreds of random inputs:

- Score always in `[0, 100]`
- All-passed → score = 100
- All-failed → score = 0
- All-pending → score = 0, label = "Not Started"
- Converting failed → passed never decreases score
- Adding pending never changes score

### 6. MCP Usage (Filesystem MCP Server)

The MCP filesystem server was used to inspect and improve the project:

| MCP Tool | Operation |
|----------|-----------|
| `mcp_filesystem_directory_tree` | Mapped full project tree |
| `mcp_filesystem_read_multiple_files` | Read 11 source files in parallel |
| `mcp_filesystem_write_file` | Rewrote `checks.js` with AWS examples |
| `mcp_filesystem_edit_file` | Patched `Checklist.jsx`, `Checklist.css`, `checks.test.js`, `README.md` |

**Improvement made:** Added `awsExample` field to all 10 checks with concrete AWS Console navigation paths. Displayed as an amber-highlighted block in the expanded checklist view.

### 7. GitHub Actions (`.github/workflows/deploy.yml`)

CI/CD pipeline that runs on every push to `master`:

```
Push → Checkout → Install (npm ci) → Test (54 tests) → Build → Deploy to GitHub Pages
```

---

## 🚢 Deployment

The app is automatically deployed to GitHub Pages on every push to `master`.

**Live URL:** [https://akarthi2711-techeker.github.io/Kiro-University/](https://akarthi2711-techeker.github.io/Kiro-University/)

To enable GitHub Pages in your fork:
1. Go to **Settings → Pages**
2. Set **Source** to **GitHub Actions**
3. Push any commit — the workflow does the rest

---

## ⚠️ Limitations

CloudGuard is a **learning tool**, not a compliance scanner:

- Check statuses are **self-reported** — the app cannot inspect your actual cloud environment
- Does **not** map to SOC 2, ISO 27001, CIS Benchmarks, or NIST CSF
- Not a substitute for a professional security audit
- Data stored **only in your browser** — lost if you clear browser storage

---

## 📄 License

MIT — free to use, modify, and share for educational purposes.
