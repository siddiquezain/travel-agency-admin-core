"use client";
import React from "react";
import { Box, Container, Typography, Stack, Button } from "@mui/material";
import Phone from "@mui/icons-material/Phone";
import WhatsApp from "@mui/icons-material/WhatsApp";
import { radius } from "../../config/designSystem";

const PHONE = "+91 91777 87635";
const PHONE_HREF = "tel:+919177787635";
const WHATSAPP_HREF = "https://wa.me/919177787635";

/**
 * Reusable closing call-to-action banner for service pages.
 * Placed directly above the FAQ section.
 *
 * @param {string} title  Banner heading.
 * @param {string} [text] Supporting line under the heading.
 */
const ServiceCTA = ({
  title = "Ready to plan your trip?",
  text = "Call or WhatsApp our travel experts in Hyderabad for the best fares and a fast, friendly quote.",
}) => {
  return (
    <Box
      component="section"
      sx={{
        py: { xs: 8, md: 10 },
        textAlign: "center",
        background:
          "linear-gradient(135deg, #1A428A 0%, #2AB0E5 100%)",
        color: "common.white",
      }}
    >
      <Container maxWidth="sm">
        <Typography variant="h3" fontWeight={800} sx={{ mb: 1.5 }}>
          {title}
        </Typography>
        <Typography
          variant="body1"
          sx={{ mb: 4, lineHeight: 1.8, opacity: 0.9, mx: "auto" }}
        >
          {text}
        </Typography>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          justifyContent="center"
        >
          <Button
            href={PHONE_HREF}
            variant="contained"
            size="large"
            startIcon={<Phone />}
            sx={{
              borderRadius: radius.button,
              px: 4,
              py: 1.5,
              fontWeight: 700,
              textTransform: "none",
              bgcolor: "common.white",
              color: "primary.main",
              "&:hover": { bgcolor: "rgba(255,255,255,0.9)" },
            }}
          >
            {PHONE}
          </Button>
          <Button
            href={WHATSAPP_HREF}
            target="_blank"
            rel="noopener noreferrer"
            variant="outlined"
            size="large"
            startIcon={<WhatsApp />}
            sx={{
              borderRadius: radius.button,
              px: 4,
              py: 1.5,
              fontWeight: 700,
              textTransform: "none",
              color: "common.white",
              borderColor: "rgba(255,255,255,0.6)",
              "&:hover": {
                borderColor: "common.white",
                bgcolor: "rgba(255,255,255,0.1)",
              },
            }}
          >
            WhatsApp Us
          </Button>
        </Stack>
      </Container>
    </Box>
  );
};

export default ServiceCTA;
