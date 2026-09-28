# Origin Tours & Travels — Website Architecture & Navigation Redesign

**Date:** 2026-07-02
**Status:** Draft for approval
**Author:** Engineering (with product/SEO input)

---

## 1. Purpose & Goals

Redesign the site's information architecture (IA), navigation, and content model to:

- Introduce a **Destinations** module of travel *guides* (informational, not bookable).
- Establish clean relationships: **1 Destination → many Tours**, **1 Destination → many Travel Resources**, **each Tour → exactly 1 Destination**, **each Travel Resource → one or more Destinations**.
- Ship a modern **navigation** (mega-menus on desktop, collapsibles on mobile) with an always-visible **"Get a Free Quote"** CTA.
- Rename the **Blog** section to **Travel Resources** (presentation + URL; DB stays `BlogPost`).
- Rename **Flights** / **Hotels** URLs to match their labels.
- Preserve SEO via **301 redirects** and complete structured data on every page type.
- Be modular and scalable to **hundreds of destinations, thousands of tours, tens of thousands of resources**.

### Non-goals (explicitly out of scope for this project)
- A dedicated Transport/Airport-Transfer module (linked contextually only for now).
- Hajj offerings (business does not sell Hajj — removed from nav; see §3).
- Online booking/payments (site remains enquiry-driven via `/contact` + `EnquiryForm`).
- Migrating `.jsx` public pages to TypeScript (keep the existing mixed-language convention).

---

## 2. Current Architecture (as-built)

- **Framework:** Next.js 16 App Router. Root `src/app/layout.tsx` → `AppRouterCacheProvider` → `Providers` (Redux + MUI) → `Header` + `Footer`.
- **Data:** PostgreSQL via Prisma 7 (`prisma-client` generator, `PrismaPg` adapter, `src/generated/prisma`). Schema synced with `prisma db push` — **no migration files**.
- **Public pages:** MUI `.jsx`. **Admin:** Tailwind `.tsx`. Admin CRUD pattern = server page → `"use client"` table → REST API route → `router.refresh()`.
- **Auth/redirects:** `src/proxy.ts` (Next 16 proxy convention) guards `/admin/*` and admin APIs. **No content redirects exist** — those belong in `next.config.ts`.
- **SEO infra (mature, reuse it):** `src/lib/service-jsonld.ts` (`breadcrumbJsonLd`, `serviceJsonLd`, `touristTripJsonLd`, `aggregateRatingJsonLd`), `src/lib/blog-jsonld.ts`, dynamic `src/app/sitemap.ts`, per-page `metadata` exports, `robots`/canonical handled per page.

### Findings that reshape the brief
1. **"Packages → Tours" is already done.** Nav, routes (`/tours`), APIs (`/api/tours`, `/api/public/tours`), admin (`/admin/tours`), and the `Tour` model already use "Tour". Residual "package" usage is *correct* domain terminology (`Tour.packages` JSON pricing tiers, "Umrah Packages", footer keyword labels). → This becomes a **light label sweep**, not a rename.
2. **`Destination` exists but is a thin master** (`name, slug, countryId, description, isActive`) under Admin → Masters. No public pages, no rich fields, no Tour/BlogPost relationship. → We **extend** it (no duplicate model).
3. **No `destinationId` on `Tour`; no Destination link on `BlogPost`.** → New relations required.
4. **Existing tour detail URLs are flat** (`/tours/[slug]` = a single tour). The brief's `/tours/dubai/...` nested scheme would break every existing tour URL (see §5 routing decision).

---

## 3. Locked IA Decisions (from stakeholder)

- **Navigation (final):** `Home · Destinations▾ · Tours▾ · Visa Services▾ · Flights · Hotels · Travel Resources▾ · About Us · Contact` + CTA **Get a Free Quote**.
- **Tours▾** mega-menu has **exactly three** categories: **International Tours · Domestic Tours · Umrah Packages**. **No Hajj anywhere in nav.**
- **Visa Services▾** mega-menu: **Tourist Visa · Business Visa · Student Visa · Transit Visa · Certificate Attestation**.
- **Flights** and **Hotels** are **standalone** top-level items (not grouped under a "Services" menu).
- **Transport / Airport Transfers**: **no** top-level nav item; linked contextually from Tour pages, Hotel pages, and the footer.
- **Hajj page:** **keep `/hajj` live** and in the sitemap; **remove it from navigation only** (no redirect, no deletion).
- **URL renames (with 301s):** `/air-ticketing → /flights`, `/hotel-booking → /hotels`, `/blog → /travel-resources` (and `/blog/:slug → /travel-resources/:slug`).
- **CMS:** DB keeps `BlogPost`; UI relabels to **Travel Resources**.

---

## 4. Data Model (Sub-project A — foundation)

Follows the house pattern: a few typed columns + **JSON for rich, evolving content** (mirrors `Tour.itinerary/packages/inclusions` and `BlogPost.faqs`). Applied with `prisma db push`.

### 4.1 `Destination` (extend existing)

```prisma
model Destination {
  id          Int      @id @default(autoincrement())
  name        String
  slug        String   @unique
  countryId   Int
  country     Country  @relation(fields: [countryId], references: [id], onDelete: Restrict)

  // --- NEW: guide content ---
  heroImage       String?   // hero background
  gallery         Json?     // string[] of image URLs
  overview        String?   // long HTML (rich text)
  sections        Json?     // keyed HTML blocks (schema below)
  attractions     Json?     // [{ name, description, image }]
  faqs            Json?     // [{ q, a }]  (same shape as BlogPost.faqs)
  region          String?   // optional menu grouping ("Middle East", "Southeast Asia")
  bestTimeShort   String?   // short chip text for cards (e.g. "Nov–Mar")

  // --- NEW: SEO + presentation ---
  metaTitle       String?
  metaDescription String?
  featured        Boolean   @default(false)
  sortOrder       Int?      // manual ordering in menus/listings

  description String?       // (existing) short summary — reused as card excerpt
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // --- NEW: relationships ---
  tours       Tour[]        // 1 destination → many tours
  blogPosts   BlogPost[]    // M:N (implicit) with Travel Resources

  @@index([countryId])
  @@index([featured])
}
```

**`sections` JSON schema** (all optional HTML strings, rendered as titled blocks in order):
```json
{
  "whyVisit": "<p>…</p>",
  "bestTimeToVisit": "<p>…</p>",
  "weather": "<p>…</p>",
  "thingsToDo": "<p>…</p>",
  "cuisine": "<p>…</p>",
  "culture": "<p>…</p>",
  "shopping": "<p>…</p>",
  "transportation": "<p>…</p>",
  "safetyTips": "<p>…</p>"
}
```
*Visa Information* on a destination page is rendered by a `<RelatedVisa>` block (§7), not stored on the Destination. *Related Tours* / *Related Resources* / *CTA* are derived/rendered, not stored.

### 4.2 `Tour` (add destination FK)
```prisma
model Tour {
  // …existing…
  destinationId Int?
  destination   Destination? @relation(fields: [destinationId], references: [id], onDelete: SetNull)
  @@index([destinationId])
}
```
- Existing `country` (String) and `tourCategoryId` are **retained** for backward compatibility and backfill.
- **Domestic vs International** (Tours mega-menu) is derived: `destination.country.name === "India"` ⇒ Domestic, else International.
- **Umrah Packages** column = existing `/umrah` hub (Umrah tours identified by the current `isUmrahTour` heuristic / category), unchanged.

### 4.3 `BlogPost` (add M:N to Destination)
```prisma
model BlogPost {
  // …existing…
  destinations Destination[]  // implicit M:N (join table _BlogPostToDestination)
  // `category` (String) continues to hold the Travel-Resources taxonomy value
}
```

### 4.4 Travel-Resources taxonomy
`BlogPost.category` holds one of the 17 resource types (Destination Guides, Travel Tips, Visa Updates, Travel News, Government Advisories, Packing Guides, Itineraries, Budget Travel, Luxury Travel, Family Travel, Honeymoon Ideas, Festival Guides, Airport Guides, Airline Information, Health Advisories, Travel Checklists, Seasonal Travel Guides). Defined as a shared constant `RESOURCE_CATEGORIES` in `src/lib/travel-resources.ts` and offered as a dropdown in the admin form (free-text still allowed for forward-compat).

---

## 5. Routing & Redirects (Sub-project D)

### 5.1 New / renamed routes
| New route | Type | Was |
|---|---|---|
| `/destinations` | listing (server) | — (new) |
| `/destinations/[slug]` | guide (server) | — (new) |
| `/travel-resources` | listing | `/blog` (folder renamed) |
| `/travel-resources/[slug]` | detail | `/blog/[slug]` |
| `/flights` | service page | `/air-ticketing` |
| `/hotels` | service page | `/hotel-booking` |

Public API routes rename in parallel: `/api/public/blog` → `/api/public/travel-resources` (keep internal handler logic identical). Admin API `/api/blog` **stays** (DB name unchanged) to minimize churn; only UI labels change.

### 5.2 Tours detail URL — **decision**
The brief suggests nested `/tours/dubai/dubai-honeymoon-tour`. That would **301-migrate every existing tour URL** and force every tour to have a destination before launch — high risk.

**Decision (Phase 1):** keep flat **`/tours/[slug]`** for tour detail (zero breakage, preserves SEO). Deliver destination-scoped browsing via:
- **`/destinations/[slug]`** guide → "Related Tours" section, and
- **`/tours?destination=<slug>`** filter on the existing Tours listing (Redux filter already supports faceting).

The nested `/tours/[destination]/[slug]` canonical restructure is documented as an **optional Phase 2** (after backfill proves every tour has a destination), including a full `/tours/[slug] → /tours/[destination]/[slug]` 301 map. **Flagged for confirmation in spec review.**

### 5.3 301 redirects — `next.config.ts` `redirects()`
```
/air-ticketing            → /flights                 (permanent)
/hotel-booking            → /hotels                  (permanent)
/blog                     → /travel-resources        (permanent)
/blog/:slug               → /travel-resources/:slug  (permanent)
```
No `/hajj` redirect (page stays). `sitemap.ts` updates: add `/destinations` + destination detail URLs, rename blog→travel-resources entries, rename air-ticketing/hotel-booking→flights/hotels, keep `/hajj`.

---

## 6. Navigation (Sub-project B)

### 6.1 Menu data source
Mega-menus need live destinations/categories. `layout.tsx` (server) calls a new `getNavMenuData()` (`src/lib/nav-data.ts`, cached via `unstable_cache`/`revalidate`) returning:
```ts
{
  destinations: { international: MenuLink[]; domestic: MenuLink[]; featured: MenuLink[] },
  visaTypes:   MenuLink[],   // Tourist/Business/Student/Transit (+ Attestation)
  resourceCategories: MenuLink[]
}
```
passed as a `menuData` prop into the client `Header`. Fallback to static links if the DB is unavailable (mirrors `sitemap.ts` try/catch).

### 6.2 Desktop — mega-menus
Rework `src/components/Header.jsx` `navLinks` into a typed structure supporting `type: "link" | "mega"`. New component `src/components/nav/MegaMenu.jsx` renders a full-width MUI `Popover`/`Paper` panel with column groups. Mega-menus: **Destinations, Tours, Visa Services, Travel Resources**. Plain links: Home, Flights, Hotels, About Us, Contact.
- **Tours** columns: International Tours · Domestic Tours · Umrah Packages.
- **Visa Services** column(s): Tourist/Business/Student/Transit Visa + Certificate Attestation.
- **Travel Resources**: the 17 categories (grouped) + "All Travel Resources".
- **Destinations**: grouped by `region` (or International/Domestic) + "All Destinations".

### 6.3 Mobile — collapsibles + persistent CTA
Drawer converts mega groups into MUI `Collapse` accordions. **"Get a Free Quote"** appears (a) pinned in the top bar on all breakpoints and (b) as the primary drawer button. Existing "Book Now"/phone CTAs are replaced/renamed to "Get a Free Quote" → `/contact`.

### 6.4 CTA
Single source of truth for CTA label/href in `Header`; always rendered (desktop bar + mobile). Footer keeps its own CTA.

---

## 7. Destinations Module (Sub-project C)

### 7.1 Public — `/destinations` (listing)
Server component; queries active destinations (featured first, then `sortOrder`/name). Card grid (reuse `ServiceCard` style) with hero thumb, name, country, `bestTimeShort` chip, excerpt. Filter/search client component consistent with `ToursClient`/`BlogClient`. `force-dynamic` or short `revalidate`.

### 7.2 Public — `/destinations/[slug]` (guide, NOT bookable)
Server page renders, in order: **Hero → Overview → Why Visit → Best Time → Weather → Top Attractions → Things to Do → Cuisine → Culture → Shopping → Transportation → Visa Information (`<RelatedVisa>`) → Safety Tips → FAQs (accordion) → Related Tours (`<RelatedTours>`) → Related Travel Resources (`<RelatedResources>`) → Strong enquiry CTA (`EnquiryForm`)**. `notFound()` when inactive/missing. Sections render only when present (graceful).

### 7.3 Admin — Destinations CRUD (promoted to top-level)
Move from Masters to a top-level **Destinations** sidebar item. New `src/components/admin/DestinationsTable.tsx` + rich modal form: name/slug, country, hero (`ImageUploader`), gallery (multi), overview + each `sections` block (`RichTextEditor`), attractions repeater, FAQs repeater (reuse Blog FAQ UI), SEO (meta title/desc), featured toggle, `sortOrder`, and a **Related Travel Resources** multi-select. API `PUT`/`POST` extended to accept the new fields. The thin Masters → Destinations entry is removed (or redirected to the new page).

---

## 8. Internal Linking Engine (Sub-project E)

Reusable **server** components in `src/components/related/`, each querying Prisma by relationship and rendering a titled card row (empty-render when none):

| Component | Query | Used on |
|---|---|---|
| `<RelatedTours destinationId>` | tours where `destinationId` | Destination, Resource |
| `<RelatedResources destinationId>` | blogPosts M:N destination (published gate) | Destination, Tour |
| `<RelatedVisa country>` | visas by country/type | Destination, Tour |
| `<RelatedDestination destinationId>` | the tour's/resource's destination(s) | Tour, Resource |

Wiring per the stakeholder matrix:
- **Destination →** Related Tours, Related Resources, Visa Services.
- **Tour →** Destination guide, Related Tours (same destination), Travel Resources, Visa info.
- **Travel Resource →** Destination(s), Tours, Visa Services.

All "published" gates reuse the blog publish rule already in `src/lib/blog.ts` (`publishedBlogWhere()`).

---

## 9. SEO (cross-cutting)

Every Destination / Tour / Resource page emits: unique `title`, meta description, canonical, Open Graph, Twitter card, **Breadcrumb schema**, and page-type **JSON-LD**, plus optimized internal links.

- **New** `src/lib/destination-jsonld.ts`: `destinationJsonLd()` → schema.org `TouristDestination`/`Place` (name, description, image, `containedInPlace` = country, `touristType`), composed with `breadcrumbJsonLd` and a FAQ `FAQPage` node when `faqs` exist (reuse the blog FAQ JSON-LD approach).
- **Tours/Resources** keep existing builders (`touristTripJsonLd`, `blogPostingJsonLd`) — extended with a `Place`/destination reference where available.
- **Breadcrumbs:** Destinations → `Home / Destinations / {name}`; Tours unchanged; Resources → `Home / Travel Resources / {title}`.
- **`sitemap.ts`:** per §5.3.
- **AI-search-readiness:** rich `FAQPage`, `TouristDestination`, and dense contextual internal links improve entity extraction; keep descriptive alt text and semantic headings.

---

## 10. Admin Dashboard (Sub-project F)

- **Sidebar** (`src/components/admin/Sidebar.tsx`): add top-level **Destinations**; rename **Blog → Travel Resources** (href stays `/admin/blog`); remove **Destinations** from the Masters group (now top-level).
- **Tours form** (`ToursTable.tsx`): add a **Destination** selector (dropdown from `/api/destinations`).
- **Travel Resources form** (`BlogPostsTable.tsx`): relabel headings to "Travel Resources"; add **Destinations** multi-select and a **category** dropdown from `RESOURCE_CATEGORIES`.
- Admins can: create/edit/delete Destinations; assign Tours → Destination; assign Resources → Destination(s); manage SEO, FAQs, galleries; pick featured tours; pick related resources.

---

## 11. Migration & Data Integrity

1. `prisma db push` to apply schema additions (nullable/relational — non-destructive).
2. **Backfill script** `scripts/backfill-destinations.ts`: for each distinct `Tour.country`, upsert a `Destination` (linked to matching `Country`), set `Tour.destinationId`. Idempotent (upsert by slug), logged, safe to re-run. Existing tour content stays on tours (no duplication; destinations hold *guide* content authored later).
3. Resources (`BlogPost`) start with no destination links; editors attach them via the new multi-select. Optional keyword-match seeding (like `footer-links.ts`) can pre-link obvious ones.
4. No existing rows deleted; all new columns nullable. Rollback = drop new columns / ignore relations.

---

## 12. File-by-File Change List

**Schema / data**
- `prisma/schema.prisma` — extend `Destination`, add `Tour.destinationId`, `BlogPost.destinations` M:N.
- `scripts/backfill-destinations.ts` — **new** backfill.
- `src/lib/travel-resources.ts` — **new** `RESOURCE_CATEGORIES`.
- `src/lib/nav-data.ts` — **new** `getNavMenuData()`.
- `src/lib/destination-jsonld.ts` — **new** JSON-LD builders.

**Config / redirects**
- `next.config.ts` — add `redirects()`.
- `src/app/sitemap.ts` — add destinations, rename blog/flights/hotels entries.

**Navigation**
- `src/components/Header.jsx` — new nav structure, mega-menus, "Get a Free Quote" CTA, mobile collapsibles.
- `src/components/nav/MegaMenu.jsx` — **new**.
- `src/app/layout.tsx` — fetch `menuData`, pass to `Header`.
- `src/components/Footer.jsx` — add Transport contextual link; rename Blog→Travel Resources, Flights/Hotels.

**Destinations module**
- `src/app/destinations/page.jsx` + `DestinationsClient.jsx` — **new** listing.
- `src/app/destinations/[slug]/page.jsx` + `DestinationGuideClient.jsx` — **new** guide.
- `src/app/api/public/destinations/route.ts` + `[slug]/route.ts` — **new** public APIs (published/active gate).
- `src/app/api/destinations/route.ts` + `[id]/route.ts` — extend for rich fields.
- `src/app/admin/destinations/page.tsx` — **new** (or move from masters).
- `src/components/admin/DestinationsTable.tsx` — **new** rich CRUD.
- `src/components/admin/Sidebar.tsx` — sidebar changes.

**Renames (Blog→Travel Resources, Flights, Hotels)**
- `src/app/blog/**` → `src/app/travel-resources/**` (page, `[slug]`, client components), update imports/labels/breadcrumbs.
- `src/app/api/public/blog/**` → `src/app/api/public/travel-resources/**`.
- `src/app/air-ticketing/**` → `src/app/flights/**`; `src/app/hotel-booking/**` → `src/app/hotels/**`.
- `src/store/slices/filterSlice.js` — rename `blog` filter key → `resources` (or alias).
- `src/components/admin/BlogPostsTable.tsx` — labels + destinations multi-select + category dropdown.

**Internal linking**
- `src/components/related/RelatedTours.jsx`, `RelatedResources.jsx`, `RelatedVisa.jsx`, `RelatedDestination.jsx` — **new**.
- Wire into `src/app/destinations/[slug]`, `src/app/tours/[slug]/page.jsx`, `src/app/travel-resources/[slug]/page.jsx`.

**Tours**
- `src/app/tours/ToursClient.jsx` — read `?destination=` filter.
- `src/components/admin/ToursTable.tsx` — destination selector.

*(Residual "package" label sweep: audit-only; edit only mislabeled UI strings, keep correct product terminology.)*

---

## 13. Phased Implementation Order

1. **Phase A — Data model:** schema changes, `db push`, backfill script, shared libs (`travel-resources`, `nav-data` stub, `destination-jsonld`). *Verifiable: Prisma client compiles; backfill links tours.*
2. **Phase B — Navigation:** mega-menus, CTA, mobile, `layout` menuData. *Verifiable: all links resolve; responsive.*
3. **Phase D — Renames & redirects:** folder renames, `next.config.ts`, sitemap, filterSlice. *Verifiable: old URLs 301 to new; no 404s.*
4. **Phase C — Destinations module:** public pages + admin CRUD + public APIs. *Verifiable: create a destination in admin → renders publicly with SEO.*
5. **Phase E — Internal linking:** related components wired across page types.
6. **Phase F — Admin polish:** selectors, relabels, assignment UIs.

Each phase: run `docker compose exec app npm run lint` + manual smoke of affected routes before moving on.

---

## 14. Testing & QA

- **Redirects:** curl/browser every renamed URL → expect 301 to the new path (incl. `/blog/:slug`).
- **No broken links:** crawl nav + footer + related blocks; verify mega-menu links resolve.
- **Responsiveness:** desktop mega-menus (lg+), tablet, mobile drawer collapsibles; CTA visible at every breakpoint.
- **SEO:** validate JSON-LD (Rich Results Test) for Destination/Tour/Resource; unique titles/canonicals; sitemap includes new URLs and excludes none it should.
- **Publish gating:** Travel Resources still honor `publishedBlogWhere()` (scheduled/draft hidden) — no regression from the recent scheduling fix.
- **Data integrity:** backfill idempotent; existing tours/visas/attestations unaffected; admin CRUD round-trips new fields.
- **Regressions:** existing `/tours/[slug]`, `/visas`, `/attestations`, `/umrah`, `/hajj` still load.

---

## 15. Risks & Open Items

- **[Confirm] Tours URL scheme:** Phase 1 keeps flat `/tours/[slug]` + `/destinations/[slug]` guides (recommended). Nested `/tours/[destination]/[slug]` is deferred to optional Phase 2 with full 301 map. *Confirm this is acceptable.*
- **Menu data cost:** mega-menu queries run per-request unless cached; use `unstable_cache` with sensible `revalidate` to protect DB at scale.
- **Region grouping:** `Destination.region` is optional; until populated, group by International/Domestic (country = India).
- **Route renames & ISR caches:** after folder renames, clear/rebuild; verify no stale `/blog` cache serves alongside `/travel-resources`.
- **Label sweep scope:** keep legitimate "package" terminology; only fix mislabeled UI.

---

## Appendix — Relationship Diagram

```
Country ──1:N── Destination ──1:N── Tour
                     │
                     └──M:N── BlogPost (Travel Resource)

Derived: Destination.country == "India" ? Domestic : International (Tours mega-menu)
Contextual (no FK): Destination/Tour ──→ Visa (by country/type), Attestation, Transport
```
