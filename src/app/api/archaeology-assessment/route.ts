/**
 * Archaeology Assessment API
 * 
 * Provides archaeological assessment guidance for development projects.
 */

import { NextRequest, NextResponse } from 'next/server';
import archaeologyAssessment from '@/lib/services/archaeology-assessment';

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
      groundworks: searchParams.get('groundworks') || undefined,
      excavationDepth: searchParams.get('excavationDepth') ? parseFloat(searchParams.get('excavationDepth')!) : undefined,
      basementProposed: searchParams.get('basementProposed') === 'true',
      siteArea: searchParams.get('siteArea') ? parseFloat(searchParams.get('siteArea')!) : undefined,
      previousDevelopment: searchParams.get('previousDevelopment') === 'true',
      historicBuilding: searchParams.get('historicBuilding') === 'true'
    };

    const assessment = await archaeologyAssessment.assessArchaeology(
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
    console.error('Archaeology assessment error:', error);
    return NextResponse.json(
      { error: 'Failed to assess archaeology requirements' },
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

    const assessment = await archaeologyAssessment.assessArchaeology(
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
    console.error('Archaeology assessment error:', error);
    return NextResponse.json(
      { error: 'Failed to assess archaeology requirements' },
      { status: 500 }
    );
  }
}
