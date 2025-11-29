/**
 * Construction Phase Management Service
 * 
 * Comprehensive guidance for managing the construction phase
 * of planning-approved developments
 */

// Types
interface ConstructionManagement {
  address: string;
  postcode: string;
  projectType: string;
  phases: ConstructionPhase[];
  preCommencement: PreCommencementRequirements;
  conditionsCompliance: ConditionCompliance[];
  healthAndSafety: HealthAndSafetyRequirements;
  neighborManagement: NeighborManagement;
  qualityControl: QualityControl;
  inspectionSchedule: InspectionSchedule;
  completionRequirements: CompletionRequirements;
  riskManagement: RiskManagement;
}

interface ConstructionPhase {
  phase: string;
  order: number;
  description: string;
  typicalDuration: string;
  keyActivities: string[];
  inspectionsRequired: string[];
  conditionsToDischarge: string[];
  neighborNotice: boolean;
}

interface PreCommencementRequirements {
  conditions: PreCommencementCondition[];
  buildingControl: BuildingControlRequirements;
  utilities: UtilityRequirements;
  partyWall: PartyWallRequirements;
  insurance: InsuranceRequirements;
}

interface PreCommencementCondition {
  condition: string;
  description: string;
  submissionRequired: string;
  typicalApprovalTime: string;
  fee: number;
  consequences: string;
}

interface BuildingControlRequirements {
  noticeType: 'building-notice' | 'full-plans';
  fee: number;
  submissionTiming: string;
  inspectionsRequired: string[];
}

interface UtilityRequirements {
  utilities: UtilityConnection[];
  timing: string;
}

interface UtilityConnection {
  utility: string;
  provider: string;
  action: string;
  leadTime: string;
}

interface PartyWallRequirements {
  required: boolean;
  noticeTypes: string[];
  noticeRecipients: string[];
  timeline: string;
  surveyor: string;
  estimatedCost: number;
}

interface InsuranceRequirements {
  insuranceTypes: InsuranceType[];
  warranties: WarrantyRequirement[];
}

interface InsuranceType {
  type: string;
  coverage: string;
  minimumCover: string;
  mandatory: boolean;
}

interface WarrantyRequirement {
  warranty: string;
  provider: string;
  duration: string;
  coverage: string;
}

interface ConditionCompliance {
  conditionNumber: string;
  conditionType: 'pre-commencement' | 'during-construction' | 'pre-occupation' | 'ongoing';
  requirement: string;
  complianceMethod: string;
  evidenceRequired: string;
  deadline: string;
}

interface HealthAndSafetyRequirements {
  cdmApplicable: boolean;
  principalDesigner: string;
  principalContractor: string;
  notifications: HSENotification[];
  siteRequirements: string[];
  emergencyProcedures: string[];
}

interface HSENotification {
  notification: string;
  required: boolean;
  timing: string;
}

interface NeighborManagement {
  communicationPlan: CommunicationStep[];
  noiseManagement: NoiseManagementPlan;
  dustManagement: DustManagementPlan;
  accessManagement: AccessManagementPlan;
  complaintsProcedure: ComplaintsProcedure;
}

interface CommunicationStep {
  timing: string;
  action: string;
  content: string;
  method: string;
}

interface NoiseManagementPlan {
  permittedHours: WorkingHours;
  noisyActivities: NoisyActivity[];
  mitigation: string[];
  monitoring: string;
}

interface WorkingHours {
  weekday: string;
  saturday: string;
  sunday: string;
  bankHoliday: string;
}

interface NoisyActivity {
  activity: string;
  restriction: string;
  alternativeApproach: string;
}

interface DustManagementPlan {
  measures: string[];
  monitoring: string;
  triggers: string;
  response: string;
}

interface AccessManagementPlan {
  vehicleAccess: string;
  pedestrianAccess: string;
  parkingArrangements: string;
  deliverySchedule: string;
}

interface ComplaintsProcedure {
  contactPerson: string;
  contactMethod: string;
  responseTime: string;
  escalation: string;
}

interface QualityControl {
  inspectionPoints: InspectionPoint[];
  materialApprovals: MaterialApproval[];
  documentationRequired: string[];
  signOffProcess: string;
}

interface InspectionPoint {
  stage: string;
  items: string[];
  inspector: string;
  timing: string;
}

interface MaterialApproval {
  material: string;
  approvalRequired: boolean;
  approver: string;
  sampleRequired: boolean;
}

interface InspectionSchedule {
  buildingControlInspections: BCInspection[];
  warrantInspections: string[];
  planningInspections: string[];
}

interface BCInspection {
  stage: string;
  noticeRequired: string;
  whatToExpect: string;
}

interface CompletionRequirements {
  planningConditions: string[];
  buildingControl: BCCompletion;
  utilityConnections: string[];
  warranties: string[];
  documentation: string[];
}

interface BCCompletion {
  completionCertificate: boolean;
  requiredInspections: string[];
  asBuiltDrawings: boolean;
  testCertificates: string[];
}

interface RiskManagement {
  commonRisks: Risk[];
  mitigationStrategies: string[];
  contingencyPlanning: string[];
}

interface Risk {
  risk: string;
  likelihood: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
  mitigation: string;
}

// Phase templates by project type
const PHASE_TEMPLATES: { [key: string]: { phases: string[]; durations: string[] } } = {
  'extension': {
    phases: ['Groundworks', 'Foundations', 'Superstructure', 'Roof', 'Windows/Doors', 'Internal fit-out', 'Finishes'],
    durations: ['1-2 weeks', '1-2 weeks', '3-4 weeks', '1-2 weeks', '1 week', '3-4 weeks', '2-3 weeks']
  },
  'basement': {
    phases: ['Enabling works', 'Excavation', 'Underpinning', 'Waterproofing', 'Structure', 'Internal works', 'Garden reinstatement'],
    durations: ['2-3 weeks', '4-8 weeks', '4-6 weeks', '2-3 weeks', '4-6 weeks', '6-8 weeks', '2-3 weeks']
  },
  'loft': {
    phases: ['Scaffolding', 'Roof works', 'Structural alterations', 'Windows', 'Internal fit-out', 'Finishes'],
    durations: ['2-3 days', '2-3 weeks', '1-2 weeks', '1 week', '3-4 weeks', '2 weeks']
  },
  'new-build': {
    phases: ['Site clearance', 'Foundations', 'Substructure', 'Superstructure', 'Roof', 'Building envelope', 'First fix', 'Second fix', 'Finishes', 'External works'],
    durations: ['1-2 weeks', '2-4 weeks', '2-3 weeks', '6-10 weeks', '2-4 weeks', '2-3 weeks', '4-6 weeks', '4-6 weeks', '3-4 weeks', '2-4 weeks']
  }
};

/**
 * Get comprehensive construction management plan
 */
export async function getConstructionManagement(
  address: string,
  postcode: string,
  projectType: string,
  projectDetails?: {
    estimatedDuration?: number;
    startDate?: string;
    contractValue?: number;
    numWorkers?: number;
    hasBasement?: boolean;
    partyWallsAffected?: number;
    listedBuilding?: boolean;
    conservationArea?: boolean;
    planningConditions?: string[];
  }
): Promise<ConstructionManagement> {
  const normalizedType = projectType.toLowerCase().replace(/\s+/g, '-');
  const hasBasement = projectDetails?.hasBasement || normalizedType.includes('basement');
  const contractValue = projectDetails?.contractValue || 100000;
  const numWorkers = projectDetails?.numWorkers || 5;
  
  const phases = generatePhases(normalizedType, projectDetails?.estimatedDuration);
  const preCommencement = generatePreCommencementRequirements(
    normalizedType,
    projectDetails?.partyWallsAffected || 0,
    projectDetails?.listedBuilding || false
  );
  
  const conditionsCompliance = generateConditionsCompliance(
    projectDetails?.planningConditions || [],
    normalizedType
  );
  
  const healthAndSafety = generateHealthAndSafety(contractValue, numWorkers);
  const neighborManagement = generateNeighborManagement(hasBasement);
  const qualityControl = generateQualityControl(normalizedType, projectDetails?.listedBuilding || false);
  const inspectionSchedule = generateInspectionSchedule(normalizedType);
  const completionRequirements = generateCompletionRequirements(normalizedType);
  const riskManagement = generateRiskManagement(normalizedType, hasBasement);
  
  return {
    address,
    postcode,
    projectType,
    phases,
    preCommencement,
    conditionsCompliance,
    healthAndSafety,
    neighborManagement,
    qualityControl,
    inspectionSchedule,
    completionRequirements,
    riskManagement
  };
}

/**
 * Generate construction phases
 */
function generatePhases(projectType: string, estimatedDuration?: number): ConstructionPhase[] {
  const templateData = PHASE_TEMPLATES[projectType];
  const template = templateData || { 
    phases: ['Groundworks', 'Structure', 'Finishes'], 
    durations: ['2 weeks', '4 weeks', '2 weeks'] 
  };
  const phases: ConstructionPhase[] = [];
  
  for (let i = 0; i < template.phases.length; i++) {
    const phaseName = template.phases[i] || 'Phase';
    const phaseDuration = template.durations[i] || '2 weeks';
    
    phases.push({
      phase: phaseName,
      order: i + 1,
      description: getPhaseDescription(phaseName),
      typicalDuration: phaseDuration,
      keyActivities: getPhaseActivities(phaseName),
      inspectionsRequired: getPhaseInspections(phaseName),
      conditionsToDischarge: getPhaseConditions(phaseName),
      neighborNotice: isNoisyPhase(phaseName)
    });
  }
  
  return phases;
}

/**
 * Get phase description
 */
function getPhaseDescription(phase: string): string {
  const descriptions: { [key: string]: string } = {
    'Groundworks': 'Site preparation including excavation, drainage, and ground preparation',
    'Foundations': 'Construction of foundation system including concrete pours',
    'Excavation': 'Major excavation works for basement construction',
    'Underpinning': 'Sequential underpinning of existing foundations',
    'Waterproofing': 'Installation of waterproofing membrane and drainage systems',
    'Superstructure': 'Construction of walls, floors, and structural frame',
    'Roof': 'Roof structure and covering installation',
    'Scaffolding': 'Erection of access scaffolding',
    'Structure': 'Main structural works',
    'Windows/Doors': 'Installation of windows and external doors',
    'Internal fit-out': 'First and second fix including electrics, plumbing, plastering',
    'Finishes': 'Final finishes including decoration and flooring',
    'External works': 'Landscaping, paving, and boundary treatments',
    'Building envelope': 'External cladding and weatherproofing',
    'First fix': 'Electrical, plumbing and joinery first fix',
    'Second fix': 'Electrical, plumbing and joinery second fix',
    'Site clearance': 'Demolition and site clearance works',
    'Substructure': 'Below ground structural works'
  };
  
  return descriptions[phase] || `${phase} construction activities`;
}

/**
 * Get phase activities
 */
function getPhaseActivities(phase: string): string[] {
  const activities: { [key: string]: string[] } = {
    'Groundworks': ['Strip topsoil', 'Excavate to formation level', 'Install drainage runs', 'Compact sub-base'],
    'Foundations': ['Excavate trenches', 'Install reinforcement', 'Pour concrete', 'Cure concrete'],
    'Excavation': ['Install sheet piling/secant wall', 'Sequential excavation', 'Remove spoil', 'Monitor movement'],
    'Underpinning': ['Sequence underpinning bays', 'Excavate beneath foundations', 'Pour concrete', 'Cure and strike'],
    'Superstructure': ['Build masonry walls', 'Install steel/timber frame', 'Construct floor structures'],
    'Roof': ['Install roof structure', 'Fit roof covering', 'Install flashings', 'Complete rainwater goods'],
    'Internal fit-out': ['First fix electrics', 'First fix plumbing', 'Plastering', 'Second fix'],
    'Finishes': ['Decoration', 'Floor finishes', 'Sanitaryware', 'Kitchen installation']
  };
  
  return activities[phase] || ['Complete phase works', 'Quality checks', 'Prepare for next phase'];
}

/**
 * Get phase inspections
 */
function getPhaseInspections(phase: string): string[] {
  const inspections: { [key: string]: string[] } = {
    'Foundations': ['Building Control - foundation inspection before pour'],
    'Excavation': ['Party wall surveyor inspection', 'Monitoring review'],
    'Superstructure': ['Building Control - damp proof course', 'Structural engineer inspection'],
    'Roof': ['Building Control - roof structure'],
    'Internal fit-out': ['Electrical inspection', 'Gas safe inspection', 'Building Control - pre-plaster'],
    'Finishes': ['Final building control inspection']
  };
  
  return inspections[phase] || [];
}

/**
 * Get phase conditions to discharge
 */
function getPhaseConditions(phase: string): string[] {
  const conditions: { [key: string]: string[] } = {
    'Groundworks': ['Drainage details', 'Levels'],
    'Foundations': ['Foundation design'],
    'Superstructure': ['External materials', 'Boundary treatment'],
    'Internal fit-out': ['Internal finishes (if specified)'],
    'External works': ['Landscaping scheme', 'Boundary treatment']
  };
  
  return conditions[phase] || [];
}

/**
 * Check if phase is noisy
 */
function isNoisyPhase(phase: string): boolean {
  const noisyPhases = ['Groundworks', 'Foundations', 'Excavation', 'Underpinning', 'Demolition', 'Scaffolding', 'Roof', 'Site clearance'];
  return noisyPhases.includes(phase);
}

/**
 * Generate pre-commencement requirements
 */
function generatePreCommencementRequirements(
  projectType: string,
  partyWallsAffected: number,
  listedBuilding: boolean
): PreCommencementRequirements {
  const conditions: PreCommencementCondition[] = [
    {
      condition: 'Construction Management Plan',
      description: 'Details of construction methodology, hours, access, and neighbor management',
      submissionRequired: 'CMP document addressing all policy requirements',
      typicalApprovalTime: '4-8 weeks',
      fee: 116,
      consequences: 'Cannot commence works until discharged'
    },
    {
      condition: 'External Materials',
      description: 'Samples/details of all external facing materials',
      submissionRequired: 'Material schedule with samples or manufacturer references',
      typicalApprovalTime: '4-6 weeks',
      fee: 116,
      consequences: 'Cannot install materials until approved'
    }
  ];
  
  if (projectType.includes('basement')) {
    conditions.push({
      condition: 'Basement Impact Assessment',
      description: 'Structural methodology and monitoring strategy',
      submissionRequired: 'BIA from structural engineer',
      typicalApprovalTime: '6-8 weeks',
      fee: 116,
      consequences: 'Cannot excavate until approved'
    });
  }
  
  // Building control requirements
  const buildingControl: BuildingControlRequirements = {
    noticeType: 'full-plans',
    fee: calculateBCFee(projectType),
    submissionTiming: 'Minimum 5 weeks before commencement (for full plans)',
    inspectionsRequired: [
      'Commencement',
      'Foundation excavation',
      'Foundation concrete',
      'DPC level',
      'Drains before covering',
      'Pre-occupation'
    ]
  };
  
  // Utility requirements
  const utilities: UtilityRequirements = {
    utilities: [
      { utility: 'Electricity', provider: 'UKPN', action: 'New connection/upgrade', leadTime: '4-12 weeks' },
      { utility: 'Gas', provider: 'Cadent', action: 'New connection/alteration', leadTime: '4-8 weeks' },
      { utility: 'Water', provider: 'Thames Water', action: 'New connection', leadTime: '2-4 weeks' },
      { utility: 'Drainage', provider: 'Thames Water', action: 'Build over agreement', leadTime: '3-6 weeks' }
    ],
    timing: 'Apply at least 6 weeks before connection required'
  };
  
  // Party wall requirements
  const partyWall: PartyWallRequirements = {
    required: partyWallsAffected > 0,
    noticeTypes: partyWallsAffected > 0 ? ['Section 1 Notice', 'Section 2 Notice', 'Section 6 Notice'] : [],
    noticeRecipients: partyWallsAffected > 0 ? ['Adjoining owners on all affected boundaries'] : [],
    timeline: 'Serve notices 2 months before works; allow 14 days for response',
    surveyor: 'Appoint party wall surveyor if consent not given',
    estimatedCost: partyWallsAffected * 2500
  };
  
  // Insurance requirements
  const insurance: InsuranceRequirements = {
    insuranceTypes: [
      { type: 'Public Liability', coverage: 'Third party injury/damage', minimumCover: '£5 million', mandatory: true },
      { type: 'Employer\'s Liability', coverage: 'Employee injury', minimumCover: '£10 million', mandatory: true },
      { type: 'Contract Works', coverage: 'Works in progress', minimumCover: 'Contract value', mandatory: true },
      { type: 'Professional Indemnity', coverage: 'Design liability', minimumCover: '£2 million', mandatory: false }
    ],
    warranties: [
      { warranty: 'Structural Warranty', provider: 'NHBC/Premier/Checkmate', duration: '10 years', coverage: 'Structural defects' },
      { warranty: 'Basement Warranty', provider: 'Premier/Buildzone', duration: '10 years', coverage: 'Waterproofing failure' }
    ]
  };
  
  return {
    conditions,
    buildingControl,
    utilities,
    partyWall,
    insurance
  };
}

/**
 * Calculate building control fee
 */
function calculateBCFee(projectType: string): number {
  const fees: { [key: string]: number } = {
    'extension': 800,
    'basement': 1500,
    'loft': 600,
    'new-build': 2500,
    'conversion': 1000
  };
  
  return fees[projectType] || 800;
}

/**
 * Generate conditions compliance schedule
 */
function generateConditionsCompliance(
  conditions: string[],
  projectType: string
): ConditionCompliance[] {
  // Standard conditions for all developments
  const standardConditions: ConditionCompliance[] = [
    {
      conditionNumber: '1',
      conditionType: 'pre-commencement',
      requirement: 'Construction Management Plan',
      complianceMethod: 'Submit detailed CMP for approval',
      evidenceRequired: 'Approved CMP document',
      deadline: 'Before any works commence'
    },
    {
      conditionNumber: '2',
      conditionType: 'pre-commencement',
      requirement: 'External materials approval',
      complianceMethod: 'Submit samples/specifications for approval',
      evidenceRequired: 'Approval letter from LPA',
      deadline: 'Before relevant works'
    },
    {
      conditionNumber: '3',
      conditionType: 'during-construction',
      requirement: 'Construction hours compliance',
      complianceMethod: 'Adhere to permitted hours',
      evidenceRequired: 'Site diary records',
      deadline: 'Throughout construction'
    },
    {
      conditionNumber: '4',
      conditionType: 'pre-occupation',
      requirement: 'Landscaping implementation',
      complianceMethod: 'Complete approved landscaping scheme',
      evidenceRequired: 'Photographs, planting receipts',
      deadline: 'Before first occupation'
    }
  ];
  
  // Add project-specific conditions
  if (projectType.includes('basement')) {
    standardConditions.push({
      conditionNumber: '5',
      conditionType: 'during-construction',
      requirement: 'Monitoring regime',
      complianceMethod: 'Implement approved monitoring strategy',
      evidenceRequired: 'Monitoring reports at specified intervals',
      deadline: 'Throughout basement works'
    });
  }
  
  return standardConditions;
}

/**
 * Generate health and safety requirements
 */
function generateHealthAndSafety(contractValue: number, numWorkers: number): HealthAndSafetyRequirements {
  const cdmApplicable = contractValue > 10000 || numWorkers > 1;
  
  return {
    cdmApplicable,
    principalDesigner: cdmApplicable ? 'Architect or other competent person' : 'Not required',
    principalContractor: cdmApplicable ? 'Main contractor' : 'Not required',
    notifications: [
      {
        notification: 'F10 notification to HSE',
        required: numWorkers > 20 || contractValue > 30000,
        timing: 'Before construction phase begins'
      }
    ],
    siteRequirements: [
      'Welfare facilities for workers',
      'First aid provision',
      'Site security and hoarding',
      'Safe access and egress',
      'Method statements for high-risk activities',
      'PPE requirements enforced'
    ],
    emergencyProcedures: [
      'Emergency contact numbers displayed',
      'First aider on site',
      'Fire evacuation procedure',
      'Accident reporting process',
      'Emergency services access maintained'
    ]
  };
}

/**
 * Generate neighbor management plan
 */
function generateNeighborManagement(hasBasement: boolean): NeighborManagement {
  return {
    communicationPlan: [
      {
        timing: '2 weeks before start',
        action: 'Initial notification',
        content: 'Start date, duration, contact details, working hours',
        method: 'Letter to all immediate neighbors'
      },
      {
        timing: 'Before noisy phases',
        action: 'Specific phase notification',
        content: 'What to expect, duration, mitigation measures',
        method: 'Letter and door knock'
      },
      {
        timing: 'Weekly',
        action: 'Progress update',
        content: 'Progress, upcoming works, any issues',
        method: 'Notice board at site / email updates'
      },
      {
        timing: 'On completion',
        action: 'Completion notification',
        content: 'Thank you, any snagging to complete',
        method: 'Letter'
      }
    ],
    noiseManagement: {
      permittedHours: {
        weekday: '08:00 - 18:00',
        saturday: '08:00 - 13:00',
        sunday: 'No work permitted',
        bankHoliday: 'No work permitted'
      },
      noisyActivities: [
        { activity: 'Percussion drilling', restriction: '09:00 - 17:00 only', alternativeApproach: 'Use diamond drilling where possible' },
        { activity: 'Breaking out', restriction: '10:00 - 16:00 only', alternativeApproach: 'Use quieter hydraulic methods' },
        { activity: 'Deliveries', restriction: 'Avoid school run times', alternativeApproach: 'Schedule for mid-morning' }
      ],
      mitigation: [
        'Acoustic barriers around noisy equipment',
        'Modern equipment with noise suppression',
        'Regular equipment maintenance',
        'Noise monitoring at boundary'
      ],
      monitoring: hasBasement ? 'Continuous noise and vibration monitoring' : 'Periodic noise level checks'
    },
    dustManagement: {
      measures: [
        'Damping down of dusty surfaces',
        'Covered skips and chutes',
        'Sheet covering of stockpiles',
        'Wheel washing before leaving site',
        'Regular site sweeping'
      ],
      monitoring: 'Visual monitoring throughout day',
      triggers: 'Visible dust at boundary',
      response: 'Increase damping, suspend activity if necessary'
    },
    accessManagement: {
      vehicleAccess: 'Designated loading/unloading area, banksman for reversing',
      pedestrianAccess: 'Maintained safe pedestrian route at all times',
      parkingArrangements: 'No contractor parking on public highway',
      deliverySchedule: '09:30 - 15:30 to avoid school and rush hour times'
    },
    complaintsProcedure: {
      contactPerson: 'Site Manager or Project Manager',
      contactMethod: 'Phone number displayed at site entrance',
      responseTime: 'Within 2 hours during working hours',
      escalation: 'Architect/Main contractor if not resolved within 24 hours'
    }
  };
}

/**
 * Generate quality control requirements
 */
function generateQualityControl(projectType: string, listedBuilding: boolean): QualityControl {
  const inspectionPoints: InspectionPoint[] = [
    {
      stage: 'Foundation',
      items: ['Excavation depth', 'Ground conditions', 'Reinforcement placement', 'Concrete quality'],
      inspector: 'Structural engineer',
      timing: 'Before concrete pour'
    },
    {
      stage: 'Structure',
      items: ['Wall alignment', 'Opening sizes', 'DPC continuity', 'Wall ties'],
      inspector: 'Building control',
      timing: 'At DPC level and ongoing'
    },
    {
      stage: 'Roof',
      items: ['Structure adequacy', 'Insulation installation', 'Ventilation provision'],
      inspector: 'Building control',
      timing: 'Before covering'
    },
    {
      stage: 'Services',
      items: ['Electrical installation', 'Gas installation', 'Plumbing'],
      inspector: 'Certified electrician/gas engineer',
      timing: 'Before concealing and at completion'
    }
  ];
  
  const materialApprovals: MaterialApproval[] = [
    { material: 'Bricks/facing materials', approvalRequired: true, approver: 'Planning officer', sampleRequired: true },
    { material: 'Roof tiles/slates', approvalRequired: true, approver: 'Planning officer', sampleRequired: true },
    { material: 'Windows', approvalRequired: true, approver: 'Planning officer', sampleRequired: false },
    { material: 'Rainwater goods', approvalRequired: false, approver: 'N/A', sampleRequired: false }
  ];
  
  if (listedBuilding) {
    materialApprovals.push(
      { material: 'Lime mortar', approvalRequired: true, approver: 'Conservation officer', sampleRequired: true },
      { material: 'Traditional materials', approvalRequired: true, approver: 'Conservation officer', sampleRequired: true }
    );
  }
  
  return {
    inspectionPoints,
    materialApprovals,
    documentationRequired: [
      'Site diary',
      'Photographic record of key stages',
      'Material delivery notes',
      'Test certificates',
      'Inspection records'
    ],
    signOffProcess: 'Each stage signed off before proceeding to next'
  };
}

/**
 * Generate inspection schedule
 */
function generateInspectionSchedule(projectType: string): InspectionSchedule {
  return {
    buildingControlInspections: [
      { stage: 'Commencement', noticeRequired: '24-48 hours', whatToExpect: 'Site setup check' },
      { stage: 'Excavations', noticeRequired: '24 hours', whatToExpect: 'Ground conditions, drainage depths' },
      { stage: 'Foundations', noticeRequired: '24 hours', whatToExpect: 'Reinforcement and ground bearing' },
      { stage: 'DPC', noticeRequired: '24 hours', whatToExpect: 'Damp proof course installation' },
      { stage: 'Drains', noticeRequired: '24 hours', whatToExpect: 'Drain runs before backfilling' },
      { stage: 'Pre-plaster', noticeRequired: '24 hours', whatToExpect: 'First fix completion' },
      { stage: 'Completion', noticeRequired: '48 hours', whatToExpect: 'Final inspection for certificate' }
    ],
    warrantInspections: [
      'Foundation completion',
      'Wall plate level',
      'Wind and watertight',
      'First fix completion',
      'Final completion'
    ],
    planningInspections: [
      'During construction if requested',
      'Post-completion compliance check'
    ]
  };
}

/**
 * Generate completion requirements
 */
function generateCompletionRequirements(projectType: string): CompletionRequirements {
  return {
    planningConditions: [
      'All pre-occupation conditions discharged',
      'Landscaping implemented',
      'Parking and cycle storage provided',
      'Refuse storage operational'
    ],
    buildingControl: {
      completionCertificate: true,
      requiredInspections: ['Final inspection passed'],
      asBuiltDrawings: true,
      testCertificates: [
        'Electrical Installation Certificate',
        'Gas Safe Certificate',
        'Commissioning certificates (heating, ventilation)',
        'Sound test certificate (if applicable)',
        'Air tightness test certificate'
      ]
    },
    utilityConnections: [
      'Electricity connected and certified',
      'Gas connected and certified',
      'Water supply connected',
      'Drainage connected and tested'
    ],
    warranties: [
      'Structural warranty arranged',
      'Waterproofing warranty (if basement)',
      'Roofing warranty',
      'Window/door guarantees'
    ],
    documentation: [
      'O&M manuals for all systems',
      'Product guarantees and warranties',
      'As-built drawings',
      'EPC certificate',
      'Building control completion certificate'
    ]
  };
}

/**
 * Generate risk management plan
 */
function generateRiskManagement(projectType: string, hasBasement: boolean): RiskManagement {
  const commonRisks: Risk[] = [
    { risk: 'Weather delays', likelihood: 'medium', impact: 'medium', mitigation: 'Build in weather contingency; protect works' },
    { risk: 'Material delays', likelihood: 'medium', impact: 'medium', mitigation: 'Order early; identify alternatives' },
    { risk: 'Labor shortages', likelihood: 'low', impact: 'high', mitigation: 'Secure reliable contractors; have backup options' },
    { risk: 'Design changes', likelihood: 'medium', impact: 'medium', mitigation: 'Freeze design early; manage change control' },
    { risk: 'Neighbor disputes', likelihood: 'low', impact: 'medium', mitigation: 'Proactive communication; compliance with CMP' },
    { risk: 'Building control issues', likelihood: 'low', impact: 'high', mitigation: 'Early consultation; qualified professionals' }
  ];
  
  if (hasBasement) {
    commonRisks.push(
      { risk: 'Ground conditions', likelihood: 'medium', impact: 'high', mitigation: 'Comprehensive site investigation; flexible methodology' },
      { risk: 'Water ingress', likelihood: 'medium', impact: 'high', mitigation: 'Robust dewatering; waterproofing specification' },
      { risk: 'Movement in adjacent structures', likelihood: 'low', impact: 'high', mitigation: 'Monitoring; trigger levels; contingency measures' }
    );
  }
  
  return {
    commonRisks,
    mitigationStrategies: [
      'Comprehensive project planning',
      'Regular progress monitoring',
      'Clear communication channels',
      'Contingency budgets and timescales',
      'Experienced professional team'
    ],
    contingencyPlanning: [
      'Budget contingency: minimum 10-15%',
      'Time contingency: minimum 15-20%',
      'Alternative supplier arrangements',
      'Escalation procedures for disputes',
      'Insurance coverage review'
    ]
  };
}

/**
 * Get construction checklist for specific phase
 */
export async function getPhaseChecklist(
  phase: string
): Promise<{
  checklist: string[];
  inspections: string[];
  documentation: string[];
}> {
  const checklists: { [key: string]: { checklist: string[]; inspections: string[]; documentation: string[] } } = {
    'foundations': {
      checklist: [
        'Ground bearing capacity confirmed',
        'Excavation to correct depth',
        'Formation level correct',
        'Reinforcement placed correctly',
        'Concrete mix approved',
        'Pour witnessed'
      ],
      inspections: ['Building Control foundation inspection'],
      documentation: ['Concrete cube test results', 'Foundation inspection record']
    },
    'structure': {
      checklist: [
        'DPC correctly installed',
        'Wall ties at correct centres',
        'Cavity widths maintained',
        'Openings correctly sized',
        'Lintels correct specification'
      ],
      inspections: ['Building Control at DPC', 'Structural engineer if required'],
      documentation: ['DPC continuity record', 'Wall tie installation record']
    }
  };
  
  const normalizedPhase = phase.toLowerCase();
  const data = checklists[normalizedPhase];
  return data || {
    checklist: ['Phase-specific checks required'],
    inspections: ['Building Control as required'],
    documentation: ['Progress photographs', 'Inspection records']
  };
}

export default {
  getConstructionManagement,
  getPhaseChecklist
};
