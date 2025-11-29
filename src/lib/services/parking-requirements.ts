/**
 * Parking Requirements Service
 * 
 * Comprehensive parking analysis for planning applications
 * including residential, commercial, and accessibility requirements
 */

// Types
interface ParkingAssessment {
  address: string;
  postcode: string;
  projectType: string;
  existingSpaces: number;
  requiredSpaces: ParkingRequirements;
  cycleParking: CycleParkingRequirements;
  evCharging: EVChargingRequirements;
  accessibility: AccessibilityRequirements;
  permitZone: PermitZoneInfo;
  transportAccessibility: TransportAccessibility;
  recommendations: ParkingRecommendations;
  planningImplications: PlanningImplication[];
}

interface ParkingRequirements {
  residential: ResidentialParking;
  commercial: CommercialParking | null;
  total: number;
  maxPermitted: number;
  carFree: boolean;
  justification: string;
}

interface ResidentialParking {
  standardSpaces: number;
  disabledSpaces: number;
  visitorSpaces: number;
  breakdown: ParkingBreakdown[];
}

interface ParkingBreakdown {
  unitType: string;
  quantity: number;
  ratio: string;
  spaces: number;
}

interface CommercialParking {
  type: string;
  floorArea: number;
  standardSpaces: number;
  disabledSpaces: number;
  operationalSpaces: number;
}

interface CycleParkingRequirements {
  longStay: number;
  shortStay: number;
  specifications: CycleSpecification[];
  location: string;
  covered: boolean;
  secure: boolean;
}

interface CycleSpecification {
  type: string;
  quantity: number;
  dimensions: string;
  access: string;
}

interface EVChargingRequirements {
  activeChargePoints: number;
  passiveProvision: number;
  chargingType: string;
  powerOutput: string;
  requirements: string[];
}

interface AccessibilityRequirements {
  disabledBays: number;
  bayDimensions: string;
  location: string;
  surfacing: string;
  transferZone: string;
  additionalRequirements: string[];
}

interface PermitZoneInfo {
  zoneName: string;
  zoneCode: string;
  restrictions: string;
  permitEligibility: PermitEligibility;
  costs: PermitCosts;
}

interface PermitEligibility {
  eligible: boolean;
  maxPermits: number;
  restrictions: string[];
  newDevelopmentPolicy: string;
}

interface PermitCosts {
  firstPermit: number;
  secondPermit: number;
  visitorPermits: string;
}

interface TransportAccessibility {
  ptal: number;
  ptalRating: string;
  nearestStations: NearestStation[];
  busRoutes: number;
  carFreeEligible: boolean;
  reducedParkingJustifiable: boolean;
}

interface NearestStation {
  name: string;
  type: string;
  distance: string;
  walkTime: string;
}

interface ParkingRecommendations {
  strategy: string;
  recommendations: string[];
  designGuidance: string[];
  planningStatement: string;
}

interface PlanningImplication {
  issue: string;
  policy: string;
  requirement: string;
  impact: 'low' | 'medium' | 'high';
}

// Camden Controlled Parking Zones
const CPZ_ZONES: { [key: string]: { name: string; hours: string; days: string } } = {
  'NW1': { name: 'Zone C', hours: '08:30-18:30', days: 'Mon-Fri' },
  'NW3': { name: 'Zone H (Hampstead)', hours: '08:30-18:30', days: 'Mon-Sat' },
  'NW5': { name: 'Zone D', hours: '08:30-18:30', days: 'Mon-Fri' },
  'NW6': { name: 'Zone F', hours: '08:30-18:30', days: 'Mon-Fri' },
  'NW8': { name: 'Westminster Zone', hours: '08:30-18:30', days: 'Mon-Sat' },
  'N2': { name: 'Barnet Zone', hours: '10:00-16:00', days: 'Mon-Fri' },
  'N6': { name: 'Zone HG (Highgate)', hours: '10:00-12:00', days: 'Mon-Fri' },
  'N10': { name: 'Haringey Zone', hours: '08:30-18:30', days: 'Mon-Sat' }
};

// PTAL ratings by area
const PTAL_RATINGS: { [key: string]: { ptal: number; rating: string } } = {
  'NW1': { ptal: 6, rating: 'Excellent' },
  'NW3': { ptal: 4, rating: 'Good' },
  'NW5': { ptal: 4, rating: 'Good' },
  'NW6': { ptal: 5, rating: 'Very Good' },
  'NW8': { ptal: 4, rating: 'Good' },
  'N2': { ptal: 3, rating: 'Moderate' },
  'N6': { ptal: 3, rating: 'Moderate' },
  'N10': { ptal: 3, rating: 'Moderate' }
};

// Parking standards (Camden Local Plan)
const PARKING_STANDARDS = {
  residential: {
    studio: 0.5,
    oneBed: 0.75,
    twoBed: 1,
    threePlusBed: 1.25,
    maxRatio: 1 // Maximum 1 space per unit in CPZ
  },
  commercial: {
    office: 0, // Car-free in Camden
    retail: 0.5, // Per 100sqm
    restaurant: 0, // Car-free
    hotel: 0.2 // Per room
  },
  cycling: {
    residential: {
      longStay: 1, // Per bedroom
      shortStay: 1 // Per 40 units
    },
    office: {
      longStay: 1, // Per 75sqm
      shortStay: 1 // Per 500sqm
    }
  }
};

/**
 * Get comprehensive parking assessment
 */
export async function getParkingAssessment(
  address: string,
  postcode: string,
  projectType: string,
  projectDetails?: {
    existingSpaces?: number;
    proposedUnits?: UnitMix[];
    commercialFloorArea?: number;
    commercialType?: string;
    isNewBuild?: boolean;
    hasGarage?: boolean;
  }
): Promise<ParkingAssessment> {
  const parts = postcode.split(' ');
  const outcode = parts[0] || 'NW3';
  
  const existingSpaces = projectDetails?.existingSpaces || 0;
  const transportAccess = getTransportAccessibility(outcode);
  const permitZone = getPermitZoneInfo(outcode);
  
  const requiredSpaces = calculateParkingRequirements(
    projectDetails?.proposedUnits || [],
    projectDetails?.commercialFloorArea,
    projectDetails?.commercialType,
    transportAccess,
    projectDetails?.isNewBuild || false
  );
  
  const cycleParking = calculateCycleParking(
    projectDetails?.proposedUnits || [],
    projectDetails?.commercialFloorArea,
    projectDetails?.commercialType
  );
  
  const evCharging = calculateEVCharging(
    requiredSpaces.total,
    projectDetails?.isNewBuild || false
  );
  
  const accessibility = calculateAccessibilityRequirements(
    requiredSpaces.total,
    projectDetails?.commercialFloorArea
  );
  
  const recommendations = generateRecommendations(
    requiredSpaces,
    transportAccess,
    permitZone,
    projectType
  );
  
  const planningImplications = assessPlanningImplications(
    existingSpaces,
    requiredSpaces,
    transportAccess,
    permitZone
  );
  
  return {
    address,
    postcode,
    projectType,
    existingSpaces,
    requiredSpaces,
    cycleParking,
    evCharging,
    accessibility,
    permitZone,
    transportAccessibility: transportAccess,
    recommendations,
    planningImplications
  };
}

interface UnitMix {
  type: 'studio' | 'oneBed' | 'twoBed' | 'threePlusBed';
  quantity: number;
}

/**
 * Get transport accessibility data
 */
function getTransportAccessibility(outcode: string): TransportAccessibility {
  const ptalInfo = PTAL_RATINGS[outcode] || { ptal: 3, rating: 'Moderate' };
  
  // Nearest stations by area
  const stationsByArea: { [key: string]: NearestStation[] } = {
    'NW3': [
      { name: 'Hampstead', type: 'Underground (Northern)', distance: '0.2-0.8km', walkTime: '3-10 mins' },
      { name: 'Belsize Park', type: 'Underground (Northern)', distance: '0.3-1km', walkTime: '4-12 mins' },
      { name: 'Hampstead Heath', type: 'Overground', distance: '0.5-1.2km', walkTime: '6-15 mins' }
    ],
    'NW5': [
      { name: 'Kentish Town', type: 'Underground (Northern)', distance: '0.3-0.8km', walkTime: '4-10 mins' },
      { name: 'Gospel Oak', type: 'Overground', distance: '0.4-1km', walkTime: '5-12 mins' }
    ],
    'N6': [
      { name: 'Highgate', type: 'Underground (Northern)', distance: '0.3-1km', walkTime: '4-12 mins' },
      { name: 'Archway', type: 'Underground (Northern)', distance: '0.5-1.2km', walkTime: '6-15 mins' }
    ],
    'NW6': [
      { name: 'West Hampstead', type: 'Underground (Jubilee)', distance: '0.2-0.8km', walkTime: '3-10 mins' },
      { name: 'Kilburn', type: 'Underground (Jubilee)', distance: '0.3-1km', walkTime: '4-12 mins' }
    ]
  };
  
  const stations = stationsByArea[outcode] || stationsByArea['NW3'];
  const safeStations: NearestStation[] = stations || [
    { name: 'Hampstead', type: 'Underground (Northern)', distance: '0.2-0.8km', walkTime: '3-10 mins' }
  ];
  
  return {
    ptal: ptalInfo.ptal,
    ptalRating: ptalInfo.rating,
    nearestStations: safeStations,
    busRoutes: ptalInfo.ptal * 3, // Approximate
    carFreeEligible: ptalInfo.ptal >= 4,
    reducedParkingJustifiable: ptalInfo.ptal >= 3
  };
}

/**
 * Get permit zone information
 */
function getPermitZoneInfo(outcode: string): PermitZoneInfo {
  const zoneData = CPZ_ZONES[outcode] || CPZ_ZONES['NW3'];
  const zoneInfo = zoneData || { name: 'Zone H (Hampstead)', hours: '08:30-18:30', days: 'Mon-Sat' };
  
  return {
    zoneName: zoneInfo.name,
    zoneCode: outcode,
    restrictions: `${zoneInfo.hours} ${zoneInfo.days}`,
    permitEligibility: {
      eligible: true,
      maxPermits: 2,
      restrictions: [
        'Existing residents only',
        'Must be registered keeper',
        'One permit per household standard',
        'Second permit may be refused'
      ],
      newDevelopmentPolicy: 'New developments typically permit-free - residents not entitled to parking permits'
    },
    costs: {
      firstPermit: 180, // Annual
      secondPermit: 360,
      visitorPermits: '£6 per day or £50 for book of 10'
    }
  };
}

/**
 * Calculate parking requirements
 */
function calculateParkingRequirements(
  proposedUnits: UnitMix[],
  commercialFloorArea: number | undefined,
  commercialType: string | undefined,
  transportAccess: TransportAccessibility,
  isNewBuild: boolean
): ParkingRequirements {
  // Residential calculations
  let totalResidential = 0;
  const breakdown: ParkingBreakdown[] = [];
  
  for (const unit of proposedUnits) {
    const ratio = PARKING_STANDARDS.residential[unit.type] || 0.75;
    const spaces = unit.quantity * ratio;
    totalResidential += spaces;
    
    breakdown.push({
      unitType: unit.type,
      quantity: unit.quantity,
      ratio: `${ratio} spaces per unit`,
      spaces: Math.ceil(spaces)
    });
  }
  
  // Apply PTAL reduction
  let adjustedTotal = totalResidential;
  if (transportAccess.ptal >= 5) {
    adjustedTotal = totalResidential * 0.25; // 75% reduction
  } else if (transportAccess.ptal >= 4) {
    adjustedTotal = totalResidential * 0.5; // 50% reduction
  } else if (transportAccess.ptal >= 3) {
    adjustedTotal = totalResidential * 0.75; // 25% reduction
  }
  
  // Calculate disabled spaces (minimum 10% of total)
  const disabledSpaces = Math.max(1, Math.ceil(adjustedTotal * 0.1));
  
  // Visitor spaces for larger schemes
  const visitorSpaces = proposedUnits.length > 10 ? Math.ceil(proposedUnits.length * 0.1) : 0;
  
  const residential: ResidentialParking = {
    standardSpaces: Math.ceil(adjustedTotal) - disabledSpaces,
    disabledSpaces,
    visitorSpaces,
    breakdown
  };
  
  // Commercial calculations
  let commercial: CommercialParking | null = null;
  if (commercialFloorArea && commercialFloorArea > 0) {
    const normalizedType = (commercialType || 'office').toLowerCase();
    const typeKey = normalizedType as keyof typeof PARKING_STANDARDS.commercial;
    const ratio = PARKING_STANDARDS.commercial[typeKey] || 0;
    const commercialSpaces = (commercialFloorArea / 100) * ratio;
    
    commercial = {
      type: commercialType || 'Office',
      floorArea: commercialFloorArea,
      standardSpaces: Math.ceil(commercialSpaces),
      disabledSpaces: Math.max(1, Math.ceil(commercialSpaces * 0.1)),
      operationalSpaces: normalizedType === 'retail' ? 1 : 0
    };
  }
  
  const totalSpaces = Math.ceil(adjustedTotal) + (commercial?.standardSpaces || 0);
  
  // Determine if car-free is appropriate
  const carFree = isNewBuild && transportAccess.carFreeEligible && proposedUnits.length < 20;
  
  // Maximum permitted under policy
  const maxPermitted = carFree ? 0 : Math.ceil(totalResidential);
  
  return {
    residential,
    commercial,
    total: carFree ? 0 : totalSpaces,
    maxPermitted,
    carFree,
    justification: carFree 
      ? `Car-free development justified due to PTAL ${transportAccess.ptal} (${transportAccess.ptalRating}) and excellent public transport links`
      : `Parking provision based on Camden standards with PTAL ${transportAccess.ptal} reduction applied`
  };
}

/**
 * Calculate cycle parking requirements
 */
function calculateCycleParking(
  proposedUnits: UnitMix[],
  commercialFloorArea: number | undefined,
  commercialType: string | undefined
): CycleParkingRequirements {
  // Calculate bedrooms for residential
  let totalBedrooms = 0;
  for (const unit of proposedUnits) {
    switch (unit.type) {
      case 'studio': totalBedrooms += unit.quantity * 1; break;
      case 'oneBed': totalBedrooms += unit.quantity * 1; break;
      case 'twoBed': totalBedrooms += unit.quantity * 2; break;
      case 'threePlusBed': totalBedrooms += unit.quantity * 3; break;
    }
  }
  
  // Long-stay: 1 per bedroom for residential
  let longStay = totalBedrooms;
  
  // Add commercial if applicable
  if (commercialFloorArea && commercialFloorArea > 0) {
    longStay += Math.ceil(commercialFloorArea / 75);
  }
  
  // Short-stay: 1 per 40 residential units, plus commercial requirements
  const totalUnits = proposedUnits.reduce((sum, u) => sum + u.quantity, 0);
  let shortStay = Math.ceil(totalUnits / 40);
  
  if (commercialFloorArea && commercialFloorArea > 0) {
    shortStay += Math.ceil(commercialFloorArea / 500);
  }
  
  const specifications: CycleSpecification[] = [
    {
      type: 'Sheffield stands (2 bikes each)',
      quantity: Math.ceil(longStay / 2),
      dimensions: '750mm spacing minimum',
      access: 'Level access, minimum 1800mm aisle width'
    }
  ];
  
  if (shortStay > 0) {
    specifications.push({
      type: 'Sheffield stands - visitor',
      quantity: Math.ceil(shortStay / 2),
      dimensions: '750mm spacing minimum',
      access: 'Near main entrance, publicly accessible'
    });
  }
  
  // Add cargo bike provision for larger schemes
  if (totalUnits > 5) {
    specifications.push({
      type: 'Cargo bike spaces',
      quantity: Math.ceil(totalUnits * 0.05),
      dimensions: '1000mm x 2500mm minimum',
      access: 'Ground floor, easy access'
    });
  }
  
  return {
    longStay,
    shortStay,
    specifications,
    location: 'Secure internal store at ground floor level',
    covered: true,
    secure: true
  };
}

/**
 * Calculate EV charging requirements
 */
function calculateEVCharging(
  totalSpaces: number,
  isNewBuild: boolean
): EVChargingRequirements {
  // New buildings regulations
  if (isNewBuild) {
    return {
      activeChargePoints: totalSpaces, // All spaces with active charge point
      passiveProvision: 0,
      chargingType: 'Mode 3 (Type 2 connector)',
      powerOutput: 'Minimum 7kW per charge point',
      requirements: [
        'Every parking space must have an EV charge point (Building Regs 2021)',
        'Minimum 7kW output per charge point',
        'Smart charging capability required',
        'Electrical infrastructure must support future demand',
        'Load management system may be required'
      ]
    };
  }
  
  // Existing buildings - minimum 20% active, 80% passive
  return {
    activeChargePoints: Math.ceil(totalSpaces * 0.2),
    passiveProvision: Math.ceil(totalSpaces * 0.8),
    chargingType: 'Mode 3 (Type 2 connector)',
    powerOutput: 'Minimum 7kW per charge point',
    requirements: [
      `${Math.ceil(totalSpaces * 0.2)} active charge points required`,
      `${Math.ceil(totalSpaces * 0.8)} spaces with passive provision (cabling)`,
      'Electrical infrastructure for future expansion',
      'Consider smart charging to manage demand'
    ]
  };
}

/**
 * Calculate accessibility requirements
 */
function calculateAccessibilityRequirements(
  totalSpaces: number,
  commercialFloorArea: number | undefined
): AccessibilityRequirements {
  // Minimum 5% or 1 space, whichever is greater
  const disabledBays = Math.max(1, Math.ceil(totalSpaces * 0.05));
  
  const additionalRequirements: string[] = [
    'Located closest to main entrance',
    'Level or gently sloping access (max 1:20)',
    'Firm, even surface',
    'Clear signage and road markings',
    'Dropped kerbs to footways'
  ];
  
  if (commercialFloorArea && commercialFloorArea > 500) {
    additionalRequirements.push('Dedicated mobility scooter charging point');
    additionalRequirements.push('Consider powered doors at entrance');
  }
  
  return {
    disabledBays,
    bayDimensions: '3.6m wide x 6.0m long (minimum)',
    location: 'Adjacent to principal entrance, level access',
    surfacing: 'Tarmac or block paving, even surface',
    transferZone: '1.2m marked zone on both sides',
    additionalRequirements
  };
}

/**
 * Generate parking recommendations
 */
function generateRecommendations(
  requirements: ParkingRequirements,
  transportAccess: TransportAccessibility,
  permitZone: PermitZoneInfo,
  projectType: string
): ParkingRecommendations {
  const recommendations: string[] = [];
  const designGuidance: string[] = [];
  
  if (requirements.carFree) {
    recommendations.push('Pursue car-free development to maximize buildable area');
    recommendations.push('Include robust Travel Plan to support car-free approach');
    recommendations.push('Provide generous cycle storage exceeding minimum standards');
    recommendations.push('Consider car club membership for all units');
  } else {
    recommendations.push(`Provide ${requirements.total} parking spaces as minimum`);
    if (requirements.residential.disabledSpaces > 0) {
      recommendations.push(`Ensure ${requirements.residential.disabledSpaces} accessible spaces close to entrance`);
    }
    recommendations.push('Install EV charging to all spaces for future-proofing');
  }
  
  // Design guidance
  designGuidance.push('Parking should be concealed from street where possible');
  designGuidance.push('Soft landscaping between/around parking areas');
  designGuidance.push('Permeable surfacing for SuDS compliance');
  designGuidance.push('Avoid front garden parking in conservation areas');
  designGuidance.push('Consider underground/undercroft parking for larger schemes');
  
  // Planning statement content
  let planningStatement = `The proposed development is located within ${permitZone.zoneName} `;
  planningStatement += `with a PTAL rating of ${transportAccess.ptal} (${transportAccess.ptalRating}). `;
  
  if (requirements.carFree) {
    planningStatement += `Given the excellent public transport accessibility, a car-free approach is proposed `;
    planningStatement += `in accordance with Camden's transport policies. `;
  } else {
    planningStatement += `Parking provision of ${requirements.total} spaces is proposed, `;
    planningStatement += `in line with Camden's maximum parking standards. `;
  }
  
  planningStatement += `The scheme includes comprehensive cycle parking and EV charging infrastructure.`;
  
  return {
    strategy: requirements.carFree ? 'Car-free development' : 'Reduced parking provision',
    recommendations,
    designGuidance,
    planningStatement
  };
}

/**
 * Assess planning implications
 */
function assessPlanningImplications(
  existingSpaces: number,
  requirements: ParkingRequirements,
  transportAccess: TransportAccessibility,
  permitZone: PermitZoneInfo
): PlanningImplication[] {
  const implications: PlanningImplication[] = [];
  
  // Car-free implications
  if (requirements.carFree) {
    implications.push({
      issue: 'Car-free development',
      policy: 'Camden Transport Strategy / London Plan',
      requirement: 'Must demonstrate PTAL justification and include Travel Plan',
      impact: 'low'
    });
  }
  
  // Permit eligibility
  implications.push({
    issue: 'Parking permit eligibility',
    policy: 'Camden Parking Management Policy',
    requirement: permitZone.permitEligibility.newDevelopmentPolicy,
    impact: requirements.carFree ? 'low' : 'medium'
  });
  
  // Cycle parking
  implications.push({
    issue: 'Cycle parking provision',
    policy: 'London Plan Policy T5',
    requirement: 'Must meet minimum cycle parking standards',
    impact: 'low'
  });
  
  // EV charging
  implications.push({
    issue: 'Electric vehicle charging',
    policy: 'Building Regulations Part S',
    requirement: 'All new parking spaces require EV charging capability',
    impact: 'medium'
  });
  
  // Loss of existing parking
  if (existingSpaces > requirements.total) {
    implications.push({
      issue: 'Loss of parking spaces',
      policy: 'Camden Local Plan',
      requirement: 'May need justification for parking reduction',
      impact: 'medium'
    });
  }
  
  // Heritage area considerations
  implications.push({
    issue: 'Parking design in heritage context',
    policy: 'Conservation Area Management Plans',
    requirement: 'Parking must not detract from heritage character',
    impact: 'medium'
  });
  
  return implications;
}

/**
 * Get crossover/vehicle access assessment
 */
export async function getVehicleAccessAssessment(
  address: string,
  postcode: string,
  projectDetails?: {
    newCrossoverRequired?: boolean;
    existingCrossover?: boolean;
    crossoverWidth?: number;
    streetType?: string;
  }
): Promise<{
  crossoverRequired: boolean;
  approvalRequired: boolean;
  likelyApproval: boolean;
  requirements: string[];
  costs: { application: number; construction: number };
  timeframe: string;
}> {
  const newCrossover = projectDetails?.newCrossoverRequired || false;
  const existing = projectDetails?.existingCrossover || false;
  const width = projectDetails?.crossoverWidth || 3.0;
  
  const requirements = [
    'Minimum 4.8m from junction',
    'Minimum 10m from pedestrian crossing',
    'Not across utility covers/chambers',
    'Adequate visibility splays',
    'Dropped kerb specification to highway standards',
    'Reinstatement of redundant crossovers'
  ];
  
  // Assess likelihood based on factors
  let likelyApproval = true;
  if (width > 4.5) {
    likelyApproval = false;
    requirements.push('Maximum width typically 3.6m for single property');
  }
  
  const streetType = projectDetails?.streetType || 'residential';
  if (streetType === 'main-road' || streetType === 'classified') {
    likelyApproval = false;
    requirements.push('Crossovers rarely approved on classified roads');
  }
  
  return {
    crossoverRequired: newCrossover && !existing,
    approvalRequired: newCrossover,
    likelyApproval,
    requirements,
    costs: {
      application: 250,
      construction: 2500 // Typical for standard crossover
    },
    timeframe: '8-12 weeks for application and construction'
  };
}

/**
 * Calculate car club provision requirements
 */
export async function getCarClubRequirements(
  proposedUnits: number,
  isCarFree: boolean
): Promise<{
  membershipRequired: boolean;
  baysRequired: number;
  membership: CarClubMembership;
  providers: string[];
}> {
  // Camden policy typically requires car club for car-free developments
  const membershipRequired = isCarFree || proposedUnits > 10;
  
  // Bay calculation: typically 1 bay per 40-50 units
  const baysRequired = isCarFree && proposedUnits > 50 ? Math.ceil(proposedUnits / 50) : 0;
  
  return {
    membershipRequired,
    baysRequired,
    membership: {
      yearsProvision: 3,
      drivingCredit: 50, // £50 per household
      conditions: [
        'Free membership for 3 years per household',
        '£50 driving credit per household',
        'Must be written into S106 agreement',
        'Travel Plan coordinator to promote uptake'
      ]
    },
    providers: ['Zipcar', 'Enterprise Car Club', 'Co-wheels']
  };
}

interface CarClubMembership {
  yearsProvision: number;
  drivingCredit: number;
  conditions: string[];
}

export default {
  getParkingAssessment,
  getVehicleAccessAssessment,
  getCarClubRequirements
};
