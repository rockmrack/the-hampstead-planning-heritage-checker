/**
 * Conservation Area Deep Profiles
 * Detailed character analysis for all NW London conservation areas
 */

export interface ConservationAreaProfile {
  id: string;
  name: string;
  borough: string;
  designationDate: string;
  lastAppraisalDate?: string;
  
  // Geography
  boundaries: {
    description: string;
    postcodes: string[];
    landmarks: string[];
  };
  
  // Character
  character: {
    summary: string;
    architecturalStyles: ArchitecturalStyle[];
    predominantEra: string;
    keyFeatures: string[];
    significantViews: ViewCone[];
    greenSpaces: string[];
    streetscapeCharacter: string;
  };
  
  // Heritage assets
  assets: {
    listedBuildingsCount: number;
    gradeICount: number;
    gradeIIStarCount: number;
    gradeIICount: number;
    locallyListedCount: number;
    scheduledMonuments: number;
    registeredParksGardens: number;
    keyBuildings: KeyBuilding[];
  };
  
  // Planning policies
  policies: {
    localPlanPolicies: string[];
    supplementaryGuidance: string[];
    article4Directions: Article4Direction[];
    managementProposals: string[];
  };
  
  // Design guidance
  designGuidance: {
    generalPrinciples: string[];
    extensions: ExtensionGuidance;
    roofs: RoofGuidance;
    windows: WindowGuidance;
    materials: MaterialGuidance;
    boundaries: BoundaryGuidance;
    landscaping: string[];
    sustainability: string[];
  };
  
  // Statistics
  statistics: {
    approvalRate: number;
    averageDecisionTime: number;
    commonApplicationTypes: { type: string; percentage: number }[];
    refusalReasons: { reason: string; percentage: number }[];
  };
  
  // Contact
  conservationOfficer?: {
    name?: string;
    email: string;
    phone: string;
  };
  
  // Resources
  resources: {
    appraisalDocument?: string;
    managementPlan?: string;
    designGuide?: string;
    characterAssessment?: string;
  };
}

export interface ArchitecturalStyle {
  name: string;
  period: string;
  prevalence: 'dominant' | 'common' | 'occasional' | 'rare';
  description: string;
  keyFeatures: string[];
}

export interface ViewCone {
  name: string;
  description: string;
  protected: boolean;
  fromLocation: string;
  toLocation: string;
  significance: 'high' | 'medium' | 'local';
}

export interface KeyBuilding {
  name: string;
  address: string;
  listingGrade?: 'I' | 'II*' | 'II' | 'locally-listed';
  description: string;
  significance: string;
}

export interface Article4Direction {
  reference: string;
  dateDesignated: string;
  coverageArea: string;
  removedRights: string[];
  description: string;
}

export interface ExtensionGuidance {
  rearExtensions: {
    acceptable: string[];
    unacceptable: string[];
    maxDepth?: string;
    materials: string[];
  };
  sideExtensions: {
    acceptable: string[];
    unacceptable: string[];
    setback?: string;
  };
  basements: {
    policy: 'acceptable' | 'case-by-case' | 'generally-resisted';
    guidance: string[];
    lightWellPolicy: string;
  };
}

export interface RoofGuidance {
  dormers: {
    policy: 'acceptable' | 'case-by-case' | 'resisted';
    frontDormers: string;
    rearDormers: string;
    sideDormers: string;
    materials: string[];
    maxSize?: string;
  };
  rooflights: {
    policy: 'acceptable' | 'conservation-type-only';
    frontRoof: string;
    rearRoof: string;
    acceptableTypes: string[];
  };
  roofExtensions: {
    policy: string;
    maxHeightIncrease?: string;
  };
  materials: string[];
}

export interface WindowGuidance {
  originalWindows: string;
  replacementPolicy: string;
  acceptableMaterials: string[];
  unacceptableMaterials: string[];
  glazingBars: string;
  doubleGlazing: string;
  secondaryGlazing: string;
}

export interface MaterialGuidance {
  walls: {
    acceptable: string[];
    unacceptable: string[];
    rendering: string;
    painting: string;
  };
  roofing: {
    acceptable: string[];
    unacceptable: string[];
  };
  boundaries: {
    acceptable: string[];
    unacceptable: string[];
  };
  hardSurfacing: {
    acceptable: string[];
    unacceptable: string[];
  };
}

export interface BoundaryGuidance {
  frontBoundaries: string;
  sideBoundaries: string;
  rearBoundaries: string;
  wallMaterials: string[];
  fenceMaterials: string[];
  maxHeights: {
    front: string;
    side: string;
    rear: string;
  };
}

// ===========================================
// NW LONDON CONSERVATION AREA PROFILES
// ===========================================

export const CONSERVATION_AREA_PROFILES: ConservationAreaProfile[] = [
  // ========== HAMPSTEAD ==========
  {
    id: 'ca-hampstead',
    name: 'Hampstead Conservation Area',
    borough: 'Camden',
    designationDate: '1968',
    lastAppraisalDate: '2021',
    boundaries: {
      description: 'Covers the historic village core of Hampstead, extending from the Heath to Hampstead High Street',
      postcodes: ['NW3 1', 'NW3 2', 'NW3 3', 'NW3 4', 'NW3 5', 'NW3 6', 'NW3 7'],
      landmarks: ['Hampstead Heath', 'Flask Walk', 'Church Row', 'Hampstead High Street', 'Whitestone Pond'],
    },
    character: {
      summary: 'Hampstead retains the character of an 18th-century hilltop village with winding streets, intimate spaces, and an exceptional concentration of Georgian and Victorian buildings. The area\'s topography creates dramatic views and a sense of enclosure that contributes to its unique identity.',
      architecturalStyles: [
        {
          name: 'Georgian',
          period: '1714-1830',
          prevalence: 'dominant',
          description: 'Red and brown brick townhouses with elegant proportions',
          keyFeatures: ['Sash windows', 'Panelled doors', 'Brick dentil cornices', 'Wrought iron railings'],
        },
        {
          name: 'Victorian',
          period: '1837-1901',
          prevalence: 'common',
          description: 'Gothic Revival and Italianate villas',
          keyFeatures: ['Bay windows', 'Decorative brickwork', 'Ornate porches', 'Slate roofs'],
        },
        {
          name: 'Arts and Crafts',
          period: '1880-1920',
          prevalence: 'occasional',
          description: 'Individual architect-designed houses',
          keyFeatures: ['Hand-crafted details', 'Mixed materials', 'Vernacular influence'],
        },
        {
          name: 'Modernist',
          period: '1920-1940',
          prevalence: 'rare',
          description: 'Significant examples by Connell, Ward and Lucas and others',
          keyFeatures: ['Flat roofs', 'White render', 'Horizontal windows', 'Geometric forms'],
        },
      ],
      predominantEra: 'Georgian and Early Victorian',
      keyFeatures: [
        'Narrow winding streets following historic routes',
        'Intimate courtyards and passages',
        'Mature trees and extensive greenery',
        'Traditional shopfronts',
        'Historic pubs and coaching inns',
        'Brick boundary walls',
        'Cobbled surfaces and York stone paving',
      ],
      significantViews: [
        {
          name: 'View from Whitestone Pond',
          description: 'Panoramic views across London',
          protected: true,
          fromLocation: 'Whitestone Pond',
          toLocation: 'London skyline',
          significance: 'high',
        },
        {
          name: 'Church Row vista',
          description: 'View of St John-at-Hampstead',
          protected: true,
          fromLocation: 'Heath Street',
          toLocation: 'St John-at-Hampstead Church',
          significance: 'high',
        },
        {
          name: 'Holly Hill views',
          description: 'Views across Hampstead to the Heath',
          protected: true,
          fromLocation: 'Holly Hill',
          toLocation: 'Hampstead Heath',
          significance: 'medium',
        },
      ],
      greenSpaces: [
        'Hampstead Heath',
        'St John-at-Hampstead churchyard',
        'Private gardens',
        'Street trees',
      ],
      streetscapeCharacter: 'Organic, village-like layout with narrow pavements, traditional materials, and minimal street clutter',
    },
    assets: {
      listedBuildingsCount: 550,
      gradeICount: 8,
      gradeIIStarCount: 45,
      gradeIICount: 497,
      locallyListedCount: 120,
      scheduledMonuments: 0,
      registeredParksGardens: 1,
      keyBuildings: [
        {
          name: 'Fenton House',
          address: 'Hampstead Grove, NW3',
          listingGrade: 'I',
          description: 'William and Mary merchant\'s house (1686)',
          significance: 'One of the finest surviving 17th-century houses in London',
        },
        {
          name: 'St John-at-Hampstead',
          address: 'Church Row, NW3',
          listingGrade: 'I',
          description: 'Georgian parish church (1747)',
          significance: 'Landmark building and focus of Church Row',
        },
        {
          name: '2 Willow Road',
          address: 'Willow Road, NW3',
          listingGrade: 'I',
          description: 'Modernist house by Ernö Goldfinger (1939)',
          significance: 'Internationally important Modernist house',
        },
        {
          name: 'Burgh House',
          address: 'New End Square, NW3',
          listingGrade: 'I',
          description: 'Queen Anne house (1704)',
          significance: 'Local history museum and community building',
        },
      ],
    },
    policies: {
      localPlanPolicies: [
        'D1 - Design',
        'D2 - Heritage',
        'D5 - Conservation Areas',
        'A1 - Managing impacts of development',
      ],
      supplementaryGuidance: [
        'Hampstead Conservation Area Appraisal and Management Strategy',
        'Camden Planning Guidance - Design',
        'Basements and Lightwells SPD',
      ],
      article4Directions: [
        {
          reference: 'A4D/Hampstead/1990',
          dateDesignated: '1990',
          coverageArea: 'Entire conservation area',
          removedRights: [
            'External painting',
            'Satellite dishes',
            'Replacement windows',
            'Front boundary alterations',
            'Hardstanding',
          ],
          description: 'Removes permitted development rights for alterations affecting external appearance',
        },
      ],
      managementProposals: [
        'Protect and enhance historic shopfronts',
        'Resist development harmful to setting of listed buildings',
        'Protect mature trees and green spaces',
        'Maintain traditional street surfaces',
      ],
    },
    designGuidance: {
      generalPrinciples: [
        'New development must be of the highest quality and respect the historic character',
        'Scale, massing, and height must be appropriate to the immediate context',
        'Traditional materials should be used throughout',
        'Original architectural features must be retained and restored',
        'The cumulative impact of small changes is carefully assessed',
      ],
      extensions: {
        rearExtensions: {
          acceptable: [
            'Single storey rear extensions in appropriate materials',
            'Sympathetic side return infills',
            'Glazed links to garden rooms',
          ],
          unacceptable: [
            'Full-width rear extensions that dominate gardens',
            'Extensions visible from public realm',
            'Inappropriate materials (uPVC, reconstituted stone)',
          ],
          maxDepth: '3m single storey strongly preferred, up to 4m may be acceptable',
          materials: ['London stock brick', 'Glass and timber', 'Lead or zinc roofing'],
        },
        sideExtensions: {
          acceptable: [
            'Subordinate single storey extensions',
            'Extensions maintaining gaps between buildings',
          ],
          unacceptable: [
            'Extensions that fill gaps between properties',
            'Extensions that disrupt the rhythm of the streetscape',
          ],
          setback: 'Minimum 1m setback from front building line',
        },
        basements: {
          policy: 'case-by-case',
          guidance: [
            'Must not harm trees or gardens',
            'Structural impact assessment required',
            'No more than 50% of garden to be excavated',
            'Discrete lightwells only',
          ],
          lightWellPolicy: 'Lightwells at front generally unacceptable; rear lightwells should be discreet and within 1m of building',
        },
      },
      roofs: {
        dormers: {
          policy: 'case-by-case',
          frontDormers: 'Generally unacceptable unless historically present',
          rearDormers: 'May be acceptable if subordinate and matching neighbours',
          sideDormers: 'Generally unacceptable',
          materials: ['Lead-clad', 'Slate', 'Conservation rooflights'],
          maxSize: 'Maximum 1/3 width of roof slope',
        },
        rooflights: {
          policy: 'conservation-type-only',
          frontRoof: 'Unacceptable',
          rearRoof: 'Conservation-style rooflights acceptable',
          acceptableTypes: ['Conservation Velux', 'Cast iron', 'Flush fitting'],
        },
        roofExtensions: {
          policy: 'No increase in ridge height; mansard additions generally unacceptable',
        },
        materials: ['Natural slate', 'Clay tiles', 'Lead', 'Standing seam zinc (rear only)'],
      },
      windows: {
        originalWindows: 'Must be retained and repaired wherever possible',
        replacementPolicy: 'Like-for-like replacement in timber only',
        acceptableMaterials: ['Timber'],
        unacceptableMaterials: ['uPVC', 'Aluminium (on historic buildings)'],
        glazingBars: 'Original pattern must be replicated',
        doubleGlazing: 'Slim-profile double glazing acceptable where units match original',
        secondaryGlazing: 'Acceptable internal secondary glazing may be considered',
      },
      materials: {
        walls: {
          acceptable: ['London stock brick', 'Red brick', 'Lime render', 'Painted stucco'],
          unacceptable: ['Reconstituted stone', 'Artificial materials', 'Cement render'],
          rendering: 'Lime-based render only; cement render prohibited',
          painting: 'Traditional colours only; planning permission required',
        },
        roofing: {
          acceptable: ['Natural Welsh slate', 'Clay tiles', 'Lead', 'Zinc (rear only)'],
          unacceptable: ['Concrete tiles', 'Artificial slate', 'Felt'],
        },
        boundaries: {
          acceptable: ['Brick walls', 'Iron railings', 'Timber picket fences'],
          unacceptable: ['Close-boarded fences at front', 'Concrete walls', 'Leylandii hedges'],
        },
        hardSurfacing: {
          acceptable: ['York stone', 'Granite setts', 'Gravel', 'Brick paviors'],
          unacceptable: ['Block paving', 'Tarmac', 'Coloured concrete'],
        },
      },
      boundaries: {
        frontBoundaries: 'Original walls and railings must be retained; like-for-like repairs only',
        sideBoundaries: 'Traditional brick walls or timber fences',
        rearBoundaries: 'More flexibility but must maintain garden character',
        wallMaterials: ['London stock brick', 'Red brick'],
        fenceMaterials: ['Timber picket', 'Close-boarded (rear only)'],
        maxHeights: {
          front: '1m walls, 1.2m with railings',
          side: '2m',
          rear: '2m',
        },
      },
      landscaping: [
        'Maintain green front gardens',
        'No loss of front gardens to parking',
        'Protect mature trees',
        'Native species planting preferred',
      ],
      sustainability: [
        'Solar panels acceptable on rear roofs only, out of public view',
        'Air source heat pumps require careful siting',
        'EV charging points should be discreetly located',
        'Retrofit measures must respect historic fabric',
      ],
    },
    statistics: {
      approvalRate: 68,
      averageDecisionTime: 58,
      commonApplicationTypes: [
        { type: 'Householder extensions', percentage: 45 },
        { type: 'Listed building consent', percentage: 25 },
        { type: 'Tree works', percentage: 15 },
        { type: 'Change of use', percentage: 10 },
        { type: 'Other', percentage: 5 },
      ],
      refusalReasons: [
        { reason: 'Harm to character and appearance of conservation area', percentage: 35 },
        { reason: 'Inappropriate materials', percentage: 20 },
        { reason: 'Overdevelopment of site', percentage: 18 },
        { reason: 'Harm to listed building', percentage: 15 },
        { reason: 'Loss of garden space', percentage: 12 },
      ],
    },
    conservationOfficer: {
      email: 'conservation@camden.gov.uk',
      phone: '020 7974 4444',
    },
    resources: {
      appraisalDocument: 'https://www.camden.gov.uk/hampstead-conservation-area',
      managementPlan: 'https://www.camden.gov.uk/hampstead-management-plan',
      designGuide: 'https://www.camden.gov.uk/design-guidance',
    },
  },

  // ========== HIGHGATE ==========
  {
    id: 'ca-highgate',
    name: 'Highgate Conservation Area',
    borough: 'Camden/Haringey',
    designationDate: '1968',
    lastAppraisalDate: '2019',
    boundaries: {
      description: 'Covers the historic village of Highgate straddling Camden and Haringey',
      postcodes: ['N6 4', 'N6 5', 'N6 6'],
      landmarks: ['Highgate Cemetery', 'Highgate Village', 'Waterlow Park', 'Pond Square'],
    },
    character: {
      summary: 'Highgate is a hilltop village with outstanding Georgian architecture, world-famous Victorian cemetery, and dramatic views across London. The area has strong literary and artistic associations.',
      architecturalStyles: [
        {
          name: 'Georgian',
          period: '1714-1830',
          prevalence: 'dominant',
          description: 'Elegant brick townhouses around the village core',
          keyFeatures: ['Red brick', 'Timber sash windows', 'Panelled doors', 'Iron railings'],
        },
        {
          name: 'Victorian Gothic',
          period: '1837-1901',
          prevalence: 'common',
          description: 'Gothic villas and the famous cemetery',
          keyFeatures: ['Pointed arches', 'Decorative stonework', 'Polychrome brick'],
        },
        {
          name: 'Arts and Crafts',
          period: '1880-1920',
          prevalence: 'occasional',
          description: 'Individual houses with craft details',
          keyFeatures: ['Handmade materials', 'Complex rooflines', 'Leaded windows'],
        },
      ],
      predominantEra: 'Georgian',
      keyFeatures: [
        'Dramatic hilltop location with extensive views',
        'Intact Georgian high street',
        'Historic cemetery landscape',
        'Mature trees and green spaces',
        'Traditional village atmosphere',
      ],
      significantViews: [
        {
          name: 'View from Highgate Hill',
          description: 'Panoramic views across North London',
          protected: true,
          fromLocation: 'Highgate Hill',
          toLocation: 'London skyline',
          significance: 'high',
        },
      ],
      greenSpaces: ['Waterlow Park', 'Highgate Cemetery', 'Highgate Woods'],
      streetscapeCharacter: 'Village character with narrow streets, traditional paving, and minimal modern intervention',
    },
    assets: {
      listedBuildingsCount: 320,
      gradeICount: 5,
      gradeIIStarCount: 25,
      gradeIICount: 290,
      locallyListedCount: 85,
      scheduledMonuments: 0,
      registeredParksGardens: 2,
      keyBuildings: [
        {
          name: 'Highgate Cemetery',
          address: 'Swain\'s Lane, N6',
          listingGrade: 'I',
          description: 'Victorian cemetery (1839)',
          significance: 'One of the Magnificent Seven, internationally important',
        },
        {
          name: 'Cromwell House',
          address: 'Highgate Hill, N6',
          listingGrade: 'I',
          description: '17th-century house (1637-38)',
          significance: 'Finest surviving early 17th-century house in Highgate',
        },
      ],
    },
    policies: {
      localPlanPolicies: ['D1 - Design', 'D2 - Heritage', 'D5 - Conservation Areas'],
      supplementaryGuidance: ['Highgate Conservation Area Statement'],
      article4Directions: [
        {
          reference: 'A4D/Highgate/1992',
          dateDesignated: '1992',
          coverageArea: 'Entire conservation area',
          removedRights: ['External alterations', 'Satellite dishes', 'Front boundary changes'],
          description: 'Comprehensive Article 4 Direction',
        },
      ],
      managementProposals: ['Protect views', 'Enhance public realm', 'Resist inappropriate development'],
    },
    designGuidance: {
      generalPrinciples: [
        'Preserve the village character',
        'Respect Georgian proportions and materials',
        'Maintain views across London',
        'Protect the cemetery setting',
      ],
      extensions: {
        rearExtensions: {
          acceptable: ['Single storey in matching brick', 'Glazed garden rooms'],
          unacceptable: ['Large extensions visible from public realm'],
          maxDepth: '3m preferred',
          materials: ['Red brick', 'Stock brick', 'Timber and glass'],
        },
        sideExtensions: {
          acceptable: ['Subordinate additions maintaining gaps'],
          unacceptable: ['Extensions filling historic gaps'],
        },
        basements: {
          policy: 'case-by-case',
          guidance: ['Impact on trees carefully assessed', 'Cemetery proximity considered'],
          lightWellPolicy: 'Discrete lightwells only',
        },
      },
      roofs: {
        dormers: {
          policy: 'resisted',
          frontDormers: 'Unacceptable',
          rearDormers: 'Small dormers may be acceptable',
          sideDormers: 'Unacceptable',
          materials: ['Lead', 'Slate'],
        },
        rooflights: {
          policy: 'conservation-type-only',
          frontRoof: 'Unacceptable',
          rearRoof: 'Conservation rooflights only',
          acceptableTypes: ['Conservation Velux', 'Cast iron'],
        },
        roofExtensions: {
          policy: 'No increase in ridge height',
        },
        materials: ['Natural slate', 'Clay tiles', 'Lead'],
      },
      windows: {
        originalWindows: 'Must be retained',
        replacementPolicy: 'Like-for-like timber only',
        acceptableMaterials: ['Timber'],
        unacceptableMaterials: ['uPVC', 'Aluminium'],
        glazingBars: 'Original pattern required',
        doubleGlazing: 'Slim profile units acceptable',
        secondaryGlazing: 'Acceptable internally',
      },
      materials: {
        walls: {
          acceptable: ['Red brick', 'Stock brick', 'Lime render'],
          unacceptable: ['Artificial materials'],
          rendering: 'Lime only',
          painting: 'Traditional colours',
        },
        roofing: {
          acceptable: ['Natural slate', 'Clay tiles'],
          unacceptable: ['Concrete tiles'],
        },
        boundaries: {
          acceptable: ['Brick walls', 'Iron railings'],
          unacceptable: ['Close-boarded fences at front'],
        },
        hardSurfacing: {
          acceptable: ['York stone', 'Gravel'],
          unacceptable: ['Block paving'],
        },
      },
      boundaries: {
        frontBoundaries: 'Historic boundaries must be retained',
        sideBoundaries: 'Traditional materials',
        rearBoundaries: 'Flexibility within character',
        wallMaterials: ['Brick'],
        fenceMaterials: ['Timber'],
        maxHeights: { front: '1m', side: '2m', rear: '2m' },
      },
      landscaping: ['Protect mature trees', 'Maintain green gardens'],
      sustainability: ['Solar panels rear only', 'Sensitive retrofit'],
    },
    statistics: {
      approvalRate: 72,
      averageDecisionTime: 55,
      commonApplicationTypes: [
        { type: 'Householder', percentage: 40 },
        { type: 'Listed building consent', percentage: 30 },
        { type: 'Tree works', percentage: 20 },
        { type: 'Other', percentage: 10 },
      ],
      refusalReasons: [
        { reason: 'Harm to conservation area character', percentage: 40 },
        { reason: 'Inappropriate design', percentage: 30 },
        { reason: 'Impact on views', percentage: 20 },
        { reason: 'Other', percentage: 10 },
      ],
    },
    conservationOfficer: {
      email: 'conservation@camden.gov.uk',
      phone: '020 7974 4444',
    },
    resources: {
      appraisalDocument: 'https://www.camden.gov.uk/highgate-conservation-area',
    },
  },

  // ========== MUSWELL HILL ==========
  {
    id: 'ca-muswell-hill',
    name: 'Muswell Hill Conservation Area',
    borough: 'Haringey',
    designationDate: '1979',
    lastAppraisalDate: '2018',
    boundaries: {
      description: 'Covers the Edwardian suburb centred on the Broadway shopping area',
      postcodes: ['N10 1', 'N10 2', 'N10 3'],
      landmarks: ['Muswell Hill Broadway', 'Alexandra Palace', 'Queens Wood'],
    },
    character: {
      summary: 'Muswell Hill is an outstanding example of a late Victorian and Edwardian suburb with exceptional architectural cohesion. The area was largely developed 1896-1914 as a garden suburb.',
      architecturalStyles: [
        {
          name: 'Edwardian',
          period: '1901-1914',
          prevalence: 'dominant',
          description: 'Highly decorated red brick houses with Arts and Crafts influence',
          keyFeatures: [
            'Red brick with terracotta details',
            'Bay windows',
            'Decorative porches',
            'Tile hanging',
            'Mock Tudor gables',
          ],
        },
        {
          name: 'Late Victorian',
          period: '1890-1901',
          prevalence: 'common',
          description: 'Earlier development with similar character',
          keyFeatures: ['Yellow stock brick', 'Slate roofs', 'Sash windows'],
        },
      ],
      predominantEra: 'Edwardian',
      keyFeatures: [
        'Remarkable consistency of style and period',
        'Distinctive red brick with elaborate terracotta',
        'Prominent bay windows',
        'Decorative tile hanging and half-timbering',
        'Well-preserved shopping parade',
        'Tree-lined streets',
      ],
      significantViews: [
        {
          name: 'Views to Alexandra Palace',
          description: 'Views of the landmark building from various streets',
          protected: true,
          fromLocation: 'Multiple locations',
          toLocation: 'Alexandra Palace',
          significance: 'high',
        },
      ],
      greenSpaces: ['Alexandra Park', 'Queens Wood', 'Highgate Wood'],
      streetscapeCharacter: 'Wide tree-lined avenues with consistent building lines and front gardens',
    },
    assets: {
      listedBuildingsCount: 15,
      gradeICount: 0,
      gradeIIStarCount: 1,
      gradeIICount: 14,
      locallyListedCount: 250,
      scheduledMonuments: 0,
      registeredParksGardens: 1,
      keyBuildings: [
        {
          name: 'Alexandra Palace',
          address: 'Alexandra Palace Way, N22',
          listingGrade: 'II',
          description: 'Victorian exhibition hall (1873, rebuilt 1875)',
          significance: 'Major landmark and cultural venue',
        },
        {
          name: 'Muswell Hill Methodist Church',
          address: 'Pages Lane, N10',
          listingGrade: 'II',
          description: 'Arts and Crafts church (1903)',
          significance: 'Important community building',
        },
      ],
    },
    policies: {
      localPlanPolicies: ['DM1 - Design', 'DM9 - Heritage'],
      supplementaryGuidance: ['Muswell Hill Conservation Area Appraisal'],
      article4Directions: [
        {
          reference: 'A4D/MH/2010',
          dateDesignated: '2010',
          coverageArea: 'Selected streets',
          removedRights: ['Front garden alterations', 'Replacement windows'],
          description: 'Covers front boundary and window changes',
        },
      ],
      managementProposals: ['Protect Edwardian character', 'Restore shopfronts', 'Enhance public realm'],
    },
    designGuidance: {
      generalPrinciples: [
        'Maintain the remarkable consistency of the area',
        'Preserve original features especially decorative elements',
        'Support sensitive restoration',
        'Protect front gardens from parking',
      ],
      extensions: {
        rearExtensions: {
          acceptable: ['Single storey in matching brick', 'Modest conservatories'],
          unacceptable: ['Large extensions disrupting rhythm', 'Full-width two storey'],
          maxDepth: '3m standard, 4m case by case',
          materials: ['Red brick to match', 'Timber conservatories'],
        },
        sideExtensions: {
          acceptable: ['Small single storey maintaining gaps'],
          unacceptable: ['Extensions filling gaps between houses'],
          setback: '1m from front building line',
        },
        basements: {
          policy: 'acceptable',
          guidance: ['Less restrictive than inner London', 'Standard conditions apply'],
          lightWellPolicy: 'Rear lightwells acceptable',
        },
      },
      roofs: {
        dormers: {
          policy: 'case-by-case',
          frontDormers: 'Only where historically present or matching neighbours',
          rearDormers: 'Generally acceptable if sympathetic',
          sideDormers: 'Case by case',
          materials: ['Tile hanging', 'Slate', 'Lead'],
          maxSize: 'Should not dominate roof slope',
        },
        rooflights: {
          policy: 'acceptable',
          frontRoof: 'Conservation rooflights may be acceptable',
          rearRoof: 'Standard rooflights acceptable',
          acceptableTypes: ['Conservation Velux', 'Standard Velux on rear'],
        },
        roofExtensions: {
          policy: 'Hip to gable may be acceptable on semi-detached',
          maxHeightIncrease: 'No increase in ridge height',
        },
        materials: ['Clay tiles', 'Slate', 'Lead'],
      },
      windows: {
        originalWindows: 'Repair preferred to replacement',
        replacementPolicy: 'Timber sash like-for-like',
        acceptableMaterials: ['Timber'],
        unacceptableMaterials: ['uPVC'],
        glazingBars: 'Original pattern to be replicated',
        doubleGlazing: 'Acceptable in timber frames',
        secondaryGlazing: 'Acceptable',
      },
      materials: {
        walls: {
          acceptable: ['Red brick', 'Render to match', 'Tile hanging'],
          unacceptable: ['Yellow brick', 'Artificial cladding'],
          rendering: 'Where original only',
          painting: 'Where historically appropriate',
        },
        roofing: {
          acceptable: ['Clay tiles', 'Slate'],
          unacceptable: ['Concrete tiles'],
        },
        boundaries: {
          acceptable: ['Low brick walls', 'Hedges', 'Timber fences (sides)'],
          unacceptable: ['High solid walls at front'],
        },
        hardSurfacing: {
          acceptable: ['Victorian tiles', 'Gravel', 'Brick paviors'],
          unacceptable: ['Full tarmac'],
        },
      },
      boundaries: {
        frontBoundaries: 'Low walls with hedge or railing preferred',
        sideBoundaries: 'Traditional fencing acceptable',
        rearBoundaries: 'Standard residential treatments',
        wallMaterials: ['Red brick', 'Stock brick'],
        fenceMaterials: ['Timber'],
        maxHeights: { front: '1m', side: '2m', rear: '2m' },
      },
      landscaping: ['Retain front gardens', 'No complete paving for parking'],
      sustainability: ['Solar panels generally acceptable on rear', 'Heat pumps require careful siting'],
    },
    statistics: {
      approvalRate: 78,
      averageDecisionTime: 48,
      commonApplicationTypes: [
        { type: 'Householder', percentage: 55 },
        { type: 'Loft conversion', percentage: 25 },
        { type: 'Tree works', percentage: 15 },
        { type: 'Other', percentage: 5 },
      ],
      refusalReasons: [
        { reason: 'Loss of front garden', percentage: 25 },
        { reason: 'Inappropriate materials', percentage: 25 },
        { reason: 'Overdevelopment', percentage: 25 },
        { reason: 'Harm to streetscene', percentage: 25 },
      ],
    },
    conservationOfficer: {
      email: 'planning@haringey.gov.uk',
      phone: '020 8489 0000',
    },
    resources: {
      appraisalDocument: 'https://www.haringey.gov.uk/muswell-hill-conservation-area',
    },
  },
];

// ===========================================
// LOOKUP FUNCTIONS
// ===========================================

export function getConservationAreaProfile(id: string): ConservationAreaProfile | undefined {
  return CONSERVATION_AREA_PROFILES.find(ca => ca.id === id);
}

export function getConservationAreaByName(name: string): ConservationAreaProfile | undefined {
  return CONSERVATION_AREA_PROFILES.find(ca => 
    ca.name.toLowerCase().includes(name.toLowerCase())
  );
}

export function getConservationAreaByPostcode(postcode: string): ConservationAreaProfile | undefined {
  const district = postcode.toUpperCase().split(' ')[0];
  if (!district) return undefined;
  return CONSERVATION_AREA_PROFILES.find(ca => 
    ca.boundaries.postcodes.some(p => district.startsWith(p.replace(' ', '')))
  );
}

export function getConservationAreasByBorough(borough: string): ConservationAreaProfile[] {
  return CONSERVATION_AREA_PROFILES.filter(ca => 
    ca.borough.toLowerCase().includes(borough.toLowerCase())
  );
}

export function getAllConservationAreas(): ConservationAreaProfile[] {
  return CONSERVATION_AREA_PROFILES;
}
