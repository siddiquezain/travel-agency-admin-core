import { prisma } from "@/lib/prisma";
import { normaliseVisa } from "@/lib/tour-utils";
import VisasClient from "./VisasClient";
import FaqAccordion from "../../components/common/FaqAccordion";
import { serviceJsonLd, breadcrumbJsonLd } from "@/lib/service-jsonld";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    serviceJsonLd({
      name: "Tourist & Business Visa Services in Hyderabad",
      serviceType: "Visa processing and stamping",
      path: "/visas",
      description:
        "Tourist and business visa processing and stamping from Hyderabad for UAE, UK, USA, Schengen, Vietnam, Uzbekistan, Saudi Arabia and more, with complete documentation support.",
    }),
    breadcrumbJsonLd([{ name: "Visa Services", path: "/visas" }]),
  ],
};

export const dynamic = "force-dynamic";

export const metadata = {
  title: {
    absolute: "Tourist Visa & Stamping Services Hyderabad – Origin Tours",
  },
  description:
    "Fast and hassle-free tourist visa processing for all major countries. Origin Tours & Travels, Hyderabad handles all documentation & stamping services for you.",
  keywords:
    "tourist visa Hyderabad, visa stamping agent Hyderabad, visa processing India, Schengen visa agent Hyderabad, Dubai visa from Hyderabad, visa services near me Hyderabad, visa agent Masab Tank Hyderabad",
  alternates: { canonical: "/visas" },
  openGraph: {
    title: "Tourist Visa & Stamping Services Hyderabad – Origin Tours",
    description:
      "Fast, hassle-free tourist visa processing and stamping for all major countries, from Hyderabad.",
    url: "/visas",
    type: "website",
  },
};

const visaFaqs = [
  {
    q: "How long does visa processing take from Hyderabad?",
    a: "Depends on the country. UAE typically 2–3 working days, Schengen 15–20 working days, UK 3–4 weeks. We advise applying well in advance.",
  },
  {
    q: "What is the cost of a tourist visa from Hyderabad?",
    a: "Visa fees vary by country. Contact us for a current fee breakdown including embassy fees and our service charge.",
  },
  {
    q: "Can you help if my visa application was rejected before?",
    a: "Yes. We review previous rejections and advise on the best approach and stronger documentation for reapplication.",
  },
  {
    q: "Do you offer visa services for Saudi Arabia (Umrah/Hajj)?",
    a: "Yes, Saudi visas for Umrah and Hajj are handled as part of our complete pilgrimage packages.",
  },
  {
    q: "Is it safe to submit original documents to your office?",
    a: "Yes, all original documents are handled securely and returned to you promptly after the visa process is complete.",
  },
];

async function loadVisas() {
  try {
    const rows = await prisma.visa.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    });
    return rows.map(normaliseVisa);
  } catch {
    return [];
  }
}

export default async function VisasPage() {
  const visas = await loadVisas();
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <VisasClient initialItems={visas} />
      <FaqAccordion
        faqs={visaFaqs}
        eyebrow="Visa FAQs"
        title="Tourist visa questions, answered"
      />
    </>
  );
}
