/**
 * Secured by Design Assessment Service
 * 
 * Provides crime prevention through environmental design (CPTED)
 * guidance for residential development projects.
 * 
 * Coverage: NW1-NW11, N2, N6, N10 postcodes
 */

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

interface SecurityProject {
  propertyType?: 'detached' | 'semi_detached' | 'terraced' | 'flat' | 'apartment_block';
  newBuild?: boolean;
  extensionType?: 'rear' | 'side' | 'wraparound' | 'basement';
  hasGarden?: boolean;
  frontBoundary?: 'open' | 'low_wall' | 'hedge' | 'railings' | 'high_wall';
  rearAccess?: boolean;
  sideAccess?: boolean;
  parkingType?: 'street' | 'driveway' | 'garage' | 'underground';
  communalAreas?: boolean;
  mailboxLocation?: 'door' | 'boundary' | 'communal';
}

interface SecurityMeasure {
  measure: string;
  category: 'physical' | 'surveillance' | 'territorial' | 'access_control';
  priority: 'essential' | 'recommended' | 'desirable';
  description: string;
  specification?: string;
}

interface VulnerabilityAssessment {
  area: string;
  vulnerabilities: string[];
  riskLevel: 'low' | 'medium' | 'high';
  countermeasures: string[];
}

interface SecurityAnalysis {
  summary: SecuritySummary;
  siteAssessment: SiteSecurityAssessment;
  physicalSecurity: PhysicalSecurityAssessment;
  naturalSurveillance: SurveillanceAssessment;
  accessControl: AccessControlAssessment;
  territorialReinforcement: TerritorialAssessment;
  lightingStrategy: SecurityLightingStrategy;
  landscapingGuidance: LandscapeSecurityGuidance;
  buildingSpecifications: BuildingSecuritySpecs;
  sbdCertification: SBDCertificationGuidance;
  conclusion: SecurityConclusion;
  recommendations: string[];
}

interface SecuritySummary {
  overallApproach: string;
  keyVulnerabilities: string[];
  priorityMeasures: string[];
}

interface SiteSecurityAssessment {
  description: string;
  vulnerabilities: VulnerabilityAssessment[];
  overallRisk: string;
}

interface PhysicalSecurityAssessment {
  description: string;
  doors: DoorSecuritySpec;
  windows: WindowSecuritySpec;
  boundaries: BoundarySecuritySpec;
}

interface DoorSecuritySpec {
  description: string;
  requirements: SecurityMeasure[];
  standards: string[];
}

interface WindowSecuritySpec {
  description: string;
  requirements: SecurityMeasure[];
  vulnerableAreas: string[];
}

interface BoundarySecuritySpec {
  description: string;
  frontBoundary: string;
  sideBoundary: string;
  rearBoundary: string;
  gating: string;
}

interface SurveillanceAssessment {
  description: string;
  principles: string[];
  designFeatures: string[];
  blindSpots: string[];
}

interface AccessControlAssessment {
  description: string;
  layers: string[];
  measures: SecurityMeasure[];
}

interface TerritorialAssessment {
  description: string;
  principles: string[];
  designFeatures: string[];
}

interface SecurityLightingStrategy {
  description: string;
  zones: LightingZoneSpec[];
  sensorTypes: string[];
}

interface LightingZoneSpec {
  zone: string;
  requirement: string;
  specification: string;
}

interface LandscapeSecurityGuidance {
  description: string;
  principles: string[];
  plantingGuidance: string[];
  avoidList: string[];
}

interface BuildingSecuritySpecs {
  description: string;
  doorSpecs: string[];
  windowSpecs: string[];
  alarmSpecs: string[];
}

interface SBDCertificationGuidance {
  description: string;
  benefits: string[];
  process: string[];
  requirements: string[];
}

interface SecurityConclusion {
  overallAssessment: string;
  achievable: boolean;
  conditions: string[];
}

// =============================================================================
// SBD STANDARDS DATABASE
// =============================================================================

const SBD_STANDARDS = {
  doors: {
    external: 'PAS 24:2022',
    garage: 'LPS 1175 Issue 8 or STS 202',
    communal: 'LPS 1175 Issue 8 SR2'
  },
  windows: {
    ground: 'PAS 24:2022',
    accessible: 'PAS 24:2022',
    upper: 'Standard specification acceptable'
  },
  locks: {
    multipoint: 'BS 3621 or PAS 3621',
    cylinders: 'TS007 3-star rated',
    handles: 'Anti-snap, anti-bump, anti-pick'
  }
};

// =============================================================================
// VULNERABILITY DATABASE
// =============================================================================

const COMMON_VULNERABILITIES: Record<string, string[]> = {
  front: ['Visible valuables', 'Mail theft', 'Poor lighting', 'Easy concealment'],
  side: ['Unlit passage', 'Unsecured gate', 'Hidden from view', 'Access to rear'],
  rear: ['Climbing aids', 'Weak boundaries', 'Poor surveillance', 'Isolated outbuildings'],
  parking: ['Vehicle theft', 'Theft from vehicles', 'Poor lighting', 'No surveillance']
};

// =============================================================================
// MAIN SERVICE FUNCTION
// =============================================================================

async function assessSecurity(
  address: string,
  postcode: string,
  projectType: string,
  projectDetails: SecurityProject = {}
): Promise<SecurityAnalysis> {
  const summary = generateSummary(projectDetails);
  const siteAssessment = assessSite(projectDetails);
  const physicalSecurity = assessPhysicalSecurity(projectDetails);
  const naturalSurveillance = assessSurveillance(projectDetails);
  const accessControl = assessAccessControl(projectDetails);
  const territorialReinforcement = assessTerritorial(projectDetails);
  const lightingStrategy = developLightingStrategy(projectDetails);
  const landscapingGuidance = developLandscapeGuidance(projectDetails);
  const buildingSpecifications = getBuildingSpecs(projectDetails);
  const sbdCertification = getSBDGuidance(projectDetails);
  const conclusion = generateConclusion(projectDetails);
  const recommendations = generateRecommendations(projectDetails);

  return {
    summary,
    siteAssessment,
    physicalSecurity,
    naturalSurveillance,
    accessControl,
    territorialReinforcement,
    lightingStrategy,
    landscapingGuidance,
    buildingSpecifications,
    sbdCertification,
    conclusion,
    recommendations
  };
}

// =============================================================================
// SUMMARY
// =============================================================================

function generateSummary(projectDetails: SecurityProject): SecuritySummary {
  const vulnerabilities: string[] = [];
  const priorities: string[] = [];

  if (projectDetails.rearAccess) {
    vulnerabilities.push('Rear access - potential weak point');
    priorities.push('Secure rear gate with quality lock');
  }
  if (projectDetails.sideAccess) {
    vulnerabilities.push('Side passage - concealment opportunity');
    priorities.push('Side gate with self-closing mechanism');
  }
  if (projectDetails.frontBoundary === 'open') {
    vulnerabilities.push('Open frontage - reduced territorial definition');
  }
  if (projectDetails.parkingType === 'street') {
    vulnerabilities.push('Street parking - vehicle security');
  }

  priorities.push('PAS 24 certified doors and windows');
  priorities.push('PIR-controlled security lighting');

  return {
    overallApproach: 'Layered security through CPTED principles',
    keyVulnerabilities: vulnerabilities.length > 0
      ? vulnerabilities
      : ['Standard residential vulnerabilities'],
    priorityMeasures: priorities
  };
}

// =============================================================================
// SITE ASSESSMENT
// =============================================================================

function assessSite(projectDetails: SecurityProject): SiteSecurityAssessment {
  const defaultVulnerabilities: string[] = ['Standard vulnerabilities'];
  
  const frontVulns = COMMON_VULNERABILITIES['front'] ?? defaultVulnerabilities;
  const rearVulns = COMMON_VULNERABILITIES['rear'] ?? defaultVulnerabilities;
  const sideVulns = COMMON_VULNERABILITIES['side'] ?? defaultVulnerabilities;
  const parkingVulns = COMMON_VULNERABILITIES['parking'] ?? defaultVulnerabilities;
  
  const vulnerabilities: VulnerabilityAssessment[] = [
    {
      area: 'Front elevation',
      vulnerabilities: frontVulns,
      riskLevel: 'medium',
      countermeasures: ['Lighting', 'Visible house number', 'Secure letterbox']
    },
    {
      area: 'Rear garden',
      vulnerabilities: rearVulns,
      riskLevel: projectDetails.rearAccess ? 'high' : 'medium',
      countermeasures: ['Strong boundaries', 'Remove climbing aids', 'Motion lighting']
    }
  ];

  if (projectDetails.sideAccess) {
    vulnerabilities.push({
      area: 'Side access',
      vulnerabilities: sideVulns,
      riskLevel: 'high',
      countermeasures: ['Lockable gate', 'PIR lighting', 'Thorny planting']
    });
  }

  if (projectDetails.parkingType === 'driveway' || projectDetails.parkingType === 'garage') {
    vulnerabilities.push({
      area: 'Parking area',
      vulnerabilities: parkingVulns,
      riskLevel: 'medium',
      countermeasures: ['Lighting', 'Garage security', 'Driveway visibility']
    });
  }

  return {
    description: 'Security vulnerability assessment of site',
    vulnerabilities,
    overallRisk: projectDetails.rearAccess || projectDetails.sideAccess ? 'Medium' : 'Low-Medium'
  };
}

// =============================================================================
// PHYSICAL SECURITY
// =============================================================================

function assessPhysicalSecurity(projectDetails: SecurityProject): PhysicalSecurityAssessment {
  return {
    description: 'Physical security measures assessment',
    doors: {
      description: 'Door security requirements',
      requirements: [
        {
          measure: 'PAS 24 certified external door',
          category: 'physical',
          priority: 'essential',
          description: 'Attack-resistant door set tested to PAS 24:2022',
          specification: SBD_STANDARDS.doors.external
        },
        {
          measure: 'Multi-point locking',
          category: 'physical',
          priority: 'essential',
          description: 'Minimum 3-point locking mechanism',
          specification: SBD_STANDARDS.locks.multipoint
        },
        {
          measure: 'Anti-snap cylinder',
          category: 'physical',
          priority: 'essential',
          description: '3-star TS007 cylinder or Diamond Sold Secure',
          specification: SBD_STANDARDS.locks.cylinders
        },
        {
          measure: 'Door viewer and chain',
          category: 'physical',
          priority: 'recommended',
          description: 'Door viewer (spy hole) and door chain/limiter'
        }
      ],
      standards: [SBD_STANDARDS.doors.external, SBD_STANDARDS.locks.cylinders]
    },
    windows: {
      description: 'Window security requirements',
      requirements: [
        {
          measure: 'PAS 24 ground floor windows',
          category: 'physical',
          priority: 'essential',
          description: 'All accessible windows to PAS 24:2022'
        },
        {
          measure: 'Locking handles',
          category: 'physical',
          priority: 'essential',
          description: 'Key-operated or button-release locking handles'
        },
        {
          measure: 'Laminated glazing',
          category: 'physical',
          priority: 'recommended',
          description: 'Laminated inner pane for vulnerable windows'
        }
      ],
      vulnerableAreas: [
        'Ground floor windows',
        'Windows near flat roof',
        'Windows accessible from extension',
        'Basement windows'
      ]
    },
    boundaries: {
      description: 'Boundary security requirements',
      frontBoundary: projectDetails.frontBoundary === 'open'
        ? 'Consider low wall or railings to define property'
        : 'Existing boundary appropriate - maintain visibility',
      sideBoundary: '1.8m close-boarded fence recommended',
      rearBoundary: '1.8m fence with trellis topping (total 2m)',
      gating: 'Side/rear gates to match fence height, key-lockable'
    }
  };
}

// =============================================================================
// SURVEILLANCE ASSESSMENT
// =============================================================================

function assessSurveillance(projectDetails: SecurityProject): SurveillanceAssessment {
  return {
    description: 'Natural surveillance opportunities and design',
    principles: [
      'Eyes on the street - windows overlooking public areas',
      'Active frontages - habitable rooms to front',
      'Clear sightlines - avoid visual barriers',
      'Activity generators - encourage legitimate presence'
    ],
    designFeatures: [
      'Living room/kitchen to front for active surveillance',
      'Low front boundary maintaining visibility',
      'Clear glazing on front doors where possible',
      'Avoid blank gable walls to street',
      'Position garage to not obstruct views'
    ],
    blindSpots: [
      'Side passages between buildings',
      'Rear of detached garages',
      'Areas behind dense planting',
      'Recessed doorways'
    ]
  };
}

// =============================================================================
// ACCESS CONTROL
// =============================================================================

function assessAccessControl(projectDetails: SecurityProject): AccessControlAssessment {
  const measures: SecurityMeasure[] = [
    {
      measure: 'Front boundary definition',
      category: 'access_control',
      priority: 'recommended',
      description: 'Clear demarcation between public and private space'
    },
    {
      measure: 'Side gate security',
      category: 'access_control',
      priority: projectDetails.sideAccess ? 'essential' : 'recommended',
      description: '1.8m lockable gate with self-closing mechanism'
    },
    {
      measure: 'Rear boundary security',
      category: 'access_control',
      priority: 'essential',
      description: 'Robust fencing preventing easy climbing'
    }
  ];

  if (projectDetails.communalAreas) {
    measures.push({
      measure: 'Access control system',
      category: 'access_control',
      priority: 'essential',
      description: 'Audio/video intercom with electronic release'
    });
  }

  return {
    description: 'Access control layers and measures',
    layers: [
      'Layer 1: Site boundary (front wall/railings)',
      'Layer 2: Building curtilage (garden/parking)',
      'Layer 3: Building envelope (doors/windows)',
      'Layer 4: Internal compartmentalization'
    ],
    measures
  };
}

// =============================================================================
// TERRITORIAL ASSESSMENT
// =============================================================================

function assessTerritorial(projectDetails: SecurityProject): TerritorialAssessment {
  return {
    description: 'Territorial reinforcement through design',
    principles: [
      'Clear ownership - distinguish public from private',
      'Personalization - show property is cared for',
      'Maintenance - well-maintained deters crime',
      'Symbolic barriers - define space without obstruction'
    ],
    designFeatures: [
      'Named/numbered property clearly visible',
      'Maintained front garden and boundaries',
      'Different paving for private driveways',
      'Gate/entry marking transition points',
      'Personal touches showing occupation'
    ]
  };
}

// =============================================================================
// LIGHTING STRATEGY
// =============================================================================

function developLightingStrategy(projectDetails: SecurityProject): SecurityLightingStrategy {
  const zones: LightingZoneSpec[] = [
    {
      zone: 'Front entrance',
      requirement: 'Continuous dusk-to-dawn',
      specification: 'Photocell activated, 50-100 lux'
    },
    {
      zone: 'Rear entrance',
      requirement: 'PIR activated',
      specification: 'Motion sensor, 100-150 lux'
    }
  ];

  if (projectDetails.sideAccess) {
    zones.push({
      zone: 'Side passage',
      requirement: 'PIR activated',
      specification: 'Motion sensor, minimum 50 lux'
    });
  }

  if (projectDetails.parkingType === 'driveway') {
    zones.push({
      zone: 'Driveway/parking',
      requirement: 'PIR activated',
      specification: 'Motion sensor covering vehicle area'
    });
  }

  return {
    description: 'Security lighting strategy',
    zones,
    sensorTypes: [
      'PIR (Passive Infrared) - detects body heat',
      'Microwave - detects movement through materials',
      'Photocell - activates at dusk',
      'Timer - scheduled operation'
    ]
  };
}

// =============================================================================
// LANDSCAPE GUIDANCE
// =============================================================================

function developLandscapeGuidance(projectDetails: SecurityProject): LandscapeSecurityGuidance {
  return {
    description: 'Landscaping for crime prevention',
    principles: [
      'Maintain sightlines - avoid dense screening',
      'Hostile planting - thorny species on boundaries',
      'CPTED planting - design out crime opportunity',
      'Layered planting - ground cover under windows'
    ],
    plantingGuidance: [
      'Front: Low planting under 1m maintaining visibility',
      'Side boundaries: Thorny hedging (berberis, pyracantha)',
      'Rear: Defensive planting on vulnerable sections',
      'Under windows: Dense, thorny shrubs deterring approach'
    ],
    avoidList: [
      'Large shrubs near windows (hiding places)',
      'Trees allowing climbing to upper floors',
      'Dense planting obscuring entrances',
      'Climbable trellis on side passages'
    ]
  };
}

// =============================================================================
// BUILDING SPECIFICATIONS
// =============================================================================

function getBuildingSpecs(projectDetails: SecurityProject): BuildingSecuritySpecs {
  return {
    description: 'Security specifications for building elements',
    doorSpecs: [
      'External doors: PAS 24:2022 certified',
      'Frame: Reinforced to match door rating',
      'Hinges: Dog-bolts or security hinges',
      'Letterbox: Internal cage or external location',
      'Cylinder: TS007 3-star or Sold Secure Diamond'
    ],
    windowSpecs: [
      'Ground floor: PAS 24:2022 certified',
      'Accessible: PAS 24:2022 certified',
      'Glass: Laminated 6.4mm inner pane (vulnerable locations)',
      'Locks: Key-operated restrictors',
      'Hardware: Anti-lift, hinge-side security'
    ],
    alarmSpecs: [
      'Grade 2 minimum for insurance purposes',
      'BS EN 50131-1 compliant system',
      'Professional installation recommended',
      'Consider smart/connected systems'
    ]
  };
}

// =============================================================================
// SBD CERTIFICATION
// =============================================================================

function getSBDGuidance(projectDetails: SecurityProject): SBDCertificationGuidance {
  return {
    description: 'Secured by Design certification guidance',
    benefits: [
      'Police-preferred specification',
      'Insurance premium reductions',
      'Demonstrated security commitment',
      'Higher resale appeal'
    ],
    process: [
      '1. Review SBD Homes guide',
      '2. Apply through local Designing Out Crime Officer',
      '3. Specify compliant products',
      '4. Application assessment',
      '5. Certification upon completion'
    ],
    requirements: [
      'All external doors PAS 24:2022',
      'Accessible windows PAS 24:2022',
      'Door cylinders TS007 3-star',
      'Security lighting to key areas',
      'Robust boundary treatments'
    ]
  };
}

// =============================================================================
// CONCLUSION
// =============================================================================

function generateConclusion(projectDetails: SecurityProject): SecurityConclusion {
  return {
    overallAssessment: 'Development can achieve good security with appropriate specifications',
    achievable: true,
    conditions: [
      'Specify PAS 24 doors and windows',
      'Install PIR lighting to vulnerable areas',
      'Secure side/rear access with quality gates',
      'Consider SBD certification for formal recognition'
    ]
  };
}

// =============================================================================
// RECOMMENDATIONS
// =============================================================================

function generateRecommendations(projectDetails: SecurityProject): string[] {
  const recommendations = [
    'Specify PAS 24:2022 certified external doors',
    'Install PAS 24 windows to ground floor and accessible locations',
    'Use TS007 3-star anti-snap door cylinders',
    'Install PIR-controlled security lighting'
  ];

  if (projectDetails.sideAccess) {
    recommendations.push('Fit 1.8m lockable side gate with self-closer');
  }

  if (projectDetails.rearAccess) {
    recommendations.push('Secure rear gate with heavy-duty padlock or mortice lock');
  }

  recommendations.push(
    'Consider smart doorbell with video/intercom',
    'Maintain clear sightlines from windows to boundaries',
    'Plant thorny species on vulnerable boundaries',
    'Register with police immobiliser scheme'
  );

  if (projectDetails.newBuild) {
    recommendations.push('Apply for Secured by Design certification');
  }

  return recommendations;
}

// =============================================================================
// EXPORTS
// =============================================================================

const securedByDesign = {
  assessSecurity,
  SBD_STANDARDS,
  COMMON_VULNERABILITIES
};

export default securedByDesign;
