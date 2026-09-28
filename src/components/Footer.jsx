"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Box,
  Container,
  Grid,
  Typography,
  Stack,
  IconButton,
  Link as MuiLink,
  useTheme,
} from "@mui/material";
import Facebook from "@mui/icons-material/Facebook";
import Twitter from "@mui/icons-material/Twitter";
import Instagram from "@mui/icons-material/Instagram";
import YouTube from "@mui/icons-material/YouTube";

// Local Assets
import mastercardIcon from "../assets/images/icons/mastercard.webp";
import gpayIcon from "../assets/images/icons/gpay.webp";
import logo from "../assets/images/logo.webp";

const DEFAULT_HOLIDAY_PACKAGES = [
  { name: "Delhi Agra Jaipur Tour Packages", to: "/tours", keywords: ["delhi", "agra", "jaipur"] },
  { name: "Kashmir Promotional Package (Deluxe)", to: "/tours", keywords: ["kashmir"] },
  { name: "Kerala Tour Package (Luxury)", to: "/tours", keywords: ["kerala"] },
  { name: "Shimla Manali Chandigarh Tour Packages (Deluxe)", to: "/tours", keywords: ["shimla", "manali"] },
  { name: "Ooty Tour Packages", to: "/tours", keywords: ["ooty"] },
];

const DEFAULT_VISA_PACKAGES = [
  { name: "Dubai Tourist Visa 30 Days", to: "/visas", keywords: ["dubai", "30"] },
  { name: "Dubai Tourist Visa 90 Days", to: "/visas", keywords: ["dubai", "90"] },
  { name: "Saudi Arabia 30 Days Tourist Visa", to: "/visas", keywords: ["saudi"] },
  { name: "Malaysia 15 Days Tourist eNTRI Visa", to: "/visas", keywords: ["malaysia"] },
  { name: "Qatar 30 Days Tourist Visa", to: "/visas", keywords: ["qatar"] },
];

const resolveLinks = (defaults, overrides) =>
  defaults.map((item) => {
    const match = overrides?.find((o) => o.name === item.name);
    return { name: item.name, to: match?.to ?? item.to };
  });

const Footer = ({ popularTours, popularVisas } = {}) => {
  const theme = useTheme();

  const socialIcons = [
    { Icon: Facebook, color: "white", href: "https://facebook.com/origintoursandtravels", label: "Facebook" },
    { Icon: Twitter, color: "white", href: "https://twitter.com/origintravels", label: "Twitter" },
    { Icon: YouTube, color: "white", href: "https://www.youtube.com/@origintoursandtravels", label: "YouTube" },
    { Icon: Instagram, color: "white", href: "https://instagram.com/origintoursandtravels", label: "Instagram" },
  ];

  const holidayPackages = resolveLinks(DEFAULT_HOLIDAY_PACKAGES, popularTours);
  const visaPackages = resolveLinks(DEFAULT_VISA_PACKAGES, popularVisas);

  const ourServices = [
    { name: "Flights", to: "/flights" },
    { name: "Holiday Packages", to: "/tours" },
    { name: "Umrah Packages", to: "/umrah" },
    { name: "Hajj Packages", to: "/hajj" },
    { name: "Visa Stamping", to: "/visas" },
    { name: "Hotels", to: "/hotels" },
    { name: "Transport Booking", to: "/transport" },
    { name: "Certificate Attestation", to: "/attestations" },
    { name: "Travel Resources", to: "/travel-resources" },
  ];

  const umrahPackages = [
  {
    name: "Umrah Packages from Bangalore",
    to: "/umrah-packages-from-bangalore",
  },
  {
    name: "Umrah Packages from Chennai",
    to: "/umrah-packages-from-chennai",
  },
  {
    name: "Umrah Packages from Delhi",
    to: "/umrah-packages-from-delhi",
  },
  {
    name: "Umrah Packages from Mumbai",
    to: "/umrah-packages-from-mumbai",
  },
  {
    name: "Umrah Packages from Pune",
    to: "/umrah-packages-from-pune",
  },
  {
    name: "Umrah Packages from Vijayawada",
    to: "/umrah-packages-from-vijayawada",
  },
    ];

  const renderLinkColumn = (title, items) => (
    <Grid size={{ xs: 12, sm: 3, md: 2 }} key={title}>
      <Typography
        variant="subtitle1"
        fontWeight="bold"
        gutterBottom
        sx={{
          mb: { xs: 1.5, md: 2 },
          color: "white",
          fontSize: { xs: "1rem", md: "1.1rem" },
        }}
      >
        {title}
      </Typography>
      <Stack spacing={{ xs: 1, md: 1.5 }}>
        {items.map((item) => (
          <MuiLink
            key={item.name}
            component={Link}
            href={item.to}
            sx={{
              color: "grey.500",
              textDecoration: "none",
              fontSize: { xs: "0.8rem", md: "0.9rem" },
              "&:hover": { color: "secondary.main", pl: 0.5 },
              transition: "all 0.3s",
              display: "block",
            }}
          >
            {item.name}
          </MuiLink>
        ))}
      </Stack>
    </Grid>
  );

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: theme.palette.mode === "light" ? "#000000" : "#020617",
        color: "white",
      }}
    >
      {/* Top Bar - Follow Us */}
      <Box sx={{ borderBottom: "1px solid rgba(255,255,255,0.1)", py: 1 }}>
        <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, lg: 4 } }}>
          <Stack
            direction="row"
            justifyContent={{ xs: "center", sm: "flex-end" }}
            alignItems="center"
            spacing={2}
          >
            <Typography
              variant="body2"
              sx={{
                color: "grey.400",
                fontSize: { xs: "0.8rem", md: "0.875rem" },
              }}
            >
              Follow us
            </Typography>
            <Stack direction="row" spacing={1}>
              {socialIcons.map(({ Icon, href, label }, index) => (
                <IconButton
                  key={index}
                  size="small"
                  component="a"
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  sx={{
                    color: "white",
                    bgcolor: "rgba(255,255,255,0.1)",
                    "&:hover": { bgcolor: theme.palette.secondary.main },
                    width: { xs: 36, md: 32 },
                    height: { xs: 36, md: 32 },
                  }}
                >
                  <Icon fontSize="inherit" />
                </IconButton>
              ))}
            </Stack>
          </Stack>
        </Container>
      </Box>

      <Container
        maxWidth="xl"
        sx={{
          pt: { xs: 5, md: 8 },
          pb: { xs: 3, md: 4 },
          px: { xs: 2, sm: 3, lg: 4 },
        }}
      >
        <Grid container spacing={{ xs: 4, md: 4 }} sx={{ mb: { xs: 4, md: 8 } }}>
          {/* Brand & Contact Column */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Stack spacing={{ xs: 2, md: 3 }}>
              <Box
                component={Link}
                href="/"
                sx={{ display: "inline-block" }}
              >
                <Box
                  component="img"
                  src={logo.src}
                  alt="Origin Tours"
                  width={420}
                  height={100}
                  loading="lazy"
                  decoding="async"
                  sx={{ width: "auto", height: { xs: 32, md: 40 } }}
                />
              </Box>

              <Typography
                variant="body2"
                sx={{
                  color: "grey.500",
                  lineHeight: 1.6,
                  fontSize: { xs: "0.8rem", md: "0.875rem" },
                  display: { xs: "none", sm: "block" },
                }}
              >
                Origin Tours and Travels is a premier agency offering air
                ticketing, tourism, and hotel reservations, dedicated to
                delivering exceptional travel services with a focus on quality
                and customer satisfaction. Led by a team of experienced
                professionals with over 10 years of expertise.
              </Typography>

              <Stack spacing={1.5} sx={{ mt: { xs: 0, md: 2 } }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: "grey.500",
                    fontSize: { xs: "0.8rem", md: "0.875rem" },
                  }}
                >
                  Third Floor, Serene Heights, Humayun Nagar Rd, Masab Tank,
                  Hyderabad-500028, Telangana, India.
                </Typography>
                <Typography
                  variant="body2"
                  component="a"
                  href="tel:+919177787635"
                  sx={{
                    color: "grey.500",
                    fontSize: { xs: "0.8rem", md: "0.875rem" },
                    display: "block",
                    "&:hover": { color: "secondary.main" },
                    transition: "color 0.3s",
                  }}
                >
                  Phone: +91 91777 87635
                </Typography>
                <Typography
                  variant="body2"
                  component="a"
                  href="mailto:sales@origingroups.com"
                  sx={{
                    color: "grey.500",
                    fontSize: { xs: "0.8rem", md: "0.875rem" },
                    display: "block",
                    "&:hover": { color: "secondary.main" },
                    transition: "color 0.3s",
                  }}
                >
                  Mail: sales@origingroups.com
                </Typography>
              </Stack>
            </Stack>
          </Grid>

          {/* Columns */}
          {renderLinkColumn("Our Services", ourServices)}
          {renderLinkColumn("Visa Packages", visaPackages)}
          {renderLinkColumn("Umrah Packages", umrahPackages)}
          {renderLinkColumn("Holiday Packages", holidayPackages)}
        </Grid>

        {/* Bottom Bar */}
        <Box
          sx={{
            pt: { xs: 2, md: 3 },
            borderTop: "1px solid rgba(255,255,255,0.1)",
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography
              variant="caption"
              sx={{
                color: "grey.600",
                fontSize: { xs: "0.7rem", md: "0.75rem" },
              }}
            >
              Payment Methods
            </Typography>
            <Stack direction="row" spacing={1} sx={{ opacity: 1 }}>
              <Image
                src={mastercardIcon}
                alt="Mastercard"
                width={20}
                height={20}
                loading="lazy"
                style={{ height: 20, width: "auto", filter: "brightness(1.2)" }}
              />
              <Image
                src={gpayIcon}
                alt="Google Pay"
                width={20}
                height={20}
                loading="lazy"
                style={{ height: 20, width: "auto", filter: "brightness(1.2)" }}
              />
            </Stack>
          </Stack>

          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            flexWrap="wrap"
            justifyContent="center"
          >
            {[
              { label: "Privacy Policy", href: "/privacy" },
              { label: "Terms & Conditions", href: "/terms" },
              { label: "Cancellation & Refund", href: "/refund" },
            ].map((l) => (
              <MuiLink
                key={l.href}
                component={Link}
                href={l.href}
                sx={{
                  color: "grey.600",
                  fontSize: { xs: "0.7rem", md: "0.75rem" },
                  textDecoration: "none",
                  "&:hover": { color: "common.white" },
                }}
              >
                {l.label}
              </MuiLink>
            ))}
          </Stack>

          <Typography
            variant="caption"
            sx={{
              color: "grey.600",
              fontSize: { xs: "0.7rem", md: "0.75rem" },
              textAlign: { xs: "center", md: "right" },
            }}
          >
            Copyright &copy; {new Date().getFullYear()} Origin Tours and Travels. Developed by{" "}
            <MuiLink
              href="https://originsoftwares.com/"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: "#2AB0C7",
                textDecoration: "none",
                "&:hover": { color: "common.white" },
              }}
            >
              ORIGIN SOFTWARES
            </MuiLink>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
