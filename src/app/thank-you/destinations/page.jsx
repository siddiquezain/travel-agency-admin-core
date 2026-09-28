import ThankYouTemplate from "@/components/ThankYouTemplate";

export const metadata = {
  title: "Thank You | Origin Tours and Travels",
  description: "Your destination enquiry has been received. We will contact you shortly.",
  robots: { index: false, follow: false },
};

const steps = [
  "Our destination expert reviews your travel interests.",
  "We call or WhatsApp you within a few hours.",
  "We craft a tailored itinerary and share pricing.",
  "You confirm and we handle all the arrangements.",
];

export default async function ThankYouDestinationsPage({ searchParams }) {
  const params = await searchParams;
  const pkg = typeof params?.pkg === "string" ? decodeURIComponent(params.pkg) : "";

  return (
    <ThankYouTemplate
      badge="Enquiry Received"
      heading="Thank You!"
      packageName={pkg}
      body="Our travel experts will contact you shortly to craft a tailored itinerary for your destination."
      steps={steps}
      primaryHref="/destinations"
      primaryLabel="Explore Destinations"
      secondaryHref="/"
      secondaryLabel="Back to Home"
    />
  );
}
