/**
 * Redis Client Configuration
 * Singleton Redis client for distributed caching and rate limiting
 */

import { logger } from '../utils/logger';

// Multi chain interface for Redis transactions
interface RedisMultiChain {
  zAdd(key: string, options: { score: number; value: string }): RedisMultiChain;
  zRemRangeByScore(key: string, min: number, max: number): RedisMultiChain;
  zCard(key: string): RedisMultiChain;
  expire(key: string, seconds: number): RedisMultiChain;
  exec(): Promise<unknown[]>;
  // Allow other chained methods
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

// Define the Redis client type with all methods needed
// Using index signature to allow any Redis method
interface RedisClientType {
  isReady: boolean;
  connect(): Promise<void>;
  quit(): Promise<void>;
  ping(): Promise<string>;
  on(event: string, callback: (...args: unknown[]) => void): void;
  // Common Redis commands
  get(key: string): Promise<string | null>;
  set(key: string, value: string, options?: { EX?: number }): Promise<void>;
  del(key: string | string[]): Promise<number>;
  keys(pattern: string): Promise<string[]>;
  exists(key: string): Promise<number>;
  incr(key: string): Promise<number>;
  expire(key: string, seconds: number): Promise<boolean>;
  multi(): RedisMultiChain;
  zRemRangeByScore(key: string, min: number, max: number): Promise<number>;
  zCard(key: string): Promise<number>;
  // Allow other methods
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let redisModule: any = null;
let redisClient: RedisClientType | null = null;
let isConnecting = false;
let connectionPromise: Promise<RedisClientType | null> | null = null;

/**
 * Get the Redis client singleton
 * Creates connection if not exists
 */
export async function getRedisClient(): Promise<RedisClientType | null> {
  // Return existing client if connected
  if (redisClient?.isReady) {
    return redisClient;
  }

  // Return existing connection promise if connecting
  if (isConnecting && connectionPromise) {
    return connectionPromise;
  }

  const redisUrl = process.env['REDIS_URL'];
  
  // If no Redis URL configured, return null (fallback to in-memory)
  if (!redisUrl) {
    logger.warn('REDIS_URL not configured, using in-memory fallback');
    return null;
  }

  isConnecting = true;

  connectionPromise = (async (): Promise<RedisClientType | null> => {
    try {
      // Dynamically import redis module
      if (!redisModule) {
        try {
          redisModule = await import('redis');
        } catch {
          logger.warn('Redis module not installed, using in-memory fallback');
          return null;
        }
      }

      const client = redisModule.createClient({
        url: redisUrl,
        socket: {
          reconnectStrategy: (retries: number) => {
            if (retries > 10) {
              logger.error('Redis max reconnection attempts reached');
              return new Error('Max reconnection attempts reached');
            }
            return Math.min(retries * 100, 3000);
          },
          connectTimeout: 10000,
        },
      });

      client.on('error', (err: Error) => {
        logger.error('Redis Client Error', { error: err.message });
      });

      client.on('connect', () => {
        logger.info('Redis client connected');
      });

      client.on('ready', () => {
        logger.info('Redis client ready');
      });

      client.on('reconnecting', () => {
        logger.info('Redis client reconnecting');
      });

      await client.connect();
      redisClient = client as RedisClientType;
      isConnecting = false;
      return redisClient;
    } catch (error) {
      isConnecting = false;
      logger.error('Failed to connect to Redis', {
        error: error instanceof Error ? error.message : String(error),
      });
      return null;
    }
  })();

  try {
    return await connectionPromise;
  } catch {
    connectionPromise = null;
    return null;
  }
}

/**
 * Close Redis connection gracefully
 */
export async function closeRedisConnection(): Promise<void> {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
    connectionPromise = null;
    isConnecting = false;
    logger.info('Redis connection closed');
  }
}

/**
 * Check if Redis is available
 */
export async function isRedisAvailable(): Promise<boolean> {
  try {
    const client = await getRedisClient();
    if (!client) return false;
    await client.ping();
    return true;
  } catch {
    return false;
  }
}

export default {
  getRedisClient,
  closeRedisConnection,
  isRedisAvailable,
};
