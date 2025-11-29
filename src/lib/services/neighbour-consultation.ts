/**
 * Neighbour Consultation Service
 * 
 * Guidance on planning consultation, neighbour notification, and 
 * how to effectively respond to or comment on planning applications
 */

// Consultation Types
const CONSULTATION_TYPES: Record<string, {
  name: string;
  description: string;
  notificationMethod: string[];
  consultationPeriod: number; // days
  whoIsNotified: string[];
}> = {
  'neighbour_notification': {
    name: 'Neighbour Notification',
    description: 'Direct notification to adjoining owners/occupiers',
    notificationMethod: ['Letter to affected addresses'],
    consultationPeriod: 21,
    whoIsNotified: [
      'Adjoining properties sharing a boundary',
      'Properties directly opposite',
      'Properties that may be affected by the development'
    ]
  },
  'site_notice': {
    name: 'Site Notice',
    description: 'Notice displayed on or near the site',
    notificationMethod: ['Yellow notice posted on site'],
    consultationPeriod: 21,
    whoIsNotified: [
      'General public passing the site',
      'Required for all major applications',
      'Used when neighbour letters impractical'
    ]
  },
  'press_notice': {
    name: 'Press Notice',
    description: 'Notice in local newspaper',
    notificationMethod: ['Advertisement in local press'],
    consultationPeriod: 21,
    whoIsNotified: [
      'General public',
      'Required for listed buildings',
      'Required for conservation areas',
      'Required for major developments'
    ]
  }
};

// What makes a valid objection
const VALID_OBJECTION_GROUNDS = [
  {
    ground: 'Loss of light',
    description: 'Significant reduction in daylight or sunlight to your property',
    howToArgue: [
      'Describe which rooms are affected',
      'Explain current light levels',
      'Provide photos if possible',
      'Reference BRE guidelines if available'
    ],
    effectiveness: 'Strong if demonstrable'
  },
  {
    ground: 'Loss of privacy',
    description: 'Overlooking from new windows or raised areas',
    howToArgue: [
      'Identify specific windows causing concern',
      'Explain what areas would be overlooked',
      'Note distance and angle',
      'Request obscure glazing or repositioning'
    ],
    effectiveness: 'Strong for habitable room windows'
  },
  {
    ground: 'Overbearing impact',
    description: 'Development appears oppressive or dominant',
    howToArgue: [
      'Describe proximity to boundary',
      'Note height and bulk of development',
      'Explain sense of enclosure created'
    ],
    effectiveness: 'Moderate - subjective'
  },
  {
    ground: 'Impact on character',
    description: 'Development harms character of area',
    howToArgue: [
      'Reference local design character',
      'Note how proposal differs from surroundings',
      'Cite conservation area appraisal if applicable'
    ],
    effectiveness: 'Strong in conservation areas'
  },
  {
    ground: 'Highway safety',
    description: 'Concerns about access, parking, traffic',
    howToArgue: [
      'Describe specific safety concerns',
      'Note existing traffic issues',
      'Identify visibility problems'
    ],
    effectiveness: 'Strong if demonstrable hazard'
  },
  {
    ground: 'Heritage impact',
    description: 'Harm to listed building or conservation area',
    howToArgue: [
      'Reference significance of heritage asset',
      'Explain specific harm caused',
      'Cite heritage policies'
    ],
    effectiveness: 'Strong for designated assets'
  },
  {
    ground: 'Noise and disturbance',
    description: 'Increased noise from development or use',
    howToArgue: [
      'Describe nature of noise',
      'Note proximity to sensitive uses',
      'Suggest conditions if approval likely'
    ],
    effectiveness: 'Moderate - conditions often applied'
  },
  {
    ground: 'Trees and ecology',
    description: 'Impact on protected trees or wildlife',
    howToArgue: [
      'Identify specific trees affected',
      'Note any TPOs',
      'Describe wildlife value'
    ],
    effectiveness: 'Strong for protected trees'
  }
];

// What is NOT a valid planning objection
const INVALID_OBJECTION_GROUNDS = [
  {
    issue: 'Loss of view',
    reason: 'No legal right to a view over private land'
  },
  {
    issue: 'Property value',
    reason: 'Financial impact on property values is not a planning matter'
  },
  {
    issue: 'Construction disruption',
    reason: 'Temporary construction impacts are not planning matters'
  },
  {
    issue: 'Competition to business',
    reason: 'Commercial competition is not a planning consideration'
  },
  {
    issue: 'Private rights (covenants)',
    reason: 'Private legal matters separate from planning'
  },
  {
    issue: 'Personal circumstances of applicant',
    reason: 'Generally not relevant to planning merits'
  },
  {
    issue: 'Boundary disputes',
    reason: 'Civil matter between neighbours'
  },
  {
    issue: 'Building regulations',
    reason: 'Separate regulatory system'
  }
];

// How to write effective comments
const WRITING_GUIDANCE = {
  do: [
    'Be specific about your concerns',
    'Reference relevant planning policies',
    'Focus on planning matters only',
    'Suggest modifications that would address concerns',
    'Provide evidence where possible',
    'Be respectful and professional',
    'Meet the deadline for comments',
    'Include your address',
    'Comment on each issue separately'
  ],
  dont: [
    'Make personal attacks on applicant',
    'Raise non-planning matters',
    'Submit multiple identical comments',
    'Use threatening language',
    'Focus only on what you will lose',
    'Miss the deadline',
    'Assume officer will know your concerns'
  ]
};

// Committee process
const COMMITTEE_PROCESS = {
  eligibility: [
    'Applications called in by councillors',
    'Applications with significant objections',
    'Applications departing from policy',
    'Major applications',
    'Applications involving council land'
  ],
  speakingRights: [
    {
      speaker: 'Objectors',
      time: '3 minutes',
      notes: 'Usually limited to one speaker per group'
    },
    {
      speaker: 'Supporters/Applicant',
      time: '3 minutes',
      notes: 'Applicant or agent can speak'
    },
    {
      speaker: 'Ward Councillor',
      time: '5 minutes',
      notes: 'Local councillor can represent constituents'
    }
  ],
  tips: [
    'Register to speak in advance (usually 48 hours)',
    'Prepare written notes to stay within time',
    'Focus on key planning issues only',
    'Bring photos or visual aids if helpful',
    'Coordinate with other objectors',
    'Be clear about what outcome you seek',
    'Listen to officer presentation first'
  ]
};

// Timelines
const CONSULTATION_TIMELINES = {
  standardApplication: {
    consultationPeriod: '21 days',
    determinationTarget: '8 weeks',
    extensionPossible: 'Yes, with agreement'
  },
  majorApplication: {
    consultationPeriod: '21 days',
    determinationTarget: '13 weeks',
    extensionPossible: 'Yes, common for complex schemes'
  },
  listedBuilding: {
    consultationPeriod: '21 days',
    determinationTarget: '8 weeks',
    extensionPossible: 'Yes'
  }
};

interface ConsultationRequest {
  address: string;
  applicationReference?: string;
  applicationType?: string;
  proposalDescription: string;
  concernType: 'neighbour_affected' | 'making_objection' | 'making_application' | 'general_info';
  specificConcerns?: string[];
  isConservationArea?: boolean;
  involveListedBuilding?: boolean;
  numberOfObjectors?: number;
}

interface ConsultationAssessment {
  address: string;
  consultationType: {
    methods: Array<{
      method: string;
      description: string;
      period: number;
    }>;
    expectedNotification: string[];
  };
  forObjectors?: {
    validGrounds: Array<{
      ground: string;
      howToArgue: string[];
      effectiveness: string;
    }>;
    invalidGrounds: Array<{
      issue: string;
      reason: string;
    }>;
    writingGuidance: {
      do: string[];
      dont: string[];
    };
    committeeInfo: {
      eligibility: string[];
      speakingRights: typeof COMMITTEE_PROCESS.speakingRights;
      tips: string[];
    };
    deadline: string;
    templateStructure: string[];
  };
  forApplicants?: {
    consultationRequirements: string[];
    tips: string[];
    dealingWithObjections: string[];
  };
  timeline: typeof CONSULTATION_TIMELINES[keyof typeof CONSULTATION_TIMELINES];
  recommendations: string[];
  confidenceLevel: string;
}

class NeighbourConsultationService {
  /**
   * Generate consultation guidance
   */
  public generateConsultationGuidance(request: ConsultationRequest): ConsultationAssessment {
    const consultationType = this.determineConsultationType(request);
    const timeline = this.getTimeline(request);
    
    const assessment: ConsultationAssessment = {
      address: request.address,
      consultationType,
      timeline,
      recommendations: this.generateRecommendations(request),
      confidenceLevel: 'HIGH'
    };
    
    // Add objector-specific information
    if (request.concernType === 'neighbour_affected' || request.concernType === 'making_objection') {
      assessment.forObjectors = this.getObjectorGuidance(request);
    }
    
    // Add applicant-specific information
    if (request.concernType === 'making_application') {
      assessment.forApplicants = this.getApplicantGuidance(request);
    }
    
    return assessment;
  }

  /**
   * Determine consultation type required
   */
  private determineConsultationType(request: ConsultationRequest): {
    methods: Array<{
      method: string;
      description: string;
      period: number;
    }>;
    expectedNotification: string[];
  } {
    const methods: Array<{
      method: string;
      description: string;
      period: number;
    }> = [];
    
    // Neighbour notification always required
    const neighbourNotif = CONSULTATION_TYPES['neighbour_notification'];
    if (neighbourNotif) {
      methods.push({
        method: neighbourNotif.name,
        description: neighbourNotif.description,
        period: neighbourNotif.consultationPeriod
      });
    }
    
    // Site notice for most applications
    const siteNotice = CONSULTATION_TYPES['site_notice'];
    if (siteNotice) {
      methods.push({
        method: siteNotice.name,
        description: siteNotice.description,
        period: siteNotice.consultationPeriod
      });
    }
    
    // Press notice for heritage/major
    if (request.isConservationArea || request.involveListedBuilding || 
        request.applicationType?.toLowerCase().includes('major')) {
      const pressNotice = CONSULTATION_TYPES['press_notice'];
      if (pressNotice) {
        methods.push({
          method: pressNotice.name,
          description: pressNotice.description,
          period: pressNotice.consultationPeriod
        });
      }
    }
    
    const expectedNotification: string[] = [
      'Letter to your address if you share a boundary or are directly affected',
      'Site notice on or near the application site',
      'Application visible on council planning portal'
    ];
    
    if (request.isConservationArea || request.involveListedBuilding) {
      expectedNotification.push('Notice in local newspaper');
    }
    
    return {
      methods,
      expectedNotification
    };
  }

  /**
   * Get timeline information
   */
  private getTimeline(
    request: ConsultationRequest
  ): typeof CONSULTATION_TIMELINES[keyof typeof CONSULTATION_TIMELINES] {
    if (request.applicationType?.toLowerCase().includes('major')) {
      return CONSULTATION_TIMELINES.majorApplication;
    }
    
    if (request.involveListedBuilding) {
      return CONSULTATION_TIMELINES.listedBuilding;
    }
    
    return CONSULTATION_TIMELINES.standardApplication;
  }

  /**
   * Get guidance for objectors
   */
  private getObjectorGuidance(request: ConsultationRequest): {
    validGrounds: Array<{
      ground: string;
      howToArgue: string[];
      effectiveness: string;
    }>;
    invalidGrounds: Array<{
      issue: string;
      reason: string;
    }>;
    writingGuidance: {
      do: string[];
      dont: string[];
    };
    committeeInfo: {
      eligibility: string[];
      speakingRights: typeof COMMITTEE_PROCESS.speakingRights;
      tips: string[];
    };
    deadline: string;
    templateStructure: string[];
  } {
    // Filter relevant grounds based on concerns
    let relevantGrounds = VALID_OBJECTION_GROUNDS;
    
    if (request.specificConcerns && request.specificConcerns.length > 0) {
      relevantGrounds = VALID_OBJECTION_GROUNDS.filter(ground => {
        const groundLower = ground.ground.toLowerCase();
        return request.specificConcerns?.some(concern => 
          concern.toLowerCase().includes(groundLower) ||
          groundLower.includes(concern.toLowerCase())
        );
      });
      
      // If no specific matches, return all
      if (relevantGrounds.length === 0) {
        relevantGrounds = VALID_OBJECTION_GROUNDS;
      }
    }
    
    return {
      validGrounds: relevantGrounds.map(g => ({
        ground: g.ground,
        howToArgue: g.howToArgue,
        effectiveness: g.effectiveness
      })),
      invalidGrounds: INVALID_OBJECTION_GROUNDS,
      writingGuidance: WRITING_GUIDANCE,
      committeeInfo: {
        eligibility: COMMITTEE_PROCESS.eligibility,
        speakingRights: COMMITTEE_PROCESS.speakingRights,
        tips: COMMITTEE_PROCESS.tips
      },
      deadline: '21 days from notification letter date',
      templateStructure: [
        '1. Your name and address',
        '2. Application reference number',
        '3. Statement that you object to the application',
        '4. Specific planning concerns (one paragraph each)',
        '5. Reference to relevant policies (if known)',
        '6. Suggested modifications or conditions',
        '7. Request to be notified of decision'
      ]
    };
  }

  /**
   * Get guidance for applicants
   */
  private getApplicantGuidance(request: ConsultationRequest): {
    consultationRequirements: string[];
    tips: string[];
    dealingWithObjections: string[];
  } {
    const consultationRequirements = [
      'Council will notify adjoining neighbours',
      'Site notice will be posted',
      '21 day consultation period applies'
    ];
    
    if (request.isConservationArea) {
      consultationRequirements.push('Press notice in local newspaper required');
      consultationRequirements.push('Camden Conservation Advisory Committee may comment');
    }
    
    if (request.involveListedBuilding) {
      consultationRequirements.push('Amenity societies will be consulted');
      consultationRequirements.push('Historic England may be consulted for Grade I/II*');
    }
    
    const tips = [
      'Consider engaging with neighbours before submitting',
      'Explain your proposal to reduce concerns',
      'Be prepared to make minor amendments',
      'Keep records of any pre-application engagement',
      'Respond constructively to any concerns raised',
      'Attend committee if application called in'
    ];
    
    const dealingWithObjections = [
      'Read all objections carefully',
      'Identify genuine planning concerns',
      'Consider whether amendments could address concerns',
      'Discuss with officer if significant objections',
      'Prepare response to planning matters raised',
      'Be respectful of neighbours throughout process'
    ];
    
    return {
      consultationRequirements,
      tips,
      dealingWithObjections
    };
  }

  /**
   * Generate recommendations
   */
  private generateRecommendations(request: ConsultationRequest): string[] {
    const recommendations: string[] = [];
    
    if (request.concernType === 'neighbour_affected' || request.concernType === 'making_objection') {
      recommendations.push('View the full application on the council planning portal');
      recommendations.push('Submit comments before the deadline');
      recommendations.push('Focus on valid planning matters only');
      recommendations.push('Be specific and provide evidence where possible');
      recommendations.push('Request to speak at committee if application likely to be referred');
      
      if (request.numberOfObjectors && request.numberOfObjectors > 5) {
        recommendations.push('Consider coordinating with other objectors');
        recommendations.push('Nominate one spokesperson for committee');
      }
    }
    
    if (request.concernType === 'making_application') {
      recommendations.push('Consider pre-application engagement with neighbours');
      recommendations.push('Be prepared for consultation period');
      recommendations.push('Respond constructively to concerns raised');
    }
    
    return recommendations;
  }

  /**
   * Get valid objection grounds
   */
  public getValidObjectionGrounds(): typeof VALID_OBJECTION_GROUNDS {
    return VALID_OBJECTION_GROUNDS;
  }

  /**
   * Get invalid objection grounds
   */
  public getInvalidObjectionGrounds(): typeof INVALID_OBJECTION_GROUNDS {
    return INVALID_OBJECTION_GROUNDS;
  }

  /**
   * Get writing guidance
   */
  public getWritingGuidance(): typeof WRITING_GUIDANCE {
    return WRITING_GUIDANCE;
  }

  /**
   * Get committee process info
   */
  public getCommitteeProcessInfo(): typeof COMMITTEE_PROCESS {
    return COMMITTEE_PROCESS;
  }

  /**
   * Get consultation timelines
   */
  public getConsultationTimelines(): typeof CONSULTATION_TIMELINES {
    return CONSULTATION_TIMELINES;
  }

  /**
   * Generate objection letter template
   */
  public generateObjectionTemplate(
    applicantAddress: string,
    applicationRef: string,
    concerns: string[]
  ): string {
    let template = `[Your Name]
[Your Address]
[Your Postcode]
[Date]

Planning Department
London Borough of Camden
5 Pancras Square
London N1C 4AG

Re: Planning Application ${applicationRef}
Site Address: ${applicantAddress}

Dear Sir/Madam,

I am writing to object to the above planning application.

`;

    concerns.forEach((concern, index) => {
      template += `${index + 1}. ${concern}\n\n`;
    });

    template += `I would be grateful if you could take these concerns into account when determining this application. Please notify me of the decision.

Yours faithfully,

[Your Signature]
[Your Name]`;

    return template;
  }
}

export default NeighbourConsultationService;
