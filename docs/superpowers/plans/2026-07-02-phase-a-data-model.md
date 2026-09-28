# Phase A — Data Model & Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Establish the data foundation for the architecture redesign — extend `Destination` into a rich guide model, relate `Tour → Destination` and `BlogPost ↔ Destination`, and add the shared libraries (resource taxonomy, destination JSON-LD) that later phases consume.

**Architecture:** Prisma schema additions are all nullable/relational (non-destructive), applied via `prisma db push` (project uses no migration files). New pure-function libraries live in `src/lib/`. A one-off idempotent `tsx` backfill script links existing tours to destinations. Because this project has **no unit-test runner**, verification uses the project's real tools: `prisma generate`, `npm run lint`, and `tsx` assertion scripts run inside Docker.

**Tech Stack:** Next.js 16, Prisma 7 (`prisma-client` generator + `PrismaPg` adapter), TypeScript, `tsx` for scripts, Node's built-in `assert`.

## Global Constraints

- Prisma schema is synced with **`db push`, never `migrate dev`** — there are no migration files. (CLAUDE.md)
- All DB/script/lint commands run **inside the app container**: `docker compose exec app <cmd>`. (CLAUDE.md, DOCKER.md)
- After schema changes, run `docker compose exec app npx prisma generate`. (CLAUDE.md)
- Prisma client entry point is `src/generated/prisma/client.ts`; import the shared client from `src/lib/prisma.ts` (`import { prisma } from "@/lib/prisma"` in app code, `"../src/lib/prisma"` / `"../../src/lib/prisma"` in scripts).
- Keep the existing mixed JS/TS convention: infra/libs/admin are `.ts`/`.tsx`; do not convert public `.jsx`.
- App code imports shared libs via the `@/` alias (maps to `./src/*` in `tsconfig.json`); `tsx` resolves this alias from `tsconfig.json`.
- The DB name stays `BlogPost` (UI relabel to "Travel Resources" happens in a later phase). `BlogPost.category` stores the Travel-Resources taxonomy value.
- Commit after every task with a `feat:`/`chore:` message.

---

### Task 1: Travel-Resources taxonomy library

Single source of truth for the 17 Travel-Resources categories, consumed later by the admin form (dropdown) and mega-menu.

**Files:**
- Create: `src/lib/travel-resources.ts`
- Create (test): `scripts/verify/phase-a-libs.ts`

**Interfaces:**
- Consumes: nothing.
- Produces:
  - `RESOURCE_CATEGORIES: readonly string[]` (17 entries, exact copy verbatim).
  - `type ResourceCategory = (typeof RESOURCE_CATEGORIES)[number]`.
  - `isResourceCategory(value: string): value is ResourceCategory`.

- [ ] **Step 1: Write the failing assertion script**

Create `scripts/verify/phase-a-libs.ts`:

```ts
// Phase A library verification. Run inside the app container:
//   docker compose exec app npx tsx scripts/verify/phase-a-libs.ts
import assert from "node:assert/strict";
import {
  RESOURCE_CATEGORIES,
  isResourceCategory,
} from "../../src/lib/travel-resources";

// --- travel-resources.ts ---
assert.equal(RESOURCE_CATEGORIES.length, 17, "expected 17 resource categories");
assert.ok(RESOURCE_CATEGORIES.includes("Destination Guides"));
assert.ok(RESOURCE_CATEGORIES.includes("Seasonal Travel Guides"));
assert.equal(isResourceCategory("Travel Tips"), true);
assert.equal(isResourceCategory("Nonsense Category"), false);

console.log("phase-a-libs: ALL ASSERTIONS PASSED");
```

- [ ] **Step 2: Run it to verify it fails**

Run: `docker compose exec app npx tsx scripts/verify/phase-a-libs.ts`
Expected: FAIL — `Cannot find module '../../src/lib/travel-resources'`.

- [ ] **Step 3: Create the library**

Create `src/lib/travel-resources.ts`:

```ts
// Canonical Travel-Resources taxonomy (the section formerly called "Blog").
// Stored on BlogPost.category. The admin UI offers these as a dropdown; free
// text remains permitted for forward-compatibility, so treat this as the
// recommended set, not a hard enum.
export const RESOURCE_CATEGORIES = [
  "Destination Guides",
  "Travel Tips",
  "Visa Updates",
  "Travel News",
  "Government Advisories",
  "Packing Guides",
  "Itineraries",
  "Budget Travel",
  "Luxury Travel",
  "Family Travel",
  "Honeymoon Ideas",
  "Festival Guides",
  "Airport Guides",
  "Airline Information",
  "Health Advisories",
  "Travel Checklists",
  "Seasonal Travel Guides",
] as const;

export type ResourceCategory = (typeof RESOURCE_CATEGORIES)[number];

/** True when `value` is one of the canonical resource categories. */
export function isResourceCategory(value: string): value is ResourceCategory {
  return (RESOURCE_CATEGORIES as readonly string[]).includes(value);
}
```

- [ ] **Step 4: Run the assertion script to verify it passes**

Run: `docker compose exec app npx tsx scripts/verify/phase-a-libs.ts`
Expected: `phase-a-libs: ALL ASSERTIONS PASSED` (exit 0).

- [ ] **Step 5: Lint**

Run: `docker compose exec app npm run lint`
Expected: no errors for `src/lib/travel-resources.ts`.

- [ ] **Step 6: Commit**

```bash
git add src/lib/travel-resources.ts scripts/verify/phase-a-libs.ts
git commit -m "feat: add Travel-Resources taxonomy library"
```

---

### Task 2: Destination JSON-LD library

Structured-data builders for destination guide pages, mirroring `src/lib/service-jsonld.ts` and `src/lib/blog-jsonld.ts` (which has no FAQ builder — so `faqPageJsonLd` here is new, not a duplicate).

**Files:**
- Create: `src/lib/destination-jsonld.ts`
- Modify: `scripts/verify/phase-a-libs.ts` (append assertions)

**Interfaces:**
- Consumes: `SITE_URL`, `breadcrumbJsonLd` from `@/lib/service-jsonld`.
- Produces:
  - `destinationJsonLd(args: { name; slug; description?; heroImage?; country? }): object` → schema.org `TouristDestination`.
  - `faqPageJsonLd(faqs: { q: string; a: string }[]): object | null` → `FAQPage` or `null` when empty.
  - `destinationGraph(args: { name; slug; description?; heroImage?; country?; faqs? }): object` → `{ "@context", "@graph": [...] }` ready to `JSON.stringify` into a `<script type="application/ld+json">`.

- [ ] **Step 1: Append failing assertions**

Add to the end of `scripts/verify/phase-a-libs.ts` (before the final `console.log`):

```ts
import {
  destinationJsonLd,
  faqPageJsonLd,
  destinationGraph,
} from "../../src/lib/destination-jsonld";

// --- destination-jsonld.ts ---
const d = destinationJsonLd({
  name: "Dubai",
  slug: "dubai",
  description: "Guide to Dubai.",
  heroImage: "/img/dubai.jpg",
  country: "United Arab Emirates",
}) as Record<string, unknown>;
assert.equal(d["@type"], "TouristDestination");
assert.equal(d.url, "https://origintoursandtravels.com/destinations/dubai");
assert.equal(d.image, "https://origintoursandtravels.com/img/dubai.jpg");

assert.equal(faqPageJsonLd([]), null, "empty faqs -> null");
const faq = faqPageJsonLd([{ q: "Is it safe?", a: "Yes." }]) as Record<string, unknown>;
assert.equal(faq["@type"], "FAQPage");
assert.equal((faq.mainEntity as unknown[]).length, 1);

const graph = destinationGraph({
  name: "Dubai",
  slug: "dubai",
  faqs: [{ q: "Q", a: "A" }],
}) as Record<string, unknown>;
const nodes = graph["@graph"] as Array<Record<string, unknown>>;
assert.equal(graph["@context"], "https://schema.org");
assert.ok(nodes.some((n) => n["@type"] === "TouristDestination"));
assert.ok(nodes.some((n) => n["@type"] === "BreadcrumbList"));
assert.ok(nodes.some((n) => n["@type"] === "FAQPage"));
```

Move the two `import` lines to the top of the file with the other imports (ES module imports must be top-level).

- [ ] **Step 2: Run to verify it fails**

Run: `docker compose exec app npx tsx scripts/verify/phase-a-libs.ts`
Expected: FAIL — `Cannot find module '../../src/lib/destination-jsonld'`.

- [ ] **Step 3: Create the library**

Create `src/lib/destination-jsonld.ts`:

```ts
// JSON-LD builders for destination guide pages (/destinations/[slug]).
// Reuses SITE_URL + breadcrumb from service-jsonld to stay consistent with
// the tour/visa/service structured data already in production.
import { SITE_URL, breadcrumbJsonLd } from "@/lib/service-jsonld";

type Maybe<T> = T | null | undefined;
type Faq = { q: string; a: string };

const abs = (path: string) =>
  path.startsWith("http")
    ? path
    : `${SITE_URL}${path.startsWith("/") ? "" : "/"}${path}`;

// schema.org TouristDestination for a destination guide.
export function destinationJsonLd(args: {
  name: string;
  slug: string;
  description?: Maybe<string>;
  heroImage?: Maybe<string>;
  country?: Maybe<string>;
}) {
  const url = abs(`/destinations/${args.slug}`);
  const description =
    (args.description ?? "").trim() ||
    `${args.name} travel guide — best time to visit, top attractions, culture, and tips from Origin Tours and Travels.`;
  return {
    "@type": "TouristDestination",
    name: args.name,
    description: description.slice(0, 500),
    url,
    ...(args.heroImage ? { image: abs(args.heroImage) } : {}),
    ...(args.country
      ? { containedInPlace: { "@type": "Country", name: args.country } }
      : {}),
    touristType: "Leisure",
  };
}

// schema.org FAQPage; returns null when there are no complete Q/A pairs.
export function faqPageJsonLd(faqs: Maybe<Faq[]>) {
  const clean = (faqs ?? []).filter((f) => f?.q?.trim() && f?.a?.trim());
  if (!clean.length) return null;
  return {
    "@type": "FAQPage",
    mainEntity: clean.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

// Full @graph for a destination guide page: TouristDestination + Breadcrumb
// (+ FAQPage when FAQs exist). Ready to JSON.stringify into a ld+json script.
export function destinationGraph(args: {
  name: string;
  slug: string;
  description?: Maybe<string>;
  heroImage?: Maybe<string>;
  country?: Maybe<string>;
  faqs?: Maybe<Faq[]>;
}) {
  const nodes: object[] = [
    destinationJsonLd(args),
    breadcrumbJsonLd([
      { name: "Destinations", path: "/destinations" },
      { name: args.name, path: `/destinations/${args.slug}` },
    ]),
  ];
  const faq = faqPageJsonLd(args.faqs);
  if (faq) nodes.push(faq);
  return { "@context": "https://schema.org", "@graph": nodes };
}
```

- [ ] **Step 4: Run to verify it passes**

Run: `docker compose exec app npx tsx scripts/verify/phase-a-libs.ts`
Expected: `phase-a-libs: ALL ASSERTIONS PASSED` (exit 0).

- [ ] **Step 5: Lint**

Run: `docker compose exec app npm run lint`
Expected: no errors for `src/lib/destination-jsonld.ts`.

- [ ] **Step 6: Commit**

```bash
git add src/lib/destination-jsonld.ts scripts/verify/phase-a-libs.ts
git commit -m "feat: add destination JSON-LD builders (TouristDestination + FAQPage)"
```

---

### Task 3: Schema — extend Destination, relate Tour & BlogPost

Add rich guide fields to `Destination`, a nullable `Tour.destinationId` FK, and an implicit `BlogPost ↔ Destination` many-to-many.

**Files:**
- Modify: `prisma/schema.prisma` (`Destination` model ~L91-103, `Tour` model ~L21-47, `BlogPost` model ~L137-158)
- Create (test): `scripts/verify/phase-a-schema.ts`

**Interfaces:**
- Consumes: existing `Country`, `Tour`, `BlogPost`, `Destination` models.
- Produces (Prisma client fields later phases rely on):
  - `Destination.heroImage/gallery/overview/sections/attractions/faqs/region/bestTimeShort/metaTitle/metaDescription/featured/sortOrder`
  - `Destination.tours: Tour[]`, `Destination.blogPosts: BlogPost[]`
  - `Tour.destinationId: number | null`, `Tour.destination: Destination | null`
  - `BlogPost.destinations: Destination[]`

- [ ] **Step 1: Extend the `Destination` model**

In `prisma/schema.prisma`, replace the `Destination` model body with:

```prisma
model Destination {
  id          Int      @id @default(autoincrement())
  name        String
  slug        String   @unique
  countryId   Int
  country     Country  @relation(fields: [countryId], references: [id], onDelete: Restrict)
  description String?

  // Guide content
  heroImage     String?
  gallery       Json?
  overview      String?
  sections      Json?
  attractions   Json?
  faqs          Json?
  region        String?
  bestTimeShort String?

  // SEO + presentation
  metaTitle       String?
  metaDescription String?
  featured        Boolean @default(false)
  sortOrder       Int?

  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relationships
  tours     Tour[]
  blogPosts BlogPost[]

  @@index([countryId])
  @@index([featured])
}
```

- [ ] **Step 2: Add the FK to `Tour`**

In the `Tour` model, add these two lines just before `createdAt`:

```prisma
  destinationId     Int?
  destination       Destination?  @relation(fields: [destinationId], references: [id], onDelete: SetNull)
```

And add an index next to the existing `@@index([tourCategoryId])`:

```prisma
  @@index([destinationId])
```

- [ ] **Step 3: Add the M:N back-relation to `BlogPost`**

In the `BlogPost` model, add this line just before `createdAt`:

```prisma
  destinations    Destination[]
```

- [ ] **Step 4: Validate the schema**

Run: `docker compose exec app npx prisma validate`
Expected: `The schema at prisma/schema.prisma is valid 🚀`.

- [ ] **Step 5: Push schema and regenerate client**

Run:
```bash
docker compose exec app npx prisma db push
docker compose exec app npx prisma generate
```
Expected: `db push` reports the new columns + implicit relation table `_BlogPostToDestination` created; `generate` succeeds.

- [ ] **Step 6: Write a schema smoke-test script**

Create `scripts/verify/phase-a-schema.ts`:

```ts
// Verifies the new relations compile and round-trip. Run inside the container:
//   docker compose exec app npx tsx scripts/verify/phase-a-schema.ts
import assert from "node:assert/strict";
import { prisma } from "../../src/lib/prisma";

async function main() {
  // New Destination columns are queryable.
  const dests = await prisma.destination.findMany({
    select: { id: true, featured: true, sortOrder: true, faqs: true },
    take: 1,
  });
  assert.ok(Array.isArray(dests), "destination.findMany works");

  // Tour.destinationId + relation include compile and run.
  const tours = await prisma.tour.findMany({
    select: { id: true, destinationId: true, destination: { select: { slug: true } } },
    take: 1,
  });
  assert.ok(Array.isArray(tours), "tour.destination relation works");

  // BlogPost <-> Destination M:N include compiles and runs.
  const posts = await prisma.blogPost.findMany({
    select: { id: true, destinations: { select: { slug: true } } },
    take: 1,
  });
  assert.ok(Array.isArray(posts), "blogPost.destinations relation works");

  console.log("phase-a-schema: ALL ASSERTIONS PASSED");
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
```

- [ ] **Step 7: Run the smoke test**

Run: `docker compose exec app npx tsx scripts/verify/phase-a-schema.ts`
Expected: `phase-a-schema: ALL ASSERTIONS PASSED`.

- [ ] **Step 8: Commit**

```bash
git add prisma/schema.prisma scripts/verify/phase-a-schema.ts
git commit -m "feat: extend Destination model; relate Tour and BlogPost to Destination"
```

---

### Task 4: Backfill script — link existing tours to destinations

Create idempotent `Destination` records from distinct `Tour.country` values (only where a matching `Country` master exists) and set `Tour.destinationId`. Safe to re-run.

**Files:**
- Create: `scripts/backfill-destinations.ts`

**Interfaces:**
- Consumes: `prisma` from `../src/lib/prisma`; `Tour.country`, `Country.name`, and the new `Destination`/`Tour.destinationId` from Task 3.
- Produces: populated `Destination` rows + `Tour.destinationId` links (no return value; console summary).

- [ ] **Step 1: Write the backfill script**

Create `scripts/backfill-destinations.ts`:

```ts
// Backfill: derive Destinations from existing Tour.country values and link
// each tour to its destination. Idempotent (upsert by slug; only updates a
// tour when its destinationId would change). Skips tours whose country has no
// matching Country master and logs them, so an admin can add the Country and
// re-run safely.
//
// Run inside the app container:
//   docker compose exec app npx tsx scripts/backfill-destinations.ts
import { prisma } from "../src/lib/prisma";

function slugify(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function main() {
  const tours = await prisma.tour.findMany({
    where: { country: { not: null } },
    select: { id: true, country: true, destinationId: true },
  });

  const countries = await prisma.country.findMany({
    select: { id: true, name: true },
  });
  const countryIdByName = new Map(
    countries.map((c) => [c.name.trim().toLowerCase(), c.id]),
  );

  const destIdByCountry = new Map<string, number>(); // country name (lower) -> destination id
  let toursLinked = 0;
  const skipped: Array<{ tourId: number; country: string }> = [];

  for (const t of tours) {
    const cname = (t.country ?? "").trim();
    if (!cname) continue;
    const key = cname.toLowerCase();

    let destId = destIdByCountry.get(key);
    if (destId === undefined) {
      const countryId = countryIdByName.get(key);
      if (!countryId) {
        skipped.push({ tourId: t.id, country: cname });
        continue;
      }
      const dest = await prisma.destination.upsert({
        where: { slug: slugify(cname) },
        update: {},
        create: {
          name: cname,
          slug: slugify(cname),
          countryId,
          isActive: true,
        },
        select: { id: true },
      });
      destId = dest.id;
      destIdByCountry.set(key, destId);
    }

    if (t.destinationId !== destId) {
      await prisma.tour.update({
        where: { id: t.id },
        data: { destinationId: destId },
      });
      toursLinked++;
    }
  }

  console.log(
    `backfill-destinations: destinations touched=${destIdByCountry.size}, tours linked=${toursLinked}, skipped=${skipped.length}`,
  );
  if (skipped.length) {
    console.log("Skipped tours (no matching Country master):");
    for (const s of skipped) console.log(`  tour ${s.tourId} — "${s.country}"`);
  }
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
```

- [ ] **Step 2: Run the backfill (first pass)**

Run: `docker compose exec app npx tsx scripts/backfill-destinations.ts`
Expected: a summary line `backfill-destinations: destinations touched=N, tours linked=M, skipped=K`, plus any skipped tours listed.

- [ ] **Step 3: Verify idempotency (second pass)**

Run: `docker compose exec app npx tsx scripts/backfill-destinations.ts`
Expected: same destinations count, `tours linked=0` (nothing left to change), same skipped list.

- [ ] **Step 4: Verify links with the schema smoke test**

Run: `docker compose exec app npx tsx scripts/verify/phase-a-schema.ts`
Expected: `phase-a-schema: ALL ASSERTIONS PASSED` (relations still resolve; tours now carry `destinationId`).

- [ ] **Step 5: Lint**

Run: `docker compose exec app npm run lint`
Expected: no errors for `scripts/backfill-destinations.ts`.

- [ ] **Step 6: Commit**

```bash
git add scripts/backfill-destinations.ts
git commit -m "feat: add idempotent tour->destination backfill script"
```

---

## Phase A Self-Review

**Spec coverage (spec §4, §11):**
- §4.1 Destination rich fields → Task 3 Step 1. ✅
- §4.2 Tour.destinationId + index → Task 3 Step 2. ✅
- §4.3 BlogPost ↔ Destination M:N → Task 3 Step 3. ✅
- §4.4 Resource taxonomy lib → Task 1. ✅
- §9 destination JSON-LD lib → Task 2. ✅
- §11 idempotent, logged backfill; no rows deleted; new columns nullable → Task 4. ✅
- Domestic/International derivation needs `Tour.destination.country` — enabled by Task 3; consumed in Phase B (nav) / Phase C. ✅
- `nav-data.ts` (spec §6.1) is intentionally deferred to **Phase B**, where it is consumed. Noted, not a gap.

**Placeholder scan:** no TBD/TODO; every code step shows complete code; every verify step has an exact command + expected output. ✅

**Type consistency:** `destinationGraph`/`destinationJsonLd`/`faqPageJsonLd` signatures match between the assertion script (Task 2 Step 1) and the implementation (Task 2 Step 3). `RESOURCE_CATEGORIES`/`isResourceCategory` match between Task 1 Steps 1 and 3. Schema field names in Task 3 match the smoke-test selects in Task 3 Step 6 and the backfill in Task 4. ✅

---

## What Phase A does NOT include (handled by later phase plans)

- **Phase B:** navigation redesign, mega-menus, `getNavMenuData()`, "Get a Free Quote" CTA.
- **Phase C:** public `/destinations` + `/destinations/[slug]` pages, public destination APIs, admin Destinations CRUD.
- **Phase D:** Blog→Travel Resources + Flights/Hotels folder renames, `next.config.ts` 301 redirects, sitemap updates.
- **Phase E:** `<RelatedTours>` / `<RelatedResources>` / `<RelatedVisa>` / `<RelatedDestination>` internal-linking components.
- **Phase F:** admin sidebar relabels, Tour destination selector, Travel-Resources destinations multi-select.
