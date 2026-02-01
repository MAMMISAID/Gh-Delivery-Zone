# GitHub Enterprise Landing Zone

This project is a reference architecture + reference implementation for operating **GitHub Enterprise at scale** (hundreds to thousands of repositories) with:

- governance first
- security by default
- automation over manual process
- developer self-service without chaos

It is inspired by **Azure Landing Zone** principles, but adapted to GitHub realities: repos are disposable, platforms are long-lived, and guardrails must be enforced by default.

## Who this is for

- Platform engineering / DevOps teams running GitHub Enterprise
- Security & governance teams defining guardrails
- Cloud / enterprise architects designing operating models
- Product teams who want **clear paved roads** instead of bespoke approvals

## What you get

### 1) An operating model (docs)
A clear model for:
- enterprise and organization boundaries
- ownership (RACI), onboarding, and exceptions
- guardrails design (what is mandatory vs configurable)
- what breaks at scale if you don’t standardize early

### 2) A reference implementation (code)
Reusable building blocks (modules + examples) to implement:
- organization baseline (policies, identity, governance)
- repository baseline (rulesets, protections, CI guardrails)
- reusable workflows (avoid copy/paste YAML)
- enforcement patterns (secure-by-default, opt-out only when justified)

## Core mental model

We use this mapping throughout the docs:

| Azure Landing Zone | GitHub Enterprise Landing Zone |
|---|---|
| Tenant / Management Group | GitHub Enterprise |
| Subscription | GitHub Organization |
| Resource Group | Repository |
| Policy / Blueprint | Rulesets & Reusable Workflows |

A **repository is a landing unit**, not just a code container.  
An **organization is a security and cost boundary**.  
**GitHub Enterprise is a platform**, not a tool.

➡️ Start with: **Architecture → Mental model**.

## How to use this repo

### If you want to adopt it
1. Read **Architecture** and **Operating model** first (understand the boundaries)
2. Review **Guardrails** (what is enforced by default)
3. Use **Examples** to onboard your first organization/repositories
4. Adapt configuration — avoid forking unless you must

### If you want to contribute
- Every change should include:
  - docs update (why + impact)
  - at least one example showing usage
- Decisions that change behavior should include an ADR in `docs/adr/`

## Non-goals

This is **not**:
- a click-by-click tutorial for GitHub UI
- a one-size-fits-all “golden repo” template
- a replacement for your security program

It *is* a set of proven patterns, defaults, and tradeoffs you can use to build your own enterprise-grade GitHub operating model.

---

Next: [Mental model](architecture/mental-model.md)
