import HajjContent from "../../components/services/HajjContent";

const SITE_URL = "https://origintoursandtravels.com";

export const metadata = {
  title: {
    absolute: "Hajj Packages 2026 from Hyderabad – Origin Tours & Travels",
  },
  description:
    "Plan your Hajj pilgrimage with Origin Tours & Travels, Hyderabad. Trusted Hajj packages with full guidance, accommodation and visa support for a sacred journey.",
  keywords:
    "Hajj packages 2026 Hyderabad, Hajj tour operator Hyderabad, Hajj packages from India 2026, Hajj registration Hyderabad, affordable Hajj packages India, Hajj travel agent Hyderabad, Hajj packages Masab Tank 2026",
  alternates: { canonical: "/hajj" },
  openGraph: {
    title: "Hajj Packages 2026 from Hyderabad – Origin Tours & Travels",
    description:
      "Trusted, fully guided Hajj 2026 packages from Hyderabad with visa, flights and accommodation support.",
    url: "/hajj",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      name: "Hajj Packages 2026",
      serviceType: "Hajj pilgrimage package",
      description:
        "Guided Hajj 2026 packages from Hyderabad with visa, return flights, Makkah and Madinah accommodation, and an experienced Aalim guide.",
      url: `${SITE_URL}/hajj`,
      areaServed: "India",
      provider: { "@id": `${SITE_URL}#travelagency` },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        {
          "@type": "ListItem",
          position: 2,
          name: "Hajj Packages",
          item: `${SITE_URL}/hajj`,
        },
      ],
    },
  ],
};

export default function HajjPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HajjContent />
    </>
  );
}
