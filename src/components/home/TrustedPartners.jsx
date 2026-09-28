"use client";
import React from "react";
import { Box, Container, Typography, Stack, useTheme } from "@mui/material";
import Flight from "@mui/icons-material/Flight";
import Groups from "@mui/icons-material/Groups";
import Handshake from "@mui/icons-material/Handshake";
import Apartment from "@mui/icons-material/Apartment";
import Public from "@mui/icons-material/Public";
import GppGood from "@mui/icons-material/GppGood";

const partners = [
  {
    icon: Flight,
    label: "IATA Accredited",
    gradient: "linear-gradient(135deg, #0284C7, #38BDF8)",
    color: "#0284C7",
  },
  {
    icon: Groups,
    label: "Ministry of Hajj",
    gradient: "linear-gradient(135deg, #059669, #34D399)",
    color: "#059669",
  },
  {
    icon: Handshake,
    label: "VFS Global Partner",
    gradient: "linear-gradient(135deg, #7C3AED, #A78BFA)",
    color: "#7C3AED",
  },
  {
    icon: Apartment,
    label: "Dubai Tourism",
    gradient: "linear-gradient(135deg, #D97706, #FBBF24)",
    color: "#D97706",
  },
  {
    icon: Public,
    label: "Embassy Authorized",
    gradient: "linear-gradient(135deg, #DC2626, #F87171)",
    color: "#DC2626",
  },
  {
    icon: GppGood,
    label: "ISO Certified",
    gradient: "linear-gradient(135deg, #0E7490, #22D3EE)",
    color: "#0E7490",
  },
];

const TrustedPartners = () => {
  const theme = useTheme();

  return (
    <Box
      component="section"
      sx={{
        py: { xs: 6, md: 8 },
        bgcolor: theme.palette.mode === "light" ? "grey.50" : "#0f172a",
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    >
      <Container>
        <Typography
          variant="subtitle2"
          textAlign="center"
          color="text.secondary"
          sx={{
            mb: 3,
            letterSpacing: 1.5,
            textTransform: "uppercase",
            fontSize: "0.75rem",
            fontWeight: 700,
          }}
        >
          Trusted By Global Organizations
        </Typography>
        <Box sx={{ overflow: "hidden", py: 2 }}>
          <Box
            sx={{
              display: "flex",
              gap: "3.5rem",
              alignItems: "center",
              width: "max-content",
              animation: "trustedScroll 28s linear infinite",
              "&:hover": { animationPlayState: "paused" },
              "@keyframes trustedScroll": {
                "0%": { transform: "translateX(0)" },
                "100%": { transform: "translateX(-50%)" },
              },
              "@media (prefers-reduced-motion: reduce)": {
                animation: "none",
              },
            }}
          >
            {[...partners, ...partners].map((p, i) => (
              <Stack
                key={i}
                direction="row"
                spacing={1.5}
                alignItems="center"
                sx={{
                  flexShrink: 0,
                  transition: "all 0.3s",
                  "&:hover": {
                    transform: "scale(1.08)",
                    "& .partner-icon-box": {
                      boxShadow: `0 8px 25px ${p.color}35`,
                    },
                  },
                }}
              >
                <Box
                  className="partner-icon-box"
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: "12px",
                    background: p.gradient,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: `0 4px 14px ${p.color}25`,
                    transition: "all 0.3s",
                    flexShrink: 0,
                  }}
                >
                  <p.icon sx={{ fontSize: 22, color: "white" }} />
                </Box>
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  sx={{ fontSize: "1.05rem", color: p.color, whiteSpace: "nowrap" }}
                >
                  {p.label}
                </Typography>
              </Stack>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default TrustedPartners;
