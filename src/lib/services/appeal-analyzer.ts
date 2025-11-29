/**
 * Appeal Analyzer Service
 * Analyzes planning appeal success rates, strategies, and deadlines
 */

// Appeal outcome types
type AppealOutcome = 'allowed' | 'dismissed' | 'split_decision' | 'withdrawn' | 'pending';
type AppealType = 'written_representations' | 'hearing' | 'inquiry';
type RefusalReason = 
  | 'design_quality'
  | 'heritage_impact'
  | 'neighbor_amenity'
  | 'overdevelopment'
  | 'character_harm'
  | 'parking'
  | 'daylight_sunlight'
  | 'privacy'
  | 'trees'
  | 'policy_conflict';

// Appeal case data
interface AppealCase {
  id: string;
  applicationRef: string;
  appealRef: string;
  address: string;
  postcode: string;
  projectType: string;
  refusalReasons: RefusalReason[];
  appealType: AppealType;
  outcome: AppealOutcome;
  decisionDate: string;
  inspectorComments: string[];
  keyFactors: string[];
  costs: boolean;
  costsAwarded?: 'appellant' | 'council' | 'split';
}

// Appeal statistics by area
interface AreaAppealStats {
  totalAppeals: number;
  allowed: number;
  dismissed: number;
  splitDecision: number;
  withdrawn: number;
  successRate: number;
  avgDecisionWeeks: number;
  costsAwardedRate: number;
}

// Appeal recommendation
interface AppealRecommendation {
  shouldAppeal: boolean;
  confidence: 'low' | 'medium' | 'high';
  successProbability: number;
  recommendedType: AppealType;
  estimatedCost: { min: number; max: number };
  estimatedDuration: { weeks: number };
  strengths: string[];
  weaknesses: string[];
  strategyNotes: string[];
  keyDeadlines: {
    name: string;
    date: string;
    daysRemaining: number;
    critical: boolean;
  }[];
  similarCases: {
    appealRef: string;
    outcome: AppealOutcome;
    similarity: number;
    keyLearning: string;
  }[];
}

// Historical appeal data by postcode area
const AREA_APPEAL_STATS: Record<string, AreaAppealStats> = {
  'NW3': {
    totalAppeals: 245,
    allowed: 78,
    dismissed: 142,
    splitDecision: 18,
    withdrawn: 7,
    successRate: 32,
    avgDecisionWeeks: 16,
    costsAwardedRate: 8,
  },
  'NW6': {
    totalAppeals: 189,
    allowed: 68,
    dismissed: 102,
    splitDecision: 14,
    withdrawn: 5,
    successRate: 36,
    avgDecisionWeeks: 14,
    costsAwardedRate: 6,
  },
  'NW8': {
    totalAppeals: 156,
    allowed: 42,
    dismissed: 98,
    splitDecision: 12,
    withdrawn: 4,
    successRate: 27,
    avgDecisionWeeks: 18,
    costsAwardedRate: 10,
  },
  'NW1': {
    totalAppeals: 178,
    allowed: 62,
    dismissed: 96,
    splitDecision: 15,
    withdrawn: 5,
    successRate: 35,
    avgDecisionWeeks: 15,
    costsAwardedRate: 7,
  },
  'NW2': {
    totalAppeals: 134,
    allowed: 52,
    dismissed: 68,
    splitDecision: 10,
    withdrawn: 4,
    successRate: 39,
    avgDecisionWeeks: 13,
    costsAwardedRate: 5,
  },
  'NW5': {
    totalAppeals: 112,
    allowed: 45,
    dismissed: 56,
    splitDecision: 8,
    withdrawn: 3,
    successRate: 40,
    avgDecisionWeeks: 12,
    costsAwardedRate: 4,
  },
  'NW11': {
    totalAppeals: 98,
    allowed: 35,
    dismissed: 52,
    splitDecision: 8,
    withdrawn: 3,
    successRate: 36,
    avgDecisionWeeks: 14,
    costsAwardedRate: 6,
  },
  'N2': {
    totalAppeals: 87,
    allowed: 38,
    dismissed: 42,
    splitDecision: 5,
    withdrawn: 2,
    successRate: 44,
    avgDecisionWeeks: 11,
    costsAwardedRate: 3,
  },
  'N6': {
    totalAppeals: 145,
    allowed: 48,
    dismissed: 82,
    splitDecision: 11,
    withdrawn: 4,
    successRate: 33,
    avgDecisionWeeks: 15,
    costsAwardedRate: 7,
  },
  'N10': {
    totalAppeals: 76,
    allowed: 32,
    dismissed: 38,
    splitDecision: 4,
    withdrawn: 2,
    successRate: 42,
    avgDecisionWeeks: 12,
    costsAwardedRate: 4,
  },
};

// Success rates by refusal reason
const REFUSAL_REASON_SUCCESS_RATES: Record<RefusalReason, { rate: number; notes: string }> = {
  'design_quality': {
    rate: 45,
    notes: 'Often subjective - strong design rationale can overturn',
  },
  'heritage_impact': {
    rate: 28,
    notes: 'Inspectors take heritage seriously - need robust heritage statement',
  },
  'neighbor_amenity': {
    rate: 52,
    notes: 'Technical evidence (daylight studies) often successful',
  },
  'overdevelopment': {
    rate: 35,
    notes: 'Policy-based - show compliance with density guidelines',
  },
  'character_harm': {
    rate: 38,
    notes: 'Document local character analysis thoroughly',
  },
  'parking': {
    rate: 58,
    notes: 'Sustainable transport arguments often succeed',
  },
  'daylight_sunlight': {
    rate: 48,
    notes: 'BRE guidelines compliance is key evidence',
  },
  'privacy': {
    rate: 42,
    notes: 'Mitigation measures can address concerns',
  },
  'trees': {
    rate: 32,
    notes: 'Arboricultural evidence crucial',
  },
  'policy_conflict': {
    rate: 25,
    notes: 'Hardest to overturn - focus on material considerations',
  },
};

// Sample appeal cases database
const SAMPLE_APPEAL_CASES: AppealCase[] = [
  {
    id: 'APP-001',
    applicationRef: '2024/1234/P',
    appealRef: 'APP/X5210/W/24/3336789',
    address: '15 Flask Walk, Hampstead',
    postcode: 'NW3 1HE',
    projectType: 'rear_extension',
    refusalReasons: ['heritage_impact', 'character_harm'],
    appealType: 'written_representations',
    outcome: 'allowed',
    decisionDate: '2024-08-15',
    inspectorComments: [
      'While in conservation area, design respects local character',
      'Materials proposed are appropriate',
      'Impact on heritage assets is less than substantial',
    ],
    keyFactors: ['Quality heritage statement', 'Pre-app engagement', 'Appropriate materials'],
    costs: false,
  },
  {
    id: 'APP-002',
    applicationRef: '2024/2345/P',
    appealRef: 'APP/X5210/W/24/3337890',
    address: '42 Belsize Park Gardens',
    postcode: 'NW3 4LT',
    projectType: 'loft_conversion',
    refusalReasons: ['design_quality', 'neighbor_amenity'],
    appealType: 'written_representations',
    outcome: 'dismissed',
    decisionDate: '2024-09-20',
    inspectorComments: [
      'Dormer design inappropriate for roofscape',
      'Overlooking issues not adequately addressed',
    ],
    keyFactors: ['No heritage consultant', 'Standard dormer design', 'Neighbor objections'],
    costs: false,
  },
  {
    id: 'APP-003',
    applicationRef: '2024/3456/P',
    appealRef: 'APP/X5210/W/24/3338901',
    address: '8 Holly Mount',
    postcode: 'NW3 6SG',
    projectType: 'basement',
    refusalReasons: ['overdevelopment', 'trees'],
    appealType: 'hearing',
    outcome: 'split_decision',
    decisionDate: '2024-10-10',
    inspectorComments: [
      'Basement acceptable in principle',
      'Lightwell scaled back to protect TPO trees',
    ],
    keyFactors: ['Arboricultural survey', 'Structural method statement', 'Compromise reached'],
    costs: true,
    costsAwarded: 'split',
  },
];

export class AppealAnalyzerService {
  /**
   * Analyze appeal prospects for a refused application
   */
  analyzeAppealProspects(input: {
    postcode: string;
    projectType: string;
    refusalReasons: RefusalReason[];
    refusalDate: string;
    inConservationArea: boolean;
    isListedBuilding: boolean;
    hasHeritageStatement: boolean;
    hasPreApplication: boolean;
    neighborObjections: number;
    officerRecommendation: 'approve' | 'refuse';
    committeeDecision: boolean;
  }): AppealRecommendation {
    // Get area statistics
    const areaPrefix = this.extractAreaPrefix(input.postcode);
    const defaultStats = AREA_APPEAL_STATS['NW3']!;
    const areaStats = AREA_APPEAL_STATS[areaPrefix] ?? defaultStats;
    
    // Calculate base probability from area success rate
    let probability = areaStats.successRate;
    
    // Analyze refusal reasons
    const reasonAnalysis = this.analyzeRefusalReasons(input.refusalReasons);
    probability = (probability + reasonAnalysis.avgSuccessRate) / 2;
    
    // Adjust for factors
    const strengths: string[] = [];
    const weaknesses: string[] = [];
    
    // Officer vs committee
    if (input.officerRecommendation === 'approve' && input.committeeDecision) {
      probability += 15;
      strengths.push('Officer recommended approval - strong evidence of unreasonableness');
    }
    
    // Heritage documentation
    if (input.inConservationArea || input.isListedBuilding) {
      if (input.hasHeritageStatement) {
        probability += 5;
        strengths.push('Heritage statement prepared - demonstrates due diligence');
      } else {
        probability -= 10;
        weaknesses.push('No heritage statement for heritage-sensitive site');
      }
    }
    
    // Pre-application
    if (input.hasPreApplication) {
      probability += 8;
      strengths.push('Pre-application advice sought - shows engagement with process');
    }
    
    // Neighbor objections
    if (input.neighborObjections === 0) {
      probability += 5;
      strengths.push('No neighbor objections recorded');
    } else if (input.neighborObjections > 5) {
      probability -= 8;
      weaknesses.push(`${input.neighborObjections} neighbor objections on record`);
    }
    
    // Heritage constraints
    if (input.isListedBuilding) {
      probability -= 10;
      weaknesses.push('Listed building appeals have lower success rates');
    }
    
    // Clamp probability
    probability = Math.max(10, Math.min(75, probability));
    
    // Determine recommendation
    const shouldAppeal = probability >= 35;
    const confidence = probability >= 50 ? 'high' : probability >= 35 ? 'medium' : 'low';
    
    // Calculate deadlines
    const deadlines = this.calculateDeadlines(input.refusalDate);
    
    // Get similar cases
    const similarCases = this.findSimilarCases(input.projectType, input.refusalReasons);
    
    // Generate strategy notes
    const strategyNotes = this.generateStrategyNotes(
      input.refusalReasons,
      reasonAnalysis,
      input.officerRecommendation === 'approve'
    );
    
    // Recommend appeal type
    const recommendedType = this.recommendAppealType(
      probability,
      input.refusalReasons,
      input.isListedBuilding
    );
    
    return {
      shouldAppeal,
      confidence,
      successProbability: Math.round(probability),
      recommendedType,
      estimatedCost: this.estimateCosts(recommendedType),
      estimatedDuration: { weeks: areaStats.avgDecisionWeeks },
      strengths,
      weaknesses,
      strategyNotes,
      keyDeadlines: deadlines,
      similarCases,
    };
  }
  
  /**
   * Get area appeal statistics
   */
  getAreaStatistics(postcode: string): AreaAppealStats & { area: string } {
    const areaPrefix = this.extractAreaPrefix(postcode);
    const defaultStats = AREA_APPEAL_STATS['NW3']!;
    const stats = AREA_APPEAL_STATS[areaPrefix] ?? defaultStats;
    return { ...stats, area: areaPrefix };
  }
  
  /**
   * Search appeal cases
   */
  searchAppealCases(filters: {
    postcode?: string;
    projectType?: string;
    outcome?: AppealOutcome;
    refusalReasons?: RefusalReason[];
  }): AppealCase[] {
    let cases = [...SAMPLE_APPEAL_CASES];
    
    if (filters.postcode) {
      const prefix = this.extractAreaPrefix(filters.postcode);
      cases = cases.filter(c => c.postcode.startsWith(prefix));
    }
    
    if (filters.projectType) {
      cases = cases.filter(c => c.projectType === filters.projectType);
    }
    
    if (filters.outcome) {
      cases = cases.filter(c => c.outcome === filters.outcome);
    }
    
    if (filters.refusalReasons && filters.refusalReasons.length > 0) {
      cases = cases.filter(c => 
        filters.refusalReasons!.some(r => c.refusalReasons.includes(r))
      );
    }
    
    return cases;
  }
  
  /**
   * Get refusal reason success rates
   */
  getRefusalReasonStats(): Record<RefusalReason, { rate: number; notes: string }> {
    return { ...REFUSAL_REASON_SUCCESS_RATES };
  }
  
  /**
   * Calculate appeal deadlines
   */
  private calculateDeadlines(refusalDate: string): AppealRecommendation['keyDeadlines'] {
    const refusal = new Date(refusalDate);
    const now = new Date();
    
    const deadlines: AppealRecommendation['keyDeadlines'] = [];
    
    // 6-month deadline for householder appeals
    const householderDeadline = new Date(refusal);
    householderDeadline.setMonth(householderDeadline.getMonth() + 6);
    const householderDays = Math.ceil((householderDeadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    deadlines.push({
      name: 'Householder Appeal Deadline',
      date: householderDeadline.toISOString().split('T')[0] || '',
      daysRemaining: Math.max(0, householderDays),
      critical: householderDays <= 30,
    });
    
    // 12-week deadline for written representations
    const writtenDeadline = new Date(refusal);
    writtenDeadline.setDate(writtenDeadline.getDate() + 84);
    const writtenDays = Math.ceil((writtenDeadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (writtenDays > 0) {
      deadlines.push({
        name: 'Written Representations Fast-Track',
        date: writtenDeadline.toISOString().split('T')[0] || '',
        daysRemaining: writtenDays,
        critical: writtenDays <= 14,
      });
    }
    
    // Recommended submission date (allow 4 weeks for preparation)
    const recommendedDate = new Date();
    recommendedDate.setDate(recommendedDate.getDate() + 28);
    
    if (recommendedDate < householderDeadline) {
      deadlines.push({
        name: 'Recommended Submission Date',
        date: recommendedDate.toISOString().split('T')[0] || '',
        daysRemaining: 28,
        critical: false,
      });
    }
    
    return deadlines;
  }
  
  /**
   * Find similar appeal cases
   */
  private findSimilarCases(
    projectType: string,
    refusalReasons: RefusalReason[]
  ): AppealRecommendation['similarCases'] {
    const similar: AppealRecommendation['similarCases'] = [];
    
    for (const appealCase of SAMPLE_APPEAL_CASES) {
      let similarity = 0;
      
      // Project type match
      if (appealCase.projectType === projectType) similarity += 40;
      
      // Refusal reasons overlap
      const reasonOverlap = appealCase.refusalReasons.filter(r => 
        refusalReasons.includes(r)
      ).length;
      similarity += reasonOverlap * 20;
      
      if (similarity >= 40) {
        const keyLearning = appealCase.outcome === 'allowed'
          ? `Successful: ${appealCase.keyFactors[0] || 'Quality submission'}`
          : `Unsuccessful: ${appealCase.inspectorComments[0] || 'Design concerns'}`;
        
        similar.push({
          appealRef: appealCase.appealRef,
          outcome: appealCase.outcome,
          similarity: Math.min(100, similarity),
          keyLearning,
        });
      }
    }
    
    return similar.sort((a, b) => b.similarity - a.similarity).slice(0, 5);
  }
  
  /**
   * Analyze refusal reasons
   */
  private analyzeRefusalReasons(reasons: RefusalReason[]): {
    avgSuccessRate: number;
    bestChance: RefusalReason | null;
    worstChance: RefusalReason | null;
    notes: string[];
  } {
    if (reasons.length === 0) {
      return {
        avgSuccessRate: 40,
        bestChance: null,
        worstChance: null,
        notes: ['No specific refusal reasons provided'],
      };
    }
    
    const rates = reasons.map(r => {
      const data = REFUSAL_REASON_SUCCESS_RATES[r];
      return data ? { reason: r, rate: data.rate, notes: data.notes } : null;
    }).filter((r): r is { reason: RefusalReason; rate: number; notes: string } => r !== null);
    
    if (rates.length === 0) {
      return {
        avgSuccessRate: 40,
        bestChance: null,
        worstChance: null,
        notes: ['Unable to analyze refusal reasons'],
      };
    }
    
    const avgSuccessRate = rates.reduce((sum, r) => sum + r.rate, 0) / rates.length;
    const sorted = [...rates].sort((a, b) => b.rate - a.rate);
    
    return {
      avgSuccessRate,
      bestChance: sorted[0]?.reason ?? null,
      worstChance: sorted[sorted.length - 1]?.reason ?? null,
      notes: rates.map(r => r.notes),
    };
  }
  
  /**
   * Generate strategy notes
   */
  private generateStrategyNotes(
    reasons: RefusalReason[],
    analysis: { notes: string[] },
    officerSupported: boolean
  ): string[] {
    const notes: string[] = [];
    
    if (officerSupported) {
      notes.push('Emphasize that officer recommended approval - council acted unreasonably');
    }
    
    // Specific strategy for each reason
    if (reasons.includes('design_quality')) {
      notes.push('Commission independent design review or RIBA design panel assessment');
    }
    
    if (reasons.includes('heritage_impact')) {
      notes.push('Engage conservation architect to strengthen heritage impact assessment');
    }
    
    if (reasons.includes('daylight_sunlight')) {
      notes.push('Commission BRE-compliant daylight/sunlight assessment');
    }
    
    if (reasons.includes('neighbor_amenity')) {
      notes.push('Address specific amenity concerns with technical evidence');
    }
    
    if (reasons.includes('parking')) {
      notes.push('Prepare sustainable transport statement showing low car dependency');
    }
    
    if (reasons.includes('trees')) {
      notes.push('Commission detailed arboricultural impact assessment');
    }
    
    // General strategies
    notes.push('Review inspector decisions on similar local appeals');
    notes.push('Address each refusal reason systematically in appeal statement');
    
    return notes.slice(0, 8);
  }
  
  /**
   * Recommend appeal type
   */
  private recommendAppealType(
    probability: number,
    reasons: RefusalReason[],
    isListed: boolean
  ): AppealType {
    // Hearings for complex heritage cases
    if (isListed || reasons.includes('heritage_impact')) {
      return 'hearing';
    }
    
    // Inquiries for major developments
    if (reasons.length > 4) {
      return 'inquiry';
    }
    
    // Written representations for straightforward cases
    return 'written_representations';
  }
  
  /**
   * Estimate appeal costs
   */
  private estimateCosts(appealType: AppealType): { min: number; max: number } {
    const costs: Record<AppealType, { min: number; max: number }> = {
      'written_representations': { min: 2500, max: 8000 },
      'hearing': { min: 8000, max: 20000 },
      'inquiry': { min: 25000, max: 75000 },
    };
    
    return costs[appealType] ?? { min: 2500, max: 8000 };
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
export const appealAnalyzerService = new AppealAnalyzerService();
