import { prisma } from "@/core/lib/prisma";
import DestinationsClient from "./DestinationsClient";
import { breadcrumbJsonLd } from "@/lib/service-jsonld";
import { agency } from "@/config/agency";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    breadcrumbJsonLd([{ name: "Destinations", path: "/destinations" }]),
  ],
};

export const dynamic = "force-dynamic";

export const metadata = {
  title: {
    absolute:
      `Travel Destinations – Guides & Inspiration | ${agency.name}`,
  },
  description:
    "Explore in-depth destination guides — best time to visit, top attractions, culture, cuisine and travel tips for Dubai, Bali, Thailand and more.",
  alternates: { canonical: "/destinations" },
  openGraph: {
    title: `Travel Destinations | ${agency.name}`,
    description:
      "In-depth destination guides — best time to visit, attractions, culture and tips.",
    url: "/destinations",
    type: "website",
  },
};

async function loadDestinations() {
  try {
    const rows = await prisma.destination.findMany({
      where: { isActive: true },
      orderBy: [{ featured: "desc" }, { sortOrder: "asc" }, { name: "asc" }],
      select: {
        id: true,
        slug: true,
        name: true,
        description: true,
        heroImage: true,
        region: true,
        bestTimeShort: true,
        featured: true,
        country: { select: { name: true } },
      },
    });
    return rows;
  } catch {
    return [];
  }
}

export default async function DestinationsPage() {
  const destinations = await loadDestinations();
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <DestinationsClient initialDestinations={destinations} />
    </>
  );
}
