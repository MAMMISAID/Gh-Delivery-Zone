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
- Organization and repository Rulesets and reusable workflows for common patterns (e.g. code scanning, dependency updates, issue templates)
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

In GitHub Delivery Zone,GitHub Enterprise is not just a collection of repositories, but a platform that enables software delivery at scale. It provides the foundation for collaboration, automation, and governance across your organization.
In some cases, you may want to treat GitHub Enterprise as a product, with its own roadmap, backlog, and team responsible for its health and evolution. This is especially important if you have a large and complex GitHub environment, or if you want to continuously improve the developer experience and security posture of your platform.

Most on large companies have a platform team responsible for the health and evolution of their GitHub Enterprise environment, and they treat it as a product that serves the needs of their developers and business. and If you add to that the fact that companies can have multiple sites, business units, or teams with different requirements and autonomy levels, it becomes even more important to have a clear vision and strategy for your GitHub platform, and to apply product management principles to it.

If you treat GitHub Enterprise as a product, you can apply product management principles to it, such as:

- Defining a clear vision and strategy for your GitHub platform
- Prioritizing features and improvements based on user feedback and business value
- Iterating and releasing updates to your platform in a controlled and predictable manner
- Measuring the success of your platform through metrics and KPIs

### Organization is a security and cost boundary

In GitHub Delivery Zone, GitHub Enterprise is composed of Organizations, an organization is a logical boundary that can be used to group repositories, teams, and users. It can also be used to enforce security policies and access controls, as well as to manage costs and billing. By using organizations effectively, you can create clear boundaries for different teams, projects, or environments, and apply different policies and guardrails to each organization based on their specific needs and risk profiles.

A GitHub Organization is a Delivery Zone , and it is a setup that ou provide to your users, with guardrails and policies that are appropriate for their needs and risk profiles. By creating multiple organizations, you can provide different levels of autonomy and control to different teams or projects, while still maintaining a consistent governance model across your GitHub Enterprise environment.

### Repository is a delivery unit

In GitHub Delivery Zone, under each organization, teams can create repositories, and each repository is a delivery unit that can be independently managed and governed. A repository is where code is stored, collaborated on, and delivered from. By treating repositories as delivery units, you can apply specific policies and guardrails to each repository based on its purpose, sensitivity, and risk profile. This allows you to provide a secure and compliant environment for your code, while still enabling flexibility and autonomy for your teams.

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
