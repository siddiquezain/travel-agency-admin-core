"use client";
import { Box } from "@mui/material";

// Shared styling for the listing-page filter bars (tours, umrah): a pill
// search field plus pill dropdowns whose menus render as white rounded
// cards with an uppercase heading and radio-style selection dots.

export const PILL_TEXT = "#1A428A";
export const PILL_BG = "#DFE8FA";
export const PILL_BG_HOVER = "#D2DEF8";
export const FOCUS_RING = "0 0 0 2px rgba(26, 66, 138, 0.35)";

export const pillSelectSx = {
  bgcolor: PILL_BG,
  borderRadius: 999,
  color: PILL_TEXT,
  fontWeight: 600,
  fontSize: "0.9rem",
  cursor: "pointer",
  transition: "background-color 0.2s ease, box-shadow 0.2s ease",
  "&:hover": { bgcolor: PILL_BG_HOVER },
  "&.Mui-focused": { boxShadow: FOCUS_RING },
  "& .MuiSelect-select": {
    display: "flex",
    alignItems: "center",
    gap: 0.75,
    py: 1.1,
    pl: 2,
    // Generous right padding keeps a clear gap between text and the chevron.
    pr: "52px !important",
    minHeight: "unset",
  },
  "& .MuiSelect-icon": { color: PILL_TEXT, right: 14 },
};

// Inner input styling for the pill search TextField (slotProps.input.sx).
export const searchPillSx = {
  bgcolor: "#EEF1F9",
  borderRadius: 999,
  px: 2,
  transition: "box-shadow 0.2s ease",
  "& fieldset": { border: "none" },
  "&.Mui-focused": { boxShadow: FOCUS_RING },
  "& input": { py: 1.1, color: "#0F172A" },
  "& input::placeholder": { color: "#64748B", opacity: 1 },
};

export const pillMenuProps = {
  PaperProps: {
    sx: {
      mt: 1,
      minWidth: 220,
      borderRadius: "14px",
      boxShadow: "0 12px 32px rgba(15, 23, 42, 0.14)",
      "& .MuiList-root": { py: 0.75 },
    },
  },
};

// Small uppercase heading at the top of each dropdown (e.g. "CATEGORY").
export const menuHeaderSx = {
  color: PILL_TEXT,
  fontWeight: 700,
  fontSize: "0.7rem",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  lineHeight: 2.6,
  px: 2.25,
};

export const menuItemSx = {
  fontSize: "0.95rem",
  fontWeight: 500,
  color: "#0F172A",
  py: 1.1,
  px: 2.25,
  "&:hover": { bgcolor: "#F6F8FC" },
  "&.Mui-selected": {
    bgcolor: "#F1F5FB",
    color: PILL_TEXT,
    fontWeight: 700,
    "&:hover": { bgcolor: "#E9EEF9" },
  },
};

// Radio-style indicator: hollow gray circle, or a solid navy dot when selected.
export const MenuDot = ({ selected }) => (
  <Box
    component="span"
    sx={{
      width: 9,
      height: 9,
      mr: 1.75,
      borderRadius: "50%",
      flexShrink: 0,
      ...(selected ? { bgcolor: PILL_TEXT } : { border: "1.5px solid #CBD5E1" }),
    }}
  />
);

// Icon + label shown inside a closed pill (placeholder text when unset).
export const pillValue = (Icon, label) => (
  <Box
    component="span"
    sx={{ display: "inline-flex", alignItems: "center", gap: 0.75 }}
  >
    <Icon sx={{ fontSize: 17 }} />
    {label}
  </Box>
);
