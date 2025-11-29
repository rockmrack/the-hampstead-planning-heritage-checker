/**
 * Value Enhancement Service
 * Property value impact analysis and optimization
 * Helps users understand ROI of different improvements
 */

// Types
interface ValueFactor {
  factor: string;
  category: 'structural' | 'cosmetic' | 'planning' | 'location' | 'heritage';
  impactRange: { min: number; max: number }; // Percentage
  costRange: { min: number; max: number };
  timeframe: string;
  heritageConsiderations: string[];
}

interface PropertyValuation {
  estimatedValue: number;
  confidence: 'low' | 'medium' | 'high';
  valuationBasis: string;
}

interface ImprovementImpact {
  improvement: string;
  costEstimate: { min: number; max: number };
  valueIncrease: { min: number; max: number };
  roi: number; // Percentage
  risk: 'low' | 'medium' | 'high';
  planningRequired: boolean;
  heritageImpact: string;
}

interface EnhancementPlan {
  property: {
    postcode: string;
    estimatedValue: number;
  };
  improvements: ImprovementImpact[];
  totalInvestment: { min: number; max: number };
  totalValueIncrease: { min: number; max: number };
  overallRoi: number;
  recommendations: string[];
  warnings: string[];
}

// Hampstead area baseline values (per sq ft)
const AREA_VALUES: Record<string, number> = {
  'NW3': 1200, // Hampstead core
  'NW6': 950,  // West Hampstead
  'NW8': 1100, // St John's Wood
  'NW11': 850, // Hampstead Garden Suburb
  'N2': 750,   // East Finchley
  'N6': 900,   // Highgate
  'N10': 700,  // Muswell Hill
};

// Heritage premium multipliers
const HERITAGE_PREMIUMS = {
  'Grade I': 1.35,
  'Grade II*': 1.25,
  'Grade II': 1.15,
  'Conservation Area': 1.10,
  'None': 1.00,
};

// Value enhancement factors
const VALUE_FACTORS: ValueFactor[] = [
  {
    factor: 'Loft conversion (permitted development)',
    category: 'structural',
    impactRange: { min: 10, max: 20 },
    costRange: { min: 45000, max: 75000 },
    timeframe: '3-4 months',
    heritageConsiderations: [
      'Not available in conservation areas without permission',
      'Listed buildings require LBC',
    ],
  },
  {
    factor: 'Rear extension (single storey)',
    category: 'structural',
    impactRange: { min: 5, max: 12 },
    costRange: { min: 50000, max: 100000 },
    timeframe: '3-5 months',
    heritageConsiderations: [
      'Conservation area may limit size/materials',
      'Must be sympathetic to original design',
    ],
  },
  {
    factor: 'Basement conversion',
    category: 'structural',
    impactRange: { min: 15, max: 30 },
    costRange: { min: 150000, max: 350000 },
    timeframe: '6-12 months',
    heritageConsiderations: [
      'Camden basement policy restricts in conservation areas',
      'Archaeology assessment may be required',
    ],
  },
  {
    factor: 'Kitchen renovation (high spec)',
    category: 'cosmetic',
    impactRange: { min: 3, max: 8 },
    costRange: { min: 25000, max: 60000 },
    timeframe: '4-8 weeks',
    heritageConsiderations: [
      'Maintain period features if listed',
      'Consider proportions of historic rooms',
    ],
  },
  {
    factor: 'Bathroom renovation (main)',
    category: 'cosmetic',
    impactRange: { min: 2, max: 5 },
    costRange: { min: 15000, max: 35000 },
    timeframe: '2-4 weeks',
    heritageConsiderations: [
      'Preserve original fixtures where possible',
      'Period-appropriate sanitaryware available',
    ],
  },
  {
    factor: 'Garden landscaping',
    category: 'cosmetic',
    impactRange: { min: 2, max: 5 },
    costRange: { min: 10000, max: 40000 },
    timeframe: '2-6 weeks',
    heritageConsiderations: [
      'TPO trees must be protected',
      'Historic garden layouts may have significance',
    ],
  },
  {
    factor: 'Period feature restoration',
    category: 'heritage',
    impactRange: { min: 3, max: 10 },
    costRange: { min: 5000, max: 30000 },
    timeframe: '2-8 weeks',
    heritageConsiderations: [
      'Adds authenticity premium',
      'Use specialist heritage craftsmen',
    ],
  },
  {
    factor: 'Sash window restoration',
    category: 'heritage',
    impactRange: { min: 2, max: 5 },
    costRange: { min: 8000, max: 25000 },
    timeframe: '1-3 weeks',
    heritageConsiderations: [
      'Essential for listed buildings',
      'Can improve energy efficiency significantly',
    ],
  },
  {
    factor: 'Energy efficiency upgrade (EPC improvement)',
    category: 'cosmetic',
    impactRange: { min: 2, max: 6 },
    costRange: { min: 5000, max: 20000 },
    timeframe: '2-4 weeks',
    heritageConsiderations: [
      'Use heritage-compatible methods',
      'Avoid external cladding in conservation areas',
    ],
  },
  {
    factor: 'Planning permission secured (extension)',
    category: 'planning',
    impactRange: { min: 8, max: 15 },
    costRange: { min: 5000, max: 15000 },
    timeframe: '3-6 months',
    heritageConsiderations: [
      'Premium for pre-approved heritage schemes',
      'Reduces buyer uncertainty',
    ],
  },
  {
    factor: 'Off-street parking',
    category: 'structural',
    impactRange: { min: 5, max: 15 },
    costRange: { min: 15000, max: 50000 },
    timeframe: '1-3 months',
    heritageConsiderations: [
      'Crossover applications complex in conservation areas',
      'Front garden character must be maintained',
    ],
  },
];

// Value detractors
const VALUE_DETRACTORS = [
  { issue: 'Japanese knotweed', impact: -15 },
  { issue: 'Subsidence history', impact: -10 },
  { issue: 'Damp/structural issues', impact: -12 },
  { issue: 'Short lease (<80 years)', impact: -25 },
  { issue: 'Flying freehold', impact: -8 },
  { issue: 'Planning enforcement notice', impact: -20 },
  { issue: 'Restrictive covenants', impact: -5 },
  { issue: 'Article 4 direction', impact: -3 },
];

// Service class
export class ValueEnhancementService {
  /**
   * Estimate property value
   */
  estimateValue(
    postcode: string,
    squareFootage: number,
    bedrooms: number,
    heritageStatus: keyof typeof HERITAGE_PREMIUMS = 'None'
  ): PropertyValuation {
    // Extract outcode - handle both "NW3 1AA" and "NW3" formats
    const parts = postcode.split(' ');
    const outcode = (parts[0] || postcode).toUpperCase();
    const baseValue = AREA_VALUES[outcode] || 800;
    
    // Calculate base value
    let value = baseValue * squareFootage;
    
    // Bedroom adjustment
    const bedroomPremium = bedrooms >= 4 ? 1.1 : bedrooms === 3 ? 1.05 : 1.0;
    value *= bedroomPremium;
    
    // Heritage premium
    const heritagePremium = HERITAGE_PREMIUMS[heritageStatus] || 1.0;
    value *= heritagePremium;
    
    return {
      estimatedValue: Math.round(value / 1000) * 1000,
      confidence: 'medium',
      valuationBasis: `Based on ${outcode} average of £${baseValue}/sqft with heritage premium`,
    };
  }

  /**
   * Analyze improvement ROI
   */
  analyzeImprovement(
    improvement: string,
    propertyValue: number,
    isListed: boolean,
    inConservationArea: boolean
  ): ImprovementImpact | null {
    const factor = VALUE_FACTORS.find(
      f => f.factor.toLowerCase().includes(improvement.toLowerCase())
    );
    
    if (!factor) return null;
    
    // Calculate value increase
    const avgImpact = (factor.impactRange.min + factor.impactRange.max) / 2;
    const minIncrease = Math.round(propertyValue * (factor.impactRange.min / 100));
    const maxIncrease = Math.round(propertyValue * (factor.impactRange.max / 100));
    
    // Calculate ROI
    const avgCost = (factor.costRange.min + factor.costRange.max) / 2;
    const avgIncrease = (minIncrease + maxIncrease) / 2;
    const roi = Math.round((avgIncrease / avgCost) * 100);
    
    // Determine risk
    let risk: 'low' | 'medium' | 'high' = 'low';
    if (factor.category === 'structural') risk = 'medium';
    if (isListed && factor.heritageConsiderations.length > 0) risk = 'high';
    
    // Determine planning requirement
    let planningRequired = factor.category === 'structural';
    if (inConservationArea && factor.category !== 'cosmetic') planningRequired = true;
    if (isListed) planningRequired = true;
    
    // Heritage impact
    let heritageImpact = 'None';
    if (isListed) {
      heritageImpact = factor.heritageConsiderations.join('; ');
    } else if (inConservationArea) {
      heritageImpact = 'Conservation area restrictions may apply';
    }
    
    return {
      improvement: factor.factor,
      costEstimate: factor.costRange,
      valueIncrease: { min: minIncrease, max: maxIncrease },
      roi,
      risk,
      planningRequired,
      heritageImpact,
    };
  }

  /**
   * Get enhancement plan
   */
  getEnhancementPlan(
    postcode: string,
    propertyValue: number,
    desiredImprovements: string[],
    isListed: boolean,
    inConservationArea: boolean
  ): EnhancementPlan {
    const improvements: ImprovementImpact[] = [];
    const warnings: string[] = [];
    const recommendations: string[] = [];
    
    for (const improvement of desiredImprovements) {
      const impact = this.analyzeImprovement(
        improvement,
        propertyValue,
        isListed,
        inConservationArea
      );
      
      if (impact) {
        improvements.push(impact);
        
        if (impact.risk === 'high') {
          warnings.push(`${impact.improvement}: High risk due to heritage constraints`);
        }
        
        if (impact.roi > 150) {
          recommendations.push(`${impact.improvement}: Excellent ROI of ${impact.roi}%`);
        }
      }
    }
    
    // Sort by ROI
    improvements.sort((a, b) => b.roi - a.roi);
    
    // Calculate totals
    const totalInvestment = improvements.reduce(
      (acc, i) => ({
        min: acc.min + i.costEstimate.min,
        max: acc.max + i.costEstimate.max,
      }),
      { min: 0, max: 0 }
    );
    
    const totalValueIncrease = improvements.reduce(
      (acc, i) => ({
        min: acc.min + i.valueIncrease.min,
        max: acc.max + i.valueIncrease.max,
      }),
      { min: 0, max: 0 }
    );
    
    const avgInvestment = (totalInvestment.min + totalInvestment.max) / 2;
    const avgIncrease = (totalValueIncrease.min + totalValueIncrease.max) / 2;
    const overallRoi = avgInvestment > 0 ? Math.round((avgIncrease / avgInvestment) * 100) : 0;
    
    // Add general recommendations
    if (isListed) {
      recommendations.push('Prioritize period feature restoration for maximum heritage premium');
      recommendations.push('Use Heritage England accredited contractors');
    }
    
    if (inConservationArea) {
      recommendations.push('Consider Article 4 restrictions before external works');
      recommendations.push('Front elevation changes will require planning permission');
    }
    
    return {
      property: { postcode, estimatedValue: propertyValue },
      improvements,
      totalInvestment,
      totalValueIncrease,
      overallRoi,
      recommendations,
      warnings,
    };
  }

  /**
   * Get value detractors
   */
  getValueDetractors(): typeof VALUE_DETRACTORS {
    return VALUE_DETRACTORS;
  }

  /**
   * Calculate detractor impact
   */
  calculateDetractorImpact(
    propertyValue: number,
    issues: string[]
  ): { totalImpact: number; details: Array<{ issue: string; loss: number }> } {
    const details: Array<{ issue: string; loss: number }> = [];
    let totalImpact = 0;
    
    for (const issue of issues) {
      const detractor = VALUE_DETRACTORS.find(
        d => d.issue.toLowerCase().includes(issue.toLowerCase())
      );
      
      if (detractor) {
        const loss = Math.round(propertyValue * (Math.abs(detractor.impact) / 100));
        details.push({ issue: detractor.issue, loss });
        totalImpact += detractor.impact;
      }
    }
    
    return {
      totalImpact,
      details,
    };
  }

  /**
   * Get available enhancement factors
   */
  getEnhancementFactors(): ValueFactor[] {
    return VALUE_FACTORS;
  }

  /**
   * Get heritage premium info
   */
  getHeritagePremiums(): typeof HERITAGE_PREMIUMS {
    return HERITAGE_PREMIUMS;
  }
}

// Export singleton instance
export const valueEnhancementService = new ValueEnhancementService();
