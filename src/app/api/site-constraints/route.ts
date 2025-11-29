/**
 * Site Constraints API
 * Comprehensive site analysis including flood risk, contamination, and legal constraints
 * GET/POST /api/site-constraints
 */

import { NextRequest, NextResponse } from 'next/server';

// Types
type ConstraintSeverity = 'prohibitive' | 'major' | 'moderate' | 'minor';

interface ConstraintData {
  category: string;
  severity: ConstraintSeverity;
  description: string;
  mitigation: string[];
  costImpact: { min: number; max: number };
  timeImpact: string;
  planningImplication: string;
}

// Constraint database
const CONSTRAINT_TYPES: Record<string, ConstraintData> = {
  flood_zone_3: {
    category: 'Flood Risk',
    severity: 'major',
    description: 'High probability of flooding (1 in 100 years)',
    mitigation: ['Flood Risk Assessment required', 'Sequential/Exception Tests', 'Flood resilient construction'],
    costImpact: { min: 10000, max: 50000 },
    timeImpact: '2-4 months additional',
    planningImplication: 'FRA required, may be refused if fails Sequential Test',
  },
  flood_zone_2: {
    category: 'Flood Risk',
    severity: 'moderate',
    description: 'Medium probability of flooding (1 in 1000 years)',
    mitigation: ['FRA for sensitive uses', 'Flood resilient design recommended'],
    costImpact: { min: 3000, max: 15000 },
    timeImpact: '1-2 months additional',
    planningImplication: 'FRA may be required for vulnerable development',
  },
  surface_water_risk: {
    category: 'Flood Risk',
    severity: 'moderate',
    description: 'Risk of surface water flooding',
    mitigation: ['SuDS required', 'Permeable surfaces', 'Rainwater harvesting'],
    costImpact: { min: 5000, max: 20000 },
    timeImpact: '1 month additional',
    planningImplication: 'Drainage strategy required',
  },
  shrinkable_clay: {
    category: 'Ground Conditions',
    severity: 'moderate',
    description: 'London Clay susceptible to shrink-swell',
    mitigation: ['Foundation design for movement', 'Tree proximity assessment', 'Deeper foundations'],
    costImpact: { min: 5000, max: 25000 },
    timeImpact: '2-4 weeks additional',
    planningImplication: 'Building Control require foundation design',
  },
  made_ground: {
    category: 'Ground Conditions',
    severity: 'moderate',
    description: 'Previously developed or filled land',
    mitigation: ['Ground investigation', 'Piled or reinforced foundations', 'Gas protection'],
    costImpact: { min: 10000, max: 40000 },
    timeImpact: '1-2 months additional',
    planningImplication: 'Contamination assessment may be conditioned',
  },
  potential_contamination: {
    category: 'Ground Conditions',
    severity: 'major',
    description: 'Historical land use suggests possible contamination',
    mitigation: ['Phase 1 desk study', 'Phase 2 site investigation', 'Remediation strategy'],
    costImpact: { min: 8000, max: 100000 },
    timeImpact: '2-6 months additional',
    planningImplication: 'Contamination conditions likely',
  },
  public_right_of_way: {
    category: 'Access Rights',
    severity: 'major',
    description: 'Public footpath crosses site',
    mitigation: ['Diversion order application', 'Design around route', 'Temporary closure'],
    costImpact: { min: 5000, max: 30000 },
    timeImpact: '3-6 months for diversion',
    planningImplication: 'Must address in application',
  },
  private_easement: {
    category: 'Access Rights',
    severity: 'moderate',
    description: 'Third party rights over land',
    mitigation: ['Identify from title', 'Negotiate with beneficiary', 'Design to avoid'],
    costImpact: { min: 2000, max: 20000 },
    timeImpact: '1-3 months',
    planningImplication: 'May affect layout',
  },
  restrictive_covenant: {
    category: 'Legal',
    severity: 'moderate',
    description: 'Private restrictions on land use',
    mitigation: ['Insurance against breach', 'Apply for modification', 'Negotiate release'],
    costImpact: { min: 1000, max: 15000 },
    timeImpact: '1-6 months',
    planningImplication: 'Affects deliverability',
  },
  tree_preservation_order: {
    category: 'Environmental',
    severity: 'moderate',
    description: 'Protected trees on or adjacent to site',
    mitigation: ['Arboricultural assessment', 'Tree protection plan', 'Design around RPAs'],
    costImpact: { min: 2000, max: 15000 },
    timeImpact: '1-2 months',
    planningImplication: 'TPO consent if works needed',
  },
  listed_building_curtilage: {
    category: 'Heritage',
    severity: 'major',
    description: 'Within curtilage of listed building',
    mitigation: ['Heritage assessment', 'Sensitive design', 'LBC required'],
    costImpact: { min: 5000, max: 25000 },
    timeImpact: '2-4 months additional',
    planningImplication: 'LBC required for works',
  },
  archaeological_priority: {
    category: 'Heritage',
    severity: 'moderate',
    description: 'Area of archaeological significance',
    mitigation: ['Desk-based assessment', 'Trial trenching', 'Watching brief'],
    costImpact: { min: 3000, max: 30000 },
    timeImpact: '1-3 months',
    planningImplication: 'GLAAS consultation, conditions likely',
  },
  utilities_easement: {
    category: 'Utilities',
    severity: 'moderate',
    description: 'Underground services with protected corridors',
    mitigation: ['Utility searches', 'Build-over agreements', 'Diversion if needed'],
    costImpact: { min: 2000, max: 50000 },
    timeImpact: '2-4 months for diversions',
    planningImplication: 'May affect layout',
  },
  party_wall_issues: {
    category: 'Legal',
    severity: 'moderate',
    description: 'Works affecting party walls',
    mitigation: ['Party Wall notices', 'Party Wall Award', 'Condition surveys'],
    costImpact: { min: 1500, max: 8000 },
    timeImpact: '1-3 months',
    planningImplication: 'Affects construction timeline',
  },
};

// Area geology
const AREA_GEOLOGY: Record<string, { geology: string; shrinkableClay: boolean; madeGround: boolean }> = {
  'NW3': { geology: 'London Clay / Bagshot Sand', shrinkableClay: true, madeGround: false },
  'NW6': { geology: 'London Clay', shrinkableClay: true, madeGround: false },
  'NW8': { geology: 'London Clay', shrinkableClay: true, madeGround: true },
  'NW11': { geology: 'Claygate Beds over London Clay', shrinkableClay: true, madeGround: false },
  'N2': { geology: 'London Clay', shrinkableClay: true, madeGround: false },
  'N6': { geology: 'Bagshot Sand / London Clay', shrinkableClay: true, madeGround: false },
  'N10': { geology: 'London Clay', shrinkableClay: true, madeGround: false },
};

function getSiteReport(
  address: string,
  postcode: string,
  constraints: string[],
  isListed: boolean,
  inConservationArea: boolean
) {
  const siteConstraints: Array<{ type: string } & ConstraintData> = [];
  
  for (const constraint of constraints) {
    const key = constraint.toLowerCase().replace(/ /g, '_');
    const data = CONSTRAINT_TYPES[key];
    if (data) {
      siteConstraints.push({ type: constraint, ...data });
    }
  }
  
  if (isListed && CONSTRAINT_TYPES['listed_building_curtilage']) {
    siteConstraints.push({ type: 'Listed Building', ...CONSTRAINT_TYPES['listed_building_curtilage'] });
  }
  
  const parts = postcode.split(' ');
  const outcode = (parts[0] || postcode).toUpperCase();
  const geology = AREA_GEOLOGY[outcode] || { geology: 'London Clay', shrinkableClay: true, madeGround: false };
  
  if (geology.shrinkableClay && CONSTRAINT_TYPES['shrinkable_clay']) {
    const exists = siteConstraints.some(c => c.type.toLowerCase().includes('clay'));
    if (!exists) {
      siteConstraints.push({ type: 'Shrinkable Clay', ...CONSTRAINT_TYPES['shrinkable_clay'] });
    }
  }
  
  const surfaceWaterAreas = ['NW6', 'NW8'];
  const hasSurfaceRisk = surfaceWaterAreas.includes(outcode);
  
  const floodRisk = {
    zone: 1,
    riskLevel: hasSurfaceRisk ? 'medium' : 'low',
    fluvial: false,
    surface: hasSurfaceRisk,
    groundwater: false,
  };
  
  const groundConditions = {
    geology: geology.geology,
    riskOfSubsidence: geology.shrinkableClay ? 'medium' : 'low',
    shrinkableClay: geology.shrinkableClay,
    madeGround: geology.madeGround,
    contamination: geology.madeGround ? 'possible' : 'unlikely',
  };
  
  const totalCost = siteConstraints.reduce(
    (acc, c) => ({ min: acc.min + c.costImpact.min, max: acc.max + c.costImpact.max }),
    { min: 0, max: 0 }
  );
  
  const majorCount = siteConstraints.filter(c => c.severity === 'major').length;
  const prohibitiveCount = siteConstraints.filter(c => c.severity === 'prohibitive').length;
  
  let developability: string = 'high';
  if (prohibitiveCount > 0) developability = 'very_constrained';
  else if (majorCount >= 3) developability = 'very_constrained';
  else if (majorCount >= 2) developability = 'constrained';
  else if (majorCount >= 1 || siteConstraints.length >= 4) developability = 'moderate';
  
  const recommendations: string[] = [];
  if (siteConstraints.length > 0) {
    recommendations.push('Commission site investigations before development');
  }
  if (floodRisk.surface) {
    recommendations.push('Obtain drainage strategy from engineer');
  }
  if (groundConditions.contamination !== 'unlikely') {
    recommendations.push('Consider Phase 1 Environmental Assessment');
  }
  if (isListed || inConservationArea) {
    recommendations.push('Engage heritage consultant early');
  }
  
  return {
    address,
    postcode,
    constraints: siteConstraints,
    floodRisk,
    groundConditions,
    totalCostImpact: totalCost,
    developability,
    recommendations,
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;
    
    if (action === 'report') {
      const { address, postcode, constraints, isListed, inConservationArea } = body;
      
      if (!address || !postcode) {
        return NextResponse.json({ error: 'address and postcode required' }, { status: 400 });
      }
      
      const report = getSiteReport(
        address,
        postcode,
        constraints || [],
        isListed || false,
        inConservationArea || false
      );
      
      return NextResponse.json({ success: true, report });
    }
    
    if (action === 'check-constraint') {
      const { constraintType, propertyValue } = body;
      const key = (constraintType || '').toLowerCase().replace(/ /g, '_');
      const constraint = CONSTRAINT_TYPES[key];
      
      if (!constraint) {
        return NextResponse.json({ error: 'Unknown constraint type' }, { status: 404 });
      }
      
      const avgCost = (constraint.costImpact.min + constraint.costImpact.max) / 2;
      const valueImpact = propertyValue ? Math.round((avgCost / propertyValue) * 100) : 0;
      
      return NextResponse.json({
        success: true,
        constraint: { type: constraintType, ...constraint },
        valueImpactPercent: valueImpact,
      });
    }
    
    if (action === 'geology') {
      const { postcode } = body;
      if (!postcode) {
        return NextResponse.json({ error: 'postcode required' }, { status: 400 });
      }
      
      const parts = postcode.split(' ');
      const outcode = (parts[0] || postcode).toUpperCase();
      const geology = AREA_GEOLOGY[outcode];
      
      if (!geology) {
        return NextResponse.json({
          success: true,
          geology: { geology: 'Unknown', shrinkableClay: true, madeGround: false },
          note: 'Area not in database, assumed London Clay',
        });
      }
      
      return NextResponse.json({ success: true, geology });
    }
    
    return NextResponse.json(
      { error: 'Invalid action. Use: report, check-constraint, geology' },
      { status: 400 }
    );
    
  } catch (error) {
    console.error('Site Constraints API error:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  if (searchParams.get('constraint-types') === 'true') {
    return NextResponse.json({
      constraintTypes: Object.entries(CONSTRAINT_TYPES).map(([key, value]) => ({
        key,
        category: value.category,
        severity: value.severity,
        description: value.description,
      })),
    });
  }
  
  if (searchParams.get('geology') === 'true') {
    return NextResponse.json({
      areaGeology: Object.entries(AREA_GEOLOGY).map(([postcode, data]) => ({
        postcode,
        ...data,
      })),
    });
  }
  
  if (searchParams.get('categories') === 'true') {
    const categories = Array.from(new Set(Object.values(CONSTRAINT_TYPES).map(c => c.category)));
    return NextResponse.json({ categories });
  }
  
  return NextResponse.json({
    service: 'Site Constraints API',
    version: '1.0.0',
    description: 'Comprehensive site analysis including flood risk, contamination, and legal constraints',
    endpoints: {
      'GET /api/site-constraints': 'Service info',
      'GET /api/site-constraints?constraint-types=true': 'List all constraint types',
      'GET /api/site-constraints?geology=true': 'Area geology data',
      'GET /api/site-constraints?categories=true': 'Constraint categories',
      'POST (action: report)': 'Full site constraints report',
      'POST (action: check-constraint)': 'Check specific constraint',
      'POST (action: geology)': 'Get geology for postcode',
    },
    severityLevels: ['prohibitive', 'major', 'moderate', 'minor'],
    constraintCategories: ['Flood Risk', 'Ground Conditions', 'Access Rights', 'Legal', 'Environmental', 'Heritage', 'Utilities'],
  });
}
