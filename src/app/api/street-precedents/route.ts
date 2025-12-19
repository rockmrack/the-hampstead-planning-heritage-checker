/**
 * Street Precedents API Route
 */

import { NextRequest, NextResponse } from 'next/server';
import { streetPrecedentService } from '@/lib/services/street-precedents';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  // Get by street name
  const streetName = searchParams.get('street');
  const postcode = searchParams.get('postcode');
  
  if (streetName && postcode) {
    const precedents = streetPrecedentService.getStreetPrecedents(streetName, postcode);
    return NextResponse.json(precedents);
  }
  
  // Get by coordinates
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');
  const radius = searchParams.get('radius');
  
  if (lat && lng) {
    const precedents = streetPrecedentService.getNearbyPrecedents(
      parseFloat(lat),
      parseFloat(lng),
      radius ? parseInt(radius) : 200
    );
    return NextResponse.json(precedents);
  }
  
  // Get house history
  const houseNumber = searchParams.get('houseNumber');
  if (houseNumber && streetName && postcode) {
    const history = streetPrecedentService.getHouseHistory(houseNumber, streetName, postcode);
    return NextResponse.json(history);
  }
  
  return NextResponse.json(
    { 
      error: 'Missing parameters. Use street+postcode, lat+lng, or houseNumber+street+postcode',
      usage: {
        byStreet: '?street=Flask Walk&postcode=NW3',
        byCoordinates: '?lat=51.558&lng=-0.177&radius=200',
        byHouse: '?houseNumber=42&street=Flask Walk&postcode=NW3',
      },
    },
    { status: 400 }
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { lat, lng, projectType, propertyType, heritageStatus } = body;

    if (!projectType) {
      return NextResponse.json(
        { error: 'Missing required field: projectType' },
        { status: 400 }
      );
    }

    // Get similar project precedents
    const precedents = await streetPrecedentService.getSimilarProjectPrecedents(
      lat,
      lng,
      projectType,
      propertyType || 'house',
      heritageStatus || 'GREEN'
    );

    return NextResponse.json(precedents);
  } catch (error) {
    console.error('Street precedents error:', error);
    return NextResponse.json(
      { error: 'Failed to get precedents' },
      { status: 500 }
    );
  }
}
