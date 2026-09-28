"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Box,
  Container,
  Typography,
  Grid,
  Stack,
  Dialog,
  DialogContent,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Mosque from "@mui/icons-material/Mosque";
import Groups from "@mui/icons-material/Groups";
import DirectionsBus from "@mui/icons-material/DirectionsBus";
import EnquiryForm from "../../components/EnquiryForm";
import {
  radius,
  sectionColors,
  serviceIcons,
} from "../../config/designSystem";

const serviceFlowItems = [
  {
    ...serviceIcons[3],
    title: "Air Ticketing",
    type: "link",
    link: "/flights",
    description:
      "Domestic and international flight bookings at the best fares with flexible options.",
  },
  {
    ...serviceIcons[0],
    description:
      "Curated holiday packages to top destinations worldwide with exclusive deals and seamless planning.",
  },
  {
    title: "Umrah Booking",
    type: "link",
    link: "/umrah",
    color: sectionColors.emerald,
    iconComponent: Mosque,
    description:
      "Premium Umrah packages with luxury accommodation and hassle-free visa processing.",
  },
  {
    title: "Hajj Booking",
    type: "link",
    link: "/hajj",
    color: sectionColors.rose,
    iconComponent: Groups,
    description:
      "Complete Hajj packages with guided support, group travel, and comfortable stay arrangements.",
  },
  {
    ...serviceIcons[1],
    description:
      "Expert visa assistance for 50+ countries with fast processing, high approval rates, and guidance.",
  },
  {
    ...serviceIcons[4],
    title: "Hotel Booking",
    type: "link",
    link: "/hotels",
    description:
      "Find and book premium hotels worldwide — from budget-friendly stays to luxury resorts.",
  },
  {
    title: "Transport Booking",
    type: "link",
    link: "/transport",
    color: sectionColors.teal,
    iconComponent: DirectionsBus,
    description:
      "Car, bus and train bookings in Hyderabad — quick, reliable and affordable.",
  },
  {
    ...serviceIcons[2],
    description:
      "Reliable certificate & document attestation services — MEA, HRD, embassy apostille and more.",
  },
];

const ServicesFlow = () => {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [selectedService, setSelectedService] = React.useState("");

  const handleOpenModal = (service) => {
    setSelectedService(service);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedService("");
  };

  return (
    <>
      <Box
        sx={{
          py: { xs: 8, md: 12 },
          bgcolor: "background.default",
        }}
      >
        <Container maxWidth="xl">
          {/* Section Header */}
          <Box textAlign="center" mb={{ xs: 5, md: 7 }}>
            <Typography
              variant="overline"
              sx={{
                fontWeight: 800,
                letterSpacing: 2,
                color: sectionColors.blue.text,
              }}
            >
              CENTER FLOW
            </Typography>
            <Typography
              variant="h3"
              color="primary"
              fontWeight={800}
              gutterBottom
              sx={{ mt: 0.8 }}
            >
              Our Services
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              maxWidth="sm"
              mx="auto"
            >
              Comprehensive travel solutions for all your needs
            </Typography>
          </Box>

          {/* Services Grid */}
          <Box
            sx={{
              borderRadius: 6,
              bgcolor: "background.paper",
              boxShadow: "0 8px 40px rgba(0,0,0,0.06)",
              border: "1px solid",
              borderColor: "divider",
              p: { xs: 3, sm: 4, md: 5, lg: 6 },
            }}
          >
            <Grid
              container
              spacing={{ xs: 3, sm: 4, md: 5 }}
              justifyContent="center"
            >
              {serviceFlowItems.map((s, i) => (
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={i}>
                  <Stack
                    component={motion.div}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -4 }}
                    role={s.type === "modal" ? "button" : undefined}
                    tabIndex={s.type === "modal" ? 0 : undefined}
                    aria-label={s.type === "modal" ? `${s.title} — open enquiry` : undefined}
                    onClick={
                      s.type === "modal"
                        ? () => handleOpenModal(s.action)
                        : undefined
                    }
                    onKeyDown={
                      s.type === "modal"
                        ? (e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              handleOpenModal(s.action);
                            }
                          }
                        : undefined
                    }
                    alignItems="center"
                    spacing={1.5}
                    sx={{
                      textDecoration: "none",
                      color: "inherit",
                      cursor: "pointer",
                      position: "relative",
                      textAlign: "center",
                      p: { xs: 2, md: 2.5 },
                      borderRadius: 4,
                      // Same hover treatment as the header dropdown: the whole
                      // tile fills with the primary colour and lifts with a
                      // raised shadow (the -4px lift comes from whileHover).
                      transition: "background-color 0.25s ease, box-shadow 0.25s ease",
                      "&:hover": {
                        bgcolor: "primary.main",
                        boxShadow: "0 18px 40px rgba(0,136,204,0.35)",
                        "& .service-title": { color: "common.white" },
                        "& .service-desc": { color: "rgba(255,255,255,0.85)" },
                        "& .icon-box": {
                          bgcolor: "rgba(255,255,255,0.15)",
                          borderColor: "rgba(255,255,255,0.35)",
                        },
                        "& .icon-box svg": { color: "common.white" },
                        "& .icon-box img": { filter: "brightness(0) invert(1)" },
                      },
                      "&:focus-visible": {
                        outline: "2px solid",
                        outlineColor: "primary.main",
                        outlineOffset: 4,
                        borderRadius: 2,
                      },
                    }}
                  >
                    {s.type === "link" ? (
                      <Link
                        href={s.link}
                        aria-label={s.title}
                        style={{ position: "absolute", inset: 0, zIndex: 1 }}
                      />
                    ) : null}

                    {/* Icon */}
                    <Box
                      className="icon-box"
                      sx={{
                        width: { xs: 64, sm: 72, md: 80 },
                        height: { xs: 64, sm: 72, md: 80 },
                        borderRadius: radius.icon,
                        bgcolor: s.color.soft,
                        border: "2px solid",
                        borderColor: `${s.color.text}20`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.3s ease-out",
                        p: 1.5,
                        mx: "auto",
                      }}
                    >
                      {s.iconComponent ? (
                        <s.iconComponent
                          sx={{
                            fontSize: { xs: 28, sm: 32, md: 36 },
                            color: s.color.text,
                            transition: "all 0.3s ease-out",
                          }}
                        />
                      ) : (
                        <Box
                          component="img"
                          src={s.icon}
                          sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "contain",
                            filter: s.filter,
                          }}
                          alt={s.title}
                        />
                      )}
                    </Box>

                    {/* Title */}
                    <Typography
                      className="service-title"
                      sx={{
                        fontWeight: 800,
                        fontSize: {
                          xs: "0.85rem",
                          sm: "0.95rem",
                          md: "1.05rem",
                        },
                        color: "text.primary",
                        lineHeight: 1.3,
                        transition: "color 0.25s ease",
                      }}
                    >
                      {s.title}
                    </Typography>

                    {/* Description */}
                    <Typography
                      className="service-desc"
                      sx={{
                        fontSize: {
                          xs: "0.75rem",
                          sm: "0.8rem",
                          md: "0.85rem",
                        },
                        color: "text.secondary",
                        lineHeight: 1.5,
                        px: { xs: 0, sm: 0.5, md: 1 },
                        transition: "color 0.25s ease",
                      }}
                    >
                      {s.description}
                    </Typography>
                  </Stack>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Container>
      </Box>

      {/* Quick Enquiry Modal */}
      <Dialog
        open={modalOpen}
        onClose={handleCloseModal}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 4, overflow: "hidden" },
        }}
      >
        <DialogContent sx={{ p: 0 }}>
          <Box sx={{ position: "relative" }}>
            <IconButton
              onClick={handleCloseModal}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
                color: "white",
                zIndex: 10,
                bgcolor: "rgba(0,0,0,0.3)",
                "&:hover": { bgcolor: "rgba(0,0,0,0.5)" },
              }}
            >
              <CloseIcon />
            </IconButton>
            <EnquiryForm
              packageTitle={selectedService}
              currentUrl={typeof window !== "undefined" ? window.location.href : ""}
            />
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ServicesFlow;
