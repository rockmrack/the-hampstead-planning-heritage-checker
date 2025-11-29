/**
 * Analytics API Routes
 * 
 * Provides endpoints for planning analytics, success predictions,
 * market intelligence, and dashboard data.
 */

import { NextRequest, NextResponse } from 'next/server';
import { analyticsEngine } from '@/lib/services/analytics-engine';

// GET /api/analytics - Get dashboard data or specific analytics
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'dashboard';
    const areas = searchParams.get('areas')?.split(',').filter(Boolean);
    const areaCode = searchParams.get('area');
    
    switch (type) {
      case 'dashboard': {
        const dashboardData = await analyticsEngine.getDashboardData(areas);
        
        return NextResponse.json({
          success: true,
          data: dashboardData,
          timestamp: new Date().toISOString()
        });
      }
      
      case 'area': {
        if (!areaCode) {
          return NextResponse.json(
            { success: false, error: 'Area code required for area analytics' },
            { status: 400 }
          );
        }
        
        const areaAnalytics = await analyticsEngine.getAreaAnalytics(areaCode);
        
        return NextResponse.json({
          success: true,
          data: areaAnalytics,
          timestamp: new Date().toISOString()
        });
      }
      
      case 'market': {
        if (!areaCode) {
          return NextResponse.json(
            { success: false, error: 'Area code required for market intelligence' },
            { status: 400 }
          );
        }
        
        const marketData = await analyticsEngine.getMarketIntelligence(areaCode);
        
        return NextResponse.json({
          success: true,
          data: marketData,
          timestamp: new Date().toISOString()
        });
      }
      
      case 'compare': {
        if (!areas || areas.length < 2) {
          return NextResponse.json(
            { success: false, error: 'At least 2 areas required for comparison' },
            { status: 400 }
          );
        }
        
        const comparison = await analyticsEngine.compareAreas(areas);
        
        return NextResponse.json({
          success: true,
          data: comparison,
          timestamp: new Date().toISOString()
        });
      }
      
      default:
        return NextResponse.json(
          { success: false, error: `Unknown analytics type: ${type}` },
          { status: 400 }
        );
    }
    
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to retrieve analytics' 
      },
      { status: 500 }
    );
  }
}

// POST /api/analytics - Get success prediction for a project
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      postcode,
      projectType,
      propertyType = 'house',
      isListedBuilding = false,
      isConservationArea = false,
      hasPreAppAdvice = false,
      includingHeritageStatement = false,
      projectValue = 100000,
      sqftImpact = 50
    } = body;
    
    if (!postcode) {
      return NextResponse.json(
        { success: false, error: 'Postcode is required' },
        { status: 400 }
      );
    }
    
    if (!projectType) {
      return NextResponse.json(
        { success: false, error: 'Project type is required' },
        { status: 400 }
      );
    }
    
    const prediction = await analyticsEngine.predictSuccess({
      postcode,
      projectType,
      propertyType,
      isListedBuilding,
      isConservationArea,
      hasPreAppAdvice,
      includingHeritageStatement,
      projectValue,
      sqftImpact
    });
    
    return NextResponse.json({
      success: true,
      data: {
        prediction,
        requestParams: {
          postcode,
          projectType,
          propertyType,
          isListedBuilding,
          isConservationArea,
          hasPreAppAdvice,
          includingHeritageStatement,
          projectValue,
          sqftImpact
        }
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Prediction error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to generate prediction' 
      },
      { status: 500 }
    );
  }
}
