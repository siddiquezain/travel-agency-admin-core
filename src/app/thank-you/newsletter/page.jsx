import ThankYouTemplate from "@/components/ThankYouTemplate";

export const metadata = {
  title: "You're Subscribed! | Origin Tours and Travels",
  description: "Thanks for subscribing to our newsletter.",
  robots: { index: false, follow: false },
};

const steps = [
  "We add you to our mailing list.",
  "You'll receive curated travel deals and tips straight to your inbox.",
  "Exclusive offers reach you before anyone else.",
  "Unsubscribe anytime — no spam, ever.",
];

export default function ThankYouNewsletterPage() {
  return (
    <ThankYouTemplate
      badge="You're Subscribed!"
      heading="Welcome Aboard!"
      body="Thanks for subscribing! Keep an eye on your inbox for exclusive travel deals, visa updates, and insider tips."
      steps={steps}
      primaryHref="/tours"
      primaryLabel="Browse Tours"
      secondaryHref="/"
      secondaryLabel="Back to Home"
    />
  );
}
