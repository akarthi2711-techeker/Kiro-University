---
inclusion: always
---

# CloudGuard – Security Domain Guidelines

## Purpose
These guidelines explain the security domain concepts used in CloudGuard. They help Kiro give accurate, beginner-appropriate security advice when working on this project.

## Target Audience
CloudGuard is aimed at **students and beginners** learning cloud security. All explanations should be:
- Jargon-free or explain jargon when used
- Practical and actionable
- Vendor-neutral (not AWS/Azure/GCP specific) unless giving examples
- Encouraging, not fear-based

## The Ten Security Checks
CloudGuard covers these ten foundational cloud security practices:

| ID | Name | Category |
|----|------|----------|
| `mfa` | Enable MFA | Identity |
| `root-account` | Protect the Root/Admin Account | Identity |
| `public-storage` | Restrict Public Storage Access | Data |
| `least-privilege` | Use Least-Privilege IAM Permissions | Identity |
| `security-groups` | Restrict Security Group / Firewall Rules | Network |
| `encryption` | Enable Encryption at Rest and in Transit | Data |
| `logging` | Enable Logging and Monitoring | Visibility |
| `backups` | Maintain Regular Backups | Resilience |
| `updates` | Keep Software and Dependencies Updated | Resilience |
| `permission-review` | Review Permissions Regularly | Identity |

## Score Interpretation
| Score | Label | Meaning |
|-------|-------|---------|
| 80–100 | Good | Core practices are in place |
| 50–79 | Needs Attention | Some gaps that should be addressed |
| 0–49 | Critical | Significant risks present |
| N/A | Not Started | No checks evaluated yet |

## Score Formula
`score = round(passed / (passed + failed) * 100)`

Pending checks are excluded from the score — they represent unknown rather than negative state.

## Adding New Checks
If new security checks are added to `src/data/checks.js`, they must:
1. Have a unique kebab-case `id`
2. Include a beginner-friendly `explanation` (2–3 sentences)
3. Include a concrete, actionable `recommendation`
4. Belong to one of: Identity, Data, Network, Visibility, or Resilience categories

## What CloudGuard Is NOT
- Not a compliance tool (not SOC2, ISO 27001, CIS Benchmark)
- Not a real-time scanner (it relies on self-reported status)
- Not a substitute for professional security audit

Always mention these limitations when asked about CloudGuard's scope.
