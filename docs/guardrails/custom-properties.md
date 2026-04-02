# Custom Properties

Custom properties are **structured metadata** attached to repositories and organizations within a GitHub Enterprise. They serve two purposes in this framework:

1. **Repository metadata** — classify and describe repositories with key-value pairs (team ownership, risk level, compliance scope, technology stack).
2. **Targeting criteria for policies and rulesets** — dynamically scope which repositories or organizations a ruleset applies to, without manual per-repo configuration.

Custom properties are defined at the **enterprise level** and inherited by all organizations within the enterprise. Organization owners can also define additional properties at the org level for local needs.

## Why custom properties matter

Without custom properties, applying different governance rules to different categories of repositories requires one of two approaches:

- **Manual ruleset targeting** — maintain a static list of repositories per ruleset, which drifts as repos are created or decommissioned.
- **Topic-based targeting** — use repository topics as a proxy for classification, which is fragile because topics are free-form and not enforced.

Custom properties solve both problems. They provide a **typed, enforced, enterprise-managed schema** that rulesets can reference directly. When a repository is tagged with a custom property value, the matching rulesets apply automatically.

!!! tip
    Think of custom properties as the "labels" that connect your governance policies to the right repositories. Define the properties once at the enterprise level, assign values per repository, and let rulesets do the rest.

## How inheritance works

Custom properties follow a top-down inheritance model:

![Page-1](../medias/custom-properties-inheritance.drawio){ aria-label="Custom properties inheritance model showing three levels: Enterprise defines the schema, Organization inherits it, and Repository assigns values." }

- **Enterprise owners** define the property schema — the list of allowed properties, their types, whether they are required, and their default values.
- **Organization owners** inherit the enterprise schema. They can also create org-scoped properties for local classification needs.
- **Repository actors** can set property values on their repositories if the property allows it (configurable per property). If a required property has no explicit value, the default value applies automatically.

## Property types

Each custom property has a typed value. The available types are:

| Type | Description | Example |
| --- | --- | --- |
| **String** | Free-form text | `team-ownership: "platform-team"` |
| **Single select** | One value from a predefined list | `risk-level: "high"` |
| **Multi select** | Multiple values from a predefined list | `compliance: ["pci", "sox"]` |
| **True/False** | Boolean flag | `contains-pii: true` |

!!! warning
    Use **single select** or **multi select** over free-form strings whenever possible. Typed values prevent typos and inconsistency that would break ruleset targeting.

## Recommended properties

The following properties are defined at the enterprise level and used by the framework to scope policies and rulesets across all organizations.

| Property | Type | Required | Default | Purpose |
| --- | --- | --- | --- | --- |
| `risk-level` | Single select (`low`, `medium`, `high`, `critical`) | Yes | `low` | Drives tiered ruleset enforcement (review counts, signing, deployment gates) |
| `compliance-scope` | Multi select (`pci`, `sox`, `hipaa`, `gdpr`, `none`) | Yes | `none` | Targets compliance-specific rulesets |
| `team-ownership` | String | Yes | — | Identifies the owning team for routing reviews and notifications |
| `environment-type` | Single select (`production`, `staging`, `development`, `sandbox`) | No | `development` | Scopes deployment-related rulesets |
| `contains-pii` | True/False | No | `false` | Triggers data-protection rulesets (encryption, access restrictions) |
| `technology-stack` | Multi select (`java`, `python`, `node`, `go`, `dotnet`, `other`) | No | — | Targets language-specific CI workflows and security scanners |

!!! note
    These are recommendations. Adapt the property schema to your enterprise's organizational structure and compliance requirements. The important thing is to define properties **once at the enterprise level** so that all organizations share a consistent taxonomy.

## Ruleset targeting

Custom properties become powerful when used as **targeting criteria** in rulesets. Instead of maintaining a static list of repositories per ruleset, you define conditions based on property values and let GitHub match repositories automatically.

![Page-1](../medias/custom-properties-targeting.drawio){ aria-label="Diagram showing how custom property values on repositories are used as targeting criteria to dynamically apply the correct rulesets." }

### How targeting works

When you create or edit a ruleset at the organization or enterprise level, you can specify targeting conditions that reference custom properties. Any repository whose property values match the conditions will have the ruleset applied automatically.

The targeting criteria support:

- **Exact match** — apply to repositories where a property equals a specific value (e.g., `risk-level` is `high`).
- **Multi-value match** — apply to repositories where a multi-select property includes a specific value (e.g., `compliance-scope` includes `pci`).
- **Combination** — combine multiple property conditions so that a ruleset applies only when all conditions are met.

### Example: tiered protection by risk level

A common pattern is to define multiple rulesets with increasing strictness, each targeting a different `risk-level` value:

| Ruleset | Targeting condition | Rules applied |
| --- | --- | --- |
| `baseline-protection` | All repositories (default) | Require pull request, 1 approval, status checks |
| `sensitive-repo-protection` | `risk-level: high` | Require 2 approvals, signed commits, dismiss stale reviews, restrict force push |
| `critical-repo-protection` | `risk-level: critical` | Require 3 approvals, code owner review, linear history, lock branch on merge |

When a repository is tagged with `risk-level: high`, the `sensitive-repo-protection` ruleset applies automatically in addition to the baseline. No manual per-repo configuration is needed, and new repositories that receive the property value are covered immediately.

### Relationship between properties and rulesets

Custom properties and rulesets form a two-part system:

- **Properties** classify repositories (the "what").
- **Rulesets** enforce governance rules (the "how").
- **Targeting** connects the two (the "where").

Changing a property value on a repository changes which rulesets apply to it. This makes property assignment a governance decision, not just a metadata update. See [Rulesets](rulesets.md) for the full ruleset configuration reference.

!!! note
    If a repository matches multiple rulesets, GitHub applies all matching rulesets. The most restrictive rule wins when there is a conflict (e.g., the highest required approval count across all matching rulesets is enforced).

## Governance workflow

The full lifecycle of custom properties in the governance framework:

1. **Define** the property schema at the enterprise level (platform team).
2. **Assign** property values at repository creation via automation or manually.
3. **Reference** properties in ruleset targeting criteria at the org or enterprise level.
4. **Enforce** — rulesets apply automatically to matching repositories.
5. **Audit** — use property values in reporting and compliance dashboards to verify coverage.
6. **Evolve** — add new properties or values as governance needs change. Existing repositories inherit schema changes and can be bulk-updated.

!!! warning
    Changing a property value on a repository can change which rulesets apply to it. Treat property reassignment as a governance action — review the impact before changing `risk-level` or `compliance-scope` on production repositories.

---

Next: [Required workflows](required-workflows.md)
