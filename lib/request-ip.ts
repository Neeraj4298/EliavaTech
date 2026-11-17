import { isIP } from "node:net";

/**
 * Client IP detection for rate limiting.
 *
 * `X-Forwarded-For` is a plain request header: any visitor can send a fake one,
 * so reading its first value lets a bot dodge rate limits by rotating it.
 * We only trust headers that the hosting platform sets or overwrites:
 *
 * 1. `TRUSTED_IP_HEADER` - name of a header your proxy/CDN always overwrites
 *    (for example `cf-connecting-ip` behind Cloudflare, or `x-real-ip`).
 * 2. On Vercel (`VERCEL` is set) - `x-real-ip` / `x-vercel-forwarded-for`,
 *    which Vercel overwrites on every request.
 * 3. `TRUSTED_PROXY_COUNT` - number of trusted proxies in front of the app.
 *    The client address is then taken from the right-hand side of
 *    `X-Forwarded-For`, where only our own proxies can have written entries.
 *
 * Anything else returns "unknown" instead of a spoofable value.
 */
function validIp(value: string | null | undefined): string | null {
  const candidate = (value ?? "").trim();
  return candidate && isIP(candidate) ? candidate : null;
}

export function getClientIp(req: { headers: Headers }): string {
  const headers = req.headers;

  const trustedHeader = process.env.TRUSTED_IP_HEADER?.trim().toLowerCase();
  if (trustedHeader) {
    const ip = validIp(headers.get(trustedHeader)?.split(",")[0]);
    if (ip) return ip;
  }

  if (process.env.VERCEL) {
    const ip =
      validIp(headers.get("x-real-ip")) ??
      validIp(headers.get("x-vercel-forwarded-for")?.split(",")[0]);
    if (ip) return ip;
  }

  const trustedProxies = Number.parseInt(process.env.TRUSTED_PROXY_COUNT ?? "0", 10);
  if (Number.isFinite(trustedProxies) && trustedProxies > 0) {
    const chain = (headers.get("x-forwarded-for") ?? "")
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean);
    const ip = validIp(chain[chain.length - trustedProxies]);
    if (ip) return ip;
  }

  return "unknown";
}
