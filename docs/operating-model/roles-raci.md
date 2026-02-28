# Roles and RACI Matrix

Clear ownership is the difference between a governance model that works and one that exists only on paper.
At scale, ambiguous responsibilities cause drift, duplicated effort, and "someone else will handle it" failures.
This page defines every role in the GitHub Enterprise Delivery Zone and maps each key activity to exactly one accountable owner.

## Roles

### Enterprise Admin

The Enterprise Admin controls the top-level platform surface: identity provider configuration, enterprise-wide policies, audit log access, and billing.
This role is typically held by a small group (2--3 people) in IT or platform engineering.

Responsibilities:

- [ ] Manage enterprise-level settings (SSO, EMU, audit log streaming)
- [ ] Grant or revoke organization creation rights
- [ ] Enforce enterprise-wide policies (e.g., IP allow lists, 2FA requirements)
- [ ] Review enterprise audit logs on a regular cadence

### Platform Team

The Platform Team owns the Cockpit Organization and everything inside it: provisioning automation, policy-as-code, reusable workflows, templates, observability dashboards, and the exception registry.
They build the paved roads that product teams consume.

Responsibilities:

- [ ] Build and maintain provisioning automation (org/repo creation, baseline application)
- [ ] Author and version reusable workflows and composite actions
- [ ] Define and enforce rulesets across organizations
- [ ] Operate observability dashboards (drift detection, compliance posture)
- [ ] Manage the exception registry (tracking, expiry enforcement)

### Security and Compliance Team

The Security and Compliance Team sets the policies that guardrails enforce.
They define what "secure by default" means, approve high-risk exceptions, and own audit evidence.

Responsibilities:

- [ ] Define security and compliance requirements for guardrails
- [ ] Approve or deny exceptions that affect security posture
- [ ] Conduct periodic compliance reviews and audits
- [ ] Validate that baselines meet regulatory obligations

### Org Owner

The Org Owner is accountable for a single Product Organization.
They manage membership, team structures, and ensure that the baseline is applied consistently within their org.

Responsibilities:

- [ ] Manage org membership and team assignments
- [ ] Ensure repositories within the org follow the baseline
- [ ] Approve org-level exception requests
- [ ] Act as the escalation point for product teams in their org

### Product Team Lead

The Product Team Lead owns a set of repositories and the people who contribute to them.
They are the first line of accountability for standards compliance within their team.

Responsibilities:

- [ ] Request new repositories through the service catalog
- [ ] Ensure their team follows guardrails and workflows
- [ ] Submit exception requests when a guardrail cannot be met
- [ ] Onboard new developers to the team and its tooling

### Developer

Developers write code, open pull requests, and consume the paved roads the platform provides.
They should rarely need to think about governance -- that is the point.

Responsibilities:

- [ ] Follow repository conventions and branch protection rules
- [ ] Use reusable workflows for CI/CD (no custom pipeline copies)
- [ ] Report guardrail issues or friction through the appropriate channel
- [ ] Participate in code review and status check enforcement

## RACI Matrix

Use this matrix to resolve "who does what" questions. Each activity has exactly one **A** (Accountable) owner.

| Activity | Enterprise Admin | Platform Team | Security / Compliance | Org Owner | Product Team Lead | Developer |
| --- | --- | --- | --- | --- | --- | --- |
| Enterprise configuration (SSO, EMU, audit) | **R / A** | C | C | I | I | I |
| Organization creation | A | **R** | C | I | I | I |
| Repository provisioning | I | **R / A** | I | C | R | I |
| Ruleset management | I | **R / A** | C | I | I | I |
| Reusable workflow publishing | I | **R / A** | C | I | I | I |
| Exception approval | I | C | **A** | R | R | I |
| Team onboarding | I | C | I | **A** | R | I |
| Audit and compliance review | C | C | **R / A** | C | I | I |
| Drift detection and remediation | I | **R / A** | C | I | I | I |
| Incident response (platform scope) | C | **R / A** | C | I | I | I |

!!! tip "Reading the matrix"
    **R** = Responsible (does the work). **A** = Accountable (owns the outcome). **C** = Consulted (provides input before the decision). **I** = Informed (notified after the decision).

## Escalation paths

Role boundaries overlap in practice. When they do, use these rules:

**1. "Who approves this exception?"**
Start with the Org Owner. If the exception affects security posture or crosses org boundaries, escalate to Security and Compliance. The Platform Team is consulted but never the sole approver of security exceptions.

**2. "Who fixes a broken guardrail?"**
The Platform Team owns the guardrail implementation. If a ruleset or reusable workflow is broken, the Platform Team fixes it. Product teams report the issue; they do not patch guardrails locally.

**3. "Who creates a new organization?"**
The Platform Team provisions organizations. The request comes from leadership with a justified boundary (see [Organization strategy](../architecture/org-strategy.md)). The Enterprise Admin grants the rights; the Platform Team executes.

**4. "Who handles a compliance finding?"**
Security and Compliance owns the finding. They assign remediation to the appropriate role (Platform Team for guardrail gaps, Org Owner for org-level issues, Product Team Lead for repo-level issues).

!!! warning "Escalation is not delegation"
    Escalating a decision does not transfer ownership. The original accountable party remains on the hook until the issue is resolved and documented.

## Anti-patterns

### Platform team as bottleneck

When every repository change requires a platform team ticket, you have recreated the gatekeeper model this framework is designed to eliminate. The Platform Team builds paved roads; product teams use them without asking permission.

**Fix:** automate provisioning and baseline enforcement. Product teams should self-serve within guardrails.

### Shadow admins

Org owners or team leads who accumulate admin privileges "just in case" and bypass standard processes. This creates invisible risk and makes audits unreliable.

**Fix:** enforce least-privilege through EMU and team-based access. Review admin role assignments quarterly.

### Accountability diffusion

When the RACI shows multiple **A** entries for the same activity, nobody is accountable. Every activity must have exactly one **A**.

**Fix:** if two roles both claim accountability, escalate to the Enterprise Admin or Security and Compliance team to make a binding decision.

### Verbal approvals for exceptions

"I asked Sarah and she said it was fine" is not an approval. Exceptions without a written record do not exist in this model.

**Fix:** all exceptions go through the [exception process](exception-process.md) with a documented request, approval, and expiry.

### Over-rotation on hierarchy

Routing every decision through the Enterprise Admin slows everything down and creates a single point of failure. Most operational decisions belong at the Org Owner or Platform Team level.

**Fix:** use the RACI matrix. If the Enterprise Admin is marked **I**, they should be informed -- not asked to approve.

---

Next: [Exception process](exception-process.md)
