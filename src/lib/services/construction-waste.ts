/**
 * Construction Waste Management Service
 * 
 * Provides Site Waste Management Plan (SWMP) guidance for
 * construction and demolition projects.
 * 
 * Coverage: NW1-NW11, N2, N6, N10 postcodes
 */

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

interface WasteProject {
  projectType?: 'extension' | 'loft' | 'basement' | 'refurbishment' | 'new_build' | 'demolition';
  projectValue?: number;
  demolitionRequired?: boolean;
  estimatedArea?: number;
  duration?: number;
  listedBuilding?: boolean;
  asbestosPresent?: boolean;
  contractorAppointed?: boolean;
}

interface WasteStream {
  material: string;
  source: string;
  estimatedQuantity: string;
  recyclable: boolean;
  disposalRoute: string;
  ewcCode: string;
}

interface WasteTarget {
  category: string;
  target: string;
  measure: string;
  responsibility: string;
}

interface WasteAnalysis {
  summary: WasteSummary;
  legalRequirements: LegalRequirements;
  wasteStreams: WasteStreamAssessment;
  wasteMinimization: MinimizationStrategy;
  segregationPlan: SegregationPlan;
  targetsSetting: TargetsSetting;
  logisticsPlanning: LogisticsPlanning;
  monitoringReporting: MonitoringPlan;
  hazardousWaste: HazardousWasteGuidance;
  costBenefit: CostBenefitAnalysis;
  conclusion: WasteConclusion;
  recommendations: string[];
}

interface WasteSummary {
  swmpRequired: boolean;
  estimatedWaste: string;
  recyclingTarget: string;
  keyActions: string[];
}

interface LegalRequirements {
  description: string;
  requirements: LegalRequirement[];
  registrations: string[];
}

interface LegalRequirement {
  regulation: string;
  requirement: string;
  applicability: string;
}

interface WasteStreamAssessment {
  description: string;
  streams: WasteStream[];
  totalEstimate: string;
}

interface MinimizationStrategy {
  description: string;
  designMeasures: string[];
  procurementMeasures: string[];
  constructionMeasures: string[];
}

interface SegregationPlan {
  description: string;
  categories: SegregationCategory[];
  siteLayout: string[];
}

interface SegregationCategory {
  category: string;
  containers: string;
  labeling: string;
  frequency: string;
}

interface TargetsSetting {
  description: string;
  targets: WasteTarget[];
  benchmarks: string[];
}

interface LogisticsPlanning {
  description: string;
  storageRequirements: string[];
  collectionFrequency: string;
  vehicleRouting: string;
  neighborConsiderations: string[];
}

interface MonitoringPlan {
  description: string;
  records: string[];
  reporting: string[];
  auditing: string;
}

interface HazardousWasteGuidance {
  description: string;
  potentialHazardous: string[];
  managementRequirements: string[];
  specialHandling: string[];
}

interface CostBenefitAnalysis {
  description: string;
  costFactors: string[];
  savingsOpportunities: string[];
  roi: string;
}

interface WasteConclusion {
  overallAssessment: string;
  swmpRecommended: boolean;
  planningConditions: string[];
}

// =============================================================================
// WASTE STREAMS DATABASE
// =============================================================================

const TYPICAL_WASTE_STREAMS: Record<string, WasteStream[]> = {
  extension: [
    { material: 'Concrete/brick', source: 'Foundation/walls', estimatedQuantity: '2-5 tonnes', recyclable: true, disposalRoute: 'Aggregate recycling', ewcCode: '17 01' },
    { material: 'Timber', source: 'Formwork/off-cuts', estimatedQuantity: '0.5-1 tonne', recyclable: true, disposalRoute: 'Biomass/recycling', ewcCode: '17 02 01' },
    { material: 'Packaging', source: 'Material delivery', estimatedQuantity: '0.3-0.5 tonnes', recyclable: true, disposalRoute: 'Recycling', ewcCode: '15 01' },
    { material: 'Plasterboard', source: 'Internal finish', estimatedQuantity: '0.2-0.5 tonnes', recyclable: true, disposalRoute: 'Plasterboard recycling', ewcCode: '17 08 02' },
    { material: 'Mixed waste', source: 'General construction', estimatedQuantity: '0.5-1 tonne', recyclable: false, disposalRoute: 'Transfer station', ewcCode: '17 09 04' }
  ],
  loft: [
    { material: 'Timber', source: 'Roof structure/boarding', estimatedQuantity: '0.3-0.8 tonnes', recyclable: true, disposalRoute: 'Biomass/recycling', ewcCode: '17 02 01' },
    { material: 'Insulation', source: 'Existing/new', estimatedQuantity: '0.1-0.3 tonnes', recyclable: false, disposalRoute: 'Landfill', ewcCode: '17 06 04' },
    { material: 'Plasterboard', source: 'Ceilings/walls', estimatedQuantity: '0.3-0.6 tonnes', recyclable: true, disposalRoute: 'Plasterboard recycling', ewcCode: '17 08 02' },
    { material: 'Packaging', source: 'Material delivery', estimatedQuantity: '0.2-0.3 tonnes', recyclable: true, disposalRoute: 'Recycling', ewcCode: '15 01' }
  ],
  basement: [
    { material: 'Excavated soil/clay', source: 'Basement dig', estimatedQuantity: '50-200 tonnes', recyclable: true, disposalRoute: 'Soil recycling/landfill', ewcCode: '17 05 04' },
    { material: 'Concrete', source: 'Underpinning/slab', estimatedQuantity: '2-5 tonnes', recyclable: true, disposalRoute: 'Aggregate recycling', ewcCode: '17 01 01' },
    { material: 'Mixed construction', source: 'General works', estimatedQuantity: '1-3 tonnes', recyclable: false, disposalRoute: 'Transfer station', ewcCode: '17 09 04' }
  ],
  demolition: [
    { material: 'Mixed demolition', source: 'Structure', estimatedQuantity: 'Variable (5-50+ tonnes)', recyclable: true, disposalRoute: 'Demolition recycling', ewcCode: '17 09 04' },
    { material: 'Concrete/masonry', source: 'Walls/foundations', estimatedQuantity: 'Variable', recyclable: true, disposalRoute: 'Aggregate recycling', ewcCode: '17 01' },
    { material: 'Timber', source: 'Roof/floors', estimatedQuantity: 'Variable', recyclable: true, disposalRoute: 'Biomass/recycling', ewcCode: '17 02 01' },
    { material: 'Metal', source: 'Steelwork/pipes', estimatedQuantity: 'Variable', recyclable: true, disposalRoute: 'Metal recycling', ewcCode: '17 04' }
  ]
};

// =============================================================================
// MAIN SERVICE FUNCTION
// =============================================================================

async function assessWasteManagement(
  address: string,
  postcode: string,
  projectType: string,
  projectDetails: WasteProject = {}
): Promise<WasteAnalysis> {
  const summary = generateSummary(projectDetails);
  const legalRequirements = assessLegalRequirements(projectDetails);
  const wasteStreams = assessWasteStreams(projectDetails);
  const wasteMinimization = developMinimizationStrategy(projectDetails);
  const segregationPlan = developSegregationPlan(projectDetails);
  const targetsSetting = setTargets(projectDetails);
  const logisticsPlanning = planLogistics(projectDetails);
  const monitoringReporting = developMonitoringPlan();
  const hazardousWaste = assessHazardousWaste(projectDetails);
  const costBenefit = analyzeCostBenefit(projectDetails);
  const conclusion = generateConclusion(summary, projectDetails);
  const recommendations = generateRecommendations(projectDetails);

  return {
    summary,
    legalRequirements,
    wasteStreams,
    wasteMinimization,
    segregationPlan,
    targetsSetting,
    logisticsPlanning,
    monitoringReporting,
    hazardousWaste,
    costBenefit,
    conclusion,
    recommendations
  };
}

// =============================================================================
// SUMMARY
// =============================================================================

function generateSummary(projectDetails: WasteProject): WasteSummary {
  const value = projectDetails.projectValue || 0;
  const swmpRequired = value >= 300000 || Boolean(projectDetails.demolitionRequired);

  const keyActions: string[] = [];
  if (swmpRequired) {
    keyActions.push('Prepare formal Site Waste Management Plan');
  }
  if (projectDetails.demolitionRequired) {
    keyActions.push('Pre-demolition audit required');
  }
  if (projectDetails.asbestosPresent) {
    keyActions.push('Licensed asbestos removal contractor required');
  }
  keyActions.push('Segregate waste streams on site');
  keyActions.push('Use licensed waste carriers only');

  return {
    swmpRequired,
    estimatedWaste: projectDetails.projectType === 'basement'
      ? '50-200 tonnes (primarily excavated material)'
      : projectDetails.demolitionRequired
        ? '10-50+ tonnes depending on scale'
        : '3-8 tonnes typical',
    recyclingTarget: '90% diversion from landfill achievable',
    keyActions
  };
}

// =============================================================================
// LEGAL REQUIREMENTS
// =============================================================================

function assessLegalRequirements(projectDetails: WasteProject): LegalRequirements {
  const requirements: LegalRequirement[] = [
    {
      regulation: 'Waste (England and Wales) Regulations 2011',
      requirement: 'Duty of Care for waste management',
      applicability: 'All construction projects'
    },
    {
      regulation: 'Environmental Protection Act 1990 (S34)',
      requirement: 'Waste carrier licensing',
      applicability: 'All waste movements'
    },
    {
      regulation: 'Hazardous Waste Regulations 2005',
      requirement: 'Consignment notes for hazardous waste',
      applicability: 'If hazardous waste produced'
    },
    {
      regulation: 'CL:AIRE Definition of Waste Code of Practice',
      requirement: 'Excavated materials reuse protocol',
      applicability: 'Basement/excavation projects'
    }
  ];

  const registrations: string[] = [
    'Check waste carriers are registered (Environment Agency)',
    'Register as waste producer if >500kg hazardous waste/year',
    'Obtain permit exemptions for crushing/screening on site'
  ];

  return {
    description: 'Legal requirements for construction waste management',
    requirements,
    registrations
  };
}

// =============================================================================
// WASTE STREAMS ASSESSMENT
// =============================================================================

function assessWasteStreams(projectDetails: WasteProject): WasteStreamAssessment {
  const projectType = projectDetails.projectType || 'extension';
  const defaultStreams: WasteStream[] = [
    { material: 'Mixed construction waste', source: 'General', estimatedQuantity: '1-3 tonnes', recyclable: false, disposalRoute: 'Transfer station', ewcCode: '17 09 04' }
  ];
  const streams = TYPICAL_WASTE_STREAMS[projectType] ?? defaultStreams;

  return {
    description: 'Assessment of expected waste streams',
    streams,
    totalEstimate: projectType === 'basement'
      ? '50-200 tonnes total'
      : projectType === 'demolition'
        ? 'Variable - pre-demolition audit required'
        : '3-8 tonnes total'
  };
}

// =============================================================================
// MINIMIZATION STRATEGY
// =============================================================================

function developMinimizationStrategy(projectDetails: WasteProject): MinimizationStrategy {
  return {
    description: 'Waste minimization hierarchy approach',
    designMeasures: [
      'Design to standard material dimensions',
      'Specify reclaimed/recycled materials where possible',
      'Use off-site prefabrication to reduce waste',
      'Design for deconstruction in future'
    ],
    procurementMeasures: [
      'Order accurate quantities (BIM/take-off)',
      'Specify take-back schemes for packaging',
      'Source materials with minimal packaging',
      'Consider material passports for future reuse'
    ],
    constructionMeasures: [
      'Central cutting station for timber',
      'Reuse formwork and temporary works',
      'Store materials properly to prevent damage',
      'Train operatives in waste segregation'
    ]
  };
}

// =============================================================================
// SEGREGATION PLAN
// =============================================================================

function developSegregationPlan(projectDetails: WasteProject): SegregationPlan {
  const categories: SegregationCategory[] = [
    {
      category: 'Inert (concrete, brick, tiles)',
      containers: '6-8 yard skip',
      labeling: 'Blue - INERT ONLY',
      frequency: 'Weekly or when full'
    },
    {
      category: 'Timber',
      containers: '4-6 yard skip or stillage',
      labeling: 'Green - TIMBER',
      frequency: 'Weekly or when full'
    },
    {
      category: 'Metal',
      containers: 'Stillage or dedicated area',
      labeling: 'Yellow - METAL',
      frequency: 'As required - valuable resource'
    },
    {
      category: 'Plasterboard',
      containers: 'Dedicated skip or bags',
      labeling: 'White - PLASTERBOARD ONLY',
      frequency: 'Keep separate - recycling requirement'
    },
    {
      category: 'Mixed general waste',
      containers: '4-6 yard skip',
      labeling: 'Red - GENERAL WASTE',
      frequency: 'Minimize through segregation'
    }
  ];

  if (projectDetails.asbestosPresent) {
    categories.push({
      category: 'Hazardous (asbestos)',
      containers: 'Sealed bags/wrapping',
      labeling: 'HAZARDOUS - ASBESTOS',
      frequency: 'Licensed contractor removal'
    });
  }

  return {
    description: 'On-site waste segregation plan',
    categories,
    siteLayout: [
      'Locate skips in accessible position for collection',
      'Provide clear signage at each container',
      'Keep hazardous waste separate and secure',
      'Allow space for vehicle access/turning',
      'Consider neighbor amenity - avoid boundaries'
    ]
  };
}

// =============================================================================
// TARGETS SETTING
// =============================================================================

function setTargets(projectDetails: WasteProject): TargetsSetting {
  const targets: WasteTarget[] = [
    {
      category: 'Overall diversion from landfill',
      target: '90%+',
      measure: 'Weight of materials recycled/recovered',
      responsibility: 'Principal Contractor'
    },
    {
      category: 'Plasterboard recycling',
      target: '100%',
      measure: 'All plasterboard to specialist recycler',
      responsibility: 'Site Manager'
    },
    {
      category: 'Timber recycling',
      target: '95%+',
      measure: 'Clean timber to biomass/recycling',
      responsibility: 'Site Manager'
    },
    {
      category: 'Inert materials',
      target: '100%',
      measure: 'All concrete/brick to aggregate recycling',
      responsibility: 'Demolition Contractor'
    },
    {
      category: 'Packaging waste',
      target: '85%+',
      measure: 'Return to supplier or recycle',
      responsibility: 'Procurement/Site'
    }
  ];

  return {
    description: 'Waste management targets',
    targets,
    benchmarks: [
      'BREEAM: <13.5m³ per 100m² floor area',
      'Considerate Constructors: 90%+ diversion',
      'WRAP Halving Waste to Landfill commitment'
    ]
  };
}

// =============================================================================
// LOGISTICS PLANNING
// =============================================================================

function planLogistics(projectDetails: WasteProject): LogisticsPlanning {
  return {
    description: 'Waste logistics planning',
    storageRequirements: [
      'Skip permits required for highway placement',
      'On-site storage if space permits',
      'Secure storage for high-value recyclables',
      'Covered storage for contamination prevention'
    ],
    collectionFrequency: 'Weekly or when containers 80% full',
    vehicleRouting: 'Agreed routes avoiding peak times, school runs',
    neighborConsiderations: [
      'Notify neighbors of skip locations',
      'Minimize early morning/evening collections',
      'Keep area clean and tidy',
      'Prevent windblown litter'
    ]
  };
}

// =============================================================================
// MONITORING PLAN
// =============================================================================

function developMonitoringPlan(): MonitoringPlan {
  return {
    description: 'Waste monitoring and reporting plan',
    records: [
      'Waste transfer notes (retained 2 years)',
      'Hazardous waste consignment notes (3 years)',
      'Quantities by waste stream',
      'Destination facilities and recovery rates'
    ],
    reporting: [
      'Monthly waste returns to client',
      'End of project waste summary',
      'BREEAM evidence if applicable',
      'Planning condition discharge evidence'
    ],
    auditing: 'Weekly site inspections, monthly waste audit'
  };
}

// =============================================================================
// HAZARDOUS WASTE
// =============================================================================

function assessHazardousWaste(projectDetails: WasteProject): HazardousWasteGuidance {
  const potentialHazardous: string[] = [];
  
  if (projectDetails.asbestosPresent || projectDetails.demolitionRequired) {
    potentialHazardous.push('Asbestos containing materials');
  }
  potentialHazardous.push(
    'Lead paint (pre-1970s buildings)',
    'Fluorescent tubes and lamps',
    'Oil contaminated materials',
    'Treated timber (CCA/creosote)',
    'Contaminated soils'
  );

  return {
    description: 'Hazardous waste identification and management',
    potentialHazardous,
    managementRequirements: [
      'Asbestos survey before any demolition/refurbishment',
      'Licensed asbestos contractor for removal',
      'Consignment notes for all hazardous waste',
      'Producer registration if >500kg/year',
      'Authorized site only for disposal'
    ],
    specialHandling: [
      'Asbestos: HSE licensed contractor only',
      'Lead paint: Controlled stripping, respiratory protection',
      'Oils: Contained, specialist collection',
      'WEEE: Separate collection for recycling'
    ]
  };
}

// =============================================================================
// COST BENEFIT
// =============================================================================

function analyzeCostBenefit(projectDetails: WasteProject): CostBenefitAnalysis {
  return {
    description: 'Cost-benefit analysis of waste management',
    costFactors: [
      'Skip hire costs',
      'Gate fees at disposal facilities',
      'Landfill tax (currently £102.10/tonne)',
      'Hazardous waste disposal premiums',
      'Labor for segregation'
    ],
    savingsOpportunities: [
      'Reduced landfill tax through segregation',
      'Metal scrap value (income)',
      'Lower gate fees for clean streams',
      'Avoiding fines for non-compliance',
      'Material reuse on site'
    ],
    roi: 'Proper segregation typically saves 20-30% on disposal costs'
  };
}

// =============================================================================
// CONCLUSION
// =============================================================================

function generateConclusion(
  summary: WasteSummary,
  projectDetails: WasteProject
): WasteConclusion {
  return {
    overallAssessment: 'Effective waste management achievable with planning',
    swmpRecommended: summary.swmpRequired || (projectDetails.projectValue || 0) > 100000,
    planningConditions: [
      'Construction Management Plan (waste section)',
      'Details of waste storage and collection',
      'Pre-demolition audit (if demolition proposed)'
    ]
  };
}

// =============================================================================
// RECOMMENDATIONS
// =============================================================================

function generateRecommendations(projectDetails: WasteProject): string[] {
  const recommendations = [
    'Prepare Site Waste Management Plan before works start',
    'Register with licensed waste carriers only',
    'Segregate minimum 4 streams on site',
    'Set target of 90%+ diversion from landfill',
    'Keep waste transfer notes for 2+ years'
  ];

  if (projectDetails.demolitionRequired) {
    recommendations.push('Commission pre-demolition audit');
    recommendations.push('Arrange R&D refurbishment/demolition asbestos survey');
  }

  if (projectDetails.projectType === 'basement') {
    recommendations.push('Consider CL:AIRE Materials Management Plan for excavated soils');
    recommendations.push('Arrange soil testing before disposal classification');
  }

  if (projectDetails.listedBuilding) {
    recommendations.push('Salvage historic materials for reuse/sale');
    recommendations.push('Document materials removed for heritage record');
  }

  return recommendations;
}

// =============================================================================
// EXPORTS
// =============================================================================

const constructionWasteManagement = {
  assessWasteManagement,
  TYPICAL_WASTE_STREAMS
};

export default constructionWasteManagement;
