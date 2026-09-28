import ThankYouTemplate from "@/components/ThankYouTemplate";

export const metadata = {
  title: "Thank You | Origin Tours and Travels",
  description: "Your tour enquiry has been received. We will contact you shortly.",
  robots: { index: false, follow: false },
};

export default async function ThankYouToursPage({ searchParams }) {
  const params = await searchParams;
  const pkg = typeof params?.pkg === "string" ? decodeURIComponent(params.pkg) : "";

  return (
    <ThankYouTemplate
      badge="Enquiry Received"
      heading="Thank You!"
      packageName={pkg}
      body="One of our tour specialists will get in touch with you shortly to craft your perfect itinerary."
      primaryHref="/tours"
      primaryLabel="Browse More Tours"
      secondaryHref="/"
      secondaryLabel="Back to Home"
    />
  );
}
