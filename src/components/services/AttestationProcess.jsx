"use client";
import {
  Box,
  Container,
  Grid,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from "@mui/material";
import VerifiedUser from "@mui/icons-material/VerifiedUser";
import AccountBalance from "@mui/icons-material/AccountBalance";
import Public from "@mui/icons-material/Public";
import Flag from "@mui/icons-material/Flag";
import { radius, shadow } from "../../config/designSystem";

// Static, crawlable process content for /attestations. The attestation chain and
// per-document timelines below answer the process-intent SERP ("how certificate
// attestation works in Hyderabad") instead of leaving it to the card grid + FAQ.

const STEPS = [
  {
    icon: AccountBalance,
    title: "1. State authentication",
    body: "Documents are first verified at the state level — HRD attestation for educational certificates, and Home Department / SDM attestation for personal documents like birth and marriage certificates. Commercial documents are verified by the Chamber of Commerce.",
  },
  {
    icon: VerifiedUser,
    title: "2. MEA attestation / Apostille",
    body: "The Ministry of External Affairs (MEA), Government of India then attests the document. For Hague Convention countries this step is an Apostille; for other countries it is a normal MEA stamp.",
  },
  {
    icon: Public,
    title: "3. Embassy attestation",
    body: "For non-Hague countries (UAE, Saudi Arabia, Qatar, Kuwait, etc.), the destination country's embassy in India attests the MEA-verified document.",
  },
  {
    icon: Flag,
    title: "4. MOFA attestation",
    body: "On arrival in the destination Gulf country, the Ministry of Foreign Affairs (MOFA) completes the final attestation, making the document legally valid for use abroad.",
  },
];

const DOC_TIMELINES = [
  {
    type: "Educational (degree, diploma, transcripts)",
    authorities: "HRD → MEA → Embassy",
    time: "7–15 working days",
  },
  {
    type: "Personal (birth, marriage, experience)",
    authorities: "Home Dept / SDM → MEA → Embassy",
    time: "5–12 working days",
  },
  {
    type: "Commercial (incorporation, invoices, PoA)",
    authorities: "Chamber of Commerce → MEA → Embassy",
    time: "5–10 working days",
  },
];

export default function AttestationProcess() {
  return (
    <Container
      maxWidth="xl"
      component="section"
      sx={{ px: { xs: 2, sm: 3, lg: 4 }, mb: { xs: 4, md: 6 } }}
    >
      <Typography
        variant="h2"
        sx={{
          fontWeight: 800,
          fontSize: { xs: "1.5rem", md: "2rem" },
          mb: 1.5,
        }}
      >
        How certificate attestation works
      </Typography>
      <Typography
        variant="body1"
        sx={{ color: "text.secondary", maxWidth: 820, mb: 4, lineHeight: 1.8 }}
      >
        Certificate attestation is a step-by-step legal verification that proves
        your documents are genuine so they can be used abroad — for work
        visas, family visas, higher education or business. The exact chain
        depends on the document type and destination country. Here is the
        standard process we handle end-to-end.
      </Typography>

      <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mb: 5 }}>
        {STEPS.map((step) => {
          const Icon = step.icon;
          return (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={step.title}>
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 2.5, md: 3 },
                  height: "100%",
                  borderRadius: radius.card,
                  border: "1px solid",
                  borderColor: "divider",
                  boxShadow: shadow.card,
                }}
              >
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: "12px",
                    bgcolor: "primary.main",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 2,
                  }}
                >
                  <Icon />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, fontSize: "1.05rem" }}>
                  {step.title}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.7 }}>
                  {step.body}
                </Typography>
              </Paper>
            </Grid>
          );
        })}
      </Grid>

      <Typography variant="h3" sx={{ fontWeight: 700, fontSize: { xs: "1.25rem", md: "1.5rem" }, mb: 2 }}>
        Attestation timeline by document type
      </Typography>
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{ borderRadius: radius.card, border: "1px solid", borderColor: "divider", mb: 4 }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "background.default" }}>
              <TableCell sx={{ fontWeight: 700 }}>Document type</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Authorities involved</TableCell>
              <TableCell sx={{ fontWeight: 700 }} align="right">Typical timeline</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {DOC_TIMELINES.map((row) => (
              <TableRow key={row.type} hover>
                <TableCell sx={{ fontWeight: 600 }}>{row.type}</TableCell>
                <TableCell sx={{ color: "text.secondary" }}>{row.authorities}</TableCell>
                <TableCell align="right">
                  <Chip label={row.time} size="small" color="primary" variant="outlined" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.5, md: 3 },
          borderRadius: radius.card,
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "background.default",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, fontSize: "1.05rem" }}>
          Apostille vs attestation — which do you need?
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.8 }}>
          <strong>Apostille</strong> applies to Hague Convention countries (USA, UK,
          most of Europe, Australia) — a single MEA Apostille sticker is enough.{" "}
          <strong>Attestation</strong> is required for non-Hague countries such as
          the UAE, Saudi Arabia, Qatar and Kuwait, which need full embassy and MOFA
          attestation after MEA. Not sure which applies to your destination? Contact
          us and we&apos;ll confirm the exact chain for your document.
        </Typography>
      </Paper>
    </Container>
  );
}
