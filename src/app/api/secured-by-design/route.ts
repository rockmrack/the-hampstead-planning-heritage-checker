/**
 * Secured by Design Assessment API Route
 * Provides crime prevention through environmental design guidance
 */

import { NextRequest, NextResponse } from 'next/server';
import securedByDesign from '@/lib/services/secured-by-design';

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

    const assessment = await securedByDesign.assessSecurity(
      address,
      postcode,
      projectType || 'residential',
      projectDetails || {}
    );

    return NextResponse.json(assessment);
  } catch (error) {
    console.error('Security assessment error:', error);
    return NextResponse.json(
      { error: 'Failed to assess security' },
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
    const assessment = await securedByDesign.assessSecurity(
      address,
      postcode,
      projectType || 'residential',
      {}
    );

    return NextResponse.json(assessment);
  } catch (error) {
    console.error('Security assessment error:', error);
    return NextResponse.json(
      { error: 'Failed to assess security' },
      { status: 500 }
    );
  }
}
