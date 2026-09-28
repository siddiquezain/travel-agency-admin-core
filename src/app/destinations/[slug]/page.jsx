import { notFound } from "next/navigation";
import { prisma } from "@/core/lib/prisma";
import DestinationGuideClient from "./DestinationGuideClient";
import { destinationGraph } from "@/modules/destinations/destination-jsonld";

const SITE_URL = "https://origintoursandtravels.com";

// Per-request so a newly-activated destination guide is live immediately.
export const dynamic = "force-dynamic";

async function loadDestination(slug) {
  try {
    return await prisma.destination.findFirst({
      where: { slug, isActive: true },
      include: {
        country: { select: { name: true, code: true } },
        tours: {
          where: { isActive: true },
          select: { id: true, slug: true, title: true, price: true, duration: true, images: true, features: true },
          orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
          take: 4,
        },
        blogPosts: {
          where: { isActive: true, publishedAt: { lte: new Date() } },
          select: { id: true, slug: true, title: true, excerpt: true, featuredImage: true, category: true },
          orderBy: { publishedAt: "desc" },
          take: 4,
        },
      },
    });
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const dest = await loadDestination(slug);

  if (!dest) {
    return {
      title: "Destination Not Found",
      robots: { index: false, follow: false },
    };
  }

  const title = dest.metaTitle || `${dest.name} Travel Guide`;
  const description =
    dest.metaDescription ||
    dest.description ||
    `Plan your trip to ${dest.name}: best time to visit, top attractions, culture, cuisine and travel tips from Origin Tours and Travels.`;
  const canonical = `/destinations/${dest.slug}`;
  const image = dest.heroImage || "/og-default.jpg";

  return {
    title,
    description: description.slice(0, 160),
    alternates: { canonical },
    openGraph: {
      title,
      description: description.slice(0, 160),
      url: canonical,
      type: "article",
      images: [{ url: image }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: description.slice(0, 160),
      images: [image],
    },
  };
}

export default async function DestinationGuidePage({ params }) {
  const { slug } = await params;
  const dest = await loadDestination(slug);

  if (!dest) notFound();

  // Visas are matched by country name (Visa.country is a plain string field).
  const relatedVisas = dest.country?.name
    ? await prisma.visa.findMany({
        where: { isActive: true, country: { contains: dest.country.name, mode: "insensitive" } },
        select: { id: true, slug: true, type: true, fee: true, processingTime: true },
        take: 3,
      })
    : [];

  // Note: FAQ structured data is emitted by <FaqAccordion> in the client
  // (single source of truth), so we intentionally do NOT pass `faqs` here —
  // that avoids duplicate FAQPage JSON-LD on the page.
  const jsonLd = destinationGraph({
    name: dest.name,
    slug: dest.slug,
    description: dest.metaDescription || dest.description,
    heroImage: dest.heroImage,
    country: dest.country?.name,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <DestinationGuideClient
        destination={dest}
        relatedVisas={relatedVisas}
        canonical={`${SITE_URL}/destinations/${dest.slug}`}
      />
    </>
  );
}
