/**
 * Boundary and Legal Service
 * Property boundaries, Party Wall Act, and legal considerations
 */

// Types
export type BoundaryType = 'fence' | 'wall' | 'hedge' | 'undefined' | 'shared';
export type OwnershipStatus = 'owned' | 'shared' | 'neighbour' | 'unknown';
export type PartyWallNoticeType = 'line_of_junction' | 'section_3' | 'section_6' | 'combined';

export interface BoundaryAssessment {
  boundary: 'front' | 'rear' | 'left' | 'right';
  type: BoundaryType;
  ownership: OwnershipStatus;
  length: number; // meters
  height: number; // meters
  condition: 'good' | 'fair' | 'poor';
  restrictions: string[];
  developmentConsiderations: string[];
}

export interface PartyWallRequirement {
  required: boolean;
  noticeType: PartyWallNoticeType | null;
  noticePeriod: number; // days
  affectedProperties: string[];
  estimatedSurveyorCost: { min: number; max: number };
  timeline: string;
  process: string[];
}

export interface RightOfLightAssessment {
  atRisk: boolean;
  affectedWindows: number;
  riskLevel: 'low' | 'medium' | 'high';
  recommendations: string[];
  compensation?: { min: number; max: number };
}

export interface EasementCheck {
  type: string;
  exists: boolean;
  implications: string[];
  restrictions: string[];
}

export interface LegalConsiderations {
  partyWall: PartyWallRequirement;
  rightOfLight: RightOfLightAssessment;
  boundaries: BoundaryAssessment[];
  easements: EasementCheck[];
  covenants: { type: string; restriction: string; enforceable: boolean }[];
  recommendations: string[];
}

// Party Wall notice periods and requirements
const PARTY_WALL_REQUIREMENTS: Record<PartyWallNoticeType, {
  noticePeriod: number;
  description: string;
  applicableWorks: string[];
}> = {
  line_of_junction: {
    noticePeriod: 30,
    description: 'Building on or at the boundary',
    applicableWorks: [
      'New wall on the line of junction',
      'Foundation straddling boundary',
    ],
  },
  section_3: {
    noticePeriod: 60,
    description: 'Works to an existing party wall or structure',
    applicableWorks: [
      'Cutting into party wall',
      'Inserting steel beams',
      'Raising or lowering party wall',
      'Demolition and rebuilding',
    ],
  },
  section_6: {
    noticePeriod: 30,
    description: 'Excavation near neighbouring buildings',
    applicableWorks: [
      'Excavation within 3m if deeper than neighbour foundations',
      'Excavation within 6m if cutting 45° line from neighbour foundations',
      'Basement construction',
      'Underpinning works',
    ],
  },
  combined: {
    noticePeriod: 60,
    description: 'Multiple notice types combined',
    applicableWorks: [
      'Complex projects involving party wall and excavation',
      'Basement with party wall alterations',
    ],
  },
};

// Common covenants in Hampstead area
const COMMON_COVENANTS = [
  {
    type: 'Building Line',
    restriction: 'No building forward of established building line',
    enforceable: true,
    areas: ['NW3', 'NW11'],
  },
  {
    type: 'Height Restriction',
    restriction: 'Maximum height to ridge',
    enforceable: true,
    areas: ['NW3', 'N6'],
  },
  {
    type: 'Use Restriction',
    restriction: 'Residential use only',
    enforceable: true,
    areas: ['NW3', 'NW6', 'N6'],
  },
  {
    type: 'Materials',
    restriction: 'External materials to match original',
    enforceable: true,
    areas: ['NW3'],
  },
];

// Common easements
const COMMON_EASEMENTS = [
  { type: 'Right of Way', description: 'Access over property for neighbouring land' },
  { type: 'Drainage', description: 'Right to drain through neighbouring land' },
  { type: 'Services', description: 'Right to maintain utilities crossing property' },
  { type: 'Light', description: 'Prescriptive right to light through long use' },
];

export class BoundaryLegalService {
  /**
   * Assess Party Wall Act requirements
   */
  assessPartyWallRequirements(
    developmentType: string,
    isTerraced: boolean,
    isSemiDetached: boolean,
    hasBasement: boolean,
    excavationDepth?: number
  ): PartyWallRequirement {
    const developmentLower = developmentType.toLowerCase();
    const affectedProperties: string[] = [];
    let noticeType: PartyWallNoticeType | null = null;
    const process: string[] = [];
    
    // Determine if Party Wall applies
    if (!isTerraced && !isSemiDetached && !hasBasement) {
      return {
        required: false,
        noticeType: null,
        noticePeriod: 0,
        affectedProperties: [],
        estimatedSurveyorCost: { min: 0, max: 0 },
        timeline: 'N/A',
        process: ['No Party Wall Act notices required for detached property'],
      };
    }
    
    // Works to party structure
    if (developmentLower.includes('extension') || developmentLower.includes('loft')) {
      if (isTerraced) {
        affectedProperties.push('Left neighbour', 'Right neighbour');
        noticeType = 'section_3';
      } else if (isSemiDetached) {
        affectedProperties.push('Attached neighbour');
        noticeType = 'section_3';
      }
    }
    
    // Basement/excavation works
    if (hasBasement || (excavationDepth && excavationDepth > 1)) {
      if (noticeType === 'section_3') {
        noticeType = 'combined';
      } else {
        noticeType = 'section_6';
      }
      
      if (isTerraced) {
        if (!affectedProperties.includes('Left neighbour')) affectedProperties.push('Left neighbour');
        if (!affectedProperties.includes('Right neighbour')) affectedProperties.push('Right neighbour');
      } else if (isSemiDetached) {
        if (!affectedProperties.includes('Attached neighbour')) affectedProperties.push('Attached neighbour');
      }
      
      // Section 6 can affect properties up to 6m away
      affectedProperties.push('Rear neighbour (if within 6m)');
    }
    
    if (!noticeType) {
      return {
        required: false,
        noticeType: null,
        noticePeriod: 0,
        affectedProperties: [],
        estimatedSurveyorCost: { min: 0, max: 0 },
        timeline: 'N/A',
        process: ['No Party Wall Act notices appear to be required'],
      };
    }
    
    const requirements = PARTY_WALL_REQUIREMENTS[noticeType];
    
    // Build process steps
    process.push('Appoint party wall surveyor to prepare notices');
    process.push(`Serve ${noticeType.replace(/_/g, ' ')} notice on affected neighbours`);
    process.push(`Wait ${requirements.noticePeriod} days notice period`);
    process.push('Neighbour responds: consent, dissent, or no response');
    process.push('If dissent: agree surveyor or appoint separate surveyors');
    process.push('Surveyors prepare schedule of condition');
    process.push('Award issued setting out works and protections');
    process.push('Works proceed in accordance with award');
    
    // Cost estimate based on complexity
    let costMin = 800;
    let costMax = 1500;
    if (noticeType === 'section_6' || noticeType === 'combined') {
      costMin = 1500;
      costMax = 3000;
    }
    // Multiply by number of affected properties
    costMin *= affectedProperties.filter(p => !p.includes('if within')).length || 1;
    costMax *= affectedProperties.filter(p => !p.includes('if within')).length || 1;
    
    return {
      required: true,
      noticeType,
      noticePeriod: requirements.noticePeriod,
      affectedProperties,
      estimatedSurveyorCost: { min: costMin, max: costMax },
      timeline: `${requirements.noticePeriod} days minimum + surveyor time (typically 4-8 weeks total)`,
      process,
    };
  }

  /**
   * Assess right of light implications
   */
  assessRightOfLight(
    developmentType: string,
    extensionHeight: number,
    distanceToNeighbour: number,
    neighbourWindowCount: number
  ): RightOfLightAssessment {
    // Simple assessment based on 45° rule
    const criticalDistance = extensionHeight; // at 45°, distance equals height
    let riskLevel: 'low' | 'medium' | 'high' = 'low';
    let atRisk = false;
    let affectedWindows = 0;
    const recommendations: string[] = [];
    
    if (distanceToNeighbour < criticalDistance) {
      atRisk = true;
      
      // Estimate affected windows
      const overlapRatio = (criticalDistance - distanceToNeighbour) / criticalDistance;
      affectedWindows = Math.ceil(neighbourWindowCount * overlapRatio);
      
      if (overlapRatio > 0.5 || affectedWindows > 3) {
        riskLevel = 'high';
        recommendations.push('Commission professional right of light survey');
        recommendations.push('Consider design modifications to reduce impact');
        recommendations.push('Budget for potential compensation or insurance');
      } else if (overlapRatio > 0.25 || affectedWindows > 1) {
        riskLevel = 'medium';
        recommendations.push('Consider right of light assessment');
        recommendations.push('Engage with neighbours early');
      } else {
        riskLevel = 'low';
        recommendations.push('Monitor situation but low risk');
      }
    } else {
      recommendations.push('Development appears to comply with 45° rule');
      recommendations.push('Formal assessment not essential but recommended for certainty');
    }
    
    // Compensation estimate for high-risk situations
    let compensation: { min: number; max: number } | undefined;
    if (riskLevel === 'high') {
      compensation = {
        min: affectedWindows * 5000,
        max: affectedWindows * 15000,
      };
    } else if (riskLevel === 'medium') {
      compensation = {
        min: affectedWindows * 2000,
        max: affectedWindows * 8000,
      };
    }
    
    return {
      atRisk,
      affectedWindows,
      riskLevel,
      recommendations,
      compensation,
    };
  }

  /**
   * Get boundary assessment template
   */
  assessBoundaries(propertyType: string, plotWidth: number, plotDepth: number): BoundaryAssessment[] {
    const boundaries: BoundaryAssessment[] = [];
    const isTerraced = propertyType === 'terraced';
    const isSemiDetached = propertyType === 'semi_detached';
    
    // Front boundary
    boundaries.push({
      boundary: 'front',
      type: 'wall',
      ownership: 'owned',
      length: plotWidth,
      height: 1.0,
      condition: 'good',
      restrictions: [
        'Front boundary treatments often subject to planning controls',
        'Conservation area may require planning permission for changes',
        'Maximum height typically 1m adjacent to highway',
      ],
      developmentConsiderations: [
        'Visibility splay requirements',
        'Historic boundary treatment preservation',
      ],
    });
    
    // Rear boundary
    boundaries.push({
      boundary: 'rear',
      type: 'fence',
      ownership: 'owned',
      length: plotWidth,
      height: 1.8,
      condition: 'fair',
      restrictions: [
        'Maximum 2m height without planning permission',
        'Check deeds for ownership responsibility',
      ],
      developmentConsiderations: [
        'Distance to boundary for extensions',
        'Overlooking considerations',
      ],
    });
    
    // Left boundary
    boundaries.push({
      boundary: 'left',
      type: isTerraced || isSemiDetached ? 'shared' : 'fence',
      ownership: isTerraced || isSemiDetached ? 'shared' : 'unknown',
      length: plotDepth,
      height: isTerraced || isSemiDetached ? 0 : 1.8,
      condition: 'good',
      restrictions: isTerraced || isSemiDetached 
        ? ['Party Wall Act applies to shared wall', 'Access rights may be limited']
        : ['Check deeds for ownership', 'May be T-marked boundary'],
      developmentConsiderations: isTerraced || isSemiDetached
        ? ['Party wall notices required for works', 'Structural survey of party wall']
        : ['1m setback typically advisable', 'Consider right of light'],
    });
    
    // Right boundary
    boundaries.push({
      boundary: 'right',
      type: isTerraced ? 'shared' : 'fence',
      ownership: isTerraced ? 'shared' : 'unknown',
      length: plotDepth,
      height: isTerraced ? 0 : 1.8,
      condition: 'good',
      restrictions: isTerraced
        ? ['Party Wall Act applies', 'Shared structural wall']
        : ['Check title deeds', 'Existing agreements may apply'],
      developmentConsiderations: isTerraced
        ? ['Party wall surveyor needed', 'Schedule of condition required']
        : ['Consider relationship with neighbour', 'Access for maintenance'],
    });
    
    return boundaries;
  }

  /**
   * Check for common restrictive covenants
   */
  checkCovenants(postcode: string): { type: string; restriction: string; enforceable: boolean }[] {
    const areaMatch = postcode.match(/^(NW\d{1,2}|N\d{1,2})/i);
    const area = areaMatch && areaMatch[1] ? areaMatch[1].toUpperCase() : '';
    
    const applicableCovenants = COMMON_COVENANTS.filter(c => c.areas.includes(area));
    
    return applicableCovenants.map(c => ({
      type: c.type,
      restriction: c.restriction,
      enforceable: c.enforceable,
    }));
  }

  /**
   * Get common easements to check
   */
  getEasementChecklist(): EasementCheck[] {
    return COMMON_EASEMENTS.map(e => ({
      type: e.type,
      exists: false, // To be verified from title
      implications: [`Check title for ${e.type.toLowerCase()} easements`],
      restrictions: [`May restrict development if ${e.type.toLowerCase()} exists`],
    }));
  }

  /**
   * Generate comprehensive legal checklist
   */
  generateLegalChecklist(
    propertyType: string,
    developmentType: string,
    postcode: string
  ): {
    category: string;
    items: { item: string; priority: 'essential' | 'recommended' | 'optional' }[];
  }[] {
    const checklist: {
      category: string;
      items: { item: string; priority: 'essential' | 'recommended' | 'optional' }[];
    }[] = [];
    
    const isAttached = propertyType === 'terraced' || propertyType === 'semi_detached';
    const hasBasement = developmentType.toLowerCase().includes('basement');
    
    // Title and ownership
    checklist.push({
      category: 'Title and Ownership',
      items: [
        { item: 'Obtain up-to-date title documents from Land Registry', priority: 'essential' },
        { item: 'Review title plan for boundary positions', priority: 'essential' },
        { item: 'Check for restrictive covenants', priority: 'essential' },
        { item: 'Verify ownership of boundaries (T-marks)', priority: 'recommended' },
        { item: 'Review any existing easements', priority: 'essential' },
      ],
    });
    
    // Party Wall
    if (isAttached || hasBasement) {
      checklist.push({
        category: 'Party Wall Act',
        items: [
          { item: 'Identify adjoining owners', priority: 'essential' },
          { item: 'Appoint party wall surveyor', priority: 'essential' },
          { item: 'Serve appropriate notices', priority: 'essential' },
          { item: 'Allow required notice period', priority: 'essential' },
          { item: 'Prepare schedule of condition', priority: 'essential' },
          { item: 'Obtain party wall award before works', priority: 'essential' },
        ],
      });
    }
    
    // Rights of light
    checklist.push({
      category: 'Rights of Light',
      items: [
        { item: 'Assess impact on neighbouring windows', priority: 'recommended' },
        { item: 'Consider commissioning ROL survey', priority: hasBasement ? 'recommended' : 'optional' },
        { item: 'Review historic building positions', priority: 'optional' },
        { item: 'Consider indemnity insurance', priority: 'optional' },
      ],
    });
    
    // Access and boundaries
    checklist.push({
      category: 'Access and Boundaries',
      items: [
        { item: 'Confirm site access arrangements', priority: 'essential' },
        { item: 'Agree scaffolding licence if needed', priority: 'recommended' },
        { item: 'Check for rights of way', priority: 'essential' },
        { item: 'Document existing boundary positions', priority: 'recommended' },
      ],
    });
    
    return checklist;
  }
}

export const boundaryLegalService = new BoundaryLegalService();
