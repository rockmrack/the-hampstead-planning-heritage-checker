/**
 * Planning History API
 * 
 * Analyzes planning application history for properties and areas.
 * 
 * POST /api/planning-history
 */

import { NextRequest, NextResponse } from 'next/server';
import planningHistoryAnalyzer from '@/lib/services/planning-history';

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

    const assessment = await planningHistoryAnalyzer.analyzePlanningHistory(
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
    console.error('Planning History API error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze planning history' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    service: 'Planning History Analyzer',
    version: '1.0.0',
    description: 'Analyzes planning application history for properties and areas',
    endpoints: {
      POST: {
        description: 'Analyze planning history',
        body: {
          address: 'string (required)',
          postcode: 'string (required)',
          projectType: 'string (optional)',
          projectDetails: {
            propertyType: 'detached | semi_detached | terraced | flat | mansion',
            proposedProject: 'string',
            conservationArea: 'string',
            ward: 'string',
            yearsToAnalyze: 'number'
          }
        }
      }
    }
  });
}
