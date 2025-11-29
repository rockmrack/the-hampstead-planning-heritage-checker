/**
 * Rights of Light API
 * 
 * Assessment of Rights of Light implications
 */

import { NextRequest, NextResponse } from 'next/server';
import rightsOfLight from '@/lib/services/rights-of-light';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      address, 
      postcode, 
      projectType,
      heightIncrease,
      proximityToNeighbors,
      affectedWindows,
      existingObstructions,
      developmentType
    } = body;

    if (!address || !postcode || !projectType) {
      return NextResponse.json(
        { error: 'Address, postcode, and project type are required' },
        { status: 400 }
      );
    }

    const assessment = await rightsOfLight.assessRightsOfLight(
      address,
      postcode,
      projectType,
      {
        heightIncrease,
        proximityToNeighbors,
        affectedWindows,
        existingObstructions,
        developmentType
      }
    );

    return NextResponse.json({
      success: true,
      data: assessment
    });
  } catch (error) {
    console.error('Rights of Light assessment error:', error);
    return NextResponse.json(
      { error: 'Failed to assess Rights of Light' },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Return Rights of Light overview
  return NextResponse.json({
    success: true,
    data: {
      overview: {
        basisOfRight: 'Prescription Act 1832 - acquired after 20 years uninterrupted enjoyment',
        separateFromPlanning: 'Planning permission does NOT authorize infringement',
        remedies: ['Injunction (rare but possible)', 'Damages/Compensation', 'Negotiated Release']
      },
      technicalTest: {
        name: '50/50 Rule',
        description: 'At least 50% of room should receive 1 lumen per sq ft from sky',
        standard: 'Percy Allen & Grymes method',
        thresholds: {
          adequateLight: '50% of room above 0.2% sky factor',
          wellLit: 'Higher levels of sky factor throughout'
        }
      },
      projectRiskLevels: {
        low: ['Single storey extensions', 'Small conservatories', 'Garden structures'],
        medium: ['Rear extensions', 'Side extensions', 'Loft conversions'],
        high: ['Additional storeys', 'Double storey extensions close to boundary'],
        veryHigh: ['New build', 'Infill development', 'Multi-storey blocks']
      },
      typicalCosts: {
        survey: '£3,000-15,000',
        legal: '£2,000-10,000',
        compensation: '£5,000-50,000+ per affected party',
        insurance: '£1,500-15,000+'
      },
      keyPrinciples: [
        'Right belongs to the room, not the window',
        'Not a right to all light, just adequate light',
        'Right can be released by deed',
        'High Court action required to enforce',
        'Injunctions increasingly rare - damages preferred'
      ]
    }
  });
}
