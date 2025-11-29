/**
 * Prior Approval Guidance Service
 * 
 * Comprehensive guidance on prior approval applications in Camden & Hampstead
 * Covers larger home extensions, change of use, and agricultural conversions
 */

// Prior Approval Types
const PRIOR_APPROVAL_TYPES: Record<string, {
  name: string;
  class: string;
  description: string;
  fee: number;
  determinationPeriod: number; // working days
  mattersAssessed: string[];
  requiredInfo: string[];
  restrictions: string[];
}> = {
  'larger_home_extension': {
    name: 'Larger Home Extension',
    class: 'Part 1 Class A (Paragraph A.4)',
    description: 'Single storey rear extensions exceeding standard PD limits',
    fee: 120,
    determinationPeriod: 42,
    mattersAssessed: [
      'Impact on amenity of adjoining premises'
    ],
    requiredInfo: [
      'Site plan showing extension footprint',
      'Proposed floor plans and elevations',
      'Height of extension',
      'Depth of extension',
      'Distance to boundaries',
      'Addresses of adjoining properties'
    ],
    restrictions: [
      'Single storey only',
      'Maximum 8m depth (detached) or 6m (attached)',
      'Maximum eaves height 3m',
      'Maximum overall height 4m',
      'Not within 2m of boundary if over 3m high'
    ]
  },
  'class_ma_commercial_residential': {
    name: 'Commercial to Residential',
    class: 'Part 3 Class MA',
    description: 'Change of use from Class E to residential (C3)',
    fee: 120,
    determinationPeriod: 56,
    mattersAssessed: [
      'Transport and highways',
      'Contamination and flooding risks',
      'Noise from commercial premises',
      'Adequate natural light',
      'Fire safety',
      'Impacts on intended occupiers'
    ],
    requiredInfo: [
      'Floor plans (existing and proposed)',
      'Details of existing commercial use',
      'Evidence of Class E use for 2+ years',
      'Proposed number and size of units',
      'Natural light assessment',
      'Noise assessment if near commercial uses'
    ],
    restrictions: [
      'Maximum 1,500 sqm floorspace',
      'Must have been Class E for 2+ years',
      'Nationally Described Space Standards apply',
      'Fire safety statement required for 7+ units'
    ]
  },
  'class_o_office_residential': {
    name: 'Office to Residential (Legacy)',
    class: 'Part 3 Class O',
    description: 'Change of use from B1(a) office to residential',
    fee: 120,
    determinationPeriod: 56,
    mattersAssessed: [
      'Transport and highways',
      'Contamination risks',
      'Flooding risks'
    ],
    requiredInfo: [
      'Floor plans (existing and proposed)',
      'Evidence of office use',
      'Number and mix of proposed units'
    ],
    restrictions: [
      'Being phased out in favour of Class MA',
      'Check if Article 4 applies',
      'Nationally Described Space Standards apply'
    ]
  },
  'class_q_agricultural_residential': {
    name: 'Agricultural to Residential',
    class: 'Part 3 Class Q',
    description: 'Conversion of agricultural building to residential',
    fee: 120,
    determinationPeriod: 56,
    mattersAssessed: [
      'Transport and highways',
      'Noise impacts',
      'Contamination risks',
      'Flooding risks',
      'Location and siting',
      'Design and external appearance'
    ],
    requiredInfo: [
      'Site and location plans',
      'Existing and proposed floor plans',
      'Structural survey',
      'Evidence of agricultural use',
      'Details of proposed dwellings'
    ],
    restrictions: [
      'Maximum 5 dwellings',
      'Maximum 865 sqm combined floorspace',
      'Building must be capable of conversion',
      'Must have been agricultural building on 20 March 2013',
      'Building must be on agricultural holding'
    ]
  },
  'class_r_agricultural_commercial': {
    name: 'Agricultural to Commercial',
    class: 'Part 3 Class R',
    description: 'Conversion of agricultural building to commercial use',
    fee: 120,
    determinationPeriod: 56,
    mattersAssessed: [
      'Transport and highways',
      'Noise impacts',
      'Working hours',
      'Contamination risks',
      'Flooding risks'
    ],
    requiredInfo: [
      'Site and location plans',
      'Floor plans',
      'Details of proposed use',
      'Proposed operating hours'
    ],
    restrictions: [
      'Maximum 500 sqm',
      'Flexible commercial uses only',
      'Building must be capable of conversion'
    ]
  },
  'demolition_buildings': {
    name: 'Demolition Prior Notification',
    class: 'Part 11 Class B',
    description: 'Prior notification for demolition of buildings',
    fee: 120,
    determinationPeriod: 28,
    mattersAssessed: [
      'Method of demolition',
      'Site restoration proposals'
    ],
    requiredInfo: [
      'Site plan',
      'Description of building',
      'Method of proposed demolition',
      'Site restoration details'
    ],
    restrictions: [
      'Not applicable to listed buildings',
      'Conservation area demolition needs consent',
      'Buildings under 50 cubic metres may not need notification'
    ]
  },
  'telecom_installation': {
    name: 'Telecommunications Installation',
    class: 'Part 16',
    description: 'Prior approval for telecommunications equipment',
    fee: 578,
    determinationPeriod: 56,
    mattersAssessed: [
      'Siting and appearance'
    ],
    requiredInfo: [
      'Site plan',
      'Proposed elevations',
      'ICNIRP declaration',
      'Technical justification'
    ],
    restrictions: [
      'Height limits apply',
      'Exclusions in conservation areas',
      'Listed building restrictions'
    ]
  },
  'solar_panels_non_domestic': {
    name: 'Solar Panels (Non-Domestic)',
    class: 'Part 14 Class J',
    description: 'Prior approval for solar panels on non-domestic buildings',
    fee: 120,
    determinationPeriod: 56,
    mattersAssessed: [
      'Siting and appearance',
      'Impact on amenity'
    ],
    requiredInfo: [
      'Site plan',
      'Roof plans',
      'Panel specifications',
      'Visual impact assessment'
    ],
    restrictions: [
      'Height limits apply',
      'Conservation area restrictions',
      'Listed building restrictions'
    ]
  }
};

// Common refusal reasons
const COMMON_REFUSAL_REASONS = {
  'larger_home_extension': [
    'Unacceptable impact on amenity of adjoining premises',
    'Loss of light to neighbouring properties',
    'Overbearing impact',
    'Loss of outlook'
  ],
  'class_ma_commercial_residential': [
    'Inadequate natural light to proposed units',
    'Unacceptable noise environment',
    'Highway safety concerns',
    'Flood risk concerns',
    'Fire safety issues',
    'Units below space standards'
  ],
  'class_q_agricultural_residential': [
    'Building not capable of conversion without substantial rebuilding',
    'Building not agricultural',
    'Highway concerns',
    'Flood risk',
    'Location unsuitable for residential use'
  ]
};

// Process stages
const PRIOR_APPROVAL_PROCESS = [
  {
    stage: 1,
    name: 'Pre-submission',
    description: 'Prepare application and gather information',
    actions: [
      'Check if prior approval route applies',
      'Gather required documentation',
      'Complete application form',
      'Calculate and prepare fee'
    ],
    duration: '1-2 weeks'
  },
  {
    stage: 2,
    name: 'Submission',
    description: 'Submit application to local authority',
    actions: [
      'Submit online or by post',
      'Receive acknowledgement',
      'Validation check by council'
    ],
    duration: '1-5 days'
  },
  {
    stage: 3,
    name: 'Consultation',
    description: 'Council consults neighbours (for some types)',
    actions: [
      'Neighbour notification sent',
      'Site notice posted (if applicable)',
      '21 day consultation period'
    ],
    duration: '21 days'
  },
  {
    stage: 4,
    name: 'Assessment',
    description: 'Council assesses against relevant matters',
    actions: [
      'Officer site visit (if needed)',
      'Assessment against specified matters only',
      'Consider any representations'
    ],
    duration: 'Within determination period'
  },
  {
    stage: 5,
    name: 'Decision',
    description: 'Council issues decision',
    actions: [
      'Prior approval granted',
      'Prior approval refused',
      'Prior approval not required (deemed consent)',
      'If no response within period - deemed approved'
    ],
    duration: 'End of determination period'
  }
];

// Comparison with full planning
const COMPARISON_WITH_PLANNING = {
  advantages: [
    'Faster determination period',
    'Lower application fee',
    'Limited matters for assessment',
    'Cannot be refused on policy grounds',
    'Deemed approval if council does not respond',
    'No need for full planning case'
  ],
  disadvantages: [
    'Limited scope - must fit within criteria',
    'No negotiation on matters outside scope',
    'Can still be refused on specified matters',
    'May not suit complex proposals',
    'Some councils have Article 4 directions removing rights'
  ],
  whenToUseFullPlanning: [
    'Proposal exceeds prior approval thresholds',
    'Proposal in Article 4 area',
    'Want to negotiate on design matters',
    'Proposal involves other planning issues',
    'Need greater certainty on approval'
  ]
};

interface PriorApprovalRequest {
  address: string;
  proposalType: string;
  priorApprovalType?: string;
  proposalDetails: {
    floorspace?: number;
    extensionDepth?: number;
    extensionHeight?: number;
    numberOfUnits?: number;
    currentUse?: string;
    proposedUse?: string;
    buildingType?: string;
  };
  isListedBuilding?: boolean;
  isConservationArea?: boolean;
  isArticle4?: boolean;
}

interface PriorApprovalAssessment {
  address: string;
  eligibility: {
    eligible: boolean;
    reason: string;
    alternativeRoutes: string[];
  };
  priorApprovalType: {
    type: string;
    name: string;
    class: string;
    description: string;
  } | null;
  applicationRequirements: {
    fee: number;
    determinationPeriod: number;
    requiredDocuments: string[];
    mattersAssessed: string[];
  };
  restrictions: string[];
  processSteps: Array<{
    stage: number;
    name: string;
    description: string;
    duration: string;
  }>;
  commonIssues: string[];
  comparisonWithPlanning: {
    advantages: string[];
    disadvantages: string[];
    recommendation: string;
  };
  recommendations: string[];
  warnings: string[];
  confidenceLevel: string;
}

class PriorApprovalService {
  /**
   * Generate prior approval guidance
   */
  public generatePriorApprovalGuidance(request: PriorApprovalRequest): PriorApprovalAssessment {
    // Check eligibility
    const eligibility = this.assessEligibility(request);
    
    // Identify appropriate prior approval type
    const priorApprovalType = this.identifyPriorApprovalType(request);
    
    // Get application requirements
    const applicationRequirements = this.getApplicationRequirements(priorApprovalType);
    
    // Get restrictions
    const restrictions = this.getRestrictions(request, priorApprovalType);
    
    // Get common issues
    const commonIssues = this.getCommonIssues(priorApprovalType);
    
    // Generate comparison with full planning
    const comparisonWithPlanning = this.generateComparison(request, eligibility);
    
    return {
      address: request.address,
      eligibility,
      priorApprovalType: priorApprovalType ? {
        type: priorApprovalType.type,
        name: priorApprovalType.name,
        class: priorApprovalType.class,
        description: priorApprovalType.description
      } : null,
      applicationRequirements,
      restrictions,
      processSteps: PRIOR_APPROVAL_PROCESS,
      commonIssues,
      comparisonWithPlanning,
      recommendations: this.generateRecommendations(request, eligibility, priorApprovalType),
      warnings: this.generateWarnings(request, eligibility),
      confidenceLevel: this.assessConfidence(request)
    };
  }

  /**
   * Assess eligibility for prior approval route
   */
  private assessEligibility(request: PriorApprovalRequest): {
    eligible: boolean;
    reason: string;
    alternativeRoutes: string[];
  } {
    // Listed buildings excluded
    if (request.isListedBuilding) {
      return {
        eligible: false,
        reason: 'Listed buildings are excluded from most prior approval routes',
        alternativeRoutes: ['Full planning application', 'Listed building consent']
      };
    }
    
    // Article 4 may remove rights
    if (request.isArticle4) {
      return {
        eligible: false,
        reason: 'Article 4 Direction may remove prior approval rights in this area',
        alternativeRoutes: ['Full planning application', 'Check specific Article 4 restrictions']
      };
    }
    
    // Check proposal specific eligibility
    const proposalLower = request.proposalType.toLowerCase();
    
    // Larger home extension
    if (proposalLower.includes('extension')) {
      const depth = request.proposalDetails.extensionDepth || 0;
      const maxDepth = 8; // For detached
      
      if (depth <= 4) {
        return {
          eligible: false,
          reason: 'Extensions up to 4m do not require prior approval',
          alternativeRoutes: ['Proceed under standard permitted development']
        };
      }
      
      if (depth > maxDepth) {
        return {
          eligible: false,
          reason: `Extension depth exceeds maximum ${maxDepth}m for prior approval`,
          alternativeRoutes: ['Full planning application required']
        };
      }
      
      return {
        eligible: true,
        reason: 'Extension between 4-8m may qualify for larger home extension prior approval',
        alternativeRoutes: ['Full planning application (alternative)']
      };
    }
    
    // Commercial to residential
    if (proposalLower.includes('change of use') || proposalLower.includes('convert')) {
      const floorspace = request.proposalDetails.floorspace || 0;
      
      if (floorspace > 1500) {
        return {
          eligible: false,
          reason: 'Floorspace exceeds 1,500 sqm maximum for Class MA',
          alternativeRoutes: ['Full planning application required']
        };
      }
      
      return {
        eligible: true,
        reason: 'May qualify for Class MA prior approval',
        alternativeRoutes: ['Full planning application (alternative)']
      };
    }
    
    // Default
    return {
      eligible: true,
      reason: 'Proposal may qualify for prior approval - further assessment needed',
      alternativeRoutes: ['Full planning application']
    };
  }

  /**
   * Identify appropriate prior approval type
   */
  private identifyPriorApprovalType(request: PriorApprovalRequest): {
    type: string;
    name: string;
    class: string;
    description: string;
    fee: number;
    determinationPeriod: number;
    mattersAssessed: string[];
    requiredInfo: string[];
    restrictions: string[];
  } | null {
    // Use specified type if provided
    if (request.priorApprovalType) {
      const paType = PRIOR_APPROVAL_TYPES[request.priorApprovalType];
      if (paType) {
        return {
          type: request.priorApprovalType,
          name: paType.name,
          class: paType.class,
          description: paType.description,
          fee: paType.fee,
          determinationPeriod: paType.determinationPeriod,
          mattersAssessed: paType.mattersAssessed,
          requiredInfo: paType.requiredInfo,
          restrictions: paType.restrictions
        };
      }
    }
    
    // Identify from proposal
    const proposalLower = request.proposalType.toLowerCase();
    
    if (proposalLower.includes('extension') && !proposalLower.includes('two storey')) {
      const largerExt = PRIOR_APPROVAL_TYPES['larger_home_extension'];
      if (largerExt) {
        return {
          type: 'larger_home_extension',
          name: largerExt.name,
          class: largerExt.class,
          description: largerExt.description,
          fee: largerExt.fee,
          determinationPeriod: largerExt.determinationPeriod,
          mattersAssessed: largerExt.mattersAssessed,
          requiredInfo: largerExt.requiredInfo,
          restrictions: largerExt.restrictions
        };
      }
    }
    
    if ((proposalLower.includes('office') || proposalLower.includes('commercial')) &&
        proposalLower.includes('residential')) {
      const classMA = PRIOR_APPROVAL_TYPES['class_ma_commercial_residential'];
      if (classMA) {
        return {
          type: 'class_ma_commercial_residential',
          name: classMA.name,
          class: classMA.class,
          description: classMA.description,
          fee: classMA.fee,
          determinationPeriod: classMA.determinationPeriod,
          mattersAssessed: classMA.mattersAssessed,
          requiredInfo: classMA.requiredInfo,
          restrictions: classMA.restrictions
        };
      }
    }
    
    if (proposalLower.includes('agricultural') && proposalLower.includes('residential')) {
      const classQ = PRIOR_APPROVAL_TYPES['class_q_agricultural_residential'];
      if (classQ) {
        return {
          type: 'class_q_agricultural_residential',
          name: classQ.name,
          class: classQ.class,
          description: classQ.description,
          fee: classQ.fee,
          determinationPeriod: classQ.determinationPeriod,
          mattersAssessed: classQ.mattersAssessed,
          requiredInfo: classQ.requiredInfo,
          restrictions: classQ.restrictions
        };
      }
    }
    
    if (proposalLower.includes('agricultural') && proposalLower.includes('commercial')) {
      const classR = PRIOR_APPROVAL_TYPES['class_r_agricultural_commercial'];
      if (classR) {
        return {
          type: 'class_r_agricultural_commercial',
          name: classR.name,
          class: classR.class,
          description: classR.description,
          fee: classR.fee,
          determinationPeriod: classR.determinationPeriod,
          mattersAssessed: classR.mattersAssessed,
          requiredInfo: classR.requiredInfo,
          restrictions: classR.restrictions
        };
      }
    }
    
    if (proposalLower.includes('demolition')) {
      const demolition = PRIOR_APPROVAL_TYPES['demolition_buildings'];
      if (demolition) {
        return {
          type: 'demolition_buildings',
          name: demolition.name,
          class: demolition.class,
          description: demolition.description,
          fee: demolition.fee,
          determinationPeriod: demolition.determinationPeriod,
          mattersAssessed: demolition.mattersAssessed,
          requiredInfo: demolition.requiredInfo,
          restrictions: demolition.restrictions
        };
      }
    }
    
    if (proposalLower.includes('telecom') || proposalLower.includes('mast')) {
      const telecom = PRIOR_APPROVAL_TYPES['telecom_installation'];
      if (telecom) {
        return {
          type: 'telecom_installation',
          name: telecom.name,
          class: telecom.class,
          description: telecom.description,
          fee: telecom.fee,
          determinationPeriod: telecom.determinationPeriod,
          mattersAssessed: telecom.mattersAssessed,
          requiredInfo: telecom.requiredInfo,
          restrictions: telecom.restrictions
        };
      }
    }
    
    if (proposalLower.includes('solar') && proposalLower.includes('commercial')) {
      const solar = PRIOR_APPROVAL_TYPES['solar_panels_non_domestic'];
      if (solar) {
        return {
          type: 'solar_panels_non_domestic',
          name: solar.name,
          class: solar.class,
          description: solar.description,
          fee: solar.fee,
          determinationPeriod: solar.determinationPeriod,
          mattersAssessed: solar.mattersAssessed,
          requiredInfo: solar.requiredInfo,
          restrictions: solar.restrictions
        };
      }
    }
    
    return null;
  }

  /**
   * Get application requirements
   */
  private getApplicationRequirements(priorApprovalType: {
    fee: number;
    determinationPeriod: number;
    mattersAssessed: string[];
    requiredInfo: string[];
  } | null): {
    fee: number;
    determinationPeriod: number;
    requiredDocuments: string[];
    mattersAssessed: string[];
  } {
    if (!priorApprovalType) {
      return {
        fee: 120,
        determinationPeriod: 56,
        requiredDocuments: [
          'Application form',
          'Site location plan',
          'Proposed floor plans and elevations',
          'Supporting statement'
        ],
        mattersAssessed: ['To be determined based on specific prior approval type']
      };
    }
    
    return {
      fee: priorApprovalType.fee,
      determinationPeriod: priorApprovalType.determinationPeriod,
      requiredDocuments: priorApprovalType.requiredInfo,
      mattersAssessed: priorApprovalType.mattersAssessed
    };
  }

  /**
   * Get restrictions
   */
  private getRestrictions(
    request: PriorApprovalRequest,
    priorApprovalType: { restrictions: string[] } | null
  ): string[] {
    const restrictions: string[] = [];
    
    if (priorApprovalType) {
      restrictions.push(...priorApprovalType.restrictions);
    }
    
    if (request.isConservationArea) {
      restrictions.push('Conservation area - additional scrutiny may apply');
      restrictions.push('Some prior approval routes restricted in conservation areas');
    }
    
    return restrictions;
  }

  /**
   * Get common issues/refusal reasons
   */
  private getCommonIssues(priorApprovalType: { type: string } | null): string[] {
    if (!priorApprovalType) {
      return ['Ensure proposal meets all criteria for the prior approval route'];
    }
    
    const typeKey = priorApprovalType.type as keyof typeof COMMON_REFUSAL_REASONS;
    const reasons = COMMON_REFUSAL_REASONS[typeKey];
    
    return reasons || ['Assess all specified matters carefully'];
  }

  /**
   * Generate comparison with full planning
   */
  private generateComparison(
    request: PriorApprovalRequest,
    eligibility: { eligible: boolean }
  ): {
    advantages: string[];
    disadvantages: string[];
    recommendation: string;
  } {
    let recommendation = 'Prior approval route recommended if eligible';
    
    if (!eligibility.eligible) {
      recommendation = 'Full planning application required';
    } else if (request.isConservationArea) {
      recommendation = 'Consider full planning for greater certainty in conservation area';
    }
    
    return {
      advantages: COMPARISON_WITH_PLANNING.advantages,
      disadvantages: COMPARISON_WITH_PLANNING.disadvantages,
      recommendation
    };
  }

  /**
   * Generate recommendations
   */
  private generateRecommendations(
    request: PriorApprovalRequest,
    eligibility: { eligible: boolean },
    priorApprovalType: { type: string } | null
  ): string[] {
    const recommendations: string[] = [];
    
    if (eligibility.eligible) {
      recommendations.push('Prior approval route is available for this proposal');
      recommendations.push('Ensure all required documents are submitted');
      recommendations.push('Address all specified matters in supporting information');
    } else {
      recommendations.push('Full planning application required');
      recommendations.push('Consider pre-application advice');
    }
    
    // Type specific
    if (priorApprovalType?.type === 'larger_home_extension') {
      recommendations.push('Provide clear dimensions and neighbour addresses');
      recommendations.push('Consider impact on neighbours carefully');
    }
    
    if (priorApprovalType?.type === 'class_ma_commercial_residential') {
      recommendations.push('Prepare natural light assessment');
      recommendations.push('Ensure units meet space standards');
      recommendations.push('Evidence 2 years of Class E use');
    }
    
    if (priorApprovalType?.type === 'class_q_agricultural_residential') {
      recommendations.push('Obtain structural survey showing building can convert');
      recommendations.push('Evidence agricultural use on qualifying date');
    }
    
    return recommendations;
  }

  /**
   * Generate warnings
   */
  private generateWarnings(
    request: PriorApprovalRequest,
    eligibility: { eligible: boolean }
  ): string[] {
    const warnings: string[] = [];
    
    if (request.isListedBuilding) {
      warnings.push('Listed building - prior approval not available');
    }
    
    if (request.isArticle4) {
      warnings.push('Article 4 Direction may remove prior approval rights');
    }
    
    if (!eligibility.eligible) {
      warnings.push('Do not proceed with prior approval application if not eligible');
    }
    
    warnings.push('Deemed approval only applies if valid application submitted');
    warnings.push('Council may refuse if specified matters not addressed');
    
    return warnings;
  }

  /**
   * Assess confidence level
   */
  private assessConfidence(request: PriorApprovalRequest): string {
    if (request.isListedBuilding || request.isArticle4) {
      return 'HIGH'; // Clear that PA doesn't apply
    }
    
    if (!request.proposalDetails.floorspace && !request.proposalDetails.extensionDepth) {
      return 'LOW'; // Insufficient detail
    }
    
    return 'MEDIUM';
  }

  /**
   * Get all prior approval types
   */
  public getPriorApprovalTypes(): Array<{
    type: string;
    name: string;
    class: string;
    fee: number;
    determinationPeriod: number;
  }> {
    return Object.entries(PRIOR_APPROVAL_TYPES).map(([type, info]) => ({
      type,
      name: info.name,
      class: info.class,
      fee: info.fee,
      determinationPeriod: info.determinationPeriod
    }));
  }

  /**
   * Get process overview
   */
  public getProcessOverview(): typeof PRIOR_APPROVAL_PROCESS {
    return PRIOR_APPROVAL_PROCESS;
  }

  /**
   * Get comparison with planning
   */
  public getComparisonWithPlanning(): typeof COMPARISON_WITH_PLANNING {
    return COMPARISON_WITH_PLANNING;
  }

  /**
   * Get specific prior approval type info
   */
  public getPriorApprovalTypeInfo(typeKey: string): typeof PRIOR_APPROVAL_TYPES[keyof typeof PRIOR_APPROVAL_TYPES] | null {
    return PRIOR_APPROVAL_TYPES[typeKey] || null;
  }
}

export default PriorApprovalService;
