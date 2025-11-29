/**
 * Biodiversity Enhancement Service
 * 
 * Comprehensive guidance for biodiversity net gain requirements and
 * ecological enhancement opportunities for development projects in
 * Hampstead and surrounding conservation areas.
 * 
 * Coverage: NW1-NW11, N2, N6, N10 postcodes
 */

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

interface BiodiversityProject {
  siteArea?: number;
  existingHabitats?: string[];
  proposedHabitats?: string[];
  existingTrees?: number;
  proposedTrees?: number;
  greenRoof?: boolean;
  livingWall?: boolean;
  pond?: boolean;
  swales?: boolean;
  hedgeLength?: number;
  meadowArea?: number;
  majorDevelopment?: boolean;
}

interface HabitatAssessment {
  existingValue: string;
  opportunities: string[];
  constraints: string[];
  bngRequirement: boolean;
  targetUplift: string;
}

interface BNGRequirements {
  applicable: boolean;
  minimumGain: string;
  duration: string;
  measurement: string;
  offSiteOptions: string[];
  exemptions: string[];
}

interface HabitatCreation {
  type: string;
  description: string;
  biodiversityValue: string;
  area: string;
  cost: string;
  maintenance: string;
  timeToEstablish: string;
  species: string[];
}

interface SpeciesSupport {
  species: string;
  requirements: string[];
  features: string[];
  timing: string;
}

interface BiodiversityAssessment {
  summary: BiodiversitySummary;
  habitatAssessment: HabitatAssessment;
  bngRequirements: BNGRequirements;
  habitatCreationOptions: HabitatCreation[];
  speciesSupport: SpeciesSupport[];
  greenInfrastructure: GreenInfrastructure;
  planningRequirements: PlanningBiodiversity;
  implementation: ImplementationGuidance;
  costs: BiodiversityCosts;
  contacts: BiodiversityContact[];
  nextSteps: string[];
}

interface BiodiversitySummary {
  siteContext: string;
  biodiversityPotential: string;
  keyOpportunities: string[];
  keyConstraints: string[];
  complianceStatus: string;
}

interface GreenInfrastructure {
  greenRoofs: GreenRoofGuidance;
  livingWalls: LivingWallGuidance;
  sudsFeatures: SuDSGuidance;
  urbanGreening: UrbanGreeningGuidance;
}

interface GreenRoofGuidance {
  types: GreenRoofType[];
  benefits: string[];
  considerations: string[];
  maintenance: string;
}

interface GreenRoofType {
  type: string;
  description: string;
  depth: string;
  weight: string;
  biodiversityValue: string;
  cost: string;
}

interface LivingWallGuidance {
  types: string[];
  benefits: string[];
  considerations: string[];
  plantSpecies: string[];
  maintenance: string;
}

interface SuDSGuidance {
  features: SuDSFeature[];
  biodiversityBenefits: string[];
  integrationTips: string[];
}

interface SuDSFeature {
  type: string;
  description: string;
  habitat: string;
  maintenance: string;
}

interface UrbanGreeningGuidance {
  ugfScore: string;
  surfaceTypes: UGFSurface[];
  targetScore: string;
  strategies: string[];
}

interface UGFSurface {
  type: string;
  factor: number;
  description: string;
}

interface PlanningBiodiversity {
  conditionsLikely: string[];
  documentsRequired: string[];
  measurementTools: string[];
  monitoringRequirements: string[];
}

interface ImplementationGuidance {
  phases: ImplementationPhase[];
  timing: string[];
  bestPractice: string[];
}

interface ImplementationPhase {
  phase: string;
  activities: string[];
  timing: string;
}

interface BiodiversityCosts {
  habitatCreation: CostItem[];
  greenInfrastructure: CostItem[];
  ongoing: CostItem[];
  offsetPayments: CostItem[];
}

interface CostItem {
  item: string;
  cost: string;
  notes: string;
}

interface BiodiversityContact {
  organization: string;
  service: string;
  phone?: string;
  email?: string;
  website?: string;
}

// =============================================================================
// CONSTANTS
// =============================================================================

const BNG_THRESHOLDS = {
  minimumGain: 10, // percent
  duration: 30, // years
  majorDevelopmentThreshold: 10, // dwellings or 0.5ha
  effectiveDate: '2024-02-12' // February 2024
};

const UGF_FACTORS = {
  semiNaturalVegetation: 1.0,
  wetlandMarshPond: 1.0,
  intensiveGreenRoof: 0.8,
  extensiveGreenRoof: 0.7,
  treeCanopy: 0.8,
  hedges: 0.6,
  groundPlanting: 0.5,
  permablePaving: 0.1,
  impermeableSurfaces: 0.0
};

const PRIORITY_SPECIES = {
  birds: ['House sparrow', 'Swift', 'Starling', 'Song thrush'],
  bats: ['Common pipistrelle', 'Soprano pipistrelle'],
  invertebrates: ['Stag beetle', 'Solitary bees', 'Various butterflies'],
  mammals: ['Hedgehog']
};

// =============================================================================
// MAIN SERVICE FUNCTION
// =============================================================================

async function assessBiodiversity(
  address: string,
  postcode: string,
  projectType: string,
  projectDetails: BiodiversityProject = {}
): Promise<BiodiversityAssessment> {
  const summary = generateSummary(projectType, projectDetails);
  const habitatAssessment = assessHabitats(projectDetails);
  const bngRequirements = determineBNGRequirements(projectDetails);
  const habitatCreationOptions = generateHabitatOptions(projectDetails);
  const speciesSupport = identifySpeciesSupport(projectDetails);
  const greenInfrastructure = assessGreenInfrastructure(projectDetails);
  const planningRequirements = determinePlanningRequirements(projectDetails);
  const implementation = generateImplementationGuidance();
  const costs = estimateCosts(projectDetails);
  const contacts = getContacts();
  const nextSteps = generateNextSteps(projectType, projectDetails);

  return {
    summary,
    habitatAssessment,
    bngRequirements,
    habitatCreationOptions,
    speciesSupport,
    greenInfrastructure,
    planningRequirements,
    implementation,
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
  projectDetails: BiodiversityProject
): BiodiversitySummary {
  const keyOpportunities: string[] = [];
  const keyConstraints: string[] = [];

  if (projectDetails.greenRoof) {
    keyOpportunities.push('Green roof potential for biodiversity');
  }
  if (projectDetails.pond) {
    keyOpportunities.push('Water feature for amphibians and invertebrates');
  }
  if (projectDetails.proposedTrees && projectDetails.proposedTrees > 0) {
    keyOpportunities.push('Tree planting for habitat connectivity');
  }

  const isMajor = projectDetails.majorDevelopment || 
    (projectDetails.siteArea && projectDetails.siteArea >= 5000);

  if (isMajor) {
    keyConstraints.push('Major development - mandatory BNG applies');
  }

  return {
    siteContext: `Urban development in North London - potential for biodiversity enhancement`,
    biodiversityPotential: projectDetails.greenRoof || projectDetails.pond 
      ? 'High - multiple enhancement opportunities identified'
      : 'Moderate - standard enhancement measures available',
    keyOpportunities,
    keyConstraints,
    complianceStatus: isMajor 
      ? 'Mandatory 10% Biodiversity Net Gain required'
      : 'Good practice BNG recommended'
  };
}

// =============================================================================
// HABITAT ASSESSMENT
// =============================================================================

function assessHabitats(projectDetails: BiodiversityProject): HabitatAssessment {
  const existingHabitats = projectDetails.existingHabitats || ['amenity grassland', 'ornamental planting'];
  
  return {
    existingValue: 'Low to moderate - typical urban residential',
    opportunities: [
      'Convert amenity grass to wildflower meadow',
      'Create wildlife pond or water feature',
      'Install bird and bat boxes',
      'Plant native hedgerows',
      'Add green roof or living wall',
      'Create log piles and habitat stacks'
    ],
    constraints: [
      'Limited space for large-scale habitat creation',
      'Urban context limits some habitat types',
      'Existing hard surfacing to work around'
    ],
    bngRequirement: projectDetails.majorDevelopment || false,
    targetUplift: '10% minimum (mandatory for major developments)'
  };
}

// =============================================================================
// BNG REQUIREMENTS
// =============================================================================

function determineBNGRequirements(projectDetails: BiodiversityProject): BNGRequirements {
  const isMajor = Boolean(projectDetails.majorDevelopment || 
    (projectDetails.siteArea && projectDetails.siteArea >= 5000));

  return {
    applicable: isMajor,
    minimumGain: '10% net gain in biodiversity units',
    duration: '30 years secured through planning condition or obligation',
    measurement: 'Biodiversity Metric 4.0 (DEFRA)',
    offSiteOptions: [
      'Purchase biodiversity units from habitat bank',
      'Off-site habitat creation with landowner agreement',
      'Statutory biodiversity credits from government'
    ],
    exemptions: [
      'Householder applications (permitted development)',
      'Biodiversity gain sites themselves',
      'Self-build and custom housebuilding (first dwelling)',
      'Small developments below de minimis threshold'
    ]
  };
}

// =============================================================================
// HABITAT CREATION OPTIONS
// =============================================================================

function generateHabitatOptions(projectDetails: BiodiversityProject): HabitatCreation[] {
  const options: HabitatCreation[] = [];

  // Wildflower meadow
  options.push({
    type: 'Wildflower Meadow',
    description: 'Convert lawn to native wildflower meadow',
    biodiversityValue: 'High - supports pollinators, seeds for birds',
    area: 'From 10m² upwards',
    cost: '£5-15/m² for establishment',
    maintenance: 'Cut twice yearly (late summer and autumn)',
    timeToEstablish: '2-3 years for full establishment',
    species: [
      'Ox-eye daisy', 'Field scabious', 'Knapweed',
      'Birds foot trefoil', 'Red clover', 'Yellow rattle'
    ]
  });

  // Wildlife pond
  options.push({
    type: 'Wildlife Pond',
    description: 'Create shallow-edged pond for amphibians and invertebrates',
    biodiversityValue: 'Very high - supports multiple species groups',
    area: 'Minimum 2m² (larger better)',
    cost: '£500-3,000 depending on size',
    maintenance: 'Annual vegetation management, no fish',
    timeToEstablish: '1-2 years to colonize naturally',
    species: [
      'Frogspawn/frogs', 'Newts', 'Dragonflies',
      'Water beetles', 'Pond plants'
    ]
  });

  // Native hedgerow
  options.push({
    type: 'Native Hedgerow',
    description: 'Plant mixed native species hedge',
    biodiversityValue: 'High - nesting birds, berry food source',
    area: 'Linear feature - any length',
    cost: '£15-40/m planted',
    maintenance: 'Annual trim (not nesting season)',
    timeToEstablish: '3-5 years for mature hedge',
    species: [
      'Hawthorn', 'Blackthorn', 'Field maple',
      'Hazel', 'Dog rose', 'Holly'
    ]
  });

  // Bird boxes
  options.push({
    type: 'Integrated Bird Boxes',
    description: 'Swift bricks or sparrow terraces built into walls',
    biodiversityValue: 'High for target species',
    area: 'N/A - built into structure',
    cost: '£30-150 each (installed)',
    maintenance: 'None - self-cleaning',
    timeToEstablish: '1-3 years for occupancy',
    species: ['Swift', 'House sparrow', 'Starling']
  });

  // Bat boxes
  options.push({
    type: 'Bat Boxes/Bricks',
    description: 'Integrated bat roost units',
    biodiversityValue: 'High for bats',
    area: 'N/A - built into structure',
    cost: '£50-200 each (installed)',
    maintenance: 'None required',
    timeToEstablish: 'Variable - can take years to occupy',
    species: ['Common pipistrelle', 'Soprano pipistrelle']
  });

  // Insect hotel
  options.push({
    type: 'Insect Habitat',
    description: 'Bug hotels, log piles, and bare earth areas',
    biodiversityValue: 'Moderate to high for invertebrates',
    area: 'Various sizes',
    cost: '£20-200',
    maintenance: 'Minimal - occasional repair',
    timeToEstablish: 'Immediate use',
    species: ['Solitary bees', 'Hoverflies', 'Beetles', 'Spiders']
  });

  if (projectDetails.greenRoof) {
    options.push({
      type: 'Biodiverse Green Roof',
      description: 'Extensive green roof with native/wildflower planting',
      biodiversityValue: 'High - invertebrates, birds',
      area: 'As roof area allows',
      cost: '£80-150/m²',
      maintenance: '1-2 visits per year',
      timeToEstablish: '1-2 years',
      species: ['Sedum species', 'Native wildflowers', 'Bees', 'Butterflies']
    });
  }

  return options;
}

// =============================================================================
// SPECIES SUPPORT
// =============================================================================

function identifySpeciesSupport(projectDetails: BiodiversityProject): SpeciesSupport[] {
  const speciesSupport: SpeciesSupport[] = [];

  // Swifts
  speciesSupport.push({
    species: 'Swift',
    requirements: [
      'High-level nest sites (5m+)',
      'Clear flight path to boxes',
      'North or east facing preferred'
    ],
    features: [
      'Swift bricks integrated into walls',
      'External swift boxes under eaves',
      'Minimum 2 boxes recommended'
    ],
    timing: 'Install during construction; birds return April-August'
  });

  // House sparrows
  speciesSupport.push({
    species: 'House Sparrow',
    requirements: [
      'Colonial nesting (groups of boxes)',
      'Dense shrub cover nearby',
      'Food sources (seeds, insects)'
    ],
    features: [
      'Sparrow terrace (3+ compartments)',
      'Dense hedge planting',
      'Seed-bearing plants'
    ],
    timing: 'Year-round residents; install boxes before spring'
  });

  // Hedgehogs
  speciesSupport.push({
    species: 'Hedgehog',
    requirements: [
      'Ground-level access between gardens',
      'Shelter and nesting sites',
      'Foraging habitat'
    ],
    features: [
      '13cm gaps in fences (hedgehog highways)',
      'Log piles and leaf heaps',
      'Wild corners',
      'Avoiding pesticides'
    ],
    timing: 'Active March-November; hibernate in winter'
  });

  // Solitary bees
  speciesSupport.push({
    species: 'Solitary Bees',
    requirements: [
      'Nest sites (tubes, bare soil)',
      'Flowers for pollen/nectar',
      'Sunny location'
    ],
    features: [
      'Bee hotels with various tube sizes',
      'Bare soil patches',
      'Native wildflowers',
      'Fruit trees'
    ],
    timing: 'Most active March-September'
  });

  // Bats
  speciesSupport.push({
    species: 'Bats (Pipistrelle)',
    requirements: [
      'Roost sites',
      'Foraging habitat',
      'Dark corridors for commuting'
    ],
    features: [
      'Bat bricks or boxes',
      'Native planting (attracts insects)',
      'Reduced artificial lighting',
      'Water features'
    ],
    timing: 'Active April-October; hibernate in winter'
  });

  return speciesSupport;
}

// =============================================================================
// GREEN INFRASTRUCTURE
// =============================================================================

function assessGreenInfrastructure(projectDetails: BiodiversityProject): GreenInfrastructure {
  return {
    greenRoofs: {
      types: [
        {
          type: 'Extensive (sedum)',
          description: 'Lightweight, low maintenance roof covering',
          depth: '80-150mm',
          weight: '60-150 kg/m²',
          biodiversityValue: 'Moderate - invertebrates',
          cost: '£80-120/m²'
        },
        {
          type: 'Biodiverse',
          description: 'Variable depth with diverse planting',
          depth: '100-200mm',
          weight: '100-200 kg/m²',
          biodiversityValue: 'High - wildflowers, invertebrates',
          cost: '£100-150/m²'
        },
        {
          type: 'Intensive',
          description: 'Deep substrate supporting varied planting',
          depth: '200mm+',
          weight: '200-400+ kg/m²',
          biodiversityValue: 'Very high - multiple habitats',
          cost: '£150-300/m²'
        }
      ],
      benefits: [
        'Stormwater attenuation',
        'Urban cooling',
        'Habitat creation',
        'Improved air quality',
        'Extended roof lifespan'
      ],
      considerations: [
        'Structural capacity assessment needed',
        'Waterproofing specification critical',
        'Access for maintenance',
        'Irrigation may be needed for intensive'
      ],
      maintenance: '1-2 inspections per year; occasional weeding'
    },
    livingWalls: {
      types: ['Modular panel systems', 'Felt pocket systems', 'Climbing plants on frames'],
      benefits: [
        'Vertical habitat',
        'Air quality improvement',
        'Building cooling',
        'Visual amenity'
      ],
      considerations: [
        'Irrigation requirement',
        'Structural loading',
        'Plant selection for aspect',
        'Ongoing maintenance access'
      ],
      plantSpecies: [
        'Climbing hydrangea (shade)',
        'Star jasmine (sun/shelter)',
        'Boston ivy',
        'Native climbers'
      ],
      maintenance: 'Regular irrigation checks; seasonal pruning'
    },
    sudsFeatures: {
      features: [
        {
          type: 'Rain Garden',
          description: 'Planted depression collecting runoff',
          habitat: 'Wetland margin plants',
          maintenance: 'Seasonal planting management'
        },
        {
          type: 'Swale',
          description: 'Linear drainage feature with planting',
          habitat: 'Grassland/wetland transition',
          maintenance: 'Annual mowing'
        },
        {
          type: 'Pond with SuDS Function',
          description: 'Permanent water feature managing runoff',
          habitat: 'Full aquatic habitat',
          maintenance: 'Vegetation management'
        }
      ],
      biodiversityBenefits: [
        'Creates wetland habitat',
        'Supports amphibians and invertebrates',
        'Drinking water for wildlife',
        'Attracts birds'
      ],
      integrationTips: [
        'Combine with native planting',
        'Include shallow edges for wildlife access',
        'Avoid fish in wildlife ponds',
        'Link to other habitats'
      ]
    },
    urbanGreening: {
      ugfScore: 'Urban Greening Factor assessment',
      surfaceTypes: [
        { type: 'Semi-natural vegetation', factor: 1.0, description: 'Wildflower meadow, woodland' },
        { type: 'Wetland/pond', factor: 1.0, description: 'Water features with vegetation' },
        { type: 'Intensive green roof', factor: 0.8, description: 'Deep substrate green roof' },
        { type: 'Standard trees', factor: 0.8, description: 'New tree planting' },
        { type: 'Extensive green roof', factor: 0.7, description: 'Sedum roof' },
        { type: 'Hedges', factor: 0.6, description: 'Native hedgerow' },
        { type: 'Ground level planting', factor: 0.5, description: 'Shrubs and herbaceous' },
        { type: 'Permeable paving', factor: 0.1, description: 'Block paving, gravel' },
        { type: 'Sealed surfaces', factor: 0.0, description: 'Concrete, tarmac' }
      ],
      targetScore: '0.4 for residential; 0.3 for commercial',
      strategies: [
        'Maximize soft landscaping',
        'Include trees where possible',
        'Consider green roofs on all suitable structures',
        'Use permeable surfaces for hard areas'
      ]
    }
  };
}

// =============================================================================
// PLANNING REQUIREMENTS
// =============================================================================

function determinePlanningRequirements(projectDetails: BiodiversityProject): PlanningBiodiversity {
  const isMajor = projectDetails.majorDevelopment || false;

  return {
    conditionsLikely: [
      'Biodiversity Enhancement Scheme to be submitted',
      'Implementation before occupation',
      'Management plan for 30 years (if BNG)',
      'Bird/bat box installation'
    ],
    documentsRequired: [
      'Preliminary Ecological Appraisal (if habitat present)',
      'Biodiversity Net Gain assessment (major developments)',
      'Landscape and Biodiversity Plan',
      'Lighting strategy to protect nocturnal wildlife'
    ],
    measurementTools: [
      'DEFRA Biodiversity Metric 4.0',
      'Small Sites Metric (minor developments)',
      'Urban Greening Factor calculator'
    ],
    monitoringRequirements: isMajor ? [
      'Baseline habitat survey',
      'Post-completion survey (Year 2, 5, 10, 20, 30)',
      'Remediation if targets not met',
      'Annual reporting to planning authority'
    ] : [
      'Implementation verification',
      'Replacement of failed planting'
    ]
  };
}

// =============================================================================
// IMPLEMENTATION GUIDANCE
// =============================================================================

function generateImplementationGuidance(): ImplementationGuidance {
  return {
    phases: [
      {
        phase: 'Pre-construction',
        activities: [
          'Baseline ecological survey',
          'BNG assessment if required',
          'Design biodiversity features',
          'Submit ecological information with application'
        ],
        timing: 'Before planning submission'
      },
      {
        phase: 'During construction',
        activities: [
          'Protect retained habitats',
          'Install integrated features (swift bricks, bat bricks)',
          'Create substrate for green roof',
          'Install wildlife pond liner'
        ],
        timing: 'Coordinated with construction programme'
      },
      {
        phase: 'Landscaping',
        activities: [
          'Soil preparation and improvement',
          'Native planting installation',
          'Meadow seeding',
          'External nest box installation'
        ],
        timing: 'Optimal planting season (Oct-Mar)'
      },
      {
        phase: 'Establishment',
        activities: [
          'Watering and maintenance',
          'Monitoring for establishment',
          'Replacement of failures',
          'Initial wildlife surveys'
        ],
        timing: 'First 2 years'
      },
      {
        phase: 'Long-term management',
        activities: [
          'Ongoing habitat management',
          'Periodic monitoring',
          'Reporting to LPA',
          'Adaptive management'
        ],
        timing: '30-year management period'
      }
    ],
    timing: [
      'Tree planting: November-March',
      'Meadow seeding: September-October or March-April',
      'Pond planting: May-June',
      'Green roof installation: Any time (avoid frosts)',
      'Bird box installation: Before March (nesting season)'
    ],
    bestPractice: [
      'Use locally sourced native species where possible',
      'Avoid peat-based composts',
      'Create diverse habitat structure',
      'Connect habitats to wider green infrastructure',
      'Minimize pesticide and herbicide use',
      'Leave some areas untidy for wildlife'
    ]
  };
}

// =============================================================================
// COST ESTIMATES
// =============================================================================

function estimateCosts(projectDetails: BiodiversityProject): BiodiversityCosts {
  return {
    habitatCreation: [
      {
        item: 'Wildflower meadow creation',
        cost: '£5-15/m²',
        notes: 'Soil preparation, seed mix, establishment'
      },
      {
        item: 'Wildlife pond',
        cost: '£500-3,000',
        notes: 'Size dependent'
      },
      {
        item: 'Native hedgerow',
        cost: '£15-40/m',
        notes: 'Plants and installation'
      },
      {
        item: 'Log pile/habitat stack',
        cost: '£50-200',
        notes: 'Simple features'
      }
    ],
    greenInfrastructure: [
      {
        item: 'Extensive green roof',
        cost: '£80-150/m²',
        notes: 'Including waterproofing upgrades'
      },
      {
        item: 'Swift bricks (integrated)',
        cost: '£30-50 each',
        notes: 'Minimum 2 recommended'
      },
      {
        item: 'Bat bricks (integrated)',
        cost: '£50-100 each',
        notes: 'Various designs available'
      },
      {
        item: 'Living wall system',
        cost: '£400-1,200/m²',
        notes: 'Including irrigation'
      }
    ],
    ongoing: [
      {
        item: 'Annual habitat management',
        cost: '£500-2,000/year',
        notes: 'For managed habitats'
      },
      {
        item: 'Monitoring surveys',
        cost: '£500-1,500 per survey',
        notes: 'As required by condition'
      }
    ],
    offsetPayments: [
      {
        item: 'Statutory biodiversity credits',
        cost: '£42,000 per unit',
        notes: 'Government scheme - last resort'
      },
      {
        item: 'Habitat bank units',
        cost: '£15,000-35,000 per unit',
        notes: 'Market rate varies'
      }
    ]
  };
}

// =============================================================================
// CONTACTS
// =============================================================================

function getContacts(): BiodiversityContact[] {
  return [
    {
      organization: 'London Wildlife Trust',
      service: 'Wildlife gardening advice and volunteering',
      phone: '020 7261 0447',
      website: 'https://www.wildlondon.org.uk'
    },
    {
      organization: 'CIEEM',
      service: 'Find a qualified ecologist',
      website: 'https://cieem.net/i-am/find-a-member/'
    },
    {
      organization: 'Natural England',
      service: 'Biodiversity Net Gain guidance',
      website: 'https://www.gov.uk/guidance/biodiversity-net-gain'
    },
    {
      organization: 'Swift Conservation',
      service: 'Swift nest box advice',
      website: 'https://www.swift-conservation.org'
    },
    {
      organization: 'Camden Biodiversity Team',
      service: 'Local ecological advice',
      phone: '020 7974 4444',
      email: 'biodiversity@camden.gov.uk'
    }
  ];
}

// =============================================================================
// NEXT STEPS
// =============================================================================

function generateNextSteps(
  projectType: string,
  projectDetails: BiodiversityProject
): string[] {
  const steps: string[] = [];

  steps.push('Survey existing habitats and features');
  
  if (projectDetails.majorDevelopment) {
    steps.push('Commission Biodiversity Net Gain assessment');
    steps.push('Calculate baseline biodiversity units using Metric 4.0');
  }

  steps.push('Design integrated biodiversity features');
  steps.push('Specify native planting scheme');
  steps.push('Include bird and bat boxes in building design');
  steps.push('Consider green roof and SuDS opportunities');
  steps.push('Prepare Biodiversity Enhancement Plan');
  steps.push('Submit with planning application');
  steps.push('Implement features during construction');
  steps.push('Establish management plan');

  return steps;
}

// =============================================================================
// EXPORTS
// =============================================================================

const biodiversityEnhancement = {
  assessBiodiversity,
  BNG_THRESHOLDS,
  UGF_FACTORS,
  PRIORITY_SPECIES
};

export default biodiversityEnhancement;
