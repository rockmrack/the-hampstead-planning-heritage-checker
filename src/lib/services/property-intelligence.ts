/**
 * Property Intelligence Service
 * Enhanced property data aggregation from multiple sources
 */

export interface EPCRating {
  currentRating: string;
  potentialRating: string;
  currentScore: number;
  potentialScore: number;
  validUntil: string;
  certificateNumber: string;
  
  // Detailed metrics
  wallsRating: string;
  roofRating: string;
  windowsRating: string;
  heatingRating: string;
  
  // Recommendations
  recommendations: Array<{
    measure: string;
    typicalSaving: string;
    indicativeCost: string;
    rating: string;
  }>;
}

export interface FloodRisk {
  overallRisk: 'very_low' | 'low' | 'medium' | 'high';
  riverAndSea: {
    risk: 'very_low' | 'low' | 'medium' | 'high';
    description: string;
  };
  surfaceWater: {
    risk: 'very_low' | 'low' | 'medium' | 'high';
    description: string;
  };
  reservoirs: {
    risk: boolean;
    description: string;
  };
  groundwater: {
    risk: boolean;
    description: string;
  };
  floodDefences: boolean;
  historicalFlooding: boolean;
  lastUpdated: string;
}

export interface PlanningHistory {
  totalApplications: number;
  approvalRate: number;
  applications: Array<{
    reference: string;
    description: string;
    type: string;
    status: 'approved' | 'refused' | 'withdrawn' | 'pending';
    decision?: string;
    decisionDate?: string;
    appealResult?: 'allowed' | 'dismissed' | 'withdrawn';
    documents?: Array<{
      name: string;
      url: string;
      type: string;
    }>;
  }>;
}

export interface NeighborhoodApplications {
  radius: number; // meters
  totalCount: number;
  last12Months: number;
  approvalRate: number;
  applications: Array<{
    reference: string;
    address: string;
    distance: number;
    type: string;
    description: string;
    status: string;
    decisionDate?: string;
  }>;
  trends: {
    extensionsApprovalRate: number;
    listingApprovalRate: number;
    newBuildApprovalRate: number;
    mostCommonType: string;
  };
}

export interface PropertyComparables {
  properties: Array<{
    address: string;
    distance: number;
    propertyType: string;
    similarityScore: number;
    recentApplication?: {
      type: string;
      outcome: string;
      date: string;
    };
    heritageStatus: {
      isListed: boolean;
      conservationArea: boolean;
    };
  }>;
}

export interface EnvironmentalData {
  airQuality: {
    index: number;
    level: 'low' | 'moderate' | 'high' | 'very_high';
    lastUpdated: string;
  };
  noiseLevel: {
    dayDecibels: number;
    nightDecibels: number;
    category: 'quiet' | 'moderate' | 'noisy' | 'very_noisy';
  };
  greenSpace: {
    nearestPark: {
      name: string;
      distance: number;
    };
    treePreservationOrders: number;
    protectedLand: boolean;
  };
}

export interface InfrastructureData {
  transport: {
    nearestStation: {
      name: string;
      distance: number;
      lines: string[];
    };
    nearestBusStop: {
      distance: number;
      routes: string[];
    };
    ptaAccessLevel: number; // 1-6
  };
  schools: Array<{
    name: string;
    type: string;
    distance: number;
    rating: string;
  }>;
  hospitals: Array<{
    name: string;
    type: string;
    distance: number;
  }>;
}

export interface DemographicData {
  population: number;
  averageAge: number;
  ownerOccupied: number;
  rented: number;
  socialHousing: number;
  averageIncome?: number;
  crimeRate: {
    category: string;
    rate: number;
    trend: 'increasing' | 'stable' | 'decreasing';
  };
}

export interface ComprehensivePropertyReport {
  propertyId: string;
  address: {
    line1: string;
    line2?: string;
    town: string;
    postcode: string;
    coordinates: { lat: number; lng: number };
  };
  
  // Core property data
  propertyType: string;
  tenure: string;
  buildYear?: number;
  floorArea?: number;
  bedrooms?: number;
  
  // Heritage status
  heritage: {
    isListed: boolean;
    listingGrade?: 'I' | 'II*' | 'II';
    conservationArea: boolean;
    conservationAreaName?: string;
    archaeologicalPriorityArea: boolean;
    apaPriority?: string;
    locallyListed: boolean;
  };
  
  // Energy & Environment
  epc?: EPCRating;
  floodRisk: FloodRisk;
  environmental: EnvironmentalData;
  
  // Planning context
  planningHistory: PlanningHistory;
  neighborhoodApplications: NeighborhoodApplications;
  comparables: PropertyComparables;
  
  // Infrastructure
  infrastructure: InfrastructureData;
  demographics: DemographicData;
  
  // Valuation indicators
  valuation?: {
    estimatedValue: number;
    confidence: 'low' | 'medium' | 'high';
    lastSalePrice?: number;
    lastSaleDate?: string;
    pricePerSqFt?: number;
    areaAverage?: number;
  };
  
  // Risk assessment
  riskScore: {
    overall: number; // 0-100
    heritage: number;
    planning: number;
    environmental: number;
    structural: number;
  };
  
  // Metadata
  reportGeneratedAt: string;
  dataSources: string[];
  dataFreshness: Record<string, string>;
}

// ===========================================
// PROPERTY INTELLIGENCE SERVICE
// ===========================================

class PropertyIntelligenceService {
  /**
   * Fetch EPC data from the EPC register API
   */
  async getEPCData(postcode: string, addressLine1: string): Promise<EPCRating | null> {
    // In production, this would call the EPC API
    // https://epc.opendatacommunities.org/
    
    // Simulated response
    return {
      currentRating: 'D',
      potentialRating: 'B',
      currentScore: 58,
      potentialScore: 81,
      validUntil: '2032-06-15',
      certificateNumber: 'XXXX-XXXX-XXXX-XXXX-XXXX',
      wallsRating: 'D',
      roofRating: 'C',
      windowsRating: 'D',
      heatingRating: 'C',
      recommendations: [
        {
          measure: 'Install double glazing',
          typicalSaving: '£120/year',
          indicativeCost: '£3,000 - £5,000',
          rating: 'B',
        },
        {
          measure: 'Add loft insulation',
          typicalSaving: '£80/year',
          indicativeCost: '£300 - £500',
          rating: 'A',
        },
      ],
    };
  }

  /**
   * Fetch flood risk data from Environment Agency
   */
  async getFloodRisk(lat: number, lng: number): Promise<FloodRisk> {
    // In production, this would call the Environment Agency Flood API
    // https://environment.data.gov.uk/flood-monitoring/doc/reference
    
    return {
      overallRisk: 'low',
      riverAndSea: {
        risk: 'very_low',
        description: 'Chance of flooding each year is less than 1 in 1000 (0.1%)',
      },
      surfaceWater: {
        risk: 'low',
        description: 'Chance of flooding each year is between 1 in 100 (1%) and 1 in 1000 (0.1%)',
      },
      reservoirs: {
        risk: false,
        description: 'No risk from reservoir flooding',
      },
      groundwater: {
        risk: false,
        description: 'No significant groundwater flooding risk',
      },
      floodDefences: false,
      historicalFlooding: false,
      lastUpdated: new Date().toISOString(),
    };
  }

  /**
   * Get planning application history for a property
   */
  async getPlanningHistory(
    uprn: string,
    lpa: string
  ): Promise<PlanningHistory> {
    // In production, this would call the LPA planning API
    // or use the Planning Data platform
    
    return {
      totalApplications: 3,
      approvalRate: 66.7,
      applications: [
        {
          reference: '2023/1234/HSE',
          description: 'Single storey rear extension',
          type: 'Householder',
          status: 'approved',
          decision: 'Granted with conditions',
          decisionDate: '2023-08-15',
        },
        {
          reference: '2019/5678/HSE',
          description: 'Loft conversion with rear dormer',
          type: 'Householder',
          status: 'approved',
          decision: 'Granted',
          decisionDate: '2019-03-22',
        },
        {
          reference: '2015/9012/HSE',
          description: 'Two storey side extension',
          type: 'Householder',
          status: 'refused',
          decision: 'Refused - impact on conservation area',
          decisionDate: '2015-11-30',
        },
      ],
    };
  }

  /**
   * Get nearby planning applications
   */
  async getNeighborhoodApplications(
    lat: number,
    lng: number,
    radiusMeters: number = 100
  ): Promise<NeighborhoodApplications> {
    return {
      radius: radiusMeters,
      totalCount: 45,
      last12Months: 12,
      approvalRate: 78.5,
      applications: [
        {
          reference: '2024/0456/HSE',
          address: '15 Example Road',
          distance: 25,
          type: 'Householder',
          description: 'Rear extension',
          status: 'Approved',
          decisionDate: '2024-01-15',
        },
        {
          reference: '2024/0123/LBC',
          address: '8 Example Road',
          distance: 40,
          type: 'Listed Building Consent',
          description: 'Internal alterations',
          status: 'Pending',
        },
      ],
      trends: {
        extensionsApprovalRate: 82.3,
        listingApprovalRate: 68.5,
        newBuildApprovalRate: 45.2,
        mostCommonType: 'Householder extensions',
      },
    };
  }

  /**
   * Find comparable properties
   */
  async getComparables(
    lat: number,
    lng: number,
    propertyType: string,
    radiusMeters: number = 200
  ): Promise<PropertyComparables> {
    return {
      properties: [
        {
          address: '12 Example Road',
          distance: 30,
          propertyType: 'Terraced',
          similarityScore: 92,
          recentApplication: {
            type: 'Loft conversion',
            outcome: 'Approved',
            date: '2023-05-10',
          },
          heritageStatus: {
            isListed: false,
            conservationArea: true,
          },
        },
        {
          address: '18 Example Road',
          distance: 45,
          propertyType: 'Terraced',
          similarityScore: 88,
          recentApplication: {
            type: 'Rear extension',
            outcome: 'Approved',
            date: '2022-09-20',
          },
          heritageStatus: {
            isListed: false,
            conservationArea: true,
          },
        },
      ],
    };
  }

  /**
   * Get environmental data
   */
  async getEnvironmentalData(lat: number, lng: number): Promise<EnvironmentalData> {
    // In production would call DEFRA, local authority APIs
    
    return {
      airQuality: {
        index: 3,
        level: 'moderate',
        lastUpdated: new Date().toISOString(),
      },
      noiseLevel: {
        dayDecibels: 55,
        nightDecibels: 45,
        category: 'moderate',
      },
      greenSpace: {
        nearestPark: {
          name: 'Hampstead Heath',
          distance: 500,
        },
        treePreservationOrders: 2,
        protectedLand: false,
      },
    };
  }

  /**
   * Get infrastructure data
   */
  async getInfrastructureData(lat: number, lng: number): Promise<InfrastructureData> {
    return {
      transport: {
        nearestStation: {
          name: 'Hampstead',
          distance: 400,
          lines: ['Northern'],
        },
        nearestBusStop: {
          distance: 100,
          routes: ['268', '603'],
        },
        ptaAccessLevel: 5,
      },
      schools: [
        {
          name: 'Hampstead Parochial Primary School',
          type: 'Primary',
          distance: 300,
          rating: 'Outstanding',
        },
      ],
      hospitals: [
        {
          name: 'Royal Free Hospital',
          type: 'General',
          distance: 1200,
        },
      ],
    };
  }

  /**
   * Generate comprehensive property report
   */
  async generateComprehensiveReport(
    address: string,
    postcode: string,
    coordinates: { lat: number; lng: number }
  ): Promise<ComprehensivePropertyReport> {
    // Fetch all data in parallel
    const [
      epc,
      floodRisk,
      planningHistory,
      neighborhoodApps,
      comparables,
      environmental,
      infrastructure,
    ] = await Promise.all([
      this.getEPCData(postcode, address),
      this.getFloodRisk(coordinates.lat, coordinates.lng),
      this.getPlanningHistory('', ''),
      this.getNeighborhoodApplications(coordinates.lat, coordinates.lng),
      this.getComparables(coordinates.lat, coordinates.lng, 'Terraced'),
      this.getEnvironmentalData(coordinates.lat, coordinates.lng),
      this.getInfrastructureData(coordinates.lat, coordinates.lng),
    ]);

    // Calculate risk scores
    const heritageRisk = 50; // Would be calculated based on heritage constraints
    const planningRisk = 100 - (planningHistory.approvalRate || 70);
    const environmentalRisk = this.calculateEnvironmentalRisk(floodRisk, environmental);
    const structuralRisk = 20; // Would be based on age, condition, etc.
    
    const overallRisk = Math.round(
      (heritageRisk * 0.3 + planningRisk * 0.3 + environmentalRisk * 0.25 + structuralRisk * 0.15)
    );

    return {
      propertyId: `prop_${Date.now()}`,
      address: {
        line1: address,
        town: 'London',
        postcode,
        coordinates,
      },
      propertyType: 'Terraced',
      tenure: 'Freehold',
      heritage: {
        isListed: false,
        conservationArea: true,
        conservationAreaName: 'Hampstead Conservation Area',
        archaeologicalPriorityArea: false,
        locallyListed: false,
      },
      epc: epc || undefined,
      floodRisk,
      environmental,
      planningHistory,
      neighborhoodApplications: neighborhoodApps,
      comparables,
      infrastructure,
      demographics: {
        population: 8500,
        averageAge: 42,
        ownerOccupied: 65,
        rented: 30,
        socialHousing: 5,
        crimeRate: {
          category: 'Low',
          rate: 45,
          trend: 'decreasing',
        },
      },
      riskScore: {
        overall: overallRisk,
        heritage: heritageRisk,
        planning: planningRisk,
        environmental: environmentalRisk,
        structural: structuralRisk,
      },
      reportGeneratedAt: new Date().toISOString(),
      dataSources: [
        'Historic England',
        'Environment Agency',
        'EPC Register',
        'Local Planning Authority',
        'ONS',
        'DEFRA',
      ],
      dataFreshness: {
        heritage: new Date().toISOString(),
        flood: new Date().toISOString(),
        planning: new Date().toISOString(),
      },
    };
  }

  private calculateEnvironmentalRisk(
    flood: FloodRisk,
    env: EnvironmentalData
  ): number {
    let risk = 0;
    
    // Flood risk contribution
    const floodRiskMap = { very_low: 0, low: 15, medium: 35, high: 60 };
    risk += floodRiskMap[flood.overallRisk] || 0;
    
    // Air quality contribution
    risk += env.airQuality.index * 5;
    
    // Noise contribution
    if (env.noiseLevel.dayDecibels > 65) risk += 15;
    else if (env.noiseLevel.dayDecibels > 55) risk += 5;
    
    return Math.min(risk, 100);
  }
}

// Export singleton
export const propertyIntelligenceService = new PropertyIntelligenceService();

// ===========================================
// API ROUTE HELPER
// ===========================================

export interface PropertyReportRequest {
  address: string;
  postcode: string;
  latitude: number;
  longitude: number;
  reportType?: 'full' | 'summary' | 'planning_only' | 'heritage_only';
}

export async function handlePropertyIntelligenceRequest(
  request: PropertyReportRequest
): Promise<ComprehensivePropertyReport | Partial<ComprehensivePropertyReport>> {
  const service = propertyIntelligenceService;
  
  const fullReport = await service.generateComprehensiveReport(
    request.address,
    request.postcode,
    { lat: request.latitude, lng: request.longitude }
  );
  
  // Return filtered report based on type
  switch (request.reportType) {
    case 'summary':
      return {
        propertyId: fullReport.propertyId,
        address: fullReport.address,
        heritage: fullReport.heritage,
        riskScore: fullReport.riskScore,
        reportGeneratedAt: fullReport.reportGeneratedAt,
      };
    
    case 'planning_only':
      return {
        propertyId: fullReport.propertyId,
        address: fullReport.address,
        planningHistory: fullReport.planningHistory,
        neighborhoodApplications: fullReport.neighborhoodApplications,
        comparables: fullReport.comparables,
      };
    
    case 'heritage_only':
      return {
        propertyId: fullReport.propertyId,
        address: fullReport.address,
        heritage: fullReport.heritage,
      };
    
    default:
      return fullReport;
  }
}
