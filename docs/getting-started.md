# Getting Started

This project is a reference architecture + reference implementation for operating **GitHub Enterprise at scale** (hundreds to thousands of repositories) with:

- Governance first
- Security by default
- Automation over manual process
- Developer self-service without chaos

It is inspired by **Azure Delivery Zone** principles, but adapted to GitHub realities: repos are disposable, platforms are long-lived, and guardrails must be enforced by default.

## Who this is for

- Platform engineering / DevOps teams running GitHub Enterprise
- Security & governance teams defining guardrails
- Cloud / enterprise architects designing operating models
- Product teams who want **clear paved roads** instead of bespoke approvals
- Companies moving from GitHub mono org to multi org

## What you get

### An operating model (docs)

A clear model for:

- Enterprise and organization boundaries
- Ownership (RACI), onboarding, and exceptions
- Guardrails design (what is mandatory vs configurable)
- What breaks at scale if you don’t standardize early

### A reference implementation (code)

Reusable building blocks (modules + examples) to implement:

- Organization baseline (policies, identity, governance)
- Repository baseline (rulesets, protections, CI guardrails)
- Organization and repository Rulesets and required workflows for common patterns (e.g. code scanning, dependency updates, issue templates)
- Enforcement patterns (secure-by-default, opt-out only when justified)

## Core mental model

### Analogy with Azure Landing Zone

We use this mapping throughout the docs:

| Azure Delivery Zone | GitHub Enterprise Delivery Zone |
| --- | --- |
| Tenant / Management Group | GitHub Enterprise |
| Subscription | GitHub Organization |
| Resource Group | Repository |
| Policy / Blueprint | Rulesets and Policies |

### GitHub Enterprise is a platform

In the GitHub Delivery Zone, GitHub Enterprise is not just a collection of repositories — it is a platform that enables software delivery at scale. It provides the foundation for collaboration, automation, and governance across your organization.

Most large companies already have a platform team responsible for the health and evolution of their GitHub Enterprise environment. When companies span multiple sites, business units, or teams with different requirements and autonomy levels, treating GitHub Enterprise as a product becomes essential.

Applying product management principles to your GitHub platform means:

- Defining a clear vision and strategy
- Prioritizing improvements based on user feedback and business value
- Releasing updates in a controlled and predictable manner
- Measuring success through metrics and KPIs

### Organization is a security and cost boundary

In the GitHub Delivery Zone, a GitHub Enterprise is composed of Organizations. Each organization is a logical boundary that groups repositories, teams, and users. It enforces security policies, access controls, and cost management.

A GitHub Organization is a Delivery Zone: a ready-made environment you provide to your users, with guardrails and policies suited to their needs and risk profiles. By creating multiple organizations, you can offer different levels of autonomy and control while maintaining a consistent governance model across your GitHub Enterprise.

### Repository is a delivery unit

Under each organization, teams create repositories. Each repository is a delivery unit that can be independently managed and governed — it is where code is stored, collaborated on, and delivered from. By treating repositories as delivery units, you can apply specific policies and guardrails based on each repository's purpose, sensitivity, and risk profile, providing a secure and compliant environment without sacrificing team autonomy.

## Adoption Journey

The following diagram illustrates the end-to-end journey for adopting the GitHub Enterprise Delivery Zone framework.

![Page-1](medias/Journey.drawio){ aria-label="Adoption journey diagram showing five phases: Bootstrap your environment, Enterprise Setup, KickStarted with reusable modules, Create the Cockpit Org, and Start Deploying Delivery Zones." }

<details>
<summary>Text description of adoption journey diagram</summary>

The diagram shows five phases arranged left to right:
<ul>
    <li>Phase 1: Bootstrap your environment - Purchase GitHub Enterprise Managed Users.</li>
    <li>Phase 2: Enterprise Setup - Configure the IdP for authentication.</li>
    <li>Phase 3: KickStarted - Reusable modules and actions to empower Delivery Zone users.</li>
    <li>Phase 4: Create the Cockpit Org - Create the central control-plane organization.</li>
    <li>Phase 5: Start Deploying Delivery Zones - Begin onboarding users and leveraging Delivery Zones.</li>
</ul>
</details>

---

Next: [Mental model](architecture/mental-model.md)
