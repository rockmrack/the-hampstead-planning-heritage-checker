/**
 * Boundary & Legal API
 * Party Wall, boundaries, and legal considerations
 * GET/POST /api/boundary-legal
 */

import { NextRequest, NextResponse } from 'next/server';

// Types
type PartyWallNoticeType = 'line_of_junction' | 'section_3' | 'section_6' | 'combined';

interface PartyWallResult {
  required: boolean;
  noticeType: PartyWallNoticeType | null;
  noticePeriod: number;
  affectedProperties: string[];
  estimatedCost: { min: number; max: number };
  process: string[];
}

interface RightOfLightResult {
  atRisk: boolean;
  riskLevel: 'low' | 'medium' | 'high';
  affectedWindows: number;
  recommendations: string[];
}

// Party Wall notice requirements
const NOTICE_REQUIREMENTS: Record<PartyWallNoticeType, {
  noticePeriod: number;
  description: string;
}> = {
  line_of_junction: {
    noticePeriod: 30,
    description: 'Building on or at the boundary',
  },
  section_3: {
    noticePeriod: 60,
    description: 'Works to existing party wall',
  },
  section_6: {
    noticePeriod: 30,
    description: 'Excavation near neighbouring buildings',
  },
  combined: {
    noticePeriod: 60,
    description: 'Multiple notice types',
  },
};

// Common covenants by area
const AREA_COVENANTS: Record<string, { type: string; restriction: string }[]> = {
  NW3: [
    { type: 'Building Line', restriction: 'No building forward of established line' },
    { type: 'Height', restriction: 'Maximum ridge height restrictions' },
    { type: 'Materials', restriction: 'External materials to match original' },
    { type: 'Use', restriction: 'Residential use only' },
  ],
  N6: [
    { type: 'Building Line', restriction: 'Maintain street frontage alignment' },
    { type: 'Use', restriction: 'Single dwelling restriction' },
  ],
};

function assessPartyWall(
  propertyType: string,
  developmentType: string,
  hasBasement: boolean
): PartyWallResult {
  const isTerraced = propertyType === 'terraced';
  const isSemiDetached = propertyType === 'semi_detached';
  const affectedProperties: string[] = [];
  let noticeType: PartyWallNoticeType | null = null;
  const process: string[] = [];
  
  if (!isTerraced && !isSemiDetached && !hasBasement) {
    return {
      required: false,
      noticeType: null,
      noticePeriod: 0,
      affectedProperties: [],
      estimatedCost: { min: 0, max: 0 },
      process: ['No Party Wall Act notices required for detached property'],
    };
  }
  
  // Determine affected properties and notice type
  const devLower = developmentType.toLowerCase();
  if (devLower.includes('extension') || devLower.includes('loft')) {
    if (isTerraced) {
      affectedProperties.push('Left neighbour', 'Right neighbour');
      noticeType = 'section_3';
    } else if (isSemiDetached) {
      affectedProperties.push('Attached neighbour');
      noticeType = 'section_3';
    }
  }
  
  if (hasBasement) {
    if (noticeType) {
      noticeType = 'combined';
    } else {
      noticeType = 'section_6';
    }
    if (!affectedProperties.includes('Rear neighbour')) {
      affectedProperties.push('Rear neighbour (if within 6m)');
    }
  }
  
  if (!noticeType) {
    return {
      required: false,
      noticeType: null,
      noticePeriod: 0,
      affectedProperties: [],
      estimatedCost: { min: 0, max: 0 },
      process: ['No Party Wall notices appear required'],
    };
  }
  
  const requirements = NOTICE_REQUIREMENTS[noticeType];
  
  // Process steps
  process.push('Appoint party wall surveyor');
  process.push('Serve notice on affected neighbours');
  process.push(`Wait ${requirements.noticePeriod} days notice period`);
  process.push('Neighbour responds: consent, dissent, or silence');
  process.push('If dissent: surveyors prepare award');
  process.push('Schedule of condition prepared');
  process.push('Works proceed per award terms');
  
  // Cost calculation
  const propertyCount = affectedProperties.filter(p => !p.includes('if within')).length || 1;
  const baseCost = noticeType === 'section_6' || noticeType === 'combined' ? 1500 : 800;
  
  return {
    required: true,
    noticeType,
    noticePeriod: requirements.noticePeriod,
    affectedProperties,
    estimatedCost: {
      min: baseCost * propertyCount,
      max: baseCost * 2 * propertyCount,
    },
    process,
  };
}

function assessRightOfLight(
  extensionHeight: number,
  distanceToNeighbour: number,
  neighbourWindows: number
): RightOfLightResult {
  const criticalDistance = extensionHeight; // 45° rule
  const recommendations: string[] = [];
  
  if (distanceToNeighbour >= criticalDistance) {
    return {
      atRisk: false,
      riskLevel: 'low',
      affectedWindows: 0,
      recommendations: [
        'Development complies with 45° rule',
        'Formal assessment not essential',
      ],
    };
  }
  
  const overlapRatio = (criticalDistance - distanceToNeighbour) / criticalDistance;
  const affectedWindows = Math.ceil(neighbourWindows * overlapRatio);
  
  let riskLevel: 'low' | 'medium' | 'high' = 'low';
  if (overlapRatio > 0.5 || affectedWindows > 3) {
    riskLevel = 'high';
    recommendations.push('Commission professional right of light survey');
    recommendations.push('Consider design modifications');
    recommendations.push('Budget for potential compensation');
  } else if (overlapRatio > 0.25 || affectedWindows > 1) {
    riskLevel = 'medium';
    recommendations.push('Consider right of light assessment');
    recommendations.push('Engage with neighbours early');
  } else {
    riskLevel = 'low';
    recommendations.push('Low risk but monitor situation');
  }
  
  return {
    atRisk: true,
    riskLevel,
    affectedWindows,
    recommendations,
  };
}

function getCovenants(postcode: string) {
  const areaMatch = postcode.match(/^(NW\d{1,2}|N\d{1,2})/i);
  const area = areaMatch && areaMatch[1] ? areaMatch[1].toUpperCase() : '';
  
  return AREA_COVENANTS[area] || [];
}

function getLegalChecklist(propertyType: string, hasBasement: boolean) {
  const checklist = [
    {
      category: 'Title and Ownership',
      items: [
        { item: 'Obtain title documents from Land Registry', priority: 'essential' },
        { item: 'Review title plan for boundaries', priority: 'essential' },
        { item: 'Check for restrictive covenants', priority: 'essential' },
        { item: 'Verify boundary ownership (T-marks)', priority: 'recommended' },
        { item: 'Review existing easements', priority: 'essential' },
      ],
    },
    {
      category: 'Rights of Light',
      items: [
        { item: 'Assess impact on neighbouring windows', priority: 'recommended' },
        { item: 'Consider ROL survey if high impact', priority: hasBasement ? 'recommended' : 'optional' },
        { item: 'Consider indemnity insurance', priority: 'optional' },
      ],
    },
    {
      category: 'Access',
      items: [
        { item: 'Confirm site access arrangements', priority: 'essential' },
        { item: 'Agree scaffolding licence if needed', priority: 'recommended' },
        { item: 'Check for rights of way', priority: 'essential' },
      ],
    },
  ];
  
  const isAttached = propertyType === 'terraced' || propertyType === 'semi_detached';
  
  if (isAttached || hasBasement) {
    checklist.splice(1, 0, {
      category: 'Party Wall Act',
      items: [
        { item: 'Identify adjoining owners', priority: 'essential' },
        { item: 'Appoint party wall surveyor', priority: 'essential' },
        { item: 'Serve appropriate notices', priority: 'essential' },
        { item: 'Allow notice period', priority: 'essential' },
        { item: 'Prepare schedule of condition', priority: 'essential' },
        { item: 'Obtain award before works', priority: 'essential' },
      ],
    });
  }
  
  return checklist;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;
    
    if (action === 'party-wall') {
      const { propertyType, developmentType, hasBasement } = body;
      if (!propertyType) {
        return NextResponse.json({ error: 'propertyType required' }, { status: 400 });
      }
      
      const assessment = assessPartyWall(
        propertyType,
        developmentType || 'extension',
        hasBasement || false
      );
      
      return NextResponse.json({ success: true, partyWall: assessment });
    }
    
    if (action === 'right-of-light') {
      const { extensionHeight, distanceToNeighbour, neighbourWindows } = body;
      
      const assessment = assessRightOfLight(
        extensionHeight || 3,
        distanceToNeighbour || 5,
        neighbourWindows || 4
      );
      
      return NextResponse.json({ success: true, rightOfLight: assessment });
    }
    
    if (action === 'covenants') {
      const { postcode } = body;
      if (!postcode) {
        return NextResponse.json({ error: 'postcode required' }, { status: 400 });
      }
      
      const covenants = getCovenants(postcode);
      return NextResponse.json({
        success: true,
        postcode,
        commonCovenants: covenants,
        note: 'Always check title deeds for actual covenants',
      });
    }
    
    if (action === 'checklist') {
      const { propertyType, hasBasement } = body;
      const checklist = getLegalChecklist(
        propertyType || 'terraced',
        hasBasement || false
      );
      
      return NextResponse.json({ success: true, checklist });
    }
    
    return NextResponse.json(
      { error: 'Invalid action. Use: party-wall, right-of-light, covenants, checklist' },
      { status: 400 }
    );
    
  } catch (error) {
    console.error('Boundary Legal API error:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const propertyType = searchParams.get('propertyType');
  
  if (propertyType) {
    const quickAssessment = assessPartyWall(propertyType, 'extension', false);
    return NextResponse.json({
      propertyType,
      partyWallRequired: quickAssessment.required,
      noticeType: quickAssessment.noticeType,
    });
  }
  
  return NextResponse.json({
    service: 'Boundary & Legal API',
    version: '1.0.0',
    description: 'Party Wall, boundaries, and legal considerations',
    endpoints: {
      'GET /api/boundary-legal': 'Service info',
      'GET /api/boundary-legal?propertyType=terraced': 'Quick Party Wall check',
      'POST /api/boundary-legal (action: party-wall)': 'Full Party Wall assessment',
      'POST /api/boundary-legal (action: right-of-light)': 'Right of light assessment',
      'POST /api/boundary-legal (action: covenants)': 'Check common covenants',
      'POST /api/boundary-legal (action: checklist)': 'Legal checklist',
    },
    propertyTypes: ['detached', 'semi_detached', 'terraced', 'flat'],
    noticeTypes: Object.keys(NOTICE_REQUIREMENTS),
  });
}
