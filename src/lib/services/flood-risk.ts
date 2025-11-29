/**
 * Flood Risk Service
 * 
 * Provides flood risk assessment guidance for development projects
 * in the Hampstead area, including surface water and groundwater risks.
 */

interface FloodProject {
  siteArea?: number;
  impermeable?: number;
  basementProposed?: boolean;
  nearWatercourse?: boolean;
  existingDrainage?: string;
  proposedDrainage?: string;
  groundLevel?: string;
}

interface FloodZone {
  zone: string;
  description: string;
  probability: string;
  implications: string[];
}

interface SuDSRequirement {
  technique: string;
  applicability: string;
  benefits: string[];
  considerations: string[];
  cost: string;
}

interface FloodAssessment {
  address: string;
  postcode: string;
  projectType: string;
  floodZone: FloodZone;
  surfaceWaterRisk: {
    level: 'very-low' | 'low' | 'medium' | 'high';
    factors: string[];
    mitigations: string[];
  };
  groundwaterRisk: {
    level: 'low' | 'medium' | 'high';
    factors: string[];
    mitigations: string[];
  };
  fraRequired: {
    required: boolean;
    type: string;
    scope: string[];
    cost: string;
  };
  sudsRequirements: SuDSRequirement[];
  sequentialTest: {
    required: boolean;
    outcome: string;
    evidence: string[];
  };
  exceptionTest: {
    required: boolean;
    criteria: string[];
  };
  drainageStrategy: {
    hierarchy: string[];
    requirements: string[];
    calculations: string[];
  };
  planningRequirements: {
    requirement: string;
    documents: string[];
    consultees: string[];
  }[];
  localFactors: string[];
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

// Flood zones in Hampstead area
const AREA_FLOOD_RISK: Record<string, {
  predominantZone: string;
  surfaceWaterIssues: boolean;
  groundwaterIssues: boolean;
  criticalDrainageArea: boolean;
  notes: string;
}> = {
  'NW3': {
    predominantZone: 'Zone 1 (Low Probability)',
    surfaceWaterIssues: true,
    groundwaterIssues: true,
    criticalDrainageArea: true,
    notes: 'Hampstead has hilly topography - surface water flows to low points. Fleet River culverted beneath.'
  },
  'NW6': {
    predominantZone: 'Zone 1 (Low Probability)',
    surfaceWaterIssues: true,
    groundwaterIssues: false,
    criticalDrainageArea: true,
    notes: 'West Hampstead has historic flooding issues. Kilburn Brook culverted.'
  },
  'NW8': {
    predominantZone: 'Zone 1 (Low Probability)',
    surfaceWaterIssues: false,
    groundwaterIssues: false,
    criticalDrainageArea: false,
    notes: 'Relatively flat area with established drainage. Lower flood risk.'
  },
  'NW11': {
    predominantZone: 'Zone 1 (Low Probability)',
    surfaceWaterIssues: true,
    groundwaterIssues: true,
    criticalDrainageArea: false,
    notes: 'Parts near Brent River may have increased risk. Hampstead Heath ponds regulate flows.'
  }
};

// Flood zone definitions
const FLOOD_ZONES: Record<string, {
  description: string;
  probability: string;
  suitable: string[];
  unsuitable: string[];
}> = {
  'Zone 1': {
    description: 'Low Probability',
    probability: '<1 in 1000 annual probability',
    suitable: ['All development types'],
    unsuitable: []
  },
  'Zone 2': {
    description: 'Medium Probability',
    probability: '1 in 100 to 1 in 1000',
    suitable: ['Residential', 'Commercial', 'Infrastructure'],
    unsuitable: ['Highly vulnerable uses without exception test']
  },
  'Zone 3a': {
    description: 'High Probability',
    probability: '>1 in 100',
    suitable: ['Less vulnerable', 'Water compatible'],
    unsuitable: ['Highly vulnerable', 'More vulnerable without exception test']
  },
  'Zone 3b': {
    description: 'Functional Floodplain',
    probability: '>1 in 20',
    suitable: ['Water compatible', 'Essential infrastructure'],
    unsuitable: ['Most development']
  }
};

// SuDS techniques
const SUDS_TECHNIQUES: Record<string, {
  description: string;
  spaceTake: string;
  costPerM2: string;
  effectiveness: string;
}> = {
  'green-roof': {
    description: 'Vegetated roof surface for attenuation',
    spaceTake: 'Roof area',
    costPerM2: '£80-150',
    effectiveness: 'High for small rainfall events'
  },
  'rain-garden': {
    description: 'Planted depression for infiltration',
    spaceTake: 'Garden/landscape area',
    costPerM2: '£40-80',
    effectiveness: 'Medium-High'
  },
  'permeable-paving': {
    description: 'Porous surface for infiltration',
    spaceTake: 'Driveway/patio area',
    costPerM2: '£50-100',
    effectiveness: 'Medium'
  },
  'soakaway': {
    description: 'Underground infiltration structure',
    spaceTake: 'Underground',
    costPerM2: '£100-200',
    effectiveness: 'High where soil permits'
  },
  'attenuation-tank': {
    description: 'Underground storage with controlled release',
    spaceTake: 'Underground',
    costPerM2: '£150-300',
    effectiveness: 'High'
  },
  'rainwater-harvesting': {
    description: 'Storage for reuse',
    spaceTake: 'Tank space',
    costPerM2: '£50-100 per 1000L',
    effectiveness: 'Medium (depends on usage)'
  }
};

function extractOutcode(postcode: string): string {
  const cleaned = postcode.toUpperCase().replace(/\s+/g, '');
  const match = cleaned.match(/^([A-Z]{1,2}\d{1,2})/);
  return match && match[1] ? match[1] : 'NW3';
}

function getFloodZone(postcode: string): FloodZone {
  const outcode = extractOutcode(postcode);
  const defaultAreaRisk = AREA_FLOOD_RISK['NW3']!;
  const areaRisk = AREA_FLOOD_RISK[outcode] || defaultAreaRisk;
  const defaultFloodZone = FLOOD_ZONES['Zone 1']!;
  const zoneInfo = FLOOD_ZONES[areaRisk.predominantZone.split(' ')[0] + ' ' + areaRisk.predominantZone.split(' ')[1]] || defaultFloodZone;

  return {
    zone: areaRisk.predominantZone,
    description: zoneInfo.description,
    probability: zoneInfo.probability,
    implications: [
      `Site is in Flood ${areaRisk.predominantZone}`,
      areaRisk.notes,
      areaRisk.criticalDrainageArea ? 'Area is designated as Critical Drainage Area' : 'Not in Critical Drainage Area'
    ]
  };
}

function assessSurfaceWaterRisk(
  postcode: string,
  projectDetails: FloodProject
): {
  level: 'very-low' | 'low' | 'medium' | 'high';
  factors: string[];
  mitigations: string[];
} {
  const outcode = extractOutcode(postcode);
  const defaultAreaRisk = AREA_FLOOD_RISK['NW3']!;
  const areaRisk = AREA_FLOOD_RISK[outcode] || defaultAreaRisk;
  
  const factors: string[] = [];
  const mitigations: string[] = [];
  let riskScore = 0;

  // Area baseline
  if (areaRisk.surfaceWaterIssues) {
    riskScore += 2;
    factors.push('Area has known surface water flooding issues');
  }

  if (areaRisk.criticalDrainageArea) {
    riskScore += 1;
    factors.push('Site is in a Critical Drainage Area');
  }

  // Project-specific factors
  if (projectDetails.impermeable && projectDetails.impermeable > 50) {
    riskScore += 2;
    factors.push('High percentage of impermeable surfaces proposed');
    mitigations.push('SuDS required to manage additional runoff');
  }

  if (projectDetails.basementProposed) {
    riskScore += 1;
    factors.push('Basement development increases vulnerability');
    mitigations.push('Waterproofing and drainage strategy essential');
    mitigations.push('Consider pump chamber for basement drainage');
  }

  if (projectDetails.siteArea && projectDetails.siteArea > 100) {
    riskScore += 1;
    factors.push('Larger site area increases runoff management complexity');
  }

  // Determine level
  let level: 'very-low' | 'low' | 'medium' | 'high';
  if (riskScore <= 1) {
    level = 'very-low';
    mitigations.push('Standard good practice drainage sufficient');
  } else if (riskScore <= 3) {
    level = 'low';
    mitigations.push('SuDS recommended for betterment');
  } else if (riskScore <= 5) {
    level = 'medium';
    mitigations.push('SuDS required to demonstrate betterment');
    mitigations.push('May need FRA addressing surface water');
  } else {
    level = 'high';
    mitigations.push('Comprehensive drainage strategy required');
    mitigations.push('Full FRA required');
    mitigations.push('May need LLFA consultation');
  }

  return { level, factors, mitigations };
}

function assessGroundwaterRisk(
  postcode: string,
  projectDetails: FloodProject
): {
  level: 'low' | 'medium' | 'high';
  factors: string[];
  mitigations: string[];
} {
  const outcode = extractOutcode(postcode);
  const defaultAreaRisk = AREA_FLOOD_RISK['NW3']!;
  const areaRisk = AREA_FLOOD_RISK[outcode] || defaultAreaRisk;
  
  const factors: string[] = [];
  const mitigations: string[] = [];
  let level: 'low' | 'medium' | 'high' = 'low';

  if (areaRisk.groundwaterIssues) {
    factors.push('Area has known groundwater issues');
    level = 'medium';
  }

  if (projectDetails.basementProposed) {
    factors.push('Basement development encounters groundwater risk');
    level = level === 'low' ? 'medium' : 'high';
    mitigations.push('Groundwater investigation recommended');
    mitigations.push('Type C (drained) waterproofing system advised');
    mitigations.push('Pump chamber with backup power');
    mitigations.push('Basement Impact Assessment may be required');
  }

  if (outcode === 'NW3') {
    factors.push('Hampstead has perched water tables and springs');
    if (projectDetails.basementProposed) {
      level = 'high';
      mitigations.push('Consider impact on local water table and neighbors');
    }
  }

  if (level === 'low') {
    mitigations.push('Standard construction methods suitable');
  }

  return { level, factors, mitigations };
}

function getFRARequirements(
  postcode: string,
  projectType: string,
  projectDetails: FloodProject
): {
  required: boolean;
  type: string;
  scope: string[];
  cost: string;
} {
  const outcode = extractOutcode(postcode);
  const defaultAreaRisk = AREA_FLOOD_RISK['NW3']!;
  const areaRisk = AREA_FLOOD_RISK[outcode] || defaultAreaRisk;

  // FRA triggers
  const inZone1 = areaRisk.predominantZone.includes('Zone 1');
  const over1Ha = projectDetails.siteArea && projectDetails.siteArea > 10000;
  const inCDA = areaRisk.criticalDrainageArea;
  const hasBasement = projectDetails.basementProposed;

  if (!inZone1 || over1Ha) {
    return {
      required: true,
      type: 'Full Flood Risk Assessment',
      scope: [
        'Site-specific flood risk assessment',
        'Climate change allowances',
        'Mitigation measures',
        'Sequential/Exception test evidence',
        'Drainage strategy'
      ],
      cost: '£1,500-4,000'
    };
  }

  if (inCDA || hasBasement) {
    return {
      required: true,
      type: 'Drainage Strategy / FRA',
      scope: [
        'Surface water flood risk',
        'Drainage impact assessment',
        'SuDS proposals',
        'Basement flood risk (if applicable)'
      ],
      cost: '£800-2,000'
    };
  }

  return {
    required: false,
    type: 'Not Required',
    scope: ['Standard drainage design sufficient'],
    cost: '£0'
  };
}

function getSuDSRequirements(
  projectType: string,
  projectDetails: FloodProject
): SuDSRequirement[] {
  const techniques: SuDSRequirement[] = [];

  // Always recommend some SuDS
  if (projectDetails.siteArea && projectDetails.siteArea > 50) {
    techniques.push({
      technique: 'Permeable Paving',
      applicability: 'Driveways, patios, parking areas',
      benefits: [
        'Reduces runoff at source',
        'Natural filtration',
        'No loss of usable space'
      ],
      considerations: [
        'Higher initial cost than standard paving',
        'Requires maintenance (occasional brushing)',
        'May clog if heavy silt load'
      ],
      cost: '£50-100/m²'
    });
  }

  if (projectType.includes('extension') || projectType === 'new-build') {
    techniques.push({
      technique: 'Green Roof',
      applicability: 'Flat or low-pitched roofs on extensions',
      benefits: [
        'Attenuates rainfall',
        'Biodiversity enhancement',
        'Thermal insulation',
        'Visual amenity'
      ],
      considerations: [
        'Structural load implications',
        'Maintenance regime needed',
        'Not suitable for all roof types'
      ],
      cost: '£80-150/m²'
    });
  }

  techniques.push({
    technique: 'Rain Garden',
    applicability: 'Garden areas receiving roof/hardstanding runoff',
    benefits: [
      'Natural infiltration',
      'Visual amenity',
      'Habitat creation',
      'Low maintenance'
    ],
    considerations: [
      'Requires suitable soil conditions',
      'Space requirement',
      'Plant selection important'
    ],
    cost: '£40-80/m²'
  });

  techniques.push({
    technique: 'Rainwater Harvesting',
    applicability: 'All developments with roof area',
    benefits: [
      'Reduces mains water use',
      'Storage reduces peak flows',
      'Cost savings on water bills'
    ],
    considerations: [
      'Needs pump for some uses',
      'Tank sizing important',
      'Maintenance of filter required'
    ],
    cost: '£500-2,000 installed'
  });

  if (projectDetails.basementProposed || projectDetails.siteArea && projectDetails.siteArea > 200) {
    techniques.push({
      technique: 'Attenuation Tank',
      applicability: 'Where infiltration not possible or insufficient',
      benefits: [
        'Stores runoff underground',
        'Controlled release to sewer',
        'No surface space required'
      ],
      considerations: [
        'Requires flow control device',
        'May need Thames Water approval',
        'Higher cost'
      ],
      cost: '£150-300/m² of tank'
    });
  }

  return techniques;
}

function getDrainageHierarchy(): string[] {
  return [
    '1. Infiltration to ground (soakaways, infiltration trenches)',
    '2. Discharge to watercourse (if available and permitted)',
    '3. Discharge to surface water sewer (with attenuation)',
    '4. Discharge to combined sewer (last resort, with attenuation)'
  ];
}

function getLocalFactors(postcode: string): string[] {
  const outcode = extractOutcode(postcode);
  const factors: string[] = [];

  factors.push('Camden is Lead Local Flood Authority (LLFA) for surface water');
  factors.push('Thames Water is responsible for sewer flooding');
  factors.push('Environment Agency manages main river flood risk');

  if (outcode === 'NW3') {
    factors.push('Hampstead Heath ponds are flood control structures');
    factors.push('Fleet River runs beneath - historic flooding area');
    factors.push('Springs and groundwater common on hillside');
  }

  if (outcode === 'NW6') {
    factors.push('West Hampstead has had significant surface water flooding');
    factors.push('Kilburn Brook culverted beneath area');
    factors.push('Camden Critical Drainage Area designation');
  }

  factors.push('Basement developments may require Camden Basement Impact Assessment');
  factors.push('Thames Water pre-application consultation recommended');

  return factors;
}

async function assessFloodRisk(
  address: string,
  postcode: string,
  projectType: string,
  projectDetails: FloodProject = {}
): Promise<FloodAssessment> {
  // Flood zone
  const floodZone = getFloodZone(postcode);

  // Surface water risk
  const surfaceWaterRisk = assessSurfaceWaterRisk(postcode, projectDetails);

  // Groundwater risk
  const groundwaterRisk = assessGroundwaterRisk(postcode, projectDetails);

  // FRA requirements
  const fraRequired = getFRARequirements(postcode, projectType, projectDetails);

  // SuDS requirements
  const sudsRequirements = getSuDSRequirements(projectType, projectDetails);

  // Sequential test
  const sequentialTest = {
    required: !floodZone.zone.includes('Zone 1'),
    outcome: floodZone.zone.includes('Zone 1') ? 'Not required - Flood Zone 1' : 'Required - demonstrate no alternatives in lower flood zone',
    evidence: floodZone.zone.includes('Zone 1') ? [] : [
      'Search for alternative sites',
      'Evidence of site constraints',
      'Demonstrate development appropriate for flood zone'
    ]
  };

  // Exception test
  const exceptionTest = {
    required: false,
    criteria: floodZone.zone.includes('Zone 1') ? [] : [
      'Development provides wider sustainability benefits',
      'Development will be safe for its lifetime',
      'Will not increase flood risk elsewhere'
    ]
  };

  // Drainage strategy
  const drainageStrategy = {
    hierarchy: getDrainageHierarchy(),
    requirements: [
      'Greenfield runoff rate or betterment if brownfield',
      'Design for 1 in 100 year + climate change event',
      'Exceedance flow route planning',
      'Maintenance and adoption plan'
    ],
    calculations: [
      'Existing and proposed impermeable areas',
      'Greenfield runoff calculation (QBAR)',
      'Storage volume calculation',
      'Infiltration test results (if soakaway proposed)'
    ]
  };

  // Planning requirements
  const planningRequirements = [
    {
      requirement: 'Flood Risk Assessment',
      documents: fraRequired.required ? ['FRA report', 'Drainage strategy', 'SuDS maintenance plan'] : ['Simple drainage statement'],
      consultees: fraRequired.required ? ['Environment Agency', 'Camden LLFA'] : []
    },
    {
      requirement: 'Thames Water',
      documents: ['Pre-application enquiry response', 'Sewer connection approval'],
      consultees: ['Thames Water Developer Services']
    }
  ];

  // Timeline
  const timeline = [
    {
      phase: 'Assessment',
      duration: '2-4 weeks',
      activities: ['Flood risk review', 'Site investigation', 'Drainage design']
    },
    {
      phase: 'Consultation',
      duration: '2-4 weeks',
      activities: ['EA consultation', 'Thames Water pre-app', 'LLFA consultation']
    },
    {
      phase: 'Design',
      duration: '2-4 weeks',
      activities: ['Detailed drainage design', 'SuDS specification', 'Maintenance plan']
    }
  ];

  // Costs
  const costs = [
    {
      item: 'Flood Risk Assessment',
      range: fraRequired.cost,
      notes: fraRequired.type
    },
    {
      item: 'Drainage Engineer',
      range: '£500-2,000',
      notes: 'Design and calculations'
    },
    {
      item: 'SuDS Installation',
      range: 'Variable',
      notes: 'Depends on techniques selected'
    },
    {
      item: 'Thames Water Connection',
      range: '£500-2,000',
      notes: 'Approval and connection fees'
    }
  ];

  // Recommendations
  const recommendations: string[] = [];
  
  recommendations.push('Check Environment Agency flood maps for site-specific data');
  recommendations.push('Incorporate SuDS early in design for best integration');
  
  if (projectDetails.basementProposed) {
    recommendations.push('Basement Impact Assessment likely required by Camden');
    recommendations.push('Consider groundwater monitoring before design');
  }

  if (surfaceWaterRisk.level === 'medium' || surfaceWaterRisk.level === 'high') {
    recommendations.push('Early LLFA consultation recommended');
  }

  return {
    address,
    postcode,
    projectType,
    floodZone,
    surfaceWaterRisk,
    groundwaterRisk,
    fraRequired,
    sudsRequirements,
    sequentialTest,
    exceptionTest,
    drainageStrategy,
    planningRequirements,
    localFactors: getLocalFactors(postcode),
    timeline,
    costs,
    recommendations
  };
}

// Export the service
const floodRisk = {
  assessFloodRisk,
  AREA_FLOOD_RISK,
  FLOOD_ZONES,
  SUDS_TECHNIQUES
};

export default floodRisk;
