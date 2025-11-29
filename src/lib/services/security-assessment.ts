/**
 * Security Assessment Service
 * 
 * Provides security and Secured by Design guidance for development
 * projects in the Hampstead area.
 */

interface SecurityProject {
  dwellingUnits?: number;
  buildingType?: string;
  groundFloor?: boolean;
  basement?: boolean;
  communalAreas?: boolean;
  parking?: boolean;
  heritageConstraints?: boolean;
}

interface SecuredByDesign {
  applicable: boolean;
  sections: {
    section: string;
    requirements: string[];
    specifications: string[];
  }[];
}

interface SecurityMeasure {
  measure: string;
  category: string;
  description: string;
  specification: string;
  heritageConsiderations: string;
  cost: string;
}

interface SecurityAssessment {
  address: string;
  postcode: string;
  projectType: string;
  securedByDesign: SecuredByDesign;
  physicalSecurity: {
    doorSecurity: SecurityMeasure[];
    windowSecurity: SecurityMeasure[];
    perimeterSecurity: SecurityMeasure[];
  };
  accessControl: {
    entrySystems: SecurityMeasure[];
    communalAccess: string[];
  };
  lighting: {
    requirements: string[];
    specifications: string[];
    heritageConsiderations: string;
  };
  cctv: {
    requirements: string[];
    specifications: string[];
    planningConsiderations: string[];
  };
  landscaping: {
    principles: string[];
    recommendations: string[];
  };
  carParking: {
    requirements: string[];
    specifications: string[];
  };
  cycleStorage: {
    requirements: string[];
    specifications: string[];
  };
  communalAreas: {
    requirements: string[];
    mailboxes: string[];
  };
  alarms: {
    types: string[];
    specifications: string[];
  };
  localCrimeContext: {
    generalLevel: string;
    commonTypes: string[];
    recommendations: string[];
  };
  planningConditions: string[];
  buildingRegulations: string[];
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

// Secured by Design standards
const SBD_STANDARDS = {
  doors: {
    standard: 'PAS 24:2022',
    alternatives: ['LPS 1175 SR2', 'STS 201 BR2']
  },
  windows: {
    standard: 'PAS 24:2022',
    accessible: 'Ground floor and accessible windows'
  },
  locks: {
    standard: 'BS 3621',
    multipoint: 'Recommended for all external doors'
  },
  lighting: {
    standard: 'BS 5489',
    level: '10-20 lux for pathways'
  }
};

// Security levels
const SECURITY_CATEGORIES = {
  residential: {
    singleDwelling: 'Standard SBD Homes',
    flats: 'SBD Homes with communal requirements',
    hmo: 'Enhanced requirements'
  },
  commercial: {
    office: 'SBD Commercial',
    retail: 'SBD Commercial with public access'
  }
};

function getSecuredByDesign(projectDetails: SecurityProject): SecuredByDesign {
  const isMajor = (projectDetails.dwellingUnits || 0) >= 10;

  const sections = [
    {
      section: 'External Doors',
      requirements: [
        'PAS 24:2022 certified doors',
        'Multipoint locking',
        'Door viewer (dwellings)',
        'Door chain or limiter'
      ],
      specifications: [
        'Cylinder protection',
        'Letter plate restrictions',
        'Hinge protection'
      ]
    },
    {
      section: 'Windows',
      requirements: [
        'PAS 24:2022 for accessible windows',
        'Lockable handles',
        'Laminated glass option for ground floor'
      ],
      specifications: [
        'Restrictors on upper floors',
        'Secure glazing beads',
        'Window locks engaged'
      ]
    },
    {
      section: 'Boundaries',
      requirements: [
        'Defensible space clearly defined',
        'Appropriate boundary treatment',
        'Gate security for side access'
      ],
      specifications: [
        '1.8m rear boundaries',
        'Trellis topping where lower required',
        'Self-closing gates'
      ]
    }
  ];

  if (projectDetails.communalAreas) {
    sections.push({
      section: 'Communal Areas',
      requirements: [
        'Audio/visual entry system',
        'Secure communal doors',
        'Mail delivery solution',
        'CCTV in common areas'
      ],
      specifications: [
        'Time-delayed locks on communal doors',
        'Secure mail boxes (TS 009)',
        'Emergency release mechanisms'
      ]
    });
  }

  if (projectDetails.parking) {
    sections.push({
      section: 'Parking',
      requirements: [
        'Good natural surveillance',
        'Adequate lighting',
        'Secure cycle storage',
        'Access control'
      ],
      specifications: [
        'Minimum 10 lux lighting',
        'CCTV coverage',
        'Anchor points for cycles'
      ]
    });
  }

  return {
    applicable: isMajor,
    sections
  };
}

function getDoorSecurity(projectDetails: SecurityProject): SecurityMeasure[] {
  return [
    {
      measure: 'Front Door',
      category: 'Primary Entry',
      description: 'Main entrance door security',
      specification: 'PAS 24:2022 certified, multipoint locking, cylinder guard',
      heritageConsiderations: 'Period door replacement may require consent. Consider upgrading existing with modern locks.',
      cost: '£1,500-5,000'
    },
    {
      measure: 'Rear Door',
      category: 'Secondary Entry',
      description: 'Rear/side entrance door security',
      specification: 'PAS 24:2022 certified, same standard as front',
      heritageConsiderations: 'Less visible - more flexibility for upgrades',
      cost: '£1,000-3,000'
    },
    {
      measure: 'French Doors/Patio',
      category: 'Glazed Doors',
      description: 'Large glazed door security',
      specification: 'PAS 24:2022, multipoint top and bottom locking',
      heritageConsiderations: 'Traditional appearance with modern security possible',
      cost: '£2,000-6,000'
    },
    {
      measure: 'Garage Door',
      category: 'Ancillary',
      description: 'Garage door security (if connected to house)',
      specification: 'LPS 1175 for integral garages, physical stop',
      heritageConsiderations: 'Style to match property character',
      cost: '£1,000-3,000'
    }
  ];
}

function getWindowSecurity(projectDetails: SecurityProject): SecurityMeasure[] {
  const measures: SecurityMeasure[] = [];

  measures.push({
    measure: 'Ground Floor Windows',
    category: 'Accessible Windows',
    description: 'Windows accessible from ground level',
    specification: 'PAS 24:2022 certified, lockable handles, laminated glass option',
    heritageConsiderations: 'Slim profiles available to match period styles. Secondary glazing can add security.',
    cost: '20-30% premium over standard'
  });

  measures.push({
    measure: 'Upper Floor Windows',
    category: 'General Windows',
    description: 'Windows above ground floor',
    specification: 'Lockable handles minimum, restrictors for safety',
    heritageConsiderations: 'Listed buildings may require like-for-like repair',
    cost: '10% premium over standard'
  });

  if (projectDetails.basement) {
    measures.push({
      measure: 'Basement Windows/Lightwells',
      category: 'Basement',
      description: 'Below ground windows and access',
      specification: 'PAS 24:2022, grilles or bars where appropriate',
      heritageConsiderations: 'Heritage bars may be required to match existing',
      cost: '£500-1,500 per window'
    });
  }

  measures.push({
    measure: 'Rooflights',
    category: 'Roof Access',
    description: 'Skylights and roof windows',
    specification: 'Secure fixing, laminated glass, locks on openers',
    heritageConsiderations: 'Conservation rooflights available with security features',
    cost: '£500-2,000 per unit'
  });

  return measures;
}

function getPerimeterSecurity(projectDetails: SecurityProject): SecurityMeasure[] {
  return [
    {
      measure: 'Front Boundary',
      category: 'Street Frontage',
      description: 'Front garden boundary treatment',
      specification: 'Defensible space definition, 1m max height, visibility maintained',
      heritageConsiderations: 'Match historic boundary styles. Railings often appropriate.',
      cost: '£100-300 per linear metre'
    },
    {
      measure: 'Side Boundary',
      category: 'Side Access',
      description: 'Side passage and boundary',
      specification: '1.8m height, self-closing gate, lock',
      heritageConsiderations: 'Materials to match property. Gate style important.',
      cost: '£200-500 per linear metre plus gate'
    },
    {
      measure: 'Rear Boundary',
      category: 'Rear Garden',
      description: 'Rear garden perimeter',
      specification: '1.8m close-boarded or brick, trellis topping option',
      heritageConsiderations: 'Traditional materials may be required',
      cost: '£150-400 per linear metre'
    },
    {
      measure: 'Gates',
      category: 'Access Points',
      description: 'All pedestrian and vehicle gates',
      specification: 'Self-closing, lockable, same height as adjacent boundary',
      heritageConsiderations: 'Period-appropriate design',
      cost: '£500-3,000 per gate'
    }
  ];
}

function getAccessControl(): {
  entrySystems: SecurityMeasure[];
  communalAccess: string[];
} {
  return {
    entrySystems: [
      {
        measure: 'Audio Entry System',
        category: 'Entry Phone',
        description: 'Audio intercom for visitor communication',
        specification: 'BS 8220-3, robust external panel',
        heritageConsiderations: 'Discrete positioning on historic buildings',
        cost: '£500-1,500'
      },
      {
        measure: 'Video Entry System',
        category: 'Video Phone',
        description: 'Video intercom with visual verification',
        specification: 'HD camera, night vision, wide angle',
        heritageConsiderations: 'Camera visibility may be concern',
        cost: '£1,000-3,000'
      },
      {
        measure: 'Access Control Fobs',
        category: 'Key Fobs',
        description: 'Electronic access for residents',
        specification: 'Encrypted fobs, audit trail, lost fob management',
        heritageConsiderations: 'No impact on appearance',
        cost: '£2,000-5,000 system'
      }
    ],
    communalAccess: [
      'Main entrance: video entry + access control',
      'Rear entrance: access control only',
      'Bin store: access control',
      'Cycle store: access control',
      'Parking: barrier + access control',
      'Plant rooms: key access only'
    ]
  };
}

function getLighting(): {
  requirements: string[];
  specifications: string[];
  heritageConsiderations: string;
} {
  return {
    requirements: [
      'Illuminate all entrances and exits',
      'Pathways and parking areas',
      'Communal areas',
      'Building perimeter'
    ],
    specifications: [
      'Minimum 10 lux for pathways',
      '50 lux at entrances',
      'Dusk-to-dawn or PIR activation',
      'Energy efficient LED',
      'Avoid creating deep shadows'
    ],
    heritageConsiderations: 'Traditional lantern styles available with modern optics. Positioning to avoid light pollution.'
  };
}

function getCCTV(): {
  requirements: string[];
  specifications: string[];
  planningConsiderations: string[];
} {
  return {
    requirements: [
      'Cover main entrance',
      'Parking areas',
      'Communal circulation',
      'Emergency exits'
    ],
    specifications: [
      'Minimum 720p resolution',
      'Night vision capability',
      'IP-based system',
      '30-day retention minimum',
      'GDPR compliant signage'
    ],
    planningConsiderations: [
      'External cameras may need planning permission',
      'Conservation area restrictions on visibility',
      'Listed building consent for fixing',
      'Privacy considerations for neighbors'
    ]
  };
}

function getLandscaping(): {
  principles: string[];
  recommendations: string[];
} {
  return {
    principles: [
      'Natural surveillance - maintain sight lines',
      'Territorial definition - clear ownership',
      'Access control - guide movement',
      'Target hardening - remove opportunities'
    ],
    recommendations: [
      'Front gardens: low planting (under 1m)',
      'Avoid dense shrubs near entrances',
      'Thorny planting to deter climbing',
      'Ground cover rather than hiding spots',
      'Maintain sight lines from windows'
    ]
  };
}

function getCarParking(): {
  requirements: string[];
  specifications: string[];
} {
  return {
    requirements: [
      'Natural surveillance from habitable rooms',
      'Adequate lighting (minimum 10 lux)',
      'Clear sight lines',
      'Controlled access if enclosed'
    ],
    specifications: [
      'Park Mark standard if commercial',
      'CCTV coverage recommended',
      'No hiding places',
      'Emergency help points for large car parks'
    ]
  };
}

function getCycleStorage(): {
  requirements: string[];
  specifications: string[];
} {
  return {
    requirements: [
      'Secure lockable enclosure',
      'Anchor points for each cycle',
      'Lighting',
      'CCTV or good surveillance'
    ],
    specifications: [
      'LPS 1175 SR1 minimum for enclosure',
      'Sold Secure anchor points',
      'Sheffield stands or similar',
      'Access control entry'
    ]
  };
}

function getAlarms(): {
  types: string[];
  specifications: string[];
} {
  return {
    types: [
      'Intruder alarm (bells only)',
      'Monitored alarm (keyholder response)',
      'Police response alarm (URN required)',
      'Smart alarm (app notification)'
    ],
    specifications: [
      'BS EN 50131 Grade 2 minimum',
      'NSI or SSAIB approved installer',
      'PIR and contact sensors',
      'External sounder and strobe'
    ]
  };
}

function getLocalCrimeContext(): {
  generalLevel: string;
  commonTypes: string[];
  recommendations: string[];
} {
  return {
    generalLevel: 'Lower than London average for most crime types',
    commonTypes: [
      'Residential burglary - target hardening important',
      'Vehicle crime - secure parking beneficial',
      'Cycle theft - secure storage essential',
      'Package theft - secure delivery solutions'
    ],
    recommendations: [
      'Secured by Design compliance recommended',
      'Quality door and window security',
      'Good lighting and surveillance',
      'Community engagement (Neighbourhood Watch)'
    ]
  };
}

function getLocalFactors(): string[] {
  return [
    'Hampstead generally lower crime area',
    'Affluent area - targeted by professional burglars',
    'Period properties may have security weaknesses',
    'Conservation area constraints on visible measures',
    'Listed buildings need consent for security alterations',
    'Metropolitan Police Designing Out Crime Officer consultation available',
    'Camden Neighbourhood Watch schemes active'
  ];
}

async function assessSecurity(
  address: string,
  postcode: string,
  projectType: string,
  projectDetails: SecurityProject = {}
): Promise<SecurityAssessment> {
  // Secured by Design
  const securedByDesign = getSecuredByDesign(projectDetails);

  // Physical security
  const physicalSecurity = {
    doorSecurity: getDoorSecurity(projectDetails),
    windowSecurity: getWindowSecurity(projectDetails),
    perimeterSecurity: getPerimeterSecurity(projectDetails)
  };

  // Access control
  const accessControl = getAccessControl();

  // Lighting
  const lighting = getLighting();

  // CCTV
  const cctv = getCCTV();

  // Landscaping
  const landscaping = getLandscaping();

  // Car parking
  const carParking = getCarParking();

  // Cycle storage
  const cycleStorage = getCycleStorage();

  // Communal areas
  const communalAreas = {
    requirements: [
      'Good lighting throughout',
      'No hiding places',
      'CCTV coverage',
      'Access control to restrict entry'
    ],
    mailboxes: [
      'Individual lockable mailboxes',
      'TS 009 or equivalent standard',
      'Parcel delivery solution (lockers or concierge)',
      'Anti-fishing letter plates'
    ]
  };

  // Alarms
  const alarms = getAlarms();

  // Local crime context
  const localCrimeContext = getLocalCrimeContext();

  // Planning conditions
  const planningConditions = [
    'Secured by Design compliance (major developments)',
    'External lighting scheme approval',
    'Boundary treatment details',
    'Cycle storage details'
  ];

  // Building regulations
  const buildingRegulations = [
    'Part Q - Security in dwellings (new builds)',
    'Applies to all new dwellings',
    'PAS 24:2022 doors and windows',
    'Or equivalent security standard'
  ];

  // Timeline
  const timeline = [
    {
      phase: 'Design',
      duration: '2-4 weeks',
      activities: ['Security assessment', 'SBD consultation', 'Specification']
    },
    {
      phase: 'Procurement',
      duration: '4-8 weeks',
      activities: ['Source certified products', 'Contractor selection']
    },
    {
      phase: 'Installation',
      duration: 'During construction',
      activities: ['Install security measures', 'Testing', 'Certification']
    }
  ];

  // Costs
  const costs = [
    {
      item: 'Secured by Design Doors',
      range: '£1,500-5,000 each',
      notes: 'PAS 24 certified'
    },
    {
      item: 'Security Glazing',
      range: '20-30% premium',
      notes: 'PAS 24 windows'
    },
    {
      item: 'Access Control System',
      range: '£2,000-10,000',
      notes: 'Depends on complexity'
    },
    {
      item: 'CCTV System',
      range: '£2,000-8,000',
      notes: 'IP system with recording'
    },
    {
      item: 'Intruder Alarm',
      range: '£500-2,000',
      notes: 'NSI/SSAIB approved'
    }
  ];

  // Recommendations
  const recommendations: string[] = [];
  
  recommendations.push('Consider Secured by Design consultation');
  recommendations.push('Part Q compliance required for new dwellings');
  
  if (projectDetails.heritageConstraints) {
    recommendations.push('Discuss security measures with conservation officer');
    recommendations.push('Period-appropriate security solutions available');
  }

  if (projectDetails.groundFloor) {
    recommendations.push('Ground floor particularly vulnerable - enhance security');
  }

  recommendations.push('Engage Metropolitan Police Designing Out Crime Officer');

  return {
    address,
    postcode,
    projectType,
    securedByDesign,
    physicalSecurity,
    accessControl,
    lighting,
    cctv,
    landscaping,
    carParking,
    cycleStorage,
    communalAreas,
    alarms,
    localCrimeContext,
    planningConditions,
    buildingRegulations,
    localFactors: getLocalFactors(),
    timeline,
    costs,
    recommendations
  };
}

// Export the service
const securityAssessment = {
  assessSecurity,
  SBD_STANDARDS,
  SECURITY_CATEGORIES
};

export default securityAssessment;
