/**
 * Site Visit Preparation API
 * 
 * Provides guidance for preparing for planning officer site visits
 */

import { NextRequest, NextResponse } from 'next/server';
import siteVisitPreparation from '@/lib/services/site-visit-preparation';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      address, 
      postcode, 
      projectType,
      visitType,
      visitDate,
      conservationArea,
      listedBuilding,
      neighborObjections,
      isApplicant
    } = body;

    if (!address || !postcode || !projectType) {
      return NextResponse.json(
        { error: 'Address, postcode, and project type are required' },
        { status: 400 }
      );
    }

    const preparation = await siteVisitPreparation.getSiteVisitPreparation(
      address,
      postcode,
      projectType,
      {
        visitType,
        visitDate,
        conservationArea,
        listedBuilding,
        neighborObjections,
        isApplicant
      }
    );

    return NextResponse.json({
      success: true,
      data: preparation
    });
  } catch (error) {
    console.error('Site visit preparation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate site visit preparation guide' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const visitDate = searchParams.get('visitDate');

    if (!visitDate) {
      return NextResponse.json(
        { error: 'Visit date is required' },
        { status: 400 }
      );
    }

    // Get weather-specific preparation advice
    const weatherPrep = await siteVisitPreparation.getWeatherPreparation(visitDate);

    return NextResponse.json({
      success: true,
      data: weatherPrep
    });
  } catch (error) {
    console.error('Weather preparation error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve weather preparation advice' },
      { status: 500 }
    );
  }
}
