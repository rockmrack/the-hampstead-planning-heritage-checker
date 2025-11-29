/**
 * Planning Condition Discharge Service
 * 
 * Comprehensive guidance for discharging planning conditions
 * attached to approved applications in Hampstead area
 */

interface ConditionRequirement {
  conditionNumber: number;
  conditionType: string;
  title: string;
  fullText: string;
  triggerPoint: string;
  dischargeTiming: string;
  submissionRequirements: string[];
  typicalDocuments: string[];
  consultees: string[];
  fee: number;
  typicalTimescale: string;
  tips: string[];
}

interface DischargeGuide {
  address: string;
  postcode: string;
  applicationReference?: string;
  overview: {
    totalConditions: number;
    priorToCommencement: number;
    duringConstruction: number;
    priorToOccupation: number;
    ongoingCompliance: number;
    estimatedTotalFees: number;
  };
  conditions: ConditionRequirement[];
  strategy: {
    priority: string[];
    batching: string[];
    timeline: { phase: string; conditions: number[]; deadline: string; }[];
    criticalPath: string[];
  };
  submissionProcess: {
    steps: { step: number; action: string; timing: string; notes: string; }[];
    portalGuidance: string[];
    fees: { type: string; amount: number; notes: string; }[];
  };
  commonIssues: {
    issue: string;
    prevention: string;
    resolution: string;
  }[];
  contacts: {
    department: string;
    email: string;
    phone?: string;
    role: string;
  }[];
}

// Common condition types and their standard requirements
const CONDITION_TYPES: { [key: string]: {
  title: string;
  typical: string;
  triggerPoint: string;
  documents: string[];
  consultees: string[];
  timescale: string;
  tips: string[];
} } = {
  'materials': {
    title: 'External Materials',
    typical: 'Details and samples of external materials to be submitted and approved',
    triggerPoint: 'Prior to above-ground construction',
    documents: [
      'Materials schedule with manufacturer details',
      'Physical samples or sample boards',
      'Specification sheets',
      'Photographs of materials in-situ elsewhere'
    ],
    consultees: ['Design & Conservation Officer'],
    timescale: '6-8 weeks',
    tips: [
      'Submit physical samples early - postal delays occur',
      'Include RAL/NCS colour references where applicable',
      'For heritage areas, match existing or approved palette',
      'Provide context photos showing adjacent buildings'
    ]
  },
  'landscaping': {
    title: 'Landscaping Scheme',
    typical: 'Hard and soft landscaping scheme to be submitted and approved',
    triggerPoint: 'Prior to first occupation',
    documents: [
      'Planting plan with species and sizes',
      'Hard surfacing specification',
      'Boundary treatments details',
      'Maintenance schedule',
      'Tree planting details (pit design)'
    ],
    consultees: ['Landscape Officer', 'Tree Officer'],
    timescale: '6-8 weeks',
    tips: [
      'Use native species where possible',
      'Include replacement planting calculations for any removed trees',
      'Consider year-round interest for planting schemes',
      'Specify container sizes for new planting'
    ]
  },
  'tree-protection': {
    title: 'Tree Protection',
    typical: 'Arboricultural Method Statement and Tree Protection Plan',
    triggerPoint: 'Prior to commencement (including demolition)',
    documents: [
      'Tree Protection Plan (scale drawing)',
      'Arboricultural Method Statement',
      'Construction exclusion zone details',
      'Monitoring schedule'
    ],
    consultees: ['Tree Officer'],
    timescale: '4-6 weeks',
    tips: [
      'Ensure AMS is site-specific, not generic',
      'Include contractor briefing protocol',
      'Specify ground protection for root zones',
      'Plan for Tree Officer site inspection'
    ]
  },
  'construction-management': {
    title: 'Construction Management Plan',
    typical: 'Details of construction logistics and management',
    triggerPoint: 'Prior to commencement',
    documents: [
      'Construction traffic management plan',
      'Delivery and servicing plan',
      'Working hours schedule',
      'Dust and noise mitigation measures',
      'Site waste management plan',
      'Emergency contact details'
    ],
    consultees: ['Highways', 'Environmental Health'],
    timescale: '6-8 weeks',
    tips: [
      'Confirm delivery routes with Highways',
      'Include bank holiday working requests if needed',
      'Address parking for construction workers',
      'Consider neighbor notification protocol'
    ]
  },
  'boundary-treatment': {
    title: 'Boundary Treatment',
    typical: 'Details of all boundary treatments to be submitted',
    triggerPoint: 'Prior to above-ground construction',
    documents: [
      'Boundary treatment plan (scale drawing)',
      'Elevation drawings of walls/fences',
      'Specification of materials and finishes',
      'Gate details if applicable'
    ],
    consultees: ['Design Officer'],
    timescale: '4-6 weeks',
    tips: [
      'Maximum heights often controlled - check decision notice',
      'Heritage areas may require traditional treatments',
      'Consider maintenance access requirements',
      'Include foundations details for walls'
    ]
  },
  'energy-sustainability': {
    title: 'Energy and Sustainability',
    typical: 'Details of energy and sustainability measures',
    triggerPoint: 'Prior to commencement',
    documents: [
      'Energy strategy/statement',
      'SAP calculations',
      'Renewable energy details',
      'Water efficiency measures',
      'BREEAM pre-assessment (if applicable)'
    ],
    consultees: ['Sustainability Officer'],
    timescale: '4-6 weeks',
    tips: [
      'Link to Building Regulations Part L compliance',
      'Include as-built confirmation at completion stage',
      'PV panel design to be heritage-sensitive',
      'Consider heat pump noise implications'
    ]
  },
  'archaeology': {
    title: 'Archaeological Investigation',
    typical: 'Programme of archaeological work to be undertaken',
    triggerPoint: 'Prior to groundworks',
    documents: [
      'Written Scheme of Investigation (WSI)',
      'Archaeological contractor details',
      'Watching brief protocol',
      'Reporting and archiving proposals'
    ],
    consultees: ['Greater London Archaeology Advisory Service (GLAAS)'],
    timescale: '4-8 weeks',
    tips: [
      'Use GLAAS-registered contractor',
      'Allow time for unexpected finds',
      'Budget for watching brief presence on site',
      'Plan for potential programme delays'
    ]
  },
  'contamination': {
    title: 'Land Contamination',
    typical: 'Site investigation and remediation scheme',
    triggerPoint: 'Prior to commencement (phased)',
    documents: [
      'Phase 1 Desk Study',
      'Phase 2 Site Investigation',
      'Remediation Strategy (if required)',
      'Verification Report (post-works)'
    ],
    consultees: ['Environmental Health', 'Environment Agency'],
    timescale: '8-12 weeks (multiple phases)',
    tips: [
      'Previous industrial uses trigger detailed investigation',
      'Garden land rarely problematic for residential',
      'Allow cost contingency for remediation',
      'Verification report needed for sign-off'
    ]
  },
  'drainage': {
    title: 'Surface Water Drainage',
    typical: 'Sustainable drainage scheme details',
    triggerPoint: 'Prior to commencement',
    documents: [
      'Drainage strategy',
      'SuDS calculations',
      'Maintenance plan',
      'Connection details to existing system',
      'Attenuation design (if required)'
    ],
    consultees: ['Lead Local Flood Authority', 'Thames Water'],
    timescale: '6-8 weeks',
    tips: [
      'Demonstrate betterment over existing',
      'Thames Water approval may be separate process',
      'Include overland flow routes for exceedance',
      'Soakaway testing required for infiltration'
    ]
  },
  'cycle-storage': {
    title: 'Cycle Storage',
    typical: 'Details of cycle parking and storage facilities',
    triggerPoint: 'Prior to occupation',
    documents: [
      'Layout plan showing cycle storage',
      'Elevation/section of storage facility',
      'Access arrangements',
      'Security measures',
      'Specification of stands/racks'
    ],
    consultees: ['Transport Planning'],
    timescale: '4 weeks',
    tips: [
      'London Plan standards apply',
      'Sheffield stands preferred design',
      'Consider electric bike charging',
      'Covered storage usually required'
    ]
  },
  'refuse-storage': {
    title: 'Refuse and Recycling Storage',
    typical: 'Details of refuse and recycling facilities',
    triggerPoint: 'Prior to occupation',
    documents: [
      'Layout plan showing bin storage',
      'Elevation of enclosure',
      'Drag distances to collection point',
      'Materials and finish details'
    ],
    consultees: ['Waste and Recycling'],
    timescale: '4 weeks',
    tips: [
      'Check current Camden bin requirements',
      'Maximum drag distance usually 10m',
      'Enclosure design to complement building',
      'Food waste bins now standard requirement'
    ]
  },
  'obscure-glazing': {
    title: 'Obscure Glazing',
    typical: 'Windows to be obscure glazed and fixed shut (or top-opening)',
    triggerPoint: 'Prior to occupation and retained permanently',
    documents: [
      'Window schedule showing affected windows',
      'Glass specification (Pilkington level or equivalent)',
      'Opening mechanism details',
      'Location plan'
    ],
    consultees: [],
    timescale: '2-4 weeks',
    tips: [
      'Level 3-5 obscurity typically required',
      'Must be non-openable below 1.7m cill height',
      'Permanent condition - noted on land charges',
      'Consider alternatives if this impacts amenity'
    ]
  },
  'permitted-development': {
    title: 'Removal of Permitted Development Rights',
    typical: 'No extensions/alterations without express planning permission',
    triggerPoint: 'Permanent condition',
    documents: [
      'No discharge required - informative condition',
      'Future applications needed for changes'
    ],
    consultees: [],
    timescale: 'N/A',
    tips: [
      'Not dischargeable - permanent restriction',
      'Check which rights removed (Classes A-E etc.)',
      'Applies to Article 4 areas anyway in Hampstead',
      'Future owners bound by this restriction'
    ]
  },
  'hours-operation': {
    title: 'Hours of Operation/Construction',
    typical: 'Restriction on working or opening hours',
    triggerPoint: 'Compliance condition',
    documents: [
      'No discharge required - compliance condition',
      'Written notification if variation needed'
    ],
    consultees: ['Environmental Health'],
    timescale: 'N/A',
    tips: [
      'Standard hours: 8am-6pm Mon-Fri, 8am-1pm Sat',
      'No Sunday/Bank Holiday working usually',
      'Variations require written agreement',
      'Enforcement action for breaches'
    ]
  },
  'lighting': {
    title: 'External Lighting',
    typical: 'Details of external lighting to be submitted',
    triggerPoint: 'Prior to installation',
    documents: [
      'Lighting layout plan',
      'Luminaire specifications',
      'Lux level calculations',
      'Light spill diagrams',
      'Timer/sensor details'
    ],
    consultees: ['Design Officer', 'Environmental Health'],
    timescale: '4-6 weeks',
    tips: [
      'Avoid light spill to neighboring properties',
      'Dark sky friendly in conservation areas',
      'PIR sensors reduce light pollution',
      'Heritage settings need sensitive design'
    ]
  }
};

/**
 * Generate condition discharge guide
 */
async function getConditionDischargeGuide(
  address: string,
  postcode: string,
  applicationReference?: string,
  conditions?: {
    number: number;
    type: string;
    text?: string;
    triggerPoint?: string;
  }[]
): Promise<DischargeGuide> {
  const parts = postcode.split(' ');
  const outcode = (parts[0] || 'NW3').toUpperCase();
  
  // Generate condition requirements based on provided conditions or typical set
  const conditionRequirements = generateConditionRequirements(conditions);
  
  // Calculate overview stats
  const overview = calculateOverview(conditionRequirements);
  
  // Generate discharge strategy
  const strategy = generateStrategy(conditionRequirements);
  
  // Generate submission process guide
  const submissionProcess = generateSubmissionProcess();
  
  // Common issues and resolution
  const commonIssues = generateCommonIssues();
  
  // Contact information
  const contacts = generateContacts(outcode);
  
  return {
    address,
    postcode,
    applicationReference,
    overview,
    conditions: conditionRequirements,
    strategy,
    submissionProcess,
    commonIssues,
    contacts
  };
}

/**
 * Generate condition requirements
 */
function generateConditionRequirements(
  conditions?: {
    number: number;
    type: string;
    text?: string;
    triggerPoint?: string;
  }[]
): ConditionRequirement[] {
  if (conditions && conditions.length > 0) {
    return conditions.map(cond => {
      const typeInfo = CONDITION_TYPES[cond.type] || CONDITION_TYPES['materials'];
      const safeTypeInfo = typeInfo || {
        title: 'General Condition',
        typical: 'Specific requirements to be discharged',
        triggerPoint: 'As specified',
        documents: ['Supporting documentation as appropriate'],
        consultees: [],
        timescale: '6-8 weeks',
        tips: ['Contact planning officer for guidance']
      };
      
      return {
        conditionNumber: cond.number,
        conditionType: cond.type,
        title: safeTypeInfo.title,
        fullText: cond.text || safeTypeInfo.typical,
        triggerPoint: cond.triggerPoint || safeTypeInfo.triggerPoint,
        dischargeTiming: calculateDischargeTiming(cond.triggerPoint || safeTypeInfo.triggerPoint),
        submissionRequirements: generateSubmissionReqs(cond.type),
        typicalDocuments: safeTypeInfo.documents,
        consultees: safeTypeInfo.consultees,
        fee: calculateFee(cond.type),
        typicalTimescale: safeTypeInfo.timescale,
        tips: safeTypeInfo.tips
      };
    });
  }
  
  // Return typical conditions for a residential permission
  const typicalTypes = ['materials', 'landscaping', 'tree-protection', 'construction-management', 
                        'boundary-treatment', 'cycle-storage', 'refuse-storage', 'lighting'];
  
  return typicalTypes.map((type, index) => {
    const typeInfo = CONDITION_TYPES[type];
    const safeTypeInfo = typeInfo || {
      title: 'General Condition',
      typical: 'Specific requirements to be discharged',
      triggerPoint: 'As specified',
      documents: ['Supporting documentation as appropriate'],
      consultees: [],
      timescale: '6-8 weeks',
      tips: ['Contact planning officer for guidance']
    };
    
    return {
      conditionNumber: index + 1,
      conditionType: type,
      title: safeTypeInfo.title,
      fullText: safeTypeInfo.typical,
      triggerPoint: safeTypeInfo.triggerPoint,
      dischargeTiming: calculateDischargeTiming(safeTypeInfo.triggerPoint),
      submissionRequirements: generateSubmissionReqs(type),
      typicalDocuments: safeTypeInfo.documents,
      consultees: safeTypeInfo.consultees,
      fee: calculateFee(type),
      typicalTimescale: safeTypeInfo.timescale,
      tips: safeTypeInfo.tips
    };
  });
}

/**
 * Calculate discharge timing
 */
function calculateDischargeTiming(triggerPoint: string): string {
  const timingMap: { [key: string]: string } = {
    'Prior to commencement': 'Submit 8-10 weeks before intended start date',
    'Prior to commencement (including demolition)': 'Submit 8-10 weeks before any site work',
    'Prior to above-ground construction': 'Submit during groundworks phase, 6-8 weeks before above-ground',
    'Prior to first occupation': 'Submit during construction, minimum 6 weeks before completion',
    'Prior to occupation': 'Submit during construction, minimum 6 weeks before completion',
    'Prior to installation': 'Submit before procurement, 4-6 weeks lead time',
    'Prior to groundworks': 'Submit before any excavation, 6-8 weeks lead time',
    'Compliance condition': 'No discharge required - monitor and comply',
    'Permanent condition': 'No discharge required - permanent restriction'
  };
  
  return timingMap[triggerPoint] || 'Submit minimum 6-8 weeks before trigger point';
}

/**
 * Generate submission requirements
 */
function generateSubmissionReqs(conditionType: string): string[] {
  const baseReqs = [
    'Completed discharge of conditions application form',
    'Site location plan at 1:1250 scale',
    'Block plan at 1:500 scale',
    'Planning reference number clearly stated',
    'Condition number(s) to be discharged'
  ];
  
  const typeSpecificReqs: { [key: string]: string[] } = {
    'materials': [
      'Physical samples where required',
      'Manufacturer specification sheets',
      'Drawings showing materials locations'
    ],
    'landscaping': [
      'Detailed planting schedule',
      'Hard landscaping specification',
      'Maintenance programme'
    ],
    'tree-protection': [
      'Arboricultural Method Statement',
      'Tree Protection Plan',
      'Site supervision schedule'
    ],
    'construction-management': [
      'Detailed method statement',
      'Traffic management plan',
      'Contact details for site manager'
    ],
    'drainage': [
      'Engineering calculations',
      'Long sections and cross sections',
      'Maintenance schedule'
    ]
  };
  
  return [...baseReqs, ...(typeSpecificReqs[conditionType] || [])];
}

/**
 * Calculate fee for condition type
 */
function calculateFee(conditionType: string): number {
  // Standard householder discharge fee
  const standardFee = 43;
  
  // Multiple conditions can be discharged together for same fee
  // Fee increases with number of conditions
  return standardFee;
}

/**
 * Calculate overview statistics
 */
function calculateOverview(conditions: ConditionRequirement[]): {
  totalConditions: number;
  priorToCommencement: number;
  duringConstruction: number;
  priorToOccupation: number;
  ongoingCompliance: number;
  estimatedTotalFees: number;
} {
  const total = conditions.length;
  const ptc = conditions.filter(c => 
    c.triggerPoint.toLowerCase().includes('prior to commencement') ||
    c.triggerPoint.toLowerCase().includes('prior to groundworks')
  ).length;
  const during = conditions.filter(c => 
    c.triggerPoint.toLowerCase().includes('above-ground') ||
    c.triggerPoint.toLowerCase().includes('during construction')
  ).length;
  const pto = conditions.filter(c => 
    c.triggerPoint.toLowerCase().includes('occupation')
  ).length;
  const ongoing = conditions.filter(c => 
    c.triggerPoint.toLowerCase().includes('compliance') ||
    c.triggerPoint.toLowerCase().includes('permanent')
  ).length;
  
  // Calculate fees - batch submissions where possible
  const submissions = Math.ceil((ptc + during + pto) / 3); // Batch up to 3 conditions
  const estimatedFees = submissions * 43; // 2024 fee
  
  return {
    totalConditions: total,
    priorToCommencement: ptc,
    duringConstruction: during,
    priorToOccupation: pto,
    ongoingCompliance: ongoing,
    estimatedTotalFees: estimatedFees
  };
}

/**
 * Generate discharge strategy
 */
function generateStrategy(conditions: ConditionRequirement[]): {
  priority: string[];
  batching: string[];
  timeline: { phase: string; conditions: number[]; deadline: string; }[];
  criticalPath: string[];
} {
  const preCommConditions = conditions.filter(c => 
    c.triggerPoint.toLowerCase().includes('prior to commencement') ||
    c.triggerPoint.toLowerCase().includes('prior to groundworks')
  );
  
  return {
    priority: [
      'Discharge pre-commencement conditions first - cannot legally start without them',
      'Group related conditions together for efficiency',
      'Allow 8-10 weeks minimum for pre-commencement approvals',
      'Maintain dialogue with case officer throughout'
    ],
    batching: [
      'Batch 1 (Week -10): Tree protection + Construction management (both needed before any site work)',
      'Batch 2 (Week -8): Materials + Boundary treatment (design-related)',
      'Batch 3 (During works): Landscaping + Cycle/refuse storage (pre-occupation)',
      'Batch 4 (Pre-completion): External lighting + any residual conditions'
    ],
    timeline: [
      { 
        phase: 'Pre-start', 
        conditions: preCommConditions.map(c => c.conditionNumber), 
        deadline: '10 weeks before intended start' 
      },
      { 
        phase: 'Early construction', 
        conditions: conditions.filter(c => c.triggerPoint.includes('above-ground')).map(c => c.conditionNumber), 
        deadline: 'Before ground floor slab' 
      },
      { 
        phase: 'Pre-occupation', 
        conditions: conditions.filter(c => c.triggerPoint.includes('occupation')).map(c => c.conditionNumber), 
        deadline: '6 weeks before practical completion' 
      }
    ],
    criticalPath: [
      'Tree protection approval required before any tree removal',
      'Construction management approval before deliveries start',
      'Materials approval before ordering (lead times)',
      'Landscaping scheme before laying hard surfaces'
    ]
  };
}

/**
 * Generate submission process guide
 */
function generateSubmissionProcess(): {
  steps: { step: number; action: string; timing: string; notes: string; }[];
  portalGuidance: string[];
  fees: { type: string; amount: number; notes: string; }[];
} {
  return {
    steps: [
      { step: 1, action: 'Review decision notice conditions carefully', timing: 'Immediately after approval', notes: 'Identify all conditions and their trigger points' },
      { step: 2, action: 'Create condition discharge schedule', timing: 'Before starting design work', notes: 'Map conditions against construction programme' },
      { step: 3, action: 'Commission required documents/surveys', timing: 'Allow 2-4 weeks', notes: 'Some reports need site visits or samples' },
      { step: 4, action: 'Pre-submission discussion with case officer', timing: 'Optional but recommended', notes: 'Clarify interpretation of conditions' },
      { step: 5, action: 'Submit via Planning Portal or local portal', timing: '8-10 weeks before trigger', notes: 'Group conditions into logical batches' },
      { step: 6, action: 'Pay application fee', timing: 'With submission', notes: 'Payment required for valid application' },
      { step: 7, action: 'Await validation', timing: '3-5 working days', notes: 'May request additional information' },
      { step: 8, action: 'Consultee period', timing: '2-4 weeks', notes: 'Statutory consultees review submission' },
      { step: 9, action: 'Case officer assessment', timing: '2-4 weeks', notes: 'May request amendments' },
      { step: 10, action: 'Decision issued', timing: '8 weeks statutory target', notes: 'Earlier if straightforward' }
    ],
    portalGuidance: [
      'Use application type: "Discharge of conditions"',
      'Reference original planning permission number',
      'Clearly list condition numbers being discharged',
      'Upload documents with clear file names',
      'Include covering letter summarizing submission'
    ],
    fees: [
      { type: 'Householder discharge', amount: 43, notes: 'Per request (can include multiple conditions)' },
      { type: 'Other discharge', amount: 145, notes: 'Per request for non-householder applications' },
      { type: 'Written confirmation', amount: 43, notes: 'For confirmation of compliance' }
    ]
  };
}

/**
 * Generate common issues and solutions
 */
function generateCommonIssues(): {
  issue: string;
  prevention: string;
  resolution: string;
}[] {
  return [
    {
      issue: 'Work started before pre-commencement conditions discharged',
      prevention: 'Never start work until all pre-commencement conditions approved in writing',
      resolution: 'Stop work immediately, seek retrospective discharge, may need section 73 application'
    },
    {
      issue: 'Submitted samples don\'t match what\'s installed',
      prevention: 'Retain approved samples, brief contractors, document procurement',
      resolution: 'May need retrospective approval, replacement if refused, enforcement risk'
    },
    {
      issue: 'Tree protection not maintained during works',
      prevention: 'Contractor briefing, arborist monitoring, penalty clauses in contracts',
      resolution: 'Arborist assessment, replacement planting if damaged, potential prosecution'
    },
    {
      issue: 'Condition discharged but details changed during construction',
      prevention: 'Any material changes require approval before implementation',
      resolution: 'Non-material amendment application or new discharge submission'
    },
    {
      issue: 'Landscaping not implemented within planting season',
      prevention: 'Plan planting for October-March season, specify in programme',
      resolution: 'Written agreement for delayed implementation, temporary arrangements'
    },
    {
      issue: 'Discharge application invalid/incomplete',
      prevention: 'Check requirements carefully, pre-submission discussion, use checklist',
      resolution: 'Resubmit with missing information, pay any additional fees'
    },
    {
      issue: 'Long delays in discharge determination',
      prevention: 'Submit early, follow up regularly, escalate if needed',
      resolution: 'Contact case officer, escalate to team leader, adjust programme'
    }
  ];
}

/**
 * Generate contact information
 */
function generateContacts(outcode: string): {
  department: string;
  email: string;
  phone?: string;
  role: string;
}[] {
  return [
    {
      department: 'Camden Planning',
      email: 'planningadvice@camden.gov.uk',
      phone: '020 7974 4444',
      role: 'General planning enquiries'
    },
    {
      department: 'Planning Validation',
      email: 'planning@camden.gov.uk',
      role: 'Application submission queries'
    },
    {
      department: 'Development Management',
      email: 'planning@camden.gov.uk',
      role: 'Case officer assignment after validation'
    },
    {
      department: 'Trees and Landscaping',
      email: 'trees@camden.gov.uk',
      role: 'Tree and landscape condition queries'
    },
    {
      department: 'Conservation',
      email: 'design@camden.gov.uk',
      role: 'Heritage and design condition queries'
    }
  ];
}

/**
 * Check if conditions have been discharged
 */
async function checkConditionStatus(
  applicationReference: string,
  conditionNumbers: number[]
): Promise<{
  reference: string;
  conditions: {
    number: number;
    status: 'discharged' | 'pending' | 'refused' | 'not-submitted' | 'unknown';
    dischargeDate?: string;
    dischargeReference?: string;
    notes?: string;
  }[];
  overallStatus: string;
  nextSteps: string[];
}> {
  // In production, this would check the planning portal
  // For now, return guidance on how to check
  
  return {
    reference: applicationReference,
    conditions: conditionNumbers.map(num => ({
      number: num,
      status: 'unknown' as const,
      notes: 'Check Camden Planning Portal or contact case officer for status'
    })),
    overallStatus: 'Unable to verify automatically - check planning portal',
    nextSteps: [
      'Log in to Camden Planning Portal with your account',
      'Search for your application reference',
      'View "Associated Applications" for discharge submissions',
      'Contact case officer if status unclear',
      'Request formal written confirmation if needed'
    ]
  };
}

export default {
  getConditionDischargeGuide,
  checkConditionStatus
};
