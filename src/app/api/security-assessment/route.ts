/**
 * Security Assessment API Route
 * 
 * Provides security and Secured by Design guidance for development projects
 */

import { NextRequest, NextResponse } from 'next/server';
import securityAssessment from '@/lib/services/security-assessment';

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

    const guidance = await securityAssessment.assessSecurity(
      address,
      postcode,
      projectType,
      projectDetails || {}
    );

    return NextResponse.json(guidance);
  } catch (error) {
    console.error('Security assessment error:', error);
    return NextResponse.json(
      { error: 'Failed to generate security assessment guidance' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    service: 'Security Assessment',
    description: 'Security and Secured by Design guidance for development projects',
    endpoints: {
      POST: {
        description: 'Get security assessment guidance for a specific property and project',
        body: {
          propertyDetails: 'Property information object (required)',
          projectType: 'Type of development project (required)',
          conservationArea: 'Conservation area status (optional)',
          projectDetails: 'Specific project details including security requirements (optional)'
        }
      }
    },
    coverage: ['NW1-NW11', 'N2', 'N6', 'N10'],
    securityAreas: [
      'Secured by Design principles',
      'Access control and entry systems',
      'CCTV and surveillance planning',
      'Lighting design for security',
      'Boundary treatment and defensible space',
      'Crime prevention through environmental design'
    ]
  });
}
