"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Container,
  Grid,
  Typography,
  TextField,
  Button,
  Stack,
  Chip,
} from "@mui/material";
import Phone from "@mui/icons-material/Phone";
import Email from "@mui/icons-material/Email";
import LocationOn from "@mui/icons-material/LocationOn";
import Send from "@mui/icons-material/Send";
import AccessTime from "@mui/icons-material/AccessTime";
import Groups from "@mui/icons-material/Groups";
import SupportAgent from "@mui/icons-material/SupportAgent";
import Star from "@mui/icons-material/Star";
import FlightTakeoff from "@mui/icons-material/FlightTakeoff";
import TravelExplore from "@mui/icons-material/TravelExplore";
import WhatsApp from "@mui/icons-material/WhatsApp";
import AutoAwesome from "@mui/icons-material/AutoAwesome";
import Verified from "@mui/icons-material/Verified";
import Bolt from "@mui/icons-material/Bolt";
import HeadsetMic from "@mui/icons-material/HeadsetMic";
import contactHero from '../../assets/images/hero/contact_hero.png';
import worldBg from '../../assets/images/World.webp';
import {
  radius,
  shadow,
  sectionColors,
} from '../../config/designSystem';
import { agency } from '../../config/agency';
import FaqAccordion from '../../components/common/FaqAccordion';
import GoogleMap from '../../components/common/GoogleMap';
import { breadcrumbJsonLd } from "@/lib/service-jsonld";
import { useRecaptcha } from "@/components/RecaptchaProvider";

const breadcrumbLd = {
  "@context": "https://schema.org",
  "@graph": [breadcrumbJsonLd([{ name: "Contact Us", path: "/contact" }])],
};

/* ── Animated Counter ─────────────────────────────────── */
const AnimatedCount = ({ end, suffix = "", duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const hasAnimated = useRef(false);
  const decimals = (String(end).split(".")[1] || "").length;

  const animate = useCallback(() => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;
    const startTime = performance.now();
    const step = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      const val = eased * end;
      setCount(
        decimals > 0 ? parseFloat(val.toFixed(decimals)) : Math.round(val),
      );
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [end, duration, decimals]);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- immediate fallback when IntersectionObserver is unavailable (SSR/older browsers)
      setCount(end);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) animate();
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [animate, end]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
};

/* ── Data ─────────────────────────────────────────────── */
const contactStats = [
  {
    label: "Happy Clients",
    value: 10,
    suffix: "K+",
    icon: Groups,
    color: sectionColors.blue,
  },
  {
    label: "Response Time",
    value: 2,
    suffix: " Hrs",
    icon: Bolt,
    color: sectionColors.amber,
  },
  {
    label: "Expert Agents",
    value: 25,
    suffix: "+",
    icon: SupportAgent,
    color: sectionColors.emerald,
  },
  {
    label: "Client Rating",
    value: 4.9,
    suffix: "★",
    icon: Star,
    color: sectionColors.orange,
  },
];

const contactMethods = [
  {
    icon: Phone,
    title: "Call Us",
    primary: agency.supportPhone,
    secondary: "Mon–Sat, 9 AM – 7 PM",
    color: sectionColors.blue,
    href: `tel:${agency.supportPhone.replace(/[^+\d]/g, "")}`,
    chipLabel: "Instant",
  },
  {
    icon: WhatsApp,
    title: "WhatsApp",
    primary: agency.supportPhone,
    secondary: "Quick responses, 24/7",
    color: sectionColors.emerald,
    href: `https://wa.me/${agency.whatsapp}`,
    chipLabel: "24/7",
  },
  {
    icon: Email,
    title: "Email Us",
    primary: agency.supportEmail,
    secondary: "We reply within 2 hours",
    color: sectionColors.amber,
    href: `mailto:${agency.supportEmail}`,
    chipLabel: "2hr Reply",
  },
  {
    icon: LocationOn,
    title: "Visit Us",
    primary: agency.address,
    secondary: "",
    color: sectionColors.purple,
    href: "https://maps.google.com",
    chipLabel: "Walk-in",
  },
];

const contactFaqs = [
  {
    q: "Where is your office located?",
    a: agency.address,
  },
  {
    q: "What are your office working hours?",
    a: "We are open Monday to Friday, 9:00 AM to 7:00 PM, and Saturday, 9:00 AM to 5:00 PM. We are closed on Sundays.",
  },
  {
    q: "Can I contact you on WhatsApp?",
    a: `Yes, WhatsApp us on ${agency.supportPhone}. We typically respond within 30 minutes during working hours.`,
  },
];

const officeHours = [
  { day: "Monday – Friday", time: "9:00 AM – 7:00 PM", active: true },
  { day: "Saturday", time: "9:00 AM – 5:00 PM", active: true },
  { day: "Sunday", time: "Closed", active: false },
];

/* ── Component ────────────────────────────────────────── */
const Contact = () => {
  const isDark = false;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const router = useRouter();
  const [submitStatus, setSubmitStatus] = useState("idle"); // idle | loading | error
  const { executeRecaptcha } = useRecaptcha();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus("loading");
    try {
      const recaptchaToken = await executeRecaptcha("contact");
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
          serviceType: formData.subject || undefined,
          recaptchaToken,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
      router.push("/thank-you/contact");
    } catch {
      setSubmitStatus("error");
    }
  };

  return (
    <Box sx={{ bgcolor: "background.paper", pb: 0 }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      {/* ━━━ HERO ━━━ */}
      <Box
        sx={{
          position: "relative",
          height: { xs: "50vh", sm: "60vh", md: "70vh" },
          minHeight: { xs: 320, md: 420 },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          bgcolor: "grey.900",
        }}
      >
        <Box
          component="img"
          src={contactHero.src}
          alt="Contact Us"
          sx={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 0.55,
          }}
        />
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.25) 40%, rgba(0,0,0,0.75) 100%)",
          }}
        />
        <Container
          maxWidth="md"
          sx={{
            position: "relative",
            zIndex: 10,
            textAlign: "center",
            color: "common.white",
            mt: { xs: 6, md: 8 },
            px: { xs: 2, sm: 3 },
          }}
        >
          <Typography
            variant="overline"
            sx={{
              letterSpacing: 3,
              color: "secondary.main",
              fontWeight: 700,
              fontSize: { xs: "0.75rem", md: "0.85rem" },
              textShadow: "0 2px 8px rgba(0,0,0,0.6)",
            }}
          >
            WE&apos;RE HERE FOR YOU
          </Typography>
          <Typography
            variant="h1"
            fontWeight={900}
            sx={{
              mt: 1.5,
              mb: 2,
              textShadow: "0 4px 16px rgba(0,0,0,0.5)",
              color: "common.white",
              lineHeight: 1.15,
            }}
          >
            Contact {agency.name} —
            <br />
            we&apos;re here to help
          </Typography>
          <Typography
            variant="body1"
            sx={{
              opacity: 0.9,
              maxWidth: 620,
              mx: "auto",
              lineHeight: 1.8,
              textShadow: "0 2px 6px rgba(0,0,0,0.5)",
              color: "common.white",
              fontSize: { xs: "0.95rem", md: "1.1rem" },
            }}
          >
            Have questions about tours, visas, or Umrah packages? Our travel
            experts are ready to craft your perfect trip.
          </Typography>
        </Container>
      </Box>

      {/* ━━━ STATS BAR ━━━ */}
      <Box
        sx={{
          bgcolor: isDark ? "background.paper" : "white",
          py: { xs: 4, md: 5 },
          borderBottom: "1px solid",
          borderColor: isDark ? "divider" : "rgba(0,0,0,0.06)",
          position: "relative",
          zIndex: 5,
          mt: { xs: -4, md: -5 },
          mx: { xs: 2, sm: 4, md: 8 },
          borderRadius: radius.card,
          boxShadow: shadow.elevated,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={{ xs: 2, md: 4 }}>
            {contactStats.map((stat, i) => (
              <Grid size={{ xs: 6, md: 3 }} key={i}>
                <Stack
                  alignItems="center"
                  spacing={1}
                  sx={{
                    textAlign: "center",
                    position: "relative",
                    "&::after":
                      i < contactStats.length - 1
                        ? {
                          content: '""',
                          position: "absolute",
                          right: 0,
                          top: "15%",
                          height: "70%",
                          width: "1px",
                          bgcolor: isDark
                            ? "rgba(255,255,255,0.08)"
                            : "rgba(0,0,0,0.08)",
                          display: { xs: "none", md: "block" },
                        }
                        : {},
                  }}
                >
                  <Box
                    sx={{
                      width: 52,
                      height: 52,
                      borderRadius: radius.icon,
                      background: stat.color.gradient,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: stat.color.shadow,
                      mb: 0.5,
                    }}
                  >
                    <stat.icon sx={{ fontSize: 26, color: "white" }} />
                  </Box>
                  <Typography
                    variant="h4"
                    fontWeight={800}
                    color="text.primary"
                  >
                    <AnimatedCount
                      end={stat.value}
                      suffix={stat.suffix}
                      duration={1800}
                    />
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    fontWeight={600}
                  >
                    {stat.label}
                  </Typography>
                </Stack>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ━━━ CONTACT METHODS ━━━ */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: "background.default" }}>
        <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, lg: 4 } }}>
          <Box sx={{ textAlign: "center", mb: { xs: 5, md: 8 } }}>
            <Typography
              variant="overline"
              sx={{
                color: "secondary.main",
                fontWeight: 700,
                letterSpacing: 2,
              }}
            >
              REACH OUT
            </Typography>
            <Typography
              variant="h2"
              fontWeight={800}
              sx={{ mt: 1, color: "text.primary" }}
            >
              Get in Touch
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                mt: 2,
                maxWidth: 550,
                mx: "auto",
                lineHeight: 1.8,
              }}
            >
              Choose the most convenient way to reach us. We&apos;re always
              ready to help plan your next adventure.
            </Typography>
          </Box>

          <Grid container spacing={{ xs: 2, md: 3 }}>
            {contactMethods.map((method, i) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={i}>
                <Box
                  component="a"
                  href={method.href}
                  target={method.href.startsWith("http") ? "_blank" : undefined}
                  rel={
                    method.href.startsWith("http")
                      ? "noopener noreferrer"
                      : undefined
                  }
                  sx={{
                    display: "block",
                    textDecoration: "none",
                    borderRadius: radius.card,
                    bgcolor: isDark ? "background.paper" : "white",
                    p: { xs: 3, md: 4 },
                    boxShadow: shadow.card,
                    border: "1px solid",
                    borderColor: isDark
                      ? "rgba(255,255,255,0.06)"
                      : "rgba(0,0,0,0.04)",
                    transition: "all 0.3s ease-out",
                    textAlign: "center",
                    height: "100%",
                    "&:hover": {
                      boxShadow: method.color.shadow,
                      transform: "translateY(-6px)",
                      borderColor: method.color.text + "33",
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: radius.icon,
                      background: method.color.gradient,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: method.color.shadow,
                      mx: "auto",
                      mb: 2.5,
                    }}
                  >
                    <method.icon sx={{ fontSize: 28, color: "white" }} />
                  </Box>
                  <Chip
                    label={method.chipLabel}
                    size="small"
                    sx={{
                      fontWeight: 700,
                      fontSize: "0.7rem",
                      bgcolor: method.color.soft,
                      color: method.color.text,
                      borderRadius: radius.badge,
                      mb: 2,
                    }}
                  />
                  <Typography
                    variant="h6"
                    fontWeight={700}
                    color="text.primary"
                    sx={{ mb: 1 }}
                  >
                    {method.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    sx={{ color: method.color.text, mb: 0.5 }}
                  >
                    {method.primary}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ lineHeight: 1.5 }}
                  >
                    {method.secondary}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ━━━ FORM + MAP SECTION ━━━ */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: "background.paper" }}>
        <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, lg: 4 } }}>
          <Grid container spacing={{ xs: 4, md: 6 }}>
            {/* Contact Form */}
            <Grid size={{ xs: 12, md: 7 }}>
              <Box
                sx={{
                  borderRadius: radius.card,
                  bgcolor: isDark ? "background.default" : "white",
                  p: { xs: 3, md: 5 },
                  boxShadow: shadow.card,
                  border: "1px solid",
                  borderColor: isDark
                    ? "rgba(255,255,255,0.06)"
                    : "rgba(0,0,0,0.04)",
                }}
              >
                <Stack direction="row" spacing={1.5} alignItems="center" mb={1}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: radius.icon,
                      background: sectionColors.blue.gradient,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: sectionColors.blue.shadow,
                    }}
                  >
                    <Send sx={{ fontSize: 24, color: "white" }} />
                  </Box>
                  <Box>
                    <Typography
                      variant="h5"
                      fontWeight={800}
                      color="text.primary"
                    >
                      Send us a Message
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Our team responds within 2 hours
                    </Typography>
                  </Box>
                </Stack>

                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4 }}>
                  <Grid container spacing={2.5}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        fullWidth
                        label="Full Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        variant="outlined"
                        required
                        slotProps={{
                          input: { sx: { borderRadius: radius.input } },
                        }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        fullWidth
                        label="Email Address"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        variant="outlined"
                        required
                        slotProps={{
                          input: { sx: { borderRadius: radius.input } },
                        }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        fullWidth
                        label="Phone Number"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        variant="outlined"
                        slotProps={{
                          input: { sx: { borderRadius: radius.input } },
                        }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        fullWidth
                        label="Subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        variant="outlined"
                        required
                        slotProps={{
                          input: { sx: { borderRadius: radius.input } },
                        }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        label="Your Message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        variant="outlined"
                        multiline
                        rows={5}
                        required
                        slotProps={{
                          input: { sx: { borderRadius: radius.input } },
                        }}
                      />
                    </Grid>
                    {submitStatus === "error" && (
                      <Grid size={{ xs: 12 }}>
                        <Box sx={{ p: 2, borderRadius: 2, bgcolor: "error.light", color: "error.dark", fontWeight: 600, fontSize: "0.95rem" }}>
                          Something went wrong. Please try again.
                        </Box>
                      </Grid>
                    )}
                    <Grid size={{ xs: 12 }}>
                      <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        disabled={submitStatus === "loading"}
                        endIcon={<Send />}
                        sx={{
                          py: 1.8,
                          px: 5,
                          borderRadius: radius.button,
                          fontWeight: 700,
                          fontSize: "1rem",
                          background:
                            "linear-gradient(135deg, #2563EB 0%, #60A5FA 100%)",
                          boxShadow: sectionColors.blue.shadow,
                          "&:hover": {
                            background:
                              "linear-gradient(135deg, #1D4ED8 0%, #3B82F6 100%)",
                            boxShadow: "0 8px 30px rgba(37, 99, 235, 0.35)",
                            transform: "translateY(-2px)",
                          },
                        }}
                      >
                        {submitStatus === "loading" ? "Sending…" : "Send Message"}
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            </Grid>

            {/* Map + Office Hours */}
            <Grid size={{ xs: 12, md: 5 }}>
              <Stack spacing={3}>
                {/* Google Maps Embed */}
                <GoogleMap />

                {/* Office Hours */}
                <Box
                  sx={{
                    borderRadius: radius.card,
                    bgcolor: isDark ? "background.default" : "white",
                    p: { xs: 3, md: 4 },
                    boxShadow: shadow.card,
                    border: "1px solid",
                    borderColor: isDark
                      ? "rgba(255,255,255,0.06)"
                      : "rgba(0,0,0,0.04)",
                  }}
                >
                  <Stack
                    direction="row"
                    spacing={1.5}
                    alignItems="center"
                    mb={3}
                  >
                    <Box
                      sx={{
                        width: 44,
                        height: 44,
                        borderRadius: radius.icon,
                        background: sectionColors.amber.gradient,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: sectionColors.amber.shadow,
                      }}
                    >
                      <AccessTime sx={{ fontSize: 22, color: "white" }} />
                    </Box>
                    <Typography
                      variant="h6"
                      fontWeight={700}
                      color="text.primary"
                    >
                      Office Hours
                    </Typography>
                  </Stack>
                  <Stack spacing={2}>
                    {officeHours.map((item, i) => (
                      <Stack
                        key={i}
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        sx={{
                          py: 1.5,
                          px: 2,
                          borderRadius: radius.chip,
                          bgcolor: item.active
                            ? isDark
                              ? "rgba(6,95,70,0.08)"
                              : sectionColors.emerald.soft
                            : isDark
                              ? "rgba(225,29,72,0.06)"
                              : sectionColors.rose.soft,
                          transition: "all 0.2s ease",
                        }}
                      >
                        <Typography
                          variant="body2"
                          fontWeight={600}
                          color="text.primary"
                        >
                          {item.day}
                        </Typography>
                        <Chip
                          label={item.time}
                          size="small"
                          sx={{
                            fontWeight: 700,
                            fontSize: "0.75rem",
                            bgcolor: item.active
                              ? sectionColors.emerald.soft
                              : sectionColors.rose.soft,
                            color: item.active
                              ? sectionColors.emerald.text
                              : sectionColors.rose.text,
                            borderRadius: radius.badge,
                          }}
                        />
                      </Stack>
                    ))}
                  </Stack>
                </Box>

                {/* Quick Contact Card */}
                <Box
                  sx={{
                    borderRadius: radius.card,
                    background: isDark
                      ? "linear-gradient(135deg, rgba(26,66,138,0.12), rgba(42,176,229,0.06))"
                      : sectionColors.blue.gradient,
                    p: { xs: 3, md: 4 },
                    color: "white",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {/* Decorative circle */}
                  <Box
                    sx={{
                      position: "absolute",
                      top: -30,
                      right: -30,
                      width: 120,
                      height: 120,
                      borderRadius: "50%",
                      border: "1px solid rgba(255,255,255,0.12)",
                      pointerEvents: "none",
                    }}
                  />
                  <HeadsetMic
                    sx={{
                      fontSize: 40,
                      mb: 2,
                      opacity: 0.9,
                      color: isDark ? "secondary.main" : "white",
                    }}
                  />
                  <Typography
                    variant="h6"
                    fontWeight={700}
                    sx={{
                      mb: 1,
                      color: isDark ? "text.primary" : "white",
                    }}
                  >
                    Need Immediate Help?
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      mb: 2.5,
                      opacity: 0.85,
                      lineHeight: 1.7,
                      color: isDark
                        ? "text.secondary"
                        : "rgba(255,255,255,0.9)",
                    }}
                  >
                    Our experts are available to help you with urgent travel
                    needs. Call or WhatsApp us directly.
                  </Typography>
                  <Button
                    component="a"
                    href={`https://wa.me/${agency.whatsapp}`}
                    target="_blank"
                    variant="contained"
                    startIcon={<WhatsApp />}
                    sx={{
                      borderRadius: radius.button,
                      px: 4,
                      py: 1.3,
                      fontWeight: 700,
                      background: isDark
                        ? "linear-gradient(135deg, #2AB0E5 0%, #67DAFF 100%)"
                        : "rgba(255,255,255,0.95)",
                      color: isDark ? "#0F172A" : "#1A428A",
                      "&:hover": {
                        background: isDark
                          ? "linear-gradient(135deg, #67DAFF 0%, #2AB0E5 100%)"
                          : "#ffffff",
                        transform: "translateY(-2px)",
                      },
                    }}
                  >
                    Chat on WhatsApp
                  </Button>
                </Box>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ━━━ FULL ADDRESS ━━━ */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: "background.default" }}>
        <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, lg: 4 } }}>
          <Grid container spacing={{ xs: 4, md: 8 }} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography
                variant="overline"
                sx={{
                  color: "secondary.main",
                  fontWeight: 700,
                  letterSpacing: 2,
                  mb: 1,
                  display: "block",
                }}
              >
                OUR OFFICE
              </Typography>
              <Typography
                variant="h2"
                fontWeight={800}
                sx={{ color: "text.primary", mb: 3 }}
              >
                Visit Our Office
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ lineHeight: 1.8, mb: 4, maxWidth: 500 }}
              >
                Our office is conveniently located for you to visit.
                Walk in for a personal consultation with our travel experts.
              </Typography>

              <Stack spacing={2.5}>
                <Stack direction="row" spacing={2} alignItems="flex-start">
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: radius.icon,
                      background: sectionColors.purple.gradient,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: sectionColors.purple.shadow,
                      flexShrink: 0,
                    }}
                  >
                    <LocationOn sx={{ fontSize: 22, color: "white" }} />
                  </Box>
                  <Box>
                    <Typography
                      variant="subtitle2"
                      fontWeight={700}
                      color="text.primary"
                    >
                      Full Address
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ lineHeight: 1.7 }}
                    >
                      {agency.address}
                    </Typography>
                  </Box>
                </Stack>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: radius.icon,
                      background: sectionColors.emerald.gradient,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: sectionColors.emerald.shadow,
                      flexShrink: 0,
                    }}
                  >
                    <Verified sx={{ fontSize: 22, color: "white" }} />
                  </Box>
                  <Box>
                    <Typography
                      variant="subtitle2"
                      fontWeight={700}
                      color="text.primary"
                    >
                      Authorized & Verified
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      IATA Accredited | Govt. Approved Hajj Operator
                    </Typography>
                  </Box>
                </Stack>
              </Stack>
            </Grid>

            {/* Right side — decorative card */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                sx={{
                  borderRadius: radius.card,
                  background: isDark
                    ? "linear-gradient(135deg, rgba(26,66,138,0.12), rgba(42,176,229,0.06))"
                    : "linear-gradient(135deg, #1A428A 0%, #2AB0E5 100%)",
                  p: { xs: 3, md: 5 },
                  color: "white",
                  position: "relative",
                  overflow: "hidden",
                  minHeight: { xs: 280, md: 340 },
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                {/* Decorative circles */}
                <Box
                  sx={{
                    position: "absolute",
                    top: -40,
                    right: -40,
                    width: 180,
                    height: 180,
                    borderRadius: "50%",
                    border: "1px solid rgba(255,255,255,0.12)",
                    pointerEvents: "none",
                  }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    bottom: -60,
                    left: -30,
                    width: 220,
                    height: 220,
                    borderRadius: "50%",
                    border: "1px solid rgba(255,255,255,0.08)",
                    pointerEvents: "none",
                  }}
                />
                <TravelExplore
                  sx={{
                    fontSize: 48,
                    mb: 2,
                    opacity: 0.9,
                    color: isDark ? "secondary.main" : "white",
                  }}
                />
                <Typography
                  variant="h4"
                  fontWeight={800}
                  sx={{
                    mb: 2,
                    color: isDark ? "text.primary" : "white",
                  }}
                >
                  Why Choose Us?
                </Typography>
                <Stack spacing={1.5}>
                  {[
                    {
                      label: "10+ Years Experience",
                      color: sectionColors.amber,
                    },
                    {
                      label: "Personalized Service",
                      color: sectionColors.emerald,
                    },
                    {
                      label: "Best Price Guarantee",
                      color: sectionColors.blue,
                    },
                    {
                      label: "24/7 Support",
                      color: sectionColors.purple,
                    },
                  ].map((item, i) => (
                    <Stack
                      key={i}
                      direction="row"
                      spacing={1.5}
                      alignItems="center"
                    >
                      <AutoAwesome
                        sx={{
                          fontSize: 18,
                          color: isDark
                            ? item.color.text
                            : "rgba(255,255,255,0.9)",
                        }}
                      />
                      <Typography
                        variant="body2"
                        fontWeight={600}
                        sx={{
                          color: isDark
                            ? "text.primary"
                            : "rgba(255,255,255,0.95)",
                        }}
                      >
                        {item.label}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ━━━ FAQ SECTION ━━━ */}
      <FaqAccordion
        faqs={contactFaqs}
        eyebrow="Common Questions"
        title="Frequently asked questions"
        bgcolor="background.paper"
      />

      {/* ━━━ CTA SECTION ━━━ */}
      <Box
        sx={{
          py: { xs: 8, md: 10 },
          background: isDark
            ? "linear-gradient(135deg, rgba(26,66,138,0.15), rgba(42,176,229,0.08))"
            : "linear-gradient(135deg, #1A428A 0%, #2AB0E5 100%)",
          backgroundImage: `url(${worldBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundBlendMode: "overlay",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative elements */}
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 600,
            height: 600,
            borderRadius: "50%",
            border: "1px solid",
            borderColor: isDark
              ? "rgba(42,176,229,0.06)"
              : "rgba(255,255,255,0.08)",
            pointerEvents: "none",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            height: 400,
            borderRadius: "50%",
            border: "1px solid",
            borderColor: isDark
              ? "rgba(42,176,229,0.04)"
              : "rgba(255,255,255,0.06)",
            pointerEvents: "none",
          }}
        />

        <Container maxWidth="sm" sx={{ position: "relative", zIndex: 2 }}>
          <FlightTakeoff
            sx={{
              fontSize: 48,
              color: isDark ? "secondary.main" : "white",
              mb: 2,
              opacity: 0.9,
            }}
          />
          <Typography
            variant="h3"
            fontWeight={800}
            sx={{
              color: isDark ? "text.primary" : "white",
              mb: 2,
            }}
          >
            Ready to Start Your Journey?
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: isDark ? "text.secondary" : "rgba(255,255,255,0.85)",
              mb: 4,
              lineHeight: 1.8,
              maxWidth: 480,
              mx: "auto",
            }}
          >
            Don&apos;t wait — your dream trip is just a conversation away. Reach
            out today and let our experts make it happen.
          </Typography>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            justifyContent="center"
          >
            <Button
              component="a"
              href={`tel:${agency.supportPhone.replace(/[^+\d]/g, "")}`}
              variant="contained"
              size="large"
              startIcon={<Phone />}
              sx={{
                borderRadius: radius.button,
                px: 5,
                py: 1.8,
                fontWeight: 700,
                fontSize: "1rem",
                background: isDark
                  ? "linear-gradient(135deg, #2AB0E5 0%, #67DAFF 100%)"
                  : "rgba(255,255,255,0.95)",
                color: isDark ? "#0F172A" : "#1A428A",
                boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                "&:hover": {
                  background: isDark
                    ? "linear-gradient(135deg, #67DAFF 0%, #2AB0E5 100%)"
                    : "#ffffff",
                  boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
                  transform: "translateY(-2px)",
                },
              }}
            >
              Call Now
            </Button>
            <Button
              component="a"
              href={`https://wa.me/${agency.whatsapp}`}
              target="_blank"
              variant="outlined"
              size="large"
              startIcon={<WhatsApp />}
              sx={{
                borderRadius: radius.button,
                px: 5,
                py: 1.8,
                fontWeight: 700,
                fontSize: "1rem",
                borderColor: isDark
                  ? "rgba(42,176,229,0.4)"
                  : "rgba(255,255,255,0.6)",
                color: isDark ? "secondary.main" : "white",
                "&:hover": {
                  borderColor: isDark
                    ? "secondary.main"
                    : "rgba(255,255,255,0.9)",
                  bgcolor: isDark
                    ? "rgba(42,176,229,0.08)"
                    : "rgba(255,255,255,0.1)",
                  transform: "translateY(-2px)",
                },
              }}
            >
              WhatsApp Us
            </Button>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
};

export default Contact;
