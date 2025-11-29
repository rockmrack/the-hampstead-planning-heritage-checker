/**
 * Amendment Application API
 * 
 * Assesses proposed changes to approved planning permissions
 */

import { NextRequest, NextResponse } from 'next/server';
import amendmentApplication from '@/lib/services/amendment-application';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      address, 
      postcode, 
      originalPermission,
      proposedChanges,
      conservationArea,
      listedBuilding,
      neighborConcerns,
      conditionsAffected,
      timeSinceApproval
    } = body;

    if (!address || !postcode || !originalPermission || !proposedChanges) {
      return NextResponse.json(
        { error: 'Address, postcode, original permission, and proposed changes are required' },
        { status: 400 }
      );
    }

    if (!Array.isArray(proposedChanges) || proposedChanges.length === 0) {
      return NextResponse.json(
        { error: 'At least one proposed change is required' },
        { status: 400 }
      );
    }

    const assessment = await amendmentApplication.assessAmendment(
      address,
      postcode,
      originalPermission,
      proposedChanges,
      {
        conservationArea,
        listedBuilding,
        neighborConcerns,
        conditionsAffected,
        timeSinceApproval
      }
    );

    return NextResponse.json({
      success: true,
      data: assessment
    });
  } catch (error) {
    console.error('Amendment assessment error:', error);
    return NextResponse.json(
      { error: 'Failed to assess amendment' },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Return information about amendment routes
  const routes = {
    nonMaterial: {
      name: 'Non-Material Amendment (S96A)',
      description: 'For minor changes that do not materially affect the development',
      fee: 43,
      timeline: '28 days',
      examples: [
        'Minor internal layout changes',
        'Small fenestration adjustments',
        'Material substitutions (similar quality)'
      ]
    },
    minorMaterial: {
      name: 'Minor Material Amendment (S73)',
      description: 'For changes that affect but remain consistent with the approved scheme',
      fee: 293,
      timeline: '8 weeks',
      examples: [
        'Window position changes',
        'Modest design alterations',
        'Condition variations'
      ]
    },
    newApplication: {
      name: 'New Planning Application',
      description: 'For substantial changes requiring fresh assessment',
      fee: 578,
      timeline: '8-13 weeks',
      examples: [
        'Significant scale increases',
        'Fundamental design changes',
        'New elements not in original'
      ]
    },
    guidance: [
      'Changes are assessed cumulatively - multiple minor changes may require S73',
      'Conservation areas and listed buildings face stricter thresholds',
      'Pre-application advice recommended for borderline cases',
      'Original permission must still be implementable to use S73'
    ]
  };

  return NextResponse.json({
    success: true,
    data: routes
  });
}
