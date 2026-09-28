# Docker Setup

Two services: **Next.js app** (port 3000) + **PostgreSQL** (port 5432). No local Postgres needed.

## Prerequisites

[Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.

## First-Time Setup

```bash
cp .env.example .env
# Edit .env — set NEXTAUTH_SECRET to any random string
docker compose up --build
```

`--build` generates the Prisma client, runs `prisma db push` (creates all tables), and starts the dev server with hot-reload at http://localhost:3000.

## Everyday Commands

```bash
docker compose up -d          # start in background
docker compose down           # stop
docker compose logs -f app    # stream app logs
docker compose up --build     # rebuild after adding npm packages
```

## Admin User

A default admin is seeded automatically on first startup:

| | |
|---|---|
| Email | `admin@origin.com` |
| Password | `admin123` |

Change the password after first login. To re-seed manually:
```bash
docker compose exec app npx prisma db seed
```

## Schema Changes

After editing `prisma/schema.prisma`:
```bash
docker compose exec app npx prisma db push
```

To open Prisma Studio from your host machine (use `localhost:5432`):
```bash
npx prisma studio
```

## Credentials (dev only)

| | |
|---|---|
| DB user | `postgres` |
| DB password | `root` |
| DB name | `origin_travels` |

## Troubleshooting

**New package not found in container** — anonymous volumes cache `node_modules`. Run `docker compose up --build` or `docker compose exec app npm install`.

**Port 5432 in use** — a local Postgres is running. Stop it, or remap the port in `docker-compose.yml` to `"5433:5432"`.

**Database errors on startup** — tables may not exist yet. Run `docker compose exec app npx prisma db push`.

**Reset everything** — `docker compose down -v` removes the `postgres_data` volume, then `docker compose up -d`.
