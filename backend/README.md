# TerraVault Backend

Node.js + Express + Passport.js (sessions) + MongoDB — plain JavaScript (CommonJS). No TypeScript, no Bun.

## Stack

- **Runtime:** Node.js >= 20
- **Web:** Express 4
- **Auth:** Passport.js (local strategy) + express-session (cookie sessions)
- **Database:** MongoDB via Mongoose
- **Hashing:** bcryptjs (12 rounds)
- **Sessions:** MemoryStore in dev/test, connect-mongo in production
- **Google Drive:** googleapis (OAuth 2.0, drive.file scope); tokens encrypted at rest (AES-256-GCM)

## Setup

```bash
# from backend/
npm install
cp .env.example .env   # then set SESSION_SECRET + DRIVE_TOKEN_KEY
npm run dev            # nodemon, requires local MongoDB on 127.0.0.1:27017
```

### Google Drive integration (Phase 5)

1. Create OAuth credentials at https://console.cloud.google.com/apis/credentials
2. Add `http://localhost:4000/api/drive/oauth-callback` as an authorized redirect URI
3. Set `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, and `DRIVE_TOKEN_KEY` (≥32 chars) in `.env`

Drive is optional — auth, properties, documents, and visits all work without it. When connected, property metadata is mirrored to `Property Vault/<property-id>/property.json` in the user's own Drive, and document uploads store the real file there (the DB only keeps the Drive file id).

## Scripts

| Script | Description |
|---|---|
| `npm run dev` | Run with nodemon (auto-restart) |
| `npm start` | Run with plain node |
| `npm test` | Run the node:test suite (requires local MongoDB) |

## API

All property endpoints require a valid session cookie (`connect.sid`).

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | – | Register; sets session cookie, returns profile |
| POST | `/api/auth/login` | – | Login; sets session cookie, returns profile |
| POST | `/api/auth/logout` | – | Destroy session, clear cookie |
| GET | `/api/auth/me` | yes | Current user profile |
| GET | `/api/health` | – | Health check |
| GET | `/api/properties` | yes | List my properties |
| POST | `/api/properties` | yes | Create a property |
| GET | `/api/properties/:id` | yes | Get one property (owner only) |
| PATCH | `/api/properties/:id` | yes | Partial update (owner only) |
| DELETE | `/api/properties/:id` | yes | Delete (owner only) |
| POST | `/api/properties/:id/documents` | yes | Add a document |
| DELETE | `/api/properties/:id/documents/:docId` | yes | Remove a document |
| POST | `/api/properties/:id/visits` | yes | Log a visit |
| DELETE | `/api/properties/:id/visits/:visitId` | yes | Remove a visit |
| GET | `/api/drive/connect?state=...` | – | Redirect to Google OAuth consent |
| GET | `/api/drive/oauth-callback` | session | OAuth callback (exchanges code, stores tokens) |
| GET | `/api/drive/status` | yes | Drive connection status |
| POST | `/api/drive/disconnect` | yes | Forget the Drive connection |
| POST | `/api/drive/properties/:id/documents/upload` | yes | Multipart file upload → Drive |

### Property payload

```jsonc
{
  "name": "Riverside Plot",
  "category": "Agricultural Land",   // Agricultural Land | Residential Plot | Commercial Property | Open Land | Farm | Industrial Land | Other
  "ownership": "Purchased",          // Purchased | Inherited | Gifted | Trust | Court Transfer
  "purchaseDate": "2019-11-08",
  "purchasePrice": 620000,
  "area": 2.5,
  "areaUnit": "acres",               // acres | hectares | sqft | sqm | guntha | bigha
  "marketValue": 980000,
  "previousOwner": "Suresh Agarwal",
  "notes": "Corner plot by the old bridge.",
  "latitude": 28.6129,
  "longitude": 77.2295
}
```

### Session cookie

`connect.sid` — `HttpOnly`, `SameSite=Lax`, 7-day expiry, `Secure` in production. The cookie is set explicitly in the register/login controllers (after an explicit `req.session.save()`) rather than relying on express-session's response-finish hook, so it is reliable under any middleware stack.

## Structure

```
backend/
  src/
    index.js              # entry — env, db, server
    app.js                # express app assembly (cors, session, passport, routes)
    config/
      db.js               # mongoose connect
      passport.js         # local strategy + serializers
    models/
      User.js
      Property.js
    middleware/
      auth.js             # requireAuth
      error.js            # notFound + errorHandler
    routes/
      auth.routes.js
      property.routes.js
    controllers/
      auth.controller.js
      property.controller.js
    services/
      auth.service.js
      property.service.js
  tests/
    helpers.js
    auth.test.js
    property.test.js
```

## Phases

- **Phase 1 — Auth:** User model, register/login/logout/me, Passport local strategy, express-session, bcrypt hashing, CORS with credentials. ✅
- **Phase 2 — Properties:** Property model, owner-scoped CRUD, enum + range validation. ✅
- **Phase 3 — Hardening:** connect-mongo store, centralized errors, node:test suite, docs. ✅
- **Phase 4 — Documents & visits:** document subdocuments (name/type/size/driveFileId), visit logging (date/note/GPS), owner-scoped add/remove routes. ✅
- **Phase 5 — Google Drive:** OAuth connect/callback/status/disconnect with HMAC-signed CSRF state, AES-256-GCM encrypted tokens, `Property Vault/` folder tree with `property.json` metadata mirror, real multipart document upload to Drive. ✅
- **Phase 6 — (future)** Pro plan, mobile app.
