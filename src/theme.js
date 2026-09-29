import { agency } from './config/agency'

const getDesignTokens = (mode) => ({
  palette: {
    mode,
    primary: {
      ...(mode === 'light'
        ? {
            main: agency.primaryColor,
            light: agency.primaryLight,
            dark: agency.primaryColor,
            contrastText: '#ffffff',
          }
        : {
            main: agency.primaryLight,
            light: '#7DD3FC',
            dark: agency.primaryColor,
            contrastText: '#0F172A',
          }),
    },
    secondary: {
      main: agency.primaryLight,
      light: '#67DAFF',
      dark: '#0085B3',
      contrastText: mode === 'light' ? '#ffffff' : '#0F172A',
    },
    background: {
      default: mode === "light" ? "#F8FAFC" : "#020617", // Slate-50 vs Deep Slate
      paper: mode === "light" ? "#ffffff" : "#0F172A", // White vs Slate-900
    },
    text: {
      primary: mode === "light" ? "#0F172A" : "#E2E8F0", // Slate-900 vs Slate-200 (Softer White)
      secondary: mode === "light" ? "#64748B" : "#94A3B8", // Slate-500 vs Slate-400
    },
    divider:
      mode === "light" ? "rgba(0, 0, 0, 0.12)" : "rgba(255, 255, 255, 0.12)",
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 481,
      md: 769,
      lg: 1025,
      xl: 1440,
    },
  },
  typography: {
    // Site-wide serif pairing: Playfair Display for headings, Lora for body.
    fontFamily: "var(--font-lora), Georgia, serif",
    h1: {
      fontFamily: "var(--font-playfair), Georgia, serif",
      fontWeight: 500,
      fontSize: "clamp(2rem, 5vw, 3.5rem)",
      lineHeight: 1.2,
    },
    h2: {
      fontFamily: "var(--font-playfair), Georgia, serif",
      fontWeight: 500,
      fontSize: "clamp(1.6rem, 4vw, 2.75rem)",
      lineHeight: 1.25,
    },
    h3: {
      fontFamily: "var(--font-playfair), Georgia, serif",
      fontWeight: 500,
      fontSize: "clamp(1.35rem, 3vw, 2rem)",
      lineHeight: 1.3,
    },
    h4: {
      fontFamily: "var(--font-playfair), Georgia, serif",
      fontWeight: 500,
      fontSize: "clamp(1.15rem, 2.5vw, 1.5rem)",
      lineHeight: 1.35,
    },
    h5: {
      fontFamily: "var(--font-playfair), Georgia, serif",
      fontWeight: 500,
      fontSize: "clamp(1.05rem, 2vw, 1.25rem)",
      lineHeight: 1.4,
    },
    h6: {
      fontFamily: "var(--font-playfair), Georgia, serif",
      fontWeight: 500,
      fontSize: "clamp(0.95rem, 1.5vw, 1.1rem)",
      letterSpacing: "0.05em",
      textTransform: "uppercase",
      lineHeight: 1.4,
    },
    body1: {
      fontSize: "clamp(0.9375rem, 1.2vw, 1.0625rem)",
      lineHeight: 1.7,
    },
    body2: {
      fontSize: "clamp(0.8125rem, 1vw, 0.9375rem)",
      lineHeight: 1.6,
    },
    button: {
      fontFamily: "var(--font-lora), Georgia, serif",
      fontWeight: 600,
      textTransform: "none",
      fontSize: "clamp(0.8125rem, 1.2vw, 0.9375rem)",
    },
  },
  shape: { borderRadius: 16 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 50,
          padding: "10px 24px",
          boxShadow: "none",
          "&:hover": {
            boxShadow:
              mode === "light"
                ? "0 4px 12px rgba(2, 132, 199, 0.2)"
                : "0 4px 12px rgba(96, 165, 250, 0.2)", // Matching Blue 400
            transform: "translateY(-1px)",
          },
        },
        containedPrimary: {
          background:
            mode === 'light'
              ? `linear-gradient(135deg, ${agency.primaryColor} 0%, ${agency.primaryLight} 100%)`
              : `linear-gradient(135deg, ${agency.primaryColor} 0%, ${agency.primaryLight} 100%)`,
        },
        containedSecondary: {
          background: `linear-gradient(135deg, ${agency.primaryLight} 0%, #67DAFF 100%)`,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 24,
          boxShadow:
            mode === "light"
              ? "0 4px 20px rgba(0,0,0,0.05)"
              : "0 4px 20px rgba(0,0,0,0.3)",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: { borderRadius: 24 },
        root: {
          backgroundImage: "none", // Remove default material overlay in dark mode for cleaner look
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
  },
});

export default getDesignTokens;
