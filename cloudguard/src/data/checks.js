/**
 * Security checklist items.
 * Each item has a stable id, name, explanation, recommendation, awsExample,
 * and category. Default status is 'pending'.
 *
 * The `awsExample` field gives a concrete AWS service or console path so
 * students working on AWS know exactly where to act. It is optional — all
 * checks work equally well for Azure, GCP, or any other cloud provider.
 */
export const DEFAULT_CHECKS = [
  {
    id: 'mfa',
    name: 'Enable Multi-Factor Authentication (MFA)',
    explanation:
      'MFA adds a second layer of security beyond just a password. Without it, a stolen password gives an attacker full account access instantly.',
    recommendation:
      'Enable MFA for all user accounts, especially administrator and root accounts. Use a hardware key or authenticator app — avoid SMS where possible.',
    awsExample:
      'AWS Console → IAM → Users → select user → Security credentials → Assign MFA device. For the root account: top-right menu → Security credentials → Activate MFA.',
    category: 'Identity',
  },
  {
    id: 'root-account',
    name: 'Protect the Root / Admin Account',
    explanation:
      'The root account has unrestricted access to every resource and billing setting. Using it for daily tasks means one compromised session can destroy everything.',
    recommendation:
      'Lock down the root account: delete access keys, enable MFA, and create a separate IAM admin user for day-to-day work. Only use root for tasks that specifically require it.',
    awsExample:
      'AWS Console → IAM → Delete root access keys. Create an IAM user with AdministratorAccess policy for daily use instead. Enable root MFA under Account → Security credentials.',
    category: 'Identity',
  },
  {
    id: 'public-storage',
    name: 'Restrict Public Storage Access',
    explanation:
      'Publicly accessible storage buckets can expose sensitive data — customer records, backups, or credentials — to the entire internet. This is one of the most common causes of cloud data breaches.',
    recommendation:
      'Audit all storage buckets and remove public access unless a bucket is intentionally serving public content (e.g., a static website). Enable platform-level "Block Public Access" controls.',
    awsExample:
      'AWS Console → S3 → select bucket → Permissions → Block public access → enable all four settings. To audit all buckets at once: AWS Console → S3 → Block Public Access settings for this account.',
    category: 'Data',
  },
  {
    id: 'least-privilege',
    name: 'Use Least-Privilege IAM Permissions',
    explanation:
      'Users and services should only have the minimum permissions they need for their specific job. Overly broad permissions (especially wildcard "*" actions) dramatically increase the blast radius of a breach.',
    recommendation:
      'Review all IAM policies and remove wildcard actions/resources where specific ones can be used instead. Use IAM Access Analyzer to identify unused permissions.',
    awsExample:
      'AWS Console → IAM → Access Analyzer → create an analyzer to find unused access. Also: IAM → Policies → filter by "Customer managed" and review any policy with "Action: *" or "Resource: *".',
    category: 'Identity',
  },
  {
    id: 'security-groups',
    name: 'Restrict Security Group / Firewall Rules',
    explanation:
      'Open inbound rules (source 0.0.0.0/0 or ::/0) expose your services to the entire internet. Attackers continuously scan for open ports and will find them within minutes.',
    recommendation:
      'Restrict inbound rules to known IP ranges or specific security groups. Remove any rule that allows all traffic (0.0.0.0/0) on sensitive ports like 22 (SSH), 3389 (RDP), or 3306 (MySQL).',
    awsExample:
      'AWS Console → EC2 → Security Groups → review inbound rules. Replace 0.0.0.0/0 on port 22 with your office/home IP. Use "My IP" in the console to set it automatically.',
    category: 'Network',
  },
  {
    id: 'encryption',
    name: 'Enable Encryption at Rest and in Transit',
    explanation:
      'Unencrypted data stored or transmitted can be read if storage is accessed or traffic is intercepted. Encryption ensures data is unreadable without the correct key, even if a disk or packet is stolen.',
    recommendation:
      'Enable server-side encryption for all storage services. Enforce HTTPS/TLS for all endpoints — reject plain HTTP connections. Rotate encryption keys annually.',
    awsExample:
      'S3: bucket → Properties → Default encryption → enable SSE-S3 or SSE-KMS. RDS: enable encryption at creation. For transit: ACM → provision a certificate and attach to your load balancer. Enable "HTTPS only" on CloudFront distributions.',
    category: 'Data',
  },
  {
    id: 'logging',
    name: 'Enable Logging and Monitoring',
    explanation:
      'Without logs you cannot detect attacks, audit who changed what, or investigate an incident after the fact. Most breaches go undetected for weeks because logging was never set up.',
    recommendation:
      'Enable cloud-level audit logging to capture all API calls and configuration changes. Set up alerts for suspicious activity such as root account logins, failed auth attempts, or security group changes.',
    awsExample:
      'AWS Console → CloudTrail → create a trail (multi-region, log to S3). Enable CloudWatch alarms for root login (filter: $.userIdentity.type = Root). Enable AWS Config to track resource configuration changes over time.',
    category: 'Visibility',
  },
  {
    id: 'backups',
    name: 'Maintain Regular Backups',
    explanation:
      'Data loss from accidental deletion, ransomware, or hardware failure is catastrophic without backups. Many teams discover their backup process is broken only when they try to restore.',
    recommendation:
      'Schedule automated backups with a defined retention period. Test restoration at least quarterly — an untested backup is an unknown. Store backups in a separate region or account so a single incident cannot destroy both.',
    awsExample:
      'AWS Backup → create a backup plan (daily snapshots, 30-day retention). Assign resources (EC2, RDS, DynamoDB, EFS). Enable cross-region copy in the backup plan. Test restoration in a separate sandbox account.',
    category: 'Resilience',
  },
  {
    id: 'updates',
    name: 'Keep Software and Dependencies Updated',
    explanation:
      'Outdated software contains known, publicly documented vulnerabilities. Attackers actively scan for unpatched systems and exploit them with automated tools within days of a CVE being published.',
    recommendation:
      'Apply OS and runtime security patches promptly. Scan application dependencies for known CVEs regularly. Use managed services where the provider handles patching for you.',
    awsExample:
      'AWS Systems Manager → Patch Manager → create a patch baseline and maintenance window for EC2 instances. For dependencies: enable Amazon Inspector on EC2/ECR. For containers: enable ECR image scanning on push.',
    category: 'Resilience',
  },
  {
    id: 'permission-review',
    name: 'Review Permissions Regularly',
    explanation:
      'Permissions accumulate over time. Former employees, decommissioned services, or old CI/CD integrations may retain access long after they are no longer needed, creating silent attack vectors.',
    recommendation:
      'Conduct quarterly access reviews. Remove unused IAM users, deactivate idle access keys (older than 90 days), and audit service roles. Track who has access to what in a central register.',
    awsExample:
      'AWS Console → IAM → Credential report (download CSV of all users and last-used dates). Deactivate keys unused for 90+ days. IAM → Access Analyzer → review findings for cross-account and public access. Set up a recurring IAM Access Advisor review.',
    category: 'Identity',
  },
]

/** Valid status values */
export const STATUS = {
  PENDING: 'pending',
  PASSED: 'passed',
  FAILED: 'failed',
}
