# TerraVault

A privacy-first digital property vault. TerraVault helps landowners — especially those with rural, agricultural, or inherited property — preserve, organize, and access everything about their land: documents, photographs, GPS locations, and visit history.

**Your data stays yours.** TerraVault is never a cloud storage provider. Every property is a folder in *your own* Google Drive, and no property data is ever persisted on TerraVault's servers.

> This repo is the web frontend prototype. See [PRD.md](./PRD.md) for the full product requirements.

---

## Why TerraVault exists

Landowners commonly face:

- Forgetting the exact location of inherited land
- Losing photographs of the property over time
- Losing important property documents (deeds, tax receipts, surveys)
- Not remembering property boundaries
- Being unable to compare how land has changed over the years
- Scattered PDFs, photos, and notes across many devices

TerraVault keeps every document, every coordinate, and every visit — held in one private place that belongs to you.

## Core principles

1. **Privacy first** — TerraVault never permanently retains property photos, documents, metadata, or GPS data on its own servers.
2. **You own your data** — everything lives in a dedicated folder in your own Google Drive.
3. **Zero-trust architecture** — even a full compromise of TerraVault's backend exposes none of your property, because there is nothing of yours to take.

---

## Tech stack

| Layer | Technology |
|---|---|
| Web frontend | React, TypeScript, Vite, Tailwind CSS v4, GSAP, Lenis smooth scroll |
| Mobile | Flutter (in `app/`), mirroring the `stitch_screens` designs |
| Backend | Node.js, Express, Passport.js (sessions), MongoDB (in `backend/`) |
| Package manager | pnpm (workspace: `pnpm-workspace.yaml` covers `backend/` + `frontend/`) |
| Authentication | Passport.js (app auth) + Google OAuth (Drive access, future) |
| Cloud storage | The user's own Google Drive (no server-side persistence of property data) |

## Getting started

```bash
# backend (requires local MongoDB on 127.0.0.1:27017)
cd backend
cp .env.example .env     # set PORT (4100 if 4000 is taken), SESSION_SECRET
pnpm install
pnpm run dev

# frontend
cd frontend
pnpm install
pnpm run dev

# Flutter mobile app
cd app
flutter pub get
flutter run              # defaults to http://10.0.2.2:4100 (Android) / localhost:4100 (iOS)
```

Build for production:

```bash
pnpm run build
```

> **Note:** `backend/` runs on port 4100 by default (4000 is often taken by other local projects); the Flutter app's `lib/config.dart` matches.

---

## Status

- [x] Landing page (hero, statement, vault, visits, maps, privacy, CTA)
- [x] Auth flow (login / register)
- [x] Dashboard, all properties, property detail
- [x] Profile, contact
- [x] Dialogs (add property, add document, add visit, connect drive, confirm)
- [x] Unified dark + gold design system
- [x] Backend (Node.js — auth + properties done in `backend/`)
- [x] Flutter mobile app (`app/` — auth, dashboard, properties, documents, visits, drive connect)
- [ ] Google Drive integration (drive connect flow exists; needs Google OAuth credentials)

## License

[MIT](./LICENSE)
