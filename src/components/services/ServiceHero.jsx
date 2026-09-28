"use client";
import React from "react";
import Link from "next/link";
import { Box, Container, Typography, Stack, Button } from "@mui/material";
import ArrowForward from "@mui/icons-material/ArrowForward";
import { radius } from "../../config/designSystem";

/**
 * Reusable hero for static service pages.
 * Renders the page's single semantic <h1>, a one-line subtitle and up
 * to two CTAs over a brand gradient (or an optional background image).
 *
 * @param {string} eyebrow      Small uppercase label above the heading.
 * @param {string} title        Main heading — rendered as the page <h1>.
 * @param {string} subtitle     One-line supporting copy.
 * @param {string} [image]      Optional background image src.
 * @param {React.ElementType} [icon]  Optional MUI icon shown above the eyebrow.
 * @param {{label,href}} [primaryCta]   Solid CTA (defaults to Contact).
 * @param {{label,href}} [secondaryCta] Outlined CTA (optional).
 */
const ServiceHero = ({
  eyebrow,
  title,
  subtitle,
  image,
  icon: Icon,
  primaryCta = { label: "Get a Free Quote", href: "/contact" },
  secondaryCta = { label: "Call +91 91777 87635", href: "tel:+919177787635" },
}) => {
  return (
    <Box
      component="section"
      sx={{
        position: "relative",
        minHeight: { xs: 420, md: 520 },
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        background:
          "linear-gradient(135deg, #0F2A5E 0%, #1A428A 45%, #2AB0E5 100%)",
      }}
    >
      {image && (
        <Box
          component="img"
          src={image}
          alt=""
          aria-hidden="true"
          sx={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 0.35,
          }}
        />
      )}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom, rgba(8,20,46,0.55) 0%, rgba(8,20,46,0.25) 45%, rgba(8,20,46,0.8) 100%)",
        }}
      />
      {/* Decorative rings */}
      <Box
        sx={{
          position: "absolute",
          top: -120,
          right: -100,
          width: 360,
          height: 360,
          borderRadius: "50%",
          border: "1px solid rgba(255,255,255,0.1)",
          pointerEvents: "none",
        }}
      />
      <Container
        maxWidth="md"
        sx={{
          position: "relative",
          zIndex: 2,
          textAlign: "center",
          color: "common.white",
          py: { xs: 10, md: 12 },
          px: { xs: 2, sm: 3 },
        }}
      >
        {Icon && (
          <Icon sx={{ fontSize: 52, color: "secondary.main", mb: 1.5 }} />
        )}
        {eyebrow && (
          <Typography
            variant="overline"
            sx={{
              letterSpacing: 3,
              color: "secondary.main",
              fontWeight: 700,
              fontSize: { xs: "0.75rem", md: "0.85rem" },
              display: "block",
            }}
          >
            {eyebrow}
          </Typography>
        )}
        <Typography
          variant="h1"
          fontWeight={900}
          sx={{
            mt: 1,
            mb: 2,
            color: "common.white",
            lineHeight: 1.15,
            textShadow: "0 4px 16px rgba(0,0,0,0.45)",
          }}
        >
          {title}
        </Typography>
        {subtitle && (
          <Typography
            variant="body1"
            sx={{
              opacity: 0.92,
              maxWidth: 640,
              mx: "auto",
              lineHeight: 1.8,
              color: "common.white",
              fontSize: { xs: "0.95rem", md: "1.1rem" },
            }}
          >
            {subtitle}
          </Typography>
        )}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          justifyContent="center"
          sx={{ mt: 4 }}
        >
          {primaryCta && (
            <Button
              component={Link}
              href={primaryCta.href}
              variant="contained"
              size="large"
              endIcon={<ArrowForward />}
              sx={{
                borderRadius: radius.button,
                px: 4,
                py: 1.5,
                fontWeight: 700,
                textTransform: "none",
                fontSize: "1rem",
              }}
            >
              {primaryCta.label}
            </Button>
          )}
          {secondaryCta && (
            <Button
              href={secondaryCta.href}
              variant="outlined"
              size="large"
              sx={{
                borderRadius: radius.button,
                px: 4,
                py: 1.5,
                fontWeight: 700,
                textTransform: "none",
                fontSize: "1rem",
                color: "common.white",
                borderColor: "rgba(255,255,255,0.6)",
                "&:hover": {
                  borderColor: "common.white",
                  bgcolor: "rgba(255,255,255,0.1)",
                },
              }}
            >
              {secondaryCta.label}
            </Button>
          )}
        </Stack>
      </Container>
    </Box>
  );
};

export default ServiceHero;
