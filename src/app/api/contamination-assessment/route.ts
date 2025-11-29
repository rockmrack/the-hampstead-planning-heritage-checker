/**
 * Contamination Assessment API Route
 * Provides land contamination risk assessment guidance
 */

import { NextRequest, NextResponse } from 'next/server';
import contaminationAssessment from '@/lib/services/contamination-assessment';

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

    const assessment = await contaminationAssessment.assessContamination(
      address,
      postcode,
      projectType || 'residential',
      projectDetails || {}
    );

    return NextResponse.json(assessment);
  } catch (error) {
    console.error('Contamination assessment error:', error);
    return NextResponse.json(
      { error: 'Failed to assess contamination' },
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
    const assessment = await contaminationAssessment.assessContamination(
      address,
      postcode,
      projectType || 'residential',
      {}
    );

    return NextResponse.json(assessment);
  } catch (error) {
    console.error('Contamination assessment error:', error);
    return NextResponse.json(
      { error: 'Failed to assess contamination' },
      { status: 500 }
    );
  }
}
