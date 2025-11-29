/**
 * Neighbor Consultation API
 * 
 * Comprehensive guidance for neighbor engagement during planning applications.
 * 
 * POST /api/neighbor-consultation
 */

import { NextRequest, NextResponse } from 'next/server';
import neighborConsultation from '@/lib/services/neighbor-consultation';

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

    const assessment = await neighborConsultation.generateNeighborConsultation(
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
    console.error('Neighbor Consultation API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate neighbor consultation guidance' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    service: 'Neighbor Consultation',
    version: '1.0.0',
    description: 'Comprehensive guidance for neighbor engagement',
    endpoints: {
      POST: {
        description: 'Generate neighbor consultation strategy',
        body: {
          address: 'string (required)',
          postcode: 'string (required)',
          projectType: 'string (optional)',
          projectDetails: {
            propertyType: 'detached | semi_detached | terraced | flat | mansion',
            projectType: 'extension | loft | basement | new_build | refurbishment',
            adjacentProperties: 'number',
            isConservationArea: 'boolean',
            isListedBuilding: 'boolean',
            hasPartyWall: 'boolean',
            constructionDuration: 'number (months)',
            affectsViews: 'boolean',
            affectsLight: 'boolean',
            affectsPrivacy: 'boolean'
          }
        }
      }
    }
  });
}
