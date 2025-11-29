/**
 * Neighbor Impact Analyzer Service
 * 
 * Analyzes potential impacts on neighboring properties:
 * - Light and daylight impacts
 * - Privacy considerations
 * - Overlooking analysis
 * - Noise and disturbance
 * - Visual impact
 * - Party wall implications
 */

// Types
export interface ImpactAnalysis {
  propertyAddress: string;
  postcode: string;
  projectType: string;
  overallImpact: 'minimal' | 'minor' | 'moderate' | 'significant';
  impactScore: number; // 0-100 (lower is better)
  impacts: Impact[];
  affectedProperties: AffectedProperty[];
  mitigationMeasures: MitigationMeasure[];
  recommendations: string[];
  partyWallInfo?: PartyWallInfo;
}

export interface Impact {
  type: ImpactType;
  severity: 'none' | 'low' | 'medium' | 'high';
  description: string;
  affectedDirection: 'north' | 'south' | 'east' | 'west' | 'multiple' | 'none';
  mitigationPossible: boolean;
}

export type ImpactType = 
  | 'daylight'
  | 'sunlight'
  | 'privacy'
  | 'overlooking'
  | 'noise_construction'
  | 'noise_operational'
  | 'visual'
  | 'overbearing'
  | 'overshadowing'
  | 'outlook'
  | 'traffic'
  | 'parking';

export interface AffectedProperty {
  address: string;
  direction: 'north' | 'south' | 'east' | 'west' | 'northeast' | 'northwest' | 'southeast' | 'southwest';
  distance: number; // meters
  impacts: {
    type: ImpactType;
    severity: 'none' | 'low' | 'medium' | 'high';
    notes: string;
  }[];
  requiresNotification: boolean;
  partyWallAffected: boolean;
}

export interface MitigationMeasure {
  impact: ImpactType;
  measure: string;
  effectiveness: 'low' | 'medium' | 'high';
  cost: 'low' | 'medium' | 'high';
  planningBenefit: boolean;
}

export interface PartyWallInfo {
  applicable: boolean;
  affectedWalls: string[];
  noticesRequired: string[];
  estimatedCosts: {
    surveyorFees: number;
    potentialDamages: number;
  };
  timeline: string;
}

interface AnalysisParams {
  propertyAddress: string;
  postcode: string;
  projectType: string;
  projectDetails: {
    extensionDepth?: number; // meters
    extensionWidth?: number;
    extensionHeight?: number;
    loftDormerSize?: 'small' | 'medium' | 'large';
    basementDepth?: number;
    newWindows?: { direction: string; floor: string }[];
    balcony?: boolean;
    roofTerrace?: boolean;
  };
  propertyType?: 'terraced' | 'semi-detached' | 'detached' | 'flat';
  neighborInfo?: {
    northDistance?: number;
    southDistance?: number;
    eastDistance?: number;
    westDistance?: number;
  };
}

// Impact analysis rules and thresholds
const DAYLIGHT_RULES = {
  // 45-degree rule for rear extensions
  maxDepthBefore45DegreeTest: 3, // meters
  extensionHeightThreshold: 3, // meters
  windowDistanceMin: 10.5, // meters (BRE guidelines)
};

const PRIVACY_RULES = {
  minWindowDistance: 21, // meters for direct overlooking
  minBalconyDistance: 10, // meters
  minRoofTerraceDistance: 10,
  obscureGlazingHelps: true,
};

// Neighbor Impact Analyzer Service Implementation
class NeighborImpactAnalyzerService {
  
  /**
   * Analyze neighbor impacts for a proposed development
   */
  analyzeImpacts(params: AnalysisParams): ImpactAnalysis {
    const impacts: Impact[] = [];
    const affectedProperties: AffectedProperty[] = [];
    const mitigationMeasures: MitigationMeasure[] = [];

    // Analyze different impact types
    impacts.push(...this.analyzeDaylightImpact(params));
    impacts.push(...this.analyzePrivacyImpact(params));
    impacts.push(...this.analyzeVisualImpact(params));
    impacts.push(...this.analyzeNoiseImpact(params));

    // Identify affected properties
    affectedProperties.push(...this.identifyAffectedProperties(params, impacts));

    // Generate mitigation measures
    mitigationMeasures.push(...this.generateMitigationMeasures(impacts));

    // Calculate overall impact score
    const impactScore = this.calculateImpactScore(impacts);
    const overallImpact = this.getOverallImpactLevel(impactScore);

    // Generate recommendations
    const recommendations = this.generateRecommendations(params, impacts, mitigationMeasures);

    // Party wall analysis
    const partyWallInfo = this.analyzePartyWall(params);

    return {
      propertyAddress: params.propertyAddress,
      postcode: params.postcode,
      projectType: params.projectType,
      overallImpact,
      impactScore,
      impacts,
      affectedProperties,
      mitigationMeasures,
      recommendations,
      partyWallInfo,
    };
  }

  /**
   * Analyze daylight and sunlight impacts
   */
  private analyzeDaylightImpact(params: AnalysisParams): Impact[] {
    const impacts: Impact[] = [];
    const { projectDetails, projectType } = params;

    // Rear extension daylight analysis
    if (projectType === 'extension' && projectDetails.extensionDepth) {
      const depth = projectDetails.extensionDepth;
      const height = projectDetails.extensionHeight || 3;

      if (depth > DAYLIGHT_RULES.maxDepthBefore45DegreeTest) {
        const severity = depth > 4 ? 'high' : depth > 3.5 ? 'medium' : 'low';
        impacts.push({
          type: 'daylight',
          severity,
          description: `Extension depth of ${depth}m may affect neighbor daylight under 45-degree rule`,
          affectedDirection: 'multiple',
          mitigationPossible: true,
        });
      }

      if (height > DAYLIGHT_RULES.extensionHeightThreshold) {
        impacts.push({
          type: 'overshadowing',
          severity: 'medium',
          description: `Extension height of ${height}m may cause overshadowing to neighboring gardens`,
          affectedDirection: 'north',
          mitigationPossible: true,
        });
      }
    }

    // Loft conversion daylight analysis
    if (projectType === 'loft_conversion' && projectDetails.loftDormerSize) {
      const severity = projectDetails.loftDormerSize === 'large' ? 'medium' : 'low';
      impacts.push({
        type: 'daylight',
        severity,
        description: `${projectDetails.loftDormerSize} dormer may have minor daylight impact`,
        affectedDirection: 'multiple',
        mitigationPossible: false,
      });
    }

    // Basement daylight is generally minimal
    if (projectType === 'basement') {
      impacts.push({
        type: 'daylight',
        severity: 'none',
        description: 'Basement works typically have no daylight impact on neighbors',
        affectedDirection: 'none',
        mitigationPossible: false,
      });
    }

    return impacts;
  }

  /**
   * Analyze privacy and overlooking impacts
   */
  private analyzePrivacyImpact(params: AnalysisParams): Impact[] {
    const impacts: Impact[] = [];
    const { projectDetails } = params;

    // New windows analysis
    if (projectDetails.newWindows && projectDetails.newWindows.length > 0) {
      for (const window of projectDetails.newWindows) {
        if (window.floor === 'upper' || window.floor === 'first' || window.floor === 'second') {
          impacts.push({
            type: 'overlooking',
            severity: 'medium',
            description: `New ${window.floor} floor window facing ${window.direction} may overlook neighboring property`,
            affectedDirection: window.direction as Impact['affectedDirection'],
            mitigationPossible: true,
          });
        }
      }
    }

    // Balcony analysis
    if (projectDetails.balcony) {
      impacts.push({
        type: 'privacy',
        severity: 'high',
        description: 'Balcony may cause direct overlooking and privacy concerns',
        affectedDirection: 'multiple',
        mitigationPossible: true,
      });
    }

    // Roof terrace analysis
    if (projectDetails.roofTerrace) {
      impacts.push({
        type: 'privacy',
        severity: 'high',
        description: 'Roof terrace creates elevated viewing platform with significant privacy impact',
        affectedDirection: 'multiple',
        mitigationPossible: true,
      });

      impacts.push({
        type: 'noise_operational',
        severity: 'medium',
        description: 'Roof terrace may generate noise from outdoor activities',
        affectedDirection: 'multiple',
        mitigationPossible: true,
      });
    }

    return impacts;
  }

  /**
   * Analyze visual and overbearing impacts
   */
  private analyzeVisualImpact(params: AnalysisParams): Impact[] {
    const impacts: Impact[] = [];
    const { projectDetails, projectType, propertyType } = params;

    // Extension visual impact
    if (projectType === 'extension') {
      const depth = projectDetails.extensionDepth || 0;
      const width = projectDetails.extensionWidth || 0;

      if (depth > 4 || (depth > 3 && width > 4)) {
        impacts.push({
          type: 'overbearing',
          severity: 'medium',
          description: 'Large extension may appear overbearing from neighboring properties',
          affectedDirection: 'multiple',
          mitigationPossible: true,
        });
      }

      // Terraced properties are more sensitive
      if (propertyType === 'terraced') {
        impacts.push({
          type: 'outlook',
          severity: depth > 3 ? 'medium' : 'low',
          description: 'Extension may affect neighbor outlook in terraced setting',
          affectedDirection: 'east',
          mitigationPossible: false,
        });
        impacts.push({
          type: 'outlook',
          severity: depth > 3 ? 'medium' : 'low',
          description: 'Extension may affect neighbor outlook in terraced setting',
          affectedDirection: 'west',
          mitigationPossible: false,
        });
      }
    }

    // Loft visual impact
    if (projectType === 'loft_conversion' && projectDetails.loftDormerSize === 'large') {
      impacts.push({
        type: 'visual',
        severity: 'medium',
        description: 'Large dormer may be visually prominent when viewed from neighboring properties',
        affectedDirection: 'multiple',
        mitigationPossible: true,
      });
    }

    return impacts;
  }

  /**
   * Analyze noise and disturbance impacts
   */
  private analyzeNoiseImpact(params: AnalysisParams): Impact[] {
    const impacts: Impact[] = [];
    const { projectType, projectDetails } = params;

    // Construction noise varies by project type
    const constructionSeverity: Record<string, 'low' | 'medium' | 'high'> = {
      'extension': 'medium',
      'loft_conversion': 'medium',
      'basement': 'high',
      'new_build': 'high',
      'renovation': 'low',
    };

    impacts.push({
      type: 'noise_construction',
      severity: constructionSeverity[projectType] || 'medium',
      description: `Construction of ${projectType.replace('_', ' ')} will cause temporary noise disturbance`,
      affectedDirection: 'multiple',
      mitigationPossible: true,
    });

    // Basement-specific impacts
    if (projectType === 'basement') {
      impacts.push({
        type: 'noise_construction',
        severity: 'high',
        description: 'Basement excavation involves significant noise and vibration over extended period',
        affectedDirection: 'multiple',
        mitigationPossible: true,
      });

      impacts.push({
        type: 'traffic',
        severity: 'high',
        description: 'Spoil removal will require numerous truck movements',
        affectedDirection: 'multiple',
        mitigationPossible: true,
      });
    }

    return impacts;
  }

  /**
   * Identify specific affected properties
   */
  private identifyAffectedProperties(params: AnalysisParams, impacts: Impact[]): AffectedProperty[] {
    const properties: AffectedProperty[] = [];
    const { propertyType, neighborInfo } = params;

    // Standard neighbor configurations based on property type
    if (propertyType === 'terraced') {
      // East neighbor
      properties.push({
        address: 'Adjacent property (east)',
        direction: 'east',
        distance: 0,
        impacts: impacts.filter(i => i.affectedDirection === 'east' || i.affectedDirection === 'multiple')
          .map(i => ({ type: i.type, severity: i.severity, notes: i.description })),
        requiresNotification: true,
        partyWallAffected: true,
      });

      // West neighbor
      properties.push({
        address: 'Adjacent property (west)',
        direction: 'west',
        distance: 0,
        impacts: impacts.filter(i => i.affectedDirection === 'west' || i.affectedDirection === 'multiple')
          .map(i => ({ type: i.type, severity: i.severity, notes: i.description })),
        requiresNotification: true,
        partyWallAffected: true,
      });

      // Rear neighbor
      if (neighborInfo?.northDistance || neighborInfo?.southDistance) {
        const rearDirection = neighborInfo.northDistance ? 'north' : 'south';
        const rearDistance = neighborInfo.northDistance || neighborInfo.southDistance || 20;
        properties.push({
          address: `Rear property (${rearDirection})`,
          direction: rearDirection as AffectedProperty['direction'],
          distance: rearDistance,
          impacts: impacts.filter(i => i.affectedDirection === rearDirection || i.affectedDirection === 'multiple')
            .map(i => ({ type: i.type, severity: i.severity, notes: i.description })),
          requiresNotification: rearDistance < 25,
          partyWallAffected: false,
        });
      }
    } else if (propertyType === 'semi-detached') {
      // Attached neighbor
      properties.push({
        address: 'Attached property',
        direction: 'east',
        distance: 0,
        impacts: impacts.filter(i => i.affectedDirection === 'east' || i.affectedDirection === 'multiple')
          .map(i => ({ type: i.type, severity: i.severity, notes: i.description })),
        requiresNotification: true,
        partyWallAffected: true,
      });
    } else if (propertyType === 'detached') {
      // All directions at some distance
      const directions: Array<{ dir: 'north' | 'south' | 'east' | 'west'; distance: number }> = [
        { dir: 'north', distance: neighborInfo?.northDistance || 15 },
        { dir: 'south', distance: neighborInfo?.southDistance || 15 },
        { dir: 'east', distance: neighborInfo?.eastDistance || 10 },
        { dir: 'west', distance: neighborInfo?.westDistance || 10 },
      ];

      for (const { dir, distance } of directions) {
        if (distance < 30) {
          properties.push({
            address: `Neighboring property (${dir})`,
            direction: dir,
            distance,
            impacts: impacts.filter(i => i.affectedDirection === dir || i.affectedDirection === 'multiple')
              .map(i => ({ type: i.type, severity: i.severity, notes: i.description })),
            requiresNotification: distance < 20,
            partyWallAffected: false,
          });
        }
      }
    }

    return properties;
  }

  /**
   * Generate mitigation measures for identified impacts
   */
  private generateMitigationMeasures(impacts: Impact[]): MitigationMeasure[] {
    const measures: MitigationMeasure[] = [];

    for (const impact of impacts) {
      if (!impact.mitigationPossible) continue;

      switch (impact.type) {
        case 'daylight':
        case 'overshadowing':
          measures.push({
            impact: impact.type,
            measure: 'Reduce extension depth or step back upper floor',
            effectiveness: 'high',
            cost: 'medium',
            planningBenefit: true,
          });
          measures.push({
            impact: impact.type,
            measure: 'Use glazed roof elements to reduce massing',
            effectiveness: 'medium',
            cost: 'medium',
            planningBenefit: true,
          });
          break;

        case 'privacy':
        case 'overlooking':
          measures.push({
            impact: impact.type,
            measure: 'Use obscure glazing to affected windows',
            effectiveness: 'high',
            cost: 'low',
            planningBenefit: true,
          });
          measures.push({
            impact: impact.type,
            measure: 'Install privacy screens or planting',
            effectiveness: 'medium',
            cost: 'medium',
            planningBenefit: true,
          });
          if (impact.type === 'privacy') {
            measures.push({
              impact: impact.type,
              measure: 'Restrict use hours for roof terrace/balcony',
              effectiveness: 'medium',
              cost: 'low',
              planningBenefit: true,
            });
          }
          break;

        case 'overbearing':
        case 'visual':
          measures.push({
            impact: impact.type,
            measure: 'Use recessive colors and materials',
            effectiveness: 'medium',
            cost: 'low',
            planningBenefit: true,
          });
          measures.push({
            impact: impact.type,
            measure: 'Include landscape screening',
            effectiveness: 'medium',
            cost: 'medium',
            planningBenefit: true,
          });
          break;

        case 'noise_construction':
          measures.push({
            impact: impact.type,
            measure: 'Provide Construction Management Plan with restricted hours',
            effectiveness: 'high',
            cost: 'low',
            planningBenefit: true,
          });
          measures.push({
            impact: impact.type,
            measure: 'Use quieter equipment and noise barriers',
            effectiveness: 'medium',
            cost: 'medium',
            planningBenefit: false,
          });
          break;

        case 'noise_operational':
          measures.push({
            impact: impact.type,
            measure: 'Restrict hours of use through planning condition',
            effectiveness: 'high',
            cost: 'low',
            planningBenefit: true,
          });
          break;

        case 'traffic':
          measures.push({
            impact: impact.type,
            measure: 'Implement traffic management plan with off-peak deliveries',
            effectiveness: 'medium',
            cost: 'low',
            planningBenefit: true,
          });
          break;
      }
    }

    // Remove duplicates
    const uniqueMeasures = measures.filter((measure, index, self) =>
      index === self.findIndex(m => m.measure === measure.measure)
    );

    return uniqueMeasures;
  }

  /**
   * Calculate overall impact score
   */
  private calculateImpactScore(impacts: Impact[]): number {
    const severityScores: Record<string, number> = {
      'none': 0,
      'low': 10,
      'medium': 25,
      'high': 40,
    };

    let totalScore = 0;
    for (const impact of impacts) {
      totalScore += severityScores[impact.severity] || 0;
    }

    return Math.min(100, totalScore);
  }

  /**
   * Get overall impact level from score
   */
  private getOverallImpactLevel(score: number): ImpactAnalysis['overallImpact'] {
    if (score < 20) return 'minimal';
    if (score < 40) return 'minor';
    if (score < 70) return 'moderate';
    return 'significant';
  }

  /**
   * Generate recommendations based on analysis
   */
  private generateRecommendations(
    params: AnalysisParams, 
    impacts: Impact[], 
    mitigations: MitigationMeasure[]
  ): string[] {
    const recommendations: string[] = [];

    // High severity impacts
    const highImpacts = impacts.filter(i => i.severity === 'high');
    if (highImpacts.length > 0) {
      recommendations.push('⚠️ Consider pre-application advice due to significant neighbor impacts');
      recommendations.push('📋 Prepare comprehensive design justification addressing impact concerns');
    }

    // Privacy impacts
    if (impacts.some(i => i.type === 'privacy' || i.type === 'overlooking')) {
      recommendations.push('🪟 Incorporate obscure glazing conditions in your application');
    }

    // Construction impacts
    if (impacts.some(i => i.type === 'noise_construction' && i.severity !== 'low')) {
      recommendations.push('🏗️ Prepare a Construction Management Plan to submit with application');
      recommendations.push('📬 Notify neighbors in advance and maintain good communication');
    }

    // Party wall implications
    if (params.propertyType === 'terraced' || params.propertyType === 'semi-detached') {
      recommendations.push('🏠 Serve Party Wall notices early to avoid delays');
    }

    // Conservation area considerations
    if (params.postcode.startsWith('NW3') || params.postcode.startsWith('N6')) {
      recommendations.push('🏛️ Conservation area: Visual impact particularly important');
    }

    // High benefit mitigations
    const highEffectiveMitigations = mitigations.filter(m => m.effectiveness === 'high' && m.planningBenefit);
    for (const mitigation of highEffectiveMitigations.slice(0, 3)) {
      recommendations.push(`✅ ${mitigation.measure}`);
    }

    return recommendations;
  }

  /**
   * Analyze party wall requirements
   */
  private analyzePartyWall(params: AnalysisParams): PartyWallInfo | undefined {
    const { projectType, propertyType, projectDetails } = params;

    // Check if party wall is relevant
    const hasSharedWall = propertyType === 'terraced' || propertyType === 'semi-detached';
    const affectsPartyWall = ['extension', 'basement', 'loft_conversion'].includes(projectType);

    if (!hasSharedWall || !affectsPartyWall) {
      return undefined;
    }

    const affectedWalls: string[] = [];
    const noticesRequired: string[] = [];
    let surveyorFees = 1500;
    let potentialDamages = 500;

    // Determine affected walls based on project type
    if (projectType === 'extension') {
      affectedWalls.push('Rear party wall section');
      noticesRequired.push('Section 1 Notice - New building on boundary');
      if (projectDetails.extensionWidth && projectDetails.extensionWidth > 3) {
        affectedWalls.push('Side return wall');
      }
    }

    if (projectType === 'basement') {
      affectedWalls.push('Full party wall from foundation to roof');
      affectedWalls.push('Party floor structure (if shared)');
      noticesRequired.push('Section 6 Notice - Excavation within 3m/6m');
      noticesRequired.push('Section 2 Notice - Works to party wall');
      surveyorFees = 5000;
      potentialDamages = 2500;
    }

    if (projectType === 'loft_conversion') {
      affectedWalls.push('Party wall at roof level');
      noticesRequired.push('Section 2 Notice - Works to party wall');
      surveyorFees = 2000;
      potentialDamages = 1000;
    }

    return {
      applicable: true,
      affectedWalls,
      noticesRequired,
      estimatedCosts: {
        surveyorFees,
        potentialDamages,
      },
      timeline: 'Notices should be served minimum 2 months before works. Neighbor has 14 days to respond.',
    };
  }

  /**
   * Quick check for common impact scenarios
   */
  quickImpactCheck(projectType: string, propertyType: string): {
    likelyImpacts: string[];
    riskLevel: 'low' | 'medium' | 'high';
    keyConsiderations: string[];
  } {
    const impacts: string[] = [];
    const considerations: string[] = [];
    let riskLevel: 'low' | 'medium' | 'high' = 'low';

    switch (projectType) {
      case 'extension':
        impacts.push('Daylight to neighbors', 'Outlook impact', 'Construction noise');
        if (propertyType === 'terraced') {
          impacts.push('Party wall works');
          riskLevel = 'medium';
        }
        considerations.push('45-degree rule for depth', 'Materials to match', 'Subordinate design');
        break;

      case 'loft_conversion':
        impacts.push('Privacy from dormers', 'Visual impact', 'Construction noise');
        considerations.push('Dormer size and position', 'Rear-only dormers typically', 'Roof materials');
        break;

      case 'basement':
        impacts.push('Significant construction disturbance', 'Traffic/deliveries', 'Potential structural concerns');
        riskLevel = 'high';
        considerations.push('Structural method statement', 'Construction management plan', 'Party wall agreement essential');
        break;

      case 'roof_terrace':
      case 'balcony':
        impacts.push('Privacy impact', 'Noise from use', 'Overlooking');
        riskLevel = 'medium';
        considerations.push('Screen requirements', 'Hours of use restriction', 'Noise management');
        break;

      default:
        impacts.push('Case-specific assessment needed');
        considerations.push('Consult planning officer');
    }

    return {
      likelyImpacts: impacts,
      riskLevel,
      keyConsiderations: considerations,
    };
  }
}

// Export singleton instance
export const neighborImpactAnalyzerService = new NeighborImpactAnalyzerService();
