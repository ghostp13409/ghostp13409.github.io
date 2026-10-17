# Research appendix: bank / card-issuer alerts as a second (authoritative) purchase source on Android

Project: **Save** (personal budget-enforcement app, Android, sideloaded, local-first)
Topic: issuer push / SMS / email purchase alerts as a source of amount + merchant + card; parser and dedupe design
Research date: 2026-10-17. Platform baseline: Android 16 (API 36) stable since 2025-06-10; **Android 17 (API 37) stable since 2026-06-16** (Android Authority report; Google's "Behavior changes: all apps" page for Android 17 exists and was last updated 2026-10-16).
Author of this appendix: research sub-agent (senior Android platform researcher role). Another AI session will build from this; precision over brevity.

## 0. How to read the verification tags

- **VERIFIED** – read in a primary source (developer.android.com, AOSP code, issuer's own help page, Google support page) during this research; URL in Sources.
- **REPORTED** – secondary/anecdotal (forums, blogs, vendor pages, open-source fixtures contributed by real users). Usually right, but confirm on device.
- **INFERRED** – my reasoning from VERIFIED/REPORTED facts. Not a fact.
- **RECOLLECTED / UNVERIFIED** – a wording I remember seeing but could not confirm this session. Treat as a *hypothesis to capture on-device*, never as a fixture.

Research constraints that affect confidence: reddit.com is blocked for our crawler, Play Store listings return truncated HTML (package names were verified by HTTP title scraping instead), several issuer help pages (Visa FAQ, Amex US SMS page, Barclays US, Citi US) returned 403/404, and the web-search budget ran out before every issuer's verbatim wording could be hunted down. The single most valuable discovery was that the open-source **PennyWise** parser project (`sarim2000/pennywiseai-tracker`, AGPL-3.0) ships *user-contributed US fixtures* for Chase, Citi, Discover, Navy Federal, Huntington, Schwab and several credit unions — those are quoted verbatim below (tagged REPORTED).

---

## 1. Executive summary (what the architecture can and cannot rely on)

1. **Bank alerts are an authorization-time feed for card-present taps.** Wells Fargo states transaction alerts are sent "within minutes" *at authorization, not posting*, and that they carry the merchant's *initial authorization amount* (a restaurant tip "may not be included") — VERIFIED. Visa Purchase Alerts are "near real-time" — VERIFIED. Credit unions on vendor fraud platforms quote "within one minute" — VERIFIED (CUSoCal). Chase's generic alerts page says most account alerts are "processed at the end of each business day" but "some alerts are sent immediately after a transaction" — VERIFIED; the per-transaction "transaction higher than the limit you set" alert is in the immediate class per user reports — REPORTED. Barclays US is the known laggard: forum users report alerts only when the charge *posts* (up to 24 h; e-mails 3–4 days later) — REPORTED.
2. **Push (bank app notification) is the best channel on Android; SMS is the best fallback; e-mail is reconciliation only.** A `NotificationListenerService` sees bank-app pushes, Google Wallet's own "Transactions" notification, *and* the SMS app's notification for a bank text, all with one grant. Direct SMS access (`RECEIVE_SMS`) is legal and works for a non-default-SMS sideloaded app (Play's default-handler policy does not apply to sideloads) — VERIFIED (AOSP javadoc + Android Developers "default handlers" page).
3. **Three Android platform hazards are real and must be designed around (all VERIFIED in AOSP / developer docs):**
   - **Android 15+ sensitive-notification redaction.** Notifications the Notification Assistant flags as containing an OTP are delivered to *untrusted* listeners with the body replaced by a "sensitive notification content hidden" string and `EXTRA_TEXT_LINES` removed. "Trusted" = holds `android.permission.RECEIVE_SENSITIVE_NOTIFICATIONS` (protection `signature|role`), or is platform-signed, or has the `RECEIVE_SENSITIVE_NOTIFICATIONS` app-op allowed, or has a CompanionDeviceManager association. Plain purchase alerts are unlikely to trip the AOSP OTP heuristics (they require an OTP-shaped token *plus* an English context word such as "code", "verify", "pin", "access", "log in" within 50 characters), but fraud-verification texts ("...card ending in 1234? Reply YES... to verify") plausibly will. Pixel devices use Android System Intelligence as the assistant, whose heuristics may differ from AOSP's ExtServices implementation.
   - **Restricted settings / Enhanced Confirmation Mode (Android 13+, widened in 15/16).** Notification-listener access (`OPSTR_ACCESS_NOTIFICATIONS`) and the SMS permissions are "protected settings"; an app installed with package source `LOCAL_FILE` or `DOWNLOADED_FILE` (typical file-manager/browser sideload) is "guarded" until the user taps *Allow restricted settings* in App info. ADB installs have no installing package / unspecified source and are reported to bypass the gate (REPORTED, consistent with the code).
   - **Android 17 SMS OTP delay.** For apps targeting API 37+, standard SMS judged to contain an OTP are withheld for 3 hours (`SMS_RECEIVED_ACTION` withheld, provider queries filtered). WebOTP/SMS-Retriever-format messages are withheld for all apps regardless of target. Bank purchase texts are not OTPs, but the detector is heuristic — keep `targetSdk = 36` for the SMS path until tested.
4. **No issuer sends an "amount changed" alert.** Pending→posted deltas (tips, fuel pre-auth, hotel incidentals) are silent; Capital One says transactions "usually post within 72 hours, but sometimes it can take up to 5 days" — VERIFIED. The budget ledger therefore needs an explicit AUTH→POST reconciliation state, not just "a transaction happened".
5. **Chase retired two alert types on 2026-02-17** ("International charge posted", "Online, phone or mail charge authorized") — VERIFIED via quoted notice. Card-present tap alerts and the user-set threshold alert remain. Online/recurring charges will no longer alert at Chase unless the threshold alert catches them.
6. **Fixtures must be captured on the user's own phone.** Only Chase, Citi, Discover, NFCU, Huntington, Schwab and a few CU formats have verbatim samples here. Amex, Capital One, BofA, Wells Fargo, U.S. Bank, Barclays, Synchrony wording is *not verified*. The parser must be fixture-driven with a built-in "capture mode" and a teach-the-parser flow; see §6–7.

---

## 2. Channel mechanics on Android (sideloaded app, no root)

### 2.1 NotificationListenerService (bank app push, Google Wallet, SMS app notifications)

- API: `android.service.notification.NotificationListenerService` (API 18+). Declare `<service android:permission="android.permission.BIND_NOTIFICATION_LISTENER_SERVICE">` with `<intent-filter><action android:name="android.service.notification.NotificationListenerService"/></intent-filter>`. User grants in *Settings → Notifications → Device & app notifications* (path varies by OEM) — standard, VERIFIED by API docs (not re-fetched this session).
- **One-time ADB grant (VERIFIED command exists in AOSP `NotificationShellCmd.java`):**
  `adb shell cmd notification allow_listener <package>/<fully.qualified.ServiceClass> [user_id]`
  (`disallow_listener` reverses; `allow_assistant` exists for NAS). INFERRED: this writes the enabled-listeners setting directly and therefore sidesteps the Settings UI's restricted-settings check; verify on device.
- **Text extraction** (what PennyWise does and what Android exposes): read `sbn.notification.extras` keys `EXTRA_BIG_TEXT`, `EXTRA_TEXT_LINES` (InboxStyle), `EXTRA_TEXT`, `EXTRA_SUMMARY_TEXT`, fallback `EXTRA_TITLE`. For MessagingStyle (Google Messages, Samsung Messages) use `Notification.MessagingStyle.Message.getMessagesFromBundleArray(extras.getParcelableArray(EXTRA_MESSAGES))` (API 30+) and also `EXTRA_HISTORIC_MESSAGES`; each `Message.getText()` is one SMS/RCS body, `getSenderPerson()` gives the sender — VERIFIED (API reference). Skip `FLAG_GROUP_SUMMARY` notifications. Expect **repeat `onNotificationPosted` calls for the same notification** (grouping, updates, "silent re-posts"): dedupe on `sbn.key` + content hash.
- **Unicode hazards (REPORTED, Automate forum):** real notification bodies contain non-ASCII characters (non-breaking spaces U+00A0, narrow NBSP U+202F before "PM", bullets "•", curly quotes); regexes written against typed samples fail. Normalize (NFKC, collapse whitespace) before matching.
- **Restricted settings / ECM (VERIFIED in AOSP `packages/modules/Permission/.../EnhancedConfirmationService.java`):** `PROTECTED_SETTINGS` includes `SEND_SMS, RECEIVE_SMS, READ_SMS, RECEIVE_MMS, RECEIVE_WAP_PUSH, READ_CELL_BROADCASTS, permission_group.SMS, BIND_DEVICE_ADMIN, OPSTR_BIND_ACCESSIBILITY_SERVICE, OPSTR_ACCESS_NOTIFICATIONS, OPSTR_SYSTEM_ALERT_WINDOW, OPSTR_GET_USAGE_STATS, OPSTR_LOADER_USAGE_STATS, ROLE_DIALER, ROLE_SMS` (+ `REQUEST_INSTALL_PACKAGES` behind a flag). `isPackageEcmGuarded()`: pre-installed / allow-listed apps are never guarded; a package whose `InstallSourceInfo.getPackageSource()` is `PACKAGE_SOURCE_LOCAL_FILE` (3) or `PACKAGE_SOURCE_DOWNLOADED_FILE` (4) is **always guarded**; otherwise exempt if the immediate installer is pre-installed or an allow-listed installer, or if the device defines no trusted installers at all (AOSP default). The Settings notification-access toggle calls `checkEcmRestrictionAndSetDisabled` when `extendEcmToAllSettings()` is on (VERIFIED, `ApprovalPreferenceController.java`). User escape hatch (VERIFIED Google support page): *Settings → Apps → [app] → More (⋮) → Allow restricted settings*. ADB installs: package source unspecified and no installing package — community reports say they are not guarded (REPORTED); recommended install path for Save is `adb install` or a session-based installer such as F-Droid/Obtainium that does not tag the source as a local/downloaded file (INFERRED).
- **Android 15+ sensitive-content redaction (VERIFIED):**
  - Behavior-changes page (Android 15, all apps): "Android will stop untrusted apps that implement a `NotificationListenerService` from reading unredacted content from notifications where an OTP has been detected. Trusted apps such as companion device manager associations are exempt from these restrictions."
  - `Adjustment.KEY_SENSITIVE_CONTENT` javadoc: "In VANILLA_ICE_CREAM, sensitive notification content is redacted from updates to most NotificationListenerServices"; also blocks screen-share of that app's windows.
  - `NotificationManagerService.isAppTrustedNotificationListenerService()`: trusted if `checkUidPermission(RECEIVE_SENSITIVE_NOTIFICATIONS) == GRANTED` **or** `isPlatformSigned(pkg)` **or** `appOps.noteOpNoThrow(OP_RECEIVE_SENSITIVE_NOTIFICATIONS, …) == MODE_ALLOWED` **or** the package has a non-revoked `CompanionDeviceManager` association for the user. Permission is declared `signature|role` in `core/res/AndroidManifest.xml` (@SystemApi, hidden) — a sideloaded app cannot hold it.
  - `redactStatusBarNotification()`: title → app label; text → `R.string.redacted_notification_message`; sub-text, `EXTRA_TEXT_LINES`, big icon removed; actions retitled; MessagingStyle/BigTextStyle bodies replaced. So a redacted bank push is recognisable (title == app label, body == the fixed string) — the app should detect it and fall back to SMS/e-mail/Wallet for that event.
  - Detection (AOSP default assistant, `packages/modules/ExtServices/.../NotificationOtpDetectionHelper.java`, `@RequiresApi(VANILLA_ICE_CREAM)`): `shouldCheckForOtp()` is true if category ∈ {MESSAGE, EMAIL, SOCIAL} or style ∈ {MessagingStyle, InboxStyle, BigTextStyle} or a quick regex finds an OTP-shaped token (`START` + [5–8 alphanumerics with ≥1 digit, optional dashes | exactly 4 digits | `ddd ddd`] + `END`). Then `containsOtp(text, checkForFalsePositives=true, tc)`: drop matches that are dash-dates or 10-digit phone numbers; if the language is identified (TextClassifier, threshold 0.6) and an English regex exists, **require an English context word within 50 chars of the token in the same/previous sentence**: `pin, pass(code|word), TAN, otp, 2fa, (two|2)-factor, log-in/login, auth/authenticate/authentication, code, secret, verify/verification, one-time, access, validate/validation`. Text checked: title, text, sub-text, big text, big title, summary, text lines, MessagingStyle messages (first 600 chars).
  - INFERRED consequences: "Citi Alert: A $3.01 transaction was made at BP#1234E on card ending in 1234. View details at citi.com/citimobileapp" contains a 4-digit token ("1234") but no context word → not sensitive on AOSP heuristics. "Did you attempt transaction on card ending 0000 at Merchant in WA for $25.62 Reply YES or NO" → no context word → not sensitive. A fraud text that says "to verify" or a Chase push that says "sign in" is still fine ("sign in" is not in the list; "log in" is). Alerts that mention "access your account" or "verification" within 50 chars of a last-4 **will be redacted**. Pixel's ASI may use a stricter/different model — REPORTED (Android Authority) that ASI does the classification on Pixels; treat redaction of any bank alert as possible and detect it at runtime.
  - Mitigations to test (INFERRED from the trust check): (a) `adb shell appops set <pkg> RECEIVE_SENSITIVE_NOTIFICATIONS allow` — if the op is shell-settable this makes the listener trusted with one ADB command; (b) create a CDM association (`CompanionDeviceManager.associate()` with the user's earbuds/watch) — makes the package trusted while the association exists; (c) accept redaction and recover via SMS/e-mail/Wallet.

### 2.2 Direct SMS (RECEIVE_SMS / READ_SMS)

- VERIFIED (AOSP `Telephony.java` javadoc, main branch): "Only the default SMS app … is able to write to the SMS Provider … and only the default SMS app receives the `SMS_DELIVER_ACTION` broadcast". "Other apps that are not selected as the default SMS app can only *read* the SMS Provider, but may also be notified when a new SMS arrives by listening for the `SMS_RECEIVED_ACTION` broadcast, which is a non-abortable broadcast that may be delivered to multiple apps." `SMS_RECEIVED_ACTION` = `"android.provider.Telephony.SMS_RECEIVED"`, extras `"pdus"` (Object[] of byte[]) + `"format"`; decode with `Telephony.Sms.Intents.getMessagesFromIntent(intent)`; requires `android.permission.RECEIVE_SMS` (dangerous/runtime). `ACTION_CHANGE_DEFAULT` "is no longer supported since Q, please use `RoleManager.createRequestRoleIntent(RoleManager.ROLE_SMS)`" — irrelevant for Save, which should **not** become the default SMS app.
- Google Play's "default handler" restriction is a **Play policy**, not an OS rule: the Android Developers page scopes it to apps "distributed on the Google Play Store" — VERIFIED. A sideloaded app may declare `RECEIVE_SMS`/`READ_SMS`; the OS gates them only by the runtime prompt and (for file-sideloads) ECM.
- One-time ADB alternative to the runtime prompt: `adb shell pm grant <pkg> android.permission.RECEIVE_SMS` and `… android.permission.READ_SMS` (standard `pm grant` for dangerous permissions; well-known, not re-verified this session).
- Historic backfill: query `content://sms/inbox` (`Telephony.Sms.Inbox.CONTENT_URI`) with `READ_SMS` filtering `address IN (short codes)` and `date > lastSync` — standard; this is what PennyWise's `OptimizedSmsReaderWorker` does (REPORTED by file name only).
- **Android 17 (VERIFIED, both behavior-changes pages):** all apps — WebOTP-format and SMS-Retriever-format messages are withheld 3 h from non-intended recipients ("the `SMS_RECEIVED_ACTION` broadcast is withheld and SMS provider database queries are filtered"); apps targeting API 37+ — the same 3-hour hold applies to *standard* SMS "containing an OTP". Exempt: default SMS app, SMS assistant, CDM companion apps. Bank purchase alerts are not OTPs, but "card ending in 1234" is an OTP-shaped token; until the standard-SMS detector is characterised, build with `targetSdkVersion 36` (a sideloaded app has no store-imposed target floor) and add a test that a synthetic Citi-style text arrives within seconds.
- **Android 16 (VERIFIED):** no SMS/notification-listener changes; relevant: ordered-broadcast priority is no longer honoured across processes (irrelevant for non-abortable `SMS_RECEIVED`), JobScheduler quotas tightened (keep the listener/ingest path off JobScheduler; use the listener's own process + WorkManager only for retries).
- **Android 15 (VERIFIED):** force-stopped apps lose pending intents until next launch; `ACTION_BOOT_COMPLETED` is redelivered when the app leaves the stopped state — re-register alarms/receivers there. Background network calls outside a valid process lifecycle throw — do e-mail polling from WorkManager or a foreground service.

### 2.3 RCS pitfalls

- REPORTED (Samsung developer forum, Verizon/community posts): RCS "chat" messages are *not* written to `content://sms`; Samsung Messages stores them in `content://im/chat`; no `SMS_RECEIVED`/`WAP_PUSH_RECEIVED` broadcast fires; Samsung says RCS "is not open to third-party developers". Google Messages likewise keeps RCS in its own database (bugle) — REPORTED/INFERRED; no public read API.
- Practical impact: **none today for US issuer alerts**, which arrive as SMS from short codes (vendor and bank materials; no US bank found using RCS Business Messaging for alerts — negative result). If an issuer ever moves alerts to RBM, the only capture path is the Messages app's *notification* via the listener (MessagingStyle messages), which is subject to §2.1 redaction. Design the SMS ingest so that the Messages-app notification is an alternate source of the same `BANK_SMS` event (dedupe by body hash), not a separate event type.
- Google Messages blocks RCS on rooted/unlocked-bootloader phones (REPORTED, 2024) — irrelevant for a no-root design, but note that Play Integrity-sensitive apps may also behave differently if the user later roots.

### 2.4 Google Wallet transaction notification (dedupe peer, not primary)

- REPORTED (9to5Google 2023-10/2023-12/2024-06): after tap-to-pay, a notification arrives "a few minutes later" summarising merchant name, amount and card used; historically posted by Google Play services, moving to the Wallet app (`com.google.android.apps.walletnfcrel`) with Play services 23.39+; Wallet 23.46 added channels "Transactions" ("Get notified after you make a purchase or use a pass"), "Updates & alerts", "Offers & rewards", "Tips". Verbatim title/body **not found** — capture on device (first fixture to collect). Wallet's own transaction list and notification wording is covered by the sibling "sensing via Wallet" research topic; here it matters only as a dedupe peer.
- INFERRED caveat: Wallet shows the card as "Visa •••• 1234" using the *funding card's* last 4 in the Wallet UI, while the merchant receipt shows the *device token* (DPAN) last 4; bank alerts use the funding card (FPAN) last 4. Confirm which digits appear in the Wallet notification before using last-4 as a hard dedupe key against bank alerts.

### 2.5 E-mail alerts (Gmail API / IMAP)

- Gmail API push (VERIFIED, developers.google.com): "Typically, Cloud Pub/Sub delivers notifications within a few seconds"; "in rare situations, notifications might be delayed or dropped"; one event/second per user max; `users.watch` must be renewed at least every 7 days (recommend daily); Pub/Sub payload is only `{"emailAddress", "historyId"}` → call `users.history.list(startHistoryId)`; Google says for installed/mobile apps "the poll-based *Synchronize clients with Gmail* guide is still the recommended approach". Pub/Sub topics live in a Google Cloud project → push needs a server; a phone can only *pull* via `history.list`.
- Quotas (VERIFIED): 6,000 quota units/min/user/project; `history.list` = 2 units, `messages.list` = 5, `messages.get` = 20 (60 for full/raw), `watch` = 100. Polling `history.list` every 10 s costs 12 units/min — trivial.
- OAuth hazard (VERIFIED): an external-type consent screen in **"Testing"** status issues refresh tokens that expire after **7 days**; also 100 live refresh tokens per account per client, 6-month inactivity expiry, and password changes revoke Gmail-scope tokens. For a personal app either publish the consent screen (restricted `gmail.readonly` scope → verification, or stay "unverified" with the warning screen), or accept weekly re-auth, or use IMAP.
- IMAP (VERIFIED): basic-auth to Gmail IMAP ended 2025-03-14 ("CalDAV, CardDAV, IMAP, SMTP, and POP will no longer work with legacy passwords… with the exception of app passwords"); app passwords require 2-Step Verification and are unavailable with security-key-only 2SV, Advanced Protection, or managed accounts; Gmail IMAP advertises `IDLE` and `AUTH=XOAUTH2` in its CAPABILITY sample. An IMAP IDLE connection from a foreground service gives near-instant e-mail delivery without a cloud project, at the cost of a persistent socket.
- Issuer-side latency makes e-mail a *reconciliation* channel: Chase processes most account alerts "at the end of each business day" (VERIFIED), Barclays e-mails arrive "3 to 4 days after charges posted" (REPORTED), Discover's merchant-refund e-mail exists but timing unknown (REPORTED, old). Use e-mail for: posted-amount corrections (tips), refunds, statement-level truth; not for the pop-up.

### 2.6 Aggregators (negative result / context)

Firefly III's data importer and Actual Budget import CSV/OFX or sync via GoCardless/SimpleFIN-style aggregators; neither parses notifications or SMS (their import pipelines are file/bank-API based) — negative result for prior art. Aggregator latency is typically a day or more (Finny blog, REPORTED). Out of scope for SENSE, viable as a T+1 truth source later.

---

## 3. Issuer catalogue

Package names were **VERIFIED** by fetching each Play Store listing's `<title>` (HTTP 200): Chase Mobile `com.chase.sig.android`; Amex `com.americanexpress.android.acctsvcs.us`; Capital One Mobile `com.konylabs.capitalone`; Citi Mobile `com.citi.citimobile`; Discover Mobile `com.discoverfinancial.mobile`; Bank of America Mobile Banking `com.infonow.bofa`; Wells Fargo Mobile `com.wf.wellsfargomobile`; U.S. Bank Mobile Banking `com.usbank.mobilebanking`; Barclays US `com.barclaycardus`; MySynchrony `com.syf.mysynchrony` (credit cards) and Synchrony Bank `com.syf.synchronybank`; Google Wallet `com.google.android.apps.walletnfcrel`; Google Messages `com.google.android.apps.messaging`; Samsung Messages `com.samsung.android.messaging` (not on Play — 404 — but the package name is the well-known one). PennyWise additionally maps Huntington `com.huntington.m` and Chase UK `com.chase.intl` (REPORTED).

Alert names below are the issuers' own where VERIFIED. "Sample" = verbatim text with its tag. "Configure" = what the user must do.

### 3.1 Chase (credit cards)
- Channels: e-mail, text, push (VERIFIED). Setup: app → person icon → **Alerts & messages** → **Manage alerts**; web → Profile & settings → Alerts → *Choose alerts* per account; *Alerts delivery*; *Pause alerts* (VERIFIED).
- Alert types (VERIFIED page wording): "a charge, refund or other transaction on your account"; balance/available credit; payment due/posted; "unusually high transaction" (enroll); fraud alerts (automatic). The per-transaction alert is configured as a dollar threshold ("notifies you if a card transaction is higher than the limit you set") — set it to **$1** (REPORTED advice; whether $0 is accepted is unverified).
- **2026-02-17 change (VERIFIED quoted notice):** "We're writing to let you know that we're retiring alerts you're signed up for… starting February 17, 2026" — retired: **"International charge posted"** and **"Online, phone or mail charge authorized"**; "You'll continue to receive your other enrolled alerts". Consequence: online/recurring/phone charges only alert via the threshold alert (and the threshold alert's coverage of card-not-present charges is unverified).
- Timing: "Generally, account alerts are processed at the end of each business day… some alerts are sent immediately after a transaction" (VERIFIED). Users describe transaction alerts as arriving within seconds of approval (REPORTED).
- SMS short codes: **24273** for account/transaction alerts (REPORTED — PennyWise fixture sender); **72166** for fraud alerts (REPORTED, multiple sources); fraud e-mails from `chase@fraudalert.chase.com` (REPORTED).
- Samples (REPORTED, PennyWise user-contributed fixture, 2026):
  `Rapid Rewards Plus Visa: You made a $9.17 transaction with TACO BELL 740493 on Mar 17, 2026 at 1:56 PM ET.` (sender 24273)
  Template: `{card_product}: You made a {amount} transaction with {merchant} on {Mon D, YYYY} at {h:mm AM/PM} {TZ}.`
  Refund pattern per the same parser's doc comment: `{card_product}: A $X.XX refund was posted…` (REPORTED, wording incomplete).
  Decline (REPORTED, single forum user, treat as illustration): `We declined $52.50 at starbucks store for the card ending in xxxx.`
  Note: no card last-4 in the purchase SMS — the **card product name** is the card identifier at Chase. Push-notification wording from `com.chase.sig.android` is UNVERIFIED (RECOLLECTED: same sentence without the product prefix, title "Chase"); capture it.

### 3.2 American Express (US)
- Setup (VERIFIED Amex support text): "Log into Amex App and select appropriate Card, tap 'Account' on the bottom right corner, tap 'Notifications', then toggle each notification type on or off"; "if you turn on purchase alerts, you will be notified when a charge is made on your Card". Additional card members set their own alerts (VERIFIED, UK page).
- Short codes: Canada page lists Account Alerts **26931**/26391 and Credit Alerts **26390** (VERIFIED for Canada; the US SMS page returned a header-overflow error — US codes UNVERIFIED).
- Timing: "real-time Card activity" (VERIFIED UK FAQ wording); US cardholders report instant pushes (REPORTED).
- Samples: **none verified for the US.** PennyWise's AMEX parser is India-only (`Alert: You've spent INR 1,017.70 on your AMEX card ** 91000 at VOUCHER PLAT on 20 August 2025`). RECOLLECTED/UNVERIFIED US shapes to look for: a "Large Purchase Approved" e-mail/push family, "Purchase Approved" pushes, and Amex's five-digit "Card ending in 1-01234" account format. Capture.

### 3.3 Capital One
- Alert name (VERIFIED): **"Transaction made above $_"** under *Alerts & Notifications* → [card]; channels push / email / SMS; "Choose a desired dollar amount minimum… choosing $1 is great for tracking most all purchases". Finny's blog calls it "Instant Purchase Notification with a $0 minimum" (REPORTED, conflicts on the minimum). Capital One markets "push notifications … every time a purchase is made with your card" (VERIFIED).
- Other alert types (VERIFIED descriptions, no wording): Eno "credit back" alert when a merchant credits money back; duplicate-charge alert (two identical charges, same merchant, same day) by e-mail/push; Eno decline explanations in real time; one notification per declined attempt (REPORTED, UK ombudsman case).
- Fraud text sample (VERIFIED on capitalone.com): `Hi, it's Eno from Capital One. Did you just try to make a purchase at Salad Savvy with your card ending in 1234?`
- Short code 227898 (REPORTED, third-party list). Purchase-alert wording UNVERIFIED; capture.

### 3.4 Citi (US)
- Official US alert page not reachable (404); configuration is in Citi Mobile *Alerts*/Account alerts (REPORTED).
- Samples (REPORTED, PennyWise fixtures, sender 692484 or alphanumeric "CITI"):
  `Citi Alert: A $3.01 transaction was made at BP#1234E  on card ending in 1234. View details at citi.com/citimobileapp`
  `Citi Alert: Card ending in 1234 was not present for a $506.39 transaction at WWW Google C. View at citi.com/citimobileapp`
  Templates: `Citi Alert: A {amount} transaction was made at {merchant} on card ending in {last4}. View details at citi.com/citimobileapp` and the card-not-present variant `Citi Alert: Card ending in {last4} was not present for a {amount} transaction at {merchant}. View at citi.com/citimobileapp`. Note the double space before "on" in a real sample and a merchant truncated to ~12 chars ("WWW Google C") — merchant similarity must tolerate truncation.
- Short code 692484 = "MyCiti" text banking (REPORTED, 2010 and current fixture).

### 3.5 Discover
- Setup (VERIFIED): log in → "view and configure your account activity alerts" → per alert choose text, email or both; alert types include purchase alerts, spending alerts, fraud alerts; forum users list "Purchases Outside the US", "Card Not Present" (REPORTED).
- Short code **347268 (DISCOV)** historically; Discover's text-migration notice says "We've sent messages from 347268, but that's going to change for different alert types" (VERIFIED existence of the change, new numbers not listed; replying STOP during migration opts out of all Discover texts).
- Samples (REPORTED, PennyWise fixtures):
  `Discover Card Alert: A transaction of $25.00 at WWW.XXX.ORG on February 21, 2025. No Action needed. See it at https://app.discover.com/ACTVT. Text STOP to end`
  `Discover Card Alert: A transaction of $5.36 at PAYPAL *SParkXXX on July 20, 2025. No Action needed. See it at https://app.discover.com/ACTVT. Text STOP to end`
  Template: `Discover Card Alert: A transaction of {amount} at {merchant} on {Month D, YYYY}. No Action needed. See it at https://app.discover.com/ACTVT. Text STOP to end`. No last-4, no time of day. A merchant-refund e-mail exists (REPORTED, Finovate).

### 3.6 Bank of America
- Alerts page (VERIFIED): "Card charges" alert; "get an email, text, or mobile notification when a charge is made on your credit card"; debit alerts above an amount you set; credit-limit proximity by amount; delivery can be affected by carrier/device settings; no sample text, no short codes on the page.
- Short codes: 35422 (REPORTED, single user post); third-party list gives 73981 (security), 53849 (fraud/Zelle), 322632 (account alerts) (REPORTED). Wording UNVERIFIED; capture.

### 3.7 Wells Fargo (credit cards) — best-documented semantics
- Alert names (VERIFIED): **Single Purchase Amount** (above a chosen amount), **Card Declined**, **Online, Phone or Mail Purchase**, **Foreign Transaction** (USD), **Daily Total Spending**; plus Payment Due / Payment Posted / Approaching Credit Limit. Channels: text, email, push (app users).
- Timing/semantics (VERIFIED): "within minutes of the transaction"; sent **at authorization, not posting** (posting "can take 2 or 3 days"); alerts use "the merchant's initial authorization amount, not the final total. For example, a restaurant tip may not be included, so you may get two alerts but are charged only the final amount"; transactions the merchant never submitted for authorization might not alert; typically one alert per transaction but one purchase can trigger two alert types; alerts depend on merchant-supplied data which can be incomplete (debit FAQ).
- Short code **93557** (VERIFIED: "Reply YES ENROLL to the text message we send from the Wells Fargo shortcode 93557"). Wells Fargo/Visa "Rapid Alerts" historically delivered from VisaNet within seconds (REPORTED, 2008–09 coverage). Wording UNVERIFIED; capture.

### 3.8 U.S. Bank (credit cards)
- Alert names and channels (VERIFIED KB table): **Transaction dollar amount** (text/email), **Card not present** (text/email), **Declined transaction** (text/email/**push**), **Gas station purchase** (text/email), **International transaction** (text/email), **Credit posted** (text/email), **Debit posted** above an amount (text/email), Payment due (text/email/push), Available credit, Balance alert, Statement available, Autopay, etc. Note: **push is offered only for declines and payment-due** — purchase alerts must come by SMS/e-mail at U.S. Bank.
- Focus (prepaid) card flyer sample mentions a point-of-sale hold alert naming the merchant (Walgreens) and the new balance (REPORTED summary; PDF now redirects). Wording UNVERIFIED; capture.

### 3.9 Barclays US
- Official alerts page blocked (403). Forum reports (REPORTED, AARP/myFICO): transaction alerts only after the merchant **posts** (sometimes 24 h later), e-mails 3–4 days late, instant texts only for fraud; one user's Barclays Rewards Mastercard was ineligible for Visa Purchase Alerts (network-level alerts are Visa-only). Treat Barclays-issued cards as **no real-time bank signal**; rely on Wallet + Visa Purchase Alerts (Visa cards) or category pre-assignment.

### 3.10 Synchrony
- No alert documentation retrieved (search budget). Store/co-brand cards; typically not the user's tap card. Package names verified. Mark as "unknown; capture if used".

### 3.11 Credit unions and community banks (vendor-templated alerts)
Most CUs use processor platforms (Fiserv/FIS/CO-OP/PSCU/CSI/Jack Henry) with configurable templates; fields consistently include institution name, card last-4, amount, merchant, sometimes date/time and balance. VERIFIED/REPORTED samples:
- Navy Federal (REPORTED, fixtures; sender NFCU / NAVYFED / 21398): `NFCU: Transaction for $3.26 was approved on debit card 1234 at Google One at 08:19 PM EDT on 05/06/25.Txt STOP to opt-out. Txt HELP for help.`; declines use `…was declined…`; account alert `NFCU: $574.94 was withdrawn from your acct. end. in 1234 . As of 09/30/26 at 04:47 AM ET the available balance is $2500.00. Sign in for details. Txt STOP to stop.`
- Huntington (REPORTED, fixtures; sender 446622; app `com.huntington.m` uses identical wording): `Huntington Heads Up. We processed a debit card withdrawal: $25.00 at Bob Inc. Acct CK0000 has a $10.12 bal (10/19/25 5:43 AM ET).`
- Altana FCU (REPORTED): `Pending charge for $43.92 on 04/24 20:39 CDT at MERCHANT NAME, CITY, ST for Debit Consumer card ending in 1234.` — note explicit **"Pending"** and merchant with city/state suffix.
- AdelFi CU (REPORTED, sender 42141, multiline): `Transaction Alert from AdelFi.\n**1234 had a transaction of ($15.00). Description: 8042999971 P AND F TAX INC        CITY        CAUS. Date: Dec 19, 2025` — amount in parentheses, raw processor descriptor with leading reference number.
- ALECU (REPORTED, sender 39872): `ALEC Alert - A debit transaction from WE EGIES     ;12345 ;AUTOPAY for $177.33 on account *1=01 was posted on Mar 30, 2026. Reply STOP to stop all texts.` — "was posted" (posting-time alert), odd account token.
- Old Hickory CU (REPORTED, sender (877) 590-7589): `A transaction for $27.00 has posted to ACCOUNT NAME (part of ACCOUNT#), which is above the $0.00 value you set.` — no merchant at all.
- Charles Schwab (REPORTED, sender SCHWAB / 24465): `A $7.44 debit card transaction was debited from account ending 1234. Reply STOP to end Schwab Text Alerts.` — no merchant; foreign-currency variants `A €25.50 …`, `A CAD 85.75 …`.
- Fraud-verification shapes (REPORTED/VERIFIED on institution pages): Walden Savings `Did you attempt transaction on card ending 0000 at Merchant in WA for $25.62 Reply YES or NO`; Machias Savings (Pinnacle/2-way) `Did CUSTOMER NAME attempt $4.200.42 at MERCHANT NAME on your Machias Savings Bank credit card ending in XXXX?` and decline e-mail `A recent transaction by CUSTOMER NAME in the amount of $000.00 at MERCHANT NAME on your Machias Savings Bank credit card ending in XXXX was declined due to suspected fraud.`; CUSoCal (VERIFIED): texts include CU name, last 4, date, amount, merchant; replies Yes/No/Stop; arrive "within one minute"; e-mail after 15 min without reply. CSI online-banking card controls (REPORTED): alert on Approved / Declined / All.

### 3.12 Network-level alerts
- **Visa Purchase Alerts** (VERIFIED visa.com): "near real-time"; triggers you choose: internet/phone purchases, "credit amounts processed" (i.e., refunds), international purchases, purchases reaching a set dollar threshold, purchase declines; only Visa-routed transactions; SMS availability "at the discretion of the card issuer"; enroll at `purchasealerts.visa.com/vca-web/check` (eligibility) → login. CU pages add: alert includes amount, merchant name and location when available, card last 4; **gasoline alerts may omit the amount** (REPORTED, Team One CU). Barclays Mastercard reported ineligible (REPORTED).
- **Mastercard** equivalents (In Control / issuer-side) not researched this session — open item.

---

## 4. Event semantics the ledger must model

| Phenomenon | What alerts do (status) | Design consequence |
|---|---|---|
| Authorization vs posting | WF: alerts at authorization with the initial auth amount (VERIFIED). ALECU/Old Hickory/Barclays: alert at posting (REPORTED). Chase/Citi/Discover samples carry no state word; Altana says "Pending charge" (REPORTED). | Tag each event `AUTH` or `POST` per source template; default bank-push/SMS = AUTH unless template says posted. |
| Tips (restaurant, written on receipt) | Final posts higher than auth; no issuer sends an "amount changed" alert (negative result). WF explicitly warns the tip "may not be included" and that "you may get two alerts" (VERIFIED). Capital One: posting within 72 h, up to 5 days (VERIFIED). | Reconcile POST to AUTH by card+merchant within 5 days when `auth ≤ post ≤ auth×1.35 + $5` (restaurant/bar MCC heuristic — INFERRED); adjust the category by the delta. |
| Fuel pre-authorization | Hold "from as little as $1 to more than $100" (VERIFIED, AARP); Visa fuel alerts may omit the amount (REPORTED); Capital One: "a gas station removes the authorization fee they charge for paying at the pump" (VERIFIED). | Treat a fuel-MCC/merchant-name AUTH as `PENDING_HOLD`: record 0 or the hold, prompt category, then replace with POST amount; expire unlinked holds after 72 h. |
| Hotel / car rental | Estimated incidentals, adjusted at checkout (VERIFIED, Capital One). | Same as fuel with a 14-day window. |
| Refunds / returns | Chase "refund was posted" SMS (REPORTED); U.S. Bank **Credit posted** alert (VERIFIED name); Capital One "credit back" alert (VERIFIED description); Visa "credit amounts processed" (VERIFIED); Discover refund e-mail (REPORTED). | `REFUND` event, negative amount, link to prior purchase by merchant (+amount within 90 days) else ask the user. |
| Declines | WF **Card Declined**, U.S. Bank **Declined transaction** (push) (VERIFIED names); NFCU "was declined", Chase "We declined…" (REPORTED). | `DECLINE` event: never debits a budget; useful to confirm that an ENFORCE block or an issuer block happened. |
| Fraud verification (2-way) | "Did you attempt…? Reply YES/NO" (VERIFIED/REPORTED). | Not a spend; parse to `VERIFY` and surface, but do not record. Likely redaction target on Android 15+ (§2.1). |
| Recurring / card-not-present | Chase stopped "Online, phone or mail charge authorized" alerts 2026-02-17 (VERIFIED); Citi marks CNP explicitly ("was not present") (REPORTED); Visa/WF/U.S. Bank have CNP alert types. | Expect gaps for subscriptions at Chase; the tap-to-pay use case is unaffected. |
| Duplicate charges | Capital One alerts on two identical same-day charges (VERIFIED description). | Do not auto-merge identical same-channel events (see §7). |
| Alert outages | Chase: delays from "service outages and connection issues"; WF: "service provider outages, system errors"; Synchrony e-mail alerts blocked by filters (REPORTED). | Every channel is lossy; reconciliation against Wallet history/e-mail/statements is mandatory. |

---

## 5. Prior art (what they do, what breaks)

- **PennyWise AI** (`sarim2000/pennywiseai-tracker`, Kotlin, AGPL-3.0; F-Droid `com.pennywiseai.tracker`; README claims 161 banks / 25 countries). Architecture (VERIFIED by reading source): pure-Kotlin `parser-core` module; abstract `BankParser` with `canHandle(sender)`, `parse(smsBody, sender, timestamp)`, overridable `extractAmount/extractMerchant/extractTransactionType/extractAccountLast4/extractBalance/extractReference`, `isTransactionMessage()` keyword gate, shared `isNonTransactionMessage()` negative filters (OTP, "one-time password", promos, payment requests, bill-due reminders unless a completed-money verb like `debited|spent|charged|purchased|refunded` appears, "will be auto-debited" intimations), a `CREDIT_LIMIT_CLAUSE` mask so "Avl Limit: INR 57888.3" is never parsed as the amount (their issue #888), `FinancialMessageSafety` (declined/failed/reversed phrases, security-code phrases, operational/promo phrases). `BankParserFactory` holds an **ordered** parser list and dispatches by *content*: every parser whose `canHandle(sender)` matches runs in order until one returns a transaction — order is part of correctness. Each parser file's header comment documents sample formats and sender IDs; tests are table-driven `ParserTestCase(name, message, sender, expected)` suites (`docs/parser-test-standards.md`), plus `BankSamplesDocTest`/`SupportedBanksDocTest` that fail CI when generated docs drift from the registry — a good pattern to copy. App side: `BankNotificationListenerService` filters by an allow-list `Map<packageName, senderAlias>` (`BankNotificationConfig`), skips `FLAG_GROUP_SUMMARY`, extracts `EXTRA_BIG_TEXT`/`EXTRA_TEXT_LINES`/`EXTRA_TEXT`/`EXTRA_SUMMARY_TEXT`/`EXTRA_TITLE`, logs every raw notification to a `BankNotificationEntity` table (processed flag + retry worker), then runs **two-layer dedupe**: (1) exact `transactionHash` (MD5 of body-derived fields; identical carrier re-deliveries collapse, different bodies with equal amounts do not), (2) `getTransactionByAmountAndDate(amount, t−2 min, t+2 min)` then `isSameCharge` (same bank, same currency, case-insensitive normalized merchant) — and crucially `isBookedByOtherChannel` only treats a row from the *other* channel (SMS vs notification alias) as a duplicate: "two identical SMS charges a minute apart are two real purchases"; accounts must agree or be unknown; a user-deleted notification row still blocks its SMS twin. They also repair known parse artifacts in place (dropped decimals; limit figure stored as amount) and dedupe UPI by 12-digit reference within 24 h. Their "Report a parsing problem" flow uploads the SMS text to a server for preview — Save should keep the equivalent local (export fixture to file).
- **Cashiro** (`com.ritesh.cashiro`, open source, F-Droid): SMS + PDF statements, pattern-based parsing, India-centric (REPORTED).
- **Walnut → Axio** (India): built around SMS parsing of 40+ banks; now a lending product with cloud processing (REPORTED; internals not public).
- **Olik Split** (Android, commercial): `NotificationListenerService` restricted to supported banks' package names; per-bank parsers "tuned to the bank's specific notification format"; locale-aware amount/date parsing (Cyrillic/Greek/Latin tested); every parse becomes a **draft the user confirms, edits or discards**; unsupported banks added from a redacted screenshot (REPORTED, vendor page). Confirms the pop-up-to-confirm UX Save already plans.
- **Finny** (iOS): captures bank push alerts; its blog is the best public summary of US alert thresholds (Chase every purchase or above a set amount; BofA debit above chosen amount; WF Single Purchase Amount / Daily Total; Capital One Instant Purchase Notification) (REPORTED, 2026-10-03).
- **Tasker/AutoNotification, iOS Shortcuts (TechnoFino, RoutineHub), n8n/Make e-mail regex flows**: all converge on regex-per-sender with a spreadsheet sink; the published lesson is "test against the real notification string, it has unicode" (REPORTED).
- **What breaks in practice (REPORTED across the above):** promotional/OTP texts with amounts; available-limit/balance figures mistaken for the amount; dropped decimals; STOP/HELP footers glued to the merchant ("Google One at 08:19 PM EDT on 05/06/25.Txt STOP…"); truncated merchants ("WWW Google C"); processor descriptors with reference numbers ("8042999971 P AND F TAX INC"); same charge arriving by SMS *and* app push; carrier re-delivery of identical SMS; multiline notification bodies; locale decimal/thousands separators ("1.234,56 USD"); currency-symbol vs ISO-code forms; bank-app notifications that are *summaries* ("3 new alerts") rather than per-event.

---

## 6. Parser architecture recommendation (fixture-driven)

### 6.1 Pipeline (per raw message)
```
RawMessage{source: BANK_PUSH|BANK_SMS|SMS_APP_NOTIF|WALLET_NOTIF|EMAIL|NETWORK_ALERT,
           origin: packageName | smsAddress | emailFrom, title?, body, receivedAt, extras}
  → Normalize   (NFKC, unify whitespace incl. U+00A0/U+202F, strip zero-width, keep original for fixtures)
  → Route       (origin → IssuerProfile; unknown origin → GenericGrammar; redaction check: body == redacted string → emit REDACTED)
  → Pre-filter  (negative gates: OTP/verification-code words with no money verb, promos, payment-due, "will be", "did you attempt" → VERIFY)
  → Extract     (ordered Template list per IssuerProfile; first full match wins; else Generic field extractors)
  → Validate    (amount 0 < a ≤ 50,000; last4 ∈ user's cards or null; date within ±2 days of receivedAt; merchant not a date/URL/footer)
  → Score       (§6.4) → ParsedEvent{kind: AUTH|POST|PENDING_HOLD|REFUND|DECLINE|VERIFY|UNKNOWN, amount, currency,
                 merchantRaw, merchantNorm, cardKey(last4|productName), occurredAt, source, confidence, templateId, rawId}
  → Dedupe/Merge (§7) → Ledger
```
Everything above the ledger is pure Kotlin (no Android imports) so it runs in JVM unit tests against fixtures, exactly like PennyWise's `parser-core`.

### 6.2 Template DSL compiled to regex
Author templates as readable patterns, compile once:
```
{card_product}: You made a {amount} transaction with {merchant} on {date_long} at {time} {tz}.        # chase.sms.purchase
Citi Alert: A {amount} transaction was made at {merchant} on card ending in {last4}. View details at citi.com/citimobileapp   # citi.sms.purchase
Citi Alert: Card ending in {last4} was not present for a {amount} transaction at {merchant}. View at citi.com/citimobileapp   # citi.sms.cnp
Discover Card Alert: A transaction of {amount} at {merchant} on {date_long}. No Action needed. See it at {url}. Text STOP to end  # discover.sms.purchase
NFCU: Transaction for {amount} was {approved|declined} on {debit|credit} card {last4} at {merchant} at {time} {tz} on {date_short}.{footer}
Pending charge for {amount} on {date_short} {time} {tz} at {merchant_with_city} for {card_name} card ending in {last4}.
```
Field types: `{amount}` = `(?<cur>\$|USD\s?|€|£)?(?<amt>\d{1,3}(?:,\d{3})*(?:\.\d{2})?|\d+(?:\.\d{2})?)` with parenthesized/negative forms `\((?:\$)?[\d,.]+\)` and `-\$`; `{last4}` = `(?<last4>\d{4})` only after `ending( in)?|card|acct\.? end\.? in|\*\*|x{2,}`; `{merchant}` = lazy `.+?` bounded by the next literal; `{date_long}` = `[A-Z][a-z]+ \d{1,2}, \d{4}`; `{date_short}` = `\d{1,2}/\d{1,2}(/\d{2,4})?`; `{time}` = `\d{1,2}:\d{2}(?:\s?[AP]M)?`; `{tz}` = `[A-Z]{2,4}T?`; `{footer}` = `(?:\s*(?:Txt|Text|Reply) STOP.*)?$`. Whitespace in templates compiles to `\s+` (Citi's double space), literals are regex-escaped, matching is case-insensitive and `DOTALL`.
Each template declares: `kind` (AUTH/POST/…), `stateHint` ("Pending"→PENDING_HOLD, "posted"→POST, "approved"→AUTH, "declined"→DECLINE, "refund|credit was posted|credited"→REFUND), `cardKeyField` (`last4` or `card_product`), and an `examples:` list that doubles as the fixture test.

### 6.3 Generic grammar (unknown or changed formats)
Run only when no template matches: (1) amount = first money token *after masking* balance/limit clauses (`(?:bal(?:ance)?|avail(?:able)?\s+(?:credit|limit|balance)|limit)\b[^$]{0,20}\$[\d,.]+`); (2) kind from verbs (`refund|credited|credit (?:was )?posted` → REFUND; `declined|not approved` → DECLINE; `pending|hold|authoriz` → AUTH/PENDING_HOLD; `posted|processed` → POST; `transaction|purchase|charge|spent|debited|withdrawal|approved` → AUTH); (3) merchant = text after `at|with|from|to` up to ` on |,| for |\.|\n|Txt|Text|Reply|$`, rejecting tokens that are dates/URLs/`card`/`your`; (4) last4 as above; (5) card product = leading `^[A-Z][\w &®]+:` prefix. Generic results are capped at confidence 0.6 (§6.4) so they always pop up for confirmation.

### 6.4 Confidence score (0–1, additive, clamp)
+0.45 template match (full) | +0.25 generic amount + verb | +0.15 last4 or card product resolves to a known card | +0.10 merchant extracted and not in reject list | +0.05 date/time parsed and within ±2 days | −0.30 sender/package not in allow-list | −0.20 amount > 3× user's 90-day p95 for that card | −0.50 negative gate words present (OTP, verify, code, promo, due). Thresholds: ≥0.85 auto-record with a dismissible pop-up; 0.6–0.85 pop-up requires a tap; <0.6 goes to the **Unparsed Inbox**.

### 6.5 Teach-the-parser UX (local, no upload)
1. Capture mode (dev + first-week default): every notification from allow-listed packages/short codes is stored raw (title, body, extras keys, package, postTime, sbn.key) in an append-only table and exportable as a redacted JSON fixture (`amounts→$X.XX`, digits→`#`, keep structure).
2. Unparsed Inbox item → user highlights amount / merchant / card / state in the raw text → the app generalises the highlighted spans into a template (literal text kept, highlighted spans → field types inferred by content) → shows the compiled template against the last 20 raw messages from the same origin and asks "match these N?" → saves as a user template with priority above built-ins.
3. Every user confirmation/edit of a parsed event is recorded as a labelled example; a nightly local job re-runs all templates against all examples and flags regressions (PennyWise's doc-test idea, on device).
4. "Report" = export fixtures to a file the user can hand to the next AI session; never auto-upload.

### 6.6 Locale / currency
US-first but do not hard-code: parse `$1,234.56`, `USD 9.84`, `1.234,56 USD`, `€25.50`, `CAD 85.75`; store `amountMinor: Long` + ISO code; a foreign-currency AUTH (travel) is tagged `fxPending` and reconciled when the USD POST arrives (issuer alerts show the merchant currency or USD depending on issuer — WF converts to USD, VERIFIED). Dates: issuer time zones are explicit (ET/EDT/CDT) — convert to instant using the zone abbreviation map, fallback to device zone; two-digit years allowed.

---

## 7. Dedupe / merge specification

### 7.1 Canonical model
`PurchaseEvent` (what the ledger stores) ← N `Observation`s (one per source message). Observations never merge destructively; they attach to an event. Sources ranked for *amount authority*: `NETWORK_ALERT ≈ BANK_PUSH ≈ BANK_SMS` (issuer-side, authorization amount) > `WALLET_NOTIF` (device-side, may lack merchant/amount) > `EMAIL` (slow, but POST-authoritative). For *merchant* the Wallet/terminal name and the issuer descriptor differ; keep both, display the issuer's.

### 7.2 Matching an incoming observation `o` to an open event `e`
All of the following, evaluated against events of the last 72 h (and 14 d for hotel/car MCC):
1. **Card agreement:** `o.cardKey` and `e.cardKey` equal, or either unknown. Chase SMS has only the product name; Wallet may show FPAN last4 (verify, §2.4); map product name ↔ last4 in the card registry.
2. **Time window:** |o.occurredAt − e.occurredAt| ≤ W(source pair): Wallet↔bank push 10 min (Wallet "a few minutes later"); bank push↔bank SMS 5 min; anything↔e-mail 48 h (AUTH) / 5 d (POST) ; network alert↔bank 5 min. Use the *alert's embedded timestamp* when present, else receivedAt; SMS can be delayed by carriers — PennyWise allows 24 h for reference-keyed UPI; use 30 min as the SMS slack when the body carries no timestamp.
3. **Amount:** exact equality for AUTH↔AUTH across channels; for POST↔AUTH apply the tip rule (§4) or equality; for PENDING_HOLD↔POST any amount at the same merchant/card inside the window.
4. **Merchant similarity:** normalize (uppercase, strip `#\d+`, `\*\w+`, store numbers, city/state suffixes, punctuation, collapse spaces, drop stop-tokens `INC LLC STORE SQ PAYPAL TST`), then accept if equal, or one is a prefix of the other (≥5 chars; handles Citi truncation), or Jaro-Winkler ≥ 0.88, or token-set Jaccard ≥ 0.5. Unknown merchant on either side (Schwab/Old Hickory/Wallet-without-merchant) = neutral, not a mismatch.
5. **Channel rule (from PennyWise, adopted):** an observation can only dedupe against an event that does **not already have an observation from the same source**. Same source + same body hash within 10 min = carrier/notification re-delivery → drop. Same source + different body = a **new event** even if amount/merchant/time match.
Decision: match → attach; else create event. Ambiguity (two candidate events) → attach to the one with closest time whose source slot is free; if still tied, create a new event and flag `needsReview`.

### 7.3 Worked edge cases
- **Two identical coffees 3 minutes apart (same card, $4.50, same shop):** Wallet emits two notifications (slots: W1, W2), bank emits two pushes (P1, P2). P1 attaches to W1 (free bank-push slot, nearest time). P2 cannot attach to event 1 (bank-push slot taken) → event 2, attaches to W2. Result: two events, correct. Without the slot rule, P2 would be swallowed as a duplicate.
- **Split tender ($20 on card A, $13.47 on card B, same merchant, seconds apart):** different cardKeys → never matched → two events; the UI may offer "same receipt?" to assign one category. Same card, two different amounts seconds apart (e.g., restaurant pre-auth then tip-inclusive post) → amount rule decides: AUTH+AUTH unequal → two events (correct for split tender on one card), AUTH then POST within tip bounds → merge (correct for tips).
- **Gas:** Wallet shows $1.00 (or nothing); bank sends AUTH $1.00 "pump pre-auth" or omits amount (Visa); 2 days later POST $43.18 arrives by e-mail/post alert. Event starts as PENDING_HOLD with category prompt; POST replaces amount; budget impact recorded at POST time but attributed to the tap date.
- **Hotel:** AUTH $350 at check-in, POST $412 at checkout (incidentals) → same rules, 14-day window, merchant equality.
- **Refund:** REFUND $25.00 at Discover "WWW.XXX.ORG" → search prior AUTH/POST same card+merchant within 90 d with amount ≥ refund → link, credit the original category; none → ask.
- **Decline after ENFORCE block:** the app blocked the tap, so no bank alert arrives; a decline alert without a matching Save block means the issuer declined — show informationally, no ledger entry.
- **Fraud 2-way text** (`Did you attempt…`): VERIFY event; if a matching AUTH exists, annotate; never debit.
- **Redacted push** (Android 15+): body equals the system string → emit REDACTED observation that *reserves* the bank-push slot for the next 10 min so the SMS/e-mail twin creates/attaches properly.
- **Chase product-name-only alerts:** cardKey = product name; two Chase cards with the same product name are indistinguishable from SMS alone — rely on Wallet's last4 and ask once.
- **Carrier re-delivery / notification update:** identical normalized body from the same origin within 10 min → drop (PennyWise: identical bodies collapse via hash).
- **Daylight/zone:** alert times are in issuer zone; the two-coffees window uses instants, so a 1-hour TZ error would break matching — always convert with the embedded zone abbreviation.

---

## 8. What the user must configure (per bank) — checklist for onboarding

1. **Chase:** app → person icon → Alerts & messages → Manage alerts → for each card enable the transaction threshold alert at the lowest value ($1), delivery = **push + text**; confirm texts arrive from **24273**; note the 2026-02-17 retirement means online/recurring charges may not alert.
2. **Amex:** app → Account → Notifications → enable purchase/charge notifications (push) and any "spend tracking"/large-purchase alerts; enable SMS Account Alerts (US short code to be confirmed on device).
3. **Capital One:** app → profile → Alerts & Notifications → each card → **Transaction made above $_** → choose push (+ SMS) and the lowest minimum ($0 if offered, else $1); also enable Eno credit-back and duplicate-charge alerts.
4. **Citi:** Citi Mobile → Alerts → enable transaction alerts with threshold $0/$1 → text + push; texts from **692484** / "CITI".
5. **Discover:** account → account activity alerts → purchase alerts → **text + email** (push wording unverified); accept the short-code migration messages, do **not** reply STOP; legacy sender 347268.
6. **Bank of America:** Alerts → card charges → push + text; set thresholds to the minimum where applicable.
7. **Wells Fargo:** Manage Banking Alerts → **Single Purchase Amount** at the minimum, plus **Card Declined**; delivery push + text (93557); enable "Push Notifications" in app settings.
8. **U.S. Bank:** Alerts → **Transaction dollar amount** at the minimum (text/email only — no push for purchases), **Declined transaction** (push), **Credit posted**, **Gas station purchase**.
9. **Barclays US:** enable whatever transaction alerts exist but expect post-time delivery; enrol the card in **Visa Purchase Alerts** if it is a Visa (purchasealerts.visa.com).
10. **Any Visa card:** enrol in Visa Purchase Alerts with "purchases reaching a set dollar threshold" at the minimum, plus declines and credits; choose SMS if the issuer allows.
11. **Credit unions:** enable card-control / transaction alerts for "All" or "Approved" transactions with a $0 threshold; capture one sample per alert type.
12. **Phone:** install Save via `adb install`; grant notification access (`adb shell cmd notification allow_listener …` or Settings); grant `RECEIVE_SMS`/`READ_SMS` (`adb shell pm grant …`); if Settings shows "Restricted setting", use App info → ⋮ → Allow restricted settings; keep Google Wallet's "Transactions" channel enabled and not silenced; on Android 15+ test whether any bank alert arrives redacted and, if so, try `adb shell appops set <pkg> RECEIVE_SENSITIVE_NOTIFICATIONS allow` or a CDM association; exempt Save from battery optimisation so the listener process stays bound.

---

## 9. Open questions / device tests (ordered by architectural risk)

1. Capture verbatim push + SMS for each of the user's actual cards (title, body, extras keys, package, postTime) for: purchase, refund, decline, fraud 2-way, pending/hold, posted. These are the fixtures; nothing above replaces them.
2. Does any bank/Wallet notification arrive redacted on the user's Android 15/16/17 device? Does `appops set … RECEIVE_SENSITIVE_NOTIFICATIONS allow` make the listener trusted? Does a CDM association?
3. Do `adb install`-ed apps bypass the restricted-settings gate for notification access and SMS on the user's OEM build (Pixel vs Samsung One UI)?
4. With `targetSdk 37`, does a synthetic bank-style SMS ("…card ending in 1234…") get delayed 3 h by the Android 17 standard-SMS OTP protection? (Decides the SMS path's target SDK.)
5. Google Wallet notification: exact wording, whether merchant/amount are always present, which last-4 (FPAN vs DPAN) it shows, and typical delay after the tap.
6. Minimum thresholds: does Chase/Capital One accept $0 or only $1? Does Capital One's alert include the merchant in the push body?
7. Amex, Capital One, BofA, Wells Fargo, U.S. Bank, Barclays, Synchrony verbatim formats — all UNVERIFIED here.
8. Whether the user's Mastercard issuers offer a network-level alert equivalent to Visa Purchase Alerts.
9. Whether bank pushes ever arrive as grouped/summary notifications on this device (affects extraction).
10. E-mail: decide between Gmail API polling (needs OAuth app publishing or weekly re-auth) and IMAP IDLE with an app password (needs 2SV) — both VERIFIED feasible.

---

## Sources (accessed 2026-10-17 unless noted)

Primary — Android / Google
- Android 15 behavior changes (all apps), OTP redaction & screenshare: https://developer.android.com/about/versions/15/behavior-changes-all
- Android 16 behavior changes (all apps): https://developer.android.com/about/versions/16/behavior-changes-all
- Android 17 behavior changes (all apps), "SMS OTP protection": https://developer.android.com/about/versions/17/behavior-changes-all (page updated 2026-10-16)
- Android 17 behavior changes (targeting 17), "OTP protection for standard SMS messages": https://developer.android.com/about/versions/17/behavior-changes-17
- Permissions used only in default handlers (Play policy scope): https://developer.android.com/guide/topics/permissions/default-handlers
- AOSP `Telephony.java` (SMS_RECEIVED/SMS_DELIVER/ACTION_CHANGE_DEFAULT javadoc): https://android.googlesource.com/platform/frameworks/base/+/refs/heads/main/core/java/android/provider/Telephony.java
- AOSP `core/res/AndroidManifest.xml` (`RECEIVE_SENSITIVE_NOTIFICATIONS`, signature|role): https://android.googlesource.com/platform/frameworks/base/+/refs/heads/main/core/res/AndroidManifest.xml
- AOSP `Adjustment.java` (`KEY_SENSITIVE_CONTENT`): https://android.googlesource.com/platform/frameworks/base/+/refs/heads/main/core/java/android/service/notification/Adjustment.java
- AOSP `NotificationListenerService.java` (`Ranking.hasSensitiveContent`): https://android.googlesource.com/platform/frameworks/base/+/refs/heads/main/core/java/android/service/notification/NotificationListenerService.java
- AOSP `NotificationManagerService.java` (trusted-listener check, `redactStatusBarNotification`): https://android.googlesource.com/platform/frameworks/base/+/refs/heads/main/services/core/java/com/android/server/notification/NotificationManagerService.java
- AOSP `NotificationShellCmd.java` (`cmd notification allow_listener`): https://android.googlesource.com/platform/frameworks/base/+/refs/heads/main/services/core/java/com/android/server/notification/NotificationShellCmd.java
- AOSP ExtServices `NotificationOtpDetectionHelper.java`: https://android.googlesource.com/platform/packages/modules/ExtServices/+/refs/heads/main/java/src/android/ext/services/notification/NotificationOtpDetectionHelper.java
- AOSP Permission module `EnhancedConfirmationService.java` (restricted settings): https://android.googlesource.com/platform/packages/modules/Permission/+/refs/heads/main/service/java/com/android/ecm/EnhancedConfirmationService.java
- AOSP `PackageInstaller.java` (`PACKAGE_SOURCE_*`): https://android.googlesource.com/platform/frameworks/base/+/refs/heads/main/core/java/android/content/pm/PackageInstaller.java
- AOSP Settings `ApprovalPreferenceController.java`: https://android.googlesource.com/platform/packages/apps/Settings/+/refs/heads/main/src/com/android/settings/applications/specialaccess/notificationaccess/ApprovalPreferenceController.java
- `Notification.MessagingStyle.Message` reference (getMessagesFromBundleArray, API 30): https://developer.android.com/reference/android/app/Notification.MessagingStyle.Message
- Google support, "Allow restricted settings": https://support.google.com/android/answer/12623953
- Gmail API push notifications: https://developers.google.com/workspace/gmail/api/guides/push
- Gmail API usage limits: https://developers.google.com/workspace/gmail/api/reference/quota
- Google OAuth 2.0 refresh-token expiration (Testing status, 7 days): https://developers.google.com/identity/protocols/oauth2
- Google app passwords: https://support.google.com/accounts/answer/185833
- Google Workspace: transition from less secure apps to OAuth (2025-03-14 cutoff): https://knowledge.workspace.google.com/admin/sync/transition-from-less-secure-apps-to-oauth
- Gmail XOAUTH2 / IMAP capability sample: https://developers.google.com/workspace/gmail/imap/xoauth2-protocol
- Play Store listings (titles scraped 2026-10-17): https://play.google.com/store/apps/details?id=com.chase.sig.android (and the other package ids listed in §3)

Primary — issuers / networks
- Chase, Manage Account Alerts: https://www.chase.com/digital/alerts and https://www.chase.com/personal/mobile-online-banking/login-alerts
- Chase alert retirement notice quoted by Doctor of Credit (2026-02-02): https://www.doctorofcredit.com/chase-ending-alerts-for-non-physical-international-charges-on-17-2-26/ ; Upgraded Points (2026-02-02): https://upgradedpoints.com/news/chase-reduces-notifications-for-select-charges/
- Capital One, "Your security matters to us" (Transaction made above $_): https://www.capitalone.com/learn-grow/privacy-security/your-security-matters/
- Capital One, pending transactions (72 h / 5 days; tips, gas, hotels): https://www.capitalone.com/help-center/credit-cards/card-pending-transactions/
- Capital One Eno (fraud text sample): https://www.capitalone.com/digital/eno and https://www.capitalone.com/learn-grow/money-management/eno-manages-finances/
- Wells Fargo credit card alerts FAQ (authorization timing, tip caveat): https://www.wellsfargo.com/help/credit-cards/credit-card-alerts-faqs/ ; debit alerts FAQ: https://www.wellsfargo.com/help/checking-savings/debit-card-alerts-faqs/ ; short code 93557: https://www.wellsfargo.com/online-banking/alerts/
- U.S. Bank, alert types KB: https://www.usbank.com/customer-service/knowledge-base/KB0324837.html
- Discover, email and text alerts: https://www.discover.com/credit-cards/card-smarts/email-and-text-alerts/ ; text migration: https://www.discover.com/text-migration ; SMS info: https://www.discover.com/credit-cards/member-benefits/mobile/sms-important-info.html
- Bank of America alerts: https://info.bankofamerica.com/en/digital-banking/alerts.html
- American Express (Canada) text messages / short codes: https://americanexpress.com/ca/en/customer-service/digital/sms.html ; Amex app purchase alerts (UK FAQ): https://www.americanexpress.com/uk/customer-service/faq.can-i-enable-mobile-purchase-alerts-for-the-additional-cardmember-on-my-account.html
- Visa Purchase Alerts: https://www.visa.com/en-us/personal/products/purchase-alerts ; eligibility: https://purchasealerts.visa.com/vca-web/check
- Team One CU (Visa alert contents, gasoline caveat): https://teamonecu.org/personal/credit-cards/purchase-alerts ; Central Bank FAQ: https://centralbank.com/faqs/visa-purchase-alerts
- CUSoCal credit card fraud alerts FAQ: https://www.cusocal.org/faqs/credit-card-fraud-alerts/
- Machias Savings Bank 2-way fraud alerts guide (2026-06 PDF): https://www.machiassavings.bank/wp-content/uploads/2026/06/Cardholder-Quick-Reference-Guide-2-Way-Fraud-Alerts.pdf ; 2023 fraud alerts PDF: https://www.machiassavings.bank/wp-content/uploads/2023/08/Credit-Card-Fraud-Alerts.pdf
- Walden Savings Bank text alerts: https://waldensavings.bank/textalerts
- CSI online banking card alerts documentation: https://docs.csiweb.com/content/csi%20manuals/np_internet_banking/71495.htm
- AARP (gas station pre-authorization holds): https://www.aarp.org/money/personal-finance/credit-card-pre-authorization-holds-gas-stations/

Secondary — prior art, forums, press
- PennyWise AI repository (parsers, fixtures, dedupe): https://github.com/sarim2000/pennywiseai-tracker (files read: `parser-core/.../bank/BankParser.kt`, `BankParserFactory.kt`, `ChaseBankParser.kt`, `CitiBankParser.kt`, `DiscoverCardParser.kt`, `AMEXBankParser.kt`, `NavyFederalParser.kt`, `HuntingtonBankParser.kt`, `AltanaFCUParser.kt`, `AdelFiParser.kt`, `AlecuBankParser.kt`, `OldHickoryParser.kt`, `CharlesSchwabParser.kt`, `FinancialMessageSafety.kt`; tests `TestChaseBankParser.kt`, `TestCitiBankParser.kt`, `TestDiscoverCardParser.kt`, `TestUSParsers.kt`, `TestNavyFederalParser.kt`, `TestHuntingtonBankParser.kt`, `TestOldHickoryParser.kt`, `AltanaFCUParserTest.kt`, `AdelFiParserTest.kt`, `TestAlecuBankParser.kt`; app `receiver/BankNotificationListenerService.kt`, `receiver/BankNotificationConfig.kt`, `data/manager/TransactionDeduplication.kt`, tests `BankNotificationDedupHashTest.kt`, `TransactionDeduplicationTest.kt`; docs `docs/adding-bank-parsers.md`, `pennywise-web/server/src/main/resources/bank-samples.json`); F-Droid listing: https://f-droid.org/en/packages/com.pennywiseai.tracker
- Cashiro (F-Droid): https://f-droid.org/en/packages/com.ritesh.cashiro/
- Olik Split, bank notifications feature page: https://oliksplit.app/features/bank-notifications
- Finny blog, "Turn bank transaction alerts into an expense tracker" (2026-10-03): https://getfinny.app/blog/turn-bank-alerts-into-expense-tracker ; "SMS expense tracking apps" (2026-03-12): https://getfinny.app/blog/sms-expense-tracking-app ; Apple Shortcuts automations (2026-04-16): https://getfinny.app/blog/apple-shortcuts-expense-tracking-automations-2026
- 9to5Google, Google Wallet notifications (2023-10-20/2023-12-04): https://9to5google.com/2023/12/04/google-wallet-notifications/ ; (2024-06-10): https://9to5google.com/2024/06/10/google-wallet-android-notifications/
- Android Authority, Android 15 sensitive notifications (2024): https://www.androidauthority.com/android-15-sensitive-notifications-3416414 ; 2FA codes hidden from listeners: https://androidauthority.com/android-15-two-factor-authentication-codes-3492585 ; Phone Link fix (2025): https://www.androidauthority.com/phone-link-sensitive-notifications-fix-3540158 ; Android 17 release date (2026-06-16): https://androidauthority.com/android-17-release-date-3639790
- myFICO forums: push notifications for new transactions: https://ficoforums.myfico.com/t5/Credit-Cards/Push-Notifications-for-New-Transactions/m-p/6546740 ; purchase alerts (Barclays timing, Visa alerts eligibility): https://ficoforums.myfico.com/t5/Credit-Cards/purchase-alerts/m-p/5406134/highlight/true ; Amex text alerts: https://ficoforums.myfico.com/t5/Credit-Cards/AMEX-Texts-Alerts/m-p/2367415
- AARP community, Barclays alert delays: https://community.aarp.org/t5/Benefits-Discounts/AARP-Barclays-Mastercard-Account-Alerts/m-p/2454048
- Samsung developer forum (RCS not exposed, `content://im/chat`): https://forum.developer.samsung.com/t/rcs-rich-communication-service-db/10850 and https://us.community.samsung.com/t5/Samsung-Apps-and-Services/com-samsung-android-messaging-app-third-party-developer-has-no/m-p/2395819
- Incogni, list of text message short codes (bank codes, third-party): https://blog.incogni.com/list-of-text-message-short-codes/
- Sinch / Fyno on RCS in banking (vendor marketing; US alerts still SMS): https://sinch.com/blog/rcs-in-banking-financial-services/ ; https://www.fyno.io/blog/a-complete-guide-to-using-rcs-for-financial-services-cm5yxgxlj000j686xl9hkhxws
- Motley Fool Ascent, why tips post later: https://www.fool.com/money/credit-cards/articles/heres-why-tips-dont-immediately-show-up-on-your-credit-card-statement
- Automate forum, regex vs unicode in a Google Wallet notification: https://redlib.hackliberty.org/r/AutomateUser/comments/1kzdlw6/regex_matching_to_currency
- Finovate, Discover refund e-mail (older): https://finovate.com/alerts-discover-card-highlights-merchant-refunds/
