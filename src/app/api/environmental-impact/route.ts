/**
 * Environmental Impact Assessment API
 * 
 * Provides comprehensive environmental assessment for planning applications
 */

import { NextRequest, NextResponse } from 'next/server';
import environmentalImpact from '@/lib/services/environmental-impact';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      address, 
      postcode, 
      projectType,
      siteArea,
      proposedFootprint,
      existingTrees,
      nearWater,
      demolitionInvolved,
      constructionDuration,
      heatingSystem,
      additionalParkingSpaces
    } = body;

    if (!address || !postcode || !projectType) {
      return NextResponse.json(
        { error: 'Address, postcode, and project type are required' },
        { status: 400 }
      );
    }

    const assessment = await environmentalImpact.getEnvironmentalAssessment(
      address,
      postcode,
      projectType,
      {
        siteArea,
        proposedFootprint,
        existingTrees,
        nearWater,
        demolitionInvolved,
        constructionDuration,
        heatingSystem,
        additionalParkingSpaces
      }
    );

    return NextResponse.json({
      success: true,
      data: assessment
    });
  } catch (error) {
    console.error('Environmental impact assessment error:', error);
    return NextResponse.json(
      { error: 'Failed to generate environmental assessment' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const postcode = searchParams.get('postcode');

    if (!postcode) {
      return NextResponse.json(
        { error: 'Postcode is required' },
        { status: 400 }
      );
    }

    // Get ecological designations for the area
    const designations = await environmentalImpact.checkEcologicalDesignations(postcode);

    return NextResponse.json({
      success: true,
      data: designations
    });
  } catch (error) {
    console.error('Ecological designations error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve ecological designations' },
      { status: 500 }
    );
  }
}
