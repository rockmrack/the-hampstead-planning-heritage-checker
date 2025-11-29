/**
 * Material Specification Service
 * Heritage-appropriate materials guidance for Hampstead and North London
 */

// Material categories
type MaterialCategory = 
  | 'brickwork'
  | 'stonework'
  | 'roofing'
  | 'windows'
  | 'doors'
  | 'rainwater_goods'
  | 'ironwork'
  | 'render'
  | 'timber'
  | 'flooring';

type MaterialApproval = 'preferred' | 'acceptable' | 'avoid' | 'prohibited';

// Material specification
interface MaterialSpec {
  name: string;
  category: MaterialCategory;
  approval: MaterialApproval;
  description: string;
  suppliers: string[];
  priceRange: { min: number; max: number; unit: string };
  conservationAreaSuitable: boolean;
  listedBuildingSuitable: boolean;
  traditionalAlternatives: string[];
  modernEquivalent?: string;
}

// Material palette for a project
interface MaterialPalette {
  project: {
    address: string;
    projectType: string;
    heritage: {
      isListed: boolean;
      listedGrade?: string;
      inConservationArea: boolean;
      conservationAreaName?: string;
    };
  };
  recommendations: {
    category: MaterialCategory;
    preferred: MaterialSpec[];
    acceptable: MaterialSpec[];
    avoid: MaterialSpec[];
    guidance: string;
  }[];
  localCharacter: {
    predominantMaterials: string[];
    colorPalette: string[];
    traditionalFeatures: string[];
  };
  budgetEstimate: {
    economyOption: number;
    standardOption: number;
    premiumOption: number;
  };
  sustainabilityNotes: string[];
}

// Material database
const MATERIALS_DATABASE: MaterialSpec[] = [
  // Brickwork
  {
    name: 'London Stock Brick',
    category: 'brickwork',
    approval: 'preferred',
    description: 'Traditional yellow/brown London stock brick, essential for matching historic buildings',
    suppliers: ['Ibstock', 'Wienerberger', 'Northcot', 'York Handmade'],
    priceRange: { min: 0.80, max: 2.50, unit: 'per brick' },
    conservationAreaSuitable: true,
    listedBuildingSuitable: true,
    traditionalAlternatives: ['Handmade stock brick', 'Reclaimed London stock'],
    modernEquivalent: 'Machine-made stock brick',
  },
  {
    name: 'Red Multi Stock',
    category: 'brickwork',
    approval: 'acceptable',
    description: 'Red multi-colored stock brick for Victorian properties',
    suppliers: ['Ibstock', 'Michelmersh'],
    priceRange: { min: 0.70, max: 2.00, unit: 'per brick' },
    conservationAreaSuitable: true,
    listedBuildingSuitable: true,
    traditionalAlternatives: ['Handmade red brick'],
  },
  {
    name: 'Engineering Brick',
    category: 'brickwork',
    approval: 'avoid',
    description: 'Dense engineering brick - inappropriate for visible elevations in conservation areas',
    suppliers: ['Various'],
    priceRange: { min: 0.50, max: 1.00, unit: 'per brick' },
    conservationAreaSuitable: false,
    listedBuildingSuitable: false,
    traditionalAlternatives: ['London stock brick'],
  },
  {
    name: 'Reclaimed London Stock',
    category: 'brickwork',
    approval: 'preferred',
    description: 'Salvaged original London stock bricks - best match for historic repairs',
    suppliers: ['SalvoWEB', 'LASSCO', 'Retrouvius', 'Local reclamation yards'],
    priceRange: { min: 1.20, max: 3.50, unit: 'per brick' },
    conservationAreaSuitable: true,
    listedBuildingSuitable: true,
    traditionalAlternatives: [],
  },
  
  // Roofing
  {
    name: 'Natural Welsh Slate',
    category: 'roofing',
    approval: 'preferred',
    description: 'Traditional blue-grey Welsh slate, historically accurate for Victorian properties',
    suppliers: ['Welsh Slate', 'Penrhyn Quarry', 'Cwt-y-Bugail'],
    priceRange: { min: 80, max: 150, unit: 'per sqm installed' },
    conservationAreaSuitable: true,
    listedBuildingSuitable: true,
    traditionalAlternatives: ['Reclaimed Welsh slate'],
    modernEquivalent: 'Man-made slate',
  },
  {
    name: 'Reclaimed Welsh Slate',
    category: 'roofing',
    approval: 'preferred',
    description: 'Salvaged original slate - often preferred for listed buildings',
    suppliers: ['LASSCO', 'Architectural Heritage', 'Local reclaimers'],
    priceRange: { min: 60, max: 120, unit: 'per sqm installed' },
    conservationAreaSuitable: true,
    listedBuildingSuitable: true,
    traditionalAlternatives: [],
  },
  {
    name: 'Spanish Slate',
    category: 'roofing',
    approval: 'acceptable',
    description: 'Imported natural slate - acceptable where Welsh slate cost-prohibitive',
    suppliers: ['Various importers'],
    priceRange: { min: 50, max: 90, unit: 'per sqm installed' },
    conservationAreaSuitable: true,
    listedBuildingSuitable: false,
    traditionalAlternatives: ['Welsh slate', 'Reclaimed slate'],
  },
  {
    name: 'Concrete Tile',
    category: 'roofing',
    approval: 'avoid',
    description: 'Concrete interlocking tiles - inappropriate in conservation areas',
    suppliers: ['Marley', 'Redland'],
    priceRange: { min: 30, max: 50, unit: 'per sqm installed' },
    conservationAreaSuitable: false,
    listedBuildingSuitable: false,
    traditionalAlternatives: ['Natural slate', 'Clay tiles'],
  },
  {
    name: 'Plain Clay Tile',
    category: 'roofing',
    approval: 'preferred',
    description: 'Traditional handmade or machine-made clay tiles',
    suppliers: ['Dreadnought', 'Keymer', 'Tudor Roof Tiles'],
    priceRange: { min: 70, max: 130, unit: 'per sqm installed' },
    conservationAreaSuitable: true,
    listedBuildingSuitable: true,
    traditionalAlternatives: ['Reclaimed clay tiles'],
  },
  
  // Windows
  {
    name: 'Timber Sliding Sash',
    category: 'windows',
    approval: 'preferred',
    description: 'Traditional timber box sash windows - essential for period properties',
    suppliers: ['Ventrolla', 'Mumford & Wood', 'Patchett Joinery'],
    priceRange: { min: 1200, max: 3500, unit: 'per window' },
    conservationAreaSuitable: true,
    listedBuildingSuitable: true,
    traditionalAlternatives: [],
  },
  {
    name: 'Timber Casement',
    category: 'windows',
    approval: 'preferred',
    description: 'Traditional timber casement windows',
    suppliers: ['Various joinery specialists'],
    priceRange: { min: 800, max: 2000, unit: 'per window' },
    conservationAreaSuitable: true,
    listedBuildingSuitable: true,
    traditionalAlternatives: [],
  },
  {
    name: 'Slim Profile Aluminium',
    category: 'windows',
    approval: 'acceptable',
    description: 'Slim aluminium frames - acceptable for extensions in conservation areas',
    suppliers: ['Crittall', 'IQ Glass', 'Mondrian'],
    priceRange: { min: 500, max: 1500, unit: 'per sqm' },
    conservationAreaSuitable: true,
    listedBuildingSuitable: false,
    traditionalAlternatives: ['Steel windows'],
    modernEquivalent: 'Standard aluminium',
  },
  {
    name: 'uPVC Windows',
    category: 'windows',
    approval: 'prohibited',
    description: 'Plastic windows - generally prohibited in conservation areas and listed buildings',
    suppliers: ['Various'],
    priceRange: { min: 300, max: 600, unit: 'per window' },
    conservationAreaSuitable: false,
    listedBuildingSuitable: false,
    traditionalAlternatives: ['Timber sash', 'Timber casement'],
  },
  
  // Doors
  {
    name: 'Panelled Timber Door',
    category: 'doors',
    approval: 'preferred',
    description: 'Traditional 4 or 6 panel timber entrance door',
    suppliers: ['Local joiners', 'Howdens heritage range', 'London Door Company'],
    priceRange: { min: 800, max: 3000, unit: 'per door' },
    conservationAreaSuitable: true,
    listedBuildingSuitable: true,
    traditionalAlternatives: ['Reclaimed period door'],
  },
  {
    name: 'Composite Door',
    category: 'doors',
    approval: 'avoid',
    description: 'Modern composite doors - inappropriate for period properties',
    suppliers: ['Various'],
    priceRange: { min: 400, max: 1000, unit: 'per door' },
    conservationAreaSuitable: false,
    listedBuildingSuitable: false,
    traditionalAlternatives: ['Timber panel door'],
  },
  
  // Rainwater goods
  {
    name: 'Cast Iron Guttering',
    category: 'rainwater_goods',
    approval: 'preferred',
    description: 'Traditional cast iron gutters and downpipes',
    suppliers: ['Tuscan Foundry', 'J&JW Longbottom', 'Hargreaves'],
    priceRange: { min: 80, max: 150, unit: 'per linear meter' },
    conservationAreaSuitable: true,
    listedBuildingSuitable: true,
    traditionalAlternatives: [],
  },
  {
    name: 'Aluminium Heritage Profile',
    category: 'rainwater_goods',
    approval: 'acceptable',
    description: 'Aluminium guttering in heritage profile - acceptable alternative to cast iron',
    suppliers: ['Marley', 'Brett Martin'],
    priceRange: { min: 30, max: 60, unit: 'per linear meter' },
    conservationAreaSuitable: true,
    listedBuildingSuitable: false,
    traditionalAlternatives: ['Cast iron'],
  },
  {
    name: 'uPVC Guttering',
    category: 'rainwater_goods',
    approval: 'avoid',
    description: 'Plastic guttering - avoid on visible elevations',
    suppliers: ['Various'],
    priceRange: { min: 10, max: 25, unit: 'per linear meter' },
    conservationAreaSuitable: false,
    listedBuildingSuitable: false,
    traditionalAlternatives: ['Cast iron', 'Aluminium heritage'],
  },
];

// Conservation area character palettes
const AREA_PALETTES: Record<string, { materials: string[]; colors: string[]; features: string[] }> = {
  'Hampstead': {
    materials: ['London stock brick', 'Welsh slate', 'Painted timber', 'Cast iron'],
    colors: ['Cream', 'White', 'Black', 'Dark green', 'Muted heritage colors'],
    features: ['Sash windows', 'Panelled doors', 'Iron railings', 'Brick boundary walls'],
  },
  'Hampstead Garden Suburb': {
    materials: ['Handmade brick', 'Plain clay tiles', 'Render', 'Leaded lights'],
    colors: ['White render', 'Natural brick tones', 'Green', 'Black'],
    features: ['Casement windows', 'Cottage style doors', 'Arts and Crafts details'],
  },
  'Highgate': {
    materials: ['London stock brick', 'Welsh slate', 'Painted stucco', 'Timber'],
    colors: ['Cream', 'Stone', 'White', 'Black', 'Heritage green'],
    features: ['Georgian proportions', 'Sash windows', 'Classical details'],
  },
  'Belsize': {
    materials: ['Red/yellow stock brick', 'Welsh slate', 'Painted timber', 'Terracotta'],
    colors: ['White', 'Cream', 'Heritage colors', 'Black ironwork'],
    features: ['Victorian ornament', 'Bay windows', 'Decorative ironwork'],
  },
};

export class MaterialSpecificationService {
  /**
   * Generate material palette for project
   */
  generatePalette(input: {
    address: string;
    postcode: string;
    projectType: string;
    isListedBuilding: boolean;
    listedGrade?: string;
    inConservationArea: boolean;
    conservationAreaName?: string;
    requiredCategories?: MaterialCategory[];
    budget?: 'economy' | 'standard' | 'premium';
  }): MaterialPalette {
    const categories = input.requiredCategories || this.getDefaultCategories(input.projectType);
    
    // Generate recommendations for each category
    const recommendations = categories.map(category => 
      this.getRecommendationsForCategory(
        category,
        input.isListedBuilding,
        input.inConservationArea
      )
    );
    
    // Get local character
    const localCharacter = this.getLocalCharacter(input.conservationAreaName);
    
    // Estimate budget
    const budgetEstimate = this.estimateBudget(categories, input.projectType);
    
    // Sustainability notes
    const sustainabilityNotes = this.getSustainabilityNotes(input.isListedBuilding);
    
    return {
      project: {
        address: input.address,
        projectType: input.projectType,
        heritage: {
          isListed: input.isListedBuilding,
          listedGrade: input.listedGrade,
          inConservationArea: input.inConservationArea,
          conservationAreaName: input.conservationAreaName,
        },
      },
      recommendations,
      localCharacter,
      budgetEstimate,
      sustainabilityNotes,
    };
  }
  
  /**
   * Get specific material recommendations
   */
  getMaterialRecommendation(
    category: MaterialCategory,
    isListed: boolean,
    inConservationArea: boolean
  ): MaterialSpec[] {
    return MATERIALS_DATABASE
      .filter(m => m.category === category)
      .filter(m => {
        if (isListed && !m.listedBuildingSuitable) return false;
        if (inConservationArea && !m.conservationAreaSuitable && m.approval !== 'avoid') return false;
        return true;
      })
      .sort((a, b) => {
        const order: Record<MaterialApproval, number> = { preferred: 0, acceptable: 1, avoid: 2, prohibited: 3 };
        return order[a.approval] - order[b.approval];
      });
  }
  
  /**
   * Search materials
   */
  searchMaterials(query: string): MaterialSpec[] {
    const queryLC = query.toLowerCase();
    return MATERIALS_DATABASE.filter(m =>
      m.name.toLowerCase().includes(queryLC) ||
      m.category.includes(queryLC) ||
      m.description.toLowerCase().includes(queryLC)
    );
  }
  
  /**
   * Get suppliers for material
   */
  getSuppliers(materialName: string): { material: string; suppliers: string[] } | null {
    const material = MATERIALS_DATABASE.find(
      m => m.name.toLowerCase() === materialName.toLowerCase()
    );
    
    if (!material) return null;
    
    return {
      material: material.name,
      suppliers: material.suppliers,
    };
  }
  
  /**
   * Get default categories for project type
   */
  private getDefaultCategories(projectType: string): MaterialCategory[] {
    const projectCategories: Record<string, MaterialCategory[]> = {
      'extension': ['brickwork', 'roofing', 'windows', 'doors'],
      'loft_conversion': ['roofing', 'windows', 'timber'],
      'basement': ['brickwork', 'flooring', 'windows'],
      'refurbishment': ['windows', 'doors', 'rainwater_goods', 'brickwork'],
      'new_build': ['brickwork', 'roofing', 'windows', 'doors', 'rainwater_goods'],
    };
    
    return projectCategories[projectType] ?? ['brickwork', 'roofing', 'windows', 'doors'];
  }
  
  /**
   * Get recommendations for category
   */
  private getRecommendationsForCategory(
    category: MaterialCategory,
    isListed: boolean,
    inConservationArea: boolean
  ): MaterialPalette['recommendations'][0] {
    const materials = MATERIALS_DATABASE.filter(m => m.category === category);
    
    const filtered = materials.filter(m => {
      if (isListed && !m.listedBuildingSuitable && m.approval !== 'prohibited') {
        return m.approval === 'avoid';
      }
      return true;
    });
    
    return {
      category,
      preferred: filtered.filter(m => m.approval === 'preferred'),
      acceptable: filtered.filter(m => m.approval === 'acceptable'),
      avoid: filtered.filter(m => m.approval === 'avoid' || m.approval === 'prohibited'),
      guidance: this.getGuidanceForCategory(category, isListed, inConservationArea),
    };
  }
  
  /**
   * Get guidance text for category
   */
  private getGuidanceForCategory(
    category: MaterialCategory,
    isListed: boolean,
    inConservationArea: boolean
  ): string {
    const guidance: Record<MaterialCategory, string> = {
      'brickwork': isListed 
        ? 'Match existing brick type, size, bond pattern, and mortar. Use lime mortar only.'
        : 'Match predominant local brick type and bond pattern.',
      'roofing': isListed
        ? 'Use matching natural slate or traditional materials. No modern substitutes.'
        : 'Natural slate or plain clay tiles preferred in conservation areas.',
      'windows': isListed
        ? 'Repair and upgrade existing where possible. Replacement must match original exactly.'
        : 'Timber windows preferred. Slim profile metal acceptable for new extensions.',
      'doors': 'Traditional panelled timber doors required for principal elevations.',
      'rainwater_goods': isListed
        ? 'Cast iron required on listed buildings.'
        : 'Cast iron or heritage profile aluminium acceptable.',
      'ironwork': 'Traditional forged iron or cast iron designs. Avoid galvanized steel.',
      'render': 'Lime render only on historic buildings. Match texture and finish.',
      'stonework': 'Match existing stone type, finish, and pointing.',
      'timber': 'Use sustainably sourced softwood or hardwood with appropriate finish.',
      'flooring': 'Traditional materials appropriate to building age and status.',
    };
    
    return guidance[category] ?? 'Select materials appropriate to local character.';
  }
  
  /**
   * Get local character palette
   */
  private getLocalCharacter(conservationAreaName?: string): MaterialPalette['localCharacter'] {
    if (conservationAreaName && AREA_PALETTES[conservationAreaName]) {
      const palette = AREA_PALETTES[conservationAreaName]!;
      return {
        predominantMaterials: palette.materials,
        colorPalette: palette.colors,
        traditionalFeatures: palette.features,
      };
    }
    
    // Default Hampstead palette
    const defaultPalette = AREA_PALETTES['Hampstead']!;
    return {
      predominantMaterials: defaultPalette.materials,
      colorPalette: defaultPalette.colors,
      traditionalFeatures: defaultPalette.features,
    };
  }
  
  /**
   * Estimate budget for materials
   */
  private estimateBudget(
    categories: MaterialCategory[],
    projectType: string
  ): MaterialPalette['budgetEstimate'] {
    // Base multipliers by project type
    const multipliers: Record<string, number> = {
      'extension': 50,
      'loft_conversion': 30,
      'basement': 80,
      'refurbishment': 20,
      'new_build': 100,
    };
    
    const base = multipliers[projectType] ?? 40;
    
    // Calculate based on categories
    const categoryMultiplier = categories.length / 4;
    
    return {
      economyOption: Math.round(base * 800 * categoryMultiplier),
      standardOption: Math.round(base * 1200 * categoryMultiplier),
      premiumOption: Math.round(base * 2000 * categoryMultiplier),
    };
  }
  
  /**
   * Get sustainability notes
   */
  private getSustainabilityNotes(isListed: boolean): string[] {
    const notes = [
      'Source materials locally where possible to reduce transport emissions',
      'Consider reclaimed materials for authentic character and sustainability',
      'Specify FSC certified timber from sustainable sources',
      'Choose materials with long lifespan to reduce replacement cycles',
    ];
    
    if (isListed) {
      notes.push('Traditional materials often have lower embodied carbon than modern alternatives');
      notes.push('Repair rather than replace to preserve embodied energy');
    }
    
    return notes;
  }
}

// Export singleton
export const materialSpecificationService = new MaterialSpecificationService();
