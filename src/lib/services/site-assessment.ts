/**
 * Site Assessment Service
 * Comprehensive site analysis including access, boundaries, utilities, constraints
 */

// Site assessment types
type SiteConstraint = 
  | 'flood_risk'
  | 'contamination'
  | 'subsidence'
  | 'tree_preservation'
  | 'archaeological'
  | 'access_limited'
  | 'party_wall'
  | 'rights_of_way'
  | 'restrictive_covenants'
  | 'underground_services';

type SiteOpportunity =
  | 'large_garden'
  | 'corner_plot'
  | 'double_frontage'
  | 'rear_access'
  | 'flat_site'
  | 'south_facing'
  | 'no_overlooking'
  | 'precedent_nearby';

interface SiteCharacteristics {
  plotSize: number; // sqm
  buildingFootprint: number; // sqm
  gardenSize: number; // sqm
  frontageWidth: number; // meters
  depth: number; // meters
  orientation: 'north' | 'south' | 'east' | 'west' | 'northeast' | 'northwest' | 'southeast' | 'southwest';
  topography: 'flat' | 'gentle_slope' | 'moderate_slope' | 'steep';
  existingBuilding: {
    type: string;
    age: string;
    floors: number;
    condition: 'poor' | 'fair' | 'good' | 'excellent';
  };
}

interface AccessAssessment {
  vehicularAccess: boolean;
  accessWidth: number; // meters
  onStreetParking: boolean;
  offStreetParking: number; // spaces
  constructionAccess: 'easy' | 'moderate' | 'difficult' | 'very_difficult';
  skipAccess: boolean;
  scaffoldingSpace: boolean;
  craneLiftRequired: boolean;
  neighborAgreementNeeded: boolean;
}

interface BoundaryAssessment {
  boundaries: {
    direction: 'front' | 'rear' | 'left' | 'right';
    type: 'wall' | 'fence' | 'hedge' | 'none' | 'shared';
    height: number; // meters
    ownership: 'owned' | 'neighbor' | 'shared' | 'unknown';
    condition: 'poor' | 'fair' | 'good';
  }[];
  partyWalls: {
    location: string;
    type: 'full_height' | 'partial' | 'none';
    partyWallActApplies: boolean;
  }[];
  encroachments: string[];
}

interface UtilitiesAssessment {
  electricity: {
    connection: boolean;
    capacity: 'limited' | 'standard' | 'high';
    upgradeNeeded: boolean;
  };
  gas: {
    connection: boolean;
    meterLocation: string;
  };
  water: {
    connection: boolean;
    pressure: 'low' | 'normal' | 'high';
    leadPipes: boolean;
  };
  drainage: {
    type: 'combined' | 'separate' | 'septic';
    condition: 'poor' | 'fair' | 'good';
    upgradeNeeded: boolean;
  };
  broadband: {
    available: boolean;
    fibreOptic: boolean;
    maxSpeed: number; // Mbps
  };
}

interface EnvironmentalFactors {
  floodRisk: {
    zone: 1 | 2 | 3;
    surfaceWaterRisk: 'low' | 'medium' | 'high';
    mitigationRequired: boolean;
  };
  contamination: {
    risk: 'low' | 'medium' | 'high';
    previousUse: string;
    surveyRequired: boolean;
  };
  trees: {
    protected: number;
    significant: number;
    constraints: string[];
  };
  ecology: {
    protectedSpecies: boolean;
    surveyRequired: boolean;
    constraints: string[];
  };
  ground: {
    type: 'clay' | 'sand' | 'chalk' | 'rock' | 'mixed';
    subsidence: boolean;
    radon: 'low' | 'moderate' | 'high';
  };
}

interface DevelopmentPotential {
  extensions: {
    type: string;
    feasibility: 'high' | 'medium' | 'low' | 'unlikely';
    estimatedArea: number; // sqm
    constraints: string[];
    estimatedCost: { min: number; max: number };
  }[];
  basement: {
    feasibility: 'high' | 'medium' | 'low' | 'unlikely';
    estimatedArea: number;
    constructionMethod: string;
    constraints: string[];
    estimatedCost: { min: number; max: number };
  };
  loftConversion: {
    feasibility: 'high' | 'medium' | 'low' | 'unlikely';
    estimatedArea: number;
    headHeight: boolean;
    roofType: string;
    constraints: string[];
    estimatedCost: { min: number; max: number };
  };
  outbuilding: {
    feasibility: 'high' | 'medium' | 'low' | 'unlikely';
    maxArea: number;
    constraints: string[];
    estimatedCost: { min: number; max: number };
  };
}

// Full site assessment result
interface SiteAssessment {
  address: string;
  postcode: string;
  characteristics: SiteCharacteristics;
  access: AccessAssessment;
  boundaries: BoundaryAssessment;
  utilities: UtilitiesAssessment;
  environmental: EnvironmentalFactors;
  constraints: {
    constraint: SiteConstraint;
    severity: 'low' | 'medium' | 'high';
    description: string;
    mitigation: string;
    costImplication: number;
  }[];
  opportunities: {
    opportunity: SiteOpportunity;
    benefit: string;
    valueAdd: number;
  }[];
  developmentPotential: DevelopmentPotential;
  overallScore: number; // 0-100
  recommendations: string[];
}

// Postcode-based default characteristics
const AREA_DEFAULTS: Record<string, Partial<SiteCharacteristics>> = {
  'NW3': {
    plotSize: 350,
    orientation: 'south',
    topography: 'moderate_slope',
  },
  'NW6': {
    plotSize: 250,
    orientation: 'west',
    topography: 'gentle_slope',
  },
  'NW8': {
    plotSize: 400,
    orientation: 'south',
    topography: 'flat',
  },
  'NW1': {
    plotSize: 200,
    orientation: 'east',
    topography: 'flat',
  },
  'N6': {
    plotSize: 450,
    orientation: 'southwest',
    topography: 'steep',
  },
};

export class SiteAssessmentService {
  /**
   * Perform comprehensive site assessment
   */
  assessSite(input: {
    address: string;
    postcode: string;
    propertyType: 'detached' | 'semi_detached' | 'terraced' | 'flat' | 'maisonette';
    plotSize?: number;
    gardenSize?: number;
    buildingAge?: string;
    floors?: number;
    inConservationArea: boolean;
    isListedBuilding: boolean;
    hasBasement: boolean;
    hasLoftConversion: boolean;
    knownConstraints?: SiteConstraint[];
  }): SiteAssessment {
    // Get area defaults
    const areaPrefix = this.extractAreaPrefix(input.postcode);
    const areaDefaults = AREA_DEFAULTS[areaPrefix] ?? AREA_DEFAULTS['NW3']!;
    
    // Build characteristics
    const characteristics = this.buildCharacteristics(input, areaDefaults);
    
    // Assess access
    const access = this.assessAccess(input, characteristics);
    
    // Assess boundaries
    const boundaries = this.assessBoundaries(input);
    
    // Assess utilities
    const utilities = this.assessUtilities(input);
    
    // Assess environmental factors
    const environmental = this.assessEnvironmental(input, areaPrefix);
    
    // Identify constraints
    const constraints = this.identifyConstraints(input, environmental);
    
    // Identify opportunities
    const opportunities = this.identifyOpportunities(input, characteristics);
    
    // Calculate development potential
    const developmentPotential = this.calculateDevelopmentPotential(
      input,
      characteristics,
      constraints
    );
    
    // Calculate overall score
    const overallScore = this.calculateOverallScore(
      characteristics,
      constraints,
      opportunities,
      developmentPotential
    );
    
    // Generate recommendations
    const recommendations = this.generateRecommendations(
      input,
      constraints,
      opportunities,
      developmentPotential
    );
    
    return {
      address: input.address,
      postcode: input.postcode,
      characteristics,
      access,
      boundaries,
      utilities,
      environmental,
      constraints,
      opportunities,
      developmentPotential,
      overallScore,
      recommendations,
    };
  }
  
  /**
   * Quick feasibility check
   */
  quickFeasibilityCheck(input: {
    postcode: string;
    propertyType: string;
    projectType: string;
  }): {
    feasible: boolean;
    score: number;
    keyConstraints: string[];
    keyOpportunities: string[];
  } {
    const areaPrefix = this.extractAreaPrefix(input.postcode);
    const isHighland = ['NW3', 'N6', 'N2'].includes(areaPrefix);
    
    let score = 70;
    const keyConstraints: string[] = [];
    const keyOpportunities: string[] = [];
    
    // Adjust by project type
    if (input.projectType === 'basement') {
      if (isHighland) {
        score -= 15;
        keyConstraints.push('Sloping topography may increase basement costs');
      }
      keyConstraints.push('Party Wall Act likely applies');
    }
    
    if (input.projectType === 'extension') {
      if (input.propertyType === 'terraced') {
        score -= 10;
        keyConstraints.push('Limited side extension potential');
      } else {
        keyOpportunities.push('Side extension may be possible');
      }
    }
    
    if (input.projectType === 'loft') {
      keyOpportunities.push('Loft typically adds 15-20% floor area');
      if (isHighland) {
        keyConstraints.push('Conservation area may restrict dormer design');
      }
    }
    
    // Area-specific adjustments
    if (areaPrefix === 'NW8') {
      keyOpportunities.push('Larger plot sizes common in area');
      score += 5;
    }
    
    if (['NW3', 'N6'].includes(areaPrefix)) {
      keyConstraints.push('Heritage sensitivity - design quality critical');
      score -= 5;
    }
    
    return {
      feasible: score >= 50,
      score,
      keyConstraints,
      keyOpportunities,
    };
  }
  
  /**
   * Build site characteristics
   */
  private buildCharacteristics(
    input: {
      propertyType: string;
      plotSize?: number;
      gardenSize?: number;
      buildingAge?: string;
      floors?: number;
    },
    defaults: Partial<SiteCharacteristics>
  ): SiteCharacteristics {
    const plotSize = input.plotSize ?? defaults.plotSize ?? 300;
    const gardenSize = input.gardenSize ?? Math.round(plotSize * 0.4);
    const buildingFootprint = plotSize - gardenSize;
    
    return {
      plotSize,
      buildingFootprint,
      gardenSize,
      frontageWidth: Math.round(Math.sqrt(plotSize) * 0.8),
      depth: Math.round(Math.sqrt(plotSize) * 1.2),
      orientation: defaults.orientation ?? 'south',
      topography: defaults.topography ?? 'flat',
      existingBuilding: {
        type: input.propertyType,
        age: input.buildingAge ?? 'Victorian',
        floors: input.floors ?? 2,
        condition: 'good',
      },
    };
  }
  
  /**
   * Assess site access
   */
  private assessAccess(
    input: { propertyType: string; postcode: string },
    characteristics: SiteCharacteristics
  ): AccessAssessment {
    const isTerraced = input.propertyType === 'terraced';
    
    return {
      vehicularAccess: !isTerraced,
      accessWidth: isTerraced ? 0 : 3.5,
      onStreetParking: true,
      offStreetParking: isTerraced ? 0 : 1,
      constructionAccess: isTerraced ? 'difficult' : 'moderate',
      skipAccess: !isTerraced,
      scaffoldingSpace: true,
      craneLiftRequired: characteristics.topography === 'steep',
      neighborAgreementNeeded: isTerraced,
    };
  }
  
  /**
   * Assess boundaries
   */
  private assessBoundaries(input: { propertyType: string }): BoundaryAssessment {
    const isTerraced = input.propertyType === 'terraced';
    const isSemi = input.propertyType === 'semi_detached';
    
    const boundaries: BoundaryAssessment['boundaries'] = [
      { direction: 'front', type: 'wall', height: 1.0, ownership: 'owned', condition: 'good' },
      { direction: 'rear', type: 'fence', height: 1.8, ownership: 'shared', condition: 'fair' },
    ];
    
    if (!isTerraced) {
      boundaries.push(
        { direction: 'left', type: 'fence', height: 1.8, ownership: isSemi ? 'shared' : 'owned', condition: 'fair' }
      );
    }
    
    if (!isTerraced && !isSemi) {
      boundaries.push(
        { direction: 'right', type: 'fence', height: 1.8, ownership: 'owned', condition: 'good' }
      );
    }
    
    const partyWalls: BoundaryAssessment['partyWalls'] = [];
    
    if (isTerraced) {
      partyWalls.push(
        { location: 'Left side', type: 'full_height', partyWallActApplies: true },
        { location: 'Right side', type: 'full_height', partyWallActApplies: true }
      );
    } else if (isSemi) {
      partyWalls.push(
        { location: 'Attached side', type: 'full_height', partyWallActApplies: true }
      );
    }
    
    return {
      boundaries,
      partyWalls,
      encroachments: [],
    };
  }
  
  /**
   * Assess utilities
   */
  private assessUtilities(input: { buildingAge?: string }): UtilitiesAssessment {
    const isVictorian = (input.buildingAge ?? 'Victorian').toLowerCase().includes('victorian');
    
    return {
      electricity: {
        connection: true,
        capacity: 'standard',
        upgradeNeeded: false,
      },
      gas: {
        connection: true,
        meterLocation: 'External cupboard',
      },
      water: {
        connection: true,
        pressure: 'normal',
        leadPipes: isVictorian,
      },
      drainage: {
        type: 'combined',
        condition: 'fair',
        upgradeNeeded: isVictorian,
      },
      broadband: {
        available: true,
        fibreOptic: true,
        maxSpeed: 1000,
      },
    };
  }
  
  /**
   * Assess environmental factors
   */
  private assessEnvironmental(
    input: { postcode: string; knownConstraints?: SiteConstraint[] },
    areaPrefix: string
  ): EnvironmentalFactors {
    const isHighland = ['NW3', 'N6', 'N2'].includes(areaPrefix);
    
    return {
      floodRisk: {
        zone: isHighland ? 1 : 2,
        surfaceWaterRisk: isHighland ? 'low' : 'medium',
        mitigationRequired: !isHighland,
      },
      contamination: {
        risk: 'low',
        previousUse: 'Residential',
        surveyRequired: false,
      },
      trees: {
        protected: isHighland ? 2 : 0,
        significant: 3,
        constraints: isHighland ? ['TPO trees on site or adjacent'] : [],
      },
      ecology: {
        protectedSpecies: isHighland,
        surveyRequired: isHighland,
        constraints: isHighland ? ['Bat survey may be required for roof works'] : [],
      },
      ground: {
        type: isHighland ? 'clay' : 'sand',
        subsidence: areaPrefix === 'N6',
        radon: 'low',
      },
    };
  }
  
  /**
   * Identify site constraints
   */
  private identifyConstraints(
    input: { 
      inConservationArea: boolean; 
      isListedBuilding: boolean;
      knownConstraints?: SiteConstraint[];
    },
    environmental: EnvironmentalFactors
  ): SiteAssessment['constraints'] {
    const constraints: SiteAssessment['constraints'] = [];
    
    if (input.inConservationArea) {
      constraints.push({
        constraint: 'archaeological',
        severity: 'medium',
        description: 'Conservation area - enhanced design scrutiny',
        mitigation: 'Engage conservation architect',
        costImplication: 5000,
      });
    }
    
    if (input.isListedBuilding) {
      constraints.push({
        constraint: 'archaeological',
        severity: 'high',
        description: 'Listed building - Listed Building Consent required',
        mitigation: 'Heritage impact assessment and specialist advice',
        costImplication: 15000,
      });
    }
    
    if (environmental.trees.protected > 0) {
      constraints.push({
        constraint: 'tree_preservation',
        severity: 'medium',
        description: `${environmental.trees.protected} TPO protected trees`,
        mitigation: 'Arboricultural assessment and root protection',
        costImplication: 3000,
      });
    }
    
    if (environmental.floodRisk.zone > 1) {
      constraints.push({
        constraint: 'flood_risk',
        severity: environmental.floodRisk.zone === 3 ? 'high' : 'medium',
        description: `Flood Zone ${environmental.floodRisk.zone}`,
        mitigation: 'Flood risk assessment and mitigation measures',
        costImplication: 8000,
      });
    }
    
    if (environmental.ground.subsidence) {
      constraints.push({
        constraint: 'subsidence',
        severity: 'high',
        description: 'Area prone to clay shrinkage/subsidence',
        mitigation: 'Structural survey and appropriate foundations',
        costImplication: 12000,
      });
    }
    
    // Add known constraints
    if (input.knownConstraints) {
      for (const constraint of input.knownConstraints) {
        if (!constraints.find(c => c.constraint === constraint)) {
          constraints.push({
            constraint,
            severity: 'medium',
            description: `Known constraint: ${constraint.replace('_', ' ')}`,
            mitigation: 'Professional assessment required',
            costImplication: 5000,
          });
        }
      }
    }
    
    return constraints;
  }
  
  /**
   * Identify site opportunities
   */
  private identifyOpportunities(
    input: { propertyType: string },
    characteristics: SiteCharacteristics
  ): SiteAssessment['opportunities'] {
    const opportunities: SiteAssessment['opportunities'] = [];
    
    if (characteristics.gardenSize > 150) {
      opportunities.push({
        opportunity: 'large_garden',
        benefit: 'Space for substantial extension or outbuilding',
        valueAdd: 50000,
      });
    }
    
    if (characteristics.orientation === 'south' || characteristics.orientation === 'southwest') {
      opportunities.push({
        opportunity: 'south_facing',
        benefit: 'Solar gain for extension, garden amenity',
        valueAdd: 20000,
      });
    }
    
    if (input.propertyType === 'detached') {
      opportunities.push({
        opportunity: 'no_overlooking',
        benefit: 'Reduced neighbor impact concerns',
        valueAdd: 15000,
      });
    }
    
    if (characteristics.topography === 'flat') {
      opportunities.push({
        opportunity: 'flat_site',
        benefit: 'Simpler construction, lower foundation costs',
        valueAdd: 10000,
      });
    }
    
    return opportunities;
  }
  
  /**
   * Calculate development potential
   */
  private calculateDevelopmentPotential(
    input: { 
      propertyType: string; 
      hasBasement: boolean; 
      hasLoftConversion: boolean;
      inConservationArea: boolean;
      isListedBuilding: boolean;
    },
    characteristics: SiteCharacteristics,
    constraints: SiteAssessment['constraints']
  ): DevelopmentPotential {
    const isTerraced = input.propertyType === 'terraced';
    const hasConstraints = constraints.some(c => c.severity === 'high');
    
    // Extensions
    const extensions: DevelopmentPotential['extensions'] = [];
    
    // Rear extension
    const rearArea = Math.min(characteristics.gardenSize * 0.3, 40);
    extensions.push({
      type: 'Rear Extension',
      feasibility: characteristics.gardenSize > 50 ? 'high' : 'medium',
      estimatedArea: rearArea,
      constraints: input.inConservationArea ? ['Conservation area design requirements'] : [],
      estimatedCost: { min: rearArea * 2500, max: rearArea * 4000 },
    });
    
    // Side extension (if not terraced)
    if (!isTerraced) {
      const sideArea = Math.min(characteristics.frontageWidth * 3, 25);
      extensions.push({
        type: 'Side Extension',
        feasibility: 'medium',
        estimatedArea: sideArea,
        constraints: ['Minimum 1m boundary setback typically required'],
        estimatedCost: { min: sideArea * 2200, max: sideArea * 3500 },
      });
    }
    
    // Wrap-around (detached only)
    if (input.propertyType === 'detached') {
      const wrapArea = rearArea + 20;
      extensions.push({
        type: 'Wrap-Around Extension',
        feasibility: hasConstraints ? 'low' : 'medium',
        estimatedArea: wrapArea,
        constraints: ['Complex roof design', 'Party wall considerations'],
        estimatedCost: { min: wrapArea * 2800, max: wrapArea * 4500 },
      });
    }
    
    // Basement
    const basementArea = characteristics.buildingFootprint * 0.8;
    const basementConstraints: string[] = [];
    if (input.hasBasement) basementConstraints.push('Existing basement - limited potential');
    if (characteristics.topography === 'steep') basementConstraints.push('Sloping site increases complexity');
    
    const basement = {
      feasibility: input.hasBasement ? 'unlikely' as const : 
                   input.isListedBuilding ? 'low' as const :
                   hasConstraints ? 'medium' as const : 'high' as const,
      estimatedArea: input.hasBasement ? 0 : basementArea,
      constructionMethod: characteristics.topography === 'steep' ? 'Top-down' : 'Underpinning',
      constraints: basementConstraints,
      estimatedCost: { min: basementArea * 3000, max: basementArea * 5000 },
    };
    
    // Loft conversion
    const loftArea = characteristics.buildingFootprint * 0.6;
    const loftConstraints: string[] = [];
    if (input.hasLoftConversion) loftConstraints.push('Already converted');
    if (input.inConservationArea) loftConstraints.push('Dormer design restrictions');
    
    const loftConversion = {
      feasibility: input.hasLoftConversion ? 'unlikely' as const :
                   input.isListedBuilding ? 'low' as const : 'high' as const,
      estimatedArea: input.hasLoftConversion ? 0 : loftArea,
      headHeight: true,
      roofType: 'Victorian pitched',
      constraints: loftConstraints,
      estimatedCost: { min: loftArea * 1800, max: loftArea * 2800 },
    };
    
    // Outbuilding
    const outbuildingArea = Math.min(characteristics.gardenSize * 0.5, 30);
    const outbuilding = {
      feasibility: characteristics.gardenSize > 80 ? 'high' as const : 
                   characteristics.gardenSize > 40 ? 'medium' as const : 'low' as const,
      maxArea: outbuildingArea,
      constraints: outbuildingArea > 15 ? ['May require planning permission'] : [],
      estimatedCost: { min: outbuildingArea * 1500, max: outbuildingArea * 2500 },
    };
    
    return {
      extensions,
      basement,
      loftConversion,
      outbuilding,
    };
  }
  
  /**
   * Calculate overall development score
   */
  private calculateOverallScore(
    characteristics: SiteCharacteristics,
    constraints: SiteAssessment['constraints'],
    opportunities: SiteAssessment['opportunities'],
    potential: DevelopmentPotential
  ): number {
    let score = 60; // Base score
    
    // Add for opportunities
    score += opportunities.length * 5;
    
    // Subtract for constraints
    for (const constraint of constraints) {
      if (constraint.severity === 'high') score -= 10;
      else if (constraint.severity === 'medium') score -= 5;
      else score -= 2;
    }
    
    // Add for development potential
    const highFeasibility = [
      ...potential.extensions.filter(e => e.feasibility === 'high'),
      potential.basement.feasibility === 'high' ? 1 : 0,
      potential.loftConversion.feasibility === 'high' ? 1 : 0,
    ].length;
    
    score += highFeasibility * 5;
    
    // Adjust for plot size
    if (characteristics.plotSize > 400) score += 5;
    if (characteristics.plotSize < 150) score -= 10;
    
    return Math.max(20, Math.min(95, score));
  }
  
  /**
   * Generate recommendations
   */
  private generateRecommendations(
    input: { inConservationArea: boolean; isListedBuilding: boolean },
    constraints: SiteAssessment['constraints'],
    opportunities: SiteAssessment['opportunities'],
    potential: DevelopmentPotential
  ): string[] {
    const recommendations: string[] = [];
    
    // Best development options
    const bestExtension = potential.extensions
      .filter(e => e.feasibility === 'high' || e.feasibility === 'medium')
      .sort((a, b) => b.estimatedArea - a.estimatedArea)[0];
    
    if (bestExtension) {
      recommendations.push(
        `${bestExtension.type} offers best potential: ~${bestExtension.estimatedArea}sqm`
      );
    }
    
    if (potential.loftConversion.feasibility === 'high') {
      recommendations.push(
        `Loft conversion highly feasible: ~${potential.loftConversion.estimatedArea}sqm potential`
      );
    }
    
    if (potential.basement.feasibility === 'high') {
      recommendations.push(
        `Basement potential: ~${potential.basement.estimatedArea}sqm via ${potential.basement.constructionMethod}`
      );
    }
    
    // Constraint-based recommendations
    if (input.inConservationArea) {
      recommendations.push('Engage conservation architect for design quality');
    }
    
    if (input.isListedBuilding) {
      recommendations.push('Early engagement with conservation officer essential');
    }
    
    const highConstraints = constraints.filter(c => c.severity === 'high');
    for (const constraint of highConstraints) {
      recommendations.push(`Address ${constraint.description}: ${constraint.mitigation}`);
    }
    
    // Opportunity-based recommendations
    for (const opportunity of opportunities.slice(0, 2)) {
      recommendations.push(`Leverage ${opportunity.opportunity.replace('_', ' ')}: ${opportunity.benefit}`);
    }
    
    return recommendations.slice(0, 8);
  }
  
  /**
   * Extract area prefix from postcode
   */
  private extractAreaPrefix(postcode: string): string {
    const match = postcode.match(/^(NW\d{1,2}|N\d{1,2})/i);
    return match && match[1] ? match[1].toUpperCase() : 'NW3';
  }
}

// Export singleton instance
export const siteAssessmentService = new SiteAssessmentService();
