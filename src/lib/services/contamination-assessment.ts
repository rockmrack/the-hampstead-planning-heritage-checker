/**
 * Land Contamination Assessment Service
 * 
 * Provides preliminary contamination risk assessment guidance for
 * development sites including Phase 1 desktop study content.
 * 
 * Coverage: NW1-NW11, N2, N6, N10 postcodes
 */

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

interface ContaminationProject {
  propertyType?: 'residential' | 'commercial' | 'mixed_use' | 'garden';
  siteHistory?: string[];
  currentUse?: string;
  proposedUse?: 'residential_garden' | 'residential_no_garden' | 'commercial' | 'open_space';
  hasBasement?: boolean;
  groundworkExtent?: 'minor' | 'moderate' | 'extensive';
  knownContamination?: boolean;
  nearIndustrial?: boolean;
}

interface PotentialContaminant {
  contaminant: string;
  sources: string[];
  pathways: string[];
  receptors: string[];
  riskLevel: 'low' | 'medium' | 'high';
}

interface HistoricalUse {
  period: string;
  use: string;
  contaminationPotential: string;
  concernLevel: 'none' | 'low' | 'moderate' | 'high';
}

interface ContaminationAnalysis {
  summary: ContaminationSummary;
  siteContext: SiteContext;
  historicalAssessment: HistoricalAssessment;
  geologicalContext: GeologicalContext;
  contaminantLinkages: ContaminantLinkageAssessment;
  riskAssessment: ContaminationRiskAssessment;
  investigationRequirements: InvestigationRequirements;
  remediationGuidance: RemediationGuidance;
  regulatoryContext: RegulatoryContext;
  conclusion: ContaminationConclusion;
  recommendations: string[];
}

interface ContaminationSummary {
  riskLevel: string;
  assessmentRequired: string;
  keyConsiderations: string[];
  planningConditions: string[];
}

interface SiteContext {
  description: string;
  currentUse: string;
  surroundingUses: string[];
  sensitiveReceptors: string[];
}

interface HistoricalAssessment {
  description: string;
  historicalUses: HistoricalUse[];
  potentialSources: string[];
  dataGaps: string[];
}

interface GeologicalContext {
  description: string;
  superficialDeposits: string;
  bedrock: string;
  groundwater: string;
  madeGround: string;
}

interface ContaminantLinkageAssessment {
  description: string;
  linkages: PotentialContaminant[];
  completePathways: string[];
}

interface ContaminationRiskAssessment {
  description: string;
  humanHealth: RiskCategory;
  controlledWaters: RiskCategory;
  buildingMaterials: RiskCategory;
  overallRisk: string;
}

interface RiskCategory {
  riskLevel: 'low' | 'medium' | 'high';
  justification: string;
  pathways: string[];
}

interface InvestigationRequirements {
  description: string;
  phase1Required: boolean;
  phase2Required: boolean;
  scope: string[];
  testingRequirements: string[];
}

interface RemediationGuidance {
  description: string;
  likelyRequirements: string[];
  commonMeasures: string[];
  verificationNeeded: string;
}

interface RegulatoryContext {
  description: string;
  requirements: RegulatoryRequirement[];
  consultees: string[];
}

interface RegulatoryRequirement {
  regulation: string;
  requirement: string;
  applicability: string;
}

interface ContaminationConclusion {
  overallAssessment: string;
  feasibility: 'feasible' | 'feasible_with_conditions' | 'requires_investigation';
  conditions: string[];
}

// =============================================================================
// HISTORICAL USE DATABASE
// =============================================================================

const HISTORICAL_USES_RISK: Record<string, { risk: string; contaminants: string[] }> = {
  residential: {
    risk: 'Low',
    contaminants: ['Asbestos in buildings', 'Lead paint', 'Coal ash in gardens']
  },
  industrial: {
    risk: 'High',
    contaminants: ['Heavy metals', 'Hydrocarbons', 'Solvents', 'Asbestos']
  },
  petrol_station: {
    risk: 'High',
    contaminants: ['Petroleum hydrocarbons', 'BTEX compounds', 'Lead']
  },
  dry_cleaning: {
    risk: 'High',
    contaminants: ['Chlorinated solvents', 'Tetrachloroethene (PCE)']
  },
  garage_workshop: {
    risk: 'Medium-High',
    contaminants: ['Hydrocarbons', 'Oils', 'Solvents', 'Heavy metals']
  },
  laundry: {
    risk: 'Medium',
    contaminants: ['Detergents', 'Chlorinated solvents']
  },
  railway: {
    risk: 'High',
    contaminants: ['Hydrocarbons', 'Heavy metals', 'Asbestos', 'PCBs']
  },
  agricultural: {
    risk: 'Low-Medium',
    contaminants: ['Pesticides', 'Fertilizers', 'Animal waste']
  },
  hospital: {
    risk: 'Medium-High',
    contaminants: ['Pharmaceuticals', 'Radioactive materials', 'Chemical waste']
  },
  unknown: {
    risk: 'Unknown',
    contaminants: ['Investigation required to determine']
  }
};

// =============================================================================
// LONDON CLAY GEOLOGICAL CONTEXT
// =============================================================================

const LONDON_GEOLOGY = {
  hampstead: {
    superficial: 'Claygate Member / London Clay Formation',
    bedrock: 'London Clay Formation',
    aquifer: 'Non-aquifer - Secondary (undifferentiated)',
    spz: 'Not within Source Protection Zone',
    madeGround: 'Variable - typically 0.5-2m in developed areas'
  }
};

// =============================================================================
// MAIN SERVICE FUNCTION
// =============================================================================

async function assessContamination(
  address: string,
  postcode: string,
  projectType: string,
  projectDetails: ContaminationProject = {}
): Promise<ContaminationAnalysis> {
  const summary = generateSummary(projectDetails);
  const siteContext = assessSiteContext(projectDetails);
  const historicalAssessment = assessHistorical(projectDetails);
  const geologicalContext = assessGeology(postcode);
  const contaminantLinkages = assessLinkages(projectDetails);
  const riskAssessment = assessRisk(projectDetails, historicalAssessment);
  const investigationRequirements = determineInvestigation(riskAssessment);
  const remediationGuidance = provideRemediationGuidance(projectDetails);
  const regulatoryContext = assessRegulatory(projectDetails);
  const conclusion = generateConclusion(riskAssessment);
  const recommendations = generateRecommendations(projectDetails, riskAssessment);

  return {
    summary,
    siteContext,
    historicalAssessment,
    geologicalContext,
    contaminantLinkages,
    riskAssessment,
    investigationRequirements,
    remediationGuidance,
    regulatoryContext,
    conclusion,
    recommendations
  };
}

// =============================================================================
// SUMMARY
// =============================================================================

function generateSummary(projectDetails: ContaminationProject): ContaminationSummary {
  const considerations: string[] = [];
  const conditions: string[] = [];

  if (projectDetails.knownContamination) {
    considerations.push('Known contamination requires detailed assessment');
    conditions.push('Phase 2 intrusive investigation');
  }
  if (projectDetails.nearIndustrial) {
    considerations.push('Proximity to industrial uses - potential off-site sources');
  }
  if (projectDetails.hasBasement) {
    considerations.push('Basement construction - ground gas and groundwater considerations');
    conditions.push('Ground gas risk assessment');
  }
  if (projectDetails.proposedUse === 'residential_garden') {
    considerations.push('Residential with gardens - most sensitive end use');
    conditions.push('Soil testing for garden areas');
  }

  const riskLevel = projectDetails.knownContamination
    ? 'Medium-High'
    : projectDetails.nearIndustrial
      ? 'Medium'
      : 'Low-Medium';

  return {
    riskLevel,
    assessmentRequired: riskLevel === 'Low-Medium'
      ? 'Desk study recommended'
      : 'Phase 1 and likely Phase 2 assessment required',
    keyConsiderations: considerations.length > 0
      ? considerations
      : ['Standard residential development - limited contamination risk'],
    planningConditions: conditions.length > 0
      ? conditions
      : ['Standard contamination condition likely']
  };
}

// =============================================================================
// SITE CONTEXT
// =============================================================================

function assessSiteContext(projectDetails: ContaminationProject): SiteContext {
  return {
    description: 'Assessment of current site conditions and context',
    currentUse: projectDetails.currentUse || 'Residential',
    surroundingUses: [
      'Residential properties',
      'Local roads',
      'Gardens and amenity space'
    ],
    sensitiveReceptors: [
      'Future site users',
      'Construction workers',
      'Neighboring residents',
      'Groundwater (where vulnerable)',
      'Building materials'
    ]
  };
}

// =============================================================================
// HISTORICAL ASSESSMENT
// =============================================================================

function assessHistorical(projectDetails: ContaminationProject): HistoricalAssessment {
  const historicalUses: HistoricalUse[] = [
    {
      period: 'Pre-1850',
      use: 'Agricultural land / Hampstead Heath edge',
      contaminationPotential: 'Low - natural soil conditions',
      concernLevel: 'none'
    },
    {
      period: '1850-1914',
      use: 'Victorian residential development',
      contaminationPotential: 'Low - domestic use, possible coal ash',
      concernLevel: 'low'
    },
    {
      period: '1914-present',
      use: 'Continued residential use',
      contaminationPotential: 'Low - domestic activities only',
      concernLevel: 'low'
    }
  ];

  const potentialSources: string[] = [
    'Made ground from historic development',
    'Coal ash in garden soils (Victorian/Edwardian)',
    'Asbestos in building fabric (if pre-2000)',
    'Lead paint (older properties)',
    'Historic fuel storage (possible)'
  ];

  if (projectDetails.siteHistory?.includes('commercial')) {
    historicalUses.push({
      period: 'Unknown',
      use: 'Commercial activities identified',
      contaminationPotential: 'Medium - requires investigation',
      concernLevel: 'moderate'
    });
    potentialSources.push('Commercial contamination sources');
  }

  return {
    description: 'Desktop assessment of historical land uses',
    historicalUses,
    potentialSources,
    dataGaps: [
      'Detailed historical Ordnance Survey review recommended',
      'Trade directories check for commercial uses',
      'Council contaminated land register check'
    ]
  };
}

// =============================================================================
// GEOLOGICAL CONTEXT
// =============================================================================

function assessGeology(postcode: string): GeologicalContext {
  const geology = LONDON_GEOLOGY.hampstead;

  return {
    description: 'Geological and hydrogeological context',
    superficialDeposits: geology.superficial,
    bedrock: geology.bedrock,
    groundwater: `${geology.aquifer}. ${geology.spz}`,
    madeGround: geology.madeGround
  };
}

// =============================================================================
// CONTAMINANT LINKAGES
// =============================================================================

function assessLinkages(projectDetails: ContaminationProject): ContaminantLinkageAssessment {
  const linkages: PotentialContaminant[] = [
    {
      contaminant: 'Made ground / fill materials',
      sources: ['Historic development', 'Garden improvement'],
      pathways: ['Direct contact', 'Ingestion', 'Inhalation of dust'],
      receptors: ['Construction workers', 'Future residents'],
      riskLevel: 'low'
    },
    {
      contaminant: 'Asbestos (if demolition)',
      sources: ['Building materials', 'Insulation', 'Roofing'],
      pathways: ['Inhalation of fibers'],
      receptors: ['Construction workers'],
      riskLevel: 'medium'
    }
  ];

  if (projectDetails.hasBasement) {
    linkages.push({
      contaminant: 'Ground gases (CO2, methane)',
      sources: ['Made ground', 'Organic material'],
      pathways: ['Migration into building'],
      receptors: ['Building occupants'],
      riskLevel: 'low'
    });
  }

  return {
    description: 'Assessment of source-pathway-receptor linkages',
    linkages,
    completePathways: [
      'Direct contact with soils during construction',
      'Ingestion of soil/dust for garden users',
      'Dermal contact with soils'
    ]
  };
}

// =============================================================================
// RISK ASSESSMENT
// =============================================================================

function assessRisk(
  projectDetails: ContaminationProject,
  historical: HistoricalAssessment
): ContaminationRiskAssessment {
  const hasHighConcern = historical.historicalUses.some(u => u.concernLevel === 'high');
  const hasModConcern = historical.historicalUses.some(u => u.concernLevel === 'moderate');

  return {
    description: 'Preliminary contamination risk assessment',
    humanHealth: {
      riskLevel: hasHighConcern ? 'high' : hasModConcern ? 'medium' : 'low',
      justification: 'Risk to future residents from potential contaminated soils',
      pathways: ['Direct contact', 'Ingestion', 'Inhalation']
    },
    controlledWaters: {
      riskLevel: 'low',
      justification: 'London Clay provides significant protection to deeper aquifers',
      pathways: ['Limited vertical migration through clay']
    },
    buildingMaterials: {
      riskLevel: 'low',
      justification: 'Standard concrete/water pipe materials unless specific contamination identified',
      pathways: ['Contact with aggressive ground conditions']
    },
    overallRisk: hasHighConcern ? 'Medium-High' : hasModConcern ? 'Medium' : 'Low'
  };
}

// =============================================================================
// INVESTIGATION REQUIREMENTS
// =============================================================================

function determineInvestigation(risk: ContaminationRiskAssessment): InvestigationRequirements {
  const phase2Required = risk.overallRisk === 'Medium-High' || risk.overallRisk === 'Medium';

  const scope: string[] = [
    'Review of historical maps (1850-present)',
    'Environmental database search (Landmark/Groundsure)',
    'Council contaminated land register check',
    'Site walkover and inspection'
  ];

  if (phase2Required) {
    scope.push(
      'Trial pit/window sample investigation',
      'Soil chemical testing',
      'Ground gas monitoring (if basement proposed)'
    );
  }

  return {
    description: 'Requirements for contamination investigation',
    phase1Required: true,
    phase2Required,
    scope,
    testingRequirements: phase2Required
      ? ['Metals suite', 'Hydrocarbons', 'Asbestos screening', 'pH/sulfate']
      : ['None required until Phase 1 complete']
  };
}

// =============================================================================
// REMEDIATION GUIDANCE
// =============================================================================

function provideRemediationGuidance(projectDetails: ContaminationProject): RemediationGuidance {
  const likelyRequirements: string[] = [];
  const commonMeasures: string[] = [];

  if (projectDetails.proposedUse === 'residential_garden') {
    likelyRequirements.push('Clean cover system for garden areas');
    commonMeasures.push('600mm clean topsoil over geotextile');
  }

  if (projectDetails.hasBasement) {
    likelyRequirements.push('Ground gas protection measures');
    commonMeasures.push('Gas membrane in floor slab', 'Passive ventilation');
  }

  commonMeasures.push(
    'Materials management plan for excavated soils',
    'Watching brief during excavation',
    'Asbestos survey before demolition'
  );

  return {
    description: 'Guidance on likely remediation requirements',
    likelyRequirements: likelyRequirements.length > 0
      ? likelyRequirements
      : ['Minimal remediation likely - subject to investigation'],
    commonMeasures,
    verificationNeeded: 'Verification report required to discharge contamination condition'
  };
}

// =============================================================================
// REGULATORY CONTEXT
// =============================================================================

function assessRegulatory(projectDetails: ContaminationProject): RegulatoryContext {
  return {
    description: 'Regulatory framework for contaminated land',
    requirements: [
      {
        regulation: 'Part 2A Environmental Protection Act 1990',
        requirement: 'Identification and remediation of contaminated land',
        applicability: 'Applies if land designated as contaminated'
      },
      {
        regulation: 'NPPF (2023)',
        requirement: 'Adequate site investigation and remediation',
        applicability: 'Planning condition for contamination'
      },
      {
        regulation: 'Building Regulations Approved Document C',
        requirement: 'Protection from contaminants',
        applicability: 'Building Control requirement'
      },
      {
        regulation: 'Construction (Design and Management) Regulations 2015',
        requirement: 'Health and safety during construction',
        applicability: 'Where contamination may affect workers'
      }
    ],
    consultees: [
      'Local Authority Environmental Health',
      'Environment Agency (if controlled waters at risk)',
      'Building Control'
    ]
  };
}

// =============================================================================
// CONCLUSION
// =============================================================================

function generateConclusion(risk: ContaminationRiskAssessment): ContaminationConclusion {
  return {
    overallAssessment: risk.overallRisk === 'Low'
      ? 'Low contamination risk - standard approach acceptable'
      : 'Investigation required to fully characterize contamination risk',
    feasibility: risk.overallRisk === 'Medium-High'
      ? 'requires_investigation'
      : risk.overallRisk === 'Medium'
        ? 'feasible_with_conditions'
        : 'feasible',
    conditions: [
      'Standard contamination planning condition expected',
      'Phase 1 desk study to accompany application or as pre-commencement',
      'Verification report required post-remediation'
    ]
  };
}

// =============================================================================
// RECOMMENDATIONS
// =============================================================================

function generateRecommendations(
  projectDetails: ContaminationProject,
  risk: ContaminationRiskAssessment
): string[] {
  const recommendations = [
    'Commission Phase 1 Preliminary Risk Assessment',
    'Check council contaminated land register',
    'Obtain environmental data search (Groundsure/Landmark)'
  ];

  if (risk.overallRisk !== 'Low') {
    recommendations.push(
      'Budget for Phase 2 intrusive investigation',
      'Allow programme time for testing and assessment'
    );
  }

  if (projectDetails.hasBasement) {
    recommendations.push('Include ground gas assessment in investigation scope');
  }

  recommendations.push(
    'Engage qualified geo-environmental consultant',
    'Discuss contamination requirements with planning officer early'
  );

  return recommendations;
}

// =============================================================================
// EXPORTS
// =============================================================================

const contaminationAssessment = {
  assessContamination,
  HISTORICAL_USES_RISK,
  LONDON_GEOLOGY
};

export default contaminationAssessment;
