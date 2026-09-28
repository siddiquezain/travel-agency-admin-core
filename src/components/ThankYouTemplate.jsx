import Link from "next/link";

const PLAYFAIR = "[font-family:var(--font-playfair),Georgia,serif]";
const LORA = "[font-family:var(--font-lora),Georgia,serif]";

const DEFAULT_STEPS = [
  "Our travel consultant reviews your enquiry.",
  "We call or WhatsApp you within a few hours.",
  "We share a tailored itinerary and pricing.",
  "You confirm and we handle the rest.",
];

export default function ThankYouTemplate({
  badge = "Enquiry Received",
  heading = "Thank You!",
  packageName = "",
  body = "One of our travel consultants will get in touch with you shortly to discuss your enquiry and answer any questions.",
  steps,
  primaryHref,
  primaryLabel,
  secondaryHref = "/",
  secondaryLabel = "Back to Home",
}) {
  const displaySteps = steps || DEFAULT_STEPS;

  return (
    <main className={`min-h-screen bg-[#f9f7f2] flex justify-center px-4 pt-32 pb-20 ${LORA}`}>
      <div className="max-w-lg w-full text-center">
        {/* Success icon */}
        <div className="w-20 h-20 rounded-full bg-[#c9a227]/20 border-2 border-[#c9a227] flex items-center justify-center mx-auto mb-6">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="#c9a227"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-9 h-9"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <span className={`text-[#c9a227] text-xs font-semibold uppercase tracking-widest ${LORA}`}>
          {badge}
        </span>

        <h1 className={`${PLAYFAIR} text-4xl md:text-5xl font-semibold text-[#0c1b3d] mt-2 mb-4 leading-tight`}>
          {heading}
        </h1>

        {packageName ? (
          <p className={`${LORA} text-[#4b5162] text-base leading-relaxed mb-2`}>
            Your enquiry for{" "}
            <strong className="text-[#0c1b3d] font-semibold">{packageName}</strong> has been
            received.
          </p>
        ) : null}

        <p className={`${LORA} text-[#6b6350] text-sm leading-relaxed mb-8`}>
          {body}
        </p>

        {/* What happens next */}
        <div className="bg-white border border-[rgba(12,27,61,0.12)] rounded-2xl p-6 mb-8 text-left">
          <p className={`${PLAYFAIR} font-semibold text-[#0c1b3d] mb-4 text-lg`}>
            What happens next?
          </p>
          <ol className="space-y-3">
            {displaySteps.map((step, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-[#0c1b3d] text-[#c9a227] text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span className={`text-sm text-[#4b5162] ${LORA} leading-snug`}>
                  {step}
                </span>
              </li>
            ))}
          </ol>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {primaryHref && (
            <Link
              href={primaryHref}
              className={`bg-[#0c1b3d] text-white ${LORA} font-semibold px-7 py-3 rounded-xl hover:bg-[#08132b] transition-colors text-sm tracking-wide`}
            >
              {primaryLabel}
            </Link>
          )}
          <Link
            href={secondaryHref}
            className={`bg-white border border-[rgba(12,27,61,0.2)] text-[#0c1b3d] ${LORA} font-semibold px-7 py-3 rounded-xl hover:bg-[#f0ece3] transition-colors text-sm tracking-wide`}
          >
            {secondaryLabel}
          </Link>
        </div>
      </div>
    </main>
  );
}
