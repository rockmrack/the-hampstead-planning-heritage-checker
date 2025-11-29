/**
 * Enforcement Response Service
 * 
 * Guidance for responding to planning enforcement action
 * including notices, investigations, and compliance strategies
 */

interface EnforcementResponse {
  address: string;
  postcode: string;
  enforcementType: string;
  situation: string;
  assessment: {
    severity: 'critical' | 'serious' | 'moderate' | 'minor';
    urgency: 'immediate' | 'urgent' | 'standard';
    immunityPossible: boolean;
    complianceRoute: string;
  };
  responseOptions: {
    option: string;
    description: string;
    timeline: string;
    cost: string;
    successLikelihood: string;
    risks: string[];
    steps: string[];
  }[];
  timeframes: {
    stage: string;
    deadline: string;
    consequences: string;
  }[];
  legalConsiderations: {
    aspect: string;
    explanation: string;
    action: string;
  }[];
  practicalGuidance: {
    do: string[];
    dont: string[];
    priorities: string[];
  };
  contacts: {
    type: string;
    description: string;
    when: string;
  }[];
}

// Enforcement notice types
const ENFORCEMENT_TYPES: { [key: string]: {
  name: string;
  description: string;
  compliancePeriod: string;
  consequences: string[];
  defences: string[];
} } = {
  'enforcement-notice': {
    name: 'Enforcement Notice',
    description: 'Formal notice requiring breach to be remedied',
    compliancePeriod: 'Minimum 28 days (often longer specified)',
    consequences: [
      'Criminal offence if not complied with',
      'Direct action by LPA (costs recovered)',
      'Land charge registered against property',
      'Prosecution with unlimited fine'
    ],
    defences: [
      'Development is immune (4/10 year rule)',
      'Planning permission has been granted',
      'Notice is defective (procedural errors)',
      'Steps required are excessive'
    ]
  },
  'breach-condition-notice': {
    name: 'Breach of Condition Notice (BCN)',
    description: 'Notice for breach of planning condition',
    compliancePeriod: 'Minimum 28 days',
    consequences: [
      'Criminal offence - max fine £2,500 per offence',
      'Continuing offence - daily fine possible',
      'No right of appeal to Planning Inspectorate'
    ],
    defences: [
      'Condition was not breached',
      'Compliance is impossible',
      'Notice is defective'
    ]
  },
  'planning-contravention-notice': {
    name: 'Planning Contravention Notice (PCN)',
    description: 'Formal request for information about alleged breach',
    compliancePeriod: '21 days to respond',
    consequences: [
      'Criminal offence if not responded to',
      'Criminal offence if false information given',
      'Fine up to level 5 on standard scale'
    ],
    defences: [
      'Information not within your knowledge',
      'Notice not properly served'
    ]
  },
  'section-215-notice': {
    name: 'Section 215 Notice (Untidy Land)',
    description: 'Notice to remedy condition of land/buildings',
    compliancePeriod: 'Minimum 28 days',
    consequences: [
      'Direct action by LPA if not complied',
      'Criminal offence - fine up to level 3',
      'Costs of LPA works recovered'
    ],
    defences: [
      'Land is not adversely affecting amenity',
      'Steps required are unreasonable'
    ]
  },
  'stop-notice': {
    name: 'Stop Notice',
    description: 'Requires immediate cessation of activity',
    compliancePeriod: 'Takes effect 3-28 days from service',
    consequences: [
      'Criminal offence if activity continues',
      'Unlimited fine on conviction',
      'LPA liable for compensation if withdrawn'
    ],
    defences: [
      'Activity had already ceased',
      'Notice is defective'
    ]
  },
  'temporary-stop-notice': {
    name: 'Temporary Stop Notice',
    description: 'Immediate prohibition of activity',
    compliancePeriod: 'Immediate - expires after 28 days',
    consequences: [
      'Immediate criminal offence if breached',
      'Unlimited fine on conviction'
    ],
    defences: [
      'Activity is not a breach',
      'Notice is defective'
    ]
  }
};

// Time periods for immunity
const IMMUNITY_PERIODS = {
  'building-operations': { years: 4, description: 'Operational development (building works)' },
  'change-of-use': { years: 10, description: 'Change of use of land or buildings' },
  'breach-of-condition': { years: 10, description: 'Breach of planning condition' },
  'residential-use': { years: 4, description: 'Use as single dwelling (Keen v SoS)' }
};

/**
 * Generate enforcement response guidance
 */
async function getEnforcementResponseGuide(
  address: string,
  postcode: string,
  enforcementType: string,
  situation: {
    noticeReceived?: boolean;
    noticeDate?: string;
    breachType?: string;
    breachDate?: string;
    complianceDeadline?: string;
    currentStatus?: string;
    developmentDescription?: string;
  }
): Promise<EnforcementResponse> {
  const outcode = postcode.split(' ')[0] || 'NW3';
  
  // Assess the situation
  const assessment = assessSituation(enforcementType, situation);
  
  // Generate response options
  const responseOptions = generateResponseOptions(enforcementType, assessment, situation);
  
  // Calculate timeframes
  const timeframes = calculateTimeframes(enforcementType, situation);
  
  // Legal considerations
  const legalConsiderations = generateLegalConsiderations(enforcementType, situation);
  
  // Practical guidance
  const practicalGuidance = generatePracticalGuidance(enforcementType, assessment);
  
  // Key contacts
  const contacts = generateContacts(assessment);
  
  return {
    address,
    postcode,
    enforcementType,
    situation: situation.developmentDescription || 'Planning enforcement matter',
    assessment,
    responseOptions,
    timeframes,
    legalConsiderations,
    practicalGuidance,
    contacts
  };
}

/**
 * Assess the enforcement situation
 */
function assessSituation(
  enforcementType: string,
  situation: {
    noticeReceived?: boolean;
    noticeDate?: string;
    breachDate?: string;
    complianceDeadline?: string;
    currentStatus?: string;
  }
): {
  severity: 'critical' | 'serious' | 'moderate' | 'minor';
  urgency: 'immediate' | 'urgent' | 'standard';
  immunityPossible: boolean;
  complianceRoute: string;
} {
  let severity: 'critical' | 'serious' | 'moderate' | 'minor' = 'moderate';
  let urgency: 'immediate' | 'urgent' | 'standard' = 'standard';
  let immunityPossible = false;
  let complianceRoute = 'To be determined based on specific circumstances';
  
  // Assess severity based on notice type
  const noticeTypes = ['stop-notice', 'temporary-stop-notice'];
  if (noticeTypes.includes(enforcementType)) {
    severity = 'critical';
    urgency = 'immediate';
    complianceRoute = 'Cease activity immediately, seek urgent legal advice';
  } else if (enforcementType === 'enforcement-notice') {
    severity = 'serious';
    urgency = 'urgent';
    complianceRoute = 'Consider appeal or compliance';
  } else if (enforcementType === 'breach-condition-notice') {
    severity = 'serious';
    urgency = 'urgent';
    complianceRoute = 'Compliance usually only option - no appeal right';
  } else if (enforcementType === 'planning-contravention-notice') {
    severity = 'moderate';
    urgency = 'standard';
    complianceRoute = 'Respond within time limit with accurate information';
  } else if (enforcementType === 'section-215-notice') {
    severity = 'moderate';
    urgency = 'standard';
    complianceRoute = 'Comply with works or appeal';
  }
  
  // Check immunity possibility
  if (situation.breachDate) {
    const breachDate = new Date(situation.breachDate);
    const now = new Date();
    const years = (now.getTime() - breachDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
    
    // Most operations immune after 4 years, use after 10 years
    if (years >= 4) {
      immunityPossible = true;
      complianceRoute = 'Consider immunity defence (4+ years for operations)';
    }
    if (years >= 10) {
      complianceRoute = 'Strong immunity case (10+ years for use changes)';
    }
  }
  
  // Adjust urgency based on deadline
  if (situation.complianceDeadline) {
    const deadline = new Date(situation.complianceDeadline);
    const now = new Date();
    const daysRemaining = (deadline.getTime() - now.getTime()) / (24 * 60 * 60 * 1000);
    
    if (daysRemaining <= 7) {
      urgency = 'immediate';
    } else if (daysRemaining <= 21) {
      urgency = 'urgent';
    }
  }
  
  return { severity, urgency, immunityPossible, complianceRoute };
}

/**
 * Generate response options
 */
function generateResponseOptions(
  enforcementType: string,
  assessment: { severity: string; immunityPossible: boolean },
  situation: { complianceDeadline?: string }
): {
  option: string;
  description: string;
  timeline: string;
  cost: string;
  successLikelihood: string;
  risks: string[];
  steps: string[];
}[] {
  const options: {
    option: string;
    description: string;
    timeline: string;
    cost: string;
    successLikelihood: string;
    risks: string[];
    steps: string[];
  }[] = [];
  
  // Option 1: Full compliance
  options.push({
    option: 'Full Compliance',
    description: 'Comply with all requirements of the notice',
    timeline: 'Within compliance period specified',
    cost: 'Variable - depends on works required',
    successLikelihood: 'High - ends enforcement action',
    risks: [
      'Cost of compliance works',
      'May lose value added by development',
      'May need to reverse completed works'
    ],
    steps: [
      'Understand exactly what is required',
      'Get quotes for compliance works',
      'Carry out works before deadline',
      'Notify council when compliant',
      'Request written confirmation of compliance'
    ]
  });
  
  // Option 2: Appeal (if applicable)
  if (enforcementType === 'enforcement-notice' || enforcementType === 'section-215-notice') {
    options.push({
      option: 'Appeal to Planning Inspectorate',
      description: 'Challenge the notice through formal appeal',
      timeline: 'Appeal must be lodged before notice takes effect',
      cost: '£0 (no fee) but professional costs likely £2,000-10,000+',
      successLikelihood: 'Variable - depends on grounds',
      risks: [
        'Appeal suspends but extends uncertainty',
        'Professional fees can be substantial',
        'Costs award possible if appeal unreasonable',
        'Notice confirmed may have shorter compliance period'
      ],
      steps: [
        'Seek immediate legal/planning advice',
        'Identify valid grounds of appeal',
        'Lodge appeal before deadline (crucial)',
        'Prepare supporting evidence',
        'Attend hearing/inquiry if required'
      ]
    });
  }
  
  // Option 3: Negotiation
  options.push({
    option: 'Negotiate with LPA',
    description: 'Discuss acceptable resolution with enforcement team',
    timeline: 'As soon as possible',
    cost: 'Minimal direct cost, potentially reduced compliance',
    successLikelihood: 'Moderate - depends on breach type',
    risks: [
      'LPA may not agree to negotiate',
      'Outcome not guaranteed',
      'Time spent may reduce appeal window'
    ],
    steps: [
      'Contact enforcement officer promptly',
      'Understand their concerns',
      'Propose alternative solution',
      'Get any agreement in writing',
      'Follow through on commitments'
    ]
  });
  
  // Option 4: Retrospective planning application
  options.push({
    option: 'Retrospective Planning Application',
    description: 'Apply for planning permission for the breach',
    timeline: 'Submit promptly - 8 weeks determination',
    cost: 'Application fee (£289-578+) plus professional fees',
    successLikelihood: 'Variable - assessed as new application',
    risks: [
      'Application may be refused',
      'Does not stop enforcement action',
      'Fee non-refundable',
      'Conditions may be imposed'
    ],
    steps: [
      'Assess likelihood of approval',
      'Prepare full planning application',
      'Submit and pay fee',
      'Inform enforcement team',
      'Request enforcement held in abeyance'
    ]
  });
  
  // Option 5: Immunity claim (if applicable)
  if (assessment.immunityPossible) {
    options.push({
      option: 'Claim Immunity (CLEUD)',
      description: 'Apply for Certificate of Lawfulness based on time elapsed',
      timeline: '8 weeks for determination',
      cost: '£289-578 application fee plus evidence gathering',
      successLikelihood: 'Depends on evidence quality',
      risks: [
        'Must prove continuous existence/use for required period',
        'Evidence must be compelling',
        'Does not stop enforcement meanwhile',
        'LPA may dispute dates'
      ],
      steps: [
        'Calculate relevant time period',
        'Gather dated evidence',
        'Obtain statutory declarations',
        'Submit CLEUD application',
        'Request enforcement held pending'
      ]
    });
  }
  
  return options;
}

/**
 * Calculate relevant timeframes
 */
function calculateTimeframes(
  enforcementType: string,
  situation: {
    noticeDate?: string;
    complianceDeadline?: string;
  }
): { stage: string; deadline: string; consequences: string }[] {
  const timeframes: { stage: string; deadline: string; consequences: string }[] = [];
  
  const enfInfo = ENFORCEMENT_TYPES[enforcementType];
  
  if (enforcementType === 'enforcement-notice') {
    timeframes.push({
      stage: 'Appeal deadline',
      deadline: situation.noticeDate 
        ? `28 days from ${situation.noticeDate} (notice taking effect date)` 
        : 'Check notice - usually 28 days from effective date',
      consequences: 'Right to appeal lost if deadline missed'
    });
  }
  
  if (enforcementType === 'planning-contravention-notice') {
    timeframes.push({
      stage: 'Response deadline',
      deadline: situation.noticeDate 
        ? `21 days from ${situation.noticeDate}` 
        : '21 days from date of notice',
      consequences: 'Criminal offence if not responded to'
    });
  }
  
  timeframes.push({
    stage: 'Compliance deadline',
    deadline: situation.complianceDeadline || `Check notice - typically ${enfInfo?.compliancePeriod || '28 days minimum'}`,
    consequences: 'Criminal offence and/or direct action by LPA'
  });
  
  timeframes.push({
    stage: 'Prosecution',
    deadline: 'After compliance deadline passes',
    consequences: 'Criminal record, unlimited fine for some offences'
  });
  
  timeframes.push({
    stage: 'Direct action',
    deadline: 'After compliance deadline and prosecution',
    consequences: 'LPA carries out works, costs recovered from owner'
  });
  
  return timeframes;
}

/**
 * Generate legal considerations
 */
function generateLegalConsiderations(
  enforcementType: string,
  situation: { breachType?: string }
): { aspect: string; explanation: string; action: string }[] {
  const enfInfo = ENFORCEMENT_TYPES[enforcementType];
  const safeEnfInfo = enfInfo || ENFORCEMENT_TYPES['enforcement-notice'];
  
  const considerations: { aspect: string; explanation: string; action: string }[] = [
    {
      aspect: 'Criminal liability',
      explanation: 'Non-compliance is typically a criminal offence with potential for prosecution',
      action: 'Take notice seriously - seek legal advice if unsure'
    },
    {
      aspect: 'Land charge',
      explanation: 'Enforcement notice registered as local land charge affecting property sale',
      action: 'Resolve before attempting to sell/remortgage'
    },
    {
      aspect: 'Defences available',
      explanation: safeEnfInfo?.defences?.join('; ') || 'Consult legal advisor for applicable defences',
      action: 'Consider whether any defence applies to your situation'
    },
    {
      aspect: 'Appeal rights',
      explanation: enforcementType === 'breach-condition-notice' 
        ? 'No right of appeal to Planning Inspectorate for BCN' 
        : 'Right to appeal to Planning Inspectorate before notice takes effect',
      action: enforcementType === 'breach-condition-notice'
        ? 'Only option may be judicial review (expensive, limited grounds)'
        : 'Consider appeal if valid grounds exist - act quickly'
    },
    {
      aspect: 'Continuing offence',
      explanation: 'Some breaches constitute continuing offences with daily penalties',
      action: 'Compliance as soon as possible limits exposure'
    }
  ];
  
  return considerations;
}

/**
 * Generate practical guidance
 */
function generatePracticalGuidance(
  enforcementType: string,
  assessment: { severity: string; urgency: string }
): { do: string[]; dont: string[]; priorities: string[] } {
  return {
    do: [
      'Read the notice carefully - understand exactly what is required',
      'Note all deadlines and diarize them',
      'Keep copies of all correspondence',
      'Seek professional advice promptly if uncertain',
      'Communicate with the enforcement team',
      'Keep evidence of any compliance works',
      'Request written confirmation when compliant',
      'Consider all options before deciding approach'
    ],
    dont: [
      'Ignore the notice - it will not go away',
      'Miss deadlines - especially appeal deadlines',
      'Provide false or misleading information',
      'Assume verbal agreements are binding',
      'Continue breach if stop notice served',
      'Assume you can negotiate indefinitely',
      'Dispose of evidence that might help your case',
      'Make assumptions about immunity without professional advice'
    ],
    priorities: assessment.urgency === 'immediate' ? [
      'STOP any activity prohibited immediately',
      'Seek urgent legal advice today',
      'Note deadline dates',
      'Gather any evidence of dates/timelines'
    ] : [
      'Understand what is required by when',
      'Assess whether appeal or compliance better option',
      'Seek professional advice if substantial development',
      'Engage constructively with enforcement team'
    ]
  };
}

/**
 * Generate contacts
 */
function generateContacts(
  assessment: { severity: string; urgency: string }
): { type: string; description: string; when: string }[] {
  const contacts: { type: string; description: string; when: string }[] = [
    {
      type: 'Camden Enforcement Team',
      description: 'planningenforcement@camden.gov.uk - LPA enforcement officers',
      when: 'First point of contact for queries about notice'
    },
    {
      type: 'Planning Consultant',
      description: 'RTPI-registered planning consultant',
      when: 'For advice on options, appeal grounds, retrospective applications'
    },
    {
      type: 'Planning Solicitor',
      description: 'Solicitor specializing in planning law',
      when: 'For legal advice, appeal representation, criminal defence'
    }
  ];
  
  if (assessment.severity === 'critical' || assessment.urgency === 'immediate') {
    contacts.unshift({
      type: 'Urgent legal advice',
      description: 'Contact planning solicitor immediately',
      when: 'TODAY - do not delay'
    });
  }
  
  contacts.push({
    type: 'Planning Inspectorate',
    description: 'For appeals - www.gov.uk/appeal-planning-inspectorate',
    when: 'If appealing enforcement notice (before deadline)'
  });
  
  return contacts;
}

/**
 * Check immunity based on dates
 */
async function checkImmunity(
  breachType: 'operational' | 'change-of-use' | 'breach-condition' | 'residential-dwelling',
  breachDate: string,
  continuous: boolean
): Promise<{
  immunityPeriod: number;
  yearsElapsed: number;
  immunityAchieved: boolean;
  confidenceLevel: 'high' | 'medium' | 'low';
  evidenceNeeded: string[];
  notes: string[];
}> {
  // Map input breach types to IMMUNITY_PERIODS keys
  const breachTypeMap: { [key: string]: keyof typeof IMMUNITY_PERIODS } = {
    'operational': 'building-operations',
    'change-of-use': 'change-of-use',
    'breach-condition': 'breach-of-condition',
    'residential-dwelling': 'residential-use'
  };
  const mappedType = breachTypeMap[breachType] || 'building-operations';
  const period = IMMUNITY_PERIODS[mappedType];
  const safePeriod = period || IMMUNITY_PERIODS['building-operations'];
  
  const start = new Date(breachDate);
  const now = new Date();
  const yearsElapsed = (now.getTime() - start.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
  
  const immunityAchieved = yearsElapsed >= safePeriod.years && continuous;
  
  const confidenceLevel: 'high' | 'medium' | 'low' = 
    !continuous ? 'low' :
    yearsElapsed >= safePeriod.years + 1 ? 'high' :
    yearsElapsed >= safePeriod.years ? 'medium' : 'low';
  
  const evidenceNeeded = [
    'Dated photographs throughout the period',
    'Statutory declarations from witnesses',
    'Documentary evidence (utility bills, council tax, etc.)',
    'Aerial photography',
    'Professional surveyor dating assessment'
  ];
  
  const notes: string[] = [];
  if (immunityAchieved) {
    notes.push(`${safePeriod.years}-year immunity period appears to have elapsed`);
    notes.push('CLEUD application recommended to formalize immunity');
  } else if (yearsElapsed < safePeriod.years) {
    const remaining = safePeriod.years - yearsElapsed;
    notes.push(`Approximately ${remaining.toFixed(1)} years remaining until potential immunity`);
    notes.push('LPA can take enforcement action before immunity achieved');
  }
  
  if (!continuous) {
    notes.push('Continuous existence/use is essential for immunity');
    notes.push('Any break in continuity restarts the clock');
  }
  
  return {
    immunityPeriod: safePeriod.years,
    yearsElapsed: Math.round(yearsElapsed * 10) / 10,
    immunityAchieved,
    confidenceLevel,
    evidenceNeeded,
    notes
  };
}

export default {
  getEnforcementResponseGuide,
  checkImmunity
};
