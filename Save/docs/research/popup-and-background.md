# Popup delivery and background plumbing on Android 13–17 — raw research notes

Project: "Save" (personal budget-enforcement app, sideloaded, Android-first).
Topic: delivering an immediate, interactive "categorize this purchase" UI from the background, plus the background-execution plumbing (listener lifecycle, foreground services, Doze, alarms, OEM killers, permission onboarding).
Research date: 2026-10-17. Author: platform-research subagent. Audience: the AI coding session that will build the app. This file is self-contained.

Evidence legend used throughout:
- **VERIFIED** — read in a primary source (developer.android.com, source.android.com, AOSP code on the `aosp-mirror` GitHub mirror of `platform/frameworks/base` `main`, Google support pages).
- **REPORTED** — secondary source (press, blog, forum) or a single anecdote.
- **INFERRED** — my reasoning from verified facts; not itself observed.
- **MEMORY** — well-known API facts I did not re-verify in this session (treat as high-confidence but check against the SDK when coding).

Research limitations: the web-search quota ran out after ~30 searches; everything afterwards was verified by fetching known URLs directly. Pages behind Medium/Android Authority paywalls returned 403 and are cited only through search snippets.

---

## 0. Platform baseline (what "Android 13–17" means in October 2026)

| Release | API | Stable date | Status/notes |
|---|---|---|---|
| Android 13 | 33 | Aug 2022 (MEMORY) | Introduced POST_NOTIFICATIONS runtime permission and "restricted settings" for sideloaded apps. |
| Android 14 | 34 | Oct 2023 (MEMORY) | FGS types mandatory; USE_FULL_SCREEN_INTENT becomes a user-controllable special access; BAL sender opt-in; non-dismissable notifications become dismissable; SCHEDULE_EXACT_ALARM denied by default. |
| Android 15 | 35 | Sept/Oct 2024 (MEMORY) | BAL creator opt-in; SAW-based FGS exemption needs a *visible* overlay; dataSync 6 h cap; BOOT_COMPLETED FGS-type bans; "stopped state" cancels PendingIntents; OTP redaction for listeners. |
| Android 16 | 36 | June 10, 2025 (VERIFIED, Wikipedia) | ProgressStyle / Live Updates APIs; `MODE_BACKGROUND_ACTIVITY_START_ALLOW_IF_VISIBLE`; StrictMode for blocked BAL; JobScheduler quota changes; notification cooldown on by default (Wikipedia: "lowers the sound and minimizes alerts for up to two minutes"). |
| Android 16 QPR1 | 36 (+minor SDK) | Sept 2025 (REPORTED, MEMORY) | Live Updates status-bar chip enabled by default on Pixel; promotion requires `POST_PROMOTED_NOTIFICATIONS` + `requestPromotedOngoing` (Android Authority snippet, REPORTED). |
| Android 17 | 37 | June 16, 2026 (VERIFIED, Wikipedia; codename "Cinnamon Bun"; Beta 1 Feb 13 2026, Platform Stability at Beta 3 Mar 26 2026, Beta 4 Apr 16, Beta 4.1 Jun 1) | Targets 37: `IntentSender.sendIntent()` needs sender BAL opt-in; ASM task-hijack protections; background-audio hardening; "strict size limits on custom notification views" (Beta 1 notes); Bubbles become a windowing mode; new `setExactAndAllowWhileIdle(OnAlarmListener)`; app memory limits ("MemoryLimiter"). QPR1 (Q3 2026) carries a minor SDK release. **Android 17 has shipped; design for 13–17 and target SDK 36 or 37.** |

The developer.android.com Android 17 pages (behavior-changes-all / -17 / release-notes) were last updated 2026-10-16 (VERIFIED) and contain **no** new restrictions on notifications, heads-up, full-screen intents, SYSTEM_ALERT_WINDOW, NotificationListenerService or foreground-service types beyond the BAL/IntentSender item above (VERIFIED negative result).

---

## 1. The problem in one paragraph

The sensing side will be a `NotificationListenerService` (NLS) that sees the Google Wallet "paid" notification. At that moment our process is alive (bound by system_server) but is **not** a visible app, so it is "in the background" for every Android restriction that matters: it cannot start an Activity (BAL rules, §2), cannot start a foreground service without an exemption (§6.3), and anything it shows must be a notification, an overlay window, or an Activity launched through an explicit exemption. The user is almost certainly looking at an unlocked, screen-on phone (they just tapped it) and Google Wallet's own confirmation UI is probably on top. Everything below is about which surface appears within ~1–2 s under those conditions, on each OS version, and how to keep the process alive enough to do it.

---

## 2. Background activity starts (BAL)

### 2.1 Exemptions as documented today (VERIFIED — developer.android.com/guide/components/activities/background-starts, current)
"An app can start an activity from the background if one of the following conditions is met:"
1. The app has a visible window, such as an activity in the foreground.
2. The app is the current Input Method Editor (IME).
3. The activity is started from a `PendingIntent` that was sent by the system (for example, from a notification tap).
4. The app has the `SYSTEM_ALERT_WINDOW` permission granted by the user.
5. The app has been granted the `START_ACTIVITIES_FROM_BACKGROUND` permission. (protectionLevel `signature|privileged|vendorPrivileged|oem|verifier|role` — VERIFIED core/res/AndroidManifest.xml; **not obtainable by a third-party app**.)
6. The app is bound by a service that has been granted permission to start background activities.
7. The launch is initiated by the device's launcher app.
8. The launch is from a core part of the OS (e.g., Telephony starting the incoming-call screen).

Blocked launches throw **no exception**; logcat shows `Background activity launch blocked!` under tag `ActivityTaskManager` (VERIFIED). Android 16+: `StrictMode.VmPolicy.Builder().detectBlockedBackgroundActivityLaunch()` reports them (VERIFIED; the doc sample has a stray `)`).

### 2.2 What AOSP actually does (VERIFIED — `services/core/java/com/android/server/wm/BackgroundActivityStartController.java` and `BackgroundLaunchProcessController.java`, `main`)
Verdict codes and their comments: `BAL_ALLOW_ALLOWLISTED_UID`, `BAL_ALLOW_ALLOWLISTED_COMPONENT`, `BAL_ALLOW_VISIBLE_WINDOW` ("currently have a visible window or are bound by a service with a visible window"), `BAL_ALLOW_PENDING_INTENT`, `BAL_ALLOW_PERMISSION`, **`BAL_ALLOW_SAW_PERMISSION` ("Process has SYSTEM_ALERT_WINDOW permission granted to it")**, `BAL_ALLOW_GRACE_PERIOD` ("App is in grace period after an activity was started or finished"), `BAL_ALLOW_FOREGROUND`, `BAL_ALLOW_SDK_SANDBOX`, `BAL_ALLOW_NON_APP_VISIBLE_WINDOW`, `BAL_ALLOW_TOKEN`, `BAL_ALLOW_BOUND_BY_FOREGROUND`, `BAL_BLOCK`.

- **SAW check is ungated.** In `checkBackgroundActivityStartAllowedByCallerInBackground`: `if (mService.hasSystemAlertWindowPermission(state.mCallingUid, state.mCallingPid, state.mCallingPackage))` → `BAL_ALLOW_SAW_PERMISSION`. No target-SDK or feature-flag condition; the flags `balAdditionalStartModes`, `balStrictModeRo`, `balRequireOptInByPendingIntentCreator` do not touch it. `hasSystemAlertWindowPermission` uses `noteOpNoThrow(OP_SYSTEM_ALERT_WINDOW)` and falls back to `checkPermission(SYSTEM_ALERT_WINDOW)` when the op is `MODE_DEFAULT` (VERIFIED, `ActivityTaskManagerService.java`). For a `PendingIntent` *sender* ("real caller") path the SAW check only applies when the sender used `MODE_BACKGROUND_ACTIVITY_START_ALLOW_ALWAYS`.
- **Grace period = 10 s.** `static final long ACTIVITY_BG_START_GRACE_PERIOD_MS = 10 * 1000;` ("How long we permit background activity starts after an activity in the process started or finished"). The same constant is used for the FGS-start check (`CHECK_FOR_FGS_START`). Not honoured when app switches are disallowed.
- **"Bound by a foreground UID"** requires the binder to pass `Context.BIND_ALLOW_ACTIVITY_STARTS` for clients targeting 34+ (compat change `DEFAULT_RESCIND_BAL_FG_PRIVILEGES_BOUND_SERVICE`, id 261072174, `@EnabledSince(UPSIDE_DOWN_CAKE)`), and the bound client UID must currently have a visible window.
- **NotificationListenerService binding does NOT confer BAL.** `ManagedServices.getBindFlags()` returns `BIND_AUTO_CREATE | BIND_FOREGROUND_SERVICE | BIND_ALLOW_WHITELIST_MANAGEMENT` (VERIFIED, `services/core/java/com/android/server/notification/ManagedServices.java`); no `BIND_ALLOW_BACKGROUND_ACTIVITY_STARTS`/`BIND_ALLOW_ACTIVITY_STARTS`. I did not check whether `NotificationManagerService.NotificationListeners` overrides `getBindFlags()` (the NMS file is ~800 k chars); the historical BAL doc (2019–2023, MEMORY) listed only AccessibilityService, AutofillService, CallRedirectionService, HostApduService, InCallService, TileService, VoiceInteractionService and VrListenerService as system-bound exemptions — NLS was never on it.
- **AccessibilityService binding DOES confer BAL.** `AccessibilityServiceConnection.bindLocked`: `Context.BIND_AUTO_CREATE | Context.BIND_FOREGROUND_SERVICE_WHILE_AWAKE | Context.BIND_ALLOW_BACKGROUND_ACTIVITY_STARTS | Context.BIND_INCLUDE_CAPABILITIES` (VERIFIED). If the enforcement track ends up needing an AccessibilityService anyway, that service's process can start Activities from the background without SAW (INFERRED from the flag).

### 2.3 PendingIntent / IntentSender rules by target SDK (VERIFIED — behavior-changes-14, -15, secure-bal, background-starts)
- Target 34+: a **sender** must opt in to lend its BAL privileges: `ActivityOptions.makeBasic().setPendingIntentBackgroundActivityStartMode(MODE_BACKGROUND_ACTIVITY_START_ALLOWED)` passed to `PendingIntent.send(options.toBundle())`; `bindService()` needs `BIND_ALLOW_ACTIVITY_STARTS` to lend privileges; `Context.startIntentSender()` needs a sender opt-in.
- Target 35+: a **creator** no longer lends privileges by default: `setPendingIntentCreatorBackgroundActivityStartMode(MODE_BACKGROUND_ACTIVITY_START_ALLOWED)` on the options bundle passed to `PendingIntent.getActivity(...)`. Android 15 also "won't bring an app to the foreground unless the PendingIntent sender allows it" and blocks launches from non-visible windows.
- SDK 36+: prefer `MODE_BACKGROUND_ACTIVITY_START_ALLOW_IF_VISIBLE`; reserve `..._ALLOWED` for BroadcastReceiver-style cases.
- Target 37+: `IntentSender.sendIntent()` needs the sender opt-in (also hits `ActivityResultLauncher<IntentSenderRequest>`); the ASM task-hijacking protections (`android:allowCrossUidActivitySwitchFromBelow="false"`, `setAllowCrossUidActivitySwitchFromBelow(true)`) apply to cross-UID task switches, not to launching our own new task.
- Notification content/action PendingIntents are "sent by the system" (exemption 3), so tapping a chip can start our Activity directly. Android 12+ **notification trampoline** rule: an action/tap PendingIntent must point at an Activity directly; a Service/BroadcastReceiver that then calls `startActivity()` is blocked with logcat `Indirect notification activity start (trampoline) from PACKAGE_NAME, this should be avoided for performance reasons.` **Exception: apps holding SYSTEM_ALERT_WINDOW can still trampoline** (VERIFIED, behavior-changes-12). Use `PendingIntent.getBroadcast` for chips that need no UI and `getActivity` for chips that do.

### 2.4 What this means for "UI within 1–2 s of a background event" in 2026
- **With SYSTEM_ALERT_WINDOW granted:** `startActivity(Intent(...).addFlags(FLAG_ACTIVITY_NEW_TASK))` from the NLS/FGS process is allowed on Android 10–17 regardless of target SDK (VERIFIED doc + code). This is the same mechanism Tasker/MacroDroid-style apps rely on (MEMORY). Alternatively draw a `TYPE_APPLICATION_OVERLAY` window directly from the service (§5.1) — no Activity, no task switch.
- **Without SAW:** nothing in the NLS process may start an Activity. The only immediate surface is a notification (heads-up, §4) or a full-screen intent (§3) that only fires when the screen is off/locked.
- **Grace period** is irrelevant here (our Activity was not in the foreground in the last 10 s).
- `START_ACTIVITIES_FROM_BACKGROUND` cannot be granted by adb to a third-party app (protection level excludes `development`), VERIFIED by the manifest declaration.

---

## 3. Full-screen intents (FSI)

### 3.1 Permission mechanics
- `android.permission.USE_FULL_SCREEN_INTENT` must be declared for target 29+ (VERIFIED build-notification doc). Builder: `setFullScreenIntent(pendingIntent, /*highPriority=*/true)`; the `fullScreenIntent` field is "An intent to launch instead of posting the notification to the status bar … the system UI may choose to display a heads-up notification, instead of launching this intent, while the user is using the device" (VERIFIED Notification.java Javadoc).
- Android 14+ (VERIFIED source.android.com/docs/core/permissions/fsi-limits and behavior-changes-14): the permission "can be granted only to apps that provide calling and alarm functionalities" by default. "For all apps being installed on Android 14, the USE_FULL_SCREEN_INTENT permission is enabled by default"; **Google Play revokes it at install** for apps without calling/alarm functionality; apps already installed before the upgrade keep it; users can toggle it under Settings → Apps → Special app access → "Full screen notifications"/"Manage full screen intents". Play policy dates: declaration required May 31, 2024; from Jan 22, 2025 only calling/alarm apps keep the default for apps targeting 14+ (VERIFIED support.google.com/googleplay/android-developer/answer/13392821).
- Third-party installers set the initial state with `PackageInstaller.SessionParams.setPermissionState(permission, PERMISSION_STATE_DEFAULT|GRANTED|DENIED)` — callers without `INSTALL_GRANT_RUNTIME_PERMISSIONS` may change `USE_FULL_SCREEN_INTENT` (VERIFIED PackageInstaller.java Javadoc; "PERMISSION_STATE_DEFAULT: the installer expresses no preference, so the device's default policy sets the grant state").
- **Sideloaded/adb installs: INFERRED to be granted by default** on 14–17 (device default = enabled; only Play explicitly denies). No primary source states the adb case; one developer article (proandroiddev, 2025, paywalled) reportedly confirms debug installs keep it. **Verify on device:** `NotificationManager.canUseFullScreenIntent()` (API 34) and `adb shell appops get <pkg> USE_FULL_SCREEN_INTENT` (op name MEMORY).
- Request flow: if `!canUseFullScreenIntent()` → `startActivity(Intent(Settings.ACTION_MANAGE_APP_USE_FULL_SCREEN_INTENT, Uri.parse("package:$pkg")))` (API 34). Use the constant; the literal is `android.settings.MANAGE_APP_USE_FULL_SCREEN_INTENT` (MEMORY — I could not locate it in the Settings.java chunks I read).

### 3.2 When the system launches the FSI vs. shows a heads-up (VERIFIED — SystemUI `interruption/FullScreenIntentDecisionProvider.kt`, `main`)
Ordered checks in `makeDecisionWithoutDnd`:
1. No `fullScreenIntent` → `NO_FSI_SHOW_STICKY_HUN` if `entry.isStickyAndNotDemoted` (the "FSI requested but denied" case), else `NO_FSI_NO_FULL_SCREEN_INTENT`.
2. `entry.importance < IMPORTANCE_HIGH` → `NO_FSI_NOT_IMPORTANT_ENOUGH` (**channel importance must be HIGH**).
3. Group child with suppressive alert behaviour → no FSI.
4. `notification.isSilent` → no FSI.
5. Bubble metadata suppressing the notification → no FSI.
6. Package suspended → no FSI.
7. `!powerManager.isInteractive` → **`FSI_DEVICE_NOT_INTERACTIVE` (FSI fires)**.
8. `statusBarStateController.isDreaming` → **FSI fires**.
9. `statusBarStateController.state == KEYGUARD` → **`FSI_KEYGUARD_SHOWING` (fires)**.
10. `couldHeadsUp` → **`NO_FSI_EXPECTED_TO_HUN`** (device in use: heads-up instead).
11. Keyguard showing but occluded / locked shade → fires.
12/13. Device not provisioned / user setup incomplete → fires.
14. Fallback `NO_FSI_NO_HUN_OR_KEYGUARD` → nothing.
Then the DND layer: if `entry.shouldSuppressFullScreenIntent()` (`Policy.SUPPRESSED_EFFECT_FULL_SCREEN_INTENT`) the FSI is suppressed (`NO_FSI_SUPPRESSED_BY_DND` / `..._ONLY_BY_DND`).

Consequence: **in the tap-to-pay scenario (screen on, unlocked, user looking at the phone) an FSI never takes over the screen; it degrades to a heads-up.** The FSI is valuable for the screen-off/locked case and — crucially — for making the heads-up sticky (§3.3). The source.android.com validation table agrees: granted → "persistent HUN" when unlocked, FSI on locked/off/AOD; denied → HUN with pill buttons for 60 s in every state (VERIFIED).

### 3.3 Sticky heads-up behaviour (VERIFIED — SystemUI `headsup/HeadsUpManagerImpl.java`, `collection/NotificationEntry.java`, `res/values/config.xml`, `Notification.java`)
- `HeadsUpEntry.isSticky()` = `(mEntry.isRowPinned() && mExpanded) || mRemoteInputActive || hasFullScreenIntent(mEntry)`; sticky entries have auto-removal cancelled ("`if the entry is sticky, updateEntry() cancels auto-removal`"). `hasFullScreenIntent` only checks `fullScreenIntent != null`. ⇒ **A heads-up that carries a (permitted) fullScreenIntent does not auto-dismiss while the device is in use.** It stays until the user swipes it, opens the shade, or the app updates/cancels it. (Also: while the inline-reply field is active the HUN is sticky.)
- `isStickyForSomeTime()` = `entry.isStickyAndNotDemoted()` = `(flags & Notification.FLAG_FSI_REQUESTED_BUT_DENIED) != 0 && !mIsDemoted` ("app provided full screen intent but does not have the permission to send it" and "never been demoted before"); `calculateFinishTime()` then uses `sticky_heads_up_notification_time` = **60000 ms**. `FLAG_FSI_REQUESTED_BUT_DENIED` (0x4000, hidden) is "set by the system if the app that sent this notification does not have the permission to send full screen intents". ⇒ **If the FSI permission is denied, attaching an FSI still buys a 60-second heads-up instead of 5 s.**
- Normal heads-up timing (config.xml): `heads_up_notification_decay` **5000 ms**; `heads_up_notification_minimum_time` 2000 ms (500 ms with the HUN-throttling flag); `touch_acceptance_delay` **700 ms** (taps in the first 700 ms are swallowed: `shouldSwallowClick`); `auto_heads_up_notification_decay` 3000 ms; `heads_up_default_snooze_length_ms` **60000 ms** (after the user swipes a HUN *up*, that package cannot heads-up again for 60 s — `isSnoozed(packageName)`; FSI-bearing entries are exempt from the snooze suppressor); `ambient_notification_extension_time` 10000 ms.
- `hasJustLaunchedFullScreenIntent()`: 2 s cooldown after an FSI launch during which the same entry won't heads-up.

### 3.4 Lock-screen presentation of the FSI Activity (MEMORY, API 27+)
Declare `android:showWhenLocked="true"` and `android:turnScreenOn="true"` (or call `setShowWhenLocked(true)`/`setTurnScreenOn(true)` in `onCreate`) so the Activity renders over the keyguard when the FSI fires on a locked/off device; call `KeyguardManager.requestDismissKeyguard()` only when the user chooses an action that needs the unlocked device.

---

## 4. Heads-up notifications, actions, cooldown, Live Updates

### 4.1 Requirements for a heads-up to appear (VERIFIED — SystemUI `interruption/CommonVisualInterruptionSuppressors.kt`)
A PEEK (heads-up) is suppressed when any of these holds:
- `PeekDisabledSuppressor`: global `HEADS_UP_NOTIFICATIONS_ENABLED == HEADS_UP_OFF`.
- `PeekNotImportantSuppressor`: ranking `importance < IMPORTANCE_HIGH` → **channel must be IMPORTANCE_HIGH** (user can lower it).
- `PeekDeviceNotInUseSuppressor`: screen off or dreaming (then FSI/pulse logic applies instead).
- `PeekDndSuppressor`: DND `SUPPRESSED_EFFECT_PEEK`.
- `PeekPackageSnoozedSuppressor`: package snoozed (user swiped a HUN away within the last 60 s) — **skipped if the entry has an FSI**.
- `PeekOldWhenSuppressor`: `when` older than `MAX_HUN_WHEN_AGE_MS` (constant lives in `NotificationInterruptStateProviderImpl`; value not read — I believe 24 h, MEMORY) — skipped for FSI, foreground-service and user-initiated-job notifications. ⇒ always `setWhen(System.currentTimeMillis())` (default) or `setShowWhen(false)`; never back-date `when` to the transaction time if it is old.
- `PeekAlreadyBubbledSuppressor`, `HunGroupAlertBehaviorSuppressor` (group child with suppressed alerting), `HunSilentNotificationSuppressor` (`isSilent`), `HunJustLaunchedFsiSuppressor` (2 s), `AlertAppSuspendedSuppressor`, `AlertKeyguardVisibilitySuppressor` (notification hidden on keyguard by visibility/lockscreen settings), `AvalancheSuppressor` (§4.3).

### 4.2 Actions, RemoteInput, misc builder facts (VERIFIED — build-notification doc unless marked)
- "A notification can offer **up to three action buttons** … these action buttons must not duplicate the action performed when the user taps the notification."
- `addAction(icon, label, pendingIntent)`; broadcast PendingIntents are fine for actions that need no UI. Android 14: a *mutable* PendingIntent whose Intent has no component/package throws; use explicit components and `FLAG_IMMUTABLE` everywhere except the RemoteInput action (`FLAG_MUTABLE`) (VERIFIED behavior-changes-14 + doc examples).
- Direct reply: `RemoteInput.Builder(KEY).setLabel(...).build()` → `NotificationCompat.Action.Builder(...).addRemoteInput(remoteInput)`; read with `RemoteInput.getResultsFromIntent(intent)?.getCharSequence(KEY)`; **you must re-`notify()` the same id (or cancel) afterwards** to dismiss the reply UI/spinner; use distinct request codes per transaction. `RemoteInput.Builder.setChoices(...)` can offer canned choices (MEMORY) — useful for "Other category" picker in the shade.
- Android 10+: the system may auto-generate contextual actions/replies if you add none; opt out with `setAllowSystemGeneratedContextualActions(false)` / `setAllowGeneratedReplies(false)`.
- `setOnlyAlertOnce(true)` on updates; `setTimeoutAfter(ms)` to auto-cancel; `setAutoCancel(true)`; `setVisibility(VISIBILITY_PRIVATE)` + `setPublicVersion()` for the lock screen (amount/merchant are sensitive); `setCategory`.
- Rate limits: ≤1 alert sound per second (8.1+); too-frequent updates (many per second) may be dropped.
- Android 12+: custom `RemoteViews` are forced into the standard template (collapsed max 48 dp); Android 17 adds strict size limits on custom views (REPORTED Beta 1 notes). **Avoid custom views; use the standard template with actions.**
- Android 12+: foreground-service notifications may be **delayed up to 10 s** by the system unless `setForegroundServiceBehavior(FOREGROUND_SERVICE_IMMEDIATE)` (behaviour VERIFIED behavior-changes-12 "UX delay"; API name MEMORY).
- Android 14+: `setOngoing(true)` no longer prevents the user from swiping a notification away except when locked, during "Clear all", or for CallStyle/DPC/media/search-selector notifications (VERIFIED behavior-changes-14 "all apps"). ⇒ our ongoing "pay window" or FGS notification can be dismissed; use `setDeleteIntent` to notice and do not re-post aggressively.
- Android 13+: `POST_NOTIFICATIONS` runtime permission is required to post anything (VERIFIED).

### 4.3 Notification cooldown, avalanche, HUN throttling (Android 15 QPR-era → 16/17)
- **Cooldown ("polite notifications")** lives in system_server `NotificationAttentionHelper.java` (VERIFIED). Settings.System keys `NOTIFICATION_COOLDOWN_ENABLED` (default 1), `NOTIFICATION_COOLDOWN_ALL` (default 1 = per package rather than per channel), `NOTIFICATION_COOLDOWN_VIBRATE_UNLOCKED` (default 0). States DEFAULT→POLITE→MUTED, driven by timing constants from `SystemUiSystemPropertiesFlags` (`NOTIF_COOLDOWN_T1/T2`, `NOTIF_VOLUME1/2`, `NOTIF_COOLDOWN_COUNTER_RESET`, `NOTIF_AVALANCHE_TIMEOUT`; values not in the file). **It scales sound volume and vibration intensity only; it never touches the heads-up/visual path** (VERIFIED negative result in that file). User-facing: Settings → Notifications → Notification cooldown (REPORTED; options "Apply to all"/"Apply to conversations"/"Don't use"). It shipped in Android 15 QPR betas and is on by default in Android 16 (Wikipedia: "lowers the sound and minimizes alerts for up to two minutes. Priority notifications such as calls and alarms are not affected"). Impact on us: our second/third purchase popup within ~2 minutes may be quieter or silent, but still heads-up.
- **Cross-app "avalanche"** (same file): triggered by `ACTION_AIRPLANE_MODE_CHANGED` (to off), `ACTION_BOOT_COMPLETED`, `ACTION_USER_SWITCHED`, `ACTION_MANAGED_PROFILE_AVAILABLE`; for `NOTIF_AVALANCHE_TIMEOUT` ms afterwards non-exempt alerts are muted. Exempt (full volume): important conversations, `CallStyle`, `CATEGORY_REMINDER`, `CATEGORY_EVENT`, emergency categories; additionally not muted: recent conversations, **notifications with a full-screen intent**, colorized notifications.
- **SystemUI `AvalancheSuppressor`** (VERIFIED): while an avalanche is active (same triggers, `AvalancheProvider.timeoutMs`), heads-ups are suppressed unless the notification is: a conversation posted after the avalanche started, a priority conversation, `CallStyle`, `CATEGORY_REMINDER`, `CATEGORY_ALARM`, car emergency/warning, `CATEGORY_EVENT`, **has a full-screen intent**, is colorized, or the package holds `RECEIVE_EMERGENCY_BROADCAST`. It also posts a one-time "education" notification. If the cooldown setting is off, nothing is suppressed.
- **`AvalancheController`** (VERIFIED, flag `NotificationThrottleHun`): shows one HUN at a time; queued HUNs are sorted and only the top one is shown next, the rest dropped (`AVALANCHE_THROTTLING_HUN_DROPPED`); the showing HUN's duration shrinks to **500 ms** if a higher-priority HUN waits, **1000 ms** if same priority.
- Design takeaway: attach a fullScreenIntent (even if the permission is denied) and consider `CATEGORY_REMINDER`; both make the purchase heads-up immune to avalanche suppression and the package-snooze suppressor. Colorized is honoured only for FGS/media notifications (MEMORY), so it is not a lever for the purchase popup.

### 4.4 Android 16 Live Updates / `Notification.ProgressStyle` / promoted ongoing notifications (VERIFIED — developer.android.com/develop/ui/views/notifications/live-update, Notification.java; version timing REPORTED)
- Manifest: `<uses-permission android:name="android.permission.POST_PROMOTED_NOTIFICATIONS" />` — "non-runtime permission, so the user isn't prompted"; users can disable Live Updates per app; `NotificationManager.canPostPromotedNotifications()` tells you; deep link via `Settings.ACTION_MANAGE_APP_PROMOTED_NOTIFICATIONS` + `EXTRA_APP_PACKAGE` (doc name). AOSP `main` names the action `ACTION_APP_NOTIFICATION_PROMOTION_SETTINGS` = `"android.settings.APP_NOTIFICATION_PROMOTION_SETTINGS"` (`@FlaggedApi(FLAG_API_RICH_ONGOING)`) — **discrepancy; use whatever symbol the compile SDK exposes.**
- Request promotion with `Notification.Builder.setRequestPromotedOngoing(true)` / `NotificationCompat.Builder.setRequestPromotedOngoing` (androidx core 1.17.0-alpha01, June 18 2025, VERIFIED release notes) or extra `EXTRA_REQUEST_PROMOTED_ONGOING`. Criteria: style ∈ {standard, BigTextStyle, CallStyle, ProgressStyle, MetricStyle}; `setOngoing(true)`; has `contentTitle`; no `customContentView`; not a group summary; not colorized; channel not `IMPORTANCE_MIN`. Check with `Notification.hasPromotableCharacteristics()`; the system sets `FLAG_PROMOTED_ONGOING` (0x40000, readable by the app and by NotificationListenerServices).
- Status-bar chip: shown when promoted and not in view; icon + optional `setShortCriticalText(String)` (≤ ~7 chars suggested; max width 96 dp). **Countdown support (VERIFIED):** "`setWhen(long)`: If the when time is at least 2 minutes ahead, the chip shows a countdown, such as '5min'"; "`setUsesChronometer(true)` shows a timer in the chip, and `setChronometerCountDown(true)` makes it count down. The timer is shown while the value is positive." Promoted cards sit at the top of the shade and on the lock screen, expanded and non-collapsible.
- Usage rules: ongoing, user-initiated, time-sensitive activities with a clear start and end; **not** for ads/promos/chat/alerts/upcoming calendar events/quick access ("use a widget or Quick Settings tile"); include an **Unpin** action for background monitoring; don't re-post after the user dismisses (`setDeleteIntent` to detect); OEMs may add criteria.
- Version timing: `ProgressStyle` is documented under Android 16 features (VERIFIED, page updated 2026-03-03); the chip was reportedly disabled in stable 16 and enabled in Android 16 QPR1 (Sept 2025), which also introduced the `POST_PROMOTED_NOTIFICATIONS` + `requestPromotedOngoing` requirement (REPORTED, Android Authority snippet). On devices that don't support promotion the notification is simply an ordinary ongoing notification (VERIFIED customer.io fallback statement).
- **For the "unlock window" countdown this is a good fit on 16 QPR1+/17:** user-initiated ("Unlock card for 3 minutes"), bounded, time-sensitive; chip text e.g. "2:59"; actions "Lock now"/"Extend". Fallback on ≤15 and when the user disabled Live Updates: ordinary ongoing notification with `setUsesChronometer(true)`/`setChronometerCountDown(true)` (Android 7+, MEMORY), plus the QS tile.

---

## 5. Overlays, Bubbles, Quick Settings tiles, lock screen

### 5.1 SYSTEM_ALERT_WINDOW overlays (`TYPE_APPLICATION_OVERLAY`)
- Permission: `android.permission.SYSTEM_ALERT_WINDOW`, protectionLevel `signature|setup|appop|installer|pre23|development` (VERIFIED AndroidManifest.xml). Check `Settings.canDrawOverlays(context)`. Since Android 11, `Settings.ACTION_MANAGE_OVERLAY_PERMISSION` "always bring[s] the user to the top-level Settings screen … Any `package:` data in the intent is ignored" (VERIFIED about/versions/11/privacy/permissions) — the user must find the app in the list ("Display over other apps"). Auto-grant exists only for `ROLE_CALL_SCREENING` holders and active `MediaProjection` capture (VERIFIED) — not us. adb: `adb shell appops set <pkg> SYSTEM_ALERT_WINDOW allow` (MEMORY; the op name is confirmed by `OP_SYSTEM_ALERT_WINDOW` usage in ATMS).
- **Android 15+ Enhanced Confirmation:** `OPSTR_SYSTEM_ALERT_WINDOW` is in ECM's `PROTECTED_SETTINGS` (VERIFIED, Permission module `EnhancedConfirmationService.java`), so a *guarded* sideloaded app (§7.2) hits the "Restricted setting" dialog when the user tries to enable "Display over other apps". adb-installed apps are not guarded on 13/14 and probably not on 15+ (§7.2).
- Showing it from a Service: `WindowManager.addView(view, WindowManager.LayoutParams(w, h, TYPE_APPLICATION_OVERLAY, flags, PixelFormat.TRANSLUCENT))`. Window type sits above app windows and below system UI (status bar, keyguard, IME) (MEMORY from the LayoutParams Javadoc) ⇒ **overlays are not visible over the lock screen**; use the FSI/Activity path there.
- **Compose in an overlay (VERIFIED by ComposeView Javadoc + REPORTED tutorials):** `ComposeView` requires a `ViewTreeLifecycleOwner` and `ViewTreeSavedStateRegistryOwner` (and a `ViewTreeViewModelStoreOwner` if you use viewModels) on the hierarchy; adding it via `WindowManager` without them crashes with `IllegalStateException: ViewTreeLifecycleOwner not found`. Pattern: make the Service (or a small holder object) implement `LifecycleOwner` + `SavedStateRegistryOwner`, call `savedStateRegistryController.performAttach()/performRestore(null)`, move the lifecycle to CREATED/STARTED/RESUMED when showing, and call `view.setViewTreeLifecycleOwner(owner)`, `setViewTreeSavedStateRegistryOwner(owner)`, `setViewTreeViewModelStoreOwner(owner)` before `addView`. Tear down with `removeView` and `ON_DESTROY`.
- **Untrusted-touch blocking (Android 12+, VERIFIED behavior-changes-all 12):** the system blocks touches *passing through* overlays to the app underneath when the overlay uses `FLAG_NOT_TOUCHABLE` and the combined overlay opacity exceeds the maximum obscuring opacity (0.8 by default); `TYPE_APPLICATION_OVERLAY` windows are "**not** trusted". Logcat `Untrusted touch due to occlusion by PACKAGE_NAME`. Our modal popup consumes its own touches, so it is unaffected; a non-interactive banner laid over Wallet must stay ≤0.8 alpha or it will make Wallet's buttons under it dead.
- **`HIDE_OVERLAY_WINDOWS` is protectionLevel `normal`** (VERIFIED AndroidManifest.xml: "Allows an app to prevent non-system-overlay windows from being drawn on top of it"); any app may call `Window.setHideOverlayWindows(true)` and our overlay disappears while that window is on top. **Whether Google Wallet/Play services do this on the payment/confirmation screens is unknown (open question; test on device).** If they do, the overlay path fails exactly when Wallet is in front, and the Activity-via-SAW path (which is not an overlay) is the fallback.
- Android 12+: `ACTION_CLOSE_SYSTEM_DIALOGS` is deprecated/`SecurityException` for target 31+ — an overlay cannot collapse the notification shade (VERIFIED).
- Android 15+ FGS exemption: holding SAW only exempts an FGS start from the background if a `TYPE_APPLICATION_OVERLAY` window is currently visible (check `View.getWindowVisibility()`) (VERIFIED behavior-changes-15).

### 5.2 Bubbles (VERIFIED — bubbles doc; AOSP `BubbleController.java` partially)
Requirements: `BubbleMetadata` (intent+icon or shortcut id); target 30+ must meet the conversation requirements (long-lived sharing shortcut via `ShortcutManagerCompat.pushDynamicShortcut`, `MessagingStyle`/`Person`); channel ≥ `IMPORTANCE_MIN`; bubble Activity `android:allowEmbedded="true" android:resizeableActivity="true"`; the user must allow bubbles for the app ("Allow all"/"Allow selected"); on a locked device bubbles show as normal notifications; `setAutoExpandBubble(true)` + `setSuppressNotification(true)` recommended only when the user's own action created the bubble. I could not find a foreground-app gate in the visible part of `BubbleController` — but the doc's guidance plus the conversation requirement make bubbles a poor fit for a transaction popup (we would have to fake a conversation per purchase). Android 17 turns Bubbles into a general windowing mode (REPORTED/VERIFIED doc note). **Verdict: not a primary surface; optional "budget status" bubble later.**

### 5.3 Quick Settings tile for "Unlock to pay" (VERIFIED — quicksettings-tiles doc + behavior-changes-14)
- Manifest: `<service android:permission="android.permission.BIND_QUICK_SETTINGS_TILE" android:exported="true" android:icon=… android:label=…(≤18 chars)>` with `<intent-filter><action android:name="android.service.quicksettings.action.QS_TILE"/></intent-filter>`, `<meta-data android:name="android.service.quicksettings.ACTIVE_TILE" android:value="true"/>` (active mode: bound only on add/remove/tap/`requestListeningState`), optional `TOGGLEABLE_TILE`. Icon: solid white 24 dp vector.
- Lifecycle: `onTileAdded`, `onStartListening`/`onStopListening` (update `qsTile.state/label/subtitle/icon` then `qsTile.updateTile()`), `onClick`, `onTileRemoved`. Push refreshes with static `TileService.requestListeningState(context, ComponentName)`; in active mode you may update once per listening session.
- Launching UI: **target 34+ must use `startActivityAndCollapse(PendingIntent)`; the `Intent` overload throws `UnsupportedOperationException`** (VERIFIED). Intent needs `FLAG_ACTIVITY_NEW_TASK` (API 28+). `showDialog(Dialog)` collapses the panel but is invisible when `isLocked()`; use `unlockAndRun(Runnable)` for secure actions and `isSecure()` to hide sensitive data. Tiles are reachable from the lock screen QS.
- Android 13+: `StatusBarManager.requestAddTileService(componentName, label, icon, executor, callback)` shows a system prompt to add the tile (result codes: added / not added / already added / error); repeated denials make the system stop processing requests.
- Long-press → App info unless an Activity handles `ACTION_QS_TILE_PREFERENCES`.

### 5.4 Lock-screen presence summary
- Notification on lock screen: controlled by `setVisibility` + user settings; `VISIBILITY_PRIVATE` with `setPublicVersion()` hides amount/merchant; Android 15 also hides content during screen sharing unless a public version exists (VERIFIED behavior-changes-all 15).
- FSI Activity over keyguard: `showWhenLocked`/`turnScreenOn` (§3.4). Overlays: not over keyguard (§5.1).
- Promoted (Live Update) notifications appear prominently on the lock screen (§4.4).
- TileService works from lock-screen QS with `unlockAndRun` (§5.3).

---

## 6. Keeping the sensing/enforcement alive

### 6.1 NotificationListenerService (VERIFIED — `core/java/android/service/notification/NotificationListenerService.java` Javadoc, `ManagedServices.java`)
```xml
<service android:name=".sense.WalletNotificationListener"
    android:label="@string/listener_label"
    android:permission="android.permission.BIND_NOTIFICATION_LISTENER_SERVICE"
    android:exported="true">
  <intent-filter>
    <action android:name="android.service.notification.NotificationListenerService"/>
  </intent-filter>
  <!-- optional -->
  <meta-data android:name="android.service.notification.default_filter_types"
      android:value="conversations|alerting|silent|ongoing"/>
  <meta-data android:name="android.service.notification.disabled_filter_types" android:value=""/>
</service>
```
- `SERVICE_INTERFACE = "android.service.notification.NotificationListenerService"`. `META_DATA_DEFAULT_AUTOBIND = "android.service.notification.default_autobind_listenerservice"` (false ⇒ bound only on `requestRebind`). `META_DATA_DEFAULT_FILTER_TYPES` (absent ⇒ **all types**; present-but-empty ⇒ none; ignored once the app/user set a list) and `META_DATA_DISABLED_FILTER_TYPES`. Filter flags: `FLAG_FILTER_TYPE_CONVERSATIONS=1`, `ALERTING=2`, `SILENT=4`, `ONGOING=8` (ongoing with importance > MIN). **Leave filters at default (all) or at least include SILENT: Wallet's payment notification may be posted on a low-importance channel, and the self-test notification (§6.6) is silent.**
- Lifecycle: all callbacks on the main thread (N+); "wait for `onListenerConnected()` before performing any operations" (e.g., `getActiveNotifications()`); after `onListenerDisconnected()` "no more events arrive … Only `requestRebind(ComponentName)` may be called". `requestRebind` "Fails if the user has not granted the permission". `requestUnbind()` ⇒ system will likely kill the service. Not bound on low-RAM devices on Q and below; listeners in a work profile are ignored.
- How system_server binds (ManagedServices): flags `BIND_AUTO_CREATE | BIND_FOREGROUND_SERVICE | BIND_ALLOW_WHITELIST_MANAGEMENT`; `onServiceDisconnected` only logs "connection lost" (the `BIND_AUTO_CREATE` binding stays, so ActivityManager restarts the process/service with its usual crash back-off — INFERRED); `onBindingDied` unbinds and schedules **one** retry after `ON_BINDING_DIED_REBIND_DELAY_MS = 10000`; package updates (`onPackagesChanged`) trigger `rebindServices`; `onNullBinding` unbinds. The approved list is persisted in the notification policy XML (`service_listing`, DB_VERSION 4); `Settings.Secure.enabled_notification_listeners` is only a mirror (`shouldReflectToSettings`), **so writing that secure setting with `WRITE_SECURE_SETTINGS` is not a reliable way to grant access (INFERRED).** The reliable shell path is `adb shell cmd notification allow_listener <pkg>/<cls> [user_id]` → `setNotificationListenerAccessGrantedForUser(cn, userId, true, true)` (VERIFIED `NotificationShellCmd.java`; `disallow_listener` reverses it). Shizuku can run the same command from inside the app.
- Process priority: being bound with `BIND_FOREGROUND_SERVICE` by system_server keeps the NLS process at foreground-service importance while bound (INFERRED), so the ordinary LMK rarely kills it; what kills it is user force-stop, "stopped state", OEM sleep lists, and Android 15's package-stopped handling.
- Android 15: untrusted listeners get redacted text when an **OTP** is detected (VERIFIED). Wallet purchase notifications contain no OTP ⇒ unaffected (INFERRED). Android 17's SMS OTP delay does not involve NLS.
- Known failure mode (REPORTED: forum/anecdotes, one Xiaomi test taking 10–13 s): the listener stays "enabled" in Settings but receives nothing after an app update or crash loop. Known remedies: `requestRebind`, then toggling the component (`PackageManager.setComponentEnabledSetting(cn, COMPONENT_ENABLED_STATE_DISABLED, DONT_KILL_APP)` then `…_ENABLED`) which makes `onPackagesChanged` rebind, then asking the user to toggle Notification access off/on.

### 6.2 Foreground service types (VERIFIED — fgs/service-types, fgs-types-required, behavior-changes-15)
- Target 34+: every FGS declares `android:foregroundServiceType`; missing type ⇒ `MissingForegroundServiceTypeException`; each type needs `FOREGROUND_SERVICE` plus a type permission.
- **`specialUse`**: permission `android.permission.FOREGROUND_SERVICE_SPECIAL_USE`; manifest `<service android:foregroundServiceType="specialUse"><property android:name="android.app.PROPERTY_SPECIAL_USE_FGS_SUBTYPE" android:value="budget-enforcement: keeps the purchase listener and tap-to-pay lock alive"/></service>`; `startForeground(id, notif, FOREGROUND_SERVICE_TYPE_SPECIAL_USE)`; no runtime prerequisite, **no timeout**, Play review irrelevant for a sideloaded app. `dataSync` would be wrong: 6 h/24 h cap on target 35+ (`Service.onTimeout`, "Time limit already exhausted for foreground service type dataSync") and it is banned from `BOOT_COMPLETED` receivers. `shortService` is capped at ~3 min. `systemExempted` is reserved (but note: holders of `SCHEDULE_EXACT_ALARM`/`USE_EXACT_ALARM` are listed as eligible — interesting but unnecessary). `connectedDevice` requires NFC/Bluetooth permissions and is semantically off.
- Android 15 (target 35+): `BOOT_COMPLETED` receivers may **not** start `dataSync`, `camera`, `mediaPlayback`, `phoneCall`, `mediaProjection`, `microphone` FGS — `specialUse` is **allowed** (VERIFIED list).

### 6.3 Starting an FGS from the background (VERIFIED — fgs/restrictions-bg-start)
Target 31+ cannot `startForegroundService()` from the background unless one of: app transitions from a visible state; app may start activities from background (e.g., **SAW holder; target 35+ needs SAW + a visible overlay**); high-priority FCM; user acts on a UI element (notification action, bubble, widget, activity); **exact alarm** fires to complete a user-requested action; app is current IME; geofence/activity-recognition event; `ACTION_BOOT_COMPLETED`/`ACTION_LOCKED_BOOT_COMPLETED`/`ACTION_MY_PACKAGE_REPLACED`; `ACTION_TIMEZONE_CHANGED`/`ACTION_TIME_CHANGED`/`ACTION_LOCALE_CHANGED`; `ACTION_TRANSACTION_DETECTED` from NfcService (HCE apps); device/profile owner; Companion Device Manager with `REQUEST_COMPANION_START_FOREGROUND_SERVICES_FROM_BACKGROUND`; **"The user turns off battery optimizations for your app."** Violations throw `ForegroundServiceStartNotAllowedException`. **Negative result: a NotificationListenerService callback is not an exemption** — so the FGS must be started at boot/on app launch/from a notification action/exact alarm, or the app must hold the battery-optimization exemption.

### 6.4 Boot, stopped state, Doze, buckets, alarms, jobs
- Boot: `RECEIVE_BOOT_COMPLETED` + manifest receiver for `ACTION_BOOT_COMPLETED` (and `ACTION_LOCKED_BOOT_COMPLETED` on a `directBootAware` receiver if you want to start before first unlock; device-protected storage only — MEMORY). Android 14 queues *context-registered* broadcasts while the app is cached; manifest receivers are not queued (VERIFIED).
- **Android 15 "stopped state"**: when the user force-stops the app, the system also **cancels all PendingIntents** and disables widgets; when the user later launches the app, `ACTION_BOOT_COMPLETED` is delivered again so you can re-register alarms (VERIFIED behavior-changes-all 15). Design: treat `BOOT_COMPLETED` as "re-arm everything", idempotently.
- Doze (VERIFIED doze-standby): network suspended, wake locks ignored, standard alarms (`setExact`, `setWindow`) deferred to maintenance windows, no Wi-Fi scans, no sync adapters, **no JobScheduler/WorkManager**; `setAndAllowWhileIdle`/`setExactAndAllowWhileIdle` fire but **≤1 per 9 minutes per app**; `setAlarmClock` always fires. Battery-optimization exemption lets the app use network and partial wake locks in Doze; "its regular AlarmManager alarms don't fire" still applies.
- App Standby buckets: test with `adb shell am set-standby-bucket <pkg> active|working_set|frequent|rare|restricted`, `am get-standby-bucket`, `am set-inactive <pkg> true`. Posting a notification the user sees keeps the app out of standby (VERIFIED). Android 16: active bucket now has an enforced (generous) job quota; jobs running concurrently with an FGS obey the quota; `JobScheduler#getPendingJobReasonsHistory`, `WorkInfo.getStopReason()`, new `STOP_REASON_TIMEOUT_ABANDONED` (VERIFIED behavior-changes-all 16).
- Battery optimization exemption: permission `android.permission.REQUEST_IGNORE_BATTERY_OPTIMIZATIONS` is **`normal`** (VERIFIED manifest) ⇒ fine for a sideloaded app; `Intent(Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS, Uri.parse("package:$pkg"))` shows the system dialog (REPORTED wording: "Let <app> always run in the background? … may reduce battery life"); check `PowerManager.isIgnoringBatteryOptimizations(pkg)`; `Settings.ACTION_IGNORE_BATTERY_OPTIMIZATION_SETTINGS` opens the list. Play's policy against it does not apply to us. adb: `adb shell dumpsys deviceidle whitelist +<pkg>` (MEMORY). Side benefits (VERIFIED): the exemption is an FGS-from-background exemption (§6.3) and "apps on the power allowlist" may call `setExact()`/`setExactAndAllowWhileIdle()` without `SCHEDULE_EXACT_ALARM` (schedule-exact-alarms page).
- Exact alarms (VERIFIED alarms/schedule + 14/changes/schedule-exact-alarms): target 31+ needs `SCHEDULE_EXACT_ALARM` (protection `signature|privileged|appop`, user-revocable, **denied by default on Android 14+ for newly installed apps targeting 33+** unless alarm-clock/calendar) for `setExact`, `setExactAndAllowWhileIdle`, `setAlarmClock` (PendingIntent variants) — else `SecurityException`; request via `Settings.ACTION_REQUEST_SCHEDULE_EXACT_ALARM` (+`package:` URI → `RESULT_OK`/`RESULT_CANCELED`), check `AlarmManager.canScheduleExactAlarms()`, listen for `ACTION_SCHEDULE_EXACT_ALARM_PERMISSION_STATE_CHANGED`. `USE_EXACT_ALARM` is `normal`, auto-granted, "Subject to … Google Play policy" (alarm/calendar) — a sideloaded app *can* declare it, but it is an abuse of intent; prefer the next bullet. **`OnAlarmListener` variants need no permission** ("If the exact alarm is set using an OnAlarmListener object, like in the setExact API, the SCHEDULE_EXACT_ALARM permission isn't required") — they require our process to be alive, which the NLS binding provides; Android 17 adds `setExactAndAllowWhileIdle(…, OnAlarmListener)` (VERIFIED release notes Beta 3). `setWindow` minimum 10 min; WorkManager periodic minimum 15 min; expedited work for short urgent jobs.

### 6.5 OEM task killers (dontkillmyapp.com; the site's Samsung page was last updated 07/2024 and covers One UI through Android 14 — paths on One UI 7/8 are REPORTED/MEMORY and must be re-checked on the actual device)
- Samsung (VERIFIED page content for Android 11–14): Settings → Apps → [app] → Battery → "Unrestricted" (Android 12+ wording) / "Don't optimize"; Settings → Battery → Background usage limits → add to **Never sleeping apps**, remove from Sleeping/Deep sleeping; turn **off** "Put unused apps to sleep" and "Auto-disable unused apps"/"Remove permissions if app is unused"; disable **Adaptive battery**; Samsung's Battery Guardian/Memory Guardian ("Good Guardians") can close apps — exclude ours; the page notes Samsung said it would drop non-standard optimizations for apps targeting Android 14 (REPORTED). One UI 7/8 (Android 15/16) keep the same concepts under Settings → Battery → Background usage limits (REPORTED/MEMORY).
- Pixel/AOSP: rated 0 on dontkillmyapp's scale (VERIFIED page): Settings → Apps → [app] → Battery → **Unrestricted** (equals the battery-optimization exemption); keep "Pause app activity if unused"/permission auto-reset off for our app (auto-reset affects runtime permissions only — VERIFIED Android 11 page — not NLS/SAW grants).
- There is "no known solution on dev end" beyond the standard exemption + FGS + notification presence (VERIFIED page statement).

### 6.6 Watchdog pattern for "listener silently disconnected" (design, INFERRED from the verified facts above)
1. Persist `lastListenerConnectedAt`, `lastWalletNotificationAt`, `lastSelfTestPassedAt` in DataStore.
2. Self-test every N minutes (WorkManager periodic ≥15 min, or an `OnAlarmListener` `setAndAllowWhileIdle` alarm, ≤1 per 9 min in Doze): post a notification to a private `IMPORTANCE_LOW` channel (silent; keep SILENT in the listener filter), expect `onNotificationPosted` for our own package within ~5 s, then cancel it (`NotificationManager.cancel`). Success ⇒ `lastSelfTestPassedAt = now`.
3. Failure ⇒ `NotificationListenerService.requestRebind(cn)`; wait 15 s for `onListenerConnected`; else toggle the component enabled state; wait 15 s; else post a high-importance "Save can't see purchases — tap to repair" notification whose content PendingIntent opens `ACTION_NOTIFICATION_LISTENER_DETAIL_SETTINGS` with `EXTRA_NOTIFICATION_LISTENER_COMPONENT_NAME`.
4. On every `onListenerConnected`: call `getActiveNotifications()` and reconcile Wallet notifications posted while we were down (dedupe by `StatusBarNotification.key`/`postTime`); also check `NotificationManager.isNotificationListenerAccessGranted(cn)` (API 27, MEMORY) on app start.
5. Reason the FGS exists at all: on Samsung, an FGS notification + "never sleeping" is the practical difference between surviving and not. On Pixel the NLS binding alone usually suffices. Make the FGS a user-visible toggle defaulting ON for non-Pixel manufacturers.

---

## 7. Permission onboarding

### 7.1 Deep links (Settings intent actions, VERIFIED from `core/java/android/provider/Settings.java` unless marked)
| Purpose | Action constant → string | Input |
|---|---|---|
| Notification access list | `ACTION_NOTIFICATION_LISTENER_SETTINGS` → `android.settings.ACTION_NOTIFICATION_LISTENER_SETTINGS` | none |
| Notification access for *our* listener (API 30) | `ACTION_NOTIFICATION_LISTENER_DETAIL_SETTINGS` → `android.settings.NOTIFICATION_LISTENER_DETAIL_SETTINGS` | extra `EXTRA_NOTIFICATION_LISTENER_COMPONENT_NAME` (`android.provider.extra.NOTIFICATION_LISTENER_COMPONENT_NAME`) = `ComponentName.flattenToString()` |
| Display over other apps | `ACTION_MANAGE_OVERLAY_PERMISSION` → `android.settings.action.MANAGE_OVERLAY_PERMISSION` | `package:` ignored since R (top-level list) |
| Full-screen notifications (API 34) | `ACTION_MANAGE_APP_USE_FULL_SCREEN_INTENT` (string MEMORY) | `package:` URI |
| Battery exemption dialog | `ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS` → `android.settings.REQUEST_IGNORE_BATTERY_OPTIMIZATIONS` | `package:` URI; needs the normal permission |
| Battery exemption list | `ACTION_IGNORE_BATTERY_OPTIMIZATION_SETTINGS` → `android.settings.IGNORE_BATTERY_OPTIMIZATION_SETTINGS` | none |
| Exact alarms (API 31) | `ACTION_REQUEST_SCHEDULE_EXACT_ALARM` → `android.settings.REQUEST_SCHEDULE_EXACT_ALARM` | optional `package:` URI |
| Accessibility list | `ACTION_ACCESSIBILITY_SETTINGS` → `android.settings.ACCESSIBILITY_SETTINGS` | none (the per-service detail action is `@SystemApi`) |
| App notification settings | `ACTION_APP_NOTIFICATION_SETTINGS` → `android.settings.APP_NOTIFICATION_SETTINGS` | `EXTRA_APP_PACKAGE` (`android.provider.extra.APP_PACKAGE`) |
| Channel settings | `ACTION_CHANNEL_NOTIFICATION_SETTINGS` → `android.settings.CHANNEL_NOTIFICATION_SETTINGS` | `EXTRA_APP_PACKAGE` + `EXTRA_CHANNEL_ID` (`android.provider.extra.CHANNEL_ID`) |
| App info | `ACTION_APPLICATION_DETAILS_SETTINGS` → `android.settings.APPLICATION_DETAILS_SETTINGS` | `package:` URI |
| Live Updates per app (16 QPR1+) | doc: `ACTION_MANAGE_APP_PROMOTED_NOTIFICATIONS`; AOSP main: `ACTION_APP_NOTIFICATION_PROMOTION_SETTINGS` → `android.settings.APP_NOTIFICATION_PROMOTION_SETTINGS` | `EXTRA_APP_PACKAGE` |
| Bubbles per app | `ACTION_APP_NOTIFICATION_BUBBLE_SETTINGS` → `android.settings.APP_NOTIFICATION_BUBBLE_SETTINGS` | `EXTRA_APP_PACKAGE` |
| DND access | `ACTION_NOTIFICATION_POLICY_ACCESS_SETTINGS` → `android.settings.NOTIFICATION_POLICY_ACCESS_SETTINGS` | none |

### 7.2 "Restricted settings" for sideloaded apps (Android 13+) — mechanics (VERIFIED code)
- Android 13/14 (legacy branch in `InstallPackageHelper.handlePackagePostInstall`): the install sets app-op `OP_ACCESS_RESTRICTED_SETTINGS` to **`MODE_ERRORED` only when `request.getPackageSource()` is `PACKAGE_SOURCE_LOCAL_FILE` or `PACKAGE_SOURCE_DOWNLOADED_FILE`** (i.e., a file manager/browser-style installer declared it). `pm install`/`adb install` sets **`PACKAGE_SOURCE_OTHER` by default** ("Set package source to other by default. Can be overridden by --package-source", VERIFIED `PackageManagerShellCommand.makeInstallParams`) ⇒ **adb-installed builds are not restricted on 13/14.**
- Android 15+ with flags `enhancedConfirmationModeApisEnabled && extendEcmToAllSettings`: install sets `MODE_DEFAULT` and the Permission module's `EnhancedConfirmationService.isPackageEcmGuarded` decides lazily: not guarded if allowlisted/preinstalled; guarded if package source is LOCAL_FILE/DOWNLOADED_FILE; otherwise `!(trustPackagesInstalledViaNonAllowlistedInstallers() || installer preinstalled || allowlisted installer)` — "If no trusted installers are configured, every installer is treated as trusted". For adb (no installer package) the outcome depends on that device-config flag (INFERRED: trusted by default; **verify** with `adb shell appops get <pkg> ACCESS_RESTRICTED_SETTINGS` → `default`/`allow` = not guarded, `deny`/`ignore` = guarded). ECM states map to app-op modes: NOT_GUARDED=`MODE_ALLOWED`, GUARDED=`MODE_ERRORED`, GUARDED_AND_ACKNOWLEDGED=`MODE_IGNORED`, IMPLICIT=`MODE_DEFAULT`.
- Protected settings under ECM (VERIFIED): accessibility (`OPSTR_BIND_ACCESSIBILITY_SERVICE`), **notification listener (`OPSTR_ACCESS_NOTIFICATIONS`)**, **`OPSTR_SYSTEM_ALERT_WINDOW`**, usage stats, device admin, SMS/MMS/cell-broadcast runtime permissions, dialer/SMS roles; `REQUEST_INSTALL_PACKAGES` only during untrusted calls (Android 16 flag). Not protected: FSI, battery exemption, exact alarms, POST_NOTIFICATIONS.
- User flow when guarded (VERIFIED support.google.com/android/answer/12623953): the toggle shows a "Restricted setting" dialog → Settings → Apps → [app] → ⋮ → **Allow restricted settings** → follow the prompts → retry the toggle. adb bypass: `adb shell appops set <pkg> ACCESS_RESTRICTED_SETTINGS allow` (INFERRED from the state mapping).
- **Recommendation: install with `adb install` (or Shizuku `pm install`) and say so in the README; never install from a file-manager download if you want a smooth onboarding.**

### 7.3 ADB / Shizuku one-time grants (for the "one-time ADB step is acceptable" constraint)
```
adb install -r app-release.apk                      # package source OTHER → no restricted-settings flag
adb shell cmd notification allow_listener com.save/.sense.WalletNotificationListener   # VERIFIED
adb shell appops set com.save SYSTEM_ALERT_WINDOW allow                                 # op name VERIFIED via OP_SYSTEM_ALERT_WINDOW
adb shell appops set com.save USE_FULL_SCREEN_INTENT allow                              # MEMORY
adb shell appops set com.save SCHEDULE_EXACT_ALARM allow                                # MEMORY (only if PendingIntent exact alarms are used)
adb shell dumpsys deviceidle whitelist +com.save                                        # MEMORY
adb shell appops set com.save ACCESS_RESTRICTED_SETTINGS allow                          # INFERRED; only if guarded
adb shell settings put secure enabled_accessibility_services com.save/.enforce.GateAccessibilityService  # MEMORY; only if the enforcement track needs it
adb shell pm grant com.save android.permission.POST_NOTIFICATIONS                       # runtime perm; MEMORY
```
Shizuku runs the same shell commands from inside the app (it executes as shell UID) — REPORTED/MEMORY; verify each command's output and re-check the real state through the public APIs afterwards (`isNotificationListenerAccessGranted`, `canDrawOverlays`, `canUseFullScreenIntent`, `isIgnoringBatteryOptimizations`, `canScheduleExactAlarms`).

### 7.4 Recommended onboarding order (and what the user sees — dialog descriptions REPORTED/MEMORY)
1. `POST_NOTIFICATIONS` runtime prompt (system dialog "Allow Save to send you notifications?"). Create channels right after: `purchases` (HIGH, "Pops on screen"), `pay_window` (DEFAULT, ongoing/Live Update), `service` (LOW, FGS), `selftest` (LOW), `alerts` (HIGH).
2. **Notification access** — explain "This is how Save sees Google Wallet's 'Paid $X' notifications; Save never reads other apps' content." Launch `ACTION_NOTIFICATION_LISTENER_DETAIL_SETTINGS` with our component; the page shows a single switch "Allow notification access" + a warning dialog listing what listeners can do (read notifications, dismiss, reply) — the user taps **Allow**. If guarded: "Restricted setting" dialog → §7.2 flow. Verify via `isNotificationListenerAccessGranted`.
3. **Display over other apps** — needed for the instant popup/gate. `ACTION_MANAGE_OVERLAY_PERMISSION` opens the full list; tell the user to find "Save" and switch on "Allow display over other apps". Verify via `canDrawOverlays`.
4. **Full-screen notifications** — only if `!canUseFullScreenIntent()`; explain it is for the locked/screen-off case.
5. **Battery: Unrestricted** — `ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS` (system "always run in background?" dialog); then on Samsung show the Never-sleeping-apps checklist with a button to Settings → Battery.
6. **Quick Settings tile** — `requestAddTileService` prompt ("Add tile to Quick Settings?").
7. Optional: exact alarms (skip by default; `OnAlarmListener` alarms need nothing), Live Updates toggle check (`canPostPromotedNotifications` on 16 QPR1+), Accessibility (only if the enforcement design needs it; last, because its warning is the scariest and it is ECM-protected).
8. Run the self-test (§6.6) and show a green/red status board; keep the board reachable from Settings in the app so the user can re-check after OS updates.

---

## 8. Decision table — event → best way to surface UI (per Android version)

Legend: SAW = "Display over other apps" granted; FSI✓ = `canUseFullScreenIntent()` true. "Activity-via-SAW" = `startActivity(FLAG_ACTIVITY_NEW_TASK)` from the service process (BAL_ALLOW_SAW_PERMISSION). "Overlay" = `TYPE_APPLICATION_OVERLAY` Compose window from the service.

| Event | Device state | Android 13 | Android 14 | Android 15 | Android 16 | Android 17 |
|---|---|---|---|---|---|---|
| **E1 Purchase notification seen** (categorize now) | screen on, unlocked (normal tap-to-pay) | SAW: Overlay bottom-sheet (or Activity-via-SAW). No SAW: HUN (IMPORTANCE_HIGH) + 3 chips + reply, with FSI attached → sticky HUN (FSI always granted on 13) | Same. No SAW: HUN+FSI → sticky while FSI✓; **60 s** if FSI denied; 5 s if no FSI | Same as 14. Mind that HUN sound may be "polite"-reduced on QPR builds | Same; cooldown on by default (sound only); avalanche-exempt thanks to FSI/CATEGORY_REMINDER | Same; avoid custom views (size limits); target-37 BAL changes don't affect direct `startActivity` from a SAW holder |
| E1 | screen off / locked (express transit, quick pocket) | FSI → Activity over keyguard (`showWhenLocked`). Overlay not visible on keyguard | FSI✓ → full-screen Activity; FSI✗ → 60 s HUN on lock screen/AOD + notification (VISIBILITY_PRIVATE + public version) | Same | Same | Same |
| E1 | DND on | Overlay/Activity-via-SAW unaffected by DND. Notification path: HUN suppressed unless the user's DND allows our category/app; the notification still lands in the shade; retry alert after DND ends | same | same | same | same |
| E1 | HUN suppressed (package snoozed, avalanche, shade open) | Overlay/Activity-via-SAW. Else: FSI-bearing HUN bypasses snooze+avalanche; otherwise re-alert via `OnAlarmListener` exact alarm in 2–5 min; keep the notification in the shade | same | same | same | same |
| **E2 Pre-tap gate** ("budget exhausted — block/override") | user raises phone / opens Wallet / double-press power (detection is another track) | **Overlay only** (needs SAW; sub-second; dismiss via override). Fallback Activity-via-SAW. Without SAW: a HUN cannot block; show HUN "Groceries is over budget — tap to unlock" and rely on the enforcement mechanism itself | Same; FGS already running or start allowed only if battery-exempt / SAW+visible overlay (15+) | Same, plus `View.getWindowVisibility()` check before any FGS start | Same | Same; test whether Wallet's window hides overlays (`HIDE_OVERLAY_WINDOWS`) |
| **E3 Unlock-window countdown** (card unlocked for N min) | any | Ongoing notification with `setUsesChronometer(true)`+`setChronometerCountDown(true)`, actions Lock now / Extend; QS tile shows state (`requestListeningState`) | Same; note user can swipe the ongoing notification (14+) → `setDeleteIntent` | Same | **Live Update** (`setRequestPromotedOngoing`, `setShortCriticalText`, chronometer countdown chip) if `canPostPromotedNotifications()`, else ongoing notification | Same as 16 |
| E4 Later reminder "3 uncategorized purchases" | any | DEFAULT-importance notification via WorkManager periodic (≥15 min) or `OnAlarmListener` alarm; never heads-up | same | same | same | same |
| E5 Listener broken / permission lost | any | HIGH notification "Repair Save" → deep link `ACTION_NOTIFICATION_LISTENER_DETAIL_SETTINGS`; FGS notification subtitle turns red; QS tile `STATE_UNAVAILABLE` | same | same | same | same |

---

## 9. Recommended notification + overlay strategy (with fallbacks)

**Tier 0 — platform prerequisites:** target SDK 36 (or 37 once tested), `minSdk 33`. Declare `POST_NOTIFICATIONS`, `BIND_NOTIFICATION_LISTENER_SERVICE` service, `SYSTEM_ALERT_WINDOW`, `USE_FULL_SCREEN_INTENT`, `FOREGROUND_SERVICE`, `FOREGROUND_SERVICE_SPECIAL_USE`, `RECEIVE_BOOT_COMPLETED`, `REQUEST_IGNORE_BATTERY_OPTIMIZATIONS`, `POST_PROMOTED_NOTIFICATIONS`, `BIND_QUICK_SETTINGS_TILE` tile service. Install via adb/Shizuku.

**Tier 1 (preferred, SAW granted) — in-process Compose overlay from the listener process.** On `onNotificationPosted` for the Wallet package: parse → write the pending transaction to Room → show a `TYPE_APPLICATION_OVERLAY` bottom sheet (ComposeView with manual lifecycle owners) with the amount/merchant, 3–5 suggested category chips (learned merchant rules first), "More…" and "Later". Window flags: focusable (so chips are tappable), `FLAG_NOT_TOUCH_MODAL` + `FLAG_WATCH_OUTSIDE_TOUCH` so a tap outside dismisses to "Later"; keep it ≤ 0.8 alpha where it overlaps Wallet or make it fully opaque and modal. Auto-dismiss after ~20 s into Tier 2's notification. Why: sub-second, no task switch, survives DND/cooldown/avalanche, works while Wallet's confirmation is up (unless Wallet hides overlays — then fall through to Tier 1b). **Tier 1b:** if the overlay is hidden/unavailable (`onWindowVisibilityChanged` never visible, or on keyguard), `startActivity(FLAG_ACTIVITY_NEW_TASK)` of a translucent dialog-themed Categorize Activity (BAL via SAW) with `showWhenLocked` when needed.

**Tier 2 (always posted, also the no-SAW primary) — the Purchase notification.** Channel `purchases` IMPORTANCE_HIGH; `setCategory(CATEGORY_REMINDER)`; `setWhen(now)`; `setFullScreenIntent(categorizeActivityPI, true)` **always** (sticky HUN when permitted; 60 s HUN when denied; FSI only fires when the screen is off/locked); `setVisibility(VISIBILITY_PRIVATE)` + `setPublicVersion("New purchase — tap to categorize")`; content tap → Categorize Activity (direct `getActivity` PendingIntent, `FLAG_IMMUTABLE`, unique request code); 3 actions = top-3 predicted categories as `getBroadcast` PendingIntents to a `CategorizeReceiver` (no trampoline); the third action may instead be a `RemoteInput` with `setChoices(allCategories)` ("Other…", `FLAG_MUTABLE`). On action: write the category, `notify()` a brief confirmation (`setOnlyAlertOnce`, `setTimeoutAfter(4000)`) or `cancel()`. Keep the notification until categorized; stop the Tier 1 overlay when the notification is acted on and vice-versa (single source of truth = Room row state).

**Tier 3 — re-alert.** If still uncategorized after 5 min and the user unlocked the device since, re-post with alert (new `when`), max 2 times; then fold into the daily digest (Tier E4). Use `AlarmManager.setAndAllowWhileIdle(..., OnAlarmListener)` (no permission) or WorkManager.

**Enforcement surfaces.** Pre-tap gate = overlay (Tier 1) only — a notification cannot block; the gate must be ready before the tap, so the enforcement track should trigger it on "Wallet in foreground/double-press power/NFC field" and it must be dismissible in one tap ("Override once" / "Move $ from…"). Unlock-window state = Live Update on 16 QPR1+ (countdown via chronometer), ongoing chronometer notification otherwise, mirrored by the QS tile (`STATE_ACTIVE` = unlocked, subtitle "2:59", `onClick` toggles; `startActivityAndCollapse(PendingIntent)` for the override sheet; `unlockAndRun` on the lock screen).

**Keep-alive.** NLS (bound by system) + optional `specialUse` FGS started from `BOOT_COMPLETED`/`MY_PACKAGE_REPLACED`/app launch/notification action (never from the NLS callback unless battery-exempt) with `FOREGROUND_SERVICE_IMMEDIATE`, LOW channel, colorized status (green/red). Request battery exemption. Watchdog self-test (§6.6). Re-arm everything on `BOOT_COMPLETED` (Android 15 stopped state cancels PendingIntents). Avoid `SCHEDULE_EXACT_ALARM` by using `OnAlarmListener`.

---

## 10. Negative results / things checked that do not exist or do not help
- No public API lets a non-system app start an Activity from the background without SAW, a system-sent PendingIntent, or a privileged bind; `START_ACTIVITIES_FROM_BACKGROUND` is not grantable to third-party apps (manifest protection level).
- A NotificationListenerService binding grants neither BAL nor FGS-start privileges (ManagedServices bind flags; FGS exemption list).
- Notification cooldown (polite notifications) does not suppress heads-up display — only sound/vibration; HUN suppression during an "avalanche" exists but exempts FSI-bearing/reminder/colorized notifications.
- Android 17 behaviour-change pages contain nothing new about notifications/HUN/FSI/overlays/NLS (only BAL-via-IntentSender, ASM, background audio, memory limits, custom-view size limits).
- No `cmd notification` subcommand grants FSI; FSI must be granted via appops/Settings.
- `heads_up_notification_decay` is 5 s everywhere in AOSP SystemUI; there is no public API to lengthen a heads-up except the FSI stickiness and an active RemoteInput.
- Bubbles cannot be forced open from the background for a non-conversation notification (conversation shortcut required; auto-expand intended for user-initiated bubbles).
- `Settings.Secure.enabled_notification_listeners` is a mirror of the XML approved list; writing it is not the sanctioned grant path (`cmd notification allow_listener` is).
- Could not fetch (403/404): Android Authority QPR1 Live Updates article, proandroiddev FSI article, dontkillmyapp has no One UI 7/8 page, the Live Updates sample README path, web.archive.org (blocked by the tool).

## 11. Open questions / device tests (things only the user's device can answer)
1. Does Google Wallet's post-tap confirmation screen (and the Pixel double-press-power card overlay, Wallet 25.31+) call `setHideOverlayWindows(true)`? Test: show our overlay, trigger a Wallet payment, observe. If hidden → Tier 1b (Activity-via-SAW) becomes primary.
2. Is `canUseFullScreenIntent()` true right after `adb install` on this device/Android version (14/15/16/17)? Expected yes (default enabled; Play not involved).
3. `appops get <pkg> ACCESS_RESTRICTED_SETTINGS` after `adb install` on Android 15/16/17 — guarded or not under ECM?
4. Which channel/importance does Wallet (or Play services' Tap & pay module) use for the purchase notification, and how long after the NFC tap does it post? (Sensing track; determines whether the SILENT filter type matters and the achievable popup latency.)
5. Samsung One UI 7/8 exact menu paths for "Never sleeping apps" and whether the specialUse FGS is enough to avoid "sleeping" after 3 days.
6. On Android 16 QPR1+/17: does the OEM allow Live Updates for a sideloaded app by default (`canPostPromotedNotifications()`), and how does the chip render a chronometer countdown of 2–3 minutes?
7. Whether the `MAX_HUN_WHEN_AGE_MS` constant is 24 h (affects back-dated `when`); keep `when = now` regardless.

---

## Sources (fetched 2026-10-17 unless noted)
Primary — developer.android.com:
- https://developer.android.com/guide/components/activities/background-starts (BAL exemptions, version table incl. Android 17 IntentSender; StrictMode)
- https://developer.android.com/guide/components/activities/secure-bal (sender/creator opt-in modes, privilege chain, logcat fields)
- https://developer.android.com/about/versions/14/behavior-changes-14 (FSI permission, FGS types required, TileService PendingIntent, implicit/mutable PendingIntent, BAL sender opt-in, receiver export flags)
- https://developer.android.com/about/versions/14/behavior-changes-all (dismissable ongoing notifications and exceptions, exact alarms denied by default, cached-broadcast queuing)
- https://developer.android.com/about/versions/14/changes/schedule-exact-alarms (affected apps, OnAlarmListener exemption, power-allowlist exemption, USE_EXACT_ALARM)
- https://developer.android.com/about/versions/15/behavior-changes-15 (BOOT_COMPLETED FGS bans, SAW+visible overlay FGS rule, dataSync timeout, BAL creator default, StrictMode intents)
- https://developer.android.com/about/versions/15/behavior-changes-all (stopped state cancels PendingIntents, OTP redaction for listeners, screenshare notification hiding)
- https://developer.android.com/about/versions/16/behavior-changes-16 and /behavior-changes-all (ALLOW_IF_VISIBLE, JobScheduler quotas, intent redirection hardening)
- https://developer.android.com/about/versions/17/behavior-changes-17, /behavior-changes-all, /release-notes (last updated 2026-10-16; BAL/IntentSender, background audio, memory limits, custom-view limits, OnAlarmListener exact alarm)
- https://developer.android.com/about/versions/16/features/progress-centric-notifications (ProgressStyle; updated 2026-03-03)
- https://developer.android.com/develop/ui/views/notifications/live-update (criteria, POST_PROMOTED_NOTIFICATIONS, chip, setWhen/chronometer countdown, policy)
- https://developer.android.com/develop/ui/views/notifications/build-notification (3 actions, RemoteInput, flags, rate limits, Android 10 FSI permission note)
- https://developer.android.com/develop/ui/views/notifications/time-sensitive (FSI → heads-up while in use)
- https://developer.android.com/develop/ui/views/notifications/bubbles (requirements, Android 17 windowing-mode note)
- https://developer.android.com/develop/ui/views/quicksettings-tiles (TileService lifecycle, requestListeningState, startActivityAndCollapse, unlockAndRun, requestAddTileService)
- https://developer.android.com/develop/background-work/services/fgs/service-types (FGS type table, specialUse property, timeouts)
- https://developer.android.com/develop/background-work/services/fgs/restrictions-bg-start (exemption list incl. battery exemption and SAW rule)
- https://developer.android.com/develop/background-work/services/alarms/schedule (exact/inexact alarms, Doze, OnAlarmListener)
- https://developer.android.com/training/monitoring-device-state/doze-standby (Doze restrictions, 9-minute rule, exemption intents, adb)
- https://developer.android.com/about/versions/12/behavior-changes-12 (notification trampolines + SAW exception, exact alarm permission, PendingIntent mutability, custom notification template)
- https://developer.android.com/about/versions/12/behavior-changes-all (untrusted touches 0.8 opacity, ACTION_CLOSE_SYSTEM_DIALOGS, FGS notification 10 s delay, restricted bucket)
- https://developer.android.com/about/versions/11/privacy/permissions (ACTION_MANAGE_OVERLAY_PERMISSION top-level since 11; SAW auto-grant classes; auto-reset = runtime perms)
- https://developer.android.com/jetpack/androidx/releases/core (core 1.17.0-alpha01, 2025-06-18: ProgressStyle + setRequestPromotedOngoing)
Primary — source.android.com / Google support:
- https://source.android.com/docs/core/permissions/fsi-limits (FSI defaults, Play revocation, SessionParams, validation matrix incl. 60 s HUN)
- https://support.google.com/googleplay/android-developer/answer/13392821 (Play FSI dates, FGS declarations)
- https://support.google.com/android/answer/12623953 (Allow restricted settings steps)
Primary — AOSP code (github.com/aosp-mirror/platform_frameworks_base, branch main, raw):
- services/core/java/com/android/server/wm/BackgroundActivityStartController.java; BackgroundLaunchProcessController.java; ActivityTaskManagerService.java (grace period 10 s, hasSystemAlertWindowPermission)
- services/core/java/com/android/server/notification/ManagedServices.java (bind flags, onBindingDied 10 s rebind); NotificationShellCmd.java (allow_listener); NotificationAttentionHelper.java (cooldown/avalanche)
- services/core/java/com/android/server/pm/InstallPackageHelper.java (restricted settings legacy vs ECM branches); PackageManagerShellCommand.java (default PACKAGE_SOURCE_OTHER, --package-source)
- services/accessibility/java/com/android/server/accessibility/AccessibilityServiceConnection.java (BIND_ALLOW_BACKGROUND_ACTIVITY_STARTS)
- core/java/android/service/notification/NotificationListenerService.java; core/java/android/app/Notification.java (FLAG_FSI_REQUESTED_BUT_DENIED, FLAG_PROMOTED_ONGOING, fullScreenIntent Javadoc); core/java/android/provider/Settings.java (action strings); core/java/android/content/pm/PackageInstaller.java (package sources, setPermissionState); core/res/AndroidManifest.xml (protection levels)
- packages/SystemUI/res/values/config.xml (HUN timings); packages/SystemUI/src/com/android/systemui/statusbar/notification/headsup/HeadsUpManagerImpl.java, AvalancheController.kt; …/notification/collection/NotificationEntry.java; …/notification/interruption/FullScreenIntentDecisionProvider.kt, CommonVisualInterruptionSuppressors.kt
- https://android.googlesource.com/platform/packages/modules/Permission/+/refs/heads/main/service/java/com/android/ecm/EnhancedConfirmationService.java (ECM protected settings and guard logic)
Secondary:
- https://en.wikipedia.org/wiki/Android_17 (stable June 16 2026, API 37, beta timeline); https://en.wikipedia.org/wiki/Android_16 (stable June 10 2025; cooldown description)
- https://dontkillmyapp.com/samsung (updated 07/2024), https://dontkillmyapp.com/google
- https://9to5google.com/2025/08/13/google-wallet-overlay-pixel/ (Wallet 25.31 double-press card overlay, 2025-08-13)
- https://docs.customer.io/integrations/sdk/android/live-notifications/ (Live Updates fallback behaviour; updated 2026-09-14)
- Search snippets (not fully readable): androidauthority.com/android-16-qpr1-live-updates-3573399 (QPR1 chip + POST_PROMOTED_NOTIFICATIONS requirement); androidauthority.com/notification-cooldown-android-15-qpr1-3481384; proandroiddev FSI article (2025); techyourchance.com "Jetpack Compose inside Android Service"; developer.android.com/reference/kotlin/androidx/compose/ui/platform/ComposeView; Chinese developer article on NLS component-toggle rebind (10–13 s on Xiaomi).
