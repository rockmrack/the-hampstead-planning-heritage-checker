/**
 * Planning Portal Integration API Route
 * 
 * Provides guidance on planning portal submissions, application
 * requirements, document checklists, and submission procedures.
 * 
 * @route POST /api/planning-portal
 */

import { NextRequest, NextResponse } from 'next/server';
import planningPortalIntegrationService from '@/lib/services/planning-portal-integration';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { 
      address, 
      postcode, 
      applicationType, 
      isListedBuilding,
      inConservationArea,
      proposedFloorspace,
      proposedUnits,
      hasPreAppAdvice,
      siteAreaHectares
    } = body;
    
    if (!address || !postcode) {
      return NextResponse.json(
        { error: 'Address and postcode are required' },
        { status: 400 }
      );
    }
    
    const guidance = await planningPortalIntegrationService.getPortalGuidance({
      address,
      postcode,
      applicationType,
      isListedBuilding,
      inConservationArea,
      proposedFloorspace,
      proposedUnits,
      hasPreAppAdvice,
      siteAreaHectares
    });
    
    return NextResponse.json(guidance);
  } catch (error) {
    console.error('Planning portal guidance error:', error);
    return NextResponse.json(
      { error: 'Failed to generate planning portal guidance' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const [applicationTypes, supportingDocuments] = await Promise.all([
      planningPortalIntegrationService.getApplicationTypes(),
      planningPortalIntegrationService.getSupportingDocuments()
    ]);
    
    return NextResponse.json({
      description: 'Planning Portal Submission Guidance API',
      endpoints: {
        POST: 'Get personalized portal submission guidance',
        GET: 'Get reference information about application types and documents'
      },
      referenceData: {
        applicationTypes,
        supportingDocuments
      }
    });
  } catch (error) {
    console.error('Planning portal reference error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve portal reference data' },
      { status: 500 }
    );
  }
}
