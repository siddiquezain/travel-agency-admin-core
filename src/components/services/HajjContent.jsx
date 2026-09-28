"use client";
import React from "react";
import { Box, Container, Grid, Typography, Stack, Chip } from "@mui/material";
import Mosque from "@mui/icons-material/Mosque";
import Flight from "@mui/icons-material/Flight";
import Hotel from "@mui/icons-material/Hotel";
import Badge from "@mui/icons-material/Badge";
import TravelExplore from "@mui/icons-material/TravelExplore";
import RecordVoiceOver from "@mui/icons-material/RecordVoiceOver";
import MenuBook from "@mui/icons-material/MenuBook";
import HealthAndSafety from "@mui/icons-material/HealthAndSafety";
import Luggage from "@mui/icons-material/Luggage";
import Checkroom from "@mui/icons-material/Checkroom";
import CheckCircle from "@mui/icons-material/CheckCircle";
import ServiceHero from "./ServiceHero";
import ServiceSection from "./ServiceSection";
import FeatureGrid from "./FeatureGrid";
import StepList from "./StepList";
import ServiceCTA from "./ServiceCTA";
import EnquiryForm from "../EnquiryForm";
import FaqAccordion from "../common/FaqAccordion";
import { radius, shadow, sectionColors } from "../../config/designSystem";

const tiers = [
  {
    name: "Economy",
    blurb: "Mina tent accommodation with all essential Hajj arrangements.",
    points: [
      "Mina tent accommodation",
      "Shared group transport",
      "Standard Makkah & Madinah hotels",
      "Full ritual guidance",
    ],
    color: sectionColors.emerald,
    popular: false,
  },
  {
    name: "Standard",
    blurb: "A balanced package with comfortable hotels closer to the Haram.",
    points: [
      "Comfortable hotels near Haram",
      "Air-conditioned group transport",
      "Buffet meals included",
      "Experienced Aalim guide",
    ],
    color: sectionColors.indigo,
    popular: true,
  },
  {
    name: "Premium",
    blurb: "Aziziyah or closer accommodation with premium comfort throughout.",
    points: [
      "Premium accommodation near Haram",
      "Private & priority transport",
      "Upgraded meals & services",
      "Dedicated personal support",
    ],
    color: sectionColors.amber,
    popular: false,
  },
];

const inclusions = [
  {
    icon: Flight,
    title: "Return flights from Hyderabad",
    desc: "Confirmed return air tickets for the full group.",
    color: sectionColors.sky,
  },
  {
    icon: Badge,
    title: "Hajj visa",
    desc: "Complete Hajj visa processing handled on your behalf.",
    color: sectionColors.blue,
  },
  {
    icon: Hotel,
    title: "Makkah & Madinah accommodation",
    desc: "Hotels in both holy cities for the duration of your stay.",
    color: sectionColors.amber,
  },
  {
    icon: Mosque,
    title: "Mina, Arafat & Muzdalifah",
    desc: "All camp and movement arrangements for the days of Hajj.",
    color: sectionColors.indigo,
  },
  {
    icon: TravelExplore,
    title: "Ziyarat tours",
    desc: "Guided visits to the historic sites of Makkah and Madinah.",
    color: sectionColors.teal,
  },
  {
    icon: RecordVoiceOver,
    title: "Experienced Aalim guide",
    desc: "A knowledgeable Aalim accompanies every group throughout.",
    color: sectionColors.emerald,
  },
];

const registerSteps = [
  { title: "Contact us", desc: "Reach out to our Hajj team in Hyderabad to begin." },
  { title: "Submit documents", desc: "Provide your passport and required paperwork." },
  { title: "Pay advance", desc: "Secure your seat with the booking advance." },
  { title: "Visa processing", desc: "We handle your complete Hajj visa application." },
  { title: "Final departure", desc: "Receive your itinerary and depart with the group." },
];

const prepGuide = [
  {
    icon: MenuBook,
    title: "Key Hajj rituals",
    desc: "An overview of Tawaf, Sa'i, the day of Arafat and the rites of Mina.",
    color: sectionColors.indigo,
  },
  {
    icon: HealthAndSafety,
    title: "Health tips for elderly pilgrims",
    desc: "Practical guidance to stay well and energised during the journey.",
    color: sectionColors.rose,
  },
  {
    icon: Luggage,
    title: "Packing list",
    desc: "Everything to carry for a comfortable and well-prepared Hajj.",
    color: sectionColors.teal,
  },
  {
    icon: Checkroom,
    title: "Ihram guidance",
    desc: "How to wear Ihram correctly and observe its rules.",
    color: sectionColors.amber,
  },
];

const faqs = [
  {
    q: "How much does Hajj 2026 cost from Hyderabad?",
    a: "Government Hajj package prices vary annually. Private packages through Origin Tours typically start from Rs. 4.5–5 lakhs per person. Contact us for confirmed 2026 pricing.",
  },
  {
    q: "What documents are required for Hajj from India?",
    a: "Valid passport (6 months validity), meningitis vaccination certificate, passport-size photos, completed application form and advance payment.",
  },
  {
    q: "Is a mahram required for women performing Hajj?",
    a: "Women under 45 typically require a mahram. Women over 45 may travel in an organised group without one, subject to current Saudi regulations.",
  },
  {
    q: "When should I register for Hajj 2026?",
    a: "Register as early as possible – slots fill up very quickly. Contact us by early 2026 to secure your place in the group.",
  },
  {
    q: "What is the difference between government and private Hajj packages?",
    a: "Government packages are subsidised but have limited slots and fixed arrangements. Private packages offer more flexibility, better hotel proximity and personalised support.",
  },
  {
    q: "Do you provide a guide during Hajj rituals?",
    a: "Yes. An experienced Aalim accompanies every group to guide pilgrims through each ritual correctly and answer religious questions throughout the journey.",
  },
];

const HajjContent = () => {
  const currentUrl =
    typeof window !== "undefined" ? window.location.href : "";

  return (
    <Box sx={{ bgcolor: "background.default" }}>
      <ServiceHero
        eyebrow="Hajj Packages 2026"
        title="Hajj packages 2026 from Hyderabad – guided & fully supported"
        subtitle="The journey of a lifetime. Origin Tours & Travels is a trusted Hajj tour operator in Hyderabad, guiding pilgrims with full visa, flight and accommodation support. Slots are limited — register early."
        icon={Mosque}
        primaryCta={{ label: "Register for Hajj 2026", href: "#enquiry-form" }}
      />

      <ServiceSection
        eyebrow="Choose your package"
        title="Economy, standard & premium Hajj options"
        intro="Three package tiers so every pilgrim can perform Hajj with comfort and peace of mind. Contact us for confirmed 2026 travel dates and per-person pricing."
      >
        <Grid container spacing={{ xs: 3, md: 4 }} justifyContent="center">
          {tiers.map((tier) => (
            <Grid size={{ xs: 12, md: 4 }} key={tier.name}>
              <Box
                sx={{
                  height: "100%",
                  borderRadius: radius.card,
                  bgcolor: "background.paper",
                  border: "2px solid",
                  borderColor: tier.popular
                    ? tier.color.text
                    : "divider",
                  p: { xs: 3, md: 4 },
                  boxShadow: tier.popular ? shadow.cardHover : shadow.card,
                  position: "relative",
                }}
              >
                {tier.popular && (
                  <Chip
                    label="Most Popular"
                    size="small"
                    sx={{
                      position: "absolute",
                      top: -14,
                      left: "50%",
                      transform: "translateX(-50%)",
                      fontWeight: 700,
                      background: tier.color.gradient,
                      color: "white",
                    }}
                  />
                )}
                <Typography
                  variant="h4"
                  fontWeight={800}
                  sx={{ color: tier.color.text, mb: 1 }}
                >
                  {tier.name}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2.5, lineHeight: 1.7 }}
                >
                  {tier.blurb}
                </Typography>
                <Stack spacing={1.25}>
                  {tier.points.map((point) => (
                    <Stack
                      key={point}
                      direction="row"
                      spacing={1}
                      alignItems="flex-start"
                    >
                      <CheckCircle
                        sx={{ fontSize: 18, color: tier.color.text, mt: 0.2 }}
                      />
                      <Typography variant="body2">{point}</Typography>
                    </Stack>
                  ))}
                </Stack>
              </Box>
            </Grid>
          ))}
        </Grid>
      </ServiceSection>

      <ServiceSection
        eyebrow="What's included"
        title="Hajj package inclusions – visa, flights & accommodation"
        intro="Every Origin Tours Hajj package is fully supported end to end, so you can focus entirely on your worship."
        bgcolor="background.paper"
      >
        <FeatureGrid items={inclusions} size={{ xs: 12, sm: 6, md: 4 }} />
      </ServiceSection>

      <ServiceSection
        eyebrow="Get started"
        title="How to register for Hajj 2026"
        intro="Registering for Hajj is simple and fully guided — we handle the paperwork and process for you."
      >
        <StepList steps={registerSteps} />
      </ServiceSection>

      <ServiceSection
        eyebrow="Be prepared"
        title="Hajj preparation guide"
        intro="Helpful guidance so first-time and returning pilgrims feel confident and ready for the journey."
        bgcolor="background.paper"
      >
        <FeatureGrid items={prepGuide} size={{ xs: 12, sm: 6, md: 3 }} />
      </ServiceSection>

      {/* Enquiry */}
      <Box component="section" sx={{ py: { xs: 8, md: 12 } }}>
        <Container maxWidth="sm">
          <EnquiryForm packageTitle="Hajj Package 2026" currentUrl={currentUrl} redirectTo="/thank-you/hajj" />
        </Container>
      </Box>

      <ServiceCTA
        title="Secure your Hajj 2026 place today"
        text="Hajj slots fill quickly. Speak to our experienced Hajj team in Hyderabad to register your group."
      />

      <FaqAccordion
        faqs={faqs}
        eyebrow="Hajj FAQs"
        title="Hajj questions, answered"
      />
    </Box>
  );
};

export default HajjContent;
