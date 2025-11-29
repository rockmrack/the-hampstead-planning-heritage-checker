/**
 * Completion Certificate Service
 * 
 * Comprehensive guidance for obtaining completion certificates
 * and sign-offs for planning and building control
 */

// Types
interface CompletionAssessment {
  address: string;
  postcode: string;
  projectType: string;
  buildingControlCompletion: BCCompletionRequirements;
  planningCompliance: PlanningComplianceCheck;
  certificatesRequired: CertificateRequirement[];
  warrantiesRequired: WarrantyRequirement[];
  documentationRequired: DocumentRequirement[];
  commonIssues: CompletionIssue[];
  timeline: CompletionTimeline;
  costs: CompletionCosts;
}

interface BCCompletionRequirements {
  certificateType: 'completion-certificate' | 'regularisation';
  eligibility: boolean;
  outstandingInspections: string[];
  testCertificatesNeeded: string[];
  asBuiltRequired: boolean;
  process: ProcessStep[];
  timeline: string;
}

interface ProcessStep {
  step: number;
  action: string;
  description: string;
  responsible: string;
}

interface PlanningComplianceCheck {
  conditionsFullyDischarged: boolean;
  outstandingConditions: ConditionStatus[];
  complianceChecks: ComplianceItem[];
  enforcement: EnforcementRisk;
}

interface ConditionStatus {
  conditionNumber: string;
  description: string;
  status: 'discharged' | 'pending' | 'outstanding';
  action: string;
}

interface ComplianceItem {
  item: string;
  asApproved: boolean;
  variance: string | null;
  action: string;
}

interface EnforcementRisk {
  level: 'none' | 'low' | 'medium' | 'high';
  issues: string[];
  resolution: string[];
}

interface CertificateRequirement {
  certificate: string;
  description: string;
  whoIssues: string;
  whenRequired: string;
  cost: number;
  mandatory: boolean;
}

interface WarrantyRequirement {
  warranty: string;
  coverage: string;
  duration: string;
  provider: string;
  cost: string;
  transferable: boolean;
}

interface DocumentRequirement {
  document: string;
  purpose: string;
  source: string;
  format: string;
  retention: string;
}

interface CompletionIssue {
  issue: string;
  likelihood: 'common' | 'occasional' | 'rare';
  impact: 'minor' | 'moderate' | 'significant';
  resolution: string;
  preventionTip: string;
}

interface CompletionTimeline {
  finalInspection: string;
  certificateIssue: string;
  planningDischarge: string;
  totalTimeline: string;
  criticalPath: string[];
}

interface CompletionCosts {
  buildingControl: number;
  conditionDischarges: number;
  certificates: number;
  warranties: number;
  total: number;
  breakdown: CostItem[];
}

interface CostItem {
  item: string;
  cost: number;
  notes: string;
}

// Certificate types by project
const CERTIFICATE_REQUIREMENTS: { [key: string]: string[] } = {
  'extension': ['Electrical', 'Gas', 'EPC'],
  'basement': ['Electrical', 'Gas', 'EPC', 'Structural', 'Waterproofing'],
  'loft': ['Electrical', 'EPC'],
  'new-build': ['Electrical', 'Gas', 'EPC', 'SAP', 'Air-tightness', 'Sound'],
  'conversion': ['Electrical', 'Gas', 'EPC', 'Sound']
};

/**
 * Get comprehensive completion assessment
 */
export async function getCompletionAssessment(
  address: string,
  postcode: string,
  projectType: string,
  projectDetails?: {
    buildingControlProvider?: string;
    planningRef?: string;
    conditions?: string[];
    hasGasWork?: boolean;
    hasElectricalWork?: boolean;
    isMultiUnit?: boolean;
    hasBasement?: boolean;
    warrantyProvider?: string;
  }
): Promise<CompletionAssessment> {
  const normalizedType = projectType.toLowerCase().replace(/\s+/g, '-');
  const hasGas = projectDetails?.hasGasWork !== false;
  const hasElectrical = projectDetails?.hasElectricalWork !== false;
  const isMultiUnit = projectDetails?.isMultiUnit || false;
  
  const buildingControlCompletion = generateBCCompletion(normalizedType, projectDetails);
  const planningCompliance = generatePlanningCompliance(projectDetails?.conditions || []);
  const certificatesRequired = generateCertificateRequirements(normalizedType, hasGas, hasElectrical, isMultiUnit);
  const warrantiesRequired = generateWarrantyRequirements(normalizedType, projectDetails?.hasBasement || false);
  const documentationRequired = generateDocumentationRequirements(normalizedType);
  const commonIssues = getCommonIssues(normalizedType);
  const timeline = calculateTimeline(buildingControlCompletion, planningCompliance);
  const costs = calculateCosts(certificatesRequired, warrantiesRequired, planningCompliance);
  
  return {
    address,
    postcode,
    projectType,
    buildingControlCompletion,
    planningCompliance,
    certificatesRequired,
    warrantiesRequired,
    documentationRequired,
    commonIssues,
    timeline,
    costs
  };
}

/**
 * Generate building control completion requirements
 */
function generateBCCompletion(
  projectType: string,
  projectDetails?: {
    buildingControlProvider?: string;
    planningRef?: string;
    conditions?: string[];
    hasGasWork?: boolean;
    hasElectricalWork?: boolean;
    isMultiUnit?: boolean;
    hasBasement?: boolean;
    warrantyProvider?: string;
  }
): BCCompletionRequirements {
  const testCerts: string[] = ['Electrical Installation Certificate'];
  
  if (projectDetails?.hasGasWork !== false) {
    testCerts.push('Gas Safe Certificate');
  }
  
  // Additional tests by project type
  if (projectType === 'new-build' || projectType === 'conversion') {
    testCerts.push('Air Tightness Test Certificate');
    testCerts.push('Commissioning Certificate (heating/ventilation)');
  }
  
  if (projectType === 'basement') {
    testCerts.push('Waterproofing Sign-off');
    testCerts.push('Structural Engineer Certificate');
  }
  
  return {
    certificateType: 'completion-certificate',
    eligibility: true,
    outstandingInspections: [
      'Final inspection of completed works',
      'Drainage test confirmation',
      'Final fire safety check (if applicable)'
    ],
    testCertificatesNeeded: testCerts,
    asBuiltRequired: projectType === 'new-build' || projectType === 'basement',
    process: [
      {
        step: 1,
        action: 'Gather all test certificates',
        description: 'Collect all required test certificates from approved contractors',
        responsible: 'Contractor/Client'
      },
      {
        step: 2,
        action: 'Book final inspection',
        description: 'Contact building control to arrange final inspection',
        responsible: 'Client/Contractor'
      },
      {
        step: 3,
        action: 'Prepare for inspection',
        description: 'Ensure all works complete, access available, documents ready',
        responsible: 'Client/Contractor'
      },
      {
        step: 4,
        action: 'Final inspection',
        description: 'Building control officer visits and inspects completed works',
        responsible: 'Building Control'
      },
      {
        step: 5,
        action: 'Certificate issue',
        description: 'Completion certificate issued if satisfactory',
        responsible: 'Building Control'
      }
    ],
    timeline: '2-4 weeks from final inspection request to certificate'
  };
}

/**
 * Generate planning compliance check
 */
function generatePlanningCompliance(conditions: string[]): PlanningComplianceCheck {
  // Simulate condition status (in production would check actual status)
  const outstandingConditions: ConditionStatus[] = [];
  
  // Standard pre-occupation conditions
  const standardConditions = [
    { num: '1', desc: 'External materials as approved' },
    { num: '2', desc: 'Landscaping implemented' },
    { num: '3', desc: 'Cycle storage provided' },
    { num: '4', desc: 'Refuse storage operational' },
    { num: '5', desc: 'Boundary treatment completed' }
  ];
  
  for (const cond of standardConditions) {
    outstandingConditions.push({
      conditionNumber: cond.num,
      description: cond.desc,
      status: 'pending',
      action: 'Verify completion and submit discharge application if needed'
    });
  }
  
  // Compliance checks
  const complianceChecks: ComplianceItem[] = [
    {
      item: 'Building as approved drawings',
      asApproved: true,
      variance: null,
      action: 'No action required'
    },
    {
      item: 'External materials',
      asApproved: true,
      variance: null,
      action: 'Photograph for records'
    },
    {
      item: 'Window positions',
      asApproved: true,
      variance: null,
      action: 'No action required'
    },
    {
      item: 'Boundary treatment',
      asApproved: true,
      variance: null,
      action: 'Complete as approved scheme'
    }
  ];
  
  return {
    conditionsFullyDischarged: false,
    outstandingConditions,
    complianceChecks,
    enforcement: {
      level: 'none',
      issues: [],
      resolution: []
    }
  };
}

/**
 * Generate certificate requirements
 */
function generateCertificateRequirements(
  projectType: string,
  hasGas: boolean,
  hasElectrical: boolean,
  isMultiUnit: boolean
): CertificateRequirement[] {
  const certificates: CertificateRequirement[] = [];
  
  // Electrical
  if (hasElectrical) {
    certificates.push({
      certificate: 'Electrical Installation Certificate (EIC)',
      description: 'Certification that electrical work complies with BS 7671',
      whoIssues: 'Part P registered electrician',
      whenRequired: 'On completion of electrical work',
      cost: 0, // Included in electrical work
      mandatory: true
    });
  }
  
  // Gas
  if (hasGas) {
    certificates.push({
      certificate: 'Gas Safe Certificate',
      description: 'Certification that gas installation is safe and compliant',
      whoIssues: 'Gas Safe registered engineer',
      whenRequired: 'On completion of gas work',
      cost: 0,
      mandatory: true
    });
  }
  
  // EPC
  certificates.push({
    certificate: 'Energy Performance Certificate (EPC)',
    description: 'Energy efficiency rating for the property',
    whoIssues: 'Accredited domestic energy assessor',
    whenRequired: 'Before occupation/sale/let',
    cost: 80,
    mandatory: true
  });
  
  // Building-specific
  if (projectType === 'new-build') {
    certificates.push({
      certificate: 'SAP Calculation Certificate',
      description: 'Standard Assessment Procedure energy calculation',
      whoIssues: 'SAP assessor',
      whenRequired: 'For building control sign-off',
      cost: 150,
      mandatory: true
    });
    
    certificates.push({
      certificate: 'Air Tightness Test Certificate',
      description: 'Verification of building envelope air permeability',
      whoIssues: 'ATTMA registered tester',
      whenRequired: 'Before completion certificate',
      cost: 300,
      mandatory: true
    });
  }
  
  // Sound testing
  if (isMultiUnit || projectType === 'conversion') {
    certificates.push({
      certificate: 'Sound Test Certificate',
      description: 'Pre-completion sound testing to Part E standards',
      whoIssues: 'UKAS accredited tester',
      whenRequired: 'Before completion certificate',
      cost: 400,
      mandatory: true
    });
  }
  
  // FENSA
  certificates.push({
    certificate: 'FENSA Certificate',
    description: 'Certification for replacement windows/doors',
    whoIssues: 'FENSA registered installer',
    whenRequired: 'On completion of window installation',
    cost: 0,
    mandatory: projectType !== 'new-build'
  });
  
  return certificates;
}

/**
 * Generate warranty requirements
 */
function generateWarrantyRequirements(
  projectType: string,
  hasBasement: boolean
): WarrantyRequirement[] {
  const warranties: WarrantyRequirement[] = [];
  
  // Structural warranty
  warranties.push({
    warranty: 'Structural Warranty / Latent Defects Insurance',
    coverage: 'Major structural defects',
    duration: '10 years',
    provider: 'NHBC, Premier Guarantee, LABC Warranty, Buildzone',
    cost: '£1,500-£3,000 depending on project value',
    transferable: true
  });
  
  // Basement warranty
  if (hasBasement) {
    warranties.push({
      warranty: 'Basement Waterproofing Warranty',
      coverage: 'Water ingress through basement waterproofing system',
      duration: '10 years',
      provider: 'Specialist waterproofing contractor',
      cost: '£800-£2,000',
      transferable: true
    });
  }
  
  // Roof warranty
  warranties.push({
    warranty: 'Roofing Warranty',
    coverage: 'Defects in roof covering installation',
    duration: '10-20 years',
    provider: 'Roofing contractor / manufacturer',
    cost: 'Usually included',
    transferable: true
  });
  
  // Window warranty
  warranties.push({
    warranty: 'Window and Door Warranty',
    coverage: 'Defects in manufacture and installation',
    duration: '10 years (glass seal: 5 years)',
    provider: 'Window manufacturer/installer',
    cost: 'Usually included',
    transferable: true
  });
  
  // Boiler warranty
  warranties.push({
    warranty: 'Boiler/Heat Pump Warranty',
    coverage: 'Manufacturing defects and breakdown',
    duration: '5-10 years',
    provider: 'Manufacturer (registration required)',
    cost: 'Usually included with product',
    transferable: true
  });
  
  return warranties;
}

/**
 * Generate documentation requirements
 */
function generateDocumentationRequirements(projectType: string): DocumentRequirement[] {
  return [
    {
      document: 'Building Control Completion Certificate',
      purpose: 'Proof of Building Regulations compliance',
      source: 'Building Control Body',
      format: 'Physical certificate + digital copy',
      retention: 'Permanent (property record)'
    },
    {
      document: 'Planning Decision Notice',
      purpose: 'Proof of planning permission',
      source: 'Local Planning Authority',
      format: 'Physical + digital',
      retention: 'Permanent'
    },
    {
      document: 'Condition Discharge Letters',
      purpose: 'Proof conditions satisfied',
      source: 'Local Planning Authority',
      format: 'Letters/emails',
      retention: 'Permanent'
    },
    {
      document: 'Approved Drawings',
      purpose: 'Record of approved scheme',
      source: 'Architect/Designer',
      format: 'PDF and CAD files',
      retention: 'Permanent'
    },
    {
      document: 'As-Built Drawings',
      purpose: 'Record of what was actually built',
      source: 'Architect/Contractor',
      format: 'PDF and CAD files',
      retention: 'Permanent'
    },
    {
      document: 'O&M Manuals',
      purpose: 'Operation and maintenance instructions',
      source: 'Contractor/Manufacturers',
      format: 'Physical binder + digital',
      retention: 'Lifetime of systems'
    },
    {
      document: 'Test Certificates',
      purpose: 'Proof of compliant installations',
      source: 'Certified installers',
      format: 'Certificates',
      retention: 'Permanent'
    },
    {
      document: 'Warranty Documents',
      purpose: 'Proof of warranty coverage',
      source: 'Warranty providers',
      format: 'Certificates/policies',
      retention: 'Duration of warranty'
    },
    {
      document: 'Party Wall Awards',
      purpose: 'Record of party wall agreements',
      source: 'Party Wall Surveyor',
      format: 'Award document',
      retention: 'Permanent'
    },
    {
      document: 'Structural Calculations',
      purpose: 'Engineering design record',
      source: 'Structural Engineer',
      format: 'PDF/paper',
      retention: 'Permanent'
    }
  ];
}

/**
 * Get common completion issues
 */
function getCommonIssues(projectType: string): CompletionIssue[] {
  const issues: CompletionIssue[] = [
    {
      issue: 'Missing electrical certificate',
      likelihood: 'common',
      impact: 'significant',
      resolution: 'Obtain from electrician or arrange inspection by Part P contractor',
      preventionTip: 'Only use Part P registered electricians'
    },
    {
      issue: 'Incomplete condition discharge',
      likelihood: 'common',
      impact: 'moderate',
      resolution: 'Submit discharge applications for remaining conditions',
      preventionTip: 'Track conditions throughout project'
    },
    {
      issue: 'Minor variations from approved plans',
      likelihood: 'common',
      impact: 'minor',
      resolution: 'Apply for non-material amendment or minor amendment',
      preventionTip: 'Check with planning before varying from approved drawings'
    },
    {
      issue: 'Landscaping not completed',
      likelihood: 'occasional',
      impact: 'moderate',
      resolution: 'Complete landscaping or agree later implementation date',
      preventionTip: 'Plan landscaping phase early'
    },
    {
      issue: 'Building control snagging items',
      likelihood: 'common',
      impact: 'minor',
      resolution: 'Address items and request re-inspection',
      preventionTip: 'Pre-inspection self-check against Building Regs'
    }
  ];
  
  if (projectType === 'basement') {
    issues.push({
      issue: 'Waterproofing warranty delay',
      likelihood: 'occasional',
      impact: 'moderate',
      resolution: 'Chase warranty provider, ensure all inspections completed',
      preventionTip: 'Book warranty inspections at each stage'
    });
  }
  
  return issues;
}

/**
 * Calculate completion timeline
 */
function calculateTimeline(
  bcCompletion: BCCompletionRequirements,
  planningCompliance: PlanningComplianceCheck
): CompletionTimeline {
  const pendingConditions = planningCompliance.outstandingConditions.filter(c => c.status === 'pending').length;
  
  return {
    finalInspection: '1-2 weeks to arrange',
    certificateIssue: '1-2 weeks after successful inspection',
    planningDischarge: `${pendingConditions * 4}-${pendingConditions * 8} weeks (${pendingConditions} conditions)`,
    totalTimeline: '4-12 weeks typical',
    criticalPath: [
      'Gather all test certificates',
      'Complete snagging works',
      'Book final BC inspection',
      'Pass inspection',
      'Submit outstanding condition discharges',
      'Receive completion certificate',
      'Register warranties'
    ]
  };
}

/**
 * Calculate completion costs
 */
function calculateCosts(
  certificates: CertificateRequirement[],
  warranties: WarrantyRequirement[],
  planningCompliance: PlanningComplianceCheck
): CompletionCosts {
  const breakdown: CostItem[] = [];
  
  // Certificate costs
  let certCost = 0;
  for (const cert of certificates) {
    if (cert.cost > 0) {
      certCost += cert.cost;
      breakdown.push({
        item: cert.certificate,
        cost: cert.cost,
        notes: cert.whoIssues
      });
    }
  }
  
  // Condition discharge costs
  const pendingConditions = planningCompliance.outstandingConditions.filter(c => c.status === 'pending').length;
  const conditionCost = pendingConditions * 116;
  breakdown.push({
    item: 'Condition discharge applications',
    cost: conditionCost,
    notes: `${pendingConditions} conditions @ £116 each`
  });
  
  // Warranty costs (estimate £2000 average)
  const warrantyCost = 2000;
  breakdown.push({
    item: 'Structural warranty',
    cost: warrantyCost,
    notes: 'Average cost'
  });
  
  return {
    buildingControl: 0, // Usually paid upfront
    conditionDischarges: conditionCost,
    certificates: certCost,
    warranties: warrantyCost,
    total: conditionCost + certCost + warrantyCost,
    breakdown
  };
}

/**
 * Check if development can be occupied
 */
export async function checkOccupancyReadiness(
  projectDetails: {
    bcCertificateIssued: boolean;
    epcObtained: boolean;
    gasSafeCertificate: boolean;
    electricalCertificate: boolean;
    preOccupationConditionsMet: boolean;
  }
): Promise<{
  canOccupy: boolean;
  outstanding: string[];
  risks: string[];
}> {
  const outstanding: string[] = [];
  const risks: string[] = [];
  
  if (!projectDetails.bcCertificateIssued) {
    outstanding.push('Building Control Completion Certificate');
    risks.push('Potential insurance issues');
    risks.push('May affect future sale/mortgage');
  }
  
  if (!projectDetails.electricalCertificate) {
    outstanding.push('Electrical Installation Certificate');
    risks.push('Safety risk');
    risks.push('Insurance may be void');
  }
  
  if (!projectDetails.gasSafeCertificate) {
    outstanding.push('Gas Safe Certificate');
    risks.push('Serious safety risk');
    risks.push('Illegal to let property');
  }
  
  if (!projectDetails.epcObtained) {
    outstanding.push('Energy Performance Certificate');
    risks.push('Cannot legally sell or let');
  }
  
  if (!projectDetails.preOccupationConditionsMet) {
    outstanding.push('Planning pre-occupation conditions');
    risks.push('Enforcement action possible');
  }
  
  return {
    canOccupy: outstanding.length === 0,
    outstanding,
    risks
  };
}

export default {
  getCompletionAssessment,
  checkOccupancyReadiness
};
