/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "@/core/lib/prisma";
import {
  normaliseTourCard,
  normaliseVisaCard,
  normaliseAttestationCard,
} from "@/lib/public-card";

const LIMIT = 4;

/**
 * Prisma `where` fragment matching Umrah tours the same way `isUmrahTour`
 * detects them: an Umrah category slug/name, or "umrah" in the title.
 */
const umrahWhere = {
  OR: [
    { tourCategory: { slug: { in: ["umrah-packages", "umrah"] } } },
    { tourCategory: { is: { name: { contains: "umrah", mode: "insensitive" as const } } } },
    { title: { contains: "umrah", mode: "insensitive" as const } },
  ],
};

/**
 * Run a primary query, then top up with a fallback query until `LIMIT` rows,
 * never repeating an id already selected. Returns the combined rows.
 */
async function withFallback<T extends { id: number }>(
  primary: T[],
  fallbackQuery: (excludeIds: number[]) => Promise<T[]>,
): Promise<T[]> {
  if (primary.length >= LIMIT) return primary.slice(0, LIMIT);
  const have = primary.map((r) => r.id);
  const extra = await fallbackQuery(have);
  return [...primary, ...extra].slice(0, LIMIT);
}

export async function getRelatedTours(tour: {
  id: number;
  tourCategoryId?: number | null;
  destinationId?: number | null;
  country?: string | null;
}) {
  const base = { isActive: true, id: { not: tour.id }, NOT: umrahWhere };

  const orMatches: any[] = [];
  if (tour.tourCategoryId) orMatches.push({ tourCategoryId: tour.tourCategoryId });
  if (tour.destinationId) orMatches.push({ destinationId: tour.destinationId });
  if (tour.country) orMatches.push({ country: tour.country });

  const primary = orMatches.length
    ? await prisma.tour.findMany({
        where: { ...base, OR: orMatches },
        orderBy: { createdAt: "desc" },
        take: LIMIT,
        include: { tourCategory: true },
      })
    : [];

  const rows = await withFallback(primary, (excludeIds) =>
    prisma.tour.findMany({
      where: { ...base, id: { notIn: [tour.id, ...excludeIds] } },
      orderBy: { createdAt: "desc" },
      take: LIMIT - primary.length,
      include: { tourCategory: true },
    }),
  );

  return rows.map(normaliseTourCard);
}

export async function getRelatedUmrahTours(tour: { id: number }) {
  const base = { isActive: true, id: { not: tour.id }, ...umrahWhere };
  const rows = await prisma.tour.findMany({
    where: base,
    orderBy: { createdAt: "desc" },
    take: LIMIT,
    include: { tourCategory: true },
  });
  return rows.map(normaliseTourCard);
}

export async function getRelatedVisas(visa: {
  id: number;
  country?: string | null;
  type?: string | null;
}) {
  const base = { isActive: true, id: { not: visa.id } };

  const orMatches: any[] = [];
  if (visa.country) orMatches.push({ country: visa.country });
  if (visa.type) orMatches.push({ type: visa.type });

  const primary = orMatches.length
    ? await prisma.visa.findMany({
        where: { ...base, OR: orMatches },
        orderBy: { createdAt: "desc" },
        take: LIMIT,
      })
    : [];

  const rows = await withFallback(primary, (excludeIds) =>
    prisma.visa.findMany({
      where: { ...base, id: { notIn: [visa.id, ...excludeIds] } },
      orderBy: { createdAt: "desc" },
      take: LIMIT - primary.length,
    }),
  );

  return rows.map(normaliseVisaCard);
}

export async function getRelatedAttestations(attestation: {
  id: number;
  type?: string | null;
  country?: string | null;
}) {
  const base = { isActive: true, id: { not: attestation.id } };

  const orMatches: any[] = [];
  if (attestation.type) orMatches.push({ type: attestation.type });
  if (attestation.country) orMatches.push({ country: attestation.country });

  const primary = orMatches.length
    ? await prisma.attestation.findMany({
        where: { ...base, OR: orMatches },
        orderBy: { createdAt: "desc" },
        take: LIMIT,
      })
    : [];

  const rows = await withFallback(primary, (excludeIds) =>
    prisma.attestation.findMany({
      where: { ...base, id: { notIn: [attestation.id, ...excludeIds] } },
      orderBy: { createdAt: "desc" },
      take: LIMIT - primary.length,
    }),
  );

  return rows.map(normaliseAttestationCard);
}
