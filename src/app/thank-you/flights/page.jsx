import ThankYouTemplate from "@/components/ThankYouTemplate";

export const metadata = {
  title: "Thank You | Origin Tours and Travels",
  description: "Your flight enquiry has been received. We will contact you shortly.",
  robots: { index: false, follow: false },
};

const steps = [
  "Our flights team reviews your travel requirements.",
  "We call or WhatsApp you within a few hours.",
  "We share the best available fares and routes.",
  "You confirm and we issue your tickets.",
];

export default async function ThankYouFlightsPage({ searchParams }) {
  const params = await searchParams;
  const pkg = typeof params?.pkg === "string" ? decodeURIComponent(params.pkg) : "";

  return (
    <ThankYouTemplate
      badge="Enquiry Received"
      heading="Thank You!"
      packageName={pkg}
      body="Our flights team will get back to you shortly with the best available fares and routes."
      steps={steps}
      primaryHref="/flights"
      primaryLabel="Browse Flights"
      secondaryHref="/"
      secondaryLabel="Back to Home"
    />
  );
}
