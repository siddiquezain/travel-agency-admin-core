"use client";
// Redesigned Umrah package detail page (Figma "Redesign Page UI" import).
// Navy (#0c1b3d) + gold (#c9a227) + cream (#f9f7f2) palette, Playfair Display
// headings with Lora body copy. Used only for Umrah tours — regular tours keep
// TourDetailClient. Data shape is the same `normaliseTourDetail` initialData.
import React, { useState } from "react";
import RouterLink from "next/link";
import { useRouter } from "next/navigation";
import {
  MapPin,
  Clock,
  ArrowLeft,
  Check,
  X,
  Calendar,
  Plane,
  Hotel,
  ChevronRight,
  ChevronDown,
  Phone,
  User,
  Mail,
  Users,
  Loader2,
} from "lucide-react";
import MarkdownContent from "../../../components/MarkdownContent";
import MobileStickyCTA from "../../../components/MobileStickyCTA";
import { useRecaptcha } from "@/components/RecaptchaProvider";

const PLAYFAIR = "[font-family:var(--font-playfair),Georgia,serif]";
const LORA = "[font-family:var(--font-lora),Georgia,serif]";

function formatDate(value) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  const day = String(d.getDate()).padStart(2, "0");
  const month = d.toLocaleString("en-US", { month: "short" });
  return `${day} ${month} ${d.getFullYear()}`;
}

function formatPrice(value) {
  const n = parseFloat(String(value ?? "").replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) && n > 0 ? `₹${n.toLocaleString("en-IN")}` : null;
}

function SectionHeading({ icon, children }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="text-[#c9a227]">{icon}</div>
      <h2 className={`${PLAYFAIR} text-2xl font-semibold text-[#0c1b3d] tracking-tight`}>
        {children}
      </h2>
      <div className="flex-1 h-px bg-[rgba(12,27,61,0.12)] ml-2" />
    </div>
  );
}

function BookingForm({ slug, title, price, duration, country, airline }) {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", phone: "", email: "", travelers: "2" });
  const [status, setStatus] = useState(null); // null | "loading" | "error"
  const { executeRecaptcha } = useRecaptcha();

  const submit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const recaptchaToken = await executeRecaptcha("enquiry");
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email || undefined,
          phone: form.phone || undefined,
          message: `Travelers: ${form.travelers}`,
          serviceType: title || undefined,
          recaptchaToken,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      setForm({ name: "", phone: "", email: "", travelers: "2" });
      router.push(`/thank-you/${slug}?name=` + encodeURIComponent(title || ""));
    } catch {
      setStatus("error");
    }
  };

  const facts = [
    { label: "Duration", value: duration },
    { label: "Airline", value: airline },
    { label: "Origin", value: "Hyderabad" },
    { label: "Destination", value: country || "Makkah & Madinah" },
  ].filter((f) => f.value);

  return (
    <form
      id="enquiry-form"
      onSubmit={submit}
      className="bg-[#0c1b3d] rounded-2xl p-6 text-white sticky top-24"
    >
      <div className="mb-1">
        <span className={`text-[#c9a227] ${LORA} text-sm font-semibold uppercase tracking-widest`}>
          Umrah Package
        </span>
      </div>
      <h3 className={`${PLAYFAIR} text-2xl font-semibold mb-1 leading-tight`}>Request a Booking</h3>
      <div className="flex items-baseline gap-1 mb-6 pb-5 border-b border-white/15">
        {formatPrice(price) ? (
          <>
            <span className={`${LORA} text-3xl font-bold text-[#c9a227]`}>{formatPrice(price)}</span>
            <span className={`text-white/60 text-sm ${LORA}`}>/ per person</span>
          </>
        ) : (
          <span className={`${LORA} text-xl font-bold text-[#c9a227]`}>Contact for pricing</span>
        )}
      </div>

      <div className="space-y-3">
        {[
          { icon: <User size={14} />, label: "Full Name", key: "name", type: "text", placeholder: "Your full name", required: true },
          { icon: <Phone size={14} />, label: "Phone", key: "phone", type: "tel", placeholder: "+91 00000 00000", required: true },
          { icon: <Mail size={14} />, label: "Email", key: "email", type: "email", placeholder: "you@email.com", required: false },
        ].map(({ icon, label, key, type, placeholder, required }) => (
          <div key={key}>
            <label className={`text-white/60 text-xs ${LORA} uppercase tracking-wider flex items-center gap-1.5 mb-1`}>
              {icon} {label}
            </label>
            <input
              type={type}
              required={required}
              placeholder={placeholder}
              value={form[key]}
              onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
              className={`w-full bg-white/10 border border-white/15 rounded-lg px-3 py-2.5 text-white placeholder-white/30 ${LORA} text-sm focus:outline-none focus:border-[#c9a227] transition-colors`}
            />
          </div>
        ))}
        <div>
          <label className={`text-white/60 text-xs ${LORA} uppercase tracking-wider flex items-center gap-1.5 mb-1`}>
            <Users size={14} /> Travelers
          </label>
          <select
            value={form.travelers}
            onChange={(e) => setForm((f) => ({ ...f, travelers: e.target.value }))}
            className={`w-full bg-white/10 border border-white/15 rounded-lg px-3 py-2.5 text-white ${LORA} text-sm focus:outline-none focus:border-[#c9a227] transition-colors appearance-none`}
          >
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <option key={n} value={n} className="text-[#0c1b3d] bg-white">
                {n} {n === 1 ? "Traveler" : "Travelers"}
              </option>
            ))}
          </select>
        </div>
      </div>

      {status === "error" && (
        <p className={`mt-4 text-sm ${LORA} text-red-300`}>
          Something went wrong. Please try again or call us directly.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className={`w-full mt-5 bg-[#c9a227] hover:bg-amber-500 disabled:opacity-60 text-[#0c1b3d] ${LORA} font-bold py-3 rounded-xl transition-colors text-sm tracking-wide flex items-center justify-center gap-2`}
      >
        {status === "loading" && <Loader2 size={15} className="animate-spin" />}
        {status === "loading" ? "Sending…" : "Enquire Now"}
      </button>

      {facts.length > 0 && (
        <div className="mt-5 pt-5 border-t border-white/15 space-y-2.5">
          {facts.map(({ label, value }) => (
            <div key={label} className="flex justify-between text-sm">
              <span className={`text-white/50 ${LORA}`}>{label}</span>
              <span className={`text-white ${LORA} font-semibold text-right`}>{value}</span>
            </div>
          ))}
        </div>
      )}
    </form>
  );
}

const advantages = [
  "IATA Accredited Travel Agency",
  "Affordable and professionally managed Umrah packages",
  "Experienced Umrah coordinators and travel consultants",
  "Comfortable hotels near Haram and Masjid an-Nabawi",
  "Reliable transportation and guided Ziyarat tours",
  "Personalized assistance throughout the pilgrimage",
  "Transparent pricing with no hidden charges",
];

export default function UmrahTourDetailClient({ initialData, related = [] }) {
  const tour = initialData;
  const { title, content, tourDetails: acf, featuredImage } = tour;
  const thumbnail = featuredImage?.node?.sourceUrl;
  const country = acf?.holidayCountry?.nodes?.[0]?.name;
  const tags = [...(acf?.features ?? []), ...(acf?.mealTypes ?? [])].map((t) =>
    typeof t === "string" ? t.replace("Airt Ticket", "Air Ticket") : t,
  );
  const packages = acf?.packages ?? [];
  const itinerary = acf?.itinerary ?? [];
  const inclusions = (acf?.inclusions ?? []).map((i) => i.inclusion ?? i);
  const exclusions = (acf?.exclusions ?? []).map((e) => e.exclusion ?? e);
  const departures = acf?.datesAvailability ?? [];
  const gallery = acf?.gallery?.nodes ?? [];
  const airline = departures.find((d) => d.airline)?.airline;

  return (
    <div className={`min-h-screen bg-[#f9f7f2] ${LORA}`}>
      {/* Hero */}
      <div className="relative h-[70vh] min-h-[480px] bg-[#0c1b3d] overflow-hidden">
        {thumbnail && (
          <img
            src={thumbnail}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover opacity-50"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c1b3d] via-[#0c1b3d]/60 to-[#0c1b3d]/20" />

        {/* Back button + breadcrumb */}
        <div className="absolute top-24 left-0 right-0 px-6 lg:px-16 z-10">
          <RouterLink
            href="/umrah"
            className={`inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm ${LORA}`}
          >
            <ArrowLeft size={16} />
            Back to Packages
          </RouterLink>
          <div className={`flex items-center gap-2 text-white/40 text-xs mt-2 ${LORA}`}>
            <RouterLink href="/" className="hover:text-white/70">Home</RouterLink>
            <ChevronRight size={12} />
            <RouterLink href="/umrah" className="hover:text-white/70">Umrah</RouterLink>
            <ChevronRight size={12} />
            <span className="text-white/70">{title}</span>
          </div>
        </div>

        {/* Hero content */}
        <div className="absolute bottom-0 left-0 right-0 px-6 lg:px-16 pb-10 z-10">
          <div className="flex flex-wrap gap-2 mb-4">
            {country && (
              <span className="flex items-center gap-1.5 bg-white/10 border border-white/20 rounded-full px-3 py-1 text-white text-sm backdrop-blur-sm">
                <MapPin size={13} className="text-[#c9a227]" />
                {country}
              </span>
            )}
            <span className="flex items-center gap-1.5 bg-white/10 border border-white/20 rounded-full px-3 py-1 text-white text-sm backdrop-blur-sm">
              <Clock size={13} className="text-[#c9a227]" />
              {acf?.durationDaysNights || "Flexible"}
            </span>
          </div>
          <h1 className={`${PLAYFAIR} text-4xl md:text-6xl font-semibold text-white leading-tight max-w-2xl drop-shadow-lg`}>
            {title}
          </h1>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className={`text-xs font-semibold bg-[#c9a227]/20 border border-[#c9a227]/40 text-amber-200 rounded-full px-3 py-0.5 ${LORA}`}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="max-w-screen-xl mx-auto px-4 lg:px-16 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-10">
          {/* Main content */}
          <div className="space-y-12 min-w-0">
            {/* Overview */}
            {content && (
              <section>
                <SectionHeading icon={<Plane size={20} />}>Overview</SectionHeading>
                <div className="space-y-4 text-[#4b5162] leading-relaxed text-[1.05rem]">
                  <MarkdownContent content={content} />
                </div>
              </section>
            )}

            {/* Accommodation / Packages & Pricing */}
            {packages.length > 0 && (
              <section>
                <SectionHeading icon={<Hotel size={20} />}>Packages & Accommodation</SectionHeading>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {packages.map((pkg, i) => (
                    <div key={i} className="bg-white border border-[rgba(12,27,61,0.12)] rounded-2xl overflow-hidden">
                      <div className="bg-[#0c1b3d] px-5 py-3">
                        <span className={`${PLAYFAIR} text-[#c9a227] text-xs uppercase tracking-widest font-semibold`}>
                          {pkg.packageTitle || "Package"}
                        </span>
                        {pkg.hotelName && (
                          <h3 className={`${PLAYFAIR} text-white text-lg font-semibold mt-0.5`}>{pkg.hotelName}</h3>
                        )}
                      </div>
                      <div className="px-5 py-4 space-y-2">
                        {(pkg.roomPrices ?? []).map((room, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between py-2 border-b border-[rgba(12,27,61,0.08)] last:border-0"
                          >
                            <span className="text-xs text-[#6b6350] font-semibold uppercase tracking-wide">
                              Room: {room.roomType}
                            </span>
                            <span className={`${LORA} font-bold text-[#0c1b3d]`}>
                              {formatPrice(room.price) || "₹ TBD"}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Itinerary */}
            {itinerary.length > 0 && (
              <section>
                <SectionHeading icon={<Calendar size={20} />}>Itinerary</SectionHeading>
                <div className="space-y-2.5">
                  {itinerary.map((day, i) => (
                    <details
                      key={i}
                      className="group bg-white border border-[rgba(12,27,61,0.12)] rounded-2xl overflow-hidden"
                    >
                      <summary className="flex items-center gap-4 px-5 py-4 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                        <span className={`${PLAYFAIR} font-semibold text-[#0c1b3d] shrink-0`}>{day.day}</span>
                        <span className="text-sm text-[#6b6350] flex-1">{day.activity}</span>
                        <ChevronDown size={16} className="text-[#c9a227] shrink-0 transition-transform group-open:rotate-180" />
                      </summary>
                      {day.details && (
                        <div className="px-5 pb-4 pt-1 border-t border-[rgba(12,27,61,0.08)]">
                          <p className="text-sm text-[#6b6350] leading-relaxed whitespace-pre-line">{day.details}</p>
                        </div>
                      )}
                    </details>
                  ))}
                </div>
              </section>
            )}

            {/* Inclusions & Exclusions */}
            {(inclusions.length > 0 || exclusions.length > 0) && (
              <section>
                <SectionHeading icon={<Check size={20} />}>Inclusions & Exclusions</SectionHeading>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {inclusions.length > 0 && (
                    <div className="bg-white border border-[rgba(12,27,61,0.12)] rounded-2xl overflow-hidden">
                      <div className="flex items-center gap-2.5 px-5 py-3.5 bg-emerald-700">
                        <Check size={16} className="text-white" />
                        <span className={`${PLAYFAIR} text-white font-semibold text-sm uppercase tracking-widest`}>
                          Inclusions
                        </span>
                      </div>
                      <div className="px-5 py-4 space-y-2.5">
                        {inclusions.map((item, i) => (
                          <div key={i} className="flex items-start gap-2.5">
                            <Check size={13} className="text-emerald-600 mt-0.5 shrink-0" />
                            <span className="text-sm text-[#0c1b3d] leading-snug">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {exclusions.length > 0 && (
                    <div className="bg-white border border-[rgba(12,27,61,0.12)] rounded-2xl overflow-hidden">
                      <div className="flex items-center gap-2.5 px-5 py-3.5 bg-red-700">
                        <X size={16} className="text-white" />
                        <span className={`${PLAYFAIR} text-white font-semibold text-sm uppercase tracking-widest`}>
                          Exclusions
                        </span>
                      </div>
                      <div className="px-5 py-4 space-y-2.5">
                        {exclusions.map((item, i) => (
                          <div key={i} className="flex items-start gap-2.5">
                            <X size={13} className="text-red-500 mt-0.5 shrink-0" />
                            <span className="text-sm text-[#0c1b3d] leading-snug">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Upcoming Departures */}
            {departures.length > 0 && (
              <section>
                <SectionHeading icon={<Plane size={20} />}>Upcoming Departures</SectionHeading>
                <div className="bg-white border border-[rgba(12,27,61,0.12)] rounded-2xl overflow-hidden overflow-x-auto">
                  <div className="min-w-[480px]">
                    <div className="grid grid-cols-[1fr_1fr_1fr_auto] text-xs font-bold uppercase tracking-widest text-[#6b6350] bg-[#f0ece3]/60 px-5 py-3 border-b border-[rgba(12,27,61,0.12)]">
                      <span>Departure</span>
                      <span>Arrival</span>
                      <span>Airline</span>
                      <span>Price</span>
                    </div>
                    {departures.map((d, i) => (
                      <div
                        key={i}
                        className="grid grid-cols-[1fr_1fr_1fr_auto] px-5 py-3.5 border-b border-[rgba(12,27,61,0.12)] last:border-0 hover:bg-[#f0ece3]/30 transition-colors items-center"
                      >
                        <span className={`${LORA} text-sm text-[#0c1b3d]`}>{formatDate(d.departure)}</span>
                        <span className={`${LORA} text-sm text-[#0c1b3d]`}>{formatDate(d.arrival ?? d.arraival)}</span>
                        <span className={`${LORA} text-sm text-[#6b6350]`}>{d.airline || "—"}</span>
                        <span className={`${LORA} font-bold text-[#0c1b3d] text-sm`}>
                          {formatPrice(d.price) || "TBD"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Gallery */}
            {gallery.length > 0 && (
              <section>
                <SectionHeading icon={<MapPin size={20} />}>Gallery</SectionHeading>
                <div className="grid grid-cols-2 gap-4">
                  {gallery.map((img, i) => (
                    <div key={i} className="rounded-2xl overflow-hidden aspect-video bg-[#f0ece3]">
                      <img
                        src={img.sourceUrl}
                        alt={`${title} gallery ${i + 1}`}
                        loading="lazy"
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <aside>
            <BookingForm
              slug={tour.slug}
              title={title}
              price={acf?.price}
              duration={acf?.durationDaysNights}
              country={country}
              airline={airline}
            />
          </aside>
        </div>

        {/* Why Choose Us — full width */}
        <div className="mt-16 bg-[#0c1b3d] rounded-3xl px-8 py-10 md:px-14 md:py-12">
          <div className="max-w-3xl">
            <span className={`text-[#c9a227] font-semibold uppercase tracking-widest text-xs ${LORA}`}>
              Trusted Partner
            </span>
            <h2 className={`${PLAYFAIR} text-3xl text-white font-semibold mt-2 mb-2 leading-tight`}>
              Why Choose <span className="text-[#c9a227]">Origin Tours and Travels</span>?
            </h2>
            <p className={`text-white/60 ${LORA} text-sm mb-8 leading-relaxed`}>
              Origin Tours and Travels is a trusted travel agency specializing in Umrah packages,
              international tours, and customized travel services from Hyderabad and across India.
              Our focus is on delivering professional service, transparent pricing, comfortable
              travel experiences, and dedicated customer support.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {advantages.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#c9a227]/20 border border-[#c9a227]/40 flex items-center justify-center shrink-0 mt-0.5">
                    <Check size={11} className="text-[#c9a227]" />
                  </div>
                  <span className={`text-white/80 ${LORA} text-sm leading-snug`}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Book CTA strip */}
        <div className="mt-8 bg-[#c9a227] rounded-2xl px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className={`${PLAYFAIR} text-[#0c1b3d] text-xl font-semibold`}>Book your {title}</p>
            <p className={`text-[#0c1b3d]/70 ${LORA} text-sm mt-0.5`}>
              Embark on a peaceful spiritual journey with comfort, convenience, and trusted travel support.
            </p>
          </div>
          <a
            href="#enquiry-form"
            className={`shrink-0 bg-[#0c1b3d] text-white ${LORA} font-bold px-7 py-3 rounded-xl hover:bg-[#0c1b3d]/90 transition-colors text-sm tracking-wide whitespace-nowrap`}
          >
            Enquire Now →
          </a>
        </div>
      </div>

<MobileStickyCTA
        title="Book this package"
        whatsappMessage={`Hi, I'm interested in the Umrah package: ${title}`}
      />
    </div>
  );
}
