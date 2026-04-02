# How to Author Required Workflows

This guide is for the **Platform Team** responsible for maintaining the cockpit organization's workflow catalog. It covers designing, testing, versioning, and releasing the required workflows that org-level rulesets mandate every product repository to run. For an overview of what required workflows are and how rulesets enforce them, see [Required Workflows](../guardrails/required-workflows.md).

## Workflow design principles

Required workflows are the platform's mandated CI/CD standards. Every input, output, and behavior is a contract with every consuming repository. Design accordingly.

| Principle | Rationale |
| --- | --- |
| Minimize required inputs | Fewer required inputs means faster adoption. Use sensible defaults for everything except truly repo-specific values. |
| Type and document every input | Consumers should never have to read the workflow source to understand what to pass. |
| Never break consumers on minor/patch | A non-breaking change means no renamed inputs, no removed steps, and no altered default behavior. |
| Scope permissions to the minimum | Request only the `GITHUB_TOKEN` permissions each job actually needs. Never use `permissions: write-all`. |
| One workflow, one responsibility | Each workflow should do one thing well. Compose workflows in the caller, not inside a single monolith. |

!!! tip
    Write a `README.md` for every workflow. Include the purpose, all inputs with types and defaults, outputs, required secrets, and a minimal caller example. The README is the contract documentation.

## When to create a new workflow

Not every automation belongs in the catalog. Create a new required workflow when:

- The same pattern appears in **three or more teams** independently.
- A step is **security-critical** and must be executed consistently (e.g., artifact signing, vulnerability scanning).
- A **compliance requirement** mandates a specific process that cannot be left to individual teams.

If only one team needs it, it belongs in that team's repository. If two teams need it, watch the pattern. At three, promote it to the catalog.

## Authoring a new workflow

### File structure

Place workflow files in the cockpit organization under `.github/workflows/`. Follow this structure:

```yaml
# .github/workflows/build.yml
name: Build

on:
  workflow_call:
    inputs:
      language:
        description: "Runtime/language (node, java, dotnet, python, go)"
        required: true
        type: string
      language-version:
        description: "Version of the runtime"
        required: false
        type: string
        default: "latest"
      artifact-name:
        description: "Name for the uploaded artifact"
        required: false
        type: string
        default: ""
    secrets:
      REGISTRY_TOKEN:
        description: "Token for the artifact registry (platform-owned)"
        required: false
    outputs:
      artifact-id:
        description: "ID of the uploaded artifact"
        value: ${{ jobs.build.outputs.artifact-id }}

permissions:
  contents: read
  packages: write

jobs:
  build:
    runs-on: ubuntu-latest
    outputs:
      artifact-id: ${{ steps.upload.outputs.artifact-id }}
    steps:
      - uses: actions/checkout@v4
      # ... build steps per language
```

### Input design

| Practice | Example |
| --- | --- |
| Use `required: true` only for values the workflow cannot guess | `language` is required; `language-version` defaults to `latest` |
| Provide defaults for optional inputs | `coverage-threshold` defaults to `80` |
| Use `choice` descriptions to list valid values | `"Runtime: node, java, dotnet, python, go"` |
| Prefer `string` type with validated values over `boolean` flags | `scan-type: "sast"` instead of `run-sast: true` |

### Secret handling

- **Platform-owned secrets** (registry tokens, scan API keys): stored in the cockpit organization and accessed directly by the workflow. Consumers never see or manage these.
- **Caller-owned secrets**: passed via `secrets: inherit` or explicit `secrets:` inputs. Used for repo-specific credentials.
- Never log secret values. Use `::add-mask::` for any derived values that might appear in logs.

!!! warning
    Do not use `secrets: inherit` inside the required workflow definition itself. That directive is for the caller side. On the producer side, declare each secret explicitly with `required: true` or `required: false`.

### Permission scoping

Declare the minimum `permissions` block at the workflow level. Common patterns:

```yaml
# Read-only workflow (test, scan)
permissions:
  contents: read

# Workflow that publishes packages
permissions:
  contents: read
  packages: write

# Workflow that comments on PRs
permissions:
  contents: read
  pull-requests: write
```

### Error handling

- Use `if: failure()` steps to produce clear error summaries for consumers.
- Set `continue-on-error: false` (the default) for critical steps. Only use `continue-on-error: true` for non-blocking advisory checks.
- Write step outputs that indicate pass/fail so callers can branch on results.

## Testing workflows before release

Every workflow change must be tested before it reaches consumers.

### Test infrastructure

1. **Dedicated test repositories** in the cockpit organization, one per supported language/stack.
2. Each test repo contains a caller workflow that references the workflow under test using a branch ref (`@feature-branch`).
3. A **test matrix** covers the supported combinations:

```yaml
# In the workflow repo's own CI
jobs:
  test-matrix:
    strategy:
      matrix:
        language: [node, java, python, go]
        version: ["18", "21", "3.12", "1.22"]
    uses: ./.github/workflows/build.yml
    with:
      language: ${{ matrix.language }}
      language-version: ${{ matrix.version }}
```

### Local testing with act

Use [`act`](https://github.com/nektos/act) for fast local iteration before pushing:

```bash
act -W .github/workflows/build.yml \
    --input language=node \
    --input language-version=20
```

!!! note
    `act` does not support all GitHub Actions features (e.g., `secrets: inherit`, OIDC tokens). Use it for logic validation, not as a replacement for the full test matrix.

### CI pipeline for the workflow repository

The workflow repository itself must have a CI pipeline that runs on every pull request:

- Lints workflow YAML with `actionlint`
- Runs the test matrix against test repositories
- Validates that no `permissions` block exceeds the documented scope

## Versioning and release process

### Tagging strategy

| Tag | Points to | When to create |
| --- | --- | --- |
| `v1.2.3` | Exact commit (immutable) | Every release |
| `v1.2` | Latest `v1.2.x` commit | Re-pointed on each patch release |
| `v1` | Latest `v1.x.x` commit | Re-pointed on each minor/patch release |

After merging to `main`, tag and release:

```bash
git tag -a v1.3.0 -m "feat: add Go module caching support"
git push origin v1.3.0

# Update floating tags
git tag -f v1.3 v1.3.0
git tag -f v1 v1.3.0
git push origin v1.3 v1 --force
```

### CHANGELOG

Maintain a `CHANGELOG.md` per workflow (or a single file if the repo contains one workflow). Every entry includes the version, date, and a summary of changes with migration notes if applicable.

### Breaking changes

A breaking change is any modification that can cause a consumer's workflow to fail or behave differently without action on their part: renamed inputs, removed steps, changed defaults, or altered outputs.

Breaking changes require:

1. **Major version bump** (`v1` to `v2`).
2. **Advance notice** to all consumers at least two weeks before release.
3. **Migration guide** in the CHANGELOG and README.
4. **Parallel availability**: keep `v1` functional while `v2` is adopted.

### Deprecation process

1. **Announce**: mark the workflow or input as deprecated in the README and CHANGELOG.
2. **Grace period**: maintain the deprecated version for at least 90 days.
3. **Remove**: delete the deprecated version only after confirming zero active consumers.

## Maintaining existing workflows

### Dependency updates

- Pin all third-party actions to exact versions or SHA refs (`actions/checkout@v4.1.1` or `actions/checkout@abcdef1`).
- Use Dependabot or Renovate on the workflow repository itself.
- Review action updates for behavior changes before merging.

### Security patching

| Severity | Response |
| --- | --- |
| Critical (active exploit, secret exposure) | Patch and release immediately. Re-point floating tags within hours. |
| High (vulnerability in dependency) | Patch within 48 hours. Release as next patch version. |
| Medium / Low | Bundle into the next planned minor release. |

### Consumer impact assessment

Before any release, answer these questions:

- Which repositories consume this workflow? (Search for `uses:` references across organizations.)
- Which version tags do they pin to?
- Will this change alter behavior for consumers on floating tags?

!!! tip
    Use `gh search code "uses: cockpit-org/.github/.github/workflows/build.yml"` to find all consumers across the enterprise.

### Usage monitoring

Track workflow adoption and version distribution:

- Number of repositories consuming each workflow
- Version distribution (how many repos are on `v1` vs `v2`)
- Failure rates per workflow and version
- Average execution time trends

## Workflow catalog management

### Catalog index

Maintain a top-level `README.md` in the workflow repository listing every available workflow:

| Workflow | Purpose | Latest version | Status |
| --- | --- | --- | --- |
| `build.yml` | Compile and produce artifacts | `v1.3.0` | Active |
| `test.yml` | Run unit and integration tests | `v1.2.1` | Active |
| `security-scan.yml` | SAST, secrets, dependency scanning | `v2.0.0` | Active |
| `release.yml` | Tag, build, publish to registry | `v1.1.0` | Active |
| `dependency-update.yml` | Automated dependency PRs | `v1.0.2` | Active |

### Feature request process

Product teams request new workflows or changes to existing ones through the cockpit organization's issue tracker:

1. Team opens an issue using the **workflow request** template.
2. Platform Team triages: accept, defer, or suggest an alternative.
3. Accepted requests enter the backlog and follow the standard authoring process.
4. The requesting team is tagged as a reviewer on the implementation PR.

## Anti-patterns

### God workflow

**Problem:** A single workflow handles build, test, scan, release, and notification in one file with dozens of inputs and conditional logic.

**Why it breaks:** Every change risks side effects across unrelated stages. Testing becomes combinatorial. Consumers cannot opt into individual steps.

**Fix:** One workflow per responsibility. Consumers compose them in their caller file.

### Unversioned releases

**Problem:** The team pushes changes to `main` without creating version tags.

**Why it breaks:** Consumers on `@v1` do not receive updates. Consumers who reference `@main` (which they should not) get untested changes immediately.

**Fix:** Every merge to `main` that affects workflow behavior must produce a tagged release.

### No testing

**Problem:** Workflow changes are merged based on code review alone, without running them against test repositories.

**Why it breaks:** YAML syntax errors, missing input handling, and permission issues only surface when real consumers break.

**Fix:** Require the test matrix to pass before merging any workflow PR.

### Breaking changes without major version bump

**Problem:** An input is renamed or a default is changed in a patch release.

**Why it breaks:** Every consumer on the floating tag (`@v1`) breaks on their next run with no warning.

**Fix:** Follow semver strictly. Any consumer-facing behavioral change that is not purely additive requires a major version bump.

---

Next: [Consume the framework](consume-framework.md)
