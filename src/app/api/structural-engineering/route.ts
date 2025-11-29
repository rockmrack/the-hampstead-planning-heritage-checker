/**
 * Structural Engineering API
 * 
 * Assessment of structural engineering requirements
 */

import { NextRequest, NextResponse } from 'next/server';
import structuralEngineering from '@/lib/services/structural-engineering';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      address, 
      postcode, 
      projectType,
      existingStructure,
      wallConstruction,
      roofType,
      foundationType,
      soilType,
      nearbyTrees,
      basementDepth,
      loadIncrease
    } = body;

    if (!address || !postcode || !projectType) {
      return NextResponse.json(
        { error: 'Address, postcode, and project type are required' },
        { status: 400 }
      );
    }

    const assessment = await structuralEngineering.assessStructuralRequirements(
      address,
      postcode,
      projectType,
      {
        existingStructure,
        wallConstruction,
        roofType,
        foundationType,
        soilType,
        nearbyTrees,
        basementDepth,
        loadIncrease
      }
    );

    return NextResponse.json({
      success: true,
      data: assessment
    });
  } catch (error) {
    console.error('Structural engineering assessment error:', error);
    return NextResponse.json(
      { error: 'Failed to assess structural requirements' },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Return structural engineering overview
  return NextResponse.json({
    success: true,
    data: {
      projectTypes: {
        'single-storey-extension': {
          complexity: 'Simple',
          typicalCost: '£1,500-3,000',
          timeline: '2-4 weeks'
        },
        'double-storey-extension': {
          complexity: 'Moderate',
          typicalCost: '£2,500-5,000',
          timeline: '3-5 weeks'
        },
        'loft-conversion': {
          complexity: 'Moderate',
          typicalCost: '£2,000-4,000',
          timeline: '3-5 weeks'
        },
        'basement-excavation': {
          complexity: 'Highly Complex',
          typicalCost: '£8,000-25,000',
          timeline: '6-12 weeks'
        },
        'wall-removal': {
          complexity: 'Moderate',
          typicalCost: '£1,500-3,500',
          timeline: '2-3 weeks'
        },
        'new-build': {
          complexity: 'Complex',
          typicalCost: '£5,000-15,000',
          timeline: '4-8 weeks'
        }
      },
      buildingRegulations: {
        'Part A': 'Structure - all projects',
        'Part B': 'Fire Safety - relevant for lofts',
        'Part C': 'Site preparation - basements',
        'Part L': 'Conservation of fuel - all new elements'
      },
      qualifications: {
        structural: ['CEng', 'MIStructE', 'MICE'],
        geotechnical: ['CGeol', 'CEng with geo experience']
      },
      hampsteadFactors: [
        'London Clay predominant - high shrinkability',
        'Trees common - foundation depth important',
        'Victorian/Edwardian stock - lime mortar considerations',
        'Conservation areas - heritage engineering may apply'
      ]
    }
  });
}
