/**
 * Construction Methodology Statement Service
 * 
 * Generates comprehensive construction methodology statements for planning
 * applications in Hampstead and surrounding conservation areas. Addresses
 * neighbor impact, site logistics, and heritage protection measures.
 * 
 * Coverage: NW1-NW11, N2, N6, N10 postcodes
 */

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

interface ConstructionProject {
  propertyType?: 'detached' | 'semi_detached' | 'terraced' | 'flat' | 'mansion';
  projectType?: 'extension' | 'loft' | 'basement' | 'new_build' | 'refurbishment' | 'demolition';
  siteSize?: number; // square meters
  projectDuration?: number; // months
  isConservationArea?: boolean;
  isListedBuilding?: boolean;
  hasSharedWalls?: boolean;
  accessType?: 'front' | 'rear' | 'side' | 'limited';
  nearbyProperties?: 'residential' | 'commercial' | 'mixed';
  streetType?: 'residential' | 'main_road' | 'pedestrianized';
}

interface WorkingHours {
  weekday: {
    start: string;
    end: string;
  };
  saturday: {
    start: string;
    end: string;
  };
  sunday: string;
  bankHolidays: string;
  noisyWorks: {
    start: string;
    end: string;
    restrictions: string[];
  };
}

interface DeliveryManagement {
  scheduledDeliveryWindows: string[];
  vehicleRestrictions: string[];
  loadingZone: string;
  materialStorage: string;
  parkingArrangements: string;
  trafficManagement: string[];
}

interface DustAndNoiseControl {
  dustMeasures: string[];
  noiseMeasures: string[];
  vibrationMeasures: string[];
  monitoringCommitments: string[];
}

interface WasteManagement {
  wasteTypes: string[];
  segregationPlan: string;
  removalSchedule: string;
  recyclingTargets: string;
  hazardousMaterials: string;
}

interface NeighborCommunication {
  preStartNotification: string;
  ongoingCommunication: string[];
  complaintsProcess: string;
  emergencyContact: string;
  keyMilestoneNotifications: string[];
}

interface SiteManagement {
  hoarding: string;
  security: string;
  lighting: string;
  welfare: string;
  firstAid: string;
  fireProtection: string;
}

interface HeritageProtection {
  protectionMeasures: string[];
  monitoringRequirements: string[];
  restorationCommitments: string[];
  specialistInvolvement: string[];
}

interface EnvironmentalProtection {
  drainageProtection: string[];
  treeProtection: string[];
  wildlifeConsiderations: string[];
  contaminationManagement: string[];
}

interface ConstructionMethodologyAssessment {
  summary: MethodologySummary;
  workingHours: WorkingHours;
  deliveryManagement: DeliveryManagement;
  dustAndNoiseControl: DustAndNoiseControl;
  wasteManagement: WasteManagement;
  neighborCommunication: NeighborCommunication;
  siteManagement: SiteManagement;
  heritageProtection: HeritageProtection;
  environmentalProtection: EnvironmentalProtection;
  constructionPhases: ConstructionPhase[];
  healthAndSafety: HealthAndSafety;
  complianceCommitments: string[];
  planningConditionsSuggested: string[];
}

interface MethodologySummary {
  projectDescription: string;
  estimatedDuration: string;
  keyConsiderations: string[];
  mainChallenges: string[];
  mitigationApproach: string;
}

interface ConstructionPhase {
  phase: string;
  duration: string;
  keyActivities: string[];
  impacts: string[];
  mitigations: string[];
}

interface HealthAndSafety {
  cdmRequirements: string;
  principalContractor: string;
  siteInduction: string;
  riskAssessments: string[];
  emergencyProcedures: string[];
}

// =============================================================================
// CONSTANTS
// =============================================================================

const CAMDEN_WORKING_HOURS = {
  weekday: { start: '08:00', end: '18:00' },
  saturday: { start: '08:00', end: '13:00' },
  sunday: 'No work permitted',
  bankHolidays: 'No work permitted'
};

const BARNET_WORKING_HOURS = {
  weekday: { start: '08:00', end: '18:00' },
  saturday: { start: '08:00', end: '13:00' },
  sunday: 'No work permitted',
  bankHolidays: 'No work permitted'
};

const NOISY_WORK_RESTRICTIONS = [
  'Demolition and breaking out',
  'Piling and ground works',
  'Power tools on external surfaces',
  'Deliveries requiring crane/hiab',
  'Concrete pumping'
];

// =============================================================================
// MAIN SERVICE FUNCTION
// =============================================================================

async function generateMethodologyStatement(
  address: string,
  postcode: string,
  projectType: string,
  projectDetails: ConstructionProject = {}
): Promise<ConstructionMethodologyAssessment> {
  const summary = generateSummary(projectType, projectDetails);
  const workingHours = determineWorkingHours(postcode, projectDetails);
  const deliveryManagement = planDeliveryManagement(projectDetails);
  const dustAndNoiseControl = planDustAndNoiseControl(projectDetails);
  const wasteManagement = planWasteManagement(projectDetails);
  const neighborCommunication = planNeighborCommunication(projectDetails);
  const siteManagement = planSiteManagement(projectDetails);
  const heritageProtection = planHeritageProtection(projectDetails);
  const environmentalProtection = planEnvironmentalProtection(projectDetails);
  const constructionPhases = defineConstructionPhases(projectType, projectDetails);
  const healthAndSafety = defineHealthAndSafety(projectDetails);
  const complianceCommitments = generateComplianceCommitments(postcode);
  const planningConditionsSuggested = suggestPlanningConditions(projectDetails);

  return {
    summary,
    workingHours,
    deliveryManagement,
    dustAndNoiseControl,
    wasteManagement,
    neighborCommunication,
    siteManagement,
    heritageProtection,
    environmentalProtection,
    constructionPhases,
    healthAndSafety,
    complianceCommitments,
    planningConditionsSuggested
  };
}

// =============================================================================
// SUMMARY GENERATION
// =============================================================================

function generateSummary(
  projectType: string,
  projectDetails: ConstructionProject
): MethodologySummary {
  const duration = projectDetails.projectDuration || estimateDuration(projectType);
  const isConservation = Boolean(projectDetails.isConservationArea);
  const isListed = Boolean(projectDetails.isListedBuilding);

  const challenges: string[] = [];
  if (isConservation) challenges.push('Conservation area constraints');
  if (isListed) challenges.push('Listed building requirements');
  if (projectDetails.hasSharedWalls) challenges.push('Party wall considerations');
  if (projectDetails.accessType === 'limited') challenges.push('Restricted site access');
  if (projectType === 'basement') challenges.push('Deep excavation management');

  return {
    projectDescription: `${projectType.replace('_', ' ')} works at ${projectDetails.propertyType || 'residential'} property`,
    estimatedDuration: `${duration} months`,
    keyConsiderations: [
      'Minimizing disruption to neighboring properties',
      'Maintaining safe pedestrian and vehicular access',
      'Protecting the character of the area',
      'Compliance with local authority requirements',
      'Environmental protection measures'
    ],
    mainChallenges: challenges.length > 0 ? challenges : ['Standard residential construction challenges'],
    mitigationApproach: 'Comprehensive planning, proactive communication, and robust site management'
  };
}

function estimateDuration(projectType: string): number {
  const durations: Record<string, number> = {
    extension: 4,
    loft: 3,
    basement: 12,
    new_build: 18,
    refurbishment: 6,
    demolition: 2
  };
  return durations[projectType] || 6;
}

// =============================================================================
// WORKING HOURS
// =============================================================================

function determineWorkingHours(
  postcode: string,
  projectDetails: ConstructionProject
): WorkingHours {
  const postcodePrefix = (postcode.split(' ')[0] || postcode).toUpperCase();
  const isCamden = postcodePrefix.startsWith('NW') && ['NW1', 'NW2', 'NW3', 'NW5', 'NW6'].includes(postcodePrefix);
  const hours = isCamden ? CAMDEN_WORKING_HOURS : BARNET_WORKING_HOURS;

  return {
    weekday: hours.weekday,
    saturday: hours.saturday,
    sunday: hours.sunday,
    bankHolidays: hours.bankHolidays,
    noisyWorks: {
      start: '09:00',
      end: '17:00',
      restrictions: NOISY_WORK_RESTRICTIONS
    }
  };
}

// =============================================================================
// DELIVERY MANAGEMENT
// =============================================================================

function planDeliveryManagement(projectDetails: ConstructionProject): DeliveryManagement {
  const isRestricted = projectDetails.streetType === 'residential' || projectDetails.accessType === 'limited';

  return {
    scheduledDeliveryWindows: isRestricted
      ? ['09:30 - 11:30', '14:00 - 16:00 (avoiding school run times)']
      : ['08:00 - 17:00'],
    vehicleRestrictions: [
      'Maximum vehicle size appropriate to street width',
      'No articulated lorries on residential streets',
      'Skip vehicles to be exchanged outside peak hours',
      'Concrete deliveries scheduled for early morning'
    ],
    loadingZone: 'Designated loading bay within site hoarding where possible',
    materialStorage: 'All materials stored within site boundary; no storage on public highway',
    parkingArrangements: 'Contractor parking off-site; no worker vehicles on adjacent streets',
    trafficManagement: [
      'Banksmen for all delivery movements',
      'Temporary traffic management for large deliveries if required',
      'Coordination with local traffic authority',
      'Clear signage for pedestrians'
    ]
  };
}

// =============================================================================
// DUST AND NOISE CONTROL
// =============================================================================

function planDustAndNoiseControl(projectDetails: ConstructionProject): DustAndNoiseControl {
  const isBasement = projectDetails.projectType === 'basement';
  const isDemolition = projectDetails.projectType === 'demolition';

  return {
    dustMeasures: [
      'Damping down of all excavation and demolition works',
      'Covered skips and sealed waste containers',
      'Wheel washing facilities at site exit',
      'Regular road sweeping',
      'Sheeting of all vehicles carrying loose materials',
      ...(isDemolition ? ['Dust screens during demolition phases', 'Misting equipment for heavy dust operations'] : [])
    ],
    noiseMeasures: [
      'Use of modern, well-maintained plant and equipment',
      'All equipment fitted with appropriate silencers',
      'Noisy works restricted to permitted hours',
      'Acoustic barriers around noisy operations where practical',
      'No radios or music on site',
      ...(isBasement ? ['Acoustic enclosure for piling/boring equipment'] : [])
    ],
    vibrationMeasures: [
      ...(isBasement ? [
        'Pre-condition survey of adjacent properties',
        'Vibration monitoring during ground works',
        'Use of low-vibration equipment where available',
        'Vibration limits set per BS 5228'
      ] : [
        'Standard vibration management procedures',
        'Awareness of party wall structures'
      ])
    ],
    monitoringCommitments: [
      'Daily site inspections for dust and noise',
      'Noise monitoring at nearest sensitive receptor',
      'Records maintained and available for inspection',
      'Immediate response to any complaints'
    ]
  };
}

// =============================================================================
// WASTE MANAGEMENT
// =============================================================================

function planWasteManagement(projectDetails: ConstructionProject): WasteManagement {
  return {
    wasteTypes: [
      'General construction waste',
      'Timber and wood products',
      'Metals (separated for recycling)',
      'Plasterboard (separated for recycling)',
      'Packaging materials',
      'Excavated soil/spoil',
      'Concrete and masonry'
    ],
    segregationPlan: 'Separate containers for recyclable materials, general waste, and hazardous materials',
    removalSchedule: 'Weekly skip collection; more frequent during peak demolition/excavation phases',
    recyclingTargets: 'Minimum 90% diversion from landfill through recycling and recovery',
    hazardousMaterials: 'Asbestos survey pre-demolition; licensed contractor for any ACM removal; safe storage of paints, solvents, fuels'
  };
}

// =============================================================================
// NEIGHBOR COMMUNICATION
// =============================================================================

function planNeighborCommunication(projectDetails: ConstructionProject): NeighborCommunication {
  return {
    preStartNotification: 'Written notification to all adjacent properties minimum 14 days before works commence',
    ongoingCommunication: [
      'Monthly newsletter update to immediate neighbors',
      'Notice board at site entrance with current activities',
      'Direct contact number for site manager',
      'Email updates for major milestones'
    ],
    complaintsProcess: '24-hour response commitment; site manager contactable during working hours; escalation to project manager',
    emergencyContact: 'Emergency contact number provided to all neighbors and local authority',
    keyMilestoneNotifications: [
      'Start of demolition works',
      'Commencement of excavation',
      'Concrete pours',
      'Crane lifts',
      'Major deliveries',
      'Completion of noisy works'
    ]
  };
}

// =============================================================================
// SITE MANAGEMENT
// =============================================================================

function planSiteManagement(projectDetails: ConstructionProject): SiteManagement {
  const isNewBuild = projectDetails.projectType === 'new_build';

  return {
    hoarding: isNewBuild
      ? 'Full site hoarding to 2.4m height; maintained in good condition; anti-graffiti finish'
      : 'Scaffold wrap or temporary hoarding as appropriate to works',
    security: '24/7 site security; CCTV monitoring; intruder alarms; secure tool storage',
    lighting: 'Task lighting only; no upward light spill; motion sensors for security lighting',
    welfare: 'Self-contained welfare unit; toilet facilities; drying room; canteen',
    firstAid: 'Trained first aider on site at all times; first aid kit maintained; nearest A&E identified',
    fireProtection: 'Fire extinguishers throughout; hot works permit system; no smoking on site'
  };
}

// =============================================================================
// HERITAGE PROTECTION
// =============================================================================

function planHeritageProtection(projectDetails: ConstructionProject): HeritageProtection {
  const isListed = Boolean(projectDetails.isListedBuilding);
  const isConservation = Boolean(projectDetails.isConservationArea);

  if (!isListed && !isConservation) {
    return {
      protectionMeasures: ['Standard care for existing building fabric'],
      monitoringRequirements: ['Visual inspection for any damage'],
      restorationCommitments: ['Making good of any accidental damage'],
      specialistInvolvement: ['None required']
    };
  }

  return {
    protectionMeasures: [
      'Photographic record of all original features before works',
      'Physical protection to retained features (boarding, padding)',
      'Careful removal and secure storage of any features to be reinstated',
      'Dust barriers to protect internal historic fabric',
      ...(isListed ? [
        'Supervision of demolition by heritage specialist',
        'Retention of original materials for analysis/reuse'
      ] : [])
    ],
    monitoringRequirements: [
      'Weekly inspection by project architect',
      ...(isListed ? [
        'Monthly inspection by conservation officer (by agreement)',
        'Structural monitoring if near historic fabric'
      ] : [])
    ],
    restorationCommitments: [
      'Like-for-like restoration of any disturbed historic fabric',
      'Use of traditional materials and techniques',
      'Retention of original features wherever possible'
    ],
    specialistInvolvement: [
      ...(isListed ? [
        'Conservation architect oversight',
        'Historic building surveyor',
        'Specialist craftsmen for restoration works'
      ] : [
        'Heritage awareness training for all site operatives'
      ])
    ]
  };
}

// =============================================================================
// ENVIRONMENTAL PROTECTION
// =============================================================================

function planEnvironmentalProtection(projectDetails: ConstructionProject): EnvironmentalProtection {
  return {
    drainageProtection: [
      'All drains protected from silt and debris',
      'Silt traps installed at site exits',
      'No discharge of construction water to drainage system',
      'Spill kits available for fuel/oil spills'
    ],
    treeProtection: [
      'TPO and conservation area trees identified and protected',
      'Root protection zones established per BS 5837',
      'No storage or trafficking within RPZ',
      'Arboricultural supervision for any works near trees'
    ],
    wildlifeConsiderations: [
      'Pre-commencement check for nesting birds',
      'Bat survey if required by condition',
      'Working method statement for any identified species',
      'No clearance of vegetation during bird nesting season (March-August) without ecologist check'
    ],
    contaminationManagement: [
      'Fuel stored in bunded containers',
      'Spill response procedures in place',
      'Unknown ground conditions protocol',
      'Proper disposal of any contaminated materials'
    ]
  };
}

// =============================================================================
// CONSTRUCTION PHASES
// =============================================================================

function defineConstructionPhases(
  projectType: string,
  projectDetails: ConstructionProject
): ConstructionPhase[] {
  const phases: ConstructionPhase[] = [];

  // Setup phase
  phases.push({
    phase: 'Site Setup',
    duration: '1-2 weeks',
    keyActivities: ['Hoarding installation', 'Welfare unit delivery', 'Service connections', 'Access arrangements'],
    impacts: ['Increased activity', 'Delivery vehicles'],
    mitigations: ['Pre-notification to neighbors', 'Early morning deliveries']
  });

  if (projectType === 'demolition' || projectType === 'new_build' || projectType === 'basement') {
    phases.push({
      phase: 'Demolition/Excavation',
      duration: projectType === 'basement' ? '8-12 weeks' : '2-4 weeks',
      keyActivities: ['Soft strip', 'Structural demolition', 'Excavation', 'Spoil removal'],
      impacts: ['Noise', 'Dust', 'Heavy vehicles', 'Vibration'],
      mitigations: ['Dust suppression', 'Noise monitoring', 'Restricted hours', 'Vehicle scheduling']
    });
  }

  phases.push({
    phase: 'Structural Works',
    duration: '4-8 weeks',
    keyActivities: ['Foundations', 'Structural frame', 'Brickwork', 'Roofing'],
    impacts: ['Crane/lifting', 'Concrete deliveries', 'Scaffolding'],
    mitigations: ['Advance notice of crane lifts', 'Early concrete pours', 'Safe scaffold design']
  });

  phases.push({
    phase: 'Building Envelope',
    duration: '2-4 weeks',
    keyActivities: ['Windows', 'External doors', 'Weatherproofing', 'External finishes'],
    impacts: ['Scaffolding access', 'Material deliveries'],
    mitigations: ['Coordinated deliveries', 'Maintained access']
  });

  phases.push({
    phase: 'Internal Fit-out',
    duration: '6-12 weeks',
    keyActivities: ['First fix services', 'Plastering', 'Second fix', 'Decorations'],
    impacts: ['Reduced external activity', 'Continuing deliveries'],
    mitigations: ['Quieter phase', 'Standard working hours']
  });

  phases.push({
    phase: 'External Works & Completion',
    duration: '2-4 weeks',
    keyActivities: ['Landscaping', 'Driveways', 'Boundary works', 'Snagging'],
    impacts: ['Outdoor activity', 'Final deliveries'],
    mitigations: ['Coordinated completion', 'Site clearance']
  });

  return phases;
}

// =============================================================================
// HEALTH AND SAFETY
// =============================================================================

function defineHealthAndSafety(projectDetails: ConstructionProject): HealthAndSafety {
  const isNotifiable = (projectDetails.projectDuration || 0) > 30 ||
    projectDetails.projectType === 'basement' ||
    projectDetails.projectType === 'new_build';

  return {
    cdmRequirements: isNotifiable
      ? 'F10 notification to HSE; CDM Coordinator appointed; Construction Phase Plan required'
      : 'CDM 2015 applies; Principal Contractor duties assigned',
    principalContractor: 'Competent contractor with relevant experience and CSCS qualified workforce',
    siteInduction: 'All operatives to receive site-specific induction before commencing work',
    riskAssessments: [
      'Working at height',
      'Manual handling',
      'Excavations',
      'Electrical safety',
      'Fire risk',
      'Dust and hazardous substances',
      'Plant and equipment'
    ],
    emergencyProcedures: [
      'Emergency evacuation plan',
      'Fire assembly point identified',
      'First aid arrangements',
      'Emergency services access maintained',
      'Incident reporting procedures'
    ]
  };
}

// =============================================================================
// COMPLIANCE COMMITMENTS
// =============================================================================

function generateComplianceCommitments(postcode: string): string[] {
  const postcodePrefix = (postcode.split(' ')[0] || postcode).toUpperCase();
  const authority = postcodePrefix.startsWith('NW') && ['NW1', 'NW2', 'NW3', 'NW5', 'NW6'].includes(postcodePrefix)
    ? 'Camden Council'
    : 'Barnet Council';

  return [
    `Compliance with ${authority} Code of Construction Practice`,
    'Adherence to all planning conditions',
    'Compliance with Building Regulations',
    'CDM 2015 compliance',
    'Party Wall Act compliance where applicable',
    'Environmental protection legislation',
    'Health and Safety at Work Act 1974',
    'Control of Pollution Act 1974',
    'Noise and Statutory Nuisance Act 1993'
  ];
}

// =============================================================================
// PLANNING CONDITIONS
// =============================================================================

function suggestPlanningConditions(projectDetails: ConstructionProject): string[] {
  const conditions: string[] = [
    'Construction Management Plan to be submitted and approved',
    'Working hours restricted as specified'
  ];

  if (projectDetails.isConservationArea) {
    conditions.push('Heritage protection measures to be implemented');
  }

  if (projectDetails.projectType === 'basement') {
    conditions.push('Basement construction method statement required');
    conditions.push('Structural methodology to be approved');
  }

  if (projectDetails.projectType === 'demolition' || projectDetails.projectType === 'new_build') {
    conditions.push('Demolition method statement required');
  }

  conditions.push('Dust and noise mitigation measures to be maintained');
  conditions.push('Wheel washing facilities to be provided');

  return conditions;
}

// =============================================================================
// EXPORTS
// =============================================================================

const constructionMethodology = {
  generateMethodologyStatement,
  CAMDEN_WORKING_HOURS,
  BARNET_WORKING_HOURS
};

export default constructionMethodology;
