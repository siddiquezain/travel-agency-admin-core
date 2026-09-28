/**
 * Unified Design System — Origin Travels
 * ========================================
 * Global design tokens for a premium, system-driven UI.
 * Change only accent colors — radius, shadow, spacing stay locked.
 *
 * Inspired by: Apple / Stripe / Vercel design principles
 */

// ─── RADIUS SYSTEM ───────────────────────────────────────────────
export const radius = {
  card: "40px", // Premium soft card radius
  icon: "16px", // rounded-2xl icon container
  badge: "50px", // Pill badges
  button: "50px", // Pill buttons
  chip: "12px", // Small chip elements
  accordion: "24px", // Accordion / collapsible
  section: "32px", // Large section containers
  input: "16px", // Form inputs
};

// ─── SHADOW SYSTEM ───────────────────────────────────────────────
export const shadow = {
  card: "0 4px 24px rgba(0, 0, 0, 0.06)",
  cardHover: "0 16px 40px rgba(0, 0, 0, 0.10)",
  icon: "0 4px 12px rgba(0, 0, 0, 0.08)",
  iconHover: "0 8px 20px rgba(0, 0, 0, 0.12)",
  soft: "0 2px 12px rgba(0, 0, 0, 0.04)",
  elevated: "0 12px 32px rgba(0, 0, 0, 0.08)",
};

// ─── SPACING SYSTEM ──────────────────────────────────────────────
export const spacing = {
  cardPadding: { xs: 5, md: 6 }, // p-10/p-12
  cardGap: 3, // space-y-6
  sectionGap: 4, // gap between grid items
  sectionPy: { xs: 8, md: 12 }, // standard section vertical padding
  sectionPyLarge: { xs: 10, md: 16 }, // large section vertical padding (hero, etc.)
};

// ─── SOFT CARD BACKGROUNDS ───────────────────────────────────────
export const cardBg = {
  neutral: "linear-gradient(135deg, #F8FAFC, #E2E8F0)",
  warm: "linear-gradient(135deg, #FDF6E3, #F3E8C8)",
  cool: "linear-gradient(135deg, #F5F7FA, #E4ECF7)",
  mint: "linear-gradient(135deg, #F0FDF4, #D1FAE5)",
};

// ─── SECTION COLOR IDENTITIES ────────────────────────────────────
// Each section gets ONE color identity. Only the icon gradient changes.
export const sectionColors = {
  blue: {
    gradient: "linear-gradient(135deg, #2563EB, #60A5FA)",
    text: "#2563EB",
    soft: "rgba(37, 99, 235, 0.08)",
    shadow: "0 4px 14px rgba(37, 99, 235, 0.25)",
  },
  teal: {
    gradient: "linear-gradient(135deg, #0E7490, #06B6D4)",
    text: "#0E7490",
    soft: "rgba(14, 116, 144, 0.08)",
    shadow: "0 4px 14px rgba(14, 116, 144, 0.25)",
  },
  indigo: {
    gradient: "linear-gradient(135deg, #4F46E5, #818CF8)",
    text: "#4F46E5",
    soft: "rgba(79, 70, 229, 0.08)",
    shadow: "0 4px 14px rgba(79, 70, 229, 0.25)",
  },
  amber: {
    gradient: "linear-gradient(135deg, #D4AF37, #EAC54F)",
    text: "#D4AF37",
    soft: "rgba(212, 175, 55, 0.08)",
    shadow: "0 4px 14px rgba(212, 175, 55, 0.25)",
  },
  emerald: {
    gradient: "linear-gradient(135deg, #065F46, #0D9488)",
    text: "#065F46",
    soft: "rgba(6, 95, 70, 0.08)",
    shadow: "0 4px 14px rgba(6, 95, 70, 0.25)",
  },
  orange: {
    gradient: "linear-gradient(135deg, #FF6B35, #FF8F5E)",
    text: "#FF6B35",
    soft: "rgba(255, 107, 53, 0.08)",
    shadow: "0 4px 14px rgba(255, 107, 53, 0.25)",
  },
  purple: {
    gradient: "linear-gradient(135deg, #9333EA, #A855F7)",
    text: "#9333EA",
    soft: "rgba(147, 51, 234, 0.08)",
    shadow: "0 4px 14px rgba(147, 51, 234, 0.25)",
  },
  sky: {
    gradient: "linear-gradient(135deg, #0284C7, #38BDF8)",
    text: "#0284C7",
    soft: "rgba(2, 132, 199, 0.08)",
    shadow: "0 4px 14px rgba(2, 132, 199, 0.25)",
  },
  rose: {
    gradient: "linear-gradient(135deg, #E11D48, #FB7185)",
    text: "#E11D48",
    soft: "rgba(225, 29, 72, 0.08)",
    shadow: "0 4px 14px rgba(225, 29, 72, 0.25)",
  },
};

// ─── SERVICE ICON CONFIG (Home page) ─────────────────────────────
export const serviceIcons = [
  {
    title: "Holiday Packages",
    icon: "/assets/icons/holiday.webp",
    link: "/tours",
    type: "link",
    color: sectionColors.orange,
    filter:
      "brightness(0) saturate(100%) invert(47%) sepia(83%) saturate(1400%) hue-rotate(346deg) brightness(101%) contrast(101%)",
  },
  {
    title: "Visa Services",
    icon: "/assets/icons/attestation.webp",
    link: "/visas",
    type: "link",
    color: sectionColors.emerald,
    filter:
      "brightness(0) saturate(100%) invert(27%) sepia(89%) saturate(800%) hue-rotate(140deg) brightness(92%) contrast(98%)",
  },
  {
    title: "Attestations",
    icon: "/assets/icons/visa.webp",
    link: "/attestations",
    type: "link",
    color: sectionColors.amber,
    filter:
      "brightness(0) saturate(100%) invert(68%) sepia(60%) saturate(500%) hue-rotate(10deg) brightness(95%) contrast(90%)",
  },
  {
    title: "Flight Booking",
    icon: "/assets/icons/flight.webp",
    action: "Flight Booking",
    type: "modal",
    color: sectionColors.sky,
    filter:
      "brightness(0) saturate(100%) invert(35%) sepia(90%) saturate(1200%) hue-rotate(182deg) brightness(95%) contrast(101%)",
  },
  {
    title: "Hotel Booking",
    icon: "/assets/icons/hotel.webp",
    action: "Hotel Booking",
    type: "modal",
    color: sectionColors.purple,
    filter:
      "brightness(0) saturate(100%) invert(25%) sepia(90%) saturate(2500%) hue-rotate(262deg) brightness(92%) contrast(98%)",
  },
];

// ─── COUNTRY FLAG GRADIENTS ──────────────────────────────────────
// Soft gradient inspired by national flags. Used on card content bg.
// Keys are LOWERCASE country names for dynamic lookup.
export const countryFlagGradients = {
  // Asia
  india: {
    gradient: "linear-gradient(135deg, #FF9933, #FFFFFF, #138808)",
    accent: "#FF9933",
    soft: "linear-gradient(135deg, rgba(255,153,51,0.08), rgba(19,136,8,0.06))",
  },
  "saudi arabia": {
    gradient: "linear-gradient(135deg, #006C35, #FFFFFF)",
    accent: "#006C35",
    soft: "linear-gradient(135deg, rgba(0,108,53,0.08), rgba(0,108,53,0.03))",
  },
  china: {
    gradient: "linear-gradient(135deg, #DE2910, #FFDE00)",
    accent: "#DE2910",
    soft: "linear-gradient(135deg, rgba(222,41,16,0.08), rgba(255,222,0,0.06))",
  },
  japan: {
    gradient: "linear-gradient(135deg, #FFFFFF, #BC002D)",
    accent: "#BC002D",
    soft: "linear-gradient(135deg, rgba(188,0,45,0.06), rgba(188,0,45,0.03))",
  },
  "south korea": {
    gradient: "linear-gradient(135deg, #003478, #CD2E3A)",
    accent: "#003478",
    soft: "linear-gradient(135deg, rgba(0,52,120,0.08), rgba(205,46,58,0.06))",
  },
  korea: {
    gradient: "linear-gradient(135deg, #003478, #CD2E3A)",
    accent: "#003478",
    soft: "linear-gradient(135deg, rgba(0,52,120,0.08), rgba(205,46,58,0.06))",
  },
  singapore: {
    gradient: "linear-gradient(135deg, #EF3340, #FFFFFF)",
    accent: "#EF3340",
    soft: "linear-gradient(135deg, rgba(239,51,64,0.08), rgba(239,51,64,0.03))",
  },
  malaysia: {
    gradient: "linear-gradient(135deg, #010066, #CC0001, #FFCC00)",
    accent: "#010066",
    soft: "linear-gradient(135deg, rgba(1,0,102,0.08), rgba(204,0,1,0.05))",
  },
  thailand: {
    gradient: "linear-gradient(135deg, #A51931, #2D2A4A, #FFFFFF)",
    accent: "#A51931",
    soft: "linear-gradient(135deg, rgba(165,25,49,0.08), rgba(45,42,74,0.05))",
  },
  vietnam: {
    gradient: "linear-gradient(135deg, #DA251D, #FFCD00)",
    accent: "#DA251D",
    soft: "linear-gradient(135deg, rgba(218,37,29,0.08), rgba(255,205,0,0.05))",
  },
  indonesia: {
    gradient: "linear-gradient(135deg, #FF0000, #FFFFFF)",
    accent: "#FF0000",
    soft: "linear-gradient(135deg, rgba(255,0,0,0.08), rgba(255,0,0,0.03))",
  },
  philippines: {
    gradient: "linear-gradient(135deg, #0038A8, #CE1126, #FCD116)",
    accent: "#0038A8",
    soft: "linear-gradient(135deg, rgba(0,56,168,0.08), rgba(206,17,38,0.05))",
  },
  "sri lanka": {
    gradient: "linear-gradient(135deg, #FFB700, #8D153A)",
    accent: "#8D153A",
    soft: "linear-gradient(135deg, rgba(255,183,0,0.08), rgba(141,21,58,0.05))",
  },
  nepal: {
    gradient: "linear-gradient(135deg, #DC143C, #003893)",
    accent: "#DC143C",
    soft: "linear-gradient(135deg, rgba(220,20,60,0.08), rgba(0,56,147,0.05))",
  },
  bangladesh: {
    gradient: "linear-gradient(135deg, #006A4E, #F42A41)",
    accent: "#006A4E",
    soft: "linear-gradient(135deg, rgba(0,106,78,0.08), rgba(244,42,65,0.05))",
  },
  pakistan: {
    gradient: "linear-gradient(135deg, #01411C, #FFFFFF)",
    accent: "#01411C",
    soft: "linear-gradient(135deg, rgba(1,65,28,0.08), rgba(1,65,28,0.03))",
  },

  // Middle East
  uae: {
    gradient: "linear-gradient(135deg, #00732F, #FFFFFF, #FF0000)",
    accent: "#00732F",
    soft: "linear-gradient(135deg, rgba(0,115,47,0.08), rgba(255,0,0,0.05))",
  },
  "united arab emirates": {
    gradient: "linear-gradient(135deg, #00732F, #FFFFFF, #FF0000)",
    accent: "#00732F",
    soft: "linear-gradient(135deg, rgba(0,115,47,0.08), rgba(255,0,0,0.05))",
  },
  dubai: {
    gradient: "linear-gradient(135deg, #00732F, #FFFFFF, #FF0000)",
    accent: "#00732F",
    soft: "linear-gradient(135deg, rgba(0,115,47,0.08), rgba(255,0,0,0.05))",
  },
  qatar: {
    gradient: "linear-gradient(135deg, #8A1538, #FFFFFF)",
    accent: "#8A1538",
    soft: "linear-gradient(135deg, rgba(138,21,56,0.08), rgba(138,21,56,0.03))",
  },
  oman: {
    gradient: "linear-gradient(135deg, #DB161B, #FFFFFF, #008000)",
    accent: "#DB161B",
    soft: "linear-gradient(135deg, rgba(219,22,27,0.08), rgba(0,128,0,0.05))",
  },
  bahrain: {
    gradient: "linear-gradient(135deg, #CE1126, #FFFFFF)",
    accent: "#CE1126",
    soft: "linear-gradient(135deg, rgba(206,17,38,0.08), rgba(206,17,38,0.03))",
  },
  kuwait: {
    gradient: "linear-gradient(135deg, #007A3D, #FFFFFF, #CE1126)",
    accent: "#007A3D",
    soft: "linear-gradient(135deg, rgba(0,122,61,0.08), rgba(206,17,38,0.05))",
  },
  jordan: {
    gradient: "linear-gradient(135deg, #007A33, #FFFFFF, #CE1126)",
    accent: "#007A33",
    soft: "linear-gradient(135deg, rgba(0,122,51,0.08), rgba(206,17,38,0.05))",
  },
  iraq: {
    gradient: "linear-gradient(135deg, #CE1126, #FFFFFF, #007A33)",
    accent: "#CE1126",
    soft: "linear-gradient(135deg, rgba(206,17,38,0.08), rgba(0,122,51,0.05))",
  },
  egypt: {
    gradient: "linear-gradient(135deg, #CE1126, #FFFFFF, #000000)",
    accent: "#CE1126",
    soft: "linear-gradient(135deg, rgba(206,17,38,0.08), rgba(0,0,0,0.04))",
  },
  turkey: {
    gradient: "linear-gradient(135deg, #E30A17, #FFFFFF)",
    accent: "#E30A17",
    soft: "linear-gradient(135deg, rgba(227,10,23,0.08), rgba(227,10,23,0.03))",
  },

  // Europe
  uk: {
    gradient: "linear-gradient(135deg, #012169, #C8102E, #FFFFFF)",
    accent: "#012169",
    soft: "linear-gradient(135deg, rgba(1,33,105,0.08), rgba(200,16,46,0.05))",
  },
  "united kingdom": {
    gradient: "linear-gradient(135deg, #012169, #C8102E, #FFFFFF)",
    accent: "#012169",
    soft: "linear-gradient(135deg, rgba(1,33,105,0.08), rgba(200,16,46,0.05))",
  },
  england: {
    gradient: "linear-gradient(135deg, #012169, #C8102E, #FFFFFF)",
    accent: "#012169",
    soft: "linear-gradient(135deg, rgba(1,33,105,0.08), rgba(200,16,46,0.05))",
  },
  france: {
    gradient: "linear-gradient(135deg, #002395, #FFFFFF, #ED2939)",
    accent: "#002395",
    soft: "linear-gradient(135deg, rgba(0,35,149,0.08), rgba(237,41,57,0.05))",
  },
  germany: {
    gradient: "linear-gradient(135deg, #000000, #DD0000, #FFCE00)",
    accent: "#DD0000",
    soft: "linear-gradient(135deg, rgba(0,0,0,0.06), rgba(255,206,0,0.06))",
  },
  italy: {
    gradient: "linear-gradient(135deg, #009246, #FFFFFF, #CE2B37)",
    accent: "#009246",
    soft: "linear-gradient(135deg, rgba(0,146,70,0.08), rgba(206,43,55,0.05))",
  },
  spain: {
    gradient: "linear-gradient(135deg, #AA151B, #F1BF00)",
    accent: "#AA151B",
    soft: "linear-gradient(135deg, rgba(170,21,27,0.08), rgba(241,191,0,0.06))",
  },
  portugal: {
    gradient: "linear-gradient(135deg, #006600, #FF0000)",
    accent: "#006600",
    soft: "linear-gradient(135deg, rgba(0,102,0,0.08), rgba(255,0,0,0.05))",
  },
  netherlands: {
    gradient: "linear-gradient(135deg, #AE1C28, #FFFFFF, #21468B)",
    accent: "#AE1C28",
    soft: "linear-gradient(135deg, rgba(174,28,40,0.08), rgba(33,70,139,0.05))",
  },
  switzerland: {
    gradient: "linear-gradient(135deg, #FF0000, #FFFFFF)",
    accent: "#FF0000",
    soft: "linear-gradient(135deg, rgba(255,0,0,0.08), rgba(255,0,0,0.03))",
  },
  greece: {
    gradient: "linear-gradient(135deg, #0D5EAF, #FFFFFF)",
    accent: "#0D5EAF",
    soft: "linear-gradient(135deg, rgba(13,94,175,0.08), rgba(13,94,175,0.03))",
  },
  russia: {
    gradient: "linear-gradient(135deg, #FFFFFF, #0039A6, #D52B1E)",
    accent: "#0039A6",
    soft: "linear-gradient(135deg, rgba(0,57,166,0.08), rgba(213,43,30,0.05))",
  },

  // Americas
  usa: {
    gradient: "linear-gradient(135deg, #3C3B6E, #FFFFFF, #B22234)",
    accent: "#3C3B6E",
    soft: "linear-gradient(135deg, rgba(60,59,110,0.08), rgba(178,34,52,0.05))",
  },
  "united states": {
    gradient: "linear-gradient(135deg, #3C3B6E, #FFFFFF, #B22234)",
    accent: "#3C3B6E",
    soft: "linear-gradient(135deg, rgba(60,59,110,0.08), rgba(178,34,52,0.05))",
  },
  canada: {
    gradient: "linear-gradient(135deg, #FF0000, #FFFFFF)",
    accent: "#FF0000",
    soft: "linear-gradient(135deg, rgba(255,0,0,0.08), rgba(255,0,0,0.03))",
  },
  brazil: {
    gradient: "linear-gradient(135deg, #009B3A, #FEDF00, #002776)",
    accent: "#009B3A",
    soft: "linear-gradient(135deg, rgba(0,155,58,0.08), rgba(0,39,118,0.05))",
  },
  mexico: {
    gradient: "linear-gradient(135deg, #006847, #FFFFFF, #CE1126)",
    accent: "#006847",
    soft: "linear-gradient(135deg, rgba(0,104,71,0.08), rgba(206,17,38,0.05))",
  },

  // Africa
  "south africa": {
    gradient: "linear-gradient(135deg, #007A4D, #FFB612, #DE3831)",
    accent: "#007A4D",
    soft: "linear-gradient(135deg, rgba(0,122,77,0.08), rgba(222,56,49,0.05))",
  },
  kenya: {
    gradient: "linear-gradient(135deg, #000000, #BB0000, #006600)",
    accent: "#BB0000",
    soft: "linear-gradient(135deg, rgba(0,0,0,0.06), rgba(0,102,0,0.06))",
  },
  nigeria: {
    gradient: "linear-gradient(135deg, #008751, #FFFFFF)",
    accent: "#008751",
    soft: "linear-gradient(135deg, rgba(0,135,81,0.08), rgba(0,135,81,0.03))",
  },
  morocco: {
    gradient: "linear-gradient(135deg, #C1272D, #006233)",
    accent: "#C1272D",
    soft: "linear-gradient(135deg, rgba(193,39,45,0.08), rgba(0,98,51,0.05))",
  },

  // Oceania
  australia: {
    gradient: "linear-gradient(135deg, #00008B, #FFFFFF, #FF0000)",
    accent: "#00008B",
    soft: "linear-gradient(135deg, rgba(0,0,139,0.08), rgba(255,0,0,0.05))",
  },
  "new zealand": {
    gradient: "linear-gradient(135deg, #00247D, #CC142B)",
    accent: "#00247D",
    soft: "linear-gradient(135deg, rgba(0,36,125,0.08), rgba(204,20,43,0.05))",
  },
};

// Default fallback for unknown countries
const defaultCountryGradient = {
  gradient: "linear-gradient(135deg, #667EEA, #764BA2)",
  accent: "#667EEA",
  soft: "linear-gradient(135deg, rgba(102,126,234,0.06), rgba(118,75,162,0.04))",
};

/** Lookup country gradient by name (case-insensitive, fuzzy) */
export const getCountryGradient = (countryName) => {
  if (!countryName) return defaultCountryGradient;
  const key = countryName.toLowerCase().trim();
  // Exact match
  if (countryFlagGradients[key]) return countryFlagGradients[key];
  // Partial match (e.g. "United Arab Emirates" contains "uae")
  const match = Object.keys(countryFlagGradients).find(
    (k) => key.includes(k) || k.includes(key),
  );
  return match ? countryFlagGradients[match] : defaultCountryGradient;
};

// ─── FEATURE CHIP GRADIENTS (ServiceCard) ────────────────────────
// Each feature type gets its own gradient for the chip icon container
export const featureChipColors = {
  flight: {
    gradient: "linear-gradient(135deg, #0284C7, #38BDF8)",
    text: "#0284C7",
  },
  visa: {
    gradient: "linear-gradient(135deg, #065F46, #0D9488)",
    text: "#065F46",
  },
  hotel: {
    gradient: "linear-gradient(135deg, #D4AF37, #EAC54F)",
    text: "#92700C",
  },
  default: {
    gradient: "linear-gradient(135deg, #6366F1, #818CF8)",
    text: "#6366F1",
  },
};

/** Get chip color based on feature label */
export const getFeatureChipColor = (featureLabel) => {
  if (!featureLabel) return featureChipColors.default;
  const lower = featureLabel.toLowerCase();
  if (
    lower.includes("flight") ||
    lower.includes("air") ||
    lower.includes("ticket")
  )
    return featureChipColors.flight;
  if (lower.includes("visa") || lower.includes("umrah visa"))
    return featureChipColors.visa;
  if (
    lower.includes("hotel") ||
    lower.includes("stay") ||
    lower.includes("accommodation")
  )
    return featureChipColors.hotel;
  return featureChipColors.default;
};

// ─── REUSABLE SX HELPERS ─────────────────────────────────────────

/** Premium highlight card base sx (use with Paper or Box) */
export const highlightCardSx = (bg = cardBg.neutral) => ({
  borderRadius: radius.card,
  background: bg,
  p: spacing.cardPadding,
  boxShadow: shadow.card,
  border: "1px solid rgba(0,0,0,0.04)",
  transition: "all 0.3s ease-out",
  "&:hover": {
    boxShadow: shadow.cardHover,
    transform: "scale(1.02)",
  },
});

/** Icon container with gradient background */
export const iconContainerSx = (colorIdentity) => ({
  width: 64,
  height: 64,
  borderRadius: radius.icon,
  background: colorIdentity.gradient,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "white",
  boxShadow: shadow.icon,
  transition: "all 0.3s ease-out",
  mx: "auto",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: colorIdentity.shadow,
  },
});

/** Section header helper  */
export const sectionHeaderSx = {
  textAlign: "center",
  mb: 8,
};

const designSystem = {
  radius,
  shadow,
  spacing,
  cardBg,
  sectionColors,
  serviceIcons,
  countryFlagGradients,
  getCountryGradient,
  featureChipColors,
  getFeatureChipColor,
  highlightCardSx,
  iconContainerSx,
  sectionHeaderSx,
};

export default designSystem;
