import { NextRequest, NextResponse } from 'next/server';
import ViabilityAssessmentService from '@/lib/services/viability-assessment';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { address, developmentDetails, costInputs } = body;

    if (!address) {
      return NextResponse.json(
        { error: 'Address is required' },
        { status: 400 }
      );
    }

    if (!developmentDetails) {
      return NextResponse.json(
        { error: 'Development details are required' },
        { status: 400 }
      );
    }

    const service = new ViabilityAssessmentService();
    const assessment = service.assessViability(
      address,
      developmentDetails,
      costInputs
    );

    return NextResponse.json(assessment);
  } catch (error) {
    console.error('Viability Assessment API error:', error);
    return NextResponse.json(
      { error: 'Failed to perform viability assessment' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const address = searchParams.get('address');
  const siteArea = searchParams.get('siteArea');
  const gia = searchParams.get('gia');
  const units = searchParams.get('units');
  const devType = searchParams.get('developmentType');

  if (!address) {
    return NextResponse.json(
      { error: 'Address is required' },
      { status: 400 }
    );
  }

  try {
    const service = new ViabilityAssessmentService();
    const assessment = service.assessViability(
      address,
      {
        siteArea: siteArea ? parseFloat(siteArea) : undefined,
        grossInternalArea: gia ? parseFloat(gia) : 500,
        numberOfUnits: units ? parseInt(units) : 1,
        developmentType: devType || 'residential_flat'
      }
    );

    return NextResponse.json(assessment);
  } catch (error) {
    console.error('Viability Assessment API error:', error);
    return NextResponse.json(
      { error: 'Failed to perform viability assessment' },
      { status: 500 }
    );
  }
}
