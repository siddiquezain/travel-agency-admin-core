import { NextResponse } from "next/server";

// Returns the public reCAPTCHA site key at REQUEST time. Route handlers are
// never statically prerendered, so this reliably reflects the runtime env
// (e.g. Dokploy) even on pages that were statically built. The client provider
// uses this when the build-time-injected key is empty.
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ siteKey: process.env.RECAPTCHA_SITE_KEY || "" });
}
