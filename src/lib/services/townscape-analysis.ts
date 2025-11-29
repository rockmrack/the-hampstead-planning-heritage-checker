/**
 * Townscape Analysis Service
 * 
 * Provides comprehensive townscape character analysis for planning applications,
 * assessing how proposed developments relate to the existing urban fabric
 * of Hampstead and surrounding areas.
 * 
 * Coverage: NW1-NW11, N2, N6, N10 postcodes
 */

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

interface TownscapeProject {
  propertyType?: 'detached' | 'semi_detached' | 'terraced' | 'flat' | 'mansion';
  projectType?: 'extension' | 'loft' | 'basement' | 'new_build' | 'demolition_rebuild';
  isConservationArea?: boolean;
  conservationAreaName?: string;
  architecturalStyle?: string;
  proposedMaterials?: string[];
  buildingHeight?: number;
  streetFrontage?: boolean;
}

interface CharacterArea {
  name: string;
  period: string;
  typology: string[];
  keyCharacteristics: string[];
  sensitivity: 'high' | 'medium' | 'low';
}

interface StreetsceneElement {
  element: string;
  description: string;
  contribution: 'positive' | 'neutral' | 'negative';
  significance: 'high' | 'medium' | 'low';
}

interface TownscapeImpact {
  aspect: string;
  baseline: string;
  proposedChange: string;
  impact: 'beneficial' | 'neutral' | 'minor_adverse' | 'moderate_adverse' | 'substantial_adverse';
  justification: string;
}

interface TownscapeAnalysis {
  summary: TownscapeSummary;
  characterArea: CharacterAreaAssessment;
  streetscene: StreetsceneAssessment;
  buildingLine: BuildingLineAssessment;
  scale: ScaleAssessment;
  materials: MaterialsAssessment;
  landscapeSetting: LandscapeAssessment;
  impacts: TownscapeImpact[];
  designResponse: DesignResponse;
  policyCompliance: TownscapePolicyCompliance[];
  conclusion: TownscapeConclusion;
  recommendations: string[];
}

interface TownscapeSummary {
  areaCharacter: string;
  overallImpact: string;
  designQuality: string;
  recommendation: string;
}

interface CharacterAreaAssessment {
  name: string;
  period: string;
  description: string;
  specialQualities: string[];
  pressures: string[];
  opportunities: string[];
}

interface StreetsceneAssessment {
  description: string;
  rhythm: string;
  enclosure: string;
  elements: StreetsceneElement[];
  contribution: string;
}

interface BuildingLineAssessment {
  existing: string;
  proposed: string;
  impact: string;
  setbacks: string;
}

interface ScaleAssessment {
  existingScale: string;
  proposedScale: string;
  contextualFit: string;
  massing: string;
}

interface MaterialsAssessment {
  existingPalette: string[];
  proposedMaterials: string[];
  compatibility: string;
  recommendations: string[];
}

interface LandscapeAssessment {
  existingLandscape: string;
  proposedChanges: string;
  greenInfrastructure: string;
  boundaryTreatments: string;
}

interface DesignResponse {
  contextualApproach: string;
  designPrinciples: string[];
  characterResponse: string;
  innovationVsTradition: string;
}

interface TownscapePolicyCompliance {
  policy: string;
  requirement: string;
  compliance: 'complies' | 'partial' | 'does_not_comply';
  explanation: string;
}

interface TownscapeConclusion {
  overallAssessment: string;
  characterImpact: string;
  streetsceneImpact: string;
  recommendation: string;
}

// =============================================================================
// CHARACTER AREA DATA
// =============================================================================

const HAMPSTEAD_CHARACTER_AREAS: Record<string, CharacterArea> = {
  'NW3_village': {
    name: 'Hampstead Village',
    period: 'Medieval origins with Georgian and Victorian development',
    typology: ['Historic village core', 'Georgian townhouses', 'Victorian villas'],
    keyCharacteristics: [
      'Intimate scale',
      'Winding streets',
      'Historic street pattern',
      'Mix of building periods',
      'Literary and artistic associations'
    ],
    sensitivity: 'high'
  },
  'NW3_heath': {
    name: 'Heath Fringe',
    period: 'Victorian and Edwardian',
    typology: ['Large detached villas', 'Mansion blocks'],
    keyCharacteristics: [
      'Generous plots',
      'Mature gardens',
      'Views to Heath',
      'Grand architectural statements'
    ],
    sensitivity: 'high'
  },
  'NW11_suburb': {
    name: 'Hampstead Garden Suburb',
    period: 'Edwardian (1907 onwards)',
    typology: ['Arts and Crafts houses', 'Cottage style', 'Neo-Georgian'],
    keyCharacteristics: [
      'Unified design philosophy',
      'Generous gardens',
      'Hedged boundaries',
      'Traffic-free central square'
    ],
    sensitivity: 'high'
  },
  'NW6_belsize': {
    name: 'Belsize Park',
    period: 'Victorian',
    typology: ['Victorian terraces', 'Semi-detached villas', 'Mansion flats'],
    keyCharacteristics: [
      'Tree-lined streets',
      'Consistent scale',
      'Ornate facades',
      'Front gardens'
    ],
    sensitivity: 'medium'
  }
};

// =============================================================================
// MAIN SERVICE FUNCTION
// =============================================================================

async function analyzeTownscape(
  address: string,
  postcode: string,
  projectType: string,
  projectDetails: TownscapeProject = {}
): Promise<TownscapeAnalysis> {
  const summary = generateSummary(postcode, projectDetails);
  const characterArea = assessCharacterArea(postcode, projectDetails);
  const streetscene = analyzeStreetscene(projectDetails);
  const buildingLine = assessBuildingLine(projectDetails);
  const scale = assessScale(projectDetails);
  const materials = assessMaterials(projectDetails);
  const landscapeSetting = assessLandscape(projectDetails);
  const impacts = assessImpacts(projectType, projectDetails);
  const designResponse = evaluateDesignResponse(projectDetails);
  const policyCompliance = assessPolicies(impacts);
  const conclusion = generateConclusion(impacts, characterArea);
  const recommendations = generateRecommendations(characterArea, impacts);

  return {
    summary,
    characterArea,
    streetscene,
    buildingLine,
    scale,
    materials,
    landscapeSetting,
    impacts,
    designResponse,
    policyCompliance,
    conclusion,
    recommendations
  };
}

// =============================================================================
// SUMMARY
// =============================================================================

function generateSummary(postcode: string, projectDetails: TownscapeProject): TownscapeSummary {
  const postcodePrefix = (postcode.split(' ')[0] || postcode).toUpperCase();
  const isConservation = Boolean(projectDetails.isConservationArea);

  let areaCharacter = 'Mixed residential';
  if (postcodePrefix === 'NW3') areaCharacter = 'Historic Hampstead';
  else if (postcodePrefix === 'NW11') areaCharacter = 'Hampstead Garden Suburb';
  else if (postcodePrefix === 'NW6') areaCharacter = 'Belsize Park';

  return {
    areaCharacter,
    overallImpact: isConservation ? 'Neutral to minor' : 'Neutral',
    designQuality: 'High quality design response to context',
    recommendation: 'Acceptable subject to material conditions'
  };
}

// =============================================================================
// CHARACTER AREA ASSESSMENT
// =============================================================================

function assessCharacterArea(
  postcode: string,
  projectDetails: TownscapeProject
): CharacterAreaAssessment {
  const postcodePrefix = (postcode.split(' ')[0] || postcode).toUpperCase();

  let areaKey = 'NW6_belsize';
  if (postcodePrefix === 'NW3') areaKey = 'NW3_village';
  else if (postcodePrefix === 'NW11') areaKey = 'NW11_suburb';

  const area = HAMPSTEAD_CHARACTER_AREAS[areaKey] ?? HAMPSTEAD_CHARACTER_AREAS['NW6_belsize'];
  const fallbackArea: CharacterArea = {
    name: 'Belsize Park',
    period: 'Victorian',
    typology: ['Victorian terraces', 'Semi-detached villas'],
    keyCharacteristics: ['Tree-lined streets', 'Consistent scale', 'Front gardens'],
    sensitivity: 'medium'
  };
  const safeArea = area ?? fallbackArea;

  return {
    name: safeArea.name,
    period: safeArea.period,
    description: `The site is located within ${safeArea.name}, a ${safeArea.typology.join('/')} area characterized by ${safeArea.keyCharacteristics.slice(0, 3).join(', ')}`,
    specialQualities: safeArea.keyCharacteristics,
    pressures: [
      'Development pressure from extensions and loft conversions',
      'Demand for basement developments',
      'Pressure for larger accommodation',
      'Changes to front boundaries and gardens'
    ],
    opportunities: [
      'Enhancement through high-quality design',
      'Restoration of lost features',
      'Improved sustainability',
      'Better integration of parking'
    ]
  };
}

// =============================================================================
// STREETSCENE ASSESSMENT
// =============================================================================

function analyzeStreetscene(projectDetails: TownscapeProject): StreetsceneAssessment {
  const type = projectDetails.propertyType || 'terraced';

  return {
    description: `The street is characterized by ${type === 'terraced' ? 'continuous terraces' : 'individual properties'} creating a coherent streetscene`,
    rhythm: type === 'terraced'
      ? 'Regular rhythm established by repeated plot widths and bay spacing'
      : 'Varied rhythm with individual properties set within generous plots',
    enclosure: 'Well-defined street enclosure with buildings facing the street',
    elements: [
      {
        element: 'Building frontages',
        description: 'Consistent architectural treatment',
        contribution: 'positive',
        significance: 'high'
      },
      {
        element: 'Front gardens',
        description: 'Traditional front garden setting',
        contribution: 'positive',
        significance: 'medium'
      },
      {
        element: 'Boundary treatments',
        description: 'Mix of walls, railings, and hedges',
        contribution: 'positive',
        significance: 'medium'
      },
      {
        element: 'Street trees',
        description: 'Mature street trees provide green setting',
        contribution: 'positive',
        significance: 'high'
      }
    ],
    contribution: 'The existing building makes a positive contribution to the streetscene through its scale, proportions, and materials'
  };
}

// =============================================================================
// BUILDING LINE ASSESSMENT
// =============================================================================

function assessBuildingLine(projectDetails: TownscapeProject): BuildingLineAssessment {
  const type = projectDetails.projectType || 'extension';

  return {
    existing: 'Established building line consistent with neighboring properties',
    proposed: type === 'extension'
      ? 'No change to front building line; rear extension set behind existing footprint'
      : 'Building line maintained',
    impact: 'Neutral - the established building line is preserved',
    setbacks: 'Appropriate setbacks maintained from boundaries'
  };
}

// =============================================================================
// SCALE ASSESSMENT
// =============================================================================

function assessScale(projectDetails: TownscapeProject): ScaleAssessment {
  const height = projectDetails.buildingHeight || 9;

  return {
    existingScale: `${height}m to ridge, ${Math.floor(height / 3)} storeys, consistent with street`,
    proposedScale: 'Scale maintained within existing parameters or modest increase consistent with context',
    contextualFit: 'The proposal maintains an appropriate scale relationship with neighboring buildings',
    massing: 'Massing is broken down to reduce perceived bulk; additions are subordinate to the host building'
  };
}

// =============================================================================
// MATERIALS ASSESSMENT
// =============================================================================

function assessMaterials(projectDetails: TownscapeProject): MaterialsAssessment {
  const proposed = projectDetails.proposedMaterials || ['brick', 'slate', 'timber'];

  return {
    existingPalette: [
      'London stock brick',
      'Natural slate roof',
      'Painted timber windows',
      'Stucco render (where applicable)'
    ],
    proposedMaterials: proposed,
    compatibility: 'The proposed materials are compatible with the existing palette and wider streetscene',
    recommendations: [
      'Match brick color and bond to existing',
      'Use natural slate to match existing roof',
      'Timber or high-quality metal windows',
      'Submit samples for approval'
    ]
  };
}

// =============================================================================
// LANDSCAPE ASSESSMENT
// =============================================================================

function assessLandscape(projectDetails: TownscapeProject): LandscapeAssessment {
  return {
    existingLandscape: 'Mature garden with established trees and shrubs contributing to green character',
    proposedChanges: 'Majority of garden retained; new hard landscaping limited to immediate surroundings of extension',
    greenInfrastructure: 'Retention of mature trees; potential for green roof; sustainable drainage',
    boundaryTreatments: 'Existing boundary treatments retained and enhanced'
  };
}

// =============================================================================
// IMPACT ASSESSMENT
// =============================================================================

function assessImpacts(
  projectType: string,
  projectDetails: TownscapeProject
): TownscapeImpact[] {
  const impacts: TownscapeImpact[] = [];

  // Streetscene impact
  impacts.push({
    aspect: 'Streetscene',
    baseline: 'Established streetscene with consistent character',
    proposedChange: projectDetails.streetFrontage
      ? 'Alterations visible from street'
      : 'No change to street-facing elevation',
    impact: projectDetails.streetFrontage ? 'minor_adverse' : 'neutral',
    justification: projectDetails.streetFrontage
      ? 'Visible alterations designed to integrate with existing character'
      : 'No impact on streetscene - works to rear only'
  });

  // Character area impact
  impacts.push({
    aspect: 'Character area',
    baseline: 'Distinctive local character',
    proposedChange: 'Development within existing plot',
    impact: 'neutral',
    justification: 'Design responds appropriately to established character'
  });

  // Scale and massing
  impacts.push({
    aspect: 'Scale and massing',
    baseline: 'Consistent scale along street',
    proposedChange: projectType === 'loft' ? 'Modest increase in ridge height' : 'Subordinate addition',
    impact: projectType === 'loft' ? 'minor_adverse' : 'neutral',
    justification: 'Scale remains appropriate to context; additions subordinate to host'
  });

  // Landscape setting
  impacts.push({
    aspect: 'Landscape setting',
    baseline: 'Mature garden contributing to green character',
    proposedChange: 'Partial loss of garden to extension',
    impact: projectType === 'basement' ? 'minor_adverse' : 'neutral',
    justification: 'Majority of garden retained; key landscape features preserved'
  });

  return impacts;
}

// =============================================================================
// DESIGN RESPONSE
// =============================================================================

function evaluateDesignResponse(projectDetails: TownscapeProject): DesignResponse {
  const isConservation = Boolean(projectDetails.isConservationArea);

  return {
    contextualApproach: isConservation
      ? 'Respectful traditional approach responding to conservation area context'
      : 'Contemporary design rooted in understanding of local character',
    designPrinciples: [
      'Subordination - additions clearly secondary to host building',
      'Compatibility - materials and details responding to context',
      'Quality - high-quality design and craftsmanship',
      'Sustainability - incorporating sustainable design principles'
    ],
    characterResponse: 'The design demonstrates clear understanding of local character through appropriate scale, materials, and detailing',
    innovationVsTradition: isConservation
      ? 'Traditional approach appropriate to sensitive context'
      : 'Balance of contemporary expression with contextual response'
  };
}

// =============================================================================
// POLICY COMPLIANCE
// =============================================================================

function assessPolicies(impacts: TownscapeImpact[]): TownscapePolicyCompliance[] {
  const hasAdverseImpact = impacts.some(i =>
    i.impact === 'minor_adverse' || i.impact === 'moderate_adverse'
  );

  return [
    {
      policy: 'NPPF Chapter 12 - Achieving Well-Designed Places',
      requirement: 'Good design responding to local character',
      compliance: 'complies',
      explanation: 'Design demonstrates clear response to local character and context'
    },
    {
      policy: 'Local Plan Design Policy',
      requirement: 'Respect and enhance local character',
      compliance: hasAdverseImpact ? 'partial' : 'complies',
      explanation: hasAdverseImpact
        ? 'Minor impact mitigated through design measures'
        : 'Full compliance with design policies'
    },
    {
      policy: 'Conservation Area Policy',
      requirement: 'Preserve or enhance character',
      compliance: 'complies',
      explanation: 'Development preserves the character of the conservation area'
    },
    {
      policy: 'Residential Design Guide',
      requirement: 'High-quality residential development',
      compliance: 'complies',
      explanation: 'Design accords with guidance on residential extensions and alterations'
    }
  ];
}

// =============================================================================
// CONCLUSION
// =============================================================================

function generateConclusion(
  impacts: TownscapeImpact[],
  characterArea: CharacterAreaAssessment
): TownscapeConclusion {
  const adverseImpacts = impacts.filter(i =>
    i.impact === 'minor_adverse' || i.impact === 'moderate_adverse' || i.impact === 'substantial_adverse'
  );

  return {
    overallAssessment: `The proposed development would have ${adverseImpacts.length === 0 ? 'no' : 'limited'} impact on the townscape character of ${characterArea.name}`,
    characterImpact: adverseImpacts.length > 0
      ? 'Limited impact on character, mitigated through design quality'
      : 'Character preserved through appropriate design response',
    streetsceneImpact: impacts.find(i => i.aspect === 'Streetscene')?.impact === 'neutral'
      ? 'No impact on streetscene'
      : 'Minor impact on streetscene, acceptable given design quality',
    recommendation: 'The proposal is acceptable in townscape terms and accords with relevant policies'
  };
}

// =============================================================================
// RECOMMENDATIONS
// =============================================================================

function generateRecommendations(
  characterArea: CharacterAreaAssessment,
  impacts: TownscapeImpact[]
): string[] {
  const recommendations = [
    'Submit detailed material samples and specifications',
    'Provide large-scale details of key junctions',
    'Consider preparation of Design and Access Statement'
  ];

  if (characterArea.name.includes('Garden Suburb')) {
    recommendations.push(
      'Consult Hampstead Garden Suburb Trust',
      'Ensure compliance with Trust guidance'
    );
  }

  const hasStreetsceneImpact = impacts.find(i =>
    i.aspect === 'Streetscene' && i.impact !== 'neutral'
  );

  if (hasStreetsceneImpact) {
    recommendations.push(
      'Prepare streetscene elevation showing context',
      'Consider CGI visualization from key viewpoints'
    );
  }

  return recommendations;
}

// =============================================================================
// EXPORTS
// =============================================================================

const townscape = {
  analyzeTownscape,
  HAMPSTEAD_CHARACTER_AREAS
};

export default townscape;
