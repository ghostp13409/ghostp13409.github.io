# Cross-platform application stack for "Save" (Android-first budget enforcement)

Research appendix. Written 2026-10-17. Scope: choosing the app stack for an Android-FIRST app that needs deep native Android integration (NotificationListenerService, optional AccessibilityService, NFC adapter control via reflection/Shizuku, TileService, foreground services, BroadcastReceivers) while keeping the budgeting engine and UI portable to iOS later.

Status legend used throughout:
- **VERIFIED** = read in a primary source during this research (developer.android.com, AOSP source, kotlinlang.org, Apple developer/support docs, package registries, official blogs). The source date is given where known.
- **REPORTED** = secondary or anecdotal (forums, vendor help pages, news, blog posts).
- **INFERRED** = my reasoning from verified facts; not itself observed.

Negative results (things I looked for and did not find) are called out explicitly. The web-search budget for this session ran out near the end, so a few items are flagged "not re-verified this session" where I relied on prior knowledge.

---

## 0. Executive summary and recommendation

**Recommendation: Kotlin Multiplatform (KMP) + Compose Multiplatform (CMP), with all Android sensing/enforcement components written as ordinary Android Kotlin modules that call the shared engine directly in-process.** The iOS target is prepared structurally (pure-Kotlin domain/data modules, CMP UI) but not built until a Mac/CI is available.

Why (short form; details and evidence follow):

1. The enforcement loop (notification posted -> parse -> decrement -> decide -> maybe disable NFC / overlay) runs inside Android system callbacks (NotificationListenerService, AccessibilityService) in the app process, usually with no Activity alive. In KMP, those callbacks are plain Kotlin classes that `inject()` the same `BudgetEngine` and the same Room database instance the UI uses. There is no runtime to boot and no bridge to cross. In Flutter and React Native the same callback must boot a Dart/JS runtime (headless FlutterEngine / Headless JS) before any business logic can run, and that runtime then owns a second SQLite library copy and a second DB access path.
2. The "two SQLite copies in one process" problem is real and documented by sqlite.org: drift (`package:sqlite3`), expo-sqlite and op-sqlite bundle their own SQLite, while native Kotlin uses the Android framework or `androidx.sqlite` builds. Two copies opening the same file in one process can corrupt it (POSIX advisory-lock quirk). KMP sidesteps this: one Room instance, one SQLite copy, one process.
3. The KMP toolchain is production-grade in 2026: Compose Multiplatform for iOS has been Stable since 1.8.0 (May 2025) and is at 1.12.2; Room 3.0 is a KMP-first stable release (July 2026); Koin 4.2 supports iOS; Kotlin 2.4 ships Swift export (Alpha) and Swift Package dependencies; the KMP IDE plugin runs on Windows in Android Studio Otter 2025.2.1+.
4. Nothing on the Android side is lost relative to pure native Kotlin/Jetpack Compose: the Android modules ARE native Kotlin. The cost is build-system discipline (AGP 9 built-in Kotlin, the `com.android.kotlin.multiplatform.library` plugin, pinned version catalog) and the discipline to keep `:core:*` free of Android imports.
5. iOS cannot be a parity product anyway: Apple exposes no Apple Pay transaction API, no way to disable NFC or block Apple Pay, and the only hook is the Shortcuts "Transaction" automation (iOS 17+) with reliability issues. The iOS app is therefore "log + nudge", and only the budgeting engine and UI need to port, which is exactly what KMP shares.

Weighted matrix result (section 9): KMP+CMP 460/500, native Kotlin 452, Flutter 309, React Native/Expo 301.

---

## 1. Platform and toolchain baseline as of 2026-10-17

| Item | State | Status / source |
|---|---|---|
| Android 17 | Stable released June 16, 2026 (API 37). QPR2 expected Dec 2026. | REPORTED (Android Authority, 9to5Google); behavior-change pages VERIFIED on developer.android.com |
| Android 17 changes relevant here | "All apps": per-device app memory limits; WebOTP delay; IME visibility after rotation; Keystore key caps; planned cleartext deprecation. "Targeting 17": lock-free MessageQueue, unmodifiable static finals, BAL restriction extended to IntentSender, background audio hardening, `ACCESS_LOCAL_NETWORK` permission, CP2 PII restrictions. **No changes found to NotificationListenerService, NFC, or FGS rules** (negative result). | VERIFIED (developer.android.com/about/versions/17/behavior-changes-all and -17) |
| Kotlin | 2.3.0 GA Dec 16, 2025 (Swift export improvements, C/ObjC import Beta). 2.4.0 GA June 2026 (JetBrains blog dated 2026/06; kotlinlang "What's new" page shows a July 14, 2026 date): context parameters stable, Swift export **Alpha** (suspend -> async, Flow -> AsyncSequence), SwiftPM dependencies in Gradle, CMS GC default, **minimum iOS raised to 15.0**, Gradle 7.6.3-9.5.0, AGP min 8.5.2, Xcode 26.4. | VERIFIED (kotlinlang.org/docs/whatsnew24.html) |
| Compose Multiplatform | 1.8.0 (May 2025): iOS **Stable**. 1.10.0 (Jan 2026): Navigation 3 alpha on non-Android, common `@Preview`, bundled Compose Hot Reload. 1.11.0 (May 15, 2026): experimental native UIView text input on iOS, concurrent rendering on by default, **iosX64 removed**, min iOS 14, needs Kotlin 2.3.10 for native/web. 1.12.x (Aug 26, 2026; current 1.12.2): smoother iOS lazy scrolling, Skia M150, Hot Reload **MCP server (experimental)**, ships `navigation3-*:1.2.0-rc01`. | VERIFIED (JetBrains blog, kotlinlang what's-new pages) |
| Room | 2.8.5 stable Sep 9, 2026 (2.x line; 2.7.0 made Room KMP in Apr 2025; 2.8.0 minSdk 23). **Room 3.0.0 stable July 1, 2026**, 3.0.3 Sep 9, 2026, 3.1.0-alpha01 Sep 9, 2026: package `androidx.room3`, KMP-first, KSP-only, suspend DAOs, Flow invalidation, SQLiteDriver required, JS/Wasm targets, `Room.databaseBuilder` without Context. | VERIFIED (developer.android.com/jetpack/androidx/releases/room and /room3) |
| androidx.sqlite | 2.7.1 referenced by the Room-KMP guide (`sqlite-bundled`). | VERIFIED |
| SQLDelight | 2.4.1 (Oct 6), 2.4.0 (Sep 18), 2.3.2 (Mar 16), 2.2.1 (Nov 14, 2025), 2.1.0 (May 16, 2025). 2.3.2: minSdk 23, AGP 9 DSL compat, x64 Apple targets removed. 2.4.0: Gradle min 8.2.1. Years for 2.3.x/2.4.x inferred from ordering. | VERIFIED (GitHub releases) |
| Koin | 4.2 (BOM), KMP targets incl. iOS; optional compiler plugin; `koin-compose`, `koin-compose-viewmodel`. | VERIFIED (insert-koin.io KMP setup) |
| Navigation 3 | Stable on Android Nov 2025. In CMP: alpha for non-Android in 1.10; `org.jetbrains.androidx.navigation3:navigation3-*:1.2.0-rc01` listed by CMP 1.12.2. | VERIFIED |
| KMP IDE plugin | On Windows/Linux since IntelliJ 2025.2.2 and Android Studio Otter 2025.2.1 (macOS since 2025.1.1). Requires K2 mode. Latest listed plugin release 0.9 (May 19, 2025). | VERIFIED (kotlinlang multiplatform-plugin-releases) |
| AGP | 9.0 (Q4 2025) enables built-in Kotlin; `kotlin-android` plugin not needed and `kotlin("multiplatform")` + `com.android.library` **no longer allowed** with built-in Kotlin; opt-out `android.builtInKotlin=false` removed in AGP 10 (H2 2026). Flutter 3.47 is verified against AGP 9.1.0. | VERIFIED (developer.android.com/build/migrate-to-built-in-kotlin) |
| Flutter | 3.47 stable Aug 12, 2026 (verified against Java 17, KGP 2.4.0, AGP 9.1.0, Gradle 9.3.1; compileSdk/targetSdk 36, minSdk 24). Next: 3.50 (Nov 2026). Dart MCP server in SDK since Dart 3.9. | VERIFIED (flutter.dev blog; docs) |
| React Native / Expo | RN 0.88.0 Oct 15, 2026; 0.87.1 Aug 26; 0.86.3 Aug 24. New Architecture mandatory since RN 0.82 / Expo SDK 55. Expo SDK 56 (May 21, 2026; RN 0.85; Hermes V1 default), SDK 57 (June 30, 2026; RN 0.86). | VERIFIED (GitHub releases, expo.dev changelog, docs.expo.dev) |
| iOS | iOS 26 shipped fall 2025; iOS 27 is current (Apple's Shortcuts User Guide version selector lists iOS 27; vendor docs describe iOS 27 behavior). App Intents `supportedModes` is iOS 26+. | VERIFIED (Apple docs) / REPORTED (GA timing) |

---

## 2. The core constraint: enforcement runs in system callbacks, not in your UI

The product loop is: Google Wallet posts a payment notification -> our `NotificationListenerService` (NLS) gets `onNotificationPosted()` -> parse amount/merchant/card -> engine decrements the category -> if exhausted, arm enforcement (NFC off via reflection/Shizuku, overlay, tile state) -> show a categorization prompt. All of this happens in the app process while the Activity is typically dead (phone was just used to tap at a terminal). Whatever stack is chosen, the code running in that callback must be able to reach the budgeting engine and the database **synchronously and cheaply**.

### 2.1 Process-state facts for an app with an active NotificationListenerService (VERIFIED from AOSP `main`, read 2026-10-17)

- `NotificationManagerService.NotificationListeners.getBindFlags()` binds listeners with `BIND_AUTO_CREATE | BIND_FOREGROUND_SERVICE | BIND_NOT_PERCEPTIBLE | BIND_ALLOW_WHITELIST_MANAGEMENT` (NotificationManagerService.java ~line 12661-12667; base `ManagedServices.getBindFlags()` lacks `BIND_NOT_PERCEPTIBLE`).
- `Context.BIND_FOREGROUND_SERVICE` (hidden/system API): "For only the case where the binding is coming from the system, set the process state to BOUND_FOREGROUND_SERVICE instead of the normal maximum of IMPORTANT_FOREGROUND ... the process shouldn't participate in the normal power reduction modes (removing network access etc)."
- `OomAdjuster`: for a client above TOP (system_server is PERSISTENT) binding with `BIND_FOREGROUND_SERVICE`, the bound process gets `PROCESS_STATE_BOUND_FOREGROUND_SERVICE`; `BIND_NOT_PERCEPTIBLE` lowers oom_adj to `PERCEPTIBLE_LOW_APP_ADJ` (killable under pressure, but auto-recreated because of `BIND_AUTO_CREATE`). `getBfslCapabilityFromClient()` grants `PROCESS_CAPABILITY_BFSL` ("background FGS launch") when the client procstate is above FOREGROUND_SERVICE, which system_server is.
- `ActiveServices.shouldAllowFgsStartForegroundNoBindingCheckLocked()` allows an FGS start when any process of the UID has `procstate <= PROCESS_STATE_BOUND_TOP`, **or** `uidBfsl && procstate <= PROCESS_STATE_BOUND_FOREGROUND_SERVICE`; failing that, `canBindingClientStartFgsLocked()` grants `REASON_FGS_BINDING` if the binding client could start an FGS.
- Consequence (INFERRED from the above, consistent with the Android 8 docs): **while our NLS is bound, our process can call `startForegroundService()`/`startService()` from the NLS callback without a visible Activity and without hitting `ForegroundServiceStartNotAllowedException`.** The official Android 12+ exemption list does not name notification listeners (negative result, VERIFIED on the restrictions-bg-start page), so this relies on the process-state path, not a listed exemption. The exemption disappears when the listener is unbound (permission revoked, listener disabled after repeated crashes, or system unbind). The Android 8.0 background-limits page separately states an app is "in the foreground" when another foreground app binds to its "Notification listener" (VERIFIED).
- The `BIND_FOREGROUND_SERVICE` path also means the NLS process is exempt from the normal power-reduction network restrictions while bound (VERIFIED javadoc; practical effect INFERRED).

### 2.2 Foreground service types (Android 14+)

VERIFIED (developer.android.com fgs/service-types): every FGS must declare `android:foregroundServiceType` and hold the type permission in addition to `FOREGROUND_SERVICE`. `specialUse` requires `FOREGROUND_SERVICE_SPECIAL_USE` plus a `<property android:name="android.app.PROPERTY_SPECIAL_USE_FGS_SUBTYPE" android:value="..."/>` and a Play Console declaration (irrelevant for sideloading). `shortService` runs ~3 minutes, cannot start other FGS, gets `onTimeout()`. Apps targeting Android 15+ cannot launch a `dataSync` FGS from `BOOT_COMPLETED`; `dataSync` also has a per-day runtime cap on Android 15+ (REPORTED via flutter_foreground_task README; the Android page defers to a separate dataSync page). Apps targeting 15+ that rely on `SYSTEM_ALERT_WINDOW` for the FGS-from-background exemption must currently have a visible overlay (VERIFIED).

Design consequence for all stacks: the "armed" enforcement state (NFC disabled, overlay shown) should be a `specialUse` FGS started from the NLS callback, with the NLS binding providing the BFSL capability.

---

## 3. Option A: Kotlin Multiplatform + Compose Multiplatform

### 3.1 Maturity status (2026)

- CMP for iOS: Stable since 1.8.0 (May 2025; "stable and production-ready", VoiceOver support, type-safe navigation). 1.11 removed `iosX64`; Kotlin 2.4 raised minimum iOS to 15.0, so plan iOS 15+ (effectively 16+ for App Intents, 17+ for the Transaction trigger). VERIFIED.
- iOS specifics in 1.11/1.12: concurrent rendering on by default; experimental UIView-backed text input (`PlatformImeOptions { usingNativeTextInput(true) }`, `@ExperimentalComposeUiApi`); smoother lazy scrolling in 1.12; Skia M150. The default Compose text field remains the "stable choice". VERIFIED.
- Negative result: I did not find a current (2026) official "known iOS limitations" list; the compatibility page only states min iOS 14 (CMP) and "upgrade to Kotlin 2.2.20+ for iOS/web". Old changelog items (pre-iOS-17 `UITextLoupeSession` startup crash) are stale. Treat iOS text input, UIKit interop overlays, and look-and-feel as the usual CMP-on-iOS risk areas (INFERRED).
- Kotlin/Native host rule (VERIFIED, kotlinlang native-target-support): "Building final binaries for Apple targets on Linux and Windows is also not possible." Windows can produce `.klib` for Apple targets only when there are no cinterop/CocoaPods dependencies. `iosArm64` and `iosSimulatorArm64` are Tier 1 (macOS hosts only).

### 3.2 Database: one Room (or SQLDelight) instance shared by native services and shared code

Room 3 (recommended) VERIFIED facts:
- Artifacts `androidx.room3:room3-runtime`, `room3-compiler` (KSP only; no kapt/JavaAP), `room3-sqlite-wrapper` for migration. Stable 3.0.3 (Sep 9, 2026).
- KMP setup (developer.android.com/kotlin/multiplatform/room): `@Database(...) @ConstructedBy(AppDatabaseConstructor::class) abstract class AppDatabase : RoomDatabase()`; `expect object AppDatabaseConstructor : RoomDatabaseConstructor<AppDatabase>` with the `actual` generated by the compiler; per-platform builder (`Room.databaseBuilder<AppDatabase>(context, dbFile.absolutePath)` on Android, `Room.databaseBuilder<AppDatabase>(name = documentDirectory()+"/save.db")` on iOS); common code applies `.setDriver(BundledSQLiteDriver()).setQueryCoroutineContext(Dispatchers.IO).build()`. The guide's catalog pins `room3 = "3.1.0-alpha01"` and `sqlite = "2.7.1"`; prefer the stable 3.0.3 and confirm its `androidx.sqlite` pairing in the 3.0.x release notes (INFERRED pairing).
- Drivers: `BundledSQLiteDriver` (commonMain, SQLite compiled from source, recommended), `AndroidSQLiteDriver` (framework SQLite), `NativeSQLiteDriver` (iOS, needs `linkerOpts.add("-lsqlite3")`).
- Not available in KMP common code: `setQueryCallback`, auto-close timeout (Android only), pre-packaged DBs, `enableMultiInstanceInvalidation` (Android only), `setQueryExecutor` (use CoroutineContext). Blocking DAO functions only in `androidMain`; use `suspend`/`Flow`. `withTransaction{}` becomes `useWriterConnection { it.immediateTransaction { ... } }` (Room 2.7 style) / `withWriteTransaction{}` (Room 3). Flow invalidation via `invalidationTracker.createFlow("table")`.

How the NLS shares the DB with the UI (INFERRED from the above and standard Android process semantics): keep everything in ONE process (no `android:process` attributes). `Application.onCreate()` starts Koin, which holds a singleton `AppDatabase`. The NLS, the enforcement FGS, the TileService, BroadcastReceivers and the Compose Activity all `inject()` the same instance. Room's `InvalidationTracker` makes the UI's `Flow`s update when the NLS writes, because they are the same connection pool. The KMP limitation "no multi-instance invalidation" is therefore irrelevant. If you ever split processes, you lose cross-process invalidation in common code (it exists only in `androidMain`).

SQLDelight 2.4.1 is a valid alternative (Kotlin-first, generated type-safe queries, `NativeSqliteDriver` on iOS, `AndroidSqliteDriver` on Android). Trade-offs (INFERRED): SQLDelight's Android driver uses the framework SQLite via `SupportSQLiteOpenHelper` unless you swap in `requery` or the androidx bundled driver; Room 3 gives one bundled SQLite everywhere plus migrations/relations tooling and Google maintenance. Either way the single-process, single-library property holds.

### 3.3 Dependency injection

Koin 4.2 (VERIFIED): `koin-core` in `commonMain`, `koin-compose` + `koin-compose-viewmodel` for `koinViewModel()`, `koin-android` in `androidMain`, `koin-test` in `commonTest`; optional compiler plugin (`io.insert-koin.compiler.plugin`) and annotations (`@KoinApplication`, `@Configuration`). iOS initialization: a parameterless `fun initKoinIos() = initKoin()` in `iosMain`, called from Swift as `KoinIosKt.doInitKoinIos()` (Kotlin/Native prefixes `init*` names with `do`). Hilt is not an option for KMP common code (INFERRED; Hilt is Android/JVM only).

### 3.4 Navigation, ViewModel, lifecycle

- Navigation 3 is the forward path: user-owned back stack (`SnapshotStateList`), `NavDisplay`, JetBrains artifacts `org.jetbrains.androidx.navigation3:navigation3-ui` / `-runtime`; CMP 1.12.2 lists 1.2.0-rc01. Status on iOS was alpha in 1.10 and RC-level by 1.12.2 (VERIFIED version listing; stability label INFERRED from the rc suffix). The older Navigation 2 port (`org.jetbrains.androidx.navigation:navigation-compose`) remains the conservative choice. Pitfall seen in community threads: copying a lifecycle version that doesn't exist on Maven Central; always take versions from the CMP "What's new" dependency list (REPORTED).
- ViewModels in common code via `org.jetbrains.androidx.lifecycle:lifecycle-viewmodel-compose` (version from the CMP 1.12.2 page).

### 3.5 Testing

VERIFIED (kotlinlang multiplatform-run-tests): `commonTest` with `kotlin.test` runs on every target; Android host tests (`androidHostTest`, JUnit 4) run on the dev JVM; iOS tests compile to a Kotlin/Native test binary for `iosSimulatorArm64` and need macOS + Xcode simulators. Gradle `allTests` aggregates. The budgeting engine (`:core:domain`) should be 100% `commonTest`-covered because it runs identically on both platforms; Android-specific parsing (`WalletNotificationParser`) is tested with JUnit + Robolectric or plain JVM tests on captured `Notification` extras (INFERRED).

### 3.6 Build tooling and Windows

- AGP 9 (VERIFIED): KMP library modules must apply `org.jetbrains.kotlin.multiplatform` + `com.android.kotlin.multiplatform.library` (DSL `kotlin { android { namespace; compileSdk; minSdk; withHostTestBuilder{}; withDeviceTestBuilder{} } }`; `androidLibrary{}` deprecated since AGP 9.1.0-alpha09). The plugin has a single variant (no flavors/build types), no resources unless `androidResources { enable = true }`, no `BuildConfig` (use BuildKonfig), no data/view binding, tests off by default. Android-only modules (`:platform:android-*`, `:app-android`) use `com.android.library` / `com.android.application` with built-in Kotlin (do NOT apply `kotlin-android`). `kapt` is incompatible with built-in Kotlin; Room 3 is KSP-only anyway.
- Compose Hot Reload (VERIFIED, GitHub README): needs a **JVM target** in the project, JetBrains Runtime, Kotlin 2.1.20+, CMP 1.8.2+ (1.10.0+ for plugin 1.2.0-alpha02+), IntelliJ 2025.2.2+/Android Studio Otter 2025.2.1+. It does not reload Android or iOS; the workflow is to run the shared `App()` composable in a small desktop JVM module. Host OS not stated, but it is JVM-based and the KMP plugin supports Windows (INFERRED: works on Windows). 1.12 adds an experimental MCP server for agents (reload, screenshot, semantic tree, clicks, logs).
- Windows: Android build/debug fully supported. Apple targets are skipped on a Windows host (klib only, no cinterop). iOS build/run/test requires a Mac or a macOS CI runner (GitHub Actions macOS runners, Codemagic, etc. — general knowledge, not re-verified this session). Swift editing features of the KMP plugin are reportedly being dropped from IntelliJ 2026.3 / Android Studio 2026.2.2 while Swift export itself continues (REPORTED, Chinese-language source; verify).
- Windows path length: Kotlin/Native toolchain extraction and long classpaths have bitten users (REPORTED, kotlinlang discuss/Gradle forums). Keep the project at a short path (C:\Personal\Save is fine), enable Windows long paths, set `git config core.longpaths true`, and let Gradle (not the IDE launcher) run tasks when hitting `CreateProcess error=206`.

### 3.7 How an Android NotificationListenerService calls the shared engine with no bridge

Pure Kotlin in `:platform:android-sensing` (an Android library module) depending on `:core:domain` and `:core:data` (KMP modules). Sketch (INFERRED design, APIs VERIFIED to exist):

```kotlin
// :platform:android-sensing  (androidMain of an Android library; plain Kotlin/JVM)
class WalletNotificationListener : NotificationListenerService(), KoinComponent {
    private val ingest: IngestTapUseCase by inject()          // from :core:domain, same process
    private val enforcement: EnforcementController by inject() // from :platform:android-enforcement
    private val scope = CoroutineScope(SupervisorJob() + Dispatchers.Default)

    override fun onNotificationPosted(sbn: StatusBarNotification) {
        if (sbn.packageName !in WalletPackages.KNOWN) return   // e.g. Google Wallet package; confirm on device
        val tap = WalletNotificationParser.parse(sbn) ?: return  // amount, merchant, card, postedAt, key
        scope.launch {
            when (val outcome = ingest(tap)) {                   // writes through the shared Room instance
                is Outcome.NeedsCategory -> CategorizePromptNotifier.show(this@WalletNotificationListener, outcome)
                is Outcome.BudgetExhausted -> enforcement.arm(outcome)   // starts specialUse FGS, disables NFC etc.
                else -> Unit
            }
        }
    }
    override fun onListenerDisconnected() { requestRebind(ComponentName(this, javaClass)) } // API 24+
}
```

Key properties: Koin is started in `Application.onCreate()` which precedes any component creation in the process; `IngestTapUseCase` is common Kotlin; the DB write immediately invalidates the UI's `Flow`s if the Activity is alive. No serialization, no engine boot, no method channels. `requestRebind()` exists since API 24 (not re-verified this session).

### 3.8 KMP-specific pitfalls (see also section 11)

Version alignment (Kotlin <-> Compose compiler plugin is aligned automatically since Kotlin 2.0, but KSP, AGP, Gradle, JDK, CMP, Room, Koin still need a pinned catalog); `commonMain` accidentally importing `java.*`/`android.*` (compile error only when an iOS target is configured, so configure the iOS targets from day one even on Windows — the Gradle configuration still runs, only compilation is skipped); Room KMP forbidding blocking DAOs in common code; Koin `init` naming from Swift; `iosX64` gone (Apple-silicon simulators only).

---

## 4. Option B: Flutter

### 4.1 Toolchain

Flutter 3.47 (Aug 12, 2026) is verified against Java 17, KGP 2.4.0, AGP 9.1.0, Gradle 9.3.1; defaults compileSdk/targetSdk 36, minSdk 24 (VERIFIED). Flutter had to add "temporary support" for applying the Kotlin Gradle Plugin after AGP 9 removed it and plans to remove that shim; plugins and apps still using KGP must migrate (VERIFIED, Flutter breaking-change doc). Dart MCP server is in the SDK since Dart 3.9 / Flutter 3.35 (experimental) (VERIFIED/REPORTED).

### 4.2 Native services and headless Dart

Mechanism (VERIFIED at the overview level on docs.flutter.dev; details from package READMEs): native code starts a background `FlutterEngine`, looks up a Dart callback via `PluginUtilities.getCallbackHandle` / `FlutterCallbackInformation`, and runs a "callback dispatcher" isolate; callbacks must carry `@pragma('vm:entry-point')` or release builds strip them. The UI isolate and background isolate share no memory; they talk via ports/`invoke()`.

Packages (VERIFIED on pub.dev / GitHub API 2026-10-17 unless noted):
- `flutter_notification_listener` 1.4.0 (published ~Feb 2026; repo pushed 2026-02-13; 49 stars; 18 open issues; publisher zoe.im; Android only). Registers `im.zoe.labs.flutter_notification_listener.NotificationsHandlerService` with `BIND_NOTIFICATION_LISTENER_SERVICE`, runs as a `specialUse` FGS by default (`FOREGROUND_SERVICE_SPECIAL_USE`), has a `RebootBroadcastReceiver`, and documents "if the service is not foreground, service will start failed after reboot". A fork (`flutter_notification_listener_plus` 1.3.7) exists because the original "crashes on Android 13+ release builds due to broadcast receiver registration issues" (REPORTED by the fork). I could not fetch its Kotlin service source to confirm the engine-boot details (negative result).
- `flutter_background_service` 5.1.0 (published ~Dec 2024; repo last pushed 2025-07-25; 304 stars; **228 open issues**; README still states Gradle 7.4.2 / Kotlin 1.8.10 / wrapper 7.5 requirements, i.e. pre-AGP-9 era). Android 14 requires choosing an FGS type manually; isolate restart behaviour undocumented; FAQ says disable battery optimization if killed.
- `flutter_foreground_task` 11.0.3 (published ~Sep 2026; 583 likes; 255k downloads; needs Flutter 3.44+, Kotlin 2.2.20+, Gradle 8.11.1+). Actively maintained; documents Android 14 types, Android 15 `dataSync` limits, `BOOT_COMPLETED` type restrictions, `autoRunOnBoot`/`autoRunOnMyPackageReplaced`. This is the credible Flutter choice for the armed-enforcement FGS, but it does not provide an NLS.

Reliability on Android 14-17 (INFERRED unless noted): the NLS binding still gives the Flutter app the same BOUND_FOREGROUND_SERVICE/BFSL state (section 2.1), so starting the FGS is allowed. The costs are (a) booting a FlutterEngine inside `onNotificationPosted()` (hundreds of ms and tens of MB; not measured this session), (b) the engine being a second owner of the database (4.3), (c) three concurrent runtimes to debug (Kotlin service, background isolate, UI isolate), and (d) dependence on a one-maintainer package for the most critical component. Android 17's per-device memory limits (VERIFIED to exist) make the extra engine footprint slightly riskier. No Flutter-specific Android 14-17 NLS breakage was found in official sources (negative result; search budget limited the GitHub-issue sweep).

### 4.3 The shared-database problem

- drift's default `NativeDatabase` uses `package:sqlite3` 3.7.1, which "bundles SQLite with your application" via build hooks on Android (armv7a/aarch64/x86/x64) and iOS; `sqlite3_flutter_libs` is EOL ("no longer does anything" since 0.6.0). No option to use the system SQLite is documented (VERIFIED on pub.dev).
- Native Kotlin code in the same process would use the Android framework SQLite (`android.database.sqlite`, `AndroidSQLiteDriver`) or `androidx.sqlite:sqlite-bundled` — a different copy.
- sqlite.org "How To Corrupt An SQLite Database File" section 2.3 (VERIFIED): "if multiple copies of SQLite are linked into the same application, then there will be multiple instances of this global list. Database connections opened using one copy of the SQLite library will be unaware of database connections opened using the other copy ... A close() operation on one connection might unknowingly clear the locks on a different database connection, leading to database corruption." Section 2.2 adds that SQLite 3.51.0 (2025-11-04) added partial WAL defenses that "are not a cure-all".
- drift streams do not observe external writes: "stream queries won't synchronize between those independent instances" (VERIFIED, drift isolates doc); `notifyUpdates()` exists for manual nudging.
- Mitigations (INFERRED): route all writes through Dart (requires the engine to be alive for every NLS event — defeats the purpose); use `drift_sqflite` so drift goes through `sqflite` and the framework SQLite (same copy as Kotlin's framework SQLite), but `drift_sqflite` 2.0.1 was last published ~3 years ago and is recommended only for migrations (VERIFIED); or make Kotlin the only DB owner and have Dart call Kotlin via platform channels for everything (then Flutter is just a view layer and the "shared engine" is Kotlin anyway).

### 4.4 Verdict

Flutter gives excellent iOS portability and a pleasant dev loop, but for this product the hard parts (NLS, FGS, NFC reflection, overlays) are Kotlin regardless, and the Dart side becomes a second runtime and a second DB owner in the one place where correctness matters most.

---

## 5. Option C: React Native / Expo

### 5.1 Toolchain

RN 0.88.0 (Oct 15, 2026); New Architecture only since 0.82; Expo SDK 55+ New-Arch-only (`newArchEnabled` removed); SDK 56 (RN 0.85, Hermes V1 default; a Hermes V1 memory regression was fixed in SDK 57); SDK 57 (June 30, 2026; RN 0.86) (VERIFIED). Native module options: Turbo Modules (built-in, codegen at app build, ObjC/Java/C++, no properties), Expo Modules (Swift/Kotlin, coroutines for async, no codegen), Nitro Modules (Swift/Kotlin direct, Nitrogen codegen, fastest in micro-benchmarks) (VERIFIED, nitro.margelo.com comparison). Expo config plugins run at `npx expo prebuild`; Android mods include `withAndroidManifest` (XML-as-JSON, so adding a `<service>`/`<receiver>` is scriptable), `withMainApplication`, `withAppBuildGradle`, `withProjectBuildGradle`, `withSettingsGradle`, `withGradleProperties`, with the string/regex-based ones labelled dangerous (VERIFIED). EAS Build compiles iOS "on macOS runners hosted in Expo's macOS cloud" and manages signing — the only stack here that produces iOS builds from Windows without any Mac (VERIFIED).

### 5.2 Headless JS

VERIFIED (reactnative.dev/docs/headless-js-android): extend `HeadlessJsTaskService`, return `HeadlessJsTaskConfig(taskName, Arguments.fromBundle(extras), timeoutMs, allowedInForeground=false, retryPolicy)`; start with `startForegroundService(intent)`; "By default, the app crashes if you run a task while it is in the foreground" unless `allowedInForeground=true`; call `HeadlessJsTaskService.acquireWakeLockNow()` when starting from a BroadcastReceiver; the JS runtime is spun up, runs the task, then "React Native enters paused mode". Each NLS event therefore boots or resumes a JS runtime (INFERRED cost similar to Flutter). The docs do not discuss Android 8+/12+ background limits (negative result); the BFSL path in section 2.1 is what makes `startForegroundService` from the NLS legal.

### 5.3 Packages and background primitives

- `react-native-android-notification-listener`: 162 stars, last push 2025-07-25, 2 open issues, Headless JS based, RN >= 0.68, no statement on New Architecture or Expo config plugin (VERIFIED GitHub). Risky under RN 0.82+ New-Arch-only builds (INFERRED).
- `react-native-background-actions`: 943 stars, pushed 2026-04-07; README: cannot launch background tasks from the background on Android 12+ (VERIFIED/REPORTED).
- `expo-background-task`: WorkManager/BGTaskScheduler, **minimum interval 15 minutes**, not event-driven, single shared worker (VERIFIED). Unsuitable for instant reaction.
- `react-native-background-fetch`: 1611 stars, pushed 2026-04-22; periodic only.
- Notifee (notification display) was archived April 7, 2026 (REPORTED) — a sign of churn in the RN background/notification ecosystem.

### 5.4 Shared database

`expo-sqlite` builds its own SQLite (custom build flags, optional SQLCipher) and `op-sqlite` lists vanilla SQLite/libsql/Turso/SQLCipher as compilation targets (VERIFIED READMEs; neither documents using the OS SQLite). Same two-copies hazard as Flutter (section 4.3). `addDatabaseChangeListener` is per-connection; nothing documented about seeing writes from other connections/processes (negative result).

### 5.5 Verdict

Same structural problem as Flutter (two runtimes, two DB owners), with a thinner and less maintained Android-background ecosystem and the heaviest build chain (Metro/Hermes/codegen/prebuild). Its unique advantage is EAS cloud iOS builds from Windows.

---

## 6. Option D: Native Kotlin + Jetpack Compose only (baseline)

What you get: everything in section 3 minus the KMP constraints — Hilt is available, Room 2.8.x/3.x on Android only, no `expect/actual`, `com.android.library` everywhere, Android Studio previews and Compose Hot Reload-like Live Edit, the most AI-friendly build graph. What you lose: the engine and UI would have to be rewritten in Swift/SwiftUI for iOS. Since the iOS product is "log + nudge" (section 7), the rewrite is smaller than it sounds, but the budgeting rules (rollover, envelopes, overrides, merchant rules) would exist twice.

Marginal cost of KMP over native, honestly stated (INFERRED): (1) `com.android.kotlin.multiplatform.library` instead of `com.android.library` for shared modules; (2) Koin instead of Hilt; (3) no blocking Room DAOs/LiveData in shared code; (4) iOS targets configured but unbuildable on Windows; (5) CMP artifacts (`org.jetbrains.compose.*`) instead of `androidx.compose.*` in shared UI (same API surface). The Android feature modules are byte-for-byte native Kotlin. This is why the matrix gives KMP a near-identical Android score to native and a much better iOS score.

---

## 7. iOS feasibility for the same product

### 7.1 Sensing: no Apple Pay API; the Shortcuts "Transaction" trigger is the only hook

- Apple exposes no API to observe Apple Pay/Wallet transactions. Core NFC is tag reading/writing and (with the NFC & SE Platform entitlement) ISO 7816 card emulation via `CardSession`; nothing observes other apps' payments (VERIFIED, Core NFC framework page). PassKit's payment APIs are for in-app/web Apple Pay sheets (general knowledge). The NFC & SE Platform (announced Aug 2024, iOS 18.1; US included) lets third-party wallets do their own contactless payments under a commercial agreement, entitlement and fees — it does not expose Apple Pay transactions (REPORTED, 9to5Mac/Neowin; Apple's page not fetched).
- Shortcuts Transaction trigger (iOS 17+). Apple's Shortcuts User Guide (iOS 27 edition, VERIFIED): "Use a transaction trigger to run an automation based on your wallet transactions"; option "When I tap" with "Select a card". Transaction is listed among automations that "can run without asking you for confirmation"; enabling Privacy > "Allow Running When Locked" means "The automation will not notify you when it's triggered"; "You also may need to set individual actions to run automatically."
- Filters and data (REPORTED, consistent across Cassinelli 2023, iDropNews 2023, TravelSpend/Finerd 2026 help, Apple Community 2025): trigger can be limited by card, purchase category and merchant; iOS 27 defaults to "Any Card / Any Category / Any Merchant"; the shortcut input exposes **Transaction, Card, Merchant, Amount, Name**. **Negative result: no source lists a location field** — the brief's assumption that location is passed is unsupported. The 2023 beta writeup also lists only card/pass, merchant, amount.
- Which transactions fire it (REPORTED): physical taps from iPhone and Apple Watch (TravelSpend: "only works for physical payments"; Finerd: Mac/iPad payments do not trigger; Reddit: Watch works after a 2024 point release). Declined transactions can fire it (Apple forum 765516). Online/in-app Apple Pay does not (vendor statement; Apple silent).
- Reliability (REPORTED, Apple Developer Forums 758053/765516/850369, 2024-2026): frequent timeouts logged as `WFWalletTransactionProvider ... Hit timeout waiting for transaction with identifier: <private>, finishing.` when issuers deliver transaction data late (Feedback FB14035016, FB16379100; a Mastercard-vs-Visa pattern was reported Feb 2026); automations resetting to "Ask Before Running" after iOS updates; "Always Allow" not persisting for an App Intent action imported from a pre-configured `.shortcut` file (works when the user adds the action manually); Low Power Mode and Focus delaying/suppressing runs; a vendor claim that iOS 26 tightened scheduling for low-priority automations. The trigger cannot be tested in the iOS Simulator (cards cannot be added) — real device and real taps required (REPORTED, forum 746889). Testing by running the shortcut manually does not exercise the trigger (Finerd).
- iOS 27 (REPORTED): Shortcuts was rebuilt with Apple Intelligence; triggers now live at the top of a shortcut ("When Any Card is tapped"), with an Automation on/off switch and Notify toggle; vendors ship a ready-made shortcut for iOS 27 and manual builds for iOS 26.

### 7.2 Handing the transaction to the app and prompting for a category

- App Intents (VERIFIED, Apple docs): since iOS 26, `static let supportedModes: IntentModes` chooses `.background`, `.foreground(.immediate)`, `.foreground(.dynamic)` (start in background, optionally `continueInForeground(dialog, alwaysConfirm:)`, which throws `notAllowed` if the transition isn't possible) or `.foreground(.deferred)`. `ForegroundContinuableIntent` (iOS 16.4-26) is deprecated in favour of `.foreground(.dynamic)`. `openAppWhenRun` forces a launch. So a `LogTapIntent(card, merchant, amount, name)` with `.background` runs in the app's process without UI; it can persist the tap into the shared engine and post a local notification.
- Prompting inside the shortcut: `Ask for Input` and `Choose from Menu` exist and are meant for runtime prompts (VERIFIED they exist and are allowed in shortcuts). How a prompt is surfaced when the automation runs immediately on a locked phone was not confirmed in any primary source (negative result); all three vendor integrations avoid prompts and categorize later in-app (REPORTED). Recommendation (INFERRED): keep the shortcut prompt-free (trigger -> app intent), and let the app post a time-sensitive local notification with category action buttons (`UNNotificationAction`) and/or a Live Activity showing the remaining budget; that works whether or not Shortcuts shows prompts when locked.
- The "Always Allow" issue means onboarding should instruct the user to add the app's action manually in the automation rather than importing a `.shortcut` file (REPORTED workaround).

### 7.3 Enforcement on iOS: not possible; soft options only

- No public API disables the NFC radio, intercepts a tap, or blocks Apple Pay (VERIFIED by the absence of any such API in Core NFC/PassKit documentation; `NFCPresentmentIntentAssertion` only lets an entitled app claim the contactless interface for its own `CardSession`, INFERRED from its description). The user can manually disable "Double-Click Side Button" for Wallet in Settings (REPORTED, Apple Community) — the app can only instruct, not toggle.
- Screen Time API (VERIFIED): `AuthorizationCenter.requestAuthorization(for: .individual)` (iOS 16+, Face ID confirmation) then `ManagedSettingsStore().shield.applications = tokens` with tokens chosen in `FamilyActivityPicker` (opaque; "includes applications and websites from that same device"). Whether Wallet appears in the picker and whether a shielded Wallet app also blocks the system Apple Pay sheet (double-click, lock screen) is **unknown and must be device-tested** (OPEN). My expectation (INFERRED): the payment sheet is system UI and will still work.
- Focus filters (`SetFocusFilterIntent`, iOS 16+) only let the app change its own behaviour per Focus — useful for a "spending lockdown" mode that changes what the app shows, not for blocking payments (general knowledge, not re-verified).
- Therefore the iOS feature set is: capture (via automation), categorize (notification actions / in-app), warn (notification, Live Activity, widget), and nudge (ask the user to turn off double-click or remove a card from Wallet). This still needs exactly the shared engine and UI that KMP provides.

---

## 8. AI-buildability and the Windows dev machine

- Build-system complexity (INFERRED, grounded in VERIFIED facts): native Kotlin < KMP < Flutter < RN/Expo for an agent building this particular app. KMP's extra risk is version alignment (Kotlin/KSP/AGP/Gradle/CMP/Room/Koin); mitigate with a pinned `libs.versions.toml`, convention plugins in `build-logic/`, Gradle configuration cache on, and a one-line "known-good matrix" in the repo (suggested anchor: the Flutter-3.47-verified set KGP 2.4.0 + AGP 9.1.0 + Gradle 9.3.1 + Java 17, plus CMP 1.12.2, Room 3.0.3, Koin 4.2, KSP matching Kotlin 2.4.0). Flutter's `flutter doctor`/`pub` are simpler, but the critical Android code is Kotlin anyway and the agent must debug across Dart isolates, platform channels and Gradle. RN adds Metro, Hermes, codegen and prebuild.
- Documentation corpus: the Android components this app needs (NLS, FGS types, BAL, overlays, NFC reflection, Shizuku) are documented almost exclusively in Kotlin/Java; an agent working in KMP uses that material directly. The Flutter/RN packages wrapping NLS are small, single-maintainer projects with sparse docs (VERIFIED stats above).
- Agent tooling: Dart & Flutter MCP server (SDK since Dart 3.9; analysis, fixes, runtime introspection, tests) plus official agent-skill repos (VERIFIED docs.flutter.dev/ai/tools). Compose Hot Reload MCP server (CMP 1.12, experimental; reload/screenshot/semantic tree/click/logs on the desktop JVM target) (VERIFIED). Android Studio Agent Mode with MCP support since mid-2025 (REPORTED/VERIFIED blog). Both camps are usable by a coding agent; Flutter's is more mature, KMP's is newer but targets exactly the shared UI.
- Windows 11: Android builds work for all stacks. iOS: KMP and Flutter need a Mac or hosted macOS CI; Expo EAS builds iOS in the cloud. Kotlin/Native will configure iOS targets on Windows and skip their compilation; keep them declared so `commonMain` purity is enforced by the IDE (INFERRED). Path-length hygiene as in 3.6.

---

## 9. Weighted comparison matrix

Scores 1-5 (5 best). Weights sum to 100. Scores are judgments (INFERRED) grounded in the verified facts above.

| Criterion (weight) | Native Kotlin | KMP + CMP | Flutter | RN / Expo |
|---|---|---|---|---|
| Depth/latency of native Android integration in system callbacks (25) | 5 | 5 | 3 | 3 |
| Robustness when UI process is dead; background execution model (20) | 5 | 5 | 2 | 2 |
| Single DB/engine shared by native services and UI, no second SQLite copy (15) | 5 | 5 | 2 | 2 |
| iOS portability of engine + UI (12) | 1 | 4 | 5 | 5 |
| AI-buildability (docs corpus, build complexity, error clarity) (10) | 5 | 4 | 4 | 4 |
| Maintenance risk of required third-party packages (8) | 5 | 4 | 3 | 2 |
| Windows dev + CI effort incl. eventual iOS builds (5) | 5 | 4 | 5 | 5 |
| Performance / footprint of the always-on sensing path (5) | 5 | 4 | 3 | 3 |
| **Weighted total (/500)** | **452** | **460** | **309** | **301** |

Reading: on Android alone native and KMP are equivalent; KMP wins because iOS portability is a stated requirement and its Android cost is near zero when the module boundaries are respected.

---

## 10. Recommended architecture and module layout

Gradle (Kotlin DSL, version catalog, convention plugins). All modules in ONE Android process.

```
settings.gradle.kts
gradle/libs.versions.toml            # pinned: kotlin 2.4.0, agp 9.1.x, ksp (matching), cmp 1.12.2, room3 3.0.3,
                                     #         androidx.sqlite 2.7.x, koin-bom 4.2.x, nav3 (from CMP 1.12.2 page),
                                     #         lifecycle (from CMP page), kotlinx-coroutines, kotlinx-datetime, kotlinx-serialization
build-logic/                         # convention plugins: save.kmp.library, save.android.library, save.android.app, save.compose
core/
  domain/        KMP  (org.jetbrains.kotlin.multiplatform + com.android.kotlin.multiplatform.library; targets android, iosArm64, iosSimulatorArm64, jvm)
                 Pure Kotlin: Money (minor units, Long), Category, BudgetPeriod, Envelope math, OverridePolicy,
                 MerchantRule learning, IngestTapUseCase, DecideEnforcementUseCase, ports (interfaces) for repos/clock/ids.
  data/          KMP  Room 3 database (@ConstructedBy), DAOs (suspend/Flow), repositories implementing domain ports,
                 BundledSQLiteDriver, migrations, DataStore/Settings for preferences; expect/actual only for DB file path.
  ui/            KMP  Compose Multiplatform screens, ViewModels (lifecycle-viewmodel-compose), Navigation 3 back stack,
                 design system; exposes App() and, in iosMain, MainViewController().
  testing/       KMP  fakes, fixtures, kotlin.test helpers for commonTest.
platform/
  android-sensing/     Android lib (com.android.library, built-in Kotlin): WalletNotificationListener (NLS), notification parsers
                       per wallet/bank package, dedupe by notification key, requestRebind watchdog, categorization notification with actions.
  android-enforcement/ Android lib: EnforcementForegroundService (specialUse), NfcController (reflection / Shizuku), OverlayController
                       (SYSTEM_ALERT_WINDOW), BudgetTileService, optional TapGuardAccessibilityService, boot/package-replaced receivers.
  android-core/        Android lib: Application init (Koin start), notification channels, WorkManager periodic self-heal, permissions UI helpers.
app-android/   com.android.application: single Activity hosting ui.App(), manifest merging, Koin modules wiring, debug tooling.
desktop-dev/   JVM app (optional): runs ui.App() with Compose Hot Reload + MCP server for fast UI iteration on Windows.
app-ios/       Xcode project (later, on a Mac): SwiftUI shell, LogTapIntent (App Intents, .background), notification actions,
               Live Activity; links core:* as a framework (direct integration or SwiftPM via Kotlin 2.4 swiftPMDependencies).
```

Conventions that make the iOS port cheap later: no `android.*`/`java.*` in `core/*` commonMain (the declared iOS targets enforce this in the IDE even on Windows); all time via `kotlinx-datetime` + injected `Clock`; money as `Long` minor units; every write goes through `IngestTapUseCase`/repositories so both the NLS and the future iOS intent produce identical ledger entries; the enforcement decision is a pure function returning an `EnforcementPlan` that Android executes and iOS renders as a warning.

---

## 11. Top 10 pitfalls for the recommended stack (KMP + CMP, Android-first, Windows dev)

1. **AGP 9 built-in Kotlin**: applying `kotlin("multiplatform")` together with `com.android.library` fails; shared modules must use `com.android.kotlin.multiplatform.library` (single variant, resources off by default, no BuildConfig); never apply `kotlin-android` in Android modules; `kapt` is incompatible (Room 3 is KSP-only). (VERIFIED)
2. **Version drift across Kotlin / KSP / AGP / Gradle / CMP / Room / Koin / Nav3 / lifecycle**: pin everything in the catalog; take Nav3/lifecycle versions only from the CMP "What's new" page (a non-existent lifecycle version was a reported failure). (VERIFIED/REPORTED)
3. **Room in common code**: no blocking DAOs, no LiveData, no `setQueryExecutor`, no multi-instance invalidation, no pre-packaged DB; use `suspend`/`Flow`, `BundledSQLiteDriver`, `useWriterConnection`/`withWriteTransaction`. (VERIFIED)
4. **Keep one process**: adding `android:process` to any service silently breaks shared-instance invalidation and reintroduces multi-connection concerns. (INFERRED from Room KMP limits)
5. **FGS type and start context**: declare `specialUse` + `PROPERTY_SPECIAL_USE_FGS_SUBTYPE` + `FOREGROUND_SERVICE_SPECIAL_USE`; start the FGS from the NLS callback (BFSL via system binding) or from a user action; do not rely on `SYSTEM_ALERT_WINDOW` alone on Android 15+ (needs a visible overlay); `BOOT_COMPLETED` cannot start `dataSync` on 15+. (VERIFIED)
6. **Listener lifecycle**: the NLS process runs at `PERCEPTIBLE_LOW_APP_ADJ` and can be killed and recreated; design `onListenerConnected()` to reconcile (re-scan `getActiveNotifications()`), persist dedupe keys, and call `requestRebind()` on disconnect; the BFSL exemption vanishes if notification access is revoked. (VERIFIED facts, INFERRED design)
7. **iOS targets on Windows**: Apple targets are skipped, so `commonMain` mistakes (JVM imports) surface only in the IDE (K2 mode) or on the Mac/CI; keep targets declared and run a macOS CI job early. `iosX64` is gone; min iOS 15 with Kotlin 2.4. (VERIFIED)
8. **Compose Hot Reload is JVM-only**: wire a `desktop-dev` module; do not expect reload on the Android emulator; Hot Reload plugin 1.2.0-alpha needs CMP 1.10+. (VERIFIED)
9. **Koin from Swift**: `init*` functions get a `do` prefix (`KoinIosKt.doInitKoinIos()`); start Koin in `Application.onCreate()` on Android so services created by the system can inject. (VERIFIED/INFERRED)
10. **Windows path limits**: Kotlin/Native toolchain unzip failures and `CreateProcess error=206`; keep a short project path, enable long paths, `core.longpaths=true`, run Gradle from the CLI when the IDE launcher fails. (REPORTED)

---

## 12. Open questions (device tests or user decisions)

1. Confirm on the user's phone (Android 16/17, Google Wallet current build) that `startForegroundService()` from inside `onNotificationPosted()` succeeds with no Activity visible — expected per AOSP reading; verify with `adb shell dumpsys activity services` showing `allowStartForeground` reason BFGS/FGS_BINDING.
2. Does the user want the iOS app at all in the next 12 months? If not, KMP's extra ceremony could be deferred (but the module boundaries still pay off for testability).
3. Is a Mac or hosted macOS CI acceptable for iOS builds (KMP/Flutter), or is Windows-only a hard constraint (which would favour Expo EAS for iOS)?
4. iOS: does `FamilyActivityPicker` list Wallet on an individually authorized device, and does shielding it affect the double-click Apple Pay sheet? Device test only.
5. iOS: how do `Choose from Menu` / `Ask for Input` behave when a Transaction automation runs immediately on a locked phone (iOS 26 and 27)? Device test; the recommended design avoids depending on it.
6. iOS: which of the user's cards deliver Wallet transaction data promptly (the forum pattern suggests network/issuer differences cause trigger timeouts)?
7. Room 3.0.3 <-> androidx.sqlite version pairing (the KMP guide pins sqlite 2.7.1 against room3 3.1.0-alpha01); confirm in the 3.0.x release notes.
8. Whether to use Navigation 3 (1.2.0-rc01 on iOS via JetBrains artifacts) or the stable Navigation 2 port for the first release.

---

## Sources

Android platform and AOSP
- https://developer.android.com/about/versions/17/behavior-changes-all (read 2026-10-17)
- https://developer.android.com/about/versions/17/behavior-changes-17 (read 2026-10-17)
- https://developer.android.com/about/versions/oreo/background (foreground definition incl. notification listener)
- https://developer.android.com/develop/background-work/services/fgs/restrictions-bg-start (exemption list)
- https://developer.android.com/develop/background-work/services/fgs/service-types (specialUse, shortService, dataSync)
- https://android.googlesource.com/platform/frameworks/base/+/refs/heads/main/services/core/java/com/android/server/am/ActiveServices.java (shouldAllowFgsStartForeground*; read 2026-10-17)
- https://android.googlesource.com/platform/frameworks/base/+/refs/heads/main/services/core/java/com/android/server/am/OomAdjuster.java (BIND_FOREGROUND_SERVICE -> BOUND_FOREGROUND_SERVICE; BFSL propagation)
- https://android.googlesource.com/platform/frameworks/base/+/refs/heads/main/services/core/java/com/android/server/notification/NotificationManagerService.java (NotificationListeners.getBindFlags)
- https://android.googlesource.com/platform/frameworks/base/+/refs/heads/main/services/core/java/com/android/server/notification/ManagedServices.java
- https://android.googlesource.com/platform/frameworks/base/+/refs/heads/main/core/java/android/content/Context.java (BIND_* javadoc)
- https://developer.android.com/build/migrate-to-built-in-kotlin (AGP 9)
- https://developer.android.com/kotlin/multiplatform/plugin (com.android.kotlin.multiplatform.library)
- https://developer.android.com/kotlin/multiplatform/room
- https://developer.android.com/jetpack/androidx/releases/room
- https://developer.android.com/jetpack/androidx/releases/room3
- https://android-developers.googleblog.com/2025/11/jetpack-navigation-3-is-stable.html
- https://android-developers.googleblog.com/2025/06/agentic-ai-takes-gemini-in-android-studio-to-next-level.html
- https://www.androidauthority.com/android-17-3561251/ and https://9to5google.com/2026/02/14/android-17-schedule/ (Android 17 dates; secondary)

Kotlin / JetBrains
- https://blog.jetbrains.com/kotlin/2025/05/compose-multiplatform-1-8-0-released-compose-multiplatform-for-ios-is-stable-and-production-ready/
- https://blog.jetbrains.com/kotlin/2026/01/compose-multiplatform-1-10-0/
- https://blog.jetbrains.com/kotlin/2026/05/compose-multiplatform-1-11-0
- https://kotlinlang.org/docs/multiplatform/whats-new-compose-110.html
- https://kotlinlang.org/docs/multiplatform/whats-new-compose-111.html
- https://kotlinlang.org/docs/multiplatform/whats-new-compose-112.html
- https://kotlinlang.org/docs/multiplatform/compose-compatibility-and-versioning.html
- https://kotlinlang.org/docs/multiplatform/compose-navigation-3.html
- https://kotlinlang.org/docs/multiplatform/multiplatform-plugin-releases.html
- https://kotlinlang.org/docs/multiplatform/multiplatform-run-tests.html
- https://kotlinlang.org/docs/multiplatform/multiplatform-discover-project.html
- https://kotlinlang.org/docs/native-target-support.html
- https://kotlinlang.org/docs/whatsnew24.html
- https://blog.jetbrains.com/kotlin/2025/12/kotlin-2-3-0-released/
- https://blog.jetbrains.com/kotlin/2026/06/kotlin-2-4-0-released/
- https://blog.jetbrains.com/kotlin/2025/05/kotlin-multiplatform-tooling-now-in-intellij-idea-and-android-studio/
- https://blog.jetbrains.com/kotlin/2025/08/kmp-roadmap-aug-2025/
- https://blog.jetbrains.com/kotlin/2026/01/update-your-projects-for-agp9/ (returned HTTP 403 during this session; cited via search summary)
- https://github.com/JetBrains/compose-hot-reload
- https://www.infoworld.com/article/4216661/compose-multiplatform-1-12-0-welcomes-coding-agents-with-mcp-server.html
- https://github.com/sqldelight/sqldelight/releases
- https://insert-koin.io/docs/reference/koin-core/kmp-setup

SQLite
- https://www.sqlite.org/howtocorrupt.html (sections 2.2, 2.3, 8.1)

Flutter
- https://flutter.dev/blog/whats-new-in-flutter-3-47
- https://docs.flutter.dev/release/archive
- https://docs.flutter.dev/packages-and-plugins/background-processes
- https://docs.flutter.dev/release/breaking-changes/migrate-to-built-in-kotlin
- https://docs.flutter.dev/ai/tools
- https://flutter.dev/blog/supercharge-your-dart-flutter-development-experience-with-the-dart-mcp-server
- https://pub.dev/packages/flutter_notification_listener and https://github.com/jiusanzhou/flutter_notification_listener
- https://pub.dev/packages/flutter_notification_listener_plus
- https://pub.dev/packages/flutter_background_service and https://github.com/ekasetiawans/flutter_background_service
- https://pub.dev/packages/flutter_foreground_task
- https://pub.dev/packages/sqlite3 ; https://pub.dev/packages/sqlite3_flutter_libs ; https://pub.dev/packages/drift_sqflite
- https://drift.simonbinder.eu/isolates ; https://drift.simonbinder.eu/dart_api/streams

React Native / Expo
- https://reactnative.dev/docs/headless-js-android
- https://github.com/facebook/react-native/releases
- https://docs.expo.dev/guides/new-architecture/
- https://expo.dev/changelog/sdk-56 ; https://expo.dev/changelog/sdk-57
- https://docs.expo.dev/config-plugins/introduction/ ; https://docs.expo.dev/config-plugins/mods/
- https://docs.expo.dev/build/introduction/
- https://docs.expo.dev/versions/latest/sdk/background-task/
- https://docs.expo.dev/versions/latest/sdk/sqlite/
- https://nitro.margelo.com/docs/comparison
- https://github.com/leandrosimoes/react-native-android-notification-listener
- https://github.com/Rapsssito/react-native-background-actions
- https://github.com/transistorsoft/react-native-background-fetch
- https://github.com/OP-Engineering/op-sqlite

Apple
- https://support.apple.com/guide/shortcuts/transaction-trigger-apd65c67538a/ios
- https://support.apple.com/guide/shortcuts/create-a-new-personal-automation-apdfbdbd7123/ios
- https://support.apple.com/guide/shortcuts/apd68b5c9161/ios (Ask for Input) ; https://support.apple.com/guide/shortcuts/apd8efa49a70/ios (prompts)
- https://developer.apple.com/documentation/appintents/appintent/supportedmodes
- https://developer.apple.com/documentation/appintents/appintent/continueinforeground(_:alwaysconfirm:)
- https://developer.apple.com/documentation/appintents/foregroundcontinuableintent
- https://developer.apple.com/documentation/corenfc
- https://developer.apple.com/documentation/managedsettings/shieldsettings
- https://developer.apple.com/documentation/familycontrols/familyactivitypicker
- https://developer.apple.com/documentation/familycontrols/authorizationcenter/requestauthorization(for:)
- https://developer.apple.com/forums/thread/765516 ; /758053 ; /850369 ; /746889
- https://discussions.apple.com/thread/256252606
- https://matthewcassinelli.com/shortcuts-automations-ios-ipados-transaction-display-stage-manager/ (2023)
- https://matthewcassinelli.com/automations-run-immediately-shortcuts-notifications (2023)
- https://www.idropnews.com/ios-17/this-new-ios-17-shortcut-will-help-you-keep-track-of-your-spending/197589/ (2023)
- https://help.travel-spend.com/shortcuts--automation/ignQHsp85RQDsig2QwVcdX/set-up-apple-pay-automation/7tL8XfjBceg4D7mQeiSK2V (2026)
- https://help.finerd.ai/apple-pay (2026)
- https://getfinny.app/blog/ios-shortcuts-automations-flaky-fix ; https://getfinny.app/blog/auto-capture-apple-pay-spending-2026 (vendor, 2026)
- https://9to5mac.com/2024/08/14/apple-nfc-chip-iphone-ios-18-1 (NFC & SE Platform; secondary)
- https://techcrunch.com/2026/06/08/apple-will-let-you-build-workflows-using-ai-in-its-new-shortcuts-app (iOS 27 Shortcuts; secondary)
