"use client";
import React, { useState } from "react";
import { Box, Container, Typography } from "@mui/material";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import { radius, shadow, sectionColors } from "../../config/designSystem";

// Brand promo video. Replace VIDEO_ID with your own YouTube video ID.
const VIDEO_ID = "dQw4w9WgXcQ"; // TODO: replace with your agency's promo video ID
const VIDEO_TITLE = "Your Travel Agency – Explore the World";

// Click-to-play facade: we render the lightweight thumbnail first and only load
// YouTube's (heavy) player iframe once the user clicks — keeps initial load fast.
export default function VideoSection() {
  const [playing, setPlaying] = useState(false);
  const [thumb, setThumb] = useState(
    `https://i.ytimg.com/vi/${VIDEO_ID}/maxresdefault.jpg`,
  );

  return (
    <Box
      component="section"
      sx={{
        py: { xs: 8, md: 12 },
        bgcolor: "background.default",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Container maxWidth="lg">
        {/* ── Heading ── */}
        <Box textAlign="center" mb={{ xs: 5, md: 7 }}>
          <Box
            sx={{
              width: 56,
              height: 4,
              background: sectionColors.blue.gradient,
              borderRadius: 2,
              mx: "auto",
              mb: 3,
            }}
          />
          <Typography
            variant="overline"
            sx={{
              fontWeight: 700,
              letterSpacing: 4,
              color: sectionColors.blue.text,
              fontSize: "0.85rem",
            }}
          >
            SEE US IN ACTION
          </Typography>
          <Typography
            variant="h2"
            fontWeight={900}
            sx={{
              mt: 1.5,
              mb: 2,
              fontSize: { xs: "1.5rem", sm: "1.75rem", md: "3rem" },
              background: "linear-gradient(135deg, #1A428A, #2AB0E5, #065F46)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              wordBreak: "break-word",
            }}
          >
            Your Trusted Travel Agency
          </Typography>
          <Typography
            color="text.secondary"
            maxWidth="sm"
            mx="auto"
            sx={{
              fontSize: { xs: "0.95rem", sm: "1rem", md: "1.15rem" },
              lineHeight: 1.8,
            }}
          >
            Watch our story — crafting unforgettable journeys and hassle-free travel experiences.
          </Typography>
        </Box>

        {/* ── Player / facade ── */}
        <Box
          sx={{
            position: "relative",
            width: "100%",
            maxWidth: 900,
            mx: "auto",
            aspectRatio: "16 / 9",
            borderRadius: radius.section,
            boxShadow: shadow.elevated,
            overflow: "hidden",
            bgcolor: "common.black",
          }}
        >
          {playing ? (
            <Box
              component="iframe"
              src={`https://www.youtube-nocookie.com/embed/${VIDEO_ID}?autoplay=1&rel=0`}
              title={VIDEO_TITLE}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
              sx={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                border: 0,
              }}
            />
          ) : (
            <Box
              component="button"
              type="button"
              onClick={() => setPlaying(true)}
              aria-label={`Play video: ${VIDEO_TITLE}`}
              sx={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                p: 0,
                border: 0,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "transparent",
                "&:hover .play-btn": {
                  transform: "scale(1.08)",
                  bgcolor: "primary.main",
                },
              }}
            >
              <Box
                component="img"
                src={thumb}
                alt={VIDEO_TITLE}
                loading="lazy"
                onError={() =>
                  setThumb(`https://i.ytimg.com/vi/${VIDEO_ID}/hqdefault.jpg`)
                }
                sx={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
              {/* subtle dark overlay for contrast */}
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.35) 100%)",
                }}
              />
              <Box
                className="play-btn"
                sx={{
                  position: "relative",
                  width: { xs: 64, md: 84 },
                  height: { xs: 64, md: 84 },
                  borderRadius: "50%",
                  bgcolor: "rgba(26, 66, 138, 0.92)",
                  color: "common.white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: shadow.elevated,
                  transition: "transform .2s ease, background-color .2s ease",
                }}
              >
                <PlayArrowRoundedIcon sx={{ fontSize: { xs: 40, md: 52 }, ml: 0.5 }} />
              </Box>
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
}
