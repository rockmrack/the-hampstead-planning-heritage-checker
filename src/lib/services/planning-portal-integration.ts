/**
 * Planning Portal Integration Service
 * 
 * Comprehensive guidance on planning portal submissions, application
 * requirements, document checklists, and online application processes.
 * Covers form requirements, supporting documents, and submission procedures.
 * 
 * @module services/planning-portal-integration
 */

// Application types and forms
const APPLICATION_TYPES: Record<string, {
  type: string;
  form: string;
  description: string;
  typicalFee: string;
  determinationPeriod: string;
  requiredDocuments: string[];
}> = {
  'householder': {
    type: 'Householder Planning Permission',
    form: 'Application for Householder Planning Permission',
    description: 'Extensions, alterations, outbuildings for houses',
    typicalFee: '£258 (2024)',
    determinationPeriod: '8 weeks',
    requiredDocuments: [
      'Application form',
      'Location plan (1:1250 or 1:2500)',
      'Site plan (1:500 or 1:200)',
      'Existing and proposed floor plans',
      'Existing and proposed elevations',
      'Fee payment'
    ]
  },
  'full': {
    type: 'Full Planning Permission',
    form: 'Application for Planning Permission',
    description: 'New buildings, major alterations, change of use',
    typicalFee: 'Variable by floor space/units',
    determinationPeriod: '8 weeks (minor) / 13 weeks (major)',
    requiredDocuments: [
      'Application form',
      'Location plan (1:1250 or 1:2500)',
      'Site plan (1:500 or 1:200)',
      'Existing and proposed floor plans',
      'Existing and proposed elevations',
      'Existing and proposed sections',
      'Design and Access Statement',
      'Fee payment'
    ]
  },
  'listed_building': {
    type: 'Listed Building Consent',
    form: 'Application for Listed Building Consent',
    description: 'Works to listed buildings',
    typicalFee: 'No fee',
    determinationPeriod: '8 weeks',
    requiredDocuments: [
      'Application form',
      'Location plan',
      'Existing and proposed plans',
      'Heritage Impact Assessment',
      'Schedule of works',
      'Photographs of existing building',
      'Detailed drawings of affected features'
    ]
  },
  'conservation_area': {
    type: 'Conservation Area Consent',
    form: 'Application in Conservation Area',
    description: 'Demolition in conservation areas',
    typicalFee: 'No fee for demolition',
    determinationPeriod: '8 weeks',
    requiredDocuments: [
      'Application form',
      'Location plan',
      'Photographs',
      'Heritage statement',
      'Demolition method statement',
      'Replacement scheme details'
    ]
  },
  'outline': {
    type: 'Outline Planning Permission',
    form: 'Application for Outline Planning Permission',
    description: 'Establishes principle of development',
    typicalFee: 'Variable by site area',
    determinationPeriod: '13 weeks',
    requiredDocuments: [
      'Application form',
      'Location plan',
      'Site plan with access',
      'Design and Access Statement',
      'Parameter plans (optional)',
      'Fee payment'
    ]
  },
  'reserved_matters': {
    type: 'Reserved Matters Application',
    form: 'Application for Approval of Reserved Matters',
    description: 'Details following outline permission',
    typicalFee: 'Variable',
    determinationPeriod: '8 weeks',
    requiredDocuments: [
      'Application form',
      'Detailed drawings addressing reserved matters',
      'Design and Access Statement (if not approved)',
      'Reference to outline permission',
      'Fee payment'
    ]
  },
  'prior_notification': {
    type: 'Prior Notification/Approval',
    form: 'Prior Notification Application',
    description: 'Certain permitted development changes',
    typicalFee: '£120-£206 (varies by type)',
    determinationPeriod: '56 days typically',
    requiredDocuments: [
      'Application form',
      'Location plan',
      'Floor plans',
      'Elevations',
      'Transport assessment (some types)',
      'Contamination assessment (some types)'
    ]
  },
  'certificate_lawfulness': {
    type: 'Certificate of Lawfulness',
    form: 'Application for Certificate of Lawfulness',
    description: 'Confirm existing or proposed use/development is lawful',
    typicalFee: '£129 (existing) / Half full fee (proposed)',
    determinationPeriod: '8 weeks',
    requiredDocuments: [
      'Application form',
      'Location plan',
      'Supporting evidence/statutory declaration',
      'Plans of development',
      'Fee payment'
    ]
  },
  'advertisement': {
    type: 'Advertisement Consent',
    form: 'Application for Advertisement Consent',
    description: 'Signage and advertisements',
    typicalFee: '£150',
    determinationPeriod: '8 weeks',
    requiredDocuments: [
      'Application form',
      'Location plan',
      'Drawing showing size and position',
      'Details of illumination',
      'Photographs of site'
    ]
  },
  'tree_works': {
    type: 'Tree Works Application',
    form: 'Application for Works to Protected Trees',
    description: 'Works to trees under TPO or in conservation area',
    typicalFee: 'No fee',
    determinationPeriod: '6 weeks (CA notice) / 8 weeks (TPO)',
    requiredDocuments: [
      'Application form',
      'Location plan showing trees',
      'Tree survey',
      'Arboricultural method statement',
      'Reasons for work'
    ]
  }
};

// Common supporting documents
const SUPPORTING_DOCUMENTS: Record<string, {
  document: string;
  whenRequired: string;
  contents: string[];
  guidance: string;
}> = {
  'design_access': {
    document: 'Design and Access Statement',
    whenRequired: 'Major developments, conservation areas, listed buildings',
    contents: [
      'Site context analysis',
      'Design principles and concepts',
      'Access strategy',
      'How design responds to context',
      'Inclusive access provisions'
    ],
    guidance: 'Use Camden design guidance format, reference local character'
  },
  'heritage_statement': {
    document: 'Heritage Statement/Impact Assessment',
    whenRequired: 'Listed buildings, conservation areas, heritage assets',
    contents: [
      'Significance assessment',
      'Impact assessment',
      'Justification for works',
      'Mitigation measures',
      'Historical research'
    ],
    guidance: 'Follow Historic England guidance, use proportionate detail'
  },
  'planning_statement': {
    document: 'Planning Statement',
    whenRequired: 'Major applications, policy departures',
    contents: [
      'Site description',
      'Planning history',
      'Policy analysis',
      'Material considerations',
      'Planning balance'
    ],
    guidance: 'Reference specific policies, address all material considerations'
  },
  'transport_assessment': {
    document: 'Transport Assessment/Statement',
    whenRequired: 'Major developments, high traffic generators',
    contents: [
      'Existing conditions',
      'Predicted trip generation',
      'Parking provision',
      'Mitigation measures',
      'Travel plan'
    ],
    guidance: 'Use TfL guidance, agree scope with highways officer'
  },
  'flood_risk': {
    document: 'Flood Risk Assessment',
    whenRequired: 'Sites in flood zones, developments over 1 hectare',
    contents: [
      'Flood zone classification',
      'Site-specific flood risk',
      'Mitigation measures',
      'Surface water drainage',
      'Sequential and exception tests'
    ],
    guidance: 'Check Environment Agency flood maps, use qualified consultant'
  },
  'daylight_sunlight': {
    document: 'Daylight/Sunlight Assessment',
    whenRequired: 'Developments affecting neighbours, tall buildings',
    contents: [
      'BRE guidelines assessment',
      'VSC calculations',
      'Sunlight hours analysis',
      'Impact on gardens/amenity space',
      'Mitigation discussion'
    ],
    guidance: 'Use BRE guidelines, consider cumulative impacts'
  },
  'ecology': {
    document: 'Ecological Assessment',
    whenRequired: 'Sites with habitat value, protected species',
    contents: [
      'Baseline survey',
      'Protected species assessment',
      'Impact assessment',
      'Mitigation strategy',
      'Biodiversity net gain calculation'
    ],
    guidance: 'Survey at appropriate time of year, use qualified ecologist'
  },
  'tree_survey': {
    document: 'Arboricultural Survey/Impact Assessment',
    whenRequired: 'Sites with trees, conservation areas',
    contents: [
      'Tree schedule with species and condition',
      'Root protection areas',
      'Impact assessment',
      'Retention categories',
      'Protective measures'
    ],
    guidance: 'Follow BS5837:2012, use qualified arboriculturist'
  },
  'contamination': {
    document: 'Contamination Assessment',
    whenRequired: 'Potentially contaminated sites, sensitive uses',
    contents: [
      'Desk study',
      'Site investigation',
      'Risk assessment',
      'Remediation strategy',
      'Verification plan'
    ],
    guidance: 'Use qualified consultant, agree scope with environmental health'
  },
  'energy_statement': {
    document: 'Energy Statement',
    whenRequired: 'Major developments (GLA requirement)',
    contents: [
      'Be Lean measures',
      'Be Clean measures',
      'Be Green measures',
      'Carbon reduction calculations',
      'Renewable energy provision'
    ],
    guidance: 'Follow London Plan energy hierarchy, use GLA template'
  }
};

// Camden validation requirements
const CAMDEN_VALIDATION: {
  localList: string[];
  nationalList: string[];
  commonInvalidationReasons: string[];
} = {
  localList: [
    'Completed application form',
    'Correct fee',
    'Location plan (red line around site)',
    'Site plan',
    'Existing and proposed drawings',
    'CIL Additional Information form',
    'Ownership certificates',
    'Agricultural holdings certificate'
  ],
  nationalList: [
    'Design and Access Statement (where required)',
    'Fire statement (tall residential)',
    'Biodiversity gain statement (major)',
    'Planning statement (major)'
  ],
  commonInvalidationReasons: [
    'Incorrect or missing fee',
    'Missing ownership certificate',
    'Red line not accurate',
    'Drawings not to scale',
    'Missing north point',
    'Missing CIL form',
    'Incorrect application form',
    'Missing required supporting documents'
  ]
};

// Submission process steps
const SUBMISSION_PROCESS: Array<{
  step: number;
  action: string;
  description: string;
  tips: string[];
}> = [
  {
    step: 1,
    action: 'Pre-application Advice',
    description: 'Consider seeking pre-application advice for complex schemes',
    tips: [
      'Helps identify issues early',
      'Understand likely requirements',
      'Build relationship with case officer',
      'Can speed up determination'
    ]
  },
  {
    step: 2,
    action: 'Gather Documents',
    description: 'Compile all required drawings and supporting documents',
    tips: [
      'Check local validation list',
      'Ensure drawings are to scale',
      'Include scale bars and north points',
      'Save in PDF format'
    ]
  },
  {
    step: 3,
    action: 'Complete Application Form',
    description: 'Fill in online application form on Planning Portal',
    tips: [
      'Have site details to hand',
      'Check all contact details',
      'Complete ownership certificates carefully',
      'Save regularly'
    ]
  },
  {
    step: 4,
    action: 'Upload Documents',
    description: 'Upload all supporting documents to application',
    tips: [
      'Name files clearly',
      'Check file sizes (usually 25MB limit)',
      'Group related documents',
      'Review before uploading'
    ]
  },
  {
    step: 5,
    action: 'Pay Fee',
    description: 'Pay application fee online',
    tips: [
      'Check current fee rates',
      'Use Planning Portal fee calculator',
      'Keep payment confirmation',
      'Note: some applications are free'
    ]
  },
  {
    step: 6,
    action: 'Submit Application',
    description: 'Submit completed application',
    tips: [
      'Review all details before submission',
      'Note application reference number',
      'Save submission confirmation',
      'Monitor for validation queries'
    ]
  },
  {
    step: 7,
    action: 'Validation',
    description: 'Council validates application against requirements',
    tips: [
      'Typically takes 1-2 weeks',
      'Respond quickly to any queries',
      'Application only starts after validation'
    ]
  },
  {
    step: 8,
    action: 'Consultation',
    description: 'Neighbours notified, statutory consultees consulted',
    tips: [
      'Check notice has been displayed',
      'View on council website',
      'Minimum 21 days for comments'
    ]
  },
  {
    step: 9,
    action: 'Determination',
    description: 'Council determines application',
    tips: [
      '8 weeks for householder/minor',
      '13 weeks for major',
      'May go to committee if controversial'
    ]
  }
];

// Types
export interface PortalIntegrationRequest {
  address: string;
  postcode: string;
  applicationType?: string;
  isListedBuilding?: boolean;
  inConservationArea?: boolean;
  proposedFloorspace?: number;
  proposedUnits?: number;
  hasPreAppAdvice?: boolean;
  siteAreaHectares?: number;
}

export interface PortalGuidance {
  address: string;
  postcode: string;
  timestamp: string;
  applicationDetails: {
    recommendedType: string;
    form: string;
    typicalFee: string;
    determinationPeriod: string;
    portalLink: string;
  };
  documentChecklist: {
    mandatory: Array<{
      document: string;
      status: string;
      guidance: string;
    }>;
    situational: Array<{
      document: string;
      required: boolean;
      reason: string;
      contents: string[];
    }>;
  };
  validationRequirements: {
    essentialItems: string[];
    commonMistakes: string[];
    camdenSpecific: string[];
  };
  submissionProcess: Array<{
    step: number;
    action: string;
    description: string;
    tips: string[];
  }>;
  feeCalculation: {
    estimatedFee: string;
    feeCalculatorLink: string;
    paymentMethods: string[];
    exemptions: string[];
  };
  timelineExpectations: {
    validation: string;
    consultation: string;
    determination: string;
    total: string;
  };
  trackingGuidance: {
    howToTrack: string[];
    whatToExpect: string[];
    respondingToQueries: string[];
  };
  amendmentProcess: {
    howToAmend: string[];
    fees: string;
    timing: string;
  };
  localRequirements: {
    camdenPortal: string;
    localValidation: string[];
    contactDetails: {
      email: string;
      phone: string;
    };
  };
  metadata: {
    guidance: string;
    source: string;
    disclaimer: string;
  };
}

/**
 * Planning Portal Integration Service
 */
class PlanningPortalIntegrationService {
  /**
   * Get comprehensive portal guidance
   */
  async getPortalGuidance(request: PortalIntegrationRequest): Promise<PortalGuidance> {
    const applicationDetails = this.determineApplicationType(request);
    const documentChecklist = this.getDocumentChecklist(request);
    const validationRequirements = this.getValidationRequirements(request);
    const feeCalculation = this.calculateFee(request);
    const timelineExpectations = this.getTimelineExpectations(request);
    const trackingGuidance = this.getTrackingGuidance();
    const amendmentProcess = this.getAmendmentProcess();
    const localRequirements = this.getLocalRequirements();

    return {
      address: request.address,
      postcode: request.postcode,
      timestamp: new Date().toISOString(),
      applicationDetails,
      documentChecklist,
      validationRequirements,
      submissionProcess: SUBMISSION_PROCESS,
      feeCalculation,
      timelineExpectations,
      trackingGuidance,
      amendmentProcess,
      localRequirements,
      metadata: {
        guidance: 'Planning Portal Submission Guidance',
        source: 'Planning Portal, Camden Council Validation Checklist',
        disclaimer: 'Fee rates and requirements may change. Check current guidance before submission.'
      }
    };
  }

  /**
   * Determine application type
   */
  private determineApplicationType(request: PortalIntegrationRequest): PortalGuidance['applicationDetails'] {
    let appType = 'householder';
    
    // Determine most appropriate application type
    if (request.isListedBuilding) {
      appType = 'listed_building';
    } else if (request.proposedUnits && request.proposedUnits > 0) {
      appType = 'full';
    } else if (request.proposedFloorspace && request.proposedFloorspace > 100) {
      appType = 'full';
    }
    
    const typeInfo = APPLICATION_TYPES[appType];
    
    // Safe extraction with defaults
    const form = typeInfo?.form || 'Standard application form';
    const typicalFee = typeInfo?.typicalFee || 'Check current fee rates';
    const determinationPeriod = typeInfo?.determinationPeriod || '8 weeks';
    
    return {
      recommendedType: typeInfo?.type || 'Planning Permission',
      form,
      typicalFee,
      determinationPeriod,
      portalLink: 'https://www.planningportal.co.uk/applications'
    };
  }

  /**
   * Get document checklist
   */
  private getDocumentChecklist(request: PortalIntegrationRequest): PortalGuidance['documentChecklist'] {
    const appType = this.getApplicationTypeKey(request);
    const typeInfo = APPLICATION_TYPES[appType];
    
    // Mandatory documents
    const mandatory = (typeInfo?.requiredDocuments || []).map(doc => ({
      document: doc,
      status: 'Required',
      guidance: this.getDocumentGuidance(doc)
    }));
    
    // Situational documents
    const situational: PortalGuidance['documentChecklist']['situational'] = [];
    
    if (request.inConservationArea || request.isListedBuilding) {
      const heritageDoc = SUPPORTING_DOCUMENTS['heritage_statement'];
      if (heritageDoc) {
        situational.push({
          document: heritageDoc.document,
          required: true,
          reason: 'Required for heritage assets',
          contents: heritageDoc.contents
        });
      }
    }
    
    if (request.proposedUnits && request.proposedUnits >= 10) {
      const transportDoc = SUPPORTING_DOCUMENTS['transport_assessment'];
      if (transportDoc) {
        situational.push({
          document: transportDoc.document,
          required: true,
          reason: 'Required for major developments',
          contents: transportDoc.contents
        });
      }
      
      const energyDoc = SUPPORTING_DOCUMENTS['energy_statement'];
      if (energyDoc) {
        situational.push({
          document: energyDoc.document,
          required: true,
          reason: 'GLA requirement for major developments',
          contents: energyDoc.contents
        });
      }
    }
    
    // Daylight/sunlight for extensions
    const daylightDoc = SUPPORTING_DOCUMENTS['daylight_sunlight'];
    if (daylightDoc) {
      situational.push({
        document: daylightDoc.document,
        required: request.applicationType?.toLowerCase().includes('extension') || false,
        reason: 'May be required if affecting neighbour light',
        contents: daylightDoc.contents
      });
    }
    
    return { mandatory, situational };
  }

  /**
   * Get application type key
   */
  private getApplicationTypeKey(request: PortalIntegrationRequest): string {
    if (request.isListedBuilding) return 'listed_building';
    if (request.proposedUnits && request.proposedUnits > 0) return 'full';
    if (request.proposedFloorspace && request.proposedFloorspace > 100) return 'full';
    return 'householder';
  }

  /**
   * Get document guidance
   */
  private getDocumentGuidance(document: string): string {
    const docLower = document.toLowerCase();
    if (docLower.includes('location plan')) {
      return 'Scale 1:1250 or 1:2500, site outlined in red, other land owned in blue';
    }
    if (docLower.includes('site plan')) {
      return 'Scale 1:500 or 1:200, show context and boundaries';
    }
    if (docLower.includes('floor plans')) {
      return 'Scale 1:100 or 1:50, clearly label rooms and dimensions';
    }
    if (docLower.includes('elevation')) {
      return 'Scale 1:100 or 1:50, show materials and context';
    }
    return 'Ensure document meets current requirements';
  }

  /**
   * Get validation requirements
   */
  private getValidationRequirements(request: PortalIntegrationRequest): PortalGuidance['validationRequirements'] {
    return {
      essentialItems: CAMDEN_VALIDATION.localList,
      commonMistakes: CAMDEN_VALIDATION.commonInvalidationReasons,
      camdenSpecific: [
        'CIL Additional Information form required',
        'Ownership certificates must be signed',
        'Red line must match application description',
        'All drawings must have scale bar and north point',
        'File naming convention: Address_DrawingType_Scale_Date'
      ]
    };
  }

  /**
   * Calculate fee
   */
  private calculateFee(request: PortalIntegrationRequest): PortalGuidance['feeCalculation'] {
    let estimatedFee = '£258';
    
    if (request.isListedBuilding && !request.proposedUnits) {
      estimatedFee = 'No fee (Listed Building Consent)';
    } else if (request.proposedUnits) {
      if (request.proposedUnits <= 50) {
        estimatedFee = `£578 + £462 per dwelling = approx £${578 + (request.proposedUnits * 462)}`;
      } else {
        estimatedFee = '£578 + £462 per dwelling (first 50) + £138 per dwelling thereafter';
      }
    } else if (request.proposedFloorspace) {
      if (request.proposedFloorspace <= 40) {
        estimatedFee = '£258';
      } else if (request.proposedFloorspace <= 75) {
        estimatedFee = '£516';
      } else {
        estimatedFee = 'Calculate based on floor space - see fee calculator';
      }
    }
    
    return {
      estimatedFee,
      feeCalculatorLink: 'https://www.planningportal.co.uk/app/fee-calculator',
      paymentMethods: [
        'Online payment (card)',
        'Cheque payable to Camden Council',
        'BACS transfer'
      ],
      exemptions: [
        'Listed Building Consent applications',
        'Works for disabled persons',
        'First application withdrawn before determination',
        'Resubmission within 12 months (conditions apply)'
      ]
    };
  }

  /**
   * Get timeline expectations
   */
  private getTimelineExpectations(request: PortalIntegrationRequest): PortalGuidance['timelineExpectations'] {
    let determination = '8 weeks';
    
    if (request.proposedUnits && request.proposedUnits >= 10) {
      determination = '13 weeks (major development)';
    }
    
    return {
      validation: '1-2 weeks',
      consultation: '3 weeks minimum',
      determination,
      total: `${8 + 2}-${13 + 2} weeks from submission to decision`
    };
  }

  /**
   * Get tracking guidance
   */
  private getTrackingGuidance(): PortalGuidance['trackingGuidance'] {
    return {
      howToTrack: [
        'Use application reference number on Planning Portal',
        'Monitor Camden Council planning search',
        'Set up email alerts for comments/updates',
        'Contact case officer for status updates'
      ],
      whatToExpect: [
        'Validation confirmation email',
        'Consultation period notification',
        'Any requests for additional information',
        'Decision notification'
      ],
      respondingToQueries: [
        'Respond within requested timescale',
        'Provide information in requested format',
        'Seek clarification if unsure what\'s needed',
        'Request extension of time if needed'
      ]
    };
  }

  /**
   * Get amendment process
   */
  private getAmendmentProcess(): PortalGuidance['amendmentProcess'] {
    return {
      howToAmend: [
        'Contact case officer to discuss proposed amendments',
        'Minor amendments may be accepted during application',
        'Submit revised drawings clearly marked',
        'Significant amendments may require fresh application'
      ],
      fees: 'Usually no additional fee for minor amendments during application',
      timing: 'Amendments may extend determination period'
    };
  }

  /**
   * Get local requirements
   */
  private getLocalRequirements(): PortalGuidance['localRequirements'] {
    return {
      camdenPortal: 'https://www.camden.gov.uk/planning-applications',
      localValidation: [
        'Check Camden Local Validation Checklist',
        'Include CIL Additional Information form',
        'Follow Camden naming conventions for files',
        'Include correct ownership certificates'
      ],
      contactDetails: {
        email: 'planningapplications@camden.gov.uk',
        phone: '020 7974 4444'
      }
    };
  }

  /**
   * Get application types reference
   */
  async getApplicationTypes(): Promise<typeof APPLICATION_TYPES> {
    return APPLICATION_TYPES;
  }

  /**
   * Get supporting documents reference
   */
  async getSupportingDocuments(): Promise<typeof SUPPORTING_DOCUMENTS> {
    return SUPPORTING_DOCUMENTS;
  }
}

// Export singleton instance
const planningPortalIntegrationService = new PlanningPortalIntegrationService();
export default planningPortalIntegrationService;
