/**
 * Redis Client Configuration
 * Singleton Redis client for distributed caching and rate limiting
 */

import { createClient, RedisClientType } from 'redis';
import { logger } from './logger';

let redisClient: RedisClientType | null = null;
let isConnecting = false;
let connectionPromise: Promise<RedisClientType> | null = null;

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

  connectionPromise = new Promise<RedisClientType>(async (resolve, reject) => {
    try {
      const client = createClient({
        url: redisUrl,
        socket: {
          reconnectStrategy: (retries) => {
            if (retries > 10) {
              logger.error('Redis max reconnection attempts reached');
              return new Error('Max reconnection attempts reached');
            }
            return Math.min(retries * 100, 3000);
          },
          connectTimeout: 10000,
        },
      });

      client.on('error', (err) => {
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
      resolve(redisClient);
    } catch (error) {
      isConnecting = false;
      logger.error('Failed to connect to Redis', {
        error: error instanceof Error ? error.message : String(error),
      });
      reject(error);
    }
  });

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
