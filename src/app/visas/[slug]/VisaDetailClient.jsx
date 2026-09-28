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
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import MarkdownContent from "../../../components/MarkdownContent";
import { formatVisaFee } from "../../../lib/tour-utils";
import AccessTime from "@mui/icons-material/AccessTime";
import ArrowBack from "@mui/icons-material/ArrowBack";
import ErrorOutline from "@mui/icons-material/ErrorOutline";
import Description from "@mui/icons-material/Description";
import Public from "@mui/icons-material/Public";
import CheckCircle from "@mui/icons-material/CheckCircle";
import DateRange from "@mui/icons-material/DateRange";
import { motion } from "framer-motion";
import SkeletonDetail from '../../../components/skeletons/SkeletonDetail';
import EnquiryForm from '../../../components/EnquiryForm';

const VisaDetail = ({ initialData = null, related = [] }) => {
  const { slug } = useParams();
  const [visa, setVisa] = useState(initialData);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Content is server-rendered via initialData; only fetch as a fallback.
    if (initialData) return;
    fetch(`/api/public/visas/${slug}`)
      .then(r => r.ok ? r.json() : Promise.reject('Not found'))
      .then(data => setVisa(data))
      .catch(e => setError(e))
      .finally(() => setLoading(false));
  }, [slug, initialData]);

  if (loading) return <SkeletonDetail />;

  if (error || !visa)
    return (
      <Container sx={{ pt: 15, textAlign: "center" }}>
        <ErrorOutline sx={{ fontSize: 60, color: "error.main", mb: 2 }} />
        <Typography variant="h4" gutterBottom>
          {error ? "Query Error" : "Visa Not Found"}
        </Typography>
        <Typography color="text.secondary" paragraph>
          {error
            ? error.message
            : "The visa package you are looking for might have been moved or removed."}
        </Typography>
        <Button component={RouterLink} href="/visas" variant="contained">
          Back to All Visas
        </Button>
      </Container>
    );

  const {
    title,
    content,
    featuredImage,
    visaDetails: acf,
    countries,
    visasType,
  } = visa;
  const thumbnail = featuredImage?.node?.sourceUrl;
  const srcSet = featuredImage?.node?.srcSet;
  const visaImage = acf?.visaImage?.node?.sourceUrl;

  const countryName = countries?.nodes?.[0]?.name;
  const countryFlag =
    countries?.nodes?.[0]?.countryFlag?.countryFlag?.node?.sourceUrl;
  const visaTypeList = visasType?.nodes?.map((t) => t.name).join(", ");

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh", pb: 10 }}>
      {/* Hero */}
      <Box
        sx={{
          position: "relative",
          height: { xs: "35vh", sm: "40vh", md: "50vh" },
          minHeight: { xs: 260, md: 350 },
          bgcolor: "primary.main",
          color: "white",
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
              opacity: 0.3,
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
            href="/visas"
            startIcon={<ArrowBack />}
            sx={{
              color: "white",
              alignSelf: "flex-start",
              mb: 4,
              backdropFilter: "blur(4px)",
              bgcolor: "rgba(255,255,255,0.1)",
              px: 2,
              "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
            }}
          >
            Back to Visas
          </Button>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Typography
              variant="h1"
              fontWeight={900}
              sx={{
                mb: 2,
                textShadow: "0 4px 12px rgba(0,0,0,0.6)",
                color: "white",
                fontSize: { xs: "1.5rem", sm: "2rem", md: "2.75rem" },
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
              sx={{ gap: 1 }}
            >
              {countryName && (
                <Chip
                  avatar={
                    countryFlag ? (
                      <Box
                        component="img"
                        src={countryFlag}
                        alt={countryName}
                        sx={{ width: 24, height: 24, borderRadius: "50%" }}
                      />
                    ) : (
                      <Public sx={{ color: "white !important" }} />
                    )
                  }
                  label={countryName}
                  sx={{
                    bgcolor: "rgba(255,255,255,0.15)",
                    color: "white",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255,255,255,0.2)",
                  }}
                />
              )}
              {visaTypeList && (
                <Chip
                  label={visaTypeList}
                  sx={{
                    bgcolor: "secondary.main",
                    color: "white",
                    boxShadow: 2,
                  }}
                />
              )}
              <Chip
                icon={<AccessTime sx={{ color: "white !important" }} />}
                label={acf?.processingTime || "Standard Processing"}
                sx={{
                  bgcolor: "rgba(255,255,255,0.15)",
                  color: "white",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255,255,255,0.2)",
                }}
              />
            </Stack>
          </motion.div>
        </Container>
      </Box>

      <Container
        maxWidth="xl"
        sx={{ mt: { xs: 4, md: 8 }, px: { xs: 2, sm: 3, lg: 4 } }}
      >
        <Grid container spacing={{ xs: 3, md: 6 }}>
          {/* Main Content */}
          <Grid size={{ xs: 12, lg: 8 }}>
            {/* Visa Image or Key Details */}
            {visaImage && (
              <Box
                sx={{
                  mb: 4,
                  borderRadius: 4,
                  overflow: "hidden",
                  boxShadow: 3,
                }}
              >
                <Box
                  component="img"
                  src={visaImage}
                  alt="Visa Sample"
                  sx={{
                    width: "100%",
                    height: "auto",
                    maxHeight: 400,
                    objectFit: "contain",
                    bgcolor: "grey.100",
                  }}
                />
              </Box>
            )}

            <Paper sx={{ p: 4, borderRadius: 4, mb: 4 }}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}
              >
                <Description color="primary" fontSize="large" />
                <Typography variant="h4" fontWeight="bold">
                  Requirements & Process
                </Typography>
              </Box>

              {/* Required Documents List */}
              {acf?.requiredDocuments && acf.requiredDocuments.length > 0 && (
                <Box
                  sx={{ mb: 4, bgcolor: "primary.50", p: 3, borderRadius: 2 }}
                >
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    gutterBottom
                    color="primary.main"
                  >
                    Required Documents
                  </Typography>
                  <List dense>
                    {acf.requiredDocuments.map((req, index) => (
                      <ListItem key={index}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <CheckCircle color="secondary" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText
                          primary={req.requiredDocument}
                          primaryTypographyProps={{ fontWeight: 500 }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}

              <Divider sx={{ mb: 4 }} />

              <MarkdownContent content={content} sx={{ fontSize: "1.1rem" }} />
            </Paper>
          </Grid>

          {/* Sidebar Details */}
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
                  sx={{ opacity: 0.9, fontWeight: "bold", color: "white" }}
                >
                  Service Fee
                </Typography>
                <Typography
                  variant="h3"
                  fontWeight={900}
                  sx={{ color: "white" }}
                >
                  {formatVisaFee(acf?.fees)}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ opacity: 0.8, color: "white" }}
                >
                  *Excluding govt fees if applicable
                </Typography>

                <Divider sx={{ my: 2, borderColor: "rgba(255,255,255,0.2)" }} />

                <Stack spacing={2}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <AccessTime sx={{ color: "white" }} />
                    <Box>
                      <Typography
                        variant="caption"
                        sx={{
                          color: "rgba(255,255,255,0.9) !important",
                          display: "block",
                        }}
                      >
                        Processing Time
                      </Typography>
                      <Typography
                        variant="subtitle1"
                        fontWeight="bold"
                        sx={{ color: "white !important", lineHeight: 1.2 }}
                      >
                        {acf?.processingTime || "N/A"}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <DateRange sx={{ color: "white" }} />
                    <Box>
                      <Typography
                        variant="caption"
                        sx={{
                          color: "rgba(255,255,255,0.9) !important",
                          display: "block",
                        }}
                      >
                        Validity
                      </Typography>
                      <Typography
                        variant="subtitle1"
                        fontWeight="bold"
                        sx={{ color: "white !important", lineHeight: 1.2 }}
                      >
                        {acf?.validityDuration || "N/A"}
                      </Typography>
                    </Box>
                  </Box>
                </Stack>
              </Paper>

              <Paper
                sx={{
                  p: 0,
                  borderRadius: 4,
                  overflow: "hidden",
                  bgcolor: "transparent",
                  boxShadow: "none",
                }}
              >
                <EnquiryForm
                  packageTitle={`${title} - Visa`}
                  currentUrl={typeof window !== "undefined" ? window.location.href : ""}
                  redirectTo="/thank-you/visas"
                />
              </Paper>
            </Stack>
          </Grid>
        </Grid>
      </Container>

<MobileStickyCTA
        title="Apply for visa"
        whatsappMessage={`Hi, I'm interested in the visa: ${title}`}
      />
    </Box>
  );
};

export default VisaDetail;
