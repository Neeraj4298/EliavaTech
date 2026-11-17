export type TurnstileResult =
  | { ok: true }
  | { ok: false; reason: "missing_secret" | "missing_token" | "rejected" | "unavailable" };

/**
 * Verifies a Cloudflare Turnstile token on the server.
 *
 * Production never skips verification: if TURNSTILE_SECRET_KEY is missing the
 * request is refused (fail closed) and the misconfiguration is logged.
 * Outside production a missing secret skips the check so local development
 * works without Cloudflare keys.
 */
export async function verifyTurnstile(
  token: string | undefined,
  ip: string
): Promise<TurnstileResult> {
  const secret = process.env.TURNSTILE_SECRET_KEY?.trim();

  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      console.error(
        "[turnstile] TURNSTILE_SECRET_KEY is not set in production: refusing form submissions."
      );
      return { ok: false, reason: "missing_secret" };
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
        signal: AbortSignal.timeout(5000),
      }
    );
    if (!res.ok) return { ok: false, reason: "unavailable" };
    const data = (await res.json()) as { success?: boolean };
    return data.success ? { ok: true } : { ok: false, reason: "rejected" };
  } catch (err) {
    console.error("[turnstile] Verification request failed:", err);
    return { ok: false, reason: "unavailable" };
  }
}
