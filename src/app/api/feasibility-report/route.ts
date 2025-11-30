/**
 * Feasibility Report API
 * Comprehensive development feasibility analysis
 * GET/POST /api/feasibility-report
 */

import { NextRequest, NextResponse } from 'next/server';

// Types
type FeasibilityRating = 'excellent' | 'good' | 'moderate' | 'challenging' | 'not_recommended';
type PropertyType = 'detached' | 'semi_detached' | 'terraced' | 'flat' | 'maisonette';
type DevelopmentType = 'extension' | 'basement' | 'loft' | 'new_build' | 'change_of_use';
type ListedGrade = 'I' | 'II*' | 'II' | null;

interface FeasibilityScore {
  category: string;
  score: number;
  notes: string[];
  risks: string[];
}

interface FeasibilityResult {
  overallScore: number;
  rating: FeasibilityRating;
  recommendation: string;
  scores: FeasibilityScore[];
  timeline: { phase: string; duration: string }[];
  budgetRange: { min: number; max: number };
  nextSteps: string[];
}

// Heritage base scores
const HERITAGE_SCORES: Record<string, number> = {
  'I': 25,
  'II*': 40,
  'II': 50,
  'conservation': 65,
  'none': 85,
};

// Construction costs per sqm
const CONSTRUCTION_RATES: Record<DevelopmentType, { min: number; max: number }> = {
  extension: { min: 2500, max: 4000 },
  basement: { min: 4000, max: 6500 },
  loft: { min: 2200, max: 3500 },
  new_build: { min: 3000, max: 5000 },
  change_of_use: { min: 1500, max: 3000 },
};

// Timeline estimates
const TIMELINES: Record<DevelopmentType, { phase: string; duration: string }[]> = {
  extension: [
    { phase: 'Design & Planning', duration: '3-4 months' },
    { phase: 'Pre-Construction', duration: '1-2 months' },
    { phase: 'Construction', duration: '3-5 months' },
  ],
  basement: [
    { phase: 'Design & Planning', duration: '4-6 months' },
    { phase: 'Party Wall & Surveys', duration: '2-3 months' },
    { phase: 'Construction', duration: '12-18 months' },
  ],
  loft: [
    { phase: 'Design & Planning', duration: '2-3 months' },
    { phase: 'Pre-Construction', duration: '1-2 months' },
    { phase: 'Construction', duration: '2-4 months' },
  ],
  new_build: [
    { phase: 'Design & Planning', duration: '6-9 months' },
    { phase: 'Pre-Construction', duration: '2-3 months' },
    { phase: 'Construction', duration: '12-18 months' },
  ],
  change_of_use: [
    { phase: 'Planning Application', duration: '3-4 months' },
    { phase: 'Fit-out Works', duration: '2-6 months' },
  ],
};

function getOverallRating(score: number): FeasibilityRating {
  if (score >= 80) return 'excellent';
  if (score >= 65) return 'good';
  if (score >= 50) return 'moderate';
  if (score >= 35) return 'challenging';
  return 'not_recommended';
}

function getRecommendation(rating: FeasibilityRating): string {
  switch (rating) {
    case 'excellent':
      return 'Strong potential for approval. Proceed with detailed design development.';
    case 'good':
      return 'Good prospects with careful attention to constraints. Professional guidance recommended.';
    case 'moderate':
      return 'Achievable but requires addressing significant constraints. Pre-application advice strongly recommended.';
    case 'challenging':
      return 'Significant obstacles identified. Consider design modifications before proceeding.';
    case 'not_recommended':
      return 'Substantial barriers to approval. Fundamental reconsideration advised.';
  }
}

function calculateFeasibility(
  postcode: string,
  propertyType: PropertyType,
  developmentType: DevelopmentType,
  listedGrade: ListedGrade,
  conservationArea: boolean,
  proposedSize: number
): FeasibilityResult {
  const scores: FeasibilityScore[] = [];
  
  // Planning Policy Score
  let policyScore = HERITAGE_SCORES['none'] ?? 85;
  const policyNotes: string[] = [];
  const policyRisks: string[] = [];
  
  if (listedGrade) {
    policyScore = HERITAGE_SCORES[listedGrade] ?? 50;
    policyRisks.push('Listed building consent required');
    policyNotes.push(`Grade ${listedGrade} listing applies strict controls`);
  }
  
  if (conservationArea) {
    policyScore = Math.min(policyScore, HERITAGE_SCORES['conservation'] ?? 65);
    policyNotes.push('Conservation area policies apply');
  }
  
  scores.push({
    category: 'Planning Policy',
    score: policyScore,
    notes: policyNotes.length > 0 ? policyNotes : ['Standard planning policies apply'],
    risks: policyRisks,
  });
  
  // Heritage Impact Score
  let heritageScore = listedGrade ? 45 : conservationArea ? 65 : 90;
  const heritageNotes: string[] = [];
  const heritageRisks: string[] = [];
  
  if (listedGrade) {
    heritageNotes.push('Heritage statement required');
    heritageRisks.push('Design must protect special interest');
  }
  
  if (conservationArea) {
    heritageNotes.push('Design must preserve or enhance character');
  }
  
  scores.push({
    category: 'Heritage Impact',
    score: heritageScore,
    notes: heritageNotes.length > 0 ? heritageNotes : ['No heritage constraints'],
    risks: heritageRisks,
  });
  
  // Neighbour Impact Score
  let neighbourScore = 75;
  const neighbourNotes: string[] = [];
  const neighbourRisks: string[] = [];
  
  if (propertyType === 'terraced') {
    neighbourScore -= 10;
    neighbourRisks.push('Party wall with both neighbours');
  } else if (propertyType === 'semi_detached') {
    neighbourScore -= 5;
    neighbourRisks.push('Party wall with attached neighbour');
  }
  
  if (developmentType === 'basement') {
    neighbourScore -= 15;
    neighbourRisks.push('Construction noise and vibration');
    neighbourNotes.push('Construction management plan essential');
  }
  
  scores.push({
    category: 'Neighbour Impact',
    score: neighbourScore,
    notes: neighbourNotes.length > 0 ? neighbourNotes : ['Standard considerations'],
    risks: neighbourRisks,
  });
  
  // Construction Feasibility Score
  let constructionScore = 80;
  const constructionNotes: string[] = [];
  const constructionRisks: string[] = [];
  
  if (developmentType === 'basement') {
    constructionScore = 60;
    constructionRisks.push('Ground conditions unknown');
    constructionRisks.push('Water table assessment needed');
    constructionNotes.push('Structural engineer essential');
  }
  
  scores.push({
    category: 'Construction Feasibility',
    score: constructionScore,
    notes: constructionNotes.length > 0 ? constructionNotes : ['Standard construction methods'],
    risks: constructionRisks,
  });
  
  // Calculate overall
  const totalScore = scores.reduce((sum, s) => sum + s.score, 0);
  const overallScore = Math.round(totalScore / scores.length);
  const rating = getOverallRating(overallScore);
  const recommendation = getRecommendation(rating);
  
  // Calculate budget
  const rates = CONSTRUCTION_RATES[developmentType];
  const heritageMultiplier = listedGrade ? 1.3 : conservationArea ? 1.15 : 1.0;
  const budgetRange = {
    min: Math.round(proposedSize * rates.min * heritageMultiplier),
    max: Math.round(proposedSize * rates.max * heritageMultiplier * 1.15), // +15% contingency
  };
  
  // Timeline
  const timeline = TIMELINES[developmentType];
  
  // Next steps
  const nextSteps: string[] = [
    'Engage RIBA architect with local experience',
  ];
  
  if (listedGrade) {
    nextSteps.push('Appoint heritage consultant');
  }
  
  if (rating === 'challenging' || rating === 'moderate' || listedGrade) {
    nextSteps.push('Submit pre-application enquiry');
  }
  
  if (developmentType === 'basement') {
    nextSteps.push('Commission structural survey');
    nextSteps.push('Arrange ground investigation');
  }
  
  nextSteps.push('Develop initial design concepts');
  nextSteps.push('Consult with immediate neighbours');
  
  return {
    overallScore,
    rating,
    recommendation,
    scores,
    timeline,
    budgetRange,
    nextSteps,
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      postcode,
      propertyType = 'terraced',
      developmentType = 'extension',
      listedGrade = null,
      conservationArea = false,
      proposedSize = 30,
    } = body;
    
    if (!postcode) {
      return NextResponse.json({ error: 'Postcode required' }, { status: 400 });
    }
    
    // Auto-detect conservation area from postcode
    const areaMatch = postcode.match(/^(NW\d{1,2}|N\d{1,2})/i);
    const areaPrefix = areaMatch && areaMatch[1] ? areaMatch[1].toUpperCase() : '';
    const isConservation = conservationArea || ['NW3', 'NW6', 'NW8', 'NW11', 'N2', 'N6', 'N10'].includes(areaPrefix);
    
    const result = calculateFeasibility(
      postcode,
      propertyType as PropertyType,
      developmentType as DevelopmentType,
      listedGrade as ListedGrade,
      isConservation,
      proposedSize
    );
    
    return NextResponse.json({
      success: true,
      input: {
        postcode,
        propertyType,
        developmentType,
        listedGrade,
        conservationArea: isConservation,
        proposedSize,
      },
      feasibility: result,
      generatedAt: new Date().toISOString(),
    });
    
  } catch (error) {
    console.error('Feasibility report error:', error);
    return NextResponse.json({ error: 'Failed to generate feasibility report' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const postcode = searchParams.get('postcode');
  const developmentType = searchParams.get('type') as DevelopmentType | null;
  
  if (postcode && developmentType) {
    const result = calculateFeasibility(
      postcode,
      'terraced',
      developmentType,
      null,
      true,
      30
    );
    
    return NextResponse.json({
      postcode,
      developmentType,
      quickAssessment: {
        score: result.overallScore,
        rating: result.rating,
        recommendation: result.recommendation,
      },
    });
  }
  
  return NextResponse.json({
    service: 'Feasibility Report API',
    version: '1.0.0',
    description: 'Comprehensive development feasibility analysis',
    endpoints: {
      'GET /api/feasibility-report': 'Service info',
      'GET /api/feasibility-report?postcode=NW3&type=extension': 'Quick assessment',
      'POST /api/feasibility-report': 'Full feasibility report',
    },
    postBody: {
      postcode: 'string (required)',
      propertyType: 'detached | semi_detached | terraced | flat | maisonette',
      developmentType: 'extension | basement | loft | new_build | change_of_use',
      listedGrade: 'I | II* | II | null',
      conservationArea: 'boolean',
      proposedSize: 'number (sqm)',
    },
    ratings: ['excellent', 'good', 'moderate', 'challenging', 'not_recommended'],
  });
}
