# Cross-sell: "You may also like" related services

**Date:** 2026-07-15
**Status:** Approved

## Goal

On each service detail page, show 3–4 related items of the same service type,
matched by relevance, with a graceful fallback to the latest other active items.
Server-rendered (SEO-friendly, no client fetch). No schema changes, no new API
routes, no admin changes.

## Matching rules

| Page        | Primary match                                             | Fallback              |
|-------------|----------------------------------------------------------|-----------------------|
| Tour        | same `tourCategoryId`, else same `destinationId`/`country` | latest active tours   |
| Visa        | same `country`, else same `type`                         | latest active visas   |
| Attestation | same `type`, else same `country`                         | latest active attestations |
| Umrah       | other Umrah tours (via existing `isUmrahTour` filter)     | latest Umrah tours    |

Rules for all: exclude the current item, `isActive: true` only, top up to a max
of 4 results using the fallback query when the primary query returns fewer.

## Components

### `src/lib/public-card.ts` (new — DRY extraction)
Extract the existing inline row→card normalisers out of the public list routes
(`api/public/{tours,visas,attestations}/route.ts`) into shared functions:
`normaliseTourCard`, `normaliseVisaCard`, `normaliseAttestationCard`. Each returns
the exact shape `ServiceCard` consumes. The list routes import these afterwards
and keep behaving identically.

### `src/lib/related.ts` (new)
Server-side helpers: `getRelatedTours(tour)`, `getRelatedVisas(visa)`,
`getRelatedAttestations(attestation)`. Each:
1. Runs the primary Prisma query (matching rule above), excluding current id.
2. If fewer than 4 rows, tops up with the fallback query (latest active, excluding
   current id and already-selected ids).
3. Maps rows through the matching `normalise*Card` helper.
Returns an array (possibly empty).

### `src/components/RelatedServices.jsx` (new, "use client")
Props: `items`, `type`. Renders nothing when `items` is empty. Otherwise a
"You may also like" heading + a responsive MUI grid of `<ServiceCard item type>`
matching the listing-page layout. Rendered near the bottom of each detail client,
before `MobileStickyCTA`.

## Wiring

Each detail `page.jsx` already loads the item via Prisma. Add one
`await getRelated…()` call and pass `related` as a prop into the detail client
(`TourDetailClient`, `UmrahTourDetailClient`, `VisaDetailClient`,
`AttestationDetailClient`), which render `<RelatedServices items={related} type="…" />`.

## Out of scope
- Schema changes / admin-picked manual links.
- Complementary cross-type suggestions (visa on a tour page). Same-category only.
- New API routes.
