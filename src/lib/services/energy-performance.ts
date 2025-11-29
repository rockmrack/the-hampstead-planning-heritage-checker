/**
 * Energy Performance Service
 * 
 * Provides energy performance and Part L compliance guidance
 * for development projects in the Hampstead area.
 */

interface EnergyProject {
  dwellingUnits?: number;
  floorspace?: number;
  buildingType?: string;
  newBuild?: boolean;
  heritageConstraints?: boolean;
  existingHeating?: string;
  proposedHeating?: string;
}

interface PartLCompliance {
  version: string;
  targetEmissions: string;
  fabric: {
    element: string;
    maxUValue: string;
    recommendedUValue: string;
  }[];
  services: {
    system: string;
    requirement: string;
  }[];
}

interface HeatingOptions {
  option: string;
  description: string;
  carbonFactor: string;
  suitability: string;
  cost: string;
  heritageConsiderations: string;
}

interface RenewableOption {
  technology: string;
  description: string;
  output: string;
  suitability: string;
  heritageConsiderations: string;
  cost: string;
}

interface EnergyAssessment {
  address: string;
  postcode: string;
  projectType: string;
  partLRequirements: PartLCompliance;
  carbonReductionTarget: {
    policy: string;
    target: string;
    pathway: string[];
  };
  energyHierarchy: {
    step: string;
    description: string;
    measures: string[];
  }[];
  heatingOptions: HeatingOptions[];
  renewableOptions: RenewableOption[];
  fabricFirst: {
    strategy: string;
    measures: {
      measure: string;
      benefit: string;
      heritageImpact: string;
    }[];
  };
  sapCalculation: {
    required: boolean;
    type: string;
    process: string[];
    cost: string;
  };
  epcRequirements: {
    required: boolean;
    targetRating: string;
    exemptions: string[];
  };
  overheatingRisk: {
    assessment: string;
    measures: string[];
  };
  smartSystems: {
    system: string;
    benefit: string;
  }[];
  planningConditions: string[];
  buildingRegulations: {
    part: string;
    requirement: string;
  }[];
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

// Part L 2021 requirements
const PART_L_2021 = {
  residential: {
    targetEmissionRate: '31% reduction vs Part L 2013',
    primaryEnergy: 'Target Primary Energy Rate (TPER)',
    fabric: {
      walls: 0.26,
      roof: 0.16,
      floor: 0.18,
      windows: 1.6,
      doors: 1.6
    }
  },
  nonResidential: {
    targetEmissionRate: '27% reduction vs Part L 2013',
    fabric: {
      walls: 0.26,
      roof: 0.16,
      floor: 0.18,
      windows: 1.6,
      doors: 1.6
    }
  }
};

// London Plan additional requirements
const LONDON_PLAN_ENERGY = {
  majorDevelopments: {
    onSiteReduction: 35,
    beClean: 'Connect to heat network or be network-ready',
    beGreen: 'Renewables contribution required',
    carbonOffset: '£95/tonne for residual emissions'
  }
};

// Heating system carbon factors
const HEATING_CARBON_FACTORS: Record<string, number> = {
  'gas-boiler': 0.203,
  'oil-boiler': 0.267,
  'direct-electric': 0.136,
  'heat-pump-air': 0.034,
  'heat-pump-ground': 0.027,
  'heat-network': 0.05,
  'biomass': 0.015
};

function getPartLRequirements(projectDetails: EnergyProject): PartLCompliance {
  const isResidential = projectDetails.buildingType === 'residential' || (projectDetails.dwellingUnits || 0) > 0;
  const defaultPartL = PART_L_2021['residential']!;
  const partL = isResidential ? PART_L_2021['residential'] || defaultPartL : PART_L_2021['nonResidential'] || defaultPartL;

  return {
    version: 'Part L 2021 (Conservation of Fuel and Power)',
    targetEmissions: partL.targetEmissionRate,
    fabric: [
      { element: 'External Walls', maxUValue: `${partL.fabric.walls} W/m²K`, recommendedUValue: '0.18 W/m²K' },
      { element: 'Roof', maxUValue: `${partL.fabric.roof} W/m²K`, recommendedUValue: '0.11 W/m²K' },
      { element: 'Ground Floor', maxUValue: `${partL.fabric.floor} W/m²K`, recommendedUValue: '0.13 W/m²K' },
      { element: 'Windows', maxUValue: `${partL.fabric.windows} W/m²K`, recommendedUValue: '1.2 W/m²K' },
      { element: 'Doors', maxUValue: `${partL.fabric.doors} W/m²K`, recommendedUValue: '1.0 W/m²K' }
    ],
    services: [
      { system: 'Heating', requirement: 'Low carbon preferred - heat pump or network' },
      { system: 'Hot Water', requirement: 'Heat pump or solar thermal contribution' },
      { system: 'Ventilation', requirement: 'MVHR for airtight buildings' },
      { system: 'Lighting', requirement: 'LED throughout with controls' },
      { system: 'Controls', requirement: 'Smart controls and zoning' }
    ]
  };
}

function getCarbonReductionTarget(projectDetails: EnergyProject): {
  policy: string;
  target: string;
  pathway: string[];
} {
  const isMajor = (projectDetails.dwellingUnits || 0) >= 10 || (projectDetails.floorspace || 0) >= 1000;

  return {
    policy: 'London Plan SI 2',
    target: isMajor ? '35% on-site reduction beyond Part L (net zero overall)' : 'Part L 2021 compliance',
    pathway: [
      'Be Lean: Reduce demand through fabric and efficiency',
      'Be Clean: Use efficient supply (heat networks where available)',
      'Be Green: Maximize renewable energy',
      'Be Seen: Monitor and report energy use',
      isMajor ? 'Carbon offset payment for residual emissions' : ''
    ].filter(p => p !== '')
  };
}

function getEnergyHierarchy(): {
  step: string;
  description: string;
  measures: string[];
}[] {
  return [
    {
      step: 'Be Lean',
      description: 'Reduce energy demand through passive design',
      measures: [
        'High performance thermal envelope',
        'Thermal mass for stability',
        'Optimized glazing ratios',
        'Natural ventilation where appropriate',
        'Daylight optimization',
        'Efficient appliances and lighting'
      ]
    },
    {
      step: 'Be Clean',
      description: 'Use efficient and low carbon energy supply',
      measures: [
        'Connection to heat networks',
        'High efficiency heat pumps',
        'Combined heat and power (if appropriate)',
        'Efficient distribution systems'
      ]
    },
    {
      step: 'Be Green',
      description: 'Generate renewable energy on-site',
      measures: [
        'Solar PV panels',
        'Solar thermal (DHW pre-heat)',
        'Heat pumps (renewable portion)',
        'Battery storage'
      ]
    },
    {
      step: 'Be Seen',
      description: 'Monitor and verify performance',
      measures: [
        'Smart metering',
        'Energy monitoring systems',
        'Display Energy Certificates',
        'Post-occupancy evaluation'
      ]
    }
  ];
}

function getHeatingOptions(projectDetails: EnergyProject): HeatingOptions[] {
  const options: HeatingOptions[] = [];

  const defaultAirHP = HEATING_CARBON_FACTORS['heat-pump-air']!;
  const defaultGroundHP = HEATING_CARBON_FACTORS['heat-pump-ground']!;
  const defaultGas = HEATING_CARBON_FACTORS['gas-boiler']!;
  const defaultNetwork = HEATING_CARBON_FACTORS['heat-network']!;
  const defaultDirectElec = HEATING_CARBON_FACTORS['direct-electric']!;

  options.push({
    option: 'Air Source Heat Pump',
    description: 'Extracts heat from outdoor air, highly efficient',
    carbonFactor: `${HEATING_CARBON_FACTORS['heat-pump-air'] || defaultAirHP} kgCO2/kWh`,
    suitability: 'Excellent for most applications',
    cost: '£8,000-15,000 installed',
    heritageConsiderations: 'External unit may need screening. Noise considerations.'
  });

  options.push({
    option: 'Ground Source Heat Pump',
    description: 'Extracts heat from ground via boreholes or trenches',
    carbonFactor: `${HEATING_CARBON_FACTORS['heat-pump-ground'] || defaultGroundHP} kgCO2/kWh`,
    suitability: 'Very efficient but requires ground works',
    cost: '£15,000-35,000 installed',
    heritageConsiderations: 'Underground so minimal visual impact. Archaeology check needed.'
  });

  options.push({
    option: 'Heat Network Connection',
    description: 'Connection to district heating network',
    carbonFactor: `${HEATING_CARBON_FACTORS['heat-network'] || defaultNetwork} kgCO2/kWh (varies)`,
    suitability: 'Where networks available',
    cost: 'Connection fees variable',
    heritageConsiderations: 'Minimal internal equipment. No external units.'
  });

  if (projectDetails.heritageConstraints) {
    options.push({
      option: 'High Efficiency Gas Boiler',
      description: 'May be acceptable for heritage buildings',
      carbonFactor: `${HEATING_CARBON_FACTORS['gas-boiler'] || defaultGas} kgCO2/kWh`,
      suitability: 'Where heat pump not practical',
      cost: '£2,500-5,000 installed',
      heritageConsiderations: 'Flue routing needs consideration. Future hydrogen-ready.'
    });

    options.push({
      option: 'Electric Panel Heaters',
      description: 'Direct electric heating',
      carbonFactor: `${HEATING_CARBON_FACTORS['direct-electric'] || defaultDirectElec} kgCO2/kWh`,
      suitability: 'Small-scale heritage applications',
      cost: '£500-2,000',
      heritageConsiderations: 'No external equipment. Higher running costs.'
    });
  }

  return options;
}

function getRenewableOptions(projectDetails: EnergyProject): RenewableOption[] {
  const options: RenewableOption[] = [];

  options.push({
    technology: 'Solar PV',
    description: 'Photovoltaic panels generating electricity',
    output: '850-1000 kWh/kWp/year in London',
    suitability: 'Most roofs with southern aspect',
    heritageConsiderations: 'May not be acceptable on visible historic roofs. Consider in-roof systems.',
    cost: '£5,000-10,000 for 4kWp system'
  });

  options.push({
    technology: 'Solar Thermal',
    description: 'Hot water pre-heating from solar collectors',
    output: '40-60% annual hot water demand',
    suitability: 'Where roof space limited for PV',
    heritageConsiderations: 'Similar constraints to PV. Evacuated tubes less obtrusive.',
    cost: '£4,000-6,000 installed'
  });

  options.push({
    technology: 'Heat Pump (renewable portion)',
    description: 'Environmental heat contribution counts as renewable',
    output: '60-75% of delivered heat from environment',
    suitability: 'Primary heating choice',
    heritageConsiderations: 'As per heating options above',
    cost: 'Included in heating system'
  });

  options.push({
    technology: 'Battery Storage',
    description: 'Store PV generation for later use',
    output: 'Maximize self-consumption',
    suitability: 'Where PV installed and tariff suits',
    heritageConsiderations: 'Internal installation - no heritage impact',
    cost: '£4,000-8,000 for 5-10kWh'
  });

  return options;
}

function getFabricFirstApproach(projectDetails: EnergyProject): {
  strategy: string;
  measures: {
    measure: string;
    benefit: string;
    heritageImpact: string;
  }[];
} {
  const measures: {
    measure: string;
    benefit: string;
    heritageImpact: string;
  }[] = [];

  measures.push({
    measure: 'External Wall Insulation',
    benefit: 'Significant heat loss reduction',
    heritageImpact: 'Not suitable for historic facades - changes appearance'
  });

  measures.push({
    measure: 'Internal Wall Insulation',
    benefit: 'Reduces heat loss without external change',
    heritageImpact: 'Acceptable - preserves external appearance'
  });

  measures.push({
    measure: 'Roof/Loft Insulation',
    benefit: 'Major heat loss reduction, easy installation',
    heritageImpact: 'Generally acceptable - not visible'
  });

  measures.push({
    measure: 'Floor Insulation',
    benefit: 'Reduces heat loss and improves comfort',
    heritageImpact: 'May affect historic floors - specialist advice needed'
  });

  measures.push({
    measure: 'Secondary Glazing',
    benefit: 'Improves window performance without replacement',
    heritageImpact: 'Preserves historic windows - conservation preferred approach'
  });

  measures.push({
    measure: 'Draught Proofing',
    benefit: 'Low cost, significant comfort improvement',
    heritageImpact: 'Minimal impact - reversible'
  });

  measures.push({
    measure: 'High Performance Windows',
    benefit: 'Significant improvement where replacement acceptable',
    heritageImpact: 'Listed/conservation may require like-for-like or slim double glazing'
  });

  return {
    strategy: 'Fabric First - prioritize reducing demand before adding technology',
    measures
  };
}

function getSAPRequirements(projectDetails: EnergyProject): {
  required: boolean;
  type: string;
  process: string[];
  cost: string;
} {
  const units = projectDetails.dwellingUnits || 0;
  const isNewDwelling = Boolean(projectDetails.newBuild && units > 0);

  return {
    required: isNewDwelling,
    type: isNewDwelling ? 'SAP 10.2 Calculation' : 'SBEM for non-residential',
    process: [
      'Design stage assessment (notional building)',
      'As-designed SAP calculation',
      'Building Regulations submission',
      'As-built SAP calculation',
      'EPC generation'
    ],
    cost: '£150-400 per dwelling'
  };
}

function getEPCRequirements(projectDetails: EnergyProject): {
  required: boolean;
  targetRating: string;
  exemptions: string[];
} {
  return {
    required: true,
    targetRating: 'A-B for new build, improvement required for existing',
    exemptions: [
      'Listed buildings (where measures would unacceptably alter character)',
      'Places of worship',
      'Temporary buildings (<2 years)',
      'Very small buildings (<50m²)'
    ]
  };
}

function getOverheatingAssessment(): {
  assessment: string;
  measures: string[];
} {
  return {
    assessment: 'CIBSE TM59 overheating assessment required for residential',
    measures: [
      'Appropriate glazing ratios (15-25% of floor area)',
      'Solar control glazing or external shading',
      'Cross ventilation design',
      'Thermal mass exposure',
      'Night purge ventilation strategy',
      'Light colored external finishes',
      'Green roofs for additional cooling'
    ]
  };
}

function getSmartSystems(): {
  system: string;
  benefit: string;
}[] {
  return [
    { system: 'Smart Thermostat', benefit: '10-15% energy savings through optimization' },
    { system: 'Smart Meters', benefit: 'Real-time energy monitoring and awareness' },
    { system: 'Automated Controls', benefit: 'Responds to occupancy and conditions' },
    { system: 'Heat Pump Controls', benefit: 'Optimize coefficient of performance' },
    { system: 'Lighting Controls', benefit: 'Presence and daylight sensing' },
    { system: 'Home Energy Management', benefit: 'Integrates PV, battery, EV charging' }
  ];
}

function getLocalFactors(): string[] {
  return [
    'Camden Climate Action Plan - net zero by 2030 ambition',
    'Camden heat network development - connection opportunities',
    'Conservation area constraints on external equipment',
    'Listed building consent may be needed for significant works',
    'Air quality - low NOx systems preferred',
    'Hampstead has limited gas network in some areas historically',
    'Camden Green Homes Grant for efficiency improvements'
  ];
}

async function assessEnergyPerformance(
  address: string,
  postcode: string,
  projectType: string,
  projectDetails: EnergyProject = {}
): Promise<EnergyAssessment> {
  // Part L requirements
  const partLRequirements = getPartLRequirements(projectDetails);

  // Carbon reduction target
  const carbonReductionTarget = getCarbonReductionTarget(projectDetails);

  // Energy hierarchy
  const energyHierarchy = getEnergyHierarchy();

  // Heating options
  const heatingOptions = getHeatingOptions(projectDetails);

  // Renewable options
  const renewableOptions = getRenewableOptions(projectDetails);

  // Fabric first
  const fabricFirst = getFabricFirstApproach(projectDetails);

  // SAP calculation
  const sapCalculation = getSAPRequirements(projectDetails);

  // EPC requirements
  const epcRequirements = getEPCRequirements(projectDetails);

  // Overheating risk
  const overheatingRisk = getOverheatingAssessment();

  // Smart systems
  const smartSystems = getSmartSystems();

  // Planning conditions
  const planningConditions = [
    'Energy strategy implementation as approved',
    'Renewable energy installation before occupation',
    'Be Seen monitoring (major developments)',
    'Heat network connection/future-proofing',
    'EV charging provision'
  ];

  // Building regulations
  const buildingRegulations = [
    { part: 'Part L', requirement: 'Conservation of Fuel and Power' },
    { part: 'Part F', requirement: 'Ventilation' },
    { part: 'Part O', requirement: 'Overheating' },
    { part: 'Part S', requirement: 'EV Charging Infrastructure' }
  ];

  // Timeline
  const timeline = [
    {
      phase: 'Energy Strategy',
      duration: '2-4 weeks',
      activities: ['Energy modelling', 'Options appraisal', 'Strategy development']
    },
    {
      phase: 'Planning Application',
      duration: 'Concurrent',
      activities: ['Energy statement', 'Be Lean/Clean/Green calculations']
    },
    {
      phase: 'Detailed Design',
      duration: '4-8 weeks',
      activities: ['SAP calculations', 'System specification', 'Contractor coordination']
    },
    {
      phase: 'Construction',
      duration: 'Duration of works',
      activities: ['Quality assurance', 'Testing and commissioning']
    },
    {
      phase: 'Completion',
      duration: '2-4 weeks',
      activities: ['As-built SAP', 'EPC generation', 'Handover documentation']
    }
  ];

  // Costs
  const costs = [
    {
      item: 'Energy Consultant',
      range: '£1,500-4,000',
      notes: 'Strategy and modelling'
    },
    {
      item: 'SAP Calculations',
      range: sapCalculation.cost,
      notes: 'Per dwelling'
    },
    {
      item: 'Heat Pump System',
      range: '£8,000-25,000',
      notes: 'Depends on type and size'
    },
    {
      item: 'Solar PV',
      range: '£5,000-15,000',
      notes: 'Depends on system size'
    },
    {
      item: 'Fabric Upgrades',
      range: 'Variable',
      notes: 'Depends on scope'
    }
  ];

  // Recommendations
  const recommendations: string[] = [];
  
  recommendations.push('Prioritize fabric performance before technology');
  recommendations.push('Consider heat pump as default heating choice');
  
  if (projectDetails.heritageConstraints) {
    recommendations.push('Coordinate energy measures with heritage approvals');
    recommendations.push('Internal insulation and secondary glazing often preferred');
    recommendations.push('Solar PV may need careful positioning or alternatives');
  }

  recommendations.push('Design for overheating resilience from outset');
  recommendations.push('Include smart controls for optimal performance');

  return {
    address,
    postcode,
    projectType,
    partLRequirements,
    carbonReductionTarget,
    energyHierarchy,
    heatingOptions,
    renewableOptions,
    fabricFirst,
    sapCalculation,
    epcRequirements,
    overheatingRisk,
    smartSystems,
    planningConditions,
    buildingRegulations,
    localFactors: getLocalFactors(),
    timeline,
    costs,
    recommendations
  };
}

// Export the service
const energyPerformance = {
  assessEnergyPerformance,
  PART_L_2021,
  LONDON_PLAN_ENERGY,
  HEATING_CARBON_FACTORS
};

export default energyPerformance;
