import type { MetadataRoute } from "next";
import { prisma } from "@/core/lib/prisma";
import { publishedBlogWhere } from "@/modules/blog/blog";

// Generate at request time so tour/visa/attestation/blog detail URLs from the DB
// are always included. (A build-time static sitemap can miss them if the DB is
// unreachable during the build, falling back to static routes only.)
export const dynamic = "force-dynamic";

const SITE_URL = "https://origintoursandtravels.com";

const STATIC_ROUTES: { path: string; changeFrequency: "daily" | "weekly" | "monthly"; priority: number }[] = [
  { path: "/", changeFrequency: "weekly", priority: 1.0 },
  { path: "/umrah", changeFrequency: "weekly", priority: 0.9 },
  { path: "/hajj", changeFrequency: "weekly", priority: 0.9 },
  { path: "/destinations", changeFrequency: "weekly", priority: 0.9 },
  { path: "/flights", changeFrequency: "weekly", priority: 0.9 },
  { path: "/tours", changeFrequency: "weekly", priority: 0.9 },
  { path: "/visas", changeFrequency: "weekly", priority: 0.9 },
  { path: "/attestations", changeFrequency: "weekly", priority: 0.8 },
  { path: "/travel-resources", changeFrequency: "weekly", priority: 0.9 },
  { path: "/hotels", changeFrequency: "weekly", priority: 0.8 },
  { path: "/transport", changeFrequency: "weekly", priority: 0.8 },
  { path: "/about", changeFrequency: "monthly", priority: 0.5 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.5 },
  { path: "/privacy", changeFrequency: "monthly", priority: 0.3 },
  { path: "/terms", changeFrequency: "monthly", priority: 0.3 },
  { path: "/refund", changeFrequency: "monthly", priority: 0.3 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  let tours: { slug: string; updatedAt: Date }[] = [];
  let visas: { slug: string; updatedAt: Date }[] = [];
  let attestations: { slug: string; updatedAt: Date }[] = [];
  let blogPosts: { slug: string; updatedAt: Date }[] = [];
  let destinations: { slug: string; updatedAt: Date }[] = [];

  try {
    [tours, visas, attestations, blogPosts, destinations] = await Promise.all([
      prisma.tour.findMany({
        where: { isActive: true },
        select: { slug: true, updatedAt: true },
      }),
      prisma.visa.findMany({
        where: { isActive: true },
        select: { slug: true, updatedAt: true },
      }),
      prisma.attestation.findMany({
        where: { isActive: true },
        select: { slug: true, updatedAt: true },
      }),
      prisma.blogPost.findMany({
        // Exclude drafts and future-scheduled posts from the sitemap.
        where: publishedBlogWhere(),
        select: { slug: true, updatedAt: true },
      }),
      prisma.destination.findMany({
        where: { isActive: true },
        select: { slug: true, updatedAt: true },
      }),
    ]);
  } catch {
    // DB unavailable at build/runtime — fall back to static routes only.
  }

  return [
    ...STATIC_ROUTES.map((r) => ({
      url: `${SITE_URL}${r.path}`,
      lastModified: now,
      changeFrequency: r.changeFrequency,
      priority: r.priority,
    })),
    ...tours.map((t) => ({
      url: `${SITE_URL}/tours/${t.slug}`,
      lastModified: t.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...visas.map((v) => ({
      url: `${SITE_URL}/visas/${v.slug}`,
      lastModified: v.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...attestations.map((a) => ({
      url: `${SITE_URL}/attestations/${a.slug}`,
      lastModified: a.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...blogPosts.map((b) => ({
      url: `${SITE_URL}/travel-resources/${b.slug}`,
      lastModified: b.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...destinations.map((d) => ({
      url: `${SITE_URL}/destinations/${d.slug}`,
      lastModified: d.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
