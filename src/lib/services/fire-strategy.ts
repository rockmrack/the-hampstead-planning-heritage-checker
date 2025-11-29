/**
 * Fire Strategy Service
 * 
 * Provides fire safety guidance and compliance requirements
 * for development projects in the Hampstead area.
 */

interface FireProject {
  buildingHeight?: number;
  numberOfStoreys?: number;
  dwellingType?: string;
  existingFireMeasures?: string[];
  escapedRoutes?: number;
  occupancyType?: string;
  vulnerableOccupants?: boolean;
  basementLevel?: boolean;
}

interface FireRisk {
  level: 'low' | 'moderate' | 'significant' | 'high';
  factors: string[];
  concernAreas: string[];
}

interface MeansOfEscape {
  requirement: string;
  options: string[];
  distances: {
    type: string;
    maximum: string;
    notes: string;
  }[];
  specialRequirements: string[];
}

interface FireResistance {
  element: string;
  requirement: string;
  typicalSolutions: string[];
  testStandard: string;
}

interface DetectionSystem {
  grade: string;
  category: string;
  description: string;
  components: string[];
  coverage: string;
}

interface FireAssessment {
  address: string;
  postcode: string;
  projectType: string;
  riskAssessment: FireRisk;
  meansOfEscape: MeansOfEscape;
  fireResistance: FireResistance[];
  detectionSystem: DetectionSystem;
  externalWalls: {
    requirements: string[];
    materials: {
      material: string;
      permitted: boolean;
      notes: string;
    }[];
  };
  buildingRegulations: {
    part: string;
    requirement: string;
    keyPoints: string[];
  }[];
  professionalRequirements: {
    role: string;
    whenRequired: string;
    qualifications: string[];
    typicalFees: string;
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

// Building purpose groups for fire safety
const PURPOSE_GROUPS: Record<string, {
  description: string;
  fireResistanceMinutes: number;
  compartmentSize: string;
  detectionGrade: string;
}> = {
  '1a-flat': {
    description: 'Flat',
    fireResistanceMinutes: 30,
    compartmentSize: 'Each flat is a compartment',
    detectionGrade: 'Grade D1 Category LD3'
  },
  '1a-house': {
    description: 'Dwelling house',
    fireResistanceMinutes: 30,
    compartmentSize: 'Not applicable',
    detectionGrade: 'Grade D1 Category LD3'
  },
  '1b-institutional': {
    description: 'Institutional (care homes)',
    fireResistanceMinutes: 60,
    compartmentSize: '2000m² single storey, 1000m² multi',
    detectionGrade: 'Grade A Category L1'
  },
  '1c-other-residential': {
    description: 'Hotels, hostels, HMO',
    fireResistanceMinutes: 60,
    compartmentSize: '2000m² single storey, 1000m² multi',
    detectionGrade: 'Grade A Category L2/M'
  }
};

// Project types and their fire safety implications
const PROJECT_FIRE_REQUIREMENTS: Record<string, {
  riskLevel: 'low' | 'moderate' | 'significant' | 'high';
  keyRequirements: string[];
  specialConsiderations: string[];
}> = {
  'single-storey-extension': {
    riskLevel: 'low',
    keyRequirements: [
      'Maintain existing means of escape',
      'Smoke alarms to extend to new areas'
    ],
    specialConsiderations: []
  },
  'double-storey-extension': {
    riskLevel: 'moderate',
    keyRequirements: [
      'Protected stairway if 3+ storey',
      'Fire resistance to party elements',
      'Smoke alarms in circulation spaces'
    ],
    specialConsiderations: ['Consider inner room situation']
  },
  'loft-conversion': {
    riskLevel: 'moderate',
    keyRequirements: [
      'Protected stairway essential',
      '30 min fire doors',
      'Interconnected smoke alarms',
      'Alternative escape if >4.5m height'
    ],
    specialConsiderations: ['Escape window or alternative route required']
  },
  'basement-conversion': {
    riskLevel: 'significant',
    keyRequirements: [
      'Protected stairway to final exit',
      '30 min fire resistance',
      'Smoke detection',
      'Natural or mechanical ventilation'
    ],
    specialConsiderations: ['Deep basements need enhanced measures']
  },
  'flat-conversion': {
    riskLevel: 'high',
    keyRequirements: [
      'Compartmentation between flats',
      'Protected common areas',
      'Fire resisting doors',
      'Emergency lighting in common areas'
    ],
    specialConsiderations: ['Fire strategy likely required', 'Common parts management']
  },
  'new-build': {
    riskLevel: 'significant',
    keyRequirements: [
      'Full Part B compliance',
      'Sprinklers if >11m/18m height',
      'External wall materials compliance',
      'Fire strategy required'
    ],
    specialConsiderations: ['Post-Grenfell requirements apply']
  },
  'change-of-use': {
    riskLevel: 'high',
    keyRequirements: [
      'Upgrade to new use standards',
      'Fire risk assessment',
      'Detection and alarm system',
      'Emergency lighting if applicable'
    ],
    specialConsiderations: ['Heritage buildings may need creative solutions']
  },
  'hmo-conversion': {
    riskLevel: 'high',
    keyRequirements: [
      'Protected escape routes',
      'Fire doors to all rooms',
      'Grade A fire detection system',
      'Emergency lighting',
      'Fire blankets in kitchens'
    ],
    specialConsiderations: ['Licensing requirements', 'Management responsibilities']
  }
};

// Smoke and fire alarm grades
const ALARM_GRADES: Record<string, {
  description: string;
  powerSource: string;
  interconnection: string;
  monitoring: string;
}> = {
  'Grade A': {
    description: 'Control panel with power supply, detectors and call points',
    powerSource: 'Mains with standby supply',
    interconnection: 'Hardwired to panel',
    monitoring: 'Can include remote signalling'
  },
  'Grade D1': {
    description: 'Mains-powered smoke alarms with integral standby',
    powerSource: 'Mains with battery backup',
    interconnection: 'Hardwired interconnection',
    monitoring: 'Local only'
  },
  'Grade D2': {
    description: 'Mains-powered smoke alarms without standby',
    powerSource: 'Mains only',
    interconnection: 'Hardwired interconnection',
    monitoring: 'Local only'
  },
  'Grade F1': {
    description: 'Battery-powered smoke alarms (long-life)',
    powerSource: '10-year sealed battery',
    interconnection: 'Radio or acoustic',
    monitoring: 'Local only'
  }
};

function extractOutcode(postcode: string): string {
  const cleaned = postcode.toUpperCase().replace(/\s+/g, '');
  const match = cleaned.match(/^([A-Z]{1,2}\d{1,2})/);
  return match && match[1] ? match[1] : 'NW3';
}

function assessFireRisk(
  projectType: string,
  projectDetails: FireProject
): FireRisk {
  const defaultProjectReq = PROJECT_FIRE_REQUIREMENTS['single-storey-extension']!;
  const projectReq = PROJECT_FIRE_REQUIREMENTS[projectType] || defaultProjectReq;
  
  const factors: string[] = [];
  const concernAreas: string[] = [];
  let level = projectReq.riskLevel;

  // Base factors from project type
  factors.push(`Project type (${projectType}) has inherent ${projectReq.riskLevel} fire risk`);

  // Height/storey factors
  if (projectDetails.numberOfStoreys) {
    if (projectDetails.numberOfStoreys >= 4) {
      if (level !== 'high') level = 'significant';
      factors.push(`${projectDetails.numberOfStoreys} storeys increases escape complexity`);
      concernAreas.push('Travel distance from upper floors');
    }
    if (projectDetails.numberOfStoreys >= 7) {
      level = 'high';
      factors.push('Building over 18m may require sprinklers');
      concernAreas.push('Firefighting access');
    }
  }

  if (projectDetails.buildingHeight) {
    if (projectDetails.buildingHeight > 11) {
      factors.push('Building height >11m - enhanced requirements');
      concernAreas.push('External wall materials');
    }
    if (projectDetails.buildingHeight > 18) {
      level = 'high';
      factors.push('Building height >18m - sprinklers likely required');
      concernAreas.push('Firefighting shaft', 'Sprinkler system');
    }
  }

  // Basement considerations
  if (projectDetails.basementLevel) {
    factors.push('Basement level requires careful escape planning');
    concernAreas.push('Smoke ventilation', 'Protected route to final exit');
    if (level === 'low') level = 'moderate';
  }

  // Vulnerable occupants
  if (projectDetails.vulnerableOccupants) {
    factors.push('Vulnerable occupants require enhanced protection');
    concernAreas.push('Early warning systems', 'Refuge areas', 'Evacuation assistance');
    if (level === 'low') level = 'moderate';
    if (level === 'moderate') level = 'significant';
  }

  // Escape routes
  if (projectDetails.escapedRoutes === 1) {
    factors.push('Single escape route - protected stairway essential');
    concernAreas.push('Alternative escape from upper floors');
  }

  return {
    level,
    factors,
    concernAreas
  };
}

function getMeansOfEscape(
  projectType: string,
  projectDetails: FireProject
): MeansOfEscape {
  const requirement = projectDetails.numberOfStoreys && projectDetails.numberOfStoreys > 2
    ? 'Protected stairway from all floors to final exit'
    : 'Adequate means of escape from all rooms';

  const options: string[] = [];
  const specialRequirements: string[] = [];

  if (projectType === 'loft-conversion') {
    options.push('Protected stairway extended to loft');
    options.push('Alternative escape window (if >4.5m, dormer or roof access)');
    options.push('Sprinkler system in lieu of protected stairway (BS 9251)');
    specialRequirements.push('Fire doors FD30 to all habitable rooms opening onto stair');
    specialRequirements.push('30-minute fire-resisting enclosure to stairway');
  } else if (projectType === 'flat-conversion') {
    options.push('Protected common stairway');
    options.push('Escape windows for upper floors (<4.5m)');
    options.push('Second stairway if travel distance exceeded');
    specialRequirements.push('Compartmentation between flats');
    specialRequirements.push('FD30S doors to flat entrance');
    specialRequirements.push('Emergency lighting in common areas');
  } else if (projectType === 'basement-conversion') {
    options.push('Protected stair to ground floor exit');
    options.push('External lightwellwith ladder escape');
    specialRequirements.push('Smoke ventilation for basement');
    specialRequirements.push('Self-closing fire doors');
  } else {
    options.push('Direct escape to outside');
    options.push('Inner room escape through access room');
    options.push('Protected stairway');
  }

  const distances = [
    {
      type: 'Escape in one direction only',
      maximum: '9m',
      notes: 'To protected stairway or final exit'
    },
    {
      type: 'Escape in more than one direction',
      maximum: '18m',
      notes: 'Each route leads to separate exits'
    },
    {
      type: 'Within flat/dwelling',
      maximum: 'No set limit',
      notes: 'But rooms should not be too remote from escape route'
    }
  ];

  return {
    requirement,
    options,
    distances,
    specialRequirements
  };
}

function getFireResistance(
  projectType: string,
  projectDetails: FireProject
): FireResistance[] {
  const requirements: FireResistance[] = [];
  
  // Standard for most residential
  let firePeriod = 30;
  
  if (projectDetails.numberOfStoreys && projectDetails.numberOfStoreys >= 5) {
    firePeriod = 60;
  }
  if (projectDetails.buildingHeight && projectDetails.buildingHeight > 18) {
    firePeriod = 60;
  }

  requirements.push({
    element: 'Walls - Loadbearing',
    requirement: `${firePeriod} minutes (REI ${firePeriod})`,
    typicalSolutions: [
      '100mm blockwork with plaster',
      'Twin stud with fire-rated board',
      'Fire-rated timber frame system'
    ],
    testStandard: 'BS EN 13501-2'
  });

  requirements.push({
    element: 'Floors',
    requirement: `${firePeriod} minutes (REI ${firePeriod})`,
    typicalSolutions: [
      'Timber joists with plasterboard ceiling',
      'Concrete floor slab',
      'Steel deck with fire protection'
    ],
    testStandard: 'BS EN 13501-2'
  });

  if (projectType === 'flat-conversion' || projectType === 'hmo-conversion') {
    requirements.push({
      element: 'Separating Walls/Floors (Compartment)',
      requirement: `${firePeriod} minutes (REI ${firePeriod}) full height`,
      typicalSolutions: [
        'Extend walls to underside of roof covering',
        'Fire-stopped at all service penetrations',
        'Fire cavity barriers in concealed spaces'
      ],
      testStandard: 'BS EN 13501-2'
    });
  }

  requirements.push({
    element: 'Fire Doors',
    requirement: 'FD30 (30 min) or FD30S (with smoke seals)',
    typicalSolutions: [
      'Solid core timber door with intumescent strips',
      'Fire-rated composite door',
      'Self-closing device (overhead or concealed)'
    ],
    testStandard: 'BS 476-22 / BS EN 1634-1'
  });

  requirements.push({
    element: 'Protected Stairway Enclosure',
    requirement: `${firePeriod} minutes from all sides`,
    typicalSolutions: [
      'Fire-rated lining to walls and ceilings',
      'FD30S doors at all openings',
      'No openings except to toilets/storage'
    ],
    testStandard: 'BS EN 13501-2'
  });

  return requirements;
}

function getDetectionSystem(
  projectType: string,
  projectDetails: FireProject
): DetectionSystem {
  let grade = 'Grade D1';
  let category = 'LD3';
  let description = 'Mains-powered interconnected smoke alarms';
  let coverage = 'Circulation spaces on each storey';
  const components: string[] = [];

  if (projectType === 'flat-conversion') {
    grade = 'Grade D1';
    category = 'LD2';
    description = 'Mains-powered interconnected alarms in each flat';
    coverage = 'Circulation spaces plus living rooms, all floors';
    components.push('Smoke detector in hallway/landing each floor');
    components.push('Smoke detector in main living room');
    components.push('Heat detector in kitchen');
  } else if (projectType === 'hmo-conversion' || projectType === 'change-of-use') {
    grade = 'Grade A';
    category = 'LD2 or M';
    description = 'Conventional fire alarm system with control panel';
    coverage = 'Common areas, escape routes, all bedrooms';
    components.push('Fire alarm control panel');
    components.push('Manual call points at exits');
    components.push('Smoke detectors in circulation and common areas');
    components.push('Smoke or heat detector in each bedroom');
  } else if (projectType === 'loft-conversion') {
    grade = 'Grade D1';
    category = 'LD2';
    description = 'Extended detection to cover new storey';
    coverage = 'All circulation spaces including new loft';
    components.push('Interlinked smoke alarm in new loft level');
    components.push('Smoke alarms on all other floors (if not present)');
    components.push('Heat detector in loft if kitchen present');
  } else {
    // Standard house extension
    components.push('Smoke alarm in circulation space each floor');
    components.push('Heat detector in kitchen (if not present)');
  }

  if (projectDetails.vulnerableOccupants) {
    components.push('Visual alarm indicators');
    components.push('Vibrating pad alerts for hearing impaired');
  }

  return {
    grade,
    category,
    description,
    components,
    coverage
  };
}

function getExternalWalls(
  projectType: string,
  projectDetails: FireProject
): {
  requirements: string[];
  materials: {
    material: string;
    permitted: boolean;
    notes: string;
  }[];
} {
  const requirements: string[] = [];
  const materials: {
    material: string;
    permitted: boolean;
    notes: string;
  }[] = [];

  // Post-Grenfell requirements
  if (projectDetails.buildingHeight && projectDetails.buildingHeight > 11) {
    requirements.push('Building Safety Act 2022 requirements apply');
    requirements.push('External wall system must achieve Class A2-s1,d0 or better');
    requirements.push('Desktop study or full-scale fire test required');
    
    materials.push({
      material: 'Combustible cladding (plastic-based)',
      permitted: false,
      notes: 'Banned above 11m for residential'
    });
    materials.push({
      material: 'Metal cladding (aluminium/steel)',
      permitted: true,
      notes: 'Core material must be non-combustible'
    });
    materials.push({
      material: 'Brick/render',
      permitted: true,
      notes: 'Non-combustible - compliant'
    });
    materials.push({
      material: 'Timber cladding',
      permitted: false,
      notes: 'Not permitted above 11m without special measures'
    });
  } else {
    requirements.push('External walls should be Class B-s3,d2 or better within 1m of boundary');
    requirements.push('Flame spread classification to be appropriate');
    
    materials.push({
      material: 'Brick/render',
      permitted: true,
      notes: 'Generally compliant'
    });
    materials.push({
      material: 'Timber cladding',
      permitted: true,
      notes: 'Check fire retardant treatment needed'
    });
    materials.push({
      material: 'Metal cladding',
      permitted: true,
      notes: 'Appropriate for most situations'
    });
  }

  // Conservation area considerations
  requirements.push('Material choices may be constrained by conservation area requirements');

  return {
    requirements,
    materials
  };
}

function getLocalFactors(postcode: string): string[] {
  const factors: string[] = [];

  factors.push('London Fire Brigade (LFB) is the relevant fire authority');
  factors.push('Building Control (Camden Council or Approved Inspector) will assess fire safety');
  factors.push('Fire Risk Assessment required under Regulatory Reform (Fire Safety) Order 2005');

  // Conservation area considerations
  factors.push('Listed building/conservation area may limit fire safety options');
  factors.push('Creative solutions often needed for heritage buildings');
  factors.push('Listed Building Consent required for fire doors in listed properties');

  // Local specifics
  factors.push('Hampstead has many Victorian properties with limited fire protection');
  factors.push('Narrow streets may affect fire brigade access');
  factors.push('Check sprinkler provision requirements for tall buildings');

  return factors;
}

async function assessFireRequirements(
  address: string,
  postcode: string,
  projectType: string,
  projectDetails: FireProject = {}
): Promise<FireAssessment> {
  // Risk assessment
  const riskAssessment = assessFireRisk(projectType, projectDetails);

  // Means of escape
  const meansOfEscape = getMeansOfEscape(projectType, projectDetails);

  // Fire resistance
  const fireResistance = getFireResistance(projectType, projectDetails);

  // Detection system
  const detectionSystem = getDetectionSystem(projectType, projectDetails);

  // External walls
  const externalWalls = getExternalWalls(projectType, projectDetails);

  // Building regulations
  const buildingRegulations = [
    {
      part: 'Part B - Fire Safety',
      requirement: 'Means of warning, escape, internal spread, external spread, access',
      keyPoints: [
        'B1 - Means of warning and escape',
        'B2 - Internal fire spread (linings)',
        'B3 - Internal fire spread (structure)',
        'B4 - External fire spread',
        'B5 - Access and facilities for fire service'
      ]
    }
  ];

  if (projectType === 'flat-conversion' || projectType === 'new-build') {
    buildingRegulations.push({
      part: 'Regulatory Reform (Fire Safety) Order 2005',
      requirement: 'Fire Risk Assessment for common areas',
      keyPoints: [
        'Responsible person must carry out FRA',
        'Keep FRA under review',
        'Implement fire safety measures'
      ]
    });
  }

  // Professional requirements
  const professionalRequirements = [
    {
      role: 'Building Control',
      whenRequired: 'All projects',
      qualifications: ['Local Authority BC', 'Approved Inspector'],
      typicalFees: '£400-1,500'
    }
  ];

  if (riskAssessment.level === 'significant' || riskAssessment.level === 'high') {
    professionalRequirements.push({
      role: 'Fire Engineer',
      whenRequired: 'Complex projects or fire strategy required',
      qualifications: ['Member of Institution of Fire Engineers', 'Chartered engineer'],
      typicalFees: '£2,000-10,000'
    });
  }

  if (projectType === 'flat-conversion' || projectType === 'hmo-conversion') {
    professionalRequirements.push({
      role: 'Fire Risk Assessor',
      whenRequired: 'Multi-occupancy buildings',
      qualifications: ['Third party certificated', 'IFE or BAFE registered'],
      typicalFees: '£300-800 per assessment'
    });
  }

  // Timeline
  const timeline = [
    {
      phase: 'Design',
      duration: '2-4 weeks',
      activities: ['Fire strategy development', 'Detail design', 'Product specification']
    },
    {
      phase: 'Building Control',
      duration: '2-4 weeks',
      activities: ['Full plans submission', 'Fire safety review', 'Approval']
    },
    {
      phase: 'Installation',
      duration: 'Project dependent',
      activities: ['Fire stopping', 'Door installation', 'Alarm system installation']
    },
    {
      phase: 'Commissioning',
      duration: '1 week',
      activities: ['Alarm testing', 'Documentation', 'Building Control final']
    }
  ];

  // Costs
  const costs = [
    {
      item: 'Fire Strategy Report',
      range: '£1,500-5,000',
      notes: 'For complex projects'
    },
    {
      item: 'Fire Doors (FD30S)',
      range: '£400-800 per door installed',
      notes: 'Including ironmongery and intumescent seals'
    },
    {
      item: 'Fire Alarm System',
      range: '£500-3,000',
      notes: 'Grade D1 to Grade A depending on requirement'
    },
    {
      item: 'Fire Stopping Works',
      range: '£50-100 per penetration',
      notes: 'Service penetrations through fire walls'
    },
    {
      item: 'Emergency Lighting',
      range: '£150-300 per unit',
      notes: 'For common areas and escape routes'
    }
  ];

  // Recommendations
  const recommendations: string[] = [];
  
  if (riskAssessment.level === 'high' || riskAssessment.level === 'significant') {
    recommendations.push('Consider fire engineer involvement early');
    recommendations.push('Pre-application discussion with Building Control advisable');
  }

  recommendations.push('Ensure fire safety measures are included in contractor scope');
  recommendations.push('Plan for commissioning and certification');
  recommendations.push('Keep records of all fire safety installations');

  if (projectType === 'flat-conversion' || projectType === 'hmo-conversion') {
    recommendations.push('Establish responsible person for ongoing FRA');
    recommendations.push('Plan for maintenance of common area fire systems');
  }

  return {
    address,
    postcode,
    projectType,
    riskAssessment,
    meansOfEscape,
    fireResistance,
    detectionSystem,
    externalWalls,
    buildingRegulations,
    professionalRequirements,
    localFactors: getLocalFactors(postcode),
    timeline,
    costs,
    recommendations
  };
}

// Export the service
const fireStrategy = {
  assessFireRequirements,
  PURPOSE_GROUPS,
  PROJECT_FIRE_REQUIREMENTS,
  ALARM_GRADES
};

export default fireStrategy;
