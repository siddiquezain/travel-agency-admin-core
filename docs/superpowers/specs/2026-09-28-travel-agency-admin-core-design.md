# Travel Agency Admin Core — Design Spec

**Date:** 2026-09-28  
**Author:** Mohammed Siddique Zain  
**Status:** Approved

---

## Overview

Extract the admin dashboard from `origin-travels` into a standalone, reusable template repository (`travel-agency-admin-core`) that can be cloned as the foundation for future travel agency projects.

**Distribution model:** Separate git repo used as a clone-to-start template. When starting a new project, clone the template and work in that repo independently.

**Scope:** Admin dashboard (full) + structural skeleton for the public-facing website (layout, shared components, stubs — no content pages).

**New modules:** None. The template ships with exactly what is already implemented in `origin-travels`. No features are added during extraction.

---

## Folder Structure

The codebase is reorganised into four explicit layers. `src/app/` remains as Next.js routing (thin files). Three new top-level directories under `src/` establish the layers:

```
src/
├── app/                            # Next.js routing only — thin files, no logic
│   ├── admin/
│   │   ├── layout.tsx
│   │   ├── page.tsx                # Dashboard
│   │   ├── tours/page.tsx
│   │   ├── visas/page.tsx
│   │   ├── attestations/page.tsx
│   │   ├── blog/page.tsx
│   │   ├── destinations/page.tsx
│   │   ├── inquiries/page.tsx
│   │   ├── users/page.tsx
│   │   ├── settings/page.tsx
│   │   └── masters/
│   ├── api/                        # Thin re-exports from modules/
│   │   ├── auth/[...nextauth]/
│   │   ├── tours/route.ts
│   │   ├── tours/[id]/route.ts
│   │   └── ... (all existing routes)
│   ├── login/
│   └── layout.tsx
│
├── core/                           # Infrastructure — never modified per project
│   ├── admin/
│   │   ├── AdminLayout.tsx         # Two-column shell (sidebar + content area)
│   │   ├── Sidebar.tsx             # Nav driven by config/nav.ts
│   │   └── AdminHeader.tsx
│   ├── auth/
│   │   ├── auth.ts                 # NextAuth v4 credentials config, JWT 8h
│   │   ├── login-rate-limit.ts     # In-memory brute-force defence (5 attempts/15min)
│   │   └── proxy.ts                # Middleware (re-exported at src/middleware.ts)
│   ├── dashboard/
│   │   ├── DashboardKpis.tsx       # KPI cards (1d/7d/30d inquiries)
│   │   ├── DashboardInquiries.tsx  # Recent inquiries mini-table
│   │   └── InquiryStatusDonut.tsx  # Recharts donut chart
│   ├── ui/                         # Generic reusable admin UI components
│   │   ├── ConfirmDialog.tsx
│   │   ├── ImageUploader.tsx
│   │   └── RichTextEditor.tsx      # Tiptap WYSIWYG
│   └── lib/
│       ├── prisma.ts               # Prisma client singleton (PrismaPg adapter)
│       ├── mailer.ts               # Nodemailer, SMTP from env + DB settings
│       ├── site-settings.ts        # SiteSetting CRUD + 30s cache
│       └── email-templates.ts      # Admin alert + customer ack HTML/text renderers
│
├── modules/                        # Feature modules — each independently removable
│   ├── tours/
│   │   ├── ToursTable.tsx
│   │   ├── handlers.ts             # API route logic (GET/POST/PUT/DELETE)
│   │   └── tour-utils.ts
│   ├── visas/
│   │   ├── VisasTable.tsx
│   │   └── handlers.ts
│   ├── attestations/
│   │   ├── AttestationsTable.tsx
│   │   └── handlers.ts
│   ├── blog/
│   │   ├── BlogPostsTable.tsx
│   │   ├── handlers.ts
│   │   └── blog.ts                 # Listing/filtering helpers
│   ├── destinations/
│   │   ├── DestinationsTable.tsx
│   │   ├── handlers.ts
│   │   └── destination-fields.ts
│   ├── inquiries/
│   │   ├── InquiriesTable.tsx
│   │   └── handlers.ts
│   └── masters/
│       ├── components/
│       │   ├── CountriesTable.tsx
│       │   ├── CurrenciesTable.tsx
│       │   ├── VisaTypesTable.tsx
│       │   ├── AttestationTypesTable.tsx
│       │   ├── TourCategoriesTable.tsx
│       │   ├── DocumentTypesTable.tsx
│       │   └── ServiceTypesTable.tsx
│       └── handlers/
│           ├── countries.ts
│           ├── currencies.ts
│           ├── visa-types.ts
│           ├── attestation-types.ts
│           ├── tour-categories.ts
│           ├── document-types.ts
│           └── service-types.ts
│
├── config/                         # The ONLY layer changed per new agency project
│   ├── agency.ts                   # Name, logo, contact, primary colour, WhatsApp
│   ├── modules.ts                  # Boolean flags to enable/disable modules
│   └── nav.ts                      # Sidebar nav — derived from enabled modules
│
├── components/                     # Public-facing skeleton (stubs, not content)
│   ├── Header.tsx                  # Structure only, nav items = [] placeholder
│   ├── Footer.tsx                  # Structure only, links = [] placeholder
│   ├── Providers.tsx               # Redux + MUI theme providers
│   ├── LayoutShell.tsx             # Root layout wrapper
│   ├── EnquiryForm.tsx             # Generic lead capture form (reCAPTCHA protected)
│   ├── ErrorBoundary.jsx
│   ├── ScrollToTop.jsx
│   └── WhatsAppButton.tsx          # Reads from agency.whatsapp
│
├── store/                          # Unchanged — client-side filter state
│   ├── index.js
│   └── slices/filterSlice.js
│
├── context/
│   └── ColorModeContext.jsx        # MUI dark/light mode toggle — unchanged
│
├── hooks/                          # Public data-fetching hooks — unchanged
│   ├── useCountries.ts
│   ├── useDestinations.ts
│   └── useTourCategories.ts
│
└── theme.js                        # MUI theme — reads primaryColor from config/agency.ts
```

### Additional lib files

These `src/lib/` files don't move to `core/lib/` (too public-facing or module-specific):

| File | Destination |
|------|-------------|
| `recaptcha.ts` | stays at `src/lib/recaptcha.ts` (used by EnquiryForm) |
| `public-card.ts` | stays at `src/lib/public-card.ts` (public listing utility) |
| `public-detail.ts` | stays at `src/lib/public-detail.ts` |
| `related.ts` | stays at `src/lib/related.ts` |
| `blog-jsonld.ts` | moves to `src/modules/blog/blog-jsonld.ts` |
| `destination-jsonld.ts` | moves to `src/modules/destinations/destination-jsonld.ts` |
| `service-jsonld.ts` | stays at `src/lib/service-jsonld.ts` (generic) |
| `travel-resources.ts` | moves to `src/modules/blog/travel-resources.ts` |

---

## Config Layer

`src/config/` is the complete per-agency customisation surface. All three files ship with Origin Travels values as defaults and are the first thing a developer changes for a new project.

### `src/config/agency.ts`

```typescript
export const agency = {
  name: 'Origin Travels',
  tagline: 'Your Journey, Our Expertise',
  logo: '/logo.png',
  favicon: '/favicon.ico',
  primaryColor: '#10b981',
  supportEmail: 'info@origin-travels.com',
  supportPhone: '+971 50 123 4567',
  whatsapp: '+971501234567',
  address: 'Dubai, UAE',
  recaptchaSiteKey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? '',
}
```

Consumed by: `src/theme.js` (primaryColor — replaces current hardcoded `#10b981`), `WhatsAppButton` (whatsapp), admin header greeting (name), `RecaptchaProvider` (recaptchaSiteKey).

### `src/config/modules.ts`

```typescript
export const modules = {
  tours:         true,
  visas:         true,
  attestations:  true,
  blog:          true,
  destinations:  true,
  inquiries:     true,
  masters:       true,
} as const

export type ModuleKey = keyof typeof modules
```

Consumed by: `config/nav.ts` (sidebar visibility). Setting a module to `false` removes it from the nav. The corresponding `src/app/admin/` and `src/app/api/` routes are deleted manually when permanently dropping a module.

### `src/config/nav.ts`

```typescript
import { modules } from './modules'

export const adminNav = [
  { label: 'Dashboard',     href: '/admin',              icon: 'LayoutDashboard' },
  modules.tours        && { label: 'Tours',         href: '/admin/tours',         icon: 'Map' },
  modules.visas        && { label: 'Visas',         href: '/admin/visas',         icon: 'FileText' },
  modules.attestations && { label: 'Attestations',  href: '/admin/attestations',  icon: 'Stamp' },
  modules.blog         && { label: 'Blog',          href: '/admin/blog',          icon: 'BookOpen' },
  modules.destinations && { label: 'Destinations',  href: '/admin/destinations',  icon: 'Globe' },
  modules.inquiries    && { label: 'Inquiries',     href: '/admin/inquiries',     icon: 'Inbox' },
  modules.masters      && { label: 'Masters',       href: '/admin/masters',       icon: 'Database', submenu: true },
  { label: 'Users',         href: '/admin/users',         icon: 'Users' },
  { label: 'Settings',      href: '/admin/settings',      icon: 'Settings' },
].filter(Boolean)
```

---

## Module Anatomy

Every module follows the same pattern. The `app/api/` route files become thin re-exports:

```typescript
// src/app/api/tours/route.ts
import { GET, POST } from '@/modules/tours/handlers'
export { GET, POST }

// src/app/api/tours/[id]/route.ts
import { GET, PUT, DELETE } from '@/modules/tours/handlers'
export { GET, PUT, DELETE }
```

The `app/admin/` page files are unchanged from today (already thin server components).

### Dropping a module

1. Set `modules.attestations = false` in `config/modules.ts`
2. Delete `src/modules/attestations/`
3. Delete `src/app/admin/attestations/` and `src/app/api/attestations/`
4. Remove the Prisma model from `schema.prisma` and run `db push`

No other files need touching.

---

## What Is Stripped from the Template

### Public pages deleted entirely
- `src/app/umrah/`
- `src/app/umrah-packages-from-*/` (6 city variants)
- `src/app/hajj/`
- `src/app/flights/`
- `src/app/hotels/`
- `src/app/transport/`
- `src/app/about/`
- `src/app/terms/`, `privacy/`, `refund/`
- `src/app/thank-you/` (replaced by generic stub)

### Public components removed
- `Globe.jsx` — heavy Three.js dep, Origin Travels-specific visual
- `RelatedServices.jsx` — hardcoded OT service structure
- `ThankYouTemplate.jsx` — replaced by generic stub

### Public components kept as stubs
- `Header.tsx` — component shape kept, nav items = `[]`
- `Footer.tsx` — layout kept, links = `[]`
- `src/lib/nav-data.ts` → `export const navLinks = []`
- `src/lib/footer-links.ts` → `export const footerLinks = []`

### Design system
- Country flag gradients (50+ entries) removed — Origin Travels-specific visual language
- Core tokens kept: radius, shadows, spacing, section colours, `highlightCardSx`, `iconContainerSx`

### Prisma schema
- All 13 models kept (full schema ships with template)
- `SiteSetting` default values cleared (no OT contact info)

### Environment
- `.env.example` stripped of OT-specific values
- `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` added

### What is unchanged
- All 22 admin components
- All API route handlers
- Auth system (NextAuth, rate limiting, middleware)
- Dashboard
- MUI theme structure (primaryColor now from `agency.ts`)
- Redux store + filterSlice
- All `core/lib/` utilities
- Prisma schema (all models)

---

## Migration Steps

Performed on the new `travel-agency-admin-core` repo (copy of current codebase). Each step is an independent commit.

1. **Bootstrap** — copy codebase to new repo, initial commit
2. **Create directories** — `src/core/`, `src/modules/`, `src/config/`
3. **Move core infrastructure** — layout, auth, dashboard components, lib files to `src/core/`
4. **Move modules** — one module at a time, update imports after each
5. **Create config layer** — write `agency.ts`, `modules.ts`, `nav.ts`; wire Sidebar, theme, WhatsAppButton to read from config
6. **Strip OT-specific content** — delete pages, stub Header/Footer, remove country gradients, clean `.env.example`
7. **Update all import paths** — fix `@/components/admin/*` → `@/modules/*/` and `@/lib/*` → `@/core/lib/*`
8. **Verify** — `npm run build` with `ignoreBuildErrors: false`, smoke-test admin login + one CRUD + settings
9. **README** — document "start a new project" workflow, commit

---

## New Project Workflow (post-template)

```bash
git clone git@github.com:your-org/travel-agency-admin-core.git new-agency
cd new-agency
cp .env.example .env          # fill in DB_URL, NEXTAUTH_SECRET, SMTP
# Edit src/config/agency.ts   → name, logo, colors, contacts
# Edit src/config/modules.ts  → disable any modules not needed
docker compose up --build
docker compose exec app npx prisma db push
```

That's the complete setup for a new agency project.

---

## Risks & Notes

- **Import path churn** — moving ~40 files means updating many imports. TypeScript build errors will catch anything missed. Low risk, high noise.
- **Next.js routing constraint** — `proxy.ts` (middleware) must remain at `src/middleware.ts` for Next.js to pick it up. It will re-export from `src/core/auth/proxy.ts`.
- **Rate limiter is in-memory** — already noted in the existing code. Works for single-instance deploys. If a future project needs multi-instance, swap to Redis. No change needed now.
- **`ignoreBuildErrors: true`** in `next.config.ts` — leave it in place during migration, disable only for the final verification step, then restore. The mixed JS/TS codebase has pre-existing type issues unrelated to this work.
- **No new dependencies added** — this is a reorganisation, not a rewrite.
