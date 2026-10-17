# 01 — Requirements

**Status:** Reviewed · **Last updated:** 2026-10-17 · **Depends on:** 00 · **Feeds:** 03, 12

This document states what *Save* must do and must not do. It is written before the platform research is final; where a requirement's feasibility depends on a research finding, the requirement says so and points at `02-research-findings.md`. Requirements use RFC 2119 keywords (see `00-conventions.md`).

## 1. Product statement

*Save* is a personal, on-device budgeting app for Android that turns tap-to-pay credit-card spending into envelope-budgeted spending. Every tap made with the phone is captured within seconds, assigned to a monthly budget category, and shown against what is left in that category. When a category is empty, the phone's tap-to-pay is locked until the user consciously overrides. The product goal is behavior change (spend less than planned), not bookkeeping.

## 2. Primary user and context

- One user, the device owner, in the United States, using USD.
- The phone is the primary wallet: one or more credit cards in Google Wallet, used by NFC tap in stores. Online and in-app purchases also happen, but are secondary.
- The user is technical: comfortable sideloading an APK and running a one-time `adb` command or installing Shizuku.
- Development happens on Windows 11. There is one target phone (model and Android version to be confirmed, see `OQ-001`).

## 3. Goals and non-goals

### Goals

| ID | Goal |
| --- | --- |
| G1 | Make the remaining budget of the relevant category visible at the moment of spending. |
| G2 | Capture every card transaction with minimal attention: under five seconds of user time per transaction, and most transactions needing none. |
| G3 | Enforce category budgets with a real speed bump at the point of payment, which can be overridden deliberately but never accidentally. |
| G4 | Be trustworthy: totals reconcile with bank statements; no double counting; nothing silently lost. |
| G5 | Run in the background for months without babysitting, and tell the user when it cannot. |
| G6 | Keep all financial data on the device unless the user explicitly exports or backs it up. |
| G7 | Keep the budgeting core portable to iOS; Android ships first. |

### Non-goals

| ID | Non-goal |
| --- | --- |
| NG1 | Not a bank-aggregation, investment, or net-worth product. |
| NG2 | No shared or multi-user budgets in v1. |
| NG3 | Not a Play Store product in v1. Play policies are recorded for later, not treated as blockers. |
| NG4 | Not security against a determined adversary. The "adversary" is the user's own impulsive self; the enforcement is a commitment device, not a lock an attacker must defeat. |
| NG5 | Not blocking non-card spending (cash, bank transfers, peer-to-peer apps). Those are manual entries. |
| NG6 | Not real-time bank balance tracking. The app budgets spending; it does not need the account balance. |

## 4. Functional requirements

### 4.1 Sensing

| ID | Requirement |
| --- | --- |
| REQ-S-001 | The system MUST detect a Google Wallet tap-to-pay purchase made on this phone within 10 seconds of the tap in at least 95% of cases when the phone has connectivity, using on-device signals only (no backend). Feasibility depends on `RF` findings about Google Wallet notification latency. |
| REQ-S-002 | The system MUST extract the amount (integer minor units plus currency code), merchant string, timestamp, and card descriptor when present. When the amount is absent, the system MUST create the transaction in an `AMOUNT_UNKNOWN` state and ask the user rather than guess. |
| REQ-S-003 | The system MUST ingest the same purchase from several sources (Google Wallet notification, issuer push notification, SMS alert) and merge them into one transaction. When sources disagree on the amount, the issuer's amount wins and the disagreement is recorded. |
| REQ-S-004 | The system MUST support manual entry and editing of transactions (cash, online purchases, corrections) through the same categorization flow. |
| REQ-S-005 | The system SHOULD detect refunds and returns from issuer alerts and credit them back to the original category when it can find the original transaction, else to an "Uncategorized refund" bucket. |
| REQ-S-006 | The system MUST tolerate notifications it cannot parse: store the raw text (for allow-listed packages only), surface a "teach the parser" flow, and never crash or silently drop. |
| REQ-S-007 | The system MUST support a periodic reconciliation import (issuer CSV export) that matches imported lines to sensed transactions and flags discrepancies: amount changed (tips), missing, or extra. |
| REQ-S-008 | Sensing MUST be source-pluggable. Adding a new issuer's notification format MUST require only a new parser definition (data or a small class) and fixtures, never an architectural change. |
| REQ-S-009 | The system MUST ignore notifications from packages not on the user's allow-list and MUST NOT persist their content. |

### 4.2 Recording and categorization

| ID | Requirement |
| --- | --- |
| REQ-R-001 | Within 2 seconds of detection the system MUST surface an interactive prompt that lets the user assign a category in one tap. The baseline prompt is a high-priority heads-up notification with the most likely categories as actions; richer surfaces (overlay sheet, full-screen) are used when the corresponding permission is granted. |
| REQ-R-002 | When a merchant rule exists with confidence at or above the auto-assign threshold, the system MUST auto-assign and show a non-blocking confirmation with a "Change" action and an undo window. |
| REQ-R-003 | The system MUST learn: a manual assignment for a merchant creates or strengthens a rule; a correction weakens or replaces the rule. |
| REQ-R-004 | Transactions not yet categorized MUST land in an Inbox, MUST be re-promptable, and the budget view MUST show the uncategorized total so it cannot hide. |
| REQ-R-005 | The system MUST support splitting one transaction across several categories. |
| REQ-R-006 | The system MUST support marking a transaction as excluded from budgets (reimbursable, transfer, duplicate) with an explicit reason, and MUST keep excluded transactions visible in history. |
| REQ-R-007 | Pre-assignment: when the user unlocked tap-to-pay for a specific category (see REQ-E-002), the next sensed transaction inside the unlock window MUST be assigned to that category automatically, with the same undo affordance. |

### 4.3 Budgeting

| ID | Requirement |
| --- | --- |
| REQ-B-001 | Envelope model: categories, optionally grouped, each with an amount assigned per period. `Available = assigned + carried_in − activity`, where activity is the sum of categorized spending minus refunds in the period. |
| REQ-B-002 | The period is the calendar month by default; the user MAY set a different start day (for example the 15th, to match a pay cycle). A transaction belongs to the period containing its local timestamp in the user's home time zone. |
| REQ-B-003 | Rollover is configurable per category: `NONE`, `CARRY_POSITIVE` (surplus carries, overspend resets), `CARRY_ALL` (surplus and overspend both carry). |
| REQ-B-004 | Moving money between categories MUST be a first-class, logged action, usable from the override flow. |
| REQ-B-005 | The home screen MUST show each category's Available with an unmistakable exhausted state, the uncategorized total, and the Guard state. |
| REQ-B-006 | Authorization-to-settlement amount changes (restaurant tips, gas pre-authorizations) MUST update the existing transaction, never create a duplicate. |
| REQ-B-007 | Period close is automatic. Full history is retained; past periods are read-only except for recategorization. |

### 4.4 Enforcement

| ID | Requirement |
| --- | --- |
| REQ-E-001 | When any category's Available is at or below zero (or below a configurable buffer), the system MUST enter the `GUARD` state and prevent tap-to-pay on this phone until an unlock is granted. "Prevent" means turning the NFC radio off when the one-time privileged grant exists (hard guard); otherwise the soft guard of REQ-E-008 applies. Feasibility depends on `RF` findings about NFC control. |
| REQ-E-002 | Unlock path: from the lock-screen notification, the Quick Settings tile, or the app, the user picks the category they are about to spend from. If that category has Available greater than zero, tap-to-pay is unlocked for a time window (default 120 seconds, configurable) and the next transaction is pre-assigned to it. If the category is exhausted, the override flow runs first: move money from another category, borrow from next period, or a one-time override with a required reason. |
| REQ-E-003 | If NFC is re-enabled by any means outside an unlock window while in `GUARD`, the system MUST re-assert the lock within 5 seconds and MUST record the event (a "friction counter" the user can see). |
| REQ-E-004 | Policy modes: `TRACK_ONLY` (never lock), `GUARD_WHEN_EXHAUSTED` (default), `ALWAYS_PRECOMMIT` (NFC off by default; every payment starts with a category choice). |
| REQ-E-005 | Lock state MUST survive reboot, app update, and process death; the system MUST re-assert the intended NFC state at boot and when the sensing service reconnects. |
| REQ-E-006 | Every lock, unlock, override, and re-assert MUST be written to an audit log the user can view. |
| REQ-E-007 | The user MAY define exemptions (for example a "Transit" category that is never guarded) so that non-payment NFC uses still work via a one-tap unlock. |
| REQ-E-008 | Enforcement MUST degrade gracefully. When hard guard is unavailable, soft guard applies: a persistent lock-screen notification, an interstitial overlay when Google Wallet is opened (if overlay permission is granted), and a loud post-transaction warning. The UI MUST always state which enforcement mode is active. |
| REQ-E-009 | Unlock windows MUST end automatically on timeout, and SHOULD end early once a transaction is sensed, so that a single unlock cannot be reused for several purchases. |

### 4.5 Setup, permissions, and health

| ID | Requirement |
| --- | --- |
| REQ-P-001 | Guided onboarding MUST request, in a deliberate order with explanations: notification access, posting notifications, battery-optimization exemption, overlay permission (optional), full-screen intent permission (optional), and the privileged NFC grant via `adb` or Shizuku (optional but recommended). Each step MUST have a self-test. |
| REQ-P-002 | A diagnostics screen MUST show the health of each capability: listener connected, time since last financial notification seen, NFC control available, battery exemption, last watchdog result. |
| REQ-P-003 | The system MUST detect a silently disconnected notification listener (watchdog) and notify the user when sensing has been down for more than a configurable period. |

### 4.6 Data

| ID | Requirement |
| --- | --- |
| REQ-D-001 | All data lives in a local SQLite database. Core functions MUST work with no network. |
| REQ-D-002 | Encrypted backup and restore to a user-chosen location MUST exist, with a passphrase the app never stores. |
| REQ-D-003 | CSV export of transactions and budgets MUST exist. |
| REQ-D-004 | Money MUST be stored as integer minor units with a currency code. Floating-point money types are forbidden anywhere in the code. |

## 5. Non-functional requirements

| ID | Requirement |
| --- | --- |
| REQ-N-001 | Battery: attributable drain under 2% per day in `GUARD_WHEN_EXHAUSTED` with normal use. |
| REQ-N-002 | Reliability: the sensing path MUST be alive at least 99% of the time the phone is on; the watchdog (REQ-P-003) measures this. |
| REQ-N-003 | Latency: prompt within 2 seconds of detection; cold start of the main screen under 1.5 seconds on the target phone. |
| REQ-N-004 | Privacy: no analytics, no third-party SDKs that phone home, no network calls except those the user turned on (optional LLM categorization, optional map lookup, backup destination). |
| REQ-N-005 | Secrets (any API key the user enters) MUST be stored in Android Keystore-backed encrypted storage. |
| REQ-N-006 | Portability: the budget engine, categorization rules, and transaction model MUST be pure Kotlin with no Android dependencies, behind interfaces that platform adapters implement. |
| REQ-N-007 | Testability: every parser MUST be fixture-tested with real captured messages; the engine MUST have property-based tests for the Available math; a debug "transaction injector" MUST exist to exercise the whole pipeline without a real purchase. |
| REQ-N-008 | Supported Android versions: 13 (API 33) and newer, with full feature support on 14 through 17; the user's actual device is the acceptance target. |
| REQ-N-009 | Accessibility: all actionable UI MUST be usable with TalkBack and at 200% font scale; the categorization prompt MUST not rely on color alone. |

## 6. Success metrics

Measured in the app's own diagnostics (local only):

| Metric | Target |
| --- | --- |
| Taps captured automatically within 10 s | ≥ 95% |
| Transactions needing manual categorization after one month of use | ≤ 20% |
| Monthly reconciliation discrepancy versus issuer CSV | < 1% of spend |
| Lock re-assert events per month (friction fights) | trending down |
| Categories ending the month overspent | trending down (the real goal) |

## 7. Constraints and assumptions

- A1. Google Wallet and the issuer apps post transaction notifications and the user keeps them enabled. The onboarding checks this.
- A2. The user is willing to run one `adb shell pm grant` command (or install Shizuku) for hard guard. Without it, soft guard applies.
- A3. One phone; no tablet or wearable. A Wear OS watch used for tap-to-pay would bypass the guard; this is an accepted gap recorded in `15-open-questions.md`.
- A4. The user's issuers and phone model are unknown at design time; parsers ship for the major US issuers and are extended with the teach-the-parser flow.

## 8. User stories

1. **Tap and see.** I tap at a coffee shop. Within a few seconds my phone shows "$6.40 at Blue Bottle — Coffee ($38 left)". I do nothing; the rule learned last month assigned it.
2. **Tap and choose.** I tap at a new store. A notification offers three likely categories. I tap "Household". Done.
3. **Hit the wall.** My Dining category reaches zero on the 19th. The phone tells me Dining is exhausted and tap-to-pay is locked. At dinner the next day the terminal does nothing when I tap. I look at my phone: "Locked — Dining is at $0. Unlock?" I move $30 from Fun to Dining, unlock, and pay. The app shows Fun is now lower.
4. **Just this once.** Same situation, but I choose "Override once" and must type a reason. The transaction is marked as an override and shows in the month's audit.
5. **Pre-commit mode.** I switch to ALWAYS_PRECOMMIT for a tight month. Before every purchase I tap the Quick Settings tile, pick the category, and have two minutes to pay. Every transaction is categorized without a prompt.
6. **Tip adjustment.** The restaurant posts $54.00 two days after I tapped $45.00. The reconciliation import updates the transaction to $54.00 and Dining drops by $9 more. No duplicate.
7. **Refund.** I return a shirt. The issuer alert says "credit $29.99 from Uniqlo". Clothing gets $29.99 back.
8. **New bank.** My new card's app sends alerts the app cannot read. The Inbox shows the raw text with a "Teach" button; I highlight the amount and merchant once, and the app now parses that bank.
9. **Something broke.** The notification listener was killed after an OS update. Within six hours the watchdog notices no self-test arrived and warns me, with a button to the fix.
10. **Transit.** I use the phone for the subway. Transit is exempt: a one-tap unlock from the lock screen, no budget check.

## 9. Traceability

Each requirement is referenced by the component specs that satisfy it and by the test cases in `11-testing-strategy.md`. The implementation plan (`12-implementation-plan.md`) maps requirements to milestones; a requirement with no milestone is a gap and MUST be listed in `15-open-questions.md`.

## Change log

- 2026-10-17: Initial version.
