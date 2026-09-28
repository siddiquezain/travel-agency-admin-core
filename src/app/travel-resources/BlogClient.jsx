"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Box,
  Container,
  Grid,
  Typography,
  TextField,
  MenuItem,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Stack,
  Chip,
  Button,
} from "@mui/material";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import { useSelector, useDispatch } from "react-redux";
import { setBlogFilter } from "../../store/slices/filterSlice";

const PAGE_SIZE = 9;

function formatDate(iso) {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

export default function BlogClient({ initialPosts = [] }) {
  const dispatch = useDispatch();
  const { search, category } = useSelector((s) => s.filters.blog);

  const [posts, setPosts] = useState(initialPosts);
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [loading, setLoading] = useState(initialPosts.length === 0);

  useEffect(() => {
    if (initialPosts.length > 0) return;
    let cancelled = false;
    fetch("/api/public/travel-resources")
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        if (!cancelled) {
          setPosts(Array.isArray(data) ? data : []);
          setLoading(false);
        }
      })
      .catch(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [initialPosts]);

  // Prefill the category filter from the Travel Resources mega-menu
  // (?category=Destination%20Guides, …).
  useEffect(() => {
    const category = new URLSearchParams(window.location.search).get("category");
    if (category) dispatch(setBlogFilter({ category }));
  }, [dispatch]);

  const categories = useMemo(() => {
    const set = new Set();
    posts.forEach((p) => p.category && set.add(p.category));
    return Array.from(set).sort();
  }, [posts]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return posts.filter((p) => {
      if (category && p.category !== category) return false;
      if (q && !`${p.title} ${p.excerpt ?? ""}`.toLowerCase().includes(q)) {
        return false;
      }
      return true;
    });
  }, [posts, search, category]);

  // Reset pagination to the first page whenever filters change.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional reset on filter change
    setVisible(PAGE_SIZE);
  }, [search, category]);

  return (
    <Container
      maxWidth="lg"
      sx={{ pt: { xs: 14, md: 18 }, pb: { xs: 5, md: 8 } }}
    >
      <Stack spacing={1.5} sx={{ mb: { xs: 3, md: 5 }, textAlign: "center" }}>
        <Typography variant="overline" color="primary.main">
          The Origin Journal
        </Typography>
        <Typography variant="h3" component="h1" sx={{ fontWeight: 700 }}>
          Travel guides, tips & destinations
        </Typography>
        <Typography color="text.secondary" sx={{ maxWidth: 700, mx: "auto" }}>
          Practical advice from a Hyderabad-based travel agency with 10+ years
          of arranging Umrah, Hajj and holiday packages.
        </Typography>
      </Stack>

      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{ mb: 4 }}
      >
        <TextField
          fullWidth
          size="small"
          placeholder="Search articles..."
          value={search}
          onChange={(e) => dispatch(setBlogFilter({ search: e.target.value }))}
        />
        <TextField
          select
          size="small"
          sx={{ minWidth: { xs: "100%", sm: 220 } }}
          label="Category"
          value={category}
          onChange={(e) =>
            dispatch(setBlogFilter({ category: e.target.value }))
          }
        >
          <MenuItem value="">All categories</MenuItem>
          {categories.map((c) => (
            <MenuItem key={c} value={c}>
              {c}
            </MenuItem>
          ))}
        </TextField>
      </Stack>

      {loading ? (
        <Typography color="text.secondary">Loading posts…</Typography>
      ) : filtered.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography variant="h6" gutterBottom>
            No posts yet
          </Typography>
          <Typography color="text.secondary">
            New articles will appear here soon.
          </Typography>
        </Box>
      ) : (
        <>
          <Grid container spacing={3}>
            {filtered.slice(0, visible).map((post) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={post.id}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: 2,
                  }}
                >
                  <CardActionArea
                    component={Link}
                    href={`/travel-resources/${post.slug}`}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "stretch",
                      flex: 1,
                    }}
                  >
                    {post.featuredImage ? (
                      <CardMedia
                        component="img"
                        image={post.featuredImage}
                        alt={post.title}
                        sx={{ aspectRatio: "16/9", objectFit: "cover" }}
                      />
                    ) : (
                      <Box
                        sx={{
                          aspectRatio: "16/9",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background:
                            "linear-gradient(135deg, #1A428A 0%, #2AB0E5 100%)",
                          color: "common.white",
                        }}
                      >
                        <ArticleOutlinedIcon sx={{ fontSize: 56, opacity: 0.85 }} />
                      </Box>
                    )}
                    <CardContent sx={{ flex: 1 }}>
                      <Stack
                        direction="row"
                        spacing={1}
                        sx={{ mb: 1 }}
                        alignItems="center"
                      >
                        {post.category && (
                          <Chip
                            label={post.category}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        )}
                        <Typography variant="caption" color="text.secondary">
                          {formatDate(post.publishedAt || post.createdAt)}
                        </Typography>
                      </Stack>
                      <Typography
                        variant="h6"
                        component="h2"
                        sx={{ fontWeight: 600, mb: 1 }}
                      >
                        {post.title}
                      </Typography>
                      {post.excerpt && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            display: "-webkit-box",
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {post.excerpt}
                        </Typography>
                      )}
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>

          {visible < filtered.length && (
            <Box sx={{ textAlign: "center", mt: 5 }}>
              <Button
                variant="outlined"
                onClick={() => setVisible((v) => v + PAGE_SIZE)}
              >
                Load more
              </Button>
            </Box>
          )}
        </>
      )}
    </Container>
  );
}
