import { NextRequest, NextResponse } from 'next/server';
import Section106Service from '@/lib/services/section-106';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { address, developmentDetails } = body;

    if (!address) {
      return NextResponse.json(
        { error: 'Address is required' },
        { status: 400 }
      );
    }

    const service = new Section106Service();
    const assessment = service.assessS106Obligations(
      address,
      developmentDetails || {}
    );

    return NextResponse.json(assessment);
  } catch (error) {
    console.error('Section 106 API error:', error);
    return NextResponse.json(
      { error: 'Failed to assess Section 106 obligations' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const address = searchParams.get('address');
  const units = searchParams.get('units');
  const commercial = searchParams.get('commercial');
  const familyUnits = searchParams.get('familyUnits');

  if (!address) {
    return NextResponse.json(
      { error: 'Address is required' },
      { status: 400 }
    );
  }

  try {
    const service = new Section106Service();
    const assessment = service.assessS106Obligations(address, {
      numberOfUnits: units ? parseInt(units) : undefined,
      commercialFloorspace: commercial ? parseFloat(commercial) : undefined,
      familyUnits: familyUnits ? parseInt(familyUnits) : undefined
    });

    return NextResponse.json(assessment);
  } catch (error) {
    console.error('Section 106 API error:', error);
    return NextResponse.json(
      { error: 'Failed to assess Section 106 obligations' },
      { status: 500 }
    );
  }
}
