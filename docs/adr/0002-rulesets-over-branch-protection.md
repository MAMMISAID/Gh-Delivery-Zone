# ADR 0002: Rulesets over Branch Protection Rules

## Status

**Accepted**

## Context

The GitHub Enterprise Delivery Zone framework needs an enforcement mechanism that applies guardrails consistently across hundreds of repositories. The mechanism must support org-level scope, auditability, and safe rollout without requiring per-repo manual configuration.

Legacy branch protection rules were designed for individual repositories. They work at small scale but create operational burden at enterprise scale: each rule is scoped to a single repo, admin overrides are silent, rules are not stackable, and there is no dry-run mode for testing changes before enforcement.

The framework needs a mechanism that platform teams can manage centrally and that repo admins cannot silently disable.

## Decision

Use **GitHub rulesets** as the primary enforcement mechanism instead of legacy branch protection rules.

All new guardrails are implemented as rulesets. Existing branch protection rules are migrated to rulesets as part of baseline adoption.

## Rationale

**Org-level scope.** A single ruleset defined at the organization level applies automatically to every repository that matches the targeting criteria. Repo admins cannot remove it. This is the foundation of "secure by default."

**Stackable.** Multiple rulesets can target the same branches and merge their requirements. Branch protection rules allow only one rule set per branch pattern, forcing all controls into a single configuration.

**Bypass with audit trail.** Rulesets define explicit bypass actors. Every bypass is logged and visible in the audit stream. Branch protection rules allow admin override with no trace in the audit log.

**Evaluate mode.** Rulesets support an evaluate (dry-run) mode that logs what would be enforced without blocking developers. This enables safe rollout of new guardrails across the organization before switching to active enforcement.

**API management at scale.** A single API call can apply a ruleset to all targeted repositories. Branch protection rules require per-repo API calls, which scales poorly and creates drift risk.

See the full comparison table in [Rulesets](../guardrails/rulesets.md).

## Alternatives considered

**Legacy branch protection rules.** Repo-level only, not stackable, admin override is silent, no evaluate mode. They cannot provide consistent org-wide enforcement and create a maintenance burden proportional to the number of repositories.

**Third-party enforcement tools.** Tools like Allstar or custom policy-as-code engines can enforce repository configuration. However, they introduce an additional dependency outside the GitHub platform, require separate infrastructure, and lack the native integration that rulesets provide (UI, API, audit log, bypass controls). Native enforcement is preferred when the platform supports it.

## Consequences

This decision has the following implications:

- **All guardrails are expressed as rulesets.** Branch protection rules are not used for new enforcement. Existing branch protection rules are migrated during onboarding.
- **Platform team manages org-level rulesets centrally.** Product teams can add repo-level rulesets that are stricter, but they cannot weaken org-level enforcement.
- **Evaluate mode is used for rollout.** New rulesets are deployed in evaluate mode first, monitored for impact, and then switched to active enforcement. This adds a rollout step but reduces the risk of blocking developers unexpectedly.
- **Bypass actors must be explicitly defined.** There is no silent admin override. Teams that need to bypass a ruleset must be listed as bypass actors, and every bypass is logged.

---
