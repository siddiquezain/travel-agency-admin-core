"use client";
import React from "react";
import { Box, Container, Typography, Button } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            minHeight: "60vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "background.default",
            py: 10,
          }}
        >
          <Container maxWidth="sm" sx={{ textAlign: "center" }}>
            <Typography
              variant="h2"
              fontWeight={900}
              sx={{
                mb: 2,
                background: "linear-gradient(135deg, #DC2626, #F87171)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Oops!
            </Typography>
            <Typography variant="h5" fontWeight={700} gutterBottom>
              Something went wrong
            </Typography>
            <Typography
              color="text.secondary"
              sx={{ mb: 4, fontSize: "1rem", lineHeight: 1.7 }}
            >
              We encountered an unexpected error. Please try refreshing the page
              or contact us if the problem persists.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="large"
              startIcon={<RefreshIcon />}
              onClick={this.handleRetry}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 50,
                fontWeight: 700,
                textTransform: "none",
              }}
            >
              Try Again
            </Button>
          </Container>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

