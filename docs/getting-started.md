# Getting Started

This project is a reference architecture + reference implementation for operating **GitHub Enterprise at scale** (hundreds to thousands of repositories) with:

- Governance first
- Security by default
- Automation over manual process
- Developer self-service without chaos

It is inspired by **Azure Landing Zone** principles, but adapted to GitHub realities: repos are disposable, platforms are long-lived, and guardrails must be enforced by default.

## Who this is for

- Platform engineering / DevOps teams running GitHub Enterprise
- Security & governance teams defining guardrails
- Cloud / enterprise architects designing operating models
- Product teams who want **clear paved roads** instead of bespoke approvals
- Companies moving from GitHub mono org to multi org

## What you get

### 1) An operating model (docs)

A clear model for:

- Enterprise and organization boundaries
- Ownership (RACI), onboarding, and exceptions
- Guardrails design (what is mandatory vs configurable)
- What breaks at scale if you don’t standardize early

### 2) A reference implementation (code)

Reusable building blocks (modules + examples) to implement:

- Organization baseline (policies, identity, governance)
- Repository baseline (rulesets, protections, CI guardrails)
- Reusable workflows (avoid copy/paste YAML)
- Enforcement patterns (secure-by-default, opt-out only when justified)

## Core mental model

We use this mapping throughout the docs:

| Azure Landing Zone | GitHub Enterprise Landing Zone |
| --- | --- |
| Tenant / Management Group | GitHub Enterprise |
| Subscription | GitHub Organization |
| Resource Group | Repository |
| Policy / Blueprint | Rulesets & Reusable Workflows |

A **repository is a landing unit**, not just a code container.  
An **organization is a security and cost boundary**.  
**GitHub Enterprise is a platform**, not a tool.

➡️ Start with: **Architecture → Mental model**.

## Requirements

- GitHub Cloud Organization (to ensure the code compatibility), you can adopt the framework and implement it on GitHub Server.
- GitHub Enterprise Admin Access

## Adoption Journey

The following diagram illustrates the end-to-end journey for adopting the GitHub Enterprise Delivery Zone framework.

![Page-1](medias/Journey.drawio)

---

Next: [Mental model](architecture/mental-model.md)
