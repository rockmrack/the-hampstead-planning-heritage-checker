/**
 * Acoustic Assessment API
 * 
 * Assessment of acoustic requirements for development
 */

import { NextRequest, NextResponse } from 'next/server';
import acousticAssessment from '@/lib/services/acoustic-assessment';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      address, 
      postcode, 
      projectType,
      noiseSource,
      existingUse,
      proposedUse,
      nearbyProperties,
      trafficNoise,
      aircraftNoise,
      commercialNearby,
      loftConversion,
      flatConversion
    } = body;

    if (!address || !postcode || !projectType) {
      return NextResponse.json(
        { error: 'Address, postcode, and project type are required' },
        { status: 400 }
      );
    }

    const assessment = await acousticAssessment.assessAcousticRequirements(
      address,
      postcode,
      projectType,
      {
        noiseSource,
        existingUse,
        proposedUse,
        nearbyProperties,
        trafficNoise,
        aircraftNoise,
        commercialNearby,
        loftConversion,
        flatConversion
      }
    );

    return NextResponse.json({
      success: true,
      data: assessment
    });
  } catch (error) {
    console.error('Acoustic assessment error:', error);
    return NextResponse.json(
      { error: 'Failed to assess acoustic requirements' },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Return acoustic assessment overview
  return NextResponse.json({
    success: true,
    data: {
      partERequirements: {
        newBuild: {
          airborne: 'DnT,w + Ctr ≥ 45 dB',
          impact: "L'nT,w ≤ 62 dB",
          testingRequired: true
        },
        conversion: {
          airborne: 'DnT,w + Ctr ≥ 43 dB',
          impact: "L'nT,w ≤ 64 dB",
          testingRequired: true
        }
      },
      alarmGrades: {
        'Grade A': 'Full fire alarm system with panel',
        'Grade D1': 'Mains-powered with battery backup',
        'Grade D2': 'Mains-powered only',
        'Grade F1': 'Battery-powered (10-year sealed)'
      },
      projectTypes: {
        'flat-conversion': 'Full acoustic assessment',
        'loft-conversion': 'Basic assessment',
        'basement-conversion': 'Full assessment',
        'new-build': 'Specialist assessment',
        'extension': 'Minimal requirements'
      },
      typicalCosts: {
        survey: '£800-2,000',
        design: '£500-1,500',
        testing: '£200-400 per set'
      }
    }
  });
}
