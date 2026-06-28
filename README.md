# Weekly

*A weekly digest from your closest people. No feed, no ads, no engagement loop.*

Weekly replaces the infinite feed with a **periodical**. Each week you publish one small spread — up to three photos and a few words — and on your delivery day you receive a single issue containing the spreads from everyone in your circle. The only interaction is a private **letter**, which arrives quietly bundled with that person's next issue. No likes, no comments, no metrics.

This repository is an **interactive prototype** for closed beta — a single-device web app you can install to your home screen. It runs entirely in the browser; everything you create is saved locally on your device. There is no account and no server, so nothing you write here is shared with anyone else.

## What you can do in the prototype

- **Read this week's issue** — a pre-seeded sample circle, so it feels alive the moment you open it. Tap any photo to view it full screen.
- **Compose your week** — add up to three photos (reorder or remove them) and a short note. It auto-saves as you go; there's no submit button. *Preview my spread* shows exactly how your week will appear in print.
- **Write a letter** — from any spread, write that person a short note. In the real product it would arrive with their next issue; here it's saved locally and the spread shows it's "on its way."
- **Your people & settings** — the button in the top corner opens your connections list (the 150-spot cap surfaced, invite by link or name, accept inbound requests, and remove with the real "no longer a connection" notice) and settings (display name, delivery day, the three allowed notification types, and the hashed-contact privacy copy). Removing someone takes them out of your issue immediately.

Two content modes, switched from the bar at the bottom — *This week's issue* (reading) and *Your week* (composing) — plus a quiet account area behind the top-corner button. That's the whole app, by design.

## Install it (beta testers)

1. Open the link on your phone.
2. **iPhone:** Share → *Add to Home Screen*. **Android:** menu → *Install app* / *Add to Home screen*.
3. Launch it from the icon — it opens full-screen, like an app, and works offline after the first load.

## Run locally

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build to dist/
npm run preview  # preview the production build
```

## How it's built

- **React + Vite**, no backend. State persists to `localStorage`; picked photos are downscaled in-browser before storing.
- Installable **PWA** (web manifest + a small runtime-caching service worker).
- Deployed to **GitHub Pages** via the workflow in `.github/workflows/deploy.yml` on every push to `main`. `base: './'` keeps assets relative so it works under the Pages project subpath.

## Prototype scope

This prototype covers the core loop (read · compose · letters) plus a local **connections** list and **settings** area, built to validate the feel of the concept. It is deliberately *not* the full product in [the spec](spec.md): connections, the 150-cap, invites and removals all work *on your device only* — there are no real accounts, and no reciprocity/grace engine, scheduled push notifications, or printed-paper pipeline. Because GitHub Pages is static hosting, true multi-user sync (connections that span different people's devices) would require the Django/Postgres backend described in the spec.
