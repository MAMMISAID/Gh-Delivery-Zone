# Provision a New Organization

This guide walks through provisioning a new GitHub Organization within the enterprise. In Azure Landing Zone terms, this is **subscription vending** -- the automated process of creating a new subscription with baseline controls, identity, and observability pre-configured. The Platform Team is responsible for execution; the Enterprise Admin is accountable for approval.

!!! note
    Most teams do not need a new organization. If you are onboarding a team into an existing org, see [Onboarding a team](onboarding-a-team.md) instead. A new organization is a significant boundary decision with long-term governance implications.

## When to create a new organization

Not every request justifies a new organization. Use the criteria below to decide.

| Create a new org when... | Do NOT create a new org when... |
|---|---|
| A new business unit or portfolio has distinct ownership and accountability | A team simply wants its own space -- use team-based access in an existing org |
| A regulatory or compliance boundary is required (PCI, HIPAA, SOX) | The separation is purely cosmetic or organizational preference |
| Billing or chargeback must be isolated to a specific cost center | Billing can be tracked via labels, topics, or internal tagging |
| Blast radius isolation is needed for high-risk workloads | The workload risk profile matches existing org controls |
| A fundamentally different policy set is required (e.g., sandbox with relaxed rules) | Minor policy exceptions can be handled through the [exception process](../operating-model/exception-process.md) |

!!! warning
    Organization sprawl is one of the most common anti-patterns in GitHub Enterprise. Every new org increases governance overhead, complicates audit trails, and fragments the developer experience. When in doubt, default to fewer orgs.

## Azure parallel -- subscription vending

In the Azure Landing Zone model, provisioning a new organization is equivalent to **subscription vending**: a new subscription placed in the correct management group, with policies, identity, and monitoring applied automatically. The same principles apply here:

- The org inherits enterprise-level policies by default
- Baseline controls are non-negotiable and applied at creation time
- Identity (SSO, team sync, EMU) is configured before any user accesses the org
- Observability (audit log streaming, compliance dashboards) is active from day one

## Prerequisites

Complete this checklist before submitting an org provisioning request:

- [ ] **Executive sponsor** identified and available for approval
- [ ] **Business justification** documented (why an existing org is insufficient)
- [ ] **Org archetype** chosen: product org, sandbox, or other (see [Organization Strategy](../architecture/org-strategy.md))
- [ ] **Naming convention** applied (e.g., `<enterprise>-<bu>-<purpose>`)
- [ ] **Billing / cost center** assigned and confirmed by finance
- [ ] **Org owner** identified (the person accountable for day-to-day governance)

## Provisioning workflow

The diagram below shows the end-to-end flow from request through handoff.

![Page-1](../medias/provision-org-flow.drawio){ aria-label="Provisioning workflow showing steps from request submission through baseline verification to handoff." }

<details>
<summary>Text description of the provisioning workflow</summary>

1. **Submit Request** -- Org request via service catalog in cockpit org.
2. **Platform Review** -- Naming, archetype, and justification check.
3. **Enterprise Admin Approval** -- Validates business need and boundary decision.
4. **Provision Organization** -- Platform team creates org manually or via IaC.
5. **Apply Baseline** -- Rulesets, policies, and security defaults.
6. **Configure Identity** -- Team sync, SSO, and EMU scoping.
7. **Set Up Observability** -- Audit log streaming and compliance dashboard.
8. **Assign Ownership** -- Org owner and initial teams.
9. **Baseline Compliant?** -- Decision point: if Yes, proceed to Handoff; if No, go to Remediate.
10. **Handoff** -- Org owner takes operational control.
11. **Remediate** -- Fix gaps with platform support, then loop back to the compliance check.

</details>

### Step 1 -- Submit org request

The requesting leader submits a provisioning request through the service catalog in the cockpit organization. The request must include all items from the prerequisites checklist above, plus the initial list of teams that will operate in the new org.

### Step 2 -- Platform team reviews

The platform team validates the request: naming convention compliance, archetype alignment, and whether the justification warrants a new boundary rather than a team in an existing org.

### Step 3 -- Enterprise Admin approves

The Enterprise Admin reviews the business justification and confirms the boundary decision. This is the accountability gate -- no org is created without explicit admin approval.

### Step 4 -- Provision the organization

The platform team creates the organization, either manually through the enterprise admin console or via Infrastructure as Code (Terraform, API automation). The org is placed under the enterprise account immediately.

### Step 5 -- Apply baseline controls

The platform team applies the standard baseline to the new org. See the full baseline table below.

### Step 6 -- Configure identity

- SSO enforcement is enabled for the org
- Team sync is configured with the identity provider
- EMU scoping is applied if the enterprise uses Enterprise Managed Users
- Initial teams are created and members are synced

### Step 7 -- Set up observability

- Audit log streaming is configured to the enterprise SIEM
- The org is registered in the compliance dashboard
- Alerting rules are activated for critical events (member additions, ruleset changes, admin actions)

### Step 8 -- Assign org owner and initial teams

The designated org owner is granted the owner role. Initial teams are created following the [onboarding process](onboarding-a-team.md).

### Step 9 -- Verify baseline compliance

The platform team runs the verification checklist below to confirm all controls are active and correctly configured.

### Step 10 -- Handoff to org owner

The org owner receives documentation of applied baselines, team assignments, and links to the operating model. From this point, the org owner is responsible for day-to-day governance within the guardrails.

## Baseline applied to every new organization

Every new organization receives the following controls at creation time. These are non-negotiable defaults.

| Control | Configuration | Reference |
|---|---|---|
| Default branch protection | Org-level ruleset: require PR, require status checks, require linear history | [Rulesets](../guardrails/rulesets.md) |
| CI enforcement | Org-level ruleset: required status checks referencing platform required workflows | [Required Workflows](../guardrails/required-workflows.md) |
| Release protection | Org-level ruleset: tag protection, deployment environment rules | [Rulesets](../guardrails/rulesets.md) |
| Dependabot | Enabled for all repositories (security updates + version updates) | [Policies](../guardrails/policies.md) |
| Secret scanning | Enabled with push protection | [Policies](../guardrails/policies.md) |
| Code scanning | CodeQL enabled for supported languages | [Policies](../guardrails/policies.md) |
| Allowed actions | Enterprise actions + verified creators only | [Policies](../guardrails/policies.md) |
| GITHUB_TOKEN permissions | Default: `read-only` | [Policies](../guardrails/policies.md) |
| Repository creation | Restricted to org owners | [Policies](../guardrails/policies.md) |
| Template repositories | Platform templates made available from cockpit org | [Consume Framework](consume-framework.md) |

!!! tip
    These baselines are enforced at the org level so that individual repositories inherit them automatically. Product teams should not need to configure any of these manually. If a team needs to deviate, they must go through the [exception process](../operating-model/exception-process.md).

## Verification checklist

Before handoff, the platform team must confirm every item:

- [ ] Organization exists under the enterprise account
- [ ] SSO enforcement is active
- [ ] Team sync is operational and members are synced
- [ ] All org-level rulesets are applied and not bypassed
- [ ] Security features are enabled (Dependabot, secret scanning, code scanning)
- [ ] Allowed actions policy is set to enterprise + verified creators
- [ ] GITHUB_TOKEN default permissions are read-only
- [ ] Repository creation is restricted to org owners
- [ ] Audit log streaming is active and receiving events
- [ ] Compliance dashboard shows the org as monitored
- [ ] Org owner has accepted the role and acknowledged baseline controls
- [ ] Template repositories from cockpit are accessible

## Anti-patterns

**Org sprawl.** Creating organizations for every team, project, or initiative. This fragments governance, multiplies audit effort, and creates inconsistent developer experiences. Start with fewer orgs and split only when a real boundary is needed.

**Ungoverned organizations.** An org that exists under the enterprise but was never provisioned through this process. It has no baseline, no rulesets, no streaming, and no owner. Treat ungoverned orgs as incidents and remediate immediately.

**Personal orgs in enterprise.** Enterprise Managed Users may create personal orgs that sit outside governance. Enterprise policy should restrict this capability or monitor it continuously.

**Org-per-environment.** Separating dev, staging, and production into different organizations. This creates unnecessary cross-org complexity. Use repository naming, environments, and deployment protection rules instead.

---

Next: [Onboarding a team](onboarding-a-team.md)
