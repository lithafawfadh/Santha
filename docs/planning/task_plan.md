# Task Plan: Santha Mobile App (APK) Implementation

## Goal
Transform the Santha web application into a standalone Android APK using Capacitor with zero visual discrepancy, offline-first dashboard caching, native Android handling, and an automated GitHub Actions cloud build pipeline for easy updates.

## Status Summary
- **Current Phase:** All 5 Phases Complete
- **Branch:** `feature/mobile-app`
- **Total Phases:** 5

---

## Phases

### [completed] Phase 1: Codebase Preparation & Offline-First Caching
- [x] **Task 1.1:** Mobile viewport & safe-area tuning in `index.html` & `src/index.css`
- [x] **Task 1.2:** Persistent Offline Caching in `src/context/AppContext.tsx` (cache payments, loans, donations, stats into `localStorage`)
- [x] **Task 1.3:** Create `OfflineBadge.tsx` to notify members when viewing cached data offline
- [x] **Task 1.4:** Verification: Run `npm run build` and ensure TypeScript + Vite build succeeds cleanly

### [completed] Phase 2: Capacitor Integration & Native Bridge
- [x] **Task 2.1:** Install Capacitor dependencies (`@capacitor/core`, `@capacitor/cli`, `@capacitor/android`, `@capacitor/app`, `@capacitor/status-bar`, `@capacitor/splash-screen`, `@capacitor/network`)
- [x] **Task 2.2:** Create `capacitor.config.ts` configured with `com.santha.app`, dark glass theme colors, and splash config
- [x] **Task 2.3:** Add Android hardware back-button listener in `App.tsx` (double-tap back to exit)

### [completed] Phase 3: Android Platform Configuration & Native Assets
- [x] **Task 3.1:** Run `npx cap add android` to generate the native Android project
- [x] **Task 3.2:** Configure `AndroidManifest.xml` (internet & network state permissions)
- [x] **Task 3.3:** Link icons from `public/` into Android mipmap directories using PowerShell high-quality bicubic script

### [completed] Phase 4: GitHub Actions Cloud Build Pipeline
- [x] **Task 4.1:** Create `.github/workflows/build-apk.yml` with automated Gradle build and artifact upload
- [x] **Task 4.2:** Support manual workflow dispatch and tag-based GitHub Releases (for automatic `.apk` download links)

### [completed] Phase 5: Documentation & Verification
- [x] **Task 5.1:** Document APK download, installation steps, and release workflow in `MOBILE_APP_GUIDE.md`
- [x] **Task 5.2:** Final build verification (`npm run build` & `npx cap sync android` both passed with 0 exit code)
