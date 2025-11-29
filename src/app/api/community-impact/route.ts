/**
 * Community Impact API
 * 
 * Comprehensive assessment of development impacts on local community.
 * 
 * POST /api/community-impact
 */

import { NextRequest, NextResponse } from 'next/server';
import communityImpact from '@/lib/services/community-impact';

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

    const assessment = await communityImpact.assessCommunityImpact(
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
    console.error('Community Impact API error:', error);
    return NextResponse.json(
      { error: 'Failed to assess community impact' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    service: 'Community Impact Assessment',
    version: '1.0.0',
    description: 'Comprehensive assessment of development impacts on local community',
    endpoints: {
      POST: {
        description: 'Assess community impact',
        body: {
          address: 'string (required)',
          postcode: 'string (required)',
          projectType: 'string (optional)',
          projectDetails: {
            projectType: 'extension | new_build | conversion | change_of_use | demolition',
            numberOfUnits: 'number',
            commercialUse: 'boolean',
            publicAccess: 'boolean',
            existingUse: 'string',
            proposedUse: 'string',
            siteArea: 'number (square meters)',
            constructionDuration: 'number (months)',
            expectedOccupants: 'number'
          }
        }
      }
    }
  });
}
