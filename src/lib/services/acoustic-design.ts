/**
 * Acoustic Design Assessment Service
 * 
 * Analyzes noise and acoustic considerations for proposed developments,
 * including noise impact assessment and sound insulation requirements.
 * 
 * Coverage: NW1-NW11, N2, N6, N10 postcodes
 */

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

interface AcousticProject {
  propertyType?: 'detached' | 'semi_detached' | 'terraced' | 'flat';
  projectType?: 'extension' | 'loft' | 'basement' | 'new_build' | 'conversion';
  nearRoad?: boolean;
  nearRailway?: boolean;
  nearCommercial?: boolean;
  plantEquipment?: boolean;
  partyWallWorks?: boolean;
  newDwellings?: boolean;
}

interface NoiseSource {
  source: string;
  type: 'road' | 'rail' | 'air' | 'industrial' | 'commercial' | 'plant';
  estimatedLevel: number; // dB LAeq
  distance: string;
  impact: 'low' | 'medium' | 'high';
}

interface SoundInsulation {
  element: string;
  requirement: string;
  standard: string;
  specification: string;
}

interface PlantNoise {
  equipment: string;
  location: string;
  operatingHours: string;
  noiseLimit: string;
  mitigation: string;
}

interface AcousticAnalysis {
  summary: AcousticSummary;
  siteContext: AcousticSiteContext;
  noiseSources: NoiseSource[];
  internalNoise: InternalNoiseAssessment;
  externalNoise: ExternalNoiseAssessment;
  soundInsulation: SoundInsulationAssessment;
  plantAssessment: PlantAssessment;
  constructionNoise: ConstructionNoiseAssessment;
  policyCompliance: AcousticPolicyCompliance[];
  mitigation: AcousticMitigation;
  conclusion: AcousticConclusion;
  recommendations: string[];
}

interface AcousticSummary {
  noiseRisk: string;
  primaryConcerns: string[];
  overallCompliance: string;
  recommendation: string;
}

interface AcousticSiteContext {
  setting: string;
  noiseEnvironment: string;
  sensitivities: string[];
  existingBackground: string;
}

interface InternalNoiseAssessment {
  description: string;
  livingRooms: RoomNoiseLevel;
  bedrooms: RoomNoiseLevel;
  compliance: string;
}

interface RoomNoiseLevel {
  daytime: string;
  nighttime: string;
  target: string;
  achievable: string;
}

interface ExternalNoiseAssessment {
  description: string;
  gardenAreas: string;
  balconies: string;
  compliance: string;
}

interface SoundInsulationAssessment {
  description: string;
  requirements: SoundInsulation[];
  approvedDocumentE: string;
}

interface PlantAssessment {
  description: string;
  equipment: PlantNoise[];
  ratingPenalties: string;
  compliance: string;
}

interface ConstructionNoiseAssessment {
  description: string;
  methodology: string;
  workingHours: string;
  controlMeasures: string[];
}

interface AcousticPolicyCompliance {
  policy: string;
  requirement: string;
  compliance: 'complies' | 'partial' | 'does_not_comply';
  explanation: string;
}

interface AcousticMitigation {
  glazing: string[];
  ventilation: string[];
  construction: string[];
  plant: string[];
}

interface AcousticConclusion {
  overallAssessment: string;
  impactLevel: string;
  conditions: string[];
  recommendation: string;
}

// =============================================================================
// NOISE STANDARDS
// =============================================================================

const NOISE_STANDARDS = {
  internal: {
    livingRooms: {
      daytime: 35, // dB LAeq,16hr
      nighttime: null
    },
    bedrooms: {
      daytime: 35,
      nighttime: 30, // dB LAeq,8hr
      maxNight: 45 // dB LAmax
    }
  },
  external: {
    gardens: 55, // dB LAeq,16hr upper guideline
    gardensIdeal: 50
  },
  plant: {
    ratingLevel: 'Background LA90 - 5dB typical condition',
    penalty: '+5dB for tonal or impulsive character'
  }
};

// =============================================================================
// MAIN SERVICE FUNCTION
// =============================================================================

async function assessAcoustics(
  address: string,
  postcode: string,
  projectType: string,
  projectDetails: AcousticProject = {}
): Promise<AcousticAnalysis> {
  const summary = generateSummary(projectDetails);
  const siteContext = assessSiteContext(postcode, projectDetails);
  const noiseSources = identifyNoiseSources(projectDetails);
  const internalNoise = assessInternalNoise(noiseSources);
  const externalNoise = assessExternalNoise(noiseSources);
  const soundInsulation = assessSoundInsulation(projectDetails);
  const plantAssessment = assessPlantNoise(projectDetails);
  const constructionNoise = assessConstructionNoise(projectType);
  const policyCompliance = assessPolicies(projectDetails);
  const mitigation = proposeMitigation(noiseSources, projectDetails);
  const conclusion = generateConclusion(summary, policyCompliance);
  const recommendations = generateRecommendations(projectDetails);

  return {
    summary,
    siteContext,
    noiseSources,
    internalNoise,
    externalNoise,
    soundInsulation,
    plantAssessment,
    constructionNoise,
    policyCompliance,
    mitigation,
    conclusion,
    recommendations
  };
}

// =============================================================================
// SUMMARY
// =============================================================================

function generateSummary(projectDetails: AcousticProject): AcousticSummary {
  const nearRoad = Boolean(projectDetails.nearRoad);
  const hasPlant = Boolean(projectDetails.plantEquipment);
  const newDwellings = Boolean(projectDetails.newDwellings);

  const concerns: string[] = [];
  if (nearRoad) concerns.push('Road traffic noise');
  if (projectDetails.nearRailway) concerns.push('Railway noise');
  if (hasPlant) concerns.push('Mechanical plant noise');
  if (newDwellings) concerns.push('Internal sound insulation');

  return {
    noiseRisk: concerns.length > 1 ? 'Medium' : concerns.length === 1 ? 'Low-Medium' : 'Low',
    primaryConcerns: concerns.length > 0 ? concerns : ['No significant noise concerns identified'],
    overallCompliance: 'Achievable with standard mitigation',
    recommendation: 'Acceptable subject to acoustic conditions'
  };
}

// =============================================================================
// SITE CONTEXT
// =============================================================================

function assessSiteContext(
  postcode: string,
  projectDetails: AcousticProject
): AcousticSiteContext {
  const postcodePrefix = (postcode.split(' ')[0] || postcode).toUpperCase();

  return {
    setting: 'Residential area with typical suburban noise environment',
    noiseEnvironment: projectDetails.nearRoad
      ? 'Road traffic is the dominant noise source'
      : 'Quiet residential setting with limited noise intrusion',
    sensitivities: [
      'Existing residential dwellings',
      'Rear gardens in residential use',
      'Bedrooms requiring nighttime protection'
    ],
    existingBackground: 'Typical suburban background levels: ~45-50dB LA90 daytime, ~35-40dB LA90 nighttime'
  };
}

// =============================================================================
// NOISE SOURCES
// =============================================================================

function identifyNoiseSources(projectDetails: AcousticProject): NoiseSource[] {
  const sources: NoiseSource[] = [];

  if (projectDetails.nearRoad) {
    sources.push({
      source: 'Road traffic',
      type: 'road',
      estimatedLevel: 60,
      distance: 'Varies with property location',
      impact: 'medium'
    });
  }

  if (projectDetails.nearRailway) {
    sources.push({
      source: 'Railway',
      type: 'rail',
      estimatedLevel: 65,
      distance: 'Varies',
      impact: 'high'
    });
  }

  if (projectDetails.nearCommercial) {
    sources.push({
      source: 'Commercial activity',
      type: 'commercial',
      estimatedLevel: 50,
      distance: 'Adjacent premises',
      impact: 'low'
    });
  }

  // Default ambient if no specific sources
  if (sources.length === 0) {
    sources.push({
      source: 'General ambient noise',
      type: 'road',
      estimatedLevel: 45,
      distance: 'Background',
      impact: 'low'
    });
  }

  return sources;
}

// =============================================================================
// INTERNAL NOISE ASSESSMENT
// =============================================================================

function assessInternalNoise(noiseSources: NoiseSource[]): InternalNoiseAssessment {
  const maxLevel = Math.max(...noiseSources.map(s => s.estimatedLevel));
  const standardGlazingAttenuation = 25; // dB typical
  const internalLevel = maxLevel - standardGlazingAttenuation;

  return {
    description: 'Assessment of internal noise levels against BS 8233:2014 and WHO guidelines',
    livingRooms: {
      daytime: `${internalLevel}dB LAeq,16hr estimated`,
      nighttime: 'N/A for living rooms',
      target: '35dB LAeq,16hr (BS 8233 desirable)',
      achievable: internalLevel <= 35 ? 'Yes, with standard glazing' : 'Yes, with enhanced glazing'
    },
    bedrooms: {
      daytime: `${internalLevel}dB LAeq estimated`,
      nighttime: `${internalLevel - 5}dB LAeq,8hr estimated`,
      target: '30dB LAeq,8hr nighttime; 45dB LAmax',
      achievable: internalLevel <= 30 ? 'Yes, with standard construction' : 'Yes, with acoustic glazing'
    },
    compliance: 'Internal noise targets achievable with appropriate acoustic glazing specification'
  };
}

// =============================================================================
// EXTERNAL NOISE ASSESSMENT
// =============================================================================

function assessExternalNoise(noiseSources: NoiseSource[]): ExternalNoiseAssessment {
  const maxLevel = Math.max(...noiseSources.map(s => s.estimatedLevel));

  return {
    description: 'Assessment of external amenity space noise levels',
    gardenAreas: maxLevel <= 55
      ? `Acceptable - estimated ${maxLevel}dB LAeq below 55dB upper guideline`
      : `Marginally elevated at ${maxLevel}dB - screen fencing recommended`,
    balconies: 'Not typically achievable in noisier locations - winter gardens alternative may be appropriate',
    compliance: maxLevel <= 55
      ? 'Garden areas meet WHO/BS 8233 guidelines'
      : 'Minor exceedance - acceptable in urban context with mitigation'
  };
}

// =============================================================================
// SOUND INSULATION ASSESSMENT
// =============================================================================

function assessSoundInsulation(projectDetails: AcousticProject): SoundInsulationAssessment {
  const requirements: SoundInsulation[] = [];

  if (projectDetails.partyWallWorks || projectDetails.newDwellings) {
    requirements.push({
      element: 'Party walls (new)',
      requirement: 'DnT,w + Ctr ≥ 45dB',
      standard: 'Approved Document E',
      specification: 'Dense blockwork with isolated linings, or proprietary system'
    });

    requirements.push({
      element: 'Party floors (if applicable)',
      requirement: 'DnT,w + Ctr ≥ 45dB; LnT,w ≤ 62dB',
      standard: 'Approved Document E',
      specification: 'Floating floor and isolated ceiling system'
    });
  }

  requirements.push({
    element: 'Internal walls between rooms',
    requirement: 'Good acoustic separation',
    standard: 'Building Regulations Part E (guidance)',
    specification: 'Standard plasterboard construction adequate'
  });

  return {
    description: 'Sound insulation requirements under Building Regulations',
    requirements,
    approvedDocumentE: 'Compliance with Approved Document E required for new party walls/floors'
  };
}

// =============================================================================
// PLANT NOISE ASSESSMENT
// =============================================================================

function assessPlantNoise(projectDetails: AcousticProject): PlantAssessment {
  const equipment: PlantNoise[] = [];

  if (projectDetails.plantEquipment) {
    equipment.push({
      equipment: 'Air source heat pump',
      location: 'External (ground level)',
      operatingHours: 'Continuous when heating/cooling required',
      noiseLimit: 'Background minus 5dB at nearest receptor',
      mitigation: 'Acoustic enclosure; sympathetic positioning; low-noise unit'
    });

    equipment.push({
      equipment: 'Mechanical ventilation',
      location: 'Internal with external terminations',
      operatingHours: 'Continuous',
      noiseLimit: 'Inaudible at boundary',
      mitigation: 'Attenuators; anti-vibration mounts'
    });
  }

  return {
    description: projectDetails.plantEquipment
      ? 'Assessment of fixed plant noise against background sound levels'
      : 'No significant plant equipment proposed',
    equipment,
    ratingPenalties: '+5dB added for tonal, impulsive or intermittent character',
    compliance: equipment.length > 0
      ? 'Achievable with appropriate specification and positioning'
      : 'N/A - no plant assessed'
  };
}

// =============================================================================
// CONSTRUCTION NOISE ASSESSMENT
// =============================================================================

function assessConstructionNoise(projectType: string): ConstructionNoiseAssessment {
  const isBasement = projectType === 'basement';

  return {
    description: 'Assessment of construction phase noise impacts',
    methodology: isBasement
      ? 'Basement construction requires careful management due to extended duration and excavation noise'
      : 'Standard construction methodology with typical noise levels',
    workingHours: '08:00-18:00 Monday to Friday; 08:00-13:00 Saturday; No Sunday/Bank Holiday working',
    controlMeasures: [
      'Best Practicable Means (BPM) as defined in Control of Pollution Act 1974',
      'Hoarding to site boundaries',
      'Silenced plant and equipment',
      'No burning of materials on site',
      'Regular communication with neighbors',
      isBasement ? 'Construction Management Plan required' : 'Standard construction controls'
    ]
  };
}

// =============================================================================
// POLICY COMPLIANCE
// =============================================================================

function assessPolicies(projectDetails: AcousticProject): AcousticPolicyCompliance[] {
  return [
    {
      policy: 'NPPF - Noise',
      requirement: 'Avoid significant adverse impacts; mitigate and reduce other adverse impacts',
      compliance: 'complies',
      explanation: 'Development does not create significant noise impacts and mitigates any effects'
    },
    {
      policy: 'PPG - Noise',
      requirement: 'Consider noise at design stage',
      compliance: 'complies',
      explanation: 'Acoustic design integrated from early stage'
    },
    {
      policy: 'Local Plan Amenity Policy',
      requirement: 'Protect residential amenity from noise',
      compliance: 'complies',
      explanation: 'Internal and external noise levels meet relevant criteria'
    },
    {
      policy: 'Building Regulations Part E',
      requirement: 'Sound insulation between dwellings',
      compliance: projectDetails.newDwellings ? 'partial' : 'complies',
      explanation: projectDetails.newDwellings
        ? 'Pre-completion testing required to demonstrate compliance'
        : 'N/A or standard construction adequate'
    }
  ];
}

// =============================================================================
// MITIGATION
// =============================================================================

function proposeMitigation(
  noiseSources: NoiseSource[],
  projectDetails: AcousticProject
): AcousticMitigation {
  const maxLevel = Math.max(...noiseSources.map(s => s.estimatedLevel));

  return {
    glazing: maxLevel > 55 ? [
      'Enhanced acoustic glazing to road-facing facades',
      'Minimum Rw 32dB glazing specification',
      'Trickle ventilators with acoustic attenuation'
    ] : [
      'Standard double glazing adequate',
      'Acoustic trickle vents recommended'
    ],
    ventilation: [
      'Mechanical ventilation with heat recovery (MVHR) recommended',
      'Alternative ventilation strategy to allow windows closed',
      'Attenuated air paths for natural ventilation'
    ],
    construction: [
      'Dense construction to external walls',
      'Appropriate sound insulation to party elements',
      'Sealed construction to prevent flanking'
    ],
    plant: projectDetails.plantEquipment ? [
      'Select quiet plant equipment',
      'Position away from neighboring bedrooms',
      'Acoustic enclosures where necessary',
      'Anti-vibration mounts'
    ] : ['No plant-specific mitigation required']
  };
}

// =============================================================================
// CONCLUSION
// =============================================================================

function generateConclusion(
  summary: AcousticSummary,
  policies: AcousticPolicyCompliance[]
): AcousticConclusion {
  const conditions = [
    'Submit glazing specifications for approval',
    'Submit details of mechanical plant (if any)',
    'Comply with Construction Management Plan/code of practice'
  ];

  return {
    overallAssessment: 'The proposed development is acceptable in acoustic terms',
    impactLevel: summary.noiseRisk,
    conditions,
    recommendation: 'Approval recommended subject to acoustic conditions'
  };
}

// =============================================================================
// RECOMMENDATIONS
// =============================================================================

function generateRecommendations(projectDetails: AcousticProject): string[] {
  const recommendations = [
    'Consider acoustic survey if not already undertaken',
    'Specify glazing with appropriate acoustic performance',
    'Plan construction works to minimize disturbance'
  ];

  if (projectDetails.plantEquipment) {
    recommendations.push(
      'Submit plant noise assessment prior to installation',
      'Consider heat pump noise levels in product selection'
    );
  }

  if (projectDetails.newDwellings) {
    recommendations.push(
      'Pre-completion sound testing required for Part E compliance',
      'Appoint approved testing body'
    );
  }

  return recommendations;
}

// =============================================================================
// EXPORTS
// =============================================================================

const acousticDesign = {
  assessAcoustics,
  NOISE_STANDARDS
};

export default acousticDesign;
