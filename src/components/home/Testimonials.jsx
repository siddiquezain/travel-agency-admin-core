"use client";
import React from "react";
import { Box, Container, Typography, Stack, IconButton } from "@mui/material";
import FormatQuote from "@mui/icons-material/FormatQuote";
import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import {
  radius,
  shadow,
  cardBg,
  sectionColors,
  highlightCardSx,
} from "../../config/designSystem";

const allReviews = [
  {
    name: "Ahmed K.",
    location: "Hyderabad",
    quote:
      "Excellent service for Umrah visa. The team guided me at every step and I received the visa in just 2 days.",
    rating: 5,
    color: sectionColors.emerald,
  },
  {
    name: "Sara M.",
    location: "Mumbai",
    quote:
      "Booked a Dubai tour through this agency. The itinerary was perfect, hotels were premium, and the on-ground support was amazing.",
    rating: 5,
    color: sectionColors.blue,
  },
  {
    name: "Rahul S.",
    location: "Bangalore",
    quote:
      "Got my degree attested for UAE employment. Very professional and transparent tracking system. Highly recommended.",
    rating: 5,
    color: sectionColors.amber,
  },
  {
    name: "Fatima N.",
    location: "Chennai",
    quote:
      "Our family Umrah trip was seamless. From visa to hotels near Haram, everything was perfectly arranged. JazakAllah!",
    rating: 5,
    color: sectionColors.teal,
  },
  {
    name: "Priya R.",
    location: "Delhi",
    quote:
      "Singapore tour was beyond expectations! The guide was knowledgeable and every detail was taken care of.",
    rating: 5,
    color: sectionColors.indigo,
  },
  {
    name: "Mohammed A.",
    location: "Hyderabad",
    quote:
      "Got my marriage certificate attested in record time. The staff was courteous and kept me updated throughout.",
    rating: 5,
    color: sectionColors.orange,
  },
  {
    name: "Ananya P.",
    location: "Pune",
    quote:
      "Thailand trip was the best vacation ever. Loved the island hopping experience — everything was perfectly organized!",
    rating: 5,
    color: sectionColors.purple,
  },
  {
    name: "Imran H.",
    location: "Kolkata",
    quote:
      "Applied for UK visa through Origin — approved on first attempt! They know the documentation inside out.",
    rating: 5,
    color: sectionColors.sky,
  },
  {
    name: "Deepa L.",
    location: "Cochin",
    quote:
      "Bali tour package was incredibly well-planned. The private villa upgrade was a pleasant surprise!",
    rating: 5,
    color: sectionColors.rose,
  },
  {
    name: "Yusuf T.",
    location: "Lucknow",
    quote:
      "Hajj documentation and attestation handled with utmost care. Truly a trustworthy travel partner.",
    rating: 5,
    color: sectionColors.emerald,
  },
  {
    name: "Kavitha M.",
    location: "Vizag",
    quote:
      "Europe multi-country tour was a dream come true. Paris, Switzerland, Rome — all perfectly organized!",
    rating: 5,
    color: sectionColors.blue,
  },
  {
    name: "Arjun D.",
    location: "Jaipur",
    quote:
      "Japan visa process was smooth and quick. The team even helped with itinerary planning. Outstanding!",
    rating: 4,
    color: sectionColors.amber,
  },
  {
    name: "Zainab F.",
    location: "Hyderabad",
    quote:
      "Booked Umrah for my parents. The VIP package with wheelchair assistance was a blessing. Highly recommended!",
    rating: 5,
    color: sectionColors.teal,
  },
  {
    name: "Vikram S.",
    location: "Ahmedabad",
    quote:
      "Malaysia + Singapore combo tour was value for money. Great hotels and the city tours were well-timed.",
    rating: 5,
    color: sectionColors.indigo,
  },
  {
    name: "Nisha G.",
    location: "Mysore",
    quote:
      "Student visa attestation for Canada done in 5 working days. Very efficient and reliable service!",
    rating: 5,
    color: sectionColors.orange,
  },
  {
    name: "Tariq M.",
    location: "Warangal",
    quote:
      "Dubai desert safari and Abu Dhabi day trip were highlights of our family vacation. Kids loved it!",
    rating: 5,
    color: sectionColors.purple,
  },
  {
    name: "Sneha K.",
    location: "Nagpur",
    quote:
      "Got Schengen visa through Origin. The document checklist they provided was super helpful. Approved easily!",
    rating: 5,
    color: sectionColors.sky,
  },
  {
    name: "Bilal R.",
    location: "Aurangabad",
    quote:
      "Turkey tour with hot air balloon ride in Cappadocia — absolutely magical! Great package pricing too.",
    rating: 5,
    color: sectionColors.rose,
  },
  {
    name: "Meera J.",
    location: "Surat",
    quote:
      "Birth certificate attestation for Qatar was done quickly. Very transparent pricing with no hidden charges.",
    rating: 5,
    color: sectionColors.emerald,
  },
  {
    name: "Aditya V.",
    location: "Indore",
    quote:
      "Vietnam tour was incredible! Ha Long Bay cruise and Hanoi street food tour were amazing experiences.",
    rating: 4,
    color: sectionColors.blue,
  },
  {
    name: "Salma B.",
    location: "Hyderabad",
    quote:
      "Third time booking for Umrah with this agency. Consistent quality every single time. They are the best!",
    rating: 5,
    color: sectionColors.amber,
  },
  {
    name: "Rohan P.",
    location: "Chandigarh",
    quote:
      "Australia tourist visa done in 10 days. They even guided me for the interview. First-class service!",
    rating: 5,
    color: sectionColors.teal,
  },
];

const row1 = allReviews.slice(0, 11);
const row2 = allReviews.slice(11);

const ReviewCard = ({ review }) => (
  <Box
    sx={{
      minWidth: 340,
      maxWidth: 340,
      flexShrink: 0,
      ...highlightCardSx(cardBg.neutral),
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: 2,
      p: 3.5,
      whiteSpace: "normal",
      transition: "transform 0.3s, box-shadow 0.3s",
      "&:hover": {
        transform: "translateY(-4px)",
        boxShadow: shadow.cardHover,
      },
    }}
  >
    <FormatQuote
      sx={{
        fontSize: 44,
        opacity: 0.06,
        position: "absolute",
        top: 16,
        right: 16,
        color: review.color.text,
      }}
    />
    <Stack
      direction="row"
      spacing={0.5}
      role="img"
      aria-label={`${review.rating} out of 5 stars`}
    >
      {[...Array(review.rating)].map((_, r) => (
        <Box
          key={r}
          sx={{ color: "#FFD700", fontSize: "1rem" }}
          aria-hidden="true"
        >
          ★
        </Box>
      ))}
    </Stack>
    <Typography
      variant="body2"
      sx={{
        fontStyle: "italic",
        color: "text.secondary",
        lineHeight: 1.7,
        flex: 1,
      }}
    >
      &ldquo;{review.quote}&rdquo;
    </Typography>
    <Stack
      direction="row"
      alignItems="center"
      spacing={1.5}
      sx={{ mt: "auto" }}
    >
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: radius.icon,
          background: review.color.gradient,
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: "bold",
          fontSize: "0.9rem",
          boxShadow: shadow.icon,
        }}
        aria-hidden="true"
      >
        {review.name.charAt(0)}
      </Box>
      <Box>
        <Typography variant="subtitle2" fontWeight="bold">
          {review.name}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {review.location}
        </Typography>
      </Box>
    </Stack>
  </Box>
);

const Testimonials = () => {
  const [isPaused, setIsPaused] = React.useState(false);

  return (
    <Box
      component="section"
      sx={{
        py: { xs: 8, md: 12 },
        bgcolor: "background.paper",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background Blobs */}
      <Box
        sx={{
          position: "absolute",
          top: -100,
          left: -100,
          width: 300,
          height: 300,
          bgcolor: "secondary.main",
          borderRadius: "50%",
          opacity: 0.05,
          filter: "blur(80px)",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: -100,
          right: -100,
          width: 300,
          height: 300,
          bgcolor: "primary.main",
          borderRadius: "50%",
          opacity: 0.05,
          filter: "blur(80px)",
        }}
      />

      <Container sx={{ position: "relative", zIndex: 1 }}>
        <Box textAlign="center" mb={6}>
          <Typography variant="h6" color="secondary" gutterBottom>
            Client Stories
          </Typography>
          <Typography variant="h2" color="primary" gutterBottom>
            What Our Travelers Say
          </Typography>
          <Typography color="text.secondary" maxWidth="sm" mx="auto">
            Real experiences from our happy travelers worldwide
          </Typography>

          {/* Explicit social proof — rating kept in sync with the AggregateRating
              JSON-LD in src/app/layout.tsx (4.7 / 428) to avoid contradicting it. */}
          <Typography
            component="p"
            sx={{
              mt: 2,
              fontWeight: 700,
              color: "text.primary",
              fontSize: { xs: "0.95rem", md: "1.05rem" },
            }}
          >
            <Box component="span" sx={{ color: "#F5A623", mr: 0.5 }}>
              ★ 4.7/5
            </Box>
            rated by 428+ travellers · 500+ happy pilgrims served
          </Typography>

          {/* Pause/Play button for accessibility (WCAG 2.2.2) */}
          <IconButton
            onClick={() => setIsPaused((p) => !p)}
            aria-label={
              isPaused
                ? "Play testimonial carousel"
                : "Pause testimonial carousel"
            }
            sx={{
              mt: 2,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
              px: 2,
              py: 0.5,
              gap: 0.5,
              fontSize: "0.85rem",
              color: "text.secondary",
              "&:hover": { bgcolor: "action.hover" },
            }}
          >
            {isPaused ? (
              <PlayArrowIcon fontSize="small" />
            ) : (
              <PauseIcon fontSize="small" />
            )}
            <Typography variant="caption" sx={{ fontWeight: 600 }}>
              {isPaused ? "Play" : "Pause"}
            </Typography>
          </IconButton>
        </Box>
      </Container>

      {/* Scrolling Rows */}
      <Stack
        spacing={4}
        sx={{ overflow: "hidden" }}
        aria-live="polite"
        aria-atomic="false"
      >
        {/* Row 1 - Left to Right */}
        <Box
          sx={{
            display: "flex",
            gap: 3,
            animation: "scrollLeft 60s linear infinite",
            animationPlayState: isPaused ? "paused" : "running",
            "&:hover": { animationPlayState: "paused" },
            "@keyframes scrollLeft": {
              "0%": { transform: "translateX(0)" },
              "100%": { transform: "translateX(-50%)" },
            },
            "@media (prefers-reduced-motion: reduce)": {
              animation: "none",
            },
            width: "max-content",
          }}
        >
          {[...row1, ...row1].map((review, i) => (
            <ReviewCard key={`r1-${i}`} review={review} />
          ))}
        </Box>
        {/* Row 2 - Reverse direction */}
        <Box
          sx={{
            display: "flex",
            gap: 3,
            animation: "scrollRight 55s linear infinite",
            animationPlayState: isPaused ? "paused" : "running",
            "&:hover": { animationPlayState: "paused" },
            "@keyframes scrollRight": {
              "0%": { transform: "translateX(-50%)" },
              "100%": { transform: "translateX(0)" },
            },
            "@media (prefers-reduced-motion: reduce)": {
              animation: "none",
            },
            width: "max-content",
          }}
        >
          {[...row2, ...row2].map((review, i) => (
            <ReviewCard key={`r2-${i}`} review={review} />
          ))}
        </Box>
      </Stack>
    </Box>
  );
};

export default Testimonials;
