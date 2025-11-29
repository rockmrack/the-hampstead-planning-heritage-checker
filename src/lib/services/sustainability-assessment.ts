/**
 * Sustainability Assessment Service
 * 
 * Provides sustainability and environmental performance guidance
 * for development projects in the Hampstead area.
 */

interface SustainabilityProject {
  dwellingUnits?: number;
  floorspace?: number;
  buildingType?: string;
  newBuild?: boolean;
  refurbishment?: boolean;
  heritageConstraints?: boolean;
}

interface BREEAMAssessment {
  required: boolean;
  targetRating: string;
  categories: {
    category: string;
    weighting: string;
    keyCredits: string[];
  }[];
  process: string[];
  cost: string;
}

interface CircularEconomy {
  principles: string[];
  requirements: string[];
  evidence: string[];
}

interface WholeCarbonAssessment {
  required: boolean;
  scope: string[];
  targets: string[];
  methodology: string;
}

interface SustainabilityAssessment {
  address: string;
  postcode: string;
  projectType: string;
  policyRequirements: {
    policy: string;
    requirement: string;
    applies: boolean;
    notes: string;
  }[];
  sustainabilityStatement: {
    required: boolean;
    scope: string[];
    format: string;
  };
  breeamAssessment: BREEAMAssessment;
  circularEconomy: CircularEconomy;
  wholeCarbonAssessment: WholeCarbonAssessment;
  biodiversityNetGain: {
    required: boolean;
    target: string;
    measures: string[];
  };
  waterEfficiency: {
    target: string;
    measures: string[];
  };
  wasteManagement: {
    preConstruction: string[];
    construction: string[];
    operational: string[];
  };
  greenInfrastructure: {
    requirements: string[];
    options: {
      option: string;
      benefits: string[];
      cost: string;
    }[];
  };
  materialsSourcing: {
    requirements: string[];
    certifications: string[];
  };
  planningConditions: string[];
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

// London Plan sustainability requirements
const LONDON_PLAN_REQUIREMENTS = {
  carbonReduction: {
    residential: '35% on-site reduction beyond Part L',
    nonResidential: '35% on-site reduction beyond Part L',
    notes: 'Net zero by 2030'
  },
  breeam: {
    major: 'Excellent',
    refurbishment: 'Very Good minimum',
    notes: 'Non-residential over 500m²'
  },
  waterEfficiency: {
    residential: '105 litres/person/day (110 with Part G)',
    notes: 'Through water efficient fixtures'
  },
  urbanGreening: {
    factor: 0.4,
    residential: 0.4,
    commercial: 0.3,
    notes: 'Urban Greening Factor target'
  }
};

// BREEAM credit categories
const BREEAM_CATEGORIES: Record<string, {
  weighting: number;
  keyCredits: string[];
}> = {
  'Management': {
    weighting: 12,
    keyCredits: ['Sustainable procurement', 'Responsible construction', 'Commissioning']
  },
  'Health & Wellbeing': {
    weighting: 15,
    keyCredits: ['Visual comfort', 'Indoor air quality', 'Thermal comfort', 'Acoustics']
  },
  'Energy': {
    weighting: 19,
    keyCredits: ['Reduction of energy use', 'Energy monitoring', 'Low carbon design']
  },
  'Transport': {
    weighting: 8,
    keyCredits: ['Public transport accessibility', 'Cyclist facilities', 'Travel plan']
  },
  'Water': {
    weighting: 6,
    keyCredits: ['Water consumption', 'Water monitoring', 'Leak detection']
  },
  'Materials': {
    weighting: 12.5,
    keyCredits: ['Responsible sourcing', 'Environmental impact', 'Designing for durability']
  },
  'Waste': {
    weighting: 7.5,
    keyCredits: ['Construction waste', 'Operational waste', 'Functional adaptability']
  },
  'Land Use & Ecology': {
    weighting: 10,
    keyCredits: ['Site selection', 'Ecological enhancement', 'Long-term biodiversity']
  },
  'Pollution': {
    weighting: 10,
    keyCredits: ['Flood risk', 'NOx emissions', 'Surface water run-off', 'Light pollution']
  }
};

function checkPolicyRequirements(projectDetails: SustainabilityProject): {
  policy: string;
  requirement: string;
  applies: boolean;
  notes: string;
}[] {
  const requirements: {
    policy: string;
    requirement: string;
    applies: boolean;
    notes: string;
  }[] = [];
  
  const units = projectDetails.dwellingUnits || 0;
  const floorspace = projectDetails.floorspace || 0;
  const isMajor = units >= 10 || floorspace >= 1000;

  requirements.push({
    policy: 'London Plan SI 2',
    requirement: 'Net zero carbon development',
    applies: true,
    notes: 'All major developments must demonstrate net zero pathway'
  });

  requirements.push({
    policy: 'London Plan SI 2',
    requirement: '35% on-site carbon reduction',
    applies: isMajor,
    notes: 'Beyond Part L 2021 requirements'
  });

  requirements.push({
    policy: 'London Plan G5',
    requirement: 'Urban Greening Factor',
    applies: isMajor,
    notes: `Target UGF of ${LONDON_PLAN_REQUIREMENTS.urbanGreening.residential} for residential`
  });

  requirements.push({
    policy: 'London Plan SI 5',
    requirement: 'Water efficiency',
    applies: units > 0,
    notes: `${LONDON_PLAN_REQUIREMENTS.waterEfficiency.residential} target`
  });

  requirements.push({
    policy: 'London Plan SI 7',
    requirement: 'Reducing waste',
    applies: isMajor,
    notes: 'Circular economy principles apply'
  });

  requirements.push({
    policy: 'Camden Local Plan',
    requirement: 'Sustainability Statement',
    applies: true,
    notes: 'Required for all planning applications'
  });

  if (floorspace >= 500 && !projectDetails.newBuild) {
    requirements.push({
      policy: 'GLA',
      requirement: 'BREEAM Refurbishment',
      applies: true,
      notes: 'Very Good minimum for refurbishment >500m²'
    });
  }

  if (floorspace >= 500 && projectDetails.newBuild) {
    requirements.push({
      policy: 'GLA',
      requirement: 'BREEAM New Construction',
      applies: true,
      notes: 'Excellent target for major new-build'
    });
  }

  return requirements;
}

function getSustainabilityStatementScope(projectDetails: SustainabilityProject): {
  required: boolean;
  scope: string[];
  format: string;
} {
  const isMajor = (projectDetails.dwellingUnits || 0) >= 10 || (projectDetails.floorspace || 0) >= 1000;

  return {
    required: true,
    scope: [
      'Energy strategy and carbon reduction',
      'Water efficiency measures',
      'Sustainable drainage',
      'Green infrastructure',
      'Materials and waste',
      'Biodiversity',
      isMajor ? 'Whole life carbon assessment' : '',
      isMajor ? 'Circular economy statement' : ''
    ].filter(s => s !== ''),
    format: isMajor ? 'Full sustainability statement with calculations' : 'Concise sustainability statement'
  };
}

function getBREEAMAssessment(projectDetails: SustainabilityProject): BREEAMAssessment {
  const floorspace = projectDetails.floorspace || 0;
  const required = floorspace >= 500;
  
  let targetRating: string;
  if (!required) {
    targetRating = 'Not required (under 500m²)';
  } else if (projectDetails.newBuild) {
    targetRating = 'Excellent (70%+)';
  } else {
    targetRating = 'Very Good (55%+)';
  }

  const categories = Object.entries(BREEAM_CATEGORIES).map(([category, data]) => ({
    category,
    weighting: `${data.weighting}%`,
    keyCredits: data.keyCredits
  }));

  return {
    required,
    targetRating,
    categories,
    process: [
      'Appoint BREEAM Assessor',
      'Pre-assessment (design stage)',
      'Design stage assessment and certification',
      'Post-construction assessment',
      'Final certification'
    ],
    cost: required ? '£3,000-10,000 (assessor fees)' : 'N/A'
  };
}

function getCircularEconomy(): CircularEconomy {
  return {
    principles: [
      'Design for longevity and adaptability',
      'Design for disassembly',
      'Reuse existing materials where possible',
      'Use recycled and recyclable materials',
      'Minimize construction waste'
    ],
    requirements: [
      'Circular Economy Statement for major developments',
      'Pre-demolition/refurbishment audit',
      'Bill of materials with recycled content',
      'End-of-life strategy',
      'Construction waste management plan'
    ],
    evidence: [
      'Material passports',
      'Pre-demolition audit',
      'Waste forecasts',
      'Recycled content documentation',
      'SWMP compliance'
    ]
  };
}

function getWholeCarbonAssessment(projectDetails: SustainabilityProject): WholeCarbonAssessment {
  const isMajor = (projectDetails.dwellingUnits || 0) >= 10 || (projectDetails.floorspace || 0) >= 1000;

  return {
    required: isMajor,
    scope: [
      'Module A: Product and construction stage',
      'Module B: Use stage (operational energy)',
      'Module C: End of life',
      'Module D: Benefits beyond system boundary'
    ],
    targets: [
      'GLA benchmark: <850 kgCO2e/m² residential',
      'GLA benchmark: <950 kgCO2e/m² commercial',
      'Aspirational: <500 kgCO2e/m²'
    ],
    methodology: 'RICS Whole Life Carbon Assessment methodology'
  };
}

function getBiodiversityNetGain(projectDetails: SustainabilityProject): {
  required: boolean;
  target: string;
  measures: string[];
} {
  return {
    required: true,
    target: '10% minimum biodiversity net gain',
    measures: [
      'Green roofs (extensive or intensive)',
      'Living walls',
      'Native planting schemes',
      'Bird/bat boxes',
      'Invertebrate habitats',
      'Hedgehog highways',
      'Rain gardens',
      'Tree planting (right tree, right place)'
    ]
  };
}

function getWaterEfficiency(): {
  target: string;
  measures: string[];
} {
  return {
    target: '105 litres/person/day (or less)',
    measures: [
      'Low flow taps and showers',
      'Dual flush WCs (4/2.6 litres)',
      'Water efficient appliances',
      'Rainwater harvesting',
      'Greywater recycling',
      'Leak detection systems',
      'Water meters',
      'Drought tolerant landscaping'
    ]
  };
}

function getWasteManagement(): {
  preConstruction: string[];
  construction: string[];
  operational: string[];
} {
  return {
    preConstruction: [
      'Pre-demolition audit',
      'Salvage strategy',
      'Hazardous waste survey',
      'Material reuse opportunities'
    ],
    construction: [
      'Site Waste Management Plan',
      'Target 95% diversion from landfill',
      'Segregation of waste streams',
      'Contractor waste reporting'
    ],
    operational: [
      'Adequate bin storage',
      'Recycling facilities',
      'Food waste collection',
      'Bulky waste arrangements'
    ]
  };
}

function getGreenInfrastructure(): {
  requirements: string[];
  options: {
    option: string;
    benefits: string[];
    cost: string;
  }[];
} {
  return {
    requirements: [
      'Urban Greening Factor calculation',
      'Maximize green cover',
      'Multi-functional green spaces',
      'Climate resilience'
    ],
    options: [
      {
        option: 'Green Roof (extensive)',
        benefits: ['Biodiversity', 'Stormwater', 'Thermal', 'UGF: 0.8'],
        cost: '£80-150/m²'
      },
      {
        option: 'Green Roof (intensive)',
        benefits: ['Biodiversity', 'Amenity', 'Growing food', 'UGF: 0.8'],
        cost: '£150-300/m²'
      },
      {
        option: 'Green Wall',
        benefits: ['Biodiversity', 'Air quality', 'Thermal', 'UGF: 0.6'],
        cost: '£300-600/m²'
      },
      {
        option: 'Tree Planting',
        benefits: ['Biodiversity', 'Shade', 'Air quality', 'UGF: 0.8 per canopy m²'],
        cost: '£200-1,000 per tree'
      },
      {
        option: 'Rain Garden',
        benefits: ['Drainage', 'Biodiversity', 'Amenity', 'UGF: 0.5'],
        cost: '£40-80/m²'
      }
    ]
  };
}

function getMaterialsSourcing(): {
  requirements: string[];
  certifications: string[];
} {
  return {
    requirements: [
      'Responsibly sourced materials',
      'Recycled content targets',
      'Low carbon materials preference',
      'Local sourcing where practical',
      'Avoidance of harmful substances'
    ],
    certifications: [
      'FSC/PEFC timber',
      'BES 6001 responsible sourcing',
      'Cradle to Cradle',
      'EPDs (Environmental Product Declarations)',
      'ISO 14001 certified suppliers'
    ]
  };
}

function getLocalFactors(): string[] {
  return [
    'Camden Climate Action Plan targets carbon neutrality by 2030',
    'Camden requires sustainability statements for all applications',
    'Conservation area constraints may limit some measures (e.g., PV visibility)',
    'Heritage buildings need sensitive approach to energy efficiency',
    'Air quality focus areas - low emission design important',
    'Camden Community Energy supports local renewable projects',
    'Resident-led sustainability groups active in Hampstead area'
  ];
}

async function assessSustainability(
  address: string,
  postcode: string,
  projectType: string,
  projectDetails: SustainabilityProject = {}
): Promise<SustainabilityAssessment> {
  // Policy requirements
  const policyRequirements = checkPolicyRequirements(projectDetails);

  // Sustainability statement scope
  const sustainabilityStatement = getSustainabilityStatementScope(projectDetails);

  // BREEAM assessment
  const breeamAssessment = getBREEAMAssessment(projectDetails);

  // Circular economy
  const circularEconomy = getCircularEconomy();

  // Whole carbon assessment
  const wholeCarbonAssessment = getWholeCarbonAssessment(projectDetails);

  // Biodiversity net gain
  const biodiversityNetGain = getBiodiversityNetGain(projectDetails);

  // Water efficiency
  const waterEfficiency = getWaterEfficiency();

  // Waste management
  const wasteManagement = getWasteManagement();

  // Green infrastructure
  const greenInfrastructure = getGreenInfrastructure();

  // Materials sourcing
  const materialsSourcing = getMaterialsSourcing();

  // Planning conditions
  const planningConditions = [
    'Sustainability measures as approved',
    'BREEAM certification (if applicable)',
    'Water efficiency measures',
    'Cycle storage provision',
    'Refuse and recycling storage',
    'Green roof/wall installation (if proposed)',
    'EV charging provision'
  ];

  // Timeline
  const timeline = [
    {
      phase: 'Pre-Application',
      duration: '2-4 weeks',
      activities: ['Sustainability strategy development', 'Energy modelling', 'BREEAM pre-assessment']
    },
    {
      phase: 'Planning Application',
      duration: 'Concurrent',
      activities: ['Sustainability statement', 'Energy strategy', 'UGF calculation']
    },
    {
      phase: 'Detailed Design',
      duration: '4-8 weeks',
      activities: ['BREEAM design stage', 'Specification development', 'Contractor requirements']
    },
    {
      phase: 'Construction',
      duration: 'Duration of works',
      activities: ['SWMP implementation', 'Evidence collection', 'Monitoring']
    },
    {
      phase: 'Completion',
      duration: '4-8 weeks',
      activities: ['BREEAM post-construction', 'Performance verification', 'Handover']
    }
  ];

  // Costs
  const isMajor = (projectDetails.dwellingUnits || 0) >= 10 || (projectDetails.floorspace || 0) >= 1000;
  const costs = [
    {
      item: 'Sustainability Consultant',
      range: '£1,500-5,000',
      notes: 'Statement preparation'
    },
    {
      item: 'BREEAM Assessment',
      range: breeamAssessment.required ? '£3,000-10,000' : 'N/A',
      notes: 'Assessor fees'
    },
    {
      item: 'Energy Modelling',
      range: '£1,000-3,000',
      notes: 'Part L compliance and beyond'
    },
    {
      item: 'Whole Life Carbon',
      range: isMajor ? '£2,000-5,000' : 'N/A',
      notes: 'Assessment and reporting'
    },
    {
      item: 'Green Infrastructure',
      range: 'Variable',
      notes: 'Depends on specification'
    }
  ];

  // Recommendations
  const recommendations: string[] = [];
  
  recommendations.push('Integrate sustainability early in design');
  recommendations.push('Consider heritage constraints on visible measures');
  
  if (breeamAssessment.required) {
    recommendations.push('Appoint BREEAM assessor at RIBA Stage 1');
  }

  if (projectDetails.heritageConstraints) {
    recommendations.push('Coordinate with conservation officer on energy measures');
    recommendations.push('Consider internal insulation and secondary glazing');
  }

  recommendations.push('Engage with Camden climate initiatives');

  return {
    address,
    postcode,
    projectType,
    policyRequirements,
    sustainabilityStatement,
    breeamAssessment,
    circularEconomy,
    wholeCarbonAssessment,
    biodiversityNetGain,
    waterEfficiency,
    wasteManagement,
    greenInfrastructure,
    materialsSourcing,
    planningConditions,
    localFactors: getLocalFactors(),
    timeline,
    costs,
    recommendations
  };
}

// Export the service
const sustainabilityAssessment = {
  assessSustainability,
  LONDON_PLAN_REQUIREMENTS,
  BREEAM_CATEGORIES
};

export default sustainabilityAssessment;
