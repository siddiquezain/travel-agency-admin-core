"use client";
import { Box } from "@mui/material";
import OpenInNew from "@mui/icons-material/OpenInNew";
import { radius, shadow } from "@/config/designSystem";

// TODO: Replace these with your agency's Google Maps embed URL and Maps place URL.
// To get the embed URL: go to Google Maps → find your location → Share → Embed a map → copy the src attribute.
// To get the Maps URL: go to Google Maps → find your location → copy the URL from the browser address bar.
const EMBED_SRC = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_SRC || "";
const MAPS_URL = process.env.NEXT_PUBLIC_GOOGLE_MAPS_URL || "https://maps.google.com";

/**
 * GoogleMap — embeds the office location via Google Maps iframe.
 * Clicking "Open in Google Maps" navigates to full Maps for directions.
 *
 * Set NEXT_PUBLIC_GOOGLE_MAPS_EMBED_SRC and NEXT_PUBLIC_GOOGLE_MAPS_URL in your .env file,
 * or pass embedSrc / mapsUrl as props to override per-instance.
 *
 * Props:
 *   embedSrc — Google Maps embed iframe src (overrides env var)
 *   mapsUrl  — Google Maps place URL for the "Open in Google Maps" link (overrides env var)
 *   height   — responsive MUI sx height value (default: { xs: 250, md: 300 })
 *   sx       — extra MUI sx overrides for the root wrapper
 */
export default function GoogleMap({ embedSrc, mapsUrl, height = { xs: 250, md: 300 }, sx }) {
  const src = embedSrc || EMBED_SRC;
  const href = mapsUrl || MAPS_URL;

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
          bgcolor: "grey.100",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {src ? (
          <Box
            component="iframe"
            src={src}
            title="Office location map"
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            sx={{ display: "block", border: "none", width: "100%", height: "100%" }}
          />
        ) : (
          <Box sx={{ p: 3, textAlign: "center", color: "text.secondary", fontSize: "0.875rem" }}>
            Map not configured. Set NEXT_PUBLIC_GOOGLE_MAPS_EMBED_SRC in your .env file.
          </Box>
        )}
      </Box>

      {/* Visible navigation link */}
      <Box
        component="a"
        href={href}
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
