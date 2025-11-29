/**
 * Landscape Design Service
 * 
 * Comprehensive guidance for landscape design and planting schemes
 * for development projects in Hampstead and surrounding conservation areas.
 * 
 * Coverage: NW1-NW11, N2, N6, N10 postcodes
 */

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

interface LandscapeProject {
  plotSize?: number;
  frontGardenSize?: number;
  rearGardenSize?: number;
  sideGardenSize?: number;
  existingTrees?: number;
  proposedTrees?: number;
  existingHardscape?: number;
  proposedHardscape?: number;
  soilType?: 'clay' | 'sandy' | 'loam' | 'chalky' | 'unknown';
  aspect?: 'north' | 'south' | 'east' | 'west' | 'mixed';
  shade?: 'full_sun' | 'partial_shade' | 'full_shade' | 'mixed';
  conservationArea?: boolean;
  gardenStyle?: string;
  maintenanceLevel?: 'low' | 'medium' | 'high';
}

interface PlantingScheme {
  trees: TreeRecommendation[];
  shrubs: PlantRecommendation[];
  perennials: PlantRecommendation[];
  groundCover: PlantRecommendation[];
  climbers: PlantRecommendation[];
  hedging: HedgingRecommendation[];
  bulbs: PlantRecommendation[];
}

interface TreeRecommendation {
  name: string;
  latinName: string;
  matureHeight: string;
  spread: string;
  growthRate: string;
  suitability: string;
  benefits: string[];
  conservation: boolean;
  nativePlant: boolean;
  maintenanceNeeds: string;
  soilRequirements: string;
  lightRequirements: string;
}

interface PlantRecommendation {
  name: string;
  latinName: string;
  height: string;
  spread: string;
  floweringSeason?: string;
  suitability: string;
  benefits: string[];
  maintenanceLevel: string;
  nativePlant: boolean;
}

interface HedgingRecommendation {
  name: string;
  latinName: string;
  matureHeight: string;
  trimFrequency: string;
  formal: boolean;
  wildlife: boolean;
  evergreen: boolean;
  growthRate: string;
  suitability: string;
}

interface GardenZones {
  frontGarden: ZoneGuidance;
  rearGarden: ZoneGuidance;
  sideGarden: ZoneGuidance;
  boundaries: BoundaryPlanting;
}

interface ZoneGuidance {
  description: string;
  primaryPurpose: string[];
  designPrinciples: string[];
  plantingStyle: string;
  recommendedFeatures: string[];
  avoidFeatures: string[];
}

interface BoundaryPlanting {
  frontBoundary: string[];
  sideBoundary: string[];
  rearBoundary: string[];
  neighborConsiderations: string[];
}

interface SustainableLandscaping {
  waterManagement: WaterGuidance;
  wildlifeFriendly: WildlifeGuidance;
  lowMaintenance: MaintenanceGuidance;
  climateResilience: ClimateGuidance;
}

interface WaterGuidance {
  droughtTolerant: string[];
  rainGardens: string;
  waterHarvesting: string[];
  irrigationOptions: string[];
}

interface WildlifeGuidance {
  pollinatorPlanting: string[];
  birdFriendly: string[];
  hedgehogAccess: string[];
  pondFeatures: string;
  bugHotels: string;
}

interface MaintenanceGuidance {
  strategies: string[];
  timeCommitment: string;
  seasonalTasks: SeasonalTasks;
}

interface SeasonalTasks {
  spring: string[];
  summer: string[];
  autumn: string[];
  winter: string[];
}

interface ClimateGuidance {
  heatTolerant: string[];
  floodResilient: string[];
  windProtection: string[];
  futureProofing: string[];
}

interface LandscapeAssessment {
  summary: LandscapeSummary;
  plantingScheme: PlantingScheme;
  gardenZones: GardenZones;
  sustainableLandscaping: SustainableLandscaping;
  conservationGuidance: ConservationLandscape;
  planningRequirements: PlanningLandscape;
  costs: LandscapeCosts;
  contacts: LandscapeContact[];
  nextSteps: string[];
}

interface LandscapeSummary {
  gardenType: string;
  designApproach: string;
  keyOpportunities: string[];
  constraints: string[];
  biodiversityPotential: string;
}

interface ConservationLandscape {
  applicable: boolean;
  traditionalPlanting: string[];
  appropriateStyles: string[];
  inappropriateFeatures: string[];
  heritageConsiderations: string[];
}

interface PlanningLandscape {
  conditionsLikely: string[];
  documentsRequired: string[];
  treeSurveyRequired: boolean;
  landscapePlanRequired: boolean;
}

interface LandscapeCosts {
  softLandscaping: CostItem;
  trees: CostItem;
  hedging: CostItem;
  turfing: CostItem;
  irrigation: CostItem;
  professional: CostItem;
}

interface CostItem {
  item: string;
  costRange: string;
  notes: string;
}

interface LandscapeContact {
  organization: string;
  service: string;
  phone?: string;
  email?: string;
  website?: string;
}

// =============================================================================
// CONSTANTS
// =============================================================================

const NATIVE_TREES = {
  small: [
    { name: 'Crab Apple', latin: 'Malus sylvestris', height: '8-10m', spread: '6-8m' },
    { name: 'Rowan', latin: 'Sorbus aucuparia', height: '8-12m', spread: '5-7m' },
    { name: 'Hawthorn', latin: 'Crataegus monogyna', height: '6-10m', spread: '6-8m' },
    { name: 'Field Maple', latin: 'Acer campestre', height: '10-12m', spread: '8-10m' }
  ],
  medium: [
    { name: 'Silver Birch', latin: 'Betula pendula', height: '15-20m', spread: '8-10m' },
    { name: 'Wild Cherry', latin: 'Prunus avium', height: '15-20m', spread: '10-12m' },
    { name: 'Hornbeam', latin: 'Carpinus betulus', height: '15-20m', spread: '10-15m' }
  ],
  large: [
    { name: 'English Oak', latin: 'Quercus robur', height: '20-30m', spread: '20-25m' },
    { name: 'Beech', latin: 'Fagus sylvatica', height: '25-30m', spread: '15-20m' },
    { name: 'Small-leaved Lime', latin: 'Tilia cordata', height: '20-25m', spread: '12-15m' }
  ]
};

const WILDLIFE_PLANTS = {
  pollinators: ['Lavender', 'Buddleia', 'Verbena bonariensis', 'Sedum', 'Echinops'],
  birds: ['Pyracantha', 'Cotoneaster', 'Holly', 'Elder', 'Hawthorn'],
  hedgehogs: ['Native hedging with gaps', 'Ground cover plants', 'Log piles']
};

// =============================================================================
// MAIN SERVICE FUNCTION
// =============================================================================

async function assessLandscapeDesign(
  address: string,
  postcode: string,
  projectType: string,
  projectDetails: LandscapeProject = {}
): Promise<LandscapeAssessment> {
  const isConservation = projectDetails.conservationArea !== false;
  
  const summary = generateSummary(projectType, projectDetails, isConservation);
  const plantingScheme = generatePlantingScheme(projectDetails);
  const gardenZones = assessGardenZones(projectDetails, isConservation);
  const sustainableLandscaping = generateSustainableGuidance(projectDetails);
  const conservationGuidance = generateConservationGuidance(isConservation);
  const planningRequirements = determinePlanningRequirements(projectType, projectDetails);
  const costs = estimateCosts(projectDetails);
  const contacts = getContacts();
  const nextSteps = generateNextSteps(projectType);

  return {
    summary,
    plantingScheme,
    gardenZones,
    sustainableLandscaping,
    conservationGuidance,
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
  projectDetails: LandscapeProject,
  isConservation: boolean
): LandscapeSummary {
  const totalGarden = (projectDetails.frontGardenSize || 0) + 
                      (projectDetails.rearGardenSize || 0) + 
                      (projectDetails.sideGardenSize || 0);

  const keyOpportunities: string[] = [];
  const constraints: string[] = [];

  if (totalGarden > 100) {
    keyOpportunities.push('Generous garden space for diverse planting');
  }

  if (projectDetails.aspect === 'south') {
    keyOpportunities.push('South-facing aspect - wide plant choice');
  } else if (projectDetails.aspect === 'north') {
    constraints.push('North-facing - select shade-tolerant species');
  }

  if (projectDetails.existingTrees && projectDetails.existingTrees > 0) {
    constraints.push('Existing trees to protect and incorporate');
  }

  if (isConservation) {
    constraints.push('Conservation area - traditional planting styles preferred');
  }

  return {
    gardenType: totalGarden > 200 ? 'Large garden' : totalGarden > 100 ? 'Medium garden' : 'Small/courtyard garden',
    designApproach: isConservation ? 'Traditional/heritage style recommended' : 'Contemporary or traditional styles appropriate',
    keyOpportunities,
    constraints,
    biodiversityPotential: projectDetails.proposedTrees && projectDetails.proposedTrees > 2 
      ? 'High potential for biodiversity gains' 
      : 'Moderate potential with appropriate planting'
  };
}

// =============================================================================
// PLANTING SCHEME
// =============================================================================

function generatePlantingScheme(projectDetails: LandscapeProject): PlantingScheme {
  const shade = projectDetails.shade || 'mixed';
  const maintenanceLevel = projectDetails.maintenanceLevel || 'medium';

  return {
    trees: getTreeRecommendations(projectDetails),
    shrubs: getShrubRecommendations(shade, maintenanceLevel),
    perennials: getPerennialRecommendations(shade, maintenanceLevel),
    groundCover: getGroundCoverRecommendations(shade),
    climbers: getClimberRecommendations(shade),
    hedging: getHedgingRecommendations(projectDetails),
    bulbs: getBulbRecommendations(shade)
  };
}

function getTreeRecommendations(projectDetails: LandscapeProject): TreeRecommendation[] {
  const rearGarden = projectDetails.rearGardenSize || 50;
  const recommendations: TreeRecommendation[] = [];

  // Always recommend at least one tree
  recommendations.push({
    name: 'Crab Apple',
    latinName: 'Malus sylvestris',
    matureHeight: '8-10m',
    spread: '6-8m',
    growthRate: 'Medium',
    suitability: 'Excellent for small to medium gardens',
    benefits: ['Spring blossom', 'Autumn fruit for wildlife', 'Native species', 'Compact form'],
    conservation: true,
    nativePlant: true,
    maintenanceNeeds: 'Minimal pruning required',
    soilRequirements: 'Tolerates most soils',
    lightRequirements: 'Full sun to partial shade'
  });

  if (rearGarden > 100) {
    recommendations.push({
      name: 'Silver Birch',
      latinName: 'Betula pendula',
      matureHeight: '15-20m',
      spread: '8-10m',
      growthRate: 'Fast',
      suitability: 'Elegant specimen tree for medium gardens',
      benefits: ['Year-round interest', 'Native species', 'Wildlife friendly', 'Light canopy'],
      conservation: true,
      nativePlant: true,
      maintenanceNeeds: 'Low maintenance',
      soilRequirements: 'Prefers moist, well-drained soil',
      lightRequirements: 'Full sun'
    });
  }

  recommendations.push({
    name: 'Amelanchier lamarckii',
    latinName: 'Amelanchier lamarckii',
    matureHeight: '6-8m',
    spread: '4-6m',
    growthRate: 'Medium',
    suitability: 'Perfect for small gardens, multi-stem option',
    benefits: ['Spring blossom', 'Autumn color', 'Berries for birds', 'Multi-season interest'],
    conservation: true,
    nativePlant: false,
    maintenanceNeeds: 'Very low maintenance',
    soilRequirements: 'Prefers acid to neutral soil',
    lightRequirements: 'Full sun to partial shade'
  });

  return recommendations;
}

function getShrubRecommendations(shade: string, maintenance: string): PlantRecommendation[] {
  const shrubs: PlantRecommendation[] = [];

  // Evergreen backbone
  shrubs.push({
    name: 'Box (Buxus)',
    latinName: 'Buxus sempervirens',
    height: '1-3m',
    spread: '1-2m',
    suitability: 'Traditional hedging and topiary',
    benefits: ['Evergreen structure', 'Traditional appearance', 'Formal or informal'],
    maintenanceLevel: 'Medium (clipping required)',
    nativePlant: true
  });

  shrubs.push({
    name: 'Lavender',
    latinName: 'Lavandula angustifolia',
    height: '40-60cm',
    spread: '40-60cm',
    floweringSeason: 'June-August',
    suitability: 'Sunny borders, path edging',
    benefits: ['Fragrant', 'Pollinator friendly', 'Drought tolerant', 'Evergreen'],
    maintenanceLevel: 'Low',
    nativePlant: false
  });

  if (shade !== 'full_sun') {
    shrubs.push({
      name: 'Hydrangea',
      latinName: 'Hydrangea macrophylla',
      height: '1-2m',
      spread: '1.5-2m',
      floweringSeason: 'July-September',
      suitability: 'Part shade to shade borders',
      benefits: ['Large blooms', 'Long flowering', 'Good for cutting'],
      maintenanceLevel: 'Low',
      nativePlant: false
    });
  }

  shrubs.push({
    name: 'Viburnum tinus',
    latinName: 'Viburnum tinus',
    height: '2-3m',
    spread: '2-3m',
    floweringSeason: 'November-April',
    suitability: 'Winter interest, screening',
    benefits: ['Winter flowers', 'Evergreen', 'Wildlife friendly'],
    maintenanceLevel: 'Very low',
    nativePlant: false
  });

  return shrubs;
}

function getPerennialRecommendations(shade: string, maintenance: string): PlantRecommendation[] {
  const perennials: PlantRecommendation[] = [];

  if (shade !== 'full_shade') {
    perennials.push({
      name: 'Salvia nemorosa',
      latinName: 'Salvia nemorosa',
      height: '40-50cm',
      spread: '30-40cm',
      floweringSeason: 'June-September',
      suitability: 'Sunny borders',
      benefits: ['Long flowering', 'Pollinator magnet', 'Drought tolerant'],
      maintenanceLevel: 'Low',
      nativePlant: false
    });

    perennials.push({
      name: 'Echinacea',
      latinName: 'Echinacea purpurea',
      height: '60-90cm',
      spread: '40-50cm',
      floweringSeason: 'July-September',
      suitability: 'Sunny borders, prairie style',
      benefits: ['Long flowering', 'Wildlife friendly', 'Winter seed heads'],
      maintenanceLevel: 'Low',
      nativePlant: false
    });
  }

  if (shade !== 'full_sun') {
    perennials.push({
      name: 'Geranium',
      latinName: 'Geranium x magnificum',
      height: '40-60cm',
      spread: '60-80cm',
      floweringSeason: 'May-July',
      suitability: 'Part shade borders, ground cover',
      benefits: ['Reliable performer', 'Ground cover', 'Good foliage'],
      maintenanceLevel: 'Very low',
      nativePlant: false
    });

    perennials.push({
      name: 'Astrantia',
      latinName: 'Astrantia major',
      height: '60-80cm',
      spread: '40-50cm',
      floweringSeason: 'June-August',
      suitability: 'Part shade, cottage style',
      benefits: ['Delicate flowers', 'Good for cutting', 'Self-seeds gently'],
      maintenanceLevel: 'Low',
      nativePlant: true
    });
  }

  return perennials;
}

function getGroundCoverRecommendations(shade: string): PlantRecommendation[] {
  const groundCover: PlantRecommendation[] = [];

  groundCover.push({
    name: 'Pachysandra',
    latinName: 'Pachysandra terminalis',
    height: '20-30cm',
    spread: 'Spreading',
    suitability: 'Shade under trees',
    benefits: ['Evergreen', 'Suppresses weeds', 'Low maintenance'],
    maintenanceLevel: 'Very low',
    nativePlant: false
  });

  if (shade !== 'full_shade') {
    groundCover.push({
      name: 'Sedum',
      latinName: 'Sedum spectabile',
      height: '30-50cm',
      spread: '40-60cm',
      floweringSeason: 'August-October',
      suitability: 'Sunny, dry areas',
      benefits: ['Drought tolerant', 'Late flowers for pollinators', 'Architectural'],
      maintenanceLevel: 'Very low',
      nativePlant: false
    });
  }

  return groundCover;
}

function getClimberRecommendations(shade: string): PlantRecommendation[] {
  const climbers: PlantRecommendation[] = [];

  climbers.push({
    name: 'Climbing Hydrangea',
    latinName: 'Hydrangea anomala petiolaris',
    height: '10-12m',
    spread: 'Self-clinging',
    floweringSeason: 'June-July',
    suitability: 'North or east facing walls',
    benefits: ['Shade tolerant', 'Self-clinging', 'White flowers'],
    maintenanceLevel: 'Low',
    nativePlant: false
  });

  if (shade !== 'full_shade') {
    climbers.push({
      name: 'Star Jasmine',
      latinName: 'Trachelospermum jasminoides',
      height: '6-8m',
      spread: 'With support',
      floweringSeason: 'June-August',
      suitability: 'Sheltered south/west facing walls',
      benefits: ['Fragrant', 'Evergreen', 'Elegant'],
      maintenanceLevel: 'Low',
      nativePlant: false
    });

    climbers.push({
      name: 'Wisteria',
      latinName: 'Wisteria sinensis',
      height: '10m+',
      spread: 'With support',
      floweringSeason: 'May-June',
      suitability: 'South/west facing walls, pergolas',
      benefits: ['Spectacular flowers', 'Fragrant', 'Traditional'],
      maintenanceLevel: 'Medium (pruning required)',
      nativePlant: false
    });
  }

  return climbers;
}

function getHedgingRecommendations(projectDetails: LandscapeProject): HedgingRecommendation[] {
  const hedging: HedgingRecommendation[] = [];
  const isConservation = projectDetails.conservationArea !== false;

  hedging.push({
    name: 'Yew',
    latinName: 'Taxus baccata',
    matureHeight: '1-4m (clipped)',
    trimFrequency: 'Once per year',
    formal: true,
    wildlife: true,
    evergreen: true,
    growthRate: 'Slow',
    suitability: 'Traditional formal hedging - ideal for conservation areas'
  });

  hedging.push({
    name: 'Hornbeam',
    latinName: 'Carpinus betulus',
    matureHeight: '2-4m',
    trimFrequency: 'Once or twice per year',
    formal: true,
    wildlife: true,
    evergreen: false,
    growthRate: 'Medium',
    suitability: 'Traditional hedging - retains leaves in winter'
  });

  if (!isConservation) {
    hedging.push({
      name: 'Photinia',
      latinName: 'Photinia x fraseri',
      matureHeight: '2-4m',
      trimFrequency: '2-3 times per year',
      formal: false,
      wildlife: false,
      evergreen: true,
      growthRate: 'Fast',
      suitability: 'Contemporary screening - red new growth'
    });
  }

  hedging.push({
    name: 'Native Mixed Hedge',
    latinName: 'Various natives',
    matureHeight: '2-3m',
    trimFrequency: 'Once per year',
    formal: false,
    wildlife: true,
    evergreen: false,
    growthRate: 'Medium to Fast',
    suitability: 'Wildlife-friendly informal hedging'
  });

  return hedging;
}

function getBulbRecommendations(shade: string): PlantRecommendation[] {
  return [
    {
      name: 'Narcissus',
      latinName: 'Narcissus varieties',
      height: '20-40cm',
      spread: '10-15cm',
      floweringSeason: 'March-April',
      suitability: 'Under trees, borders, naturalizing',
      benefits: ['Early spring color', 'Reliable', 'Naturalizes well'],
      maintenanceLevel: 'Very low',
      nativePlant: true
    },
    {
      name: 'Alliums',
      latinName: 'Allium varieties',
      height: '60-120cm',
      spread: '15-20cm',
      floweringSeason: 'May-June',
      suitability: 'Sunny borders',
      benefits: ['Architectural spheres', 'Pollinator friendly', 'Good with perennials'],
      maintenanceLevel: 'Very low',
      nativePlant: false
    }
  ];
}

// =============================================================================
// GARDEN ZONES
// =============================================================================

function assessGardenZones(projectDetails: LandscapeProject, isConservation: boolean): GardenZones {
  return {
    frontGarden: {
      description: 'Public-facing garden area',
      primaryPurpose: ['Welcoming entrance', 'Curb appeal', 'Address the street'],
      designPrinciples: [
        'Keep proportionate to house',
        'Frame the entrance',
        'Maintain sight lines',
        'Consider security'
      ],
      plantingStyle: isConservation ? 'Traditional formal or cottage style' : 'Contemporary or traditional',
      recommendedFeatures: [
        'Low hedging or planting at boundary',
        'Path planting',
        'Specimen shrubs',
        'Evergreen structure'
      ],
      avoidFeatures: [
        'Overgrown planting blocking windows',
        'Excessive hard landscaping',
        'Artificial grass (in conservation areas)'
      ]
    },
    rearGarden: {
      description: 'Private outdoor living space',
      primaryPurpose: ['Relaxation', 'Entertainment', 'Growing', 'Wildlife'],
      designPrinciples: [
        'Create distinct areas',
        'Balance hard and soft landscaping',
        'Consider privacy',
        'Year-round interest'
      ],
      plantingStyle: 'Personal choice - formal, cottage, contemporary, or naturalistic',
      recommendedFeatures: [
        'Lawn or meadow area',
        'Deep borders for planting',
        'Trees for structure',
        'Wildlife-friendly elements'
      ],
      avoidFeatures: [
        'Overcrowded planting',
        'High maintenance features unless committed',
        'Invasive species'
      ]
    },
    sideGarden: {
      description: 'Transitional space',
      primaryPurpose: ['Access route', 'Utility area', 'Secondary planting'],
      designPrinciples: [
        'Maximize narrow spaces',
        'Good drainage',
        'Easy maintenance access'
      ],
      plantingStyle: 'Practical and shade-tolerant',
      recommendedFeatures: [
        'Climbing plants on walls',
        'Shade-tolerant ground cover',
        'Container planting'
      ],
      avoidFeatures: [
        'Thorny plants along pathways',
        'Plants requiring full sun'
      ]
    },
    boundaries: {
      frontBoundary: [
        'Low planting to maintain street view',
        'Traditional hedging (box, yew, privet)',
        'Climbing roses on railings'
      ],
      sideBoundary: [
        'Mixed hedging for privacy',
        'Climbers on fences',
        'Espalier fruit trees'
      ],
      rearBoundary: [
        'Taller hedging or trees',
        'Mixed native hedging for wildlife',
        'Screen planting'
      ],
      neighborConsiderations: [
        'Consider shade impact on neighbors',
        'Maintain hedges on your side',
        'Discuss tall planting with neighbors'
      ]
    }
  };
}

// =============================================================================
// SUSTAINABLE LANDSCAPING
// =============================================================================

function generateSustainableGuidance(projectDetails: LandscapeProject): SustainableLandscaping {
  return {
    waterManagement: {
      droughtTolerant: [
        'Mediterranean herbs (lavender, rosemary, thyme)',
        'Ornamental grasses',
        'Sedums and succulents',
        'Silver-leaved plants'
      ],
      rainGardens: 'Create shallow depressions with moisture-loving plants to manage runoff',
      waterHarvesting: [
        'Water butts on all downpipes',
        'Underground storage tanks',
        'Grey water recycling systems'
      ],
      irrigationOptions: [
        'Drip irrigation for borders',
        'Seep hoses under mulch',
        'Smart irrigation controllers',
        'Rainwater-fed systems'
      ]
    },
    wildlifeFriendly: {
      pollinatorPlanting: [
        'Plant in drifts for visual impact',
        'Provide continuous flowering season',
        'Include night-scented plants for moths',
        'Avoid double flowers (less pollen/nectar)'
      ],
      birdFriendly: [
        'Berry-producing shrubs',
        'Seed heads left over winter',
        'Dense hedging for nesting',
        'Native trees'
      ],
      hedgehogAccess: [
        'Create 13cm gaps in fences',
        'Avoid netting at ground level',
        'Log piles and leaf heaps',
        'Wild corners'
      ],
      pondFeatures: 'Even small water features support amphibians, insects, and birds',
      bugHotels: 'Provide habitat for solitary bees and beneficial insects'
    },
    lowMaintenance: {
      strategies: [
        'Choose plants suited to conditions',
        'Mulch all bare soil',
        'Use ground cover to suppress weeds',
        'Reduce lawn area or convert to meadow',
        'Group plants by water needs'
      ],
      timeCommitment: 'Well-designed low maintenance garden: 2-4 hours per month average',
      seasonalTasks: {
        spring: ['Mulching', 'Pruning spring shrubs after flowering', 'Dividing perennials'],
        summer: ['Deadheading', 'Watering in dry spells', 'Hedge trimming'],
        autumn: ['Planting trees and shrubs', 'Leaf clearing', 'Bulb planting'],
        winter: ['Structural pruning', 'Planning', 'Protecting tender plants']
      }
    },
    climateResilience: {
      heatTolerant: [
        'Mediterranean plants',
        'Silver-leaved varieties',
        'Deep-rooted perennials'
      ],
      floodResilient: [
        'Rain gardens and swales',
        'Permeable surfaces',
        'Bog garden areas'
      ],
      windProtection: [
        'Shelter belt planting',
        'Deciduous hedges (filter wind)',
        'Avoiding wind tunnels'
      ],
      futureProofing: [
        'Plant diversity for resilience',
        'Consider warmer climate plants',
        'Build in flexibility for change'
      ]
    }
  };
}

// =============================================================================
// CONSERVATION GUIDANCE
// =============================================================================

function generateConservationGuidance(isConservation: boolean): ConservationLandscape {
  if (!isConservation) {
    return {
      applicable: false,
      traditionalPlanting: [],
      appropriateStyles: [],
      inappropriateFeatures: [],
      heritageConsiderations: []
    };
  }

  return {
    applicable: true,
    traditionalPlanting: [
      'Native trees and shrubs',
      'Traditional roses (old varieties)',
      'Box hedging',
      'Lavender and other traditional herbs',
      'Cottage garden perennials',
      'Traditional spring bulbs'
    ],
    appropriateStyles: [
      'Formal traditional gardens',
      'Cottage garden style',
      'Arts and Crafts influenced',
      'Naturalistic native planting'
    ],
    inappropriateFeatures: [
      'Artificial grass',
      'Excessive hard landscaping',
      'Non-traditional paving materials',
      'Tropical or exotic planting schemes',
      'Illuminated water features',
      'Contemporary metal sculptures (in traditional settings)'
    ],
    heritageConsiderations: [
      'Research historical garden layouts',
      'Retain mature trees and shrubs',
      'Respect original garden structure',
      'Use period-appropriate materials',
      'Consider views from and to the property'
    ]
  };
}

// =============================================================================
// PLANNING REQUIREMENTS
// =============================================================================

function determinePlanningRequirements(
  projectType: string,
  projectDetails: LandscapeProject
): PlanningLandscape {
  return {
    conditionsLikely: [
      'Hard and soft landscaping scheme to be submitted',
      'Implementation within first planting season',
      'Replacement of failed planting within 5 years'
    ],
    documentsRequired: [
      'Landscape plan showing all planting',
      'Plant schedule with species, sizes, and quantities',
      'Maintenance schedule'
    ],
    treeSurveyRequired: Boolean(projectDetails.existingTrees && projectDetails.existingTrees > 0),
    landscapePlanRequired: true
  };
}

// =============================================================================
// COST ESTIMATES
// =============================================================================

function estimateCosts(projectDetails: LandscapeProject): LandscapeCosts {
  return {
    softLandscaping: {
      item: 'Border planting (supply and plant)',
      costRange: '£80-150 per m²',
      notes: 'Varies with plant density and species'
    },
    trees: {
      item: 'Trees (semi-mature, planted)',
      costRange: '£200-800 each',
      notes: 'Size dependent - larger specimens more expensive'
    },
    hedging: {
      item: 'Hedging (supply and plant)',
      costRange: '£30-80 per linear meter',
      notes: 'Depends on species and size'
    },
    turfing: {
      item: 'Lawn turf (supply and lay)',
      costRange: '£15-25 per m²',
      notes: 'Including preparation'
    },
    irrigation: {
      item: 'Irrigation system',
      costRange: '£1,500-5,000',
      notes: 'Full garden system'
    },
    professional: {
      item: 'Garden design service',
      costRange: '£1,500-5,000+',
      notes: 'Concept to planting plan'
    }
  };
}

// =============================================================================
// CONTACTS
// =============================================================================

function getContacts(): LandscapeContact[] {
  return [
    {
      organization: 'Society of Garden Designers',
      service: 'Find a registered garden designer',
      website: 'https://www.sgd.org.uk'
    },
    {
      organization: 'Royal Horticultural Society',
      service: 'Plant advice and garden guidance',
      phone: '020 3176 5800',
      website: 'https://www.rhs.org.uk'
    },
    {
      organization: 'Camden Council Trees Team',
      service: 'Tree-related queries and TPO advice',
      phone: '020 7974 4444',
      email: 'trees@camden.gov.uk'
    }
  ];
}

// =============================================================================
// NEXT STEPS
// =============================================================================

function generateNextSteps(projectType: string): string[] {
  return [
    'Survey existing garden features and conditions',
    'Consider your requirements and budget',
    'Engage a garden designer or develop your own plan',
    'Prepare soil and improve drainage if needed',
    'Source plants from reputable nurseries',
    'Plant trees and shrubs in dormant season (Oct-Mar)',
    'Install irrigation if required',
    'Mulch all planted areas',
    'Establish maintenance routine'
  ];
}

// =============================================================================
// EXPORTS
// =============================================================================

const landscapeDesign = {
  assessLandscapeDesign,
  NATIVE_TREES,
  WILDLIFE_PLANTS
};

export default landscapeDesign;
