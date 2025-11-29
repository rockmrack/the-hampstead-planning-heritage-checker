/**
 * Landscape Design API Route
 * 
 * Provides landscape design and planting scheme guidance for development projects
 */

import { NextRequest, NextResponse } from 'next/server';
import landscapeDesign from '@/lib/services/landscape-design';

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

    const assessment = await landscapeDesign.assessLandscapeDesign(
      address,
      postcode,
      projectType,
      projectDetails || {}
    );

    return NextResponse.json(assessment);
  } catch (error) {
    console.error('Landscape design assessment error:', error);
    return NextResponse.json(
      { error: 'Failed to generate landscape design assessment' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    service: 'Landscape Design',
    description: 'Landscape design and planting scheme guidance for development projects',
    endpoints: {
      POST: {
        description: 'Get landscape design assessment for a specific property and project',
        body: {
          propertyDetails: 'Property information object (required)',
          projectType: 'Type of development project (required)',
          projectDetails: 'Specific project details including garden sizes, soil type, aspect (optional)'
        }
      }
    },
    coverage: ['NW1-NW11', 'N2', 'N6', 'N10'],
    assessmentAreas: [
      'Tree and shrub recommendations',
      'Perennial and ground cover planting',
      'Hedging options',
      'Garden zone design',
      'Sustainable landscaping strategies',
      'Conservation area guidance',
      'Wildlife-friendly features'
    ]
  });
}
