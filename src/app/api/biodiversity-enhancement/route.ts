/**
 * Biodiversity Enhancement API Route
 * 
 * Provides biodiversity net gain and ecological enhancement guidance for development projects
 */

import { NextRequest, NextResponse } from 'next/server';
import biodiversityEnhancement from '@/lib/services/biodiversity-enhancement';

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

    const assessment = await biodiversityEnhancement.assessBiodiversity(
      address,
      postcode,
      projectType,
      projectDetails || {}
    );

    return NextResponse.json(assessment);
  } catch (error) {
    console.error('Biodiversity enhancement assessment error:', error);
    return NextResponse.json(
      { error: 'Failed to generate biodiversity enhancement assessment' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    service: 'Biodiversity Enhancement',
    description: 'Biodiversity net gain and ecological enhancement guidance for development projects',
    endpoints: {
      POST: {
        description: 'Get biodiversity enhancement assessment for a specific property and project',
        body: {
          propertyDetails: 'Property information object (required)',
          projectType: 'Type of development project (required)',
          projectDetails: 'Specific project details including habitats, green roof, pond (optional)'
        }
      }
    },
    coverage: ['NW1-NW11', 'N2', 'N6', 'N10'],
    assessmentAreas: [
      'Biodiversity Net Gain requirements',
      'Habitat creation options',
      'Species support features',
      'Green infrastructure (roofs, walls, SuDS)',
      'Urban Greening Factor',
      'Bird and bat box guidance',
      'Implementation and management'
    ]
  });
}
