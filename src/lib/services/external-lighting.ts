/**
 * External Lighting Assessment Service
 * 
 * Provides lighting design guidance for external areas including
 * security, amenity, and ecological impact considerations.
 * 
 * Coverage: NW1-NW11, N2, N6, N10 postcodes
 */

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

interface LightingProject {
  propertyType?: 'residential' | 'commercial' | 'mixed_use';
  hasGarden?: boolean;
  gardenSize?: 'small' | 'medium' | 'large';
  nearConservationArea?: boolean;
  nearListedBuilding?: boolean;
  nearOpenSpace?: boolean;
  securityRequired?: boolean;
  driveway?: boolean;
  exteriorZones?: string[];
  existingLighting?: boolean;
}

interface LightFitting {
  type: string;
  application: string;
  wattage: string;
  colorTemp: string;
  beamAngle: string;
  suitability: string[];
  avoidFor: string[];
}

interface LightingZone {
  zone: string;
  purpose: string;
  recommendedLux: string;
  fittingTypes: string[];
  considerations: string[];
}

interface LightingAnalysis {
  summary: LightingSummary;
  designPrinciples: DesignPrinciples;
  zoneAssessment: ZoneAssessment;
  ecologicalConsiderations: EcologicalAssessment;
  heritageConsiderations: HeritageLightingAssessment;
  securityLighting: SecurityAssessment;
  energyEfficiency: EnergyAssessment;
  regulatoryCompliance: LightingCompliance;
  productGuidance: ProductGuidance;
  conclusion: LightingConclusion;
  recommendations: string[];
}

interface LightingSummary {
  overallApproach: string;
  keyConstraints: string[];
  designObjectives: string[];
}

interface DesignPrinciples {
  description: string;
  principles: DesignPrinciple[];
}

interface DesignPrinciple {
  principle: string;
  application: string;
  importance: 'essential' | 'recommended' | 'desirable';
}

interface ZoneAssessment {
  description: string;
  zones: LightingZone[];
}

interface EcologicalAssessment {
  description: string;
  sensitiveFeatures: string[];
  batConsiderations: string[];
  mitigationMeasures: string[];
  colorTemperature: string;
}

interface HeritageLightingAssessment {
  applicable: boolean;
  description: string;
  considerations: string[];
  traditionalStyles: string[];
}

interface SecurityAssessment {
  description: string;
  requirements: string[];
  sensorTypes: string[];
  coverage: string;
}

interface EnergyAssessment {
  description: string;
  ledRecommended: boolean;
  controlSystems: string[];
  runningCosts: string;
  solarOptions: string;
}

interface LightingCompliance {
  description: string;
  requirements: ComplianceItem[];
}

interface ComplianceItem {
  requirement: string;
  standard: string;
  application: string;
}

interface ProductGuidance {
  description: string;
  recommendedFittings: LightFitting[];
  avoidList: string[];
}

interface LightingConclusion {
  overallAssessment: string;
  planningImplications: string;
  conditions: string[];
}

// =============================================================================
// LIGHTING ZONES DATABASE
// =============================================================================

const LIGHTING_ZONES: LightingZone[] = [
  {
    zone: 'Front entrance',
    purpose: 'Wayfinding and security',
    recommendedLux: '50-100 lux',
    fittingTypes: ['Wall lantern', 'Recessed downlight', 'PIR bollard'],
    considerations: ['Visible from street', 'Heritage sensitivity', 'Neighbor impact']
  },
  {
    zone: 'Driveway/parking',
    purpose: 'Safety and security',
    recommendedLux: '20-50 lux',
    fittingTypes: ['Bollard', 'Low-level path light', 'PIR floodlight'],
    considerations: ['Even coverage', 'Avoid glare to drivers', 'Motion sensors']
  },
  {
    zone: 'Garden pathways',
    purpose: 'Safe navigation',
    recommendedLux: '10-20 lux',
    fittingTypes: ['Path lights', 'Recessed ground lights', 'Solar stakes'],
    considerations: ['Subtle placement', 'Plant growth', 'Trip hazards']
  },
  {
    zone: 'Patio/terrace',
    purpose: 'Amenity and atmosphere',
    recommendedLux: '100-200 lux',
    fittingTypes: ['Pendant', 'Wall washer', 'Festoon', 'Recessed deck'],
    considerations: ['Dimming capability', 'Color rendering', 'Weather protection']
  },
  {
    zone: 'Garden features',
    purpose: 'Aesthetic accent',
    recommendedLux: 'Variable',
    fittingTypes: ['Spike spot', 'Uplighter', 'Underwater', 'Strip lighting'],
    considerations: ['Focal points', 'Avoid over-lighting', 'Seasonal plants']
  },
  {
    zone: 'Boundaries',
    purpose: 'Security perimeter',
    recommendedLux: '5-10 lux',
    fittingTypes: ['Low-level strip', 'PIR sensor', 'Wall washer'],
    considerations: ['Neighbor light spill', 'Wildlife corridors', 'Intruder deterrent']
  }
];

// =============================================================================
// FITTING TYPES DATABASE
// =============================================================================

const FITTING_TYPES: LightFitting[] = [
  {
    type: 'Traditional wall lantern',
    application: 'Entrance areas',
    wattage: '5-10W LED',
    colorTemp: '2700-3000K',
    beamAngle: 'Wide diffuse',
    suitability: ['Heritage areas', 'Front elevations', 'Period properties'],
    avoidFor: ['Modern buildings', 'Rear gardens']
  },
  {
    type: 'Contemporary wall light',
    application: 'Modern properties',
    wattage: '5-15W LED',
    colorTemp: '3000K',
    beamAngle: 'Up/down wash',
    suitability: ['Modern extensions', 'Clean lines', 'Feature walls'],
    avoidFor: ['Listed buildings', 'Conservation area frontages']
  },
  {
    type: 'Bollard light',
    application: 'Paths and drives',
    wattage: '3-8W LED',
    colorTemp: '2700-3000K',
    beamAngle: '360° or directional',
    suitability: ['Driveways', 'Garden paths', 'Commercial'],
    avoidFor: ['Small gardens', 'Period settings']
  },
  {
    type: 'Ground recessed uplight',
    application: 'Feature lighting',
    wattage: '3-10W LED',
    colorTemp: '2700-4000K',
    beamAngle: 'Narrow 15-30°',
    suitability: ['Trees', 'Architectural features', 'Modern design'],
    avoidFor: ['Grass areas (mowing)', 'Bat sensitive areas']
  },
  {
    type: 'PIR floodlight',
    application: 'Security',
    wattage: '10-30W LED',
    colorTemp: '4000K',
    beamAngle: 'Wide flood',
    suitability: ['Rear gardens', 'Parking areas', 'Entries'],
    avoidFor: ['Front elevations', 'Neighbor boundaries', 'Continuous use']
  },
  {
    type: 'Solar path light',
    application: 'Garden paths',
    wattage: '0.5-2W LED',
    colorTemp: 'Variable',
    beamAngle: 'Downward',
    suitability: ['Remote areas', 'Budget', 'Temporary'],
    avoidFor: ['Shaded areas', 'Primary security']
  }
];

// =============================================================================
// MAIN SERVICE FUNCTION
// =============================================================================

async function assessLighting(
  address: string,
  postcode: string,
  projectType: string,
  projectDetails: LightingProject = {}
): Promise<LightingAnalysis> {
  const summary = generateSummary(projectDetails);
  const designPrinciples = getDesignPrinciples();
  const zoneAssessment = assessZones(projectDetails);
  const ecologicalConsiderations = assessEcology(projectDetails);
  const heritageConsiderations = assessHeritage(projectDetails);
  const securityLighting = assessSecurity(projectDetails);
  const energyEfficiency = assessEnergy(projectDetails);
  const regulatoryCompliance = assessCompliance();
  const productGuidance = getProductGuidance(projectDetails);
  const conclusion = generateConclusion(projectDetails);
  const recommendations = generateRecommendations(projectDetails);

  return {
    summary,
    designPrinciples,
    zoneAssessment,
    ecologicalConsiderations,
    heritageConsiderations,
    securityLighting,
    energyEfficiency,
    regulatoryCompliance,
    productGuidance,
    conclusion,
    recommendations
  };
}

// =============================================================================
// SUMMARY
// =============================================================================

function generateSummary(projectDetails: LightingProject): LightingSummary {
  const constraints: string[] = [];
  const objectives: string[] = [];

  if (projectDetails.nearConservationArea) {
    constraints.push('Conservation area - traditional styles required');
  }
  if (projectDetails.nearOpenSpace) {
    constraints.push('Ecological sensitivity - minimize light spill');
  }
  if (projectDetails.nearListedBuilding) {
    constraints.push('Listed building setting - heritage appropriate');
  }

  if (projectDetails.securityRequired) {
    objectives.push('Security and intruder deterrent');
  }
  if (projectDetails.hasGarden) {
    objectives.push('Garden amenity and atmosphere');
  }
  objectives.push('Safe navigation', 'Energy efficiency');

  return {
    overallApproach: 'Sensitive, low-impact lighting design respecting local character',
    keyConstraints: constraints.length > 0 ? constraints : ['Standard residential considerations'],
    designObjectives: objectives
  };
}

// =============================================================================
// DESIGN PRINCIPLES
// =============================================================================

function getDesignPrinciples(): DesignPrinciples {
  const principles: DesignPrinciple[] = [
    {
      principle: 'Light only where needed',
      application: 'Avoid blanket lighting - target specific areas',
      importance: 'essential'
    },
    {
      principle: 'Use appropriate light levels',
      application: 'Match illumination to task - avoid over-lighting',
      importance: 'essential'
    },
    {
      principle: 'Control light direction',
      application: 'Aim downward, shield sources, minimize upward light',
      importance: 'essential'
    },
    {
      principle: 'Choose warm color temperatures',
      application: '2700-3000K for residential, reduces ecological impact',
      importance: 'recommended'
    },
    {
      principle: 'Use timers and sensors',
      application: 'PIR, photocells, timers to reduce unnecessary lighting',
      importance: 'recommended'
    },
    {
      principle: 'Consider neighbors',
      application: 'Avoid light trespass onto adjacent properties',
      importance: 'essential'
    },
    {
      principle: 'Integrate with landscape',
      application: 'Hide fittings where possible, complement planting',
      importance: 'desirable'
    }
  ];

  return {
    description: 'Core principles for external lighting design',
    principles
  };
}

// =============================================================================
// ZONE ASSESSMENT
// =============================================================================

function assessZones(projectDetails: LightingProject): ZoneAssessment {
  const applicableZones = LIGHTING_ZONES.filter(zone => {
    if (zone.zone === 'Driveway/parking' && !projectDetails.driveway) return false;
    if (zone.zone.includes('Garden') && !projectDetails.hasGarden) return false;
    return true;
  });

  return {
    description: 'Assessment of lighting zones applicable to property',
    zones: applicableZones
  };
}

// =============================================================================
// ECOLOGICAL ASSESSMENT
// =============================================================================

function assessEcology(projectDetails: LightingProject): EcologicalAssessment {
  const sensitiveFeatures: string[] = [];
  const batConsiderations: string[] = [];
  const mitigation: string[] = [];

  if (projectDetails.nearOpenSpace) {
    sensitiveFeatures.push('Hampstead Heath proximity', 'Wildlife corridors');
    batConsiderations.push(
      'Bats forage along dark corridors',
      'Light disrupts feeding patterns',
      'Roost access may be affected'
    );
  }

  if (projectDetails.hasGarden) {
    sensitiveFeatures.push('Garden biodiversity', 'Hedgehog routes', 'Moth populations');
  }

  mitigation.push(
    'Use warm white LEDs (2700K max) - less attractive to insects',
    'Shield all light sources to prevent upward light',
    'Use sensors to minimize lighting duration',
    'Maintain dark corridors along boundaries',
    'Avoid lighting trees that may host roosting bats'
  );

  return {
    description: 'Assessment of ecological impacts from external lighting',
    sensitiveFeatures: sensitiveFeatures.length > 0 ? sensitiveFeatures : ['Standard urban garden'],
    batConsiderations: batConsiderations.length > 0 ? batConsiderations : ['Standard bat considerations apply'],
    mitigationMeasures: mitigation,
    colorTemperature: '2700K warm white recommended - minimizes insect attraction and bat disturbance'
  };
}

// =============================================================================
// HERITAGE ASSESSMENT
// =============================================================================

function assessHeritage(projectDetails: LightingProject): HeritageLightingAssessment {
  const applicable = Boolean(projectDetails.nearConservationArea) || Boolean(projectDetails.nearListedBuilding);

  return {
    applicable,
    description: applicable
      ? 'Heritage-sensitive lighting design required'
      : 'Standard lighting approach acceptable',
    considerations: applicable
      ? [
          'Traditional lantern styles for front elevation',
          'Avoid modern spotlights visible from street',
          'Black or bronze finishes typically appropriate',
          'Consider gas-lamp style fittings for period properties',
          'Subtle illumination levels - avoid floodlighting'
        ]
      : ['Modern designs acceptable where appropriate'],
    traditionalStyles: [
      'Victorian/Edwardian wall lanterns',
      'Coach lamps',
      'Pillar-mounted lanterns',
      'Traditional hanging pendants'
    ]
  };
}

// =============================================================================
// SECURITY ASSESSMENT
// =============================================================================

function assessSecurity(projectDetails: LightingProject): SecurityAssessment {
  return {
    description: 'Security lighting assessment and recommendations',
    requirements: projectDetails.securityRequired
      ? [
          'Illumination of entry points',
          'Driveway/parking visibility',
          'Rear garden coverage',
          'Side access lighting'
        ]
      : ['Basic entrance illumination'],
    sensorTypes: [
      'PIR (Passive Infrared) - motion detection',
      'Microwave - through-material detection',
      'Dual technology - reduced false triggers',
      'Photocell - dusk-to-dawn activation'
    ],
    coverage: 'Focus on vulnerable areas - entries, garage, side gates'
  };
}

// =============================================================================
// ENERGY ASSESSMENT
// =============================================================================

function assessEnergy(projectDetails: LightingProject): EnergyAssessment {
  return {
    description: 'Energy efficiency assessment for external lighting',
    ledRecommended: true,
    controlSystems: [
      'Photocell sensors - automatic dusk/dawn',
      'PIR sensors - motion activation',
      'Timer controls - scheduled operation',
      'Smart home integration - app control',
      'Astronomical timers - seasonal adjustment'
    ],
    runningCosts: 'LED lighting typically 80% lower than halogen equivalents',
    solarOptions: projectDetails.gardenSize === 'large'
      ? 'Solar viable for remote garden lighting'
      : 'Solar suitable for accent lighting only'
  };
}

// =============================================================================
// COMPLIANCE
// =============================================================================

function assessCompliance(): LightingCompliance {
  return {
    description: 'Regulatory requirements for external lighting',
    requirements: [
      {
        requirement: 'BS 5489-1:2020',
        standard: 'Design of road lighting',
        application: 'Applies to driveways accessed from highway'
      },
      {
        requirement: 'BS EN 12464-2',
        standard: 'Lighting of outdoor work places',
        application: 'Reference for domestic security lighting'
      },
      {
        requirement: 'ILE Guidance Note 1',
        standard: 'Reduction of obtrusive light',
        application: 'Light pollution prevention'
      },
      {
        requirement: 'Part P Building Regulations',
        standard: 'Electrical safety',
        application: 'Fixed external wiring installations'
      },
      {
        requirement: 'Planning conditions',
        standard: 'Local authority requirements',
        application: 'May require lighting details approval'
      }
    ]
  };
}

// =============================================================================
// PRODUCT GUIDANCE
// =============================================================================

function getProductGuidance(projectDetails: LightingProject): ProductGuidance {
  let fittings = [...FITTING_TYPES];

  if (projectDetails.nearConservationArea) {
    fittings = fittings.filter(f => f.suitability.includes('Heritage areas') || f.suitability.includes('Period properties'));
  }

  return {
    description: 'Product recommendations for external lighting',
    recommendedFittings: fittings,
    avoidList: [
      'Unshielded bulkhead lights',
      'High-output security floods (over 30W)',
      'Blue-white LEDs (>4000K)',
      'Upward-facing ground lights',
      'Continuous strip lighting on boundaries'
    ]
  };
}

// =============================================================================
// CONCLUSION
// =============================================================================

function generateConclusion(projectDetails: LightingProject): LightingConclusion {
  const heritageCondition = projectDetails.nearConservationArea || projectDetails.nearListedBuilding;

  return {
    overallAssessment: 'External lighting achievable with sensitive design approach',
    planningImplications: heritageCondition
      ? 'Lighting details may be conditioned - heritage-appropriate fittings required'
      : 'Standard permitted development rights likely apply',
    conditions: heritageCondition
      ? ['Details of external lighting to be submitted for approval', 'Lighting to be heritage-appropriate']
      : ['Standard installation - no specific conditions expected']
  };
}

// =============================================================================
// RECOMMENDATIONS
// =============================================================================

function generateRecommendations(projectDetails: LightingProject): string[] {
  const recommendations = [
    'Use warm white LED fittings (2700-3000K)',
    'Install PIR sensors for security lighting',
    'Ensure all lights are fully shielded (downward)',
    'Consider smart controls for flexibility and efficiency'
  ];

  if (projectDetails.nearConservationArea) {
    recommendations.push('Select traditional lantern styles for front elevation');
  }

  if (projectDetails.nearOpenSpace) {
    recommendations.push('Maintain dark corridors along boundaries for wildlife');
    recommendations.push('Avoid lighting mature trees (potential bat roosts)');
  }

  if (projectDetails.hasGarden && projectDetails.gardenSize === 'large') {
    recommendations.push('Zone garden lighting for flexibility');
    recommendations.push('Consider solar options for remote areas');
  }

  recommendations.push('Use IP65 rated fittings for weather protection');
  recommendations.push('Engage qualified electrician for fixed installations');

  return recommendations;
}

// =============================================================================
// EXPORTS
// =============================================================================

const externalLightingAssessment = {
  assessLighting,
  LIGHTING_ZONES,
  FITTING_TYPES
};

export default externalLightingAssessment;
