/**
 * Building Regulations Compliance Service
 * 
 * Provides comprehensive Building Regulations compliance
 * guidance for residential development projects.
 * 
 * Coverage: NW1-NW11, N2, N6, N10 postcodes
 */

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

interface BuildingRegsProject {
  projectType?: 'extension' | 'loft' | 'basement' | 'internal' | 'new_build' | 'change_of_use';
  floorArea?: number;
  listedBuilding?: boolean;
  conservationArea?: boolean;
  attachedProperty?: boolean;
  existingBuildingAge?: 'pre_1919' | '1919_1944' | '1945_1990' | 'post_1990';
  proposedUse?: string;
  electricalWork?: boolean;
  plumbingWork?: boolean;
  structuralWork?: boolean;
  heatingChanges?: boolean;
}

interface ApprovedDocument {
  partCode: string;
  title: string;
  keyRequirements: string[];
  applicability: string;
  latestEdition: string;
}

interface ComplianceItem {
  part: string;
  requirement: string;
  howToComply: string;
  evidence: string;
  applicable: boolean;
}

interface BuildingRegsAnalysis {
  summary: BuildingRegsSummary;
  approvalRoutes: ApprovalRoutes;
  partAStructure: PartAssessment;
  partBFire: PartAssessment;
  partCContamination: PartAssessment;
  partESound: PartAssessment;
  partFVentilation: PartAssessment;
  partGSanitation: PartAssessment;
  partHDrainage: PartAssessment;
  partJCombustion: PartAssessment;
  partKProtection: PartAssessment;
  partLConservation: PartAssessment;
  partMAccess: PartAssessment;
  partOOverheating: PartAssessment;
  partPElectrical: PartAssessment;
  partSInfrastructure: PartAssessment;
  exemptions: ExemptionAssessment;
  processGuidance: ProcessGuidance;
  conclusion: BuildingRegsConclusion;
  recommendations: string[];
}

interface BuildingRegsSummary {
  buildingRegsRequired: boolean;
  approvalRoute: string;
  keyParts: string[];
  estimatedFees: string;
  timeframe: string;
}

interface ApprovalRoutes {
  description: string;
  fullPlans: ApprovalRoute;
  buildingNotice: ApprovalRoute;
  competentPerson: ApprovalRoute;
  recommendedRoute: string;
}

interface ApprovalRoute {
  name: string;
  description: string;
  suitableFor: string[];
  advantages: string[];
  disadvantages: string[];
  fees: string;
}

interface PartAssessment {
  part: string;
  title: string;
  applicable: boolean;
  requirements: string[];
  complianceItems: ComplianceItem[];
  commonIssues: string[];
}

interface ExemptionAssessment {
  description: string;
  potentialExemptions: Exemption[];
}

interface Exemption {
  category: string;
  description: string;
  conditions: string[];
  applicable: boolean;
}

interface ProcessGuidance {
  description: string;
  steps: ProcessStep[];
  inspections: Inspection[];
}

interface ProcessStep {
  step: number;
  action: string;
  timing: string;
  responsibility: string;
}

interface Inspection {
  stage: string;
  notification: string;
  whatInspected: string;
}

interface BuildingRegsConclusion {
  overallAssessment: string;
  criticalItems: string[];
  conditions: string[];
}

// =============================================================================
// APPROVED DOCUMENTS DATABASE
// =============================================================================

const APPROVED_DOCUMENTS: ApprovedDocument[] = [
  { partCode: 'A', title: 'Structure', keyRequirements: ['Loading', 'Ground movement', 'Disproportionate collapse'], applicability: 'All structural work', latestEdition: '2004 with 2013 amendments' },
  { partCode: 'B', title: 'Fire safety', keyRequirements: ['Means of warning/escape', 'Fire spread', 'Access for fire service'], applicability: 'All buildings', latestEdition: '2019 (Vol 1 Dwellings)' },
  { partCode: 'C', title: 'Site preparation and resistance to contaminants and moisture', keyRequirements: ['Site preparation', 'Contamination', 'Damp-proofing'], applicability: 'All buildings', latestEdition: '2004 with 2013 amendments' },
  { partCode: 'E', title: 'Resistance to sound', keyRequirements: ['Airborne sound', 'Impact sound', 'Sound absorption'], applicability: 'Dwellings, conversions', latestEdition: '2015 with 2022 amendments' },
  { partCode: 'F', title: 'Ventilation', keyRequirements: ['Extract ventilation', 'Whole dwelling ventilation', 'Purge ventilation'], applicability: 'All buildings', latestEdition: '2021' },
  { partCode: 'G', title: 'Sanitation, hot water safety and water efficiency', keyRequirements: ['Cold water', 'Hot water safety', 'Sanitary conveniences'], applicability: 'All buildings', latestEdition: '2015 with 2016 amendments' },
  { partCode: 'H', title: 'Drainage and waste disposal', keyRequirements: ['Foul drainage', 'Rainwater drainage', 'Solid waste storage'], applicability: 'All buildings', latestEdition: '2015' },
  { partCode: 'J', title: 'Combustion appliances and fuel storage', keyRequirements: ['Air supply', 'Discharge of products', 'Protection from heat'], applicability: 'Where appliances installed', latestEdition: '2010 with 2013 amendments' },
  { partCode: 'K', title: 'Protection from falling, collision and impact', keyRequirements: ['Stairs', 'Ramps', 'Protection from falling', 'Glazing'], applicability: 'All buildings', latestEdition: '2013' },
  { partCode: 'L', title: 'Conservation of fuel and power', keyRequirements: ['U-values', 'Air permeability', 'Heating efficiency', 'TER'], applicability: 'All buildings', latestEdition: '2021' },
  { partCode: 'M', title: 'Access to and use of buildings', keyRequirements: ['Access', 'Sanitary provisions', 'Facilities'], applicability: 'All buildings (Vol 1 Dwellings)', latestEdition: '2015 with 2016 amendments' },
  { partCode: 'O', title: 'Overheating', keyRequirements: ['Overheating mitigation', 'Solar gains', 'Ventilation'], applicability: 'New residential', latestEdition: '2021' },
  { partCode: 'P', title: 'Electrical safety', keyRequirements: ['Design/installation', 'Inspection/testing'], applicability: 'Where electrical work', latestEdition: '2013' },
  { partCode: 'R', title: 'Physical infrastructure for high-speed electronic communications networks', keyRequirements: ['In-building infrastructure', 'Access point'], applicability: 'New buildings', latestEdition: '2016' },
  { partCode: 'S', title: 'Infrastructure for charging electric vehicles', keyRequirements: ['Charge points', 'Cable routes'], applicability: 'New buildings with parking', latestEdition: '2021' }
];

// =============================================================================
// MAIN SERVICE FUNCTION
// =============================================================================

async function assessBuildingRegs(
  address: string,
  postcode: string,
  projectType: string,
  projectDetails: BuildingRegsProject = {}
): Promise<BuildingRegsAnalysis> {
  const summary = generateSummary(projectDetails);
  const approvalRoutes = assessApprovalRoutes(projectDetails);
  const partA = assessPartA(projectDetails);
  const partB = assessPartB(projectDetails);
  const partC = assessPartC(projectDetails);
  const partE = assessPartE(projectDetails);
  const partF = assessPartF(projectDetails);
  const partG = assessPartG(projectDetails);
  const partH = assessPartH(projectDetails);
  const partJ = assessPartJ(projectDetails);
  const partK = assessPartK(projectDetails);
  const partL = assessPartL(projectDetails);
  const partM = assessPartM(projectDetails);
  const partO = assessPartO(projectDetails);
  const partP = assessPartP(projectDetails);
  const partS = assessPartS(projectDetails);
  const exemptions = assessExemptions(projectDetails);
  const processGuidance = getProcessGuidance(projectDetails);
  const conclusion = generateConclusion(summary, projectDetails);
  const recommendations = generateRecommendations(projectDetails);

  return {
    summary,
    approvalRoutes,
    partAStructure: partA,
    partBFire: partB,
    partCContamination: partC,
    partESound: partE,
    partFVentilation: partF,
    partGSanitation: partG,
    partHDrainage: partH,
    partJCombustion: partJ,
    partKProtection: partK,
    partLConservation: partL,
    partMAccess: partM,
    partOOverheating: partO,
    partPElectrical: partP,
    partSInfrastructure: partS,
    exemptions,
    processGuidance,
    conclusion,
    recommendations
  };
}

// =============================================================================
// SUMMARY
// =============================================================================

function generateSummary(projectDetails: BuildingRegsProject): BuildingRegsSummary {
  const projectType = projectDetails.projectType || 'extension';
  const keyParts: string[] = ['A', 'B', 'L'];
  
  if (projectDetails.attachedProperty) keyParts.push('E');
  if (projectDetails.electricalWork) keyParts.push('P');
  if (projectType === 'loft' || projectType === 'internal') keyParts.push('K');
  if (projectDetails.heatingChanges) keyParts.push('F', 'J');

  const floorArea = projectDetails.floorArea || 30;
  const estimatedFees = floorArea <= 10 ? '£200-400' :
                        floorArea <= 40 ? '£400-700' :
                        floorArea <= 80 ? '£700-1,200' : '£1,200+';

  return {
    buildingRegsRequired: true,
    approvalRoute: projectDetails.structuralWork ? 'Full Plans recommended' : 'Full Plans or Building Notice',
    keyParts: keyParts.map(p => `Part ${p}`),
    estimatedFees,
    timeframe: 'Full Plans: 5-8 weeks; Building Notice: As works progress'
  };
}

// =============================================================================
// APPROVAL ROUTES
// =============================================================================

function assessApprovalRoutes(projectDetails: BuildingRegsProject): ApprovalRoutes {
  const structuralWork = Boolean(projectDetails.structuralWork);

  return {
    description: 'Assessment of Building Control approval routes',
    fullPlans: {
      name: 'Full Plans Application',
      description: 'Submit detailed drawings for approval before starting work',
      suitableFor: ['Extensions', 'Loft conversions', 'Basements', 'Complex projects'],
      advantages: [
        'Certainty before starting',
        'Plans checked and approved',
        'Clearer costs',
        'Easier mortgage/sale'
      ],
      disadvantages: [
        'Higher fees',
        'Longer lead time',
        'Detailed drawings required'
      ],
      fees: 'Plan fee + inspection fee (£400-1,500 typical)'
    },
    buildingNotice: {
      name: 'Building Notice',
      description: 'Notify intention to build - compliance checked as work progresses',
      suitableFor: ['Simple extensions', 'Non-structural alterations'],
      advantages: [
        'Quick start (48 hours notice)',
        'Lower initial fees',
        'Less upfront documentation'
      ],
      disadvantages: [
        'No upfront approval',
        'Risk of variations on site',
        'No completion certificate initially'
      ],
      fees: 'Single combined fee (£300-1,000 typical)'
    },
    competentPerson: {
      name: 'Competent Person Scheme',
      description: 'Self-certification by registered installer',
      suitableFor: ['Electrical work', 'Heating systems', 'Windows', 'Structural'],
      advantages: [
        'No Building Control fee',
        'No formal application',
        'Installer certifies'
      ],
      disadvantages: [
        'Limited scope',
        'Must use registered installer'
      ],
      fees: 'Included in installer price'
    },
    recommendedRoute: structuralWork
      ? 'Full Plans Application recommended for structural work'
      : 'Full Plans Application or Building Notice acceptable'
  };
}

// =============================================================================
// INDIVIDUAL PART ASSESSMENTS
// =============================================================================

function assessPartA(projectDetails: BuildingRegsProject): PartAssessment {
  const applicable = Boolean(projectDetails.structuralWork) ||
                     projectDetails.projectType === 'extension' ||
                     projectDetails.projectType === 'loft' ||
                     projectDetails.projectType === 'basement';

  return {
    part: 'A',
    title: 'Structure',
    applicable,
    requirements: [
      'Loading - dead, imposed, wind, snow loads',
      'Ground movement - heave, subsidence, landslip',
      'Disproportionate collapse - structural integrity'
    ],
    complianceItems: [
      {
        part: 'A',
        requirement: 'Foundations adequate for ground conditions',
        howToComply: 'Design to BS EN 1997 (Eurocode 7)',
        evidence: 'Structural calculations, soil investigation',
        applicable
      },
      {
        part: 'A',
        requirement: 'Structure adequate for loads',
        howToComply: 'Design to Eurocodes, BS 5268 for timber',
        evidence: 'Structural calculations by engineer',
        applicable
      }
    ],
    commonIssues: [
      'Inadequate foundation depth near trees',
      'Undersized steels for openings',
      'Party wall connections'
    ]
  };
}

function assessPartB(projectDetails: BuildingRegsProject): PartAssessment {
  const applicable = true;
  const isLoft = projectDetails.projectType === 'loft';

  return {
    part: 'B',
    title: 'Fire Safety',
    applicable,
    requirements: [
      'Means of warning and escape',
      'Internal fire spread (linings, structure)',
      'External fire spread',
      'Access and facilities for fire service'
    ],
    complianceItems: [
      {
        part: 'B',
        requirement: 'Smoke/heat alarms',
        howToComply: 'LD2/LD3 system to BS 5839-6',
        evidence: 'Alarm certificate, layout plan',
        applicable
      },
      {
        part: 'B',
        requirement: 'Protected escape route',
        howToComply: 'FD30 doors, 30-min ceiling, enclosed stairs',
        evidence: 'Product certificates, inspection',
        applicable: isLoft
      },
      {
        part: 'B',
        requirement: 'Fire doors where required',
        howToComply: 'CE marked FD30/FD30S doors',
        evidence: 'Product certification',
        applicable
      }
    ],
    commonIssues: [
      'Loft conversion escape route',
      'Fire door specification incorrect',
      'Smoke alarm interconnection'
    ]
  };
}

function assessPartC(projectDetails: BuildingRegsProject): PartAssessment {
  const isBasement = projectDetails.projectType === 'basement';
  const isExtension = projectDetails.projectType === 'extension';

  return {
    part: 'C',
    title: 'Site Preparation and Resistance to Contaminants and Moisture',
    applicable: isBasement || isExtension,
    requirements: [
      'Site preparation - vegetation, contaminants',
      'Resistance to ground moisture',
      'Resistance to weather and ground water'
    ],
    complianceItems: [
      {
        part: 'C',
        requirement: 'DPC/DPM provision',
        howToComply: 'Minimum 150mm above ground, linked to floor DPM',
        evidence: 'Installation photos, specification',
        applicable: isExtension
      },
      {
        part: 'C',
        requirement: 'Basement waterproofing',
        howToComply: 'Type A/B/C waterproofing to BS 8102',
        evidence: 'Waterproofing design, installer warranty',
        applicable: isBasement
      }
    ],
    commonIssues: [
      'DPC height below ground level',
      'Basement waterproofing design',
      'External ground levels'
    ]
  };
}

function assessPartE(projectDetails: BuildingRegsProject): PartAssessment {
  const applicable = Boolean(projectDetails.attachedProperty);

  return {
    part: 'E',
    title: 'Resistance to Sound',
    applicable,
    requirements: [
      'Sound between dwellings (airborne)',
      'Sound from stairs and floors (impact)',
      'Sound within dwelling (rooms)'
    ],
    complianceItems: [
      {
        part: 'E',
        requirement: 'Sound insulation to party wall/floor',
        howToComply: 'Pre-completion testing or Robust Details',
        evidence: 'Sound test results or RD certificate',
        applicable
      }
    ],
    commonIssues: [
      'Flanking transmission',
      'Penetrations through party wall',
      'Junction details'
    ]
  };
}

function assessPartF(projectDetails: BuildingRegsProject): PartAssessment {
  return {
    part: 'F',
    title: 'Ventilation',
    applicable: true,
    requirements: [
      'Extract ventilation (kitchen, bathroom, utility)',
      'Whole dwelling ventilation',
      'Purge ventilation (openable windows)'
    ],
    complianceItems: [
      {
        part: 'F',
        requirement: 'Extract ventilation rates',
        howToComply: 'Kitchen 30 l/s intermittent, bathroom 15 l/s',
        evidence: 'Fan specification, commissioning',
        applicable: true
      },
      {
        part: 'F',
        requirement: 'Background ventilation',
        howToComply: 'Trickle vents to windows/equivalent',
        evidence: 'Window specification',
        applicable: true
      }
    ],
    commonIssues: [
      'Inadequate extract rates',
      'Missing trickle vents',
      'Condensation issues'
    ]
  };
}

function assessPartG(projectDetails: BuildingRegsProject): PartAssessment {
  return {
    part: 'G',
    title: 'Sanitation, Hot Water Safety and Water Efficiency',
    applicable: Boolean(projectDetails.plumbingWork),
    requirements: [
      'Cold water supply (wholesome water)',
      'Hot water supply and safety (TMVs)',
      'Sanitary conveniences and washing facilities',
      'Water efficiency (125 l/person/day)'
    ],
    complianceItems: [
      {
        part: 'G',
        requirement: 'Hot water temperature control',
        howToComply: 'TMVs to bathrooms, cylinder thermostat',
        evidence: 'Product certification, installation',
        applicable: Boolean(projectDetails.plumbingWork)
      }
    ],
    commonIssues: [
      'Missing TMVs in bathrooms',
      'Hot water storage temperature'
    ]
  };
}

function assessPartH(projectDetails: BuildingRegsProject): PartAssessment {
  const isExtension = projectDetails.projectType === 'extension';
  const isBasement = projectDetails.projectType === 'basement';

  return {
    part: 'H',
    title: 'Drainage and Waste Disposal',
    applicable: isExtension || isBasement || Boolean(projectDetails.plumbingWork),
    requirements: [
      'Foul drainage',
      'Rainwater drainage',
      'Solid waste storage'
    ],
    complianceItems: [
      {
        part: 'H',
        requirement: 'Connection to foul sewer',
        howToComply: 'Build over agreement if near sewer',
        evidence: 'Thames Water approval',
        applicable: isExtension || isBasement
      }
    ],
    commonIssues: [
      'Building over sewers without agreement',
      'Inadequate falls on drains'
    ]
  };
}

function assessPartJ(projectDetails: BuildingRegsProject): PartAssessment {
  return {
    part: 'J',
    title: 'Combustion Appliances and Fuel Storage',
    applicable: Boolean(projectDetails.heatingChanges),
    requirements: [
      'Air supply to appliances',
      'Discharge of combustion products',
      'Protection from heat',
      'Provision of information'
    ],
    complianceItems: [
      {
        part: 'J',
        requirement: 'Flue discharge position',
        howToComply: 'Minimum distances from openings/boundaries',
        evidence: 'Installation certificate',
        applicable: Boolean(projectDetails.heatingChanges)
      }
    ],
    commonIssues: [
      'Flue terminal positions',
      'Carbon monoxide alarms'
    ]
  };
}

function assessPartK(projectDetails: BuildingRegsProject): PartAssessment {
  const isLoft = projectDetails.projectType === 'loft';
  const hasStairs = isLoft || projectDetails.projectType === 'basement';

  return {
    part: 'K',
    title: 'Protection from Falling, Collision and Impact',
    applicable: hasStairs,
    requirements: [
      'Stairs and ramps (pitch, going, handrails)',
      'Protection from falling (barriers, guarding)',
      'Vehicle barriers and loading bays',
      'Protection against impact from glazing'
    ],
    complianceItems: [
      {
        part: 'K',
        requirement: 'Stair geometry',
        howToComply: 'Max 42° pitch, min 220mm going, max 220mm rise',
        evidence: 'Drawing dimensions, inspection',
        applicable: hasStairs
      },
      {
        part: 'K',
        requirement: 'Guarding height',
        howToComply: 'Min 900mm stairs/ramps, 1100mm elsewhere',
        evidence: 'Installation inspection',
        applicable: hasStairs
      }
    ],
    commonIssues: [
      'Loft stair geometry',
      'Guarding heights and gaps',
      'Headroom on stairs'
    ]
  };
}

function assessPartL(projectDetails: BuildingRegsProject): PartAssessment {
  return {
    part: 'L',
    title: 'Conservation of Fuel and Power',
    applicable: true,
    requirements: [
      'Limiting heat loss (U-values)',
      'Limiting solar gain',
      'Heating system efficiency',
      'Fixed lighting efficiency'
    ],
    complianceItems: [
      {
        part: 'L',
        requirement: 'Extension U-values',
        howToComply: 'Walls 0.28, Roof 0.16, Floor 0.18, Windows 1.6',
        evidence: 'SAP calculations, product certificates',
        applicable: projectDetails.projectType === 'extension'
      },
      {
        part: 'L',
        requirement: 'Heating system efficiency',
        howToComply: 'Condensing boiler 92%+ or heat pump',
        evidence: 'Product data sheet',
        applicable: Boolean(projectDetails.heatingChanges)
      }
    ],
    commonIssues: [
      'Achieving U-value targets',
      'Thermal bridging details',
      'Air permeability testing'
    ]
  };
}

function assessPartM(projectDetails: BuildingRegsProject): PartAssessment {
  return {
    part: 'M',
    title: 'Access to and Use of Buildings',
    applicable: projectDetails.projectType === 'new_build' || projectDetails.projectType === 'change_of_use',
    requirements: [
      'Category 1: Visitable dwellings (standard)',
      'Category 2: Accessible and adaptable',
      'Category 3: Wheelchair user dwellings'
    ],
    complianceItems: [
      {
        part: 'M',
        requirement: 'Level or ramped access',
        howToComply: 'Principal entrance accessible',
        evidence: 'Drawing showing access',
        applicable: projectDetails.projectType === 'new_build'
      }
    ],
    commonIssues: [
      'Step at entrance',
      'Door widths',
      'WC accessibility'
    ]
  };
}

function assessPartO(projectDetails: BuildingRegsProject): PartAssessment {
  return {
    part: 'O',
    title: 'Overheating',
    applicable: projectDetails.projectType === 'new_build',
    requirements: [
      'Limiting unwanted solar gains',
      'Removing excess heat',
      'Cross-ventilation/mechanical'
    ],
    complianceItems: [
      {
        part: 'O',
        requirement: 'Overheating mitigation',
        howToComply: 'Simplified method or dynamic modeling',
        evidence: 'Overheating assessment',
        applicable: projectDetails.projectType === 'new_build'
      }
    ],
    commonIssues: [
      'South-facing glazing areas',
      'Cross-ventilation provision'
    ]
  };
}

function assessPartP(projectDetails: BuildingRegsProject): PartAssessment {
  return {
    part: 'P',
    title: 'Electrical Safety',
    applicable: Boolean(projectDetails.electricalWork),
    requirements: [
      'Design and installation standards',
      'Inspection and testing',
      'Provision of information'
    ],
    complianceItems: [
      {
        part: 'P',
        requirement: 'Electrical installation',
        howToComply: 'BS 7671 (18th Edition Wiring Regulations)',
        evidence: 'Electrical certificate from Part P installer',
        applicable: Boolean(projectDetails.electricalWork)
      }
    ],
    commonIssues: [
      'Non-registered installer',
      'Missing EIC certificate',
      'Consumer unit location'
    ]
  };
}

function assessPartS(projectDetails: BuildingRegsProject): PartAssessment {
  return {
    part: 'S',
    title: 'Infrastructure for Electric Vehicle Charging',
    applicable: projectDetails.projectType === 'new_build',
    requirements: [
      'Charge point for new dwellings with parking',
      'Cable routes for future installation'
    ],
    complianceItems: [
      {
        part: 'S',
        requirement: 'EV charge point',
        howToComply: 'Minimum 7kW charge point per dwelling with parking',
        evidence: 'Installation certificate',
        applicable: projectDetails.projectType === 'new_build'
      }
    ],
    commonIssues: [
      'Charge point specification',
      'DNO capacity'
    ]
  };
}

// =============================================================================
// EXEMPTIONS
// =============================================================================

function assessExemptions(projectDetails: BuildingRegsProject): ExemptionAssessment {
  return {
    description: 'Assessment of potential Building Regulations exemptions',
    potentialExemptions: [
      {
        category: 'Conservatory/porch',
        description: 'Ground floor conservatory <30m², separated from house',
        conditions: ['Under 30m² floor area', 'Glazing meets Part L', 'Separated by external quality walls/doors', 'Independent heating with own controls'],
        applicable: false
      },
      {
        category: 'Detached building',
        description: 'Detached building not containing sleeping accommodation',
        conditions: ['Under 15m² with no sleeping', 'Under 30m² more than 1m from boundary'],
        applicable: false
      },
      {
        category: 'Like-for-like replacement',
        description: 'Replacement windows/doors/boiler (must be notified)',
        conditions: ['Competent Person Scheme', 'Building Notice', 'Or self-certify and notify'],
        applicable: projectDetails.projectType === 'internal'
      }
    ]
  };
}

// =============================================================================
// PROCESS GUIDANCE
// =============================================================================

function getProcessGuidance(projectDetails: BuildingRegsProject): ProcessGuidance {
  return {
    description: 'Building Control application process guidance',
    steps: [
      { step: 1, action: 'Choose approval route (Full Plans/Building Notice)', timing: 'Before design complete', responsibility: 'Applicant/Agent' },
      { step: 2, action: 'Submit application with fee', timing: '5+ weeks before start', responsibility: 'Applicant/Agent' },
      { step: 3, action: 'Receive plan approval (Full Plans)', timing: '5-8 weeks', responsibility: 'Building Control' },
      { step: 4, action: 'Notify commencement', timing: '2 days before starting', responsibility: 'Builder/Applicant' },
      { step: 5, action: 'Request inspections at key stages', timing: 'During construction', responsibility: 'Builder' },
      { step: 6, action: 'Request completion inspection', timing: 'When work complete', responsibility: 'Builder/Applicant' },
      { step: 7, action: 'Receive completion certificate', timing: 'After final inspection', responsibility: 'Building Control' }
    ],
    inspections: [
      { stage: 'Commencement', notification: '2 days before', whatInspected: 'Site set-up, excavations' },
      { stage: 'Foundations', notification: '1 day before concrete', whatInspected: 'Depth, width, reinforcement' },
      { stage: 'Damp-proof course', notification: '1 day before covering', whatInspected: 'DPC position, continuity' },
      { stage: 'Drainage', notification: 'Before backfilling', whatInspected: 'Falls, materials, connections' },
      { stage: 'Pre-plaster/completion', notification: '1 day before', whatInspected: 'Fire stopping, insulation, structure' },
      { stage: 'Final', notification: 'When complete', whatInspected: 'All requirements compliance' }
    ]
  };
}

// =============================================================================
// CONCLUSION
// =============================================================================

function generateConclusion(
  summary: BuildingRegsSummary,
  projectDetails: BuildingRegsProject
): BuildingRegsConclusion {
  return {
    overallAssessment: 'Building Regulations approval required - achievable with proper design',
    criticalItems: [
      'Structural design to Approved Document A',
      'Fire safety measures per Part B',
      'Energy efficiency per Part L (2021)',
      projectDetails.electricalWork ? 'Part P electrical certification' : ''
    ].filter(Boolean),
    conditions: [
      'Submit Building Regulations application before work starts',
      'Notify Building Control of commencement',
      'Request inspections at key stages',
      'Obtain Completion Certificate before occupation'
    ]
  };
}

// =============================================================================
// RECOMMENDATIONS
// =============================================================================

function generateRecommendations(projectDetails: BuildingRegsProject): string[] {
  const recommendations = [
    'Submit Full Plans application for design certainty',
    'Use Approved Inspectors or Local Authority Building Control',
    'Ensure all structural work is engineer-designed',
    'Keep records of all inspections and certificates'
  ];

  if (projectDetails.electricalWork) {
    recommendations.push('Use Part P registered electrician for self-certification');
  }

  if (projectDetails.projectType === 'loft') {
    recommendations.push('Address fire escape route early in design');
    recommendations.push('Confirm stair geometry complies with Part K');
  }

  if (projectDetails.listedBuilding) {
    recommendations.push('Coordinate Building Regs with Listed Building Consent');
  }

  recommendations.push('Obtain Completion Certificate for mortgage/sale purposes');

  return recommendations;
}

// =============================================================================
// EXPORTS
// =============================================================================

const buildingRegsCompliance = {
  assessBuildingRegs,
  APPROVED_DOCUMENTS
};

export default buildingRegsCompliance;
