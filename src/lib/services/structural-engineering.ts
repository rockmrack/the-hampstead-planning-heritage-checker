/**
 * Structural Engineering Service
 * 
 * Provides structural engineering considerations and guidance
 * for different types of construction projects in Hampstead area.
 */

interface StructuralProject {
  existingStructure?: string;
  wallConstruction?: string;
  roofType?: string;
  foundationType?: string;
  soilType?: string;
  nearbyTrees?: boolean;
  basementDepth?: number;
  loadIncrease?: string;
}

interface StructuralRisk {
  level: 'low' | 'moderate' | 'significant' | 'high';
  primaryConcerns: string[];
  investigations: string[];
  mitigations: string[];
}

interface EngineerRequirement {
  type: string;
  qualifications: string[];
  typicalFees: string;
  deliverables: string[];
  timeline: string;
}

interface FoundationGuidance {
  recommendedType: string;
  alternatives: string[];
  depthRange: string;
  considerations: string[];
  cost: string;
}

interface StructuralAssessment {
  address: string;
  postcode: string;
  projectType: string;
  riskAssessment: StructuralRisk;
  engineerRequirements: EngineerRequirement[];
  foundationGuidance: FoundationGuidance;
  keyCalculations: {
    name: string;
    purpose: string;
    standard: string;
    required: boolean;
  }[];
  buildingRegulations: {
    part: string;
    relevance: string;
    keyRequirements: string[];
  }[];
  cdmRequirements: {
    applicable: boolean;
    duties: string[];
    appointments: string[];
  };
  specialConsiderations: {
    category: string;
    description: string;
    action: string;
  }[];
  localFactors: string[];
  costs: {
    item: string;
    range: string;
    notes: string;
  }[];
  timeline: {
    phase: string;
    duration: string;
    activities: string[];
  }[];
  recommendations: string[];
}

// Hampstead area soil and ground conditions
const GROUND_CONDITIONS: Record<string, {
  predominantSoil: string;
  bearingCapacity: string;
  shrinkability: string;
  waterTable: string;
  specialConcerns: string[];
}> = {
  'NW3': {
    predominantSoil: 'London Clay with sandy patches near Heath',
    bearingCapacity: '75-150 kN/m²',
    shrinkability: 'High',
    waterTable: 'Variable - springs common near Heath',
    specialConcerns: ['Tree root damage common', 'Historic wells and culverts', 'Slope stability on hill']
  },
  'NW6': {
    predominantSoil: 'London Clay',
    bearingCapacity: '75-150 kN/m²',
    shrinkability: 'High',
    waterTable: 'Moderate depth',
    specialConcerns: ['Dense Victorian terraces - party wall issues', 'Basement conversions affecting water flow']
  },
  'NW8': {
    predominantSoil: 'London Clay with gravel patches',
    bearingCapacity: '75-150 kN/m²',
    shrinkability: 'High',
    waterTable: 'Moderate depth',
    specialConcerns: ['Large mansion blocks - complex foundations', 'Historic services and utilities']
  },
  'NW11': {
    predominantSoil: 'London Clay',
    bearingCapacity: '75-150 kN/m²',
    shrinkability: 'High',
    waterTable: 'Generally stable',
    specialConcerns: ['Mature trees throughout', 'Some made ground in older areas']
  }
};

// Project complexity ratings
const PROJECT_COMPLEXITY: Record<string, {
  structuralComplexity: 'simple' | 'moderate' | 'complex' | 'highly-complex';
  riskLevel: 'low' | 'moderate' | 'significant' | 'high';
  typicalCost: string;
}> = {
  'single-storey-extension': {
    structuralComplexity: 'simple',
    riskLevel: 'low',
    typicalCost: '£1,500-3,000'
  },
  'double-storey-extension': {
    structuralComplexity: 'moderate',
    riskLevel: 'moderate',
    typicalCost: '£2,500-5,000'
  },
  'loft-conversion': {
    structuralComplexity: 'moderate',
    riskLevel: 'moderate',
    typicalCost: '£2,000-4,000'
  },
  'basement-excavation': {
    structuralComplexity: 'highly-complex',
    riskLevel: 'high',
    typicalCost: '£8,000-25,000'
  },
  'basement-extension': {
    structuralComplexity: 'highly-complex',
    riskLevel: 'high',
    typicalCost: '£10,000-30,000'
  },
  'internal-alterations': {
    structuralComplexity: 'simple',
    riskLevel: 'low',
    typicalCost: '£1,000-2,500'
  },
  'wall-removal': {
    structuralComplexity: 'moderate',
    riskLevel: 'moderate',
    typicalCost: '£1,500-3,500'
  },
  'new-build': {
    structuralComplexity: 'complex',
    riskLevel: 'significant',
    typicalCost: '£5,000-15,000'
  },
  'additional-storey': {
    structuralComplexity: 'complex',
    riskLevel: 'significant',
    typicalCost: '£5,000-12,000'
  },
  'underpinning': {
    structuralComplexity: 'highly-complex',
    riskLevel: 'high',
    typicalCost: '£6,000-15,000'
  }
};

function extractOutcode(postcode: string): string {
  const cleaned = postcode.toUpperCase().replace(/\s+/g, '');
  const match = cleaned.match(/^([A-Z]{1,2}\d{1,2})/);
  return match && match[1] ? match[1] : 'NW3';
}

function assessStructuralRisk(
  projectType: string,
  projectDetails: StructuralProject,
  groundConditions: typeof GROUND_CONDITIONS['NW3']
): StructuralRisk {
  const defaultComplexity = PROJECT_COMPLEXITY['internal-alterations']!;
  const complexity = PROJECT_COMPLEXITY[projectType] || defaultComplexity;
  
  const primaryConcerns: string[] = [];
  const investigations: string[] = [];
  const mitigations: string[] = [];

  // Base concerns from project type
  if (projectType.includes('basement')) {
    primaryConcerns.push('Ground stability during excavation');
    primaryConcerns.push('Water ingress and waterproofing');
    primaryConcerns.push('Effect on adjacent structures');
    investigations.push('Trial pits to determine soil strata');
    investigations.push('Groundwater monitoring');
    investigations.push('Structural survey of adjacent buildings');
    mitigations.push('Contiguous piled wall or secant piling');
    mitigations.push('Temporary propping during construction');
    mitigations.push('Comprehensive waterproofing system');
  }

  if (projectType === 'loft-conversion') {
    primaryConcerns.push('Roof structure adequacy');
    primaryConcerns.push('Load path to foundations');
    primaryConcerns.push('Floor joist capacity');
    investigations.push('Roof timber survey');
    investigations.push('Existing floor construction assessment');
    mitigations.push('Steel beams to support altered roof');
    mitigations.push('Floor strengthening if required');
  }

  if (projectType.includes('extension')) {
    primaryConcerns.push('Foundation settlement differential');
    primaryConcerns.push('Connection to existing structure');
    investigations.push('Trial pit at proposed foundation location');
    investigations.push('Assessment of existing foundations');
    mitigations.push('Foundation design to match or exceed existing');
    mitigations.push('Movement joint or proper connection detail');
  }

  if (projectType === 'wall-removal') {
    primaryConcerns.push('Load-bearing wall identification');
    primaryConcerns.push('Adequate support during works');
    investigations.push('Survey to confirm wall type');
    investigations.push('Assessment of loads carried');
    mitigations.push('Steel or concrete beam installation');
    mitigations.push('Adequate bearing at supports');
  }

  // Add concerns from ground conditions
  if (groundConditions.shrinkability === 'High') {
    primaryConcerns.push('Clay shrinkage/heave from trees');
    investigations.push('Tree survey and root mapping');
    mitigations.push('Foundation depth below root zone');
  }

  if (projectDetails.nearbyTrees) {
    primaryConcerns.push('Tree root interaction with foundations');
    investigations.push('Arboricultural impact assessment');
    mitigations.push('Root barriers or tree removal');
  }

  // Adjust risk level based on additional factors
  let finalRisk = complexity.riskLevel;
  
  if (projectDetails.nearbyTrees && projectType.includes('extension')) {
    if (finalRisk === 'low') finalRisk = 'moderate';
    else if (finalRisk === 'moderate') finalRisk = 'significant';
  }

  return {
    level: finalRisk,
    primaryConcerns,
    investigations,
    mitigations
  };
}

function getEngineerRequirements(projectType: string): EngineerRequirement[] {
  const requirements: EngineerRequirement[] = [];
  const defaultComplexity = PROJECT_COMPLEXITY['internal-alterations']!;
  const complexity = PROJECT_COMPLEXITY[projectType] || defaultComplexity;

  // All projects need structural engineer for Building Control
  requirements.push({
    type: 'Structural Engineer',
    qualifications: [
      'Chartered Engineer (CEng)',
      'Member of Institution of Structural Engineers (MIStructE)',
      'Or Member of Institution of Civil Engineers (MICE)'
    ],
    typicalFees: complexity.typicalCost,
    deliverables: [
      'Structural calculations',
      'Structural drawings',
      'Specification for structural works',
      'Building Control liaison'
    ],
    timeline: '2-4 weeks for standard projects'
  });

  // Basements need additional specialists
  if (projectType.includes('basement')) {
    requirements.push({
      type: 'Geotechnical Engineer',
      qualifications: [
        'Chartered Geologist (CGeol) or Chartered Engineer',
        'Experience in London Clay conditions'
      ],
      typicalFees: '£3,000-8,000',
      deliverables: [
        'Ground investigation report',
        'Geotechnical design parameters',
        'Groundwater assessment',
        'Foundation recommendations'
      ],
      timeline: '3-6 weeks including site investigation'
    });

    requirements.push({
      type: 'Temporary Works Designer',
      qualifications: [
        'TWC (Temporary Works Coordinator) trained',
        'Experience in basement construction'
      ],
      typicalFees: 'Included in contractor costs',
      deliverables: [
        'Temporary propping design',
        'Excavation sequence',
        'Monitoring regime'
      ],
      timeline: 'During construction phase'
    });
  }

  // Complex projects may need checking engineer
  if (complexity.structuralComplexity === 'complex' || complexity.structuralComplexity === 'highly-complex') {
    requirements.push({
      type: 'Checking Engineer (Category 2/3)',
      qualifications: [
        'Independent CEng MIStructE',
        'Experience in project category'
      ],
      typicalFees: '10-20% of design engineer fees',
      deliverables: [
        'Independent design check certificate',
        'Check calculations'
      ],
      timeline: '1-2 weeks after design complete'
    });
  }

  return requirements;
}

function getFoundationGuidance(
  projectType: string,
  groundConditions: typeof GROUND_CONDITIONS['NW3'],
  projectDetails: StructuralProject
): FoundationGuidance {
  // Default foundation guidance
  let recommendedType = 'Strip foundations';
  let alternatives: string[] = ['Trench fill foundations'];
  let depthRange = '1.0-1.5m';
  const considerations: string[] = [];
  let cost = '£200-400 per linear meter';

  // Adjust for project type
  if (projectType.includes('basement')) {
    recommendedType = 'Reinforced concrete raft';
    alternatives = ['Piled raft', 'Contiguous piled walls with capping beam'];
    depthRange = '3.0-6.0m below existing ground';
    considerations.push('Waterproofing system essential');
    considerations.push('Pump chamber for drainage');
    cost = '£400-800 per m²';
  }

  if (projectType === 'new-build' || projectType === 'additional-storey') {
    recommendedType = 'Strip or raft foundation';
    alternatives = ['Piled foundations if poor ground'];
    depthRange = '1.0-2.5m';
    cost = '£150-350 per m²';
  }

  // Adjust for ground conditions
  if (groundConditions.shrinkability === 'High') {
    considerations.push('Minimum 1.0m depth in London Clay');
    considerations.push('Increase depth near trees (NHBC guidelines)');
    if (projectDetails.nearbyTrees) {
      depthRange = '1.5-2.5m+ depending on tree species';
      considerations.push('May need piled foundations if trees cannot be removed');
    }
  }

  if (groundConditions.waterTable === 'Variable - springs common near Heath') {
    considerations.push('Groundwater investigation essential');
    considerations.push('May need land drainage or tanking');
  }

  // Adjust for soil type
  if (projectDetails.soilType?.toLowerCase().includes('made ground')) {
    recommendedType = 'Piled foundations';
    alternatives = ['Deep strip into natural ground'];
    considerations.push('Made ground unsuitable for bearing');
  }

  // Add standard considerations
  considerations.push('Trial pit investigation recommended before finalizing design');
  considerations.push('Building Control approval required for foundation design');

  return {
    recommendedType,
    alternatives,
    depthRange,
    considerations,
    cost
  };
}

function getKeyCalculations(projectType: string): {
  name: string;
  purpose: string;
  standard: string;
  required: boolean;
}[] {
  const calculations = [
    {
      name: 'Dead and Live Loads',
      purpose: 'Determine total loads on structure',
      standard: 'BS EN 1991-1-1 (Eurocode 1)',
      required: true
    },
    {
      name: 'Foundation Bearing Pressure',
      purpose: 'Ensure foundation can support loads',
      standard: 'BS EN 1997-1 (Eurocode 7)',
      required: true
    }
  ];

  if (projectType.includes('extension') || projectType === 'new-build') {
    calculations.push({
      name: 'Beam Design',
      purpose: 'Size structural beams',
      standard: 'BS EN 1993-1-1 (Steel) or BS EN 1992-1-1 (Concrete)',
      required: true
    });
  }

  if (projectType === 'loft-conversion') {
    calculations.push({
      name: 'Floor Joist Capacity',
      purpose: 'Check existing joists or design new',
      standard: 'BS EN 1995-1-1 (Eurocode 5 Timber)',
      required: true
    });
    calculations.push({
      name: 'Ridge/Hip Beam Design',
      purpose: 'Support altered roof structure',
      standard: 'BS EN 1993-1-1 (Steel)',
      required: true
    });
  }

  if (projectType === 'wall-removal') {
    calculations.push({
      name: 'Beam and Padstone Design',
      purpose: 'Replace load-bearing wall',
      standard: 'BS EN 1993-1-1 (Steel)',
      required: true
    });
  }

  if (projectType.includes('basement')) {
    calculations.push({
      name: 'Retaining Wall Design',
      purpose: 'Resist earth and water pressure',
      standard: 'BS EN 1997-1 (Eurocode 7)',
      required: true
    });
    calculations.push({
      name: 'Hydrostatic Uplift',
      purpose: 'Prevent basement floating',
      standard: 'BS EN 1997-1 (Eurocode 7)',
      required: true
    });
    calculations.push({
      name: 'Temporary Works',
      purpose: 'Ensure safety during construction',
      standard: 'BS 5975',
      required: true
    });
  }

  if (projectType === 'additional-storey') {
    calculations.push({
      name: 'Existing Foundation Assessment',
      purpose: 'Check capacity for additional load',
      standard: 'BS EN 1997-1 (Eurocode 7)',
      required: true
    });
    calculations.push({
      name: 'Wall Panel Design',
      purpose: 'Check existing walls for new loads',
      standard: 'BS EN 1996-1-1 (Eurocode 6 Masonry)',
      required: true
    });
  }

  return calculations;
}

function getBuildingRegulations(projectType: string): {
  part: string;
  relevance: string;
  keyRequirements: string[];
}[] {
  const regulations = [
    {
      part: 'Part A - Structure',
      relevance: 'All structural works',
      keyRequirements: [
        'Building must safely withstand all loads',
        'Structural calculations required',
        'Building Control inspection at key stages'
      ]
    }
  ];

  if (projectType.includes('basement')) {
    regulations.push({
      part: 'Part C - Site Preparation',
      relevance: 'Ground conditions and waterproofing',
      keyRequirements: [
        'Protection from ground moisture',
        'Waterproofing system appropriate to grade',
        'Radon protection if in affected area'
      ]
    });
  }

  if (projectType === 'loft-conversion') {
    regulations.push({
      part: 'Part B - Fire Safety',
      relevance: 'Escape routes and fire resistance',
      keyRequirements: [
        'Protected escape route if 3+ storeys',
        '30-minute fire resistant floors',
        'Interconnected smoke alarms'
      ]
    });
  }

  regulations.push({
    part: 'Part L - Conservation of Fuel',
    relevance: 'New elements must meet thermal standards',
    keyRequirements: [
      'Insulation to meet U-value targets',
      'Thermal bridging minimized',
      'SAP calculation may be required'
    ]
  });

  return regulations;
}

function getCDMRequirements(projectType: string): {
  applicable: boolean;
  duties: string[];
  appointments: string[];
} {
  const defaultComplexity = PROJECT_COMPLEXITY['internal-alterations']!;
  const complexity = PROJECT_COMPLEXITY[projectType] || defaultComplexity;
  
  // CDM applies to all construction work but domestic clients have fewer duties
  const isHighRisk = complexity.structuralComplexity === 'highly-complex' || 
                     projectType.includes('basement');

  return {
    applicable: true,
    duties: [
      'Domestic client duties automatically pass to contractor or designer',
      'Select competent contractors',
      'Ensure adequate time and resources for safe work',
      'Provide relevant information about the site'
    ],
    appointments: isHighRisk ? [
      'Principal Designer recommended for complex projects',
      'Principal Contractor required if multiple contractors',
      'Construction Phase Plan required'
    ] : [
      'Contractor takes on principal contractor duties',
      'Designer considers buildability and safety'
    ]
  };
}

function getLocalFactors(postcode: string): string[] {
  const outcode = extractOutcode(postcode);
  const defaultGroundConds = GROUND_CONDITIONS['NW3']!;
  const groundConds = GROUND_CONDITIONS[outcode] || defaultGroundConds;
  
  const factors: string[] = [];
  
  factors.push(`Ground conditions: ${groundConds.predominantSoil}`);
  factors.push(`Typical bearing capacity: ${groundConds.bearingCapacity}`);
  factors.push(`Soil shrinkability: ${groundConds.shrinkability}`);
  
  groundConds.specialConcerns.forEach(concern => {
    factors.push(concern);
  });
  
  // Conservation area considerations
  factors.push('Heritage structures may need specialist conservation engineer');
  factors.push('Victorian/Edwardian construction often uses lime mortar - consider compatibility');
  
  // Local contractors
  factors.push('Local structural engineers familiar with area recommended');
  factors.push('Party wall surveyors often needed in terraced areas');
  
  return factors;
}

async function assessStructuralRequirements(
  address: string,
  postcode: string,
  projectType: string,
  projectDetails: StructuralProject = {}
): Promise<StructuralAssessment> {
  const outcode = extractOutcode(postcode);
  const defaultGroundConditions = GROUND_CONDITIONS['NW3']!;
  const groundConditions = GROUND_CONDITIONS[outcode] || defaultGroundConditions;
  const defaultComplexity = PROJECT_COMPLEXITY['internal-alterations']!;
  const complexity = PROJECT_COMPLEXITY[projectType] || defaultComplexity;

  // Risk assessment
  const riskAssessment = assessStructuralRisk(projectType, projectDetails, groundConditions);

  // Engineer requirements
  const engineerRequirements = getEngineerRequirements(projectType);

  // Foundation guidance
  const foundationGuidance = getFoundationGuidance(projectType, groundConditions, projectDetails);

  // Key calculations
  const keyCalculations = getKeyCalculations(projectType);

  // Building regulations
  const buildingRegulations = getBuildingRegulations(projectType);

  // CDM requirements
  const cdmRequirements = getCDMRequirements(projectType);

  // Special considerations
  const specialConsiderations: {
    category: string;
    description: string;
    action: string;
  }[] = [];

  if (projectDetails.nearbyTrees) {
    specialConsiderations.push({
      category: 'Trees',
      description: 'Trees near development can affect foundations through root action and clay shrinkage',
      action: 'Commission arboricultural report and design foundations to NHBC Chapter 4.2'
    });
  }

  if (projectType.includes('basement')) {
    specialConsiderations.push({
      category: 'Groundwater',
      description: 'Hampstead area has variable water table and spring lines',
      action: 'Install groundwater monitoring before design; design Grade 3 waterproofing minimum'
    });
    specialConsiderations.push({
      category: 'Adjacent Structures',
      description: 'Basement excavation can affect neighboring properties',
      action: 'Schedule of condition survey; monitoring during works; movement triggers agreed'
    });
  }

  if (projectDetails.existingStructure?.toLowerCase().includes('listed')) {
    specialConsiderations.push({
      category: 'Heritage Structure',
      description: 'Listed building may have historic structural elements to preserve',
      action: 'Engage conservation-accredited structural engineer; minimal intervention approach'
    });
  }

  // Costs
  const costs = [
    {
      item: 'Structural Engineer Design',
      range: complexity.typicalCost,
      notes: 'Includes calculations, drawings, Building Control liaison'
    },
    {
      item: 'Site Investigation',
      range: '£800-3,000',
      notes: 'Trial pits for foundations; more for basements'
    },
    {
      item: 'Building Control Fee',
      range: '£400-1,500',
      notes: 'Based on project value'
    }
  ];

  if (projectType.includes('basement')) {
    costs.push({
      item: 'Geotechnical Investigation',
      range: '£3,000-8,000',
      notes: 'Boreholes and groundwater monitoring'
    });
    costs.push({
      item: 'Structural Works',
      range: '£2,500-4,000 per m²',
      notes: 'Basement construction is specialist work'
    });
  }

  // Timeline
  const timeline = [
    {
      phase: 'Initial Consultation',
      duration: '1 week',
      activities: ['Site visit', 'Review existing drawings', 'Scope definition']
    },
    {
      phase: 'Site Investigation',
      duration: '1-3 weeks',
      activities: ['Trial pits', 'Soil analysis', 'Survey of existing structure']
    },
    {
      phase: 'Design Development',
      duration: '2-4 weeks',
      activities: ['Calculations', 'Drawing preparation', 'Specification']
    },
    {
      phase: 'Building Control',
      duration: '2-4 weeks',
      activities: ['Full plans submission', 'Any queries', 'Approval']
    }
  ];

  // Recommendations
  const recommendations: string[] = [];
  
  recommendations.push(`Project complexity: ${complexity.structuralComplexity} - budget accordingly`);
  recommendations.push('Appoint structural engineer early in design process');
  recommendations.push('Coordinate with architect before finalizing layout');
  
  if (riskAssessment.level === 'high' || riskAssessment.level === 'significant') {
    recommendations.push('Consider independent design check for complex elements');
    recommendations.push('Build contingency into budget (15-20%) for unforeseen conditions');
  }
  
  recommendations.push('Ensure contractor is experienced with specified construction methods');
  recommendations.push('Plan for Building Control inspections at key stages');

  return {
    address,
    postcode,
    projectType,
    riskAssessment,
    engineerRequirements,
    foundationGuidance,
    keyCalculations,
    buildingRegulations,
    cdmRequirements,
    specialConsiderations,
    localFactors: getLocalFactors(postcode),
    costs,
    timeline,
    recommendations
  };
}

// Export the service
const structuralEngineering = {
  assessStructuralRequirements,
  GROUND_CONDITIONS,
  PROJECT_COMPLEXITY
};

export default structuralEngineering;
