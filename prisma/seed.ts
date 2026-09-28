import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is not set!");
    process.exit(1);
}
console.log("DATABASE_URL starts with:", process.env.DATABASE_URL.substring(0, 30) + "...");

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

async function main() {
    // ── Admin user ───────────────────────────────────────────────────────────
    const passwordHash = await bcrypt.hash("admin123", 12);
    await prisma.user.upsert({
        where: { email: "admin@origin.com" },
        update: {},
        create: { name: "Admin", email: "admin@origin.com", passwordHash, role: "ADMIN" },
    });
    console.log("Admin user: admin@origin.com / admin123");

    // ── Tours ─────────────────────────────────────────────────────────────────
    // Guard: only seed when the table is empty. The `migrate` service re-runs this
    // seed on every `docker compose up`, so without this guard, admin-deleted tours
    // would be resurrected each restart (skipDuplicates only skips rows whose slug
    // still exists — a deleted slug looks brand new and gets re-inserted).
    const tourCount = await prisma.tour.count();
    if (tourCount === 0) {
    await prisma.tour.createMany({
        skipDuplicates: true,
        data: [
            {
                slug: "umrah-package-economy",
                title: "Umrah Package – Economy",
                description:
                    "A comprehensive economy Umrah package covering flights, accommodation near the Haram, and guided ziyarat visits to the holy sites of Makkah and Madinah.",
                price: "1200",
                duration: "14 Days / 13 Nights",
                country: "Saudi Arabia",
                features: ["Air Ticket", "Hotel", "Meals", "Ziyarat", "Transportation"],
                images: [
                    "https://images.unsplash.com/photo-1565552645632-d725f8bfc19a?w=800",
                    "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=800",
                ],
                packages: [
                    {
                        packageTitle: "Economy Package",
                        roomPrices: [
                            { roomType: "Quad", price: "1200" },
                            { roomType: "Triple", price: "1450" },
                            { roomType: "Double", price: "1800" },
                        ],
                    },
                ],
                itinerary: [
                    { day: "Day 1", activity: "Departure", details: "Fly from your home city to Jeddah. Transfer to hotel in Makkah." },
                    { day: "Day 2", activity: "Umrah", details: "Perform Tawaf, Sa'i and complete your Umrah rituals." },
                    { day: "Day 3–7", activity: "Ibadah in Makkah", details: "Free time for prayers at Masjid al-Haram. Optional ziyarat tours." },
                    { day: "Day 8", activity: "Travel to Madinah", details: "Coach transfer to Madinah. Check in to hotel near Masjid an-Nabawi." },
                    { day: "Day 9–12", activity: "Madinah Ibadah", details: "Prayers at the Prophet's Mosque, visits to Quba Mosque and Uhud." },
                    { day: "Day 13", activity: "Return to Jeddah", details: "Transfer to Jeddah Airport for departure." },
                    { day: "Day 14", activity: "Arrival", details: "Arrive home." },
                ],
                inclusions: [
                    { inclusion: "Return economy class airfare" },
                    { inclusion: "13 nights hotel accommodation (5 Makkah + 5 Madinah)" },
                    { inclusion: "Daily breakfast & dinner" },
                    { inclusion: "Air-conditioned coach transfers" },
                    { inclusion: "Ziyarat tours in Makkah & Madinah" },
                    { inclusion: "Umrah visa" },
                ],
                exclusions: [
                    { exclusion: "Personal expenses & shopping" },
                    { exclusion: "Travel insurance" },
                    { exclusion: "Optional tours not listed in itinerary" },
                ],
                datesAvailability: [
                    { departure: "2027-03-10", arraival: "2027-03-24", price: "1200", airline: "Saudi Airlines" },
                    { departure: "2027-04-05", arraival: "2027-04-19", price: "1250", airline: "Etihad Airways" },
                    { departure: "2027-05-12", arraival: "2027-05-26", price: "1300", airline: "Air India" },
                ],
                gallery: [
                    "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=800",
                    "https://images.unsplash.com/photo-1564769662533-4f00a87b4056?w=800",
                ],
                isActive: true,
            },
            {
                slug: "umrah-package-premium",
                title: "Umrah Package – Premium",
                description:
                    "Experience Umrah in comfort with 5-star hotels steps away from the Haram, private transfers, and exclusive ziyarat tours.",
                price: "2800",
                duration: "14 Days / 13 Nights",
                country: "Saudi Arabia",
                features: ["Air Ticket", "Umrah Visa", "Hotel", "Meals", "Ziyarat", "Transportation"],
                images: [
                    "https://images.unsplash.com/photo-1564769662533-4f00a87b4056?w=800",
                ],
                packages: [
                    {
                        packageTitle: "Premium Package",
                        roomPrices: [
                            { roomType: "Double", price: "2800" },
                            { roomType: "Triple", price: "2200" },
                        ],
                    },
                ],
                itinerary: [
                    { day: "Day 1", activity: "Departure", details: "Business class departure. Private transfer to 5-star hotel in Makkah." },
                    { day: "Day 2", activity: "Umrah", details: "Perform Umrah with a dedicated guide." },
                    { day: "Day 3–7", activity: "Ibadah in Makkah", details: "Private ziyarat tours and unlimited Haram visits." },
                    { day: "Day 8–12", activity: "Madinah", details: "5-star hotel near Masjid an-Nabawi. Guided historical tours." },
                    { day: "Day 13–14", activity: "Return", details: "Departure from Jeddah and arrival home." },
                ],
                inclusions: [
                    { inclusion: "Return economy airfare" },
                    { inclusion: "5-star hotel accommodation" },
                    { inclusion: "Full board meals" },
                    { inclusion: "Private transfers throughout" },
                    { inclusion: "Personal tour guide" },
                    { inclusion: "Umrah visa" },
                ],
                exclusions: [
                    { exclusion: "Personal expenses" },
                    { exclusion: "Travel insurance" },
                ],
                datesAvailability: [
                    { departure: "2027-03-15", arraival: "2027-03-29", price: "2800", airline: "Etihad Airways" },
                    { departure: "2027-04-10", arraival: "2027-04-24", price: "2900", airline: "Saudi Airlines" },
                ],
                gallery: [],
                isActive: true,
            },
            {
                slug: "dubai-city-tour",
                title: "Dubai City Tour",
                description:
                    "Discover the best of Dubai — from the iconic Burj Khalifa to traditional souks and desert safaris — in this action-packed 7-day itinerary.",
                price: "950",
                duration: "7 Days / 6 Nights",
                country: "UAE",
                features: ["Air Ticket", "Hotel", "Transportation"],
                images: [
                    "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800",
                ],
                packages: [
                    {
                        packageTitle: "Standard Tour",
                        roomPrices: [
                            { roomType: "Double", price: "950" },
                            { roomType: "Triple", price: "780" },
                            { roomType: "Quad", price: "650" },
                        ],
                    },
                ],
                itinerary: [
                    { day: "Day 1", activity: "Arrival in Dubai", details: "Airport pick-up and hotel check-in. Evening at leisure on JBR Beach." },
                    { day: "Day 2", activity: "Modern Dubai", details: "Burj Khalifa observation deck, Dubai Mall, and Dubai Fountain show." },
                    { day: "Day 3", activity: "Old Dubai", details: "Gold Souk, Spice Souk, and Dubai Creek abra ride." },
                    { day: "Day 4", activity: "Desert Safari", details: "Dune bashing, camel riding, and BBQ dinner under the stars." },
                    { day: "Day 5", activity: "Abu Dhabi Day Trip", details: "Sheikh Zayed Grand Mosque and Corniche tour." },
                    { day: "Day 6", activity: "Free Day", details: "Optional Mall of the Emirates (Ski Dubai) or beach relaxation." },
                    { day: "Day 7", activity: "Departure", details: "Check-out and airport transfer." },
                ],
                inclusions: [
                    { inclusion: "Return economy airfare" },
                    { inclusion: "6 nights 4-star hotel" },
                    { inclusion: "Daily breakfast" },
                    { inclusion: "Airport transfers" },
                    { inclusion: "Desert safari with dinner" },
                ],
                exclusions: [
                    { exclusion: "UAE visa (can be arranged on request)" },
                    { exclusion: "Lunch & dinner (except safari)" },
                    { exclusion: "Travel insurance" },
                ],
                datesAvailability: [
                    { departure: "2027-03-20", arraival: "2027-03-27", price: "950", airline: "Fly Dubai" },
                    { departure: "2027-04-18", arraival: "2027-04-25", price: "980", airline: "Indigo" },
                ],
                gallery: [],
                isActive: true,
            },
        ],
    });
    console.log("Seeded 3 tours.");
    } else {
        console.log(`Tours already present (${tourCount}) — skipping tour seed.`);
    }

    // ── Visas ─────────────────────────────────────────────────────────────────
    const visaCount = await prisma.visa.count();
    if (visaCount === 0) {
    await prisma.visa.createMany({
        skipDuplicates: true,
        data: [
            {
                slug: "saudi-arabia-umrah-visa",
                country: "Saudi Arabia",
                type: "Umrah Visa",
                description:
                    "The Saudi Umrah Visa allows Muslims from across the world to perform the pilgrimage of Umrah at Masjid al-Haram in Makkah and visit Masjid an-Nabawi in Madinah. The visa is issued through authorised Umrah operators.",
                fee: "Free (included in package)",
                processingTime: "7–14 working days",
                validityDuration: "30 days",
                requirements: [
                    { requiredDocument: "Original passport (minimum 6 months validity)" },
                    { requiredDocument: "2 recent passport-size photographs (white background)" },
                    { requiredDocument: "Completed visa application form" },
                    { requiredDocument: "Confirmed Umrah package booking" },
                    { requiredDocument: "Proof of accommodation in Makkah & Madinah" },
                    { requiredDocument: "Return flight tickets" },
                    { requiredDocument: "Meningitis vaccination certificate (ACWY)" },
                ],
                isActive: true,
            },
            {
                slug: "uae-tourist-visa",
                country: "UAE",
                type: "Tourist Visa",
                description:
                    "The UAE Tourist Visa (Visit Visa) allows travellers to explore Dubai, Abu Dhabi, and the other Emirates for leisure or family visits. It can be obtained through a UAE-based sponsor, hotel, or travel agency.",
                fee: "AED 370 (~₹8,500)",
                processingTime: "3–5 working days",
                validityDuration: "30 days (single entry) / 90 days (multi-entry)",
                requirements: [
                    { requiredDocument: "Scanned copy of passport (minimum 6 months validity)" },
                    { requiredDocument: "Passport-size photograph (white background)" },
                    { requiredDocument: "Confirmed return flight tickets" },
                    { requiredDocument: "Hotel booking confirmation" },
                    { requiredDocument: "Bank statement (last 3 months)" },
                    { requiredDocument: "Travel insurance (recommended)" },
                ],
                isActive: true,
            },
            {
                slug: "india-tourist-visa",
                country: "India",
                type: "Tourist Visa",
                description:
                    "The India e-Tourist Visa (eTV) is available online for citizens of eligible countries. It allows single or multiple entries for tourism, recreation, and visiting friends and relatives.",
                fee: "$25 (varies by nationality)",
                processingTime: "3–5 business days",
                validityDuration: "30 days (single entry) or 1 year (multi-entry)",
                requirements: [
                    { requiredDocument: "Valid passport (6 months validity from date of arrival)" },
                    { requiredDocument: "Digital passport photograph" },
                    { requiredDocument: "Last page of passport (with address)" },
                    { requiredDocument: "Return or onward flight ticket" },
                    { requiredDocument: "Proof of sufficient funds" },
                    { requiredDocument: "Travel itinerary" },
                ],
                isActive: true,
            },
        ],
    });
    console.log("Seeded 3 visas.");
    } else {
        console.log(`Visas already present (${visaCount}) — skipping visa seed.`);
    }

    // ── Attestations ──────────────────────────────────────────────────────────
    const attestationCount = await prisma.attestation.count();
    if (attestationCount === 0) {
    await prisma.attestation.createMany({
        skipDuplicates: true,
        data: [
            {
                slug: "uae-degree-attestation",
                type: "Degree Attestation",
                country: "UAE",
                description:
                    "Attestation of educational degree certificates for use in the United Arab Emirates. The process involves HRD/Home Department authentication, MEA attestation, and UAE Embassy attestation.",
                fee: "₹3,500",
                isActive: true,
            },
            {
                slug: "saudi-birth-certificate-attestation",
                type: "Birth Certificate Attestation",
                country: "Saudi Arabia",
                description:
                    "Attestation of birth certificates for Saudi Arabia. Required for family visa, dependent visa, and residency applications. Covers notary, Home Department, MEA, and Saudi Embassy attestation.",
                fee: "₹4,000",
                isActive: true,
            },
            {
                slug: "uae-marriage-certificate-attestation",
                type: "Marriage Certificate Attestation",
                country: "UAE",
                description:
                    "Attestation of marriage certificates for use in the UAE. Typically needed for spouse/dependent visa applications and legal name change processes.",
                fee: "₹3,800",
                isActive: true,
            },
        ],
    });
    console.log("Seeded 3 attestations.");
    } else {
        console.log(`Attestations already present (${attestationCount}) — skipping attestation seed.`);
    }

    // ── Countries (master) ─────────────────────────────────────────────────────
    await prisma.country.createMany({
        skipDuplicates: true,
        data: [
            { name: "United Arab Emirates", code: "AE", flag: "🇦🇪" },
            { name: "Saudi Arabia", code: "SA", flag: "🇸🇦" },
            { name: "India", code: "IN", flag: "🇮🇳" },
            { name: "Turkey", code: "TR", flag: "🇹🇷" },
            { name: "Indonesia", code: "ID", flag: "🇮🇩" },
            { name: "Thailand", code: "TH", flag: "🇹🇭" },
        ],
    });
    console.log("Seeded countries.");

    const countryRows = await prisma.country.findMany({ select: { id: true, code: true } });
    const countriesByCode: Record<string, number> = Object.fromEntries(
        countryRows.map((c: { id: number; code: string }) => [c.code, c.id]),
    );

    // ── Destinations ──────────────────────────────────────────────────────────
    const destinations: { name: string; slug: string; countryId: number; description: string }[] = [
        { name: "Dubai", slug: "dubai", countryId: countriesByCode.AE, description: "The crown jewel of the UAE — skyscrapers, desert, and luxury shopping." },
        { name: "Abu Dhabi", slug: "abu-dhabi", countryId: countriesByCode.AE, description: "Capital of the UAE, home to the Sheikh Zayed Grand Mosque." },
        { name: "Makkah", slug: "makkah", countryId: countriesByCode.SA, description: "The holiest city in Islam." },
        { name: "Madinah", slug: "madinah", countryId: countriesByCode.SA, description: "Site of the Prophet's Mosque." },
        { name: "Goa", slug: "goa", countryId: countriesByCode.IN, description: "Beaches, Portuguese heritage, and nightlife on India's west coast." },
        { name: "Istanbul", slug: "istanbul", countryId: countriesByCode.TR, description: "Where Europe meets Asia." },
        { name: "Bali", slug: "bali", countryId: countriesByCode.ID, description: "Volcanic landscapes, rice terraces, and Hindu temples." },
        { name: "Bangkok", slug: "bangkok", countryId: countriesByCode.TH, description: "Vibrant street life and ornate temples." },
    ].filter(d => d.countryId);
    if (destinations.length > 0) {
        await prisma.destination.createMany({ skipDuplicates: true, data: destinations });
        console.log(`Seeded ${destinations.length} destinations.`);
    }

    // ── Visa Types ─────────────────────────────────────────────────────────────
    await prisma.visaType.createMany({
        skipDuplicates: true,
        data: [
            { name: "Tourist Visa", code: "TOURIST", description: "For leisure travel and sightseeing." },
            { name: "Business Visa", code: "BUSINESS", description: "For meetings, conferences, and short business trips." },
            { name: "Student Visa", code: "STUDENT", description: "For full-time enrolment in an educational institution." },
            { name: "Work Visa", code: "WORK", description: "For paid employment in the destination country." },
            { name: "Transit Visa", code: "TRANSIT", description: "For short stopovers between flights." },
            { name: "Umrah Visa", code: "UMRAH", description: "For pilgrimage to Makkah and Madinah." },
            { name: "Family Visa", code: "FAMILY", description: "For dependents joining a sponsor in the destination country." },
        ],
    });
    console.log("Seeded visa types.");

    // ── Attestation Types ──────────────────────────────────────────────────────
    await prisma.attestationType.createMany({
        skipDuplicates: true,
        data: [
            { name: "Educational", code: "EDU", description: "Degree, diploma, and academic transcripts." },
            { name: "Commercial", code: "COM", description: "Power of attorney, board resolutions, invoices." },
            { name: "Personal", code: "PER", description: "Birth, marriage, and death certificates." },
            { name: "MOFA Attestation", code: "MOFA", description: "Ministry of Foreign Affairs final attestation." },
            { name: "Embassy Attestation", code: "EMBASSY", description: "Destination country embassy attestation." },
        ],
    });
    console.log("Seeded attestation types.");

    // ── Tour Categories ────────────────────────────────────────────────────────
    await prisma.tourCategory.createMany({
        skipDuplicates: true,
        data: [
            { name: "Beach", slug: "beach", description: "Coastal escapes and island getaways.", icon: "🏖️" },
            { name: "Adventure", slug: "adventure", description: "Trekking, rafting, and adrenaline trips.", icon: "🏔️" },
            { name: "Religious", slug: "religious", description: "Pilgrimage and spiritual tours.", icon: "🕌" },
            { name: "Umrah", slug: "umrah", description: "Umrah pilgrimage packages to Makkah and Madinah.", icon: "🕋" },
            { name: "Honeymoon", slug: "honeymoon", description: "Romantic getaways for newlyweds.", icon: "💑" },
            { name: "Cultural", slug: "cultural", description: "Heritage, museums, and historical sites.", icon: "🏛️" },
            { name: "Family", slug: "family", description: "Itineraries built for families with kids.", icon: "👨‍👩‍👧" },
        ],
    });
    console.log("Seeded tour categories.");

    // ── Currencies ─────────────────────────────────────────────────────────────
    await prisma.currency.createMany({
        skipDuplicates: true,
        data: [
            { code: "AED", name: "UAE Dirham", symbol: "د.إ" },
            { code: "USD", name: "US Dollar", symbol: "$" },
            { code: "INR", name: "Indian Rupee", symbol: "₹" },
            { code: "SAR", name: "Saudi Riyal", symbol: "﷼" },
            { code: "EUR", name: "Euro", symbol: "€" },
            { code: "GBP", name: "British Pound", symbol: "£" },
        ],
    });
    console.log("Seeded currencies.");

    // ── Document Types ─────────────────────────────────────────────────────────
    await prisma.documentType.createMany({
        skipDuplicates: true,
        data: [
            { name: "Passport", description: "Original passport with minimum 6 months validity." },
            { name: "Passport Photo", description: "Recent passport-size photograph with white background." },
            { name: "Bank Statement", description: "Last 3 months bank statement." },
            { name: "Hotel Booking", description: "Confirmed hotel booking for the duration of stay." },
            { name: "Return Flight Ticket", description: "Confirmed return or onward flight ticket." },
            { name: "Travel Insurance", description: "Travel insurance covering the duration of stay." },
            { name: "Visa Application Form", description: "Completed and signed visa application form." },
            { name: "Vaccination Certificate", description: "Required vaccination certificate (e.g. meningitis ACWY for Umrah)." },
        ],
    });
    console.log("Seeded document types.");

    // ── Service Types ──────────────────────────────────────────────────────────
    await prisma.serviceType.createMany({
        skipDuplicates: true,
        data: [
            { name: "Tour Booking", slug: "tour-booking" },
            { name: "Visa Application", slug: "visa-application" },
            { name: "Document Attestation", slug: "document-attestation" },
            { name: "Umrah Package", slug: "umrah-package" },
            { name: "Flight Booking", slug: "flight-booking" },
            { name: "Hotel Booking", slug: "hotel-booking" },
            { name: "Other", slug: "other" },
        ],
    });
    console.log("Seeded service types.");
}

main()
    .catch((e) => {
        console.error("Seed error:", e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
