/**
 * AI Photo Analysis Service
 * Analyze property photos to determine what's possible
 */

export interface PhotoAnalysisResult {
  id: string;
  imageUrl: string;
  timestamp: string;
  
  // Property identification
  property: {
    type: 'detached' | 'semi-detached' | 'terraced' | 'end-of-terrace' | 'flat' | 'maisonette' | 'bungalow';
    style: string; // Victorian, Edwardian, Georgian, 1930s, Modern, etc.
    estimatedAge: string;
    floors: number;
    roofType: 'pitched' | 'flat' | 'mansard' | 'hipped' | 'gambrel';
    condition: 'excellent' | 'good' | 'fair' | 'poor';
  };
  
  // Detected features
  features: {
    hasBasement: boolean;
    hasLoft: boolean;
    hasGarage: boolean;
    hasSideReturn: boolean;
    hasRearGarden: boolean;
    hasFrontGarden: boolean;
    parkingType: 'on-street' | 'driveway' | 'garage' | 'none';
    windowType: 'sash' | 'casement' | 'modern' | 'mixed';
    materialsFront: string[];
    roofMaterial: string;
  };
  
  // Heritage assessment
  heritage: {
    likelyListed: boolean;
    likelyConservationArea: boolean;
    periodFeatures: string[];
    characterContribution: 'positive' | 'neutral' | 'negative';
    sensitiveElements: string[];
  };
  
  // Extension possibilities
  possibilities: ExtensionPossibility[];
  
  // Constraints identified
  constraints: {
    constraint: string;
    severity: 'blocking' | 'significant' | 'minor';
    mitigation?: string;
  }[];
  
  // Recommendations
  recommendations: {
    bestProject: string;
    reasoning: string;
    estimatedCost: { low: number; high: number };
    planningLikelihood: 'high' | 'medium' | 'low';
  };
  
  // Confidence
  confidence: {
    overall: number;
    propertyType: number;
    heritage: number;
    possibilities: number;
  };
}

export interface ExtensionPossibility {
  type: string;
  feasibility: 'excellent' | 'good' | 'possible' | 'difficult' | 'unlikely';
  planningRequired: boolean;
  estimatedSize: { min: number; max: number }; // sqm
  constraints: string[];
  opportunities: string[];
  visualImpact: 'minimal' | 'moderate' | 'significant';
}

export interface PhotoUpload {
  file: File;
  type: 'front' | 'rear' | 'side' | 'aerial' | 'interior' | 'other';
  description?: string;
}

// ===========================================
// PROPERTY ANALYSIS PATTERNS
// ===========================================

interface PropertyPattern {
  style: string;
  indicators: string[];
  typicalFeatures: string[];
  commonExtensions: string[];
  heritageConsiderations: string[];
  estimatedAge: string;
}

const PROPERTY_PATTERNS: PropertyPattern[] = [
  {
    style: 'Victorian Terrace',
    indicators: ['bay window', 'sash windows', 'slate roof', 'decorative brickwork', 'corbels', 'ridge tiles'],
    typicalFeatures: ['Front bay', 'Rear addition', 'Basement', 'Original fireplaces', 'Cornicing'],
    commonExtensions: ['Rear extension', 'Loft conversion', 'Side return infill', 'Basement'],
    heritageConsiderations: ['Often in conservation area', 'Original features valued', 'Street uniformity important'],
    estimatedAge: '1840-1901',
  },
  {
    style: 'Edwardian Semi',
    indicators: ['Arts and Crafts details', 'Mock Tudor gables', 'Larger windows', 'Red brick', 'Front porch'],
    typicalFeatures: ['Large rear garden', 'Side access', 'Existing loft space', 'Bay windows'],
    commonExtensions: ['Rear extension', 'Side extension', 'Loft with dormer', 'Wraparound'],
    heritageConsiderations: ['May have Article 4 restrictions', 'Front elevation changes restricted'],
    estimatedAge: '1901-1914',
  },
  {
    style: '1930s Semi',
    indicators: ['Bay windows', 'Hipped roof', 'Pebbledash', 'Curved bay', 'Leaded lights'],
    typicalFeatures: ['Integral garage', 'Larger plot', 'Good loft space', 'Side access'],
    commonExtensions: ['Rear extension', 'Garage conversion', 'Loft conversion', 'Side extension'],
    heritageConsiderations: ['Less heritage protection typically', 'May have local area character'],
    estimatedAge: '1920-1939',
  },
  {
    style: 'Georgian Townhouse',
    indicators: ['Symmetrical facade', 'Tall sash windows', 'Fanlight', 'Parapet', 'Stone details'],
    typicalFeatures: ['Basement level', 'High ceilings', 'Original shutters', 'Grand proportions'],
    commonExtensions: ['Basement extension', 'Rear conservatory', 'Careful rear extension'],
    heritageConsiderations: ['Often Grade II listed', 'LBC required', 'Strict material controls'],
    estimatedAge: '1714-1830',
  },
  {
    style: 'Post-War Modern',
    indicators: ['Flat roof sections', 'Large windows', 'Minimal detailing', 'Concrete elements'],
    typicalFeatures: ['Open plan potential', 'Flat roof', 'Limited character'],
    commonExtensions: ['Extensive rear extensions', 'First floor additions', 'Complete refurbishment'],
    heritageConsiderations: ['Rarely protected unless notable architect', 'More flexibility usually'],
    estimatedAge: '1945-1970',
  },
];

// ===========================================
// AI PHOTO ANALYSIS SERVICE
// ===========================================

class AIPhotoAnalysisService {
  /**
   * Analyze a property photo
   * In production, this would call an AI vision API
   */
  async analyzePhoto(
    imageUrl: string,
    photoType: 'front' | 'rear' | 'side' | 'aerial',
    postcode?: string
  ): Promise<PhotoAnalysisResult> {
    // Simulate AI analysis delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // In production, this would use GPT-4V, Claude Vision, or similar
    // For now, return simulated analysis based on common patterns
    
    const analysis = this.simulateAnalysis(imageUrl, photoType, postcode);
    return analysis;
  }

  /**
   * Simulate AI analysis (placeholder for actual AI integration)
   */
  private simulateAnalysis(
    imageUrl: string,
    photoType: 'front' | 'rear' | 'side' | 'aerial',
    postcode?: string
  ): PhotoAnalysisResult {
    // Determine likely property type based on postcode
    const district = postcode?.toUpperCase().split(' ')[0] || '';
    const isHighValue = ['NW3', 'N6', 'NW1', 'NW8'].includes(district);
    const isVictorian = ['NW3', 'N6', 'N8', 'NW5'].includes(district);
    
    const pattern = isVictorian ? PROPERTY_PATTERNS[0] : PROPERTY_PATTERNS[2];
    
    const propertyType = isVictorian ? 'terraced' : 'semi-detached';
    
    return {
      id: `analysis-${Date.now()}`,
      imageUrl,
      timestamp: new Date().toISOString(),
      
      property: {
        type: propertyType,
        style: pattern.style,
        estimatedAge: pattern.estimatedAge,
        floors: propertyType === 'terraced' ? 3 : 2,
        roofType: isVictorian ? 'pitched' : 'hipped',
        condition: 'good',
      },
      
      features: {
        hasBasement: isVictorian && isHighValue,
        hasLoft: true,
        hasGarage: !isVictorian,
        hasSideReturn: isVictorian && propertyType === 'terraced',
        hasRearGarden: true,
        hasFrontGarden: true,
        parkingType: isVictorian ? 'on-street' : 'driveway',
        windowType: isVictorian ? 'sash' : 'casement',
        materialsFront: ['London stock brick', 'slate roof'],
        roofMaterial: 'slate',
      },
      
      heritage: {
        likelyListed: isHighValue && isVictorian && Math.random() > 0.7,
        likelyConservationArea: isHighValue || isVictorian,
        periodFeatures: isVictorian 
          ? ['Original sash windows', 'Decorative cornicing', 'Bay window', 'Original front door']
          : ['Bay windows', 'Original tiles', 'Leaded glass'],
        characterContribution: 'positive',
        sensitiveElements: isVictorian
          ? ['Front elevation', 'Roof profile', 'Original windows', 'Front boundary']
          : ['Front elevation', 'Roof profile'],
      },
      
      possibilities: this.generatePossibilities(pattern, propertyType, isHighValue),
      
      constraints: this.generateConstraints(isVictorian, isHighValue),
      
      recommendations: {
        bestProject: isVictorian ? 'Side return infill + rear extension' : 'Loft conversion with rear dormer',
        reasoning: isVictorian
          ? 'Side return infill maximizes ground floor living space with minimal heritage impact. Can often be done under permitted development.'
          : 'Loft conversion adds significant space (typically 40sqm) with excellent ROI. Rear dormer keeps front elevation unchanged.',
        estimatedCost: isVictorian
          ? { low: 45000, high: 75000 }
          : { low: 55000, high: 85000 },
        planningLikelihood: 'high',
      },
      
      confidence: {
        overall: 75,
        propertyType: 85,
        heritage: 70,
        possibilities: 75,
      },
    };
  }

  /**
   * Generate extension possibilities
   */
  private generatePossibilities(
    pattern: PropertyPattern,
    propertyType: string,
    isHighValue: boolean
  ): ExtensionPossibility[] {
    const possibilities: ExtensionPossibility[] = [];
    
    // Rear extension
    possibilities.push({
      type: 'Rear Extension',
      feasibility: 'excellent',
      planningRequired: false, // Assume PD
      estimatedSize: { min: 15, max: 25 },
      constraints: ['Garden depth may limit size', 'Party wall agreements needed'],
      opportunities: ['Open plan kitchen-diner', 'Better garden connection'],
      visualImpact: 'minimal',
    });
    
    // Loft conversion
    possibilities.push({
      type: 'Loft Conversion',
      feasibility: 'good',
      planningRequired: propertyType === 'terraced',
      estimatedSize: { min: 30, max: 50 },
      constraints: ['Head height to verify', 'Party wall if semi/terrace'],
      opportunities: ['Master suite potential', 'Excellent ROI'],
      visualImpact: 'minimal',
    });
    
    // Side return (if applicable)
    if (propertyType === 'terraced') {
      possibilities.push({
        type: 'Side Return Extension',
        feasibility: 'excellent',
        planningRequired: false,
        estimatedSize: { min: 8, max: 15 },
        constraints: ['Width limited by existing alley', 'Neighbor notification'],
        opportunities: ['Dramatically wider kitchen', 'Quick build time'],
        visualImpact: 'minimal',
      });
    }
    
    // Basement (if high value area)
    if (isHighValue) {
      possibilities.push({
        type: 'Basement Extension',
        feasibility: 'possible',
        planningRequired: true,
        estimatedSize: { min: 40, max: 80 },
        constraints: ['High cost', 'Long build time', 'Structural complexity', 'Neighbor impact'],
        opportunities: ['Significant space gain', 'High value in this area', 'No visual impact'],
        visualImpact: 'minimal',
      });
    }
    
    // Garage conversion (if applicable)
    if (propertyType !== 'terraced') {
      possibilities.push({
        type: 'Garage Conversion',
        feasibility: 'good',
        planningRequired: false,
        estimatedSize: { min: 12, max: 20 },
        constraints: ['Loss of parking', 'May affect resale'],
        opportunities: ['Home office', 'Quick and cheap conversion'],
        visualImpact: 'moderate',
      });
    }
    
    return possibilities;
  }

  /**
   * Generate constraints
   */
  private generateConstraints(
    isVictorian: boolean,
    isHighValue: boolean
  ): PhotoAnalysisResult['constraints'][] {
    const constraints: PhotoAnalysisResult['constraints'][] = [];
    
    if (isVictorian) {
      constraints.push({
        constraint: 'Property appears to be in a Conservation Area',
        severity: 'significant',
        mitigation: 'Use traditional materials, avoid front elevation changes',
      });
    }
    
    if (isHighValue) {
      constraints.push({
        constraint: 'High-value area typically has stricter planning scrutiny',
        severity: 'minor',
        mitigation: 'Quality of design is paramount, consider pre-application',
      });
    }
    
    constraints.push({
      constraint: 'Party wall agreements likely required with neighbors',
      severity: 'minor',
      mitigation: 'Start party wall process 2 months before works',
    });
    
    if (isVictorian) {
      constraints.push({
        constraint: 'Original features (windows, doors) may have protection',
        severity: 'significant',
        mitigation: 'Document existing features, plan for retention or like-for-like replacement',
      });
    }
    
    return constraints;
  }

  /**
   * Analyze multiple photos for comprehensive assessment
   */
  async analyzeMultiplePhotos(
    photos: { url: string; type: 'front' | 'rear' | 'side' | 'aerial' }[],
    postcode?: string
  ): Promise<PhotoAnalysisResult> {
    // Analyze all photos
    const analyses = await Promise.all(
      photos.map(p => this.analyzePhoto(p.url, p.type, postcode))
    );
    
    // Merge analyses - in production, AI would synthesize these
    const primary = analyses[0];
    
    // Increase confidence if multiple photos
    primary.confidence.overall = Math.min(95, primary.confidence.overall + (photos.length - 1) * 5);
    
    return primary;
  }

  /**
   * Get analysis prompt for AI vision model
   * This would be used when integrating with actual AI
   */
  getAnalysisPrompt(photoType: string): string {
    return `Analyze this ${photoType} photograph of a residential property in London.

Please identify:
1. Property Type: Is it detached, semi-detached, terraced, end-of-terrace, flat, maisonette, or bungalow?
2. Architectural Style: Georgian, Victorian, Edwardian, 1930s, Post-war, Modern?
3. Roof Type: Pitched, flat, mansard, hipped?
4. Visible Features: Bay windows, dormers, extensions already present, garage, garden?
5. Materials: Brick type, render, roof material, window frames?
6. Period Features: Original windows, decorative details, historic elements?
7. Condition: General state of repair?

Based on what you can see, assess:
- Likelihood of being in a conservation area (based on architectural quality and street context)
- Possibility of listed building status (based on age and architectural merit)
- Extension potential: What types of extensions appear feasible?
- Constraints: What limitations are visible (plot size, neighbors, existing extensions)?

Return your analysis in structured JSON format.`;
  }
}

// Export singleton
export const aiPhotoAnalysis = new AIPhotoAnalysisService();
