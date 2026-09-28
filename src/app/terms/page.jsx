import LegalPage from "../../components/legal/LegalPage";

export const metadata = {
  title: { absolute: "Terms & Conditions – Origin Tours & Travels" },
  description:
    "Terms and conditions governing bookings, payments, documentation and travel services provided by Origin Tours & Travels, Hyderabad.",
  alternates: { canonical: "/terms" },
  openGraph: {
    title: "Terms & Conditions – Origin Tours & Travels",
    description:
      "Terms governing bookings, payments and travel services from Origin Tours & Travels.",
    url: "/terms",
    type: "website",
  },
};

const sections = [
  {
    heading: "1. Scope",
    body: "These terms govern your use of our website and the travel services we provide, including holiday packages, Umrah and Hajj packages, air ticketing, hotel and transport bookings, visa processing and certificate attestation.",
  },
  {
    heading: "2. Bookings and quotations",
    body: "All quotations are indicative and subject to availability and confirmation at the time of booking. Prices may change due to fare revisions, currency fluctuations, taxes, or supplier conditions until a booking is confirmed and paid for.",
  },
  {
    heading: "3. Payments",
    body: "Bookings are confirmed on receipt of the applicable deposit or full payment as advised for each service. Accepted payment methods include cash, credit card, Google Pay and UPI. Service charges, where applicable, are communicated before payment.",
  },
  {
    heading: "4. Documents and accuracy",
    body: "You are responsible for providing accurate, valid documents (including passports and supporting papers) and for meeting the entry, visa, health and vaccination requirements of your destination. We assist with applications but cannot guarantee visa or attestation outcomes, which rest with the relevant authorities.",
  },
  {
    heading: "5. Liability of suppliers",
    body: "We act as an intermediary between you and third-party suppliers (airlines, hotels, transport operators, embassies and attestation agencies). We are not liable for delays, cancellations, schedule changes, or service failures caused by these suppliers or by events beyond our reasonable control.",
  },
  {
    heading: "6. Changes and cancellations",
    body: "Changes and cancellations are governed by our Cancellation & Refund Policy and by the terms of the relevant suppliers. Please review that policy before booking.",
  },
  {
    heading: "7. Governing law",
    body: "These terms are governed by the laws of India, and disputes are subject to the jurisdiction of the courts of Hyderabad, Telangana.",
  },
  {
    heading: "8. Contact",
    body: "Origin Tours and Travels, Third Floor, Serene Heights, Humayun Nagar Rd, Masab Tank, Hyderabad-500028, Telangana, India. Phone: +91 91777 87635. Email: sales@origingroups.com.",
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms & Conditions"
      updated="29 May 2026"
      intro="By using our website and services, you agree to the following terms and conditions. Please read them carefully before making a booking."
      sections={sections}
    />
  );
}
