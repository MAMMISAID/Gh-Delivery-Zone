# Cockpit Organization

The Cockpit Organization is the **control plane** of the GitHub Enterprise Delivery Zone. It is the single organization where the platform team builds, versions, and distributes every shared service that product organizations consume: required workflows, templates, provisioning automation, policy-as-code, observability, and the exception registry.

In Azure Landing Zone terms, the cockpit is the equivalent of the **Platform subscription** combined with **shared-services infrastructure**. Product teams never modify it directly; they consume from it.

## Why a dedicated control plane

Without a dedicated cockpit, platform assets end up scattered across product organizations. Workflows get forked, templates drift, and provisioning becomes a manual process that no one owns.

A dedicated cockpit organization provides:

- **Single source of truth** for all platform assets (workflows, templates, policies)
- **Separation of duties** between platform engineering and product delivery
- **Auditability** with a clear change history for every guardrail and paved road
- **Versioned consumption** so product teams pin to stable releases and upgrade on their own schedule

!!! note
    The cockpit is not a monolith. It is a collection of focused repositories, each with a clear purpose and a well-defined interface for consumers.

## Position in the 4-layer architecture

![Page-1](../medias/cockpit-position.drawio){ aria-label="Diagram showing the Cockpit Organization at Layer 2 of the 4-layer architecture." }

<details>
<summary>Text description of cockpit position diagram</summary>

The diagram shows four layers stacked top to bottom. Layer 1 (Enterprise Platform Boundary) passes policies and identity down to Layer 2 (Cockpit Organization, highlighted as the control plane). Layer 2 sends paved roads and automation to Layer 3 (Product Organizations) and rulesets and baselines to Layer 4 (Repository Guardrails). Layer 4 feeds back into Layer 3, enforcing guardrails on every repository.

</details>

The cockpit sits between the enterprise boundary (Layer 1) and the product organizations (Layer 3). It translates enterprise-level policies into concrete, consumable assets that product teams use every day.

## Repository inventory

Every repository in the cockpit has a clear purpose. The table below describes the standard inventory.

| Repository | Purpose | Consumers |
| --- | --- | --- |
| `.github` | Org-level required workflows and composite actions | All product organizations |
| `templates-service` | Repo template for service archetypes (API, worker, BFF) | Product teams creating new services |
| `templates-library` | Repo template for shared libraries and packages | Product teams publishing internal libraries |
| `templates-infrastructure` | Repo template for infrastructure-as-code repositories | Product teams managing their own infra |
| `provisioning` | OpenTofu/Terraform modules for org and repo provisioning | Platform team (automated pipelines) |
| `service-catalog` | Issue templates for team onboarding, org requests, exception requests, feature requests | All roles |
| `compliance-dashboard` | Observability and compliance reporting (drift detection, posture scores) | Platform team, security and compliance team |
| `exception-registry` | Structured record of all active, expired, and denied exceptions | Platform team, security and compliance team |
| `documentation` | This documentation site (MkDocs) | Everyone |

!!! tip "Naming convention"
    Use clear, descriptive names. Avoid abbreviations. A new team member should be able to read the repository list and understand the cockpit's purpose without asking anyone.

### The `.github` repository

The `.github` repository is the most important repository in the cockpit. It contains:

- :fontawesome-solid-square-check: **Required workflows** (`build.yml`, `test.yml`, `security-scan.yml`, `release.yml`) consumed by product repos via `uses: cockpit-org/.github/.github/workflows/build.yml@v1`
- :fontawesome-solid-square-check: **Composite actions** for common steps (checkout with security defaults, artifact upload with retention policy)
- :fontawesome-solid-square-check: **Organization-level workflow defaults** (e.g., `CODEOWNERS`, default labels, issue templates)

### The provisioning repository

The provisioning repository contains infrastructure-as-code that automates:

- :fontawesome-solid-square-check: Organization creation with baseline settings applied
- :fontawesome-solid-square-check: Repository creation from templates with rulesets pre-configured
- :fontawesome-solid-square-check: Team and membership management synced from identity provider
- :fontawesome-solid-square-check: Drift detection that identifies configuration changes made outside of code

!!! warning
    The provisioning repository has elevated permissions (organization admin tokens or GitHub App credentials). Treat it as a high-security asset: require multiple reviewers, enforce branch protection, and rotate credentials on a strict schedule.

## Access model

The cockpit uses a strict access model. Most consumers interact with cockpit assets indirectly through workflow references and templates.

| Role | Cockpit access | What they can do |
| --- | --- | --- |
| Platform Team | **Maintainer** | Full write access to all cockpit repositories; merge PRs, publish releases |
| Enterprise Admin | **Owner** (oversight) | Organization-level settings; rarely touches repository content |
| Security and Compliance | **Read + triage** | Review policies, audit exception registry, approve security-related changes via PR review |
| Org Owner / Product Team Lead | **Read-only** | Browse workflows, templates, and documentation; submit requests via service catalog |
| Developer | **No direct access** | Consumes workflows by reference; uses templates at repo creation time |

!!! note
    Product teams never need write access to the cockpit. If a product team needs a workflow change, they open an issue or pull request in the service catalog. The platform team reviews, merges, and releases.

## Governance of the cockpit itself

The cockpit governs product organizations, but the cockpit itself must also be governed. An ungoverned cockpit is a single point of failure for the entire enterprise.

### Change management

- :fontawesome-solid-square-check: All changes go through pull requests with at least **two platform team reviewers**
- :fontawesome-solid-square-check: Required workflow changes require CI validation (linting, dry-run on a sandbox org)
- :fontawesome-solid-square-check: Breaking changes follow a **deprecation cycle**: announce, dual-publish old and new versions, remove old version after migration window
- :fontawesome-solid-square-check: Every release is **tagged with semver** so consumers can pin and upgrade deliberately

### Rulesets applied to the cockpit

The cockpit must enforce its own rulesets at minimum parity with what it requires of product organizations:

- :fontawesome-solid-square-check: Branch protection on `main` (no direct push, require status checks, require reviews)
- :fontawesome-solid-square-check: Signed commits enforced
- :fontawesome-solid-square-check: Secret scanning and push protection enabled
- :fontawesome-solid-square-check: Dependency review required on PRs that update dependencies

### Audit cadence

- :fontawesome-solid-square-check: Quarterly review of cockpit repository permissions and GitHub App credentials
- :fontawesome-solid-square-check: Monthly review of active exceptions in the exception registry
- :fontawesome-solid-square-check: Weekly automated drift detection comparing live org settings against code

## Service catalog

The service catalog is the front door to the cockpit. All requests flow through issue templates in the `service-catalog` repository.

![Page-1](../medias/service-catalog-flow.drawio){ aria-label="Diagram showing the service catalog request flow from requester through platform team to provisioning automation." }

<details>
<summary>Text description of service catalog flow diagram</summary>

The diagram shows a left-to-right flow with four nodes. The Requester (Org Owner / Team Lead) opens an issue in the Service Catalog (Issue Template). The issue is triaged by the Platform Team (Triage and Execute), which triggers the Provisioning Automation. The automation delivers the result back to the Requester, completing the cycle.

</details>

### Available request types

| Request type | Template | SLA target |
| --- | --- | --- |
| Team onboarding | `onboard-team.yml` | 2 business days |
| New organization | `new-org.yml` | 5 business days |
| New repository | `new-repo.yml` | 1 business day |
| Exception request | `exception.yml` | 3 business days |
| Feature request | `feature.yml` | Triaged within 5 business days |
| Incident report | `incident.yml` | Acknowledged within 4 hours |

## Relationship to product organizations

The cockpit and product organizations have a **provider-consumer** relationship with clear boundaries.

**The cockpit provides:**

- Required workflows called by product repos via `uses:` references
- Repository templates used at creation time to seed compliant defaults
- Provisioning automation that creates and configures product organizations
- Compliance dashboards that give product teams visibility into their own posture
- The exception process that product teams use when a guardrail cannot be met

**Product organizations own:**

- Their application and infrastructure code
- Their team membership and internal team structure
- Their deployment pipelines (which call cockpit workflows)
- Their exception requests (submitted via service catalog)

!!! warning
    Product teams consume from the cockpit. They do not fork cockpit repositories, copy workflow files locally, or maintain parallel versions of platform assets. Forking breaks the upgrade path and creates invisible drift.

## Anti-patterns

### Cockpit as bottleneck

When every routine action requires a cockpit ticket and manual platform team intervention, the cockpit becomes the gatekeeper this framework is designed to eliminate.

**Fix:** automate everything that can be automated. Repository creation, baseline application, and team onboarding should be self-service within guardrails. The platform team builds the automation; they should not be in the critical path for every request.

### Ungoverned cockpit

A cockpit without its own branch protection, code review, and change management is a liability. A bad merge to a required workflow can break CI across every product organization simultaneously.

**Fix:** apply the same (or stricter) rulesets to the cockpit that you require of product organizations. Require multiple reviewers, run CI validation on workflow changes, and use semver tagging for all releases.

### Cockpit sprawl

Adding repositories to the cockpit for every new idea dilutes its purpose. The cockpit should contain platform infrastructure, not product code or experimental tools.

**Fix:** before adding a repository to the cockpit, ask: "Is this a shared platform service consumed by multiple organizations?" If not, it belongs in a product organization.

### Secret copy-paste from cockpit

Product teams that extract secrets from cockpit workflows and store them locally to avoid the required workflow pattern. This defeats centralized secret management.

**Fix:** enforce that shared secrets are only available through required workflow execution context. Monitor for secret sprawl using GitHub secret scanning.

### One-person cockpit

A cockpit maintained by a single engineer with no backup, no documentation, and no succession plan. When that person is unavailable, the entire platform stalls.

**Fix:** require at least two maintainers for every cockpit repository. Document all operational procedures. Use the service catalog to make processes visible and transferable.

## Maturity checklist

Use this checklist to assess your cockpit organization's maturity.

- [ ] Dedicated cockpit organization exists, separate from product orgs
- [ ] `.github` repo contains versioned required workflows and composite actions
- [ ] At least one repository template per archetype (service, library, infrastructure)
- [ ] Provisioning automation deploys organizations and repositories from code
- [ ] Service catalog with issue templates for all standard request types
- [ ] Compliance dashboard with drift detection running on a schedule
- [ ] Exception registry with structured records and expiry tracking
- [ ] Access model enforced (platform team = maintainers, product teams = read-only consumers)
- [ ] Cockpit rulesets at parity with (or stricter than) product org rulesets
- [ ] At least two maintainers per cockpit repository
- [ ] Semver tagging on all required workflows and actions
- [ ] Quarterly permission and credential review documented

---

Next: [Organization strategy](org-strategy.md)
