/**
 * Structural Appraisal API Route
 * Provides preliminary structural assessment guidance
 */

import { NextRequest, NextResponse } from 'next/server';
import structuralAppraisal from '@/lib/services/structural-appraisal';

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

    const assessment = await structuralAppraisal.assessStructure(
      address,
      postcode,
      projectType || 'extension',
      projectDetails || {}
    );

    return NextResponse.json(assessment);
  } catch (error) {
    console.error('Structural appraisal error:', error);
    return NextResponse.json(
      { error: 'Failed to generate structural appraisal' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const address = searchParams.get('address');
  const postcode = searchParams.get('postcode');
  const projectType = searchParams.get('projectType');

  if (!address || !postcode) {
    return NextResponse.json(
      { error: 'Address and postcode are required' },
      { status: 400 }
    );
  }

  try {
    const assessment = await structuralAppraisal.assessStructure(
      address,
      postcode,
      projectType || 'extension',
      {}
    );

    return NextResponse.json(assessment);
  } catch (error) {
    console.error('Structural appraisal error:', error);
    return NextResponse.json(
      { error: 'Failed to generate structural appraisal' },
      { status: 500 }
    );
  }
}
