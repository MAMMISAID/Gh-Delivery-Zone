# ADR 0003: Multi-Organization Strategy

## Status

**Accepted**

## Context

A GitHub Enterprise deployment must decide how to structure organizations. This decision defines security boundaries, ownership boundaries, policy scoping, blast radius, and billing separation. Getting org boundaries wrong early creates compounding problems: permission sprawl, unclear ownership, messy audit trails, inconsistent guardrails, and billing that cannot be attributed to business units.

The framework needs an organizational model that balances governance strength with operational simplicity, and that can scale as more teams onboard without requiring restructuring.

## Decision

Use **multiple organizations** following a cockpit-plus-product-orgs pattern rather than a single monolithic organization.

The default structure:

- **Cockpit organization** -- owned by the platform team. Contains required workflows, composite actions, repository templates, policy-as-code, and shared infrastructure configuration.
- **Product organizations** (one or more) -- owned by product teams or business units. Contains application repositories. Baseline guardrails are enforced by default, with exceptions managed through the formal exception process.

## Rationale

**Security boundaries.** Each organization is a separate security boundary with its own membership, roles, and access patterns. A compromise or misconfiguration in one product org does not affect the cockpit or other product orgs.

**Ownership boundaries.** Clear accountability: the platform team owns the cockpit, product teams own their orgs. There is no ambiguity about who is responsible for standards, exceptions, and incident response within each boundary.

**Blast radius control.** Mistakes and incidents are contained within a single organization. A misconfigured ruleset, a leaked token, or an accidental permission grant does not propagate across the entire enterprise.

**Billing separation.** Each organization maps cleanly to cost centers. Chargeback and showback reporting does not require manual attribution or estimation.

**Policy scoping.** Different organizations can enforce different policies. A product org handling regulated data can have stricter controls than an internal tools org, without forcing every team into the most restrictive policy set.

See the full organization strategy in [Organization Strategy](../architecture/org-strategy.md).

## Alternatives considered

**Single organization with team-based access.** All repositories in one org, using teams and team-level permissions for separation. This approach leads to permission sprawl as the number of teams grows, makes audit trails difficult to scope, and cannot enforce different policies per business unit. Every team shares the same org-level rulesets, making it impossible to apply stricter controls to specific groups without affecting everyone.

**Organization per team.** One org per team or per squad. This provides maximum isolation but creates fragmentation: cross-org collaboration becomes complex, shared workflows must be duplicated or referenced across orgs, and the platform team must manage a large number of organizations. Maintenance overhead grows linearly with the number of teams, and the cockpit-to-product relationship becomes harder to orchestrate.

## Consequences

This decision has the following implications:

- **The cockpit organization is the single source of truth for paved roads.** Required workflows, templates, and policy definitions live in the cockpit and are consumed by product orgs. Changes propagate from one place.
- **Product orgs are provisioned through a standard process.** Creating a new product org follows a documented provisioning procedure to ensure baseline guardrails, audit log configuration, and SSO are set up correctly from the start.
- **Cross-org references require explicit configuration.** Required workflows called from product orgs must reference the cockpit org explicitly. This is intentional -- it makes dependencies visible -- but it requires contributors to understand the multi-org model.
- **Org count should grow slowly.** The default is a small number of orgs. New orgs are created only when there is a clear boundary that reduces risk or operational cost, not as a default for every new team.

---
