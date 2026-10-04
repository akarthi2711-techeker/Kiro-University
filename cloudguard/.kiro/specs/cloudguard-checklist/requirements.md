# CloudGuard – Requirements

## Introduction
CloudGuard is a static single-page application that helps students and cloud beginners self-assess their adherence to ten fundamental cloud security practices. It runs entirely in the browser with no backend or external dependencies.

## Requirements

### REQ-1: Security Checklist
**User Story:** As a student, I want to see a list of cloud security checks so I can understand what practices I should follow.

**Acceptance Criteria:**
- The checklist displays exactly 10 security checks.
- Each check shows its name, category, and current status.
- Each check has an expand/collapse toggle that reveals the explanation.
- Each check provides buttons to set its status to Passed, Failed, or Pending.
- Status changes take effect immediately without a page reload.

### REQ-2: Security Score
**User Story:** As a student, I want to see my overall security score so I can understand how well I'm doing.

**Acceptance Criteria:**
- The score is a number from 0 to 100.
- The score is calculated as `round(passed / (passed + failed) * 100)`.
- Pending checks do not affect the score.
- When no checks have been assessed, the score displays as 0 and the label shows "Not Started".
- The score updates immediately whenever a check status changes.

### REQ-3: Dashboard
**User Story:** As a student, I want a summary dashboard so I can see my posture at a glance.

**Acceptance Criteria:**
- The dashboard shows the score in a circular progress ring.
- The dashboard shows counts for Passed, Failed, Pending, and Total checks.
- The dashboard shows a status label: Good (≥80), Needs Attention (50–79), Critical (<50), Not Started (0 assessed).
- The dashboard shows an assessment progress bar (reviewed / total).
- The dashboard shows a per-category breakdown.

### REQ-4: Security Report
**User Story:** As a student, I want a report page so I can see what I need to fix.

**Acceptance Criteria:**
- The report shows the score and counts.
- The report lists all failed checks with their specific recommendation text.
- The report lists all passed checks.
- The report has a "Reset Assessment" button that clears all statuses back to Pending.
- The reset button requires a confirmation click before executing.

### REQ-5: Data Persistence
**User Story:** As a student, I want my progress saved automatically so I don't lose it when I refresh.

**Acceptance Criteria:**
- Check statuses are saved to LocalStorage after every change.
- On page load, the saved statuses are restored.
- If LocalStorage is empty or corrupted, the app falls back to all-Pending defaults.
- Resetting the assessment also clears LocalStorage.

### REQ-6: Responsive Layout
**User Story:** As a student, I want the app to work on my phone and laptop.

**Acceptance Criteria:**
- The layout is usable at widths from 320px to 1440px.
- The navigation collapses gracefully on mobile.
- The stat grid adapts from 4 columns to 2 columns on small screens.
