"use client";

import { useMemo, useState } from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  TextField,
  MenuItem,
  Stack,
} from "@mui/material";
import DestinationCard from "@/components/destinations/DestinationCard";

export default function DestinationsClient({ initialDestinations = [] }) {
  const [search, setSearch] = useState("");
  const [country, setCountry] = useState("");

  const countries = useMemo(() => {
    const set = new Set();
    initialDestinations.forEach((d) => d.country?.name && set.add(d.country.name));
    return Array.from(set).sort();
  }, [initialDestinations]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return initialDestinations.filter((d) => {
      if (country && d.country?.name !== country) return false;
      if (
        q &&
        !`${d.name} ${d.description ?? ""} ${d.region ?? ""}`
          .toLowerCase()
          .includes(q)
      ) {
        return false;
      }
      return true;
    });
  }, [initialDestinations, search, country]);

  return (
    <Container maxWidth="lg" sx={{ pt: { xs: 14, md: 18 }, pb: { xs: 5, md: 8 } }}>
      <Stack spacing={1.5} sx={{ mb: { xs: 3, md: 5 }, textAlign: "center" }}>
        <Typography variant="overline" color="primary.main">
          Explore the world
        </Typography>
        <Typography variant="h3" component="h1" sx={{ fontWeight: 700 }}>
          Travel destinations & guides
        </Typography>
        <Typography color="text.secondary" sx={{ maxWidth: 700, mx: "auto" }}>
          Best time to visit, top attractions, culture, cuisine and practical
          tips — everything you need before you book, from a Hyderabad-based
          agency with 10+ years of experience.
        </Typography>
      </Stack>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 4 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search destinations…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <TextField
          select
          size="small"
          sx={{ minWidth: { xs: "100%", sm: 220 } }}
          label="Country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        >
          <MenuItem value="">All countries</MenuItem>
          {countries.map((c) => (
            <MenuItem key={c} value={c}>
              {c}
            </MenuItem>
          ))}
        </TextField>
      </Stack>

      {filtered.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography variant="h6" gutterBottom>
            No destinations yet
          </Typography>
          <Typography color="text.secondary">
            New destination guides will appear here soon.
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filtered.map((d) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={d.id}>
              <DestinationCard destination={d} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}
