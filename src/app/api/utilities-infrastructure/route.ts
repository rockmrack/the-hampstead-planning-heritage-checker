/**
 * Utilities Infrastructure Assessment API Route
 * Provides utility connections and infrastructure guidance
 */

import { NextRequest, NextResponse } from 'next/server';
import utilitiesInfrastructure from '@/lib/services/utilities-infrastructure';

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

    const assessment = await utilitiesInfrastructure.assessUtilities(
      address,
      postcode,
      projectType || 'extension',
      projectDetails || {}
    );

    return NextResponse.json(assessment);
  } catch (error) {
    console.error('Utilities assessment error:', error);
    return NextResponse.json(
      { error: 'Failed to assess utilities' },
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
    const assessment = await utilitiesInfrastructure.assessUtilities(
      address,
      postcode,
      projectType || 'extension',
      {}
    );

    return NextResponse.json(assessment);
  } catch (error) {
    console.error('Utilities assessment error:', error);
    return NextResponse.json(
      { error: 'Failed to assess utilities' },
      { status: 500 }
    );
  }
}
