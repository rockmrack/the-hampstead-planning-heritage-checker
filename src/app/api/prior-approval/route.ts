/**
 * Prior Approval API
 * 
 * Provides prior approval guidance and eligibility checking
 */

import { NextRequest, NextResponse } from 'next/server';
import PriorApprovalService from '@/lib/services/prior-approval';

const priorApprovalService = new PriorApprovalService();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      address,
      proposalType,
      priorApprovalType,
      proposalDetails,
      isListedBuilding,
      isConservationArea,
      isArticle4
    } = body;
    
    if (!address || !proposalType) {
      return NextResponse.json(
        { error: 'Address and proposal type are required' },
        { status: 400 }
      );
    }
    
    const assessment = priorApprovalService.generatePriorApprovalGuidance({
      address,
      proposalType,
      priorApprovalType,
      proposalDetails: proposalDetails || {},
      isListedBuilding: isListedBuilding || false,
      isConservationArea: isConservationArea || false,
      isArticle4: isArticle4 || false
    });
    
    return NextResponse.json({
      success: true,
      data: assessment,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Prior approval error:', error);
    return NextResponse.json(
      { error: 'Failed to generate prior approval guidance' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    
    // Get specific prior approval type info
    if (action === 'type') {
      const typeKey = searchParams.get('key');
      if (!typeKey) {
        return NextResponse.json(
          { error: 'Type key is required' },
          { status: 400 }
        );
      }
      
      const typeInfo = priorApprovalService.getPriorApprovalTypeInfo(typeKey);
      
      if (!typeInfo) {
        return NextResponse.json(
          { error: 'Unknown prior approval type' },
          { status: 404 }
        );
      }
      
      return NextResponse.json({
        success: true,
        data: typeInfo,
        timestamp: new Date().toISOString()
      });
    }
    
    // Get all prior approval types
    if (action === 'types') {
      const types = priorApprovalService.getPriorApprovalTypes();
      
      return NextResponse.json({
        success: true,
        data: types,
        timestamp: new Date().toISOString()
      });
    }
    
    // Get process overview
    if (action === 'process') {
      const process = priorApprovalService.getProcessOverview();
      
      return NextResponse.json({
        success: true,
        data: process,
        timestamp: new Date().toISOString()
      });
    }
    
    // Get comparison with planning
    if (action === 'comparison') {
      const comparison = priorApprovalService.getComparisonWithPlanning();
      
      return NextResponse.json({
        success: true,
        data: comparison,
        timestamp: new Date().toISOString()
      });
    }
    
    // Default: return overview
    return NextResponse.json({
      success: true,
      data: {
        types: priorApprovalService.getPriorApprovalTypes(),
        process: priorApprovalService.getProcessOverview(),
        comparison: priorApprovalService.getComparisonWithPlanning()
      },
      message: 'Use POST to check eligibility for a specific proposal',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Prior approval error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve prior approval information' },
      { status: 500 }
    );
  }
}
