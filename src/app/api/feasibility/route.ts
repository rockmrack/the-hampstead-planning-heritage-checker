/**
 * Feasibility Check API
 * POST /api/feasibility
 */

import { NextRequest, NextResponse } from 'next/server';
import { 
  assessFeasibility, 
  PropertyContext, 
  ProjectSpecification 
} from '@/lib/services/feasibility-engine';
import { PROJECT_TYPE_IDS } from '@/lib/constants/project-types';
import { logger } from '@/lib/utils/logger';

export async function POST(request: NextRequest) {
  const requestId = crypto.randomUUID();
  
  try {
    const body = await request.json();
    
    const {
      property,
      project,
    }: {
      property: PropertyContext;
      project: ProjectSpecification;
    } = body;

    // Validate required fields
    if (!property || !project) {
      return NextResponse.json(
        { error: 'Missing required fields: property and project' },
        { status: 400 }
      );
    }

    if (!property.heritageStatus || !['RED', 'AMBER', 'GREEN'].includes(property.heritageStatus)) {
      return NextResponse.json(
        { error: 'Invalid heritage status. Must be RED, AMBER, or GREEN' },
        { status: 400 }
      );
    }

    if (!project.projectType || !PROJECT_TYPE_IDS.includes(project.projectType.id)) {
      return NextResponse.json(
        { error: 'Invalid project type' },
        { status: 400 }
      );
    }

    logger.info('Feasibility check requested', {
      requestId,
      projectType: project.projectType,
      heritageStatus: property.heritageStatus,
      borough: property.borough,
    });

    // Perform feasibility assessment
    const report = assessFeasibility(property, project);

    logger.info('Feasibility check completed', {
      requestId,
      projectAllowed: report.projectAllowed,
      permissionRequired: report.permissionRequired,
      approvalProbability: report.approvalPrediction?.approvalProbability,
    });

    return NextResponse.json({
      success: true,
      requestId,
      report,
    });
  } catch (error) {
    logger.error('Feasibility check failed', {
      requestId,
      error: error instanceof Error ? error.message : 'Unknown error',
    });

    return NextResponse.json(
      { 
        error: 'Feasibility check failed',
        requestId,
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Feasibility Check API',
    version: '1.0.0',
    usage: 'POST with property and project details',
    projectTypes: PROJECT_TYPE_IDS,
    heritageStatuses: ['RED', 'AMBER', 'GREEN'],
  });
}
