/**
 * Viability Assessment Service
 * 
 * Comprehensive development viability analysis for planning applications
 * in the Hampstead area. Provides financial appraisal guidance, benchmark
 * land values, and assessment of affordable housing contributions.
 * 
 * Based on:
 * - RICS Valuation Standards
 * - Camden Planning Obligations SPD
 * - NPPF Viability Requirements
 * - Mayor's Affordable Housing SPG
 */

// Hampstead area benchmark land values (£/acre)
const BENCHMARK_LAND_VALUES: Record<string, {
  residential: number;
  commercial: number;
  mixedUse: number;
  industrial: number;
}> = {
  'NW3': {
    residential: 25000000,
    commercial: 18000000,
    mixedUse: 20000000,
    industrial: 8000000
  },
  'NW6': {
    residential: 18000000,
    commercial: 14000000,
    mixedUse: 16000000,
    industrial: 6000000
  },
  'NW8': {
    residential: 22000000,
    commercial: 16000000,
    mixedUse: 18000000,
    industrial: 7000000
  },
  'NW1': {
    residential: 20000000,
    commercial: 15000000,
    mixedUse: 17000000,
    industrial: 6500000
  },
  'NW2': {
    residential: 15000000,
    commercial: 11000000,
    mixedUse: 13000000,
    industrial: 5000000
  },
  'NW5': {
    residential: 16000000,
    commercial: 12000000,
    mixedUse: 14000000,
    industrial: 5500000
  },
  'NW11': {
    residential: 14000000,
    commercial: 10000000,
    mixedUse: 12000000,
    industrial: 4500000
  },
  'N2': {
    residential: 13000000,
    commercial: 9000000,
    mixedUse: 11000000,
    industrial: 4000000
  },
  'N6': {
    residential: 17000000,
    commercial: 13000000,
    mixedUse: 15000000,
    industrial: 5500000
  },
  'N10': {
    residential: 12000000,
    commercial: 8000000,
    mixedUse: 10000000,
    industrial: 3500000
  }
};

// Build costs per sqm by development type
const BUILD_COSTS: Record<string, {
  low: number;
  medium: number;
  high: number;
  premium: number;
}> = {
  'residential_house': {
    low: 2200,
    medium: 2800,
    high: 3500,
    premium: 4500
  },
  'residential_flat': {
    low: 2400,
    medium: 3000,
    high: 3800,
    premium: 5000
  },
  'residential_luxury': {
    low: 3500,
    medium: 4500,
    high: 6000,
    premium: 8000
  },
  'office': {
    low: 2000,
    medium: 2500,
    high: 3200,
    premium: 4200
  },
  'retail': {
    low: 1800,
    medium: 2300,
    high: 3000,
    premium: 4000
  },
  'hotel': {
    low: 2600,
    medium: 3300,
    high: 4200,
    premium: 5500
  },
  'basement': {
    low: 2800,
    medium: 3500,
    high: 4500,
    premium: 6000
  },
  'listed_building': {
    low: 3500,
    medium: 4500,
    high: 6000,
    premium: 8500
  },
  'conservation_area': {
    low: 2800,
    medium: 3500,
    high: 4500,
    premium: 6000
  }
};

// Sales values per sqm by area and type
const SALES_VALUES: Record<string, {
  house: number;
  flat: number;
  luxury: number;
  office: number;
  retail: number;
}> = {
  'NW3': {
    house: 18000,
    flat: 15000,
    luxury: 25000,
    office: 8500,
    retail: 6000
  },
  'NW6': {
    house: 12000,
    flat: 10000,
    luxury: 18000,
    office: 6500,
    retail: 4500
  },
  'NW8': {
    house: 15000,
    flat: 12500,
    luxury: 22000,
    office: 7500,
    retail: 5500
  },
  'NW1': {
    house: 14000,
    flat: 11500,
    luxury: 20000,
    office: 7000,
    retail: 5000
  },
  'NW2': {
    house: 9500,
    flat: 8000,
    luxury: 14000,
    office: 5500,
    retail: 3800
  },
  'NW5': {
    house: 10000,
    flat: 8500,
    luxury: 15000,
    office: 5800,
    retail: 4000
  },
  'NW11': {
    house: 9000,
    flat: 7500,
    luxury: 13000,
    office: 5200,
    retail: 3500
  },
  'N2': {
    house: 8500,
    flat: 7000,
    luxury: 12000,
    office: 4800,
    retail: 3200
  },
  'N6': {
    house: 11000,
    flat: 9000,
    luxury: 16000,
    office: 6000,
    retail: 4200
  },
  'N10': {
    house: 8000,
    flat: 6500,
    luxury: 11000,
    office: 4500,
    retail: 3000
  }
};

// Professional fees as percentage of build cost
const PROFESSIONAL_FEES = {
  architect: { min: 0.06, max: 0.10 },
  structuralEngineer: { min: 0.02, max: 0.04 },
  mAndE: { min: 0.02, max: 0.04 },
  projectManagement: { min: 0.03, max: 0.06 },
  quantitySurveyor: { min: 0.02, max: 0.03 },
  planningConsultant: { min: 0.01, max: 0.02 },
  cdmCoordinator: { min: 0.005, max: 0.01 },
  totalRange: { min: 0.12, max: 0.20 }
};

// Finance costs
const FINANCE_COSTS = {
  debtInterestRate: 0.065, // 6.5% typical development finance
  equityReturn: 0.12, // 12% equity return expectation
  arrangementFee: 0.015, // 1.5% arrangement fee
  exitFee: 0.01 // 1% exit fee
};

// Camden affordable housing requirements
const AFFORDABLE_HOUSING = {
  thresholdUnits: 10,
  targetPercentage: 0.50, // 50% for sites over threshold
  socialRentSplit: 0.60, // 60% social rent
  intermediateSplit: 0.40, // 40% intermediate
  commutedSumPerUnit: 150000, // Off-site contribution
  reviewMechanismThreshold: 1000000 // GDV threshold for review
};

// Development profit targets
const PROFIT_TARGETS = {
  residential: { min: 0.15, target: 0.175, max: 0.20 },
  commercial: { min: 0.12, target: 0.15, max: 0.18 },
  mixedUse: { min: 0.13, target: 0.165, max: 0.19 },
  affordableHousing: { min: 0.06, target: 0.06, max: 0.08 }
};

// Contingencies
const CONTINGENCIES = {
  standard: 0.05,
  refurbishment: 0.075,
  listedBuilding: 0.10,
  basement: 0.10,
  contaminated: 0.12
};

// Abnormal costs common in Hampstead
const ABNORMAL_COSTS: Record<string, {
  description: string;
  typicalCost: string;
  perUnit: string;
}> = {
  'basement_waterproofing': {
    description: 'Type A/B/C waterproofing systems for basement construction',
    typicalCost: '£50,000 - £150,000',
    perUnit: '£800-1,500/sqm'
  },
  'party_wall': {
    description: 'Party Wall Awards and works in terraced/semi-detached properties',
    typicalCost: '£15,000 - £50,000',
    perUnit: '£5,000-15,000 per party'
  },
  'underpinning': {
    description: 'Foundation underpinning for basement or near trees',
    typicalCost: '£30,000 - £100,000',
    perUnit: '£1,200-2,500/m run'
  },
  'tree_protection': {
    description: 'Tree protection during construction, root barriers',
    typicalCost: '£5,000 - £25,000',
    perUnit: '£1,000-5,000 per significant tree'
  },
  'heritage_materials': {
    description: 'Matching historic materials for conservation/listed works',
    typicalCost: '20-40% premium',
    perUnit: 'Varies by specification'
  },
  'contamination': {
    description: 'Ground contamination remediation',
    typicalCost: '£20,000 - £200,000',
    perUnit: '£50-500/sqm'
  },
  'demolition_listed': {
    description: 'Careful demolition in listed buildings',
    typicalCost: '£30,000 - £80,000',
    perUnit: '150-200% premium'
  },
  'archaeology': {
    description: 'Archaeological investigation and watching brief',
    typicalCost: '£10,000 - £50,000',
    perUnit: '£200-500/sqm investigation'
  }
};

interface DevelopmentDetails {
  siteArea?: number; // in acres
  grossInternalArea?: number; // sqm
  numberOfUnits?: number;
  developmentType?: string;
  buildQuality?: 'low' | 'medium' | 'high' | 'premium';
  listedBuilding?: boolean;
  conservationArea?: boolean;
  basementIncluded?: boolean;
  affordableUnits?: number;
  commercialArea?: number;
}

interface CostInputs {
  landCost?: number;
  buildCost?: number;
  professionalFees?: number;
  abnormalCosts?: number;
  contingency?: number;
  financeCosts?: number;
  salesCosts?: number;
  cilContribution?: number;
  s106Contribution?: number;
}

interface ViabilityResult {
  summary: {
    viable: boolean;
    viabilityRating: 'strong' | 'marginal' | 'weak' | 'unviable';
    totalDevelopmentCost: number;
    grossDevelopmentValue: number;
    residualLandValue: number;
    benchmarkLandValue: number;
    landValueSurplus: number;
    developerProfit: number;
    profitOnCost: number;
    profitOnGDV: number;
  };
  costBreakdown: {
    landCost: number;
    buildCost: number;
    professionalFees: number;
    contingency: number;
    abnormalCosts: number;
    financeCosts: number;
    marketingAndSales: number;
    legalCosts: number;
    cilContribution: number;
    s106Contribution: number;
    totalCosts: number;
  };
  revenueBreakdown: {
    privateResidential: number;
    affordableResidential: number;
    commercial: number;
    groundRents: number;
    totalRevenue: number;
  };
  sensitivityAnalysis: {
    salesValueChange: { minus10: number; minus5: number; plus5: number; plus10: number };
    buildCostChange: { minus10: number; minus5: number; plus5: number; plus10: number };
    breakEvenSalesValue: number;
    breakEvenBuildCost: number;
  };
  affordableHousingAssessment: {
    policyRequirement: number;
    proposedProvision: number;
    maximumViableContribution: number;
    commutedSumEquivalent: number;
    reviewMechanismRequired: boolean;
  };
  benchmarkAssessment: {
    existingUseValue: number;
    existingUsePlusPremium: number;
    alternativeUseValue: number;
    adoptedBenchmark: number;
    benchmarkBasis: string;
  };
  assumptions: string[];
  caveats: string[];
  recommendations: string[];
}

export class ViabilityAssessmentService {
  
  /**
   * Perform comprehensive viability assessment
   */
  assessViability(
    address: string,
    developmentDetails: DevelopmentDetails,
    costInputs?: CostInputs
  ): ViabilityResult {
    const postcode = this.extractPostcode(address);
    const postcodeDistrict = postcode.split(' ')[0] || 'NW3';
    
    // Get area-specific values
    const defaultBenchmarks = {
      residential: 15000000,
      commercial: 10000000,
      mixedUse: 12000000,
      industrial: 5000000
    };
    const benchmarksLookup = BENCHMARK_LAND_VALUES[postcodeDistrict];
    const benchmarks = benchmarksLookup || defaultBenchmarks;
    
    const defaultSalesValues = {
      house: 10000,
      flat: 8000,
      luxury: 15000,
      office: 5000,
      retail: 3500
    };
    const salesValuesLookup = SALES_VALUES[postcodeDistrict];
    const salesValues = salesValuesLookup || defaultSalesValues;
    
    // Calculate costs
    const costs = this.calculateCosts(developmentDetails, costInputs, postcodeDistrict);
    
    // Extract cost values with defaults
    const landCost = costs['landCost'] || 0;
    const buildCost = costs['buildCost'] || 0;
    const professionalFees = costs['professionalFees'] || 0;
    const contingency = costs['contingency'] || 0;
    const abnormalCosts = costs['abnormalCosts'] || 0;
    const financeCosts = costs['financeCosts'] || 0;
    const marketingAndSales = costs['marketingAndSales'] || 0;
    const legalCosts = costs['legalCosts'] || 0;
    const cilContribution = costs['cilContribution'] || 0;
    const s106Contribution = costs['s106Contribution'] || 0;
    
    // Calculate revenues
    const revenues = this.calculateRevenues(developmentDetails, salesValues);
    
    // Calculate residual land value
    const totalCostsExLand = buildCost + professionalFees + contingency + abnormalCosts + 
      financeCosts + marketingAndSales + legalCosts + cilContribution + s106Contribution;
    const targetProfit = this.calculateTargetProfit(developmentDetails, revenues.totalRevenue);
    const residualLandValue = revenues.totalRevenue - totalCostsExLand - targetProfit;
    
    // Determine benchmark land value
    const benchmark = this.determineBenchmark(developmentDetails, benchmarks);
    
    // Assess viability
    const landValueSurplus = residualLandValue - benchmark.adoptedBenchmark;
    const viable = landValueSurplus >= 0;
    const profitOnCost = targetProfit / (totalCostsExLand + landCost);
    const profitOnGDV = targetProfit / revenues.totalRevenue;
    
    // Determine viability rating
    let viabilityRating: 'strong' | 'marginal' | 'weak' | 'unviable';
    if (landValueSurplus >= benchmark.adoptedBenchmark * 0.1) {
      viabilityRating = 'strong';
    } else if (landValueSurplus >= 0) {
      viabilityRating = 'marginal';
    } else if (landValueSurplus >= -benchmark.adoptedBenchmark * 0.1) {
      viabilityRating = 'weak';
    } else {
      viabilityRating = 'unviable';
    }
    
    // Perform sensitivity analysis
    const sensitivity = this.performSensitivityAnalysis(
      revenues.totalRevenue,
      totalCostsExLand,
      targetProfit,
      benchmark.adoptedBenchmark
    );
    
    // Assess affordable housing contribution
    const affordableAssessment = this.assessAffordableHousing(
      developmentDetails,
      residualLandValue,
      benchmark.adoptedBenchmark
    );
    
    return {
      summary: {
        viable,
        viabilityRating,
        totalDevelopmentCost: totalCostsExLand + landCost,
        grossDevelopmentValue: revenues.totalRevenue,
        residualLandValue,
        benchmarkLandValue: benchmark.adoptedBenchmark,
        landValueSurplus,
        developerProfit: targetProfit,
        profitOnCost,
        profitOnGDV
      },
      costBreakdown: {
        landCost,
        buildCost,
        professionalFees,
        contingency,
        abnormalCosts,
        financeCosts,
        marketingAndSales,
        legalCosts,
        cilContribution,
        s106Contribution,
        totalCosts: totalCostsExLand + landCost
      },
      revenueBreakdown: revenues,
      sensitivityAnalysis: sensitivity,
      affordableHousingAssessment: affordableAssessment,
      benchmarkAssessment: benchmark,
      assumptions: this.generateAssumptions(developmentDetails, postcodeDistrict),
      caveats: this.generateCaveats(developmentDetails),
      recommendations: this.generateRecommendations(viabilityRating, affordableAssessment)
    };
  }
  
  /**
   * Calculate development costs
   */
  private calculateCosts(
    details: DevelopmentDetails,
    inputs?: CostInputs,
    postcodeDistrict?: string
  ): Record<string, number> {
    const gia = details.grossInternalArea || 500;
    const buildType = details.developmentType || 'residential_flat';
    const quality = details.buildQuality || 'medium';
    
    // Get build cost per sqm
    const defaultBuildCosts = {
      low: 2400,
      medium: 3000,
      high: 3800,
      premium: 5000
    };
    const buildCostRates = BUILD_COSTS[buildType] || defaultBuildCosts;
    const buildCostPerSqm = buildCostRates[quality];
    
    // Calculate base build cost
    let buildCost = inputs?.buildCost || (gia * buildCostPerSqm);
    
    // Apply premiums for special conditions
    if (details.listedBuilding) {
      buildCost *= 1.35; // 35% premium for listed buildings
    }
    if (details.conservationArea) {
      buildCost *= 1.15; // 15% premium for conservation area
    }
    
    // Calculate professional fees
    const professionalFees = inputs?.professionalFees || 
      (buildCost * (details.listedBuilding ? 0.18 : 0.15));
    
    // Calculate contingency
    let contingencyRate = CONTINGENCIES.standard;
    if (details.listedBuilding) contingencyRate = CONTINGENCIES.listedBuilding;
    else if (details.basementIncluded) contingencyRate = CONTINGENCIES.basement;
    const contingency = inputs?.contingency || (buildCost * contingencyRate);
    
    // Calculate abnormal costs
    let abnormalCosts = inputs?.abnormalCosts || 0;
    if (details.basementIncluded) {
      abnormalCosts += 75000; // Typical basement waterproofing
    }
    if (details.listedBuilding) {
      abnormalCosts += 50000; // Heritage specialist works
    }
    
    // Calculate finance costs (simplified)
    const totalBuildCosts = buildCost + professionalFees + contingency + abnormalCosts;
    const buildPeriod = this.estimateBuildPeriod(gia, details);
    const averageDebt = totalBuildCosts * 0.65; // 65% debt finance
    const financeCosts = inputs?.financeCosts ||
      (averageDebt * FINANCE_COSTS.debtInterestRate * (buildPeriod / 12));
    
    // Marketing and sales costs
    const marketingAndSales = (details.numberOfUnits || 1) * 5000 + 
      (gia * (details.developmentType?.includes('residential') ? 30 : 20));
    
    // Legal costs
    const legalCosts = 15000 + ((details.numberOfUnits || 1) * 2000);
    
    // CIL and S106
    const cilContribution = inputs?.cilContribution || 
      this.calculateCIL(gia, postcodeDistrict || 'NW3', details);
    const s106Contribution = inputs?.s106Contribution || 
      this.calculateS106(details);
    
    // Land cost (benchmark or input)
    const defaultBenchmarks = {
      residential: 15000000,
      commercial: 10000000,
      mixedUse: 12000000,
      industrial: 5000000
    };
    const benchmarks = BENCHMARK_LAND_VALUES[postcodeDistrict || 'NW3'] || defaultBenchmarks;
    const siteArea = details.siteArea || 0.1;
    const landType = details.commercialArea && details.commercialArea > 0 ? 'mixedUse' : 'residential';
    const landCost = inputs?.landCost || (benchmarks[landType] * siteArea);
    
    return {
      landCost,
      buildCost,
      professionalFees,
      contingency,
      abnormalCosts,
      financeCosts,
      marketingAndSales,
      legalCosts,
      cilContribution,
      s106Contribution
    };
  }
  
  /**
   * Calculate revenues
   */
  private calculateRevenues(
    details: DevelopmentDetails,
    salesValues: Record<string, number>
  ): {
    privateResidential: number;
    affordableResidential: number;
    commercial: number;
    groundRents: number;
    totalRevenue: number;
  } {
    const gia = details.grossInternalArea || 500;
    const quality = details.buildQuality || 'medium';
    
    // Extract sales values with defaults
    const luxuryValue = salesValues['luxury'] || 15000;
    const flatValue = salesValues['flat'] || 8000;
    const houseValue = salesValues['house'] || 10000;
    const retailValue = salesValues['retail'] || 3500;
    const officeValue = salesValues['office'] || 5000;
    
    // Determine sales value per sqm
    let salesValuePerSqm: number;
    if (quality === 'premium' || quality === 'high') {
      salesValuePerSqm = luxuryValue;
    } else if (details.developmentType?.includes('flat')) {
      salesValuePerSqm = flatValue;
    } else {
      salesValuePerSqm = houseValue;
    }
    
    // Calculate private residential
    const commercialGia = details.commercialArea || 0;
    const residentialGia = gia - commercialGia;
    const affordableGia = details.affordableUnits ? 
      (residentialGia * (details.affordableUnits / (details.numberOfUnits || 1))) : 0;
    const privateGia = residentialGia - affordableGia;
    
    const privateResidential = privateGia * salesValuePerSqm;
    
    // Affordable housing at discounted value
    const affordableResidential = affordableGia * salesValuePerSqm * 0.45; // Approx 45% of market value
    
    // Commercial revenue
    let commercialValuePerSqm = retailValue;
    if (details.developmentType?.includes('office')) {
      commercialValuePerSqm = officeValue;
    }
    const commercial = commercialGia * commercialValuePerSqm;
    
    // Ground rents (if leasehold flats)
    let groundRents = 0;
    if (details.developmentType?.includes('flat') && details.numberOfUnits) {
      // Capitalize ground rents at typical yield
      const annualGroundRent = details.numberOfUnits * 350;
      groundRents = annualGroundRent / 0.05; // 5% yield
    }
    
    const totalRevenue = privateResidential + affordableResidential + commercial + groundRents;
    
    return {
      privateResidential,
      affordableResidential,
      commercial,
      groundRents,
      totalRevenue
    };
  }
  
  /**
   * Calculate target developer profit
   */
  private calculateTargetProfit(
    details: DevelopmentDetails,
    gdv: number
  ): number {
    let profitTarget = PROFIT_TARGETS.residential.target;
    
    if (details.commercialArea && details.commercialArea > 0) {
      profitTarget = PROFIT_TARGETS.mixedUse.target;
    }
    
    // Adjust for risk factors
    if (details.listedBuilding) {
      profitTarget += 0.025; // Higher risk premium
    }
    if (details.basementIncluded) {
      profitTarget += 0.015;
    }
    
    return gdv * profitTarget;
  }
  
  /**
   * Determine benchmark land value
   */
  private determineBenchmark(
    details: DevelopmentDetails,
    areaValues: Record<string, number>
  ): {
    existingUseValue: number;
    existingUsePlusPremium: number;
    alternativeUseValue: number;
    adoptedBenchmark: number;
    benchmarkBasis: string;
  } {
    const siteArea = details.siteArea || 0.1;
    
    // Extract area values with defaults
    const residentialValue = areaValues['residential'] || 15000000;
    const mixedUseValue = areaValues['mixedUse'] || 12000000;
    
    // Existing Use Value (assume residential)
    const existingUseValue = residentialValue * siteArea * 0.7; // Discount for existing
    
    // EUV plus premium (20-30% for incentive)
    const existingUsePlusPremium = existingUseValue * 1.25;
    
    // Alternative Use Value
    const alternativeUseValue = mixedUseValue * siteArea;
    
    // Adopt lower of EUV+ and AUV as per NPPF guidance
    const adoptedBenchmark = Math.min(existingUsePlusPremium, alternativeUseValue);
    
    let benchmarkBasis = 'Existing Use Value Plus Premium (EUV+)';
    if (adoptedBenchmark === alternativeUseValue) {
      benchmarkBasis = 'Alternative Use Value (AUV)';
    }
    
    return {
      existingUseValue,
      existingUsePlusPremium,
      alternativeUseValue,
      adoptedBenchmark,
      benchmarkBasis
    };
  }
  
  /**
   * Perform sensitivity analysis
   */
  private performSensitivityAnalysis(
    gdv: number,
    totalCosts: number,
    profit: number,
    benchmark: number
  ): {
    salesValueChange: { minus10: number; minus5: number; plus5: number; plus10: number };
    buildCostChange: { minus10: number; minus5: number; plus5: number; plus10: number };
    breakEvenSalesValue: number;
    breakEvenBuildCost: number;
  } {
    const baseResidual = gdv - totalCosts - profit;
    
    // Sales value sensitivity
    const salesMinus10 = (gdv * 0.90) - totalCosts - profit;
    const salesMinus5 = (gdv * 0.95) - totalCosts - profit;
    const salesPlus5 = (gdv * 1.05) - totalCosts - profit;
    const salesPlus10 = (gdv * 1.10) - totalCosts - profit;
    
    // Build cost sensitivity (reversed impact)
    const costMinus10 = gdv - (totalCosts * 0.90) - profit;
    const costMinus5 = gdv - (totalCosts * 0.95) - profit;
    const costPlus5 = gdv - (totalCosts * 1.05) - profit;
    const costPlus10 = gdv - (totalCosts * 1.10) - profit;
    
    // Break-even calculations
    const breakEvenSalesValue = ((totalCosts + profit + benchmark) / gdv) * 100;
    const breakEvenBuildCost = ((gdv - profit - benchmark) / totalCosts) * 100;
    
    return {
      salesValueChange: {
        minus10: salesMinus10 - benchmark,
        minus5: salesMinus5 - benchmark,
        plus5: salesPlus5 - benchmark,
        plus10: salesPlus10 - benchmark
      },
      buildCostChange: {
        minus10: costMinus10 - benchmark,
        minus5: costMinus5 - benchmark,
        plus5: costPlus5 - benchmark,
        plus10: costPlus10 - benchmark
      },
      breakEvenSalesValue,
      breakEvenBuildCost
    };
  }
  
  /**
   * Assess affordable housing contribution
   */
  private assessAffordableHousing(
    details: DevelopmentDetails,
    residualLandValue: number,
    benchmark: number
  ): {
    policyRequirement: number;
    proposedProvision: number;
    maximumViableContribution: number;
    commutedSumEquivalent: number;
    reviewMechanismRequired: boolean;
  } {
    const units = details.numberOfUnits || 1;
    const affordable = details.affordableUnits || 0;
    
    // Policy requirement (50% if over threshold)
    let policyRequirement = 0;
    if (units >= AFFORDABLE_HOUSING.thresholdUnits) {
      policyRequirement = Math.floor(units * AFFORDABLE_HOUSING.targetPercentage);
    }
    
    // Maximum viable (based on land value surplus)
    const surplus = Math.max(0, residualLandValue - benchmark);
    const maxViableUnits = Math.floor(surplus / AFFORDABLE_HOUSING.commutedSumPerUnit);
    const maximumViableContribution = Math.min(maxViableUnits, policyRequirement);
    
    // Commuted sum equivalent
    const commutedSumEquivalent = maximumViableContribution * AFFORDABLE_HOUSING.commutedSumPerUnit;
    
    // Review mechanism threshold
    const gdvEstimate = residualLandValue + benchmark + (units * 100000); // Rough estimate
    const reviewMechanismRequired = gdvEstimate >= AFFORDABLE_HOUSING.reviewMechanismThreshold;
    
    return {
      policyRequirement,
      proposedProvision: affordable,
      maximumViableContribution,
      commutedSumEquivalent,
      reviewMechanismRequired
    };
  }
  
  /**
   * Estimate build period in months
   */
  private estimateBuildPeriod(gia: number, details: DevelopmentDetails): number {
    let basePeriod = 12; // Base 12 months
    
    // Adjust for size
    basePeriod += Math.floor(gia / 200) * 2; // +2 months per 200sqm
    
    // Adjust for complexity
    if (details.basementIncluded) basePeriod += 6;
    if (details.listedBuilding) basePeriod += 4;
    if (details.conservationArea) basePeriod += 2;
    
    return Math.min(basePeriod, 36); // Cap at 3 years
  }
  
  /**
   * Calculate CIL contribution
   */
  private calculateCIL(
    gia: number,
    postcodeDistrict: string,
    details: DevelopmentDetails
  ): number {
    // Camden CIL rates (simplified)
    const cilRates: Record<string, number> = {
      'NW3': 500,
      'NW6': 400,
      'NW8': 450,
      'NW1': 400,
      'NW2': 350,
      'NW5': 375,
      'NW11': 350,
      'N2': 300,
      'N6': 350,
      'N10': 300
    };
    
    const rate = cilRates[postcodeDistrict] || 350;
    
    // CIL applies to net additional floorspace
    const existingFloorspace = 0; // Assume new build
    const netAdditional = Math.max(0, gia - existingFloorspace);
    
    // Social housing exemption
    const affordableArea = details.affordableUnits ? 
      (gia * (details.affordableUnits / (details.numberOfUnits || 1))) : 0;
    const chargeableArea = netAdditional - affordableArea;
    
    return Math.max(0, chargeableArea * rate);
  }
  
  /**
   * Calculate S106 contribution
   */
  private calculateS106(details: DevelopmentDetails): number {
    let s106 = 0;
    const units = details.numberOfUnits || 1;
    
    // Transport contributions
    s106 += units * 2000;
    
    // Open space contributions (if no on-site provision)
    s106 += units * 1500;
    
    // Employment and training
    if (units >= 10) {
      s106 += 15000;
    }
    
    // Community facilities
    if (units >= 20) {
      s106 += 25000;
    }
    
    return s106;
  }
  
  /**
   * Generate assumptions
   */
  private generateAssumptions(
    details: DevelopmentDetails,
    postcodeDistrict: string
  ): string[] {
    return [
      `Build costs based on ${details.buildQuality || 'medium'} quality specification`,
      `Sales values derived from ${postcodeDistrict} market comparables`,
      `Professional fees at ${details.listedBuilding ? '18%' : '15%'} of build cost`,
      `Development finance at ${(FINANCE_COSTS.debtInterestRate * 100).toFixed(1)}% interest rate`,
      `65% loan-to-cost ratio assumed for development finance`,
      `Target profit at ${(PROFIT_TARGETS.residential.target * 100).toFixed(1)}% on GDV`,
      `Benchmark land value based on EUV+ methodology per NPPF`,
      `CIL rates as per Camden Council charging schedule`,
      `S106 contributions estimated based on Camden SPD`,
      `No abnormal ground conditions assumed unless specified`,
      `Planning approval achievable within standard timescales`,
      `No requirement for archaeological investigation unless specified`
    ];
  }
  
  /**
   * Generate caveats
   */
  private generateCaveats(details: DevelopmentDetails): string[] {
    const caveats = [
      'This assessment provides indicative guidance only and should not be relied upon for decision-making',
      'A formal viability assessment should be prepared by a qualified surveyor (RICS)',
      'All costs and values should be verified through market research and tender prices',
      'The assessment does not account for site-specific abnormal costs without survey data',
      'Finance costs may vary significantly based on developer track record and market conditions'
    ];
    
    if (details.listedBuilding) {
      caveats.push('Listed building works may incur significant additional costs for specialist repairs');
    }
    
    if (details.basementIncluded) {
      caveats.push('Basement construction costs are highly variable depending on ground conditions');
    }
    
    return caveats;
  }
  
  /**
   * Generate recommendations
   */
  private generateRecommendations(
    viabilityRating: string,
    affordableAssessment: {
      policyRequirement: number;
      proposedProvision: number;
      maximumViableContribution: number;
    }
  ): string[] {
    const recommendations: string[] = [];
    
    if (viabilityRating === 'unviable') {
      recommendations.push('Consider redesigning the scheme to reduce costs or increase density');
      recommendations.push('Explore grant funding opportunities for affordable housing');
      recommendations.push('Consider phased delivery to manage cash flow');
    } else if (viabilityRating === 'weak') {
      recommendations.push('Review specification to identify potential cost savings');
      recommendations.push('Negotiate affordable housing provision with planning authority');
      recommendations.push('Include viability review mechanism in S106 agreement');
    } else if (viabilityRating === 'marginal') {
      recommendations.push('Build in appropriate contingencies for market fluctuations');
      recommendations.push('Consider viability review at trigger points');
    } else {
      recommendations.push('Scheme appears financially viable at current market conditions');
    }
    
    if (affordableAssessment.proposedProvision < affordableAssessment.policyRequirement) {
      recommendations.push(
        `Consider increasing affordable housing to meet ${affordableAssessment.policyRequirement} unit policy requirement`
      );
    }
    
    recommendations.push('Engage with Camden pre-application service to discuss viability early');
    recommendations.push('Commission formal RICS-compliant viability assessment for application');
    
    return recommendations;
  }
  
  /**
   * Get abnormal cost guidance
   */
  getAbnormalCostGuidance(): Record<string, {
    description: string;
    typicalCost: string;
    perUnit: string;
  }> {
    return ABNORMAL_COSTS;
  }
  
  /**
   * Extract postcode from address
   */
  private extractPostcode(address: string): string {
    const postcodeRegex = /([A-Z]{1,2}[0-9][0-9A-Z]?\s?[0-9][A-Z]{2})/i;
    const match = address.match(postcodeRegex);
    return match && match[1] ? match[1].toUpperCase() : 'NW3 1AA';
  }
}

export default ViabilityAssessmentService;
