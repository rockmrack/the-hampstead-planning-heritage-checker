/**
 * Archaeology Assessment Service
 * 
 * Provides archaeological assessment guidance for development
 * projects in the Hampstead area.
 */

interface ArchaeologyProject {
  groundworks?: string;
  excavationDepth?: number;
  basementProposed?: boolean;
  siteArea?: number;
  previousDevelopment?: boolean;
  historicBuilding?: boolean;
}

interface ArchaeologicalPotential {
  period: string;
  description: string;
  likelihood: 'low' | 'medium' | 'high';
  significance: string;
}

interface DeskBasedAssessment {
  scope: string[];
  sources: string[];
  deliverables: string[];
  cost: string;
  duration: string;
}

interface FieldEvaluation {
  type: string;
  purpose: string;
  methods: string[];
  cost: string;
  duration: string;
}

interface MitigationStrategy {
  strategy: string;
  trigger: string;
  requirements: string[];
  cost: string;
}

interface ArchaeologyAssessment {
  address: string;
  postcode: string;
  projectType: string;
  archaeologicalPotential: 'low' | 'medium' | 'high';
  inArchaeologyPriorityArea: boolean;
  potentialPeriods: ArchaeologicalPotential[];
  assessmentRequired: {
    deskBased: boolean;
    fieldEvaluation: boolean;
    watching: boolean;
    reasoning: string[];
  };
  deskBasedAssessment: DeskBasedAssessment;
  fieldEvaluation: FieldEvaluation[];
  mitigationOptions: MitigationStrategy[];
  glaacGuidance: {
    requirement: string;
    notes: string;
  }[];
  planningConditions: {
    condition: string;
    timing: string;
    details: string;
  }[];
  localContext: {
    factor: string;
    relevance: string;
  }[];
  timeline: {
    phase: string;
    duration: string;
    activities: string[];
  }[];
  costs: {
    item: string;
    range: string;
    notes: string;
  }[];
  recommendations: string[];
}

// Archaeological Priority Areas in Hampstead area
const AREA_ARCHAEOLOGICAL_PRIORITY: Record<string, {
  inAPA: boolean;
  apaName?: string;
  potential: 'low' | 'medium' | 'high';
  notes: string;
}> = {
  'NW3': {
    inAPA: true,
    apaName: 'Hampstead Village',
    potential: 'high',
    notes: 'Medieval and post-medieval settlement. Roman finds on Heath. Well House and spa history.'
  },
  'NW6': {
    inAPA: false,
    potential: 'low',
    notes: 'Primarily Victorian/Edwardian development. Limited earlier settlement evidence.'
  },
  'NW8': {
    inAPA: false,
    potential: 'medium',
    notes: 'Regency and Victorian development. Potential for earlier finds near Regents Park.'
  },
  'NW11': {
    inAPA: false,
    potential: 'low',
    notes: 'Developed as Hampstead Garden Suburb from 1907. Agricultural land before.'
  }
};

// Archaeological periods relevant to Camden
const ARCHAEOLOGICAL_PERIODS: Record<string, {
  dates: string;
  camdenRelevance: string;
  potentialFinds: string[];
}> = {
  'prehistoric': {
    dates: 'Before AD 43',
    camdenRelevance: 'Limited evidence - occasional flint finds',
    potentialFinds: ['Flint tools', 'Worked stone', 'Buried land surfaces']
  },
  'roman': {
    dates: 'AD 43-410',
    camdenRelevance: 'Roman road through area. Finds on Hampstead Heath',
    potentialFinds: ['Pottery', 'Coins', 'Building materials', 'Burials']
  },
  'medieval': {
    dates: 'AD 410-1540',
    camdenRelevance: 'Hampstead manor and village. Church origins',
    potentialFinds: ['Pottery', 'Building remains', 'Wells', 'Boundaries']
  },
  'post-medieval': {
    dates: 'AD 1540-1900',
    camdenRelevance: 'Spa development, Georgian/Victorian expansion',
    potentialFinds: ['Wells', 'Cellars', 'Industrial remains', 'Gardens']
  },
  'modern': {
    dates: 'AD 1900-present',
    camdenRelevance: 'WWII features possible',
    potentialFinds: ['Air raid shelters', 'Bomb damage', 'Military features']
  }
};

function extractOutcode(postcode: string): string {
  const cleaned = postcode.toUpperCase().replace(/\s+/g, '');
  const match = cleaned.match(/^([A-Z]{1,2}\d{1,2})/);
  return match && match[1] ? match[1] : 'NW3';
}

function getArchaeologicalPotential(
  postcode: string,
  projectDetails: ArchaeologyProject
): 'low' | 'medium' | 'high' {
  const outcode = extractOutcode(postcode);
  const defaultArea = AREA_ARCHAEOLOGICAL_PRIORITY['NW3']!;
  const areaPriority = AREA_ARCHAEOLOGICAL_PRIORITY[outcode] || defaultArea;
  
  let potential: 'low' | 'medium' | 'high' = areaPriority.potential;

  // Adjust based on project details
  if (projectDetails.basementProposed) {
    if (potential === 'low') potential = 'medium';
    if (potential === 'medium') potential = 'high';
  }

  if (projectDetails.excavationDepth && projectDetails.excavationDepth > 2) {
    if (potential === 'low') potential = 'medium';
  }

  if (projectDetails.historicBuilding) {
    if (potential === 'low') potential = 'medium';
    if (potential === 'medium') potential = 'high';
  }

  // Previous development may have truncated archaeology
  if (projectDetails.previousDevelopment) {
    if (potential === 'high') potential = 'medium';
  }

  return potential;
}

function getPotentialPeriods(postcode: string): ArchaeologicalPotential[] {
  const outcode = extractOutcode(postcode);
  const periods: ArchaeologicalPotential[] = [];
  const defaultArea = AREA_ARCHAEOLOGICAL_PRIORITY['NW3']!;
  const areaPriority = AREA_ARCHAEOLOGICAL_PRIORITY[outcode] || defaultArea;

  if (outcode === 'NW3') {
    const defaultMedieval = ARCHAEOLOGICAL_PERIODS['medieval']!;
    const medievalPeriod = ARCHAEOLOGICAL_PERIODS['medieval'] || defaultMedieval;
    periods.push({
      period: 'Medieval',
      description: 'Hampstead manor and village settlement',
      likelihood: 'medium',
      significance: 'High - core of historic settlement'
    });

    const defaultPostMedieval = ARCHAEOLOGICAL_PERIODS['post-medieval']!;
    const postMedievalPeriod = ARCHAEOLOGICAL_PERIODS['post-medieval'] || defaultPostMedieval;
    periods.push({
      period: 'Post-Medieval',
      description: 'Spa town development, Georgian expansion',
      likelihood: 'high',
      significance: 'Medium-High - well-preserved remains possible'
    });

    const defaultRoman = ARCHAEOLOGICAL_PERIODS['roman']!;
    const romanPeriod = ARCHAEOLOGICAL_PERIODS['roman'] || defaultRoman;
    periods.push({
      period: 'Roman',
      description: 'Road corridor and Heath finds',
      likelihood: 'low',
      significance: 'High if present'
    });
  } else {
    const defaultPostMedieval = ARCHAEOLOGICAL_PERIODS['post-medieval']!;
    const postMedievalPeriod = ARCHAEOLOGICAL_PERIODS['post-medieval'] || defaultPostMedieval;
    periods.push({
      period: 'Post-Medieval/Victorian',
      description: 'Urban expansion and development',
      likelihood: areaPriority.potential === 'low' ? 'medium' : 'high',
      significance: 'Medium - depends on specific features'
    });
  }

  // Modern period for all areas
  periods.push({
    period: 'Modern (WWII)',
    description: 'Air raid shelters and wartime features',
    likelihood: 'low',
    significance: 'Low-Medium'
  });

  return periods;
}

function getDeskBasedAssessment(
  potential: 'low' | 'medium' | 'high'
): DeskBasedAssessment {
  return {
    scope: [
      'Historic Environment Record (HER) search',
      'Historic map regression',
      'Documentary research',
      'Site visit and walkover survey',
      'Aerial photograph interpretation',
      'Assessment of significance and impact'
    ],
    sources: [
      'Greater London Historic Environment Record',
      'Camden Local Studies and Archives',
      'Historic England Archive',
      'British Geological Survey',
      'Ordnance Survey historic maps',
      'London Archaeological Archive'
    ],
    deliverables: [
      'Archaeological Desk-Based Assessment',
      'Historic map overlays',
      'Assessment of archaeological potential',
      'Impact assessment',
      'Recommendations for further work'
    ],
    cost: potential === 'low' ? '£800-1,500' : potential === 'medium' ? '£1,200-2,500' : '£2,000-4,000',
    duration: '2-4 weeks'
  };
}

function getFieldEvaluations(
  potential: 'low' | 'medium' | 'high',
  projectDetails: ArchaeologyProject
): FieldEvaluation[] {
  const evaluations: FieldEvaluation[] = [];

  if (potential !== 'low' || projectDetails.basementProposed) {
    evaluations.push({
      type: 'Trial Trenching',
      purpose: 'Determine presence/absence and character of archaeology',
      methods: [
        'Machine excavation of evaluation trenches',
        'Hand excavation of features',
        'Recording and sampling',
        'Finds recovery and processing'
      ],
      cost: '£3,000-8,000',
      duration: '1-2 weeks fieldwork'
    });
  }

  if (potential === 'high') {
    evaluations.push({
      type: 'Building Recording',
      purpose: 'Record historic fabric before alteration',
      methods: [
        'Photographic survey',
        'Measured survey',
        'Written description',
        'Historical analysis'
      ],
      cost: '£1,500-5,000',
      duration: '1-2 weeks'
    });
  }

  // Watching brief often required
  evaluations.push({
    type: 'Archaeological Watching Brief',
    purpose: 'Monitor groundworks during construction',
    methods: [
      'Observation of all groundworks',
      'Recording of any finds/features',
      'Contingency for further work'
    ],
    cost: '£250-400 per day',
    duration: 'Duration of groundworks'
  });

  return evaluations;
}

function getMitigationOptions(): MitigationStrategy[] {
  return [
    {
      strategy: 'Preservation In Situ',
      trigger: 'Nationally important remains discovered',
      requirements: [
        'Redesign foundations to avoid archaeology',
        'Protective measures over deposits',
        'Long-term management plan'
      ],
      cost: 'Design changes variable'
    },
    {
      strategy: 'Archaeological Excavation',
      trigger: 'Significant remains that cannot be preserved',
      requirements: [
        'Full excavation prior to construction',
        'Detailed recording',
        'Post-excavation analysis',
        'Publication and archive deposition'
      ],
      cost: '£10,000-100,000+'
    },
    {
      strategy: 'Watching Brief',
      trigger: 'Low-medium potential, limited groundworks',
      requirements: [
        'Archaeologist present during groundworks',
        'Recording of any discoveries',
        'Report and archive'
      ],
      cost: '£2,000-10,000'
    },
    {
      strategy: 'Historic Building Recording',
      trigger: 'Alteration to historic building',
      requirements: [
        'Appropriate level of recording (I-IV)',
        'Before and during works',
        'Report and archive'
      ],
      cost: '£1,500-10,000'
    }
  ];
}

function getGLAACGuidance(): {
  requirement: string;
  notes: string;
}[] {
  return [
    {
      requirement: 'Archaeological Priority Areas',
      notes: 'Developments in APAs require desk-based assessment as minimum'
    },
    {
      requirement: 'Basement developments',
      notes: 'Special guidance for basements - assessment always required in APAs'
    },
    {
      requirement: 'Standing buildings',
      notes: 'Pre-1700 buildings require archaeological assessment'
    },
    {
      requirement: 'Conditions',
      notes: 'Standard conditions WSI-1, WSI-2 commonly applied'
    },
    {
      requirement: 'Consultation',
      notes: 'GLAAS consultation for applications in APAs'
    }
  ];
}

function getPlanningConditions(
  potential: 'low' | 'medium' | 'high',
  inAPA: boolean
): {
  condition: string;
  timing: string;
  details: string;
}[] {
  const conditions: {
    condition: string;
    timing: string;
    details: string;
  }[] = [];

  if (inAPA || potential !== 'low') {
    conditions.push({
      condition: 'Archaeological Written Scheme of Investigation (WSI)',
      timing: 'Pre-commencement',
      details: 'Approved programme of archaeological work'
    });

    conditions.push({
      condition: 'Site Investigation and Recording',
      timing: 'Before/during groundworks',
      details: 'Implementation of WSI requirements'
    });

    conditions.push({
      condition: 'Post-Investigation Assessment',
      timing: 'Within specified period',
      details: 'Assessment report and updated project design if needed'
    });

    conditions.push({
      condition: 'Publication and Archive',
      timing: 'Prior to occupation',
      details: 'Site archive deposited with LAARC'
    });
  }

  return conditions;
}

function getLocalContext(postcode: string): {
  factor: string;
  relevance: string;
}[] {
  const outcode = extractOutcode(postcode);
  const factors: { factor: string; relevance: string }[] = [];

  factors.push({
    factor: 'GLAAS consultation',
    relevance: 'Greater London Archaeological Advisory Service advises Camden'
  });

  factors.push({
    factor: 'Greater London HER',
    relevance: 'Historic England maintain the record of known archaeology'
  });

  const defaultArea = AREA_ARCHAEOLOGICAL_PRIORITY['NW3']!;
  const areaPriority = AREA_ARCHAEOLOGICAL_PRIORITY[outcode] || defaultArea;

  if (areaPriority.inAPA && areaPriority.apaName) {
    factors.push({
      factor: `Archaeological Priority Area: ${areaPriority.apaName}`,
      relevance: 'Enhanced archaeological requirements apply'
    });
  }

  factors.push({
    factor: areaPriority.notes,
    relevance: 'Local archaeological character'
  });

  if (outcode === 'NW3') {
    factors.push({
      factor: 'Hampstead historic core',
      relevance: 'Medieval origins, spa town history, significant potential'
    });
  }

  factors.push({
    factor: 'London Archaeological Archive (LAARC)',
    relevance: 'Archive destination for excavation records'
  });

  return factors;
}

async function assessArchaeology(
  address: string,
  postcode: string,
  projectType: string,
  projectDetails: ArchaeologyProject = {}
): Promise<ArchaeologyAssessment> {
  const outcode = extractOutcode(postcode);
  const defaultArea = AREA_ARCHAEOLOGICAL_PRIORITY['NW3']!;
  const areaPriority = AREA_ARCHAEOLOGICAL_PRIORITY[outcode] || defaultArea;

  // Archaeological potential
  const archaeologicalPotential = getArchaeologicalPotential(postcode, projectDetails);

  // In APA
  const inArchaeologyPriorityArea = areaPriority.inAPA;

  // Potential periods
  const potentialPeriods = getPotentialPeriods(postcode);

  // Assessment requirements
  const assessmentRequired = {
    deskBased: inArchaeologyPriorityArea || archaeologicalPotential !== 'low',
    fieldEvaluation: archaeologicalPotential === 'high' || Boolean(projectDetails.basementProposed && inArchaeologyPriorityArea),
    watching: archaeologicalPotential !== 'low' || inArchaeologyPriorityArea,
    reasoning: [
      inArchaeologyPriorityArea ? 'Site is in Archaeological Priority Area' : 'Site is not in Archaeological Priority Area',
      `Archaeological potential assessed as ${archaeologicalPotential}`,
      projectDetails.basementProposed ? 'Basement development increases impact' : '',
      projectDetails.historicBuilding ? 'Historic building requires assessment' : ''
    ].filter(r => r !== '')
  };

  // Desk-based assessment
  const deskBasedAssessment = getDeskBasedAssessment(archaeologicalPotential);

  // Field evaluation
  const fieldEvaluation = getFieldEvaluations(archaeologicalPotential, projectDetails);

  // Mitigation options
  const mitigationOptions = getMitigationOptions();

  // GLAAS guidance
  const glaacGuidance = getGLAACGuidance();

  // Planning conditions
  const planningConditions = getPlanningConditions(archaeologicalPotential, inArchaeologyPriorityArea);

  // Local context
  const localContext = getLocalContext(postcode);

  // Timeline
  const timeline = [
    {
      phase: 'Desk-Based Assessment',
      duration: deskBasedAssessment.duration,
      activities: deskBasedAssessment.scope
    }
  ];

  if (assessmentRequired.fieldEvaluation) {
    timeline.push({
      phase: 'Field Evaluation',
      duration: '3-6 weeks',
      activities: ['Trial trenching', 'Recording', 'Assessment']
    });
  }

  timeline.push({
    phase: 'Mitigation',
    duration: 'Variable',
    activities: ['As determined by evaluation results']
  });

  // Costs
  const costs = [
    {
      item: 'Desk-Based Assessment',
      range: deskBasedAssessment.cost,
      notes: 'Required if in APA'
    },
    {
      item: 'Trial Trenching',
      range: '£3,000-8,000',
      notes: 'If required by DBA'
    },
    {
      item: 'Watching Brief',
      range: '£2,000-10,000',
      notes: 'Depends on groundworks duration'
    },
    {
      item: 'Excavation (if needed)',
      range: '£10,000-100,000+',
      notes: 'If significant remains found'
    }
  ];

  // Recommendations
  const recommendations: string[] = [];
  
  recommendations.push('Commission DBA early - results inform planning application');
  
  if (inArchaeologyPriorityArea) {
    recommendations.push('GLAAS pre-application advice recommended');
  }

  if (projectDetails.basementProposed) {
    recommendations.push('Basement impact will be major consideration');
    recommendations.push('Consider archaeological implications early in design');
  }

  if (archaeologicalPotential === 'high') {
    recommendations.push('Build archaeological contingency into programme');
    recommendations.push('Allocate contingency budget for mitigation');
  }

  return {
    address,
    postcode,
    projectType,
    archaeologicalPotential,
    inArchaeologyPriorityArea,
    potentialPeriods,
    assessmentRequired,
    deskBasedAssessment,
    fieldEvaluation,
    mitigationOptions,
    glaacGuidance,
    planningConditions,
    localContext,
    timeline,
    costs,
    recommendations
  };
}

// Export the service
const archaeologyAssessment = {
  assessArchaeology,
  AREA_ARCHAEOLOGICAL_PRIORITY,
  ARCHAEOLOGICAL_PERIODS
};

export default archaeologyAssessment;
