import { prisma } from "@/lib/prisma";
import { normaliseAttestation } from "@/lib/tour-utils";
import AttestationsClient from "./AttestationsClient";
import FaqAccordion from "../../components/common/FaqAccordion";
import { serviceJsonLd, breadcrumbJsonLd } from "@/lib/service-jsonld";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    serviceJsonLd({
      name: "Certificate Attestation Services in Hyderabad",
      serviceType: "Certificate attestation and apostille",
      path: "/attestations",
      description:
        "HRD, MEA, embassy and MOFA attestation plus apostille for educational, personal and commercial documents in Hyderabad — for travel, work and immigration.",
    }),
    breadcrumbJsonLd([{ name: "Attestation Services", path: "/attestations" }]),
  ],
};

export const dynamic = "force-dynamic";

export const metadata = {
  title: {
    absolute: "Certificate Attestation Services Hyderabad – Origin Tours",
  },
  description:
    "Need document attestation? Origin Tours & Travels, Hyderabad provides quick certificate attestation services for travel, work & immigration purposes.",
  keywords:
    "certificate attestation Hyderabad, document attestation agent Hyderabad, attestation for UAE visa Hyderabad, HRD attestation Hyderabad, MEA attestation Hyderabad, attestation services near me Hyderabad, document verification Hyderabad",
  alternates: { canonical: "/attestations" },
  openGraph: {
    title: "Certificate Attestation Services Hyderabad – Origin Tours",
    description:
      "Quick, reliable certificate attestation for educational, personal and commercial documents, from Hyderabad.",
    url: "/attestations",
    type: "website",
  },
};

const attestationFaqs = [
  {
    q: "How long does certificate attestation take in Hyderabad?",
    a: "Usually 7–15 working days depending on document type and destination country. Urgent processing may be available.",
  },
  {
    q: "Do I need attestation for a UAE work visa?",
    a: "Yes. Educational and personal documents need MEA and UAE Embassy attestation before a UAE work visa can be processed.",
  },
  {
    q: "What is the difference between attestation and apostille?",
    a: "Apostille is for Hague Convention countries (USA, UK, Europe). Attestation is required for non-Hague countries like UAE and Saudi Arabia.",
  },
  {
    q: "Can you attest documents for Saudi Arabia and Qatar?",
    a: "Yes, we handle full MOFA attestation for all Gulf countries including Saudi Arabia, Qatar, Kuwait and Bahrain.",
  },
];

async function loadAttestations() {
  try {
    const rows = await prisma.attestation.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    });
    return rows.map(normaliseAttestation);
  } catch {
    return [];
  }
}

export default async function AttestationsPage() {
  const items = await loadAttestations();
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AttestationsClient initialItems={items} />
      <FaqAccordion
        faqs={attestationFaqs}
        eyebrow="Attestation FAQs"
        title="Certificate attestation questions, answered"
      />
    </>
  );
}
