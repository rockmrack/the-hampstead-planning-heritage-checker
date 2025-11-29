/**
 * Materials Specification API
 * Heritage-appropriate materials guidance
 * GET/POST /api/materials
 */

import { NextRequest, NextResponse } from 'next/server';

type MaterialCategory = 'brickwork' | 'roofing' | 'windows' | 'doors' | 'rainwater_goods';
type MaterialApproval = 'preferred' | 'acceptable' | 'avoid' | 'prohibited';

interface MaterialSpec {
  name: string;
  category: MaterialCategory;
  approval: MaterialApproval;
  description: string;
  suppliers: string[];
  priceRange: { min: number; max: number; unit: string };
  conservationAreaSuitable: boolean;
  listedBuildingSuitable: boolean;
}

// Materials database
const MATERIALS: MaterialSpec[] = [
  // Brickwork
  {
    name: 'London Stock Brick',
    category: 'brickwork',
    approval: 'preferred',
    description: 'Traditional yellow/brown London stock brick',
    suppliers: ['Ibstock', 'Wienerberger', 'Northcot', 'York Handmade'],
    priceRange: { min: 0.80, max: 2.50, unit: 'per brick' },
    conservationAreaSuitable: true,
    listedBuildingSuitable: true,
  },
  {
    name: 'Reclaimed London Stock',
    category: 'brickwork',
    approval: 'preferred',
    description: 'Salvaged original London stock bricks',
    suppliers: ['SalvoWEB', 'LASSCO', 'Retrouvius'],
    priceRange: { min: 1.20, max: 3.50, unit: 'per brick' },
    conservationAreaSuitable: true,
    listedBuildingSuitable: true,
  },
  {
    name: 'Red Multi Stock',
    category: 'brickwork',
    approval: 'acceptable',
    description: 'Red multi-colored stock brick',
    suppliers: ['Ibstock', 'Michelmersh'],
    priceRange: { min: 0.70, max: 2.00, unit: 'per brick' },
    conservationAreaSuitable: true,
    listedBuildingSuitable: true,
  },
  {
    name: 'Engineering Brick',
    category: 'brickwork',
    approval: 'avoid',
    description: 'Dense engineering brick - inappropriate for visible elevations',
    suppliers: ['Various'],
    priceRange: { min: 0.50, max: 1.00, unit: 'per brick' },
    conservationAreaSuitable: false,
    listedBuildingSuitable: false,
  },
  
  // Roofing
  {
    name: 'Natural Welsh Slate',
    category: 'roofing',
    approval: 'preferred',
    description: 'Traditional blue-grey Welsh slate',
    suppliers: ['Welsh Slate', 'Penrhyn Quarry', 'Cwt-y-Bugail'],
    priceRange: { min: 80, max: 150, unit: 'per sqm' },
    conservationAreaSuitable: true,
    listedBuildingSuitable: true,
  },
  {
    name: 'Reclaimed Welsh Slate',
    category: 'roofing',
    approval: 'preferred',
    description: 'Salvaged original slate',
    suppliers: ['LASSCO', 'Architectural Heritage'],
    priceRange: { min: 60, max: 120, unit: 'per sqm' },
    conservationAreaSuitable: true,
    listedBuildingSuitable: true,
  },
  {
    name: 'Spanish Slate',
    category: 'roofing',
    approval: 'acceptable',
    description: 'Imported natural slate',
    suppliers: ['Various importers'],
    priceRange: { min: 50, max: 90, unit: 'per sqm' },
    conservationAreaSuitable: true,
    listedBuildingSuitable: false,
  },
  {
    name: 'Plain Clay Tile',
    category: 'roofing',
    approval: 'preferred',
    description: 'Traditional handmade clay tiles',
    suppliers: ['Dreadnought', 'Keymer', 'Tudor Roof Tiles'],
    priceRange: { min: 70, max: 130, unit: 'per sqm' },
    conservationAreaSuitable: true,
    listedBuildingSuitable: true,
  },
  {
    name: 'Concrete Tile',
    category: 'roofing',
    approval: 'avoid',
    description: 'Concrete interlocking tiles - inappropriate in conservation areas',
    suppliers: ['Marley', 'Redland'],
    priceRange: { min: 30, max: 50, unit: 'per sqm' },
    conservationAreaSuitable: false,
    listedBuildingSuitable: false,
  },
  
  // Windows
  {
    name: 'Timber Sliding Sash',
    category: 'windows',
    approval: 'preferred',
    description: 'Traditional timber box sash windows',
    suppliers: ['Ventrolla', 'Mumford & Wood', 'Patchett Joinery'],
    priceRange: { min: 1200, max: 3500, unit: 'per window' },
    conservationAreaSuitable: true,
    listedBuildingSuitable: true,
  },
  {
    name: 'Timber Casement',
    category: 'windows',
    approval: 'preferred',
    description: 'Traditional timber casement windows',
    suppliers: ['Various joinery specialists'],
    priceRange: { min: 800, max: 2000, unit: 'per window' },
    conservationAreaSuitable: true,
    listedBuildingSuitable: true,
  },
  {
    name: 'Slim Profile Aluminium',
    category: 'windows',
    approval: 'acceptable',
    description: 'Slim aluminium frames for extensions',
    suppliers: ['Crittall', 'IQ Glass', 'Mondrian'],
    priceRange: { min: 500, max: 1500, unit: 'per sqm' },
    conservationAreaSuitable: true,
    listedBuildingSuitable: false,
  },
  {
    name: 'uPVC Windows',
    category: 'windows',
    approval: 'prohibited',
    description: 'Plastic windows - prohibited in conservation areas',
    suppliers: ['Various'],
    priceRange: { min: 300, max: 600, unit: 'per window' },
    conservationAreaSuitable: false,
    listedBuildingSuitable: false,
  },
  
  // Doors
  {
    name: 'Panelled Timber Door',
    category: 'doors',
    approval: 'preferred',
    description: 'Traditional 4 or 6 panel timber entrance door',
    suppliers: ['Local joiners', 'London Door Company'],
    priceRange: { min: 800, max: 3000, unit: 'per door' },
    conservationAreaSuitable: true,
    listedBuildingSuitable: true,
  },
  {
    name: 'Composite Door',
    category: 'doors',
    approval: 'avoid',
    description: 'Modern composite doors - inappropriate for period properties',
    suppliers: ['Various'],
    priceRange: { min: 400, max: 1000, unit: 'per door' },
    conservationAreaSuitable: false,
    listedBuildingSuitable: false,
  },
  
  // Rainwater goods
  {
    name: 'Cast Iron Guttering',
    category: 'rainwater_goods',
    approval: 'preferred',
    description: 'Traditional cast iron gutters and downpipes',
    suppliers: ['Tuscan Foundry', 'J&JW Longbottom', 'Hargreaves'],
    priceRange: { min: 80, max: 150, unit: 'per linear meter' },
    conservationAreaSuitable: true,
    listedBuildingSuitable: true,
  },
  {
    name: 'Aluminium Heritage Profile',
    category: 'rainwater_goods',
    approval: 'acceptable',
    description: 'Aluminium in heritage profile',
    suppliers: ['Marley', 'Brett Martin'],
    priceRange: { min: 30, max: 60, unit: 'per linear meter' },
    conservationAreaSuitable: true,
    listedBuildingSuitable: false,
  },
  {
    name: 'uPVC Guttering',
    category: 'rainwater_goods',
    approval: 'avoid',
    description: 'Plastic guttering - avoid on visible elevations',
    suppliers: ['Various'],
    priceRange: { min: 10, max: 25, unit: 'per linear meter' },
    conservationAreaSuitable: false,
    listedBuildingSuitable: false,
  },
];

// Area palettes
const AREA_PALETTES: Record<string, { materials: string[]; colors: string[]; features: string[] }> = {
  'Hampstead': {
    materials: ['London stock brick', 'Welsh slate', 'Painted timber', 'Cast iron'],
    colors: ['Cream', 'White', 'Black', 'Dark green'],
    features: ['Sash windows', 'Panelled doors', 'Iron railings'],
  },
  'Hampstead Garden Suburb': {
    materials: ['Handmade brick', 'Plain clay tiles', 'Render', 'Leaded lights'],
    colors: ['White render', 'Natural brick tones', 'Green', 'Black'],
    features: ['Casement windows', 'Cottage style doors', 'Arts and Crafts details'],
  },
  'Highgate': {
    materials: ['London stock brick', 'Welsh slate', 'Painted stucco'],
    colors: ['Cream', 'Stone', 'White', 'Black'],
    features: ['Georgian proportions', 'Sash windows', 'Classical details'],
  },
};

interface PaletteRequest {
  address: string;
  postcode: string;
  projectType: string;
  isListedBuilding: boolean;
  inConservationArea: boolean;
  conservationAreaName?: string;
  categories?: MaterialCategory[];
}

function generatePalette(input: PaletteRequest) {
  const categories = input.categories || ['brickwork', 'roofing', 'windows', 'doors'] as MaterialCategory[];
  
  const recommendations = categories.map(category => {
    const materials = MATERIALS.filter(m => m.category === category);
    
    const filtered = materials.filter(m => {
      if (input.isListedBuilding && !m.listedBuildingSuitable && m.approval !== 'prohibited') {
        return m.approval === 'avoid';
      }
      return true;
    });
    
    return {
      category,
      preferred: filtered.filter(m => m.approval === 'preferred'),
      acceptable: filtered.filter(m => m.approval === 'acceptable'),
      avoid: filtered.filter(m => m.approval === 'avoid' || m.approval === 'prohibited'),
      guidance: getGuidance(category, input.isListedBuilding),
    };
  });
  
  const palette = input.conservationAreaName && AREA_PALETTES[input.conservationAreaName]
    ? AREA_PALETTES[input.conservationAreaName]
    : AREA_PALETTES['Hampstead']!;
  
  return {
    project: {
      address: input.address,
      projectType: input.projectType,
      isListed: input.isListedBuilding,
      inConservationArea: input.inConservationArea,
    },
    recommendations,
    localCharacter: palette,
  };
}

function getGuidance(category: MaterialCategory, isListed: boolean): string {
  const guidance: Record<MaterialCategory, string> = {
    'brickwork': isListed 
      ? 'Match existing brick type, size, bond pattern, and mortar. Use lime mortar only.'
      : 'Match predominant local brick type and bond pattern.',
    'roofing': isListed
      ? 'Use matching natural slate or traditional materials. No modern substitutes.'
      : 'Natural slate or plain clay tiles preferred in conservation areas.',
    'windows': isListed
      ? 'Repair and upgrade existing where possible. Replacement must match original exactly.'
      : 'Timber windows preferred. Slim profile metal acceptable for new extensions.',
    'doors': 'Traditional panelled timber doors required for principal elevations.',
    'rainwater_goods': isListed
      ? 'Cast iron required on listed buildings.'
      : 'Cast iron or heritage profile aluminium acceptable.',
  };
  
  return guidance[category] ?? 'Select materials appropriate to local character.';
}

export async function POST(request: NextRequest) {
  try {
    const body: PaletteRequest = await request.json();
    
    if (!body.address || !body.postcode) {
      return NextResponse.json(
        { error: 'Missing required fields: address, postcode' },
        { status: 400 }
      );
    }
    
    const palette = generatePalette(body);
    
    return NextResponse.json({
      success: true,
      palette,
      generatedAt: new Date().toISOString(),
    });
    
  } catch (error) {
    console.error('Materials error:', error);
    return NextResponse.json(
      { error: 'Failed to generate material palette' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') as MaterialCategory | null;
  const search = searchParams.get('search');
  const conservationArea = searchParams.get('conservationArea');
  
  if (conservationArea && AREA_PALETTES[conservationArea]) {
    return NextResponse.json({
      conservationArea,
      palette: AREA_PALETTES[conservationArea],
    });
  }
  
  if (search) {
    const searchLC = search.toLowerCase();
    const results = MATERIALS.filter(m =>
      m.name.toLowerCase().includes(searchLC) ||
      m.description.toLowerCase().includes(searchLC)
    );
    return NextResponse.json({ search, results });
  }
  
  if (category) {
    const materials = MATERIALS.filter(m => m.category === category);
    return NextResponse.json({ category, materials });
  }
  
  return NextResponse.json({
    service: 'Materials Specification API',
    version: '1.0.0',
    description: 'Heritage-appropriate materials guidance',
    endpoints: {
      'GET /api/materials': 'List all materials or filter',
      'GET /api/materials?category=brickwork': 'Materials by category',
      'GET /api/materials?search=slate': 'Search materials',
      'GET /api/materials?conservationArea=Hampstead': 'Get area palette',
      'POST /api/materials': 'Generate project material palette',
    },
    categories: ['brickwork', 'roofing', 'windows', 'doors', 'rainwater_goods'],
    conservationAreas: Object.keys(AREA_PALETTES),
    totalMaterials: MATERIALS.length,
  });
}
