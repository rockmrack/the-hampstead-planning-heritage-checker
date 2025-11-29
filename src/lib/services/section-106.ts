/**
 * Section 106 Planning Obligations Service
 * 
 * Comprehensive guidance on Section 106 agreements for developments
 * in the Hampstead area. Provides obligation estimates, negotiation
 * guidance, and compliance information.
 * 
 * Based on:
 * - Camden Planning Obligations SPD
 * - Town and Country Planning Act 1990 (as amended)
 * - Community Infrastructure Levy Regulations 2010
 * - NPPF and Planning Practice Guidance
 */

// Camden S106 contribution types and rates
const S106_CONTRIBUTIONS: Record<string, {
  description: string;
  triggerThreshold: number;
  calculationBasis: string;
  typicalRate: string;
  poolingLimit: number;
}> = {
  'affordable_housing': {
    description: 'On-site affordable housing provision or payment in lieu',
    triggerThreshold: 10,
    calculationBasis: 'Number of units (50% target above threshold)',
    typicalRate: '£150,000-200,000 per unit equivalent',
    poolingLimit: 0 // No pooling for affordable housing
  },
  'transport': {
    description: 'Sustainable transport improvements and mitigation',
    triggerThreshold: 10,
    calculationBasis: 'Per residential unit or per 100sqm commercial',
    typicalRate: '£2,000-5,000 per unit',
    poolingLimit: 5
  },
  'open_space': {
    description: 'Public open space improvements and maintenance',
    triggerThreshold: 1,
    calculationBasis: 'Per residential unit',
    typicalRate: '£1,500-3,000 per unit',
    poolingLimit: 5
  },
  'employment_training': {
    description: 'Local employment and training initiatives',
    triggerThreshold: 10,
    calculationBasis: 'Per 1,000sqm commercial or 50+ residential',
    typicalRate: '£15,000-25,000 per scheme',
    poolingLimit: 5
  },
  'community_facilities': {
    description: 'Community centre and social infrastructure',
    triggerThreshold: 20,
    calculationBasis: 'Per residential unit',
    typicalRate: '£1,000-2,500 per unit',
    poolingLimit: 5
  },
  'healthcare': {
    description: 'Healthcare facilities capacity contribution',
    triggerThreshold: 10,
    calculationBasis: 'Per residential unit based on NHS formula',
    typicalRate: '£500-1,500 per unit',
    poolingLimit: 5
  },
  'education': {
    description: 'Education provision including early years',
    triggerThreshold: 10,
    calculationBasis: 'Per family-sized unit (3+ beds)',
    typicalRate: '£5,000-15,000 per family unit',
    poolingLimit: 5
  },
  'carbon_offset': {
    description: 'Carbon offset payment for zero carbon shortfall',
    triggerThreshold: 1,
    calculationBasis: 'Per tonne CO2 over 30 year period',
    typicalRate: '£95 per tonne',
    poolingLimit: 0
  },
  'tree_planting': {
    description: 'Urban greening and tree planting contribution',
    triggerThreshold: 1,
    calculationBasis: 'Per tree required to meet UGF',
    typicalRate: '£5,000-8,000 per tree',
    poolingLimit: 5
  },
  'public_realm': {
    description: 'Public realm and streetscape improvements',
    triggerThreshold: 10,
    calculationBasis: 'Site specific based on highways works',
    typicalRate: 'Variable - typically £20,000-100,000',
    poolingLimit: 5
  }
};

// Non-financial obligations
const NON_FINANCIAL_OBLIGATIONS: Record<string, {
  description: string;
  trigger: string;
  typicalRequirements: string[];
}> = {
  'affordable_housing_management': {
    description: 'Nomination rights and allocation arrangements',
    trigger: 'Any scheme with affordable housing',
    typicalRequirements: [
      'Camden Council nomination rights for first lets',
      'Cascade mechanism for subsequent lets',
      'Affordable rent capped at LHA rates',
      'Service charge caps for shared ownership'
    ]
  },
  'travel_plan': {
    description: 'Framework Travel Plan with monitoring',
    trigger: 'Major development (10+ units or 1000sqm+)',
    typicalRequirements: [
      'Appointment of Travel Plan Coordinator',
      'Baseline and annual surveys',
      'Car club membership provision',
      'Cycling facilities and storage',
      'Target mode share reductions'
    ]
  },
  'employment_plan': {
    description: 'Local employment and training commitments',
    trigger: 'Major commercial or 50+ residential units',
    typicalRequirements: [
      'Local labour agreements (25% target)',
      'Apprenticeship provision',
      'Skills training opportunities',
      'Local procurement targets'
    ]
  },
  'public_access': {
    description: 'Public access to private spaces',
    trigger: 'Developments with public realm benefits',
    typicalRequirements: [
      '24-hour public access to routes',
      'Maintenance obligations',
      'Insurance and liability',
      'Management company requirements'
    ]
  },
  'car_free': {
    description: 'Car-free development restrictions',
    trigger: 'Developments in CPZ areas',
    typicalRequirements: [
      'Residents ineligible for parking permits',
      'Clause in leases/tenancies',
      'Blue badge exemptions only',
      'Annual monitoring requirement'
    ]
  },
  'viability_review': {
    description: 'Viability review mechanism',
    trigger: 'Schemes with reduced affordable housing',
    typicalRequirements: [
      'Pre-implementation review if not started within 2 years',
      'Mid-point review for phased schemes',
      'Late stage review before 75% occupation',
      'Overage sharing mechanism'
    ]
  }
};

// Legal costs and timeframes
const LEGAL_FRAMEWORK = {
  camdenLegalFee: 2500, // Base legal fee
  additionalPartyFee: 500, // Per additional party
  monitoringFee: 500, // Per obligation type
  typicalDraftingTime: '4-8 weeks',
  engrossmentTime: '2-4 weeks',
  planningCondition: 'Permission not issued until S106 signed',
  registrationRequirement: 'Must be registered as local land charge',
  modificationProcess: 'Section 106A application or deed of variation'
};

// Pooling restrictions post-CIL
const POOLING_RESTRICTIONS = {
  maxContributions: 5,
  description: 'No more than 5 obligations can fund same infrastructure project',
  exceptions: ['Affordable housing', 'Site-specific mitigation'],
  cil_overlap: 'Cannot use S106 for infrastructure covered by CIL charging schedule'
};

interface DevelopmentDetails {
  numberOfUnits?: number;
  affordableUnits?: number;
  commercialFloorspace?: number;
  familyUnits?: number; // 3+ bedroom units
  projectType?: string;
  inCPZ?: boolean;
  viabilityIssues?: boolean;
  carbonShortfall?: number; // tonnes CO2
  treesRequired?: number;
  publicRealmWorks?: boolean;
}

interface S106AssessmentResult {
  summary: {
    totalEstimatedContributions: number;
    numberOfObligationTypes: number;
    affordableHousingRequirement: string;
    legalCostsEstimate: number;
    timeframeEstimate: string;
  };
  financialObligations: Array<{
    type: string;
    description: string;
    estimatedAmount: number;
    calculationBasis: string;
    negotiable: boolean;
    priority: 'high' | 'medium' | 'low';
  }>;
  nonFinancialObligations: Array<{
    type: string;
    description: string;
    requirements: string[];
    triggered: boolean;
  }>;
  affordableHousingAssessment: {
    policyRequirement: number;
    proposedProvision: number;
    tenureSplit: {
      socialRent: number;
      affordableRent: number;
      intermediate: number;
    };
    commutedSumOption: number;
    onSitePreferred: boolean;
  };
  negotiationGuidance: {
    priorities: string[];
    flexibilityAreas: string[];
    redLineIssues: string[];
    viabilityArguments: string[];
  };
  legalProcess: {
    requiredParties: string[];
    documentationNeeded: string[];
    timelineSteps: Array<{
      step: string;
      duration: string;
    }>;
    costs: {
      councilLegalFees: number;
      monitoringFees: number;
      applicantLegalFees: string;
    };
  };
  complianceRequirements: {
    paymentTriggers: string[];
    monitoringObligations: string[];
    enforcementRisks: string[];
    modificationOptions: string[];
  };
  guidance: string[];
  warnings: string[];
}

export class Section106Service {
  
  /**
   * Assess Section 106 obligations for a development
   */
  assessS106Obligations(
    address: string,
    developmentDetails: DevelopmentDetails
  ): S106AssessmentResult {
    const units = developmentDetails.numberOfUnits || 1;
    const commercial = developmentDetails.commercialFloorspace || 0;
    const familyUnits = developmentDetails.familyUnits || 0;
    
    // Calculate financial obligations
    const financialObligations = this.calculateFinancialObligations(developmentDetails);
    
    // Determine non-financial obligations
    const nonFinancialObligations = this.determineNonFinancialObligations(developmentDetails);
    
    // Calculate affordable housing requirement
    const affordableAssessment = this.assessAffordableHousing(developmentDetails);
    
    // Generate negotiation guidance
    const negotiationGuidance = this.generateNegotiationGuidance(
      developmentDetails,
      financialObligations,
      affordableAssessment
    );
    
    // Calculate legal process details
    const legalProcess = this.calculateLegalProcess(
      financialObligations.length,
      nonFinancialObligations.filter(o => o.triggered).length
    );
    
    // Compliance requirements
    const complianceRequirements = this.generateComplianceRequirements(
      developmentDetails,
      financialObligations
    );
    
    // Calculate totals
    const totalContributions = financialObligations.reduce((sum, o) => sum + o.estimatedAmount, 0);
    
    return {
      summary: {
        totalEstimatedContributions: totalContributions,
        numberOfObligationTypes: financialObligations.length + nonFinancialObligations.filter(o => o.triggered).length,
        affordableHousingRequirement: units >= 10 ? '50% policy target' : 'Not applicable (below threshold)',
        legalCostsEstimate: legalProcess.costs.councilLegalFees + legalProcess.costs.monitoringFees,
        timeframeEstimate: '8-16 weeks typical'
      },
      financialObligations,
      nonFinancialObligations,
      affordableHousingAssessment: affordableAssessment,
      negotiationGuidance,
      legalProcess,
      complianceRequirements,
      guidance: this.generateGuidance(developmentDetails, financialObligations),
      warnings: this.generateWarnings(developmentDetails)
    };
  }
  
  /**
   * Calculate financial obligations
   */
  private calculateFinancialObligations(details: DevelopmentDetails): Array<{
    type: string;
    description: string;
    estimatedAmount: number;
    calculationBasis: string;
    negotiable: boolean;
    priority: 'high' | 'medium' | 'low';
  }> {
    const obligations: Array<{
      type: string;
      description: string;
      estimatedAmount: number;
      calculationBasis: string;
      negotiable: boolean;
      priority: 'high' | 'medium' | 'low';
    }> = [];
    
    const units = details.numberOfUnits || 1;
    const commercial = details.commercialFloorspace || 0;
    const familyUnits = details.familyUnits || 0;
    
    // Transport contribution
    if (units >= 10 || commercial >= 1000) {
      const transportAmount = (units * 3000) + (commercial / 100 * 2000);
      const transportContrib = S106_CONTRIBUTIONS['transport'];
      obligations.push({
        type: 'Transport',
        description: transportContrib?.description || 'Sustainable transport improvements',
        estimatedAmount: transportAmount,
        calculationBasis: `${units} units × £3,000 + ${commercial}sqm × £20/sqm`,
        negotiable: true,
        priority: 'medium'
      });
    }
    
    // Open space contribution
    if (units >= 1) {
      const openSpaceAmount = units * 2000;
      const openSpaceContrib = S106_CONTRIBUTIONS['open_space'];
      obligations.push({
        type: 'Open Space',
        description: openSpaceContrib?.description || 'Public open space improvements',
        estimatedAmount: openSpaceAmount,
        calculationBasis: `${units} units × £2,000`,
        negotiable: true,
        priority: 'medium'
      });
    }
    
    // Employment and training
    if (units >= 50 || commercial >= 1000) {
      const employmentContrib = S106_CONTRIBUTIONS['employment_training'];
      obligations.push({
        type: 'Employment & Training',
        description: employmentContrib?.description || 'Local employment and training initiatives',
        estimatedAmount: 20000,
        calculationBasis: 'Standard contribution for major development',
        negotiable: true,
        priority: 'low'
      });
    }
    
    // Community facilities
    if (units >= 20) {
      const communityAmount = units * 1500;
      const communityContrib = S106_CONTRIBUTIONS['community_facilities'];
      obligations.push({
        type: 'Community Facilities',
        description: communityContrib?.description || 'Community centre and social infrastructure',
        estimatedAmount: communityAmount,
        calculationBasis: `${units} units × £1,500`,
        negotiable: true,
        priority: 'medium'
      });
    }
    
    // Healthcare
    if (units >= 10) {
      const healthcareAmount = units * 1000;
      const healthcareContrib = S106_CONTRIBUTIONS['healthcare'];
      obligations.push({
        type: 'Healthcare',
        description: healthcareContrib?.description || 'Healthcare facilities capacity contribution',
        estimatedAmount: healthcareAmount,
        calculationBasis: `${units} units × £1,000 (NHS HUDU formula)`,
        negotiable: false,
        priority: 'high'
      });
    }
    
    // Education (family units only)
    if (familyUnits >= 5) {
      const educationAmount = familyUnits * 10000;
      const educationContrib = S106_CONTRIBUTIONS['education'];
      obligations.push({
        type: 'Education',
        description: educationContrib?.description || 'Education provision including early years',
        estimatedAmount: educationAmount,
        calculationBasis: `${familyUnits} family units × £10,000`,
        negotiable: true,
        priority: 'high'
      });
    }
    
    // Carbon offset
    if (details.carbonShortfall && details.carbonShortfall > 0) {
      const carbonAmount = details.carbonShortfall * 95;
      const carbonContrib = S106_CONTRIBUTIONS['carbon_offset'];
      obligations.push({
        type: 'Carbon Offset',
        description: carbonContrib?.description || 'Carbon offset payment for zero carbon shortfall',
        estimatedAmount: carbonAmount,
        calculationBasis: `${details.carbonShortfall} tonnes CO2 × £95`,
        negotiable: false,
        priority: 'high'
      });
    }
    
    // Tree planting
    if (details.treesRequired && details.treesRequired > 0) {
      const treeAmount = details.treesRequired * 6000;
      const treeContrib = S106_CONTRIBUTIONS['tree_planting'];
      obligations.push({
        type: 'Tree Planting',
        description: treeContrib?.description || 'Urban greening and tree planting contribution',
        estimatedAmount: treeAmount,
        calculationBasis: `${details.treesRequired} trees × £6,000`,
        negotiable: true,
        priority: 'medium'
      });
    }
    
    // Public realm
    if (details.publicRealmWorks) {
      const publicRealmContrib = S106_CONTRIBUTIONS['public_realm'];
      obligations.push({
        type: 'Public Realm',
        description: publicRealmContrib?.description || 'Public realm and streetscape improvements',
        estimatedAmount: 50000,
        calculationBasis: 'Site-specific assessment required',
        negotiable: true,
        priority: 'medium'
      });
    }
    
    return obligations;
  }
  
  /**
   * Determine non-financial obligations
   */
  private determineNonFinancialObligations(details: DevelopmentDetails): Array<{
    type: string;
    description: string;
    requirements: string[];
    triggered: boolean;
  }> {
    const obligations: Array<{
      type: string;
      description: string;
      requirements: string[];
      triggered: boolean;
    }> = [];
    
    const units = details.numberOfUnits || 1;
    const commercial = details.commercialFloorspace || 0;
    
    // Affordable housing management
    if (details.affordableUnits && details.affordableUnits > 0) {
      const ahm = NON_FINANCIAL_OBLIGATIONS['affordable_housing_management'];
      obligations.push({
        type: 'Affordable Housing Management',
        description: ahm?.description || 'Nomination rights and allocation arrangements',
        requirements: ahm?.typicalRequirements || [],
        triggered: true
      });
    }
    
    // Travel plan
    const travelPlan = NON_FINANCIAL_OBLIGATIONS['travel_plan'];
    obligations.push({
      type: 'Travel Plan',
      description: travelPlan?.description || 'Framework Travel Plan with monitoring',
      requirements: travelPlan?.typicalRequirements || [],
      triggered: units >= 10 || commercial >= 1000
    });
    
    // Employment plan
    const employmentPlan = NON_FINANCIAL_OBLIGATIONS['employment_plan'];
    obligations.push({
      type: 'Employment Plan',
      description: employmentPlan?.description || 'Local employment and training commitments',
      requirements: employmentPlan?.typicalRequirements || [],
      triggered: units >= 50 || commercial >= 1000
    });
    
    // Car-free
    if (details.inCPZ) {
      const carFree = NON_FINANCIAL_OBLIGATIONS['car_free'];
      obligations.push({
        type: 'Car-Free Development',
        description: carFree?.description || 'Car-free development restrictions',
        requirements: carFree?.typicalRequirements || [],
        triggered: true
      });
    }
    
    // Viability review
    if (details.viabilityIssues) {
      const viabilityReview = NON_FINANCIAL_OBLIGATIONS['viability_review'];
      obligations.push({
        type: 'Viability Review Mechanism',
        description: viabilityReview?.description || 'Viability review mechanism',
        requirements: viabilityReview?.typicalRequirements || [],
        triggered: true
      });
    }
    
    return obligations;
  }
  
  /**
   * Assess affordable housing requirement
   */
  private assessAffordableHousing(details: DevelopmentDetails): {
    policyRequirement: number;
    proposedProvision: number;
    tenureSplit: {
      socialRent: number;
      affordableRent: number;
      intermediate: number;
    };
    commutedSumOption: number;
    onSitePreferred: boolean;
  } {
    const units = details.numberOfUnits || 1;
    const affordable = details.affordableUnits || 0;
    
    // Policy requirement (50% for 10+ units)
    const policyRequirement = units >= 10 ? Math.floor(units * 0.5) : 0;
    
    // Tenure split (60% social rent, 40% intermediate)
    const socialRent = Math.floor(affordable * 0.6);
    const intermediate = affordable - socialRent;
    
    // Commuted sum option
    const commutedSumPerUnit = 175000;
    const commutedSumOption = policyRequirement * commutedSumPerUnit;
    
    return {
      policyRequirement,
      proposedProvision: affordable,
      tenureSplit: {
        socialRent,
        affordableRent: 0, // Can be converted from social rent if agreed
        intermediate
      },
      commutedSumOption,
      onSitePreferred: true
    };
  }
  
  /**
   * Generate negotiation guidance
   */
  private generateNegotiationGuidance(
    details: DevelopmentDetails,
    obligations: Array<{ type: string; negotiable: boolean; priority: string }>,
    affordableAssessment: { policyRequirement: number; proposedProvision: number }
  ): {
    priorities: string[];
    flexibilityAreas: string[];
    redLineIssues: string[];
    viabilityArguments: string[];
  } {
    const priorities: string[] = [];
    const flexibilityAreas: string[] = [];
    const redLineIssues: string[] = [];
    const viabilityArguments: string[] = [];
    
    // Council priorities
    priorities.push('Affordable housing delivery is Camden\'s top priority');
    priorities.push('Carbon offset payments are non-negotiable policy requirement');
    priorities.push('Healthcare contributions follow mandatory NHS HUDU formula');
    
    // Flexibility areas
    const negotiableObs = obligations.filter(o => o.negotiable);
    negotiableObs.forEach(o => {
      flexibilityAreas.push(`${o.type}: Some flexibility on quantum and payment timing`);
    });
    flexibilityAreas.push('Payment phasing: Council may accept staged payments');
    flexibilityAreas.push('In-kind delivery: Direct provision may reduce financial contribution');
    
    // Red line issues
    redLineIssues.push('Affordable housing: On-site provision strongly preferred');
    redLineIssues.push('Nomination rights: Council requires first refusal on all affordable units');
    redLineIssues.push('Index-linking: All contributions linked to BCIS/RPI');
    
    // Viability arguments
    if (details.viabilityIssues) {
      viabilityArguments.push('Prepare RICS-compliant viability assessment');
      viabilityArguments.push('Include sensitivity analysis showing scheme becomes unviable');
      viabilityArguments.push('Propose viability review mechanism as compromise');
      viabilityArguments.push('Consider phased delivery to improve cash flow');
    }
    
    if (affordableAssessment.proposedProvision < affordableAssessment.policyRequirement) {
      viabilityArguments.push('Justify affordable housing shortfall with detailed appraisal');
      viabilityArguments.push('Demonstrate benchmark land value assumptions');
      viabilityArguments.push('Show profit level at minimum viable threshold (15-17.5%)');
    }
    
    return {
      priorities,
      flexibilityAreas,
      redLineIssues,
      viabilityArguments
    };
  }
  
  /**
   * Calculate legal process details
   */
  private calculateLegalProcess(
    financialObCount: number,
    nonFinancialObCount: number
  ): {
    requiredParties: string[];
    documentationNeeded: string[];
    timelineSteps: Array<{ step: string; duration: string }>;
    costs: {
      councilLegalFees: number;
      monitoringFees: number;
      applicantLegalFees: string;
    };
  } {
    const totalObligations = financialObCount + nonFinancialObCount;
    
    return {
      requiredParties: [
        'Camden Council (as local planning authority)',
        'Landowner(s)',
        'Developer (if different from landowner)',
        'Any mortgagee or charge holder',
        'Registered Provider (if affordable housing included)'
      ],
      documentationNeeded: [
        'Official copies of title register and plan',
        'Company search (if corporate party)',
        'Proof of authority to sign',
        'Details of any mortgages/charges',
        'Viability assessment (if applicable)',
        'Draft Heads of Terms'
      ],
      timelineSteps: [
        { step: 'Heads of Terms agreed', duration: '2-4 weeks' },
        { step: 'First draft circulated', duration: '2-3 weeks' },
        { step: 'Negotiations and amendments', duration: '2-4 weeks' },
        { step: 'Engrossment and execution', duration: '1-2 weeks' },
        { step: 'Completion and registration', duration: '1-2 weeks' }
      ],
      costs: {
        councilLegalFees: LEGAL_FRAMEWORK.camdenLegalFee + (LEGAL_FRAMEWORK.additionalPartyFee * 2),
        monitoringFees: LEGAL_FRAMEWORK.monitoringFee * totalObligations,
        applicantLegalFees: '£3,000 - £10,000 depending on complexity'
      }
    };
  }
  
  /**
   * Generate compliance requirements
   */
  private generateComplianceRequirements(
    details: DevelopmentDetails,
    obligations: Array<{ type: string; estimatedAmount: number }>
  ): {
    paymentTriggers: string[];
    monitoringObligations: string[];
    enforcementRisks: string[];
    modificationOptions: string[];
  } {
    return {
      paymentTriggers: [
        'Prior to commencement of development',
        'Prior to occupation of first unit',
        'Within 28 days of trigger event',
        'In accordance with phasing schedule (if agreed)'
      ],
      monitoringObligations: [
        'Annual monitoring returns to planning obligations team',
        'Affordable housing occupancy reports',
        'Travel Plan monitoring surveys',
        'Employment Plan progress reports'
      ],
      enforcementRisks: [
        'S106 runs with the land - binds successors',
        'Council can apply for injunction for breach',
        'Late payment interest typically at 4% above base rate',
        'Council can withhold discharge of conditions',
        'Potential referral to court for enforcement'
      ],
      modificationOptions: [
        'Section 106A application (must show changed circumstances)',
        'Deed of variation (by agreement)',
        'Appeal against refusal to modify (5 years after signing)',
        'Release of obligation (Council discretion)'
      ]
    };
  }
  
  /**
   * Generate guidance
   */
  private generateGuidance(
    details: DevelopmentDetails,
    obligations: Array<{ type: string; estimatedAmount: number }>
  ): string[] {
    const guidance: string[] = [];
    
    guidance.push('Engage with Camden Planning Obligations team early in the process');
    guidance.push('S106 negotiations typically run parallel to planning determination');
    guidance.push('Draft Heads of Terms should be agreed before committee/delegation');
    guidance.push('Consider S106 costs in initial viability assessment');
    guidance.push('All contributions are index-linked from date of agreement');
    
    const totalContributions = obligations.reduce((sum, o) => sum + o.estimatedAmount, 0);
    if (totalContributions > 100000) {
      guidance.push('For contributions over £100,000, consider requesting phased payments');
    }
    
    if (details.numberOfUnits && details.numberOfUnits >= 10) {
      guidance.push('Major applications will require comprehensive S106 agreement');
      guidance.push('Allow minimum 12 weeks for S106 negotiation and signing');
    }
    
    guidance.push('CIL is payable in addition to S106 obligations');
    guidance.push('Some obligations may be delivered in-kind rather than financially');
    
    return guidance;
  }
  
  /**
   * Generate warnings
   */
  private generateWarnings(details: DevelopmentDetails): string[] {
    const warnings: string[] = [];
    
    warnings.push('Permission cannot be issued until S106 agreement is signed');
    warnings.push('S106 obligations are legally binding and enforceable');
    warnings.push('Failure to pay contributions can result in enforcement action');
    warnings.push('All parties with interest in land must sign the agreement');
    
    if (details.viabilityIssues) {
      warnings.push('Reduced obligations on viability grounds require robust evidence');
      warnings.push('Council may require viability review mechanism for reduced schemes');
    }
    
    if (details.numberOfUnits && details.numberOfUnits >= 10) {
      warnings.push('Affordable housing contribution will be major negotiation item');
      warnings.push('Off-site provision or commuted sums strongly discouraged');
    }
    
    return warnings;
  }
  
  /**
   * Get contribution types
   */
  getContributionTypes(): Record<string, {
    description: string;
    triggerThreshold: number;
    calculationBasis: string;
    typicalRate: string;
  }> {
    const result: Record<string, {
      description: string;
      triggerThreshold: number;
      calculationBasis: string;
      typicalRate: string;
    }> = {};
    
    for (const [key, value] of Object.entries(S106_CONTRIBUTIONS)) {
      result[key] = {
        description: value.description,
        triggerThreshold: value.triggerThreshold,
        calculationBasis: value.calculationBasis,
        typicalRate: value.typicalRate
      };
    }
    
    return result;
  }
  
  /**
   * Get pooling restrictions
   */
  getPoolingRestrictions(): {
    maxContributions: number;
    description: string;
    exceptions: string[];
  } {
    return {
      maxContributions: POOLING_RESTRICTIONS.maxContributions,
      description: POOLING_RESTRICTIONS.description,
      exceptions: POOLING_RESTRICTIONS.exceptions
    };
  }
}

export default Section106Service;
