import { NextRequest, NextResponse } from 'next/server';
import CILCalculatorService from '@/lib/services/cil-calculator';

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

    if (!developmentDetails) {
      return NextResponse.json(
        { error: 'Development details are required' },
        { status: 400 }
      );
    }

    const service = new CILCalculatorService();
    const calculation = service.calculateCIL(address, developmentDetails);

    return NextResponse.json(calculation);
  } catch (error) {
    console.error('CIL Calculator API error:', error);
    return NextResponse.json(
      { error: 'Failed to calculate CIL' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const address = searchParams.get('address');
  const gia = searchParams.get('gia');
  const existingFloorspace = searchParams.get('existingFloorspace');
  const inUse = searchParams.get('inUse');
  const developmentType = searchParams.get('developmentType');

  if (!address) {
    return NextResponse.json(
      { error: 'Address is required' },
      { status: 400 }
    );
  }

  try {
    const service = new CILCalculatorService();
    const calculation = service.calculateCIL(address, {
      grossInternalArea: gia ? parseFloat(gia) : 200,
      existingFloorspace: existingFloorspace ? parseFloat(existingFloorspace) : 0,
      existingInUse: inUse === 'true',
      developmentType: (developmentType as 'residential' | 'studentAccommodation' | 'retail' | 'office' | 'hotel' | 'mixed' | 'other') || 'residential'
    });

    return NextResponse.json(calculation);
  } catch (error) {
    console.error('CIL Calculator API error:', error);
    return NextResponse.json(
      { error: 'Failed to calculate CIL' },
      { status: 500 }
    );
  }
}
