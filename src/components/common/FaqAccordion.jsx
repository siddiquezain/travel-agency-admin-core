import React from "react";
import {
  Box,
  Container,
  Typography,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { radius, shadow } from "../../config/designSystem";

/**
 * Reusable FAQ section.
 * Renders an accessible MUI accordion list and the matching FAQPage
 * JSON-LD so answers are eligible for Google rich results.
 *
 * @param {{q: string, a: string}[]} faqs  Question/answer pairs.
 * @param {string} [eyebrow]  Small label above the heading.
 * @param {string} [title]    Section heading (rendered as an <h2>).
 * @param {string} [bgcolor]  Section background (MUI theme key).
 */
const FaqAccordion = ({
  faqs = [],
  eyebrow = "Common Questions",
  title = "Frequently Asked Questions",
  bgcolor = "background.default",
}) => {
  if (!faqs.length) return null;

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <Box component="section" sx={{ py: { xs: 8, md: 12 }, bgcolor }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Container maxWidth="md">
        <Box textAlign="center" mb={{ xs: 5, md: 8 }}>
          {eyebrow && (
            <Typography variant="h6" color="secondary" gutterBottom>
              {eyebrow}
            </Typography>
          )}
          <Typography variant="h2" color="primary">
            {title}
          </Typography>
        </Box>
        <Stack spacing={2}>
          {faqs.map((faq, i) => (
            <Accordion
              key={i}
              elevation={0}
              sx={{
                borderRadius: `${radius.accordion} !important`,
                border: "1px solid rgba(0,0,0,0.06)",
                mb: 2,
                "&:before": { display: "none" },
                overflow: "hidden",
                transition: "all 0.3s ease-out",
                "&:hover": { boxShadow: shadow.soft },
              }}
            >
              <AccordionSummary expandIcon={<ExpandMore color="primary" />}>
                <Typography variant="h6" fontWeight="bold">
                  {faq.q}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography color="text.secondary">{faq.a}</Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Stack>
      </Container>
    </Box>
  );
};

export default FaqAccordion;
