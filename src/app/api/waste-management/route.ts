/**
 * Waste Management API Route
 * 
 * Provides waste management and refuse storage guidance for development projects
 */

import { NextRequest, NextResponse } from 'next/server';
import wasteManagement from '@/lib/services/waste-management';

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

    const assessment = await wasteManagement.assessWasteManagement(
      address,
      postcode,
      projectType,
      projectDetails || {}
    );

    return NextResponse.json(assessment);
  } catch (error) {
    console.error('Waste management assessment error:', error);
    return NextResponse.json(
      { error: 'Failed to generate waste management assessment' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    service: 'Waste Management Assessment',
    description: 'Waste management and refuse storage guidance for development projects',
    endpoints: {
      POST: {
        description: 'Get waste management assessment for a specific property and project',
        body: {
          propertyDetails: 'Property information object (required)',
          projectType: 'Type of development project (required)',
          projectDetails: 'Specific project details including dwelling units, building type (optional)'
        }
      }
    },
    coverage: ['NW1-NW11', 'N2', 'N6', 'N10'],
    assessmentAreas: [
      'Bin provision and sizing requirements',
      'Storage area design and location',
      'Collection access requirements',
      'Recycling stream setup',
      'Construction waste management',
      'Conservation area screening requirements'
    ]
  });
}
