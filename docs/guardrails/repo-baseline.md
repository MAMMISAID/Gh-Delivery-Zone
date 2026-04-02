# Repository Baseline

A repository baseline is the **minimum viable governance** that every repository receives at creation. It is the GitHub equivalent of a subscription baseline in Azure Landing Zone: a predefined set of configurations, metadata, protections, and CI plumbing that ensures no repository starts from zero.

When a team creates a repository through the service catalog, the platform template delivers the baseline automatically. The team writes code from day one instead of configuring branch protection, wiring up CI, or figuring out which security scanners to enable.

## What makes up the baseline

The baseline is not a single mechanism. It is the intersection of four layers, each managed by a different owner.

![Page-1](../medias/repo-baseline-layers.drawio){ aria-label="Diagram showing the 4 baseline layers flowing into a repository: Enterprise Policies, Org-Level Rulesets, Required Workflows, and Template Contents." }

<details>
<summary>Text description of baseline layers diagram</summary>

Four layers stack top to bottom. Enterprise Policies (allowed actions, 2FA/SSO, security features) are inherited automatically by Org-Level Rulesets (default-branch-protection, ci-enforcement, release-protection, sensitive-repo-protection). Rulesets are applied by org automation and referenced by Required Workflows (build, test, security-scan, release, dependency-update). Workflows are referenced by Template Contents (directory structure, CODEOWNERS, CI stub, SECURITY.md, LICENSE).

</details>

## Template contents

Every repository created from a platform template includes the following files. The template archetype determines the exact structure, but these files are common to all archetypes.

### Standard files

| File | Purpose |
| --- | --- |
| `README.md` | Standard sections: project name, description, getting started, usage, contributing, license |
| `CODEOWNERS` | Maps `/` to the owning team. Ensures every PR requires review from the right people |
| `.github/workflows/ci.yml` | Stub that calls platform [required workflows](required-workflows.md) (build, test, security-scan) |
| `.github/PULL_REQUEST_TEMPLATE.md` | Checklist: description, testing, breaking changes, linked issues |
| `SECURITY.md` | Vulnerability reporting instructions pointing to the enterprise security contact |
| `LICENSE` | Standard license file (internal source or OSS, depending on the org) |
| `.gitignore` | Language-appropriate ignore rules |

### Template archetypes

Not every repository is a microservice. The platform provides three archetypes, each with a tailored directory structure.

| Archetype | Use case | Key differences |
| --- | --- | --- |
| **Service** | Backend APIs, web apps, microservices | `src/`, `tests/`, `Dockerfile`, deployment manifests, health check endpoint |
| **Library** | Shared packages, SDKs, internal modules | `src/`, `tests/`, package manifest, publishing workflow instead of deployment |
| **Infrastructure** | Terraform/OpenTofu modules, platform config | `modules/`, `environments/`, `tests/`, no Dockerfile, plan/apply workflows |

!!! tip
    Teams select an archetype when requesting a repository through the service catalog. The platform automation creates the repository from the matching template and assigns the correct custom properties.

## Inherited controls

These controls apply to the repository automatically through org-level and enterprise-level configuration. The team does not need to set them up and cannot remove them.

### Enterprise policies

Applied to every repository in every organization. Managed by the enterprise admin.

- :fontawesome-solid-shield-halved: Two-factor authentication required
- :fontawesome-solid-shield-halved: Secure 2FA methods enforced (no SMS)
- :fontawesome-solid-lock: Workflow permissions default to read-only
- :fontawesome-solid-lock: Allowed actions restricted to enterprise + verified creators
- :fontawesome-solid-code-branch: Default branch name set to `main`

See [Enterprise policies](policies.md) for the full list.

### Org-level rulesets

Applied to all repositories in the organization. Managed by the cockpit automation.

- **default-branch-protection** — PR required, 1 approval, stale review dismissal, code owner review, status checks, no force push, no delete
- **ci-enforcement** — `build`, `test`, and `security-scan` status checks must pass
- **release-protection** — 2 approvals, signed commits, tag creation restricted to release automation
- **sensitive-repo-protection** — additional controls for repos tagged with `pci`, `sox`, or `hipaa`

See [Rulesets](rulesets.md) for detailed rule tables.

### Security features

Enabled at the org level and inherited by every repository.

- :fontawesome-solid-magnifying-glass: **Secret scanning** with push protection enabled
- :fontawesome-solid-bug: **Dependabot alerts** and security updates enabled
- :fontawesome-solid-shield-virus: **Code scanning** (CodeQL) via the platform security-scan workflow
- :fontawesome-solid-robot: **Copilot Autofix** enabled for code scanning alerts

## Custom properties at creation

When the repository is provisioned, the platform automation assigns [custom properties](custom-properties.md) based on the team's request.

| Property | Assigned from | Example |
| --- | --- | --- |
| `risk-level` | Service catalog request | `medium` |
| `compliance-scope` | Service catalog request | `pci` |
| `team-ownership` | Requesting team identity | `payments-team` |
| `environment-type` | Service catalog request | `production` |
| `contains-pii` | Service catalog request | `true` |
| `technology-stack` | Template archetype | `node` |

These properties drive [ruleset targeting](rulesets.md#recommended-rulesets). A repository tagged `compliance-scope: pci` automatically receives the `sensitive-repo-protection` ruleset without any manual configuration.

## What teams can and cannot customize

The baseline is a floor, not a ceiling. Teams can add strictness but cannot remove it.

| :fontawesome-solid-circle-check: Teams CAN | :fontawesome-solid-circle-xmark: Teams CANNOT |
| --- | --- |
| Add repo-level rulesets (stricter review counts, required deployments) | Remove or weaken org-level rulesets |
| Add CI jobs beyond the platform workflows | Skip platform security-scan workflow |
| Change repository description and topics | Disable secret scanning or Dependabot |
| Add additional CODEOWNERS rules | Change the default branch name |
| Configure Dependabot for additional ecosystems | Override workflow permissions to read-write |
| Set a stricter PAT policy at the repo level | Invite outside collaborators without org owner approval |

!!! warning
    If a team needs to operate outside the baseline, they must follow the [exception process](../operating-model/exception-process.md). Exceptions are time-bound, audited, and require platform team approval.

## Baseline verification checklist

Use this checklist to verify that a repository meets the baseline after creation. The platform automation should validate these items automatically; this list serves as a manual fallback.

- [ ] Default branch is `main`
- [ ] Branch protection via org-level rulesets is active (not bypassed)
- [ ] `build`, `test`, and `security-scan` status checks are required
- [ ] CODEOWNERS file exists and maps to a valid team
- [ ] Secret scanning with push protection is enabled
- [ ] Dependabot alerts are enabled
- [ ] Code scanning (CodeQL) is configured via CI workflow
- [ ] Custom properties (`risk-level`, `compliance-scope`, `team-ownership`) are assigned
- [ ] PR template exists at `.github/PULL_REQUEST_TEMPLATE.md`
- [ ] SECURITY.md exists with valid contact information
- [ ] No direct push to `main` is possible (force push and deletion blocked)

!!! note
    The cockpit org runs a nightly compliance scan that verifies these items across all repositories and flags drift in the observability dashboard.

## Anti-patterns

### Creating blank repositories

**Problem:** A team creates an empty repository through the GitHub UI instead of the service catalog, skipping the template entirely.

**Why it breaks:** The repository has no CODEOWNERS, no CI stub, no PR template, and no custom properties. Org-level rulesets still apply, but the `ci-enforcement` ruleset will block all merges because the required status checks never run.

**Fix:** Enforce repository creation through the service catalog. Use the enterprise policy to restrict repo creation to org owners, and have the cockpit automation handle provisioning.

### Forking a template instead of using it

**Problem:** A team forks a template repository instead of creating a new repository from it.

**Why it breaks:** A fork maintains a git relationship with the upstream template. Template updates create noisy pull requests. The fork's custom properties and CODEOWNERS do not match the new team.

**Fix:** Always use "Use this template" or the service catalog API. Never fork a template repo for project use.

### Disabling security features

**Problem:** A developer disables Dependabot or secret scanning because the alerts are "noisy."

**Why it breaks:** The repository drops below baseline. Compliance reporting flags the gap, and the team loses visibility into real vulnerabilities hidden in the noise.

**Fix:** If alerts are noisy, triage and suppress false positives through `.github/dependabot.yml` or code scanning configuration. Do not disable the feature. If the noise is systemic, raise it with the platform team to improve the workflow.

### Drift through manual changes

**Problem:** A repository starts from the template but accumulates manual changes that weaken the baseline over time (deleted CODEOWNERS, removed CI jobs, changed branch protection).

**Why it breaks:** Org-level rulesets cannot be removed, but template files can. A deleted CODEOWNERS file means code owner review requirements have no effect. A removed CI stub means status checks never report, blocking merges.

**Fix:** The nightly compliance scan catches drift. Teams should treat baseline files as infrastructure: changes require a PR and review, not silent deletion.

---

Next: [Enterprise policies](policies.md)
