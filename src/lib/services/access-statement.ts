/**
 * Access Statement Service
 * 
 * Provides accessibility assessment and guidance for development projects
 * to ensure compliance with Part M of Building Regulations and Equality Act 2010.
 */

interface AccessProject {
  buildingType?: string;
  numberOfStoreys?: number;
  existingAccess?: string;
  publicAccess?: boolean;
  dwellingType?: string;
  commonAreas?: boolean;
  externalSpaces?: boolean;
  liftsProvided?: boolean;
}

interface AccessRequirement {
  element: string;
  requirement: string;
  standard: string;
  solutions: string[];
}

interface M4Category {
  category: string;
  description: string;
  features: string[];
  whenRequired: string;
}

interface AccessAssessment {
  address: string;
  postcode: string;
  projectType: string;
  applicableStandards: {
    standard: string;
    description: string;
    application: string;
  }[];
  m4Categories: M4Category[];
  accessRequirements: AccessRequirement[];
  externalAccess: {
    element: string;
    requirement: string;
    solutions: string[];
  }[];
  internalAccess: {
    element: string;
    requirement: string;
    solutions: string[];
  }[];
  accessStatement: {
    required: boolean;
    sections: string[];
    contentGuidance: string[];
  };
  planningConsiderations: string[];
  buildingRegulations: {
    part: string;
    requirement: string;
    keyPoints: string[];
  }[];
  localFactors: string[];
  costs: {
    item: string;
    range: string;
    notes: string;
  }[];
  recommendations: string[];
}

// Part M Categories
const PART_M_CATEGORIES: Record<string, {
  description: string;
  applies: string;
  keyFeatures: string[];
}> = {
  'M4(1)': {
    description: 'Visitable Dwellings',
    applies: 'All new dwellings',
    keyFeatures: [
      'Level or ramped approach',
      'Accessible threshold',
      'WC at entrance level',
      'Minimum door widths'
    ]
  },
  'M4(2)': {
    description: 'Accessible and Adaptable Dwellings',
    applies: 'Often required by planning policy',
    keyFeatures: [
      'All M4(1) features plus',
      'Step-free access throughout entry storey',
      'Space for wheelchair turning',
      'Potential for future adaptations'
    ]
  },
  'M4(3)': {
    description: 'Wheelchair User Dwellings',
    applies: 'Where specifically required by planning',
    keyFeatures: [
      'All M4(2) features plus',
      'Wheelchair accessible throughout',
      'Enlarged bathrooms',
      'Height-adjustable kitchen option'
    ]
  }
};

// Building types and their access requirements
const BUILDING_ACCESS_REQUIREMENTS: Record<string, {
  publicAccess: boolean;
  keyRequirements: string[];
  additionalConsiderations: string[];
}> = {
  'dwelling-house': {
    publicAccess: false,
    keyRequirements: [
      'Part M4(1) minimum for new dwellings',
      'Reasonable provision for disabled access',
      'Level or ramped approach where practicable'
    ],
    additionalConsiderations: [
      'Consider future adaptation needs',
      'Lifetime homes principles beneficial'
    ]
  },
  'flat': {
    publicAccess: false,
    keyRequirements: [
      'Part M4(1) minimum for new dwellings',
      'Accessible common parts',
      'Lift provision if more than one storey'
    ],
    additionalConsiderations: [
      'Camden often requires M4(2) for 10%+ units',
      'Wheelchair accessible units may be required'
    ]
  },
  'hmo': {
    publicAccess: true,
    keyRequirements: [
      'Accessible common areas',
      'Reasonable access to some rooms',
      'Compliance with HMO standards'
    ],
    additionalConsiderations: [
      'Fire safety provisions may conflict',
      'Balance access with security'
    ]
  },
  'commercial': {
    publicAccess: true,
    keyRequirements: [
      'Full Part M Volume 2 compliance',
      'Accessible entrance',
      'Accessible WC provision',
      'Accessible parking if provided'
    ],
    additionalConsiderations: [
      'Equality Act service provider duties',
      'Reasonable adjustments required'
    ]
  },
  'mixed-use': {
    publicAccess: true,
    keyRequirements: [
      'Part M Vol 1 for dwellings',
      'Part M Vol 2 for other uses',
      'Accessible approach to all uses'
    ],
    additionalConsiderations: [
      'Coordinate residential and commercial access',
      'Separate accessible routes may be needed'
    ]
  }
};

// Access elements with dimensions
const ACCESS_DIMENSIONS: Record<string, {
  minimum: string;
  preferred: string;
  notes: string;
}> = {
  'door-width-general': {
    minimum: '775mm clear',
    preferred: '800mm+ clear',
    notes: 'Allows most wheelchair access'
  },
  'door-width-entrance': {
    minimum: '800mm clear',
    preferred: '850mm+ clear',
    notes: 'Main entrance doors'
  },
  'corridor-width': {
    minimum: '900mm',
    preferred: '1200mm',
    notes: 'To allow passing'
  },
  'ramp-gradient': {
    minimum: '1:12 maximum',
    preferred: '1:15 or gentler',
    notes: 'For ramps over 2m length'
  },
  'step-rise': {
    minimum: '150mm max',
    preferred: '150-170mm',
    notes: 'Consistent throughout flight'
  },
  'handrail-height': {
    minimum: '900mm-1000mm',
    preferred: '900mm-1000mm',
    notes: 'Both sides of stairs/ramps'
  },
  'turning-circle': {
    minimum: '1500mm diameter',
    preferred: '1500mm x 1500mm',
    notes: 'For wheelchair turning'
  }
};

function extractOutcode(postcode: string): string {
  const cleaned = postcode.toUpperCase().replace(/\s+/g, '');
  const match = cleaned.match(/^([A-Z]{1,2}\d{1,2})/);
  return match && match[1] ? match[1] : 'NW3';
}

function getApplicableStandards(projectType: string, projectDetails: AccessProject): {
  standard: string;
  description: string;
  application: string;
}[] {
  const standards: {
    standard: string;
    description: string;
    application: string;
  }[] = [];

  standards.push({
    standard: 'Building Regulations Part M',
    description: 'Access to and use of buildings',
    application: 'All new buildings and material alterations'
  });

  if (projectDetails.publicAccess) {
    standards.push({
      standard: 'Equality Act 2010',
      description: 'Duty to make reasonable adjustments',
      application: 'Service providers and employers'
    });
  }

  if (projectType === 'new-build' || projectType === 'flat-conversion') {
    standards.push({
      standard: 'BS 8300:2018',
      description: 'Design of an accessible and inclusive built environment',
      application: 'Best practice guidance for new buildings'
    });
  }

  standards.push({
    standard: 'Camden Planning Policy',
    description: 'Accessible housing requirements',
    application: 'New residential developments'
  });

  return standards;
}

function getM4Categories(projectType: string, projectDetails: AccessProject): M4Category[] {
  const categories: M4Category[] = [];

  // All new dwellings must meet M4(1)
  if (projectType.includes('new') || projectType.includes('conversion')) {
    categories.push({
      category: 'M4(1) - Visitable Dwellings',
      description: 'Basic accessibility for new homes',
      features: [
        'Approach route that is level or gently sloping',
        'Accessible threshold (max 15mm)',
        'Door widths min 775mm clear',
        'WC at entrance level (or potential for one)',
        'Switches/sockets at accessible heights'
      ],
      whenRequired: 'All new dwellings by default'
    });
  }

  // M4(2) often required by Camden
  if (projectType === 'new-build' || projectType === 'flat-conversion') {
    categories.push({
      category: 'M4(2) - Accessible and Adaptable',
      description: 'Enhanced accessibility with future adaptation potential',
      features: [
        'All M4(1) features',
        'Step-free access throughout entrance storey',
        '1500mm turning circles in key areas',
        'Wider doorways (850mm)',
        'Potential for level access shower',
        'Walls capable of supporting grab rails'
      ],
      whenRequired: 'Camden typically requires 10%+ of units to M4(2)'
    });
  }

  // M4(3) for larger schemes
  if (projectType === 'new-build' && projectDetails.numberOfStoreys && projectDetails.numberOfStoreys > 3) {
    categories.push({
      category: 'M4(3) - Wheelchair User Dwellings',
      description: 'Fully wheelchair accessible homes',
      features: [
        'All M4(2) features',
        'Wheelchair accessible throughout',
        'Enlarged bathrooms with turning space',
        'Lower kitchen work surfaces (option)',
        'Accessible storage throughout',
        'Accessible external areas'
      ],
      whenRequired: 'May be required for larger developments (typically 10% of units)'
    });
  }

  return categories;
}

function getAccessRequirements(projectType: string, projectDetails: AccessProject): AccessRequirement[] {
  const requirements: AccessRequirement[] = [];

  // External approach
  requirements.push({
    element: 'Approach to Building',
    requirement: 'Level or ramped access from boundary/parking to entrance',
    standard: 'Part M, Section 1',
    solutions: [
      'Level path minimum 900mm wide',
      'Ramp 1:12 max gradient with 1:20 preferred',
      'Handrails if ramp over 600mm long',
      'Tactile surfaces at changes of level'
    ]
  });

  // Main entrance
  requirements.push({
    element: 'Principal Entrance',
    requirement: 'Accessible entrance with level threshold',
    standard: 'Part M, Section 2',
    solutions: [
      'Level threshold (max 15mm upstand)',
      'Clear opening width 800mm minimum',
      'Manifestation on glazed doors',
      'Weather protection/canopy'
    ]
  });

  // Circulation
  requirements.push({
    element: 'Internal Circulation',
    requirement: 'Accessible routes throughout',
    standard: 'Part M, Section 3',
    solutions: [
      'Corridors 900mm min (1200mm preferred)',
      'Door widths 775mm min clear',
      '1500mm turning space at doors',
      'Contrast to floors/walls/doors'
    ]
  });

  // Vertical circulation
  if (projectDetails.numberOfStoreys && projectDetails.numberOfStoreys > 1) {
    requirements.push({
      element: 'Stairs',
      requirement: 'Accessible stair design',
      standard: 'Part M, Section 4',
      solutions: [
        'Uniform rise 150-170mm',
        'Goings 250-280mm',
        'Handrails both sides 900-1000mm high',
        'Tactile warning at top of stairs',
        'Adequate lighting (100 lux min)'
      ]
    });

    if (projectDetails.liftsProvided || projectType === 'commercial') {
      requirements.push({
        element: 'Lift Provision',
        requirement: 'Accessible lift if lift provided',
        standard: 'Part M, Section 4',
        solutions: [
          '8-person lift minimum (1100x1400mm car)',
          'Car controls at accessible height',
          'Visual and audible floor indicators',
          'Braille and raised letters',
          'Emergency communication system'
        ]
      });
    }
  }

  // Sanitary facilities
  requirements.push({
    element: 'WC Provision',
    requirement: 'Accessible WC on entrance storey',
    standard: 'Part M, Section 5',
    solutions: [
      'WC compartment 1500x1500mm min',
      'Outward opening door (or sliding)',
      'Grab rails provision',
      'Accessible fittings heights'
    ]
  });

  if (projectDetails.publicAccess) {
    requirements.push({
      element: 'Accessible WC',
      requirement: 'Separate accessible WC for public buildings',
      standard: 'Part M Vol 2, Section 5',
      solutions: [
        'Minimum 1500x2200mm unisex accessible WC',
        'Doc M pack fittings',
        'Emergency assistance alarm',
        'Separate from standard provision'
      ]
    });
  }

  return requirements;
}

function getExternalAccessElements(projectDetails: AccessProject): {
  element: string;
  requirement: string;
  solutions: string[];
}[] {
  const elements: {
    element: string;
    requirement: string;
    solutions: string[];
  }[] = [];

  elements.push({
    element: 'Car Parking',
    requirement: 'Accessible parking spaces where parking provided',
    solutions: [
      'Enlarged bays 3600mm wide',
      'Located near entrance',
      'Level access from bay to building',
      'Signage and markings'
    ]
  });

  elements.push({
    element: 'Pathways',
    requirement: 'Firm, level surfaces',
    solutions: [
      'Smooth, slip-resistant paving',
      'Cross-fall maximum 1:50',
      'Contrast edging/tactile guidance',
      'Adequate lighting'
    ]
  });

  if (projectDetails.externalSpaces) {
    elements.push({
      element: 'Gardens/Amenity Space',
      requirement: 'Accessible external amenity areas',
      solutions: [
        'Level access to garden areas',
        'Raised beds where steps unavoidable',
        'Seating at accessible areas',
        'Accessible bin stores'
      ]
    });
  }

  return elements;
}

function getAccessStatementRequirements(projectType: string): {
  required: boolean;
  sections: string[];
  contentGuidance: string[];
} {
  const required = ['new-build', 'flat-conversion', 'change-of-use', 'commercial', 'mixed-use'].includes(projectType);

  const sections = [
    'Approach and car parking',
    'Building entrance',
    'Horizontal circulation',
    'Vertical circulation',
    'Sanitary facilities',
    'Wayfinding and signage',
    'Emergency egress'
  ];

  const contentGuidance = [
    'Describe the philosophy/approach to accessibility',
    'Explain how Part M requirements are met',
    'Detail any alternative solutions used',
    'Justify any derogations from standards',
    'Confirm engagement with access groups if applicable',
    'Include drawings showing access features'
  ];

  return {
    required,
    sections,
    contentGuidance
  };
}

function getLocalFactors(postcode: string): string[] {
  const factors: string[] = [];

  // Camden-specific
  factors.push('Camden requires 10%+ of new dwellings to meet M4(2) standard');
  factors.push('Wheelchair accessible housing may be required on larger schemes');
  factors.push('Camden Access Officer can provide pre-application advice');

  // Heritage considerations
  factors.push('Listed buildings may have relaxations - must demonstrate reasonable provision');
  factors.push('Conservation area works should balance access with heritage');
  factors.push('Historic England guidance on access to historic buildings');

  // Local topography
  factors.push('Hampstead has significant slopes - may affect access solutions');
  factors.push('Victorian properties often have steps - creative solutions needed');

  return factors;
}

async function assessAccessRequirements(
  address: string,
  postcode: string,
  projectType: string,
  projectDetails: AccessProject = {}
): Promise<AccessAssessment> {
  // Applicable standards
  const applicableStandards = getApplicableStandards(projectType, projectDetails);

  // M4 categories
  const m4Categories = getM4Categories(projectType, projectDetails);

  // Access requirements
  const accessRequirements = getAccessRequirements(projectType, projectDetails);

  // External access
  const externalAccess = getExternalAccessElements(projectDetails);

  // Internal access
  const internalAccess: {
    element: string;
    requirement: string;
    solutions: string[];
  }[] = [
    {
      element: 'Door Widths',
      requirement: '775mm minimum clear opening',
      solutions: [
        'Standard 826mm doors give 775mm clear',
        'Wider doors for M4(2) - 850mm clear',
        'Consider door swing and furniture'
      ]
    },
    {
      element: 'Floor Surfaces',
      requirement: 'Slip-resistant, level surfaces',
      solutions: [
        'R10+ slip rating for wet areas',
        'Contrast between floor and walls',
        'Level thresholds between rooms'
      ]
    },
    {
      element: 'Socket/Switch Heights',
      requirement: 'Accessible heights for controls',
      solutions: [
        'Sockets 450mm-1200mm from floor',
        'Switches at 900mm-1100mm',
        'Consumer unit at accessible height'
      ]
    }
  ];

  // Access statement
  const accessStatement = getAccessStatementRequirements(projectType);

  // Planning considerations
  const planningConsiderations = [
    'Access Statement may be required with planning application',
    'Camden policy requires accessible housing provision',
    'Lifetime Homes principles encouraged',
    'Pre-application discussion recommended for complex schemes'
  ];

  // Building regulations
  const buildingRegulations = [
    {
      part: 'Part M - Access',
      requirement: 'Volume 1: Dwellings, Volume 2: Buildings other than dwellings',
      keyPoints: [
        'M4(1) minimum for new dwellings',
        'M4(2)/M4(3) where required by planning',
        'Full Part M Vol 2 for non-domestic'
      ]
    },
    {
      part: 'Part B - Fire Safety',
      requirement: 'Coordinate fire escape with access',
      keyPoints: [
        'Evacuation lifts may be needed',
        'Refuges for wheelchair users',
        'Accessible fire alarms'
      ]
    }
  ];

  // Costs
  const costs = [
    {
      item: 'Access Consultant',
      range: '£500-2,000',
      notes: 'For Access Statement and design advice'
    },
    {
      item: 'Level Threshold',
      range: '£200-500 per door',
      notes: 'Specialist threshold systems'
    },
    {
      item: 'Accessible WC (Doc M)',
      range: '£2,000-4,000',
      notes: 'Complete installation with fittings'
    },
    {
      item: 'Ramp Construction',
      range: '£300-800 per linear meter',
      notes: 'Depends on gradient and materials'
    },
    {
      item: 'Passenger Lift',
      range: '£15,000-40,000',
      notes: 'For 2-3 storey residential'
    }
  ];

  // Recommendations
  const recommendations: string[] = [];
  
  recommendations.push('Integrate access requirements from design outset');
  recommendations.push('Consider future adaptability in design decisions');
  
  if (projectType === 'new-build' || projectType === 'flat-conversion') {
    recommendations.push('Confirm M4(2)/M4(3) requirements with planning authority');
    recommendations.push('Prepare Access Statement for planning submission');
  }

  if (projectDetails.publicAccess) {
    recommendations.push('Consider user testing with disability groups');
    recommendations.push('Plan for reasonable adjustments under Equality Act');
  }

  return {
    address,
    postcode,
    projectType,
    applicableStandards,
    m4Categories,
    accessRequirements,
    externalAccess,
    internalAccess,
    accessStatement,
    planningConsiderations,
    buildingRegulations,
    localFactors: getLocalFactors(postcode),
    costs,
    recommendations
  };
}

// Export the service
const accessStatement = {
  assessAccessRequirements,
  PART_M_CATEGORIES,
  BUILDING_ACCESS_REQUIREMENTS,
  ACCESS_DIMENSIONS
};

export default accessStatement;
