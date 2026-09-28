"use client";
import React, { useMemo, useEffect, useState } from "react";
import ServiceCard from '../../components/ServiceCard';
import { radius, shadow } from '../../config/designSystem';
import {
  Box,
  Container,
  Grid,
  Typography,
  TextField,
  InputAdornment,
  Button,
  Slider,
  Select,
  MenuItem,
  ListSubheader,
} from "@mui/material";
import Search from "@mui/icons-material/Search";
import Public from "@mui/icons-material/Public";
import Description from "@mui/icons-material/Description";
import { useDispatch, useSelector } from "react-redux";
import { setAttestationFilter } from '../../store/slices/filterSlice';
import { AnimatePresence, motion } from "framer-motion";
import SkeletonCard from '../../components/skeletons/SkeletonCard';
import AttestationProcess from '../../components/services/AttestationProcess';
import attestationsHero from '../../assets/images/hero/attestations_hero.png';
import {
  pillSelectSx,
  searchPillSx,
  pillMenuProps,
  menuHeaderSx,
  menuItemSx,
  MenuDot,
  pillValue,
} from '../../components/common/pillFilters';

const AttestationsClient = ({ initialItems = [] }) => {
   
  const dispatch = useDispatch();
  const { search, priceRange, country, attestationType } = useSelector(
    (state) => state.filters.attestations,
  );

  const [allAttestations, setAllAttestations] = useState(initialItems);
  const [loading, setLoading] = useState(initialItems.length === 0);

  useEffect(() => {
    if (initialItems.length > 0) return;
    fetch('/api/public/attestations')
      .then(r => r.json())
      .then(data => { setAllAttestations(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [initialItems.length]);

  const getPrice = (item) => {
    const raw = item.attestations?.price;
    if (!raw) return 0;
    return typeof raw === "number"
      ? raw
      : parseFloat(raw.toString().replace(/[^0-9.]/g, "")) || 0;
  };

  const maxPrice = useMemo(() => {
    if (!allAttestations.length) return 50000;
    return Math.max(...allAttestations.map(getPrice));
  }, [allAttestations]);

  const countries = useMemo(() => {
    const unique = new Set();
    allAttestations.forEach((item) => {
      const countryName = item.countries?.nodes?.[0]?.name;
      if (countryName) unique.add(countryName);
    });
    return Array.from(unique).sort();
  }, [allAttestations]);

  const getAttestationType = (title) => {
    const t = title.toLowerCase();
    if (t.includes("marriage")) return "Marriage";
    if (t.includes("birth")) return "Birth";
    if (
      t.includes("degree") ||
      t.includes("education") ||
      t.includes("diploma")
    )
      return "Degree";
    if (t.includes("commercial")) return "Commercial";
    if (t.includes("mofa")) return "MOFA";
    if (t.includes("embassy")) return "Embassy";
    return "Other";
  };

  const attestationTypes = useMemo(() => {
    const unique = new Set();
    allAttestations.forEach((item) => {
      const type = getAttestationType(item.title);
      if (type) unique.add(type);
    });
    return Array.from(unique).sort();
  }, [allAttestations]);

  useEffect(() => {
    if (maxPrice > 0 && priceRange[1] === 50000 && maxPrice !== 50000) {
      dispatch(setAttestationFilter({ priceRange: [0, maxPrice] }));
    }
  }, [maxPrice, dispatch, priceRange]);

  const filteredAttestations = useMemo(() => {
    return allAttestations.filter((item) => {
      const matchesSearch = item.title
        .toLowerCase()
        .includes(search.toLowerCase());
      const price = getPrice(item);
      const matchesPrice = price >= priceRange[0] && price <= priceRange[1];

      const attestationCountry = item.countries?.nodes?.[0]?.name;
      const matchesCountry = country ? attestationCountry === country : true;

      const type = getAttestationType(item.title);
      const matchesType = attestationType ? type === attestationType : true;

      return matchesSearch && matchesPrice && matchesCountry && matchesType;
    });
  }, [allAttestations, search, priceRange, country, attestationType]);

  const handleSearchChange = (e) => {
    dispatch(setAttestationFilter({ search: e.target.value }));
  };

  const handlePriceChange = (event, newValue) => {
    dispatch(setAttestationFilter({ priceRange: newValue }));
  };

  const [visibleCount, setVisibleCount] = React.useState(9);

  // Reset pagination to the first page whenever filters change.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional reset on filter change
    setVisibleCount(9);
  }, [search, priceRange, country, attestationType]);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 9);
  };

  return (
    <Box
      sx={{
        bgcolor: "background.default",
        minHeight: "100vh",
        pb: { xs: 6, md: 10 },
      }}
    >
      <Box
        sx={{
          position: "relative",
          height: { xs: "50vh", sm: "60vh", md: "70vh" },
          minHeight: { xs: 320, md: 420 },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          bgcolor: "grey.900",
          mb: { xs: 4, md: 6 },
        }}
      >
        <Box
          component="img"
          src={attestationsHero.src}
          alt="Certificate Attestation — Origin Tours and Travels"
          loading="eager"
          sx={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 0.7,
          }}
        />
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(0,0,0,0.3), rgba(0,0,0,0.8))",
          }}
        />

        <Container
          maxWidth="xl"
          sx={{
            position: "relative",
            zIndex: 10,
            textAlign: "center",
            color: "common.white",
            mt: { xs: 6, md: 8 },
            px: { xs: 2, sm: 3 },
          }}
        >
          <Typography
            variant="h1"
            fontWeight={900}
            gutterBottom
            sx={{
              fontSize: { xs: "2rem", sm: "2.5rem", md: "3.5rem" },
              textShadow: "0 4px 12px rgba(0,0,0,0.5)",
              color: "common.white",
            }}
          >
            Certificate attestation services in Hyderabad – fast processing
          </Typography>
          <Typography
            variant="h6"
            component="p"
            sx={{
              opacity: 0.9,
              maxWidth: 700,
              mx: "auto",
              fontWeight: 500,
              textShadow: "0 2px 4px rgba(0,0,0,0.5)",
              color: "common.white",
              fontSize: { xs: "0.9rem", md: "1.1rem" },
            }}
          >
            Official document attestation services for education, marriage, and
            birth certificates.
          </Typography>
        </Container>
      </Box>

      <AttestationProcess />

      <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, lg: 4 } }}>
        <Box
          sx={{
            mb: { xs: 4, md: 6 },
            display: "flex",
            flexWrap: { xs: "wrap", md: "nowrap" },
            gap: 1.5,
            alignItems: "center",
            bgcolor: "background.paper",
            p: { xs: 2, md: 2 },
            borderRadius: { xs: "20px", md: radius.card },
            boxShadow: shadow.card,
          }}
        >
          <TextField
            placeholder="Search certificates..."
            value={search}
            onChange={handleSearchChange}
            size="small"
            sx={{ flexGrow: 1, minWidth: { xs: "100%", md: 260 } }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: "#64748B", fontSize: 20 }} />
                  </InputAdornment>
                ),
                sx: searchPillSx,
              },
            }}
          />

          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              gap: 1.5,
              flexWrap: "wrap",
              justifyContent: { xs: "stretch", md: "flex-start" },
            }}
          >
            <Select
              value={country ?? ""}
              onChange={(e) => dispatch(setAttestationFilter({ country: e.target.value || null }))}
              variant="standard"
              disableUnderline
              displayEmpty
              renderValue={(v) => pillValue(Public, v || "Country")}
              MenuProps={pillMenuProps}
              aria-label="Country"
              sx={{ ...pillSelectSx, flexGrow: { xs: 1, md: 0 }, minWidth: { xs: "100%", sm: 220 } }}
            >
              <ListSubheader sx={menuHeaderSx}>Country</ListSubheader>
              <MenuItem value="" sx={menuItemSx}>
                <MenuDot selected={!country} />
                All
              </MenuItem>
              {countries.map((item) => (
                <MenuItem key={item} value={item} sx={menuItemSx}>
                  <MenuDot selected={country === item} />
                  {item}
                </MenuItem>
              ))}
            </Select>

            <Select
              value={attestationType ?? ""}
              onChange={(e) => dispatch(setAttestationFilter({ attestationType: e.target.value || null }))}
              variant="standard"
              disableUnderline
              displayEmpty
              renderValue={(v) => pillValue(Description, v || "Type")}
              MenuProps={pillMenuProps}
              aria-label="Type"
              sx={{ ...pillSelectSx, flexGrow: { xs: 1, md: 0 }, minWidth: { xs: "100%", sm: 180 } }}
            >
              <ListSubheader sx={menuHeaderSx}>Type</ListSubheader>
              <MenuItem value="" sx={menuItemSx}>
                <MenuDot selected={!attestationType} />
                All
              </MenuItem>
              {attestationTypes.map((item) => (
                <MenuItem key={item} value={item} sx={menuItemSx}>
                  <MenuDot selected={attestationType === item} />
                  {item}
                </MenuItem>
              ))}
            </Select>
          </Box>

          <Box
            sx={{
              width: { xs: "100%", md: 320 },
              display: "flex",
              alignItems: "center",
              gap: 2,
              px: { xs: 0.5, md: 0 },
            }}
          >
            <Typography variant="body2" fontWeight="bold" noWrap>
              Price:
            </Typography>
            <Slider
              value={priceRange}
              onChange={handlePriceChange}
              valueLabelDisplay="auto"
              min={0}
              max={maxPrice}
              step={100}
              sx={{ color: "secondary.main", flexGrow: 1 }}
            />
            <Typography
              variant="caption"
              sx={{ minWidth: 80, textAlign: "right" }}
            >
              ₹{priceRange[1]}
            </Typography>
          </Box>
        </Box>

        <Grid container spacing={4}>
          <Grid size={{ xs: 12 }}>
            {loading ? (
              <Grid
                container
                spacing={3}
                component={motion.div}
                initial="hidden"
                animate="visible"
                variants={{
                  visible: { transition: { staggerChildren: 0.1 } },
                }}
              >
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={n}>
                    <SkeletonCard />
                  </Grid>
                ))}
              </Grid>
            ) : filteredAttestations.length > 0 ? (
              <>
                <Grid container spacing={3}>
                  <AnimatePresence>
                    {filteredAttestations.slice(0, visibleCount).map((item) => (
                      <Grid
                        size={{ xs: 12, sm: 6, lg: 4 }}
                        key={item.id}
                        component={motion.div}
                        initial="hidden"
                        animate="visible"
                        variants={{
                          visible: {
                            opacity: 1,
                            y: 0,
                            transition: { duration: 0.3 },
                          },
                          hidden: { opacity: 0, y: 20 },
                        }}
                      >
                        <ServiceCard item={item} type="attestation" />
                      </Grid>
                    ))}
                  </AnimatePresence>
                </Grid>

                {visibleCount < filteredAttestations.length && (
                  <Box
                    sx={{ mt: 6, display: "flex", justifyContent: "center" }}
                  >
                    <Button
                      variant="outlined"
                      color="primary"
                      size="large"
                      onClick={handleLoadMore}
                      sx={{
                        borderRadius: radius.button,
                        px: 4,
                        py: 1.5,
                        fontWeight: "bold",
                      }}
                    >
                      Load More
                    </Button>
                  </Box>
                )}
              </>
            ) : (
              <Box width="100%" textAlign="center" py={10}>
                <Typography variant="h5" color="text.secondary" gutterBottom>
                  No services found
                </Typography>
                <Button
                  variant="outlined"
                  onClick={() =>
                    dispatch(
                      setAttestationFilter({
                        search: "",
                        priceRange: [0, maxPrice],
                        country: null,
                        attestationType: null,
                      }),
                    )
                  }
                >
                  Clear Filters
                </Button>
              </Box>
            )}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default AttestationsClient;
