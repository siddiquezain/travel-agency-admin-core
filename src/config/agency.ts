// src/config/agency.ts
// ─────────────────────────────────────────────────────────────────────────────
// Per-agency identity. This is the first file you edit when starting a new
// project. All values here flow into the theme, admin shell, and public shell.
// ─────────────────────────────────────────────────────────────────────────────

export const agency = {
  name: 'Origin Travels',
  tagline: 'Your Journey, Our Expertise',
  logo: '/logo.png',        // place your logo at public/logo.png
  favicon: '/favicon.ico',
  // MUI theme primary colour — used for buttons, links, accents on the public site.
  // The admin sidebar uses Tailwind emerald classes and is not affected by this.
  primaryColor: '#1A428A',
  primaryLight: '#2AB0E5',
  supportEmail: 'info@origin-travels.com',
  supportPhone: '+971 50 123 4567',
  whatsapp: '971501234567',   // digits only, no +, no spaces — used in wa.me URL
  address: 'Dubai, UAE',
} as const
