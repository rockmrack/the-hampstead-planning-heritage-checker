/**
 * Contaminated Land Service
 * 
 * Provides contaminated land assessment guidance for development
 * projects in the Hampstead area.
 */

interface ContaminatedProject {
  previousUse?: string;
  proposedUse?: string;
  gardens?: boolean;
  basementExcavation?: boolean;
  siteArea?: number;
  groundworks?: string;
}

interface ContaminationSource {
  source: string;
  likelihood: 'low' | 'medium' | 'high';
  contaminants: string[];
  investigation: string[];
}

interface Phase1Assessment {
  scope: string[];
  deliverables: string[];
  cost: string;
  duration: string;
}

interface Phase2Assessment {
  scope: string[];
  sampling: string[];
  analysis: string[];
  cost: string;
  duration: string;
}

interface RemediationStrategy {
  strategy: string;
  applicability: string;
  cost: string;
  duration: string;
}

interface ContaminatedLandAssessment {
  address: string;
  postcode: string;
  projectType: string;
  riskCategory: 'low' | 'medium' | 'high';
  potentialSources: ContaminationSource[];
  sensitiveReceptors: string[];
  assessmentRequired: {
    phase1Required: boolean;
    phase2Likely: boolean;
    remediationLikely: boolean;
    reasoning: string[];
  };
  phase1Assessment: Phase1Assessment;
  phase2Assessment: Phase2Assessment;
  potentialContaminants: {
    contaminant: string;
    sources: string[];
    healthRisks: string[];
    standards: string;
  }[];
  remediationOptions: RemediationStrategy[];
  regulatoryFramework: {
    legislation: string;
    guidance: string;
    enforcer: string;
  }[];
  planningRequirements: {
    condition: string;
    timing: string;
    details: string;
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

// Historical land uses by area
const AREA_HISTORICAL_USES: Record<string, {
  predominantUse: string;
  industrialHistory: boolean;
  madeGround: boolean;
  notes: string;
}> = {
  'NW3': {
    predominantUse: 'Residential since Victorian era',
    industrialHistory: false,
    madeGround: true,
    notes: 'Limited industrial history. Brickworks and potteries in some areas. Gardens may have lead paint/ash deposits.'
  },
  'NW6': {
    predominantUse: 'Mixed residential/light industrial',
    industrialHistory: true,
    madeGround: true,
    notes: 'Historical laundries, small factories. Railway lands may be contaminated. Filled gravel pits.'
  },
  'NW8': {
    predominantUse: 'Residential since Victorian era',
    industrialHistory: false,
    madeGround: true,
    notes: 'Limited industrial history. Predominantly residential development.'
  },
  'NW11': {
    predominantUse: 'Mixed residential/agricultural',
    industrialHistory: false,
    madeGround: false,
    notes: 'Former agricultural land. Some areas filled for development. Limited contamination expected.'
  }
};

// Potential contamination sources by previous use
const CONTAMINATION_SOURCES: Record<string, {
  likelihood: 'low' | 'medium' | 'high';
  contaminants: string[];
  investigation: string[];
}> = {
  'residential': {
    likelihood: 'low',
    contaminants: ['Lead (paint)', 'PAHs (ash)', 'Asbestos (buildings)'],
    investigation: ['Desk study', 'Targeted sampling if concerns']
  },
  'garden': {
    likelihood: 'low',
    contaminants: ['Lead', 'PAHs', 'Pesticides/herbicides'],
    investigation: ['Desk study', 'Garden soil sampling']
  },
  'garage': {
    likelihood: 'medium',
    contaminants: ['Petroleum hydrocarbons', 'Oils', 'Solvents', 'Heavy metals'],
    investigation: ['Phase 1', 'Phase 2 with TPH analysis']
  },
  'commercial': {
    likelihood: 'medium',
    contaminants: ['Varies by use', 'Asbestos', 'Oils'],
    investigation: ['Phase 1', 'Use-specific Phase 2']
  },
  'industrial': {
    likelihood: 'high',
    contaminants: ['Heavy metals', 'Organics', 'Asbestos', 'Oils', 'Solvents'],
    investigation: ['Comprehensive Phase 1 and Phase 2']
  },
  'railway': {
    likelihood: 'high',
    contaminants: ['Heavy metals', 'PAHs', 'TPH', 'Asbestos', 'Herbicides'],
    investigation: ['Comprehensive investigation', 'Network Rail records']
  },
  'petrol-station': {
    likelihood: 'high',
    contaminants: ['Petroleum hydrocarbons', 'BTEX', 'MTBE', 'Lead'],
    investigation: ['Detailed Phase 2', 'Groundwater monitoring']
  },
  'infilled-land': {
    likelihood: 'high',
    contaminants: ['Variable', 'Gas generation', 'Unknown fill materials'],
    investigation: ['Phase 2', 'Ground gas monitoring']
  }
};

// Sensitive receptor categories
const SENSITIVE_RECEPTORS = {
  human: {
    residential: 'High sensitivity - long-term exposure',
    garden: 'High sensitivity - direct soil contact',
    commercial: 'Medium sensitivity - limited exposure'
  },
  controlled_waters: {
    groundwater: 'Aquifer protection',
    surface_water: 'River/stream protection'
  },
  buildings: {
    concrete: 'Sulfate attack potential',
    services: 'Hydrocarbon attack on plastic'
  }
};

function extractOutcode(postcode: string): string {
  const cleaned = postcode.toUpperCase().replace(/\s+/g, '');
  const match = cleaned.match(/^([A-Z]{1,2}\d{1,2})/);
  return match && match[1] ? match[1] : 'NW3';
}

function assessRiskCategory(
  postcode: string,
  projectDetails: ContaminatedProject
): 'low' | 'medium' | 'high' {
  const outcode = extractOutcode(postcode);
  const defaultHistory = AREA_HISTORICAL_USES['NW3']!;
  const areaHistory = AREA_HISTORICAL_USES[outcode] || defaultHistory;
  
  let riskScore = 0;

  // Area factors
  if (areaHistory.industrialHistory) riskScore += 2;
  if (areaHistory.madeGround) riskScore += 1;

  // Previous use
  const prevUse = projectDetails.previousUse?.toLowerCase() || 'residential';
  if (prevUse.includes('industrial') || prevUse.includes('factory')) riskScore += 3;
  if (prevUse.includes('garage') || prevUse.includes('petrol')) riskScore += 2;
  if (prevUse.includes('railway')) riskScore += 3;

  // Proposed use sensitivity
  if (projectDetails.gardens) riskScore += 1;
  if (projectDetails.basementExcavation) riskScore += 1;

  if (riskScore <= 2) return 'low';
  if (riskScore <= 4) return 'medium';
  return 'high';
}

function getPotentialSources(
  postcode: string,
  projectDetails: ContaminatedProject
): ContaminationSource[] {
  const sources: ContaminationSource[] = [];
  const outcode = extractOutcode(postcode);
  const defaultHistory = AREA_HISTORICAL_USES['NW3']!;
  const areaHistory = AREA_HISTORICAL_USES[outcode] || defaultHistory;

  // Always consider residential contamination
  const defaultResidential = CONTAMINATION_SOURCES['residential']!;
  const residentialSource = CONTAMINATION_SOURCES['residential'] || defaultResidential;
  sources.push({
    source: 'Historic residential use',
    ...residentialSource
  });

  // Previous use specific
  const prevUse = projectDetails.previousUse?.toLowerCase() || 'residential';
  
  if (prevUse.includes('garage')) {
    const defaultGarage = CONTAMINATION_SOURCES['garage']!;
    const garageSource = CONTAMINATION_SOURCES['garage'] || defaultGarage;
    sources.push({
      source: 'Former garage/vehicle use',
      ...garageSource
    });
  }

  if (prevUse.includes('industrial') || prevUse.includes('factory')) {
    const defaultIndustrial = CONTAMINATION_SOURCES['industrial']!;
    const industrialSource = CONTAMINATION_SOURCES['industrial'] || defaultIndustrial;
    sources.push({
      source: 'Former industrial use',
      ...industrialSource
    });
  }

  // Area factors
  if (areaHistory.madeGround) {
    const defaultInfilled = CONTAMINATION_SOURCES['infilled-land']!;
    const infilledSource = CONTAMINATION_SOURCES['infilled-land'] || defaultInfilled;
    sources.push({
      source: 'Made ground/historical filling',
      ...infilledSource
    });
  }

  if (projectDetails.gardens) {
    const defaultGarden = CONTAMINATION_SOURCES['garden']!;
    const gardenSource = CONTAMINATION_SOURCES['garden'] || defaultGarden;
    sources.push({
      source: 'Garden soils',
      ...gardenSource
    });
  }

  return sources;
}

function getSensitiveReceptors(projectDetails: ContaminatedProject): string[] {
  const receptors: string[] = [];

  receptors.push('Future site users (residents/workers)');
  
  if (projectDetails.gardens) {
    receptors.push('Garden users - direct soil contact');
    receptors.push('Homegrown produce consumers');
  }

  if (projectDetails.basementExcavation) {
    receptors.push('Construction workers during excavation');
    receptors.push('Basement occupants (vapor intrusion)');
  }

  receptors.push('Controlled waters (groundwater)');
  receptors.push('Building fabric and services');
  receptors.push('Adjacent properties');

  return receptors;
}

function getPhase1Requirements(
  riskCategory: 'low' | 'medium' | 'high'
): Phase1Assessment {
  return {
    scope: [
      'Historical map review (1850s-present)',
      'Environmental database search',
      'Site reconnaissance',
      'Regulatory consultation',
      'Conceptual site model development'
    ],
    deliverables: [
      'Phase 1 Desk Study Report',
      'Preliminary Conceptual Site Model',
      'Recommendations for Phase 2 (if required)'
    ],
    cost: riskCategory === 'low' ? '£800-1,500' : riskCategory === 'medium' ? '£1,000-2,000' : '£1,500-3,000',
    duration: '2-4 weeks'
  };
}

function getPhase2Requirements(
  riskCategory: 'low' | 'medium' | 'high',
  projectDetails: ContaminatedProject
): Phase2Assessment {
  const sampling: string[] = ['Trial pits', 'Window sampling'];
  const analysis: string[] = [
    'Metals suite (As, Cd, Cr, Cu, Pb, Hg, Ni, Zn)',
    'PAHs (16 USEPA)',
    'Total petroleum hydrocarbons (TPH)',
    'Asbestos screening'
  ];

  if (projectDetails.basementExcavation) {
    sampling.push('Deep boreholes');
    sampling.push('Groundwater monitoring wells');
    analysis.push('Groundwater quality');
    analysis.push('Dissolved phase contaminants');
  }

  if (riskCategory === 'high') {
    sampling.push('Ground gas monitoring');
    analysis.push('Gas monitoring (CH4, CO2, O2)');
    analysis.push('Speciated hydrocarbon analysis');
  }

  return {
    scope: [
      'Intrusive site investigation',
      'Soil and water sampling',
      'Laboratory analysis',
      'Generic Quantitative Risk Assessment',
      'Updated Conceptual Site Model'
    ],
    sampling,
    analysis,
    cost: riskCategory === 'low' ? '£2,000-4,000' : riskCategory === 'medium' ? '£4,000-8,000' : '£8,000-20,000',
    duration: riskCategory === 'low' ? '2-4 weeks' : riskCategory === 'medium' ? '4-6 weeks' : '6-12 weeks'
  };
}

function getRemediationOptions(): RemediationStrategy[] {
  return [
    {
      strategy: 'Cover System',
      applicability: 'Gardens and soft landscaping over contaminated soils',
      cost: '£30-60/m²',
      duration: 'During construction'
    },
    {
      strategy: 'Soil Removal (Dig and Dump)',
      applicability: 'Localized hotspots of contamination',
      cost: '£150-300/m³',
      duration: 'Days to weeks depending on volume'
    },
    {
      strategy: 'In-situ Treatment',
      applicability: 'Groundwater contamination, organic compounds',
      cost: '£50-150/m³ treated',
      duration: 'Months to years'
    },
    {
      strategy: 'Capping/Encapsulation',
      applicability: 'Below buildings or hardstanding',
      cost: '£20-50/m²',
      duration: 'During construction'
    },
    {
      strategy: 'Vapor Barrier',
      applicability: 'Protection from ground gases or vapors',
      cost: '£15-40/m²',
      duration: 'During construction'
    },
    {
      strategy: 'Soil Import',
      applicability: 'Clean cover for gardens',
      cost: '£40-80/m³ imported',
      duration: 'During landscaping'
    }
  ];
}

function getRegulatoryFramework(): {
  legislation: string;
  guidance: string;
  enforcer: string;
}[] {
  return [
    {
      legislation: 'Part 2A Environmental Protection Act 1990',
      guidance: 'Defines contaminated land regime',
      enforcer: 'Camden Council Environmental Health'
    },
    {
      legislation: 'NPPF and Planning Practice Guidance',
      guidance: 'Requires land suitable for proposed use',
      enforcer: 'Camden Planning Authority'
    },
    {
      legislation: 'Building Regulations Part C',
      guidance: 'Site preparation and resistance to contaminants',
      enforcer: 'Building Control'
    },
    {
      legislation: 'Environmental Permitting Regulations',
      guidance: 'Groundwater protection',
      enforcer: 'Environment Agency'
    }
  ];
}

function getPlanningConditions(
  riskCategory: 'low' | 'medium' | 'high'
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

  conditions.push({
    condition: 'Contamination Investigation',
    timing: 'Pre-commencement',
    details: 'Phase 1 desk study (and Phase 2 if recommended)'
  });

  if (riskCategory !== 'low') {
    conditions.push({
      condition: 'Remediation Strategy',
      timing: 'Pre-commencement',
      details: 'Detailed remediation method statement if contamination found'
    });
  }

  conditions.push({
    condition: 'Verification Report',
    timing: 'Prior to occupation',
    details: 'Demonstrating remediation objectives achieved'
  });

  conditions.push({
    condition: 'Unexpected Contamination',
    timing: 'During works',
    details: 'Procedure for dealing with unforeseen contamination'
  });

  return conditions;
}

function getLocalFactors(postcode: string): string[] {
  const outcode = extractOutcode(postcode);
  const factors: string[] = [];

  factors.push('Camden Council Environmental Health is the contaminated land authority');
  factors.push('EA consultation required for groundwater impacts');

  const defaultHistory = AREA_HISTORICAL_USES['NW3']!;
  const areaHistory = AREA_HISTORICAL_USES[outcode] || defaultHistory;
  factors.push(areaHistory.notes);

  if (outcode === 'NW3') {
    factors.push('Limited industrial history in Hampstead');
    factors.push('Focus on garden soils and made ground');
  }

  if (outcode === 'NW6') {
    factors.push('Check for historical industrial uses');
    factors.push('Railway land contamination possible');
  }

  factors.push('Groundwater Source Protection Zones may apply');
  factors.push('Asbestos common in pre-1980s buildings');

  return factors;
}

async function assessContaminatedLand(
  address: string,
  postcode: string,
  projectType: string,
  projectDetails: ContaminatedProject = {}
): Promise<ContaminatedLandAssessment> {
  // Risk category
  const riskCategory = assessRiskCategory(postcode, projectDetails);

  // Potential sources
  const potentialSources = getPotentialSources(postcode, projectDetails);

  // Sensitive receptors
  const sensitiveReceptors = getSensitiveReceptors(projectDetails);

  // Assessment requirements
  const assessmentRequired = {
    phase1Required: true, // Almost always required for planning
    phase2Likely: riskCategory !== 'low',
    remediationLikely: riskCategory === 'high',
    reasoning: [
      riskCategory === 'low' ? 'Low risk - Phase 1 may confirm no further investigation needed' : '',
      riskCategory === 'medium' ? 'Medium risk - Phase 2 investigation likely required' : '',
      riskCategory === 'high' ? 'High risk - Comprehensive investigation and remediation likely' : '',
      projectDetails.gardens ? 'Garden soils require assessment' : '',
      projectDetails.basementExcavation ? 'Excavation increases exposure risk' : ''
    ].filter(r => r !== '')
  };

  // Phase 1
  const phase1Assessment = getPhase1Requirements(riskCategory);

  // Phase 2
  const phase2Assessment = getPhase2Requirements(riskCategory, projectDetails);

  // Potential contaminants
  const potentialContaminants = [
    {
      contaminant: 'Lead',
      sources: ['Paint', 'Petrol additives', 'Industrial processes'],
      healthRisks: ['Neurotoxicity', 'Developmental impacts in children'],
      standards: 'Residential with gardens: 200 mg/kg'
    },
    {
      contaminant: 'PAHs (Polyaromatic Hydrocarbons)',
      sources: ['Coal/ash', 'Combustion products', 'Petroleum'],
      healthRisks: ['Carcinogenic', 'Mutagenic'],
      standards: 'BaP equivalent: 0.5-5 mg/kg'
    },
    {
      contaminant: 'Petroleum Hydrocarbons',
      sources: ['Fuel storage', 'Vehicle maintenance', 'Spillages'],
      healthRisks: ['Vapor inhalation', 'Groundwater contamination'],
      standards: 'TPH: Risk-based assessment'
    },
    {
      contaminant: 'Asbestos',
      sources: ['Building materials', 'Demolition debris', 'Fly tipping'],
      healthRisks: ['Mesothelioma', 'Asbestosis'],
      standards: 'No visible free fibers'
    }
  ];

  // Remediation options
  const remediationOptions = getRemediationOptions();

  // Regulatory framework
  const regulatoryFramework = getRegulatoryFramework();

  // Planning conditions
  const planningRequirements = getPlanningConditions(riskCategory);

  // Timeline
  const timeline = [
    {
      phase: 'Phase 1 Desk Study',
      duration: phase1Assessment.duration,
      activities: phase1Assessment.scope
    },
    {
      phase: 'Phase 2 Investigation',
      duration: phase2Assessment.duration,
      activities: phase2Assessment.scope
    }
  ];

  if (riskCategory !== 'low') {
    timeline.push({
      phase: 'Remediation',
      duration: 'Variable',
      activities: ['Design', 'Implementation', 'Verification']
    });
  }

  // Costs
  const costs = [
    {
      item: 'Phase 1 Desk Study',
      range: phase1Assessment.cost,
      notes: 'Always recommended'
    },
    {
      item: 'Phase 2 Investigation',
      range: phase2Assessment.cost,
      notes: riskCategory === 'low' ? 'May not be required' : 'Likely required'
    },
    {
      item: 'Remediation',
      range: '£5,000-50,000+',
      notes: 'Highly variable - depends on extent'
    },
    {
      item: 'Verification',
      range: '£1,000-5,000',
      notes: 'Required to discharge conditions'
    }
  ];

  // Recommendations
  const recommendations: string[] = [];
  
  recommendations.push('Commission Phase 1 early to inform planning application');
  
  if (riskCategory !== 'low') {
    recommendations.push('Budget for Phase 2 investigation');
    recommendations.push('Allow contingency for remediation costs');
  }

  if (projectDetails.basementExcavation) {
    recommendations.push('Coordinate contamination assessment with structural surveys');
  }

  recommendations.push('Engage contaminated land specialist consultant');

  return {
    address,
    postcode,
    projectType,
    riskCategory,
    potentialSources,
    sensitiveReceptors,
    assessmentRequired,
    phase1Assessment,
    phase2Assessment,
    potentialContaminants,
    remediationOptions,
    regulatoryFramework,
    planningRequirements,
    localFactors: getLocalFactors(postcode),
    timeline,
    costs,
    recommendations
  };
}

// Export the service
const contaminatedLand = {
  assessContaminatedLand,
  AREA_HISTORICAL_USES,
  CONTAMINATION_SOURCES
};

export default contaminatedLand;
