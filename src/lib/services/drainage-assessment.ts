/**
 * Drainage and Flood Risk Assessment Service
 * 
 * Analyzes flood risk and surface water drainage requirements
 * for proposed developments in the Hampstead area.
 * 
 * Coverage: NW1-NW11, N2, N6, N10 postcodes
 */

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

interface DrainageProject {
  propertyType?: 'detached' | 'semi_detached' | 'terraced' | 'flat';
  projectType?: 'extension' | 'loft' | 'basement' | 'new_build' | 'paving';
  siteArea?: number; // square meters
  additionalHardstanding?: number;
  basementProposed?: boolean;
  gardenArea?: number;
  existingDrainage?: 'combined' | 'separate' | 'unknown';
  nearWatercourse?: boolean;
}

interface FloodZone {
  zone: '1' | '2' | '3a' | '3b';
  description: string;
  probability: string;
  restrictions: string[];
}

interface SuDSComponent {
  type: string;
  description: string;
  suitability: 'high' | 'medium' | 'low';
  benefits: string[];
  considerations: string[];
}

interface DrainageAnalysis {
  summary: DrainageSummary;
  floodRiskAssessment: FloodRiskAssessment;
  surfaceWaterDrainage: SurfaceWaterAssessment;
  sudsStrategy: SuDSStrategy;
  basementConsiderations: BasementDrainageAssessment;
  sewerConnection: SewerAssessment;
  groundwaterAssessment: GroundwaterAssessment;
  calculationSummary: DrainageCalculations;
  regulatoryCompliance: DrainageCompliance[];
  conclusion: DrainageConclusion;
  recommendations: string[];
}

interface DrainageSummary {
  floodZone: string;
  floodRisk: string;
  drainageStrategy: string;
  keyRequirements: string[];
}

interface FloodRiskAssessment {
  description: string;
  floodZone: FloodZone;
  sourcesOfFlooding: FloodSource[];
  sequentialTest: string;
  exceptionTest: string;
  residualRisk: string;
}

interface FloodSource {
  source: string;
  risk: 'low' | 'medium' | 'high';
  description: string;
}

interface SurfaceWaterAssessment {
  description: string;
  existingSituation: string;
  proposedChange: string;
  runoffIncrease: string;
  managementRequired: boolean;
}

interface SuDSStrategy {
  description: string;
  hierarchy: string[];
  components: SuDSComponent[];
  maintenancePlan: string;
  adoptionRoute: string;
}

interface BasementDrainageAssessment {
  applicable: boolean;
  description: string;
  waterproofing: string;
  pumping: string;
  floodResilience: string[];
}

interface SewerAssessment {
  existingConnection: string;
  proposedConnection: string;
  thamesWaterRequirements: string[];
  separationRequired: boolean;
}

interface GroundwaterAssessment {
  description: string;
  level: string;
  basementImpact: string;
  mitigationRequired: boolean;
}

interface DrainageCalculations {
  description: string;
  existingRunoff: string;
  proposedRunoff: string;
  attenuation: string;
  dischargeRate: string;
}

interface DrainageCompliance {
  regulation: string;
  requirement: string;
  compliance: 'complies' | 'partial' | 'requires_assessment';
  notes: string;
}

interface DrainageConclusion {
  overallAssessment: string;
  floodRiskAcceptable: boolean;
  drainageAchievable: boolean;
  conditions: string[];
}

// =============================================================================
// FLOOD ZONE DATA
// =============================================================================

const FLOOD_ZONES: Record<string, FloodZone> = {
  '1': {
    zone: '1',
    description: 'Low probability',
    probability: 'Less than 0.1% (1 in 1000) annual probability of flooding',
    restrictions: ['No flood-related restrictions on development']
  },
  '2': {
    zone: '2',
    description: 'Medium probability',
    probability: '0.1-1% (1 in 100 to 1 in 1000) annual probability',
    restrictions: ['Site-specific FRA required', 'Sequential test may apply']
  },
  '3a': {
    zone: '3a',
    description: 'High probability',
    probability: 'Greater than 1% (1 in 100) annual probability',
    restrictions: ['Full FRA required', 'Sequential and exception tests required', 'Flood resilience measures']
  },
  '3b': {
    zone: '3b',
    description: 'Functional floodplain',
    probability: 'Land where water has to flow or be stored in times of flood',
    restrictions: ['Only water-compatible uses', 'Essential infrastructure with exception test']
  }
};

// =============================================================================
// SUDS COMPONENTS
// =============================================================================

const SUDS_COMPONENTS: SuDSComponent[] = [
  {
    type: 'Green roof',
    description: 'Vegetated roof covering',
    suitability: 'high',
    benefits: ['Reduces runoff', 'Biodiversity', 'Thermal insulation', 'Aesthetics'],
    considerations: ['Structural loading', 'Maintenance access', 'Plant establishment']
  },
  {
    type: 'Rainwater harvesting',
    description: 'Collection and reuse of rainwater',
    suitability: 'high',
    benefits: ['Water reuse', 'Reduces mains demand', 'Attenuation'],
    considerations: ['Tank sizing', 'Overflow connection', 'Treatment if reused']
  },
  {
    type: 'Permeable paving',
    description: 'Porous or permeable surfacing',
    suitability: 'high',
    benefits: ['Infiltration', 'No visible water', 'Maintains parking use'],
    considerations: ['Ground conditions', 'Maintenance regime', 'Sub-base design']
  },
  {
    type: 'Rain gardens',
    description: 'Planted depressions collecting runoff',
    suitability: 'medium',
    benefits: ['Biodiversity', 'Amenity', 'Water quality treatment'],
    considerations: ['Space requirement', 'Soil conditions', 'Plant selection']
  },
  {
    type: 'Soakaways',
    description: 'Underground infiltration chambers',
    suitability: 'medium',
    benefits: ['No surface space needed', 'Proven technology'],
    considerations: ['Soil permeability', 'Water table depth', 'Maintenance access']
  },
  {
    type: 'Attenuation tank',
    description: 'Underground storage with controlled discharge',
    suitability: 'high',
    benefits: ['High storage volume', 'No surface impact', 'Flow control'],
    considerations: ['Excavation required', 'Hydrobrake sizing', 'Connection to sewer']
  }
];

// =============================================================================
// MAIN SERVICE FUNCTION
// =============================================================================

async function assessDrainage(
  address: string,
  postcode: string,
  projectType: string,
  projectDetails: DrainageProject = {}
): Promise<DrainageAnalysis> {
  const summary = generateSummary(postcode, projectDetails);
  const floodRiskAssessment = assessFloodRisk(postcode, projectDetails);
  const surfaceWaterDrainage = assessSurfaceWater(projectDetails);
  const sudsStrategy = developSuDSStrategy(projectDetails);
  const basementConsiderations = assessBasementDrainage(projectDetails);
  const sewerConnection = assessSewerConnection(projectDetails);
  const groundwaterAssessment = assessGroundwater(projectDetails);
  const calculationSummary = calculateDrainage(projectDetails);
  const regulatoryCompliance = assessCompliance(projectDetails);
  const conclusion = generateConclusion(floodRiskAssessment, surfaceWaterDrainage);
  const recommendations = generateRecommendations(projectDetails);

  return {
    summary,
    floodRiskAssessment,
    surfaceWaterDrainage,
    sudsStrategy,
    basementConsiderations,
    sewerConnection,
    groundwaterAssessment,
    calculationSummary,
    regulatoryCompliance,
    conclusion,
    recommendations
  };
}

// =============================================================================
// SUMMARY
// =============================================================================

function generateSummary(
  postcode: string,
  projectDetails: DrainageProject
): DrainageSummary {
  const requirements: string[] = ['Sustainable drainage (SuDS)'];
  if (projectDetails.basementProposed) requirements.push('Basement waterproofing');
  if (projectDetails.additionalHardstanding && projectDetails.additionalHardstanding > 5) {
    requirements.push('Surface water management');
  }

  return {
    floodZone: 'Flood Zone 1 (Low Probability)',
    floodRisk: 'Low - site not at significant flood risk',
    drainageStrategy: 'SuDS-based surface water management',
    keyRequirements: requirements
  };
}

// =============================================================================
// FLOOD RISK ASSESSMENT
// =============================================================================

function assessFloodRisk(
  postcode: string,
  projectDetails: DrainageProject
): FloodRiskAssessment {
  // Hampstead is predominantly Flood Zone 1 (elevated position)
  const defaultFloodZone: FloodZone = {
    zone: '1',
    description: 'Low probability',
    probability: 'Less than 0.1% (1 in 1000) annual probability of flooding',
    restrictions: ['No flood-related restrictions on development']
  };
  const floodZone = FLOOD_ZONES['1'] || defaultFloodZone;

  const sources: FloodSource[] = [
    {
      source: 'Fluvial (river) flooding',
      risk: 'low',
      description: 'Site elevated above local watercourses'
    },
    {
      source: 'Surface water flooding',
      risk: 'low',
      description: 'Some localized ponding possible on sloping sites'
    },
    {
      source: 'Groundwater flooding',
      risk: projectDetails.basementProposed ? 'medium' : 'low',
      description: 'Perched water table possible in London Clay'
    },
    {
      source: 'Sewer flooding',
      risk: 'low',
      description: 'Combined sewer system - capacity improvements ongoing'
    }
  ];

  return {
    description: 'Assessment of flood risk from all sources',
    floodZone,
    sourcesOfFlooding: sources,
    sequentialTest: 'Not required - site in Flood Zone 1',
    exceptionTest: 'Not required - site in Flood Zone 1',
    residualRisk: 'Low residual risk - standard precautions appropriate'
  };
}

// =============================================================================
// SURFACE WATER ASSESSMENT
// =============================================================================

function assessSurfaceWater(projectDetails: DrainageProject): SurfaceWaterAssessment {
  const additionalHardstanding = projectDetails.additionalHardstanding || 0;
  const siteArea = projectDetails.siteArea || 200;

  return {
    description: 'Surface water drainage assessment',
    existingSituation: 'Gardens draining to ground; roofs and paving to combined sewer',
    proposedChange: additionalHardstanding > 0
      ? `Additional ${additionalHardstanding}m² impermeable area`
      : 'No significant change to impermeable area',
    runoffIncrease: additionalHardstanding > 10
      ? 'Moderate increase - SuDS required'
      : 'Minor increase - manageable with garden drainage',
    managementRequired: additionalHardstanding > 5
  };
}

// =============================================================================
// SUDS STRATEGY
// =============================================================================

function developSuDSStrategy(projectDetails: DrainageProject): SuDSStrategy {
  const components = SUDS_COMPONENTS.filter(c => {
    if (projectDetails.gardenArea && projectDetails.gardenArea < 50 && c.type === 'Rain gardens') {
      return false;
    }
    return c.suitability === 'high' || c.suitability === 'medium';
  }).slice(0, 4);

  return {
    description: 'Sustainable Drainage System strategy following SuDS hierarchy',
    hierarchy: [
      '1. Store rainwater for reuse (rainwater harvesting)',
      '2. Infiltrate to ground where possible (soakaways, permeable paving)',
      '3. Attenuate and discharge at controlled rate to watercourse/sewer',
      '4. Controlled discharge to sewer as last resort'
    ],
    components,
    maintenancePlan: 'Maintenance schedule required for SuDS components',
    adoptionRoute: 'Private maintenance by owner (residential) or adoption by council (if major)'
  };
}

// =============================================================================
// BASEMENT DRAINAGE
// =============================================================================

function assessBasementDrainage(projectDetails: DrainageProject): BasementDrainageAssessment {
  const applicable = Boolean(projectDetails.basementProposed);

  return {
    applicable,
    description: applicable
      ? 'Basement drainage and waterproofing assessment'
      : 'No basement proposed - assessment not applicable',
    waterproofing: applicable
      ? 'Type C waterproofing (drained cavity) recommended with Type A backup'
      : 'N/A',
    pumping: applicable
      ? 'Sump and pump system required for below-ground drainage'
      : 'N/A',
    floodResilience: applicable ? [
      'Flood resilient construction below DPC level',
      'Sump pump with battery backup',
      'Non-return valves on drainage',
      'Waterproof electrical installations'
    ] : []
  };
}

// =============================================================================
// SEWER ASSESSMENT
// =============================================================================

function assessSewerConnection(projectDetails: DrainageProject): SewerAssessment {
  const separation = projectDetails.existingDrainage !== 'separate';

  return {
    existingConnection: projectDetails.existingDrainage === 'combined'
      ? 'Combined sewer system'
      : projectDetails.existingDrainage === 'separate'
        ? 'Separate foul and surface water systems'
        : 'Assumed combined sewer (typical for area)',
    proposedConnection: 'Surface water to SuDS/attenuated discharge; foul to combined sewer',
    thamesWaterRequirements: [
      'Build-over agreement if within 3m of public sewer',
      'Section 106 connection approval for new connections',
      'No surface water to foul sewer',
      'Fat trap for basement kitchens'
    ],
    separationRequired: separation
  };
}

// =============================================================================
// GROUNDWATER ASSESSMENT
// =============================================================================

function assessGroundwater(projectDetails: DrainageProject): GroundwaterAssessment {
  const basementProposed = Boolean(projectDetails.basementProposed);

  return {
    description: 'Groundwater conditions assessment',
    level: 'Variable - perched water in London Clay possible after wet weather',
    basementImpact: basementProposed
      ? 'Basement construction may encounter perched groundwater'
      : 'No basement - groundwater impact minimal',
    mitigationRequired: basementProposed
  };
}

// =============================================================================
// DRAINAGE CALCULATIONS
// =============================================================================

function calculateDrainage(projectDetails: DrainageProject): DrainageCalculations {
  const siteArea = projectDetails.siteArea || 200;
  const additionalHardstanding = projectDetails.additionalHardstanding || 0;
  const runoffCoefficient = 0.9; // Impermeable surfaces

  const existingImpermeable = siteArea * 0.3; // Assume 30% existing
  const proposedImpermeable = existingImpermeable + additionalHardstanding;

  // Simplified calculation - 1 in 100 year + 40% climate change
  const rainfallIntensity = 50; // mm/hr (1 in 100 year, 1 hour duration)
  const climateFactor = 1.4;

  const attenuationVolume = (proposedImpermeable * rainfallIntensity * climateFactor) / 1000;

  return {
    description: 'Surface water drainage calculations',
    existingRunoff: `${Math.round(existingImpermeable)}m² impermeable @ ${runoffCoefficient} coefficient`,
    proposedRunoff: `${Math.round(proposedImpermeable)}m² impermeable @ ${runoffCoefficient} coefficient`,
    attenuation: `Approximately ${Math.round(attenuationVolume * 10) / 10}m³ attenuation for 1:100+CC event`,
    dischargeRate: 'Greenfield rate or 2 l/s minimum whichever greater'
  };
}

// =============================================================================
// COMPLIANCE
// =============================================================================

function assessCompliance(projectDetails: DrainageProject): DrainageCompliance[] {
  return [
    {
      regulation: 'NPPF - Flood Risk',
      requirement: 'Sequential test; Exception test if applicable',
      compliance: 'complies',
      notes: 'Flood Zone 1 - no restrictions'
    },
    {
      regulation: 'Building Regulations Part H',
      requirement: 'Adequate drainage; hierarchy for surface water',
      compliance: 'complies',
      notes: 'SuDS hierarchy followed; connection to sewer as last resort'
    },
    {
      regulation: 'London Plan Policy SI 13',
      requirement: 'SuDS required; greenfield runoff rates',
      compliance: 'complies',
      notes: 'SuDS strategy with attenuation to greenfield rates'
    },
    {
      regulation: 'Local Lead Flood Authority requirements',
      requirement: 'SuDS approval for major developments',
      compliance: projectDetails.siteArea && projectDetails.siteArea > 1000 ? 'requires_assessment' : 'complies',
      notes: 'Minor development - LPA assessment as part of planning'
    }
  ];
}

// =============================================================================
// CONCLUSION
// =============================================================================

function generateConclusion(
  floodRisk: FloodRiskAssessment,
  surfaceWater: SurfaceWaterAssessment
): DrainageConclusion {
  return {
    overallAssessment: 'Site suitable for development in flood risk and drainage terms',
    floodRiskAcceptable: true,
    drainageAchievable: true,
    conditions: [
      'Submit detailed drainage design for approval',
      'SuDS to be installed and maintained',
      surfaceWater.managementRequired ? 'Attenuation tank/storage to be provided' : 'Permeable surfaces where practicable'
    ]
  };
}

// =============================================================================
// RECOMMENDATIONS
// =============================================================================

function generateRecommendations(projectDetails: DrainageProject): string[] {
  const recommendations = [
    'Maximise permeable surfacing in any new hardstanding',
    'Consider rainwater harvesting for garden irrigation',
    'Maintain existing soft landscaping where possible'
  ];

  if (projectDetails.basementProposed) {
    recommendations.push(
      'Commission detailed basement impact assessment',
      'Type C waterproofing with cavity drain recommended',
      'Install sump and pump with battery backup'
    );
  }

  if (projectDetails.additionalHardstanding && projectDetails.additionalHardstanding > 10) {
    recommendations.push(
      'Submit SuDS design with planning application',
      'Consider attenuation tank below new paving'
    );
  }

  return recommendations;
}

// =============================================================================
// EXPORTS
// =============================================================================

const drainageAssessment = {
  assessDrainage,
  FLOOD_ZONES,
  SUDS_COMPONENTS
};

export default drainageAssessment;
