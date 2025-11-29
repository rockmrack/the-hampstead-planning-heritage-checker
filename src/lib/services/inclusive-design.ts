/**
 * Inclusive Design Assessment Service
 * 
 * Assesses accessibility and inclusive design considerations for
 * residential developments, ensuring compliance with Part M of
 * Building Regulations and best practice guidance.
 * 
 * Coverage: NW1-NW11, N2, N6, N10 postcodes
 */

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

interface InclusiveDesignProject {
  propertyType?: 'detached' | 'semi_detached' | 'terraced' | 'flat';
  projectType?: 'extension' | 'loft' | 'basement' | 'new_build' | 'conversion';
  newDwellings?: boolean;
  adaptableDesign?: boolean;
  wheelchairAccessible?: boolean;
  existingLevels?: boolean;
  accessRequired?: 'standard' | 'enhanced' | 'wheelchair';
}

interface AccessRoute {
  route: string;
  currentProvision: string;
  requirement: string;
  compliant: boolean;
  recommendations: string[];
}

interface InternalCirculation {
  area: string;
  requirement: string;
  provision: string;
  compliant: boolean;
}

interface SanitaryProvision {
  facility: string;
  requirement: string;
  specification: string;
  location: string;
}

interface InclusiveDesignAnalysis {
  summary: InclusiveSummary;
  applicability: ApplicabilityAssessment;
  externalAccess: ExternalAccessAssessment;
  entranceDesign: EntranceAssessment;
  internalCirculation: InternalCirculationAssessment;
  sanitaryFacilities: SanitaryAssessment;
  futureAdaptability: AdaptabilityAssessment;
  wheelchairProvisions: WheelchairAssessment;
  regulatoryCompliance: InclusiveCompliance[];
  recommendations: string[];
}

interface InclusiveSummary {
  applicableStandard: string;
  accessCategory: string;
  complianceStatus: string;
  keyRequirements: string[];
}

interface ApplicabilityAssessment {
  description: string;
  partMCategory: string;
  triggers: string[];
  exemptions: string[];
}

interface ExternalAccessAssessment {
  description: string;
  routes: AccessRoute[];
  overallCompliance: string;
}

interface EntranceAssessment {
  description: string;
  principalEntrance: EntranceDetail;
  threshold: ThresholdDetail;
  doorWidth: string;
}

interface EntranceDetail {
  location: string;
  levelAccess: boolean;
  doorWidth: string;
  canopy: string;
  lighting: string;
}

interface ThresholdDetail {
  type: string;
  maxStep: string;
  provision: string;
  compliant: boolean;
}

interface InternalCirculationAssessment {
  description: string;
  areas: InternalCirculation[];
  doorwidths: DoorWidthRequirement[];
  levelChanges: LevelChangeAssessment;
}

interface DoorWidthRequirement {
  location: string;
  clearWidth: string;
  requirement: string;
  compliant: boolean;
}

interface LevelChangeAssessment {
  description: string;
  stairs: string;
  lifts: string;
  ramps: string;
}

interface SanitaryAssessment {
  description: string;
  provisions: SanitaryProvision[];
  adaptability: string;
}

interface AdaptabilityAssessment {
  description: string;
  features: AdaptabilityFeature[];
  futureProvisions: string[];
}

interface AdaptabilityFeature {
  feature: string;
  purpose: string;
  provision: string;
}

interface WheelchairAssessment {
  applicable: boolean;
  description: string;
  requirements: string[];
  recommendations: string[];
}

interface InclusiveCompliance {
  regulation: string;
  requirement: string;
  compliance: 'complies' | 'partial' | 'not_applicable' | 'requires_attention';
  notes: string;
}

// =============================================================================
// PART M CATEGORIES
// =============================================================================

const PART_M_CATEGORIES = {
  M4_1: {
    name: 'Category 1 - Visitable dwellings',
    description: 'Reasonable provision for most people to access and use the dwelling',
    triggers: 'All new dwellings (default requirement)'
  },
  M4_2: {
    name: 'Category 2 - Accessible and adaptable dwellings',
    description: 'Reasonable provision for most people to access, use and adapt the dwelling',
    triggers: 'When required by planning condition'
  },
  M4_3: {
    name: 'Category 3 - Wheelchair user dwellings',
    description: 'Wheelchair accessible or wheelchair adaptable dwelling',
    triggers: 'When required by planning condition'
  }
};

// =============================================================================
// MAIN SERVICE FUNCTION
// =============================================================================

async function assessInclusiveDesign(
  address: string,
  postcode: string,
  projectType: string,
  projectDetails: InclusiveDesignProject = {}
): Promise<InclusiveDesignAnalysis> {
  const summary = generateSummary(projectDetails);
  const applicability = assessApplicability(projectType, projectDetails);
  const externalAccess = assessExternalAccess(projectDetails);
  const entranceDesign = assessEntrance(projectDetails);
  const internalCirculation = assessInternalCirculation(projectDetails);
  const sanitaryFacilities = assessSanitaryFacilities(projectDetails);
  const futureAdaptability = assessAdaptability(projectDetails);
  const wheelchairProvisions = assessWheelchairProvisions(projectDetails);
  const regulatoryCompliance = assessCompliance(projectType, projectDetails);
  const recommendations = generateRecommendations(projectType, projectDetails);

  return {
    summary,
    applicability,
    externalAccess,
    entranceDesign,
    internalCirculation,
    sanitaryFacilities,
    futureAdaptability,
    wheelchairProvisions,
    regulatoryCompliance,
    recommendations
  };
}

// =============================================================================
// SUMMARY
// =============================================================================

function generateSummary(projectDetails: InclusiveDesignProject): InclusiveSummary {
  const isNewDwelling = Boolean(projectDetails.newDwellings);
  const wheelchairRequired = projectDetails.accessRequired === 'wheelchair';

  let category = 'M4(1)';
  if (projectDetails.accessRequired === 'enhanced') category = 'M4(2)';
  if (wheelchairRequired) category = 'M4(3)';

  const requirements = ['Level or ramped approach to entrance'];
  if (isNewDwelling) {
    requirements.push(
      'Clear door opening widths',
      'WC at entrance level',
      'Step-free internal circulation (entrance level)'
    );
  }
  if (category === 'M4(2)' || category === 'M4(3)') {
    requirements.push(
      'Potential for future adaptation',
      'Enhanced circulation widths'
    );
  }

  return {
    applicableStandard: `Building Regulations Part M - ${category}`,
    accessCategory: PART_M_CATEGORIES[category.replace('(', '_').replace(')', '') as keyof typeof PART_M_CATEGORIES]?.name || 'Standard access',
    complianceStatus: 'Achievable with design consideration',
    keyRequirements: requirements
  };
}

// =============================================================================
// APPLICABILITY ASSESSMENT
// =============================================================================

function assessApplicability(
  projectType: string,
  projectDetails: InclusiveDesignProject
): ApplicabilityAssessment {
  const isNewDwelling = Boolean(projectDetails.newDwellings);
  const isExtension = projectType === 'extension';
  const isConversion = projectType === 'conversion';

  let category = 'M4(1) - Visitable dwellings (minimum)';
  if (projectDetails.accessRequired === 'enhanced') {
    category = 'M4(2) - Accessible and adaptable dwellings';
  } else if (projectDetails.accessRequired === 'wheelchair') {
    category = 'M4(3) - Wheelchair user dwellings';
  }

  return {
    description: 'Assessment of Part M applicability',
    partMCategory: category,
    triggers: isNewDwelling
      ? ['New dwelling - Part M applies in full']
      : isExtension
        ? ['Extension - reasonable access to new areas', 'No retrospective requirements to existing']
        : isConversion
          ? ['Conversion to dwelling - Part M M4(1) applies where reasonable']
          : ['Alterations - no specific Part M trigger unless creating new dwelling'],
    exemptions: [
      'Historic buildings where compliance would unacceptably alter character',
      'Existing buildings where level access not reasonably practicable'
    ]
  };
}

// =============================================================================
// EXTERNAL ACCESS ASSESSMENT
// =============================================================================

function assessExternalAccess(projectDetails: InclusiveDesignProject): ExternalAccessAssessment {
  const hasLevelIssues = projectDetails.existingLevels === false;

  const routes: AccessRoute[] = [
    {
      route: 'Approach from car parking/drop-off',
      currentProvision: 'Existing driveway/path',
      requirement: 'Level or gently sloping (max 1:20, ideally 1:60)',
      compliant: !hasLevelIssues,
      recommendations: hasLevelIssues
        ? ['Consider regrading approach path', 'Install handrails if gradient >1:20']
        : ['Maintain clear 900mm width', 'Ensure even surface']
    },
    {
      route: 'Path from street/pavement',
      currentProvision: 'Existing front path',
      requirement: 'Firm, even surface; min 900mm wide',
      compliant: true,
      recommendations: ['Avoid loose gravel', 'Provide adequate lighting']
    }
  ];

  return {
    description: 'Assessment of external approach routes',
    routes,
    overallCompliance: routes.every(r => r.compliant)
      ? 'External access routes comply with Part M guidance'
      : 'Some routes require improvement for full compliance'
  };
}

// =============================================================================
// ENTRANCE ASSESSMENT
// =============================================================================

function assessEntrance(projectDetails: InclusiveDesignProject): EntranceAssessment {
  const wheelchairRequired = projectDetails.accessRequired === 'wheelchair';
  const minDoorWidth = wheelchairRequired ? '850mm' : '775mm';

  return {
    description: 'Principal entrance accessibility assessment',
    principalEntrance: {
      location: 'Main front entrance',
      levelAccess: true,
      doorWidth: `Minimum ${minDoorWidth} clear opening`,
      canopy: 'Recommended to provide weather protection at entrance',
      lighting: 'External lighting to entrance recommended'
    },
    threshold: {
      type: 'Level threshold (max 15mm upstand)',
      maxStep: '15mm maximum',
      provision: 'Proprietary level threshold with weather seal',
      compliant: true
    },
    doorWidth: `${minDoorWidth} minimum clear width when door open 90°`
  };
}

// =============================================================================
// INTERNAL CIRCULATION ASSESSMENT
// =============================================================================

function assessInternalCirculation(
  projectDetails: InclusiveDesignProject
): InternalCirculationAssessment {
  const wheelchairRequired = projectDetails.accessRequired === 'wheelchair';
  const enhanced = projectDetails.accessRequired === 'enhanced' || wheelchairRequired;

  const areas: InternalCirculation[] = [
    {
      area: 'Entrance hall',
      requirement: enhanced ? '1200mm x 1200mm min' : '900mm clear width',
      provision: 'Designed to requirement',
      compliant: true
    },
    {
      area: 'Corridors',
      requirement: enhanced ? '1050mm min width' : '900mm min width',
      provision: 'Standard construction achieves requirement',
      compliant: true
    },
    {
      area: 'Turning space',
      requirement: wheelchairRequired ? '1500mm x 1500mm' : 'Not required for M4(1)',
      provision: wheelchairRequired ? 'To be provided' : 'N/A',
      compliant: true
    }
  ];

  const doorwidths: DoorWidthRequirement[] = [
    {
      location: 'Principal entrance',
      clearWidth: wheelchairRequired ? '850mm' : '775mm',
      requirement: 'Part M minimum',
      compliant: true
    },
    {
      location: 'Internal doors (habitable rooms)',
      clearWidth: enhanced ? '800mm' : '750mm',
      requirement: enhanced ? 'M4(2)/M4(3) requirement' : 'Good practice',
      compliant: true
    },
    {
      location: 'Bathroom/WC doors',
      clearWidth: enhanced ? '800mm' : '750mm',
      requirement: enhanced ? 'M4(2)/M4(3) requirement' : 'Part M guidance',
      compliant: true
    }
  ];

  return {
    description: 'Internal circulation space and door widths',
    areas,
    doorwidths,
    levelChanges: {
      description: 'Assessment of internal level changes',
      stairs: 'Existing/new stairs to comply with Part K; consider future stairlift provision',
      lifts: enhanced
        ? 'Space for future through-floor lift should be considered'
        : 'Not required for M4(1); may be retrofitted',
      ramps: 'Internal ramps to max 1:12 with handrails if >300mm rise'
    }
  };
}

// =============================================================================
// SANITARY FACILITIES ASSESSMENT
// =============================================================================

function assessSanitaryFacilities(projectDetails: InclusiveDesignProject): SanitaryAssessment {
  const wheelchairRequired = projectDetails.accessRequired === 'wheelchair';
  const enhanced = projectDetails.accessRequired === 'enhanced' || wheelchairRequired;

  const provisions: SanitaryProvision[] = [
    {
      facility: 'WC at entrance storey',
      requirement: 'Part M - required for new dwellings',
      specification: 'Min 1100mm x 2000mm; outward opening door',
      location: 'Ground floor'
    }
  ];

  if (enhanced) {
    provisions.push({
      facility: 'Potential bathroom adaptation',
      requirement: 'M4(2) - walls capable of supporting grab rails',
      specification: 'Reinforcement to walls around WC and bath/shower',
      location: 'All bathrooms'
    });
  }

  if (wheelchairRequired) {
    provisions.push({
      facility: 'Wheelchair accessible bathroom',
      requirement: 'M4(3) - fully accessible bathroom',
      specification: 'Min 2400mm x 2200mm; level access shower; transfer space',
      location: 'Principal bathroom'
    });
  }

  return {
    description: 'Sanitary accommodation requirements',
    provisions,
    adaptability: enhanced
      ? 'Walls to be capable of supporting grab rails in future'
      : 'Standard provision; adaptable as needs change'
  };
}

// =============================================================================
// ADAPTABILITY ASSESSMENT
// =============================================================================

function assessAdaptability(projectDetails: InclusiveDesignProject): AdaptabilityAssessment {
  const enhanced = projectDetails.accessRequired === 'enhanced' || projectDetails.accessRequired === 'wheelchair';

  const features: AdaptabilityFeature[] = [
    {
      feature: 'Wider doorways',
      purpose: 'Accommodates wheelchair users and mobility aids',
      provision: enhanced ? 'Provided throughout' : 'Consider at key locations'
    },
    {
      feature: 'Reinforced bathroom walls',
      purpose: 'Future installation of grab rails',
      provision: enhanced ? 'Required' : 'Recommended'
    },
    {
      feature: 'Space for stairlift',
      purpose: 'Future mobility aid installation',
      provision: 'Stair width to accommodate (min 850mm clear)'
    },
    {
      feature: 'Through-floor lift space',
      purpose: 'Future lift installation',
      provision: enhanced ? 'Stack of cupboards/space identified' : 'Consider in design'
    }
  ];

  return {
    description: 'Assessment of future adaptability features',
    features,
    futureProvisions: [
      'Design to allow easy adaptation without structural alterations',
      'Consider knock-out panels in floors for future lift installation',
      'Socket heights and switch positions for ease of use',
      'Contrasting colours for visually impaired users'
    ]
  };
}

// =============================================================================
// WHEELCHAIR ASSESSMENT
// =============================================================================

function assessWheelchairProvisions(projectDetails: InclusiveDesignProject): WheelchairAssessment {
  const wheelchairRequired = projectDetails.accessRequired === 'wheelchair';

  return {
    applicable: wheelchairRequired,
    description: wheelchairRequired
      ? 'M4(3) Wheelchair user dwelling requirements apply'
      : 'Wheelchair-specific requirements not triggered; good practice recommended',
    requirements: wheelchairRequired ? [
      'Level access throughout entrance storey',
      'Turning circles in key rooms (1500mm x 1500mm)',
      'Accessible kitchen with lowered worktops',
      'Accessible bathroom with level access shower',
      'Bed space accessible on both sides',
      'Consideration of ceiling track hoist'
    ] : [
      'Level or ramped entrance',
      'WC at entrance level'
    ],
    recommendations: wheelchairRequired ? [
      'Consult with occupational therapist for specific needs',
      'Consider electric door openers',
      'Install accessible controls at appropriate heights'
    ] : [
      'Design for visitability - visitors with wheelchairs can access',
      'Provide ground floor WC accessible to wheelchair users'
    ]
  };
}

// =============================================================================
// REGULATORY COMPLIANCE
// =============================================================================

function assessCompliance(
  projectType: string,
  projectDetails: InclusiveDesignProject
): InclusiveCompliance[] {
  const isNewDwelling = Boolean(projectDetails.newDwellings);
  const compliance: InclusiveCompliance[] = [];

  compliance.push({
    regulation: 'Building Regulations Part M',
    requirement: 'Access to and use of buildings',
    compliance: 'complies',
    notes: `Compliant with M4(1) minimum; ${projectDetails.accessRequired === 'enhanced' ? 'M4(2)' : projectDetails.accessRequired === 'wheelchair' ? 'M4(3)' : 'higher categories'} if required`
  });

  if (isNewDwelling) {
    compliance.push({
      regulation: 'Equality Act 2010',
      requirement: 'Reasonable adjustments for disabled persons',
      compliance: 'complies',
      notes: 'Part M compliance meets reasonable adjustment duties'
    });
  }

  compliance.push({
    regulation: 'Local Plan Policy',
    requirement: 'Accessible and inclusive design',
    compliance: projectDetails.adaptableDesign ? 'complies' : 'partial',
    notes: 'Check local plan for specific percentage of M4(2)/M4(3) required'
  });

  return compliance;
}

// =============================================================================
// RECOMMENDATIONS
// =============================================================================

function generateRecommendations(
  projectType: string,
  projectDetails: InclusiveDesignProject
): string[] {
  const recommendations = [
    'Provide level or gently ramped access to principal entrance',
    'Install level threshold at main entrance',
    'Ensure adequate door widths throughout'
  ];

  if (projectDetails.newDwellings) {
    recommendations.push(
      'Provide WC at entrance storey',
      'Consider future adaptability in bathroom design',
      'Reinforced walls for future grab rail installation'
    );
  }

  if (projectType === 'extension') {
    recommendations.push(
      'Step-free access to extension from main dwelling',
      'Extension doors to meet minimum width requirements'
    );
  }

  if (projectDetails.accessRequired === 'wheelchair') {
    recommendations.push(
      'Consult BS 8300 for detailed wheelchair accessibility guidance',
      'Consider specialist input from occupational therapist',
      'Document accessibility features in design specification'
    );
  }

  return recommendations;
}

// =============================================================================
// EXPORTS
// =============================================================================

const inclusiveDesign = {
  assessInclusiveDesign,
  PART_M_CATEGORIES
};

export default inclusiveDesign;
