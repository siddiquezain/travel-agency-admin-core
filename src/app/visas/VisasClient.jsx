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
  Select,
  MenuItem,
  ListSubheader,
} from "@mui/material";
import Search from "@mui/icons-material/Search";
import Public from "@mui/icons-material/Public";
import Description from "@mui/icons-material/Description";
import AccessTimeOutlined from "@mui/icons-material/AccessTimeOutlined";
import DateRange from "@mui/icons-material/DateRange";
import { useDispatch, useSelector } from "react-redux";
import { setVisaFilter } from '../../store/slices/filterSlice';
import { AnimatePresence, motion } from "framer-motion";
import SkeletonCard from '../../components/skeletons/SkeletonCard';
import visasHero from '../../assets/images/hero/visas_hero.png';
import { HowItWorks } from '../../components/home/index';
import {
  pillSelectSx,
  searchPillSx,
  pillMenuProps,
  menuHeaderSx,
  menuItemSx,
  MenuDot,
  pillValue,
} from '../../components/common/pillFilters';

const VisasClient = ({ initialItems = [] }) => {
   
  const dispatch = useDispatch();
  const { search, country, visaType, processingTime, validity } =
    useSelector((state) => state.filters.visas);

  const [allVisas, setAllVisas] = useState(initialItems);
  const [loading, setLoading] = useState(initialItems.length === 0);

  useEffect(() => {
    if (initialItems.length > 0) return;
    fetch('/api/public/visas')
      .then(r => r.json())
      .then(data => { setAllVisas(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [initialItems.length]);

  // Prefill the search from the Visa Services mega-menu (?type=Tourist, …),
  // so those links surface the relevant visas (titles carry the type).
  useEffect(() => {
    const type = new URLSearchParams(window.location.search).get("type");
    if (type) dispatch(setVisaFilter({ search: type }));
  }, [dispatch]);

  const countries = useMemo(() => {
    const unique = new Set();
    allVisas.forEach((visa) => {
      const countryName = visa.countries?.nodes?.[0]?.name;
      if (countryName) unique.add(countryName);
    });
    return Array.from(unique).sort();
  }, [allVisas]);

  const visaTypes = useMemo(() => {
    const unique = new Set();
    allVisas.forEach((visa) => {
      visa.visasType?.nodes?.forEach((type) => {
        if (type.name) unique.add(type.name);
      });
    });
    return Array.from(unique).sort();
  }, [allVisas]);

  const processingTimes = useMemo(() => {
    const unique = new Set();
    allVisas.forEach((visa) => {
      const time = visa.visaDetails?.processingTime;
      if (time) unique.add(time);
    });
    return Array.from(unique).sort();
  }, [allVisas]);

  const validityDurations = useMemo(() => {
    const unique = new Set();
    allVisas.forEach((visa) => {
      const val = visa.visaDetails?.validityDuration;
      if (val) unique.add(val);
    });
    return Array.from(unique).sort();
  }, [allVisas]);

  const filteredVisas = useMemo(() => {
    return allVisas.filter((visa) => {
      const matchesSearch = visa.title
        .toLowerCase()
        .includes(search.toLowerCase());

      const visaCountry = visa.countries?.nodes?.[0]?.name;
      const matchesCountry = country ? visaCountry === country : true;

      const visaTypeNames = visa.visasType?.nodes?.map((n) => n.name) || [];
      const matchesType = visaType ? visaTypeNames.includes(visaType) : true;

      const matchesProcessing = processingTime
        ? visa.visaDetails?.processingTime === processingTime
        : true;

      const matchesValidity = validity
        ? visa.visaDetails?.validityDuration === validity
        : true;

      return (
        matchesSearch &&
        matchesCountry &&
        matchesType &&
        matchesProcessing &&
        matchesValidity
      );
    });
  }, [
    allVisas,
    search,
    country,
    visaType,
    processingTime,
    validity,
  ]);

  const handleSearchChange = (e) => {
    dispatch(setVisaFilter({ search: e.target.value }));
  };

  const [visibleCount, setVisibleCount] = React.useState(9);

  // Reset pagination to the first page whenever filters change.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional reset on filter change
    setVisibleCount(9);
  }, [search, country, visaType, processingTime, validity]);

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
          src={visasHero.src}
          alt="Visa Services — Origin Tours and Travels"
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
            Tourist visa &amp; stamping services in Hyderabad – fast &amp; reliable
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
            Hassle-free visa processing for major global destinations. Fast,
            reliable, and secure.
          </Typography>
        </Container>
      </Box>

      <HowItWorks />

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
            placeholder="Search Packages..."
            value={search}
            onChange={handleSearchChange}
            size="small"
            sx={{ flexGrow: 1, flexBasis: { md: 440 }, minWidth: { xs: "100%", md: 360 } }}
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
              display: "flex",
              gap: 1.5,
              flexWrap: "wrap",
              justifyContent: { xs: "stretch", md: "flex-start" },
            }}
          >
            <Select
              value={country ?? ""}
              onChange={(e) => dispatch(setVisaFilter({ country: e.target.value || null }))}
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
              value={visaType ?? ""}
              onChange={(e) => dispatch(setVisaFilter({ visaType: e.target.value || null }))}
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
                <MenuDot selected={!visaType} />
                All
              </MenuItem>
              {visaTypes.map((item) => (
                <MenuItem key={item} value={item} sx={menuItemSx}>
                  <MenuDot selected={visaType === item} />
                  {item}
                </MenuItem>
              ))}
            </Select>

            <Select
              value={processingTime ?? ""}
              onChange={(e) => dispatch(setVisaFilter({ processingTime: e.target.value || null }))}
              variant="standard"
              disableUnderline
              displayEmpty
              renderValue={(v) => pillValue(AccessTimeOutlined, v || "Processing")}
              MenuProps={pillMenuProps}
              aria-label="Processing"
              sx={{ ...pillSelectSx, flexGrow: { xs: 1, md: 0 }, minWidth: { xs: "100%", sm: 200 } }}
            >
              <ListSubheader sx={menuHeaderSx}>Processing</ListSubheader>
              <MenuItem value="" sx={menuItemSx}>
                <MenuDot selected={!processingTime} />
                All
              </MenuItem>
              {processingTimes.map((item) => (
                <MenuItem key={item} value={item} sx={menuItemSx}>
                  <MenuDot selected={processingTime === item} />
                  {item}
                </MenuItem>
              ))}
            </Select>

            <Select
              value={validity ?? ""}
              onChange={(e) => dispatch(setVisaFilter({ validity: e.target.value || null }))}
              variant="standard"
              disableUnderline
              displayEmpty
              renderValue={(v) => pillValue(DateRange, v || "Validity")}
              MenuProps={pillMenuProps}
              aria-label="Validity"
              sx={{ ...pillSelectSx, flexGrow: { xs: 1, md: 0 }, minWidth: { xs: "100%", sm: 180 } }}
            >
              <ListSubheader sx={menuHeaderSx}>Validity</ListSubheader>
              <MenuItem value="" sx={menuItemSx}>
                <MenuDot selected={!validity} />
                All
              </MenuItem>
              {validityDurations.map((item) => (
                <MenuItem key={item} value={item} sx={menuItemSx}>
                  <MenuDot selected={validity === item} />
                  {item}
                </MenuItem>
              ))}
            </Select>
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
            ) : filteredVisas.length > 0 ? (
              <>
                <Grid container spacing={3}>
                  <AnimatePresence>
                    {filteredVisas.slice(0, visibleCount).map((visa) => (
                      <Grid
                        size={{ xs: 12, sm: 6, lg: 4 }}
                        key={visa.id}
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
                        <ServiceCard item={visa} type="visa" />
                      </Grid>
                    ))}
                  </AnimatePresence>
                </Grid>

                {visibleCount < filteredVisas.length && (
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
              <Box sx={{ textAlign: "center", py: 10 }}>
                <Typography variant="h5" color="text.secondary">
                  No visa packages found.
                </Typography>
                <Button
                  variant="text"
                  color="secondary"
                  onClick={() => {
                    dispatch(
                      setVisaFilter({
                        search: "",
                        country: null,
                        visaType: null,
                        processingTime: null,
                        validity: null,
                      }),
                    );
                  }}
                  sx={{ mt: 2 }}
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

export default VisasClient;
