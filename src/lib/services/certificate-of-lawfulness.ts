/**
 * Certificate of Lawfulness Service
 * 
 * Guidance on CLEUD (Certificate of Lawfulness for Existing Use or Development)
 * and CLOPUD (Certificate of Lawfulness for Proposed Use or Development)
 */

// Certificate Types
const CERTIFICATE_TYPES: Record<string, {
  name: string;
  abbreviation: string;
  description: string;
  purpose: string;
  fee: number;
  determinationTarget: string;
  evidenceRequired: string[];
  commonUses: string[];
}> = {
  'cleud': {
    name: 'Certificate of Lawful Existing Use or Development',
    abbreviation: 'CLEUD',
    description: 'Confirms that existing use or development is lawful',
    purpose: 'Provides legal certainty that development/use is immune from enforcement action',
    fee: 290, // Half full application fee for householder
    determinationTarget: '8 weeks',
    evidenceRequired: [
      'Statutory declaration(s)',
      'Documentary evidence (bills, correspondence, photographs)',
      'Sworn affidavits',
      'Council tax records',
      'Utility bills showing address',
      'Insurance documents',
      'Building control records',
      'Historical photographs with dates'
    ],
    commonUses: [
      'Development over 4 years old (operational)',
      'Use over 10 years continuous',
      'Breach of condition over 10 years',
      'HMO use established over 10 years',
      'Business from home over 10 years',
      'Outbuilding/extension built over 4 years ago'
    ]
  },
  'clopud': {
    name: 'Certificate of Lawful Proposed Use or Development',
    abbreviation: 'CLOPUD',
    description: 'Confirms that proposed use or development is lawful',
    purpose: 'Provides legal certainty before starting development or changing use',
    fee: 290, // Half full application fee for householder
    determinationTarget: '8 weeks',
    evidenceRequired: [
      'Detailed drawings showing proposal',
      'Assessment against permitted development criteria',
      'Site photographs',
      'Evidence property is not excluded from PD',
      'Evidence of original house dimensions',
      'Planning history review'
    ],
    commonUses: [
      'Confirm extension is permitted development',
      'Confirm outbuilding is permitted development',
      'Confirm loft conversion is permitted development',
      'Confirm change of use is permitted',
      'Provide certainty for property sale',
      'Confirm prior approval development is lawful'
    ]
  }
};

// Time Limits for CLEUD
const TIME_LIMITS = {
  operationalDevelopment: {
    period: '4 years',
    description: 'From substantial completion of building works',
    examples: [
      'Extensions',
      'New buildings',
      'Outbuildings',
      'Roof alterations',
      'Engineering operations'
    ],
    keyDate: 'Date of substantial completion (not full completion)'
  },
  changeOfUse: {
    period: '10 years',
    description: 'Continuous use without enforcement action',
    examples: [
      'Residential to commercial',
      'Single dwelling to HMO',
      'Agricultural to residential',
      'Business from home'
    ],
    keyDate: 'Start date of use'
  },
  breachOfCondition: {
    period: '10 years',
    description: 'Continuous breach without enforcement action',
    examples: [
      'Opening hours condition',
      'Use restriction condition',
      'Parking requirement',
      'Landscaping requirement'
    ],
    keyDate: 'Date breach commenced'
  },
  listedBuilding: {
    period: 'No time limit',
    description: 'Listed building enforcement has no time limit',
    examples: [
      'Unauthorized alterations to listed building'
    ],
    keyDate: 'N/A - no immunity'
  }
};

// Evidence Quality Guidance
const EVIDENCE_GUIDANCE = {
  'sworn_declarations': {
    name: 'Statutory Declarations',
    description: 'Sworn statements from persons with knowledge',
    weight: 'Strong',
    requirements: [
      'Must be sworn before solicitor or commissioner of oaths',
      'Must cover the full relevant period',
      'Must be specific about dates and facts',
      'Multiple declarations strengthen case'
    ],
    tips: [
      'Include declaration from property owner',
      'Obtain declarations from neighbours',
      'Include declarations from visitors/contractors',
      'Be specific about what was observed and when'
    ]
  },
  'documentary_evidence': {
    name: 'Documentary Evidence',
    description: 'Documents proving use or development at specific dates',
    weight: 'Strong',
    requirements: [
      'Documents must be dated',
      'Must relate to the specific property/use',
      'Original documents preferred',
      'Must cover the time period in question'
    ],
    tips: [
      'Utility bills at address',
      'Council tax records',
      'Insurance policies',
      'Business rates records',
      'Contracts and correspondence'
    ]
  },
  'photographs': {
    name: 'Photographic Evidence',
    description: 'Dated photographs showing development/use',
    weight: 'Medium-Strong',
    requirements: [
      'Must have clear date evidence',
      'Digital metadata helpful',
      'Must clearly show the development/use',
      'Context photographs useful'
    ],
    tips: [
      'Google Street View historical images',
      'Aerial photography archives',
      'Personal photos with date stamps',
      'Estate agent photographs if property sold'
    ]
  },
  'council_records': {
    name: 'Council Records',
    description: 'Records held by local authority',
    weight: 'Strong',
    requirements: [
      'Building control records',
      'Council tax records',
      'Electoral roll entries',
      'Planning history'
    ],
    tips: [
      'Request planning history',
      'Request building control records',
      'Check if council has aerial photo archive',
      'Request enforcement file if exists'
    ]
  }
};

// Common Refusal Reasons
const REFUSAL_REASONS = [
  {
    reason: 'Insufficient evidence of time period',
    mitigation: 'Provide more sworn declarations and documentary evidence'
  },
  {
    reason: 'Evidence does not cover continuous period',
    mitigation: 'Obtain evidence for gaps in timeline'
  },
  {
    reason: 'Development not substantially complete',
    mitigation: 'Evidence showing state of completion at 4-year point'
  },
  {
    reason: 'Use not continuous',
    mitigation: 'Evidence of continuous use without interruption'
  },
  {
    reason: 'Previous enforcement action',
    mitigation: 'Check if enforcement notice was served - may reset clock'
  },
  {
    reason: 'Building is listed',
    mitigation: 'No time limit immunity for listed buildings'
  },
  {
    reason: 'Deliberately concealed breach',
    mitigation: 'Concealed breaches have extended time limits'
  }
];

interface CLEUDRequest {
  address: string;
  certificateType: 'cleud' | 'clopud';
  developmentType: 'operational' | 'change_of_use' | 'breach_of_condition';
  description: string;
  startDate?: string;
  completionDate?: string;
  isListedBuilding?: boolean;
  isConservationArea?: boolean;
  hasEnforcementHistory?: boolean;
  evidenceAvailable?: string[];
  proposedPDClass?: string; // For CLOPUD
}

interface CLEUDAssessment {
  address: string;
  certificateType: {
    type: string;
    name: string;
    abbreviation: string;
    description: string;
    fee: number;
  };
  eligibility: {
    eligible: boolean;
    reason: string;
    timeLimitInfo: {
      period: string;
      description: string;
      keyDate: string;
      metAsOf?: string;
    };
  };
  evidenceRequirements: {
    essential: string[];
    recommended: string[];
    evidenceTypes: Array<{
      type: string;
      description: string;
      weight: string;
      tips: string[];
    }>;
  };
  risks: string[];
  commonRefusalReasons: Array<{
    reason: string;
    mitigation: string;
  }>;
  applicationProcess: Array<{
    step: number;
    action: string;
    details: string;
  }>;
  recommendations: string[];
  warnings: string[];
  confidenceLevel: string;
}

class CertificateOfLawfulnessService {
  /**
   * Generate certificate of lawfulness guidance
   */
  public generateCLEUDGuidance(request: CLEUDRequest): CLEUDAssessment {
    const certificateInfo = CERTIFICATE_TYPES[request.certificateType];
    const defaultCert = {
      name: 'Certificate of Lawfulness',
      abbreviation: 'CL',
      description: 'Certificate confirming lawfulness',
      purpose: 'Legal certainty',
      fee: 290,
      determinationTarget: '8 weeks',
      evidenceRequired: ['Supporting evidence'],
      commonUses: ['Various']
    };
    const certType = certificateInfo || defaultCert;
    
    const eligibility = this.assessEligibility(request);
    const evidenceRequirements = this.getEvidenceRequirements(request);
    const risks = this.assessRisks(request);
    const applicationProcess = this.getApplicationProcess(request.certificateType);
    
    return {
      address: request.address,
      certificateType: {
        type: request.certificateType,
        name: certType.name,
        abbreviation: certType.abbreviation,
        description: certType.description,
        fee: certType.fee
      },
      eligibility,
      evidenceRequirements,
      risks,
      commonRefusalReasons: REFUSAL_REASONS,
      applicationProcess,
      recommendations: this.generateRecommendations(request, eligibility),
      warnings: this.generateWarnings(request, eligibility),
      confidenceLevel: this.assessConfidence(request, eligibility)
    };
  }

  /**
   * Assess eligibility for certificate
   */
  private assessEligibility(request: CLEUDRequest): {
    eligible: boolean;
    reason: string;
    timeLimitInfo: {
      period: string;
      description: string;
      keyDate: string;
      metAsOf?: string;
    };
  } {
    // Listed buildings have no immunity for CLEUD
    if (request.certificateType === 'cleud' && request.isListedBuilding) {
      return {
        eligible: false,
        reason: 'Listed buildings have no time limit immunity for unauthorized works',
        timeLimitInfo: {
          period: 'No time limit',
          description: 'Listed building enforcement has no time limit',
          keyDate: 'N/A'
        }
      };
    }
    
    // Get time limit info
    let timeLimitData = TIME_LIMITS.changeOfUse;
    if (request.developmentType === 'operational') {
      timeLimitData = TIME_LIMITS.operationalDevelopment;
    } else if (request.developmentType === 'breach_of_condition') {
      timeLimitData = TIME_LIMITS.breachOfCondition;
    }
    
    // Calculate if time period met
    let metAsOf: string | undefined;
    if (request.startDate) {
      const startDate = new Date(request.startDate);
      const years = request.developmentType === 'operational' ? 4 : 10;
      const immuneDate = new Date(startDate);
      immuneDate.setFullYear(immuneDate.getFullYear() + years);
      
      if (immuneDate <= new Date()) {
        metAsOf = immuneDate.toISOString().split('T')[0];
      }
    }
    
    // For CLOPUD
    if (request.certificateType === 'clopud') {
      return {
        eligible: true,
        reason: 'CLOPUD applications determine if proposed development would be lawful',
        timeLimitInfo: {
          period: 'N/A',
          description: 'Time limits not relevant for proposed development',
          keyDate: 'N/A'
        }
      };
    }
    
    // For CLEUD
    const eligible = metAsOf !== undefined || !request.startDate;
    
    return {
      eligible,
      reason: eligible 
        ? `Time limit appears to have been met (${timeLimitData.period} requirement)` 
        : request.startDate 
          ? `Time limit has not yet been met - immunity from ${this.calculateImmuneDate(request.startDate, request.developmentType)}`
          : 'Unable to assess without start/completion date',
      timeLimitInfo: {
        period: timeLimitData.period,
        description: timeLimitData.description,
        keyDate: timeLimitData.keyDate,
        metAsOf
      }
    };
  }

  /**
   * Calculate immune date
   */
  private calculateImmuneDate(startDate: string, developmentType: string): string {
    const start = new Date(startDate);
    const years = developmentType === 'operational' ? 4 : 10;
    start.setFullYear(start.getFullYear() + years);
    return start.toISOString().split('T')[0] || 'Unknown';
  }

  /**
   * Get evidence requirements
   */
  private getEvidenceRequirements(request: CLEUDRequest): {
    essential: string[];
    recommended: string[];
    evidenceTypes: Array<{
      type: string;
      description: string;
      weight: string;
      tips: string[];
    }>;
  } {
    const certType = CERTIFICATE_TYPES[request.certificateType];
    const defaultEvidence = ['Supporting evidence'];
    
    const essential = certType?.evidenceRequired || defaultEvidence;
    
    const recommended: string[] = [];
    
    if (request.certificateType === 'cleud') {
      recommended.push('Multiple statutory declarations from different sources');
      recommended.push('Documentary evidence from each year of the time period');
      recommended.push('Historical photographs with verifiable dates');
      recommended.push('Council records (planning history, building control)');
    } else {
      recommended.push('Detailed scaled drawings');
      recommended.push('Photos of existing property');
      recommended.push('Measurements of original dwelling');
      recommended.push('Evidence property not in Article 4 area');
    }
    
    const evidenceTypes = Object.entries(EVIDENCE_GUIDANCE).map(([key, info]) => ({
      type: key,
      description: info.description,
      weight: info.weight,
      tips: info.tips
    }));
    
    return {
      essential,
      recommended,
      evidenceTypes
    };
  }

  /**
   * Assess risks
   */
  private assessRisks(request: CLEUDRequest): string[] {
    const risks: string[] = [];
    
    if (request.certificateType === 'cleud') {
      risks.push('Council may dispute evidence quality or coverage');
      risks.push('Enforcement action could be taken during application period');
      risks.push('Gaps in evidence timeline may result in refusal');
      
      if (request.hasEnforcementHistory) {
        risks.push('Previous enforcement may affect time limit calculation');
      }
      
      if (request.isListedBuilding) {
        risks.push('CRITICAL: Listed buildings have no time limit immunity');
      }
    } else {
      risks.push('Council may disagree with PD assessment');
      risks.push('Site conditions may affect PD eligibility');
      risks.push('Previous extensions may reduce PD allowance');
    }
    
    return risks;
  }

  /**
   * Get application process
   */
  private getApplicationProcess(certificateType: string): Array<{
    step: number;
    action: string;
    details: string;
  }> {
    const steps: Array<{
      step: number;
      action: string;
      details: string;
    }> = [];
    
    steps.push({
      step: 1,
      action: 'Gather evidence',
      details: certificateType === 'cleud' 
        ? 'Collect statutory declarations, documents, photos covering the relevant time period'
        : 'Prepare detailed drawings and measurements'
    });
    
    steps.push({
      step: 2,
      action: 'Complete application form',
      details: 'Use standard application form for LDC'
    });
    
    steps.push({
      step: 3,
      action: 'Pay fee',
      details: 'Fee is half the equivalent planning application fee'
    });
    
    steps.push({
      step: 4,
      action: 'Submit application',
      details: 'Submit online via Planning Portal or to council directly'
    });
    
    steps.push({
      step: 5,
      action: 'Validation',
      details: 'Council checks application is valid and complete'
    });
    
    steps.push({
      step: 6,
      action: 'Assessment',
      details: 'Council assesses evidence against legal tests'
    });
    
    steps.push({
      step: 7,
      action: 'Decision',
      details: 'Certificate granted or refused (target 8 weeks)'
    });
    
    if (certificateType === 'cleud') {
      steps.push({
        step: 8,
        action: 'Register',
        details: 'If granted, certificate registered as local land charge'
      });
    }
    
    return steps;
  }

  /**
   * Generate recommendations
   */
  private generateRecommendations(
    request: CLEUDRequest,
    eligibility: { eligible: boolean }
  ): string[] {
    const recommendations: string[] = [];
    
    if (request.certificateType === 'cleud') {
      if (eligibility.eligible) {
        recommendations.push('Proceed with CLEUD application with comprehensive evidence');
        recommendations.push('Obtain statutory declarations from multiple sources');
        recommendations.push('Document the timeline thoroughly');
      } else {
        recommendations.push('Wait until time limit is met before applying');
        recommendations.push('Continue gathering evidence in the meantime');
        recommendations.push('Do not assume immunity until certificate granted');
      }
      
      recommendations.push('Consider professional help with evidence compilation');
      recommendations.push('Keep copies of all evidence submitted');
    } else {
      recommendations.push('Prepare detailed drawings showing proposal meets PD criteria');
      recommendations.push('Include measurements of original dwelling');
      recommendations.push('Check for any Article 4 Directions');
      recommendations.push('Consider whether full planning application might be preferable');
    }
    
    return recommendations;
  }

  /**
   * Generate warnings
   */
  private generateWarnings(
    request: CLEUDRequest,
    eligibility: { eligible: boolean }
  ): string[] {
    const warnings: string[] = [];
    
    if (request.isListedBuilding && request.certificateType === 'cleud') {
      warnings.push('CRITICAL: Listed buildings have NO time limit immunity');
      warnings.push('Unauthorized works to listed building remain unlawful indefinitely');
    }
    
    if (request.hasEnforcementHistory) {
      warnings.push('Previous enforcement action may have interrupted the time period');
    }
    
    if (!eligibility.eligible && request.certificateType === 'cleud') {
      warnings.push('Do not assume development is lawful - immunity not yet achieved');
      warnings.push('Council could still take enforcement action');
    }
    
    warnings.push('Certificate application itself may prompt enforcement investigation');
    warnings.push('False or misleading information is a criminal offence');
    
    return warnings;
  }

  /**
   * Assess confidence level
   */
  private assessConfidence(
    request: CLEUDRequest,
    eligibility: { eligible: boolean }
  ): string {
    if (request.isListedBuilding && request.certificateType === 'cleud') {
      return 'HIGH'; // Clear that not eligible
    }
    
    if (!request.startDate && request.certificateType === 'cleud') {
      return 'LOW'; // Cannot assess without dates
    }
    
    if (eligibility.eligible && request.evidenceAvailable && request.evidenceAvailable.length >= 3) {
      return 'MEDIUM'; // Reasonable confidence with good evidence
    }
    
    return 'MEDIUM';
  }

  /**
   * Get certificate type information
   */
  public getCertificateTypeInfo(certType: string): typeof CERTIFICATE_TYPES[keyof typeof CERTIFICATE_TYPES] | null {
    return CERTIFICATE_TYPES[certType] || null;
  }

  /**
   * Get time limit information
   */
  public getTimeLimitInfo(): typeof TIME_LIMITS {
    return TIME_LIMITS;
  }

  /**
   * Get evidence guidance
   */
  public getEvidenceGuidance(): typeof EVIDENCE_GUIDANCE {
    return EVIDENCE_GUIDANCE;
  }

  /**
   * Get common refusal reasons
   */
  public getRefusalReasons(): typeof REFUSAL_REASONS {
    return REFUSAL_REASONS;
  }
}

export default CertificateOfLawfulnessService;
