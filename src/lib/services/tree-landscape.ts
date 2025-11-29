/**
 * Tree and Landscape Protection Service
 * Comprehensive tree preservation and landscaping guidance
 */

// Types
export interface Tree {
  id: string;
  species: string;
  commonName: string;
  category: 'A' | 'B' | 'C' | 'U'; // BS 5837 categories
  height: number; // meters
  canopySpread: number; // meters
  rootProtectionRadius: number; // meters
  estimatedAge: number; // years
  condition: 'good' | 'fair' | 'poor';
  lifeExpectancy: 'long' | 'medium' | 'short';
  position: { lat: number; lng: number };
}

export interface TPODetails {
  reference: string;
  type: 'individual' | 'group' | 'area' | 'woodland';
  dateConfirmed: string;
  treesAffected: number;
  restrictions: string[];
  exemptions: string[];
}

export interface ConservationAreaTreeRules {
  area: string;
  notificationRequired: boolean;
  notificationPeriod: number; // days
  worksRestrictions: string[];
  recommendations: string[];
}

export interface TreeWorkApplication {
  type: 'TPO' | 'conservation_area_notification';
  works: 'fell' | 'prune' | 'crown_reduction' | 'dead_wooding' | 'pollarding';
  justification: string;
  arboriculturistRequired: boolean;
  estimatedCost: { min: number; max: number };
  processingTime: string;
  approvalLikelihood: 'high' | 'medium' | 'low';
}

export interface LandscapeDesign {
  elements: {
    type: string;
    heritageAppropriate: boolean;
    considerations: string[];
    alternatives?: string[];
  }[];
  plantingRecommendations: {
    category: string;
    species: string[];
    notes: string;
  }[];
  hardLandscaping: {
    material: string;
    appropriate: boolean;
    heritageConsiderations: string;
  }[];
}

// Tree species database for Hampstead area
const HAMPSTEAD_TREE_SPECIES = {
  native: [
    { species: 'Quercus robur', common: 'English Oak', heritageValue: 'high', growthRate: 'slow', maxHeight: 30 },
    { species: 'Fagus sylvatica', common: 'Common Beech', heritageValue: 'high', growthRate: 'medium', maxHeight: 25 },
    { species: 'Tilia cordata', common: 'Small-leaved Lime', heritageValue: 'high', growthRate: 'medium', maxHeight: 25 },
    { species: 'Taxus baccata', common: 'English Yew', heritageValue: 'high', growthRate: 'slow', maxHeight: 15 },
    { species: 'Carpinus betulus', common: 'Hornbeam', heritageValue: 'medium', growthRate: 'medium', maxHeight: 20 },
    { species: 'Acer campestre', common: 'Field Maple', heritageValue: 'medium', growthRate: 'medium', maxHeight: 15 },
    { species: 'Sorbus aucuparia', common: 'Rowan', heritageValue: 'medium', growthRate: 'fast', maxHeight: 12 },
    { species: 'Prunus avium', common: 'Wild Cherry', heritageValue: 'medium', growthRate: 'fast', maxHeight: 18 },
  ],
  established: [
    { species: 'Platanus hispanica', common: 'London Plane', heritageValue: 'high', growthRate: 'fast', maxHeight: 35 },
    { species: 'Cedrus libani', common: 'Cedar of Lebanon', heritageValue: 'high', growthRate: 'slow', maxHeight: 30 },
    { species: 'Aesculus hippocastanum', common: 'Horse Chestnut', heritageValue: 'high', growthRate: 'medium', maxHeight: 25 },
    { species: 'Magnolia grandiflora', common: 'Southern Magnolia', heritageValue: 'medium', growthRate: 'slow', maxHeight: 15 },
  ],
};

// Conservation area tree rules
const CONSERVATION_AREA_TREE_RULES: Record<string, ConservationAreaTreeRules> = {
  'hampstead': {
    area: 'Hampstead Conservation Area',
    notificationRequired: true,
    notificationPeriod: 42, // 6 weeks
    worksRestrictions: [
      'No felling without written consent or notification',
      'Crown reduction limited to 30% in single operation',
      'Replacement planting may be required',
      'Works should be carried out by qualified arborists',
    ],
    recommendations: [
      'Engage qualified arborist for assessment',
      'Provide photographic evidence with notification',
      'Consider seasonal timing for works',
      'Use native species for replacement planting',
    ],
  },
  'highgate': {
    area: 'Highgate Conservation Area',
    notificationRequired: true,
    notificationPeriod: 42,
    worksRestrictions: [
      'Historic garden trees receive special protection',
      'Works on mature specimens require detailed justification',
      'Replacement planting expected for felled trees',
    ],
    recommendations: [
      'Survey historic significance of mature trees',
      'Consult with local garden history society',
      'Consider heritage value in any works proposal',
    ],
  },
};

// TPO sample data
const SAMPLE_TPOS: TPODetails[] = [
  {
    reference: 'TPO/2021/0045',
    type: 'individual',
    dateConfirmed: '2021-05-15',
    treesAffected: 1,
    restrictions: [
      'No cutting, topping, lopping, uprooting, wilful damage or destruction',
      'Written consent required for all works',
      'Dead wooding exemption requires prior notification',
    ],
    exemptions: [
      'Emergency works for safety where imminent danger exists',
      'Dead wood removal (with notification)',
      'Works required by statutory undertakers',
    ],
  },
  {
    reference: 'TPO/2019/0123',
    type: 'group',
    dateConfirmed: '2019-08-20',
    treesAffected: 7,
    restrictions: [
      'Group integrity must be maintained',
      'Individual tree removal only with replacement requirement',
      'All works require council consent',
    ],
    exemptions: [
      'Routine maintenance under 100mm diameter',
      'Dead or dangerous tree removal with replacement',
    ],
  },
];

// Heritage-appropriate landscaping materials
const HERITAGE_LANDSCAPING = {
  paving: [
    { material: 'York stone', appropriate: true, notes: 'Traditional choice, highly recommended' },
    { material: 'Reclaimed brick pavers', appropriate: true, notes: 'Complements Victorian properties' },
    { material: 'Gravel (pea shingle)', appropriate: true, notes: 'Traditional, good for drainage' },
    { material: 'Setts (granite/sandstone)', appropriate: true, notes: 'Historic streetscape material' },
    { material: 'Resin bound gravel', appropriate: true, notes: 'Modern but acceptable' },
    { material: 'Concrete block paving', appropriate: false, notes: 'Avoid in conservation areas' },
    { material: 'Tarmac', appropriate: false, notes: 'Inappropriate for front gardens' },
  ],
  boundaries: [
    { material: 'Traditional brick walls', appropriate: true, notes: 'Match existing brick bonds' },
    { material: 'Rendered walls', appropriate: true, notes: 'Where existing character' },
    { material: 'Traditional iron railings', appropriate: true, notes: 'Victorian/Georgian properties' },
    { material: 'Native hedging (privet, beech, yew)', appropriate: true, notes: 'Highly encouraged' },
    { material: 'Close-board fencing', appropriate: false, notes: 'Avoid at front boundaries' },
    { material: 'Panel fencing', appropriate: false, notes: 'Not appropriate in heritage settings' },
  ],
  features: [
    { material: 'Traditional clay plant pots', appropriate: true, notes: 'Classic and appropriate' },
    { material: 'Cast iron furniture', appropriate: true, notes: 'Historic reproduction acceptable' },
    { material: 'Natural stone features', appropriate: true, notes: 'Indigenous stone preferred' },
    { material: 'Traditional style lighting', appropriate: true, notes: 'Avoid modern uplighting' },
  ],
};

export class TreeAndLandscapeService {
  /**
   * Assess tree protection status for a property
   */
  assessTreeProtection(postcode: string, hasTPOs: boolean): {
    protectionStatus: string;
    rules: ConservationAreaTreeRules | null;
    tpos: TPODetails[];
    generalAdvice: string[];
  } {
    // Determine if in conservation area
    const isConservation = postcode.match(/^NW(3|6|8|11)|N(2|6|10)/i);
    const area = postcode.startsWith('NW3') ? 'hampstead' : 'highgate';
    
    const rules: ConservationAreaTreeRules | null = isConservation 
      ? (CONSERVATION_AREA_TREE_RULES[area] ?? CONSERVATION_AREA_TREE_RULES['hampstead'] ?? null) 
      : null;
    const tpos = hasTPOs ? SAMPLE_TPOS : [];
    
    let protectionStatus = 'Standard Protection';
    if (hasTPOs && isConservation) {
      protectionStatus = 'Maximum Protection - TPO + Conservation Area';
    } else if (hasTPOs) {
      protectionStatus = 'TPO Protection';
    } else if (isConservation) {
      protectionStatus = 'Conservation Area Protection';
    }
    
    const generalAdvice: string[] = [
      'Always check for TPOs before planning any tree works',
      'In conservation areas, give 6 weeks notice before tree works',
      'Engage a qualified arborist for professional advice',
      'Consider the root protection area when planning construction',
    ];
    
    if (isConservation) {
      generalAdvice.push('Conservation area trees have automatic protection even without TPO');
      generalAdvice.push('Replacement planting strongly encouraged for any felling');
    }
    
    return {
      protectionStatus,
      rules,
      tpos,
      generalAdvice,
    };
  }

  /**
   * Calculate root protection area for construction
   */
  calculateRootProtectionArea(tree: Partial<Tree>): {
    rpaRadius: number;
    rpaArea: number;
    constructionConstraints: string[];
    mitigationOptions: string[];
  } {
    // BS 5837 calculation: RPA = area within 12x stem diameter
    const stemDiameter = tree.canopySpread ? tree.canopySpread * 0.1 : 0.5; // estimate
    const rpaRadius = Math.max(stemDiameter * 12, tree.canopySpread || 5);
    const rpaArea = Math.PI * Math.pow(rpaRadius, 2);
    
    const constructionConstraints = [
      `No excavation within ${rpaRadius.toFixed(1)}m of tree stem`,
      'No storage of materials within RPA',
      'No changes to ground level within RPA',
      'No compaction of soil within RPA',
      'Protective fencing required during construction',
    ];
    
    const mitigationOptions = [
      'Specialist foundation design (e.g., pile and beam)',
      'Ground protection matting for access routes',
      'Hand digging only within certain zones',
      'Arboricultural method statement required',
      'Tree protection plan to be approved by council',
    ];
    
    return {
      rpaRadius,
      rpaArea,
      constructionConstraints,
      mitigationOptions,
    };
  }

  /**
   * Generate tree work application guidance
   */
  getTreeWorkGuidance(
    works: TreeWorkApplication['works'],
    hasTPO: boolean,
    inConservationArea: boolean
  ): TreeWorkApplication {
    let type: TreeWorkApplication['type'] = 'conservation_area_notification';
    let arboriculturistRequired = false;
    let estimatedCost = { min: 0, max: 0 };
    let processingTime = '42 days';
    let approvalLikelihood: 'high' | 'medium' | 'low' = 'medium';
    let justification = '';
    
    if (hasTPO) {
      type = 'TPO';
      arboriculturistRequired = true;
      processingTime = '8 weeks';
    }
    
    switch (works) {
      case 'fell':
        arboriculturistRequired = true;
        estimatedCost = { min: 200, max: 500 };
        approvalLikelihood = 'low';
        justification = 'Felling requires strong justification - safety, disease, or unavoidable development impact';
        break;
      case 'prune':
        estimatedCost = { min: 100, max: 300 };
        approvalLikelihood = 'high';
        justification = 'Routine maintenance pruning generally approved with proper specification';
        break;
      case 'crown_reduction':
        arboriculturistRequired = true;
        estimatedCost = { min: 150, max: 400 };
        approvalLikelihood = 'medium';
        justification = 'Crown reduction should be proportionate and justified by arborist report';
        break;
      case 'dead_wooding':
        estimatedCost = { min: 75, max: 200 };
        approvalLikelihood = 'high';
        justification = 'Dead wood removal typically approved as good arboricultural practice';
        break;
      case 'pollarding':
        arboriculturistRequired = true;
        estimatedCost = { min: 200, max: 450 };
        approvalLikelihood = 'medium';
        justification = 'Pollarding only appropriate for species traditionally managed this way';
        break;
    }
    
    return {
      type,
      works,
      justification,
      arboriculturistRequired,
      estimatedCost,
      processingTime,
      approvalLikelihood,
    };
  }

  /**
   * Get heritage-appropriate landscaping design guidance
   */
  getLandscapeDesignGuidance(propertyPeriod: string, inConservationArea: boolean): LandscapeDesign {
    const elements: LandscapeDesign['elements'] = [];
    
    // Front garden guidance
    elements.push({
      type: 'Front Garden',
      heritageAppropriate: true,
      considerations: [
        'Maintain traditional garden character',
        'Avoid excessive hard landscaping',
        'Preserve existing boundary treatments',
        'Use traditional planting schemes',
      ],
      alternatives: inConservationArea ? [
        'Permeable surfaces if parking essential',
        'Retain at least 50% soft landscaping',
      ] : undefined,
    });
    
    // Boundary treatments
    elements.push({
      type: 'Boundaries',
      heritageAppropriate: true,
      considerations: [
        'Match existing boundary style',
        'Repair rather than replace where possible',
        'Traditional materials only',
        'Height restrictions in conservation areas',
      ],
    });
    
    // Planting recommendations based on period
    const plantingRecommendations: LandscapeDesign['plantingRecommendations'] = [
      {
        category: 'Trees',
        species: HAMPSTEAD_TREE_SPECIES.native.slice(0, 4).map(t => t.common),
        notes: 'Native species preferred for new planting',
      },
      {
        category: 'Hedging',
        species: ['Privet', 'Beech', 'Yew', 'Holly', 'Hornbeam'],
        notes: 'Traditional hedging maintains historic character',
      },
      {
        category: 'Climbers',
        species: ['Wisteria', 'Climbing roses', 'Clematis', 'Ivy'],
        notes: 'Appropriate for period properties, check structural impact',
      },
    ];
    
    // Hard landscaping materials
    const hardLandscaping = HERITAGE_LANDSCAPING.paving
      .filter(p => inConservationArea ? p.appropriate : true)
      .map(p => ({
        material: p.material,
        appropriate: p.appropriate,
        heritageConsiderations: p.notes,
      }));
    
    return {
      elements,
      plantingRecommendations,
      hardLandscaping,
    };
  }

  /**
   * Get recommended replacement tree species
   */
  getReplacementTreeRecommendations(
    size: 'small' | 'medium' | 'large',
    position: 'front' | 'rear' | 'boundary'
  ): { species: string; common: string; notes: string }[] {
    const allSpecies = [...HAMPSTEAD_TREE_SPECIES.native, ...HAMPSTEAD_TREE_SPECIES.established];
    let filtered = allSpecies;
    
    switch (size) {
      case 'small':
        filtered = filtered.filter(s => s.maxHeight <= 12);
        break;
      case 'medium':
        filtered = filtered.filter(s => s.maxHeight > 12 && s.maxHeight <= 20);
        break;
      case 'large':
        filtered = filtered.filter(s => s.maxHeight > 20);
        break;
    }
    
    // Prioritize by heritage value
    filtered.sort((a, b) => {
      const valueOrder: Record<string, number> = { high: 0, medium: 1, low: 2 };
      return (valueOrder[a.heritageValue] ?? 1) - (valueOrder[b.heritageValue] ?? 1);
    });
    
    return filtered.slice(0, 5).map(s => ({
      species: s.species,
      common: s.common,
      notes: `Heritage value: ${s.heritageValue}, Growth rate: ${s.growthRate}, Max height: ${s.maxHeight}m`,
    }));
  }

  /**
   * Generate comprehensive tree survey scope
   */
  generateTreeSurveyScope(developmentType: string): {
    surveyType: string;
    requirements: string[];
    deliverables: string[];
    estimatedCost: { min: number; max: number };
  } {
    const isBasement = developmentType.toLowerCase().includes('basement');
    const isExtension = developmentType.toLowerCase().includes('extension');
    
    let surveyType = 'BS 5837 Tree Survey';
    const requirements: string[] = [
      'Full tree survey to BS 5837:2012',
      'Tree constraints plan (TCP)',
      'Tree protection plan (TPP)',
      'Arboricultural impact assessment (AIA)',
    ];
    
    const deliverables: string[] = [
      'Schedule of trees with category ratings',
      'Tree constraints plan at appropriate scale',
      'Root protection areas plotted',
      'Recommendations for retained trees',
    ];
    
    let estimatedCost = { min: 800, max: 1500 };
    
    if (isBasement) {
      surveyType = 'BS 5837 Tree Survey with Basement Assessment';
      requirements.push('Root investigation survey');
      requirements.push('Structural root assessment');
      deliverables.push('Root mapping where required');
      deliverables.push('Foundation design recommendations');
      estimatedCost = { min: 1500, max: 3000 };
    }
    
    if (isExtension) {
      requirements.push('Arboricultural method statement');
      deliverables.push('Construction methodology near trees');
      estimatedCost = { min: 1000, max: 2000 };
    }
    
    return {
      surveyType,
      requirements,
      deliverables,
      estimatedCost,
    };
  }
}

export const treeAndLandscapeService = new TreeAndLandscapeService();
