/**
 * Appeal Strategy Service
 * Planning appeal guidance, case analysis, and strategy recommendations
 * For refused applications and enforcement notices
 */

// Types
type AppealType = 
  | 'written_representations'
  | 'hearing'
  | 'inquiry';

type AppealGround = 
  | 'policy_compliance'
  | 'precedent'
  | 'material_considerations'
  | 'procedural_error'
  | 'conditions_unreasonable';

interface AppealCase {
  reference: string;
  type: AppealType;
  outcome: 'allowed' | 'dismissed' | 'split_decision';
  grounds: AppealGround[];
  keyArguments: string[];
  inspector_comments: string[];
  relevance: 'high' | 'medium' | 'low';
}

interface AppealStrategy {
  recommendedType: AppealType;
  successProbability: number; // 0-100
  estimatedCost: { min: number; max: number };
  timeline: string;
  groundsToArgue: AppealGround[];
  supportingEvidence: string[];
  weaknesses: string[];
  recommendations: string[];
}

interface RefusalAnalysis {
  reasons: string[];
  addressableReasons: string[];
  difficultReasons: string[];
  policyConflicts: string[];
  potentialCompromises: string[];
}

// Camden/Hampstead appeal success rates by type
const APPEAL_SUCCESS_RATES = {
  extension: {
    written_representations: 35,
    hearing: 42,
    inquiry: 45,
  },
  basement: {
    written_representations: 25,
    hearing: 32,
    inquiry: 38,
  },
  loft_conversion: {
    written_representations: 40,
    hearing: 48,
    inquiry: 50,
  },
  change_of_use: {
    written_representations: 30,
    hearing: 38,
    inquiry: 42,
  },
  new_build: {
    written_representations: 20,
    hearing: 28,
    inquiry: 35,
  },
  listed_building: {
    written_representations: 18,
    hearing: 25,
    inquiry: 30,
  },
};

// Appeal costs
const APPEAL_COSTS = {
  written_representations: { min: 3000, max: 8000 },
  hearing: { min: 8000, max: 20000 },
  inquiry: { min: 20000, max: 75000 },
};

// Appeal timelines
const APPEAL_TIMELINES = {
  written_representations: '16-24 weeks',
  hearing: '20-32 weeks',
  inquiry: '32-52 weeks',
};

// Common refusal reasons and responses
const REFUSAL_RESPONSES: Record<string, {
  category: string;
  appealability: 'high' | 'medium' | 'low';
  arguments: string[];
  evidence: string[];
}> = {
  'out_of_character': {
    category: 'Design',
    appealability: 'medium',
    arguments: [
      'Demonstrate design evolution in area',
      'Reference similar approved schemes',
      'Show complementary rather than matching approach',
    ],
    evidence: [
      'Street scene analysis',
      'Approved precedents within 200m',
      'Design expert statement',
    ],
  },
  'overdevelopment': {
    category: 'Scale',
    appealability: 'low',
    arguments: [
      'Compare with similar plot ratios nearby',
      'Demonstrate functional need for space',
      'Show minimal visual impact',
    ],
    evidence: [
      'Plot ratio analysis',
      'Daylight/sunlight study',
      'CGIs from public viewpoints',
    ],
  },
  'neighbour_amenity': {
    category: 'Impact',
    appealability: 'high',
    arguments: [
      'BRE daylight/sunlight compliance',
      'Limited overlooking through design',
      'Reasonable expectation in urban area',
    ],
    evidence: [
      'BRE daylight/sunlight assessment',
      'Privacy analysis with distances',
      'Technical expert statement',
    ],
  },
  'heritage_harm': {
    category: 'Heritage',
    appealability: 'low',
    arguments: [
      'Less than substantial harm balanced by public benefits',
      'Historic England not objecting',
      'Reversible interventions',
    ],
    evidence: [
      'Heritage impact assessment',
      'Historic England consultation',
      'Conservation officer dialogue',
    ],
  },
  'policy_conflict': {
    category: 'Policy',
    appealability: 'medium',
    arguments: [
      'Material considerations outweigh policy',
      'Policy interpretation too restrictive',
      'Consistency with other decisions',
    ],
    evidence: [
      'Policy compliance matrix',
      'Comparable approved cases',
      'Expert planning statement',
    ],
  },
  'basement_policy': {
    category: 'Basement',
    appealability: 'low',
    arguments: [
      'Compliance with 50% garden rule',
      'No structural concerns',
      'Construction management addressed',
    ],
    evidence: [
      'Structural engineering report',
      'Hydrology assessment',
      'Construction management plan',
    ],
  },
  'trees': {
    category: 'Trees',
    appealability: 'high',
    arguments: [
      'Arboricultural method statement acceptable',
      'Replacement planting proposed',
      'Limited impact on significant trees',
    ],
    evidence: [
      'BS5837 tree survey',
      'Arboricultural impact assessment',
      'Root protection methodology',
    ],
  },
};

// Precedent cases (simplified examples)
const PRECEDENT_CASES: AppealCase[] = [
  {
    reference: 'APP/X5210/D/22/1234567',
    type: 'written_representations',
    outcome: 'allowed',
    grounds: ['precedent', 'material_considerations'],
    keyArguments: ['Similar extension approved 50m away', 'Limited visual impact'],
    inspector_comments: ['Council inconsistent', 'Harm not demonstrated'],
    relevance: 'high',
  },
  {
    reference: 'APP/X5210/W/21/7654321',
    type: 'hearing',
    outcome: 'allowed',
    grounds: ['policy_compliance', 'procedural_error'],
    keyArguments: ['Complies with policy D1', 'Conservation officer not consulted'],
    inspector_comments: ['Policy supports development', 'Procedure flawed'],
    relevance: 'medium',
  },
  {
    reference: 'APP/X5210/Y/23/9876543',
    type: 'written_representations',
    outcome: 'dismissed',
    grounds: ['material_considerations'],
    keyArguments: ['Public benefits outweigh harm'],
    inspector_comments: ['Heritage harm significant', 'Benefits not compelling'],
    relevance: 'medium',
  },
];

// Service class
export class AppealStrategyService {
  /**
   * Analyze refusal reasons
   */
  analyzeRefusal(refusalReasons: string[]): RefusalAnalysis {
    const addressable: string[] = [];
    const difficult: string[] = [];
    const policyConflicts: string[] = [];
    const compromises: string[] = [];
    
    for (const reason of refusalReasons) {
      const lowerReason = reason.toLowerCase();
      
      // Find matching response category
      let matchedKey: string | null = null;
      for (const key of Object.keys(REFUSAL_RESPONSES)) {
        const refusalResponse = REFUSAL_RESPONSES[key];
        if (refusalResponse && (lowerReason.includes(key.replace('_', ' ')) ||
            lowerReason.includes(refusalResponse.category.toLowerCase()))) {
          matchedKey = key;
          break;
        }
      }
      
      if (matchedKey) {
        const response = REFUSAL_RESPONSES[matchedKey];
        if (response && response.appealability === 'high') {
          addressable.push(reason);
        } else if (response && response.appealability === 'low') {
          difficult.push(reason);
        } else {
          addressable.push(reason);
        }
        
        if (response && response.category === 'Policy') {
          policyConflicts.push(reason);
        }
      } else {
        // Unknown reason - assume medium difficulty
        addressable.push(reason);
      }
    }
    
    // Generate potential compromises
    if (difficult.some(r => r.toLowerCase().includes('scale'))) {
      compromises.push('Consider reducing scheme by 10-15%');
    }
    if (difficult.some(r => r.toLowerCase().includes('heritage'))) {
      compromises.push('Engage heritage consultant for redesign');
    }
    if (difficult.some(r => r.toLowerCase().includes('basement'))) {
      compromises.push('Consider reducing basement footprint to 50% garden');
    }
    
    return {
      reasons: refusalReasons,
      addressableReasons: addressable,
      difficultReasons: difficult,
      policyConflicts,
      potentialCompromises: compromises,
    };
  }

  /**
   * Develop appeal strategy
   */
  developStrategy(
    projectType: string,
    refusalReasons: string[],
    isListed: boolean,
    inConservationArea: boolean,
    hasHeritageConcerns: boolean
  ): AppealStrategy {
    // Determine success rates
    const projectKey = projectType as keyof typeof APPEAL_SUCCESS_RATES;
    const rates = APPEAL_SUCCESS_RATES[projectKey] || APPEAL_SUCCESS_RATES['extension'];
    
    // Adjust for heritage
    let successModifier = 0;
    if (isListed) successModifier -= 15;
    if (inConservationArea) successModifier -= 5;
    if (hasHeritageConcerns) successModifier -= 10;
    
    // Analyze refusal
    const analysis = this.analyzeRefusal(refusalReasons);
    
    // Adjust for addressability
    const addressableRatio = analysis.addressableReasons.length / 
      Math.max(1, refusalReasons.length);
    successModifier += Math.round(addressableRatio * 10);
    
    // Recommend appeal type
    let recommendedType: AppealType = 'written_representations';
    let baseProbability = rates.written_representations;
    
    if (refusalReasons.length > 3 || hasHeritageConcerns) {
      recommendedType = 'hearing';
      baseProbability = rates.hearing;
    }
    
    if (isListed || refusalReasons.length > 5) {
      recommendedType = 'inquiry';
      baseProbability = rates.inquiry;
    }
    
    const successProbability = Math.max(5, Math.min(85, baseProbability + successModifier));
    
    // Determine grounds
    const grounds: AppealGround[] = [];
    if (analysis.policyConflicts.length > 0) grounds.push('policy_compliance');
    if (analysis.addressableReasons.length > 0) grounds.push('material_considerations');
    grounds.push('precedent'); // Always worth exploring
    
    // Gather evidence requirements
    const evidence: string[] = [];
    for (const reason of analysis.addressableReasons) {
      const lowerReason = reason.toLowerCase();
      for (const [key, response] of Object.entries(REFUSAL_RESPONSES)) {
        if (lowerReason.includes(key.replace('_', ' ')) ||
            lowerReason.includes(response.category.toLowerCase())) {
          evidence.push(...response.evidence);
          break;
        }
      }
    }
    // Deduplicate evidence
    const uniqueEvidence = Array.from(new Set(evidence));
    
    // Identify weaknesses
    const weaknesses: string[] = [];
    if (analysis.difficultReasons.length > 0) {
      weaknesses.push(`${analysis.difficultReasons.length} reason(s) difficult to overcome`);
    }
    if (isListed) {
      weaknesses.push('Listed building cases have lower success rates');
    }
    if (hasHeritageConcerns && !evidence.includes('Heritage impact assessment')) {
      weaknesses.push('Heritage assessment recommended');
    }
    
    // Build recommendations
    const recommendations: string[] = [];
    recommendations.push('Engage planning consultant with appeal experience');
    if (hasHeritageConcerns) {
      recommendations.push('Commission independent heritage assessment');
    }
    recommendations.push('Research recent approved precedents in area');
    if (analysis.potentialCompromises.length > 0) {
      recommendations.push('Consider scheme amendments before appeal');
    }
    if (successProbability < 30) {
      recommendations.push('Consider pre-appeal discussions with planning authority');
    }
    
    return {
      recommendedType,
      successProbability,
      estimatedCost: APPEAL_COSTS[recommendedType],
      timeline: APPEAL_TIMELINES[recommendedType],
      groundsToArgue: grounds,
      supportingEvidence: uniqueEvidence,
      weaknesses,
      recommendations,
    };
  }

  /**
   * Find relevant precedent cases
   */
  findPrecedents(
    projectType: string,
    refusalReasons: string[]
  ): AppealCase[] {
    // In production, this would search a database
    // For now, return relevant sample cases
    return PRECEDENT_CASES.filter(c => {
      // Filter by relevance
      return c.relevance === 'high' || c.relevance === 'medium';
    });
  }

  /**
   * Get appeal deadlines
   */
  getDeadlines(decisionDate: Date): {
    appealDeadline: Date;
    daysRemaining: number;
    urgent: boolean;
  } {
    // Standard appeal deadline is 6 months from decision
    const appealDeadline = new Date(decisionDate);
    appealDeadline.setMonth(appealDeadline.getMonth() + 6);
    
    const now = new Date();
    const daysRemaining = Math.floor(
      (appealDeadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    return {
      appealDeadline,
      daysRemaining,
      urgent: daysRemaining < 30,
    };
  }

  /**
   * Get appeal type info
   */
  getAppealTypeInfo(): Record<AppealType, {
    name: string;
    description: string;
    suitableFor: string[];
    costs: { min: number; max: number };
    timeline: string;
  }> {
    return {
      written_representations: {
        name: 'Written Representations',
        description: 'Exchange of written statements - no hearing',
        suitableFor: [
          'Straightforward cases',
          'Limited technical issues',
          'Clear-cut policy matters',
        ],
        costs: APPEAL_COSTS.written_representations,
        timeline: APPEAL_TIMELINES.written_representations,
      },
      hearing: {
        name: 'Hearing',
        description: 'Informal discussion led by inspector',
        suitableFor: [
          'Multiple refusal reasons',
          'Need to explain design rationale',
          'Complex but not highly technical',
        ],
        costs: APPEAL_COSTS.hearing,
        timeline: APPEAL_TIMELINES.hearing,
      },
      inquiry: {
        name: 'Public Inquiry',
        description: 'Formal hearing with cross-examination',
        suitableFor: [
          'Major developments',
          'Significant public interest',
          'Complex technical/legal issues',
          'Listed building cases',
        ],
        costs: APPEAL_COSTS.inquiry,
        timeline: APPEAL_TIMELINES.inquiry,
      },
    };
  }

  /**
   * Get success rates by project type
   */
  getSuccessRates(): typeof APPEAL_SUCCESS_RATES {
    return APPEAL_SUCCESS_RATES;
  }

  /**
   * Get refusal response templates
   */
  getRefusalResponses(): typeof REFUSAL_RESPONSES {
    return REFUSAL_RESPONSES;
  }
}

// Export singleton instance
export const appealStrategyService = new AppealStrategyService();
