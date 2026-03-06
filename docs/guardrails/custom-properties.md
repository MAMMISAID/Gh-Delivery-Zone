# Custom Properties

Custom properties are **metadata labels** attached to repositories that enable targeted governance at scale. They replace informal conventions (topics, naming patterns, README badges) with a structured, queryable, enforceable taxonomy that rulesets and automation can act on.

If rulesets define *what* controls apply, custom properties define *where* they apply.

## Why custom properties

### Targeted rulesets

Rulesets can target repositories by custom property values. Instead of applying the same rules to every repo in the org, you can apply stricter controls only to repos tagged `compliance: pci` or `environment: production`.

### Automation input

Provisioning automation reads custom properties to decide which baselines, workflows, and team structures to apply. A repo tagged `stack: node` gets Node-specific CI workflows. A repo tagged `tier: critical` gets additional monitoring.

### Compliance reporting

Custom properties are queryable via the GitHub API. The observability dashboard in the cockpit org can generate compliance reports grouped by any property: "How many production repos have code scanning enabled?" or "Which PCI repos are missing CODEOWNERS?"

### Consistency

Topics and naming conventions are freeform — nothing stops a team from typing `nodejs` instead of `node` or `prod` instead of `production`. Custom properties are defined with allowed values, so every repo uses the same vocabulary.

!!! note
    Custom properties are defined at the **organization level** (or enterprise level with Enterprise Managed Users). Repo admins set property values, but they cannot create new property definitions or change allowed values.

## Recommended properties

Define these properties in every organization. The cockpit automation sets them at repo creation and validates them during drift detection.

### team

Identifies the owning team.

| Attribute | Value |
| --- | --- |
| **Type** | Single select |
| **Required** | Yes |
| **Allowed values** | Team slugs from the org's team structure (e.g., `frontend`, `backend`, `platform`, `data`) |
| **Used by** | CODEOWNERS validation, team-based dashboards, access audit |

### stack

Identifies the primary technology stack.

| Attribute | Value |
| --- | --- |
| **Type** | Single select |
| **Required** | Yes |
| **Allowed values** | `node`, `java`, `dotnet`, `python`, `go`, `rust`, `terraform`, `other` |
| **Used by** | CI workflow selection (build.yml input), dependency scanning configuration |

### environment

Identifies the highest environment this repo deploys to.

| Attribute | Value |
| --- | --- |
| **Type** | Single select |
| **Required** | Yes |
| **Allowed values** | `production`, `staging`, `development`, `sandbox` |
| **Used by** | Ruleset targeting (stricter controls for `production`), retention policies, alerting thresholds |

### compliance

Identifies applicable compliance frameworks.

| Attribute | Value |
| --- | --- |
| **Type** | Multi select |
| **Required** | No (defaults to none) |
| **Allowed values** | `pci`, `sox`, `hipaa`, `gdpr`, `iso27001`, `none` |
| **Used by** | `sensitive-repo-protection` ruleset targeting, audit report grouping, exception approval routing |

### tier

Identifies the criticality tier for incident response and SLA.

| Attribute | Value |
| --- | --- |
| **Type** | Single select |
| **Required** | Yes |
| **Allowed values** | `critical`, `standard`, `experimental` |
| **Used by** | Alerting priority, on-call routing, required approvals count |

### lifecycle

Identifies the current lifecycle stage.

| Attribute | Value |
| --- | --- |
| **Type** | Single select |
| **Required** | Yes |
| **Allowed values** | `active`, `maintenance`, `deprecated`, `archived` |
| **Used by** | Drift detection scope (skip `archived`), dependency update scheduling, decommission workflows |

## Property-based ruleset targeting

Custom properties unlock **dynamic ruleset targeting**. Instead of listing repositories by name, rulesets match repositories by property values.

Example — stricter controls for production repos:

A ruleset targeting `environment: production` automatically applies to every repo with that property — including repos created in the future. No manual updates needed.

| Ruleset | Target property | Effect |
| --- | --- | --- |
| `sensitive-repo-protection` | `compliance: pci` OR `compliance: sox` | 2 required approvals, signed commits, restricted push |
| `production-enforcement` | `environment: production` | Required deployments to succeed, no force push to release branches |
| `critical-tier-protection` | `tier: critical` | 2 required approvals, mandatory security scan, no bypass |
| `experimental-relaxed` | `tier: experimental` | 1 required approval, evaluate mode for security scan |

!!! tip
    Property-based targeting eliminates the "new repo gap." When a team creates a repo and tags it `environment: production`, all production rulesets apply immediately. No ticket to the platform team required.

## Setting properties

### At repo creation

The cockpit provisioning automation sets properties as part of the repo creation workflow. The service catalog form collects property values from the requesting team.

```yaml
# Example: provisioning automation sets properties via API
- name: Set custom properties
  uses: actions/github-script@v7
  with:
    script: |
      await github.rest.repos.createOrUpdateCustomPropertiesValues({
        owner: 'product-org-a',
        repo: 'new-service',
        properties: [
          { property_name: 'team', value: 'backend' },
          { property_name: 'stack', value: 'java' },
          { property_name: 'environment', value: 'production' },
          { property_name: 'compliance', value: ['pci'] },
          { property_name: 'tier', value: 'critical' },
          { property_name: 'lifecycle', value: 'active' }
        ]
      });
```

### Updating properties

Org owners and repo admins can update property values through the GitHub UI or API. Changes take effect immediately — rulesets re-evaluate targeting on every push.

!!! warning
    Changing a property value changes which rulesets apply. If a team downgrades `environment` from `production` to `development`, they lose production rulesets. The drift detection workflow should flag unexpected property changes.

## Drift detection

The cockpit observability workflow validates custom properties on a schedule:

- :fontawesome-solid-square-check: Every repo has all required properties set
- :fontawesome-solid-square-check: Property values match allowed values (no stale entries after a schema change)
- :fontawesome-solid-square-check: `team` property matches at least one active team in the org
- :fontawesome-solid-square-check: `lifecycle: archived` repos are actually archived in GitHub
- :fontawesome-solid-square-check: No production repos are missing `compliance` tags when the org requires them

Drift is reported to the posture dashboard and triggers alerts for the platform team.

## Anti-patterns

### Too many properties

Defining 20 properties makes the service catalog form painful, slows down provisioning, and guarantees that half the values will be wrong or outdated.

**Fix:** start with the six recommended properties above. Add more only when there is a concrete automation or ruleset that needs them.

### Freeform values

Using a `string` type instead of `single_select` allows inconsistent values (`Node.js`, `node`, `nodejs`, `Node`). Every downstream automation must handle the variants.

**Fix:** always use `single_select` or `multi_select` with predefined allowed values. Update the allowed values list when new options are needed.

### Properties without consumers

A property that nothing reads is dead metadata. It decays immediately because no one has an incentive to keep it accurate.

**Fix:** every property should have at least one consumer: a ruleset, a dashboard, a workflow, or an audit report. If nothing uses it, delete it.

### Manual-only property management

Relying on teams to manually set properties in the UI guarantees inconsistency. Some teams forget. Others mistype. Nobody updates `lifecycle` when a repo moves to maintenance.

**Fix:** set properties at provisioning time via automation. Validate them during drift detection. Automate lifecycle transitions (e.g., auto-set `lifecycle: archived` when a repo is archived).

---

Next: [Rulesets](rulesets.md)
