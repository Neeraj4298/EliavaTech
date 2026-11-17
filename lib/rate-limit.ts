/**
 * Rate limiting for API routes (/api/contact and /api/chat).
 *
 * Production: set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN to use a
 * shared Redis (Upstash REST API, works on serverless/Vercel with no extra
 * package). All server instances then share the same counters.
 *
 * Without Redis (local development) or if Redis is unreachable, the limiter
 * falls back to a per-instance in-memory window so the API still works.
 */
export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

/* ------------------------------ in-memory ------------------------------ */

interface RateLimitBucket {
  timestamps: number[];
}

const buckets = new Map<string, RateLimitBucket>();
const MAX_TRACKED_KEYS = 5000;
let lastSweep = 0;

function sweepExpired(now: number, windowMs: number) {
  if (now - lastSweep < 60_000 && buckets.size < MAX_TRACKED_KEYS) return;
  lastSweep = now;
  for (const [key, bucket] of buckets) {
    const newest = bucket.timestamps[bucket.timestamps.length - 1] ?? 0;
    if (newest <= now - windowMs) buckets.delete(key);
  }
}

function checkMemoryRateLimit(
  key: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now();
  const cutoff = now - windowMs;
  sweepExpired(now, windowMs);

  const existing = buckets.get(key) ?? { timestamps: [] };
  const valid = existing.timestamps.filter((ts) => ts > cutoff);

  if (valid.length >= limit) {
    const oldest = valid[0] ?? now;
    buckets.set(key, { timestamps: valid });
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: Math.max(1, Math.ceil((oldest + windowMs - now) / 1000)),
    };
  }

  valid.push(now);
  buckets.set(key, { timestamps: valid });
  return {
    allowed: true,
    remaining: Math.max(0, limit - valid.length),
    retryAfterSeconds: 0,
  };
}

/* -------------------------------- Redis -------------------------------- */

let warnedNoRedis = false;

async function checkRedisRateLimit(
  url: string,
  token: string,
  key: string,
  limit: number,
  windowMs: number
): Promise<RateLimitResult> {
  const redisKey = `ratelimit:${key}`;
  // Fixed window: INCR, set the expiry only on the first hit, read the TTL.
  const res = await fetch(`${url.replace(/\/$/, "")}/pipeline`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify([
      ["INCR", redisKey],
      ["PEXPIRE", redisKey, String(windowMs), "NX"],
      ["PTTL", redisKey],
    ]),
    signal: AbortSignal.timeout(2500),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Redis responded ${res.status}`);

  const data = (await res.json()) as Array<{ result?: number; error?: string }>;
  const count = Number(data?.[0]?.result);
  const ttlMs = Number(data?.[2]?.result);
  if (!Number.isFinite(count)) {
    throw new Error(data?.[0]?.error || "Unexpected Redis response");
  }

  if (count > limit) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: Math.max(1, Math.ceil((ttlMs > 0 ? ttlMs : windowMs) / 1000)),
    };
  }
  return { allowed: true, remaining: Math.max(0, limit - count), retryAfterSeconds: 0 };
}

/* -------------------------------- public ------------------------------- */

/**
 * `ip` is the client address from `getClientIp`. When it is "unknown" (no
 * trusted proxy header configured) every visitor would share one bucket, so a
 * single bot could lock everyone out. That shared bucket gets a much higher
 * ceiling: it still stops floods but cannot trivially block real visitors.
 */
export const UNKNOWN_IP_LIMIT_MULTIPLIER = 20;

export async function checkRateLimit(
  key: string,
  limit = 5,
  windowMs = 10 * 60 * 1000,
  ip?: string
): Promise<RateLimitResult> {
  if (ip === "unknown") limit *= UNKNOWN_IP_LIMIT_MULTIPLIER;
  const url = process.env.UPSTASH_REDIS_REST_URL?.trim();
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();

  if (url && token) {
    try {
      return await checkRedisRateLimit(url, token, key, limit, windowMs);
    } catch (err) {
      console.error("[rate-limit] Redis unavailable, using in-memory fallback:", err);
    }
  } else if (process.env.NODE_ENV === "production" && !warnedNoRedis) {
    warnedNoRedis = true;
    console.warn(
      "[rate-limit] UPSTASH_REDIS_REST_URL/TOKEN not set: using per-instance in-memory limits. Configure Redis for a shared limit in production."
    );
  }

  return checkMemoryRateLimit(key, limit, windowMs);
}
