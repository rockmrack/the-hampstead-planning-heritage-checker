/**
 * Site Visit Preparation Service
 * 
 * Comprehensive guidance for preparing property and documentation
 * for planning officer site visits
 */

// Types
interface SiteVisitPreparation {
  address: string;
  postcode: string;
  projectType: string;
  visitType: VisitType;
  preparationChecklist: PreparationItem[];
  documentationRequired: DocumentPreparation[];
  accessRequirements: AccessRequirement[];
  keyViewpoints: Viewpoint[];
  neighborConsiderations: NeighborPrep[];
  presentationTips: PresentationTip[];
  commonIssues: CommonIssue[];
  timeline: PreparationTimeline;
}

interface VisitType {
  type: 'committee' | 'delegated' | 'pre-application' | 'enforcement';
  description: string;
  typicalDuration: string;
  whoAttends: string[];
  format: string;
}

interface PreparationItem {
  category: string;
  item: string;
  priority: 'essential' | 'recommended' | 'optional';
  timing: string;
  notes: string;
}

interface DocumentPreparation {
  document: string;
  copies: number;
  purpose: string;
  presentation: string;
}

interface AccessRequirement {
  area: string;
  required: boolean;
  preparation: string[];
  safetyConsiderations: string[];
}

interface Viewpoint {
  location: string;
  significance: string;
  whatToShow: string[];
  photographAdvice: string;
}

interface NeighborPrep {
  action: string;
  timing: string;
  benefit: string;
}

interface PresentationTip {
  aspect: string;
  doThis: string[];
  avoidThis: string[];
}

interface CommonIssue {
  issue: string;
  solution: string;
  impact: 'minor' | 'moderate' | 'significant';
}

interface PreparationTimeline {
  twoWeeksBefore: string[];
  oneWeekBefore: string[];
  dayBefore: string[];
  onTheDay: string[];
}

// Project type specific visit requirements
const VISIT_REQUIREMENTS: { [key: string]: { focus: string[]; duration: string } } = {
  'extension': { focus: ['Boundary relationships', 'Neighbor impact', 'Garden space'], duration: '15-30 mins' },
  'basement': { focus: ['Party walls', 'Garden levels', 'Access for excavation'], duration: '30-45 mins' },
  'new-build': { focus: ['Site context', 'Street scene', 'Density', 'Access'], duration: '45-60 mins' },
  'loft': { focus: ['Roof visibility', 'Street scene', 'Neighbor windows'], duration: '15-20 mins' },
  'conversion': { focus: ['Building condition', 'Access', 'Parking'], duration: '30-45 mins' },
  'change-of-use': { focus: ['Access', 'Parking', 'Neighbor amenity'], duration: '20-30 mins' },
  'listed-building': { focus: ['Heritage features', 'Setting', 'Materials'], duration: '45-60 mins' },
  'demolition': { focus: ['Building condition', 'Heritage value', 'Site context'], duration: '30-45 mins' }
};

/**
 * Get comprehensive site visit preparation guide
 */
export async function getSiteVisitPreparation(
  address: string,
  postcode: string,
  projectType: string,
  visitDetails?: {
    visitType?: 'committee' | 'delegated' | 'pre-application' | 'enforcement';
    visitDate?: string;
    conservationArea?: boolean;
    listedBuilding?: boolean;
    neighborObjections?: boolean;
    isApplicant?: boolean;
  }
): Promise<SiteVisitPreparation> {
  const normalizedType = projectType.toLowerCase().replace(/\s+/g, '-');
  const visitTypeValue = visitDetails?.visitType || 'delegated';
  const inConservationArea = visitDetails?.conservationArea || false;
  const isListed = visitDetails?.listedBuilding || false;
  const hasObjections = visitDetails?.neighborObjections || false;
  
  const visitType = getVisitTypeInfo(visitTypeValue);
  const requirementsData = VISIT_REQUIREMENTS[normalizedType];
  const requirements = requirementsData || { focus: ['Boundary relationships', 'Neighbor impact'], duration: '20 mins' };
  
  const preparationChecklist = generatePreparationChecklist(
    normalizedType,
    inConservationArea,
    isListed,
    hasObjections,
    requirements.focus
  );
  
  const documentationRequired = getDocumentationRequirements(
    visitTypeValue,
    normalizedType,
    isListed
  );
  
  const accessRequirements = getAccessRequirements(normalizedType);
  const keyViewpoints = getKeyViewpoints(normalizedType, inConservationArea);
  const neighborConsiderations = getNeighborConsiderations(hasObjections);
  const presentationTips = getPresentationTips(visitTypeValue, normalizedType);
  const commonIssues = getCommonIssues(normalizedType);
  const timeline = getPreparationTimeline(visitTypeValue);
  
  return {
    address,
    postcode,
    projectType,
    visitType,
    preparationChecklist,
    documentationRequired,
    accessRequirements,
    keyViewpoints,
    neighborConsiderations,
    presentationTips,
    commonIssues,
    timeline
  };
}

/**
 * Get visit type information
 */
function getVisitTypeInfo(type: string): VisitType {
  const visitTypes: { [key: string]: VisitType } = {
    'committee': {
      type: 'committee',
      description: 'Full planning committee site visit - typically for major or contentious applications',
      typicalDuration: '30-60 minutes',
      whoAttends: ['Committee members', 'Planning officer', 'Applicant/agent may attend'],
      format: 'Formal visit, members view site but generally don\'t discuss with applicant'
    },
    'delegated': {
      type: 'delegated',
      description: 'Planning officer site visit for delegated decision',
      typicalDuration: '15-30 minutes',
      whoAttends: ['Planning officer', 'Applicant or agent if arranged'],
      format: 'Informal, officer may ask questions and discuss the scheme'
    },
    'pre-application': {
      type: 'pre-application',
      description: 'Advisory visit as part of pre-application process',
      typicalDuration: '30-45 minutes',
      whoAttends: ['Planning officer', 'Applicant', 'Agent/architect'],
      format: 'Discussion-based, opportunity to highlight site constraints and opportunities'
    },
    'enforcement': {
      type: 'enforcement',
      description: 'Visit to investigate potential planning breach',
      typicalDuration: '15-30 minutes',
      whoAttends: ['Enforcement officer', 'Property owner/occupier'],
      format: 'Investigative, officer may take photographs and measurements'
    }
  };
  const visitData = visitTypes[type];
  const fallback: VisitType = {
    type: 'delegated',
    description: 'Planning officer site visit for delegated decision',
    typicalDuration: '15-30 minutes',
    whoAttends: ['Planning officer', 'Applicant or agent if arranged'],
    format: 'Informal, officer may ask questions and discuss the scheme'
  };
  return visitData || fallback;
}

/**
 * Generate preparation checklist
 */
function generatePreparationChecklist(
  projectType: string,
  conservationArea: boolean,
  listed: boolean,
  hasObjections: boolean,
  focusAreas: string[]
): PreparationItem[] {
  const checklist: PreparationItem[] = [];
  
  // Essential items for all visits
  checklist.push(
    {
      category: 'Documentation',
      item: 'Have approved plans ready to show',
      priority: 'essential',
      timing: 'Day before',
      notes: 'Laminated A3 copies ideal for outdoor viewing'
    },
    {
      category: 'Site Access',
      item: 'Ensure clear access to all areas of the site',
      priority: 'essential',
      timing: 'Day before',
      notes: 'Remove obstacles, unlock gates, clear pathways'
    },
    {
      category: 'Safety',
      item: 'Address any safety hazards',
      priority: 'essential',
      timing: 'Week before',
      notes: 'Trip hazards, uneven surfaces, dangerous structures'
    },
    {
      category: 'Visibility',
      item: 'Mark out proposed development footprint',
      priority: 'recommended',
      timing: 'Day before',
      notes: 'Use stakes, string, or spray paint on grass'
    }
  );
  
  // Project type specific items
  if (projectType.includes('extension') || projectType.includes('basement')) {
    checklist.push({
      category: 'Boundaries',
      item: 'Mark boundary lines clearly',
      priority: 'essential',
      timing: 'Day before',
      notes: 'Especially important where development near boundaries'
    });
  }
  
  if (projectType.includes('loft') || projectType.includes('roof')) {
    checklist.push({
      category: 'Viewpoints',
      item: 'Identify street viewpoints where roof visible',
      priority: 'essential',
      timing: 'Week before',
      notes: 'Officer will want to assess visual impact from street'
    });
  }
  
  // Conservation area specific
  if (conservationArea) {
    checklist.push(
      {
        category: 'Heritage',
        item: 'Clean and present building facade',
        priority: 'recommended',
        timing: 'Week before',
        notes: 'Good presentation helps show building in best light'
      },
      {
        category: 'Heritage',
        item: 'Identify historic features to be retained',
        priority: 'essential',
        timing: 'Day before',
        notes: 'Be ready to discuss what will be preserved'
      }
    );
  }
  
  // Listed building specific
  if (listed) {
    checklist.push(
      {
        category: 'Listed Building',
        item: 'Prepare examples of proposed materials',
        priority: 'recommended',
        timing: 'Week before',
        notes: 'Sample materials can help demonstrate quality intent'
      },
      {
        category: 'Listed Building',
        item: 'Document existing historic features',
        priority: 'essential',
        timing: 'Day before',
        notes: 'Photographs of features that may be affected'
      }
    );
  }
  
  // If neighbor objections exist
  if (hasObjections) {
    checklist.push(
      {
        category: 'Neighbor Relations',
        item: 'Prepare responses to objection points',
        priority: 'essential',
        timing: 'Week before',
        notes: 'Be ready to address concerns factually'
      },
      {
        category: 'Neighbor Relations',
        item: 'Notify neighbors of site visit',
        priority: 'recommended',
        timing: '2 days before',
        notes: 'Courtesy notice can improve relations'
      }
    );
  }
  
  // Focus area specific items
  for (const focus of focusAreas) {
    if (focus.toLowerCase().includes('boundary')) {
      checklist.push({
        category: 'Boundaries',
        item: 'Ensure fence/boundary lines visible and accessible',
        priority: 'essential',
        timing: 'Day before',
        notes: 'Clear vegetation if necessary'
      });
    }
    if (focus.toLowerCase().includes('parking') || focus.toLowerCase().includes('access')) {
      checklist.push({
        category: 'Access',
        item: 'Demonstrate parking and access arrangements',
        priority: 'essential',
        timing: 'Day of visit',
        notes: 'Show vehicle access points and parking spaces'
      });
    }
  }
  
  return checklist;
}

/**
 * Get documentation requirements
 */
function getDocumentationRequirements(
  visitType: string,
  projectType: string,
  listed: boolean
): DocumentPreparation[] {
  const docs: DocumentPreparation[] = [
    {
      document: 'Approved/proposed site plan',
      copies: 2,
      purpose: 'Show layout and relationship to boundaries',
      presentation: 'A3 laminated or in waterproof folder'
    },
    {
      document: 'Proposed elevations',
      copies: 2,
      purpose: 'Explain visual appearance',
      presentation: 'A3 size for easy viewing'
    },
    {
      document: 'Planning application reference',
      copies: 1,
      purpose: 'Quick reference for officer',
      presentation: 'Note card with reference number'
    }
  ];
  
  if (visitType === 'committee') {
    docs.push(
      {
        document: 'CGI visualizations',
        copies: 3,
        purpose: 'Help committee visualize completed development',
        presentation: 'A3 laminated boards'
      },
      {
        document: 'Design statement summary',
        copies: 5,
        purpose: 'Brief summary of design rationale',
        presentation: 'Single page A4 handout'
      }
    );
  }
  
  if (listed) {
    docs.push(
      {
        document: 'Heritage impact assessment summary',
        copies: 2,
        purpose: 'Highlight significance and impact',
        presentation: 'Key points summary sheet'
      },
      {
        document: 'Material samples or specifications',
        copies: 1,
        purpose: 'Demonstrate quality and compatibility',
        presentation: 'Physical samples where possible'
      }
    );
  }
  
  if (projectType.includes('basement')) {
    docs.push({
      document: 'Construction management summary',
      copies: 2,
      purpose: 'Address construction concerns',
      presentation: 'Summary of CMP key points'
    });
  }
  
  return docs;
}

/**
 * Get access requirements
 */
function getAccessRequirements(projectType: string): AccessRequirement[] {
  const requirements: AccessRequirement[] = [
    {
      area: 'Front of property/street',
      required: true,
      preparation: ['Clear view of property from street', 'Remove parked vehicles if blocking view'],
      safetyConsiderations: ['Be aware of traffic', 'Stand on pavement']
    },
    {
      area: 'Garden/rear area',
      required: true,
      preparation: ['Clear pathway', 'Unlock side gates', 'Cut back overgrown vegetation'],
      safetyConsiderations: ['Check for trip hazards', 'Stable ground for walking']
    }
  ];
  
  if (projectType.includes('basement')) {
    requirements.push({
      area: 'Party wall boundaries',
      required: true,
      preparation: ['Clear access to all boundaries', 'Mark distances from boundaries'],
      safetyConsiderations: ['Watch for uneven ground', 'Be aware of excavations']
    });
  }
  
  if (projectType.includes('loft') || projectType.includes('roof')) {
    requirements.push({
      area: 'Internal upper floor (optional)',
      required: false,
      preparation: ['Clear route to top floor', 'Access to windows for roof views'],
      safetyConsiderations: ['Standard household safety', 'Mind head height in roof spaces']
    });
  }
  
  if (projectType.includes('extension')) {
    requirements.push({
      area: 'Neighboring boundaries',
      required: true,
      preparation: ['Ensure boundaries clearly visible', 'Measure and mark setbacks'],
      safetyConsiderations: ['Respect neighbor property', 'Don\'t enter neighbor\'s land']
    });
  }
  
  return requirements;
}

/**
 * Get key viewpoints
 */
function getKeyViewpoints(projectType: string, conservationArea: boolean): Viewpoint[] {
  const viewpoints: Viewpoint[] = [
    {
      location: 'Street view - directly opposite property',
      significance: 'Primary public view of development',
      whatToShow: ['Scale in context', 'Relationship to neighbors', 'Materials and design'],
      photographAdvice: 'Include neighboring properties for context'
    },
    {
      location: 'Street view - oblique angles both directions',
      significance: 'Shows development in street scene context',
      whatToShow: ['Roofline continuity', 'Building line', 'Character consistency'],
      photographAdvice: 'Take from 45 degrees each side'
    }
  ];
  
  if (conservationArea) {
    viewpoints.push({
      location: 'Key heritage viewpoints',
      significance: 'Impact on conservation area character',
      whatToShow: ['How development fits with historic pattern', 'Important sight lines'],
      photographAdvice: 'Identify views from Conservation Area Appraisal'
    });
  }
  
  if (projectType.includes('extension') || projectType.includes('basement')) {
    viewpoints.push(
      {
        location: 'From neighboring properties (if accessible)',
        significance: 'Demonstrates impact on neighbor amenity',
        whatToShow: ['Overlooking potential', 'Daylight/sunlight impact', 'Visual intrusion'],
        photographAdvice: 'Only if neighbors permit access to their garden'
      },
      {
        location: 'Garden boundaries',
        significance: 'Shows relationship to site boundaries',
        whatToShow: ['Setback distances', 'Boundary treatment', 'Garden space remaining'],
        photographAdvice: 'Include measuring tape/markers for scale'
      }
    );
  }
  
  if (projectType.includes('loft') || projectType.includes('roof')) {
    viewpoints.push({
      location: 'Long views showing roofscape',
      significance: 'Impact on roofscape character',
      whatToShow: ['Visibility of dormer/roof extension', 'Roofline continuity'],
      photographAdvice: 'Find elevated viewpoints if possible'
    });
  }
  
  return viewpoints;
}

/**
 * Get neighbor considerations
 */
function getNeighborConsiderations(hasObjections: boolean): NeighborPrep[] {
  const considerations: NeighborPrep[] = [
    {
      action: 'Notify immediate neighbors of visit date and time',
      timing: '2-3 days before',
      benefit: 'Shows respect and reduces surprise/conflict'
    },
    {
      action: 'Offer to discuss any concerns beforehand',
      timing: 'Week before visit',
      benefit: 'May resolve issues before officer visit'
    }
  ];
  
  if (hasObjections) {
    considerations.push(
      {
        action: 'Prepare factual responses to objection points',
        timing: 'Week before',
        benefit: 'Be ready to address concerns if raised'
      },
      {
        action: 'Avoid confrontation if neighbors present',
        timing: 'During visit',
        benefit: 'Maintain professional conduct'
      },
      {
        action: 'Document any amendments made to address concerns',
        timing: 'Before visit',
        benefit: 'Shows willingness to compromise'
      }
    );
  }
  
  return considerations;
}

/**
 * Get presentation tips
 */
function getPresentationTips(visitType: string, projectType: string): PresentationTip[] {
  const tips: PresentationTip[] = [
    {
      aspect: 'Personal conduct',
      doThis: [
        'Be punctual - arrive before the officer',
        'Be friendly but professional',
        'Let officer lead the visit',
        'Answer questions concisely'
      ],
      avoidThis: [
        'Don\'t be late or unprepared',
        'Don\'t be aggressive or defensive',
        'Don\'t oversell or exaggerate',
        'Don\'t criticize objectors'
      ]
    },
    {
      aspect: 'Site presentation',
      doThis: [
        'Ensure site is tidy and accessible',
        'Have plans and documents ready',
        'Offer to show specific areas',
        'Point out key features proactively'
      ],
      avoidThis: [
        'Don\'t leave site in poor condition',
        'Don\'t start unauthorized works',
        'Don\'t block access routes',
        'Don\'t remove features you\'re claiming to retain'
      ]
    },
    {
      aspect: 'Communication',
      doThis: [
        'Explain design rationale clearly',
        'Acknowledge constraints honestly',
        'Listen to officer\'s observations',
        'Offer clarification if asked'
      ],
      avoidThis: [
        'Don\'t dismiss concerns',
        'Don\'t argue with the officer',
        'Don\'t make promises you can\'t keep',
        'Don\'t discuss other applications'
      ]
    }
  ];
  
  if (visitType === 'committee') {
    tips.push({
      aspect: 'Committee visit protocol',
      doThis: [
        'Stand back and let members view freely',
        'Only speak if spoken to',
        'Have agent/architect present if possible',
        'Prepare brief verbal summary if invited'
      ],
      avoidThis: [
        'Don\'t lobby individual members',
        'Don\'t engage in debate on site',
        'Don\'t hand out additional materials',
        'Don\'t record the visit without permission'
      ]
    });
  }
  
  return tips;
}

/**
 * Get common issues to avoid
 */
function getCommonIssues(projectType: string): CommonIssue[] {
  const issues: CommonIssue[] = [
    {
      issue: 'Site not accessible - gates locked, pathways blocked',
      solution: 'Ensure all areas accessible; unlock gates; clear paths day before',
      impact: 'moderate'
    },
    {
      issue: 'Plans not available or wrong version',
      solution: 'Bring correct, current approved plans; check reference number',
      impact: 'moderate'
    },
    {
      issue: 'Applicant absent or late',
      solution: 'Confirm date/time; arrive early; have contact number ready',
      impact: 'minor'
    },
    {
      issue: 'Unauthorized works already started',
      solution: 'Do not begin work before decision; if started, discuss honestly',
      impact: 'significant'
    },
    {
      issue: 'Hostile neighbors confronting officer',
      solution: 'Remain calm; let officer handle; note concerns for formal response',
      impact: 'moderate'
    }
  ];
  
  if (projectType.includes('basement')) {
    issues.push({
      issue: 'Boundary positions unclear or disputed',
      solution: 'Have survey showing boundaries; mark clearly on site',
      impact: 'significant'
    });
  }
  
  if (projectType.includes('listed') || projectType.includes('heritage')) {
    issues.push({
      issue: 'Historic features hidden or damaged',
      solution: 'Preserve and expose features; document condition',
      impact: 'significant'
    });
  }
  
  return issues;
}

/**
 * Get preparation timeline
 */
function getPreparationTimeline(visitType: string): PreparationTimeline {
  return {
    twoWeeksBefore: [
      'Confirm visit date with planning officer',
      'Review application documents and any amendments',
      'Identify key points to highlight',
      'Address any site safety issues'
    ],
    oneWeekBefore: [
      'Prepare documents and presentation materials',
      'Tidy site and clear access routes',
      'Mark out development footprint if helpful',
      'Notify neighbors if appropriate'
    ],
    dayBefore: [
      'Final site tidying and access check',
      'Assemble documents and plans',
      'Check weather and prepare accordingly',
      'Confirm attendance of agent/architect if required'
    ],
    onTheDay: [
      'Arrive 15 minutes early',
      'Do final walkthrough of site',
      'Have phone charged in case officer needs to contact',
      'Remain available for any follow-up questions'
    ]
  };
}

/**
 * Get weather-specific preparation advice
 */
export async function getWeatherPreparation(
  visitDate: string
): Promise<{
  weatherConsiderations: string[];
  equipmentNeeded: string[];
  alternativeArrangements: string;
}> {
  // General advice - would integrate with weather API in production
  return {
    weatherConsiderations: [
      'Check weather forecast 24 hours before',
      'Have backup indoor meeting point if heavy rain',
      'Consider visibility in fog or low light',
      'Muddy conditions may affect access'
    ],
    equipmentNeeded: [
      'Waterproof folder for documents',
      'Laminated plans for outdoor viewing',
      'Umbrella for rain',
      'Wellington boots if garden is muddy',
      'High-visibility jacket if near traffic'
    ],
    alternativeArrangements: 'If weather is severe, contact officer to discuss rescheduling or virtual alternatives'
  };
}

export default {
  getSiteVisitPreparation,
  getWeatherPreparation
};
