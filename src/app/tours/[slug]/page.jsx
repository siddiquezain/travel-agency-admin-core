import { notFound } from "next/navigation";
import { prisma } from "@/core/lib/prisma";
import TourDetailClient from "./TourDetailClient";
import UmrahTourDetailClient from "./UmrahTourDetailClient";
import { touristTripJsonLd, breadcrumbJsonLd } from "@/lib/service-jsonld";
import { normaliseTourDetail } from "@/lib/public-detail";
import { isUmrahTour } from "@/modules/tours/tour-utils";
import { getRelatedTours, getRelatedUmrahTours } from "@/lib/related";
import { agency } from "@/config/agency";

export const revalidate = 300;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const tour = await prisma.tour.findFirst({
    where: { slug, isActive: true },
    select: { title: true, description: true, slug: true, images: true },
  });

  if (!tour) {
    return {
      title: "Tour Not Found",
      robots: { index: false, follow: false },
    };
  }

  const description =
    (tour.description ?? "").slice(0, 160) ||
    `Book ${tour.title} with ${agency.name} — your trusted travel partner.`;
  const images = Array.isArray(tour.images) ? tour.images : [];
  const image = typeof images[0] === "string" ? images[0] : "/og-default.jpg";
  const canonical = `/tours/${tour.slug}`;

  return {
    title: tour.title,
    description,
    alternates: { canonical },
    openGraph: {
      title: `${tour.title} | ${agency.name}`,
      description,
      url: canonical,
      type: "article",
      images: [{ url: image }],
    },
    twitter: {
      card: "summary_large_image",
      title: tour.title,
      description,
      images: [image],
    },
  };
}

export default async function TourDetailPage({ params }) {
  const { slug } = await params;
  const tour = await prisma.tour.findFirst({
    where: { slug, isActive: true },
    include: { tourCategory: true },
  });

  if (!tour) notFound();

  const initialData = normaliseTourDetail(tour);
  const umrah = isUmrahTour(initialData);
  const related = umrah
    ? await getRelatedUmrahTours({ id: tour.id })
    : await getRelatedTours({
        id: tour.id,
        tourCategoryId: tour.tourCategoryId,
        destinationId: tour.destinationId,
        country: tour.country,
      });

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      touristTripJsonLd({
        name: tour.title,
        description: tour.description,
        price: tour.price,
        packages: tour.packages,
        images: tour.images,
        path: `/tours/${tour.slug}`,
      }),
      breadcrumbJsonLd([
        { name: "Holiday Packages", path: "/tours" },
        { name: tour.title, path: `/tours/${tour.slug}` },
      ]),
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {umrah ? (
        <UmrahTourDetailClient initialData={initialData} related={related} />
      ) : (
        <TourDetailClient initialData={initialData} related={related} />
      )}
    </>
  );
}
