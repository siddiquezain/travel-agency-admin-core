"use client";
import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
  IconButton,
  CircularProgress,
} from "@mui/material";
import ArrowForward from "@mui/icons-material/ArrowForward";
import ChevronLeft from "@mui/icons-material/ChevronLeft";
import ChevronRight from "@mui/icons-material/ChevronRight";
import ServiceCard from "../../components/ServiceCard";

const FeaturedCarousel = dynamic(() => import("./FeaturedCarousel"), {
  ssr: false,
});

const SLIDES_PER_VIEW_DESKTOP = 3;

const FeaturedSection = ({
  title,
  subtitle,
  items,
  loading,
  type,
  variant,
  linkTo,
  linkLabel,
  bgColor = "background.paper",
  autoplay = true,
  interval = 5000,
  speed = 600,
  loop = true,
  showDots = true,
  showArrows = true,
  pauseOnHover = true,
}) => {
  const containerRef = useRef(null);
  const swiperHolder = useRef(null);
  const [activate, setActivate] = useState(false);

  useEffect(() => {
    if (activate) return;
    const node = containerRef.current;
    if (!node) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActivate(true);
          io.disconnect();
        }
      },
      { rootMargin: "200px 0px" }
    );
    io.observe(node);
    return () => io.disconnect();
  }, [activate]);

  if (!loading && (!items || items.length === 0)) return null;

  const showNav = showArrows && !loading && (items?.length ?? 0) > SLIDES_PER_VIEW_DESKTOP;

  // Explicit speed: the marquee's default transition is seconds long, which
  // would make the arrow buttons feel unresponsive.
  const handlePrev = () => swiperHolder.current?.slidePrev(600);
  const handleNext = () => swiperHolder.current?.slideNext(600);

  return (
    <Box component="section" sx={{ py: { xs: 8, md: 12 }, bgcolor: bgColor }}>
      <Container>
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", md: "flex-end" }}
          mb={6}
          spacing={4}
        >
          <Box>
            <Typography variant="h6" color="secondary" gutterBottom>
              {subtitle}
            </Typography>
            <Typography variant="h2" color="primary">
              {title}
            </Typography>
          </Box>

          <Stack direction="row" alignItems="center" spacing={1.5}>
            <IconButton
              onClick={handlePrev}
              aria-label={`Previous ${title}`}
              sx={{
                display: { xs: "none", sm: showNav ? "inline-flex" : "none" },
                border: 1,
                borderColor: "primary.main",
                color: "primary.main",
                "&:hover": { bgcolor: "primary.main", color: "common.white" },
              }}
            >
              <ChevronLeft />
            </IconButton>
            <IconButton
              onClick={handleNext}
              aria-label={`Next ${title}`}
              sx={{
                display: { xs: "none", sm: showNav ? "inline-flex" : "none" },
                border: 1,
                borderColor: "primary.main",
                color: "primary.main",
                "&:hover": { bgcolor: "primary.main", color: "common.white" },
              }}
            >
              <ChevronRight />
            </IconButton>
            <Button
              component={Link}
              href={linkTo}
              endIcon={<ArrowForward sx={{ color: "secondary.main" }} />}
              sx={{
                fontSize: "1.1rem",
                fontWeight: 800,
                color: "primary.main",
              }}
            >
              {linkLabel}
            </Button>
          </Stack>
        </Stack>

        <Box ref={containerRef}>
          {loading ? (
            <Box sx={{ width: "100%", py: 10, display: "flex", justifyContent: "center" }}>
              <CircularProgress />
            </Box>
          ) : activate ? (
            <FeaturedCarousel
              items={items}
              type={type}
              variant={variant}
              autoplay={autoplay}
              loop={loop}
              pauseOnHover={pauseOnHover}
              slidesPerViewDesktop={SLIDES_PER_VIEW_DESKTOP}
              onSwiper={(s) => {
                swiperHolder.current = s;
              }}
            />
          ) : (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, 1fr)",
                  md: `repeat(${SLIDES_PER_VIEW_DESKTOP}, 1fr)`,
                },
                gap: { xs: 3, md: 4 },
              }}
            >
              {items.slice(0, SLIDES_PER_VIEW_DESKTOP).map((item) => (
                <ServiceCard key={item.id} item={item} type={type} variant={variant} />
              ))}
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default FeaturedSection;
