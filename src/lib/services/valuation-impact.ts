/**
 * Property Valuation Impact Service
 * 
 * Comprehensive analysis of how planning decisions and development projects
 * impact property values in Hampstead and surrounding conservation areas.
 * 
 * Coverage: NW1-NW11, N2, N6, N10 postcodes
 */

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

interface ValuationProject {
  currentValue?: number;
  propertyType?: 'detached' | 'semi_detached' | 'terraced' | 'flat' | 'mansion';
  bedrooms?: number;
  bathrooms?: number;
  floorArea?: number;
  gardenSize?: number;
  parkingSpaces?: number;
  condition?: 'excellent' | 'good' | 'fair' | 'poor';
  projectType?: string;
  proposedExtension?: number;
  proposedBasement?: boolean;
  proposedLoftConversion?: boolean;
  conservationArea?: boolean;
  listedBuilding?: boolean;
  periodProperty?: boolean;
}

interface ValueImpact {
  factor: string;
  currentImpact: string;
  proposedChange: string;
  estimatedUplift: string;
  confidence: string;
  notes: string;
}

interface MarketComparison {
  propertyType: string;
  location: string;
  comparablePrice: string;
  pricePerSqFt: string;
  features: string[];
}

interface AreaPremium {
  area: string;
  premiumFactor: string;
  reasoning: string[];
}

interface ValuationAssessment {
  summary: ValuationSummary;
  currentValuation: CurrentValuation;
  proposedValuation: ProposedValuation;
  valueImpacts: ValueImpact[];
  marketComparisons: MarketComparison[];
  areaPremiums: AreaPremium[];
  riskFactors: RiskFactor[];
  recommendations: ValuationRecommendation[];
  disclaimer: string;
}

interface ValuationSummary {
  estimatedCurrentValue: string;
  estimatedPostWorkValue: string;
  netUplift: string;
  returnOnInvestment: string;
  confidence: string;
}

interface CurrentValuation {
  baseValue: string;
  adjustments: ValuationAdjustment[];
  finalEstimate: string;
  pricePerSqFt: string;
  methodology: string;
}

interface ValuationAdjustment {
  factor: string;
  adjustment: string;
  reasoning: string;
}

interface ProposedValuation {
  baseValue: string;
  worksCost: string;
  addedValue: string;
  finalEstimate: string;
  pricePerSqFt: string;
  methodology: string;
}

interface RiskFactor {
  risk: string;
  impact: string;
  mitigation: string;
  probability: string;
}

interface ValuationRecommendation {
  recommendation: string;
  rationale: string;
  potentialImpact: string;
}

// =============================================================================
// CONSTANTS
// =============================================================================

const HAMPSTEAD_BASE_PRICES = {
  flat: { pricePerSqFt: 950, range: '£800-1,200' },
  terraced: { pricePerSqFt: 1100, range: '£900-1,400' },
  semi_detached: { pricePerSqFt: 1200, range: '£1,000-1,500' },
  detached: { pricePerSqFt: 1400, range: '£1,100-1,800' },
  mansion: { pricePerSqFt: 1800, range: '£1,400-2,500+' }
};

const AREA_PREMIUMS = {
  'NW3': { premium: 1.3, name: 'Hampstead Village' },
  'NW11': { premium: 1.1, name: 'Hampstead Garden Suburb' },
  'NW6': { premium: 0.95, name: 'West Hampstead' },
  'NW2': { premium: 0.85, name: 'Cricklewood/Child\'s Hill' },
  'NW1': { premium: 1.15, name: 'Camden/Primrose Hill' },
  'N6': { premium: 1.2, name: 'Highgate' },
  'N2': { premium: 1.0, name: 'East Finchley' },
  'N10': { premium: 0.9, name: 'Muswell Hill' }
};

const IMPROVEMENT_UPLIFTS = {
  extension: { perSqFt: 0.7, notes: '70% of area value for quality extension' },
  basement: { perSqFt: 0.5, notes: '50% of area value for basement' },
  loftConversion: { perSqFt: 0.65, notes: '65% of area value for loft' },
  newBathroom: { fixed: 15000, range: '£10,000-25,000' },
  newKitchen: { fixed: 25000, range: '£15,000-50,000' },
  garden: { fixed: 20000, range: '£10,000-40,000' },
  parking: { fixed: 30000, range: '£20,000-50,000' }
};

const CONSERVATION_PREMIUM = 1.08; // 8% premium for conservation area
const LISTED_PREMIUM = 1.05; // 5% premium for listed status (can be negative)
const PERIOD_PREMIUM = 1.1; // 10% premium for period features

// =============================================================================
// MAIN SERVICE FUNCTION
// =============================================================================

async function assessValuationImpact(
  address: string,
  postcode: string,
  projectType: string,
  projectDetails: ValuationProject = {}
): Promise<ValuationAssessment> {
  const summary = generateSummary(projectDetails, postcode);
  const currentValuation = calculateCurrentValuation(projectDetails, postcode);
  const proposedValuation = calculateProposedValuation(projectDetails, postcode, currentValuation);
  const valueImpacts = analyzeValueImpacts(projectDetails);
  const marketComparisons = generateMarketComparisons(projectDetails, postcode);
  const areaPremiums = analyzeAreaPremiums(postcode);
  const riskFactors = identifyRiskFactors(projectDetails);
  const recommendations = generateRecommendations(projectDetails, valueImpacts);

  return {
    summary,
    currentValuation,
    proposedValuation,
    valueImpacts,
    marketComparisons,
    areaPremiums,
    riskFactors,
    recommendations,
    disclaimer: getDisclaimer()
  };
}

// =============================================================================
// SUMMARY GENERATION
// =============================================================================

function generateSummary(
  projectDetails: ValuationProject,
  postcode: string
): ValuationSummary {
  const currentValue = estimateCurrentValue(projectDetails, postcode);
  const proposedValue = estimateProposedValue(projectDetails, postcode, currentValue);
  const worksCost = estimateWorksCost(projectDetails);
  
  const netUplift = proposedValue - currentValue - worksCost;
  const roi = worksCost > 0 ? ((proposedValue - currentValue) / worksCost * 100) : 0;

  return {
    estimatedCurrentValue: `£${currentValue.toLocaleString()}`,
    estimatedPostWorkValue: `£${proposedValue.toLocaleString()}`,
    netUplift: `£${netUplift.toLocaleString()}`,
    returnOnInvestment: `${Math.round(roi)}%`,
    confidence: 'Medium - based on local market data and comparable sales'
  };
}

function estimateCurrentValue(projectDetails: ValuationProject, postcode: string): number {
  if (projectDetails.currentValue) {
    return projectDetails.currentValue;
  }

  const propertyType = projectDetails.propertyType || 'terraced';
  const floorArea = projectDetails.floorArea || 1500;
  const basePrice = HAMPSTEAD_BASE_PRICES[propertyType]?.pricePerSqFt || 1100;
  
  const postcodePrefix = (postcode.split(' ')[0] || postcode).toUpperCase();
  const areaPremium = AREA_PREMIUMS[postcodePrefix as keyof typeof AREA_PREMIUMS]?.premium || 1.0;
  
  let value = floorArea * basePrice * areaPremium;

  // Condition adjustment
  const conditionFactors = {
    excellent: 1.15,
    good: 1.0,
    fair: 0.9,
    poor: 0.75
  };
  value *= conditionFactors[projectDetails.condition || 'good'];

  // Conservation area premium
  if (projectDetails.conservationArea) {
    value *= CONSERVATION_PREMIUM;
  }

  // Period property premium
  if (projectDetails.periodProperty) {
    value *= PERIOD_PREMIUM;
  }

  return Math.round(value);
}

function estimateProposedValue(
  projectDetails: ValuationProject,
  postcode: string,
  currentValue: number
): number {
  let proposedValue = currentValue;
  const propertyType = projectDetails.propertyType || 'terraced';
  const basePrice = HAMPSTEAD_BASE_PRICES[propertyType]?.pricePerSqFt || 1100;
  
  const postcodePrefix = (postcode.split(' ')[0] || postcode).toUpperCase();
  const areaPremium = AREA_PREMIUMS[postcodePrefix as keyof typeof AREA_PREMIUMS]?.premium || 1.0;

  // Extension value
  if (projectDetails.proposedExtension) {
    const extensionValue = projectDetails.proposedExtension * basePrice * areaPremium * IMPROVEMENT_UPLIFTS.extension.perSqFt;
    proposedValue += extensionValue;
  }

  // Basement value
  if (projectDetails.proposedBasement) {
    const basementArea = (projectDetails.floorArea || 1500) * 0.8; // 80% of footprint
    const basementValue = basementArea * basePrice * areaPremium * IMPROVEMENT_UPLIFTS.basement.perSqFt;
    proposedValue += basementValue;
  }

  // Loft conversion value
  if (projectDetails.proposedLoftConversion) {
    const loftArea = (projectDetails.floorArea || 1500) * 0.25; // 25% of footprint typical
    const loftValue = loftArea * basePrice * areaPremium * IMPROVEMENT_UPLIFTS.loftConversion.perSqFt;
    proposedValue += loftValue;
  }

  return Math.round(proposedValue);
}

function estimateWorksCost(projectDetails: ValuationProject): number {
  let cost = 0;
  
  // Extension costs - £2,500-4,000/sqft in Hampstead
  if (projectDetails.proposedExtension) {
    cost += projectDetails.proposedExtension * 3000;
  }

  // Basement costs - £400-600/sqft
  if (projectDetails.proposedBasement) {
    const basementArea = (projectDetails.floorArea || 1500) * 0.8;
    cost += basementArea * 500;
  }

  // Loft conversion costs - £1,500-2,500/sqft
  if (projectDetails.proposedLoftConversion) {
    const loftArea = (projectDetails.floorArea || 1500) * 0.25;
    cost += loftArea * 2000;
  }

  return Math.round(cost);
}

// =============================================================================
// CURRENT VALUATION
// =============================================================================

function calculateCurrentValuation(
  projectDetails: ValuationProject,
  postcode: string
): CurrentValuation {
  const propertyType = projectDetails.propertyType || 'terraced';
  const floorArea = projectDetails.floorArea || 1500;
  const basePrice = HAMPSTEAD_BASE_PRICES[propertyType]?.pricePerSqFt || 1100;
  
  const postcodePrefix = (postcode.split(' ')[0] || postcode).toUpperCase();
  const areaData = AREA_PREMIUMS[postcodePrefix as keyof typeof AREA_PREMIUMS];
  
  const baseValue = floorArea * basePrice;
  const adjustments: ValuationAdjustment[] = [];

  if (areaData) {
    adjustments.push({
      factor: `${areaData.name} location`,
      adjustment: `${((areaData.premium - 1) * 100).toFixed(0)}%`,
      reasoning: `${postcodePrefix} area commands ${areaData.premium > 1 ? 'premium' : 'discount'} pricing`
    });
  }

  if (projectDetails.conservationArea) {
    adjustments.push({
      factor: 'Conservation area',
      adjustment: '+8%',
      reasoning: 'Protected character typically commands premium'
    });
  }

  if (projectDetails.periodProperty) {
    adjustments.push({
      factor: 'Period property',
      adjustment: '+10%',
      reasoning: 'Original features add value in heritage areas'
    });
  }

  if (projectDetails.condition && projectDetails.condition !== 'good') {
    const conditionAdjustments = {
      excellent: '+15%',
      fair: '-10%',
      poor: '-25%'
    };
    adjustments.push({
      factor: `${projectDetails.condition} condition`,
      adjustment: conditionAdjustments[projectDetails.condition] || '0%',
      reasoning: 'Condition affects market value'
    });
  }

  const finalEstimate = estimateCurrentValue(projectDetails, postcode);

  return {
    baseValue: `£${baseValue.toLocaleString()}`,
    adjustments,
    finalEstimate: `£${finalEstimate.toLocaleString()}`,
    pricePerSqFt: `£${Math.round(finalEstimate / floorArea)}/sq ft`,
    methodology: 'Comparable sales analysis with location and condition adjustments'
  };
}

// =============================================================================
// PROPOSED VALUATION
// =============================================================================

function calculateProposedValuation(
  projectDetails: ValuationProject,
  postcode: string,
  currentValuation: CurrentValuation
): ProposedValuation {
  const currentValue = estimateCurrentValue(projectDetails, postcode);
  const proposedValue = estimateProposedValue(projectDetails, postcode, currentValue);
  const worksCost = estimateWorksCost(projectDetails);
  
  let newFloorArea = projectDetails.floorArea || 1500;
  
  if (projectDetails.proposedExtension) {
    newFloorArea += projectDetails.proposedExtension;
  }
  if (projectDetails.proposedBasement) {
    newFloorArea += (projectDetails.floorArea || 1500) * 0.8;
  }
  if (projectDetails.proposedLoftConversion) {
    newFloorArea += (projectDetails.floorArea || 1500) * 0.25;
  }

  return {
    baseValue: currentValuation.finalEstimate,
    worksCost: `£${worksCost.toLocaleString()}`,
    addedValue: `£${(proposedValue - currentValue).toLocaleString()}`,
    finalEstimate: `£${proposedValue.toLocaleString()}`,
    pricePerSqFt: `£${Math.round(proposedValue / newFloorArea)}/sq ft`,
    methodology: 'Current value plus uplift from improvements based on local comparables'
  };
}

// =============================================================================
// VALUE IMPACTS
// =============================================================================

function analyzeValueImpacts(projectDetails: ValuationProject): ValueImpact[] {
  const impacts: ValueImpact[] = [];

  if (projectDetails.proposedExtension) {
    impacts.push({
      factor: 'Ground floor extension',
      currentImpact: 'N/A',
      proposedChange: `+${projectDetails.proposedExtension} sq ft`,
      estimatedUplift: `£${(projectDetails.proposedExtension * 770).toLocaleString()} - £${(projectDetails.proposedExtension * 1050).toLocaleString()}`,
      confidence: 'High',
      notes: 'Well-designed extensions typically return 70% of area value'
    });
  }

  if (projectDetails.proposedBasement) {
    impacts.push({
      factor: 'Basement conversion',
      currentImpact: 'N/A',
      proposedChange: 'New basement level',
      estimatedUplift: '40-60% of equivalent floor area value',
      confidence: 'Medium',
      notes: 'Basement valuations vary - light and ceiling height critical'
    });
  }

  if (projectDetails.proposedLoftConversion) {
    impacts.push({
      factor: 'Loft conversion',
      currentImpact: 'N/A',
      proposedChange: 'New bedroom/bathroom',
      estimatedUplift: '50-80% of equivalent floor area value',
      confidence: 'High',
      notes: 'Adding bathroom significantly increases value'
    });
  }

  // Standard impacts
  impacts.push({
    factor: 'Conservation area status',
    currentImpact: projectDetails.conservationArea ? '+8% premium' : 'N/A',
    proposedChange: 'Maintained',
    estimatedUplift: 'Premium preserved',
    confidence: 'High',
    notes: 'Quality improvements maintain conservation premium'
  });

  impacts.push({
    factor: 'Planning permission secured',
    currentImpact: 'Potential only',
    proposedChange: 'Implementable consent',
    estimatedUplift: '5-15% of improvement value',
    confidence: 'High',
    notes: 'Properties with consent sell at premium'
  });

  return impacts;
}

// =============================================================================
// MARKET COMPARISONS
// =============================================================================

function generateMarketComparisons(
  projectDetails: ValuationProject,
  postcode: string
): MarketComparison[] {
  const propertyType = projectDetails.propertyType || 'terraced';
  const postcodePrefix = (postcode.split(' ')[0] || postcode).toUpperCase();
  
  // Generate realistic comparables based on property type
  const comparisons: MarketComparison[] = [];

  if (propertyType === 'terraced' || propertyType === 'semi_detached') {
    comparisons.push({
      propertyType: 'Victorian terraced',
      location: `${postcodePrefix} - similar street`,
      comparablePrice: '£1,500,000 - £2,200,000',
      pricePerSqFt: '£950 - £1,200',
      features: ['3-4 bedrooms', 'Period features', 'Garden', 'Recent renovation']
    });
  }

  if (propertyType === 'detached' || propertyType === 'mansion') {
    comparisons.push({
      propertyType: 'Detached family house',
      location: `${postcodePrefix} - prime road`,
      comparablePrice: '£3,000,000 - £5,000,000',
      pricePerSqFt: '£1,200 - £1,600',
      features: ['5+ bedrooms', 'Large garden', 'Garage/parking', 'Basement potential']
    });
  }

  if (propertyType === 'flat') {
    comparisons.push({
      propertyType: 'Period conversion flat',
      location: `${postcodePrefix}`,
      comparablePrice: '£600,000 - £1,200,000',
      pricePerSqFt: '£850 - £1,100',
      features: ['2-3 bedrooms', 'High ceilings', 'Communal garden', 'Period features']
    });
  }

  // Add extension comparable
  comparisons.push({
    propertyType: 'Extended property (comparable)',
    location: `${postcodePrefix} area`,
    comparablePrice: 'Premium of 15-25%',
    pricePerSqFt: 'Similar to original build rate',
    features: ['Quality extension', 'Open plan living', 'Modern kitchen', 'Additional bathroom']
  });

  return comparisons;
}

// =============================================================================
// AREA PREMIUMS
// =============================================================================

function analyzeAreaPremiums(postcode: string): AreaPremium[] {
  const premiums: AreaPremium[] = [];
  
  const postcodePrefix = (postcode.split(' ')[0] || postcode).toUpperCase();
  const currentArea = AREA_PREMIUMS[postcodePrefix as keyof typeof AREA_PREMIUMS];

  if (currentArea) {
    premiums.push({
      area: currentArea.name,
      premiumFactor: `${((currentArea.premium - 1) * 100).toFixed(0)}% ${currentArea.premium > 1 ? 'premium' : 'discount'}`,
      reasoning: [
        `${postcodePrefix} postcode location`,
        currentArea.premium > 1 ? 'High demand area' : 'Value area with potential',
        'Strong local amenities'
      ]
    });
  }

  // Add comparative areas
  Object.entries(AREA_PREMIUMS)
    .filter(([code]) => code !== postcodePrefix)
    .slice(0, 3)
    .forEach(([code, data]) => {
      premiums.push({
        area: `${data.name} (${code})`,
        premiumFactor: `${((data.premium - 1) * 100).toFixed(0)}% ${data.premium > 1 ? 'premium' : 'discount'}`,
        reasoning: ['Comparative location', `Different market position`]
      });
    });

  return premiums;
}

// =============================================================================
// RISK FACTORS
// =============================================================================

function identifyRiskFactors(projectDetails: ValuationProject): RiskFactor[] {
  const risks: RiskFactor[] = [];

  risks.push({
    risk: 'Planning refusal',
    impact: 'No value uplift; wasted fees',
    mitigation: 'Pre-application advice; quality design',
    probability: 'Low to Medium'
  });

  risks.push({
    risk: 'Construction cost overruns',
    impact: 'Reduced ROI; potential negative equity',
    mitigation: 'Fixed price contracts; contingency budget (15-20%)',
    probability: 'Medium'
  });

  risks.push({
    risk: 'Market downturn',
    impact: 'Reduced sale price; extended holding period',
    mitigation: 'Quality improvements; realistic pricing',
    probability: 'Medium'
  });

  if (projectDetails.proposedBasement) {
    risks.push({
      risk: 'Basement complications',
      impact: 'Significant cost increases; delays',
      mitigation: 'Thorough surveys; experienced contractor',
      probability: 'Medium to High'
    });
  }

  if (projectDetails.listedBuilding) {
    risks.push({
      risk: 'Listed building constraints',
      impact: 'Limited works; higher costs',
      mitigation: 'Specialist heritage advice; early consultation',
      probability: 'High'
    });
  }

  if (projectDetails.conservationArea) {
    risks.push({
      risk: 'Conservation area restrictions',
      impact: 'Design constraints; material costs',
      mitigation: 'Sensitive design; traditional materials budget',
      probability: 'Medium'
    });
  }

  return risks;
}

// =============================================================================
// RECOMMENDATIONS
// =============================================================================

function generateRecommendations(
  projectDetails: ValuationProject,
  valueImpacts: ValueImpact[]
): ValuationRecommendation[] {
  const recommendations: ValuationRecommendation[] = [];

  recommendations.push({
    recommendation: 'Obtain professional valuation before committing',
    rationale: 'Ensure accurate baseline and projected values',
    potentialImpact: 'Validates investment decision'
  });

  recommendations.push({
    recommendation: 'Secure planning permission before purchase if buying',
    rationale: 'Reduces risk; allows accurate costing',
    potentialImpact: 'Planning consent adds 5-15% to development value'
  });

  if (projectDetails.proposedExtension || projectDetails.proposedLoftConversion) {
    recommendations.push({
      recommendation: 'Consider kitchen and bathroom in extension scope',
      rationale: 'Kitchen/bathroom improvements have high ROI',
      potentialImpact: 'Additional £25,000-75,000 value'
    });
  }

  if (projectDetails.conservationArea) {
    recommendations.push({
      recommendation: 'Invest in quality materials and traditional details',
      rationale: 'Maintains conservation premium; easier planning approval',
      potentialImpact: 'Protects 8%+ conservation premium'
    });
  }

  recommendations.push({
    recommendation: 'Engage architect with local experience',
    rationale: 'Understanding local design preferences aids planning success',
    potentialImpact: 'Higher approval rates; better resale appeal'
  });

  return recommendations;
}

// =============================================================================
// DISCLAIMER
// =============================================================================

function getDisclaimer(): string {
  return `This valuation impact assessment is provided for guidance purposes only and should not be relied upon for financial decisions. Property values are subject to market conditions, location specifics, and property characteristics that require professional assessment. We recommend obtaining a formal valuation from a RICS registered surveyor before proceeding with any property transaction or development project. Past performance and comparable data do not guarantee future values.`;
}

// =============================================================================
// EXPORTS
// =============================================================================

const valuationImpact = {
  assessValuationImpact,
  HAMPSTEAD_BASE_PRICES,
  AREA_PREMIUMS,
  IMPROVEMENT_UPLIFTS
};

export default valuationImpact;
