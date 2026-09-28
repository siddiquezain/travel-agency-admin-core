import { Box } from "@mui/material";
import { prisma } from "@/lib/prisma";
import {
  isUmrahTour,
  normaliseTour,
  normaliseVisa,
  normaliseAttestation,
} from "@/lib/tour-utils";
import { getSiteSettings, parseHeroSlides } from "@/lib/site-settings";

import {
  HeroSlider,
  TrustedPartners,
  ServicesFlow,
  FeaturedSection,
  WhyChooseUs,
  Testimonials,
  VideoSection,
  FAQSection,
  NewsletterCTA,
} from '../components/home/index';

// VideoObject structured data for the brand promo video (real upload date
// 2026-05-18, verified from the YouTube watch page). Rendered as its own
// JSON-LD block so it doesn't collide with the @graph in layout.tsx.
const videoJsonLd = {
  "@context": "https://schema.org",
  "@type": "VideoObject",
  name: "Best Travel Agency in Hyderabad – Origin Tours and Travels",
  description:
    "A look at Origin Tours and Travels — Hyderabad's trusted travel partner for over 10 years, offering Umrah & Hajj packages, holiday tours, air ticketing, visas and certificate attestation.",
  thumbnailUrl: ["https://i.ytimg.com/vi/y0aFvdNH5aM/maxresdefault.jpg"],
  uploadDate: "2026-05-18",
  embedUrl: "https://www.youtube-nocookie.com/embed/y0aFvdNH5aM",
  contentUrl: "https://www.youtube.com/watch?v=y0aFvdNH5aM",
  publisher: { "@id": "https://origintoursandtravels.com#organization" },
};

export const metadata = {
  title: {
    absolute:
      "Origin Tours & Travels | Holiday, Umrah & Hajj Packages – Hyderabad",
  },
  description:
    "Hyderabad's trusted travel agency for 10+ years. Book Umrah, Hajj, holiday packages, air tickets, visa & hotel reservations. Serving families, groups & corporate travellers.",
  keywords:
    "travel agency Hyderabad, Umrah packages Hyderabad, holiday packages Hyderabad, air ticketing Hyderabad, Hajj packages India, hotel booking Hyderabad, tours and travels Hyderabad, Masab Tank travel agent",
  alternates: { canonical: "/" },
  openGraph: {
    title:
      "Origin Tours & Travels | Holiday, Umrah & Hajj Packages – Hyderabad",
    description:
      "Hyderabad's trusted travel agency for 10+ years. Umrah, Hajj, holiday packages, air tickets, visa & hotel reservations.",
    url: "/",
    type: "website",
    // Next.js does not inherit the layout's openGraph.images once a page
    // redefines openGraph — re-declare it so share previews keep an image.
    images: [{ url: "/og-default.jpg", width: 1200, height: 630, alt: "Origin Tours and Travels" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og-default.jpg"],
  },
};

// Rendered per request — the Docker build has no real DB, so static
// pre-rendering would bake an empty homepage. Dynamic = always live data.
export const dynamic = "force-dynamic";

// Explicit field lists used as a fallback when the `featured` column has not
// been migrated yet — keeps the homepage working instead of blanking sections.
const TOUR_SELECT = {
  id: true, slug: true, title: true, price: true, duration: true,
  country: true, images: true, features: true, mealTypes: true, packages: true,
  tourCategory: { select: { name: true, slug: true } },
};
const VISA_SELECT = {
  id: true, slug: true, country: true, type: true, fee: true,
  processingTime: true, validityDuration: true, images: true,
};
const ATTESTATION_SELECT = {
  id: true, slug: true, type: true, country: true, fee: true, images: true,
};

async function loadHomepageData() {
  const active = { where: { isActive: true }, orderBy: { createdAt: "desc" } };

  // Primary query selects every column (incl. `featured`). If that column is
  // not migrated yet the query throws — retry without it so sections still show.
  const [tourRows, visaRows, attestRows] = await Promise.all([
    prisma.tour
      .findMany({ ...active, include: { tourCategory: true } })
      .catch(() => prisma.tour.findMany({ ...active, select: TOUR_SELECT }))
      .catch(() => []),
    prisma.visa
      .findMany(active)
      .catch(() => prisma.visa.findMany({ ...active, select: VISA_SELECT }))
      .catch(() => []),
    prisma.attestation
      .findMany(active)
      .catch(() => prisma.attestation.findMany({ ...active, select: ATTESTATION_SELECT }))
      .catch(() => []),
  ]);

  const allTours = tourRows.map(normaliseTour);

  // Show hand-picked items if any are flagged in a section; otherwise show all active.
  const featuredOrAll = (list) => {
    const picked = list.filter((x) => x.featured);
    return picked.length > 0 ? picked : list;
  };

  return {
    umrah: featuredOrAll(allTours.filter(isUmrahTour)),
    tours: featuredOrAll(allTours.filter((tr) => !isUmrahTour(tr))),
    visas: featuredOrAll(visaRows.map(normaliseVisa)),
    attestations: featuredOrAll(attestRows.map(normaliseAttestation)),
  };
}

async function loadSliderSettings() {
  try {
    const s = await getSiteSettings();
    return {
      heroSlides: parseHeroSlides(s.heroSlides),
      sliderTiming: {
        autoplay: s.sliderAutoplay ?? true,
        interval: s.sliderInterval ?? 5000,
        speed: s.sliderSpeed ?? 600,
        loop: s.sliderLoop ?? true,
        showDots: s.sliderShowDots ?? true,
        showArrows: s.sliderShowArrows ?? true,
        pauseOnHover: s.sliderPauseOnHover ?? true,
      },
    };
  } catch {
    // Settings table not migrated yet — fall back to the default video hero.
    return {
      heroSlides: [],
      sliderTiming: {
        autoplay: true,
        interval: 5000,
        speed: 600,
        loop: true,
        showDots: true,
        showArrows: true,
        pauseOnHover: true,
      },
    };
  }
}

export default async function Home() {
  const { tours, umrah, visas, attestations } = await loadHomepageData();
  const { heroSlides, sliderTiming } = await loadSliderSettings();

  return (
    <Box sx={{ overflowX: "hidden" }}>
      <HeroSlider slides={heroSlides} {...sliderTiming} />

      <TrustedPartners />
      <WhyChooseUs />

      <ServicesFlow />

      <FeaturedSection
        {...sliderTiming}
        title="Featured Tour Packages"
        subtitle="Popular Destinations"
        items={tours}
        loading={false}
        type="tour"
        linkTo="/tours"
        linkLabel="View All Tours"
        bgColor="background.paper"
      />

      <FeaturedSection
        {...sliderTiming}
        title="Umrah Packages"
        subtitle="Spiritual Journeys"
        items={umrah}
        loading={false}
        type="tour"
        variant="umrah"
        linkTo="/umrah"
        linkLabel="View All Umrah Packages"
        bgColor="background.default"
      />

      <FeaturedSection
        {...sliderTiming}
        title="Visa Services"
        subtitle="Travel Documents"
        items={visas}
        loading={false}
        type="visa"
        linkTo="/visas"
        linkLabel="View All Visas"
        bgColor="background.paper"
      />

      <FeaturedSection
        {...sliderTiming}
        title="Certificate Attestation"
        subtitle="Official Documents"
        items={attestations}
        loading={false}
        type="attestation"
        linkTo="/attestations"
        linkLabel="View Services"
        bgColor="background.default"
      />

      <Testimonials />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(videoJsonLd) }}
      />
      <VideoSection />

      <FAQSection />

      <NewsletterCTA />
    </Box>
  );
}
