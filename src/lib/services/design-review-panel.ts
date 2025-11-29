/**
 * Design Review Panel Service
 * 
 * Comprehensive guidance on design review panels, quality panels,
 * CABE assessments, and design code compliance. Covers preparation
 * for design reviews, typical panel processes, and how to respond.
 * 
 * @module services/design-review-panel
 */

// Design review panel types
const REVIEW_PANEL_TYPES: Record<string, {
  name: string;
  description: string;
  scope: string[];
  frequency: string;
  composition: string[];
}> = {
  'local_design_review': {
    name: 'Local Design Review Panel',
    description: 'Council-run panel reviewing significant local developments',
    scope: [
      'Major residential developments',
      'Commercial schemes in sensitive areas',
      'Heritage-adjacent proposals',
      'Public buildings'
    ],
    frequency: 'Monthly or bi-monthly',
    composition: ['Local architects', 'Urban designers', 'Planning officers', 'Conservation specialists']
  },
  'design_council_cabe': {
    name: 'Design Council CABE',
    description: 'National design review service for significant schemes',
    scope: [
      'Large-scale developments',
      'Nationally significant schemes',
      'Complex urban design challenges',
      'Public realm projects'
    ],
    frequency: 'As requested',
    composition: ['National design experts', 'Architects', 'Urban planners', 'Landscape architects']
  },
  'conservation_advisory': {
    name: 'Conservation Advisory Committee',
    description: 'Specialist panel for heritage-sensitive proposals',
    scope: [
      'Listed building alterations',
      'Conservation area developments',
      'World Heritage Site buffer zones',
      'Historic park settings'
    ],
    frequency: 'Monthly',
    composition: ['Conservation architects', 'Historians', 'Amenity society representatives']
  },
  'quality_review': {
    name: 'Quality Review Panel',
    description: 'GLA-affiliated panel for strategic London developments',
    scope: [
      'Tall buildings',
      'Strategic developments',
      'Housing zone schemes',
      'Mayoral referrals'
    ],
    frequency: 'Regular schedule',
    composition: ['Senior architects', 'Urban designers', 'Housing specialists', 'Sustainability experts']
  }
};

// Design principles assessed
const DESIGN_PRINCIPLES: Record<string, {
  principle: string;
  description: string;
  assessmentCriteria: string[];
  commonIssues: string[];
}> = {
  'context': {
    principle: 'Context and Character',
    description: 'How well the proposal responds to its surroundings',
    assessmentCriteria: [
      'Relationship to neighbouring buildings',
      'Response to local character',
      'Street scene integration',
      'Historical context understanding',
      'Townscape analysis quality'
    ],
    commonIssues: [
      'Ignoring local scale and massing',
      'Inappropriate materials palette',
      'Lack of contextual analysis',
      'Generic design not responding to place'
    ]
  },
  'identity': {
    principle: 'Identity and Distinctiveness',
    description: 'Creating a positive contribution to place identity',
    assessmentCriteria: [
      'Design quality and distinctiveness',
      'Contribution to local character',
      'Architectural expression',
      'Avoiding pastiche or poor imitation'
    ],
    commonIssues: [
      'Bland or generic design',
      'Poor pastiche of historical styles',
      'Lack of design ambition',
      'Over-complicated forms'
    ]
  },
  'built_form': {
    principle: 'Built Form',
    description: 'Quality of the three-dimensional design',
    assessmentCriteria: [
      'Massing and scale',
      'Height relationships',
      'Form and silhouette',
      'Roofscape contribution',
      'Visual hierarchy'
    ],
    commonIssues: [
      'Inappropriate height or bulk',
      'Poor roofscape design',
      'Lack of articulation',
      'Unresolved corner conditions'
    ]
  },
  'movement': {
    principle: 'Movement and Connectivity',
    description: 'How the development relates to movement networks',
    assessmentCriteria: [
      'Pedestrian permeability',
      'Cycle integration',
      'Public transport access',
      'Parking integration',
      'Servicing arrangements'
    ],
    commonIssues: [
      'Car-dominated design',
      'Poor pedestrian routes',
      'Inactive frontages',
      'Dominant servicing areas'
    ]
  },
  'nature': {
    principle: 'Nature and Biodiversity',
    description: 'Integration of green infrastructure and ecology',
    assessmentCriteria: [
      'Green space provision',
      'Urban greening factor',
      'Biodiversity net gain',
      'SUDS integration',
      'Tree retention and planting'
    ],
    commonIssues: [
      'Insufficient greening',
      'Poor quality landscaping',
      'Lack of biodiversity consideration',
      'Tree loss without mitigation'
    ]
  },
  'public_spaces': {
    principle: 'Public Spaces',
    description: 'Quality of public and communal spaces',
    assessmentCriteria: [
      'Public realm quality',
      'Active frontages',
      'Communal space design',
      'Play space provision',
      'Safety and security'
    ],
    commonIssues: [
      'Residual public space',
      'Poor surveillance',
      'Inadequate amenity provision',
      'Unclear public/private boundaries'
    ]
  },
  'uses': {
    principle: 'Uses and Activities',
    description: 'Mix and integration of uses',
    assessmentCriteria: [
      'Active ground floors',
      'Mixed use integration',
      'Community facilities',
      'Evening economy',
      'Flexible spaces'
    ],
    commonIssues: [
      'Mono-functional design',
      'Dead frontages',
      'Poor ground floor uses',
      'Lack of animation'
    ]
  },
  'homes': {
    principle: 'Homes and Buildings',
    description: 'Quality of internal spaces and accommodation',
    assessmentCriteria: [
      'Space standards compliance',
      'Daylight and sunlight',
      'Dual aspect provision',
      'Private amenity space',
      'Storage and practical needs'
    ],
    commonIssues: [
      'Single aspect north-facing units',
      'Below minimum space standards',
      'Lack of storage',
      'Poor aspect quality'
    ]
  },
  'resources': {
    principle: 'Resources and Sustainability',
    description: 'Environmental performance and resource use',
    assessmentCriteria: [
      'Carbon reduction strategy',
      'Operational energy use',
      'Embodied carbon',
      'Water efficiency',
      'Waste reduction'
    ],
    commonIssues: [
      'Lack of sustainability strategy',
      'Poor orientation for passive design',
      'Over-reliance on mechanical systems',
      'Missing whole-life carbon assessment'
    ]
  },
  'lifespan': {
    principle: 'Lifespan and Adaptability',
    description: 'Long-term flexibility and durability',
    assessmentCriteria: [
      'Building longevity',
      'Adaptability for future uses',
      'Material durability',
      'Maintenance access',
      'Upgradeability'
    ],
    commonIssues: [
      'Short-life materials',
      'Inflexible floor plans',
      'Poor maintenance access',
      'Lack of future-proofing'
    ]
  }
};

// Panel feedback categories
const FEEDBACK_CATEGORIES: Record<string, {
  category: string;
  meaning: string;
  response: string;
}> = {
  'green': {
    category: 'Green / Support',
    meaning: 'Design is of high quality and should proceed',
    response: 'Proceed with confidence, address minor comments'
  },
  'amber': {
    category: 'Amber / Conditional',
    meaning: 'Design has potential but requires changes',
    response: 'Revise design addressing concerns, consider re-presentation'
  },
  'red': {
    category: 'Red / Significant Concerns',
    meaning: 'Fundamental design issues need resolution',
    response: 'Significant redesign required before proceeding'
  },
  'recommend_approval': {
    category: 'Recommend Approval',
    meaning: 'Panel supports planning approval',
    response: 'Incorporate panel comments in planning application'
  },
  'recommend_refusal': {
    category: 'Recommend Refusal',
    meaning: 'Panel does not support the scheme',
    response: 'Consider fundamental redesign or appeal panel findings'
  }
};

// Hampstead/Camden specific design guidance
const LOCAL_DESIGN_GUIDANCE = {
  conservationAreas: {
    'hampstead': {
      keyCharacteristics: [
        'Village character and intimacy',
        'Historic street pattern',
        'Arts and Crafts influence',
        'Varied roofscape',
        'Traditional materials palette',
        'Garden settings'
      ],
      sensitiveIssues: [
        'Roof extensions visible from street',
        'Loss of front garden to parking',
        'Inappropriate window patterns',
        'Modern materials in traditional contexts',
        'Basement excavations'
      ]
    },
    'hampstead_garden_suburb': {
      keyCharacteristics: [
        'Garden City principles',
        'Arts and Crafts architecture',
        'Unified estate character',
        'Green setting dominance',
        'Hedges rather than walls',
        'Central Square formality'
      ],
      sensitiveIssues: [
        'Any front alterations',
        'Boundary treatment changes',
        'Extensions visible from street',
        'Window and door alterations',
        'Satellite dishes and aerials'
      ]
    }
  },
  heightSensitivity: {
    zones: ['Heath edge', 'Conservation areas', 'Listed building settings'],
    guidance: 'New development should respect existing heights and not dominate'
  },
  materialsPalette: {
    preferred: ['London stock brick', 'Red brick', 'Render', 'Natural slate', 'Clay tiles', 'Timber windows'],
    avoid: ['UPVC', 'Reconstituted stone', 'Concrete roof tiles', 'Aluminum windows in traditional contexts']
  }
};

// Types
export interface DesignReviewRequest {
  address: string;
  postcode: string;
  projectType?: string;
  projectDescription?: string;
  designStage?: string;
  inConservationArea?: boolean;
  nearListedBuilding?: boolean;
  proposedHeight?: string;
  proposedUnits?: number;
  siteAreaHectares?: number;
}

export interface DesignReviewGuidance {
  address: string;
  postcode: string;
  timestamp: string;
  reviewRequirement: {
    required: boolean;
    recommendedPanels: string[];
    reason: string;
    timing: string;
  };
  panelTypes: Array<{
    name: string;
    description: string;
    suitability: string;
    process: string[];
  }>;
  designPrinciples: Array<{
    principle: string;
    description: string;
    assessmentCriteria: string[];
    relevanceToProject: string;
  }>;
  preparationGuidance: {
    presentationTips: string[];
    materialsToPrepare: string[];
    commonMistakes: string[];
    questionsToExpect: string[];
  };
  localContext: {
    conservationGuidance: {
      keyCharacteristics: string[];
      sensitiveIssues: string[];
    };
    materialsAdvice: {
      preferred: string[];
      avoid: string[];
    };
    heightGuidance: string;
  };
  feedbackInterpretation: Array<{
    category: string;
    meaning: string;
    response: string;
  }>;
  postReviewActions: {
    ifPositive: string[];
    ifConcerns: string[];
    ifNegative: string[];
  };
  designCodeCompliance: {
    nationalCode: string[];
    localRequirements: string[];
    keyStandards: string[];
  };
  metadata: {
    guidance: string;
    source: string;
    disclaimer: string;
  };
}

/**
 * Design Review Panel Service
 */
class DesignReviewPanelService {
  /**
   * Get comprehensive design review guidance
   */
  async getDesignReviewGuidance(request: DesignReviewRequest): Promise<DesignReviewGuidance> {
    const reviewRequirement = this.determineReviewRequirement(request);
    const panelTypes = this.getRelevantPanelTypes(request);
    const designPrinciples = this.getRelevantDesignPrinciples(request);
    const preparationGuidance = this.getPreparationGuidance(request);
    const localContext = this.getLocalContext(request);
    const feedbackInterpretation = this.getFeedbackInterpretation();
    const postReviewActions = this.getPostReviewActions();
    const designCodeCompliance = this.getDesignCodeCompliance(request);

    return {
      address: request.address,
      postcode: request.postcode,
      timestamp: new Date().toISOString(),
      reviewRequirement,
      panelTypes,
      designPrinciples,
      preparationGuidance,
      localContext,
      feedbackInterpretation,
      postReviewActions,
      designCodeCompliance,
      metadata: {
        guidance: 'Design Review Panel Guidance',
        source: 'National Design Guide, Camden Design Review procedures',
        disclaimer: 'Design review requirements may vary. Consult the council for specific requirements.'
      }
    };
  }

  /**
   * Determine if design review is required
   */
  private determineReviewRequirement(request: DesignReviewRequest): DesignReviewGuidance['reviewRequirement'] {
    const panels: string[] = [];
    let reason = '';
    let required = false;
    
    // Check triggers for design review
    if (request.proposedUnits && request.proposedUnits >= 10) {
      required = true;
      panels.push('Local Design Review Panel');
      reason = 'Major residential development requires design review';
    }
    
    if (request.siteAreaHectares && request.siteAreaHectares >= 0.5) {
      required = true;
      panels.push('Local Design Review Panel');
      reason = 'Large site area triggers design review requirement';
    }
    
    if (request.inConservationArea) {
      required = true;
      panels.push('Conservation Advisory Committee');
      reason = 'Conservation area location requires heritage design review';
    }
    
    if (request.nearListedBuilding) {
      panels.push('Conservation Advisory Committee');
      reason = reason || 'Listed building setting requires design consideration';
    }
    
    const postcode = request.postcode.toUpperCase();
    if (postcode.startsWith('NW3') && request.inConservationArea) {
      panels.push('Conservation Advisory Committee');
      reason = 'Hampstead Conservation Area has additional design scrutiny';
    }
    
    // Timing advice
    let timing = 'Before planning application submission';
    if (request.designStage === 'concept') {
      timing = 'At concept stage - ideal timing for maximum benefit';
    } else if (request.designStage === 'detailed') {
      timing = 'At detailed stage - changes may be more difficult';
    }
    
    return {
      required,
      recommendedPanels: panels.length > 0 ? panels : ['Local Design Review Panel'],
      reason: reason || 'Design review recommended for quality assurance',
      timing
    };
  }

  /**
   * Get relevant panel types
   */
  private getRelevantPanelTypes(request: DesignReviewRequest): DesignReviewGuidance['panelTypes'] {
    const panels: DesignReviewGuidance['panelTypes'] = [];
    
    // Always include local design review
    const localPanel = REVIEW_PANEL_TYPES['local_design_review'];
    if (localPanel) {
      panels.push({
        name: localPanel.name,
        description: localPanel.description,
        suitability: 'Suitable for most developments in Hampstead area',
        process: [
          'Submit design review request to Camden Council',
          'Provide project brief and initial designs',
          'Attend panel presentation (typically 30 minutes)',
          'Receive written feedback within 2 weeks',
          'Respond to comments and consider re-presentation'
        ]
      });
    }
    
    // Add conservation panel if relevant
    if (request.inConservationArea || request.nearListedBuilding) {
      const conservationPanel = REVIEW_PANEL_TYPES['conservation_advisory'];
      if (conservationPanel) {
        panels.push({
          name: conservationPanel.name,
          description: conservationPanel.description,
          suitability: 'Essential for heritage-sensitive proposals',
          process: [
            'Prepare heritage impact assessment',
            'Submit to Conservation team',
            'Present to advisory committee',
            'Receive recommendations',
            'Incorporate feedback into design'
          ]
        });
      }
    }
    
    // Add CABE for significant schemes
    if (request.proposedUnits && request.proposedUnits >= 50) {
      const cabePanel = REVIEW_PANEL_TYPES['design_council_cabe'];
      if (cabePanel) {
        panels.push({
          name: cabePanel.name,
          description: cabePanel.description,
          suitability: 'Recommended for larger, strategic developments',
          process: [
            'Apply for CABE design review',
            'Pay review fee',
            'Submit comprehensive design pack',
            'Attend panel presentation',
            'Receive formal written advice'
          ]
        });
      }
    }
    
    return panels;
  }

  /**
   * Get relevant design principles
   */
  private getRelevantDesignPrinciples(request: DesignReviewRequest): DesignReviewGuidance['designPrinciples'] {
    const principles: DesignReviewGuidance['designPrinciples'] = [];
    
    // Prioritize principles based on project type
    const priorityPrinciples = ['context', 'identity', 'built_form'];
    
    if (request.inConservationArea) {
      priorityPrinciples.unshift('context');
    }
    
    if (request.projectType?.toLowerCase().includes('residential')) {
      priorityPrinciples.push('homes');
    }
    
    for (const key of priorityPrinciples) {
      const principle = DESIGN_PRINCIPLES[key];
      if (principle) {
        principles.push({
          principle: principle.principle,
          description: principle.description,
          assessmentCriteria: principle.assessmentCriteria,
          relevanceToProject: this.getPrincipleRelevance(key, request)
        });
      }
    }
    
    // Add remaining principles
    for (const [key, value] of Object.entries(DESIGN_PRINCIPLES)) {
      if (!priorityPrinciples.includes(key)) {
        principles.push({
          principle: value.principle,
          description: value.description,
          assessmentCriteria: value.assessmentCriteria,
          relevanceToProject: this.getPrincipleRelevance(key, request)
        });
      }
    }
    
    return principles;
  }

  /**
   * Get principle relevance
   */
  private getPrincipleRelevance(principle: string, request: DesignReviewRequest): string {
    if (principle === 'context' && request.inConservationArea) {
      return 'Critical - Conservation area context must be carefully addressed';
    }
    if (principle === 'homes' && request.projectType?.toLowerCase().includes('residential')) {
      return 'Essential - Residential quality will be closely scrutinized';
    }
    if (principle === 'built_form' && request.proposedHeight) {
      return 'Important - Height and massing key considerations';
    }
    return 'Standard assessment criteria';
  }

  /**
   * Get preparation guidance
   */
  private getPreparationGuidance(request: DesignReviewRequest): DesignReviewGuidance['preparationGuidance'] {
    return {
      presentationTips: [
        'Keep presentation to 15-20 minutes maximum',
        'Start with site context and constraints',
        'Explain your design rationale clearly',
        'Show evolution of design thinking',
        'Use physical models if possible',
        'Include verified views and CGIs',
        'Prepare for challenging questions',
        'Bring key team members (architect, landscape)'
      ],
      materialsToPrepare: [
        'Site analysis and context study',
        'Townscape/streetscape analysis',
        'Design and Access Statement (draft)',
        'Floor plans at suitable scale',
        'Elevations with context',
        'Sections showing relationships',
        'Materials palette and samples',
        'Landscape strategy',
        'Verified views from key viewpoints',
        '3D model or CGI visualizations',
        request.inConservationArea ? 'Heritage Impact Assessment' : '',
        request.nearListedBuilding ? 'Listed building analysis' : ''
      ].filter(m => m !== ''),
      commonMistakes: [
        'Not showing enough context in drawings',
        'Overselling the scheme rather than explaining rationale',
        'Defensive response to questions',
        'Incomplete or rushed presentation materials',
        'Not involving the design team in presentation',
        'Ignoring local character in design response',
        'Failing to address previous feedback'
      ],
      questionsToExpect: [
        'How does this respond to local character?',
        'Why have you chosen these materials?',
        'How does the height relate to neighbouring buildings?',
        'What is the design quality of the residential units?',
        'How have you addressed sustainability?',
        'What is the landscape strategy?',
        'How does this improve the public realm?',
        'What precedents have you drawn on?'
      ]
    };
  }

  /**
   * Get local context guidance
   */
  private getLocalContext(request: DesignReviewRequest): DesignReviewGuidance['localContext'] {
    const postcode = request.postcode.toUpperCase();
    
    // Default to Hampstead guidance
    let conservationGuidance = LOCAL_DESIGN_GUIDANCE.conservationAreas['hampstead'];
    
    if (postcode.startsWith('NW11')) {
      conservationGuidance = LOCAL_DESIGN_GUIDANCE.conservationAreas['hampstead_garden_suburb'];
    }
    
    return {
      conservationGuidance: {
        keyCharacteristics: conservationGuidance.keyCharacteristics,
        sensitiveIssues: conservationGuidance.sensitiveIssues
      },
      materialsAdvice: {
        preferred: LOCAL_DESIGN_GUIDANCE.materialsPalette.preferred,
        avoid: LOCAL_DESIGN_GUIDANCE.materialsPalette.avoid
      },
      heightGuidance: LOCAL_DESIGN_GUIDANCE.heightSensitivity.guidance
    };
  }

  /**
   * Get feedback interpretation guide
   */
  private getFeedbackInterpretation(): DesignReviewGuidance['feedbackInterpretation'] {
    return Object.values(FEEDBACK_CATEGORIES).map(f => ({
      category: f.category,
      meaning: f.meaning,
      response: f.response
    }));
  }

  /**
   * Get post-review actions
   */
  private getPostReviewActions(): DesignReviewGuidance['postReviewActions'] {
    return {
      ifPositive: [
        'Document panel comments for planning application',
        'Address any minor comments raised',
        'Include panel letter with planning submission',
        'Reference panel support in Design and Access Statement',
        'Proceed to planning application with confidence'
      ],
      ifConcerns: [
        'Review each concern systematically',
        'Develop design response to each issue',
        'Consider re-presentation to panel',
        'Discuss with planning officer before submission',
        'Document how concerns have been addressed'
      ],
      ifNegative: [
        'Consider fundamental redesign',
        'Request meeting with panel chair for clarification',
        'Engage different design team if appropriate',
        'Re-present substantially revised scheme',
        'Do not proceed to planning without addressing issues'
      ]
    };
  }

  /**
   * Get design code compliance guidance
   */
  private getDesignCodeCompliance(request: DesignReviewRequest): DesignReviewGuidance['designCodeCompliance'] {
    return {
      nationalCode: [
        'National Design Guide (2021)',
        'National Model Design Code',
        'Building Better, Building Beautiful Commission findings',
        'NPPF Chapter 12 - Achieving well-designed places'
      ],
      localRequirements: [
        'Camden Local Plan design policies',
        'Camden Planning Guidance (CPG) on Design',
        'Conservation Area Appraisals and Management Plans',
        'Hampstead Design Guide (if adopted)',
        'Article 4 Direction requirements'
      ],
      keyStandards: [
        'Nationally Described Space Standards',
        'BRE Daylight/Sunlight Guidelines',
        'Secured by Design principles',
        'London Housing Design Guide',
        'Urban Greening Factor requirements'
      ]
    };
  }

  /**
   * Get design principles reference
   */
  async getDesignPrinciples(): Promise<typeof DESIGN_PRINCIPLES> {
    return DESIGN_PRINCIPLES;
  }

  /**
   * Get panel types reference
   */
  async getPanelTypes(): Promise<typeof REVIEW_PANEL_TYPES> {
    return REVIEW_PANEL_TYPES;
  }
}

// Export singleton instance
const designReviewPanelService = new DesignReviewPanelService();
export default designReviewPanelService;
