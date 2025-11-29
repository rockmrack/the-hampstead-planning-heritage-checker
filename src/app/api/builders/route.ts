/**
 * Builder Comparison API Route
 */

import { NextRequest, NextResponse } from 'next/server';
import { builderCostService } from '@/lib/services/builder-cost-comparison';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const postcode = searchParams.get('postcode');
  const projectType = searchParams.get('projectType');
  const sizeSqm = searchParams.get('sizeSqm');
  const requireHeritage = searchParams.get('requireHeritage') === 'true';
  
  if (!postcode) {
    return NextResponse.json(
      { error: 'Missing required parameter: postcode' },
      { status: 400 }
    );
  }
  
  // If no project type, return builders in area
  if (!projectType) {
    const builders = builderCostService.getBuildersByArea(postcode);
    return NextResponse.json({ builders });
  }
  
  // Get full comparison
  const comparison = builderCostService.compareBuilders(
    postcode,
    projectType,
    sizeSqm ? parseInt(sizeSqm) : 20,
    requireHeritage
  );
  
  return NextResponse.json(comparison);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { postcode, projectType, sizeSqm, requireHeritage, estimatedBudget } = body;
    
    if (!postcode || !projectType) {
      return NextResponse.json(
        { error: 'Missing required fields: postcode, projectType' },
        { status: 400 }
      );
    }
    
    // Find matching builders
    const builders = builderCostService.findBuilders(
      postcode,
      projectType,
      estimatedBudget,
      requireHeritage
    );
    
    // Get cost benchmark
    const benchmark = builderCostService.getCostBenchmark(
      projectType,
      postcode,
      sizeSqm || 20
    );
    
    // Get full comparison if we have builders
    let comparison = null;
    if (builders.length > 0) {
      comparison = builderCostService.compareBuilders(
        postcode,
        projectType,
        sizeSqm || 20,
        requireHeritage
      );
    }
    
    return NextResponse.json({
      builders,
      benchmark,
      comparison,
    });
  } catch (error) {
    console.error('Builder comparison error:', error);
    return NextResponse.json(
      { error: 'Failed to compare builders' },
      { status: 500 }
    );
  }
}
