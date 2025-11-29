/**
 * Property Valuation Impact API
 * 
 * Analyzes how planning decisions and property improvements affect property values.
 * 
 * POST /api/valuation-impact
 */

import { NextRequest, NextResponse } from 'next/server';
import valuationImpact from '@/lib/services/valuation-impact';

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

    const assessment = await valuationImpact.assessValuationImpact(
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
    console.error('Valuation Impact API error:', error);
    return NextResponse.json(
      { error: 'Failed to assess valuation impact' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    service: 'Property Valuation Impact',
    version: '1.0.0',
    description: 'Analyzes how planning decisions and improvements affect property values',
    endpoints: {
      POST: {
        description: 'Get valuation impact assessment',
        body: {
          address: 'string (required)',
          postcode: 'string (required)',
          projectType: 'string (optional)',
          projectDetails: {
            propertyType: 'detached | semi_detached | terraced | flat | mansion',
            currentValue: 'number',
            improvementType: 'extension | loft | basement | refurbishment | garden | other',
            improvementCost: 'number',
            squareFootageAdded: 'number',
            heritageStatus: 'listed | conservation | local_interest | none'
          }
        }
      }
    }
  });
}
