/**
 * Design Guidance Service
 * 
 * Provides intelligent design guidance based on location,
 * heritage status, and project type to maximize approval chances.
 */

// Types
interface DesignGuidance {
  projectType: string;
  location: string;
  overallScore: number;
  guidelines: Guideline[];
  materials: MaterialGuidance;
  dimensions: DimensionGuidance;
  doAndDont: DoAndDont;
  precedentAdvice: string[];
  keyConsiderations: string[];
}

interface Guideline {
  category: string;
  title: string;
  description: string;
  importance: 'critical' | 'high' | 'medium' | 'low';
  applies: boolean;
  source: string;
}

interface MaterialGuidance {
  recommended: MaterialRecommendation[];
  avoid: string[];
  notes: string[];
}

interface MaterialRecommendation {
  material: string;
  use: string;
  approvalLikelihood: 'high' | 'medium' | 'low';
  notes?: string;
}

interface DimensionGuidance {
  maxDepth?: { value: number; unit: string; notes: string };
  maxHeight?: { value: number; unit: string; notes: string };
  maxWidth?: { value: number; unit: string; notes: string };
  setbacks?: Array<{ type: string; value: number; unit: string; notes: string }>;
  coverage?: { maxPercent: number; notes: string };
}

interface DoAndDont {
  do: string[];
  dont: string[];
}

interface GuidanceContext {
  projectType: string;
  postcode: string;
  isConservationArea: boolean;
  isListedBuilding: boolean;
  listingGrade?: string;
  hasArticle4: boolean;
  propertyType?: 'terraced' | 'semi-detached' | 'detached' | 'flat' | 'other';
  propertyAge?: string;
  streetCharacter?: string;
}

// Conservation area design principles
const CA_DESIGN_PRINCIPLES = {
  materials: {
    preferred: [
      { material: 'Natural slate', use: 'Roofing', approvalLikelihood: 'high' as const, notes: 'Matches historic character' },
      { material: 'Clay tiles', use: 'Roofing', approvalLikelihood: 'high' as const, notes: 'Traditional option' },
      { material: 'Stock brick', use: 'Walls', approvalLikelihood: 'high' as const, notes: 'Should match existing' },
      { material: 'Timber windows', use: 'Fenestration', approvalLikelihood: 'high' as const, notes: 'Painted softwood or hardwood' },
      { material: 'Painted timber doors', use: 'Entrances', approvalLikelihood: 'high' as const },
      { material: 'Lead', use: 'Flashings and flat roofs', approvalLikelihood: 'high' as const },
      { material: 'Zinc', use: 'Flat roof covering', approvalLikelihood: 'medium' as const, notes: 'Modern alternative to lead' },
      { material: 'Cast iron', use: 'Rainwater goods', approvalLikelihood: 'high' as const },
      { material: 'Render', use: 'Walls', approvalLikelihood: 'medium' as const, notes: 'Must match existing if present' }
    ],
    avoid: [
      'uPVC windows and doors',
      'Concrete roof tiles',
      'Artificial slate',
      'Plastic rainwater goods',
      'Aluminium windows (unless slim profile)',
      'Large format glazing on front elevations',
      'Metal cladding',
      'Composite decking in visible areas'
    ]
  },
  
  extensions: {
    general: [
      'Extensions should be subordinate to the main building',
      'Roof forms should relate to the existing building',
      'Window proportions should match or complement existing',
      'Set back from principal elevation is usually required',
      'Party wall gaps should be maintained'
    ],
    rear: [
      'Single storey extensions more likely to be approved',
      'Flat roofs acceptable for single storey',
      'Pitched roofs often required for double storey',
      'Consider impact on neighboring light'
    ],
    side: [
      'Must not breach the building line',
      'Set back from front elevation typically required',
      'Maintain gaps between properties where characteristic',
      'Roof should be lower than main ridge'
    ]
  },
  
  lofts: {
    dormers: [
      'Rear dormers only in most cases',
      'Set back from eaves and party walls',
      'Set in from edges of roof slope',
      'Box dormers rarely acceptable on traditional properties',
      'Conservation-style rooflights on front elevation'
    ],
    rooflights: [
      'Flush-fitting conservation rooflights required',
      'Centre-pivot rather than top-hung preferred',
      'Match size and proportion of existing windows below',
      'Symmetrical arrangement preferred'
    ]
  }
};

// Listed building specific guidance
const LISTED_BUILDING_PRINCIPLES = {
  general: [
    'Minimal intervention is key principle',
    'Reversibility preferred where possible',
    'Like-for-like repairs do not need consent',
    'Internal works need Listed Building Consent',
    'Historic fabric should be retained'
  ],
  
  materials: {
    requirements: [
      'Match existing materials exactly',
      'Lime mortar for repointing, not cement',
      'Traditional joinery techniques',
      'Salvaged materials may be required',
      'Specialist conservation products only'
    ],
    forbidden: [
      'Cement-based mortars',
      'uPVC in any form',
      'Non-breathable paints/coatings',
      'Modern sealants on historic fabric',
      'Spray foam insulation'
    ]
  },
  
  grades: {
    'I': {
      scrutiny: 'highest',
      notes: 'Historic England will be consulted. Expect detailed scrutiny. Changes must be of highest quality.',
      approvalDifficulty: 'very high'
    },
    'II*': {
      scrutiny: 'very high',
      notes: 'Historic England consultation required. Strong justification needed for any changes.',
      approvalDifficulty: 'high'
    },
    'II': {
      scrutiny: 'high',
      notes: 'Local authority determination with conservation officer input.',
      approvalDifficulty: 'medium-high'
    }
  }
};

// Project type specific dimensions
const PROJECT_DIMENSIONS = {
  'rear-extension': {
    conservationArea: {
      singleStorey: { maxDepth: 3, maxHeight: 3, notes: 'Reduced from normal PD rights' },
      doubleStorey: { maxDepth: 2.5, maxHeight: 'eaves', notes: 'Must be subordinate' }
    },
    standard: {
      singleStorey: { maxDepth: 6, maxHeight: 4, notes: 'PD rights may apply' },
      doubleStorey: { maxDepth: 3, maxHeight: 'eaves', notes: 'Subject to roof matching' }
    }
  },
  'side-extension': {
    general: {
      width: '50% of original frontage max',
      setback: '1m from front elevation',
      height: 'Lower than main ridge',
      notes: 'Gaps between houses must be maintained if characteristic'
    }
  },
  'loft-conversion': {
    dormer: {
      setbackFromEaves: '0.5m minimum',
      setbackFromPartyWall: '0.2m minimum',
      maxWidth: '50% of roof width',
      maxHeight: 'Below existing ridge',
      notes: 'Rear only in conservation areas'
    },
    rooflight: {
      maxWidth: 'To match windows below',
      maxPerSlope: 3,
      notes: 'Conservation-style required in CA'
    }
  },
  'basement': {
    camden: {
      maxStoreys: 1,
      maxGardenCoverage: '50%',
      lightwellSetback: '1.5m from boundary',
      notes: 'Camden basement policy CPG4 applies'
    }
  }
} as Record<string, Record<string, Record<string, unknown>>>;

class DesignGuidanceService {
  
  /**
   * Get comprehensive design guidance
   */
  getGuidance(context: GuidanceContext): DesignGuidance {
    const guidelines = this.buildGuidelines(context);
    const materials = this.getMaterialGuidance(context);
    const dimensions = this.getDimensionGuidance(context);
    const doAndDont = this.getDoAndDont(context);
    const precedentAdvice = this.getPrecedentAdvice(context);
    const keyConsiderations = this.getKeyConsiderations(context);
    
    // Calculate overall score based on how favorable the context is
    const overallScore = this.calculateApprovalScore(context);
    
    return {
      projectType: context.projectType,
      location: context.postcode,
      overallScore,
      guidelines,
      materials,
      dimensions,
      doAndDont,
      precedentAdvice,
      keyConsiderations
    };
  }
  
  /**
   * Get quick material recommendations
   */
  getMaterialRecommendations(context: Pick<GuidanceContext, 'isConservationArea' | 'isListedBuilding' | 'projectType'>): MaterialGuidance {
    return this.getMaterialGuidance(context as GuidanceContext);
  }
  
  /**
   * Check if specific design element is likely acceptable
   */
  checkDesignElement(element: {
    type: 'material' | 'window' | 'door' | 'roof' | 'extension';
    description: string;
    context: GuidanceContext;
  }): {
    acceptable: boolean;
    confidence: number;
    reasoning: string;
    alternatives?: string[];
  } {
    const { type, description, context } = element;
    const descLower = description.toLowerCase();
    
    // Check against known problematic elements
    if (type === 'material') {
      if (descLower.includes('upvc') || descLower.includes('u-pvc')) {
        return {
          acceptable: !context.isConservationArea && !context.isListedBuilding,
          confidence: 0.95,
          reasoning: context.isConservationArea || context.isListedBuilding
            ? 'uPVC is not acceptable in conservation areas or listed buildings'
            : 'uPVC may be acceptable but timber is preferred',
          alternatives: ['Painted timber', 'Slim profile aluminium', 'Timber effect composite']
        };
      }
      
      if (descLower.includes('concrete') && descLower.includes('tile')) {
        return {
          acceptable: !context.isConservationArea,
          confidence: 0.85,
          reasoning: 'Concrete tiles are generally not acceptable in conservation areas',
          alternatives: ['Natural slate', 'Clay tiles', 'Reclaimed tiles']
        };
      }
    }
    
    if (type === 'window') {
      if (descLower.includes('front') && descLower.includes('large')) {
        return {
          acceptable: false,
          confidence: 0.9,
          reasoning: 'Large format glazing on front elevations disrupts traditional proportions',
          alternatives: ['Multiple smaller windows', 'Traditional proportioned windows']
        };
      }
    }
    
    if (type === 'extension') {
      if (descLower.includes('front')) {
        return {
          acceptable: false,
          confidence: 0.95,
          reasoning: 'Front extensions are rarely acceptable in conservation areas',
          alternatives: ['Rear extension', 'Side extension set back from front']
        };
      }
    }
    
    // Default positive response
    return {
      acceptable: true,
      confidence: 0.6,
      reasoning: 'Element appears acceptable but should be verified with specific design proposals'
    };
  }
  
  // Private methods
  
  private buildGuidelines(context: GuidanceContext): Guideline[] {
    const guidelines: Guideline[] = [];
    
    // General planning guidelines
    guidelines.push({
      category: 'General',
      title: 'Neighbor amenity',
      description: 'Development must not significantly harm neighbors\' light, outlook, or privacy',
      importance: 'critical',
      applies: true,
      source: 'National Planning Policy Framework'
    });
    
    // Conservation area guidelines
    if (context.isConservationArea) {
      guidelines.push({
        category: 'Heritage',
        title: 'Preserve or enhance character',
        description: 'All development must preserve or enhance the character and appearance of the conservation area',
        importance: 'critical',
        applies: true,
        source: 'Planning (Listed Buildings and Conservation Areas) Act 1990'
      });
      
      guidelines.push({
        category: 'Design',
        title: 'Traditional materials',
        description: 'Use traditional materials appropriate to the conservation area character',
        importance: 'high',
        applies: true,
        source: 'Conservation Area Design Guide'
      });
      
      guidelines.push({
        category: 'Design',
        title: 'Respect proportions',
        description: 'New elements should respect the proportions and detailing of existing buildings',
        importance: 'high',
        applies: true,
        source: 'Conservation Area Character Appraisal'
      });
    }
    
    // Listed building guidelines
    if (context.isListedBuilding) {
      guidelines.push({
        category: 'Heritage',
        title: 'Special interest',
        description: 'Works must not harm the special architectural or historic interest of the building',
        importance: 'critical',
        applies: true,
        source: 'Planning (Listed Buildings and Conservation Areas) Act 1990'
      });
      
      guidelines.push({
        category: 'Conservation',
        title: 'Minimal intervention',
        description: 'Apply the principle of minimum intervention - do as much as necessary, as little as possible',
        importance: 'critical',
        applies: true,
        source: 'Historic England Guidance'
      });
      
      guidelines.push({
        category: 'Conservation',
        title: 'Reversibility',
        description: 'Where possible, new work should be reversible without damage to historic fabric',
        importance: 'high',
        applies: true,
        source: 'Historic England Guidance'
      });
    }
    
    // Project type specific guidelines
    if (context.projectType === 'loft-conversion' || context.projectType === 'dormer') {
      guidelines.push({
        category: 'Design',
        title: 'Roof subordination',
        description: 'Dormer windows should be subordinate to the roof slope and not dominate',
        importance: 'high',
        applies: true,
        source: 'Local Design Guide'
      });
      
      if (context.isConservationArea) {
        guidelines.push({
          category: 'Design',
          title: 'Rear dormers only',
          description: 'In conservation areas, dormers are typically only acceptable on rear roof slopes',
          importance: 'critical',
          applies: true,
          source: 'Conservation Area Design Guide'
        });
      }
    }
    
    if (context.projectType === 'basement') {
      guidelines.push({
        category: 'Technical',
        title: 'Structural methodology',
        description: 'Submit detailed structural methodology statement with your application',
        importance: 'critical',
        applies: true,
        source: 'Camden Planning Guidance CPG4'
      });
      
      guidelines.push({
        category: 'Amenity',
        title: 'Construction management',
        description: 'Comprehensive construction management plan required addressing noise, dust, and traffic',
        importance: 'critical',
        applies: true,
        source: 'Camden Planning Guidance CPG4'
      });
    }
    
    // Article 4 guidelines
    if (context.hasArticle4) {
      guidelines.push({
        category: 'Permitted Development',
        title: 'Article 4 restrictions',
        description: 'Normal permitted development rights have been removed - planning permission needed for most external changes',
        importance: 'critical',
        applies: true,
        source: 'Article 4 Direction'
      });
    }
    
    return guidelines;
  }
  
  private getMaterialGuidance(context: GuidanceContext): MaterialGuidance {
    if (context.isListedBuilding) {
      return {
        recommended: [
          { material: 'Matching brick/stone', use: 'Extensions', approvalLikelihood: 'high', notes: 'Must match existing exactly' },
          { material: 'Lime mortar', use: 'Pointing', approvalLikelihood: 'high', notes: 'Essential - cement mortar damages historic fabric' },
          { material: 'Traditional timber', use: 'Windows/doors', approvalLikelihood: 'high', notes: 'Matching profiles essential' },
          { material: 'Lead', use: 'Roofing/flashings', approvalLikelihood: 'high' },
          { material: 'Lime plaster', use: 'Internal walls', approvalLikelihood: 'high', notes: 'Breathable finish essential' }
        ],
        avoid: LISTED_BUILDING_PRINCIPLES.materials.forbidden,
        notes: [
          'All materials must be approved by conservation officer',
          'Sample panels may be required',
          'Salvaged materials often preferred',
          'Specialist suppliers recommended'
        ]
      };
    }
    
    if (context.isConservationArea) {
      return {
        recommended: CA_DESIGN_PRINCIPLES.materials.preferred,
        avoid: CA_DESIGN_PRINCIPLES.materials.avoid,
        notes: [
          'Material choice is crucial for approval',
          'Consider nearby approved schemes for guidance',
          'High-quality materials more likely to be approved',
          'Conservation officer may suggest alternatives'
        ]
      };
    }
    
    // Standard areas
    return {
      recommended: [
        { material: 'Matching brick', use: 'Extensions', approvalLikelihood: 'high' },
        { material: 'Render', use: 'Walls', approvalLikelihood: 'high', notes: 'If matches existing' },
        { material: 'Slate or tile', use: 'Roofing', approvalLikelihood: 'high' },
        { material: 'Timber or aluminium', use: 'Windows', approvalLikelihood: 'high' },
        { material: 'Glass and aluminium', use: 'Bi-fold doors', approvalLikelihood: 'high' }
      ],
      avoid: [
        'Clashing materials',
        'Poor quality finishes'
      ],
      notes: [
        'Match or complement existing materials',
        'Quality of finish matters',
        'Contemporary materials can be acceptable if high quality'
      ]
    };
  }
  
  private getDimensionGuidance(context: GuidanceContext): DimensionGuidance {
    const guidance: DimensionGuidance = {};
    
    const projectDims = PROJECT_DIMENSIONS[context.projectType];
    
    if (context.projectType === 'rear-extension') {
      const dims = context.isConservationArea
        ? (projectDims?.['conservationArea'] as Record<string, unknown>)?.['singleStorey']
        : (projectDims?.['standard'] as Record<string, unknown>)?.['singleStorey'];
        
      if (dims && typeof dims === 'object') {
        const d = dims as Record<string, unknown>;
        guidance.maxDepth = {
          value: typeof d['maxDepth'] === 'number' ? d['maxDepth'] : 3,
          unit: 'meters',
          notes: typeof d['notes'] === 'string' ? d['notes'] : 'Check local policy'
        };
        guidance.maxHeight = {
          value: typeof d['maxHeight'] === 'number' ? d['maxHeight'] : 3,
          unit: 'meters',
          notes: 'To eaves of extension'
        };
      }
    }
    
    if (context.projectType === 'loft-conversion') {
      const dormerDims = projectDims?.['dormer'] as Record<string, unknown> | undefined;
      if (dormerDims) {
        guidance.setbacks = [
          { type: 'From eaves', value: 0.5, unit: 'meters', notes: 'Minimum setback required' },
          { type: 'From party wall', value: 0.2, unit: 'meters', notes: 'To maintain separation' }
        ];
        guidance.maxWidth = {
          value: 50,
          unit: 'percent of roof width',
          notes: 'Dormer should not dominate roof'
        };
      }
    }
    
    if (context.projectType === 'basement') {
      const basementDims = projectDims?.['camden'] as Record<string, unknown> | undefined;
      if (basementDims) {
        guidance.coverage = {
          maxPercent: typeof basementDims['maxGardenCoverage'] === 'string' 
            ? parseInt(basementDims['maxGardenCoverage'], 10) || 50 
            : 50,
          notes: 'Maximum garden footprint'
        };
      }
    }
    
    return guidance;
  }
  
  private getDoAndDont(context: GuidanceContext): DoAndDont {
    const dos: string[] = [];
    const donts: string[] = [];
    
    // General do's
    dos.push('Get pre-application advice before submitting');
    dos.push('Study approved schemes in your area');
    dos.push('Use high-quality materials and finishes');
    dos.push('Consider neighbor amenity in your design');
    dos.push('Submit complete documentation first time');
    
    // General don'ts
    donts.push('Don\'t start work before approval');
    donts.push('Don\'t ignore planning conditions');
    donts.push('Don\'t assume previous approval guarantees yours');
    
    // Conservation area specific
    if (context.isConservationArea) {
      dos.push('Read the Conservation Area Character Appraisal');
      dos.push('Match window proportions to existing');
      dos.push('Use traditional materials appropriate to the area');
      dos.push('Keep extensions subordinate to main building');
      
      donts.push('Don\'t use uPVC windows or doors');
      donts.push('Don\'t add dormers to front roof slopes');
      donts.push('Don\'t install satellite dishes on front elevations');
      donts.push('Don\'t replace traditional features with modern alternatives');
    }
    
    // Listed building specific
    if (context.isListedBuilding) {
      dos.push('Engage a conservation architect');
      dos.push('Document all existing features before work');
      dos.push('Use reversible interventions where possible');
      dos.push('Consult Historic England early for Grade I/II*');
      
      donts.push('Don\'t remove any historic fabric without consent');
      donts.push('Don\'t use cement mortar on historic brickwork');
      donts.push('Don\'t install spray foam insulation');
      donts.push('Don\'t make internal changes without LBC');
    }
    
    // Project specific
    if (context.projectType === 'basement') {
      dos.push('Notify neighbors early in the process');
      dos.push('Appoint experienced basement contractor');
      dos.push('Plan for construction logistics carefully');
      
      donts.push('Don\'t exceed single storey depth (Camden)');
      donts.push('Don\'t cover more than 50% of garden');
      donts.push('Don\'t underestimate construction timeline');
    }
    
    if (context.projectType === 'loft-conversion') {
      dos.push('Consider impact on street scene');
      dos.push('Match rooflight style to the area');
      dos.push('Set dormers back from the edges');
      
      donts.push('Don\'t raise the ridge height');
      donts.push('Don\'t fill the entire roof slope with dormer');
    }
    
    return { do: dos, dont: donts };
  }
  
  private getPrecedentAdvice(context: GuidanceContext): string[] {
    const advice: string[] = [];
    
    advice.push(`Search for approved ${context.projectType} applications in ${context.postcode}`);
    advice.push('Note the materials, proportions, and design details of approvals');
    advice.push('Understand why any similar refusals were rejected');
    advice.push('Reference successful precedents in your Design & Access Statement');
    
    if (context.isConservationArea) {
      advice.push('Focus on schemes approved in the last 3 years as standards evolve');
      advice.push('Look at how traditional details have been handled');
    }
    
    if (context.isListedBuilding) {
      advice.push('Seek precedents on buildings of similar age and listing grade');
      advice.push('Note any conditions attached to approvals');
    }
    
    return advice;
  }
  
  private getKeyConsiderations(context: GuidanceContext): string[] {
    const considerations: string[] = [];
    
    if (context.isListedBuilding) {
      considerations.push('⚠️ Listed Building Consent required for all works affecting character');
      
      const gradeInfo = context.listingGrade 
        ? LISTED_BUILDING_PRINCIPLES.grades[context.listingGrade as keyof typeof LISTED_BUILDING_PRINCIPLES.grades]
        : null;
      if (gradeInfo) {
        considerations.push(`📋 Grade ${context.listingGrade}: ${gradeInfo.notes}`);
      }
    }
    
    if (context.isConservationArea) {
      considerations.push('🏛️ Conservation Area: Development must preserve or enhance character');
    }
    
    if (context.hasArticle4) {
      considerations.push('📜 Article 4 Direction: Permitted development rights removed');
    }
    
    // Borough specific
    const prefix = context.postcode.split(' ')[0];
    if (prefix === 'NW3' || prefix === 'NW1') {
      considerations.push('🏛️ Camden: Known for strict heritage controls');
    }
    if (prefix === 'N6') {
      considerations.push('🏛️ Highgate: Particularly sensitive heritage area');
    }
    
    return considerations;
  }
  
  private calculateApprovalScore(context: GuidanceContext): number {
    let score = 70; // Base score
    
    // Deductions
    if (context.isListedBuilding) {
      score -= 20;
      if (context.listingGrade === 'I') score -= 10;
      if (context.listingGrade === 'II*') score -= 5;
    }
    
    if (context.isConservationArea) score -= 10;
    if (context.hasArticle4) score -= 5;
    
    // Project type adjustments
    if (context.projectType === 'basement') score -= 10;
    if (context.projectType === 'new-build') score -= 15;
    if (context.projectType === 'internal-renovation' && !context.isListedBuilding) score += 15;
    
    return Math.max(20, Math.min(85, score));
  }
}

export const designGuidanceService = new DesignGuidanceService();

export type {
  DesignGuidance,
  Guideline,
  MaterialGuidance,
  DimensionGuidance,
  GuidanceContext
};
