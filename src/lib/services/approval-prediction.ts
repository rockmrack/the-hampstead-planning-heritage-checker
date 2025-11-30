/**
 * Approval Prediction AI
 * ML-based prediction of planning application approval chances
 */

export interface PredictionInput {
  // Property details
  propertyType: 'detached' | 'semi-detached' | 'terraced' | 'flat' | 'maisonette';
  heritageStatus: 'RED' | 'AMBER' | 'GREEN';
  hasArticle4: boolean;
  listedGrade?: 'I' | 'II*' | 'II';
  conservationAreaName?: string;
  borough: string;
  
  // Project details
  projectType: string;
  projectSize?: 'small' | 'medium' | 'large';
  isVisibleFromHighway: boolean;
  affectsNeighbors: boolean;
  
  // Application quality
  hasArchitect: boolean;
  hasHeritageStatement: boolean;
  hasPreApplication: boolean;
  
  // Historical context
  previousRefusals?: number;
  neighborObjectionsLikely: boolean;
}

export interface PredictionResult {
  approvalProbability: number; // 0-100
  confidenceLevel: 'high' | 'medium' | 'low';
  riskFactors: RiskFactor[];
  improvementSuggestions: ImprovementSuggestion[];
  similarApplications: SimilarApplication[];
  estimatedTimeline: TimelineEstimate;
  recommendedApproach: 'permitted-development' | 'prior-approval' | 'householder-application' | 'full-application' | 'listed-building-consent';
}

export interface RiskFactor {
  factor: string;
  impact: 'high' | 'medium' | 'low';
  description: string;
  mitigationPossible: boolean;
}

export interface ImprovementSuggestion {
  action: string;
  impactOnApproval: number; // percentage points increase
  cost: 'free' | 'low' | 'medium' | 'high';
  description: string;
}

export interface SimilarApplication {
  reference: string;
  address: string;
  projectType: string;
  outcome: 'approved' | 'refused' | 'withdrawn';
  date: string;
  decisionSummary?: string;
}

export interface TimelineEstimate {
  validationWeeks: number;
  determinationWeeks: number;
  totalWeeks: number;
  committeeLikely: boolean;
}

// ===========================================
// BASELINE APPROVAL RATES BY PROJECT TYPE
// ===========================================

const BASE_APPROVAL_RATES: Record<string, number> = {
  // Extensions
  'rear-extension-single': 92,
  'rear-extension-double': 78,
  'side-extension': 82,
  'wrap-around': 75,
  'front-porch': 88,
  
  // Loft
  'loft-dormer': 85,
  'loft-velux': 95,
  'loft-hip-to-gable': 72,
  
  // Outbuildings
  'garden-room': 90,
  'shed': 98,
  'garage': 85,
  'swimming-pool': 78,
  
  // Windows & Doors
  'windows-replacement': 94,
  'windows-new': 82,
  'doors-replacement': 96,
  'bifold-doors': 88,
  
  // Roofing
  'roof-replacement': 95,
  'roof-lights': 92,
  
  // Solar
  'solar-panels': 96,
  'solar-thermal': 95,
  'heat-pump': 88,
  
  // External
  'driveway': 85,
  'fence-wall': 90,
  'decking': 92,
  'render-cladding': 80,
  
  // Internal
  'internal-walls': 98,
  'basement': 65,
  'garage-conversion': 88,
};

// ===========================================
// HERITAGE MODIFIERS
// ===========================================

const HERITAGE_MODIFIERS = {
  'GREEN': 1.0, // No change
  'AMBER': {
    withoutArticle4: 0.85, // 15% reduction
    withArticle4: 0.70,    // 30% reduction
  },
  'RED': {
    'II': 0.60,    // 40% reduction
    'II*': 0.45,   // 55% reduction
    'I': 0.25,     // 75% reduction
  },
};

// ===========================================
// BOROUGH-SPECIFIC MODIFIERS
// ===========================================

const BOROUGH_MODIFIERS: Record<string, number> = {
  'Camden': 0.92,      // Strict - high conservation focus
  'Westminster': 0.88, // Very strict
  'Kensington and Chelsea': 0.85, // Most restrictive
  'Barnet': 0.98,      // More permissive
  'Haringey': 0.96,    // Moderate
  'Islington': 0.90,   // Fairly strict
  'Brent': 0.98,       // Permissive
  'default': 0.95,
};

// ===========================================
// QUALITY BOOSTERS
// ===========================================

const QUALITY_BOOSTERS = {
  hasArchitect: 8,           // +8% if using architect
  hasHeritageStatement: 12,  // +12% if heritage statement included
  hasPreApplication: 15,     // +15% if pre-app advice obtained
  goodDesign: 10,            // +10% for high quality design
  neighborSupport: 5,        // +5% if neighbors supportive
};

// ===========================================
// RISK FACTORS IMPACT
// ===========================================

const RISK_IMPACTS = {
  visibleFromHighway: -8,
  affectsNeighbors: -10,
  previousRefusals: -15,
  neighborObjections: -12,
  oversizedProject: -20,
  incompatibleMaterials: -15,
  noHeritageJustification: -25,
};

// ===========================================
// PREDICTION ENGINE
// ===========================================

export function predictApproval(input: PredictionInput): PredictionResult {
  // Start with base rate for project type
  let probability = BASE_APPROVAL_RATES[input.projectType] || 80;
  
  const riskFactors: RiskFactor[] = [];
  const suggestions: ImprovementSuggestion[] = [];
  
  // Apply heritage modifier
  if (input.heritageStatus === 'GREEN') {
    // No heritage impact
  } else if (input.heritageStatus === 'AMBER') {
    const modifier = input.hasArticle4 
      ? HERITAGE_MODIFIERS.AMBER.withArticle4 
      : HERITAGE_MODIFIERS.AMBER.withoutArticle4;
    probability *= modifier;
    
    riskFactors.push({
      factor: 'Conservation Area',
      impact: input.hasArticle4 ? 'high' : 'medium',
      description: input.hasArticle4 
        ? 'Article 4 Direction removes permitted development rights. Full planning permission required.'
        : 'Property is in a conservation area with additional planning restrictions.',
      mitigationPossible: true,
    });
    
    if (!input.hasHeritageStatement) {
      suggestions.push({
        action: 'Include a Heritage Statement',
        impactOnApproval: 12,
        cost: 'medium',
        description: 'A heritage statement explains how your design respects the conservation area character.',
      });
    }
  } else if (input.heritageStatus === 'RED' && input.listedGrade) {
    const modifier = HERITAGE_MODIFIERS.RED[input.listedGrade];
    probability *= modifier;
    
    riskFactors.push({
      factor: `Grade ${input.listedGrade} Listed Building`,
      impact: 'high',
      description: `Listed Building Consent required. Grade ${input.listedGrade} buildings have the highest level of protection.`,
      mitigationPossible: input.listedGrade === 'II',
    });
    
    if (!input.hasHeritageStatement) {
      suggestions.push({
        action: 'Commission Heritage Impact Assessment',
        impactOnApproval: 15,
        cost: 'high',
        description: 'Essential for listed building applications. Consider using a heritage consultant.',
      });
    }
  }
  
  // Apply borough modifier
  const boroughModifier = BOROUGH_MODIFIERS[input.borough] || BOROUGH_MODIFIERS['default'];
  if (boroughModifier && boroughModifier < 0.95) {
    probability *= boroughModifier;
    riskFactors.push({
      factor: 'Strict Local Planning Authority',
      impact: 'medium',
      description: `${input.borough} Council has stricter than average planning policies.`,
      mitigationPossible: true,
    });
  }
  
  // Apply quality boosters
  if (input.hasArchitect) {
    probability = Math.min(100, probability + QUALITY_BOOSTERS.hasArchitect);
  } else {
    suggestions.push({
      action: 'Engage a Registered Architect',
      impactOnApproval: 8,
      cost: 'high',
      description: 'Professional designs are more likely to be approved and can navigate complex requirements.',
    });
  }
  
  if (input.hasHeritageStatement && (input.heritageStatus === 'RED' || input.heritageStatus === 'AMBER')) {
    probability = Math.min(100, probability + QUALITY_BOOSTERS.hasHeritageStatement);
  }
  
  if (input.hasPreApplication) {
    probability = Math.min(100, probability + QUALITY_BOOSTERS.hasPreApplication);
  } else if (probability < 80) {
    suggestions.push({
      action: 'Request Pre-Application Advice',
      impactOnApproval: 15,
      cost: 'low',
      description: 'Get formal feedback from the planning officer before submitting. Costs £50-500 depending on council.',
    });
  }
  
  // Apply risk factors
  if (input.isVisibleFromHighway) {
    probability = Math.max(0, probability + RISK_IMPACTS.visibleFromHighway);
    riskFactors.push({
      factor: 'Visible from Public Highway',
      impact: 'medium',
      description: 'Works visible from the street are subject to greater scrutiny.',
      mitigationPossible: true,
    });
    
    suggestions.push({
      action: 'Consider Alternative Location',
      impactOnApproval: 8,
      cost: 'free',
      description: 'If possible, position the development where it is less visible from public areas.',
    });
  }
  
  if (input.affectsNeighbors) {
    probability = Math.max(0, probability + RISK_IMPACTS.affectsNeighbors);
    riskFactors.push({
      factor: 'Potential Impact on Neighbors',
      impact: 'medium',
      description: 'Neighboring properties may be affected by loss of light, privacy, or outlook.',
      mitigationPossible: true,
    });
    
    suggestions.push({
      action: 'Consult with Neighbors Early',
      impactOnApproval: 5,
      cost: 'free',
      description: 'Speaking to neighbors before applying can prevent objections and demonstrate community engagement.',
    });
  }
  
  if (input.neighborObjectionsLikely) {
    probability = Math.max(0, probability + RISK_IMPACTS.neighborObjections);
    riskFactors.push({
      factor: 'Expected Neighbor Objections',
      impact: 'high',
      description: 'Neighbor objections will be considered, though they are not automatically decisive.',
      mitigationPossible: true,
    });
  }
  
  if (input.previousRefusals && input.previousRefusals > 0) {
    probability = Math.max(0, probability + (RISK_IMPACTS.previousRefusals * input.previousRefusals));
    riskFactors.push({
      factor: 'Previous Application Refused',
      impact: 'high',
      description: 'Resubmissions should address all reasons for refusal in the previous decision.',
      mitigationPossible: true,
    });
    
    suggestions.push({
      action: 'Address All Refusal Reasons',
      impactOnApproval: 15,
      cost: 'medium',
      description: 'Carefully review the previous refusal and ensure the new application addresses every concern.',
    });
  }
  
  // Ensure probability is within bounds
  probability = Math.max(5, Math.min(98, probability));
  
  // Determine confidence level
  let confidenceLevel: 'high' | 'medium' | 'low' = 'medium';
  if (riskFactors.length <= 1 && probability > 85) {
    confidenceLevel = 'high';
  } else if (riskFactors.length >= 3 || probability < 50) {
    confidenceLevel = 'low';
  }
  
  // Determine recommended approach
  let recommendedApproach: PredictionResult['recommendedApproach'] = 'householder-application';
  
  if (input.heritageStatus === 'RED') {
    recommendedApproach = 'listed-building-consent';
  } else if (input.heritageStatus === 'GREEN' && !input.hasArticle4 && probability > 90) {
    recommendedApproach = 'permitted-development';
  } else if (input.projectType.includes('extension') && input.heritageStatus === 'GREEN') {
    recommendedApproach = 'prior-approval';
  }
  
  // Estimate timeline
  const timelineEstimate: TimelineEstimate = {
    validationWeeks: 1,
    determinationWeeks: input.heritageStatus === 'RED' ? 12 : 8,
    totalWeeks: input.heritageStatus === 'RED' ? 13 : 9,
    committeeLikely: probability < 60 || input.neighborObjectionsLikely || input.heritageStatus === 'RED',
  };
  
  // Sort suggestions by impact
  suggestions.sort((a, b) => b.impactOnApproval - a.impactOnApproval);
  
  return {
    approvalProbability: Math.round(probability),
    confidenceLevel,
    riskFactors,
    improvementSuggestions: suggestions.slice(0, 5),
    similarApplications: [], // Would be populated from real database
    estimatedTimeline: timelineEstimate,
    recommendedApproach,
  };
}

// ===========================================
// SUMMARY TEXT GENERATORS
// ===========================================

export function getApprovalSummary(probability: number): string {
  if (probability >= 90) {
    return 'Very likely to be approved';
  } else if (probability >= 75) {
    return 'Good chance of approval';
  } else if (probability >= 60) {
    return 'Moderate chance of approval';
  } else if (probability >= 40) {
    return 'May face challenges';
  } else if (probability >= 20) {
    return 'Difficult but not impossible';
  } else {
    return 'Unlikely to be approved as proposed';
  }
}

export function getApprovalColor(probability: number): string {
  if (probability >= 75) {
    return 'text-green-600';
  } else if (probability >= 50) {
    return 'text-amber-600';
  } else {
    return 'text-red-600';
  }
}

export function getRecommendedApproachText(approach: PredictionResult['recommendedApproach']): string {
  switch (approach) {
    case 'permitted-development':
      return 'This should be permitted development - no application needed';
    case 'prior-approval':
      return 'Submit a Prior Approval application (simpler process, lower fees)';
    case 'householder-application':
      return 'Submit a Householder Planning Application';
    case 'full-application':
      return 'Submit a Full Planning Application';
    case 'listed-building-consent':
      return 'Apply for Listed Building Consent (plus planning permission if external)';
  }
}
