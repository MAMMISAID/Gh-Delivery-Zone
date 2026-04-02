# Observability

Governance without visibility is theater.
You can define rulesets, enforce policies, and build required workflows -- but if nobody can tell whether those controls are working, you have compliance documentation, not compliance.
This page defines how the platform team monitors guardrail health, detects drift, and maintains a clear picture of the enterprise security posture.

In Azure terms, this is the equivalent of Azure Monitor + Azure Policy compliance view + Microsoft Defender for Cloud: the visibility layer that tells you whether your landing zones are healthy.

## The three pillars

Framework observability rests on three pillars. Each answers a different question.

| Pillar | Question it answers | Example |
| --- | --- | --- |
| **Compliance posture** | Are repos compliant with the baseline right now? | Rulesets active, security scanning enabled, required workflows referenced |
| **Drift detection** | Has anything changed that should not have? | Ruleset removed, workflow forked locally, Dependabot disabled |
| **Activity monitoring** | Who did what, and when? | Bypass events, exception usage, admin actions on org settings |

!!! tip
    A common mistake is to build only the compliance posture pillar and ignore the other two. Compliance posture tells you the current state; drift detection tells you the trajectory; activity monitoring tells you the cause.

## Data sources

Every metric and dashboard draws from four data sources.

| Source | What it provides | Collection method |
| --- | --- | --- |
| **Enterprise audit log** | User and admin actions across all orgs (bypass events, setting changes, permission grants) | Audit log streaming to SIEM / data lake |
| **GitHub API** | Org and repo settings, ruleset status, security feature enablement, team membership | Scheduled API polling (GraphQL + REST) |
| **Exception registry** | Active, expired, and pending exceptions with owner and scope | Internal database or issue tracker in the cockpit org |
| **Required workflow usage** | Which repos consume which workflows, pinned versions, last update timestamp | Workflow run API + code search for `uses:` references |

## Key metrics

Track these metrics to maintain governance visibility. Each metric has an owner and a review cadence.

| Metric | Target | Owner | Cadence |
| --- | --- | --- | --- |
| % of repos compliant with baseline | > 95 % | Platform Team | Weekly |
| Active exceptions (by type, by org) | Trending down | Security & Compliance | Weekly |
| Bypass events per week (by actor, by ruleset) | < 5 per org | Platform Team | Weekly |
| Drift events (controls removed or weakened) | 0 unresolved after SLA | Platform Team | Daily (automated) |
| Template adoption rate (% of repos from templates vs blank) | > 80 % | Platform Team | Monthly |
| Required workflow version currency (% on latest major) | > 90 % | Platform Team | Monthly |

!!! warning
    A metric without an owner is a number nobody acts on. Every metric in this table is assigned to a team that is accountable for investigating deviations.

## Compliance dashboard

The compliance dashboard is the primary interface for governance visibility. It lives in the cockpit organization and is accessible to Enterprise Admins, the Platform Team, and Security & Compliance.

### Org-level compliance score

Each organization receives a compliance score based on:

- Percentage of repos with all mandatory rulesets active
- Percentage of repos with required security features enabled (secret scanning, Dependabot, code scanning)
- Percentage of repos referencing approved required workflows
- Number of unresolved drift events

The score is a weighted aggregate. Organizations below threshold are flagged for platform team review.

### Per-repo compliance detail

Drill down from the org score to individual repositories. Each repo shows:

- :fontawesome-solid-square-check: or :fontawesome-solid-square-xmark: for each baseline control
- Active exceptions (with expiry date)
- Last drift check timestamp
- Required workflow version in use vs latest available

### Exception tracking

The dashboard surfaces all active exceptions with:

- Days remaining until expiry
- Exceptions expiring within 14 days (highlighted for renewal review)
- Expired exceptions not yet closed (requires immediate action)
- Exception count trend over time

### Bypass event log

Every ruleset bypass is logged with actor, repository, ruleset, timestamp, and reason. The cockpit observability dashboard flags bypass events for weekly review, as described in the [rulesets page](../guardrails/rulesets.md).

## Drift detection and remediation

Drift occurs when a control that was in place is removed or weakened outside the normal change process.

### What drift looks like

| Drift event | How it happens | Risk |
| --- | --- | --- |
| Org-level ruleset removed | Org owner deletes ruleset via UI or API | Repos lose branch protection silently |
| Required workflow forked locally | Developer copies workflow into `.github/workflows` instead of referencing the shared version | Workflow diverges from approved version, misses security updates |
| Security feature disabled | Repo admin turns off secret scanning or Dependabot | Vulnerabilities go undetected |
| Required status check removed | Org owner modifies ruleset to drop a required check | Code merges without passing CI |

### Detection mechanism

![Page-1](../medias/drift-detection-flow.drawio){ aria-label="Drift detection flow showing scheduled API checks, compliance logging, drift event creation, alerting, and escalation paths." }

<details>
<summary>Text description of the drift detection flow</summary>

1. **Scheduled API check** -- Periodic poll of org and repo settings.
2. **Setting matches expected baseline?** -- Decision point: if Yes, log as compliant; if No, create a drift event.
3. **Log: compliant** -- Setting is confirmed as matching the baseline.
4. **Drift event created** -- A drift event is recorded for the non-compliant setting.
5. **Alert to team lead** -- The responsible team lead is notified.
6. **Remediation SLA met?** -- Decision point: if Yes, drift is resolved; if No, escalate.
7. **Drift resolved** -- The drift has been remediated.
8. **Escalation to Platform Team lead** -- SLA missed, escalated to platform team lead, then resolved.

</details>

Detection runs on two tracks:

- **Scheduled API checks** (every 4-6 hours): poll org and repo settings via the GitHub API and compare against the expected baseline stored in the cockpit org.
- **Webhook-driven** (real-time where available): listen for `repository.edited`, `org_ruleset.deleted`, and `security_feature.disabled` webhook events for immediate detection.

### Remediation flow

1. **Alert**: drift event triggers a notification to the responsible team lead (Slack, email, or ticketing system).
2. **Triage**: team lead confirms whether the change was intentional. If intentional, an exception must be filed per the [exception process](exception-process.md).
3. **Remediation SLA**: 48 hours for high-severity drift (security controls), 5 business days for medium-severity drift (workflow version pinning).
4. **Auto-remediation** (where safe): re-enable secret scanning, re-enable Dependabot, restore default branch ruleset. Auto-remediation only applies to controls where re-enabling has no side effects.
5. **Escalation**: if SLA is missed, escalation follows the path defined in the [roles and RACI matrix](roles-raci.md).

!!! note
    Auto-remediation is not a substitute for investigation. Every auto-remediated event still appears in the drift log and requires a team lead to acknowledge it.

## Audit log streaming

The enterprise audit log is the authoritative record of who did what across all organizations. Streaming it to an external system ensures retention, searchability, and correlation with other security data.

### What to stream and where

| Destination | Use case |
| --- | --- |
| **SIEM** (Splunk, Sentinel, Datadog) | Real-time alerting, correlation with non-GitHub events, incident response |
| **Data lake** (S3, ADLS, BigQuery) | Long-term retention, trend analysis, compliance reporting |

### Key events to monitor

- `repo.ruleset_removed` -- a ruleset was deleted from a repository or org
- `repo.bypass` -- a user bypassed a ruleset
- `org.update_member_repository_permission` -- org-wide permission change
- `repository.security_feature_disabled` -- secret scanning, Dependabot, or code scanning turned off
- `org.add_member` / `org.remove_member` -- membership changes
- `enterprise.config_change` -- enterprise-level setting modified

### Retention requirements

| Data type | Minimum retention | Rationale |
| --- | --- | --- |
| Audit log events | 1 year | Regulatory compliance, incident investigation |
| Compliance snapshots | 6 months | Trend analysis, posture reporting |
| Drift event history | 1 year | Pattern detection, recurring drift identification |

## Anti-patterns

| Anti-pattern | Symptom | Fix |
| --- | --- | --- |
| **Dashboard without action** | Beautiful charts that nobody reviews; drift goes unresolved for weeks | Assign an owner to every dashboard panel. Add a weekly review ceremony to the platform team cadence. |
| **Alert fatigue** | Hundreds of low-priority alerts per day; team ignores all of them | Tier alerts by severity. Only page on high-severity drift. Batch medium and low into a weekly digest. |
| **Observability without ownership** | Dashboards exist but no on-call rotation for the platform | Define an on-call rotation for the platform team. Drift alerts must route to a named person, not a shared channel. |
| **Monitoring compliance but not drift** | You know 95% of repos are compliant today but cannot tell that the number dropped from 98% last week | Track compliance over time, not just point-in-time snapshots. Alert on negative trends, not just threshold breaches. |
| **Exception data siloed from dashboards** | Exceptions live in a spreadsheet; dashboards show drift without context | Integrate the exception registry into the compliance dashboard. Annotate drift events with active waivers per the [exception process](exception-process.md). |

---

Next: [Enterprise policies](../guardrails/policies.md)
