import ThankYouTemplate from "@/components/ThankYouTemplate";

export const metadata = {
  title: "Thank You | Origin Tours and Travels",
  description: "Your attestation enquiry has been received. We will contact you shortly.",
  robots: { index: false, follow: false },
};

const steps = [
  "Our attestation team reviews your documents and requirements.",
  "We call or WhatsApp you within a few hours.",
  "We share the process details, timeline, and pricing.",
  "You confirm and we handle the rest.",
];

export default async function ThankYouAttestationsPage({ searchParams }) {
  const params = await searchParams;
  const pkg = typeof params?.pkg === "string" ? decodeURIComponent(params.pkg) : "";

  return (
    <ThankYouTemplate
      badge="Enquiry Received"
      heading="Thank You!"
      packageName={pkg}
      body="Our attestation team will get back to you shortly with the process details and pricing."
      steps={steps}
      primaryHref="/attestations"
      primaryLabel="Browse Attestations"
      secondaryHref="/"
      secondaryLabel="Back to Home"
    />
  );
}
