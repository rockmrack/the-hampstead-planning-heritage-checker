/**
 * Heritage Value API
 * Calculate heritage significance and value premiums
 * GET/POST /api/heritage-value
 */

import { NextRequest, NextResponse } from 'next/server';

// Conservation area character
const CA_CHARACTER: Record<string, { significance: string; features: string[] }> = {
  'Hampstead': {
    significance: 'exceptional',
    features: ['Historic high street', 'Georgian terraces', 'Flask Walk character'],
  },
  'Hampstead Garden Suburb': {
    significance: 'exceptional', 
    features: ['Lutyens architecture', 'Unified design', 'Garden settings'],
  },
  'Highgate': {
    significance: 'exceptional',
    features: ['Historic village core', 'Georgian terraces', 'Historic cemetery'],
  },
  'Belsize': {
    significance: 'high',
    features: ['Victorian terraces', 'Decorative features', 'Front gardens'],
  },
  'South Hill Park': {
    significance: 'high',
    features: ['Victorian villas', 'Mature gardens', 'Tree-lined streets'],
  },
};

// Value premiums by area
const AREA_PREMIUMS: Record<string, { base: number; conservation: number; listed: Record<string, number> }> = {
  'NW3': { base: 15, conservation: 8, listed: { 'I': 25, 'II*': 18, 'II': 12 } },
  'NW6': { base: 10, conservation: 6, listed: { 'I': 22, 'II*': 15, 'II': 10 } },
  'NW8': { base: 18, conservation: 10, listed: { 'I': 28, 'II*': 20, 'II': 14 } },
  'NW1': { base: 12, conservation: 7, listed: { 'I': 24, 'II*': 16, 'II': 11 } },
  'N6': { base: 14, conservation: 8, listed: { 'I': 26, 'II*': 18, 'II': 12 } },
  'N2': { base: 12, conservation: 7, listed: { 'I': 23, 'II*': 15, 'II': 10 } },
};

function extractAreaPrefix(postcode: string): string {
  const match = postcode.match(/^(NW\d{1,2}|N\d{1,2})/i);
  return match && match[1] ? match[1].toUpperCase() : 'NW3';
}

interface HeritageInput {
  address: string;
  postcode: string;
  isListedBuilding: boolean;
  listedGrade?: string;
  inConservationArea: boolean;
  conservationAreaName?: string;
  buildingAge?: string;
  isLocallyListed?: boolean;
  hasArticle4?: boolean;
  proposedWorks?: string;
  estimatedValue?: number;
}

function assessHeritage(input: HeritageInput) {
  const areaPrefix = extractAreaPrefix(input.postcode);
  const defaultPremiums = AREA_PREMIUMS['NW3']!;
  const premiums = AREA_PREMIUMS[areaPrefix] ?? defaultPremiums;
  
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
  let significance = 'low';
  const values: { type: string; level: string; description: string }[] = [];
  
  if (input.isListedBuilding) {
    const gradeSignificance: Record<string, string> = { 'I': 'exceptional', 'II*': 'high', 'II': 'moderate' };
    significance = gradeSignificance[input.listedGrade || 'II'] ?? 'moderate';
    
    values.push({
      type: 'architectural',
      level: significance,
      description: `Grade ${input.listedGrade || 'II'} listed for architectural interest`,
    });
    
    values.push({
      type: 'historic',
      level: significance,
      description: 'Historic interest warranting statutory protection',
    });
  }
  
  if (input.inConservationArea && input.conservationAreaName) {
    const ca = CA_CHARACTER[input.conservationAreaName];
    if (ca) {
      values.push({
        type: 'aesthetic',
        level: ca.significance,
        description: `Contribution to ${input.conservationAreaName} Conservation Area character`,
      });
      if (!input.isListedBuilding && (ca.significance === 'exceptional' || ca.significance === 'high')) {
        significance = ca.significance;
      }
    }
  }
  
  // Constraints
  const constraints: { constraint: string; impact: string; guidance: string }[] = [];
  
  if (input.isListedBuilding) {
    constraints.push({
      constraint: 'Listed Building Consent',
      impact: input.listedGrade === 'I' ? 'prohibitive' : 'major',
      guidance: 'LBC required for works affecting character',
    });
  }
  
  if (input.inConservationArea) {
    constraints.push({
      constraint: 'Conservation Area controls',
      impact: 'moderate',
      guidance: 'Enhanced design scrutiny required',
    });
  }
  
  if (input.hasArticle4) {
    constraints.push({
      constraint: 'Article 4 Direction',
      impact: 'moderate',
      guidance: 'Permitted development rights removed',
    });
  }
  
  // Value premium calculation
  let percentagePremium = premiums.base;
  const factors: string[] = [`Area character (+${premiums.base}%)`];
  
  if (input.isListedBuilding && input.listedGrade) {
    const listedBonus = premiums.listed[input.listedGrade] ?? 10;
    percentagePremium += listedBonus;
    factors.push(`Listed Grade ${input.listedGrade} (+${listedBonus}%)`);
  }
  
  if (input.inConservationArea) {
    percentagePremium += premiums.conservation;
    factors.push(`Conservation Area (+${premiums.conservation}%)`);
  }
  
  if (input.isLocallyListed && !input.isListedBuilding) {
    percentagePremium += 3;
    factors.push('Locally listed (+3%)');
  }
  
  const baseValue = input.estimatedValue ?? 1000000;
  const heritagePremium = Math.round(baseValue * (percentagePremium / 100));
  
  // Recommendations
  const recommendations: string[] = [];
  
  if (input.isListedBuilding) {
    recommendations.push('Engage architect with listed building experience');
    recommendations.push('Prepare heritage impact assessment');
    recommendations.push('Consider pre-application with conservation officer');
  }
  
  if (input.inConservationArea) {
    recommendations.push('Review Conservation Area Appraisal document');
    recommendations.push('Design to preserve or enhance area character');
  }
  
  recommendations.push('Explore heritage grant opportunities');
  
  return {
    property: {
      address: input.address,
      postcode: input.postcode,
      designation,
      grade: input.listedGrade,
    },
    significance: {
      overall: significance,
      values,
      statement: `This property has ${significance} heritage significance based on its ${values.map(v => v.type).join(', ')} values.`,
    },
    constraints,
    valuePremium: {
      baseValue,
      heritagePremium,
      percentagePremium,
      factors,
      totalEstimatedValue: baseValue + heritagePremium,
    },
    recommendations,
  };
}

export async function POST(request: NextRequest) {
  try {
    const body: HeritageInput = await request.json();
    
    if (!body.address || !body.postcode) {
      return NextResponse.json(
        { error: 'Missing required fields: address, postcode' },
        { status: 400 }
      );
    }
    
    const assessment = assessHeritage(body);
    
    return NextResponse.json({
      success: true,
      assessment,
      generatedAt: new Date().toISOString(),
    });
    
  } catch (error) {
    console.error('Heritage value error:', error);
    return NextResponse.json(
      { error: 'Failed to assess heritage value' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const postcode = searchParams.get('postcode');
  const conservationArea = searchParams.get('conservationArea');
  
  if (conservationArea && CA_CHARACTER[conservationArea]) {
    return NextResponse.json({
      conservationArea,
      character: CA_CHARACTER[conservationArea],
    });
  }
  
  if (postcode) {
    const areaPrefix = extractAreaPrefix(postcode);
    const defaultPremiums = AREA_PREMIUMS['NW3']!;
    const premiums = AREA_PREMIUMS[areaPrefix] ?? defaultPremiums;
    return NextResponse.json({
      area: areaPrefix,
      premiums,
    });
  }
  
  return NextResponse.json({
    service: 'Heritage Value Calculator API',
    version: '1.0.0',
    description: 'Calculate heritage significance and value premiums',
    endpoints: {
      'GET /api/heritage-value': 'Get area premiums or CA character',
      'GET /api/heritage-value?postcode=NW3': 'Get area premiums',
      'GET /api/heritage-value?conservationArea=Hampstead': 'Get CA character',
      'POST /api/heritage-value': 'Full heritage assessment',
    },
    conservationAreas: Object.keys(CA_CHARACTER),
    areasCovered: Object.keys(AREA_PREMIUMS),
  });
}
