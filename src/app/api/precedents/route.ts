/**
 * Street Precedents API Routes
 * 
 * Provides endpoints for analyzing street-level planning precedents,
 * finding similar successful applications, and getting design guidance.
 */

import { NextRequest, NextResponse } from 'next/server';
import { streetPrecedentService } from '@/lib/services/street-precedents';

// GET /api/precedents - Get street analysis or precedents
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'analyze';
    const streetName = searchParams.get('street');
    const postcode = searchParams.get('postcode') || '';
    const projectType = searchParams.get('projectType') || undefined;
    const lat = searchParams.get('lat') ? parseFloat(searchParams.get('lat')!) : undefined;
    const lng = searchParams.get('lng') ? parseFloat(searchParams.get('lng')!) : undefined;
    const radius = searchParams.get('radius') ? parseInt(searchParams.get('radius')!) : 100;
    
    switch (action) {
      case 'analyze': {
        if (!streetName) {
          return NextResponse.json(
            { success: false, error: 'Street name is required' },
            { status: 400 }
          );
        }
        
        const analysis = await streetPrecedentService.getStreetPrecedents(
          streetName,
          postcode
        );
        
        return NextResponse.json({
          success: true,
          data: analysis,
          timestamp: new Date().toISOString()
        });
      }
      
      case 'nearby': {
        if (!lat || !lng) {
          return NextResponse.json(
            { success: false, error: 'Latitude and longitude are required' },
            { status: 400 }
          );
        }
        
        const nearby = await streetPrecedentService.getNearbyPrecedents(
          lat,
          lng,
          radius,
          projectType
        );
        
        return NextResponse.json({
          success: true,
          data: nearby,
          timestamp: new Date().toISOString()
        });
      }
      
      case 'similar': {
        if (!lat || !lng || !projectType) {
          return NextResponse.json(
            { success: false, error: 'Latitude, longitude, and project type are required' },
            { status: 400 }
          );
        }
        
        const propertyType = searchParams.get('propertyType') || 'residential';
        const heritageStatus = (searchParams.get('heritageStatus') || 'GREEN') as 'RED' | 'AMBER' | 'GREEN';
        
        const similar = await streetPrecedentService.getSimilarProjectPrecedents(
          lat,
          lng,
          projectType,
          propertyType,
          heritageStatus
        );
        
        return NextResponse.json({
          success: true,
          data: similar,
          timestamp: new Date().toISOString()
        });
      }
      
      case 'house': {
        const houseNumber = searchParams.get('houseNumber');
        
        if (!houseNumber || !streetName) {
          return NextResponse.json(
            { success: false, error: 'House number and street name are required' },
            { status: 400 }
          );
        }
        
        const history = await streetPrecedentService.getHouseHistory(
          houseNumber,
          streetName,
          postcode
        );
        
        return NextResponse.json({
          success: true,
          data: history,
          timestamp: new Date().toISOString()
        });
      }
      
      default:
        return NextResponse.json(
          { success: false, error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }
    
  } catch (error) {
    console.error('Precedents error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to retrieve precedents' 
      },
      { status: 500 }
    );
  }
}

// POST /api/precedents - Search precedents with complex criteria
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      streetName,
      postcode,
      lat,
      lng,
      projectTypes,
      decisions,
      radius = 200
    } = body;
    
    // If coordinates provided, get nearby precedents
    if (lat && lng) {
      const nearby = await streetPrecedentService.getNearbyPrecedents(
        lat,
        lng,
        radius,
        projectTypes?.[0]
      );
      
      // Apply decision filter
      let filtered = nearby;
      if (decisions && decisions.length > 0) {
        filtered = nearby.filter(p => decisions.includes(p.decision));
      }
      
      return NextResponse.json({
        success: true,
        data: {
          precedents: filtered,
          total: filtered.length,
          radius
        },
        timestamp: new Date().toISOString()
      });
    }
    
    // Otherwise, get street precedents
    if (!streetName) {
      return NextResponse.json(
        { success: false, error: 'Either coordinates or street name required' },
        { status: 400 }
      );
    }
    
    const analysis = await streetPrecedentService.getStreetPrecedents(
      streetName,
      postcode || ''
    );
    
    // Apply filters
    let filteredPrecedents = analysis.precedents;
    
    if (decisions && decisions.length > 0) {
      filteredPrecedents = filteredPrecedents.filter(p => 
        decisions.includes(p.decision)
      );
    }
    
    if (projectTypes && projectTypes.length > 0) {
      filteredPrecedents = filteredPrecedents.filter(p =>
        projectTypes.some((type: string) => 
          p.applicationType?.toLowerCase().includes(type.toLowerCase())
        )
      );
    }
    
    return NextResponse.json({
      success: true,
      data: {
        ...analysis,
        precedents: filteredPrecedents,
        filteredCount: filteredPrecedents.length
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Precedents search error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to search precedents' 
      },
      { status: 500 }
    );
  }
}
