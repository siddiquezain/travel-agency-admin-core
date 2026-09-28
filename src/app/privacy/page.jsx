import LegalPage from "../../components/legal/LegalPage";

export const metadata = {
  title: { absolute: "Privacy Policy – Origin Tours & Travels" },
  description:
    "How Origin Tours & Travels, Hyderabad collects, uses, stores and protects your personal data when you use our website and travel services.",
  alternates: { canonical: "/privacy" },
  openGraph: {
    title: "Privacy Policy – Origin Tours & Travels",
    description:
      "How Origin Tours & Travels collects, uses and protects your personal data.",
    url: "/privacy",
    type: "website",
  },
};

const sections = [
  {
    heading: "1. Information we collect",
    body: "When you submit an enquiry, request a booking, or contact us, we may collect your name, email address, phone number, travel preferences, and any documents you share for visa, attestation or pilgrimage processing (such as passport details). We also collect basic technical data (such as IP address and browser type) through standard website analytics.",
  },
  {
    heading: "2. How we use your information",
    body: "We use your information to respond to enquiries, prepare quotations, process bookings and visa/attestation applications, communicate trip updates, and meet legal and regulatory requirements. We do not sell your personal data.",
  },
  {
    heading: "3. Sharing of information",
    body: "We share information only as necessary to deliver your travel services — for example with airlines, hotels, visa authorities, embassies, attestation agencies and payment processors. These parties receive only the data required to complete the specific service.",
  },
  {
    heading: "4. Data retention and security",
    body: "We retain personal data only as long as needed for the purposes above or as required by law, and we apply reasonable safeguards to protect it. Original documents submitted for processing are handled securely and returned to you on completion.",
  },
  {
    heading: "5. Your rights",
    body: "Under India's Digital Personal Data Protection Act, 2023, you may request access to, correction of, or deletion of your personal data, and withdraw consent for its processing. To exercise these rights, contact us using the details below.",
  },
  {
    heading: "6. Cookies and analytics",
    body: "Our website uses cookies and analytics tools to understand usage and improve the experience. You can control cookies through your browser settings.",
  },
  {
    heading: "7. Contact us",
    body: "Origin Tours and Travels, Third Floor, Serene Heights, Humayun Nagar Rd, Masab Tank, Hyderabad-500028, Telangana, India. Phone: +91 91777 87635. Email: sales@origingroups.com.",
  },
];

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="29 May 2026"
      intro="This Privacy Policy explains how Origin Tours and Travels (“we”, “us”) handles your personal information when you use our website and travel services. Please review it carefully."
      sections={sections}
    />
  );
}
