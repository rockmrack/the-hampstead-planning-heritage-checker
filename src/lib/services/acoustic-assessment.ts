/**
 * Acoustic Assessment Service
 * 
 * Provides acoustic impact analysis and sound insulation guidance
 * for development projects in the Hampstead area.
 */

interface AcousticProject {
  noiseSource?: string;
  existingUse?: string;
  proposedUse?: string;
  nearbyProperties?: number;
  trafficNoise?: boolean;
  aircraftNoise?: boolean;
  commercialNearby?: boolean;
  loftConversion?: boolean;
  flatConversion?: boolean;
}

interface NoiseAssessment {
  category: string;
  level: 'low' | 'moderate' | 'significant' | 'high';
  sources: string[];
  mitigations: string[];
}

interface SoundInsulation {
  element: string;
  requirement: string;
  standard: string;
  solutions: string[];
  cost: string;
}

interface AcousticAssessment {
  address: string;
  postcode: string;
  projectType: string;
  noiseAssessment: NoiseAssessment;
  soundInsulation: SoundInsulation[];
  buildingRegulations: {
    part: string;
    requirement: string;
    testingRequired: boolean;
    standard: string;
  }[];
  planningConditions: {
    likely: boolean;
    typicalConditions: string[];
    dischargeRequirements: string[];
  };
  assessmentTypes: {
    name: string;
    purpose: string;
    whenRequired: string;
    cost: string;
  }[];
  professionalRequirements: {
    role: string;
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

// Noise categories based on area characteristics
const AREA_NOISE_PROFILE: Record<string, {
  backgroundNoise: string;
  trafficNoise: string;
  aircraftNoise: string;
  typicalSources: string[];
}> = {
  'NW3': {
    backgroundNoise: 'Low-Moderate',
    trafficNoise: 'Moderate on main roads',
    aircraftNoise: 'Low (occasional Heathrow)',
    typicalSources: ['Road traffic', 'Pubs/restaurants', 'Schools']
  },
  'NW6': {
    backgroundNoise: 'Moderate',
    trafficNoise: 'High on Kilburn High Road',
    aircraftNoise: 'Low-Moderate',
    typicalSources: ['Road traffic', 'Railway', 'Commercial premises']
  },
  'NW8': {
    backgroundNoise: 'Moderate',
    trafficNoise: 'Moderate-High near Lords',
    aircraftNoise: 'Low',
    typicalSources: ['Road traffic', 'Events at Lords', 'Commercial areas']
  },
  'NW11': {
    backgroundNoise: 'Low',
    trafficNoise: 'Moderate on A1/A406',
    aircraftNoise: 'Moderate (RAF Northolt path)',
    typicalSources: ['Road traffic', 'Aircraft', 'Schools']
  }
};

// Building Regulations Part E requirements
const PART_E_REQUIREMENTS: Record<string, {
  airborne: string;
  impact: string;
  testRequired: boolean;
  standard: string;
}> = {
  'new-build-attached': {
    airborne: 'DnT,w + Ctr ≥ 45 dB',
    impact: "L'nT,w ≤ 62 dB",
    testRequired: true,
    standard: 'Approved Document E'
  },
  'conversion-attached': {
    airborne: 'DnT,w + Ctr ≥ 43 dB',
    impact: "L'nT,w ≤ 64 dB",
    testRequired: true,
    standard: 'Approved Document E'
  },
  'new-build-rooms': {
    airborne: 'DnT,w ≥ 40 dB (rooms)',
    impact: 'N/A',
    testRequired: false,
    standard: 'Approved Document E'
  }
};

// Project types requiring acoustic consideration
const PROJECT_ACOUSTIC_NEEDS: Record<string, {
  assessmentLevel: 'minimal' | 'basic' | 'full' | 'specialist';
  primaryConcerns: string[];
  testingRequired: boolean;
}> = {
  'flat-conversion': {
    assessmentLevel: 'full',
    primaryConcerns: ['Party wall insulation', 'Floor/ceiling insulation', 'Services noise'],
    testingRequired: true
  },
  'loft-conversion': {
    assessmentLevel: 'basic',
    primaryConcerns: ['Roof noise', 'Floor to rooms below', 'Dormer window'],
    testingRequired: false
  },
  'basement-conversion': {
    assessmentLevel: 'full',
    primaryConcerns: ['Ceiling insulation', 'External plant noise', 'Cinema/gym use'],
    testingRequired: true
  },
  'new-build': {
    assessmentLevel: 'specialist',
    primaryConcerns: ['Environmental noise', 'Party wall insulation', 'Building services'],
    testingRequired: true
  },
  'extension': {
    assessmentLevel: 'minimal',
    primaryConcerns: ['Window specification', 'Junction with existing'],
    testingRequired: false
  },
  'change-of-use': {
    assessmentLevel: 'full',
    primaryConcerns: ['Noise from new use', 'Protection of neighbors', 'Operating hours'],
    testingRequired: true
  },
  'mixed-use': {
    assessmentLevel: 'specialist',
    primaryConcerns: ['Commercial to residential transfer', 'Plant noise', 'Deliveries'],
    testingRequired: true
  }
};

function extractOutcode(postcode: string): string {
  const cleaned = postcode.toUpperCase().replace(/\s+/g, '');
  const match = cleaned.match(/^([A-Z]{1,2}\d{1,2})/);
  return match && match[1] ? match[1] : 'NW3';
}

function assessNoiseEnvironment(
  postcode: string,
  projectType: string,
  projectDetails: AcousticProject
): NoiseAssessment {
  const outcode = extractOutcode(postcode);
  const defaultNoiseProfile = AREA_NOISE_PROFILE['NW3']!;
  const areaProfile = AREA_NOISE_PROFILE[outcode] || defaultNoiseProfile;
  
  const sources: string[] = [...areaProfile.typicalSources];
  const mitigations: string[] = [];
  let level: 'low' | 'moderate' | 'significant' | 'high' = 'low';

  // Add specific noise sources
  if (projectDetails.trafficNoise) {
    sources.push('Road traffic (identified as significant)');
    level = 'moderate';
    mitigations.push('Acoustic glazing to traffic-facing facades');
    mitigations.push('Consider mechanical ventilation to avoid opening windows');
  }

  if (projectDetails.aircraftNoise) {
    sources.push('Aircraft noise');
    if (level === 'low') level = 'moderate';
    mitigations.push('Enhanced roof insulation');
    mitigations.push('Triple glazing consideration');
  }

  if (projectDetails.commercialNearby) {
    sources.push('Commercial premises noise');
    level = level === 'low' ? 'moderate' : 'significant';
    mitigations.push('Assessment of plant/equipment noise');
    mitigations.push('Assess delivery and operational hours');
  }

  // Project-specific considerations
  if (projectDetails.flatConversion) {
    sources.push('Internal noise transfer between flats');
    level = 'significant';
    mitigations.push('Enhanced party wall and floor constructions');
    mitigations.push('Pre-completion testing required');
  }

  if (projectDetails.loftConversion) {
    sources.push('Roof and external wall noise ingress');
    mitigations.push('Insulated roof construction');
    mitigations.push('Acoustic specification for dormer windows');
  }

  // Determine category
  let category = 'Standard Residential';
  if (projectType === 'mixed-use') {
    category = 'Mixed Use Development';
  } else if (projectDetails.flatConversion) {
    category = 'Flat Conversion';
  } else if (projectType === 'change-of-use') {
    category = 'Change of Use';
  }

  return {
    category,
    level,
    sources,
    mitigations
  };
}

function getSoundInsulationRequirements(
  projectType: string,
  projectDetails: AcousticProject
): SoundInsulation[] {
  const requirements: SoundInsulation[] = [];

  if (projectDetails.flatConversion || projectType === 'flat-conversion') {
    requirements.push({
      element: 'Separating Walls (Party Walls)',
      requirement: 'DnT,w + Ctr ≥ 43 dB',
      standard: 'Approved Document E - Conversion',
      solutions: [
        'Independent acoustic stud wall',
        'Resilient bar system with double plasterboard',
        'Acoustic mineral wool insulation',
        'Sealed at all edges and services'
      ],
      cost: '£80-150/m²'
    });

    requirements.push({
      element: 'Separating Floors',
      requirement: "Airborne: DnT,w + Ctr ≥ 43 dB, Impact: L'nT,w ≤ 64 dB",
      standard: 'Approved Document E - Conversion',
      solutions: [
        'Floating floor on acoustic mat',
        'Independent ceiling below',
        'Acoustic mineral wool between joists',
        'Heavy flooring finish (screed or boards)'
      ],
      cost: '£100-200/m²'
    });
  }

  if (projectType === 'new-build' || projectType === 'mixed-use') {
    requirements.push({
      element: 'Separating Walls (Party Walls)',
      requirement: 'DnT,w + Ctr ≥ 45 dB',
      standard: 'Approved Document E - New Build',
      solutions: [
        'Robust Standard Details (RSDs)',
        'Twin-leaf masonry construction',
        'Metal or timber frame with resilient layers',
        'Full cavity fill with acoustic insulation'
      ],
      cost: '£100-180/m²'
    });

    requirements.push({
      element: 'Separating Floors',
      requirement: "Airborne: DnT,w + Ctr ≥ 45 dB, Impact: L'nT,w ≤ 62 dB",
      standard: 'Approved Document E - New Build',
      solutions: [
        'Concrete floor with resilient layer',
        'Timber floor with acoustic treatment',
        'Ceiling with independent hangers',
        'Heavy screed or floating floor finish'
      ],
      cost: '£120-220/m²'
    });
  }

  // External envelope for all projects
  requirements.push({
    element: 'External Windows',
    requirement: 'Rw 30-40 dB depending on external noise',
    standard: 'BS EN ISO 10140',
    solutions: [
      'Standard double glazing (Rw ~30 dB)',
      'Acoustic double glazing with laminated pane',
      'Secondary glazing (Rw ~45 dB combined)',
      'Triple glazing for high noise areas'
    ],
    cost: '£300-800 per window'
  });

  requirements.push({
    element: 'Roof/Ceiling',
    requirement: 'Reduce external noise to acceptable internal levels',
    standard: 'BS 8233',
    solutions: [
      'Mineral wool between rafters (minimum 100mm)',
      'Resilient bars with double plasterboard',
      'Heavy tiles or concrete tiles',
      'Sarking board under tiles'
    ],
    cost: '£40-80/m²'
  });

  if (projectType === 'mixed-use' || projectDetails.commercialNearby) {
    requirements.push({
      element: 'Commercial/Residential Interface',
      requirement: 'Specialist design to achieve 10 dB below background',
      standard: 'BS 4142 / BS 8233',
      solutions: [
        'Box-in-box construction',
        'Floating floor systems',
        'Isolation of building services',
        'Vibration isolation for plant'
      ],
      cost: '£200-500/m² for specialist treatment'
    });
  }

  return requirements;
}

function getAssessmentTypes(projectType: string): {
  name: string;
  purpose: string;
  whenRequired: string;
  cost: string;
}[] {
  const assessments = [
    {
      name: 'Environmental Noise Survey',
      purpose: 'Measure external noise affecting site',
      whenRequired: 'New residential near roads/railways/commercial',
      cost: '£800-2,000'
    },
    {
      name: 'Pre-completion Sound Testing',
      purpose: 'Verify separating elements meet Part E',
      whenRequired: 'Conversions and new-build attached dwellings',
      cost: '£200-400 per test set'
    }
  ];

  if (projectType === 'flat-conversion' || projectType === 'new-build') {
    assessments.push({
      name: 'Acoustic Design Report',
      purpose: 'Specify constructions to meet Part E',
      whenRequired: 'All conversions and new attached dwellings',
      cost: '£500-1,500'
    });
  }

  if (projectType === 'mixed-use' || projectType === 'change-of-use') {
    assessments.push({
      name: 'Noise Impact Assessment',
      purpose: 'Assess impact of development on neighbors',
      whenRequired: 'Planning requirement for noise-generating uses',
      cost: '£1,500-4,000'
    });

    assessments.push({
      name: 'Plant Noise Assessment',
      purpose: 'Ensure mechanical plant meets BS 4142',
      whenRequired: 'Where external plant is proposed',
      cost: '£800-2,000'
    });
  }

  if (projectType === 'basement-conversion') {
    assessments.push({
      name: 'Entertainment Noise Assessment',
      purpose: 'Design for cinema/music room/gym use',
      whenRequired: 'Where specialist use rooms proposed',
      cost: '£1,000-3,000'
    });
  }

  return assessments;
}

function getPlanningConditions(projectType: string): {
  likely: boolean;
  typicalConditions: string[];
  dischargeRequirements: string[];
} {
  const defaultNeeds = PROJECT_ACOUSTIC_NEEDS['extension']!;
  const projectNeeds = PROJECT_ACOUSTIC_NEEDS[projectType] || defaultNeeds;
  
  const typicalConditions: string[] = [];
  const dischargeRequirements: string[] = [];

  if (projectNeeds.assessmentLevel === 'full' || projectNeeds.assessmentLevel === 'specialist') {
    typicalConditions.push('Noise impact assessment to be submitted and approved');
    typicalConditions.push('Sound insulation scheme to be approved before occupation');
    dischargeRequirements.push('Acoustic report by qualified consultant');
    dischargeRequirements.push('Detailed specification of sound insulation measures');
  }

  if (projectType === 'mixed-use' || projectType === 'change-of-use') {
    typicalConditions.push('Noise levels at boundary not to exceed specified limits');
    typicalConditions.push('Operating hours restriction');
    typicalConditions.push('Plant noise rating level to be 10 dB below background');
    dischargeRequirements.push('BS 4142 assessment for plant');
    dischargeRequirements.push('Commissioning noise measurements');
  }

  if (projectNeeds.testingRequired) {
    typicalConditions.push('Pre-completion sound testing to demonstrate compliance');
    dischargeRequirements.push('Test results by UKAS accredited tester');
  }

  return {
    likely: projectNeeds.assessmentLevel !== 'minimal',
    typicalConditions,
    dischargeRequirements
  };
}

function getLocalFactors(postcode: string, projectType: string): string[] {
  const outcode = extractOutcode(postcode);
  const factors: string[] = [];

  // Camden-specific policies
  factors.push('Camden requires noise assessment for developments near major roads');
  factors.push('Camden Policy CC5 addresses environmental noise');

  // Area-specific
  const defaultNoiseProfile = AREA_NOISE_PROFILE['NW3']!;
  const areaProfile = AREA_NOISE_PROFILE[outcode] || defaultNoiseProfile;
  factors.push(`${outcode} background noise level: ${areaProfile.backgroundNoise}`);
  factors.push(`Traffic noise in area: ${areaProfile.trafficNoise}`);
  factors.push(`Aircraft noise: ${areaProfile.aircraftNoise}`);

  // Conservation area considerations
  factors.push('External acoustic treatment must be sensitive to conservation area character');
  factors.push('Secondary glazing often preferred over replacement in listed buildings');

  // Local consultants
  factors.push('Local acoustic consultants familiar with Camden requirements recommended');

  return factors;
}

async function assessAcousticRequirements(
  address: string,
  postcode: string,
  projectType: string,
  projectDetails: AcousticProject = {}
): Promise<AcousticAssessment> {
  const defaultProjectNeeds = PROJECT_ACOUSTIC_NEEDS['extension']!;
  const projectNeeds = PROJECT_ACOUSTIC_NEEDS[projectType] || defaultProjectNeeds;

  // Noise assessment
  const noiseAssessment = assessNoiseEnvironment(postcode, projectType, projectDetails);

  // Sound insulation requirements
  const soundInsulation = getSoundInsulationRequirements(projectType, projectDetails);

  // Building regulations
  const buildingRegulations: {
    part: string;
    requirement: string;
    testingRequired: boolean;
    standard: string;
  }[] = [];

  if (projectType === 'flat-conversion' || projectType === 'basement-conversion') {
    const defaultPartE = PART_E_REQUIREMENTS['conversion-attached']!;
    const partE = PART_E_REQUIREMENTS['conversion-attached'] || defaultPartE;
    buildingRegulations.push({
      part: 'Part E - Resistance to Sound',
      requirement: `Airborne: ${partE.airborne}, Impact: ${partE.impact}`,
      testingRequired: partE.testRequired,
      standard: partE.standard
    });
  } else if (projectType === 'new-build') {
    const defaultPartE = PART_E_REQUIREMENTS['new-build-attached']!;
    const partE = PART_E_REQUIREMENTS['new-build-attached'] || defaultPartE;
    buildingRegulations.push({
      part: 'Part E - Resistance to Sound',
      requirement: `Airborne: ${partE.airborne}, Impact: ${partE.impact}`,
      testingRequired: partE.testRequired,
      standard: partE.standard
    });
  }

  buildingRegulations.push({
    part: 'Part F - Ventilation',
    requirement: 'Acoustic treatment must not compromise ventilation',
    testingRequired: false,
    standard: 'Approved Document F'
  });

  // Planning conditions
  const planningConditions = getPlanningConditions(projectType);

  // Assessment types
  const assessmentTypes = getAssessmentTypes(projectType);

  // Professional requirements
  const professionalRequirements = [
    {
      role: 'Acoustic Consultant',
      qualifications: [
        'Member of Institute of Acoustics (MIOA)',
        'Or Chartered Engineer with acoustic experience'
      ],
      typicalFees: '£500-3,000 depending on scope'
    }
  ];

  if (projectNeeds.testingRequired) {
    professionalRequirements.push({
      role: 'Sound Testing Engineer',
      qualifications: [
        'UKAS accredited for sound testing',
        'ANC Registration Scheme member'
      ],
      typicalFees: '£200-400 per test set'
    });
  }

  // Timeline
  const timeline = [
    {
      phase: 'Initial Survey',
      duration: '1-2 weeks',
      activities: ['Site visit', 'Baseline noise measurements', 'Review project']
    },
    {
      phase: 'Design',
      duration: '2-4 weeks',
      activities: ['Acoustic design specification', 'Material selection', 'Detail drawings']
    },
    {
      phase: 'Construction',
      duration: 'Project dependent',
      activities: ['Installation of acoustic measures', 'Quality control', 'Site inspections']
    }
  ];

  if (projectNeeds.testingRequired) {
    timeline.push({
      phase: 'Testing',
      duration: '1 week',
      activities: ['Pre-completion sound testing', 'Analysis', 'Certification']
    });
  }

  // Costs
  const costs = [
    {
      item: 'Acoustic Survey',
      range: '£800-2,000',
      notes: 'Environmental noise measurement'
    },
    {
      item: 'Acoustic Design Report',
      range: '£500-1,500',
      notes: 'Specification of insulation measures'
    },
    {
      item: 'Sound Testing',
      range: '£200-400 per set',
      notes: 'Pre-completion Part E testing'
    },
    {
      item: 'Remedial Works',
      range: 'Variable',
      notes: 'Allow 10% contingency for failed tests'
    }
  ];

  // Recommendations
  const recommendations: string[] = [];
  
  if (projectNeeds.assessmentLevel === 'full' || projectNeeds.assessmentLevel === 'specialist') {
    recommendations.push('Appoint acoustic consultant early in design process');
    recommendations.push('Include acoustic specifications in contractor tender');
  }

  if (projectNeeds.testingRequired) {
    recommendations.push('Plan for pre-completion testing in construction program');
    recommendations.push('Ensure contractor understands acoustic requirements');
    recommendations.push('Build in time/budget for potential remedial works');
  }

  recommendations.push('Coordinate acoustic design with building services');
  recommendations.push('Consider user needs - some rooms need more protection than others');

  return {
    address,
    postcode,
    projectType,
    noiseAssessment,
    soundInsulation,
    buildingRegulations,
    planningConditions,
    assessmentTypes,
    professionalRequirements,
    localFactors: getLocalFactors(postcode, projectType),
    timeline,
    costs,
    recommendations
  };
}

// Export the service
const acousticAssessment = {
  assessAcousticRequirements,
  AREA_NOISE_PROFILE,
  PART_E_REQUIREMENTS,
  PROJECT_ACOUSTIC_NEEDS
};

export default acousticAssessment;
