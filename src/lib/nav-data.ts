import { prisma } from "@/lib/prisma";
import { RESOURCE_CATEGORIES } from "@/lib/travel-resources";

// Data source for the header mega-menus. Fetched once per request in the root
// layout (server) and passed into the client Header. Falls back to empty lists
// if the DB is unavailable (mirrors sitemap.ts), so the nav never hard-fails.

export type MenuLink = { name: string; href: string };
export type MenuColumn = { title: string; href?: string; links: MenuLink[] };

export type NavMenuData = {
  // Destinations mega-menu: destinations grouped by region → guide pages.
  destinationsByRegion: MenuColumn[];
  // Tours mega-menu: destination-scoped tour searches, split by scope.
  toursInternational: MenuLink[];
  toursDomestic: MenuLink[];
  // Travel Resources mega-menu: the 17 resource categories.
  resourceCategories: MenuLink[];
};

const MAX_PER_COLUMN = 12;

// The Tours mega-menu shows 6 rows per column (the rest scroll). When the
// destinations table has fewer entries than that, top the columns up with
// well-known places so each column always has a full, scrollable list.
const FALLBACK_INTERNATIONAL = [
  "Dubai", "Azerbaijan", "Uzbekistan", "Istanbul", "Bali", "Bangkok",
  "Singapore", "Maldives", "Baku", "Cairo", "Kuala Lumpur", "Tbilisi",
];
const FALLBACK_DOMESTIC = [
  "Goa", "Kashmir", "Kerala", "Jaipur", "Manali", "Andaman",
  "Agra", "Mumbai", "Ooty", "Darjeeling",
];

// Always shown first in the International Tours column, in this order;
// the remaining destinations keep their usual order after them.
const PRIORITY_INTERNATIONAL = ["dubai", "azerbaijan", "uzbekistan"];

// Umrah destinations link to the Umrah packages page instead of a tour
// search — Umrah tours are excluded from the /tours listing.
const UMRAH_DESTINATIONS = new Set(["makkah", "mecca", "madinah", "medina"]);

const toTourLink = (name: string): MenuLink => ({
  name,
  href: UMRAH_DESTINATIONS.has(name.trim().toLowerCase())
    ? "/umrah"
    : `/tours?q=${encodeURIComponent(name)}`,
});

function padTourLinks(links: MenuLink[], fallbacks: string[]): MenuLink[] {
  const seen = new Set(links.map((l) => l.name.trim().toLowerCase()));
  for (const name of fallbacks) {
    if (links.length >= MAX_PER_COLUMN) break;
    const key = name.toLowerCase();
    if (!seen.has(key)) {
      links.push(toTourLink(name));
      seen.add(key);
    }
  }
  return links;
}

export async function getNavMenuData(): Promise<NavMenuData> {
  let destinations: {
    slug: string;
    name: string;
    region: string | null;
    country: { name: string } | null;
  }[] = [];

  try {
    destinations = await prisma.destination.findMany({
      where: { isActive: true },
      orderBy: [{ featured: "desc" }, { sortOrder: "asc" }, { name: "asc" }],
      select: {
        slug: true,
        name: true,
        region: true,
        country: { select: { name: true } },
      },
    });
  } catch {
    destinations = [];
  }

  const isDomestic = (d: (typeof destinations)[number]) =>
    d.country?.name?.trim().toLowerCase() === "india";

  // Tours menu items deep-link to a destination-scoped tour search (?q=<name>),
  // which the tours listing prefills — so tour titles containing the place show.
  const toursDomestic: MenuLink[] = padTourLinks(
    destinations
      .filter(isDomestic)
      .slice(0, MAX_PER_COLUMN)
      .map((d) => toTourLink(d.name)),
    FALLBACK_DOMESTIC,
  );

  const toursInternational: MenuLink[] = padTourLinks(
    destinations
      .filter((d) => !isDomestic(d))
      .slice(0, MAX_PER_COLUMN)
      .map((d) => toTourLink(d.name)),
    FALLBACK_INTERNATIONAL,
  );

  // Pin the priority destinations to the top (stable sort keeps the rest
  // in their existing order).
  const priorityRank = (l: MenuLink) => {
    const i = PRIORITY_INTERNATIONAL.indexOf(l.name.trim().toLowerCase());
    return i === -1 ? PRIORITY_INTERNATIONAL.length : i;
  };
  toursInternational.sort((a, b) => priorityRank(a) - priorityRank(b));

  // Destinations menu items link to the guide pages, grouped by region
  // (falling back to country name when no region is set).
  const regionMap = new Map<string, MenuLink[]>();
  for (const d of destinations) {
    const key = d.region?.trim() || d.country?.name?.trim() || "Other";
    if (!regionMap.has(key)) regionMap.set(key, []);
    const bucket = regionMap.get(key)!;
    if (bucket.length < MAX_PER_COLUMN) {
      bucket.push({ name: d.name, href: `/destinations/${d.slug}` });
    }
  }
  const destinationsByRegion: MenuColumn[] = Array.from(regionMap.entries())
    .slice(0, 4)
    .map(([title, links]) => ({ title, links }));

  const resourceCategories: MenuLink[] = RESOURCE_CATEGORIES.map((c) => ({
    name: c,
    href: `/travel-resources?category=${encodeURIComponent(c)}`,
  }));

  return {
    destinationsByRegion,
    toursInternational,
    toursDomestic,
    resourceCategories,
  };
}
