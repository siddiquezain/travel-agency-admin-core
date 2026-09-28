// Shared normalizers that map Prisma rows to the WordPress-shaped objects the
// public detail clients (TourDetailClient / VisaDetailClient / AttestationDetailClient)
// expect. Used by BOTH the /api/public/*/[slug] routes and the server pages, so the
// detail content can be server-rendered (passed as initialData) instead of being
// fetched client-side in a useEffect (which left a skeleton on first paint).

/* eslint-disable @typescript-eslint/no-explicit-any */

// Builds a visa title from country + type without the "… Visa Visa" duplication.
// Many `type` values already contain "Visa" (e.g. "Tourist Visa (Express)"), so we
// only append " Visa" when the composed name doesn't already include the word.
// Also collapses the double spaces that trailing-space `type` values produced.
export function buildVisaTitle(country?: string | null, type?: string | null): string {
  const base = `${country ?? ""}${type ? ` – ${type}` : ""}`
    .replace(/\s+/g, " ")
    .trim();
  return /\bvisa\b/i.test(base) ? base : `${base} Visa`;
}

export function normaliseTourDetail(tour: any) {
  const images = (tour.images as string[] | null) ?? [];
  const itinerary = (tour.itinerary as Record<string, unknown>[] | null) ?? [];
  const packages =
    (tour.packages as {
      packageTitle?: string;
      hotelName?: string;
      roomPrices?: { roomType?: string; price?: string | number }[];
    }[] | null) ?? [];
  const features = (tour.features as string[] | null) ?? [];
  const mealTypes = (tour.mealTypes as string[] | null) ?? [];
  const inclusions = (tour.inclusions as Record<string, unknown>[] | null) ?? [];
  const exclusions = (tour.exclusions as Record<string, unknown>[] | null) ?? [];
  const datesAvailability =
    (tour.datesAvailability as Record<string, unknown>[] | null) ?? [];
  const gallery = (tour.gallery as string[] | null) ?? [];

  let resolvedPrice: string | null =
    tour.price && tour.price.trim() ? tour.price : null;
  if (!resolvedPrice && packages.length > 0) {
    const values: number[] = [];
    for (const pkg of packages) {
      for (const rp of pkg.roomPrices ?? []) {
        const n = parseFloat(String(rp.price ?? "").replace(/[^0-9.]/g, ""));
        if (Number.isFinite(n) && n > 0) values.push(n);
      }
    }
    if (values.length > 0) resolvedPrice = String(Math.min(...values));
  }

  return {
    id: String(tour.id),
    slug: tour.slug,
    title: tour.title,
    content: tour.description ?? "",
    featuredImage: images[0]
      ? { node: { sourceUrl: images[0], srcSet: null } }
      : null,
    seo: null,
    tourDetails: {
      price: resolvedPrice,
      durationDaysNights: tour.duration,
      hotelName: tour.hotelName ?? null,
      features,
      mealTypes,
      holidayCountry: { nodes: tour.country ? [{ name: tour.country }] : [] },
      packages,
      itinerary,
      datesAvailability,
      inclusions,
      exclusions,
      gallery: {
        nodes: (gallery.length > 0 ? gallery : images.slice(1)).map((url) => ({
          sourceUrl: url,
        })),
      },
      startAndEndDate: null,
      visatyp: [],
    },
    tourCategories: {
      nodes: tour.tourCategory
        ? [{ name: tour.tourCategory.name, slug: tour.tourCategory.slug }]
        : [],
    },
  };
}

export function normaliseVisaDetail(visa: any) {
  const requirements =
    (visa.requirements as Record<string, unknown>[] | null) ?? [];
  const images = (visa.images as string[] | null) ?? [];

  return {
    id: String(visa.id),
    slug: visa.slug,
    title: buildVisaTitle(visa.country, visa.type),
    content: visa.description ?? "",
    featuredImage: images[0]
      ? { node: { sourceUrl: images[0], srcSet: null } }
      : null,
    seo: null,
    visaDetails: {
      fees: visa.fee,
      processingTime: visa.processingTime ?? "Variable",
      validityDuration: visa.validityDuration ?? "Standard",
      requiredDocuments: requirements,
      visaImage: null,
    },
    countries: { nodes: [{ name: visa.country, countryFlag: null }] },
    visasType: { nodes: visa.type ? [{ name: visa.type }] : [] },
  };
}

export function normaliseAttestationDetail(attestation: any) {
  const images = (attestation.images as string[] | null) ?? [];

  return {
    id: String(attestation.id),
    slug: attestation.slug,
    title: `${attestation.type}${attestation.country ? ` – ${attestation.country}` : ""}`,
    content: attestation.description ?? "",
    featuredImage: images[0]
      ? { node: { sourceUrl: images[0], srcSet: null } }
      : null,
    seo: null,
    attestations: { price: attestation.fee },
    countries: {
      nodes: attestation.country
        ? [{ name: attestation.country, countryFlag: null }]
        : [],
    },
  };
}
