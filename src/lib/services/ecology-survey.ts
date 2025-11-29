/**
 * Ecology Survey Service
 * 
 * Provides ecological assessment guidance for development projects
 * in the Hampstead area, including protected species and habitats.
 */

interface EcologyProject {
  siteArea?: number;
  existingHabitats?: string[];
  treesPresent?: boolean;
  waterFeatures?: boolean;
  buildingsToAlter?: boolean;
  roofType?: string;
  proximity?: {
    woodland?: boolean;
    river?: boolean;
    siteOfImportance?: boolean;
  };
  demolition?: boolean;
}

interface ProtectedSpecies {
  species: string;
  legislation: string;
  surveyPeriod: string;
  licenceRequired: boolean;
  implications: string[];
}

interface SurveyRequirement {
  surveyType: string;
  purpose: string;
  optimalTiming: string;
  cost: string;
  reportContent: string[];
}

interface EcologyAssessment {
  address: string;
  postcode: string;
  projectType: string;
  ecologicalSensitivity: {
    level: 'low' | 'moderate' | 'high' | 'very-high';
    factors: string[];
    nearbyDesignations: string[];
  };
  protectedSpecies: ProtectedSpecies[];
  surveyRequirements: SurveyRequirement[];
  biodiversityNetGain: {
    applicable: boolean;
    requirement: string;
    options: string[];
    metrics: string[];
  };
  planningRequirements: {
    requirement: string;
    timing: string;
    documents: string[];
  }[];
  mitigationMeasures: {
    species: string;
    measures: string[];
    timing: string;
  }[];
  enhancementOpportunities: string[];
  localDesignations: {
    name: string;
    distance: string;
    implications: string;
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

// Hampstead area ecological features
const LOCAL_ECOLOGY: Record<string, {
  nearbyDesignations: string[];
  commonSpecies: string[];
  sensitivity: string;
}> = {
  'NW3': {
    nearbyDesignations: [
      'Hampstead Heath SSSI',
      'Hampstead Heath Site of Metropolitan Importance',
      'Hampstead Cemetery Local Nature Reserve',
      'Multiple Tree Preservation Order areas'
    ],
    commonSpecies: ['Bats', 'Great Crested Newts (Heath ponds)', 'Hedgehogs', 'Slow worms', 'Stag beetles'],
    sensitivity: 'High'
  },
  'NW6': {
    nearbyDesignations: [
      'West Hampstead Thameslink Embankment SINC',
      'Kilburn Grange Park SINC',
      'Various TPO areas'
    ],
    commonSpecies: ['Bats', 'House sparrows', 'Swift nesting sites', 'Hedgehogs'],
    sensitivity: 'Moderate'
  },
  'NW8': {
    nearbyDesignations: [
      "Regent's Park and Primrose Hill SSSI",
      "Regent's Canal SINC",
      'Lords Cricket Ground wildlife areas'
    ],
    commonSpecies: ['Bats', 'Herons', 'Water voles (canal)', 'Various birds'],
    sensitivity: 'Moderate'
  },
  'NW11': {
    nearbyDesignations: [
      'Hampstead Heath Extension SSSI',
      'Golders Hill Park SINC',
      'Big Wood SINC',
      'Multiple TPO areas'
    ],
    commonSpecies: ['Bats', 'Badgers', 'Great Crested Newts', 'Reptiles', 'Stag beetles'],
    sensitivity: 'High'
  }
};

// Protected species information
const PROTECTED_SPECIES: Record<string, {
  legislation: string;
  surveyPeriod: string;
  licenceRequired: boolean;
  penalties: string;
}> = {
  'bats': {
    legislation: 'Wildlife and Countryside Act 1981, Conservation of Habitats and Species Regulations 2017',
    surveyPeriod: 'May-September (emergence surveys)',
    licenceRequired: true,
    penalties: 'Up to £5,000 per bat, imprisonment'
  },
  'great-crested-newts': {
    legislation: 'Wildlife and Countryside Act 1981, Habitats Regulations 2017',
    surveyPeriod: 'Mid-March to mid-June (optimal)',
    licenceRequired: true,
    penalties: 'Up to £5,000 per individual, imprisonment'
  },
  'birds-nesting': {
    legislation: 'Wildlife and Countryside Act 1981',
    surveyPeriod: 'March-August (nesting season)',
    licenceRequired: false,
    penalties: 'Up to £5,000 per nest disturbed'
  },
  'badgers': {
    legislation: 'Protection of Badgers Act 1992',
    surveyPeriod: 'Year-round, optimal Feb-April',
    licenceRequired: true,
    penalties: 'Up to £5,000, imprisonment'
  },
  'reptiles': {
    legislation: 'Wildlife and Countryside Act 1981',
    surveyPeriod: 'April-September',
    licenceRequired: false,
    penalties: 'Up to £5,000 per individual'
  },
  'hedgehogs': {
    legislation: 'Protected under Wildlife and Countryside Act (limited)',
    surveyPeriod: 'April-October',
    licenceRequired: false,
    penalties: 'Limited - but planning consideration'
  }
};

// Project types and their ecological implications
const PROJECT_ECOLOGY_TRIGGERS: Record<string, {
  batSurveyLikely: boolean;
  treeSurveyLikely: boolean;
  fullEcologyLikely: boolean;
  triggers: string[];
}> = {
  'loft-conversion': {
    batSurveyLikely: true,
    treeSurveyLikely: false,
    fullEcologyLikely: false,
    triggers: ['Roof alterations may affect bat roosts']
  },
  'extension': {
    batSurveyLikely: false,
    treeSurveyLikely: true,
    fullEcologyLikely: false,
    triggers: ['Tree impact', 'Garden habitat loss']
  },
  'basement': {
    batSurveyLikely: false,
    treeSurveyLikely: true,
    fullEcologyLikely: false,
    triggers: ['Tree root zones', 'Potential wildlife displacement']
  },
  'new-build': {
    batSurveyLikely: true,
    treeSurveyLikely: true,
    fullEcologyLikely: true,
    triggers: ['Complete site assessment required', 'Biodiversity Net Gain applies']
  },
  'demolition': {
    batSurveyLikely: true,
    treeSurveyLikely: true,
    fullEcologyLikely: true,
    triggers: ['Building demolition bat survey', 'Nesting birds', 'Site clearance impacts']
  },
  'change-of-use': {
    batSurveyLikely: false,
    treeSurveyLikely: false,
    fullEcologyLikely: false,
    triggers: ['Generally minimal unless external works']
  }
};

function extractOutcode(postcode: string): string {
  const cleaned = postcode.toUpperCase().replace(/\s+/g, '');
  const match = cleaned.match(/^([A-Z]{1,2}\d{1,2})/);
  return match && match[1] ? match[1] : 'NW3';
}

function assessEcologicalSensitivity(
  postcode: string,
  projectType: string,
  projectDetails: EcologyProject
): {
  level: 'low' | 'moderate' | 'high' | 'very-high';
  factors: string[];
  nearbyDesignations: string[];
} {
  const outcode = extractOutcode(postcode);
  const defaultLocalEco = LOCAL_ECOLOGY['NW3']!;
  const localEcology = LOCAL_ECOLOGY[outcode] || defaultLocalEco;
  
  const factors: string[] = [];
  let sensitivityScore = 0;

  // Base score from area
  if (localEcology.sensitivity === 'High') {
    sensitivityScore += 2;
    factors.push(`${outcode} is in a high ecological sensitivity area`);
  } else {
    sensitivityScore += 1;
    factors.push(`${outcode} has moderate ecological sensitivity`);
  }

  // Project-specific factors
  if (projectDetails.treesPresent) {
    sensitivityScore += 1;
    factors.push('Trees on site may support wildlife');
  }

  if (projectDetails.waterFeatures) {
    sensitivityScore += 2;
    factors.push('Water features may support amphibians');
  }

  if (projectDetails.buildingsToAlter && projectDetails.roofType?.includes('tile')) {
    sensitivityScore += 1;
    factors.push('Tiled roofs may support bat roosts');
  }

  if (projectDetails.proximity?.siteOfImportance) {
    sensitivityScore += 2;
    factors.push('Site is close to designated nature conservation site');
  }

  if (projectDetails.proximity?.woodland) {
    sensitivityScore += 1;
    factors.push('Proximity to woodland increases bat likelihood');
  }

  if (projectDetails.siteArea && projectDetails.siteArea > 500) {
    sensitivityScore += 1;
    factors.push('Larger site increases habitat potential');
  }

  // Determine level
  let level: 'low' | 'moderate' | 'high' | 'very-high';
  if (sensitivityScore <= 2) {
    level = 'low';
  } else if (sensitivityScore <= 4) {
    level = 'moderate';
  } else if (sensitivityScore <= 6) {
    level = 'high';
  } else {
    level = 'very-high';
  }

  return {
    level,
    factors,
    nearbyDesignations: localEcology.nearbyDesignations
  };
}

function getProtectedSpeciesInfo(
  postcode: string,
  projectType: string,
  projectDetails: EcologyProject
): ProtectedSpecies[] {
  const outcode = extractOutcode(postcode);
  const defaultLocalEco = LOCAL_ECOLOGY['NW3']!;
  const localEcology = LOCAL_ECOLOGY[outcode] || defaultLocalEco;
  const defaultTriggers = PROJECT_ECOLOGY_TRIGGERS['extension']!;
  const projectTriggers = PROJECT_ECOLOGY_TRIGGERS[projectType] || defaultTriggers;
  
  const species: ProtectedSpecies[] = [];

  // Bats - common concern
  if (projectTriggers.batSurveyLikely || projectDetails.buildingsToAlter) {
    const batInfo = PROTECTED_SPECIES['bats']!;
    species.push({
      species: 'Bats (all species)',
      legislation: batInfo.legislation,
      surveyPeriod: batInfo.surveyPeriod,
      licenceRequired: batInfo.licenceRequired,
      implications: [
        'Preliminary Roost Assessment required for roof works',
        'Emergence surveys if roost features identified',
        'Mitigation licence from Natural England if roost confirmed',
        'Works timing restrictions'
      ]
    });
  }

  // Birds
  if (projectDetails.demolition || projectDetails.treesPresent) {
    const birdInfo = PROTECTED_SPECIES['birds-nesting']!;
    species.push({
      species: 'Nesting Birds',
      legislation: birdInfo.legislation,
      surveyPeriod: birdInfo.surveyPeriod,
      licenceRequired: birdInfo.licenceRequired,
      implications: [
        'Check for active nests before vegetation clearance',
        'Avoid works during nesting season where possible',
        'If nests found, wait until birds have fledged'
      ]
    });
  }

  // Area-specific species
  if (localEcology.commonSpecies.includes('Great Crested Newts')) {
    const newtInfo = PROTECTED_SPECIES['great-crested-newts']!;
    species.push({
      species: 'Great Crested Newts',
      legislation: newtInfo.legislation,
      surveyPeriod: newtInfo.surveyPeriod,
      licenceRequired: newtInfo.licenceRequired,
      implications: [
        'eDNA or presence/absence surveys if within 500m of pond',
        'Population assessment if presence confirmed',
        'District Level Licensing may apply',
        'Mitigation licence required for works in habitat'
      ]
    });
  }

  if (localEcology.commonSpecies.includes('Badgers')) {
    const badgerInfo = PROTECTED_SPECIES['badgers']!;
    species.push({
      species: 'Badgers',
      legislation: badgerInfo.legislation,
      surveyPeriod: badgerInfo.surveyPeriod,
      licenceRequired: badgerInfo.licenceRequired,
      implications: [
        'Survey for sett entrances within 30m of works',
        'Licence required for sett closure or works within 30m',
        'Timing restrictions around breeding season'
      ]
    });
  }

  return species;
}

function getSurveyRequirements(
  projectType: string,
  projectDetails: EcologyProject,
  sensitivity: string
): SurveyRequirement[] {
  const surveys: SurveyRequirement[] = [];
  const defaultTriggers = PROJECT_ECOLOGY_TRIGGERS['extension']!;
  const projectTriggers = PROJECT_ECOLOGY_TRIGGERS[projectType] || defaultTriggers;

  // Preliminary Ecological Appraisal - most developments
  if (projectTriggers.fullEcologyLikely || sensitivity === 'high' || sensitivity === 'very-high') {
    surveys.push({
      surveyType: 'Preliminary Ecological Appraisal (PEA)',
      purpose: 'Assess ecological features and identify need for further surveys',
      optimalTiming: 'Year-round (spring-autumn optimal)',
      cost: '£300-600',
      reportContent: [
        'Desktop study of local records',
        'Extended Phase 1 habitat survey',
        'Protected species potential assessment',
        'Recommendations for further surveys',
        'Preliminary mitigation advice'
      ]
    });
  }

  // Bat surveys
  if (projectTriggers.batSurveyLikely || projectDetails.buildingsToAlter) {
    surveys.push({
      surveyType: 'Preliminary Roost Assessment (Bats)',
      purpose: 'Assess building for bat roost potential',
      optimalTiming: 'Year-round',
      cost: '£250-500',
      reportContent: [
        'External and internal building inspection',
        'Assessment of roost features',
        'Classification of roost potential',
        'Recommendations for emergence surveys if needed'
      ]
    });

    surveys.push({
      surveyType: 'Bat Emergence/Re-entry Surveys',
      purpose: 'Confirm presence/absence of roosting bats',
      optimalTiming: 'May-September (2-3 surveys)',
      cost: '£350-500 per survey',
      reportContent: [
        'Dawn/dusk survey results',
        'Species identification',
        'Roost characterisation',
        'Impact assessment',
        'Mitigation recommendations'
      ]
    });
  }

  // Tree surveys
  if (projectTriggers.treeSurveyLikely || projectDetails.treesPresent) {
    surveys.push({
      surveyType: 'Arboricultural Impact Assessment',
      purpose: 'Assess impact on trees and tree protection',
      optimalTiming: 'Year-round (summer for canopy)',
      cost: '£400-1,000',
      reportContent: [
        'Tree survey (BS 5837)',
        'Root protection areas',
        'Impact assessment',
        'Tree protection plan',
        'Recommendations'
      ]
    });
  }

  // Reptile survey
  if (sensitivity === 'high' || sensitivity === 'very-high') {
    surveys.push({
      surveyType: 'Reptile Presence/Absence Survey',
      purpose: 'Detect reptiles on site',
      optimalTiming: 'April-September (7 visits)',
      cost: '£800-1,500',
      reportContent: [
        'Artificial refuge methodology',
        'Species and population assessment',
        'Mitigation requirements',
        'Translocation plan if needed'
      ]
    });
  }

  return surveys;
}

function getBiodiversityNetGain(projectType: string, projectDetails: EcologyProject): {
  applicable: boolean;
  requirement: string;
  options: string[];
  metrics: string[];
} {
  // BNG now mandatory for most developments
  const applicable = ['new-build', 'demolition', 'change-of-use'].includes(projectType) ||
                    Boolean(projectDetails.siteArea && projectDetails.siteArea > 25);

  return {
    applicable,
    requirement: '10% net gain in biodiversity value (mandatory from Nov 2023 for major, Feb 2024 for minor)',
    options: [
      'On-site habitat creation/enhancement',
      'Off-site habitat creation (biodiversity units purchase)',
      'Statutory biodiversity credits (last resort)',
      'Combination of above'
    ],
    metrics: [
      'DEFRA Biodiversity Metric 4.0',
      'Habitat distinctiveness scores',
      'Habitat condition assessment',
      '30-year management commitment'
    ]
  };
}

function getMitigationMeasures(species: ProtectedSpecies[]): {
  species: string;
  measures: string[];
  timing: string;
}[] {
  const mitigations: {
    species: string;
    measures: string[];
    timing: string;
  }[] = [];

  species.forEach(sp => {
    if (sp.species.includes('Bat')) {
      mitigations.push({
        species: 'Bats',
        measures: [
          'Integrated bat boxes in new construction',
          'Timing works outside maternity season (May-Aug)',
          'Soft strip under ecological supervision',
          'Replacement roost features',
          'Lighting design to avoid roosts'
        ],
        timing: 'Works October-April preferred'
      });
    }

    if (sp.species.includes('Bird')) {
      mitigations.push({
        species: 'Nesting Birds',
        measures: [
          'Clear vegetation outside nesting season',
          'Pre-works nesting check if seasonal constraint',
          'Integrated swift/sparrow boxes',
          'Retain mature vegetation where possible'
        ],
        timing: 'Clearance September-February preferred'
      });
    }

    if (sp.species.includes('Newt')) {
      mitigations.push({
        species: 'Great Crested Newts',
        measures: [
          'District Level Licensing scheme',
          'Habitat manipulation to move newts',
          'Exclusion fencing during works',
          'Receptor site preparation',
          'Post-construction habitat creation'
        ],
        timing: 'Capture/exclusion March-October'
      });
    }
  });

  return mitigations;
}

function getEnhancementOpportunities(): string[] {
  return [
    'Integrated bat boxes (Schwegler or similar)',
    'Swift bricks in gable ends',
    'House sparrow terraces',
    'Native species planting in gardens',
    'Hedgehog highways (13cm gaps in fences)',
    'Bug hotels and log piles',
    'Green/brown roofs on flat-roofed extensions',
    'Wildlife ponds (no fish)',
    'Climbing plants on walls',
    'Meadow areas in place of lawn'
  ];
}

function getLocalDesignations(postcode: string): {
  name: string;
  distance: string;
  implications: string;
}[] {
  const outcode = extractOutcode(postcode);
  const designations: {
    name: string;
    distance: string;
    implications: string;
  }[] = [];

  if (outcode === 'NW3' || outcode === 'NW11') {
    designations.push({
      name: 'Hampstead Heath SSSI',
      distance: 'Adjacent to NW3/NW11',
      implications: 'Natural England consultation for significant developments within Impact Risk Zone'
    });
  }

  if (outcode === 'NW8') {
    designations.push({
      name: "Regent's Park SSSI",
      distance: 'Adjacent to NW8',
      implications: 'May trigger Natural England consultation for larger schemes'
    });
  }

  designations.push({
    name: 'Local Sites of Importance for Nature Conservation',
    distance: 'Various within borough',
    implications: 'Camden will assess impact on local wildlife sites'
  });

  designations.push({
    name: 'Tree Preservation Orders',
    distance: 'Extensive throughout Hampstead',
    implications: 'TPO consent required for works to protected trees'
  });

  return designations;
}

async function assessEcologyRequirements(
  address: string,
  postcode: string,
  projectType: string,
  projectDetails: EcologyProject = {}
): Promise<EcologyAssessment> {
  // Ecological sensitivity
  const ecologicalSensitivity = assessEcologicalSensitivity(postcode, projectType, projectDetails);

  // Protected species
  const protectedSpecies = getProtectedSpeciesInfo(postcode, projectType, projectDetails);

  // Survey requirements
  const surveyRequirements = getSurveyRequirements(projectType, projectDetails, ecologicalSensitivity.level);

  // Biodiversity Net Gain
  const biodiversityNetGain = getBiodiversityNetGain(projectType, projectDetails);

  // Planning requirements
  const planningRequirements = [
    {
      requirement: 'Preliminary Ecological Appraisal',
      timing: 'With planning application',
      documents: ['PEA report', 'Phase 1 habitat map']
    },
    {
      requirement: 'Protected species surveys',
      timing: 'Before determination (seasonal)',
      documents: ['Species-specific survey reports', 'Impact assessment']
    },
    {
      requirement: 'Biodiversity Net Gain Assessment',
      timing: 'With planning application',
      documents: ['Biodiversity Metric calculation', 'Habitat management plan']
    }
  ];

  // Mitigation measures
  const mitigationMeasures = getMitigationMeasures(protectedSpecies);

  // Enhancement opportunities
  const enhancementOpportunities = getEnhancementOpportunities();

  // Local designations
  const localDesignations = getLocalDesignations(postcode);

  // Timeline
  const timeline = [
    {
      phase: 'Preliminary Assessment',
      duration: '2-4 weeks',
      activities: ['Desktop study', 'Site walkover', 'PEA report']
    },
    {
      phase: 'Detailed Surveys',
      duration: '2-6 months (seasonal)',
      activities: ['Species-specific surveys', 'Analysis', 'Reporting']
    },
    {
      phase: 'Licensing',
      duration: '8-12 weeks',
      activities: ['Licence application', 'Natural England processing', 'Method statement']
    },
    {
      phase: 'Implementation',
      duration: 'Project-dependent',
      activities: ['Ecological supervision', 'Mitigation works', 'Monitoring']
    }
  ];

  // Costs
  const costs = [
    {
      item: 'Preliminary Ecological Appraisal',
      range: '£300-600',
      notes: 'Basic site assessment'
    },
    {
      item: 'Bat Surveys (full suite)',
      range: '£1,000-2,500',
      notes: 'PRA plus 2-3 emergence surveys'
    },
    {
      item: 'Natural England Licence',
      range: '£500-1,500',
      notes: 'Application fee plus consultant time'
    },
    {
      item: 'Ecological Supervision',
      range: '£50-80/hour',
      notes: 'Watching brief during sensitive works'
    },
    {
      item: 'Biodiversity Net Gain credits',
      range: '£42,000+ per unit',
      notes: 'If off-site purchase required'
    }
  ];

  // Recommendations
  const recommendations: string[] = [];
  
  recommendations.push('Commission ecological assessment early - surveys are seasonal');
  recommendations.push('Build survey costs and timing into project programme');
  
  if (ecologicalSensitivity.level === 'high' || ecologicalSensitivity.level === 'very-high') {
    recommendations.push('Pre-application ecological advice recommended');
    recommendations.push('Consider ecological clerk of works for construction');
  }

  recommendations.push('Design in biodiversity enhancements from the start');
  recommendations.push('Retain existing habitat features where possible');

  return {
    address,
    postcode,
    projectType,
    ecologicalSensitivity,
    protectedSpecies,
    surveyRequirements,
    biodiversityNetGain,
    planningRequirements,
    mitigationMeasures,
    enhancementOpportunities,
    localDesignations,
    timeline,
    costs,
    recommendations
  };
}

// Export the service
const ecologySurvey = {
  assessEcologyRequirements,
  LOCAL_ECOLOGY,
  PROTECTED_SPECIES,
  PROJECT_ECOLOGY_TRIGGERS
};

export default ecologySurvey;
