import React from "react";
import { motion } from "framer-motion";
import { Box, Container, Typography, Stack } from "@mui/material";
import NoteAdd from "@mui/icons-material/NoteAdd";
import CloudUpload from "@mui/icons-material/CloudUpload";
import HourglassEmpty from "@mui/icons-material/HourglassEmpty";
import TaskAlt from "@mui/icons-material/TaskAlt";
import FlightTakeoff from "@mui/icons-material/FlightTakeoff";
import { sectionColors } from "../../config/designSystem";

const steps = [
  {
    icon: NoteAdd,
    title: "Choose Service",
    desc: "Select from our wide range of visas, tours, or attestations.",
    color: sectionColors.blue,
    num: "01",
  },
  {
    icon: CloudUpload,
    title: "Submit Details",
    desc: "Upload your documents securely via our portal or WhatsApp.",
    color: sectionColors.teal,
    num: "02",
  },
  {
    icon: HourglassEmpty,
    title: "We Process",
    desc: "Our experts handle verification and official submission.",
    color: sectionColors.indigo,
    num: "03",
  },
  {
    icon: TaskAlt,
    title: "Get Delivered",
    desc: "Receive your approved visa or stamped documents on time.",
    color: sectionColors.emerald,
    num: "04",
  },
];

/* ── Reusable step card ──────────────────────────────────────── */
const StepCard = ({ step, index, direction }) => (
  <Box
    component={motion.div}
    initial={{ opacity: 0, x: direction === "left" ? -60 : 60 }}
    whileInView={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.6, delay: index * 0.15 }}
    viewport={{ once: true, margin: "-60px" }}
    whileHover={{ y: -12, scale: 1.03 }}
    sx={{
      position: "relative",
      borderRadius: 4,
      p: { xs: 3, md: 3.5 },
      display: "flex",
      flexDirection: direction === "left" ? "row" : "row-reverse",
      alignItems: "center",
      gap: 2.5,
      textAlign: direction === "left" ? "left" : "right",
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.08)",
      backdropFilter: "blur(12px)",
      cursor: "default",
      overflow: "hidden",
      transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
      "&:hover": {
        background: `rgba(255,255,255,0.08)`,
        borderColor: `${step.color.text}66`,
        boxShadow: `0 0 40px ${step.color.text}30, 0 20px 60px ${step.color.text}20`,
        "& .step-icon": {
          transform: "scale(1.15) rotate(8deg)",
          boxShadow: `0 0 50px ${step.color.text}60`,
        },
        "& .step-num": {
          color: `${step.color.text}25`,
          transform: "scale(1.2)",
        },
        "& .step-line": {
          width: 60,
          opacity: 1,
        },
      },
    }}
  >
    {/* Watermark number */}
    <Typography
      className="step-num"
      sx={{
        position: "absolute",
        top: 8,
        ...(direction === "left" ? { right: 16 } : { left: 16 }),
        fontWeight: 900,
        fontSize: "4rem",
        lineHeight: 1,
        color: "rgba(255,255,255,0.03)",
        userSelect: "none",
        transition: "all 0.4s ease",
      }}
    >
      {step.num}
    </Typography>

    {/* Icon */}
    <Box
      className="step-icon"
      sx={{
        flexShrink: 0,
        width: 68,
        height: 68,
        borderRadius: "50%",
        background: step.color.gradient,
        display: "grid",
        placeItems: "center",
        boxShadow: `0 12px 35px ${step.color.text}40`,
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      <step.icon sx={{ fontSize: 30, color: "white" }} />
    </Box>

    {/* Text */}
    <Box sx={{ flex: 1 }}>
      <Typography
        variant="overline"
        sx={{
          letterSpacing: 2,
          fontWeight: 800,
          fontSize: "0.7rem",
          color: step.color.text,
        }}
      >
        STEP {index + 1}
      </Typography>
      <Typography
        variant="h6"
        fontWeight={800}
        sx={{
          color: "common.white",
          fontSize: { xs: "1.1rem", md: "1.25rem" },
          mb: 0.5,
        }}
      >
        {step.title}
      </Typography>
      <Typography variant="body2" sx={{ lineHeight: 1.7, color: "grey.400" }}>
        {step.desc}
      </Typography>
      {/* Accent line */}
      <Box
        className="step-line"
        sx={{
          mt: 1.5,
          height: 3,
          width: 40,
          borderRadius: 2,
          background: step.color.gradient,
          opacity: 0.6,
          transition: "all 0.4s ease",
          ...(direction === "right" && { ml: "auto" }),
        }}
      />
    </Box>
  </Box>
);

/* ── Main Component ──────────────────────────────────────────── */
const HowItWorks = () => {
  return (
    <Box
      component="section"
      sx={{
        py: { xs: 8, md: 0 },
        minHeight: { md: "100vh" },
        display: "flex",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
        background:
          "linear-gradient(160deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
      }}
    >
      {/* Dot grid pattern */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          zIndex: 0,
        }}
      />

      {/* Glow orbs */}
      <Box
        component={motion.div}
        animate={{ x: [0, 40, 0], y: [0, -30, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        sx={{
          position: "absolute",
          top: "-15%",
          left: "-10%",
          width: { xs: 300, md: 500 },
          height: { xs: 300, md: 500 },
          background:
            "radial-gradient(circle, rgba(37,99,235,0.15), transparent 70%)",
          borderRadius: "50%",
          zIndex: 0,
        }}
      />
      <Box
        component={motion.div}
        animate={{ x: [0, -30, 0], y: [0, 40, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        sx={{
          position: "absolute",
          bottom: "-10%",
          right: "-8%",
          width: { xs: 250, md: 450 },
          height: { xs: 250, md: 450 },
          background:
            "radial-gradient(circle, rgba(5,150,105,0.12), transparent 70%)",
          borderRadius: "50%",
          zIndex: 0,
        }}
      />

      <Container maxWidth="xl" sx={{ position: "relative", zIndex: 2 }}>
        {/* Section Header */}
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          textAlign="center"
          mb={{ xs: 5, md: 8 }}
        >
          <Typography
            variant="overline"
            sx={{
              fontWeight: 700,
              letterSpacing: 4,
              color: "primary.light",
              fontSize: "0.85rem",
            }}
          >
            SIMPLE PROCESS
          </Typography>
          <Typography
            variant="h2"
            fontWeight={900}
            sx={{
              mt: 1.5,
              mb: 2.5,
              color: "common.white",
              fontSize: { xs: "2.2rem", sm: "2.8rem", md: "3.5rem" },
            }}
          >
            How It Works
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: "1rem", md: "1.2rem" },
              lineHeight: 1.7,
              color: "grey.400",
              maxWidth: 560,
              mx: "auto",
            }}
          >
            Get your visa or tour package in 4 simple steps. We make it easy and
            hassle-free.
          </Typography>
        </Box>

        {/* ── Desktop: Cards flanking center hub ── */}
        <Box
          sx={{
            display: { xs: "none", lg: "flex" },
            alignItems: "center",
            gap: 4,
          }}
        >
          {/* Left column — Steps 1 & 2 */}
          <Stack spacing={4} sx={{ flex: 1 }}>
            {steps.slice(0, 2).map((step, i) => (
              <StepCard key={i} step={step} index={i} direction="left" />
            ))}
          </Stack>

          {/* ── CENTER HUB ── */}
          <Box
            sx={{
              flexShrink: 0,
              width: 220,
              height: 220,
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Outer rotating ring */}
            <Box
              component={motion.div}
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              sx={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                border: "1px dashed rgba(255,255,255,0.12)",
              }}
            >
              {[0, 90, 180, 270].map((deg) => (
                <Box
                  key={deg}
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    bgcolor: "primary.light",
                    transform: `rotate(${deg}deg) translateX(110px) translate(-50%, -50%)`,
                  }}
                />
              ))}
            </Box>

            {/* Middle pulsing ring */}
            {[0, 1, 2].map((ring) => (
              <Box
                key={ring}
                component={motion.div}
                initial={{ scale: 0.6, opacity: 0.4 }}
                animate={{ scale: [0.6, 1.4], opacity: [0.4, 0] }}
                transition={{
                  duration: 3,
                  delay: ring * 1,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
                sx={{
                  position: "absolute",
                  width: 120,
                  height: 120,
                  borderRadius: "50%",
                  border: "2px solid",
                  borderColor: "primary.light",
                }}
              />
            ))}

            {/* Inner rotating ring */}
            <Box
              component={motion.div}
              animate={{ rotate: -360 }}
              transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
              sx={{
                position: "absolute",
                width: 160,
                height: 160,
                borderRadius: "50%",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            />

            {/* Center icon */}
            <Box
              component={motion.div}
              animate={{ y: [0, -6, 0] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              sx={{
                width: 100,
                height: 100,
                borderRadius: "50%",
                background:
                  "linear-gradient(135deg, rgba(37,99,235,0.2), rgba(5,150,105,0.2))",
                border: "1px solid rgba(255,255,255,0.15)",
                backdropFilter: "blur(12px)",
                boxShadow:
                  "0 0 60px rgba(37,99,235,0.25), inset 0 1px 0 rgba(255,255,255,0.1)",
                display: "grid",
                placeItems: "center",
                zIndex: 3,
              }}
            >
              <FlightTakeoff
                sx={{ fontSize: 44, color: "primary.light", opacity: 0.9 }}
              />
            </Box>
          </Box>

          {/* Right column — Steps 3 & 4 */}
          <Stack spacing={4} sx={{ flex: 1 }}>
            {steps.slice(2, 4).map((step, i) => (
              <StepCard
                key={i + 2}
                step={step}
                index={i + 2}
                direction="right"
              />
            ))}
          </Stack>
        </Box>

        {/* ── Mobile / Tablet: Vertical stack ── */}
        <Stack spacing={3} sx={{ display: { xs: "flex", lg: "none" } }}>
          {steps.map((step, i) => (
            <StepCard key={i} step={step} index={i} direction="left" />
          ))}
        </Stack>
      </Container>
    </Box>
  );
};

export default HowItWorks;
