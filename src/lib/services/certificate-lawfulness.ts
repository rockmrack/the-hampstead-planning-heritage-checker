/**
 * Certificate of Lawfulness Service
 * 
 * Guidance for CLEUD (existing) and CLOPUD (proposed) applications
 * to establish lawful development status
 */

interface CertificateAssessment {
  address: string;
  postcode: string;
  certificateType: 'CLEUD' | 'CLOPUD';
  development: string;
  assessment: {
    eligibility: 'likely-eligible' | 'borderline' | 'unlikely-eligible';
    confidence: 'high' | 'medium' | 'low';
    reasoning: string[];
    keyTests: { test: string; assessment: string; passed: boolean }[];
  };
  evidenceRequirements: {
    category: string;
    items: string[];
    weight: 'essential' | 'strongly-supportive' | 'helpful';
    tips: string[];
  }[];
  applicationProcess: {
    step: number;
    action: string;
    timing: string;
    notes: string;
  }[];
  risks: {
    risk: string;
    likelihood: 'high' | 'medium' | 'low';
    mitigation: string;
  }[];
  timeline: {
    preparation: string;
    determination: string;
    total: string;
  };
  fees: {
    type: string;
    amount: number;
    notes: string;
  };
  alternatives: string[];
}

// Time periods for lawful development
const TIME_PERIODS = {
  'operational': 4, // Years for building operations
  'change-of-use': 10, // Years for change of use
  'breach-condition': 10, // Years for breach of planning condition
  'residential-dwelling': 4, // Years for unauthorized dwelling
  'enforcement-immunity': 4 // Years for most enforcement
};

// Permitted development classes and requirements
const PERMITTED_DEVELOPMENT: { [key: string]: {
  class: string;
  description: string;
  limitations: string[];
  excluded: string[];
  requirements: string[];
} } = {
  'single-storey-rear': {
    class: 'Class A',
    description: 'Single storey rear extension',
    limitations: [
      'Extends max 3m (attached) or 4m (detached) beyond rear wall',
      'Max height 4m',
      'Max eaves height 3m if within 2m of boundary',
      'Cannot exceed 50% of garden area'
    ],
    excluded: [
      'Listed buildings',
      'Article 4 direction areas (most of Hampstead)',
      'Conservation areas (restrictions apply)',
      'Land within curtilage of listed building'
    ],
    requirements: [
      'Not forward of principal elevation',
      'Single storey only',
      'Materials to match existing as far as practicable'
    ]
  },
  'two-storey-rear': {
    class: 'Class A',
    description: 'Two storey rear extension',
    limitations: [
      'Max 3m depth from original rear wall',
      'Max 7m from rear boundary',
      'Max eaves/ridge height no higher than existing',
      'Cannot exceed 50% of garden area'
    ],
    excluded: [
      'Listed buildings',
      'Article 4 direction areas',
      'Conservation areas'
    ],
    requirements: [
      'Not forward of principal elevation',
      'Matching materials',
      'No upper floor windows in side elevation'
    ]
  },
  'side-extension': {
    class: 'Class A',
    description: 'Single storey side extension',
    limitations: [
      'Max width 50% of original house width',
      'Max height 4m',
      'Max eaves 3m if within 2m of boundary'
    ],
    excluded: [
      'Listed buildings',
      'Article 4 direction areas'
    ],
    requirements: [
      'Single storey',
      'Matching materials'
    ]
  },
  'loft-conversion': {
    class: 'Class B',
    description: 'Loft extension with dormer',
    limitations: [
      'Max 40 cubic metres (terraced) or 50 cubic metres (other)',
      'Not higher than highest part of existing roof',
      'Materials to match',
      'Set back min 20cm from eaves'
    ],
    excluded: [
      'Listed buildings',
      'Article 4 areas (common in Hampstead)',
      'Principal elevation dormers'
    ],
    requirements: [
      'Not on principal elevation',
      'Not on side elevation fronting highway',
      'No balconies or raised platforms'
    ]
  },
  'outbuilding': {
    class: 'Class E',
    description: 'Outbuilding incidental to dwelling',
    limitations: [
      'Max 50% of garden not covered by original house',
      'Max height 2.5m if within 2m of boundary',
      'Max height 4m (dual pitch) or 3m otherwise',
      'Max eaves 2.5m'
    ],
    excluded: [
      'Forward of principal elevation',
      'Listed building curtilage',
      'Article 4 areas (some)'
    ],
    requirements: [
      'Incidental to enjoyment of dwelling',
      'No sleeping accommodation',
      'Single storey only'
    ]
  },
  'hard-surface': {
    class: 'Class F',
    description: 'Hard surfaces (driveways, patios)',
    limitations: [
      'Front garden: must be permeable or drain to permeable area',
      'Rear: generally permitted'
    ],
    excluded: [
      'Listed building curtilage'
    ],
    requirements: [
      'Permeable materials or drainage to soft landscaping (front)',
      'No raising above existing ground level significantly'
    ]
  },
  'solar-panels': {
    class: 'Class G/H',
    description: 'Solar PV and thermal equipment',
    limitations: [
      'Not to protrude more than 200mm from roof slope',
      'Not higher than highest part of roof',
      'Not on listed building'
    ],
    excluded: [
      'Listed buildings',
      'Some conservation area restrictions'
    ],
    requirements: [
      'On roof slope facing highway: additional restrictions may apply',
      'Remove when no longer needed'
    ]
  },
  'gates-fences': {
    class: 'Class A (Part 2)',
    description: 'Gates, fences, walls',
    limitations: [
      'Max 2m height (or 1m adjacent to highway)',
      'Not higher than existing if replacing'
    ],
    excluded: [
      'Listed building curtilage',
      'Article 4 areas may restrict'
    ],
    requirements: [
      'No restriction on rear/side boundaries (up to 2m)',
      'Highway boundaries max 1m'
    ]
  }
};

/**
 * Assess eligibility for Certificate of Lawfulness
 */
async function assessCertificateEligibility(
  address: string,
  postcode: string,
  certificateType: 'CLEUD' | 'CLOPUD',
  development: string,
  context?: {
    developmentType?: string;
    completionDate?: string; // For CLEUD
    continuousUse?: boolean;
    evidenceAvailable?: string[];
    article4Direction?: boolean;
    conservationArea?: boolean;
    listedBuilding?: boolean;
  }
): Promise<CertificateAssessment> {
  const outcode = postcode.split(' ')[0] || 'NW3';
  
  // Generate assessment based on certificate type
  const assessment = certificateType === 'CLEUD'
    ? assessCLEUD(development, context)
    : assessCLOPUD(development, context);
  
  // Generate evidence requirements
  const evidenceRequirements = certificateType === 'CLEUD'
    ? generateCLEUDEvidence(development, context)
    : generateCLOPUDEvidence(development, context);
  
  // Generate application process
  const applicationProcess = generateApplicationProcess(certificateType);
  
  // Identify risks
  const risks = generateRisks(certificateType, assessment, context);
  
  // Calculate timeline
  const timeline = generateTimeline(certificateType);
  
  // Calculate fees
  const fees = calculateFees(certificateType, development);
  
  // Suggest alternatives if certificate unlikely
  const alternatives = assessment.eligibility === 'unlikely-eligible'
    ? generateAlternatives(certificateType, development, context)
    : [];
  
  return {
    address,
    postcode,
    certificateType,
    development,
    assessment,
    evidenceRequirements,
    applicationProcess,
    risks,
    timeline,
    fees,
    alternatives
  };
}

/**
 * Assess CLEUD eligibility
 */
function assessCLEUD(
  development: string,
  context?: {
    completionDate?: string;
    continuousUse?: boolean;
    evidenceAvailable?: string[];
    article4Direction?: boolean;
    conservationArea?: boolean;
    listedBuilding?: boolean;
  }
): {
  eligibility: 'likely-eligible' | 'borderline' | 'unlikely-eligible';
  confidence: 'high' | 'medium' | 'low';
  reasoning: string[];
  keyTests: { test: string; assessment: string; passed: boolean }[];
} {
  const keyTests: { test: string; assessment: string; passed: boolean }[] = [];
  const reasoning: string[] = [];
  let score = 0;
  
  // Test 1: Time period
  if (context?.completionDate) {
    const completionDate = new Date(context.completionDate);
    const now = new Date();
    const years = (now.getTime() - completionDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
    
    if (years >= 4) {
      keyTests.push({ test: '4-year rule (operations)', assessment: `${years.toFixed(1)} years elapsed`, passed: true });
      score += 2;
    } else {
      keyTests.push({ test: '4-year rule (operations)', assessment: `Only ${years.toFixed(1)} years elapsed`, passed: false });
    }
  } else {
    keyTests.push({ test: 'Time period', assessment: 'Completion date needed for assessment', passed: false });
    reasoning.push('Provide completion date to assess time period eligibility');
  }
  
  // Test 2: Continuous use/existence
  if (context?.continuousUse) {
    keyTests.push({ test: 'Continuous existence/use', assessment: 'Confirmed continuous', passed: true });
    score += 2;
  } else {
    keyTests.push({ test: 'Continuous existence/use', assessment: 'Must demonstrate continuous presence', passed: false });
    reasoning.push('Evidence of continuous existence throughout the period is essential');
  }
  
  // Test 3: No enforcement
  keyTests.push({ 
    test: 'No enforcement action', 
    assessment: 'Must confirm no enforcement notices served', 
    passed: true // Assume unless told otherwise
  });
  score += 1;
  
  // Test 4: Evidence quality
  if (context?.evidenceAvailable && context.evidenceAvailable.length >= 3) {
    keyTests.push({ test: 'Evidence availability', assessment: `${context.evidenceAvailable.length} evidence types identified`, passed: true });
    score += 2;
  } else {
    keyTests.push({ test: 'Evidence availability', assessment: 'More evidence needed', passed: false });
    reasoning.push('Gather diverse evidence types to strengthen application');
  }
  
  // Listed building warning
  if (context?.listedBuilding) {
    keyTests.push({ test: 'Listed building', assessment: 'CLEUD cannot override LBC requirements', passed: false });
    reasoning.push('Listed Building Consent is a separate matter - unauthorized works may still require retrospective LBC');
    score -= 2;
  }
  
  // Determine eligibility
  let eligibility: 'likely-eligible' | 'borderline' | 'unlikely-eligible';
  let confidence: 'high' | 'medium' | 'low';
  
  if (score >= 5) {
    eligibility = 'likely-eligible';
    confidence = 'high';
  } else if (score >= 3) {
    eligibility = 'borderline';
    confidence = 'medium';
  } else {
    eligibility = 'unlikely-eligible';
    confidence = score < 0 ? 'high' : 'low';
  }
  
  return { eligibility, confidence, reasoning, keyTests };
}

/**
 * Assess CLOPUD eligibility
 */
function assessCLOPUD(
  development: string,
  context?: {
    developmentType?: string;
    article4Direction?: boolean;
    conservationArea?: boolean;
    listedBuilding?: boolean;
  }
): {
  eligibility: 'likely-eligible' | 'borderline' | 'unlikely-eligible';
  confidence: 'high' | 'medium' | 'low';
  reasoning: string[];
  keyTests: { test: string; assessment: string; passed: boolean }[];
} {
  const keyTests: { test: string; assessment: string; passed: boolean }[] = [];
  const reasoning: string[] = [];
  let score = 0;
  
  const devType = context?.developmentType || development.toLowerCase();
  const devTypePrefix = devType.split('-')[0] || devType;
  
  // Find matching PD class
  let pdMatch: { class: string; description: string; limitations: string[]; excluded: string[]; requirements: string[] } | null = null;
  
  for (const [key, value] of Object.entries(PERMITTED_DEVELOPMENT)) {
    if (devType.includes(key) || key.includes(devTypePrefix)) {
      pdMatch = value;
      break;
    }
  }
  
  if (pdMatch) {
    keyTests.push({ test: 'PD class identified', assessment: `${pdMatch.class}: ${pdMatch.description}`, passed: true });
    score += 2;
    reasoning.push(`Development may fall within ${pdMatch.class} of the GPDO`);
  } else {
    keyTests.push({ test: 'PD class', assessment: 'No clear PD class identified', passed: false });
    reasoning.push('Development may not be permitted development - check specific proposal');
  }
  
  // Article 4 Direction check (common in Hampstead)
  if (context?.article4Direction || devType.includes('hampstead') || devType.includes('nw3')) {
    keyTests.push({ test: 'Article 4 Direction', assessment: 'Article 4 likely applies - PD rights removed', passed: false });
    score -= 3;
    reasoning.push('Most of Hampstead is covered by Article 4 directions removing PD rights');
    reasoning.push('CLOPUD unlikely to succeed where Article 4 applies');
  } else {
    keyTests.push({ test: 'Article 4 Direction', assessment: 'Check if Article 4 applies', passed: true });
    score += 1;
  }
  
  // Conservation area
  if (context?.conservationArea) {
    keyTests.push({ test: 'Conservation area', assessment: 'Additional restrictions apply', passed: false });
    score -= 1;
    reasoning.push('Conservation area status restricts some PD rights');
  }
  
  // Listed building
  if (context?.listedBuilding) {
    keyTests.push({ test: 'Listed building', assessment: 'No PD rights for listed buildings', passed: false });
    score -= 5;
    reasoning.push('Listed buildings have no permitted development rights for most external works');
  }
  
  // Determine eligibility
  let eligibility: 'likely-eligible' | 'borderline' | 'unlikely-eligible';
  let confidence: 'high' | 'medium' | 'low';
  
  if (score >= 3) {
    eligibility = 'likely-eligible';
    confidence = 'medium'; // CLOPUD always has some uncertainty
  } else if (score >= 0) {
    eligibility = 'borderline';
    confidence = 'low';
  } else {
    eligibility = 'unlikely-eligible';
    confidence = score < -2 ? 'high' : 'medium';
  }
  
  return { eligibility, confidence, reasoning, keyTests };
}

/**
 * Generate CLEUD evidence requirements
 */
function generateCLEUDEvidence(
  development: string,
  context?: {
    evidenceAvailable?: string[];
  }
): {
  category: string;
  items: string[];
  weight: 'essential' | 'strongly-supportive' | 'helpful';
  tips: string[];
}[] {
  return [
    {
      category: 'Dated photographs',
      items: [
        'Photos showing development at different dates',
        'Photos with dateable features (newspapers, cars, seasonal indicators)',
        'Aerial photographs from historic imagery services',
        'Google Street View historic images'
      ],
      weight: 'essential',
      tips: [
        'Gather photos from throughout the 4-year period',
        'Include exterior showing context and date indicators',
        'Get copies from neighbors, family, estate agents'
      ]
    },
    {
      category: 'Statutory declarations',
      items: [
        'Sworn statement from property owner',
        'Statements from long-term neighbors',
        'Statements from contractors who did the work',
        'Statements from visitors/tradespeople'
      ],
      weight: 'essential',
      tips: [
        'Must be properly witnessed and signed',
        'Include specific dates and descriptions',
        'Multiple independent statements strengthen case'
      ]
    },
    {
      category: 'Documentary evidence',
      items: [
        'Building control records (if any)',
        'Council tax records showing dwelling',
        'Utility bills showing connection dates',
        'Insurance documents mentioning development',
        'Mortgage valuations describing property'
      ],
      weight: 'strongly-supportive',
      tips: [
        'Request historical records from utility companies',
        'Check home insurance for building descriptions',
        'Council records may show property as existing'
      ]
    },
    {
      category: 'Professional evidence',
      items: [
        'Surveyor\'s report on construction date',
        'Building control informal confirmation',
        'Estate agent particulars from period',
        'Planning history showing no enforcement'
      ],
      weight: 'helpful',
      tips: [
        'Surveyor can assess construction dating from materials/techniques',
        'Planning portal shows if enforcement was considered'
      ]
    }
  ];
}

/**
 * Generate CLOPUD evidence requirements
 */
function generateCLOPUDEvidence(
  development: string,
  context?: {
    developmentType?: string;
  }
): {
  category: string;
  items: string[];
  weight: 'essential' | 'strongly-supportive' | 'helpful';
  tips: string[];
}[] {
  return [
    {
      category: 'Scaled drawings',
      items: [
        'Existing floor plans and elevations',
        'Proposed floor plans and elevations',
        'Site plan showing property boundaries',
        'Roof plan if relevant'
      ],
      weight: 'essential',
      tips: [
        'Show compliance with all dimensional limits',
        'Mark clearly what is existing vs proposed',
        'Include measurements to boundaries'
      ]
    },
    {
      category: 'Site photographs',
      items: [
        'Current photographs of property',
        'Photos showing context and neighbors',
        'Photos of any existing structures'
      ],
      weight: 'essential',
      tips: [
        'Show property from all angles',
        'Include streetscene context'
      ]
    },
    {
      category: 'Compliance statement',
      items: [
        'Statement explaining PD class relied upon',
        'Demonstration of compliance with each limitation',
        'Confirmation of any exclusions not applying'
      ],
      weight: 'essential',
      tips: [
        'Reference specific GPDO Schedule 2 Part and Class',
        'Address each limitation methodically'
      ]
    },
    {
      category: 'Supporting documents',
      items: [
        'Title plan (to confirm boundaries)',
        'Conservation area map (if applicable)',
        'Article 4 direction check'
      ],
      weight: 'strongly-supportive',
      tips: [
        'Land Registry title shows exact boundaries',
        'Camden website has conservation area maps',
        'Request Article 4 confirmation from LPA'
      ]
    }
  ];
}

/**
 * Generate application process
 */
function generateApplicationProcess(
  certificateType: 'CLEUD' | 'CLOPUD'
): { step: number; action: string; timing: string; notes: string }[] {
  const commonSteps = [
    { step: 1, action: 'Gather evidence and documentation', timing: '1-4 weeks', notes: 'More time for CLEUD to collect historic evidence' },
    { step: 2, action: 'Prepare application form', timing: '1-2 days', notes: 'Use Planning Portal standard form' },
    { step: 3, action: 'Commission/prepare drawings', timing: '1-2 weeks', notes: 'Scaled drawings essential' },
    { step: 4, action: 'Write supporting statement', timing: '2-3 days', notes: 'Explain case methodically' },
    { step: 5, action: 'Submit application and pay fee', timing: '1 day', notes: 'Via Planning Portal' },
    { step: 6, action: 'Validation by LPA', timing: '5-10 days', notes: 'May request additional info' },
    { step: 7, action: 'Officer assessment', timing: '4-6 weeks', notes: 'May arrange site visit' },
    { step: 8, action: 'Decision issued', timing: '8 weeks target', notes: 'Certificate granted or refused' }
  ];
  
  if (certificateType === 'CLEUD') {
    if (commonSteps[0]) commonSteps[0].notes = 'Allow extra time to gather historic evidence';
    if (commonSteps[6]) commonSteps[6].notes = 'Officer may request additional sworn statements';
  }
  
  return commonSteps;
}

/**
 * Generate risks
 */
function generateRisks(
  certificateType: 'CLEUD' | 'CLOPUD',
  assessment: { eligibility: string },
  context?: {
    listedBuilding?: boolean;
    conservationArea?: boolean;
    article4Direction?: boolean;
  }
): { risk: string; likelihood: 'high' | 'medium' | 'low'; mitigation: string }[] {
  const risks: { risk: string; likelihood: 'high' | 'medium' | 'low'; mitigation: string }[] = [];
  
  if (certificateType === 'CLEUD') {
    risks.push({
      risk: 'Insufficient evidence of continuous existence',
      likelihood: 'medium',
      mitigation: 'Gather multiple evidence types covering entire period'
    });
    risks.push({
      risk: 'LPA disputes evidence quality',
      likelihood: 'medium',
      mitigation: 'Use statutory declarations, dated photos, independent witnesses'
    });
    risks.push({
      risk: 'Discovery triggers enforcement consideration',
      likelihood: 'low',
      mitigation: 'Application made in good faith should not prejudice position'
    });
  } else {
    risks.push({
      risk: 'Development found not to comply with PD limits',
      likelihood: 'medium',
      mitigation: 'Careful measurement and compliance checking before application'
    });
    if (context?.article4Direction) {
      risks.push({
        risk: 'Article 4 Direction removes PD rights',
        likelihood: 'high',
        mitigation: 'Check Article 4 scope before applying - may need full planning'
      });
    }
  }
  
  if (context?.listedBuilding) {
    risks.push({
      risk: 'Listed Building Consent still required separately',
      likelihood: 'high',
      mitigation: 'CLEUD does not remove LBC requirement - seek advice on LBC'
    });
  }
  
  if (assessment.eligibility === 'unlikely-eligible') {
    risks.push({
      risk: 'Application fee non-refundable if refused',
      likelihood: 'high',
      mitigation: 'Consider pre-application advice before applying'
    });
  }
  
  return risks;
}

/**
 * Generate timeline
 */
function generateTimeline(certificateType: 'CLEUD' | 'CLOPUD'): {
  preparation: string;
  determination: string;
  total: string;
} {
  return {
    preparation: certificateType === 'CLEUD' ? '2-6 weeks' : '1-3 weeks',
    determination: '8 weeks statutory target',
    total: certificateType === 'CLEUD' ? '10-14 weeks' : '9-11 weeks'
  };
}

/**
 * Calculate fees
 */
function calculateFees(
  certificateType: 'CLEUD' | 'CLOPUD',
  development: string
): { type: string; amount: number; notes: string } {
  // 2024 fees - same as equivalent planning application
  const isHouseholder = development.toLowerCase().includes('extension') ||
                        development.toLowerCase().includes('dwelling') ||
                        development.toLowerCase().includes('house');
  
  return {
    type: `${certificateType} - ${isHouseholder ? 'Householder' : 'Other'}`,
    amount: isHouseholder ? 289 : 578,
    notes: 'Same fee as equivalent planning application - non-refundable'
  };
}

/**
 * Generate alternatives if certificate unlikely
 */
function generateAlternatives(
  certificateType: 'CLEUD' | 'CLOPUD',
  development: string,
  context?: {
    article4Direction?: boolean;
    conservationArea?: boolean;
    listedBuilding?: boolean;
  }
): string[] {
  const alternatives: string[] = [];
  
  if (certificateType === 'CLEUD') {
    alternatives.push('Submit retrospective planning application');
    alternatives.push('Seek pre-application advice on regularization');
    alternatives.push('Consider partial removal/modification if needed');
  } else {
    alternatives.push('Submit householder planning application');
    if (context?.article4Direction) {
      alternatives.push('Article 4 application (planning permission required)');
    }
    alternatives.push('Seek pre-application advice on modified scheme');
  }
  
  if (context?.listedBuilding) {
    alternatives.push('Listed Building Consent application (separate process)');
    alternatives.push('Consult conservation officer before proceeding');
  }
  
  return alternatives;
}

/**
 * Get permitted development information
 */
async function getPermittedDevelopmentInfo(
  developmentType: string
): Promise<{
  class: string;
  description: string;
  limitations: string[];
  excluded: string[];
  requirements: string[];
  hampsteadNotes: string[];
} | null> {
  const pdInfo = PERMITTED_DEVELOPMENT[developmentType];
  
  if (!pdInfo) {
    return null;
  }
  
  return {
    ...pdInfo,
    hampsteadNotes: [
      'Most of Hampstead (NW3, NW11) covered by Article 4 Directions',
      'Article 4 removes many PD rights - check specific address',
      'Conservation areas have additional restrictions',
      'Pre-application advice strongly recommended before relying on PD'
    ]
  };
}

export default {
  assessCertificateEligibility,
  getPermittedDevelopmentInfo
};
