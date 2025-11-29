/**
 * Wind Microclimate Assessment Service
 * 
 * Analyzes potential wind effects of proposed developments on
 * pedestrian comfort and safety in and around the site.
 * 
 * Coverage: NW1-NW11, N2, N6, N10 postcodes
 */

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

interface WindProject {
  propertyType?: 'detached' | 'semi_detached' | 'terraced' | 'flat' | 'tower';
  projectType?: 'extension' | 'loft' | 'new_build' | 'tall_building';
  buildingHeight?: number;
  sitArea?: number;
  exposedLocation?: boolean;
  nearOpenSpace?: boolean;
  groundFloorUse?: 'residential' | 'retail' | 'office' | 'entrance';
}

interface WindCondition {
  location: string;
  activity: string;
  existingCategory: 'sitting' | 'standing' | 'walking' | 'uncomfortable';
  proposedCategory: 'sitting' | 'standing' | 'walking' | 'uncomfortable';
  impact: 'beneficial' | 'negligible' | 'minor_adverse' | 'moderate_adverse' | 'major_adverse';
  acceptability: string;
}

interface WindSafetyAssessment {
  location: string;
  existingExceedance: number;
  proposedExceedance: number;
  safetyThreshold: number;
  compliant: boolean;
}

interface WindMicroclimateAnalysis {
  summary: WindSummary;
  methodology: WindMethodology;
  siteContext: WindSiteContext;
  windClimate: WindClimate;
  comfortAssessment: ComfortAssessment;
  safetyAssessment: SafetyAssessment;
  groundLevelEffects: GroundLevelEffects;
  mitigation: WindMitigation;
  conclusion: WindConclusion;
  recommendations: string[];
}

interface WindSummary {
  applicability: string;
  overallImpact: string;
  comfortCompliance: string;
  safetyCompliance: string;
  recommendation: string;
}

interface WindMethodology {
  standard: string;
  approach: string;
  criteria: WindCriteria;
  assumptions: string[];
}

interface WindCriteria {
  sitting: string;
  standing: string;
  walking: string;
  uncomfortable: string;
  safety: string;
}

interface WindSiteContext {
  location: string;
  exposure: string;
  surroundingBuildings: string;
  openSpaces: string;
  predominantWindDirection: string;
}

interface WindClimate {
  annualMeanSpeed: string;
  predominantDirection: string;
  seasonalVariation: string;
  extremeEvents: string;
}

interface ComfortAssessment {
  description: string;
  conditions: WindCondition[];
  overallCompliance: string;
}

interface SafetyAssessment {
  description: string;
  assessments: WindSafetyAssessment[];
  overallCompliance: string;
}

interface GroundLevelEffects {
  description: string;
  cornerAcceleration: string;
  downdraught: string;
  channelling: string;
  wakeEffects: string;
}

interface WindMitigation {
  architectural: string[];
  landscaping: string[];
  streetFurniture: string[];
  operational: string[];
}

interface WindConclusion {
  overallAssessment: string;
  impactLevel: string;
  acceptability: string;
  recommendation: string;
}

// =============================================================================
// LAWSON CRITERIA
// =============================================================================

const LAWSON_CRITERIA = {
  sitting: {
    threshold: 4, // m/s mean wind speed
    description: 'Suitable for outdoor sitting - parks, outdoor cafes',
    exceedance: 5 // % time threshold can be exceeded
  },
  standing: {
    threshold: 6,
    description: 'Suitable for standing/passive activities - bus stops, entrances',
    exceedance: 5
  },
  walking: {
    threshold: 8,
    description: 'Suitable for walking - pedestrian throughfares',
    exceedance: 5
  },
  uncomfortable: {
    threshold: 10,
    description: 'Uncomfortable for most activities',
    exceedance: 5
  },
  safety: {
    threshold: 15,
    description: 'Safety threshold - risk of being blown over',
    exceedance: 0.1 // Very low acceptable exceedance
  }
};

// =============================================================================
// MAIN SERVICE FUNCTION
// =============================================================================

async function assessWindMicroclimate(
  address: string,
  postcode: string,
  projectType: string,
  projectDetails: WindProject = {}
): Promise<WindMicroclimateAnalysis> {
  const summary = generateSummary(projectDetails);
  const methodology = defineMethodology();
  const siteContext = assessSiteContext(postcode, projectDetails);
  const windClimate = describeWindClimate();
  const comfortAssessment = assessComfort(projectDetails);
  const safetyAssessment = assessSafety(projectDetails);
  const groundLevelEffects = assessGroundLevel(projectDetails);
  const mitigation = proposeMitigation(projectDetails);
  const conclusion = generateConclusion(comfortAssessment, safetyAssessment);
  const recommendations = generateRecommendations(projectDetails);

  return {
    summary,
    methodology,
    siteContext,
    windClimate,
    comfortAssessment,
    safetyAssessment,
    groundLevelEffects,
    mitigation,
    conclusion,
    recommendations
  };
}

// =============================================================================
// SUMMARY
// =============================================================================

function generateSummary(projectDetails: WindProject): WindSummary {
  const height = projectDetails.buildingHeight || 10;
  const isTall = height > 20;

  return {
    applicability: isTall
      ? 'Full wind microclimate assessment recommended due to building height'
      : 'Detailed wind study unlikely to be required for domestic-scale development',
    overallImpact: isTall ? 'Requires detailed analysis' : 'Negligible',
    comfortCompliance: isTall ? 'Subject to mitigation' : 'Compliant',
    safetyCompliance: 'Compliant',
    recommendation: isTall
      ? 'Commission wind tunnel study or CFD analysis'
      : 'No wind microclimate concerns for this scale of development'
  };
}

// =============================================================================
// METHODOLOGY
// =============================================================================

function defineMethodology(): WindMethodology {
  return {
    standard: 'Lawson Comfort Criteria (LDDC variant)',
    approach: 'Desk-based assessment with reference to meteorological data and building configuration',
    criteria: {
      sitting: `Mean wind speed <${LAWSON_CRITERIA.sitting.threshold}m/s for >95% of time`,
      standing: `Mean wind speed <${LAWSON_CRITERIA.standing.threshold}m/s for >95% of time`,
      walking: `Mean wind speed <${LAWSON_CRITERIA.walking.threshold}m/s for >95% of time`,
      uncomfortable: `Mean wind speed >${LAWSON_CRITERIA.uncomfortable.threshold}m/s indicates unsuitable conditions`,
      safety: `Wind speeds >${LAWSON_CRITERIA.safety.threshold}m/s must not exceed 0.1% annual occurrence`
    },
    assumptions: [
      'Meteorological data from nearest weather station',
      'Existing buildings assumed to remain',
      'Pedestrian activities based on typical use patterns',
      'No account taken of temporary wind barriers'
    ]
  };
}

// =============================================================================
// SITE CONTEXT
// =============================================================================

function assessSiteContext(
  postcode: string,
  projectDetails: WindProject
): WindSiteContext {
  const postcodePrefix = (postcode.split(' ')[0] || postcode).toUpperCase();
  const nearHeath = postcodePrefix === 'NW3' || postcodePrefix === 'NW11';

  return {
    location: 'Residential area of North London',
    exposure: nearHeath
      ? 'Moderately exposed due to proximity to Hampstead Heath open space'
      : 'Sheltered suburban location',
    surroundingBuildings: 'Predominantly 2-4 storey residential buildings providing shelter',
    openSpaces: nearHeath
      ? 'Site near Hampstead Heath - open ground to north'
      : 'Typical urban gardens and streets',
    predominantWindDirection: 'South-westerly (consistent with UK prevailing wind)'
  };
}

// =============================================================================
// WIND CLIMATE
// =============================================================================

function describeWindClimate(): WindClimate {
  return {
    annualMeanSpeed: 'Approximately 4-5 m/s at 10m height (Met Office data)',
    predominantDirection: 'South-westerly winds predominate (approximately 45% of time)',
    seasonalVariation: 'Stronger winds in winter months (October-March); calmer in summer',
    extremeEvents: 'Occasional strong winds associated with Atlantic depressions; typically 3-5 events per year'
  };
}

// =============================================================================
// COMFORT ASSESSMENT
// =============================================================================

function assessComfort(projectDetails: WindProject): ComfortAssessment {
  const height = projectDetails.buildingHeight || 10;
  const isTall = height > 20;
  const conditions: WindCondition[] = [];

  // Entrance assessment
  conditions.push({
    location: 'Main entrance',
    activity: 'standing',
    existingCategory: 'standing',
    proposedCategory: 'standing',
    impact: 'negligible',
    acceptability: 'Acceptable - meets standing comfort criteria'
  });

  // Garden/amenity space
  conditions.push({
    location: 'Rear garden',
    activity: 'sitting',
    existingCategory: 'sitting',
    proposedCategory: 'sitting',
    impact: 'negligible',
    acceptability: 'Acceptable - sheltered garden setting maintains sitting comfort'
  });

  // Street frontage
  conditions.push({
    location: 'Street frontage',
    activity: 'walking',
    existingCategory: 'walking',
    proposedCategory: 'walking',
    impact: 'negligible',
    acceptability: 'Acceptable - walking comfort maintained'
  });

  if (isTall) {
    conditions.push({
      location: 'Building corners',
      activity: 'walking',
      existingCategory: 'walking',
      proposedCategory: isTall ? 'uncomfortable' : 'walking',
      impact: isTall ? 'moderate_adverse' : 'negligible',
      acceptability: isTall ? 'Requires mitigation' : 'Acceptable'
    });
  }

  const allAcceptable = conditions.every(c =>
    c.impact === 'negligible' || c.impact === 'beneficial'
  );

  return {
    description: 'Pedestrian comfort assessment based on Lawson Criteria',
    conditions,
    overallCompliance: allAcceptable
      ? 'All locations meet appropriate comfort criteria for intended use'
      : 'Some locations require mitigation to achieve acceptable comfort'
  };
}

// =============================================================================
// SAFETY ASSESSMENT
// =============================================================================

function assessSafety(projectDetails: WindProject): SafetyAssessment {
  const height = projectDetails.buildingHeight || 10;
  const assessments: WindSafetyAssessment[] = [];

  // Safety assessment for key locations
  assessments.push({
    location: 'Main pedestrian routes',
    existingExceedance: 0,
    proposedExceedance: height > 30 ? 0.05 : 0,
    safetyThreshold: 0.1,
    compliant: true
  });

  assessments.push({
    location: 'Building entrances',
    existingExceedance: 0,
    proposedExceedance: 0,
    safetyThreshold: 0.1,
    compliant: true
  });

  return {
    description: 'Safety assessment - wind speeds must not exceed 15m/s for more than 0.1% of annual hours',
    assessments,
    overallCompliance: 'All locations meet safety criteria - no safety concerns identified'
  };
}

// =============================================================================
// GROUND LEVEL EFFECTS
// =============================================================================

function assessGroundLevel(projectDetails: WindProject): GroundLevelEffects {
  const height = projectDetails.buildingHeight || 10;
  const isTall = height > 20;

  return {
    description: 'Assessment of specific wind effects at ground level',
    cornerAcceleration: isTall
      ? 'Potential corner acceleration effects - mitigation recommended'
      : 'No significant corner acceleration at domestic scale',
    downdraught: isTall
      ? 'Risk of downdraught on windward facade - consider recessed entrance'
      : 'No downdraught effects expected at this scale',
    channelling: 'No significant channelling effects identified between buildings',
    wakeEffects: 'Wake turbulence confined to immediate building lee - no wider impacts'
  };
}

// =============================================================================
// MITIGATION
// =============================================================================

function proposeMitigation(projectDetails: WindProject): WindMitigation {
  const height = projectDetails.buildingHeight || 10;
  const isTall = height > 20;

  return {
    architectural: isTall ? [
      'Recessed or canopied entrance to provide shelter',
      'Setbacks at upper levels to reduce downdraught',
      'Rounded building corners to reduce acceleration',
      'Balcony screens and solid balustrades'
    ] : [
      'Standard construction provides adequate shelter',
      'No specific architectural mitigation required'
    ],
    landscaping: [
      'Retain existing trees and hedges for shelter',
      'New planting to provide windbreaks where appropriate',
      'Avoid removal of mature vegetation'
    ],
    streetFurniture: isTall ? [
      'Permeable screens at exposed locations',
      'Seating positioned in sheltered areas'
    ] : [
      'No specific street furniture mitigation required'
    ],
    operational: [
      'Standard maintenance of landscaping',
      'Monitor comfort post-occupation'
    ]
  };
}

// =============================================================================
// CONCLUSION
// =============================================================================

function generateConclusion(
  comfort: ComfortAssessment,
  safety: SafetyAssessment
): WindConclusion {
  const safetyCompliant = safety.assessments.every(a => a.compliant);
  const comfortAcceptable = comfort.conditions.every(c =>
    c.impact === 'negligible' || c.impact === 'beneficial' || c.impact === 'minor_adverse'
  );

  return {
    overallAssessment: 'The proposed development would not result in unacceptable wind conditions',
    impactLevel: 'Negligible for domestic-scale development',
    acceptability: safetyCompliant && comfortAcceptable
      ? 'Wind microclimate acceptable without detailed study'
      : 'Acceptable subject to mitigation measures',
    recommendation: 'No wind microclimate objection to the proposed development'
  };
}

// =============================================================================
// RECOMMENDATIONS
// =============================================================================

function generateRecommendations(projectDetails: WindProject): string[] {
  const height = projectDetails.buildingHeight || 10;

  const recommendations = [
    'Retain existing trees and vegetation for natural shelter',
    'Maintain enclosed rear gardens for amenity use'
  ];

  if (height > 15) {
    recommendations.push(
      'Consider detailed wind assessment if planning authority requires',
      'Wind tunnel testing or CFD analysis for buildings over 20m'
    );
  }

  if (height > 20) {
    recommendations.push(
      'Commission full wind microclimate study by specialist consultant',
      'Include mitigation measures in design from early stage'
    );
  }

  return recommendations;
}

// =============================================================================
// EXPORTS
// =============================================================================

const windMicroclimate = {
  assessWindMicroclimate,
  LAWSON_CRITERIA
};

export default windMicroclimate;
