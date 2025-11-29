/**
 * Flood Risk Assessment API
 * 
 * Provides flood risk and drainage assessment for development projects.
 */

import { NextRequest, NextResponse } from 'next/server';
import floodRisk from '@/lib/services/flood-risk';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');
    const postcode = searchParams.get('postcode');
    const projectType = searchParams.get('projectType') || 'extension';

    if (!address || !postcode) {
      return NextResponse.json(
        { error: 'Address and postcode are required' },
        { status: 400 }
      );
    }

    // Parse project details from query params
    const projectDetails = {
      siteArea: searchParams.get('siteArea') ? parseFloat(searchParams.get('siteArea')!) : undefined,
      impermeable: searchParams.get('impermeable') ? parseFloat(searchParams.get('impermeable')!) : undefined,
      basementProposed: searchParams.get('basementProposed') === 'true',
      nearWatercourse: searchParams.get('nearWatercourse') === 'true',
      existingDrainage: searchParams.get('existingDrainage') || undefined,
      proposedDrainage: searchParams.get('proposedDrainage') || undefined,
      groundLevel: searchParams.get('groundLevel') || undefined
    };

    const assessment = await floodRisk.assessFloodRisk(
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
    console.error('Flood risk assessment error:', error);
    return NextResponse.json(
      { error: 'Failed to assess flood risk' },
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

    const assessment = await floodRisk.assessFloodRisk(
      address,
      postcode,
      projectType || 'extension',
      projectDetails || {}
    );

    return NextResponse.json({
      success: true,
      data: assessment,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Flood risk assessment error:', error);
    return NextResponse.json(
      { error: 'Failed to assess flood risk' },
      { status: 500 }
    );
  }
}
