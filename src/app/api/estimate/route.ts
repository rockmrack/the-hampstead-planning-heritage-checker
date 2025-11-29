/**
 * Cost Estimation API
 * 
 * POST /api/estimate - Generate detailed cost estimate
 * GET /api/estimate/quick - Quick estimate without full breakdown
 */

import { NextRequest, NextResponse } from 'next/server';
import { costEstimator, ProjectCategory, FinishLevel, HeritageComplexity } from '@/lib/services/cost-estimator';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.projectCategory) {
      return NextResponse.json(
        { error: 'Project category is required' },
        { status: 400 }
      );
    }
    
    if (!body.dimensions?.area && !(body.dimensions?.length && body.dimensions?.width)) {
      return NextResponse.json(
        { error: 'Either area or length and width are required' },
        { status: 400 }
      );
    }
    
    if (!body.postcode) {
      return NextResponse.json(
        { error: 'Postcode is required' },
        { status: 400 }
      );
    }
    
    // Generate detailed estimate
    const estimate = costEstimator.generateEstimate({
      projectCategory: body.projectCategory as ProjectCategory,
      dimensions: {
        area: body.dimensions?.area,
        length: body.dimensions?.length,
        width: body.dimensions?.width,
        height: body.dimensions?.height,
      },
      finishLevel: (body.finishLevel || 'standard') as FinishLevel,
      heritageStatus: body.heritageStatus || 'GREEN',
      heritageComplexity: body.heritageComplexity as HeritageComplexity | undefined,
      postcode: body.postcode,
      borough: body.borough,
      includeBasement: body.includeBasement,
      includeRoofwork: body.includeRoofwork,
      structuralWork: body.structuralWork || 'minor',
      existingCondition: body.existingCondition || 'fair',
      accessDifficulty: body.accessDifficulty || 'moderate',
      sustainabilityFeatures: body.sustainabilityFeatures,
    });
    
    return NextResponse.json({
      success: true,
      estimate: {
        id: estimate.id,
        projectCategory: estimate.projectCategory,
        summary: estimate.summary,
        breakdown: {
          construction: Object.fromEntries(
            Object.entries(estimate.breakdown.construction).filter(([, v]) => v)
          ),
          professionalFees: Object.fromEntries(
            Object.entries(estimate.breakdown.professionalFees).filter(([, v]) => v)
          ),
          statutory: Object.fromEntries(
            Object.entries(estimate.breakdown.statutory).filter(([, v]) => v)
          ),
          preliminaries: Object.fromEntries(
            Object.entries(estimate.breakdown.preliminaries).filter(([, v]) => v)
          ),
          contingency: estimate.breakdown.contingency,
        },
        timeline: estimate.timeline,
        heritageFactors: estimate.heritageFactors,
        risks: estimate.risks,
        comparisons: estimate.comparisons,
        recommendations: estimate.recommendations,
        createdAt: estimate.createdAt.toISOString(),
      },
    });
    
  } catch (error) {
    console.error('Cost estimation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate cost estimate' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const projectCategory = searchParams.get('projectCategory') as ProjectCategory;
    const area = parseFloat(searchParams.get('area') || '20');
    const finishLevel = (searchParams.get('finishLevel') || 'standard') as FinishLevel;
    const postcode = searchParams.get('postcode') || 'NW3';
    const heritageStatus = (searchParams.get('heritageStatus') || 'GREEN') as 'RED' | 'AMBER' | 'GREEN';
    
    if (!projectCategory) {
      return NextResponse.json(
        { error: 'Project category is required' },
        { status: 400 }
      );
    }
    
    const estimate = costEstimator.getQuickEstimate({
      projectCategory,
      area,
      finishLevel,
      postcode,
      heritageStatus,
    });
    
    return NextResponse.json({
      success: true,
      quickEstimate: {
        ...estimate,
        area,
        pricePerSqm: {
          low: Math.round(estimate.low / area),
          mid: Math.round(estimate.mid / area),
          high: Math.round(estimate.high / area),
        },
        currency: 'GBP',
        note: 'This is a quick estimate. Use POST for detailed breakdown.',
      },
    });
    
  } catch (error) {
    console.error('Quick estimate error:', error);
    return NextResponse.json(
      { error: 'Failed to generate quick estimate' },
      { status: 500 }
    );
  }
}
