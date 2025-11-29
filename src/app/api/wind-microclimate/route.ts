/**
 * Wind Microclimate Assessment API
 * 
 * Analyzes potential wind effects of proposed developments
 */

import { NextRequest, NextResponse } from 'next/server';
import windMicroclimate from '@/lib/services/wind-microclimate';

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

    const assessment = await windMicroclimate.assessWindMicroclimate(
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
        service: 'wind-microclimate-assessment'
      }
    });
  } catch (error) {
    console.error('Wind Microclimate API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate wind microclimate assessment' },
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
          example: '/api/wind-microclimate?address=10%20Heath%20Street&postcode=NW3%201AA&projectType=new_build',
          note: 'Particularly relevant for tall buildings (>20m) or exposed locations'
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
    const assessment = await windMicroclimate.assessWindMicroclimate(
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
        service: 'wind-microclimate-assessment'
      }
    });
  } catch (error) {
    console.error('Wind Microclimate API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate wind microclimate assessment' },
      { status: 500 }
    );
  }
}
