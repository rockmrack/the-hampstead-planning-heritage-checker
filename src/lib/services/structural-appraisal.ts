/**
 * Structural Appraisal Service
 * 
 * Provides preliminary structural assessment guidance for residential
 * development projects including extensions, lofts, and basements.
 * 
 * Coverage: NW1-NW11, N2, N6, N10 postcodes
 */

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

interface StructuralProject {
  propertyType?: 'detached' | 'semi_detached' | 'terraced' | 'flat';
  propertyAge?: 'victorian' | 'edwardian' | 'interwar' | 'postwar' | 'modern';
  projectType?: 'extension' | 'loft' | 'basement' | 'internal' | 'new_build';
  constructionType?: 'brick' | 'stone' | 'rendered' | 'concrete' | 'timber_frame';
  stories?: number;
  extensionSize?: 'small' | 'medium' | 'large';
  loadBearingRemoval?: boolean;
  basementDepth?: 'single' | 'double' | 'iceberg';
}

interface StructuralElement {
  element: string;
  assessment: string;
  concerns: string[];
  recommendations: string[];
}

interface FoundationType {
  type: string;
  description: string;
  suitability: string;
  considerations: string[];
}

interface StructuralAnalysis {
  summary: StructuralSummary;
  existingStructure: ExistingStructureAssessment;
  proposedWorks: ProposedWorksAssessment;
  foundationAssessment: FoundationAssessment;
  loadPathAnalysis: LoadPathAnalysis;
  partyWallMatters: PartyWallAssessment;
  temporaryWorks: TemporaryWorksAssessment;
  buildingRegulations: BuildingRegsAssessment;
  riskAssessment: StructuralRiskAssessment;
  conclusion: StructuralConclusion;
  recommendations: string[];
}

interface StructuralSummary {
  complexity: string;
  feasibility: string;
  keyConsiderations: string[];
  engineerRequired: boolean;
}

interface ExistingStructureAssessment {
  description: string;
  propertyAge: string;
  constructionType: string;
  elements: StructuralElement[];
}

interface ProposedWorksAssessment {
  description: string;
  structuralImplications: string[];
  newElements: string[];
  modifications: string[];
}

interface FoundationAssessment {
  description: string;
  existingFoundation: FoundationType;
  proposedFoundation: FoundationType;
  groundConditions: string;
  treeProximity: string;
}

interface LoadPathAnalysis {
  description: string;
  newLoads: string[];
  loadTransfer: string;
  adequacy: string;
}

interface PartyWallAssessment {
  applicable: boolean;
  description: string;
  noticeRequired: string[];
  matters: string[];
}

interface TemporaryWorksAssessment {
  description: string;
  requirements: string[];
  sequence: string[];
}

interface BuildingRegsAssessment {
  description: string;
  structuralCalculations: string;
  approvalRoute: string;
  requirements: string[];
}

interface StructuralRiskAssessment {
  description: string;
  risks: StructuralRisk[];
  overallRisk: string;
}

interface StructuralRisk {
  risk: string;
  likelihood: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
  mitigation: string;
}

interface StructuralConclusion {
  overallAssessment: string;
  feasibility: 'feasible' | 'feasible_with_conditions' | 'requires_investigation';
  conditions: string[];
}

// =============================================================================
// PROPERTY AGE CHARACTERISTICS
// =============================================================================

const PROPERTY_CHARACTERISTICS = {
  victorian: {
    period: '1837-1901',
    walls: 'Solid brick (9" or 13.5")',
    foundations: 'Shallow brick or stone footings',
    floors: 'Suspended timber ground floors',
    roofs: 'Cut timber roof, slates',
    issues: ['Settlement', 'Shallow foundations', 'Damp', 'No DPC']
  },
  edwardian: {
    period: '1901-1910',
    walls: 'Solid brick with decorative features',
    foundations: 'Shallow concrete or brick footings',
    floors: 'Suspended timber or early solid floors',
    roofs: 'Cut timber roof, slates or tiles',
    issues: ['Similar to Victorian', 'Often better construction']
  },
  interwar: {
    period: '1918-1939',
    walls: 'Cavity brick (11")',
    foundations: 'Concrete strip foundations',
    floors: 'Solid concrete or suspended timber',
    roofs: 'Cut timber, tiles',
    issues: ['Early cavity wall ties', 'Sulphate attack in floors']
  },
  postwar: {
    period: '1945-1980',
    walls: 'Cavity brick or non-traditional',
    foundations: 'Strip or trench fill',
    floors: 'Solid concrete',
    roofs: 'Trussed rafters common',
    issues: ['Non-traditional construction', 'RAAC concerns']
  },
  modern: {
    period: '1980-present',
    walls: 'Cavity walls with insulation',
    foundations: 'Strip, trench fill, or piled',
    floors: 'Beam and block or solid',
    roofs: 'Trussed rafters',
    issues: ['Generally compliant with modern standards']
  }
};

// =============================================================================
// MAIN SERVICE FUNCTION
// =============================================================================

async function assessStructure(
  address: string,
  postcode: string,
  projectType: string,
  projectDetails: StructuralProject = {}
): Promise<StructuralAnalysis> {
  const summary = generateSummary(projectType, projectDetails);
  const existingStructure = assessExisting(projectDetails);
  const proposedWorks = assessProposedWorks(projectType, projectDetails);
  const foundationAssessment = assessFoundations(projectDetails);
  const loadPathAnalysis = analyzeLoadPath(projectType, projectDetails);
  const partyWallMatters = assessPartyWall(projectDetails);
  const temporaryWorks = assessTemporaryWorks(projectType, projectDetails);
  const buildingRegulations = assessBuildingRegs(projectType);
  const riskAssessment = assessRisks(projectType, projectDetails);
  const conclusion = generateConclusion(summary, riskAssessment);
  const recommendations = generateRecommendations(projectType, projectDetails);

  return {
    summary,
    existingStructure,
    proposedWorks,
    foundationAssessment,
    loadPathAnalysis,
    partyWallMatters,
    temporaryWorks,
    buildingRegulations,
    riskAssessment,
    conclusion,
    recommendations
  };
}

// =============================================================================
// SUMMARY
// =============================================================================

function generateSummary(
  projectType: string,
  projectDetails: StructuralProject
): StructuralSummary {
  const complexity = projectType === 'basement'
    ? 'High'
    : projectDetails.loadBearingRemoval
      ? 'Medium-High'
      : projectType === 'loft'
        ? 'Medium'
        : 'Low-Medium';

  const considerations: string[] = [];
  if (projectDetails.propertyAge === 'victorian' || projectDetails.propertyAge === 'edwardian') {
    considerations.push('Historic construction methods');
  }
  if (projectType === 'basement') {
    considerations.push('Underpinning/piling required', 'Party wall implications');
  }
  if (projectDetails.loadBearingRemoval) {
    considerations.push('Load-bearing wall removal - steel beam required');
  }
  if (projectType === 'loft') {
    considerations.push('Roof structure modification', 'Floor strengthening');
  }

  return {
    complexity,
    feasibility: 'Feasible subject to detailed design',
    keyConsiderations: considerations,
    engineerRequired: projectType === 'basement' || Boolean(projectDetails.loadBearingRemoval) || projectType === 'loft'
  };
}

// =============================================================================
// EXISTING STRUCTURE ASSESSMENT
// =============================================================================

function assessExisting(projectDetails: StructuralProject): ExistingStructureAssessment {
  const age = projectDetails.propertyAge || 'victorian';
  const characteristics = PROPERTY_CHARACTERISTICS[age];

  const elements: StructuralElement[] = [
    {
      element: 'External walls',
      assessment: characteristics.walls,
      concerns: characteristics.issues.filter(i => i.toLowerCase().includes('wall') || i.toLowerCase().includes('damp')),
      recommendations: ['Survey condition before works', 'Check for movement cracks']
    },
    {
      element: 'Foundations',
      assessment: characteristics.foundations,
      concerns: ['Depth unknown', 'May be affected by trees'],
      recommendations: ['Trial pits to confirm depth and construction']
    },
    {
      element: 'Floors',
      assessment: characteristics.floors,
      concerns: age === 'victorian' || age === 'edwardian' ? ['Timber decay', 'DPC issues'] : [],
      recommendations: ['Assess condition of floor structure']
    },
    {
      element: 'Roof',
      assessment: characteristics.roofs,
      concerns: ['Condition dependent on maintenance'],
      recommendations: ['Survey before loft conversion']
    }
  ];

  return {
    description: 'Assessment of existing structure based on property characteristics',
    propertyAge: `${age.charAt(0).toUpperCase() + age.slice(1)} (${characteristics.period})`,
    constructionType: characteristics.walls,
    elements
  };
}

// =============================================================================
// PROPOSED WORKS ASSESSMENT
// =============================================================================

function assessProposedWorks(
  projectType: string,
  projectDetails: StructuralProject
): ProposedWorksAssessment {
  const implications: string[] = [];
  const newElements: string[] = [];
  const modifications: string[] = [];

  switch (projectType) {
    case 'extension':
      implications.push('New foundations required', 'Connection to existing structure');
      newElements.push('Foundation', 'External walls', 'Roof structure', 'Openings to existing');
      modifications.push('Remove external wall for opening', 'Weather existing wall');
      break;
    case 'loft':
      implications.push('Increased floor loading', 'Roof structure modification');
      newElements.push('Floor joists/steels', 'Dormer structure', 'Stair opening');
      modifications.push('Cut rafters for dormers', 'Strengthen floor joists', 'Form stair opening');
      break;
    case 'basement':
      implications.push('Underpinning required', 'Major structural intervention');
      newElements.push('Underpinning/piled walls', 'Basement slab', 'Waterproofing');
      modifications.push('Excavate below existing', 'Form lightwells', 'Support party walls');
      break;
    case 'internal':
      if (projectDetails.loadBearingRemoval) {
        implications.push('Removal of load-bearing wall');
        newElements.push('Steel beam/lintel', 'Padstones', 'Temporary support');
        modifications.push('Form opening', 'Make good finishes');
      }
      break;
    default:
      implications.push('General structural works');
  }

  return {
    description: 'Structural implications of proposed works',
    structuralImplications: implications,
    newElements,
    modifications
  };
}

// =============================================================================
// FOUNDATION ASSESSMENT
// =============================================================================

function assessFoundations(projectDetails: StructuralProject): FoundationAssessment {
  const age = projectDetails.propertyAge || 'victorian';
  const characteristics = PROPERTY_CHARACTERISTICS[age];

  const existingFoundation: FoundationType = {
    type: characteristics.foundations,
    description: age === 'victorian' || age === 'edwardian'
      ? 'Shallow foundations typical of the period'
      : 'Concrete strip foundations',
    suitability: 'Adequate for original design loads',
    considerations: ['Depth may be inadequate for extensions', 'Tree roots may affect']
  };

  const proposedFoundation: FoundationType = projectDetails.projectType === 'basement'
    ? {
        type: 'Contiguous piled wall / secant piling',
        description: 'Deep foundation system for basement construction',
        suitability: 'Required for basement excavation',
        considerations: ['Party wall implications', 'Ground conditions', 'Access for equipment']
      }
    : {
        type: 'Strip or trench fill foundation',
        description: 'Conventional foundation for extension',
        suitability: 'Suitable for most ground conditions',
        considerations: ['Depth to match existing or deeper', 'Tree proximity']
      };

  return {
    description: 'Foundation assessment for existing and proposed works',
    existingFoundation,
    proposedFoundation,
    groundConditions: 'London Clay - shrinkable clay requiring consideration of tree influence',
    treeProximity: 'NHBC guidelines for foundation depth near trees to be followed'
  };
}

// =============================================================================
// LOAD PATH ANALYSIS
// =============================================================================

function analyzeLoadPath(
  projectType: string,
  projectDetails: StructuralProject
): LoadPathAnalysis {
  const newLoads: string[] = [];

  switch (projectType) {
    case 'loft':
      newLoads.push(
        'Habitable floor loading (1.5 kN/m²)',
        'Dormer structure',
        'Staircase loads'
      );
      break;
    case 'extension':
      newLoads.push(
        'Extension roof and floor loads',
        'Connection to existing walls'
      );
      break;
    case 'basement':
      newLoads.push(
        'Lateral earth pressure on walls',
        'Hydrostatic pressure',
        'Point loads from superstructure'
      );
      break;
    case 'internal':
      if (projectDetails.loadBearingRemoval) {
        newLoads.push('Concentrated loads at beam bearings');
      }
      break;
  }

  return {
    description: 'Analysis of load paths through the structure',
    newLoads,
    loadTransfer: 'Loads to be transferred through new steelwork to adequate bearings',
    adequacy: 'Detailed calculations required to confirm adequacy'
  };
}

// =============================================================================
// PARTY WALL ASSESSMENT
// =============================================================================

function assessPartyWall(projectDetails: StructuralProject): PartyWallAssessment {
  const applicable = projectDetails.propertyType === 'semi_detached' ||
                     projectDetails.propertyType === 'terraced' ||
                     projectDetails.projectType === 'basement';

  const notices: string[] = [];
  const matters: string[] = [];

  if (applicable) {
    notices.push(
      'Section 1 Notice (new wall at boundary)',
      'Section 2 Notice (work to party wall)',
      'Section 6 Notice (excavation near boundary)'
    );
    matters.push(
      'Condition survey of adjoining properties',
      'Engineer specification for party wall works',
      'Potential for award requiring indemnity'
    );
  }

  return {
    applicable,
    description: applicable
      ? 'Party Wall etc. Act 1996 applies to this property'
      : 'Detached property - Party Wall Act less likely to apply',
    noticeRequired: notices,
    matters
  };
}

// =============================================================================
// TEMPORARY WORKS
// =============================================================================

function assessTemporaryWorks(
  projectType: string,
  projectDetails: StructuralProject
): TemporaryWorksAssessment {
  const requirements: string[] = [];
  const sequence: string[] = [];

  if (projectDetails.loadBearingRemoval) {
    requirements.push(
      'Strongboy supports or Acrow props',
      'Needle beams if required',
      'Protection to finishes'
    );
    sequence.push(
      '1. Install temporary support',
      '2. Form opening in stages',
      '3. Install permanent steel',
      '4. Pack and grout bearings',
      '5. Remove temporary support'
    );
  }

  if (projectType === 'basement') {
    requirements.push(
      'Sheet piling or temporary works',
      'Ground anchors if required',
      'Monitoring regime'
    );
    sequence.push(
      '1. Install perimeter piling',
      '2. Excavate in controlled manner',
      '3. Cast slab sections',
      '4. Monitor adjacent structures'
    );
  }

  return {
    description: 'Temporary works required during construction',
    requirements: requirements.length > 0 ? requirements : ['Standard construction practices'],
    sequence: sequence.length > 0 ? sequence : ['Follow contractor method statement']
  };
}

// =============================================================================
// BUILDING REGULATIONS
// =============================================================================

function assessBuildingRegs(projectType: string): BuildingRegsAssessment {
  const requirements: string[] = [
    'Structural calculations to demonstrate compliance',
    'Foundation design to Eurocode 7',
    'Structural steelwork to BS EN 1993'
  ];

  if (projectType === 'basement') {
    requirements.push(
      'Basement waterproofing (BS 8102)',
      'Structural design to BS EN 1992'
    );
  }

  return {
    description: 'Building Regulations structural requirements',
    structuralCalculations: 'Full structural calculations required for Building Control approval',
    approvalRoute: 'Full Plans application recommended for structural works',
    requirements
  };
}

// =============================================================================
// RISK ASSESSMENT
// =============================================================================

function assessRisks(
  projectType: string,
  projectDetails: StructuralProject
): StructuralRiskAssessment {
  const risks: StructuralRisk[] = [];

  if (projectDetails.propertyAge === 'victorian' || projectDetails.propertyAge === 'edwardian') {
    risks.push({
      risk: 'Unknown foundation construction',
      likelihood: 'high',
      impact: 'medium',
      mitigation: 'Trial pit investigation before works commence'
    });
  }

  if (projectType === 'basement') {
    risks.push({
      risk: 'Ground movement affecting neighbors',
      likelihood: 'medium',
      impact: 'high',
      mitigation: 'Robust temporary works design and monitoring'
    });
    risks.push({
      risk: 'Groundwater ingress',
      likelihood: 'medium',
      impact: 'medium',
      mitigation: 'Comprehensive waterproofing strategy'
    });
  }

  if (projectDetails.loadBearingRemoval) {
    risks.push({
      risk: 'Temporary support failure',
      likelihood: 'low',
      impact: 'high',
      mitigation: 'Engineer-designed temporary works, experienced contractor'
    });
  }

  risks.push({
    risk: 'Unforeseen existing conditions',
    likelihood: 'medium',
    impact: 'medium',
    mitigation: 'Contingency allowance in budget and programme'
  });

  return {
    description: 'Structural risk assessment',
    risks,
    overallRisk: projectType === 'basement' ? 'Medium-High' : 'Low-Medium'
  };
}

// =============================================================================
// CONCLUSION
// =============================================================================

function generateConclusion(
  summary: StructuralSummary,
  riskAssessment: StructuralRiskAssessment
): StructuralConclusion {
  return {
    overallAssessment: 'Proposed works are structurally feasible with appropriate design',
    feasibility: riskAssessment.overallRisk === 'Medium-High' ? 'feasible_with_conditions' : 'feasible',
    conditions: [
      'Detailed structural design by chartered engineer',
      'Building Control approval required',
      'Experienced contractor with appropriate insurance'
    ]
  };
}

// =============================================================================
// RECOMMENDATIONS
// =============================================================================

function generateRecommendations(
  projectType: string,
  projectDetails: StructuralProject
): string[] {
  const recommendations = [
    'Engage Chartered Structural Engineer (MIStructE)',
    'Obtain Building Regulations approval before works',
    'Use contractor experienced in this type of work'
  ];

  if (projectDetails.propertyAge === 'victorian' || projectDetails.propertyAge === 'edwardian') {
    recommendations.push('Commission trial pit investigation for foundations');
  }

  if (projectType === 'basement') {
    recommendations.push(
      'Obtain Party Wall Act agreements early',
      'Commission ground investigation',
      'Consider specialist basement contractor'
    );
  }

  if (projectType === 'loft') {
    recommendations.push(
      'Survey roof structure before finalizing design',
      'Confirm floor strengthening requirements'
    );
  }

  return recommendations;
}

// =============================================================================
// EXPORTS
// =============================================================================

const structuralAppraisal = {
  assessStructure,
  PROPERTY_CHARACTERISTICS
};

export default structuralAppraisal;
