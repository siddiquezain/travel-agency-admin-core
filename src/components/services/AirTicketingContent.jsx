"use client";
import React from "react";
import { Box, Container, Grid, Typography, Chip } from "@mui/material";
import FlightTakeoff from "@mui/icons-material/FlightTakeoff";
import FlightLand from "@mui/icons-material/FlightLand";
import ConnectingAirports from "@mui/icons-material/ConnectingAirports";
import Groups from "@mui/icons-material/Groups";
import BusinessCenter from "@mui/icons-material/BusinessCenter";
import AccessTime from "@mui/icons-material/AccessTime";
import Flight from "@mui/icons-material/Flight";
import ServiceHero from "./ServiceHero";
import ServiceSection from "./ServiceSection";
import FeatureGrid from "./FeatureGrid";
import StepList from "./StepList";
import ServiceCTA from "./ServiceCTA";
import EnquiryForm from "../EnquiryForm";
import FaqAccordion from "../common/FaqAccordion";
import { radius, shadow, sectionColors } from "../../config/designSystem";

const offerings = [
  {
    icon: FlightTakeoff,
    title: "One-way flights",
    desc: "Single-journey domestic and international tickets at the lowest available fares.",
    color: sectionColors.sky,
  },
  {
    icon: FlightLand,
    title: "Return flights",
    desc: "Round-trip bookings with the best fare combinations for your travel dates.",
    color: sectionColors.blue,
  },
  {
    icon: ConnectingAirports,
    title: "Multi-city flights",
    desc: "Complex multi-stop itineraries planned and ticketed in a single booking.",
    color: sectionColors.indigo,
  },
  {
    icon: Groups,
    title: "Group flight bookings",
    desc: "Special group fares for families, pilgrims and large travel parties from Hyderabad.",
    color: sectionColors.emerald,
  },
  {
    icon: BusinessCenter,
    title: "Corporate travel",
    desc: "Managed corporate bookings with invoices, flexibility and priority support.",
    color: sectionColors.teal,
  },
  {
    icon: AccessTime,
    title: "Last-minute tickets",
    desc: "Urgent and same-day air tickets arranged quickly when plans change.",
    color: sectionColors.orange,
  },
];

const popularRoutes = [
  "Hyderabad – Dubai",
  "Hyderabad – Jeddah",
  "Hyderabad – Delhi",
  "Hyderabad – Mumbai",
  "Hyderabad – London",
  "Hyderabad – Singapore",
  "Hyderabad – Riyadh",
  "Hyderabad – Bengaluru",
  "Hyderabad – Sharjah",
  "Hyderabad – Kuala Lumpur",
];

const bookingSteps = [
  {
    title: "Contact us",
    desc: "Call or WhatsApp our Hyderabad team with your destination and dates.",
  },
  {
    title: "Share travel details",
    desc: "Tell us the passengers, preferred airline and budget so we can compare fares.",
  },
  {
    title: "Receive best fare & confirm",
    desc: "We send you the cheapest available fare across airlines — approve and fly.",
  },
];

const faqs = [
  {
    q: "How do I book a flight through Origin Tours & Travels?",
    a: "Call or WhatsApp us with your travel dates and destination. We compare fares across airlines and confirm your booking quickly.",
  },
  {
    q: "Do you offer cheaper fares than online booking sites?",
    a: "Yes. We have access to group fares and agent rates that are often not available on consumer booking websites.",
  },
  {
    q: "Can you book international flights from Hyderabad?",
    a: "Absolutely. We book to all major international destinations including Middle East, Europe, USA, Southeast Asia and more.",
  },
  {
    q: "What documents are needed for international travel?",
    a: "A valid passport, visa (if required for your destination), and any destination-specific health or entry requirements.",
  },
  {
    q: "Do you handle flight cancellations and refunds?",
    a: "Yes, we assist with cancellations and follow up on refunds as per the airline's policy. Contact us as early as possible if plans change.",
  },
];

const AirTicketingContent = () => {
  const currentUrl =
    typeof window !== "undefined" ? window.location.href : "";

  return (
    <Box sx={{ bgcolor: "background.default" }}>
      <ServiceHero
        eyebrow="Air Ticketing"
        title="Cheap flight tickets from Hyderabad – domestic & international"
        subtitle="Looking for cheap flights in Hyderabad? Origin Tours & Travels books domestic and international air tickets on all major airlines at the best available fares."
        icon={Flight}
        primaryCta={{ label: "Get the Best Fare", href: "#enquiry-form" }}
      />

      <ServiceSection
        eyebrow="What we offer"
        title="Book one-way, return or multi-city flights"
        intro="From a single domestic hop to complex multi-city international journeys, our air ticketing agents in Hyderabad find you the cheapest fares across every major airline — including group, corporate and last-minute bookings."
      >
        <FeatureGrid items={offerings} size={{ xs: 12, sm: 6, md: 4 }} />
      </ServiceSection>

      <ServiceSection
        eyebrow="Why book with us"
        title="Best deals on all major airlines"
        intro="As an experienced air ticketing agent in Hyderabad, we hold agent and consolidator rates across full-service and low-cost carriers — so you consistently pay less than public website prices."
        bgcolor="background.paper"
      >
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, justifyContent: "center" }}>
          {[
            "IndiGo",
            "Air India",
            "Emirates",
            "Etihad",
            "Saudia",
            "Qatar Airways",
            "SriLankan",
            "Malaysia Airlines",
            "Gulf Air",
          ].map((airline) => (
            <Chip
              key={airline}
              label={airline}
              sx={{
                fontWeight: 600,
                bgcolor: sectionColors.sky.soft,
                color: sectionColors.sky.text,
                borderRadius: radius.chip,
                px: 1,
              }}
            />
          ))}
        </Box>
      </ServiceSection>

      <ServiceSection
        eyebrow="Routes"
        title="Popular flight routes from Hyderabad"
        intro="These are some of the most-booked domestic and international routes we ticket from Rajiv Gandhi International Airport every week."
      >
        <Grid container spacing={{ xs: 1.5, md: 2 }}>
          {popularRoutes.map((route) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={route}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  p: 2,
                  borderRadius: radius.icon,
                  bgcolor: "background.paper",
                  border: "1px solid",
                  borderColor: "divider",
                  boxShadow: shadow.soft,
                }}
              >
                <Flight
                  sx={{
                    fontSize: 20,
                    color: sectionColors.sky.text,
                    transform: "rotate(45deg)",
                  }}
                />
                <Typography variant="body1" fontWeight={600}>
                  {route}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </ServiceSection>

      <ServiceSection
        eyebrow="Simple process"
        title="How to book your flight"
        intro="Booking a cheap air ticket from Hyderabad takes just three quick steps."
        bgcolor="background.paper"
      >
        <StepList steps={bookingSteps} />
      </ServiceSection>

      {/* Enquiry */}
      <Box component="section" sx={{ py: { xs: 8, md: 12 } }}>
        <Container maxWidth="sm">
          <EnquiryForm packageTitle="Air Ticketing" currentUrl={currentUrl} redirectTo="/thank-you/flights" />
        </Container>
      </Box>

      <ServiceCTA
        title="Looking for cheap flights? Call us now"
        text="Tell us where you want to fly and we'll send you the lowest fare across every major airline."
      />

      <FaqAccordion
        faqs={faqs}
        eyebrow="Air Ticketing FAQs"
        title="Flight booking questions, answered"
      />
    </Box>
  );
};

export default AirTicketingContent;
