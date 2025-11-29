/**
 * Utilities Assessment API Route
 * 
 * Provides utilities and services connection guidance for development projects
 */

import { NextRequest, NextResponse } from 'next/server';
import utilitiesAssessment from '@/lib/services/utilities-assessment';

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

    const guidance = await utilitiesAssessment.assessUtilities(
      address,
      postcode,
      projectType,
      projectDetails || {}
    );

    return NextResponse.json(guidance);
  } catch (error) {
    console.error('Utilities assessment error:', error);
    return NextResponse.json(
      { error: 'Failed to generate utilities assessment guidance' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    service: 'Utilities Assessment',
    description: 'Utilities and services connection guidance for development projects',
    endpoints: {
      POST: {
        description: 'Get utilities assessment guidance for a specific property and project',
        body: {
          propertyDetails: 'Property information object (required)',
          projectType: 'Type of development project (required)',
          conservationArea: 'Conservation area status (optional)',
          projectDetails: 'Specific project details including utility requirements (optional)'
        }
      }
    },
    coverage: ['NW1-NW11', 'N2', 'N6', 'N10'],
    utilities: [
      'Electricity connections and supply upgrades',
      'Gas connections and meter installation',
      'Water supply and drainage connections',
      'Telecommunications and broadband infrastructure',
      'District heating connections (where available)'
    ]
  });
}
