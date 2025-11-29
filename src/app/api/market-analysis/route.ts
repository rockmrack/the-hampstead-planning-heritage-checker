/**
 * Market Analysis API
 * 
 * Provides comprehensive local property market analysis for Hampstead and 
 * surrounding conservation areas to inform development decisions.
 * 
 * POST /api/market-analysis
 */

import { NextRequest, NextResponse } from 'next/server';
import marketAnalysis from '@/lib/services/market-analysis';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { address, postcode, projectType, projectDetails } = body;

    if (!address || !postcode) {
      return NextResponse.json(
        { error: 'Address and postcode are required' },
        { status: 400 }
      );
    }

    const assessment = await marketAnalysis.analyzeMarket(
      address,
      postcode,
      projectType || 'general',
      projectDetails || {}
    );

    return NextResponse.json({
      success: true,
      data: assessment,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Market Analysis API error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze market' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    service: 'Market Analysis',
    version: '1.0.0',
    description: 'Comprehensive local property market analysis for Hampstead',
    endpoints: {
      POST: {
        description: 'Get market analysis',
        body: {
          address: 'string (required)',
          postcode: 'string (required)',
          projectType: 'string (optional)',
          projectDetails: {
            postcode: 'string',
            propertyType: 'detached | semi_detached | terraced | flat | mansion',
            bedrooms: 'number',
            purchaseType: 'investment | development | owner_occupier',
            budget: 'number',
            targetYield: 'number'
          }
        }
      }
    }
  });
}
