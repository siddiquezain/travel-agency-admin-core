import LegalPage from "../../components/legal/LegalPage";

export const metadata = {
  title: { absolute: "Cancellation & Refund Policy – Origin Tours & Travels" },
  description:
    "Cancellation and refund terms for holiday packages, Umrah/Hajj, air tickets, visa and attestation services from Origin Tours & Travels, Hyderabad.",
  alternates: { canonical: "/refund" },
  openGraph: {
    title: "Cancellation & Refund Policy – Origin Tours & Travels",
    description:
      "Cancellation and refund terms for bookings made with Origin Tours & Travels.",
    url: "/refund",
    type: "website",
  },
};

const sections = [
  {
    heading: "1. How to request a cancellation",
    body: "To cancel a confirmed booking, contact us in writing by email or phone with your booking reference. The effective cancellation date is the date we receive your written request during business hours.",
  },
  {
    heading: "2. Cancellation charges",
    body: "Cancellation charges depend on the service and the supplier's terms. Airlines, hotels, embassies and attestation authorities apply their own fees, which are passed on to you. Where applicable, our service charge for work already performed is non-refundable.",
  },
  {
    heading: "3. Visa, attestation and pilgrimage services",
    body: "Government, embassy and attestation fees are non-refundable once an application has been submitted, regardless of the outcome, as these charges are levied by the authorities. Umrah and Hajj packages follow the cancellation terms of the airline, hotel and Saudi authorities applicable at the time of cancellation.",
  },
  {
    heading: "4. Air tickets",
    body: "Air ticket refunds are governed entirely by the fare rules of the issuing airline. Some fares are non-refundable. Refundable tickets are subject to airline cancellation charges plus our processing fee.",
  },
  {
    heading: "5. Refund processing",
    body: "Approved refunds are processed to the original payment method after we receive the corresponding refund from the relevant suppliers. Timelines depend on the supplier and payment provider, and are typically completed within a few weeks.",
  },
  {
    heading: "6. No-shows and unused services",
    body: "No-shows, unused tickets, and partially used services are non-refundable unless the relevant supplier's terms expressly provide otherwise.",
  },
  {
    heading: "7. Contact",
    body: "Origin Tours and Travels, Third Floor, Serene Heights, Humayun Nagar Rd, Masab Tank, Hyderabad-500028, Telangana, India. Phone: +91 91777 87635. Email: sales@origingroups.com.",
  },
];

export default function RefundPolicyPage() {
  return (
    <LegalPage
      title="Cancellation & Refund Policy"
      updated="29 May 2026"
      intro="This policy explains how cancellations and refunds are handled for bookings made with Origin Tours and Travels. Specific charges depend on the service booked and the terms of the relevant suppliers."
      sections={sections}
    />
  );
}
