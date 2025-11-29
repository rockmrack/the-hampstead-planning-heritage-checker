/**
 * Utilities Assessment Service
 * 
 * Provides utilities and services connection guidance for development
 * projects in the Hampstead area.
 */

interface UtilitiesProject {
  dwellingUnits?: number;
  floorspace?: number;
  electricityDemand?: number;
  gasDemand?: number;
  waterDemand?: number;
  newConnection?: boolean;
  upgradeRequired?: boolean;
  siteAccess?: string;
}

interface UtilityProvider {
  service: string;
  provider: string;
  contact: string;
  leadTime: string;
}

interface ConnectionRequirement {
  service: string;
  requirement: string;
  process: string[];
  timeline: string;
  cost: string;
}

interface UtilitiesAssessment {
  address: string;
  postcode: string;
  projectType: string;
  electricityConnection: {
    provider: string;
    requirements: string[];
    loadAssessment: {
      estimated: string;
      capacity: string;
      upgrade: boolean;
    };
    process: string[];
    timeline: string;
    costs: string;
  };
  gasConnection: {
    provider: string;
    requirements: string[];
    considerations: string[];
    process: string[];
    timeline: string;
    costs: string;
    alternativeOptions: string[];
  };
  waterConnection: {
    provider: string;
    requirements: string[];
    meterRequirements: string;
    process: string[];
    timeline: string;
    costs: string;
  };
  drainageConnection: {
    provider: string;
    surfaceWater: string[];
    foulWater: string[];
    buildOver: {
      required: boolean;
      process: string[];
    };
    timeline: string;
    costs: string;
  };
  telecoms: {
    providers: string[];
    requirements: string[];
    fibreAvailability: string;
  };
  streetWorks: {
    coordination: string[];
    permits: string[];
    restrictions: string[];
  };
  utilitySurvey: {
    required: boolean;
    scope: string[];
    cost: string;
  };
  diversions: {
    likely: boolean;
    considerations: string[];
    costs: string;
  };
  wayleaves: {
    required: boolean;
    types: string[];
    process: string[];
  };
  planningConsiderations: string[];
  localFactors: string[];
  timeline: {
    phase: string;
    duration: string;
    activities: string[];
  }[];
  costs: {
    item: string;
    range: string;
    notes: string;
  }[];
  recommendations: string[];
}

// Utility providers in the area
const UTILITY_PROVIDERS = {
  electricity: {
    distribution: 'UK Power Networks (UKPN)',
    contact: '0800 029 4285',
    website: 'ukpowernetworks.co.uk'
  },
  gas: {
    distribution: 'Cadent Gas',
    contact: '0800 389 8000',
    website: 'cadentgas.com'
  },
  water: {
    supply: 'Thames Water',
    contact: '0800 316 9800',
    website: 'thameswater.co.uk'
  },
  telecoms: {
    openreach: 'Openreach',
    virgin: 'Virgin Media',
    hyperoptic: 'Hyperoptic'
  }
};

// Load estimates per dwelling
const LOAD_ESTIMATES = {
  electricity: {
    standardDwelling: '4-6 kVA',
    largeDetached: '8-12 kVA',
    withHeatPump: '8-15 kVA',
    withEVCharger: '+7 kVA per charger'
  },
  gas: {
    standardDwelling: '24-30 kW boiler',
    largeDetached: '30-40 kW boiler',
    notes: 'Future developments may not have gas'
  },
  water: {
    litresPerPerson: 150,
    litresPerPersonEfficient: 110,
    notes: 'London Plan requires 105 l/p/day'
  }
};

function getElectricityAssessment(projectDetails: UtilitiesProject): {
  provider: string;
  requirements: string[];
  loadAssessment: {
    estimated: string;
    capacity: string;
    upgrade: boolean;
  };
  process: string[];
  timeline: string;
  costs: string;
} {
  const units = projectDetails.dwellingUnits || 1;
  const estimatedLoad = projectDetails.electricityDemand || (units * 8);
  const upgradeRequired = estimatedLoad > 60;

  return {
    provider: 'UK Power Networks (UKPN)',
    requirements: [
      'Application via UKPN connection portal',
      'Site plan showing meter position',
      'Load schedule if over 69kVA',
      'Building Regulations compliance'
    ],
    loadAssessment: {
      estimated: `${estimatedLoad} kVA approximate`,
      capacity: upgradeRequired ? 'May require network reinforcement' : 'Likely within existing network capacity',
      upgrade: upgradeRequired
    },
    process: [
      'Submit budget estimate request (free)',
      'Receive budget quote (2-4 weeks)',
      'Accept quote and pay deposit',
      'UKPN design (4-8 weeks)',
      'Coordinate installation date',
      'Installation and connection'
    ],
    timeline: upgradeRequired ? '12-26 weeks' : '8-16 weeks',
    costs: upgradeRequired ? '£5,000-50,000+ (network dependent)' : '£500-3,000 standard connection'
  };
}

function getGasAssessment(projectDetails: UtilitiesProject): {
  provider: string;
  requirements: string[];
  considerations: string[];
  process: string[];
  timeline: string;
  costs: string;
  alternativeOptions: string[];
} {
  return {
    provider: 'Cadent Gas (distribution)',
    requirements: [
      'Application via Cadent or Gas Safe registered installer',
      'Site plan showing meter position',
      'Confirmation of demand',
      'Building Regulations compliance (Part J)'
    ],
    considerations: [
      'London Plan moving towards no new gas connections',
      'Heat pumps preferred for new developments',
      'Gas boilers banned in new homes from 2025',
      'Consider future-proofing for hydrogen'
    ],
    process: [
      'Check if gas available at property',
      'Submit connection application',
      'Receive quote (2-4 weeks)',
      'Accept and pay',
      'Installation (4-8 weeks)'
    ],
    timeline: '8-16 weeks',
    costs: '£400-2,500 for standard connection',
    alternativeOptions: [
      'Air source heat pump',
      'Ground source heat pump',
      'Direct electric heating',
      'Heat network connection (if available)'
    ]
  };
}

function getWaterAssessment(projectDetails: UtilitiesProject): {
  provider: string;
  requirements: string[];
  meterRequirements: string;
  process: string[];
  timeline: string;
  costs: string;
} {
  const units = projectDetails.dwellingUnits || 1;

  return {
    provider: 'Thames Water',
    requirements: [
      'Application via Thames Water Developer Services',
      'Site plan showing proposed connection point',
      'Demand calculation',
      'Self-certification of internal plumbing'
    ],
    meterRequirements: units > 1 ? 'Individual meters for each dwelling required' : 'Meter installation included',
    process: [
      'Submit application via online portal',
      'Receive quotation (10 working days)',
      'Accept and pay',
      'Thames Water schedules installation',
      'Connection made (subject to permit)'
    ],
    timeline: '6-12 weeks',
    costs: '£500-2,000 standard connection'
  };
}

function getDrainageAssessment(projectDetails: UtilitiesProject): {
  provider: string;
  surfaceWater: string[];
  foulWater: string[];
  buildOver: {
    required: boolean;
    process: string[];
  };
  timeline: string;
  costs: string;
} {
  return {
    provider: 'Thames Water',
    surfaceWater: [
      'SuDS required for major developments',
      'Connection to surface water sewer requires approval',
      'Soakaways preferred where ground conditions permit',
      'Drainage hierarchy: infiltration → watercourse → sewer'
    ],
    foulWater: [
      'Connection to foul/combined sewer',
      'Section 106 agreement may be required',
      'Contribution to sewer capacity upgrades'
    ],
    buildOver: {
      required: true, // Assumed for basement developments
      process: [
        'Commission CCTV survey of existing drains',
        'Submit build-over application to Thames Water',
        'Receive approval (21 working days)',
        'Comply with conditions during construction'
      ]
    },
    timeline: '4-8 weeks for approval',
    costs: '£300-500 build-over agreement, connection costs variable'
  };
}

function getTelecomsAssessment(): {
  providers: string[];
  requirements: string[];
  fibreAvailability: string;
} {
  return {
    providers: [
      'Openreach (BT infrastructure)',
      'Virgin Media',
      'Hyperoptic',
      'Community Fibre'
    ],
    requirements: [
      'Building Regulations Part R - broadband infrastructure',
      'Ducting to building boundary',
      'Internal distribution infrastructure'
    ],
    fibreAvailability: 'Full fibre available in most of Camden/Hampstead area'
  };
}

function getStreetWorksRequirements(): {
  coordination: string[];
  permits: string[];
  restrictions: string[];
} {
  return {
    coordination: [
      'NRSWA (New Roads and Street Works Act) permits required',
      'Coordinate multiple utility connections',
      'London Permit Scheme applies',
      'Single point of contact advisable'
    ],
    permits: [
      'Street works permit from Camden',
      'Temporary traffic management plan',
      'Hoarding license if required',
      'Skip permits'
    ],
    restrictions: [
      'Embargoed dates (Christmas, events)',
      'Peak hour working restrictions',
      'Conservation area additional requirements',
      'School run hours may be restricted'
    ]
  };
}

function getUtilitySurvey(projectDetails: UtilitiesProject): {
  required: boolean;
  scope: string[];
  cost: string;
} {
  const hasBasement = projectDetails.siteAccess === 'basement';

  return {
    required: hasBasement || Boolean(projectDetails.newConnection),
    scope: [
      'GPR (Ground Penetrating Radar) survey',
      'CAT and Genny detection',
      'Utility records search',
      'Marked up site plan',
      'Clash detection report'
    ],
    cost: '£500-2,000 depending on site size'
  };
}

function getDiversions(): {
  likely: boolean;
  considerations: string[];
  costs: string;
} {
  return {
    likely: false, // Depends on specific site
    considerations: [
      'Existing services may cross development site',
      'Diversion costs can be substantial',
      'Utility company timescales are fixed',
      'Consider design around existing services',
      'Wayleaves may be required for overhead lines'
    ],
    costs: '£5,000-100,000+ depending on service and length'
  };
}

function getWayleaves(): {
  required: boolean;
  types: string[];
  process: string[];
} {
  return {
    required: false, // Site specific
    types: [
      'Electricity wayleave (for cables/equipment)',
      'Telecoms wayleave',
      'Water easement',
      'Drainage easement'
    ],
    process: [
      'Identify services requiring wayleave',
      'Negotiate terms with utility company',
      'Legal documentation',
      'Registration with Land Registry'
    ]
  };
}

function getLocalFactors(): string[] {
  return [
    'UKPN is the Distribution Network Operator for electricity',
    'Cadent is the Gas Distribution Network',
    'Thames Water for water supply and drainage',
    'Full fibre broadband widely available',
    'Conservation areas may restrict meter box/cabinet positions',
    'Some streets have restricted working hours',
    'Coordinated street works approach recommended'
  ];
}

async function assessUtilities(
  address: string,
  postcode: string,
  projectType: string,
  projectDetails: UtilitiesProject = {}
): Promise<UtilitiesAssessment> {
  // Electricity
  const electricityConnection = getElectricityAssessment(projectDetails);

  // Gas
  const gasConnection = getGasAssessment(projectDetails);

  // Water
  const waterConnection = getWaterAssessment(projectDetails);

  // Drainage
  const drainageConnection = getDrainageAssessment(projectDetails);

  // Telecoms
  const telecoms = getTelecomsAssessment();

  // Street works
  const streetWorks = getStreetWorksRequirements();

  // Utility survey
  const utilitySurvey = getUtilitySurvey(projectDetails);

  // Diversions
  const diversions = getDiversions();

  // Wayleaves
  const wayleaves = getWayleaves();

  // Planning considerations
  const planningConsiderations = [
    'Meter positions may need approval in conservation areas',
    'External equipment screening may be required',
    'Underground services routes through landscaping',
    'Coordination with highways works'
  ];

  // Timeline
  const timeline = [
    {
      phase: 'Pre-Planning',
      duration: '2-4 weeks',
      activities: ['Utility search', 'Capacity enquiries', 'Budget estimates']
    },
    {
      phase: 'Applications',
      duration: '4-8 weeks',
      activities: ['Submit connection applications', 'Receive quotes', 'Accept and pay']
    },
    {
      phase: 'Design',
      duration: '4-8 weeks',
      activities: ['Utility company design', 'Coordination', 'Approvals']
    },
    {
      phase: 'Installation',
      duration: '2-8 weeks',
      activities: ['Street works', 'Connections', 'Testing']
    }
  ];

  // Costs
  const costs = [
    {
      item: 'Utility Survey',
      range: utilitySurvey.cost,
      notes: 'Recommended before design'
    },
    {
      item: 'Electricity Connection',
      range: electricityConnection.costs,
      notes: electricityConnection.loadAssessment.upgrade ? 'May include network upgrade' : 'Standard connection'
    },
    {
      item: 'Gas Connection',
      range: gasConnection.costs,
      notes: 'If gas being used'
    },
    {
      item: 'Water Connection',
      range: waterConnection.costs,
      notes: 'Includes meter'
    },
    {
      item: 'Drainage',
      range: drainageConnection.costs,
      notes: 'Build-over and connection'
    }
  ];

  // Recommendations
  const recommendations: string[] = [];
  
  recommendations.push('Commission utility survey early in design process');
  recommendations.push('Submit capacity enquiries before planning application');
  recommendations.push('Consider heat pump instead of gas connection');
  recommendations.push('Coordinate utility connections to minimize street works disruption');
  recommendations.push('Allow adequate programme time for utility lead times');

  return {
    address,
    postcode,
    projectType,
    electricityConnection,
    gasConnection,
    waterConnection,
    drainageConnection,
    telecoms,
    streetWorks,
    utilitySurvey,
    diversions,
    wayleaves,
    planningConsiderations,
    localFactors: getLocalFactors(),
    timeline,
    costs,
    recommendations
  };
}

// Export the service
const utilitiesAssessment = {
  assessUtilities,
  UTILITY_PROVIDERS,
  LOAD_ESTIMATES
};

export default utilitiesAssessment;
