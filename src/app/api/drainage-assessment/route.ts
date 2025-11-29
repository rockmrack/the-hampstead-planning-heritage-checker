/**
 * Drainage Assessment API Route
 * Provides flood risk and surface water drainage analysis
 */

import { NextRequest, NextResponse } from 'next/server';
import drainageAssessment from '@/lib/services/drainage-assessment';

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

    const assessment = await drainageAssessment.assessDrainage(
      address,
      postcode,
      projectType || 'extension',
      projectDetails || {}
    );

    return NextResponse.json(assessment);
  } catch (error) {
    console.error('Drainage assessment error:', error);
    return NextResponse.json(
      { error: 'Failed to assess drainage' },
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
    const assessment = await drainageAssessment.assessDrainage(
      address,
      postcode,
      projectType || 'extension',
      {}
    );

    return NextResponse.json(assessment);
  } catch (error) {
    console.error('Drainage assessment error:', error);
    return NextResponse.json(
      { error: 'Failed to assess drainage' },
      { status: 500 }
    );
  }
}
