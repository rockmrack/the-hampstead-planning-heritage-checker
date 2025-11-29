/**
 * Parking Requirements API
 * 
 * Provides comprehensive parking analysis for planning applications
 */

import { NextRequest, NextResponse } from 'next/server';
import parkingRequirements from '@/lib/services/parking-requirements';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      address, 
      postcode, 
      projectType,
      existingSpaces,
      proposedUnits,
      commercialFloorArea,
      commercialType,
      isNewBuild,
      hasGarage
    } = body;

    if (!address || !postcode || !projectType) {
      return NextResponse.json(
        { error: 'Address, postcode, and project type are required' },
        { status: 400 }
      );
    }

    const assessment = await parkingRequirements.getParkingAssessment(
      address,
      postcode,
      projectType,
      {
        existingSpaces,
        proposedUnits,
        commercialFloorArea,
        commercialType,
        isNewBuild,
        hasGarage
      }
    );

    return NextResponse.json({
      success: true,
      data: assessment
    });
  } catch (error) {
    console.error('Parking assessment error:', error);
    return NextResponse.json(
      { error: 'Failed to generate parking assessment' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'crossover') {
      const address = searchParams.get('address') || '';
      const postcode = searchParams.get('postcode') || '';
      const newCrossover = searchParams.get('newCrossover') === 'true';
      const existingCrossover = searchParams.get('existingCrossover') === 'true';
      
      const assessment = await parkingRequirements.getVehicleAccessAssessment(
        address,
        postcode,
        {
          newCrossoverRequired: newCrossover,
          existingCrossover
        }
      );

      return NextResponse.json({
        success: true,
        data: assessment
      });
    }

    if (action === 'carclub') {
      const units = parseInt(searchParams.get('units') || '0');
      const carFree = searchParams.get('carFree') === 'true';
      
      const requirements = await parkingRequirements.getCarClubRequirements(
        units,
        carFree
      );

      return NextResponse.json({
        success: true,
        data: requirements
      });
    }

    return NextResponse.json(
      { error: 'Valid action parameter required (crossover, carclub)' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Parking requirements error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve parking requirements' },
      { status: 500 }
    );
  }
}
