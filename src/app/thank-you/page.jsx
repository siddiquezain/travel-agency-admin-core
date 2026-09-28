import ThankYouTemplate from "@/components/ThankYouTemplate";

export const metadata = {
  title: "Thank You | Origin Tours and Travels",
  description: "Your enquiry has been received. We will contact you shortly.",
  robots: { index: false, follow: false },
};

export default async function ThankYouPage({ searchParams }) {
  const params = await searchParams;
  const pkg = typeof params?.pkg === "string" ? decodeURIComponent(params.pkg) : "";

  return (
    <ThankYouTemplate
      badge="Enquiry Received"
      heading="Thank You!"
      packageName={pkg}
      body="One of our travel consultants will get in touch with you shortly to discuss your enquiry and answer any questions."
      primaryHref="/tours"
      primaryLabel="Browse Tours"
      secondaryHref="/"
      secondaryLabel="Back to Home"
    />
  );
}
