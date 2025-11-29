/**
 * Planning Enforcement Guidance Service
 * 
 * Comprehensive guidance on planning enforcement in Camden & Hampstead
 * Helps users understand enforcement powers, processes, and responses
 */

// Types of planning breaches
const BREACH_TYPES: Record<string, {
  name: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timeLimit: string;
  typicalAction: string;
  examples: string[];
}> = {
  'operational_development': {
    name: 'Operational Development Without Permission',
    description: 'Building works carried out without required planning permission',
    severity: 'high',
    timeLimit: '4 years from substantial completion',
    typicalAction: 'Enforcement notice requiring removal or retrospective application',
    examples: [
      'Unauthorized extension',
      'Building without permission',
      'Outbuilding exceeding PD limits',
      'Roof alterations',
      'Boundary walls over 2m'
    ]
  },
  'change_of_use': {
    name: 'Unauthorized Change of Use',
    description: 'Using land or buildings for purposes not permitted',
    severity: 'medium',
    timeLimit: '10 years from commencement',
    typicalAction: 'Enforcement notice requiring cessation of use',
    examples: [
      'Residential to commercial',
      'Running business from home (materially)',
      'Short-term letting (Airbnb over 90 days)',
      'Multiple occupation without permission',
      'Garden used for commercial storage'
    ]
  },
  'breach_of_condition': {
    name: 'Breach of Planning Condition',
    description: 'Failure to comply with conditions attached to planning permission',
    severity: 'medium',
    timeLimit: '10 years from breach',
    typicalAction: 'Breach of condition notice',
    examples: [
      'Operating outside permitted hours',
      'Not implementing landscaping',
      'Using non-approved materials',
      'Failing to provide parking',
      'Not installing obscure glazing'
    ]
  },
  'listed_building': {
    name: 'Listed Building Breach',
    description: 'Works to listed building without consent',
    severity: 'critical',
    timeLimit: 'No time limit - criminal offence',
    typicalAction: 'Criminal prosecution and/or listed building enforcement notice',
    examples: [
      'Internal alterations without consent',
      'Window replacement',
      'Removing historic features',
      'Inappropriate repairs',
      'Demolition of listed structure'
    ]
  },
  'conservation_area': {
    name: 'Conservation Area Breach',
    description: 'Demolition or works in conservation area without consent',
    severity: 'high',
    timeLimit: 'Various depending on breach type',
    typicalAction: 'Enforcement notice or prosecution for demolition',
    examples: [
      'Demolition without consent',
      'Tree works without notice',
      'Satellite dishes on front elevations',
      'UPVC windows replacement',
      'Loss of boundary features'
    ]
  },
  'advertisement': {
    name: 'Advertisement Breach',
    description: 'Displaying advertisements without required consent',
    severity: 'low',
    timeLimit: 'No time limit',
    typicalAction: 'Discontinuance notice',
    examples: [
      'Illuminated signs without consent',
      'Oversized shop signage',
      'Banner advertisements',
      'Estate agent boards overstaying',
      'A-boards proliferation'
    ]
  },
  'tree': {
    name: 'Tree/Hedge Breach',
    description: 'Works to protected trees or high hedges without consent',
    severity: 'high',
    timeLimit: 'No time limit for prosecution',
    typicalAction: 'Prosecution and/or replanting notice',
    examples: [
      'Felling TPO tree without consent',
      'Damaging protected tree roots',
      'Pruning conservation area tree without notice',
      'Removing hedge subject to notice'
    ]
  },
  'demolition': {
    name: 'Unlawful Demolition',
    description: 'Demolition without required prior approval or consent',
    severity: 'critical',
    timeLimit: '4 years for enforcement action',
    typicalAction: 'Criminal prosecution possible, enforcement notice',
    examples: [
      'Demolition in conservation area',
      'Demolition of listed building',
      'Demolition without prior approval notification'
    ]
  }
};

// Enforcement notice types
const ENFORCEMENT_NOTICES: Record<string, {
  name: string;
  purpose: string;
  compliancePeriod: string;
  appeal: string;
  failure: string;
}> = {
  'enforcement_notice': {
    name: 'Enforcement Notice',
    purpose: 'Require steps to remedy breach within specified period',
    compliancePeriod: 'Minimum 28 days after notice takes effect',
    appeal: '28 days from date of notice to appeal to Planning Inspectorate',
    failure: 'Criminal offence - fine up to unlimited amount'
  },
  'breach_of_condition_notice': {
    name: 'Breach of Condition Notice',
    purpose: 'Require compliance with planning conditions',
    compliancePeriod: 'Minimum 28 days',
    appeal: 'No right of appeal against the notice itself',
    failure: 'Criminal offence - fine up to £2,500 per day'
  },
  'stop_notice': {
    name: 'Stop Notice',
    purpose: 'Require immediate cessation of activity causing harm',
    compliancePeriod: 'Immediate or within 3-28 days',
    appeal: 'Can only challenge underlying enforcement notice',
    failure: 'Criminal offence - daily fines, injunction'
  },
  'temporary_stop_notice': {
    name: 'Temporary Stop Notice',
    purpose: 'Immediate halt for 28 days maximum',
    compliancePeriod: 'Immediate',
    appeal: 'No right of appeal',
    failure: 'Criminal offence'
  },
  'planning_contravention_notice': {
    name: 'Planning Contravention Notice (PCN)',
    purpose: 'Require information about activities on land',
    compliancePeriod: '21 days to respond',
    appeal: 'No appeal, but must respond',
    failure: 'Criminal offence for non-response - fine up to £1,000'
  },
  'section_215_notice': {
    name: 'Section 215 Notice (Untidy Land)',
    purpose: 'Require land to be cleaned up',
    compliancePeriod: 'Minimum 28 days',
    appeal: 'To magistrates court within 21 days',
    failure: 'Council can do works and recover costs'
  },
  'discontinuance_notice': {
    name: 'Discontinuance Notice',
    purpose: 'Require removal of advertisements',
    compliancePeriod: 'Specified in notice',
    appeal: 'To magistrates court',
    failure: 'Criminal offence'
  },
  'listed_building_enforcement': {
    name: 'Listed Building Enforcement Notice',
    purpose: 'Require works to restore listed building',
    compliancePeriod: 'Minimum 28 days after notice takes effect',
    appeal: '28 days to Planning Inspectorate',
    failure: 'Criminal offence, council can do works'
  }
};

// Enforcement appeal grounds
const APPEAL_GROUNDS = {
  'enforcement_notice': [
    {
      ground: 'Ground (a)',
      description: 'Planning permission should be granted or the condition discharged',
      effect: 'If successful, deemed planning permission granted'
    },
    {
      ground: 'Ground (b)',
      description: 'The breach alleged has not occurred as a matter of fact',
      effect: 'Notice quashed'
    },
    {
      ground: 'Ground (c)',
      description: 'The breach does not constitute a breach of planning control',
      effect: 'Notice quashed'
    },
    {
      ground: 'Ground (d)',
      description: 'The time limit for taking enforcement action has expired',
      effect: 'Notice quashed, development becomes lawful'
    },
    {
      ground: 'Ground (e)',
      description: 'The notice was not properly served',
      effect: 'Notice may be quashed'
    },
    {
      ground: 'Ground (f)',
      description: 'The steps required are excessive',
      effect: 'Steps may be varied'
    },
    {
      ground: 'Ground (g)',
      description: 'The time for compliance is too short',
      effect: 'Compliance period may be extended'
    }
  ],
  'listed_building': [
    {
      ground: 'Ground (a)',
      description: 'Listed building consent should be granted',
      effect: 'Deemed consent if successful'
    },
    {
      ground: 'Ground (b)',
      description: 'The matters stated have not occurred',
      effect: 'Notice quashed'
    },
    {
      ground: 'Ground (c)',
      description: 'The matters do not constitute a breach',
      effect: 'Notice quashed'
    },
    {
      ground: 'Ground (d)',
      description: 'Works were urgently necessary for safety or health',
      effect: 'Defence to notice'
    },
    {
      ground: 'Ground (e)',
      description: 'Consent was previously given by council',
      effect: 'Notice quashed'
    },
    {
      ground: 'Ground (f)',
      description: 'Steps required are excessive',
      effect: 'Steps may be varied'
    },
    {
      ground: 'Ground (g)',
      description: 'Compliance period too short',
      effect: 'Period may be extended'
    }
  ]
};

// Enforcement process steps
const ENFORCEMENT_PROCESS = [
  {
    stage: 1,
    name: 'Complaint/Investigation',
    description: 'Council receives complaint or identifies breach',
    actions: [
      'Site visit and assessment',
      'Gather evidence',
      'Review planning history',
      'Issue PCN if needed'
    ],
    timeframe: '2-8 weeks'
  },
  {
    stage: 2,
    name: 'Consideration',
    description: 'Council considers whether action is expedient',
    actions: [
      'Assess harm caused',
      'Consider enforcement options',
      'Check time limits',
      'Assess public interest'
    ],
    timeframe: '2-4 weeks'
  },
  {
    stage: 3,
    name: 'Negotiation',
    description: 'Attempt to resolve without formal action',
    actions: [
      'Contact landowner/developer',
      'Invite retrospective application',
      'Negotiate compliance',
      'Set deadlines'
    ],
    timeframe: '4-12 weeks'
  },
  {
    stage: 4,
    name: 'Formal Notice',
    description: 'Issue appropriate enforcement notice if negotiation fails',
    actions: [
      'Draft and serve notice',
      'Specify breach clearly',
      'Set compliance requirements',
      'Set compliance period'
    ],
    timeframe: '1-2 weeks'
  },
  {
    stage: 5,
    name: 'Appeal Period',
    description: 'Allow time for appeal (if applicable)',
    actions: [
      'Wait for appeal deadline',
      'Respond to any appeal',
      'Attend hearing/inquiry if needed'
    ],
    timeframe: '28 days - 12 months'
  },
  {
    stage: 6,
    name: 'Compliance',
    description: 'Monitor compliance with notice',
    actions: [
      'Site visits to check compliance',
      'Document any non-compliance',
      'Consider further action if needed'
    ],
    timeframe: 'As per notice requirements'
  },
  {
    stage: 7,
    name: 'Prosecution/Direct Action',
    description: 'Take action for non-compliance',
    actions: [
      'Prepare prosecution case',
      'Execute direct action if authorized',
      'Recover costs'
    ],
    timeframe: 'Variable'
  }
];

// Expediency factors
const EXPEDIENCY_FACTORS = [
  {
    factor: 'Harm caused',
    description: 'Level of planning harm from the breach',
    weight: 'High',
    examples: ['Visual impact', 'Amenity harm', 'Highway safety', 'Heritage damage']
  },
  {
    factor: 'Public interest',
    description: 'Whether action serves public interest',
    weight: 'High',
    examples: ['Community concern', 'Setting precedent', 'Policy compliance']
  },
  {
    factor: 'Remedy available',
    description: 'Whether breach can be satisfactorily remedied',
    weight: 'Medium',
    examples: ['Removal possible', 'Restoration feasible', 'Conditions could regularize']
  },
  {
    factor: 'Proportionality',
    description: 'Balance between action and breach severity',
    weight: 'Medium',
    examples: ['Minor breach vs major enforcement', 'Cost of action', 'Impact on occupants']
  },
  {
    factor: 'Resources',
    description: 'Council resources and priorities',
    weight: 'Low',
    examples: ['Staff availability', 'Legal costs', 'Enforcement workload']
  }
];

interface EnforcementRequest {
  address: string;
  breachDescription: string;
  breachType?: string;
  whenDiscovered: string;
  evidenceAvailable?: string[];
  isYourProperty?: boolean;
  hasCouncilContacted?: boolean;
  noticeReceived?: string;
  appealDeadline?: string;
  complianceDeadline?: string;
}

interface EnforcementAssessment {
  address: string;
  breachAnalysis: {
    type: string;
    name: string;
    severity: string;
    timeLimit: string;
    typicalAction: string;
    isPotentialCriminal: boolean;
  };
  likelyProcess: Array<{
    stage: number;
    name: string;
    description: string;
    timeframe: string;
  }>;
  potentialNotices: Array<{
    notice: string;
    name: string;
    purpose: string;
    compliancePeriod: string;
    appealRights: string;
  }>;
  appealOptions?: {
    grounds: Array<{
      ground: string;
      description: string;
      likelihood: string;
    }>;
    deadline: string;
    process: string[];
  };
  responseOptions: Array<{
    option: string;
    description: string;
    advantages: string[];
    disadvantages: string[];
    recommended: boolean;
  }>;
  expediencyAnalysis: {
    likelyToProceed: boolean;
    factors: Array<{
      factor: string;
      assessment: string;
      weight: string;
    }>;
  };
  recommendations: string[];
  urgentActions: string[];
  confidenceLevel: string;
}

class EnforcementGuidanceService {
  /**
   * Generate comprehensive enforcement guidance
   */
  public generateEnforcementGuidance(request: EnforcementRequest): EnforcementAssessment {
    const breachType = this.identifyBreachType(request);
    const breachInfo = BREACH_TYPES[breachType];
    const defaultBreach = {
      name: 'Planning Breach',
      description: 'Potential breach of planning control',
      severity: 'medium' as const,
      timeLimit: 'Varies',
      typicalAction: 'Investigation required',
      examples: []
    };
    const breach = breachInfo || defaultBreach;
    
    const isPotentialCriminal = this.assessCriminalLiability(breachType);
    const potentialNotices = this.identifyPotentialNotices(breachType);
    const likelyProcess = this.determineProcess(request);
    const appealOptions = this.assessAppealOptions(request, breachType);
    const responseOptions = this.generateResponseOptions(request, breachType);
    const expediencyAnalysis = this.analyzeExpediency(request, breachType);
    
    return {
      address: request.address,
      breachAnalysis: {
        type: breachType,
        name: breach.name,
        severity: breach.severity,
        timeLimit: breach.timeLimit,
        typicalAction: breach.typicalAction,
        isPotentialCriminal
      },
      likelyProcess,
      potentialNotices,
      appealOptions,
      responseOptions,
      expediencyAnalysis,
      recommendations: this.generateRecommendations(request, breachType),
      urgentActions: this.identifyUrgentActions(request, breachType),
      confidenceLevel: this.assessConfidence(request)
    };
  }

  /**
   * Identify the type of breach
   */
  private identifyBreachType(request: EnforcementRequest): string {
    // Use provided type if valid
    if (request.breachType && BREACH_TYPES[request.breachType]) {
      return request.breachType;
    }
    
    const description = request.breachDescription.toLowerCase();
    
    // Listed building
    if (description.includes('listed') || description.includes('grade i') || 
        description.includes('grade ii')) {
      return 'listed_building';
    }
    
    // Conservation area
    if (description.includes('conservation area') && 
        (description.includes('demolition') || description.includes('demol'))) {
      return 'conservation_area';
    }
    
    // Tree
    if (description.includes('tree') || description.includes('tpo') || 
        description.includes('hedge')) {
      return 'tree';
    }
    
    // Change of use
    if (description.includes('use') || description.includes('airbnb') || 
        description.includes('business') || description.includes('hmo')) {
      return 'change_of_use';
    }
    
    // Condition breach
    if (description.includes('condition') || description.includes('hours') || 
        description.includes('approved')) {
      return 'breach_of_condition';
    }
    
    // Advertisement
    if (description.includes('sign') || description.includes('advertisement') || 
        description.includes('banner')) {
      return 'advertisement';
    }
    
    // Demolition
    if (description.includes('demolition') || description.includes('demol') || 
        description.includes('knocked down')) {
      return 'demolition';
    }
    
    // Default to operational development
    return 'operational_development';
  }

  /**
   * Assess if breach may be criminal offence
   */
  private assessCriminalLiability(breachType: string): boolean {
    const criminalBreaches = [
      'listed_building',
      'tree',
      'demolition'
    ];
    
    return criminalBreaches.includes(breachType);
  }

  /**
   * Identify potential notices that could be served
   */
  private identifyPotentialNotices(
    breachType: string
  ): Array<{
    notice: string;
    name: string;
    purpose: string;
    compliancePeriod: string;
    appealRights: string;
  }> {
    const notices: Array<{
      notice: string;
      name: string;
      purpose: string;
      compliancePeriod: string;
      appealRights: string;
    }> = [];
    
    // PCN is often first step
    const pcnInfo = ENFORCEMENT_NOTICES['planning_contravention_notice'];
    if (pcnInfo) {
      notices.push({
        notice: 'planning_contravention_notice',
        name: pcnInfo.name,
        purpose: pcnInfo.purpose,
        compliancePeriod: pcnInfo.compliancePeriod,
        appealRights: pcnInfo.appeal
      });
    }
    
    // Type-specific notices
    if (breachType === 'listed_building') {
      const lbInfo = ENFORCEMENT_NOTICES['listed_building_enforcement'];
      if (lbInfo) {
        notices.push({
          notice: 'listed_building_enforcement',
          name: lbInfo.name,
          purpose: lbInfo.purpose,
          compliancePeriod: lbInfo.compliancePeriod,
          appealRights: lbInfo.appeal
        });
      }
    } else if (breachType === 'breach_of_condition') {
      const bcnInfo = ENFORCEMENT_NOTICES['breach_of_condition_notice'];
      if (bcnInfo) {
        notices.push({
          notice: 'breach_of_condition_notice',
          name: bcnInfo.name,
          purpose: bcnInfo.purpose,
          compliancePeriod: bcnInfo.compliancePeriod,
          appealRights: bcnInfo.appeal
        });
      }
    } else if (breachType === 'advertisement') {
      const discInfo = ENFORCEMENT_NOTICES['discontinuance_notice'];
      if (discInfo) {
        notices.push({
          notice: 'discontinuance_notice',
          name: discInfo.name,
          purpose: discInfo.purpose,
          compliancePeriod: discInfo.compliancePeriod,
          appealRights: discInfo.appeal
        });
      }
    } else {
      // Standard enforcement notice
      const enfInfo = ENFORCEMENT_NOTICES['enforcement_notice'];
      if (enfInfo) {
        notices.push({
          notice: 'enforcement_notice',
          name: enfInfo.name,
          purpose: enfInfo.purpose,
          compliancePeriod: enfInfo.compliancePeriod,
          appealRights: enfInfo.appeal
        });
      }
    }
    
    // Stop notice for serious breaches
    if (['operational_development', 'demolition', 'change_of_use'].includes(breachType)) {
      const stopInfo = ENFORCEMENT_NOTICES['stop_notice'];
      if (stopInfo) {
        notices.push({
          notice: 'stop_notice',
          name: stopInfo.name,
          purpose: stopInfo.purpose,
          compliancePeriod: stopInfo.compliancePeriod,
          appealRights: stopInfo.appeal
        });
      }
    }
    
    return notices;
  }

  /**
   * Determine likely enforcement process
   */
  private determineProcess(
    request: EnforcementRequest
  ): Array<{
    stage: number;
    name: string;
    description: string;
    timeframe: string;
  }> {
    // Adjust process based on how far through they are
    const relevantStages = ENFORCEMENT_PROCESS.filter(stage => {
      if (request.noticeReceived) {
        return stage.stage >= 4; // Already past investigation
      }
      if (request.hasCouncilContacted) {
        return stage.stage >= 2; // Investigation started
      }
      return true; // Full process
    });
    
    return relevantStages.map(stage => ({
      stage: stage.stage,
      name: stage.name,
      description: stage.description,
      timeframe: stage.timeframe
    }));
  }

  /**
   * Assess appeal options if notice received
   */
  private assessAppealOptions(
    request: EnforcementRequest,
    breachType: string
  ): {
    grounds: Array<{
      ground: string;
      description: string;
      likelihood: string;
    }>;
    deadline: string;
    process: string[];
  } | undefined {
    if (!request.noticeReceived) {
      return undefined;
    }
    
    const groundsKey = breachType === 'listed_building' ? 'listed_building' : 'enforcement_notice';
    const groundsList = APPEAL_GROUNDS[groundsKey] || [];
    
    return {
      grounds: groundsList.map(g => ({
        ground: g.ground,
        description: g.description,
        likelihood: this.assessGroundLikelihood(g.ground, request)
      })),
      deadline: request.appealDeadline || '28 days from date notice was served',
      process: [
        'Complete appeal form online at appeals.planninginspectorate.gov.uk',
        'Submit all supporting documents',
        'Pay any required fee',
        'Wait for appeal to be validated',
        'Submit statement of case within deadline',
        'Attend hearing/inquiry if required',
        'Await decision'
      ]
    };
  }

  /**
   * Assess likelihood of appeal ground succeeding
   */
  private assessGroundLikelihood(ground: string, request: EnforcementRequest): string {
    // This would need case-specific analysis in reality
    if (ground === 'Ground (a)') {
      return 'Depends on planning merits';
    }
    if (ground === 'Ground (d)') {
      return 'Strong if time limits apply and can be evidenced';
    }
    if (ground === 'Ground (f)' || ground === 'Ground (g)') {
      return 'Often partially successful';
    }
    return 'Case specific - seek professional advice';
  }

  /**
   * Generate response options
   */
  private generateResponseOptions(
    request: EnforcementRequest,
    breachType: string
  ): Array<{
    option: string;
    description: string;
    advantages: string[];
    disadvantages: string[];
    recommended: boolean;
  }> {
    const options: Array<{
      option: string;
      description: string;
      advantages: string[];
      disadvantages: string[];
      recommended: boolean;
    }> = [];
    
    // Retrospective application
    options.push({
      option: 'Apply for Retrospective Permission',
      description: 'Submit planning application to regularize the development',
      advantages: [
        'May resolve matter completely',
        'Avoids enforcement action',
        'Demonstrates good faith',
        'If approved, breach becomes lawful'
      ],
      disadvantages: [
        'Application fee required',
        'No guarantee of approval',
        'May need to amend scheme',
        'Enforcement may continue during process'
      ],
      recommended: !this.assessCriminalLiability(breachType)
    });
    
    // Compliance
    options.push({
      option: 'Full Compliance',
      description: 'Undertake works required by notice',
      advantages: [
        'Ends enforcement action',
        'No further legal action',
        'Avoids prosecution',
        'Quickest resolution'
      ],
      disadvantages: [
        'May be costly',
        'Lose unauthorized works',
        'May need professional help'
      ],
      recommended: request.noticeReceived !== undefined
    });
    
    // Appeal
    if (request.noticeReceived) {
      options.push({
        option: 'Appeal the Notice',
        description: 'Challenge the enforcement notice through formal appeal',
        advantages: [
          'May overturn notice',
          'Suspends compliance requirement',
          'May get deemed permission',
          'May vary requirements'
        ],
        disadvantages: [
          'Costly - professional fees',
          'Time consuming - 6-12 months',
          'May not succeed',
          'Costs may be awarded against you'
        ],
        recommended: false
      });
    }
    
    // Negotiate
    if (!request.noticeReceived) {
      options.push({
        option: 'Negotiate with Council',
        description: 'Discuss options informally before notice served',
        advantages: [
          'May avoid formal action',
          'May agree compromised scheme',
          'Builds relationship with officers',
          'Less confrontational'
        ],
        disadvantages: [
          'Time limited - council may serve notice',
          'May still need to remedy breach',
          'Council may not negotiate'
        ],
        recommended: true
      });
    }
    
    // Certificate of lawfulness
    options.push({
      option: 'Apply for Certificate of Lawfulness',
      description: 'If breach is immune from enforcement due to time limits',
      advantages: [
        'Confirms lawfulness',
        'Ends enforcement threat',
        'Can sell property with certainty',
        'Relatively straightforward'
      ],
      disadvantages: [
        'Must prove time limit expired',
        'Evidence requirements high',
        'Application fee required',
        'Does not apply to all breaches'
      ],
      recommended: false
    });
    
    return options;
  }

  /**
   * Analyze expediency factors
   */
  private analyzeExpediency(
    request: EnforcementRequest,
    breachType: string
  ): {
    likelyToProceed: boolean;
    factors: Array<{
      factor: string;
      assessment: string;
      weight: string;
    }>;
  } {
    const factors: Array<{
      factor: string;
      assessment: string;
      weight: string;
    }> = [];
    
    const breachInfo = BREACH_TYPES[breachType];
    const defaultBreach = { severity: 'medium' as const };
    const breach = breachInfo || defaultBreach;
    const severity = breach.severity;
    
    // Harm assessment
    let harmAssessment = 'Medium harm likely';
    if (severity === 'critical' || severity === 'high') {
      harmAssessment = 'High harm - action likely';
    } else if (severity === 'low') {
      harmAssessment = 'Low harm - action less certain';
    }
    
    factors.push({
      factor: 'Harm caused',
      assessment: harmAssessment,
      weight: 'High'
    });
    
    // Heritage
    if (breachType === 'listed_building' || breachType === 'conservation_area') {
      factors.push({
        factor: 'Heritage impact',
        assessment: 'Heritage harm weighs heavily in favour of action',
        weight: 'High'
      });
    }
    
    // Criminal
    if (this.assessCriminalLiability(breachType)) {
      factors.push({
        factor: 'Criminal liability',
        assessment: 'Potential criminal offence increases likelihood of action',
        weight: 'High'
      });
    }
    
    // Public interest
    factors.push({
      factor: 'Public interest',
      assessment: 'Council duty to investigate complaints',
      weight: 'Medium'
    });
    
    // Proportionality
    factors.push({
      factor: 'Proportionality',
      assessment: 'Action must be proportionate to breach',
      weight: 'Medium'
    });
    
    // Overall assessment
    const highWeightFactors = factors.filter(f => f.weight === 'High').length;
    const likelyToProceed = severity === 'critical' || severity === 'high' || highWeightFactors >= 2;
    
    return {
      likelyToProceed,
      factors
    };
  }

  /**
   * Generate recommendations
   */
  private generateRecommendations(
    request: EnforcementRequest,
    breachType: string
  ): string[] {
    const recommendations: string[] = [];
    
    // General
    recommendations.push('Seek professional planning advice as soon as possible');
    recommendations.push('Keep records of all correspondence with the council');
    
    // If property owner
    if (request.isYourProperty) {
      recommendations.push('Respond promptly to any council communications');
      recommendations.push('Consider instructing a planning consultant');
      
      if (!request.noticeReceived) {
        recommendations.push('Consider submitting retrospective planning application');
        recommendations.push('Open dialogue with planning enforcement team');
      }
      
      if (request.noticeReceived) {
        recommendations.push('Note all deadlines carefully');
        recommendations.push('Consider appeal grounds if applicable');
        recommendations.push('Seek legal advice on appeal merits');
      }
    }
    
    // Heritage specific
    if (breachType === 'listed_building') {
      recommendations.push('Do not carry out any further works without consent');
      recommendations.push('Seek advice from conservation officer');
      recommendations.push('Understand criminal liability risks');
    }
    
    // Tree specific
    if (breachType === 'tree') {
      recommendations.push('Preserve any evidence of tree condition before works');
      recommendations.push('May need to replant - consider species selection');
    }
    
    return recommendations;
  }

  /**
   * Identify urgent actions required
   */
  private identifyUrgentActions(
    request: EnforcementRequest,
    breachType: string
  ): string[] {
    const urgent: string[] = [];
    
    // Appeal deadline
    if (request.appealDeadline) {
      urgent.push(`URGENT: Appeal deadline is ${request.appealDeadline}`);
    }
    
    // Compliance deadline
    if (request.complianceDeadline) {
      urgent.push(`URGENT: Compliance deadline is ${request.complianceDeadline}`);
    }
    
    // Criminal liability
    if (this.assessCriminalLiability(breachType)) {
      urgent.push('URGENT: Potential criminal offence - seek legal advice immediately');
    }
    
    // Stop notice
    if (request.noticeReceived?.toLowerCase().includes('stop')) {
      urgent.push('URGENT: Stop Notice - cease activity immediately to avoid prosecution');
    }
    
    // Ongoing works
    if (breachType === 'operational_development') {
      urgent.push('Stop any ongoing building works until position is clarified');
    }
    
    return urgent;
  }

  /**
   * Assess confidence in analysis
   */
  private assessConfidence(request: EnforcementRequest): string {
    let confidence = 'MEDIUM';
    
    // Higher confidence with more information
    if (request.noticeReceived && request.breachType) {
      confidence = 'HIGH';
    }
    
    // Lower confidence with limited information
    if (!request.breachDescription || request.breachDescription.length < 30) {
      confidence = 'LOW';
    }
    
    return confidence;
  }

  /**
   * Get information about specific notice type
   */
  public getNoticeInfo(noticeType: string): {
    name: string;
    purpose: string;
    compliancePeriod: string;
    appealRights: string;
    failureConsequences: string;
  } | null {
    const notice = ENFORCEMENT_NOTICES[noticeType];
    if (!notice) return null;
    
    return {
      name: notice.name,
      purpose: notice.purpose,
      compliancePeriod: notice.compliancePeriod,
      appealRights: notice.appeal,
      failureConsequences: notice.failure
    };
  }

  /**
   * Get breach type information
   */
  public getBreachTypeInfo(breachType: string): {
    name: string;
    description: string;
    severity: string;
    timeLimit: string;
    examples: string[];
  } | null {
    const breach = BREACH_TYPES[breachType];
    if (!breach) return null;
    
    return {
      name: breach.name,
      description: breach.description,
      severity: breach.severity,
      timeLimit: breach.timeLimit,
      examples: breach.examples
    };
  }

  /**
   * Get appeal grounds for enforcement notice type
   */
  public getAppealGrounds(noticeType: 'enforcement' | 'listed_building'): Array<{
    ground: string;
    description: string;
    effect: string;
  }> {
    const groundsKey = noticeType === 'listed_building' ? 'listed_building' : 'enforcement_notice';
    return APPEAL_GROUNDS[groundsKey] || [];
  }

  /**
   * Get enforcement process overview
   */
  public getProcessOverview(): typeof ENFORCEMENT_PROCESS {
    return ENFORCEMENT_PROCESS;
  }

  /**
   * Get all breach types
   */
  public getAllBreachTypes(): Array<{
    type: string;
    name: string;
    severity: string;
    timeLimit: string;
  }> {
    return Object.entries(BREACH_TYPES).map(([type, info]) => ({
      type,
      name: info.name,
      severity: info.severity,
      timeLimit: info.timeLimit
    }));
  }

  /**
   * Get expediency factors
   */
  public getExpediencyFactors(): typeof EXPEDIENCY_FACTORS {
    return EXPEDIENCY_FACTORS;
  }
}

export default EnforcementGuidanceService;
