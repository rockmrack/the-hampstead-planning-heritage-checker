/**
 * Phasing Strategy Service
 * 
 * Generates comprehensive project phasing strategies for planning applications
 * in Hampstead and surrounding conservation areas. Helps coordinate complex
 * development projects with multiple phases.
 * 
 * Coverage: NW1-NW11, N2, N6, N10 postcodes
 */

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

interface PhasingProject {
  projectType?: 'extension' | 'loft' | 'basement' | 'new_build' | 'refurbishment' | 'mixed_use' | 'conversion';
  totalUnits?: number;
  totalArea?: number; // square meters
  budget?: number;
  constraints?: string[];
  priorities?: string[];
  targetCompletion?: string; // date
  fundingType?: 'self_funded' | 'mortgage' | 'development_finance' | 'phased_release';
  isOccupied?: boolean;
  isConservationArea?: boolean;
  isListedBuilding?: boolean;
}

interface ProjectPhase {
  phaseNumber: number;
  name: string;
  description: string;
  duration: string;
  startConditions: string[];
  completionCriteria: string[];
  keyMilestones: Milestone[];
  dependencies: string[];
  resources: ResourceRequirement[];
  risks: PhaseRisk[];
  budgetAllocation: string;
}

interface Milestone {
  name: string;
  timing: string;
  deliverables: string[];
  signOffRequired: boolean;
}

interface ResourceRequirement {
  type: string;
  requirement: string;
  timing: string;
}

interface PhaseRisk {
  risk: string;
  likelihood: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
  mitigation: string;
}

interface PhasingAssessment {
  summary: PhasingSummary;
  overallTimeline: OverallTimeline;
  phases: ProjectPhase[];
  criticalPath: CriticalPath;
  fundingStrategy: FundingStrategy;
  occupancyStrategy: OccupancyStrategy;
  regulatoryTimeline: RegulatoryTimeline;
  riskManagement: RiskManagement;
  successFactors: SuccessFactors;
  recommendations: string[];
}

interface PhasingSummary {
  totalDuration: string;
  numberOfPhases: number;
  approach: string;
  keyBenefits: string[];
  mainConsiderations: string[];
}

interface OverallTimeline {
  projectStart: string;
  projectEnd: string;
  keyDates: TimelineDate[];
  seasonalConsiderations: string[];
}

interface TimelineDate {
  milestone: string;
  timing: string;
  phase: number;
}

interface CriticalPath {
  description: string;
  criticalActivities: CriticalActivity[];
  floatActivities: string[];
  bottlenecks: string[];
}

interface CriticalActivity {
  activity: string;
  duration: string;
  phase: number;
  impact: string;
}

interface FundingStrategy {
  approach: string;
  drawdownSchedule: DrawdownItem[];
  cashflowConsiderations: string[];
  valueReleaseOpportunities: string[];
}

interface DrawdownItem {
  phase: number;
  timing: string;
  amount: string;
  trigger: string;
}

interface OccupancyStrategy {
  approach: string;
  relocationType: string;
  disruption: string;
  arrangements: string[];
}

interface RegulatoryTimeline {
  planningApproval: string;
  buildingControl: string;
  partyWall: string;
  otherApprovals: ApprovalItem[];
}

interface ApprovalItem {
  approval: string;
  timing: string;
  leadTime: string;
}

interface RiskManagement {
  overallRisk: string;
  keyRisks: ProjectRisk[];
  contingencyTime: string;
  contingencyBudget: string;
}

interface ProjectRisk {
  category: string;
  risk: string;
  mitigation: string;
  contingency: string;
}

interface SuccessFactors {
  criticalFactors: string[];
  qualityGates: string[];
  communicationPlan: string[];
}

// =============================================================================
// MAIN SERVICE FUNCTION
// =============================================================================

async function generatePhasingStrategy(
  address: string,
  postcode: string,
  projectType: string,
  projectDetails: PhasingProject = {}
): Promise<PhasingAssessment> {
  const summary = generateSummary(projectType, projectDetails);
  const overallTimeline = generateTimeline(projectType, projectDetails);
  const phases = definePhases(projectType, projectDetails);
  const criticalPath = analyzeCriticalPath(phases);
  const fundingStrategy = planFunding(projectDetails);
  const occupancyStrategy = planOccupancy(projectDetails);
  const regulatoryTimeline = planRegulatoryApprovals(projectDetails);
  const riskManagement = assessRisks(projectType, projectDetails);
  const successFactors = defineSuccessFactors(projectType);
  const recommendations = generateRecommendations(projectType, projectDetails);

  return {
    summary,
    overallTimeline,
    phases,
    criticalPath,
    fundingStrategy,
    occupancyStrategy,
    regulatoryTimeline,
    riskManagement,
    successFactors,
    recommendations
  };
}

// =============================================================================
// SUMMARY GENERATION
// =============================================================================

function generateSummary(
  projectType: string,
  projectDetails: PhasingProject
): PhasingSummary {
  const totalDuration = estimateTotalDuration(projectType, projectDetails);
  const numberOfPhases = estimateNumberOfPhases(projectType, projectDetails);

  return {
    totalDuration: `${totalDuration} months`,
    numberOfPhases,
    approach: determineApproach(projectType, projectDetails),
    keyBenefits: [
      'Manageable project stages',
      'Reduced financial exposure per phase',
      'Opportunity for quality review between phases',
      'Flexibility to adapt to changing circumstances',
      'Clearer progress tracking'
    ],
    mainConsiderations: [
      'Coordination between phases',
      'Weather dependencies',
      'Regulatory approval timing',
      'Contractor availability',
      'Funding drawdown alignment'
    ]
  };
}

function estimateTotalDuration(projectType: string, projectDetails: PhasingProject): number {
  const baseDurations: Record<string, number> = {
    extension: 6,
    loft: 4,
    basement: 15,
    new_build: 18,
    refurbishment: 8,
    mixed_use: 24,
    conversion: 12
  };

  let duration = baseDurations[projectType] || 12;

  // Adjust for complexity
  if (projectDetails.isConservationArea) duration += 2;
  if (projectDetails.isListedBuilding) duration += 3;
  if ((projectDetails.totalUnits || 0) > 4) duration += 6;

  return duration;
}

function estimateNumberOfPhases(projectType: string, projectDetails: PhasingProject): number {
  if (projectType === 'basement') return 5;
  if (projectType === 'new_build') return 6;
  if (projectType === 'mixed_use') return 7;
  if (projectType === 'conversion') return 5;
  if ((projectDetails.totalUnits || 0) > 4) return 6;
  return 4;
}

function determineApproach(projectType: string, projectDetails: PhasingProject): string {
  if (projectDetails.isOccupied) {
    return 'Phased delivery maintaining partial occupancy';
  }
  if (projectType === 'basement') {
    return 'Sequential construction with structural priority';
  }
  if (projectType === 'new_build' || projectType === 'conversion') {
    return 'Traditional construction sequence';
  }
  return 'Standard residential project phasing';
}

// =============================================================================
// TIMELINE GENERATION
// =============================================================================

function generateTimeline(
  projectType: string,
  projectDetails: PhasingProject
): OverallTimeline {
  const duration = estimateTotalDuration(projectType, projectDetails);
  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth() + 3, 1); // Allow 3 months for planning
  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + duration);

  return {
    projectStart: formatDate(startDate),
    projectEnd: formatDate(endDate),
    keyDates: [
      { milestone: 'Planning submission', timing: 'Month -3', phase: 0 },
      { milestone: 'Planning decision', timing: 'Month 0', phase: 0 },
      { milestone: 'Contractor appointment', timing: 'Month 1', phase: 1 },
      { milestone: 'Site start', timing: 'Month 2', phase: 1 },
      { milestone: 'Structure complete', timing: `Month ${Math.floor(duration * 0.5)}`, phase: 2 },
      { milestone: 'Watertight', timing: `Month ${Math.floor(duration * 0.6)}`, phase: 3 },
      { milestone: 'Practical completion', timing: `Month ${duration}`, phase: 4 }
    ],
    seasonalConsiderations: [
      'Avoid major groundworks in winter months (November-February)',
      'External render and painting best in spring/autumn',
      'Roofing works weather dependent',
      'August holiday period affects contractor availability',
      'December slowdown for material supplies'
    ]
  };
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
}

// =============================================================================
// PHASE DEFINITION
// =============================================================================

function definePhases(
  projectType: string,
  projectDetails: PhasingProject
): ProjectPhase[] {
  const phases: ProjectPhase[] = [];

  // Phase 1: Pre-Construction
  phases.push({
    phaseNumber: 1,
    name: 'Pre-Construction & Mobilization',
    description: 'Planning approvals, contractor procurement, and site preparation',
    duration: '2-3 months',
    startConditions: ['Planning permission granted', 'Budget confirmed'],
    completionCriteria: ['Contracts signed', 'Site ready for works', 'Permits obtained'],
    keyMilestones: [
      { name: 'Planning approval', timing: 'Start', deliverables: ['Decision notice'], signOffRequired: true },
      { name: 'Contractor appointed', timing: 'Week 4', deliverables: ['Contract signed', 'Program agreed'], signOffRequired: true },
      { name: 'Site setup', timing: 'Week 8', deliverables: ['Hoarding installed', 'Welfare in place'], signOffRequired: false }
    ],
    dependencies: ['Planning consent', 'Party wall agreements', 'Building control application'],
    resources: [
      { type: 'Professional', requirement: 'Architect/Project Manager', timing: 'Throughout' },
      { type: 'Contractor', requirement: 'Main contractor mobilization', timing: 'Week 6-8' },
      { type: 'Funding', requirement: 'Initial deposit and setup costs', timing: 'Week 1' }
    ],
    risks: [
      { risk: 'Planning delay', likelihood: 'medium', impact: 'high', mitigation: 'Pre-application advice and early engagement' },
      { risk: 'Contractor availability', likelihood: 'medium', impact: 'medium', mitigation: 'Early procurement process' }
    ],
    budgetAllocation: '5-10% of total budget'
  });

  // Phase 2: Structural Works
  phases.push({
    phaseNumber: 2,
    name: 'Structural & Shell Works',
    description: 'Foundation, structural frame, and building envelope',
    duration: projectType === 'basement' ? '8-12 weeks' : '6-8 weeks',
    startConditions: ['Site fully set up', 'Building control approval', 'Structural engineer appointed'],
    completionCriteria: ['Structure complete', 'Building watertight', 'Structural sign-off'],
    keyMilestones: [
      { name: 'Foundations complete', timing: 'Week 2-4', deliverables: ['Foundation inspection passed'], signOffRequired: true },
      { name: 'Structure up', timing: 'Week 4-6', deliverables: ['Structural frame complete'], signOffRequired: true },
      { name: 'Watertight', timing: 'Week 6-8', deliverables: ['Roof on', 'Windows fitted'], signOffRequired: false }
    ],
    dependencies: ['Phase 1 complete', 'Structural calculations approved', 'Materials on site'],
    resources: [
      { type: 'Contractor', requirement: 'Full construction team', timing: 'Throughout' },
      { type: 'Specialist', requirement: 'Structural engineer inspections', timing: 'Key stages' },
      { type: 'Materials', requirement: 'Structural materials delivered', timing: 'Week 1' }
    ],
    risks: [
      { risk: 'Ground conditions', likelihood: 'medium', impact: 'high', mitigation: 'Ground investigation pre-start' },
      { risk: 'Weather delays', likelihood: 'medium', impact: 'medium', mitigation: 'Program float; protective measures' }
    ],
    budgetAllocation: '35-45% of total budget'
  });

  // Phase 3: First Fix
  phases.push({
    phaseNumber: 3,
    name: 'First Fix & Services',
    description: 'Electrical, plumbing, and heating first fix; insulation',
    duration: '4-6 weeks',
    startConditions: ['Building watertight', 'Services connections available'],
    completionCriteria: ['All first fix complete', 'Insulation installed', 'Ready for plastering'],
    keyMilestones: [
      { name: 'Electrical first fix', timing: 'Week 1-2', deliverables: ['Cables installed'], signOffRequired: false },
      { name: 'Plumbing first fix', timing: 'Week 1-3', deliverables: ['Pipework complete'], signOffRequired: false },
      { name: 'Insulation complete', timing: 'Week 3-4', deliverables: ['Building regs inspection'], signOffRequired: true }
    ],
    dependencies: ['Phase 2 complete', 'Service connections made', 'Building control inspection'],
    resources: [
      { type: 'Trades', requirement: 'Electrician, plumber, heating engineer', timing: 'Weeks 1-4' },
      { type: 'Materials', requirement: 'MEP materials delivered', timing: 'Week 1' },
      { type: 'Inspector', requirement: 'Building control visits', timing: 'Pre-plastering' }
    ],
    risks: [
      { risk: 'Services coordination', likelihood: 'medium', impact: 'medium', mitigation: 'Detailed MEP coordination drawings' },
      { risk: 'Service connection delays', likelihood: 'low', impact: 'high', mitigation: 'Early application to utility providers' }
    ],
    budgetAllocation: '15-20% of total budget'
  });

  // Phase 4: Second Fix & Finishes
  phases.push({
    phaseNumber: 4,
    name: 'Second Fix & Finishes',
    description: 'Plastering, second fix, kitchen, bathroom, decorations',
    duration: '6-10 weeks',
    startConditions: ['First fix complete', 'Plastering ready'],
    completionCriteria: ['All finishes complete', 'Snagging list prepared'],
    keyMilestones: [
      { name: 'Plastering complete', timing: 'Week 1-2', deliverables: ['Walls ready for decoration'], signOffRequired: false },
      { name: 'Kitchen fitted', timing: 'Week 4-5', deliverables: ['Kitchen operational'], signOffRequired: false },
      { name: 'Bathrooms complete', timing: 'Week 5-6', deliverables: ['Sanitary ware installed'], signOffRequired: false },
      { name: 'Decorations complete', timing: 'Week 6-8', deliverables: ['Painting finished'], signOffRequired: false }
    ],
    dependencies: ['Phase 3 complete', 'Kitchen and bathroom selections finalized', 'Decoration choices made'],
    resources: [
      { type: 'Trades', requirement: 'Plasterer, carpenter, decorator', timing: 'Throughout' },
      { type: 'Supplier', requirement: 'Kitchen and bathroom suppliers', timing: 'Week 3' },
      { type: 'Client', requirement: 'Final finish selections', timing: 'Pre-start' }
    ],
    risks: [
      { risk: 'Finish selection delays', likelihood: 'high', impact: 'medium', mitigation: 'Early client decisions; contingency selections' },
      { risk: 'Supply chain delays', likelihood: 'medium', impact: 'medium', mitigation: 'Order long-lead items early' }
    ],
    budgetAllocation: '25-35% of total budget'
  });

  // Phase 5: Completion
  phases.push({
    phaseNumber: 5,
    name: 'Completion & Handover',
    description: 'Snagging, external works, sign-off, and handover',
    duration: '2-4 weeks',
    startConditions: ['All works substantially complete', 'Snagging list created'],
    completionCriteria: ['Completion certificate issued', 'Keys handed over', 'All warranties in place'],
    keyMilestones: [
      { name: 'Pre-completion inspection', timing: 'Week 1', deliverables: ['Snagging list'], signOffRequired: true },
      { name: 'External works complete', timing: 'Week 2', deliverables: ['Landscaping, driveway'], signOffRequired: false },
      { name: 'Completion certificate', timing: 'Week 3', deliverables: ['Building control sign-off'], signOffRequired: true },
      { name: 'Handover', timing: 'Week 4', deliverables: ['Keys, manuals, warranties'], signOffRequired: true }
    ],
    dependencies: ['Phase 4 complete', 'All inspections passed', 'Client satisfied'],
    resources: [
      { type: 'Contractor', requirement: 'Snagging team', timing: 'Weeks 1-2' },
      { type: 'Inspector', requirement: 'Final building control visit', timing: 'Week 2-3' },
      { type: 'Admin', requirement: 'Warranty documentation', timing: 'Week 3-4' }
    ],
    risks: [
      { risk: 'Snagging overrun', likelihood: 'medium', impact: 'low', mitigation: 'Adequate float in program' },
      { risk: 'Completion certificate delay', likelihood: 'low', impact: 'medium', mitigation: 'Early engagement with building control' }
    ],
    budgetAllocation: '5-10% of total budget'
  });

  return phases;
}

// =============================================================================
// CRITICAL PATH ANALYSIS
// =============================================================================

function analyzeCriticalPath(phases: ProjectPhase[]): CriticalPath {
  return {
    description: 'The critical path represents activities that directly impact the project end date',
    criticalActivities: [
      { activity: 'Planning approval', duration: '8-13 weeks', phase: 0, impact: 'Delays start of all construction' },
      { activity: 'Foundation works', duration: '2-4 weeks', phase: 2, impact: 'Enables all subsequent structure' },
      { activity: 'Structure completion', duration: '4-6 weeks', phase: 2, impact: 'Required before envelope' },
      { activity: 'Watertight stage', duration: '2 weeks', phase: 2, impact: 'Enables internal works' },
      { activity: 'Building control sign-off', duration: '1-2 weeks', phase: 5, impact: 'Required for completion' }
    ],
    floatActivities: [
      'Internal decoration (can parallel with other finishes)',
      'Landscaping (weather dependent but flexible)',
      'Minor snagging items'
    ],
    bottlenecks: [
      'Planning approval - no construction until granted',
      'Structural inspections - must pass before covering',
      'Service connections - external dependency',
      'Long-lead items - kitchen, specialist materials'
    ]
  };
}

// =============================================================================
// FUNDING STRATEGY
// =============================================================================

function planFunding(projectDetails: PhasingProject): FundingStrategy {
  const fundingType = projectDetails.fundingType || 'mortgage';

  return {
    approach: fundingType === 'development_finance'
      ? 'Stage payments linked to construction milestones'
      : fundingType === 'phased_release'
        ? 'Phased mortgage drawdowns aligned with valuations'
        : 'Self-funding with periodic payments to contractor',
    drawdownSchedule: [
      { phase: 1, timing: 'Contract start', amount: '10-15%', trigger: 'Contract signature' },
      { phase: 2, timing: 'Foundation complete', amount: '20-25%', trigger: 'Foundation inspection' },
      { phase: 2, timing: 'Watertight', amount: '20-25%', trigger: 'Roof and windows complete' },
      { phase: 3, timing: 'First fix complete', amount: '15-20%', trigger: 'Pre-plaster inspection' },
      { phase: 4, timing: 'Second fix complete', amount: '15-20%', trigger: 'Finishes complete' },
      { phase: 5, timing: 'Completion', amount: '5-10%', trigger: 'Practical completion' }
    ],
    cashflowConsiderations: [
      'Maintain contingency reserve (10-15%)',
      'Allow for retention (typically 2.5-5%)',
      'Budget for professional fees throughout',
      'Plan for VAT cash flow if applicable'
    ],
    valueReleaseOpportunities: [
      'Remortgage at completion to release uplift',
      'Stage valuations may enable increased borrowing',
      'Consider development exit finance for developers'
    ]
  };
}

// =============================================================================
// OCCUPANCY STRATEGY
// =============================================================================

function planOccupancy(projectDetails: PhasingProject): OccupancyStrategy {
  const isOccupied = Boolean(projectDetails.isOccupied);

  if (!isOccupied) {
    return {
      approach: 'Property vacant during works',
      relocationType: 'Not applicable',
      disruption: 'Minimal - property unoccupied',
      arrangements: [
        'Full site access for contractors',
        'No temporary accommodation required',
        'Flexible working hours possible',
        'Full services can be disconnected as needed'
      ]
    };
  }

  return {
    approach: 'Partial occupation with phased handover',
    relocationType: 'Temporary relocation recommended during key phases',
    disruption: 'Significant - noise, dust, limited facilities',
    arrangements: [
      'Temporary kitchen facilities during kitchen works',
      'Maintain one functional bathroom at all times',
      'Dust barriers between occupied and work areas',
      'Clear pathway to exits at all times',
      'Evening works avoided where possible',
      'Consider temporary relocation for 2-4 weeks during peak disruption'
    ]
  };
}

// =============================================================================
// REGULATORY TIMELINE
// =============================================================================

function planRegulatoryApprovals(projectDetails: PhasingProject): RegulatoryTimeline {
  const isListed = Boolean(projectDetails.isListedBuilding);
  const isConservation = Boolean(projectDetails.isConservationArea);

  const otherApprovals: ApprovalItem[] = [];

  if (isListed) {
    otherApprovals.push({
      approval: 'Listed Building Consent',
      timing: 'With planning application',
      leadTime: '8-13 weeks (determined together)'
    });
  }

  otherApprovals.push({
    approval: 'Thames Water build-over approval',
    timing: 'Pre-construction',
    leadTime: '3-4 weeks'
  });

  otherApprovals.push({
    approval: 'Utility connections',
    timing: 'Pre-construction',
    leadTime: '6-12 weeks'
  });

  if (projectDetails.projectType === 'basement') {
    otherApprovals.push({
      approval: 'Basement Impact Assessment approval',
      timing: 'With planning application',
      leadTime: '8-13 weeks'
    });
  }

  return {
    planningApproval: isConservation || isListed ? '10-13 weeks (target)' : '8 weeks (target)',
    buildingControl: 'Initial notice at start; staged inspections throughout',
    partyWall: '2-3 months before works affecting party walls',
    otherApprovals
  };
}

// =============================================================================
// RISK MANAGEMENT
// =============================================================================

function assessRisks(
  projectType: string,
  projectDetails: PhasingProject
): RiskManagement {
  const keyRisks: ProjectRisk[] = [
    {
      category: 'Planning',
      risk: 'Planning refusal or conditions requiring amendment',
      mitigation: 'Pre-application advice; heritage consultant if required',
      contingency: '2-3 months additional time'
    },
    {
      category: 'Construction',
      risk: 'Unforeseen ground conditions or structural issues',
      mitigation: 'Ground investigation; structural survey pre-start',
      contingency: '10% budget contingency'
    },
    {
      category: 'Cost',
      risk: 'Cost overruns due to specification changes or market conditions',
      mitigation: 'Fixed price contract where possible; detailed specification',
      contingency: '15% budget contingency'
    },
    {
      category: 'Program',
      risk: 'Weather delays affecting external works',
      mitigation: 'Seasonal programming; protective measures',
      contingency: '2-4 weeks program float'
    },
    {
      category: 'Contractor',
      risk: 'Contractor performance or insolvency',
      mitigation: 'Due diligence; staged payments; retention',
      contingency: 'Performance bond if available'
    }
  ];

  if (projectDetails.isListedBuilding) {
    keyRisks.push({
      category: 'Heritage',
      risk: 'Unexpected heritage discoveries requiring design changes',
      mitigation: 'Conservation architect; flexible design approach',
      contingency: '5% additional budget; 4 weeks program'
    });
  }

  return {
    overallRisk: projectType === 'basement' || projectDetails.isListedBuilding ? 'Medium-High' : 'Medium',
    keyRisks,
    contingencyTime: '10-15% of total program',
    contingencyBudget: '10-15% of total budget'
  };
}

// =============================================================================
// SUCCESS FACTORS
// =============================================================================

function defineSuccessFactors(projectType: string): SuccessFactors {
  return {
    criticalFactors: [
      'Clear brief and frozen design before construction',
      'Competent, experienced contractor',
      'Adequate budget with contingency',
      'Realistic program with float',
      'Good communication between all parties',
      'Timely client decisions'
    ],
    qualityGates: [
      'Planning approval - proceed/pause decision',
      'Contractor appointment - contract terms agreed',
      'Foundation sign-off - structural integrity confirmed',
      'Watertight stage - building envelope confirmed',
      'Pre-plaster inspection - all first fix complete',
      'Pre-completion inspection - snagging identified',
      'Final sign-off - completion certificate issued'
    ],
    communicationPlan: [
      'Weekly site meetings during construction',
      'Monthly progress reports to client',
      'Immediate notification of issues or changes',
      'Clear change control process',
      'Regular neighbor updates'
    ]
  };
}

// =============================================================================
// RECOMMENDATIONS
// =============================================================================

function generateRecommendations(
  projectType: string,
  projectDetails: PhasingProject
): string[] {
  const recommendations: string[] = [
    'Engage architect/project manager early in the process',
    'Allow adequate time for planning approval before committing to contractor',
    'Obtain multiple contractor quotes and check references thoroughly',
    'Agree detailed specification before signing contract',
    'Maintain adequate contingency budget throughout'
  ];

  if (projectDetails.isOccupied) {
    recommendations.push('Plan temporary accommodation for peak disruption phases');
    recommendations.push('Discuss working arrangements with contractor before start');
  }

  if (projectDetails.isListedBuilding || projectDetails.isConservationArea) {
    recommendations.push('Engage heritage consultant early for pre-application advice');
    recommendations.push('Allow additional time and budget for heritage requirements');
  }

  if (projectType === 'basement') {
    recommendations.push('Commission detailed ground investigation before design');
    recommendations.push('Appoint specialist basement contractor with track record');
    recommendations.push('Consider party wall implications early');
  }

  recommendations.push('Maintain good neighbor relations throughout');
  recommendations.push('Document all decisions and changes in writing');

  return recommendations;
}

// =============================================================================
// EXPORTS
// =============================================================================

const phasingStrategy = {
  generatePhasingStrategy
};

export default phasingStrategy;
