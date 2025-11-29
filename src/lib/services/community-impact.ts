/**
 * Community Impact Assessment Service
 * 
 * Comprehensive assessment of how development projects impact the local
 * community in Hampstead and surrounding conservation areas. Covers social,
 * economic, environmental, and infrastructure considerations.
 * 
 * Coverage: NW1-NW11, N2, N6, N10 postcodes
 */

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

interface CommunityProject {
  projectType?: 'extension' | 'new_build' | 'conversion' | 'change_of_use' | 'demolition';
  numberOfUnits?: number;
  commercialUse?: boolean;
  publicAccess?: boolean;
  existingUse?: string;
  proposedUse?: string;
  siteArea?: number; // square meters
  constructionDuration?: number; // months
  expectedOccupants?: number;
}

interface ImpactCategory {
  category: string;
  impacts: Impact[];
  overallAssessment: string;
  mitigationRequired: boolean;
}

interface Impact {
  aspect: string;
  nature: 'positive' | 'negative' | 'neutral';
  significance: 'high' | 'medium' | 'low' | 'negligible';
  duration: 'permanent' | 'temporary' | 'construction_only';
  description: string;
  mitigation?: string;
}

interface StakeholderGroup {
  group: string;
  concerns: string[];
  benefits: string[];
  engagementStrategy: string;
}

interface InfrastructureAssessment {
  category: string;
  currentCapacity: string;
  additionalDemand: string;
  impact: string;
  mitigation: string;
}

interface CommunityImpactAssessment {
  summary: ImpactSummary;
  socialImpacts: ImpactCategory;
  economicImpacts: ImpactCategory;
  environmentalImpacts: ImpactCategory;
  transportImpacts: ImpactCategory;
  infrastructureAssessment: InfrastructureAssessment[];
  stakeholderAnalysis: StakeholderGroup[];
  constructionImpacts: ConstructionImpacts;
  cumulativeImpacts: CumulativeImpacts;
  communityBenefits: CommunityBenefits;
  mitigationStrategy: MitigationStrategy;
  monitoringPlan: MonitoringPlan;
  conclusion: ImpactConclusion;
}

interface ImpactSummary {
  overallImpact: string;
  significantPositives: string[];
  significantNegatives: string[];
  keyMitigations: string[];
  communityAcceptability: string;
}

interface ConstructionImpacts {
  duration: string;
  peakActivity: string;
  impacts: Impact[];
  managementMeasures: string[];
}

interface CumulativeImpacts {
  otherDevelopments: string[];
  combinedEffects: string[];
  assessment: string;
}

interface CommunityBenefits {
  direct: string[];
  indirect: string[];
  economic: string[];
  potentialContributions: string[];
}

interface MitigationStrategy {
  constructionPhase: string[];
  operationalPhase: string[];
  communityEngagement: string[];
  monitoring: string[];
}

interface MonitoringPlan {
  indicators: MonitoringIndicator[];
  reportingFrequency: string;
  responsibleParty: string;
}

interface MonitoringIndicator {
  indicator: string;
  method: string;
  trigger: string;
  response: string;
}

interface ImpactConclusion {
  statement: string;
  overallBalance: string;
  conditions: string[];
  recommendations: string[];
}

// =============================================================================
// MAIN SERVICE FUNCTION
// =============================================================================

async function assessCommunityImpact(
  address: string,
  postcode: string,
  projectType: string,
  projectDetails: CommunityProject = {}
): Promise<CommunityImpactAssessment> {
  const summary = generateImpactSummary(projectType, projectDetails);
  const socialImpacts = assessSocialImpacts(projectDetails);
  const economicImpacts = assessEconomicImpacts(projectDetails);
  const environmentalImpacts = assessEnvironmentalImpacts(projectDetails);
  const transportImpacts = assessTransportImpacts(projectDetails);
  const infrastructureAssessment = assessInfrastructure(projectDetails);
  const stakeholderAnalysis = analyzeStakeholders(projectDetails);
  const constructionImpacts = assessConstructionImpacts(projectDetails);
  const cumulativeImpacts = assessCumulativeImpacts(postcode);
  const communityBenefits = identifyCommunityBenefits(projectDetails);
  const mitigationStrategy = developMitigationStrategy(projectDetails);
  const monitoringPlan = createMonitoringPlan(projectDetails);
  const conclusion = generateConclusion(projectDetails);

  return {
    summary,
    socialImpacts,
    economicImpacts,
    environmentalImpacts,
    transportImpacts,
    infrastructureAssessment,
    stakeholderAnalysis,
    constructionImpacts,
    cumulativeImpacts,
    communityBenefits,
    mitigationStrategy,
    monitoringPlan,
    conclusion
  };
}

// =============================================================================
// IMPACT SUMMARY
// =============================================================================

function generateImpactSummary(
  projectType: string,
  projectDetails: CommunityProject
): ImpactSummary {
  const isLargeDevelopment = (projectDetails.numberOfUnits || 0) >= 10 ||
    (projectDetails.siteArea || 0) >= 1000;

  return {
    overallImpact: isLargeDevelopment ? 'Moderate' : 'Minor',
    significantPositives: [
      'Contribution to housing supply',
      'Economic activity during construction',
      'Potential improvement to built environment',
      'Council tax/business rates contribution'
    ],
    significantNegatives: [
      'Construction period disruption',
      'Increased pressure on local services',
      'Traffic and parking impacts',
      'Potential visual impact on streetscene'
    ],
    keyMitigations: [
      'Construction Management Plan',
      'Community liaison during works',
      'Traffic management measures',
      'Design quality controls'
    ],
    communityAcceptability: 'Likely acceptable with appropriate mitigation measures'
  };
}

// =============================================================================
// SOCIAL IMPACTS
// =============================================================================

function assessSocialImpacts(projectDetails: CommunityProject): ImpactCategory {
  const impacts: Impact[] = [
    {
      aspect: 'Housing provision',
      nature: 'positive',
      significance: (projectDetails.numberOfUnits || 0) >= 5 ? 'medium' : 'low',
      duration: 'permanent',
      description: 'Contribution to local housing supply',
      mitigation: 'N/A - positive impact'
    },
    {
      aspect: 'Population change',
      nature: (projectDetails.numberOfUnits || 0) >= 10 ? 'negative' : 'neutral',
      significance: 'low',
      duration: 'permanent',
      description: 'Additional residents in the area',
      mitigation: 'Ensure adequate infrastructure capacity'
    },
    {
      aspect: 'Community cohesion',
      nature: 'neutral',
      significance: 'low',
      duration: 'permanent',
      description: 'New residents joining existing community',
      mitigation: 'Community engagement and integration support'
    },
    {
      aspect: 'Privacy and amenity',
      nature: 'negative',
      significance: 'medium',
      duration: 'permanent',
      description: 'Potential impact on neighboring properties',
      mitigation: 'Design measures to protect privacy; landscaping'
    },
    {
      aspect: 'Quality of life during construction',
      nature: 'negative',
      significance: 'medium',
      duration: 'construction_only',
      description: 'Noise, dust, and disruption during works',
      mitigation: 'Construction Management Plan with strict controls'
    }
  ];

  return {
    category: 'Social Impacts',
    impacts,
    overallAssessment: 'Limited long-term social impact; temporary construction effects manageable',
    mitigationRequired: true
  };
}

// =============================================================================
// ECONOMIC IMPACTS
// =============================================================================

function assessEconomicImpacts(projectDetails: CommunityProject): ImpactCategory {
  const constructionValue = estimateConstructionValue(projectDetails);

  const impacts: Impact[] = [
    {
      aspect: 'Construction employment',
      nature: 'positive',
      significance: 'medium',
      duration: 'temporary',
      description: `Estimated ${Math.round(constructionValue / 100000)} construction jobs during works`,
      mitigation: 'N/A - positive impact'
    },
    {
      aspect: 'Local spend during construction',
      nature: 'positive',
      significance: 'low',
      duration: 'temporary',
      description: 'Workers spending in local shops and cafes',
      mitigation: 'N/A - positive impact'
    },
    {
      aspect: 'Property values',
      nature: 'positive',
      significance: 'low',
      duration: 'permanent',
      description: 'Quality development generally supports area values',
      mitigation: 'N/A - positive impact'
    },
    {
      aspect: 'Council tax/business rates',
      nature: 'positive',
      significance: 'low',
      duration: 'permanent',
      description: 'Additional revenue for local authority',
      mitigation: 'N/A - positive impact'
    },
    {
      aspect: 'Competition for parking',
      nature: 'negative',
      significance: 'low',
      duration: 'permanent',
      description: 'Additional vehicles potentially competing for parking',
      mitigation: 'Adequate on-site parking provision'
    }
  ];

  if (projectDetails.commercialUse) {
    impacts.push({
      aspect: 'Local business competition',
      nature: 'neutral',
      significance: 'low',
      duration: 'permanent',
      description: 'New commercial use may compete with existing businesses',
      mitigation: 'Assess local market capacity'
    });
  }

  return {
    category: 'Economic Impacts',
    impacts,
    overallAssessment: 'Net positive economic impact through construction and ongoing contributions',
    mitigationRequired: false
  };
}

function estimateConstructionValue(projectDetails: CommunityProject): number {
  const baseValues: Record<string, number> = {
    extension: 80000,
    new_build: 350000,
    conversion: 150000,
    change_of_use: 50000,
    demolition: 20000
  };
  return (baseValues[projectDetails.projectType || 'extension'] || 100000) * (projectDetails.numberOfUnits || 1);
}

// =============================================================================
// ENVIRONMENTAL IMPACTS
// =============================================================================

function assessEnvironmentalImpacts(projectDetails: CommunityProject): ImpactCategory {
  const impacts: Impact[] = [
    {
      aspect: 'Air quality (construction)',
      nature: 'negative',
      significance: 'low',
      duration: 'construction_only',
      description: 'Dust and vehicle emissions during construction',
      mitigation: 'Dust suppression measures; low emission vehicles'
    },
    {
      aspect: 'Noise (construction)',
      nature: 'negative',
      significance: 'medium',
      duration: 'construction_only',
      description: 'Construction noise affecting neighbors',
      mitigation: 'Working hours restrictions; noise barriers; quiet equipment'
    },
    {
      aspect: 'Ecology and biodiversity',
      nature: 'negative',
      significance: 'low',
      duration: 'permanent',
      description: 'Potential loss of garden habitat',
      mitigation: 'Biodiversity net gain measures; bird/bat boxes'
    },
    {
      aspect: 'Urban greening',
      nature: 'neutral',
      significance: 'low',
      duration: 'permanent',
      description: 'Change to green cover on site',
      mitigation: 'Landscaping scheme; tree planting'
    },
    {
      aspect: 'Drainage and flood risk',
      nature: 'neutral',
      significance: 'low',
      duration: 'permanent',
      description: 'Change to impermeable area',
      mitigation: 'SuDS; permeable paving; green roof'
    },
    {
      aspect: 'Energy and carbon',
      nature: 'positive',
      significance: 'low',
      duration: 'permanent',
      description: 'Modern construction to current energy standards',
      mitigation: 'N/A - modern standards required'
    }
  ];

  return {
    category: 'Environmental Impacts',
    impacts,
    overallAssessment: 'Temporary construction impacts; long-term impacts limited with mitigation',
    mitigationRequired: true
  };
}

// =============================================================================
// TRANSPORT IMPACTS
// =============================================================================

function assessTransportImpacts(projectDetails: CommunityProject): ImpactCategory {
  const impacts: Impact[] = [
    {
      aspect: 'Construction traffic',
      nature: 'negative',
      significance: 'medium',
      duration: 'construction_only',
      description: 'Delivery vehicles and worker trips during construction',
      mitigation: 'Construction Traffic Management Plan; delivery scheduling'
    },
    {
      aspect: 'Pedestrian safety',
      nature: 'negative',
      significance: 'low',
      duration: 'construction_only',
      description: 'Temporary impacts from construction activities',
      mitigation: 'Safe pedestrian routes; banksmen; signage'
    },
    {
      aspect: 'Operational traffic',
      nature: 'neutral',
      significance: 'low',
      duration: 'permanent',
      description: 'Vehicle movements from completed development',
      mitigation: 'Travel plan; cycle parking; EV charging'
    },
    {
      aspect: 'Parking demand',
      nature: 'negative',
      significance: 'low',
      duration: 'permanent',
      description: 'Additional parking demand',
      mitigation: 'On-site parking provision; permit control'
    },
    {
      aspect: 'Public transport capacity',
      nature: 'neutral',
      significance: 'negligible',
      duration: 'permanent',
      description: 'Additional demand on existing services',
      mitigation: 'Promote sustainable transport'
    }
  ];

  return {
    category: 'Transport Impacts',
    impacts,
    overallAssessment: 'Construction traffic manageable; operational impact limited',
    mitigationRequired: true
  };
}

// =============================================================================
// INFRASTRUCTURE ASSESSMENT
// =============================================================================

function assessInfrastructure(projectDetails: CommunityProject): InfrastructureAssessment[] {
  const additionalUnits = projectDetails.numberOfUnits || 1;
  const additionalPeople = additionalUnits * 2.3; // Average household size

  return [
    {
      category: 'Education',
      currentCapacity: 'Variable - some schools oversubscribed',
      additionalDemand: `Approximately ${Math.round(additionalPeople * 0.2)} school-age children`,
      impact: additionalUnits >= 10 ? 'Moderate' : 'Negligible',
      mitigation: additionalUnits >= 10 ? 'CIL/S106 contribution towards education' : 'None required'
    },
    {
      category: 'Healthcare',
      currentCapacity: 'GP practices accepting patients; some capacity pressures',
      additionalDemand: `Approximately ${Math.round(additionalPeople)} new patients`,
      impact: 'Negligible',
      mitigation: 'None required for small schemes'
    },
    {
      category: 'Utilities - Water',
      currentCapacity: 'Thames Water supply adequate',
      additionalDemand: 'Standard domestic demand',
      impact: 'Negligible',
      mitigation: 'Water efficiency measures; connection application'
    },
    {
      category: 'Utilities - Electricity',
      currentCapacity: 'UKPN supply available',
      additionalDemand: 'Standard domestic demand',
      impact: 'Negligible',
      mitigation: 'DNO connection application'
    },
    {
      category: 'Drainage',
      currentCapacity: 'Combined sewer system; some capacity constraints',
      additionalDemand: 'Additional foul and surface water',
      impact: 'Low',
      mitigation: 'SuDS to reduce surface water runoff'
    },
    {
      category: 'Open Space',
      currentCapacity: 'Good provision in Hampstead area (Heath nearby)',
      additionalDemand: 'Additional users',
      impact: 'Negligible',
      mitigation: 'On-site amenity space where possible'
    }
  ];
}

// =============================================================================
// STAKEHOLDER ANALYSIS
// =============================================================================

function analyzeStakeholders(projectDetails: CommunityProject): StakeholderGroup[] {
  return [
    {
      group: 'Immediate neighbors',
      concerns: ['Construction disruption', 'Privacy', 'Light', 'Property values'],
      benefits: ['Area improvement', 'Reduced dereliction/vacant sites'],
      engagementStrategy: 'Direct consultation; individual meetings; construction management plan'
    },
    {
      group: 'Wider residents',
      concerns: ['Traffic', 'Parking', 'Character of area', 'Precedent'],
      benefits: ['Housing provision', 'Economic activity'],
      engagementStrategy: 'Public notice; community meeting if major scheme'
    },
    {
      group: 'Local businesses',
      concerns: ['Disruption during construction', 'Competition'],
      benefits: ['Construction spend', 'New customers'],
      engagementStrategy: 'Written notification; minimize trading disruption'
    },
    {
      group: 'Conservation/amenity groups',
      concerns: ['Heritage impact', 'Design quality', 'Character'],
      benefits: ['Quality development', 'Heritage preservation'],
      engagementStrategy: 'Pre-application consultation; heritage statement'
    },
    {
      group: 'Local authority',
      concerns: ['Policy compliance', 'Infrastructure', 'Community impact'],
      benefits: ['Housing delivery', 'Council tax', 'CIL/S106'],
      engagementStrategy: 'Pre-application advice; policy compliance'
    }
  ];
}

// =============================================================================
// CONSTRUCTION IMPACTS
// =============================================================================

function assessConstructionImpacts(projectDetails: CommunityProject): ConstructionImpacts {
  const duration = projectDetails.constructionDuration || 6;

  return {
    duration: `${duration} months`,
    peakActivity: 'Months 2-4 (structural works)',
    impacts: [
      {
        aspect: 'Noise',
        nature: 'negative',
        significance: 'medium',
        duration: 'construction_only',
        description: 'Construction noise during working hours',
        mitigation: 'Restricted hours; noise barriers; quiet equipment'
      },
      {
        aspect: 'Dust',
        nature: 'negative',
        significance: 'medium',
        duration: 'construction_only',
        description: 'Dust from demolition and construction',
        mitigation: 'Damping down; covered vehicles; wheel wash'
      },
      {
        aspect: 'Traffic',
        nature: 'negative',
        significance: 'medium',
        duration: 'construction_only',
        description: 'Construction vehicles and deliveries',
        mitigation: 'Delivery management plan; scheduling'
      },
      {
        aspect: 'Visual impact',
        nature: 'negative',
        significance: 'low',
        duration: 'construction_only',
        description: 'Hoarding, scaffolding, site compound',
        mitigation: 'Quality hoarding; regular cleaning; artwork'
      }
    ],
    managementMeasures: [
      'Considerate Constructors Scheme registration',
      'Construction Management Plan approval',
      'Working hours restrictions (08:00-18:00 weekdays; 08:00-13:00 Saturday)',
      'No work on Sundays or Bank Holidays',
      'Site manager as single point of contact',
      'Regular neighbor updates',
      'Immediate response to complaints'
    ]
  };
}

// =============================================================================
// CUMULATIVE IMPACTS
// =============================================================================

function assessCumulativeImpacts(postcode: string): CumulativeImpacts {
  return {
    otherDevelopments: [
      'Review of pending planning applications in vicinity',
      'Consideration of approved but not implemented schemes',
      'Awareness of development plan allocations'
    ],
    combinedEffects: [
      'Construction overlap potential - traffic management coordination',
      'Combined housing delivery contribution',
      'Aggregate infrastructure demand'
    ],
    assessment: 'Cumulative impacts to be assessed in context of local development; coordination with other active sites recommended'
  };
}

// =============================================================================
// COMMUNITY BENEFITS
// =============================================================================

function identifyCommunityBenefits(projectDetails: CommunityProject): CommunityBenefits {
  return {
    direct: [
      'New housing provision',
      'Improved building standards',
      'Enhanced energy efficiency',
      'Potential public realm improvements'
    ],
    indirect: [
      'Support for local shops and services',
      'Community diversity and vitality',
      'Reduced vacancy/dereliction',
      'Investment in area'
    ],
    economic: [
      'Construction employment',
      'Local supplier opportunities',
      'Council tax contribution',
      'CIL payments for infrastructure'
    ],
    potentialContributions: [
      'Affordable housing (if 10+ units)',
      'CIL payment for local infrastructure',
      'S106 contributions if required',
      'Public realm improvements',
      'Community facilities (larger schemes)'
    ]
  };
}

// =============================================================================
// MITIGATION STRATEGY
// =============================================================================

function developMitigationStrategy(projectDetails: CommunityProject): MitigationStrategy {
  return {
    constructionPhase: [
      'Comprehensive Construction Management Plan',
      'Working hours restrictions',
      'Dust and noise suppression measures',
      'Traffic management and delivery scheduling',
      'Wheel washing and road cleaning',
      'Site security and hoarding',
      'Complaints handling procedure'
    ],
    operationalPhase: [
      'Design measures to protect neighbor amenity',
      'Landscaping and screening',
      'Adequate parking provision',
      'Refuse and recycling storage',
      'Cycle parking and sustainable transport'
    ],
    communityEngagement: [
      'Pre-application neighbor consultation',
      'Regular progress updates during construction',
      'Dedicated contact for queries/complaints',
      'Post-completion follow-up'
    ],
    monitoring: [
      'Construction activity monitoring',
      'Noise and dust levels if required',
      'Traffic movements during construction',
      'Complaints log and response tracking'
    ]
  };
}

// =============================================================================
// MONITORING PLAN
// =============================================================================

function createMonitoringPlan(projectDetails: CommunityProject): MonitoringPlan {
  return {
    indicators: [
      {
        indicator: 'Noise levels',
        method: 'Periodic monitoring at site boundary',
        trigger: 'Exceedance of permitted levels',
        response: 'Additional mitigation measures; equipment review'
      },
      {
        indicator: 'Dust deposition',
        method: 'Visual inspection; neighbor feedback',
        trigger: 'Complaints or visible dust',
        response: 'Enhanced damping; additional controls'
      },
      {
        indicator: 'Traffic disruption',
        method: 'Delivery log; neighbor feedback',
        trigger: 'Congestion or parking issues',
        response: 'Revised delivery scheduling'
      },
      {
        indicator: 'Complaints',
        method: 'Complaints log maintained by site manager',
        trigger: 'Any complaint received',
        response: '24-hour acknowledgment; resolution within 7 days'
      }
    ],
    reportingFrequency: 'Monthly during construction; as required operationally',
    responsibleParty: 'Principal Contractor during construction; Site Owner thereafter'
  };
}

// =============================================================================
// CONCLUSION
// =============================================================================

function generateConclusion(projectDetails: CommunityProject): ImpactConclusion {
  return {
    statement: 'The proposed development will have limited permanent impacts on the local community, with positive contributions through housing provision and economic activity outweighing negative effects. Temporary construction impacts are manageable through robust mitigation measures.',
    overallBalance: 'Positive - benefits outweigh impacts with mitigation',
    conditions: [
      'Construction Management Plan approval before commencement',
      'Working hours restrictions',
      'Neighbor notification prior to works',
      'Complaints handling procedure in place'
    ],
    recommendations: [
      'Early engagement with immediate neighbors',
      'Considerate Constructors registration',
      'Regular communication during works',
      'Quality-focused design and materials',
      'Post-completion neighbor follow-up'
    ]
  };
}

// =============================================================================
// EXPORTS
// =============================================================================

const communityImpact = {
  assessCommunityImpact
};

export default communityImpact;
