import React from "react";
import FaqAccordion from "../common/FaqAccordion";
import { agency } from "../../config/agency";

// Homepage FAQs. Update these to match your agency's details.
const faqs = [
  {
    q: `Which services does ${agency.name} offer?`,
    a: "We offer air ticketing, holiday packages, visa stamping, hotel reservations, transport bookings and certificate attestation services.",
  },
  {
    q: "How do I get in touch?",
    a: `You can reach us by phone, email or WhatsApp. Visit our Contact page for full details.`,
  },
  {
    q: "How many years of experience does your team have?",
    a: "Our experienced team has been arranging travel for individuals, families and groups for many years.",
  },
  {
    q: "Can I book via WhatsApp?",
    a: `Yes, WhatsApp us on ${agency.supportPhone}. Our team is available to assist with queries and bookings.`,
  },
];

// FaqAccordion emits the FAQPage JSON-LD itself, so we deliberately do NOT
// emit it here — a second identical FAQPage on the same URL is invalid/redundant.
const FAQSection = () => <FaqAccordion faqs={faqs} />;

export default FAQSection;
