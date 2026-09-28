import type { MetadataRoute } from "next";

const SITE_URL = "https://origintoursandtravels.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/*", "/api", "/api/*", "/login"],
      },
      {
        // Explicit allow for AI search/answer crawlers (redundant with "*" above —
        // kept for clarity. Note: a Cloudflare WAF/Bot-Fight block, if present, is a
        // separate dashboard-level concern this file cannot override).
        userAgent: [
          "GPTBot",
          "OAI-SearchBot",
          "ChatGPT-User",
          "PerplexityBot",
          "ClaudeBot",
          "Claude-Web",
          "cohere-ai",
          "meta-externalagent",
          "Applebot-Extended",
          "Google-Extended",
        ],
        allow: "/",
        disallow: ["/admin", "/admin/*", "/api", "/api/*", "/login"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
