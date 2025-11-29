/**
 * Permitted Development Checker API
 * 
 * Check if proposals are permitted development
 */

import { NextRequest, NextResponse } from 'next/server';
import PermittedDevelopmentChecker from '@/lib/services/permitted-development';

const pdChecker = new PermittedDevelopmentChecker();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      address,
      proposalType,
      proposalDetails,
      propertyType,
      isListedBuilding,
      isConservationArea,
      isArticle4,
      article4Area,
      hasHadPreviousExtensions,
      previousExtensionDetails
    } = body;
    
    if (!address || !proposalType || !propertyType) {
      return NextResponse.json(
        { error: 'Address, proposal type, and property type are required' },
        { status: 400 }
      );
    }
    
    const result = pdChecker.checkPermittedDevelopment({
      address,
      proposalType,
      proposalDetails: proposalDetails || {},
      propertyType,
      isListedBuilding: isListedBuilding || false,
      isConservationArea: isConservationArea || false,
      isArticle4: isArticle4 || false,
      article4Area,
      hasHadPreviousExtensions: hasHadPreviousExtensions || false,
      previousExtensionDetails
    });
    
    return NextResponse.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('PD check error:', error);
    return NextResponse.json(
      { error: 'Failed to check permitted development' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    
    // Get PD class information
    if (action === 'class') {
      const classKey = searchParams.get('key');
      if (!classKey) {
        return NextResponse.json(
          { error: 'Class key is required' },
          { status: 400 }
        );
      }
      
      const classInfo = pdChecker.getPDClassInfo(classKey);
      
      if (!classInfo) {
        return NextResponse.json(
          { error: 'Unknown PD class' },
          { status: 404 }
        );
      }
      
      return NextResponse.json({
        success: true,
        data: classInfo,
        timestamp: new Date().toISOString()
      });
    }
    
    // Get all PD classes
    if (action === 'classes') {
      const classes = pdChecker.getAllPDClasses();
      
      return NextResponse.json({
        success: true,
        data: classes,
        timestamp: new Date().toISOString()
      });
    }
    
    // Get Article 4 areas
    if (action === 'article4') {
      const areas = pdChecker.getArticle4Areas();
      
      return NextResponse.json({
        success: true,
        data: areas,
        timestamp: new Date().toISOString()
      });
    }
    
    // Get change of use PD
    if (action === 'change-of-use') {
      const changeOfUse = pdChecker.getChangeOfUsePD();
      
      return NextResponse.json({
        success: true,
        data: changeOfUse,
        timestamp: new Date().toISOString()
      });
    }
    
    // Default: return overview
    return NextResponse.json({
      success: true,
      data: {
        pdClasses: Object.keys(pdChecker.getAllPDClasses()),
        article4Areas: Object.keys(pdChecker.getArticle4Areas()),
        changeOfUseOptions: Object.keys(pdChecker.getChangeOfUsePD())
      },
      message: 'Use POST to check if a specific proposal is permitted development',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('PD check error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve PD information' },
      { status: 500 }
    );
  }
}
