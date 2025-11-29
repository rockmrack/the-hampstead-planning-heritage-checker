/**
 * Planning Policy Database Service
 * 
 * Comprehensive database of planning policies relevant to Hampstead/Camden:
 * - Local plan policies
 * - Conservation area guidelines
 * - Supplementary planning documents
 * - National policy references
 * - Policy interpretation guidance
 */

// Types
export interface PlanningPolicy {
  id: string;
  code: string;
  title: string;
  category: PolicyCategory;
  source: PolicySource;
  summary: string;
  fullText: string;
  relevantTo: ProjectType[];
  areas: string[]; // NW3, NW5, etc. or 'all'
  keyRequirements: string[];
  designGuidance: string[];
  exceptions: string[];
  relatedPolicies: string[];
  lastUpdated: Date;
  status: 'current' | 'superseded' | 'draft';
}

export type PolicyCategory = 
  | 'heritage'
  | 'design'
  | 'housing'
  | 'environment'
  | 'transport'
  | 'amenity'
  | 'sustainability'
  | 'trees'
  | 'flooding'
  | 'basements';

export type PolicySource = 
  | 'camden_local_plan'
  | 'london_plan'
  | 'nppf'
  | 'conservation_area_statement'
  | 'supplementary_guidance'
  | 'article_4_direction';

export type ProjectType = 
  | 'extension'
  | 'loft_conversion'
  | 'basement'
  | 'new_build'
  | 'change_of_use'
  | 'listed_building'
  | 'demolition'
  | 'trees'
  | 'shopfront'
  | 'advertisement';

export interface PolicySearch {
  query?: string;
  category?: PolicyCategory;
  projectType?: ProjectType;
  area?: string;
  source?: PolicySource;
}

export interface PolicyAssessment {
  property: string;
  projectType: ProjectType;
  applicablePolicies: ApplicablePolicy[];
  overallCompliance: 'likely' | 'possible' | 'challenging' | 'unlikely';
  keyIssues: string[];
  recommendations: string[];
}

export interface ApplicablePolicy {
  policy: PlanningPolicy;
  relevance: 'high' | 'medium' | 'low';
  complianceRisk: 'low' | 'medium' | 'high';
  notes: string;
}

// Policy Database
const POLICIES: PlanningPolicy[] = [
  // Heritage Policies
  {
    id: 'pol-d1',
    code: 'D1',
    title: 'Design',
    category: 'design',
    source: 'camden_local_plan',
    summary: 'All development must be of the highest quality design that responds to local context and character.',
    fullText: `Policy D1 requires that all development:
    - Responds positively to local context, character, and distinctiveness
    - Is of the highest quality of design
    - Protects and enhances the character and appearance of the area
    - Creates well-designed places that are safe and accessible
    - Uses high-quality, durable materials appropriate to the area`,
    relevantTo: ['extension', 'loft_conversion', 'basement', 'new_build', 'change_of_use'],
    areas: ['all'],
    keyRequirements: [
      'Respond to local context and character',
      'High quality design and materials',
      'Appropriate scale and massing',
      'Active frontages where appropriate'
    ],
    designGuidance: [
      'Study the character of the immediate area',
      'Match or complement existing materials',
      'Respect building lines and heights',
      'Consider impact on streetscape'
    ],
    exceptions: [],
    relatedPolicies: ['D2', 'D4', 'D5'],
    lastUpdated: new Date('2024-01-01'),
    status: 'current',
  },
  {
    id: 'pol-d2',
    code: 'D2',
    title: 'Heritage',
    category: 'heritage',
    source: 'camden_local_plan',
    summary: 'Development affecting heritage assets must preserve or enhance their significance.',
    fullText: `Policy D2 requires development affecting heritage assets to:
    - Conserve and enhance the significance of heritage assets
    - Preserve or enhance the character and appearance of conservation areas
    - Protect the setting of heritage assets
    - Require substantial public benefits if harm is proposed
    - Maintain or restore features that contribute to significance`,
    relevantTo: ['extension', 'loft_conversion', 'basement', 'new_build', 'change_of_use', 'listed_building', 'demolition'],
    areas: ['all'],
    keyRequirements: [
      'Preserve or enhance heritage significance',
      'Protect character of conservation areas',
      'Detailed heritage impact assessment required',
      'Traditional materials and methods for listed buildings'
    ],
    designGuidance: [
      'Commission heritage statement for sensitive sites',
      'Use traditional materials in conservation areas',
      'Subordinate extensions to main building',
      'Avoid harm to significant features'
    ],
    exceptions: [
      'Minor internal works to non-listed buildings',
      'Like-for-like repairs'
    ],
    relatedPolicies: ['D1', 'D4'],
    lastUpdated: new Date('2024-01-01'),
    status: 'current',
  },
  {
    id: 'pol-d4',
    code: 'D4',
    title: 'Basement Development',
    category: 'basements',
    source: 'camden_local_plan',
    summary: 'Basement development must not harm structural stability, drainage, or amenity.',
    fullText: `Policy D4 controls basement development to ensure:
    - No harm to structural stability of existing buildings or neighbors
    - No adverse impact on groundwater, drainage or flooding
    - Appropriate construction methodology
    - Limited extent to protect garden character
    - No basement under trees or in flood zones`,
    relevantTo: ['basement'],
    areas: ['all'],
    keyRequirements: [
      'Maximum single basement storey',
      'Retain minimum 50% garden as soft landscaping',
      'No basement within root protection area of trees',
      'Structural methodology statement required',
      'Hydrogeological assessment for certain areas'
    ],
    designGuidance: [
      'Engage structural engineer early',
      'Commission ground investigation survey',
      'Provide detailed construction methodology',
      'Consider neighbor impacts during construction'
    ],
    exceptions: [
      'Repair or renewal of existing basement',
      'Very minor extensions to existing basements'
    ],
    relatedPolicies: ['D1', 'CC3'],
    lastUpdated: new Date('2024-01-01'),
    status: 'current',
  },
  {
    id: 'pol-d5',
    code: 'D5',
    title: 'Amenity',
    category: 'amenity',
    source: 'camden_local_plan',
    summary: 'Development must protect the amenity of neighbors and future occupants.',
    fullText: `Policy D5 protects amenity by requiring:
    - Adequate daylight, sunlight and outlook for neighbors
    - Prevention of overlooking and loss of privacy
    - Acceptable noise and disturbance levels
    - Adequate private amenity space
    - No overbearing impact on neighbors`,
    relevantTo: ['extension', 'loft_conversion', 'basement', 'new_build', 'change_of_use'],
    areas: ['all'],
    keyRequirements: [
      'BRE daylight/sunlight standards',
      '21m minimum between facing windows',
      'No significant loss of outlook',
      'Construction management plan for major works'
    ],
    designGuidance: [
      'Apply 45-degree rule for extensions',
      'Use obscure glazing for privacy',
      'Set back upper floors',
      'Position openings to avoid overlooking'
    ],
    exceptions: [],
    relatedPolicies: ['D1', 'D4'],
    lastUpdated: new Date('2024-01-01'),
    status: 'current',
  },
  {
    id: 'pol-a1',
    code: 'A1',
    title: 'Managing the Impact of Development on Occupiers and Neighbours',
    category: 'amenity',
    source: 'camden_local_plan',
    summary: 'Protects existing residential amenity from harmful development impacts.',
    fullText: `Policy A1 ensures development does not cause unacceptable harm through:
    - Loss of daylight, sunlight or outlook
    - Overlooking or loss of privacy
    - Noise, vibration, smell or other disturbance
    - Overshadowing of gardens or open spaces
    - Visual intrusion or overbearing impact`,
    relevantTo: ['extension', 'loft_conversion', 'basement', 'new_build', 'change_of_use'],
    areas: ['all'],
    keyRequirements: [
      'Daylight/sunlight assessment for sensitive schemes',
      'Privacy distance standards met',
      'No significant harm to outlook',
      'Acceptable noise levels'
    ],
    designGuidance: [
      'Early engagement with neighbors',
      'Consider light and privacy from design outset',
      'Mitigation through design rather than conditions'
    ],
    exceptions: [],
    relatedPolicies: ['D5', 'D1'],
    lastUpdated: new Date('2024-01-01'),
    status: 'current',
  },
  // Conservation Area Specific
  {
    id: 'pol-hampstead-ca',
    code: 'HAMPSTEAD-CA',
    title: 'Hampstead Conservation Area Statement',
    category: 'heritage',
    source: 'conservation_area_statement',
    summary: 'Specific guidance for development in Hampstead Conservation Area.',
    fullText: `The Hampstead Conservation Area Statement identifies the special character derived from:
    - Historic village character and street pattern
    - High quality Georgian, Victorian and Edwardian architecture
    - Mature trees and green character
    - Views to and from Hampstead Heath
    - Traditional shopfronts on the High Street`,
    relevantTo: ['extension', 'loft_conversion', 'basement', 'new_build', 'change_of_use', 'listed_building', 'shopfront'],
    areas: ['NW3'],
    keyRequirements: [
      'Traditional materials essential',
      'Subordinate extensions only',
      'Protect key views',
      'Maintain tree cover',
      'Respect building lines'
    ],
    designGuidance: [
      'Use stock brick, natural slate, timber windows',
      'No rooflights on front elevations',
      'Rear dormers only, traditionally detailed',
      'Maintain historic boundary treatments'
    ],
    exceptions: [],
    relatedPolicies: ['D2', 'D1'],
    lastUpdated: new Date('2023-06-01'),
    status: 'current',
  },
  {
    id: 'pol-highgate-ca',
    code: 'HIGHGATE-CA',
    title: 'Highgate Conservation Area Statement',
    category: 'heritage',
    source: 'conservation_area_statement',
    summary: 'Specific guidance for development in Highgate Conservation Area.',
    fullText: `The Highgate Conservation Area is characterized by:
    - Historic hilltop village setting
    - Outstanding Georgian and Victorian architecture
    - Strong relationship with Highgate Cemetery and woods
    - Important views across London
    - Traditional village high street`,
    relevantTo: ['extension', 'loft_conversion', 'basement', 'new_build', 'change_of_use', 'listed_building', 'shopfront'],
    areas: ['N6'],
    keyRequirements: [
      'Preserve hilltop character',
      'Protect views',
      'Traditional materials only',
      'Respect historic plot patterns'
    ],
    designGuidance: [
      'Brick and render traditional to area',
      'Slate or clay tile roofing',
      'Timber windows and doors',
      'High quality boundary treatments'
    ],
    exceptions: [],
    relatedPolicies: ['D2', 'D1'],
    lastUpdated: new Date('2023-06-01'),
    status: 'current',
  },
  // Trees
  {
    id: 'pol-cc2',
    code: 'CC2',
    title: 'Trees',
    category: 'trees',
    source: 'camden_local_plan',
    summary: 'Protects trees and requires new planting to maintain tree cover.',
    fullText: `Policy CC2 protects trees by:
    - Refusing development that would damage or remove significant trees
    - Requiring tree surveys for development near trees
    - Protecting TPO trees and conservation area trees
    - Requiring replacement planting where removal is acceptable
    - Requiring new tree planting in development`,
    relevantTo: ['extension', 'basement', 'new_build', 'trees'],
    areas: ['all'],
    keyRequirements: [
      'Tree survey and arboricultural impact assessment',
      'No development within root protection areas',
      'Tree protection during construction',
      'Replacement planting at 2:1 ratio'
    ],
    designGuidance: [
      'Design around retained trees',
      'Use no-dig construction methods near trees',
      'Consider crown spread and future growth',
      'Select appropriate species for new planting'
    ],
    exceptions: [
      'Dead, dying or dangerous trees',
      'Trees causing structural damage'
    ],
    relatedPolicies: ['D4', 'CC1'],
    lastUpdated: new Date('2024-01-01'),
    status: 'current',
  },
  // Sustainability
  {
    id: 'pol-cc1',
    code: 'CC1',
    title: 'Climate Change Mitigation',
    category: 'sustainability',
    source: 'camden_local_plan',
    summary: 'Requires development to minimize carbon emissions and be sustainable.',
    fullText: `Policy CC1 requires:
    - Be lean: minimize energy demand through design
    - Be clean: efficient energy supply
    - Be green: renewable energy where possible
    - Major developments to be net zero carbon
    - Retrofitting of existing buildings to improve efficiency`,
    relevantTo: ['extension', 'new_build', 'change_of_use'],
    areas: ['all'],
    keyRequirements: [
      'Energy statement for major development',
      'BREEAM Excellent for non-residential',
      'Sustainable materials',
      'Efficient heating systems'
    ],
    designGuidance: [
      'Maximize insulation',
      'Consider heat pumps',
      'Install solar panels where appropriate',
      'Use sustainable materials'
    ],
    exceptions: [
      'Listed buildings (balanced against heritage)',
      'Minor development'
    ],
    relatedPolicies: ['CC2', 'CC3'],
    lastUpdated: new Date('2024-01-01'),
    status: 'current',
  },
  // London Plan
  {
    id: 'pol-lp-d3',
    code: 'LP-D3',
    title: 'Optimising Site Capacity Through Design-Led Approach',
    category: 'design',
    source: 'london_plan',
    summary: 'London Plan policy requiring design-led approach to optimize development.',
    fullText: `London Plan Policy D3 establishes that all development must:
    - Take a design-led approach to optimizing site capacity
    - Consider local context, character, and design principles
    - Deliver high quality design
    - Create inclusive and accessible places
    - Be based on form and layout, not just density numbers`,
    relevantTo: ['new_build', 'change_of_use'],
    areas: ['all'],
    keyRequirements: [
      'Design-led approach required',
      'Context analysis',
      'Quality design review for major schemes'
    ],
    designGuidance: [
      'Character study of local area',
      'Consider massing and scale',
      'Active frontages',
      'Quality public realm'
    ],
    exceptions: [],
    relatedPolicies: ['D1'],
    lastUpdated: new Date('2021-03-01'),
    status: 'current',
  },
  {
    id: 'pol-lp-hc1',
    code: 'LP-HC1',
    title: 'Heritage Conservation and Growth',
    category: 'heritage',
    source: 'london_plan',
    summary: 'London Plan heritage policy requiring conservation of heritage assets.',
    fullText: `London Plan Policy HC1 requires:
    - Conservation of heritage assets and their settings
    - Development to conserve significance
    - Appropriate assessment of harm vs benefits
    - Enhancement of heritage assets where possible`,
    relevantTo: ['extension', 'loft_conversion', 'new_build', 'change_of_use', 'listed_building', 'demolition'],
    areas: ['all'],
    keyRequirements: [
      'Heritage impact assessment',
      'Preserve significance',
      'Enhance where possible'
    ],
    designGuidance: [
      'Understand significance before design',
      'Traditional materials and methods',
      'Reversible interventions preferred'
    ],
    exceptions: [],
    relatedPolicies: ['D2'],
    lastUpdated: new Date('2021-03-01'),
    status: 'current',
  },
];

// Planning Policy Database Service Implementation
class PlanningPolicyDatabaseService {
  private policies: Map<string, PlanningPolicy> = new Map();

  constructor() {
    POLICIES.forEach(policy => this.policies.set(policy.id, policy));
  }

  /**
   * Search policies
   */
  searchPolicies(params: PolicySearch): PlanningPolicy[] {
    let results = Array.from(this.policies.values());

    if (params.category) {
      results = results.filter(p => p.category === params.category);
    }

    if (params.projectType) {
      results = results.filter(p => p.relevantTo.includes(params.projectType!));
    }

    if (params.area) {
      results = results.filter(p => 
        p.areas.includes('all') || p.areas.includes(params.area!)
      );
    }

    if (params.source) {
      results = results.filter(p => p.source === params.source);
    }

    if (params.query) {
      const query = params.query.toLowerCase();
      results = results.filter(p =>
        p.title.toLowerCase().includes(query) ||
        p.summary.toLowerCase().includes(query) ||
        p.code.toLowerCase().includes(query) ||
        p.fullText.toLowerCase().includes(query)
      );
    }

    return results.filter(p => p.status === 'current');
  }

  /**
   * Get policy by ID
   */
  getPolicy(policyId: string): PlanningPolicy | null {
    return this.policies.get(policyId) || null;
  }

  /**
   * Get policy by code
   */
  getPolicyByCode(code: string): PlanningPolicy | null {
    return Array.from(this.policies.values()).find(p => p.code === code) || null;
  }

  /**
   * Get all policies for a project type
   */
  getPoliciesForProject(projectType: ProjectType, area?: string): PlanningPolicy[] {
    return this.searchPolicies({ projectType, area });
  }

  /**
   * Assess policy compliance for a project
   */
  assessCompliance(
    projectType: ProjectType,
    area: string,
    projectDetails: {
      inConservationArea?: boolean;
      isListedBuilding?: boolean;
      hasBasement?: boolean;
      nearTrees?: boolean;
      extensionSize?: 'small' | 'medium' | 'large';
    }
  ): PolicyAssessment {
    const applicablePolicies: ApplicablePolicy[] = [];
    const keyIssues: string[] = [];
    const recommendations: string[] = [];

    // Get relevant policies
    const policies = this.getPoliciesForProject(projectType, area);

    for (const policy of policies) {
      let relevance: ApplicablePolicy['relevance'] = 'medium';
      let complianceRisk: ApplicablePolicy['complianceRisk'] = 'low';
      let notes = '';

      // Assess relevance and risk based on project details
      if (policy.category === 'heritage') {
        if (projectDetails.inConservationArea || projectDetails.isListedBuilding) {
          relevance = 'high';
          complianceRisk = projectDetails.isListedBuilding ? 'high' : 'medium';
          notes = 'Heritage policy critical for this property';
          keyIssues.push('Heritage sensitivity requires careful design approach');
        }
      }

      if (policy.category === 'basements' && projectDetails.hasBasement) {
        relevance = 'high';
        complianceRisk = 'medium';
        notes = 'Basement policy directly applicable';
        keyIssues.push('Basement development requires structural and hydro assessments');
      }

      if (policy.category === 'trees' && projectDetails.nearTrees) {
        relevance = 'high';
        complianceRisk = 'medium';
        notes = 'Tree protection requirements apply';
        keyIssues.push('Tree survey and protection measures required');
      }

      if (policy.category === 'amenity') {
        relevance = projectDetails.extensionSize === 'large' ? 'high' : 'medium';
        complianceRisk = projectDetails.extensionSize === 'large' ? 'medium' : 'low';
        notes = 'Neighbor amenity must be protected';
      }

      applicablePolicies.push({
        policy,
        relevance,
        complianceRisk,
        notes,
      });
    }

    // Generate recommendations
    if (projectDetails.inConservationArea) {
      recommendations.push('Use traditional materials (brick, slate, timber)');
      recommendations.push('Keep extensions subordinate to main building');
      recommendations.push('Prepare heritage statement');
    }

    if (projectDetails.isListedBuilding) {
      recommendations.push('Engage conservation architect');
      recommendations.push('Minimal intervention approach');
      recommendations.push('Use traditional construction methods');
    }

    if (projectDetails.hasBasement) {
      recommendations.push('Commission structural engineer assessment');
      recommendations.push('Prepare construction management plan');
      recommendations.push('Check groundwater conditions');
    }

    if (projectDetails.nearTrees) {
      recommendations.push('Commission arboricultural survey');
      recommendations.push('Design around root protection areas');
    }

    // Calculate overall compliance likelihood
    const highRiskCount = applicablePolicies.filter(p => p.complianceRisk === 'high').length;
    const mediumRiskCount = applicablePolicies.filter(p => p.complianceRisk === 'medium').length;

    let overallCompliance: PolicyAssessment['overallCompliance'];
    if (highRiskCount >= 2) {
      overallCompliance = 'unlikely';
    } else if (highRiskCount >= 1 || mediumRiskCount >= 3) {
      overallCompliance = 'challenging';
    } else if (mediumRiskCount >= 1) {
      overallCompliance = 'possible';
    } else {
      overallCompliance = 'likely';
    }

    return {
      property: area,
      projectType,
      applicablePolicies: applicablePolicies.sort((a, b) => {
        const relevanceOrder = { high: 0, medium: 1, low: 2 };
        return relevanceOrder[a.relevance] - relevanceOrder[b.relevance];
      }),
      overallCompliance,
      keyIssues,
      recommendations,
    };
  }

  /**
   * Get policy categories
   */
  getCategories(): { category: PolicyCategory; count: number; description: string }[] {
    const categories: { category: PolicyCategory; description: string }[] = [
      { category: 'heritage', description: 'Conservation areas, listed buildings, heritage assets' },
      { category: 'design', description: 'Design quality, materials, scale and massing' },
      { category: 'housing', description: 'Housing standards, space requirements' },
      { category: 'environment', description: 'Environmental protection' },
      { category: 'transport', description: 'Parking, access, transport impact' },
      { category: 'amenity', description: 'Daylight, privacy, outlook, noise' },
      { category: 'sustainability', description: 'Energy, carbon, climate change' },
      { category: 'trees', description: 'Tree protection and planting' },
      { category: 'flooding', description: 'Flood risk, drainage' },
      { category: 'basements', description: 'Basement development controls' },
    ];

    return categories.map(cat => ({
      ...cat,
      count: Array.from(this.policies.values()).filter(p => p.category === cat.category).length,
    }));
  }

  /**
   * Get related policies
   */
  getRelatedPolicies(policyId: string): PlanningPolicy[] {
    const policy = this.policies.get(policyId);
    if (!policy) return [];

    return policy.relatedPolicies
      .map(code => this.getPolicyByCode(code))
      .filter((p): p is PlanningPolicy => p !== null);
  }
}

// Export singleton instance
export const planningPolicyDatabaseService = new PlanningPolicyDatabaseService();
