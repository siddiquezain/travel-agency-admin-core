"use client";
import React from "react";
import { Box, Container, Chip } from "@mui/material";
import DirectionsCar from "@mui/icons-material/DirectionsCar";
import AirportShuttle from "@mui/icons-material/AirportShuttle";
import LocalTaxi from "@mui/icons-material/LocalTaxi";
import FlightLand from "@mui/icons-material/FlightLand";
import Map from "@mui/icons-material/Map";
import AccessTime from "@mui/icons-material/AccessTime";
import DirectionsBus from "@mui/icons-material/DirectionsBus";
import School from "@mui/icons-material/School";
import BusinessCenter from "@mui/icons-material/BusinessCenter";
import Mosque from "@mui/icons-material/Mosque";
import ServiceHero from "./ServiceHero";
import ServiceSection from "./ServiceSection";
import FeatureGrid from "./FeatureGrid";
import ServiceCTA from "./ServiceCTA";
import EnquiryForm from "../EnquiryForm";
import FaqAccordion from "../common/FaqAccordion";
import { radius, sectionColors } from "../../config/designSystem";

const carOptions = [
  {
    icon: DirectionsCar,
    title: "Sedans",
    desc: "Comfortable AC sedans for city travel, meetings and small families.",
    color: sectionColors.blue,
  },
  {
    icon: LocalTaxi,
    title: "SUVs",
    desc: "Spacious SUVs for families and groups travelling with luggage.",
    color: sectionColors.indigo,
  },
  {
    icon: AirportShuttle,
    title: "Tempo travellers",
    desc: "12–17 seat tempo travellers for larger groups and tours.",
    color: sectionColors.teal,
  },
  {
    icon: FlightLand,
    title: "Airport pickup & drop",
    desc: "Reliable cabs to and from Rajiv Gandhi International Airport, round the clock.",
    color: sectionColors.sky,
  },
  {
    icon: Map,
    title: "Outstation trips",
    desc: "Day trips and multi-day outstation journeys with experienced drivers.",
    color: sectionColors.emerald,
  },
  {
    icon: AccessTime,
    title: "Half & full-day hire",
    desc: "Flexible hourly, half-day and full-day car hire to suit your plans.",
    color: sectionColors.orange,
  },
];

const busOptions = [
  {
    icon: DirectionsBus,
    title: "AC & non-AC buses",
    desc: "A full range of bus sizes with AC and non-AC options for every budget.",
    color: sectionColors.blue,
  },
  {
    icon: School,
    title: "School & college excursions",
    desc: "Safe group transport for educational trips with verified drivers.",
    color: sectionColors.amber,
  },
  {
    icon: BusinessCenter,
    title: "Corporate trips",
    desc: "Comfortable buses for corporate offsites, events and staff travel.",
    color: sectionColors.teal,
  },
  {
    icon: Mosque,
    title: "Pilgrimage group transport",
    desc: "Dedicated buses for pilgrimage and community group journeys.",
    color: sectionColors.emerald,
  },
];

const faqs = [
  {
    q: "Do you provide airport pickup and drop services in Hyderabad?",
    a: "Yes, we arrange cabs for Rajiv Gandhi International Airport pickups and drops at all hours.",
  },
  {
    q: "Can you arrange transport for a school excursion group?",
    a: "Yes, we have AC and non-AC buses for school and college groups with experienced, verified drivers.",
  },
  {
    q: "How far in advance should I book a cab or bus?",
    a: "At least 24–48 hours in advance. For large groups, booking 1 week ahead is recommended.",
  },
];

const TransportContent = () => {
  const currentUrl =
    typeof window !== "undefined" ? window.location.href : "";

  return (
    <Box sx={{ bgcolor: "background.default" }}>
      <ServiceHero
        eyebrow="Transport Booking"
        title="Car, bus & train bookings in Hyderabad – quick & affordable"
        subtitle="Origin Tours & Travels arranges cabs, buses and train tickets in Hyderabad — reliable, affordable ground transport for individuals, families and large groups."
        icon={DirectionsBus}
        primaryCta={{ label: "Book Transport", href: "#enquiry-form" }}
      />

      <ServiceSection
        eyebrow="On the road"
        title="Car hire & cab bookings in Hyderabad"
        intro="Choose from sedans, SUVs and tempo travellers with experienced drivers and well-maintained AC vehicles — for airport transfers, outstation trips and city travel."
      >
        <FeatureGrid items={carOptions} size={{ xs: 12, sm: 6, md: 4 }} />
      </ServiceSection>

      <ServiceSection
        eyebrow="For groups"
        title="Bus booking for groups & individuals"
        intro="Group bus hire for school excursions, corporate trips and pilgrimage groups, with AC and non-AC options and competitive per-head pricing for large parties."
        bgcolor="background.paper"
      >
        <FeatureGrid items={busOptions} size={{ xs: 12, sm: 6, md: 3 }} />
      </ServiceSection>

      <ServiceSection
        eyebrow="On the rails"
        title="Rail ticket booking assistance"
        intro="We assist with train ticket booking for domestic travel — including Tatkal bookings, group quota requests and every class from sleeper to first-class AC."
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
            "Tatkal bookings",
            "Group quota requests",
            "Sleeper to first-class AC",
            "Domestic routes across India",
          ].map((tag) => (
            <Chip
              key={tag}
              label={tag}
              sx={{
                fontWeight: 600,
                bgcolor: sectionColors.emerald.soft,
                color: sectionColors.emerald.text,
                borderRadius: radius.chip,
                px: 1,
              }}
            />
          ))}
        </Box>
      </ServiceSection>

      {/* Enquiry */}
      <Box component="section" sx={{ py: { xs: 8, md: 12 }, bgcolor: "background.paper" }}>
        <Container maxWidth="sm">
          <EnquiryForm
            packageTitle="Transport Booking"
            currentUrl={currentUrl}
            redirectTo="/thank-you/transport"
          />
        </Container>
      </Box>

      <ServiceCTA
        title="Need a cab, bus or train ticket?"
        text="Tell us your route, dates and group size — we'll arrange reliable transport at an affordable price."
      />

      <FaqAccordion
        faqs={faqs}
        eyebrow="Transport FAQs"
        title="Transport booking questions, answered"
      />
    </Box>
  );
};

export default TransportContent;
