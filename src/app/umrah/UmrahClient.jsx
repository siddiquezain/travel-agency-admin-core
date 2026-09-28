"use client";
import React, { useMemo, useState, useEffect } from "react";
import ServiceCard from '../../components/ServiceCard';
import {
  Box,
  Container,
  Grid,
  Typography,
  TextField,
  Stack,
  InputAdornment,
  Button,
  MenuItem,
  Select,
  ListSubheader,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import Search from "@mui/icons-material/Search";
import AccessTimeOutlined from "@mui/icons-material/AccessTimeOutlined";
import AttachMoney from "@mui/icons-material/AttachMoney";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import Check from "@mui/icons-material/Check";
import VerifiedUserOutlined from "@mui/icons-material/VerifiedUserOutlined";
import PlaceOutlined from "@mui/icons-material/PlaceOutlined";
import GroupsOutlined from "@mui/icons-material/GroupsOutlined";
import FlightTakeoff from "@mui/icons-material/FlightTakeoff";
import PhoneOutlined from "@mui/icons-material/PhoneOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Star from "@mui/icons-material/Star";
import WorkspacePremiumOutlined from "@mui/icons-material/WorkspacePremiumOutlined";
import { AnimatePresence, motion } from "framer-motion";
import SkeletonCard from '../../components/skeletons/SkeletonCard';
import { radius, shadow } from '../../config/designSystem';
import { isUmrahTour } from '../../lib/tour-utils';
import {
  pillSelectSx,
  searchPillSx,
  pillMenuProps,
  menuHeaderSx,
  menuItemSx,
  MenuDot,
  pillValue,
} from '../../components/common/pillFilters';

const DURATION_LABELS = {
  short: "1–10 Days",
  medium: "11–20 Days",
  long: "20+ Days",
};
const PRICE_LABELS = { asc: "Low to High", desc: "High to Low" };

import umrahHeroPrimary from '../../assets/images/umrah/hero_primary.png';
import umrahPackages from '../../assets/images/umrah/packages.png';
import umrahVisa from '../../assets/images/umrah/visa.png';
import umrahCta from '../../assets/images/umrah/cta.png';
import gallery1 from '../../assets/images/umrah/gallery_1.png';
import gallery2 from '../../assets/images/umrah/gallery_2.png';
import gallery3 from '../../assets/images/umrah/gallery_3.png';

const UmrahClient = ({
  initialItems = [],
  city = "Hyderabad",
  airport = "Rajiv Gandhi International Airport (HYD)",
}) => {
   

  // Redesign palette: deep navy + antique gold on a warm cream base
  // (keys keep their historical names to avoid touching every usage below).
  const umrah = {
    emerald: "#0c1b3d",
    emeraldDark: "#08132b",
    gold: "#c9a227",
    softBg: "#f9f7f2",
    muted: "#6b6350",
  };

  const [search, setSearch] = useState("");
  const [priceSort, setPriceSort] = useState("");
  const [duration, setDuration] = useState("");

  const [allToursRaw, setAllToursRaw] = useState(initialItems);
  const [loading, setLoading] = useState(initialItems.length === 0);

  useEffect(() => {
    if (initialItems.length > 0) return;
    fetch('/api/public/tours')
      .then(r => r.json())
      .then(data => setAllToursRaw(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [initialItems.length]);

  const allTours = useMemo(() => {
    if (!allToursRaw.length) return [];
    return allToursRaw.filter(isUmrahTour);
  }, [allToursRaw]);

  const filteredTours = useMemo(() => {
    let filtered = allTours.filter((tour) => {
      const matchesSearch = tour.title
        .toLowerCase()
        .includes(search.toLowerCase());

      const details = tour.tourDetails || {};

      let matchesDuration = true;
      if (duration) {
        const days = parseInt(details.durationDaysNights, 10) || 0;
        if (duration === "short") matchesDuration = days <= 10;
        if (duration === "medium") matchesDuration = days > 10 && days <= 20;
        if (duration === "long") matchesDuration = days > 20;
      }

      return matchesSearch && matchesDuration;
    });

    if (priceSort) {
      filtered.sort((a, b) => {
        const priceA = parseInt(a.tourDetails?.price) || 0;
        const priceB = parseInt(b.tourDetails?.price) || 0;
        return priceSort === "asc" ? priceA - priceB : priceB - priceA;
      });
    }

    return filtered;
  }, [allTours, search, priceSort, duration]);

  const [visibleCount, setVisibleCount] = useState(9);
  const handleLoadMore = () => setVisibleCount((p) => p + 9);

  return (
    <Box
      sx={{ bgcolor: umrah.softBg, minHeight: "100vh", pb: { xs: 6, md: 10 } }}
    >
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
          mb: { xs: 5, md: 8 },
        }}
      >
        <Box
          component="img"
          src={umrahHeroPrimary.src}
          alt="Umrah Packages — Origin Tours and Travels"
          sx={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 0.6,
          }}
        />
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(to bottom, rgba(12,27,61,0.6), rgba(0,0,0,0.3), rgba(12,27,61,0.8))`,
          }}
        />

        <Container
          maxWidth="lg"
          sx={{
            position: "relative",
            zIndex: 10,
            textAlign: "center",
            color: "common.white",
            mt: { xs: 2, md: 4 },
            px: { xs: 2, sm: 3 },
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Typography
              variant="h6"
              component="p"
              sx={{
                color: umrah.gold,
                mb: 2,
                fontWeight: 600,
                letterSpacing: 2,
                // !important: the page-level "& p" Lora rule outranks this
                // class otherwise, and the talbiyah must stay in Amiri.
                fontFamily: "'Amiri', serif !important",
                fontSize: { xs: "1rem", md: "1.5rem" },
              }}
            >
              لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ لَبَّيْكَ لَا شَرِيكَ لَكَ
              لَبَّيْكَ
            </Typography>
            <Typography
              variant="h1"
              fontWeight={900}
              gutterBottom
              sx={{
                textShadow: "0 4px 12px rgba(0,0,0,0.5)",
                color: "common.white",
                fontSize: { xs: "1.8rem", sm: "2.4rem", md: "3.2rem", lg: "3.8rem" },
                mb: { xs: 2, md: 4 },
              }}
            >
              Umrah packages from {city} 2026 – economy to premium
            </Typography>
            <Typography
              variant="h5"
              component="p"
              sx={{
                opacity: 0.9,
                maxWidth: 800,
                mx: "auto",
                fontWeight: 500,
                textShadow: "0 2px 4px rgba(0,0,0,0.5)",
                color: "common.white",
                lineHeight: 1.6,
              }}
            >
              Embark on a spiritual journey of a lifetime. <br /> Curated
              packages designed for your peace of mind and comfort.
            </Typography>
          </motion.div>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, lg: 4 } }}>
        <Box sx={{ textAlign: "center", mb: { xs: 6, md: 12 } }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <Typography
              variant="h2"
              fontWeight={800}
              gutterBottom
              sx={{ mb: 3 }}
            >
              Best Quality Umrah Packages from{" "}
              <Typography
                component="span"
                variant="inherit"
                sx={{ color: umrah.gold }}
              >
                {city}
              </Typography>
            </Typography>
            <Box
              sx={{
                width: 80,
                height: 4,
                background: `linear-gradient(90deg, ${umrah.emerald}, ${umrah.gold})`,
                mx: "auto",
                mb: 4,
                borderRadius: 2,
              }}
            />
            <Typography
              variant="body1"
              sx={{
                color: umrah.muted,
                fontSize: { xs: "1rem", md: "1.2rem" },
                maxWidth: 900,
                mx: "auto",
                lineHeight: 1.8,
              }}
            >
              Explore our carefully selected Umrah packages tailored to your
              spiritual journey. We provide comprehensive services for a
              comfortable and memorable experience in the holy cities of Makkah
              and Madinah.
            </Typography>
          </motion.div>
        </Box>

      </Container>

      {/* Customized packages — brand-blue showcase card (matches the width
          of the search bar and package grid below) */}
      <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, lg: 4 } }}>
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          sx={{
            position: "relative",
            overflow: "hidden",
            borderRadius: "28px",
            background: "linear-gradient(120deg, #08132b 0%, #0c1b3d 55%, #16305e 100%)",
            color: "common.white",
            p: { xs: 3, sm: 4, md: 5 },
            mb: { xs: 6, md: 10 },
          }}
        >
          {/* Blended backdrop image on the right */}
          <Box
            component="img"
            src={umrahCta.src}
            alt=""
            aria-hidden="true"
            sx={{
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 0,
              width: { xs: "100%", md: "58%" },
              height: "100%",
              objectFit: "cover",
              opacity: 0.22,
              maskImage: "linear-gradient(to right, transparent, black 40%)",
            }}
          />

          <Grid container spacing={{ xs: 4, md: 6 }} alignItems="center" sx={{ position: "relative" }}>
            {/* Left: heading, blurb, features, CTAs */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="h2" sx={{ lineHeight: 1.15, mb: 2 }}>
                Customized Umrah Packages From{" "}
                <Box component="span" sx={{ color: "#c9a227" }}>
                  {city} {new Date().getFullYear()}
                </Box>
              </Typography>
              <Typography
                variant="body1"
                paragraph
                sx={{ color: "rgba(255,255,255,0.65)", lineHeight: 1.7, maxWidth: 480, mb: 3 }}
              >
                Origin Travel Services is a full-service Travel Agency serving
                business and leisure clients who require professional, friendly,
                and efficient organization of their outbound and inbound travel
                & tourism needs.
              </Typography>

              <Stack spacing={1.75} sx={{ mb: 3.5 }}>
                {[
                  {
                    icon: <VerifiedUserOutlined />,
                    title: "Authorized Umrah Visa Provider",
                    sub: "Licensed specialist with 100% visa success rate",
                  },
                  {
                    icon: <PlaceOutlined />,
                    title: "Complete Airport-to-Airport Assistance",
                    sub: "we handle your round trip seamlessly",
                  },
                  {
                    icon: <GroupsOutlined />,
                    title: "12+ Years of Trusted Service",
                    sub: "Over 15,000 pilgrims guided since 2013",
                  },
                  {
                    icon: <FlightTakeoff />,
                    title: "Economy to Premium Packages",
                    sub: "Flexible options starting at ₹72,000 per person",
                  },
                ].map((f) => (
                  <Stack key={f.title} direction="row" spacing={2} alignItems="center">
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        flexShrink: 0,
                        borderRadius: "12px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: "rgba(201,162,39,0.12)",
                        border: "1px solid rgba(201,162,39,0.3)",
                        color: "#c9a227",
                        "& svg": { fontSize: 20 },
                      }}
                    >
                      {f.icon}
                    </Box>
                    <Box>
                      <Typography sx={{ fontWeight: 700, fontSize: "0.98rem" }}>
                        {f.title}
                      </Typography>
                      <Typography sx={{ color: "rgba(255,255,255,0.55)", fontSize: "0.85rem" }}>
                        {f.sub}
                      </Typography>
                    </Box>
                  </Stack>
                ))}
              </Stack>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <Button
                  variant="contained"
                  size="large"
                  href="#umrah-packages"
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    bgcolor: "#c9a227",
                    color: "#0c1b3d",
                    px: 4,
                    py: 1.25,
                    borderRadius: 50,
                    textTransform: "none",
                    fontWeight: 700,
                    boxShadow: "0 6px 20px rgba(201,162,39,0.35)",
                    "&:hover": {
                      bgcolor: "#b8941f",
                      transform: "translateY(-2px)",
                      boxShadow: "0 8px 26px rgba(201,162,39,0.45)",
                    },
                  }}
                >
                  Explore Packages
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  component="a"
                  href="tel:+919177787635"
                  startIcon={<PhoneOutlined />}
                  sx={{
                    borderColor: "rgba(255,255,255,0.3)",
                    color: "common.white",
                    px: 4,
                    py: 1.25,
                    borderRadius: 50,
                    textTransform: "none",
                    fontWeight: 700,
                    backdropFilter: "blur(6px)",
                    "&:hover": {
                      borderColor: "common.white",
                      bgcolor: "rgba(255,255,255,0.08)",
                    },
                  }}
                >
                  Call Us Now
                </Button>
              </Stack>
            </Grid>

            {/* Right: stats, testimonial, certifications */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Grid container spacing={2} sx={{ mb: 2 }}>
                {[
                  { value: "15,000+", label: "HAPPY PILGRIMS" },
                  { value: "12 Yrs", label: "IN BUSINESS" },
                  { value: "100%", label: "VISA SUCCESS" },
                  { value: "4.9 ★", label: "AVG. RATING" },
                ].map((s) => (
                  <Grid size={{ xs: 6 }} key={s.label}>
                    <Box
                      sx={{
                        borderRadius: "16px",
                        bgcolor: "rgba(255,255,255,0.07)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        backdropFilter: "blur(8px)",
                        textAlign: "center",
                        py: 2,
                        px: 1,
                      }}
                    >
                      <Typography sx={{ fontWeight: 700, fontSize: "1.25rem" }}>
                        {s.value}
                      </Typography>
                      <Typography
                        sx={{
                          color: "rgba(255,255,255,0.5)",
                          fontSize: "0.68rem",
                          letterSpacing: 1.2,
                          mt: 0.25,
                        }}
                      >
                        {s.label}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>

              <Box
                sx={{
                  borderRadius: "16px",
                  bgcolor: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  backdropFilter: "blur(8px)",
                  p: 2.5,
                  mb: 2,
                }}
              >
                <Stack direction="row" spacing={0.25} sx={{ mb: 1.5 }}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} sx={{ color: "#c9a227", fontSize: 18 }} />
                  ))}
                </Stack>
                <Typography
                  sx={{
                    fontStyle: "italic",
                    color: "rgba(255,255,255,0.85)",
                    lineHeight: 1.7,
                    fontSize: "0.95rem",
                    mb: 2,
                  }}
                >
                  &ldquo;Alhamdulillah, Origin Travel made our Umrah experience
                  completely stress-free. Every detail was handled perfectly —
                  from the visa to the hotel in Makkah.&rdquo;
                </Typography>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Box
                    sx={{
                      width: 38,
                      height: 38,
                      borderRadius: "50%",
                      bgcolor: "#c9a227",
                      color: "#0c1b3d",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 800,
                    }}
                  >
                    A
                  </Box>
                  <Box>
                    <Typography sx={{ fontWeight: 700, fontSize: "0.9rem" }}>
                      Ahmed Raza
                    </Typography>
                    <Typography sx={{ color: "rgba(255,255,255,0.5)", fontSize: "0.75rem" }}>
                      {city} · Travelled Jan 2025
                    </Typography>
                  </Box>
                </Stack>
              </Box>

              <Grid container spacing={2}>
                {[
                  { icon: <VerifiedUserOutlined sx={{ fontSize: 18 }} />, label: "Ministry of Hajj Licensed" },
                  { icon: <WorkspacePremiumOutlined sx={{ fontSize: 18 }} />, label: "IATA Certified Agency" },
                ].map((c) => (
                  <Grid size={{ xs: 12, sm: 6 }} key={c.label}>
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      justifyContent="center"
                      sx={{
                        borderRadius: "14px",
                        bgcolor: "rgba(255,255,255,0.07)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        backdropFilter: "blur(8px)",
                        py: 1.5,
                        px: 2,
                        color: "#c9a227",
                      }}
                    >
                      {c.icon}
                      <Typography sx={{ color: "rgba(255,255,255,0.85)", fontSize: "0.85rem", fontWeight: 600 }}>
                        {c.label}
                      </Typography>
                    </Stack>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Container>

      <Container
        id="umrah-packages"
        maxWidth="xl"
        sx={{ px: { xs: 2, sm: 3, lg: 4 }, scrollMarginTop: 110 }}
      >
        <Box
          sx={{
            mb: 6,
            display: "flex",
            flexWrap: { xs: "wrap", md: "nowrap" },
            gap: 1.5,
            alignItems: "center",
            bgcolor: "background.paper",
            p: { xs: 2, md: 2 },
            borderRadius: radius.card,
            boxShadow: shadow.card,
            border: "1px solid rgba(12,27,61,0.08)",
          }}
        >
          <TextField
            placeholder="Search Packages..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="small"
            sx={{ flexGrow: 1, minWidth: { xs: "100%", md: 260 } }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: "#64748B", fontSize: 20 }} />
                  </InputAdornment>
                ),
                sx: searchPillSx,
              },
            }}
          />

          <Select
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            variant="standard"
            disableUnderline
            displayEmpty
            renderValue={(v) =>
              pillValue(AccessTimeOutlined, DURATION_LABELS[v] || "Duration")
            }
            MenuProps={pillMenuProps}
            aria-label="Duration"
            sx={{ ...pillSelectSx, flexGrow: { xs: 1, md: 0 } }}
          >
            <ListSubheader sx={menuHeaderSx}>Duration</ListSubheader>
            <MenuItem value="" sx={menuItemSx}>
              <MenuDot selected={!duration} />
              All
            </MenuItem>
            <MenuItem value="short" sx={menuItemSx}>
              <MenuDot selected={duration === "short"} />
              Short (1-10 Days)
            </MenuItem>
            <MenuItem value="medium" sx={menuItemSx}>
              <MenuDot selected={duration === "medium"} />
              Medium (11-20 Days)
            </MenuItem>
            <MenuItem value="long" sx={menuItemSx}>
              <MenuDot selected={duration === "long"} />
              Long (20+ Days)
            </MenuItem>
          </Select>

          <Select
            value={priceSort}
            onChange={(e) => setPriceSort(e.target.value)}
            variant="standard"
            disableUnderline
            displayEmpty
            renderValue={(v) => pillValue(AttachMoney, PRICE_LABELS[v] || "Price")}
            MenuProps={pillMenuProps}
            aria-label="Sort by price"
            sx={{ ...pillSelectSx, flexGrow: { xs: 1, md: 0 } }}
          >
            <ListSubheader sx={menuHeaderSx}>Price</ListSubheader>
            <MenuItem value="" sx={menuItemSx}>
              <MenuDot selected={!priceSort} />
              Relevance
            </MenuItem>
            <MenuItem value="asc" sx={menuItemSx}>
              <MenuDot selected={priceSort === "asc"} />
              Low to High
            </MenuItem>
            <MenuItem value="desc" sx={menuItemSx}>
              <MenuDot selected={priceSort === "desc"} />
              High to Low
            </MenuItem>
          </Select>
        </Box>

        <Box>
          {loading ? (
            <Grid
              container
              spacing={{ xs: 2, md: 3 }}
              component={motion.div}
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.1 } },
              }}
            >
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={n}>
                  <SkeletonCard />
                </Grid>
              ))}
            </Grid>
          ) : filteredTours.length > 0 ? (
            <>
              <AnimatePresence>
                <Grid
                  container
                  spacing={{ xs: 2, md: 3 }}
                  component={motion.div}
                  initial="hidden"
                  animate="visible"
                  variants={{
                    visible: { transition: { staggerChildren: 0.1 } },
                  }}
                >
                  {filteredTours.slice(0, visibleCount).map((tour) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={tour.id}>
                      <ServiceCard item={tour} type="tour" variant="umrah" />
                    </Grid>
                  ))}
                </Grid>
              </AnimatePresence>

              {visibleCount < filteredTours.length && (
                <Box
                  sx={{
                    mt: 8,
                    display: "flex",
                    justifyContent: "center",
                    width: "100%",
                  }}
                >
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={handleLoadMore}
                    sx={{
                      borderRadius: 50,
                      px: 6,
                      py: 1.5,
                      fontWeight: "bold",
                      borderWidth: 2,
                      borderColor: umrah.emerald,
                      color: umrah.emerald,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        borderWidth: 2,
                        borderColor: umrah.emerald,
                        bgcolor: umrah.emerald,
                        color: "white",
                        boxShadow: `0 4px 14px rgba(12, 27, 61, 0.3)`,
                      },
                    }}
                  >
                    Load More Packages
                  </Button>
                </Box>
              )}
            </>
          ) : (
            <Box sx={{ textAlign: "center", py: 10, width: "100%" }}>
              <Typography variant="h5" color="text.secondary">
                No Umrah packages available at the moment.
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                Please check back later or contact us for custom packages.
              </Typography>
              <Button
                variant="contained"
                component="a"
                href="https://wa.me/919177787635"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  mt: 3,
                  borderRadius: 50,
                  px: 4,
                  bgcolor: umrah.emerald,
                  "&:hover": { bgcolor: umrah.emeraldDark },
                }}
              >
                Contact Us for Custom Packages
              </Button>
            </Box>
          )}
        </Box>

        <Box
          sx={{
            mt: { xs: 8, md: 15 },
            mb: { xs: 8, md: 15 },
            background: `linear-gradient(135deg, rgba(12,27,61,0.05), rgba(201,162,39,0.05))`,
            borderRadius: radius.section,
            p: { xs: 3, sm: 4, md: 8 },
            overflow: "hidden",
            position: "relative",
            border: "1px solid rgba(12,27,61,0.08)",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: -100,
              right: -100,
              width: 300,
              height: 300,
              bgcolor: "rgba(255,255,255,0.05)",
              borderRadius: "50%",
            }}
          />
          <Grid container spacing={{ xs: 3, md: 6 }} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }} order={{ xs: 2, md: 1 }}>
              <Typography
                variant="h3"
                fontWeight={800}
                gutterBottom
                sx={{ mb: 3, color: umrah.emerald }}
              >
                Umrah Visa Services
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: umrah.muted,
                  mb: 4,
                  fontSize: "1.1rem",
                  lineHeight: 1.8,
                }}
              >
                Origin Travel Services provides hassle-free Umrah visa services.
                We handle all the paperwork and ensure that your visa is
                processed on time.
              </Typography>
              <Typography
                variant="h6"
                fontWeight="bold"
                gutterBottom
                sx={{ mb: 2, color: umrah.emeraldDark }}
              >
                Terms and Conditions:
              </Typography>
              <Stack spacing={2}>
                {[
                  "Passport should have 6 months validity from the date of travel.",
                  "Two white background photographs.",
                  "Pan Card / Aadhar Card of the pilgrims.",
                  "Vaccination certificate (optional).",
                  "NOC from previous employer for work permit holders.",
                ].map((step, idx) => (
                  <Stack
                    key={idx}
                    direction="row"
                    spacing={2}
                    alignItems="flex-start"
                  >
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        bgcolor: umrah.gold,
                        borderRadius: "50%",
                        mt: 1,
                        flexShrink: 0,
                      }}
                    />
                    <Typography variant="body1" sx={{ color: umrah.muted }}>
                      {step}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }} order={{ xs: 1, md: 2 }}>
              <Box
                component="img"
                src={umrahVisa.src}
                alt="Umrah Visa Services"
                sx={{ width: "100%", borderRadius: 4, boxShadow: 10 }}
              />
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ mb: 15 }}>
          <Typography
            variant="h3"
            fontWeight={800}
            textAlign="center"
            gutterBottom
            sx={{
              mb: { xs: 3, md: 6 },
              color: umrah.emerald,
              fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2.5rem" },
            }}
          >
            Frequently Asked Questions (FAQ&apos;s)
          </Typography>
          <Box sx={{ maxWidth: 900, mx: "auto" }}>
            {[
              {
                q: `What is the cost of Umrah Packages from ${city} ${new Date().getFullYear()}?`,
                a: "Costs vary from ₹75,000 to ₹1,50,000 based on hotel category, distance from Haram, and sharing occupancy (Quad, Triple, Double).",
              },
              {
                q: "How much is the Umrah package from India?",
                a: "Standard Economy packages from India typically start from ₹80,000, while premium packages can go higher based on luxury services.",
              },
              {
                q: "How many days do we need for Umrah?",
                a: "Generally 14 to 15 days are sufficient for a complete Umrah journey, including stays in both Makkah and Madinah.",
              },
              {
                q: "Is an RT-PCR test required for Umrah?",
                a: "As per current regulations, RT-PCR is no longer mandatory for pilgrims, but we recommend checking latest travel advisories before departure.",
              },
            ].map((faq, index) => (
              <Accordion
                key={index}
                sx={{
                  mb: 2,
                  borderRadius: `${radius.accordion} !important`,
                  "&:before": { display: "none" },
                  boxShadow: shadow.soft,
                  border: "1px solid rgba(12,27,61,0.08)",
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon sx={{ color: umrah.emerald }} />}
                >
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    sx={{ color: umrah.emeraldDark }}
                  >
                    {faq.q}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography
                    sx={{
                      color: umrah.muted,
                      fontSize: "1.1rem",
                      lineHeight: 1.6,
                    }}
                  >
                    {faq.a}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        </Box>

        <Box sx={{ mb: { xs: 8, md: 15 } }}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="center"
            spacing={2}
            sx={{ mb: { xs: 3, md: 6 } }}
          >
            <CameraAltIcon sx={{ fontSize: 40, color: umrah.gold }} />
            <Typography
              variant="h3"
              fontWeight={800}
              sx={{
                color: umrah.emerald,
                fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2.5rem" },
              }}
            >
              Our Gallery
            </Typography>
          </Stack>
          <Grid container spacing={2}>
            {[
              { url: gallery1.src, size: 6, alt: "Umrah gallery 1" },
              { url: gallery2.src, size: 6, alt: "Umrah gallery 2" },
              { url: gallery3.src, size: 4, alt: "Umrah gallery 3" },
              { url: gallery1.src, size: 4, alt: "Umrah gallery 4" },
              { url: gallery2.src, size: 4, alt: "Umrah gallery 5" },
            ].map((img, idx) => (
              <Grid size={{ xs: 6, sm: img.size }} key={idx}>
                <Box
                  component="img"
                  src={img.url}
                  alt={img.alt}
                  sx={{
                    width: "100%",
                    height: { xs: 180, sm: 240, md: 300 },
                    objectFit: "cover",
                    borderRadius: { xs: 2, md: 4 },
                    cursor: "pointer",
                    transition: "transform 0.3s ease",
                    "&:hover": { transform: "scale(1.02)" },
                  }}
                />
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box
          sx={{
            position: "relative",
            borderRadius: radius.section,
            overflow: "hidden",
            mb: 5,
            minHeight: { xs: 220, md: 300 },
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            color: "white",
          }}
        >
          <Box
            component="img"
            src={umrahCta.src}
            alt="Plan your spiritual journey with Origin Tours and Travels"
            sx={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background: `linear-gradient(to right, rgba(12,27,61,0.7), rgba(8,19,43,0.6))`,
            }}
          />
          <Box
            sx={{ position: "relative", zIndex: 1, p: { xs: 2, sm: 3, md: 4 } }}
          >
            <Typography
              variant="h3"
              fontWeight={800}
              gutterBottom
              sx={{
                color: "white",
                fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
              }}
            >
              Need a hand with your travel plans?
            </Typography>
            <Button
              variant="contained"
              size="large"
              href="https://wa.me/919177787635"
              target="_blank"
              sx={{
                mt: 4,
                borderRadius: 50,
                px: 6,
                py: 2,
                fontWeight: "bold",
                bgcolor: umrah.gold,
                color: umrah.emeraldDark,
                "&:hover": {
                  bgcolor: "#b8941f",
                  boxShadow: "0 6px 20px rgba(201,162,39,0.4)",
                },
              }}
            >
              Contact Us Now
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default UmrahClient;
