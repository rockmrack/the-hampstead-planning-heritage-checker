/**
 * Heritage Value Calculator Service
 * Calculate heritage significance and value impact of properties
 */

// Heritage significance levels
type HeritageSignificance = 
  | 'exceptional'
  | 'high'
  | 'moderate'
  | 'low'
  | 'negligible';

type HeritageValue =
  | 'architectural'
  | 'historic'
  | 'artistic'
  | 'archaeological'
  | 'evidential'
  | 'aesthetic'
  | 'communal'
  | 'associative';

// Heritage assessment result
interface HeritageAssessment {
  property: {
    address: string;
    postcode: string;
    designation: string;
    grade?: string;
  };
  significance: {
    overall: HeritageSignificance;
    values: {
      type: HeritageValue;
      level: HeritageSignificance;
      description: string;
      sensitiveAreas: string[];
    }[];
    statement: string;
  };
  constraints: {
    constraint: string;
    impact: 'prohibitive' | 'major' | 'moderate' | 'minor';
    guidance: string;
  }[];
  opportunities: {
    opportunity: string;
    feasibility: 'high' | 'medium' | 'low';
    approach: string;
  }[];
  impactAssessment: {
    proposedWorks: string;
    level: 'substantial_harm' | 'less_than_substantial' | 'neutral' | 'enhancement';
    justification: string;
    mitigations: string[];
  } | null;
  valuePremium: {
    baseValue: number;
    heritagePremium: number;
    percentagePremium: number;
    factors: string[];
  };
  recommendations: string[];
}

// Heritage premium factors by area
const AREA_HERITAGE_PREMIUMS: Record<string, { basePremium: number; conservationBonus: number; listedBonus: Record<string, number> }> = {
  'NW3': {
    basePremium: 15,
    conservationBonus: 8,
    listedBonus: { 'I': 25, 'II*': 18, 'II': 12 },
  },
  'NW6': {
    basePremium: 10,
    conservationBonus: 6,
    listedBonus: { 'I': 22, 'II*': 15, 'II': 10 },
  },
  'NW8': {
    basePremium: 18,
    conservationBonus: 10,
    listedBonus: { 'I': 28, 'II*': 20, 'II': 14 },
  },
  'NW1': {
    basePremium: 12,
    conservationBonus: 7,
    listedBonus: { 'I': 24, 'II*': 16, 'II': 11 },
  },
  'N6': {
    basePremium: 14,
    conservationBonus: 8,
    listedBonus: { 'I': 26, 'II*': 18, 'II': 12 },
  },
  'N2': {
    basePremium: 12,
    conservationBonus: 7,
    listedBonus: { 'I': 23, 'II*': 15, 'II': 10 },
  },
};

// Conservation area character by name
const CONSERVATION_AREA_CHARACTER: Record<string, { significance: HeritageSignificance; description: string; sensitiveFeatures: string[] }> = {
  'Hampstead': {
    significance: 'exceptional',
    description: 'Historic village character with exceptional Georgian and Victorian architecture',
    sensitiveFeatures: ['Historic high street', 'Narrow lanes', 'Traditional shopfronts', 'Georgian terraces', 'Flask Walk character'],
  },
  'Hampstead Garden Suburb': {
    significance: 'exceptional',
    description: 'Planned garden suburb of exceptional architectural and historic interest',
    sensitiveFeatures: ['Lutyens architecture', 'Unified design approach', 'Garden settings', 'Street trees', 'Low boundary walls'],
  },
  'South Hill Park': {
    significance: 'high',
    description: 'Victorian residential area with substantial villas and mature landscapes',
    sensitiveFeatures: ['Victorian villas', 'Mature gardens', 'Tree-lined streets', 'Original boundary treatments'],
  },
  'Belsize': {
    significance: 'high',
    description: 'Victorian and Edwardian residential streets with consistent architectural character',
    sensitiveFeatures: ['Victorian terraces', 'Decorative features', 'Front gardens', 'Original fenestration'],
  },
  'Fitzjohns/Netherhall': {
    significance: 'high',
    description: 'Grand Victorian and Edwardian residential area',
    sensitiveFeatures: ['Large detached houses', 'Mature landscaping', 'Architectural variety', 'Historic garden walls'],
  },
  'Holly Lodge Estate': {
    significance: 'high',
    description: 'Arts and Crafts estate with distinctive character',
    sensitiveFeatures: ['Arts and Crafts details', 'Consistent materials', 'Garden settings', 'Estate layout'],
  },
  'Highgate': {
    significance: 'exceptional',
    description: 'Historic village with medieval origins and outstanding Georgian architecture',
    sensitiveFeatures: ['Historic village core', 'Georgian terraces', 'Historic cemetery', 'Pond Square', 'Steep topography'],
  },
};

export class HeritageValueCalculator {
  /**
   * Calculate comprehensive heritage assessment
   */
  assessHeritage(input: {
    address: string;
    postcode: string;
    isListedBuilding: boolean;
    listedGrade?: string;
    inConservationArea: boolean;
    conservationAreaName?: string;
    buildingAge?: string;
    architecturalStyle?: string;
    isLocallyListed?: boolean;
    hasArticle4?: boolean;
    proposedWorks?: string;
    estimatedValue?: number;
  }): HeritageAssessment {
    const areaPrefix = this.extractAreaPrefix(input.postcode);
    
    // Determine designation
    let designation = 'No designation';
    if (input.isListedBuilding) {
      designation = `Listed Building Grade ${input.listedGrade || 'II'}`;
    } else if (input.inConservationArea) {
      designation = `Conservation Area: ${input.conservationAreaName || 'Unspecified'}`;
    } else if (input.isLocallyListed) {
      designation = 'Locally Listed Building';
    }
    
    // Calculate significance
    const significance = this.calculateSignificance(input);
    
    // Identify constraints
    const constraints = this.identifyConstraints(input);
    
    // Identify opportunities
    const opportunities = this.identifyOpportunities(input);
    
    // Impact assessment if works proposed
    const impactAssessment = input.proposedWorks 
      ? this.assessImpact(input.proposedWorks, significance.overall, input.isListedBuilding)
      : null;
    
    // Calculate value premium
    const valuePremium = this.calculateValuePremium(input, areaPrefix);
    
    // Generate recommendations
    const recommendations = this.generateRecommendations(input, significance.overall, constraints);
    
    return {
      property: {
        address: input.address,
        postcode: input.postcode,
        designation,
        grade: input.listedGrade,
      },
      significance,
      constraints,
      opportunities,
      impactAssessment,
      valuePremium,
      recommendations,
    };
  }
  
  /**
   * Quick heritage check
   */
  quickHeritageCheck(postcode: string, isListed: boolean, inConservationArea: boolean): {
    heritageLevel: string;
    keyConstraints: string[];
    valuePremiumRange: { min: number; max: number };
  } {
    const areaPrefix = this.extractAreaPrefix(postcode);
    const defaultPremiums = AREA_HERITAGE_PREMIUMS['NW3']!;
    const premiums = AREA_HERITAGE_PREMIUMS[areaPrefix] ?? defaultPremiums;
    
    let heritageLevel = 'Standard';
    const keyConstraints: string[] = [];
    let minPremium = 0;
    let maxPremium = premiums.basePremium;
    
    if (isListed) {
      heritageLevel = 'Listed Building';
      keyConstraints.push('Listed Building Consent required for most works');
      keyConstraints.push('Special regard to preserving character and features');
      minPremium = premiums.listedBonus['II'] ?? 10;
      maxPremium = premiums.listedBonus['I'] ?? 25;
    } else if (inConservationArea) {
      heritageLevel = 'Conservation Area';
      keyConstraints.push('Enhanced planning controls');
      keyConstraints.push('Demolition requires consent');
      minPremium = premiums.conservationBonus;
      maxPremium = premiums.conservationBonus + premiums.basePremium;
    }
    
    return {
      heritageLevel,
      keyConstraints,
      valuePremiumRange: { min: minPremium, max: maxPremium },
    };
  }
  
  /**
   * Calculate heritage significance
   */
  private calculateSignificance(input: {
    isListedBuilding: boolean;
    listedGrade?: string;
    inConservationArea: boolean;
    conservationAreaName?: string;
    buildingAge?: string;
    architecturalStyle?: string;
    isLocallyListed?: boolean;
  }): HeritageAssessment['significance'] {
    const values: HeritageAssessment['significance']['values'] = [];
    let overallLevel: HeritageSignificance = 'low';
    
    // Listed building values
    if (input.isListedBuilding) {
      const grade = input.listedGrade || 'II';
      const gradeSignificance: Record<string, HeritageSignificance> = {
        'I': 'exceptional',
        'II*': 'high',
        'II': 'moderate',
      };
      overallLevel = gradeSignificance[grade] ?? 'moderate';
      
      values.push({
        type: 'architectural',
        level: overallLevel,
        description: `Grade ${grade} listed for architectural interest`,
        sensitiveAreas: ['External elevations', 'Original windows', 'Roof form', 'Internal features'],
      });
      
      values.push({
        type: 'historic',
        level: overallLevel,
        description: 'Historic interest warranting statutory protection',
        sensitiveAreas: ['Original layout', 'Historic fixtures', 'Fabric evidence'],
      });
    }
    
    // Conservation area values
    if (input.inConservationArea && input.conservationAreaName) {
      const caCharacter = CONSERVATION_AREA_CHARACTER[input.conservationAreaName];
      if (caCharacter) {
        values.push({
          type: 'aesthetic',
          level: caCharacter.significance,
          description: caCharacter.description,
          sensitiveAreas: caCharacter.sensitiveFeatures,
        });
        
        if (!input.isListedBuilding) {
          overallLevel = this.getHigherSignificance(overallLevel, caCharacter.significance);
        }
      }
    }
    
    // Building age contribution
    if (input.buildingAge) {
      const ageValue = this.assessAgeValue(input.buildingAge);
      if (ageValue) {
        values.push(ageValue);
        overallLevel = this.getHigherSignificance(overallLevel, ageValue.level);
      }
    }
    
    // Locally listed
    if (input.isLocallyListed && !input.isListedBuilding) {
      values.push({
        type: 'architectural',
        level: 'moderate',
        description: 'Locally listed for contribution to local character',
        sensitiveAreas: ['Street elevation', 'Original features', 'Building form'],
      });
      overallLevel = this.getHigherSignificance(overallLevel, 'moderate');
    }
    
    // Generate statement
    const statement = this.generateSignificanceStatement(input, overallLevel, values);
    
    return {
      overall: overallLevel,
      values,
      statement,
    };
  }
  
  /**
   * Assess building age value
   */
  private assessAgeValue(age: string): HeritageAssessment['significance']['values'][0] | null {
    const ageLC = age.toLowerCase();
    
    if (ageLC.includes('georgian') || ageLC.includes('18th') || ageLC.includes('1700')) {
      return {
        type: 'evidential',
        level: 'high',
        description: 'Georgian period building with evidential value',
        sensitiveAreas: ['Original construction methods', 'Period features', 'Historic materials'],
      };
    }
    
    if (ageLC.includes('victorian') || ageLC.includes('19th') || ageLC.includes('1800')) {
      return {
        type: 'evidential',
        level: 'moderate',
        description: 'Victorian period building',
        sensitiveAreas: ['Original features', 'Victorian detailing', 'Construction techniques'],
      };
    }
    
    if (ageLC.includes('edwardian') || ageLC.includes('arts and crafts') || ageLC.includes('1900')) {
      return {
        type: 'evidential',
        level: 'moderate',
        description: 'Edwardian/Arts & Crafts period building',
        sensitiveAreas: ['Period detailing', 'Original materials', 'Craftsman features'],
      };
    }
    
    return null;
  }
  
  /**
   * Generate significance statement
   */
  private generateSignificanceStatement(
    input: { isListedBuilding: boolean; listedGrade?: string; inConservationArea: boolean; conservationAreaName?: string },
    level: HeritageSignificance,
    values: HeritageAssessment['significance']['values']
  ): string {
    const parts: string[] = [];
    
    if (input.isListedBuilding) {
      parts.push(`This Grade ${input.listedGrade || 'II'} listed building possesses ${level} heritage significance.`);
    } else if (input.inConservationArea) {
      parts.push(`This building within ${input.conservationAreaName || 'the'} Conservation Area contributes to the area's heritage significance.`);
    } else {
      parts.push(`This building has ${level} heritage significance.`);
    }
    
    if (values.length > 0) {
      const valueTypes = values.map(v => v.type).slice(0, 3);
      parts.push(`Its significance derives primarily from its ${valueTypes.join(', ')} values.`);
    }
    
    return parts.join(' ');
  }
  
  /**
   * Identify heritage constraints
   */
  private identifyConstraints(input: {
    isListedBuilding: boolean;
    listedGrade?: string;
    inConservationArea: boolean;
    hasArticle4?: boolean;
  }): HeritageAssessment['constraints'] {
    const constraints: HeritageAssessment['constraints'] = [];
    
    if (input.isListedBuilding) {
      constraints.push({
        constraint: 'Listed Building Consent',
        impact: input.listedGrade === 'I' ? 'prohibitive' : input.listedGrade === 'II*' ? 'major' : 'moderate',
        guidance: 'LBC required for works affecting character, including internal alterations',
      });
      
      constraints.push({
        constraint: 'Setting considerations',
        impact: 'moderate',
        guidance: 'Development must preserve or enhance setting of listed building',
      });
      
      constraints.push({
        constraint: 'Material restrictions',
        impact: 'moderate',
        guidance: 'Like-for-like or traditional materials typically required',
      });
    }
    
    if (input.inConservationArea) {
      constraints.push({
        constraint: 'Conservation Area controls',
        impact: 'moderate',
        guidance: 'Enhanced design scrutiny to preserve or enhance character',
      });
      
      constraints.push({
        constraint: 'Demolition controls',
        impact: 'major',
        guidance: 'Conservation Area Consent required for demolition',
      });
      
      constraints.push({
        constraint: 'Tree protection',
        impact: 'minor',
        guidance: '6 weeks notice required before tree works',
      });
    }
    
    if (input.hasArticle4) {
      constraints.push({
        constraint: 'Article 4 Direction',
        impact: 'moderate',
        guidance: 'Permitted development rights removed for specified works',
      });
    }
    
    return constraints;
  }
  
  /**
   * Identify heritage opportunities
   */
  private identifyOpportunities(input: {
    isListedBuilding: boolean;
    inConservationArea: boolean;
    buildingAge?: string;
  }): HeritageAssessment['opportunities'] {
    const opportunities: HeritageAssessment['opportunities'] = [];
    
    opportunities.push({
      opportunity: 'Heritage grants',
      feasibility: input.isListedBuilding ? 'high' : input.inConservationArea ? 'medium' : 'low',
      approach: 'Historic England and council grant schemes for appropriate repairs',
    });
    
    if (input.isListedBuilding) {
      opportunities.push({
        opportunity: 'VAT relief',
        feasibility: 'high',
        approach: 'Zero-rated VAT on approved alterations to listed buildings',
      });
      
      opportunities.push({
        opportunity: 'Heritage premium value',
        feasibility: 'high',
        approach: 'Listed status typically adds 10-25% value premium',
      });
    }
    
    if (input.inConservationArea) {
      opportunities.push({
        opportunity: 'Character enhancement',
        feasibility: 'medium',
        approach: 'Reinstatement of historic features can improve planning prospects',
      });
    }
    
    opportunities.push({
      opportunity: 'Pre-application advice',
      feasibility: 'high',
      approach: 'Council heritage officers can guide sympathetic proposals',
    });
    
    return opportunities;
  }
  
  /**
   * Assess heritage impact of proposed works
   */
  private assessImpact(
    proposedWorks: string,
    significance: HeritageSignificance,
    isListed: boolean
  ): NonNullable<HeritageAssessment['impactAssessment']> {
    const worksLC = proposedWorks.toLowerCase();
    
    type ImpactLevel = 'substantial_harm' | 'less_than_substantial' | 'neutral' | 'enhancement';
    let level: ImpactLevel = 'neutral';
    const mitigations: string[] = [];
    
    // High impact works
    const highImpact = ['demolition', 'demolish', 'remove', 'replace windows', 'alter roof'];
    const moderateImpact = ['extension', 'dormer', 'basement', 'convert'];
    const lowImpact = ['repair', 'maintain', 'redecorate', 'internal'];
    const enhancement = ['restore', 'reinstate', 'repair original', 'remove later additions'];
    
    if (enhancement.some(w => worksLC.includes(w))) {
      level = 'enhancement';
    } else if (highImpact.some(w => worksLC.includes(w))) {
      level = significance === 'exceptional' || significance === 'high' 
        ? 'substantial_harm' 
        : 'less_than_substantial';
      mitigations.push('Consider retention and repair over replacement');
      mitigations.push('Document features before any removal');
      mitigations.push('Use traditional materials and techniques');
    } else if (moderateImpact.some(w => worksLC.includes(w))) {
      level = 'less_than_substantial';
      mitigations.push('Design to be subservient to historic building');
      mitigations.push('Use appropriate materials palette');
      mitigations.push('Minimize impact on principal elevations');
    } else if (lowImpact.some(w => worksLC.includes(w))) {
      level = 'neutral';
    }
    
    const justification = this.getImpactJustification(level, isListed);
    
    return {
      proposedWorks,
      level,
      justification,
      mitigations,
    };
  }
  
  /**
   * Get impact justification text
   */
  private getImpactJustification(
    level: 'substantial_harm' | 'less_than_substantial' | 'neutral' | 'enhancement',
    isListed: boolean
  ): string {
    const justifications: Record<string, string> = {
      'substantial_harm': `The proposed works would cause substantial harm to the significance of the ${isListed ? 'listed building' : 'heritage asset'}. This would require clear and convincing justification under NPPF paragraph 201.`,
      'less_than_substantial': `The proposed works would cause less than substantial harm. This harm must be weighed against the public benefits of the proposal under NPPF paragraph 202.`,
      'neutral': 'The proposed works would have neutral impact on heritage significance, neither harming nor enhancing the asset.',
      'enhancement': 'The proposed works would enhance the significance of the heritage asset by reinstating or revealing historic features.',
    };
    
    return justifications[level] ?? justifications['neutral'] ?? '';
  }
  
  /**
   * Calculate heritage value premium
   */
  private calculateValuePremium(
    input: {
      isListedBuilding: boolean;
      listedGrade?: string;
      inConservationArea: boolean;
      conservationAreaName?: string;
      isLocallyListed?: boolean;
      estimatedValue?: number;
    },
    areaPrefix: string
  ): HeritageAssessment['valuePremium'] {
    const defaultPremiums = AREA_HERITAGE_PREMIUMS['NW3']!;
    const premiums = AREA_HERITAGE_PREMIUMS[areaPrefix] ?? defaultPremiums;
    const factors: string[] = [];
    
    let percentagePremium = 0;
    
    // Base area premium
    percentagePremium += premiums.basePremium;
    factors.push(`Area heritage character (+${premiums.basePremium}%)`);
    
    // Listed building premium
    if (input.isListedBuilding && input.listedGrade) {
      const listedBonus = premiums.listedBonus[input.listedGrade] ?? premiums.listedBonus['II'] ?? 10;
      percentagePremium += listedBonus;
      factors.push(`Listed Grade ${input.listedGrade} (+${listedBonus}%)`);
    }
    
    // Conservation area premium
    if (input.inConservationArea) {
      percentagePremium += premiums.conservationBonus;
      factors.push(`Conservation Area (+${premiums.conservationBonus}%)`);
      
      // Named conservation area bonus
      if (input.conservationAreaName && CONSERVATION_AREA_CHARACTER[input.conservationAreaName]) {
        const caBonus = CONSERVATION_AREA_CHARACTER[input.conservationAreaName]?.significance === 'exceptional' ? 5 : 2;
        percentagePremium += caBonus;
        factors.push(`${input.conservationAreaName} CA (+${caBonus}%)`);
      }
    }
    
    // Locally listed
    if (input.isLocallyListed && !input.isListedBuilding) {
      percentagePremium += 3;
      factors.push('Locally listed (+3%)');
    }
    
    const baseValue = input.estimatedValue ?? 1000000;
    const heritagePremium = Math.round(baseValue * (percentagePremium / 100));
    
    return {
      baseValue,
      heritagePremium,
      percentagePremium,
      factors,
    };
  }
  
  /**
   * Generate recommendations
   */
  private generateRecommendations(
    input: { isListedBuilding: boolean; inConservationArea: boolean },
    significance: HeritageSignificance,
    constraints: HeritageAssessment['constraints']
  ): string[] {
    const recommendations: string[] = [];
    
    if (input.isListedBuilding) {
      recommendations.push('Engage architect with listed building experience');
      recommendations.push('Prepare comprehensive heritage impact assessment');
      recommendations.push('Consider pre-application meeting with conservation officer');
    }
    
    if (input.inConservationArea) {
      recommendations.push('Review Conservation Area Appraisal document');
      recommendations.push('Design to preserve or enhance area character');
    }
    
    if (significance === 'exceptional' || significance === 'high') {
      recommendations.push('Commission condition survey before works');
      recommendations.push('Document existing features with photography');
    }
    
    if (constraints.length > 0) {
      recommendations.push('Allow extended timescales for consent process');
    }
    
    recommendations.push('Explore heritage grant opportunities');
    recommendations.push('Consider phased approach to reduce impact');
    
    return recommendations.slice(0, 8);
  }
  
  /**
   * Compare significance levels
   */
  private getHigherSignificance(a: HeritageSignificance, b: HeritageSignificance): HeritageSignificance {
    const order: HeritageSignificance[] = ['negligible', 'low', 'moderate', 'high', 'exceptional'];
    return order.indexOf(a) >= order.indexOf(b) ? a : b;
  }
  
  /**
   * Extract area prefix
   */
  private extractAreaPrefix(postcode: string): string {
    const match = postcode.match(/^(NW\d{1,2}|N\d{1,2})/i);
    return match && match[1] ? match[1].toUpperCase() : 'NW3';
  }
}

// Export singleton
export const heritageValueCalculator = new HeritageValueCalculator();
