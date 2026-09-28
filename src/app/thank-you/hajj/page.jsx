import ThankYouTemplate from "@/components/ThankYouTemplate";

export const metadata = {
  title: "Thank You | Origin Tours and Travels",
  description: "Your Hajj enquiry has been received. We will contact you shortly.",
  robots: { index: false, follow: false },
};

const steps = [
  "Our Hajj specialist reviews your enquiry.",
  "We call or WhatsApp you within a few hours.",
  "We share tailored Hajj package options and pricing.",
  "You confirm and we handle all the arrangements.",
];

export default async function ThankYouHajjPage({ searchParams }) {
  const params = await searchParams;
  const pkg = typeof params?.pkg === "string" ? decodeURIComponent(params.pkg) : "";

  return (
    <ThankYouTemplate
      badge="Enquiry Received"
      heading="Thank You!"
      packageName={pkg}
      body="Our Hajj specialists will contact you shortly to help plan your sacred journey."
      steps={steps}
      primaryHref="/hajj"
      primaryLabel="View Hajj Packages"
      secondaryHref="/"
      secondaryLabel="Back to Home"
    />
  );
}
