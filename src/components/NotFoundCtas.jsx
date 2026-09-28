"use client";
import React from "react";
import Link from "next/link";
import { Button, Stack } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";

export default function NotFoundCtas() {
  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={2}
      justifyContent="center"
    >
      <Button
        component={Link}
        href="/"
        variant="contained"
        color="primary"
        size="large"
        startIcon={<HomeIcon />}
        sx={{
          px: 4,
          py: 1.5,
          borderRadius: 50,
          fontWeight: 700,
          textTransform: "none",
        }}
      >
        Back to Home
      </Button>
      <Button
        component={Link}
        href="/tours"
        variant="outlined"
        size="large"
        startIcon={<SearchIcon />}
        sx={{
          px: 4,
          py: 1.5,
          borderRadius: 50,
          fontWeight: 700,
          textTransform: "none",
        }}
      >
        Browse Tours
      </Button>
    </Stack>
  );
}
