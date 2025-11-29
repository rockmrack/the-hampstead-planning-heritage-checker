/**
 * Design Review Panel Service
 * 
 * Simulates design review panel assessment for development proposals in
 * Hampstead and surrounding conservation areas. Evaluates architectural
 * quality, contextual response, and design excellence.
 * 
 * Coverage: NW1-NW11, N2, N6, N10 postcodes
 */

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

interface DesignProject {
  propertyType?: 'detached' | 'semi_detached' | 'terraced' | 'flat' | 'mansion';
  projectType?: 'extension' | 'loft' | 'basement' | 'new_build' | 'refurbishment' | 'conversion';
  architecturalStyle?: 'contemporary' | 'traditional' | 'contextual' | 'mixed';
  materials?: string[];
  height?: number; // meters
  floorArea?: number; // square meters
  isConservationArea?: boolean;
  isListedBuilding?: boolean;
  streetContext?: 'uniform' | 'varied' | 'historic' | 'mixed';
}

interface DesignCriterion {
  criterion: string;
  score: number; // 1-5
  assessment: string;
  recommendations: string[];
}

interface DesignTheme {
  theme: string;
  description: string;
  criteria: DesignCriterion[];
  overallScore: number;
}

interface PanelMember {
  role: string;
  expertise: string;
  keyObservations: string[];
}

interface DesignReviewAssessment {
  summary: ReviewSummary;
  contextAnalysis: ContextAnalysis;
  designThemes: DesignTheme[];
  materialsPalette: MaterialsAssessment;
  sustainabilityReview: SustainabilityReview;
  accessibilityReview: AccessibilityReview;
  panelObservations: PanelMember[];
  overallVerdict: DesignVerdict;
  conditionsRecommended: string[];
  bestPracticeGuidance: string[];
}

interface ReviewSummary {
  overallScore: number;
  scoreInterpretation: string;
  keyStrengths: string[];
  areasForImprovement: string[];
  recommendation: string;
}

interface ContextAnalysis {
  siteDescription: string;
  surroundingCharacter: string;
  designOpportunities: string[];
  designConstraints: string[];
  contextualResponse: string;
}

interface MaterialsAssessment {
  proposedMaterials: MaterialItem[];
  overallAppropriateness: string;
  recommendations: string[];
}

interface MaterialItem {
  material: string;
  application: string;
  appropriateness: 'excellent' | 'good' | 'acceptable' | 'poor';
  notes: string;
}

interface SustainabilityReview {
  score: number;
  strengths: string[];
  opportunities: string[];
  requirements: string[];
}

interface AccessibilityReview {
  score: number;
  compliance: string;
  recommendations: string[];
}

interface DesignVerdict {
  verdict: 'support' | 'support_with_changes' | 'defer' | 'not_supported';
  reasoning: string;
  essentialChanges: string[];
  desirableChanges: string[];
}

// =============================================================================
// DESIGN QUALITY STANDARDS
// =============================================================================

const DESIGN_CRITERIA = {
  contextualResponse: {
    weight: 0.25,
    description: 'How well the design responds to its surroundings'
  },
  architecturalQuality: {
    weight: 0.25,
    description: 'Overall quality and coherence of architectural design'
  },
  materiality: {
    weight: 0.15,
    description: 'Quality and appropriateness of proposed materials'
  },
  amenity: {
    weight: 0.15,
    description: 'Quality of living/working environment created'
  },
  sustainability: {
    weight: 0.10,
    description: 'Environmental and energy performance'
  },
  accessibility: {
    weight: 0.10,
    description: 'Inclusive design and accessibility'
  }
};

// =============================================================================
// MAIN SERVICE FUNCTION
// =============================================================================

async function conductDesignReview(
  address: string,
  postcode: string,
  projectType: string,
  projectDetails: DesignProject = {}
): Promise<DesignReviewAssessment> {
  const contextAnalysis = analyzeContext(address, postcode, projectDetails);
  const designThemes = assessDesignThemes(projectType, projectDetails);
  const materialsPalette = assessMaterials(projectDetails);
  const sustainabilityReview = assessSustainability(projectDetails);
  const accessibilityReview = assessAccessibility(projectDetails);
  const panelObservations = generatePanelObservations(projectType, projectDetails);
  const overallVerdict = determineVerdict(designThemes, projectDetails);
  const summary = generateReviewSummary(designThemes, overallVerdict);
  const conditionsRecommended = recommendConditions(projectDetails);
  const bestPracticeGuidance = provideBestPractice(projectType, projectDetails);

  return {
    summary,
    contextAnalysis,
    designThemes,
    materialsPalette,
    sustainabilityReview,
    accessibilityReview,
    panelObservations,
    overallVerdict,
    conditionsRecommended,
    bestPracticeGuidance
  };
}

// =============================================================================
// CONTEXT ANALYSIS
// =============================================================================

function analyzeContext(
  address: string,
  postcode: string,
  projectDetails: DesignProject
): ContextAnalysis {
  const isConservation = Boolean(projectDetails.isConservationArea);
  const isListed = Boolean(projectDetails.isListedBuilding);
  const streetContext = projectDetails.streetContext || 'varied';

  return {
    siteDescription: `${projectDetails.propertyType || 'Residential'} property in ${isConservation ? 'conservation area' : 'established residential area'}`,
    surroundingCharacter: getSurroundingCharacter(streetContext, isConservation),
    designOpportunities: [
      'Opportunity to enhance streetscene through quality design',
      'Potential to improve energy performance of existing building',
      'Scope for high-quality contemporary intervention if sensitively handled',
      'Garden/landscape as part of overall design concept'
    ],
    designConstraints: [
      ...(isConservation ? ['Conservation area character to be preserved/enhanced'] : []),
      ...(isListed ? ['Listed building fabric to be respected'] : []),
      'Neighboring amenity to be protected',
      'Scale and massing appropriate to context',
      'Materials palette to complement surroundings'
    ],
    contextualResponse: isConservation
      ? 'Design must preserve or enhance the character of the conservation area'
      : 'Design should respect the established character while allowing appropriate evolution'
  };
}

function getSurroundingCharacter(streetContext: string, isConservation: boolean): string {
  const descriptions: Record<string, string> = {
    uniform: 'Consistent architectural character with similar building types, materials, and proportions',
    varied: 'Mixed architectural character with variety of building styles and periods',
    historic: 'Predominantly historic buildings with strong period character',
    mixed: 'Combination of historic and modern buildings creating layered character'
  };
  return descriptions[streetContext] || descriptions['varied'] || 'Mixed architectural character';
}

// =============================================================================
// DESIGN THEMES ASSESSMENT
// =============================================================================

function assessDesignThemes(
  projectType: string,
  projectDetails: DesignProject
): DesignTheme[] {
  return [
    {
      theme: 'Contextual Response',
      description: 'How the design relates to its surroundings',
      criteria: [
        {
          criterion: 'Scale and massing',
          score: 4,
          assessment: 'Appropriate scale in relation to host building and neighbors',
          recommendations: ['Ensure subordinate relationship to main building']
        },
        {
          criterion: 'Streetscene impact',
          score: 4,
          assessment: 'Limited impact on public views; respectful addition',
          recommendations: ['Consider views from key vantage points']
        },
        {
          criterion: 'Relationship to neighbors',
          score: 3,
          assessment: 'Generally respectful but some aspects require refinement',
          recommendations: ['Review impact on immediate neighbors', 'Consider setbacks']
        }
      ],
      overallScore: 3.7
    },
    {
      theme: 'Architectural Quality',
      description: 'Overall design quality and coherence',
      criteria: [
        {
          criterion: 'Design concept',
          score: 4,
          assessment: 'Clear design rationale with coherent approach',
          recommendations: ['Strengthen connection between old and new']
        },
        {
          criterion: 'Proportions and composition',
          score: 4,
          assessment: 'Well-proportioned design with balanced composition',
          recommendations: ['Refine window proportions for better rhythm']
        },
        {
          criterion: 'Detailing',
          score: 3,
          assessment: 'Good overall but detailing requires development',
          recommendations: ['Develop junction details', 'Consider reveals and depth']
        }
      ],
      overallScore: 3.7
    },
    {
      theme: 'Materiality',
      description: 'Quality and appropriateness of materials',
      criteria: [
        {
          criterion: 'Material selection',
          score: projectDetails.isConservationArea ? 4 : 3,
          assessment: 'Materials generally appropriate to context',
          recommendations: ['Submit material samples for approval', 'Consider aging and weathering']
        },
        {
          criterion: 'Color and texture',
          score: 4,
          assessment: 'Sensitive approach to color palette',
          recommendations: ['Ensure consistency with area character']
        }
      ],
      overallScore: 3.5
    },
    {
      theme: 'Residential Amenity',
      description: 'Quality of internal and external spaces',
      criteria: [
        {
          criterion: 'Internal layout',
          score: 4,
          assessment: 'Functional layout with good natural light',
          recommendations: ['Maximize daylight to principal rooms']
        },
        {
          criterion: 'External amenity',
          score: 4,
          assessment: 'Good provision of outdoor space',
          recommendations: ['Consider privacy of outdoor areas']
        },
        {
          criterion: 'Neighbor amenity',
          score: 3,
          assessment: 'Some impact on neighbors requiring mitigation',
          recommendations: ['Review daylight/sunlight impact', 'Address overlooking']
        }
      ],
      overallScore: 3.7
    }
  ];
}

// =============================================================================
// MATERIALS ASSESSMENT
// =============================================================================

function assessMaterials(projectDetails: DesignProject): MaterialsAssessment {
  const isConservation = Boolean(projectDetails.isConservationArea);
  const style = projectDetails.architecturalStyle || 'contextual';

  const proposedMaterials: MaterialItem[] = [
    {
      material: 'London stock brick',
      application: 'External walls',
      appropriateness: 'excellent',
      notes: 'Traditional material well-suited to Hampstead context'
    },
    {
      material: 'Natural slate',
      application: 'Roofing',
      appropriateness: 'excellent',
      notes: 'High-quality roofing material appropriate to conservation area'
    },
    {
      material: 'Painted timber',
      application: 'Windows and doors',
      appropriateness: 'excellent',
      notes: 'Traditional material; ensure appropriate profile'
    },
    {
      material: 'Zinc cladding',
      application: 'Extension roof/dormer',
      appropriateness: style === 'contemporary' ? 'good' : 'acceptable',
      notes: 'Contemporary material; quality of detailing crucial'
    },
    {
      material: 'Structural glazing',
      application: 'Rear elevation',
      appropriateness: isConservation ? 'acceptable' : 'good',
      notes: 'Modern intervention; ensure not visible from public realm'
    }
  ];

  return {
    proposedMaterials,
    overallAppropriateness: isConservation ? 'Generally appropriate with some refinement needed' : 'Good palette of materials',
    recommendations: [
      'Submit samples of all external materials before ordering',
      'Provide mock-up panel for brick and pointing',
      'Specify window profiles including section drawings',
      'Consider maintenance and longevity of materials'
    ]
  };
}

// =============================================================================
// SUSTAINABILITY REVIEW
// =============================================================================

function assessSustainability(projectDetails: DesignProject): SustainabilityReview {
  return {
    score: 3.5,
    strengths: [
      'Improved thermal performance over existing building',
      'Potential for renewable energy integration',
      'Daylighting strategy reduces energy demand',
      'Water efficiency measures achievable'
    ],
    opportunities: [
      'Air source heat pump installation',
      'Solar PV on suitable roof areas',
      'Green/brown roof on flat roof areas',
      'Rainwater harvesting for garden irrigation',
      'Electric vehicle charging provision'
    ],
    requirements: [
      'Achieve Part L 2021 Building Regulations',
      'Provide SAP calculations',
      'Consider whole-life carbon assessment',
      'Submit energy statement with application'
    ]
  };
}

// =============================================================================
// ACCESSIBILITY REVIEW
// =============================================================================

function assessAccessibility(projectDetails: DesignProject): AccessibilityReview {
  const isNewBuild = projectDetails.projectType === 'new_build';

  return {
    score: isNewBuild ? 4 : 3,
    compliance: isNewBuild
      ? 'Part M4(1) compliance required as minimum; M4(2) accessible and adaptable recommended'
      : 'Improvements to accessibility encouraged where feasible',
    recommendations: [
      'Level or ramped approach to principal entrance',
      'Step-free access through ground floor',
      'Wider doorways where alterations permit',
      'Accessible WC on ground floor',
      'Consider future adaptability'
    ]
  };
}

// =============================================================================
// PANEL OBSERVATIONS
// =============================================================================

function generatePanelObservations(
  projectType: string,
  projectDetails: DesignProject
): PanelMember[] {
  return [
    {
      role: 'Chair - Conservation Architect',
      expertise: 'Historic buildings and conservation',
      keyObservations: [
        'The design approach demonstrates understanding of the historic context',
        'Junction between old and new requires careful detailing',
        'Materials palette generally appropriate',
        'Recommend further development of heritage statement'
      ]
    },
    {
      role: 'Architect Member',
      expertise: 'Contemporary residential design',
      keyObservations: [
        'Design concept is clear and well-articulated',
        'Internal planning works well with good natural light',
        'External proportions successful',
        'Detailing needs further resolution particularly at eaves and junctions'
      ]
    },
    {
      role: 'Planning Advisor',
      expertise: 'Development management and policy',
      keyObservations: [
        'Proposal generally complies with development plan policies',
        'Impact on neighbors requires further assessment',
        'Pre-application advice should be sought',
        'Conditions likely regarding materials and landscaping'
      ]
    },
    {
      role: 'Urban Designer',
      expertise: 'Streetscape and public realm',
      keyObservations: [
        'Limited impact on streetscene from public views',
        'Relationship with garden and landscape important',
        'Consider long-distance views',
        'Boundary treatment integral to success'
      ]
    }
  ];
}

// =============================================================================
// VERDICT DETERMINATION
// =============================================================================

function determineVerdict(
  designThemes: DesignTheme[],
  projectDetails: DesignProject
): DesignVerdict {
  const averageScore = designThemes.reduce((sum, theme) => sum + theme.overallScore, 0) / designThemes.length;

  if (averageScore >= 4.0) {
    return {
      verdict: 'support',
      reasoning: 'The design demonstrates high quality and responds well to its context',
      essentialChanges: [],
      desirableChanges: ['Minor refinements to detailing as discussed']
    };
  } else if (averageScore >= 3.5) {
    return {
      verdict: 'support_with_changes',
      reasoning: 'The design is generally supportable but requires modifications before approval',
      essentialChanges: [
        'Address impact on neighboring amenity',
        'Refine material specifications',
        'Develop junction details further'
      ],
      desirableChanges: [
        'Consider enhanced sustainability measures',
        'Improve accessibility where feasible',
        'Strengthen landscape design'
      ]
    };
  } else if (averageScore >= 3.0) {
    return {
      verdict: 'defer',
      reasoning: 'The design requires significant revision before the panel can offer support',
      essentialChanges: [
        'Fundamental review of scale and massing',
        'Reconsider contextual response',
        'Develop design rationale further',
        'Address neighbor impacts comprehensively'
      ],
      desirableChanges: []
    };
  } else {
    return {
      verdict: 'not_supported',
      reasoning: 'The design does not meet the quality standards expected in this location',
      essentialChanges: [
        'Complete redesign recommended',
        'Engage conservation architect',
        'Return to first principles'
      ],
      desirableChanges: []
    };
  }
}

// =============================================================================
// REVIEW SUMMARY
// =============================================================================

function generateReviewSummary(
  designThemes: DesignTheme[],
  verdict: DesignVerdict
): ReviewSummary {
  const averageScore = designThemes.reduce((sum, theme) => sum + theme.overallScore, 0) / designThemes.length;

  const interpretations: Record<string, string> = {
    '5': 'Exceptional - exemplary design',
    '4': 'Good - high quality design',
    '3': 'Acceptable - satisfactory design',
    '2': 'Poor - requires significant improvement',
    '1': 'Unacceptable - fundamental issues'
  };

  return {
    overallScore: Math.round(averageScore * 10) / 10,
    scoreInterpretation: interpretations[Math.round(averageScore).toString()] || 'Acceptable',
    keyStrengths: [
      'Clear design concept',
      'Appropriate scale',
      'Quality materials proposed',
      'Good internal layout'
    ],
    areasForImprovement: [
      'Junction detailing',
      'Neighbor impact mitigation',
      'Sustainability measures',
      'Landscape integration'
    ],
    recommendation: verdict.verdict === 'support'
      ? 'Proceed to planning application'
      : verdict.verdict === 'support_with_changes'
        ? 'Address essential changes before submission'
        : 'Significant revision required before resubmission'
  };
}

// =============================================================================
// CONDITIONS RECOMMENDED
// =============================================================================

function recommendConditions(projectDetails: DesignProject): string[] {
  const conditions = [
    'Materials samples to be approved before ordering',
    'Large-scale details (1:20) of key junctions to be approved',
    'Window and door sections to be approved',
    'Landscaping scheme to be approved and implemented'
  ];

  if (projectDetails.isConservationArea) {
    conditions.push('Heritage interpretation panel/method statement required');
  }

  if (projectDetails.projectType === 'new_build') {
    conditions.push('Sustainability statement demonstrating Part L compliance');
    conditions.push('Accessible and adaptable dwellings statement');
  }

  return conditions;
}

// =============================================================================
// BEST PRACTICE GUIDANCE
// =============================================================================

function provideBestPractice(
  projectType: string,
  projectDetails: DesignProject
): string[] {
  return [
    'Engage with a quality architect experienced in conservation areas',
    'Invest in quality materials - they define the success of a project',
    'Consider the building holistically, not just the extension',
    'Think about how the building will age and weather',
    'Develop details early - junctions are where quality shows',
    'Landscape design is integral, not an afterthought',
    'Photography and visualizations help communicate design intent',
    'Pre-application advice is valuable - use it',
    'Quality costs more upfront but adds value long-term',
    'Consider commissioning a design and access statement'
  ];
}

// =============================================================================
// EXPORTS
// =============================================================================

const designReview = {
  conductDesignReview,
  DESIGN_CRITERIA
};

export default designReview;
