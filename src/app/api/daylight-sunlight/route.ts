/**
 * Daylight and Sunlight API
 * 
 * Assessment of daylight/sunlight impacts for planning
 */

import { NextRequest, NextResponse } from 'next/server';
import daylightSunlight from '@/lib/services/daylight-sunlight';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      address, 
      postcode, 
      projectType,
      heightIncrease,
      depthIncrease,
      distanceToNeighbors,
      orientationToNeighbors,
      existingBuilding,
      neighborWindows,
      neighborGardens
    } = body;

    if (!address || !postcode || !projectType) {
      return NextResponse.json(
        { error: 'Address, postcode, and project type are required' },
        { status: 400 }
      );
    }

    const assessment = await daylightSunlight.assessDaylightSunlight(
      address,
      postcode,
      projectType,
      {
        heightIncrease,
        depthIncrease,
        distanceToNeighbors,
        orientationToNeighbors,
        existingBuilding,
        neighborWindows,
        neighborGardens
      }
    );

    return NextResponse.json({
      success: true,
      data: assessment
    });
  } catch (error) {
    console.error('Daylight/sunlight assessment error:', error);
    return NextResponse.json(
      { error: 'Failed to assess daylight/sunlight' },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Return BRE guidelines summary
  return NextResponse.json({
    success: true,
    data: {
      breTests: {
        VSC: {
          name: 'Vertical Sky Component',
          standard: '27% minimum for good daylight',
          pass: '>= 27% OR >= 0.8 × former value',
          type: 'Daylight'
        },
        NSL: {
          name: 'No-Sky Line',
          standard: '50% of room should see sky',
          pass: '>= 0.8 × former value',
          type: 'Daylight'
        },
        ADF: {
          name: 'Average Daylight Factor',
          standard: 'Kitchen 2%, Living 1.5%, Bedroom 1%',
          pass: 'Meet minimum for room type',
          type: 'Daylight (internal)'
        },
        APSH: {
          name: 'Annual Probable Sunlight Hours',
          standard: '25% total, 5% winter',
          pass: '>= 25% annual, >= 5% winter',
          type: 'Sunlight'
        },
        garden: {
          name: 'Garden Sunlight',
          standard: '2 hours on 21 March to 50% area',
          pass: '>= 50% receives >= 2 hours',
          type: 'Overshadowing'
        }
      },
      whenRequired: [
        'Extensions close to neighboring windows',
        'Two-storey or larger extensions',
        'Basement developments',
        'New-build residential',
        'Height increases affecting neighbors'
      ],
      typicalCosts: {
        basicAnalysis: '£500-1,000',
        standardReport: '£1,000-2,000',
        detailedReport: '£2,000-4,000+'
      },
      designTips: [
        'Step back upper floors from neighbors',
        'Use pitched roofs sloping away',
        'Light-colored external materials',
        'Follow 45-degree rule as starting point',
        'Consider single storey where impact high'
      ]
    }
  });
}
