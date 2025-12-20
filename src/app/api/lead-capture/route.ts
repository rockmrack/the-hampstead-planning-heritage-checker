/**
 * Lead Capture API Route
 * POST /api/lead-capture
 * 
 * Captures lead information when users download reports
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { captureLead } from '@/services/lead-capture';
import {
  checkRateLimit,
  getClientIdentifier,
  STRICT_RATE_LIMIT,
  logRequest,
  logError,
} from '@/lib/utils';
import { ErrorCode } from '@/types';

// Request validation schema
const requestSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().max(100).optional(),
  phone: z.string().max(20).optional(),
  searchId: z.string().uuid(),
  source: z.enum(['pdf_download', 'consultation_request', 'quote_request']),
  propertyAddress: z.string().max(200).optional(),
  propertyStatus: z.enum(['RED', 'AMBER', 'GREEN']).optional(),
  marketingConsent: z.boolean(),
});

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  const clientIp = getClientIdentifier(request);

  try {
    // Stricter rate limiting for lead capture
    const rateLimitResult = checkRateLimit(`lead:${clientIp}`, STRICT_RATE_LIMIT);
    if (!rateLimitResult.allowed) {
      logRequest('POST', '/api/lead-capture', 429, Date.now() - startTime, { clientIp });
      
      return NextResponse.json(
        {
          success: false,
          error: 'Too many requests. Please try again later.',
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

    // Capture the lead
    const result = await captureLead(validation.data!) as { success: boolean; error?: string };

    const duration = Date.now() - startTime;
    logRequest('POST', '/api/lead-capture', result.success ? 200 : 500, duration, {
      clientIp,
      source: validation.data!.source,
    });

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error ?? 'Failed to capture lead',
          errorCode: ErrorCode.DATABASE_ERROR,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Lead captured successfully',
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    const duration = Date.now() - startTime;
    logError('Lead capture API error', error instanceof Error ? error : new Error(String(error)));
    logRequest('POST', '/api/lead-capture', 500, duration, { clientIp });

    return NextResponse.json(
      {
        success: false,
        error: 'An unexpected error occurred. Please try again.',
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
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
