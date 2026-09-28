"use client";
import React, { useState, useEffect } from "react";
import RouterLink from "next/link";
import { useParams } from "next/navigation";
import MobileStickyCTA from '../../../components/MobileStickyCTA';
import {
  Box,
  Container,
  Grid,
  Typography,
  Chip,
  Stack,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  useTheme,
  Breadcrumbs,
  Link,
  alpha,
} from "@mui/material";
import MarkdownContent from "../../../components/MarkdownContent";
import AccessTime from "@mui/icons-material/AccessTime";
import LocationOn from "@mui/icons-material/LocationOn";
import CheckCircle from "@mui/icons-material/CheckCircle";
import Cancel from "@mui/icons-material/Cancel";
import ArrowBack from "@mui/icons-material/ArrowBack";
import ErrorOutline from "@mui/icons-material/ErrorOutline";
import CalendarToday from "@mui/icons-material/CalendarToday";
import MonetizationOn from "@mui/icons-material/MonetizationOn";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Flight from "@mui/icons-material/Flight";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { motion } from "framer-motion";
import SkeletonDetail from '../../../components/skeletons/SkeletonDetail';
import EnquiryForm from '../../../components/EnquiryForm';

const TourDetail = ({ initialData = null, related = [] }) => {
  const { slug } = useParams();
  const theme = useTheme();
   
  const [tour, setTour] = useState(initialData);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Content is server-rendered via initialData; only fetch as a fallback.
    if (initialData) return;
    fetch(`/api/public/tours/${slug}`)
      .then(r => r.ok ? r.json() : Promise.reject('Not found'))
      .then(data => setTour(data))
      .catch(e => setError(e))
      .finally(() => setLoading(false));
  }, [slug, initialData]);

  const formatDate = (value) => {
    if (!value) return "";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    const day = String(d.getDate()).padStart(2, "0");
    const month = d.toLocaleString("en-US", { month: "long" });
    return `${day}-${month}-${d.getFullYear()}`;
  };

  if (loading) return <SkeletonDetail />;

  if (error || !tour)
    return (
      <Container sx={{ pt: 15, textAlign: "center" }}>
        <ErrorOutline sx={{ fontSize: 60, color: "error.main", mb: 2 }} />
        <Typography variant="h4" gutterBottom>
          Package Not Found
        </Typography>
        <Typography color="text.secondary" paragraph>
          {typeof error === "string"
            ? error
            : (error?.message ?? "The travel package you are looking for might have been moved or removed.")}
        </Typography>
        <Button component={RouterLink} href="/tours" variant="contained">
          Back to All Tours
        </Button>
      </Container>
    );

  const { title, content, tourDetails: acf, featuredImage } = tour;
  const thumbnail = featuredImage?.node?.sourceUrl;
  const srcSet = featuredImage?.node?.srcSet;

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh", pb: 10 }}>
      {/* Hero Section */}
      <Box
        sx={{
          position: "relative",
          height: { xs: "45vh", sm: "55vh", md: "70vh" },
          minHeight: { xs: 300, md: 400 },
          bgcolor: "grey.900",
          color: "white",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {thumbnail && (
          <Box
            component="img"
            src={thumbnail}
            srcSet={srcSet}
            sizes="100vw"
            alt={title}
            loading="eager"
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: 0.6,
            }}
          />
        )}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0.4), rgba(0,0,0,0.7))",
          }}
        />

        <Container
          maxWidth="xl"
          sx={{
            position: "relative",
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            pb: { xs: 6, md: 15 },
            pt: { xs: 12, md: 20 },
            zIndex: 2,
            px: { xs: 2, sm: 3, lg: 4 },
          }}
        >
          <Button
            component={RouterLink}
            href="/tours"
            startIcon={<ArrowBack />}
            sx={{
              color: "white",
              alignSelf: "flex-start",
              mb: "auto",
              mt: { xs: 8, md: 12 },
              fontWeight: 600,
              backdropFilter: "blur(4px)",
              bgcolor: "rgba(255,255,255,0.1)",
              px: 2,
              "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
            }}
          >
            Back to Packages
          </Button>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Typography
              variant="h1"
              fontWeight={900}
              sx={{
                mb: { xs: 2, md: 3 },
                textShadow: "0 4px 12px rgba(0,0,0,0.6)",
                color: "common.white",
                fontSize: {
                  xs: "1.75rem",
                  sm: "2.5rem",
                  md: "3.5rem",
                  lg: "4rem",
                },
              }}
            >
              {title}
            </Typography>
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              flexWrap="wrap"
              useFlexGap
              sx={{ gap: 2 }}
            >
              {acf?.holidayCountry?.nodes?.[0]?.name && (
                <Chip
                  icon={<LocationOn sx={{ color: "white !important" }} />}
                  label={acf.holidayCountry.nodes[0].name}
                  sx={{
                    bgcolor: "rgba(255,255,255,0.15)",
                    color: "white",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    height: 40,
                    fontSize: "1rem",
                    "& .MuiChip-icon": { fontSize: "1.2rem" },
                  }}
                />
              )}
              <Chip
                icon={<AccessTime sx={{ color: "white !important" }} />}
                label={acf?.durationDaysNights || "Flexible"}
                sx={{
                  bgcolor: "rgba(255,255,255,0.15)",
                  color: "white",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  height: 40,
                  fontSize: "1rem",
                  "& .MuiChip-icon": { fontSize: "1.2rem" },
                }}
              />
              {acf?.visatyp && acf.visatyp.length > 0 && (
                <Chip
                  icon={
                    <ConfirmationNumberIcon
                      sx={{ color: "white !important" }}
                    />
                  }
                  label={acf.visatyp.join(", ")}
                  sx={{
                    bgcolor: "rgba(255,255,255,0.15)",
                    color: "white",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    height: 40,
                    fontSize: "1rem",
                    "& .MuiChip-icon": { fontSize: "1.2rem" },
                  }}
                />
              )}
              {acf?.startAndEndDate && (
                <Chip
                  icon={<CalendarToday sx={{ color: "white !important" }} />}
                  label={acf.startAndEndDate}
                  sx={{
                    bgcolor: "rgba(255,255,255,0.15)",
                    color: "white",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    height: 40,
                    fontSize: "1rem",
                    "& .MuiChip-icon": { fontSize: "1.2rem" },
                  }}
                />
              )}
            </Stack>
          </motion.div>
        </Container>
      </Box>

      <Container
        maxWidth="xl"
        sx={{
          mt: { xs: 2, md: 4 },
          position: "relative",
          zIndex: 3,
          px: { xs: 2, sm: 3, lg: 4 },
        }}
      >
        {/* Breadcrumbs */}
        <Box sx={{ mb: 4 }}>
          <Breadcrumbs
            separator={<NavigateNextIcon fontSize="small" />}
            aria-label="breadcrumb"
          >
            <Link
              component={RouterLink}
              href="/"
              color="inherit"
              sx={{
                display: "flex",
                alignItems: "center",
                textDecoration: "none",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              Home
            </Link>
            <Link
              component={RouterLink}
              href="/tours"
              color="inherit"
              sx={{
                display: "flex",
                alignItems: "center",
                textDecoration: "none",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              Tours
            </Link>
            <Typography color="text.primary" sx={{ fontWeight: "bold" }}>
              {title}
            </Typography>
          </Breadcrumbs>
        </Box>
        <Grid container spacing={{ xs: 3, md: 4 }}>
          {/* Main Content */}
          <Grid size={{ xs: 12, md: 8 }}>
            {/* Features Chips */}
            {((acf?.features && acf.features.length > 0) || (acf?.mealTypes && acf.mealTypes.length > 0)) && (
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  Key Features
                </Typography>
                <Stack
                  direction="row"
                  spacing={1}
                  flexWrap="wrap"
                  useFlexGap
                  sx={{ gap: 1 }}
                >
                  {(acf?.features ?? []).map((feature, idx) => {
                    const cleanFeature =
                      typeof feature === "string"
                        ? feature.replace("Airt Ticket", "Air Ticket")
                        : feature;
                    return (
                      <Chip
                        key={`f-${idx}`}
                        label={cleanFeature}
                        color="primary"
                        variant="outlined"
                        icon={<CheckCircle fontSize="small" />}
                        sx={{ borderRadius: 2, fontWeight: 600 }}
                      />
                    );
                  })}
                  {(acf?.mealTypes ?? []).map((meal, idx) => (
                    <Chip
                      key={`m-${idx}`}
                      label={meal}
                      color="primary"
                      variant="outlined"
                      icon={<RestaurantIcon fontSize="small" />}
                      sx={{ borderRadius: 2, fontWeight: 600 }}
                    />
                  ))}
                </Stack>
              </Box>
            )}
            {/* Description */}
            <Box sx={{ mb: 6 }}>
              <Typography
                variant="h5"
                fontWeight={700}
                gutterBottom
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <ErrorOutline color="primary" /> Overview
              </Typography>
              <Paper
                elevation={0}
                sx={{ p: { xs: 2.5, md: 4 }, borderRadius: 3, bgcolor: "background.paper" }}
              >
                <MarkdownContent content={content} />
              </Paper>
            </Box>

            {/* Hotel — the tour's main hotel */}
            {acf?.hotelName && (
              <Box sx={{ mb: 6 }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 2.5, md: 3 },
                    borderRadius: 3,
                    border: "1px solid",
                    borderColor: "divider",
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                  }}
                >
                  <Typography variant="h6" fontWeight={600} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    🏨 Hotel
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
                    {acf.hotelName}
                  </Typography>
                </Paper>
              </Box>
            )}

            {/* Packages & Pricing - Side by Side Grid */}
            {acf?.packages && acf.packages.length > 0 && (
              <Box sx={{ mb: 6 }}>
                <Typography
                  variant="h5"
                  fontWeight={700}
                  gutterBottom
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <MonetizationOn color="primary" /> Packages & Pricing
                </Typography>
                <Grid container spacing={3}>
                  {acf.packages.map((pkg, index) => (
                    <Grid
                      size={{ xs: 12, md: acf.packages.length > 1 ? 6 : 12 }}
                      key={index}
                    >
                      <Paper
                        elevation={0}
                        sx={{
                          p: 3,
                          borderRadius: 3,
                          overflow: "hidden",
                          height: "100%",
                          border: "1px solid",
                          borderColor: "divider",
                        }}
                      >
                        <Typography
                          variant="h6"
                          fontWeight={600}
                          gutterBottom
                          color="primary"
                        >
                          {pkg.packageTitle}
                        </Typography>
                        {pkg.hotelName && (
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 1.5, fontWeight: 500 }}
                          >
                            🏨 {pkg.hotelName}
                          </Typography>
                        )}
                        <TableContainer>
                          <Table size="small">
                            <TableHead>
                              <TableRow
                                sx={{
                                  bgcolor:
                                    theme.palette.mode === "light"
                                      ? "grey.50"
                                      : "background.default",
                                }}
                              >
                                <TableCell sx={{ fontWeight: "bold" }}>
                                  Room Type
                                </TableCell>
                                <TableCell
                                  sx={{ fontWeight: "bold" }}
                                  align="right"
                                >
                                  Price
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {pkg.roomPrices?.map((room, idx) => (
                                <TableRow key={idx} hover>
                                  <TableCell>{room.roomType}</TableCell>
                                  <TableCell align="right">
                                    <Typography
                                      fontWeight="bold"
                                      color="primary"
                                    >
                                      ₹{room.price}
                                    </Typography>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}

            {/* Itinerary */}
            {acf?.itinerary && acf.itinerary.length > 0 && (
              <Box sx={{ mb: 6 }}>
                <Typography
                  variant="h5"
                  fontWeight={700}
                  gutterBottom
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <CalendarToday color="primary" /> Itinerary
                </Typography>
                <Box>
                  {acf.itinerary.map((day, index) => (
                    <Accordion
                      key={index}
                      disableGutters
                      elevation={0}
                      sx={{
                        mb: 1,
                        borderRadius: "12px !important",
                        "&:before": { display: "none" },
                        border: "1px solid",
                        borderColor: "divider",
                      }}
                    >
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography
                          fontWeight={700}
                          sx={{
                            width: "30%",
                            flexShrink: 0,
                            color: "primary.main",
                          }}
                        >
                          {day.day}
                        </Typography>
                        <Typography
                          sx={{ color: "text.secondary", fontWeight: 500 }}
                        >
                          {day.activity}
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails sx={{ pt: 0 }}>
                        <Divider sx={{ mb: 2 }} />
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ whiteSpace: "pre-line" }}
                        >
                          {day.details}
                        </Typography>
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </Box>
              </Box>
            )}

            {/* Upcoming Departures - Matches Screenshot Style */}
            {acf?.datesAvailability && acf.datesAvailability.length > 0 && (
              <Box sx={{ mb: 6 }}>
                <Typography
                  variant="h5"
                  fontWeight={700}
                  gutterBottom
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <Flight color="primary" /> Upcoming Departures
                </Typography>
                <TableContainer
                  component={Paper}
                  elevation={0}
                  sx={{
                    borderRadius: 3,
                    border: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <Table>
                    <TableHead>
                      <TableRow
                        sx={{
                          bgcolor:
                            theme.palette.mode === "light"
                              ? "grey.50"
                              : "background.default",
                        }}
                      >
                        <TableCell sx={{ fontWeight: "bold" }}>
                          Departure
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>
                          Arrival
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>
                          Airline
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold" }} align="right">
                          Price
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {acf.datesAvailability.map((date, index) => (
                        <TableRow key={index} hover>
                          <TableCell sx={{ fontSize: "0.875rem" }}>
                            {formatDate(date.departure)}
                          </TableCell>
                          <TableCell sx={{ fontSize: "0.875rem" }}>
                            {formatDate(date.arrival ?? date.arraival)}
                          </TableCell>
                          <TableCell sx={{ fontSize: "0.875rem" }}>
                            {date.airline}
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{ fontWeight: "bold", color: "primary.main" }}
                          >
                            {date.price ? `₹${date.price}` : "TBD"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}

            {/* Inclusions & Exclusions - Side by Side */}
            {(acf?.inclusions?.length > 0 || acf?.exclusions?.length > 0) && (
              <Grid container spacing={3} sx={{ mb: 6 }}>
                {acf?.inclusions?.length > 0 && (
                  <Grid
                    size={{
                      xs: 12,
                      md:
                        acf?.inclusions?.length > 0 &&
                          acf?.exclusions?.length > 0
                          ? 6
                          : 12,
                    }}
                  >
                    <Paper
                      elevation={0}
                      sx={{
                        p: 0,
                        borderRadius: 3,
                        overflow: "hidden",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <Box sx={{ bgcolor: "#4CAF50", p: 2, color: "white" }}>
                        <Typography
                          variant="h6"
                          fontWeight={700}
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <CheckCircle sx={{ color: "white" }} /> INCLUSIONS
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          p: 3,
                          bgcolor:
                            theme.palette.mode === "light"
                              ? "#f0fdf4"
                              : alpha(theme.palette.success.main, 0.1),
                          flexGrow: 1,
                        }}
                      >
                        <Stack spacing={1.5}>
                          {acf.inclusions.map((inc, i) => (
                            <Box
                              key={i}
                              sx={{
                                display: "flex",
                                gap: 1.5,
                                alignItems: "center",
                              }}
                            >
                              <CheckCircle
                                fontSize="small"
                                sx={{ color: "#4CAF50" }}
                              />
                              <Typography
                                variant="body2"
                                fontWeight={600}
                                color="text.primary"
                              >
                                {inc.inclusion}
                              </Typography>
                            </Box>
                          ))}
                        </Stack>
                      </Box>
                    </Paper>
                  </Grid>
                )}
                {acf?.exclusions?.length > 0 && (
                  <Grid
                    size={{
                      xs: 12,
                      md:
                        acf?.inclusions?.length > 0 &&
                          acf?.exclusions?.length > 0
                          ? 6
                          : 12,
                    }}
                  >
                    <Paper
                      elevation={0}
                      sx={{
                        p: 0,
                        borderRadius: 3,
                        overflow: "hidden",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <Box sx={{ bgcolor: "#EF4444", p: 2, color: "white" }}>
                        <Typography
                          variant="h6"
                          fontWeight={700}
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Cancel sx={{ color: "white" }} /> EXCLUSIONS
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          p: 3,
                          bgcolor:
                            theme.palette.mode === "light"
                              ? "#fef2f2"
                              : alpha(theme.palette.error.main, 0.1),
                          flexGrow: 1,
                        }}
                      >
                        <Stack spacing={1.5}>
                          {acf.exclusions.map((exc, i) => (
                            <Box
                              key={i}
                              sx={{
                                display: "flex",
                                gap: 1.5,
                                alignItems: "center",
                              }}
                            >
                              <Cancel
                                fontSize="small"
                                sx={{ color: "#EF4444" }}
                              />
                              <Typography
                                variant="body2"
                                fontWeight={600}
                                color="text.primary"
                              >
                                {exc.exclusion}
                              </Typography>
                            </Box>
                          ))}
                        </Stack>
                      </Box>
                    </Paper>
                  </Grid>
                )}
              </Grid>
            )}

            {/* Gallery */}
            {acf?.gallery?.nodes && acf.gallery.nodes.length > 0 && (
              <Box sx={{ mb: 6 }}>
                <Typography variant="h5" fontWeight={700} gutterBottom>
                  Gallery
                </Typography>
                <Grid container spacing={2}>
                  {acf.gallery.nodes.map((img, index) => (
                    <Grid size={{ xs: 6, md: 4 }} key={index}>
                      <Box
                        component="img"
                        src={img.sourceUrl}
                        alt={`Gallery ${index}`}
                        sx={{
                          width: "100%",
                          height: 160,
                          objectFit: "cover",
                          borderRadius: 2,
                          cursor: "pointer",
                          transition: "transform 0.3s",
                          "&:hover": { transform: "scale(1.02)" },
                        }}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
          </Grid>

          {/* Sidebar - Matching Screenshot Layout */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ position: { xs: "static", md: "sticky" }, top: 100 }}>
              {/* Price Section */}
              <Box sx={{ mb: 3, px: 1 }}>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  fontWeight="bold"
                >
                  Starting From
                </Typography>
                <Typography
                  variant="h3"
                  color="primary"
                  fontWeight={900}
                  sx={{ lineHeight: 1 }}
                >
                  ₹{acf?.price || "TBD"}
                </Typography>
              </Box>

              <Typography
                variant="subtitle2"
                fontWeight="bold"
                sx={{
                  mb: 1,
                  px: 1,
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                }}
              >
                Book This Package
              </Typography>

              {/* Enquiry Form */}
              <EnquiryForm
                packageTitle={title}
                currentUrl={typeof window !== "undefined" ? window.location.href : ""}
                selectedPackage={null}
                packages={acf?.packages}
                redirectTo="/thank-you/tours"
              />
            </Box>
          </Grid>
        </Grid>
      </Container>

<MobileStickyCTA
        title="Book this tour"
        whatsappMessage={`Hi, I'm interested in the tour: ${title}`}
      />
    </Box>
  );
};

export default TourDetail;
