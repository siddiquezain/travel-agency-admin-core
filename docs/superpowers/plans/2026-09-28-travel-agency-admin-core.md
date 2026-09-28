# Travel Agency Admin Core — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reorganise the `origin-travels` codebase into a clean, layered template repo (`travel-agency-admin-core`) that can be cloned as the foundation for future travel-agency projects.

**Architecture:** Four explicit source layers — `core/` (infrastructure), `modules/` (feature modules), `config/` (per-agency customisation), and `components/` (public skeleton). The `app/` directory stays as thin Next.js routing only. All project-specific public pages and Origin Travels branding are stripped.

**Tech Stack:** Next.js 16, TypeScript, Prisma 7 + PostgreSQL, NextAuth v4, MUI v7, Tailwind v4, Redux Toolkit, Framer Motion, Tiptap, Recharts, Docker Compose.

---

## File Map

### New files created
| New path | Source / note |
|----------|--------------|
| `src/config/agency.ts` | New — per-agency identity |
| `src/config/modules.ts` | New — module toggles |
| `src/config/nav.ts` | New — sidebar nav built from modules |
| `src/core/auth/nextauth.ts` | Extracted `authOptions` from `app/api/auth/[...nextauth]/route.ts` |
| `src/core/auth/helpers.ts` | Moved from `src/lib/auth.ts` |
| `src/core/auth/login-rate-limit.ts` | Moved from `src/lib/login-rate-limit.ts` |
| `src/core/admin/AdminLayout.tsx` | Extracted from `src/app/admin/layout.tsx` |
| `src/core/admin/Sidebar.tsx` | Moved from `src/components/admin/Sidebar.tsx` |
| `src/core/dashboard/DashboardKpis.tsx` | Moved from `src/components/admin/DashboardKpis.tsx` |
| `src/core/dashboard/DashboardInquiries.tsx` | Moved from `src/components/admin/DashboardInquiries.tsx` |
| `src/core/dashboard/InquiryStatusDonut.tsx` | Moved from `src/components/admin/InquiryStatusDonut.tsx` |
| `src/core/ui/ConfirmDialog.tsx` | Moved from `src/components/admin/ConfirmDialog.tsx` |
| `src/core/ui/ImageUploader.tsx` | Moved from `src/components/admin/ImageUploader.tsx` |
| `src/core/ui/RichTextEditor.tsx` | Moved from `src/components/admin/RichTextEditor.tsx` |
| `src/core/lib/prisma.ts` | Moved from `src/lib/prisma.ts` |
| `src/core/lib/mailer.ts` | Moved from `src/lib/mailer.ts` |
| `src/core/lib/site-settings.ts` | Moved from `src/lib/site-settings.ts` |
| `src/core/lib/email-templates.ts` | Moved from `src/lib/email-templates.ts` |
| `src/modules/tours/ToursTable.tsx` | Moved from `src/components/admin/ToursTable.tsx` |
| `src/modules/tours/handlers.ts` | Merged from `app/api/tours/route.ts` + `app/api/tours/[id]/route.ts` |
| `src/modules/tours/tour-utils.ts` | Moved from `src/lib/tour-utils.ts` |
| `src/modules/visas/VisasTable.tsx` | Moved from `src/components/admin/VisasTable.tsx` |
| `src/modules/visas/handlers.ts` | Merged from `app/api/visas/route.ts` + `[id]/route.ts` |
| `src/modules/attestations/AttestationsTable.tsx` | Moved from `src/components/admin/AttestationsTable.tsx` |
| `src/modules/attestations/handlers.ts` | Merged from `app/api/attestations/route.ts` + `[id]/route.ts` |
| `src/modules/blog/BlogPostsTable.tsx` | Moved from `src/components/admin/BlogPostsTable.tsx` |
| `src/modules/blog/handlers.ts` | Merged from `app/api/blog/route.ts` + `[id]/route.ts` |
| `src/modules/blog/blog.ts` | Moved from `src/lib/blog.ts` |
| `src/modules/blog/blog-jsonld.ts` | Moved from `src/lib/blog-jsonld.ts` |
| `src/modules/blog/travel-resources.ts` | Moved from `src/lib/travel-resources.ts` |
| `src/modules/destinations/DestinationsTable.tsx` | Moved from `src/components/admin/DestinationsTable.tsx` |
| `src/modules/destinations/handlers.ts` | Merged from `app/api/destinations/route.ts` + `[id]/route.ts` |
| `src/modules/destinations/destination-fields.ts` | Moved from `src/lib/destination-fields.ts` |
| `src/modules/destinations/destination-jsonld.ts` | Moved from `src/lib/destination-jsonld.ts` |
| `src/modules/inquiries/InquiriesTable.tsx` | Moved from `src/components/admin/InquiriesTable.tsx` |
| `src/modules/inquiries/handlers.ts` | Merged from `app/api/inquiries/route.ts` + `[id]/route.ts` |
| `src/modules/masters/components/CountriesTable.tsx` | Moved from `src/components/admin/CountriesTable.tsx` |
| `src/modules/masters/components/CurrenciesTable.tsx` | Moved |
| `src/modules/masters/components/VisaTypesTable.tsx` | Moved |
| `src/modules/masters/components/AttestationTypesTable.tsx` | Moved |
| `src/modules/masters/components/TourCategoriesTable.tsx` | Moved |
| `src/modules/masters/components/DocumentTypesTable.tsx` | Moved |
| `src/modules/masters/components/ServiceTypesTable.tsx` | Moved |
| `src/modules/masters/handlers/countries.ts` | Extracted from `app/api/countries/` |
| `src/modules/masters/handlers/currencies.ts` | Extracted from `app/api/currencies/` |
| `src/modules/masters/handlers/visa-types.ts` | Extracted from `app/api/visa-types/` |
| `src/modules/masters/handlers/attestation-types.ts` | Extracted from `app/api/attestation-types/` |
| `src/modules/masters/handlers/tour-categories.ts` | Extracted from `app/api/tour-categories/` |
| `src/modules/masters/handlers/document-types.ts` | Extracted from `app/api/document-types/` |
| `src/modules/masters/handlers/service-types.ts` | Extracted from `app/api/service-types/` |

### Files modified
| File | Change |
|------|--------|
| `src/proxy.ts` | Update imports: `@/lib/prisma` → `@/core/lib/prisma`, `@/lib/auth` → `@/core/auth/helpers`, etc. |
| `src/app/api/auth/[...nextauth]/route.ts` | Import `authOptions` from `@/core/auth/nextauth` instead of defining it inline |
| `src/app/admin/layout.tsx` | Import `AdminLayout` from `@/core/admin/AdminLayout`, delegate all rendering to it |
| `src/app/admin/page.tsx` | Update imports to `@/core/dashboard/*` |
| `src/app/admin/tours/page.tsx` | Update import to `@/modules/tours/ToursTable` |
| `src/app/admin/visas/page.tsx` | Update import to `@/modules/visas/VisasTable` |
| `src/app/admin/attestations/page.tsx` | Update import to `@/modules/attestations/AttestationsTable` |
| `src/app/admin/blog/page.tsx` | Update import to `@/modules/blog/BlogPostsTable` |
| `src/app/admin/destinations/page.tsx` | Update import to `@/modules/destinations/DestinationsTable` |
| `src/app/admin/inquiries/page.tsx` | Update import to `@/modules/inquiries/InquiriesTable` |
| `src/app/admin/users/page.tsx` | Update import to `@/components/admin/UsersTable` (users stays in components/admin) |
| `src/app/admin/settings/page.tsx` | Update import to `@/components/admin/SettingsForm` |
| `src/app/admin/masters/*/page.tsx` | Update imports to `@/modules/masters/components/*` |
| `src/app/api/tours/route.ts` | Thin re-export from `@/modules/tours/handlers` |
| `src/app/api/tours/[id]/route.ts` | Thin re-export from `@/modules/tours/handlers` |
| (same pattern for all 14 module API routes) | |
| `src/theme.js` | Read `primaryColor` from `@/config/agency` |
| `src/components/WhatsAppButton.jsx` | Read number from `@/config/agency` |
| `src/lib/nav-data.ts` | Stub: `export const navLinks = []` |
| `src/lib/footer-links.ts` | Stub: `export const footerLinks = []` |
| `src/components/Header.tsx/jsx` | Stub nav items |
| `src/components/Footer.tsx/jsx` | Stub link lists |
| `src/config/designSystem.js` | Remove country flag gradients section |
| `prisma/schema.prisma` | Clear `SiteSetting` field defaults of OT contact info |
| `.env.example` | Strip OT values, add `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` |

### Files deleted
`src/app/umrah/`, `src/app/umrah-packages-from-bangalore/`, `src/app/umrah-packages-from-chennai/`, `src/app/umrah-packages-from-delhi/`, `src/app/umrah-packages-from-mumbai/`, `src/app/umrah-packages-from-pune/`, `src/app/umrah-packages-from-vijayawada/`, `src/app/hajj/`, `src/app/flights/`, `src/app/hotels/`, `src/app/transport/`, `src/app/about/`, `src/app/terms/`, `src/app/privacy/`, `src/app/refund/`, `src/app/thank-you/`, `src/components/Globe.jsx`, `src/components/RelatedServices.jsx`, `src/components/ThankYouTemplate.jsx`

---

## Task 1: Bootstrap the template repo

**Files:** New git repo at `../travel-agency-admin-core`

- [ ] **Step 1.1: Create the new repo**

```bash
cd ..
cp -r origin-travels travel-agency-admin-core
cd travel-agency-admin-core
rm -rf .git
git init
git add -A
git commit -m "chore: bootstrap travel-agency-admin-core from origin-travels"
```

- [ ] **Step 1.2: Verify the project still boots**

```bash
docker compose up -d
docker compose logs -f app
```
Expected: Next.js dev server starts, no errors. Stop with Ctrl+C.

---

## Task 2: Create the directory skeleton

**Files:** `src/core/`, `src/modules/`, dirs under each

- [ ] **Step 2.1: Create all new directories**

```bash
mkdir -p src/core/admin src/core/auth src/core/dashboard src/core/ui src/core/lib
mkdir -p src/modules/tours src/modules/visas src/modules/attestations
mkdir -p src/modules/blog src/modules/destinations src/modules/inquiries
mkdir -p src/modules/masters/components src/modules/masters/handlers
```

- [ ] **Step 2.2: Commit**

```bash
git add src/core src/modules
git commit -m "chore: add core/ and modules/ directory skeleton"
```

---

## Task 3: Write the config layer

**Files:**
- Create: `src/config/agency.ts`
- Create: `src/config/modules.ts`
- Create: `src/config/nav.ts`

- [ ] **Step 3.1: Write `src/config/agency.ts`**

```typescript
// src/config/agency.ts
// ─────────────────────────────────────────────────────────────────────────────
// Per-agency identity. This is the first file you edit when starting a new
// project. All values here flow into the theme, admin shell, and public shell.
// ─────────────────────────────────────────────────────────────────────────────

export const agency = {
  name: 'Origin Travels',
  tagline: 'Your Journey, Our Expertise',
  logo: '/logo.png',        // place your logo at public/logo.png
  favicon: '/favicon.ico',
  // MUI theme primary colour — used for buttons, links, accents on the public site.
  // The admin sidebar uses Tailwind emerald classes and is not affected by this.
  primaryColor: '#1A428A',
  primaryLight: '#2AB0E5',
  supportEmail: 'info@origin-travels.com',
  supportPhone: '+971 50 123 4567',
  whatsapp: '917095787635',   // digits only, no +, no spaces — used in wa.me URL
  address: 'Dubai, UAE',
  recaptchaSiteKey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? '',
} as const
```

- [ ] **Step 3.2: Write `src/config/modules.ts`**

```typescript
// src/config/modules.ts
// Set any module to false to hide it from the admin nav.
// Hiding does NOT delete the routes — also remove the corresponding
// src/app/admin/<module>/ and src/app/api/<module>/ directories manually.

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

- [ ] **Step 3.3: Write `src/config/nav.ts`**

```typescript
// src/config/nav.ts
// Sidebar nav items derived from enabled modules.
// Icons map to Lucide icon names — import them in Sidebar.tsx.

import { modules } from './modules'

type NavLeaf = { name: string; href: string; icon: string }
type NavGroup = { name: string; icon: string; children: NavLeaf[] }
export type NavItem = NavLeaf | NavGroup

const mastersChildren: NavLeaf[] = [
  { name: 'Countries',          href: '/admin/countries',                     icon: 'Globe' },
  { name: 'Visa Types',         href: '/admin/masters/visa-types',            icon: 'BadgeCheck' },
  { name: 'Attestation Types',  href: '/admin/masters/attestation-types',     icon: 'Stamp' },
  { name: 'Tour Categories',    href: '/admin/masters/tour-categories',        icon: 'FolderTree' },
  { name: 'Currencies',         href: '/admin/masters/currencies',            icon: 'DollarSign' },
  { name: 'Document Types',     href: '/admin/masters/document-types',        icon: 'FileText' },
  { name: 'Service Types',      href: '/admin/masters/service-types',         icon: 'Wrench' },
]

export const adminNav: NavItem[] = [
  { name: 'Dashboard',    href: '/admin',               icon: 'LayoutDashboard' },
  ...(modules.destinations ? [{ name: 'Destinations', href: '/admin/destinations', icon: 'MapPin' }] : []),
  ...(modules.tours        ? [{ name: 'Tours',         href: '/admin/tours',        icon: 'Map' }] : []),
  ...(modules.visas        ? [{ name: 'Visas',         href: '/admin/visas',        icon: 'PlaneTakeoff' }] : []),
  ...(modules.attestations ? [{ name: 'Attestations',  href: '/admin/attestations', icon: 'Stamp' }] : []),
  ...(modules.blog         ? [{ name: 'Blog',          href: '/admin/blog',         icon: 'Newspaper' }] : []),
  ...(modules.inquiries    ? [{ name: 'Inquiries',     href: '/admin/inquiries',    icon: 'FileText' }] : []),
  ...(modules.masters      ? [{ name: 'Masters', icon: 'Layers', children: mastersChildren } as NavGroup] : []),
  { name: 'Users',    href: '/admin/users',    icon: 'Users' },
  { name: 'Settings', href: '/admin/settings', icon: 'Settings' },
]
```

- [ ] **Step 3.4: Commit**

```bash
git add src/config/agency.ts src/config/modules.ts src/config/nav.ts
git commit -m "feat: add config layer (agency, modules, nav)"
```

---

## Task 4: Move auth files to core/auth/

**Files:**
- Create: `src/core/auth/nextauth.ts`
- Create: `src/core/auth/helpers.ts`
- Create: `src/core/auth/login-rate-limit.ts`
- Modify: `src/app/api/auth/[...nextauth]/route.ts`
- Modify: `src/proxy.ts`

- [ ] **Step 4.1: Create `src/core/auth/login-rate-limit.ts`**

Copy the full content of `src/lib/login-rate-limit.ts` to `src/core/auth/login-rate-limit.ts` with no changes.

```bash
cp src/lib/login-rate-limit.ts src/core/auth/login-rate-limit.ts
```

- [ ] **Step 4.2: Create `src/core/auth/nextauth.ts`**

This extracts `authOptions` from the route file, breaking the circular `lib/auth.ts → app/api/auth` import chain.

```typescript
// src/core/auth/nextauth.ts
import NextAuth, { type NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '@/core/lib/prisma'
import bcrypt from 'bcryptjs'
import { isLockedOut, recordFailure, clearFailures } from '@/core/auth/login-rate-limit'

const sessionMaxAge = 60 * 60 * 8 // 8 hours

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email:    { label: 'Email',    type: 'email',    placeholder: 'admin@example.com' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials, req) {
                if (!credentials?.email || !credentials?.password) {
                    console.log('[auth] login failed: missing credentials')
                    return null
                }

                const xff = req?.headers?.['x-forwarded-for']
                const ip  = (Array.isArray(xff) ? xff[0] : xff)?.split(',')[0].trim() || 'unknown'
                const emailKey = `email:${credentials.email.toLowerCase()}`
                const ipKey    = `ip:${ip}`

                if (isLockedOut(emailKey) || isLockedOut(ipKey)) {
                    console.warn('[auth] login blocked: too many failed attempts', { ip })
                    return null
                }

                const user = await prisma.user.findUnique({ where: { email: credentials.email } })

                if (!user) {
                    recordFailure(emailKey)
                    recordFailure(ipKey)
                    console.log('[auth] login failed')
                    return null
                }

                const isPasswordValid = await bcrypt.compare(credentials.password, user.passwordHash)

                if (!isPasswordValid) {
                    recordFailure(emailKey)
                    recordFailure(ipKey)
                    console.log('[auth] login failed')
                    return null
                }

                clearFailures(emailKey)
                clearFailures(ipKey)

                return { id: user.id.toString(), email: user.email, name: user.name, role: user.role }
            },
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    session: { strategy: 'jwt', maxAge: sessionMaxAge },
    jwt: { maxAge: sessionMaxAge },
    callbacks: {
        async jwt({ token, user }) {
            if (user) token.role = (user as { role?: string }).role
            return token
        },
        async session({ session, token }) {
            if (token?.sub)  (session.user as { id?: string }).id     = token.sub
            if (token?.role) (session.user as { role?: string }).role = token.role as string
            return session
        },
    },
    pages: { signIn: '/login' },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
```

Note: this file imports `@/core/lib/prisma`. That file doesn't exist yet — it will be created in Task 5. The build won't pass until Task 5 is done. That's expected.

- [ ] **Step 4.3: Create `src/core/auth/helpers.ts`**

```typescript
// src/core/auth/helpers.ts
import { getServerSession } from 'next-auth'
import { authOptions } from '@/core/auth/nextauth'
import { NextResponse } from 'next/server'

export async function requireSession() {
    const session = await getServerSession(authOptions)
    if (!session) {
        return { session: null, error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
    }
    return { session, error: null }
}

export function toSlug(str: string): string {
    return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export function makeSlug(str: string): string {
    return `${toSlug(str)}-${Date.now().toString(36)}`
}

export function resolveSlug(input: string | undefined | null, fallback: string): string {
    const cleaned = (input ?? '').trim()
    return cleaned ? toSlug(cleaned) : makeSlug(fallback)
}

export function parseId(raw: string): number | null {
    const n = Number(raw)
    return Number.isInteger(n) && n > 0 ? n : null
}

export function invalidIdResponse() {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
}

export function prismaErrorResponse(e: unknown): NextResponse | null {
    const code = (e as { code?: string })?.code
    if (code === 'P2002') return NextResponse.json({ error: 'Already exists' },              { status: 409 })
    if (code === 'P2025') return NextResponse.json({ error: 'Not found' },                   { status: 404 })
    if (code === 'P2003') return NextResponse.json({ error: 'Referenced record missing' },   { status: 400 })
    return null
}

export function pick<T extends object, K extends keyof T>(obj: T, keys: readonly K[]): Partial<T> {
    const out: Partial<T> = {}
    for (const k of keys) {
        if (k in obj && obj[k] !== undefined) out[k] = obj[k]
    }
    return out
}
```

- [ ] **Step 4.4: Update `src/app/api/auth/[...nextauth]/route.ts`**

Replace the entire file with:

```typescript
// src/app/api/auth/[...nextauth]/route.ts
export { GET, POST, authOptions } from '@/core/auth/nextauth'
```

- [ ] **Step 4.5: Update `src/proxy.ts` imports**

Replace the two import lines at the top of `src/proxy.ts` (the file body stays identical):

```typescript
// src/proxy.ts  — only the import line changes
import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })

    if (!token) {
        const loginUrl = new URL('/login', request.url)
        loginUrl.searchParams.set('callbackUrl', request.nextUrl.pathname)
        return NextResponse.redirect(loginUrl)
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/admin/:path*',
        '/api/tours/:path*',
        '/api/visas/:path*',
        '/api/attestations/:path*',
        '/api/blog/:path*',
        '/api/countries/:path*',
        '/api/destinations/:path*',
        '/api/visa-types/:path*',
        '/api/attestation-types/:path*',
        '/api/tour-categories/:path*',
        '/api/currencies/:path*',
        '/api/document-types/:path*',
        '/api/service-types/:path*',
        '/api/users/:path*',
        '/api/stats',
        '/api/admin/:path*',
    ],
}
```

(proxy.ts has no app-level imports — no changes needed to its body. Confirm there are no `@/lib/*` references in it before this step.)

- [ ] **Step 4.6: Delete old files**

```bash
rm src/lib/login-rate-limit.ts
```

Do NOT delete `src/lib/auth.ts` yet — other files import it. It will be deleted in Task 19 after all consumers are updated.

- [ ] **Step 4.7: Commit**

```bash
git add src/core/auth/ src/app/api/auth/ src/proxy.ts src/lib/login-rate-limit.ts
git commit -m "feat: move auth config and helpers to core/auth/"
```

---

## Task 5: Move core lib files

**Files:**
- Create: `src/core/lib/prisma.ts`, `mailer.ts`, `site-settings.ts`, `email-templates.ts`

- [ ] **Step 5.1: Copy files to core/lib/**

```bash
cp src/lib/prisma.ts         src/core/lib/prisma.ts
cp src/lib/mailer.ts         src/core/lib/mailer.ts
cp src/lib/site-settings.ts  src/core/lib/site-settings.ts
cp src/lib/email-templates.ts src/core/lib/email-templates.ts
```

- [ ] **Step 5.2: Update imports inside each new file**

In `src/core/lib/mailer.ts`, change:
- `from '@/lib/site-settings'` → `from '@/core/lib/site-settings'`
- `from '@/lib/prisma'` → `from '@/core/lib/prisma'`

In `src/core/lib/site-settings.ts`, change:
- `from '@/lib/prisma'` → `from '@/core/lib/prisma'`

In `src/core/lib/email-templates.ts`: check for any `@/lib/*` imports and update them.

Open each file and verify by searching for `@/lib/` — there should be none remaining.

- [ ] **Step 5.3: Commit**

```bash
git add src/core/lib/
git commit -m "feat: move prisma, mailer, site-settings, email-templates to core/lib/"
```

---

## Task 6: Move core admin UI components

**Files:**
- Create: `src/core/ui/ConfirmDialog.tsx`, `ImageUploader.tsx`, `RichTextEditor.tsx`
- Create: `src/core/dashboard/DashboardKpis.tsx`, `DashboardInquiries.tsx`, `InquiryStatusDonut.tsx`

- [ ] **Step 6.1: Copy UI components**

```bash
cp src/components/admin/ConfirmDialog.tsx     src/core/ui/ConfirmDialog.tsx
cp src/components/admin/ImageUploader.tsx     src/core/ui/ImageUploader.tsx
cp src/components/admin/RichTextEditor.tsx    src/core/ui/RichTextEditor.tsx
```

- [ ] **Step 6.2: Update imports inside each copied file**

Search each file for `@/lib/` or `@/components/admin/` imports and update:
- `@/lib/prisma` → `@/core/lib/prisma`
- `@/lib/auth` → `@/core/auth/helpers`

These three files are generic UI widgets. They typically have no `@/lib/` imports — confirm by grepping:

```bash
grep -n "@/lib/" src/core/ui/*.tsx
```
Expected: no output (no matches).

- [ ] **Step 6.3: Copy dashboard components**

```bash
cp src/components/admin/DashboardKpis.tsx       src/core/dashboard/DashboardKpis.tsx
cp src/components/admin/DashboardInquiries.tsx  src/core/dashboard/DashboardInquiries.tsx
cp src/components/admin/InquiryStatusDonut.tsx  src/core/dashboard/InquiryStatusDonut.tsx
```

- [ ] **Step 6.4: Update imports in dashboard files**

```bash
grep -n "@/lib/" src/core/dashboard/*.tsx
```

For any matches, update `@/lib/prisma` → `@/core/lib/prisma`, `@/lib/auth` → `@/core/auth/helpers`.

- [ ] **Step 6.5: Commit**

```bash
git add src/core/ui/ src/core/dashboard/
git commit -m "feat: move admin UI and dashboard components to core/"
```

---

## Task 7: Extract AdminLayout and wire Sidebar to config

**Files:**
- Create: `src/core/admin/AdminLayout.tsx`
- Create: `src/core/admin/Sidebar.tsx`
- Modify: `src/app/admin/layout.tsx`

- [ ] **Step 7.1: Create `src/core/admin/AdminLayout.tsx`**

Extract the shell from `src/app/admin/layout.tsx`. This component receives `children` and the session `initial` character:

```typescript
// src/core/admin/AdminLayout.tsx
import React from 'react'
import Sidebar from '@/core/admin/Sidebar'

interface AdminLayoutProps {
    children: React.ReactNode
    userName?: string | null
    userInitial: string
}

export default function AdminLayout({ children, userName, userInitial }: AdminLayoutProps) {
    return (
        <div className="flex h-screen w-full bg-slate-50 overflow-hidden font-sans">
            <Sidebar />
            <div className="flex flex-1 flex-col overflow-hidden">
                <header className="flex h-16 shrink-0 items-center border-b border-slate-200 bg-white px-6 shadow-sm">
                    <div className="flex flex-1 items-center justify-between">
                        <h1 className="text-lg font-semibold text-slate-800">Overview</h1>
                        <div className="flex items-center gap-3">
                            {userName && (
                                <span className="text-sm text-slate-600">{userName}</span>
                            )}
                            <div className="h-8 w-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
                                {userInitial}
                            </div>
                        </div>
                    </div>
                </header>
                <main className="flex-1 overflow-y-auto p-6 md:p-8">
                    <div className="mx-auto max-w-7xl">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}
```

- [ ] **Step 7.2: Create `src/core/admin/Sidebar.tsx`** — same as current `src/components/admin/Sidebar.tsx` but reads `adminNav` from config instead of the hardcoded `navigation` array, and reads agency name from config.

The current `Sidebar.tsx` renders from a local `navigation` constant. Replace it with a version that imports from `@/config/nav.ts`. The full rendering logic (groups, active states, logout) is preserved unchanged — only the data source changes.

```typescript
// src/core/admin/Sidebar.tsx
'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import {
    LayoutDashboard, Users, Map, FileText, Settings, LogOut,
    PlaneTakeoff, Stamp, Globe, Layers, ChevronDown, ChevronRight,
    MapPin, BadgeCheck, FolderTree, DollarSign, Wrench, Newspaper,
} from 'lucide-react'
import { adminNav, type NavItem } from '@/config/nav'
import { agency } from '@/config/agency'

// Map icon name strings (from config/nav.ts) to Lucide components
const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
    LayoutDashboard, Users, Map, FileText, Settings,
    PlaneTakeoff, Stamp, Globe, Layers, MapPin,
    BadgeCheck, FolderTree, DollarSign, Wrench, Newspaper,
}

type LeafItem  = { name: string; href: string; icon: string }
type GroupItem = { name: string; icon: string; children: LeafItem[] }

function isGroup(item: NavItem): item is GroupItem {
    return (item as GroupItem).children !== undefined
}

function isLeafActive(href: string, pathname: string): boolean {
    if (href === '/admin') return pathname === '/admin'
    return pathname === href || pathname.startsWith(`${href}/`)
}

function isGroupActive(group: GroupItem, pathname: string): boolean {
    return group.children.some(c => isLeafActive(c.href, pathname))
}

export default function Sidebar() {
    const pathname = usePathname()

    const initialOpen: Record<string, boolean> = {}
    for (const item of adminNav) {
        if (isGroup(item)) initialOpen[item.name] = isGroupActive(item as GroupItem, pathname)
    }
    const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(initialOpen)

    function toggle(name: string) {
        setOpenGroups(prev => ({ ...prev, [name]: !prev[name] }))
    }

    return (
        <div className="flex h-full w-64 flex-col bg-slate-900 border-r border-slate-800 text-white shadow-xl">
            <div className="flex h-16 shrink-0 items-center justify-center border-b border-slate-800 px-6">
                <span className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                    {agency.name}
                </span>
            </div>
            <div className="flex flex-1 flex-col overflow-y-auto pt-6 pb-4">
                <nav className="flex-1 space-y-1 px-4">
                    {adminNav.map((item) => {
                        if (isGroup(item)) {
                            const group     = item as GroupItem
                            const groupActive = isGroupActive(group, pathname)
                            const isOpen    = openGroups[group.name] ?? groupActive
                            const Icon      = ICON_MAP[group.icon] ?? LayoutDashboard
                            const Chevron   = isOpen ? ChevronDown : ChevronRight
                            return (
                                <div key={group.name}>
                                    <button
                                        type="button"
                                        onClick={() => toggle(group.name)}
                                        className={`group flex w-full items-center justify-between rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${groupActive ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
                                    >
                                        <span className="flex items-center">
                                            <Icon className={`mr-3 h-5 w-5 shrink-0 transition-colors ${groupActive ? 'text-emerald-300' : 'text-slate-400 group-hover:text-slate-200'}`} aria-hidden="true" />
                                            {group.name}
                                        </span>
                                        <Chevron className="h-4 w-4 text-slate-400" aria-hidden="true" />
                                    </button>
                                    {isOpen && (
                                        <div className="mt-1 space-y-1 pl-4">
                                            {group.children.map(child => {
                                                const childActive = isLeafActive(child.href, pathname)
                                                const ChildIcon   = ICON_MAP[child.icon] ?? FileText
                                                return (
                                                    <Link
                                                        key={child.name}
                                                        href={child.href}
                                                        className={`group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors ${childActive ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                                                    >
                                                        <ChildIcon className={`mr-3 h-4 w-4 shrink-0 transition-colors ${childActive ? 'text-emerald-100' : 'text-slate-500 group-hover:text-slate-300'}`} aria-hidden="true" />
                                                        {child.name}
                                                    </Link>
                                                )
                                            })}
                                        </div>
                                    )}
                                </div>
                            )
                        }

                        const leaf     = item as LeafItem
                        const isActive = isLeafActive(leaf.href, pathname)
                        const Icon     = ICON_MAP[leaf.icon] ?? LayoutDashboard
                        return (
                            <Link
                                key={leaf.name}
                                href={leaf.href}
                                className={`group flex items-center rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${isActive ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
                            >
                                <Icon className={`mr-3 h-5 w-5 shrink-0 transition-colors ${isActive ? 'text-emerald-100' : 'text-slate-400 group-hover:text-slate-200'}`} aria-hidden="true" />
                                {leaf.name}
                            </Link>
                        )
                    })}
                </nav>
            </div>
            <div className="border-t border-slate-800 p-4">
                <button
                    onClick={() => signOut({ callbackUrl: '/login' })}
                    className="group flex w-full items-center rounded-md px-3 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
                >
                    <LogOut className="mr-3 h-5 w-5 shrink-0 text-slate-400 group-hover:text-slate-200" aria-hidden="true" />
                    Logout
                </button>
            </div>
        </div>
    )
}
```

- [ ] **Step 7.3: Update `src/app/admin/layout.tsx`**

Replace the entire file:

```typescript
// src/app/admin/layout.tsx
import { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import AdminLayout from '@/core/admin/AdminLayout'
import { agency } from '@/config/agency'

export const metadata: Metadata = {
    title: `Admin Dashboard - ${agency.name}`,
}

export default async function AdminRootLayout({ children }: { children: React.ReactNode }) {
    const session = await getServerSession(authOptions)
    const initial = (session?.user?.name?.[0] ?? session?.user?.email?.[0] ?? 'A').toUpperCase()

    return (
        <AdminLayout userName={session?.user?.name} userInitial={initial}>
            {children}
        </AdminLayout>
    )
}
```

- [ ] **Step 7.4: Commit**

```bash
git add src/core/admin/ src/app/admin/layout.tsx
git commit -m "feat: extract AdminLayout and Sidebar to core/admin/, wire to config"
```

---

## Task 8: Wire theme.js and WhatsAppButton to agency config

**Files:**
- Modify: `src/theme.js`
- Modify: `src/components/WhatsAppButton.jsx`

- [ ] **Step 8.1: Update `src/theme.js` to read primary colors from agency config**

At the very top of `src/theme.js`, add the import. Then replace the hardcoded `#1A428A` and `#2AB0E5` values with the agency config values:

```javascript
// src/theme.js
import { agency } from './config/agency'

const getDesignTokens = (mode) => ({
  palette: {
    mode,
    primary: {
      ...(mode === 'light'
        ? {
            main: agency.primaryColor,
            light: agency.primaryLight,
            dark: agency.primaryColor,
            contrastText: '#ffffff',
          }
        : {
            main: agency.primaryLight,
            light: '#7DD3FC',
            dark: agency.primaryColor,
            contrastText: '#0F172A',
          }),
    },
    secondary: {
      main: agency.primaryLight,
      light: '#67DAFF',
      dark: '#0085B3',
      contrastText: mode === 'light' ? '#ffffff' : '#0F172A',
    },
    // … rest of file unchanged from here …
```

Keep everything below `secondary` exactly as-is. Only the import line and primary/secondary `main` values change.

- [ ] **Step 8.2: Update `src/components/WhatsAppButton.jsx`**

Replace the hardcoded `WHATSAPP_NUMBER` constant:

```jsx
// src/components/WhatsAppButton.jsx
'use client'
import React from 'react'
import { Fab, Tooltip, Box } from '@mui/material'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import { agency } from '@/config/agency'

const WHATSAPP_MESSAGE = 'Hi! I would like to know more about your travel services.'
const WHATSAPP_URL = `https://wa.me/${agency.whatsapp}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`

const WhatsAppButton = () => {
    return (
        <Box
            sx={{
                position: 'fixed',
                bottom: 30,
                right: 30,
                zIndex: 9999,
                borderRadius: '50%',
                '@keyframes whatsappPulse': {
                    '0%':   { boxShadow: '0 0 0 0 rgba(37, 211, 102, 0.4)' },
                    '100%': { boxShadow: '0 0 0 20px rgba(37, 211, 102, 0)' },
                },
                animation: 'whatsappPulse 2s infinite',
                '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
            }}
        >
            <Tooltip title="Chat on WhatsApp" placement="left">
                <Fab
                    component="a"
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    size="large"
                    aria-label="Chat on WhatsApp"
                    sx={{
                        width: 65,
                        height: 65,
                        background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
                        boxShadow: '0 10px 25px rgba(37, 211, 102, 0.5)',
                        color: 'white',
                        '&:hover': { background: 'linear-gradient(135deg, #1ebe5d 0%, #0e7a6d 100%)' },
                    }}
                >
                    <WhatsAppIcon fontSize="medium" />
                </Fab>
            </Tooltip>
        </Box>
    )
}

export default WhatsAppButton
```

- [ ] **Step 8.3: Commit**

```bash
git add src/theme.js src/components/WhatsAppButton.jsx
git commit -m "feat: wire theme and WhatsApp button to agency config"
```

---

## Task 9: Move the tours module

**Files:**
- Create: `src/modules/tours/ToursTable.tsx`
- Create: `src/modules/tours/handlers.ts`
- Create: `src/modules/tours/tour-utils.ts`

- [ ] **Step 9.1: Move ToursTable**

```bash
cp src/components/admin/ToursTable.tsx src/modules/tours/ToursTable.tsx
```

Open `src/modules/tours/ToursTable.tsx` and update all imports:
- `@/components/admin/ConfirmDialog` → `@/core/ui/ConfirmDialog`
- `@/components/admin/ImageUploader` → `@/core/ui/ImageUploader`
- `@/components/admin/RichTextEditor` → `@/core/ui/RichTextEditor`
- Any `@/lib/*` → `@/core/lib/*`

Verify:
```bash
grep -n "@/components/admin/\|@/lib/" src/modules/tours/ToursTable.tsx
```
Expected: no output.

- [ ] **Step 9.2: Move tour-utils**

```bash
cp src/lib/tour-utils.ts src/modules/tours/tour-utils.ts
```

Check for imports:
```bash
grep -n "@/lib/" src/modules/tours/tour-utils.ts
```
Update any found. Typically none.

- [ ] **Step 9.3: Create `src/modules/tours/handlers.ts`**

This merges `src/app/api/tours/route.ts` and `src/app/api/tours/[id]/route.ts` into one file, updating import paths:

```typescript
// src/modules/tours/handlers.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/core/lib/prisma'
import { requireSession, resolveSlug, toSlug, parseId, invalidIdResponse, prismaErrorResponse, pick } from '@/core/auth/helpers'

// ── Collection ────────────────────────────────────────────────────────────────

export async function GET() {
    const { error } = await requireSession()
    if (error) return error

    const tours = await prisma.tour.findMany({ orderBy: { createdAt: 'desc' } })
    return NextResponse.json(tours)
}

export async function POST(request: NextRequest) {
    const { error } = await requireSession()
    if (error) return error

    const body = await request.json()
    const { title, slug, description, price, originalPrice, rating, reviewsCount, duration, hotelName, country, itinerary, images, packages, features, mealTypes, inclusions, exclusions, datesAvailability, gallery, isActive, featured, tourCategoryId, destinationId } = body

    if (!title) return NextResponse.json({ error: 'title is required' }, { status: 400 })

    try {
        const tour = await prisma.tour.create({
            data: {
                slug: resolveSlug(slug, title),
                title, description, price, originalPrice,
                rating:       rating       || rating       === 0 ? Number(rating)       : null,
                reviewsCount: reviewsCount || reviewsCount === 0 ? Number(reviewsCount) : null,
                duration, hotelName, country, itinerary, images, packages, features,
                mealTypes: Array.isArray(mealTypes) ? mealTypes : null,
                inclusions, exclusions, datesAvailability, gallery,
                isActive:     isActive  ?? true,
                featured:     featured  ?? false,
                tourCategoryId: tourCategoryId ? Number(tourCategoryId) : null,
                destinationId:  destinationId  ? Number(destinationId)  : null,
            },
        })
        return NextResponse.json(tour, { status: 201 })
    } catch (e: unknown) {
        const mapped = prismaErrorResponse(e)
        if (mapped) return mapped
        throw e
    }
}

// ── Single resource ───────────────────────────────────────────────────────────

const TOUR_ALLOWED_FIELDS = [
    'title', 'slug', 'description', 'price', 'originalPrice', 'rating', 'reviewsCount',
    'duration', 'hotelName', 'country', 'itinerary', 'images', 'packages', 'features',
    'mealTypes', 'inclusions', 'exclusions', 'datesAvailability', 'gallery',
    'isActive', 'featured', 'tourCategoryId', 'destinationId',
] as const

export async function GET_BY_ID(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { error } = await requireSession()
    if (error) return error

    const { id: rawId } = await params
    const id = parseId(rawId)
    if (id === null) return invalidIdResponse()

    const tour = await prisma.tour.findUnique({ where: { id } })
    if (!tour) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(tour)
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { error } = await requireSession()
    if (error) return error

    const { id: rawId } = await params
    const id = parseId(rawId)
    if (id === null) return invalidIdResponse()

    const body = await request.json()
    const data: Record<string, unknown> = pick(body, TOUR_ALLOWED_FIELDS)

    if (typeof data.slug === 'string') {
        const cleaned = data.slug.trim()
        if (!cleaned) delete data.slug
        else data.slug = toSlug(cleaned)
    }
    if ('rating'        in data) data.rating        = data.rating        || data.rating        === 0 ? Number(data.rating)        : null
    if ('reviewsCount'  in data) data.reviewsCount  = data.reviewsCount  || data.reviewsCount  === 0 ? Number(data.reviewsCount)  : null
    if ('tourCategoryId' in data) data.tourCategoryId = data.tourCategoryId ? Number(data.tourCategoryId) : null
    if ('destinationId'  in data) data.destinationId  = data.destinationId  ? Number(data.destinationId)  : null

    try {
        const tour = await prisma.tour.update({ where: { id }, data })
        return NextResponse.json(tour)
    } catch (e: unknown) {
        const mapped = prismaErrorResponse(e)
        if (mapped) return mapped
        throw e
    }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { error } = await requireSession()
    if (error) return error

    const { id: rawId } = await params
    const id = parseId(rawId)
    if (id === null) return invalidIdResponse()

    try {
        await prisma.tour.delete({ where: { id } })
        return new NextResponse(null, { status: 204 })
    } catch (e: unknown) {
        const mapped = prismaErrorResponse(e)
        if (mapped) return mapped
        throw e
    }
}
```

- [ ] **Step 9.4: Commit**

```bash
git add src/modules/tours/
git commit -m "feat: add tours module (ToursTable, handlers, tour-utils)"
```

---

## Task 10: Move the visas module

**Files:**
- Create: `src/modules/visas/VisasTable.tsx`
- Create: `src/modules/visas/handlers.ts`

- [ ] **Step 10.1: Move VisasTable**

```bash
cp src/components/admin/VisasTable.tsx src/modules/visas/VisasTable.tsx
```

Open the file. Update imports:
- `@/components/admin/ConfirmDialog` → `@/core/ui/ConfirmDialog`
- `@/components/admin/ImageUploader` → `@/core/ui/ImageUploader`
- `@/components/admin/RichTextEditor` → `@/core/ui/RichTextEditor`
- `@/lib/*` → `@/core/lib/*`

Verify: `grep -n "@/components/admin/\|@/lib/" src/modules/visas/VisasTable.tsx` — no output.

- [ ] **Step 10.2: Create `src/modules/visas/handlers.ts`**

Read `src/app/api/visas/route.ts` and `src/app/api/visas/[id]/route.ts`. Create `src/modules/visas/handlers.ts` with the same structure as `src/modules/tours/handlers.ts`: a single file combining the collection handlers (GET/POST) and resource handlers (GET_BY_ID/PUT/DELETE), updating all imports from `@/lib/` to `@/core/lib/` and `@/lib/auth` to `@/core/auth/helpers`.

The visas `[id]/route.ts` allowed fields list will differ from tours — copy it exactly from the source file.

- [ ] **Step 10.3: Commit**

```bash
git add src/modules/visas/
git commit -m "feat: add visas module"
```

---

## Task 11: Move the attestations module

**Files:**
- Create: `src/modules/attestations/AttestationsTable.tsx`
- Create: `src/modules/attestations/handlers.ts`

- [ ] **Step 11.1: Move AttestationsTable**

```bash
cp src/components/admin/AttestationsTable.tsx src/modules/attestations/AttestationsTable.tsx
```

Update imports: `@/components/admin/ConfirmDialog` → `@/core/ui/ConfirmDialog`, `@/components/admin/ImageUploader` → `@/core/ui/ImageUploader`, `@/lib/*` → `@/core/lib/*`.

Verify: `grep -n "@/components/admin/\|@/lib/" src/modules/attestations/AttestationsTable.tsx` — no output.

- [ ] **Step 11.2: Create `src/modules/attestations/handlers.ts`**

Read `src/app/api/attestations/route.ts` and `src/app/api/attestations/[id]/route.ts`. Create `handlers.ts` using the same combined pattern as tours — GET/POST for collection, GET_BY_ID/PUT/DELETE for resource. Update all `@/lib/` and `@/lib/auth` imports.

- [ ] **Step 11.3: Commit**

```bash
git add src/modules/attestations/
git commit -m "feat: add attestations module"
```

---

## Task 12: Move the blog module

**Files:**
- Create: `src/modules/blog/BlogPostsTable.tsx`
- Create: `src/modules/blog/handlers.ts`
- Create: `src/modules/blog/blog.ts`
- Create: `src/modules/blog/blog-jsonld.ts`
- Create: `src/modules/blog/travel-resources.ts`

- [ ] **Step 12.1: Copy blog files**

```bash
cp src/components/admin/BlogPostsTable.tsx   src/modules/blog/BlogPostsTable.tsx
cp src/lib/blog.ts                           src/modules/blog/blog.ts
cp src/lib/blog-jsonld.ts                    src/modules/blog/blog-jsonld.ts
cp src/lib/travel-resources.ts               src/modules/blog/travel-resources.ts
```

- [ ] **Step 12.2: Update imports in each copied file**

In `BlogPostsTable.tsx`: `@/components/admin/ConfirmDialog` → `@/core/ui/ConfirmDialog`, `@/components/admin/RichTextEditor` → `@/core/ui/RichTextEditor`, `@/lib/prisma` → `@/core/lib/prisma`, `@/lib/auth` → `@/core/auth/helpers`.

In `blog.ts`: `@/lib/prisma` → `@/core/lib/prisma`.

In `blog-jsonld.ts` and `travel-resources.ts`: update any `@/lib/` imports.

Verify all:
```bash
grep -rn "@/components/admin/\|@/lib/" src/modules/blog/
```
Expected: no output.

- [ ] **Step 12.3: Create `src/modules/blog/handlers.ts`**

Read `src/app/api/blog/route.ts` and `src/app/api/blog/[id]/route.ts`. Combine them into `handlers.ts` with updated imports (`@/lib/` → `@/core/lib/`, `@/lib/auth` → `@/core/auth/helpers`).

- [ ] **Step 12.4: Commit**

```bash
git add src/modules/blog/
git commit -m "feat: add blog module"
```

---

## Task 13: Move the destinations module

**Files:**
- Create: `src/modules/destinations/DestinationsTable.tsx`
- Create: `src/modules/destinations/handlers.ts`
- Create: `src/modules/destinations/destination-fields.ts`
- Create: `src/modules/destinations/destination-jsonld.ts`

- [ ] **Step 13.1: Copy files**

```bash
cp src/components/admin/DestinationsTable.tsx  src/modules/destinations/DestinationsTable.tsx
cp src/lib/destination-fields.ts               src/modules/destinations/destination-fields.ts
cp src/lib/destination-jsonld.ts               src/modules/destinations/destination-jsonld.ts
```

- [ ] **Step 13.2: Update imports**

In `DestinationsTable.tsx`: `@/components/admin/ConfirmDialog` → `@/core/ui/ConfirmDialog`, `@/components/admin/ImageUploader` → `@/core/ui/ImageUploader`, `@/components/admin/RichTextEditor` → `@/core/ui/RichTextEditor`, `@/lib/*` → `@/core/lib/*` or appropriate module path.

In `destination-fields.ts` and `destination-jsonld.ts`: update `@/lib/*` imports.

Verify: `grep -rn "@/components/admin/\|@/lib/" src/modules/destinations/` — no output.

- [ ] **Step 13.3: Create `src/modules/destinations/handlers.ts`**

Read `src/app/api/destinations/route.ts` and `[id]/route.ts`. Combine into `handlers.ts`. Update all `@/lib/` imports.

- [ ] **Step 13.4: Commit**

```bash
git add src/modules/destinations/
git commit -m "feat: add destinations module"
```

---

## Task 14: Move the inquiries module

**Files:**
- Create: `src/modules/inquiries/InquiriesTable.tsx`
- Create: `src/modules/inquiries/handlers.ts`

- [ ] **Step 14.1: Move InquiriesTable**

```bash
cp src/components/admin/InquiriesTable.tsx src/modules/inquiries/InquiriesTable.tsx
```

Update imports: `@/components/admin/ConfirmDialog` → `@/core/ui/ConfirmDialog`, `@/lib/*` → `@/core/lib/*`.

Verify: `grep -n "@/components/admin/\|@/lib/" src/modules/inquiries/InquiriesTable.tsx` — no output.

- [ ] **Step 14.2: Create `src/modules/inquiries/handlers.ts`**

The inquiries route is more complex — it has inline rate-limiting and reCAPTCHA validation. Read `src/app/api/inquiries/route.ts` and `src/app/api/inquiries/[id]/route.ts` in full. Create `handlers.ts` with updated imports:
- `@/lib/prisma` → `@/core/lib/prisma`
- `@/lib/auth` → `@/core/auth/helpers`
- `@/lib/mailer` → `@/core/lib/mailer`
- `@/lib/recaptcha` → `@/lib/recaptcha` (stays in lib — generic utility)

- [ ] **Step 14.3: Commit**

```bash
git add src/modules/inquiries/
git commit -m "feat: add inquiries module"
```

---

## Task 15: Move the masters module

**Files:**
- Create: `src/modules/masters/components/` (7 table files)
- Create: `src/modules/masters/handlers/` (7 handler files)

- [ ] **Step 15.1: Copy all master table components**

```bash
cp src/components/admin/CountriesTable.tsx          src/modules/masters/components/CountriesTable.tsx
cp src/components/admin/CurrenciesTable.tsx         src/modules/masters/components/CurrenciesTable.tsx
cp src/components/admin/VisaTypesTable.tsx          src/modules/masters/components/VisaTypesTable.tsx
cp src/components/admin/AttestationTypesTable.tsx   src/modules/masters/components/AttestationTypesTable.tsx
cp src/components/admin/TourCategoriesTable.tsx     src/modules/masters/components/TourCategoriesTable.tsx
cp src/components/admin/DocumentTypesTable.tsx      src/modules/masters/components/DocumentTypesTable.tsx
cp src/components/admin/ServiceTypesTable.tsx       src/modules/masters/components/ServiceTypesTable.tsx
```

- [ ] **Step 15.2: Update imports in all 7 files**

Each file may import `ConfirmDialog`. Update:
- `@/components/admin/ConfirmDialog` → `@/core/ui/ConfirmDialog`
- `@/lib/*` → `@/core/lib/*`

```bash
# Bulk-check for stale imports
grep -rn "@/components/admin/\|@/lib/" src/modules/masters/components/
```
Expected: no output.

- [ ] **Step 15.3: Create masters handler files**

For each of the 7 master entities, read the corresponding `src/app/api/<entity>/route.ts` and `[id]/route.ts`, then create the handler file. All 7 follow identical structure — only the Prisma model name, field names, and validation differ.

Create each file:

**`src/modules/masters/handlers/countries.ts`** — read from `src/app/api/countries/route.ts` and `[id]/route.ts`. Update imports: `@/lib/prisma` → `@/core/lib/prisma`, `@/lib/auth` → `@/core/auth/helpers`.

**`src/modules/masters/handlers/currencies.ts`** — read from `src/app/api/currencies/` routes.

**`src/modules/masters/handlers/visa-types.ts`** — read from `src/app/api/visa-types/` routes.

**`src/modules/masters/handlers/attestation-types.ts`** — read from `src/app/api/attestation-types/` routes.

**`src/modules/masters/handlers/tour-categories.ts`** — read from `src/app/api/tour-categories/` routes.

**`src/modules/masters/handlers/document-types.ts`** — read from `src/app/api/document-types/` routes.

**`src/modules/masters/handlers/service-types.ts`** — read from `src/app/api/service-types/` routes.

Verify all handler files have no `@/lib/` imports:
```bash
grep -rn "@/lib/" src/modules/masters/handlers/
```
Expected: no output.

- [ ] **Step 15.4: Commit**

```bash
git add src/modules/masters/
git commit -m "feat: add masters module (7 entities)"
```

---

## Task 16: Update app/admin page imports

**Files:** All `src/app/admin/*/page.tsx` files

- [ ] **Step 16.1: Update dashboard page (`src/app/admin/page.tsx`)**

Open the file. Find imports of `DashboardKpis`, `DashboardInquiries`, `InquiryStatusDonut` from `@/components/admin/*`. Replace with `@/core/dashboard/*`.

- [ ] **Step 16.2: Update tours page (`src/app/admin/tours/page.tsx`)**

Change: `from '@/components/admin/ToursTable'` → `from '@/modules/tours/ToursTable'`

- [ ] **Step 16.3: Update visas page**

Change: `from '@/components/admin/VisasTable'` → `from '@/modules/visas/VisasTable'`

- [ ] **Step 16.4: Update attestations page**

Change: `from '@/components/admin/AttestationsTable'` → `from '@/modules/attestations/AttestationsTable'`

- [ ] **Step 16.5: Update blog page**

Change: `from '@/components/admin/BlogPostsTable'` → `from '@/modules/blog/BlogPostsTable'`

- [ ] **Step 16.6: Update destinations page**

Change: `from '@/components/admin/DestinationsTable'` → `from '@/modules/destinations/DestinationsTable'`

- [ ] **Step 16.7: Update inquiries page**

Change: `from '@/components/admin/InquiriesTable'` → `from '@/modules/inquiries/InquiriesTable'`

- [ ] **Step 16.8: Update masters pages**

For each page under `src/app/admin/masters/*/page.tsx` and `src/app/admin/countries/page.tsx`, update the import to the corresponding `@/modules/masters/components/*` path.

- [ ] **Step 16.9: Update remaining components/admin consumers**

`UsersTable` and `SettingsForm` stay in `src/components/admin/` (they're not module-extracted). Update their internal imports:
- Any `@/lib/prisma` → `@/core/lib/prisma`
- Any `@/lib/auth` → `@/core/auth/helpers`
- Any `@/components/admin/ConfirmDialog` → `@/core/ui/ConfirmDialog`
- Any `@/components/admin/ImageUploader` → `@/core/ui/ImageUploader`

```bash
grep -n "@/lib/\|@/components/admin/Confirm\|@/components/admin/Image" src/components/admin/UsersTable.tsx src/components/admin/SettingsForm.tsx
```
Update any found.

- [ ] **Step 16.10: Commit**

```bash
git add src/app/admin/
git commit -m "feat: update admin pages to import from core/ and modules/"
```

---

## Task 17: Convert API routes to thin re-exports

**Files:** All `src/app/api/*/route.ts` (14 module route pairs)

- [ ] **Step 17.1: Replace tours routes**

`src/app/api/tours/route.ts`:
```typescript
export { GET, POST } from '@/modules/tours/handlers'
```

`src/app/api/tours/[id]/route.ts`:
```typescript
export { GET_BY_ID as GET, PUT, DELETE } from '@/modules/tours/handlers'
```

- [ ] **Step 17.2: Replace visas routes**

`src/app/api/visas/route.ts`:
```typescript
export { GET, POST } from '@/modules/visas/handlers'
```

`src/app/api/visas/[id]/route.ts`:
```typescript
export { GET_BY_ID as GET, PUT, DELETE } from '@/modules/visas/handlers'
```

- [ ] **Step 17.3: Replace attestations routes**

`src/app/api/attestations/route.ts`:
```typescript
export { GET, POST } from '@/modules/attestations/handlers'
```

`src/app/api/attestations/[id]/route.ts`:
```typescript
export { GET_BY_ID as GET, PUT, DELETE } from '@/modules/attestations/handlers'
```

- [ ] **Step 17.4: Replace blog routes**

`src/app/api/blog/route.ts`:
```typescript
export { GET, POST } from '@/modules/blog/handlers'
```

`src/app/api/blog/[id]/route.ts`:
```typescript
export { GET_BY_ID as GET, PUT, DELETE } from '@/modules/blog/handlers'
```

- [ ] **Step 17.5: Replace destinations routes**

`src/app/api/destinations/route.ts`:
```typescript
export { GET, POST } from '@/modules/destinations/handlers'
```

`src/app/api/destinations/[id]/route.ts`:
```typescript
export { GET_BY_ID as GET, PUT, DELETE } from '@/modules/destinations/handlers'
```

- [ ] **Step 17.6: Replace inquiries routes**

`src/app/api/inquiries/route.ts`:
```typescript
export { GET, POST } from '@/modules/inquiries/handlers'
```

`src/app/api/inquiries/[id]/route.ts`:
```typescript
export { GET_BY_ID as GET, PUT, DELETE } from '@/modules/inquiries/handlers'
```

- [ ] **Step 17.7: Replace all 7 masters routes**

For each entity (countries, currencies, visa-types, attestation-types, tour-categories, document-types, service-types):

`src/app/api/<entity>/route.ts`:
```typescript
export { GET, POST } from '@/modules/masters/handlers/<entity>'
```

`src/app/api/<entity>/[id]/route.ts`:
```typescript
export { GET_BY_ID as GET, PUT, DELETE } from '@/modules/masters/handlers/<entity>'
```

- [ ] **Step 17.8: Update stats and upload routes**

`src/app/api/stats/route.ts` — open and update any `@/lib/prisma` → `@/core/lib/prisma`, `@/lib/auth` → `@/core/auth/helpers`.

`src/app/api/upload/route.ts` — same: update `@/lib/` imports.

`src/app/api/admin/settings/smtp/test/route.ts` — update `@/lib/mailer` → `@/core/lib/mailer`, `@/lib/auth` → `@/core/auth/helpers`.

`src/app/api/recaptcha-site-key/route.ts` — check for `@/lib/` imports and update. (This route likely reads from `process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY` directly — if so, no changes needed.)

- [ ] **Step 17.9: Update public API routes**

Files under `src/app/api/public/`: update `@/lib/prisma` → `@/core/lib/prisma` and any other `@/lib/` references.

- [ ] **Step 17.10: Purge old lib files now superseded**

```bash
rm src/lib/auth.ts
rm src/lib/prisma.ts
rm src/lib/mailer.ts
rm src/lib/site-settings.ts
rm src/lib/email-templates.ts
rm src/lib/tour-utils.ts
rm src/lib/blog.ts
rm src/lib/blog-jsonld.ts
rm src/lib/travel-resources.ts
rm src/lib/destination-fields.ts
rm src/lib/destination-jsonld.ts
```

Files kept at `src/lib/` (still used by public routes): `recaptcha.ts`, `public-card.ts`, `public-detail.ts`, `related.ts`, `service-jsonld.ts`, `nav-data.ts`, `footer-links.ts`.

- [ ] **Step 17.11: Scan for any remaining stale imports**

```bash
grep -rn "from '@/lib/auth'\|from '@/lib/prisma'\|from '@/lib/mailer'\|from '@/lib/site-settings'\|from '@/lib/email-templates'\|from '@/lib/tour-utils'\|from '@/lib/blog'\|from '@/lib/destination-fields'" src/
```
Expected: no output. Fix any found.

- [ ] **Step 17.12: Commit**

```bash
git add src/app/api/ src/lib/
git commit -m "feat: convert API routes to thin re-exports, purge moved lib files"
```

---

## Task 18: Strip Origin Travels public content

**Files:** Delete OT-specific pages and components; stub shared components.

- [ ] **Step 18.1: Delete OT-specific public pages**

```bash
rm -rf src/app/umrah
rm -rf src/app/umrah-packages-from-bangalore
rm -rf src/app/umrah-packages-from-chennai
rm -rf src/app/umrah-packages-from-delhi
rm -rf src/app/umrah-packages-from-mumbai
rm -rf src/app/umrah-packages-from-pune
rm -rf src/app/umrah-packages-from-vijayawada
rm -rf src/app/hajj
rm -rf src/app/flights
rm -rf src/app/hotels
rm -rf src/app/transport
rm -rf src/app/about
rm -rf src/app/terms
rm -rf src/app/privacy
rm -rf src/app/refund
rm -rf src/app/thank-you
```

- [ ] **Step 18.2: Delete OT-specific public components**

```bash
rm src/components/Globe.jsx
rm src/components/RelatedServices.jsx
rm src/components/ThankYouTemplate.jsx
```

- [ ] **Step 18.3: Stub `src/lib/nav-data.ts`**

Replace the file's content entirely:

```typescript
// src/lib/nav-data.ts
// Replace with your agency's navigation structure.
export const navLinks: { label: string; href: string; children?: { label: string; href: string }[] }[] = []
```

- [ ] **Step 18.4: Stub `src/lib/footer-links.ts`**

Replace the file's content entirely:

```typescript
// src/lib/footer-links.ts
// Replace with your agency's footer links.
export const footerLinks: { heading: string; links: { label: string; href: string }[] }[] = []
```

- [ ] **Step 18.5: Stub `src/app/page.jsx` (home page)**

Open `src/app/page.jsx`. Remove all imports of deleted components (Globe, RelatedServices, etc.). Replace the page body with a minimal placeholder:

```jsx
// src/app/page.jsx
export default function HomePage() {
  return (
    <main>
      <p style={{ padding: '2rem' }}>Home page — add your content here.</p>
    </main>
  )
}
```

- [ ] **Step 18.6: Commit**

```bash
git add -A
git commit -m "chore: strip Origin Travels public pages and components"
```

---

## Task 19: Clean the design system

**Files:**
- Modify: `src/config/designSystem.js`

- [ ] **Step 19.1: Remove country flag gradients**

Open `src/config/designSystem.js`. Find the section that defines country-specific gradients (an object with keys like `'UAE'`, `'Saudi Arabia'`, `'Egypt'`, etc. — approximately 50+ entries). Remove that entire object/section.

Keep everything else: `radius`, `shadows`, `spacing`, `sectionColors`, `highlightCardSx`, `iconContainerSx`, `sectionHeaderSx`, `serviceIcons`.

After removing, verify:
```bash
grep -n "'UAE'\|'Saudi Arabia'\|'Egypt'\|countryGradients\|flagGradients" src/config/designSystem.js
```
Expected: no output.

- [ ] **Step 19.2: Commit**

```bash
git add src/config/designSystem.js
git commit -m "chore: remove Origin Travels country flag gradients from design system"
```

---

## Task 20: Clean .env.example and Prisma defaults

**Files:**
- Modify: `.env.example`
- Modify: `prisma/schema.prisma`

- [ ] **Step 20.1: Update `.env.example`**

Replace the full content:

```bash
# Database
DATABASE_URL=postgresql://postgres:root@db:5432/travel_admin?schema=public

# Auth
NEXTAUTH_SECRET=replace-with-a-random-string
NEXTAUTH_URL=http://localhost:3000

# reCAPTCHA v3 (optional — leave blank to disable on enquiry form)
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=
RECAPTCHA_SECRET_KEY=

# SMTP (can also be configured from Admin → Settings)
# SMTP_HOST=
# SMTP_PORT=587
# SMTP_USER=
# SMTP_PASS=
# SMTP_SECURE=false
# INQUIRY_FROM=
# INQUIRY_TO=
```

- [ ] **Step 20.2: Clear SiteSetting defaults in `prisma/schema.prisma`**

Open `prisma/schema.prisma`. Find the `SiteSetting` model. Any fields with `@default("Origin Travels")`, `@default("info@origin-travels.com")`, or other OT-specific string defaults — change those to `@default("")`.

After editing, verify:
```bash
grep -n "origin-travels\|Origin Travels\|+971" prisma/schema.prisma
```
Expected: no output.

- [ ] **Step 20.3: Commit**

```bash
git add .env.example prisma/schema.prisma
git commit -m "chore: strip OT defaults from .env.example and Prisma schema"
```

---

## Task 21: Final build verification

- [ ] **Step 21.1: Temporarily disable ignoreBuildErrors**

In `next.config.ts`, change:
```typescript
typescript: {
  ignoreBuildErrors: false,  // temporarily
},
```

- [ ] **Step 21.2: Run the build**

```bash
docker compose exec app npx next build 2>&1 | tail -50
```

- [ ] **Step 21.3: Fix any import errors**

TypeScript will surface any remaining stale `@/lib/auth`, `@/lib/prisma`, or `@/components/admin/` references. Fix each one. Re-run the build after each fix batch.

- [ ] **Step 21.4: Restore ignoreBuildErrors**

```typescript
typescript: {
  ignoreBuildErrors: true,  // restore — pre-existing TS issues in .jsx files
},
```

- [ ] **Step 21.5: Smoke-test the admin**

Start the dev server and verify:
```bash
docker compose up -d
```

1. Navigate to `http://localhost:3000/admin` → redirected to `/login` ✓
2. Log in with admin credentials → dashboard shows KPIs ✓
3. Navigate to Tours → table loads ✓
4. Create a new tour → saves and appears in table ✓
5. Navigate to Settings → form loads ✓

- [ ] **Step 21.6: Commit**

```bash
git add next.config.ts
git commit -m "chore: verify build and restore ignoreBuildErrors"
```

---

## Task 22: Write README

**Files:**
- Create: `README.md`

- [ ] **Step 22.1: Write `README.md`**

```markdown
# Travel Agency Admin Core

A production-ready Next.js admin dashboard template for travel agencies. Clone this repo to start a new agency project.

## Quick Start

\`\`\`bash
git clone git@github.com:your-org/travel-agency-admin-core.git my-agency
cd my-agency
cp .env.example .env          # fill in DATABASE_URL, NEXTAUTH_SECRET
\`\`\`

### 1. Configure the agency

Edit **`src/config/agency.ts`** — name, logo, contact details, primary colour, WhatsApp number.

### 2. Enable/disable modules

Edit **`src/config/modules.ts`** — set any module to `false` to remove it from the admin nav.

To permanently remove a module:
1. Set it to `false` in `modules.ts`
2. Delete `src/modules/<name>/`
3. Delete `src/app/admin/<name>/` and `src/app/api/<name>/`
4. Remove the Prisma model from `prisma/schema.prisma` and run `db push`

### 3. Start the app

\`\`\`bash
docker compose up --build
docker compose exec app npx prisma db push
\`\`\`

Visit `http://localhost:3000/admin`.

## Project Structure

\`\`\`
src/
├── app/          # Next.js routing — thin files only, no logic
├── core/         # Infrastructure — auth, admin shell, UI components, lib
│   ├── admin/    # AdminLayout, Sidebar (driven by config/nav.ts)
│   ├── auth/     # NextAuth config, rate limiter, session helpers
│   ├── dashboard/# KPI cards, inquiry table, donut chart
│   ├── lib/      # Prisma client, mailer, site-settings, email templates
│   └── ui/       # ConfirmDialog, ImageUploader, RichTextEditor
├── modules/      # Feature modules — each independently removable
│   ├── tours/    # ToursTable, handlers, tour-utils
│   ├── visas/
│   ├── attestations/
│   ├── blog/
│   ├── destinations/
│   ├── inquiries/
│   └── masters/
├── config/       # ← Start here for a new project
│   ├── agency.ts
│   ├── modules.ts
│   └── nav.ts
└── components/   # Public-facing skeleton (stubs — add your own content)
\`\`\`

## Development

\`\`\`bash
docker compose up -d              # start
docker compose logs -f app        # stream logs
docker compose exec app npx prisma studio   # DB GUI
npm run lint                      # lint (host-only)
\`\`\`

## Adding a new module

1. Create `src/modules/<name>/` with a table component and `handlers.ts`
2. Add API routes in `src/app/api/<name>/route.ts` (re-export from handlers)
3. Add an admin page in `src/app/admin/<name>/page.tsx`
4. Add a Prisma model to `prisma/schema.prisma`, run `db push`
5. Add a nav item to `src/config/nav.ts`
\`\`\`

- [ ] **Step 22.2: Commit**

\`\`\`bash
git add README.md
git commit -m "docs: add README with project structure and quick-start guide"
\`\`\`

---

## Done

The `travel-agency-admin-core` repo now has:
- A clean four-layer structure (`core/`, `modules/`, `config/`, `components/`)
- A three-file config surface (`agency.ts`, `modules.ts`, `nav.ts`) for per-agency customisation
- All 7 feature modules independently removable
- No Origin Travels branding or hardcoded contact details
- A working admin dashboard with full CRUD, auth, settings, and dashboard analytics
