/**
 * Fire Safety Strategy Service
 * 
 * Provides fire safety strategy guidance for residential developments,
 * including means of escape, fire detection, and suppression requirements.
 * 
 * Coverage: NW1-NW11, N2, N6, N10 postcodes
 */

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

interface FireSafetyProject {
  propertyType?: 'detached' | 'semi_detached' | 'terraced' | 'flat' | 'hmo';
  projectType?: 'extension' | 'loft' | 'basement' | 'new_build' | 'conversion';
  storeys?: number;
  floorArea?: number;
  occupancy?: number;
  existingDetection?: boolean;
  openPlanDesign?: boolean;
  innerRooms?: boolean;
}

interface MeansOfEscape {
  category: string;
  requirement: string;
  currentProvision: string;
  proposedProvision: string;
  compliant: boolean;
}

interface FireDetection {
  grade: string;
  category: string;
  description: string;
  detectorTypes: string[];
  locations: string[];
}

interface StructuralFireProtection {
  element: string;
  requirement: string;
  specification: string;
  duration: string;
}

interface FireSafetyAnalysis {
  summary: FireSafetySummary;
  buildingRisk: BuildingRiskAssessment;
  meansOfEscape: MeansOfEscapeAssessment;
  fireDetection: FireDetectionAssessment;
  structuralProtection: StructuralProtectionAssessment;
  firefighting: FirefightingAssessment;
  specialConsiderations: SpecialConsiderations;
  regulatoryCompliance: FireRegulatoryCompliance[];
  recommendations: string[];
}

interface FireSafetySummary {
  riskCategory: string;
  primaryRequirements: string[];
  complianceStatus: string;
  buildingControl: string;
}

interface BuildingRiskAssessment {
  occupancyType: string;
  heightCategory: string;
  complexity: string;
  riskLevel: 'low' | 'medium' | 'high';
  factors: string[];
}

interface MeansOfEscapeAssessment {
  description: string;
  escapeRoutes: MeansOfEscape[];
  travelDistances: TravelDistance[];
  overallCompliance: string;
}

interface TravelDistance {
  from: string;
  to: string;
  distance: string;
  maxAllowed: string;
  compliant: boolean;
}

interface FireDetectionAssessment {
  description: string;
  required: FireDetection;
  alarmSystem: string;
  recommendations: string[];
}

interface StructuralProtectionAssessment {
  description: string;
  elements: StructuralFireProtection[];
  compartmentation: string;
  fireStops: string;
}

interface FirefightingAssessment {
  accessRequirements: string;
  hydrantProvision: string;
  facilitiesRequired: string[];
  sprinklerRequirement: string;
}

interface SpecialConsiderations {
  basement?: BasementFireSafety;
  loftConversion?: LoftFireSafety;
  openPlan?: OpenPlanFireSafety;
}

interface BasementFireSafety {
  description: string;
  escapeRequirements: string[];
  ventilation: string;
  detection: string;
}

interface LoftFireSafety {
  description: string;
  escapeRoute: string;
  protectedStair: string;
  doorUpgrades: string[];
}

interface OpenPlanFireSafety {
  description: string;
  detection: string;
  suppressionConsideration: string;
  escapeDistance: string;
}

interface FireRegulatoryCompliance {
  regulation: string;
  requirement: string;
  compliance: 'complies' | 'partial' | 'requires_upgrade';
  action: string;
}

// =============================================================================
// FIRE DETECTION GRADES
// =============================================================================

const DETECTION_GRADES = {
  LD1: {
    description: 'A system of detectors throughout the dwelling',
    coverage: 'All areas including roof voids and cupboards',
    typical: 'High-risk properties, HMOs, sheltered housing'
  },
  LD2: {
    description: 'Detectors in escape routes plus high-risk rooms',
    coverage: 'Circulation, kitchen, principal habitable rooms',
    typical: 'Loft conversions, material alterations'
  },
  LD3: {
    description: 'Detectors in escape routes only',
    coverage: 'Hallways, landings, stairs',
    typical: 'Standard new dwellings, extensions'
  }
};

// =============================================================================
// MAIN SERVICE FUNCTION
// =============================================================================

async function assessFireSafety(
  address: string,
  postcode: string,
  projectType: string,
  projectDetails: FireSafetyProject = {}
): Promise<FireSafetyAnalysis> {
  const summary = generateSummary(projectDetails);
  const buildingRisk = assessBuildingRisk(projectDetails);
  const meansOfEscape = assessMeansOfEscape(projectType, projectDetails);
  const fireDetection = assessFireDetection(projectType, projectDetails);
  const structuralProtection = assessStructuralProtection(projectDetails);
  const firefighting = assessFirefighting(projectDetails);
  const specialConsiderations = assessSpecialConsiderations(projectType, projectDetails);
  const regulatoryCompliance = assessCompliance(projectType, projectDetails);
  const recommendations = generateRecommendations(projectType, projectDetails);

  return {
    summary,
    buildingRisk,
    meansOfEscape,
    fireDetection,
    structuralProtection,
    firefighting,
    specialConsiderations,
    regulatoryCompliance,
    recommendations
  };
}

// =============================================================================
// SUMMARY
// =============================================================================

function generateSummary(projectDetails: FireSafetyProject): FireSafetySummary {
  const storeys = projectDetails.storeys || 2;
  const isConversion = projectDetails.projectType === 'conversion';
  const isLoft = projectDetails.projectType === 'loft';
  const isBasement = projectDetails.projectType === 'basement';

  const requirements: string[] = [];
  if (isLoft || storeys >= 3) requirements.push('Upgraded fire detection');
  if (isLoft || storeys >= 3) requirements.push('Protected escape route');
  if (isBasement) requirements.push('Basement escape provisions');
  if (isConversion) requirements.push('Building Regulations fire compliance');

  if (requirements.length === 0) {
    requirements.push('Standard fire detection', 'Clear escape routes');
  }

  return {
    riskCategory: storeys >= 3 ? 'Higher risk (3+ storeys)' : 'Standard risk',
    primaryRequirements: requirements,
    complianceStatus: 'Achievable with appropriate measures',
    buildingControl: 'Building Regulations approval required for fire safety compliance'
  };
}

// =============================================================================
// BUILDING RISK ASSESSMENT
// =============================================================================

function assessBuildingRisk(projectDetails: FireSafetyProject): BuildingRiskAssessment {
  const storeys = projectDetails.storeys || 2;
  const isHMO = projectDetails.propertyType === 'hmo';

  const factors: string[] = [];
  let risk: BuildingRiskAssessment['riskLevel'] = 'low';

  if (storeys >= 3) {
    factors.push('Three or more storeys - requires protected escape route');
    risk = 'medium';
  }
  if (storeys >= 4 || (storeys >= 3 && projectDetails.floorArea && projectDetails.floorArea > 200)) {
    risk = 'high';
  }
  if (isHMO) {
    factors.push('HMO - enhanced fire safety requirements apply');
    risk = 'high';
  }
  if (projectDetails.openPlanDesign) {
    factors.push('Open plan layout - may require sprinklers or enhanced detection');
  }
  if (projectDetails.innerRooms) {
    factors.push('Inner rooms present - escape through another room');
  }

  return {
    occupancyType: isHMO ? 'House in Multiple Occupation' : 'Single family dwelling',
    heightCategory: storeys <= 2 ? 'Low-rise (≤2 storeys)' : storeys <= 4 ? 'Medium-rise (3-4 storeys)' : 'Higher-rise',
    complexity: projectDetails.openPlanDesign ? 'Open plan layout' : 'Traditional cellular layout',
    riskLevel: risk,
    factors: factors.length > 0 ? factors : ['Standard domestic risk profile']
  };
}

// =============================================================================
// MEANS OF ESCAPE ASSESSMENT
// =============================================================================

function assessMeansOfEscape(
  projectType: string,
  projectDetails: FireSafetyProject
): MeansOfEscapeAssessment {
  const storeys = projectDetails.storeys || 2;
  const isLoft = projectType === 'loft';
  const isBasement = projectType === 'basement';
  const escapeRoutes: MeansOfEscape[] = [];
  const travelDistances: TravelDistance[] = [];

  // Main escape route
  escapeRoutes.push({
    category: 'Primary escape route',
    requirement: 'Protected route from all habitable rooms to final exit',
    currentProvision: 'Existing staircase and hallway',
    proposedProvision: storeys >= 3 || isLoft
      ? 'Upgraded to protected stairway with fire doors'
      : 'Existing provision adequate',
    compliant: true
  });

  // Alternative escape
  if (storeys >= 3 || isLoft) {
    escapeRoutes.push({
      category: 'Alternative escape (upper floors)',
      requirement: 'Secondary means of escape or enhanced primary route',
      currentProvision: 'Emergency egress window may be required',
      proposedProvision: 'Dormer/window suitable for emergency escape, or sprinkler system',
      compliant: true
    });
  }

  // Basement escape
  if (isBasement) {
    escapeRoutes.push({
      category: 'Basement escape',
      requirement: 'Escape route from basement level',
      currentProvision: 'N/A - new basement',
      proposedProvision: 'External lightwell with escape ladder, or protected internal stair',
      compliant: true
    });
  }

  // Travel distances
  travelDistances.push({
    from: 'Furthest point on upper floor',
    to: 'Top of protected stairway',
    distance: '9m typical',
    maxAllowed: '9m (one direction only)',
    compliant: true
  });

  return {
    description: 'Assessment of escape routes and travel distances',
    escapeRoutes,
    travelDistances,
    overallCompliance: 'Compliant with appropriate upgrades'
  };
}

// =============================================================================
// FIRE DETECTION ASSESSMENT
// =============================================================================

function assessFireDetection(
  projectType: string,
  projectDetails: FireSafetyProject
): FireDetectionAssessment {
  const storeys = projectDetails.storeys || 2;
  const isLoft = projectType === 'loft';
  const isBasement = projectType === 'basement';

  let gradeRequired = 'LD3';
  if (isLoft || storeys >= 3) gradeRequired = 'LD2';
  if (projectDetails.openPlanDesign && storeys >= 3) gradeRequired = 'LD1';

  const grade = DETECTION_GRADES[gradeRequired as keyof typeof DETECTION_GRADES];

  const locations: string[] = ['Hallway (each floor)', 'Landing'];
  if (gradeRequired === 'LD2' || gradeRequired === 'LD1') {
    locations.push('Kitchen (heat detector)', 'Living room');
  }
  if (gradeRequired === 'LD1') {
    locations.push('All bedrooms', 'Loft space');
  }
  if (isBasement) {
    locations.push('Basement level');
  }

  return {
    description: `Fire detection to BS 5839-6 Grade ${gradeRequired}`,
    required: {
      grade: gradeRequired,
      category: grade.typical,
      description: grade.description,
      detectorTypes: ['Optical smoke detectors (general)', 'Heat detectors (kitchen)'],
      locations
    },
    alarmSystem: 'Interlinked mains-powered detectors with battery backup',
    recommendations: [
      'Install interlinked detection system throughout',
      'Heat detector in kitchen (not smoke detector)',
      'Test all detectors monthly',
      'Replace detectors every 10 years'
    ]
  };
}

// =============================================================================
// STRUCTURAL PROTECTION ASSESSMENT
// =============================================================================

function assessStructuralProtection(
  projectDetails: FireSafetyProject
): StructuralProtectionAssessment {
  const storeys = projectDetails.storeys || 2;
  const elements: StructuralFireProtection[] = [];

  // Floor structure
  elements.push({
    element: 'Floor structure',
    requirement: 'Fire resistance for means of escape',
    specification: 'REI 30 (30 minutes load-bearing, integrity, insulation)',
    duration: storeys >= 3 ? '30 minutes' : '30 minutes'
  });

  // Walls to protected stairway
  if (storeys >= 3) {
    elements.push({
      element: 'Walls enclosing protected stairway',
      requirement: 'Fire-resisting construction',
      specification: 'EI 30 (30 minutes integrity and insulation)',
      duration: '30 minutes'
    });
  }

  // Fire doors
  elements.push({
    element: 'Doors to protected stairway',
    requirement: 'Self-closing fire doors',
    specification: 'FD30S (30 minutes with smoke seals)',
    duration: '30 minutes'
  });

  return {
    description: 'Structural fire protection requirements',
    elements,
    compartmentation: 'Dwelling to form single fire compartment; separation from any attached properties',
    fireStops: 'Fire stopping required at all service penetrations through fire-resisting elements'
  };
}

// =============================================================================
// FIREFIGHTING ASSESSMENT
// =============================================================================

function assessFirefighting(projectDetails: FireSafetyProject): FirefightingAssessment {
  const storeys = projectDetails.storeys || 2;

  return {
    accessRequirements: 'Standard residential access - vehicle access to within 45m of dwelling entrance',
    hydrantProvision: 'Existing street hydrant provision typically adequate',
    facilitiesRequired: storeys >= 4
      ? ['Fire main may be required', 'Firefighter access considerations']
      : ['No special firefighting facilities required for domestic scale'],
    sprinklerRequirement: storeys >= 3 && projectDetails.openPlanDesign
      ? 'Sprinklers should be considered as compensatory feature for open plan layout'
      : 'Not required for standard domestic dwelling, but may be provided voluntarily'
  };
}

// =============================================================================
// SPECIAL CONSIDERATIONS
// =============================================================================

function assessSpecialConsiderations(
  projectType: string,
  projectDetails: FireSafetyProject
): SpecialConsiderations {
  const considerations: SpecialConsiderations = {};

  if (projectType === 'basement') {
    considerations.basement = {
      description: 'Basement-specific fire safety requirements',
      escapeRequirements: [
        'External lightwell with escape ladder (preferred)',
        'Alternatively: protected internal stair with FD30S doors',
        'Emergency egress window if lightwell not feasible'
      ],
      ventilation: 'Smoke ventilation to basement - AOV or openable windows',
      detection: 'Smoke detection at basement level linked to main system'
    };
  }

  if (projectType === 'loft') {
    considerations.loftConversion = {
      description: 'Loft conversion fire safety requirements',
      escapeRoute: 'Protected stairway from loft to ground floor exit',
      protectedStair: 'Fire-resisting enclosure to stairway (30 minutes)',
      doorUpgrades: [
        'FD30S doors to all rooms opening onto stairway',
        'Self-closing devices required',
        'Intumescent strips and smoke seals'
      ]
    };
  }

  if (projectDetails.openPlanDesign) {
    considerations.openPlan = {
      description: 'Open plan layout considerations',
      detection: 'Enhanced detection (Grade LD2 minimum)',
      suppressionConsideration: 'Residential sprinkler system may allow open plan to proceed',
      escapeDistance: 'Travel distance to be calculated to protected stair or final exit'
    };
  }

  return considerations;
}

// =============================================================================
// REGULATORY COMPLIANCE
// =============================================================================

function assessCompliance(
  projectType: string,
  projectDetails: FireSafetyProject
): FireRegulatoryCompliance[] {
  const storeys = projectDetails.storeys || 2;
  const compliance: FireRegulatoryCompliance[] = [];

  compliance.push({
    regulation: 'Building Regulations Part B (Fire Safety)',
    requirement: 'Compliance with Approved Document B',
    compliance: 'complies',
    action: 'Design to Approved Document B Volume 1 (Dwellings)'
  });

  if (projectType === 'loft' || storeys >= 3) {
    compliance.push({
      regulation: 'Approved Document B - B1 Means of Warning and Escape',
      requirement: 'Protected stairway for 3+ storey dwelling',
      compliance: projectDetails.existingDetection ? 'requires_upgrade' : 'requires_upgrade',
      action: 'Install protected stairway enclosure and upgrade detection to LD2'
    });
  }

  compliance.push({
    regulation: 'BS 5839-6 Fire Detection and Alarm Systems',
    requirement: 'Appropriate grade of detection system',
    compliance: projectDetails.existingDetection ? 'partial' : 'requires_upgrade',
    action: 'Install/upgrade to interlinked mains-powered system'
  });

  return compliance;
}

// =============================================================================
// RECOMMENDATIONS
// =============================================================================

function generateRecommendations(
  projectType: string,
  projectDetails: FireSafetyProject
): string[] {
  const recommendations = [
    'Submit fire safety strategy with Building Regulations application',
    'Install compliant fire detection system before occupation',
    'Fit fire doors with self-closing devices to all rooms off stairway'
  ];

  if (projectType === 'loft') {
    recommendations.push(
      'Create protected stairway enclosure to loft',
      'Consider emergency egress window in loft room',
      'Upgrade all existing doors to fire doors'
    );
  }

  if (projectType === 'basement') {
    recommendations.push(
      'Provide escape route from basement',
      'Install smoke ventilation to basement',
      'Consider fire suppression if escape route is compromised'
    );
  }

  if (projectDetails.openPlanDesign) {
    recommendations.push(
      'Consider residential sprinkler system',
      'Ensure travel distances are acceptable',
      'Install enhanced detection throughout'
    );
  }

  return recommendations;
}

// =============================================================================
// EXPORTS
// =============================================================================

const fireSafety = {
  assessFireSafety,
  DETECTION_GRADES
};

export default fireSafety;
