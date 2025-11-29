/**
 * Appeals API
 * Endpoints for appeal analysis and recommendations
 * GET/POST /api/appeals
 */

import { NextRequest, NextResponse } from 'next/server';

// Types for appeal analysis
interface AppealAnalysisRequest {
  postcode: string;
  projectType: string;
  refusalReasons: string[];
  refusalDate: string;
  inConservationArea: boolean;
  isListedBuilding: boolean;
  hasHeritageStatement: boolean;
  hasPreApplication: boolean;
  neighborObjections: number;
  officerRecommendation: 'approve' | 'refuse';
  committeeDecision: boolean;
}

// Refusal reason success rates
const REFUSAL_REASON_RATES: Record<string, { rate: number; notes: string }> = {
  'design_quality': { rate: 45, notes: 'Often subjective - strong design rationale can overturn' },
  'heritage_impact': { rate: 28, notes: 'Inspectors take heritage seriously - need robust heritage statement' },
  'neighbor_amenity': { rate: 52, notes: 'Technical evidence (daylight studies) often successful' },
  'overdevelopment': { rate: 35, notes: 'Policy-based - show compliance with density guidelines' },
  'character_harm': { rate: 38, notes: 'Document local character analysis thoroughly' },
  'parking': { rate: 58, notes: 'Sustainable transport arguments often succeed' },
  'daylight_sunlight': { rate: 48, notes: 'BRE guidelines compliance is key evidence' },
  'privacy': { rate: 42, notes: 'Mitigation measures can address concerns' },
  'trees': { rate: 32, notes: 'Arboricultural evidence crucial' },
  'policy_conflict': { rate: 25, notes: 'Hardest to overturn - focus on material considerations' },
};

// Area appeal statistics
const AREA_STATS: Record<string, { successRate: number; avgWeeks: number; totalAppeals: number }> = {
  'NW3': { successRate: 32, avgWeeks: 16, totalAppeals: 245 },
  'NW6': { successRate: 36, avgWeeks: 14, totalAppeals: 189 },
  'NW8': { successRate: 27, avgWeeks: 18, totalAppeals: 156 },
  'NW1': { successRate: 35, avgWeeks: 15, totalAppeals: 178 },
  'NW2': { successRate: 39, avgWeeks: 13, totalAppeals: 134 },
  'NW5': { successRate: 40, avgWeeks: 12, totalAppeals: 112 },
  'NW11': { successRate: 36, avgWeeks: 14, totalAppeals: 98 },
  'N2': { successRate: 44, avgWeeks: 11, totalAppeals: 87 },
  'N6': { successRate: 33, avgWeeks: 15, totalAppeals: 145 },
  'N10': { successRate: 42, avgWeeks: 12, totalAppeals: 76 },
};

// Extract area from postcode
function extractAreaPrefix(postcode: string): string {
  const match = postcode.match(/^(NW\d{1,2}|N\d{1,2})/i);
  return match && match[1] ? match[1].toUpperCase() : 'NW3';
}

// Calculate appeal deadlines
function calculateDeadlines(refusalDate: string): { name: string; date: string; daysRemaining: number; critical: boolean }[] {
  const refusal = new Date(refusalDate);
  const now = new Date();
  const deadlines: { name: string; date: string; daysRemaining: number; critical: boolean }[] = [];
  
  // 6-month householder deadline
  const householderDeadline = new Date(refusal);
  householderDeadline.setMonth(householderDeadline.getMonth() + 6);
  const householderDays = Math.ceil((householderDeadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  deadlines.push({
    name: 'Householder Appeal Deadline',
    date: householderDeadline.toISOString().split('T')[0] ?? '',
    daysRemaining: Math.max(0, householderDays),
    critical: householderDays <= 30,
  });
  
  // 12-week written representations
  const writtenDeadline = new Date(refusal);
  writtenDeadline.setDate(writtenDeadline.getDate() + 84);
  const writtenDays = Math.ceil((writtenDeadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  if (writtenDays > 0) {
    deadlines.push({
      name: 'Written Representations Fast-Track',
      date: writtenDeadline.toISOString().split('T')[0] ?? '',
      daysRemaining: writtenDays,
      critical: writtenDays <= 14,
    });
  }
  
  return deadlines;
}

// Analyze appeal prospects
function analyzeAppeal(input: AppealAnalysisRequest): {
  shouldAppeal: boolean;
  successProbability: number;
  confidence: 'low' | 'medium' | 'high';
  recommendedType: string;
  estimatedCost: { min: number; max: number };
  estimatedWeeks: number;
  strengths: string[];
  weaknesses: string[];
  strategyNotes: string[];
  deadlines: { name: string; date: string; daysRemaining: number; critical: boolean }[];
} {
  const areaPrefix = extractAreaPrefix(input.postcode);
  const defaultStats = AREA_STATS['NW3']!;
  const areaStats = AREA_STATS[areaPrefix] ?? defaultStats;
  
  // Base probability from area
  let probability = areaStats.successRate;
  
  // Analyze refusal reasons
  const reasonRates = input.refusalReasons.map(r => {
    const data = REFUSAL_REASON_RATES[r];
    return data ? data.rate : 40;
  });
  
  if (reasonRates.length > 0) {
    const avgReasonRate = reasonRates.reduce((a, b) => a + b, 0) / reasonRates.length;
    probability = (probability + avgReasonRate) / 2;
  }
  
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  
  // Officer recommendation
  if (input.officerRecommendation === 'approve' && input.committeeDecision) {
    probability += 15;
    strengths.push('Officer recommended approval - strong evidence of unreasonableness');
  }
  
  // Heritage documentation
  if (input.inConservationArea || input.isListedBuilding) {
    if (input.hasHeritageStatement) {
      probability += 5;
      strengths.push('Heritage statement prepared');
    } else {
      probability -= 10;
      weaknesses.push('No heritage statement for heritage-sensitive site');
    }
  }
  
  // Pre-application
  if (input.hasPreApplication) {
    probability += 8;
    strengths.push('Pre-application advice sought');
  }
  
  // Neighbor objections
  if (input.neighborObjections === 0) {
    probability += 5;
    strengths.push('No neighbor objections');
  } else if (input.neighborObjections > 5) {
    probability -= 8;
    weaknesses.push(`${input.neighborObjections} neighbor objections on record`);
  }
  
  // Listed building
  if (input.isListedBuilding) {
    probability -= 10;
    weaknesses.push('Listed building appeals have lower success rates');
  }
  
  // Clamp
  probability = Math.max(10, Math.min(75, probability));
  
  // Strategy notes
  const strategyNotes: string[] = [];
  if (input.officerRecommendation === 'approve') {
    strategyNotes.push('Emphasize that officer recommended approval');
  }
  if (input.refusalReasons.includes('design_quality')) {
    strategyNotes.push('Commission independent design review');
  }
  if (input.refusalReasons.includes('heritage_impact')) {
    strategyNotes.push('Engage conservation architect');
  }
  if (input.refusalReasons.includes('daylight_sunlight')) {
    strategyNotes.push('Commission BRE-compliant daylight assessment');
  }
  strategyNotes.push('Review similar local appeal decisions');
  
  // Determine appeal type
  let recommendedType = 'written_representations';
  let estimatedCost = { min: 2500, max: 8000 };
  
  if (input.isListedBuilding || input.refusalReasons.includes('heritage_impact')) {
    recommendedType = 'hearing';
    estimatedCost = { min: 8000, max: 20000 };
  }
  
  if (input.refusalReasons.length > 4) {
    recommendedType = 'inquiry';
    estimatedCost = { min: 25000, max: 75000 };
  }
  
  return {
    shouldAppeal: probability >= 35,
    successProbability: Math.round(probability),
    confidence: probability >= 50 ? 'high' : probability >= 35 ? 'medium' : 'low',
    recommendedType,
    estimatedCost,
    estimatedWeeks: areaStats.avgWeeks,
    strengths,
    weaknesses,
    strategyNotes,
    deadlines: calculateDeadlines(input.refusalDate),
  };
}

export async function POST(request: NextRequest) {
  try {
    const body: AppealAnalysisRequest = await request.json();
    
    // Validate required fields
    if (!body.postcode) {
      return NextResponse.json(
        { error: 'Missing required field: postcode' },
        { status: 400 }
      );
    }
    
    if (!body.refusalDate) {
      return NextResponse.json(
        { error: 'Missing required field: refusalDate' },
        { status: 400 }
      );
    }
    
    if (!body.refusalReasons || body.refusalReasons.length === 0) {
      return NextResponse.json(
        { error: 'Missing required field: refusalReasons' },
        { status: 400 }
      );
    }
    
    const analysis = analyzeAppeal(body);
    
    return NextResponse.json({
      success: true,
      postcode: body.postcode,
      projectType: body.projectType,
      analysis,
      generatedAt: new Date().toISOString(),
    });
    
  } catch (error) {
    console.error('Appeal analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze appeal prospects' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const postcode = searchParams.get('postcode');
  
  if (postcode) {
    // Return area-specific statistics
    const areaPrefix = extractAreaPrefix(postcode);
    const defaultStats = AREA_STATS['NW3']!;
    const stats = AREA_STATS[areaPrefix] ?? defaultStats;
    
    return NextResponse.json({
      area: areaPrefix,
      statistics: stats,
      refusalReasonRates: REFUSAL_REASON_RATES,
    });
  }
  
  return NextResponse.json({
    service: 'Appeals Analysis API',
    version: '1.0.0',
    description: 'Analyze planning appeal prospects and strategies',
    endpoints: {
      'GET /api/appeals': 'Get appeal statistics (optional: ?postcode=)',
      'POST /api/appeals': 'Analyze specific appeal prospects',
    },
    requiredFields: [
      'postcode',
      'projectType',
      'refusalReasons',
      'refusalDate',
      'inConservationArea',
      'isListedBuilding',
      'hasHeritageStatement',
      'hasPreApplication',
      'neighborObjections',
      'officerRecommendation',
      'committeeDecision',
    ],
    refusalReasonOptions: Object.keys(REFUSAL_REASON_RATES),
    areasCovered: Object.keys(AREA_STATS),
  });
}
