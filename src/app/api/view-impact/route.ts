/**
 * View Impact Assessment API
 * 
 * Analyzes visual impact of proposed developments on protected views
 */

import { NextRequest, NextResponse } from 'next/server';
import viewImpact from '@/lib/services/view-impact';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { address, postcode, projectType, projectDetails } = body;

    if (!address || !postcode || !projectType) {
      return NextResponse.json(
        { error: 'Address, postcode, and project type are required' },
        { status: 400 }
      );
    }

    // Validate postcode format for Hampstead area
    const postcodePrefix = (postcode.split(' ')[0] || postcode).toUpperCase();
    const validPrefixes = ['NW1', 'NW2', 'NW3', 'NW4', 'NW5', 'NW6', 'NW7', 'NW8', 'NW9', 'NW10', 'NW11', 'N2', 'N6', 'N10'];
    
    if (!validPrefixes.some(prefix => postcodePrefix.startsWith(prefix))) {
      return NextResponse.json(
        { error: 'Service is only available for NW1-NW11, N2, N6, and N10 postcodes' },
        { status: 400 }
      );
    }

    const assessment = await viewImpact.assessViewImpact(
      address,
      postcode,
      projectType,
      projectDetails || {}
    );

    return NextResponse.json({
      success: true,
      data: assessment,
      metadata: {
        address,
        postcode,
        projectType,
        generatedAt: new Date().toISOString(),
        service: 'view-impact-assessment'
      }
    });
  } catch (error) {
    console.error('View Impact API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate view impact assessment' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address');
  const postcode = searchParams.get('postcode');
  const projectType = searchParams.get('projectType');

  if (!address || !postcode || !projectType) {
    return NextResponse.json(
      { 
        error: 'Address, postcode, and project type are required',
        usage: {
          method: 'GET or POST',
          requiredParams: ['address', 'postcode', 'projectType'],
          optionalParams: ['projectDetails (POST only)'],
          example: '/api/view-impact?address=10%20Parliament%20Hill&postcode=NW3%202TH&projectType=loft',
          note: 'Assesses impact on London View Management Framework protected views'
        }
      },
      { status: 400 }
    );
  }

  const postcodePrefix = (postcode.split(' ')[0] || postcode).toUpperCase();
  const validPrefixes = ['NW1', 'NW2', 'NW3', 'NW4', 'NW5', 'NW6', 'NW7', 'NW8', 'NW9', 'NW10', 'NW11', 'N2', 'N6', 'N10'];
  
  if (!validPrefixes.some(prefix => postcodePrefix.startsWith(prefix))) {
    return NextResponse.json(
      { error: 'Service is only available for NW1-NW11, N2, N6, and N10 postcodes' },
      { status: 400 }
    );
  }

  try {
    const assessment = await viewImpact.assessViewImpact(
      address,
      postcode,
      projectType,
      {}
    );

    return NextResponse.json({
      success: true,
      data: assessment,
      metadata: {
        address,
        postcode,
        projectType,
        generatedAt: new Date().toISOString(),
        service: 'view-impact-assessment'
      }
    });
  } catch (error) {
    console.error('View Impact API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate view impact assessment' },
      { status: 500 }
    );
  }
}
