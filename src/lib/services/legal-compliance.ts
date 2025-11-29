/**
 * Legal Compliance Checker Service
 * 
 * Comprehensive legal compliance checking for property development in Hampstead
 * and surrounding conservation areas. Covers planning law, building regulations,
 * party wall, health & safety, and environmental legislation.
 * 
 * Coverage: NW1-NW11, N2, N6, N10 postcodes
 */

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

interface LegalProject {
  propertyType?: 'detached' | 'semi_detached' | 'terraced' | 'flat' | 'mansion';
  projectType?: 'extension' | 'loft' | 'basement' | 'new_build' | 'refurbishment' | 'change_of_use';
  isConservationArea?: boolean;
  isListedBuilding?: boolean;
  hasSharedWalls?: boolean;
  hasBasement?: boolean;
  nearTreesTPO?: boolean;
  affectsBoundary?: boolean;
  changeOfUse?: boolean;
  numberOfUnits?: number;
  commercialElement?: boolean;
  affectsHighway?: boolean;
}

interface LegalRequirement {
  legislation: string;
  requirement: string;
  applicability: string;
  actionRequired: string;
  penalty: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
}

interface ComplianceCategory {
  category: string;
  description: string;
  requirements: LegalRequirement[];
  professionalAdvice: string;
}

interface LegalComplianceAssessment {
  summary: ComplianceSummary;
  planningLaw: ComplianceCategory;
  buildingRegulations: ComplianceCategory;
  partyWallAct: ComplianceCategory;
  healthAndSafety: ComplianceCategory;
  environmentalLaw: ComplianceCategory;
  propertyLaw: ComplianceCategory;
  listingsAndConservation: ComplianceCategory;
  contractLaw: ComplianceCategory;
  insuranceRequirements: InsuranceRequirements;
  timeline: ComplianceTimeline;
  professionalAppointments: ProfessionalAppointment[];
  riskAssessment: LegalRiskAssessment;
  disclaimer: string;
}

interface ComplianceSummary {
  overallRisk: string;
  criticalRequirements: number;
  highPriorityItems: number;
  estimatedApprovalTime: string;
  keyConsiderations: string[];
}

interface InsuranceRequirements {
  required: InsuranceItem[];
  recommended: InsuranceItem[];
  notes: string[];
}

interface InsuranceItem {
  type: string;
  minimumCover: string;
  purpose: string;
  provider: string;
}

interface ComplianceTimeline {
  preConstruction: TimelineItem[];
  duringConstruction: TimelineItem[];
  postConstruction: TimelineItem[];
}

interface TimelineItem {
  item: string;
  timing: string;
  responsibility: string;
}

interface ProfessionalAppointment {
  professional: string;
  role: string;
  whenNeeded: string;
  estimatedCost: string;
  statutory: boolean;
}

interface LegalRiskAssessment {
  overallRisk: string;
  highRiskAreas: RiskArea[];
  mitigationMeasures: string[];
}

interface RiskArea {
  area: string;
  risk: string;
  consequence: string;
  mitigation: string;
}

// =============================================================================
// MAIN SERVICE FUNCTION
// =============================================================================

async function checkLegalCompliance(
  address: string,
  postcode: string,
  projectType: string,
  projectDetails: LegalProject = {}
): Promise<LegalComplianceAssessment> {
  const summary = generateComplianceSummary(projectDetails);
  const planningLaw = checkPlanningLaw(projectDetails);
  const buildingRegulations = checkBuildingRegulations(projectDetails);
  const partyWallAct = checkPartyWallAct(projectDetails);
  const healthAndSafety = checkHealthAndSafety(projectDetails);
  const environmentalLaw = checkEnvironmentalLaw(projectDetails);
  const propertyLaw = checkPropertyLaw(projectDetails);
  const listingsAndConservation = checkListingsAndConservation(projectDetails);
  const contractLaw = checkContractLaw(projectDetails);
  const insuranceRequirements = assessInsuranceRequirements(projectDetails);
  const timeline = generateComplianceTimeline(projectDetails);
  const professionalAppointments = identifyProfessionalAppointments(projectDetails);
  const riskAssessment = assessLegalRisks(projectDetails);

  return {
    summary,
    planningLaw,
    buildingRegulations,
    partyWallAct,
    healthAndSafety,
    environmentalLaw,
    propertyLaw,
    listingsAndConservation,
    contractLaw,
    insuranceRequirements,
    timeline,
    professionalAppointments,
    riskAssessment,
    disclaimer: getLegalDisclaimer()
  };
}

// =============================================================================
// COMPLIANCE SUMMARY
// =============================================================================

function generateComplianceSummary(projectDetails: LegalProject): ComplianceSummary {
  let criticalCount = 0;
  let highCount = 0;

  // Count critical items
  criticalCount++; // Planning permission always critical
  criticalCount++; // Building regulations always critical
  if (projectDetails.hasSharedWalls) criticalCount++;
  if (projectDetails.isListedBuilding) criticalCount++;

  // Count high priority
  if (projectDetails.isConservationArea) highCount++;
  if (projectDetails.nearTreesTPO) highCount++;
  if (projectDetails.changeOfUse) highCount++;
  if (projectDetails.hasBasement) highCount++;

  let approvalTime = '8-10 weeks';
  if (projectDetails.isListedBuilding) approvalTime = '10-13 weeks';
  if (projectDetails.projectType === 'new_build') approvalTime = '10-13 weeks';
  if (projectDetails.changeOfUse) approvalTime = '8-13 weeks';

  return {
    overallRisk: criticalCount > 3 ? 'High' : criticalCount > 2 ? 'Medium-High' : 'Medium',
    criticalRequirements: criticalCount,
    highPriorityItems: highCount,
    estimatedApprovalTime: approvalTime,
    keyConsiderations: [
      'Planning permission required for most development',
      'Building Regulations approval mandatory',
      'Party Wall Act applies to shared boundaries',
      'Conservation area restrictions on materials and design',
      'Listed building consent required for alterations to listed properties'
    ]
  };
}

// =============================================================================
// PLANNING LAW
// =============================================================================

function checkPlanningLaw(projectDetails: LegalProject): ComplianceCategory {
  const requirements: LegalRequirement[] = [
    {
      legislation: 'Town and Country Planning Act 1990',
      requirement: 'Planning Permission',
      applicability: 'Most development requiring material change',
      actionRequired: 'Submit planning application to Local Planning Authority',
      penalty: 'Enforcement notice; requirement to remove unauthorized works',
      priority: 'critical'
    },
    {
      legislation: 'Town and Country Planning (General Permitted Development) Order 2015',
      requirement: 'Permitted Development Assessment',
      applicability: 'Some minor works may be permitted development',
      actionRequired: 'Verify if works fall under PD rights; consider Certificate of Lawfulness',
      penalty: 'Works may not be lawful if PD criteria not met',
      priority: 'high'
    },
    {
      legislation: 'Planning (Listed Buildings and Conservation Areas) Act 1990',
      requirement: 'Listed Building Consent',
      applicability: 'Any works affecting character of listed building',
      actionRequired: 'Submit separate LBC application with detailed heritage statement',
      penalty: 'Criminal offence; unlimited fine; imprisonment up to 2 years',
      priority: projectDetails.isListedBuilding ? 'critical' : 'low'
    }
  ];

  if (projectDetails.isConservationArea) {
    requirements.push({
      legislation: 'Planning (Listed Buildings and Conservation Areas) Act 1990',
      requirement: 'Conservation Area Consent',
      applicability: 'Demolition in conservation areas',
      actionRequired: 'Submit application for demolition; heritage impact assessment',
      penalty: 'Criminal offence; enforcement action',
      priority: 'high'
    });
  }

  if (projectDetails.changeOfUse) {
    requirements.push({
      legislation: 'Town and Country Planning (Use Classes) Order 1987',
      requirement: 'Change of Use Permission',
      applicability: 'Change between use classes',
      actionRequired: 'Planning application for change of use',
      penalty: 'Enforcement notice; reversion to original use',
      priority: 'critical'
    });
  }

  return {
    category: 'Planning Law',
    description: 'Requirements under planning legislation for development control',
    requirements,
    professionalAdvice: 'Consult planning consultant or architect for pre-application advice'
  };
}

// =============================================================================
// BUILDING REGULATIONS
// =============================================================================

function checkBuildingRegulations(projectDetails: LegalProject): ComplianceCategory {
  const requirements: LegalRequirement[] = [
    {
      legislation: 'Building Act 1984 / Building Regulations 2010',
      requirement: 'Building Regulations Approval',
      applicability: 'All building work affecting structure, fire safety, accessibility, etc.',
      actionRequired: 'Submit Building Control application (Full Plans or Building Notice)',
      penalty: 'Enforcement; requirement to expose and rectify; prosecution',
      priority: 'critical'
    },
    {
      legislation: 'Building Regulations Part A',
      requirement: 'Structural Safety',
      applicability: 'All structural works',
      actionRequired: 'Structural engineer calculations; building control inspection',
      penalty: 'Dangerous structure notice; prosecution',
      priority: 'critical'
    },
    {
      legislation: 'Building Regulations Part B',
      requirement: 'Fire Safety',
      applicability: 'All building work',
      actionRequired: 'Fire safety design; fire doors; alarms; means of escape',
      penalty: 'Enforcement; prohibition notice; prosecution',
      priority: 'critical'
    },
    {
      legislation: 'Building Regulations Part L',
      requirement: 'Energy Efficiency',
      applicability: 'Extensions, new buildings, change of use',
      actionRequired: 'SAP calculations; insulation standards; MEES compliance',
      penalty: 'Enforcement; requirement to improve',
      priority: 'high'
    },
    {
      legislation: 'Building Regulations Part M',
      requirement: 'Accessibility',
      applicability: 'New dwellings; extensions to public buildings',
      actionRequired: 'Accessible design; level thresholds; adequate widths',
      penalty: 'Enforcement; requirement to modify',
      priority: 'high'
    }
  ];

  if (projectDetails.hasBasement) {
    requirements.push({
      legislation: 'Building Regulations Part C',
      requirement: 'Basement Waterproofing',
      applicability: 'All basement construction',
      actionRequired: 'Waterproofing design to BS 8102; drainage strategy',
      penalty: 'Enforcement if water ingress causes damage',
      priority: 'critical'
    });
  }

  return {
    category: 'Building Regulations',
    description: 'Technical standards for construction quality and safety',
    requirements,
    professionalAdvice: 'Engage Approved Inspector or Local Authority Building Control'
  };
}

// =============================================================================
// PARTY WALL ACT
// =============================================================================

function checkPartyWallAct(projectDetails: LegalProject): ComplianceCategory {
  const requirements: LegalRequirement[] = [];
  const hasPartyWallImplications = projectDetails.hasSharedWalls ||
    projectDetails.affectsBoundary ||
    projectDetails.hasBasement;

  if (hasPartyWallImplications) {
    requirements.push({
      legislation: 'Party Wall etc. Act 1996',
      requirement: 'Party Wall Notice',
      applicability: 'Works on or near party walls; excavations within 3m/6m of neighbors',
      actionRequired: 'Serve party wall notice minimum 1-2 months before works',
      penalty: 'Injunction; damages; works stopped until agreement',
      priority: 'critical'
    });

    requirements.push({
      legislation: 'Party Wall etc. Act 1996',
      requirement: 'Party Wall Award',
      applicability: 'When neighbor dissents to notice or does not respond',
      actionRequired: 'Appoint party wall surveyors; agree award before works',
      penalty: 'Cannot lawfully proceed; legal action by neighbor',
      priority: 'high'
    });

    requirements.push({
      legislation: 'Party Wall etc. Act 1996',
      requirement: 'Schedule of Condition',
      applicability: 'All party wall matters',
      actionRequired: 'Record condition of adjoining property before works',
      penalty: 'Liability for unproven damage claims',
      priority: 'high'
    });
  }

  if (requirements.length === 0) {
    requirements.push({
      legislation: 'Party Wall etc. Act 1996',
      requirement: 'Party Wall Assessment',
      applicability: 'May apply depending on proximity to boundaries',
      actionRequired: 'Review proposed works against party wall criteria',
      penalty: 'N/A if not applicable',
      priority: 'medium'
    });
  }

  return {
    category: 'Party Wall Act',
    description: 'Requirements for works affecting shared boundaries and neighboring properties',
    requirements,
    professionalAdvice: 'Appoint Party Wall Surveyor for all party wall matters'
  };
}

// =============================================================================
// HEALTH AND SAFETY
// =============================================================================

function checkHealthAndSafety(projectDetails: LegalProject): ComplianceCategory {
  const requirements: LegalRequirement[] = [
    {
      legislation: 'Construction (Design and Management) Regulations 2015',
      requirement: 'CDM Compliance',
      applicability: 'All construction projects',
      actionRequired: 'Appoint competent contractor; prepare Construction Phase Plan',
      penalty: 'HSE prosecution; unlimited fine; imprisonment',
      priority: 'critical'
    },
    {
      legislation: 'CDM 2015',
      requirement: 'F10 Notification',
      applicability: 'Projects lasting >30 days or >500 person days',
      actionRequired: 'Notify HSE; appoint Principal Designer and Principal Contractor',
      penalty: 'HSE prosecution; fine',
      priority: projectDetails.projectType === 'new_build' || projectDetails.hasBasement ? 'critical' : 'medium'
    },
    {
      legislation: 'Health and Safety at Work Act 1974',
      requirement: 'General Health and Safety Duties',
      applicability: 'All work activities',
      actionRequired: 'Risk assessments; method statements; safe systems of work',
      penalty: 'HSE prosecution; unlimited fine; imprisonment',
      priority: 'critical'
    },
    {
      legislation: 'Control of Asbestos Regulations 2012',
      requirement: 'Asbestos Management',
      applicability: 'All properties built before 2000',
      actionRequired: 'Asbestos survey before demolition/refurbishment; licensed removal',
      penalty: 'HSE prosecution; unlimited fine; imprisonment',
      priority: 'critical'
    },
    {
      legislation: 'Work at Height Regulations 2005',
      requirement: 'Safe Working at Height',
      applicability: 'All work at height including scaffolding and ladders',
      actionRequired: 'Proper access equipment; fall protection; inspection records',
      penalty: 'HSE prosecution; fine; imprisonment',
      priority: 'high'
    }
  ];

  return {
    category: 'Health and Safety',
    description: 'Legal requirements for safe construction practices',
    requirements,
    professionalAdvice: 'Ensure contractor has appropriate CDM experience and insurance'
  };
}

// =============================================================================
// ENVIRONMENTAL LAW
// =============================================================================

function checkEnvironmentalLaw(projectDetails: LegalProject): ComplianceCategory {
  const requirements: LegalRequirement[] = [
    {
      legislation: 'Wildlife and Countryside Act 1981',
      requirement: 'Protected Species',
      applicability: 'All development potentially affecting wildlife',
      actionRequired: 'Ecological survey; protected species license if required',
      penalty: 'Criminal offence; unlimited fine; imprisonment up to 6 months',
      priority: 'high'
    },
    {
      legislation: 'Conservation of Habitats and Species Regulations 2017',
      requirement: 'European Protected Species',
      applicability: 'Development affecting bats, great crested newts, etc.',
      actionRequired: 'Bat survey; Natural England license; mitigation strategy',
      penalty: 'Criminal offence; unlimited fine; imprisonment',
      priority: 'high'
    },
    {
      legislation: 'Town and Country Planning Act 1990 (Tree Preservation)',
      requirement: 'TPO Compliance',
      applicability: 'Works affecting trees with TPO or in conservation area',
      actionRequired: 'Tree survey; TPO application; arboricultural method statement',
      penalty: 'Fine up to £20,000 (Magistrates) or unlimited (Crown Court)',
      priority: projectDetails.nearTreesTPO ? 'critical' : 'medium'
    },
    {
      legislation: 'Environmental Protection Act 1990',
      requirement: 'Statutory Nuisance',
      applicability: 'Noise, dust, fumes from construction',
      actionRequired: 'Construction Management Plan; dust and noise mitigation',
      penalty: 'Abatement notice; fine up to £20,000',
      priority: 'high'
    },
    {
      legislation: 'Environment Act 2021',
      requirement: 'Biodiversity Net Gain',
      applicability: 'Major development (from 2024/25)',
      actionRequired: '10% biodiversity net gain; metric assessment',
      penalty: 'Refusal of planning permission',
      priority: projectDetails.numberOfUnits && projectDetails.numberOfUnits >= 10 ? 'high' : 'low'
    }
  ];

  return {
    category: 'Environmental Law',
    description: 'Legal requirements for environmental protection during development',
    requirements,
    professionalAdvice: 'Engage ecologist for ecological surveys where required'
  };
}

// =============================================================================
// PROPERTY LAW
// =============================================================================

function checkPropertyLaw(projectDetails: LegalProject): ComplianceCategory {
  const requirements: LegalRequirement[] = [
    {
      legislation: 'Law of Property Act 1925',
      requirement: 'Title Check',
      applicability: 'All property development',
      actionRequired: 'Verify ownership; check for restrictive covenants',
      penalty: 'Covenant breach; injunction; damages',
      priority: 'high'
    },
    {
      legislation: 'Leasehold Reform Act 1967/2002',
      requirement: 'Leasehold Consent',
      applicability: 'Leasehold properties',
      actionRequired: 'Obtain landlord consent for alterations per lease terms',
      penalty: 'Lease forfeiture; injunction; damages',
      priority: projectDetails.propertyType === 'flat' ? 'critical' : 'medium'
    },
    {
      legislation: 'Common law',
      requirement: 'Right to Light',
      applicability: 'Extensions and new buildings affecting neighbors',
      actionRequired: 'Rights to light assessment; neighbor agreement or compensation',
      penalty: 'Injunction to remove obstruction; damages',
      priority: 'medium'
    },
    {
      legislation: 'Law of Property (Miscellaneous Provisions) Act 1989',
      requirement: 'Building Contract',
      applicability: 'All construction contracts',
      actionRequired: 'Written contract; clear terms; payment schedule',
      penalty: 'Dispute liability; difficulty enforcing terms',
      priority: 'high'
    }
  ];

  return {
    category: 'Property Law',
    description: 'Legal requirements relating to property rights and contracts',
    requirements,
    professionalAdvice: 'Consult solicitor for title checks and contract review'
  };
}

// =============================================================================
// LISTINGS AND CONSERVATION
// =============================================================================

function checkListingsAndConservation(projectDetails: LegalProject): ComplianceCategory {
  const requirements: LegalRequirement[] = [];

  if (projectDetails.isListedBuilding) {
    requirements.push({
      legislation: 'Planning (Listed Buildings and Conservation Areas) Act 1990',
      requirement: 'Listed Building Consent',
      applicability: 'Any works affecting character of listed building',
      actionRequired: 'Detailed application with heritage impact assessment',
      penalty: 'Criminal offence; unlimited fine; imprisonment up to 2 years; restoration order',
      priority: 'critical'
    });

    requirements.push({
      legislation: 'Planning (Listed Buildings and Conservation Areas) Act 1990',
      requirement: 'Heritage Statement',
      applicability: 'All LBC applications',
      actionRequired: 'Detailed statement of significance and impact',
      penalty: 'Application likely to be refused without',
      priority: 'critical'
    });
  }

  if (projectDetails.isConservationArea) {
    requirements.push({
      legislation: 'Planning (Listed Buildings and Conservation Areas) Act 1990',
      requirement: 'Conservation Area Considerations',
      applicability: 'All development in conservation areas',
      actionRequired: 'Design to preserve/enhance character; materials selection',
      penalty: 'Planning refusal; enforcement action',
      priority: 'high'
    });

    requirements.push({
      legislation: 'Planning (Listed Buildings and Conservation Areas) Act 1990',
      requirement: 'Tree Works Notification',
      applicability: 'Any tree works in conservation area',
      actionRequired: '6 weeks notice to LPA for any tree works',
      penalty: 'Fine up to £20,000',
      priority: 'high'
    });
  }

  if (requirements.length === 0) {
    requirements.push({
      legislation: 'N/A',
      requirement: 'Heritage Assessment',
      applicability: 'Property not listed or in conservation area',
      actionRequired: 'No specific heritage requirements',
      penalty: 'N/A',
      priority: 'low'
    });
  }

  return {
    category: 'Listed Buildings and Conservation',
    description: 'Additional requirements for heritage properties and conservation areas',
    requirements,
    professionalAdvice: 'Engage conservation architect for listed building works'
  };
}

// =============================================================================
// CONTRACT LAW
// =============================================================================

function checkContractLaw(projectDetails: LegalProject): ComplianceCategory {
  const requirements: LegalRequirement[] = [
    {
      legislation: 'Housing Grants, Construction and Regeneration Act 1996',
      requirement: 'Construction Contract',
      applicability: 'All construction contracts',
      actionRequired: 'Written contract with statutory payment provisions; adjudication clause',
      penalty: 'Statutory scheme applies if non-compliant',
      priority: 'high'
    },
    {
      legislation: 'Consumer Rights Act 2015',
      requirement: 'Consumer Protection',
      applicability: 'Contracts between consumers and traders',
      actionRequired: 'Fair terms; transparent pricing; clear specification',
      penalty: 'Unfair terms unenforceable; damages',
      priority: 'high'
    },
    {
      legislation: 'Supply of Goods and Services Act 1982',
      requirement: 'Quality of Work',
      applicability: 'All construction services',
      actionRequired: 'Work to be carried out with reasonable care and skill',
      penalty: 'Damages for breach; right to rectification',
      priority: 'high'
    },
    {
      legislation: 'Limitation Act 1980',
      requirement: 'Defects Liability',
      applicability: 'All construction work',
      actionRequired: 'Understand limitation periods (6 years contract; 12 years deed)',
      penalty: 'Claims time-barred after limitation period',
      priority: 'medium'
    }
  ];

  return {
    category: 'Contract Law',
    description: 'Legal requirements for construction contracts',
    requirements,
    professionalAdvice: 'Use standard form contracts (JCT, NEC) reviewed by solicitor'
  };
}

// =============================================================================
// INSURANCE REQUIREMENTS
// =============================================================================

function assessInsuranceRequirements(projectDetails: LegalProject): InsuranceRequirements {
  return {
    required: [
      {
        type: 'Public Liability Insurance',
        minimumCover: '£2m - £5m',
        purpose: 'Third party injury or property damage',
        provider: 'Contractor should provide'
      },
      {
        type: 'Employers Liability Insurance',
        minimumCover: '£10m (statutory minimum £5m)',
        purpose: 'Employee injury or illness',
        provider: 'Contractor must have by law'
      },
      {
        type: 'Contract Works Insurance',
        minimumCover: 'Full contract value',
        purpose: 'Damage to works during construction',
        provider: 'Contractor or client per contract'
      }
    ],
    recommended: [
      {
        type: 'Professional Indemnity Insurance',
        minimumCover: '£250k - £1m',
        purpose: 'Design errors and omissions',
        provider: 'Architect/designer should provide'
      },
      {
        type: 'Structural Warranty',
        minimumCover: 'Rebuild cost',
        purpose: '10-year structural defects cover',
        provider: 'NHBC, Premier Guarantee, LABC Warranty'
      },
      {
        type: 'Latent Defects Insurance',
        minimumCover: 'Rebuild cost',
        purpose: 'Hidden defects discovered post-completion',
        provider: 'Specialist insurers'
      }
    ],
    notes: [
      'Verify contractor insurance certificates before work starts',
      'Inform your buildings insurer of construction works',
      'Consider increasing sum insured during construction',
      'Structural warranty required for mortgage on new builds'
    ]
  };
}

// =============================================================================
// COMPLIANCE TIMELINE
// =============================================================================

function generateComplianceTimeline(projectDetails: LegalProject): ComplianceTimeline {
  return {
    preConstruction: [
      { item: 'Title and covenant check', timing: '8-12 weeks before', responsibility: 'Solicitor' },
      { item: 'Pre-application advice', timing: '8-12 weeks before', responsibility: 'Architect' },
      { item: 'Planning application submission', timing: '8-13 weeks before start', responsibility: 'Architect' },
      { item: 'Building control application', timing: '5 days before start', responsibility: 'Contractor/Architect' },
      { item: 'Party wall notices', timing: '1-2 months before', responsibility: 'Party Wall Surveyor' },
      { item: 'CDM notification (if applicable)', timing: 'Before construction starts', responsibility: 'Client/Designer' },
      { item: 'Contract signing', timing: '1-2 weeks before', responsibility: 'Client' }
    ],
    duringConstruction: [
      { item: 'Building control inspections', timing: 'At key stages', responsibility: 'Contractor' },
      { item: 'Structural sign-offs', timing: 'Before covering', responsibility: 'Structural Engineer' },
      { item: 'CDM compliance monitoring', timing: 'Throughout', responsibility: 'Principal Contractor' },
      { item: 'Planning condition discharge', timing: 'As conditions require', responsibility: 'Architect' }
    ],
    postConstruction: [
      { item: 'Building control completion certificate', timing: 'Within weeks of completion', responsibility: 'Building Control' },
      { item: 'Planning compliance verification', timing: 'Post-completion', responsibility: 'Architect' },
      { item: 'Warranty registration', timing: 'At completion', responsibility: 'Contractor/Client' },
      { item: 'Insurance update', timing: 'At completion', responsibility: 'Client' }
    ]
  };
}

// =============================================================================
// PROFESSIONAL APPOINTMENTS
// =============================================================================

function identifyProfessionalAppointments(projectDetails: LegalProject): ProfessionalAppointment[] {
  const appointments: ProfessionalAppointment[] = [
    {
      professional: 'Architect',
      role: 'Design and planning application',
      whenNeeded: 'From project inception',
      estimatedCost: '8-15% of construction cost',
      statutory: false
    },
    {
      professional: 'Structural Engineer',
      role: 'Structural design and calculations',
      whenNeeded: 'Design stage onwards',
      estimatedCost: '£1,500 - £5,000+',
      statutory: true // Required for Building Regs
    },
    {
      professional: 'Building Control',
      role: 'Regulatory approval and inspections',
      whenNeeded: 'Pre-construction',
      estimatedCost: '£500 - £2,000',
      statutory: true
    }
  ];

  if (projectDetails.hasSharedWalls || projectDetails.hasBasement) {
    appointments.push({
      professional: 'Party Wall Surveyor',
      role: 'Party wall notices and awards',
      whenNeeded: '2-3 months before affected works',
      estimatedCost: '£700 - £1,500 per neighbor',
      statutory: true // Under Party Wall Act
    });
  }

  if (projectDetails.isListedBuilding || projectDetails.isConservationArea) {
    appointments.push({
      professional: 'Conservation Architect',
      role: 'Heritage assessment and LBC application',
      whenNeeded: 'From project inception',
      estimatedCost: '10-18% of construction cost',
      statutory: false // But strongly recommended
    });
  }

  if (projectDetails.nearTreesTPO) {
    appointments.push({
      professional: 'Arboriculturist',
      role: 'Tree survey and protection plan',
      whenNeeded: 'Pre-application',
      estimatedCost: '£500 - £1,500',
      statutory: false // But required for planning
    });
  }

  return appointments;
}

// =============================================================================
// RISK ASSESSMENT
// =============================================================================

function assessLegalRisks(projectDetails: LegalProject): LegalRiskAssessment {
  const highRiskAreas: RiskArea[] = [];

  if (projectDetails.isListedBuilding) {
    highRiskAreas.push({
      area: 'Listed Building',
      risk: 'Unauthorized works to listed building',
      consequence: 'Criminal prosecution; requirement to restore',
      mitigation: 'Obtain Listed Building Consent before any works'
    });
  }

  if (projectDetails.hasSharedWalls || projectDetails.hasBasement) {
    highRiskAreas.push({
      area: 'Party Wall',
      risk: 'Proceeding without party wall agreement',
      consequence: 'Injunction stopping works; liability for damages',
      mitigation: 'Serve notices and obtain awards before works'
    });
  }

  highRiskAreas.push({
    area: 'Planning',
    risk: 'Building without permission',
    consequence: 'Enforcement notice; demolition order',
    mitigation: 'Obtain planning permission or lawful development certificate'
  });

  highRiskAreas.push({
    area: 'Building Regulations',
    risk: 'Non-compliant construction',
    consequence: 'Enforcement; difficulty selling; insurance issues',
    mitigation: 'Building Control approval and sign-off'
  });

  return {
    overallRisk: highRiskAreas.length > 3 ? 'High' : 'Medium',
    highRiskAreas,
    mitigationMeasures: [
      'Engage appropriate professionals',
      'Obtain all necessary approvals before works',
      'Document all decisions and approvals',
      'Maintain insurance throughout',
      'Keep records for future reference'
    ]
  };
}

// =============================================================================
// DISCLAIMER
// =============================================================================

function getLegalDisclaimer(): string {
  return `This legal compliance check is for general guidance only and does not constitute legal advice. The requirements listed are not exhaustive and may vary depending on specific circumstances. We strongly recommend consulting qualified legal and professional advisors for advice specific to your project. Laws and regulations are subject to change. This assessment is based on legislation current at the time of generation.`;
}

// =============================================================================
// EXPORTS
// =============================================================================

const legalCompliance = {
  checkLegalCompliance
};

export default legalCompliance;
