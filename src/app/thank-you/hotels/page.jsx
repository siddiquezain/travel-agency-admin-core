import ThankYouTemplate from "@/components/ThankYouTemplate";

export const metadata = {
  title: "Thank You | Origin Tours and Travels",
  description: "Your hotel booking enquiry has been received. We will contact you shortly.",
  robots: { index: false, follow: false },
};

const steps = [
  "Our hotel specialists review your requirements.",
  "We call or WhatsApp you within a few hours.",
  "We share the best available hotel options and rates.",
  "You confirm and we handle the booking.",
];

export default async function ThankYouHotelsPage({ searchParams }) {
  const params = await searchParams;
  const pkg = typeof params?.pkg === "string" ? decodeURIComponent(params.pkg) : "";

  return (
    <ThankYouTemplate
      badge="Enquiry Received"
      heading="Thank You!"
      packageName={pkg}
      body="Our hotel specialists will contact you shortly with the best available options and rates."
      steps={steps}
      primaryHref="/hotels"
      primaryLabel="Browse Hotels"
      secondaryHref="/"
      secondaryLabel="Back to Home"
    />
  );
}
