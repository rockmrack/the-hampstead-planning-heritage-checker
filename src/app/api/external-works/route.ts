/**
 * External Works API Route
 * 
 * Provides external works assessment guidance including driveways, 
 * boundaries, and landscaping for development projects
 */

import { NextRequest, NextResponse } from 'next/server';
import externalWorks from '@/lib/services/external-works';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { propertyDetails, projectType, projectDetails } = body;

    if (!propertyDetails || !projectType) {
      return NextResponse.json(
        { error: 'Missing required fields: propertyDetails and projectType are required' },
        { status: 400 }
      );
    }

    const address = propertyDetails.address || '';
    const postcode = propertyDetails.postcode || '';

    const assessment = await externalWorks.assessExternalWorks(
      address,
      postcode,
      projectType,
      projectDetails || {}
    );

    return NextResponse.json(assessment);
  } catch (error) {
    console.error('External works assessment error:', error);
    return NextResponse.json(
      { error: 'Failed to generate external works assessment' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    service: 'External Works Assessment',
    description: 'External works guidance including hard landscaping, boundaries, and features',
    endpoints: {
      POST: {
        description: 'Get external works assessment for a specific property and project',
        body: {
          propertyDetails: 'Property information object (required)',
          projectType: 'Type of development project (required)',
          projectDetails: 'Specific project details including driveway, boundaries, conservation status (optional)'
        }
      }
    },
    coverage: ['NW1-NW11', 'N2', 'N6', 'N10'],
    assessmentAreas: [
      'Driveway design and materials',
      'Permeable paving requirements',
      'Boundary treatments and heights',
      'External lighting schemes',
      'Sustainable drainage (SuDS)',
      'Conservation area guidance',
      'Vehicle crossover applications'
    ]
  });
}
