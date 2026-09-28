import { notFound } from "next/navigation";
import { Box, Container, Typography, Button, Grid, Stack, Chip } from "@mui/material";
import { prisma } from "@/core/lib/prisma";
import { isUmrahTour, normaliseTour } from "@/modules/tours/tour-utils";
import ServiceCard from "@/components/ServiceCard";
import FaqAccordion from "../../../components/common/FaqAccordion";
import { touristTripJsonLd, breadcrumbJsonLd } from "@/lib/service-jsonld";

export const dynamic = "force-dynamic";

// Allowlisted tiers. Each renders whatever matching Umrah packages exist in the DB
// (matched by the leading day-count in a tour's `duration`, e.g. "7 Days / 6 Nights").
// 7/10/15-day start empty until an admin adds packages of that duration — the page
// degrades to a "contact us" state rather than fabricating package data.
const TIERS = {
  "7-day": {
    days: 7,
    label: "7-Day Umrah Packages",
    eyebrow: "Short Umrah",
    title: "7-Day Umrah Packages from Hyderabad",
    intro:
      "Our 7-day Umrah packages are designed for pilgrims who want to perform Umrah within a single week — ideal for working professionals and families with limited leave. The itinerary balances time between Makkah and Madinah while covering flights, Umrah visa, hotels close to the Haram, transfers and guided ziyarat.",
    body: [
      "A typical 7-day plan keeps you 4 nights in Makkah and 2–3 nights in Madinah, with a domestic transfer between the two holy cities. Hotels are selected within walking distance of Masjid al-Haram and Masjid an-Nabawi so you can maximise your time in prayer.",
      "Every 7-day package includes return economy airfare from Hyderabad, complete Umrah visa processing, daily breakfast and dinner, air-conditioned coach transfers, and ziyarat tours of the key historical sites. Group departures run twice a month, and customised family or individual schedules are available on request.",
    ],
    keywords:
      "7 day Umrah package Hyderabad, short Umrah package, 1 week Umrah package from Hyderabad, cheap Umrah package Hyderabad",
    faqs: [
      {
        q: "Is 7 days enough for Umrah?",
        a: "Yes. A 7-day package is enough to comfortably perform Umrah and spend meaningful time in both Makkah and Madinah. It is the most popular choice for travellers with limited leave.",
      },
      {
        q: "What is included in the 7-day Umrah package?",
        a: "Return flights from Hyderabad, Umrah visa, hotel accommodation near the Haram, daily breakfast and dinner, transfers and guided ziyarat. Contact us for the latest pricing and departure dates.",
      },
      {
        q: "How is time split between Makkah and Madinah on a 7-day trip?",
        a: "Typically 4 nights in Makkah and 2–3 nights in Madinah, with a coach transfer between the two cities. The exact split can be customised for your group.",
      },
    ],
  },
  "10-day": {
    days: 10,
    label: "10-Day Umrah Packages",
    eyebrow: "Standard Umrah",
    title: "10-Day Umrah Packages from Hyderabad",
    intro:
      "Our 10-day Umrah packages offer a relaxed, well-paced pilgrimage with extra days for ibadah in both Makkah and Madinah. This is the sweet spot for most pilgrims — enough time to perform Umrah without feeling rushed, while still keeping the trip affordable.",
    body: [
      "A 10-day itinerary usually allocates 5–6 nights in Makkah and 3–4 nights in Madinah, leaving room for repeat Umrah, additional ziyarat and unhurried prayers at the two holiest mosques in Islam.",
      "All 10-day packages include return economy airfare from Hyderabad, Umrah visa, Haram-area hotels, daily breakfast and dinner, transfers and ziyarat tours led by experienced guides. Economy, standard and premium hotel tiers are available so you can match the package to your budget.",
    ],
    keywords:
      "10 day Umrah package Hyderabad, standard Umrah package Hyderabad, 10 days Umrah package India, Umrah package 10 nights",
    faqs: [
      {
        q: "What does a 10-day Umrah package cost from Hyderabad?",
        a: "Pricing depends on hotel category and season. Economy options are the most affordable, with standard and premium tiers available. Contact us for current rates and departure dates.",
      },
      {
        q: "How many nights in Makkah and Madinah on a 10-day package?",
        a: "Usually 5–6 nights in Makkah and 3–4 nights in Madinah. The balance can be adjusted for groups and families.",
      },
      {
        q: "Is the Umrah visa included in the 10-day package?",
        a: "Yes — Umrah visa processing is included in all our packages. We handle the complete application on your behalf.",
      },
    ],
  },
  "15-day": {
    days: 15,
    label: "15-Day Umrah Packages",
    eyebrow: "Extended Umrah",
    title: "15-Day Umrah Packages from Hyderabad",
    intro:
      "Our 15-day Umrah packages are for pilgrims who want an extended, immersive spiritual journey. With more nights in both Makkah and Madinah, you can perform multiple Umrah, attend congregational prayers daily, and visit every major ziyarat site at an unhurried pace.",
    body: [
      "A 15-day itinerary commonly splits as 8 nights in Makkah and 6–7 nights in Madinah, making it especially popular during Ramadan and for first-time pilgrims who want to make the most of their visit.",
      "Each 15-day package includes return economy airfare from Hyderabad, Umrah visa, accommodation near the Haram, daily breakfast and dinner, comfortable coach transfers, and comprehensive ziyarat tours. Premium Haram-view hotel options are available for those seeking extra comfort.",
    ],
    keywords:
      "15 day Umrah package Hyderabad, extended Umrah package, Ramadan Umrah package Hyderabad, 15 days Umrah package India",
    faqs: [
      {
        q: "Who should choose a 15-day Umrah package?",
        a: "Pilgrims who want an unhurried, immersive experience — including Ramadan travellers and first-timers who wish to spend extended time in worship at both holy cities.",
      },
      {
        q: "How many nights in Makkah and Madinah on a 15-day package?",
        a: "Typically 8 nights in Makkah and 6–7 nights in Madinah, though the split can be tailored to your preference.",
      },
      {
        q: "Are premium Haram-view hotels available on the 15-day package?",
        a: "Yes. We offer economy through premium tiers, including 5-star Haram-view hotel options on the extended packages.",
      },
    ],
  },
  ramadan: {
    days: null,
    comingSoon: true,
    label: "Ramadan Umrah Packages",
    eyebrow: "Ramadan Special",
    title: "Ramadan Umrah Packages from Hyderabad",
    intro:
      "Perform Umrah in the most blessed month of the year. Our Ramadan Umrah packages for 2026 are being finalised — with Haram-close hotels, suhoor and iftar arrangements, and departures timed for the last ashra. Register your interest now and be the first to know when bookings open.",
    keywords:
      "Ramadan Umrah package Hyderabad, Ramadan Umrah 2026, last ashra Umrah package, Umrah in Ramadan from India",
  },
};

const HERO_BG =
  "linear-gradient(135deg, rgba(8,19,43,0.95), rgba(12,27,61,0.88))";

export function generateStaticParams() {
  return Object.keys(TIERS).map((tier) => ({ tier }));
}

export async function generateMetadata({ params }) {
  const { tier } = await params;
  const config = TIERS[tier];
  if (!config) return {};
  const title = `${config.title} 2026 – Origin Tours & Travels`;
  return {
    title: { absolute: title },
    description: config.intro.slice(0, 160),
    keywords: config.keywords,
    alternates: { canonical: `/umrah/${tier}` },
    openGraph: {
      title,
      description: config.intro.slice(0, 200),
      url: `/umrah/${tier}`,
      type: "website",
      images: [{ url: "/og-default.jpg", width: 1200, height: 630, alt: "Origin Tours and Travels" }],
    },
  };
}

function durationDays(duration) {
  const match = String(duration ?? "").match(/\d+/);
  return match ? parseInt(match[0], 10) : null;
}

async function loadUmrahByTier(days) {
  try {
    const rows = await prisma.tour.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
      include: { tourCategory: true },
    });
    return rows
      .map(normaliseTour)
      .filter(isUmrahTour)
      .filter((t) => durationDays(t.tourDetails?.durationDaysNights) === days);
  } catch {
    return [];
  }
}

export default async function UmrahTierPage({ params }) {
  const { tier } = await params;
  const config = TIERS[tier];
  if (!config) notFound();

  const items = config.comingSoon ? [] : await loadUmrahByTier(config.days);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      touristTripJsonLd({
        name: config.title,
        path: `/umrah/${tier}`,
        description: config.intro,
        destination: "Makkah & Madinah, Saudi Arabia",
      }),
      breadcrumbJsonLd([
        { name: "Umrah Packages", path: "/umrah" },
        { name: config.label, path: `/umrah/${tier}` },
      ]),
    ],
  };

  return (
    // Umrah pages use Playfair Display for every heading level.
    <Box
      sx={{
        "& h1, & h2, & h3, & h4, & h5, & h6": {
          fontFamily: "var(--font-playfair), Georgia, serif",
          fontWeight: 500,
        },
        // Companion serif for body copy and content text.
        "& p, & li": { fontFamily: "var(--font-lora), Georgia, serif" },
      }}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <Box
        component="section"
        sx={{
          position: "relative",
          py: { xs: 8, md: 12 },
          background: HERO_BG,
          color: "common.white",
          textAlign: "center",
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h6" sx={{ color: "#c9a227", mb: 1, fontWeight: 700 }}>
            {config.eyebrow}
          </Typography>
          <Typography
            variant="h1"
            sx={{
              fontWeight: 800,
              fontSize: { xs: "2rem", sm: "2.6rem", md: "3.2rem" },
              mb: 3,
            }}
          >
            {config.title}
          </Typography>
          <Typography sx={{ opacity: 0.95, maxWidth: 720, mx: "auto", fontSize: "1.05rem" }}>
            {config.intro}
          </Typography>

          {/* Sibling-tier navigation */}
          <Stack
            direction="row"
            spacing={1.5}
            justifyContent="center"
            flexWrap="wrap"
            useFlexGap
            sx={{ mt: 4 }}
          >
            {Object.entries(TIERS).map(([slug, t]) => (
              <Chip
                key={slug}
                component="a"
                href={`/umrah/${slug}`}
                clickable
                label={t.label.replace(" Umrah Packages", "")}
                sx={{
                  px: 1,
                  fontWeight: 700,
                  color: slug === tier ? "#08132b" : "common.white",
                  bgcolor: slug === tier ? "#c9a227" : "rgba(255,255,255,0.15)",
                  border: "1px solid rgba(255,255,255,0.3)",
                  "&:hover": { bgcolor: slug === tier ? "#c9a227" : "rgba(255,255,255,0.28)" },
                }}
              />
            ))}
          </Stack>
        </Container>
      </Box>

      {config.comingSoon ? (
        /* Coming-soon promo — no package details until Ramadan departures are confirmed */
        <Box component="section" sx={{ py: { xs: 8, md: 12 }, bgcolor: "background.default" }}>
          <Container maxWidth="md">
            <Box
              sx={{
                textAlign: "center",
                py: { xs: 6, md: 9 },
                px: { xs: 3, md: 6 },
                borderRadius: 4,
                bgcolor: "background.paper",
                boxShadow: 1,
                border: "1px solid rgba(201,162,39,0.35)",
              }}
            >
              <Chip
                label="Coming Soon"
                sx={{
                  mb: 3,
                  px: 2,
                  fontWeight: 800,
                  letterSpacing: 1,
                  textTransform: "uppercase",
                  color: "#08132b",
                  bgcolor: "#c9a227",
                }}
              />
              <Typography variant="h3" sx={{ fontWeight: 800, color: "#0c1b3d", mb: 2 }}>
                Ramadan Umrah 2026 is on its way
              </Typography>
              <Typography color="text.secondary" sx={{ maxWidth: 560, mx: "auto", mb: 4, fontSize: "1.05rem", lineHeight: 1.8 }}>
                We are finalising hotels, flights and group departures for the blessed month.
                Seats for Ramadan fill fast — register your interest on WhatsApp and we&apos;ll
                contact you the moment bookings open.
              </Typography>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center">
                <Button
                  variant="contained"
                  component="a"
                  href="https://wa.me/919177787635"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ borderRadius: 50, px: 4, bgcolor: "#0c1b3d", "&:hover": { bgcolor: "#08132b" } }}
                >
                  Notify Me on WhatsApp
                </Button>
                <Button
                  variant="outlined"
                  component="a"
                  href="/umrah"
                  sx={{
                    borderRadius: 50,
                    px: 4,
                    borderColor: "#0c1b3d",
                    color: "#0c1b3d",
                    "&:hover": { borderColor: "#08132b", bgcolor: "rgba(12,27,61,0.06)" },
                  }}
                >
                  View All Umrah Packages
                </Button>
              </Stack>
            </Box>
          </Container>
        </Box>
      ) : (
      <>
      {/* Long-form content + packages */}
      <Box component="section" sx={{ py: { xs: 6, md: 10 }, bgcolor: "background.default" }}>
        <Container maxWidth="lg">
          <Stack spacing={2} sx={{ maxWidth: 820, mx: "auto", mb: { xs: 5, md: 8 } }}>
            {config.body.map((para, i) => (
              <Typography key={i} color="text.secondary" sx={{ fontSize: "1.05rem", lineHeight: 1.8 }}>
                {para}
              </Typography>
            ))}
          </Stack>

          {items.length > 0 ? (
            <Grid container spacing={{ xs: 2, md: 3 }} justifyContent="center">
              {items.map((tour) => (
                <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={tour.id}>
                  <ServiceCard item={tour} type="tour" variant="umrah" />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box
              sx={{
                textAlign: "center",
                py: { xs: 6, md: 8 },
                px: 3,
                maxWidth: 640,
                mx: "auto",
                borderRadius: 4,
                bgcolor: "background.paper",
                boxShadow: 1,
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: 700, color: "#0c1b3d", mb: 1 }}>
                {config.label} are being finalised
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 3 }}>
                We&apos;re confirming dates and pricing for {config.days}-day departures. Message us
                on WhatsApp and we&apos;ll share the latest {config.days}-day options for your travel
                dates.
              </Typography>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center">
                <Button
                  variant="contained"
                  component="a"
                  href="https://wa.me/919177787635"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ borderRadius: 50, px: 4, bgcolor: "#0c1b3d", "&:hover": { bgcolor: "#08132b" } }}
                >
                  Enquire on WhatsApp
                </Button>
                <Button
                  variant="outlined"
                  component="a"
                  href="/umrah"
                  sx={{
                    borderRadius: 50,
                    px: 4,
                    borderColor: "#0c1b3d",
                    color: "#0c1b3d",
                    "&:hover": { borderColor: "#08132b", bgcolor: "rgba(12,27,61,0.06)" },
                  }}
                >
                  View All Umrah Packages
                </Button>
              </Stack>
            </Box>
          )}
        </Container>
      </Box>

      <FaqAccordion
        faqs={config.faqs}
        eyebrow="Umrah FAQs"
        title={`${config.label} — questions answered`}
      />
      </>
      )}
    </Box>
  );
}
