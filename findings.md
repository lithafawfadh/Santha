# Findings & Architectural Decisions

## Key Technical Facts
- **Stack:** React 18, Vite, TypeScript, Tailwind CSS, Supabase, Framer Motion, Lucide React.
- **Current `dist` size:** ~730 KB.
- **Estimated final APK size:** ~4 MB to 6 MB (Release), ~8 MB (Debug).
- **Git Branch:** `feature/mobile-app`
- **Distribution:** Direct APK download + WhatsApp link via GitHub Actions artifacts / releases.

## Design Decisions
1. **Preserve Exact UI:** No CSS classes or HTML structure altered. All glass cards, dark mode, animations remain 100% identical.
2. **Offline Mode:**
   - Members should never see an empty screen if opening the app without internet.
   - Cache key: `santha_cached_data_v1` storing `{ payments, loans, donations, allUsers, groupStats, lastSyncedAt }`.
   - On offline, dashboard displays cached data with a discreet `⚡ Offline Mode` chip.
   - On online, app silently syncs with Supabase and updates cache.
3. **Hardware Back Button:**
   - On mobile, Android users expect the back button to navigate tabs / close modals rather than quitting the app.
