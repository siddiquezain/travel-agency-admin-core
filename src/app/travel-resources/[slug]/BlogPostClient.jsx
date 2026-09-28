"use client";

import Link from "next/link";
import {
  Box,
  Container,
  Typography,
  Stack,
  Chip,
  Breadcrumbs,
  Divider,
  Button,
} from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import RichHtmlContent from "../../../components/RichHtmlContent";
import FaqAccordion from "../../../components/common/FaqAccordion";

function normalizeFaqs(value) {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) =>
      item && typeof item === "object"
        ? { q: String(item.q ?? ""), a: String(item.a ?? "") }
        : null,
    )
    .filter((f) => f && f.q && f.a);
}

function formatDate(iso) {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

export default function BlogPostClient({ post }) {
  if (!post) return null;

  const dateDisplay = formatDate(post.publishedAt || post.createdAt);
  const faqs = normalizeFaqs(post.faqs);

  return (
    <Box>
      {post.featuredImage && (
        <Box
          sx={{
            width: "100%",
            aspectRatio: { xs: "4/3", md: "21/9" },
            backgroundImage: `linear-gradient(rgba(0,0,0,0.25), rgba(0,0,0,0.55)), url(${post.featuredImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            display: "flex",
            alignItems: "flex-end",
            color: "common.white",
          }}
        >
          <Container maxWidth="md" sx={{ pb: { xs: 4, md: 8 } }}>
            <Stack spacing={1.5}>
              {post.category && (
                <Chip
                  label={post.category}
                  size="small"
                  sx={{
                    alignSelf: "flex-start",
                    color: "common.white",
                    borderColor: "common.white",
                  }}
                  variant="outlined"
                />
              )}
              <Typography
                variant="h2"
                component="h1"
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: "1.85rem", md: "2.75rem" },
                  textShadow: "0 4px 24px rgba(0,0,0,0.5)",
                }}
              >
                {post.title}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                {post.author?.name ? `By ${post.author.name}` : ""}
                {post.author?.name && dateDisplay ? " · " : ""}
                {dateDisplay}
              </Typography>
            </Stack>
          </Container>
        </Box>
      )}

      <Container
        maxWidth="md"
        sx={{
          pt: post.featuredImage ? { xs: 4, md: 6 } : { xs: 14, md: 18 },
          pb: { xs: 4, md: 6 },
        }}
      >
        <Breadcrumbs
          separator={<ChevronRightIcon fontSize="small" />}
          sx={{ mb: 3 }}
        >
          <Link href="/" style={{ textDecoration: "none", color: "inherit" }}>
            Home
          </Link>
          <Link
            href="/travel-resources"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            Travel Resources
          </Link>
          <Typography color="text.primary" noWrap sx={{ maxWidth: 240 }}>
            {post.title}
          </Typography>
        </Breadcrumbs>

        {!post.featuredImage && (
          <Stack spacing={1.5} sx={{ mb: 4 }}>
            {post.category && (
              <Chip
                label={post.category}
                size="small"
                color="primary"
                variant="outlined"
                sx={{ alignSelf: "flex-start" }}
              />
            )}
            <Typography
              variant="h3"
              component="h1"
              sx={{ fontWeight: 700, fontSize: { xs: "1.85rem", md: "2.5rem" } }}
            >
              {post.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {post.author?.name ? `By ${post.author.name}` : ""}
              {post.author?.name && dateDisplay ? " · " : ""}
              {dateDisplay}
            </Typography>
          </Stack>
        )}

        {post.excerpt && (
          <Typography
            variant="h6"
            component="p"
            sx={{
              color: "text.secondary",
              fontWeight: 400,
              fontStyle: "italic",
              mb: 4,
              borderLeft: 4,
              borderColor: "primary.main",
              pl: 2,
            }}
          >
            {post.excerpt}
          </Typography>
        )}

        <RichHtmlContent html={post.content} />

        <Divider sx={{ my: 5 }} />

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
        >
          <Button component={Link} href="/travel-resources" variant="outlined">
            ← Back to all resources
          </Button>
          <Button component={Link} href="/contact" variant="contained">
            Plan your trip with us
          </Button>
        </Stack>
      </Container>

      {faqs.length > 0 && (
        <FaqAccordion faqs={faqs} eyebrow="From this article" bgcolor="grey.50" />
      )}
    </Box>
  );
}
