/**
 * Health Check API Route
 * GET /api/health
 * 
 * Returns system health status
 */

import { NextResponse } from 'next/server';

import { supabase } from '@/lib/supabase';

export async function GET() {
  const startTime = Date.now();
  const checks: Record<string, { status: 'ok' | 'error'; latency?: number; message?: string }> = {};

  // Check Supabase connection
  try {
    const dbStart = Date.now();
    const { error } = await supabase.from('search_logs').select('id').limit(1);
    checks['database'] = {
      status: error ? 'error' : 'ok',
      latency: Date.now() - dbStart,
      message: error?.message,
    };
  } catch (error) {
    checks['database'] = {
      status: 'error',
      message: error instanceof Error ? error.message : 'Database connection failed',
    };
  }

  // Check environment variables
  checks['config'] = {
    status:
      process.env['NEXT_PUBLIC_SUPABASE_URL'] &&
      process.env['NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN']
        ? 'ok'
        : 'error',
    message: !process.env['NEXT_PUBLIC_SUPABASE_URL']
      ? 'Missing Supabase URL'
      : !process.env['NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN']
      ? 'Missing Mapbox token'
      : undefined,
  };

  // Overall status
  const overallStatus = Object.values(checks).every((c) => c.status === 'ok') ? 'healthy' : 'degraded';

  return NextResponse.json(
    {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      latency: Date.now() - startTime,
      checks,
      version: process.env['npm_package_version'] ?? '1.0.0',
      environment: process.env['NODE_ENV'],
    },
    {
      status: overallStatus === 'healthy' ? 200 : 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    }
  );
}
