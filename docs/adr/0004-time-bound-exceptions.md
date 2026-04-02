# ADR 0004: Time-Bound Exceptions with 90-Day Maximum

## Status

**Accepted**

## Context

The Delivery Zone framework enforces guardrails by default through rulesets, required workflows, and baseline controls. Teams that cannot comply with a specific guardrail need a formal way to deviate without silently bypassing controls.

The exception mechanism must balance flexibility with governance discipline. If exceptions are too easy to obtain and never expire, they accumulate as invisible technical debt and the guardrail framework erodes over time. If exceptions are unavailable or too rigid, teams circumvent controls entirely, which is worse than a managed deviation.

The framework needs exception rules that make the cost of deviation visible and force regular re-evaluation.

## Decision

All exceptions to mandatory guardrails are **time-bound with a maximum duration of 90 days**. There are no permanent exceptions.

When an exception expires, the guardrail is re-enforced automatically. If the exception is still needed, the requesting team must submit a renewal through the full review cycle. Renewals are not rubber-stamped -- they go through the same approval process as new exceptions.

## Rationale

**Prevents governance decay.** Permanent exceptions accumulate silently. After a year, no one remembers why they were granted, and the guardrail framework is full of holes. Time-bound exceptions force each deviation to justify its continued existence.

**Forces regular re-evaluation.** Every 90 days, the requesting team must confirm the exception is still needed, update the remediation plan, and go through review again. This creates a natural checkpoint for resolving the underlying issue.

**Aligns with sprint and quarter cycles.** A 90-day maximum maps cleanly to quarterly planning. Teams can plan remediation work within the same planning cycle as the exception duration.

**Makes exception cost visible.** Renewal requires effort: documentation, review, approval. This makes the cost of deviation tangible to the requesting team and to leadership reviewing exception dashboards. Teams are incentivized to resolve the root cause rather than renew repeatedly.

**Automatic re-enforcement at expiry.** When an exception expires, the guardrail is restored without manual intervention. This eliminates the risk of forgotten exceptions that remain active indefinitely.

See the full exception lifecycle in [Exception Process](../operating-model/exception-process.md).

## Alternatives considered

**Permanent exceptions with annual review.** Exceptions are granted indefinitely, with a yearly review to decide whether they are still needed. In practice, annual reviews are easy to skip, defer, or rubber-stamp. Exceptions granted early in the platform's life become invisible debt that no one owns. The 90-day maximum prevents this by making renewals frequent enough to stay on the team's radar.

**No exceptions allowed.** All guardrails are mandatory with no deviation mechanism. This is too rigid for an enterprise environment where teams have legitimate constraints -- legacy systems, migration timelines, third-party dependencies. When teams cannot get exceptions, they find ways to circumvent controls entirely, which is ungoverned and invisible. A managed exception is always preferable to an unmanaged workaround.

**Exception per pull request.** Exceptions are scoped to individual pull requests rather than time windows. This is too granular: teams with ongoing constraints would need to request an exception on every PR, creating approval fatigue for both the requesting team and the approval authority. It also lacks the remediation planning that a time-bound exception requires.

## Consequences

This decision has the following implications:

- **Every exception has an expiry date.** The exception registry tracks start date, end date, and remediation plan. No exception can be created without an expiry date.
- **Maximum duration is 90 days.** Exceptions cannot be granted for longer than 90 days. If a team needs more time, they must submit a renewal before the current exception expires.
- **Renewals go through full review.** There is no fast-track for renewals. Each renewal is reviewed by the platform team and the relevant approval authority with the same rigor as a new request.
- **Expired exceptions re-enforce automatically.** When the expiry date passes, the guardrail is restored. Teams that fail to renew in time will have the control re-applied, which may block their workflows until a new exception is approved.
- **Exception dashboards track accumulation.** Observability dashboards show active exceptions, upcoming expirations, and renewal history. This gives platform teams and leadership visibility into governance health.

---
