import { NextRequest, NextResponse } from 'next/server';
import PlanningFeeCalculatorService from '@/lib/services/planning-fee-calculator';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { applicationType, developmentDetails, applicantDetails } = body;

    if (!applicationType) {
      return NextResponse.json(
        { error: 'Application type is required' },
        { status: 400 }
      );
    }

    if (!developmentDetails) {
      return NextResponse.json(
        { error: 'Development details are required' },
        { status: 400 }
      );
    }

    const service = new PlanningFeeCalculatorService();
    const calculation = service.calculatePlanningFee(
      applicationType,
      developmentDetails,
      applicantDetails || {}
    );

    return NextResponse.json(calculation);
  } catch (error) {
    console.error('Planning Fee Calculator API error:', error);
    return NextResponse.json(
      { error: 'Failed to calculate planning fee' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const applicationType = searchParams.get('applicationType');
  const floorArea = searchParams.get('floorArea');
  const units = searchParams.get('units');
  const siteArea = searchParams.get('siteArea');

  if (!applicationType) {
    return NextResponse.json(
      { error: 'Application type is required' },
      { status: 400 }
    );
  }

  try {
    const service = new PlanningFeeCalculatorService();
    const calculation = service.calculatePlanningFee(
      applicationType,
      {
        floorArea: floorArea ? parseFloat(floorArea) : undefined,
        numberOfUnits: units ? parseInt(units) : undefined,
        siteArea: siteArea ? parseFloat(siteArea) : undefined
      },
      {}
    );

    return NextResponse.json(calculation);
  } catch (error) {
    console.error('Planning Fee Calculator API error:', error);
    return NextResponse.json(
      { error: 'Failed to calculate planning fee' },
      { status: 500 }
    );
  }
}
