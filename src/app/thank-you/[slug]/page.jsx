import ThankYouTemplate from "@/components/ThankYouTemplate";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  return {
    title: "Thank You | Origin Tours and Travels",
    description: "Your enquiry has been received. We will contact you shortly.",
    robots: { index: false, follow: false },
    alternates: { canonical: `/thank-you/${slug}` },
  };
}

export default async function ThankYouSlugPage({ params, searchParams }) {
  const { slug } = await params;
  const sp = await searchParams;
  const name = typeof sp?.name === "string" ? decodeURIComponent(sp.name) : "";

  return (
    <ThankYouTemplate
      badge="Enquiry Received"
      heading="Thank You!"
      packageName={name}
      body="One of our Umrah specialists will get in touch with you shortly to discuss your package and answer any questions."
      primaryHref="/umrah"
      primaryLabel="Browse Umrah Packages"
      secondaryHref="/"
      secondaryLabel="Back to Home"
    />
  );
}
