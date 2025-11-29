/**
 * Distributed Cache
 * Redis-backed caching with in-memory fallback
 */

import { getRedisClient } from '@/lib/redis';
import { logger } from './logger';

// In-memory fallback cache
interface CacheEntry<T> {
  value: T;
  expiry: number;
}

class MemoryCacheStore {
  private cache: Map<string, CacheEntry<unknown>> = new Map();
  private cleanupInterval: ReturnType<typeof setInterval> | null = null;
  private readonly maxEntries: number = 10000;

  constructor() {
    // Clean up expired entries every 5 minutes
    if (typeof window === 'undefined') {
      this.cleanupInterval = setInterval(() => {
        this.cleanup();
      }, 300000);
    }
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key) as CacheEntry<T> | undefined;
    
    if (!entry) {
      return null;
    }

    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      return null;
    }

    return entry.value;
  }

  set<T>(key: string, value: T, ttlSeconds: number): void {
    // Enforce max entries to prevent memory leak
    if (this.cache.size >= this.maxEntries) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }

    const expiry = Date.now() + (ttlSeconds * 1000);
    this.cache.set(key, { value, expiry });
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;
    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      return false;
    }
    return true;
  }

  private cleanup(): void {
    const now = Date.now();
    let deleted = 0;
    
    for (const [key, entry] of this.cache.entries()) {
      if (entry.expiry < now) {
        this.cache.delete(key);
        deleted++;
      }
    }
    
    if (deleted > 0) {
      logger.debug('Cache cleanup', { deleted, remaining: this.cache.size });
    }
  }

  clear(): void {
    this.cache.clear();
  }

  getStats(): { size: number } {
    return { size: this.cache.size };
  }
}

const memoryCache = new MemoryCacheStore();

/**
 * Distributed Cache Implementation
 */
class DistributedCache {
  private readonly prefix: string = 'cache';

  /**
   * Get a value from cache (async - uses Redis if available)
   */
  async getAsync<T>(key: string): Promise<T | null> {
    const fullKey = `${this.prefix}:${key}`;
    
    const redis = await getRedisClient();
    if (redis) {
      try {
        const value = await redis.get(fullKey);
        if (value) {
          return JSON.parse(value) as T;
        }
        return null;
      } catch (error) {
        logger.error('Redis cache get error', {
          key,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    return memoryCache.get<T>(fullKey);
  }

  /**
   * Get a value from cache (sync - memory only)
   */
  get<T>(key: string): T | null {
    const fullKey = `${this.prefix}:${key}`;
    return memoryCache.get<T>(fullKey);
  }

  /**
   * Set a value in cache (async - uses Redis if available)
   */
  async setAsync<T>(key: string, value: T, ttlSeconds: number): Promise<void> {
    const fullKey = `${this.prefix}:${key}`;
    
    // Always set in memory for fast reads
    memoryCache.set(fullKey, value, ttlSeconds);

    const redis = await getRedisClient();
    if (redis) {
      try {
        await redis.set(fullKey, JSON.stringify(value), { EX: ttlSeconds });
      } catch (error) {
        logger.error('Redis cache set error', {
          key,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }
  }

  /**
   * Set a value in cache (sync - memory only)
   */
  set<T>(key: string, value: T, ttlSeconds: number): void {
    const fullKey = `${this.prefix}:${key}`;
    memoryCache.set(fullKey, value, ttlSeconds);
  }

  /**
   * Delete a value from cache
   */
  async deleteAsync(key: string): Promise<boolean> {
    const fullKey = `${this.prefix}:${key}`;
    
    memoryCache.delete(fullKey);

    const redis = await getRedisClient();
    if (redis) {
      try {
        await redis.del(fullKey);
        return true;
      } catch (error) {
        logger.error('Redis cache delete error', {
          key,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    return true;
  }

  /**
   * Delete a value from cache (sync - memory only)
   */
  delete(key: string): boolean {
    const fullKey = `${this.prefix}:${key}`;
    return memoryCache.delete(fullKey);
  }

  /**
   * Delete keys matching a pattern
   */
  async deletePatternAsync(pattern: string): Promise<number> {
    const fullPattern = `${this.prefix}:${pattern}`;
    let deleted = 0;

    const redis = await getRedisClient();
    if (redis) {
      try {
        const keys = await redis.keys(fullPattern.replace('*', '*'));
        if (keys.length > 0) {
          await redis.del(keys);
          deleted = keys.length;
        }
      } catch (error) {
        logger.error('Redis cache deletePattern error', {
          pattern,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    return deleted;
  }

  /**
   * Check if key exists
   */
  async hasAsync(key: string): Promise<boolean> {
    const fullKey = `${this.prefix}:${key}`;
    
    const redis = await getRedisClient();
    if (redis) {
      try {
        const exists = await redis.exists(fullKey);
        return exists > 0;
      } catch (error) {
        logger.error('Redis cache has error', {
          key,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    return memoryCache.has(fullKey);
  }

  /**
   * Get or set pattern - returns cached value or computes and caches it
   */
  async getOrSet<T>(
    key: string,
    factory: () => Promise<T>,
    ttlSeconds: number
  ): Promise<T> {
    const cached = await this.getAsync<T>(key);
    if (cached !== null) {
      return cached;
    }

    const value = await factory();
    await this.setAsync(key, value, ttlSeconds);
    return value;
  }

  /**
   * Clear all cache entries
   */
  async clear(): Promise<void> {
    memoryCache.clear();
    
    const redis = await getRedisClient();
    if (redis) {
      try {
        const keys = await redis.keys(`${this.prefix}:*`);
        if (keys.length > 0) {
          await redis.del(keys);
        }
      } catch (error) {
        logger.error('Redis cache clear error', {
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }
  }

  /**
   * Get cache statistics
   */
  getStats(): { memorySize: number } {
    return {
      memorySize: memoryCache.getStats().size,
    };
  }
}

// Singleton instance
export const cache = new DistributedCache();

// Cache key generators with proper precision
export const cacheKeys = {
  geocoding: (address: string) => `geocoding:${address.toLowerCase().trim()}`,
  // Use 5 decimal places for ~1m precision, avoiding floating point issues
  propertyCheck: (lat: number, lng: number) => 
    `property:${Math.round(lat * 100000)}:${Math.round(lng * 100000)}`,
  conservationArea: (id: number | string) => `conservation:${id}`,
  listedBuilding: (id: number | string) => `listed:${id}`,
  conservationAreaGeoJson: (id: number | string) => `conservation:geojson:${id}`,
  allConservationAreas: () => 'conservation:all',
  allListedBuildings: () => 'listed:all',
  session: (sessionId: string) => `session:${sessionId}`,
  user: (userId: string) => `user:${userId}`,
};

// Cache TTL constants (in seconds)
export const cacheTTL = {
  geocoding: 86400, // 24 hours
  propertyCheck: 3600, // 1 hour
  conservationArea: 86400, // 24 hours
  listedBuilding: 86400, // 24 hours
  geoJson: 3600, // 1 hour
  allData: 7200, // 2 hours
  session: 86400, // 24 hours
  user: 3600, // 1 hour
};

export default cache;
