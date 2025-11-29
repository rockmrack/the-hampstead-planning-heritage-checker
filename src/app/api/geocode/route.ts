/**
 * Geocoding API Route
 * GET /api/geocode
 * 
 * Provides address autocomplete suggestions
 */

import { NextRequest, NextResponse } from 'next/server';

import { geocodeAddress } from '@/services/geocoding';
import {
  checkRateLimit,
  getClientIdentifier,
  RELAXED_RATE_LIMIT,
  logRequest,
  logError,
} from '@/lib/utils';
import { ErrorCode } from '@/types';

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  const clientIp = getClientIdentifier(request);

  try {
    // Rate limiting
    const rateLimitResult = checkRateLimit(`geocode:${clientIp}`, RELAXED_RATE_LIMIT);
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: 'Too many requests. Please slow down.',
          errorCode: ErrorCode.RATE_LIMITED,
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(rateLimitResult.retryAfter ?? 60),
          },
        }
      );
    }

    // Get query parameter
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') ?? searchParams.get('query');
    const limit = parseInt(searchParams.get('limit') ?? '5', 10);

    if (!query || query.length < 3) {
      return NextResponse.json(
        {
          success: false,
          error: 'Query must be at least 3 characters',
          errorCode: ErrorCode.VALIDATION_ERROR,
        },
        { status: 400 }
      );
    }

    // Perform geocoding
    const results = await geocodeAddress(query, { limit: Math.min(limit, 10) });

    const duration = Date.now() - startTime;
    logRequest('GET', '/api/geocode', 200, duration, {
      clientIp,
      query,
      resultsCount: results.length,
    });

    return NextResponse.json(
      {
        success: true,
        data: results,
        timestamp: new Date().toISOString(),
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
          'X-RateLimit-Remaining': String(rateLimitResult.remaining),
        },
      }
    );
  } catch (error) {
    const duration = Date.now() - startTime;
    logError('Geocoding API error', error instanceof Error ? error : new Error(String(error)));
    logRequest('GET', '/api/geocode', 500, duration, { clientIp });

    return NextResponse.json(
      {
        success: false,
        error: 'Geocoding service temporarily unavailable',
        errorCode: ErrorCode.SERVER_ERROR,
      },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
