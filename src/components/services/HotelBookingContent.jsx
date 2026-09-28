"use client";
import React from "react";
import { Box, Container, Grid, Typography, Chip } from "@mui/material";
import Hotel from "@mui/icons-material/Hotel";
import BusinessCenter from "@mui/icons-material/BusinessCenter";
import Savings from "@mui/icons-material/Savings";
import BeachAccess from "@mui/icons-material/BeachAccess";
import Mosque from "@mui/icons-material/Mosque";
import Groups from "@mui/icons-material/Groups";
import ServiceHero from "./ServiceHero";
import ServiceSection from "./ServiceSection";
import FeatureGrid from "./FeatureGrid";
import ServiceCTA from "./ServiceCTA";
import EnquiryForm from "../EnquiryForm";
import FaqAccordion from "../common/FaqAccordion";
import { radius, shadow, sectionColors } from "../../config/designSystem";

const accommodationTypes = [
  {
    icon: Hotel,
    title: "Luxury 5-star hotels",
    desc: "Premium international and domestic hotels for travellers who want the very best.",
    color: sectionColors.amber,
  },
  {
    icon: BusinessCenter,
    title: "Business hotels",
    desc: "Centrally located, well-connected hotels ideal for corporate and work travel.",
    color: sectionColors.teal,
  },
  {
    icon: Savings,
    title: "Budget stays",
    desc: "Clean, comfortable and affordable hotels that keep your trip within budget.",
    color: sectionColors.emerald,
  },
  {
    icon: BeachAccess,
    title: "Resort packages",
    desc: "Beach and hill resorts with bundled stays for holidays and honeymoons.",
    color: sectionColors.sky,
  },
  {
    icon: Mosque,
    title: "Pilgrim hotels near Haram",
    desc: "Makkah and Madinah hotels within walking distance of the Haram for Umrah and Hajj.",
    color: sectionColors.indigo,
  },
];

const destinations = [
  "Makkah",
  "Madinah",
  "Dubai",
  "Goa",
  "Kerala",
  "Rajasthan",
  "Singapore",
  "Bangkok",
];

const faqs = [
  {
    q: "Can you book hotels near Masjid Al Haram in Makkah?",
    a: "Yes, we specialise in pilgrim accommodation with walking distance (200–500m) options for Umrah and Hajj groups.",
  },
  {
    q: "Do you offer package deals combining flights and hotels?",
    a: "Yes, bundled flight + hotel packages are available at better rates than booking each separately.",
  },
  {
    q: "What is your cancellation policy for hotel bookings?",
    a: "Policies vary by hotel. We always share full cancellation terms before confirming your booking so there are no surprises.",
  },
  {
    q: "Can you arrange hotels within India for tour packages?",
    a: "Yes, we book domestic accommodation for Kerala, Goa, Rajasthan, Shimla, Andaman and all major Indian tourist destinations.",
  },
];

const HotelBookingContent = () => {
  const currentUrl =
    typeof window !== "undefined" ? window.location.href : "";

  return (
    <Box sx={{ bgcolor: "background.default" }}>
      <ServiceHero
        eyebrow="Hotel Booking"
        title="Hotel reservations in India & abroad – best rates guaranteed"
        subtitle="Origin Tours & Travels books luxury, economy and budget hotels across India and worldwide — with special expertise in Makkah and Madinah accommodation for pilgrims."
        icon={Hotel}
        primaryCta={{ label: "Check Hotel Availability", href: "#enquiry-form" }}
      />

      <ServiceSection
        eyebrow="Accommodation"
        title="Luxury, economy & budget hotels worldwide"
        intro="As a trusted hotel booking agent in Hyderabad, we secure best-rate accommodation for every budget and every kind of trip — leisure, business and pilgrimage."
      >
        <FeatureGrid
          items={accommodationTypes}
          size={{ xs: 12, sm: 6, md: 4 }}
        />
      </ServiceSection>

      <ServiceSection
        eyebrow="For pilgrims"
        title="Makkah & Madinah hotels for pilgrims"
        intro="We book pilgrim accommodation close to Masjid Al Haram and Masjid an-Nabawi, with options to suit economy, standard and premium Umrah and Hajj groups."
        bgcolor="background.paper"
      >
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1.5,
            justifyContent: "center",
          }}
        >
          {[
            "200–500m from Haram",
            "Haram-view rooms",
            "Walking distance to Haram",
            "Group floors available",
          ].map((tag) => (
            <Chip
              key={tag}
              label={tag}
              sx={{
                fontWeight: 600,
                bgcolor: sectionColors.indigo.soft,
                color: sectionColors.indigo.text,
                borderRadius: radius.chip,
                px: 1,
              }}
            />
          ))}
        </Box>
      </ServiceSection>

      <ServiceSection
        eyebrow="Destinations"
        title="Popular hotel destinations we book"
        intro="From the holy cities to top holiday spots in India and abroad, here is where our customers book most often."
      >
        <Grid container spacing={{ xs: 1.5, md: 2 }}>
          {destinations.map((place) => (
            <Grid size={{ xs: 6, sm: 4, md: 3 }} key={place}>
              <Box
                sx={{
                  p: 2.5,
                  textAlign: "center",
                  borderRadius: radius.icon,
                  bgcolor: "background.paper",
                  border: "1px solid",
                  borderColor: "divider",
                  boxShadow: shadow.soft,
                  fontWeight: 700,
                }}
              >
                <Typography variant="body1" fontWeight={700}>
                  {place}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </ServiceSection>

      <ServiceSection
        eyebrow="For groups"
        title="Group & corporate accommodation packages"
        intro="Special negotiated rates for groups of 10 or more. Corporate travellers receive proper invoices and travel cost reports, and we can arrange hotels with conference facilities on request."
        bgcolor="background.paper"
      >
        <Grid container spacing={{ xs: 2, md: 3 }} justifyContent="center">
          {[
            { icon: Groups, label: "Group rates for 10+ travellers" },
            { icon: BusinessCenter, label: "Corporate invoicing & reports" },
          ].map((item) => (
            <Grid size={{ xs: 12, sm: 6, md: 5 }} key={item.label}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  p: 3,
                  borderRadius: radius.card,
                  bgcolor: "background.default",
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    flexShrink: 0,
                    borderRadius: radius.icon,
                    background: sectionColors.teal.gradient,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <item.icon sx={{ color: "white" }} />
                </Box>
                <Typography variant="body1" fontWeight={600}>
                  {item.label}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </ServiceSection>

      {/* Enquiry */}
      <Box component="section" sx={{ py: { xs: 8, md: 12 } }}>
        <Container maxWidth="sm">
          <EnquiryForm packageTitle="Hotel Booking" currentUrl={currentUrl} redirectTo="/thank-you/hotels" />
        </Container>
      </Box>

      <ServiceCTA
        title="Need the best hotel rate?"
        text="Share your destination and dates — we'll find you the right hotel at the right price."
      />

      <FaqAccordion
        faqs={faqs}
        eyebrow="Hotel Booking FAQs"
        title="Hotel reservation questions, answered"
      />
    </Box>
  );
};

export default HotelBookingContent;
