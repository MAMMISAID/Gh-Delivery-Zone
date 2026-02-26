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
%%{init: {'theme': 'base', 'flowchart': {'curve': 'basis', 'nodeSpacing': 45, 'rankSpacing': 65}, 'themeVariables': {'fontSize': '14px', 'fontFamily': 'Segoe UI, Arial, sans-serif', 'lineColor': '#6e7781', 'clusterBkg': '#ffffff', 'clusterBorder': '#d0d7de', 'primaryTextColor': '#1f2328'}}}%%
flowchart TB
  subgraph L1["Enterprise Platform Boundary"]
    EP["GitHub Enterprise<br/>Identity, audit, and governance controls"]
  end

  subgraph L2["Cockpit Organization (Control Plane)"]
    direction LR
    CAT["Service Catalog<br/>Org/repo request templates"]
    AUTO["Provisioning Automation<br/>OpenTofu/Terraform + GitHub APIs"]
    POLICY["Policy as Code<br/>Rulesets + reusable workflows"]
    OBS["Observability<br/>Drift and posture dashboards"]
    EXC["Exception Registry<br/>Time-bound waivers + approvals"]
    CAT --> AUTO
  end

  subgraph L3["Team / Product Organizations (Security + Cost Boundaries)"]
    direction LR
    subgraph ORG_A["Org: product-a"]
      direction TB
      A_BASE["Org Baseline"]
      A_TEAM["Teams"]
      A_REPO["Repositories"]
      A_BASE --> A_REPO
      A_TEAM --> A_REPO
    end
    subgraph ORG_B["Org: platform-shared"]
      direction TB
      B_BASE["Org Baseline"]
      B_TEAM["Teams"]
      B_REPO["Repositories"]
      B_BASE --> B_REPO
      B_TEAM --> B_REPO
    end
    subgraph ORG_C["Org: sandbox"]
      direction TB
      C_BASE["Org Baseline (Relaxed)"]
      C_TEAM["Teams"]
      C_REPO["Repositories"]
      C_BASE --> C_REPO
      C_TEAM --> C_REPO
    end
  end

  subgraph L4["Repository Guardrails (Applied in Every Repo)"]
    direction LR
    GATE["Guardrail Pack"]
    RS["Rulesets<br/>Branch protection + required checks"]
    WF["Reusable Workflows<br/>Build, test, scan, release"]
    SEC["Security Defaults<br/>Secret scanning, code scanning, dependencies"]
    GATE --> RS
    GATE --> WF
    GATE --> SEC
  end

  EP --> AUTO
  AUTO --> A_BASE
  AUTO --> B_BASE
  AUTO --> C_BASE
  POLICY --> A_BASE
  POLICY --> B_BASE
  POLICY --> C_BASE

  A_REPO --> GATE
  B_REPO --> GATE
  C_REPO --> GATE

  OBS --> EP
  OBS --> A_BASE
  OBS --> B_BASE
  OBS --> C_BASE

  EXC -. "waiver + expiry + audit" .-> A_BASE
  EXC -. "waiver + expiry + audit" .-> GATE

  classDef enterprise fill:#fff4e5,stroke:#d4a72c,stroke-width:1.5px,color:#1f2328;
  classDef control fill:#e7f0ff,stroke:#218bff,stroke-width:1.4px,color:#1f2328;
  classDef org fill:#f6f8fa,stroke:#8c959f,stroke-width:1.2px,color:#1f2328;
  classDef guard fill:#eaf9f1,stroke:#2da44e,stroke-width:1.4px,color:#1f2328;

  class EP enterprise;
  class CAT,AUTO,POLICY,OBS,EXC control;
  class A_BASE,A_TEAM,A_REPO,B_BASE,B_TEAM,B_REPO,C_BASE,C_TEAM,C_REPO org;
  class GATE,RS,WF,SEC guard;
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
