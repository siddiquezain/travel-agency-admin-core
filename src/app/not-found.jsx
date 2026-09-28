import React from "react";
import { Box, Container, Typography } from "@mui/material";
import NotFoundCtas from "../components/NotFoundCtas";

export const metadata = {
  title: "Page Not Found",
  description: "The page you are looking for does not exist.",
  robots: { index: false, follow: false },
};

const NotFound = () => {
  return (
    <Box
      sx={{
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
        py: 10,
      }}
    >
      <Container maxWidth="sm" sx={{ textAlign: "center" }}>
        <Typography
          component="div"
          sx={{
            fontSize: { xs: "6rem", md: "10rem" },
            fontWeight: 900,
            background: "linear-gradient(135deg, #1A428A, #2AB0E5)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            lineHeight: 1,
            mb: 2,
          }}
        >
          404
        </Typography>
        <Typography variant="h1" fontWeight={800} gutterBottom sx={{ fontSize: { xs: "1.75rem", md: "2.5rem" } }}>
          Page Not Found
        </Typography>
        <Typography
          color="text.secondary"
          sx={{ mb: 5, fontSize: "1.1rem", lineHeight: 1.7 }}
        >
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Let&apos;s get you back on track.
        </Typography>
        <NotFoundCtas />
      </Container>
    </Box>
  );
};

export default NotFound;
