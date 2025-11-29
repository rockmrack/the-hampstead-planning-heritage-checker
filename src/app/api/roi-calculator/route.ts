/**
 * ROI Calculator API Route
 */

import { NextRequest, NextResponse } from 'next/server';
import { roiCalculator } from '@/lib/services/roi-calculator';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectType, propertyValue, postcode, propertyType, customSize, heritageStatus } = body;
    
    if (!projectType || !propertyValue || !postcode) {
      return NextResponse.json(
        { error: 'Missing required fields: projectType, propertyValue, postcode' },
        { status: 400 }
      );
    }
    
    const result = roiCalculator.calculateROI(
      projectType,
      propertyValue,
      postcode,
      propertyType || 'house',
      customSize,
      heritageStatus
    );
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('ROI calculation error:', error);
    return NextResponse.json(
      { error: 'Failed to calculate ROI' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const projectType = searchParams.get('projectType');
  const propertyValue = searchParams.get('propertyValue');
  const postcode = searchParams.get('postcode');
  
  if (!projectType || !propertyValue || !postcode) {
    // Return quick estimate helper
    return NextResponse.json({
      availableProjectTypes: [
        'rear-extension-single',
        'rear-extension-double',
        'side-return',
        'loft-conversion',
        'basement',
        'garden-room',
        'garage-conversion',
        'wrap-around',
      ],
      usage: {
        method: 'POST',
        body: {
          projectType: 'string (required)',
          propertyValue: 'number (required)',
          postcode: 'string (required)',
          propertyType: 'string (optional)',
          customSize: 'number (optional, sqm)',
          heritageStatus: "'RED' | 'AMBER' | 'GREEN' (optional)",
        },
      },
    });
  }
  
  const quickEstimate = roiCalculator.quickEstimate(
    projectType,
    parseInt(propertyValue),
    postcode
  );
  
  return NextResponse.json(quickEstimate);
}
