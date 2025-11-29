/**
 * Access Statement API
 * 
 * Assessment of accessibility requirements for development
 */

import { NextRequest, NextResponse } from 'next/server';
import accessStatement from '@/lib/services/access-statement';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      address, 
      postcode, 
      projectType,
      buildingType,
      numberOfStoreys,
      existingAccess,
      publicAccess,
      dwellingType,
      commonAreas,
      externalSpaces,
      liftsProvided
    } = body;

    if (!address || !postcode || !projectType) {
      return NextResponse.json(
        { error: 'Address, postcode, and project type are required' },
        { status: 400 }
      );
    }

    const assessment = await accessStatement.assessAccessRequirements(
      address,
      postcode,
      projectType,
      {
        buildingType,
        numberOfStoreys,
        existingAccess,
        publicAccess,
        dwellingType,
        commonAreas,
        externalSpaces,
        liftsProvided
      }
    );

    return NextResponse.json({
      success: true,
      data: assessment
    });
  } catch (error) {
    console.error('Access statement assessment error:', error);
    return NextResponse.json(
      { error: 'Failed to assess access requirements' },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Return access requirements overview
  return NextResponse.json({
    success: true,
    data: {
      partMCategories: {
        'M4(1)': {
          name: 'Visitable Dwellings',
          requirement: 'All new dwellings',
          keyFeatures: ['Level approach', 'Accessible threshold', 'WC at entrance level']
        },
        'M4(2)': {
          name: 'Accessible and Adaptable',
          requirement: 'Often 10%+ of units (Camden policy)',
          keyFeatures: ['Step-free throughout', 'Wider doorways', 'Future adaptation potential']
        },
        'M4(3)': {
          name: 'Wheelchair User Dwellings',
          requirement: 'Where required by planning',
          keyFeatures: ['Full wheelchair access', 'Enlarged bathrooms', 'Accessible throughout']
        }
      },
      keyDimensions: {
        doorWidth: '775mm minimum clear (850mm for M4(2))',
        corridorWidth: '900mm minimum (1200mm preferred)',
        rampGradient: '1:12 maximum (1:15 preferred)',
        turningCircle: '1500mm diameter'
      },
      relevantStandards: [
        'Building Regulations Part M',
        'BS 8300:2018',
        'Equality Act 2010',
        'Camden Planning Policy'
      ],
      typicalCosts: {
        accessConsultant: '£500-2,000',
        levelThreshold: '£200-500 per door',
        accessibleWC: '£2,000-4,000',
        passengerLift: '£15,000-40,000'
      }
    }
  });
}
