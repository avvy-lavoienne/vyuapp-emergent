import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// 5 requests per hour per IP for contact
export const contactLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "1 h"),
  analytics: true,
});

// 3 requests per hour per IP for discovery
export const discoveryLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, "1 h"),
  analytics: true,
});
