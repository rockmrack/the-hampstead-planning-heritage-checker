/**
 * Transport Assessment API
 * 
 * Provides transport and parking assessment for development projects.
 */

import { NextRequest, NextResponse } from 'next/server';
import transportAssessment from '@/lib/services/transport-assessment';

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
      parkingSpaces: searchParams.get('parkingSpaces') ? parseInt(searchParams.get('parkingSpaces')!, 10) : undefined,
      cycleSpaces: searchParams.get('cycleSpaces') ? parseInt(searchParams.get('cycleSpaces')!, 10) : undefined,
      existingUse: searchParams.get('existingUse') || undefined,
      proposedUse: searchParams.get('proposedUse') || undefined,
      siteAccess: searchParams.get('siteAccess') || undefined,
      publicTransport: searchParams.get('publicTransport') === 'true',
      deliveryRequirements: searchParams.get('deliveryRequirements') === 'true'
    };

    const assessment = await transportAssessment.assessTransportRequirements(
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
    console.error('Transport assessment error:', error);
    return NextResponse.json(
      { error: 'Failed to assess transport requirements' },
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

    const assessment = await transportAssessment.assessTransportRequirements(
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
    console.error('Transport assessment error:', error);
    return NextResponse.json(
      { error: 'Failed to assess transport requirements' },
      { status: 500 }
    );
  }
}
