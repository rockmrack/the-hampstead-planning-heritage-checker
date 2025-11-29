/**
 * Design Review Panel Guidance API Route
 * 
 * Provides guidance on design review panels, quality assessments,
 * preparation for reviews, and design code compliance.
 * 
 * @route POST /api/design-review-panel
 */

import { NextRequest, NextResponse } from 'next/server';
import designReviewPanelService from '@/lib/services/design-review-panel';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { 
      address, 
      postcode, 
      projectType, 
      projectDescription,
      designStage,
      inConservationArea,
      nearListedBuilding,
      proposedHeight,
      proposedUnits,
      siteAreaHectares
    } = body;
    
    if (!address || !postcode) {
      return NextResponse.json(
        { error: 'Address and postcode are required' },
        { status: 400 }
      );
    }
    
    const guidance = await designReviewPanelService.getDesignReviewGuidance({
      address,
      postcode,
      projectType,
      projectDescription,
      designStage,
      inConservationArea,
      nearListedBuilding,
      proposedHeight,
      proposedUnits,
      siteAreaHectares
    });
    
    return NextResponse.json(guidance);
  } catch (error) {
    console.error('Design review panel guidance error:', error);
    return NextResponse.json(
      { error: 'Failed to generate design review panel guidance' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const [designPrinciples, panelTypes] = await Promise.all([
      designReviewPanelService.getDesignPrinciples(),
      designReviewPanelService.getPanelTypes()
    ]);
    
    return NextResponse.json({
      description: 'Design Review Panel Guidance API',
      endpoints: {
        POST: 'Get personalized design review panel guidance',
        GET: 'Get reference information about design review processes'
      },
      referenceData: {
        designPrinciples,
        panelTypes
      }
    });
  } catch (error) {
    console.error('Design review panel reference error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve design review panel reference data' },
      { status: 500 }
    );
  }
}
