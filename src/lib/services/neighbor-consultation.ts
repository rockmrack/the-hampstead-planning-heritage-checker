/**
 * Neighbor Consultation Service
 * 
 * Comprehensive guidance for neighbor engagement and consultation processes
 * during planning applications in Hampstead and surrounding conservation areas.
 * Helps applicants manage relationships and address concerns proactively.
 * 
 * Coverage: NW1-NW11, N2, N6, N10 postcodes
 */

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

interface NeighborProject {
  propertyType?: 'detached' | 'semi_detached' | 'terraced' | 'flat' | 'mansion';
  projectType?: 'extension' | 'loft' | 'basement' | 'new_build' | 'refurbishment';
  adjacentProperties?: number;
  isConservationArea?: boolean;
  isListedBuilding?: boolean;
  hasPartyWall?: boolean;
  constructionDuration?: number; // months
  affectsViews?: boolean;
  affectsLight?: boolean;
  affectsPrivacy?: boolean;
}

interface NeighborIdentification {
  category: string;
  properties: string[];
  notificationRequired: boolean;
  consultationAdvised: boolean;
  keyConsiderations: string[];
}

interface ConsultationStrategy {
  phase: string;
  timing: string;
  actions: string[];
  materials: string[];
  objectives: string[];
}

interface CommonConcern {
  concern: string;
  frequency: string;
  validityAssessment: string;
  suggestedResponse: string;
  mitigationOptions: string[];
}

interface CommunicationTemplate {
  type: string;
  purpose: string;
  timing: string;
  keyContent: string[];
  tone: string;
}

interface ObjectionResponse {
  objectionType: string;
  responseStrategy: string;
  evidenceRequired: string[];
  negotiationOptions: string[];
}

interface NeighborConsultationAssessment {
  summary: ConsultationSummary;
  neighborIdentification: NeighborIdentification[];
  consultationStrategy: ConsultationStrategy[];
  commonConcerns: CommonConcern[];
  communicationTemplates: CommunicationTemplate[];
  objectionResponses: ObjectionResponse[];
  partyWallConsiderations: PartyWallGuidance;
  constructionCommunication: ConstructionComms;
  disputeResolution: DisputeResolution;
  bestPractices: string[];
  legalConsiderations: string[];
}

interface ConsultationSummary {
  riskLevel: string;
  numberOfNeighbors: number;
  keyStakeholders: string[];
  mainConcernsAnticipated: string[];
  recommendedApproach: string;
}

interface PartyWallGuidance {
  applicable: boolean;
  affectedProperties: string[];
  noticeType: string;
  timeline: string;
  costResponsibility: string;
  tips: string[];
}

interface ConstructionComms {
  preStartNotification: NotificationGuidance;
  ongoingCommunication: NotificationGuidance;
  completionNotification: NotificationGuidance;
  complaintsProcess: string[];
}

interface NotificationGuidance {
  timing: string;
  method: string[];
  content: string[];
}

interface DisputeResolution {
  preventionStrategies: string[];
  informalResolution: string[];
  formalProcesses: string[];
  professionalMediation: string[];
}

// =============================================================================
// MAIN SERVICE FUNCTION
// =============================================================================

async function generateNeighborConsultation(
  address: string,
  postcode: string,
  projectType: string,
  projectDetails: NeighborProject = {}
): Promise<NeighborConsultationAssessment> {
  const summary = generateConsultationSummary(projectType, projectDetails);
  const neighborIdentification = identifyNeighbors(projectDetails);
  const consultationStrategy = developConsultationStrategy(projectType, projectDetails);
  const commonConcerns = anticipateCommonConcerns(projectType, projectDetails);
  const communicationTemplates = generateCommunicationTemplates(projectType);
  const objectionResponses = prepareObjectionResponses(projectType, projectDetails);
  const partyWallConsiderations = assessPartyWallNeeds(projectDetails);
  const constructionCommunication = planConstructionComms(projectDetails);
  const disputeResolution = planDisputeResolution();
  const bestPractices = compileBestPractices();
  const legalConsiderations = identifyLegalConsiderations(projectDetails);

  return {
    summary,
    neighborIdentification,
    consultationStrategy,
    commonConcerns,
    communicationTemplates,
    objectionResponses,
    partyWallConsiderations,
    constructionCommunication,
    disputeResolution,
    bestPractices,
    legalConsiderations
  };
}

// =============================================================================
// CONSULTATION SUMMARY
// =============================================================================

function generateConsultationSummary(
  projectType: string,
  projectDetails: NeighborProject
): ConsultationSummary {
  let riskLevel = 'Medium';
  const mainConcerns: string[] = [];

  if (projectDetails.projectType === 'basement') {
    riskLevel = 'High';
    mainConcerns.push('Structural concerns', 'Construction noise/vibration', 'Duration of works');
  }
  if (projectDetails.affectsLight) {
    mainConcerns.push('Loss of daylight/sunlight');
  }
  if (projectDetails.affectsPrivacy) {
    mainConcerns.push('Overlooking and privacy');
  }
  if (projectDetails.affectsViews) {
    mainConcerns.push('Loss of views');
  }
  if (projectDetails.hasPartyWall) {
    mainConcerns.push('Party wall implications');
  }

  if (mainConcerns.length > 3) riskLevel = 'High';
  if (mainConcerns.length <= 1) riskLevel = 'Low';

  return {
    riskLevel,
    numberOfNeighbors: projectDetails.adjacentProperties || 4,
    keyStakeholders: [
      'Immediately adjacent neighbors',
      'Properties to rear',
      'Properties opposite',
      'Local residents associations'
    ],
    mainConcernsAnticipated: mainConcerns.length > 0 ? mainConcerns : ['General construction disruption'],
    recommendedApproach: riskLevel === 'High'
      ? 'Proactive engagement with individual meetings before application'
      : 'Written notification with offer to discuss'
  };
}

// =============================================================================
// NEIGHBOR IDENTIFICATION
// =============================================================================

function identifyNeighbors(projectDetails: NeighborProject): NeighborIdentification[] {
  return [
    {
      category: 'Immediately Adjacent',
      properties: ['Properties sharing boundary', 'Properties either side', 'Property to rear'],
      notificationRequired: true,
      consultationAdvised: true,
      keyConsiderations: [
        'Most likely to be affected',
        'Party wall implications possible',
        'May have planning consultation rights',
        'Key to maintaining good relations'
      ]
    },
    {
      category: 'Properties Opposite',
      properties: ['Properties across street', 'Properties with direct sightline'],
      notificationRequired: true,
      consultationAdvised: true,
      keyConsiderations: [
        'Streetscene impact visible to them',
        'May raise design concerns',
        'Generally lower impact than adjacent'
      ]
    },
    {
      category: 'Wider Neighborhood',
      properties: ['Properties within 20m', 'Street residents', 'Properties on parallel streets'],
      notificationRequired: false,
      consultationAdvised: projectDetails.projectType === 'new_build' || projectDetails.projectType === 'basement',
      keyConsiderations: [
        'May be affected by construction traffic',
        'Can still object to planning application',
        'Courtesy notification recommended for larger projects'
      ]
    },
    {
      category: 'Community Organizations',
      properties: ['Residents associations', 'Conservation area groups', 'Local amenity societies'],
      notificationRequired: false,
      consultationAdvised: Boolean(projectDetails.isConservationArea),
      keyConsiderations: [
        'May make representations on applications',
        'Can influence committee decisions',
        'Engagement can build support'
      ]
    }
  ];
}

// =============================================================================
// CONSULTATION STRATEGY
// =============================================================================

function developConsultationStrategy(
  projectType: string,
  projectDetails: NeighborProject
): ConsultationStrategy[] {
  return [
    {
      phase: 'Pre-Application',
      timing: '4-8 weeks before planning submission',
      actions: [
        'Identify all neighbors who may be affected',
        'Draft initial notification letter',
        'Arrange informal meetings with immediate neighbors',
        'Share preliminary drawings and explain proposals',
        'Listen to concerns and note feedback'
      ],
      materials: [
        'Simple drawings/sketches',
        'Written summary of proposals',
        'Contact details for questions',
        'Timeline of intended process'
      ],
      objectives: [
        'Build understanding of proposals',
        'Identify concerns early',
        'Opportunity to modify design if appropriate',
        'Reduce likelihood of objections'
      ]
    },
    {
      phase: 'Planning Application',
      timing: 'At submission',
      actions: [
        'Notify neighbors of submission',
        'Provide planning reference number',
        'Explain consultation process',
        'Offer to meet again if concerns'
      ],
      materials: [
        'Formal notification letter',
        'Planning reference and portal link',
        'Summary of any changes made following feedback'
      ],
      objectives: [
        'Maintain good communication',
        'Demonstrate responsiveness to concerns',
        'Allow informed responses to consultation'
      ]
    },
    {
      phase: 'Pre-Construction',
      timing: '2-4 weeks before works start',
      actions: [
        'Send construction notification letter',
        'Provide contractor contact details',
        'Explain working hours and duration',
        'Discuss party wall matters if applicable',
        'Offer pre-construction meeting'
      ],
      materials: [
        'Construction management plan summary',
        'Site contact card',
        'Program of works (simplified)'
      ],
      objectives: [
        'Prepare neighbors for disruption',
        'Set expectations',
        'Establish communication channels'
      ]
    },
    {
      phase: 'During Construction',
      timing: 'Throughout works',
      actions: [
        'Regular progress updates',
        'Advance notice of noisy works',
        'Respond promptly to complaints',
        'Maintain site standards'
      ],
      materials: [
        'Monthly update newsletter',
        'Notice board at site',
        'Complaints log'
      ],
      objectives: [
        'Minimize disruption',
        'Maintain relationships',
        'Prevent escalation of issues'
      ]
    }
  ];
}

// =============================================================================
// COMMON CONCERNS
// =============================================================================

function anticipateCommonConcerns(
  projectType: string,
  projectDetails: NeighborProject
): CommonConcern[] {
  const concerns: CommonConcern[] = [
    {
      concern: 'Loss of light',
      frequency: 'Very common (40% of objections)',
      validityAssessment: 'Valid concern; measurable using BRE guidelines',
      suggestedResponse: 'Commission daylight/sunlight study to demonstrate compliance',
      mitigationOptions: [
        'Reduce height/depth of extension',
        'Use roof lights instead of solid roof',
        'Set back upper floors',
        'Change window positions'
      ]
    },
    {
      concern: 'Overlooking/privacy',
      frequency: 'Very common (35% of objections)',
      validityAssessment: 'Valid for new windows overlooking private areas',
      suggestedResponse: 'Explain window positions; offer obscure glazing where appropriate',
      mitigationOptions: [
        'Use obscure glazing',
        'Reposition windows',
        'Add screening/planting',
        'Reduce window sizes'
      ]
    },
    {
      concern: 'Construction disruption',
      frequency: 'Common (25% of objections)',
      validityAssessment: 'Valid concern but not planning matter; manageable',
      suggestedResponse: 'Share construction management plan; commit to good practice',
      mitigationOptions: [
        'Restrict working hours',
        'Provide dedicated contact',
        'Regular updates',
        'Compensation for extreme cases'
      ]
    },
    {
      concern: 'Property value impact',
      frequency: 'Occasional (15% of objections)',
      validityAssessment: 'Not a planning consideration',
      suggestedResponse: 'Explain this is not material to planning; quality work often improves area',
      mitigationOptions: [
        'Focus on quality design',
        'Demonstrate improvements to streetscene'
      ]
    },
    {
      concern: 'Precedent setting',
      frequency: 'Occasional (10% of objections)',
      validityAssessment: 'Limited weight in planning; each case on merits',
      suggestedResponse: 'Explain each application assessed on own merits',
      mitigationOptions: [
        'Demonstrate unique circumstances',
        'Show compliance with policy'
      ]
    }
  ];

  if (projectDetails.projectType === 'basement') {
    concerns.push({
      concern: 'Structural damage',
      frequency: 'Very common for basement projects',
      validityAssessment: 'Valid concern; requires proper assessment and methodology',
      suggestedResponse: 'Share structural methodology; explain party wall process; offer condition survey',
      mitigationOptions: [
        'Full structural assessment',
        'Party wall award with condition survey',
        'Insurance and bonds',
        'Experienced contractor'
      ]
    });
  }

  return concerns;
}

// =============================================================================
// COMMUNICATION TEMPLATES
// =============================================================================

function generateCommunicationTemplates(projectType: string): CommunicationTemplate[] {
  return [
    {
      type: 'Initial Notification Letter',
      purpose: 'Introduce proposals before planning submission',
      timing: '4-6 weeks before application',
      keyContent: [
        'Brief description of proposals',
        'Reason for works',
        'Offer to discuss/show drawings',
        'Contact details',
        'Timeline for application'
      ],
      tone: 'Friendly, open, consultative'
    },
    {
      type: 'Planning Submission Notice',
      purpose: 'Inform of formal application',
      timing: 'Within 1 week of submission',
      keyContent: [
        'Application reference number',
        'How to view application online',
        'Council consultation period',
        'Summary of any changes made following feedback',
        'Contact for further discussion'
      ],
      tone: 'Informative, professional'
    },
    {
      type: 'Construction Start Notice',
      purpose: 'Prepare neighbors for works',
      timing: '2 weeks before start',
      keyContent: [
        'Start date and expected duration',
        'Working hours',
        'Site manager contact details',
        'Type of works and equipment',
        'Measures to minimize disruption',
        'How to raise concerns'
      ],
      tone: 'Considerate, practical'
    },
    {
      type: 'Progress Update',
      purpose: 'Keep neighbors informed during works',
      timing: 'Monthly or at key milestones',
      keyContent: [
        'Progress summary',
        'Upcoming works',
        'Any changes to program',
        'Appreciation for patience'
      ],
      tone: 'Appreciative, informative'
    },
    {
      type: 'Completion Notice',
      purpose: 'Thank neighbors and close communication',
      timing: 'At practical completion',
      keyContent: [
        'Confirmation of completion',
        'Thanks for patience',
        'Any follow-up works',
        'Invitation to view if appropriate'
      ],
      tone: 'Grateful, neighborly'
    }
  ];
}

// =============================================================================
// OBJECTION RESPONSES
// =============================================================================

function prepareObjectionResponses(
  projectType: string,
  projectDetails: NeighborProject
): ObjectionResponse[] {
  return [
    {
      objectionType: 'Scale and massing',
      responseStrategy: 'Demonstrate compliance with guidelines and policy',
      evidenceRequired: [
        'Comparison with permitted development fallback',
        'Examples of similar approved schemes',
        'Design rationale in D&A Statement'
      ],
      negotiationOptions: [
        'Minor reductions in height/depth',
        'Design modifications to reduce bulk',
        'Improved materials/detailing'
      ]
    },
    {
      objectionType: 'Impact on light',
      responseStrategy: 'Provide technical evidence of compliance',
      evidenceRequired: [
        'BRE daylight/sunlight study',
        'Comparison with 45-degree/25-degree rules',
        'Existing vs proposed analysis'
      ],
      negotiationOptions: [
        'Roof light design',
        'Setbacks',
        'Reduced depth',
        'Lower roof'
      ]
    },
    {
      objectionType: 'Privacy concerns',
      responseStrategy: 'Explain window positions and offer mitigation',
      evidenceRequired: [
        'Distance measurements to boundaries',
        'Comparison with existing overlooking',
        'Standard privacy distances (21m back-to-back)'
      ],
      negotiationOptions: [
        'Obscure glazing',
        'Fixed shut windows',
        'Repositioning',
        'Screening'
      ]
    },
    {
      objectionType: 'Construction impact',
      responseStrategy: 'Share construction management plan',
      evidenceRequired: [
        'Construction Management Plan',
        'Working hours commitment',
        'Contractor credentials',
        'Previous project references'
      ],
      negotiationOptions: [
        'Enhanced working restrictions',
        'Dedicated liaison person',
        'Specific noise/dust measures'
      ]
    },
    {
      objectionType: 'Character of area',
      responseStrategy: 'Demonstrate sensitive design approach',
      evidenceRequired: [
        'Heritage/Design Statement',
        'Materials schedule',
        'Precedent images',
        'Conservation officer pre-app advice'
      ],
      negotiationOptions: [
        'Material changes',
        'Design refinements',
        'Enhanced detailing'
      ]
    }
  ];
}

// =============================================================================
// PARTY WALL CONSIDERATIONS
// =============================================================================

function assessPartyWallNeeds(projectDetails: NeighborProject): PartyWallGuidance {
  const hasPartyWall = Boolean(projectDetails.hasPartyWall);
  const isBasement = projectDetails.projectType === 'basement';

  return {
    applicable: hasPartyWall || isBasement,
    affectedProperties: hasPartyWall
      ? ['Adjoining owner(s) sharing party wall', 'Properties within 3m/6m for excavations']
      : ['Properties within 3m (excavation <3m deep)', 'Properties within 6m (excavation >3m deep)'],
    noticeType: isBasement
      ? 'Section 6 Notice (excavation) and possibly Section 2 (party structure)'
      : 'Section 1 (new wall) or Section 2 (party structure works)',
    timeline: '1-2 months minimum before works affecting party walls',
    costResponsibility: 'Building owner pays surveyor fees for party wall matters',
    tips: [
      'Serve notices early - allow time for surveyor appointment',
      'Explain process to neighbors to reduce alarm',
      'Choose experienced party wall surveyor',
      'Condition survey protects both parties',
      'Award is legally binding - follow it carefully'
    ]
  };
}

// =============================================================================
// CONSTRUCTION COMMUNICATION
// =============================================================================

function planConstructionComms(projectDetails: NeighborProject): ConstructionComms {
  return {
    preStartNotification: {
      timing: '14 days minimum before works start',
      method: ['Letter to all adjacent properties', 'Door knock for immediate neighbors', 'Site notice'],
      content: [
        'Start date',
        'Expected duration',
        'Working hours',
        'Site manager contact',
        'Description of initial works'
      ]
    },
    ongoingCommunication: {
      timing: 'Monthly updates plus ad-hoc as needed',
      method: ['Letter/email updates', 'Site notice board', 'Direct contact for issues'],
      content: [
        'Progress summary',
        'Upcoming activities',
        'Any program changes',
        'Notice of particularly disruptive works'
      ]
    },
    completionNotification: {
      timing: 'Within 1 week of practical completion',
      method: ['Letter to all previously notified', 'Remove site notices'],
      content: [
        'Confirmation of completion',
        'Thanks for patience',
        'Any outstanding works',
        'Final contact for any issues'
      ]
    },
    complaintsProcess: [
      'Site manager as first point of contact',
      '24-hour response commitment',
      'Written log of all complaints',
      'Escalation to project manager if unresolved',
      'Mediation available for serious disputes'
    ]
  };
}

// =============================================================================
// DISPUTE RESOLUTION
// =============================================================================

function planDisputeResolution(): DisputeResolution {
  return {
    preventionStrategies: [
      'Early and open communication',
      'Listen to concerns genuinely',
      'Be prepared to modify plans where reasonable',
      'Keep promises about construction management',
      'Document all communications'
    ],
    informalResolution: [
      'Direct conversation to understand concerns',
      'Offer to meet and discuss face-to-face',
      'Consider reasonable modifications',
      'Apologize for any genuine impacts',
      'Offer practical solutions'
    ],
    formalProcesses: [
      'Party wall dispute resolution through surveyors',
      'Planning appeal if application refused',
      'Environmental health for statutory nuisance',
      'Civil courts for damage claims'
    ],
    professionalMediation: [
      'RICS mediation service',
      'CEDR (Centre for Effective Dispute Resolution)',
      'Local mediators through council',
      'Community mediation services'
    ]
  };
}

// =============================================================================
// BEST PRACTICES
// =============================================================================

function compileBestPractices(): string[] {
  return [
    'Start communication early - before submitting planning application',
    'Be honest about the nature and impact of proposed works',
    'Listen to concerns and show you have considered them',
    'Provide your contact details and be responsive',
    'Keep detailed records of all communications',
    'Follow through on commitments made',
    'Respect working hours and site boundaries',
    'Maintain a clean and tidy site',
    'Address complaints promptly and fairly',
    'Thank neighbors for their patience',
    'Consider a small gesture on completion (bottle of wine, flowers)',
    'Maintain the relationship after works complete'
  ];
}

// =============================================================================
// LEGAL CONSIDERATIONS
// =============================================================================

function identifyLegalConsiderations(projectDetails: NeighborProject): string[] {
  const considerations = [
    'Party Wall etc. Act 1996 - formal notice required for certain works',
    'Right to Light - common law right that can be protected by injunction',
    'Private nuisance - excessive noise/dust can be actionable',
    'Trespass - must not enter neighbor property without permission',
    'Data protection - handle contact information appropriately'
  ];

  if (projectDetails.hasPartyWall || projectDetails.projectType === 'basement') {
    considerations.push(
      'Party wall surveyor appointment may be required',
      'Schedule of condition recommended before works',
      'Party wall award is legally binding'
    );
  }

  return considerations;
}

// =============================================================================
// EXPORTS
// =============================================================================

const neighborConsultation = {
  generateNeighborConsultation
};

export default neighborConsultation;
