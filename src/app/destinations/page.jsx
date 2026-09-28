import { prisma } from "@/core/lib/prisma";
import DestinationsClient from "./DestinationsClient";
import { breadcrumbJsonLd } from "@/lib/service-jsonld";

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
      "Travel Destinations – Guides & Inspiration | Origin Tours and Travels",
  },
  description:
    "Explore in-depth destination guides — best time to visit, top attractions, culture, cuisine and travel tips for Dubai, Bali, Thailand and more, from Hyderabad's trusted travel agency.",
  alternates: { canonical: "/destinations" },
  openGraph: {
    title: "Travel Destinations | Origin Tours and Travels",
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
