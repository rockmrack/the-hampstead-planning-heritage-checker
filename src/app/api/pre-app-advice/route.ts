/**
 * Pre-Application Advice API
 * 
 * Provides pre-application guidance, service options, and fee calculations
 */

import { NextRequest, NextResponse } from 'next/server';
import PreAppAdviceService from '@/lib/services/pre-app-advice';

const preAppService = new PreAppAdviceService();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      address,
      proposalType,
      proposalDescription,
      existingUse,
      proposedUse,
      siteArea,
      floorspace,
      units,
      isListedBuilding,
      isConservationArea,
      hasProtectedTrees,
      preferredServiceLevel
    } = body;
    
    if (!address || !proposalType) {
      return NextResponse.json(
        { error: 'Address and proposal type are required' },
        { status: 400 }
      );
    }
    
    const assessment = preAppService.generatePreAppGuidance({
      address,
      proposalType,
      proposalDescription: proposalDescription || proposalType,
      existingUse,
      proposedUse,
      siteArea,
      floorspace,
      units,
      isListedBuilding: isListedBuilding || false,
      isConservationArea: isConservationArea || false,
      hasProtectedTrees: hasProtectedTrees || false,
      preferredServiceLevel
    });
    
    return NextResponse.json({
      success: true,
      data: assessment,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Pre-app advice error:', error);
    return NextResponse.json(
      { error: 'Failed to generate pre-application advice' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    
    // Get fee calculation
    if (action === 'fee') {
      const developmentType = searchParams.get('developmentType') || 'householder';
      const serviceLevel = (searchParams.get('serviceLevel') || 'written') as 'written' | 'meeting' | 'additional';
      
      const feeInfo = preAppService.calculateFee(developmentType, serviceLevel);
      
      return NextResponse.json({
        success: true,
        data: feeInfo,
        timestamp: new Date().toISOString()
      });
    }
    
    // Get service types
    if (action === 'services') {
      const services = preAppService.getServiceTypes();
      
      return NextResponse.json({
        success: true,
        data: services,
        timestamp: new Date().toISOString()
      });
    }
    
    // Get fee categories
    if (action === 'fees') {
      const fees = preAppService.getFeeCategories();
      
      return NextResponse.json({
        success: true,
        data: fees,
        timestamp: new Date().toISOString()
      });
    }
    
    // Get benefits
    if (action === 'benefits') {
      const benefits = preAppService.getBenefits();
      
      return NextResponse.json({
        success: true,
        data: benefits,
        timestamp: new Date().toISOString()
      });
    }
    
    // Default: return service types and fee categories
    return NextResponse.json({
      success: true,
      data: {
        services: preAppService.getServiceTypes(),
        fees: preAppService.getFeeCategories(),
        benefits: preAppService.getBenefits()
      },
      message: 'Use POST to generate guidance for a specific proposal',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Pre-app advice error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve pre-application information' },
      { status: 500 }
    );
  }
}
