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
| Mobile (future) | React Native with native Apple Maps / Google Maps, camera, GPS |
| Backend | Node.js, Express, Passport.js (sessions), MongoDB (in `backend/`) |
| Authentication | Passport.js (app auth) + Google OAuth (Drive access, future) |
| Cloud storage | The user's own Google Drive (no server-side persistence of property data) |

## Getting started

```bash
# frontend
cd frontend
npm install
npm run dev

# backend (requires local MongoDB on 127.0.0.1:27017)
cd backend
npm install
cp .env.example .env
npm run dev
```

Build for production:

```bash
npm run build
```

> **Note:** the current frontend uses a client-side mock data layer (localStorage) to simulate auth, properties, documents, and visits until the backend lands. See `src/lib/store.tsx`.

---

## Status

- [x] Landing page (hero, statement, vault, visits, maps, privacy, CTA)
- [x] Auth flow (login / register)
- [x] Dashboard, all properties, property detail
- [x] Profile, contact
- [x] Dialogs (add property, add document, add visit, connect drive, confirm)
- [x] Unified dark + gold design system
- [ ] Backend (Node.js — auth + properties done in `backend/`)
- [ ] Google Drive integration
- [ ] Mobile app (React Native)

## License

[MIT](./LICENSE)
