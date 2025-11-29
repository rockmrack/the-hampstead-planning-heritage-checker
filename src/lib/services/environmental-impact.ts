/**
 * Environmental Impact Service
 * 
 * Comprehensive environmental assessment for planning applications
 * including biodiversity, noise, air quality, and ecological impacts
 */

// Types
interface EnvironmentalAssessment {
  address: string;
  postcode: string;
  projectType: string;
  overallRating: 'low' | 'medium' | 'high' | 'significant';
  biodiversity: BiodiversityAssessment;
  noiseImpact: NoiseAssessment;
  airQuality: AirQualityAssessment;
  ecology: EcologyAssessment;
  drainage: DrainageAssessment;
  mitigation: MitigationMeasures;
  reports: RequiredReports[];
  conditions: LikelyConditions[];
}

interface BiodiversityAssessment {
  netGainRequired: boolean;
  netGainPercentage: number;
  existingHabitats: Habitat[];
  proposedEnhancements: string[];
  protectedSpecies: ProtectedSpeciesRisk[];
  treeImpact: TreeImpact;
}

interface Habitat {
  type: string;
  area: number;
  quality: 'poor' | 'moderate' | 'good' | 'excellent';
  distinctiveness: 'low' | 'medium' | 'high' | 'very-high';
}

interface ProtectedSpeciesRisk {
  species: string;
  likelihood: 'unlikely' | 'possible' | 'likely' | 'confirmed';
  surveyRequired: boolean;
  mitigationNeeded: boolean;
}

interface TreeImpact {
  treesAffected: number;
  category: 'A' | 'B' | 'C' | 'U';
  tpoProtected: boolean;
  replacementRatio: string;
  compensatoryPlanting: number;
}

interface NoiseAssessment {
  constructionNoise: NoiseLevel;
  operationalNoise: NoiseLevel;
  vibrationRisk: boolean;
  sensitivereceptors: SensitiveReceptor[];
  mitigationRequired: boolean;
}

interface NoiseLevel {
  level: 'negligible' | 'minor' | 'moderate' | 'major';
  decibelEstimate: string;
  duration: string;
  restrictions: string[];
}

interface SensitiveReceptor {
  type: string;
  distance: number;
  impactLevel: 'low' | 'medium' | 'high';
}

interface AirQualityAssessment {
  inAQMA: boolean;
  aqmaName: string | null;
  constructionDust: DustRisk;
  trafficEmissions: EmissionsImpact;
  heatingEmissions: HeatingImpact;
  mitigationRequired: boolean;
}

interface DustRisk {
  level: 'low' | 'medium' | 'high';
  distance: number;
  sensitiveUses: string[];
  mitigationMeasures: string[];
}

interface EmissionsImpact {
  additionalTrips: number;
  significanceLevel: 'negligible' | 'minor' | 'moderate' | 'major';
  evChargingRequired: boolean;
}

interface HeatingImpact {
  proposedSystem: string;
  emissionsRating: 'A' | 'B' | 'C' | 'D' | 'E';
  recommendations: string[];
}

interface EcologyAssessment {
  habitatValue: 'low' | 'medium' | 'high' | 'very-high';
  connectivityImpact: boolean;
  greenCorridors: string[];
  enhancementOpportunities: string[];
  seasonalConstraints: SeasonalConstraint[];
}

interface SeasonalConstraint {
  constraint: string;
  period: string;
  activity: string;
}

interface DrainageAssessment {
  existingSurface: string;
  proposedSurface: string;
  runoffIncrease: number;
  sudsRequired: boolean;
  sudsTypes: string[];
  drainageStrategy: string;
}

interface MitigationMeasures {
  biodiversity: string[];
  noise: string[];
  airQuality: string[];
  ecology: string[];
  drainage: string[];
  general: string[];
  estimatedCost: CostEstimate;
}

interface CostEstimate {
  low: number;
  high: number;
  breakdown: CostBreakdown[];
}

interface CostBreakdown {
  item: string;
  cost: number;
}

interface RequiredReports {
  report: string;
  reason: string;
  estimatedCost: number;
  timeRequired: string;
  consultantType: string;
}

interface LikelyConditions {
  condition: string;
  trigger: string;
  compliance: string;
}

// Air Quality Management Areas in Camden
const AQMA_AREAS: { [key: string]: { name: string; pollutant: string } } = {
  'NW1': { name: 'Camden Borough AQMA', pollutant: 'NO2 and PM10' },
  'NW3': { name: 'Camden Borough AQMA', pollutant: 'NO2 and PM10' },
  'NW5': { name: 'Camden Borough AQMA', pollutant: 'NO2 and PM10' },
  'NW6': { name: 'Camden Borough AQMA', pollutant: 'NO2 and PM10' },
  'NW8': { name: 'Westminster AQMA', pollutant: 'NO2' },
  'N6': { name: 'Camden Borough AQMA', pollutant: 'NO2 and PM10' }
};

// Protected species in Hampstead area
const LOCAL_PROTECTED_SPECIES: { species: string; habitat: string; likelihood: string }[] = [
  { species: 'Bats (various)', habitat: 'Buildings, trees, hedgerows', likelihood: 'Common in Hampstead' },
  { species: 'Great Crested Newts', habitat: 'Ponds, rough grassland', likelihood: 'Possible near Heath' },
  { species: 'Slow Worms', habitat: 'Gardens, compost heaps', likelihood: 'Occasional' },
  { species: 'Hedgehogs', habitat: 'Gardens, hedgerows', likelihood: 'Common' },
  { species: 'House Sparrows', habitat: 'Buildings, gardens', likelihood: 'Common' },
  { species: 'Swifts', habitat: 'Buildings', likelihood: 'Seasonal visitors' },
  { species: 'Stag Beetles', habitat: 'Dead wood, gardens', likelihood: 'Occasional' }
];

// Project type environmental impacts
const PROJECT_IMPACTS: { [key: string]: { biodiversity: string; noise: string; air: string } } = {
  'extension': { biodiversity: 'low', noise: 'moderate', air: 'low' },
  'basement': { biodiversity: 'low', noise: 'high', air: 'moderate' },
  'new-build': { biodiversity: 'high', noise: 'high', air: 'moderate' },
  'conversion': { biodiversity: 'low', noise: 'moderate', air: 'low' },
  'demolition': { biodiversity: 'moderate', noise: 'high', air: 'high' },
  'landscaping': { biodiversity: 'high', noise: 'low', air: 'low' },
  'outbuilding': { biodiversity: 'low', noise: 'low', air: 'low' },
  'loft': { biodiversity: 'moderate', noise: 'moderate', air: 'low' }
};

/**
 * Get comprehensive environmental impact assessment
 */
export async function getEnvironmentalAssessment(
  address: string,
  postcode: string,
  projectType: string,
  projectDetails?: {
    siteArea?: number;
    proposedFootprint?: number;
    existingTrees?: number;
    nearWater?: boolean;
    demolitionInvolved?: boolean;
    constructionDuration?: number;
    heatingSystem?: string;
    additionalParkingSpaces?: number;
  }
): Promise<EnvironmentalAssessment> {
  const parts = postcode.split(' ');
  const outcode = parts[0] || 'NW3';
  
  const normalizedType = projectType.toLowerCase().replace(/\s+/g, '-');
  const impactData = PROJECT_IMPACTS[normalizedType];
  const impact = impactData || { biodiversity: 'low', noise: 'moderate', air: 'low' };
  
  const biodiversity = assessBiodiversity(projectDetails, impact.biodiversity);
  const noiseImpact = assessNoise(projectType, projectDetails, impact.noise);
  const airQuality = assessAirQuality(outcode, projectDetails, impact.air);
  const ecology = assessEcology(projectDetails);
  const drainage = assessDrainage(projectDetails);
  
  const mitigation = generateMitigation(biodiversity, noiseImpact, airQuality, ecology, drainage);
  const reports = determineRequiredReports(biodiversity, noiseImpact, airQuality, ecology, projectType);
  const conditions = predictConditions(biodiversity, noiseImpact, airQuality, drainage);
  
  const overallRating = calculateOverallRating(biodiversity, noiseImpact, airQuality, ecology);
  
  return {
    address,
    postcode,
    projectType,
    overallRating,
    biodiversity,
    noiseImpact,
    airQuality,
    ecology,
    drainage,
    mitigation,
    reports,
    conditions
  };
}

/**
 * Assess biodiversity impact
 */
function assessBiodiversity(
  projectDetails: {
    siteArea?: number;
    proposedFootprint?: number;
    existingTrees?: number;
    nearWater?: boolean;
    demolitionInvolved?: boolean;
    constructionDuration?: number;
    heatingSystem?: string;
    additionalParkingSpaces?: number;
  } | undefined,
  impactLevel: string
): BiodiversityAssessment {
  const siteArea = projectDetails?.siteArea || 200;
  const existingTrees = projectDetails?.existingTrees || 2;
  
  // Biodiversity Net Gain calculation (10% mandatory from 2024)
  const netGainRequired = siteArea > 25; // Threshold for small sites
  const netGainPercentage = netGainRequired ? 10 : 0;
  
  // Assess existing habitats
  const existingHabitats: Habitat[] = [
    {
      type: 'Modified grassland (lawn)',
      area: siteArea * 0.4,
      quality: 'poor',
      distinctiveness: 'low'
    },
    {
      type: 'Introduced shrubs',
      area: siteArea * 0.2,
      quality: 'moderate',
      distinctiveness: 'low'
    }
  ];
  
  if (existingTrees > 0) {
    existingHabitats.push({
      type: 'Urban trees',
      area: existingTrees * 20, // Canopy area estimate
      quality: 'moderate',
      distinctiveness: 'medium'
    });
  }
  
  // Protected species risk assessment
  const protectedSpecies = assessProtectedSpeciesRisk(projectDetails);
  
  // Tree impact assessment
  const treeImpact = assessTreeImpact(existingTrees, projectDetails?.demolitionInvolved || false);
  
  // Enhancement opportunities
  const proposedEnhancements = [
    'Native species planting',
    'Bird nesting boxes (2 minimum)',
    'Bat boxes where appropriate',
    'Hedgehog highways in fencing',
    'Pollinator-friendly planting',
    'Log piles for invertebrates'
  ];
  
  if (impactLevel === 'high') {
    proposedEnhancements.push('Green roof installation');
    proposedEnhancements.push('Wildlife pond creation');
  }
  
  return {
    netGainRequired,
    netGainPercentage,
    existingHabitats,
    proposedEnhancements,
    protectedSpecies,
    treeImpact
  };
}

/**
 * Assess protected species risk
 */
function assessProtectedSpeciesRisk(
  projectDetails?: {
    siteArea?: number;
    proposedFootprint?: number;
    existingTrees?: number;
    nearWater?: boolean;
    demolitionInvolved?: boolean;
    constructionDuration?: number;
    heatingSystem?: string;
    additionalParkingSpaces?: number;
  }
): ProtectedSpeciesRisk[] {
  const risks: ProtectedSpeciesRisk[] = [];
  
  // Bats - always consider for buildings and trees
  const demolition = projectDetails?.demolitionInvolved || false;
  const trees = projectDetails?.existingTrees || 0;
  
  risks.push({
    species: 'Bats',
    likelihood: demolition || trees > 3 ? 'possible' : 'unlikely',
    surveyRequired: demolition,
    mitigationNeeded: demolition
  });
  
  // Great Crested Newts - if near water
  if (projectDetails?.nearWater) {
    risks.push({
      species: 'Great Crested Newts',
      likelihood: 'possible',
      surveyRequired: true,
      mitigationNeeded: true
    });
  }
  
  // Birds - if removing vegetation or buildings
  risks.push({
    species: 'Nesting Birds',
    likelihood: 'likely',
    surveyRequired: false,
    mitigationNeeded: true
  });
  
  return risks;
}

/**
 * Assess tree impact
 */
function assessTreeImpact(existingTrees: number, demolitionInvolved: boolean): TreeImpact {
  const treesAffected = demolitionInvolved ? Math.ceil(existingTrees * 0.5) : Math.ceil(existingTrees * 0.2);
  
  return {
    treesAffected,
    category: treesAffected > 0 ? 'B' : 'C',
    tpoProtected: existingTrees > 5, // Simplified assumption
    replacementRatio: '2:1',
    compensatoryPlanting: treesAffected * 2
  };
}

/**
 * Assess noise impact
 */
function assessNoise(
  projectType: string,
  projectDetails: {
    siteArea?: number;
    proposedFootprint?: number;
    existingTrees?: number;
    nearWater?: boolean;
    demolitionInvolved?: boolean;
    constructionDuration?: number;
    heatingSystem?: string;
    additionalParkingSpaces?: number;
  } | undefined,
  impactLevel: string
): NoiseAssessment {
  const duration = projectDetails?.constructionDuration || 6;
  const normalizedType = projectType.toLowerCase();
  
  // Construction noise assessment
  let constructionLevel: 'negligible' | 'minor' | 'moderate' | 'major' = 'moderate';
  let decibelEstimate = '75-85 dB at 1m';
  
  if (normalizedType.includes('basement')) {
    constructionLevel = 'major';
    decibelEstimate = '85-95 dB at 1m';
  } else if (normalizedType.includes('loft') || normalizedType.includes('conversion')) {
    constructionLevel = 'minor';
    decibelEstimate = '70-80 dB at 1m';
  }
  
  const constructionNoise: NoiseLevel = {
    level: constructionLevel,
    decibelEstimate,
    duration: `${duration} months`,
    restrictions: [
      'Monday-Friday: 08:00-18:00',
      'Saturday: 08:00-13:00',
      'No work Sundays/Bank Holidays',
      'No noisy works before 09:00 or after 17:00'
    ]
  };
  
  // Operational noise (usually negligible for residential)
  const operationalNoise: NoiseLevel = {
    level: 'negligible',
    decibelEstimate: 'Background levels',
    duration: 'Permanent',
    restrictions: []
  };
  
  // Sensitive receptors
  const sensitivereceptors: SensitiveReceptor[] = [
    { type: 'Neighboring dwellings', distance: 5, impactLevel: constructionLevel === 'major' ? 'high' : 'medium' },
    { type: 'Street users', distance: 10, impactLevel: 'low' }
  ];
  
  return {
    constructionNoise,
    operationalNoise,
    vibrationRisk: normalizedType.includes('basement') || normalizedType.includes('demolition'),
    sensitivereceptors,
    mitigationRequired: constructionLevel === 'major' || constructionLevel === 'moderate'
  };
}

/**
 * Assess air quality impact
 */
function assessAirQuality(
  outcode: string,
  projectDetails: {
    siteArea?: number;
    proposedFootprint?: number;
    existingTrees?: number;
    nearWater?: boolean;
    demolitionInvolved?: boolean;
    constructionDuration?: number;
    heatingSystem?: string;
    additionalParkingSpaces?: number;
  } | undefined,
  impactLevel: string
): AirQualityAssessment {
  const aqmaInfo = AQMA_AREAS[outcode];
  const inAQMA = aqmaInfo !== undefined;
  
  // Construction dust assessment
  const demolition = projectDetails?.demolitionInvolved || false;
  const dustLevel: 'low' | 'medium' | 'high' = demolition ? 'high' : impactLevel === 'high' ? 'medium' : 'low';
  
  const constructionDust: DustRisk = {
    level: dustLevel,
    distance: 100, // meters
    sensitiveUses: ['Residential', 'Schools', 'Healthcare facilities'],
    mitigationMeasures: [
      'Damping down of dusty surfaces',
      'Covering of stockpiles',
      'Wheel washing facilities',
      'Covered skips and chutes',
      'Site boundary hoarding'
    ]
  };
  
  // Traffic emissions
  const additionalTrips = projectDetails?.additionalParkingSpaces ? projectDetails.additionalParkingSpaces * 4 : 0;
  const trafficEmissions: EmissionsImpact = {
    additionalTrips,
    significanceLevel: additionalTrips > 100 ? 'moderate' : additionalTrips > 50 ? 'minor' : 'negligible',
    evChargingRequired: additionalTrips > 0 || inAQMA
  };
  
  // Heating emissions
  const proposedHeating = projectDetails?.heatingSystem || 'Air source heat pump';
  const heatingEmissions: HeatingImpact = {
    proposedSystem: proposedHeating,
    emissionsRating: proposedHeating.includes('heat pump') ? 'A' : proposedHeating.includes('gas') ? 'C' : 'B',
    recommendations: [
      'Air source heat pump recommended',
      'Solar PV to offset electricity demand',
      'High efficiency systems mandatory in AQMA'
    ]
  };
  
  return {
    inAQMA,
    aqmaName: aqmaInfo ? aqmaInfo.name : null,
    constructionDust,
    trafficEmissions,
    heatingEmissions,
    mitigationRequired: inAQMA || dustLevel === 'high'
  };
}

/**
 * Assess ecological impact
 */
function assessEcology(
  projectDetails?: {
    siteArea?: number;
    proposedFootprint?: number;
    existingTrees?: number;
    nearWater?: boolean;
    demolitionInvolved?: boolean;
    constructionDuration?: number;
    heatingSystem?: string;
    additionalParkingSpaces?: number;
  }
): EcologyAssessment {
  const nearWater = projectDetails?.nearWater || false;
  const trees = projectDetails?.existingTrees || 0;
  
  let habitatValue: 'low' | 'medium' | 'high' | 'very-high' = 'low';
  if (nearWater) habitatValue = 'high';
  else if (trees > 5) habitatValue = 'medium';
  
  const greenCorridors = [
    'Hampstead Heath corridor',
    'Garden network connectivity',
    'Tree-lined street connections'
  ];
  
  const seasonalConstraints: SeasonalConstraint[] = [
    {
      constraint: 'Bird nesting season',
      period: 'March - August',
      activity: 'Vegetation clearance, demolition'
    },
    {
      constraint: 'Bat hibernation',
      period: 'November - March',
      activity: 'Building works affecting roofs/voids'
    },
    {
      constraint: 'Bat active season',
      period: 'May - September',
      activity: 'External lighting installation'
    }
  ];
  
  if (nearWater) {
    seasonalConstraints.push({
      constraint: 'Amphibian breeding',
      period: 'February - June',
      activity: 'Works near water features'
    });
  }
  
  return {
    habitatValue,
    connectivityImpact: trees > 3,
    greenCorridors,
    enhancementOpportunities: [
      'Native hedge planting',
      'Wildflower areas',
      'Rain gardens',
      'Green roof/wall',
      'Swift bricks in walls'
    ],
    seasonalConstraints
  };
}

/**
 * Assess drainage impact
 */
function assessDrainage(
  projectDetails?: {
    siteArea?: number;
    proposedFootprint?: number;
    existingTrees?: number;
    nearWater?: boolean;
    demolitionInvolved?: boolean;
    constructionDuration?: number;
    heatingSystem?: string;
    additionalParkingSpaces?: number;
  }
): DrainageAssessment {
  const siteArea = projectDetails?.siteArea || 200;
  const proposedFootprint = projectDetails?.proposedFootprint || siteArea * 0.3;
  
  const existingPermeable = siteArea * 0.6; // Estimated
  const proposedPermeable = siteArea - proposedFootprint;
  
  const runoffIncrease = Math.max(0, (existingPermeable - proposedPermeable) / existingPermeable * 100);
  const sudsRequired = runoffIncrease > 10;
  
  const sudsTypes = [
    'Permeable paving for driveways/patios',
    'Rain gardens',
    'Green roofs',
    'Soakaways',
    'Water butts (minimum 200L)'
  ];
  
  return {
    existingSurface: 'Mixed permeable/impermeable',
    proposedSurface: 'Increased impermeable area',
    runoffIncrease: Math.round(runoffIncrease),
    sudsRequired,
    sudsTypes,
    drainageStrategy: sudsRequired ? 'SuDS required to achieve greenfield runoff rates' : 'Standard drainage acceptable'
  };
}

/**
 * Generate mitigation measures
 */
function generateMitigation(
  biodiversity: BiodiversityAssessment,
  noise: NoiseAssessment,
  airQuality: AirQualityAssessment,
  ecology: EcologyAssessment,
  drainage: DrainageAssessment
): MitigationMeasures {
  const biodiversityMeasures = [
    ...biodiversity.proposedEnhancements,
    `${biodiversity.treeImpact.compensatoryPlanting} replacement trees required`,
    'Biodiversity Management Plan if BNG applies'
  ];
  
  const noiseMeasures = noise.mitigationRequired ? [
    'Construction Management Plan required',
    'Noise and vibration monitoring',
    'Advance neighbor notification',
    'Acoustic barriers for prolonged works',
    'Regular equipment maintenance'
  ] : ['Standard good practice measures'];
  
  const airQualityMeasures = airQuality.mitigationRequired ? [
    ...airQuality.constructionDust.mitigationMeasures,
    'Air Quality (Dust Management) Plan',
    'Real-time dust monitoring for major works',
    airQuality.trafficEmissions.evChargingRequired ? 'EV charging point installation' : ''
  ].filter(m => m) : ['Standard dust suppression'];
  
  const ecologyMeasures = [
    'Pre-commencement ecological check',
    'Timing constraints compliance',
    'Sensitive external lighting design',
    ...ecology.enhancementOpportunities.slice(0, 3)
  ];
  
  const drainageMeasures = drainage.sudsRequired ? 
    drainage.sudsTypes.slice(0, 3) : 
    ['Maintain existing drainage patterns'];
  
  const generalMeasures = [
    'Considerate Constructors Scheme registration',
    'Community liaison before and during works',
    'Emergency contact procedures',
    'Environmental incident response plan'
  ];
  
  // Cost estimate for mitigation
  const breakdown: CostBreakdown[] = [
    { item: 'Tree replacement planting', cost: biodiversity.treeImpact.compensatoryPlanting * 800 },
    { item: 'Biodiversity enhancements', cost: 2500 },
    { item: 'Construction management', cost: noise.mitigationRequired ? 5000 : 1500 },
    { item: 'Air quality measures', cost: airQuality.mitigationRequired ? 3000 : 500 },
    { item: 'SuDS installation', cost: drainage.sudsRequired ? 8000 : 0 },
    { item: 'Ecological surveys', cost: biodiversity.protectedSpecies.some(s => s.surveyRequired) ? 2500 : 0 }
  ];
  
  const totalLow = breakdown.reduce((sum, item) => sum + item.cost, 0);
  const totalHigh = totalLow * 1.5;
  
  return {
    biodiversity: biodiversityMeasures,
    noise: noiseMeasures,
    airQuality: airQualityMeasures,
    ecology: ecologyMeasures,
    drainage: drainageMeasures,
    general: generalMeasures,
    estimatedCost: {
      low: totalLow,
      high: totalHigh,
      breakdown
    }
  };
}

/**
 * Determine required reports
 */
function determineRequiredReports(
  biodiversity: BiodiversityAssessment,
  noise: NoiseAssessment,
  airQuality: AirQualityAssessment,
  ecology: EcologyAssessment,
  projectType: string
): RequiredReports[] {
  const reports: RequiredReports[] = [];
  
  // Biodiversity Net Gain Assessment
  if (biodiversity.netGainRequired) {
    reports.push({
      report: 'Biodiversity Net Gain Assessment',
      reason: 'Site exceeds 25sqm threshold',
      estimatedCost: 2500,
      timeRequired: '2-3 weeks',
      consultantType: 'Ecologist'
    });
  }
  
  // Bat Survey
  if (biodiversity.protectedSpecies.some(s => s.species === 'Bats' && s.surveyRequired)) {
    reports.push({
      report: 'Preliminary Roost Assessment / Emergence Survey',
      reason: 'Potential bat habitat affected',
      estimatedCost: 1500,
      timeRequired: '1-3 months (seasonal)',
      consultantType: 'Licensed Bat Ecologist'
    });
  }
  
  // Tree Survey
  if (biodiversity.treeImpact.treesAffected > 0 || biodiversity.treeImpact.tpoProtected) {
    reports.push({
      report: 'Arboricultural Impact Assessment (BS5837)',
      reason: 'Trees potentially affected by development',
      estimatedCost: 1200,
      timeRequired: '1-2 weeks',
      consultantType: 'Arboriculturalist'
    });
  }
  
  // Construction Management Plan
  if (noise.constructionNoise.level === 'major' || projectType.toLowerCase().includes('basement')) {
    reports.push({
      report: 'Construction Management Plan',
      reason: 'Significant construction impacts anticipated',
      estimatedCost: 3000,
      timeRequired: '2-3 weeks',
      consultantType: 'Construction Management Consultant'
    });
  }
  
  // Air Quality Assessment
  if (airQuality.inAQMA && airQuality.constructionDust.level === 'high') {
    reports.push({
      report: 'Air Quality Assessment',
      reason: 'Site in Air Quality Management Area',
      estimatedCost: 2000,
      timeRequired: '2-3 weeks',
      consultantType: 'Air Quality Consultant'
    });
  }
  
  // Drainage Assessment
  if (ecology.habitatValue === 'high' || ecology.habitatValue === 'very-high') {
    reports.push({
      report: 'Preliminary Ecological Appraisal',
      reason: 'Site has significant ecological value',
      estimatedCost: 1800,
      timeRequired: '2-4 weeks',
      consultantType: 'Ecologist'
    });
  }
  
  return reports;
}

/**
 * Predict likely planning conditions
 */
function predictConditions(
  biodiversity: BiodiversityAssessment,
  noise: NoiseAssessment,
  airQuality: AirQualityAssessment,
  drainage: DrainageAssessment
): LikelyConditions[] {
  const conditions: LikelyConditions[] = [];
  
  // Tree protection
  if (biodiversity.treeImpact.treesAffected > 0) {
    conditions.push({
      condition: 'Tree Protection Plan',
      trigger: 'Pre-commencement',
      compliance: 'Submit and implement AMS before any site works'
    });
  }
  
  // Replacement planting
  if (biodiversity.treeImpact.compensatoryPlanting > 0) {
    conditions.push({
      condition: 'Landscaping Scheme',
      trigger: 'Pre-commencement',
      compliance: `Plant ${biodiversity.treeImpact.compensatoryPlanting} replacement trees within first planting season`
    });
  }
  
  // Construction management
  if (noise.mitigationRequired) {
    conditions.push({
      condition: 'Construction Management Plan',
      trigger: 'Pre-commencement',
      compliance: 'Submit CMP covering noise, dust, traffic, and waste'
    });
  }
  
  // Working hours
  conditions.push({
    condition: 'Construction Hours',
    trigger: 'Throughout construction',
    compliance: 'Mon-Fri 08:00-18:00, Sat 08:00-13:00, No Sundays/Bank Holidays'
  });
  
  // Air quality
  if (airQuality.trafficEmissions.evChargingRequired) {
    conditions.push({
      condition: 'Electric Vehicle Charging',
      trigger: 'Prior to occupation',
      compliance: 'Install EV charging point to each parking space'
    });
  }
  
  // Drainage
  if (drainage.sudsRequired) {
    conditions.push({
      condition: 'Sustainable Drainage',
      trigger: 'Pre-commencement',
      compliance: 'Submit and implement SuDS scheme to achieve greenfield runoff rates'
    });
  }
  
  // Biodiversity
  conditions.push({
    condition: 'Biodiversity Enhancements',
    trigger: 'Prior to occupation',
    compliance: 'Install bird boxes, bat boxes, hedgehog highways as approved'
  });
  
  // Lighting
  conditions.push({
    condition: 'External Lighting',
    trigger: 'Prior to installation',
    compliance: 'Submit bat-sensitive lighting scheme for approval'
  });
  
  return conditions;
}

/**
 * Calculate overall environmental rating
 */
function calculateOverallRating(
  biodiversity: BiodiversityAssessment,
  noise: NoiseAssessment,
  airQuality: AirQualityAssessment,
  ecology: EcologyAssessment
): 'low' | 'medium' | 'high' | 'significant' {
  let score = 0;
  
  // Biodiversity factors
  if (biodiversity.netGainRequired) score += 1;
  if (biodiversity.protectedSpecies.some(s => s.surveyRequired)) score += 2;
  if (biodiversity.treeImpact.tpoProtected) score += 2;
  
  // Noise factors
  if (noise.constructionNoise.level === 'major') score += 2;
  else if (noise.constructionNoise.level === 'moderate') score += 1;
  if (noise.vibrationRisk) score += 1;
  
  // Air quality factors
  if (airQuality.inAQMA) score += 1;
  if (airQuality.constructionDust.level === 'high') score += 2;
  
  // Ecology factors
  if (ecology.habitatValue === 'high' || ecology.habitatValue === 'very-high') score += 2;
  if (ecology.connectivityImpact) score += 1;
  
  if (score >= 8) return 'significant';
  if (score >= 5) return 'high';
  if (score >= 2) return 'medium';
  return 'low';
}

/**
 * Check for nearby ecological designations
 */
export async function checkEcologicalDesignations(
  postcode: string
): Promise<{
  nearbyDesignations: { name: string; type: string; distance: string }[];
  implications: string[];
}> {
  const parts = postcode.split(' ');
  const outcode = parts[0] || 'NW3';
  
  // Known designations near Hampstead
  const designations: { [key: string]: { name: string; type: string; distance: string }[] } = {
    'NW3': [
      { name: 'Hampstead Heath', type: 'Site of Importance for Nature Conservation (SINC)', distance: '0.2-2km' },
      { name: 'Hampstead Heath Ponds', type: 'Local Nature Reserve', distance: '0.5-2km' },
      { name: "Parliament Hill Fields", type: 'Site of Borough Importance', distance: '1-3km' }
    ],
    'NW5': [
      { name: 'Hampstead Heath Extension', type: 'SINC', distance: '0.5-2km' },
      { name: 'Highgate Wood', type: 'SINC', distance: '1-2km' }
    ],
    'N6': [
      { name: 'Highgate Wood', type: 'SINC / Local Nature Reserve', distance: '0.2-1km' },
      { name: 'Queens Wood', type: 'SINC / Local Nature Reserve', distance: '0.3-1km' }
    ]
  };
  
  const nearby = designations[outcode] || [
    { name: 'Hampstead Heath', type: 'SINC', distance: '1-5km' }
  ];
  
  const implications = [
    'Developments may need to demonstrate no adverse impact on nearby designations',
    'Ecological assessments may be required if within impact zone',
    'Enhanced biodiversity measures expected',
    'Buffer zones may apply for certain developments'
  ];
  
  return {
    nearbyDesignations: nearby,
    implications
  };
}

export default {
  getEnvironmentalAssessment,
  checkEcologicalDesignations
};
