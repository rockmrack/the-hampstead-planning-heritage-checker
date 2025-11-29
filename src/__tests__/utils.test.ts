/**
 * Utility Functions Unit Tests
 * Tests for rate limiter, cache, and logger utilities
 */

import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';

describe('Rate Limiter', () => {
  describe('In-Memory Rate Limiter', () => {
    // Simple in-memory rate limiter implementation for testing
    const createRateLimiter = (maxRequests: number, windowMs: number) => {
      const requests = new Map<string, number[]>();

      return {
        check: (clientId: string): { allowed: boolean; remaining: number } => {
          const now = Date.now();
          const windowStart = now - windowMs;

          // Get existing requests for this client
          const clientRequests = requests.get(clientId) || [];

          // Filter to only requests within the window
          const validRequests = clientRequests.filter((time) => time > windowStart);

          if (validRequests.length >= maxRequests) {
            return { allowed: false, remaining: 0 };
          }

          // Add this request
          validRequests.push(now);
          requests.set(clientId, validRequests);

          return {
            allowed: true,
            remaining: maxRequests - validRequests.length,
          };
        },

        reset: (clientId: string) => {
          requests.delete(clientId);
        },

        clear: () => {
          requests.clear();
        },
      };
    };

    let rateLimiter: ReturnType<typeof createRateLimiter>;

    beforeEach(() => {
      rateLimiter = createRateLimiter(5, 60000); // 5 requests per minute
    });

    afterEach(() => {
      rateLimiter.clear();
    });

    it('should allow requests within limit', () => {
      const result = rateLimiter.check('client-1');
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(4);
    });

    it('should track remaining requests accurately', () => {
      for (let i = 0; i < 3; i++) {
        rateLimiter.check('client-2');
      }

      const result = rateLimiter.check('client-2');
      expect(result.remaining).toBe(1);
    });

    it('should block requests when limit exceeded', () => {
      // Make 5 requests (max allowed)
      for (let i = 0; i < 5; i++) {
        rateLimiter.check('client-3');
      }

      // 6th request should be blocked
      const result = rateLimiter.check('client-3');
      expect(result.allowed).toBe(false);
      expect(result.remaining).toBe(0);
    });

    it('should track clients independently', () => {
      // Max out client-4
      for (let i = 0; i < 5; i++) {
        rateLimiter.check('client-4');
      }

      // client-5 should still be allowed
      const result = rateLimiter.check('client-5');
      expect(result.allowed).toBe(true);
    });

    it('should reset client limits', () => {
      for (let i = 0; i < 5; i++) {
        rateLimiter.check('client-6');
      }

      rateLimiter.reset('client-6');

      const result = rateLimiter.check('client-6');
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(4);
    });
  });

  describe('Sliding Window Algorithm', () => {
    it('should properly calculate sliding window weights', () => {
      const windowMs = 60000;
      const now = Date.now();

      // Calculate weight for a timestamp in the middle of the window
      const calculateWeight = (timestamp: number): number => {
        const age = now - timestamp;
        if (age >= windowMs) return 0;
        return 1 - age / windowMs;
      };

      // Recent request should have high weight
      const recentWeight = calculateWeight(now - 1000); // 1 second ago
      expect(recentWeight).toBeGreaterThan(0.9);

      // Old request should have low weight
      const oldWeight = calculateWeight(now - 55000); // 55 seconds ago
      expect(oldWeight).toBeLessThan(0.1);

      // Expired request should have zero weight
      const expiredWeight = calculateWeight(now - 70000); // 70 seconds ago
      expect(expiredWeight).toBe(0);
    });
  });
});

describe('Cache', () => {
  describe('In-Memory Cache', () => {
    const createCache = () => {
      const store = new Map<string, { value: unknown; expiry: number }>();

      return {
        get: <T>(key: string): T | null => {
          const item = store.get(key);
          if (!item) return null;
          if (Date.now() > item.expiry) {
            store.delete(key);
            return null;
          }
          return item.value as T;
        },

        set: <T>(key: string, value: T, ttlSeconds: number): void => {
          store.set(key, {
            value,
            expiry: Date.now() + ttlSeconds * 1000,
          });
        },

        delete: (key: string): void => {
          store.delete(key);
        },

        clear: (): void => {
          store.clear();
        },

        size: (): number => {
          return store.size;
        },
      };
    };

    let cache: ReturnType<typeof createCache>;

    beforeEach(() => {
      cache = createCache();
    });

    afterEach(() => {
      cache.clear();
    });

    it('should store and retrieve values', () => {
      cache.set('test-key', { data: 'test' }, 60);
      const result = cache.get<{ data: string }>('test-key');
      expect(result?.data).toBe('test');
    });

    it('should return null for non-existent keys', () => {
      const result = cache.get('non-existent');
      expect(result).toBeNull();
    });

    it('should handle complex objects', () => {
      const complexObject = {
        status: 'GREEN',
        coordinates: { lat: 51.5, lng: -0.1 },
        tags: ['heritage', 'planning'],
        nested: { deep: { value: 42 } },
      };

      cache.set('complex', complexObject, 60);
      const result = cache.get<typeof complexObject>('complex');

      expect(result).toEqual(complexObject);
      expect(result?.nested.deep.value).toBe(42);
    });

    it('should delete specific keys', () => {
      cache.set('key1', 'value1', 60);
      cache.set('key2', 'value2', 60);

      cache.delete('key1');

      expect(cache.get('key1')).toBeNull();
      expect(cache.get('key2')).toBe('value2');
    });

    it('should track cache size', () => {
      expect(cache.size()).toBe(0);

      cache.set('key1', 'value1', 60);
      cache.set('key2', 'value2', 60);

      expect(cache.size()).toBe(2);
    });
  });

  describe('Cache Key Generation', () => {
    it('should generate unique keys for different inputs', () => {
      const generateKey = (prefix: string, ...parts: (string | number)[]): string => {
        return `${prefix}:${parts.join(':')}`;
      };

      const key1 = generateKey('property', 51.5074, -0.1278);
      const key2 = generateKey('property', 51.5075, -0.1278);
      const key3 = generateKey('property', 51.5074, -0.1279);

      expect(key1).not.toBe(key2);
      expect(key1).not.toBe(key3);
      expect(key2).not.toBe(key3);
    });

    it('should create deterministic keys', () => {
      const generateKey = (lat: number, lng: number): string => {
        // Round to 6 decimal places for consistency
        return `property:${lat.toFixed(6)}:${lng.toFixed(6)}`;
      };

      const key1 = generateKey(51.50740001, -0.12780001);
      const key2 = generateKey(51.50740002, -0.12780002);

      expect(key1).toBe(key2); // Should be same after rounding
    });
  });
});

describe('Logger', () => {
  describe('Structured Logging', () => {
    it('should include required fields in log entries', () => {
      const createLogEntry = (
        level: string,
        message: string,
        context: Record<string, unknown> = {}
      ) => ({
        timestamp: new Date().toISOString(),
        level,
        message,
        service: 'heritage-checker',
        ...context,
      });

      const entry = createLogEntry('info', 'Test message', { userId: '123' });

      expect(entry).toHaveProperty('timestamp');
      expect(entry).toHaveProperty('level');
      expect(entry).toHaveProperty('message');
      expect(entry).toHaveProperty('service');
      expect(entry.userId).toBe('123');
    });

    it('should support correlation IDs', () => {
      const createCorrelationId = (): string => {
        return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      };

      const correlationId = createCorrelationId();
      expect(correlationId).toMatch(/^\d+-[a-z0-9]+$/);
    });

    it('should sanitize sensitive data', () => {
      const sanitize = (data: Record<string, unknown>): Record<string, unknown> => {
        const sensitiveKeys = ['password', 'token', 'apiKey', 'secret', 'authorization'];
        const sanitized = { ...data };

        for (const key of Object.keys(sanitized)) {
          if (sensitiveKeys.some((sensitive) => key.toLowerCase().includes(sensitive))) {
            sanitized[key] = '[REDACTED]';
          }
        }

        return sanitized;
      };

      const data = {
        email: 'test@example.com',
        password: 'secret123',
        apiKey: 'abc123',
        name: 'John',
      };

      const sanitized = sanitize(data);

      expect(sanitized.email).toBe('test@example.com');
      expect(sanitized.name).toBe('John');
      expect(sanitized.password).toBe('[REDACTED]');
      expect(sanitized.apiKey).toBe('[REDACTED]');
    });
  });

  describe('Timer Utility', () => {
    it('should measure elapsed time accurately', async () => {
      const startTimer = (): (() => number) => {
        const start = performance.now();
        return () => Math.round(performance.now() - start);
      };

      const timer = startTimer();

      // Simulate some work
      await new Promise((resolve) => setTimeout(resolve, 50));

      const elapsed = timer();
      expect(elapsed).toBeGreaterThanOrEqual(45);
      expect(elapsed).toBeLessThan(100);
    });
  });
});

describe('Client Identifier Extraction', () => {
  it('should extract IP from X-Forwarded-For header', () => {
    const extractClientId = (headers: Record<string, string>): string => {
      const forwarded = headers['x-forwarded-for'];
      if (forwarded) {
        // Take the first IP if comma-separated
        return forwarded.split(',')[0].trim();
      }

      const realIp = headers['x-real-ip'];
      if (realIp) {
        return realIp;
      }

      return 'unknown';
    };

    expect(extractClientId({ 'x-forwarded-for': '203.0.113.1' })).toBe('203.0.113.1');
    expect(extractClientId({ 'x-forwarded-for': '203.0.113.1, 70.41.3.18' })).toBe('203.0.113.1');
    expect(extractClientId({ 'x-real-ip': '192.168.1.1' })).toBe('192.168.1.1');
    expect(extractClientId({})).toBe('unknown');
  });

  it('should hash client identifiers for privacy', () => {
    const hashClientId = (id: string): string => {
      // Simple hash simulation (in production use crypto.createHash)
      let hash = 0;
      for (let i = 0; i < id.length; i++) {
        const char = id.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash;
      }
      return Math.abs(hash).toString(16);
    };

    const hash1 = hashClientId('203.0.113.1');
    const hash2 = hashClientId('203.0.113.2');

    expect(hash1).not.toBe(hash2);
    expect(hash1.length).toBeGreaterThan(0);
  });
});

describe('Request Validation', () => {
  describe('Coordinate Validation', () => {
    const validateCoordinates = (lat: number, lng: number): boolean => {
      if (typeof lat !== 'number' || typeof lng !== 'number') return false;
      if (isNaN(lat) || isNaN(lng)) return false;
      if (lat < -90 || lat > 90) return false;
      if (lng < -180 || lng > 180) return false;
      return true;
    };

    it('should validate correct coordinates', () => {
      expect(validateCoordinates(51.5074, -0.1278)).toBe(true);
      expect(validateCoordinates(0, 0)).toBe(true);
      expect(validateCoordinates(-90, -180)).toBe(true);
      expect(validateCoordinates(90, 180)).toBe(true);
    });

    it('should reject invalid coordinates', () => {
      expect(validateCoordinates(91, 0)).toBe(false);
      expect(validateCoordinates(-91, 0)).toBe(false);
      expect(validateCoordinates(0, 181)).toBe(false);
      expect(validateCoordinates(0, -181)).toBe(false);
      expect(validateCoordinates(NaN, 0)).toBe(false);
    });
  });

  describe('Address Sanitization', () => {
    const sanitizeAddress = (address: string): string => {
      return address
        .trim()
        .replace(/\s+/g, ' ') // Normalize whitespace
        .replace(/<[^>]*>/g, '') // Remove HTML tags
        .substring(0, 500); // Limit length
    };

    it('should trim and normalize whitespace', () => {
      expect(sanitizeAddress('  123 High  Street  ')).toBe('123 High Street');
    });

    it('should remove HTML tags', () => {
      expect(sanitizeAddress('<script>alert("xss")</script>123 Main St')).toBe(
        'alert("xss")123 Main St'
      );
    });

    it('should limit address length', () => {
      const longAddress = 'A'.repeat(1000);
      expect(sanitizeAddress(longAddress).length).toBe(500);
    });
  });
});
