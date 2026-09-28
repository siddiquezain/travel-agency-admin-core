import TransportContent from "../../components/services/TransportContent";

const SITE_URL = "https://origintoursandtravels.com";

export const metadata = {
  title: {
    absolute: "Car, Bus & Train Booking in Hyderabad – Origin Tours & Travels",
  },
  description:
    "Book cabs, buses and trains easily with Origin Tours & Travels in Hyderabad. Quick, reliable and affordable transport solutions for individuals and groups.",
  keywords:
    "cab booking Hyderabad travel agent, bus booking agent Hyderabad, train ticket booking Hyderabad, group transport Hyderabad, car hire Hyderabad travel agency, airport cab Hyderabad",
  alternates: { canonical: "/transport" },
  openGraph: {
    title: "Car, Bus & Train Booking in Hyderabad – Origin Tours & Travels",
    description:
      "Cabs, buses and train tickets in Hyderabad — quick, reliable and affordable transport for individuals and groups.",
    url: "/transport",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      name: "Transport Booking",
      serviceType: "Ground transport booking",
      description:
        "Car hire, cab, bus and train ticket booking in Hyderabad for individuals and groups.",
      url: `${SITE_URL}/transport`,
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
          name: "Transport Booking",
          item: `${SITE_URL}/transport`,
        },
      ],
    },
  ],
};

export default function TransportPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <TransportContent />
    </>
  );
}
