type CategoryNode = { name?: string | null; slug?: string | null };

export type TourLike = {
    title?: string | null;
    tourCategories?: { nodes?: CategoryNode[] };
};

type RoomPrice = { roomType?: string; price?: string | number };
type PackageItem = { packageTitle?: string; hotelName?: string; roomPrices?: RoomPrice[] };

export function isUmrahTour(tour: TourLike | null | undefined): boolean {
    const cats = tour?.tourCategories?.nodes ?? [];
    if (
        cats.some((c) =>
            c?.slug === "umrah-packages" ||
            c?.slug === "umrah" ||
            (c?.name ?? "").toLowerCase().includes("umrah"),
        )
    ) {
        return true;
    }
    // Fallback: admins often create Umrah packages without assigning a
    // category — without this, those tours vanish from the Umrah page and
    // homepage Umrah section and show up under regular tours instead.
    return (tour?.title ?? "").toLowerCase().includes("umrah");
}

// Visa/attestation `fee` is a free-text, human-readable string
// ("AED 370 (~₹8,500)", "Free (included in package)", "$25 (varies by nationality)").
// Display it as-is — never strip the non-digits, which used to concatenate every
// digit into a nonsense number (e.g. "AED 370 (~₹8,500)" → "₹3708500"). Only when the
// value is a bare number do we format it as INR.
export function formatVisaFee(raw: string | number | null | undefined): string {
    if (raw === null || raw === undefined) return "Ask";
    const value = String(raw).trim();
    if (!value) return "Ask";
    // Already carries a currency token or descriptive word — show verbatim.
    if (/[₹$€£]|aed|free|var|incl|ask|tbd|usd|inr/i.test(value)) return value;
    const num = parseFloat(value.replace(/[^0-9.]/g, ""));
    return Number.isFinite(num) && num > 0 ? `₹${num.toLocaleString("en-IN")}` : value;
}

// Compact fee for cards (the "Starting From" badge has room for one short value,
// not a full sentence). Prefers the INR (₹) amount when the string carries both an
// AED/USD and an INR figure — that's the number Indian customers care about.
export function formatVisaFeeShort(raw: string | number | null | undefined): string {
    if (raw === null || raw === undefined) return "Ask";
    const value = String(raw).trim();
    if (!value) return "Ask";
    if (/free/i.test(value)) return "Free";
    const inr = value.match(/₹\s?[\d,]+(?:\.\d+)?/);
    if (inr) return inr[0].replace(/\s/g, "");
    const token = value.match(/(?:\$|€|£|usd|aed|inr)\s?[\d,]+(?:\.\d+)?/i);
    if (token) return token[0].trim();
    const num = parseFloat(value.replace(/[^0-9.]/g, ""));
    return Number.isFinite(num) && num > 0 ? `₹${num.toLocaleString("en-IN")}` : value;
}

export function startingPriceFromPackages(packages: PackageItem[] | null | undefined): string | null {
    if (!packages || packages.length === 0) return null;
    const values: number[] = [];
    for (const pkg of packages) {
        for (const rp of pkg.roomPrices ?? []) {
            const n = parseFloat(String(rp.price ?? "").replace(/[^0-9.]/g, ""));
            if (Number.isFinite(n) && n > 0) values.push(n);
        }
    }
    return values.length > 0 ? String(Math.min(...values)) : null;
}

type RawTour = {
    id: number;
    featured: boolean;
    slug: string;
    title: string;
    price: string | null;
    originalPrice: string | null;
    rating: number | null;
    reviewsCount: number | null;
    duration: string | null;
    country: string | null;
    images: unknown;
    features: unknown;
    mealTypes: unknown;
    packages: unknown;
    tourCategory: { name: string; slug: string } | null;
};

export function normaliseTour(t: RawTour) {
    const images = (t.images as string[] | null) ?? [];
    const features = (t.features as string[] | null) ?? [];
    const mealTypes = (t.mealTypes as string[] | null) ?? [];
    const packages = (t.packages as PackageItem[] | null) ?? [];
    const price = t.price && t.price.trim() ? t.price : startingPriceFromPackages(packages);
    const category = t.tourCategory
        ? [{ name: t.tourCategory.name, slug: t.tourCategory.slug }]
        : [];
    return {
        id: String(t.id),
        featured: t.featured,
        slug: t.slug,
        title: t.title,
        featuredImage: images[0]
            ? { node: { sourceUrl: images[0], srcSet: null } }
            : null,
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

type RawVisa = {
    id: number;
    featured: boolean;
    slug: string;
    country: string;
    type: string | null;
    fee: string | null;
    originalFee: string | null;
    rating: number | null;
    reviewsCount: number | null;
    processingTime: string | null;
    validityDuration: string | null;
    images: unknown;
};

export function normaliseVisa(v: RawVisa) {
    const images = (v.images as string[] | null) ?? [];
    return {
        id: String(v.id),
        featured: v.featured,
        slug: v.slug,
        title: `${v.country}${v.type ? ` – ${v.type}` : ""} Visa`,
        featuredImage: images[0]
            ? { node: { sourceUrl: images[0], srcSet: null } }
            : null,
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

type RawAttestation = {
    id: number;
    featured: boolean;
    slug: string;
    type: string;
    country: string | null;
    fee: string | null;
    originalFee: string | null;
    rating: number | null;
    reviewsCount: number | null;
    images: unknown;
};

export function normaliseAttestation(a: RawAttestation) {
    const images = (a.images as string[] | null) ?? [];
    return {
        id: String(a.id),
        featured: a.featured,
        slug: a.slug,
        title: `${a.type}${a.country ? ` – ${a.country}` : ""}`,
        featuredImage: images[0]
            ? { node: { sourceUrl: images[0], srcSet: null } }
            : null,
        attestations: {
            price: a.fee,
            originalFee: a.originalFee,
            rating: a.rating,
            reviewsCount: a.reviewsCount,
        },
        countries: { nodes: a.country ? [{ name: a.country }] : [] },
    };
}
