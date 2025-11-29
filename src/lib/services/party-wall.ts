/**
 * Party Wall Service
 * 
 * Comprehensive guidance for Party Wall Act compliance
 * including notice requirements, surveyor appointments, and procedures
 */

interface PartyWallAssessment {
  address: string;
  postcode: string;
  projectType: string;
  assessment: {
    partyWallRequired: boolean;
    noticeTypes: string[];
    affectedProperties: number;
    complexity: 'simple' | 'moderate' | 'complex';
    estimatedCost: { min: number; max: number };
    estimatedTimeline: string;
  };
  noticeRequirements: {
    type: string;
    section: string;
    description: string;
    noticePeriod: string;
    validityPeriod: string;
    template: string[];
  }[];
  process: {
    step: number;
    action: string;
    timing: string;
    responsibility: string;
    notes: string;
  }[];
  surveyorGuidance: {
    scenario: string;
    surveyorRequirement: string;
    costIndication: string;
    recommendation: string;
  };
  disputes: {
    situation: string;
    resolution: string;
    timeline: string;
  }[];
  scheduleOfCondition: {
    importance: string;
    contents: string[];
    timing: string;
    tips: string[];
  };
  commonIssues: {
    issue: string;
    prevention: string;
    resolution: string;
  }[];
  costBreakdown: {
    item: string;
    costRange: string;
    paidBy: string;
    notes: string;
  }[];
}

// Work types requiring party wall notices
const PARTY_WALL_WORKS: { [key: string]: {
  section: string;
  description: string;
  noticePeriod: string;
  examples: string[];
  notRequired: string[];
} } = {
  'section-1': {
    section: 'Section 1',
    description: 'Building new wall on line of junction',
    noticePeriod: '1 month',
    examples: [
      'Building new wall astride the boundary',
      'Building new wall up to but not on the boundary'
    ],
    notRequired: [
      'Fences (not walls)',
      'Walls entirely on own land not touching boundary'
    ]
  },
  'section-2': {
    section: 'Section 2',
    description: 'Work to existing party wall or party fence wall',
    noticePeriod: '2 months',
    examples: [
      'Cutting into party wall for beam bearing',
      'Inserting DPC into party wall',
      'Raising party wall height',
      'Demolishing and rebuilding party wall',
      'Underpinning party wall',
      'Cutting off chimney breast from party wall',
      'Exposing party wall by demolition'
    ],
    notRequired: [
      'Minor repairs not affecting structure',
      'Decorating your side only',
      'Attaching picture hooks (minor fixings)'
    ]
  },
  'section-6': {
    section: 'Section 6',
    description: 'Excavation near neighboring buildings',
    noticePeriod: '1 month',
    examples: [
      'Excavation within 3m of neighbor foundation (deeper than their foundation)',
      'Excavation within 6m where 45° line from bottom of neighbors foundation intersects',
      'Basement excavation',
      'Deep extension foundations'
    ],
    notRequired: [
      'Shallow excavation above neighboring foundation level',
      'Excavation more than 6m away (if not cutting 45° plane)'
    ]
  }
};

// Surveyor appointment scenarios
const SURVEYOR_SCENARIOS: { [key: string]: {
  scenario: string;
  surveyors: string;
  cost: string;
  timeframe: string;
  recommendation: string;
} } = {
  'agreed': {
    scenario: 'Adjoining owner agrees to works',
    surveyors: 'No surveyors required - written consent sufficient',
    cost: '£0 for surveyors (may want schedule of condition £200-400)',
    timeframe: 'Can proceed after notice period',
    recommendation: 'Get consent in writing, consider voluntary schedule of condition'
  },
  'no-response': {
    scenario: 'Adjoining owner does not respond',
    surveyors: 'Deemed dissent - surveyors required',
    cost: 'Each party appoints own surveyor - £800-2,000+ each',
    timeframe: '4-8 weeks for award',
    recommendation: 'Try to make contact, offer agreed surveyor to save costs'
  },
  'agreed-surveyor': {
    scenario: 'Both parties agree to single surveyor',
    surveyors: 'One agreed surveyor acts for both parties',
    cost: '£800-1,500 (shared or building owner pays)',
    timeframe: '2-4 weeks for award',
    recommendation: 'Cost-effective if relations are good'
  },
  'separate-surveyors': {
    scenario: 'Each party appoints own surveyor',
    surveyors: 'Two surveyors prepare award together',
    cost: '£1,500-4,000+ total (building owner pays both)',
    timeframe: '4-8 weeks for award',
    recommendation: 'Building owner pays both surveyors\' fees'
  },
  'third-surveyor': {
    scenario: 'Surveyors cannot agree',
    surveyors: 'Third surveyor appointed to resolve',
    cost: 'Additional £500-2,000 for third surveyor',
    timeframe: 'Additional 2-4 weeks',
    recommendation: 'Rare but adds cost and delay'
  }
};

/**
 * Assess party wall requirements
 */
async function assessPartyWallRequirements(
  address: string,
  postcode: string,
  projectType: string,
  projectDetails?: {
    workDescription?: string;
    excavationDepth?: number;
    distanceFromBoundary?: number;
    sharedWalls?: number;
    adjacentProperties?: number;
    existingRelationship?: 'good' | 'neutral' | 'difficult';
  }
): Promise<PartyWallAssessment> {
  const outcode = postcode.split(' ')[0] || 'NW3';
  
  // Determine what notices are required
  const noticeRequirements = determineNoticeRequirements(projectType, projectDetails);
  
  // Assess overall requirements
  const assessment = generateAssessment(noticeRequirements, projectDetails);
  
  // Generate process steps
  const process = generateProcess(assessment);
  
  // Surveyor guidance
  const surveyorGuidance = determineSurveyorGuidance(projectDetails);
  
  // Dispute resolution
  const disputes = generateDisputeGuidance();
  
  // Schedule of condition guidance
  const scheduleOfCondition = generateScheduleGuidance();
  
  // Common issues
  const commonIssues = generateCommonIssues();
  
  // Cost breakdown
  const costBreakdown = generateCostBreakdown(assessment, surveyorGuidance);
  
  return {
    address,
    postcode,
    projectType,
    assessment,
    noticeRequirements,
    process,
    surveyorGuidance,
    disputes,
    scheduleOfCondition,
    commonIssues,
    costBreakdown
  };
}

/**
 * Determine required notices
 */
function determineNoticeRequirements(
  projectType: string,
  details?: {
    workDescription?: string;
    excavationDepth?: number;
    distanceFromBoundary?: number;
    sharedWalls?: number;
  }
): {
  type: string;
  section: string;
  description: string;
  noticePeriod: string;
  validityPeriod: string;
  template: string[];
}[] {
  const requirements: {
    type: string;
    section: string;
    description: string;
    noticePeriod: string;
    validityPeriod: string;
    template: string[];
  }[] = [];
  
  const normalizedType = projectType.toLowerCase();
  
  // Check for Section 2 works (party wall works)
  const section2Triggers = ['extension', 'loft', 'conversion', 'chimney', 'dpc', 'beam'];
  if (section2Triggers.some(t => normalizedType.includes(t)) || (details?.sharedWalls && details.sharedWalls > 0)) {
    requirements.push({
      type: 'Party Structure Notice',
      section: 'Section 2',
      description: 'Work to existing party wall or party structure',
      noticePeriod: '2 months minimum',
      validityPeriod: '12 months from date of notice',
      template: [
        'Building owner name and address',
        'Nature and particulars of proposed work',
        'Date work intended to begin (minimum 2 months)',
        'Statement of rights under the Act',
        'Reference to sections of the Act relied upon'
      ]
    });
  }
  
  // Check for Section 6 works (excavation)
  const section6Triggers = ['basement', 'excavation', 'foundation', 'underpinning', 'extension'];
  if (section6Triggers.some(t => normalizedType.includes(t))) {
    const withinRange = !details?.distanceFromBoundary || details.distanceFromBoundary <= 6;
    if (withinRange) {
      requirements.push({
        type: 'Notice of Adjacent Excavation',
        section: 'Section 6',
        description: 'Excavation near neighboring building foundations',
        noticePeriod: '1 month minimum',
        validityPeriod: '12 months from date of notice',
        template: [
          'Building owner name and address',
          'Nature and depth of excavation',
          'Distance from adjoining building/structure',
          'Plans showing excavation extent',
          'Date work intended to begin (minimum 1 month)',
          'Details of how neighbor\'s property will be protected'
        ]
      });
    }
  }
  
  // Check for Section 1 works (new boundary wall)
  if (normalizedType.includes('wall') || normalizedType.includes('boundary')) {
    requirements.push({
      type: 'Line of Junction Notice',
      section: 'Section 1',
      description: 'Building new wall on or at line of junction',
      noticePeriod: '1 month minimum',
      validityPeriod: '12 months from date of notice',
      template: [
        'Building owner name and address',
        'Description of proposed wall',
        'Position of wall relative to boundary',
        'Date work intended to begin (minimum 1 month)'
      ]
    });
  }
  
  return requirements;
}

/**
 * Generate overall assessment
 */
function generateAssessment(
  notices: { section: string }[],
  details?: {
    adjacentProperties?: number;
    existingRelationship?: 'good' | 'neutral' | 'difficult';
  }
): {
  partyWallRequired: boolean;
  noticeTypes: string[];
  affectedProperties: number;
  complexity: 'simple' | 'moderate' | 'complex';
  estimatedCost: { min: number; max: number };
  estimatedTimeline: string;
} {
  const partyWallRequired = notices.length > 0;
  const noticeTypes = notices.map(n => n.section);
  const affectedProperties = details?.adjacentProperties || 1;
  
  // Determine complexity
  let complexity: 'simple' | 'moderate' | 'complex' = 'simple';
  if (notices.length > 1 || affectedProperties > 2) {
    complexity = 'moderate';
  }
  if (noticeTypes.includes('Section 6') || affectedProperties > 3 || details?.existingRelationship === 'difficult') {
    complexity = 'complex';
  }
  
  // Estimate costs
  let costMin = 0;
  let costMax = 0;
  
  if (partyWallRequired) {
    if (complexity === 'simple') {
      costMin = 500;
      costMax = 1500;
    } else if (complexity === 'moderate') {
      costMin = 1500;
      costMax = 4000;
    } else {
      costMin = 3000;
      costMax = 10000;
    }
    
    // Multiply by number of affected properties
    costMin *= Math.ceil(affectedProperties / 2);
    costMax *= Math.ceil(affectedProperties / 2);
  }
  
  // Estimate timeline
  let timeline = 'Not required';
  if (partyWallRequired) {
    if (complexity === 'simple') {
      timeline = '4-6 weeks if neighbors consent';
    } else if (complexity === 'moderate') {
      timeline = '6-10 weeks typical';
    } else {
      timeline = '8-16 weeks (potentially longer if disputes)';
    }
  }
  
  return {
    partyWallRequired,
    noticeTypes,
    affectedProperties,
    complexity,
    estimatedCost: { min: costMin, max: costMax },
    estimatedTimeline: timeline
  };
}

/**
 * Generate process steps
 */
function generateProcess(
  assessment: {
    partyWallRequired: boolean;
    noticeTypes: string[];
    complexity: string;
  }
): { step: number; action: string; timing: string; responsibility: string; notes: string }[] {
  if (!assessment.partyWallRequired) {
    return [{
      step: 1,
      action: 'No Party Wall Act notices required',
      timing: 'N/A',
      responsibility: 'Building Owner',
      notes: 'Works do not trigger Party Wall Act requirements'
    }];
  }
  
  return [
    {
      step: 1,
      action: 'Identify all adjoining owners',
      timing: 'Before serving notices',
      responsibility: 'Building Owner',
      notes: 'Check Land Registry for all affected properties'
    },
    {
      step: 2,
      action: 'Prepare Party Wall notices',
      timing: '1-2 days',
      responsibility: 'Building Owner (or surveyor)',
      notes: 'Use correct form for each notice type required'
    },
    {
      step: 3,
      action: 'Serve notices on all adjoining owners',
      timing: 'Minimum 1-2 months before works (depends on section)',
      responsibility: 'Building Owner',
      notes: 'Keep proof of service - recorded delivery recommended'
    },
    {
      step: 4,
      action: 'Await responses from adjoining owners',
      timing: '14 days from service',
      responsibility: 'Adjoining Owners',
      notes: 'No response = deemed dissent after 14 days'
    },
    {
      step: 5,
      action: 'If consent given: proceed after notice period',
      timing: 'After notice period expires',
      responsibility: 'Building Owner',
      notes: 'Get written consent, consider voluntary schedule of condition'
    },
    {
      step: 6,
      action: 'If dissent (or no response): appoint surveyors',
      timing: 'Within 10 days of dissent',
      responsibility: 'Both parties',
      notes: 'Agree single surveyor or appoint separate surveyors'
    },
    {
      step: 7,
      action: 'Surveyors prepare Party Wall Award',
      timing: '2-6 weeks',
      responsibility: 'Party Wall Surveyors',
      notes: 'Award sets out works, protections, access rights'
    },
    {
      step: 8,
      action: 'Prepare Schedule of Condition',
      timing: 'Before works commence',
      responsibility: 'Surveyors',
      notes: 'Records condition of neighboring property'
    },
    {
      step: 9,
      action: 'Award served on both parties',
      timing: '14 days appeal period',
      responsibility: 'Surveyors',
      notes: 'Either party can appeal to County Court within 14 days'
    },
    {
      step: 10,
      action: 'Commence works',
      timing: 'After appeal period (if no appeal)',
      responsibility: 'Building Owner',
      notes: 'Must comply with Award terms throughout'
    }
  ];
}

/**
 * Determine surveyor guidance
 */
function determineSurveyorGuidance(
  details?: {
    existingRelationship?: 'good' | 'neutral' | 'difficult';
    adjacentProperties?: number;
  }
): {
  scenario: string;
  surveyorRequirement: string;
  costIndication: string;
  recommendation: string;
} {
  const relationship = details?.existingRelationship || 'neutral';
  
  if (relationship === 'good') {
    const scenario = SURVEYOR_SCENARIOS['agreed-surveyor'];
    return {
      scenario: scenario?.scenario || 'Agreed surveyor recommended',
      surveyorRequirement: scenario?.surveyors || 'Single agreed surveyor',
      costIndication: scenario?.cost || '£800-1,500',
      recommendation: 'Suggest agreed surveyor to neighbors to save costs and time'
    };
  } else if (relationship === 'difficult') {
    const scenario = SURVEYOR_SCENARIOS['separate-surveyors'];
    return {
      scenario: scenario?.scenario || 'Separate surveyors likely',
      surveyorRequirement: scenario?.surveyors || 'Two surveyors needed',
      costIndication: scenario?.cost || '£1,500-4,000+',
      recommendation: 'Budget for separate surveyors - building owner pays both fees'
    };
  } else {
    return {
      scenario: 'Response unknown - prepare for dissent',
      surveyorRequirement: 'Await neighbor response before appointing',
      costIndication: '£800-3,000+ depending on response',
      recommendation: 'Engage early with neighbors, explain works, offer agreed surveyor option'
    };
  }
}

/**
 * Generate dispute guidance
 */
function generateDisputeGuidance(): {
  situation: string;
  resolution: string;
  timeline: string;
}[] {
  return [
    {
      situation: 'Adjoining owner refuses access',
      resolution: 'Award can grant access rights - surveyors enforce',
      timeline: 'Immediate via Award terms'
    },
    {
      situation: 'Dispute over damage caused',
      resolution: 'Surveyors determine if damage related to works via Schedule comparison',
      timeline: '2-4 weeks for surveyor determination'
    },
    {
      situation: 'Disagreement on scope of works',
      resolution: 'Third surveyor appointed if two surveyors cannot agree',
      timeline: 'Additional 2-4 weeks'
    },
    {
      situation: 'Appeal against Award',
      resolution: 'County Court appeal within 14 days of Award',
      timeline: '2-6 months for court hearing'
    },
    {
      situation: 'Building owner proceeds without Award',
      resolution: 'Adjoining owner can seek injunction, damages',
      timeline: 'Immediate injunction application possible'
    },
    {
      situation: 'Surveyors fees disputed',
      resolution: 'Third surveyor determines reasonable fees',
      timeline: '2-4 weeks for determination'
    }
  ];
}

/**
 * Generate Schedule of Condition guidance
 */
function generateScheduleGuidance(): {
  importance: string;
  contents: string[];
  timing: string;
  tips: string[];
} {
  return {
    importance: 'Essential protection for both parties - proves pre-existing condition',
    contents: [
      'Dated photographs of all relevant areas',
      'Written description of existing cracks, damage, condition',
      'Measurements of significant features',
      'Floor levels and wall positions',
      'Condition of foundations if visible',
      'External areas that may be affected'
    ],
    timing: 'Before any works commence - ideally when Award is served',
    tips: [
      'Include areas that could conceivably be affected',
      'High-resolution photographs with ruler for scale',
      'Video walkthrough can supplement photos',
      'Both parties should retain copies',
      'Update if significant time passes before works start'
    ]
  };
}

/**
 * Generate common issues
 */
function generateCommonIssues(): {
  issue: string;
  prevention: string;
  resolution: string;
}[] {
  return [
    {
      issue: 'Notice served too late',
      prevention: 'Serve notices as early as possible in project planning',
      resolution: 'Cannot shorten notice period - adjust programme or delay start'
    },
    {
      issue: 'Neighbor unreachable',
      prevention: 'Land Registry search for current owner, try multiple contact methods',
      resolution: 'Deemed dissent applies, appoint surveyors as if dissent given'
    },
    {
      issue: 'Neighbor refuses to appoint surveyor',
      prevention: 'Clear communication about the process and their rights',
      resolution: 'After 10 days, building owner can appoint on their behalf'
    },
    {
      issue: 'Damage occurs during works',
      prevention: 'Good workmanship, monitoring, adequate protection',
      resolution: 'Compare with Schedule, surveyors determine liability and remediation'
    },
    {
      issue: 'Works exceed those in Award',
      prevention: 'Ensure Award accurately describes all planned works',
      resolution: 'New notice and potentially new Award required for additional works'
    },
    {
      issue: 'Costs dispute',
      prevention: 'Clear Award terms, fee agreements in writing',
      resolution: 'Third surveyor determination, or County Court'
    }
  ];
}

/**
 * Generate cost breakdown
 */
function generateCostBreakdown(
  assessment: {
    complexity: 'simple' | 'moderate' | 'complex';
    affectedProperties: number;
  },
  surveyorGuidance: {
    costIndication: string;
  }
): {
  item: string;
  costRange: string;
  paidBy: string;
  notes: string;
}[] {
  return [
    {
      item: 'Surveyor fees (agreed surveyor)',
      costRange: '£800-1,500',
      paidBy: 'Usually building owner',
      notes: 'Single surveyor acting for both parties'
    },
    {
      item: 'Surveyor fees (two surveyors)',
      costRange: '£1,500-4,000+',
      paidBy: 'Building owner pays both',
      notes: 'Building owner pays adjoining owner\'s surveyor too'
    },
    {
      item: 'Schedule of Condition',
      costRange: '£200-600 per property',
      paidBy: 'Building owner',
      notes: 'Essential - do not skip this'
    },
    {
      item: 'Third surveyor (if needed)',
      costRange: '£500-2,000',
      paidBy: 'As determined by third surveyor',
      notes: 'Only if first two surveyors cannot agree'
    },
    {
      item: 'Legal fees (if appealed)',
      costRange: '£2,000-10,000+',
      paidBy: 'Each party pays own (costs order possible)',
      notes: 'Appeals to County Court are expensive'
    },
    {
      item: 'Making good damage',
      costRange: 'Variable',
      paidBy: 'Building owner (if damage from works)',
      notes: 'As determined by surveyors'
    }
  ];
}

export default {
  assessPartyWallRequirements
};
