import React from "react";
import FaqAccordion from "../common/FaqAccordion";

// Homepage FAQs. Contact details are kept consistent with the rest of
// the site (NAP consistency matters for local SEO).
const faqs = [
  {
    q: "Which services does Origin Tours & Travels offer?",
    a: "We offer air ticketing, Umrah & Hajj packages, domestic & international holiday packages, visa stamping, hotel reservations, transport bookings and certificate attestation services.",
  },
  {
    q: "Is Origin Tours & Travels based in Hyderabad?",
    a: "Yes, our office is located at Third Floor, Serene Heights, Humayun Nagar Road, Masab Tank, Hyderabad-500028, Telangana.",
  },
  {
    q: "How many years of experience does your team have?",
    a: "Over 10 years. We have been arranging travel for individuals, families and groups since 2010.",
  },
  {
    q: "Can I book via WhatsApp?",
    a: "Yes, WhatsApp us on +91 91777 87635. Our team is available to assist with queries and bookings.",
  },
];

// FaqAccordion emits the FAQPage JSON-LD itself, so we deliberately do NOT
// emit it here — a second identical FAQPage on the same URL is invalid/redundant.
const FAQSection = () => <FaqAccordion faqs={faqs} />;

export default FAQSection;
