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
import LocalOfferOutlined from "@mui/icons-material/LocalOfferOutlined";
import AccessTimeOutlined from "@mui/icons-material/AccessTimeOutlined";
import AttachMoney from "@mui/icons-material/AttachMoney";
import { useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { setTourFilter } from '../../store/slices/filterSlice';
import { AnimatePresence, motion } from "framer-motion";
import SkeletonCard from '../../components/skeletons/SkeletonCard';
import toursHero from '../../assets/images/hero/tours_hero.png';
import {
  pillSelectSx,
  searchPillSx,
  pillMenuProps,
  menuHeaderSx,
  menuItemSx,
  MenuDot,
  pillValue,
} from '../../components/common/pillFilters';

const DURATION_LABELS = {
  short: "1–5 Days",
  medium: "6–10 Days",
  long: "10+ Days",
};
const PRICE_LABELS = { asc: "Low to High", desc: "High to Low" };

const ToursClient = ({ initialItems = [] }) => {

  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const { search, priceRange, duration, category, priceSort } = useSelector(
    (state) => state.filters.tours,
  );

  const [allTours, setAllTours] = useState(initialItems);
  const [loading, setLoading] = useState(initialItems.length === 0);
  // Deep-link scope from the Tours mega-menu (?scope=international|domestic).
  const [scope, setScope] = useState("");

  useEffect(() => {
    if (initialItems.length > 0) return;
    fetch('/api/public/tours')
      .then(r => r.json())
      .then(data => { setAllTours(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [initialItems.length]);

  // Sync search/scope from the URL (?q=, ?scope=) set by the header menu.
  // Keyed on searchParams so clicking a menu link while already on /tours
  // updates the list, and absent params clear stale filters.
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- intentional sync from URL */
    const sc = searchParams.get("scope");
    dispatch(setTourFilter({ search: searchParams.get("q") ?? "" }));
    setScope(sc === "international" || sc === "domestic" ? sc : "");
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [searchParams, dispatch]);

  const categories = useMemo(() => {
    const uniqueCategories = new Set();
    allTours.forEach((tour) => {
      tour.tourCategories?.nodes?.forEach((cat) => {
        uniqueCategories.add(cat.name);
      });
    });
    return Array.from(uniqueCategories);
  }, [allTours]);

  const parsePrice = (raw) => {
    if (raw == null) return null;
    const n = parseFloat(String(raw).replace(/[^0-9.]/g, ""));
    return Number.isFinite(n) ? n : null;
  };

  const maxPrice = useMemo(() => {
    if (!allTours.length) return 500000;
    const prices = allTours
      .map((t) => parsePrice(t.tourDetails?.price))
      .filter((n) => n != null && n > 0);
    return prices.length ? Math.max(...prices) : 500000;
  }, [allTours]);

  useEffect(() => {
    if (maxPrice > 0 && priceRange[1] === 500000 && maxPrice !== 500000) {
      dispatch(setTourFilter({ priceRange: [0, maxPrice] }));
    }
  }, [maxPrice, dispatch, priceRange]);

  const filteredTours = useMemo(() => {
    let filtered = allTours.filter((tour) => {
      // Match the title or the tour's country, so menu links like
      // ?q=Azerbaijan find tours titled after a city (e.g. "Baku City Break").
      const q = search.toLowerCase();
      const tourCountry = (
        tour.tourDetails?.holidayCountry?.nodes?.[0]?.name ?? ""
      ).toLowerCase();
      const matchesSearch =
        tour.title.toLowerCase().includes(q) || tourCountry.includes(q);

      let matchesCategory = true;
      if (category) {
        const tourCats = tour.tourCategories?.nodes?.map((c) => c.name) || [];
        matchesCategory = tourCats.includes(category);
      }

      const price = parsePrice(tour.tourDetails?.price);
      const matchesPrice =
        price == null || (price >= priceRange[0] && price <= priceRange[1]);

      let matchesDuration = true;
      if (duration) {
        const days = parseInt(tour.tourDetails?.durationDaysNights, 10) || 0;
        if (duration === "short") matchesDuration = days <= 5;
        if (duration === "medium") matchesDuration = days > 5 && days <= 10;
        if (duration === "long") matchesDuration = days > 10;
      }

      let matchesScope = true;
      if (scope) {
        const c = (tour.tourDetails?.holidayCountry?.nodes?.[0]?.name ?? "")
          .trim()
          .toLowerCase();
        matchesScope =
          scope === "domestic" ? c === "india" : c !== "" && c !== "india";
      }

      return (
        matchesSearch &&
        matchesCategory &&
        matchesPrice &&
        matchesDuration &&
        matchesScope
      );
    });

    if (priceSort) {
      filtered.sort((a, b) => {
        const priceA = parsePrice(a.tourDetails?.price) ?? 0;
        const priceB = parsePrice(b.tourDetails?.price) ?? 0;
        return priceSort === "asc" ? priceA - priceB : priceB - priceA;
      });
    }

    return filtered;
  }, [allTours, search, priceRange, duration, category, priceSort, scope]);

  const handleSearchChange = (e) => {
    dispatch(setTourFilter({ search: e.target.value }));
  };

  const handleDurationChange = (e) => {
    dispatch(setTourFilter({ duration: e.target.value }));
  };

  const handleCategoryChange = (e) => {
    dispatch(setTourFilter({ category: e.target.value }));
  };

  const handlePriceSortChange = (e) => {
    dispatch(setTourFilter({ priceSort: e.target.value }));
  };

  const [visibleCount, setVisibleCount] = React.useState(9);

  // Reset pagination to the first page whenever filters change.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional reset on filter change
    setVisibleCount(9);
  }, [search, priceRange, duration, category, priceSort, scope]);

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
          src={toursHero.src}
          alt="Holiday Packages"
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
            Holiday packages – domestic &amp; international
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
            Discover curated holiday experiences tailored just for you. From
            relaxing beach getaways to adventurous mountain treks.
          </Typography>
        </Container>
      </Box>

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
            placeholder="Search destinations..."
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

          <Select
            value={category}
            onChange={handleCategoryChange}
            variant="standard"
            disableUnderline
            displayEmpty
            renderValue={(v) => pillValue(LocalOfferOutlined, v || "Tours")}
            MenuProps={pillMenuProps}
            aria-label="Category"
            sx={{ ...pillSelectSx, flexGrow: { xs: 1, md: 0 } }}
          >
            <ListSubheader sx={menuHeaderSx}>Category</ListSubheader>
            <MenuItem value="" sx={menuItemSx}>
              <MenuDot selected={!category} />
              All
            </MenuItem>
            {categories.map((cat) => (
              <MenuItem key={cat} value={cat} sx={menuItemSx}>
                <MenuDot selected={category === cat} />
                {cat}
              </MenuItem>
            ))}
          </Select>

          <Select
            value={duration}
            onChange={handleDurationChange}
            variant="standard"
            disableUnderline
            displayEmpty
            renderValue={(v) =>
              pillValue(AccessTimeOutlined, DURATION_LABELS[v] || "Duration")
            }
            MenuProps={pillMenuProps}
            aria-label="Duration"
            sx={{ ...pillSelectSx, flexGrow: { xs: 1, md: 0 } }}
          >
            <ListSubheader sx={menuHeaderSx}>Duration</ListSubheader>
            <MenuItem value="" sx={menuItemSx}>
              <MenuDot selected={!duration} />
              All
            </MenuItem>
            <MenuItem value="short" sx={menuItemSx}>
              <MenuDot selected={duration === "short"} />
              Short (1-5 Days)
            </MenuItem>
            <MenuItem value="medium" sx={menuItemSx}>
              <MenuDot selected={duration === "medium"} />
              Medium (6-10 Days)
            </MenuItem>
            <MenuItem value="long" sx={menuItemSx}>
              <MenuDot selected={duration === "long"} />
              Long (10+ Days)
            </MenuItem>
          </Select>

          <Select
            value={priceSort}
            onChange={handlePriceSortChange}
            variant="standard"
            disableUnderline
            displayEmpty
            renderValue={(v) => pillValue(AttachMoney, PRICE_LABELS[v] || "Price")}
            MenuProps={pillMenuProps}
            aria-label="Sort by price"
            sx={{ ...pillSelectSx, flexGrow: { xs: 1, md: 0 } }}
          >
            <ListSubheader sx={menuHeaderSx}>Price</ListSubheader>
            <MenuItem value="" sx={menuItemSx}>
              <MenuDot selected={!priceSort} />
              Relevance
            </MenuItem>
            <MenuItem value="asc" sx={menuItemSx}>
              <MenuDot selected={priceSort === "asc"} />
              Low to High
            </MenuItem>
            <MenuItem value="desc" sx={menuItemSx}>
              <MenuDot selected={priceSort === "desc"} />
              High to Low
            </MenuItem>
          </Select>
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
            ) : filteredTours.length > 0 ? (
              <>
                <AnimatePresence>
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
                    {filteredTours.slice(0, visibleCount).map((tour) => (
                      <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={tour.id}>
                        <ServiceCard item={tour} type="tour" />
                      </Grid>
                    ))}
                  </Grid>
                </AnimatePresence>

                {visibleCount < filteredTours.length && (
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
                  No tours found matching your criteria.
                </Typography>
                <Button
                  variant="text"
                  color="secondary"
                  onClick={() => {
                    setScope("");
                    dispatch(
                      setTourFilter({
                        search: "",
                        duration: "",
                        category: "",
                        priceSort: "",
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

export default ToursClient;
