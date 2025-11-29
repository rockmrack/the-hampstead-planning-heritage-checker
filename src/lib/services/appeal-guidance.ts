/**
 * Planning Appeal Guidance Service
 * 
 * Comprehensive guidance on planning appeals for refused or
 * non-determined applications in the Hampstead area.
 * 
 * Based on:
 * - Planning Inspectorate procedures
 * - Town and Country Planning Act 1990
 * - Planning appeals statistics
 * - Camden appeal outcomes analysis
 */

// Appeal types
const APPEAL_TYPES: Record<string, {
  description: string;
  procedures: string[];
  timeLimit: string;
  typicalDuration: string;
  costs: string;
}> = {
  'householder': {
    description: 'Appeals against refusal of householder planning permission',
    procedures: ['Written representations (fast track)'],
    timeLimit: '12 weeks from decision date',
    typicalDuration: '8-12 weeks',
    costs: 'No fee to appeal; professional costs £500-3,000'
  },
  'minor_commercial': {
    description: 'Minor commercial appeals (small extensions, changes of use)',
    procedures: ['Written representations'],
    timeLimit: '6 months from decision date',
    typicalDuration: '12-20 weeks',
    costs: 'No fee to appeal; professional costs £2,000-8,000'
  },
  'full_planning': {
    description: 'Appeals against refusal of full planning permission',
    procedures: ['Written representations', 'Hearing', 'Inquiry'],
    timeLimit: '6 months from decision date',
    typicalDuration: '16-52 weeks depending on procedure',
    costs: 'No fee; professional costs £5,000-50,000+'
  },
  'listed_building': {
    description: 'Appeals against refusal of listed building consent',
    procedures: ['Written representations', 'Hearing', 'Inquiry'],
    timeLimit: '6 months from decision date',
    typicalDuration: '16-32 weeks',
    costs: 'No fee; professional costs £5,000-25,000'
  },
  'enforcement': {
    description: 'Appeals against enforcement notices',
    procedures: ['Written representations', 'Hearing', 'Inquiry'],
    timeLimit: '28 days from notice date (STRICT)',
    typicalDuration: '20-40 weeks',
    costs: 'No fee; professional costs £5,000-30,000'
  },
  'non_determination': {
    description: 'Appeals for failure to determine within statutory period',
    procedures: ['Written representations', 'Hearing', 'Inquiry'],
    timeLimit: '6 months from statutory deadline',
    typicalDuration: '16-32 weeks',
    costs: 'Same as refused application appeals'
  },
  'conditions': {
    description: 'Appeals against planning conditions',
    procedures: ['Written representations'],
    timeLimit: '6 months from decision date',
    typicalDuration: '12-20 weeks',
    costs: 'No fee; professional costs £1,000-5,000'
  }
};

// Appeal procedures
const PROCEDURES: Record<string, {
  description: string;
  suitableFor: string[];
  advantages: string[];
  disadvantages: string[];
  format: string;
}> = {
  'written_representations': {
    description: 'Exchange of written statements between parties',
    suitableFor: [
      'Straightforward cases',
      'Clear policy issues',
      'No need for cross-examination',
      'Technical matters with agreed facts'
    ],
    advantages: [
      'Quickest procedure',
      'Lowest costs',
      'No need to attend hearing',
      'Flexible timing for submissions'
    ],
    disadvantages: [
      'No opportunity to question witnesses',
      'Complex issues may be harder to explain',
      'Less opportunity for negotiation'
    ],
    format: 'Written statements exchanged, site visit by Inspector'
  },
  'hearing': {
    description: 'Informal round-table discussion led by Inspector',
    suitableFor: [
      'Cases needing discussion but not cross-examination',
      'Community interest cases',
      'Technical issues needing clarification',
      'Policy interpretation disputes'
    ],
    advantages: [
      'Opportunity to discuss issues',
      'Less formal than inquiry',
      'Relatively quick',
      'Direct engagement with Inspector'
    ],
    disadvantages: [
      'No formal cross-examination',
      'Less structured than inquiry',
      'Still requires attendance'
    ],
    format: 'Half-day to full-day discussion, followed by site visit'
  },
  'inquiry': {
    description: 'Formal hearing with evidence and cross-examination',
    suitableFor: [
      'Complex or controversial cases',
      'Significant legal issues',
      'Expert evidence required',
      'Cases where cross-examination is necessary',
      'Major developments'
    ],
    advantages: [
      'Full opportunity to test evidence',
      'Formal record of proceedings',
      'Expert witnesses can be called',
      'Cross-examination available'
    ],
    disadvantages: [
      'Most expensive procedure',
      'Longest duration',
      'Requires legal representation',
      'Formal and stressful'
    ],
    format: 'Multi-day formal hearing with proofs of evidence, usually with legal representation'
  }
};

// Camden appeal success rates (approximate)
const CAMDEN_APPEAL_STATISTICS = {
  overall_success_rate: 0.33, // 33% allowed
  householder_success_rate: 0.35,
  commercial_success_rate: 0.30,
  listed_building_success_rate: 0.25,
  enforcement_success_rate: 0.28,
  
  common_success_factors: [
    'Officer recommendation was for approval',
    'Single clear reason for refusal',
    'Policy interpretation disagreement',
    'Design acceptable in principle',
    'Precedent from similar allowed appeals'
  ],
  
  common_failure_factors: [
    'Harm to conservation area character',
    'Impact on listed building setting',
    'Loss of residential amenity',
    'Overdevelopment of site',
    'Policy conflict on multiple grounds'
  ]
};

// Grounds of appeal for enforcement
const ENFORCEMENT_GROUNDS = {
  'ground_a': {
    letter: 'A',
    description: 'Planning permission should be granted (deemed application)',
    effect: 'If successful, permission granted',
    evidence: 'Full planning case as if fresh application'
  },
  'ground_b': {
    letter: 'B',
    description: 'The breach of control alleged has not occurred',
    effect: 'Notice quashed',
    evidence: 'Evidence that works/use did not occur'
  },
  'ground_c': {
    letter: 'C',
    description: 'There has not been a breach of planning control',
    effect: 'Notice quashed',
    evidence: 'Evidence works are permitted development or lawful'
  },
  'ground_d': {
    letter: 'D',
    description: 'Enforcement action time limit has expired (operational development)',
    effect: 'Notice quashed',
    evidence: 'Evidence works completed more than 4 years ago'
  },
  'ground_e': {
    letter: 'E',
    description: 'Notice was not properly served',
    effect: 'Notice quashed',
    evidence: 'Procedural defects in service'
  },
  'ground_f': {
    letter: 'F',
    description: 'Steps required exceed what is necessary',
    effect: 'Notice varied',
    evidence: 'Alternative remediation proposals'
  },
  'ground_g': {
    letter: 'G',
    description: 'Compliance period is too short',
    effect: 'Compliance period extended',
    evidence: 'Evidence of reasonable time needed'
  }
};

// Costs awards
const COSTS_AWARDS = {
  grounds: [
    'Unreasonable behaviour causing unnecessary expense',
    'Failure to produce evidence to substantiate reasons for refusal',
    'Introducing new reasons at appeal stage',
    'Procedural delays or failures',
    'Vexatious or frivolous appeals'
  ],
  types: {
    full: 'All costs of the appeal',
    partial: 'Costs relating to specific issue',
    thrown_away: 'Costs of abortive work due to postponement'
  },
  likelihood: 'Costs awards made in approximately 10% of appeals'
};

interface RefusedApplication {
  applicationType: string;
  decisionDate?: string;
  reasonsForRefusal: string[];
  officerRecommendation?: 'approve' | 'refuse';
  listedBuilding?: boolean;
  conservationArea?: boolean;
  enforcementNotice?: boolean;
  noticeDate?: string;
}

interface AppealAssessmentResult {
  summary: {
    appealType: string;
    recommendedProcedure: string;
    timeLimit: string;
    daysRemaining: number;
    estimatedSuccessRate: number;
    estimatedCosts: string;
    estimatedDuration: string;
  };
  appealTypeDetails: {
    description: string;
    availableProcedures: string[];
    timeLimit: string;
    typicalDuration: string;
  };
  procedureRecommendation: {
    recommended: string;
    reasoning: string[];
    advantages: string[];
    disadvantages: string[];
  };
  reasonsAnalysis: Array<{
    reason: string;
    strength: 'strong' | 'moderate' | 'weak';
    appealStrategy: string;
    evidenceNeeded: string[];
  }>;
  successFactors: {
    positive: string[];
    negative: string[];
    overallAssessment: string;
  };
  documentationRequired: {
    mandatory: string[];
    recommended: string[];
    evidenceToSubmit: string[];
  };
  timeline: Array<{
    stage: string;
    action: string;
    deadline: string;
  }>;
  costsRisk: {
    exposureLevel: 'low' | 'medium' | 'high';
    potentialGrounds: string[];
    mitigation: string[];
  };
  alternativeOptions: Array<{
    option: string;
    description: string;
    advantages: string[];
    disadvantages: string[];
  }>;
  guidance: string[];
  warnings: string[];
}

export class AppealGuidanceService {
  
  /**
   * Assess appeal prospects and provide guidance
   */
  assessAppeal(
    address: string,
    refusedApplication: RefusedApplication
  ): AppealAssessmentResult {
    // Determine appeal type
    const appealType = this.determineAppealType(refusedApplication);
    const appealTypeInfo = APPEAL_TYPES[appealType] || APPEAL_TYPES['full_planning'];
    
    // Default appeal type info
    const defaultAppealInfo = {
      description: 'Appeals against refusal of planning permission',
      procedures: ['Written representations', 'Hearing', 'Inquiry'],
      timeLimit: '6 months from decision date',
      typicalDuration: '16-52 weeks depending on procedure',
      costs: 'No fee; professional costs £5,000-50,000+'
    };
    const safeAppealInfo = appealTypeInfo || defaultAppealInfo;
    
    // Calculate time remaining
    const timeRemaining = this.calculateTimeRemaining(
      refusedApplication.decisionDate || refusedApplication.noticeDate,
      safeAppealInfo.timeLimit
    );
    
    // Recommend procedure
    const procedureRec = this.recommendProcedure(refusedApplication);
    
    // Analyze reasons for refusal
    const reasonsAnalysis = this.analyzeReasons(refusedApplication.reasonsForRefusal);
    
    // Assess success factors
    const successFactors = this.assessSuccessFactors(refusedApplication);
    
    // Estimate success rate
    const successRate = this.estimateSuccessRate(refusedApplication, reasonsAnalysis);
    
    // Generate required documentation
    const documentation = this.generateDocumentation(refusedApplication);
    
    // Generate timeline
    const timeline = this.generateTimeline(appealType, refusedApplication);
    
    // Assess costs risk
    const costsRisk = this.assessCostsRisk(refusedApplication);
    
    // Generate alternatives
    const alternatives = this.generateAlternatives(refusedApplication);
    
    return {
      summary: {
        appealType,
        recommendedProcedure: procedureRec.recommended,
        timeLimit: safeAppealInfo.timeLimit,
        daysRemaining: timeRemaining,
        estimatedSuccessRate: successRate,
        estimatedCosts: safeAppealInfo.costs,
        estimatedDuration: safeAppealInfo.typicalDuration
      },
      appealTypeDetails: {
        description: safeAppealInfo.description,
        availableProcedures: safeAppealInfo.procedures,
        timeLimit: safeAppealInfo.timeLimit,
        typicalDuration: safeAppealInfo.typicalDuration
      },
      procedureRecommendation: procedureRec,
      reasonsAnalysis,
      successFactors,
      documentationRequired: documentation,
      timeline,
      costsRisk,
      alternativeOptions: alternatives,
      guidance: this.generateGuidance(refusedApplication, appealType),
      warnings: this.generateWarnings(refusedApplication, timeRemaining)
    };
  }
  
  /**
   * Determine appeal type
   */
  private determineAppealType(app: RefusedApplication): string {
    if (app.enforcementNotice) {
      return 'enforcement';
    }
    
    if (app.applicationType === 'householder') {
      return 'householder';
    }
    
    if (app.applicationType === 'listed_building') {
      return 'listed_building';
    }
    
    if (app.applicationType === 'conditions') {
      return 'conditions';
    }
    
    if (app.applicationType === 'non_determination') {
      return 'non_determination';
    }
    
    if (app.applicationType === 'minor_commercial') {
      return 'minor_commercial';
    }
    
    return 'full_planning';
  }
  
  /**
   * Calculate time remaining for appeal
   */
  private calculateTimeRemaining(dateStr: string | undefined, timeLimit: string): number {
    if (!dateStr) return 180; // Default to 6 months if no date
    
    const decisionDate = new Date(dateStr);
    const today = new Date();
    
    let limitDays = 180; // Default 6 months
    if (timeLimit.includes('12 weeks')) {
      limitDays = 84;
    } else if (timeLimit.includes('28 days')) {
      limitDays = 28;
    }
    
    const deadline = new Date(decisionDate);
    deadline.setDate(deadline.getDate() + limitDays);
    
    const daysRemaining = Math.floor((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    return Math.max(0, daysRemaining);
  }
  
  /**
   * Recommend appeal procedure
   */
  private recommendProcedure(app: RefusedApplication): {
    recommended: string;
    reasoning: string[];
    advantages: string[];
    disadvantages: string[];
  } {
    const reasons = app.reasonsForRefusal.length;
    
    // Default to written representations
    let recommended = 'written_representations';
    const reasoning: string[] = [];
    
    // Check if hearing or inquiry needed
    if (app.listedBuilding && app.conservationArea && reasons > 2) {
      recommended = 'hearing';
      reasoning.push('Heritage issues benefit from discussion');
      reasoning.push('Multiple issues warrant round-table format');
    } else if (reasons > 3) {
      recommended = 'hearing';
      reasoning.push('Multiple reasons for refusal suggest complexity');
    } else if (app.enforcementNotice) {
      recommended = 'hearing';
      reasoning.push('Enforcement appeals often benefit from hearing format');
    } else {
      reasoning.push('Straightforward issues suit written procedure');
      reasoning.push('Most cost-effective approach');
    }
    
    const procedureInfo = PROCEDURES[recommended];
    const defaultProcedure = {
      advantages: ['Cost-effective', 'No attendance required'],
      disadvantages: ['No cross-examination opportunity']
    };
    
    return {
      recommended,
      reasoning,
      advantages: procedureInfo?.advantages || defaultProcedure.advantages,
      disadvantages: procedureInfo?.disadvantages || defaultProcedure.disadvantages
    };
  }
  
  /**
   * Analyze reasons for refusal
   */
  private analyzeReasons(reasons: string[]): Array<{
    reason: string;
    strength: 'strong' | 'moderate' | 'weak';
    appealStrategy: string;
    evidenceNeeded: string[];
  }> {
    return reasons.map(reason => {
      const lowerReason = reason.toLowerCase();
      
      let strength: 'strong' | 'moderate' | 'weak' = 'moderate';
      let appealStrategy = '';
      const evidenceNeeded: string[] = [];
      
      // Analyze different reason types
      if (lowerReason.includes('design') || lowerReason.includes('appearance')) {
        strength = 'moderate';
        appealStrategy = 'Challenge design assessment with precedent examples and expert opinion';
        evidenceNeeded.push('Examples of similar approved schemes');
        evidenceNeeded.push('Design and Access Statement updates');
        evidenceNeeded.push('Character area analysis');
      } else if (lowerReason.includes('amenity') || lowerReason.includes('overlooking')) {
        strength = 'strong';
        appealStrategy = 'Demonstrate compliance with BRE guidelines and precedent distances';
        evidenceNeeded.push('Sunlight/daylight assessment');
        evidenceNeeded.push('Privacy impact analysis');
        evidenceNeeded.push('Comparable development examples');
      } else if (lowerReason.includes('conservation') || lowerReason.includes('heritage')) {
        strength = 'strong';
        appealStrategy = 'Demonstrate neutral or positive heritage impact';
        evidenceNeeded.push('Heritage Impact Assessment');
        evidenceNeeded.push('Historic England guidance compliance');
        evidenceNeeded.push('Conservation Area Audit analysis');
      } else if (lowerReason.includes('policy')) {
        strength = 'moderate';
        appealStrategy = 'Challenge policy interpretation or demonstrate compliance';
        evidenceNeeded.push('Detailed policy analysis');
        evidenceNeeded.push('Appeal decision precedents');
        evidenceNeeded.push('Material considerations');
      } else if (lowerReason.includes('highway') || lowerReason.includes('parking')) {
        strength = 'moderate';
        appealStrategy = 'Provide technical evidence from highways consultant';
        evidenceNeeded.push('Transport Assessment');
        evidenceNeeded.push('Parking survey data');
        evidenceNeeded.push('Highway authority consultation');
      } else {
        appealStrategy = 'Address specific concerns with targeted evidence';
        evidenceNeeded.push('Relevant technical assessments');
        evidenceNeeded.push('Policy justification');
      }
      
      return {
        reason,
        strength,
        appealStrategy,
        evidenceNeeded
      };
    });
  }
  
  /**
   * Assess success factors
   */
  private assessSuccessFactors(app: RefusedApplication): {
    positive: string[];
    negative: string[];
    overallAssessment: string;
  } {
    const positive: string[] = [];
    const negative: string[] = [];
    
    // Officer recommendation
    if (app.officerRecommendation === 'approve') {
      positive.push('Officer recommendation was for approval');
    } else if (app.officerRecommendation === 'refuse') {
      negative.push('Officer recommended refusal');
    }
    
    // Number of reasons
    if (app.reasonsForRefusal.length === 1) {
      positive.push('Single reason for refusal - focused appeal');
    } else if (app.reasonsForRefusal.length > 3) {
      negative.push('Multiple reasons for refusal indicate fundamental concerns');
    }
    
    // Heritage constraints
    if (app.listedBuilding) {
      negative.push('Listed building appeals have lower success rates');
    }
    if (app.conservationArea) {
      negative.push('Conservation area issues are typically upheld');
    }
    
    // Overall assessment
    let overallAssessment: string;
    const positiveScore = positive.length;
    const negativeScore = negative.length;
    
    if (positiveScore > negativeScore + 1) {
      overallAssessment = 'Appeal has reasonable prospects of success';
    } else if (negativeScore > positiveScore + 1) {
      overallAssessment = 'Appeal faces significant challenges';
    } else {
      overallAssessment = 'Appeal outcome is uncertain - balanced case';
    }
    
    return { positive, negative, overallAssessment };
  }
  
  /**
   * Estimate success rate
   */
  private estimateSuccessRate(
    app: RefusedApplication,
    reasonsAnalysis: Array<{ strength: string }>
  ): number {
    let baseRate = CAMDEN_APPEAL_STATISTICS.overall_success_rate;
    
    // Adjust for application type
    if (app.applicationType === 'householder') {
      baseRate = CAMDEN_APPEAL_STATISTICS.householder_success_rate;
    } else if (app.listedBuilding) {
      baseRate = CAMDEN_APPEAL_STATISTICS.listed_building_success_rate;
    } else if (app.enforcementNotice) {
      baseRate = CAMDEN_APPEAL_STATISTICS.enforcement_success_rate;
    }
    
    // Adjust for officer recommendation
    if (app.officerRecommendation === 'approve') {
      baseRate += 0.15;
    } else if (app.officerRecommendation === 'refuse') {
      baseRate -= 0.05;
    }
    
    // Adjust for reason strength
    const strongReasons = reasonsAnalysis.filter(r => r.strength === 'strong').length;
    baseRate -= strongReasons * 0.05;
    
    // Clamp between 10% and 60%
    return Math.max(0.10, Math.min(0.60, baseRate));
  }
  
  /**
   * Generate documentation requirements
   */
  private generateDocumentation(app: RefusedApplication): {
    mandatory: string[];
    recommended: string[];
    evidenceToSubmit: string[];
  } {
    const mandatory = [
      'Completed appeal form',
      'Copy of original application',
      'Copy of decision notice (or proof of non-determination)',
      'Copy of all plans and drawings',
      'Full statement of case'
    ];
    
    const recommended: string[] = [];
    const evidenceToSubmit: string[] = [];
    
    // Add type-specific documents
    if (app.listedBuilding || app.conservationArea) {
      recommended.push('Heritage Impact Assessment');
      evidenceToSubmit.push('Historic photographs or documentation');
    }
    
    recommended.push('Relevant appeal decisions (precedents)');
    recommended.push('Supporting letters from neighbours if positive');
    evidenceToSubmit.push('Any technical assessments');
    evidenceToSubmit.push('Policy analysis document');
    
    if (app.enforcementNotice) {
      mandatory.push('Copy of enforcement notice');
      evidenceToSubmit.push('Evidence of lawfulness (if applicable)');
      evidenceToSubmit.push('Timeline of development/use');
    }
    
    return { mandatory, recommended, evidenceToSubmit };
  }
  
  /**
   * Generate appeal timeline
   */
  private generateTimeline(
    appealType: string,
    app: RefusedApplication
  ): Array<{ stage: string; action: string; deadline: string }> {
    const timeline: Array<{ stage: string; action: string; deadline: string }> = [];
    
    const appealInfo = APPEAL_TYPES[appealType];
    const defaultInfo = { timeLimit: '6 months from decision date', typicalDuration: '16-32 weeks' };
    const safeAppealInfo = appealInfo || defaultInfo;
    
    timeline.push({
      stage: '1. Decision to appeal',
      action: 'Review case, obtain professional advice',
      deadline: 'As soon as possible after refusal'
    });
    
    timeline.push({
      stage: '2. Prepare appeal',
      action: 'Gather evidence, prepare statement of case',
      deadline: 'Allow 2-4 weeks'
    });
    
    timeline.push({
      stage: '3. Submit appeal',
      action: 'Submit via Planning Portal or post',
      deadline: safeAppealInfo.timeLimit
    });
    
    timeline.push({
      stage: '4. Start letter issued',
      action: 'PINS confirms validity and sets timetable',
      deadline: '1-2 weeks after submission'
    });
    
    timeline.push({
      stage: '5. Statement exchange',
      action: 'Council submits response statement',
      deadline: '5-6 weeks from start'
    });
    
    timeline.push({
      stage: '6. Comments period',
      action: 'Final comments on statements',
      deadline: '9 weeks from start (written reps)'
    });
    
    timeline.push({
      stage: '7. Site visit',
      action: 'Inspector visits site (accompanied or unaccompanied)',
      deadline: '10-12 weeks from start'
    });
    
    timeline.push({
      stage: '8. Decision',
      action: 'Inspector issues decision letter',
      deadline: safeAppealInfo.typicalDuration
    });
    
    return timeline;
  }
  
  /**
   * Assess costs risk
   */
  private assessCostsRisk(app: RefusedApplication): {
    exposureLevel: 'low' | 'medium' | 'high';
    potentialGrounds: string[];
    mitigation: string[];
  } {
    let exposureLevel: 'low' | 'medium' | 'high' = 'low';
    const potentialGrounds: string[] = [];
    const mitigation: string[] = [];
    
    // Assess risk factors
    if (app.reasonsForRefusal.length > 3) {
      exposureLevel = 'medium';
      potentialGrounds.push('Multiple strong reasons may indicate weak appeal case');
    }
    
    if (app.officerRecommendation === 'refuse') {
      potentialGrounds.push('Officer recommendation aligned with decision');
    }
    
    // Mitigation advice
    mitigation.push('Ensure all arguments are properly evidenced');
    mitigation.push('Do not introduce new matters at appeal');
    mitigation.push('Be prepared to withdraw if case weakens');
    mitigation.push('Consider negotiated settlement if offered');
    
    return { exposureLevel, potentialGrounds, mitigation };
  }
  
  /**
   * Generate alternative options
   */
  private generateAlternatives(app: RefusedApplication): Array<{
    option: string;
    description: string;
    advantages: string[];
    disadvantages: string[];
  }> {
    return [
      {
        option: 'Revised application',
        description: 'Submit new application addressing reasons for refusal',
        advantages: [
          'Opportunity to negotiate with officers',
          'No risk of costs award',
          'Can incorporate changed circumstances',
          'Maintains relationship with Council'
        ],
        disadvantages: [
          'New application fee required',
          'Additional delay',
          'No guarantee of different outcome'
        ]
      },
      {
        option: 'Pre-application advice',
        description: 'Obtain formal advice before resubmission or appeal',
        advantages: [
          'Understand Council\'s position better',
          'May identify acceptable amendments',
          'Written record of advice'
        ],
        disadvantages: [
          'Additional fee and delay',
          'Advice not binding'
        ]
      },
      {
        option: 'Ombudsman complaint',
        description: 'Complain about maladministration (not merits)',
        advantages: [
          'Free service',
          'Can address procedural failures'
        ],
        disadvantages: [
          'Cannot overturn planning decisions',
          'Long process',
          'Only for maladministration'
        ]
      },
      {
        option: 'Judicial review',
        description: 'Challenge legality of decision in High Court',
        advantages: [
          'Can challenge legal errors',
          'May quash unlawful decisions'
        ],
        disadvantages: [
          'Very expensive (£20,000-100,000+)',
          'Strict time limits (6 weeks)',
          'Cannot challenge planning merits',
          'High risk of adverse costs'
        ]
      }
    ];
  }
  
  /**
   * Generate guidance
   */
  private generateGuidance(app: RefusedApplication, appealType: string): string[] {
    const guidance: string[] = [];
    
    guidance.push('Appeals should only be pursued where there is genuine merit');
    guidance.push('Obtain professional advice before deciding to appeal');
    guidance.push('The Inspector will make a fresh decision on the merits');
    guidance.push('All material submitted to the Council is automatically included');
    
    if (appealType === 'householder') {
      guidance.push('Householder appeals use fast-track written procedure');
      guidance.push('Decision typically within 8-12 weeks of valid submission');
    }
    
    if (app.listedBuilding) {
      guidance.push('Listed building appeals require heritage expertise');
      guidance.push('Consider engaging heritage consultant');
    }
    
    guidance.push('Submit appeal via Planning Portal for fastest processing');
    guidance.push('Keep Council informed of any material changes');
    
    return guidance;
  }
  
  /**
   * Generate warnings
   */
  private generateWarnings(app: RefusedApplication, daysRemaining: number): string[] {
    const warnings: string[] = [];
    
    if (daysRemaining <= 14) {
      warnings.push('URGENT: Appeal deadline is imminent - act immediately');
    } else if (daysRemaining <= 28) {
      warnings.push('WARNING: Appeal deadline approaching - submit within 2 weeks');
    }
    
    if (app.enforcementNotice) {
      warnings.push('STRICT 28-day deadline for enforcement appeals - NO EXTENSIONS');
    }
    
    warnings.push('Costs may be awarded against unreasonable appellants');
    warnings.push('An appeal decision cannot be further appealed on merits');
    warnings.push('Dismissed appeals may prejudice future applications');
    
    return warnings;
  }
  
  /**
   * Get enforcement grounds
   */
  getEnforcementGrounds(): Record<string, {
    letter: string;
    description: string;
    effect: string;
    evidence: string;
  }> {
    return ENFORCEMENT_GROUNDS;
  }
  
  /**
   * Get appeal procedures
   */
  getAppealProcedures(): Record<string, {
    description: string;
    suitableFor: string[];
    advantages: string[];
    format: string;
  }> {
    const result: Record<string, {
      description: string;
      suitableFor: string[];
      advantages: string[];
      format: string;
    }> = {};
    
    for (const [key, value] of Object.entries(PROCEDURES)) {
      result[key] = {
        description: value.description,
        suitableFor: value.suitableFor,
        advantages: value.advantages,
        format: value.format
      };
    }
    
    return result;
  }
}

export default AppealGuidanceService;
