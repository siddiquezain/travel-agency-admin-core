import ThankYouTemplate from "@/components/ThankYouTemplate";

export const metadata = {
  title: "Thank You | Origin Tours and Travels",
  description: "Your transport enquiry has been received. We will contact you shortly.",
  robots: { index: false, follow: false },
};

const steps = [
  "Our transport team reviews your booking request.",
  "We call or WhatsApp you within a few hours.",
  "We confirm availability and share pricing.",
  "You confirm and we arrange your transport.",
];

export default async function ThankYouTransportPage({ searchParams }) {
  const params = await searchParams;
  const pkg = typeof params?.pkg === "string" ? decodeURIComponent(params.pkg) : "";

  return (
    <ThankYouTemplate
      badge="Enquiry Received"
      heading="Thank You!"
      packageName={pkg}
      body="Our transport team will get in touch shortly to confirm your booking details."
      steps={steps}
      primaryHref="/transport"
      primaryLabel="View Transport Services"
      secondaryHref="/"
      secondaryLabel="Back to Home"
    />
  );
}
