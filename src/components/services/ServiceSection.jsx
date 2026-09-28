import React from "react";
import { Box, Container, Typography } from "@mui/material";

/**
 * Standard content section for service pages — an optional eyebrow,
 * an <h2> heading, optional intro paragraph, then arbitrary children.
 *
 * @param {string} [eyebrow]
 * @param {string} title       Rendered as an <h2>.
 * @param {string|React.ReactNode} [intro]
 * @param {string} [bgcolor]   MUI theme background key.
 * @param {"sm"|"md"|"lg"|"xl"} [maxWidth]
 * @param {boolean} [center]   Centre the header block.
 */
const ServiceSection = ({
  eyebrow,
  title,
  intro,
  bgcolor = "background.default",
  maxWidth = "lg",
  center = true,
  children,
}) => {
  return (
    <Box component="section" sx={{ py: { xs: 8, md: 12 }, bgcolor }}>
      <Container maxWidth={maxWidth} sx={{ px: { xs: 2, sm: 3, lg: 4 } }}>
        <Box
          sx={{
            textAlign: center ? "center" : "left",
            mb: { xs: 4, md: 6 },
            maxWidth: center ? 720 : "none",
            mx: center ? "auto" : 0,
          }}
        >
          {eyebrow && (
            <Typography
              variant="overline"
              sx={{ color: "secondary.main", fontWeight: 700, letterSpacing: 2 }}
            >
              {eyebrow}
            </Typography>
          )}
          <Typography
            variant="h2"
            fontWeight={800}
            sx={{ mt: 1, mb: intro ? 1.5 : 0, color: "text.primary" }}
          >
            {title}
          </Typography>
          {intro && (
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ lineHeight: 1.8 }}
            >
              {intro}
            </Typography>
          )}
        </Box>
        {children}
      </Container>
    </Box>
  );
};

export default ServiceSection;
