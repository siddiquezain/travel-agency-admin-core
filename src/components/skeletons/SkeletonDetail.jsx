"use client";
import React from "react";
import { Box, Container, Grid, Skeleton, Stack, Paper } from "@mui/material";

const SkeletonDetail = () => {
  return (
    <Box sx={{ bgcolor: "background.default", pb: { xs: 6, md: 10 } }}>
      {/* Hero Skeleton */}
      <Skeleton
        variant="rectangular"
        sx={{
          height: { xs: "35vh", sm: "40vh", md: "50vh" },
          minHeight: { xs: 260, md: 350 },
          mb: { xs: 2, md: 4 },
        }}
        animation="wave"
      />

      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, lg: 4 } }}>
        <Grid container spacing={{ xs: 3, md: 4 }}>
          {/* Content Column */}
          <Grid size={{ xs: 12, md: 8 }}>
            {/* Tabs Placeholder */}
            <Box sx={{ mb: 4, display: "flex", gap: 2 }}>
              <Skeleton
                variant="rounded"
                width={120}
                height={48}
                sx={{ borderRadius: 2 }}
              />
              <Skeleton
                variant="rounded"
                width={120}
                height={48}
                sx={{ borderRadius: 2 }}
              />
              <Skeleton
                variant="rounded"
                width={120}
                height={48}
                sx={{ borderRadius: 2 }}
              />
            </Box>

            {/* Text Content */}
            <Paper elevation={0} sx={{ p: 4, borderRadius: 4, mb: 4 }}>
              <Skeleton variant="text" height={40} width="60%" sx={{ mb: 3 }} />
              <Stack spacing={1}>
                <Skeleton variant="text" />
                <Skeleton variant="text" />
                <Skeleton variant="text" />
                <Skeleton variant="text" width="80%" />
              </Stack>
              <Stack spacing={1} sx={{ mt: 3 }}>
                <Skeleton variant="text" />
                <Skeleton variant="text" />
                <Skeleton variant="text" width="90%" />
              </Stack>
            </Paper>
          </Grid>

          {/* Sidebar Column */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 4 }}>
              <Skeleton variant="text" height={32} width="50%" sx={{ mb: 3 }} />
              <Stack spacing={2}>
                <Skeleton variant="rounded" height={60} />
                <Skeleton variant="rounded" height={60} />
                <Skeleton variant="rounded" height={60} />
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default SkeletonDetail;

