import { NextRequest, NextResponse } from 'next/server';
import {
  handlePropertyIntelligenceRequest,
  type PropertyReportRequest,
} from '@/lib/services/property-intelligence';
import { createAPIMiddleware, createErrorResponse, addRateLimitHeaders } from '@/lib/api/professional-tier';

const validateRequest = createAPIMiddleware();

export async function POST(request: NextRequest) {
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  
  try {
    // Validate API key (for professional tier)
    const auth = await validateRequest(request, { requiredPermissions: ['read'] });
    
    // Parse request body
    const body = await request.json();
    
    // Validate required fields
    if (!body.address || !body.postcode) {
      return createErrorResponse(
        'Missing required fields: address and postcode are required',
        400,
        requestId
      );
    }

    // Default coordinates to central London if not provided
    const reportRequest: PropertyReportRequest = {
      address: body.address,
      postcode: body.postcode,
      latitude: body.latitude || 51.5074,
      longitude: body.longitude || -0.1278,
      reportType: body.reportType || 'full',
    };

    // Generate the report
    const report = await handlePropertyIntelligenceRequest(reportRequest);

    // Create response
    const response = NextResponse.json({
      success: true,
      requestId,
      data: report,
    });

    // Add rate limit headers if authenticated
    if (auth.valid && auth.apiKey) {
      addRateLimitHeaders(response.headers, auth.apiKey);
    }

    return response;
  } catch (error) {
    console.error('Property intelligence error:', error);
    return createErrorResponse(
      'Internal server error generating property report',
      500,
      requestId
    );
  }
}

export async function GET(request: NextRequest) {
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  
  try {
    const { searchParams } = new URL(request.url);
    
    const address = searchParams.get('address');
    const postcode = searchParams.get('postcode');
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');
    const reportType = searchParams.get('type') as PropertyReportRequest['reportType'];

    if (!address || !postcode) {
      return createErrorResponse(
        'Missing required query parameters: address and postcode',
        400,
        requestId
      );
    }

    const reportRequest: PropertyReportRequest = {
      address,
      postcode,
      latitude: lat ? parseFloat(lat) : 51.5074,
      longitude: lng ? parseFloat(lng) : -0.1278,
      reportType: reportType || 'summary',
    };

    const report = await handlePropertyIntelligenceRequest(reportRequest);

    return NextResponse.json({
      success: true,
      requestId,
      data: report,
    });
  } catch (error) {
    console.error('Property intelligence error:', error);
    return createErrorResponse(
      'Internal server error',
      500,
      requestId
    );
  }
}
