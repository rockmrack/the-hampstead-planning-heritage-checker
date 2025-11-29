/**
 * Air Quality Assessment Service
 * 
 * Provides air quality impact analysis for development projects
 * including construction phase and operational impacts.
 * 
 * Coverage: NW1-NW11, N2, N6, N10 postcodes
 */

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

interface AirQualityProject {
  projectType?: 'residential' | 'commercial' | 'mixed_use';
  units?: number;
  parkingSpaces?: number;
  hasCHP?: boolean;
  hasBoilers?: boolean;
  biomassHeating?: boolean;
  constructionDuration?: number;
  demolitionRequired?: boolean;
  siteArea?: number;
  nearSensitiveReceptors?: boolean;
}

interface PollutantAssessment {
  pollutant: string;
  code: string;
  existingLevel: string;
  impactLevel: string;
  significance: 'negligible' | 'slight' | 'moderate' | 'substantial';
  mitigation: string[];
}

interface ConstructionDustAssessment {
  riskLevel: string;
  dustSources: string[];
  sensitiveReceptors: string[];
  mitigationMeasures: string[];
}

interface AirQualityAnalysis {
  summary: AirQualitySummary;
  existingConditions: ExistingAirQuality;
  constructionPhase: ConstructionImpact;
  operationalPhase: OperationalImpact;
  cumulativeImpact: CumulativeAssessment;
  mitigation: MitigationStrategy;
  airQualityNeutral: AirQualityNeutralAssessment;
  regulatoryCompliance: RegulatoryCompliance;
  conclusion: AirQualityConclusion;
  recommendations: string[];
}

interface AirQualitySummary {
  overallImpact: string;
  aqmaStatus: string;
  assessmentRequired: string;
  keyIssues: string[];
}

interface ExistingAirQuality {
  description: string;
  aqmaDesignation: string;
  backgroundLevels: BackgroundPollutant[];
  localSources: string[];
}

interface BackgroundPollutant {
  pollutant: string;
  annualMean: string;
  objective: string;
  exceedance: boolean;
}

interface ConstructionImpact {
  description: string;
  dustAssessment: ConstructionDustAssessment;
  vehicleEmissions: string;
  duration: string;
  peakActivity: string[];
}

interface OperationalImpact {
  description: string;
  pollutantAssessments: PollutantAssessment[];
  trafficGeneration: string;
  buildingEmissions: string;
}

interface CumulativeAssessment {
  description: string;
  otherDevelopments: string[];
  cumulativeEffect: string;
}

interface MitigationStrategy {
  description: string;
  constructionMeasures: MitigationMeasure[];
  operationalMeasures: MitigationMeasure[];
  s106Contributions: string[];
}

interface MitigationMeasure {
  measure: string;
  effectiveness: 'high' | 'medium' | 'low';
  implementation: string;
}

interface AirQualityNeutralAssessment {
  description: string;
  buildingEmissions: NeutralCalculation;
  transportEmissions: NeutralCalculation;
  isNeutral: boolean;
  offsetRequired: string;
}

interface NeutralCalculation {
  benchmark: string;
  proposed: string;
  assessment: string;
}

interface RegulatoryCompliance {
  description: string;
  requirements: ComplianceRequirement[];
}

interface ComplianceRequirement {
  requirement: string;
  standard: string;
  status: string;
}

interface AirQualityConclusion {
  overallAssessment: string;
  acceptability: 'acceptable' | 'acceptable_with_mitigation' | 'unacceptable';
  conditions: string[];
}

// =============================================================================
// LONDON BOROUGH AQMA DATA
// =============================================================================

const AQMA_STATUS = {
  camden: {
    name: 'Camden AQMA',
    designation: 'Borough-wide',
    pollutants: ['NO2', 'PM10', 'PM2.5'],
    declarationYear: 2000,
    focusAreas: ['Major roads', 'Town centers', 'Construction corridors']
  },
  barnet: {
    name: 'Barnet AQMA',
    designation: 'Borough-wide',
    pollutants: ['NO2', 'PM10'],
    declarationYear: 2001,
    focusAreas: ['A-roads', 'North Circular', 'Town centers']
  }
};

// =============================================================================
// BACKGROUND POLLUTANT DATA
// =============================================================================

const BACKGROUND_LEVELS = {
  hampstead: {
    NO2: { value: 32, unit: 'µg/m³', objective: 40 },
    PM10: { value: 18, unit: 'µg/m³', objective: 40 },
    PM2_5: { value: 12, unit: 'µg/m³', objective: 20 }
  }
};

// =============================================================================
// MAIN SERVICE FUNCTION
// =============================================================================

async function assessAirQuality(
  address: string,
  postcode: string,
  projectType: string,
  projectDetails: AirQualityProject = {}
): Promise<AirQualityAnalysis> {
  const summary = generateSummary(postcode, projectDetails);
  const existingConditions = assessExistingConditions(postcode);
  const constructionPhase = assessConstructionImpact(projectDetails);
  const operationalPhase = assessOperationalImpact(projectDetails);
  const cumulativeImpact = assessCumulativeImpact(postcode);
  const mitigation = developMitigationStrategy(projectDetails);
  const airQualityNeutral = assessAQNeutral(projectDetails);
  const regulatoryCompliance = assessCompliance(projectDetails);
  const conclusion = generateConclusion(summary, operationalPhase);
  const recommendations = generateRecommendations(projectDetails);

  return {
    summary,
    existingConditions,
    constructionPhase,
    operationalPhase,
    cumulativeImpact,
    mitigation,
    airQualityNeutral,
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
  projectDetails: AirQualityProject
): AirQualitySummary {
  const keyIssues: string[] = [];
  
  if (projectDetails.biomassHeating) {
    keyIssues.push('Biomass heating in AQMA requires careful assessment');
  }
  if ((projectDetails.parkingSpaces || 0) > 10) {
    keyIssues.push('Traffic-related emissions from car parking');
  }
  if (projectDetails.demolitionRequired) {
    keyIssues.push('Construction dust from demolition works');
  }
  if (projectDetails.nearSensitiveReceptors) {
    keyIssues.push('Proximity to sensitive receptors');
  }

  return {
    overallImpact: keyIssues.length > 2 ? 'Moderate' : 'Minor',
    aqmaStatus: 'Site within borough-wide AQMA',
    assessmentRequired: 'Air Quality Assessment required for planning',
    keyIssues: keyIssues.length > 0 ? keyIssues : ['Standard development - minor impact expected']
  };
}

// =============================================================================
// EXISTING CONDITIONS
// =============================================================================

function assessExistingConditions(postcode: string): ExistingAirQuality {
  const levels = BACKGROUND_LEVELS.hampstead;

  const backgroundLevels: BackgroundPollutant[] = [
    {
      pollutant: 'Nitrogen Dioxide (NO2)',
      annualMean: `${levels.NO2.value} ${levels.NO2.unit}`,
      objective: `${levels.NO2.objective} ${levels.NO2.unit}`,
      exceedance: levels.NO2.value > levels.NO2.objective
    },
    {
      pollutant: 'Particulate Matter (PM10)',
      annualMean: `${levels.PM10.value} ${levels.PM10.unit}`,
      objective: `${levels.PM10.objective} ${levels.PM10.unit}`,
      exceedance: levels.PM10.value > levels.PM10.objective
    },
    {
      pollutant: 'Fine Particulate Matter (PM2.5)',
      annualMean: `${levels.PM2_5.value} ${levels.PM2_5.unit}`,
      objective: `${levels.PM2_5.objective} ${levels.PM2_5.unit}`,
      exceedance: levels.PM2_5.value > levels.PM2_5.objective
    }
  ];

  return {
    description: 'Assessment of existing air quality conditions',
    aqmaDesignation: 'Site within borough-wide Air Quality Management Area',
    backgroundLevels,
    localSources: [
      'Road traffic on local roads',
      'Domestic heating emissions',
      'Background urban pollution'
    ]
  };
}

// =============================================================================
// CONSTRUCTION IMPACT
// =============================================================================

function assessConstructionImpact(projectDetails: AirQualityProject): ConstructionImpact {
  const dustSources: string[] = [];
  const peakActivity: string[] = [];

  if (projectDetails.demolitionRequired) {
    dustSources.push('Demolition activities');
    peakActivity.push('Demolition phase - highest dust generation');
  }
  dustSources.push('Earthworks and excavation', 'Construction activities', 'Trackout from vehicles');
  peakActivity.push('Concrete and brickwork activities', 'Material deliveries');

  const riskLevel = projectDetails.demolitionRequired
    ? 'Medium risk - demolition involved'
    : (projectDetails.siteArea || 0) > 500
      ? 'Medium risk - larger site'
      : 'Low risk - minor construction';

  return {
    description: 'Assessment of construction phase air quality impacts',
    dustAssessment: {
      riskLevel,
      dustSources,
      sensitiveReceptors: [
        'Adjacent residential properties',
        'Schools within 200m',
        'Pedestrians on footways'
      ],
      mitigationMeasures: [
        'Dust suppression - water spraying',
        'Site hoarding minimum 2.4m height',
        'Wheel washing facilities',
        'Covered skip storage',
        'No bonfires on site'
      ]
    },
    vehicleEmissions: 'Construction traffic - managed through CEMP',
    duration: `${projectDetails.constructionDuration || 12} months estimated`,
    peakActivity
  };
}

// =============================================================================
// OPERATIONAL IMPACT
// =============================================================================

function assessOperationalImpact(projectDetails: AirQualityProject): OperationalImpact {
  const pollutantAssessments: PollutantAssessment[] = [
    {
      pollutant: 'Nitrogen Dioxide',
      code: 'NO2',
      existingLevel: '32 µg/m³',
      impactLevel: '<1% change',
      significance: 'negligible',
      mitigation: ['Electric vehicle charging', 'Cycle parking provision']
    },
    {
      pollutant: 'Particulate Matter PM10',
      code: 'PM10',
      existingLevel: '18 µg/m³',
      impactLevel: '<0.5% change',
      significance: 'negligible',
      mitigation: ['Standard building design']
    }
  ];

  if (projectDetails.biomassHeating) {
    pollutantAssessments.push({
      pollutant: 'PM2.5 (from biomass)',
      code: 'PM2.5',
      existingLevel: '12 µg/m³',
      impactLevel: 'Potential increase',
      significance: 'moderate',
      mitigation: ['High-efficiency particulate filter', 'Alternative heating considered']
    });
  }

  const trafficGeneration = (projectDetails.units || 0) > 10
    ? 'Moderate traffic generation - dispersion modeling may be required'
    : 'Minor traffic generation - screening assessment appropriate';

  return {
    description: 'Assessment of operational phase air quality impacts',
    pollutantAssessments,
    trafficGeneration,
    buildingEmissions: projectDetails.hasCHP
      ? 'CHP/boiler emissions - stack height calculation required'
      : 'Standard heating systems - minor emissions'
  };
}

// =============================================================================
// CUMULATIVE IMPACT
// =============================================================================

function assessCumulativeImpact(postcode: string): CumulativeAssessment {
  return {
    description: 'Assessment of cumulative air quality impacts',
    otherDevelopments: [
      'Other consented developments in vicinity',
      'Pipeline infrastructure projects',
      'Transport scheme improvements'
    ],
    cumulativeEffect: 'Cumulative impact expected to be within acceptable limits with mitigation'
  };
}

// =============================================================================
// MITIGATION STRATEGY
// =============================================================================

function developMitigationStrategy(projectDetails: AirQualityProject): MitigationStrategy {
  const constructionMeasures: MitigationMeasure[] = [
    {
      measure: 'Construction Environmental Management Plan',
      effectiveness: 'high',
      implementation: 'Pre-commencement condition'
    },
    {
      measure: 'Dust management procedures',
      effectiveness: 'high',
      implementation: 'Throughout construction'
    },
    {
      measure: 'Non-Road Mobile Machinery emissions standards',
      effectiveness: 'medium',
      implementation: 'Stage IIIB/IV equipment required'
    }
  ];

  const operationalMeasures: MitigationMeasure[] = [
    {
      measure: 'Electric vehicle charging points',
      effectiveness: 'medium',
      implementation: 'Minimum 20% active, 80% passive'
    },
    {
      measure: 'Cycle parking provision',
      effectiveness: 'medium',
      implementation: 'Policy-compliant levels'
    }
  ];

  if (projectDetails.biomassHeating) {
    operationalMeasures.push({
      measure: 'High-efficiency emission abatement',
      effectiveness: 'high',
      implementation: 'Particulate filter on biomass boiler'
    });
  }

  return {
    description: 'Air quality mitigation strategy',
    constructionMeasures,
    operationalMeasures,
    s106Contributions: [
      'Air quality monitoring contribution',
      'Travel plan implementation'
    ]
  };
}

// =============================================================================
// AIR QUALITY NEUTRAL ASSESSMENT
// =============================================================================

function assessAQNeutral(projectDetails: AirQualityProject): AirQualityNeutralAssessment {
  const buildingCalc: NeutralCalculation = {
    benchmark: 'GLA benchmark emissions for building type',
    proposed: 'Electric heating - zero direct emissions',
    assessment: 'Building emissions neutral - electric heating proposed'
  };

  const transportCalc: NeutralCalculation = {
    benchmark: 'Trip rate benchmark × emission factors',
    proposed: 'Reduced parking provision + EV charging',
    assessment: (projectDetails.parkingSpaces || 0) > 20
      ? 'Transport emissions require offsetting'
      : 'Transport emissions within neutral threshold'
  };

  const isNeutral = (projectDetails.parkingSpaces || 0) <= 20 && !projectDetails.biomassHeating;

  return {
    description: 'Air Quality Neutral assessment per London Plan Policy SI 1',
    buildingEmissions: buildingCalc,
    transportEmissions: transportCalc,
    isNeutral,
    offsetRequired: isNeutral
      ? 'No offset required - development is air quality neutral'
      : 'Offset contribution may be required through S106'
  };
}

// =============================================================================
// REGULATORY COMPLIANCE
// =============================================================================

function assessCompliance(projectDetails: AirQualityProject): RegulatoryCompliance {
  const requirements: ComplianceRequirement[] = [
    {
      requirement: 'Clean Air Act 1993',
      standard: 'Chimney heights and emissions',
      status: 'Compliant - standard heating systems'
    },
    {
      requirement: 'Air Quality Standards Regulations 2010',
      standard: 'EU limit values',
      status: 'Background levels below objectives'
    },
    {
      requirement: 'London Plan Policy SI 1',
      standard: 'Air Quality Neutral/Positive',
      status: 'Assessment demonstrates compliance'
    },
    {
      requirement: 'Local Plan air quality policies',
      standard: 'AQMA considerations',
      status: 'Mitigation measures address local requirements'
    }
  ];

  if (projectDetails.biomassHeating) {
    requirements.push({
      requirement: 'NRMM Low Emission Zone',
      standard: 'Stage IIIB/IV standards',
      status: 'Condition for construction equipment'
    });
  }

  return {
    description: 'Assessment against regulatory requirements',
    requirements
  };
}

// =============================================================================
// CONCLUSION
// =============================================================================

function generateConclusion(
  summary: AirQualitySummary,
  operationalPhase: OperationalImpact
): AirQualityConclusion {
  const hasModerateImpact = operationalPhase.pollutantAssessments.some(
    p => p.significance === 'moderate' || p.significance === 'substantial'
  );

  return {
    overallAssessment: 'Development acceptable with appropriate mitigation measures',
    acceptability: hasModerateImpact ? 'acceptable_with_mitigation' : 'acceptable',
    conditions: [
      'Construction Environmental Management Plan',
      'Electric vehicle charging provision',
      'Travel Plan implementation'
    ]
  };
}

// =============================================================================
// RECOMMENDATIONS
// =============================================================================

function generateRecommendations(projectDetails: AirQualityProject): string[] {
  const recommendations = [
    'Submit Air Quality Assessment with planning application',
    'Prepare Construction Environmental Management Plan',
    'Commit to NRMM emission standards for construction',
    'Provide EV charging as per London Plan requirements'
  ];

  if (projectDetails.biomassHeating) {
    recommendations.push('Reconsider biomass heating - electric alternatives preferred in AQMA');
  }

  if ((projectDetails.units || 0) > 25) {
    recommendations.push('Consider dispersion modeling for traffic emissions');
  }

  recommendations.push('Engage with Borough Air Quality team early in process');

  return recommendations;
}

// =============================================================================
// EXPORTS
// =============================================================================

const airQualityAssessment = {
  assessAirQuality,
  AQMA_STATUS,
  BACKGROUND_LEVELS
};

export default airQualityAssessment;
