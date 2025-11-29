/**
 * External Lighting Assessment API Route
 * Provides lighting design guidance for external areas
 */

import { NextRequest, NextResponse } from 'next/server';
import externalLightingAssessment from '@/lib/services/external-lighting';

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

    const assessment = await externalLightingAssessment.assessLighting(
      address,
      postcode,
      projectType || 'residential',
      projectDetails || {}
    );

    return NextResponse.json(assessment);
  } catch (error) {
    console.error('External lighting assessment error:', error);
    return NextResponse.json(
      { error: 'Failed to assess external lighting' },
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
    const assessment = await externalLightingAssessment.assessLighting(
      address,
      postcode,
      projectType || 'residential',
      {}
    );

    return NextResponse.json(assessment);
  } catch (error) {
    console.error('External lighting assessment error:', error);
    return NextResponse.json(
      { error: 'Failed to assess external lighting' },
      { status: 500 }
    );
  }
}
