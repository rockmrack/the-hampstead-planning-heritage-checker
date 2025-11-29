/**
 * Ventilation Strategy API
 * 
 * Provides ventilation design guidance for development projects.
 */

import { NextRequest, NextResponse } from 'next/server';
import ventilationStrategy from '@/lib/services/ventilation-strategy';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');
    const postcode = searchParams.get('postcode');
    const projectType = searchParams.get('projectType') || 'residential';

    if (!address || !postcode) {
      return NextResponse.json(
        { error: 'Address and postcode are required' },
        { status: 400 }
      );
    }

    // Parse project details from query params
    const projectDetails = {
      dwellingUnits: searchParams.get('dwellingUnits') ? parseInt(searchParams.get('dwellingUnits')!, 10) : undefined,
      floorspace: searchParams.get('floorspace') ? parseFloat(searchParams.get('floorspace')!) : undefined,
      buildingType: searchParams.get('buildingType') || undefined,
      airtightness: searchParams.get('airtightness') ? parseFloat(searchParams.get('airtightness')!) : undefined,
      heritageConstraints: searchParams.get('heritageConstraints') === 'true',
      kitchenType: searchParams.get('kitchenType') || undefined,
      bathroomCount: searchParams.get('bathroomCount') ? parseInt(searchParams.get('bathroomCount')!, 10) : undefined,
      hasBasement: searchParams.get('hasBasement') === 'true'
    };

    const assessment = await ventilationStrategy.assessVentilation(
      address,
      postcode,
      projectType,
      projectDetails
    );

    return NextResponse.json({
      success: true,
      data: assessment,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Ventilation assessment error:', error);
    return NextResponse.json(
      { error: 'Failed to assess ventilation requirements' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { address, postcode, projectType, projectDetails } = body;

    if (!address || !postcode) {
      return NextResponse.json(
        { error: 'Address and postcode are required' },
        { status: 400 }
      );
    }

    const assessment = await ventilationStrategy.assessVentilation(
      address,
      postcode,
      projectType || 'residential',
      projectDetails || {}
    );

    return NextResponse.json({
      success: true,
      data: assessment,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Ventilation assessment error:', error);
    return NextResponse.json(
      { error: 'Failed to assess ventilation requirements' },
      { status: 500 }
    );
  }
}
