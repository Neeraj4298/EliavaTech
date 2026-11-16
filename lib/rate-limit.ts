interface RateLimitBucket {
  timestamps: number[];
}

const buckets = new Map<string, RateLimitBucket>();
const MAX_TRACKED_KEYS = 5000;
let lastSweep = 0;

/** Drop buckets whose timestamps have all expired so the Map cannot grow unbounded. */
function sweepExpired(now: number, windowMs: number) {
  if (now - lastSweep < 60_000 && buckets.size < MAX_TRACKED_KEYS) return;
  lastSweep = now;
  for (const [key, bucket] of buckets) {
    const newest = bucket.timestamps[bucket.timestamps.length - 1] ?? 0;
    if (newest <= now - windowMs) buckets.delete(key);
  }
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

/**
 * Sliding-window per-IP rate limiter for API routes (/api/contact and /api/chat).
 */
export function checkRateLimit(
  key: string,
  limit = 5,
  windowMs = 10 * 60 * 1000
): RateLimitResult {
  const now = Date.now();
  const cutoff = now - windowMs;
  sweepExpired(now, windowMs);

  const existing = buckets.get(key) ?? { timestamps: [] };
  const validTimestamps = existing.timestamps.filter((ts) => ts > cutoff);

  if (validTimestamps.length >= limit) {
    const oldest = validTimestamps[0] ?? now;
    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((oldest + windowMs - now) / 1000)
    );
    buckets.set(key, { timestamps: validTimestamps });
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds,
    };
  }

  validTimestamps.push(now);
  buckets.set(key, { timestamps: validTimestamps });

  return {
    allowed: true,
    remaining: Math.max(0, limit - validTimestamps.length),
    retryAfterSeconds: 0,
  };
}
