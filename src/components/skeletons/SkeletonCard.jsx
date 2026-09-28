"use client";
import React from "react";
import { Card, CardContent, Box, Skeleton, Stack } from "@mui/material";

const SkeletonCard = () => {
  return (
    <Box sx={{ height: "100%", display: "block" }}>
      <Card
        elevation={0}
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          borderRadius: 4,
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
          overflow: "hidden",
        }}
      >
        {/* Image Placeholder */}
        <Box
          sx={{
            position: "relative",
            overflow: "hidden",
            height: { xs: 200, sm: 230, md: 260 },
          }}
        >
          <Skeleton variant="rectangular" height="100%" animation="wave" />
        </Box>

        <CardContent
          sx={{
            flexGrow: 1,
            p: { xs: 2, sm: 2.5, md: 3 },
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Title */}
          <Skeleton variant="text" height={28} width="90%" sx={{ mb: 1 }} />
          <Skeleton variant="text" height={28} width="60%" sx={{ mb: 2 }} />

          {/* Duration Row */}
          <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
            <Skeleton variant="circular" width={16} height={16} />
            <Skeleton variant="text" width={100} />
          </Stack>

          {/* Button Placeholder */}
          <Box sx={{ mt: "auto" }}>
            <Skeleton
              variant="rounded"
              height={40}
              width="100%"
              sx={{ borderRadius: 3 }}
            />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default SkeletonCard;

