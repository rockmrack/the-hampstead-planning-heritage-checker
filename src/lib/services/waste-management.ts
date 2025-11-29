/**
 * Waste Management Assessment Service
 * 
 * Comprehensive guidance for waste management and refuse storage requirements
 * for development projects in Hampstead and surrounding conservation areas.
 * 
 * Coverage: NW1-NW11, N2, N6, N10 postcodes
 */

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

interface WasteProject {
  dwellingUnits?: number;
  commercialUnits?: number;
  floorArea?: number;
  buildingType?: 'house' | 'flat' | 'mixed' | 'commercial' | 'hmo';
  hasGarden?: boolean;
  hasBasement?: boolean;
  existingBinStorage?: boolean;
  accessForCollection?: boolean;
  streetFrontage?: boolean;
  communalAreas?: boolean;
}

interface BinRequirement {
  type: string;
  color: string;
  size: string;
  quantity: number;
  collectionFrequency: string;
  purpose: string;
}

interface StorageDesign {
  locationType: string;
  minimumArea: number;
  accessRequirements: string[];
  screeningRequired: boolean;
  ventilationRequired: boolean;
  drainageRequired: boolean;
  lightingRequired: boolean;
  designConsiderations: string[];
}

interface CollectionAccess {
  maxCarryDistance: number;
  gradientRequirements: string;
  surfaceRequirements: string;
  clearanceWidth: number;
  turningSpace: string;
  vehicleAccess: string;
}

interface RecyclingRequirements {
  materials: RecyclingStream[];
  separationMethod: string;
  educationRequired: boolean;
  targetRate: string;
}

interface RecyclingStream {
  material: string;
  container: string;
  collectionDay: string;
  preparation: string[];
}

interface WasteAssessment {
  summary: WasteSummary;
  binRequirements: BinRequirement[];
  storageDesign: StorageDesign;
  collectionAccess: CollectionAccess;
  recyclingRequirements: RecyclingRequirements;
  constructionWaste: ConstructionWaste;
  conservationConsiderations: ConservationWaste;
  planningRequirements: PlanningWaste;
  costs: WasteCosts;
  contacts: WasteContact[];
  nextSteps: string[];
}

interface WasteSummary {
  projectType: string;
  totalBins: number;
  storageAreaRequired: number;
  keyRequirements: string[];
  complianceStatus: string;
}

interface ConstructionWaste {
  applicable: boolean;
  swmpRequired: boolean;
  estimatedVolume: string;
  wasteTypes: string[];
  disposalMethods: string[];
  recyclingTarget: string;
  documentation: string[];
}

interface ConservationWaste {
  applicable: boolean;
  screeningRequired: boolean;
  materialRestrictions: string[];
  designGuidance: string[];
  heritageConsiderations: string[];
}

interface PlanningWaste {
  conditionsLikely: string[];
  documentsRequired: string[];
  complianceChecklist: string[];
}

interface WasteCosts {
  binProvision: CostItem;
  storageConstruction: CostItem;
  collectionCharges: CostItem;
  bulkyWaste: CostItem;
}

interface CostItem {
  item: string;
  cost: string;
  frequency: string;
  notes: string;
}

interface WasteContact {
  organization: string;
  service: string;
  phone?: string;
  email?: string;
  website?: string;
}

// =============================================================================
// CONSTANTS
// =============================================================================

const CAMDEN_BIN_SPECIFICATIONS = {
  general: {
    type: 'General Waste',
    color: 'Black',
    sizes: ['140L wheelie bin', '240L wheelie bin', '1100L euro bin'],
    collectionFrequency: 'Weekly'
  },
  recycling: {
    type: 'Mixed Recycling',
    color: 'Blue',
    sizes: ['140L wheelie bin', '240L wheelie bin', '1100L euro bin'],
    collectionFrequency: 'Weekly'
  },
  food: {
    type: 'Food Waste',
    color: 'Brown/Green',
    sizes: ['23L caddy', '140L wheelie bin'],
    collectionFrequency: 'Weekly'
  },
  garden: {
    type: 'Garden Waste',
    color: 'Brown',
    sizes: ['240L wheelie bin'],
    collectionFrequency: 'Fortnightly (subscription)'
  },
  glass: {
    type: 'Glass',
    color: 'Green box',
    sizes: ['55L box'],
    collectionFrequency: 'Fortnightly'
  }
};

const STORAGE_STANDARDS = {
  house: {
    minAreaPerUnit: 1.5, // m²
    binAccessPath: 1.2, // meters
    maxDistanceToCollection: 15 // meters
  },
  flat: {
    minAreaPerUnit: 0.8, // m²
    communalStorageMin: 4, // m²
    maxDistanceToCollection: 10 // meters
  },
  commercial: {
    minAreaPer100sqm: 2, // m²
    maxDistanceToCollection: 20 // meters
  }
};

// =============================================================================
// MAIN SERVICE FUNCTION
// =============================================================================

async function assessWasteManagement(
  address: string,
  postcode: string,
  projectType: string,
  projectDetails: WasteProject = {}
): Promise<WasteAssessment> {
  const summary = generateSummary(projectType, projectDetails);
  const binRequirements = calculateBinRequirements(projectType, projectDetails);
  const storageDesign = determineStorageDesign(projectType, projectDetails);
  const collectionAccess = assessCollectionAccess(projectDetails);
  const recyclingRequirements = determineRecyclingRequirements(projectType);
  const constructionWaste = assessConstructionWaste(projectType, projectDetails);
  const conservationConsiderations = assessConservationWaste(projectDetails);
  const planningRequirements = determinePlanningRequirements(projectType, projectDetails);
  const costs = estimateCosts(projectType, projectDetails);
  const contacts = getContacts();
  const nextSteps = generateNextSteps(projectType);

  return {
    summary,
    binRequirements,
    storageDesign,
    collectionAccess,
    recyclingRequirements,
    constructionWaste,
    conservationConsiderations,
    planningRequirements,
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
  projectDetails: WasteProject
): WasteSummary {
  const units = projectDetails.dwellingUnits || 1;
  const buildingType = projectDetails.buildingType || 'house';
  
  let storageArea = 0;
  let totalBins = 0;

  if (buildingType === 'house') {
    storageArea = units * STORAGE_STANDARDS.house.minAreaPerUnit;
    totalBins = units * 4; // General, recycling, food, garden
  } else if (buildingType === 'flat' || buildingType === 'mixed') {
    storageArea = Math.max(STORAGE_STANDARDS.flat.communalStorageMin, units * STORAGE_STANDARDS.flat.minAreaPerUnit);
    totalBins = Math.ceil(units / 6) * 4; // Shared bins
  } else if (buildingType === 'commercial') {
    const floorArea = projectDetails.floorArea || 100;
    storageArea = (floorArea / 100) * STORAGE_STANDARDS.commercial.minAreaPer100sqm;
    totalBins = Math.ceil(floorArea / 200) * 2;
  }

  const keyRequirements: string[] = [
    'Adequate bin storage provision',
    'Collection vehicle access',
    'Screened storage area (if visible from public realm)'
  ];

  if (units > 6) {
    keyRequirements.push('Communal bin store with management arrangements');
  }

  if (buildingType === 'flat') {
    keyRequirements.push('Internal waste chute or accessible communal store');
  }

  return {
    projectType,
    totalBins,
    storageAreaRequired: Math.round(storageArea * 10) / 10,
    keyRequirements,
    complianceStatus: 'Assessment required - submit waste management plan'
  };
}

// =============================================================================
// BIN REQUIREMENTS
// =============================================================================

function calculateBinRequirements(
  projectType: string,
  projectDetails: WasteProject
): BinRequirement[] {
  const requirements: BinRequirement[] = [];
  const units = projectDetails.dwellingUnits || 1;
  const buildingType = projectDetails.buildingType || 'house';
  const hasGarden = projectDetails.hasGarden !== false;

  if (buildingType === 'house') {
    // Individual house provision
    requirements.push({
      type: 'General Waste',
      color: 'Black',
      size: '140L wheelie bin',
      quantity: units,
      collectionFrequency: 'Weekly',
      purpose: 'Non-recyclable household waste'
    });

    requirements.push({
      type: 'Mixed Recycling',
      color: 'Blue',
      size: '140L wheelie bin',
      quantity: units,
      collectionFrequency: 'Weekly',
      purpose: 'Paper, cardboard, plastics, cans, cartons'
    });

    requirements.push({
      type: 'Food Waste',
      color: 'Brown/Green',
      size: '23L caddy',
      quantity: units,
      collectionFrequency: 'Weekly',
      purpose: 'All food waste including cooked food'
    });

    if (hasGarden) {
      requirements.push({
        type: 'Garden Waste',
        color: 'Brown',
        size: '240L wheelie bin',
        quantity: units,
        collectionFrequency: 'Fortnightly (subscription service)',
        purpose: 'Garden cuttings, leaves, small branches'
      });
    }

    requirements.push({
      type: 'Glass',
      color: 'Green box',
      size: '55L box',
      quantity: units,
      collectionFrequency: 'Fortnightly',
      purpose: 'Glass bottles and jars only'
    });
  } else if (buildingType === 'flat' || buildingType === 'mixed' || buildingType === 'hmo') {
    // Communal provision
    const binRatio = Math.ceil(units / 6);

    requirements.push({
      type: 'General Waste',
      color: 'Black',
      size: units > 12 ? '1100L euro bin' : '240L wheelie bin',
      quantity: binRatio,
      collectionFrequency: 'Weekly or twice weekly for large developments',
      purpose: 'Non-recyclable household waste'
    });

    requirements.push({
      type: 'Mixed Recycling',
      color: 'Blue',
      size: units > 12 ? '1100L euro bin' : '240L wheelie bin',
      quantity: binRatio,
      collectionFrequency: 'Weekly',
      purpose: 'Paper, cardboard, plastics, cans, cartons'
    });

    requirements.push({
      type: 'Food Waste',
      color: 'Brown',
      size: '140L wheelie bin',
      quantity: Math.ceil(units / 8),
      collectionFrequency: 'Weekly',
      purpose: 'All food waste - includes individual caddies per flat'
    });

    requirements.push({
      type: 'Glass',
      color: 'Green',
      size: 'Communal glass bank',
      quantity: 1,
      collectionFrequency: 'As required',
      purpose: 'Communal glass recycling'
    });
  } else if (buildingType === 'commercial') {
    const floorArea = projectDetails.floorArea || 100;
    const commercialBins = Math.ceil(floorArea / 200);

    requirements.push({
      type: 'Commercial General Waste',
      color: 'Black/Grey',
      size: '1100L euro bin',
      quantity: commercialBins,
      collectionFrequency: 'As per commercial contract',
      purpose: 'General commercial waste'
    });

    requirements.push({
      type: 'Commercial Recycling',
      color: 'Blue',
      size: '1100L euro bin',
      quantity: commercialBins,
      collectionFrequency: 'As per commercial contract',
      purpose: 'Mixed dry recyclables'
    });
  }

  return requirements;
}

// =============================================================================
// STORAGE DESIGN
// =============================================================================

function determineStorageDesign(
  projectType: string,
  projectDetails: WasteProject
): StorageDesign {
  const units = projectDetails.dwellingUnits || 1;
  const buildingType = projectDetails.buildingType || 'house';
  const hasStreetFrontage = projectDetails.streetFrontage !== false;

  let locationType = 'Front garden/forecourt';
  let minimumArea = STORAGE_STANDARDS.house.minAreaPerUnit * units;
  
  if (buildingType === 'flat' || units > 4) {
    locationType = 'Dedicated communal bin store';
    minimumArea = Math.max(6, units * STORAGE_STANDARDS.flat.minAreaPerUnit);
  }

  if (projectDetails.hasBasement) {
    locationType = 'Basement bin store with lift access';
  }

  const accessRequirements: string[] = [
    'Level or gently sloping access path',
    'Minimum 1.2m clear width to access point',
    'Non-slip surface to storage area',
    'Adequate lighting for safe use'
  ];

  if (units > 6) {
    accessRequirements.push('Double doors minimum 1.5m opening');
    accessRequirements.push('No steps between store and collection point');
  }

  const designConsiderations: string[] = [
    'Bin store should be closer to collection point than main entrance',
    'Consider prevailing wind direction for odor control',
    'Ensure drainage away from building',
    'Allow space for bin maneuvering'
  ];

  if (!hasStreetFrontage) {
    designConsiderations.push('Provide designated collection day presentation point');
    designConsiderations.push('Consider bin carrying distance for residents');
  }

  return {
    locationType,
    minimumArea: Math.round(minimumArea * 10) / 10,
    accessRequirements,
    screeningRequired: true, // Always required in conservation areas
    ventilationRequired: buildingType !== 'house',
    drainageRequired: true,
    lightingRequired: true,
    designConsiderations
  };
}

// =============================================================================
// COLLECTION ACCESS
// =============================================================================

function assessCollectionAccess(
  projectDetails: WasteProject
): CollectionAccess {
  const hasStreetFrontage = projectDetails.streetFrontage !== false;

  return {
    maxCarryDistance: hasStreetFrontage ? 15 : 25,
    gradientRequirements: 'Maximum 1:12 gradient for wheeled bins',
    surfaceRequirements: 'Hard, level surface suitable for wheeled bins - no gravel or loose surfaces',
    clearanceWidth: 1.5,
    turningSpace: 'Minimum 1.5m x 1.5m turning area for 1100L bins',
    vehicleAccess: hasStreetFrontage 
      ? 'Standard refuse vehicle access via public highway'
      : 'May require private road access agreement or alternative arrangements'
  };
}

// =============================================================================
// RECYCLING REQUIREMENTS
// =============================================================================

function determineRecyclingRequirements(
  projectType: string
): RecyclingRequirements {
  const materials: RecyclingStream[] = [
    {
      material: 'Paper and Cardboard',
      container: 'Blue bin/bag',
      collectionDay: 'Check local schedule',
      preparation: [
        'Flatten cardboard boxes',
        'Remove plastic windows from envelopes',
        'Keep dry'
      ]
    },
    {
      material: 'Plastics and Cans',
      container: 'Blue bin/bag',
      collectionDay: 'Check local schedule',
      preparation: [
        'Rinse containers',
        'Remove lids (can go in separately)',
        'No black plastic trays'
      ]
    },
    {
      material: 'Glass',
      container: 'Green box/bank',
      collectionDay: 'Fortnightly',
      preparation: [
        'Rinse bottles and jars',
        'Remove lids',
        'No broken glass, mirrors, or ceramics'
      ]
    },
    {
      material: 'Food Waste',
      container: 'Brown/green caddy',
      collectionDay: 'Weekly',
      preparation: [
        'Use compostable liner bags',
        'Include all food waste',
        'No packaging or plastic'
      ]
    },
    {
      material: 'Garden Waste',
      container: 'Brown wheelie bin',
      collectionDay: 'Fortnightly (subscription)',
      preparation: [
        'No soil or rubble',
        'Cut branches under 10cm diameter',
        'No plastic plant pots'
      ]
    }
  ];

  return {
    materials,
    separationMethod: 'Source separation - residents sort into appropriate containers',
    educationRequired: true,
    targetRate: 'Camden target: 50% household recycling rate'
  };
}

// =============================================================================
// CONSTRUCTION WASTE
// =============================================================================

function assessConstructionWaste(
  projectType: string,
  projectDetails: WasteProject
): ConstructionWaste {
  const floorArea = projectDetails.floorArea || 100;
  const isLargeProject = floorArea > 300;

  return {
    applicable: true,
    swmpRequired: isLargeProject,
    estimatedVolume: `Approximately ${Math.round(floorArea * 0.1)} - ${Math.round(floorArea * 0.15)} cubic meters`,
    wasteTypes: [
      'Demolition materials (brick, concrete, tiles)',
      'Timber and wood products',
      'Metals (steel, copper, lead)',
      'Plasterboard and insulation',
      'Packaging materials',
      'Soil and excavation spoil'
    ],
    disposalMethods: [
      'Licensed skip hire with waste transfer notes',
      'Direct delivery to licensed recycling facility',
      'Segregated material streams for maximum recycling',
      'Hazardous waste via licensed contractor (asbestos, lead paint)'
    ],
    recyclingTarget: '90% diversion from landfill (BREEAM requirement)',
    documentation: [
      'Site Waste Management Plan (SWMP)',
      'Waste Transfer Notes for each removal',
      'Hazardous Waste Consignment Notes (if applicable)',
      'Recycling receipts and certificates'
    ]
  };
}

// =============================================================================
// CONSERVATION CONSIDERATIONS
// =============================================================================

function assessConservationWaste(
  projectDetails: WasteProject
): ConservationWaste {
  return {
    applicable: true,
    screeningRequired: true,
    materialRestrictions: [
      'Natural materials for enclosure (timber, brick)',
      'Colors to complement building and area character',
      'No bright or garish colors',
      'Traditional detailing for visible structures'
    ],
    designGuidance: [
      'Screen bin stores from public view',
      'Use planting to soften visual impact',
      'Match enclosure materials to main building',
      'Consider heritage-style gates or screens',
      'Integrate with boundary treatment design'
    ],
    heritageConsiderations: [
      'Bin stores should not dominate front garden areas',
      'Historic bin stores may have heritage value',
      'Avoid damage to historic boundary walls',
      'Consider underground or concealed storage options'
    ]
  };
}

// =============================================================================
// PLANNING REQUIREMENTS
// =============================================================================

function determinePlanningRequirements(
  projectType: string,
  projectDetails: WasteProject
): PlanningWaste {
  const units = projectDetails.dwellingUnits || 1;

  const conditionsLikely: string[] = [
    'Details of refuse and recycling storage to be submitted and approved',
    'Storage to be provided before occupation'
  ];

  if (units > 6) {
    conditionsLikely.push('Management plan for communal waste facilities');
  }

  return {
    conditionsLikely,
    documentsRequired: [
      'Waste Management Strategy document',
      'Bin store layout and elevations',
      'Collection access route plan',
      'Recycling provision details'
    ],
    complianceChecklist: [
      'Adequate storage capacity for all waste streams',
      'Accessible location for collection',
      'Appropriate screening and enclosure',
      'Compliant access route',
      'Ventilation for enclosed stores',
      'Drainage provision'
    ]
  };
}

// =============================================================================
// COST ESTIMATES
// =============================================================================

function estimateCosts(
  projectType: string,
  projectDetails: WasteProject
): WasteCosts {
  const units = projectDetails.dwellingUnits || 1;

  return {
    binProvision: {
      item: 'Bin provision',
      cost: 'Free from Camden Council for standard residential bins',
      frequency: 'One-off',
      notes: 'Additional bins may incur charges'
    },
    storageConstruction: {
      item: 'Bin store construction',
      cost: units > 1 ? `£2,000 - £8,000` : `£500 - £1,500`,
      frequency: 'One-off',
      notes: 'Depends on materials, size, and screening requirements'
    },
    collectionCharges: {
      item: 'Collection service',
      cost: 'Included in council tax (residential)',
      frequency: 'Annual',
      notes: 'Commercial properties require private contract (£500-£3,000/year)'
    },
    bulkyWaste: {
      item: 'Bulky waste collection',
      cost: 'From £25 per collection',
      frequency: 'As required',
      notes: 'Book via Camden Council'
    }
  };
}

// =============================================================================
// CONTACTS
// =============================================================================

function getContacts(): WasteContact[] {
  return [
    {
      organization: 'Camden Council Waste Services',
      service: 'Bin provision and collection queries',
      phone: '020 7974 4444',
      email: 'wasteservices@camden.gov.uk',
      website: 'https://www.camden.gov.uk/waste-and-recycling'
    },
    {
      organization: 'Camden Recycling Centres',
      service: 'Household Waste Recycling Centres',
      website: 'https://www.camden.gov.uk/recycling-centres'
    },
    {
      organization: 'Commercial Waste Services',
      service: 'Business waste collection',
      phone: '020 7974 6914',
      email: 'commercial.waste@camden.gov.uk'
    }
  ];
}

// =============================================================================
// NEXT STEPS
// =============================================================================

function generateNextSteps(projectType: string): string[] {
  return [
    'Calculate total bin storage requirements for your development',
    'Design bin store location and layout',
    'Ensure collection vehicle access route is compliant',
    'Submit waste management strategy with planning application',
    'Consider BREEAM credits for waste facilities',
    'Contact Camden Waste Services for bin provision',
    'If commercial: arrange private waste collection contract'
  ];
}

// =============================================================================
// EXPORTS
// =============================================================================

const wasteManagement = {
  assessWasteManagement,
  CAMDEN_BIN_SPECIFICATIONS,
  STORAGE_STANDARDS
};

export default wasteManagement;
