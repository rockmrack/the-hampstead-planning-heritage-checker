/**
 * Heritage Impact Statement Service
 * 
 * Generates comprehensive heritage impact statements for planning applications
 * affecting listed buildings, conservation areas, and heritage assets in
 * Hampstead and surrounding areas.
 * 
 * Coverage: NW1-NW11, N2, N6, N10 postcodes
 */

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

interface HeritageProject {
  propertyType?: 'detached' | 'semi_detached' | 'terraced' | 'flat' | 'mansion';
  projectType?: 'extension' | 'loft' | 'basement' | 'refurbishment' | 'alteration' | 'restoration';
  listingGrade?: 'I' | 'II*' | 'II' | 'none';
  isConservationArea?: boolean;
  conservationAreaName?: string;
  nearListedBuilding?: boolean;
  affectsCharacterFeatures?: boolean;
  proposedWorks?: string[];
  buildingAge?: string;
  architecturalStyle?: string;
}

interface HeritageSignificance {
  level: 'exceptional' | 'high' | 'medium' | 'low';
  summary: string;
  historicalInterest: SignificanceAssessment;
  architecturalInterest: SignificanceAssessment;
  archaeologicalInterest: SignificanceAssessment;
  artisticInterest: SignificanceAssessment;
  settingContribution: SignificanceAssessment;
}

interface SignificanceAssessment {
  present: boolean;
  level: 'high' | 'medium' | 'low' | 'none';
  description: string;
  keyElements: string[];
}

interface HeritageImpact {
  element: string;
  significance: string;
  proposedChange: string;
  impact: 'beneficial' | 'neutral' | 'minor_adverse' | 'moderate_adverse' | 'substantial_adverse';
  justification: string;
  mitigation: string;
}

interface PolicyAssessment {
  policy: string;
  requirement: string;
  compliance: 'complies' | 'partial' | 'does_not_comply';
  explanation: string;
}

interface HeritageImpactAssessment {
  summary: HeritageSummary;
  siteHistory: SiteHistory;
  significance: HeritageSignificance;
  impactAssessment: HeritageImpact[];
  conservationAreaAssessment: ConservationAreaAssessment;
  settingAssessment: SettingAssessment;
  policyCompliance: PolicyAssessment[];
  justification: Justification;
  mitigationMeasures: MitigationMeasures;
  conclusion: HeritageConclusion;
  recommendations: string[];
}

interface HeritageSummary {
  heritageStatus: string;
  overallSignificance: string;
  overallImpact: string;
  policyCompliance: string;
  recommendedOutcome: string;
}

interface SiteHistory {
  buildingDate: string;
  architecturalStyle: string;
  historicalDevelopment: string[];
  previousAlterations: string[];
  historicalSignificance: string;
  sources: string[];
}

interface ConservationAreaAssessment {
  areaName: string;
  characterSummary: string;
  specialInterest: string[];
  contributionOfSite: string;
  impactOnArea: string;
  preserveOrEnhance: string;
}

interface SettingAssessment {
  settingDescription: string;
  keyViews: string[];
  contributionToSignificance: string;
  impactOnSetting: string;
}

interface Justification {
  publicBenefit: string[];
  heritageBalance: string;
  alternativesConsidered: string[];
  designRationale: string;
}

interface MitigationMeasures {
  design: string[];
  construction: string[];
  recording: string[];
  restoration: string[];
}

interface HeritageConclusion {
  overallAssessment: string;
  harmLevel: string;
  publicBenefitBalance: string;
  recommendation: string;
}

// =============================================================================
// CONSERVATION AREA DATA
// =============================================================================

const HAMPSTEAD_CONSERVATION_AREAS = {
  'Hampstead': {
    designation: '1968',
    character: 'Historic village character with literary and artistic associations',
    specialInterest: [
      'Medieval street pattern',
      'Georgian and Victorian architecture',
      'Association with Hampstead Heath',
      'Artistic and literary heritage'
    ]
  },
  'Hampstead Garden Suburb': {
    designation: '1968',
    character: 'Planned garden suburb with unified design philosophy',
    specialInterest: [
      'Arts and Crafts architecture',
      'Unified streetscape',
      'Generous gardens',
      'Traffic-free squares'
    ]
  },
  'South Hill Park': {
    designation: '1974',
    character: 'Victorian villa development with mature gardens',
    specialInterest: [
      'Large Victorian villas',
      'Mature landscape setting',
      'Proximity to Heath'
    ]
  },
  'Belsize': {
    designation: '1972',
    character: 'Victorian and Edwardian residential development',
    specialInterest: [
      'Victorian terraces and villas',
      'Tree-lined streets',
      'Architectural variety within consistency'
    ]
  }
};

// =============================================================================
// MAIN SERVICE FUNCTION
// =============================================================================

async function generateHeritageStatement(
  address: string,
  postcode: string,
  projectType: string,
  projectDetails: HeritageProject = {}
): Promise<HeritageImpactAssessment> {
  const summary = generateHeritageSummary(projectDetails);
  const siteHistory = researchSiteHistory(address, projectDetails);
  const significance = assessSignificance(projectDetails);
  const impactAssessment = assessImpacts(projectType, projectDetails);
  const conservationAreaAssessment = assessConservationArea(projectDetails);
  const settingAssessment = assessSetting(projectDetails);
  const policyCompliance = assessPolicyCompliance(projectDetails);
  const justification = developJustification(projectType, projectDetails);
  const mitigationMeasures = proposeMitigation(projectDetails);
  const conclusion = generateConclusion(impactAssessment, justification);
  const recommendations = generateRecommendations(projectDetails);

  return {
    summary,
    siteHistory,
    significance,
    impactAssessment,
    conservationAreaAssessment,
    settingAssessment,
    policyCompliance,
    justification,
    mitigationMeasures,
    conclusion,
    recommendations
  };
}

// =============================================================================
// HERITAGE SUMMARY
// =============================================================================

function generateHeritageSummary(projectDetails: HeritageProject): HeritageSummary {
  const isListed = projectDetails.listingGrade && projectDetails.listingGrade !== 'none';
  const isConservation = Boolean(projectDetails.isConservationArea);

  let heritageStatus = 'Non-designated heritage asset';
  if (isListed) {
    heritageStatus = `Grade ${projectDetails.listingGrade} Listed Building`;
  } else if (isConservation) {
    heritageStatus = `Building within ${projectDetails.conservationAreaName || 'Conservation Area'}`;
  }

  return {
    heritageStatus,
    overallSignificance: isListed ? 'High - statutory protection' : isConservation ? 'Medium - conservation area context' : 'Low',
    overallImpact: 'Minor adverse to neutral - subject to detailed assessment',
    policyCompliance: 'Generally compliant with mitigation measures',
    recommendedOutcome: isListed ? 'Approval with conditions' : 'Approval subject to appropriate design'
  };
}

// =============================================================================
// SITE HISTORY
// =============================================================================

function researchSiteHistory(address: string, projectDetails: HeritageProject): SiteHistory {
  const buildingAge = projectDetails.buildingAge || 'Late Victorian (c.1890)';
  const style = projectDetails.architecturalStyle || 'Victorian domestic';

  return {
    buildingDate: buildingAge,
    architecturalStyle: style,
    historicalDevelopment: [
      'Original construction as part of late Victorian development',
      'Typical speculative housing of the period',
      'Part of expansion of Hampstead following railway connection',
      'Designed for middle-class occupancy'
    ],
    previousAlterations: [
      'Replacement windows (date unknown)',
      'Rear addition (possibly mid-20th century)',
      'Internal modernization',
      'Garden outbuildings added'
    ],
    historicalSignificance: 'The building forms part of the historic fabric of the area, contributing to the consistent character of the streetscape while representing typical domestic architecture of its period.',
    sources: [
      'Historic England List Entry (if applicable)',
      'Conservation Area Character Appraisal',
      'Historic OS maps',
      'Local history archives',
      'Site inspection'
    ]
  };
}

// =============================================================================
// SIGNIFICANCE ASSESSMENT
// =============================================================================

function assessSignificance(projectDetails: HeritageProject): HeritageSignificance {
  const isListed = projectDetails.listingGrade && projectDetails.listingGrade !== 'none';
  const isConservation = Boolean(projectDetails.isConservationArea);

  let level: HeritageSignificance['level'] = 'low';
  if (isListed && projectDetails.listingGrade === 'I') level = 'exceptional';
  else if (isListed) level = 'high';
  else if (isConservation) level = 'medium';

  return {
    level,
    summary: `The building has ${level} heritage significance as ${isListed ? `a Grade ${projectDetails.listingGrade} listed building` : isConservation ? 'a building within the conservation area' : 'an undesignated heritage asset'}`,
    historicalInterest: {
      present: true,
      level: isListed ? 'high' : 'medium',
      description: 'The building illustrates the historical development of Hampstead as a residential area',
      keyElements: [
        'Original construction date and method',
        'Evidence of historical use',
        'Relationship to wider development pattern',
        'Association with area history'
      ]
    },
    architecturalInterest: {
      present: true,
      level: isListed ? 'high' : 'medium',
      description: 'The building demonstrates typical architectural features of its period',
      keyElements: [
        'Original facade composition',
        'Window proportions and details',
        'Roofscape and chimneys',
        'Original interior features (if applicable)'
      ]
    },
    archaeologicalInterest: {
      present: false,
      level: 'low',
      description: 'No significant archaeological interest identified',
      keyElements: []
    },
    artisticInterest: {
      present: Boolean(isListed),
      level: isListed ? 'medium' : 'low',
      description: isListed ? 'Craftsmanship evident in original features' : 'Limited artistic interest',
      keyElements: isListed ? ['Decorative elements', 'Original joinery', 'Plasterwork'] : []
    },
    settingContribution: {
      present: true,
      level: 'medium',
      description: 'The building contributes to the character of the streetscape',
      keyElements: [
        'Consistent building line',
        'Contribution to street rhythm',
        'Relationship with neighboring properties',
        'Garden setting'
      ]
    }
  };
}

// =============================================================================
// IMPACT ASSESSMENT
// =============================================================================

function assessImpacts(
  projectType: string,
  projectDetails: HeritageProject
): HeritageImpact[] {
  const impacts: HeritageImpact[] = [];

  // External alterations
  impacts.push({
    element: 'Principal elevation',
    significance: 'High - primary public face of the building',
    proposedChange: 'No alterations proposed to front elevation',
    impact: 'neutral',
    justification: 'Front elevation retained without change',
    mitigation: 'N/A - no impact'
  });

  // Rear extension
  if (projectType === 'extension') {
    impacts.push({
      element: 'Rear elevation',
      significance: 'Medium - less prominent but contributes to character',
      proposedChange: 'New extension to rear',
      impact: 'minor_adverse',
      justification: 'Extension designed to be subordinate and reversible',
      mitigation: 'High-quality materials; lightweight connection; sympathetic scale'
    });

    impacts.push({
      element: 'Garden and setting',
      significance: 'Medium - contributes to spacious character',
      proposedChange: 'Reduction in garden area',
      impact: 'minor_adverse',
      justification: 'Majority of garden retained; improved relationship between house and garden',
      mitigation: 'Quality landscaping; retention of mature planting'
    });
  }

  // Roof alterations
  if (projectType === 'loft') {
    impacts.push({
      element: 'Roofscape',
      significance: 'High - visible and contributes to streetscene',
      proposedChange: 'Rear dormer and rooflights',
      impact: projectDetails.isConservationArea ? 'moderate_adverse' : 'minor_adverse',
      justification: 'Dormer to rear only; rooflights to front conservation style',
      mitigation: 'Dormer set back from eaves; traditional materials; flush rooflights'
    });
  }

  // Basement
  if (projectType === 'basement') {
    impacts.push({
      element: 'Below-ground fabric',
      significance: projectDetails.listingGrade ? 'High - listed fabric extends below ground' : 'Low',
      proposedChange: 'New basement excavation',
      impact: 'minor_adverse',
      justification: 'Careful methodology; structural monitoring; no impact on significant fabric',
      mitigation: 'Archaeological watching brief; structural methodology; phased construction'
    });
  }

  // Interior
  impacts.push({
    element: 'Interior layout and features',
    significance: projectDetails.listingGrade ? 'High - original features protected' : 'Low',
    proposedChange: 'Internal alterations and modernization',
    impact: projectDetails.listingGrade ? 'minor_adverse' : 'neutral',
    justification: 'Works to non-significant areas; original features retained',
    mitigation: 'Survey of interior features; protection during works; specialist repair'
  });

  return impacts;
}

// =============================================================================
// CONSERVATION AREA ASSESSMENT
// =============================================================================

function assessConservationArea(projectDetails: HeritageProject): ConservationAreaAssessment {
  const areaName = projectDetails.conservationAreaName || 'Hampstead';
  const areaData = HAMPSTEAD_CONSERVATION_AREAS[areaName as keyof typeof HAMPSTEAD_CONSERVATION_AREAS] ||
    HAMPSTEAD_CONSERVATION_AREAS['Hampstead'];

  return {
    areaName: `${areaName} Conservation Area`,
    characterSummary: areaData.character,
    specialInterest: areaData.specialInterest,
    contributionOfSite: 'The property makes a positive contribution to the conservation area through its scale, materials, and relationship to neighbors',
    impactOnArea: 'The proposed works would have a neutral to minor impact on the character of the conservation area',
    preserveOrEnhance: 'The proposals would preserve the character and appearance of the conservation area. The high-quality design and materials would ensure the works are sympathetic to the established character.'
  };
}

// =============================================================================
// SETTING ASSESSMENT
// =============================================================================

function assessSetting(projectDetails: HeritageProject): SettingAssessment {
  const isListed = projectDetails.listingGrade && projectDetails.listingGrade !== 'none';
  const nearListed = Boolean(projectDetails.nearListedBuilding);

  return {
    settingDescription: 'The property is set within a predominantly residential area characterized by consistent building lines, mature gardens, and tree-lined streets',
    keyViews: [
      'Views from the public highway',
      'Views from neighboring properties',
      isListed || nearListed ? 'Views toward/from nearby listed buildings' : 'General streetscene views'
    ],
    contributionToSignificance: 'The setting makes a positive contribution to the significance of the heritage assets through the consistent character and mature landscape',
    impactOnSetting: 'The proposed works would have minimal impact on the setting of heritage assets. The works are predominantly to the rear and would not be visible from the principal public views.'
  };
}

// =============================================================================
// POLICY COMPLIANCE
// =============================================================================

function assessPolicyCompliance(projectDetails: HeritageProject): PolicyAssessment[] {
  const isListed = projectDetails.listingGrade && projectDetails.listingGrade !== 'none';
  const isConservation = Boolean(projectDetails.isConservationArea);

  const policies: PolicyAssessment[] = [
    {
      policy: 'NPPF Chapter 16 - Conserving and Enhancing the Historic Environment',
      requirement: 'Great weight to conservation of designated heritage assets',
      compliance: 'complies',
      explanation: 'The proposals have been designed to minimize harm and respond to significance'
    },
    {
      policy: 'NPPF Paragraph 199',
      requirement: 'Sustain and enhance significance of heritage assets',
      compliance: 'partial',
      explanation: 'Minor harm identified but outweighed by benefits and mitigated through design'
    }
  ];

  if (isListed) {
    policies.push({
      policy: 'Planning (Listed Buildings and Conservation Areas) Act 1990 s.16',
      requirement: 'Special regard to desirability of preserving listed building',
      compliance: 'complies',
      explanation: 'Design respects and preserves the special interest of the listed building'
    });
  }

  if (isConservation) {
    policies.push({
      policy: 'Planning (Listed Buildings and Conservation Areas) Act 1990 s.72',
      requirement: 'Preserve or enhance character and appearance of conservation area',
      compliance: 'complies',
      explanation: 'Proposals preserve the character of the conservation area through sympathetic design'
    });
  }

  policies.push({
    policy: 'Camden/Barnet Local Plan Heritage Policies',
    requirement: 'Protect and enhance heritage assets',
    compliance: 'complies',
    explanation: 'Proposals accord with local heritage policies through appropriate design response'
  });

  return policies;
}

// =============================================================================
// JUSTIFICATION
// =============================================================================

function developJustification(
  projectType: string,
  projectDetails: HeritageProject
): Justification {
  return {
    publicBenefit: [
      'Improved residential accommodation for modern family living',
      'Enhanced energy efficiency reducing carbon footprint',
      'Investment in the property ensuring long-term maintenance',
      'Contribution to local economy through construction employment',
      'Better utilization of existing building rather than new construction'
    ],
    heritageBalance: 'The limited harm to heritage significance is outweighed by the public benefits. The proposals have been designed to minimize harm through careful attention to design, materials, and construction methodology.',
    alternativesConsidered: [
      'No development - rejected as property requires modernization',
      'Larger extension - rejected due to greater heritage impact',
      'Different design approach - current design most sympathetic',
      'Alternative materials - traditional materials selected as most appropriate'
    ],
    designRationale: 'The design responds to the significance of the heritage asset through subordinate scale, high-quality traditional materials, and reversible construction. The contemporary elements are confined to areas of lower significance.'
  };
}

// =============================================================================
// MITIGATION MEASURES
// =============================================================================

function proposeMitigation(projectDetails: HeritageProject): MitigationMeasures {
  const isListed = projectDetails.listingGrade && projectDetails.listingGrade !== 'none';

  return {
    design: [
      'Subordinate scale maintaining hierarchy with original building',
      'High-quality traditional materials matching existing',
      'Sensitive junction between old and new',
      'Retention of all significant features',
      'Reversible construction where possible'
    ],
    construction: [
      'Method statement for works near significant fabric',
      'Protection of retained features during construction',
      'Specialist craftsmen for works to historic fabric',
      'Site supervision by heritage professional',
      isListed ? 'Listed building consent conditions compliance' : 'Conservation best practice'
    ],
    recording: [
      'Photographic record before, during, and after works',
      'Measured survey of affected areas',
      isListed ? 'Historic building recording to appropriate level' : 'Basic recording',
      'Retention of any removed materials for analysis'
    ],
    restoration: [
      'Like-for-like repair of any disturbed historic fabric',
      'Traditional techniques and materials',
      'Specialist conservation input',
      'Ongoing maintenance recommendations'
    ]
  };
}

// =============================================================================
// CONCLUSION
// =============================================================================

function generateConclusion(
  impacts: HeritageImpact[],
  justification: Justification
): HeritageConclusion {
  const adverseImpacts = impacts.filter(i =>
    i.impact === 'minor_adverse' || i.impact === 'moderate_adverse' || i.impact === 'substantial_adverse'
  );

  let harmLevel = 'No harm';
  if (adverseImpacts.some(i => i.impact === 'substantial_adverse')) {
    harmLevel = 'Substantial harm';
  } else if (adverseImpacts.some(i => i.impact === 'moderate_adverse')) {
    harmLevel = 'Less than substantial harm (moderate)';
  } else if (adverseImpacts.some(i => i.impact === 'minor_adverse')) {
    harmLevel = 'Less than substantial harm (minor)';
  }

  return {
    overallAssessment: 'The proposed development would result in limited harm to heritage significance, primarily through alterations to areas of lower significance and with appropriate mitigation measures.',
    harmLevel,
    publicBenefitBalance: harmLevel === 'No harm'
      ? 'No harm identified; proposals preserve heritage significance'
      : 'The identified harm is outweighed by the public benefits of the scheme including improved accommodation, energy efficiency, and investment in the heritage asset',
    recommendation: harmLevel === 'Substantial harm'
      ? 'Significant revision required to reduce harm'
      : 'Approval recommended subject to conditions securing mitigation measures'
  };
}

// =============================================================================
// RECOMMENDATIONS
// =============================================================================

function generateRecommendations(projectDetails: HeritageProject): string[] {
  const recommendations = [
    'Submit detailed specifications of all external materials',
    'Provide large-scale details of junctions between old and new',
    'Agree methodology for any works to historic fabric',
    'Maintain photographic record throughout construction',
    'Consider ongoing maintenance plan'
  ];

  if (projectDetails.listingGrade && projectDetails.listingGrade !== 'none') {
    recommendations.push(
      'Submit separate Listed Building Consent application',
      'Engage conservation architect throughout',
      'Allow for specialist craftsmen in budget'
    );
  }

  return recommendations;
}

// =============================================================================
// EXPORTS
// =============================================================================

const heritageImpact = {
  generateHeritageStatement,
  HAMPSTEAD_CONSERVATION_AREAS
};

export default heritageImpact;
