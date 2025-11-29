import { NextRequest, NextResponse } from 'next/server';
import { designGuidanceService } from '@/lib/services/design-guidance';

export const dynamic = 'force-dynamic';

/**
 * Design Guidance API
 * 
 * Provides intelligent design recommendations based on:
 * - Location and heritage status
 * - Project type and scope
 * - Conservation area requirements
 * - Listed building considerations
 * - Local vernacular architecture
 */

interface GuidanceRequestBody {
  postcode: string;
  projectType?: string;
  conservationArea?: string;
  listedBuilding?: { grade: 'I' | 'II*' | 'II' };
  specificRequirements?: string[];
  propertyType?: string;
  budget?: number;
}

// POST /api/design-guidance - Get design guidance for a project
export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as GuidanceRequestBody;
    
    const guidanceRequest = {
      postcode: body.postcode,
      projectType: body.projectType || 'extension',
      conservationArea: body.conservationArea,
      listedBuilding: body.listedBuilding,
      specificRequirements: body.specificRequirements || [],
      propertyType: body.propertyType || 'victorian',
      budget: body.budget,
    };
    
    // Validate required fields
    if (!guidanceRequest.postcode) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Postcode is required' 
        },
        { status: 400 }
      );
    }
    
    // Validate postcode format
    const postcodePattern = /^(NW[1-9]|NW1[01]|N[26]|N10)\s*\d[A-Z]{2}$/i;
    if (!postcodePattern.test(guidanceRequest.postcode.replace(/\s/g, ' ').trim())) {
      // Check if it's at least in a supported area
      const areaPattern = /^(NW[1-9]|NW1[01]|N[26]|N10)/i;
      if (!areaPattern.test(guidanceRequest.postcode)) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Postcode must be in NW1-NW11, N2, N6, or N10 area' 
          },
          { status: 400 }
        );
      }
    }
    
    const guidance = designGuidanceService.getGuidance({
      postcode: guidanceRequest.postcode,
      projectType: guidanceRequest.projectType,
      isConservationArea: !!guidanceRequest.conservationArea,
      isListedBuilding: !!guidanceRequest.listedBuilding,
      listingGrade: guidanceRequest.listedBuilding?.grade,
      hasArticle4: false,
    });
    
    return NextResponse.json({
      success: true,
      data: guidance,
      meta: {
        postcode: guidanceRequest.postcode,
        projectType: guidanceRequest.projectType,
        timestamp: new Date().toISOString(),
      }
    });
    
  } catch (error) {
    console.error('Design guidance error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to generate design guidance',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// GET /api/design-guidance?postcode=NW3&projectType=extension
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const postcode = searchParams.get('postcode');
    const projectType = searchParams.get('projectType') || 'extension';
    
    if (!postcode) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Postcode query parameter is required' 
        },
        { status: 400 }
      );
    }
    
    const guidance = designGuidanceService.getGuidance({
      postcode,
      projectType,
      isConservationArea: false,
      isListedBuilding: false,
      hasArticle4: false,
    });
    
    return NextResponse.json({
      success: true,
      data: guidance,
      meta: {
        postcode,
        projectType,
        timestamp: new Date().toISOString(),
      }
    });
    
  } catch (error) {
    console.error('Design guidance error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to generate design guidance',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// GET /api/design-guidance/materials - Get material recommendations
export async function OPTIONS(request: NextRequest) {
  // Return supported project types and property types
  return NextResponse.json({
    success: true,
    supportedProjectTypes: [
      'extension',
      'loft_conversion',
      'basement',
      'new_build',
      'renovation',
      'change_of_use',
      'outbuilding',
      'landscaping'
    ],
    supportedPropertyTypes: [
      'victorian',
      'edwardian',
      'georgian',
      'art_deco',
      'post_war',
      'modern',
      '1960s_70s',
      'contemporary'
    ],
    supportedAreas: [
      'NW1', 'NW2', 'NW3', 'NW4', 'NW5', 'NW6', 'NW7', 'NW8', 'NW9', 'NW10', 'NW11',
      'N2', 'N6', 'N10'
    ],
    endpoints: {
      getGuidance: {
        method: 'POST',
        path: '/api/design-guidance',
        body: {
          postcode: 'string (required)',
          projectType: 'string (optional)',
          conservationArea: 'string (optional)',
          listedBuilding: '{ grade: "I" | "II*" | "II" } (optional)',
          propertyType: 'string (optional)',
          budget: 'number (optional)',
          specificRequirements: 'string[] (optional)'
        }
      },
      getGuidanceSimple: {
        method: 'GET',
        path: '/api/design-guidance?postcode=NW3&projectType=extension',
        params: {
          postcode: 'string (required)',
          projectType: 'string (optional)',
          conservationArea: 'string (optional)',
          listedBuilding: 'string (optional - grade)',
          propertyType: 'string (optional)'
        }
      }
    }
  });
}
