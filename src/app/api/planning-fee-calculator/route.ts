import { NextRequest, NextResponse } from 'next/server';
import planningFeeCalculator from '@/lib/services/planning-fee-calculator';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { address, postcode, projectType, projectDetails } = body;

    if (!address) {
      return NextResponse.json(
        { error: 'Address is required' },
        { status: 400 }
      );
    }

    if (!projectType) {
      return NextResponse.json(
        { error: 'Project type is required' },
        { status: 400 }
      );
    }

    const calculation = await planningFeeCalculator.calculateFees(
      address,
      postcode || '',
      projectType,
      projectDetails || {}
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
  const address = searchParams.get('address');
  const postcode = searchParams.get('postcode');
  const projectType = searchParams.get('projectType');

  if (!address) {
    return NextResponse.json(
      { error: 'Address is required' },
      { status: 400 }
    );
  }

  if (!projectType) {
    return NextResponse.json(
      { error: 'Project type is required' },
      { status: 400 }
    );
  }

  try {
    const calculation = await planningFeeCalculator.calculateFees(
      address,
      postcode || '',
      projectType,
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
