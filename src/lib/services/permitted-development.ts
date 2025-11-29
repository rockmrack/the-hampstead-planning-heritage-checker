/**
 * Permitted Development Rights Checker Service
 * 
 * Comprehensive checker for permitted development rights in Camden & Hampstead
 * Covers householder extensions, outbuildings, and common PD categories
 */

// Article 4 Directions in Hampstead area
const ARTICLE_4_AREAS: Record<string, {
  name: string;
  restrictions: string[];
  affectedPD: string[];
}> = {
  'hampstead': {
    name: 'Hampstead Conservation Areas',
    restrictions: [
      'Front roof alterations',
      'Rear dormers in certain areas',
      'Satellite dishes on front/side',
      'Painting of exterior',
      'Changes to front boundaries',
      'Replacement windows on front'
    ],
    affectedPD: ['Class A', 'Class B', 'Class C', 'Class E', 'Class F', 'Class H']
  },
  'hampstead_garden_suburb': {
    name: 'Hampstead Garden Suburb',
    restrictions: [
      'Almost all external alterations',
      'Extensions of any kind',
      'Roof alterations',
      'New outbuildings',
      'Gates, fences, walls',
      'Hard surfacing',
      'Satellite dishes',
      'Solar panels visible from highway'
    ],
    affectedPD: ['Class A', 'Class B', 'Class C', 'Class D', 'Class E', 'Class F', 'Class G', 'Class H']
  },
  'belsize': {
    name: 'Belsize Conservation Area',
    restrictions: [
      'Dormer windows on front elevation',
      'Roof alterations visible from highway',
      'Painting of exterior brickwork'
    ],
    affectedPD: ['Class B', 'Class C']
  },
  'south_hill_park': {
    name: 'South Hill Park Conservation Area',
    restrictions: [
      'Front dormer windows',
      'Cladding',
      'Painting of exterior'
    ],
    affectedPD: ['Class A', 'Class B', 'Class C']
  }
};

// Householder PD Classes (Part 1)
const HOUSEHOLDER_PD: Record<string, {
  name: string;
  description: string;
  conditions: Record<string, string | number | boolean>;
  limitations: string[];
  excludedProperties: string[];
}> = {
  'class_a': {
    name: 'Class A - Rear Extensions',
    description: 'Single storey and two storey rear extensions',
    conditions: {
      maxHeightSingle: 4, // metres
      maxHeightDouble: 3, // metres at eaves
      maxDepthSingleDetached: 8, // metres with prior approval
      maxDepthSingleAttached: 6, // metres with prior approval
      maxDepthSingleNoPrior: 4, // metres without prior approval attached
      maxDepthDouble: 3, // metres
      maxWidthSideExtension: 'half original width',
      setBackFromBoundary: 2, // metres for two storey
      sideExtensionMaxWidth: 'half width of original house'
    },
    limitations: [
      'No more than half the garden area covered by buildings',
      'Extension cannot be higher than existing roof',
      'Materials to be similar appearance',
      'No verandas, balconies or raised platforms',
      'Upper floor windows on side to be obscure glazed',
      'No extension forward of principal elevation'
    ],
    excludedProperties: ['Listed buildings', 'Article 4 properties', 'Flats/maisonettes']
  },
  'class_b': {
    name: 'Class B - Roof Additions',
    description: 'Loft conversions with dormer windows',
    conditions: {
      maxVolume: 40, // cubic metres for terraced
      maxVolumeOther: 50, // cubic metres for detached/semi
      maxHeight: 'existing roof height',
      setBackFromEaves: 0.2, // metres minimum
      noForwardDormer: true
    },
    limitations: [
      'No dormer on front roof slope facing highway',
      'Materials to match existing',
      'No raised platform or balcony',
      'Side-facing windows to be obscure glazed and non-opening below 1.7m'
    ],
    excludedProperties: ['Listed buildings', 'Conservation areas (front dormers)', 'Article 4 areas', 'Flats']
  },
  'class_c': {
    name: 'Class C - Other Roof Alterations',
    description: 'Roof lights, alterations not enlarging roof',
    conditions: {
      maxProjection: 0.15, // metres for roof lights
      noFrontElevation: 'Conservation area only'
    },
    limitations: [
      'Roof lights not to project more than 150mm',
      'In conservation areas, roof lights on front slope must not project'
    ],
    excludedProperties: ['Listed buildings', 'Some Article 4 areas']
  },
  'class_d': {
    name: 'Class D - Porches',
    description: 'Front porches',
    conditions: {
      maxFloorArea: 3, // square metres
      maxHeight: 3, // metres
      distanceFromHighway: 2 // metres minimum
    },
    limitations: [
      'Ground floor only',
      'Must be at least 2m from any boundary with highway'
    ],
    excludedProperties: ['Listed buildings', 'Flats']
  },
  'class_e': {
    name: 'Class E - Outbuildings',
    description: 'Garden buildings, sheds, pools, containers',
    conditions: {
      maxHeight: 2.5, // metres within 2m of boundary
      maxHeightDualPitch: 4, // metres with dual pitch roof
      maxHeightOther: 3, // metres any other roof
      maxFloorArea: 'half garden area',
      noForwardOfPrincipal: true
    },
    limitations: [
      'Not used for residential accommodation',
      'Single storey only',
      'Eaves max 2.5m',
      'Total area of buildings not to exceed 50% of garden',
      'No verandas, balconies, or raised platforms',
      'In conservation areas, outbuildings beyond 20m from house limited'
    ],
    excludedProperties: ['Listed buildings', 'Flats']
  },
  'class_f': {
    name: 'Class F - Hard Surfaces',
    description: 'Driveways and patios',
    conditions: {
      permeable: 'required for front gardens over 5sqm',
      drainageProvision: 'required if impermeable'
    },
    limitations: [
      'Front gardens: must be permeable or drain to lawn/border',
      'No restrictions on rear hard surfacing'
    ],
    excludedProperties: ['Listed buildings', 'Some Article 4 areas']
  },
  'class_g': {
    name: 'Class G - Chimneys/Flues',
    description: 'Chimneys, flues and ventilation systems',
    conditions: {
      maxHeight: 1, // metre above highest part of roof
      noFrontRoofSlope: 'if visible from highway'
    },
    limitations: [
      'Max 1m above highest part of roof',
      'Not on front roof slope if visible from highway (in designated areas)'
    ],
    excludedProperties: ['Listed buildings']
  },
  'class_h': {
    name: 'Class H - Satellite Dishes/Antennas',
    description: 'Antennas and satellite dishes',
    conditions: {
      maxDishSize: 0.9, // metres diameter
      maxDishSize60cm: 0.6, // metres in conservation areas
      noChimney: true,
      noFrontElevation: 'in conservation areas'
    },
    limitations: [
      'Max 1 dish on property',
      'Not on chimney',
      'In conservation areas: max 60cm, not on front/side if visible',
      'Not on building over 15m'
    ],
    excludedProperties: ['Listed buildings', 'Some Article 4 areas']
  }
};

// Part 2 - Minor Operations
const MINOR_OPERATIONS_PD: Record<string, {
  name: string;
  conditions: Record<string, string | number>;
  limitations: string[];
}> = {
  'class_a': {
    name: 'Gates, Fences, Walls',
    conditions: {
      maxHeightAdjHighway: 1, // metres adjacent to highway
      maxHeightElsewhere: 2 // metres
    },
    limitations: [
      'Max 1m if adjacent to highway used by vehicles',
      'Max 2m elsewhere',
      'In conservation areas, demolition may need consent'
    ]
  },
  'class_b': {
    name: 'Access to Highway',
    conditions: {
      forParkingPurposes: 'only in connection with PD use'
    },
    limitations: [
      'Only where required for permitted development',
      'May need highways consent'
    ]
  },
  'class_c': {
    name: 'Painting Exterior',
    conditions: {
      notAdvertisement: 'must not be advertisement'
    },
    limitations: [
      'Not in Article 4 areas where restricted',
      'Listed buildings excluded',
      'Not if would be advertisement'
    ]
  }
};

// Changes of Use PD
const CHANGE_OF_USE_PD: Record<string, {
  from: string;
  to: string;
  conditions: string[];
  priorApproval: boolean;
}> = {
  'class_ma': {
    from: 'Class E (commercial)',
    to: 'Class C3 (dwelling)',
    conditions: [
      'Building must have been E class for 2+ years',
      'Max 1,500 sqm floorspace',
      'Prior approval required for various matters',
      'Cannot be in conservation area (depending on size)',
      '3-year vacancy requirement removed from August 2021'
    ],
    priorApproval: true
  },
  'class_o': {
    from: 'Office (B1a)',
    to: 'Residential (C3)',
    conditions: [
      'Building must have been office for specified period',
      'Prior approval for certain matters',
      'Space standards now apply',
      'Check if in article 4 area'
    ],
    priorApproval: true
  },
  'class_q': {
    from: 'Agricultural building',
    to: 'Residential (C3)',
    conditions: [
      'Building must be agricultural',
      'Max 5 dwellings',
      'Max 865 sqm',
      'Prior approval required'
    ],
    priorApproval: true
  },
  'class_r': {
    from: 'Agricultural building',
    to: 'Flexible commercial use',
    conditions: [
      'Max 500 sqm',
      'Prior approval required'
    ],
    priorApproval: true
  }
};

interface PDCheckRequest {
  address: string;
  proposalType: string;
  proposalDetails: {
    extensionDepth?: number;
    extensionHeight?: number;
    isDoubleStorey?: boolean;
    isSideExtension?: boolean;
    dormerLocation?: 'front' | 'rear' | 'side';
    roofVolume?: number;
    outbuildingHeight?: number;
    outbuildingArea?: number;
    distanceFromBoundary?: number;
    gardenAreaUsed?: number;
    totalGardenArea?: number;
    currentUseClass?: string;
    proposedUseClass?: string;
    floorspace?: number;
  };
  propertyType: 'detached' | 'semi-detached' | 'terraced' | 'flat';
  isListedBuilding?: boolean;
  isConservationArea?: boolean;
  isArticle4?: boolean;
  article4Area?: string;
  hasHadPreviousExtensions?: boolean;
  previousExtensionDetails?: string;
}

interface PDCheckResult {
  address: string;
  proposal: string;
  permitedDevelopment: boolean;
  requiresPriorApproval: boolean;
  requiresPlanningPermission: boolean;
  relevantClasses: Array<{
    class: string;
    name: string;
    applicable: boolean;
    reason: string;
  }>;
  conditionsToMeet: string[];
  limitations: string[];
  exclusions: string[];
  article4Impact: {
    affected: boolean;
    restrictions: string[];
    affectedPD: string[];
  } | null;
  conservationAreaImpact: {
    affected: boolean;
    additionalRestrictions: string[];
  } | null;
  calculatedLimits: Record<string, {
    limit: string | number;
    proposed: string | number;
    compliant: boolean;
  }>;
  recommendations: string[];
  warnings: string[];
  confidenceLevel: string;
}

class PermittedDevelopmentChecker {
  /**
   * Check if proposal is permitted development
   */
  public checkPermittedDevelopment(request: PDCheckRequest): PDCheckResult {
    // First check for fundamental exclusions
    const exclusions = this.checkExclusions(request);
    
    if (exclusions.length > 0 && request.isListedBuilding) {
      return {
        address: request.address,
        proposal: request.proposalType,
        permitedDevelopment: false,
        requiresPriorApproval: false,
        requiresPlanningPermission: true,
        relevantClasses: [],
        conditionsToMeet: [],
        limitations: [],
        exclusions,
        article4Impact: null,
        conservationAreaImpact: null,
        calculatedLimits: {},
        recommendations: ['Submit planning application', 'Listed building consent also required'],
        warnings: ['This is a listed building - permitted development rights are severely restricted'],
        confidenceLevel: 'HIGH'
      };
    }
    
    // Identify relevant PD class
    const relevantClasses = this.identifyRelevantClasses(request);
    
    // Check conditions and limitations
    const conditionsCheck = this.checkConditions(request, relevantClasses);
    
    // Check Article 4
    const article4Impact = this.checkArticle4(request);
    
    // Check conservation area
    const conservationAreaImpact = this.checkConservationArea(request);
    
    // Calculate specific limits
    const calculatedLimits = this.calculateLimits(request);
    
    // Determine overall result
    const overallResult = this.determineOverallResult(
      conditionsCheck,
      article4Impact,
      conservationAreaImpact,
      exclusions
    );
    
    return {
      address: request.address,
      proposal: request.proposalType,
      ...overallResult,
      relevantClasses: relevantClasses.map(rc => ({
        class: rc.class,
        name: rc.name,
        applicable: rc.applicable,
        reason: rc.reason
      })),
      conditionsToMeet: conditionsCheck.conditions,
      limitations: conditionsCheck.limitations,
      exclusions,
      article4Impact,
      conservationAreaImpact,
      calculatedLimits,
      recommendations: this.generateRecommendations(request, overallResult),
      warnings: this.generateWarnings(request, overallResult),
      confidenceLevel: this.assessConfidence(request)
    };
  }

  /**
   * Check fundamental exclusions
   */
  private checkExclusions(request: PDCheckRequest): string[] {
    const exclusions: string[] = [];
    
    if (request.isListedBuilding) {
      exclusions.push('Listed building - most PD rights removed');
    }
    
    if (request.propertyType === 'flat') {
      exclusions.push('Flat/maisonette - most householder PD rights do not apply');
    }
    
    return exclusions;
  }

  /**
   * Identify relevant PD classes
   */
  private identifyRelevantClasses(request: PDCheckRequest): Array<{
    class: string;
    name: string;
    applicable: boolean;
    reason: string;
  }> {
    const classes: Array<{
      class: string;
      name: string;
      applicable: boolean;
      reason: string;
    }> = [];
    
    const proposalLower = request.proposalType.toLowerCase();
    
    // Extension
    if (proposalLower.includes('extension') || proposalLower.includes('rear') || proposalLower.includes('side')) {
      const classA = HOUSEHOLDER_PD['class_a'];
      if (classA) {
        classes.push({
          class: 'Class A',
          name: classA.name,
          applicable: !request.isListedBuilding && request.propertyType !== 'flat',
          reason: request.isListedBuilding 
            ? 'Not applicable - listed building'
            : request.propertyType === 'flat'
              ? 'Not applicable - flat'
              : 'Applicable - rear/side extension rules'
        });
      }
    }
    
    // Loft/dormer
    if (proposalLower.includes('loft') || proposalLower.includes('dormer') || proposalLower.includes('roof')) {
      const classB = HOUSEHOLDER_PD['class_b'];
      if (classB) {
        classes.push({
          class: 'Class B',
          name: classB.name,
          applicable: !request.isListedBuilding && request.propertyType !== 'flat',
          reason: request.isListedBuilding 
            ? 'Not applicable - listed building'
            : 'Applicable - roof additions'
        });
      }
      
      const classC = HOUSEHOLDER_PD['class_c'];
      if (classC) {
        classes.push({
          class: 'Class C',
          name: classC.name,
          applicable: !request.isListedBuilding,
          reason: 'Applicable - roof alterations'
        });
      }
    }
    
    // Porch
    if (proposalLower.includes('porch')) {
      const classD = HOUSEHOLDER_PD['class_d'];
      if (classD) {
        classes.push({
          class: 'Class D',
          name: classD.name,
          applicable: !request.isListedBuilding && request.propertyType !== 'flat',
          reason: 'Applicable - porch rules'
        });
      }
    }
    
    // Outbuilding
    if (proposalLower.includes('outbuilding') || proposalLower.includes('shed') || 
        proposalLower.includes('garage') || proposalLower.includes('summerhouse') ||
        proposalLower.includes('garden building')) {
      const classE = HOUSEHOLDER_PD['class_e'];
      if (classE) {
        classes.push({
          class: 'Class E',
          name: classE.name,
          applicable: !request.isListedBuilding && request.propertyType !== 'flat',
          reason: 'Applicable - outbuilding rules'
        });
      }
    }
    
    // Hard surfacing
    if (proposalLower.includes('driveway') || proposalLower.includes('patio') || 
        proposalLower.includes('hard') || proposalLower.includes('paving')) {
      const classF = HOUSEHOLDER_PD['class_f'];
      if (classF) {
        classes.push({
          class: 'Class F',
          name: classF.name,
          applicable: !request.isListedBuilding,
          reason: 'Applicable - hard surfacing rules'
        });
      }
    }
    
    // Satellite dish
    if (proposalLower.includes('dish') || proposalLower.includes('satellite') || 
        proposalLower.includes('antenna')) {
      const classH = HOUSEHOLDER_PD['class_h'];
      if (classH) {
        classes.push({
          class: 'Class H',
          name: classH.name,
          applicable: !request.isListedBuilding,
          reason: 'Applicable - antenna/satellite rules'
        });
      }
    }
    
    // Change of use
    if (proposalLower.includes('change of use') || proposalLower.includes('convert')) {
      const currentUse = request.proposalDetails.currentUseClass;
      const proposedUse = request.proposalDetails.proposedUseClass;
      
      if (currentUse && proposedUse) {
        const changeClass = this.identifyChangeOfUseClass(currentUse, proposedUse);
        if (changeClass) {
          classes.push(changeClass);
        }
      }
    }
    
    return classes;
  }

  /**
   * Identify change of use PD class
   */
  private identifyChangeOfUseClass(
    currentUse: string,
    proposedUse: string
  ): {
    class: string;
    name: string;
    applicable: boolean;
    reason: string;
  } | null {
    const current = currentUse.toLowerCase();
    const proposed = proposedUse.toLowerCase();
    
    if ((current.includes('e') || current.includes('commercial')) && 
        (proposed.includes('c3') || proposed.includes('residential'))) {
      return {
        class: 'Class MA',
        name: 'Commercial to Residential',
        applicable: true,
        reason: 'Class E to C3 conversion - prior approval required'
      };
    }
    
    if ((current.includes('office') || current.includes('b1')) && 
        (proposed.includes('c3') || proposed.includes('residential'))) {
      return {
        class: 'Class O',
        name: 'Office to Residential',
        applicable: true,
        reason: 'Office to residential - prior approval required'
      };
    }
    
    return null;
  }

  /**
   * Check conditions and limitations
   */
  private checkConditions(
    request: PDCheckRequest,
    relevantClasses: Array<{ class: string; applicable: boolean }>
  ): {
    conditions: string[];
    limitations: string[];
    conditionsMet: boolean;
  } {
    const conditions: string[] = [];
    const limitations: string[] = [];
    let conditionsMet = true;
    
    const applicableClasses = relevantClasses.filter(c => c.applicable);
    
    for (const rc of applicableClasses) {
      const classKey = rc.class.toLowerCase().replace(' ', '_');
      const pdClass = HOUSEHOLDER_PD[classKey];
      
      if (pdClass) {
        // Add relevant conditions based on proposal
        if (classKey === 'class_a' && request.proposalDetails.extensionDepth) {
          const maxDepth = request.propertyType === 'detached' ? 8 : 6;
          if (request.proposalDetails.extensionDepth > maxDepth) {
            conditions.push(`Extension depth exceeds maximum ${maxDepth}m for ${request.propertyType} property`);
            conditionsMet = false;
          } else if (request.proposalDetails.extensionDepth > 4 && request.propertyType !== 'detached') {
            conditions.push('Prior approval required for extensions over 4m (attached properties)');
          }
        }
        
        if (classKey === 'class_b' && request.proposalDetails.dormerLocation === 'front') {
          if (request.isConservationArea) {
            limitations.push('Front dormers not permitted in conservation areas');
            conditionsMet = false;
          }
        }
        
        if (classKey === 'class_e' && request.proposalDetails.outbuildingHeight) {
          const maxHeight = request.proposalDetails.distanceFromBoundary !== undefined && 
                           request.proposalDetails.distanceFromBoundary < 2 ? 2.5 : 4;
          if (request.proposalDetails.outbuildingHeight > maxHeight) {
            conditions.push(`Outbuilding height exceeds maximum ${maxHeight}m`);
            conditionsMet = false;
          }
        }
        
        // Add class limitations
        limitations.push(...pdClass.limitations);
      }
    }
    
    return { conditions, limitations, conditionsMet };
  }

  /**
   * Check Article 4 impact
   */
  private checkArticle4(request: PDCheckRequest): {
    affected: boolean;
    restrictions: string[];
    affectedPD: string[];
  } | null {
    if (!request.isArticle4 && !request.article4Area) {
      // Check address for likely Article 4 area
      const address = request.address.toLowerCase();
      let areaKey = '';
      
      if (address.includes('hampstead garden suburb') || address.includes('hgs')) {
        areaKey = 'hampstead_garden_suburb';
      } else if (address.includes('hampstead')) {
        areaKey = 'hampstead';
      } else if (address.includes('belsize')) {
        areaKey = 'belsize';
      } else if (address.includes('south hill park')) {
        areaKey = 'south_hill_park';
      }
      
      if (areaKey) {
        const article4Info = ARTICLE_4_AREAS[areaKey];
        if (article4Info) {
          return {
            affected: true,
            restrictions: article4Info.restrictions,
            affectedPD: article4Info.affectedPD
          };
        }
      }
      
      return null;
    }
    
    const areaKey = request.article4Area || 'hampstead';
    const article4Info = ARTICLE_4_AREAS[areaKey];
    
    if (article4Info) {
      return {
        affected: true,
        restrictions: article4Info.restrictions,
        affectedPD: article4Info.affectedPD
      };
    }
    
    return null;
  }

  /**
   * Check conservation area impact
   */
  private checkConservationArea(request: PDCheckRequest): {
    affected: boolean;
    additionalRestrictions: string[];
  } | null {
    if (!request.isConservationArea) {
      return null;
    }
    
    return {
      affected: true,
      additionalRestrictions: [
        'Front dormers not permitted development',
        'Demolition may require consent',
        'Satellite dishes: max 60cm, not on front/side visible from highway',
        'Cladding not permitted',
        'Roof materials should match existing',
        'Additional care with materials and details'
      ]
    };
  }

  /**
   * Calculate specific limits
   */
  private calculateLimits(request: PDCheckRequest): Record<string, {
    limit: string | number;
    proposed: string | number;
    compliant: boolean;
  }> {
    const limits: Record<string, {
      limit: string | number;
      proposed: string | number;
      compliant: boolean;
    }> = {};
    
    // Extension depth
    if (request.proposalDetails.extensionDepth) {
      const maxDepth = request.proposalDetails.isDoubleStorey ? 3 :
                      request.propertyType === 'detached' ? 8 : 6;
      limits['extensionDepth'] = {
        limit: `${maxDepth}m maximum`,
        proposed: `${request.proposalDetails.extensionDepth}m`,
        compliant: request.proposalDetails.extensionDepth <= maxDepth
      };
    }
    
    // Extension height
    if (request.proposalDetails.extensionHeight) {
      const maxHeight = request.proposalDetails.isDoubleStorey ? 3 : 4;
      limits['extensionHeight'] = {
        limit: `${maxHeight}m at eaves`,
        proposed: `${request.proposalDetails.extensionHeight}m`,
        compliant: request.proposalDetails.extensionHeight <= maxHeight
      };
    }
    
    // Outbuilding height
    if (request.proposalDetails.outbuildingHeight) {
      const distance = request.proposalDetails.distanceFromBoundary || 0;
      const maxHeight = distance < 2 ? 2.5 : 4;
      limits['outbuildingHeight'] = {
        limit: `${maxHeight}m maximum`,
        proposed: `${request.proposalDetails.outbuildingHeight}m`,
        compliant: request.proposalDetails.outbuildingHeight <= maxHeight
      };
    }
    
    // Garden coverage
    if (request.proposalDetails.gardenAreaUsed && request.proposalDetails.totalGardenArea) {
      const maxCoverage = request.proposalDetails.totalGardenArea * 0.5;
      limits['gardenCoverage'] = {
        limit: `50% (${maxCoverage}sqm)`,
        proposed: `${request.proposalDetails.gardenAreaUsed}sqm`,
        compliant: request.proposalDetails.gardenAreaUsed <= maxCoverage
      };
    }
    
    // Roof volume for loft
    if (request.proposalDetails.roofVolume) {
      const maxVolume = request.propertyType === 'terraced' ? 40 : 50;
      limits['roofVolume'] = {
        limit: `${maxVolume} cubic metres`,
        proposed: `${request.proposalDetails.roofVolume} cubic metres`,
        compliant: request.proposalDetails.roofVolume <= maxVolume
      };
    }
    
    return limits;
  }

  /**
   * Determine overall result
   */
  private determineOverallResult(
    conditionsCheck: { conditionsMet: boolean },
    article4Impact: { affected: boolean } | null,
    conservationAreaImpact: { affected: boolean } | null,
    exclusions: string[]
  ): {
    permitedDevelopment: boolean;
    requiresPriorApproval: boolean;
    requiresPlanningPermission: boolean;
  } {
    // Exclusions override everything
    if (exclusions.some(e => e.includes('listed building'))) {
      return {
        permitedDevelopment: false,
        requiresPriorApproval: false,
        requiresPlanningPermission: true
      };
    }
    
    // Check conditions
    if (!conditionsCheck.conditionsMet) {
      return {
        permitedDevelopment: false,
        requiresPriorApproval: false,
        requiresPlanningPermission: true
      };
    }
    
    // Article 4 may remove PD
    if (article4Impact?.affected) {
      return {
        permitedDevelopment: false,
        requiresPriorApproval: false,
        requiresPlanningPermission: true
      };
    }
    
    // Default - PD applies
    return {
      permitedDevelopment: true,
      requiresPriorApproval: false,
      requiresPlanningPermission: false
    };
  }

  /**
   * Generate recommendations
   */
  private generateRecommendations(
    request: PDCheckRequest,
    result: { permitedDevelopment: boolean; requiresPlanningPermission: boolean }
  ): string[] {
    const recommendations: string[] = [];
    
    if (result.permitedDevelopment) {
      recommendations.push('Proceed with works under permitted development rights');
      recommendations.push('Keep records showing compliance with PD conditions');
      recommendations.push('Consider applying for Certificate of Lawfulness for certainty');
    } else if (result.requiresPlanningPermission) {
      recommendations.push('Submit full planning application');
      recommendations.push('Consider pre-application advice');
    }
    
    if (request.isConservationArea) {
      recommendations.push('Use materials that match existing and local character');
      recommendations.push('Consider impact on conservation area character');
    }
    
    if (request.hasHadPreviousExtensions) {
      recommendations.push('Account for previous extensions when calculating limits');
      recommendations.push('Total additions must remain within PD limits');
    }
    
    return recommendations;
  }

  /**
   * Generate warnings
   */
  private generateWarnings(
    request: PDCheckRequest,
    result: { permitedDevelopment: boolean }
  ): string[] {
    const warnings: string[] = [];
    
    if (request.isArticle4) {
      warnings.push('Article 4 Direction in force - check specific restrictions');
    }
    
    if (request.isConservationArea) {
      warnings.push('Conservation area - additional restrictions apply');
    }
    
    if (request.hasHadPreviousExtensions) {
      warnings.push('Previous extensions reduce remaining PD allowance');
    }
    
    if (!result.permitedDevelopment) {
      warnings.push('Planning permission is required - do not start works without approval');
    }
    
    return warnings;
  }

  /**
   * Assess confidence level
   */
  private assessConfidence(request: PDCheckRequest): string {
    if (request.isListedBuilding) {
      return 'HIGH'; // Clear that PD doesn't apply
    }
    
    if (request.isArticle4 && !request.article4Area) {
      return 'MEDIUM'; // Unknown specific Article 4 restrictions
    }
    
    if (!request.proposalDetails.extensionDepth && !request.proposalDetails.outbuildingHeight) {
      return 'LOW'; // Insufficient detail
    }
    
    return 'MEDIUM';
  }

  /**
   * Get PD class information
   */
  public getPDClassInfo(classKey: string): typeof HOUSEHOLDER_PD[keyof typeof HOUSEHOLDER_PD] | null {
    return HOUSEHOLDER_PD[classKey] || null;
  }

  /**
   * Get all PD classes
   */
  public getAllPDClasses(): typeof HOUSEHOLDER_PD {
    return HOUSEHOLDER_PD;
  }

  /**
   * Get Article 4 areas
   */
  public getArticle4Areas(): typeof ARTICLE_4_AREAS {
    return ARTICLE_4_AREAS;
  }

  /**
   * Get change of use PD
   */
  public getChangeOfUsePD(): typeof CHANGE_OF_USE_PD {
    return CHANGE_OF_USE_PD;
  }
}

export default PermittedDevelopmentChecker;
