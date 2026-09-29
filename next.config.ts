import type { NextConfig } from "next";
import { legacyRedirects } from "./src/config/legacyRedirects";

// Content-Security-Policy. Kept deliberately permissive on script/style/img so it
// does not break the third parties this site relies on (Google Analytics, reCAPTCHA,
// Google Maps embeds, YouTube, MUI/emotion inline styles, inline JSON-LD, and
// DB-hosted images on arbitrary https hosts). The high-value, low-risk directives
// — frame-ancestors, base-uri, form-action, object-src, upgrade-insecure-requests —
// are the real protection here. Tighten script-src with nonces later if desired.
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://www.google.com https://www.gstatic.com https://www.youtube.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "img-src 'self' data: blob: https:",
  "font-src 'self' https://fonts.gstatic.com data:",
  "connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com https://www.googletagmanager.com",
  "frame-src 'self' https://www.google.com https://www.youtube.com https://www.youtube-nocookie.com",
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  { key: "Content-Security-Policy", value: csp },
];

const nextConfig: NextConfig = {
  output: 'standalone',
  serverExternalPackages: ['@prisma/adapter-pg', 'pg'],
  typescript: {
    ignoreBuildErrors: true,
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
  async redirects() {
    return [
      ...legacyRedirects,
    ];
  },
};

export default nextConfig;
