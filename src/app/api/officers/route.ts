/**
 * Officer Profiles API Route
 */

import { NextRequest, NextResponse } from 'next/server';
import { officerProfilesService } from '@/lib/services/officer-profiles';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  // Get officer by ID
  const officerId = searchParams.get('id');
  if (officerId) {
    const officer = officerProfilesService.getOfficer(officerId);
    if (!officer) {
      return NextResponse.json(
        { error: 'Officer not found' },
        { status: 404 }
      );
    }
    const tips = officerProfilesService.getTipsForOfficer(officerId);
    return NextResponse.json({ officer, tips });
  }
  
  // Get officers by borough
  const borough = searchParams.get('borough');
  if (borough) {
    const officers = officerProfilesService.getOfficersByBorough(borough);
    return NextResponse.json({ officers, count: officers.length });
  }
  
  // Get officers for an area/postcode
  const area = searchParams.get('area');
  if (area) {
    const officers = officerProfilesService.getOfficersForArea(area);
    return NextResponse.json({ officers, count: officers.length });
  }
  
  return NextResponse.json({
    error: 'Missing parameters',
    usage: {
      byId: '?id=officer-001',
      byBorough: '?borough=Camden',
      byArea: '?area=NW3',
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { postcode, projectType, isConservationArea, isListedBuilding } = body;
    
    if (!postcode || !projectType) {
      return NextResponse.json(
        { error: 'Missing required fields: postcode, projectType' },
        { status: 400 }
      );
    }
    
    const report = officerProfilesService.generateTendencyReport(
      postcode,
      projectType,
      isConservationArea || false,
      isListedBuilding || false
    );
    
    if (!report) {
      return NextResponse.json(
        { error: 'No officers found for this area' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(report);
  } catch (error) {
    console.error('Officer profile error:', error);
    return NextResponse.json(
      { error: 'Failed to generate officer report' },
      { status: 500 }
    );
  }
}
