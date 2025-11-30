/**
 * Value Enhancement API
 * Property value impact analysis and ROI optimization
 * GET/POST /api/value-enhancement
 */

import { NextRequest, NextResponse } from 'next/server';

// Types
interface ValueFactor {
  factor: string;
  category: 'structural' | 'cosmetic' | 'planning' | 'location' | 'heritage';
  impactRange: { min: number; max: number };
  costRange: { min: number; max: number };
  timeframe: string;
  heritageConsiderations: string[];
}

// Hampstead area baseline values (per sq ft)
const AREA_VALUES: Record<string, number> = {
  'NW3': 1200, 'NW6': 950, 'NW8': 1100, 'NW11': 850,
  'N2': 750, 'N6': 900, 'N10': 700,
};

// Heritage premium multipliers
const HERITAGE_PREMIUMS: Record<string, number> = {
  'Grade I': 1.35, 'Grade II*': 1.25, 'Grade II': 1.15,
  'Conservation Area': 1.10, 'None': 1.00,
};

// Value enhancement factors
const VALUE_FACTORS: ValueFactor[] = [
  {
    factor: 'Loft conversion',
    category: 'structural',
    impactRange: { min: 10, max: 20 },
    costRange: { min: 45000, max: 75000 },
    timeframe: '3-4 months',
    heritageConsiderations: ['Not available in conservation areas without permission', 'Listed buildings require LBC'],
  },
  {
    factor: 'Rear extension (single storey)',
    category: 'structural',
    impactRange: { min: 5, max: 12 },
    costRange: { min: 50000, max: 100000 },
    timeframe: '3-5 months',
    heritageConsiderations: ['Conservation area may limit size/materials', 'Must be sympathetic to original design'],
  },
  {
    factor: 'Basement conversion',
    category: 'structural',
    impactRange: { min: 15, max: 30 },
    costRange: { min: 150000, max: 350000 },
    timeframe: '6-12 months',
    heritageConsiderations: ['Camden basement policy restricts in conservation areas', 'Archaeology assessment may be required'],
  },
  {
    factor: 'Kitchen renovation',
    category: 'cosmetic',
    impactRange: { min: 3, max: 8 },
    costRange: { min: 25000, max: 60000 },
    timeframe: '4-8 weeks',
    heritageConsiderations: ['Maintain period features if listed', 'Consider proportions of historic rooms'],
  },
  {
    factor: 'Bathroom renovation',
    category: 'cosmetic',
    impactRange: { min: 2, max: 5 },
    costRange: { min: 15000, max: 35000 },
    timeframe: '2-4 weeks',
    heritageConsiderations: ['Preserve original fixtures where possible'],
  },
  {
    factor: 'Garden landscaping',
    category: 'cosmetic',
    impactRange: { min: 2, max: 5 },
    costRange: { min: 10000, max: 40000 },
    timeframe: '2-6 weeks',
    heritageConsiderations: ['TPO trees must be protected', 'Historic garden layouts may have significance'],
  },
  {
    factor: 'Period feature restoration',
    category: 'heritage',
    impactRange: { min: 3, max: 10 },
    costRange: { min: 5000, max: 30000 },
    timeframe: '2-8 weeks',
    heritageConsiderations: ['Adds authenticity premium', 'Use specialist heritage craftsmen'],
  },
  {
    factor: 'Sash window restoration',
    category: 'heritage',
    impactRange: { min: 2, max: 5 },
    costRange: { min: 8000, max: 25000 },
    timeframe: '1-3 weeks',
    heritageConsiderations: ['Essential for listed buildings', 'Can improve energy efficiency'],
  },
  {
    factor: 'Planning permission secured',
    category: 'planning',
    impactRange: { min: 8, max: 15 },
    costRange: { min: 5000, max: 15000 },
    timeframe: '3-6 months',
    heritageConsiderations: ['Premium for pre-approved heritage schemes'],
  },
  {
    factor: 'Off-street parking',
    category: 'structural',
    impactRange: { min: 5, max: 15 },
    costRange: { min: 15000, max: 50000 },
    timeframe: '1-3 months',
    heritageConsiderations: ['Crossover applications complex in conservation areas'],
  },
];

// Value detractors
const VALUE_DETRACTORS = [
  { issue: 'Japanese knotweed', impact: -15 },
  { issue: 'Subsidence history', impact: -10 },
  { issue: 'Damp/structural issues', impact: -12 },
  { issue: 'Short lease (<80 years)', impact: -25 },
  { issue: 'Flying freehold', impact: -8 },
  { issue: 'Planning enforcement notice', impact: -20 },
  { issue: 'Restrictive covenants', impact: -5 },
];

function estimateValue(
  postcode: string,
  squareFootage: number,
  bedrooms: number,
  heritageStatus: string
) {
  const outcode = (postcode.split(' ')[0] ?? '').toUpperCase();
  const baseValue = AREA_VALUES[outcode] || 800;
  
  let value = baseValue * squareFootage;
  const bedroomPremium = bedrooms >= 4 ? 1.1 : bedrooms === 3 ? 1.05 : 1.0;
  value *= bedroomPremium;
  
  const heritagePremium = HERITAGE_PREMIUMS[heritageStatus] || 1.0;
  value *= heritagePremium;
  
  return {
    estimatedValue: Math.round(value / 1000) * 1000,
    confidence: 'medium',
    basis: `Based on ${outcode} average of £${baseValue}/sqft`,
  };
}

function analyzeImprovement(
  improvement: string,
  propertyValue: number,
  isListed: boolean,
  inConservationArea: boolean
) {
  const factor = VALUE_FACTORS.find(
    f => f.factor.toLowerCase().includes(improvement.toLowerCase())
  );
  
  if (!factor) return null;
  
  const minIncrease = Math.round(propertyValue * (factor.impactRange.min / 100));
  const maxIncrease = Math.round(propertyValue * (factor.impactRange.max / 100));
  
  const avgCost = (factor.costRange.min + factor.costRange.max) / 2;
  const avgIncrease = (minIncrease + maxIncrease) / 2;
  const roi = Math.round((avgIncrease / avgCost) * 100);
  
  let risk: 'low' | 'medium' | 'high' = 'low';
  if (factor.category === 'structural') risk = 'medium';
  if (isListed) risk = 'high';
  
  let planningRequired = factor.category === 'structural';
  if (inConservationArea || isListed) planningRequired = true;
  
  return {
    improvement: factor.factor,
    costEstimate: factor.costRange,
    valueIncrease: { min: minIncrease, max: maxIncrease },
    roi,
    risk,
    planningRequired,
    heritageConsiderations: factor.heritageConsiderations,
    timeframe: factor.timeframe,
  };
}

function getEnhancementPlan(
  postcode: string,
  propertyValue: number,
  improvements: string[],
  isListed: boolean,
  inConservationArea: boolean
) {
  const results = improvements
    .map(i => analyzeImprovement(i, propertyValue, isListed, inConservationArea))
    .filter((r): r is NonNullable<typeof r> => r !== null);
  
  results.sort((a, b) => b.roi - a.roi);
  
  const totalInvestment = results.reduce(
    (acc, i) => ({ min: acc.min + i.costEstimate.min, max: acc.max + i.costEstimate.max }),
    { min: 0, max: 0 }
  );
  
  const totalIncrease = results.reduce(
    (acc, i) => ({ min: acc.min + i.valueIncrease.min, max: acc.max + i.valueIncrease.max }),
    { min: 0, max: 0 }
  );
  
  const avgInv = (totalInvestment.min + totalInvestment.max) / 2;
  const avgInc = (totalIncrease.min + totalIncrease.max) / 2;
  const overallRoi = avgInv > 0 ? Math.round((avgInc / avgInv) * 100) : 0;
  
  const recommendations: string[] = [];
  if (isListed) {
    recommendations.push('Prioritize period feature restoration for maximum heritage premium');
  }
  if (inConservationArea) {
    recommendations.push('Front elevation changes will require planning permission');
  }
  
  return {
    property: { postcode, estimatedValue: propertyValue },
    improvements: results,
    totalInvestment,
    totalValueIncrease: totalIncrease,
    overallRoi,
    recommendations,
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;
    
    if (action === 'estimate-value') {
      const { postcode, squareFootage, bedrooms, heritageStatus } = body;
      if (!postcode || !squareFootage) {
        return NextResponse.json({ error: 'postcode and squareFootage required' }, { status: 400 });
      }
      
      const valuation = estimateValue(
        postcode,
        squareFootage,
        bedrooms || 3,
        heritageStatus || 'None'
      );
      
      return NextResponse.json({ success: true, valuation });
    }
    
    if (action === 'analyze-improvement') {
      const { improvement, propertyValue, isListed, inConservationArea } = body;
      if (!improvement || !propertyValue) {
        return NextResponse.json({ error: 'improvement and propertyValue required' }, { status: 400 });
      }
      
      const analysis = analyzeImprovement(
        improvement,
        propertyValue,
        isListed || false,
        inConservationArea || false
      );
      
      if (!analysis) {
        return NextResponse.json({ error: 'Unknown improvement type' }, { status: 404 });
      }
      
      return NextResponse.json({ success: true, analysis });
    }
    
    if (action === 'enhancement-plan') {
      const { postcode, propertyValue, improvements, isListed, inConservationArea } = body;
      if (!postcode || !propertyValue || !improvements) {
        return NextResponse.json(
          { error: 'postcode, propertyValue, and improvements array required' },
          { status: 400 }
        );
      }
      
      const plan = getEnhancementPlan(
        postcode,
        propertyValue,
        improvements,
        isListed || false,
        inConservationArea || false
      );
      
      return NextResponse.json({ success: true, plan });
    }
    
    if (action === 'detractor-impact') {
      const { propertyValue, issues } = body;
      if (!propertyValue || !issues) {
        return NextResponse.json({ error: 'propertyValue and issues array required' }, { status: 400 });
      }
      
      const details = issues
        .map((issue: string) => {
          const detractor = VALUE_DETRACTORS.find(
            d => d.issue.toLowerCase().includes(issue.toLowerCase())
          );
          if (!detractor) return null;
          return {
            issue: detractor.issue,
            impact: detractor.impact,
            loss: Math.round(propertyValue * (Math.abs(detractor.impact) / 100)),
          };
        })
        .filter((d: unknown): d is { issue: string; impact: number; loss: number } => d !== null);
      
      const totalImpact = details.reduce((acc: number, d: { impact: number }) => acc + d.impact, 0);
      
      return NextResponse.json({
        success: true,
        impact: { totalImpactPercent: totalImpact, details },
      });
    }
    
    return NextResponse.json(
      { error: 'Invalid action. Use: estimate-value, analyze-improvement, enhancement-plan, detractor-impact' },
      { status: 400 }
    );
    
  } catch (error) {
    console.error('Value Enhancement API error:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  if (searchParams.get('factors') === 'true') {
    return NextResponse.json({
      enhancementFactors: VALUE_FACTORS.map(f => ({
        name: f.factor,
        category: f.category,
        impactRange: f.impactRange,
        timeframe: f.timeframe,
      })),
    });
  }
  
  if (searchParams.get('detractors') === 'true') {
    return NextResponse.json({ valueDetractors: VALUE_DETRACTORS });
  }
  
  if (searchParams.get('premiums') === 'true') {
    return NextResponse.json({ heritagePremiums: HERITAGE_PREMIUMS });
  }
  
  if (searchParams.get('areas') === 'true') {
    return NextResponse.json({
      areaValues: Object.entries(AREA_VALUES).map(([area, value]) => ({
        postcode: area,
        pricePerSqFt: value,
      })),
    });
  }
  
  return NextResponse.json({
    service: 'Value Enhancement API',
    version: '1.0.0',
    description: 'Property value impact analysis and ROI optimization',
    endpoints: {
      'GET /api/value-enhancement': 'Service info',
      'GET /api/value-enhancement?factors=true': 'List enhancement factors',
      'GET /api/value-enhancement?detractors=true': 'List value detractors',
      'GET /api/value-enhancement?premiums=true': 'Heritage premiums',
      'GET /api/value-enhancement?areas=true': 'Area values',
      'POST (action: estimate-value)': 'Estimate property value',
      'POST (action: analyze-improvement)': 'Analyze single improvement',
      'POST (action: enhancement-plan)': 'Full enhancement plan',
      'POST (action: detractor-impact)': 'Calculate detractor impact',
    },
    categories: ['structural', 'cosmetic', 'planning', 'location', 'heritage'],
    coveredAreas: Object.keys(AREA_VALUES),
  });
}
