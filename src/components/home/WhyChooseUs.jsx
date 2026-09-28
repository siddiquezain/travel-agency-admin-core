"use client";
import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Box, Container, Typography, Grid } from "@mui/material";
import Public from "@mui/icons-material/Public";
import GppGood from "@mui/icons-material/GppGood";
import WorkspacePremium from "@mui/icons-material/WorkspacePremium";
import SupportAgent from "@mui/icons-material/SupportAgent";
import Flight from "@mui/icons-material/Flight";
import Globe from "../../components/Globe";
import {
  radius,
  cardBg,
  sectionColors,
} from "../../config/designSystem";

const features = [
  {
    icon: GppGood,
    title: "100% Reliable",
    desc: "Trusted by thousands of families for secure documentation and transparent processing.",
    color: sectionColors.blue,
    bg: cardBg.cool,
  },
  {
    icon: Public,
    title: "Global Reach",
    desc: "Expert network spanning 50+ countries with local partnerships and embassy ties.",
    color: sectionColors.teal,
    bg: cardBg.neutral,
  },
  {
    icon: WorkspacePremium,
    title: "Premium Service",
    desc: "Luxury travel experiences with handpicked hotels, VIP transfers, and concierge support.",
    color: sectionColors.amber,
    bg: cardBg.warm,
  },
  {
    icon: SupportAgent,
    title: "24/7 Expert Support",
    desc: "Dedicated multilingual team available round the clock for every query and emergency.",
    color: sectionColors.indigo,
    bg: cardBg.cool,
  },
];

const WhyChooseUs = () => {
  const prefersReducedMotion = useReducedMotion();
  const orbAnimate = (xs, ys) =>
    prefersReducedMotion ? undefined : { x: xs, y: ys };
  const orbTransition = (duration) =>
    prefersReducedMotion
      ? undefined
      : { duration, repeat: Infinity, ease: "easeInOut" };
  return (
    <Box
      component="section"
      sx={{
        py: { xs: 8, md: 12 },
        position: "relative",
        overflow: "hidden",
        background:
          "linear-gradient(180deg, #f0f5ff 0%, #e8f4fd 30%, #f0fdf8 60%, #fefce8 85%, #fff 100%)",
      }}
    >
      {/* Decorative blurred orbs */}
      <Box
        component={motion.div}
        animate={orbAnimate([0, 30, 0], [0, -20, 0])}
        transition={orbTransition(14)}
        sx={{
          position: "absolute",
          top: -60,
          left: -80,
          width: 500,
          height: 500,
          background:
            "radial-gradient(circle, rgba(42,176,229,0.12), transparent 65%)",
          borderRadius: "50%",
          zIndex: 0,
        }}
      />
      <Box
        component={motion.div}
        animate={orbAnimate([0, -25, 0], [0, 35, 0])}
        transition={orbTransition(18)}
        sx={{
          position: "absolute",
          bottom: -80,
          right: -60,
          width: 450,
          height: 450,
          background:
            "radial-gradient(circle, rgba(52,211,153,0.10), transparent 65%)",
          borderRadius: "50%",
          zIndex: 0,
        }}
      />
      <Box
        component={motion.div}
        animate={orbAnimate([0, 20, 0], [0, -15, 0])}
        transition={orbTransition(16)}
        sx={{
          position: "absolute",
          top: "40%",
          right: "15%",
          width: 300,
          height: 300,
          background:
            "radial-gradient(circle, rgba(251,191,36,0.08), transparent 65%)",
          borderRadius: "50%",
          zIndex: 0,
        }}
      />

      <Container sx={{ position: "relative", zIndex: 2 }}>
        {/* Section Header */}
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          textAlign="center"
          mb={{ xs: 6, md: 10 }}
        >
          <Box
            component={motion.div}
            initial={{ width: 0 }}
            whileInView={{ width: 80 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            viewport={{ once: true }}
            sx={{
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
            WHY CHOOSE US
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
            Redefining Modern Travel & Logistics
          </Typography>
          <Typography
            color="text.secondary"
            maxWidth="md"
            mx="auto"
            sx={{
              fontSize: { xs: "0.95rem", sm: "1rem", md: "1.15rem" },
              lineHeight: 1.8,
              mt: 1,
            }}
          >
            We combine decade-long industry experience with modern technology to
            provide seamless travel and attestation services across 50+
            countries.
          </Typography>
        </Box>

        {/* Globe + Features Layout */}
        <Grid container spacing={{ xs: 4, md: 8 }} alignItems="center">
          {/* Globe Side */}
          <Grid
            size={{ xs: 12, lg: 6 }}
            sx={{ display: { xs: "none", sm: "block" } }}
          >
            <Box
              component={motion.div}
              initial={{ opacity: 0, scale: 0.75, rotate: -5 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{
                duration: 1.2,
                type: "spring",
                stiffness: 50,
                damping: 15,
              }}
              viewport={{ once: true }}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: "relative",
              }}
            >
              {/* Multi-layer glow rings */}
              <Box
                sx={{
                  position: "absolute",
                  width: { xs: 300, sm: 400, md: 560 },
                  height: { xs: 300, sm: 400, md: 560 },
                  borderRadius: "50%",
                  background:
                    "radial-gradient(circle, rgba(42,176,229,0.15) 0%, rgba(26,66,138,0.06) 50%, transparent 75%)",
                  filter: "blur(20px)",
                  zIndex: 0,
                }}
              />
              <Box
                sx={{
                  position: "absolute",
                  width: { xs: 240, sm: 340, md: 480 },
                  height: { xs: 240, sm: 340, md: 480 },
                  borderRadius: "50%",
                  border: "1px solid rgba(42,176,229,0.08)",
                  zIndex: 0,
                }}
              />
              <Box
                sx={{
                  position: "absolute",
                  width: { xs: 280, sm: 380, md: 520 },
                  height: { xs: 280, sm: 380, md: 520 },
                  borderRadius: "50%",
                  border: "1px dashed rgba(42,176,229,0.06)",
                  zIndex: 0,
                  animation: "spin 60s linear infinite",
                  "@keyframes spin": {
                    "100%": { transform: "rotate(360deg)" },
                  },
                  "@media (prefers-reduced-motion: reduce)": {
                    animation: "none",
                  },
                }}
              />

              {/* Globe container */}
              <Box
                sx={{
                  position: "relative",
                  borderRadius: "50%",
                  width: { xs: 280, sm: 420, md: 540 },
                  height: { xs: 280, sm: 420, md: 540 },
                  "& canvas": { borderRadius: "50%" },
                  zIndex: 1,
                }}
              >
                <Globe width={540} height={540} />
              </Box>

              {/* Floating stat badges */}
              <Box
                component={motion.div}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 1, duration: 0.6, type: "spring" }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.08, y: -2 }}
                sx={{
                  position: "absolute",
                  top: { xs: "5%", md: "8%" },
                  left: { xs: "0%", sm: "-5%", md: "-8%" },
                  bgcolor: "background.paper",
                  px: 2.5,
                  py: 1.5,
                  borderRadius: radius.card,
                  boxShadow:
                    "0 12px 40px rgba(42,176,229,0.15), 0 4px 12px rgba(0,0,0,0.06)",
                  display: "flex",
                  alignItems: "center",
                  gap: 1.2,
                  border: "1px solid rgba(42,176,229,0.1)",
                  zIndex: 5,
                }}
              >
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: "10px",
                    background: sectionColors.blue.gradient,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Flight sx={{ color: "white", fontSize: 18 }} />
                </Box>
                <Box>
                  <Typography
                    variant="subtitle2"
                    fontWeight={800}
                    sx={{ lineHeight: 1.2, fontSize: "0.85rem" }}
                  >
                    50+ Countries
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontSize: "0.7rem" }}
                  >
                    Worldwide Coverage
                  </Typography>
                </Box>
              </Box>

              <Box
                component={motion.div}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2, duration: 0.6, type: "spring" }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.08, y: -2 }}
                sx={{
                  position: "absolute",
                  top: { xs: "5%", md: "10%" },
                  right: { xs: "0%", sm: "-5%", md: "-6%" },
                  bgcolor: "background.paper",
                  px: 2.5,
                  py: 1.5,
                  borderRadius: radius.card,
                  boxShadow:
                    "0 12px 40px rgba(52,211,153,0.15), 0 4px 12px rgba(0,0,0,0.06)",
                  display: "flex",
                  alignItems: "center",
                  gap: 1.2,
                  border: "1px solid rgba(52,211,153,0.1)",
                  zIndex: 5,
                }}
              >
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: "10px",
                    background: sectionColors.emerald.gradient,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <GppGood sx={{ color: "white", fontSize: 18 }} />
                </Box>
                <Box>
                  <Typography
                    variant="subtitle2"
                    fontWeight={800}
                    sx={{ lineHeight: 1.2, fontSize: "0.85rem" }}
                  >
                    10K+ Clients
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontSize: "0.7rem" }}
                  >
                    Happy Travelers
                  </Typography>
                </Box>
              </Box>

              <Box
                component={motion.div}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4, duration: 0.6, type: "spring" }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.08, y: -2 }}
                sx={{
                  position: "absolute",
                  bottom: { xs: "-2%", md: "2%" },
                  left: "50%",
                  transform: "translateX(-50%)",
                  bgcolor: "background.paper",
                  px: 2.5,
                  py: 1.5,
                  borderRadius: radius.card,
                  boxShadow:
                    "0 12px 40px rgba(251,191,36,0.15), 0 4px 12px rgba(0,0,0,0.06)",
                  display: "flex",
                  alignItems: "center",
                  gap: 1.2,
                  border: "1px solid rgba(251,191,36,0.1)",
                  whiteSpace: "nowrap",
                  zIndex: 5,
                }}
              >
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: "10px",
                    background: sectionColors.amber.gradient,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <WorkspacePremium sx={{ color: "white", fontSize: 18 }} />
                </Box>
                <Box>
                  <Typography
                    variant="subtitle2"
                    fontWeight={800}
                    sx={{ lineHeight: 1.2, fontSize: "0.85rem" }}
                  >
                    IATA Certified
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontSize: "0.7rem" }}
                  >
                    Premium Agency
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>

          {/* Feature Cards Side */}
          <Grid size={{ xs: 12, lg: 6 }}>
            <Grid container spacing={3}>
              {features.map((feature, i) => (
                <Grid size={{ xs: 12, sm: 6 }} key={i}>
                  <Box
                    component={motion.div}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.6,
                      delay: 0.15 * i,
                      type: "spring",
                      stiffness: 100,
                      damping: 14,
                    }}
                    viewport={{ once: true, margin: "-30px" }}
                    whileHover={{ y: -8 }}
                    sx={{
                      borderRadius: radius.card,
                      background: feature.bg,
                      border: "1px solid",
                      borderColor: `${feature.color.text}10`,
                      p: { xs: 3, md: 3.5 },
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      gap: 2,
                      boxShadow: "0 8px 30px rgba(0,0,0,0.04)",
                      transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
                      cursor: "default",
                      "&:hover": {
                        boxShadow: `0 20px 50px ${feature.color.text}18, 0 8px 20px rgba(0,0,0,0.06)`,
                        borderColor: `${feature.color.text}25`,
                        "& .feature-icon-box": {
                          transform: "scale(1.1) rotate(-5deg)",
                          boxShadow: `0 12px 30px ${feature.color.text}35`,
                        },
                        "& .feature-accent-line": {
                          width: 40,
                        },
                      },
                    }}
                  >
                    <Box
                      className="feature-icon-box"
                      sx={{
                        width: 52,
                        height: 52,
                        borderRadius: radius.icon,
                        background: feature.color.gradient,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: `0 8px 24px ${feature.color.text}25`,
                        transition:
                          "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
                      }}
                    >
                      <feature.icon sx={{ fontSize: 24, color: "white" }} />
                    </Box>
                    <Typography
                      variant="h6"
                      fontWeight={800}
                      sx={{ fontSize: "1.05rem" }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ lineHeight: 1.7, fontSize: "0.85rem" }}
                    >
                      {feature.desc}
                    </Typography>
                    <Box
                      className="feature-accent-line"
                      sx={{
                        width: 24,
                        height: 3,
                        borderRadius: 2,
                        background: feature.color.gradient,
                        mt: "auto",
                        transition: "width 0.4s ease",
                      }}
                    />
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default WhyChooseUs;
