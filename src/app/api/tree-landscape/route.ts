/**
 * Tree and Landscape API
 * Tree protection, TPO guidance, and landscaping advice
 * GET/POST /api/tree-landscape
 */

import { NextRequest, NextResponse } from 'next/server';

// Types
type TreeCategory = 'A' | 'B' | 'C' | 'U';

interface TreeProtectionResult {
  protectionStatus: string;
  conservationArea: boolean;
  hasTPO: boolean;
  rules: string[];
  advice: string[];
}

interface LandscapeGuidance {
  appropriateMaterials: string[];
  inappropriateMaterials: string[];
  plantingAdvice: string[];
  boundaryGuidance: string[];
}

// Conservation area tree rules
const CONSERVATION_RULES = [
  'Give 6 weeks written notice before any tree works',
  'Trees over 75mm diameter at 1.5m height are protected',
  'Council may impose TPO during notice period',
  'Replacement planting expected for felled trees',
];

// TPO rules
const TPO_RULES = [
  'Written consent required for all works',
  'Application form and fee required',
  '8 week determination period',
  'Conditions may be attached to consent',
  'Emergency works must be notified within 5 days',
];

// Heritage-appropriate materials
const APPROPRIATE_MATERIALS = [
  'York stone paving',
  'Reclaimed brick pavers',
  'Natural gravel',
  'Granite or sandstone setts',
  'Traditional clay pavers',
];

const INAPPROPRIATE_MATERIALS = [
  'Concrete block paving',
  'Tarmac driveways',
  'Modern composite decking',
  'Artificial grass',
  'Bright colored aggregates',
];

// Recommended trees
const RECOMMENDED_TREES: Record<string, string[]> = {
  small: ['Field Maple', 'Rowan', 'Crab Apple', 'Hawthorn', 'Amelanchier'],
  medium: ['Hornbeam', 'Wild Cherry', 'Birch', 'Magnolia', 'Whitebeam'],
  large: ['English Oak', 'Common Beech', 'Small-leaved Lime', 'London Plane', 'Cedar'],
};

function extractAreaPrefix(postcode: string): string {
  const match = postcode.match(/^(NW\d{1,2}|N\d{1,2})/i);
  return match && match[1] ? match[1].toUpperCase() : 'NW3';
}

function isConservationArea(postcode: string): boolean {
  const area = extractAreaPrefix(postcode);
  return ['NW3', 'NW6', 'NW8', 'NW11', 'N2', 'N6', 'N10'].includes(area);
}

function getTreeProtection(postcode: string, hasTPO: boolean): TreeProtectionResult {
  const inCA = isConservationArea(postcode);
  
  let protectionStatus = 'Standard Protection';
  const rules: string[] = [];
  const advice: string[] = [];
  
  if (hasTPO && inCA) {
    protectionStatus = 'Maximum Protection - TPO + Conservation Area';
    rules.push(...TPO_RULES);
    rules.push(...CONSERVATION_RULES.filter(r => !rules.includes(r)));
  } else if (hasTPO) {
    protectionStatus = 'TPO Protection';
    rules.push(...TPO_RULES);
  } else if (inCA) {
    protectionStatus = 'Conservation Area Protection';
    rules.push(...CONSERVATION_RULES);
  } else {
    rules.push('No special protection applies');
    rules.push('Check for TPOs before any works');
  }
  
  advice.push('Engage a qualified arborist for professional advice');
  advice.push('Consider root protection areas when planning construction');
  
  if (inCA) {
    advice.push('Use native species for replacement planting');
    advice.push('Maintain existing garden character');
  }
  
  return {
    protectionStatus,
    conservationArea: inCA,
    hasTPO,
    rules,
    advice,
  };
}

function getLandscapeGuidance(postcode: string, isListed: boolean): LandscapeGuidance {
  const plantingAdvice = [
    'Use native species where possible',
    'Consider seasonal interest',
    'Maintain traditional garden character',
    'Include pollinator-friendly planting',
  ];
  
  const boundaryGuidance = [
    'Maintain existing boundary treatments where possible',
    'Traditional brick walls or hedging preferred',
    'Iron railings appropriate for Georgian/Victorian properties',
    'Avoid close-board fencing at front boundaries',
  ];
  
  if (isListed) {
    plantingAdvice.push('Research historic planting schemes for the property');
    boundaryGuidance.push('Listed building consent may be needed for boundary changes');
  }
  
  return {
    appropriateMaterials: APPROPRIATE_MATERIALS,
    inappropriateMaterials: INAPPROPRIATE_MATERIALS,
    plantingAdvice,
    boundaryGuidance,
  };
}

function getTreeRecommendations(size: 'small' | 'medium' | 'large', forHeritage: boolean) {
  const trees = RECOMMENDED_TREES[size] || RECOMMENDED_TREES['medium'];
  
  return {
    size,
    recommendedSpecies: trees,
    notes: forHeritage 
      ? 'Native species and historically appropriate varieties preferred'
      : 'Consider mature size and root spread when selecting',
    rootProtectionNote: 'Ensure adequate distance from buildings and boundaries',
  };
}

interface TreeWorkRequest {
  postcode: string;
  hasTPO?: boolean;
  workType?: 'fell' | 'prune' | 'crown_reduction' | 'dead_wooding';
}

function getTreeWorkGuidance(request: TreeWorkRequest) {
  const { postcode, hasTPO = false, workType = 'prune' } = request;
  const inCA = isConservationArea(postcode);
  
  let applicationType = 'None required';
  let processingTime = 'N/A';
  let approvalLikelihood: 'high' | 'medium' | 'low' = 'high';
  const requirements: string[] = [];
  
  if (hasTPO) {
    applicationType = 'TPO Application';
    processingTime = '8 weeks';
    requirements.push('TPO application form');
    requirements.push('Tree location plan');
    requirements.push('Description of proposed works');
    requirements.push('Justification for works');
    
    if (workType === 'fell') {
      approvalLikelihood = 'low';
      requirements.push('Strong justification required');
      requirements.push('Replacement planting proposal');
    }
  } else if (inCA) {
    applicationType = 'Conservation Area Notification';
    processingTime = '6 weeks (42 days)';
    requirements.push('Section 211 notice');
    requirements.push('Tree location plan');
    requirements.push('Description of works');
    
    if (workType === 'fell') {
      approvalLikelihood = 'medium';
      requirements.push('Reason for felling');
    }
  }
  
  return {
    workType,
    applicationType,
    processingTime,
    approvalLikelihood,
    requirements,
    fees: hasTPO ? 'None (TPO applications are free)' : inCA ? 'None' : 'None required',
    advice: 'Engage qualified arborist to specify works correctly',
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;
    
    if (action === 'tree-protection') {
      const { postcode, hasTPO } = body;
      if (!postcode) {
        return NextResponse.json({ error: 'Postcode required' }, { status: 400 });
      }
      
      const protection = getTreeProtection(postcode, hasTPO || false);
      return NextResponse.json({ success: true, protection });
    }
    
    if (action === 'landscape-guidance') {
      const { postcode, isListed } = body;
      if (!postcode) {
        return NextResponse.json({ error: 'Postcode required' }, { status: 400 });
      }
      
      const guidance = getLandscapeGuidance(postcode, isListed || false);
      return NextResponse.json({ success: true, guidance });
    }
    
    if (action === 'tree-work') {
      const { postcode, hasTPO, workType } = body;
      if (!postcode) {
        return NextResponse.json({ error: 'Postcode required' }, { status: 400 });
      }
      
      const workGuidance = getTreeWorkGuidance({ postcode, hasTPO, workType });
      return NextResponse.json({ success: true, workGuidance });
    }
    
    if (action === 'tree-recommendations') {
      const { size, forHeritage } = body;
      const recommendations = getTreeRecommendations(size || 'medium', forHeritage || false);
      return NextResponse.json({ success: true, recommendations });
    }
    
    return NextResponse.json(
      { error: 'Invalid action. Use: tree-protection, landscape-guidance, tree-work, tree-recommendations' },
      { status: 400 }
    );
    
  } catch (error) {
    console.error('Tree & Landscape API error:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const postcode = searchParams.get('postcode');
  
  if (postcode) {
    const protection = getTreeProtection(postcode, false);
    const guidance = getLandscapeGuidance(postcode, false);
    
    return NextResponse.json({
      postcode,
      treeProtection: protection,
      landscapeGuidance: guidance,
    });
  }
  
  return NextResponse.json({
    service: 'Tree & Landscape API',
    version: '1.0.0',
    description: 'Tree protection and landscaping guidance for Hampstead area',
    endpoints: {
      'GET /api/tree-landscape': 'Service info',
      'GET /api/tree-landscape?postcode=NW3': 'Quick check',
      'POST /api/tree-landscape (action: tree-protection)': 'Tree protection status',
      'POST /api/tree-landscape (action: landscape-guidance)': 'Landscaping advice',
      'POST /api/tree-landscape (action: tree-work)': 'Tree works guidance',
      'POST /api/tree-landscape (action: tree-recommendations)': 'Replacement tree recommendations',
    },
    treeCategories: ['A (high quality)', 'B (moderate quality)', 'C (low quality)', 'U (remove)'],
    recommendedTreeSizes: ['small', 'medium', 'large'],
  });
}
