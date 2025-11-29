/**
 * Planning Committee Service
 * 
 * Comprehensive guidance on planning committee processes, procedures,
 * speaking at committee meetings, and understanding decision-making.
 * Covers committee structure, delegated decisions, member interests.
 * 
 * @module services/planning-committee
 */

// Committee meeting types
const COMMITTEE_TYPES: Record<string, {
  name: string;
  description: string;
  frequency: string;
  typicalAttendees: string[];
  decisionMaking: string;
}> = {
  'main_planning': {
    name: 'Planning Committee',
    description: 'Main committee determining major and controversial applications',
    frequency: 'Monthly or bi-weekly',
    typicalAttendees: ['Elected councillors', 'Planning officers', 'Applicants', 'Objectors', 'Public'],
    decisionMaking: 'Majority vote of attending members'
  },
  'area_sub': {
    name: 'Area Planning Sub-Committee',
    description: 'Local committee for area-specific applications',
    frequency: 'Monthly',
    typicalAttendees: ['Local ward councillors', 'Planning officers', 'Local residents'],
    decisionMaking: 'Majority vote with possible referral to main committee'
  },
  'strategic': {
    name: 'Strategic Development Committee',
    description: 'Committee for large-scale strategic developments',
    frequency: 'As required',
    typicalAttendees: ['Senior councillors', 'Planning policy officers', 'Major developers'],
    decisionMaking: 'Majority vote with possible call-in by Secretary of State'
  },
  'enforcement': {
    name: 'Enforcement Sub-Committee',
    description: 'Committee dealing with enforcement matters',
    frequency: 'Quarterly or as needed',
    typicalAttendees: ['Councillors', 'Enforcement officers', 'Legal advisors'],
    decisionMaking: 'Recommendations to main committee or delegated authority'
  }
};

// Decision routes
const DECISION_ROUTES: Record<string, {
  route: string;
  description: string;
  criteria: string[];
  timeline: string;
  appealable: boolean;
}> = {
  'delegated': {
    route: 'Delegated Decision',
    description: 'Decision made by planning officers under delegated authority',
    criteria: [
      'Householder applications',
      'Minor developments',
      'No significant objections',
      'Accords with policy'
    ],
    timeline: '8 weeks for minor, 13 weeks for major',
    appealable: true
  },
  'committee': {
    route: 'Committee Decision',
    description: 'Decision made by elected councillors at committee meeting',
    criteria: [
      'Major applications',
      'Departure from policy',
      'Significant public interest',
      'Called in by councillor',
      'Controversial proposals'
    ],
    timeline: 'Variable - depends on committee schedule',
    appealable: true
  },
  'call_in': {
    route: 'Call-In by Member',
    description: 'Application referred to committee by ward councillor',
    criteria: [
      'Valid planning reasons',
      'Local concern',
      'Material considerations',
      'Request within deadline'
    ],
    timeline: 'Extended to next available committee',
    appealable: true
  },
  'secretary_state': {
    route: 'Secretary of State Call-In',
    description: 'Application called in for ministerial decision',
    criteria: [
      'National significance',
      'Green belt implications',
      'Cross-boundary issues',
      'Controversial policy matters'
    ],
    timeline: 'Significantly extended - often years',
    appealable: false
  }
};

// Speaking guidance
const SPEAKING_GUIDANCE: Record<string, {
  speaker: string;
  allocation: string;
  tips: string[];
  restrictions: string[];
}> = {
  'objector': {
    speaker: 'Objector/Supporter',
    allocation: '3-5 minutes (varies by council)',
    tips: [
      'Focus on material planning considerations only',
      'Prepare concise points - rehearse timing',
      'Bring written notes for reference',
      'Address the committee, not the applicant',
      'Be respectful and factual',
      'Summarize key issues clearly'
    ],
    restrictions: [
      'No personal attacks',
      'No irrelevant matters (property values, competition)',
      'No repetition of written submissions',
      'Must register to speak in advance'
    ]
  },
  'applicant': {
    speaker: 'Applicant/Agent',
    allocation: '3-5 minutes (varies by council)',
    tips: [
      'Address officer concerns and objections',
      'Highlight benefits of the scheme',
      'Confirm any amendments or conditions accepted',
      'Demonstrate policy compliance',
      'Be prepared for questions'
    ],
    restrictions: [
      'No new information not in application',
      'Must register to speak in advance',
      'Response time may be limited'
    ]
  },
  'ward_councillor': {
    speaker: 'Ward Councillor',
    allocation: '5-10 minutes',
    tips: [
      'Represent local views',
      'Highlight local impacts',
      'Request specific conditions if supporting approval',
      'Can ask questions of officers'
    ],
    restrictions: [
      'Cannot vote if declared interest',
      'Should declare any predetermination'
    ]
  },
  'parish_council': {
    speaker: 'Parish/Town Council',
    allocation: '3-5 minutes',
    tips: [
      'Present formal parish council position',
      'Highlight local plan considerations',
      'Reference neighbourhood plan policies'
    ],
    restrictions: [
      'Must represent official council view',
      'Speaking rights vary by authority'
    ]
  }
};

// Material considerations for committees
const MATERIAL_CONSIDERATIONS: Record<string, {
  category: string;
  considerations: string[];
  weight: string;
}> = {
  'policy': {
    category: 'Planning Policy',
    considerations: [
      'Local Plan policies',
      'National Planning Policy Framework',
      'Neighbourhood Plan policies',
      'Supplementary Planning Documents',
      'Conservation Area appraisals'
    ],
    weight: 'Significant - primary consideration'
  },
  'design': {
    category: 'Design and Character',
    considerations: [
      'Scale, height, massing',
      'Design quality and materials',
      'Impact on street scene',
      'Conservation area character',
      'Listed building setting'
    ],
    weight: 'Significant in heritage areas'
  },
  'amenity': {
    category: 'Residential Amenity',
    considerations: [
      'Overlooking and privacy',
      'Loss of light/daylight',
      'Overbearing impact',
      'Noise and disturbance',
      'Outlook'
    ],
    weight: 'Significant for residential areas'
  },
  'highways': {
    category: 'Transport and Highways',
    considerations: [
      'Parking provision',
      'Traffic generation',
      'Highway safety',
      'Pedestrian access',
      'Cycle provision'
    ],
    weight: 'Moderate to significant'
  },
  'environment': {
    category: 'Environmental',
    considerations: [
      'Trees and landscaping',
      'Biodiversity',
      'Drainage and flooding',
      'Contamination',
      'Air quality'
    ],
    weight: 'Variable by site'
  }
};

// Non-material considerations
const NON_MATERIAL_CONSIDERATIONS: string[] = [
  'Impact on property values',
  'Competition between businesses',
  'Private covenants or restrictions',
  'Land ownership disputes',
  'Personal circumstances of applicant',
  'Moral objections',
  'Fear of crime (unless evidence-based)',
  'Loss of view (unless exceptional)',
  'Construction disruption',
  'Previous refusals on different grounds'
];

// Camden-specific committee information
const CAMDEN_COMMITTEE_INFO = {
  committees: [
    {
      name: 'Planning Committee',
      description: 'Main planning committee for major applications',
      meetingDay: 'Thursday evenings',
      frequency: 'Monthly',
      location: 'Camden Town Hall'
    },
    {
      name: 'Planning Sub-Committee A',
      description: 'Area sub-committee for certain wards',
      meetingDay: 'Monday evenings',
      frequency: 'Monthly',
      location: 'Camden Town Hall'
    },
    {
      name: 'Planning Sub-Committee B',
      description: 'Area sub-committee for remaining wards',
      meetingDay: 'Tuesday evenings',
      frequency: 'Monthly',
      location: 'Camden Town Hall'
    }
  ],
  speakingProcedure: {
    registrationDeadline: '2 working days before meeting',
    registrationMethod: 'Online form or email to Planning',
    timeAllocation: '3 minutes per speaker',
    maximumSpeakers: '2 objectors and 2 supporters per application'
  },
  delegatedDecisions: {
    percentage: 'Approximately 90% of applications',
    scheme: 'Camden Scheme of Delegation',
    callInPeriod: '21 days from notification'
  }
};

// Types
export interface CommitteeRequest {
  address: string;
  postcode: string;
  applicationType?: string;
  applicationReference?: string;
  isObjector?: boolean;
  isApplicant?: boolean;
  committeeDate?: string;
  concernedAbout?: string[];
}

export interface CommitteeGuidance {
  address: string;
  postcode: string;
  timestamp: string;
  decisionRoute: {
    likelyRoute: string;
    routeDescription: string;
    criteria: string[];
    canCallIn: boolean;
    callInDeadline: string;
  };
  committeeInfo: {
    relevantCommittee: string;
    meetingSchedule: string;
    nextMeeting: string;
    howToAttend: string[];
  };
  speakingGuidance: {
    canSpeak: boolean;
    timeAllocation: string;
    registrationProcess: string[];
    tips: string[];
    restrictions: string[];
  };
  materialConsiderations: Array<{
    category: string;
    considerations: string[];
    relevance: string;
  }>;
  nonMaterialMatters: string[];
  processTimeline: Array<{
    stage: string;
    timing: string;
    action: string;
  }>;
  preparationChecklist: string[];
  questionsToExpect: string[];
  influencingFactors: Array<{
    factor: string;
    impact: string;
    advice: string;
  }>;
  localContext: {
    camdenSpecific: boolean;
    committees: Array<{
      name: string;
      description: string;
    }>;
    speakingRules: {
      registration: string;
      timeLimit: string;
    };
  };
  metadata: {
    guidance: string;
    source: string;
    disclaimer: string;
  };
}

/**
 * Planning Committee Service
 */
class PlanningCommitteeService {
  /**
   * Get comprehensive committee guidance
   */
  async getCommitteeGuidance(request: CommitteeRequest): Promise<CommitteeGuidance> {
    const decisionRoute = this.determineDecisionRoute(request);
    const committeeInfo = this.getCommitteeInfo(request);
    const speakingGuidance = this.getSpeakingGuidance(request);
    const materialConsiderations = this.getMaterialConsiderations(request);
    const timeline = this.getProcessTimeline(request);
    const preparationChecklist = this.getPreparationChecklist(request);
    const questionsToExpect = this.getQuestionsToExpect(request);
    const influencingFactors = this.getInfluencingFactors(request);
    const localContext = this.getLocalContext(request);

    return {
      address: request.address,
      postcode: request.postcode,
      timestamp: new Date().toISOString(),
      decisionRoute,
      committeeInfo,
      speakingGuidance,
      materialConsiderations,
      nonMaterialMatters: NON_MATERIAL_CONSIDERATIONS,
      processTimeline: timeline,
      preparationChecklist,
      questionsToExpect,
      influencingFactors,
      localContext,
      metadata: {
        guidance: 'Planning Committee Guidance',
        source: 'Camden Council Planning Committee Procedures',
        disclaimer: 'This guidance is for information only. Committee procedures may vary.'
      }
    };
  }

  /**
   * Determine likely decision route
   */
  private determineDecisionRoute(request: CommitteeRequest): CommitteeGuidance['decisionRoute'] {
    // Default to delegated unless triggers for committee
    let likelyRoute = 'delegated';
    
    const appType = request.applicationType?.toLowerCase() || '';
    
    if (appType.includes('major') || appType.includes('strategic')) {
      likelyRoute = 'committee';
    }
    
    const routeInfo = DECISION_ROUTES[likelyRoute];
    
    // Safe extraction with defaults
    const routeDescription = routeInfo?.description || 'Decision route to be determined';
    const criteria = routeInfo?.criteria || [];
    
    return {
      likelyRoute: routeInfo?.route || 'Delegated Decision',
      routeDescription,
      criteria,
      canCallIn: true,
      callInDeadline: '21 days from neighbour notification'
    };
  }

  /**
   * Get committee information
   */
  private getCommitteeInfo(request: CommitteeRequest): CommitteeGuidance['committeeInfo'] {
    const postcode = request.postcode.toUpperCase();
    
    // Determine relevant committee based on area
    let relevantCommittee = 'Planning Sub-Committee';
    if (postcode.startsWith('NW3') || postcode.startsWith('NW6')) {
      relevantCommittee = 'Planning Sub-Committee B';
    } else if (postcode.startsWith('NW1') || postcode.startsWith('NW5')) {
      relevantCommittee = 'Planning Sub-Committee A';
    }
    
    return {
      relevantCommittee,
      meetingSchedule: 'Monthly, typically evening sessions',
      nextMeeting: 'Check Camden Council website for current schedule',
      howToAttend: [
        'Meetings are open to the public',
        'No booking required to observe',
        'Register to speak if you wish to address committee',
        'Arrive early to secure seating',
        'Webcast available for remote viewing'
      ]
    };
  }

  /**
   * Get speaking guidance
   */
  private getSpeakingGuidance(request: CommitteeRequest): CommitteeGuidance['speakingGuidance'] {
    let speakerType = 'objector';
    if (request.isApplicant) {
      speakerType = 'applicant';
    }
    
    const guidance = SPEAKING_GUIDANCE[speakerType];
    
    // Safe extraction with defaults
    const tips = guidance?.tips || [];
    const restrictions = guidance?.restrictions || [];
    
    return {
      canSpeak: true,
      timeAllocation: guidance?.allocation || '3 minutes',
      registrationProcess: [
        'Register to speak at least 2 working days before the meeting',
        'Complete the online registration form on Camden Council website',
        'Provide your name, address, and the application reference',
        'Indicate whether you are supporting or objecting',
        'Confirmation will be sent by email',
        'Arrive at least 15 minutes before the meeting'
      ],
      tips,
      restrictions
    };
  }

  /**
   * Get material considerations
   */
  private getMaterialConsiderations(request: CommitteeRequest): CommitteeGuidance['materialConsiderations'] {
    const considerations: CommitteeGuidance['materialConsiderations'] = [];
    const concerns = request.concernedAbout || [];
    
    // Add relevant material considerations
    for (const [key, value] of Object.entries(MATERIAL_CONSIDERATIONS)) {
      let relevance = 'Standard consideration';
      
      if (concerns.some(c => c.toLowerCase().includes(key))) {
        relevance = 'Directly relevant to your concerns';
      }
      
      considerations.push({
        category: value.category,
        considerations: value.considerations,
        relevance
      });
    }
    
    return considerations;
  }

  /**
   * Get process timeline
   */
  private getProcessTimeline(request: CommitteeRequest): CommitteeGuidance['processTimeline'] {
    return [
      {
        stage: 'Application Submission',
        timing: 'Day 1',
        action: 'Application registered and validated'
      },
      {
        stage: 'Consultation Period',
        timing: 'Weeks 1-3',
        action: 'Neighbours notified, representations received'
      },
      {
        stage: 'Officer Assessment',
        timing: 'Weeks 3-6',
        action: 'Planning officer reviews application and responses'
      },
      {
        stage: 'Committee Agenda Published',
        timing: '1 week before meeting',
        action: 'Officer report and recommendation published'
      },
      {
        stage: 'Speaking Registration Deadline',
        timing: '2 working days before',
        action: 'Register to speak at committee'
      },
      {
        stage: 'Committee Meeting',
        timing: 'Meeting date',
        action: 'Application presented, speakers heard, decision made'
      },
      {
        stage: 'Decision Notice',
        timing: 'Within days of meeting',
        action: 'Formal decision notice issued'
      }
    ];
  }

  /**
   * Get preparation checklist
   */
  private getPreparationChecklist(request: CommitteeRequest): string[] {
    const checklist = [
      'Read the full officer report when published',
      'Note the officer recommendation (approve/refuse)',
      'Identify the key issues mentioned in the report',
      'Prepare your speaking points (max 3 minutes)',
      'Focus on material planning considerations only',
      'Practice your presentation to time',
      'Prepare written notes to bring with you',
      'Register to speak before the deadline'
    ];
    
    if (request.isObjector) {
      checklist.push(
        'Identify which policy conflicts with the proposal',
        'Gather evidence of any harm claimed',
        'Consider coordinating with other objectors',
        'Prepare for potential questions from members'
      );
    }
    
    if (request.isApplicant) {
      checklist.push(
        'Prepare responses to objection points',
        'Consider offering conditions or amendments',
        'Have your agent/architect available',
        'Bring any supporting visual materials'
      );
    }
    
    return checklist;
  }

  /**
   * Get questions to expect
   */
  private getQuestionsToExpect(request: CommitteeRequest): string[] {
    return [
      'Can you summarize your main concern/support in one sentence?',
      'Are you aware of the officer recommendation?',
      'What specific policy do you believe is breached/supported?',
      'Have you seen the proposed conditions?',
      'Would you support the application with conditions?',
      'What would address your concerns?',
      'Are there precedents you are aware of?',
      'Have you been in contact with the applicant/neighbours?'
    ];
  }

  /**
   * Get influencing factors
   */
  private getInfluencingFactors(request: CommitteeRequest): CommitteeGuidance['influencingFactors'] {
    return [
      {
        factor: 'Officer Recommendation',
        impact: 'High - members often follow officer advice',
        advice: 'Understand why the officer has recommended approval/refusal'
      },
      {
        factor: 'Policy Compliance',
        impact: 'High - departures from policy require strong justification',
        advice: 'Reference specific policies that support your position'
      },
      {
        factor: 'Number of Objections',
        impact: 'Moderate - quality matters more than quantity',
        advice: 'Ensure objections raise material planning issues'
      },
      {
        factor: 'Ward Councillor Views',
        impact: 'Moderate - can influence call-in and debate',
        advice: 'Contact your ward councillor early to discuss concerns'
      },
      {
        factor: 'Heritage Status',
        impact: 'High in Hampstead - conservation carries significant weight',
        advice: 'Emphasize heritage impacts where relevant'
      },
      {
        factor: 'Planning History',
        impact: 'Moderate - previous decisions are relevant',
        advice: 'Research any relevant planning history for the site'
      }
    ];
  }

  /**
   * Get local context
   */
  private getLocalContext(request: CommitteeRequest): CommitteeGuidance['localContext'] {
    return {
      camdenSpecific: true,
      committees: CAMDEN_COMMITTEE_INFO.committees.map(c => ({
        name: c.name,
        description: c.description
      })),
      speakingRules: {
        registration: CAMDEN_COMMITTEE_INFO.speakingProcedure.registrationDeadline,
        timeLimit: CAMDEN_COMMITTEE_INFO.speakingProcedure.timeAllocation
      }
    };
  }

  /**
   * Get committee types information
   */
  async getCommitteeTypes(): Promise<typeof COMMITTEE_TYPES> {
    return COMMITTEE_TYPES;
  }

  /**
   * Get decision routes information
   */
  async getDecisionRoutes(): Promise<typeof DECISION_ROUTES> {
    return DECISION_ROUTES;
  }

  /**
   * Get material vs non-material considerations
   */
  async getConsiderationsGuide(): Promise<{
    material: typeof MATERIAL_CONSIDERATIONS;
    nonMaterial: string[];
  }> {
    return {
      material: MATERIAL_CONSIDERATIONS,
      nonMaterial: NON_MATERIAL_CONSIDERATIONS
    };
  }
}

// Export singleton instance
const planningCommitteeService = new PlanningCommitteeService();
export default planningCommitteeService;
