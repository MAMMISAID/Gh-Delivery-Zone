# Organization Strategy
Organizations are the most important design choice in a GitHub Enterprise  Zone. They define your security and ownership boundaries, so getting them right early is critical to avoid sprawl and fragmentation later on.
If you get org boundaries wrong, everything downstream becomes harder:

- Permissions sprawl
- Unclear ownership
- Messy audit trails
- Inconsistent guardrails
- Billing/Chargeback becomes guesswork
- Incidents have a larger blast radius than they should

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

- `platform` (or `engineering-platform`): shared platform assets, reusable workflows, templates, governance automation
- `products` (or 1–N product orgs): application repositories owned by product teams

If you’re unsure, pick **two organizations**:

1) a **Platform org** for shared assets and guardrail automation  
2) a **Product org** for most repositories

This gives separation of duties without creating fragmentation too early.

## When to create a new organization

Create a new organization when **at least one** of these is true:

### 1) Regulatory / compliance boundary
Example triggers:

- different data residency obligations
- regulated environments (health/finance)
- separate audit requirements or evidence ownership

Why orgs help: you can enforce different guardrails and ownership without exceptions everywhere.

### 2) High-risk blast radius boundary
Example triggers:

- highly privileged automation (release signing, production deploy controllers)
- sensitive codebases (core auth, cryptography, security tooling)
- critical shared components used by many teams

Why orgs help: incidents or privilege mistakes are contained.

### 3) Ownership and accountability boundary
Example triggers:

- separate leadership and budgets
- independent operating models (e.g., acquired company)
- different SDLC or release governance

Why orgs help: “who owns the standard?” becomes unambiguous.

### 4) Identity boundary (real separation of duties)
Example triggers:

- different identity providers or different user population rules
- strict contractor segmentation
- policies requiring different admin groups

Why orgs help: you reduce “admin sprawl” and simplify audits.

### 5) Billing / chargeback boundary
Example triggers:

- business units require direct attribution
- central platform vs cost-of-goods separation
- internal pricing models

Why orgs help: you avoid debates over who consumes what.

## When *not* to create a new organization

Avoid new orgs when the reason is mostly convenience:

- “Team X wants autonomy”
- “We don’t like the naming in this org”
- “It feels cleaner”
- “We might need it someday”

Each additional org adds:

- duplicated configuration
- more identity/admin surfaces
- more cross-org coordination
- more tooling to keep consistent guardrails
- more places for drift to happen

If you create orgs too early, you trade one big mess for many small ones.

## The org decision checklist

Use this quick checklist. If you answer “yes” to any, a new org is justified.

- **Compliance:** Do we need different rules because of regulation or audits?
- **Risk:** Would a security incident be materially safer if this were isolated?
- **Ownership:** Is accountability unclear if we keep this in the same org?
- **Identity:** Do we need different admin groups or membership policies?
- **Billing:** Do we need clean cost attribution and reporting?

If all answers are “no”, keep it in the existing org and enforce guardrails there.

## Recommended org archetypes

### A) Platform organization
Purpose: build and distribute paved roads.

Contains:

- reusable workflows and composite actions
- org-level automation repos
- templates and “golden paths”
- policy-as-code (where applicable)
- documentation assets (optional)

Rule: product teams consume from platform; they don’t fork the platform.

### B) Product organizations
Purpose: host repositories owned by product teams.

Contains:

- application repos
- infrastructure repos (if product-owned)
- team-owned tooling

Rule: product orgs must be “safe by default” through baseline enforcement.

### C) Restricted / sensitive organization (optional)
Purpose: isolate high-risk or regulated workloads.

Contains:

- security tooling
- privileged automation
- regulated codebases

Rule: strong membership controls, strict exception policy, additional evidence requirements.

## Cross-organization design: avoid coupling

Cross-org dependencies are normal, but don’t let them become brittle.

Prefer:

- reusable workflows published by platform org (consumed via pinned versions)
- templates that create “compliant defaults” at repo creation time
- automation that enforces baseline across orgs consistently

Avoid:

- copy/paste workflows per org
- one-off exceptions per org with no expiry
- hidden “special rules” that only exist in someone’s head

## Naming conventions (opinionated, boring by design)

Choose names that scale and stay stable:

- `platform`
- `product-<domain>` (e.g., `product-payments`, `product-core`)
- `regulated-<scope>` (e.g., `regulated-eu`, `regulated-health`)

Avoid names tied to org charts or temporary initiatives.

## What success looks like

You know your org strategy is working when:

- onboarding a new team is mostly self-service
- baseline protections are consistent across repos
- exceptions are rare, explicit, and time-bound
- audits don’t require archaeology
- incident containment is possible by design

---

Next: define enforcement with [Repository baseline](../guardrails/repo-baseline.md)
