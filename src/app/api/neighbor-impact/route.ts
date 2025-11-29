import { NextRequest, NextResponse } from 'next/server';
import { neighborImpactAnalyzerService } from '@/lib/services/neighbor-impact-analyzer';

export const dynamic = 'force-dynamic';

/**
 * Neighbor Impact Analyzer API
 * 
 * Analyzes potential impacts on neighboring properties:
 * - Light and daylight impacts
 * - Privacy considerations
 * - Construction disturbance
 * - Party wall implications
 */

// POST /api/neighbor-impact - Analyze neighbor impacts
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { propertyAddress, postcode, projectType, projectDetails, propertyType, neighborInfo } = body;
    
    // Validate required fields
    if (!propertyAddress || !postcode || !projectType) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields: propertyAddress, postcode, projectType' 
        },
        { status: 400 }
      );
    }
    
    const analysis = neighborImpactAnalyzerService.analyzeImpacts({
      propertyAddress,
      postcode,
      projectType,
      projectDetails: projectDetails || {},
      propertyType,
      neighborInfo,
    });
    
    return NextResponse.json({
      success: true,
      data: analysis,
      meta: {
        propertyAddress,
        projectType,
        timestamp: new Date().toISOString(),
      }
    });
    
  } catch (error) {
    console.error('Neighbor impact analysis error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to analyze neighbor impacts',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// GET /api/neighbor-impact?projectType=extension&propertyType=terraced - Quick check
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const projectType = searchParams.get('projectType');
    const propertyType = searchParams.get('propertyType') || 'semi-detached';
    
    if (!projectType) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Project type query parameter is required' 
        },
        { status: 400 }
      );
    }
    
    const quickCheck = neighborImpactAnalyzerService.quickImpactCheck(projectType, propertyType);
    
    return NextResponse.json({
      success: true,
      data: quickCheck,
      meta: {
        projectType,
        propertyType,
        timestamp: new Date().toISOString(),
      }
    });
    
  } catch (error) {
    console.error('Neighbor impact quick check error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to perform quick check',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// OPTIONS - API documentation
export async function OPTIONS() {
  return NextResponse.json({
    success: true,
    endpoints: {
      analyzeImpacts: {
        method: 'POST',
        path: '/api/neighbor-impact',
        body: {
          propertyAddress: 'string (required)',
          postcode: 'string (required)',
          projectType: 'extension|loft_conversion|basement|new_build|renovation (required)',
          projectDetails: {
            extensionDepth: 'number in meters (optional)',
            extensionWidth: 'number in meters (optional)',
            extensionHeight: 'number in meters (optional)',
            loftDormerSize: 'small|medium|large (optional)',
            basementDepth: 'number in meters (optional)',
            newWindows: '[{ direction: string, floor: string }] (optional)',
            balcony: 'boolean (optional)',
            roofTerrace: 'boolean (optional)'
          },
          propertyType: 'terraced|semi-detached|detached|flat (optional)',
          neighborInfo: {
            northDistance: 'number in meters (optional)',
            southDistance: 'number in meters (optional)',
            eastDistance: 'number in meters (optional)',
            westDistance: 'number in meters (optional)'
          }
        }
      },
      quickCheck: {
        method: 'GET',
        path: '/api/neighbor-impact?projectType=extension&propertyType=terraced',
        description: 'Quick assessment of likely impacts without detailed analysis'
      }
    },
    impactTypes: [
      'daylight', 'sunlight', 'privacy', 'overlooking', 'noise_construction',
      'noise_operational', 'visual', 'overbearing', 'overshadowing', 'outlook', 'traffic', 'parking'
    ],
    projectTypes: [
      'extension', 'loft_conversion', 'basement', 'new_build', 'renovation', 'roof_terrace', 'balcony'
    ],
    propertyTypes: [
      'terraced', 'semi-detached', 'detached', 'flat'
    ]
  });
}
