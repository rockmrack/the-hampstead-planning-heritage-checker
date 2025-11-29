/**
 * Energy Performance Assessment API
 * 
 * Provides energy performance and Part L compliance guidance.
 */

import { NextRequest, NextResponse } from 'next/server';
import energyPerformance from '@/lib/services/energy-performance';

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
      newBuild: searchParams.get('newBuild') === 'true',
      heritageConstraints: searchParams.get('heritageConstraints') === 'true',
      existingHeating: searchParams.get('existingHeating') || undefined,
      proposedHeating: searchParams.get('proposedHeating') || undefined
    };

    const assessment = await energyPerformance.assessEnergyPerformance(
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
    console.error('Energy performance assessment error:', error);
    return NextResponse.json(
      { error: 'Failed to assess energy performance' },
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

    const assessment = await energyPerformance.assessEnergyPerformance(
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
    console.error('Energy performance assessment error:', error);
    return NextResponse.json(
      { error: 'Failed to assess energy performance' },
      { status: 500 }
    );
  }
}
