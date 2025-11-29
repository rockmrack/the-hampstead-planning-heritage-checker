/**
 * Amendment Application Service
 * 
 * Guidance for making changes to approved planning permissions
 * including non-material amendments, minor material amendments (S73),
 * and variations to conditions
 */

interface AmendmentAssessment {
  address: string;
  postcode: string;
  originalPermission: string;
  proposedChanges: string[];
  assessment: {
    category: 'non-material' | 'minor-material' | 'new-application';
    confidence: 'high' | 'medium' | 'low';
    reasoning: string[];
    precedents: string[];
  };
  applicationRoute: {
    type: string;
    description: string;
    fee: number;
    determinationPeriod: string;
    publicityRequired: boolean;
    successLikelihood: string;
  };
  requirements: {
    forms: string[];
    documents: string[];
    drawings: string[];
    statements: string[];
  };
  process: {
    step: number;
    action: string;
    timing: string;
    notes: string;
  }[];
  risks: {
    risk: string;
    mitigation: string;
    consequence: string;
  }[];
  alternatives: {
    option: string;
    description: string;
    pros: string[];
    cons: string[];
  }[];
  timeline: {
    submission: string;
    validation: string;
    consultation: string;
    determination: string;
    totalTypical: string;
  };
}

// Amendment categories and thresholds
const AMENDMENT_THRESHOLDS = {
  'non-material': {
    description: 'Minor changes that do not materially affect the approved development',
    examples: [
      'Minor internal layout changes',
      'Small changes to fenestration positions (< 300mm)',
      'Substitution of similar materials',
      'Minor dimensional corrections',
      'Small changes to external furniture/details'
    ],
    exclusions: [
      'Changes affecting neighbours',
      'Increases in height or footprint',
      'Changes to heritage-sensitive elements',
      'Alterations affecting conditions',
      'Changes to use'
    ],
    fee: 43,
    timeline: '28 days target'
  },
  'minor-material': {
    description: 'Changes that materially affect but remain broadly consistent with approved scheme',
    examples: [
      'Window position changes affecting overlooking',
      'Modest changes to roof form',
      'Material changes in heritage areas',
      'Changes to approved landscaping',
      'Variation of conditions',
      'Changes to parking arrangements'
    ],
    exclusions: [
      'Fundamental changes to development',
      'Significant increases in scale',
      'Change of use',
      'Impact on planning balance'
    ],
    fee: 293,
    timeline: '8 weeks'
  },
  'new-application': {
    description: 'Substantial changes requiring fresh planning assessment',
    examples: [
      'Significant increases in height/footprint',
      'Addition of new elements (e.g., basement where none approved)',
      'Change of use',
      'Fundamental design changes',
      'Changes creating new planning issues'
    ],
    exclusions: [],
    fee: 'Varies by application type',
    timeline: '8-13 weeks'
  }
};

// Change type categorization
const CHANGE_CATEGORIES: { [key: string]: {
  typical: 'non-material' | 'minor-material' | 'new-application';
  factors: string[];
  heritage_impact: boolean;
} } = {
  'internal-layout': {
    typical: 'non-material',
    factors: ['No external changes', 'No impact on use', 'No change to unit count'],
    heritage_impact: false
  },
  'window-position': {
    typical: 'minor-material',
    factors: ['Potential overlooking', 'Design impact', 'Neighbor amenity'],
    heritage_impact: true
  },
  'window-size': {
    typical: 'minor-material',
    factors: ['Appearance change', 'Potential light/outlook impact', 'Design coherence'],
    heritage_impact: true
  },
  'door-position': {
    typical: 'non-material',
    factors: ['Minor external change', 'Security considerations', 'Access changes'],
    heritage_impact: true
  },
  'roof-form': {
    typical: 'minor-material',
    factors: ['Height changes', 'Visual impact', 'Design significance'],
    heritage_impact: true
  },
  'materials': {
    typical: 'non-material',
    factors: ['Quality equivalent', 'Visual match', 'Conservation sensitivity'],
    heritage_impact: true
  },
  'height-increase': {
    typical: 'new-application',
    factors: ['Overdominance', 'Daylight/sunlight', 'Design impact'],
    heritage_impact: true
  },
  'footprint-increase': {
    typical: 'new-application',
    factors: ['Garden land loss', 'Neighbor impact', 'Policy compliance'],
    heritage_impact: false
  },
  'basement-addition': {
    typical: 'new-application',
    factors: ['Substantial change', 'Structural implications', 'Policy compliance'],
    heritage_impact: false
  },
  'condition-variation': {
    typical: 'minor-material',
    factors: ['Nature of condition', 'Reason for variation', 'Impact assessment'],
    heritage_impact: false
  },
  'landscaping-change': {
    typical: 'non-material',
    factors: ['Quality equivalent', 'Screening maintained', 'Biodiversity'],
    heritage_impact: false
  },
  'parking-change': {
    typical: 'minor-material',
    factors: ['Highway safety', 'Parking stress', 'Policy compliance'],
    heritage_impact: false
  }
};

/**
 * Assess proposed amendment
 */
async function assessAmendment(
  address: string,
  postcode: string,
  originalPermission: string,
  proposedChanges: {
    type: string;
    description: string;
    magnitude?: 'minor' | 'moderate' | 'major';
  }[],
  context?: {
    conservationArea?: boolean;
    listedBuilding?: boolean;
    neighborConcerns?: boolean;
    conditionsAffected?: boolean;
    timeSinceApproval?: number; // months
  }
): Promise<AmendmentAssessment> {
  const parts = postcode.split(' ');
  const outcode = (parts[0] || 'NW3').toUpperCase();
  
  // Assess each change
  const changeAssessments = proposedChanges.map(change => assessChange(change, context));
  
  // Determine overall category (most restrictive applies)
  const overallCategory = determineOverallCategory(changeAssessments);
  
  // Generate application route guidance
  const applicationRoute = generateApplicationRoute(overallCategory, proposedChanges.length);
  
  // Generate requirements
  const requirements = generateRequirements(overallCategory, proposedChanges, context);
  
  // Generate process steps
  const process = generateProcess(overallCategory);
  
  // Identify risks
  const risks = generateRisks(overallCategory, proposedChanges, context);
  
  // Suggest alternatives
  const alternatives = generateAlternatives(overallCategory, proposedChanges);
  
  // Calculate timeline
  const timeline = generateTimeline(overallCategory);
  
  return {
    address,
    postcode,
    originalPermission,
    proposedChanges: proposedChanges.map(c => c.description),
    assessment: {
      category: overallCategory,
      confidence: calculateConfidence(changeAssessments, context),
      reasoning: generateReasoning(changeAssessments, context),
      precedents: generatePrecedents(overallCategory, proposedChanges)
    },
    applicationRoute,
    requirements,
    process,
    risks,
    alternatives,
    timeline
  };
}

/**
 * Assess individual change
 */
function assessChange(
  change: {
    type: string;
    description: string;
    magnitude?: 'minor' | 'moderate' | 'major';
  },
  context?: {
    conservationArea?: boolean;
    listedBuilding?: boolean;
    neighborConcerns?: boolean;
    conditionsAffected?: boolean;
    timeSinceApproval?: number;
  }
): {
  type: string;
  category: 'non-material' | 'minor-material' | 'new-application';
  factors: string[];
} {
  const changeInfo = CHANGE_CATEGORIES[change.type];
  const safeChangeInfo = changeInfo || { typical: 'minor-material' as const, factors: ['Requires assessment'], heritage_impact: false };
  
  let category = safeChangeInfo.typical;
  const factors = [...safeChangeInfo.factors];
  
  // Upgrade category based on context
  if (context?.conservationArea && safeChangeInfo.heritage_impact) {
    if (category === 'non-material') {
      category = 'minor-material';
      factors.push('Conservation area - stricter scrutiny applies');
    }
  }
  
  if (context?.listedBuilding) {
    if (category === 'non-material') {
      category = 'minor-material';
      factors.push('Listed building - requires careful assessment');
    }
  }
  
  if (context?.neighborConcerns) {
    if (category === 'non-material') {
      category = 'minor-material';
      factors.push('Known neighbor concerns - consultation advisable');
    }
  }
  
  if (change.magnitude === 'major') {
    if (category === 'non-material') {
      category = 'minor-material';
    } else if (category === 'minor-material') {
      category = 'new-application';
    }
    factors.push('Magnitude exceeds typical threshold');
  }
  
  return { type: change.type, category, factors };
}

/**
 * Determine overall category from individual assessments
 */
function determineOverallCategory(
  assessments: { category: 'non-material' | 'minor-material' | 'new-application' }[]
): 'non-material' | 'minor-material' | 'new-application' {
  if (assessments.some(a => a.category === 'new-application')) {
    return 'new-application';
  }
  if (assessments.some(a => a.category === 'minor-material')) {
    return 'minor-material';
  }
  return 'non-material';
}

/**
 * Generate application route guidance
 */
function generateApplicationRoute(
  category: 'non-material' | 'minor-material' | 'new-application',
  changeCount: number
): {
  type: string;
  description: string;
  fee: number;
  determinationPeriod: string;
  publicityRequired: boolean;
  successLikelihood: string;
} {
  const thresholds = AMENDMENT_THRESHOLDS[category];
  const safeThresholds = thresholds || AMENDMENT_THRESHOLDS['minor-material'];
  
  type RouteInfo = {
    type: string;
    description: string;
    fee: number;
    determinationPeriod: string;
    publicityRequired: boolean;
    successLikelihood: string;
  };
  
  const defaultRoute: RouteInfo = {
    type: 'Minor Material Amendment (Section 73)',
    description: safeThresholds.description,
    fee: 293,
    determinationPeriod: '8 weeks',
    publicityRequired: true,
    successLikelihood: 'Moderate - subject to assessment'
  };
  
  const routes: { [key: string]: RouteInfo } = {
    'non-material': {
      type: 'Non-Material Amendment (S96A)',
      description: safeThresholds.description,
      fee: 43,
      determinationPeriod: '28 days',
      publicityRequired: false,
      successLikelihood: 'High for qualifying changes'
    },
    'minor-material': defaultRoute,
    'new-application': {
      type: 'New Planning Application',
      description: safeThresholds.description,
      fee: 578,
      determinationPeriod: '8-13 weeks',
      publicityRequired: true,
      successLikelihood: 'Variable - full assessment required'
    }
  };
  
  return routes[category] || defaultRoute;
}

/**
 * Generate requirements for application
 */
function generateRequirements(
  category: 'non-material' | 'minor-material' | 'new-application',
  changes: { type: string; description: string }[],
  context?: {
    conservationArea?: boolean;
    listedBuilding?: boolean;
  }
): {
  forms: string[];
  documents: string[];
  drawings: string[];
  statements: string[];
} {
  const baseReqs = {
    'non-material': {
      forms: ['Application form for non-material amendment'],
      documents: [
        'Copy of original decision notice',
        'Description of proposed changes',
        'Justification statement'
      ],
      drawings: [
        'Marked-up approved drawings showing changes',
        'Revised drawings if necessary'
      ],
      statements: [
        'Brief statement explaining why changes are non-material'
      ]
    },
    'minor-material': {
      forms: ['Section 73 application form', 'Ownership certificate'],
      documents: [
        'Copy of original decision notice',
        'Complete list of conditions (amended as proposed)',
        'CIL questions (if applicable)'
      ],
      drawings: [
        'Full set of revised drawings',
        'Comparison drawings (approved vs proposed)',
        'Location and block plan'
      ],
      statements: [
        'Supporting statement explaining changes',
        'Impact assessment if affecting neighbors'
      ]
    },
    'new-application': {
      forms: ['Full application form', 'Ownership certificate', 'Agricultural holding certificate'],
      documents: [
        'CIL questions',
        'Fee payment',
        'Full supporting documentation'
      ],
      drawings: [
        'Complete set of application drawings',
        'Location plan at 1:1250',
        'Block plan at 1:500',
        'All floor plans, elevations, sections'
      ],
      statements: [
        'Design and Access Statement',
        'Planning statement',
        'Any specialist reports required'
      ]
    }
  };
  
  const reqs = baseReqs[category] || baseReqs['minor-material'];
  const safeReqs = { ...reqs };
  
  // Add heritage requirements
  if (context?.conservationArea) {
    safeReqs.statements.push('Heritage impact statement');
  }
  if (context?.listedBuilding) {
    safeReqs.documents.push('Listed Building Consent application (separate)');
  }
  
  return safeReqs;
}

/**
 * Generate process steps
 */
function generateProcess(
  category: 'non-material' | 'minor-material' | 'new-application'
): { step: number; action: string; timing: string; notes: string }[] {
  type ProcessStep = { step: number; action: string; timing: string; notes: string };
  
  const defaultProcess: ProcessStep[] = [
    { step: 1, action: 'Prepare full drawing set', timing: '1-2 weeks', notes: 'Complete revised drawings required' },
    { step: 2, action: 'Prepare supporting statement', timing: '2-3 days', notes: 'Explain changes and impacts' },
    { step: 3, action: 'Draft revised conditions', timing: '1 day', notes: 'List all conditions with any variations' },
    { step: 4, action: 'Submit Section 73 application', timing: '1 day', notes: 'Via Planning Portal' },
    { step: 5, action: 'Pay fee', timing: 'With submission', notes: '£293 (2024)' },
    { step: 6, action: 'Validation', timing: '5-10 days', notes: 'May request additional documents' },
    { step: 7, action: 'Publicity period', timing: '21 days', notes: 'Site notice and/or neighbor letters' },
    { step: 8, action: 'Consultee responses', timing: '21 days', notes: 'Concurrent with publicity' },
    { step: 9, action: 'Officer assessment', timing: '2-3 weeks', notes: 'After consultation ends' },
    { step: 10, action: 'Decision', timing: '8 weeks total', notes: 'New permission if approved' }
  ];
  
  const processes: { [key: string]: ProcessStep[] } = {
    'non-material': [
      { step: 1, action: 'Prepare comparison documents', timing: '1-2 days', notes: 'Mark up approved drawings showing changes' },
      { step: 2, action: 'Write justification statement', timing: '1 day', notes: 'Explain why changes are non-material' },
      { step: 3, action: 'Submit via Planning Portal', timing: '1 day', notes: 'Application type: Non-material amendment' },
      { step: 4, action: 'Pay fee', timing: 'With submission', notes: '£43 (2024)' },
      { step: 5, action: 'Await validation', timing: '3-5 days', notes: 'May request additional info' },
      { step: 6, action: 'Officer assessment', timing: '2-3 weeks', notes: 'No publicity period' },
      { step: 7, action: 'Decision issued', timing: '28 days target', notes: 'Approval or refusal' }
    ],
    'minor-material': defaultProcess,
    'new-application': [
      { step: 1, action: 'Pre-application advice (recommended)', timing: '4-6 weeks', notes: 'For significant changes' },
      { step: 2, action: 'Prepare full application', timing: '2-4 weeks', notes: 'Complete documentation set' },
      { step: 3, action: 'Submit application', timing: '1 day', notes: 'Via Planning Portal' },
      { step: 4, action: 'Pay fee', timing: 'With submission', notes: 'Standard application fee' },
      { step: 5, action: 'Validation', timing: '5-10 days', notes: 'Full validation check' },
      { step: 6, action: 'Publicity and consultation', timing: '21 days', notes: 'Site notice, neighbor notification, press notice if required' },
      { step: 7, action: 'Officer assessment', timing: '3-5 weeks', notes: 'May request amendments' },
      { step: 8, action: 'Decision', timing: '8-13 weeks', notes: 'Delegated or committee' }
    ]
  };
  
  return processes[category] || defaultProcess;
}

/**
 * Generate risks
 */
function generateRisks(
  category: 'non-material' | 'minor-material' | 'new-application',
  changes: { type: string; description: string }[],
  context?: {
    conservationArea?: boolean;
    listedBuilding?: boolean;
    neighborConcerns?: boolean;
  }
): { risk: string; mitigation: string; consequence: string }[] {
  const risks: { risk: string; mitigation: string; consequence: string }[] = [];
  
  if (category === 'non-material') {
    risks.push({
      risk: 'LPA determines change is material, not non-material',
      mitigation: 'Include clear justification, keep changes minimal',
      consequence: 'Application refused, need S73 or new application'
    });
  }
  
  if (category === 'minor-material') {
    risks.push({
      risk: 'S73 refused - original permission still valid',
      mitigation: 'Pre-application advice, keep changes proportionate',
      consequence: 'Must implement approved scheme or submit new application'
    });
    risks.push({
      risk: 'New conditions imposed on S73 approval',
      mitigation: 'Review draft conditions, negotiate if onerous',
      consequence: 'May need to discharge new conditions'
    });
  }
  
  if (category === 'new-application') {
    risks.push({
      risk: 'New application refused - no fallback',
      mitigation: 'Pre-application advice essential, maintain dialogue',
      consequence: 'Appeal or redesign required'
    });
    risks.push({
      risk: 'Original permission expired during new application',
      mitigation: 'Implement original before expiry or extend',
      consequence: 'Loss of fallback position'
    });
  }
  
  if (context?.conservationArea) {
    risks.push({
      risk: 'Heritage concerns about changes',
      mitigation: 'Conservation officer consultation, sensitive design',
      consequence: 'Refusal or requirement to match original'
    });
  }
  
  if (context?.neighborConcerns) {
    risks.push({
      risk: 'Neighbor objections to changes',
      mitigation: 'Early engagement, address concerns in statement',
      consequence: 'Potential committee referral, delay, refusal'
    });
  }
  
  return risks;
}

/**
 * Generate alternatives
 */
function generateAlternatives(
  category: 'non-material' | 'minor-material' | 'new-application',
  changes: { type: string; description: string }[]
): { option: string; description: string; pros: string[]; cons: string[] }[] {
  const alternatives: { option: string; description: string; pros: string[]; cons: string[] }[] = [];
  
  if (category === 'minor-material' || category === 'new-application') {
    alternatives.push({
      option: 'Implement approved scheme then apply to vary',
      description: 'Build as approved, then seek amendment retrospectively',
      pros: ['No risk to original permission', 'Demonstrates commitment'],
      cons: ['Cost of building then changing', 'Not always practical']
    });
    
    alternatives.push({
      option: 'Reduce scope of changes',
      description: 'Scale back changes to qualify for simpler route',
      pros: ['Lower fee', 'Faster determination', 'Higher success chance'],
      cons: ['May not achieve desired outcome', 'Compromise required']
    });
  }
  
  if (category === 'new-application') {
    alternatives.push({
      option: 'Pre-application discussion first',
      description: 'Seek formal pre-app advice before committing',
      pros: ['Understand acceptability', 'Reduce abortive fees', 'Officer dialogue'],
      cons: ['Additional cost and time', 'Not binding']
    });
    
    alternatives.push({
      option: 'Implement original and apply later',
      description: 'Complete approved scheme, then seek new permission',
      pros: ['Preserves fallback', 'Can observe as-built issues'],
      cons: ['Additional application fee', 'Living with approved scheme first']
    });
  }
  
  return alternatives;
}

/**
 * Generate timeline
 */
function generateTimeline(
  category: 'non-material' | 'minor-material' | 'new-application'
): {
  submission: string;
  validation: string;
  consultation: string;
  determination: string;
  totalTypical: string;
} {
  type TimelineInfo = {
    submission: string;
    validation: string;
    consultation: string;
    determination: string;
    totalTypical: string;
  };
  
  const defaultTimeline: TimelineInfo = {
    submission: '1-2 weeks preparation',
    validation: '5-10 working days',
    consultation: '21 days',
    determination: '8 weeks from validation',
    totalTypical: '10-12 weeks total'
  };
  
  const timelines: { [key: string]: TimelineInfo } = {
    'non-material': {
      submission: '1-3 days preparation',
      validation: '3-5 working days',
      consultation: 'None required',
      determination: '28 days target',
      totalTypical: '3-4 weeks total'
    },
    'minor-material': defaultTimeline,
    'new-application': {
      submission: '2-4 weeks preparation (plus pre-app)',
      validation: '5-10 working days',
      consultation: '21-28 days',
      determination: '8-13 weeks from validation',
      totalTypical: '12-20 weeks total'
    }
  };
  
  return timelines[category] || defaultTimeline;
  return timelines[category] || defaultTimeline;
}

/**
 * Calculate confidence level
 */
function calculateConfidence(
  assessments: { category: 'non-material' | 'minor-material' | 'new-application' }[],
  context?: { conservationArea?: boolean; listedBuilding?: boolean }
): 'high' | 'medium' | 'low' {
  // Multiple factors reduce confidence
  let confidence: 'high' | 'medium' | 'low' = 'high';
  
  if (assessments.length > 3) confidence = 'medium';
  if (context?.conservationArea || context?.listedBuilding) {
    confidence = confidence === 'high' ? 'medium' : 'low';
  }
  if (assessments.some(a => a.category === 'new-application')) {
    confidence = 'medium';
  }
  
  return confidence;
}

/**
 * Generate reasoning
 */
function generateReasoning(
  assessments: { type: string; category: string; factors: string[] }[],
  context?: { conservationArea?: boolean; listedBuilding?: boolean }
): string[] {
  const reasoning: string[] = [];
  
  assessments.forEach(a => {
    reasoning.push(`${a.type}: Assessed as ${a.category} based on: ${a.factors.join(', ')}`);
  });
  
  if (context?.conservationArea) {
    reasoning.push('Conservation area designation increases scrutiny level');
  }
  if (context?.listedBuilding) {
    reasoning.push('Listed building status requires separate LBC if affecting character');
  }
  
  return reasoning;
}

/**
 * Generate precedents
 */
function generatePrecedents(
  category: 'non-material' | 'minor-material' | 'new-application',
  changes: { type: string; description: string }[]
): string[] {
  return [
    'Each case assessed on merits - precedents are indicative only',
    'Camden tends to take strict view on non-material threshold',
    'Heritage areas subject to enhanced scrutiny for all changes',
    'Pre-application advice strongly recommended for borderline cases',
    'Written confirmation of acceptability provides certainty'
  ];
}

export default {
  assessAmendment
};
