/**
 * Development Feasibility Report Generator
 * Comprehensive multi-factor feasibility analysis
 */

// Types
export type FeasibilityRating = 'excellent' | 'good' | 'moderate' | 'challenging' | 'not_recommended';

export interface FeasibilityScore {
  category: string;
  score: number; // 0-100
  weight: number; // Factor weight
  notes: string[];
  risks: string[];
  opportunities: string[];
}

export interface FeasibilityReport {
  summary: {
    overallScore: number;
    rating: FeasibilityRating;
    recommendation: string;
    keyStrengths: string[];
    keyWeaknesses: string[];
  };
  scores: FeasibilityScore[];
  timeline: {
    phase: string;
    duration: string;
    milestones: string[];
  }[];
  budget: {
    category: string;
    estimate: { min: number; max: number };
    notes: string;
  }[];
  riskMatrix: {
    risk: string;
    likelihood: 'low' | 'medium' | 'high';
    impact: 'low' | 'medium' | 'high';
    mitigation: string;
  }[];
  nextSteps: {
    step: number;
    action: string;
    priority: 'essential' | 'recommended' | 'optional';
    estimatedCost?: string;
  }[];
}

export interface PropertyDetails {
  address: string;
  postcode: string;
  propertyType: 'detached' | 'semi_detached' | 'terraced' | 'flat' | 'maisonette';
  listedGrade?: 'I' | 'II*' | 'II' | null;
  conservationArea: boolean;
  tpoTrees: boolean;
  buildingAge?: number;
  currentSize?: number; // sqm
  plotSize?: number; // sqm
}

export interface DevelopmentProposal {
  type: 'extension' | 'basement' | 'loft' | 'new_build' | 'change_of_use' | 'mixed';
  description: string;
  proposedFloorspace?: number; // sqm
  estimatedBudget?: number;
}

// Scoring weights by development type
const SCORING_WEIGHTS: Record<string, Record<string, number>> = {
  extension: {
    planning_policy: 0.25,
    heritage_impact: 0.20,
    neighbour_impact: 0.15,
    design_quality: 0.15,
    construction_feasibility: 0.15,
    financial_viability: 0.10,
  },
  basement: {
    planning_policy: 0.20,
    heritage_impact: 0.15,
    neighbour_impact: 0.20,
    structural_feasibility: 0.20,
    construction_logistics: 0.15,
    financial_viability: 0.10,
  },
  loft: {
    planning_policy: 0.25,
    heritage_impact: 0.20,
    design_quality: 0.20,
    structural_feasibility: 0.15,
    construction_feasibility: 0.10,
    financial_viability: 0.10,
  },
  new_build: {
    planning_policy: 0.30,
    heritage_impact: 0.15,
    design_quality: 0.20,
    site_constraints: 0.15,
    construction_feasibility: 0.10,
    financial_viability: 0.10,
  },
  change_of_use: {
    planning_policy: 0.35,
    heritage_impact: 0.20,
    amenity_impact: 0.15,
    parking_transport: 0.15,
    financial_viability: 0.15,
  },
};

// Base scores for different heritage contexts
const HERITAGE_BASE_SCORES: Record<string, number> = {
  'listed_grade_I': 30,
  'listed_grade_II_star': 40,
  'listed_grade_II': 50,
  'conservation_area': 65,
  'none': 85,
};

export class FeasibilityReportGenerator {
  /**
   * Generate comprehensive feasibility report
   */
  generateReport(
    property: PropertyDetails,
    proposal: DevelopmentProposal
  ): FeasibilityReport {
    const scores = this.calculateScores(property, proposal);
    const overallScore = this.calculateOverallScore(scores);
    const rating = this.getOverallRating(overallScore);
    
    const summary = this.generateSummary(overallScore, rating, scores);
    const timeline = this.generateTimeline(proposal.type, property);
    const budget = this.generateBudgetEstimate(proposal, property);
    const riskMatrix = this.generateRiskMatrix(property, proposal, scores);
    const nextSteps = this.generateNextSteps(property, proposal, rating);
    
    return {
      summary,
      scores,
      timeline,
      budget,
      riskMatrix,
      nextSteps,
    };
  }

  /**
   * Calculate individual category scores
   */
  private calculateScores(
    property: PropertyDetails,
    proposal: DevelopmentProposal
  ): FeasibilityScore[] {
    const weights = SCORING_WEIGHTS[proposal.type] ?? SCORING_WEIGHTS['extension'] ?? {};
    const scores: FeasibilityScore[] = [];
    
    // Planning Policy Score
    let policyScore: number = HERITAGE_BASE_SCORES['none'] ?? 85;
    const policyNotes: string[] = [];
    const policyRisks: string[] = [];
    const policyOpportunities: string[] = [];
    
    if (property.listedGrade) {
      const gradeKey = `listed_grade_${property.listedGrade.replace('*', '_star')}`;
      policyScore = HERITAGE_BASE_SCORES[gradeKey] ?? 50;
      policyRisks.push('Listed building consent required');
      policyNotes.push(`Grade ${property.listedGrade} listing applies strict heritage controls`);
    }
    
    if (property.conservationArea) {
      const conservationScore = HERITAGE_BASE_SCORES['conservation_area'] ?? 65;
      policyScore = Math.min(policyScore, conservationScore);
      policyNotes.push('Conservation area policies apply');
      policyRisks.push('Article 4 directions may remove permitted development');
    }
    
    if (!property.listedGrade && !property.conservationArea) {
      policyOpportunities.push('Permitted development rights may apply');
      policyOpportunities.push('Standard planning policies apply');
    }
    
    scores.push({
      category: 'Planning Policy',
      score: policyScore,
      weight: weights['planning_policy'] ?? 0.2,
      notes: policyNotes,
      risks: policyRisks,
      opportunities: policyOpportunities,
    });
    
    // Heritage Impact Score
    let heritageScore = property.listedGrade ? 45 : property.conservationArea ? 65 : 90;
    const heritageNotes: string[] = [];
    const heritageRisks: string[] = [];
    const heritageOpportunities: string[] = [];
    
    if (property.listedGrade) {
      heritageNotes.push('Heritage statement and detailed impact assessment required');
      heritageRisks.push('Design must demonstrate special interest protection');
      heritageOpportunities.push('Quality design can enhance significance');
    }
    
    if (property.conservationArea) {
      heritageNotes.push('Design must preserve or enhance character');
      heritageOpportunities.push('Well-designed schemes can gain support');
    }
    
    scores.push({
      category: 'Heritage Impact',
      score: heritageScore,
      weight: weights['heritage_impact'] ?? 0.2,
      notes: heritageNotes,
      risks: heritageRisks,
      opportunities: heritageOpportunities,
    });
    
    // Neighbour/Amenity Impact Score
    let amenityScore = 75;
    const amenityNotes: string[] = [];
    const amenityRisks: string[] = [];
    
    if (property.propertyType === 'terraced') {
      amenityScore -= 10;
      amenityRisks.push('Party wall considerations with both neighbours');
    } else if (property.propertyType === 'semi_detached') {
      amenityScore -= 5;
      amenityRisks.push('Party wall considerations with attached neighbour');
    }
    
    if (proposal.type === 'basement') {
      amenityScore -= 15;
      amenityRisks.push('Noise and vibration during construction');
      amenityRisks.push('Traffic and access issues');
      amenityNotes.push('Construction management plan essential');
    }
    
    scores.push({
      category: 'Neighbour Impact',
      score: amenityScore,
      weight: weights['neighbour_impact'] ?? weights['amenity_impact'] ?? 0.15,
      notes: amenityNotes,
      risks: amenityRisks,
      opportunities: ['Early neighbour engagement recommended'],
    });
    
    // Construction Feasibility Score
    let constructionScore = 80;
    const constructionNotes: string[] = [];
    const constructionRisks: string[] = [];
    
    if (proposal.type === 'basement') {
      constructionScore = 60;
      constructionRisks.push('Ground conditions unknown - survey required');
      constructionRisks.push('Water table assessment needed');
      constructionNotes.push('Structural engineer essential from outset');
    }
    
    if (property.tpoTrees) {
      constructionScore -= 10;
      constructionRisks.push('TPO trees may constrain development footprint');
      constructionNotes.push('Arboricultural survey required');
    }
    
    if (property.buildingAge && property.buildingAge > 100) {
      constructionRisks.push('Historic fabric may present construction challenges');
    }
    
    scores.push({
      category: 'Construction Feasibility',
      score: constructionScore,
      weight: weights['construction_feasibility'] ?? weights['structural_feasibility'] ?? 0.15,
      notes: constructionNotes,
      risks: constructionRisks,
      opportunities: ['Modern construction methods can overcome many challenges'],
    });
    
    // Financial Viability Score
    let financialScore = 70;
    const financialNotes: string[] = [];
    const financialRisks: string[] = [];
    const financialOpportunities: string[] = [];
    
    // Hampstead area typically has good value uplift
    if (property.postcode.match(/^NW3/i)) {
      financialScore += 15;
      financialOpportunities.push('Strong property values support investment');
    }
    
    if (proposal.type === 'basement') {
      financialRisks.push('High construction costs per sqm');
      financialNotes.push('Budget contingency of 20% recommended');
    }
    
    if (property.listedGrade) {
      financialRisks.push('Heritage-appropriate materials increase costs');
      financialOpportunities.push('Heritage premium on completed value');
    }
    
    scores.push({
      category: 'Financial Viability',
      score: financialScore,
      weight: weights['financial_viability'] ?? 0.1,
      notes: financialNotes,
      risks: financialRisks,
      opportunities: financialOpportunities,
    });
    
    return scores;
  }

  /**
   * Calculate weighted overall score
   */
  private calculateOverallScore(scores: FeasibilityScore[]): number {
    let totalWeight = 0;
    let weightedSum = 0;
    
    for (const score of scores) {
      weightedSum += score.score * score.weight;
      totalWeight += score.weight;
    }
    
    return totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 0;
  }

  /**
   * Get overall rating from score
   */
  private getOverallRating(score: number): FeasibilityRating {
    if (score >= 80) return 'excellent';
    if (score >= 65) return 'good';
    if (score >= 50) return 'moderate';
    if (score >= 35) return 'challenging';
    return 'not_recommended';
  }

  /**
   * Generate summary section
   */
  private generateSummary(
    score: number,
    rating: FeasibilityRating,
    scores: FeasibilityScore[]
  ): FeasibilityReport['summary'] {
    const sortedByScore = [...scores].sort((a, b) => b.score - a.score);
    const keyStrengths = sortedByScore
      .filter(s => s.score >= 70)
      .flatMap(s => s.opportunities)
      .slice(0, 3);
    
    const keyWeaknesses = sortedByScore
      .filter(s => s.score < 60)
      .flatMap(s => s.risks)
      .slice(0, 3);
    
    let recommendation = '';
    switch (rating) {
      case 'excellent':
        recommendation = 'Strong potential for approval. Proceed with detailed design development.';
        break;
      case 'good':
        recommendation = 'Good prospects with careful attention to identified constraints. Professional guidance recommended.';
        break;
      case 'moderate':
        recommendation = 'Achievable but requires addressing significant constraints. Pre-application advice strongly recommended.';
        break;
      case 'challenging':
        recommendation = 'Significant obstacles identified. Consider design modifications or alternative approaches before proceeding.';
        break;
      case 'not_recommended':
        recommendation = 'Substantial barriers to approval. Fundamental reconsideration of proposal advised.';
        break;
    }
    
    return {
      overallScore: score,
      rating,
      recommendation,
      keyStrengths: keyStrengths.length > 0 ? keyStrengths : ['Development adds value to property'],
      keyWeaknesses: keyWeaknesses.length > 0 ? keyWeaknesses : ['Standard planning considerations apply'],
    };
  }

  /**
   * Generate project timeline
   */
  private generateTimeline(
    developmentType: string,
    property: PropertyDetails
  ): FeasibilityReport['timeline'] {
    const timeline: FeasibilityReport['timeline'] = [];
    const needsLBC = !!property.listedGrade;
    
    timeline.push({
      phase: 'Pre-Application',
      duration: needsLBC ? '2-3 months' : '1-2 months',
      milestones: [
        'Appoint architect and consultants',
        'Initial design development',
        needsLBC ? 'Heritage impact assessment' : 'Site analysis',
        'Pre-application submission',
        'Pre-application meeting',
      ].filter(Boolean),
    });
    
    timeline.push({
      phase: 'Planning Application',
      duration: needsLBC ? '4-6 months' : '2-3 months',
      milestones: [
        'Detailed design development',
        'Planning application submission',
        needsLBC ? 'Listed building consent submission' : null,
        'Consultation period',
        'Officer assessment',
        'Decision',
      ].filter((m): m is string => m !== null),
    });
    
    timeline.push({
      phase: 'Pre-Construction',
      duration: '2-3 months',
      milestones: [
        'Discharge planning conditions',
        'Building regulations approval',
        'Tender to contractors',
        'Party wall agreements',
        'Final contractor selection',
      ],
    });
    
    let constructionDuration = '4-6 months';
    if (developmentType === 'basement') {
      constructionDuration = '12-18 months';
    } else if (developmentType === 'new_build') {
      constructionDuration = '9-15 months';
    }
    
    timeline.push({
      phase: 'Construction',
      duration: constructionDuration,
      milestones: [
        'Site setup and preparation',
        'Main construction works',
        'Building control inspections',
        'Practical completion',
        'Snagging and handover',
      ],
    });
    
    return timeline;
  }

  /**
   * Generate budget estimate
   */
  private generateBudgetEstimate(
    proposal: DevelopmentProposal,
    property: PropertyDetails
  ): FeasibilityReport['budget'] {
    const budget: FeasibilityReport['budget'] = [];
    const floorspace = proposal.proposedFloorspace || 30; // default sqm
    const isHeritage = !!property.listedGrade || property.conservationArea;
    
    // Construction costs per sqm (Hampstead rates)
    const constructionRates: Record<string, { min: number; max: number }> = {
      extension: { min: 2500, max: 4000 },
      basement: { min: 4000, max: 6500 },
      loft: { min: 2200, max: 3500 },
      new_build: { min: 3000, max: 5000 },
      change_of_use: { min: 1500, max: 3000 },
    };
    
    const defaultRates = { min: 2500, max: 4000 };
    const rates = constructionRates[proposal.type] ?? constructionRates['extension'] ?? defaultRates;
    const heritageMultiplier = isHeritage ? 1.25 : 1.0;
    
    budget.push({
      category: 'Professional Fees',
      estimate: {
        min: Math.round(floorspace * rates.min * 0.12),
        max: Math.round(floorspace * rates.max * 0.18),
      },
      notes: 'Architect, structural engineer, surveys (12-18% of build)',
    });
    
    if (property.listedGrade) {
      budget.push({
        category: 'Heritage Consultants',
        estimate: { min: 3000, max: 8000 },
        notes: 'Heritage statement, impact assessment, specialist advice',
      });
    }
    
    budget.push({
      category: 'Planning Fees',
      estimate: { min: 500, max: 2500 },
      notes: 'Application fees, pre-app fees, discharge of conditions',
    });
    
    budget.push({
      category: 'Construction',
      estimate: {
        min: Math.round(floorspace * rates.min * heritageMultiplier),
        max: Math.round(floorspace * rates.max * heritageMultiplier),
      },
      notes: `Based on ${floorspace}sqm at Hampstead rates${isHeritage ? ' with heritage premium' : ''}`,
    });
    
    budget.push({
      category: 'Contingency (15%)',
      estimate: {
        min: Math.round(floorspace * rates.min * heritageMultiplier * 0.15),
        max: Math.round(floorspace * rates.max * heritageMultiplier * 0.15),
      },
      notes: 'Essential allowance for unforeseen costs',
    });
    
    return budget;
  }

  /**
   * Generate risk matrix
   */
  private generateRiskMatrix(
    property: PropertyDetails,
    proposal: DevelopmentProposal,
    scores: FeasibilityScore[]
  ): FeasibilityReport['riskMatrix'] {
    const risks: FeasibilityReport['riskMatrix'] = [];
    
    // Planning risk
    const planningScore = scores.find(s => s.category === 'Planning Policy')?.score || 50;
    risks.push({
      risk: 'Planning refusal',
      likelihood: planningScore < 50 ? 'high' : planningScore < 70 ? 'medium' : 'low',
      impact: 'high',
      mitigation: 'Pre-application engagement, professional design team, thorough documentation',
    });
    
    // Heritage risk
    if (property.listedGrade) {
      risks.push({
        risk: 'Heritage harm objection',
        likelihood: 'medium',
        impact: 'high',
        mitigation: 'Early heritage consultant engagement, sympathetic design approach',
      });
    }
    
    // Neighbour risk
    if (proposal.type === 'basement' || property.propertyType === 'terraced') {
      risks.push({
        risk: 'Neighbour objections',
        likelihood: 'high',
        impact: 'medium',
        mitigation: 'Early consultation, construction management plan, Party wall Act compliance',
      });
    }
    
    // Cost overrun risk
    risks.push({
      risk: 'Budget overrun',
      likelihood: proposal.type === 'basement' ? 'high' : 'medium',
      impact: 'medium',
      mitigation: 'Detailed surveys before commitment, adequate contingency, fixed-price contracts where possible',
    });
    
    // Programme risk
    risks.push({
      risk: 'Programme delays',
      likelihood: property.listedGrade ? 'high' : 'medium',
      impact: 'medium',
      mitigation: 'Realistic timeline planning, early condition discharge, contractor selection',
    });
    
    return risks;
  }

  /**
   * Generate recommended next steps
   */
  private generateNextSteps(
    property: PropertyDetails,
    proposal: DevelopmentProposal,
    rating: FeasibilityRating
  ): FeasibilityReport['nextSteps'] {
    const steps: FeasibilityReport['nextSteps'] = [];
    let stepNumber = 1;
    
    // Always recommend architect
    steps.push({
      step: stepNumber++,
      action: 'Engage RIBA architect with local conservation area experience',
      priority: 'essential',
      estimatedCost: '£2,000-£5,000 initial fees',
    });
    
    // Heritage consultant if listed
    if (property.listedGrade) {
      steps.push({
        step: stepNumber++,
        action: 'Appoint heritage consultant for impact assessment',
        priority: 'essential',
        estimatedCost: '£3,000-£6,000',
      });
    }
    
    // Pre-app strongly recommended for challenging projects
    if (rating === 'challenging' || rating === 'moderate' || property.listedGrade) {
      steps.push({
        step: stepNumber++,
        action: 'Submit pre-application enquiry to Camden Council',
        priority: 'essential',
        estimatedCost: '£500-£1,500',
      });
    } else {
      steps.push({
        step: stepNumber++,
        action: 'Consider pre-application advice for complex elements',
        priority: 'recommended',
        estimatedCost: '£500-£1,500',
      });
    }
    
    // Surveys based on project type
    if (proposal.type === 'basement') {
      steps.push({
        step: stepNumber++,
        action: 'Commission structural survey and ground investigation',
        priority: 'essential',
        estimatedCost: '£2,000-£5,000',
      });
    }
    
    if (property.tpoTrees) {
      steps.push({
        step: stepNumber++,
        action: 'Commission BS 5837 tree survey',
        priority: 'essential',
        estimatedCost: '£800-£1,500',
      });
    }
    
    // General recommendations
    steps.push({
      step: stepNumber++,
      action: 'Develop initial design concepts for discussion',
      priority: 'essential',
    });
    
    steps.push({
      step: stepNumber++,
      action: 'Discuss proposals informally with immediate neighbours',
      priority: 'recommended',
    });
    
    return steps;
  }
}

export const feasibilityReportGenerator = new FeasibilityReportGenerator();
