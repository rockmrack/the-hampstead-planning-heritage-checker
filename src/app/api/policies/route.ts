import { NextRequest, NextResponse } from 'next/server';
import { planningPolicyDatabaseService } from '@/lib/services/planning-policy-database';
import type { PolicyCategory, ProjectType, PolicySource } from '@/lib/services/planning-policy-database';

export const dynamic = 'force-dynamic';

/**
 * Planning Policy Database API
 * 
 * Access comprehensive planning policy information:
 * - Search policies
 * - Get policy details
 * - Assess compliance
 */

// GET /api/policies - Search and retrieve policies
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const action = searchParams.get('action') || 'search';
    
    switch (action) {
      case 'search': {
        const query = searchParams.get('q') || undefined;
        const category = searchParams.get('category') as PolicyCategory || undefined;
        const projectType = searchParams.get('projectType') as ProjectType || undefined;
        const area = searchParams.get('area') || undefined;
        const source = searchParams.get('source') as PolicySource || undefined;
        
        const policies = planningPolicyDatabaseService.searchPolicies({
          query,
          category,
          projectType,
          area,
          source,
        });
        
        return NextResponse.json({
          success: true,
          data: policies,
          count: policies.length,
        });
      }
      
      case 'get': {
        const policyId = searchParams.get('id');
        const code = searchParams.get('code');
        
        let policy;
        if (policyId) {
          policy = planningPolicyDatabaseService.getPolicy(policyId);
        } else if (code) {
          policy = planningPolicyDatabaseService.getPolicyByCode(code);
        } else {
          return NextResponse.json(
            { success: false, error: 'Policy ID or code is required' },
            { status: 400 }
          );
        }
        
        if (!policy) {
          return NextResponse.json(
            { success: false, error: 'Policy not found' },
            { status: 404 }
          );
        }
        
        return NextResponse.json({
          success: true,
          data: policy,
        });
      }
      
      case 'project': {
        const projectType = searchParams.get('projectType') as ProjectType;
        const area = searchParams.get('area') || undefined;
        
        if (!projectType) {
          return NextResponse.json(
            { success: false, error: 'Project type is required' },
            { status: 400 }
          );
        }
        
        const policies = planningPolicyDatabaseService.getPoliciesForProject(projectType, area);
        
        return NextResponse.json({
          success: true,
          data: policies,
          count: policies.length,
        });
      }
      
      case 'related': {
        const policyId = searchParams.get('id');
        
        if (!policyId) {
          return NextResponse.json(
            { success: false, error: 'Policy ID is required' },
            { status: 400 }
          );
        }
        
        const relatedPolicies = planningPolicyDatabaseService.getRelatedPolicies(policyId);
        
        return NextResponse.json({
          success: true,
          data: relatedPolicies,
        });
      }
      
      case 'categories': {
        const categories = planningPolicyDatabaseService.getCategories();
        
        return NextResponse.json({
          success: true,
          data: categories,
        });
      }
      
      default:
        return NextResponse.json(
          { success: false, error: 'Unknown action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Policies GET error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch policies',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// POST /api/policies - Assess policy compliance
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectType, area, projectDetails } = body;
    
    if (!projectType || !area) {
      return NextResponse.json(
        { success: false, error: 'Project type and area are required' },
        { status: 400 }
      );
    }
    
    const assessment = planningPolicyDatabaseService.assessCompliance(
      projectType as ProjectType,
      area,
      projectDetails || {}
    );
    
    return NextResponse.json({
      success: true,
      data: assessment,
    });
    
  } catch (error) {
    console.error('Policy assessment error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to assess policy compliance',
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
      search: {
        method: 'GET',
        path: '/api/policies?action=search',
        params: {
          q: 'Search query (optional)',
          category: 'PolicyCategory (optional)',
          projectType: 'ProjectType (optional)',
          area: 'Area code like NW3 (optional)',
          source: 'PolicySource (optional)'
        }
      },
      getPolicy: {
        method: 'GET',
        path: '/api/policies?action=get&id={policyId}',
      },
      getPolicyByCode: {
        method: 'GET',
        path: '/api/policies?action=get&code={policyCode}',
      },
      getProjectPolicies: {
        method: 'GET',
        path: '/api/policies?action=project&projectType=extension&area=NW3',
      },
      getCategories: {
        method: 'GET',
        path: '/api/policies?action=categories',
      },
      assessCompliance: {
        method: 'POST',
        path: '/api/policies',
        body: {
          projectType: 'ProjectType (required)',
          area: 'string (required)',
          projectDetails: {
            inConservationArea: 'boolean (optional)',
            isListedBuilding: 'boolean (optional)',
            hasBasement: 'boolean (optional)',
            nearTrees: 'boolean (optional)',
            extensionSize: 'small|medium|large (optional)'
          }
        }
      }
    },
    categories: [
      'heritage', 'design', 'housing', 'environment', 'transport',
      'amenity', 'sustainability', 'trees', 'flooding', 'basements'
    ],
    projectTypes: [
      'extension', 'loft_conversion', 'basement', 'new_build', 'change_of_use',
      'listed_building', 'demolition', 'trees', 'shopfront', 'advertisement'
    ],
    sources: [
      'camden_local_plan', 'london_plan', 'nppf',
      'conservation_area_statement', 'supplementary_guidance', 'article_4_direction'
    ]
  });
}
