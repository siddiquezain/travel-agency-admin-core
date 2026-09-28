"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Stack,
  Button,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  useTheme,
} from "@mui/material";
import RouterLink from "next/link";
import FlightTakeoff from "@mui/icons-material/FlightTakeoff";
import Security from "@mui/icons-material/Security";
import SupportAgent from "@mui/icons-material/SupportAgent";
import Star from "@mui/icons-material/Star";
import Handshake from "@mui/icons-material/Handshake";
import EmojiEvents from "@mui/icons-material/EmojiEvents";
import Groups from "@mui/icons-material/Groups";
import TravelExplore from "@mui/icons-material/TravelExplore";
import ArrowForward from "@mui/icons-material/ArrowForward";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LocalPhoneOutlined from "@mui/icons-material/LocalPhoneOutlined";
import EmailOutlined from "@mui/icons-material/EmailOutlined";
import aboutHero from "../../assets/images/hero/about_hero.png";
import { breadcrumbJsonLd } from "@/lib/service-jsonld";
import {
  radius,
  shadow,
  sectionColors,
  iconContainerSx,
} from "../../config/designSystem";

const breadcrumbLd = {
  "@context": "https://schema.org",
  "@graph": [breadcrumbJsonLd([{ name: "About Us", path: "/about" }])],
};

/* ── About FAQs ─────────────────────────────────────────── */
const aboutFaqs = [
  {
    q: "When was Origin Tours & Travels established?",
    a: "We were founded in 2010 and have over 10 years of experience in travel and tourism.",
  },
  {
    q: "Is Origin Tours & Travels a registered travel agency?",
    a: "Yes, Origin Tours & Travels is a registered travel agency in Hyderabad, and our team brings over a decade of professional travel and tourism experience.",
  },
  {
    q: "Do you serve individual travellers or only groups?",
    a: "Both. We cater to solo travellers, couples, families and large groups with personalised and group packages.",
  },
];

/* ── Animated Counter ───────────────────────────────────── */
const AnimatedCount = ({ end, suffix = "", duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const hasAnimated = useRef(false);

  const animate = useCallback(() => {
    try {
      if (hasAnimated.current) return;
      hasAnimated.current = true;
      const startTime = performance.now();
      const step = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 4);
        setCount(Math.round(eased * end));
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    } catch {
      setCount(end);
    }
  }, [end, duration]);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- immediate fallback when IntersectionObserver is unavailable (SSR/older browsers)
      setCount(end);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) animate();
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [animate, end]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
};

/* ── Component ──────────────────────────────────────────── */
const About = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const [expandedFaq, setExpandedFaq] = useState(false);

  const handleFaqChange = (panel) => (event, isExpanded) => {
    setExpandedFaq(isExpanded ? panel : false);
  };

  /* ── shared palette ── */
  const navy = "#1A428A";
  const navyDark = "#0F2B5E";
  const navyLight = "#EDF2FA";
  const textPrimary = isDark ? "#F1F5F9" : "#1A202C";
  const textSecondary = isDark ? "#94A3B8" : "#64748B";
  const cardBgColor = isDark ? "rgba(255,255,255,0.04)" : "#FFFFFF";
  const pageBg = isDark ? "background.default" : "#FAFBFD";
  const sectionBg = isDark ? "background.paper" : "#FFFFFF";

  return (
    <Box sx={{ bgcolor: pageBg, pb: 0 }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      {/* ━━━ HERO (UNCHANGED) ━━━ */}
      <Box
        sx={{
          position: "relative",
          height: { xs: "50vh", sm: "60vh", md: "70vh" },
          minHeight: { xs: 320, md: 420 },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          bgcolor: "grey.900",
        }}
      >
        <Box
          component="img"
          src={aboutHero.src}
          alt="About Us"
          sx={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 0.55,
          }}
        />
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.25) 40%, rgba(0,0,0,0.75) 100%)",
          }}
        />
        <Container
          maxWidth="md"
          sx={{
            position: "relative",
            zIndex: 10,
            textAlign: "center",
            color: "common.white",
            mt: { xs: 6, md: 8 },
            px: { xs: 2, sm: 3 },
          }}
        >
          <Typography
            variant="overline"
            sx={{
              letterSpacing: 3,
              color: "secondary.main",
              fontWeight: 700,
              fontSize: { xs: "0.75rem", md: "0.85rem" },
              textShadow: "0 2px 8px rgba(0,0,0,0.6)",
            }}
          >
            WHO WE ARE
          </Typography>
          <Typography
            variant="h1"
            fontWeight={900}
            sx={{
              mt: 1.5,
              mb: 2,
              textShadow: "0 4px 16px rgba(0,0,0,0.5)",
              color: "common.white",
              lineHeight: 1.15,
            }}
          >
            About Origin Tours &amp; Travels –
            <br />
            10+ years serving Hyderabad
          </Typography>
          <Typography
            variant="body1"
            sx={{
              opacity: 0.9,
              maxWidth: 620,
              mx: "auto",
              lineHeight: 1.8,
              textShadow: "0 2px 6px rgba(0,0,0,0.5)",
              color: "common.white",
              fontSize: { xs: "0.95rem", md: "1.1rem" },
            }}
          >
            Hyderabad&apos;s trusted travel agency since 2010 — experts in
            Umrah, Hajj, holiday packages, air ticketing and personalised travel
            services.
          </Typography>
        </Container>
      </Box>

      {/* ━━━ ABOUT US INTRO ━━━ */}
      <Box sx={{ py: { xs: 8, md: 14 }, bgcolor: sectionBg }}>
        <Container maxWidth="lg">
          <Grid container spacing={{ xs: 5, md: 8 }} alignItems="center">
            {/* Text Side */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Chip
                label="ABOUT US"
                size="small"
                sx={{
                  bgcolor: isDark ? "rgba(26,66,138,0.2)" : navyLight,
                  color: navy,
                  fontWeight: 700,
                  letterSpacing: 1.5,
                  fontSize: "0.7rem",
                  mb: 3,
                  borderRadius: "8px",
                }}
              />
              <Typography
                variant="h2"
                fontWeight={800}
                sx={{
                  color: textPrimary,
                  mb: 3,
                  lineHeight: 1.15,
                  fontFamily: "var(--font-playfair), serif",
                }}
              >
                A travel agency built on trust, care and expertise.
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: textSecondary, lineHeight: 1.9, mb: 2 }}
              >
                Origin Tours and Travels is a premier agency offering air
                ticketing, tourism, and hotel reservation services. We are
                committed to delivering top-quality experiences, ensuring
                customer satisfaction through reliable, personalized travel
                solutions for every journey.
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: textSecondary, lineHeight: 1.9, mb: 5 }}
              >
                Our agency is led by travel professionals with over 10 years of
                experience in organizing successful trips for individuals,
                families, and groups.
              </Typography>

              {/* Stats Row */}
              <Stack
                direction="row"
                spacing={{ xs: 3, md: 5 }}
                sx={{ mb: 5 }}
              >
                {[
                  { value: 10, suffix: "+", label: "Years" },
                  { value: 50, suffix: "+", label: "Countries" },
                  { value: 1000, suffix: "+", label: "Happy Travellers" },
                ].map((stat, i) => (
                  <Box key={i}>
                    <Typography
                      variant="h3"
                      fontWeight={900}
                      sx={{ color: navy, lineHeight: 1 }}
                    >
                      <AnimatedCount
                        end={stat.value}
                        suffix={stat.suffix}
                        duration={2000 + i * 300}
                      />
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: textSecondary,
                        fontWeight: 600,
                        mt: 0.5,
                      }}
                    >
                      {stat.label}
                    </Typography>
                  </Box>
                ))}
              </Stack>

              {/* Buttons */}
              <Stack direction="row" spacing={2}>
                <Button
                  component={RouterLink}
                  href="/tours"
                  variant="contained"
                  sx={{
                    bgcolor: navy,
                    color: "white",
                    borderRadius: radius.button,
                    px: 4,
                    py: 1.5,
                    textTransform: "none",
                    fontWeight: 600,
                    "&:hover": {
                      bgcolor: navyDark,
                    },
                  }}
                >
                  Explore Services
                </Button>
                <Button
                  component={RouterLink}
                  href="/contact"
                  variant="outlined"
                  sx={{
                    borderColor: navy,
                    color: navy,
                    borderRadius: radius.button,
                    px: 4,
                    py: 1.5,
                    textTransform: "none",
                    fontWeight: 600,
                    "&:hover": {
                      bgcolor: navyLight,
                      borderColor: navyDark,
                    },
                  }}
                >
                  Contact Us
                </Button>
              </Stack>
            </Grid>

            {/* Image Side */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                sx={{
                  borderRadius: "24px",
                  overflow: "hidden",
                  height: { xs: 320, md: 520 },
                  position: "relative",
                }}
              >
                <Box
                  component="img"
                  src={aboutHero.src}
                  alt="Origin Tours and Travels office"
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ━━━ VISION & MISSION ━━━ */}
      <Box sx={{ py: { xs: 7, md: 10 }, bgcolor: pageBg }}>
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              borderRadius: { xs: "24px", md: "28px" },
              overflow: "hidden",
              boxShadow: shadow.elevated,
              border: isDark
                ? "3px solid rgba(26,66,138,0.4)"
                : `3px solid ${navy}`,
            }}
          >
            {/* ── Vision Panel (Left / Dark Navy) ── */}
            <Box
              sx={{
                flex: 1,
                bgcolor: isDark ? "rgba(15,30,60,0.95)" : "#142952",
                background: isDark
                  ? "linear-gradient(160deg, #0F1E3C 0%, #1A3060 100%)"
                  : "linear-gradient(160deg, #142952 0%, #1A3568 50%, #1E3F78 100%)",
                p: { xs: 4, sm: 5, md: 6 },
                color: "white",
                position: "relative",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                minHeight: { xs: 380, md: 420 },
              }}
            >
              {/* Decorative concentric circles */}
              {[180, 240, 300].map((size, i) => (
                <Box
                  key={i}
                  sx={{
                    position: "absolute",
                    top: "50%",
                    right: { xs: -size * 0.45, md: -size * 0.35 },
                    transform: "translateY(-50%)",
                    width: size,
                    height: size,
                    borderRadius: "50%",
                    border: `1px solid rgba(255,255,255,${0.06 - i * 0.015})`,
                    pointerEvents: "none",
                  }}
                />
              ))}

              <Box sx={{ position: "relative", zIndex: 1 }}>
                <Typography
                  variant="overline"
                  sx={{
                    color: "#5B8BD4",
                    fontWeight: 700,
                    letterSpacing: 4,
                    fontSize: "0.7rem",
                    mb: 3,
                    display: "block",
                  }}
                >
                  OUR VISION
                </Typography>
                <Typography
                  variant="h3"
                  sx={{
                    fontFamily: "var(--font-playfair), serif",
                    fontWeight: 700,
                    lineHeight: 1.2,
                    mb: 3,
                    fontSize: { xs: "1.75rem", sm: "2rem", md: "2.25rem" },
                  }}
                >
                  Inspire the world,
                  <br />
                  <Box
                    component="em"
                    sx={{
                      fontStyle: "italic",
                      fontWeight: 400,
                    }}
                  >
                    one journey at a time.
                  </Box>
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: "rgba(255,255,255,0.7)",
                    lineHeight: 1.85,
                    fontFamily: "var(--font-playfair), serif",
                    fontSize: { xs: "0.9rem", md: "0.95rem" },
                    maxWidth: 440,
                  }}
                >
                  To inspire people to explore the world, experience diverse
                  cultures, and create unforgettable travel experiences that
                  broaden horizons and leave a lasting impact on their lives.
                </Typography>
              </Box>

              {/* Tags */}
              <Stack
                direction="row"
                spacing={1}
                flexWrap="wrap"
                useFlexGap
                sx={{ position: "relative", zIndex: 1, mt: 4 }}
              >
                {[
                  "Cultural Exploration",
                  "Global Recognition",
                  "Integrity First",
                  "Lasting Impact",
                ].map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    size="small"
                    sx={{
                      bgcolor: "rgba(255,255,255,0.1)",
                      color: "rgba(255,255,255,0.85)",
                      fontWeight: 500,
                      fontSize: "0.75rem",
                      borderRadius: "20px",
                      border: "1px solid rgba(255,255,255,0.12)",
                      height: 30,
                      mb: 0.5,
                      "& .MuiChip-label": { px: 1.5 },
                    }}
                  />
                ))}
              </Stack>
            </Box>

            {/* ── Mission Panel (Right / White with Navy Border) ── */}
            <Box
              sx={{
                flex: 1,
                bgcolor: isDark ? "rgba(20,25,40,0.95)" : "#FFFFFF",
                p: { xs: 4, sm: 5, md: 6 },
                position: "relative",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                minHeight: { xs: 380, md: 420 },
              }}
            >
              {/* Decorative concentric circles (gray) */}
              {[160, 220, 280].map((size, i) => (
                <Box
                  key={i}
                  sx={{
                    position: "absolute",
                    top: "50%",
                    right: { xs: -size * 0.45, md: -size * 0.3 },
                    transform: "translateY(-50%)",
                    width: size,
                    height: size,
                    borderRadius: "50%",
                    border: `1px solid ${
                      isDark
                        ? `rgba(255,255,255,${0.04 - i * 0.01})`
                        : `rgba(0,0,0,${0.06 - i * 0.015})`
                    }`,
                    pointerEvents: "none",
                  }}
                />
              ))}

              <Box sx={{ position: "relative", zIndex: 1 }}>
                <Typography
                  variant="overline"
                  sx={{
                    color: "#C2662D",
                    fontWeight: 700,
                    letterSpacing: 4,
                    fontSize: "0.7rem",
                    mb: 3,
                    display: "block",
                  }}
                >
                  OUR MISSION
                </Typography>
                <Typography
                  variant="h3"
                  sx={{
                    fontFamily: "var(--font-playfair), serif",
                    fontWeight: 700,
                    lineHeight: 1.2,
                    mb: 3,
                    color: textPrimary,
                    fontSize: { xs: "1.75rem", sm: "2rem", md: "2.25rem" },
                  }}
                >
                  Expert-planned travel,
                  <br />
                  from pilgrimages to leisure.
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: textSecondary,
                    lineHeight: 1.85,
                    fontFamily: "var(--font-playfair), serif",
                    fontSize: { xs: "0.9rem", md: "0.95rem" },
                    maxWidth: 460,
                  }}
                >
                  To deliver comprehensive, compassionate travel experiences
                  with meticulous planning, genuine care, and unmatched
                  expertise — setting the benchmark in air ticketing, tourism,
                  and pilgrimage tours.
                </Typography>
              </Box>

              {/* Tags */}
              <Stack
                direction="row"
                spacing={1}
                flexWrap="wrap"
                useFlexGap
                sx={{ position: "relative", zIndex: 1, mt: 4 }}
              >
                {[
                  "Hajj & Umrah",
                  "Leisure Travel",
                  "Expert Guidance",
                  "Family Friendly",
                ].map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    size="small"
                    variant="outlined"
                    sx={{
                      borderColor: isDark
                        ? "rgba(194,102,45,0.4)"
                        : "#C2662D",
                      color: isDark ? "#D4915A" : "#C2662D",
                      fontWeight: 500,
                      fontSize: "0.75rem",
                      borderRadius: "20px",
                      height: 30,
                      mb: 0.5,
                      "& .MuiChip-label": { px: 1.5 },
                    }}
                  />
                ))}
              </Stack>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* ━━━ OUR SERVICES — Bento Grid ━━━ */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: sectionBg }}>
        <Container maxWidth="lg">
          <Box sx={{ mb: { xs: 5, md: 8 } }}>
            <Chip
              label="WHY TRAVEL WITH US"
              size="small"
              sx={{
                bgcolor: isDark ? "rgba(26,66,138,0.2)" : navyLight,
                color: navy,
                fontWeight: 700,
                letterSpacing: 1.5,
                fontSize: "0.7rem",
                mb: 2,
                borderRadius: "8px",
              }}
            />
            <Typography
              variant="h3"
              fontWeight={800}
              sx={{
                color: textPrimary,
                fontFamily: "var(--font-playfair), serif",
              }}
            >
              Our Services
            </Typography>
          </Box>

          {/* Bento Grid */}
          <Grid container spacing={3}>
            {[
              {
                id: "01",
                title: "Air Ticketing",
                desc: "Competitive fares on domestic & international flights with IATA-accredited reliability.",
                img: "/assets/services/air-ticketing.png",
                size: { xs: 12, md: 6 },
                height: { xs: 280, md: 320 },
                titleVariant: "h5",
              },
              {
                id: "02",
                title: "Hajj & Umrah",
                desc: "Fully arranged pilgrimage packages — visas, accommodation, and expert guidance.",
                img: "/assets/services/hajj-umrah.png",
                size: { xs: 12, sm: 6, md: 3 },
                height: { xs: 240, md: 320 },
                titleVariant: "h6",
              },
              {
                id: "03",
                title: "Personalized Itineraries",
                desc: "Bespoke trip crafting tailored to your budget and personal style.",
                img: "/assets/services/personalized-itineraries.png",
                size: { xs: 12, sm: 6, md: 3 },
                height: { xs: 240, md: 320 },
                titleVariant: "h6",
              },
              {
                id: "04",
                title: "Leisure Tours",
                desc: "Curated group and individual tours across continents.",
                img: "/assets/services/leisure-tours.png",
                size: { xs: 12, sm: 6, md: 3 },
                height: { xs: 240, md: 280 },
                titleVariant: "h6",
              },
              {
                id: "05",
                title: "24/7 Support",
                desc: "We're with you before, during, and after your journey.",
                img: "/assets/services/support-service.png",
                size: { xs: 12, sm: 6, md: 3 },
                height: { xs: 240, md: 280 },
                titleVariant: "h6",
              },
              {
                id: "06",
                title: "Local Recommendations",
                desc: "Ground-level insight from a team that has been navigating these routes for over a decade.",
                img: "/assets/services/local-recommendations.png",
                size: { xs: 12, md: 6 },
                height: { xs: 240, md: 280 },
                titleVariant: "h6",
              },
            ].map((service, idx) => (
              <Grid size={service.size} key={idx}>
                <Box
                  sx={{
                    borderRadius: "20px",
                    overflow: "hidden",
                    position: "relative",
                    height: service.height,
                    backgroundImage: `url(${service.img})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    "&:hover .service-overlay": {
                      background:
                        "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3) 100%)",
                    },
                    "&:hover .service-desc": {
                      opacity: 1,
                      maxHeight: "150px",
                      mt: 1,
                    },
                  }}
                >
                  <Box
                    className="service-overlay"
                    sx={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.1) 60%)",
                      transition: "background 0.3s ease",
                    }}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 24,
                      left: 24,
                      right: 24,
                    }}
                  >
                    <Typography
                      variant="overline"
                      sx={{
                        color: "rgba(255,255,255,0.7)",
                        fontWeight: 600,
                        letterSpacing: 2,
                      }}
                    >
                      {service.id}
                    </Typography>
                    <Typography
                      variant={service.titleVariant}
                      fontWeight={700}
                      sx={{
                        color: "white",
                        fontFamily: "var(--font-playfair), serif",
                      }}
                    >
                      {service.title}
                    </Typography>
                    <Box
                      className="service-desc"
                      sx={{
                        opacity: 0,
                        maxHeight: 0,
                        overflow: "hidden",
                        transition: "all 0.4s ease",
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{ color: "rgba(255,255,255,0.85)" }}
                      >
                        {service.desc}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ━━━ WE COVER THE GLOBE ━━━ */}
      <Box
        sx={{
          py: { xs: 8, md: 12 },
          bgcolor: isDark ? "#0F172A" : navyDark,
          color: "white",
        }}
      >
        <Container maxWidth="lg">
          <Stack
            direction={{ xs: "column", md: "row" }}
            justifyContent="space-between"
            alignItems={{ md: "flex-end" }}
            sx={{ mb: { xs: 5, md: 8 } }}
          >
            <Box>
              <Chip
                label="WHERE WE GO"
                size="small"
                sx={{
                  bgcolor: "rgba(255,255,255,0.1)",
                  color: "rgba(255,255,255,0.8)",
                  fontWeight: 700,
                  letterSpacing: 1.5,
                  fontSize: "0.7rem",
                  mb: 2,
                  borderRadius: "8px",
                }}
              />
              <Typography
                variant="h3"
                fontWeight={800}
                sx={{
                  color: "white",
                  fontFamily: "var(--font-playfair), serif",
                }}
              >
                We cover the globe
              </Typography>
            </Box>
            <Typography
              variant="body1"
              sx={{
                color: "rgba(255,255,255,0.6)",
                maxWidth: 400,
                mt: { xs: 2, md: 0 },
              }}
            >
              From the sacred lands of Saudi Arabia to vibrant cultures across
              every continent.
            </Typography>
          </Stack>

          <Grid container spacing={3}>
            {[
              {
                region: "Middle East",
                countries: "Saudi Arabia • UAE • Jordan",
                img: "https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?auto=format&fit=crop&w=500&q=80",
              },
              {
                region: "South Asia",
                countries: "India • Maldives • Sri Lanka",
                img: "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=500&q=80",
              },
              {
                region: "East Asia",
                countries: "Japan • Thailand • South Korea",
                img: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=500&q=80",
              },
              {
                region: "Africa",
                countries: "Morocco • Kenya • Egypt",
                img: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=500&q=80",
              },
            ].map((dest, idx) => (
              <Grid size={{ xs: 6, md: 3 }} key={idx}>
                <Box
                  sx={{
                    height: { xs: 300, md: 420 },
                    borderRadius: "20px",
                    overflow: "hidden",
                    position: "relative",
                    backgroundImage: `url(${dest.img})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    transition: "transform 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.75) 100%)",
                    }}
                  />
                  <Box sx={{ position: "absolute", top: 16, left: 16 }}>
                    <Chip
                      label={dest.region}
                      size="small"
                      sx={{
                        bgcolor: "rgba(255,255,255,0.2)",
                        backdropFilter: "blur(8px)",
                        color: "white",
                        fontWeight: 600,
                        fontSize: "0.72rem",
                        borderRadius: "8px",
                      }}
                    />
                  </Box>
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 24,
                      left: 24,
                      right: 24,
                    }}
                  >
                    <Typography
                      variant="h6"
                      fontWeight={700}
                      sx={{
                        color: "white",
                        mb: 0.5,
                        fontFamily: "var(--font-playfair), serif",
                      }}
                    >
                      {dest.region}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "rgba(255,255,255,0.65)", fontSize: "0.8rem" }}
                    >
                      {dest.countries}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ━━━ WHAT WE STAND FOR ━━━ */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: sectionBg }}>
        <Container maxWidth="lg">
          <Box sx={{ mb: { xs: 5, md: 8 } }}>
            <Chip
              label="OUR VALUES"
              size="small"
              sx={{
                bgcolor: isDark ? "rgba(26,66,138,0.2)" : navyLight,
                color: navy,
                fontWeight: 700,
                letterSpacing: 1.5,
                fontSize: "0.7rem",
                mb: 2,
                borderRadius: "8px",
              }}
            />
            <Typography
              variant="h3"
              fontWeight={800}
              sx={{
                color: textPrimary,
                fontFamily: "var(--font-playfair), serif",
              }}
            >
              What we stand for
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {[
              {
                icon: Handshake,
                title: "Trust & Reliability",
                desc: "Building lasting relationships through transparent, honest travel services you can count on every time.",
                accentColor: "#2563EB",
                color: sectionColors.blue,
              },
              {
                icon: Groups,
                title: "Customer First",
                desc: "Every journey is personalized to your needs. Your satisfaction isn\u2019t just a goal — it\u2019s our promise.",
                accentColor: "#059669",
                color: sectionColors.emerald,
              },
              {
                icon: EmojiEvents,
                title: "Excellence",
                desc: "Over a decade of industry expertise ensures the highest standards in every service we deliver.",
                accentColor: "#D97706",
                color: sectionColors.amber,
              },
              {
                icon: TravelExplore,
                title: "Global Reach",
                desc: "From local getaways to international pilgrimages, our network spans the globe to serve you anywhere.",
                accentColor: "#7C3AED",
                color: sectionColors.purple,
              },
            ].map((val, i) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={i}>
                <Box
                  sx={{
                    borderRadius: "20px",
                    bgcolor: cardBgColor,
                    border: isDark
                      ? "1px solid rgba(255,255,255,0.06)"
                      : "1px solid #E2E8F0",
                    p: { xs: 3, md: 4 },
                    height: "100%",
                    borderTop: `4px solid ${val.accentColor}`,
                    transition: "all 0.3s ease-out",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: shadow.cardHover,
                    },
                  }}
                >
                  <Box
                    sx={{
                      ...iconContainerSx(val.color),
                      mx: 0,
                      width: 52,
                      height: 52,
                      mb: 3,
                    }}
                  >
                    <val.icon sx={{ fontSize: 24, color: "white" }} />
                  </Box>
                  <Typography
                    variant="h6"
                    fontWeight={700}
                    sx={{ color: textPrimary, mb: 1.5 }}
                  >
                    {val.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: textSecondary, lineHeight: 1.7 }}
                  >
                    {val.desc}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ━━━ CERTIFICATIONS & AFFILIATIONS ━━━ */}
      <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: pageBg }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: { xs: 5, md: 8 } }}>
            <Chip
              label="TRUSTED & ACCREDITED"
              size="small"
              sx={{
                bgcolor: isDark ? "rgba(26,66,138,0.2)" : navyLight,
                color: navy,
                fontWeight: 700,
                letterSpacing: 1.5,
                fontSize: "0.7rem",
                mb: 2,
                borderRadius: "8px",
              }}
            />
            <Typography
              variant="h3"
              fontWeight={800}
              sx={{
                color: textPrimary,
                fontFamily: "var(--font-playfair), serif",
              }}
            >
              Certifications & affiliations
            </Typography>
          </Box>

          <Grid container spacing={3} justifyContent="center">
            {[
              {
                icon: Security,
                title: "IATA",
                subtitle: "Accredited Agent",
                desc: "Recognised for international air ticketing standards.",
                color: sectionColors.blue,
              },
              {
                icon: Handshake,
                title: "TAAI",
                subtitle: "Member",
                desc: "Member of the Travel Agents Association of India.",
                color: sectionColors.teal,
              },
              {
                icon: EmojiEvents,
                title: "Hajj",
                subtitle: "Approved Operator",
                desc: "Authorised to arrange pilgrimage travel from Hyderabad.",
                color: sectionColors.amber,
              },
              {
                icon: Star,
                title: "10+",
                subtitle: "Years of Trust",
                desc: "Serving Hyderabad travellers since 2010.",
                color: sectionColors.rose,
              },
            ].map((cert, i) => (
              <Grid size={{ xs: 6, sm: 3 }} key={i}>
                <Box
                  sx={{
                    borderRadius: "20px",
                    bgcolor: cardBgColor,
                    border: isDark
                      ? "1px solid rgba(255,255,255,0.06)"
                      : "1px solid #E2E8F0",
                    p: { xs: 3, md: 4 },
                    textAlign: "center",
                    height: "100%",
                    transition: "all 0.3s ease-out",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: shadow.cardHover,
                    },
                  }}
                >
                  <Box
                    sx={{
                      ...iconContainerSx(cert.color),
                      width: 52,
                      height: 52,
                      mb: 2.5,
                    }}
                  >
                    <cert.icon sx={{ fontSize: 24, color: "white" }} />
                  </Box>
                  <Typography
                    variant="h5"
                    fontWeight={800}
                    sx={{
                      color: cert.color.text,
                      mb: 0.5,
                      fontFamily: "var(--font-playfair), serif",
                    }}
                  >
                    {cert.title}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: textSecondary,
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: 1,
                      display: "block",
                      mb: 1.5,
                    }}
                  >
                    {cert.subtitle}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: textSecondary, lineHeight: 1.6 }}
                  >
                    {cert.desc}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ━━━ FAQs ━━━ */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: sectionBg }}>
        <Container maxWidth="md">
          <Box sx={{ textAlign: "center", mb: { xs: 5, md: 8 } }}>
            <Chip
              label="ABOUT US FAQS"
              size="small"
              sx={{
                bgcolor: isDark ? "rgba(26,66,138,0.2)" : navyLight,
                color: navy,
                fontWeight: 700,
                letterSpacing: 1.5,
                fontSize: "0.7rem",
                mb: 2,
                borderRadius: "8px",
              }}
            />
            <Typography
              variant="h3"
              fontWeight={800}
              sx={{
                color: textPrimary,
                mb: 2,
                fontFamily: "var(--font-playfair), serif",
              }}
            >
              Questions about Origin Tours & Travels
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: textSecondary, lineHeight: 1.8 }}
            >
              Can&apos;t find what you need? Reach out and our team will respond
              promptly.
            </Typography>
          </Box>

          {aboutFaqs.map((faq, index) => (
            <Accordion
              key={index}
              expanded={expandedFaq === `panel${index}`}
              onChange={handleFaqChange(`panel${index}`)}
              elevation={0}
              sx={{
                bgcolor: "transparent",
                borderBottom: isDark
                  ? "1px solid rgba(255,255,255,0.08)"
                  : "1px solid #E2E8F0",
                "&:before": { display: "none" },
                "&.Mui-expanded": { m: 0 },
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: textSecondary }} />}
                sx={{ px: 0, py: 2 }}
              >
                <Typography
                  variant="subtitle1"
                  fontWeight={600}
                  sx={{ color: textPrimary }}
                >
                  {faq.q}
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ px: 0, pb: 3 }}>
                <Typography
                  variant="body1"
                  sx={{ color: textSecondary, lineHeight: 1.8 }}
                >
                  {faq.a}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Container>
      </Box>

      {/* ━━━ CTA ━━━ */}
      <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: pageBg }}>
        <Container maxWidth="lg">
          <Box
            sx={{
              background: `linear-gradient(135deg, ${navy} 0%, #2AB0E5 100%)`,
              borderRadius: "24px",
              p: { xs: 4, md: 8 },
              color: "white",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Decorative rings */}
            <Box
              sx={{
                position: "absolute",
                top: -150,
                right: -100,
                width: 450,
                height: 450,
                borderRadius: "50%",
                border: "1px solid rgba(255,255,255,0.1)",
                pointerEvents: "none",
              }}
            />
            <Box
              sx={{
                position: "absolute",
                top: -50,
                right: 0,
                width: 250,
                height: 250,
                borderRadius: "50%",
                border: "1px solid rgba(255,255,255,0.05)",
                pointerEvents: "none",
              }}
            />
            <Box
              sx={{
                position: "absolute",
                bottom: -100,
                left: "40%",
                width: 300,
                height: 300,
                borderRadius: "50%",
                border: "1px solid rgba(255,255,255,0.1)",
                pointerEvents: "none",
              }}
            />

            <Grid
              container
              spacing={4}
              alignItems="center"
              position="relative"
              zIndex={1}
            >
              <Grid size={{ xs: 12, md: 7 }}>
                <Chip
                  icon={
                    <LocalPhoneOutlined
                      style={{ color: "rgba(255,255,255,0.8)", fontSize: 18 }}
                    />
                  }
                  label="READY TO TRAVEL?"
                  sx={{
                    bgcolor: "rgba(255,255,255,0.1)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "white",
                    fontWeight: 600,
                    letterSpacing: 1.5,
                    px: 1,
                    mb: 3,
                  }}
                />
                <Typography
                  variant="h3"
                  fontWeight={700}
                  sx={{ mb: 2, fontFamily: "var(--font-playfair), serif" }}
                >
                  Need a hand with your
                  <br />
                  travel plans?
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ opacity: 0.9, lineHeight: 1.8, maxWidth: 500 }}
                >
                  Our experts are ready to help you plan the perfect trip. Get in
                  touch today and let&apos;s make your travel dreams a reality.
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, md: 5 }}>
                <Stack
                  direction="column"
                  spacing={2}
                  alignItems={{ xs: "flex-start", md: "center" }}
                  sx={{ width: "100%", pr: { md: 4 } }}
                >
                  <Button
                    component={RouterLink}
                    href="tel:+919876543210"
                    variant="contained"
                    startIcon={<LocalPhoneOutlined />}
                    sx={{
                      bgcolor: "white",
                      color: navy,
                      "&:hover": { bgcolor: "#F8FAFC" },
                      borderRadius: radius.button,
                      px: 4,
                      py: 1.5,
                      textTransform: "none",
                      fontWeight: 600,
                      width: { xs: "100%", sm: "240px" },
                      boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
                    }}
                  >
                    Call us now
                  </Button>
                  <Button
                    component={RouterLink}
                    href="/contact"
                    variant="outlined"
                    startIcon={<EmailOutlined />}
                    sx={{
                      borderColor: "rgba(255,255,255,0.4)",
                      color: "white",
                      "&:hover": {
                        borderColor: "white",
                        bgcolor: "rgba(255,255,255,0.1)",
                      },
                      borderRadius: radius.button,
                      px: 4,
                      py: 1.5,
                      textTransform: "none",
                      fontWeight: 600,
                      width: { xs: "100%", sm: "240px" },
                    }}
                  >
                    Send an email
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default About;
