# Mental Model

A delivery zone is a **platform operating model** with guardrails and paved roads.
In Azure, the Delivery Zone concept exists because *scale breaks informal governance*.

GitHub Enterprise has the same problem: once you cross a certain number of repositories and teams, you get:

- Inconsistent protection rules
- Insecure workflows and token sprawl
- Duplicated YAML and random CI patterns
- Unclear ownership and exception chaos
- “We can’t audit it” moments

If you run a monolithic organization, you will hit issues activating GitHub features for all teams at once instead of selectively per organization. If you run multiple organizations, you will face inconsistent guardrails, uneven security posture across orgs, and limited visibility for platform teams.

The GitHub Enterprise Delivery Zone is how you prevent that.

## Overview

![Page-1](../medias/mental-model.drawio){ aria-label="4-layer architecture diagram showing Enterprise Platform Boundary, Cockpit Organization control plane, Team/Product Organizations, and Repository Guardrails with data flows between layers." }

<details>
<summary>Text description of architecture diagram</summary>

The architecture has four layers. 
<ul>
    <li>Layer 1: Enterprise Platform Boundary (GitHub Enterprise)</li>
    <li>Layer 2: Cockpit Organization (Control Plane with Service Catalog, Provisioning Automation, Policy as Code, Observability, Exception Registry)</li>
    <li>Layer 3: Team/Product Organizations (Example orgs: product-a, platform-shared, sandbox; each with org baseline, teams, repositories)</li>
    <li>Layer 4: Repository Guardrails (Rulesets, Required Workflows, Security Defaults applied to every repository)</li>
</ul>

</details>

## The mapping

We reuse Azure Delivery Zone thinking because it gives a clean hierarchy of boundaries.

| Azure Delivery Zone | GitHub Enterprise Delivery Zone | Why it matters |
| --- | --- | --- |
| Tenant / Mgmt Group | GitHub Enterprise | Top-level platform boundary (identity, audit, governance) |
| Subscription | GitHub Organization | **Security + cost boundary**; separation of duties; blast radius control |
| Resource Group | Repository | **Delivery unit**: baseline controls, CI standards, lifecycle |
| Policy / Blueprint | Rulesets & Policies | Enforced guardrails + paved road automation |

### Key interpretation

- **Enterprise** is the platform surface: identity, audit, governance primitives.
- **Organization** is where you enforce boundaries (who can do what, where, and how).
- **Repository** is where developers live — so guardrails must be automatic and default.

## What breaks at scale (and how this model prevents it)

### 1) “One org to rule them all”

**Symptom:** Permission sprawl, audit complexity, blast radius is huge, billing is opaque.

**Fix:** Treat organizations as:

- Product/portfolio boundaries (or regulatory boundaries)
- Ownership boundaries (platform vs product responsibility)
- Cost/billing boundaries (chargeback/showback)
- Containment boundaries (incidents and mistakes don’t propagate)

### 2) “Security is a ticket queue”

**Symptom:** Platform team becomes gatekeeper; developers circumvent controls.

**Fix:** Security-by-default with self-service:

- Guardrails are enforced automatically
- Paved roads are the easiest path
- Opt-out exists but is explicit and measurable
- Autonomy of team to request compliant delivery zone (aka: organization with baseline) with clear SLAs

### 3) "Configuration As Code" without reuse

**Symptom:** Most companies apply IaC to cloud deployments but not to GitHub asset management, leading to manual clicking, copy/paste YAML, inconsistent patterns, and maintenance nightmares.

**Fix:** Framework provides reusable modules and actions to implement guardrails as code:

- OpenTofu modules to configure Enterprise
- OpenTofu modules to configure Organizations (baseline, teams, policies)
- Drift detection and compliance reporting to identify repos that diverge from baseline, monitor Organization health, trigger remediation, and report compliance over time.

---

Next: define boundaries with [Organization strategy](org-strategy.md)
