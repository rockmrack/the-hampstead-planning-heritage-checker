/**
 * Post-Occupancy Evaluation Service
 * 
 * Comprehensive guidance for post-completion evaluation,
 * defects management, and performance monitoring
 */

// Types
interface PostOccupancyEvaluation {
  address: string;
  postcode: string;
  projectType: string;
  defectsPeriod: DefectsPeriodInfo;
  snaggingGuide: SnaggingGuide;
  performanceMonitoring: PerformanceMonitoring;
  maintenanceSchedule: MaintenanceSchedule;
  warrantyManagement: WarrantyManagement;
  lessonsLearned: LessonsLearnedFramework;
  contactDirectory: ContactDirectory;
}

interface DefectsPeriodInfo {
  duration: string;
  startDate: string;
  endDate: string;
  coverage: string[];
  exclusions: string[];
  process: DefectsProcess;
  tips: string[];
}

interface DefectsProcess {
  notification: NotificationProcess;
  inspection: string;
  remedy: string;
  disputes: string;
}

interface NotificationProcess {
  method: string;
  deadline: string;
  content: string[];
  evidence: string[];
}

interface SnaggingGuide {
  timing: string;
  inspectionChecklist: InspectionArea[];
  commonDefects: CommonDefect[];
  reportTemplate: string[];
  professionalOption: ProfessionalSnagging;
}

interface InspectionArea {
  area: string;
  items: string[];
  tools: string[];
}

interface CommonDefect {
  defect: string;
  location: string;
  severity: 'cosmetic' | 'minor' | 'major';
  responsibility: string;
  remedy: string;
}

interface ProfessionalSnagging {
  recommended: boolean;
  cost: string;
  benefits: string[];
  providers: string[];
}

interface PerformanceMonitoring {
  energyPerformance: EnergyMonitoring;
  thermalComfort: ComfortMonitoring;
  ventilation: VentilationMonitoring;
  moisture: MoistureMonitoring;
  acoustics: AcousticsMonitoring;
}

interface EnergyMonitoring {
  metrics: string[];
  targets: string[];
  monitoring: string[];
  improvements: string[];
}

interface ComfortMonitoring {
  summer: string[];
  winter: string[];
  indicators: string[];
  solutions: string[];
}

interface VentilationMonitoring {
  checkPoints: string[];
  maintenance: string[];
  issues: string[];
}

interface MoistureMonitoring {
  riskAreas: string[];
  indicators: string[];
  prevention: string[];
  response: string[];
}

interface AcousticsMonitoring {
  internalNoise: string[];
  externalNoise: string[];
  solutions: string[];
}

interface MaintenanceSchedule {
  weekly: MaintenanceTask[];
  monthly: MaintenanceTask[];
  quarterly: MaintenanceTask[];
  annual: MaintenanceTask[];
  fiveYearly: MaintenanceTask[];
}

interface MaintenanceTask {
  task: string;
  area: string;
  instructions: string;
  professionalRequired: boolean;
}

interface WarrantyManagement {
  warranties: WarrantyRecord[];
  claimProcess: ClaimProcess;
  documentation: string[];
  renewal: WarrantyRenewal[];
}

interface WarrantyRecord {
  item: string;
  provider: string;
  startDate: string;
  endDate: string;
  coverage: string;
  contactDetails: string;
  claimProcess: string;
}

interface ClaimProcess {
  steps: string[];
  evidence: string[];
  timeframes: string;
  escalation: string;
}

interface WarrantyRenewal {
  warranty: string;
  renewalRequired: boolean;
  timing: string;
  cost: string;
}

interface LessonsLearnedFramework {
  categories: LessonCategory[];
  feedbackProcess: string[];
  documentation: string[];
}

interface LessonCategory {
  category: string;
  questions: string[];
  improvements: string[];
}

interface ContactDirectory {
  emergency: EmergencyContact[];
  routine: RoutineContact[];
  warranty: WarrantyContact[];
}

interface EmergencyContact {
  situation: string;
  contact: string;
  availability: string;
}

interface RoutineContact {
  trade: string;
  purpose: string;
  frequency: string;
}

interface WarrantyContact {
  warranty: string;
  provider: string;
  phone: string;
  response: string;
}

/**
 * Get comprehensive post-occupancy evaluation guide
 */
export async function getPostOccupancyEvaluation(
  address: string,
  postcode: string,
  projectType: string,
  projectDetails?: {
    completionDate?: string;
    contractorDetails?: string;
    warrantyProvider?: string;
    hasUnderfloorHeating?: boolean;
    hasMVHR?: boolean;
    hasHeatPump?: boolean;
    isBasement?: boolean;
  }
): Promise<PostOccupancyEvaluation> {
  const normalizedType = projectType.toLowerCase().replace(/\s+/g, '-');
  const safeCompletionDate = projectDetails?.completionDate || new Date().toISOString().split('T')[0] || '';
  
  const defectsPeriod = generateDefectsPeriodInfo(safeCompletionDate);
  const snaggingGuide = generateSnaggingGuide(normalizedType, projectDetails);
  const performanceMonitoring = generatePerformanceMonitoring(projectDetails);
  const maintenanceSchedule = generateMaintenanceSchedule(normalizedType, projectDetails);
  const warrantyManagement = generateWarrantyManagement(projectDetails);
  const lessonsLearned = generateLessonsLearnedFramework();
  const contactDirectory = generateContactDirectory();
  
  return {
    address,
    postcode,
    projectType,
    defectsPeriod,
    snaggingGuide,
    performanceMonitoring,
    maintenanceSchedule,
    warrantyManagement,
    lessonsLearned,
    contactDirectory
  };
}

/**
 * Generate defects period information
 */
function generateDefectsPeriodInfo(completionDate: string): DefectsPeriodInfo {
  const start = new Date(completionDate);
  const end = new Date(start);
  end.setFullYear(end.getFullYear() + 1);
  
  return {
    duration: '12 months from practical completion',
    startDate: start.toLocaleDateString('en-GB'),
    endDate: end.toLocaleDateString('en-GB'),
    coverage: [
      'Defective workmanship',
      'Defective materials',
      'Non-compliance with specification',
      'Items not working as intended',
      'Shrinkage cracks (beyond normal)',
      'Failed sealants and joints'
    ],
    exclusions: [
      'Normal wear and tear',
      'Damage caused by owner',
      'Alterations made after completion',
      'Items previously signed off and accepted',
      'Maintenance items (e.g., redecorating)',
      'Minor shrinkage cracks (cosmetic)'
    ],
    process: {
      notification: {
        method: 'Written notification to contractor (email with delivery receipt)',
        deadline: 'Within defects period, ideally within 2 weeks of discovery',
        content: [
          'Description of defect',
          'Location in property',
          'Date discovered',
          'Photographs',
          'Impact on use/enjoyment'
        ],
        evidence: [
          'Dated photographs',
          'Video if appropriate',
          'Written description',
          'Comparison with specification/drawings'
        ]
      },
      inspection: 'Contractor should inspect within 7 days of notification',
      remedy: 'Contractor should remedy within reasonable time (typically 28 days)',
      disputes: 'If unresolved, refer to contract dispute mechanism or seek professional advice'
    },
    tips: [
      'Keep detailed records from day one',
      'Photograph defects as soon as discovered',
      'Report promptly - don\'t wait',
      'Follow up in writing if no response',
      'Conduct thorough inspection at 10 months',
      'Prepare comprehensive end-of-defects list'
    ]
  };
}

/**
 * Generate snagging guide
 */
function generateSnaggingGuide(
  projectType: string,
  projectDetails?: {
    completionDate?: string;
    contractorDetails?: string;
    warrantyProvider?: string;
    hasUnderfloorHeating?: boolean;
    hasMVHR?: boolean;
    hasHeatPump?: boolean;
    isBasement?: boolean;
  }
): SnaggingGuide {
  const inspectionChecklist: InspectionArea[] = [
    {
      area: 'External',
      items: [
        'Roof tiles/slates secure and aligned',
        'Flashings properly sealed',
        'Rainwater goods secure and flowing',
        'Render/brickwork - no cracks or defects',
        'Windows and doors - smooth operation',
        'External decoration complete',
        'Drainage gullies clear',
        'Landscaping as specified'
      ],
      tools: ['Binoculars', 'Ladder (for gutters)']
    },
    {
      area: 'Internal - General',
      items: [
        'All doors open and close properly',
        'Locks and handles function correctly',
        'Windows open, close, and lock properly',
        'Hinges and stays secure',
        'Skirting and architraves - gaps, damage',
        'Walls - scratches, dents, poor finish',
        'Ceilings - cracks, poor finish',
        'Floor finishes - scratches, gaps'
      ],
      tools: ['Torch', 'Spirit level', 'Tape measure']
    },
    {
      area: 'Kitchen',
      items: [
        'All appliances functioning',
        'Drawers and doors aligned',
        'Soft-close mechanisms working',
        'Worktops secure, no damage',
        'Silicone seals complete',
        'Taps function, no leaks',
        'Drainage working properly'
      ],
      tools: ['None specific']
    },
    {
      area: 'Bathrooms',
      items: [
        'Sanitaryware secure',
        'Taps function, no leaks',
        'Shower/bath drains properly',
        'Silicone seals complete and neat',
        'Tiles - no cracks, grouting complete',
        'Extractor fan working',
        'Hot water reaching all outlets'
      ],
      tools: ['None specific']
    },
    {
      area: 'Electrical',
      items: [
        'All sockets working',
        'All lights working',
        'Light switches function',
        'Socket covers fitted and straight',
        'No exposed wiring',
        'Consumer unit labelled'
      ],
      tools: ['Plug-in socket tester']
    },
    {
      area: 'Heating/Plumbing',
      items: [
        'All radiators heating evenly',
        'Thermostatic valves functioning',
        'Boiler/heat pump operational',
        'Controls working correctly',
        'No leaks visible',
        'Water pressure adequate'
      ],
      tools: ['None specific']
    }
  ];
  
  // Add basement-specific if applicable
  if (projectDetails?.isBasement) {
    inspectionChecklist.push({
      area: 'Basement',
      items: [
        'No signs of water ingress',
        'Sump pump functioning (if installed)',
        'Drainage systems clear',
        'Dehumidifier working (if installed)',
        'No dampness or condensation',
        'Ventilation adequate'
      ],
      tools: ['Moisture meter', 'Humidity meter']
    });
  }
  
  const commonDefects: CommonDefect[] = [
    { defect: 'Shrinkage cracks around openings', location: 'Internal walls', severity: 'cosmetic', responsibility: 'Contractor', remedy: 'Fill and redecorate' },
    { defect: 'Stiff door/window operation', location: 'Throughout', severity: 'minor', responsibility: 'Contractor', remedy: 'Adjust hinges/mechanisms' },
    { defect: 'Incomplete silicone sealing', location: 'Bathrooms/Kitchen', severity: 'minor', responsibility: 'Contractor', remedy: 'Complete sealing' },
    { defect: 'Paint defects/touch-ups needed', location: 'Throughout', severity: 'cosmetic', responsibility: 'Contractor', remedy: 'Touch up/repaint' },
    { defect: 'Floor squeaks', location: 'Timber floors', severity: 'minor', responsibility: 'Contractor', remedy: 'Screw down/refix' },
    { defect: 'Poor grouting', location: 'Tiled areas', severity: 'cosmetic', responsibility: 'Contractor', remedy: 'Re-grout' },
    { defect: 'Radiator not heating evenly', location: 'Heating system', severity: 'minor', responsibility: 'Contractor', remedy: 'Bleed/balance system' }
  ];
  
  return {
    timing: 'Conduct initial snag within first 2 weeks, follow up at 3, 6, and 10 months',
    inspectionChecklist,
    commonDefects,
    reportTemplate: [
      'Date of inspection',
      'Room/location',
      'Defect description',
      'Photograph reference',
      'Severity (cosmetic/minor/major)',
      'Action required',
      'Date reported to contractor',
      'Date remedied',
      'Sign-off'
    ],
    professionalOption: {
      recommended: true,
      cost: '£300-£500 for typical property',
      benefits: [
        'Thorough systematic inspection',
        'Professional report for contractor',
        'Identifies issues you might miss',
        'Useful leverage for getting defects fixed',
        'Peace of mind'
      ],
      providers: ['Snagging.org', 'New Home Quality Control', 'Home Snagging UK']
    }
  };
}

/**
 * Generate performance monitoring guidance
 */
function generatePerformanceMonitoring(
  projectDetails?: {
    completionDate?: string;
    contractorDetails?: string;
    warrantyProvider?: string;
    hasUnderfloorHeating?: boolean;
    hasMVHR?: boolean;
    hasHeatPump?: boolean;
    isBasement?: boolean;
  }
): PerformanceMonitoring {
  return {
    energyPerformance: {
      metrics: [
        'Monthly energy consumption (gas/electric)',
        'Compare with EPC predicted consumption',
        'Heating degree day adjusted consumption',
        'Cost per month/year'
      ],
      targets: [
        'Within 20% of EPC prediction',
        'Year-on-year improvement',
        'Compare with similar properties'
      ],
      monitoring: [
        'Smart meter readings',
        'Monthly bills tracking',
        'Energy monitoring app/system'
      ],
      improvements: [
        'Optimize heating schedules',
        'Check insulation performance',
        'Draught-proof where needed',
        'Upgrade to LED lighting',
        'Smart controls optimization'
      ]
    },
    thermalComfort: {
      summer: [
        'Monitor peak indoor temperatures',
        'Use blinds/shutters effectively',
        'Night-time ventilation',
        'Check any overheating in specific rooms'
      ],
      winter: [
        'Even heating throughout property',
        'No cold spots or draughts',
        'Adequate hot water',
        'Responsive heating controls'
      ],
      indicators: [
        'Indoor temperature consistency',
        'Cold bridging at junctions',
        'Condensation occurrence',
        'Comfort satisfaction'
      ],
      solutions: [
        'Adjust heating balance',
        'Add secondary glazing if needed',
        'Improve ventilation strategy',
        'Review insulation performance'
      ]
    },
    ventilation: {
      checkPoints: [
        'Trickle vents open and clear',
        'Extractor fans operating',
        'MVHR filters clean (if applicable)',
        'No stale air or odours',
        'Windows can open for purge ventilation'
      ],
      maintenance: projectDetails?.hasMVHR ? [
        'Change MVHR filters every 3-6 months',
        'Annual MVHR service',
        'Clean grilles and ducts periodically'
      ] : [
        'Clean extractor fan grilles',
        'Check trickle vents clear',
        'Service extract fans annually'
      ],
      issues: [
        'Condensation on windows',
        'Mould growth',
        'Stuffy rooms',
        'Lingering cooking odours'
      ]
    },
    moisture: {
      riskAreas: [
        'Bathrooms and kitchens',
        'Behind furniture on external walls',
        'Window reveals',
        'Basement areas',
        'Cold bridges'
      ],
      indicators: [
        'Condensation on windows',
        'Musty smells',
        'Mould growth',
        'Peeling paint/wallpaper',
        'Damp patches'
      ],
      prevention: [
        'Adequate ventilation',
        'Background heating',
        'Avoid drying clothes indoors without ventilation',
        'Use extract fans when cooking/bathing',
        'Maintain dehumidifier in basement'
      ],
      response: [
        'Identify source (condensation vs penetrating)',
        'Increase ventilation',
        'Address any building defects',
        'Clean mould with appropriate products',
        'Monitor and record'
      ]
    },
    acoustics: {
      internalNoise: [
        'Footfall noise from floors above',
        'Plumbing noise',
        'Mechanical ventilation noise',
        'Sound transfer between rooms'
      ],
      externalNoise: [
        'Traffic noise intrusion',
        'Neighbor noise',
        'Aircraft noise'
      ],
      solutions: [
        'Rugs/carpet on hard floors',
        'Acoustic treatments if needed',
        'Check window seals',
        'Report issues under warranty'
      ]
    }
  };
}

/**
 * Generate maintenance schedule
 */
function generateMaintenanceSchedule(
  projectType: string,
  projectDetails?: {
    completionDate?: string;
    contractorDetails?: string;
    warrantyProvider?: string;
    hasUnderfloorHeating?: boolean;
    hasMVHR?: boolean;
    hasHeatPump?: boolean;
    isBasement?: boolean;
  }
): MaintenanceSchedule {
  const schedule: MaintenanceSchedule = {
    weekly: [
      { task: 'Run all taps briefly', area: 'Plumbing', instructions: 'Prevents stagnation in little-used outlets', professionalRequired: false },
      { task: 'Check for any new defects', area: 'General', instructions: 'Quick visual inspection of recent work', professionalRequired: false }
    ],
    monthly: [
      { task: 'Test smoke/CO alarms', area: 'Safety', instructions: 'Press test button, replace batteries if needed', professionalRequired: false },
      { task: 'Clean extractor fan grilles', area: 'Ventilation', instructions: 'Wipe down bathroom/kitchen fan covers', professionalRequired: false },
      { task: 'Check for condensation/mould', area: 'General', instructions: 'Inspect window reveals, behind furniture', professionalRequired: false },
      { task: 'Run any seldom-used appliances', area: 'Appliances', instructions: 'Prevents seals drying out', professionalRequired: false }
    ],
    quarterly: [
      { task: 'Clean gutters if accessible', area: 'External', instructions: 'Remove debris, check for leaks', professionalRequired: false },
      { task: 'Check external drainage', area: 'External', instructions: 'Ensure gullies clear, water flowing', professionalRequired: false },
      { task: 'Bleed radiators if needed', area: 'Heating', instructions: 'Release trapped air', professionalRequired: false },
      { task: 'Check sealants', area: 'Wet areas', instructions: 'Look for gaps or mould in silicone', professionalRequired: false }
    ],
    annual: [
      { task: 'Boiler service', area: 'Heating', instructions: 'Required for warranty, gas safety', professionalRequired: true },
      { task: 'Gutter and roof check', area: 'External', instructions: 'Professional inspection recommended', professionalRequired: true },
      { task: 'Retouch external decoration', area: 'External', instructions: 'Touch up any weathered paintwork', professionalRequired: false },
      { task: 'Check loft/insulation', area: 'Roof', instructions: 'Ensure insulation in place, no pests', professionalRequired: false },
      { task: 'Service extract fans', area: 'Ventilation', instructions: 'Clean thoroughly, check function', professionalRequired: false }
    ],
    fiveYearly: [
      { task: 'External redecoration', area: 'External', instructions: 'Full repaint of external joinery', professionalRequired: true },
      { task: 'Flat roof inspection', area: 'Roof', instructions: 'If applicable - professional survey', professionalRequired: true },
      { task: 'Drainage CCTV survey', area: 'Drainage', instructions: 'If issues suspected', professionalRequired: true },
      { task: 'Electrical inspection (EICR)', area: 'Electrical', instructions: 'Periodic inspection and testing', professionalRequired: true }
    ]
  };
  
  // Add MVHR-specific maintenance
  if (projectDetails?.hasMVHR) {
    schedule.quarterly.push({
      task: 'Change MVHR filters',
      area: 'Ventilation',
      instructions: 'Replace supply and extract filters',
      professionalRequired: false
    });
    schedule.annual.push({
      task: 'MVHR system service',
      area: 'Ventilation',
      instructions: 'Professional service and inspection',
      professionalRequired: true
    });
  }
  
  // Add heat pump maintenance
  if (projectDetails?.hasHeatPump) {
    schedule.annual.push({
      task: 'Heat pump service',
      area: 'Heating',
      instructions: 'Annual service by qualified engineer',
      professionalRequired: true
    });
  }
  
  // Add basement maintenance
  if (projectDetails?.isBasement) {
    schedule.monthly.push({
      task: 'Check sump pump',
      area: 'Basement',
      instructions: 'Test operation, check drainage',
      professionalRequired: false
    });
    schedule.quarterly.push({
      task: 'Inspect basement for moisture',
      area: 'Basement',
      instructions: 'Check walls, floors for any signs of water',
      professionalRequired: false
    });
  }
  
  return schedule;
}

/**
 * Generate warranty management guidance
 */
function generateWarrantyManagement(
  projectDetails?: {
    completionDate?: string;
    contractorDetails?: string;
    warrantyProvider?: string;
    hasUnderfloorHeating?: boolean;
    hasMVHR?: boolean;
    hasHeatPump?: boolean;
    isBasement?: boolean;
  }
): WarrantyManagement {
  const safeCompletionDate = projectDetails?.completionDate || new Date().toISOString().split('T')[0] || '';
  const startDate = new Date(safeCompletionDate);
  
  const warranties: WarrantyRecord[] = [
    {
      item: 'Structural Warranty',
      provider: projectDetails?.warrantyProvider || 'NHBC/Premier/LABC',
      startDate: startDate.toLocaleDateString('en-GB'),
      endDate: new Date(startDate.setFullYear(startDate.getFullYear() + 10)).toLocaleDateString('en-GB'),
      coverage: 'Major structural defects',
      contactDetails: 'See policy document',
      claimProcess: 'Contact warranty provider, submit claim form with evidence'
    },
    {
      item: 'Boiler/Heat Pump',
      provider: 'Manufacturer',
      startDate: new Date(safeCompletionDate).toLocaleDateString('en-GB'),
      endDate: 'Varies (5-10 years)',
      coverage: 'Manufacturing defects, parts',
      contactDetails: 'See warranty card',
      claimProcess: 'Contact manufacturer, arrange engineer visit'
    },
    {
      item: 'Windows and Doors',
      provider: 'Manufacturer/Installer',
      startDate: new Date(safeCompletionDate).toLocaleDateString('en-GB'),
      endDate: '10 years (frames), 5 years (glass seals)',
      coverage: 'Defects in manufacture and installation',
      contactDetails: 'Installer details',
      claimProcess: 'Contact installer in first instance'
    }
  ];
  
  return {
    warranties,
    claimProcess: {
      steps: [
        'Document the defect (photos, description, date discovered)',
        'Check warranty coverage and validity',
        'Contact warranty provider/contractor',
        'Submit formal claim with evidence',
        'Allow inspection if required',
        'Agree remedial works',
        'Sign off completed remedy'
      ],
      evidence: [
        'Dated photographs of defect',
        'Timeline of when issue appeared',
        'Any relevant maintenance records',
        'Previous correspondence',
        'Original warranty documents'
      ],
      timeframes: 'Most warranties require notification within 30 days of discovery',
      escalation: 'If unresolved: formal complaint, ombudsman, legal advice'
    },
    documentation: [
      'Store all warranty documents safely',
      'Keep digital copies (scanned/photographed)',
      'Record registration dates and reference numbers',
      'Note expiry dates in calendar',
      'Keep service records (for boiler etc.)'
    ],
    renewal: [
      { warranty: 'Boiler cover', renewalRequired: true, timing: 'Before warranty expires', cost: '£200-400/year' },
      { warranty: 'Home insurance', renewalRequired: true, timing: 'Annual', cost: 'Varies' }
    ]
  };
}

/**
 * Generate lessons learned framework
 */
function generateLessonsLearnedFramework(): LessonsLearnedFramework {
  return {
    categories: [
      {
        category: 'Planning and Design',
        questions: [
          'Were the planning requirements clear?',
          'Did the design meet your expectations?',
          'Were there design changes during construction?',
          'What would you design differently?'
        ],
        improvements: [
          'More detailed brief at start',
          'Earlier design freeze',
          '3D visualizations for approval',
          'More site analysis upfront'
        ]
      },
      {
        category: 'Contractor and Team',
        questions: [
          'Was communication effective?',
          'Were timescales met?',
          'Was quality acceptable?',
          'Would you use them again?'
        ],
        improvements: [
          'Clearer contract terms',
          'More regular site meetings',
          'Better documentation',
          'Stricter quality control'
        ]
      },
      {
        category: 'Budget and Cost',
        questions: [
          'Was the final cost close to budget?',
          'What caused any overspend?',
          'Were there unexpected costs?',
          'Was contingency adequate?'
        ],
        improvements: [
          'More detailed cost plan',
          'Larger contingency',
          'Tighter change control',
          'Fixed price elements'
        ]
      },
      {
        category: 'Programme and Timing',
        questions: [
          'Was completion on time?',
          'What caused delays?',
          'Were delays managed well?',
          'Impact on your life/work?'
        ],
        improvements: [
          'More realistic programme',
          'Better weather contingency',
          'Faster decision making',
          'Better coordination'
        ]
      }
    ],
    feedbackProcess: [
      'Complete review at practical completion',
      'Follow up at 6 and 12 months',
      'Share feedback with team',
      'Document for future projects'
    ],
    documentation: [
      'Project completion report',
      'Lessons learned register',
      'Contractor performance notes',
      'Final cost reconciliation'
    ]
  };
}

/**
 * Generate contact directory
 */
function generateContactDirectory(): ContactDirectory {
  return {
    emergency: [
      { situation: 'Gas leak/smell', contact: 'National Gas Emergency: 0800 111 999', availability: '24/7' },
      { situation: 'Electricity emergency', contact: 'UKPN: 105', availability: '24/7' },
      { situation: 'Water leak/burst pipe', contact: 'Thames Water: 0800 316 9800', availability: '24/7' },
      { situation: 'Structural concern', contact: 'Structural engineer (your project)', availability: 'Business hours initially' }
    ],
    routine: [
      { trade: 'Electrician', purpose: 'Electrical issues and additions', frequency: 'As needed' },
      { trade: 'Plumber', purpose: 'Plumbing issues and maintenance', frequency: 'As needed' },
      { trade: 'Heating engineer', purpose: 'Boiler service and repairs', frequency: 'Annual + as needed' },
      { trade: 'Decorator', purpose: 'Internal and external decoration', frequency: '5-10 years' },
      { trade: 'Roofer', purpose: 'Roof repairs and maintenance', frequency: 'As needed' }
    ],
    warranty: [
      { warranty: 'Structural warranty', provider: 'See policy', phone: 'See documents', response: '5-10 working days' },
      { warranty: 'Boiler', provider: 'Manufacturer', phone: 'See warranty card', response: '24-72 hours' },
      { warranty: 'Windows', provider: 'Installer', phone: 'See guarantee', response: '5-10 working days' }
    ]
  };
}

/**
 * Generate defects notification letter template
 */
export async function getDefectsNotificationTemplate(): Promise<{
  template: string;
  guidance: string[];
}> {
  return {
    template: `[Your Name]
[Your Address]
[Date]

[Contractor Name]
[Contractor Address]

Dear [Contractor Name],

RE: Notification of Defects - [Property Address]
Contract Reference: [If applicable]

I am writing to formally notify you of defects discovered at the above property, 
which was completed on [Completion Date].

The following defects have been identified and require your attention:

1. [Location]: [Description of defect]
   - Date discovered: [Date]
   - Photographs attached: Yes/No

2. [Location]: [Description of defect]
   - Date discovered: [Date]
   - Photographs attached: Yes/No

[Continue as needed]

In accordance with the contract terms and the defects liability period, I request 
that you arrange inspection and remedy of these items within 14 days of this letter.

Please contact me to arrange a convenient time for inspection.

I look forward to your prompt response.

Yours sincerely,

[Your Name]
[Contact details]

Enclosures: Photographs of defects`,
    guidance: [
      'Send by email with read receipt and post',
      'Keep copies of all correspondence',
      'Include clear photographs',
      'Be specific about locations and issues',
      'Reference contract terms if applicable',
      'Set clear deadline for response',
      'Follow up if no response within 7 days'
    ]
  };
}

export default {
  getPostOccupancyEvaluation,
  getDefectsNotificationTemplate
};
