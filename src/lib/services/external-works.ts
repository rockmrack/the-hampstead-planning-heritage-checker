/**
 * External Works Assessment Service
 * 
 * Comprehensive guidance for external works including hard landscaping,
 * boundary treatments, and external features for development projects
 * in Hampstead and surrounding conservation areas.
 * 
 * Coverage: NW1-NW11, N2, N6, N10 postcodes
 */

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

interface ExternalWorksProject {
  plotSize?: number;
  frontGarden?: boolean;
  rearGarden?: boolean;
  sideAccess?: boolean;
  existingDriveway?: boolean;
  proposedDriveway?: boolean;
  existingPaving?: number;
  proposedPaving?: number;
  boundaryLength?: number;
  existingBoundary?: string;
  proposedBoundary?: string;
  treeConstraints?: boolean;
  slopeGradient?: string;
  conservationArea?: boolean;
}

interface HardLandscaping {
  drivewayGuidance: DrivewayRequirements;
  pavingGuidance: PavingRequirements;
  pathwayGuidance: PathwayRequirements;
  patioGuidance: PatioRequirements;
  permittedDevelopment: PermittedDevStatus;
}

interface DrivewayRequirements {
  permeable: boolean;
  minimumWidth: number;
  maximumCoverage: string;
  materials: MaterialOption[];
  drainage: DrainageRequirement;
  crossoverRequired: boolean;
  crossoverProcess: string[];
}

interface PavingRequirements {
  maxCoverage: string;
  permeabilityRule: string;
  approvedMaterials: MaterialOption[];
  conservationMaterials: MaterialOption[];
  sustainableDrainage: string[];
}

interface PathwayRequirements {
  minimumWidth: number;
  maxGradient: string;
  surfaceOptions: MaterialOption[];
  accessibilityStandards: string[];
}

interface PatioRequirements {
  heightLimit: number;
  boundarySetback: number;
  materials: MaterialOption[];
  drainageConsiderations: string[];
}

interface MaterialOption {
  name: string;
  suitability: string;
  conservation: boolean;
  cost: string;
  maintenance: string;
  permeability: string;
}

interface DrainageRequirement {
  type: string;
  specification: string;
  approvals: string[];
}

interface PermittedDevStatus {
  applicable: boolean;
  conditions: string[];
  exceptions: string[];
}

interface BoundaryTreatments {
  frontBoundary: BoundaryOptions;
  sideBoundary: BoundaryOptions;
  rearBoundary: BoundaryOptions;
  gates: GateOptions;
  planningRequirements: string[];
}

interface BoundaryOptions {
  maxHeight: number;
  materials: BoundaryMaterial[];
  conservationGuidance: string[];
  planningRequired: boolean;
}

interface BoundaryMaterial {
  type: string;
  heightRange: string;
  suitability: string;
  conservation: boolean;
  cost: string;
  lifespan: string;
}

interface GateOptions {
  vehicleGate: GateSpec;
  pedestrianGate: GateSpec;
  automationGuidance: string[];
}

interface GateSpec {
  maxHeight: number;
  recommendedWidth: number;
  materials: string[];
  styles: string[];
}

interface ExternalFeatures {
  lighting: ExternalLighting;
  drainage: ExternalDrainage;
  levels: LevelChanges;
  utilities: ExternalUtilities;
}

interface ExternalLighting {
  permitted: boolean;
  types: LightingType[];
  planningConsiderations: string[];
  darkSkyGuidance: string[];
}

interface LightingType {
  type: string;
  application: string;
  specification: string;
  conservation: boolean;
}

interface ExternalDrainage {
  sustainableSystems: SuDSOption[];
  requirements: string[];
  approvals: string[];
}

interface SuDSOption {
  type: string;
  description: string;
  suitability: string;
  benefits: string[];
}

interface LevelChanges {
  permitted: boolean;
  maxRaise: number;
  maxLower: number;
  retainingWalls: RetainingWallGuidance;
  stepsGuidance: StepsGuidance;
}

interface RetainingWallGuidance {
  maxHeight: number;
  materials: string[];
  structuralRequirements: string;
}

interface StepsGuidance {
  riseLimit: number;
  goingMinimum: number;
  handrailRequired: boolean;
  materials: string[];
}

interface ExternalUtilities {
  meteringPositions: string[];
  serviceRoutes: string[];
  externalTaps: string[];
  evCharging: EVChargingGuidance;
}

interface EVChargingGuidance {
  requirement: string;
  specifications: string[];
  planningStatus: string;
}

interface ExternalWorksAssessment {
  summary: ExternalSummary;
  hardLandscaping: HardLandscaping;
  boundaryTreatments: BoundaryTreatments;
  externalFeatures: ExternalFeatures;
  conservationGuidance: ConservationExternal;
  costs: ExternalCosts;
  contacts: ExternalContact[];
  nextSteps: string[];
}

interface ExternalSummary {
  plotDescription: string;
  keyOpportunities: string[];
  keyConstraints: string[];
  planningRequirements: string[];
}

interface ConservationExternal {
  applicable: boolean;
  generalPrinciples: string[];
  frontGardenGuidance: string[];
  materialPalette: string[];
  featurestoRetain: string[];
  prohibitedFeatures: string[];
}

interface ExternalCosts {
  driveway: CostRange;
  paving: CostRange;
  boundaries: CostRange;
  lighting: CostRange;
  drainage: CostRange;
  crossover: CostRange;
}

interface CostRange {
  item: string;
  lowRange: string;
  midRange: string;
  highRange: string;
  notes: string;
}

interface ExternalContact {
  organization: string;
  service: string;
  phone?: string;
  email?: string;
  website?: string;
}

// =============================================================================
// CONSTANTS
// =============================================================================

const BOUNDARY_HEIGHT_LIMITS = {
  frontBoundary: 1.0, // meters - adjacent to highway
  sideBoundary: 2.0, // meters
  rearBoundary: 2.0, // meters
  conservationReduction: 0.2 // meters - often lower in conservation areas
};

const DRIVEWAY_STANDARDS = {
  minimumWidth: 2.4, // meters for single car
  doubleWidth: 4.8, // meters for two cars
  turningSpace: 6.0, // meters for turning
  pedestrianPath: 0.9 // meters minimum
};

const PERMITTED_DEVELOPMENT_THRESHOLDS = {
  maxPavingWithoutPermission: 5, // square meters for impermeable
  maxHeightChange: 0.3, // meters
  maxBoundaryHeight: 2.0 // meters (not adjacent to highway)
};

// =============================================================================
// MAIN SERVICE FUNCTION
// =============================================================================

async function assessExternalWorks(
  address: string,
  postcode: string,
  projectType: string,
  projectDetails: ExternalWorksProject = {}
): Promise<ExternalWorksAssessment> {
  const isConservation = projectDetails.conservationArea !== false;
  
  const summary = generateSummary(projectType, projectDetails, isConservation);
  const hardLandscaping = assessHardLandscaping(projectDetails, isConservation);
  const boundaryTreatments = assessBoundaryTreatments(projectDetails, isConservation);
  const externalFeatures = assessExternalFeatures(projectDetails, isConservation);
  const conservationGuidance = generateConservationGuidance(isConservation);
  const costs = estimateCosts(projectDetails);
  const contacts = getContacts();
  const nextSteps = generateNextSteps(projectType, projectDetails);

  return {
    summary,
    hardLandscaping,
    boundaryTreatments,
    externalFeatures,
    conservationGuidance,
    costs,
    contacts,
    nextSteps
  };
}

// =============================================================================
// SUMMARY GENERATION
// =============================================================================

function generateSummary(
  projectType: string,
  projectDetails: ExternalWorksProject,
  isConservation: boolean
): ExternalSummary {
  const keyOpportunities: string[] = [];
  const keyConstraints: string[] = [];
  const planningRequirements: string[] = [];

  if (projectDetails.frontGarden) {
    keyOpportunities.push('Front garden enhancement opportunity');
    if (isConservation) {
      keyConstraints.push('Conservation area restrictions on front garden changes');
    }
  }

  if (projectDetails.proposedDriveway && !projectDetails.existingDriveway) {
    keyOpportunities.push('New driveway potential (subject to crossover approval)');
    planningRequirements.push('Vehicle crossover application required');
  }

  if (projectDetails.treeConstraints) {
    keyConstraints.push('Tree Preservation Order(s) affecting external works');
  }

  if (isConservation) {
    planningRequirements.push('Planning permission likely for significant changes');
    keyConstraints.push('Traditional materials required');
  }

  return {
    plotDescription: `External works assessment for ${projectType} development`,
    keyOpportunities,
    keyConstraints,
    planningRequirements
  };
}

// =============================================================================
// HARD LANDSCAPING ASSESSMENT
// =============================================================================

function assessHardLandscaping(
  projectDetails: ExternalWorksProject,
  isConservation: boolean
): HardLandscaping {
  return {
    drivewayGuidance: getDrivewayGuidance(projectDetails, isConservation),
    pavingGuidance: getPavingGuidance(isConservation),
    pathwayGuidance: getPathwayGuidance(isConservation),
    patioGuidance: getPatioGuidance(isConservation),
    permittedDevelopment: getPermittedDevStatus(projectDetails)
  };
}

function getDrivewayGuidance(
  projectDetails: ExternalWorksProject,
  isConservation: boolean
): DrivewayRequirements {
  const materials: MaterialOption[] = [
    {
      name: 'Permeable block paving',
      suitability: 'Excellent - allows drainage between blocks',
      conservation: true,
      cost: '£60-120/m²',
      maintenance: 'Occasional weeding, periodic re-sanding',
      permeability: 'High'
    },
    {
      name: 'Gravel/shingle on permeable membrane',
      suitability: 'Good - fully permeable, traditional appearance',
      conservation: true,
      cost: '£30-60/m²',
      maintenance: 'Annual top-up, raking',
      permeability: 'Very high'
    },
    {
      name: 'Resin-bound gravel',
      suitability: 'Good - permeable and low maintenance',
      conservation: true,
      cost: '£80-140/m²',
      maintenance: 'Minimal - occasional pressure washing',
      permeability: 'High'
    },
    {
      name: 'Grass-crete/reinforced grass',
      suitability: 'Moderate - green appearance, vehicle weight limits',
      conservation: true,
      cost: '£50-90/m²',
      maintenance: 'Regular mowing required',
      permeability: 'Very high'
    },
    {
      name: 'Natural stone setts',
      suitability: 'Excellent in conservation areas',
      conservation: true,
      cost: '£100-200/m²',
      maintenance: 'Re-pointing occasionally',
      permeability: 'Medium (with open joints)'
    }
  ];

  if (!isConservation) {
    materials.push({
      name: 'Standard tarmac (with drainage)',
      suitability: 'Acceptable with permeable drainage to planted area',
      conservation: false,
      cost: '£40-70/m²',
      maintenance: 'Low - occasional sealing',
      permeability: 'None (requires drainage)'
    });
  }

  return {
    permeable: true,
    minimumWidth: DRIVEWAY_STANDARDS.minimumWidth,
    maximumCoverage: 'Maximum 50% of front garden area',
    materials,
    drainage: {
      type: 'Sustainable drainage required',
      specification: 'Rainwater must drain to permeable surface or planted area',
      approvals: ['Building Regulations', 'Potential Thames Water approval']
    },
    crossoverRequired: !projectDetails.existingDriveway,
    crossoverProcess: [
      'Apply to Camden Council Highways',
      'Pay application fee (approximately £1,500-£3,000)',
      'Council survey and approval',
      'Works carried out by Council-approved contractor',
      'Inspection and sign-off'
    ]
  };
}

function getPavingGuidance(isConservation: boolean): PavingRequirements {
  const standardMaterials: MaterialOption[] = [
    {
      name: 'Natural stone flags (York stone, slate)',
      suitability: 'Premium - traditional and durable',
      conservation: true,
      cost: '£80-200/m²',
      maintenance: 'Periodic cleaning, re-pointing',
      permeability: 'Low (requires drainage)'
    },
    {
      name: 'Concrete block paving',
      suitability: 'Good - versatile and cost-effective',
      conservation: false,
      cost: '£40-80/m²',
      maintenance: 'Occasional re-sanding, weed control',
      permeability: 'Medium (permeable versions available)'
    },
    {
      name: 'Porcelain paving',
      suitability: 'Modern - low maintenance',
      conservation: false,
      cost: '£60-120/m²',
      maintenance: 'Minimal - easy cleaning',
      permeability: 'None'
    }
  ];

  const conservationMaterials: MaterialOption[] = [
    {
      name: 'Reclaimed York stone',
      suitability: 'Ideal for conservation areas',
      conservation: true,
      cost: '£100-180/m²',
      maintenance: 'Traditional pointing, cleaning',
      permeability: 'Low'
    },
    {
      name: 'Heritage brick pavers',
      suitability: 'Traditional appearance',
      conservation: true,
      cost: '£70-120/m²',
      maintenance: 'Re-pointing, moss control',
      permeability: 'Medium with sand joints'
    },
    {
      name: 'Granite setts',
      suitability: 'Very durable, historic character',
      conservation: true,
      cost: '£90-160/m²',
      maintenance: 'Very low',
      permeability: 'Medium with open joints'
    }
  ];

  return {
    maxCoverage: '5m² impermeable without planning (PD)',
    permeabilityRule: 'Paving over 5m² must be permeable or drain to permeable area',
    approvedMaterials: standardMaterials,
    conservationMaterials,
    sustainableDrainage: [
      'Permeable paving systems',
      'Drainage to planted borders',
      'Soakaways (subject to ground conditions)',
      'Rain gardens',
      'Linear drainage channels to garden'
    ]
  };
}

function getPathwayGuidance(isConservation: boolean): PathwayRequirements {
  return {
    minimumWidth: 0.9,
    maxGradient: '1:20 preferred, 1:12 maximum with handrails',
    surfaceOptions: [
      {
        name: 'Natural stone',
        suitability: 'Premium traditional appearance',
        conservation: true,
        cost: '£80-150/m²',
        maintenance: 'Periodic cleaning',
        permeability: 'Low'
      },
      {
        name: 'Brick pavers',
        suitability: 'Traditional, good grip',
        conservation: true,
        cost: '£50-90/m²',
        maintenance: 'Re-pointing occasionally',
        permeability: 'Medium'
      },
      {
        name: 'Gravel with edging',
        suitability: 'Low cost, permeable',
        conservation: true,
        cost: '£20-40/m²',
        maintenance: 'Annual top-up',
        permeability: 'High'
      }
    ],
    accessibilityStandards: [
      'Even surface without trip hazards',
      'Non-slip finish',
      'Adequate width for wheelchair access (1.2m ideal)',
      'Handrails on slopes steeper than 1:20',
      'Contrasting edge marking for visually impaired'
    ]
  };
}

function getPatioGuidance(isConservation: boolean): PatioRequirements {
  return {
    heightLimit: 0.3, // meters above existing ground
    boundarySetback: 2.0, // meters from boundary if raised
    materials: [
      {
        name: 'Natural stone slabs',
        suitability: 'Premium finish',
        conservation: true,
        cost: '£80-200/m²',
        maintenance: 'Periodic sealing recommended',
        permeability: 'Low'
      },
      {
        name: 'Porcelain tiles',
        suitability: 'Modern, low maintenance',
        conservation: false,
        cost: '£60-120/m²',
        maintenance: 'Very low',
        permeability: 'None'
      },
      {
        name: 'Composite decking',
        suitability: 'Alternative to stone',
        conservation: false,
        cost: '£80-150/m²',
        maintenance: 'Annual cleaning',
        permeability: 'Gaps allow drainage'
      }
    ],
    drainageConsiderations: [
      'Fall away from building (minimum 1:80)',
      'ACO drain at building junction if required',
      'Soakaway or permeable border drainage',
      'No pooling areas'
    ]
  };
}

function getPermittedDevStatus(projectDetails: ExternalWorksProject): PermittedDevStatus {
  const conditions: string[] = [
    'Hard surface must be permeable or drain to permeable area if over 5m²',
    'No raising of ground level by more than 300mm',
    'Property must be a house (not flat or maisonette)'
  ];

  const exceptions: string[] = [
    'Conservation area - may require planning permission',
    'Listed building - Listed Building Consent required',
    'Article 4 Direction areas - check specific restrictions',
    'Front garden changes often require planning in conservation areas'
  ];

  return {
    applicable: !projectDetails.conservationArea,
    conditions,
    exceptions
  };
}

// =============================================================================
// BOUNDARY TREATMENTS
// =============================================================================

function assessBoundaryTreatments(
  projectDetails: ExternalWorksProject,
  isConservation: boolean
): BoundaryTreatments {
  const heightReduction = isConservation ? BOUNDARY_HEIGHT_LIMITS.conservationReduction : 0;

  return {
    frontBoundary: {
      maxHeight: BOUNDARY_HEIGHT_LIMITS.frontBoundary - heightReduction,
      materials: getFrontBoundaryMaterials(isConservation),
      conservationGuidance: [
        'Low wall with railings preferred',
        'Traditional brick or stone to match property',
        'Hedging appropriate for character',
        'Avoid close-board fencing at front'
      ],
      planningRequired: isConservation
    },
    sideBoundary: {
      maxHeight: BOUNDARY_HEIGHT_LIMITS.sideBoundary,
      materials: getSideBoundaryMaterials(isConservation),
      conservationGuidance: [
        'Match existing boundary treatment where possible',
        'Traditional materials in visible locations',
        'Modern fencing acceptable in rear portions'
      ],
      planningRequired: false
    },
    rearBoundary: {
      maxHeight: BOUNDARY_HEIGHT_LIMITS.rearBoundary,
      materials: getRearBoundaryMaterials(isConservation),
      conservationGuidance: [
        'Less restrictive than front/side',
        'Traditional materials still preferred',
        'Trellis extensions may be acceptable'
      ],
      planningRequired: false
    },
    gates: {
      vehicleGate: {
        maxHeight: 2.0,
        recommendedWidth: 3.0,
        materials: ['Timber', 'Metal (steel or aluminum)', 'Wrought iron'],
        styles: ['Traditional', 'Contemporary', 'Heritage']
      },
      pedestrianGate: {
        maxHeight: 2.0,
        recommendedWidth: 1.0,
        materials: ['Timber', 'Metal', 'Wrought iron'],
        styles: ['To match boundary treatment']
      },
      automationGuidance: [
        'Electrical supply required',
        'Safety features mandatory (pressure sensors, photocells)',
        'Manual override required',
        'Consider noise in residential areas'
      ]
    },
    planningRequirements: [
      'Gates over 1m (adjacent to highway) or 2m elsewhere need planning',
      'Conservation areas may have additional restrictions',
      'Listed buildings require LBC for any boundary changes'
    ]
  };
}

function getFrontBoundaryMaterials(isConservation: boolean): BoundaryMaterial[] {
  const materials: BoundaryMaterial[] = [
    {
      type: 'Low brick wall with railings',
      heightRange: '0.6-1.0m',
      suitability: 'Ideal for front boundaries',
      conservation: true,
      cost: '£200-400/linear meter',
      lifespan: '50+ years'
    },
    {
      type: 'Hedging (privet, box, yew)',
      heightRange: '0.5-1.2m',
      suitability: 'Traditional and soft appearance',
      conservation: true,
      cost: '£30-80/linear meter',
      lifespan: 'Ongoing with maintenance'
    },
    {
      type: 'Stone wall',
      heightRange: '0.6-1.0m',
      suitability: 'Premium traditional option',
      conservation: true,
      cost: '£300-600/linear meter',
      lifespan: '100+ years'
    }
  ];

  if (!isConservation) {
    materials.push({
      type: 'Metal railings only',
      heightRange: '0.8-1.2m',
      suitability: 'Contemporary option',
      conservation: false,
      cost: '£100-250/linear meter',
      lifespan: '30+ years'
    });
  }

  return materials;
}

function getSideBoundaryMaterials(isConservation: boolean): BoundaryMaterial[] {
  return [
    {
      type: 'Close-board timber fence',
      heightRange: '1.5-1.8m',
      suitability: 'Standard privacy option',
      conservation: false,
      cost: '£50-100/linear meter',
      lifespan: '15-20 years'
    },
    {
      type: 'Brick wall',
      heightRange: '1.5-2.0m',
      suitability: 'Durable, traditional',
      conservation: true,
      cost: '£200-400/linear meter',
      lifespan: '50+ years'
    },
    {
      type: 'Trellis fence',
      heightRange: '1.5-1.8m',
      suitability: 'Light and allows planting',
      conservation: true,
      cost: '£40-80/linear meter',
      lifespan: '10-15 years'
    }
  ];
}

function getRearBoundaryMaterials(isConservation: boolean): BoundaryMaterial[] {
  return [
    {
      type: 'Close-board timber fence',
      heightRange: '1.8m',
      suitability: 'Most common option',
      conservation: false,
      cost: '£50-100/linear meter',
      lifespan: '15-20 years'
    },
    {
      type: 'Horizontal slat fence',
      heightRange: '1.8m',
      suitability: 'Contemporary appearance',
      conservation: false,
      cost: '£80-150/linear meter',
      lifespan: '15-20 years'
    },
    {
      type: 'Living fence/hedge',
      heightRange: '1.5-2.5m',
      suitability: 'Natural, wildlife-friendly',
      conservation: true,
      cost: '£30-60/linear meter',
      lifespan: 'Ongoing'
    }
  ];
}

// =============================================================================
// EXTERNAL FEATURES
// =============================================================================

function assessExternalFeatures(
  projectDetails: ExternalWorksProject,
  isConservation: boolean
): ExternalFeatures {
  return {
    lighting: assessLighting(isConservation),
    drainage: assessDrainage(),
    levels: assessLevelChanges(projectDetails),
    utilities: assessExternalUtilities()
  };
}

function assessLighting(isConservation: boolean): ExternalLighting {
  return {
    permitted: true,
    types: [
      {
        type: 'Wall-mounted lanterns',
        application: 'Entrance, pathways',
        specification: 'Max 60W or LED equivalent, downward facing',
        conservation: true
      },
      {
        type: 'Bollard lights',
        application: 'Driveways, paths',
        specification: 'Low level, shielded',
        conservation: true
      },
      {
        type: 'Ground recessed spots',
        application: 'Feature lighting',
        specification: 'Low glare, targeted',
        conservation: false
      },
      {
        type: 'PIR security lights',
        application: 'Security',
        specification: 'Must not cause nuisance to neighbors',
        conservation: true
      }
    ],
    planningConsiderations: [
      'Should not cause light pollution',
      'Must not affect highway safety',
      'Conservation areas - traditional styles preferred'
    ],
    darkSkyGuidance: [
      'Use warm white LEDs (2700-3000K)',
      'Full cut-off fixtures to prevent upward light',
      'Use timers and motion sensors',
      'Minimum necessary illumination levels'
    ]
  };
}

function assessDrainage(): ExternalDrainage {
  return {
    sustainableSystems: [
      {
        type: 'Permeable paving',
        description: 'Water drains through surface and sub-base',
        suitability: 'Driveways, patios, paths',
        benefits: ['Reduces runoff', 'Groundwater recharge', 'Reduces flooding risk']
      },
      {
        type: 'Rain gardens',
        description: 'Planted depression collecting runoff',
        suitability: 'Gardens, verges',
        benefits: ['Biodiversity', 'Water filtration', 'Visual amenity']
      },
      {
        type: 'Soakaways',
        description: 'Underground infiltration chambers',
        suitability: 'Where ground conditions permit',
        benefits: ['Hidden system', 'Effective drainage', 'Low maintenance']
      },
      {
        type: 'Water butts',
        description: 'Rainwater harvesting from roofs',
        suitability: 'All properties',
        benefits: ['Water conservation', 'Garden irrigation', 'Reduces runoff']
      }
    ],
    requirements: [
      'Surface water must not discharge to public sewer (new connections)',
      'SuDS required for new driveways over 5m²',
      'Thames Water approval for any sewer connections'
    ],
    approvals: [
      'Building Regulations approval for drainage',
      'Thames Water connection approval',
      'Potentially Lead Local Flood Authority approval'
    ]
  };
}

function assessLevelChanges(projectDetails: ExternalWorksProject): LevelChanges {
  return {
    permitted: true,
    maxRaise: 0.3, // 300mm without planning
    maxLower: 0.3, // 300mm without planning
    retainingWalls: {
      maxHeight: 1.0, // meters without structural calculation
      materials: ['Brick', 'Stone', 'Concrete (rendered)', 'Gabion baskets'],
      structuralRequirements: 'Walls over 1m height require structural engineer design'
    },
    stepsGuidance: {
      riseLimit: 0.17, // 170mm maximum
      goingMinimum: 0.25, // 250mm minimum
      handrailRequired: true, // if more than 2 steps
      materials: ['Stone', 'Brick', 'Concrete with non-slip finish']
    }
  };
}

function assessExternalUtilities(): ExternalUtilities {
  return {
    meteringPositions: [
      'Gas and electricity meters should be accessible',
      'Consider meter box locations in boundary walls',
      'Smart meters reduce need for access'
    ],
    serviceRoutes: [
      'Maintain access to inspection chambers',
      'Do not build over services without approval',
      'Keep service routes clear of planting'
    ],
    externalTaps: [
      'Consider garden tap position',
      'Frost protection required',
      'Non-return valve mandatory'
    ],
    evCharging: {
      requirement: 'Required for new dwellings with parking (Building Regs Part S)',
      specifications: [
        'Minimum 7kW charge point',
        'Weatherproof installation',
        'Smart charging capability recommended'
      ],
      planningStatus: 'Permitted development for charging points on residential properties'
    }
  };
}

// =============================================================================
// CONSERVATION GUIDANCE
// =============================================================================

function generateConservationGuidance(isConservation: boolean): ConservationExternal {
  if (!isConservation) {
    return {
      applicable: false,
      generalPrinciples: [],
      frontGardenGuidance: [],
      materialPalette: [],
      featurestoRetain: [],
      prohibitedFeatures: []
    };
  }

  return {
    applicable: true,
    generalPrinciples: [
      'Preserve and enhance the character of the conservation area',
      'Use traditional materials and detailing',
      'Respect the pattern of front gardens in the street',
      'Maintain soft landscaping and mature planting',
      'Avoid suburbanization of historic streets'
    ],
    frontGardenGuidance: [
      'Retain existing front garden layout where possible',
      'Maintain ratio of soft to hard landscaping',
      'Low boundary walls with railings preferred',
      'Traditional gate designs and materials',
      'Avoid excessive hard surfacing'
    ],
    materialPalette: [
      'York stone or equivalent natural stone',
      'Stock brick to match property',
      'Gravel with appropriate edging',
      'Traditional ironwork (railings, gates)',
      'Native hedging species'
    ],
    featurestoRetain: [
      'Original boundary walls and railings',
      'Historic paving and kerbs',
      'Mature trees and significant planting',
      'Original gate posts and features',
      'Coal hole covers and historic ironwork'
    ],
    prohibitedFeatures: [
      'Concrete block paving in traditional materials palette',
      'Close-board fencing at front boundary',
      'Excessive tarmac or impermeable surfacing',
      'Modern metal gates in heritage settings',
      'Artificial grass (strongly discouraged)'
    ]
  };
}

// =============================================================================
// COST ESTIMATES
// =============================================================================

function estimateCosts(projectDetails: ExternalWorksProject): ExternalCosts {
  return {
    driveway: {
      item: 'Driveway construction',
      lowRange: '£3,000-5,000',
      midRange: '£5,000-10,000',
      highRange: '£10,000-20,000+',
      notes: 'Permeable block paving, size dependent'
    },
    paving: {
      item: 'Patio/paving',
      lowRange: '£2,000-4,000',
      midRange: '£4,000-8,000',
      highRange: '£8,000-15,000+',
      notes: 'Natural stone at premium'
    },
    boundaries: {
      item: 'Boundary treatment',
      lowRange: '£50-100/m (fence)',
      midRange: '£150-300/m (wall)',
      highRange: '£300-500/m (premium)',
      notes: 'Includes gates proportionally'
    },
    lighting: {
      item: 'External lighting scheme',
      lowRange: '£500-1,500',
      midRange: '£1,500-3,000',
      highRange: '£3,000-6,000+',
      notes: 'Including electrical supply'
    },
    drainage: {
      item: 'Drainage/SuDS',
      lowRange: '£500-1,500',
      midRange: '£1,500-3,000',
      highRange: '£3,000-6,000+',
      notes: 'Soakaway and permeable systems'
    },
    crossover: {
      item: 'Vehicle crossover',
      lowRange: '£1,500-2,500',
      midRange: '£2,500-4,000',
      highRange: '£4,000-6,000+',
      notes: 'Camden Council fees and works'
    }
  };
}

// =============================================================================
// CONTACTS
// =============================================================================

function getContacts(): ExternalContact[] {
  return [
    {
      organization: 'Camden Council Highways',
      service: 'Vehicle crossover applications',
      phone: '020 7974 4444',
      email: 'highways@camden.gov.uk',
      website: 'https://www.camden.gov.uk/crossovers'
    },
    {
      organization: 'Camden Planning',
      service: 'Planning applications for external works',
      phone: '020 7974 4444',
      email: 'planning@camden.gov.uk',
      website: 'https://www.camden.gov.uk/planning'
    },
    {
      organization: 'Thames Water',
      service: 'Drainage connections and SuDS approval',
      phone: '0800 316 9800',
      website: 'https://www.thameswater.co.uk'
    }
  ];
}

// =============================================================================
// NEXT STEPS
// =============================================================================

function generateNextSteps(
  projectType: string,
  projectDetails: ExternalWorksProject
): string[] {
  const steps: string[] = [];

  steps.push('Survey existing external areas and features');
  steps.push('Review conservation area guidance (if applicable)');
  steps.push('Design hard and soft landscaping scheme');
  steps.push('Check permitted development rights');

  if (projectDetails.proposedDriveway && !projectDetails.existingDriveway) {
    steps.push('Apply for vehicle crossover with Camden Highways');
  }

  steps.push('Prepare drainage strategy');
  steps.push('Obtain quotes from approved contractors');
  steps.push('Submit planning application if required');

  return steps;
}

// =============================================================================
// EXPORTS
// =============================================================================

const externalWorks = {
  assessExternalWorks,
  BOUNDARY_HEIGHT_LIMITS,
  DRIVEWAY_STANDARDS,
  PERMITTED_DEVELOPMENT_THRESHOLDS
};

export default externalWorks;
