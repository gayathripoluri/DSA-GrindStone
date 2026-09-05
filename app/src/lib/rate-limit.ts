import { NextRequest } from "next/server";

/**
 * In-memory, per-process rate limiter — deliberately simple (no Redis/external
 * store). Fine for a single-instance deployment; if this app is ever scaled
 * to multiple server processes/instances behind a load balancer, each
 * instance would track its own counts independently and the effective limit
 * becomes (perInstanceLimit × instanceCount) — acceptable slack for abuse
 * prevention, but worth knowing if you ever look at this expecting a global
 * cap.
 */

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

// Periodic sweep so `buckets` doesn't grow forever as distinct IPs show up.
setInterval(() => {
  const now = Date.now();
  for (const [key, bucket] of buckets) {
    if (now >= bucket.resetAt) buckets.delete(key);
  }
}, 60_000).unref();

export function rateLimit(
  key: string,
  opts: { limit: number; windowMs: number }
): { allowed: boolean; retryAfterSeconds: number } {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now >= bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + opts.windowMs });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (bucket.count >= opts.limit) {
    return { allowed: false, retryAfterSeconds: Math.ceil((bucket.resetAt - now) / 1000) };
  }

  bucket.count++;
  return { allowed: true, retryAfterSeconds: 0 };
}

/**
 * Best-effort client identifier. Trusts `x-forwarded-for` (set by a real
 * reverse proxy in front of this app in production); with no proxy — e.g.
 * local dev — everything falls back to one shared key, which is fine since
 * that's not the scenario this defends.
 */
export function clientKey(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return "local";
}
