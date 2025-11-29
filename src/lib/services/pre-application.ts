/**
 * Pre-Application Advice Service
 * 
 * Comprehensive guidance for seeking pre-application planning advice
 * from Local Planning Authorities
 */

// Types
interface PreApplicationAdvice {
  address: string;
  postcode: string;
  projectType: string;
  overview: PreAppOverview;
  serviceOptions: ServiceOption[];
  preparation: PreparationGuide;
  submission: SubmissionRequirements;
  meeting: MeetingGuide;
  interpretation: ResponseInterpretation;
  costs: PreAppCosts;
  timeline: PreAppTimeline;
}

interface PreAppOverview {
  description: string;
  benefits: string[];
  limitations: string[];
  whenRecommended: string[];
  whenNotNeeded: string[];
}

interface ServiceOption {
  name: string;
  description: string;
  cost: number;
  turnaround: string;
  includes: string[];
  suitableFor: string[];
}

interface PreparationGuide {
  essentialInformation: InfoRequirement[];
  supportingMaterial: MaterialRequirement[];
  questionsToAsk: string[];
  commonMistakes: string[];
}

interface InfoRequirement {
  item: string;
  detail: string;
  importance: 'essential' | 'recommended' | 'optional';
}

interface MaterialRequirement {
  material: string;
  purpose: string;
  format: string;
  required: boolean;
}

interface SubmissionRequirements {
  form: FormRequirements;
  documents: DocumentRequirement[];
  fees: FeeInfo;
  submissionMethod: string[];
}

interface FormRequirements {
  formName: string;
  sections: string[];
  tips: string[];
}

interface DocumentRequirement {
  document: string;
  required: boolean;
  specification: string;
  purpose: string;
}

interface FeeInfo {
  paymentMethods: string[];
  refundPolicy: string;
  vatApplicable: boolean;
}

interface MeetingGuide {
  format: MeetingFormat[];
  attendees: AttendeeGuide;
  agenda: AgendaItem[];
  conductTips: string[];
  followUp: string[];
}

interface MeetingFormat {
  type: string;
  description: string;
  advantages: string[];
  duration: string;
}

interface AttendeeGuide {
  recommended: string[];
  optional: string[];
  lpaSide: string[];
}

interface AgendaItem {
  topic: string;
  duration: string;
  keyPoints: string[];
}

interface ResponseInterpretation {
  responseTypes: ResponseType[];
  positiveIndicators: string[];
  cautionaryIndicators: string[];
  negativeIndicators: string[];
  nextSteps: NextStepGuide[];
}

interface ResponseType {
  type: string;
  meaning: string;
  action: string;
}

interface NextStepGuide {
  scenario: string;
  recommendation: string;
  timeline: string;
}

interface PreAppCosts {
  camdenFees: CamdenFee[];
  otherCosts: OtherCost[];
  valueAssessment: string;
}

interface CamdenFee {
  category: string;
  description: string;
  fee: number;
  includesMeeting: boolean;
}

interface OtherCost {
  item: string;
  cost: string;
  notes: string;
}

interface PreAppTimeline {
  submission: TimelineStage;
  assessment: TimelineStage;
  response: TimelineStage;
  meeting: TimelineStage;
  totalTypical: string;
}

interface TimelineStage {
  stage: string;
  duration: string;
  notes: string;
}

// Camden Pre-Application Fee Structure (2024)
const CAMDEN_PREAPP_FEES: { [key: string]: { fee: number; turnaround: string; meeting: boolean } } = {
  'householder-written': { fee: 250, turnaround: '28 days', meeting: false },
  'householder-meeting': { fee: 500, turnaround: '28 days', meeting: true },
  'minor-written': { fee: 500, turnaround: '35 days', meeting: false },
  'minor-meeting': { fee: 1000, turnaround: '35 days', meeting: true },
  'major-small': { fee: 2500, turnaround: '42 days', meeting: true },
  'major-medium': { fee: 5000, turnaround: '42 days', meeting: true },
  'major-large': { fee: 10000, turnaround: 'Negotiated', meeting: true }
};

/**
 * Get comprehensive pre-application advice guide
 */
export async function getPreApplicationGuide(
  address: string,
  postcode: string,
  projectType: string,
  projectDetails?: {
    developmentType?: 'householder' | 'minor' | 'major';
    numUnits?: number;
    floorArea?: number;
    conservationArea?: boolean;
    listedBuilding?: boolean;
    previousRefusal?: boolean;
    controversialAspects?: string[];
  }
): Promise<PreApplicationAdvice> {
  const normalizedType = projectType.toLowerCase().replace(/\s+/g, '-');
  const developmentType = projectDetails?.developmentType || determineDevelopmentType(projectDetails);
  const isHeritage = !!(projectDetails?.conservationArea || projectDetails?.listedBuilding);
  
  const overview = generateOverview(normalizedType, projectDetails);
  const serviceOptions = generateServiceOptions(developmentType, isHeritage);
  const preparation = generatePreparationGuide(normalizedType, projectDetails);
  const submission = generateSubmissionRequirements(developmentType);
  const meeting = generateMeetingGuide(normalizedType, projectDetails);
  const interpretation = generateResponseInterpretation();
  const costs = generateCosts(developmentType);
  const timeline = generateTimeline(developmentType);
  
  return {
    address,
    postcode,
    projectType,
    overview,
    serviceOptions,
    preparation,
    submission,
    meeting,
    interpretation,
    costs,
    timeline
  };
}

/**
 * Determine development type from project details
 */
function determineDevelopmentType(
  projectDetails?: {
    developmentType?: 'householder' | 'minor' | 'major';
    numUnits?: number;
    floorArea?: number;
    conservationArea?: boolean;
    listedBuilding?: boolean;
    previousRefusal?: boolean;
    controversialAspects?: string[];
  }
): 'householder' | 'minor' | 'major' {
  if (!projectDetails) return 'householder';
  
  if (projectDetails.numUnits && projectDetails.numUnits >= 10) return 'major';
  if (projectDetails.floorArea && projectDetails.floorArea >= 1000) return 'major';
  if (projectDetails.numUnits && projectDetails.numUnits > 0) return 'minor';
  
  return 'householder';
}

/**
 * Generate overview
 */
function generateOverview(
  projectType: string,
  projectDetails?: {
    developmentType?: 'householder' | 'minor' | 'major';
    numUnits?: number;
    floorArea?: number;
    conservationArea?: boolean;
    listedBuilding?: boolean;
    previousRefusal?: boolean;
    controversialAspects?: string[];
  }
): PreAppOverview {
  return {
    description: 'Pre-application advice allows you to discuss your development proposals with planning officers before submitting a formal application. This can help identify issues early and increase the chances of approval.',
    benefits: [
      'Identify key planning issues early',
      'Understand relevant policies',
      'Receive design guidance',
      'Assess likelihood of approval',
      'Opportunity to negotiate and refine scheme',
      'Build relationship with planning officer',
      'Potential for faster application determination',
      'Reduce risk of costly refusal'
    ],
    limitations: [
      'Advice is informal and non-binding',
      'Officers cannot guarantee approval',
      'Policy context may change',
      'Different officer may determine application',
      'Fee is not refundable',
      'Neighbor views not yet known',
      'Committee may disagree with officer'
    ],
    whenRecommended: [
      'Complex or sensitive proposals',
      'Sites in conservation areas or near listed buildings',
      'Proposals that may be contentious',
      'Significant departures from existing use',
      'Where previous applications have been refused',
      'Major developments',
      'Uncertain policy position',
      'First-time applicants'
    ],
    whenNotNeeded: [
      'Simple householder extensions with clear precedent',
      'Proposals clearly within permitted development',
      'Very minor alterations',
      'Where you have recent pre-app for same site',
      'Time-critical applications (pre-app adds 4-6 weeks)'
    ]
  };
}

/**
 * Generate service options
 */
function generateServiceOptions(
  developmentType: 'householder' | 'minor' | 'major',
  isHeritage: boolean
): ServiceOption[] {
  const options: ServiceOption[] = [];
  
  if (developmentType === 'householder') {
    options.push({
      name: 'Householder Written Response',
      description: 'Written advice without a meeting',
      cost: 250,
      turnaround: '28 days',
      includes: [
        'Written response from planning officer',
        'Assessment against relevant policies',
        'Design guidance',
        'Key issues identification'
      ],
      suitableFor: ['Simple extensions', 'Clear-cut proposals', 'Budget-conscious applicants']
    });
    
    options.push({
      name: 'Householder Meeting + Written Response',
      description: 'Site/virtual meeting with written follow-up',
      cost: 500,
      turnaround: '28 days',
      includes: [
        '30-minute meeting with planning officer',
        'Site visit if requested',
        'Written response following meeting',
        'Opportunity for Q&A'
      ],
      suitableFor: ['Complex householder proposals', 'Heritage sites', 'Contentious proposals']
    });
  }
  
  if (developmentType === 'minor' || developmentType === 'major') {
    options.push({
      name: 'Minor Development',
      description: 'For proposals creating 1-9 residential units or <1000sqm commercial',
      cost: developmentType === 'minor' ? 1000 : 2500,
      turnaround: '35-42 days',
      includes: [
        'Meeting with planning officer',
        'Detailed written response',
        'Policy analysis',
        'Design review',
        'S106/CIL indication'
      ],
      suitableFor: ['Conversions', 'Small residential developments', 'Change of use']
    });
  }
  
  if (developmentType === 'major') {
    options.push({
      name: 'Major Development',
      description: 'For proposals 10+ units or 1000sqm+',
      cost: 5000,
      turnaround: '42 days or negotiated',
      includes: [
        'Multiple meetings',
        'Involvement of specialist officers',
        'Detailed written response',
        'Design review panel option',
        'Viability discussion',
        'S106 heads of terms'
      ],
      suitableFor: ['Large residential schemes', 'Commercial developments', 'Mixed-use schemes']
    });
  }
  
  // Add heritage-specific option if relevant
  if (isHeritage) {
    options.push({
      name: 'Heritage Review',
      description: 'Additional conservation officer input',
      cost: 250,
      turnaround: 'Included in main pre-app',
      includes: [
        'Conservation officer assessment',
        'Heritage impact review',
        'Design guidance for heritage context',
        'Listed building consent indication'
      ],
      suitableFor: ['Listed buildings', 'Conservation areas', 'Settings of heritage assets']
    });
  }
  
  return options;
}

/**
 * Generate preparation guide
 */
function generatePreparationGuide(
  projectType: string,
  projectDetails?: {
    developmentType?: 'householder' | 'minor' | 'major';
    numUnits?: number;
    floorArea?: number;
    conservationArea?: boolean;
    listedBuilding?: boolean;
    previousRefusal?: boolean;
    controversialAspects?: string[];
  }
): PreparationGuide {
  const essentialInfo: InfoRequirement[] = [
    { item: 'Site address', detail: 'Full postal address and postcode', importance: 'essential' },
    { item: 'Site plan', detail: 'Location plan showing site in red outline', importance: 'essential' },
    { item: 'Proposal description', detail: 'Clear description of what is proposed', importance: 'essential' },
    { item: 'Existing situation', detail: 'Current use, buildings, constraints', importance: 'essential' },
    { item: 'Planning history', detail: 'Previous applications and decisions', importance: 'essential' }
  ];
  
  if (projectDetails?.conservationArea || projectDetails?.listedBuilding) {
    essentialInfo.push(
      { item: 'Heritage context', detail: 'Significance of heritage assets', importance: 'essential' },
      { item: 'Conservation area appraisal', detail: 'Reference to relevant CA appraisal', importance: 'recommended' }
    );
  }
  
  const supportingMaterial: MaterialRequirement[] = [
    { material: 'Site photographs', purpose: 'Show existing condition', format: 'Digital images, clearly labelled', required: true },
    { material: 'Sketch designs', purpose: 'Illustrate proposal', format: 'Plans, elevations, 3D views', required: true },
    { material: 'Design rationale', purpose: 'Explain design approach', format: 'Brief written statement', required: false },
    { material: 'Site analysis', purpose: 'Show context and constraints', format: 'Annotated plan/photos', required: false },
    { material: 'Precedent images', purpose: 'Show design references', format: 'Photographs/examples', required: false }
  ];
  
  const questionsToAsk: string[] = [
    'Is the principle of development acceptable?',
    'Are there fundamental policy objections?',
    'What is the officer\'s view on the design approach?',
    'Are there specific areas of concern?',
    'What changes would improve the scheme?',
    'Is the proposed scale/massing acceptable?',
    'Are there material considerations that might affect the decision?',
    'What level of detail will be needed for the application?',
    'Are there any Section 106 or CIL implications?',
    'What is the likely determination route (delegated/committee)?'
  ];
  
  if (projectDetails?.previousRefusal) {
    questionsToAsk.push(
      'What specifically needs to change to overcome previous refusal?',
      'Are the changes proposed sufficient to address the concerns?'
    );
  }
  
  return {
    essentialInformation: essentialInfo,
    supportingMaterial,
    questionsToAsk,
    commonMistakes: [
      'Submitting too little information - officers cannot advise on vague proposals',
      'Not researching planning history first',
      'Treating pre-app as guaranteed approval',
      'Not preparing specific questions',
      'Dominating the meeting rather than listening',
      'Ignoring heritage constraints',
      'Not bringing the right people to the meeting',
      'Failing to take notes during the meeting'
    ]
  };
}

/**
 * Generate submission requirements
 */
function generateSubmissionRequirements(developmentType: 'householder' | 'minor' | 'major'): SubmissionRequirements {
  return {
    form: {
      formName: 'Camden Pre-Application Advice Request Form',
      sections: [
        'Applicant/agent details',
        'Site address and location',
        'Proposal description',
        'Planning history',
        'Meeting preference',
        'Questions for officer'
      ],
      tips: [
        'Be specific about what you want advice on',
        'List key questions clearly',
        'Indicate preferred meeting dates/times',
        'Note if you have specific constraints (e.g., timing)'
      ]
    },
    documents: [
      { document: 'Site location plan', required: true, specification: '1:1250 or 1:2500, site edged red', purpose: 'Identify exact site location' },
      { document: 'Block plan', required: true, specification: '1:500 or 1:200', purpose: 'Show site in immediate context' },
      { document: 'Existing plans', required: true, specification: '1:100 or 1:50', purpose: 'Show current building arrangement' },
      { document: 'Proposed plans', required: true, specification: '1:100 or 1:50', purpose: 'Show proposal clearly' },
      { document: 'Elevations', required: true, specification: '1:100 or 1:50', purpose: 'Show external appearance' },
      { document: 'Site photographs', required: true, specification: 'Dated and labelled', purpose: 'Visual evidence of site' },
      { document: 'Design statement', required: developmentType !== 'householder', specification: 'PDF document', purpose: 'Explain design rationale' }
    ],
    fees: {
      paymentMethods: ['Credit/debit card', 'BACS transfer', 'Cheque'],
      refundPolicy: 'No refunds once enquiry has been logged',
      vatApplicable: false
    },
    submissionMethod: [
      'Online via Camden Planning Portal',
      'Email to planning@camden.gov.uk with form and documents',
      'Hard copy to Planning Reception (by appointment)'
    ]
  };
}

/**
 * Generate meeting guide
 */
function generateMeetingGuide(
  projectType: string,
  projectDetails?: {
    developmentType?: 'householder' | 'minor' | 'major';
    numUnits?: number;
    floorArea?: number;
    conservationArea?: boolean;
    listedBuilding?: boolean;
    previousRefusal?: boolean;
    controversialAspects?: string[];
  }
): MeetingGuide {
  return {
    format: [
      {
        type: 'Site visit',
        description: 'Meeting at the site',
        advantages: ['Officer sees context directly', 'Can discuss specific features', 'Demonstrates commitment'],
        duration: '30-60 minutes'
      },
      {
        type: 'Virtual meeting',
        description: 'Video call via Teams/Zoom',
        advantages: ['Convenient', 'Easy to share screens', 'Good for initial discussions'],
        duration: '30-60 minutes'
      },
      {
        type: 'Office meeting',
        description: 'Meeting at council offices',
        advantages: ['Formal setting', 'Easy access to files', 'Can involve multiple officers'],
        duration: '30-60 minutes'
      }
    ],
    attendees: {
      recommended: [
        'Applicant/property owner',
        'Architect/designer',
        'Planning consultant (if appointed)'
      ],
      optional: [
        'Structural engineer',
        'Heritage consultant',
        'Developer/investor'
      ],
      lpaSide: [
        'Case officer',
        'Conservation officer (if heritage)',
        'Design officer (major schemes)',
        'Highways officer (if traffic implications)'
      ]
    },
    agenda: [
      { topic: 'Introductions', duration: '2 mins', keyPoints: ['Who everyone is', 'Their role in the project'] },
      { topic: 'Site context', duration: '5 mins', keyPoints: ['Existing situation', 'Site history', 'Constraints'] },
      { topic: 'Proposal presentation', duration: '10 mins', keyPoints: ['What is proposed', 'Design approach', 'Key features'] },
      { topic: 'Officer feedback', duration: '10 mins', keyPoints: ['Policy position', 'Design comments', 'Key issues'] },
      { topic: 'Q&A discussion', duration: '10 mins', keyPoints: ['Your prepared questions', 'Points of clarification'] },
      { topic: 'Next steps', duration: '3 mins', keyPoints: ['Timeline for response', 'Application advice'] }
    ],
    conductTips: [
      'Listen more than you talk',
      'Take detailed notes',
      'Ask for clarification if unclear',
      'Don\'t argue with negative feedback',
      'Ask how concerns might be addressed',
      'Confirm key points before ending',
      'Thank the officer for their time'
    ],
    followUp: [
      'Send thank you email within 24 hours',
      'Summarize your understanding of key points',
      'Request written response if not included',
      'Discuss with design team',
      'Revise scheme if needed',
      'Prepare for application submission'
    ]
  };
}

/**
 * Generate response interpretation guide
 */
function generateResponseInterpretation(): ResponseInterpretation {
  return {
    responseTypes: [
      {
        type: 'Positive support',
        meaning: 'Officer supports the proposal in principle and believes it is likely to be approved',
        action: 'Proceed to application with confidence, addressing any minor points raised'
      },
      {
        type: 'Conditional support',
        meaning: 'Officer supports proposal but highlights specific changes needed',
        action: 'Revise scheme to address concerns before submitting application'
      },
      {
        type: 'Neutral/uncertain',
        meaning: 'Officer cannot give clear guidance, often due to finely balanced issues',
        action: 'Consider whether to proceed, possibly with further pre-app or accepting risk'
      },
      {
        type: 'Negative indication',
        meaning: 'Officer indicates proposal is likely to be refused',
        action: 'Significantly redesign or reconsider project scope'
      },
      {
        type: 'Fundamental objection',
        meaning: 'Proposal conflicts with policy in principle',
        action: 'Consider whether proposal is viable; may need different approach entirely'
      }
    ],
    positiveIndicators: [
      '"We would be likely to support..."',
      '"The principle is acceptable..."',
      '"Subject to addressing [minor points]..."',
      '"We would recommend approval..."',
      '"This aligns with policy..."',
      'Detailed design suggestions (means they\'re thinking about making it work)',
      'Discussion of conditions that might apply'
    ],
    cautionaryIndicators: [
      '"On balance..."',
      '"This is finely balanced..."',
      '"There are concerns about..."',
      '"We would need to see..."',
      '"This will require careful justification..."',
      '"Committee may have different views..."',
      'Extensive list of required changes'
    ],
    negativeIndicators: [
      '"We would be unlikely to support..."',
      '"This conflicts with policy..."',
      '"We would recommend refusal..."',
      '"The harm outweighs..."',
      '"This would set an unwelcome precedent..."',
      '"This is unacceptable in principle..."',
      'Focus on fundamental issues rather than design details'
    ],
    nextSteps: [
      { scenario: 'Positive response', recommendation: 'Proceed to application within 6 months while advice is current', timeline: '2-4 weeks' },
      { scenario: 'Conditional support', recommendation: 'Revise scheme and consider follow-up pre-app if substantial changes', timeline: '4-8 weeks' },
      { scenario: 'Negative response', recommendation: 'Reconsider fundamentally; possibly seek second opinion or appeal route', timeline: 'Varies' }
    ]
  };
}

/**
 * Generate costs
 */
function generateCosts(developmentType: 'householder' | 'minor' | 'major'): PreAppCosts {
  const camdenFees: CamdenFee[] = [
    { category: 'Householder (written only)', description: 'Extensions, alterations to houses', fee: 250, includesMeeting: false },
    { category: 'Householder (with meeting)', description: 'Extensions, alterations - with officer meeting', fee: 500, includesMeeting: true },
    { category: 'Minor (written only)', description: '1-9 units or <1000sqm', fee: 500, includesMeeting: false },
    { category: 'Minor (with meeting)', description: '1-9 units or <1000sqm - with meeting', fee: 1000, includesMeeting: true },
    { category: 'Major (small)', description: '10-24 units or 1000-2499sqm', fee: 2500, includesMeeting: true },
    { category: 'Major (medium)', description: '25-99 units or 2500-4999sqm', fee: 5000, includesMeeting: true },
    { category: 'Major (large)', description: '100+ units or 5000sqm+', fee: 10000, includesMeeting: true }
  ];
  
  const otherCosts: OtherCost[] = [
    { item: 'Architect/designer time', cost: '£500-2000', notes: 'Preparing sketch designs' },
    { item: 'Planning consultant', cost: '£500-1500', notes: 'If appointed to manage process' },
    { item: 'Heritage consultant', cost: '£500-1000', notes: 'For listed buildings/conservation areas' },
    { item: 'Follow-up pre-app', cost: 'Varies', notes: '50% reduction usually available' }
  ];
  
  return {
    camdenFees,
    otherCosts,
    valueAssessment: 'Pre-application advice typically costs 10-20% of the application fee but can save significantly more by avoiding abortive work, refused applications, and appeals. Strongly recommended for heritage sites and complex proposals.'
  };
}

/**
 * Generate timeline
 */
function generateTimeline(developmentType: 'householder' | 'minor' | 'major'): PreAppTimeline {
  const timelines: { [key: string]: PreAppTimeline } = {
    'householder': {
      submission: { stage: 'Prepare and submit', duration: '1-2 weeks', notes: 'Gather info, complete form, pay fee' },
      assessment: { stage: 'Officer review', duration: '2-3 weeks', notes: 'Officer assesses submission' },
      response: { stage: 'Written response', duration: '28 days target', notes: 'From valid submission' },
      meeting: { stage: 'Meeting (if included)', duration: 'Within response period', notes: 'Usually arranged 2-3 weeks in' },
      totalTypical: '4-6 weeks from start to receiving advice'
    },
    'minor': {
      submission: { stage: 'Prepare and submit', duration: '2-3 weeks', notes: 'More detailed submission required' },
      assessment: { stage: 'Officer review', duration: '3-4 weeks', notes: 'May involve consultees' },
      response: { stage: 'Written response', duration: '35 days target', notes: 'From valid submission' },
      meeting: { stage: 'Meeting', duration: 'Within response period', notes: 'Usually arranged 2-3 weeks in' },
      totalTypical: '6-8 weeks from start to receiving advice'
    },
    'major': {
      submission: { stage: 'Prepare and submit', duration: '3-4 weeks', notes: 'Substantial preparation needed' },
      assessment: { stage: 'Officer review', duration: '4-6 weeks', notes: 'Multiple officer involvement' },
      response: { stage: 'Written response', duration: '42 days or negotiated', notes: 'May be staged' },
      meeting: { stage: 'Meetings', duration: 'Multiple usually', notes: 'Often ongoing dialogue' },
      totalTypical: '8-12 weeks or longer for complex schemes'
    }
  };
  
  const defaultTimeline: PreAppTimeline = {
    submission: { stage: 'Prepare and submit', duration: '1-2 weeks', notes: 'Gather info, complete form, pay fee' },
    assessment: { stage: 'Officer review', duration: '2-3 weeks', notes: 'Officer assesses submission' },
    response: { stage: 'Written response', duration: '28 days target', notes: 'From valid submission' },
    meeting: { stage: 'Meeting (if included)', duration: 'Within response period', notes: 'Usually arranged 2-3 weeks in' },
    totalTypical: '4-6 weeks from start to receiving advice'
  };
  return timelines[developmentType] || defaultTimeline;
}

export default {
  getPreApplicationGuide
};
