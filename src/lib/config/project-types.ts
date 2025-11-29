/**
 * Project Types and Permitted Development Rules
 * Comprehensive rules engine for UK planning regulations
 */

export type ProjectCategory = 
  | 'extensions'
  | 'loft'
  | 'outbuildings'
  | 'windows-doors'
  | 'roofing'
  | 'solar'
  | 'external'
  | 'internal';

export interface ProjectType {
  id: string;
  category: ProjectCategory;
  name: string;
  description: string;
  icon: string;
  popular: boolean;
}

export interface PDRule {
  allowed: boolean;
  conditions: string[];
  maxDimensions?: {
    height?: number;
    depth?: number;
    width?: number;
    area?: number;
  };
  requiresNotification?: boolean;
  requiresPermission?: boolean;
  notes: string[];
}

export interface HeritageModifier {
  listedBuilding: {
    gradeI: PDRule;
    gradeIIStar: PDRule;
    gradeII: PDRule;
  };
  conservationArea: {
    withArticle4: PDRule;
    withoutArticle4: PDRule;
  };
  standard: PDRule;
}

// ===========================================
// PROJECT TYPES
// ===========================================

export const PROJECT_TYPES: ProjectType[] = [
  // Extensions
  {
    id: 'rear-extension-single',
    category: 'extensions',
    name: 'Single Storey Rear Extension',
    description: 'Ground floor extension at the back of your property',
    icon: '🏠',
    popular: true,
  },
  {
    id: 'rear-extension-double',
    category: 'extensions',
    name: 'Double Storey Rear Extension',
    description: 'Two storey extension at the back of your property',
    icon: '🏢',
    popular: true,
  },
  {
    id: 'side-extension',
    category: 'extensions',
    name: 'Side Extension',
    description: 'Extension to the side of your property',
    icon: '➡️',
    popular: true,
  },
  {
    id: 'wrap-around',
    category: 'extensions',
    name: 'Wrap Around Extension',
    description: 'L-shaped extension covering side and rear',
    icon: '↪️',
    popular: false,
  },
  {
    id: 'front-porch',
    category: 'extensions',
    name: 'Front Porch',
    description: 'Covered entrance porch at the front',
    icon: '🚪',
    popular: false,
  },
  
  // Loft
  {
    id: 'loft-dormer',
    category: 'loft',
    name: 'Loft Conversion with Dormer',
    description: 'Convert loft space with dormer window extension',
    icon: '🏔️',
    popular: true,
  },
  {
    id: 'loft-velux',
    category: 'loft',
    name: 'Loft Conversion (Velux Only)',
    description: 'Convert loft space with roof windows only',
    icon: '🪟',
    popular: true,
  },
  {
    id: 'loft-hip-to-gable',
    category: 'loft',
    name: 'Hip to Gable Loft Conversion',
    description: 'Convert hipped roof to gable for more space',
    icon: '📐',
    popular: false,
  },
  
  // Outbuildings
  {
    id: 'garden-room',
    category: 'outbuildings',
    name: 'Garden Room / Office',
    description: 'Detached building in your garden for home office',
    icon: '🏡',
    popular: true,
  },
  {
    id: 'shed',
    category: 'outbuildings',
    name: 'Garden Shed',
    description: 'Storage building in your garden',
    icon: '🛖',
    popular: false,
  },
  {
    id: 'garage',
    category: 'outbuildings',
    name: 'Detached Garage',
    description: 'Standalone garage in your garden',
    icon: '🚗',
    popular: false,
  },
  {
    id: 'swimming-pool',
    category: 'outbuildings',
    name: 'Swimming Pool',
    description: 'Outdoor or indoor swimming pool',
    icon: '🏊',
    popular: false,
  },
  
  // Windows & Doors
  {
    id: 'windows-replacement',
    category: 'windows-doors',
    name: 'Replace Windows',
    description: 'Replace existing windows with new ones',
    icon: '🪟',
    popular: true,
  },
  {
    id: 'windows-new',
    category: 'windows-doors',
    name: 'New Window Opening',
    description: 'Create a new window where none exists',
    icon: '➕',
    popular: false,
  },
  {
    id: 'doors-replacement',
    category: 'windows-doors',
    name: 'Replace External Doors',
    description: 'Replace front, back or side doors',
    icon: '🚪',
    popular: false,
  },
  {
    id: 'bifold-doors',
    category: 'windows-doors',
    name: 'Install Bifold/Sliding Doors',
    description: 'Large glass doors opening to garden',
    icon: '🚪',
    popular: true,
  },
  
  // Roofing
  {
    id: 'roof-replacement',
    category: 'roofing',
    name: 'Replace Roof Covering',
    description: 'Replace tiles, slates or flat roof',
    icon: '🏠',
    popular: false,
  },
  {
    id: 'roof-lights',
    category: 'roofing',
    name: 'Install Roof Lights',
    description: 'Add skylights or Velux windows to existing roof',
    icon: '☀️',
    popular: true,
  },
  
  // Solar
  {
    id: 'solar-panels',
    category: 'solar',
    name: 'Solar Panels',
    description: 'Install solar PV panels on your roof',
    icon: '☀️',
    popular: true,
  },
  {
    id: 'solar-thermal',
    category: 'solar',
    name: 'Solar Thermal System',
    description: 'Install solar water heating panels',
    icon: '🌡️',
    popular: false,
  },
  {
    id: 'heat-pump',
    category: 'solar',
    name: 'Air Source Heat Pump',
    description: 'Install air source heat pump unit',
    icon: '🌀',
    popular: true,
  },
  
  // External
  {
    id: 'driveway',
    category: 'external',
    name: 'New Driveway / Hardstanding',
    description: 'Create or extend driveway',
    icon: '🅿️',
    popular: false,
  },
  {
    id: 'fence-wall',
    category: 'external',
    name: 'Fences, Gates & Walls',
    description: 'New or replacement boundary treatments',
    icon: '🧱',
    popular: false,
  },
  {
    id: 'decking',
    category: 'external',
    name: 'Decking / Patio',
    description: 'Raised decking or paved area',
    icon: '🪵',
    popular: false,
  },
  {
    id: 'render-cladding',
    category: 'external',
    name: 'External Render / Cladding',
    description: 'Change the external finish of your walls',
    icon: '🎨',
    popular: false,
  },
  
  // Internal
  {
    id: 'internal-walls',
    category: 'internal',
    name: 'Remove Internal Walls',
    description: 'Knock through or remove internal walls',
    icon: '🔨',
    popular: true,
  },
  {
    id: 'basement',
    category: 'internal',
    name: 'Basement Conversion',
    description: 'Convert or excavate basement space',
    icon: '⬇️',
    popular: false,
  },
  {
    id: 'garage-conversion',
    category: 'internal',
    name: 'Garage Conversion',
    description: 'Convert attached garage to living space',
    icon: '🚗',
    popular: true,
  },
];

// ===========================================
// PERMITTED DEVELOPMENT RULES BY PROJECT TYPE
// ===========================================

export const PD_RULES: Record<string, HeritageModifier> = {
  // Single Storey Rear Extension
  'rear-extension-single': {
    standard: {
      allowed: true,
      conditions: [
        'Detached house: max 8m depth (or 4m without prior approval)',
        'Semi-detached/terraced: max 6m depth (or 3m without prior approval)',
        'Max height 4m',
        'Max eaves height 3m',
        'Cannot exceed half the garden area',
        'Materials must match existing',
      ],
      maxDimensions: {
        depth: 8,
        height: 4,
      },
      requiresNotification: true,
      notes: [
        'Prior approval needed for extensions over 4m (semi/terraced) or 6m (detached)',
        'Neighbors will be consulted for larger extensions',
      ],
    },
    conservationArea: {
      withoutArticle4: {
        allowed: true,
        conditions: [
          'Max 3m depth from original rear wall',
          'Max height 4m',
          'Single storey only',
          'Cannot be visible from public highway',
        ],
        maxDimensions: {
          depth: 3,
          height: 4,
        },
        notes: [
          'More restrictive limits apply in conservation areas',
          'Rear-only to avoid impacting street scene',
        ],
      },
      withArticle4: {
        allowed: false,
        conditions: [],
        requiresPermission: true,
        notes: [
          'Planning permission required due to Article 4 Direction',
          'Apply to local planning authority',
          'Heritage statement may be required',
        ],
      },
    },
    listedBuilding: {
      gradeI: {
        allowed: false,
        conditions: [],
        requiresPermission: true,
        notes: [
          'Listed Building Consent required',
          'Planning permission also required',
          'Heritage Impact Assessment mandatory',
          'Consult with Historic England',
          'Very unlikely to be approved for Grade I buildings',
        ],
      },
      gradeIIStar: {
        allowed: false,
        conditions: [],
        requiresPermission: true,
        notes: [
          'Listed Building Consent required',
          'Planning permission also required',
          'Heritage Impact Assessment recommended',
          'Consult conservation officer before applying',
        ],
      },
      gradeII: {
        allowed: false,
        conditions: [],
        requiresPermission: true,
        notes: [
          'Listed Building Consent required',
          'Planning permission also required',
          'Sympathetic design essential',
          'May be approved if sensitively designed',
        ],
      },
    },
  },

  // Double Storey Rear Extension
  'rear-extension-double': {
    standard: {
      allowed: true,
      conditions: [
        'Max 3m depth from original rear wall',
        'Max 7m height to ridge',
        'Max eaves must not exceed existing eaves',
        'At least 7m from rear boundary',
        'Cannot exceed half the garden area',
        'Materials must match existing',
        'Upper floor windows facing boundary must be obscure glazed',
      ],
      maxDimensions: {
        depth: 3,
        height: 7,
      },
      notes: [
        'More restrictive than single storey',
        'Minimum 7m to boundary is key constraint',
      ],
    },
    conservationArea: {
      withoutArticle4: {
        allowed: false,
        conditions: [],
        requiresPermission: true,
        notes: [
          'Two storey extensions require planning permission in conservation areas',
          'Apply with heritage statement',
          'Design must be sympathetic to character',
        ],
      },
      withArticle4: {
        allowed: false,
        conditions: [],
        requiresPermission: true,
        notes: [
          'Planning permission required',
          'Full heritage assessment needed',
          'Consider single storey alternative',
        ],
      },
    },
    listedBuilding: {
      gradeI: {
        allowed: false,
        conditions: [],
        requiresPermission: true,
        notes: [
          'Extremely unlikely to be approved',
          'Listed Building Consent required',
          'Consider alternative approaches',
        ],
      },
      gradeIIStar: {
        allowed: false,
        conditions: [],
        requiresPermission: true,
        notes: [
          'Very difficult to achieve',
          'Listed Building Consent required',
          'Exceptional design quality needed',
        ],
      },
      gradeII: {
        allowed: false,
        conditions: [],
        requiresPermission: true,
        notes: [
          'Listed Building Consent required',
          'May be possible with exceptional design',
          'Consult conservation officer early',
        ],
      },
    },
  },

  // Loft Dormer
  'loft-dormer': {
    standard: {
      allowed: true,
      conditions: [
        'Max 40 cubic metres additional roof space (terraced)',
        'Max 50 cubic metres additional roof space (semi/detached)',
        'Dormer must not extend beyond existing roof plane facing highway',
        'Materials must match existing roof',
        'No balconies or raised platforms',
        'Side windows must be obscure glazed',
      ],
      maxDimensions: {
        area: 50,
      },
      notes: [
        'Rear dormers generally permitted',
        'Front dormers usually need permission',
        'Check cumulative volume with any previous loft extensions',
      ],
    },
    conservationArea: {
      withoutArticle4: {
        allowed: true,
        conditions: [
          'Rear dormers only',
          'No front or side dormers',
          'Must not be visible from highway',
          'Materials to match',
        ],
        notes: [
          'Only rear dormers permitted',
          'Velux to front may be alternative',
        ],
      },
      withArticle4: {
        allowed: false,
        conditions: [],
        requiresPermission: true,
        notes: [
          'Planning permission required for any roof alterations',
          'Consider Velux-only conversion as alternative',
        ],
      },
    },
    listedBuilding: {
      gradeI: {
        allowed: false,
        conditions: [],
        requiresPermission: true,
        notes: [
          'Almost never approved for Grade I buildings',
          'Internal loft conversion may be possible without dormers',
          'Consult Historic England',
        ],
      },
      gradeIIStar: {
        allowed: false,
        conditions: [],
        requiresPermission: true,
        notes: [
          'Very rarely approved',
          'Heritage Impact Assessment essential',
          'May damage historic roof structure',
        ],
      },
      gradeII: {
        allowed: false,
        conditions: [],
        requiresPermission: true,
        notes: [
          'Listed Building Consent required',
          'Small, sympathetic dormers occasionally approved',
          'Conservation rooflights may be acceptable',
        ],
      },
    },
  },

  // Loft Velux Only
  'loft-velux': {
    standard: {
      allowed: true,
      conditions: [
        'Windows must not protrude more than 150mm from roof plane',
        'Cannot be higher than highest part of roof',
      ],
      notes: [
        'Generally straightforward',
        'No volume limit for rooflights alone',
      ],
    },
    conservationArea: {
      withoutArticle4: {
        allowed: true,
        conditions: [
          'Rear roof slope only',
          'Conservation-style rooflights recommended',
          'Must not face highway',
        ],
        notes: [
          'Use heritage-style conservation rooflights',
          'Keep to rear to avoid impacting street scene',
        ],
      },
      withArticle4: {
        allowed: false,
        conditions: [],
        requiresPermission: true,
        notes: [
          'May need permission depending on Article 4 scope',
          'Check specific Article 4 restrictions',
        ],
      },
    },
    listedBuilding: {
      gradeI: {
        allowed: false,
        conditions: [],
        requiresPermission: true,
        notes: [
          'Listed Building Consent required',
          'May damage historic roof fabric',
          'Conservation rooflights may be acceptable',
        ],
      },
      gradeIIStar: {
        allowed: false,
        conditions: [],
        requiresPermission: true,
        notes: [
          'Listed Building Consent required',
          'Conservation-style rooflights only',
          'Rear slope preferred',
        ],
      },
      gradeII: {
        allowed: false,
        conditions: [],
        requiresPermission: true,
        notes: [
          'Listed Building Consent required',
          'Often approved with appropriate rooflights',
          'Must be sensitively positioned',
        ],
      },
    },
  },

  // Garden Room
  'garden-room': {
    standard: {
      allowed: true,
      conditions: [
        'Max 15 sq m floor area (or half garden if smaller)',
        'Max 2.5m height if within 2m of boundary',
        'Max 4m height with dual pitch, 3m otherwise',
        'Cannot be forward of principal elevation',
        'Not for sleeping accommodation',
      ],
      maxDimensions: {
        area: 15,
        height: 4,
      },
      notes: [
        'No planning permission needed if under limits',
        'Cannot be used as self-contained living accommodation',
        'Building regs may apply for electrical work',
      ],
    },
    conservationArea: {
      withoutArticle4: {
        allowed: true,
        conditions: [
          'Max 10 sq m',
          'Max 3m height',
          'Not visible from public areas',
          'Rear garden only',
        ],
        maxDimensions: {
          area: 10,
          height: 3,
        },
        notes: [
          'Smaller limits in conservation areas',
          'Design should be unobtrusive',
        ],
      },
      withArticle4: {
        allowed: false,
        conditions: [],
        requiresPermission: true,
        notes: [
          'Planning permission required',
          'May be approved with appropriate design',
        ],
      },
    },
    listedBuilding: {
      gradeI: {
        allowed: false,
        conditions: [],
        requiresPermission: true,
        notes: [
          'Planning permission required',
          'Listed Building Consent may be needed for curtilage buildings',
          'Impact on setting of listed building assessed',
        ],
      },
      gradeIIStar: {
        allowed: false,
        conditions: [],
        requiresPermission: true,
        notes: [
          'Planning permission required',
          'Discreet location essential',
          'Traditional design may be required',
        ],
      },
      gradeII: {
        allowed: false,
        conditions: [],
        requiresPermission: true,
        notes: [
          'Planning permission required',
          'Often approved if well designed',
          'Should not compete with listed building',
        ],
      },
    },
  },

  // Replace Windows
  'windows-replacement': {
    standard: {
      allowed: true,
      conditions: [
        'Must be similar appearance to existing',
        'No planning permission needed for like-for-like',
      ],
      notes: [
        'Building regs apply (thermal performance)',
        'FENSA or building control sign-off needed',
      ],
    },
    conservationArea: {
      withoutArticle4: {
        allowed: true,
        conditions: [
          'Like-for-like replacement',
          'Same material appearance recommended',
          'Same opening style',
        ],
        notes: [
          'Changing from timber to uPVC may need permission',
          'Consider timber or timber-effect alternatives',
        ],
      },
      withArticle4: {
        allowed: false,
        conditions: [],
        requiresPermission: true,
        notes: [
          'Planning permission required',
          'Timber windows usually required',
          'Specific glazing bar patterns may be mandated',
        ],
      },
    },
    listedBuilding: {
      gradeI: {
        allowed: false,
        conditions: [],
        requiresPermission: true,
        notes: [
          'Listed Building Consent required',
          'Original windows must be repaired if possible',
          'Secondary glazing may be alternative',
          'Exact replication required if replacement approved',
        ],
      },
      gradeIIStar: {
        allowed: false,
        conditions: [],
        requiresPermission: true,
        notes: [
          'Listed Building Consent required',
          'Repair before replace policy',
          'Matching materials and profiles essential',
        ],
      },
      gradeII: {
        allowed: false,
        conditions: [],
        requiresPermission: true,
        notes: [
          'Listed Building Consent required',
          'Timber double-glazed may be acceptable',
          'Slim profile double glazing available',
        ],
      },
    },
  },

  // Solar Panels
  'solar-panels': {
    standard: {
      allowed: true,
      conditions: [
        'Must not protrude more than 200mm from roof plane',
        'Must not be higher than roof ridge',
        'Panels on flat roof: max 1m above roof level',
      ],
      notes: [
        'Very straightforward for most properties',
        'DNO notification may be needed',
      ],
    },
    conservationArea: {
      withoutArticle4: {
        allowed: true,
        conditions: [
          'Rear roof slope only',
          'Not visible from highway',
          'In-roof systems preferred',
        ],
        notes: [
          'Avoid front elevation',
          'Black-framed panels less visible',
          'Solar tiles alternative for sensitive roofs',
        ],
      },
      withArticle4: {
        allowed: false,
        conditions: [],
        requiresPermission: true,
        notes: [
          'May need permission depending on Article 4 scope',
          'Usually approved for rear roofs',
        ],
      },
    },
    listedBuilding: {
      gradeI: {
        allowed: false,
        conditions: [],
        requiresPermission: true,
        notes: [
          'Listed Building Consent required',
          'Rarely approved on historic roofs',
          'Ground-mounted arrays may be alternative',
        ],
      },
      gradeIIStar: {
        allowed: false,
        conditions: [],
        requiresPermission: true,
        notes: [
          'Listed Building Consent required',
          'Hidden roof locations may be acceptable',
          'In-roof systems preferred',
        ],
      },
      gradeII: {
        allowed: false,
        conditions: [],
        requiresPermission: true,
        notes: [
          'Listed Building Consent required',
          'Often approved on non-visible roof slopes',
          'Solar tiles increasingly accepted',
        ],
      },
    },
  },

  // Internal Walls
  'internal-walls': {
    standard: {
      allowed: true,
      conditions: [
        'No planning permission needed',
        'Building regs apply if structural',
      ],
      notes: [
        'Structural engineer needed for load-bearing walls',
        'Party Wall Act may apply for terraced/semi properties',
      ],
    },
    conservationArea: {
      withoutArticle4: {
        allowed: true,
        conditions: [
          'No external changes',
        ],
        notes: [
          'Internal works rarely restricted in CA',
          'Building regs still apply',
        ],
      },
      withArticle4: {
        allowed: true,
        conditions: [
          'Article 4 typically covers external changes only',
        ],
        notes: [
          'Check specific Article 4 wording',
          'Internal works usually unaffected',
        ],
      },
    },
    listedBuilding: {
      gradeI: {
        allowed: false,
        conditions: [],
        requiresPermission: true,
        notes: [
          'Listed Building Consent required for any internal changes',
          'Internal features are protected',
          'Survey of interior required',
        ],
      },
      gradeIIStar: {
        allowed: false,
        conditions: [],
        requiresPermission: true,
        notes: [
          'Listed Building Consent required',
          'Historic room layouts may be protected',
        ],
      },
      gradeII: {
        allowed: false,
        conditions: [],
        requiresPermission: true,
        notes: [
          'Listed Building Consent required',
          'May be approved if not affecting historic fabric',
          'Document existing before works',
        ],
      },
    },
  },

  // Garage Conversion
  'garage-conversion': {
    standard: {
      allowed: true,
      conditions: [
        'No planning permission usually needed',
        'Must retain parking (in some areas)',
      ],
      notes: [
        'Building regs approval required',
        'Check local parking policies',
      ],
    },
    conservationArea: {
      withoutArticle4: {
        allowed: true,
        conditions: [
          'Garage door treatment sensitive',
          'Match existing fenestration style',
        ],
        notes: [
          'New windows/doors should match character',
          'Avoid domestic appearance if street-facing',
        ],
      },
      withArticle4: {
        allowed: false,
        conditions: [],
        requiresPermission: true,
        notes: [
          'Changes to garage door elevation may need permission',
          'Design sympathetically',
        ],
      },
    },
    listedBuilding: {
      gradeI: {
        allowed: false,
        conditions: [],
        requiresPermission: true,
        notes: [
          'Listed Building Consent required',
          'Historic garage may be significant',
        ],
      },
      gradeIIStar: {
        allowed: false,
        conditions: [],
        requiresPermission: true,
        notes: [
          'Listed Building Consent required',
        ],
      },
      gradeII: {
        allowed: false,
        conditions: [],
        requiresPermission: true,
        notes: [
          'Listed Building Consent required',
          'Often acceptable if garage is later addition',
        ],
      },
    },
  },

  // Heat Pump
  'heat-pump': {
    standard: {
      allowed: true,
      conditions: [
        'Max 0.6 cubic metres compressor volume',
        '1m from boundary',
        'Only 1 unit per property',
        'Not on roof (unless flat roof)',
        'Noise limits apply',
      ],
      notes: [
        'MCS certification recommended for grants',
        'DNO notification for large installations',
      ],
    },
    conservationArea: {
      withoutArticle4: {
        allowed: true,
        conditions: [
          'Not visible from highway',
          'Rear location preferred',
          'Acoustic screening may be needed',
        ],
        notes: [
          'Visual impact is key consideration',
          'Can usually find acceptable location',
        ],
      },
      withArticle4: {
        allowed: false,
        conditions: [],
        requiresPermission: true,
        notes: [
          'May need permission',
          'Usually approved in discrete locations',
        ],
      },
    },
    listedBuilding: {
      gradeI: {
        allowed: false,
        conditions: [],
        requiresPermission: true,
        notes: [
          'Planning permission required',
          'May affect setting of listed building',
          'Ground source may be alternative',
        ],
      },
      gradeIIStar: {
        allowed: false,
        conditions: [],
        requiresPermission: true,
        notes: [
          'Planning permission required',
          'Hidden locations may be acceptable',
        ],
      },
      gradeII: {
        allowed: false,
        conditions: [],
        requiresPermission: true,
        notes: [
          'Planning permission usually required',
          'Generally approved if well located',
        ],
      },
    },
  },
};

// ===========================================
// HELPER FUNCTIONS
// ===========================================

export function getProjectsByCategory(category: ProjectCategory): ProjectType[] {
  return PROJECT_TYPES.filter(p => p.category === category);
}

export function getPopularProjects(): ProjectType[] {
  return PROJECT_TYPES.filter(p => p.popular);
}

export function getProjectById(id: string): ProjectType | undefined {
  return PROJECT_TYPES.find(p => p.id === id);
}

export function getRulesForProject(
  projectId: string,
  heritageStatus: 'GREEN' | 'AMBER' | 'RED',
  hasArticle4: boolean,
  listedGrade?: 'I' | 'II*' | 'II'
): PDRule | null {
  const rules = PD_RULES[projectId];
  if (!rules) return null;

  if (heritageStatus === 'RED' && listedGrade) {
    switch (listedGrade) {
      case 'I': return rules.listedBuilding.gradeI;
      case 'II*': return rules.listedBuilding.gradeIIStar;
      case 'II': return rules.listedBuilding.gradeII;
    }
  }

  if (heritageStatus === 'AMBER') {
    return hasArticle4 
      ? rules.conservationArea.withArticle4 
      : rules.conservationArea.withoutArticle4;
  }

  return rules.standard;
}

export const PROJECT_CATEGORIES = [
  { id: 'extensions', name: 'Extensions', icon: '🏠' },
  { id: 'loft', name: 'Loft Conversions', icon: '🏔️' },
  { id: 'outbuildings', name: 'Garden Buildings', icon: '🏡' },
  { id: 'windows-doors', name: 'Windows & Doors', icon: '🪟' },
  { id: 'roofing', name: 'Roofing', icon: '🏠' },
  { id: 'solar', name: 'Solar & Heat Pumps', icon: '☀️' },
  { id: 'external', name: 'External Works', icon: '🧱' },
  { id: 'internal', name: 'Internal Works', icon: '🔨' },
] as const;
