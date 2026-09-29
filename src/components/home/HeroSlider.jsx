"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import SearchBar from "../../components/SearchBar";
// Imported directly (not via dynamic ssr:false) so the hero is present in the
// initial SSR HTML — this is the LCP candidate. Swiper 11 is SSR-compatible.
import HeroSlideCarousel from "./HeroSlideCarousel";

const HERO_FADE_KEYFRAMES = {
  "@keyframes heroFadeUp": {
    "0%": { opacity: 0, transform: "translateY(30px)" },
    "100%": { opacity: 1, transform: "translateY(0)" },
  },
};

// Desktop keeps the background video; mobile gets the static WebP only — the
// 6.5MB video tanked Core Web Vitals on phones. The image is always rendered as
// the base layer (mobile LCP + desktop poster); the video is layered on top on
// desktop after mount, so mobile never downloads it.
const heroVideo = "/assets/home/hero-bg.mp4";
const heroImage = "/assets/home/hero-poster.webp";

const HERO_SX = {
  position: "relative",
  height: { xs: "88vh", md: "93.5vh" },
  maxHeight: 902,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  // Padding mirrors the fixed header height (top) and the search bar's
  // overlap into the hero (bottom), so flex centering places the caption
  // and CTAs in the visible band between the two.
  pt: { xs: "72px", md: "96px" },
  pb: { xs: "36px", md: "40px" },
  overflow: "hidden",
  bgcolor: "grey.900",
};

const OVERLAY_GRADIENT =
  "linear-gradient(to bottom, rgba(0,0,0,0.45), rgba(0,0,0,0.1), rgba(0,0,0,0.55))";

// Rotating text/CTA sets shown over the same video background. The Contact Us
// button is shared by every slide.
const TEXT_SLIDES = [
  {
    heading: "Your Trusted Travel Partner — Holidays, Visas & More",
    cta: { label: "Explore Packages", href: "/tours" },
  },
  {
    heading: "The World is Waiting. Where Will You Go Next?",
    cta: { label: "Start Exploring", href: "/tours?scope=international" },
  },
  {
    heading: "Discover Amazing Destinations. Leave the Planning to Us.",
    cta: { label: "Browse Tours", href: "/tours?scope=domestic" },
  },
  {
    heading: "Visa Services, Attestation & More — All in One Place.",
    cta: { label: "View Services", href: "/visas" },
  },
];
const TEXT_ROTATE_MS = 7000;

function HeroButton({ href, variant, children }) {
  const contained = variant === "contained";
  return (
    <Button
      component={Link}
      href={href}
      variant={variant}
      color="primary"
      size="large"
      sx={{
        px: 5,
        py: 2,
        fontSize: "1.1rem",
        borderRadius: 50,
        fontWeight: 700,
        textTransform: "none",
        transition: "all 0.3s",
        ...(contained
          ? {
              boxShadow: "0 0 30px rgba(0,136,204,0.4)",
              border: "1px solid rgba(255,255,255,0.1)",
              "&:hover": { boxShadow: "0 0 40px rgba(0,136,204,0.6)" },
            }
          : {
              borderColor: "rgba(255,255,255,0.3)",
              color: "white",
              backdropFilter: "blur(10px)",
              "&:hover": { borderColor: "white", bgcolor: "rgba(255,255,255,0.1)" },
            }),
      }}
    >
      {children}
    </Button>
  );
}

function VideoHero() {
  const theme = useTheme();
  // `noSsr` evaluates the query on the client only, so SSR/first paint renders
  // image-only (matching the server) and the video mounts on desktop after
  // hydration — no mismatch, and mobile never downloads the video.
  const showVideo = useMediaQuery(theme.breakpoints.up("md"), { noSsr: true });
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setActiveSlide((s) => (s + 1) % TEXT_SLIDES.length),
      TEXT_ROTATE_MS,
    );
    return () => clearInterval(id);
  }, []);

  return (
    <Box component="section" sx={HERO_SX}>
      {/* Base image layer — always present (mobile LCP, desktop poster) */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          "& img": { objectFit: "cover", filter: "brightness(1.1)" },
        }}
        aria-hidden="true"
      >
        <Image
          src={heroImage}
          alt=""
          fill
          priority
          sizes="100vw"
          quality={85}
        />
      </Box>
      {/* Desktop only: background video layered over the image */}
      {showVideo && (
        <Box
          component="video"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster={heroImage}
          aria-hidden="true"
          src={heroVideo}
          sx={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "brightness(1.1)",
            zIndex: 0,
          }}
        />
      )}
      <Box sx={{ position: "absolute", inset: 0, zIndex: 1, background: OVERLAY_GRADIENT }} />
      <Container
        sx={{
          position: "relative",
          zIndex: 10,
          textAlign: "center",
          color: "common.white",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Text slides stacked in the same grid cell; the active one slides
            in from the right while the previous one slides out to the left. */}
        <Box sx={{ display: "grid", width: "100%" }}>
          {TEXT_SLIDES.map((slide, i) => {
            const active = activeSlide === i;
            return (
              <Box
                key={slide.heading}
                sx={{
                  gridArea: "1 / 1",
                  opacity: active ? 1 : 0,
                  transform: active
                    ? "translateX(0)"
                    : i > activeSlide
                      ? "translateX(60px)"
                      : "translateX(-60px)",
                  transition: "opacity 0.8s ease, transform 0.8s ease",
                  pointerEvents: active ? "auto" : "none",
                  "@media (prefers-reduced-motion: reduce)": { transition: "none" },
                }}
                aria-hidden={!active}
              >
                <Box
                  sx={{
                    ...HERO_FADE_KEYFRAMES,
                    animation: "heroFadeUp 1s ease-out both",
                    "@media (prefers-reduced-motion: reduce)": { animation: "none" },
                  }}
                >
                  <Typography
                    variant="h1"
                    component={i === 0 ? "h1" : "p"}
                    sx={{
                      fontFamily: "var(--font-priestacy), cursive",
                      // !important so the global heading font-weight: 500 rule
                      // doesn't synthesize a faux-bold on this script font.
                      fontWeight: "400 !important",
                      fontStyle: "normal",
                      color: "common.white",
                      fontSize: { xs: "2rem", sm: "2.7rem", md: "3.5rem", lg: "4rem" },
                      lineHeight: 1.15,
                      textShadow: "0 4px 30px rgba(0,0,0,0.5)",
                      maxWidth: 920,
                      mx: "auto",
                      px: { xs: 2, sm: 0 },
                      mb: { xs: 2, sm: 3, md: 4 },
                    }}
                  >
                    {slide.heading}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    ...HERO_FADE_KEYFRAMES,
                    animation: "heroFadeUp 1s ease-out 0.5s both",
                    "@media (prefers-reduced-motion: reduce)": { animation: "none" },
                  }}
                >
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={3}
                    justifyContent="center"
                    alignItems="center"
                    sx={{ mt: { xs: 5, sm: 6, md: 7 } }}
                  >
                    <HeroButton href={slide.cta.href} variant="contained">
                      {slide.cta.label}
                    </HeroButton>
                    <HeroButton href="/contact" variant="outlined">
                      Contact Us
                    </HeroButton>
                  </Stack>
                </Box>
              </Box>
            );
          })}
        </Box>
      </Container>
    </Box>
  );
}

const HeroSlider = ({ slides = [], autoplay = true, interval = 5000, speed = 600, loop = true, showDots = true, pauseOnHover = true }) => {
  const hasSlides = Array.isArray(slides) && slides.length > 0;

  return (
    <>
      {hasSlides ? (
        <HeroSlideCarousel
          slides={slides}
          autoplay={autoplay}
          interval={interval}
          speed={speed}
          loop={loop}
          showDots={showDots}
          pauseOnHover={pauseOnHover}
        />
      ) : (
        <VideoHero />
      )}

      <Container maxWidth="md" sx={{ position: "relative", zIndex: 20, mt: -4, px: 2 }}>
        <SearchBar />
      </Container>
    </>
  );
};

export default HeroSlider;
