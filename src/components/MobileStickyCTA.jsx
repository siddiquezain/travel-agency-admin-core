"use client";
import React from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import SendIcon from "@mui/icons-material/Send";

/**
 * Mobile sticky CTA bar â€” shown at the bottom of detail pages on small screens.
 * Provides quick "Enquire Now" and "WhatsApp" actions.
 */
const MobileStickyCTA = ({
  title = "Interested?",
  whatsappMessage = "Hi, I'd like to enquire about your services.",
}) => {
  const whatsappUrl = `https://wa.me/919177787635?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1200,
        display: { xs: "block", md: "none" },
        bgcolor: "background.paper",
        borderTop: "1px solid",
        borderColor: "divider",
        boxShadow: "0 -4px 20px rgba(0,0,0,0.1)",
        backdropFilter: "blur(12px)",
        px: 2,
        py: 1.5,
      }}
    >
      <Stack direction="row" spacing={1.5} alignItems="center">
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            fontWeight: 700,
            whiteSpace: "nowrap",
            display: { xs: "none", sm: "block" },
          }}
        >
          {title}
        </Typography>
        <Button
          href="#enquiry-form"
          variant="contained"
          color="primary"
          fullWidth
          size="small"
          startIcon={<SendIcon />}
          sx={{
            borderRadius: 50,
            fontWeight: 700,
            textTransform: "none",
            py: 1,
            fontSize: "0.85rem",
          }}
        >
          Enquire Now
        </Button>
        <Button
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          variant="contained"
          fullWidth
          size="small"
          startIcon={<WhatsAppIcon />}
          sx={{
            borderRadius: 50,
            fontWeight: 700,
            textTransform: "none",
            py: 1,
            fontSize: "0.85rem",
            bgcolor: "#25D366",
            color: "white",
            "&:hover": { bgcolor: "#1EBE5D" },
          }}
        >
          WhatsApp
        </Button>
      </Stack>
    </Box>
  );
};

export default MobileStickyCTA;

