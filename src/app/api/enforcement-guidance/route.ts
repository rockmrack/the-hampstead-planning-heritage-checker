/**
 * Enforcement Guidance API
 * 
 * Provides planning enforcement guidance and response options
 */

import { NextRequest, NextResponse } from 'next/server';
import EnforcementGuidanceService from '@/lib/services/enforcement-guidance';

const enforcementService = new EnforcementGuidanceService();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      address,
      breachDescription,
      breachType,
      whenDiscovered,
      evidenceAvailable,
      isYourProperty,
      hasCouncilContacted,
      noticeReceived,
      appealDeadline,
      complianceDeadline
    } = body;
    
    if (!address || !breachDescription) {
      return NextResponse.json(
        { error: 'Address and breach description are required' },
        { status: 400 }
      );
    }
    
    const assessment = enforcementService.generateEnforcementGuidance({
      address,
      breachDescription,
      breachType,
      whenDiscovered: whenDiscovered || 'Recently',
      evidenceAvailable,
      isYourProperty: isYourProperty || false,
      hasCouncilContacted: hasCouncilContacted || false,
      noticeReceived,
      appealDeadline,
      complianceDeadline
    });
    
    return NextResponse.json({
      success: true,
      data: assessment,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Enforcement guidance error:', error);
    return NextResponse.json(
      { error: 'Failed to generate enforcement guidance' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    
    // Get notice type information
    if (action === 'notice') {
      const noticeType = searchParams.get('type');
      if (!noticeType) {
        return NextResponse.json(
          { error: 'Notice type is required' },
          { status: 400 }
        );
      }
      
      const noticeInfo = enforcementService.getNoticeInfo(noticeType);
      
      if (!noticeInfo) {
        return NextResponse.json(
          { error: 'Unknown notice type' },
          { status: 404 }
        );
      }
      
      return NextResponse.json({
        success: true,
        data: noticeInfo,
        timestamp: new Date().toISOString()
      });
    }
    
    // Get breach type information
    if (action === 'breach') {
      const breachType = searchParams.get('type');
      if (!breachType) {
        return NextResponse.json(
          { error: 'Breach type is required' },
          { status: 400 }
        );
      }
      
      const breachInfo = enforcementService.getBreachTypeInfo(breachType);
      
      if (!breachInfo) {
        return NextResponse.json(
          { error: 'Unknown breach type' },
          { status: 404 }
        );
      }
      
      return NextResponse.json({
        success: true,
        data: breachInfo,
        timestamp: new Date().toISOString()
      });
    }
    
    // Get appeal grounds
    if (action === 'appeal-grounds') {
      const noticeType = (searchParams.get('type') || 'enforcement') as 'enforcement' | 'listed_building';
      
      const grounds = enforcementService.getAppealGrounds(noticeType);
      
      return NextResponse.json({
        success: true,
        data: grounds,
        timestamp: new Date().toISOString()
      });
    }
    
    // Get process overview
    if (action === 'process') {
      const process = enforcementService.getProcessOverview();
      
      return NextResponse.json({
        success: true,
        data: process,
        timestamp: new Date().toISOString()
      });
    }
    
    // Get all breach types
    if (action === 'breach-types') {
      const breachTypes = enforcementService.getAllBreachTypes();
      
      return NextResponse.json({
        success: true,
        data: breachTypes,
        timestamp: new Date().toISOString()
      });
    }
    
    // Get expediency factors
    if (action === 'expediency') {
      const factors = enforcementService.getExpediencyFactors();
      
      return NextResponse.json({
        success: true,
        data: factors,
        timestamp: new Date().toISOString()
      });
    }
    
    // Default: return overview
    return NextResponse.json({
      success: true,
      data: {
        breachTypes: enforcementService.getAllBreachTypes(),
        process: enforcementService.getProcessOverview(),
        expediencyFactors: enforcementService.getExpediencyFactors()
      },
      message: 'Use POST to generate guidance for a specific enforcement case',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Enforcement guidance error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve enforcement information' },
      { status: 500 }
    );
  }
}
