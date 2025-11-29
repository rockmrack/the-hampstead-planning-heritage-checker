/**
 * Success Predictor Service
 * 
 * Machine learning-style prediction of planning application success:
 * - Historical analysis
 * - Factor weighting
 * - Risk assessment
 * - Improvement suggestions
 */

// Types
export interface SuccessPrediction {
  overallProbability: number; // 0-100
  confidence: 'low' | 'medium' | 'high';
  riskLevel: 'low' | 'medium' | 'high' | 'very_high';
  factors: PredictionFactor[];
  historicalComparison: HistoricalData;
  improvements: ImprovementSuggestion[];
  timeline: TimelineEstimate;
  warnings: string[];
}

export interface PredictionFactor {
  name: string;
  category: 'positive' | 'negative' | 'neutral';
  weight: number; // -10 to +10
  description: string;
  improvable: boolean;
}

export interface HistoricalData {
  similarApplications: number;
  approvalRate: number;
  avgProcessingDays: number;
  commonConditions: string[];
  refusalReasons: string[];
}

export interface ImprovementSuggestion {
  action: string;
  impact: 'low' | 'medium' | 'high';
  probabilityIncrease: number; // percentage points
  cost: 'low' | 'medium' | 'high';
  description: string;
}

export interface TimelineEstimate {
  bestCase: number; // days
  typical: number;
  worstCase: number;
  factors: string[];
}

export interface PredictionInput {
  postcode: string;
  projectType: string;
  propertyType?: 'terraced' | 'semi-detached' | 'detached' | 'flat';
  inConservationArea?: boolean;
  isListedBuilding?: boolean;
  listedGrade?: 'I' | 'II*' | 'II';
  hasArticle4?: boolean;
  nearTrees?: boolean;
  extensionDetails?: {
    depth?: number;
    width?: number;
    height?: number;
    location?: 'rear' | 'side' | 'front' | 'wraparound';
  };
  loftDetails?: {
    dormerSize?: 'small' | 'medium' | 'large';
    frontRooflights?: boolean;
    rearDormer?: boolean;
  };
  basementDetails?: {
    depth?: number;
    lightwell?: boolean;
    underGarden?: boolean;
  };
  hasPreApp?: boolean;
  professionalDesign?: boolean;
  neighborConsulted?: boolean;
}

// Historical data by area (simulated)
const AREA_HISTORICAL_DATA: Record<string, {
  approvalRate: number;
  avgDays: number;
  sensitivity: 'low' | 'medium' | 'high' | 'very_high';
}> = {
  'NW3': { approvalRate: 72, avgDays: 56, sensitivity: 'very_high' },
  'NW1': { approvalRate: 78, avgDays: 48, sensitivity: 'high' },
  'NW2': { approvalRate: 82, avgDays: 45, sensitivity: 'medium' },
  'NW5': { approvalRate: 80, avgDays: 47, sensitivity: 'medium' },
  'NW6': { approvalRate: 76, avgDays: 50, sensitivity: 'high' },
  'NW7': { approvalRate: 85, avgDays: 42, sensitivity: 'low' },
  'NW8': { approvalRate: 74, avgDays: 52, sensitivity: 'high' },
  'NW9': { approvalRate: 84, avgDays: 44, sensitivity: 'low' },
  'NW10': { approvalRate: 83, avgDays: 43, sensitivity: 'low' },
  'NW11': { approvalRate: 77, avgDays: 49, sensitivity: 'high' },
  'N2': { approvalRate: 79, avgDays: 46, sensitivity: 'medium' },
  'N6': { approvalRate: 68, avgDays: 58, sensitivity: 'very_high' },
  'N10': { approvalRate: 81, avgDays: 45, sensitivity: 'medium' },
};

// Project type base rates
const PROJECT_BASE_RATES: Record<string, {
  baseApproval: number;
  complexity: 'low' | 'medium' | 'high';
  avgDays: number;
}> = {
  'extension': { baseApproval: 82, complexity: 'low', avgDays: 42 },
  'loft_conversion': { baseApproval: 85, complexity: 'low', avgDays: 40 },
  'basement': { baseApproval: 65, complexity: 'high', avgDays: 70 },
  'new_build': { baseApproval: 55, complexity: 'high', avgDays: 90 },
  'change_of_use': { baseApproval: 70, complexity: 'medium', avgDays: 56 },
  'listed_building': { baseApproval: 60, complexity: 'high', avgDays: 65 },
  'renovation': { baseApproval: 90, complexity: 'low', avgDays: 35 },
  'outbuilding': { baseApproval: 78, complexity: 'low', avgDays: 38 },
};

// Success Predictor Service Implementation
class SuccessPredictorService {
  
  /**
   * Predict success probability for a planning application
   */
  predict(input: PredictionInput): SuccessPrediction {
    const factors: PredictionFactor[] = [];
    const warnings: string[] = [];
    
    // Get area data with guaranteed fallback
    const areaPrefix = this.extractAreaPrefix(input.postcode);
    const defaultAreaData = AREA_HISTORICAL_DATA['NW3']!;
    const areaData = AREA_HISTORICAL_DATA[areaPrefix] ?? defaultAreaData;
    
    // Get project base rate with guaranteed fallback
    const defaultProjectData = PROJECT_BASE_RATES['extension']!;
    const projectData = PROJECT_BASE_RATES[input.projectType] ?? defaultProjectData;
    
    // Start with base probability
    let probability = (areaData.approvalRate + projectData.baseApproval) / 2;
    
    // Analyze factors
    factors.push(...this.analyzeLocationFactors(input, areaData));
    factors.push(...this.analyzeProjectFactors(input, projectData));
    factors.push(...this.analyzeDesignFactors(input));
    factors.push(...this.analyzeProcessFactors(input));
    
    // Apply factor weights
    for (const factor of factors) {
      probability += factor.weight * 2; // Weight multiplier
      
      if (factor.weight <= -5) {
        warnings.push(`⚠️ ${factor.name}: ${factor.description}`);
      }
    }
    
    // Clamp probability
    probability = Math.max(10, Math.min(95, probability));
    
    // Determine confidence
    const confidence = this.calculateConfidence(factors, input);
    
    // Determine risk level
    const riskLevel = this.calculateRiskLevel(probability, factors);
    
    // Get historical comparison
    const historicalComparison = this.getHistoricalComparison(input, areaData, projectData);
    
    // Generate improvements
    const improvements = this.generateImprovements(factors, input);
    
    // Estimate timeline
    const timeline = this.estimateTimeline(input, areaData, projectData);
    
    return {
      overallProbability: Math.round(probability),
      confidence,
      riskLevel,
      factors: factors.sort((a, b) => Math.abs(b.weight) - Math.abs(a.weight)),
      historicalComparison,
      improvements,
      timeline,
      warnings,
    };
  }
  
  /**
   * Extract area prefix from postcode
   */
  private extractAreaPrefix(postcode: string): string {
    const match = postcode.match(/^(NW\d{1,2}|N\d{1,2})/i);
    return match && match[1] ? match[1].toUpperCase() : 'NW3';
  }
  
  /**
   * Analyze location-based factors
   */
  private analyzeLocationFactors(
    input: PredictionInput, 
    areaData: typeof AREA_HISTORICAL_DATA['NW3']
  ): PredictionFactor[] {
    const factors: PredictionFactor[] = [];
    
    // Conservation area
    if (input.inConservationArea) {
      factors.push({
        name: 'Conservation Area',
        category: 'negative',
        weight: areaData.sensitivity === 'very_high' ? -8 : -5,
        description: 'Property in conservation area requires heritage-sensitive design',
        improvable: false,
      });
    }
    
    // Listed building
    if (input.isListedBuilding) {
      let weight = -10;
      if (input.listedGrade === 'II') weight = -8;
      if (input.listedGrade === 'II*') weight = -12;
      if (input.listedGrade === 'I') weight = -15;
      
      factors.push({
        name: 'Listed Building',
        category: 'negative',
        weight,
        description: `Grade ${input.listedGrade || 'II'} listing requires Listed Building Consent`,
        improvable: false,
      });
    }
    
    // Article 4 direction
    if (input.hasArticle4) {
      factors.push({
        name: 'Article 4 Direction',
        category: 'negative',
        weight: -4,
        description: 'Permitted development rights removed - full application required',
        improvable: false,
      });
    }
    
    // Area sensitivity
    if (areaData.sensitivity === 'very_high') {
      factors.push({
        name: 'High Sensitivity Area',
        category: 'negative',
        weight: -5,
        description: 'Area known for strict planning controls',
        improvable: false,
      });
    } else if (areaData.sensitivity === 'low') {
      factors.push({
        name: 'Standard Planning Area',
        category: 'positive',
        weight: 3,
        description: 'Area has standard planning policies',
        improvable: false,
      });
    }
    
    // Trees
    if (input.nearTrees) {
      factors.push({
        name: 'Trees on Site',
        category: 'negative',
        weight: -3,
        description: 'Tree protection requirements may constrain development',
        improvable: true,
      });
    }
    
    return factors;
  }
  
  /**
   * Analyze project-specific factors
   */
  private analyzeProjectFactors(
    input: PredictionInput,
    projectData: typeof PROJECT_BASE_RATES['extension']
  ): PredictionFactor[] {
    const factors: PredictionFactor[] = [];
    
    // Project complexity
    if (projectData.complexity === 'high') {
      factors.push({
        name: 'Complex Project Type',
        category: 'negative',
        weight: -5,
        description: `${input.projectType} applications have higher refusal rates`,
        improvable: false,
      });
    } else if (projectData.complexity === 'low') {
      factors.push({
        name: 'Standard Project Type',
        category: 'positive',
        weight: 3,
        description: 'Project type has good approval track record',
        improvable: false,
      });
    }
    
    // Extension specifics
    if (input.extensionDetails) {
      const ext = input.extensionDetails;
      
      if (ext.depth && ext.depth > 4) {
        factors.push({
          name: 'Large Extension Depth',
          category: 'negative',
          weight: -6,
          description: `${ext.depth}m depth exceeds typical guidelines`,
          improvable: true,
        });
      } else if (ext.depth && ext.depth <= 3) {
        factors.push({
          name: 'Modest Extension',
          category: 'positive',
          weight: 4,
          description: 'Extension within typical permitted limits',
          improvable: false,
        });
      }
      
      if (ext.location === 'front') {
        factors.push({
          name: 'Front Extension',
          category: 'negative',
          weight: -8,
          description: 'Front extensions rarely approved in residential areas',
          improvable: true,
        });
      }
    }
    
    // Loft specifics
    if (input.loftDetails) {
      const loft = input.loftDetails;
      
      if (loft.dormerSize === 'large') {
        factors.push({
          name: 'Large Dormer',
          category: 'negative',
          weight: -5,
          description: 'Large dormers may be considered out of scale',
          improvable: true,
        });
      }
      
      if (loft.frontRooflights && input.inConservationArea) {
        factors.push({
          name: 'Front Rooflights in CA',
          category: 'negative',
          weight: -6,
          description: 'Front rooflights typically refused in conservation areas',
          improvable: true,
        });
      }
    }
    
    // Basement specifics
    if (input.basementDetails) {
      const basement = input.basementDetails;
      
      if (basement.underGarden) {
        factors.push({
          name: 'Basement Under Garden',
          category: 'negative',
          weight: -7,
          description: 'Camden policy restricts basement extent under gardens',
          improvable: true,
        });
      }
      
      factors.push({
        name: 'Basement Application',
        category: 'neutral',
        weight: -3,
        description: 'Basements require extensive supporting documentation',
        improvable: true,
      });
    }
    
    return factors;
  }
  
  /**
   * Analyze design and quality factors
   */
  private analyzeDesignFactors(input: PredictionInput): PredictionFactor[] {
    const factors: PredictionFactor[] = [];
    
    if (input.professionalDesign) {
      factors.push({
        name: 'Professional Design',
        category: 'positive',
        weight: 6,
        description: 'Architect-designed schemes have higher success rates',
        improvable: false,
      });
    } else {
      factors.push({
        name: 'No Professional Design',
        category: 'negative',
        weight: -4,
        description: 'Self-designed applications have lower success rates',
        improvable: true,
      });
    }
    
    return factors;
  }
  
  /**
   * Analyze process factors
   */
  private analyzeProcessFactors(input: PredictionInput): PredictionFactor[] {
    const factors: PredictionFactor[] = [];
    
    if (input.hasPreApp) {
      factors.push({
        name: 'Pre-Application Advice',
        category: 'positive',
        weight: 8,
        description: 'Pre-app significantly improves approval chances',
        improvable: false,
      });
    } else if (input.inConservationArea || input.isListedBuilding) {
      factors.push({
        name: 'No Pre-Application',
        category: 'negative',
        weight: -5,
        description: 'Pre-app strongly recommended for sensitive sites',
        improvable: true,
      });
    }
    
    if (input.neighborConsulted) {
      factors.push({
        name: 'Neighbor Consultation',
        category: 'positive',
        weight: 4,
        description: 'Early neighbor engagement reduces objections',
        improvable: false,
      });
    }
    
    return factors;
  }
  
  /**
   * Calculate confidence level
   */
  private calculateConfidence(factors: PredictionFactor[], input: PredictionInput): 'low' | 'medium' | 'high' {
    let confidence = 0;
    
    // More factors = better confidence
    confidence += Math.min(factors.length * 5, 30);
    
    // Known values increase confidence
    if (input.inConservationArea !== undefined) confidence += 10;
    if (input.isListedBuilding !== undefined) confidence += 10;
    if (input.hasPreApp !== undefined) confidence += 10;
    if (input.professionalDesign !== undefined) confidence += 10;
    if (input.extensionDetails || input.loftDetails || input.basementDetails) confidence += 15;
    
    if (confidence >= 60) return 'high';
    if (confidence >= 35) return 'medium';
    return 'low';
  }
  
  /**
   * Calculate risk level
   */
  private calculateRiskLevel(probability: number, factors: PredictionFactor[]): 'low' | 'medium' | 'high' | 'very_high' {
    const negativeFactors = factors.filter(f => f.weight < -5).length;
    
    if (probability >= 75 && negativeFactors <= 1) return 'low';
    if (probability >= 60 && negativeFactors <= 2) return 'medium';
    if (probability >= 40) return 'high';
    return 'very_high';
  }
  
  /**
   * Get historical comparison data
   */
  private getHistoricalComparison(
    input: PredictionInput,
    areaData: typeof AREA_HISTORICAL_DATA['NW3'],
    projectData: typeof PROJECT_BASE_RATES['extension']
  ): HistoricalData {
    const commonConditions: string[] = [];
    const refusalReasons: string[] = [];
    
    // Add typical conditions based on project type
    if (input.projectType === 'extension') {
      commonConditions.push('Materials to match existing');
      commonConditions.push('Removal of PD rights for further extension');
      if (input.inConservationArea) {
        commonConditions.push('Obscure glazing to side windows');
      }
    }
    
    if (input.projectType === 'loft_conversion') {
      commonConditions.push('Materials to match existing roof');
      commonConditions.push('No additional windows without consent');
    }
    
    if (input.projectType === 'basement') {
      commonConditions.push('Construction management plan compliance');
      commonConditions.push('Structural monitoring');
      commonConditions.push('No occupation until certification received');
    }
    
    // Add typical refusal reasons
    if (input.inConservationArea) {
      refusalReasons.push('Harm to conservation area character');
      refusalReasons.push('Inappropriate materials or design');
    }
    
    refusalReasons.push('Harm to neighbor amenity');
    refusalReasons.push('Loss of light');
    refusalReasons.push('Overbearing impact');
    
    return {
      similarApplications: Math.floor(Math.random() * 50) + 20,
      approvalRate: areaData.approvalRate,
      avgProcessingDays: Math.round((areaData.avgDays + projectData.avgDays) / 2),
      commonConditions,
      refusalReasons,
    };
  }
  
  /**
   * Generate improvement suggestions
   */
  private generateImprovements(factors: PredictionFactor[], input: PredictionInput): ImprovementSuggestion[] {
    const improvements: ImprovementSuggestion[] = [];
    
    // Check for improvable negative factors
    const improvableNegatives = factors.filter(f => f.improvable && f.weight < 0);
    
    for (const factor of improvableNegatives) {
      if (factor.name === 'No Professional Design') {
        improvements.push({
          action: 'Engage a professional architect',
          impact: 'high',
          probabilityIncrease: 10,
          cost: 'medium',
          description: 'Professional design significantly improves approval chances and quality',
        });
      }
      
      if (factor.name === 'No Pre-Application') {
        improvements.push({
          action: 'Submit pre-application enquiry',
          impact: 'high',
          probabilityIncrease: 12,
          cost: 'low',
          description: 'Pre-app provides officer guidance and increases approval likelihood',
        });
      }
      
      if (factor.name === 'Large Extension Depth') {
        improvements.push({
          action: 'Reduce extension depth',
          impact: 'high',
          probabilityIncrease: 8,
          cost: 'low',
          description: 'Smaller extension more likely to be approved',
        });
      }
      
      if (factor.name === 'Large Dormer') {
        improvements.push({
          action: 'Reduce dormer size',
          impact: 'medium',
          probabilityIncrease: 6,
          cost: 'low',
          description: 'Smaller dormer appears more subordinate',
        });
      }
      
      if (factor.name === 'Front Rooflights in CA') {
        improvements.push({
          action: 'Remove front rooflights',
          impact: 'high',
          probabilityIncrease: 8,
          cost: 'low',
          description: 'Eliminating front rooflights removes common objection',
        });
      }
      
      if (factor.name === 'Basement Under Garden') {
        improvements.push({
          action: 'Reduce basement footprint',
          impact: 'high',
          probabilityIncrease: 10,
          cost: 'medium',
          description: 'Keep basement within building footprint',
        });
      }
    }
    
    // Add general improvements if not already using
    if (!input.neighborConsulted) {
      improvements.push({
        action: 'Consult neighbors before submission',
        impact: 'medium',
        probabilityIncrease: 5,
        cost: 'low',
        description: 'Early engagement can resolve issues and reduce objections',
      });
    }
    
    return improvements.sort((a, b) => b.probabilityIncrease - a.probabilityIncrease);
  }
  
  /**
   * Estimate timeline
   */
  private estimateTimeline(
    input: PredictionInput,
    areaData: typeof AREA_HISTORICAL_DATA['NW3'],
    projectData: typeof PROJECT_BASE_RATES['extension']
  ): TimelineEstimate {
    let baseDays = Math.round((areaData.avgDays + projectData.avgDays) / 2);
    const factors: string[] = [];
    
    // Adjust for complexity
    if (input.isListedBuilding) {
      baseDays += 14;
      factors.push('Listed building consultation adds time');
    }
    
    if (input.projectType === 'basement') {
      baseDays += 21;
      factors.push('Basement applications require extended assessment');
    }
    
    if (input.inConservationArea && areaData.sensitivity === 'very_high') {
      baseDays += 7;
      factors.push('High sensitivity area may have more scrutiny');
    }
    
    if (input.hasPreApp) {
      baseDays -= 7;
      factors.push('Pre-app may streamline decision process');
    }
    
    return {
      bestCase: Math.max(28, baseDays - 14),
      typical: baseDays,
      worstCase: baseDays + 28,
      factors,
    };
  }
  
  /**
   * Quick prediction without full details
   */
  quickPredict(postcode: string, projectType: string): {
    probability: number;
    risk: string;
    recommendation: string;
  } {
    const areaPrefix = this.extractAreaPrefix(postcode);
    const defaultAreaData = AREA_HISTORICAL_DATA['NW3']!;
    const areaData = AREA_HISTORICAL_DATA[areaPrefix] ?? defaultAreaData;
    const defaultProjectData = PROJECT_BASE_RATES['extension']!;
    const projectData = PROJECT_BASE_RATES[projectType] ?? defaultProjectData;
    
    const probability = Math.round((areaData.approvalRate + projectData.baseApproval) / 2);
    
    let risk = 'Medium';
    if (probability >= 80) risk = 'Low';
    if (probability < 65) risk = 'High';
    if (probability < 50) risk = 'Very High';
    
    let recommendation = 'Standard application process recommended';
    if (probability < 70 || areaData.sensitivity === 'very_high') {
      recommendation = 'Pre-application advice strongly recommended';
    }
    if (probability < 50) {
      recommendation = 'Consider redesigning or engaging specialist architect';
    }
    
    return { probability, risk, recommendation };
  }
}

// Export singleton instance
export const successPredictorService = new SuccessPredictorService();
