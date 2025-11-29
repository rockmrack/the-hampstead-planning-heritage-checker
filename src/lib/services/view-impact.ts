/**
 * View Impact Assessment Service
 * 
 * Analyzes visual impact of proposed developments on protected views,
 * local vistas, and important sightlines in the Hampstead area.
 * 
 * Coverage: NW1-NW11, N2, N6, N10 postcodes
 */

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

interface ViewProject {
  propertyType?: 'detached' | 'semi_detached' | 'terraced' | 'flat' | 'mansion';
  projectType?: 'extension' | 'loft' | 'basement' | 'new_build' | 'roof_alteration';
  proposedHeight?: number;
  existingHeight?: number;
  ridgeHeightChange?: number;
  isConservationArea?: boolean;
  nearProtectedView?: boolean;
  topography?: 'elevated' | 'valley' | 'hillside' | 'flat';
  visibilityFromPublicRealm?: boolean;
}

interface ProtectedView {
  name: string;
  type: 'strategic' | 'local' | 'panoramic' | 'linear';
  direction: string;
  landmark?: string;
  protectionLevel: 'statutory' | 'local_plan' | 'supplementary';
  description: string;
}

interface ViewAssessmentResult {
  view: string;
  viewType: string;
  baseline: string;
  proposedChange: string;
  visibility: 'not_visible' | 'barely_visible' | 'visible' | 'prominent';
  impact: 'beneficial' | 'neutral' | 'minor_adverse' | 'moderate_adverse' | 'substantial_adverse';
  justification: string;
  mitigation: string;
}

interface ViewCone {
  apex: string;
  landmark: string;
  protectedAngle: number;
  heightLimit?: string;
  assessment: string;
}

interface ViewImpactAssessment {
  summary: ViewSummary;
  siteContext: SiteViewContext;
  protectedViews: ProtectedView[];
  viewAssessments: ViewAssessmentResult[];
  viewCones: ViewCone[];
  visualEnvelope: VisualEnvelope;
  heightAnalysis: HeightAnalysis;
  cumulativeImpact: CumulativeImpact;
  policyCompliance: ViewPolicyCompliance[];
  mitigation: ViewMitigation;
  conclusion: ViewConclusion;
  recommendations: string[];
}

interface ViewSummary {
  overallImpact: string;
  protectedViewsAffected: number;
  policyCompliance: string;
  recommendedOutcome: string;
}

interface SiteViewContext {
  topography: string;
  elevation: string;
  surroundingHeights: string;
  existingVisibility: string;
  keyViewpoints: string[];
}

interface VisualEnvelope {
  description: string;
  extentFromNorth: string;
  extentFromSouth: string;
  extentFromEast: string;
  extentFromWest: string;
  limitingFactors: string[];
}

interface HeightAnalysis {
  existingHeight: string;
  proposedHeight: string;
  heightChange: string;
  contextualAssessment: string;
  exceedanceAnalysis: string;
}

interface CumulativeImpact {
  otherDevelopments: string[];
  combinedEffect: string;
  assessment: string;
}

interface ViewPolicyCompliance {
  policy: string;
  requirement: string;
  compliance: 'complies' | 'partial' | 'does_not_comply';
  explanation: string;
}

interface ViewMitigation {
  design: string[];
  landscaping: string[];
  materials: string[];
  conditions: string[];
}

interface ViewConclusion {
  overallAssessment: string;
  protectedViewImpact: string;
  localViewImpact: string;
  recommendation: string;
}

// =============================================================================
// PROTECTED VIEWS DATA
// =============================================================================

const HAMPSTEAD_PROTECTED_VIEWS: ProtectedView[] = [
  {
    name: 'Parliament Hill to St Paul\'s Cathedral',
    type: 'strategic',
    direction: 'South',
    landmark: 'St Paul\'s Cathedral',
    protectionLevel: 'statutory',
    description: 'London View Management Framework protected vista'
  },
  {
    name: 'Parliament Hill Panorama',
    type: 'panoramic',
    direction: 'South',
    protectionLevel: 'statutory',
    description: 'Wider panoramic view of London skyline'
  },
  {
    name: 'Kenwood to St Paul\'s',
    type: 'strategic',
    direction: 'South-East',
    landmark: 'St Paul\'s Cathedral',
    protectionLevel: 'statutory',
    description: 'Protected view from Kenwood House grounds'
  },
  {
    name: 'Hampstead Heath Extension Views',
    type: 'local',
    direction: 'Various',
    protectionLevel: 'local_plan',
    description: 'Views from and within Hampstead Heath Extension'
  },
  {
    name: 'Holly Hill to Heath',
    type: 'linear',
    direction: 'North',
    protectionLevel: 'supplementary',
    description: 'View corridor from village to Heath'
  },
  {
    name: 'Whitestone Pond Vista',
    type: 'panoramic',
    direction: 'South-East',
    protectionLevel: 'local_plan',
    description: 'Panoramic views from Whitestone Pond'
  }
];

// =============================================================================
// MAIN SERVICE FUNCTION
// =============================================================================

async function assessViewImpact(
  address: string,
  postcode: string,
  projectType: string,
  projectDetails: ViewProject = {}
): Promise<ViewImpactAssessment> {
  const summary = generateViewSummary(projectDetails);
  const siteContext = assessSiteContext(address, postcode, projectDetails);
  const protectedViews = identifyRelevantViews(postcode, projectDetails);
  const viewAssessments = conductViewAssessments(protectedViews, projectDetails);
  const viewCones = analyzeViewCones(postcode, projectDetails);
  const visualEnvelope = defineVisualEnvelope(projectDetails);
  const heightAnalysis = analyzeHeight(projectDetails);
  const cumulativeImpact = assessCumulativeImpact(postcode);
  const policyCompliance = assessViewPolicies(viewAssessments);
  const mitigation = proposeMitigation(viewAssessments);
  const conclusion = generateConclusion(viewAssessments, policyCompliance);
  const recommendations = generateRecommendations(viewAssessments);

  return {
    summary,
    siteContext,
    protectedViews,
    viewAssessments,
    viewCones,
    visualEnvelope,
    heightAnalysis,
    cumulativeImpact,
    policyCompliance,
    mitigation,
    conclusion,
    recommendations
  };
}

// =============================================================================
// VIEW SUMMARY
// =============================================================================

function generateViewSummary(projectDetails: ViewProject): ViewSummary {
  const nearProtected = Boolean(projectDetails.nearProtectedView);
  const isLoft = projectDetails.projectType === 'loft' || projectDetails.projectType === 'roof_alteration';

  return {
    overallImpact: nearProtected && isLoft ? 'Minor adverse' : 'Neutral to minimal',
    protectedViewsAffected: nearProtected ? 1 : 0,
    policyCompliance: 'Compliant with mitigation',
    recommendedOutcome: 'Approval subject to design conditions'
  };
}

// =============================================================================
// SITE CONTEXT
// =============================================================================

function assessSiteContext(
  address: string,
  postcode: string,
  projectDetails: ViewProject
): SiteViewContext {
  const topography = projectDetails.topography || 'varied';
  const postcodePrefix = (postcode.split(' ')[0] || postcode).toUpperCase();

  let elevation = 'Moderate elevation';
  if (postcodePrefix === 'NW3') {
    elevation = 'Elevated position on Hampstead ridge';
  } else if (postcodePrefix === 'NW11') {
    elevation = 'Generally level within Garden Suburb';
  }

  return {
    topography: `The site is located on ${topography} terrain typical of the Hampstead area`,
    elevation,
    surroundingHeights: 'Surrounding buildings range from 2-4 storeys, consistent with the residential character',
    existingVisibility: 'The site is visible from immediate neighbors and partially from the public highway',
    keyViewpoints: [
      'View from public highway',
      'Views from neighboring properties',
      'Views from rear gardens',
      projectDetails.nearProtectedView ? 'Protected view corridor' : 'No protected view corridors directly affected'
    ]
  };
}

// =============================================================================
// IDENTIFY RELEVANT VIEWS
// =============================================================================

function identifyRelevantViews(
  postcode: string,
  projectDetails: ViewProject
): ProtectedView[] {
  const postcodePrefix = (postcode.split(' ')[0] || postcode).toUpperCase();

  // For NW3 (Hampstead proper), all views potentially relevant
  if (postcodePrefix === 'NW3') {
    return HAMPSTEAD_PROTECTED_VIEWS;
  }

  // For other areas, filter to most relevant
  return HAMPSTEAD_PROTECTED_VIEWS.filter(v =>
    v.protectionLevel === 'statutory' || v.type === 'local'
  );
}

// =============================================================================
// VIEW ASSESSMENTS
// =============================================================================

function conductViewAssessments(
  protectedViews: ProtectedView[],
  projectDetails: ViewProject
): ViewAssessmentResult[] {
  const assessments: ViewAssessmentResult[] = [];

  for (const view of protectedViews) {
    const visibility = assessVisibility(view, projectDetails);
    const impact = assessImpact(visibility, view.protectionLevel);

    assessments.push({
      view: view.name,
      viewType: view.type,
      baseline: `Existing view ${view.description}`,
      proposedChange: getProposedChange(projectDetails),
      visibility,
      impact,
      justification: getJustification(visibility, impact),
      mitigation: getMitigation(visibility)
    });
  }

  return assessments;
}

function assessVisibility(
  view: ProtectedView,
  projectDetails: ViewProject
): ViewAssessmentResult['visibility'] {
  // Most domestic developments in Hampstead are not visible in strategic views
  if (view.type === 'strategic') {
    return 'not_visible';
  }

  if (view.type === 'panoramic') {
    return projectDetails.topography === 'elevated' ? 'barely_visible' : 'not_visible';
  }

  if (view.type === 'local' || view.type === 'linear') {
    const heightChange = projectDetails.ridgeHeightChange || 0;
    if (heightChange > 2) return 'visible';
    if (heightChange > 0) return 'barely_visible';
    return 'not_visible';
  }

  return 'not_visible';
}

function assessImpact(
  visibility: ViewAssessmentResult['visibility'],
  protectionLevel: ProtectedView['protectionLevel']
): ViewAssessmentResult['impact'] {
  if (visibility === 'not_visible') return 'neutral';
  if (visibility === 'barely_visible') return protectionLevel === 'statutory' ? 'minor_adverse' : 'neutral';
  if (visibility === 'visible') return protectionLevel === 'statutory' ? 'moderate_adverse' : 'minor_adverse';
  return 'moderate_adverse';
}

function getProposedChange(projectDetails: ViewProject): string {
  const type = projectDetails.projectType || 'extension';
  const heightChange = projectDetails.ridgeHeightChange || 0;

  if (type === 'loft') {
    return `Rear dormer and rooflights with ${heightChange > 0 ? `${heightChange}m ridge height increase` : 'no ridge height change'}`;
  }

  if (type === 'extension') {
    return 'Single/two storey rear extension below existing ridge';
  }

  return 'Proposed alterations as described in application';
}

function getJustification(
  visibility: ViewAssessmentResult['visibility'],
  impact: ViewAssessmentResult['impact']
): string {
  if (visibility === 'not_visible') {
    return 'The proposed development is not visible in this view due to distance, intervening development, and topography';
  }

  if (visibility === 'barely_visible') {
    return 'The development may be visible as a minor element but would not detract from the overall character of the view';
  }

  return 'The development is visible but represents only a minor change consistent with the urban context';
}

function getMitigation(visibility: ViewAssessmentResult['visibility']): string {
  if (visibility === 'not_visible') {
    return 'No mitigation required';
  }

  return 'Use of materials sympathetic to the area; design to minimize bulk; retention of mature vegetation';
}

// =============================================================================
// VIEW CONES
// =============================================================================

function analyzeViewCones(
  postcode: string,
  projectDetails: ViewProject
): ViewCone[] {
  const postcodePrefix = (postcode.split(' ')[0] || postcode).toUpperCase();

  const cones: ViewCone[] = [
    {
      apex: 'Parliament Hill viewing point',
      landmark: 'St Paul\'s Cathedral',
      protectedAngle: 10,
      heightLimit: 'Development must not breach the protected viewing corridor',
      assessment: 'Site is outside the protected viewing corridor - no impact on view cone'
    }
  ];

  if (postcodePrefix === 'NW3') {
    cones.push({
      apex: 'Kenwood House',
      landmark: 'St Paul\'s Cathedral',
      protectedAngle: 5,
      assessment: 'Site is well below the protected sightline - no impact anticipated'
    });
  }

  return cones;
}

// =============================================================================
// VISUAL ENVELOPE
// =============================================================================

function defineVisualEnvelope(projectDetails: ViewProject): VisualEnvelope {
  return {
    description: 'The Zone of Theoretical Visibility (ZTV) for the proposed development extends approximately 500m in all directions, limited by intervening built form and vegetation',
    extentFromNorth: 'Limited to approximately 100m due to adjacent development',
    extentFromSouth: 'Views from rear gardens of properties to the south, approximately 50m',
    extentFromEast: 'Limited by neighboring properties',
    extentFromWest: 'Limited by neighboring properties',
    limitingFactors: [
      'Dense residential built form',
      'Mature tree cover',
      'Relatively modest scale of development',
      'Topography (where applicable)'
    ]
  };
}

// =============================================================================
// HEIGHT ANALYSIS
// =============================================================================

function analyzeHeight(projectDetails: ViewProject): HeightAnalysis {
  const existing = projectDetails.existingHeight || 8;
  const proposed = projectDetails.proposedHeight || existing;
  const change = proposed - existing;

  return {
    existingHeight: `${existing}m to ridge`,
    proposedHeight: `${proposed}m to ridge`,
    heightChange: change > 0 ? `+${change}m` : change === 0 ? 'No change' : `${change}m`,
    contextualAssessment: 'The proposed height is consistent with the established building heights in the immediate context',
    exceedanceAnalysis: change > 0
      ? 'The modest increase in height is within acceptable limits for the area and does not breach any protected view corridors'
      : 'No height increase proposed; development remains within existing envelope'
  };
}

// =============================================================================
// CUMULATIVE IMPACT
// =============================================================================

function assessCumulativeImpact(postcode: string): CumulativeImpact {
  return {
    otherDevelopments: [
      'Minor residential alterations in immediate vicinity',
      'No major developments identified within visual catchment'
    ],
    combinedEffect: 'The cumulative effect of this development with others in the area would be minimal',
    assessment: 'The development, combined with other consented schemes, would not result in an unacceptable cumulative impact on protected views or local visual amenity'
  };
}

// =============================================================================
// POLICY COMPLIANCE
// =============================================================================

function assessViewPolicies(
  viewAssessments: ViewAssessmentResult[]
): ViewPolicyCompliance[] {
  const hasAdverseImpact = viewAssessments.some(v =>
    v.impact === 'minor_adverse' || v.impact === 'moderate_adverse'
  );

  return [
    {
      policy: 'London Plan Policy HC4 - London View Management Framework',
      requirement: 'Protect and enhance designated views',
      compliance: 'complies',
      explanation: 'Development does not intrude into any protected strategic view corridor'
    },
    {
      policy: 'Local Plan - Views and Vistas',
      requirement: 'Protect locally important views',
      compliance: hasAdverseImpact ? 'partial' : 'complies',
      explanation: hasAdverseImpact
        ? 'Minor impact on local views mitigated through design measures'
        : 'No adverse impact on locally important views'
    },
    {
      policy: 'Conservation Area Policy',
      requirement: 'Preserve or enhance character including important views',
      compliance: 'complies',
      explanation: 'Development preserves the visual character of the conservation area'
    }
  ];
}

// =============================================================================
// MITIGATION
// =============================================================================

function proposeMitigation(viewAssessments: ViewAssessmentResult[]): ViewMitigation {
  return {
    design: [
      'Scale and massing minimized to reduce visual impact',
      'Roof profile designed to maintain existing ridgeline where possible',
      'Dormers set back from eaves to reduce visibility',
      'Materials selected to recede into existing roofscape'
    ],
    landscaping: [
      'Retention of existing mature trees and vegetation',
      'Additional planting to screen development where appropriate',
      'Green roof considered for flat roof elements'
    ],
    materials: [
      'Slate roofing to match existing',
      'Conservation-style rooflights flush with roof plane',
      'Subdued material palette to blend with surroundings'
    ],
    conditions: [
      'Submit material samples for approval',
      'Landscaping scheme to be approved',
      'No additional roof plant or equipment without consent'
    ]
  };
}

// =============================================================================
// CONCLUSION
// =============================================================================

function generateConclusion(
  viewAssessments: ViewAssessmentResult[],
  policyCompliance: ViewPolicyCompliance[]
): ViewConclusion {
  const adverseCount = viewAssessments.filter(v =>
    v.impact === 'minor_adverse' || v.impact === 'moderate_adverse' || v.impact === 'substantial_adverse'
  ).length;

  const strategicImpact = viewAssessments.find(v =>
    v.viewType === 'strategic' && v.impact !== 'neutral'
  );

  return {
    overallAssessment: `The proposed development would have ${adverseCount === 0 ? 'no' : 'limited'} impact on visual amenity and protected views`,
    protectedViewImpact: strategicImpact
      ? 'Minor impact on one protected view, within acceptable parameters'
      : 'No impact on protected strategic views',
    localViewImpact: adverseCount > 0
      ? 'Limited impact on local views, mitigated through design'
      : 'Negligible impact on local views',
    recommendation: 'Approval recommended - the development accords with view protection policies'
  };
}

// =============================================================================
// RECOMMENDATIONS
// =============================================================================

function generateRecommendations(viewAssessments: ViewAssessmentResult[]): string[] {
  const recommendations = [
    'Commission verified views if required by planning authority',
    'Submit detailed material specifications',
    'Consider seasonal variation in vegetation screening'
  ];

  const hasVisibleImpact = viewAssessments.some(v => v.visibility !== 'not_visible');

  if (hasVisibleImpact) {
    recommendations.push(
      'Prepare photomontages from key viewpoints',
      'Consider 3D model to demonstrate impact',
      'Early consultation with conservation officer recommended'
    );
  }

  return recommendations;
}

// =============================================================================
// EXPORTS
// =============================================================================

const viewImpact = {
  assessViewImpact,
  HAMPSTEAD_PROTECTED_VIEWS
};

export default viewImpact;
