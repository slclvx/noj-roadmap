# NOJ Path

The road to becoming the first foreign CEO of Nintendo of Japan.

A mobile-first PWA dashboard tracking the 25-year plan: phases, side quests, Japanese progress, books, streaks, journal, and more. Installable as a real app on iOS and Android.

## Quick start

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually `http://localhost:5173`).

## Deploy to Vercel

1. Push this folder to your GitHub repo
2. Connect the repo to Vercel
3. Add env vars (if using Supabase sync):
   - `VITE_SUPABASE_URL` — your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY` — your Supabase anon key
4. Deploy — Vercel auto-detects Vite

See `DEPLOY.md` for the full guide including PWA install instructions on phone.

## File structure

```
noj-path/
├── public/
│   ├── manifest.json          # PWA manifest
│   ├── service-worker.js      # SW for offline + push notifications
│   ├── icon-192.png           # App icon (small)
│   ├── icon-512.png           # App icon (large)
│   ├── apple-touch-icon.png   # iOS home screen icon
│   └── favicon-32.png         # Browser tab icon
├── index.html                  # Root HTML with PWA meta tags
├── src/
│   ├── main.jsx               # React entry point
│   ├── App.jsx                # Root component, routing, settings
│   ├── styles/global.css      # Global CSS + animations
│   ├── lib/
│   │   ├── theme.js           # Colors, theme tokens
│   │   ├── utils.js           # LS storage, sound, haptics, notifications
│   │   └── supabase.js        # Supabase REST helper
│   ├── data/
│   │   ├── phases.js          # 8 phases (Pre-Roots through CEO)
│   │   ├── books.js           # 7 book phases (50+ books)
│   │   └── quests.js          # Side quests, predecessors, quotes, hiragana
│   ├── hooks/
│   │   ├── useToast.js
│   │   ├── useLiveState.js    # State synced with Supabase
│   │   └── useReminders.js    # Streak + weekly notifications
│   ├── components/
│   │   ├── UI.jsx             # Card, Pill, Check, ProgressBar, Toast, Confetti
│   │   ├── Nav.jsx            # TopNav, Sidebar, BottomNav
│   │   ├── SplashScreen.jsx   # Opening cinematic
│   │   └── CommandPalette.jsx # ⌘K search
│   └── pages/
│       ├── TodayPage.jsx
│       ├── RoadmapPage.jsx
│       ├── WhyPage.jsx
│       ├── TimelinePage.jsx
│       ├── WeeklyPage.jsx
│       ├── LettersPage.jsx
│       ├── QuotesPage.jsx
│       ├── ResourcesPage.jsx
│       ├── SideQuestsPage.jsx
│       ├── JapanesePage.jsx
│       ├── HiraganaPage.jsx
│       ├── StatsPage.jsx
│       ├── StreaksPage.jsx
│       ├── NetworkPage.jsx
│       └── PeoplePage.jsx
```

## Features

- **PWA install** — add to home screen on iOS/Android, opens fullscreen
- **Splash screen** — cinematic intro with sound
- **Cloud sync** — Supabase syncs your owner state across devices
- **Push notifications** — streak reminders + Sunday review nudge
- **Offline support** — service worker caches the app
- **Sound + haptics** — Nintendo-style chimes + vibration (toggleable)
- **Dark/light mode** — toggle in top nav
- **⌘K command palette** — quick jump to any page/phase/quest
- **Hiragana practice** — all 46 with progress tracking
- **Phase gating** — locked until previous phase complete
- **Progress detection** — "you are here" based on actual completion
- **15 pages** organized into Plan / Track / Reflect / Inspire groups

## Keyboard shortcuts

- `⌘K` / `Ctrl+K` — Command palette
- `T` — Today
- `R` — Roadmap
- `W` — Why
- `J` — Japanese
- `B` — Books (Resources)
- `Q` — Quests
- `S` — Stats
- `N` — Network
- `P` — Predecessors
- `D` — Toggle dark mode
