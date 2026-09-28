import ThankYouTemplate from "@/components/ThankYouTemplate";

export const metadata = {
  title: "Thank You | Origin Tours and Travels",
  description: "Your visa enquiry has been received. We will contact you shortly.",
  robots: { index: false, follow: false },
};

const steps = [
  "Our visa expert reviews your enquiry.",
  "We call or WhatsApp you within a few hours.",
  "We walk you through the application process and documents needed.",
  "You confirm and we handle the rest.",
];

export default async function ThankYouVisasPage({ searchParams }) {
  const params = await searchParams;
  const pkg = typeof params?.pkg === "string" ? decodeURIComponent(params.pkg) : "";

  return (
    <ThankYouTemplate
      badge="Enquiry Received"
      heading="Thank You!"
      packageName={pkg}
      body="Our visa experts will contact you shortly to guide you through the application process."
      steps={steps}
      primaryHref="/visas"
      primaryLabel="Browse Visa Services"
      secondaryHref="/"
      secondaryLabel="Back to Home"
    />
  );
}
