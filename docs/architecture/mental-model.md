# Mental Model

A landing zone is a **platform operating model** with guardrails and paved roads.
In Azure, the Landing Zone concept exists because *scale breaks informal governance*.

GitHub Enterprise has the same problem: once you cross a certain number of repositories and teams, you get:

- inconsistent protection rules
- insecure workflows and token sprawl
- duplicated YAML and random CI patterns
- unclear ownership and exception chaos
- “we can’t audit it” moments

The GitHub Enterprise Landing Zone is how you prevent that.

## Overview

```mermaid
flowchart TB
  %% =========================
  %% GitHub Enterprise Landing Zone - Governance Topology
  %% =========================

  subgraph ENT["GitHub Enterprise (Platform Boundary)"]
    direction TB

    %% ---- Enterprise governance surfaces ----
    EP["Enterprise Policies\n- SSO/SAML + SCIM\n- IP allow list / network controls\n- Security products & reporting\n- Audit log / insights\n- Default settings (where applicable)"]
  end

  %% =========================
  %% Cockpit / Control Plane Org
  %% =========================
  subgraph COCKPIT["Cockpit Organization (Control Plane / Platform Team)"]
    direction TB

    CAT["Catalog / Self-Service\n- org request templates\n- repo request templates\n- approved archetypes"]
    AUTO["Automation & Provisioning\n(OpenTofu / Terraform / GitHub APIs)\n- create orgs\n- apply org baseline\n- bootstrap teams/repos"]
    POLICY["Policy as Code\n- reusable workflows\n- rulesets as code\n- config registry"]
    OBS["Observability & Compliance\n- drift detection\n- posture dashboards\n- exception registry"]
    ESC["Exception Handling\n- break-glass process\n- time-bound waivers\n- approval + audit trail"]
  end

  %% =========================
  %% Team / Project Orgs
  %% =========================
  subgraph ORGS["Team / Project Organizations (Security + Cost Boundaries)"]
    direction LR

    subgraph ORG1["Org: product-a"]
      direction TB
      O1BASE["Org Baseline (Mandatory)\n- SSO enforced\n- org rulesets\n- default repo settings\n- secret scanning / code scanning\n- dependency graph\n- allowed apps/runners"]
      O1TEAM["Teams\n- owners (minimal)\n- maintainers\n- contributors"]
      O1REPOS["Repositories (Landing Units)\n- services\n- libs\n- IaC\n- docs"]
    end

    subgraph ORG2["Org: platform-shared"]
      direction TB
      O2BASE["Org Baseline (Mandatory)"]
      O2TEAM["Teams"]
      O2REPOS["Repositories"]
    end

    subgraph ORG3["Org: sandbox"]
      direction TB
      O3BASE["Org Baseline (Relaxed)\n- still secure-by-default\n- more experimentation\n- stricter cleanup/TTL"]
      O3TEAM["Teams"]
      O3REPOS["Repositories"]
    end
  end

  %% =========================
  %% Repo Guardrails Pattern
  %% =========================
  subgraph REPOGOV["Repository Baseline (Guardrails)"]
    direction TB
    RS["Rulesets (Policy / Blueprint)\n- branch protections\n- required reviews\n- status checks\n- signed commits/tags (optional)\n- tag protections"]
    WF["Reusable Workflows (Paved Roads)\n- build/test\n- SAST/SCA\n- release\n- provenance/SBOM"]
    SEC["Security Defaults\n- secret scanning\n- dependabot\n- code scanning\n- vulnerability alerts"]
  end

  %% =========================
  %% Relationships
  %% =========================
  EP --> COCKPIT

  %% Self-service path
  CAT --> AUTO
  AUTO --> ORG1
  AUTO --> ORG2
  AUTO --> ORG3

  %% Baselines applied everywhere
  POLICY --> O1BASE
  POLICY --> O2BASE
  POLICY --> O3BASE

  %% Repo guardrails applied inside orgs
  O1REPOS --> REPOGOV
  O2REPOS --> REPOGOV
  O3REPOS --> REPOGOV

  %% Compliance feedback loop
  OBS --> EP
  OBS --> O1BASE
  OBS --> O2BASE
  OBS --> O3BASE

  %% Exceptions are controlled
  ESC -. "waiver (time-bound)\n+ audit trail" .-> O1BASE
  ESC -. "waiver (time-bound)\n+ audit trail" .-> RS

  %% Teams operate repos within boundaries
  O1TEAM --> O1REPOS
  O2TEAM --> O2REPOS
  O3TEAM --> O3REPOS
```

## The mapping

We reuse Azure Landing Zone thinking because it gives a clean hierarchy of boundaries.

| Azure Landing Zone | GitHub Enterprise Landing Zone | Why it matters |
| --- | ---| --- |
| Tenant / Mgmt Group | GitHub Enterprise | Top-level platform boundary (identity, audit, governance) |
| Subscription | GitHub Organization | **Security + cost boundary**; separation of duties; blast radius control |
| Resource Group | Repository | **Landing unit**: baseline controls, CI standards, lifecycle |
| Policy / Blueprint | Rulesets & Reusable Workflows | Enforced guardrails + paved road automation |

### Key interpretation
- **Enterprise** is the platform surface: identity, audit, governance primitives.
- **Organization** is where you enforce boundaries (who can do what, where, and how).
- **Repository** is where developers live — so guardrails must be automatic and default.

## What breaks at scale (and how this model prevents it)

### 1) “Every repo is unique”
**Symptom:** teams copy workflows, protections drift, security posture is unknown.

**Fix:** repositories get a baseline through:

- rulesets (branch protections, required checks)
- reusable workflows (standard build/test/scan)
- a defined exception path (documented, time-bound, reviewed)

### 2) “One org to rule them all”
**Symptom:** permission sprawl, audit complexity, blast radius is huge, billing is opaque.

**Fix:** treat organizations as:

- product/portfolio boundaries (or regulatory boundaries)
- ownership boundaries (platform vs product responsibility)
- cost/billing boundaries (chargeback/showback)
- containment boundaries (incidents and mistakes don’t propagate)

### 3) “Security is a ticket queue”
**Symptom:** platform team becomes gatekeeper; developers circumvent controls.

**Fix:** security-by-default with self-service:

- guardrails are enforced automatically
- paved roads are the easiest path
- opt-out exists but is explicit and measurable

## Design principles (opinionated defaults)

1. **Governance first, automation second**  
   Automate the policy you can explain and defend.

2. **Secure by default, opt-out only when justified**  
   Exceptions are part of the model, not a failure of it.

3. **Scale matters more than convenience**  
   Small shortcuts turn into massive drift at 500+ repos.

4. **Avoid YAML copy/paste anti-patterns**  
   Reusable workflows are the platform API.

5. **Platform enables, it doesn’t gatekeep**  
   The goal is paved roads, not approvals.

## What “baseline” means in this project

A baseline is the minimum set of controls and conventions that make a repo:

- safe to merge to default branch
- observable (status checks, logs, evidence)
- consistent to build and deploy
- auditable with low effort

Baselines should be:

- opinionated
- configurable
- versioned over time
- measurable (you can report compliance)

---

Next: define boundaries with [Organization strategy](org-strategy.md)
