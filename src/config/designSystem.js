/**
 * Unified Design System
 * =====================
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
  featureChipColors,
  getFeatureChipColor,
  highlightCardSx,
  iconContainerSx,
  sectionHeaderSx,
};

export default designSystem;
