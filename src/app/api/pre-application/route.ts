/**
 * Pre-Application Advice API
 * 
 * Provides guidance for seeking pre-application planning advice
 */

import { NextRequest, NextResponse } from 'next/server';
import preApplication from '@/lib/services/pre-application';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      address, 
      postcode, 
      projectType,
      developmentType,
      numUnits,
      floorArea,
      conservationArea,
      listedBuilding,
      previousRefusal,
      controversialAspects
    } = body;

    if (!address || !postcode || !projectType) {
      return NextResponse.json(
        { error: 'Address, postcode, and project type are required' },
        { status: 400 }
      );
    }

    const guide = await preApplication.getPreApplicationGuide(
      address,
      postcode,
      projectType,
      {
        developmentType,
        numUnits,
        floorArea,
        conservationArea,
        listedBuilding,
        previousRefusal,
        controversialAspects
      }
    );

    return NextResponse.json({
      success: true,
      data: guide
    });
  } catch (error) {
    console.error('Pre-application guide error:', error);
    return NextResponse.json(
      { error: 'Failed to generate pre-application guide' },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Return basic fee schedule information
  const feeSchedule = {
    householder: {
      writtenOnly: 250,
      withMeeting: 500,
      turnaround: '28 days'
    },
    minor: {
      writtenOnly: 500,
      withMeeting: 1000,
      turnaround: '35 days'
    },
    major: {
      small: 2500,
      medium: 5000,
      large: 10000,
      turnaround: '42 days or negotiated'
    },
    notes: [
      'Fees correct as of 2024',
      'Additional fees may apply for heritage consultations',
      'Follow-up pre-applications usually 50% reduction',
      'VAT not applicable'
    ]
  };

  return NextResponse.json({
    success: true,
    data: feeSchedule
  });
}
