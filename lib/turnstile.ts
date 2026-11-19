export type TurnstileResult =
  | { ok: true }
  | { ok: false; reason: "missing_token" | "rejected" | "unavailable" };

let warnedUnconfigured = false;

function cleanEnv(value: string | undefined): string {
  return (value ?? "").trim().replace(/^["']|["']$/g, "");
}

/**
 * Verifies a Cloudflare Turnstile token on the server.
 *
 * Verification is enforced only when BOTH `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
 * (so the client widget actually renders) and `TURNSTILE_SECRET_KEY` are
 * configured. When either key is absent, verification is skipped so forms
 * continue to work in production (still protected by rate limiting, schema
 * validation and the honeypot field).
 */
const DEFAULT_TURNSTILE_SITE_KEY = "0x4AAAAAAGIXyivKpESd5hg3";

export async function verifyTurnstile(
  token: string | undefined,
  ip: string
): Promise<TurnstileResult> {
  const secret = cleanEnv(
    process.env.TURNSTILE_SECRET_KEY || process.env.TURNSTILE_SECRET
  );
  const siteKey =
    cleanEnv(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY) ||
    DEFAULT_TURNSTILE_SITE_KEY;

  if (!secret || !siteKey) {
    if (process.env.NODE_ENV === "production" && !warnedUnconfigured) {
      warnedUnconfigured = true;
      console.warn(
        "[turnstile] TURNSTILE_SECRET_KEY is not set: skipping Turnstile check."
      );
    }
    return { ok: true };
  }

  if (!token) return { ok: false, reason: "missing_token" };

  try {
    const body = new URLSearchParams({ secret, response: token });
    if (ip !== "unknown") body.append("remoteip", ip);

    const res = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
        signal: AbortSignal.timeout(10_000),
      }
    );
    if (!res.ok) return { ok: false, reason: "unavailable" };
    const data = (await res.json()) as {
      success?: boolean;
      "error-codes"?: string[];
    };
    if (!data.success) {
      console.warn("[turnstile] Verification rejected:", data["error-codes"]);
      return { ok: false, reason: "rejected" };
    }
    return { ok: true };
  } catch (err) {
    console.error("[turnstile] Verification request failed:", err);
    return { ok: false, reason: "unavailable" };
  }
}
