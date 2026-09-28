// Server-side Google reCAPTCHA v3 verification.
//
// Fails OPEN when unconfigured (no RECAPTCHA_SECRET_KEY) or when Google is
// unreachable — we never block a genuine user because of an outage or a
// missing key. When a secret IS configured and Google responds, a low score
// or an unsuccessful verification is rejected.

const SCORE_THRESHOLD = 0.5;
const VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";

type VerifyResult = { ok: boolean; score?: number };

export async function verifyRecaptcha(
  token: unknown,
  opts: { ip?: string; action?: string } = {},
): Promise<VerifyResult> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;

  // Not configured → don't enforce (keeps dev / pre-key deploys working).
  if (!secret) return { ok: true };

  // Configured but the client sent no token → treat as failure.
  if (typeof token !== "string" || !token) return { ok: false };

  try {
    const params = new URLSearchParams({ secret, response: token });
    if (opts.ip && opts.ip !== "unknown") params.set("remoteip", opts.ip);

    const res = await fetch(VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });
    const data = (await res.json()) as {
      success?: boolean;
      score?: number;
      action?: string;
      "error-codes"?: string[];
    };

    if (opts.action && data.action && data.action !== opts.action) {
      console.warn(
        `[recaptcha] action mismatch: expected "${opts.action}", got "${data.action}"`,
      );
    }

    const score = typeof data.score === "number" ? data.score : undefined;
    const ok = data.success === true && (score === undefined || score >= SCORE_THRESHOLD);
    return { ok, score };
  } catch (e) {
    // Google unreachable — fail open so real submissions aren't lost.
    console.error("[recaptcha] verification request failed", e);
    return { ok: true };
  }
}
