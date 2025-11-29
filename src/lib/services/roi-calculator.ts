/**
 * ROI Calculator Service
 * Calculate property value increase vs project cost
 */

export interface ProjectCosts {
  constructionCost: CostRange;
  professionalFees: CostRange;
  planningFees: number;
  buildingRegsFees: number;
  partyWallCosts?: CostRange;
  contingency: number; // percentage
  totalCost: CostRange;
}

export interface CostRange {
  low: number;
  mid: number;
  high: number;
}

export interface ValueIncrease {
  percentageIncrease: CostRange;
  absoluteIncrease: CostRange;
  pricePerSqFt: {
    before: number;
    after: number;
  };
}

export interface ROICalculation {
  projectType: string;
  propertyValue: number;
  propertyType: string;
  area: string;
  
  // Costs
  costs: ProjectCosts;
  
  // Value increase
  valueIncrease: ValueIncrease;
  
  // ROI
  roi: {
    low: number;   // percentage return
    mid: number;
    high: number;
  };
  
  // Payback
  netGain: CostRange;
  worthDoing: boolean;
  confidence: 'high' | 'medium' | 'low';
  
  // Recommendations
  recommendations: string[];
  warnings: string[];
  
  // Comparisons
  alternativeProjects?: {
    projectType: string;
    roi: number;
    netGain: number;
  }[];
}

// ===========================================
// COST DATA BY PROJECT TYPE
// ===========================================

interface ProjectCostData {
  constructionPerSqm: CostRange; // £ per square meter
  professionalFeesPercent: number;
  typicalSize: CostRange; // square meters
  planningFee: number;
  buildingRegsFee: number;
  needsPartyWall: boolean;
  partyWallCost?: CostRange;
  timeWeeks: CostRange;
}

const PROJECT_COSTS: Record<string, ProjectCostData> = {
  'rear-extension-single': {
    constructionPerSqm: { low: 1800, mid: 2200, high: 3000 },
    professionalFeesPercent: 12,
    typicalSize: { low: 12, mid: 18, high: 25 },
    planningFee: 258,
    buildingRegsFee: 800,
    needsPartyWall: true,
    partyWallCost: { low: 800, mid: 1500, high: 3000 },
    timeWeeks: { low: 10, mid: 14, high: 20 },
  },
  'rear-extension-double': {
    constructionPerSqm: { low: 2000, mid: 2500, high: 3500 },
    professionalFeesPercent: 12,
    typicalSize: { low: 20, mid: 30, high: 45 },
    planningFee: 258,
    buildingRegsFee: 1000,
    needsPartyWall: true,
    partyWallCost: { low: 1200, mid: 2500, high: 5000 },
    timeWeeks: { low: 16, mid: 22, high: 30 },
  },
  'side-return': {
    constructionPerSqm: { low: 2200, mid: 2800, high: 3800 },
    professionalFeesPercent: 12,
    typicalSize: { low: 8, mid: 12, high: 18 },
    planningFee: 258,
    buildingRegsFee: 700,
    needsPartyWall: true,
    partyWallCost: { low: 600, mid: 1200, high: 2000 },
    timeWeeks: { low: 8, mid: 12, high: 16 },
  },
  'loft-conversion': {
    constructionPerSqm: { low: 1500, mid: 2000, high: 2800 },
    professionalFeesPercent: 10,
    typicalSize: { low: 25, mid: 40, high: 60 },
    planningFee: 258,
    buildingRegsFee: 900,
    needsPartyWall: true,
    partyWallCost: { low: 800, mid: 1500, high: 3000 },
    timeWeeks: { low: 8, mid: 12, high: 18 },
  },
  'basement': {
    constructionPerSqm: { low: 3000, mid: 4000, high: 6000 },
    professionalFeesPercent: 15,
    typicalSize: { low: 30, mid: 50, high: 80 },
    planningFee: 258,
    buildingRegsFee: 1500,
    needsPartyWall: true,
    partyWallCost: { low: 3000, mid: 6000, high: 12000 },
    timeWeeks: { low: 24, mid: 36, high: 52 },
  },
  'garden-room': {
    constructionPerSqm: { low: 1200, mid: 1800, high: 2500 },
    professionalFeesPercent: 8,
    typicalSize: { low: 10, mid: 15, high: 25 },
    planningFee: 0, // Usually PD
    buildingRegsFee: 0, // Usually exempt
    needsPartyWall: false,
    timeWeeks: { low: 4, mid: 6, high: 10 },
  },
  'garage-conversion': {
    constructionPerSqm: { low: 800, mid: 1200, high: 1800 },
    professionalFeesPercent: 8,
    typicalSize: { low: 15, mid: 20, high: 30 },
    planningFee: 258,
    buildingRegsFee: 600,
    needsPartyWall: false,
    timeWeeks: { low: 6, mid: 8, high: 12 },
  },
  'wrap-around': {
    constructionPerSqm: { low: 2200, mid: 2800, high: 3800 },
    professionalFeesPercent: 12,
    typicalSize: { low: 25, mid: 35, high: 50 },
    planningFee: 258,
    buildingRegsFee: 1000,
    needsPartyWall: true,
    partyWallCost: { low: 1500, mid: 3000, high: 5000 },
    timeWeeks: { low: 14, mid: 20, high: 28 },
  },
};

// ===========================================
// VALUE INCREASE DATA BY AREA AND PROJECT
// ===========================================

interface AreaValueData {
  pricePerSqFt: number;
  projectValueIncrease: Record<string, number>; // percentage increase
}

const AREA_VALUE_DATA: Record<string, AreaValueData> = {
  'NW3': { // Hampstead
    pricePerSqFt: 1450,
    projectValueIncrease: {
      'rear-extension-single': 8,
      'rear-extension-double': 12,
      'side-return': 6,
      'loft-conversion': 15,
      'basement': 25,
      'garden-room': 4,
      'garage-conversion': 3,
      'wrap-around': 14,
    },
  },
  'N6': { // Highgate
    pricePerSqFt: 1100,
    projectValueIncrease: {
      'rear-extension-single': 10,
      'rear-extension-double': 14,
      'side-return': 7,
      'loft-conversion': 18,
      'basement': 22,
      'garden-room': 5,
      'garage-conversion': 4,
      'wrap-around': 16,
    },
  },
  'N10': { // Muswell Hill
    pricePerSqFt: 750,
    projectValueIncrease: {
      'rear-extension-single': 10,
      'rear-extension-double': 14,
      'side-return': 8,
      'loft-conversion': 12,
      'basement': 18,
      'garden-room': 6,
      'garage-conversion': 5,
      'wrap-around': 15,
    },
  },
  'N8': { // Crouch End
    pricePerSqFt: 700,
    projectValueIncrease: {
      'rear-extension-single': 10,
      'rear-extension-double': 13,
      'side-return': 8,
      'loft-conversion': 12,
      'basement': 15,
      'garden-room': 5,
      'garage-conversion': 5,
      'wrap-around': 14,
    },
  },
  'NW1': { // Primrose Hill/Camden
    pricePerSqFt: 1200,
    projectValueIncrease: {
      'rear-extension-single': 9,
      'rear-extension-double': 13,
      'side-return': 7,
      'loft-conversion': 16,
      'basement': 24,
      'garden-room': 5,
      'garage-conversion': 3,
      'wrap-around': 15,
    },
  },
  'NW8': { // St Johns Wood
    pricePerSqFt: 1300,
    projectValueIncrease: {
      'rear-extension-single': 8,
      'rear-extension-double': 12,
      'side-return': 6,
      'loft-conversion': 14,
      'basement': 22,
      'garden-room': 4,
      'garage-conversion': 3,
      'wrap-around': 13,
    },
  },
  'NW11': { // Golders Green
    pricePerSqFt: 700,
    projectValueIncrease: {
      'rear-extension-single': 12,
      'rear-extension-double': 16,
      'side-return': 9,
      'loft-conversion': 14,
      'basement': 20,
      'garden-room': 6,
      'garage-conversion': 5,
      'wrap-around': 17,
    },
  },
  'N2': { // East Finchley
    pricePerSqFt: 650,
    projectValueIncrease: {
      'rear-extension-single': 12,
      'rear-extension-double': 16,
      'side-return': 9,
      'loft-conversion': 13,
      'basement': 18,
      'garden-room': 6,
      'garage-conversion': 6,
      'wrap-around': 17,
    },
  },
  'N3': { // Finchley Central
    pricePerSqFt: 600,
    projectValueIncrease: {
      'rear-extension-single': 13,
      'rear-extension-double': 17,
      'side-return': 10,
      'loft-conversion': 14,
      'basement': 19,
      'garden-room': 7,
      'garage-conversion': 6,
      'wrap-around': 18,
    },
  },
  'default': {
    pricePerSqFt: 650,
    projectValueIncrease: {
      'rear-extension-single': 10,
      'rear-extension-double': 14,
      'side-return': 8,
      'loft-conversion': 12,
      'basement': 18,
      'garden-room': 5,
      'garage-conversion': 5,
      'wrap-around': 15,
    },
  },
};

// ===========================================
// ROI CALCULATOR SERVICE
// ===========================================

class ROICalculatorService {
  /**
   * Calculate full ROI for a project
   */
  calculateROI(
    projectType: string,
    propertyValue: number,
    postcode: string,
    propertyType: string,
    customSize?: number,
    heritageStatus?: 'RED' | 'AMBER' | 'GREEN'
  ): ROICalculation {
    const district = postcode.toUpperCase().split(' ')[0];
    const areaData = AREA_VALUE_DATA[district] || AREA_VALUE_DATA['default'];
    const projectCostData = PROJECT_COSTS[projectType];
    
    if (!projectCostData) {
      throw new Error(`Unknown project type: ${projectType}`);
    }
    
    // Calculate costs
    const size = customSize || projectCostData.typicalSize.mid;
    const costs = this.calculateCosts(projectCostData, size, heritageStatus);
    
    // Calculate value increase
    const valueIncreasePercent = areaData.projectValueIncrease[projectType] || 10;
    const valueIncrease = this.calculateValueIncrease(propertyValue, valueIncreasePercent, size, areaData.pricePerSqFt);
    
    // Calculate ROI
    const roi = this.calculateROIPercentage(costs, valueIncrease);
    
    // Calculate net gain
    const netGain: CostRange = {
      low: valueIncrease.absoluteIncrease.low - costs.totalCost.high,
      mid: valueIncrease.absoluteIncrease.mid - costs.totalCost.mid,
      high: valueIncrease.absoluteIncrease.high - costs.totalCost.low,
    };
    
    // Generate recommendations
    const recommendations = this.generateRecommendations(projectType, roi, netGain, heritageStatus, district);
    const warnings = this.generateWarnings(projectType, costs, heritageStatus, district);
    
    // Compare alternatives
    const alternativeProjects = this.getAlternativeProjects(propertyValue, district, projectType);
    
    return {
      projectType,
      propertyValue,
      propertyType,
      area: district,
      costs,
      valueIncrease,
      roi,
      netGain,
      worthDoing: roi.mid > 0,
      confidence: this.determineConfidence(projectType, district),
      recommendations,
      warnings,
      alternativeProjects,
    };
  }

  /**
   * Calculate project costs
   */
  private calculateCosts(
    data: ProjectCostData,
    size: number,
    heritageStatus?: 'RED' | 'AMBER' | 'GREEN'
  ): ProjectCosts {
    // Heritage premium
    const heritagePremium = heritageStatus === 'RED' ? 1.3 : heritageStatus === 'AMBER' ? 1.15 : 1;
    
    const constructionCost: CostRange = {
      low: Math.round(data.constructionPerSqm.low * size * heritagePremium),
      mid: Math.round(data.constructionPerSqm.mid * size * heritagePremium),
      high: Math.round(data.constructionPerSqm.high * size * heritagePremium),
    };
    
    const professionalFees: CostRange = {
      low: Math.round(constructionCost.low * (data.professionalFeesPercent / 100)),
      mid: Math.round(constructionCost.mid * (data.professionalFeesPercent / 100)),
      high: Math.round(constructionCost.high * (data.professionalFeesPercent / 100)),
    };
    
    // Heritage adds extra professional fees
    if (heritageStatus === 'RED') {
      professionalFees.low += 2000;
      professionalFees.mid += 3500;
      professionalFees.high += 5000;
    } else if (heritageStatus === 'AMBER') {
      professionalFees.low += 500;
      professionalFees.mid += 1000;
      professionalFees.high += 2000;
    }
    
    const contingency = 10;
    
    const baseTotalLow = constructionCost.low + professionalFees.low + data.planningFee + data.buildingRegsFee;
    const baseTotalMid = constructionCost.mid + professionalFees.mid + data.planningFee + data.buildingRegsFee;
    const baseTotalHigh = constructionCost.high + professionalFees.high + data.planningFee + data.buildingRegsFee;
    
    let partyWallCosts: CostRange | undefined;
    if (data.needsPartyWall && data.partyWallCost) {
      partyWallCosts = data.partyWallCost;
    }
    
    const totalCost: CostRange = {
      low: Math.round(baseTotalLow * (1 + contingency / 100) + (partyWallCosts?.low || 0)),
      mid: Math.round(baseTotalMid * (1 + contingency / 100) + (partyWallCosts?.mid || 0)),
      high: Math.round(baseTotalHigh * (1 + contingency / 100) + (partyWallCosts?.high || 0)),
    };
    
    return {
      constructionCost,
      professionalFees,
      planningFees: data.planningFee,
      buildingRegsFees: data.buildingRegsFee,
      partyWallCosts,
      contingency,
      totalCost,
    };
  }

  /**
   * Calculate value increase
   */
  private calculateValueIncrease(
    propertyValue: number,
    percentageIncrease: number,
    newSqm: number,
    pricePerSqFt: number
  ): ValueIncrease {
    // Convert sqm to sqft
    const newSqFt = newSqm * 10.764;
    
    // Value based on area's price per sqft
    const valueFromSpace = newSqFt * pricePerSqFt;
    
    // Percentage-based increase
    const percentageValue = propertyValue * (percentageIncrease / 100);
    
    // Use the higher of the two methods, with range
    const midIncrease = Math.max(valueFromSpace, percentageValue);
    
    return {
      percentageIncrease: {
        low: percentageIncrease * 0.7,
        mid: percentageIncrease,
        high: percentageIncrease * 1.3,
      },
      absoluteIncrease: {
        low: Math.round(midIncrease * 0.7),
        mid: Math.round(midIncrease),
        high: Math.round(midIncrease * 1.3),
      },
      pricePerSqFt: {
        before: pricePerSqFt,
        after: pricePerSqFt, // Simplified - could adjust for improvement quality
      },
    };
  }

  /**
   * Calculate ROI percentage
   */
  private calculateROIPercentage(costs: ProjectCosts, valueIncrease: ValueIncrease): CostRange {
    return {
      low: Math.round(((valueIncrease.absoluteIncrease.low - costs.totalCost.high) / costs.totalCost.high) * 100),
      mid: Math.round(((valueIncrease.absoluteIncrease.mid - costs.totalCost.mid) / costs.totalCost.mid) * 100),
      high: Math.round(((valueIncrease.absoluteIncrease.high - costs.totalCost.low) / costs.totalCost.low) * 100),
    };
  }

  /**
   * Generate recommendations
   */
  private generateRecommendations(
    projectType: string,
    roi: CostRange,
    netGain: CostRange,
    heritageStatus?: 'RED' | 'AMBER' | 'GREEN',
    district?: string
  ): string[] {
    const recommendations: string[] = [];
    
    if (roi.mid > 50) {
      recommendations.push('Excellent ROI - this project is highly recommended for value');
    } else if (roi.mid > 20) {
      recommendations.push('Good ROI - this project should add significant value');
    } else if (roi.mid > 0) {
      recommendations.push('Modest ROI - consider your lifestyle needs alongside financial return');
    } else {
      recommendations.push('Limited ROI - proceed only if lifestyle benefits justify the cost');
    }
    
    if (netGain.mid > 100000) {
      recommendations.push(`Potential net gain of £${(netGain.mid / 1000).toFixed(0)}k makes this a strong investment`);
    }
    
    if (projectType === 'loft-conversion') {
      recommendations.push('Loft conversions typically offer the best ROI - minimal disruption, maximum space');
    }
    
    if (projectType === 'basement' && heritageStatus !== 'RED') {
      recommendations.push('Basements add premium value in high-value areas');
    }
    
    if (heritageStatus === 'RED') {
      recommendations.push('Heritage premium: higher costs but also potentially higher value in period properties');
    }
    
    if (district === 'NW3' || district === 'N6') {
      recommendations.push('High-value area - quality of finish significantly impacts final value');
    }
    
    return recommendations;
  }

  /**
   * Generate warnings
   */
  private generateWarnings(
    projectType: string,
    costs: ProjectCosts,
    heritageStatus?: 'RED' | 'AMBER' | 'GREEN',
    district?: string
  ): string[] {
    const warnings: string[] = [];
    
    if (projectType === 'basement') {
      warnings.push('Basement projects are complex - budget overruns of 20-30% are common');
      warnings.push('Basement works can take 6-12 months - consider temporary accommodation costs');
    }
    
    if (heritageStatus === 'RED') {
      warnings.push('Listed building consent can be refused - get pre-application advice first');
      warnings.push('Materials must be traditional - budget for higher-cost options');
    }
    
    if (heritageStatus === 'AMBER' && (district === 'NW3' || district === 'N6')) {
      warnings.push('Conservation areas in this district are strictly controlled');
    }
    
    if (costs.totalCost.high - costs.totalCost.low > 50000) {
      warnings.push('Wide cost range - get multiple detailed quotes before proceeding');
    }
    
    warnings.push('Costs are estimates only - always get fixed-price quotes from contractors');
    
    return warnings;
  }

  /**
   * Get alternative projects to compare
   */
  private getAlternativeProjects(
    propertyValue: number,
    district: string,
    currentProject: string
  ): ROICalculation['alternativeProjects'] {
    const alternatives: ROICalculation['alternativeProjects'] = [];
    
    const projectTypes = Object.keys(PROJECT_COSTS).filter(p => p !== currentProject);
    
    for (const projectType of projectTypes.slice(0, 4)) {
      try {
        const altCalc = this.calculateROI(projectType, propertyValue, district, 'house');
        alternatives.push({
          projectType,
          roi: altCalc.roi.mid,
          netGain: altCalc.netGain.mid,
        });
      } catch {
        // Skip if calculation fails
      }
    }
    
    return alternatives.sort((a, b) => b.roi - a.roi);
  }

  /**
   * Determine confidence level
   */
  private determineConfidence(projectType: string, district: string): 'high' | 'medium' | 'low' {
    const highConfidenceAreas = ['NW3', 'N6', 'N10', 'N8', 'NW1'];
    const highConfidenceProjects = ['loft-conversion', 'rear-extension-single', 'side-return'];
    
    if (highConfidenceAreas.includes(district) && highConfidenceProjects.includes(projectType)) {
      return 'high';
    }
    
    if (highConfidenceAreas.includes(district) || highConfidenceProjects.includes(projectType)) {
      return 'medium';
    }
    
    return 'low';
  }

  /**
   * Quick estimate
   */
  quickEstimate(
    projectType: string,
    propertyValue: number,
    postcode: string
  ): { cost: string; valueIncrease: string; roi: string; worthIt: boolean } {
    try {
      const calc = this.calculateROI(projectType, propertyValue, postcode, 'house');
      return {
        cost: `£${(calc.costs.totalCost.low / 1000).toFixed(0)}k - £${(calc.costs.totalCost.high / 1000).toFixed(0)}k`,
        valueIncrease: `£${(calc.valueIncrease.absoluteIncrease.low / 1000).toFixed(0)}k - £${(calc.valueIncrease.absoluteIncrease.high / 1000).toFixed(0)}k`,
        roi: `${calc.roi.low}% - ${calc.roi.high}%`,
        worthIt: calc.worthDoing,
      };
    } catch {
      return {
        cost: 'Unable to estimate',
        valueIncrease: 'Unable to estimate',
        roi: 'Unable to estimate',
        worthIt: false,
      };
    }
  }
}

// Export singleton
export const roiCalculator = new ROICalculatorService();

// Export types
export type { ProjectCostData, AreaValueData };
