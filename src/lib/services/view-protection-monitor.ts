/**
 * View Protection Monitor Service
 * Track and analyze protected views and their impact on development
 */

export interface ProtectedView {
  id: string;
  name: string;
  designation: 'strategic' | 'local' | 'landmark' | 'panoramic';
  borough: string;
  
  // View corridor details
  viewpoint: {
    name: string;
    coordinates: { lat: number; lng: number };
    description: string;
  };
  
  landmark: {
    name: string;
    coordinates: { lat: number; lng: number };
    type: string;
  };
  
  // Corridor geometry
  corridor: {
    width: number; // meters at narrowest
    length: number; // meters
    bearingDegrees: number;
    polygonCoordinates?: { lat: number; lng: number }[];
  };
  
  // Protection level
  protection: {
    policyDocument: string;
    policyRef: string;
    heightRestriction?: number; // AOD
    setbackRequired?: number; // meters
    restrictionType: 'absolute' | 'assessment-required' | 'guidance';
  };
  
  // Historical context
  history: string;
  significance: string;
}

export interface ViewAssessment {
  property: {
    address: string;
    postcode: string;
    coordinates: { lat: number; lng: number };
  };
  
  affectedViews: {
    view: ProtectedView;
    distanceFromCorridor: number; // meters, negative = inside corridor
    impactLevel: 'within-corridor' | 'adjacent' | 'nearby' | 'none';
    restrictions: string[];
    implications: string[];
  }[];
  
  recommendations: string[];
  overallRisk: 'high' | 'medium' | 'low' | 'none';
  additionalStudiesRequired: string[];
}

// ===========================================
// PROTECTED VIEWS DATABASE - NW LONDON
// ===========================================

const PROTECTED_VIEWS: ProtectedView[] = [
  {
    id: 'view-001',
    name: 'Parliament Hill to St Paul\'s Cathedral',
    designation: 'strategic',
    borough: 'Camden',
    viewpoint: {
      name: 'Parliament Hill Summit',
      coordinates: { lat: 51.5565, lng: -0.1509 },
      description: 'Summit of Parliament Hill, Hampstead Heath',
    },
    landmark: {
      name: 'St Paul\'s Cathedral',
      coordinates: { lat: 51.5138, lng: -0.0984 },
      type: 'Cathedral',
    },
    corridor: {
      width: 150,
      length: 5500,
      bearingDegrees: 135,
    },
    protection: {
      policyDocument: 'London View Management Framework',
      policyRef: 'LVMF 2.A.1',
      heightRestriction: 53.2, // AOD
      restrictionType: 'absolute',
    },
    history: 'Protected since 1938 as one of London\'s most cherished views. The view was saved from obstruction by the Shell Building development.',
    significance: 'One of the eight strategic viewing places designated in the London Plan. Offers a dramatic panorama across London with St Paul\'s Cathedral as the focal point.',
  },
  {
    id: 'view-002',
    name: 'Kenwood House to St Paul\'s Cathedral',
    designation: 'strategic',
    borough: 'Camden',
    viewpoint: {
      name: 'Kenwood Viewing Gazebo',
      coordinates: { lat: 51.5714, lng: -0.1672 },
      description: 'Historic viewing point in Kenwood House grounds',
    },
    landmark: {
      name: 'St Paul\'s Cathedral',
      coordinates: { lat: 51.5138, lng: -0.0984 },
      type: 'Cathedral',
    },
    corridor: {
      width: 200,
      length: 7200,
      bearingDegrees: 148,
    },
    protection: {
      policyDocument: 'London View Management Framework',
      policyRef: 'LVMF 3.A.1',
      heightRestriction: 48.5, // AOD
      restrictionType: 'absolute',
    },
    history: 'Designated as a strategic view in the London Plan. The gazebo was specifically positioned to frame this historic view.',
    significance: 'A formal strategic viewing point offering views across Hampstead Heath to central London.',
  },
  {
    id: 'view-003',
    name: 'Hampstead Heath to Westminster',
    designation: 'local',
    borough: 'Camden',
    viewpoint: {
      name: 'Hampstead Heath High Point',
      coordinates: { lat: 51.5615, lng: -0.1642 },
      description: 'Various elevated points on Hampstead Heath',
    },
    landmark: {
      name: 'Westminster Abbey & Parliament',
      coordinates: { lat: 51.4994, lng: -0.1276 },
      type: 'Government/Religious',
    },
    corridor: {
      width: 300,
      length: 7000,
      bearingDegrees: 165,
    },
    protection: {
      policyDocument: 'Camden Local Plan',
      policyRef: 'D2 - Local Views',
      restrictionType: 'assessment-required',
    },
    history: 'Local view protected in Camden\'s local planning policies.',
    significance: 'Important local view connecting Hampstead Heath to the historic Westminster skyline.',
  },
  {
    id: 'view-004',
    name: 'Highgate Cemetery Views',
    designation: 'local',
    borough: 'Camden',
    viewpoint: {
      name: 'Highgate West Cemetery',
      coordinates: { lat: 51.5676, lng: -0.1477 },
      description: 'Historic Grade I listed cemetery',
    },
    landmark: {
      name: 'London Skyline',
      coordinates: { lat: 51.5138, lng: -0.1070 },
      type: 'Skyline',
    },
    corridor: {
      width: 400,
      length: 6000,
      bearingDegrees: 155,
    },
    protection: {
      policyDocument: 'Camden Local Plan',
      policyRef: 'D2 - Local Views',
      restrictionType: 'assessment-required',
    },
    history: 'Protected to preserve the unique character of the historic cemetery and its relationship with the London skyline.',
    significance: 'Gothic Victorian cemetery with important views integral to its Grade I listed character.',
  },
  {
    id: 'view-005',
    name: 'Alexandra Palace to Central London',
    designation: 'panoramic',
    borough: 'Haringey',
    viewpoint: {
      name: 'Alexandra Palace Terrace',
      coordinates: { lat: 51.5942, lng: -0.1300 },
      description: 'South-facing terrace of Alexandra Palace',
    },
    landmark: {
      name: 'Central London Panorama',
      coordinates: { lat: 51.5074, lng: -0.1278 },
      type: 'Skyline',
    },
    corridor: {
      width: 800,
      length: 9500,
      bearingDegrees: 180,
    },
    protection: {
      policyDocument: 'Haringey Local Plan',
      policyRef: 'DM5 - Views',
      restrictionType: 'assessment-required',
    },
    history: 'One of the finest panoramic views of London, enjoyed since the palace opened in 1873.',
    significance: 'Iconic 180-degree panorama taking in the entire London skyline from Canary Wharf to the BT Tower.',
  },
  {
    id: 'view-006',
    name: 'Primrose Hill Summit',
    designation: 'strategic',
    borough: 'Camden',
    viewpoint: {
      name: 'Primrose Hill Summit',
      coordinates: { lat: 51.5393, lng: -0.1605 },
      description: 'Summit of Primrose Hill',
    },
    landmark: {
      name: 'Westminster & City',
      coordinates: { lat: 51.5074, lng: -0.1150 },
      type: 'Skyline',
    },
    corridor: {
      width: 350,
      length: 4200,
      bearingDegrees: 160,
    },
    protection: {
      policyDocument: 'London View Management Framework',
      policyRef: 'LVMF 4.A.1',
      restrictionType: 'absolute',
    },
    history: 'A beloved local viewpoint commemorated with a dedication stone quoting William Blake.',
    significance: 'Offers one of the most accessible and comprehensive views of the London skyline.',
  },
  {
    id: 'view-007',
    name: 'Muswell Hill to City',
    designation: 'local',
    borough: 'Haringey',
    viewpoint: {
      name: 'Muswell Hill Broadway',
      coordinates: { lat: 51.5893, lng: -0.1419 },
      description: 'High point of Muswell Hill',
    },
    landmark: {
      name: 'City of London',
      coordinates: { lat: 51.5155, lng: -0.0922 },
      type: 'Skyline',
    },
    corridor: {
      width: 300,
      length: 8500,
      bearingDegrees: 158,
    },
    protection: {
      policyDocument: 'Haringey Local Plan',
      policyRef: 'DM5 - Views',
      restrictionType: 'guidance',
    },
    history: 'Recognized local view that contributes to the character of Muswell Hill.',
    significance: 'Characteristic view that reinforces the elevated position of Muswell Hill.',
  },
];

// ===========================================
// VIEW PROTECTION MONITOR SERVICE
// ===========================================

class ViewProtectionMonitorService {
  /**
   * Get all protected views in a borough
   */
  getViewsByBorough(borough: string): ProtectedView[] {
    return PROTECTED_VIEWS.filter(v => 
      v.borough.toLowerCase() === borough.toLowerCase()
    );
  }

  /**
   * Get view by ID
   */
  getView(id: string): ProtectedView | undefined {
    return PROTECTED_VIEWS.find(v => v.id === id);
  }

  /**
   * Assess impact of a property/development on protected views
   */
  assessViewImpact(
    address: string,
    postcode: string,
    coordinates: { lat: number; lng: number },
    proposedHeight?: number // AOD
  ): ViewAssessment {
    const affectedViews = PROTECTED_VIEWS.map(view => {
      const distanceFromCorridor = this.calculateDistanceFromCorridor(coordinates, view);
      const impactLevel = this.determineImpactLevel(distanceFromCorridor);
      
      return {
        view,
        distanceFromCorridor,
        impactLevel,
        restrictions: this.getRestrictions(view, impactLevel, proposedHeight),
        implications: this.getImplications(view, impactLevel),
      };
    }).filter(assessment => assessment.impactLevel !== 'none');

    const overallRisk = this.calculateOverallRisk(affectedViews);
    const recommendations = this.generateRecommendations(affectedViews, proposedHeight);
    const additionalStudies = this.getRequiredStudies(affectedViews);

    return {
      property: { address, postcode, coordinates },
      affectedViews,
      recommendations,
      overallRisk,
      additionalStudiesRequired: additionalStudies,
    };
  }

  /**
   * Calculate distance from view corridor (simplified)
   */
  private calculateDistanceFromCorridor(
    point: { lat: number; lng: number },
    view: ProtectedView
  ): number {
    // Simplified calculation - in production would use proper GIS
    const viewpoint = view.viewpoint.coordinates;
    const landmark = view.landmark.coordinates;
    
    // Calculate perpendicular distance from point to line between viewpoint and landmark
    const A = point.lat - viewpoint.lat;
    const B = point.lng - viewpoint.lng;
    const C = landmark.lat - viewpoint.lat;
    const D = landmark.lng - viewpoint.lng;
    
    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    const param = dot / lenSq;
    
    let xx, yy;
    if (param < 0) {
      xx = viewpoint.lat;
      yy = viewpoint.lng;
    } else if (param > 1) {
      xx = landmark.lat;
      yy = landmark.lng;
    } else {
      xx = viewpoint.lat + param * C;
      yy = viewpoint.lng + param * D;
    }
    
    const dx = point.lat - xx;
    const dy = point.lng - yy;
    
    // Convert to approximate meters (very rough for London)
    const distanceMeters = Math.sqrt(dx * dx + dy * dy) * 111000;
    
    // Return negative if inside corridor (based on corridor width)
    if (distanceMeters < view.corridor.width / 2) {
      return -(view.corridor.width / 2 - distanceMeters);
    }
    
    return distanceMeters - view.corridor.width / 2;
  }

  /**
   * Determine impact level based on distance
   */
  private determineImpactLevel(
    distance: number
  ): 'within-corridor' | 'adjacent' | 'nearby' | 'none' {
    if (distance < 0) return 'within-corridor';
    if (distance < 100) return 'adjacent';
    if (distance < 500) return 'nearby';
    return 'none';
  }

  /**
   * Get restrictions for a view impact
   */
  private getRestrictions(
    view: ProtectedView,
    impactLevel: string,
    proposedHeight?: number
  ): string[] {
    const restrictions: string[] = [];
    
    if (impactLevel === 'within-corridor') {
      restrictions.push(`Development within ${view.name} view corridor`);
      
      if (view.protection.restrictionType === 'absolute') {
        restrictions.push('Absolute height restriction applies');
        if (view.protection.heightRestriction) {
          restrictions.push(`Maximum height: ${view.protection.heightRestriction}m AOD`);
          if (proposedHeight && proposedHeight > view.protection.heightRestriction) {
            restrictions.push('⚠️ PROPOSED HEIGHT EXCEEDS LIMIT');
          }
        }
      }
      
      if (view.designation === 'strategic') {
        restrictions.push('Mayor consultation required');
        restrictions.push('LVMF assessment mandatory');
      }
    }
    
    if (impactLevel === 'adjacent') {
      if (view.protection.restrictionType !== 'guidance') {
        restrictions.push('View impact assessment likely required');
      }
    }
    
    return restrictions;
  }

  /**
   * Get implications for planning
   */
  private getImplications(view: ProtectedView, impactLevel: string): string[] {
    const implications: string[] = [];
    
    if (impactLevel === 'within-corridor' || impactLevel === 'adjacent') {
      implications.push(`Policy ${view.protection.policyRef} applies`);
      implications.push(`Refer to ${view.protection.policyDocument}`);
      
      if (view.designation === 'strategic') {
        implications.push('GLA referral likely required');
        implications.push('Longer determination period expected');
      }
    }
    
    return implications;
  }

  /**
   * Calculate overall risk
   */
  private calculateOverallRisk(
    affectedViews: ViewAssessment['affectedViews']
  ): 'high' | 'medium' | 'low' | 'none' {
    if (affectedViews.some(v => v.impactLevel === 'within-corridor' && v.view.designation === 'strategic')) {
      return 'high';
    }
    if (affectedViews.some(v => v.impactLevel === 'within-corridor')) {
      return 'medium';
    }
    if (affectedViews.some(v => v.impactLevel === 'adjacent')) {
      return 'low';
    }
    return 'none';
  }

  /**
   * Generate recommendations
   */
  private generateRecommendations(
    affectedViews: ViewAssessment['affectedViews'],
    proposedHeight?: number
  ): string[] {
    const recommendations: string[] = [];
    
    const hasStrategicView = affectedViews.some(v => 
      v.view.designation === 'strategic' && v.impactLevel !== 'none'
    );
    
    const hasCorridorImpact = affectedViews.some(v => v.impactLevel === 'within-corridor');
    
    if (hasStrategicView) {
      recommendations.push('Pre-application consultation with LPA essential');
      recommendations.push('Consider early GLA engagement');
      recommendations.push('Commission Accurate Visual Representations (AVRs)');
    }
    
    if (hasCorridorImpact) {
      recommendations.push('Townscape and Visual Impact Assessment required');
      recommendations.push('Consider reducing height or massing');
      recommendations.push('Explore design options that step back from view corridor');
    }
    
    if (affectedViews.length > 0 && !hasCorridorImpact) {
      recommendations.push('Mention proximity to view corridors in Design & Access Statement');
      recommendations.push('Include view analysis diagrams in application');
    }
    
    if (affectedViews.length === 0) {
      recommendations.push('No protected views identified as constraints');
      recommendations.push('Standard planning application process applies');
    }
    
    return recommendations;
  }

  /**
   * Get required studies
   */
  private getRequiredStudies(
    affectedViews: ViewAssessment['affectedViews']
  ): string[] {
    const studies: string[] = [];
    
    if (affectedViews.some(v => v.impactLevel === 'within-corridor')) {
      studies.push('Townscape and Visual Impact Assessment (TVIA)');
      studies.push('Accurate Visual Representations (AVRs) from key viewpoints');
      
      if (affectedViews.some(v => v.view.designation === 'strategic')) {
        studies.push('LVMF Compliance Assessment');
        studies.push('3D Verified Views');
      }
    }
    
    if (affectedViews.some(v => v.impactLevel === 'adjacent' && v.view.protection.restrictionType !== 'guidance')) {
      studies.push('View impact analysis');
      studies.push('Photomontages from key viewpoints');
    }
    
    return studies;
  }

  /**
   * Get all views affecting an area
   */
  getViewsAffectingArea(postcode: string): ProtectedView[] {
    // In production, this would use proper spatial queries
    const district = postcode.toUpperCase().split(' ')[0] ?? '';
    
    const areaMapping: Record<string, string[]> = {
      'NW3': ['view-001', 'view-002', 'view-003', 'view-004'],
      'N6': ['view-003', 'view-004'],
      'NW5': ['view-001', 'view-003'],
      'NW1': ['view-006'],
      'N10': ['view-005', 'view-007'],
      'N8': ['view-005'],
    };
    
    const viewIds = areaMapping[district] ?? [];
    return viewIds.map((id: string) => this.getView(id)).filter((v): v is ProtectedView => v !== undefined);
  }
}

// Export singleton
export const viewProtectionMonitor = new ViewProtectionMonitorService();
