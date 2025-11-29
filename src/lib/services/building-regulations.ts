/**
 * Building Regulations Guide Service
 * 
 * Comprehensive guidance for Building Regulations compliance
 * across all project types and regulatory parts
 */

// Types
interface BuildingRegsGuide {
  address: string;
  postcode: string;
  projectType: string;
  overview: RegsOverview;
  applicableParts: ApplicablePart[];
  approvalRoute: ApprovalRoute;
  inspectionSchedule: BCInspectionSchedule;
  compliance: ComplianceRequirements;
  commonIssues: RegulationIssue[];
  costs: RegsCosts;
}

interface RegsOverview {
  description: string;
  scope: string[];
  exemptions: string[];
  timeline: string;
  keyDates: KeyDate[];
}

interface KeyDate {
  milestone: string;
  timing: string;
  action: string;
}

interface ApplicablePart {
  part: string;
  title: string;
  relevance: 'high' | 'medium' | 'low';
  requirements: PartRequirement[];
  keyStandards: string[];
  commonIssues: string[];
}

interface PartRequirement {
  requirement: string;
  compliance: string;
  evidence: string;
}

interface ApprovalRoute {
  recommended: 'building-notice' | 'full-plans' | 'regularisation';
  reason: string;
  alternatives: RouteOption[];
  timeline: string;
  costs: RouteCost;
}

interface RouteOption {
  route: string;
  description: string;
  pros: string[];
  cons: string[];
  suitability: string;
}

interface RouteCost {
  planCharge: number;
  inspectionCharge: number;
  total: number;
}

interface BCInspectionSchedule {
  inspections: ScheduledInspection[];
  notificationProcess: string;
  inspectorExpectations: string[];
}

interface ScheduledInspection {
  stage: string;
  timing: string;
  noticeRequired: string;
  whatIsChecked: string[];
  documentation: string[];
}

interface ComplianceRequirements {
  designStage: DesignRequirement[];
  constructionStage: ConstructionRequirement[];
  completionStage: CompletionRequirement[];
}

interface DesignRequirement {
  requirement: string;
  standard: string;
  verification: string;
}

interface ConstructionRequirement {
  requirement: string;
  inspection: string;
  evidence: string;
}

interface CompletionRequirement {
  requirement: string;
  certificate: string;
  provider: string;
}

interface RegulationIssue {
  issue: string;
  part: string;
  frequency: 'common' | 'occasional' | 'rare';
  consequence: string;
  prevention: string;
}

interface RegsCosts {
  applicationFees: ApplicationFees;
  complianceCosts: ComplianceCost[];
  testingCosts: TestingCost[];
  total: CostSummary;
}

interface ApplicationFees {
  planCharge: number;
  inspectionCharge: number;
  regularisationSurcharge: number;
}

interface ComplianceCost {
  item: string;
  estimated: number;
  notes: string;
}

interface TestingCost {
  test: string;
  cost: number;
  mandatory: boolean;
}

interface CostSummary {
  minimum: number;
  typical: number;
  maximum: number;
}

// Building Regulations Parts
const BUILDING_REGULATIONS_PARTS: { [key: string]: { title: string; scope: string } } = {
  'A': { title: 'Structure', scope: 'Structural stability, loading, ground movement' },
  'B': { title: 'Fire Safety', scope: 'Means of escape, fire spread, access for fire services' },
  'C': { title: 'Site Preparation and Resistance to Contaminants and Moisture', scope: 'Site preparation, subsoil drainage, resistance to moisture' },
  'D': { title: 'Toxic Substances', scope: 'Cavity insulation' },
  'E': { title: 'Resistance to Sound', scope: 'Sound insulation between dwellings' },
  'F': { title: 'Ventilation', scope: 'Means of ventilation' },
  'G': { title: 'Sanitation, Hot Water Safety and Water Efficiency', scope: 'Bathrooms, hot water, water efficiency' },
  'H': { title: 'Drainage and Waste Disposal', scope: 'Foul and surface water drainage' },
  'J': { title: 'Combustion Appliances and Fuel Storage', scope: 'Heat-producing appliances' },
  'K': { title: 'Protection from Falling, Collision and Impact', scope: 'Stairs, ramps, guards, glazing' },
  'L': { title: 'Conservation of Fuel and Power', scope: 'Energy efficiency, insulation' },
  'M': { title: 'Access to and Use of Buildings', scope: 'Accessibility' },
  'O': { title: 'Overheating', scope: 'Overheating mitigation in residential buildings' },
  'P': { title: 'Electrical Safety', scope: 'Electrical installations' },
  'Q': { title: 'Security', scope: 'Resistance to unauthorized access (dwellings)' },
  'R': { title: 'Physical Infrastructure for High-Speed Electronic Communications Networks', scope: 'Broadband infrastructure' },
  'S': { title: 'Infrastructure for Electric Vehicle Charging', scope: 'EV charging' }
};

// Project type to applicable parts mapping
const PROJECT_PARTS: { [key: string]: { high: string[]; medium: string[]; low: string[] } } = {
  'extension': {
    high: ['A', 'B', 'K', 'L', 'P'],
    medium: ['C', 'F', 'M', 'O'],
    low: ['G', 'H', 'Q']
  },
  'basement': {
    high: ['A', 'B', 'C', 'K', 'L', 'P'],
    medium: ['F', 'G', 'H', 'M'],
    low: ['O', 'Q']
  },
  'loft': {
    high: ['A', 'B', 'K', 'L', 'P'],
    medium: ['F', 'O'],
    low: ['C', 'M']
  },
  'new-build': {
    high: ['A', 'B', 'C', 'E', 'F', 'G', 'H', 'K', 'L', 'M', 'O', 'P', 'Q', 'R', 'S'],
    medium: ['D', 'J'],
    low: []
  },
  'conversion': {
    high: ['A', 'B', 'E', 'K', 'L', 'M', 'P'],
    medium: ['C', 'F', 'G', 'H', 'O'],
    low: ['Q', 'R']
  }
};

/**
 * Get comprehensive building regulations guide
 */
export async function getBuildingRegsGuide(
  address: string,
  postcode: string,
  projectType: string,
  projectDetails?: {
    floorArea?: number;
    storeys?: number;
    isAttached?: boolean;
    existingDwelling?: boolean;
    includesHabRoom?: boolean;
    commercialElement?: boolean;
    heritageConstraints?: boolean;
  }
): Promise<BuildingRegsGuide> {
  const normalizedType = projectType.toLowerCase().replace(/\s+/g, '-');
  const floorArea = projectDetails?.floorArea || 50;
  
  const overview = generateOverview(normalizedType, projectDetails);
  const applicableParts = generateApplicableParts(normalizedType, projectDetails);
  const approvalRoute = determineApprovalRoute(normalizedType, floorArea, projectDetails);
  const inspectionSchedule = generateInspectionSchedule(normalizedType);
  const compliance = generateComplianceRequirements(normalizedType, projectDetails);
  const commonIssues = getCommonIssues(normalizedType);
  const costs = calculateCosts(normalizedType, floorArea, approvalRoute);
  
  return {
    address,
    postcode,
    projectType,
    overview,
    applicableParts,
    approvalRoute,
    inspectionSchedule,
    compliance,
    commonIssues,
    costs
  };
}

/**
 * Generate overview
 */
function generateOverview(
  projectType: string,
  projectDetails?: {
    floorArea?: number;
    storeys?: number;
    isAttached?: boolean;
    existingDwelling?: boolean;
    includesHabRoom?: boolean;
    commercialElement?: boolean;
    heritageConstraints?: boolean;
  }
): RegsOverview {
  const descriptions: { [key: string]: string } = {
    'extension': 'Building Regulations approval is required for extensions to ensure structural safety, fire safety, energy efficiency, and compliance with all applicable standards.',
    'basement': 'Basement construction requires full Building Regulations approval due to significant structural implications, waterproofing requirements, and fire safety considerations.',
    'loft': 'Loft conversions creating habitable accommodation require Building Regulations approval for structural alterations, fire safety, stairs, and thermal performance.',
    'new-build': 'New dwellings require comprehensive Building Regulations approval covering all aspects of construction from foundations to completion.',
    'conversion': 'Conversions changing the use of a building require Building Regulations approval to meet standards for the new use.'
  };
  
  const exemptions = [
    'Porches under 30 square metres (ground floor, external access)',
    'Conservatories under 30 square metres (with compliant separation)',
    'Detached buildings under 15 square metres (non-habitable)',
    'Detached buildings 15-30 square metres (more than 1m from boundary)',
    'Like-for-like replacement of windows (thermal values may apply)'
  ];
  
  const description = descriptions[projectType] || descriptions['extension'] || 'Building Regulations compliance guidance for your project.';
  
  return {
    description,
    scope: [
      'Structural stability and safety',
      'Fire safety and means of escape',
      'Energy efficiency and thermal performance',
      'Ventilation and air quality',
      'Drainage and sanitation',
      'Accessibility where applicable'
    ],
    exemptions,
    timeline: 'Typical approval: 5 weeks (full plans) or ongoing (building notice)',
    keyDates: [
      { milestone: 'Submit application', timing: 'Minimum 5 weeks before start', action: 'Submit full plans or building notice' },
      { milestone: 'Start notice', timing: '2 days before starting', action: 'Notify building control of commencement' },
      { milestone: 'Foundation inspection', timing: 'Before concrete pour', action: 'Notify 24 hours in advance' },
      { milestone: 'Completion inspection', timing: 'On completion', action: 'Request completion certificate' }
    ]
  };
}

/**
 * Generate applicable parts
 */
function generateApplicableParts(
  projectType: string,
  projectDetails?: {
    floorArea?: number;
    storeys?: number;
    isAttached?: boolean;
    existingDwelling?: boolean;
    includesHabRoom?: boolean;
    commercialElement?: boolean;
    heritageConstraints?: boolean;
  }
): ApplicablePart[] {
  const defaultParts = { high: ['A', 'B', 'L', 'P'], medium: ['C', 'E', 'F', 'G', 'H', 'K'] };
  const partsMapping = PROJECT_PARTS[projectType] || PROJECT_PARTS['extension'] || defaultParts;
  const applicableParts: ApplicablePart[] = [];
  
  // Add high relevance parts
  for (const partCode of partsMapping.high) {
    const partInfo = BUILDING_REGULATIONS_PARTS[partCode];
    if (partInfo) {
      applicableParts.push(generatePartDetails(partCode, partInfo, 'high', projectType, projectDetails));
    }
  }
  
  // Add medium relevance parts
  for (const partCode of partsMapping.medium) {
    const partInfo = BUILDING_REGULATIONS_PARTS[partCode];
    if (partInfo) {
      applicableParts.push(generatePartDetails(partCode, partInfo, 'medium', projectType, projectDetails));
    }
  }
  
  return applicableParts;
}

/**
 * Generate part details
 */
function generatePartDetails(
  partCode: string,
  partInfo: { title: string; scope: string },
  relevance: 'high' | 'medium' | 'low',
  projectType: string,
  projectDetails?: {
    floorArea?: number;
    storeys?: number;
    isAttached?: boolean;
    existingDwelling?: boolean;
    includesHabRoom?: boolean;
    commercialElement?: boolean;
    heritageConstraints?: boolean;
  }
): ApplicablePart {
  const requirements = getPartRequirements(partCode, projectType);
  const keyStandards = getKeyStandards(partCode);
  const commonIssues = getPartIssues(partCode);
  
  return {
    part: `Part ${partCode}`,
    title: partInfo.title,
    relevance,
    requirements,
    keyStandards,
    commonIssues
  };
}

/**
 * Get part requirements
 */
function getPartRequirements(partCode: string, projectType: string): PartRequirement[] {
  const requirements: { [key: string]: PartRequirement[] } = {
    'A': [
      { requirement: 'Structural stability', compliance: 'Structural calculations by engineer', evidence: 'Structural engineers report' },
      { requirement: 'Adequate foundations', compliance: 'Design to suit ground conditions', evidence: 'Foundation design, soil investigation' },
      { requirement: 'Safe loading', compliance: 'Floors designed for intended loads', evidence: 'Structural drawings and calculations' }
    ],
    'B': [
      { requirement: 'Means of escape', compliance: 'Protected staircase, escape windows', evidence: 'Fire strategy drawings' },
      { requirement: 'Fire detection', compliance: 'Interlinked smoke/heat alarms', evidence: 'Alarm installation certificate' },
      { requirement: 'Internal fire spread', compliance: 'Fire doors, compartmentation', evidence: 'Fire door certificates' }
    ],
    'K': [
      { requirement: 'Stair design', compliance: 'Pitch, rise, going to Approved Document K', evidence: 'Stair drawings with dimensions' },
      { requirement: 'Guarding', compliance: 'Handrails and guards where required', evidence: 'Guard heights and specifications' },
      { requirement: 'Glazing safety', compliance: 'Safety glazing in critical locations', evidence: 'BS EN 12600 compliance' }
    ],
    'L': [
      { requirement: 'Thermal elements', compliance: 'U-values meet targets', evidence: 'SAP calculations, U-value calcs' },
      { requirement: 'Air permeability', compliance: 'Air tightness test if required', evidence: 'Air test certificate' },
      { requirement: 'Fixed building services', compliance: 'Efficient heating/lighting', evidence: 'Product specifications' }
    ],
    'P': [
      { requirement: 'Electrical installation', compliance: 'BS 7671 compliance', evidence: 'Electrical Installation Certificate' },
      { requirement: 'Notifiable work', compliance: 'Part P registered or BC notification', evidence: 'Part P certificate or BC notification' }
    ],
    'F': [
      { requirement: 'Ventilation provision', compliance: 'Background, purge, and extract ventilation', evidence: 'Ventilation strategy, fan specifications' },
      { requirement: 'Extract rates', compliance: 'Meet minimum extract rates', evidence: 'Fan performance data' }
    ],
    'E': [
      { requirement: 'Airborne sound insulation', compliance: 'Meet performance standards', evidence: 'Sound test certificate' },
      { requirement: 'Impact sound insulation', compliance: 'Floor construction specification', evidence: 'Construction details' }
    ],
    'C': [
      { requirement: 'Damp proofing', compliance: 'DPC and DPM installation', evidence: 'Construction details' },
      { requirement: 'Ground moisture resistance', compliance: 'Appropriate floor construction', evidence: 'Floor construction specification' }
    ],
    'O': [
      { requirement: 'Overheating mitigation', compliance: 'Meet simplified or dynamic method', evidence: 'Overheating assessment' },
      { requirement: 'Glazing and shading', compliance: 'Appropriate glazing ratios and shading', evidence: 'Window schedules, shading details' }
    ]
  };
  
  return requirements[partCode] || [
    { requirement: 'General compliance', compliance: 'As per Approved Document', evidence: 'Design documentation' }
  ];
}

/**
 * Get key standards
 */
function getKeyStandards(partCode: string): string[] {
  const standards: { [key: string]: string[] } = {
    'A': ['BS EN 1990 (Structural design)', 'BS EN 1991-1 (Actions on structures)', 'BS 8004 (Foundations)'],
    'B': ['BS 9991 (Fire safety)', 'BS 476 (Fire tests)', 'BS EN 13501 (Fire classification)'],
    'K': ['BS 5395 (Stairs)', 'BS 6180 (Barriers)', 'BS EN 12600 (Impact test on glazing)'],
    'L': ['SAP 10.2', 'BS EN ISO 6946 (U-value calculation)', 'CIBSE Guide A'],
    'P': ['BS 7671 (IET Wiring Regulations)', 'BS EN 61439'],
    'F': ['BS EN 16798 (Indoor environmental input)', 'BS EN 13779'],
    'E': ['BS EN ISO 717 (Sound insulation rating)', 'BS EN ISO 16283'],
    'O': ['CIBSE TM59 (Overheating)', 'SAP Appendix P']
  };
  
  return standards[partCode] || ['Approved Document ' + partCode];
}

/**
 * Get part-specific issues
 */
function getPartIssues(partCode: string): string[] {
  const issues: { [key: string]: string[] } = {
    'A': ['Inadequate foundation design', 'Missing structural calculations', 'Wall tie deficiencies'],
    'B': ['Incomplete fire stopping', 'Non-compliant fire doors', 'Inadequate means of escape'],
    'K': ['Incorrect stair dimensions', 'Missing or inadequate handrails', 'Non-safety glazing'],
    'L': ['Thermal bridging', 'Air leakage paths', 'Non-compliant windows'],
    'P': ['Uncertified electrical work', 'Missing RCDs', 'Inadequate earthing'],
    'F': ['Inadequate extract ventilation', 'Blocked trickle vents', 'MVHR commissioning issues'],
    'E': ['Failed sound test', 'Flanking transmission', 'Service penetrations']
  };
  
  return issues[partCode] || ['General compliance issues'];
}

/**
 * Determine approval route
 */
function determineApprovalRoute(
  projectType: string,
  floorArea: number,
  projectDetails?: {
    floorArea?: number;
    storeys?: number;
    isAttached?: boolean;
    existingDwelling?: boolean;
    includesHabRoom?: boolean;
    commercialElement?: boolean;
    heritageConstraints?: boolean;
  }
): ApprovalRoute {
  // Full plans generally recommended for complex projects
  const recommendFullPlans = 
    projectType === 'basement' ||
    projectType === 'new-build' ||
    projectDetails?.commercialElement ||
    floorArea > 100;
  
  const recommended = recommendFullPlans ? 'full-plans' : 'building-notice';
  
  return {
    recommended,
    reason: recommendFullPlans 
      ? 'Full plans recommended due to project complexity - provides certainty of approval before starting'
      : 'Building notice suitable for straightforward domestic work',
    alternatives: [
      {
        route: 'Full Plans',
        description: 'Detailed plans submitted for approval before work starts',
        pros: ['Certainty before starting', 'Plans checked and approved', 'Formal approval notice issued'],
        cons: ['Longer process (5 weeks)', 'More upfront design work', 'Higher initial fee'],
        suitability: 'Complex projects, structural work, commercial elements'
      },
      {
        route: 'Building Notice',
        description: 'Notice given 48 hours before work starts, inspected as built',
        pros: ['Quicker to start', 'Less paperwork', 'Lower initial fee'],
        cons: ['No formal approval', 'Risk of non-compliance discovered on site', 'May need alterations'],
        suitability: 'Simple domestic work, experienced contractors'
      },
      {
        route: 'Regularisation',
        description: 'Retrospective approval for work done without consent',
        pros: ['Resolves historic non-compliance', 'Can provide certificate'],
        cons: ['May require opening up', 'Cannot verify concealed work', 'Premium fee (usually 100%+)'],
        suitability: 'Historic work only - not a route to choose intentionally'
      }
    ],
    timeline: recommended === 'full-plans' ? '5-8 weeks for approval' : '48 hours notice',
    costs: {
      planCharge: recommended === 'full-plans' ? 300 : 0,
      inspectionCharge: 500,
      total: recommended === 'full-plans' ? 800 : 500
    }
  };
}

/**
 * Generate inspection schedule
 */
function generateInspectionSchedule(projectType: string): BCInspectionSchedule {
  const baseInspections: ScheduledInspection[] = [
    {
      stage: 'Commencement',
      timing: 'Start of work on site',
      noticeRequired: '2 clear days before starting',
      whatIsChecked: ['Site setup', 'Access for inspections'],
      documentation: ['Approved plans if full plans route']
    },
    {
      stage: 'Foundation excavation',
      timing: 'Trenches open, before concrete',
      noticeRequired: '24 hours',
      whatIsChecked: ['Depth adequate', 'Ground conditions', 'Formation level', 'Reinforcement'],
      documentation: ['Foundation design', 'Structural details']
    },
    {
      stage: 'Foundation concrete',
      timing: 'Concrete in trenches/raft',
      noticeRequired: '24 hours',
      whatIsChecked: ['Concrete specification', 'Pour quality', 'Levels'],
      documentation: ['Concrete mix design']
    },
    {
      stage: 'DPC/oversite',
      timing: 'At damp proof course level',
      noticeRequired: '24 hours',
      whatIsChecked: ['DPC continuity', 'Cavity closers', 'Wall ties', 'Insulation position'],
      documentation: ['Wall construction details']
    },
    {
      stage: 'Drains (pre-covering)',
      timing: 'Drains laid, before backfill',
      noticeRequired: '24 hours',
      whatIsChecked: ['Falls adequate', 'Joints sound', 'Connections correct', 'Water/air test'],
      documentation: ['Drainage layout']
    },
    {
      stage: 'Pre-plaster/first fix',
      timing: 'Services installed, before covering',
      noticeRequired: '24 hours',
      whatIsChecked: ['Structure complete', 'Insulation installed', 'Services roughed in', 'Fire stopping'],
      documentation: ['Insulation certificates', 'Structural completion']
    },
    {
      stage: 'Completion',
      timing: 'Work complete and ready for occupation',
      noticeRequired: '48 hours',
      whatIsChecked: ['All work complete', 'All certificates obtained', 'Safe for occupation'],
      documentation: ['Electrical certificate', 'Gas certificate', 'EPC', 'Test certificates']
    }
  ];
  
  // Add project-specific inspections
  if (projectType === 'basement') {
    baseInspections.splice(3, 0, {
      stage: 'Waterproofing',
      timing: 'Before internal finishes',
      noticeRequired: '24 hours',
      whatIsChecked: ['Waterproofing system complete', 'Drainage operational'],
      documentation: ['Waterproofing warranty']
    });
  }
  
  return {
    inspections: baseInspections,
    notificationProcess: 'Contact building control by phone/email with inspection request and site address',
    inspectorExpectations: [
      'Be on site at arranged time',
      'Have relevant drawings available',
      'Ensure areas to be inspected are accessible',
      'Be prepared to answer questions',
      'Don\'t cover up work until inspected'
    ]
  };
}

/**
 * Generate compliance requirements
 */
function generateComplianceRequirements(
  projectType: string,
  projectDetails?: {
    floorArea?: number;
    storeys?: number;
    isAttached?: boolean;
    existingDwelling?: boolean;
    includesHabRoom?: boolean;
    commercialElement?: boolean;
    heritageConstraints?: boolean;
  }
): ComplianceRequirements {
  return {
    designStage: [
      { requirement: 'Structural design', standard: 'Part A', verification: 'Engineer\'s calculations and drawings' },
      { requirement: 'Fire strategy', standard: 'Part B', verification: 'Fire strategy document if complex' },
      { requirement: 'Thermal calculations', standard: 'Part L', verification: 'SAP calculations, U-value schedules' },
      { requirement: 'Ventilation strategy', standard: 'Part F', verification: 'Ventilation specification' }
    ],
    constructionStage: [
      { requirement: 'Foundation construction', inspection: 'BC inspection', evidence: 'Inspection record' },
      { requirement: 'Structural integrity', inspection: 'BC inspection at key stages', evidence: 'Inspection record' },
      { requirement: 'Insulation installation', inspection: 'Pre-plaster inspection', evidence: 'Insulation certificates' },
      { requirement: 'Fire stopping', inspection: 'Pre-plaster inspection', evidence: 'Photographic record' }
    ],
    completionStage: [
      { requirement: 'Electrical installation', certificate: 'EIC', provider: 'Part P electrician' },
      { requirement: 'Gas installation', certificate: 'Gas Safe certificate', provider: 'Gas Safe engineer' },
      { requirement: 'Energy assessment', certificate: 'EPC', provider: 'DEA' },
      { requirement: 'Overall compliance', certificate: 'Completion Certificate', provider: 'Building Control' }
    ]
  };
}

/**
 * Get common issues
 */
function getCommonIssues(projectType: string): RegulationIssue[] {
  return [
    {
      issue: 'Thermal bridging at junctions',
      part: 'Part L',
      frequency: 'common',
      consequence: 'Failed thermal calculations, condensation risk',
      prevention: 'Detail junctions properly, use insulated lintels'
    },
    {
      issue: 'Inadequate fire stopping',
      part: 'Part B',
      frequency: 'common',
      consequence: 'Fire spread risk, BC rejection',
      prevention: 'Install fire stops at all penetrations and junctions'
    },
    {
      issue: 'Non-compliant stair design',
      part: 'Part K',
      frequency: 'occasional',
      consequence: 'Unsafe stairs, rebuild required',
      prevention: 'Check dimensions against AD K before construction'
    },
    {
      issue: 'Missing electrical certificates',
      part: 'Part P',
      frequency: 'common',
      consequence: 'No completion certificate',
      prevention: 'Use Part P registered electrician from start'
    },
    {
      issue: 'Ventilation not commissioned',
      part: 'Part F',
      frequency: 'occasional',
      consequence: 'Indoor air quality issues, BC rejection',
      prevention: 'Commission and document all ventilation systems'
    }
  ];
}

/**
 * Calculate costs
 */
function calculateCosts(
  projectType: string,
  floorArea: number,
  approvalRoute: ApprovalRoute
): RegsCosts {
  // Base fees (vary by local authority)
  const baseFee = 300;
  const areaMultiplier = Math.ceil(floorArea / 40);
  
  const applicationFees: ApplicationFees = {
    planCharge: approvalRoute.recommended === 'full-plans' ? baseFee + (areaMultiplier * 50) : 0,
    inspectionCharge: baseFee + (areaMultiplier * 100),
    regularisationSurcharge: baseFee * 2
  };
  
  const complianceCosts: ComplianceCost[] = [
    { item: 'Structural engineer', estimated: 1500, notes: 'Design and calculations' },
    { item: 'SAP assessment', estimated: 200, notes: 'Energy calculations' },
    { item: 'Fire door upgrades', estimated: 800, notes: 'If required' }
  ];
  
  const testingCosts: TestingCost[] = [
    { test: 'Electrical Installation Certificate', cost: 0, mandatory: true }, // Included in electrical work
    { test: 'Gas Safe Certificate', cost: 0, mandatory: true }, // Included in gas work
    { test: 'EPC', cost: 80, mandatory: true }
  ];
  
  if (projectType === 'new-build' || projectType === 'conversion') {
    testingCosts.push(
      { test: 'Air Tightness Test', cost: 300, mandatory: true },
      { test: 'Sound Test', cost: 400, mandatory: true }
    );
  }
  
  const totalFees = applicationFees.planCharge + applicationFees.inspectionCharge;
  const totalCompliance = complianceCosts.reduce((sum, c) => sum + c.estimated, 0);
  const totalTesting = testingCosts.reduce((sum, t) => sum + t.cost, 0);
  
  return {
    applicationFees,
    complianceCosts,
    testingCosts,
    total: {
      minimum: totalFees + totalTesting,
      typical: totalFees + totalCompliance + totalTesting,
      maximum: (totalFees + totalCompliance + totalTesting) * 1.5
    }
  };
}

/**
 * Check if work is exempt from Building Regulations
 */
export async function checkExemption(
  workType: string,
  details: {
    floorArea?: number;
    distanceFromBoundary?: number;
    isDetached?: boolean;
    hasHeating?: boolean;
    hasSleeping?: boolean;
  }
): Promise<{
  exempt: boolean;
  reason: string;
  conditions: string[];
  recommendation: string;
}> {
  const area = details.floorArea || 0;
  const distance = details.distanceFromBoundary || 0;
  
  // Check common exemptions
  if (workType === 'conservatory' && area <= 30 && !details.hasHeating) {
    return {
      exempt: true,
      reason: 'Conservatories under 30sqm are exempt if certain conditions met',
      conditions: [
        'Floor area not exceeding 30 square metres',
        'Glazing complies with Part K and N',
        'Doors separating from dwelling',
        'Independent heating with own controls',
        'Electric installation by Part P electrician'
      ],
      recommendation: 'Verify all conditions are met; consider voluntary BC inspection'
    };
  }
  
  if (workType === 'detached-building' && details.isDetached) {
    if (area <= 15) {
      return {
        exempt: true,
        reason: 'Detached buildings under 15sqm are exempt',
        conditions: [
          'No sleeping accommodation',
          'Not attached to dwelling'
        ],
        recommendation: 'Ensure no habitable use; electrical work still needs Part P compliance'
      };
    }
    if (area <= 30 && distance > 1) {
      return {
        exempt: true,
        reason: 'Detached buildings 15-30sqm more than 1m from boundary are exempt',
        conditions: [
          'No sleeping accommodation',
          'Not attached to dwelling',
          'More than 1m from any boundary',
          'Substantially non-combustible OR more than 1m from boundary'
        ],
        recommendation: 'Document measurements; ensure fire safety provisions if near boundary'
      };
    }
  }
  
  return {
    exempt: false,
    reason: 'Work appears to require Building Regulations approval',
    conditions: [],
    recommendation: 'Submit Building Notice or Full Plans application before starting work'
  };
}

export default {
  getBuildingRegsGuide,
  checkExemption
};
