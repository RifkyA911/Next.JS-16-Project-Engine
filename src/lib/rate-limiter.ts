import { NextRequest, NextResponse } from "next/server";
import { logError } from "@/lib/logger";

// Rate limiting configuration from environment variables
const RATE_LIMIT_ENABLED = process.env.RATE_LIMIT_ENABLED === 'true';
const RATE_LIMIT_GENERAL_MAX = parseInt(process.env.RATE_LIMIT_GENERAL_MAX || '100', 10);
const RATE_LIMIT_GENERAL_WINDOW_MS = parseInt(process.env.RATE_LIMIT_GENERAL_WINDOW_MS || '900000', 10);
const RATE_LIMIT_AUTH_MAX = parseInt(process.env.RATE_LIMIT_AUTH_MAX || '5', 10);
const RATE_LIMIT_AUTH_WINDOW_MS = parseInt(process.env.RATE_LIMIT_AUTH_WINDOW_MS || '900000', 10);
const RATE_LIMIT_API_MAX = parseInt(process.env.RATE_LIMIT_API_MAX || '30', 10);
const RATE_LIMIT_API_WINDOW_MS = parseInt(process.env.RATE_LIMIT_API_WINDOW_MS || '60000', 10);

// Simple in-memory rate limiter for demo purposes
// In production, use Redis or similar for distributed rate limiting
class InMemoryRateLimiter {
  private requests: Map<string, { count: number; resetTime: number }> = new Map();

  constructor(
    private windowMs: number = 15 * 60 * 1000, // 15 minutes
    private maxRequests: number = 100 // 100 requests per window
  ) {}

  isAllowed(identifier: string): { allowed: boolean; remaining: number; resetTime: number } {
    const now = Date.now();
    const key = identifier;
    const existing = this.requests.get(key);

    if (!existing || now > existing.resetTime) {
      // Reset or create new window
      this.requests.set(key, {
        count: 1,
        resetTime: now + this.windowMs,
      });
      return {
        allowed: true,
        remaining: this.maxRequests - 1,
        resetTime: now + this.windowMs,
      };
    }

    if (existing.count >= this.maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: existing.resetTime,
      };
    }

    existing.count++;
    return {
      allowed: true,
      remaining: this.maxRequests - existing.count,
      resetTime: existing.resetTime,
    };
  }

  // Cleanup old entries periodically
  cleanup(): void {
    const now = Date.now();
    for (const [key, value] of this.requests.entries()) {
      if (now > value.resetTime) {
        this.requests.delete(key);
      }
    }
  }
}

// Create different limiters for different use cases
export const generalLimiter = new InMemoryRateLimiter(RATE_LIMIT_GENERAL_WINDOW_MS, RATE_LIMIT_GENERAL_MAX);
export const authLimiter = new InMemoryRateLimiter(RATE_LIMIT_AUTH_WINDOW_MS, RATE_LIMIT_AUTH_MAX);
export const apiLimiter = new InMemoryRateLimiter(RATE_LIMIT_API_WINDOW_MS, RATE_LIMIT_API_MAX);

// Cleanup old entries every 5 minutes
setInterval(() => {
  generalLimiter.cleanup();
  authLimiter.cleanup();
  apiLimiter.cleanup();
}, 5 * 60 * 1000);

// Helper function to get client identifier
function getClientIdentifier(req: NextRequest): string {
  // Try to get real IP, fallback to user agent, then to a generic identifier
  const forwarded = req.headers.get("x-forwarded-for");
  const realIp = forwarded?.split(",")[0]?.trim();
  const userAgent = req.headers.get("user-agent") || "unknown";
  
  return realIp || userAgent || "anonymous";
}

// Rate limiting middleware for API routes
export function createRateLimitMiddleware(limiter: InMemoryRateLimiter) {
  return async (req: NextRequest): Promise<NextResponse | undefined> => {
    // Check if rate limiting is enabled
    if (!RATE_LIMIT_ENABLED) {
      return undefined;
    }

    const identifier = getClientIdentifier(req);
    const result = limiter.isAllowed(identifier);

    // Add rate limit headers
    const headers = new Headers({
      "X-RateLimit-Limit": limiter["maxRequests"].toString(),
      "X-RateLimit-Remaining": result.remaining.toString(),
      "X-RateLimit-Reset": new Date(result.resetTime).toISOString(),
    });

    if (!result.allowed) {
      logError(`Rate limit exceeded for ${identifier}`, 'rate-limit');
      return NextResponse.json(
        { 
          error: "Too many requests",
          message: "Rate limit exceeded. Please try again later.",
          retryAfter: Math.ceil((result.resetTime - Date.now()) / 1000)
        },
        { 
          status: 429,
          headers: {
            ...headers,
            "Retry-After": Math.ceil((result.resetTime - Date.now()) / 1000).toString(),
          }
        }
      );
    }

    // Return undefined to continue to next middleware
    return undefined;
  };
}
