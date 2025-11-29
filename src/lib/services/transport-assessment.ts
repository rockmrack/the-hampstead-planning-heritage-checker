/**
 * Transport Assessment Service
 * 
 * Provides transport and parking assessment guidance for development
 * projects in the Hampstead area.
 */

interface TransportProject {
  dwellingUnits?: number;
  floorspace?: number;
  parkingSpaces?: number;
  cycleSpaces?: number;
  existingUse?: string;
  proposedUse?: string;
  siteAccess?: string;
  publicTransport?: boolean;
  deliveryRequirements?: boolean;
}

interface PTALAssessment {
  level: number;
  description: string;
  implications: string[];
  parkingGuidance: string;
}

interface ParkingStandards {
  residential: {
    maxSpaces: string;
    cycleSpaces: string;
    notes: string[];
  };
  commercial: {
    maxSpaces: string;
    cycleSpaces: string;
    notes: string[];
  };
  evCharging: string;
}

interface TransportAssessment {
  address: string;
  postcode: string;
  projectType: string;
  ptalAssessment: PTALAssessment;
  parkingStandards: ParkingStandards;
  assessmentRequired: {
    type: string;
    threshold: string;
    required: boolean;
    scope: string[];
  };
  travelPlan: {
    required: boolean;
    type: string;
    measures: string[];
  };
  accessRequirements: {
    vehicular: string[];
    pedestrian: string[];
    cycle: string[];
  };
  deliveryServicing: {
    required: boolean;
    considerations: string[];
  };
  constructionManagement: {
    required: boolean;
    elements: string[];
  };
  planningConditions: string[];
  localFactors: string[];
  timeline: {
    phase: string;
    duration: string;
    activities: string[];
  }[];
  costs: {
    item: string;
    range: string;
    notes: string;
  }[];
  recommendations: string[];
}

// PTAL levels by area
const AREA_PTAL: Record<string, {
  level: number;
  description: string;
  stations: string[];
  busRoutes: string;
}> = {
  'NW3': {
    level: 4,
    description: 'Good',
    stations: ['Hampstead (Northern)', 'Belsize Park (Northern)', 'Hampstead Heath (Overground)'],
    busRoutes: '168, 268, 603, C11'
  },
  'NW6': {
    level: 6,
    description: 'Excellent',
    stations: ['West Hampstead (Jubilee, Overground, Thameslink)', 'Kilburn (Jubilee)', 'Brondesbury (Overground)'],
    busRoutes: '16, 32, 189, 316, 328, C11'
  },
  'NW8': {
    level: 5,
    description: 'Very Good',
    stations: ['St Johns Wood (Jubilee)', 'Maida Vale (Bakerloo)'],
    busRoutes: '13, 46, 82, 113, 139, 189, 274'
  },
  'NW11': {
    level: 3,
    description: 'Moderate',
    stations: ['Golders Green (Northern)', 'Brent Cross (Northern)'],
    busRoutes: '102, 210, 226, 240, 245, 260, H2'
  }
};

// Camden parking standards
const CAMDEN_PARKING: Record<string, {
  residential: string;
  office: string;
  retail: string;
  notes: string;
}> = {
  'car-free': {
    residential: '0 spaces (permit-free)',
    office: '0 spaces',
    retail: '0 spaces',
    notes: 'CPZ areas with good PTAL typically car-free'
  },
  'low-car': {
    residential: 'Up to 0.25 spaces per unit',
    office: '1 space per 1000-1500m²',
    retail: '1 space per 200m²',
    notes: 'PTAL 4-6 areas'
  },
  'standard': {
    residential: 'Up to 0.5 spaces per unit',
    office: '1 space per 600-1000m²',
    retail: '1 space per 100m²',
    notes: 'Lower PTAL areas'
  }
};

// Assessment thresholds
const ASSESSMENT_THRESHOLDS = {
  transportAssessment: {
    residential: 50, // units
    office: 2500, // m²
    retail: 800 // m²
  },
  transportStatement: {
    residential: 10, // units
    office: 500, // m²
    retail: 250 // m²
  },
  travelPlan: {
    residential: 50, // units
    office: 2500, // m²
    retail: 1000 // m²
  }
};

function extractOutcode(postcode: string): string {
  const cleaned = postcode.toUpperCase().replace(/\s+/g, '');
  const match = cleaned.match(/^([A-Z]{1,2}\d{1,2})/);
  return match && match[1] ? match[1] : 'NW3';
}

function getPTALAssessment(postcode: string): PTALAssessment {
  const outcode = extractOutcode(postcode);
  const defaultAreaPTAL = AREA_PTAL['NW3']!;
  const areaPTAL = AREA_PTAL[outcode] || defaultAreaPTAL;
  
  const implications: string[] = [];
  let parkingGuidance: string;

  if (areaPTAL.level >= 5) {
    implications.push('High public transport accessibility supports car-free development');
    implications.push('Residents unlikely to need private car for most journeys');
    implications.push('Strong justification needed for any car parking');
    parkingGuidance = 'Car-free development expected. Permit-free obligation likely.';
  } else if (areaPTAL.level >= 3) {
    implications.push('Good public transport reduces car dependency');
    implications.push('Low parking provision supported by policy');
    implications.push('Car club membership should be considered');
    parkingGuidance = 'Low parking provision (0.25-0.5 spaces/unit maximum)';
  } else {
    implications.push('Lower public transport accessibility');
    implications.push('Some parking may be justified');
    implications.push('Sustainable transport improvements may be required');
    parkingGuidance = 'Standard parking provision may be acceptable';
  }

  implications.push(`Nearest stations: ${areaPTAL.stations.join(', ')}`);
  implications.push(`Bus routes: ${areaPTAL.busRoutes}`);

  return {
    level: areaPTAL.level,
    description: areaPTAL.description,
    implications,
    parkingGuidance
  };
}

function getParkingStandards(ptalLevel: number): ParkingStandards {
  let parkingType: string;
  if (ptalLevel >= 5) {
    parkingType = 'car-free';
  } else if (ptalLevel >= 3) {
    parkingType = 'low-car';
  } else {
    parkingType = 'standard';
  }

  const defaultParking = CAMDEN_PARKING['low-car']!;
  const standards = CAMDEN_PARKING[parkingType] || defaultParking;

  return {
    residential: {
      maxSpaces: standards.residential,
      cycleSpaces: '1 long-stay per bedroom + 1 short-stay per 40 units',
      notes: [
        'Blue Badge parking always permitted',
        'Wheelchair accessible parking required for 10% of spaces',
        'Electric vehicle charging for all spaces'
      ]
    },
    commercial: {
      maxSpaces: standards.office,
      cycleSpaces: '1 per 150m² (long-stay) + 1 per 500m² (short-stay)',
      notes: [
        'Shower and locker facilities required',
        'Secure covered cycle parking',
        'Car club spaces may substitute for parking'
      ]
    },
    evCharging: 'All parking spaces must have active EV charging provision'
  };
}

function getAssessmentRequirements(
  projectType: string,
  projectDetails: TransportProject
): {
  type: string;
  threshold: string;
  required: boolean;
  scope: string[];
} {
  const units = projectDetails.dwellingUnits || 0;
  const floorspace = projectDetails.floorspace || 0;

  // Check Transport Assessment threshold
  if (units >= ASSESSMENT_THRESHOLDS.transportAssessment.residential ||
      floorspace >= ASSESSMENT_THRESHOLDS.transportAssessment.office) {
    return {
      type: 'Transport Assessment (TA)',
      threshold: `${ASSESSMENT_THRESHOLDS.transportAssessment.residential}+ units or ${ASSESSMENT_THRESHOLDS.transportAssessment.office}m²+`,
      required: true,
      scope: [
        'Baseline traffic surveys',
        'Trip generation analysis',
        'Junction capacity assessment',
        'Parking accumulation',
        'Servicing and delivery strategy',
        'Public transport impact',
        'Road safety audit',
        'Mitigation measures'
      ]
    };
  }

  // Check Transport Statement threshold
  if (units >= ASSESSMENT_THRESHOLDS.transportStatement.residential ||
      floorspace >= ASSESSMENT_THRESHOLDS.transportStatement.office) {
    return {
      type: 'Transport Statement',
      threshold: `${ASSESSMENT_THRESHOLDS.transportStatement.residential}+ units or ${ASSESSMENT_THRESHOLDS.transportStatement.office}m²+`,
      required: true,
      scope: [
        'Site accessibility assessment',
        'Trip generation estimates',
        'Parking and cycle provision justification',
        'Servicing arrangements',
        'Sustainable transport measures'
      ]
    };
  }

  return {
    type: 'Not Required',
    threshold: 'Below thresholds',
    required: false,
    scope: ['Planning statement transport section sufficient']
  };
}

function getTravelPlanRequirements(
  projectDetails: TransportProject
): {
  required: boolean;
  type: string;
  measures: string[];
} {
  const units = projectDetails.dwellingUnits || 0;
  const floorspace = projectDetails.floorspace || 0;

  const required = units >= ASSESSMENT_THRESHOLDS.travelPlan.residential ||
                   floorspace >= ASSESSMENT_THRESHOLDS.travelPlan.office;

  return {
    required,
    type: required ? 'Full Travel Plan' : 'Travel Plan Statement',
    measures: [
      'Welcome pack with travel information',
      'Cycle parking and facilities',
      'Car club membership (2+ years)',
      'Electric vehicle charging',
      'Travel Plan Coordinator appointment',
      'Monitoring and targets',
      'Annual surveys',
      'TfL TRICS database registration'
    ]
  };
}

function getAccessRequirements(
  projectType: string,
  projectDetails: TransportProject
): {
  vehicular: string[];
  pedestrian: string[];
  cycle: string[];
} {
  const vehicular: string[] = [];
  const pedestrian: string[] = [];
  const cycle: string[] = [];

  // Vehicular
  if (projectDetails.parkingSpaces && projectDetails.parkingSpaces > 0) {
    vehicular.push('Minimum 3.0m access width for single vehicle');
    vehicular.push('5.0m width for two-way traffic');
    vehicular.push('Appropriate visibility splays');
    vehicular.push('Swept path analysis for servicing');
  }
  vehicular.push('Emergency vehicle access maintained');

  // Pedestrian
  pedestrian.push('Level or ramped access from street');
  pedestrian.push('Minimum 1.5m footway maintained');
  pedestrian.push('Dropped kerbs at crossing points');
  pedestrian.push('Adequate street lighting');
  pedestrian.push('Clear sightlines at entrance');

  // Cycle
  cycle.push('Secure covered cycle parking');
  cycle.push('Easy access from street (no steps)');
  cycle.push('Stands to Sheffield/M-stand standard');
  cycle.push('Minimum 2.0m clear space for access');
  if (projectDetails.dwellingUnits && projectDetails.dwellingUnits > 10) {
    cycle.push('Individual lockers for long-stay');
  }

  return { vehicular, pedestrian, cycle };
}

function getDeliveryServicing(projectType: string, projectDetails: TransportProject): {
  required: boolean;
  considerations: string[];
} {
  const considerations: string[] = [];
  const required = Boolean(
    projectType === 'commercial' || 
    projectType === 'mixed-use' ||
    (projectDetails.dwellingUnits && projectDetails.dwellingUnits > 20)
  );

  if (required) {
    considerations.push('Off-street loading bay where possible');
    considerations.push('Consolidation of deliveries');
    considerations.push('Timing restrictions for HGVs');
    considerations.push('Swept path analysis for delivery vehicles');
  }

  considerations.push('Refuse collection arrangements');
  considerations.push('Removal van access for residential');

  if (projectType === 'commercial') {
    considerations.push('Delivery and Servicing Plan required');
    considerations.push('Out of hours delivery consideration');
  }

  return { required, considerations };
}

function getConstructionManagement(projectType: string, projectDetails: TransportProject): {
  required: boolean;
  elements: string[];
} {
  const siteArea = projectDetails.floorspace || 0;
  const required = siteArea > 200 || projectType === 'new-build' || projectType.includes('basement');

  return {
    required,
    elements: [
      'Vehicle routing strategy',
      'Site access arrangements',
      'Parking for operatives',
      'Material delivery scheduling',
      'Wheel washing facilities',
      'Traffic marshal provision',
      'Working hours restrictions',
      'Neighbor notification procedure',
      'Banksman for HGV movements'
    ]
  };
}

function getLocalFactors(postcode: string): string[] {
  const outcode = extractOutcode(postcode);
  const factors: string[] = [];

  factors.push('Camden operates Controlled Parking Zones (CPZ) throughout');
  factors.push('New developments typically permit-free (no residents parking permits)');
  factors.push('TfL consultation for developments near TLRN');

  if (outcode === 'NW3') {
    factors.push('Hampstead Village has narrow historic streets - access constraints');
    factors.push('Limited parking - CPZ operates most of the week');
    factors.push('Strong local opposition to increased traffic');
  }

  if (outcode === 'NW6') {
    factors.push('Good rail/tube connectivity supports car-free living');
    factors.push('Bus corridors - consider impact on services');
  }

  factors.push('Section 106 may require highways improvements');
  factors.push('CIL contributions to strategic transport');

  return factors;
}

async function assessTransportRequirements(
  address: string,
  postcode: string,
  projectType: string,
  projectDetails: TransportProject = {}
): Promise<TransportAssessment> {
  // PTAL assessment
  const ptalAssessment = getPTALAssessment(postcode);

  // Parking standards
  const parkingStandards = getParkingStandards(ptalAssessment.level);

  // Assessment requirements
  const assessmentRequired = getAssessmentRequirements(projectType, projectDetails);

  // Travel plan
  const travelPlan = getTravelPlanRequirements(projectDetails);

  // Access requirements
  const accessRequirements = getAccessRequirements(projectType, projectDetails);

  // Delivery servicing
  const deliveryServicing = getDeliveryServicing(projectType, projectDetails);

  // Construction management
  const constructionManagement = getConstructionManagement(projectType, projectDetails);

  // Planning conditions
  const planningConditions: string[] = [];
  planningConditions.push('Permit-free development obligation');
  planningConditions.push('Cycle parking to be provided before occupation');
  if (travelPlan.required) {
    planningConditions.push('Travel Plan to be submitted and approved');
  }
  if (constructionManagement.required) {
    planningConditions.push('Construction Management Plan required');
  }
  if (projectDetails.parkingSpaces && projectDetails.parkingSpaces > 0) {
    planningConditions.push('EV charging provision for all spaces');
  }

  // Timeline
  const timeline = [
    {
      phase: 'Assessment',
      duration: '2-4 weeks',
      activities: ['PTAL calculation', 'Accessibility review', 'Policy analysis']
    }
  ];
  
  if (assessmentRequired.required) {
    timeline.push({
      phase: 'Surveys',
      duration: '2-4 weeks',
      activities: ['Traffic counts', 'Parking surveys', 'Public transport assessment']
    });
    timeline.push({
      phase: 'Analysis',
      duration: '2-4 weeks',
      activities: ['Trip generation', 'Impact assessment', 'Mitigation design']
    });
  }

  timeline.push({
    phase: 'Consultation',
    duration: '2-4 weeks',
    activities: ['Camden Highways', 'TfL if applicable', 'Local consultation']
  });

  // Costs
  const costs = [
    {
      item: 'Transport Assessment/Statement',
      range: assessmentRequired.required ? '£2,000-8,000' : '£0-500',
      notes: assessmentRequired.type
    },
    {
      item: 'Travel Plan',
      range: travelPlan.required ? '£1,000-3,000' : '£0',
      notes: travelPlan.type
    },
    {
      item: 'Traffic Surveys',
      range: '£500-2,000',
      notes: 'If required for TA'
    },
    {
      item: 'Highways Agreement',
      range: '£500-5,000',
      notes: 'Section 278/38 works if required'
    }
  ];

  // Recommendations
  const recommendations: string[] = [];
  
  recommendations.push('Design for car-free from outset where PTAL supports');
  recommendations.push('Maximize cycle parking and facilities');
  recommendations.push('Consider car club membership for residents');
  
  if (ptalAssessment.level <= 3) {
    recommendations.push('Explore sustainable transport improvements to mitigate parking');
  }

  return {
    address,
    postcode,
    projectType,
    ptalAssessment,
    parkingStandards,
    assessmentRequired,
    travelPlan,
    accessRequirements,
    deliveryServicing,
    constructionManagement,
    planningConditions,
    localFactors: getLocalFactors(postcode),
    timeline,
    costs,
    recommendations
  };
}

// Export the service
const transportAssessment = {
  assessTransportRequirements,
  AREA_PTAL,
  CAMDEN_PARKING,
  ASSESSMENT_THRESHOLDS
};

export default transportAssessment;
