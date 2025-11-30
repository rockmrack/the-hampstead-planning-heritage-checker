/**
 * Distributed Rate Limiter
 * Redis-backed rate limiting with in-memory fallback
 * Uses sliding window algorithm for accurate rate limiting
 */

import { getRedisClient } from '@/lib/redis';
import { logger } from './logger';

// In-memory fallback store
interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const inMemoryStore = new Map<string, RateLimitEntry>();
const MAX_MEMORY_ENTRIES = 10000; // Prevent memory leak

// Periodic cleanup for in-memory store
const CLEANUP_INTERVAL = 60000; // 1 minute
let cleanupTimer: ReturnType<typeof setInterval> | null = null;

function startCleanup(): void {
  if (cleanupTimer || typeof window !== 'undefined') {
    return; // Don't start cleanup in browser or if already running
  }

  cleanupTimer = setInterval(() => {
    const now = Date.now();
    let deleted = 0;
    
    for (const [key, entry] of Array.from(inMemoryStore.entries())) {
      if (entry.resetTime < now) {
        inMemoryStore.delete(key);
        deleted++;
      }
    }
    
    // Also enforce max entries limit
    if (inMemoryStore.size > MAX_MEMORY_ENTRIES) {
      const entriesToDelete = inMemoryStore.size - MAX_MEMORY_ENTRIES;
      const keys = Array.from(inMemoryStore.keys()).slice(0, entriesToDelete);
      keys.forEach(key => inMemoryStore.delete(key));
      deleted += entriesToDelete;
    }
    
    if (deleted > 0) {
      logger.debug('Rate limiter cleanup', { deleted, remaining: inMemoryStore.size });
    }
  }, CLEANUP_INTERVAL);
}

// Start cleanup on module load (server-side only)
if (typeof window === 'undefined') {
  startCleanup();
}

export interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  keyPrefix?: string;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
  retryAfter?: number;
  limit: number;
}

/**
 * Check rate limit using Redis (with in-memory fallback)
 * Uses sliding window counter algorithm
 */
export async function checkRateLimitAsync(
  identifier: string,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  const redis = await getRedisClient();
  
  if (redis) {
    return checkRateLimitRedis(redis, identifier, config);
  }
  
  return checkRateLimitMemory(identifier, config);
}

/**
 * Synchronous rate limit check (in-memory only)
 * For use in middleware where async is problematic
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  return checkRateLimitMemory(identifier, config);
}

/**
 * Redis-based rate limiting with sliding window
 */
async function checkRateLimitRedis(
  redis: Awaited<ReturnType<typeof getRedisClient>>,
  identifier: string,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  if (!redis) {
    return checkRateLimitMemory(identifier, config);
  }

  const key = `${config.keyPrefix ?? 'ratelimit'}:${identifier}`;
  const now = Date.now();
  const windowStart = now - config.windowMs;
  
  try {
    // Use Redis transaction for atomic operations
    const multi = redis.multi();
    
    // Remove old entries outside the window
    multi.zRemRangeByScore(key, 0, windowStart);
    
    // Count current requests in window
    multi.zCard(key);
    
    // Add current request
    multi.zAdd(key, { score: now, value: `${now}-${Math.random()}` });
    
    // Set expiry on the key
    multi.expire(key, Math.ceil(config.windowMs / 1000) + 1);
    
    const results = await multi.exec();
    const currentCount = (results?.[1] as number) ?? 0;
    
    const resetTime = now + config.windowMs;
    const allowed = currentCount < config.maxRequests;
    
    if (!allowed) {
      // Remove the request we just added since it's not allowed
      await redis.zRemRangeByScore(key, now, now + 1);
    }
    
    return {
      allowed,
      remaining: Math.max(0, config.maxRequests - currentCount - 1),
      resetTime,
      retryAfter: allowed ? undefined : Math.ceil(config.windowMs / 1000),
      limit: config.maxRequests,
    };
  } catch (error) {
    logger.error('Redis rate limit error, falling back to memory', {
      error: error instanceof Error ? error.message : String(error),
    });
    return checkRateLimitMemory(identifier, config);
  }
}

/**
 * In-memory rate limiting (fallback)
 */
function checkRateLimitMemory(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  const key = `${config.keyPrefix ?? 'ratelimit'}:${identifier}`;
  const now = Date.now();
  const entry = inMemoryStore.get(key);

  // No existing entry or expired entry
  if (!entry || entry.resetTime < now) {
    const resetTime = now + config.windowMs;
    inMemoryStore.set(key, { count: 1, resetTime });
    
    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetTime,
      limit: config.maxRequests,
    };
  }

  // Entry exists and hasn't expired
  if (entry.count >= config.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.resetTime,
      retryAfter: Math.ceil((entry.resetTime - now) / 1000),
      limit: config.maxRequests,
    };
  }

  // Increment count
  entry.count++;
  inMemoryStore.set(key, entry);

  return {
    allowed: true,
    remaining: config.maxRequests - entry.count,
    resetTime: entry.resetTime,
    limit: config.maxRequests,
  };
}

/**
 * Get client identifier from request
 * Properly handles proxy headers with trust configuration
 */
export function getClientIdentifier(
  request: Request,
  options: { trustProxy?: boolean } = {}
): string {
  const { trustProxy = process.env['NODE_ENV'] === 'production' } = options;

  if (trustProxy) {
    // In production with trusted proxy, use forwarded headers
    const forwardedFor = request.headers.get('x-forwarded-for');
    if (forwardedFor) {
      // Take the first (original client) IP in the chain
      const clientIp = forwardedFor.split(',')[0]?.trim();
      if (clientIp && isValidIp(clientIp)) {
        return clientIp;
      }
    }

    const realIp = request.headers.get('x-real-ip');
    if (realIp && isValidIp(realIp)) {
      return realIp;
    }
  }

  // Cloudflare specific header
  const cfConnectingIp = request.headers.get('cf-connecting-ip');
  if (cfConnectingIp && isValidIp(cfConnectingIp)) {
    return cfConnectingIp;
  }

  // Fallback to user agent hash
  const userAgent = request.headers.get('user-agent') ?? '';
  const acceptLanguage = request.headers.get('accept-language') ?? '';
  return `ua:${hashString(userAgent + acceptLanguage)}`;
}

/**
 * Validate IP address format
 */
function isValidIp(ip: string): boolean {
  // IPv4
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
  // IPv6 (simplified)
  const ipv6Regex = /^([0-9a-fA-F]{0,4}:){2,7}[0-9a-fA-F]{0,4}$/;
  
  return ipv4Regex.test(ip) || ipv6Regex.test(ip);
}

/**
 * Simple string hash function
 */
function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16);
}

/**
 * Clear rate limit for a specific identifier
 */
export async function clearRateLimit(identifier: string, config: RateLimitConfig): Promise<void> {
  const key = `${config.keyPrefix ?? 'ratelimit'}:${identifier}`;
  
  // Clear from memory
  inMemoryStore.delete(key);
  
  // Clear from Redis
  const redis = await getRedisClient();
  if (redis) {
    try {
      await redis.del(key);
    } catch (error) {
      logger.error('Failed to clear rate limit from Redis', {
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }
}

/**
 * Rate limit configuration presets
 */
export const DEFAULT_RATE_LIMIT: RateLimitConfig = {
  maxRequests: 60,
  windowMs: 60000, // 1 minute
  keyPrefix: 'rl:default',
};

export const STRICT_RATE_LIMIT: RateLimitConfig = {
  maxRequests: 10,
  windowMs: 60000, // 1 minute
  keyPrefix: 'rl:strict',
};

export const RELAXED_RATE_LIMIT: RateLimitConfig = {
  maxRequests: 100,
  windowMs: 60000, // 1 minute
  keyPrefix: 'rl:relaxed',
};

export const AUTH_RATE_LIMIT: RateLimitConfig = {
  maxRequests: 5,
  windowMs: 300000, // 5 minutes
  keyPrefix: 'rl:auth',
};

export const API_RATE_LIMIT: RateLimitConfig = {
  maxRequests: 100,
  windowMs: 60000, // 1 minute
  keyPrefix: 'rl:api',
};
