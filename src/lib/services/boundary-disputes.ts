/**
 * Boundary Disputes Service
 * 
 * Comprehensive guidance on boundary disputes, fence and wall ownership,
 * boundary determinations, and resolving neighbour disagreements about
 * property boundaries and encroachment issues.
 * 
 * @module services/boundary-disputes
 */

// Boundary feature types
const BOUNDARY_FEATURES: Record<string, {
  feature: string;
  typicalOwnership: string;
  maintenanceResponsibility: string;
  legalStatus: string;
  commonIssues: string[];
}> = {
  'fence': {
    feature: 'Fences',
    typicalOwnership: 'Usually belongs to property on whose land posts are located',
    maintenanceResponsibility: 'Owner responsible, no obligation to maintain unless covenant',
    legalStatus: 'No automatic right to fence, but can enclose with planning consent if needed',
    commonIssues: [
      'Height disputes (usually max 2m rear, 1m front)',
      'Condition and maintenance arguments',
      'Replacement without agreement',
      'Posts on wrong side'
    ]
  },
  'wall': {
    feature: 'Garden Walls',
    typicalOwnership: 'Similar to fences, check deeds for party wall status',
    maintenanceResponsibility: 'Owner responsible, party walls shared responsibility',
    legalStatus: 'May be party wall if built astride boundary',
    commonIssues: [
      'Party wall vs boundary wall confusion',
      'Structural responsibility',
      'Alterations without agreement',
      'Insurance implications'
    ]
  },
  'hedge': {
    feature: 'Hedges',
    typicalOwnership: 'Usually belongs to property on whose land trunk/roots are located',
    maintenanceResponsibility: 'Owner maintains own side, both may cut overhanging',
    legalStatus: 'High Hedges Act may apply if over 2m and evergreen',
    commonIssues: [
      'Overgrowth blocking light',
      'Root damage',
      'Height disputes',
      'Removal without agreement'
    ]
  },
  'ditch': {
    feature: 'Ditches',
    typicalOwnership: 'Traditionally owned by land away from which ditch drains',
    maintenanceResponsibility: 'Riparian owner (owner of land through which water flows)',
    legalStatus: 'Common law presumption may be rebutted by deeds',
    commonIssues: [
      'Drainage responsibility',
      'Filling in without consent',
      'Boundary line unclear'
    ]
  },
  'trees': {
    feature: 'Trees',
    typicalOwnership: 'Belongs to owner of land where trunk stands',
    maintenanceResponsibility: 'Owner responsible for tree condition and damage',
    legalStatus: 'Neighbours can cut overhanging branches (must return cuttings)',
    commonIssues: [
      'Overhanging branches',
      'Root damage to foundations',
      'Light blocking',
      'Subsidence claims',
      'TPO restrictions'
    ]
  }
};

// Boundary determination methods
const BOUNDARY_DETERMINATION: Record<string, {
  method: string;
  description: string;
  reliability: string;
  cost: string;
  process: string[];
}> = {
  'title_deeds': {
    method: 'Title Deeds Review',
    description: 'Examining registered titles and deed plans',
    reliability: 'Variable - plans may be approximate',
    cost: '£3 per title from Land Registry + professional fees',
    process: [
      'Obtain office copies from Land Registry',
      'Review filed plan boundaries',
      'Check for any boundary descriptions',
      'Review transfer deeds for T-marks',
      'Note any boundary agreements filed'
    ]
  },
  'measured_survey': {
    method: 'Measured Survey',
    description: 'Professional survey of actual boundary positions',
    reliability: 'High accuracy for current positions',
    cost: '£500-£2,000 depending on complexity',
    process: [
      'Engage qualified land surveyor',
      'Physical measurement of features',
      'Comparison with deed plans',
      'Detailed plan produced',
      'Report on findings'
    ]
  },
  'historical_evidence': {
    method: 'Historical Evidence',
    description: 'Research into historical boundary positions',
    reliability: 'Can be helpful but needs corroboration',
    cost: 'Variable - research time',
    process: [
      'Old maps and photographs',
      'Aerial photographs',
      'Witness statements',
      'Historical OS maps',
      'Old conveyancing documents'
    ]
  },
  'boundary_agreement': {
    method: 'Boundary Agreement',
    description: 'Formal agreement between neighbours about boundary line',
    reliability: 'Binding if properly documented',
    cost: '£500-£1,500 legal fees',
    process: [
      'Neighbours agree position',
      'Survey to mark agreed line',
      'Legal document prepared',
      'Signed by both parties',
      'Registered at Land Registry'
    ]
  },
  'determined_boundary': {
    method: 'Determined Boundary',
    description: 'Land Registry application to fix boundary exactly',
    reliability: 'Highest - becomes definitive',
    cost: '£90 Land Registry fee + surveyor and legal costs',
    process: [
      'Commission detailed survey',
      'Apply to Land Registry',
      'Neighbour notification',
      'If agreed, boundary determined',
      'If disputed, may need tribunal'
    ]
  }
};

// Dispute resolution options
const RESOLUTION_OPTIONS: Record<string, {
  option: string;
  description: string;
  suitableFor: string;
  cost: string;
  timeline: string;
  binding: boolean;
}> = {
  'direct_negotiation': {
    option: 'Direct Negotiation',
    description: 'Talk directly with neighbour to resolve issue',
    suitableFor: 'Minor disputes, good neighbour relations',
    cost: 'Free',
    timeline: 'Days to weeks',
    binding: false
  },
  'mediation': {
    option: 'Mediation',
    description: 'Neutral third party helps parties reach agreement',
    suitableFor: 'Moderate disputes, parties willing to compromise',
    cost: '£100-£500 per party',
    timeline: '1-3 months',
    binding: false
  },
  'expert_determination': {
    option: 'Expert Determination',
    description: 'Independent expert makes binding decision',
    suitableFor: 'Technical disputes about boundary position',
    cost: '£2,000-£10,000',
    timeline: '2-4 months',
    binding: true
  },
  'solicitor_letter': {
    option: 'Solicitor Letter',
    description: 'Formal letter from solicitor setting out position',
    suitableFor: 'Formalizing position, showing seriousness',
    cost: '£300-£1,000',
    timeline: 'Weeks',
    binding: false
  },
  'court_action': {
    option: 'Court Proceedings',
    description: 'Legal action through County Court or High Court',
    suitableFor: 'Serious disputes, other options exhausted',
    cost: '£5,000-£50,000+',
    timeline: '6-18 months',
    binding: true
  },
  'land_tribunal': {
    option: 'First-tier Tribunal (Property Chamber)',
    description: 'Specialist tribunal for property disputes',
    suitableFor: 'Determined boundary applications, Land Registry disputes',
    cost: 'Application fees + legal costs',
    timeline: '6-12 months',
    binding: true
  }
};

// Common boundary scenarios
const COMMON_SCENARIOS: Record<string, {
  scenario: string;
  description: string;
  typicalResolution: string;
  preventionTips: string[];
}> = {
  'encroachment': {
    scenario: 'Encroachment onto Neighbour Land',
    description: 'Structure or feature built over the boundary line',
    typicalResolution: 'Remove encroachment, negotiate license, or adverse possession claim',
    preventionTips: [
      'Survey before building near boundary',
      'Check deeds before construction',
      'Agree boundary position with neighbour first'
    ]
  },
  'adverse_possession': {
    scenario: 'Adverse Possession Claim',
    description: 'Claim to own land through long occupation (10-12 years)',
    typicalResolution: 'Application to Land Registry, neighbour can object',
    preventionTips: [
      'Check boundaries when buying',
      'Act promptly if boundary moved',
      'Document any permission given'
    ]
  },
  'fence_dispute': {
    scenario: 'Fence Ownership Dispute',
    description: 'Disagreement about who owns or must maintain fence',
    typicalResolution: 'Check deeds for T-marks, apply common presumptions',
    preventionTips: [
      'Document fence ownership at purchase',
      'Keep records of who repairs',
      'Agree in writing with neighbour'
    ]
  },
  'overhanging': {
    scenario: 'Overhanging Trees or Hedges',
    description: 'Vegetation encroaching from neighbour property',
    typicalResolution: 'Cut back to boundary (return cuttings), discuss with neighbour',
    preventionTips: [
      'Regular maintenance',
      'Check for TPOs before cutting',
      'Good communication with neighbour'
    ]
  },
  'access_dispute': {
    scenario: 'Right of Way Dispute',
    description: 'Disagreement about access rights across land',
    typicalResolution: 'Check deeds for easements, evidence of long use',
    preventionTips: [
      'Check all rights of way when buying',
      'Document any permission given',
      'Maintain clear records'
    ]
  }
};

// Camden/Hampstead specific considerations
const LOCAL_CONSIDERATIONS = {
  conservationAreas: {
    relevance: 'Boundary treatments may require planning permission in conservation areas',
    considerations: [
      'Traditional boundary treatments may be protected',
      'New fences/walls may need to match character',
      'Article 4 directions may restrict PD rights',
      'Historic boundary walls may have heritage value'
    ]
  },
  listedBuildings: {
    relevance: 'Boundary structures may be part of listing',
    considerations: [
      'Historic garden walls may be curtilage listed',
      'LBC may be needed for alterations',
      'Demolition requires consent'
    ]
  },
  treePreservation: {
    relevance: 'Trees in conservation areas or with TPOs have protection',
    considerations: [
      'Notice required before tree work in conservation areas',
      'TPO trees cannot be cut without consent',
      'Penalties for unauthorized work'
    ]
  }
};

// Types
export interface BoundaryDisputeRequest {
  address: string;
  postcode: string;
  disputeType?: string;
  featureType?: string;
  disputeDescription?: string;
  hasNeighbourContact?: boolean;
  disputeDuration?: string;
  inConservationArea?: boolean;
  hasLegalAdvice?: boolean;
}

export interface BoundaryDisputeGuidance {
  address: string;
  postcode: string;
  timestamp: string;
  boundaryFeatures: {
    relevantFeature: string;
    ownership: string;
    maintenance: string;
    commonIssues: string[];
  };
  determinationMethods: Array<{
    method: string;
    description: string;
    reliability: string;
    cost: string;
    recommended: boolean;
  }>;
  resolutionOptions: Array<{
    option: string;
    description: string;
    suitableFor: string;
    cost: string;
    timeline: string;
    recommended: boolean;
  }>;
  scenarioGuidance: {
    scenario: string;
    description: string;
    typicalResolution: string;
    preventionTips: string[];
  } | null;
  stepByStepGuidance: Array<{
    step: number;
    action: string;
    details: string[];
    tips: string[];
  }>;
  documentEvidence: {
    whatToGather: string[];
    whereToFind: string[];
    howToUse: string;
  };
  localConsiderations: {
    conservationArea: boolean;
    specialConsiderations: string[];
  };
  avoidingEscalation: string[];
  whenToSeekLegalAdvice: string[];
  costs: {
    typical: string;
    factors: string[];
    funding: string[];
  };
  metadata: {
    guidance: string;
    source: string;
    disclaimer: string;
  };
}

/**
 * Boundary Disputes Service
 */
class BoundaryDisputesService {
  /**
   * Get comprehensive boundary dispute guidance
   */
  async getBoundaryDisputeGuidance(request: BoundaryDisputeRequest): Promise<BoundaryDisputeGuidance> {
    const boundaryFeatures = this.getBoundaryFeatures(request);
    const determinationMethods = this.getDeterminationMethods(request);
    const resolutionOptions = this.getResolutionOptions(request);
    const scenarioGuidance = this.getScenarioGuidance(request);
    const stepByStepGuidance = this.getStepByStepGuidance(request);
    const documentEvidence = this.getDocumentEvidence();
    const localConsiderations = this.getLocalConsiderations(request);
    const avoidingEscalation = this.getEscalationAvoidance();
    const whenToSeekLegalAdvice = this.getWhenToSeekAdvice();
    const costs = this.getCostGuidance(request);

    return {
      address: request.address,
      postcode: request.postcode,
      timestamp: new Date().toISOString(),
      boundaryFeatures,
      determinationMethods,
      resolutionOptions,
      scenarioGuidance,
      stepByStepGuidance,
      documentEvidence,
      localConsiderations,
      avoidingEscalation,
      whenToSeekLegalAdvice,
      costs,
      metadata: {
        guidance: 'Boundary Dispute Guidance',
        source: 'Land Registry, Property Law guidance',
        disclaimer: 'This is general guidance only. Boundary disputes can be complex - seek professional advice.'
      }
    };
  }

  /**
   * Get boundary features guidance
   */
  private getBoundaryFeatures(request: BoundaryDisputeRequest): BoundaryDisputeGuidance['boundaryFeatures'] {
    const featureType = request.featureType?.toLowerCase() || 'fence';
    
    // Find matching feature type
    let feature = BOUNDARY_FEATURES['fence'];
    for (const [key, value] of Object.entries(BOUNDARY_FEATURES)) {
      if (featureType.includes(key)) {
        feature = value;
        break;
      }
    }
    
    return {
      relevantFeature: feature.feature,
      ownership: feature.typicalOwnership,
      maintenance: feature.maintenanceResponsibility,
      commonIssues: feature.commonIssues
    };
  }

  /**
   * Get determination methods
   */
  private getDeterminationMethods(request: BoundaryDisputeRequest): BoundaryDisputeGuidance['determinationMethods'] {
    return Object.values(BOUNDARY_DETERMINATION).map(method => ({
      method: method.method,
      description: method.description,
      reliability: method.reliability,
      cost: method.cost,
      recommended: method.method === 'Title Deeds Review' || 
        (request.disputeDuration === 'long' && method.method === 'Determined Boundary')
    }));
  }

  /**
   * Get resolution options
   */
  private getResolutionOptions(request: BoundaryDisputeRequest): BoundaryDisputeGuidance['resolutionOptions'] {
    return Object.values(RESOLUTION_OPTIONS).map(option => ({
      option: option.option,
      description: option.description,
      suitableFor: option.suitableFor,
      cost: option.cost,
      timeline: option.timeline,
      recommended: request.hasNeighbourContact === false 
        ? option.option === 'Direct Negotiation'
        : option.option === 'Mediation'
    }));
  }

  /**
   * Get scenario guidance
   */
  private getScenarioGuidance(request: BoundaryDisputeRequest): BoundaryDisputeGuidance['scenarioGuidance'] {
    const disputeType = request.disputeType?.toLowerCase() || '';
    const description = request.disputeDescription?.toLowerCase() || '';
    
    // Match to scenario
    for (const [key, value] of Object.entries(COMMON_SCENARIOS)) {
      if (disputeType.includes(key) || description.includes(key) ||
          description.includes(value.scenario.toLowerCase())) {
        return {
          scenario: value.scenario,
          description: value.description,
          typicalResolution: value.typicalResolution,
          preventionTips: value.preventionTips
        };
      }
    }
    
    // Default to fence dispute if nothing matches
    const defaultScenario = COMMON_SCENARIOS['fence_dispute'];
    return {
      scenario: defaultScenario.scenario,
      description: defaultScenario.description,
      typicalResolution: defaultScenario.typicalResolution,
      preventionTips: defaultScenario.preventionTips
    };
  }

  /**
   * Get step by step guidance
   */
  private getStepByStepGuidance(request: BoundaryDisputeRequest): BoundaryDisputeGuidance['stepByStepGuidance'] {
    return [
      {
        step: 1,
        action: 'Gather Information',
        details: [
          'Obtain your title deeds from Land Registry',
          'Get copy of neighbour\'s title if possible',
          'Take photographs of the boundary',
          'Note current position of any features'
        ],
        tips: [
          'Title documents cost £3 each from Land Registry',
          'Take dated photographs',
          'Keep all documents organized'
        ]
      },
      {
        step: 2,
        action: 'Talk to Your Neighbour',
        details: [
          'Approach calmly and at appropriate time',
          'Explain your understanding of the boundary',
          'Listen to their perspective',
          'Try to find common ground'
        ],
        tips: [
          'Choose a neutral time, not during an argument',
          'Focus on facts not emotions',
          'Consider putting discussions in writing afterwards'
        ]
      },
      {
        step: 3,
        action: 'Review the Evidence',
        details: [
          'Compare deed plans carefully',
          'Look for T-marks showing ownership',
          'Check for any filed boundary agreements',
          'Consider historical photographs'
        ],
        tips: [
          'Land Registry plans are general boundaries only',
          'T-marks point toward owner responsible for fence',
          'Old photos can show historic positions'
        ]
      },
      {
        step: 4,
        action: 'Consider Professional Help',
        details: [
          'Land surveyor can measure actual positions',
          'Solicitor can advise on legal position',
          'Mediator can help reach agreement'
        ],
        tips: [
          'Get quotes from multiple professionals',
          'Consider cost vs value of dispute',
          'Joint instruction can reduce costs'
        ]
      },
      {
        step: 5,
        action: 'Attempt Resolution',
        details: [
          'Try mediation before legal action',
          'Consider boundary agreement',
          'Look for compromise solutions'
        ],
        tips: [
          'Written agreements should be witnessed',
          'Consider registering at Land Registry',
          'Small compromises often resolve big disputes'
        ]
      },
      {
        step: 6,
        action: 'Formal Action if Necessary',
        details: [
          'Determined boundary application to Land Registry',
          'Legal proceedings as last resort',
          'Specialist property solicitor essential'
        ],
        tips: [
          'Court costs can exceed value of disputed land',
          'Tribunal may be cheaper than court',
          'Consider insurance coverage'
        ]
      }
    ];
  }

  /**
   * Get document evidence guidance
   */
  private getDocumentEvidence(): BoundaryDisputeGuidance['documentEvidence'] {
    return {
      whatToGather: [
        'Title deeds and filed plans',
        'Transfer documents showing boundary',
        'Historical photographs',
        'Aerial photographs over time',
        'Old Ordnance Survey maps',
        'Witness statements',
        'Previous correspondence about boundary',
        'Survey reports'
      ],
      whereToFind: [
        'Land Registry (www.gov.uk/search-property-information-land-registry)',
        'Your solicitor\'s files from purchase',
        'Local archives',
        'Google Earth historical imagery',
        'National Library of Scotland (historical OS maps)',
        'Local history societies'
      ],
      howToUse: 'Compile chronologically, note dates and sources, present factually to neighbour or professional'
    };
  }

  /**
   * Get local considerations
   */
  private getLocalConsiderations(request: BoundaryDisputeRequest): BoundaryDisputeGuidance['localConsiderations'] {
    const considerations: string[] = [];
    
    if (request.inConservationArea) {
      considerations.push(...LOCAL_CONSIDERATIONS.conservationAreas.considerations);
    }
    
    // Hampstead-specific
    const postcode = request.postcode.toUpperCase();
    if (postcode.startsWith('NW3') || postcode.startsWith('NW11')) {
      considerations.push(
        'Historic garden walls common in Hampstead may have heritage significance',
        'Traditional boundary treatments should be maintained where possible',
        'Consult Camden Conservation team for advice on historic boundaries'
      );
    }
    
    if (considerations.length === 0) {
      considerations.push('Check if any trees are protected before any work');
    }
    
    return {
      conservationArea: request.inConservationArea || false,
      specialConsiderations: considerations
    };
  }

  /**
   * Get escalation avoidance tips
   */
  private getEscalationAvoidance(): string[] {
    return [
      'Remain calm and factual in all communications',
      'Put important communications in writing',
      'Avoid making changes to boundary while dispute ongoing',
      'Don\'t involve other neighbours unnecessarily',
      'Consider the long-term neighbour relationship',
      'Remember you may sell one day - disputes must be disclosed',
      'Focus on resolution not winning',
      'Consider the actual value vs cost of dispute',
      'Take breaks if discussions become heated',
      'Use neutral third party if direct communication failing'
    ];
  }

  /**
   * Get when to seek legal advice
   */
  private getWhenToSeekAdvice(): string[] {
    return [
      'Significant financial value at stake',
      'Neighbour has instructed solicitor',
      'Threat of legal action received',
      'Adverse possession claim involved',
      'Encroachment affecting property value',
      'Unable to resolve through direct discussion',
      'Complex historical title issues',
      'Insurance claim being made',
      'Planning or building work affected by dispute'
    ];
  }

  /**
   * Get cost guidance
   */
  private getCostGuidance(request: BoundaryDisputeRequest): BoundaryDisputeGuidance['costs'] {
    return {
      typical: 'Simple disputes: £500-£2,000 | Complex disputes: £5,000-£50,000+',
      factors: [
        'Complexity of legal issues',
        'Need for professional surveys',
        'Whether court proceedings needed',
        'Length of dispute',
        'Expert witness requirements'
      ],
      funding: [
        'Legal expenses insurance (check home insurance)',
        'Before the Event insurance',
        'Conditional fee agreements (no win no fee)',
        'Pro bono legal services for limited means'
      ]
    };
  }

  /**
   * Get boundary features reference
   */
  async getBoundaryFeatures(): Promise<typeof BOUNDARY_FEATURES> {
    return BOUNDARY_FEATURES;
  }

  /**
   * Get resolution options reference
   */
  async getResolutionOptions(): Promise<typeof RESOLUTION_OPTIONS> {
    return RESOLUTION_OPTIONS;
  }
}

// Export singleton instance
const boundaryDisputesService = new BoundaryDisputesService();
export default boundaryDisputesService;
