"use client";
import Link from "next/link";
import { useReducedMotion } from "framer-motion";
import { Box, Container, Typography, Button } from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const HERO_SX = {
  position: "relative",
  height: { xs: "80vh", md: "85vh" },
  maxHeight: 820,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
  bgcolor: "grey.900",
};

const OVERLAY_GRADIENT =
  "linear-gradient(to bottom, rgba(0,0,0,0.7), rgba(0,0,0,0.25), rgba(0,0,0,0.8))";

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

function HeroSlide({ slide }) {
  return (
    <Box sx={HERO_SX}>
      {slide.image && (
        <Box
          component="img"
          src={slide.image}
          alt={slide.title || "Hero slide"}
          loading="eager"
          sx={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: 0,
          }}
        />
      )}
      <Box sx={{ position: "absolute", inset: 0, zIndex: 1, background: OVERLAY_GRADIENT }} />
      <Container sx={{ position: "relative", zIndex: 10, textAlign: "center", color: "common.white" }}>
        {slide.title && (
          <Typography
            variant="h2"
            component="h2"
            sx={{
              fontFamily: "var(--font-priestacy), cursive",
              fontWeight: 400,
              fontStyle: "normal",
              color: "common.white",
              fontSize: { xs: "2rem", sm: "3rem", md: "4rem" },
              lineHeight: 1.15,
              textShadow: "0 4px 30px rgba(0,0,0,0.5)",
              mb: 2,
            }}
          >
            {slide.title}
          </Typography>
        )}
        {slide.subtitle && (
          <Typography
            sx={{
              color: "rgba(255,255,255,0.92)",
              fontSize: { xs: "1rem", md: "1.3rem" },
              lineHeight: 1.6,
              maxWidth: 680,
              mx: "auto",
              mb: 4,
              textShadow: "0 2px 16px rgba(0,0,0,0.5)",
            }}
          >
            {slide.subtitle}
          </Typography>
        )}
        {slide.ctaLabel && slide.ctaHref && (
          <HeroButton href={slide.ctaHref} variant="contained">
            {slide.ctaLabel}
          </HeroButton>
        )}
      </Container>
    </Box>
  );
}

export default function HeroSlideCarousel({ slides, autoplay, interval, speed, loop, showDots, pauseOnHover }) {
  const prefersReduced = useReducedMotion();
  const multi = slides.length > 1;
  const doAutoplay = autoplay && !prefersReduced && multi;

  return (
    <Box
      component="section"
      sx={{
        position: "relative",
        bgcolor: "grey.900",
        "& .swiper": { width: "100%" },
        "& .swiper-pagination": { bottom: "56px !important" },
        "& .swiper-pagination-bullet": {
          width: 10,
          height: 10,
          bgcolor: "common.white",
          opacity: 0.5,
        },
        "& .swiper-pagination-bullet-active": { opacity: 1, bgcolor: "primary.main" },
      }}
    >
      <Typography variant="h1" component="h1" sx={visuallyHidden}>
        Holiday Packages, Umrah, Hajj &amp; Travel Services
      </Typography>
      <Swiper
        modules={[Autoplay, Pagination, A11y]}
        slidesPerView={1}
        speed={speed}
        loop={loop && multi}
        autoplay={
          doAutoplay
            ? { delay: interval, disableOnInteraction: false, pauseOnMouseEnter: pauseOnHover }
            : false
        }
        pagination={showDots ? { clickable: true } : false}
        a11y={{ enabled: true }}
      >
        {slides.map((slide, i) => (
          <SwiperSlide key={i}>
            <HeroSlide slide={slide} />
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
}
