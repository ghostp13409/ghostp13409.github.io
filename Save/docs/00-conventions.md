# 00 — Documentation Conventions

**Status:** Stable · **Last updated:** 2026-10-17 · **Audience:** the AI coding session (or human engineer) that will build *Save* from this doc set.

This file defines how every document in `docs/` is written and how to read them. Read it once; the rest of the set assumes it.

## 1. Purpose of the doc set

`docs/` is the single source of truth for the *Save* system design. It was produced before any code existed. It is meant to be sufficient for a fresh engineering session, with no access to the original design conversation, to build the app end-to-end without guessing. Where the design is uncertain, the uncertainty is stated explicitly rather than papered over.

## 2. Reading order

1. `README.md` (repo root) — what the product is, the one-page architecture, and the build order.
2. `01-requirements.md` — what must be true when we are done.
3. `02-research-findings.md` — what the platform allows; the verified facts the design rests on.
4. `03-architecture.md` — the system as a whole.
5. Component specs `04`–`10` in any order, as the implementation plan (`12`) calls for them.
6. `adr/` — why each major decision was made; read when you are tempted to deviate.

## 3. Normative language

Keywords **MUST**, **MUST NOT**, **SHOULD**, **SHOULD NOT**, **MAY** are used as in RFC 2119. Text without a keyword is descriptive.

## 4. Evidence markers

Every platform claim carries one of these markers the first time it appears in a document:

| Marker | Meaning |
| --- | --- |
| `[VERIFIED]` | Confirmed from a primary source (Android/AOSP/Apple docs or code, vendor support page) or from an adversarial fact-check pass during research. |
| `[REPORTED]` | Supported by credible secondary sources (library maintainers, multiple consistent field reports) but not a primary source. |
| `[INFERRED]` | Our reasoning from verified facts; plausible, not observed. |
| `[DEVICE-TEST]` | Must be confirmed on the user's actual phone before relying on it. The implementation plan schedules these tests early. |

A claim with no marker is an engineering decision, not a platform fact.

## 5. Identifiers

| Prefix | Used for | Defined in |
| --- | --- | --- |
| `REQ-xxx` | Requirements (functional, non-functional) | `01-requirements.md` |
| `RF-xxx` | Research findings referenced by the design | `02-research-findings.md` |
| `ADR-xxx` | Architecture decision records | `adr/ADR-xxx-*.md` |
| `RISK-xxx` | Risks and their mitigations | `12-implementation-plan.md` |
| `OQ-xxx` | Open questions needing the user or a device test | `15-open-questions.md` |
| `TEST-xxx` | Test cases referenced from specs | `11-testing-strategy.md` |
| `M0`…`Mn` | Milestones | `12-implementation-plan.md` |

Identifiers are stable: never renumber; mark retired ones as *retired* instead.

## 6. Code and naming conventions in the docs

- Code identifiers are written in `monospace` and use the final Kotlin names the implementation is expected to use (`BudgetEngine`, `TapGuard`, `NotificationIngestor`). If the builder renames something, update the docs in the same change.
- Money is always an integer number of minor units (cents) with an explicit currency code. Docs never show money as a floating-point number.
- Timestamps are ISO-8601 with offset in prose, and stored as epoch milliseconds UTC plus the local zone id in data models.
- Android version references use both the marketing number and API level the first time: "Android 14 (API 34)".
- Diagrams are Mermaid fenced blocks (` ```mermaid `) so they render on GitHub and in most IDEs; a plain-text description follows any diagram whose meaning is load-bearing.

## 7. Document header

Every doc starts with a title line and a status line:

```
# NN — Title
**Status:** Draft | Reviewed | Stable · **Last updated:** YYYY-MM-DD · **Depends on:** 02, 03 · **Feeds:** 12
```

## 8. How to change the docs

- A change that alters behavior MUST update the relevant spec *and* add or amend an ADR if it reverses a decision.
- Prefer appending "Change log" bullets at the end of a doc over rewriting history.
- Keep `15-open-questions.md` current: resolve questions by editing the question in place with the answer and date.
