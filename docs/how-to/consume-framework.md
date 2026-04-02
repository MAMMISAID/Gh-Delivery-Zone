# How to Consume the Framework

This guide explains how product teams adopt the GitHub Enterprise Delivery Zone framework. The framework is designed around **paved roads**: the easiest path is the compliant path. Your job is not to build governance from scratch but to consume what the platform organization already provides.

If you're familiar with Azure Landing Zones, consuming the framework is like deploying into a subscription the platform team already provisioned with policies and networking. The templates, workflows, rulesets, and exception process map directly to Azure concepts you already know.

If you follow these steps, your repositories will be secure by default, your CI/CD will be standardized, and your team will spend zero time reinventing guardrails.

## Prerequisites

Before you start, make sure the following are in place:

- [ ] Your team has been onboarded to a GitHub Enterprise organization (see [Onboarding a team](onboarding-a-team.md))
- [ ] You have **member** (or higher) access to your product organization
- [ ] You understand what guardrails are and why they exist (see [Enterprise policies](../guardrails/policies.md))
- [ ] You know which Cockpit organization hosts the platform templates and required workflows
- [ ] Your team lead has been added to the appropriate GitHub team with write permissions

!!! note
    If any of these prerequisites are missing, contact the platform team through the service catalog before proceeding. Do not attempt to set up governance controls manually.

## Step 1 — Use repository templates

Every new repository should be created from a **platform-provided template**. These templates include the baseline configuration out of the box: branch protection via rulesets, required CI checks, security scanning, and a standard directory structure.

!!! note "Azure parallel"
    Templates serve the same role as **Azure Blueprints**: a compliant starting point so teams never begin from a blank slate.

To create a repository from a template:

1. Navigate to your organization on GitHub
2. Click **New repository**
3. Under **Repository template**, select the appropriate template from the platform organization (e.g., `cockpit-org/template-service`, `cockpit-org/template-library`)
4. Name your repository following the organization naming convention
5. Set visibility according to your organization policy (most product repos are **internal** or **private**)
6. Click **Create repository**

!!! tip
    Templates are versioned. The platform team updates them regularly. When you create a repo from a template, you get the latest baseline at that point in time. Future updates to the template do not propagate automatically — required workflows handle ongoing alignment.

## Step 2 — Consume required workflows

Required workflows are the platform's API for CI/CD. Instead of writing your own build, test, scan, and release pipelines from scratch, you reference workflows published by the platform organization.

!!! note "Azure parallel"
    Required workflows are analogous to **shared services in an Azure Landing Zone** (hub firewall, shared container registry, centralized log workspace). The platform team maintains them; you consume them.

Create a `.github/workflows/ci.yml` file in your repository that calls the platform required workflows:

```yaml
name: CI Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build-and-test:
    uses: cockpit-org/.github/.github/workflows/build-test.yml@v1
    with:
      language: java
      java-version: "17"
    secrets: inherit

  security-scan:
    uses: cockpit-org/.github/.github/workflows/security-scan.yml@v1
    secrets: inherit

  lint:
    uses: cockpit-org/.github/.github/workflows/lint.yml@v1
    with:
      language: java
    secrets: inherit
```

!!! warning
    Always pin required workflows to a **version tag** (e.g., `@v1`), not a branch. The platform team follows semantic versioning: breaking changes increment the major version, so `@v1` is safe for automatic minor and patch updates.

Key points:

- `secrets: inherit` passes the caller's secrets to the required workflow — no manual secret configuration needed
- The `with` block accepts inputs defined by the platform workflow; check the workflow README for available options
- You can add project-specific jobs alongside platform workflows, but platform jobs must remain present for compliance

## Step 3 — Comply with rulesets

Rulesets are organization-level and repository-level rules enforced by the platform. They replace legacy branch protection rules with a centralized, auditable model.

!!! note "Azure parallel"
    Rulesets map to **Azure Policy assignments**: defined at the org (management group) level, inherited by all child scopes, and not removable by individual teams.

Common rulesets enforced across all product organizations:

- **Default branch protection** — requires pull request reviews, status checks, and linear history
- **Tag protection** — prevents unauthorized tag creation for release artifacts
- **Required workflows** — ensures platform CI jobs run on every pull request

To check your repository's compliance:

1. Go to your repository **Settings > Rules > Rulesets**
2. Review which rulesets are applied (organization-level rulesets appear as inherited)
3. Verify that required status checks match the required workflows you configured

!!! note
    You cannot disable organization-level rulesets. They are enforced by the platform team. If a ruleset conflicts with a legitimate use case, use the exception process described below.

## Step 4 — Request exceptions when needed

Exceptions are part of the model, not a failure of it. If a baseline control blocks a legitimate use case, you can request a time-bound exception.

!!! note "Azure parallel"
    Exceptions work like **Azure Policy exemptions**: time-bound, justified, tracked in a central registry, and automatically re-evaluated at expiry.

The process:

1. Review the [Exception process](../operating-model/exception-process.md) documentation
2. Open a request through the service catalog (or the designated issue template in the Cockpit organization)
3. Provide: repository name, ruleset or control you need an exception for, business justification, requested duration
4. The platform team reviews and either approves (with an expiry date) or suggests an alternative approach
5. Approved exceptions are logged in the exception registry and audited regularly

!!! warning
    Exceptions are time-bound. When an exception expires, the baseline control is re-enabled automatically. Plan your work accordingly and request renewal before expiry if needed.

## What not to do

The following patterns undermine the framework and create governance drift at scale. Avoid them.

**Do not copy/paste required workflows into your repository.** This creates a local fork that will drift from the platform version. You lose automatic updates, security patches, and compliance alignment. Always reference workflows with `uses:`. In Azure terms, this is like deploying your own firewall in a spoke instead of routing through the hub — you lose centralized management for no gain.

**Do not disable security features.** Secret scanning, Dependabot, and code scanning are enabled by default for a reason. If they produce false positives, report them to the platform team rather than disabling the feature. This is equivalent to removing Microsoft Defender for Cloud from your Azure subscription — you lose visibility the security team depends on.

**Do not create shadow automation.** Custom GitHub Apps, self-hosted webhook servers, or ad hoc scripts that duplicate platform functionality create maintenance burden and security blind spots. If the platform does not cover your use case, raise it as a feature request. In Azure terms, this is shadow IT — deploying unmanaged resources outside the Landing Zone where governance cannot reach them.

**Do not bypass rulesets with admin overrides.** Even if you have admin access to a repository, overriding rulesets defeats the purpose of centralized governance. Use the exception process instead. This is like using Owner permissions to delete Azure Policy assignments — technically possible, but it breaks the contract with the platform team.

- [ ] Confirm your repositories are created from platform templates
- [ ] Confirm your CI/CD references platform required workflows
- [ ] Confirm rulesets are active and not overridden
- [ ] Confirm no local copies of platform workflows exist in your repositories

---

Next: [Onboarding a team](onboarding-a-team.md)
