# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Setup

All development runs through Docker. See [DOCKER.md](DOCKER.md) for full setup.

```bash
docker compose up --build     # first time
docker compose up -d          # subsequent starts
docker compose logs -f app    # stream logs
```

For host-only commands (no Docker required):
```bash
npm run lint
npx prisma studio             # DB GUI (uses localhost:5432)
```

### Database (Prisma 7)
```bash
docker compose exec app npx prisma generate   # after schema changes
docker compose exec app npx prisma db push    # sync schema to DB (use db push, NOT migrate dev)
```

> Prisma 7 uses the `prisma-client` generator and requires a `PrismaPg` adapter. The client entry point is `src/generated/prisma/client.ts` (no index.ts). Always use `db push` in development — there are no migration files.

## Architecture Overview

### Next.js 16 App Router

Root layout at `src/app/layout.tsx` wraps all pages in `<AppRouterCacheProvider>` (MUI SSR) → `<Providers>` (Redux + MUI theme) → `<Header>` + `<Footer>`.

**Public routes:** `/`, `/tours`, `/tours/[slug]`, `/visas`, `/visas/[slug]`, `/attestations`, `/attestations/[slug]`, `/umrah`, `/about`, `/contact`

**Admin routes (`/admin/*`):** Tours, visas, attestations, inquiries, users — all backed by Prisma CRUD.

**Route protection:** `src/proxy.ts` (Next.js 16 — replaces the old `middleware.ts` convention). Redirects unauthenticated requests to `/login` for `/admin/*` and protected API routes.

### Data Fetching

Single data source: **PostgreSQL via Prisma** (`src/lib/prisma.ts`).

- **Public listing pages** (`/tours`, `/visas`, `/attestations`) — `"use client"` components that `fetch('/api/public/{tours|visas|attestations}')` on mount. These routes return Prisma data normalized to the shape `ServiceCard` expects.
- **Admin pages** — thin server components that call `prisma.*` directly and pass `initialData` to `"use client"` table components (`src/components/admin/`).
- **Contact form** — POSTs to `/api/inquiries`, saved to the `Inquiry` table.
- **Auth** — NextAuth v5 at `/api/auth/[...nextauth]`, Credentials provider + bcryptjs, config at `src/lib/auth.ts`.

> Apollo Client, GraphQL hooks, and WordPress API wrappers have been removed. There are no external API dependencies.

### Admin CRUD Pattern

Server page fetches data → passes as `initialData` to a `"use client"` table component → table manages modal state → mutations call REST API routes → `router.refresh()` revalidates server data.

```
src/app/admin/tours/page.tsx  →  src/components/admin/ToursTable.tsx
src/app/admin/visas/page.tsx  →  src/components/admin/VisasTable.tsx
src/app/admin/attestations/   →  AttestationsTable.tsx
src/app/admin/inquiries/      →  InquiriesTable.tsx (view/status only, no create)
src/app/admin/users/          →  UsersTable.tsx (password hashed server-side)
```

### State Management

**Redux Toolkit** (`src/store/slices/filterSlice.js`) — filter state for tours, visas, attestations (search, price range, category, etc.).

**React Context** (`src/context/ColorModeContext.jsx`) — MUI light/dark theme toggle.

### Design System

Tokens (spacing, shadows, border radius, color palettes, gradients) centralized in `src/config/designSystem.js`. MUI v7 is the primary component library; Tailwind CSS v4 and Framer Motion are also used.

### TypeScript Status

Mixed JS/TS. Infrastructure, API routes, and admin use `.ts`/`.tsx`; public pages and shared components are `.jsx`. Build errors suppressed in `next.config.ts` (`ignoreBuildErrors: true`).

## Environment Variables

Required in `.env` (copy from `.env.example`):
```
DATABASE_URL=     # postgresql://postgres:root@db:5432/origin_travels?schema=public
NEXTAUTH_SECRET=  # any random string
NEXTAUTH_URL=     # http://localhost:3000
```

`DATABASE_URL` is overridden by `docker-compose.yml` to use the `db` hostname — the value in `.env` only matters when running Prisma Studio from the host.

## graphify

This project has a graphify knowledge graph at graphify-out/.

Rules:
- Before answering architecture or codebase questions, read graphify-out/GRAPH_REPORT.md for god nodes and community structure
- If graphify-out/wiki/index.md exists, navigate it instead of reading raw files
- After modifying code files in this session, run `python3 -c "from graphify.watch import _rebuild_code; from pathlib import Path; _rebuild_code(Path('.'))"` to keep the graph current
