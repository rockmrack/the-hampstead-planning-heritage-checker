/**
 * Overheating Assessment Service
 * 
 * Provides overheating risk assessment guidance for development
 * projects in the Hampstead area, covering Part O and TM59.
 */

interface OverheatingProject {
  dwellingUnits?: number;
  floorspace?: number;
  buildingType?: string;
  orientation?: string;
  glazingRatio?: number;
  crossVentilation?: boolean;
  singleAspect?: boolean;
  topFloor?: boolean;
  noiseSensitive?: boolean;
}

interface OverheatingCriteria {
  criterion: string;
  description: string;
  threshold: string;
  method: string;
}

interface CoolingStrategy {
  strategy: string;
  description: string;
  effectiveness: string;
  energyImpact: string;
  cost: string;
  heritageConsiderations: string;
}

interface GlazingGuidance {
  aspect: string;
  maxGlazingRatio: string;
  solarControl: string;
  notes: string;
}

interface OverheatingAssessment {
  address: string;
  postcode: string;
  projectType: string;
  partORequirements: {
    applies: boolean;
    criteria: OverheatingCriteria[];
    demonstrationMethods: string[];
  };
  tm59Assessment: {
    required: boolean;
    scope: string[];
    criteria: OverheatingCriteria[];
  };
  riskFactors: {
    factor: string;
    impact: 'low' | 'medium' | 'high';
    mitigation: string;
  }[];
  coolingHierarchy: {
    priority: number;
    category: string;
    strategies: CoolingStrategy[];
  }[];
  glazingGuidance: GlazingGuidance[];
  shadingOptions: {
    type: string;
    effectiveness: string;
    applicability: string;
    cost: string;
  }[];
  ventilationForCooling: {
    strategy: string;
    requirements: string[];
    limitations: string[];
  }[];
  thermalMass: {
    benefit: string;
    strategies: string[];
    considerations: string[];
  };
  noiseConstraints: {
    applies: boolean;
    impact: string;
    solutions: string[];
  };
  futureClimate: {
    scenario: string;
    implications: string[];
    recommendations: string[];
  };
  modellingRequirements: {
    software: string[];
    weatherFiles: string[];
    outputs: string[];
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

// Part O criteria
const PART_O_CRITERIA = {
  method1: {
    name: 'Simplified Method',
    description: 'Limits on glazing ratios and shading',
    applicability: 'Simple buildings, cross-ventilated'
  },
  method2: {
    name: 'Dynamic Thermal Modelling',
    description: 'Full simulation demonstrating compliance',
    applicability: 'All buildings, required for single-aspect'
  }
};

// TM59 criteria
const TM59_CRITERIA = {
  naturallyVentilated: {
    bedroom: 'Hours over 26°C < 3% occupied hours',
    living: 'Hours over 28°C < 3% occupied hours',
    notes: 'DSY1 weather file'
  },
  mechanicallyVentilated: {
    allRooms: '< 3% hours over 26°C operative temperature',
    notes: 'Fixed 26°C threshold'
  }
};

// Overheating risk factors
const RISK_FACTORS = {
  orientation: {
    south: 'high',
    west: 'high',
    east: 'medium',
    north: 'low'
  },
  glazingRatio: {
    below15: 'low',
    '15to25': 'medium',
    above25: 'high'
  },
  crossVentilation: {
    yes: 'reduced',
    no: 'increased'
  }
};

function getPartORequirements(projectDetails: OverheatingProject): {
  applies: boolean;
  criteria: OverheatingCriteria[];
  demonstrationMethods: string[];
} {
  const applies = (projectDetails.dwellingUnits || 0) > 0;

  const criteria: OverheatingCriteria[] = [
    {
      criterion: 'Temperature Limit',
      description: 'Avoid overheating in occupied rooms',
      threshold: 'Hours above threshold temperature',
      method: 'Simplified or dynamic modelling'
    },
    {
      criterion: 'Solar Gains',
      description: 'Limit solar gains through glazing',
      threshold: 'g-value and glazing area limits',
      method: 'Simplified method tables'
    },
    {
      criterion: 'Ventilation',
      description: 'Adequate ventilation for cooling',
      threshold: 'Opening area requirements',
      method: 'Calculation or modelling'
    }
  ];

  const demonstrationMethods = [
    'Simplified Method (Method 1) - for simple cross-ventilated buildings',
    'Dynamic Thermal Modelling (Method 2) - for all others',
    'Method 2 required for single-aspect dwellings'
  ];

  return { applies, criteria, demonstrationMethods };
}

function getTM59Requirements(projectDetails: OverheatingProject): {
  required: boolean;
  scope: string[];
  criteria: OverheatingCriteria[];
} {
  const isMajor = (projectDetails.dwellingUnits || 0) >= 10;

  const criteria: OverheatingCriteria[] = [
    {
      criterion: 'Criterion A (Bedrooms)',
      description: 'Hours sleeping temperature exceeded',
      threshold: '<3% hours >26°C (10pm-7am)',
      method: 'Dynamic thermal modelling'
    },
    {
      criterion: 'Criterion B (All rooms)',
      description: 'Adaptive comfort exceedance',
      threshold: '<3% hours above comfort limit',
      method: 'Dynamic thermal modelling'
    }
  ];

  return {
    required: isMajor,
    scope: [
      'Worst-case unit analysis',
      'Multiple unit types if varied',
      'DSY1-3 weather files (London)',
      'Future climate scenarios'
    ],
    criteria
  };
}

function getRiskFactors(projectDetails: OverheatingProject): {
  factor: string;
  impact: 'low' | 'medium' | 'high';
  mitigation: string;
}[] {
  const factors: {
    factor: string;
    impact: 'low' | 'medium' | 'high';
    mitigation: string;
  }[] = [];

  // Orientation
  const orientation = projectDetails.orientation?.toLowerCase() || 'south';
  let orientationImpact: 'low' | 'medium' | 'high' = 'medium';
  if (orientation === 'south' || orientation === 'west') orientationImpact = 'high';
  if (orientation === 'north') orientationImpact = 'low';
  
  factors.push({
    factor: `${orientation.charAt(0).toUpperCase() + orientation.slice(1)}-facing orientation`,
    impact: orientationImpact,
    mitigation: orientationImpact === 'high' ? 'External shading essential' : 'Solar control glazing'
  });

  // Glazing ratio
  const glazingRatio = projectDetails.glazingRatio || 20;
  let glazingImpact: 'low' | 'medium' | 'high' = 'medium';
  if (glazingRatio > 25) glazingImpact = 'high';
  if (glazingRatio < 15) glazingImpact = 'low';
  
  factors.push({
    factor: `Glazing ratio ${glazingRatio}%`,
    impact: glazingImpact,
    mitigation: glazingImpact === 'high' ? 'Reduce glazing or add external shading' : 'Solar control glazing'
  });

  // Single aspect
  if (projectDetails.singleAspect) {
    factors.push({
      factor: 'Single-aspect dwelling',
      impact: 'high',
      mitigation: 'Maximize openable area, consider mechanical cooling'
    });
  }

  // Cross ventilation
  if (projectDetails.crossVentilation) {
    factors.push({
      factor: 'Cross-ventilation possible',
      impact: 'low',
      mitigation: 'Design for effective cross-ventilation paths'
    });
  } else {
    factors.push({
      factor: 'No cross-ventilation',
      impact: 'high',
      mitigation: 'Stack ventilation or mechanical assistance required'
    });
  }

  // Top floor
  if (projectDetails.topFloor) {
    factors.push({
      factor: 'Top floor location',
      impact: 'high',
      mitigation: 'Roof insulation critical, consider reflective surfaces'
    });
  }

  // Noise
  if (projectDetails.noiseSensitive) {
    factors.push({
      factor: 'Noise-sensitive location',
      impact: 'high',
      mitigation: 'Acoustic ventilators or mechanical ventilation with cooling'
    });
  }

  return factors;
}

function getCoolingHierarchy(): {
  priority: number;
  category: string;
  strategies: CoolingStrategy[];
}[] {
  return [
    {
      priority: 1,
      category: 'Reduce Heat Gains',
      strategies: [
        {
          strategy: 'External Shading',
          description: 'Brise soleil, overhangs, shutters',
          effectiveness: 'Very High - blocks solar before entering',
          energyImpact: 'Passive - zero energy',
          cost: '£500-2,000 per window',
          heritageConsiderations: 'May not be acceptable on historic facades'
        },
        {
          strategy: 'Solar Control Glazing',
          description: 'Low g-value glass',
          effectiveness: 'Medium-High',
          energyImpact: 'Passive - may reduce daylight',
          cost: 'Marginal over standard',
          heritageConsiderations: 'May change appearance - check acceptability'
        },
        {
          strategy: 'Internal Blinds',
          description: 'Reflective internal shading',
          effectiveness: 'Medium - heat already inside',
          energyImpact: 'Passive',
          cost: '£100-500 per window',
          heritageConsiderations: 'Generally acceptable'
        }
      ]
    },
    {
      priority: 2,
      category: 'Passive Cooling',
      strategies: [
        {
          strategy: 'Night Purge Ventilation',
          description: 'Flush building with cool night air',
          effectiveness: 'High - if thermal mass present',
          energyImpact: 'Very low (window opening/fans)',
          cost: 'Design cost only',
          heritageConsiderations: 'Requires secure openings'
        },
        {
          strategy: 'Thermal Mass Exposure',
          description: 'Exposed concrete/masonry to absorb heat',
          effectiveness: 'Medium-High with night purge',
          energyImpact: 'Passive',
          cost: 'Design consideration',
          heritageConsiderations: 'Compatible - historic buildings often have good mass'
        },
        {
          strategy: 'Green Roofs/Walls',
          description: 'Vegetated surfaces for cooling',
          effectiveness: 'Medium - reduces roof gains',
          energyImpact: 'Passive',
          cost: '£80-300/m²',
          heritageConsiderations: 'May not be visible - often acceptable'
        }
      ]
    },
    {
      priority: 3,
      category: 'Active Cooling (if passive insufficient)',
      strategies: [
        {
          strategy: 'Ceiling Fans',
          description: 'Air movement for perceived cooling',
          effectiveness: 'Medium - 2-4°C perceived',
          energyImpact: 'Low energy',
          cost: '£200-500 per fan',
          heritageConsiderations: 'Generally acceptable'
        },
        {
          strategy: 'Heat Pump Cooling',
          description: 'Reversible ASHP for cooling',
          effectiveness: 'High - active temperature control',
          energyImpact: 'Moderate energy use',
          cost: 'Marginal if already heating with HP',
          heritageConsiderations: 'Uses same external unit as heating'
        },
        {
          strategy: 'Split System AC',
          description: 'Dedicated cooling system',
          effectiveness: 'High',
          energyImpact: 'Higher energy use',
          cost: '£1,500-3,000 per unit',
          heritageConsiderations: 'External condenser units problematic'
        }
      ]
    }
  ];
}

function getGlazingGuidance(): GlazingGuidance[] {
  return [
    {
      aspect: 'South',
      maxGlazingRatio: '20-25% of floor area',
      solarControl: 'g-value <0.4 or external shading',
      notes: 'External horizontal shading most effective'
    },
    {
      aspect: 'West',
      maxGlazingRatio: '15-20% of floor area',
      solarControl: 'g-value <0.35 or external shading',
      notes: 'Low sun angle - vertical shading or shutters'
    },
    {
      aspect: 'East',
      maxGlazingRatio: '20-25% of floor area',
      solarControl: 'g-value <0.4',
      notes: 'Morning sun - usually manageable'
    },
    {
      aspect: 'North',
      maxGlazingRatio: '25-35% of floor area',
      solarControl: 'Standard glazing acceptable',
      notes: 'Minimal solar gains - daylight focus'
    }
  ];
}

function getShadingOptions(): {
  type: string;
  effectiveness: string;
  applicability: string;
  cost: string;
}[] {
  return [
    {
      type: 'External Brise Soleil',
      effectiveness: 'Very high (70-90% reduction)',
      applicability: 'South and west facades',
      cost: '£1,000-3,000 per window'
    },
    {
      type: 'External Shutters',
      effectiveness: 'Very high when closed (80-95%)',
      applicability: 'All orientations, heritage-compatible',
      cost: '£500-1,500 per window'
    },
    {
      type: 'Overhangs/Canopies',
      effectiveness: 'High for south (60-80%)',
      applicability: 'South-facing, new build',
      cost: 'Design integration'
    },
    {
      type: 'External Blinds/Screens',
      effectiveness: 'High (70-85%)',
      applicability: 'Most applications',
      cost: '£800-2,000 per window'
    },
    {
      type: 'Solar Control Film',
      effectiveness: 'Medium (30-50%)',
      applicability: 'Retrofit applications',
      cost: '£50-150 per m²'
    },
    {
      type: 'Internal Blinds (reflective)',
      effectiveness: 'Low-Medium (20-40%)',
      applicability: 'Supplementary measure',
      cost: '£100-500 per window'
    }
  ];
}

function getVentilationForCooling(): {
  strategy: string;
  requirements: string[];
  limitations: string[];
}[] {
  return [
    {
      strategy: 'Cross Ventilation',
      requirements: [
        'Openings on opposite facades',
        'Opening area ≥ 4% floor area per room',
        'Clear air path through dwelling'
      ],
      limitations: [
        'Not possible in single-aspect units',
        'Security considerations for ground floor',
        'Noise ingress in urban areas'
      ]
    },
    {
      strategy: 'Stack Ventilation',
      requirements: [
        'High and low level openings',
        'Sufficient height difference',
        'Large opening areas'
      ],
      limitations: [
        'Limited effectiveness in low-rise',
        'Wind interference possible',
        'Requires careful design'
      ]
    },
    {
      strategy: 'Single-Sided Ventilation',
      requirements: [
        'Opening area ≥ 6% floor area',
        'High and low openings preferred',
        'Room depth < 2.5x ceiling height'
      ],
      limitations: [
        'Limited penetration depth',
        'Wind-dependent',
        'May not achieve sufficient cooling'
      ]
    }
  ];
}

function getThermalMass(): {
  benefit: string;
  strategies: string[];
  considerations: string[];
} {
  return {
    benefit: 'Absorbs heat during day, releases at night with purge ventilation',
    strategies: [
      'Exposed concrete ceilings/floors',
      'Solid masonry walls',
      'Dense block partitions',
      'Avoiding suspended ceilings',
      'Phase change materials (PCM)'
    ],
    considerations: [
      'Requires night purge ventilation to be effective',
      'Slower response time to heating',
      'Heritage buildings often have good inherent mass',
      'Lightweight construction provides less benefit'
    ]
  };
}

function getNoiseConstraints(projectDetails: OverheatingProject): {
  applies: boolean;
  impact: string;
  solutions: string[];
} {
  const applies = projectDetails.noiseSensitive || false;

  return {
    applies,
    impact: applies ? 'Windows cannot be opened for ventilation' : 'Windows can be opened for passive cooling',
    solutions: applies ? [
      'Acoustic ventilators (louvered openings with attenuation)',
      'Mechanical ventilation with acoustic treatment',
      'Winter gardens/buffer spaces',
      'Active cooling may be required',
      'Locate bedrooms away from noise source'
    ] : [
      'Natural ventilation suitable',
      'Design for effective cross-ventilation'
    ]
  };
}

function getFutureClimate(): {
  scenario: string;
  implications: string[];
  recommendations: string[];
} {
  return {
    scenario: 'DSY2 and DSY3 weather files represent future climate (2050s, 2080s)',
    implications: [
      'Temperatures increasing significantly',
      'More frequent extreme heat events',
      'Passive measures may become insufficient',
      'Cooling demand will increase'
    ],
    recommendations: [
      'Design for DSY1 minimum, consider DSY2',
      'Allow for future cooling installation',
      'Maximize passive measures now',
      'Future-proof with infrastructure for cooling',
      'Consider adaptive comfort strategies'
    ]
  };
}

function getModellingRequirements(): {
  software: string[];
  weatherFiles: string[];
  outputs: string[];
} {
  return {
    software: [
      'IES VE',
      'TAS',
      'EnergyPlus',
      'DesignBuilder'
    ],
    weatherFiles: [
      'DSY1 - typical overheating year (London)',
      'DSY2 - 2050s high emissions scenario',
      'DSY3 - 2080s high emissions scenario'
    ],
    outputs: [
      'Hours above threshold per room',
      'Operative temperature profiles',
      'Criterion A and B compliance (TM59)',
      'Sensitivity analysis'
    ]
  };
}

function getLocalFactors(): string[] {
  return [
    'London Urban Heat Island effect increases temperatures',
    'Camden requires TM59 assessment for major residential',
    'Conservation areas may restrict external shading',
    'Road traffic noise affects ventilation strategy',
    'Heritage buildings may have thermal mass advantage',
    'Roof extensions particularly vulnerable to overheating',
    'Climate projections show significant warming for London'
  ];
}

async function assessOverheating(
  address: string,
  postcode: string,
  projectType: string,
  projectDetails: OverheatingProject = {}
): Promise<OverheatingAssessment> {
  // Part O requirements
  const partORequirements = getPartORequirements(projectDetails);

  // TM59 requirements
  const tm59Assessment = getTM59Requirements(projectDetails);

  // Risk factors
  const riskFactors = getRiskFactors(projectDetails);

  // Cooling hierarchy
  const coolingHierarchy = getCoolingHierarchy();

  // Glazing guidance
  const glazingGuidance = getGlazingGuidance();

  // Shading options
  const shadingOptions = getShadingOptions();

  // Ventilation for cooling
  const ventilationForCooling = getVentilationForCooling();

  // Thermal mass
  const thermalMass = getThermalMass();

  // Noise constraints
  const noiseConstraints = getNoiseConstraints(projectDetails);

  // Future climate
  const futureClimate = getFutureClimate();

  // Modelling requirements
  const modellingRequirements = getModellingRequirements();

  // Planning conditions
  const planningConditions = [
    'Overheating mitigation measures as approved',
    'External shading installation (if applicable)',
    'Glazing specification compliance',
    'Ventilation strategy implementation'
  ];

  // Timeline
  const timeline = [
    {
      phase: 'Initial Assessment',
      duration: '1-2 weeks',
      activities: ['Risk factor analysis', 'Strategy development', 'Simplified check']
    },
    {
      phase: 'Dynamic Modelling',
      duration: '2-4 weeks',
      activities: ['Model creation', 'Baseline analysis', 'Mitigation testing']
    },
    {
      phase: 'Design Development',
      duration: '2-4 weeks',
      activities: ['Shading design', 'Specification', 'Integration with architecture']
    },
    {
      phase: 'Verification',
      duration: '1-2 weeks',
      activities: ['Final model runs', 'Compliance demonstration', 'Reporting']
    }
  ];

  // Costs
  const costs = [
    {
      item: 'Overheating Assessment (TM59)',
      range: '£1,500-4,000',
      notes: 'Dynamic thermal modelling'
    },
    {
      item: 'External Shading',
      range: '£500-3,000 per opening',
      notes: 'Depends on type and size'
    },
    {
      item: 'Solar Control Glazing',
      range: '20-50% premium',
      notes: 'Over standard glazing'
    },
    {
      item: 'Mechanical Cooling',
      range: '£2,000-5,000 per unit',
      notes: 'If passive insufficient'
    }
  ];

  // Recommendations
  const recommendations: string[] = [];
  
  recommendations.push('Address overheating in early design stages');
  recommendations.push('Prioritize passive measures before active cooling');
  
  if (projectDetails.singleAspect) {
    recommendations.push('Single-aspect units at high risk - maximize openings and consider cooling');
  }

  if (projectDetails.topFloor) {
    recommendations.push('Top floor particularly vulnerable - consider enhanced roof insulation and reflective surfaces');
  }

  recommendations.push('Consider future climate scenarios in design');
  recommendations.push('Heritage constraints may limit external shading - explore alternatives early');

  return {
    address,
    postcode,
    projectType,
    partORequirements,
    tm59Assessment,
    riskFactors,
    coolingHierarchy,
    glazingGuidance,
    shadingOptions,
    ventilationForCooling,
    thermalMass,
    noiseConstraints,
    futureClimate,
    modellingRequirements,
    planningConditions,
    localFactors: getLocalFactors(),
    timeline,
    costs,
    recommendations
  };
}

// Export the service
const overheatingAssessment = {
  assessOverheating,
  PART_O_CRITERIA,
  TM59_CRITERIA,
  RISK_FACTORS
};

export default overheatingAssessment;
