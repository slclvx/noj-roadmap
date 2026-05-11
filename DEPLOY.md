# Deploy NOJ Path

## 1. Quick local test

```bash
cd noj-path
npm install
npm run dev
```

Opens at `http://localhost:5173`. The PWA features (notifications, install) only fully work over HTTPS, so test those after deploying.

## 2. Push to GitHub

```bash
git init
git add .
git commit -m "initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/noj-roadmap.git
git push -u origin main
```

If you're replacing your existing `slclvx/noj-roadmap` repo:

```bash
# In the noj-path folder:
git init
git remote add origin https://github.com/slclvx/noj-roadmap.git
git fetch
git add .
git commit -m "fresh build: vite + react PWA"
git push -f origin main
```

## 3. Deploy to Vercel

1. Go to https://vercel.com and "Import Project"
2. Select your GitHub repo
3. Vercel auto-detects Vite — leave the defaults
4. **Environment variables** (if using Supabase sync):
   - `VITE_SUPABASE_URL` = your Supabase project URL (https://xxx.supabase.co)
   - `VITE_SUPABASE_ANON_KEY` = your anon/public key from Supabase project settings
5. Click Deploy

If you don't add the Supabase keys, the app still works — it just won't sync across devices. Everything saves to localStorage on the device.

## 4. Install on iPhone

1. Open Safari, go to your `noj-roadmap.vercel.app`
2. Tap the **Share** button (square with up arrow)
3. Scroll down → **Add to Home Screen**
4. Tap "Add"

You'll see the NOJ icon on your home screen. Open it — you get the full splash, no Safari bar, looks like a real app.

## 5. Install on Android

1. Open Chrome, go to your site
2. Tap the **⋮** menu
3. Tap **Install app** (or "Add to Home Screen")
4. Confirm

Same result: fullscreen app with icon, splash, notifications.

## 6. Enable notifications

After installing, on first launch the app asks for notification permission. Tap **Allow**.

You'll get:
- 🔥 Streak reminders if you haven't checked in by 6 PM
- 📋 Sunday weekly review nudge at 10 AM

**iOS requires iOS 16.4 or later** for PWA notifications. Older versions skip this feature.

## 7. Sound + Haptics

ON by default. Toggle the 🔊 button in the top nav to turn off. Sounds use the Web Audio API — no audio files to download. Haptic feedback works on Android automatically.

## 8. Supabase setup (optional, for cross-device sync)

If you want changes to sync across your phone, laptop, etc.:

1. Create a free Supabase project at https://supabase.com
2. In the SQL editor, create the table:

```sql
create table owner_state (
  key text primary key,
  value text,
  updated_at timestamp with time zone default now()
);

alter table owner_state enable row level security;

-- Allow anyone with the anon key to read
create policy "Anyone can read" on owner_state for select using (true);

-- Allow upserts (you'd want stricter auth in production)
create policy "Anyone can write" on owner_state for insert with check (true);
create policy "Anyone can update" on owner_state for update using (true);
```

3. Get your project URL and anon key from Settings → API
4. Add them as Vercel env vars (see step 3 above)

## 9. Troubleshooting

**Service worker not updating after deploy?**
- Bump `CACHE` version in `public/service-worker.js` (e.g., `noj-path-v3` → `v4`)
- Force-close the app and reopen

**Splash showing every time on desktop?**
- Normal — it shows once per browser session
- Clear sessionStorage to reset

**Icons not showing?**
- Make sure they're in `public/` (not `src/`)
- Hard refresh (Cmd+Shift+R) after deploy

**Sounds not playing on iPhone?**
- iOS requires a user interaction first
- The sound system unlocks on first tap

## What's in this package

```
noj-path/
├── index.html
├── package.json
├── vite.config.js
├── README.md
├── DEPLOY.md (this file)
├── public/
│   ├── manifest.json
│   ├── service-worker.js
│   ├── icon-192.png
│   ├── icon-512.png
│   ├── apple-touch-icon.png
│   └── favicon-32.png
└── src/  (React app — see README)
```

That's it. You're done. Welcome to NOJ Path on your phone.
