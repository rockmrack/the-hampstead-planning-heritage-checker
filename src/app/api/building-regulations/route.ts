/**
 * Building Regulations API
 * 
 * Provides guidance for Building Regulations compliance
 */

import { NextRequest, NextResponse } from 'next/server';
import buildingRegs from '@/lib/services/building-regulations';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      address, 
      postcode, 
      projectType,
      floorArea,
      storeys,
      isAttached,
      existingDwelling,
      includesHabRoom,
      commercialElement,
      heritageConstraints
    } = body;

    if (!address || !postcode || !projectType) {
      return NextResponse.json(
        { error: 'Address, postcode, and project type are required' },
        { status: 400 }
      );
    }

    const guide = await buildingRegs.getBuildingRegsGuide(
      address,
      postcode,
      projectType,
      {
        floorArea,
        storeys,
        isAttached,
        existingDwelling,
        includesHabRoom,
        commercialElement,
        heritageConstraints
      }
    );

    return NextResponse.json({
      success: true,
      data: guide
    });
  } catch (error) {
    console.error('Building regulations guide error:', error);
    return NextResponse.json(
      { error: 'Failed to generate building regulations guide' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const workType = searchParams.get('workType');
    const floorArea = parseFloat(searchParams.get('floorArea') || '0');
    const distanceFromBoundary = parseFloat(searchParams.get('distance') || '0');
    const isDetached = searchParams.get('detached') === 'true';
    const hasHeating = searchParams.get('heating') === 'true';
    const hasSleeping = searchParams.get('sleeping') === 'true';

    if (!workType) {
      return NextResponse.json(
        { error: 'Work type is required for exemption check' },
        { status: 400 }
      );
    }

    const exemption = await buildingRegs.checkExemption(workType, {
      floorArea,
      distanceFromBoundary,
      isDetached,
      hasHeating,
      hasSleeping
    });

    return NextResponse.json({
      success: true,
      data: exemption
    });
  } catch (error) {
    console.error('Exemption check error:', error);
    return NextResponse.json(
      { error: 'Failed to check Building Regulations exemption' },
      { status: 500 }
    );
  }
}
