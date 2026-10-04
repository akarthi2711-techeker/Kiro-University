/**
 * Security checklist items.
 * Each item has a stable id, name, explanation, and recommendation for failure.
 * Default status is 'pending'.
 */
export const DEFAULT_CHECKS = [
  {
    id: 'mfa',
    name: 'Enable Multi-Factor Authentication (MFA)',
    explanation:
      'MFA adds a second layer of security beyond just a password. Without it, a stolen password gives full account access.',
    recommendation:
      'Enable MFA for all user accounts, especially administrator and root accounts.',
    category: 'Identity',
  },
  {
    id: 'root-account',
    name: 'Protect the Root / Admin Account',
    explanation:
      'The root account has unrestricted access to all resources. It should never be used for day-to-day tasks.',
    recommendation:
      'Lock down the root account: disable programmatic access, enable MFA, and use separate IAM roles for daily work.',
    category: 'Identity',
  },
  {
    id: 'public-storage',
    name: 'Restrict Public Storage Access',
    explanation:
      'Publicly accessible storage buckets (S3, Blob Storage, GCS) can expose sensitive data to the entire internet.',
    recommendation:
      'Audit all storage buckets and remove public access unless explicitly required. Enable "Block Public Access" settings.',
    category: 'Data',
  },
  {
    id: 'least-privilege',
    name: 'Use Least-Privilege IAM Permissions',
    explanation:
      'Users and services should only have the minimum permissions they need. Overly broad permissions increase blast radius in a breach.',
    recommendation:
      'Review IAM policies and remove wildcard (*) permissions. Grant only what each role truly needs.',
    category: 'Identity',
  },
  {
    id: 'security-groups',
    name: 'Restrict Security Group / Firewall Rules',
    explanation:
      'Open firewall rules (0.0.0.0/0) expose services to the internet unnecessarily, making them easy targets.',
    recommendation:
      'Restrict inbound rules to known IP ranges. Close ports that are not in active use.',
    category: 'Network',
  },
  {
    id: 'encryption',
    name: 'Enable Encryption at Rest and in Transit',
    explanation:
      'Unencrypted data can be read if storage or traffic is intercepted. Encryption ensures data remains confidential.',
    recommendation:
      'Enable encryption at rest for all storage services and enforce HTTPS/TLS for all data in transit.',
    category: 'Data',
  },
  {
    id: 'logging',
    name: 'Enable Logging and Monitoring',
    explanation:
      'Without logs you cannot detect attacks, audit changes, or investigate incidents after the fact.',
    recommendation:
      'Enable cloud-level audit logs (e.g., AWS CloudTrail, GCP Audit Logs) and set up alerts for suspicious activity.',
    category: 'Visibility',
  },
  {
    id: 'backups',
    name: 'Maintain Regular Backups',
    explanation:
      'Data loss from accidental deletion, ransomware, or hardware failure can be catastrophic without backups.',
    recommendation:
      'Schedule automated backups, test restoration regularly, and store backups in a separate region or account.',
    category: 'Resilience',
  },
  {
    id: 'updates',
    name: 'Keep Software and Dependencies Updated',
    explanation:
      'Outdated software contains known vulnerabilities that attackers actively exploit.',
    recommendation:
      'Establish a patch management process. Apply security updates promptly and scan dependencies for CVEs.',
    category: 'Resilience',
  },
  {
    id: 'permission-review',
    name: 'Review Permissions Regularly',
    explanation:
      'Permissions accumulate over time. Former employees, unused services, or old integrations may still have access.',
    recommendation:
      'Perform quarterly access reviews. Remove unused accounts, revoke stale tokens, and audit role assignments.',
    category: 'Identity',
  },
]

/** Valid status values */
export const STATUS = {
  PENDING: 'pending',
  PASSED: 'passed',
  FAILED: 'failed',
}
