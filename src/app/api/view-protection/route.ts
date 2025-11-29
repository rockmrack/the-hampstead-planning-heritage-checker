/**
 * View Protection Monitor API Route
 */

import { NextRequest, NextResponse } from 'next/server';
import { viewProtectionMonitor } from '@/lib/services/view-protection-monitor';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  // Get view by ID
  const viewId = searchParams.get('id');
  if (viewId) {
    const view = viewProtectionMonitor.getView(viewId);
    if (!view) {
      return NextResponse.json(
        { error: 'View not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(view);
  }
  
  // Get views by borough
  const borough = searchParams.get('borough');
  if (borough) {
    const views = viewProtectionMonitor.getViewsByBorough(borough);
    return NextResponse.json({ views, count: views.length });
  }
  
  // Get views affecting a postcode area
  const postcode = searchParams.get('postcode');
  if (postcode) {
    const views = viewProtectionMonitor.getViewsAffectingArea(postcode);
    return NextResponse.json({ views, count: views.length });
  }
  
  return NextResponse.json({
    error: 'Missing parameters',
    usage: {
      byId: '?id=view-001',
      byBorough: '?borough=Camden',
      byPostcode: '?postcode=NW3',
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { address, postcode, coordinates, proposedHeight } = body;
    
    if (!address || !postcode || !coordinates) {
      return NextResponse.json(
        { error: 'Missing required fields: address, postcode, coordinates' },
        { status: 400 }
      );
    }
    
    const assessment = viewProtectionMonitor.assessViewImpact(
      address,
      postcode,
      coordinates,
      proposedHeight
    );
    
    return NextResponse.json(assessment);
  } catch (error) {
    console.error('View protection assessment error:', error);
    return NextResponse.json(
      { error: 'Failed to assess view impact' },
      { status: 500 }
    );
  }
}
