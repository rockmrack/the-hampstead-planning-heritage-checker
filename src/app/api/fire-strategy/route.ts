/**
 * Fire Strategy API
 * 
 * Assessment of fire safety requirements for development
 */

import { NextRequest, NextResponse } from 'next/server';
import fireStrategy from '@/lib/services/fire-strategy';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      address, 
      postcode, 
      projectType,
      buildingHeight,
      numberOfStoreys,
      dwellingType,
      existingFireMeasures,
      escapedRoutes,
      occupancyType,
      vulnerableOccupants,
      basementLevel
    } = body;

    if (!address || !postcode || !projectType) {
      return NextResponse.json(
        { error: 'Address, postcode, and project type are required' },
        { status: 400 }
      );
    }

    const assessment = await fireStrategy.assessFireRequirements(
      address,
      postcode,
      projectType,
      {
        buildingHeight,
        numberOfStoreys,
        dwellingType,
        existingFireMeasures,
        escapedRoutes,
        occupancyType,
        vulnerableOccupants,
        basementLevel
      }
    );

    return NextResponse.json({
      success: true,
      data: assessment
    });
  } catch (error) {
    console.error('Fire strategy assessment error:', error);
    return NextResponse.json(
      { error: 'Failed to assess fire requirements' },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Return fire strategy overview
  return NextResponse.json({
    success: true,
    data: {
      buildingRegulations: {
        partB: {
          b1: 'Means of warning and escape',
          b2: 'Internal fire spread (linings)',
          b3: 'Internal fire spread (structure)',
          b4: 'External fire spread',
          b5: 'Access for fire service'
        }
      },
      fireResistance: {
        standard: '30 minutes (most residential)',
        enhanced: '60 minutes (5+ storeys or >18m)',
        elements: ['Walls', 'Floors', 'Doors', 'Stairway enclosure']
      },
      detectionGrades: {
        'Grade A': 'Full system with control panel - HMOs, commercial',
        'Grade D1': 'Mains with backup - standard residential',
        'Grade D2': 'Mains only - minimum acceptable',
        'Grade F1': 'Battery only - not for new work'
      },
      projectRisk: {
        low: ['Single storey extension'],
        moderate: ['Loft conversion', 'Double storey extension'],
        significant: ['Basement', 'New build'],
        high: ['Flat conversion', 'HMO', 'Change of use']
      },
      typicalCosts: {
        fireStrategy: '£1,500-5,000',
        fireDoors: '£400-800 per door',
        alarmSystem: '£500-3,000'
      }
    }
  });
}
