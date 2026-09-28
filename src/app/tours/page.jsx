import { prisma } from "@/core/lib/prisma";
import { isUmrahTour, normaliseTour } from "@/modules/tours/tour-utils";
import ToursClient from "./ToursClient";
import FaqAccordion from "../../components/common/FaqAccordion";
import { serviceJsonLd, breadcrumbJsonLd } from "@/lib/service-jsonld";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    serviceJsonLd({
      name: "Holiday Packages from Hyderabad",
      serviceType: "Holiday and tour packages",
      path: "/tours",
      description:
        "Domestic and international holiday packages from Hyderabad — Kerala, Goa, Rajasthan, Dubai, Thailand, Europe and more — customised for families, couples and groups.",
    }),
    breadcrumbJsonLd([{ name: "Holiday Packages", path: "/tours" }]),
  ],
};

export const dynamic = "force-dynamic";

export const metadata = {
  title: {
    absolute:
      "Holiday Packages from Hyderabad – Domestic & International | Origin Tours",
  },
  description:
    "Domestic & international holiday packages from Hyderabad — Kerala, Goa, Rajasthan, Dubai, Thailand, Europe & more. Customised tours for families, couples & groups.",
  keywords:
    "domestic holiday packages Hyderabad, India tour packages from Hyderabad, international holiday packages Hyderabad, Dubai tour package from Hyderabad, Kerala tour package Hyderabad, Europe tour packages from India, family tour packages India",
  alternates: { canonical: "/tours" },
  openGraph: {
    title:
      "Holiday Packages from Hyderabad – Domestic & International | Origin Tours",
    description:
      "Customised domestic and international holiday packages from Hyderabad for families, couples and groups.",
    url: "/tours",
    type: "website",
  },
};

const toursFaqs = [
  {
    q: "What are the most popular domestic packages from Hyderabad?",
    a: "Kerala, Goa, Andaman, Rajasthan and Shimla–Manali are consistently our most booked domestic destinations.",
  },
  {
    q: "What international destinations do you offer from Hyderabad?",
    a: "Dubai, Thailand, Malaysia, Singapore, Europe, Maldives, Turkey, Sri Lanka, Australia and many more destinations.",
  },
  {
    q: "Do your packages include flights from Hyderabad?",
    a: "Most packages include return flights. Train or road transport options are also available for nearby domestic destinations.",
  },
  {
    q: "Can I customise a holiday package?",
    a: "Absolutely. We tailor every package to your preferred travel dates, budget and specific interests.",
  },
  {
    q: "Is visa assistance included in your international packages?",
    a: "Yes, visa assistance is included in all international packages. Approval is subject to the respective embassy, but we handle the complete application process.",
  },
  {
    q: "Do you offer honeymoon packages?",
    a: "Yes. Kerala backwaters, Andaman beaches, Coorg hills and international destinations like the Maldives are popular honeymoon choices with special couple inclusions.",
  },
  {
    q: "How far in advance should I book a holiday?",
    a: "For international trips, book at least 4–6 weeks ahead for smooth visa processing and better fares. Domestic trips can be arranged on shorter notice.",
  },
];

async function loadTours() {
  try {
    const rows = await prisma.tour.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
      include: { tourCategory: true },
    });
    return rows.map(normaliseTour).filter((t) => !isUmrahTour(t));
  } catch {
    return [];
  }
}

export default async function ToursPage() {
  const tours = await loadTours();
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ToursClient initialItems={tours} />
      <FaqAccordion
        faqs={toursFaqs}
        eyebrow="Holiday Package FAQs"
        title="Holiday package questions, answered"
      />
    </>
  );
}
