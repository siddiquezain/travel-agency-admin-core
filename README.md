# Travel Agency Admin Core

A production-ready Next.js admin dashboard template for travel agencies. Clone this repo to start a new agency project.

## Quick Start

```bash
git clone git@github.com:your-org/travel-agency-admin-core.git my-agency
cd my-agency
cp .env.example .env          # fill in DATABASE_URL, NEXTAUTH_SECRET
```

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

```bash
docker compose up --build
docker compose exec app npx prisma db push
```

Visit `http://localhost:3000/admin`.

## Project Structure

```
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
```

## Development

```bash
docker compose up -d              # start
docker compose logs -f app        # stream logs
docker compose exec app npx prisma studio   # DB GUI
npm run lint                      # lint (host-only)
```

## Adding a new module

1. Create `src/modules/<name>/` with a table component and `handlers.ts`
2. Add API routes in `src/app/api/<name>/route.ts` (re-export from handlers)
3. Add an admin page in `src/app/admin/<name>/page.tsx`
4. Add a Prisma model to `prisma/schema.prisma`, run `db push`
5. Add a nav item to `src/config/nav.ts`
