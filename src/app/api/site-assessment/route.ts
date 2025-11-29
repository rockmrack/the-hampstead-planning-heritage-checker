/**
 * Site Assessment API
 * Comprehensive site analysis endpoints
 * GET/POST /api/site-assessment
 */

import { NextRequest, NextResponse } from 'next/server';

// Types
interface SiteAssessmentRequest {
  address: string;
  postcode: string;
  propertyType: 'detached' | 'semi_detached' | 'terraced' | 'flat' | 'maisonette';
  plotSize?: number;
  gardenSize?: number;
  buildingAge?: string;
  floors?: number;
  inConservationArea: boolean;
  isListedBuilding: boolean;
  hasBasement: boolean;
  hasLoftConversion: boolean;
}

// Area defaults
const AREA_DEFAULTS: Record<string, { plotSize: number; orientation: string; topography: string }> = {
  'NW3': { plotSize: 350, orientation: 'south', topography: 'moderate_slope' },
  'NW6': { plotSize: 250, orientation: 'west', topography: 'gentle_slope' },
  'NW8': { plotSize: 400, orientation: 'south', topography: 'flat' },
  'NW1': { plotSize: 200, orientation: 'east', topography: 'flat' },
  'NW2': { plotSize: 280, orientation: 'southwest', topography: 'gentle_slope' },
  'NW5': { plotSize: 220, orientation: 'west', topography: 'flat' },
  'NW11': { plotSize: 380, orientation: 'south', topography: 'gentle_slope' },
  'N2': { plotSize: 420, orientation: 'southwest', topography: 'flat' },
  'N6': { plotSize: 450, orientation: 'southwest', topography: 'steep' },
  'N10': { plotSize: 300, orientation: 'south', topography: 'gentle_slope' },
};

// Extract area prefix
function extractAreaPrefix(postcode: string): string {
  const match = postcode.match(/^(NW\d{1,2}|N\d{1,2})/i);
  return match && match[1] ? match[1].toUpperCase() : 'NW3';
}

// Assess site
function assessSite(input: SiteAssessmentRequest): {
  characteristics: {
    plotSize: number;
    buildingFootprint: number;
    gardenSize: number;
    frontageWidth: number;
    depth: number;
    orientation: string;
    topography: string;
  };
  access: {
    vehicularAccess: boolean;
    constructionAccess: string;
    neighborAgreementNeeded: boolean;
  };
  constraints: { constraint: string; severity: string; description: string; mitigation: string }[];
  opportunities: { opportunity: string; benefit: string }[];
  developmentPotential: {
    rearExtension: { feasibility: string; area: number; cost: { min: number; max: number } };
    sideExtension: { feasibility: string; area: number; cost: { min: number; max: number } } | null;
    basement: { feasibility: string; area: number; cost: { min: number; max: number } };
    loftConversion: { feasibility: string; area: number; cost: { min: number; max: number } };
    outbuilding: { feasibility: string; area: number; cost: { min: number; max: number } };
  };
  overallScore: number;
  recommendations: string[];
} {
  const areaPrefix = extractAreaPrefix(input.postcode);
  const defaultAreaData = AREA_DEFAULTS['NW3']!;
  const areaDefaults = AREA_DEFAULTS[areaPrefix] ?? defaultAreaData;
  
  // Build characteristics
  const plotSize = input.plotSize ?? areaDefaults.plotSize;
  const gardenSize = input.gardenSize ?? Math.round(plotSize * 0.4);
  const buildingFootprint = plotSize - gardenSize;
  
  const characteristics = {
    plotSize,
    buildingFootprint,
    gardenSize,
    frontageWidth: Math.round(Math.sqrt(plotSize) * 0.8),
    depth: Math.round(Math.sqrt(plotSize) * 1.2),
    orientation: areaDefaults.orientation,
    topography: areaDefaults.topography,
  };
  
  // Access assessment
  const isTerraced = input.propertyType === 'terraced';
  const access = {
    vehicularAccess: !isTerraced,
    constructionAccess: isTerraced ? 'difficult' : 'moderate',
    neighborAgreementNeeded: isTerraced,
  };
  
  // Constraints
  const constraints: { constraint: string; severity: string; description: string; mitigation: string }[] = [];
  
  if (input.inConservationArea) {
    constraints.push({
      constraint: 'Conservation Area',
      severity: 'medium',
      description: 'Enhanced design scrutiny required',
      mitigation: 'Engage conservation architect',
    });
  }
  
  if (input.isListedBuilding) {
    constraints.push({
      constraint: 'Listed Building',
      severity: 'high',
      description: 'Listed Building Consent required',
      mitigation: 'Heritage impact assessment essential',
    });
  }
  
  const isHighland = ['NW3', 'N6', 'N2'].includes(areaPrefix);
  if (isHighland) {
    constraints.push({
      constraint: 'TPO Trees Likely',
      severity: 'medium',
      description: 'Area has high concentration of protected trees',
      mitigation: 'Arboricultural survey recommended',
    });
  }
  
  if (areaDefaults.topography === 'steep') {
    constraints.push({
      constraint: 'Sloping Site',
      severity: 'medium',
      description: 'May increase construction complexity',
      mitigation: 'Specialist structural design',
    });
  }
  
  // Opportunities
  const opportunities: { opportunity: string; benefit: string }[] = [];
  
  if (gardenSize > 150) {
    opportunities.push({
      opportunity: 'Large Garden',
      benefit: 'Space for substantial extension or outbuilding',
    });
  }
  
  if (areaDefaults.orientation === 'south' || areaDefaults.orientation === 'southwest') {
    opportunities.push({
      opportunity: 'South Facing',
      benefit: 'Solar gain for extension, garden amenity',
    });
  }
  
  if (input.propertyType === 'detached') {
    opportunities.push({
      opportunity: 'Detached Property',
      benefit: 'Reduced neighbor impact concerns',
    });
  }
  
  if (areaDefaults.topography === 'flat') {
    opportunities.push({
      opportunity: 'Flat Site',
      benefit: 'Simpler construction, lower foundation costs',
    });
  }
  
  // Development potential
  const hasHighConstraints = constraints.some(c => c.severity === 'high');
  
  // Rear extension
  const rearArea = Math.min(gardenSize * 0.3, 40);
  const rearExtension = {
    feasibility: gardenSize > 50 ? 'high' : 'medium',
    area: Math.round(rearArea),
    cost: { min: Math.round(rearArea * 2500), max: Math.round(rearArea * 4000) },
  };
  
  // Side extension (if not terraced)
  const sideExtension = !isTerraced ? {
    feasibility: 'medium',
    area: Math.round(Math.min(characteristics.frontageWidth * 3, 25)),
    cost: { min: Math.round(25 * 2200), max: Math.round(25 * 3500) },
  } : null;
  
  // Basement
  const basementArea = Math.round(buildingFootprint * 0.8);
  const basement = {
    feasibility: input.hasBasement ? 'unlikely' : 
                 input.isListedBuilding ? 'low' :
                 hasHighConstraints ? 'medium' : 'high',
    area: input.hasBasement ? 0 : basementArea,
    cost: { min: basementArea * 3000, max: basementArea * 5000 },
  };
  
  // Loft conversion
  const loftArea = Math.round(buildingFootprint * 0.6);
  const loftConversion = {
    feasibility: input.hasLoftConversion ? 'unlikely' :
                 input.isListedBuilding ? 'low' : 'high',
    area: input.hasLoftConversion ? 0 : loftArea,
    cost: { min: loftArea * 1800, max: loftArea * 2800 },
  };
  
  // Outbuilding
  const outbuildingArea = Math.round(Math.min(gardenSize * 0.5, 30));
  const outbuilding = {
    feasibility: gardenSize > 80 ? 'high' : gardenSize > 40 ? 'medium' : 'low',
    area: outbuildingArea,
    cost: { min: outbuildingArea * 1500, max: outbuildingArea * 2500 },
  };
  
  // Overall score
  let score = 60;
  score += opportunities.length * 5;
  for (const c of constraints) {
    if (c.severity === 'high') score -= 10;
    else if (c.severity === 'medium') score -= 5;
  }
  if (plotSize > 400) score += 5;
  if (plotSize < 150) score -= 10;
  score = Math.max(20, Math.min(95, score));
  
  // Recommendations
  const recommendations: string[] = [];
  
  if (rearExtension.feasibility === 'high') {
    recommendations.push(`Rear extension offers best potential: ~${rearExtension.area}sqm`);
  }
  
  if (loftConversion.feasibility === 'high') {
    recommendations.push(`Loft conversion highly feasible: ~${loftConversion.area}sqm potential`);
  }
  
  if (basement.feasibility === 'high') {
    recommendations.push(`Basement potential: ~${basement.area}sqm`);
  }
  
  if (input.inConservationArea) {
    recommendations.push('Engage conservation architect for design quality');
  }
  
  if (input.isListedBuilding) {
    recommendations.push('Early engagement with conservation officer essential');
  }
  
  for (const c of constraints.filter(x => x.severity === 'high')) {
    recommendations.push(`Address ${c.constraint}: ${c.mitigation}`);
  }
  
  return {
    characteristics,
    access,
    constraints,
    opportunities,
    developmentPotential: {
      rearExtension,
      sideExtension,
      basement,
      loftConversion,
      outbuilding,
    },
    overallScore: score,
    recommendations: recommendations.slice(0, 8),
  };
}

// Quick feasibility check
function quickCheck(postcode: string, propertyType: string, projectType: string): {
  feasible: boolean;
  score: number;
  keyConstraints: string[];
  keyOpportunities: string[];
} {
  const areaPrefix = extractAreaPrefix(postcode);
  const isHighland = ['NW3', 'N6', 'N2'].includes(areaPrefix);
  
  let score = 70;
  const keyConstraints: string[] = [];
  const keyOpportunities: string[] = [];
  
  if (projectType === 'basement') {
    if (isHighland) {
      score -= 15;
      keyConstraints.push('Sloping topography may increase costs');
    }
    keyConstraints.push('Party Wall Act likely applies');
  }
  
  if (projectType === 'extension') {
    if (propertyType === 'terraced') {
      score -= 10;
      keyConstraints.push('Limited side extension potential');
    } else {
      keyOpportunities.push('Side extension may be possible');
    }
  }
  
  if (projectType === 'loft') {
    keyOpportunities.push('Loft typically adds 15-20% floor area');
    if (isHighland) {
      keyConstraints.push('Conservation area may restrict dormer design');
    }
  }
  
  if (areaPrefix === 'NW8') {
    keyOpportunities.push('Larger plot sizes common');
    score += 5;
  }
  
  if (['NW3', 'N6'].includes(areaPrefix)) {
    keyConstraints.push('Heritage sensitivity - design quality critical');
    score -= 5;
  }
  
  return { feasible: score >= 50, score, keyConstraints, keyOpportunities };
}

export async function POST(request: NextRequest) {
  try {
    const body: SiteAssessmentRequest = await request.json();
    
    if (!body.address || !body.postcode) {
      return NextResponse.json(
        { error: 'Missing required fields: address, postcode' },
        { status: 400 }
      );
    }
    
    if (!body.propertyType) {
      return NextResponse.json(
        { error: 'Missing required field: propertyType' },
        { status: 400 }
      );
    }
    
    const assessment = assessSite(body);
    
    return NextResponse.json({
      success: true,
      address: body.address,
      postcode: body.postcode,
      propertyType: body.propertyType,
      assessment,
      generatedAt: new Date().toISOString(),
    });
    
  } catch (error) {
    console.error('Site assessment error:', error);
    return NextResponse.json(
      { error: 'Failed to assess site' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const postcode = searchParams.get('postcode');
  const propertyType = searchParams.get('propertyType');
  const projectType = searchParams.get('projectType');
  
  if (postcode && propertyType && projectType) {
    const result = quickCheck(postcode, propertyType, projectType);
    return NextResponse.json({
      quickCheck: true,
      postcode,
      propertyType,
      projectType,
      result,
    });
  }
  
  if (postcode) {
    const areaPrefix = extractAreaPrefix(postcode);
    const defaultAreaData = AREA_DEFAULTS['NW3']!;
    const areaDefaults = AREA_DEFAULTS[areaPrefix] ?? defaultAreaData;
    
    return NextResponse.json({
      area: areaPrefix,
      defaults: areaDefaults,
    });
  }
  
  return NextResponse.json({
    service: 'Site Assessment API',
    version: '1.0.0',
    description: 'Comprehensive site analysis for development potential',
    endpoints: {
      'GET /api/site-assessment': 'Get area defaults or quick feasibility check',
      'GET /api/site-assessment?postcode=NW3&propertyType=terraced&projectType=extension': 'Quick feasibility',
      'POST /api/site-assessment': 'Full site assessment',
    },
    requiredFields: ['address', 'postcode', 'propertyType'],
    optionalFields: [
      'plotSize',
      'gardenSize',
      'buildingAge',
      'floors',
      'inConservationArea',
      'isListedBuilding',
      'hasBasement',
      'hasLoftConversion',
    ],
    propertyTypes: ['detached', 'semi_detached', 'terraced', 'flat', 'maisonette'],
    projectTypes: ['extension', 'basement', 'loft', 'outbuilding'],
    areasCovered: Object.keys(AREA_DEFAULTS),
  });
}
