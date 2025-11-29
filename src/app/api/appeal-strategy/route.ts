/**
 * Appeal Strategy API
 * Planning appeal guidance and strategy recommendations
 * GET/POST /api/appeal-strategy
 */

import { NextRequest, NextResponse } from 'next/server';

// Types
type AppealType = 'written_representations' | 'hearing' | 'inquiry';

// Success rates by project type
const APPEAL_SUCCESS_RATES: Record<string, Record<AppealType, number>> = {
  extension: { written_representations: 35, hearing: 42, inquiry: 45 },
  basement: { written_representations: 25, hearing: 32, inquiry: 38 },
  loft_conversion: { written_representations: 40, hearing: 48, inquiry: 50 },
  change_of_use: { written_representations: 30, hearing: 38, inquiry: 42 },
  new_build: { written_representations: 20, hearing: 28, inquiry: 35 },
  listed_building: { written_representations: 18, hearing: 25, inquiry: 30 },
};

// Costs and timelines
const APPEAL_COSTS: Record<AppealType, { min: number; max: number }> = {
  written_representations: { min: 3000, max: 8000 },
  hearing: { min: 8000, max: 20000 },
  inquiry: { min: 20000, max: 75000 },
};

const APPEAL_TIMELINES: Record<AppealType, string> = {
  written_representations: '16-24 weeks',
  hearing: '20-32 weeks',
  inquiry: '32-52 weeks',
};

// Refusal reason responses
const REFUSAL_RESPONSES: Record<string, {
  category: string;
  appealability: 'high' | 'medium' | 'low';
  arguments: string[];
  evidence: string[];
}> = {
  'out_of_character': {
    category: 'Design',
    appealability: 'medium',
    arguments: ['Demonstrate design evolution in area', 'Reference similar approved schemes'],
    evidence: ['Street scene analysis', 'Approved precedents within 200m'],
  },
  'overdevelopment': {
    category: 'Scale',
    appealability: 'low',
    arguments: ['Compare with similar plot ratios nearby', 'Demonstrate functional need'],
    evidence: ['Plot ratio analysis', 'Daylight/sunlight study'],
  },
  'neighbour_amenity': {
    category: 'Impact',
    appealability: 'high',
    arguments: ['BRE daylight/sunlight compliance', 'Limited overlooking through design'],
    evidence: ['BRE daylight/sunlight assessment', 'Privacy analysis with distances'],
  },
  'heritage_harm': {
    category: 'Heritage',
    appealability: 'low',
    arguments: ['Less than substantial harm balanced by public benefits', 'Reversible interventions'],
    evidence: ['Heritage impact assessment', 'Historic England consultation'],
  },
  'policy_conflict': {
    category: 'Policy',
    appealability: 'medium',
    arguments: ['Material considerations outweigh policy', 'Consistency with other decisions'],
    evidence: ['Policy compliance matrix', 'Comparable approved cases'],
  },
  'basement_policy': {
    category: 'Basement',
    appealability: 'low',
    arguments: ['Compliance with 50% garden rule', 'No structural concerns'],
    evidence: ['Structural engineering report', 'Hydrology assessment'],
  },
  'trees': {
    category: 'Trees',
    appealability: 'high',
    arguments: ['Arboricultural method statement acceptable', 'Replacement planting proposed'],
    evidence: ['BS5837 tree survey', 'Arboricultural impact assessment'],
  },
};

function analyzeRefusal(refusalReasons: string[]) {
  const addressable: string[] = [];
  const difficult: string[] = [];
  const policyConflicts: string[] = [];
  const compromises: string[] = [];
  
  for (const reason of refusalReasons) {
    const lowerReason = reason.toLowerCase();
    let found = false;
    
    for (const [key, response] of Object.entries(REFUSAL_RESPONSES)) {
      if (lowerReason.includes(key.replace('_', ' ')) ||
          lowerReason.includes(response.category.toLowerCase())) {
        found = true;
        if (response.appealability === 'high') {
          addressable.push(reason);
        } else if (response.appealability === 'low') {
          difficult.push(reason);
        } else {
          addressable.push(reason);
        }
        if (response.category === 'Policy') policyConflicts.push(reason);
        break;
      }
    }
    
    if (!found) addressable.push(reason);
  }
  
  if (difficult.some(r => r.toLowerCase().includes('scale'))) {
    compromises.push('Consider reducing scheme by 10-15%');
  }
  if (difficult.some(r => r.toLowerCase().includes('heritage'))) {
    compromises.push('Engage heritage consultant for redesign');
  }
  
  return { reasons: refusalReasons, addressableReasons: addressable, difficultReasons: difficult, policyConflicts, potentialCompromises: compromises };
}

function developStrategy(
  projectType: string,
  refusalReasons: string[],
  isListed: boolean,
  inConservationArea: boolean,
  hasHeritageConcerns: boolean
) {
  const rates = APPEAL_SUCCESS_RATES[projectType] || APPEAL_SUCCESS_RATES['extension'];
  
  let successModifier = 0;
  if (isListed) successModifier -= 15;
  if (inConservationArea) successModifier -= 5;
  if (hasHeritageConcerns) successModifier -= 10;
  
  const analysis = analyzeRefusal(refusalReasons);
  const addressableRatio = analysis.addressableReasons.length / Math.max(1, refusalReasons.length);
  successModifier += Math.round(addressableRatio * 10);
  
  let recommendedType: AppealType = 'written_representations';
  let baseProbability = rates.written_representations;
  
  if (refusalReasons.length > 3 || hasHeritageConcerns) {
    recommendedType = 'hearing';
    baseProbability = rates.hearing;
  }
  
  if (isListed || refusalReasons.length > 5) {
    recommendedType = 'inquiry';
    baseProbability = rates.inquiry;
  }
  
  const successProbability = Math.max(5, Math.min(85, baseProbability + successModifier));
  
  const grounds: string[] = [];
  if (analysis.policyConflicts.length > 0) grounds.push('policy_compliance');
  if (analysis.addressableReasons.length > 0) grounds.push('material_considerations');
  grounds.push('precedent');
  
  const evidence: string[] = [];
  for (const reason of analysis.addressableReasons) {
    const lowerReason = reason.toLowerCase();
    for (const [key, response] of Object.entries(REFUSAL_RESPONSES)) {
      if (lowerReason.includes(key.replace('_', ' ')) ||
          lowerReason.includes(response.category.toLowerCase())) {
        evidence.push(...response.evidence);
        break;
      }
    }
  }
  const uniqueEvidence = Array.from(new Set(evidence));
  
  const weaknesses: string[] = [];
  if (analysis.difficultReasons.length > 0) {
    weaknesses.push(`${analysis.difficultReasons.length} reason(s) difficult to overcome`);
  }
  if (isListed) weaknesses.push('Listed building cases have lower success rates');
  
  const recommendations: string[] = ['Engage planning consultant with appeal experience'];
  if (hasHeritageConcerns) recommendations.push('Commission independent heritage assessment');
  recommendations.push('Research recent approved precedents in area');
  if (analysis.potentialCompromises.length > 0) {
    recommendations.push('Consider scheme amendments before appeal');
  }
  
  return {
    recommendedType,
    successProbability,
    estimatedCost: APPEAL_COSTS[recommendedType],
    timeline: APPEAL_TIMELINES[recommendedType],
    groundsToArgue: grounds,
    supportingEvidence: uniqueEvidence,
    weaknesses,
    recommendations,
    refusalAnalysis: analysis,
  };
}

function getDeadlines(decisionDate: string) {
  const decision = new Date(decisionDate);
  const deadline = new Date(decision);
  deadline.setMonth(deadline.getMonth() + 6);
  
  const now = new Date();
  const daysRemaining = Math.floor((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  return {
    appealDeadline: deadline.toISOString().split('T')[0],
    daysRemaining,
    urgent: daysRemaining < 30,
    expired: daysRemaining < 0,
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;
    
    if (action === 'analyze-refusal') {
      const { refusalReasons } = body;
      if (!refusalReasons || !Array.isArray(refusalReasons)) {
        return NextResponse.json({ error: 'refusalReasons array required' }, { status: 400 });
      }
      
      const analysis = analyzeRefusal(refusalReasons);
      return NextResponse.json({ success: true, analysis });
    }
    
    if (action === 'develop-strategy') {
      const { projectType, refusalReasons, isListed, inConservationArea, hasHeritageConcerns } = body;
      
      if (!projectType || !refusalReasons) {
        return NextResponse.json(
          { error: 'projectType and refusalReasons required' },
          { status: 400 }
        );
      }
      
      const strategy = developStrategy(
        projectType,
        refusalReasons,
        isListed || false,
        inConservationArea || false,
        hasHeritageConcerns || false
      );
      
      return NextResponse.json({ success: true, strategy });
    }
    
    if (action === 'check-deadlines') {
      const { decisionDate } = body;
      if (!decisionDate) {
        return NextResponse.json({ error: 'decisionDate required (YYYY-MM-DD)' }, { status: 400 });
      }
      
      const deadlines = getDeadlines(decisionDate);
      return NextResponse.json({ success: true, deadlines });
    }
    
    return NextResponse.json(
      { error: 'Invalid action. Use: analyze-refusal, develop-strategy, check-deadlines' },
      { status: 400 }
    );
    
  } catch (error) {
    console.error('Appeal Strategy API error:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  if (searchParams.get('success-rates') === 'true') {
    return NextResponse.json({ successRates: APPEAL_SUCCESS_RATES });
  }
  
  if (searchParams.get('types') === 'true') {
    return NextResponse.json({
      appealTypes: {
        written_representations: {
          name: 'Written Representations',
          description: 'Exchange of written statements - no hearing',
          costs: APPEAL_COSTS.written_representations,
          timeline: APPEAL_TIMELINES.written_representations,
        },
        hearing: {
          name: 'Hearing',
          description: 'Informal discussion led by inspector',
          costs: APPEAL_COSTS.hearing,
          timeline: APPEAL_TIMELINES.hearing,
        },
        inquiry: {
          name: 'Public Inquiry',
          description: 'Formal hearing with cross-examination',
          costs: APPEAL_COSTS.inquiry,
          timeline: APPEAL_TIMELINES.inquiry,
        },
      },
    });
  }
  
  if (searchParams.get('refusal-categories') === 'true') {
    return NextResponse.json({
      refusalCategories: Object.entries(REFUSAL_RESPONSES).map(([key, value]) => ({
        key,
        category: value.category,
        appealability: value.appealability,
      })),
    });
  }
  
  return NextResponse.json({
    service: 'Appeal Strategy API',
    version: '1.0.0',
    description: 'Planning appeal guidance and strategy recommendations',
    endpoints: {
      'GET /api/appeal-strategy': 'Service info',
      'GET /api/appeal-strategy?success-rates=true': 'Appeal success rates by type',
      'GET /api/appeal-strategy?types=true': 'Appeal types with costs/timelines',
      'GET /api/appeal-strategy?refusal-categories=true': 'Refusal reason categories',
      'POST (action: analyze-refusal)': 'Analyze refusal reasons',
      'POST (action: develop-strategy)': 'Develop full appeal strategy',
      'POST (action: check-deadlines)': 'Check appeal deadlines',
    },
    projectTypes: Object.keys(APPEAL_SUCCESS_RATES),
    appealDeadline: '6 months from decision date',
  });
}
