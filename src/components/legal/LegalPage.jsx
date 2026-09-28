import { Box, Container, Typography, Divider } from "@mui/material";

/**
 * Shared layout for static legal/policy pages (Privacy, Terms, Refund).
 * `sections` is an array of { heading, body } where body is a string or JSX.
 */
export default function LegalPage({ title, updated, intro, sections = [] }) {
  return (
    // These pages have no hero, so they sit under the fixed Header. Top padding
    // clears the header (~72px xs / ~104px md) so the title isn't overlapped.
    // Matches the blog listing offset (pt 14/18) for consistency.
    <Box sx={{ bgcolor: "background.paper", pt: { xs: 14, md: 18 }, pb: { xs: 6, md: 10 } }}>
      <Container maxWidth="md">
        <Typography
          variant="h3"
          component="h1"
          sx={{ fontWeight: 800, mb: 1, fontSize: { xs: "1.8rem", md: "2.4rem" } }}
        >
          {title}
        </Typography>
        {updated && (
          <Typography variant="body2" sx={{ color: "text.secondary", mb: 3 }}>
            Last updated: {updated}
          </Typography>
        )}
        <Divider sx={{ mb: 4 }} />

        {intro && (
          <Typography variant="body1" sx={{ mb: 4, lineHeight: 1.8 }}>
            {intro}
          </Typography>
        )}

        {sections.map((s, i) => (
          <Box component="section" key={i} sx={{ mb: 4 }}>
            <Typography
              variant="h6"
              component="h2"
              sx={{ fontWeight: 700, mb: 1.5 }}
            >
              {s.heading}
            </Typography>
            {typeof s.body === "string" ? (
              <Typography variant="body1" sx={{ lineHeight: 1.8, color: "text.secondary" }}>
                {s.body}
              </Typography>
            ) : (
              s.body
            )}
          </Box>
        ))}
      </Container>
    </Box>
  );
}
