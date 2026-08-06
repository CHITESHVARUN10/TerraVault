# TerraVault — Product Requirements Document

**Working concept name:** Digital Property Vault
**Document status:** Draft v1.0
**Owner:** Product/Founder

---

## 1. Executive Summary

TerraVault is a privacy-first digital property management platform that helps individuals — particularly landowners in rural or village areas — securely preserve, organize, and access information about the properties they own. It is not a government land records system and not a general cloud storage product. It is a personal digital memory vault for property documents, photographs, GPS locations, and visit history, built on the principle that **the user owns their data and their storage**; TerraVault only provides the interface.

---

## 2. Problem Statement

Landowners, especially those with rural or inherited property, commonly face:

- Forgetting the exact location of inherited land
- Losing photographs of the property over time
- Losing important property documents (deeds, tax receipts, surveys)
- Not remembering property boundaries
- Inability to compare how land has changed over years
- Scattered PDFs, photos, and notes across multiple devices/services

Landmarks, roads, and neighboring ownership change over time, making it progressively harder to identify or prove a property years after acquisition — particularly for owners who no longer live near the land.

---

## 3. Vision & Goals

**Vision:** Provide a secure, privacy-focused, and beautifully designed digital vault that preserves the history, documents, location, and context of a user's properties over time.

**Primary goals for v1:**
- Let a user register properties and attach structured metadata, documents, GPS coordinates, and photos
- Ensure zero sensitive data is retained on TerraVault's own servers — everything lives in the user's Google Drive
- Provide a simple, trustworthy, and visually premium experience across web and mobile

**Non-goals (v1):**
- Replacing or interfacing with government land registries
- Acting as a general-purpose file storage / backup product
- Multi-user collaboration or shared property access (future roadmap)

---

## 4. Target Users

- Individuals who own land or real estate, especially rural/agricultural or ancestral property
- Owners who live far from their property and revisit infrequently
- Families managing inherited property across generations
- Anyone wanting a private, structured record of property documents and visual history

---

## 5. Core Philosophy / Principles

1. **Privacy First** — TerraVault is never a cloud storage provider; it never permanently retains property photos, documents, metadata, or GPS data on its own servers.
2. **User Owns Their Data** — Photos, documents, metadata, property information, visit history, and GPS coordinates all remain the user's property, stored in their own Google Drive.
3. **Zero Trust Architecture** — Even a full compromise of TerraVault's backend should not expose any user's property documents, photos, GPS data, or land information, since none of it is stored in the application's database.

---

## 6. Authentication

### 6.1 Application Authentication
Used solely for the TerraVault account layer — not for accessing property data.

- Manages: user account, sessions, preferences, future subscription state, basic profile
- Technology: Passport.js, JWT / session-based authentication

### 6.2 Google OAuth (Drive Access)
After signing into TerraVault, the user connects their Google account and grants access to a dedicated folder within their own Google Drive.

- TerraVault never sees or stores the user's Google password
- Google performs authentication; each device obtains its own OAuth credentials after consent
- No custom key-sharing mechanism is implemented by TerraVault
- Long-term goal: keep Drive access as privacy-preserving as possible, managing sensitive credentials client-side where feasible

---

## 7. Storage Architecture

TerraVault's own database is **not** used to store property data. Each property is represented as a folder inside the user's Google Drive.

```
Property Vault/
    Village Property/
        property.json
        Ownership.pdf
        Survey.pdf
        TaxReceipt.pdf
        Visits/
            2026/
            2027/
            2028/
```

All property-specific content (documents, photos, metadata, visit records) is read from and written to this Drive folder structure. TerraVault's backend orchestrates reads/writes but does not persist this content.

---

## 8. Feature Requirements

### 8.1 Property Metadata
Each property has a single structured `property.json` file (rather than many scattered text files) containing:

- Property category
- Ownership type
- Purchase date
- Previous owner
- Inherited or purchased status
- Area (value + unit)
- Estimated current market value
- Purchase price
- GPS coordinates
- Personal notes

### 8.2 Property Categories
- Agricultural Land
- Residential Plot
- Commercial Property
- Open Land
- Farm
- Industrial Land
- Other

### 8.3 Property Information Fields

**Ownership type:**
- Purchased
- Inherited
- Gifted
- Trust
- Court Transfer

**General information:**
- Total Area / Area Unit
- Purchase Date
- Purchase Price
- Estimated Current Market Value
- Previous Owner
- Additional Notes

### 8.4 Visit History
Every property visit creates a permanent, timestamped historical record. Each visit captures:

- GPS location
- Timestamp
- Standing photo
- North-facing photo
- East-facing photo
- South-facing photo
- West-facing photo

Visits accumulate over time, letting users visually compare how a property has changed year over year.

### 8.5 Geolocation
- Every property is geotagged with precise coordinates stored in its metadata
- Coordinates power: map viewing, launching navigation, identifying nearby properties, and organizing properties spatially

### 8.6 Maps
- **Mobile (React Native):** launches native map apps — Apple Maps on iOS, Google Maps on Android — for navigation
- **Web:** in-app interactive map using Leaflet + OpenStreetMap

### 8.7 Property Documents
Users upload documents under meaningful, predefined document types rather than raw filenames, including:

- Ownership Deed
- Inheritance Document
- Will
- Trust Document
- Survey Map
- Property Tax Receipt
- Chain of Ownership
- Court Order
- Other

---

## 9. Technology Stack

| Layer | Technology |
|---|---|
| Web frontend | React.js, Three.js, React Three Fiber, GSAP (or equivalent) for scroll animation, Leaflet + OpenStreetMap |
| Mobile | React Native, with native Apple Maps / Google Maps, Camera, GPS, local secure storage |
| Backend | Bun runtime, modular architecture (framework-agnostic for future flexibility) |
| Database | MongoDB — application-level data only, never property data |
| Authentication | Passport.js (app auth) + Google OAuth (Drive access) |
| Cloud storage | User's own Google Drive (no server-side persistence of property data) |

---

## 10. Landing Page Requirements

The landing page should communicate trust, elegance, and technical excellence rather than function as a generic SaaS homepage. Goals:

- High-end, modern aesthetic with elegant typography
- Smooth transitions and rich micro-interactions
- Premium spacing and layout
- Three-dimensional visual elements with high-performance rendering
- Immersive, scroll-driven storytelling with choreographed section transitions
- Minimalistic, premium design language — refinement over visual excess

**Suggested stack:** Three.js, React Three Fiber, smooth-scroll libraries.

---

## 11. Success Criteria (v1)

- A user can connect their Google Drive and create their first property in under a few minutes
- A user can add/view structured metadata, upload documents by type, and log a dated visit with GPS + directional photos
- No property-level data (documents, photos, metadata, GPS) is ever persisted on TerraVault's servers or database
- Web map (Leaflet/OSM) and mobile native map handoff both function correctly
- Landing page delivers a distinct "premium" first impression relative to typical SaaS sites

---

## 12. Future Roadmap (Post-v1)

- Historical property timelines
- Multi-device synchronization
- Shared property access (multi-user)
- AI-assisted document understanding
- Boundary visualization
- Offline data capture with later sync
- Smart search across properties
- Export and backup utilities
- Rich property analytics and insights

---

## 13. Guiding Principle

> Your property data remains yours. It stays under your control, stored in your own Google Drive. TerraVault exists to organize, protect, and simplify access — not to own or monetize your information.
