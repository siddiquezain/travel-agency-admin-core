"use client";
import { Box } from "@mui/material";
import OpenInNew from "@mui/icons-material/OpenInNew";
import { radius, shadow } from "@/config/designSystem";

const EMBED_SRC =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3807.27027464874!2d78.4447059751652!3d17.39881238349029!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb977d15dafc6b%3A0x94ba7b774d9ffdb9!2sOrigin%20Tours%20and%20Travels!5e0!3m2!1sen!2sin!4v1784723665177!5m2!1sen!2sin";

const MAPS_URL =
  "https://www.google.com/maps/place/Origin+Tours+and+Travels/data=!4m2!3m1!1s0x0:0x94ba7b774d9ffdb9";

/**
 * GoogleMap — embeds the office location via Google Maps iframe.
 * Clicking "Open in Google Maps" navigates to full Maps for directions.
 *
 * Props:
 *   height  — responsive MUI sx height value (default: { xs: 250, md: 300 })
 *   sx      — extra MUI sx overrides for the root wrapper
 */
export default function GoogleMap({ height = { xs: 250, md: 300 }, sx }) {
  return (
    <Box sx={{ width: "100%", ...sx }}>
      <Box
        sx={{
          borderRadius: radius.card,
          overflow: "hidden",
          boxShadow: shadow.card,
          border: "1px solid rgba(0,0,0,0.04)",
          height,
          width: "100%",
        }}
      >
        <Box
          component="iframe"
          src={EMBED_SRC}
          title="Origin Tours &amp; Travels – Masab Tank, Hyderabad"
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          sx={{ display: "block", border: "none", width: "100%", height: "100%" }}
        />
      </Box>

      {/* Visible navigation link — also present in iframe's built-in "View larger map" */}
      <Box
        component="a"
        href={MAPS_URL}
        target="_blank"
        rel="noopener noreferrer"
        sx={{
          display: "inline-flex",
          alignItems: "center",
          gap: 0.5,
          mt: 1.5,
          px: 0.5,
          fontSize: "0.8rem",
          fontWeight: 600,
          color: "primary.main",
          textDecoration: "none",
          "&:hover": { textDecoration: "underline" },
        }}
      >
        <OpenInNew sx={{ fontSize: 14 }} />
        Open in Google Maps
      </Box>
    </Box>
  );
}
