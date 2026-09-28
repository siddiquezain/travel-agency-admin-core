# Graph Report - .  (2026-05-14)

## Corpus Check
- 94 files · ~456,934 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 266 nodes · 223 edges · 71 communities detected
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 5 edges (avg confidence: 0.77)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_API Routes (REST handlers)|API Routes (REST handlers)]]
- [[_COMMUNITY_Tours Admin Table|Tours Admin Table]]
- [[_COMMUNITY_App Architecture & Layout|App Architecture & Layout]]
- [[_COMMUNITY_Data Layer & Auth|Data Layer & Auth]]
- [[_COMMUNITY_Visas Admin Table|Visas Admin Table]]
- [[_COMMUNITY_Countries Admin Table|Countries Admin Table]]
- [[_COMMUNITY_Attestations Admin Table|Attestations Admin Table]]
- [[_COMMUNITY_Users Admin Table|Users Admin Table]]
- [[_COMMUNITY_Error Boundary|Error Boundary]]
- [[_COMMUNITY_Inquiries Admin Table|Inquiries Admin Table]]
- [[_COMMUNITY_About & Contact Pages|About & Contact Pages]]
- [[_COMMUNITY_Design System Helpers|Design System Helpers]]
- [[_COMMUNITY_Auth & Slug Utils|Auth & Slug Utils]]
- [[_COMMUNITY_Globe Component|Globe Component]]
- [[_COMMUNITY_Image Uploader|Image Uploader]]
- [[_COMMUNITY_How It Works Section|How It Works Section]]
- [[_COMMUNITY_Testimonials|Testimonials]]
- [[_COMMUNITY_Color Mode Context|Color Mode Context]]
- [[_COMMUNITY_Database Seed|Database Seed]]
- [[_COMMUNITY_Route ProxyMiddleware|Route Proxy/Middleware]]
- [[_COMMUNITY_MUI Theme|MUI Theme]]
- [[_COMMUNITY_useCountries Hook|useCountries Hook]]
- [[_COMMUNITY_LayoutShell Wrapper|LayoutShell Wrapper]]
- [[_COMMUNITY_SearchBar|SearchBar]]
- [[_COMMUNITY_Mobile Sticky CTA|Mobile Sticky CTA]]
- [[_COMMUNITY_ServiceCard|ServiceCard]]
- [[_COMMUNITY_Tawk Messenger|Tawk Messenger]]
- [[_COMMUNITY_Enquiry Form|Enquiry Form]]
- [[_COMMUNITY_Providers (Redux + Theme)|Providers (Redux + Theme)]]
- [[_COMMUNITY_SEO Component|SEO Component]]
- [[_COMMUNITY_Footer|Footer]]
- [[_COMMUNITY_Header|Header]]
- [[_COMMUNITY_Scroll To Top|Scroll To Top]]
- [[_COMMUNITY_Dashboard Inquiries Export|Dashboard Inquiries Export]]
- [[_COMMUNITY_Admin Sidebar|Admin Sidebar]]
- [[_COMMUNITY_Skeleton Detail Loader|Skeleton Detail Loader]]
- [[_COMMUNITY_Skeleton Card Loader|Skeleton Card Loader]]
- [[_COMMUNITY_Services Flow Diagram|Services Flow Diagram]]
- [[_COMMUNITY_Trusted Partners|Trusted Partners]]
- [[_COMMUNITY_Why Choose Us|Why Choose Us]]
- [[_COMMUNITY_HeroSlider()|HeroSlider()]]
- [[_COMMUNITY_FeaturedSection()|FeaturedSection()]]
- [[_COMMUNITY_FAQSection()|FAQSection()]]
- [[_COMMUNITY_NewsletterCTA()|NewsletterCTA()]]
- [[_COMMUNITY_RootLayout()|RootLayout()]]
- [[_COMMUNITY_Home()|Home()]]
- [[_COMMUNITY_UsersPage()|UsersPage()]]
- [[_COMMUNITY_SettingsPage()|SettingsPage()]]
- [[_COMMUNITY_ToursPage()|ToursPage()]]
- [[_COMMUNITY_InquiriesPage()|InquiriesPage()]]
- [[_COMMUNITY_CountriesPage()|CountriesPage()]]
- [[_COMMUNITY_AttestationsPage()|AttestationsPage()]]
- [[_COMMUNITY_VisasPage()|VisasPage()]]
- [[_COMMUNITY_Tours()|Tours()]]
- [[_COMMUNITY_TourDetail()|TourDetail()]]
- [[_COMMUNITY_Umrah()|Umrah()]]
- [[_COMMUNITY_NotFound()|NotFound()]]
- [[_COMMUNITY_Attestations()|Attestations()]]
- [[_COMMUNITY_AttestationDetail()|AttestationDetail()]]
- [[_COMMUNITY_Visas()|Visas()]]
- [[_COMMUNITY_VisaDetail()|VisaDetail()]]
- [[_COMMUNITY_handleSubmit()|handleSubmit()]]
- [[_COMMUNITY_createPrismaClient()|createPrismaClient()]]
- [[_COMMUNITY_next.config.ts|next.config.ts]]
- [[_COMMUNITY_prisma.config.ts|prisma.config.ts]]
- [[_COMMUNITY_index.js|index.js]]
- [[_COMMUNITY_layout.tsx|layout.tsx]]
- [[_COMMUNITY_page.tsx|page.tsx]]
- [[_COMMUNITY_route.ts|route.ts]]
- [[_COMMUNITY_index.js|index.js]]
- [[_COMMUNITY_filterSlice.js|filterSlice.js]]

## God Nodes (most connected - your core abstractions)
1. `GET()` - 21 edges
2. `CLAUDE.md Project Guidance` - 11 edges
3. `Docker Setup` - 9 edges
4. `POST()` - 7 edges
5. `Data Fetching (single PostgreSQL source)` - 7 edges
6. `PUT()` - 6 edges
7. `DELETE()` - 6 edges
8. `Next.js 16 App Router` - 6 edges
9. `ErrorBoundary` - 5 edges
10. `README: Next.js Project bootstrapped via create-next-app` - 5 edges

## Surprising Connections (you probably didn't know these)
- `Dev Server Commands (npm/yarn/pnpm/bun dev)` --semantically_similar_to--> `Development Setup (Docker)`  [INFERRED] [semantically similar]
  README.md → CLAUDE.md
- `README: Next.js Project bootstrapped via create-next-app` --semantically_similar_to--> `Next.js 16 App Router`  [INFERRED] [semantically similar]
  README.md → CLAUDE.md
- `Development Setup (Docker)` --references--> `Docker Setup`  [EXTRACTED]
  CLAUDE.md → DOCKER.md
- `PostgreSQL Service (port 5432)` --conceptually_related_to--> `src/lib/prisma.ts`  [INFERRED]
  DOCKER.md → CLAUDE.md
- `Default Admin User Seed` --conceptually_related_to--> `NextAuth v5 (Credentials + bcryptjs)`  [INFERRED]
  DOCKER.md → CLAUDE.md

## Hyperedges (group relationships)
- **Docker Compose Stack (app + db + volumes)** — docker_nextjs_app_service, docker_postgres_service, docker_postgres_data_volume, docker_anonymous_volume_node_modules [EXTRACTED 0.90]
- **Root Layout Provider Chain (MUI SSR + Redux + Theme + Header/Footer)** — claudemd_root_layout, claudemd_app_router_cache_provider, claudemd_providers_wrapper, claudemd_redux_toolkit, claudemd_color_mode_context [EXTRACTED 0.85]
- **Admin CRUD Flow (server fetch -> initialData -> table -> REST -> refresh)** — claudemd_admin_pages_server_component, claudemd_admin_crud_pattern, claudemd_admin_routes, claudemd_prisma_client_lib [EXTRACTED 0.90]

## Communities

### Community 0 - "API Routes (REST handlers)"
Cohesion: 0.12
Nodes (4): DELETE(), GET(), POST(), PUT()

### Community 1 - "Tours Admin Table"
Cohesion: 0.08
Nodes (2): close(), save()

### Community 2 - "App Architecture & Layout"
Cohesion: 0.09
Nodes (23): Admin CRUD Pattern, Admin Routes (/admin/*), AppRouterCacheProvider (MUI SSR), ColorModeContext (MUI light/dark), Rationale: docker-compose overrides DATABASE_URL hostname to db, Design System (designSystem.js + MUI v7 + Tailwind v4 + Framer Motion), Development Setup (Docker), Required Environment Variables (+15 more)

### Community 3 - "Data Layer & Auth"
Cohesion: 0.09
Nodes (23): Admin Server Components calling prisma.*, Contact Form -> /api/inquiries -> Inquiry table, Data Fetching (single PostgreSQL source), NextAuth v5 (Credentials + bcryptjs), Rationale: removed Apollo/GraphQL/WordPress; no external API deps, Prisma 7 Database, Rationale: Prisma 7 prisma-client generator + PrismaPg adapter, no migrations, src/lib/prisma.ts (+15 more)

### Community 4 - "Visas Admin Table"
Cohesion: 0.25
Nodes (2): close(), save()

### Community 5 - "Countries Admin Table"
Cohesion: 0.29
Nodes (2): close(), save()

### Community 6 - "Attestations Admin Table"
Cohesion: 0.33
Nodes (2): close(), save()

### Community 7 - "Users Admin Table"
Cohesion: 0.33
Nodes (2): close(), save()

### Community 8 - "Error Boundary"
Cohesion: 0.33
Nodes (1): ErrorBoundary

### Community 9 - "Inquiries Admin Table"
Cohesion: 0.5
Nodes (2): close(), updateStatus()

### Community 10 - "About & Contact Pages"
Cohesion: 0.4
Nodes (1): AnimatedCount()

### Community 11 - "Design System Helpers"
Cohesion: 0.4
Nodes (0): 

### Community 12 - "Auth & Slug Utils"
Cohesion: 0.67
Nodes (2): makeSlug(), toSlug()

### Community 13 - "Globe Component"
Cohesion: 0.67
Nodes (0): 

### Community 14 - "Image Uploader"
Cohesion: 0.67
Nodes (0): 

### Community 15 - "How It Works Section"
Cohesion: 0.67
Nodes (0): 

### Community 16 - "Testimonials"
Cohesion: 0.67
Nodes (0): 

### Community 17 - "Color Mode Context"
Cohesion: 0.67
Nodes (0): 

### Community 18 - "Database Seed"
Cohesion: 1.0
Nodes (0): 

### Community 19 - "Route Proxy/Middleware"
Cohesion: 1.0
Nodes (0): 

### Community 20 - "MUI Theme"
Cohesion: 1.0
Nodes (0): 

### Community 21 - "useCountries Hook"
Cohesion: 1.0
Nodes (0): 

### Community 22 - "LayoutShell Wrapper"
Cohesion: 1.0
Nodes (0): 

### Community 23 - "SearchBar"
Cohesion: 1.0
Nodes (0): 

### Community 24 - "Mobile Sticky CTA"
Cohesion: 1.0
Nodes (0): 

### Community 25 - "ServiceCard"
Cohesion: 1.0
Nodes (0): 

### Community 26 - "Tawk Messenger"
Cohesion: 1.0
Nodes (0): 

### Community 27 - "Enquiry Form"
Cohesion: 1.0
Nodes (0): 

### Community 28 - "Providers (Redux + Theme)"
Cohesion: 1.0
Nodes (0): 

### Community 29 - "SEO Component"
Cohesion: 1.0
Nodes (0): 

### Community 30 - "Footer"
Cohesion: 1.0
Nodes (0): 

### Community 31 - "Header"
Cohesion: 1.0
Nodes (0): 

### Community 32 - "Scroll To Top"
Cohesion: 1.0
Nodes (0): 

### Community 33 - "Dashboard Inquiries Export"
Cohesion: 1.0
Nodes (0): 

### Community 34 - "Admin Sidebar"
Cohesion: 1.0
Nodes (0): 

### Community 35 - "Skeleton Detail Loader"
Cohesion: 1.0
Nodes (0): 

### Community 36 - "Skeleton Card Loader"
Cohesion: 1.0
Nodes (0): 

### Community 37 - "Services Flow Diagram"
Cohesion: 1.0
Nodes (0): 

### Community 38 - "Trusted Partners"
Cohesion: 1.0
Nodes (0): 

### Community 39 - "Why Choose Us"
Cohesion: 1.0
Nodes (0): 

### Community 40 - "HeroSlider()"
Cohesion: 1.0
Nodes (0): 

### Community 41 - "FeaturedSection()"
Cohesion: 1.0
Nodes (0): 

### Community 42 - "FAQSection()"
Cohesion: 1.0
Nodes (0): 

### Community 43 - "NewsletterCTA()"
Cohesion: 1.0
Nodes (0): 

### Community 44 - "RootLayout()"
Cohesion: 1.0
Nodes (0): 

### Community 45 - "Home()"
Cohesion: 1.0
Nodes (0): 

### Community 46 - "UsersPage()"
Cohesion: 1.0
Nodes (0): 

### Community 47 - "SettingsPage()"
Cohesion: 1.0
Nodes (0): 

### Community 48 - "ToursPage()"
Cohesion: 1.0
Nodes (0): 

### Community 49 - "InquiriesPage()"
Cohesion: 1.0
Nodes (0): 

### Community 50 - "CountriesPage()"
Cohesion: 1.0
Nodes (0): 

### Community 51 - "AttestationsPage()"
Cohesion: 1.0
Nodes (0): 

### Community 52 - "VisasPage()"
Cohesion: 1.0
Nodes (0): 

### Community 53 - "Tours()"
Cohesion: 1.0
Nodes (0): 

### Community 54 - "TourDetail()"
Cohesion: 1.0
Nodes (0): 

### Community 55 - "Umrah()"
Cohesion: 1.0
Nodes (0): 

### Community 56 - "NotFound()"
Cohesion: 1.0
Nodes (0): 

### Community 57 - "Attestations()"
Cohesion: 1.0
Nodes (0): 

### Community 58 - "AttestationDetail()"
Cohesion: 1.0
Nodes (0): 

### Community 59 - "Visas()"
Cohesion: 1.0
Nodes (0): 

### Community 60 - "VisaDetail()"
Cohesion: 1.0
Nodes (0): 

### Community 61 - "handleSubmit()"
Cohesion: 1.0
Nodes (0): 

### Community 62 - "createPrismaClient()"
Cohesion: 1.0
Nodes (0): 

### Community 63 - "next.config.ts"
Cohesion: 1.0
Nodes (0): 

### Community 64 - "prisma.config.ts"
Cohesion: 1.0
Nodes (0): 

### Community 65 - "index.js"
Cohesion: 1.0
Nodes (0): 

### Community 66 - "layout.tsx"
Cohesion: 1.0
Nodes (0): 

### Community 67 - "page.tsx"
Cohesion: 1.0
Nodes (0): 

### Community 68 - "route.ts"
Cohesion: 1.0
Nodes (0): 

### Community 69 - "index.js"
Cohesion: 1.0
Nodes (0): 

### Community 70 - "filterSlice.js"
Cohesion: 1.0
Nodes (0): 

## Knowledge Gaps
- **25 isolated node(s):** `Next.js App Service (port 3000)`, `Docker Desktop Prerequisite`, `.env.example template`, `Prisma Studio (host)`, `Dev DB Credentials` (+20 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Database Seed`** (2 nodes): `seed.ts`, `main()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Route Proxy/Middleware`** (2 nodes): `proxy()`, `proxy.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `MUI Theme`** (2 nodes): `theme.js`, `getDesignTokens()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `useCountries Hook`** (2 nodes): `useCountries.ts`, `useCountries()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `LayoutShell Wrapper`** (2 nodes): `LayoutShell()`, `LayoutShell.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `SearchBar`** (2 nodes): `SearchBar()`, `SearchBar.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Mobile Sticky CTA`** (2 nodes): `MobileStickyCTA()`, `MobileStickyCTA.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `ServiceCard`** (2 nodes): `ServiceCard()`, `ServiceCard.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Tawk Messenger`** (2 nodes): `TawkMessenger.jsx`, `TawkMessenger()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Enquiry Form`** (2 nodes): `EnquiryForm()`, `EnquiryForm.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Providers (Redux + Theme)`** (2 nodes): `Providers()`, `Providers.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `SEO Component`** (2 nodes): `SEO()`, `SEO.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Footer`** (2 nodes): `Footer()`, `Footer.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Header`** (2 nodes): `Header()`, `Header.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Scroll To Top`** (2 nodes): `ScrollToTop()`, `ScrollToTop.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Dashboard Inquiries Export`** (2 nodes): `exportCSV()`, `DashboardInquiries.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Admin Sidebar`** (2 nodes): `Sidebar()`, `Sidebar.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Skeleton Detail Loader`** (2 nodes): `SkeletonDetail()`, `SkeletonDetail.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Skeleton Card Loader`** (2 nodes): `SkeletonCard()`, `SkeletonCard.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Services Flow Diagram`** (2 nodes): `ServicesFlow()`, `ServicesFlow.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Trusted Partners`** (2 nodes): `TrustedPartners.jsx`, `TrustedPartners()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Why Choose Us`** (2 nodes): `WhyChooseUs.jsx`, `WhyChooseUs()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `HeroSlider()`** (2 nodes): `HeroSlider()`, `HeroSlider.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `FeaturedSection()`** (2 nodes): `FeaturedSection()`, `FeaturedSection.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `FAQSection()`** (2 nodes): `FAQSection()`, `FAQSection.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `NewsletterCTA()`** (2 nodes): `NewsletterCTA()`, `NewsletterCTA.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `RootLayout()`** (2 nodes): `RootLayout()`, `layout.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Home()`** (2 nodes): `Home()`, `page.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `UsersPage()`** (2 nodes): `UsersPage()`, `page.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `SettingsPage()`** (2 nodes): `SettingsPage()`, `page.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `ToursPage()`** (2 nodes): `ToursPage()`, `page.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `InquiriesPage()`** (2 nodes): `InquiriesPage()`, `page.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `CountriesPage()`** (2 nodes): `CountriesPage()`, `page.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `AttestationsPage()`** (2 nodes): `AttestationsPage()`, `page.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `VisasPage()`** (2 nodes): `VisasPage()`, `page.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Tours()`** (2 nodes): `Tours()`, `page.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `TourDetail()`** (2 nodes): `TourDetail()`, `page.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Umrah()`** (2 nodes): `Umrah()`, `page.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `NotFound()`** (2 nodes): `NotFound()`, `page.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Attestations()`** (2 nodes): `Attestations()`, `page.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `AttestationDetail()`** (2 nodes): `AttestationDetail()`, `page.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Visas()`** (2 nodes): `Visas()`, `page.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `VisaDetail()`** (2 nodes): `VisaDetail()`, `page.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `handleSubmit()`** (2 nodes): `handleSubmit()`, `page.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `createPrismaClient()`** (2 nodes): `createPrismaClient()`, `prisma.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `next.config.ts`** (1 nodes): `next.config.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `prisma.config.ts`** (1 nodes): `prisma.config.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `index.js`** (1 nodes): `index.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `layout.tsx`** (1 nodes): `layout.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `page.tsx`** (1 nodes): `page.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `route.ts`** (1 nodes): `route.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `index.js`** (1 nodes): `index.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `filterSlice.js`** (1 nodes): `filterSlice.js`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `CLAUDE.md Project Guidance` connect `App Architecture & Layout` to `Data Layer & Auth`?**
  _High betweenness centrality (0.018) - this node is a cross-community bridge._
- **Why does `Docker Setup` connect `Data Layer & Auth` to `App Architecture & Layout`?**
  _High betweenness centrality (0.010) - this node is a cross-community bridge._
- **What connects `Next.js App Service (port 3000)`, `Docker Desktop Prerequisite`, `.env.example template` to the rest of the system?**
  _25 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `API Routes (REST handlers)` be split into smaller, more focused modules?**
  _Cohesion score 0.12 - nodes in this community are weakly interconnected._
- **Should `Tours Admin Table` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._
- **Should `App Architecture & Layout` be split into smaller, more focused modules?**
  _Cohesion score 0.09 - nodes in this community are weakly interconnected._
- **Should `Data Layer & Auth` be split into smaller, more focused modules?**
  _Cohesion score 0.09 - nodes in this community are weakly interconnected._