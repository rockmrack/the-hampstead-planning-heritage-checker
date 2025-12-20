/**
 * Property Check API Route
 * POST /api/check-property
 * 
 * Accepts an address, geocodes it, and returns the heritage/planning status
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { geocodeAddress, isWithinCoverageArea } from '@/services/geocoding';
import { checkProperty, logSearchToDatabase } from '@/services/property-check';
import {
  checkRateLimit,
  getClientIdentifier,
  DEFAULT_RATE_LIMIT,
  logRequest,
  logError,
} from '@/lib/utils';
import { ErrorCode } from '@/types';

// Request validation schema
const requestSchema = z.object({
  address: z.string().min(5, 'Address must be at least 5 characters').max(200),
  postcode: z.string().optional(),
  coordinates: z
    .object({
      latitude: z.number().min(-90).max(90),
      longitude: z.number().min(-180).max(180),
    })
    .optional(),
});

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  const clientIp = getClientIdentifier(request);
  const userAgent = request.headers.get('user-agent') ?? undefined;

  try {
    // Rate limiting
    const rateLimitResult = checkRateLimit(clientIp, DEFAULT_RATE_LIMIT);
    if (!rateLimitResult.allowed) {
      logRequest('POST', '/api/check-property', 429, Date.now() - startTime, { clientIp });
      
      return NextResponse.json(
        {
          success: false,
          error: 'Too many requests. Please try again later.',
          errorCode: ErrorCode.RATE_LIMITED,
          retryAfter: rateLimitResult.retryAfter,
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(rateLimitResult.retryAfter ?? 60),
            'X-RateLimit-Remaining': String(rateLimitResult.remaining),
            'X-RateLimit-Reset': String(rateLimitResult.resetTime),
          },
        }
      );
    }

    // Parse and validate request body
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid JSON in request body',
          errorCode: ErrorCode.VALIDATION_ERROR,
        },
        { status: 400 }
      );
    }

    const validation = requestSchema.safeParse(body) as { success: boolean; data?: z.infer<typeof requestSchema>; error?: z.ZodError };
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: validation.error?.errors[0]?.message ?? 'Invalid request',
          errorCode: ErrorCode.VALIDATION_ERROR,
        },
        { status: 400 }
      );
    }

    const { address, postcode, coordinates: providedCoords } = validation.data!;

    // Get coordinates - either provided or via geocoding
    let coordinates = providedCoords;
    let geocodedAddress = address;
    let geocodedPostcode = postcode;

    if (!coordinates) {
      // Geocode the address
      const searchQuery = postcode ? `${address}, ${postcode}` : address;
      const geocodingResults = await geocodeAddress(searchQuery);

      if (geocodingResults.length === 0) {
        return NextResponse.json(
          {
            success: false,
            error: 'Address not found. Please check the address and try again.',
            errorCode: ErrorCode.GEOCODING_FAILED,
          },
          { status: 404 }
        );
      }

      const topResult = geocodingResults[0];
      if (!topResult) {
        return NextResponse.json(
          {
            success: false,
            error: 'Address not found. Please check the address and try again.',
            errorCode: ErrorCode.GEOCODING_FAILED,
          },
          { status: 404 }
        );
      }

      coordinates = topResult.coordinates;
      geocodedAddress = topResult.placeName;
      geocodedPostcode = topResult.postcode ?? postcode;
    }

    // Validate coverage area
    if (!isWithinCoverageArea(coordinates)) {
      return NextResponse.json(
        {
          success: false,
          error: 'This address is outside our coverage area. We currently cover NW1, NW3, NW6, NW8, NW11, N2, N6, and N10 postcodes.',
          errorCode: ErrorCode.NOT_IN_COVERAGE_AREA,
        },
        { status: 400 }
      );
    }

    // Perform the property check
    const result = await checkProperty(coordinates, geocodedAddress, geocodedPostcode);

    // Log the search (non-blocking)
    void logSearchToDatabase(result, userAgent, clientIp);

    const duration = Date.now() - startTime;
    logRequest('POST', '/api/check-property', 200, duration, {
      clientIp,
      status: result.status,
      address: geocodedAddress,
    });

    return NextResponse.json(
      {
        success: true,
        data: result,
        timestamp: new Date().toISOString(),
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'private, max-age=3600',
          'X-RateLimit-Remaining': String(rateLimitResult.remaining),
        },
      }
    );
  } catch (error) {
    const duration = Date.now() - startTime;
    logError('Property check API error', error instanceof Error ? error : new Error(String(error)));
    logRequest('POST', '/api/check-property', 500, duration, { clientIp });

    return NextResponse.json(
      {
        success: false,
        error: 'An unexpected error occurred. Please try again.',
        errorCode: ErrorCode.SERVER_ERROR,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

// Handle OPTIONS for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    },
  });
}
