/**
 * Legal Compliance API
 * 
 * Comprehensive legal compliance checking for property development.
 * 
 * POST /api/legal-compliance
 */

import { NextRequest, NextResponse } from 'next/server';
import legalCompliance from '@/lib/services/legal-compliance';

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

    const assessment = await legalCompliance.checkLegalCompliance(
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
    console.error('Legal Compliance API error:', error);
    return NextResponse.json(
      { error: 'Failed to check legal compliance' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    service: 'Legal Compliance Checker',
    version: '1.0.0',
    description: 'Comprehensive legal compliance checking for property development',
    endpoints: {
      POST: {
        description: 'Check legal compliance requirements',
        body: {
          address: 'string (required)',
          postcode: 'string (required)',
          projectType: 'string (optional)',
          projectDetails: {
            propertyType: 'detached | semi_detached | terraced | flat | mansion',
            projectType: 'extension | loft | basement | new_build | refurbishment | change_of_use',
            isConservationArea: 'boolean',
            isListedBuilding: 'boolean',
            hasSharedWalls: 'boolean',
            hasBasement: 'boolean',
            nearTreesTPO: 'boolean',
            affectsBoundary: 'boolean',
            changeOfUse: 'boolean',
            numberOfUnits: 'number',
            commercialElement: 'boolean',
            affectsHighway: 'boolean'
          }
        }
      }
    }
  });
}
