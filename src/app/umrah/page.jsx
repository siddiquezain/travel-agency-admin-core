import { Box, Container, Typography, Button, Stack, Chip } from "@mui/material";
import { prisma } from "@/lib/prisma";
import { isUmrahTour, normaliseTour } from "@/lib/tour-utils";
import UmrahClient from "./UmrahClient";
import FaqAccordion from "../../components/common/FaqAccordion";
import { touristTripJsonLd, breadcrumbJsonLd } from "@/lib/service-jsonld";

const UMRAH_TIERS = [
  { slug: "7-day", label: "7-Day Umrah", note: "Short — ideal for limited leave" },
  { slug: "10-day", label: "10-Day Umrah", note: "Standard — the popular choice" },
  { slug: "15-day", label: "15-Day Umrah", note: "Extended — Ramadan & first-timers" },
  { slug: "ramadan", label: "Ramadan Umrah", note: "Coming soon — register your interest", comingSoon: true },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    touristTripJsonLd({
      name: "Umrah Packages from Hyderabad 2027",
      path: "/umrah",
      description:
        "Economy, standard and premium Umrah packages from Hyderabad for 2027 — including Umrah visa, return flights, Makkah and Madinah hotels, transfers and Ziyarat, with experienced guides and two fixed group departures monthly.",
      destination: "Makkah & Madinah, Saudi Arabia",
    }),
    breadcrumbJsonLd([{ name: "Umrah Packages", path: "/umrah" }]),
  ],
};

export const dynamic = "force-dynamic";

export const metadata = {
  title: {
    absolute:
      "Best Umrah Packages from Hyderabad  – Origin Tours & Travels",
  },
  description:
    "Book affordable Umrah packages from Hyderabad with Origin Tours & Travels. Economy, standard & premium options with experienced guides and 2 fixed groups monthly.",
  keywords:
    "Umrah packages from Hyderabad, cheap Umrah packages India , Umrah group packages Hyderabad, Umrah visa Hyderabad, best Umrah travel agent Hyderabad, Umrah packages Masab Tank Hyderabad",
  alternates: { canonical: "/umrah" },
  openGraph: {
    title: "Best Umrah Packages from Hyderabad  – Origin Tours & Travels",
    description:
      "Affordable economy, standard and premium Umrah packages from Hyderabad with experienced guides and complete visa assistance.",
    url: "/umrah",
    type: "website",
    images: [{ url: "/og-default.jpg", width: 1200, height: 630, alt: "Origin Tours and Travels" }],
  },
};

const umrahFaqs = [
  {
    q: "How much does an Umrah package cost from Hyderabad?",
    a: "Economy packages start from approximately Rs. 85,000 per person. Premium packages vary based on hotel category and duration. Contact us for latest pricing.",
  },
  {
    q: "Is Umrah visa included in your packages?",
    a: "Yes, Umrah visa is included in all our packages. We handle the complete visa application process on your behalf.",
  },
  {
    q: "How many days is a standard Umrah package?",
    a: "Our standard packages are 14 nights – 7 nights in Makkah and 7 nights in Madinah. Custom durations are available on request.",
  },
  {
    q: "Do you offer individual Umrah packages or only group travel?",
    a: "Both. We have 2 fixed group departures monthly and also arrange customised individual and family Umrah packages.",
  },
  {
    q: "What is the best time to perform Umrah from Hyderabad?",
    a: "Ramadan is the most spiritually rewarding time. Outside the Hajj season offers a less crowded and more affordable experience.",
  },
  {
    q: "Are hotels close to Masjid Al Haram in your packages?",
    a: "Yes. Economy packages offer hotels within walking distance (200–500m). Premium packages include 5-star Haram-view options.",
  },
];

async function loadUmrah() {
  try {
    const rows = await prisma.tour.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
      include: { tourCategory: true },
    });
    return rows.map(normaliseTour).filter(isUmrahTour);
  } catch {
    return [];
  }
}

export default async function UmrahPage() {
  const items = await loadUmrah();
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
      <UmrahClient initialItems={items} />

      {/* Browse Umrah packages by duration */}
      <Box component="section" sx={{ py: { xs: 6, md: 9 }, bgcolor: "background.paper" }}>
        <Container maxWidth="lg">
          <Box textAlign="center" mb={{ xs: 4, md: 6 }}>
            <Typography variant="h6" sx={{ color: "#c9a227", fontWeight: 700 }} gutterBottom>
              Choose Your Duration
            </Typography>
            <Typography variant="h2" sx={{ color: "#0c1b3d", fontWeight: 800 }}>
              Umrah packages by length of stay
            </Typography>
          </Box>
          <Stack direction={{ xs: "column", md: "row" }} spacing={3} justifyContent="center">
            {UMRAH_TIERS.map((tier) => (
              <Button
                key={tier.slug}
                component="a"
                href={`/umrah/${tier.slug}`}
                sx={{
                  flex: 1,
                  maxWidth: { md: 320 },
                  flexDirection: "column",
                  alignItems: "flex-start",
                  textAlign: "left",
                  textTransform: "none",
                  p: 3,
                  borderRadius: 4,
                  border: "1px solid",
                  borderColor: "divider",
                  bgcolor: "background.default",
                  transition: "all 0.25s ease",
                  "&:hover": {
                    borderColor: "#0c1b3d",
                    boxShadow: "0 8px 24px rgba(12,27,61,0.15)",
                    transform: "translateY(-3px)",
                  },
                }}
              >
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="h5" sx={{ fontWeight: 800, color: "#0c1b3d" }}>
                    {tier.label}
                  </Typography>
                  {tier.comingSoon && (
                    <Chip
                      label="Coming Soon"
                      size="small"
                      sx={{ fontWeight: 700, color: "#08132b", bgcolor: "#c9a227" }}
                    />
                  )}
                </Stack>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  {tier.note}
                </Typography>
              </Button>
            ))}
          </Stack>
        </Container>
      </Box>

      <FaqAccordion
        faqs={umrahFaqs}
        eyebrow="Umrah FAQs"
        title="Umrah package questions, answered"
      />
    </Box>
  );
}
