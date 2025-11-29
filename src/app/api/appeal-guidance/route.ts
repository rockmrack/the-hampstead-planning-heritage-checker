import { NextRequest, NextResponse } from 'next/server';
import AppealGuidanceService from '@/lib/services/appeal-guidance';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { address, refusedApplication } = body;

    if (!address) {
      return NextResponse.json(
        { error: 'Address is required' },
        { status: 400 }
      );
    }

    if (!refusedApplication) {
      return NextResponse.json(
        { error: 'Refused application details are required' },
        { status: 400 }
      );
    }

    const service = new AppealGuidanceService();
    const assessment = service.assessAppeal(address, refusedApplication);

    return NextResponse.json(assessment);
  } catch (error) {
    console.error('Appeal Guidance API error:', error);
    return NextResponse.json(
      { error: 'Failed to assess appeal' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const address = searchParams.get('address');
  const applicationType = searchParams.get('applicationType');
  const reasons = searchParams.get('reasons');

  if (!address) {
    return NextResponse.json(
      { error: 'Address is required' },
      { status: 400 }
    );
  }

  try {
    const service = new AppealGuidanceService();
    const assessment = service.assessAppeal(address, {
      applicationType: applicationType || 'full_planning',
      reasonsForRefusal: reasons ? reasons.split(',') : ['Design', 'Amenity']
    });

    return NextResponse.json(assessment);
  } catch (error) {
    console.error('Appeal Guidance API error:', error);
    return NextResponse.json(
      { error: 'Failed to assess appeal' },
      { status: 500 }
    );
  }
}
