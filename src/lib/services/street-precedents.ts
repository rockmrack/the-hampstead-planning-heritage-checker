/**
 * Street-Level Precedent Database
 * Shows exactly what neighbors got approved on the same street
 */

export interface StreetPrecedent {
  id: string;
  reference: string;
  address: string;
  houseNumber: string;
  streetName: string;
  postcode: string;
  
  // Application details
  applicationType: ApplicationType;
  description: string;
  proposedWorks: string[];
  
  // Decision
  decision: 'approved' | 'refused' | 'withdrawn' | 'pending';
  decisionDate?: string;
  conditions?: string[];
  refusalReasons?: string[];
  
  // Details
  extensionDepth?: number;
  extensionHeight?: number;
  extensionArea?: number;
  roofType?: string;
  materials?: {
    walls?: string;
    roof?: string;
    windows?: string;
  };
  
  // Heritage context
  heritageStatus: 'RED' | 'AMBER' | 'GREEN';
  conservationArea?: string;
  listedGrade?: string;
  
  // Officer info (anonymized)
  officerId?: string;
  delegated: boolean;
  wentToCommittee: boolean;
  
  // Appeal
  appealed: boolean;
  appealOutcome?: 'allowed' | 'dismissed' | 'withdrawn';
  
  // Metrics
  daysToDecision: number;
  neighborObjections: number;
  supportLetters: number;
  
  // Media
  beforePhoto?: string;
  afterPhoto?: string;
  planDrawings?: string[];
  
  // Coordinates for mapping
  coordinates: { lat: number; lng: number };
}

export type ApplicationType = 
  | 'householder'
  | 'full'
  | 'outline'
  | 'prior-approval'
  | 'listed-building'
  | 'conservation-area'
  | 'certificate-of-lawfulness'
  | 'tree-works'
  | 'advertisement';

export interface StreetAnalysis {
  streetName: string;
  postcode: string;
  borough: string;
  
  // Stats
  totalApplications: number;
  approvalRate: number;
  averageDecisionTime: number;
  
  // Breakdowns
  byType: Record<string, { count: number; approvalRate: number }>;
  byYear: Record<string, { count: number; approvalRate: number }>;
  
  // Common patterns
  mostCommonProjects: string[];
  averageExtensionDepth?: number;
  commonMaterials: string[];
  
  // Heritage
  conservationArea?: string;
  listedBuildingsCount: number;
  article4Active: boolean;
  
  // Precedents
  precedents: StreetPrecedent[];
  
  // Insights
  insights: StreetInsight[];
}

export interface StreetInsight {
  type: 'success_pattern' | 'warning' | 'opportunity' | 'trend';
  title: string;
  description: string;
  relevance: 'high' | 'medium' | 'low';
  examples?: string[];
}

export interface NearbyPrecedent extends StreetPrecedent {
  distanceMeters: number;
  bearing: string; // N, NE, E, etc.
}

// ===========================================
// PRECEDENT DATABASE SERVICE
// ===========================================

class StreetPrecedentService {
  private precedents: Map<string, StreetPrecedent[]> = new Map();

  /**
   * Get all precedents for a specific street
   */
  async getStreetPrecedents(
    streetName: string,
    postcode: string
  ): Promise<StreetAnalysis> {
    // In production, this queries the planning applications database
    const streetKey = this.normalizeStreetKey(streetName, postcode);
    
    // Simulated data for NW London streets
    const precedents = this.getSimulatedPrecedents(streetName, postcode);
    
    const approved = precedents.filter(p => p.decision === 'approved');
    const refused = precedents.filter(p => p.decision === 'refused');
    
    // Calculate stats
    const byType = this.groupByType(precedents);
    const byYear = this.groupByYear(precedents);
    
    // Generate insights
    const insights = this.generateInsights(precedents);
    
    return {
      streetName,
      postcode,
      borough: this.getBoroughFromPostcode(postcode),
      totalApplications: precedents.length,
      approvalRate: precedents.length > 0 
        ? (approved.length / precedents.length) * 100 
        : 0,
      averageDecisionTime: this.calculateAverageDecisionTime(precedents),
      byType,
      byYear,
      mostCommonProjects: this.getMostCommonProjects(precedents),
      averageExtensionDepth: this.getAverageExtensionDepth(precedents),
      commonMaterials: this.getCommonMaterials(precedents),
      conservationArea: this.getConservationArea(postcode),
      listedBuildingsCount: precedents.filter(p => p.heritageStatus === 'RED').length,
      article4Active: this.isArticle4Active(postcode),
      precedents,
      insights,
    };
  }

  /**
   * Get precedents near a specific location
   */
  async getNearbyPrecedents(
    lat: number,
    lng: number,
    radiusMeters: number = 100,
    projectType?: string
  ): Promise<NearbyPrecedent[]> {
    // In production, this uses PostGIS ST_DWithin
    const allPrecedents = this.getAllPrecedentsInArea(lat, lng, radiusMeters);
    
    return allPrecedents
      .filter(p => !projectType || p.applicationType === projectType)
      .map(p => ({
        ...p,
        distanceMeters: this.calculateDistance(lat, lng, p.coordinates.lat, p.coordinates.lng),
        bearing: this.calculateBearing(lat, lng, p.coordinates.lat, p.coordinates.lng),
      }))
      .sort((a, b) => a.distanceMeters - b.distanceMeters);
  }

  /**
   * Get precedents for similar project types
   */
  async getSimilarProjectPrecedents(
    lat: number,
    lng: number,
    projectType: string,
    propertyType: string,
    heritageStatus: 'RED' | 'AMBER' | 'GREEN'
  ): Promise<{
    exactMatches: NearbyPrecedent[];
    similarMatches: NearbyPrecedent[];
    insights: string[];
  }> {
    const nearby = await this.getNearbyPrecedents(lat, lng, 500);
    
    const exactMatches = nearby.filter(p => 
      p.applicationType === projectType &&
      p.heritageStatus === heritageStatus
    );
    
    const similarMatches = nearby.filter(p =>
      p.applicationType === projectType &&
      !exactMatches.includes(p)
    );
    
    // Generate insights from the data
    const insights: string[] = [];
    
    if (exactMatches.length > 0) {
      const approvedExact = exactMatches.filter(p => p.decision === 'approved');
      insights.push(
        `${approvedExact.length} of ${exactMatches.length} similar projects nearby were approved`
      );
    }
    
    const approvedWithConditions = exactMatches.filter(p => 
      p.decision === 'approved' && p.conditions && p.conditions.length > 0
    );
    if (approvedWithConditions.length > 0) {
      const commonConditions = this.getCommonConditions(approvedWithConditions);
      insights.push(`Common conditions: ${commonConditions.slice(0, 3).join(', ')}`);
    }
    
    const refusedNearby = nearby.filter(p => p.decision === 'refused');
    if (refusedNearby.length > 0) {
      const commonReasons = this.getCommonRefusalReasons(refusedNearby);
      insights.push(`Watch out for: ${commonReasons.slice(0, 2).join(', ')}`);
    }
    
    return { exactMatches, similarMatches, insights };
  }

  /**
   * Get what specific house numbers on the street did
   */
  async getHouseHistory(
    houseNumber: string,
    streetName: string,
    postcode: string
  ): Promise<StreetPrecedent[]> {
    const streetPrecedents = await this.getStreetPrecedents(streetName, postcode);
    return streetPrecedents.precedents.filter(p => 
      p.houseNumber.toLowerCase() === houseNumber.toLowerCase()
    );
  }

  // ===========================================
  // HELPER METHODS
  // ===========================================

  private normalizeStreetKey(street: string, postcode: string): string {
    return `${street.toLowerCase().replace(/\s+/g, '-')}_${postcode.split(' ')[0].toLowerCase()}`;
  }

  private getBoroughFromPostcode(postcode: string): string {
    const district = postcode.toUpperCase().split(' ')[0];
    const boroughMap: Record<string, string> = {
      'NW1': 'Camden',
      'NW2': 'Brent',
      'NW3': 'Camden',
      'NW4': 'Barnet',
      'NW5': 'Camden',
      'NW6': 'Brent',
      'NW7': 'Barnet',
      'NW8': 'Westminster',
      'NW9': 'Brent',
      'NW10': 'Brent',
      'NW11': 'Barnet',
      'N1': 'Islington',
      'N2': 'Barnet',
      'N3': 'Barnet',
      'N4': 'Haringey',
      'N5': 'Islington',
      'N6': 'Camden',
      'N7': 'Islington',
      'N8': 'Haringey',
      'N10': 'Haringey',
      'N19': 'Islington',
    };
    return boroughMap[district] || 'Unknown';
  }

  private getConservationArea(postcode: string): string | undefined {
    const district = postcode.toUpperCase().split(' ')[0];
    const caMap: Record<string, string> = {
      'NW3': 'Hampstead Conservation Area',
      'N6': 'Highgate Conservation Area',
      'N10': 'Muswell Hill Conservation Area',
      'N8': 'Crouch End Conservation Area',
      'NW1': 'Primrose Hill Conservation Area',
      'NW8': 'St John\'s Wood Conservation Area',
    };
    return caMap[district];
  }

  private isArticle4Active(postcode: string): boolean {
    const article4Areas = ['NW3', 'N6', 'NW1', 'NW8'];
    return article4Areas.includes(postcode.toUpperCase().split(' ')[0]);
  }

  private groupByType(precedents: StreetPrecedent[]): Record<string, { count: number; approvalRate: number }> {
    const groups: Record<string, StreetPrecedent[]> = {};
    precedents.forEach(p => {
      if (!groups[p.applicationType]) groups[p.applicationType] = [];
      groups[p.applicationType].push(p);
    });
    
    const result: Record<string, { count: number; approvalRate: number }> = {};
    Object.entries(groups).forEach(([type, list]) => {
      const approved = list.filter(p => p.decision === 'approved').length;
      result[type] = {
        count: list.length,
        approvalRate: (approved / list.length) * 100,
      };
    });
    return result;
  }

  private groupByYear(precedents: StreetPrecedent[]): Record<string, { count: number; approvalRate: number }> {
    const groups: Record<string, StreetPrecedent[]> = {};
    precedents.forEach(p => {
      if (p.decisionDate) {
        const year = new Date(p.decisionDate).getFullYear().toString();
        if (!groups[year]) groups[year] = [];
        groups[year].push(p);
      }
    });
    
    const result: Record<string, { count: number; approvalRate: number }> = {};
    Object.entries(groups).forEach(([year, list]) => {
      const approved = list.filter(p => p.decision === 'approved').length;
      result[year] = {
        count: list.length,
        approvalRate: (approved / list.length) * 100,
      };
    });
    return result;
  }

  private generateInsights(precedents: StreetPrecedent[]): StreetInsight[] {
    const insights: StreetInsight[] = [];
    
    // Approval rate insight
    const approved = precedents.filter(p => p.decision === 'approved');
    const approvalRate = precedents.length > 0 ? (approved.length / precedents.length) * 100 : 0;
    
    if (approvalRate > 80) {
      insights.push({
        type: 'success_pattern',
        title: 'High Approval Street',
        description: `${approvalRate.toFixed(0)}% of applications on this street are approved - planners are receptive to improvements here.`,
        relevance: 'high',
      });
    } else if (approvalRate < 50) {
      insights.push({
        type: 'warning',
        title: 'Challenging Area',
        description: `Only ${approvalRate.toFixed(0)}% approval rate - careful design and pre-application advice strongly recommended.`,
        relevance: 'high',
      });
    }
    
    // Extension depth insight
    const extensions = precedents.filter(p => p.extensionDepth);
    if (extensions.length > 0) {
      const avgDepth = extensions.reduce((sum, p) => sum + (p.extensionDepth || 0), 0) / extensions.length;
      insights.push({
        type: 'success_pattern',
        title: 'Typical Extension Depth',
        description: `Average approved extension depth on this street is ${avgDepth.toFixed(1)}m.`,
        relevance: 'high',
        examples: extensions.slice(0, 3).map(p => `#${p.houseNumber}: ${p.extensionDepth}m`),
      });
    }
    
    // Materials insight
    const commonMats = this.getCommonMaterials(precedents);
    if (commonMats.length > 0) {
      insights.push({
        type: 'success_pattern',
        title: 'Approved Materials',
        description: `Most commonly approved materials: ${commonMats.slice(0, 3).join(', ')}.`,
        relevance: 'medium',
      });
    }
    
    // Recent trend
    const recentYear = new Date().getFullYear().toString();
    const recent = precedents.filter(p => p.decisionDate?.startsWith(recentYear));
    if (recent.length > 0) {
      const recentApprovalRate = (recent.filter(p => p.decision === 'approved').length / recent.length) * 100;
      if (recentApprovalRate > approvalRate + 10) {
        insights.push({
          type: 'trend',
          title: 'Improving Approval Trend',
          description: `Approval rate has improved to ${recentApprovalRate.toFixed(0)}% this year - planners may be more receptive.`,
          relevance: 'medium',
        });
      } else if (recentApprovalRate < approvalRate - 10) {
        insights.push({
          type: 'warning',
          title: 'Stricter Enforcement',
          description: `Approval rate has dropped to ${recentApprovalRate.toFixed(0)}% this year - higher design quality needed.`,
          relevance: 'high',
        });
      }
    }
    
    return insights;
  }

  private getMostCommonProjects(precedents: StreetPrecedent[]): string[] {
    const counts: Record<string, number> = {};
    precedents.forEach(p => {
      p.proposedWorks.forEach(work => {
        counts[work] = (counts[work] || 0) + 1;
      });
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([work]) => work);
  }

  private getAverageExtensionDepth(precedents: StreetPrecedent[]): number | undefined {
    const extensions = precedents.filter(p => p.extensionDepth && p.decision === 'approved');
    if (extensions.length === 0) return undefined;
    return extensions.reduce((sum, p) => sum + (p.extensionDepth || 0), 0) / extensions.length;
  }

  private getCommonMaterials(precedents: StreetPrecedent[]): string[] {
    const materials: Record<string, number> = {};
    precedents.filter(p => p.decision === 'approved').forEach(p => {
      if (p.materials) {
        Object.values(p.materials).forEach(m => {
          if (m) materials[m] = (materials[m] || 0) + 1;
        });
      }
    });
    return Object.entries(materials)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([mat]) => mat);
  }

  private getCommonConditions(precedents: StreetPrecedent[]): string[] {
    const conditions: Record<string, number> = {};
    precedents.forEach(p => {
      p.conditions?.forEach(c => {
        conditions[c] = (conditions[c] || 0) + 1;
      });
    });
    return Object.entries(conditions)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([cond]) => cond);
  }

  private getCommonRefusalReasons(precedents: StreetPrecedent[]): string[] {
    const reasons: Record<string, number> = {};
    precedents.filter(p => p.decision === 'refused').forEach(p => {
      p.refusalReasons?.forEach(r => {
        reasons[r] = (reasons[r] || 0) + 1;
      });
    });
    return Object.entries(reasons)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([reason]) => reason);
  }

  private calculateAverageDecisionTime(precedents: StreetPrecedent[]): number {
    const withTime = precedents.filter(p => p.daysToDecision > 0);
    if (withTime.length === 0) return 56; // Default 8 weeks
    return withTime.reduce((sum, p) => sum + p.daysToDecision, 0) / withTime.length;
  }

  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371000; // Earth's radius in meters
    const dLat = this.toRad(lat2 - lat1);
    const dLng = this.toRad(lng2 - lng1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private calculateBearing(lat1: number, lng1: number, lat2: number, lng2: number): string {
    const dLng = this.toRad(lng2 - lng1);
    const y = Math.sin(dLng) * Math.cos(this.toRad(lat2));
    const x = Math.cos(this.toRad(lat1)) * Math.sin(this.toRad(lat2)) -
              Math.sin(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) * Math.cos(dLng);
    let bearing = Math.atan2(y, x) * 180 / Math.PI;
    bearing = (bearing + 360) % 360;
    
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    return directions[Math.round(bearing / 45) % 8];
  }

  private toRad(deg: number): number {
    return deg * Math.PI / 180;
  }

  // ===========================================
  // SIMULATED DATA (Would be real DB in production)
  // ===========================================

  private getSimulatedPrecedents(streetName: string, postcode: string): StreetPrecedent[] {
    // Generate realistic precedents for NW London streets
    const baseData: Partial<StreetPrecedent>[] = [
      {
        applicationType: 'householder',
        proposedWorks: ['Single storey rear extension', 'New patio doors'],
        decision: 'approved',
        extensionDepth: 4,
        extensionHeight: 3,
        materials: { walls: 'London stock brick', roof: 'Flat roof with skylights' },
        daysToDecision: 52,
        neighborObjections: 0,
      },
      {
        applicationType: 'householder',
        proposedWorks: ['Loft conversion', 'Rear dormer'],
        decision: 'approved',
        extensionHeight: 2.5,
        materials: { walls: 'Lead cladding', roof: 'Slate to match existing' },
        daysToDecision: 48,
        neighborObjections: 1,
        conditions: ['Obscure glazing to side windows', 'Materials to match existing'],
      },
      {
        applicationType: 'householder',
        proposedWorks: ['Two storey rear extension'],
        decision: 'refused',
        extensionDepth: 5,
        extensionHeight: 6,
        refusalReasons: ['Overdevelopment of site', 'Loss of light to neighboring property'],
        daysToDecision: 56,
        neighborObjections: 3,
      },
      {
        applicationType: 'householder',
        proposedWorks: ['Side return extension', 'Kitchen extension'],
        decision: 'approved',
        extensionDepth: 6,
        extensionHeight: 3,
        materials: { walls: 'Brick to match', roof: 'Flat green roof' },
        daysToDecision: 45,
        neighborObjections: 0,
      },
      {
        applicationType: 'prior-approval',
        proposedWorks: ['Single storey rear extension'],
        decision: 'approved',
        extensionDepth: 6,
        daysToDecision: 42,
        neighborObjections: 0,
      },
    ];

    const heritageStatus = this.getConservationArea(postcode) ? 'AMBER' : 'GREEN';
    
    return baseData.map((data, index) => ({
      id: `prec_${streetName.replace(/\s+/g, '_')}_${index}`,
      reference: `2023/${1000 + index}/HSE`,
      address: `${10 + index * 2} ${streetName}, ${postcode}`,
      houseNumber: `${10 + index * 2}`,
      streetName,
      postcode,
      description: data.proposedWorks?.join(' and ') || '',
      heritageStatus,
      conservationArea: this.getConservationArea(postcode),
      delegated: true,
      wentToCommittee: false,
      appealed: data.decision === 'refused' && Math.random() > 0.7,
      supportLetters: Math.floor(Math.random() * 3),
      coordinates: {
        lat: 51.55 + Math.random() * 0.02,
        lng: -0.17 + Math.random() * 0.02,
      },
      decisionDate: `2023-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-15`,
      ...data,
    } as StreetPrecedent));
  }

  private getAllPrecedentsInArea(lat: number, lng: number, radius: number): StreetPrecedent[] {
    // In production, this queries PostGIS
    const streets = [
      'Flask Walk',
      'Well Walk',
      'Church Row',
      'Holly Walk',
      'Willow Road',
      'Downshire Hill',
      'Keats Grove',
    ];
    
    const allPrecedents: StreetPrecedent[] = [];
    streets.forEach(street => {
      const precedents = this.getSimulatedPrecedents(street, 'NW3 1XX');
      allPrecedents.push(...precedents);
    });
    
    return allPrecedents;
  }
}

// Export singleton
export const streetPrecedentService = new StreetPrecedentService();
