/**
 * Area-Specific Intelligence
 * Unique rules, character, and local knowledge for each NW London area
 */

export interface AreaIntelligence {
  id: string;
  name: string;
  postcodes: string[];
  borough: string;
  
  // Character
  character: {
    summary: string;
    atmosphere: string;
    demographics: string;
    propertyTypes: PropertyTypeBreakdown[];
    averagePropertyValue: number;
    premiumAreas: string[];
  };
  
  // Planning context
  planning: {
    strictnessRating: number; // 1-10
    conservationAreaCoverage: number; // percentage
    listedBuildingDensity: string;
    article4Coverage: boolean;
    localPlanPriorities: string[];
    sensitiveIssues: string[];
    successTips: string[];
  };
  
  // Local knowledge
  localKnowledge: {
    planningOfficerNotes: string[];
    commonRefusalReasons: string[];
    whatWorksHere: string[];
    whatDoesntWork: string[];
    recentTrends: string[];
    localSocieties: LocalSociety[];
    councillorPriorities: string[];
  };
  
  // Specific rules
  specificRules: {
    extensions: AreaExtensionRules;
    lofts: AreaLoftRules;
    basements: AreaBasementRules;
    trees: AreaTreeRules;
    parking: AreaParkingRules;
    materials: AreaMaterialRules;
  };
  
  // Statistics
  statistics: {
    avgApprovalRate: number;
    avgDecisionDays: number;
    avgAppealSuccessRate: number;
    mostCommonApplications: string[];
    monthlyApplicationVolume: number;
  };
  
  // Local amenities that affect planning
  amenities: {
    nearbySchools: string[];
    transportLinks: string[];
    greenSpaces: string[];
    shoppingAreas: string[];
  };
  
  // Value impact
  valueImpact: {
    extensionValue: number; // % value increase
    loftConversionValue: number;
    basementValue: number;
    gardenRoomValue: number;
  };
}

export interface PropertyTypeBreakdown {
  type: string;
  percentage: number;
  typicalSize: string;
  planningConsiderations: string[];
}

export interface LocalSociety {
  name: string;
  influence: 'high' | 'medium' | 'low';
  focusAreas: string[];
  website?: string;
  contactEmail?: string;
}

export interface AreaExtensionRules {
  rearMaxDepth: number;
  rearNotes: string[];
  sideAllowed: boolean;
  sideNotes: string[];
  twoStoreyPolicy: string;
}

export interface AreaLoftRules {
  dorsmerPolicy: 'liberal' | 'moderate' | 'strict' | 'very-strict';
  frontDormerPolicy: string;
  rearDormerPolicy: string;
  roofLightPolicy: string;
  hipToGableAllowed: boolean;
  notes: string[];
}

export interface AreaBasementRules {
  policy: 'acceptable' | 'restricted' | 'highly-restricted' | 'case-by-case';
  maxDepth: string;
  maxCoverage: string;
  lightWellPolicy: string;
  cmiRequired: boolean;
  notes: string[];
}

export interface AreaTreeRules {
  tpoPrevalence: 'high' | 'medium' | 'low';
  automaticProtection: boolean;
  commonProtectedSpecies: string[];
  surveyRequirements: string;
}

export interface AreaParkingRules {
  cpdZone: boolean;
  frontGardenParkingPolicy: string;
  crossoverPolicy: string;
  evChargingPolicy: string;
}

export interface AreaMaterialRules {
  preferredWallMaterials: string[];
  avoidMaterials: string[];
  roofMaterials: string[];
  windowMaterials: string[];
  localSpecialties: string[];
}

// ===========================================
// NW LONDON AREA INTELLIGENCE DATABASE
// ===========================================

export const AREA_INTELLIGENCE: AreaIntelligence[] = [
  // ========== HAMPSTEAD (NW3) ==========
  {
    id: 'hampstead',
    name: 'Hampstead',
    postcodes: ['NW3'],
    borough: 'Camden',
    character: {
      summary: 'Historic hilltop village with exceptional Georgian and Victorian architecture. One of London\'s most desirable and expensive areas.',
      atmosphere: 'Village feel despite being in London. Literary and artistic heritage. Coffee shops, independent boutiques, intellectual atmosphere.',
      demographics: 'Affluent professionals, media personalities, academics. High proportion of owner-occupiers.',
      propertyTypes: [
        { type: 'Georgian townhouse', percentage: 25, typicalSize: '2500-4000 sq ft', planningConsiderations: ['Listed building likely', 'Sash windows essential'] },
        { type: 'Victorian villa', percentage: 30, typicalSize: '2000-3500 sq ft', planningConsiderations: ['Conservation area', 'Garden depth matters'] },
        { type: 'Edwardian house', percentage: 20, typicalSize: '1500-2500 sq ft', planningConsiderations: ['Often locally listed'] },
        { type: 'Purpose-built flat', percentage: 15, typicalSize: '800-1500 sq ft', planningConsiderations: ['Leasehold restrictions'] },
        { type: 'Converted flat', percentage: 10, typicalSize: '600-1200 sq ft', planningConsiderations: ['May need building consent'] },
      ],
      averagePropertyValue: 2850000,
      premiumAreas: ['Church Row', 'Flask Walk', 'Well Walk', 'Hampstead Grove', 'Willow Road'],
    },
    planning: {
      strictnessRating: 9,
      conservationAreaCoverage: 95,
      listedBuildingDensity: 'Very High - 550+ listed buildings',
      article4Coverage: true,
      localPlanPriorities: [
        'Preserve historic village character',
        'Protect views to and from the Heath',
        'Maintain residential amenity',
        'Resist overdevelopment',
      ],
      sensitiveIssues: [
        'Basement excavations - strict policy after subsidence concerns',
        'Roof extensions - generally resisted',
        'Loss of gardens - strongly resisted',
        'Modern materials - rarely acceptable',
      ],
      successTips: [
        'Always use an architect experienced in Hampstead',
        'Get pre-application advice - essential here',
        'Engage with the Hampstead Conservation Area Advisory Committee',
        'Use traditional materials - no shortcuts',
        'Keep extensions subordinate and discreet',
      ],
    },
    localKnowledge: {
      planningOfficerNotes: [
        'Camden conservation team takes a very protective stance',
        'Pre-apps are detailed and worth doing',
        'Officers know the area well - don\'t try to cut corners',
        'Heritage Statements need to be thorough',
      ],
      commonRefusalReasons: [
        'Harm to the character and appearance of the Conservation Area',
        'Harm to the setting of listed buildings',
        'Inappropriate materials',
        'Excessive bulk or massing',
        'Loss of garden space',
      ],
      whatWorksHere: [
        'Single storey rear extensions up to 3m',
        'Side return infills in glass/timber',
        'Internal alterations (with LBC if listed)',
        'Sympathetic window repairs',
        'Restoration of original features',
      ],
      whatDoesntWork: [
        'Rear dormers on listed buildings',
        'uPVC anything',
        'Large basement excavations',
        'Modern materials on street-facing elevations',
        'Loss of front garden to parking',
      ],
      recentTrends: [
        'Increasing scrutiny of basement applications',
        'Greater emphasis on sustainability - but must be discreet',
        'More refusals for bulk-related reasons',
        'Enforcement action increasing',
      ],
      localSocieties: [
        {
          name: 'Hampstead Conservation Area Advisory Committee',
          influence: 'high',
          focusAreas: ['All planning applications', 'Listed buildings', 'Trees'],
          website: 'https://www.camden.gov.uk/caac',
        },
        {
          name: 'Heath & Hampstead Society',
          influence: 'high',
          focusAreas: ['Heath protection', 'Views', 'Development'],
          website: 'https://www.heathandhampstead.org.uk',
        },
      ],
      councillorPriorities: [
        'Protecting the Heath and views',
        'Preventing overdevelopment',
        'Maintaining village character',
      ],
    },
    specificRules: {
      extensions: {
        rearMaxDepth: 3,
        rearNotes: [
          '3m is the maximum that\'s generally acceptable',
          '4m requires exceptional justification',
          'Full width extensions rarely acceptable',
          'Glazed links preferred to solid connections',
        ],
        sideAllowed: false,
        sideNotes: ['Side extensions almost always refused to maintain gaps'],
        twoStoreyPolicy: 'Generally refused - would harm character',
      },
      lofts: {
        dorsmerPolicy: 'very-strict',
        frontDormerPolicy: 'Never acceptable unless historically present',
        rearDormerPolicy: 'Small dormers may be acceptable on unlisted buildings',
        roofLightPolicy: 'Conservation rooflights only, rear slopes only',
        hipToGableAllowed: false,
        notes: [
          'Any roof alteration needs careful consideration',
          'Listed buildings - extremely difficult',
          'Mansard additions generally refused',
        ],
      },
      basements: {
        policy: 'highly-restricted',
        maxDepth: 'One storey maximum',
        maxCoverage: '50% of garden maximum',
        lightWellPolicy: 'Front lightwells unacceptable, rear must be discreet',
        cmiRequired: true,
        notes: [
          'Construction Management Impact Assessment required',
          'Must not harm trees',
          'Structural survey essential',
          'Neighbor consultation critical',
        ],
      },
      trees: {
        tpoPrevalence: 'high',
        automaticProtection: true,
        commonProtectedSpecies: ['London Plane', 'Oak', 'Beech', 'Horse Chestnut'],
        surveyRequirements: 'BS5837 survey required for any work near trees',
      },
      parking: {
        cpdZone: true,
        frontGardenParkingPolicy: 'Loss of front garden to parking refused',
        crossoverPolicy: 'New crossovers rarely permitted',
        evChargingPolicy: 'Discrete locations only, planning permission may be required',
      },
      materials: {
        preferredWallMaterials: ['London stock brick', 'Red brick', 'Lime render'],
        avoidMaterials: ['uPVC', 'Reconstituted stone', 'Cement render', 'Artificial materials'],
        roofMaterials: ['Natural Welsh slate', 'Clay tiles', 'Lead'],
        windowMaterials: ['Timber only'],
        localSpecialties: ['Georgian sash proportions', 'Brick dentil cornices', 'Wrought iron railings'],
      },
    },
    statistics: {
      avgApprovalRate: 68,
      avgDecisionDays: 58,
      avgAppealSuccessRate: 35,
      mostCommonApplications: ['Rear extension', 'Internal alterations', 'Tree works', 'Listed building consent'],
      monthlyApplicationVolume: 45,
    },
    amenities: {
      nearbySchools: ['South Hampstead High School', 'University College School', 'Royal Free Hospital School'],
      transportLinks: ['Hampstead tube (Northern)', 'Hampstead Heath Overground', 'Multiple bus routes'],
      greenSpaces: ['Hampstead Heath', 'Parliament Hill', 'Golders Hill Park'],
      shoppingAreas: ['Hampstead High Street', 'Flask Walk', 'South End Green'],
    },
    valueImpact: {
      extensionValue: 12,
      loftConversionValue: 15,
      basementValue: 25,
      gardenRoomValue: 8,
    },
  },

  // ========== HIGHGATE (N6) ==========
  {
    id: 'highgate',
    name: 'Highgate',
    postcodes: ['N6'],
    borough: 'Camden/Haringey',
    character: {
      summary: 'Historic hilltop village with Georgian architecture, famous cemetery, and strong community identity. Split between Camden and Haringey.',
      atmosphere: 'Village feel, literary connections, Karl Marx buried here. Mix of families and older residents.',
      demographics: 'Affluent families, academics, media professionals. Strong community spirit.',
      propertyTypes: [
        { type: 'Georgian townhouse', percentage: 30, typicalSize: '2000-3500 sq ft', planningConsiderations: ['Often listed', 'Strict controls'] },
        { type: 'Victorian villa', percentage: 35, typicalSize: '2500-4000 sq ft', planningConsiderations: ['Large gardens', 'Tree constraints'] },
        { type: 'Edwardian house', percentage: 20, typicalSize: '1800-2800 sq ft', planningConsiderations: ['Conservation area'] },
        { type: 'Flat', percentage: 15, typicalSize: '700-1200 sq ft', planningConsiderations: ['Leasehold'] },
      ],
      averagePropertyValue: 2100000,
      premiumAreas: ['The Grove', 'Pond Square', 'Highgate West Hill', 'South Grove'],
    },
    planning: {
      strictnessRating: 8,
      conservationAreaCoverage: 90,
      listedBuildingDensity: 'High - 320+ listed buildings',
      article4Coverage: true,
      localPlanPriorities: [
        'Preserve village character',
        'Protect views across London',
        'Maintain historic gaps between buildings',
        'Protect cemetery setting',
      ],
      sensitiveIssues: [
        'Views - both to and from Highgate',
        'Cemetery proximity - any development visible from cemetery',
        'Tree protection - extensive mature trees',
        'Traffic - narrow historic streets',
      ],
      successTips: [
        'Understand which borough you\'re in - rules differ',
        'View impact assessment often required',
        'Engage with Highgate Society early',
        'Traditional materials essential',
      ],
    },
    localKnowledge: {
      planningOfficerNotes: [
        'Two boroughs = two approaches - Camden stricter',
        'Strong local society input considered',
        'Views are taken very seriously',
        'Cemetery setting carefully protected',
      ],
      commonRefusalReasons: [
        'Impact on views',
        'Harm to conservation area character',
        'Impact on cemetery setting',
        'Loss of garden/trees',
      ],
      whatWorksHere: [
        'Modest rear extensions (3m)',
        'Careful basement works',
        'Sympathetic internal alterations',
        'Garden rooms (out of view)',
      ],
      whatDoesntWork: [
        'Anything visible from cemetery',
        'Modern glazed additions to Georgian',
        'Roof extensions',
        'Loss of front gardens',
      ],
      recentTrends: [
        'More basement applications',
        'Greater emphasis on energy efficiency',
        'Increasing refusals for view impact',
      ],
      localSocieties: [
        {
          name: 'Highgate Society',
          influence: 'high',
          focusAreas: ['Planning', 'Conservation', 'Community'],
          website: 'https://highgatesociety.com',
        },
        {
          name: 'Friends of Highgate Cemetery',
          influence: 'medium',
          focusAreas: ['Cemetery protection', 'Setting'],
        },
      ],
      councillorPriorities: ['Cemetery protection', 'View preservation', 'Traffic management'],
    },
    specificRules: {
      extensions: {
        rearMaxDepth: 3.5,
        rearNotes: ['Must not be visible from key viewpoints', 'Materials critical'],
        sideAllowed: false,
        sideNotes: ['Side extensions resist to maintain historic gaps'],
        twoStoreyPolicy: 'Case by case - generally resisted',
      },
      lofts: {
        dorsmerPolicy: 'strict',
        frontDormerPolicy: 'Unacceptable',
        rearDormerPolicy: 'Small dormers may be acceptable',
        roofLightPolicy: 'Conservation type, rear only',
        hipToGableAllowed: false,
        notes: ['Roof profile changes generally resisted'],
      },
      basements: {
        policy: 'case-by-case',
        maxDepth: 'One storey',
        maxCoverage: '50%',
        lightWellPolicy: 'Discreet rear only',
        cmiRequired: true,
        notes: ['Tree constraints often limiting factor'],
      },
      trees: {
        tpoPrevalence: 'high',
        automaticProtection: true,
        commonProtectedSpecies: ['Yew', 'Oak', 'Cedar', 'Beech'],
        surveyRequirements: 'Full arboricultural report required',
      },
      parking: {
        cpdZone: true,
        frontGardenParkingPolicy: 'Generally refused',
        crossoverPolicy: 'Restricted',
        evChargingPolicy: 'Discreet locations',
      },
      materials: {
        preferredWallMaterials: ['Red brick', 'Stock brick', 'Lime render'],
        avoidMaterials: ['uPVC', 'Cement render'],
        roofMaterials: ['Natural slate', 'Clay tiles'],
        windowMaterials: ['Timber'],
        localSpecialties: ['Georgian proportions', 'Iron railings'],
      },
    },
    statistics: {
      avgApprovalRate: 72,
      avgDecisionDays: 55,
      avgAppealSuccessRate: 38,
      mostCommonApplications: ['Rear extension', 'Listed building consent', 'Tree works'],
      monthlyApplicationVolume: 25,
    },
    amenities: {
      nearbySchools: ['Highgate School', 'Channing School'],
      transportLinks: ['Highgate tube (Northern)', 'Archway tube'],
      greenSpaces: ['Waterlow Park', 'Hampstead Heath', 'Highgate Wood'],
      shoppingAreas: ['Highgate Village', 'Archway'],
    },
    valueImpact: {
      extensionValue: 14,
      loftConversionValue: 18,
      basementValue: 22,
      gardenRoomValue: 10,
    },
  },

  // ========== MUSWELL HILL (N10) ==========
  {
    id: 'muswell-hill',
    name: 'Muswell Hill',
    postcodes: ['N10'],
    borough: 'Haringey',
    character: {
      summary: 'Exceptional Edwardian garden suburb with remarkable architectural consistency. Outstanding shopping parade.',
      atmosphere: 'Family-friendly, community-oriented, excellent schools. Village feel with good shopping.',
      demographics: 'Young families, professionals. Strong community networks.',
      propertyTypes: [
        { type: 'Edwardian semi', percentage: 45, typicalSize: '1500-2500 sq ft', planningConsiderations: ['Red brick essential', 'Original features valued'] },
        { type: 'Edwardian terrace', percentage: 30, typicalSize: '1200-1800 sq ft', planningConsiderations: ['Consistency with street'] },
        { type: 'Victorian house', percentage: 15, typicalSize: '1400-2200 sq ft', planningConsiderations: ['May have different character'] },
        { type: 'Flat', percentage: 10, typicalSize: '600-1000 sq ft', planningConsiderations: ['Purpose-built or converted'] },
      ],
      averagePropertyValue: 1350000,
      premiumAreas: ['Queens Avenue', 'Woodside Avenue', 'Colney Hatch Lane (north)'],
    },
    planning: {
      strictnessRating: 6,
      conservationAreaCoverage: 70,
      listedBuildingDensity: 'Low - but many locally listed',
      article4Coverage: true,
      localPlanPriorities: [
        'Maintain Edwardian character',
        'Protect shopping parade',
        'Retain front gardens',
        'Consistent roof profile',
      ],
      sensitiveIssues: [
        'Front garden loss to parking',
        'Inconsistent loft conversions',
        'Shop front alterations',
        'Satellite dishes',
      ],
      successTips: [
        'Match neighboring extensions',
        'Red brick is essential',
        'Dormers should match existing street pattern',
        'Keep original features',
      ],
    },
    localKnowledge: {
      planningOfficerNotes: [
        'Haringey more flexible than Camden',
        'Consistency is key - match what works nearby',
        'Front gardens are protected',
        'Less strict on modern materials at rear',
      ],
      commonRefusalReasons: [
        'Loss of front garden',
        'Inappropriate dormer design',
        'Disrupting roofline',
        'Wrong materials',
      ],
      whatWorksHere: [
        'Loft conversions with matching dormers',
        'Rear extensions up to 4m',
        'Side return extensions',
        'Garden rooms',
      ],
      whatDoesntWork: [
        'Full-width front dormers',
        'uPVC windows at front',
        'Loss of front gardens',
        'Unsympathetic modern additions',
      ],
      recentTrends: [
        'Many loft conversions approved',
        'Increasing basement applications',
        'More enforcement on front gardens',
      ],
      localSocieties: [
        {
          name: 'Muswell Hill & Fortis Green Association',
          influence: 'medium',
          focusAreas: ['Planning', 'Community', 'Environment'],
        },
      ],
      councillorPriorities: ['Parking', 'Schools', 'Shop parade vitality'],
    },
    specificRules: {
      extensions: {
        rearMaxDepth: 4,
        rearNotes: ['4m generally acceptable for semis', 'Full width OK if neighbours have done it'],
        sideAllowed: true,
        sideNotes: ['Subordinate side extensions can work', 'Maintain gap to boundary'],
        twoStoreyPolicy: 'Acceptable on larger plots, case by case',
      },
      lofts: {
        dorsmerPolicy: 'moderate',
        frontDormerPolicy: 'Acceptable where street pattern supports',
        rearDormerPolicy: 'Generally acceptable',
        roofLightPolicy: 'Flexible on rear, conservation type on front',
        hipToGableAllowed: true,
        notes: ['Hip to gable widely accepted on semis', 'Match neighbour if they have one'],
      },
      basements: {
        policy: 'acceptable',
        maxDepth: 'Single storey',
        maxCoverage: '50-75%',
        lightWellPolicy: 'Acceptable at rear',
        cmiRequired: false,
        notes: ['Less restricted than inner London'],
      },
      trees: {
        tpoPrevalence: 'medium',
        automaticProtection: true,
        commonProtectedSpecies: ['Oak', 'Cherry', 'Apple'],
        surveyRequirements: 'Standard survey for larger developments',
      },
      parking: {
        cpdZone: false,
        frontGardenParkingPolicy: 'Restricted in conservation area',
        crossoverPolicy: 'Case by case',
        evChargingPolicy: 'Acceptable',
      },
      materials: {
        preferredWallMaterials: ['Red brick', 'Render to match'],
        avoidMaterials: ['uPVC on front'],
        roofMaterials: ['Clay tiles', 'Slate'],
        windowMaterials: ['Timber preferred, good quality uPVC may be acceptable at rear'],
        localSpecialties: ['Red brick with terracotta', 'Bay windows', 'Tile hanging'],
      },
    },
    statistics: {
      avgApprovalRate: 78,
      avgDecisionDays: 48,
      avgAppealSuccessRate: 45,
      mostCommonApplications: ['Loft conversion', 'Rear extension', 'Side extension'],
      monthlyApplicationVolume: 35,
    },
    amenities: {
      nearbySchools: ['Fortismere School', 'Alexandra Park School', 'St James Primary'],
      transportLinks: ['Bus routes', 'East Finchley tube (20 min walk)', 'Highgate tube (20 min walk)'],
      greenSpaces: ['Alexandra Park', 'Highgate Wood', 'Queens Wood'],
      shoppingAreas: ['Muswell Hill Broadway', 'Fortis Green Road'],
    },
    valueImpact: {
      extensionValue: 10,
      loftConversionValue: 12,
      basementValue: 18,
      gardenRoomValue: 6,
    },
  },

  // ========== CROUCH END (N8) ==========
  {
    id: 'crouch-end',
    name: 'Crouch End',
    postcodes: ['N8'],
    borough: 'Haringey',
    character: {
      summary: 'Vibrant Victorian suburb with excellent restaurants, independent shops, and strong community. Popular with families and young professionals.',
      atmosphere: 'Trendy, family-friendly, great food scene. Independent spirit.',
      demographics: 'Young families, creative professionals, media workers.',
      propertyTypes: [
        { type: 'Victorian terrace', percentage: 50, typicalSize: '1200-2000 sq ft', planningConsiderations: ['Conservation varies by street'] },
        { type: 'Victorian semi', percentage: 25, typicalSize: '1500-2500 sq ft', planningConsiderations: ['Larger gardens allow more scope'] },
        { type: 'Edwardian house', percentage: 15, typicalSize: '1400-2200 sq ft', planningConsiderations: ['Often on wider plots'] },
        { type: 'Flat', percentage: 10, typicalSize: '600-1000 sq ft', planningConsiderations: ['Converted or purpose-built'] },
      ],
      averagePropertyValue: 1100000,
      premiumAreas: ['Coolhurst Road', 'Park Road', 'Elder Avenue', 'The Broadway area'],
    },
    planning: {
      strictnessRating: 5,
      conservationAreaCoverage: 40,
      listedBuildingDensity: 'Low',
      article4Coverage: false,
      localPlanPriorities: [
        'Maintain Victorian character',
        'Protect Clock Tower views',
        'Support local businesses',
        'Residential amenity',
      ],
      sensitiveIssues: [
        'Clock Tower visibility',
        'Overshadowing narrow plots',
        'Party wall issues on terraces',
        'Parking pressure',
      ],
      successTips: [
        'Check if in conservation area',
        'Terraces - coordinate with neighbors',
        'Victorian details valued even outside CA',
        'Most extensions achievable',
      ],
    },
    localKnowledge: {
      planningOfficerNotes: [
        'Generally more flexible than Hampstead/Highgate',
        'Outside CA, permitted development works well',
        'Terrace party walls need care',
        'Basements becoming more common',
      ],
      commonRefusalReasons: [
        'Overshadowing neighbours',
        'Harm to amenity',
        'Out of keeping design',
        'Insufficient parking',
      ],
      whatWorksHere: [
        'Loft conversions (very common)',
        'Rear extensions up to 4m',
        'Side return infills',
        'Basements',
        'Garden rooms',
      ],
      whatDoesntWork: [
        'Extensions blocking light to neighbours',
        'Modern designs in conservation area',
        'Excessive bulk',
      ],
      recentTrends: [
        'Lots of loft and basement combinations',
        'Side returns very popular',
        'Garden rooms increasing',
      ],
      localSocieties: [
        {
          name: 'Crouch End Neighbourhood Forum',
          influence: 'medium',
          focusAreas: ['Planning', 'Community', 'Business'],
        },
      ],
      councillorPriorities: ['Parking', 'Business rates', 'School places'],
    },
    specificRules: {
      extensions: {
        rearMaxDepth: 4,
        rearNotes: ['4m single storey generally fine', '3m two storey on larger plots'],
        sideAllowed: true,
        sideNotes: ['Side returns very popular and generally approved'],
        twoStoreyPolicy: 'Acceptable on semis, careful on terraces',
      },
      lofts: {
        dorsmerPolicy: 'liberal',
        frontDormerPolicy: 'Case by case in CA, more flexible outside',
        rearDormerPolicy: 'Generally acceptable',
        roofLightPolicy: 'Flexible',
        hipToGableAllowed: true,
        notes: ['High success rate for loft conversions'],
      },
      basements: {
        policy: 'acceptable',
        maxDepth: 'Single storey',
        maxCoverage: '75%',
        lightWellPolicy: 'Rear acceptable',
        cmiRequired: false,
        notes: ['Popular and generally approved'],
      },
      trees: {
        tpoPrevalence: 'low',
        automaticProtection: true,
        commonProtectedSpecies: ['Various'],
        surveyRequirements: 'Standard requirements',
      },
      parking: {
        cpdZone: true,
        frontGardenParkingPolicy: 'Case by case',
        crossoverPolicy: 'Generally acceptable',
        evChargingPolicy: 'Encouraged',
      },
      materials: {
        preferredWallMaterials: ['Stock brick', 'Red brick', 'Render'],
        avoidMaterials: ['None specifically'],
        roofMaterials: ['Slate', 'Tiles'],
        windowMaterials: ['Timber or uPVC acceptable outside CA'],
        localSpecialties: ['Victorian details', 'Bay windows'],
      },
    },
    statistics: {
      avgApprovalRate: 82,
      avgDecisionDays: 45,
      avgAppealSuccessRate: 50,
      mostCommonApplications: ['Loft conversion', 'Rear extension', 'Side return', 'Basement'],
      monthlyApplicationVolume: 40,
    },
    amenities: {
      nearbySchools: ['Hornsey School for Girls', 'Crouch End Primary'],
      transportLinks: ['Multiple bus routes', 'Crouch Hill Overground', 'Hornsey station'],
      greenSpaces: ['Priory Park', 'Alexandra Park'],
      shoppingAreas: ['Crouch End Broadway', 'Park Road'],
    },
    valueImpact: {
      extensionValue: 8,
      loftConversionValue: 10,
      basementValue: 15,
      gardenRoomValue: 5,
    },
  },
];

// ===========================================
// LOOKUP FUNCTIONS
// ===========================================

export function getAreaIntelligence(id: string): AreaIntelligence | undefined {
  return AREA_INTELLIGENCE.find(area => area.id === id);
}

export function getAreaByPostcode(postcode: string): AreaIntelligence | undefined {
  const district = postcode.toUpperCase().split(' ')[0];
  return AREA_INTELLIGENCE.find(area => 
    area.postcodes.some(p => district.startsWith(p))
  );
}

export function getAreasByBorough(borough: string): AreaIntelligence[] {
  return AREA_INTELLIGENCE.filter(area => 
    area.borough.toLowerCase().includes(borough.toLowerCase())
  );
}

export function getAllAreas(): AreaIntelligence[] {
  return AREA_INTELLIGENCE;
}

export function compareAreas(area1Id: string, area2Id: string): {
  comparison: Record<string, { area1: string | number; area2: string | number }>;
  recommendation: string;
} {
  const area1 = getAreaIntelligence(area1Id);
  const area2 = getAreaIntelligence(area2Id);
  
  if (!area1 || !area2) {
    throw new Error('Area not found');
  }
  
  return {
    comparison: {
      strictness: { area1: area1.planning.strictnessRating, area2: area2.planning.strictnessRating },
      approvalRate: { area1: area1.statistics.avgApprovalRate, area2: area2.statistics.avgApprovalRate },
      avgDecisionDays: { area1: area1.statistics.avgDecisionDays, area2: area2.statistics.avgDecisionDays },
      avgPropertyValue: { area1: area1.character.averagePropertyValue, area2: area2.character.averagePropertyValue },
      conservationCoverage: { area1: area1.planning.conservationAreaCoverage, area2: area2.planning.conservationAreaCoverage },
    },
    recommendation: area1.statistics.avgApprovalRate > area2.statistics.avgApprovalRate
      ? `${area1.name} has a higher approval rate (${area1.statistics.avgApprovalRate}% vs ${area2.statistics.avgApprovalRate}%)`
      : `${area2.name} has a higher approval rate (${area2.statistics.avgApprovalRate}% vs ${area1.statistics.avgApprovalRate}%)`,
  };
}
