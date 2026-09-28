import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AttestationDetailClient from "./AttestationDetailClient";
import { serviceJsonLd, breadcrumbJsonLd } from "@/lib/service-jsonld";
import { normaliseAttestationDetail } from "@/lib/public-detail";
import { getRelatedAttestations } from "@/lib/related";

export const revalidate = 300;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const item = await prisma.attestation.findFirst({
    where: { slug, isActive: true },
    select: { type: true, country: true, description: true, slug: true, images: true },
  });

  if (!item) {
    return {
      title: "Attestation Not Found",
      robots: { index: false, follow: false },
    };
  }

  const title = `${item.type}${item.country ? ` – ${item.country}` : ""}`;
  const description =
    (item.description ?? "").slice(0, 160) ||
    `Official ${title} attestation services from Origin Tours and Travels, Hyderabad.`;
  const images = Array.isArray(item.images) ? item.images : [];
  const image = typeof images[0] === "string" ? images[0] : "/og-default.jpg";
  const canonical = `/attestations/${item.slug}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title: `${title} | Origin Tours and Travels`,
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

export default async function AttestationDetailPage({ params }) {
  const { slug } = await params;
  const item = await prisma.attestation.findFirst({
    where: { slug, isActive: true },
    select: {
      id: true,
      type: true,
      country: true,
      description: true,
      slug: true,
      images: true,
      fee: true,
    },
  });

  if (!item) notFound();

  const initialData = normaliseAttestationDetail(item);
  const related = await getRelatedAttestations({
    id: item.id,
    type: item.type,
    country: item.country,
  });
  const name = `${item.type}${item.country ? ` – ${item.country}` : ""}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      serviceJsonLd({
        name,
        serviceType: "Certificate attestation and apostille",
        description: item.description,
        price: item.fee,
        images: item.images,
        path: `/attestations/${item.slug}`,
      }),
      breadcrumbJsonLd([
        { name: "Attestation Services", path: "/attestations" },
        { name, path: `/attestations/${item.slug}` },
      ]),
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AttestationDetailClient initialData={initialData} related={related} />
    </>
  );
}
