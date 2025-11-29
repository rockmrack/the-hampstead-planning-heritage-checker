/**
 * Community Engagement Service
 * 
 * Comprehensive guidance on community engagement strategies for planning
 * applications, stakeholder mapping, consultation approaches, and
 * building support for development proposals.
 * 
 * @module services/community-engagement
 */

// Engagement methods
const ENGAGEMENT_METHODS: Record<string, {
  method: string;
  description: string;
  suitableFor: string[];
  advantages: string[];
  disadvantages: string[];
  timing: string;
  costLevel: string;
}> = {
  'public_exhibition': {
    method: 'Public Exhibition',
    description: 'Staffed display of proposals at local venue',
    suitableFor: ['Major developments', 'Schemes with visual impact', 'New build projects'],
    advantages: [
      'Face-to-face explanation opportunity',
      'Can respond to concerns immediately',
      'Visual materials help understanding',
      'Demonstrates commitment to engagement'
    ],
    disadvantages: [
      'Time and cost intensive',
      'Limited attendance possible',
      'Can attract organized opposition',
      'Needs careful venue selection'
    ],
    timing: 'Pre-application stage',
    costLevel: 'Medium to high'
  },
  'leaflet_drop': {
    method: 'Leaflet Drop',
    description: 'Information leaflet delivered to local addresses',
    suitableFor: ['All development types', 'Initial awareness raising'],
    advantages: [
      'Wide reach',
      'Relatively low cost',
      'Permanent record',
      'Can include response mechanism'
    ],
    disadvantages: [
      'One-way communication',
      'May be ignored',
      'Limited information capacity',
      'No immediate dialogue'
    ],
    timing: 'Early pre-application',
    costLevel: 'Low to medium'
  },
  'website': {
    method: 'Project Website',
    description: 'Dedicated website with project information and feedback forms',
    suitableFor: ['Major developments', 'Long-term projects'],
    advantages: [
      'Available 24/7',
      'Can host detailed information',
      'Easy to update',
      'Can track engagement'
    ],
    disadvantages: [
      'Digital divide excludes some',
      'Requires promotion',
      'Setup costs',
      'Needs maintenance'
    ],
    timing: 'Throughout process',
    costLevel: 'Medium'
  },
  'stakeholder_meeting': {
    method: 'Stakeholder Meetings',
    description: 'Targeted meetings with key local groups',
    suitableFor: ['All developments', 'Addressing specific concerns'],
    advantages: [
      'Targeted engagement',
      'In-depth discussion possible',
      'Can build relationships',
      'Identifies key issues early'
    ],
    disadvantages: [
      'Time consuming',
      'May not reach all views',
      'Can be dominated by vocal minority'
    ],
    timing: 'Throughout pre-application',
    costLevel: 'Low to medium'
  },
  'drop_in_session': {
    method: 'Drop-in Sessions',
    description: 'Informal sessions where public can view proposals and ask questions',
    suitableFor: ['Medium to large developments', 'Householder extensions in sensitive areas'],
    advantages: [
      'Less formal than exhibition',
      'Flexible attendance',
      'One-to-one conversations possible',
      'Less confrontational'
    ],
    disadvantages: [
      'Unpredictable attendance',
      'Staff intensive',
      'Difficult to capture all feedback'
    ],
    timing: 'Pre-application',
    costLevel: 'Medium'
  },
  'online_consultation': {
    method: 'Online Consultation Platform',
    description: 'Digital platform for viewing proposals and submitting feedback',
    suitableFor: ['All development types', 'Post-COVID engagement'],
    advantages: [
      'Wide accessibility',
      'Easy feedback collection',
      'Can include interactive elements',
      'Data analytics available'
    ],
    disadvantages: [
      'Excludes non-digital users',
      'Less personal',
      'Potential for spam responses'
    ],
    timing: 'Throughout process',
    costLevel: 'Low to medium'
  },
  'community_liaison': {
    method: 'Community Liaison Group',
    description: 'Regular meetings with local representatives during construction',
    suitableFor: ['Major developments', 'Long construction periods'],
    advantages: [
      'Ongoing dialogue',
      'Quick issue resolution',
      'Builds trust',
      'Demonstrates commitment'
    ],
    disadvantages: [
      'Time commitment required',
      'Need to select representatives fairly',
      'Can create expectations of influence'
    ],
    timing: 'During construction',
    costLevel: 'Medium'
  }
};

// Stakeholder types
const STAKEHOLDER_TYPES: Record<string, {
  type: string;
  description: string;
  typicalConcerns: string[];
  engagementApproach: string;
  priorityLevel: string;
}> = {
  'immediate_neighbours': {
    type: 'Immediate Neighbours',
    description: 'Properties directly adjacent or opposite the site',
    typicalConcerns: [
      'Overlooking and privacy',
      'Loss of light',
      'Construction disturbance',
      'Parking and access',
      'Property values'
    ],
    engagementApproach: 'Personal contact, individual meetings, share plans early',
    priorityLevel: 'Critical'
  },
  'wider_residents': {
    type: 'Wider Neighbourhood',
    description: 'Residents in surrounding streets',
    typicalConcerns: [
      'Traffic impact',
      'Character change',
      'Precedent setting',
      'Infrastructure strain'
    ],
    engagementApproach: 'Leaflet, public exhibition, website',
    priorityLevel: 'High'
  },
  'amenity_societies': {
    type: 'Amenity Societies',
    description: 'Local civic and conservation societies',
    typicalConcerns: [
      'Heritage impact',
      'Design quality',
      'Conservation area character',
      'Trees and landscape'
    ],
    engagementApproach: 'Formal presentation, early engagement, design dialogue',
    priorityLevel: 'High (in Hampstead)'
  },
  'ward_councillors': {
    type: 'Ward Councillors',
    description: 'Elected local councillors for the ward',
    typicalConcerns: [
      'Constituent concerns',
      'Policy compliance',
      'Community benefits',
      'Political implications'
    ],
    engagementApproach: 'Briefing meeting, regular updates, seek endorsement',
    priorityLevel: 'High'
  },
  'planning_officers': {
    type: 'Planning Officers',
    description: 'Council planning case officers',
    typicalConcerns: [
      'Policy compliance',
      'Technical requirements',
      'Consultation adequacy',
      'Application quality'
    ],
    engagementApproach: 'Pre-application meeting, respond to advice',
    priorityLevel: 'Critical'
  },
  'local_businesses': {
    type: 'Local Businesses',
    description: 'Nearby commercial premises',
    typicalConcerns: [
      'Access disruption',
      'Customer access',
      'Delivery impacts',
      'Competition'
    ],
    engagementApproach: 'Individual meetings, business forum engagement',
    priorityLevel: 'Medium'
  },
  'schools_community': {
    type: 'Schools and Community Facilities',
    description: 'Nearby schools, community centres, places of worship',
    typicalConcerns: [
      'Safety during construction',
      'Access and parking',
      'Noise and disturbance',
      'Community benefit'
    ],
    engagementApproach: 'Direct contact with management, presentations',
    priorityLevel: 'Medium to high'
  }
};

// Hampstead-specific amenity societies
const LOCAL_AMENITY_SOCIETIES = {
  hampstead: [
    {
      name: 'Hampstead Neighbourhood Forum',
      focus: 'Neighbourhood planning and development',
      engagementAdvice: 'Present at forum meetings, respond to neighbourhood plan policies'
    },
    {
      name: 'Heath & Hampstead Society',
      focus: 'Conservation of Hampstead Heath and surrounding area',
      engagementAdvice: 'Engage early on schemes near the Heath, address visual impact'
    },
    {
      name: 'Camden Civic Society',
      focus: 'Architectural and environmental quality across Camden',
      engagementAdvice: 'Seek design review, present significant schemes'
    },
    {
      name: 'Hampstead Conservation Area Advisory Committee',
      focus: 'Conservation area preservation',
      engagementAdvice: 'Present to committee, address heritage concerns'
    }
  ],
  garden_suburb: [
    {
      name: 'Hampstead Garden Suburb Residents Association',
      focus: 'Maintaining suburb character',
      engagementAdvice: 'Engage before any application, respect estate character'
    },
    {
      name: 'Hampstead Garden Suburb Trust',
      focus: 'Management Scheme compliance',
      engagementAdvice: 'Seek Trust approval before planning application'
    }
  ]
};

// Community benefit categories
const COMMUNITY_BENEFITS: Record<string, {
  benefit: string;
  description: string;
  relevantProjectTypes: string[];
  negotiationAdvice: string;
}> = {
  'affordable_housing': {
    benefit: 'Affordable Housing',
    description: 'Provision of affordable homes for local people',
    relevantProjectTypes: ['Major residential', 'Mixed use'],
    negotiationAdvice: 'Discuss with housing officers early, consider on-site vs contribution'
  },
  'public_realm': {
    benefit: 'Public Realm Improvements',
    description: 'Enhanced public spaces, landscaping, street improvements',
    relevantProjectTypes: ['Commercial', 'Retail', 'Major residential'],
    negotiationAdvice: 'Propose specific improvements, coordinate with highways'
  },
  'community_facilities': {
    benefit: 'Community Facilities',
    description: 'New or improved community spaces, meeting rooms, facilities',
    relevantProjectTypes: ['Major developments', 'Mixed use'],
    negotiationAdvice: 'Consult community on needs, ensure sustainable management'
  },
  'employment': {
    benefit: 'Local Employment',
    description: 'Job opportunities and apprenticeships for local residents',
    relevantProjectTypes: ['Commercial', 'Retail', 'Major construction'],
    negotiationAdvice: 'Work with local employment services, set targets'
  },
  'sustainability': {
    benefit: 'Sustainability Measures',
    description: 'Carbon reduction, green infrastructure, biodiversity',
    relevantProjectTypes: ['All developments'],
    negotiationAdvice: 'Go beyond minimum standards, demonstrate leadership'
  },
  'heritage': {
    benefit: 'Heritage Enhancement',
    description: 'Conservation, restoration, heritage interpretation',
    relevantProjectTypes: ['Heritage sites', 'Conservation areas'],
    negotiationAdvice: 'Propose heritage open days, interpretation boards'
  }
};

// Types
export interface EngagementRequest {
  address: string;
  postcode: string;
  projectType?: string;
  projectScale?: string;
  inConservationArea?: boolean;
  nearListedBuilding?: boolean;
  proposedUnits?: number;
  existingCommunityRelations?: string;
  budgetLevel?: string;
  timelineWeeks?: number;
}

export interface EngagementStrategy {
  address: string;
  postcode: string;
  timestamp: string;
  overallStrategy: {
    approachSummary: string;
    keyPrinciples: string[];
    riskLevel: string;
    recommendedBudget: string;
  };
  stakeholderMap: Array<{
    stakeholder: string;
    description: string;
    priorityLevel: string;
    concerns: string[];
    engagementApproach: string;
  }>;
  engagementPlan: Array<{
    method: string;
    description: string;
    timing: string;
    targetAudience: string[];
    estimatedCost: string;
    deliverables: string[];
  }>;
  localSocieties: Array<{
    name: string;
    focus: string;
    engagementAdvice: string;
  }>;
  timeline: Array<{
    week: string;
    activities: string[];
    milestones: string[];
  }>;
  communityBenefits: Array<{
    benefit: string;
    description: string;
    relevance: string;
    negotiationAdvice: string;
  }>;
  riskMitigation: Array<{
    risk: string;
    likelihood: string;
    mitigation: string;
  }>;
  successMetrics: string[];
  documentationRequirements: string[];
  statementOfCommunityInvolvement: {
    required: boolean;
    contents: string[];
    tips: string[];
  };
  metadata: {
    guidance: string;
    source: string;
    disclaimer: string;
  };
}

/**
 * Community Engagement Service
 */
class CommunityEngagementService {
  /**
   * Get comprehensive engagement strategy
   */
  async getEngagementStrategy(request: EngagementRequest): Promise<EngagementStrategy> {
    const overallStrategy = this.developOverallStrategy(request);
    const stakeholderMap = this.mapStakeholders(request);
    const engagementPlan = this.developEngagementPlan(request);
    const localSocieties = this.getLocalSocieties(request);
    const timeline = this.createTimeline(request);
    const communityBenefits = this.identifyCommunityBenefits(request);
    const riskMitigation = this.assessRisks(request);
    const successMetrics = this.defineSuccessMetrics(request);
    const documentationRequirements = this.getDocumentationRequirements(request);
    const statementRequirements = this.getStatementRequirements(request);

    return {
      address: request.address,
      postcode: request.postcode,
      timestamp: new Date().toISOString(),
      overallStrategy,
      stakeholderMap,
      engagementPlan,
      localSocieties,
      timeline,
      communityBenefits,
      riskMitigation,
      successMetrics,
      documentationRequirements,
      statementOfCommunityInvolvement: statementRequirements,
      metadata: {
        guidance: 'Community Engagement Strategy',
        source: 'Camden Council Community Engagement Guidelines',
        disclaimer: 'This strategy is guidance only. Adapt to specific circumstances.'
      }
    };
  }

  /**
   * Develop overall strategy
   */
  private developOverallStrategy(request: EngagementRequest): EngagementStrategy['overallStrategy'] {
    let approachSummary = 'Standard engagement approach';
    let riskLevel = 'Medium';
    let recommendedBudget = '£1,000-£5,000';
    
    if (request.proposedUnits && request.proposedUnits >= 10) {
      approachSummary = 'Comprehensive engagement programme for major development';
      riskLevel = 'High';
      recommendedBudget = '£10,000-£50,000';
    } else if (request.inConservationArea) {
      approachSummary = 'Heritage-sensitive engagement with focus on amenity societies';
      riskLevel = 'Medium-High';
      recommendedBudget = '£3,000-£10,000';
    }
    
    const keyPrinciples = [
      'Early engagement before design is fixed',
      'Transparent communication of intentions',
      'Active listening to concerns',
      'Genuine consideration of feedback',
      'Clear documentation of engagement',
      'Follow-up communication on how feedback was used'
    ];
    
    return {
      approachSummary,
      keyPrinciples,
      riskLevel,
      recommendedBudget
    };
  }

  /**
   * Map stakeholders
   */
  private mapStakeholders(request: EngagementRequest): EngagementStrategy['stakeholderMap'] {
    const stakeholders: EngagementStrategy['stakeholderMap'] = [];
    
    // Add all relevant stakeholders
    for (const [key, value] of Object.entries(STAKEHOLDER_TYPES)) {
      let priorityAdjustment = value.priorityLevel;
      
      // Adjust priority based on project characteristics
      if (key === 'amenity_societies' && request.inConservationArea) {
        priorityAdjustment = 'Critical';
      }
      
      stakeholders.push({
        stakeholder: value.type,
        description: value.description,
        priorityLevel: priorityAdjustment,
        concerns: value.typicalConcerns,
        engagementApproach: value.engagementApproach
      });
    }
    
    // Sort by priority
    const priorityOrder: Record<string, number> = { 'Critical': 1, 'High': 2, 'Medium-High': 3, 'Medium': 4, 'Low': 5 };
    stakeholders.sort((a, b) => 
      (priorityOrder[a.priorityLevel] || 99) - (priorityOrder[b.priorityLevel] || 99)
    );
    
    return stakeholders;
  }

  /**
   * Develop engagement plan
   */
  private developEngagementPlan(request: EngagementRequest): EngagementStrategy['engagementPlan'] {
    const plan: EngagementStrategy['engagementPlan'] = [];
    
    // Always include leaflet drop
    const leaflet = ENGAGEMENT_METHODS['leaflet_drop'];
    if (leaflet) {
      plan.push({
        method: leaflet.method,
        description: leaflet.description,
        timing: leaflet.timing,
        targetAudience: ['Immediate neighbours', 'Wider neighbourhood'],
        estimatedCost: leaflet.costLevel,
        deliverables: ['A5 leaflet', 'Feedback form', 'Project contact details']
      });
    }
    
    // Add stakeholder meetings
    const meetings = ENGAGEMENT_METHODS['stakeholder_meeting'];
    if (meetings) {
      plan.push({
        method: meetings.method,
        description: meetings.description,
        timing: meetings.timing,
        targetAudience: ['Amenity societies', 'Ward councillors', 'Key neighbours'],
        estimatedCost: meetings.costLevel,
        deliverables: ['Meeting notes', 'Presentation slides', 'Feedback summary']
      });
    }
    
    // Add exhibition for larger schemes
    if (request.proposedUnits && request.proposedUnits >= 5) {
      const exhibition = ENGAGEMENT_METHODS['public_exhibition'];
      if (exhibition) {
        plan.push({
          method: exhibition.method,
          description: exhibition.description,
          timing: exhibition.timing,
          targetAudience: exhibition.suitableFor,
          estimatedCost: exhibition.costLevel,
          deliverables: ['Display boards', 'Model/CGIs', 'Feedback forms', 'Attendance register']
        });
      }
    }
    
    // Always include website/online for modern engagement
    const website = ENGAGEMENT_METHODS['website'];
    if (website) {
      plan.push({
        method: website.method,
        description: website.description,
        timing: website.timing,
        targetAudience: ['All stakeholders', 'General public'],
        estimatedCost: website.costLevel,
        deliverables: ['Project website', 'Online feedback system', 'FAQs', 'Document downloads']
      });
    }
    
    return plan;
  }

  /**
   * Get local societies
   */
  private getLocalSocieties(request: EngagementRequest): EngagementStrategy['localSocieties'] {
    const postcode = request.postcode.toUpperCase();
    
    if (postcode.startsWith('NW11')) {
      return LOCAL_AMENITY_SOCIETIES.garden_suburb;
    }
    
    return LOCAL_AMENITY_SOCIETIES.hampstead;
  }

  /**
   * Create timeline
   */
  private createTimeline(request: EngagementRequest): EngagementStrategy['timeline'] {
    const weeks = request.timelineWeeks || 8;
    
    return [
      {
        week: 'Week 1-2',
        activities: [
          'Stakeholder mapping complete',
          'Draft engagement materials',
          'Contact ward councillors',
          'Set up project website'
        ],
        milestones: ['Engagement strategy approved', 'Initial councillor briefing']
      },
      {
        week: 'Week 3-4',
        activities: [
          'Leaflet distribution',
          'Amenity society meetings',
          'Website live',
          'Feedback collection begins'
        ],
        milestones: ['Public awareness established', 'Key stakeholder meetings complete']
      },
      {
        week: 'Week 5-6',
        activities: [
          'Public exhibition/drop-in session',
          'Follow-up meetings as needed',
          'Review feedback received',
          'Design team briefing on feedback'
        ],
        milestones: ['Major engagement event complete', 'Feedback review meeting']
      },
      {
        week: 'Week 7-8',
        activities: [
          'Draft Statement of Community Involvement',
          'Communication of how feedback influenced design',
          'Final stakeholder updates',
          'Prepare for planning submission'
        ],
        milestones: ['SCI complete', 'Pre-submission stakeholder update sent']
      }
    ];
  }

  /**
   * Identify community benefits
   */
  private identifyCommunityBenefits(request: EngagementRequest): EngagementStrategy['communityBenefits'] {
    const benefits: EngagementStrategy['communityBenefits'] = [];
    
    const projectType = request.projectType?.toLowerCase() || '';
    
    for (const [key, value] of Object.entries(COMMUNITY_BENEFITS)) {
      let relevance = 'Consider for negotiation';
      
      if (key === 'affordable_housing' && request.proposedUnits && request.proposedUnits >= 10) {
        relevance = 'Policy requirement - essential';
      } else if (key === 'heritage' && request.inConservationArea) {
        relevance = 'Highly relevant in conservation area';
      } else if (key === 'public_realm' && projectType.includes('commercial')) {
        relevance = 'Expected contribution for commercial development';
      }
      
      benefits.push({
        benefit: value.benefit,
        description: value.description,
        relevance,
        negotiationAdvice: value.negotiationAdvice
      });
    }
    
    return benefits;
  }

  /**
   * Assess risks
   */
  private assessRisks(request: EngagementRequest): EngagementStrategy['riskMitigation'] {
    const risks: EngagementStrategy['riskMitigation'] = [
      {
        risk: 'Organized opposition from residents group',
        likelihood: request.inConservationArea ? 'High' : 'Medium',
        mitigation: 'Engage early, address concerns in design, maintain dialogue'
      },
      {
        risk: 'Amenity society objection',
        likelihood: request.inConservationArea ? 'High' : 'Medium',
        mitigation: 'Present to society early, seek design dialogue, show responsiveness'
      },
      {
        risk: 'Ward councillor call-in',
        likelihood: 'Medium',
        mitigation: 'Briefing councillors personally, address constituent concerns'
      },
      {
        risk: 'Negative media coverage',
        likelihood: request.proposedUnits && request.proposedUnits >= 20 ? 'Medium' : 'Low',
        mitigation: 'Proactive media strategy, emphasize benefits, prepare responses'
      },
      {
        risk: 'Poor engagement attendance',
        likelihood: 'Medium',
        mitigation: 'Multiple engagement methods, accessible times/venues, promote widely'
      },
      {
        risk: 'Unrealistic community expectations',
        likelihood: 'Medium',
        mitigation: 'Be clear about scope for changes, explain constraints, manage expectations'
      }
    ];
    
    return risks;
  }

  /**
   * Define success metrics
   */
  private defineSuccessMetrics(request: EngagementRequest): string[] {
    return [
      'All immediate neighbours contacted personally',
      'Ward councillors briefed before application',
      'Key amenity societies engaged',
      'Public engagement event held with recorded attendance',
      'Feedback documented and responded to',
      'Design changes made in response to feedback where appropriate',
      'Statement of Community Involvement submitted with application',
      'No procedural objections about consultation',
      'Positive or neutral response from key stakeholders'
    ];
  }

  /**
   * Get documentation requirements
   */
  private getDocumentationRequirements(request: EngagementRequest): string[] {
    return [
      'Record of all engagement activities with dates',
      'Copies of all consultation materials (leaflets, boards)',
      'Attendance records for events',
      'All feedback received (written, verbal, online)',
      'Summary of key issues raised',
      'Design team response to feedback',
      'Changes made to scheme as result of consultation',
      'Evidence of follow-up communication',
      'Photos of engagement events',
      'Meeting notes from stakeholder meetings'
    ];
  }

  /**
   * Get statement requirements
   */
  private getStatementRequirements(request: EngagementRequest): EngagementStrategy['statementOfCommunityInvolvement'] {
    const required = request.proposedUnits ? request.proposedUnits >= 10 : false;
    
    return {
      required,
      contents: [
        'Description of consultation undertaken',
        'List of stakeholders consulted',
        'Summary of feedback received',
        'Analysis of key issues raised',
        'How feedback influenced the final scheme',
        'Outstanding concerns and responses',
        'Copies of consultation materials',
        'Attendance records and feedback forms'
      ],
      tips: [
        'Be honest about concerns raised',
        'Show genuine responsiveness to feedback',
        'Explain why some suggestions could not be adopted',
        'Include evidence of engagement activities',
        'Reference specific design changes made',
        'Thank participants for their input'
      ]
    };
  }

  /**
   * Get engagement methods reference
   */
  async getEngagementMethods(): Promise<typeof ENGAGEMENT_METHODS> {
    return ENGAGEMENT_METHODS;
  }

  /**
   * Get stakeholder types reference
   */
  async getStakeholderTypes(): Promise<typeof STAKEHOLDER_TYPES> {
    return STAKEHOLDER_TYPES;
  }
}

// Export singleton instance
const communityEngagementService = new CommunityEngagementService();
export default communityEngagementService;
