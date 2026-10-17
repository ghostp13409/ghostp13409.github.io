# Save — Budget domain model, transaction lifecycle, local-first storage, backup, reconciliation

Research appendix for the "Save" budget-enforcement app (Android first, KMP-ready). Written 2026-10-17.
Audience: the AI coding session that builds the app. Self-contained; read end to end before designing the schema.

Status labels used throughout:

- **VERIFIED** — read in a primary source (vendor docs, RFC, AOSP/vendor code, the product's own site) during this research; source date noted where the page shows one.
- **REPORTED** — secondary/anecdotal (forums, third-party guides, converter vendors, news) or a primary page I could not open and am relying on a snippet of.
- **INFERRED** — my reasoning or design proposal; not a fact about the world.

Note on completeness: the research session's web-search quota ran out near the end. Items I could not confirm are marked explicitly (see §12 "Negative results and unverified items"). Nothing in this document is presented as fact unless labelled VERIFIED.

---

## 0. Executive summary (what the design should assume)

1. **Envelope math is simple integer arithmetic and Actual Budget's implementation is the best reference.** VERIFIED from `packages/loot-core/src/server/budget/envelope.ts`: per category per month, `leftover = budgeted + spent + (prevCarryover ? prevLeftover : max(0, prevLeftover))`, where `spent` is a negative integer sum of transaction amounts in that month. Uncovered overspending, when the category's carryover flag is off, is subtracted from next month's "To Budget" (`last-month-overspent`). Save should adopt this exact structure (§8) with one extra rollover policy ("reset", Goodbudget's *Set* fill) that Actual does not have.
2. **Money is stored as integer minor units everywhere that matters.** VERIFIED: Actual stores `transactions.amount` and `zero_budgets.amount` as SQLite INTEGER cents; YNAB's API uses integer "milliunits" (1/1000 of a currency unit). Save: `Long` minor units + ISO-4217 code. Never floats.
3. **The amount seen at tap is an authorization, not the final amount.** VERIFIED (Stripe docs, 2026): overcapture lets US restaurants settle up to +30% (Visa, Mastercard) above the authorized amount with no new authorization, so the phone will never see a second event for a tip; gas pumps authorize a status-check amount (up to $175, 2022 network rule, REPORTED); Plaid documents that pending→posted takes 1–5 business days (rarely 14), that name and amount can change, and that some pending authorizations never post. The budget must decrement on authorization and *adjust* on settlement; the transaction needs both `authorized_amount` and `settled_amount` (§7, §9).
4. **Matching a later bank line to an earlier sensed tap is a solved problem; copy Actual/YNAB.** VERIFIED: Actual matches by `imported_id` first, else same account + same amount + date within ±7 days, preferring same payee then nearest date; YNAB's API matches imported to user-entered transactions with same amount and date ±10 days. Save adds an amount tolerance for tip-eligible merchants (§2.4).
5. **Storage stack for 2026**: SQLDelight 2.4.1 (Oct 2026) or Room 3.0.3 (stable Sep 2026, KMP, coroutines-only) both work in KMP; I recommend SQLDelight for SQL-first migrations with CI verification, Room 3 as an acceptable alternative (§3.4). Android file-based encryption (mandatory on devices launching with Android 10+) makes SQLCipher redundant for the at-rest threat on the device; spend the effort on an **encrypted export** instead (§3.5, §4.2).
6. **Backup**: Android Auto Backup (25 MB/app, E2E-encrypted with the lock screen on Android 9+, restore only at install) is a convenience, not a backup you can rely on for a finance app. Recommended: app-generated snapshot file, Argon2id + AES-256-GCM passphrase encryption, saved via Storage Access Framework and optionally to Drive `appDataFolder` (§4.5, §10).
7. **Reconciliation sources for one US user in 2026**: CSV import (Chase, Amex, Capital One, Citi, Discover layouts in §5.1) is free and reliable; SimpleFIN Bridge ($15/yr, 25 institutions, daily refresh, VERIFIED) is the only cheap programmatic option with no approval process; Teller has a free 100-connection developer tier; Plaid now has a free "Trial" plan capped at 10 Production Items for teams created on/after 2026-04-15. MX, Finicity/Mastercard Open Finance and Akoya are enterprise-gated. GoCardless Bank Account Data is EEA/UK only. v1: CSV + optional SimpleFIN. (§5)
8. **Period boundaries**: Actual and YNAB only do calendar months (VERIFIED for Actual's code; REPORTED for YNAB). Save should support calendar month plus an "anchor day" period, and assign a tap to a period by the **local calendar date in the device's time zone at the moment of sensing**, storing the instant, the IANA zone id and the derived local date (§1.6, §3.7).

---

## 1. Envelope / zero-based budgeting semantics

### 1.1 Actual Budget — the exact math (VERIFIED, source read 2026-10-17 from `actualbudget/actual` master)

Actual keeps a "spreadsheet" of named cells per month sheet (`sheetForMonth('2026-10')`). Amounts are integers (cents). Spending transactions have **negative** amounts; income is positive.

Per expense category `c` in month `m` (`envelope.ts` `createCategory`):

```
budget-c        static, default 0 (null is coerced to 0)
carryover-c     static boolean, default false   ("Rollover overspending" toggle in the UI)
sum-amount-c    SUM(amount) of on-budget transactions in category c with date in [monthStart, monthEnd]  (base.ts)
leftover-c      = budget-c + sum-amount-c + (prev.carryover-c ? prev.leftover-c : prev.leftover-pos-c)
leftover-pos-c  = max(0, leftover-c)
```

So with the flag **off**, only a positive balance rolls forward; a negative balance is dropped from the category and instead charged to the month's "To Budget" (below). With the flag **on**, the negative balance stays in the category (Actual's docs recommend this for reimbursable expenses).

Month summary cells (`createSummary`):

```
from-last-month      = prev.to-budget + prev.buffered-selected
total-income         = sum-amount of the single income group
available-funds      = total-income + from-last-month
last-month-overspent = Σ over expense categories where prev.carryover-c == false of min(0, prev.leftover-c)
total-budgeted       = −Σ budget-c (all expense groups)
buffered-auto        = Σ sum-amount of income categories whose carryover flag is set ("auto-hold")
buffered-selected    = buffered (manual "Hold for next month") if ≠ 0 else buffered-auto
to-budget            = available-funds + last-month-overspent + total-budgeted − buffered-selected
total-spent / total-leftover = sums of group cells
```

"Cover overspending" (`actions.ts` `coverOverspending`): given `to` (overspent category), `from` (a category or `'to-budget'`), optional partial `amount`:

```
amountToCover = amount ? −amount : leftover-to
if amountToCover >= 0 or leftover-from <= 0: no-op
coverable = min(|amountToCover|, leftover-from)
if from != 'to-budget': budget-from −= coverable
budget-to += coverable
append a movement note ("Covered X from Y") to the category notes
```

Covering is therefore an edit to the *assigned* amounts, never to transactions, and it can never make the source category negative. `transferAvailable` moves from `to-budget` into a category clamped to `[0, to-budget]`. `holdForNextMonth` clamps the held amount to `[−buffered, max(toBudget, 0)]`.

Persistence (VERIFIED, `aql/schema/index.ts`, migrations): `zero_budgets(id, month INTEGER as YYYYMM, category, amount INTEGER, carryover INTEGER 0/1, goal INTEGER, long_goal INTEGER)`; `zero_budget_months(id = 'YYYY-MM', buffered INTEGER)`; `transactions(amount INTEGER, date stored as INTEGER YYYYMMDD via toDateRepr(str) = parseInt(str.replace(/-/g,'')), cleared, reconciled, imported_id, imported_payee, transfer_id, tombstone, …)`; `categories(goal_def, template_settings, hidden, is_income, sort_order, tombstone)`. There is no stored "available" column: it is always recomputed from the three inputs.

Time handling (VERIFIED, `shared/months.ts`): `currentMonth()` is `format(new Date(), 'yyyy-MM')` in **local time**; the file comments "We need to embrace local time". `bounds(month)` returns `{start: YYYYMMDD of first day, end: YYYYMMDD of last day}` — calendar months only, no custom start day.

Documented behaviours (VERIFIED, actualbudget.org/docs/budgeting, 2026): "all overspending is automatically taken out of next month's To budget amount" unless "Rollover overspending" is enabled; "Hold for next month" moves To Budget into next month's To Budget; income becomes available the month it is dated; returns should be categorized to the original category (worked example in docs: $32 sandals refund restores $32 to Clothing); credit cards are ordinary on-budget accounts with negative balances — there is no YNAB-style "Credit Card Payment" category.

Goal templates (VERIFIED docs, experimental): note directives `#template 50`, `#template 50 up to 100`, `#template up to 150 [hold]`, `#template 10000 by 2025-12`, `#template 10 repeat every week starting 2025-01-06`, `#template 10% of all income`, `#template schedule <name>`, `#template average 3 months`, `#template copy from 12 months ago`, `#template remainder [weight]`, priorities `#template-N`; `#goal 500` colours the indicator by *balance* vs goal rather than by amount budgeted.

### 1.2 YNAB (VERIFIED from support.ynab.com Markdown pages, last-updated 2026-09-08/09, and the public OpenAPI spec)

- **Ready to Assign (RTA)** = money in on-budget accounts not yet assigned. Negative RTA means over-assigned; fix by moving money back to RTA (current and all future months).
- **Overspending colours**: red = *cash* overspending (checking/savings/cash account); yellow = *credit* overspending (card purchase beyond Available). Mixed spending is accounted cash-first, so it shows red.
- **Month rollover** ("When the Month Rolls Over", 2026-09-08): positive Available carries forward unchanged. Cash overspending resets the category to a grey zero and the amount is **deducted from next month's RTA**. Credit overspending does **not** carry as a negative; the shortfall appears as an "Underfunded" alert on the Credit Card Payment category (the card debt grew). Assigned resets to 0 unless assigned ahead. "Set aside another…" targets ask for the full amount every month; "Refill up to…" asks only for the gap.
- **Credit overspending example** (overview page): $150 card purchase with $100 Available → $50 credit overspending; the Credit Card Payment category receives only $100.
- **Targets** (API `goal_type` enum): `TB` Target Category Balance, `TBD` Target Category Balance by Date, `MF` Monthly Funding, `NEED` Plan Your Spending, `DEBT`; fields `goal_target`, `goal_target_month`, `goal_cadence`, `goal_cadence_frequency`, `goal_day`, `goal_under_funded`, `goal_overall_funded`, `goal_overall_left`, `goal_percentage_complete`, `goal_needs_whole_amount`.
- **Units**: all amounts in *milliunits* (integer thousandths).
- **Import matching**: `import_id` max 36 chars; API-imported transactions are matched to a user-entered transaction "on the same account, with the same amount, and with a date +/-10 days". File/Direct Import ids use `YNAB:[milliunit_amount]:[iso_date]:[occurrence]`, e.g. `YNAB:-294230:2015-12-30:1`.
- **Periods**: calendar months only. The rollover guide never mentions custom start days; a third-party review states YNAB months cannot be re-dated and YNAB's own "any pay cycle" article treats pay cycles as a method, not a setting (REPORTED — I did not open that article).

### 1.3 Goodbudget (REPORTED — forum answers, several quoting Goodbudget staff; no official help page located)

- Envelope *fills* are either **Add** (adds the budgeted amount to whatever balance exists, so a −$50 ending balance with a $200 fill starts the month at $150) or **Set** (resets the envelope to the budgeted amount regardless of ending balance). This is the simplest "rollover vs reset" model and maps directly onto a per-category policy.
- "Add $0.00" leaves an envelope untouched during a fill. Fills can push Unallocated negative; there is no "roll over positives only" option (staff: would need to be coded; workaround is switching envelopes to Set before the fill).

### 1.4 Qube Money (VERIFIED current site; REPORTED history)

- The product is now **Qube+**: "does not issue a spending card", connects "through Plaid to the bank accounts and credit cards you already use" (one checking + up to 10 cards), $14/mo or $126/yr Premium, $21/mo or $189/yr Family, 15-day trial. Its "PreQubing" lets the user enter a purchase at checkout so the envelope updates immediately; "Auto-Qube" matches imported purchases to the plan.
- The earlier Qube product issued its own debit card with "Default Zero": the card declined unless a qube was opened in the app first (REPORTED, third-party descriptions). Save re-creates that interaction on top of the user's own cards and Google Wallet, which is why the enforcement layer, not the budget math, is the novel part.

### 1.5 Synthesis — semantics Save should implement (INFERRED, grounded in the above)

- **Scope decision**: Save v1 is a *spending-envelope* system (categories with monthly allocations and enforcement), not a full double-entry budget with accounts and RTA. All of the user's spending is on credit cards, so YNAB's cash/credit distinction buys nothing; Actual's model (card = ordinary account) is closer, but Save does not need account balances to enforce. Keep the schema open for an optional **income/"Ready to Assign"** layer later (a `period.income_minor` and `unassigned` cell computed exactly like Actual's `to-budget`).
- **Rollover policy per category**: `RESET` (Goodbudget *Set*: start every period at the assigned amount), `POSITIVE_ONLY` (Actual default: positives roll, negatives are written off to a period-level "uncovered overspend" figure), `FULL` (Actual "Rollover overspending": negatives roll too). Default `POSITIVE_ONLY` for variable spending, `FULL` for reimbursables and "savings-like" envelopes, `RESET` for strict limits (e.g. Dining).
- **Covering overspending** = moving *assigned* money between categories within the current period with Actual's clamping rules, logged as an audit event. Past periods are never edited in place; corrections go through the current period (both Actual and YNAB say so).
- **Goals**: v1 = a per-category monthly `assigned` amount plus an optional `target_kind` {NONE, REFILL_UP_TO, SET_ASIDE_ANOTHER, BALANCE_BY_DATE} mirroring YNAB's two spending targets and Actual's `up to`/`by` templates. Only `REFILL_UP_TO` and `SET_ASIDE_ANOTHER` are needed for the enforcement use case.

### 1.6 Period boundaries and the 23:58 problem (VERIFIED facts + INFERRED design)

- Facts: Actual = calendar month in local time; YNAB = calendar month. Neither supports pay-cycle periods.
- Design: a `period_scheme` with `kind ∈ {CALENDAR_MONTH, ANCHOR_DAY, FIXED_DAYS}`, `anchor_day` (1–28; months shorter than the anchor use the last day), `cycle_days` and `cycle_epoch_date` for FIXED_DAYS (e.g. biweekly pay). A `period` row materializes `[start_local_date, end_local_date_exclusive)`.
- Assignment rule: a transaction belongs to the period containing its **`local_date`**, computed once at write time from `occurred_at` (epoch ms) and `tz_id` (the device zone when sensed). A tap at 23:58 on Oct 31 in America/Los_Angeles is Oct 31 even though it is already Nov 1 in UTC. Storing the derived date (Actual stores only the local date) makes period queries a plain integer range scan and immune to later zone changes.
- Travel: offer a setting `period_tz_mode ∈ {DEVICE, HOME}`. DEVICE (default) uses the zone at the time of the tap — what the user experiences. HOME recomputes `local_date` in a configured home zone so that the month closes at midnight at home. Record which mode produced `local_date` so a mode change can trigger a recompute.
- Settlement date (from a bank feed) is **not** used for period assignment; it is kept as `posted_local_date` for matching and display. This matches Actual (transaction date) and YNAB (`authorized_date` preferred by Plaid for "when the user made the transaction").

---

## 2. Transaction lifecycle for card payments

### 2.1 Authorization vs settlement — facts

| Fact | Status | Source |
|---|---|---|
| Default authorization validity is 7 days for online payments and 2 days for in-person Terminal payments "for most card networks"; extended authorizations run up to 30 days (Visa 29 days 18 hours; Mastercard 30 days all MCCs; Amex lodging/vehicle rental; Discover travel MCCs). Uncaptured authorizations expire and funds release. | VERIFIED | Stripe docs, extended-authorization page (current) |
| **Overcapture** (settling above the authorized amount with *no new authorization*): Visa US eating places/fast food/caterers **+30%**, global restaurants +20%, taxis/bars/beauty +20%, car rental greater of +15% or $75, lodging/cruise +15%, all other MCCs +15% (CIT); Mastercard US restaurants +30% (US-issued card); Amex restaurants/bars +30% (20% for debit/prepaid); Discover +20% (restaurants, taxis, bars, beauty), +15% lodging/car rental. "After the captured amount settles, the initial pending authorization gets updated with the final captured amount." | VERIFIED | Stripe docs, overcapture page (current) |
| Older Visa restaurant guidance: MCC 5812/5813/5814 may add up to 20% to the authorization for tips; issuers may hold an extra 20%. Mastercard eliminated tip tolerance for chip-and-PIN/contactless in 2016 (card-present non-chip still 20%). | REPORTED (2015/2019 PDFs; Cardfellow) | Visa restaurant PDF; cardfellow.com |
| Automated fuel dispenser status-check holds: Visa raised the ceiling from $125 to $175 on 2022-05-22; Mastercard similar in April 2022; stations choose the actual hold (often $1, $100, $125, $175); networks say holds release within ~2 hours, consumers report up to 3 days. | REPORTED (news) | thedrive.com, kbb.com, olyfed.com |
| Pending → posted typically 1–5 business days, up to 14 in rare cases; `pending_transaction_id` links the posted row to the pending one (null for Capital One, USAA and when matching fails); name and amount can differ (restaurant tip example); some pending transactions "never post and simply disappear" (gas, hotel, rental holds); refunds arrive as modifications/new rows. Plaid checks institutions 1–4×/day. | VERIFIED | Plaid docs: transactions-data, API reference |
| Marketplace orders: "Because we charge for items when they are shipped, this can result in multiple charges; however, the total amount charged will add up to the amount displayed when you placed your order"; banks may hold the authorization 7–10 business days. | VERIFIED (Amazon Pay FAQ) | pay.amazon.com/help/69871 |
| Refunds post as a **separate credit line** 3–14 business days later, often with a different date; chargebacks take 60–120 days; provisional credit for card disputes usually 1–3 business days (US Bank KB). Whether the statement line references the original purchase: not confirmed (it generally does not, INFERRED). | REPORTED | bankrate, ramp, chargebacks911, usbank KB |
| Foreign-currency purchases: the network converts at the rate on the *processing* date (not the tap date) and the issuer may add a foreign transaction fee. | REPORTED/INFERRED — Visa's and Mastercard's rate pages returned HTTP 403 during research | — |
| Foreign transaction fees "typically range from one to three percent"; dynamic currency conversion ("choose USD at the terminal") lets the merchant set an inflated rate. | VERIFIED | chase.com foreign-transaction-fees page |
| Teller (bank-feed API): pending transactions' `date` often changes to the posting date; ids are "usually" stable but a significantly changed pending transaction may post as a **new record with a new id**; refresh at least once per day; look back 7–10 days when syncing. | VERIFIED | teller.io/docs/api/account/transactions |

### 2.2 How Save should treat each event (INFERRED, following the facts above)

- **Authorization sensed (tap)**: create the transaction with `authorized_amount` = sensed amount, `status = AUTHORIZED`, decrement Available immediately by the authorized amount. This is the only moment with user attention, so categorization happens here (prompt or merchant rule).
- **Expected adjustment flag**: if the merchant is tip-eligible (user-taught, MCC hint, or name heuristics such as "restaurant", "grill", "bar"), set `expects_adjustment = true` and optionally reserve an `estimated_adjustment_minor` (default 20% of authorized, configurable) that counts against Available until settlement. For gas-pump-shaped authorizations (amount ∈ {$1.00, $100, $125, $175} at a fuel merchant) treat the authorized amount as a **hold**: show it, count a configurable estimate (e.g. $60) against Available, and expect replacement.
- **Settlement (bank feed/CSV match)**: set `settled_amount`, `posted_local_date`, `status = SETTLED`; Available uses `settled_amount` from then on (delta applied in the same period as the original `local_date`, even if posting crossed a period boundary — the spend "happened" when tapped).
- **Pending expired / dropped**: if a feed shows the pending row removed with no posted successor within `max(14 days, period end + 7 days)`, mark `VOIDED`; Available is restored. Without a feed, offer a manual "This never posted" action.
- **Refund / return**: a new transaction with negative effective amount, `kind = REFUND`, `parent_id` → original (if identifiable), categorized to the **original category** (Actual's guidance), affecting the period in which the refund posts (not the original period; past periods are closed). Partial refunds allowed; `FULL/PARTIALLY_REFUNDED` is a derived view, not a stored state.
- **Chargeback / dispute**: `kind = PROVISIONAL_CREDIT` with `dispute_id`; treat like a refund but flagged reversible; if reversed, a new debit row references it.
- **Decline (bank/issuer)**: the tap produced no money movement; record an `enforcement_decision` or `sense_event` with `decision = DECLINED_BY_ISSUER` for the audit log; no budget effect.
- **Blocked by Save**: not a transaction; an `enforcement_decision` row (§7) with the override choice, if any. If the user overrides and taps, the following sensed transaction is linked by `linked_transaction_id`.
- **Manual entry** (cash, missed notification): `origin = MANUAL`, same lifecycle but starts at `SETTLED` unless the user marks it pending.

### 2.3 Transaction state machine (see §9 for the table)

States: `AUTHORIZED` → (`SETTLED` | `VOIDED`), `SETTLED` → (`REFUNDED_PARTIAL`/`REFUNDED_FULL` are derived from child rows, not states) and `DISPUTED` (flag). Category assignment is orthogonal: `category_id NULL` means "uncategorized" and is permitted in any state; an uncategorized transaction counts against a system "Uncategorized" envelope so Available totals stay honest.

### 2.4 Matching heuristics (bank line → sensed transaction)

Precedents (VERIFIED):

- Actual (`accounts/sync.ts` `matchTransactions`): (1) exact `imported_id` on the same account; (2) otherwise candidates = same account, **same amount**, `date BETWEEN d−7 AND d+7`, and (with `strictIdChecking`) candidates must have no `imported_id` if the incoming row has one; candidates sorted by date distance, tie-break preferring candidates that do not already carry an `imported_id`; pass 2 picks the first candidate with the **same payee**, pass 3 the first remaining candidate. Matching is done in passes across the whole batch so high-fidelity matches win before low-fidelity ones. A matched row is updated (`cleared`, `imported_id`, payee/notes merge) rather than duplicated; reconciled (locked) rows are never changed.
- YNAB API: same account, same amount, date ±10 days.
- Plaid: `pending_transaction_id`; Teller: stable ids mostly, re-query 7–10 days back.

Save's algorithm (INFERRED):

1. **Exact external id**: if the feed row's `(source, external_id)` was seen before, update that `external_transaction` and its link.
2. **Pending→posted by provider link**: Plaid `pending_transaction_id`; SimpleFIN/Teller: same id with `pending` flipping to false.
3. **Candidate set**: sensed transactions on the same `payment_instrument` (card last4 when the feed exposes it; otherwise all cards) with `status ∈ {AUTHORIZED}` first, then `SETTLED` rows without an external link; `local_date ∈ [posted_date − 10, posted_date + 2]` (posting can precede the sensed date only through clock skew/time zones, so allow a small positive window).
4. **Amount test**: exact match on minor units; else, if the sensed transaction has `expects_adjustment`, accept `settled ∈ [authorized, authorized × (1 + tolerance)]` with tolerance 0.30 for restaurants/bars (network cap), 0.15 otherwise; for fuel holds accept any settled amount ≤ $250 from a fuel merchant within 3 days.
5. **Merchant test**: normalize both descriptors (uppercase, strip digits/`*`/store numbers/city/state suffix, collapse whitespace) and compute a token-Jaccard; ≥ 0.5 counts as a payee match. Statement descriptors differ from the wallet's merchant name (e.g. `SQ *BLUE BOTTLE` vs `Blue Bottle Coffee`), so the merchant test is a tie-breaker, never a requirement; learn aliases into `merchant.raw_names` on confirmed matches.
6. **Score & decide**: exact amount + date ≤ 1 day → auto-link; otherwise rank by (amount distance, date distance, merchant similarity) and auto-link only a unique candidate with score above threshold; else queue for the user ("Is this the $48.20 Costco tap from Tuesday?"). Never auto-link a row that would change the period of a closed-period transaction without flagging it.
7. Unmatched feed rows older than 3 days become **imported transactions** (`origin = IMPORTED`, uncategorized or rule-categorized) so nothing is lost when a notification was missed.

---

## 3. Storage

### 3.1 Money representation

- VERIFIED precedents: Actual = INTEGER cents; YNAB = INTEGER milliunits; SimpleFIN = decimal **strings** (`"-33293.43"`), Teller = decimal strings, Plaid = JSON numbers (parse with `BigDecimal`, never `Double`).
- Save: `amount_minor INTEGER (Long)` + `currency TEXT` (ISO-4217). Minor-unit exponent from a small built-in table (USD 2, JPY 0, KWD 3) — `java.util.Currency.getDefaultFractionDigits` exists on JVM/Android but not in common KMP code, so ship the table. Convert decimal strings with `BigDecimal.movePointRight(exponent).setScale(0, HALF_EVEN)`; percentages (tip estimate, FX) with integer math and a single explicit rounding step; split allocations use largest-remainder so parts sum exactly to the total. Sign convention inside Save: **outflows positive** in the API/UI layer is error-prone across sources (Plaid positive = outflow; Actual negative = outflow; SimpleFIN negative = withdrawal). Pick one at the boundary: store `direction` implicitly by sign with **outflow = positive** in `transaction.*_amount_minor` and convert every import at the adapter.

### 3.2 Identifiers

- VERIFIED RFC 9562 (May 2024): UUIDv7 = 48-bit Unix ms timestamp, version nibble, 12 random/counter bits, variant, 62 random bits; §6.2 monotonicity methods (dedicated counter, monotonic random, sub-ms precision); §2.1/§6.11 prefer v7 over v4 for database index locality; §8: use v4, not v7, where the id is a security token.
- VERIFIED Kotlin docs: `kotlin.uuid.Uuid.generateV7()` exists since **Kotlin 2.3** (experimental, `@OptIn(ExperimentalUuidApi::class)`), guarantees strict monotonicity within one process run; `generateV7NonMonotonicAt(instant)` for backdated ids. Room 3.1.0-alpha01 (2026-09-09) adds a `kotlin.uuid.Uuid` converter.
- Save: UUIDv7 for every entity, stored as 16-byte BLOB (SQLite compares BLOBs bytewise, so time ordering survives) or as the 36-char text form if debuggability matters more than 20 bytes/row; pick one and never mix. Export/import keeps ids stable so re-imports and multi-device sync (later) dedupe.

### 3.3 Event sourcing vs CRUD for the audit trail

- Precedent (VERIFIED): Actual persists every change as a CRDT message `(dataset, row, column, value, timestamp)` with a Hybrid Unique Logical Clock timestamp (`2015-04-24T22:23:42.123Z-1000-0123456789ABCDEF`, HLC paper by Kulkarni et al.) and materializes current state into ordinary tables; the message log is what syncs between devices. Tombstones (`tombstone = 1`) rather than deletes.
- Recommendation (INFERRED): **CRUD tables for current state + an append-only `audit_event` journal** written in the same SQLite transaction. Full event sourcing (rebuilding state from events) is more than a single-user app needs and makes ad-hoc SQL reporting painful; a journal gives the required audit of overrides and lock events at trivial cost. Make the journal tamper-evident with a hash chain (`hash = SHA-256(prev_hash ‖ canonical_json(event))`) so an export can be verified. If multi-device sync is ever added, Actual's column-level CRDT over the same journal is the proven path.
- Events to log (minimum): `CATEGORY_LOCKED`, `CATEGORY_UNLOCKED`, `BLOCK_SHOWN`, `OVERRIDE_JUST_ONCE`, `OVERRIDE_MOVE_MONEY`, `ASSIGNED_CHANGED`, `MONEY_MOVED`, `TRANSACTION_SENSED`, `TRANSACTION_CATEGORIZED`, `TRANSACTION_SETTLED/VOIDED/REFUNDED`, `RULE_LEARNED`, `PERIOD_CLOSED`, `IMPORT_RUN`, `BACKUP_CREATED/RESTORED`, `SETTINGS_CHANGED`, plus `SERVICE_RESTARTED` / `NOTIFICATION_ACCESS_LOST` from the sensing layer (so gaps in sensing are visible in the audit).

### 3.4 SQLDelight vs Room (KMP) in October 2026

| | SQLDelight | Room 3 (`androidx.room3`) | Room 2.x |
|---|---|---|---|
| Latest | **2.4.1 (2026-10-06)**; 2.4.0 2026-09-18; min Android SDK 23 since 2.3.2 (VERIFIED releases page) | **3.0.3 stable 2026-09-09**, 3.0.0 2026-07-01, 3.1.0-alpha01 2026-09-09 (VERIFIED release notes) | 2.8.5 stable 2026-09-09; KMP since 2.7.0 (2025-04-09) |
| Model | SQL-first: `.sq` files generate typed Kotlin; `.sqm` migrations; `verifySqlDelightMigration` Gradle task checks `N.db` snapshots migrate to the latest schema; `AfterVersion(n)` code hooks | Annotation-first, KSP only (no KAPT/Java codegen), Kotlin codegen only, coroutines-first (DAOs must be `suspend` or return `Flow`), `SQLiteDriver` required, `BundledSQLiteDriver` recommended, no `SupportSQLiteDatabase` (bridge via `room3-sqlite-wrapper`), `@ColumnTypeConverter` (renamed), Flow-based invalidation (`createFlow`), JS/Wasm targets added | Same annotations, still supports Support* APIs |
| Android driver | `AndroidSqliteDriver(schema, context, name, factory = FrameworkSQLiteOpenHelperFactory(), callback, cacheSize, useNoBackupDirectory = false, windowSizeBytes)` — `factory` accepts any `SupportSQLiteOpenHelper.Factory` (VERIFIED API ref) | `AndroidSQLiteDriver` / `BundledSQLiteDriver`; SQLCipher ships a `SQLCipherDriver` for Room 3 (VERIFIED SQLCipher README) | `SupportOpenHelperFactory` from SQLCipher |
| KMP maturity | Longest track record; used by many KMP apps | Official, stable since July 2026 but API surface is new | Mature on Android |

Recommendation (INFERRED): **SQLDelight 2.4.x**. Reasons: the schema is the product's contract and SQL-first keeps it reviewable by the next AI session; migration verification in CI is exactly what an audit-bearing finance DB needs; the Android driver takes a pluggable `SupportSQLiteOpenHelper.Factory`, so encryption can be bolted on later without a rewrite; smaller API churn risk than Room 3's first stable year. Room 3.0.3 is an acceptable alternative if the builder is more fluent in it; avoid Room 2.x for a new KMP codebase. Either way: enable WAL, `foreign_keys = ON`, and keep all writes in explicit transactions.

### 3.5 Encryption at rest: Android FBE vs SQLCipher

- VERIFIED (source.android.com, file-based encryption): Credential Encrypted (CE) storage is the default location for app data; `/data/data` is an alias of `/data/user/0` (CE); CE keys are unavailable until the user's first unlock after boot; FBE is mandatory for all devices launching with Android 10+; file contents AES-256-XTS, filenames AES-256-CTS (HCTR2 preferred since Android 14), Adiantum on devices without AES acceleration; DE keys bound to KeyMint/TEE and Verified Boot.
- VERIFIED (sqlcipher-android README): `net.zetetic:sqlcipher-android:4.19.1@aar` + `androidx.sqlite:sqlite:2.7.0`, minimum API 23, `System.loadLibrary("sqlcipher")` before any DB call, `SupportOpenHelperFactory(byte[] password, …)` for Room 2 / SQLDelight's `factory`, `SQLCipherDriver` for Room 3. (Core SQLCipher 4.16.0 2026-05-12 — REPORTED.)
- Assessment (INFERRED): on a locked, FBE device the database is already encrypted at rest with a key derived from the lock-screen credential and hardware. SQLCipher adds protection only (a) when the DB file leaves the device unencrypted (ADB backup is gone since Android 12 for `allowBackup` data, but a rooted device or a copied Auto Backup are conceivable), and (b) against other apps on a rooted device while unlocked. Its costs: native library size, keying UX (where does the passphrase live? If in Android Keystore, it is unlocked whenever the device is, so it adds nothing over FBE), and incompatibility with Auto Backup's silent restore. **Decision: no SQLCipher in v1.** Protect the *export* with a passphrase (§4.2), keep bank-API tokens in the Android Keystore (AES-GCM key with `setUserAuthenticationRequired(false)`; EncryptedSharedPreferences/Jetpack Security is deprecated — REPORTED, with the AndroidX reference page pointing to plain `SharedPreferences` + `KeyGenerator("AES","AndroidKeyStore")`), and gate the UI with `BiometricPrompt`. Revisit SQLCipher only if a threat model with rooted devices appears.

### 3.6 Schema migration practice (INFERRED, using VERIFIED tooling)

- SQLDelight: schema version starts at 1; `1.sqm` upgrades 1→2; migrations run inside a transaction on drivers that support it (do not add BEGIN/COMMIT yourself); generate `1.db` once via `generate<SourceSet><Db>Schema` and keep `verifySqlDelightMigration` in `check`; 2.4.0 enforces stricter migration-file versioning. Room: `exportSchema = true` + `schemaDirectory`, `AutoMigration` with `AutoMigrationSpec`, and `MigrationTestHelper`.
- Rules for Save: additive migrations only in minor versions; never reuse a column for a new meaning; write a `schema_meta(version, applied_at, app_version)` row per migration; back up the DB file (`VACUUM INTO 'pre-migration.db'`) before destructive steps; migrations must be idempotent per SQLite's transactional guarantees; keep the audit journal schema frozen (new fields go into `payload_json`).

### 3.7 Timestamps

- VERIFIED (kotlinx-datetime README): 0.8.0 requires Kotlin ≥ 2.3.21; `Instant`/`Clock` moved into the stdlib as `kotlin.time.Instant`/`kotlin.time.Clock` (0.7.x compat artifacts exist); `instant.toLocalDateTime(TimeZone.of(id))`, `localDateTime.toInstant(tz, TransitionHandler.REJECT_TRANSITIONS)`; Android below API 26 needs core-library desugaring; optional `kotlinx-datetime-zoneinfo` (~1 MB) bundles a current IANA database because the system tzdb may be stale.
- Save columns per time-bearing row: `occurred_at_ms INTEGER` (UTC epoch ms, the truth), `tz_id TEXT` (IANA id at capture), `local_date INTEGER` (YYYYMMDD derived at write), optional `local_time_min INTEGER`. Index `(category_id, local_date)` and `(instrument_id, local_date)`. All "which period" logic uses `local_date` only (Actual's approach), so DST and travel cannot move a transaction between months after the fact.

---

## 4. Backup and restore

### 4.1 Android Auto Backup (VERIFIED, developer.android.com/identity/data/autobackup + testing page)

- Up to **25 MB per app per user**, stored in the user's Drive without counting against quota; only the latest backup is kept; over quota → `onQuotaExceeded()` and the cloud backup is skipped until the data shrinks.
- Included by default: shared prefs, `getFilesDir()`, `getDir()`, databases (`getDatabasePath`), `getExternalFilesDir()`. Always excluded: `getCacheDir()`, `getCodeCacheDir()`, `getNoBackupFilesDir()`.
- Runs when backup is enabled, ≥ 24 h since last, device idle, on Wi-Fi (unless mobile-data opt-in), and only if data changed. **The system stops the app during backup.** Foreground apps are skipped unless `android:backupInForeground="true"`.
- Restore happens **only at install time** (Play, setup wizard, `adb install`), before first launch; the device prefers its own backup over the ancestral one.
- Android 9+: end-to-end encrypted with the lock-screen PIN/pattern/password; `android:dataExtractionRules` (API 31+) with `<cloud-backup disableIfNoEncryptionCapabilities="true">`, `<device-transfer>`, and (Android 16 QPR2 / API 36.1+) `<cross-platform-transfer platform="ios">`; `android:fullBackupContent` still needed for API ≤ 30; `<exclude>` wins over `<include>`; paths have no wildcards; `requireFlags="clientSideEncryption"` conditions. `allowBackup="false"` may still allow D2D transfer on Android 12+.
- Testing: `adb shell bmgr enable true`; `adb shell bmgr transport com.android.localtransport/.LocalTransport`; `adb shell settings put secure backup_local_transport_parameters 'is_encrypted=true'`; `adb shell bmgr backupnow <pkg>` (expect `Package <pkg> with result: Success`); `adb shell bmgr list transports`; restore by uninstall + `adb install-multiple -t --user 0`; switch back with `adb shell bmgr transport com.google.android.gms/.backup.BackupTransportService`; `bmgr run` if key-value backup "not yet run".
- Caveat (INFERRED): a WAL-mode SQLite DB has `-wal`/`-shm` siblings in the database domain; because the app is stopped first they are copied consistently, but the safer pattern is to exclude the live DB (`<exclude domain="database" path="save.db"/>` etc.) and include a small app-written snapshot (`VACUUM INTO`) under `files/backup/`. Auto Backup cannot be triggered by the app on demand, cannot be restored except at install, and is silently skipped above 25 MB — treat it as *last resort*, not the primary backup.

### 4.2 Encrypted export file — crypto recipe

Facts: RFC 9106 (Sept 2021, VERIFIED) recommends **Argon2id**; parameter sets t=1, m=2 GiB, p=4 (uniformly safe) or **t=3, m=64 MiB, p=4** when memory is limited; 16-byte salt; 32-byte tag. OWASP (VERIFIED, current cheat sheet) lists equal-strength minimums m=47104 KiB t=1 p=1 … m=7168 KiB t=5 p=1, and PBKDF2-HMAC-SHA256 600,000 iterations if FIPS requires PBKDF2. Libraries: `argon2kt` 1.6.0 (JNI, MIT; REPORTED), `com.goterl:lazysodium-android` 5.2.0 (libsodium: `crypto_pwhash` Argon2id, `crypto_secretstream_xchacha20poly1305`; REPORTED, min SDK 24 per a mirror). Tink's FAQ says nothing about password-based key derivation and I found no PBKDF/Argon2 in Tink (negative result); Android's `javax.crypto` provides `AES/GCM/NoPadding` and PBKDF2 `SecretKeyFactory` algorithms, but I could not load the algorithm/API-level table to confirm exact names and levels (unverified; commonly reported as `PBKDF2withHmacSHA256` from API 26).

Format `SAVEBK1` (INFERRED design):

```
magic "SAVEBK1" (7 bytes) | header_len u16 | header JSON (UTF-8) | ciphertext...
header = { "v":1, "kdf":"argon2id", "m_kib":65536, "t":3, "p":4, "salt":b64(16 bytes),
           "cipher":"aes-256-gcm", "chunk":1048576, "created_at":"2026-10-17T21:03:00Z",
           "app_version":"1.4.0", "schema_version":12, "plain_sha256": b64 }
```

- Key = Argon2id(passphrase NFKC-normalized UTF-8, salt, m=64 MiB, t=3, p=4, 32 bytes). On low-RAM devices fall back to m=19 MiB t=2 (OWASP set) and record it in the header.
- Payload = `VACUUM INTO` snapshot of the SQLite file (or a canonical JSON-Lines dump; keep both options, DB snapshot for fidelity, JSONL for portability), compressed (deflate), then encrypted in 1 MiB chunks: nonce = 4-byte random prefix ‖ 8-byte chunk counter; AAD = header bytes ‖ chunk index ‖ final-flag; a final empty chunk authenticates the length. (libsodium `secretstream` gives this for free if lazysodium is adopted.)
- Verify `plain_sha256` after decrypt; restore into a temp file, `PRAGMA integrity_check`, run migrations, then atomically swap. Never overwrite the live DB before the new one is validated.
- Store the passphrase nowhere. Optionally wrap the derived key with an Android Keystore key for *scheduled* exports to Drive so they don't prompt; the user still needs the passphrase to restore on a new device.

### 4.3 Google Drive `appDataFolder` (VERIFIED, Drive API guide)

- Scope `https://www.googleapis.com/auth/drive.appdata` (labelled **non-sensitive**); folder hidden from the user and other apps, cannot be opened in Drive UI, separate from the Android backup folder; create with `parents: ["appDataFolder"]`, list with `spaces=appDataFolder`, download with `alt=media`; cannot share/move/trash (`notSupportedForAppDataFolderFiles`); deleted when the user uninstalls the app **from My Drive** or deletes it manually. Quota accounting is not stated on the page (unverified; assume it counts). Requires Google Sign-In/Credential Manager + an OAuth client; for a sideloaded personal app the Cloud project can stay in "testing" with the owner as a test user.

### 4.4 Storage Access Framework (well-established API; INFERRED guidance)

`Intent.ACTION_CREATE_DOCUMENT` (`type = "application/octet-stream"`, `EXTRA_TITLE = "save-backup-2026-10-17.savebk"`) for export; `ACTION_OPEN_DOCUMENT` for restore; `ACTION_OPEN_DOCUMENT_TREE` + `takePersistableUriPermission` for a scheduled export folder (local or any DocumentsProvider such as Drive, Nextcloud, Syncthing-exposed folders). No storage permission needed; works on Android 10+ scoped storage.

### 4.5 Recommended strategy for a local-first personal app (INFERRED)

1. **Primary**: nightly encrypted snapshot (`SAVEBK1`) to a user-chosen SAF folder (WorkManager periodic job, `requiresCharging=false`, `requiresBatteryNotLow=true`); keep 7 daily + 4 weekly; also immediately after every period close and every restore.
2. **Secondary**: the same file to Drive `appDataFolder` if the user signs in (optional dependency on Play Services).
3. **Tertiary**: Auto Backup with the live DB excluded and the latest snapshot included (≤ 25 MB — a year of a single user's taps is a few MB).
4. **Portability**: "Export CSV/JSONL" of transactions and allocations (unencrypted, user-initiated) for spreadsheets/other apps.

---

## 5. Optional reconciliation sources

### 5.1 CSV export layouts (US card issuers)

| Issuer | Header (observed) | Dates | Sign | Status | Quirks |
|---|---|---|---|---|---|
| Chase credit card | `Transaction Date,Post Date,Description,Category,Type,Amount,Memo` | `MM/DD/YYYY` (Firefly community config `m/d/Y`, VERIFIED for Chase config) | Purchases **negative**, payments/returns positive in a forum-posted sample; one guide claims the opposite — **auto-detect** | REPORTED (invoicedataextraction, manager.io forum) | `Type` values seen: `Sale`, `Payment`, `Return`, `Adjustment`, `Fee` (REPORTED); only the CSV has both dates. Chase checking uses `Details,Posting Date,Description,Amount,Type,Balance,Check or Slip #` (+ trailing empty column) — INFERRED from the 8-role Firefly config. |
| American Express | 2022 layout: `Date,Description,Amount,Extended Details,Appears On Your Statement As,Address,City/State,Zip Code,Country,Reference,Category`; other variants add `Card Member`, `Account #` | `MM/DD/YYYY` | Charges **positive**, payments negative | VERIFIED (amex2qif README lists 5 historical layouts) / REPORTED sign | "AMEX is in the habit of changing the header order/format … frequently" — fingerprint by header set, not position. |
| Capital One | `Transaction Date,Posted Date,Card No.,Description,Category,Debit,Credit` | `YYYY-MM-DD` | Two unsigned columns; purchase fills `Debit`, payment/refund fills `Credit` | VERIFIED header from a sample file (mojito README) | `Card No.` is the last 4 digits (sample `1234`). No pending rows via Plaid either (Plaid notes Capital One provides no pending data). |
| Citi | `Status,Date,Description,Debit,Credit` (+ `Member Name` on some cards) | `MM/DD/YYYY` (Firefly config `m/d/Y`, VERIFIED) | `Debit` positive magnitude; `Credit` carries a **negative** sign (REPORTED) — negating one column blindly flips refunds | REPORTED (Tiller 2026-05-23; beancount.io) | Pending charges are not exported until posted; ~24 months history. `Status` values not confirmed (`Cleared`/`Pending` expected). |
| Discover | `Trans. Date,Post Date,Description,Amount,Category` (Tiller writes `Transaction Date`) | `MM/DD/YYYY` | **Conflicting**: beancount.io says purchases positive/payments negative; Tiller says charges negative — auto-detect | REPORTED | Categories like `Supermarkets`, `Restaurants`, `Payments and Credits` (REPORTED); up to ~7 years history. |

Importer design (INFERRED): detect issuer by **header fingerprint** (set of normalized column names) rather than file name; infer sign by finding a row whose description/type matches `/payment|thank you|autopay/i` and asserting purchases carry the opposite sign; parse amounts via `BigDecimal` after stripping `$`, `,`, quotes and parentheses; dedupe with a stable `external_id = sha256(issuer ‖ posted_date ‖ amount ‖ normalized_description ‖ occurrence_index)` in the spirit of YNAB's `YNAB:amount:date:occurrence`; keep the raw line in `external_transaction.raw_json`. Firefly III's `import-configurations` repo (MIT-licensed JSON role maps, VERIFIED to exist for `us/chase` and `us/citi`) is directly reusable as test fixtures for column roles.

### 5.2 Bank aggregation APIs (status as of Oct 2026)

| Provider | Access for a personal app | Cost | Data/latency | Verdict |
|---|---|---|---|---|
| **Plaid** (US) | Sandbox free; **Trial plan**: free, max **10 Production Items**, new US/CA teams created on/after **2026-04-15** ("most appropriate for hobbyist use"); Pay-as-you-go: no minimum, prices shown only in the dashboard; Limited Production is legacy (no new sign-ups after 2026-04-15) | Transactions billed as a monthly subscription per Item (UTC months, not prorated); Sandbox always free | Pending supported with `pending_transaction_id`; `/transactions/sync` cursor API (`added/modified/removed`, `SYNC_UPDATES_AVAILABLE` webhook); checks 1–4×/day; `authorized_date` vs `date`; `merchant_name`, `payment_channel`, `personal_finance_category` | VERIFIED (plaid.com/docs billing; support articles). Good v2 option; needs a backend or on-device Link + token storage; OAuth institution flows need a registered redirect. |
| **Teller** (US) | Developer tier: free, **100 live connections**; Production pay-as-you-go | Transactions **$0.30 per enrollment per month**; Balance $0.10/call; Identity $1.75/call; Verify $1.50/account | `status: posted|pending`, `details.processing_status`, categories list, counterparty; refresh ≥ once/day, `transactions.processed` webhook; ids mostly stable but can change on posting; mTLS client certs | VERIFIED (teller.io, docs). Attractive for v2; US-only in practice. |
| **SimpleFIN Bridge** (US/CA) | Self-serve; user creates a Setup Token at bridge.simplefin.org, app claims it once → Access URL (Basic auth) | **$1.50/mo or $15/yr + tax**, up to **25 institutions and 25 apps** | `GET {access}/accounts?start-date&end-date&pending=1&account=&balances-only=1` (protocol v2 draft): accounts with `id,name,currency,balance,available-balance,balance-date,transactions[{id,posted,amount (string),description,transacted_at?,pending?}]`; epoch seconds; `posted = 0` when pending; ≤ 90-day window per request; plan ≤ 24 requests/day, overlap fetch windows by ~5 days; data is for daily updates; underlying aggregator not stated on the site | VERIFIED (bridge site, developer guide, protocol page). **Best v1 optional source**: trivial protocol, no approval, Actual Budget and Firefly III already support it (community says once-a-day refresh and institution-dependent history). |
| **MX** | No self-serve production path found | — | — | Negative result; exclude. |
| **Mastercard Open Finance (Finicity)** | Sandbox + "Test Drive" (non-billable, unlimited, mock/real?) ; production via upgrade request; eligibility for individuals not stated | Not published | — | VERIFIED onboarding page; enterprise-oriented; exclude. |
| **Akoya** | Sandbox self-serve; production requires questionnaire, security & risk review, legal agreement; pricing by unique monthly connections | Not published | — | VERIFIED guide; enterprise; exclude. |
| **GoCardless Bank Account Data** | EEA PSD2 countries (+UK as AISP); Actual docs: "not accepting new accounts"; Firefly docs: GoCardless is "shifting away" | — | ≤ 4 API calls/day/account bank limits; 90-day consent; up to 24 months history | VERIFIED docs; **not applicable to US**. |
| **Enable Banking** (EU) | free restricted mode for own accounts (Firefly docs) | free | — | REPORTED; EU only. |
| **Salt Edge/Spectre** | Firefly free partnership ended 2025-10-31 | paid | — | REPORTED; exclude. |

Reusability: Actual's bank-sync adapters run in `actual-server` (Node/TypeScript) and the matching logic in `loot-core` (TypeScript) — portable as *specifications*, not as code for a Kotlin app; Actual's docs state bank-sync secrets live server-side and syncing only runs while Actual is open. Firefly III's data importer is PHP; its JSON column-role configurations are reusable fixtures. Both projects' SimpleFIN handlers are useful references for the claim/access flow and error handling (`errlist` codes `gen.*`, `con.*`, `act.*`).

### 5.3 Recommendation

- **v1**: CSV import (five issuers above, header fingerprinting) + optional **SimpleFIN Bridge** behind a settings toggle (token pasted by the user; stored in Keystore-wrapped prefs; daily WorkManager fetch with ±5-day overlap; pending rows requested with `pending=1` and mapped to `external_transaction.pending`).
- **v2**: Teller (free 100 connections) or Plaid Trial (10 Items) — both require handling OAuth redirects/mTLS and a place to keep access tokens; a tiny self-hosted relay is likely needed for webhooks.
- **Exclude**: MX, Finicity, Akoya, GoCardless, Salt Edge.

---

## 6. Multi-currency and travel — minimal viable handling

- Facts: Actual "is currency agnostic and does not support multi-currency" (VERIFIED docs; workaround is rule-based manual conversion). YNAB budgets are single-currency (REPORTED). Issuers convert at the network rate on the processing date (REPORTED/INFERRED) and add 0–3% fees (VERIFIED 1–3% typical, Chase).
- Design: the budget has one **home currency**. Every transaction stores `currency` + `authorized_amount_minor` in that currency, plus `home_amount_minor` (what counts against Available) and `fx_rate_e9` (rate × 10⁹, integer) + `fx_source ∈ {ESTIMATE, SETTLED}`. At tap time abroad, `home_amount` = authorized × cached indicative rate × (1 + expected fee %) and `fx_source = ESTIMATE`; on settlement from a feed/CSV (which is already in home currency), replace with the actual home amount and keep the original foreign amount for display. Without a feed, allow the user to type the statement amount. Offline rate cache: a small table `fx_rate(base, quote, rate_e9, as_of)` refreshed opportunistically (any free daily ECB/Frankfurter-style source; not needed for v1 if the user rarely travels — then prompt for an estimated home amount).
- Period assignment while travelling follows §1.6 (`DEVICE` vs `HOME` time-zone mode).

---

## 7. Proposed entity-relationship model (INFERRED; SQLite-flavoured)

Conventions: ids are UUIDv7 BLOB(16); money `INTEGER` minor units with outflow positive; instants `INTEGER` epoch ms; dates `INTEGER` YYYYMMDD; booleans `INTEGER 0/1`; soft delete via `deleted_at`. Every mutation also inserts into `audit_event` in the same transaction.

```
settings(key TEXT PK, value TEXT NOT NULL, updated_at INTEGER)
  -- home_currency, period_tz_mode, home_tz_id, tip_estimate_bps(2000), fuel_hold_estimate_minor, ...

period_scheme(id PK, kind TEXT CHECK(kind IN ('CALENDAR_MONTH','ANCHOR_DAY','FIXED_DAYS')),
  anchor_day INTEGER CHECK(anchor_day BETWEEN 1 AND 28), cycle_days INTEGER, cycle_epoch_date INTEGER,
  effective_from_date INTEGER NOT NULL)            -- changing the scheme starts a new row; old periods keep theirs

period(id PK, scheme_id FK, start_date INTEGER NOT NULL, end_date_excl INTEGER NOT NULL,
  label TEXT, status TEXT CHECK(status IN ('FUTURE','OPEN','CLOSED')), closed_at INTEGER,
  income_minor INTEGER DEFAULT 0, UNIQUE(start_date))
  -- invariant: periods are contiguous and non-overlapping; exactly one OPEN at a time

category_group(id PK, name TEXT NOT NULL, sort_order REAL, archived_at INTEGER)

category(id PK, group_id FK, name TEXT NOT NULL, kind TEXT CHECK(kind IN ('EXPENSE','INCOME','SYSTEM')),
  rollover_policy TEXT CHECK(rollover_policy IN ('RESET','POSITIVE_ONLY','FULL')) DEFAULT 'POSITIVE_ONLY',
  enforcement_mode TEXT CHECK(enforcement_mode IN ('BLOCK','WARN','OFF')) DEFAULT 'BLOCK',
  default_assigned_minor INTEGER DEFAULT 0, target_kind TEXT, target_amount_minor INTEGER, target_date INTEGER,
  color TEXT, icon TEXT, sort_order REAL, created_at INTEGER, archived_at INTEGER)
  -- exactly one SYSTEM category 'Uncategorized' (cannot be archived)

allocation(period_id FK, category_id FK, assigned_minor INTEGER NOT NULL DEFAULT 0,
  rollover_in_minor INTEGER NOT NULL DEFAULT 0,       -- materialized at period open/close from prev period
  note TEXT, updated_at INTEGER, PRIMARY KEY(period_id, category_id))
  -- invariant: assigned_minor >= 0; rollover_in_minor sign per policy (RESET: 0; POSITIVE_ONLY: >= 0)

payment_instrument(id PK, label TEXT, network TEXT, last4 TEXT, issuer TEXT, wallet_hint TEXT,
  currency TEXT, active INTEGER DEFAULT 1, created_at INTEGER)

merchant(id PK, canonical_name TEXT NOT NULL, mcc_hint INTEGER, tip_eligible INTEGER DEFAULT 0,
  fuel INTEGER DEFAULT 0, default_category_id FK NULL, rule_confidence INTEGER,  -- 0..100
  times_confirmed INTEGER, last_seen_at INTEGER)
merchant_alias(merchant_id FK, raw_name TEXT, source TEXT CHECK(source IN ('WALLET','FEED','CSV','USER')),
  PRIMARY KEY(merchant_id, raw_name))

txn(id PK, kind TEXT CHECK(kind IN ('PURCHASE','REFUND','PROVISIONAL_CREDIT','ADJUSTMENT','MANUAL')),
  status TEXT CHECK(status IN ('AUTHORIZED','SETTLED','VOIDED')),
  origin TEXT CHECK(origin IN ('WALLET_SENSED','MANUAL','IMPORTED')),
  instrument_id FK NULL, merchant_id FK NULL, category_id FK NULL,          -- NULL = uncategorized
  parent_id FK NULL,                                                         -- refund -> original purchase
  currency TEXT NOT NULL, authorized_amount_minor INTEGER NOT NULL, settled_amount_minor INTEGER,
  home_amount_minor INTEGER NOT NULL, fx_rate_e9 INTEGER, fx_source TEXT,
  expects_adjustment INTEGER DEFAULT 0, estimated_adjustment_minor INTEGER DEFAULT 0,
  occurred_at_ms INTEGER NOT NULL, tz_id TEXT NOT NULL, local_date INTEGER NOT NULL, local_time_min INTEGER,
  period_id FK NOT NULL, posted_local_date INTEGER,
  sense_fingerprint TEXT UNIQUE,            -- sha256(notification text + minute bucket) to dedupe re-posted notifications
  categorized_at INTEGER, categorized_by TEXT CHECK(categorized_by IN ('USER','RULE','IMPORT')),
  note TEXT, created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL, deleted_at INTEGER)
  -- effective_amount := COALESCE(settled_amount_minor, authorized_amount_minor + estimated_adjustment_minor) for status != 'VOIDED'
  -- invariant: period_id = period containing local_date; refunds have kind REFUND and negative effective amount

external_txn(id PK, source TEXT CHECK(source IN ('CSV_CHASE','CSV_AMEX','CSV_CAPONE','CSV_CITI','CSV_DISCOVER','SIMPLEFIN','TELLER','PLAID')),
  external_id TEXT NOT NULL, account_ref TEXT, posted_date INTEGER, transacted_date INTEGER,
  amount_minor INTEGER NOT NULL, currency TEXT, raw_description TEXT, pending INTEGER DEFAULT 0,
  raw_json TEXT, imported_at INTEGER, matched_txn_id FK NULL, match_method TEXT, match_confidence INTEGER,
  UNIQUE(source, account_ref, external_id))

enforcement_decision(id PK, at_ms INTEGER NOT NULL, instrument_id FK NULL, predicted_category_id FK NULL,
  predicted_merchant_id FK NULL, available_minor_at_decision INTEGER,
  decision TEXT CHECK(decision IN ('ALLOW','WARN','BLOCK')),
  override_kind TEXT CHECK(override_kind IN ('NONE','JUST_THIS_ONCE','MOVE_MONEY','DISABLE_CATEGORY')),
  moved_from_category_id FK NULL, moved_amount_minor INTEGER, reason TEXT, linked_txn_id FK NULL)

category_lock(category_id FK, period_id FK, locked INTEGER NOT NULL, since_ms INTEGER NOT NULL,
  cause TEXT CHECK(cause IN ('EXHAUSTED','MANUAL','OVERRIDE_UNLOCK','REFILLED')), PRIMARY KEY(category_id, period_id, since_ms))
  -- current lock state is the latest row; 'locked' is derivable from Available <= 0 but is materialized so the sensing layer can read it in O(1)

audit_event(seq INTEGER PRIMARY KEY AUTOINCREMENT, id BLOB UNIQUE, at_ms INTEGER NOT NULL,
  actor TEXT CHECK(actor IN ('USER','SYSTEM','IMPORT')), type TEXT NOT NULL,
  entity_type TEXT, entity_id BLOB, payload_json TEXT NOT NULL, prev_hash BLOB, hash BLOB NOT NULL)
  -- append-only: no UPDATE/DELETE triggers allowed (add RAISE(ABORT) triggers)

schema_meta(version INTEGER PK, applied_at INTEGER, app_version TEXT)
backup_run(id PK, at_ms, kind TEXT, destination TEXT, bytes INTEGER, sha256 BLOB, ok INTEGER, error TEXT)
```

Indexes: `txn(category_id, period_id)`, `txn(instrument_id, local_date)`, `txn(status) WHERE status='AUTHORIZED'`, `external_txn(matched_txn_id)`, `audit_event(at_ms)`, `merchant_alias(raw_name)`.

Global invariants: (1) `Σ effective_amount` is recomputed, never stored, except in the per-period snapshot written at close (`allocation_snapshot` optional). (2) A `txn` in a CLOSED period may change `status/settled_amount` (settlement arrives late) but its `period_id`/`local_date` never change; the resulting Available delta is reported as "late settlement" in the closed period and does **not** flow into the open period unless policy is FULL (then it flows through `rollover_in` recomputation, which must be re-run for subsequent periods — see §8.4). (3) Deleting a category requires choosing a successor for its transactions and allocations (Actual's behaviour). (4) `audit_event` hashes chain; verification is part of the export.

---

## 8. Algorithms

### 8.1 Available

```
activity(c, p)      = Σ effective_amount(t) for t in txn where t.category_id = c AND t.period_id = p AND t.status != 'VOIDED' AND t.deleted_at IS NULL
                      (purchases positive, refunds negative)
assigned(c, p)      = allocation.assigned_minor (0 if no row)
rollover_in(c, p)   = 0                                   if policy(c) == RESET or p is the first period
                    = max(0, available(c, prev(p)))       if policy(c) == POSITIVE_ONLY        -- Actual's leftover-pos
                    = available(c, prev(p))               if policy(c) == FULL                  -- Actual's carryover flag
available(c, p)     = assigned(c, p) + rollover_in(c, p) − activity(c, p)
uncovered(p)        = Σ over c with policy POSITIVE_ONLY or RESET of min(0, available(c, p))    -- Actual's last-month-overspent, reporting only in v1
unassigned(p)       = income(p) + unassigned(prev(p)) + uncovered(prev(p)) − Σ assigned(c, p)   -- only if the income layer is enabled (Actual's to-budget, minus buffering)
```

This is Actual's `leftover = budgeted + spent + carry` with Save's sign convention (`spent` positive here, so it is subtracted) and the extra RESET policy.

### 8.2 Worked example A — POSITIVE_ONLY, late tap, tip adjustment, refund

Groceries, policy POSITIVE_ONLY, assigned $600.00 each month (60000). September ended with available = +3750.

- October opens: `rollover_in = max(0, 3750) = 3750`; `available = 60000 + 3750 − 0 = 63750`.
- Oct 3: tap $82.17 Costco → activity 8217 → available 55533.
- Oct 31 23:58 local (America/Los_Angeles; already Nov 1 04:58 UTC): tap $48.20 → `local_date = 20261031` → counts in **October**: available 55533 − 4820 = 50713.
- Nov 2: CSV shows Costco $82.17 posted Oct 5 → exact amount, date +2 → auto-link, `settled = 8217`, no change.
- Dining, policy RESET, assigned 30000. Oct 12: tap $40.00 at a tip-eligible merchant; `estimated_adjustment = 20% = 800` → effective 4800 → available 25200. Feed later shows $47.00 settled → effective 4700 → available 25300 (the $1.00 estimate error returns). Had the feed never arrived, after 14 days the estimate stays (configurable) and the user is prompted at period close.
- Oct 20: Amazon refund $25.00 (kind REFUND, category Shopping) → Shopping activity −2500 → available rises by 2500 in **October** (the period in which the refund posted/was recorded).
- October closes with Groceries available 50713 → November `rollover_in = 50713`; Dining (RESET) → November `rollover_in = 0` regardless of its ending balance.

### 8.3 Worked example B — FULL rollover and covering overspending

Fun Money, policy FULL, assigned 10000; October ends at −2500 (overspent after an override). November: `rollover_in = −2500`, available starts at 7500. The user covers October's overspending in **November** by moving 2500 from Groceries: `assigned(Groceries, Nov) −= 2500`, `assigned(Fun, Nov) += 2500` (clamped to Groceries' current available; Actual's `coverOverspending`), audit events `MONEY_MOVED` + `OVERRIDE_MOVE_MONEY` if it originated from a block screen. October is not edited.

### 8.4 Period close and late settlements

At the first app wake after `end_date_excl` (and lazily whenever a query touches a FUTURE period): create the next period, compute `rollover_in` for every category, write `allocation` rows (copy `default_assigned_minor` or last period's assigned, per setting), mark the old period CLOSED, log `PERIOD_CLOSED`, trigger a backup. If a late settlement changes a CLOSED period's `available(c)`, recompute `rollover_in(c)` for all later periods in order (cheap: one row per category per period) and log the cascade. Materialize `category_lock` for the new period: locked iff `available(c, p) <= 0` and `enforcement_mode == 'BLOCK'`.

### 8.5 Enforcement decision (called by the sensing/blocking layer before the tap completes)

```
predicted = merchant rule if a merchant is known (NFC/HCE context rarely knows the merchant before the tap; usually unknown) else category = user's "default tap category" or NULL
if predicted category is NULL: decision = ALLOW (cannot block what you cannot attribute) unless setting 'block_when_unknown' and any BLOCK-mode category is exhausted
else if enforcement_mode(c) == OFF: ALLOW
else if available(c, p) <= 0 (or < min_expected_spend(c)): BLOCK (or WARN if mode WARN)
record enforcement_decision; on BLOCK show override sheet: JUST_THIS_ONCE (allow, keep lock), MOVE_MONEY(from, amount) (reassign then unlock if available > 0), DISABLE_CATEGORY (mode → WARN for this period)
```

The amount is unknown before the tap, so the block is binary on `available <= 0` (Qube's "Default Zero" semantics), optionally with a per-category `min_expected_spend` so a category with $0.37 left is treated as exhausted.

---

## 9. Transaction state machine

| From | Event | To | Effect on Available |
|---|---|---|---|
| — | Wallet notification parsed (amount, merchant, card) | `AUTHORIZED` (kind PURCHASE, origin WALLET_SENSED, category NULL or rule) | −(authorized + estimated_adjustment) in period(local_date) |
| `AUTHORIZED` | User assigns category (popup) / rule applies | `AUTHORIZED` (category set) | moves the same amount from Uncategorized to the category |
| `AUTHORIZED` | Feed/CSV line matched (exact or tolerant) | `SETTLED` (settled_amount, posted_local_date) | replace estimate with settled; delta in the original period |
| `AUTHORIZED` | Feed shows pending removed with no successor, or user marks "never posted", or `now > occurred + 30 d` with no settlement and user confirms | `VOIDED` | +effective (restored) |
| `AUTHORIZED` | User edits amount (e.g. typed the tip from the receipt) | `AUTHORIZED` (authorized unchanged, `estimated_adjustment` set explicitly) | delta |
| `SETTLED` | Refund line arrives / user records return | new row kind `REFUND`, status `SETTLED`, parent → this | −refund in the refund's period |
| `SETTLED` | Dispute opened; provisional credit line | new row kind `PROVISIONAL_CREDIT`, parent → this; original gets `disputed = 1` | −credit |
| `PROVISIONAL_CREDIT` | Dispute lost; credit reversed | new row kind `ADJUSTMENT` (+amount), parent → credit | +amount |
| any | User deletes | `deleted_at` set (soft) | removed from sums; audit |
| — | Feed/CSV line with no match after 3 days | `SETTLED` (kind PURCHASE, origin IMPORTED) | −amount in period(transacted_date or posted_date) |
| — | Save blocks a tap | *no txn*; `enforcement_decision(BLOCK, override_kind)` | none (until an override leads to a sensed tap, which is then linked) |
| — | Issuer declines (notification says declined) | *no txn*; `enforcement_decision(decision ALLOW, reason 'DECLINED_BY_ISSUER')` or sense log | none |

Derived flags: `refunded_total(t) = Σ children REFUND`; `fully_refunded = refunded_total >= effective_amount`.

---

## 10. Backup recipe (operational)

1. **Snapshot**: `PRAGMA wal_checkpoint(TRUNCATE); VACUUM INTO '<cache>/snapshot.db'` (consistent copy without stopping the app), then `PRAGMA integrity_check` on the copy.
2. **Bundle**: `manifest.json` {app_version, schema_version, created_at, device_tz, row counts, audit head hash} + `snapshot.db` + `transactions.jsonl` (portable mirror) → deflate.
3. **Encrypt**: `SAVEBK1` (§4.2): Argon2id(m=64 MiB, t=3, p=4, salt 16 B) → AES-256-GCM chunked, AAD = header.
4. **Write**: via SAF `DocumentFile.createFile` into the persisted tree URI as `save-YYYYMMDD-HHmm.savebk`; `fsync`; record `backup_run`; prune by retention; optionally upload the same bytes to Drive `appDataFolder` (`files.create` multipart, `parents=["appDataFolder"]`).
5. **Auto Backup rules**: `data_extraction_rules.xml` with `<cloud-backup disableIfNoEncryptionCapabilities="true"><exclude domain="database" path="save.db"/><exclude domain="database" path="save.db-wal"/><exclude domain="database" path="save.db-shm"/><include domain="file" path="backup/latest.savebk"/></cloud-backup>` and the same under `<device-transfer>`; keep `android:fullBackupContent` equivalent for API ≤ 30.
6. **Restore**: pick file (SAF/Drive) → parse header → derive key → decrypt to temp → verify sha256 + `integrity_check` → run migrations forward (never backward; refuse if `schema_version` > app's) → swap DB atomically (`rename`), re-materialize `category_lock` and the current period → log `BACKUP_RESTORED` with the source manifest.
7. **Test matrix**: restore on a fresh install; restore onto a newer schema; restore of a backup made in another time zone (periods must not shift — they are stored as local dates); bmgr local-transport round trip for the Auto Backup path.

---

## 11. Open questions for the user / device tests

1. Which issuers' cards are in Google Wallet today (determines which CSV adapters and whether Capital One's "no pending data" matters)? Does the user want SimpleFIN ($15/yr) in v1?
2. Period scheme: calendar month, or anchored to a pay date? Home-time-zone or device-time-zone month boundaries when travelling?
3. Default rollover policy per category (RESET vs POSITIVE_ONLY), and whether an income/"Ready to Assign" layer is wanted at all.
4. Tip handling: reserve a 20% estimate on tip-eligible merchants, or decrement only the authorized amount and accept a late correction?
5. Device test: confirm that Google Wallet's notification text (amount, merchant, card last4) is stable enough for `sense_fingerprint`, and whether a declined tap produces a distinguishable notification (owned by the sensing research track).
6. Device test: measure Argon2id m=64 MiB/t=3 wall time on the target phone (expect < 1 s; fall back to the 19 MiB/t=2 set if not).
7. Confirm Discover and Chase CSV sign conventions with a real export (sources conflict); confirm Citi `Status` values.

## 12. Negative results and unverified items

- No public API from any US issuer or Google Wallet exposes authorization/settlement linkage to a third-party app; the bank-feed/CSV path is the only way to learn settled amounts (INFERRED from the absence of such APIs in Plaid/Teller/SimpleFIN docs, which all read from the issuer's online banking).
- Visa's and Mastercard's consumer FX-rate pages returned HTTP 403; the "rate on processing date" rule is unverified here.
- Could not load the Android `SecretKeyFactory` algorithm table; PBKDF2 variant availability by API level is unverified (use Argon2id via a library instead).
- Tink: no evidence of password-based key derivation; treat as unsupported.
- Plaid per-Item prices are not published; only plan structure is.
- SimpleFIN Bridge's underlying aggregator and pending-transaction coverage are not stated on its site (the protocol has `pending=1`; coverage is institution-dependent).
- Drive `appDataFolder` quota accounting is not stated on the current guide page.
- Android 17: API level 37 (VERIFIED), stable release reported as 2026-06-16 (REPORTED — Android Authority; the developer overview page last updated 2026-07-01 still reads as pre-release). Behavior-change pages (last updated 2026-10-16) list nothing affecting storage/backup for this topic; relevant items for other tracks: per-app Keystore key limit (50,000 for apps targeting 37), `ACCESS_LOCAL_NETWORK` runtime permission, implicit URI grant restrictions announced for Android 18, BAL restrictions extended to `IntentSender`.
- Web-search quota exhausted before confirming: YNAB targets page wording, Qube's old card discontinuation date, GoCardless BAD sign-up status on GoCardless's own site.

---

## Sources

Primary (vendor docs, code, standards):

- Actual Budget source (master, read 2026-10-17): https://raw.githubusercontent.com/actualbudget/actual/master/packages/loot-core/src/server/budget/envelope.ts ; .../budget/base.ts ; .../budget/actions.ts ; .../accounts/sync.ts ; .../aql/schema/index.ts ; .../models.ts ; .../shared/months.ts ; https://raw.githubusercontent.com/actualbudget/actual/master/packages/crdt/src/crdt/timestamp.ts ; migrations list https://api.github.com/repos/actualbudget/actual/contents/packages/loot-core/migrations
- Actual Budget docs: https://actualbudget.org/docs/budgeting/ ; https://actualbudget.org/docs/budgeting/categories ; https://actualbudget.org/docs/budgeting/returns-and-reimbursements ; https://actualbudget.org/docs/budgeting/credit-cards ; https://actualbudget.org/docs/budgeting/multi-currency ; https://actualbudget.org/docs/advanced/bank-sync ; https://actualbudget.org/docs/experimental/goal-templates ; https://actualbudget.org/docs/experimental/budget-analysis-report
- YNAB support (Markdown mirrors, last updated Sept 2026): https://support.ynab.com/en_us/overspending-in-ynab-a-guide-ryWoxEyi.md ; https://support.ynab.com/en_us/credit-card-overspending-an-overview-HkMGpSbJs.md ; https://support.ynab.com/en_us/when-the-month-rolls-over-a-guide-rkyyd6qC9.md ; https://support.ynab.com/en_us/when-ready-to-assign-is-negative-an-overview-HylZA0zCc ; YNAB OpenAPI spec https://api.ynab.com/papi/open_api_spec.yaml
- Qube Money: https://qubemoney.com/ ; https://qubemoney.com/pricing
- Stripe docs: https://docs.stripe.com/payments/extended-authorization ; https://docs.stripe.com/payments/overcapture
- Plaid: https://plaid.com/docs/account/billing/ ; https://plaid.com/docs/transactions/transactions-data/ ; https://plaid.com/docs/api/products/transactions/ ; https://support.plaid.com/hc/en-us/articles/16110110883479 ; https://support.plaid.com/hc/en-us/articles/16194695660311
- Teller: https://teller.io/ ; https://teller.io/docs/api/account/transactions
- SimpleFIN: https://beta-bridge.simplefin.org/ ; https://beta-bridge.simplefin.org/info/developers ; https://www.simplefin.org/protocol.html
- GoCardless Bank Account Data: https://docs.gocardless.com/bank-account-data/overview ; https://gocardless.com/bank-account-data/
- Mastercard Open Finance onboarding: https://developer.mastercard.com/open-finance-us/documentation/onboarding/ ; Akoya: https://docs.akoya.com/docs/guide-for-production-access
- Amazon Pay FAQ (charges at shipment, auth holds): https://pay.amazon.com/help/69871
- Chase foreign transaction fees: https://www.chase.com/personal/credit-cards/education/basics/foreign-transaction-fees
- Firefly III data importer: https://docs.firefly-iii.org/how-to/data-importer/import/third-party-providers/ ; community configs https://github.com/firefly-iii/import-configurations (us/chase/default.json, us/citi/default.json)
- amex2qif README (Amex CSV layouts): https://github.com/jmcameron/amex2qif ; mojito README (Capital One CSV sample): https://github.com/sierraa/mojito
- RFC 9562 (UUIDv7): https://www.rfc-editor.org/rfc/rfc9562.html ; RFC 9106 (Argon2): https://www.rfc-editor.org/rfc/rfc9106.html ; OWASP Password Storage Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html
- Kotlin: https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/-companion/generate-v7.html ; https://kotlinlang.org/docs/uuids.html ; kotlinx-datetime README https://github.com/Kotlin/kotlinx-datetime
- Android: https://developer.android.com/identity/data/autobackup ; https://developer.android.com/guide/topics/data/testingbackup ; https://developer.android.com/kotlin/multiplatform/room ; https://developer.android.com/jetpack/androidx/releases/room ; https://developer.android.com/jetpack/androidx/releases/room3 ; https://developer.android.com/about/versions/17 ; https://developer.android.com/about/versions/17/behavior-changes-all ; https://developer.android.com/about/versions/17/behavior-changes-17 ; https://developer.android.com/reference/kotlin/androidx/security/crypto/package-summary ; AOSP FBE https://source.android.com/docs/security/features/encryption/file-based
- SQLDelight: https://github.com/sqldelight/sqldelight/releases ; https://sqldelight.github.io/sqldelight/2.1.0/multiplatform_sqlite/migrations/ ; https://sqldelight.github.io/sqldelight/2.1.0/android_sqlite/ ; AndroidSqliteDriver API https://sqldelight.github.io/sqldelight/2.1.0/2.x/drivers/android-driver/app.cash.sqldelight.driver.android/-android-sqlite-driver/index.html
- SQLCipher for Android README: https://github.com/sqlcipher/sqlcipher-android ; Zetetic tutorial https://www.zetetic.net/sqlcipher/sqlcipher-for-android/
- Google Drive appDataFolder: https://developers.google.com/workspace/drive/api/guides/appdata ; Tink FAQ https://developers.google.com/tink/faq

Secondary / reported:

- Goodbudget forums: https://forums.goodbudget.com/t/possible-to-have-only-positive-balances-rollover/879 ; https://forums.goodbudget.com/t/do-monthly-envelopes-roll-over/1240 ; https://forums.goodbudget.com/t/rollover-question/3066 ; https://goodbudget.com/blog/2013/12/fill-from-income/
- Visa restaurant chip acceptance guide (2019 PDF): https://usa.visa.com/content/dam/VCOM/regional/na/us/run-your-business/documents/chip-payment-accept-restaurants-feb2019.pdf ; Shift4 restaurant auth/settlement: https://docs.shift4.com/guides/core-concepts/restaurant-authorization-and-settlement-flow ; Cardfellow tips article: https://www.cardfellow.com/blog/tips-credit-card-affect-restaurant
- Fuel holds: https://www.thedrive.com/news/psa-gas-stations-charging-175-to-cards-when-swiping-at-the-pump ; https://www.kbb.com/car-news/gas-stations-can-now-place-175-bank-hold ; https://www.olyfed.com/news/visa-changes-card-limits-at-the-gas-pump
- Holds/refunds/chargebacks: https://nerdwallet.com/credit-cards/learn/how-long-do-pending-transactions-on-a-credit-card-take ; https://wallethub.com/answers/cc/how-long-does-a-credit-card-authorization-last-2140697276/ ; https://www.bankrate.com/credit-cards/advice/how-do-credit-card-refunds-work ; https://chargebacks911.com/chargebacks/provisional-credit/provisional-credit-timelines/ ; https://www.usbank.com/customer-service/knowledge-base/KB0248568.html
- CSV layouts: https://tiller.com/export-capital-one-transactions/ ; https://tiller.com/export-citibank-transactions/ ; https://tiller.com/export-discover-transactions/ ; https://beancount.io/tools/csv-to-beancount/amex ; https://beancount.io/tools/csv-to-beancount/citi ; https://beancount.io/tools/csv-to-beancount/discover ; https://forum.manager.io/t/credit-card-download-transaction-vs-posting-date-reconcile-problem/58134 ; https://invoicedataextraction.com/blog/chase-ink-business-statement-to-excel
- Teller free tier via Rutter guide: https://docs.rutter.com/platforms/banking/teller ; https://www.openbankingtracker.com/guides/free-open-banking-apis
- SimpleFIN price/anecdotes: https://github.com/duplaja/actual-simplefin-sync ; https://lemmy.fosterhangdaan.com/post/70632
- EncryptedSharedPreferences deprecation: https://blog.includesecurity.com/2026/08/encryptedsharedpreferences-is-dead-heres-what-you-should-use-instead/ ; https://proandroiddev.com/goodbye-encryptedsharedpreferences-a-2026-migration-guide-4b819b4a537a
- Libraries: argon2kt https://github.com/lambdapioneer/argon2kt ; lazysodium-android https://github.com/terl/lazysodium-android ; https://central.sonatype.com/artifact/com.goterl/lazysodium-android ; SQLCipher releases https://discuss.zetetic.net/t/sqlcipher-for-android-4-14-1-community-edition-release/7190
- Android 17 release reporting: https://androidauthority.com/android-17-release-date-3639790 ; https://9to5google.com/2026/02/14/android-17-schedule/
- YNAB pay-cycle characterization: https://getfinny.app/blog/budget-apps-custom-month-start ; https://support.ynab.com/en_us/how-to-adjust-your-plan-on-any-pay-cycle-HkpGZdW1o.md (not opened)
- Room vs SQLDelight opinion pieces (2025–2026): https://proandroiddev.com/which-local-database-should-you-choose-in-2025-comparing-realm-sqldelight-and-room-4221b354c899 ; https://docs.bswen.com/blog/2026-03-14-room-vs-sqldelight-kmp
