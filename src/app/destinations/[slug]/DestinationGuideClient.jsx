"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Box,
  Container,
  Grid,
  Typography,
  Stack,
  Chip,
  Breadcrumbs,
  Card,
  CardContent,
  CardMedia,
  Button,
  Divider,
} from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import FlightOutlinedIcon from "@mui/icons-material/FlightOutlined";
import RichHtmlContent from "@/components/RichHtmlContent";
import FaqAccordion from "@/components/common/FaqAccordion";
import EnquiryForm from "@/components/EnquiryForm";
import { DESTINATION_SECTIONS } from "@/modules/destinations/destination-fields";

export default function DestinationGuideClient({ destination, relatedVisas = [], canonical }) {
  const sections =
    destination.sections && typeof destination.sections === "object"
      ? destination.sections
      : {};
  const attractions = Array.isArray(destination.attractions)
    ? destination.attractions
    : [];
  const faqs = Array.isArray(destination.faqs) ? destination.faqs : [];

  // Only the sections that have authored content, in canonical order.
  const filledSections = DESTINATION_SECTIONS.filter(
    (s) => typeof sections[s.key] === "string" && sections[s.key].trim(),
  );

  const relatedTours = Array.isArray(destination.tours) ? destination.tours : [];
  const relatedResources = Array.isArray(destination.blogPosts) ? destination.blogPosts : [];

  return (
    <>
      {/* ── Hero ───────────────────────────────────────────── */}
      <Box
        sx={{
          position: "relative",
          minHeight: { xs: 320, md: 460 },
          display: "flex",
          alignItems: "flex-end",
          color: "common.white",
          backgroundImage: destination.heroImage
            ? `linear-gradient(to top, rgba(0,0,0,0.75), rgba(0,0,0,0.15)), url(${destination.heroImage})`
            : "linear-gradient(135deg, #1A428A 0%, #2AB0E5 100%)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Container maxWidth="lg" sx={{ pb: { xs: 4, md: 6 }, pt: { xs: 14, md: 18 } }}>
          <Stack direction="row" spacing={1} sx={{ mb: 1.5 }} flexWrap="wrap">
            {destination.country?.name && (
              <Chip
                icon={<PlaceOutlinedIcon />}
                label={destination.country.name}
                color="primary"
                size="small"
              />
            )}
            {destination.bestTimeShort && (
              <Chip
                icon={<AccessTimeIcon />}
                label={`Best time: ${destination.bestTimeShort}`}
                size="small"
                sx={{ bgcolor: "rgba(255,255,255,0.2)", color: "common.white" }}
              />
            )}
          </Stack>
          <Typography
            variant="h2"
            component="h1"
            sx={{ fontWeight: 800, fontSize: { xs: "2rem", md: "3rem" } }}
          >
            {destination.name}
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        <Breadcrumbs
          separator={<ChevronRightIcon fontSize="small" />}
          sx={{ mb: 3 }}
        >
          <Link href="/" style={{ textDecoration: "none", color: "inherit" }}>
            Home
          </Link>
          <Link
            href="/destinations"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            Destinations
          </Link>
          <Typography color="text.primary" noWrap sx={{ maxWidth: 240 }}>
            {destination.name}
          </Typography>
        </Breadcrumbs>

        <Grid container spacing={{ xs: 4, md: 6 }}>
          {/* ── Main content column ─────────────────────────── */}
          <Grid size={{ xs: 12, md: 8 }}>
            {/* Overview */}
            {destination.overview && (
              <Box component="section" sx={{ mb: 5 }}>
                <Typography variant="h4" component="h2" sx={{ fontWeight: 700, mb: 2 }}>
                  Overview
                </Typography>
                <RichHtmlContent html={destination.overview} />
              </Box>
            )}

            {/* Ordered guide sections (Why Visit, Best Time, Weather, …) */}
            {filledSections.map((s) => (
              <Box component="section" sx={{ mb: 5 }} key={s.key}>
                <Typography variant="h4" component="h2" sx={{ fontWeight: 700, mb: 2 }}>
                  {s.label}
                </Typography>
                <RichHtmlContent html={sections[s.key]} />
              </Box>
            ))}

            {/* Top Attractions */}
            {attractions.length > 0 && (
              <Box component="section" sx={{ mb: 5 }}>
                <Typography variant="h4" component="h2" sx={{ fontWeight: 700, mb: 3 }}>
                  Top Attractions
                </Typography>
                <Grid container spacing={2.5}>
                  {attractions.map((a, i) => (
                    <Grid size={{ xs: 12, sm: 6 }} key={i}>
                      <Card sx={{ height: "100%", borderRadius: 2 }}>
                        {a.image && (
                          <CardMedia
                            component="img"
                            image={a.image}
                            alt={a.name}
                            sx={{ aspectRatio: "16/9", objectFit: "cover" }}
                          />
                        )}
                        <CardContent>
                          <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                            {a.name}
                          </Typography>
                          {a.description && (
                            <Typography variant="body2" color="text.secondary">
                              {a.description}
                            </Typography>
                          )}
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}

            {/* ── Related Tours ──────────────────────────── */}
            {relatedTours.length > 0 && (
              <Box component="section" sx={{ mb: 5 }}>
                <Typography variant="h4" component="h2" sx={{ fontWeight: 700, mb: 3 }}>
                  Tours to {destination.name}
                </Typography>
                <Grid container spacing={2.5}>
                  {relatedTours.map((tour) => {
                    const heroImg = Array.isArray(tour.images) && tour.images[0] ? tour.images[0] : null;
                    return (
                      <Grid size={{ xs: 12, sm: 6 }} key={tour.id}>
                        <Card
                          component={Link}
                          href={`/tours/${tour.slug}`}
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            height: "100%",
                            borderRadius: 2,
                            textDecoration: "none",
                            transition: "transform 0.2s, box-shadow 0.2s",
                            "&:hover": { transform: "translateY(-4px)", boxShadow: 4 },
                          }}
                        >
                          <Box sx={{ position: "relative", height: 160, overflow: "hidden", borderRadius: "8px 8px 0 0", bgcolor: "grey.100" }}>
                            {heroImg ? (
                              <Image src={heroImg} alt={tour.title} fill sizes="(max-width:600px) 100vw, 50vw" style={{ objectFit: "cover" }} />
                            ) : (
                              <Box sx={{ height: "100%", background: "linear-gradient(135deg,#1A428A,#2AB0E5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <FlightOutlinedIcon sx={{ fontSize: 40, color: "rgba(255,255,255,0.6)" }} />
                              </Box>
                            )}
                          </Box>
                          <CardContent sx={{ flexGrow: 1, p: 2 }}>
                            <Typography variant="subtitle1" fontWeight={700} gutterBottom sx={{ lineHeight: 1.3 }}>
                              {tour.title}
                            </Typography>
                            <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 0.5 }}>
                              {tour.duration && (
                                <Chip icon={<AccessTimeIcon />} label={tour.duration} size="small" variant="outlined" />
                              )}
                              {tour.price && (
                                <Chip label={`From ${tour.price}`} size="small" color="primary" variant="outlined" />
                              )}
                            </Stack>
                          </CardContent>
                        </Card>
                      </Grid>
                    );
                  })}
                </Grid>
                <Box sx={{ mt: 2, textAlign: "right" }}>
                  <Button component={Link} href="/tours" endIcon={<ArrowForwardIcon />} color="primary">
                    See all tours
                  </Button>
                </Box>
              </Box>
            )}

            {/* ── Related Visa info ──────────────────────── */}
            {relatedVisas.length > 0 && (
              <Box component="section" sx={{ mb: 5 }}>
                <Typography variant="h4" component="h2" sx={{ fontWeight: 700, mb: 3 }}>
                  {destination.country?.name} Visa Services
                </Typography>
                <Grid container spacing={2}>
                  {relatedVisas.map((visa) => (
                    <Grid size={{ xs: 12, sm: 4 }} key={visa.id}>
                      <Card
                        component={Link}
                        href={`/visas/${visa.slug}`}
                        elevation={0}
                        sx={{
                          p: 2,
                          border: "1px solid",
                          borderColor: "divider",
                          borderRadius: 2,
                          textDecoration: "none",
                          display: "block",
                          transition: "border-color 0.2s, box-shadow 0.2s",
                          "&:hover": { borderColor: "primary.main", boxShadow: 2 },
                        }}
                      >
                        <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                          {visa.type || `${destination.country?.name} Visa`}
                        </Typography>
                        <Stack spacing={0.5}>
                          {visa.fee && (
                            <Typography variant="body2" color="text.secondary">
                              Fee: {visa.fee}
                            </Typography>
                          )}
                          {visa.processingTime && (
                            <Typography variant="body2" color="text.secondary">
                              Processing: {visa.processingTime}
                            </Typography>
                          )}
                        </Stack>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
                <Box sx={{ mt: 2, textAlign: "right" }}>
                  <Button component={Link} href="/visas" endIcon={<ArrowForwardIcon />} color="primary">
                    All visa services
                  </Button>
                </Box>
              </Box>
            )}

            {/* ── Related Resources ──────────────────────── */}
            {relatedResources.length > 0 && (
              <Box component="section" sx={{ mb: 5 }}>
                <Typography variant="h4" component="h2" sx={{ fontWeight: 700, mb: 3 }}>
                  Travel Guides &amp; Resources
                </Typography>
                <Grid container spacing={2.5}>
                  {relatedResources.map((post) => (
                    <Grid size={{ xs: 12, sm: 6 }} key={post.id}>
                      <Card
                        component={Link}
                        href={`/travel-resources/${post.slug}`}
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          height: "100%",
                          borderRadius: 2,
                          textDecoration: "none",
                          transition: "transform 0.2s, box-shadow 0.2s",
                          "&:hover": { transform: "translateY(-4px)", boxShadow: 4 },
                        }}
                      >
                        {post.featuredImage ? (
                          <CardMedia
                            component="img"
                            image={post.featuredImage}
                            alt={post.title}
                            sx={{ height: 140, objectFit: "cover" }}
                          />
                        ) : (
                          <Box sx={{ height: 140, background: "linear-gradient(135deg,#064E3B,#065F46)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <ArticleOutlinedIcon sx={{ fontSize: 40, color: "rgba(255,255,255,0.5)" }} />
                          </Box>
                        )}
                        <CardContent sx={{ flexGrow: 1, p: 2 }}>
                          {post.category && (
                            <Chip label={post.category} size="small" sx={{ mb: 1, fontSize: "0.7rem" }} />
                          )}
                          <Typography variant="subtitle1" fontWeight={700} gutterBottom sx={{ lineHeight: 1.3 }}>
                            {post.title}
                          </Typography>
                          {post.excerpt && (
                            <Typography variant="body2" color="text.secondary" sx={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                              {post.excerpt}
                            </Typography>
                          )}
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
                <Box sx={{ mt: 2, textAlign: "right" }}>
                  <Button component={Link} href="/travel-resources" endIcon={<ArrowForwardIcon />} color="primary">
                    All travel resources
                  </Button>
                </Box>
              </Box>
            )}
          </Grid>

          {/* ── Enquiry sidebar (sticky on desktop) ─────────── */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ position: { md: "sticky" }, top: { md: 96 } }}>
              <EnquiryForm
                packageTitle={`${destination.name} Destination Enquiry`}
                currentUrl={canonical}
                redirectTo="/thank-you/destinations"
              />
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* ── FAQs (with FAQPage JSON-LD from the shared accordion) ── */}
      {faqs.length > 0 && (
        <>
          <Divider />
          <FaqAccordion
            faqs={faqs}
            eyebrow={`${destination.name} FAQs`}
            title={`Frequently asked questions about ${destination.name}`}
          />
        </>
      )}
    </>
  );
}
