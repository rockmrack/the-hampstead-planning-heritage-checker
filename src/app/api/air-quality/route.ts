/**
 * Air Quality Assessment API Route
 * Provides air quality impact analysis for development projects
 */

import { NextRequest, NextResponse } from 'next/server';
import airQualityAssessment from '@/lib/services/air-quality';

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

    const assessment = await airQualityAssessment.assessAirQuality(
      address,
      postcode,
      projectType || 'residential',
      projectDetails || {}
    );

    return NextResponse.json(assessment);
  } catch (error) {
    console.error('Air quality assessment error:', error);
    return NextResponse.json(
      { error: 'Failed to assess air quality' },
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
    const assessment = await airQualityAssessment.assessAirQuality(
      address,
      postcode,
      projectType || 'residential',
      {}
    );

    return NextResponse.json(assessment);
  } catch (error) {
    console.error('Air quality assessment error:', error);
    return NextResponse.json(
      { error: 'Failed to assess air quality' },
      { status: 500 }
    );
  }
}
