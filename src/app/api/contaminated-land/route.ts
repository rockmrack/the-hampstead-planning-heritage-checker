/**
 * Contaminated Land Assessment API
 * 
 * Provides contaminated land assessment guidance for development projects.
 */

import { NextRequest, NextResponse } from 'next/server';
import contaminatedLand from '@/lib/services/contaminated-land';

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
      previousUse: searchParams.get('previousUse') || undefined,
      proposedUse: searchParams.get('proposedUse') || undefined,
      gardens: searchParams.get('gardens') === 'true',
      basementExcavation: searchParams.get('basementExcavation') === 'true',
      siteArea: searchParams.get('siteArea') ? parseFloat(searchParams.get('siteArea')!) : undefined,
      groundworks: searchParams.get('groundworks') || undefined
    };

    const assessment = await contaminatedLand.assessContaminatedLand(
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
    console.error('Contaminated land assessment error:', error);
    return NextResponse.json(
      { error: 'Failed to assess contaminated land' },
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

    const assessment = await contaminatedLand.assessContaminatedLand(
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
    console.error('Contaminated land assessment error:', error);
    return NextResponse.json(
      { error: 'Failed to assess contaminated land' },
      { status: 500 }
    );
  }
}
