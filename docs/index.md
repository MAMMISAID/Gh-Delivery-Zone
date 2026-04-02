# GitHub Enterprise Delivery Zone

An opinionated framework for operating **GitHub Enterprise Cloud (EMU)** at scale -- hundreds of organizations, thousands of repositories, governed by default. Inspired by [Azure Landing Zones](https://learn.microsoft.com/azure/cloud-adoption-framework/ready/landing-zone/), the Delivery Zone Framework applies the same boundary-driven thinking to GitHub: clear layers, enforced guardrails, and paved roads for every team.

## Who This Is For

| Audience | Start here |
| --- | --- |
| **Platform engineers / DevOps** | [Architecture](architecture/mental-model.md), [Guardrails](guardrails/policies.md) |
| **Security and compliance** | [Policies](guardrails/policies.md), [Rulesets](guardrails/rulesets.md), [Exception process](operating-model/exception-process.md) |
| **Enterprise architects** | [Mental model](architecture/mental-model.md), [Organization strategy](architecture/org-strategy.md) |
| **Product / delivery teams** | [Onboarding a team](how-to/onboarding-a-team.md), [Consume framework](how-to/consume-framework.md) |
| **Decision-makers** | [Getting started](getting-started.md) |

## Framework at a Glance

The Delivery Zone model has four layers, each mapping to a GitHub boundary:

| Layer | GitHub concept | Responsibility |
| --- | --- | --- |
| **Enterprise** | GitHub Enterprise | Identity, billing, global policy ceiling |
| **Cockpit Organization** | Central control-plane org | Provisioning automation, policy-as-code, observability |
| **Delivery Zone (Organization)** | Team / product org | Scoped guardrails, team autonomy within boundaries |
| **Repository** | Individual repo | Rulesets, required workflows, security defaults |

For the full architecture, see [Core mental model](architecture/mental-model.md).

## Key Definitions

- **Delivery Zone** -- A GitHub Organization configured with a specific set of guardrails, policies, and paved roads tailored to its teams' needs and risk profile.
- **Delivery Zone Framework** -- The overall operating model, reference architecture, and reusable modules that let you create and govern Delivery Zones consistently at scale.
- **Cockpit Organization** -- The central control-plane organization that owns provisioning automation, policy definitions, the service catalog, and the exception registry.
- **Paved Roads** -- Pre-built, secure-by-default patterns (required workflows, repository templates, rulesets) that teams adopt instead of building from scratch.
- **Guardrails** -- Policies and rulesets enforced at the enterprise, organization, or repository level to maintain security and compliance without blocking delivery.
- **Baseline** -- The minimum set of guardrails and configurations applied to every new organization or repository by default.

## Where to Start

!!! tip "New here?"
    Read the [Getting started](getting-started.md) guide for a full orientation -- it covers the value proposition, the adoption journey, and links to every section of the documentation.

## Documentation Sections

| Section | What it covers |
| --- | --- |
| [Getting started](getting-started.md) | Value proposition, core mental model overview, adoption journey |
| [Architecture](architecture/mental-model.md) | 4-layer model, Azure Landing Zone mapping, organization strategy |
| [Operating model](operating-model/roles-raci.md) | Roles and RACI, exception process |
| [Guardrails](guardrails/policies.md) | Enterprise policies, custom properties, rulesets, required workflows |
| [How-to guides](how-to/consume-framework.md) | Consuming the framework, onboarding a team |
| [Decisions (ADRs)](adr/0001-docs-stack.md) | Architecture Decision Records for this project |
