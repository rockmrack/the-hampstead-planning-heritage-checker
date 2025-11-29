/**
 * Timeline Predictor API
 * 
 * Predict planning application timelines.
 * 
 * GET /api/timeline?postcode=NW3&projectType=extension
 * POST /api/timeline - Full prediction with all factors
 * POST /api/timeline/compare - Compare scenarios
 */

import { NextRequest, NextResponse } from 'next/server';
import { timelinePredictor } from '@/lib/services/timeline-predictor';

/**
 * GET - Quick timeline prediction
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    const postcode = searchParams.get('postcode');
    if (!postcode) {
      return NextResponse.json(
        { error: 'Postcode required' },
        { status: 400 }
      );
    }
    
    const projectType = searchParams.get('projectType') || 'extension';
    const isConservationArea = searchParams.get('conservationArea') === 'true';
    const isListedBuilding = searchParams.get('listedBuilding') === 'true';
    
    const prediction = timelinePredictor.predictTimeline({
      projectType,
      postcode,
      isConservationArea,
      isListedBuilding
    });
    
    // Get dates
    const dates = timelinePredictor.getCompletionDate({
      projectType,
      postcode,
      isConservationArea,
      isListedBuilding
    });
    
    return NextResponse.json({
      success: true,
      prediction: {
        totalWeeks: prediction.totalWeeks,
        confidence: Math.round(prediction.confidence * 100),
        estimatedCompletion: dates.estimated.toISOString(),
        earliestCompletion: dates.earliest.toISOString(),
        latestCompletion: dates.latest.toISOString()
      },
      phases: prediction.phases.map(p => ({
        name: p.name,
        duration: p.duration,
        startWeek: p.startWeek,
        endWeek: p.endWeek
      })),
      tips: prediction.tips.slice(0, 3)
    });
    
  } catch (error) {
    console.error('Timeline GET error:', error);
    return NextResponse.json(
      { error: 'Timeline prediction failed' },
      { status: 500 }
    );
  }
}

/**
 * POST - Full timeline prediction or comparison
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, factors, scenarios, startDate } = body;
    
    // Validate factors
    if (!factors || !factors.postcode || !factors.projectType) {
      return NextResponse.json(
        { error: 'factors with postcode and projectType required' },
        { status: 400 }
      );
    }
    
    const start = startDate ? new Date(startDate) : new Date();
    
    if (action === 'compare' && scenarios) {
      // Compare scenarios
      if (!Array.isArray(scenarios) || scenarios.length === 0) {
        return NextResponse.json(
          { error: 'scenarios array required for comparison' },
          { status: 400 }
        );
      }
      
      const comparison = timelinePredictor.compareScenarios(factors, scenarios);
      
      return NextResponse.json({
        success: true,
        baseFactors: factors,
        comparison
      });
    }
    
    // Full prediction
    const prediction = timelinePredictor.predictTimeline(factors);
    const dates = timelinePredictor.getCompletionDate(factors, start);
    const schedule = timelinePredictor.getPhaseSchedule(factors, start);
    
    return NextResponse.json({
      success: true,
      prediction: {
        projectType: prediction.projectType,
        location: prediction.location,
        totalWeeks: prediction.totalWeeks,
        confidence: Math.round(prediction.confidence * 100),
        workingDays: dates.workingDays
      },
      dates: {
        start: start.toISOString(),
        estimated: dates.estimated.toISOString(),
        earliest: dates.earliest.toISOString(),
        latest: dates.latest.toISOString()
      },
      phases: prediction.phases,
      schedule: schedule.map(s => ({
        phase: s.phase.name,
        startDate: s.startDate.toISOString(),
        endDate: s.endDate.toISOString(),
        duration: s.phase.duration,
        isCritical: s.isCritical
      })),
      milestones: prediction.milestones,
      risks: prediction.risks,
      tips: prediction.tips
    });
    
  } catch (error) {
    console.error('Timeline POST error:', error);
    return NextResponse.json(
      { error: 'Timeline prediction failed' },
      { status: 500 }
    );
  }
}
