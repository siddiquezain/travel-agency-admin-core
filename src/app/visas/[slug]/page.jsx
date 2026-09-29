import { notFound } from "next/navigation";
import { prisma } from "@/core/lib/prisma";
import VisaDetailClient from "./VisaDetailClient";
import { serviceJsonLd, breadcrumbJsonLd } from "@/lib/service-jsonld";
import { normaliseVisaDetail, buildVisaTitle } from "@/lib/public-detail";
import { getRelatedVisas } from "@/lib/related";
import { agency } from "@/config/agency";

export const revalidate = 300;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const visa = await prisma.visa.findFirst({
    where: { slug, isActive: true },
    select: { country: true, type: true, description: true, slug: true, images: true },
  });

  if (!visa) {
    return {
      title: "Visa Not Found",
      robots: { index: false, follow: false },
    };
  }

  const title = buildVisaTitle(visa.country, visa.type);
  const description =
    (visa.description ?? "").slice(0, 160) ||
    `Apply for ${title} through ${agency.name} — fast, reliable processing.`;
  const images = Array.isArray(visa.images) ? visa.images : [];
  const image = typeof images[0] === "string" ? images[0] : "/og-default.jpg";
  const canonical = `/visas/${visa.slug}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title: `${title} | ${agency.name}`,
      description,
      url: canonical,
      type: "article",
      images: [{ url: image }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default async function VisaDetailPage({ params }) {
  const { slug } = await params;
  const visa = await prisma.visa.findFirst({
    where: { slug, isActive: true },
  });

  if (!visa) notFound();

  const initialData = normaliseVisaDetail(visa);
  const related = await getRelatedVisas({
    id: visa.id,
    country: visa.country,
    type: visa.type,
  });
  const name = buildVisaTitle(visa.country, visa.type);
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      serviceJsonLd({
        name,
        serviceType: "Visa processing and stamping",
        description: visa.description,
        price: visa.fee,
        images: visa.images,
        path: `/visas/${visa.slug}`,
      }),
      breadcrumbJsonLd([
        { name: "Visa Services", path: "/visas" },
        { name, path: `/visas/${visa.slug}` },
      ]),
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <VisaDetailClient initialData={initialData} related={related} />
    </>
  );
}
