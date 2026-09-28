"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  InputBase,
  Alert,
  CircularProgress,
  useTheme,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { radius } from "../../config/designSystem";
import { useRecaptcha } from "@/components/RecaptchaProvider";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const NewsletterCTA = () => {
  const theme = useTheme();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | submitting | error
  const [message, setMessage] = useState("");
  const { executeRecaptcha } = useRecaptcha();

  const onSubmit = async (e) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!EMAIL_RE.test(trimmed)) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }
    setStatus("submitting");
    setMessage("");
    try {
      const recaptchaToken = await executeRecaptcha("newsletter");
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Newsletter Subscriber",
          email: trimmed,
          serviceType: "Newsletter",
          message: "Newsletter subscription via homepage",
          recaptchaToken,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Subscription failed.");
      }
      setEmail("");
      router.push("/thank-you/newsletter");
    } catch (err) {
      setStatus("error");
      setMessage(err.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <Box component="section" sx={{ py: { xs: 8, md: 12 } }}>
      <Container>
        <Box
          sx={{
            bgcolor: "primary.main",
            borderRadius: radius.card,
            p: { xs: 6, md: 10 },
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
            color: "white",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background: `linear-gradient(135deg, ${alpha(
                theme.palette.secondary.main,
                0.2,
              )}, transparent)`,
            }}
          />

          <Box
            sx={{
              position: "relative",
              zIndex: 2,
              maxWidth: "md",
              mx: "auto",
            }}
          >
            <Typography
              variant="h2"
              gutterBottom
              fontWeight={900}
              sx={{ color: "common.white" }}
            >
              Start Your Journey
            </Typography>
            <Typography
              variant="h5"
              sx={{
                mb: 6,
                opacity: 0.9,
                fontWeight: 400,
                color: "common.white",
              }}
            >
              Join our exclusive newsletter for hidden deals, travel tips, and
              visa updates.
            </Typography>

            <Paper
              component="form"
              onSubmit={onSubmit}
              sx={{
                p: "4px",
                display: "flex",
                alignItems: "center",
                width: "100%",
                maxWidth: 600,
                mx: "auto",
                borderRadius: 50,
                bgcolor: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.2)",
                backdropFilter: "blur(10px)",
              }}
            >
              <InputBase
                sx={{
                  ml: 3,
                  flex: 1,
                  color: "white",
                  "& input::placeholder": {
                    color: "rgba(255,255,255,0.7)",
                    opacity: 1,
                  },
                }}
                placeholder="Enter your email address"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status === "submitting"}
                inputProps={{
                  "aria-label": "Email address for newsletter",
                  autoComplete: "email",
                  inputMode: "email",
                }}
              />
              <Button
                type="submit"
                variant="contained"
                color="secondary"
                disabled={status === "submitting"}
                sx={{
                  borderRadius: 50,
                  px: 4,
                  py: 1.5,
                  fontSize: "1rem",
                  minWidth: 120,
                }}
              >
                {status === "submitting" ? (
                  <CircularProgress size={20} sx={{ color: "common.white" }} />
                ) : (
                  "Subscribe"
                )}
              </Button>
            </Paper>

            {status === "error" && (
              <Alert
                severity="error"
                sx={{ mt: 3, maxWidth: 600, mx: "auto", textAlign: "left" }}
                role="alert"
              >
                {message}
              </Alert>
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default NewsletterCTA;
