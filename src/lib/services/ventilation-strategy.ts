/**
 * Ventilation Strategy Service
 * 
 * Provides ventilation design guidance for development projects
 * in the Hampstead area, covering Part F compliance and air quality.
 */

interface VentilationProject {
  dwellingUnits?: number;
  floorspace?: number;
  buildingType?: string;
  airtightness?: number;
  heritageConstraints?: boolean;
  kitchenType?: string;
  bathroomCount?: number;
  hasBasement?: boolean;
}

interface VentilationSystem {
  type: string;
  description: string;
  pros: string[];
  cons: string[];
  applicability: string;
  cost: string;
  heritageConsiderations: string;
}

interface AirQualityRequirements {
  pollutant: string;
  standard: string;
  relevance: string;
}

interface PartFRequirements {
  category: string;
  requirement: string;
  values: string[];
}

interface VentilationAssessment {
  address: string;
  postcode: string;
  projectType: string;
  partFRequirements: {
    background: PartFRequirements[];
    extract: PartFRequirements[];
    purge: PartFRequirements[];
  };
  systemOptions: VentilationSystem[];
  recommendedSystem: {
    system: string;
    reasoning: string[];
    specification: string[];
  };
  airQuality: {
    assessment: string;
    requirements: AirQualityRequirements[];
    mitigation: string[];
  };
  ductworkDesign: {
    principles: string[];
    specifications: string[];
  };
  acoustics: {
    considerations: string[];
    standards: string[];
  };
  condensation: {
    risks: string[];
    mitigation: string[];
  };
  commissioning: {
    requirements: string[];
    testing: string[];
  };
  maintenance: {
    requirements: string[];
    access: string[];
  };
  planningConditions: string[];
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

// Part F ventilation rates
const PART_F_RATES = {
  wholeBuilding: {
    backgroundRate: 0.3, // l/s per m² of floor area
    minimumRate: 0.15 // l/s per m² at minimum
  },
  extractRates: {
    kitchen: { intermittent: 60, continuous: 13 }, // l/s
    bathroom: { intermittent: 15, continuous: 8 },
    wc: { intermittent: 6, continuous: 6 },
    utility: { intermittent: 30, continuous: 8 }
  },
  purgeVentilation: {
    requirement: '4 air changes per hour minimum',
    method: 'Opening windows typically'
  }
};

// Ventilation systems
const VENTILATION_SYSTEMS: Record<string, {
  description: string;
  efficiency: string;
  heatRecovery: boolean;
}> = {
  'natural': {
    description: 'Trickle vents, opening windows, passive stacks',
    efficiency: 'No energy use for ventilation',
    heatRecovery: false
  },
  'extract-only': {
    description: 'Mechanical extract with natural supply',
    efficiency: 'Low energy fans',
    heatRecovery: false
  },
  'MEV': {
    description: 'Mechanical Extract Ventilation - continuous low-rate extract',
    efficiency: 'Low energy, continuous operation',
    heatRecovery: false
  },
  'MVHR': {
    description: 'Mechanical Ventilation with Heat Recovery',
    efficiency: 'Higher energy but 80-95% heat recovery',
    heatRecovery: true
  },
  'dMVHR': {
    description: 'Decentralized MVHR - room-by-room units',
    efficiency: 'Good heat recovery, simpler installation',
    heatRecovery: true
  },
  'PIV': {
    description: 'Positive Input Ventilation - pressurizes building',
    efficiency: 'Simple, low maintenance',
    heatRecovery: false
  }
};

// Air quality standards
const AIR_QUALITY_STANDARDS = {
  NO2: { annual: 40, hourly: 200, unit: 'μg/m³' },
  PM10: { annual: 40, daily: 50, unit: 'μg/m³' },
  PM2_5: { annual: 20, unit: 'μg/m³' }
};

function getPartFRequirements(projectDetails: VentilationProject): {
  background: PartFRequirements[];
  extract: PartFRequirements[];
  purge: PartFRequirements[];
} {
  const background: PartFRequirements[] = [
    {
      category: 'Whole dwelling',
      requirement: 'Background ventilation rate',
      values: ['0.3 l/s per m² floor area', 'Minimum 0.15 l/s per m² at low rate']
    },
    {
      category: 'Trickle vents',
      requirement: 'Background ventilators in habitable rooms',
      values: ['5000 mm² equivalent area minimum per room', '2500 mm² in bathrooms/WCs']
    },
    {
      category: 'Cross ventilation',
      requirement: 'Air paths through dwelling',
      values: ['10mm undercuts to doors', 'Or equivalent air transfer']
    }
  ];

  const extract: PartFRequirements[] = [
    {
      category: 'Kitchen',
      requirement: 'Extract ventilation',
      values: [`${PART_F_RATES.extractRates.kitchen.intermittent} l/s intermittent`, 
               `${PART_F_RATES.extractRates.kitchen.continuous} l/s continuous`]
    },
    {
      category: 'Bathroom',
      requirement: 'Extract ventilation',
      values: [`${PART_F_RATES.extractRates.bathroom.intermittent} l/s intermittent`,
               `${PART_F_RATES.extractRates.bathroom.continuous} l/s continuous`]
    },
    {
      category: 'WC',
      requirement: 'Extract ventilation',
      values: [`${PART_F_RATES.extractRates.wc.intermittent} l/s intermittent`,
               `${PART_F_RATES.extractRates.wc.continuous} l/s continuous`]
    }
  ];

  const purge: PartFRequirements[] = [
    {
      category: 'Habitable rooms',
      requirement: 'Purge ventilation',
      values: ['4 ACH minimum', 'Openable window = 1/20th floor area minimum']
    }
  ];

  return { background, extract, purge };
}

function getSystemOptions(projectDetails: VentilationProject): VentilationSystem[] {
  const systems: VentilationSystem[] = [];
  const isAirtight = (projectDetails.airtightness || 10) < 5;

  systems.push({
    type: 'Natural Ventilation',
    description: 'Trickle vents, opening windows, passive stacks',
    pros: ['No running costs', 'No maintenance of mechanical systems', 'Silent operation', 'User control'],
    cons: ['Heat loss in winter', 'Limited control', 'Relies on user behavior', 'Not suitable for airtight buildings'],
    applicability: isAirtight ? 'Not recommended for airtight buildings' : 'Suitable for buildings >5 m³/hr.m²',
    cost: '£500-1,500',
    heritageConsiderations: 'Compatible - traditional approach. Trickle vents may affect window appearance.'
  });

  systems.push({
    type: 'Mechanical Extract Ventilation (MEV)',
    description: 'Continuous low-rate extract from wet rooms',
    pros: ['Simple system', 'Low maintenance', 'Continuous air quality', 'Works with trickle vents'],
    cons: ['Heat loss through supply air', 'Requires ducting to extract points'],
    applicability: 'Suitable for most residential applications',
    cost: '£1,500-3,000',
    heritageConsiderations: 'External grilles need consideration. Ducting routes may be challenging.'
  });

  if (isAirtight) {
    systems.push({
      type: 'MVHR (Whole House)',
      description: 'Balanced supply and extract with heat recovery',
      pros: ['80-95% heat recovery', 'Filtered air supply', 'Controlled environment', 'Energy efficient'],
      cons: ['Higher capital cost', 'Requires ducting throughout', 'Filter maintenance', 'Some energy use'],
      applicability: 'Recommended for airtight buildings (<3 m³/hr.m²)',
      cost: '£4,000-8,000',
      heritageConsiderations: 'Requires duct routes - challenging in heritage properties. External terminals visible.'
    });
  }

  systems.push({
    type: 'Decentralized MVHR (dMVHR)',
    description: 'Room-by-room units through external wall',
    pros: ['No central ductwork', 'Simpler installation', 'Room-by-room control', 'Good heat recovery'],
    cons: ['Multiple external penetrations', 'Visible internal units', 'Higher running costs than central MVHR'],
    applicability: 'Good for refurbishment and heritage buildings',
    cost: '£600-1,200 per room',
    heritageConsiderations: 'Requires external wall penetrations - may not be acceptable on listed facades.'
  });

  systems.push({
    type: 'Positive Input Ventilation (PIV)',
    description: 'Pressurizes building from loft space',
    pros: ['Very simple installation', 'Low cost', 'Reduces condensation', 'Low maintenance'],
    cons: ['Heat loss in winter', 'Not suitable for flats', 'Limited effectiveness for pollutants'],
    applicability: 'Good for condensation control in houses with lofts',
    cost: '£500-1,500',
    heritageConsiderations: 'Loft unit only - no external visibility. Good heritage option.'
  });

  return systems;
}

function getRecommendedSystem(projectDetails: VentilationProject): {
  system: string;
  reasoning: string[];
  specification: string[];
} {
  const isAirtight = (projectDetails.airtightness || 10) < 5;
  const isHeritage = projectDetails.heritageConstraints || false;

  let system: string;
  const reasoning: string[] = [];
  const specification: string[] = [];

  if (isAirtight && !isHeritage) {
    system = 'Centralized MVHR';
    reasoning.push('Building airtightness suits MVHR');
    reasoning.push('Maximum heat recovery potential');
    reasoning.push('Improved air quality with filtration');
    specification.push('Heat recovery efficiency >85%');
    specification.push('SFP <0.7 W/(l/s)');
    specification.push('F7 supply filter minimum');
    specification.push('Summer bypass mode');
  } else if (isHeritage) {
    system = 'Decentralized MVHR or MEV';
    reasoning.push('Heritage constraints limit ductwork');
    reasoning.push('Minimizes impact on historic fabric');
    reasoning.push('Room-by-room installation possible');
    specification.push('Through-wall units where permitted');
    specification.push('Discrete external terminals');
    specification.push('Consider alternative locations for grilles');
  } else {
    system = 'Mechanical Extract Ventilation (MEV)';
    reasoning.push('Suitable for standard construction');
    reasoning.push('Good balance of performance and cost');
    reasoning.push('Works with trickle vents for supply');
    specification.push('Continuous operation at low rate');
    specification.push('Boost mode for cooking/bathing');
    specification.push('Low noise fans');
  }

  return { system, reasoning, specification };
}

function getAirQualityRequirements(postcode: string): {
  assessment: string;
  requirements: AirQualityRequirements[];
  mitigation: string[];
} {
  const requirements: AirQualityRequirements[] = [
    {
      pollutant: 'NO₂ (Nitrogen Dioxide)',
      standard: `Annual mean: ${AIR_QUALITY_STANDARDS.NO2.annual} μg/m³`,
      relevance: 'Traffic emissions - common in London'
    },
    {
      pollutant: 'PM10 (Particulate Matter)',
      standard: `Annual mean: ${AIR_QUALITY_STANDARDS.PM10.annual} μg/m³`,
      relevance: 'Traffic, construction, general pollution'
    },
    {
      pollutant: 'PM2.5 (Fine Particulates)',
      standard: `Annual mean: ${AIR_QUALITY_STANDARDS.PM2_5.annual} μg/m³`,
      relevance: 'Health-critical fine particles'
    }
  ];

  const mitigation: string[] = [
    'Site air inlets away from pollution sources',
    'Use filtration (F7 minimum) on mechanical supply',
    'Consider NOx filtration near busy roads',
    'Set back habitable rooms from roads where possible',
    'Winter gardens/buffer spaces as air locks'
  ];

  return {
    assessment: 'Air Quality Neutral Assessment required for major developments',
    requirements,
    mitigation
  };
}

function getDuctworkDesign(): {
  principles: string[];
  specifications: string[];
} {
  return {
    principles: [
      'Minimize duct lengths and bends',
      'Size for low velocity (<3 m/s in occupied areas)',
      'Accessible for cleaning and maintenance',
      'Insulate in unconditioned spaces',
      'Fire dampers at compartment boundaries'
    ],
    specifications: [
      'Rigid duct preferred (lower resistance)',
      'Semi-rigid acceptable for short connections',
      'Flexible only for final connections (<1m)',
      'Sealed joints (Class C minimum)',
      'External terminals: weather protection, insect mesh'
    ]
  };
}

function getAcousticConsiderations(): {
  considerations: string[];
  standards: string[];
} {
  return {
    considerations: [
      'Fan noise at source',
      'Breakout noise from ducts',
      'Terminal noise',
      'Crosstalk between rooms via ducts',
      'External noise ingress through vents'
    ],
    standards: [
      'Bedrooms: <30 dB LAeq',
      'Living rooms: <35 dB LAeq',
      'Part F limit: NR25-30',
      'Acoustic attenuators may be required',
      'Low-noise fan selection important'
    ]
  };
}

function getCondensationMitigation(): {
  risks: string[];
  mitigation: string[];
} {
  return {
    risks: [
      'Surface condensation on cold surfaces',
      'Interstitial condensation in construction',
      'Mould growth in poorly ventilated areas',
      'Increased risk with airtight construction'
    ],
    mitigation: [
      'Adequate background ventilation',
      'Extract ventilation from moisture sources',
      'Maintain surface temperatures (insulation)',
      'Humidity-controlled extract',
      'User guidance on ventilation use'
    ]
  };
}

function getCommissioningRequirements(): {
  requirements: string[];
  testing: string[];
} {
  return {
    requirements: [
      'System balanced to design flow rates',
      'Building Regulations compliance certificate',
      'Commissioning data recorded',
      'User instructions provided',
      'Maintenance schedule issued'
    ],
    testing: [
      'Flow rate measurement at each terminal',
      'System pressure test',
      'Noise measurement',
      'MVHR heat recovery efficiency test',
      'Airtightness test (separate)'
    ]
  };
}

function getMaintenanceRequirements(): {
  requirements: string[];
  access: string[];
} {
  return {
    requirements: [
      'Filter replacement (MVHR): 6-12 monthly',
      'Fan cleaning: annually',
      'Ductwork inspection: 5 yearly',
      'Heat exchanger cleaning: 2-5 yearly',
      'Terminal cleaning: annually'
    ],
    access: [
      'Access panels to all duct junctions',
      'MVHR unit in accessible location',
      'Space around unit for filter change',
      'Access to external terminals for cleaning'
    ]
  };
}

function getLocalFactors(): string[] {
  return [
    'Camden Air Quality Management Area - whole borough',
    'Busy roads: air quality consideration for inlet positions',
    'Heritage buildings: discrete terminal locations important',
    'Loft conversions common - consider ventilation strategy',
    'Basements: particular attention to moisture control',
    'Conservation areas: external terminals may need approval'
  ];
}

async function assessVentilation(
  address: string,
  postcode: string,
  projectType: string,
  projectDetails: VentilationProject = {}
): Promise<VentilationAssessment> {
  // Part F requirements
  const partFRequirements = getPartFRequirements(projectDetails);

  // System options
  const systemOptions = getSystemOptions(projectDetails);

  // Recommended system
  const recommendedSystem = getRecommendedSystem(projectDetails);

  // Air quality
  const airQuality = getAirQualityRequirements(postcode);

  // Ductwork design
  const ductworkDesign = getDuctworkDesign();

  // Acoustics
  const acoustics = getAcousticConsiderations();

  // Condensation
  const condensation = getCondensationMitigation();

  // Commissioning
  const commissioning = getCommissioningRequirements();

  // Maintenance
  const maintenance = getMaintenanceRequirements();

  // Planning conditions
  const planningConditions = [
    'Ventilation strategy as approved',
    'External terminal positions as shown',
    'Noise mitigation measures (if required)',
    'Air quality mitigation (if applicable)'
  ];

  // Timeline
  const timeline = [
    {
      phase: 'Design',
      duration: '2-4 weeks',
      activities: ['Strategy development', 'System selection', 'Duct routing design']
    },
    {
      phase: 'Specification',
      duration: '1-2 weeks',
      activities: ['Equipment selection', 'Acoustic design', 'Detail drawings']
    },
    {
      phase: 'Installation',
      duration: 'During construction',
      activities: ['First fix ductwork', 'Equipment installation', 'Connections']
    },
    {
      phase: 'Commissioning',
      duration: '1-2 days',
      activities: ['Balancing', 'Testing', 'Certification']
    }
  ];

  // Costs
  const costs = [
    {
      item: 'Ventilation Design',
      range: '£500-1,500',
      notes: 'Specialist input'
    },
    {
      item: 'MEV System',
      range: '£1,500-3,000',
      notes: 'Supply and install'
    },
    {
      item: 'MVHR System',
      range: '£4,000-8,000',
      notes: 'Including ductwork'
    },
    {
      item: 'dMVHR Units',
      range: '£600-1,200 per room',
      notes: 'Individual units'
    },
    {
      item: 'Commissioning',
      range: '£200-500',
      notes: 'Testing and certification'
    }
  ];

  // Recommendations
  const recommendations: string[] = [];
  
  recommendations.push('Consider ventilation strategy early in design');
  recommendations.push('Coordinate with airtightness strategy');
  
  if (projectDetails.heritageConstraints) {
    recommendations.push('Discuss terminal positions with conservation officer');
    recommendations.push('Consider decentralized options for minimal impact');
  }

  if (projectDetails.hasBasement) {
    recommendations.push('Ensure adequate basement ventilation for moisture control');
    recommendations.push('Consider separate basement extract system');
  }

  return {
    address,
    postcode,
    projectType,
    partFRequirements,
    systemOptions,
    recommendedSystem,
    airQuality,
    ductworkDesign,
    acoustics,
    condensation,
    commissioning,
    maintenance,
    planningConditions,
    localFactors: getLocalFactors(),
    timeline,
    costs,
    recommendations
  };
}

// Export the service
const ventilationStrategy = {
  assessVentilation,
  PART_F_RATES,
  VENTILATION_SYSTEMS,
  AIR_QUALITY_STANDARDS
};

export default ventilationStrategy;
