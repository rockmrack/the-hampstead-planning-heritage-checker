/**
 * Community Engagement API Route
 * 
 * Provides comprehensive community engagement strategy guidance for
 * planning applications including stakeholder mapping and consultation.
 * 
 * @route POST /api/community-engagement
 */

import { NextRequest, NextResponse } from 'next/server';
import communityEngagementService from '@/lib/services/community-engagement';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { 
      address, 
      postcode, 
      projectType, 
      projectScale,
      inConservationArea,
      nearListedBuilding,
      proposedUnits,
      existingCommunityRelations,
      budgetLevel,
      timelineWeeks
    } = body;
    
    if (!address || !postcode) {
      return NextResponse.json(
        { error: 'Address and postcode are required' },
        { status: 400 }
      );
    }
    
    const strategy = await communityEngagementService.getEngagementStrategy({
      address,
      postcode,
      projectType,
      projectScale,
      inConservationArea: Boolean(inConservationArea),
      nearListedBuilding,
      proposedUnits,
      existingCommunityRelations,
      budgetLevel,
      timelineWeeks
    });
    
    return NextResponse.json(strategy);
  } catch (error) {
    console.error('Community engagement guidance error:', error);
    return NextResponse.json(
      { error: 'Failed to generate community engagement strategy' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const [engagementMethods, stakeholderTypes] = await Promise.all([
      communityEngagementService.getEngagementMethods(),
      communityEngagementService.getStakeholderTypes()
    ]);
    
    return NextResponse.json({
      description: 'Community Engagement Strategy API',
      endpoints: {
        POST: 'Get personalized community engagement strategy',
        GET: 'Get reference information about engagement methods'
      },
      referenceData: {
        engagementMethods,
        stakeholderTypes
      }
    });
  } catch (error) {
    console.error('Community engagement reference error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve engagement reference data' },
      { status: 500 }
    );
  }
}
