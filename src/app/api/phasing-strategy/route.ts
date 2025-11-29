/**
 * Phasing Strategy API
 * 
 * Generates comprehensive project phasing strategies for planning applications.
 * 
 * POST /api/phasing-strategy
 */

import { NextRequest, NextResponse } from 'next/server';
import phasingStrategy from '@/lib/services/phasing-strategy';

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

    const assessment = await phasingStrategy.generatePhasingStrategy(
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
    console.error('Phasing Strategy API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate phasing strategy' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    service: 'Phasing Strategy',
    version: '1.0.0',
    description: 'Generates comprehensive project phasing strategies',
    endpoints: {
      POST: {
        description: 'Generate phasing strategy',
        body: {
          address: 'string (required)',
          postcode: 'string (required)',
          projectType: 'string (optional)',
          projectDetails: {
            projectType: 'extension | loft | basement | new_build | refurbishment | mixed_use | conversion',
            totalUnits: 'number',
            totalArea: 'number (square meters)',
            budget: 'number',
            constraints: 'string[]',
            priorities: 'string[]',
            targetCompletion: 'string (date)',
            fundingType: 'self_funded | mortgage | development_finance | phased_release',
            isOccupied: 'boolean',
            isConservationArea: 'boolean',
            isListedBuilding: 'boolean'
          }
        }
      }
    }
  });
}
