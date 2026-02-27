/**
 * Rate limiter em memória com janela deslizante.
 *
 * Uso:
 *   const limiter = createRateLimiter({ maxRequests: 5, windowMs: 60_000 });
 *   if (!limiter.allow()) throw new Error('Rate limit exceeded');
 */

interface RateLimiterOptions {
  maxRequests: number;
  windowMs: number;
}

interface RateLimiter {
  allow(): boolean;
  remaining(): number;
  reset(): void;
}

export function createRateLimiter(opts: RateLimiterOptions): RateLimiter {
  const { maxRequests, windowMs } = opts;
  let timestamps: number[] = [];

  function prune() {
    const now = Date.now();
    timestamps = timestamps.filter((t) => now - t < windowMs);
  }

  return {
    allow() {
      prune();
      if (timestamps.length >= maxRequests) return false;
      timestamps.push(Date.now());
      return true;
    },
    remaining() {
      prune();
      return Math.max(0, maxRequests - timestamps.length);
    },
    reset() {
      timestamps = [];
    },
  };
}
