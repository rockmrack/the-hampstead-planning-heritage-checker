/**
 * Pre-Application Advice Service
 * 
 * Comprehensive pre-application guidance for Camden & Hampstead planning
 * Provides service options, fee calculations, and submission guidance
 */

// Pre-application service types
const PRE_APP_SERVICES: Record<string, {
  name: string;
  description: string;
  targetResponse: string;
  suitableFor: string[];
  includes: string[];
}> = {
  'written_advice': {
    name: 'Written Advice',
    description: 'Written response to your proposal without meeting',
    targetResponse: '20 working days',
    suitableFor: [
      'Minor householder extensions',
      'Straightforward change of use',
      'Simple commercial alterations',
      'Preliminary concept checking'
    ],
    includes: [
      'Assessment of principle of development',
      'Key policy considerations',
      'Indication of likely decision',
      'Written officer advice letter'
    ]
  },
  'meeting_small': {
    name: 'Pre-Application Meeting (Small)',
    description: 'Meeting with planning officer for small-scale proposals',
    targetResponse: '15 working days to arrange meeting',
    suitableFor: [
      'Householder extensions',
      'Minor residential developments (1-4 units)',
      'Small commercial changes',
      'Listed building alterations'
    ],
    includes: [
      'Pre-meeting written briefing',
      '1-hour meeting with planning officer',
      'Written follow-up advice',
      'Policy and guidance summary'
    ]
  },
  'meeting_medium': {
    name: 'Pre-Application Meeting (Medium)',
    description: 'Detailed consultation for medium-scale developments',
    targetResponse: '15 working days to arrange meeting',
    suitableFor: [
      'Residential developments (5-20 units)',
      'Commercial developments up to 1000sqm',
      'Mixed-use proposals',
      'Conservation area developments'
    ],
    includes: [
      'Detailed written briefing',
      '1.5-hour meeting with senior officer',
      'Consultation with specialists if needed',
      'Comprehensive written advice',
      'Follow-up clarification opportunity'
    ]
  },
  'meeting_major': {
    name: 'Pre-Application Meeting (Major)',
    description: 'Full pre-application service for major developments',
    targetResponse: '10 working days to arrange meeting',
    suitableFor: [
      'Major residential (20+ units)',
      'Large commercial (1000sqm+)',
      'Tall buildings',
      'Site allocations',
      'Strategic developments'
    ],
    includes: [
      'Detailed written briefing with policy review',
      'Initial meeting with team manager',
      'Specialist consultations (design, heritage, highways)',
      'Planning Performance Agreement option',
      'Comprehensive written advice',
      'Multiple follow-up meetings as needed'
    ]
  },
  'duty_planner': {
    name: 'Duty Planner Service',
    description: 'Free basic advice via phone or drop-in',
    targetResponse: 'Same day',
    suitableFor: [
      'Very simple queries',
      'Do I need planning permission questions',
      'Application process guidance',
      'General planning queries'
    ],
    includes: [
      'Basic verbal advice',
      'Signposting to relevant guidance',
      'Application form guidance',
      'No written confirmation'
    ]
  }
};

// Pre-application fees by development type
const PRE_APP_FEES: Record<string, {
  writtenOnly: number;
  withMeeting: number;
  additionalMeetings: number;
  description: string;
}> = {
  'householder': {
    writtenOnly: 150,
    withMeeting: 300,
    additionalMeetings: 150,
    description: 'Extensions, alterations to dwelling houses'
  },
  'householder_listed': {
    writtenOnly: 200,
    withMeeting: 400,
    additionalMeetings: 200,
    description: 'Listed building works to dwelling houses'
  },
  'minor_residential': {
    writtenOnly: 500,
    withMeeting: 1000,
    additionalMeetings: 500,
    description: 'New dwellings (1-4 units)'
  },
  'minor_commercial': {
    writtenOnly: 400,
    withMeeting: 800,
    additionalMeetings: 400,
    description: 'Commercial up to 499sqm'
  },
  'medium_residential': {
    writtenOnly: 1500,
    withMeeting: 3000,
    additionalMeetings: 1000,
    description: 'New dwellings (5-20 units)'
  },
  'medium_commercial': {
    writtenOnly: 1200,
    withMeeting: 2400,
    additionalMeetings: 800,
    description: 'Commercial 500-999sqm'
  },
  'major_residential': {
    writtenOnly: 3000,
    withMeeting: 6000,
    additionalMeetings: 2000,
    description: 'New dwellings (21-50 units)'
  },
  'major_commercial': {
    writtenOnly: 2500,
    withMeeting: 5000,
    additionalMeetings: 1500,
    description: 'Commercial 1000-4999sqm'
  },
  'large_major': {
    writtenOnly: 5000,
    withMeeting: 10000,
    additionalMeetings: 3000,
    description: '50+ dwellings or 5000sqm+ commercial'
  },
  'change_of_use': {
    writtenOnly: 300,
    withMeeting: 600,
    additionalMeetings: 300,
    description: 'Change of use applications'
  },
  'advertisements': {
    writtenOnly: 100,
    withMeeting: 200,
    additionalMeetings: 100,
    description: 'Advertisement consent'
  },
  'trees': {
    writtenOnly: 75,
    withMeeting: 150,
    additionalMeetings: 75,
    description: 'Tree works in conservation areas'
  }
};

// What to include in pre-app submission
const SUBMISSION_REQUIREMENTS: Record<string, {
  essential: string[];
  recommended: string[];
  optional: string[];
}> = {
  'householder': {
    essential: [
      'Location plan (1:1250 or 1:2500)',
      'Existing floor plans',
      'Proposed floor plans',
      'Description of proposal'
    ],
    recommended: [
      'Site photographs',
      'Existing and proposed elevations',
      'Design rationale statement'
    ],
    optional: [
      'Contextual street scene',
      'Materials samples',
      '3D visualisations'
    ]
  },
  'residential': {
    essential: [
      'Location plan',
      'Site plan (1:500)',
      'Floor plans existing and proposed',
      'Elevations existing and proposed',
      'Design and Access Statement outline',
      'Planning Statement outline'
    ],
    recommended: [
      'Daylight/sunlight preliminary assessment',
      'Transport statement outline',
      'Affordable housing statement',
      'Section drawings'
    ],
    optional: [
      'Landscape strategy',
      'Sustainability strategy',
      'Townscape analysis',
      'Verified views'
    ]
  },
  'major': {
    essential: [
      'Location and site plans',
      'Full drawings package',
      'Draft Design and Access Statement',
      'Draft Planning Statement',
      'Heritage Statement (if applicable)',
      'Preliminary environmental assessments'
    ],
    recommended: [
      'Townscape and Visual Impact Assessment outline',
      'Transport Assessment scope',
      'Environmental Statement scope',
      'Daylight/sunlight study',
      'Wind microclimate assessment',
      'Financial viability information'
    ],
    optional: [
      'Community engagement strategy',
      'Public benefits statement',
      'Design code',
      'Phasing strategy'
    ]
  },
  'listed_building': {
    essential: [
      'Location plan',
      'Existing drawings (full survey)',
      'Proposed drawings',
      'Heritage Impact Assessment outline',
      'Photographs of affected fabric'
    ],
    recommended: [
      'Historical research',
      'Significance assessment',
      'Justification statement',
      'Conservation architect involvement'
    ],
    optional: [
      'Structural survey',
      'Materials analysis',
      'Precedent examples',
      'Conservation management plan'
    ]
  }
};

// Key questions to address
const KEY_QUESTIONS = [
  'Is the principle of development acceptable?',
  'Is the proposed scale appropriate?',
  'What are the key design considerations?',
  'What policy constraints apply?',
  'Are there any material planning objections?',
  'What supporting documents will be required?',
  'What conditions might be applied?',
  'What is the likely decision outcome?'
];

// Benefits of pre-application advice
const PRE_APP_BENEFITS = [
  {
    benefit: 'Identify issues early',
    description: 'Discover potential problems before investing in a full application'
  },
  {
    benefit: 'Reduce refusal risk',
    description: 'Address concerns and improve chances of approval'
  },
  {
    benefit: 'Save time and money',
    description: 'Avoid costly amendments and resubmissions'
  },
  {
    benefit: 'Understand requirements',
    description: 'Know exactly what documents and information are needed'
  },
  {
    benefit: 'Build relationships',
    description: 'Establish positive dialogue with planning officers'
  },
  {
    benefit: 'Clarify policy position',
    description: 'Understand how policies apply to your specific site'
  },
  {
    benefit: 'Scope specialist reports',
    description: 'Determine what technical assessments are actually needed'
  },
  {
    benefit: 'Inform design development',
    description: 'Get early design guidance to shape proposals'
  }
];

// Hampstead-specific pre-app considerations
const HAMPSTEAD_CONSIDERATIONS = {
  conservation_areas: {
    name: 'Conservation Area Proposals',
    advice: [
      'Heritage officer will typically be consulted',
      'Character assessment essential',
      'Materials and detailing crucial',
      'Longer consultation may be needed',
      'Design quality expectations high'
    ]
  },
  listed_buildings: {
    name: 'Listed Building Works',
    advice: [
      'Conservation officer involvement essential',
      'Heritage Impact Assessment required',
      'Historic England may be consulted for Grade I/II*',
      'Original fabric retention prioritised',
      'Reversibility principle applies'
    ]
  },
  article_4: {
    name: 'Article 4 Areas',
    advice: [
      'Understand what PD rights have been removed',
      'Additional scrutiny applies',
      'Character preservation key',
      'May need planning permission for works elsewhere PD'
    ]
  },
  tree_heavy: {
    name: 'Areas with Significant Trees',
    advice: [
      'Tree officer may need to attend',
      'Arboricultural Impact Assessment likely',
      'Root Protection Areas affect layout',
      'TPOs and conservation area trees considered'
    ]
  },
  views_protection: {
    name: 'Protected View Corridors',
    advice: [
      'Height may be constrained',
      'LVMF views if relevant',
      'Local views and landmarks',
      'Verified view analysis may be needed'
    ]
  }
};

interface PreAppRequest {
  address: string;
  proposalType: string;
  proposalDescription: string;
  existingUse?: string;
  proposedUse?: string;
  siteArea?: number;
  floorspace?: {
    existing?: number;
    proposed?: number;
  };
  units?: {
    existing?: number;
    proposed?: number;
  };
  isListedBuilding?: boolean;
  isConservationArea?: boolean;
  hasProtectedTrees?: boolean;
  preferredServiceLevel?: string;
}

interface PreAppAssessment {
  address: string;
  recommendedService: {
    type: string;
    name: string;
    fee: number;
    additionalMeetingFee: number;
    targetResponse: string;
    includes: string[];
  };
  alternativeServices: Array<{
    type: string;
    name: string;
    fee: number;
    reason: string;
  }>;
  submissionRequirements: {
    essential: string[];
    recommended: string[];
    optional: string[];
  };
  keyQuestions: string[];
  specialConsiderations: string[];
  hampsteadFactors: Array<{
    factor: string;
    advice: string[];
  }>;
  benefits: string[];
  processSteps: Array<{
    step: number;
    action: string;
    timing: string;
  }>;
  recommendations: string[];
  estimatedTimeline: string;
  confidenceLevel: string;
}

class PreAppAdviceService {
  /**
   * Generate comprehensive pre-application advice guidance
   */
  public generatePreAppGuidance(request: PreAppRequest): PreAppAssessment {
    const developmentCategory = this.categorizeDevelopment(request);
    const recommendedService = this.recommendService(request, developmentCategory);
    const alternativeServices = this.getAlternativeServices(developmentCategory, recommendedService.type);
    const submissionReqs = this.getSubmissionRequirements(request, developmentCategory);
    const hampsteadFactors = this.assessHampsteadFactors(request);
    const processSteps = this.generateProcessSteps(recommendedService.type);
    
    return {
      address: request.address,
      recommendedService,
      alternativeServices,
      submissionRequirements: submissionReqs,
      keyQuestions: KEY_QUESTIONS,
      specialConsiderations: this.getSpecialConsiderations(request),
      hampsteadFactors,
      benefits: PRE_APP_BENEFITS.map(b => `${b.benefit}: ${b.description}`),
      processSteps,
      recommendations: this.generateRecommendations(request, developmentCategory),
      estimatedTimeline: this.estimateTimeline(recommendedService.type, developmentCategory),
      confidenceLevel: this.assessConfidence(request)
    };
  }

  /**
   * Categorize the development type
   */
  private categorizeDevelopment(request: PreAppRequest): string {
    const proposedUnits = request.units?.proposed || 0;
    const proposedFloorspace = request.floorspace?.proposed || 0;
    
    // Listed building category
    if (request.isListedBuilding) {
      return 'householder_listed';
    }
    
    // Householder
    if (request.proposalType.toLowerCase().includes('extension') ||
        request.proposalType.toLowerCase().includes('alteration')) {
      return 'householder';
    }
    
    // Large major
    if (proposedUnits > 50 || proposedFloorspace > 5000) {
      return 'large_major';
    }
    
    // Major
    if (proposedUnits > 20 || proposedFloorspace > 1000) {
      if (proposedUnits > 0) return 'major_residential';
      return 'major_commercial';
    }
    
    // Medium
    if (proposedUnits > 4 || proposedFloorspace > 500) {
      if (proposedUnits > 0) return 'medium_residential';
      return 'medium_commercial';
    }
    
    // Minor
    if (proposedUnits > 0) {
      return 'minor_residential';
    }
    
    if (proposedFloorspace > 0) {
      return 'minor_commercial';
    }
    
    // Change of use
    if (request.proposalType.toLowerCase().includes('change of use')) {
      return 'change_of_use';
    }
    
    // Default to householder
    return 'householder';
  }

  /**
   * Recommend appropriate pre-app service
   */
  private recommendService(
    request: PreAppRequest,
    developmentCategory: string
  ): {
    type: string;
    name: string;
    fee: number;
    additionalMeetingFee: number;
    targetResponse: string;
    includes: string[];
  } {
    // Get fee info
    const feeInfo = PRE_APP_FEES[developmentCategory];
    const defaultFees = { writtenOnly: 300, withMeeting: 600, additionalMeetings: 300, description: 'Standard fee' };
    const fees = feeInfo || defaultFees;
    
    // Determine service type based on complexity
    let serviceType = 'written_advice';
    
    // Complex sites need meetings
    if (request.isListedBuilding || request.isConservationArea || request.hasProtectedTrees) {
      serviceType = 'meeting_small';
    }
    
    // Larger schemes need more
    if (developmentCategory.includes('medium')) {
      serviceType = 'meeting_medium';
    }
    
    if (developmentCategory.includes('major') || developmentCategory === 'large_major') {
      serviceType = 'meeting_major';
    }
    
    // Respect user preference if sensible
    if (request.preferredServiceLevel) {
      const preferred = request.preferredServiceLevel.toLowerCase();
      if (preferred.includes('written') && !developmentCategory.includes('major')) {
        serviceType = 'written_advice';
      }
      if (preferred.includes('meeting') || preferred.includes('face')) {
        if (developmentCategory.includes('householder')) {
          serviceType = 'meeting_small';
        }
      }
    }
    
    const serviceInfo = PRE_APP_SERVICES[serviceType];
    const defaultService = {
      name: 'Standard Pre-Application Advice',
      description: 'Pre-application consultation',
      targetResponse: '20 working days',
      suitableFor: ['General planning queries'],
      includes: ['Written advice', 'Policy review']
    };
    const service = serviceInfo || defaultService;
    
    const fee = serviceType === 'written_advice' ? fees.writtenOnly : fees.withMeeting;
    
    return {
      type: serviceType,
      name: service.name,
      fee,
      additionalMeetingFee: fees.additionalMeetings,
      targetResponse: service.targetResponse,
      includes: service.includes
    };
  }

  /**
   * Get alternative service options
   */
  private getAlternativeServices(
    developmentCategory: string,
    recommendedType: string
  ): Array<{
    type: string;
    name: string;
    fee: number;
    reason: string;
  }> {
    const alternatives: Array<{
      type: string;
      name: string;
      fee: number;
      reason: string;
    }> = [];
    
    const feeInfo = PRE_APP_FEES[developmentCategory];
    const defaultFees = { writtenOnly: 300, withMeeting: 600, additionalMeetings: 300, description: 'Standard fee' };
    const fees = feeInfo || defaultFees;
    
    // Duty planner - always available for simple queries
    if (recommendedType !== 'duty_planner') {
      const dutyService = PRE_APP_SERVICES['duty_planner'];
      if (dutyService) {
        alternatives.push({
          type: 'duty_planner',
          name: dutyService.name,
          fee: 0,
          reason: 'Free option for very simple queries'
        });
      }
    }
    
    // Written advice if meeting recommended
    if (recommendedType !== 'written_advice' && !developmentCategory.includes('major')) {
      const writtenService = PRE_APP_SERVICES['written_advice'];
      if (writtenService) {
        alternatives.push({
          type: 'written_advice',
          name: writtenService.name,
          fee: fees.writtenOnly,
          reason: 'Lower cost option without meeting'
        });
      }
    }
    
    // Meeting upgrade if written recommended
    if (recommendedType === 'written_advice') {
      const meetingService = PRE_APP_SERVICES['meeting_small'];
      if (meetingService) {
        alternatives.push({
          type: 'meeting_small',
          name: meetingService.name,
          fee: fees.withMeeting,
          reason: 'Face-to-face discussion for more detailed guidance'
        });
      }
    }
    
    return alternatives;
  }

  /**
   * Get submission requirements for the development type
   */
  private getSubmissionRequirements(
    request: PreAppRequest,
    developmentCategory: string
  ): {
    essential: string[];
    recommended: string[];
    optional: string[];
  } {
    let reqType = 'householder';
    
    if (request.isListedBuilding) {
      reqType = 'listed_building';
    } else if (developmentCategory.includes('major') || developmentCategory === 'large_major') {
      reqType = 'major';
    } else if (developmentCategory.includes('residential') || developmentCategory.includes('medium')) {
      reqType = 'residential';
    }
    
    const requirements = SUBMISSION_REQUIREMENTS[reqType];
    const defaultReqs = {
      essential: ['Location plan', 'Description of proposal'],
      recommended: ['Site photographs', 'Drawings'],
      optional: ['Supporting statement']
    };
    
    return requirements || defaultReqs;
  }

  /**
   * Assess Hampstead-specific factors
   */
  private assessHampsteadFactors(
    request: PreAppRequest
  ): Array<{
    factor: string;
    advice: string[];
  }> {
    const factors: Array<{
      factor: string;
      advice: string[];
    }> = [];
    
    if (request.isConservationArea) {
      const caConsiderations = HAMPSTEAD_CONSIDERATIONS.conservation_areas;
      factors.push({
        factor: caConsiderations.name,
        advice: caConsiderations.advice
      });
    }
    
    if (request.isListedBuilding) {
      const lbConsiderations = HAMPSTEAD_CONSIDERATIONS.listed_buildings;
      factors.push({
        factor: lbConsiderations.name,
        advice: lbConsiderations.advice
      });
    }
    
    if (request.hasProtectedTrees) {
      const treeConsiderations = HAMPSTEAD_CONSIDERATIONS.tree_heavy;
      factors.push({
        factor: treeConsiderations.name,
        advice: treeConsiderations.advice
      });
    }
    
    // Check for Article 4 areas in Hampstead
    const address = request.address.toLowerCase();
    if (address.includes('hampstead') || address.includes('nw3')) {
      const article4 = HAMPSTEAD_CONSIDERATIONS.article_4;
      factors.push({
        factor: article4.name,
        advice: article4.advice
      });
    }
    
    return factors;
  }

  /**
   * Get special considerations based on request
   */
  private getSpecialConsiderations(request: PreAppRequest): string[] {
    const considerations: string[] = [];
    
    if (request.isListedBuilding) {
      considerations.push('Listed Building Consent will be required in addition to planning permission');
      considerations.push('Works to listed buildings require specialist conservation advice');
      considerations.push('Historic England consultation may be required for Grade I and II* buildings');
    }
    
    if (request.isConservationArea) {
      considerations.push('Conservation area consent required for demolition');
      considerations.push('Design must preserve or enhance conservation area character');
      considerations.push('Materials and detailing will be closely scrutinized');
    }
    
    if (request.hasProtectedTrees) {
      considerations.push('Arboricultural Impact Assessment will be required');
      considerations.push('Tree Preservation Orders may constrain development');
      considerations.push('Tree protection during construction must be demonstrated');
    }
    
    // Development type specific
    const units = request.units?.proposed || 0;
    if (units > 10) {
      considerations.push('Affordable housing provision will be required');
      considerations.push('Housing mix policy applies');
    }
    
    if (units > 50 || (request.floorspace?.proposed || 0) > 5000) {
      considerations.push('EIA Screening may be required');
      considerations.push('Planning Performance Agreement recommended');
    }
    
    return considerations;
  }

  /**
   * Generate process steps
   */
  private generateProcessSteps(
    serviceType: string
  ): Array<{
    step: number;
    action: string;
    timing: string;
  }> {
    const steps: Array<{
      step: number;
      action: string;
      timing: string;
    }> = [];
    
    steps.push({
      step: 1,
      action: 'Gather information and prepare drawings',
      timing: 'Before submission'
    });
    
    steps.push({
      step: 2,
      action: 'Complete pre-application form and calculate fee',
      timing: '1-2 days'
    });
    
    steps.push({
      step: 3,
      action: 'Submit pre-application request online or by post',
      timing: 'Day 1'
    });
    
    steps.push({
      step: 4,
      action: 'Council acknowledges receipt and allocates officer',
      timing: 'Within 5 working days'
    });
    
    if (serviceType !== 'written_advice' && serviceType !== 'duty_planner') {
      steps.push({
        step: 5,
        action: 'Officer reviews proposal and arranges meeting',
        timing: '10-15 working days'
      });
      
      steps.push({
        step: 6,
        action: 'Attend meeting with planning officer',
        timing: 'As arranged'
      });
      
      steps.push({
        step: 7,
        action: 'Receive written advice following meeting',
        timing: '10 working days after meeting'
      });
    } else {
      steps.push({
        step: 5,
        action: 'Officer assesses proposal',
        timing: '15-20 working days'
      });
      
      steps.push({
        step: 6,
        action: 'Receive written advice letter',
        timing: 'Within target response time'
      });
    }
    
    steps.push({
      step: steps.length + 1,
      action: 'Review advice and develop/amend proposals',
      timing: 'As needed'
    });
    
    steps.push({
      step: steps.length + 1,
      action: 'Submit formal planning application',
      timing: 'When ready'
    });
    
    return steps;
  }

  /**
   * Generate recommendations
   */
  private generateRecommendations(
    request: PreAppRequest,
    developmentCategory: string
  ): string[] {
    const recommendations: string[] = [];
    
    // General recommendations
    recommendations.push('Request pre-application advice before finalising your design');
    recommendations.push('Use pre-app feedback to refine proposals before formal submission');
    
    // Complexity-based
    if (request.isListedBuilding) {
      recommendations.push('Engage a conservation-accredited architect');
      recommendations.push('Prepare detailed heritage impact assessment');
      recommendations.push('Consider sequential approach - test principle first');
    }
    
    if (request.isConservationArea) {
      recommendations.push('Study local character and refer to area appraisal');
      recommendations.push('Use appropriate traditional materials');
      recommendations.push('Consider impact on neighbouring properties');
    }
    
    // Scale-based
    if (developmentCategory.includes('major')) {
      recommendations.push('Consider Planning Performance Agreement for major schemes');
      recommendations.push('Engage with Design Review Panel if available');
      recommendations.push('Undertake early community engagement');
      recommendations.push('Scope environmental assessments early');
    }
    
    if (developmentCategory.includes('medium')) {
      recommendations.push('Prepare comprehensive daylight/sunlight assessment');
      recommendations.push('Consider neighbour notification and engagement');
    }
    
    // General best practice
    recommendations.push('Photograph the site and surroundings thoroughly');
    recommendations.push('Research planning history of site and neighbours');
    recommendations.push('Review relevant planning policies before meeting');
    
    return recommendations;
  }

  /**
   * Estimate overall timeline
   */
  private estimateTimeline(serviceType: string, developmentCategory: string): string {
    let preAppDays = 20;
    
    if (serviceType === 'meeting_small') {
      preAppDays = 25;
    } else if (serviceType === 'meeting_medium') {
      preAppDays = 30;
    } else if (serviceType === 'meeting_major') {
      preAppDays = 40;
    }
    
    let applicationDays = 56; // 8 weeks standard
    
    if (developmentCategory.includes('major')) {
      applicationDays = 91; // 13 weeks major
    }
    
    const totalWeeks = Math.ceil((preAppDays + applicationDays) / 7);
    
    return `${Math.ceil(preAppDays / 5)} working days for pre-app, then ${Math.ceil(applicationDays / 7)} weeks for application determination. Total approximately ${totalWeeks} weeks from pre-app submission to decision.`;
  }

  /**
   * Assess confidence level in guidance
   */
  private assessConfidence(request: PreAppRequest): string {
    let confidence = 'HIGH';
    
    // Reduce confidence for complex scenarios
    if (request.isListedBuilding && request.isConservationArea) {
      confidence = 'MEDIUM';
    }
    
    const units = request.units?.proposed || 0;
    const floorspace = request.floorspace?.proposed || 0;
    
    if (units > 50 || floorspace > 5000) {
      confidence = 'MEDIUM';
    }
    
    if (!request.proposalDescription || request.proposalDescription.length < 20) {
      confidence = 'LOW';
    }
    
    return confidence;
  }

  /**
   * Calculate pre-app fee
   */
  public calculateFee(
    developmentType: string,
    serviceLevel: 'written' | 'meeting' | 'additional'
  ): {
    fee: number;
    description: string;
    includes: string[];
    vatNote: string;
  } {
    const feeInfo = PRE_APP_FEES[developmentType];
    const defaultFees = {
      writtenOnly: 300,
      withMeeting: 600,
      additionalMeetings: 300,
      description: 'Standard pre-application fee'
    };
    const fees = feeInfo || defaultFees;
    
    let fee = fees.writtenOnly;
    let levelDesc = 'Written advice only';
    
    if (serviceLevel === 'meeting') {
      fee = fees.withMeeting;
      levelDesc = 'Including meeting';
    } else if (serviceLevel === 'additional') {
      fee = fees.additionalMeetings;
      levelDesc = 'Additional meeting';
    }
    
    const serviceInfo = PRE_APP_SERVICES[serviceLevel === 'written' ? 'written_advice' : 'meeting_small'];
    const defaultService = { includes: ['Written advice', 'Policy review'] };
    const service = serviceInfo || defaultService;
    
    return {
      fee,
      description: `${fees.description} - ${levelDesc}`,
      includes: service.includes,
      vatNote: 'Pre-application fees are exempt from VAT'
    };
  }

  /**
   * Get all available service types
   */
  public getServiceTypes(): Array<{
    type: string;
    name: string;
    description: string;
    targetResponse: string;
  }> {
    return Object.entries(PRE_APP_SERVICES).map(([type, info]) => ({
      type,
      name: info.name,
      description: info.description,
      targetResponse: info.targetResponse
    }));
  }

  /**
   * Get all fee categories
   */
  public getFeeCategories(): Array<{
    category: string;
    description: string;
    writtenFee: number;
    meetingFee: number;
  }> {
    return Object.entries(PRE_APP_FEES).map(([category, info]) => ({
      category,
      description: info.description,
      writtenFee: info.writtenOnly,
      meetingFee: info.withMeeting
    }));
  }

  /**
   * Get benefits of pre-app advice
   */
  public getBenefits(): Array<{
    benefit: string;
    description: string;
  }> {
    return PRE_APP_BENEFITS;
  }
}

export default PreAppAdviceService;
