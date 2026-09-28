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
  Stack,
  Button,
  Paper,
} from "@mui/material";
import MarkdownContent from "../../../components/MarkdownContent";
import { formatVisaFee } from "../../../lib/tour-utils";
import ArrowBack from "@mui/icons-material/ArrowBack";
import ErrorOutline from "@mui/icons-material/ErrorOutline";
import VerifiedUser from "@mui/icons-material/VerifiedUser";
import { motion } from "framer-motion";
import SkeletonDetail from '../../../components/skeletons/SkeletonDetail';
import EnquiryForm from '../../../components/EnquiryForm';

const AttestationDetail = ({ initialData = null, related = [] }) => {
  const { slug } = useParams();
  const [attestation, setAttestation] = useState(initialData);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Content is server-rendered via initialData; only fetch as a fallback.
    if (initialData) return;
    fetch(`/api/public/attestations/${slug}`)
      .then(r => r.ok ? r.json() : Promise.reject('Not found'))
      .then(data => setAttestation(data))
      .catch(e => setError(e))
      .finally(() => setLoading(false));
  }, [slug, initialData]);

  if (loading) return <SkeletonDetail />;

  if (error || !attestation)
    return (
      <Container sx={{ pt: 15, textAlign: "center" }}>
        <ErrorOutline sx={{ fontSize: 60, color: "error.main", mb: 2 }} />
        <Typography variant="h4" gutterBottom>
          Service Not Found
        </Typography>
        <Typography color="text.secondary" paragraph>
          {error
            ? error.message
            : "We couldn't find the attestation service you're looking for."}
        </Typography>
        <Button component={RouterLink} href="/attestations" variant="contained">
          View All Services
        </Button>
      </Container>
    );

  const { attestations: acf, title, content, featuredImage } = attestation;
  const countryTerm = attestation.countries?.nodes?.[0]; // Assuming countries taxonomy
  const countryFlag = countryTerm?.countryFlag?.countryFlag?.node?.sourceUrl;
  const thumbnail = featuredImage?.node?.sourceUrl;
  const srcSet = featuredImage?.node?.srcSet;

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh", pb: 10 }}>
      {/* Hero Image - Full Width */}
      <Box
        sx={{
          position: "relative",
          height: { xs: "35vh", sm: "40vh", md: "50vh" },
          minHeight: { xs: 260, md: 350 },
          bgcolor: "grey.900",
          mb: { xs: 4, md: 6 },
          overflow: "hidden",
        }}
      >
        {thumbnail && (
          <Box
            component="img"
            src={thumbnail}
            srcSet={srcSet}
            sizes="100vw"
            alt={title}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: 0.7,
            }}
          />
        )}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.3) 100%)",
            zIndex: 1,
          }}
        />

        <Container
          maxWidth="xl"
          sx={{
            position: "relative",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            pb: { xs: 5, md: 10 },
            px: { xs: 2, sm: 3, lg: 4 },
            zIndex: 2,
          }}
        >
          <Button
            component={RouterLink}
            href="/attestations"
            startIcon={<ArrowBack />}
            sx={{
              color: "white",
              alignSelf: "flex-start",
              mb: { xs: 4, md: 6 },
              backdropFilter: "blur(4px)",
              bgcolor: "rgba(255,255,255,0.1)",
              px: 2,
              "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
            }}
          >
            Back to Services
          </Button>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Stack direction="row" spacing={2} alignItems="center" mb={2}>
              {countryFlag && (
                <Box
                  component="img"
                  src={countryFlag}
                  sx={{ width: 40, borderRadius: 1, boxShadow: 1 }}
                />
              )}
              <Typography
                variant="overline"
                color="secondary.light"
                fontWeight="bold"
                letterSpacing={1}
                sx={{ textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}
              >
                {countryTerm?.name || "Global"} Authentication
              </Typography>
            </Stack>
            <Typography
              variant="h1"
              fontWeight={900}
              gutterBottom
              sx={{ color: "white", textShadow: "0 4px 12px rgba(0,0,0,0.6)" }}
            >
              {title}
            </Typography>
          </motion.div>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, lg: 4 } }}>
        <Grid container spacing={{ xs: 3, md: 6 }}>
          {/* Main Content */}
          <Grid size={{ xs: 12, lg: 8 }}>
            <Paper sx={{ p: { xs: 3, md: 5 }, borderRadius: 4 }}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}
              >
                <VerifiedUser color="primary" fontSize="large" />
                <Typography variant="h4" fontWeight="bold">
                  Process & Documents
                </Typography>
              </Box>

              <MarkdownContent content={content} />
            </Paper>
          </Grid>

          {/* Sidebar Actions / Enquiry Form */}
          <Grid size={{ xs: 12, lg: 4 }}>
            <Stack
              spacing={3}
              sx={{ position: { xs: "static", lg: "sticky" }, top: 120 }}
            >
              <Paper
                sx={{
                  p: 4,
                  borderRadius: 4,
                  bgcolor: "primary.main",
                  color: "white",
                }}
              >
                <Typography
                  variant="overline"
                  sx={{
                    color: "rgba(255,255,255,0.9) !important",
                    fontWeight: "bold",
                  }}
                >
                  Service Fee
                </Typography>
                <Typography
                  variant="h3"
                  fontWeight={900}
                  sx={{ color: "white !important" }}
                >
                  {formatVisaFee(acf?.price)}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "rgba(255,255,255,0.9) !important",
                    fontWeight: 500,
                  }}
                >
                  Starting from
                </Typography>
              </Paper>

              <Paper
                sx={{
                  p: 4,
                  borderRadius: 4,
                  bgcolor: "background.paper",
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <EnquiryForm
                  packageTitle={`${title} - Attestation`}
                  currentUrl={typeof window !== "undefined" ? window.location.href : ""}
                  redirectTo="/thank-you/attestations"
                />
              </Paper>
            </Stack>
          </Grid>
        </Grid>
      </Container>

<MobileStickyCTA
        title="Get attestation"
        whatsappMessage={`Hi, I'm interested in attestation: ${title}`}
      />
    </Box>
  );
};

export default AttestationDetail;
