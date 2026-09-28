import ThankYouTemplate from "@/components/ThankYouTemplate";

export const metadata = {
  title: "Message Sent | Origin Tours and Travels",
  description: "Your message has been received. We will reply within 2 hours.",
  robots: { index: false, follow: false },
};

const steps = [
  "Our team reads your message.",
  "We reply by email or phone within 2 hours during business hours.",
  "We help plan your trip or resolve your query.",
  "You sit back — we handle the rest.",
];

export default function ThankYouContactPage() {
  return (
    <ThankYouTemplate
      badge="Message Sent"
      heading="We'll Be In Touch!"
      body="Our team has received your message and will reply within 2 hours during business hours (Mon–Sat, 9 AM – 7 PM IST)."
      steps={steps}
      primaryHref="/"
      primaryLabel="Back to Home"
      secondaryHref="/tours"
      secondaryLabel="Browse Tours"
    />
  );
}
