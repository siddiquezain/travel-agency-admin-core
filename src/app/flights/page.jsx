import AirTicketingContent from "../../components/services/AirTicketingContent";

const SITE_URL = "https://origintoursandtravels.com";

export const metadata = {
  title: {
    absolute: "Cheap Flight Tickets in Hyderabad – Origin Tours & Travels",
  },
  description:
    "Book domestic & international flights at the best prices. Origin Tours & Travels, Hyderabad offers cheap air tickets on all major airlines. Call us today!",
  keywords:
    "cheap flights Hyderabad, air ticket booking Hyderabad, international flight booking agent, air ticketing agent Hyderabad, domestic flight booking India, group flight booking Hyderabad, flight booking Masab Tank Hyderabad",
  alternates: { canonical: "/flights" },
  openGraph: {
    title: "Cheap Flight Tickets in Hyderabad – Origin Tours & Travels",
    description:
      "Domestic & international air tickets on all major airlines at the best prices, from Hyderabad.",
    url: "/flights",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      name: "Air Ticketing",
      serviceType: "Flight booking",
      description:
        "Domestic and international air ticket booking on all major airlines at the best available fares, from Hyderabad.",
      url: `${SITE_URL}/flights`,
      areaServed: "Worldwide",
      provider: { "@id": `${SITE_URL}#travelagency` },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        {
          "@type": "ListItem",
          position: 2,
          name: "Air Ticketing",
          item: `${SITE_URL}/flights`,
        },
      ],
    },
  ],
};

export default function AirTicketingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AirTicketingContent />
    </>
  );
}
