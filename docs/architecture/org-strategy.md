# Organization Strategy

Organizations are the most important design choice in a GitHub Enterprise Delivery Zone. They define your security and ownership boundaries, so getting them right early is critical to avoid sprawl and fragmentation later on.
If you get org boundaries wrong, everything downstream becomes harder:

- Permissions sprawl
- Unclear ownership
- Messy audit trails
- Inconsistent guardrails
- Billing/Chargeback becomes guesswork
- Incidents have a larger blast radius than they should
- Cant enforce different policies for different teams (e.g. compliance, security, release governance)
- Exception chaos (too many exceptions, no clear ownership, no expiration)
- “We can’t audit it” moments (because of cross-org complexity and inconsistent controls)

This page gives an opinionated framework for deciding **how many organizations you need**, and **how to structure them**.

## What an organization *is* (in this model)

An organization is a:

- **Security boundary** (membership, roles, repo access patterns)
- **Ownership boundary** (who is accountable for standards and exceptions)
- **Policy boundary** (where you enforce default rulesets, workflows, and controls)
- **Blast-radius boundary** (mistakes and incidents should be containable)
- **Billing boundary** (chargeback/showback needs clean separation)

A repository is a delivery unit.
An organization is the zone that makes those delivery units governable at scale.

## The default pattern

Start with a small number of organizations. Expand only when there is a clear boundary that reduces risk or operational cost.

A common enterprise starting point:

- `cockpit` : We call it also cockpit org, where platform team builds and maintains the paved roads (reusable workflows, templates, policy-as-code, etc.)
- `products` (or 1–N product orgs): application repositories owned by product teams, or business units. Baseline guardrails are enforced here by default, with exceptions managed explicitly.

This gives separation of duties without creating fragmentation too early.

## Recommended org archetypes

### A) Cockpit organization

**Purpose:** build and distribute paved roads.

**Contains:**

- reusable workflows and composite actions
- org-level automation repos
- templates and “golden paths”
- policy-as-code (where applicable)
- documentation assets (optional)
- Repository that deploy other organizations

**Rule:** product teams consume from cockpit; they don’t fork the cockpit.

### B) Product organizations

**Purpose:** host repositories owned by product teams.

**Contains:**

- application repos
- infrastructure repos (if product-owned)
- team-owned tooling

**Rule:** product orgs must be “safe by default” through baseline enforcement.
**Exceptions** are allowed but must be explicit, justified, and time-bound (e.g. an organization for student hackathon).

## Cross-organization design: avoid coupling

Cross-org dependencies are normal, but don’t let them become brittle.

**Prefer:**

- reusable workflows published by cockpit org (consumed via pinned versions)
- templates that create “compliant defaults” at repo creation time
- automation that enforces baseline across orgs consistently

**Avoid:**

- copy/paste workflows per org
- one-off exceptions per org with no expiry
- hidden “special rules” that only exist in someone’s head

## What success looks like

You know your org strategy is working when:

- onboarding a new team is mostly self-service
- baseline protections are consistent across repos
- exceptions are rare, explicit, and time-bound
- audits don’t require archaeology
- incident containment is possible by design

---

Next: define enforcement with [Repository baseline](../guardrails/policies.md)
