/**
 * Approval Prediction API
 * POST /api/predict
 */

import { NextRequest, NextResponse } from 'next/server';
import { 
  predictApproval, 
  PredictionInput,
  getApprovalSummary,
  getRecommendedApproachText 
} from '@/lib/services/approval-prediction';
import { logger } from '@/lib/utils/logger';

export async function POST(request: NextRequest) {
  const requestId = crypto.randomUUID();
  
  try {
    const body = await request.json();
    const input: PredictionInput = body;

    // Validate required fields
    if (!input.propertyType) {
      return NextResponse.json(
        { error: 'Missing required field: propertyType' },
        { status: 400 }
      );
    }

    if (!input.heritageStatus || !['RED', 'AMBER', 'GREEN'].includes(input.heritageStatus)) {
      return NextResponse.json(
        { error: 'Invalid heritage status. Must be RED, AMBER, or GREEN' },
        { status: 400 }
      );
    }

    if (!input.projectType) {
      return NextResponse.json(
        { error: 'Missing required field: projectType' },
        { status: 400 }
      );
    }

    logger.info('Approval prediction requested', {
      requestId,
      projectType: input.projectType,
      heritageStatus: input.heritageStatus,
      borough: input.borough,
    });

    // Perform prediction
    const prediction = predictApproval(input);
    const summary = getApprovalSummary(prediction.approvalProbability);
    const approachText = getRecommendedApproachText(prediction.recommendedApproach);

    logger.info('Approval prediction completed', {
      requestId,
      approvalProbability: prediction.approvalProbability,
      confidenceLevel: prediction.confidenceLevel,
      riskFactorsCount: prediction.riskFactors.length,
    });

    return NextResponse.json({
      success: true,
      requestId,
      prediction: {
        ...prediction,
        summaryText: summary,
        approachText,
      },
    });
  } catch (error) {
    logger.error('Approval prediction failed', {
      requestId,
      error: error instanceof Error ? error.message : 'Unknown error',
    });

    return NextResponse.json(
      { 
        error: 'Prediction failed',
        requestId,
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Approval Prediction API',
    version: '1.0.0',
    usage: 'POST with property and project details',
    requiredFields: [
      'propertyType',
      'heritageStatus',
      'projectType',
      'borough',
    ],
    optionalFields: [
      'hasArticle4',
      'listedGrade',
      'conservationAreaName',
      'isVisibleFromHighway',
      'affectsNeighbors',
      'hasArchitect',
      'hasHeritageStatement',
      'hasPreApplication',
      'previousRefusals',
      'neighborObjectionsLikely',
    ],
  });
}
