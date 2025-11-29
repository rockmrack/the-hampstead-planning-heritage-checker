/**
 * Site Constraints Service
 * Comprehensive site analysis including flood risk, contamination,
 * rights of way, easements, and other development constraints
 */

// Types
type ConstraintSeverity = 'prohibitive' | 'major' | 'moderate' | 'minor';

interface SiteConstraint {
  type: string;
  category: string;
  severity: ConstraintSeverity;
  description: string;
  mitigation: string[];
  costImpact: { min: number; max: number };
  timeImpact: string;
  planningImplication: string;
}

interface FloodRisk {
  zone: number; // 1, 2, or 3
  riskLevel: 'low' | 'medium' | 'high' | 'very_high';
  fluvial: boolean;
  surface: boolean;
  groundwater: boolean;
  requirements: string[];
}

interface GroundConditions {
  geology: string;
  riskOfSubsidence: 'low' | 'medium' | 'high';
  shrinkableClay: boolean;
  madeGround: boolean;
  contamination: 'unlikely' | 'possible' | 'likely';
  requirements: string[];
}

interface SiteReport {
  address: string;
  postcode: string;
  constraints: SiteConstraint[];
  floodRisk: FloodRisk;
  groundConditions: GroundConditions;
  totalCostImpact: { min: number; max: number };
  developability: 'high' | 'moderate' | 'constrained' | 'very_constrained';
  recommendations: string[];
}

// Constraint types database
const CONSTRAINT_TYPES: Record<string, Omit<SiteConstraint, 'type'>> = {
  flood_zone_3: {
    category: 'Flood Risk',
    severity: 'major',
    description: 'High probability of flooding (1 in 100 years or greater)',
    mitigation: [
      'Flood Risk Assessment required',
      'Sequential and Exception Tests may apply',
      'Floor levels raised, flood resilient construction',
    ],
    costImpact: { min: 10000, max: 50000 },
    timeImpact: '2-4 months additional',
    planningImplication: 'FRA required, may be refused if fails Sequential Test',
  },
  flood_zone_2: {
    category: 'Flood Risk',
    severity: 'moderate',
    description: 'Medium probability of flooding (1 in 1000 years)',
    mitigation: [
      'Flood Risk Assessment for sensitive uses',
      'Flood resilient design recommended',
    ],
    costImpact: { min: 3000, max: 15000 },
    timeImpact: '1-2 months additional',
    planningImplication: 'FRA may be required for vulnerable development',
  },
  surface_water_risk: {
    category: 'Flood Risk',
    severity: 'moderate',
    description: 'Risk of surface water flooding',
    mitigation: [
      'SuDS (sustainable drainage) required',
      'Permeable surfaces',
      'Rainwater harvesting',
    ],
    costImpact: { min: 5000, max: 20000 },
    timeImpact: '1 month additional',
    planningImplication: 'Drainage strategy required',
  },
  shrinkable_clay: {
    category: 'Ground Conditions',
    severity: 'moderate',
    description: 'London Clay susceptible to shrink-swell',
    mitigation: [
      'Foundation design to account for movement',
      'Tree proximity assessment',
      'Deeper foundations may be required',
    ],
    costImpact: { min: 5000, max: 25000 },
    timeImpact: '2-4 weeks additional',
    planningImplication: 'Building Control require foundation design',
  },
  made_ground: {
    category: 'Ground Conditions',
    severity: 'moderate',
    description: 'Previously developed or filled land',
    mitigation: [
      'Ground investigation required',
      'Piled or reinforced foundations',
      'Gas protection measures may be needed',
    ],
    costImpact: { min: 10000, max: 40000 },
    timeImpact: '1-2 months additional',
    planningImplication: 'Contamination assessment may be conditioned',
  },
  potential_contamination: {
    category: 'Ground Conditions',
    severity: 'major',
    description: 'Historical land use suggests possible contamination',
    mitigation: [
      'Phase 1 desk study',
      'Phase 2 site investigation if required',
      'Remediation strategy',
    ],
    costImpact: { min: 8000, max: 100000 },
    timeImpact: '2-6 months additional',
    planningImplication: 'Contamination conditions likely on permission',
  },
  public_right_of_way: {
    category: 'Access Rights',
    severity: 'major',
    description: 'Public footpath or bridleway crosses site',
    mitigation: [
      'Diversion order application',
      'Design around existing route',
      'Temporary closure during construction',
    ],
    costImpact: { min: 5000, max: 30000 },
    timeImpact: '3-6 months for diversion',
    planningImplication: 'Must address in application, may need separate order',
  },
  private_easement: {
    category: 'Access Rights',
    severity: 'moderate',
    description: 'Third party rights over land (drainage, access, etc.)',
    mitigation: [
      'Identify from title documents',
      'Negotiate with beneficiary',
      'Design to avoid interference',
    ],
    costImpact: { min: 2000, max: 20000 },
    timeImpact: '1-3 months',
    planningImplication: 'May affect layout, not normally a planning matter',
  },
  restrictive_covenant: {
    category: 'Legal',
    severity: 'moderate',
    description: 'Private restrictions on land use',
    mitigation: [
      'Insurance against breach',
      'Apply for modification/discharge',
      'Negotiate release with beneficiary',
    ],
    costImpact: { min: 1000, max: 15000 },
    timeImpact: '1-6 months',
    planningImplication: 'Separate from planning but affects deliverability',
  },
  tree_preservation_order: {
    category: 'Environmental',
    severity: 'moderate',
    description: 'Protected trees on or adjacent to site',
    mitigation: [
      'Arboricultural assessment (BS5837)',
      'Tree protection plan',
      'Design around root protection areas',
    ],
    costImpact: { min: 2000, max: 15000 },
    timeImpact: '1-2 months',
    planningImplication: 'Tree officer consultation, TPO consent if works needed',
  },
  listed_building_curtilage: {
    category: 'Heritage',
    severity: 'major',
    description: 'Within curtilage of a listed building',
    mitigation: [
      'Heritage assessment',
      'Sensitive design response',
      'Listed Building Consent required',
    ],
    costImpact: { min: 5000, max: 25000 },
    timeImpact: '2-4 months additional',
    planningImplication: 'LBC required for works affecting setting',
  },
  archaeological_priority: {
    category: 'Heritage',
    severity: 'moderate',
    description: 'Area of archaeological significance',
    mitigation: [
      'Desk-based assessment',
      'Trial trenching may be required',
      'Watching brief during construction',
    ],
    costImpact: { min: 3000, max: 30000 },
    timeImpact: '1-3 months',
    planningImplication: 'GLAAS consultation, conditions likely',
  },
  aircraft_safeguarding: {
    category: 'Aviation',
    severity: 'minor',
    description: 'Within airport safeguarding zone',
    mitigation: [
      'Height restrictions apply',
      'Crane notifications required',
      'Lighting restrictions may apply',
    ],
    costImpact: { min: 500, max: 2000 },
    timeImpact: '2-4 weeks',
    planningImplication: 'Consultation with airport operator',
  },
  utilities_easement: {
    category: 'Utilities',
    severity: 'moderate',
    description: 'Underground services with protected corridors',
    mitigation: [
      'Utility searches',
      'Build-over agreements',
      'Diversion if unavoidable',
    ],
    costImpact: { min: 2000, max: 50000 },
    timeImpact: '2-4 months for diversions',
    planningImplication: 'May affect layout, drainage connections',
  },
  party_wall_issues: {
    category: 'Legal',
    severity: 'moderate',
    description: 'Works affecting party walls or boundaries',
    mitigation: [
      'Party Wall Act notices',
      'Party Wall Award if disputed',
      'Condition surveys',
    ],
    costImpact: { min: 1500, max: 8000 },
    timeImpact: '1-3 months',
    planningImplication: 'Separate process, affects construction timeline',
  },
};

// Hampstead area geology
const AREA_GEOLOGY: Record<string, {
  geology: string;
  shrinkableClay: boolean;
  madeGround: boolean;
}> = {
  'NW3': { geology: 'London Clay / Bagshot Sand', shrinkableClay: true, madeGround: false },
  'NW6': { geology: 'London Clay', shrinkableClay: true, madeGround: false },
  'NW8': { geology: 'London Clay', shrinkableClay: true, madeGround: true },
  'NW11': { geology: 'Claygate Beds over London Clay', shrinkableClay: true, madeGround: false },
  'N2': { geology: 'London Clay', shrinkableClay: true, madeGround: false },
  'N6': { geology: 'Bagshot Sand / London Clay', shrinkableClay: true, madeGround: false },
  'N10': { geology: 'London Clay', shrinkableClay: true, madeGround: false },
};

// Service class
export class SiteConstraintsService {
  /**
   * Get site constraint report
   */
  getSiteReport(
    address: string,
    postcode: string,
    constraints: string[],
    isListed: boolean,
    inConservationArea: boolean
  ): SiteReport {
    const siteConstraints: SiteConstraint[] = [];
    
    // Process provided constraints
    for (const constraint of constraints) {
      const constraintKey = constraint.toLowerCase().replace(/ /g, '_');
      const constraintData = CONSTRAINT_TYPES[constraintKey];
      
      if (constraintData) {
        siteConstraints.push({
          type: constraint,
          ...constraintData,
        });
      }
    }
    
    // Add heritage constraints if applicable
    if (isListed) {
      const curtilageConstraint = CONSTRAINT_TYPES['listed_building_curtilage'];
      if (curtilageConstraint) {
        siteConstraints.push({
          type: 'Listed Building',
          ...curtilageConstraint,
        });
      }
    }
    
    // Get geology for area
    const parts = postcode.split(' ');
    const outcode = (parts[0] || postcode).toUpperCase();
    const geology = AREA_GEOLOGY[outcode] || {
      geology: 'London Clay',
      shrinkableClay: true,
      madeGround: false,
    };
    
    // Add ground condition constraints
    if (geology.shrinkableClay) {
      const clayConstraint = CONSTRAINT_TYPES['shrinkable_clay'];
      if (clayConstraint) {
        siteConstraints.push({
          type: 'Shrinkable Clay',
          ...clayConstraint,
        });
      }
    }
    
    // Determine flood risk (simplified - would use EA data in production)
    const floodRisk = this.assessFloodRisk(postcode);
    
    // Add flood constraints if applicable
    if (floodRisk.zone >= 2) {
      const floodKey = floodRisk.zone === 3 ? 'flood_zone_3' : 'flood_zone_2';
      const floodConstraint = CONSTRAINT_TYPES[floodKey];
      if (floodConstraint) {
        siteConstraints.push({
          type: `Flood Zone ${floodRisk.zone}`,
          ...floodConstraint,
        });
      }
    }
    
    // Ground conditions
    const groundConditions: GroundConditions = {
      geology: geology.geology,
      riskOfSubsidence: geology.shrinkableClay ? 'medium' : 'low',
      shrinkableClay: geology.shrinkableClay,
      madeGround: geology.madeGround,
      contamination: geology.madeGround ? 'possible' : 'unlikely',
      requirements: [],
    };
    
    if (geology.shrinkableClay) {
      groundConditions.requirements.push('Foundation design to account for clay shrinkage');
    }
    if (geology.madeGround) {
      groundConditions.requirements.push('Ground investigation recommended');
    }
    
    // Calculate totals
    const totalCost = siteConstraints.reduce(
      (acc, c) => ({
        min: acc.min + c.costImpact.min,
        max: acc.max + c.costImpact.max,
      }),
      { min: 0, max: 0 }
    );
    
    // Determine developability
    const prohibitiveCount = siteConstraints.filter(
      c => c.severity === 'prohibitive'
    ).length;
    const majorCount = siteConstraints.filter(
      c => c.severity === 'major'
    ).length;
    
    let developability: SiteReport['developability'] = 'high';
    if (prohibitiveCount > 0) developability = 'very_constrained';
    else if (majorCount >= 3) developability = 'very_constrained';
    else if (majorCount >= 2) developability = 'constrained';
    else if (majorCount >= 1 || siteConstraints.length >= 4) developability = 'moderate';
    
    // Build recommendations
    const recommendations: string[] = [];
    
    if (siteConstraints.length > 0) {
      recommendations.push('Commission site investigations before purchase/development');
    }
    
    if (floodRisk.zone >= 2) {
      recommendations.push('Obtain Flood Risk Assessment from drainage engineer');
    }
    
    if (groundConditions.contamination !== 'unlikely') {
      recommendations.push('Consider Phase 1 Environmental Assessment');
    }
    
    if (isListed || inConservationArea) {
      recommendations.push('Engage heritage consultant early in design process');
    }
    
    const tpoConstraints = siteConstraints.filter(
      c => c.category === 'Environmental'
    );
    if (tpoConstraints.length > 0) {
      recommendations.push('Commission BS5837 tree survey');
    }
    
    return {
      address,
      postcode,
      constraints: siteConstraints,
      floodRisk,
      groundConditions,
      totalCostImpact: totalCost,
      developability,
      recommendations,
    };
  }

  /**
   * Assess flood risk for postcode
   */
  private assessFloodRisk(postcode: string): FloodRisk {
    // Simplified assessment - would use EA API in production
    // Most of Hampstead is Zone 1 (low risk)
    const parts = postcode.split(' ');
    const outcode = (parts[0] || postcode).toUpperCase();
    
    // Some lower areas have surface water risk
    const surfaceWaterRiskAreas = ['NW6', 'NW8'];
    const hasSurfaceRisk = surfaceWaterRiskAreas.includes(outcode);
    
    return {
      zone: 1,
      riskLevel: hasSurfaceRisk ? 'medium' : 'low',
      fluvial: false,
      surface: hasSurfaceRisk,
      groundwater: false,
      requirements: hasSurfaceRisk
        ? ['Surface water drainage strategy', 'SuDS encouraged']
        : [],
    };
  }

  /**
   * Get constraint types
   */
  getConstraintTypes(): string[] {
    return Object.keys(CONSTRAINT_TYPES);
  }

  /**
   * Get constraint detail
   */
  getConstraintDetail(constraintType: string): SiteConstraint | null {
    const key = constraintType.toLowerCase().replace(/ /g, '_');
    const data = CONSTRAINT_TYPES[key];
    if (!data) return null;
    
    return {
      type: constraintType,
      ...data,
    };
  }

  /**
   * Get area geology
   */
  getAreaGeology(postcode: string): {
    geology: string;
    shrinkableClay: boolean;
    madeGround: boolean;
  } | null {
    const parts = postcode.split(' ');
    const outcode = (parts[0] || postcode).toUpperCase();
    return AREA_GEOLOGY[outcode] || null;
  }

  /**
   * Check specific constraint
   */
  checkConstraint(
    constraintType: string,
    propertyValue: number
  ): {
    constraint: SiteConstraint | null;
    valueImpact: number;
    recommendation: string;
  } {
    const constraint = this.getConstraintDetail(constraintType);
    if (!constraint) {
      return {
        constraint: null,
        valueImpact: 0,
        recommendation: 'Constraint type not recognized',
      };
    }
    
    // Calculate value impact as percentage
    const avgCost = (constraint.costImpact.min + constraint.costImpact.max) / 2;
    const valueImpact = Math.round((avgCost / propertyValue) * 100);
    
    // Generate recommendation
    let recommendation = '';
    if (constraint.severity === 'prohibitive') {
      recommendation = 'Development may not be feasible - seek specialist advice';
    } else if (constraint.severity === 'major') {
      recommendation = 'Significant cost/time impact - factor into feasibility';
    } else {
      recommendation = 'Manageable with appropriate mitigation measures';
    }
    
    return {
      constraint,
      valueImpact,
      recommendation,
    };
  }
}

// Export singleton instance
export const siteConstraintsService = new SiteConstraintsService();
