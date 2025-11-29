/**
 * Daylight and Sunlight Assessment Service
 * 
 * Assessment of daylight/sunlight impacts using BRE guidelines
 * for planning applications in Hampstead area
 */

interface DaylightSunlightAssessment {
  address: string;
  postcode: string;
  projectType: string;
  overview: {
    assessmentRequired: boolean;
    assessmentType: string[];
    complexity: 'simple' | 'standard' | 'detailed';
    professionalReportNeeded: boolean;
    estimatedCost: { min: number; max: number };
  };
  breGuidelines: {
    test: string;
    standard: string;
    description: string;
    passCriteria: string;
    relevance: 'high' | 'medium' | 'low';
  }[];
  riskAssessment: {
    factor: string;
    risk: 'high' | 'medium' | 'low';
    mitigation: string;
    notes: string;
  }[];
  affectedProperties: {
    relationship: string;
    testApplicable: string[];
    sensitivity: string;
    considerations: string[];
  }[];
  designGuidance: {
    principle: string;
    description: string;
    benefit: string;
  }[];
  processGuidance: {
    stage: string;
    action: string;
    timing: string;
    notes: string;
  }[];
  camdenRequirements: {
    requirement: string;
    threshold: string;
    notes: string;
  }[];
}

// BRE Daylight/Sunlight tests
const BRE_TESTS: { [key: string]: {
  name: string;
  type: 'daylight' | 'sunlight' | 'overshadowing';
  description: string;
  standard: string;
  passCriteria: string;
  applicability: string;
} } = {
  'vsc': {
    name: 'Vertical Sky Component (VSC)',
    type: 'daylight',
    description: 'Measures amount of sky visible from center of window',
    standard: '27% minimum for good daylight',
    passCriteria: 'Retained VSC >= 27% OR retained >= 0.8 × former value',
    applicability: 'All windows serving habitable rooms'
  },
  'nsl': {
    name: 'No-Sky Line (NSL)',
    type: 'daylight',
    description: 'Area of room that can see sky directly',
    standard: '50% of room should see sky',
    passCriteria: 'Retained NSL >= 0.8 × former value',
    applicability: 'Living rooms, bedrooms, kitchens'
  },
  'adf': {
    name: 'Average Daylight Factor (ADF)',
    type: 'daylight',
    description: 'Average daylight illumination across room',
    standard: 'Kitchen 2%, Living 1.5%, Bedroom 1%',
    passCriteria: 'Meet minimum ADF for room type',
    applicability: 'Internal rooms in new development'
  },
  'apsh': {
    name: 'Annual Probable Sunlight Hours (APSH)',
    type: 'sunlight',
    description: 'Hours of direct sunlight received annually',
    standard: '25% of total annual hours (1486 hrs in UK)',
    passCriteria: 'Receive >= 25% APSH total, >= 5% winter APSH',
    applicability: 'Windows facing within 90° of due south'
  },
  'winter-apsh': {
    name: 'Winter Sunlight Hours',
    type: 'sunlight',
    description: 'Sunlight during winter months (Sept 21 - Mar 21)',
    standard: '5% of winter available hours',
    passCriteria: 'Receive >= 5% winter APSH',
    applicability: 'South-facing windows'
  },
  'garden-sunlight': {
    name: 'Garden/Amenity Sunlight',
    type: 'overshadowing',
    description: 'Sunlight to outdoor amenity spaces',
    standard: '50% of area with 2+ hours sun on March 21',
    passCriteria: '>= 50% receives >= 2 hours sunlight on 21 March',
    applicability: 'Gardens, terraces, communal areas'
  },
  'transient-shadow': {
    name: 'Transient Overshadowing',
    type: 'overshadowing',
    description: 'Shadow cast at different times of day/year',
    standard: 'No specific threshold',
    passCriteria: 'Qualitative assessment of shadow impact',
    applicability: 'Public spaces, neighboring gardens'
  }
};

// Impact factors for risk assessment
const IMPACT_FACTORS: { [key: string]: {
  factor: string;
  highRisk: string;
  mitigation: string;
} } = {
  'orientation': {
    factor: 'Orientation of affected property',
    highRisk: 'North-facing windows already have limited light',
    mitigation: 'Any further reduction has greater relative impact'
  },
  'existing-light': {
    factor: 'Existing daylight levels',
    highRisk: 'Properties already below BRE standards',
    mitigation: 'Cannot worsen already poor conditions'
  },
  'window-size': {
    factor: 'Window size and position',
    highRisk: 'Small windows or basement windows',
    mitigation: 'Design to minimize obstruction to critical windows'
  },
  'distance': {
    factor: 'Distance to affected properties',
    highRisk: 'Close proximity (<6m) increases impact',
    mitigation: 'Step back upper floors, reduce bulk'
  },
  'height': {
    factor: 'Height of proposed development',
    highRisk: 'Higher buildings cast longer shadows',
    mitigation: 'Limit height, slope roofs away from neighbors'
  },
  'room-use': {
    factor: 'Use of affected rooms',
    highRisk: 'Living rooms, kitchens have higher standards',
    mitigation: 'Prioritize protection of main habitable rooms'
  }
};

/**
 * Assess daylight and sunlight impacts
 */
async function assessDaylightSunlight(
  address: string,
  postcode: string,
  projectType: string,
  projectDetails?: {
    heightIncrease?: number;
    depthIncrease?: number;
    distanceToNeighbors?: number;
    orientationToNeighbors?: 'north' | 'south' | 'east' | 'west';
    existingBuilding?: boolean;
    neighborWindows?: 'direct' | 'indirect' | 'none';
    neighborGardens?: boolean;
  }
): Promise<DaylightSunlightAssessment> {
  const outcode = postcode.split(' ')[0] || 'NW3';
  
  // Determine assessment requirements
  const overview = generateOverview(projectType, projectDetails);
  
  // Generate applicable BRE guidelines
  const breGuidelines = generateBREGuidelines(projectType, projectDetails);
  
  // Risk assessment
  const riskAssessment = generateRiskAssessment(projectDetails);
  
  // Affected properties analysis
  const affectedProperties = generateAffectedProperties(projectDetails);
  
  // Design guidance
  const designGuidance = generateDesignGuidance(projectType);
  
  // Process guidance
  const processGuidance = generateProcessGuidance(overview);
  
  // Camden specific requirements
  const camdenRequirements = generateCamdenRequirements();
  
  return {
    address,
    postcode,
    projectType,
    overview,
    breGuidelines,
    riskAssessment,
    affectedProperties,
    designGuidance,
    processGuidance,
    camdenRequirements
  };
}

/**
 * Generate overview
 */
function generateOverview(
  projectType: string,
  details?: {
    heightIncrease?: number;
    depthIncrease?: number;
    distanceToNeighbors?: number;
    neighborWindows?: 'direct' | 'indirect' | 'none';
  }
): {
  assessmentRequired: boolean;
  assessmentType: string[];
  complexity: 'simple' | 'standard' | 'detailed';
  professionalReportNeeded: boolean;
  estimatedCost: { min: number; max: number };
} {
  const normalizedType = projectType.toLowerCase();
  
  // Determine if assessment likely required
  const majorTriggers = ['basement', 'new-build', 'two-storey', 'apartment', 'flats'];
  const moderateTriggers = ['extension', 'loft', 'conversion'];
  const minorTriggers = ['single-storey', 'rear-only', 'small'];
  
  let assessmentRequired = false;
  let complexity: 'simple' | 'standard' | 'detailed' = 'simple';
  let professionalReportNeeded = false;
  let assessmentType: string[] = [];
  let costMin = 0;
  let costMax = 0;
  
  if (majorTriggers.some(t => normalizedType.includes(t))) {
    assessmentRequired = true;
    complexity = 'detailed';
    professionalReportNeeded = true;
    assessmentType = ['VSC', 'NSL', 'APSH', 'Garden sunlight'];
    costMin = 1500;
    costMax = 4000;
  } else if (moderateTriggers.some(t => normalizedType.includes(t))) {
    assessmentRequired = details?.neighborWindows === 'direct';
    complexity = 'standard';
    professionalReportNeeded = details?.neighborWindows === 'direct';
    assessmentType = ['VSC', 'APSH'];
    costMin = 800;
    costMax = 2000;
  } else if (minorTriggers.some(t => normalizedType.includes(t))) {
    assessmentRequired = false;
    complexity = 'simple';
    professionalReportNeeded = false;
    assessmentType = ['Basic shadow analysis'];
    costMin = 0;
    costMax = 500;
  }
  
  // Adjust based on proximity
  if (details?.distanceToNeighbors && details.distanceToNeighbors < 6) {
    assessmentRequired = true;
    if (complexity === 'simple') complexity = 'standard';
    professionalReportNeeded = true;
  }
  
  // Adjust based on height
  if (details?.heightIncrease && details.heightIncrease > 3) {
    assessmentRequired = true;
    complexity = 'detailed';
    professionalReportNeeded = true;
  }
  
  return {
    assessmentRequired,
    assessmentType,
    complexity,
    professionalReportNeeded,
    estimatedCost: { min: costMin, max: costMax }
  };
}

/**
 * Generate BRE guidelines relevance
 */
function generateBREGuidelines(
  projectType: string,
  details?: {
    neighborWindows?: 'direct' | 'indirect' | 'none';
    neighborGardens?: boolean;
    orientationToNeighbors?: 'north' | 'south' | 'east' | 'west';
  }
): {
  test: string;
  standard: string;
  description: string;
  passCriteria: string;
  relevance: 'high' | 'medium' | 'low';
}[] {
  const guidelines: {
    test: string;
    standard: string;
    description: string;
    passCriteria: string;
    relevance: 'high' | 'medium' | 'low';
  }[] = [];
  
  // VSC - almost always relevant
  const vsc = BRE_TESTS['vsc'];
  if (vsc) {
    guidelines.push({
      test: vsc.name,
      standard: vsc.standard,
      description: vsc.description,
      passCriteria: vsc.passCriteria,
      relevance: details?.neighborWindows === 'direct' ? 'high' : 'medium'
    });
  }
  
  // NSL - relevant for rooms with significant impact
  const nsl = BRE_TESTS['nsl'];
  if (nsl) {
    guidelines.push({
      test: nsl.name,
      standard: nsl.standard,
      description: nsl.description,
      passCriteria: nsl.passCriteria,
      relevance: details?.neighborWindows === 'direct' ? 'high' : 'low'
    });
  }
  
  // APSH - relevant for south-facing windows
  const apsh = BRE_TESTS['apsh'];
  if (apsh) {
    const isSouthFacing = details?.orientationToNeighbors === 'south';
    guidelines.push({
      test: apsh.name,
      standard: apsh.standard,
      description: apsh.description,
      passCriteria: apsh.passCriteria,
      relevance: isSouthFacing ? 'high' : 'medium'
    });
  }
  
  // Garden sunlight - if neighbors have gardens
  const garden = BRE_TESTS['garden-sunlight'];
  if (garden) {
    guidelines.push({
      test: garden.name,
      standard: garden.standard,
      description: garden.description,
      passCriteria: garden.passCriteria,
      relevance: details?.neighborGardens ? 'high' : 'low'
    });
  }
  
  return guidelines;
}

/**
 * Generate risk assessment
 */
function generateRiskAssessment(
  details?: {
    heightIncrease?: number;
    depthIncrease?: number;
    distanceToNeighbors?: number;
    orientationToNeighbors?: 'north' | 'south' | 'east' | 'west';
    neighborWindows?: 'direct' | 'indirect' | 'none';
  }
): {
  factor: string;
  risk: 'high' | 'medium' | 'low';
  mitigation: string;
  notes: string;
}[] {
  const risks: {
    factor: string;
    risk: 'high' | 'medium' | 'low';
    mitigation: string;
    notes: string;
  }[] = [];
  
  // Distance risk
  let distanceRisk: 'high' | 'medium' | 'low' = 'low';
  if (details?.distanceToNeighbors) {
    if (details.distanceToNeighbors < 3) distanceRisk = 'high';
    else if (details.distanceToNeighbors < 6) distanceRisk = 'medium';
  }
  risks.push({
    factor: 'Distance to affected properties',
    risk: distanceRisk,
    mitigation: 'Increase separation, step back upper floors',
    notes: `Distance: ${details?.distanceToNeighbors || 'unknown'}m`
  });
  
  // Height risk
  let heightRisk: 'high' | 'medium' | 'low' = 'low';
  if (details?.heightIncrease) {
    if (details.heightIncrease > 5) heightRisk = 'high';
    else if (details.heightIncrease > 2.5) heightRisk = 'medium';
  }
  risks.push({
    factor: 'Height increase',
    risk: heightRisk,
    mitigation: 'Reduce height, use pitched roof sloping away',
    notes: `Height increase: ${details?.heightIncrease || 'unknown'}m`
  });
  
  // Orientation risk
  let orientationRisk: 'high' | 'medium' | 'low' = 'low';
  if (details?.orientationToNeighbors === 'north') {
    orientationRisk = 'high';
  } else if (details?.orientationToNeighbors === 'south') {
    orientationRisk = 'medium'; // Sunlight impact
  }
  risks.push({
    factor: 'Orientation to neighbors',
    risk: orientationRisk,
    mitigation: 'Special consideration for north-facing windows',
    notes: `Neighbors to ${details?.orientationToNeighbors || 'unknown'}`
  });
  
  // Direct windows risk
  let windowRisk: 'high' | 'medium' | 'low' = 'low';
  if (details?.neighborWindows === 'direct') windowRisk = 'high';
  else if (details?.neighborWindows === 'indirect') windowRisk = 'medium';
  
  risks.push({
    factor: 'Neighbor window exposure',
    risk: windowRisk,
    mitigation: 'Detailed BRE assessment, design to minimize obstruction',
    notes: `Windows: ${details?.neighborWindows || 'unknown'} view`
  });
  
  return risks;
}

/**
 * Generate affected properties analysis
 */
function generateAffectedProperties(
  details?: {
    neighborWindows?: 'direct' | 'indirect' | 'none';
    neighborGardens?: boolean;
    orientationToNeighbors?: 'north' | 'south' | 'east' | 'west';
  }
): {
  relationship: string;
  testApplicable: string[];
  sensitivity: string;
  considerations: string[];
}[] {
  const properties: {
    relationship: string;
    testApplicable: string[];
    sensitivity: string;
    considerations: string[];
  }[] = [];
  
  // Rear neighbors
  properties.push({
    relationship: 'Rear neighbors',
    testApplicable: ['VSC', 'NSL', 'APSH'],
    sensitivity: 'High - direct overlooking common',
    considerations: [
      'Living rooms often at rear',
      'Gardens may be overshadowed',
      'Consider depth and height together'
    ]
  });
  
  // Side neighbors
  properties.push({
    relationship: 'Side neighbors',
    testApplicable: ['VSC', 'APSH', 'Garden sunlight'],
    sensitivity: 'Medium - depends on window positions',
    considerations: [
      'Flank windows may be secondary',
      'Side return extensions common',
      'Consider cumulative effect'
    ]
  });
  
  // Front neighbors (across street)
  properties.push({
    relationship: 'Properties opposite',
    testApplicable: ['VSC', 'APSH'],
    sensitivity: 'Low - unless street is narrow',
    considerations: [
      'Greater separation usually',
      'Street width provides buffer',
      'Height increases may still impact'
    ]
  });
  
  return properties;
}

/**
 * Generate design guidance
 */
function generateDesignGuidance(projectType: string): {
  principle: string;
  description: string;
  benefit: string;
}[] {
  return [
    {
      principle: 'Step back upper floors',
      description: 'Set upper storeys back from the main building line',
      benefit: 'Reduces obstruction to sky visible from neighbor windows'
    },
    {
      principle: 'Use pitched roofs',
      description: 'Slope roof away from affected neighbors',
      benefit: 'Reduces effective height at critical angles'
    },
    {
      principle: 'Light-colored materials',
      description: 'Use reflective external finishes',
      benefit: 'Increases reflected light to neighbors'
    },
    {
      principle: 'Limit depth',
      description: 'Keep projection proportionate to garden length',
      benefit: 'Maintains outlook and daylight to rear windows'
    },
    {
      principle: 'Position windows strategically',
      description: 'Place windows to maximize own daylight without compromising neighbors',
      benefit: 'Good internal daylight, minimal overlooking'
    },
    {
      principle: '45-degree rule',
      description: 'Development should not breach 45° from neighbors ground floor windows',
      benefit: 'Ensures basic daylight protection'
    },
    {
      principle: 'Consider alternative layouts',
      description: 'Single storey at rear, height at front',
      benefit: 'Achieves floor area with less neighbor impact'
    }
  ];
}

/**
 * Generate process guidance
 */
function generateProcessGuidance(
  overview: {
    professionalReportNeeded: boolean;
    complexity: string;
  }
): {
  stage: string;
  action: string;
  timing: string;
  notes: string;
}[] {
  const stages: {
    stage: string;
    action: string;
    timing: string;
    notes: string;
  }[] = [
    {
      stage: 'Early design',
      action: 'Initial shadow analysis and massing studies',
      timing: 'Before detailed design',
      notes: 'Identify potential issues early'
    },
    {
      stage: 'Pre-application',
      action: 'Discuss daylight approach with planning officer',
      timing: 'During pre-app meeting',
      notes: 'Understand LPA expectations'
    }
  ];
  
  if (overview.professionalReportNeeded) {
    stages.push({
      stage: 'Commission report',
      action: 'Instruct daylight/sunlight consultant',
      timing: '4-6 weeks before submission',
      notes: 'BRE-compliant assessment needed'
    });
    stages.push({
      stage: 'Design iteration',
      action: 'Adjust design based on initial results',
      timing: 'Before finalizing scheme',
      notes: 'May need multiple iterations'
    });
  }
  
  stages.push({
    stage: 'Application',
    action: 'Submit daylight/sunlight report with application',
    timing: 'With planning submission',
    notes: overview.professionalReportNeeded ? 'Professional report required' : 'Basic analysis may suffice'
  });
  
  stages.push({
    stage: 'Assessment',
    action: 'Respond to any queries from planning officer',
    timing: 'During determination',
    notes: 'May need supplementary analysis'
  });
  
  return stages;
}

/**
 * Generate Camden specific requirements
 */
function generateCamdenRequirements(): {
  requirement: string;
  threshold: string;
  notes: string;
}[] {
  return [
    {
      requirement: 'BRE Guidelines compliance',
      threshold: 'Meet or demonstrate acceptable deviation',
      notes: 'Camden expects BRE-compliant analysis for significant schemes'
    },
    {
      requirement: 'Daylight/sunlight report',
      threshold: 'Required for extensions near boundaries, all new-build',
      notes: 'By qualified daylight consultant'
    },
    {
      requirement: '25% VSC minimum',
      threshold: 'Retained VSC should ideally exceed 27%',
      notes: 'Below 27% requires justification'
    },
    {
      requirement: 'Cumulative impact',
      threshold: 'Consider with other nearby developments',
      notes: 'Recent approvals may be factored in'
    },
    {
      requirement: 'Internal daylight',
      threshold: 'New habitable rooms must meet ADF minimums',
      notes: 'Kitchen 2%, Living 1.5%, Bedroom 1%'
    },
    {
      requirement: 'Heritage sensitivity',
      threshold: 'Conservation areas may have stricter expectations',
      notes: 'Protecting character includes light quality'
    }
  ];
}

export default {
  assessDaylightSunlight
};
