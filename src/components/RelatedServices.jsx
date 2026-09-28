"use client";
import React from "react";
import { Box, Container, Grid, Typography } from "@mui/material";
import ServiceCard from "./ServiceCard";

/**
 * "You may also like" cross-sell strip shown at the bottom of detail pages.
 * Renders nothing when there are no related items.
 *
 * @param {Array} items   Cards already normalised to the ServiceCard shape.
 * @param {"tour"|"visa"|"attestation"} type
 * @param {string} [heading]
 * @param {"umrah"} [variant]  Passed through to ServiceCard for Umrah styling.
 */
const RelatedServices = ({ items = [], type = "tour", heading = "You may also like", variant }) => {
  if (!items || items.length === 0) return null;

  return (
    <Box component="section" sx={{ py: { xs: 5, md: 7 } }}>
      <Container maxWidth="lg">
        <Typography variant="h4" fontWeight={800} sx={{ mb: { xs: 3, md: 4 } }}>
          {heading}
        </Typography>
        <Grid container spacing={3}>
          {items.map((item) => (
            <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={item.id || item.slug}>
              <ServiceCard item={item} type={type} variant={variant} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default RelatedServices;
