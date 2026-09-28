import HotelBookingContent from "../../components/services/HotelBookingContent";

const SITE_URL = "https://origintoursandtravels.com";

export const metadata = {
  title: {
    absolute: "Hotel Reservations India & Abroad – Origin Tours Hyderabad",
  },
  description:
    "Book luxury, economy or budget hotels nationally & internationally with Origin Tours & Travels, Hyderabad. Best rates and personalised accommodation support.",
  keywords:
    "hotel booking agent Hyderabad, international hotel reservation India, Makkah hotel booking Hyderabad, affordable hotel packages India, hotel booking travel agent Hyderabad, best hotel deals Hyderabad agent",
  alternates: { canonical: "/hotels" },
  openGraph: {
    title: "Hotel Reservations India & Abroad – Origin Tours Hyderabad",
    description:
      "Luxury, economy and budget hotel reservations across India and worldwide, including Makkah & Madinah.",
    url: "/hotels",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      name: "Hotel Booking",
      serviceType: "Hotel reservation",
      description:
        "Luxury, economy and budget hotel reservations across India and worldwide, with dedicated Makkah and Madinah pilgrim accommodation.",
      url: `${SITE_URL}/hotels`,
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
          name: "Hotel Booking",
          item: `${SITE_URL}/hotels`,
        },
      ],
    },
  ],
};

export default function HotelBookingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HotelBookingContent />
    </>
  );
}
