/* eslint-disable @typescript-eslint/no-explicit-any */
import { startingPriceFromPackages } from "@/lib/tour-utils";

/**
 * Row → ServiceCard shape normalisers, shared by the public list API routes
 * (`/api/public/*`) and the related-services helpers (`src/lib/related.ts`).
 * Keeping them in one place means the "You may also like" cards render
 * identically to the listing pages.
 */

export function normaliseTourCard(t: any) {
  const images = (t.images as string[] | null) ?? [];
  const features = (t.features as string[] | null) ?? [];
  const mealTypes = (t.mealTypes as string[] | null) ?? [];
  const packages = (t.packages as any[] | null) ?? [];
  const price = t.price && t.price.trim() ? t.price : startingPriceFromPackages(packages);
  const category = t.tourCategory
    ? [{ name: t.tourCategory.name, slug: t.tourCategory.slug }]
    : [];
  return {
    id: String(t.id),
    slug: t.slug,
    title: t.title,
    featuredImage: images[0] ? { node: { sourceUrl: images[0], srcSet: null } } : null,
    tourDetails: {
      price,
      originalPrice: t.originalPrice,
      rating: t.rating,
      reviewsCount: t.reviewsCount,
      durationDaysNights: t.duration,
      features,
      mealTypes,
      holidayCountry: { nodes: t.country ? [{ name: t.country }] : [] },
    },
    tourCategories: { nodes: category },
  };
}

export function normaliseVisaCard(v: any) {
  const images = (v.images as string[] | null) ?? [];
  return {
    id: String(v.id),
    slug: v.slug,
    title: `${v.country}${v.type ? ` – ${v.type}` : ""} Visa`,
    featuredImage: images[0] ? { node: { sourceUrl: images[0], srcSet: null } } : null,
    visaDetails: {
      fees: v.fee,
      originalFee: v.originalFee,
      rating: v.rating,
      reviewsCount: v.reviewsCount,
      processingTime: v.processingTime ?? "Variable",
      validityDuration: v.validityDuration ?? "Standard",
    },
    countries: { nodes: [{ name: v.country, countryFlag: null }] },
    visasType: { nodes: v.type ? [{ name: v.type }] : [] },
  };
}

export function normaliseAttestationCard(a: any) {
  const images = (a.images as string[] | null) ?? [];
  return {
    id: String(a.id),
    slug: a.slug,
    title: `${a.type}${a.country ? ` – ${a.country}` : ""}`,
    featuredImage: images[0] ? { node: { sourceUrl: images[0], srcSet: null } } : null,
    attestations: {
      price: a.fee,
      originalFee: a.originalFee,
      rating: a.rating,
      reviewsCount: a.reviewsCount,
    },
    countries: { nodes: a.country ? [{ name: a.country }] : [] },
  };
}
