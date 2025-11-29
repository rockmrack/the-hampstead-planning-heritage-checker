/**
 * Smart Cost Estimation Engine
 * 
 * Provides detailed, area-specific cost estimates for building projects:
 * - Material costs
 * - Labour costs
 * - Professional fees
 * - Permits and fees
 * - Contingencies
 * 
 * Uses local market data and heritage-specific factors
 * 
 * @module services/cost-estimator
 */

// ===========================================
// TYPES
// ===========================================

export type ProjectCategory = 
  | 'rear_extension'
  | 'side_extension'
  | 'loft_conversion'
  | 'basement'
  | 'refurbishment'
  | 'new_build'
  | 'garage_conversion'
  | 'garden_room'
  | 'windows_doors'
  | 'kitchen'
  | 'bathroom'
  | 'general_renovation';

export type FinishLevel = 'basic' | 'standard' | 'premium' | 'luxury';

export type HeritageComplexity = 'none' | 'low' | 'medium' | 'high' | 'exceptional';

export interface CostEstimateRequest {
  projectCategory: ProjectCategory;
  dimensions: {
    area?: number; // square meters
    length?: number;
    width?: number;
    height?: number;
  };
  finishLevel: FinishLevel;
  heritageStatus: 'RED' | 'AMBER' | 'GREEN';
  heritageComplexity?: HeritageComplexity;
  postcode: string;
  borough?: string;
  includeBasement?: boolean;
  includeRoofwork?: boolean;
  structuralWork?: 'none' | 'minor' | 'major';
  existingCondition?: 'good' | 'fair' | 'poor';
  accessDifficulty?: 'easy' | 'moderate' | 'difficult';
  sustainabilityFeatures?: string[];
}

export interface CostEstimate {
  id: string;
  projectCategory: ProjectCategory;
  summary: CostSummary;
  breakdown: CostBreakdown;
  timeline: ProjectTimeline;
  heritageFactors: HeritageFactors;
  risks: CostRisk[];
  comparisons: MarketComparison;
  recommendations: string[];
  createdAt: Date;
}

export interface CostSummary {
  totalLow: number;
  totalMid: number;
  totalHigh: number;
  pricePerSqm: { low: number; mid: number; high: number };
  confidence: number;
  currency: string;
}

export interface CostBreakdown {
  construction: {
    substructure?: CostLine;
    superstructure: CostLine;
    internalWalls: CostLine;
    roofing?: CostLine;
    windows: CostLine;
    externalFinishes: CostLine;
    internalFinishes: CostLine;
    mechanical: CostLine;
    electrical: CostLine;
    plumbing?: CostLine;
  };
  professionalFees: {
    architect: CostLine;
    structuralEngineer?: CostLine;
    planningConsultant?: CostLine;
    partyWallSurveyor?: CostLine;
    buildingControlAppointment: CostLine;
    cdmPrincipalDesigner?: CostLine;
  };
  statutory: {
    planningFee: CostLine;
    buildingControlFee: CostLine;
    listedBuildingFee?: CostLine;
    partyWallAwards?: CostLine;
  };
  preliminaries: {
    siteSetup: CostLine;
    scaffolding?: CostLine;
    skip: CostLine;
    temporaryWorks?: CostLine;
    utilities: CostLine;
  };
  contingency: CostLine;
}

export interface CostLine {
  description: string;
  lowEstimate: number;
  midEstimate: number;
  highEstimate: number;
  unit?: string;
  quantity?: number;
  notes?: string;
}

export interface ProjectTimeline {
  totalWeeks: { low: number; high: number };
  phases: TimelinePhase[];
}

export interface TimelinePhase {
  name: string;
  durationWeeks: { low: number; high: number };
  dependencies?: string[];
  notes?: string;
}

export interface HeritageFactors {
  complexity: HeritageComplexity;
  additionalCostPercentage: number;
  additionalTimeWeeks: number;
  requirements: string[];
  specialistSkills: string[];
}

export interface CostRisk {
  category: string;
  description: string;
  probability: 'low' | 'medium' | 'high';
  impact: number; // £
  mitigation: string;
}

export interface MarketComparison {
  localAverage: number;
  londonAverage: number;
  nationalAverage: number;
  percentileRank: number; // Where this estimate sits in the market
  recentTrend: 'rising' | 'stable' | 'falling';
  inflationFactor: number;
}

// ===========================================
// COST DATA - LONDON SPECIFIC
// ===========================================

// Base rates per sqm for different project types (London 2024)
const BASE_RATES: Record<ProjectCategory, { basic: number; standard: number; premium: number; luxury: number }> = {
  rear_extension: { basic: 2000, standard: 2800, premium: 3500, luxury: 5000 },
  side_extension: { basic: 2200, standard: 3000, premium: 3800, luxury: 5500 },
  loft_conversion: { basic: 1800, standard: 2500, premium: 3200, luxury: 4500 },
  basement: { basic: 4500, standard: 5500, premium: 7000, luxury: 10000 },
  refurbishment: { basic: 1200, standard: 1800, premium: 2500, luxury: 4000 },
  new_build: { basic: 2800, standard: 3500, premium: 4500, luxury: 7000 },
  garage_conversion: { basic: 1000, standard: 1500, premium: 2000, luxury: 3000 },
  garden_room: { basic: 2000, standard: 2500, premium: 3500, luxury: 5000 },
  windows_doors: { basic: 800, standard: 1200, premium: 2000, luxury: 3500 },
  kitchen: { basic: 15000, standard: 25000, premium: 40000, luxury: 80000 }, // per kitchen
  bathroom: { basic: 8000, standard: 15000, premium: 25000, luxury: 50000 }, // per bathroom
  general_renovation: { basic: 800, standard: 1200, premium: 1800, luxury: 3000 },
};

// Area-specific multipliers (North London)
const AREA_MULTIPLIERS: Record<string, number> = {
  NW3: 1.25, // Hampstead - premium area
  NW1: 1.15, // Camden Town
  NW2: 1.10, // Cricklewood
  NW5: 1.15, // Kentish Town
  NW6: 1.10, // Kilburn
  NW8: 1.20, // St John's Wood
  NW11: 1.15, // Golders Green
  N2: 1.12, // East Finchley
  N6: 1.18, // Highgate
  N10: 1.12, // Muswell Hill
  N8: 1.08, // Hornsey
  N19: 1.10, // Archway
  W1: 1.35, // Mayfair
  SW1: 1.30, // Westminster
  SW3: 1.35, // Chelsea
  SW7: 1.30, // Kensington
  default: 1.00,
};

// Heritage complexity multipliers
const HERITAGE_MULTIPLIERS: Record<HeritageComplexity, number> = {
  none: 1.00,
  low: 1.10,
  medium: 1.25,
  high: 1.40,
  exceptional: 1.60,
};

// Professional fee percentages
const PROFESSIONAL_FEES = {
  architect: { low: 8, typical: 10, high: 15 },
  structuralEngineer: { low: 1500, typical: 3000, high: 6000 },
  planningConsultant: { low: 1500, typical: 3000, high: 5000 },
  partyWallSurveyor: { low: 1000, typical: 2000, high: 4000 },
  buildingControlAppointment: { low: 500, typical: 1000, high: 2000 },
};

// Statutory fees (current rates)
const STATUTORY_FEES = {
  householder: { planning: 258, listedBuilding: 0 },
  fullApplication: { planning: 528, listedBuilding: 0 },
  listedBuildingConsent: { planning: 0, listedBuilding: 0 }, // Free but requires more docs
  buildingControl: { low: 500, high: 2000 },
  partyWallAward: { low: 2000, high: 8000 }, // Per neighbour if disputed
};

// ===========================================
// COST ESTIMATOR SERVICE
// ===========================================

class CostEstimatorService {
  /**
   * Generate a detailed cost estimate
   */
  generateEstimate(request: CostEstimateRequest): CostEstimate {
    const area = request.dimensions.area || 
      (request.dimensions.length && request.dimensions.width ? 
        request.dimensions.length * request.dimensions.width : 20);
    
    // Calculate base construction cost
    const baseRate = BASE_RATES[request.projectCategory][request.finishLevel];
    const areaMultiplier = this.getAreaMultiplier(request.postcode);
    const heritageMultiplier = this.getHeritageMultiplier(request);
    const conditionMultiplier = this.getConditionMultiplier(request.existingCondition);
    const accessMultiplier = this.getAccessMultiplier(request.accessDifficulty);
    
    const adjustedRate = baseRate * areaMultiplier * heritageMultiplier * conditionMultiplier * accessMultiplier;
    
    const constructionCostMid = adjustedRate * area;
    const constructionCostLow = constructionCostMid * 0.85;
    const constructionCostHigh = constructionCostMid * 1.20;
    
    // Generate detailed breakdown
    const breakdown = this.generateBreakdown(
      request,
      constructionCostLow,
      constructionCostMid,
      constructionCostHigh,
      area
    );
    
    // Calculate totals
    const totalMid = this.sumBreakdown(breakdown, 'midEstimate');
    const totalLow = totalMid * 0.85;
    const totalHigh = totalMid * 1.25;
    
    // Heritage factors
    const heritageFactors = this.calculateHeritageFactors(request);
    
    // Timeline
    const timeline = this.generateTimeline(request, area);
    
    // Risks
    const risks = this.assessRisks(request, totalMid);
    
    // Market comparison
    const comparisons = this.getMarketComparison(request, totalMid, area);
    
    // Recommendations
    const recommendations = this.generateRecommendations(request, totalMid, heritageFactors);
    
    return {
      id: `est-${Date.now()}`,
      projectCategory: request.projectCategory,
      summary: {
        totalLow: Math.round(totalLow),
        totalMid: Math.round(totalMid),
        totalHigh: Math.round(totalHigh),
        pricePerSqm: {
          low: Math.round(totalLow / area),
          mid: Math.round(totalMid / area),
          high: Math.round(totalHigh / area),
        },
        confidence: this.calculateConfidence(request),
        currency: 'GBP',
      },
      breakdown,
      timeline,
      heritageFactors,
      risks,
      comparisons,
      recommendations,
      createdAt: new Date(),
    };
  }
  
  /**
   * Get area-specific multiplier
   */
  private getAreaMultiplier(postcode: string): number {
    const prefix = postcode.substring(0, 3).toUpperCase().replace(/\s/g, '');
    const shortPrefix = postcode.substring(0, 2).toUpperCase();
    
    return AREA_MULTIPLIERS[prefix] ?? AREA_MULTIPLIERS[shortPrefix] ?? AREA_MULTIPLIERS['default'] ?? 1.0;
  }
  
  /**
   * Get heritage multiplier
   */
  private getHeritageMultiplier(request: CostEstimateRequest): number {
    let complexity: HeritageComplexity = 'none';
    
    if (request.heritageComplexity) {
      complexity = request.heritageComplexity;
    } else {
      // Infer complexity from heritage status
      if (request.heritageStatus === 'RED') {
        complexity = 'high';
      } else if (request.heritageStatus === 'AMBER') {
        complexity = 'medium';
      }
    }
    
    return HERITAGE_MULTIPLIERS[complexity];
  }
  
  /**
   * Get condition multiplier
   */
  private getConditionMultiplier(condition?: 'good' | 'fair' | 'poor'): number {
    switch (condition) {
      case 'good': return 1.0;
      case 'fair': return 1.10;
      case 'poor': return 1.25;
      default: return 1.05;
    }
  }
  
  /**
   * Get access difficulty multiplier
   */
  private getAccessMultiplier(access?: 'easy' | 'moderate' | 'difficult'): number {
    switch (access) {
      case 'easy': return 1.0;
      case 'moderate': return 1.08;
      case 'difficult': return 1.18;
      default: return 1.05;
    }
  }
  
  /**
   * Generate detailed cost breakdown
   */
  private generateBreakdown(
    request: CostEstimateRequest,
    constructionLow: number,
    constructionMid: number,
    constructionHigh: number,
    area: number
  ): CostBreakdown {
    // Construction breakdown percentages
    const isNewBuild = ['new_build', 'basement', 'rear_extension', 'side_extension'].includes(request.projectCategory);
    const hasRoof = ['loft_conversion', 'new_build', 'rear_extension', 'side_extension'].includes(request.projectCategory);
    
    return {
      construction: {
        substructure: isNewBuild ? {
          description: 'Foundations and groundwork',
          lowEstimate: constructionLow * 0.12,
          midEstimate: constructionMid * 0.12,
          highEstimate: constructionHigh * 0.12,
          notes: 'Includes excavation, foundations, drainage',
        } : undefined,
        superstructure: {
          description: 'Main structure (walls, floors, roof structure)',
          lowEstimate: constructionLow * 0.25,
          midEstimate: constructionMid * 0.25,
          highEstimate: constructionHigh * 0.25,
        },
        internalWalls: {
          description: 'Internal partitions and studwork',
          lowEstimate: constructionLow * 0.08,
          midEstimate: constructionMid * 0.08,
          highEstimate: constructionHigh * 0.08,
        },
        roofing: hasRoof ? {
          description: 'Roof covering, insulation, flashings',
          lowEstimate: constructionLow * 0.10,
          midEstimate: constructionMid * 0.10,
          highEstimate: constructionHigh * 0.10,
        } : undefined,
        windows: {
          description: 'Windows and external doors',
          lowEstimate: constructionLow * 0.12,
          midEstimate: constructionMid * 0.12,
          highEstimate: constructionHigh * 0.12,
          notes: request.heritageStatus !== 'GREEN' ? 'Heritage-appropriate specifications' : undefined,
        },
        externalFinishes: {
          description: 'External render, cladding, brickwork',
          lowEstimate: constructionLow * 0.08,
          midEstimate: constructionMid * 0.08,
          highEstimate: constructionHigh * 0.08,
        },
        internalFinishes: {
          description: 'Plastering, flooring, decoration',
          lowEstimate: constructionLow * 0.15,
          midEstimate: constructionMid * 0.15,
          highEstimate: constructionHigh * 0.15,
        },
        mechanical: {
          description: 'Heating, ventilation',
          lowEstimate: constructionLow * 0.05,
          midEstimate: constructionMid * 0.05,
          highEstimate: constructionHigh * 0.05,
        },
        electrical: {
          description: 'Electrical installation',
          lowEstimate: constructionLow * 0.05,
          midEstimate: constructionMid * 0.05,
          highEstimate: constructionHigh * 0.05,
        },
        plumbing: request.projectCategory !== 'loft_conversion' ? {
          description: 'Plumbing and drainage',
          lowEstimate: constructionLow * 0.04,
          midEstimate: constructionMid * 0.04,
          highEstimate: constructionHigh * 0.04,
        } : undefined,
      },
      professionalFees: {
        architect: {
          description: 'Architect fees (design to completion)',
          lowEstimate: constructionMid * (PROFESSIONAL_FEES.architect.low / 100),
          midEstimate: constructionMid * (PROFESSIONAL_FEES.architect.typical / 100),
          highEstimate: constructionMid * (PROFESSIONAL_FEES.architect.high / 100),
          notes: 'Typically 8-15% of construction cost',
        },
        structuralEngineer: request.structuralWork !== 'none' ? {
          description: 'Structural engineer',
          lowEstimate: PROFESSIONAL_FEES.structuralEngineer.low,
          midEstimate: PROFESSIONAL_FEES.structuralEngineer.typical,
          highEstimate: PROFESSIONAL_FEES.structuralEngineer.high,
        } : undefined,
        planningConsultant: request.heritageStatus !== 'GREEN' ? {
          description: 'Planning consultant',
          lowEstimate: PROFESSIONAL_FEES.planningConsultant.low,
          midEstimate: PROFESSIONAL_FEES.planningConsultant.typical,
          highEstimate: PROFESSIONAL_FEES.planningConsultant.high,
          notes: 'Recommended for heritage properties',
        } : undefined,
        partyWallSurveyor: {
          description: 'Party wall surveyor (if needed)',
          lowEstimate: PROFESSIONAL_FEES.partyWallSurveyor.low,
          midEstimate: PROFESSIONAL_FEES.partyWallSurveyor.typical,
          highEstimate: PROFESSIONAL_FEES.partyWallSurveyor.high,
          notes: 'Required if works affect party walls',
        },
        buildingControlAppointment: {
          description: 'Approved Inspector appointment',
          lowEstimate: PROFESSIONAL_FEES.buildingControlAppointment.low,
          midEstimate: PROFESSIONAL_FEES.buildingControlAppointment.typical,
          highEstimate: PROFESSIONAL_FEES.buildingControlAppointment.high,
        },
      },
      statutory: {
        planningFee: {
          description: 'Planning application fee',
          lowEstimate: STATUTORY_FEES.householder.planning,
          midEstimate: STATUTORY_FEES.householder.planning,
          highEstimate: STATUTORY_FEES.fullApplication.planning,
        },
        buildingControlFee: {
          description: 'Building control submission fee',
          lowEstimate: STATUTORY_FEES.buildingControl.low,
          midEstimate: (STATUTORY_FEES.buildingControl.low + STATUTORY_FEES.buildingControl.high) / 2,
          highEstimate: STATUTORY_FEES.buildingControl.high,
        },
        listedBuildingFee: request.heritageStatus === 'RED' ? {
          description: 'Listed Building Consent (no fee)',
          lowEstimate: 0,
          midEstimate: 0,
          highEstimate: 0,
          notes: 'Free application but requires heritage statement',
        } : undefined,
        partyWallAwards: {
          description: 'Party wall awards (if disputed)',
          lowEstimate: 0,
          midEstimate: STATUTORY_FEES.partyWallAward.low,
          highEstimate: STATUTORY_FEES.partyWallAward.high,
          notes: 'Only if neighbours appoint their own surveyor',
        },
      },
      preliminaries: {
        siteSetup: {
          description: 'Site setup, welfare, security',
          lowEstimate: constructionMid * 0.02,
          midEstimate: constructionMid * 0.03,
          highEstimate: constructionMid * 0.04,
        },
        scaffolding: request.projectCategory !== 'garage_conversion' ? {
          description: 'Scaffolding hire',
          lowEstimate: 2000,
          midEstimate: 4000,
          highEstimate: 8000,
        } : undefined,
        skip: {
          description: 'Skip hire and waste disposal',
          lowEstimate: 1500,
          midEstimate: 3000,
          highEstimate: 6000,
        },
        utilities: {
          description: 'Temporary services',
          lowEstimate: 500,
          midEstimate: 1000,
          highEstimate: 2000,
        },
      },
      contingency: {
        description: 'Contingency (unforeseen issues)',
        lowEstimate: constructionMid * 0.05,
        midEstimate: constructionMid * (request.heritageStatus !== 'GREEN' ? 0.15 : 0.10),
        highEstimate: constructionMid * 0.20,
        notes: request.heritageStatus !== 'GREEN' 
          ? 'Higher contingency recommended for heritage properties'
          : 'Standard contingency allowance',
      },
    };
  }
  
  /**
   * Sum all breakdown items
   */
  private sumBreakdown(breakdown: CostBreakdown, field: 'lowEstimate' | 'midEstimate' | 'highEstimate'): number {
    let total = 0;
    
    // Sum construction costs
    for (const item of Object.values(breakdown.construction)) {
      if (item) total += item[field];
    }
    
    // Sum professional fees
    for (const item of Object.values(breakdown.professionalFees)) {
      if (item) total += item[field];
    }
    
    // Sum statutory fees
    for (const item of Object.values(breakdown.statutory)) {
      if (item) total += item[field];
    }
    
    // Sum preliminaries
    for (const item of Object.values(breakdown.preliminaries)) {
      if (item) total += item[field];
    }
    
    // Add contingency
    total += breakdown.contingency[field];
    
    return total;
  }
  
  /**
   * Generate project timeline
   */
  private generateTimeline(request: CostEstimateRequest, area: number): ProjectTimeline {
    const phases: TimelinePhase[] = [];
    
    // Design phase
    phases.push({
      name: 'Design & Planning',
      durationWeeks: { low: 4, high: 8 },
      notes: 'Includes surveys, design development, and planning submission',
    });
    
    // Planning phase
    const planningWeeks = request.heritageStatus === 'RED' 
      ? { low: 10, high: 16 }
      : request.heritageStatus === 'AMBER'
      ? { low: 8, high: 14 }
      : { low: 6, high: 10 };
    
    phases.push({
      name: 'Planning Approval',
      durationWeeks: planningWeeks,
      dependencies: ['Design & Planning'],
      notes: request.heritageStatus !== 'GREEN' 
        ? 'Extended timeline for heritage consultation'
        : 'Standard 8-week determination period',
    });
    
    // Tender phase
    phases.push({
      name: 'Tender & Procurement',
      durationWeeks: { low: 3, high: 6 },
      dependencies: ['Planning Approval'],
      notes: 'Obtaining competitive quotes and finalizing contracts',
    });
    
    // Construction phase
    const baseConstructionWeeks = Math.max(8, Math.ceil(area / 5));
    const heritageMultiplier = request.heritageStatus === 'RED' ? 1.4 : request.heritageStatus === 'AMBER' ? 1.2 : 1;
    
    phases.push({
      name: 'Construction',
      durationWeeks: {
        low: Math.ceil(baseConstructionWeeks * 0.8 * heritageMultiplier),
        high: Math.ceil(baseConstructionWeeks * 1.3 * heritageMultiplier),
      },
      dependencies: ['Tender & Procurement'],
      notes: request.heritageStatus !== 'GREEN'
        ? 'Extended for heritage-appropriate construction methods'
        : 'Standard construction timeline',
    });
    
    // Finishing phase
    phases.push({
      name: 'Finishing & Snagging',
      durationWeeks: { low: 2, high: 4 },
      dependencies: ['Construction'],
    });
    
    // Calculate total
    const totalLow = phases.reduce((sum, phase) => sum + phase.durationWeeks.low, 0);
    const totalHigh = phases.reduce((sum, phase) => sum + phase.durationWeeks.high, 0);
    
    return {
      totalWeeks: { low: totalLow, high: totalHigh },
      phases,
    };
  }
  
  /**
   * Calculate heritage-specific factors
   */
  private calculateHeritageFactors(request: CostEstimateRequest): HeritageFactors {
    let complexity: HeritageComplexity = 'none';
    let additionalCostPercentage = 0;
    let additionalTimeWeeks = 0;
    const requirements: string[] = [];
    const specialistSkills: string[] = [];
    
    if (request.heritageStatus === 'RED') {
      complexity = request.heritageComplexity || 'high';
      additionalCostPercentage = 25;
      additionalTimeWeeks = 8;
      requirements.push(
        'Listed Building Consent required',
        'Heritage Impact Assessment',
        'Historic building survey',
        'Conservation officer consultation',
        'Traditional materials specification'
      );
      specialistSkills.push(
        'Heritage architect (IHBC/SPAB member)',
        'Conservation builder',
        'Lime mortar specialist',
        'Traditional joinery specialist'
      );
    } else if (request.heritageStatus === 'AMBER') {
      complexity = request.heritageComplexity || 'medium';
      additionalCostPercentage = 15;
      additionalTimeWeeks = 4;
      requirements.push(
        'Conservation area assessment',
        'Design & Access Statement',
        'Sensitive materials selection'
      );
      specialistSkills.push(
        'Architect experienced in conservation areas',
        'Builder familiar with period properties'
      );
    }
    
    return {
      complexity,
      additionalCostPercentage,
      additionalTimeWeeks,
      requirements,
      specialistSkills,
    };
  }
  
  /**
   * Assess project risks
   */
  private assessRisks(request: CostEstimateRequest, estimatedCost: number): CostRisk[] {
    const risks: CostRisk[] = [];
    
    // Heritage risks
    if (request.heritageStatus === 'RED') {
      risks.push({
        category: 'Heritage',
        description: 'Listed building works may uncover unexpected historic features requiring preservation',
        probability: 'medium',
        impact: estimatedCost * 0.15,
        mitigation: 'Include detailed historic building survey before works commence',
      });
      risks.push({
        category: 'Approvals',
        description: 'Listed Building Consent refusal or conditions requiring design changes',
        probability: 'medium',
        impact: estimatedCost * 0.10,
        mitigation: 'Engage with conservation officer early in pre-application process',
      });
    }
    
    // Structural risks
    if (request.existingCondition === 'poor' || request.projectCategory === 'basement') {
      risks.push({
        category: 'Structural',
        description: 'Unforeseen structural issues requiring additional works',
        probability: 'medium',
        impact: estimatedCost * 0.12,
        mitigation: 'Commission detailed structural survey before tender stage',
      });
    }
    
    // Party wall risks
    if (['rear_extension', 'side_extension', 'loft_conversion', 'basement'].includes(request.projectCategory)) {
      risks.push({
        category: 'Party Wall',
        description: 'Neighbour dispute requiring surveyor appointment and awards',
        probability: 'low',
        impact: 8000,
        mitigation: 'Early neighbor engagement and clear communication of proposals',
      });
    }
    
    // Market risks
    risks.push({
      category: 'Market',
      description: 'Material and labour cost increases during project',
      probability: 'medium',
      impact: estimatedCost * 0.05,
      mitigation: 'Include fixed-price contracts where possible, lock in material prices',
    });
    
    // Weather risks
    risks.push({
      category: 'Weather',
      description: 'Delays due to adverse weather conditions',
      probability: 'low',
      impact: estimatedCost * 0.03,
      mitigation: 'Schedule groundworks and roofing for favorable seasons',
    });
    
    return risks;
  }
  
  /**
   * Get market comparison data
   */
  private getMarketComparison(request: CostEstimateRequest, estimatedCost: number, area: number): MarketComparison {
    const pricePerSqm = estimatedCost / area;
    
    // Market averages (simplified - would use real data in production)
    const marketData = {
      local: BASE_RATES[request.projectCategory].standard * this.getAreaMultiplier(request.postcode) * 1.15,
      london: BASE_RATES[request.projectCategory].standard * 1.10,
      national: BASE_RATES[request.projectCategory].standard * 0.75,
    };
    
    return {
      localAverage: Math.round(marketData.local * area),
      londonAverage: Math.round(marketData.london * area),
      nationalAverage: Math.round(marketData.national * area),
      percentileRank: this.calculatePercentile(pricePerSqm, marketData.local),
      recentTrend: 'rising',
      inflationFactor: 1.05, // 5% annual construction inflation
    };
  }
  
  /**
   * Calculate where estimate sits in market
   */
  private calculatePercentile(value: number, average: number): number {
    const ratio = value / average;
    if (ratio <= 0.8) return 20;
    if (ratio <= 0.9) return 35;
    if (ratio <= 1.0) return 50;
    if (ratio <= 1.1) return 65;
    if (ratio <= 1.2) return 80;
    return 90;
  }
  
  /**
   * Generate recommendations
   */
  private generateRecommendations(
    request: CostEstimateRequest,
    estimatedCost: number,
    heritageFactors: HeritageFactors
  ): string[] {
    const recommendations: string[] = [];
    
    // Heritage recommendations
    if (heritageFactors.complexity !== 'none') {
      recommendations.push(
        'Engage a heritage-specialist architect early to avoid costly redesigns',
        'Request pre-application advice from the conservation officer',
        'Allow additional contingency (15-20%) for heritage-specific discoveries'
      );
    }
    
    // Project-specific recommendations
    if (request.projectCategory === 'basement') {
      recommendations.push(
        'Ensure thorough ground investigation and structural surveys',
        'Consider specialist basement contractors with relevant experience',
        'Plan for temporary accommodation during waterproofing works'
      );
    }
    
    if (request.projectCategory === 'loft_conversion') {
      recommendations.push(
        'Check planning requirements for dormer windows in conservation areas',
        'Confirm staircase location early as it affects room layout below',
        'Consider impact on party walls for terraced/semi-detached properties'
      );
    }
    
    // Cost-saving recommendations
    if (request.finishLevel === 'luxury' || request.finishLevel === 'premium') {
      recommendations.push(
        'Early selection of finishes allows for longer lead times on bespoke items',
        'Consider phasing high-end finishes to spread costs'
      );
    }
    
    // General recommendations
    recommendations.push(
      'Obtain at least 3 competitive quotes from vetted contractors',
      'Ensure all contractors have appropriate insurance and warranties',
      'Consider fixed-price contracts to manage budget risk'
    );
    
    return recommendations;
  }
  
  /**
   * Calculate estimate confidence level
   */
  private calculateConfidence(request: CostEstimateRequest): number {
    let confidence = 80;
    
    // Reduce confidence for heritage projects (more unknowns)
    if (request.heritageStatus === 'RED') confidence -= 15;
    else if (request.heritageStatus === 'AMBER') confidence -= 8;
    
    // Reduce confidence for poor existing condition
    if (request.existingCondition === 'poor') confidence -= 10;
    
    // Reduce confidence for basement (ground conditions)
    if (request.projectCategory === 'basement') confidence -= 10;
    
    // Increase confidence if dimensions are precise
    if (request.dimensions.area && request.dimensions.height) confidence += 5;
    
    return Math.max(50, Math.min(95, confidence));
  }
  
  /**
   * Quick estimate without full breakdown
   */
  getQuickEstimate(params: {
    projectCategory: ProjectCategory;
    area: number;
    finishLevel: FinishLevel;
    postcode: string;
    heritageStatus: 'RED' | 'AMBER' | 'GREEN';
  }): { low: number; mid: number; high: number } {
    const baseRate = BASE_RATES[params.projectCategory][params.finishLevel];
    const areaMultiplier = this.getAreaMultiplier(params.postcode);
    const heritageMultiplier = params.heritageStatus === 'RED' ? 1.35 : params.heritageStatus === 'AMBER' ? 1.20 : 1;
    
    const baseTotal = baseRate * areaMultiplier * heritageMultiplier * params.area;
    
    // Add 30% for fees, preliminaries, contingency
    const totalWithFees = baseTotal * 1.30;
    
    return {
      low: Math.round(totalWithFees * 0.85),
      mid: Math.round(totalWithFees),
      high: Math.round(totalWithFees * 1.20),
    };
  }
}

// Export singleton
export const costEstimator = new CostEstimatorService();
