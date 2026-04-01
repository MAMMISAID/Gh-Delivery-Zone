# Enterprise Policies

Enterprise policies are the **top-level governance controls** in GitHub Enterprise Cloud. They provide a single point of management for all organizations owned by the enterprise account, enforcing business rules and regulatory compliance before org-level rulesets or reusable workflows even come into play.

If rulesets enforce *how* code flows through repositories, enterprise policies enforce *what is allowed to exist* at the platform level.

## How enterprise policies work

Every enterprise policy follows the same model:

- **Not enforced** (default): organization owners configure the setting independently.
- **Enforced**: a specific value applies uniformly across all organizations. Org owners cannot override it.

By default, no policies are enforced. The enterprise admin explicitly enables each one based on organizational requirements.

!!! warning
    Enforcing a policy retroactively can disrupt existing workflows. Always audit current org-level settings before flipping the switch. Use the same evaluate-then-enforce cadence described in the [rulesets rollout strategy](rulesets.md#rollout-strategy).

## Policy categories

### Repository management

Controls who can create, delete, fork, and change repositories across the enterprise.

| Policy | Options | Recommendation |
| --- | --- | --- |
| **Base permissions** | None, Read, Write, Admin — or delegate to org owners | Enforce **Read** as minimum. Teams grant additional permissions via team-based access. |
| **Repository creation** | All members, org owners only, or delegate | Enforce **org owners only**. Repos are provisioned through the service catalog, not ad hoc. |
| **Forking** (private/internal repos) | Allow, disallow, or delegate | Enforce **disallow** for private repos. Internal repos can allow forking within the enterprise. |
| **Outside collaborators** | Members can invite, org owners only, enterprise owners only, or delegate | Enforce **org owners only**. Prevents uncontrolled external access. |
| **Default branch name** | Custom name or delegate | Enforce **main**. Consistent naming simplifies automation and rulesets. |
| **Repository visibility changes** | Members with admin access, org owners only, or delegate | Enforce **org owners only**. Prevents accidental exposure of internal repositories. |
| **Repository deletion and transfer** | Members with admin access, org owners only, or delegate | Enforce **org owners only**. Prevents accidental or malicious deletion. |
| **Issue deletion** | Members with admin access, org owners only, or delegate | Delegate to org owners. Low risk, high friction if enforced. |
| **Deploy keys** | Allow, disallow, or delegate | Delegate to org owners. Teams need deploy keys for CI/CD. |

### GitHub Actions

Controls which actions can run, where they run, and what permissions they have.

| Policy | Options | Recommendation |
| --- | --- | --- |
| **Actions enablement** | All orgs, specific orgs, or disabled | Enable for **all organizations**. Actions are core to the delivery model. |
| **Allowed actions** | All actions, enterprise only, enterprise + selected non-enterprise | Enforce **enterprise + selected non-enterprise**. Allow GitHub-authored actions and verified creators. Block everything else by default. |
| **Self-hosted runners** | Enabled or disabled | Enable. Required for private network access and cost control. |
| **Artifact and log retention** | 1–400 days | Set to **90 days** for private/internal repos. Aligns with the exception process maximum duration. |
| **Fork PR workflows (public repos)** | Approval required for first-time / all outside collaborators | Enforce **require approval for all outside collaborators**. |
| **Fork PR workflows (private repos)** | Read-only token, write token, send secrets, require approval | Enforce **read-only GITHUB_TOKEN**. Never send write tokens or secrets to fork PRs. |
| **Workflow permissions** | Read-write or read-only default for GITHUB_TOKEN | Enforce **read-only**. Workflows that need write access declare it explicitly with `permissions:`. |

!!! tip
    The "allowed actions" policy is your first line of defense against supply chain attacks. Restricting to verified creators and pinning to commit SHAs eliminates most risks from third-party actions.

### Security settings

Controls authentication, access methods, and identity enforcement.

| Policy | Options | Recommendation |
| --- | --- | --- |
| **Two-factor authentication** | Required or not | Enforce **required**. Non-negotiable for any enterprise. |
| **Secure 2FA methods** | Required or not | Enforce **required**. Passkeys, security keys, and authenticator apps only. No SMS. |
| **SSH certificate authorities** | Add CAs, require certificates | Configure CAs. Require SSH certificates for org access if using EMU. |
| **SSO redirect** | Auto-redirect unauthenticated users or show 404 | Enable **auto-redirect** for EMU enterprises. |

### Code security and analysis

Controls which security features are available and who can manage them.

| Policy | Options | Recommendation |
| --- | --- | --- |
| **Advanced Security availability** | Allow for all orgs, selected orgs, or disallow | Allow for **all organizations**. Security features should be universally available. |
| **Dependabot alerts** | Allow repo admins to manage, or restrict | **Allow** repo admins to enable/disable. Low risk, high developer ownership. |
| **Secret Protection management** | Allow repo admins, or restrict | **Allow** repo admins. Push protection should be enabled by default at org level anyway. |
| **Code Security management** | Allow repo admins, or restrict | **Allow** repo admins. Code scanning should be enabled by default via reusable workflows. |
| **AI detection (secret scanning)** | Allow repo admins, or restrict | **Allow**. AI detection improves secret scanning accuracy. |
| **Copilot Autofix** | Allow repo admins, or restrict | **Allow**. Autofix accelerates remediation. |

!!! note
    Organization owners and security managers can always enable security features regardless of enterprise policy. These policies control whether *repository admins* can manage them.

### Personal access tokens

Controls how PATs are used across the enterprise.

| Policy | Options | Recommendation |
| --- | --- | --- |
| **Access restriction** | Allow, restrict, or delegate to org owners | Delegate to org owners. Some orgs need PATs for automation; others should restrict them. |
| **Maximum lifetime** | 1–366 days (fine-grained) | Enforce **90 days** for fine-grained tokens. Aligns with the exception window. |
| **Approval requirement** | Required, disabled, or delegate | Enforce **required** for fine-grained tokens in production orgs. Delegate for sandbox orgs. |

!!! warning
    Restricting PAT access enterprise-wide blocks all token-based automation. If you use PATs for CI/CD service accounts, migrate to GitHub Apps before enforcing this policy.

## Implementation order

Not all policies should be enforced on day one. Roll them out in waves aligned with platform maturity.

### Wave 1 — Identity and access (day one)

- :fontawesome-solid-square-check: Two-factor authentication required
- :fontawesome-solid-square-check: Secure 2FA methods required
- :fontawesome-solid-square-check: SSO redirect for EMU
- :fontawesome-solid-square-check: Default branch name set to `main`

### Wave 2 — Repository controls (week one)

- :fontawesome-solid-square-check: Repository creation restricted to org owners
- :fontawesome-solid-square-check: Repository deletion restricted to org owners
- :fontawesome-solid-square-check: Repository visibility changes restricted to org owners
- :fontawesome-solid-square-check: Outside collaborators restricted to org owners

### Wave 3 — Actions and supply chain (week two)

- :fontawesome-solid-square-check: Allowed actions restricted to enterprise + verified creators
- :fontawesome-solid-square-check: Workflow permissions set to read-only
- :fontawesome-solid-square-check: Fork PR workflows restricted
- :fontawesome-solid-square-check: Artifact retention set to 90 days

### Wave 4 — Security features (week three)

- :fontawesome-solid-square-check: Advanced Security enabled for all orgs
- :fontawesome-solid-square-check: Dependabot and secret scanning management delegated to repo admins
- :fontawesome-solid-square-check: PAT lifetime enforced at 90 days

## Relationship to other guardrails

Enterprise policies sit at the top of the guardrail stack:

| Layer | Mechanism | Scope |
| --- | --- | --- |
| **Enterprise policies** | Platform-wide settings | All orgs, all repos |
| **Org-level rulesets** | Branch and tag protection | All repos in an org |
| **Reusable workflows** | CI/CD standardization | All repos that call the workflow |
| **Repository baseline** | Metadata, CODEOWNERS, security defaults | Individual repos |

Policies set the boundaries. Rulesets enforce the flow. Workflows standardize the execution. Baselines fill in the details.

## Anti-patterns

### Enforcing everything on day one

Turning on every policy simultaneously without auditing current org settings breaks existing workflows, locks out developers, and generates a flood of support tickets.

**Fix:** use the wave-based rollout above. Audit current settings with `gh api` before enforcing. Communicate changes to org owners 48 hours in advance.

### Delegating everything

Leaving all policies delegated to org owners defeats the purpose of enterprise governance. Each org evolves its own configuration, and drift becomes invisible.

**Fix:** identify the non-negotiable policies (identity, repo creation, visibility changes) and enforce them centrally. Delegate only where team autonomy adds genuine value.

### Policy without observability

Enforcing policies without monitoring compliance is theater. You need to know which orgs are affected, which settings changed, and whether the policy is producing the intended outcome.

**Fix:** stream enterprise audit logs to your SIEM. Build a policy compliance dashboard in the cockpit org. Review policy effectiveness quarterly.

---

Next: [Custom properties](custom-properties.md)
