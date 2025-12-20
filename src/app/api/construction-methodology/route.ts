/**
 * Construction Methodology API
 * 
 * Generates comprehensive construction methodology statements for planning applications.
 * 
 * POST /api/construction-methodology
 */

import { NextRequest, NextResponse } from 'next/server';

import constructionMethodology from '@/lib/services/construction-methodology';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as Record<string, unknown>;
    const { address, postcode, projectType, projectDetails } = body as {
      address?: string;
      postcode?: string;
      projectType?: string;
      projectDetails?: Record<string, unknown>;
    };

    if (!address || !postcode) {
      return NextResponse.json(
        { error: 'Address and postcode are required' },
        { status: 400 }
      );
    }

    const assessment = await constructionMethodology.generateMethodologyStatement(
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
    safeLogError('Construction Methodology API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate construction methodology statement' },
      { status: 500 }
    );
  }
}

export function GET() {
  return NextResponse.json({
    service: 'Construction Methodology Statement',
    version: '1.0.0',
    description: 'Generates comprehensive construction methodology statements',
    endpoints: {
      POST: {
        description: 'Generate construction methodology statement',
        body: {
          address: 'string (required)',
          postcode: 'string (required)',
          projectType: 'string (optional)',
          projectDetails: {
            propertyType: 'detached | semi_detached | terraced | flat | mansion',
            projectType: 'extension | loft | basement | new_build | refurbishment | demolition',
            siteSize: 'number (square meters)',
            projectDuration: 'number (months)',
            isConservationArea: 'boolean',
            isListedBuilding: 'boolean',
            hasSharedWalls: 'boolean',
            accessType: 'front | rear | side | limited',
            nearbyProperties: 'residential | commercial | mixed',
            streetType: 'residential | main_road | pedestrianized'
          }
        }
      }
    }
  });
}
