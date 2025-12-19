/**
 * Health Check API Route
 * GET /api/health
 * 
 * Returns comprehensive system health status including all dependencies
 */

import { NextRequest, NextResponse } from 'next/server';

import { supabase, getSupabaseAdmin } from '@/lib/supabase';
import { getRedisClient, isRedisAvailable } from '@/lib/redis';
import { logInfo, logError } from '@/lib/utils/logger';

interface HealthCheck {
  status: 'ok' | 'error' | 'degraded';
  latency?: number;
  message?: string;
  details?: Record<string, unknown>;
}

interface HealthResponse {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  latency: number;
  checks: Record<string, HealthCheck>;
  version: string;
  environment: string;
  uptime: number;
}

// Track server start time
const SERVER_START_TIME = Date.now();

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  const checks: Record<string, HealthCheck> = {};

  // Check if this is a deep health check
  const deep = request.nextUrl.searchParams.get('deep') === 'true';

  // 1. Database (Supabase) Check
  try {
    const dbStart = Date.now();
    const { error } = await supabase.from('search_logs').select('id').limit(1);
    
    checks['database'] = {
      status: error ? 'error' : 'ok',
      latency: Date.now() - dbStart,
      message: error?.message,
    };

    // Deep check: test PostGIS extension
    if (deep && !error) {
      try {
        const adminClient = getSupabaseAdmin();
        // Cast the RPC payload to never to satisfy generated Supabase types
        const { error: postgisError } = await adminClient.rpc('find_nearby_listed_buildings', {
          search_lat: 51.5074,
          search_lng: -0.1278,
          radius_meters: 1,
        } as never);

        checks['database'].details = {
          postgis: postgisError ? 'error' : 'ok',
          postgisMessage: postgisError?.message,
        };
      } catch (postgisErr) {
        checks['database'].details = {
          postgis: 'error',
          postgisMessage: postgisErr instanceof Error ? postgisErr.message : 'PostGIS check failed',
        };
      }
    }
  } catch (error) {
    checks['database'] = {
      status: 'error',
      message: error instanceof Error ? error.message : 'Database connection failed',
    };
  }

  // 2. Redis Check
  try {
    const redisStart = Date.now();

    if (await isRedisAvailable()) {
      const redis = await getRedisClient();

      if (redis) {
        // Test connection with PING
        const pingResult = await redis.ping();

        checks['redis'] = {
          status: pingResult === 'PONG' ? 'ok' : 'degraded',
          latency: Date.now() - redisStart,
        };

        // Deep check: test SET/GET operations
        if (deep) {
          const testKey = `health:${Date.now()}`;
          await redis.set(testKey, 'test', { EX: 5 });
          const testValue = await redis.get(testKey);
          await redis.del(testKey);

          checks['redis'].details = {
            operations: testValue === 'test' ? 'ok' : 'error',
          };
        }
      } else {
        checks['redis'] = {
          status: 'degraded',
          message: 'Redis client not available',
        };
      }
    } else {
      checks['redis'] = {
        status: 'degraded',
        message: 'Redis not configured, using in-memory fallback',
      };
    }
  } catch (error) {
    checks['redis'] = {
      status: 'error',
      message: error instanceof Error ? error.message : 'Redis connection failed',
    };
  }

  // 3. Mapbox API Check
  try {
    const mapboxStart = Date.now();
    const mapboxToken = process.env['NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN'];

    if (mapboxToken) {
      // Simple token validation endpoint
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/test.json?access_token=${mapboxToken}&limit=1`,
        { method: 'GET', signal: AbortSignal.timeout(5000) }
      );

      checks['mapbox'] = {
        status: response.ok ? 'ok' : 'error',
        latency: Date.now() - mapboxStart,
        message: response.ok ? undefined : `HTTP ${response.status}`,
      };
    } else {
      checks['mapbox'] = {
        status: 'error',
        message: 'Mapbox access token not configured',
      };
    }
  } catch (error) {
    checks['mapbox'] = {
      status: 'error',
      message: error instanceof Error ? error.message : 'Mapbox API check failed',
    };
  }

  // 4. Environment Configuration Check
  const requiredEnvVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN',
  ];

  const optionalEnvVars = [
    'SUPABASE_SERVICE_ROLE_KEY',
    'REDIS_URL',
    'NEXTAUTH_SECRET',
    'NEXTAUTH_URL',
  ];

  const missingRequired = requiredEnvVars.filter((v) => !process.env[v]);
  const missingOptional = optionalEnvVars.filter((v) => !process.env[v]);

  checks['config'] = {
    status: missingRequired.length > 0 ? 'error' : missingOptional.length > 0 ? 'degraded' : 'ok',
    message: missingRequired.length > 0 
      ? `Missing required: ${missingRequired.join(', ')}`
      : missingOptional.length > 0
      ? `Missing optional: ${missingOptional.join(', ')}`
      : undefined,
    details: deep ? {
      required: requiredEnvVars.reduce((acc, v) => ({ ...acc, [v]: !!process.env[v] }), {}),
      optional: optionalEnvVars.reduce((acc, v) => ({ ...acc, [v]: !!process.env[v] }), {}),
    } : undefined,
  };

  // 5. Memory Check
  if (typeof process !== 'undefined' && process.memoryUsage) {
    const memory = process.memoryUsage();
    const heapUsedMB = Math.round(memory.heapUsed / 1024 / 1024);
    const heapTotalMB = Math.round(memory.heapTotal / 1024 / 1024);
    const heapUsagePercent = Math.round((memory.heapUsed / memory.heapTotal) * 100);

    checks['memory'] = {
      status: heapUsagePercent > 90 ? 'degraded' : 'ok',
      details: {
        heapUsed: `${heapUsedMB}MB`,
        heapTotal: `${heapTotalMB}MB`,
        heapUsagePercent: `${heapUsagePercent}%`,
        rss: `${Math.round(memory.rss / 1024 / 1024)}MB`,
      },
    };
  }

  // Calculate overall status
  const checkStatuses = Object.values(checks).map((c) => c.status);
  const hasError = checkStatuses.includes('error');
  const hasDegraded = checkStatuses.includes('degraded');

  let overallStatus: 'healthy' | 'degraded' | 'unhealthy';
  if (hasError) {
    // Critical services: database, config
    const criticalError = checks['database']?.status === 'error' || checks['config']?.status === 'error';
    overallStatus = criticalError ? 'unhealthy' : 'degraded';
  } else if (hasDegraded) {
    overallStatus = 'degraded';
  } else {
    overallStatus = 'healthy';
  }

  const response: HealthResponse = {
    status: overallStatus,
    timestamp: new Date().toISOString(),
    latency: Date.now() - startTime,
    checks,
    version: process.env['npm_package_version'] ?? '1.0.0',
    environment: process.env['NODE_ENV'] ?? 'development',
    uptime: Math.round((Date.now() - SERVER_START_TIME) / 1000),
  };

  // Log health check result
  if (overallStatus !== 'healthy') {
    logError('Health check degraded', new Error('Health check failed'), {
      status: overallStatus,
      checks: Object.entries(checks)
        .filter(([, v]) => v.status !== 'ok')
        .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {}),
    });
  } else if (deep) {
    logInfo('Deep health check completed', { status: overallStatus, latency: response.latency });
  }

  return NextResponse.json(response, {
    status: overallStatus === 'healthy' ? 200 : overallStatus === 'degraded' ? 200 : 503,
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'X-Health-Status': overallStatus,
    },
  });
}

// HEAD request for simple liveness check
export async function HEAD() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'X-Health-Status': 'ok',
    },
  });
}
