/**
 * Planning Committee API Route
 * 
 * Provides guidance on planning committee processes, speaking at committees,
 * material considerations, and decision-making procedures.
 * 
 * @route POST /api/planning-committee
 */

import { NextRequest, NextResponse } from 'next/server';
import planningCommitteeService from '@/lib/services/planning-committee';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { address, postcode, applicationType, applicationReference, isObjector, isApplicant, committeeDate, concernedAbout } = body;
    
    if (!address || !postcode) {
      return NextResponse.json(
        { error: 'Address and postcode are required' },
        { status: 400 }
      );
    }
    
    const guidance = await planningCommitteeService.getCommitteeGuidance({
      address,
      postcode,
      applicationType,
      applicationReference,
      isObjector,
      isApplicant,
      committeeDate,
      concernedAbout
    });
    
    return NextResponse.json(guidance);
  } catch (error) {
    console.error('Planning committee guidance error:', error);
    return NextResponse.json(
      { error: 'Failed to generate planning committee guidance' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const [committeeTypes, decisionRoutes, considerationsGuide] = await Promise.all([
      planningCommitteeService.getCommitteeTypes(),
      planningCommitteeService.getDecisionRoutes(),
      planningCommitteeService.getConsiderationsGuide()
    ]);
    
    return NextResponse.json({
      description: 'Planning Committee Guidance API',
      endpoints: {
        POST: 'Get personalized planning committee guidance',
        GET: 'Get reference information about committee processes'
      },
      referenceData: {
        committeeTypes,
        decisionRoutes,
        materialConsiderations: considerationsGuide.material,
        nonMaterialMatters: considerationsGuide.nonMaterial
      }
    });
  } catch (error) {
    console.error('Planning committee reference error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve committee reference data' },
      { status: 500 }
    );
  }
}
