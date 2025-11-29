/**
 * Overheating Assessment API
 * 
 * Provides overheating risk assessment guidance for development projects.
 */

import { NextRequest, NextResponse } from 'next/server';
import overheatingAssessment from '@/lib/services/overheating-assessment';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');
    const postcode = searchParams.get('postcode');
    const projectType = searchParams.get('projectType') || 'residential';

    if (!address || !postcode) {
      return NextResponse.json(
        { error: 'Address and postcode are required' },
        { status: 400 }
      );
    }

    // Parse project details from query params
    const projectDetails = {
      dwellingUnits: searchParams.get('dwellingUnits') ? parseInt(searchParams.get('dwellingUnits')!, 10) : undefined,
      floorspace: searchParams.get('floorspace') ? parseFloat(searchParams.get('floorspace')!) : undefined,
      buildingType: searchParams.get('buildingType') || undefined,
      orientation: searchParams.get('orientation') || undefined,
      glazingRatio: searchParams.get('glazingRatio') ? parseFloat(searchParams.get('glazingRatio')!) : undefined,
      crossVentilation: searchParams.get('crossVentilation') === 'true',
      singleAspect: searchParams.get('singleAspect') === 'true',
      topFloor: searchParams.get('topFloor') === 'true',
      noiseSensitive: searchParams.get('noiseSensitive') === 'true'
    };

    const assessment = await overheatingAssessment.assessOverheating(
      address,
      postcode,
      projectType,
      projectDetails
    );

    return NextResponse.json({
      success: true,
      data: assessment,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Overheating assessment error:', error);
    return NextResponse.json(
      { error: 'Failed to assess overheating risk' },
      { status: 500 }
    );
  }
}

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

    const assessment = await overheatingAssessment.assessOverheating(
      address,
      postcode,
      projectType || 'residential',
      projectDetails || {}
    );

    return NextResponse.json({
      success: true,
      data: assessment,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Overheating assessment error:', error);
    return NextResponse.json(
      { error: 'Failed to assess overheating risk' },
      { status: 500 }
    );
  }
}
