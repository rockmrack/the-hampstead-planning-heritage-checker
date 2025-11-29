/**
 * Sustainability & Energy API
 * Energy efficiency, renewables, and Part L compliance
 * GET/POST /api/sustainability
 */

import { NextRequest, NextResponse } from 'next/server';

// Types
type EnergyRating = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';

interface EnergyMeasure {
  measure: string;
  costRange: { min: number; max: number };
  annualSaving: { min: number; max: number };
  heritageImpact: 'none' | 'low' | 'medium' | 'high';
  planningRequired: boolean;
  notes: string;
}

interface RenewableOption {
  technology: string;
  suitable: boolean;
  cost: { min: number; max: number };
  annualSaving: { min: number; max: number };
  heritageRestrictions: string[];
  planningRequired: boolean;
}

// Heritage-compatible energy measures
const ENERGY_MEASURES: EnergyMeasure[] = [
  {
    measure: 'Internal wall insulation (breathable)',
    costRange: { min: 8000, max: 15000 },
    annualSaving: { min: 300, max: 600 },
    heritageImpact: 'low',
    planningRequired: false,
    notes: 'Use lime-based systems for moisture management',
  },
  {
    measure: 'Loft insulation (natural materials)',
    costRange: { min: 500, max: 1500 },
    annualSaving: { min: 200, max: 400 },
    heritageImpact: 'none',
    planningRequired: false,
    notes: "Sheep's wool or hemp - breathable and reversible",
  },
  {
    measure: 'Secondary glazing',
    costRange: { min: 3000, max: 8000 },
    annualSaving: { min: 150, max: 350 },
    heritageImpact: 'low',
    planningRequired: false,
    notes: 'Preserves original windows, reversible',
  },
  {
    measure: 'Draught proofing',
    costRange: { min: 200, max: 800 },
    annualSaving: { min: 100, max: 250 },
    heritageImpact: 'none',
    planningRequired: false,
    notes: 'Brush strips, compression seals - fully reversible',
  },
  {
    measure: 'Chimney sheep/balloon',
    costRange: { min: 30, max: 80 },
    annualSaving: { min: 50, max: 150 },
    heritageImpact: 'none',
    planningRequired: false,
    notes: 'Simple, significant heat loss reduction',
  },
  {
    measure: 'Underfloor insulation',
    costRange: { min: 1500, max: 4000 },
    annualSaving: { min: 150, max: 350 },
    heritageImpact: 'low',
    planningRequired: false,
    notes: 'Natural materials, maintain ventilation',
  },
  {
    measure: 'Heat pump (air source)',
    costRange: { min: 10000, max: 18000 },
    annualSaving: { min: 500, max: 1200 },
    heritageImpact: 'medium',
    planningRequired: true,
    notes: 'External unit needs planning in conservation areas',
  },
  {
    measure: 'LED lighting',
    costRange: { min: 500, max: 2000 },
    annualSaving: { min: 100, max: 300 },
    heritageImpact: 'none',
    planningRequired: false,
    notes: 'Maintain traditional fitting styles where visible',
  },
  {
    measure: 'Smart heating controls',
    costRange: { min: 300, max: 1000 },
    annualSaving: { min: 150, max: 400 },
    heritageImpact: 'none',
    planningRequired: false,
    notes: 'Zone control, learning thermostats',
  },
];

// Renewable options
const RENEWABLES: RenewableOption[] = [
  {
    technology: 'Air Source Heat Pump',
    suitable: true,
    cost: { min: 10000, max: 18000 },
    annualSaving: { min: 500, max: 1200 },
    heritageRestrictions: [
      'External unit location critical',
      'Avoid front elevations',
      'Screen with planting',
    ],
    planningRequired: true,
  },
  {
    technology: 'Ground Source Heat Pump',
    suitable: true,
    cost: { min: 20000, max: 40000 },
    annualSaving: { min: 700, max: 1500 },
    heritageRestrictions: [
      'Garden archaeology assessment may be needed',
      'Requires adequate garden space',
    ],
    planningRequired: false,
  },
  {
    technology: 'Solar PV',
    suitable: false,
    cost: { min: 8000, max: 15000 },
    annualSaving: { min: 400, max: 900 },
    heritageRestrictions: [
      'Front roofs typically refused',
      'Rear roofs may be acceptable',
      'Listed buildings need LBC',
    ],
    planningRequired: true,
  },
  {
    technology: 'Battery Storage',
    suitable: true,
    cost: { min: 5000, max: 10000 },
    annualSaving: { min: 100, max: 300 },
    heritageRestrictions: ['Internal installation only'],
    planningRequired: false,
  },
];

// Part L requirements
const PART_L = {
  newBuild: { walls: 0.18, roof: 0.11, floor: 0.13, windows: 1.2 },
  extension: { walls: 0.18, roof: 0.11, floor: 0.13, windows: 1.2 },
  renovation: { walls: 0.30, roof: 0.16, floor: 0.25, windows: 1.4 },
};

function assessEnergy(
  currentRating: EnergyRating,
  isListed: boolean,
  inConservationArea: boolean
) {
  let measures = [...ENERGY_MEASURES];
  
  if (isListed) {
    measures = measures.filter(m => 
      m.heritageImpact === 'none' || m.heritageImpact === 'low'
    );
  } else if (inConservationArea) {
    measures = measures.filter(m => 
      m.heritageImpact !== 'high' || !m.planningRequired
    );
  }
  
  const ratingMap: Record<EnergyRating, number> = {
    A: 92, B: 81, C: 69, D: 55, E: 39, F: 21, G: 1,
  };
  const currentScore = ratingMap[currentRating];
  
  let potentialScore = currentScore;
  for (const m of measures.slice(0, 5)) {
    potentialScore += (m.annualSaving.max / 50);
  }
  potentialScore = Math.min(potentialScore, 92);
  
  let potentialRating: EnergyRating = 'G';
  for (const [rating, minScore] of Object.entries(ratingMap) as [EnergyRating, number][]) {
    if (potentialScore >= minScore) {
      potentialRating = rating;
      break;
    }
  }
  
  const heritageNotes: string[] = [];
  if (isListed) {
    heritageNotes.push('Listed building consent required for most visible changes');
    heritageNotes.push('Prioritise reversible interventions');
    heritageNotes.push('Use breathable, traditional materials');
  } else if (inConservationArea) {
    heritageNotes.push('External changes may need planning permission');
    heritageNotes.push('Solar panels unlikely on front-facing roofs');
  }
  
  return {
    currentRating,
    currentScore,
    potentialRating,
    potentialScore: Math.round(potentialScore),
    recommendations: measures,
    heritageConsiderations: heritageNotes,
  };
}

function assessRenewables(
  isListed: boolean,
  inConservationArea: boolean,
  hasGarden: boolean,
  roofOrientation: string
) {
  const options = RENEWABLES.map(r => {
    const option = { ...r };
    
    if (isListed) {
      if (r.technology.includes('Solar') || r.technology === 'Air Source Heat Pump') {
        option.suitable = false;
      }
    }
    
    if (r.technology === 'Ground Source Heat Pump' && !hasGarden) {
      option.suitable = false;
    }
    
    if (r.technology.includes('Solar') && roofOrientation === 'north') {
      option.suitable = false;
    }
    
    return option;
  });
  
  return options;
}

function getPartLRequirements(workType: string, isListed: boolean) {
  let requirements = PART_L.extension;
  
  if (workType === 'new_build') {
    requirements = PART_L.newBuild;
  } else if (workType === 'renovation') {
    requirements = PART_L.renovation;
  }
  
  const exemptions: string[] = [];
  if (isListed) {
    exemptions.push('Works exempt if compliance would alter character unacceptably');
    exemptions.push('U-value targets may be relaxed for historic fabric');
  }
  
  return {
    uValues: requirements,
    heritageExemptions: exemptions,
    renewableRequired: workType === 'new_build',
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;
    
    if (action === 'assess-energy') {
      const { currentRating, isListed, inConservationArea } = body;
      if (!currentRating) {
        return NextResponse.json({ error: 'currentRating required (A-G)' }, { status: 400 });
      }
      
      const assessment = assessEnergy(
        currentRating as EnergyRating,
        isListed || false,
        inConservationArea || false
      );
      
      return NextResponse.json({ success: true, assessment });
    }
    
    if (action === 'assess-renewables') {
      const { isListed, inConservationArea, hasGarden, roofOrientation } = body;
      
      const options = assessRenewables(
        isListed || false,
        inConservationArea || false,
        hasGarden ?? true,
        roofOrientation || 'south'
      );
      
      return NextResponse.json({ success: true, renewableOptions: options });
    }
    
    if (action === 'part-l') {
      const { workType, isListed } = body;
      const requirements = getPartLRequirements(
        workType || 'extension',
        isListed || false
      );
      
      return NextResponse.json({ success: true, partL: requirements });
    }
    
    if (action === 'calculate-savings') {
      const { measures } = body;
      if (!measures || !Array.isArray(measures)) {
        return NextResponse.json({ error: 'measures array required' }, { status: 400 });
      }
      
      const selected = ENERGY_MEASURES.filter(m => measures.includes(m.measure));
      
      const totalCost = selected.reduce(
        (acc, m) => ({ min: acc.min + m.costRange.min, max: acc.max + m.costRange.max }),
        { min: 0, max: 0 }
      );
      
      const annualSaving = selected.reduce(
        (acc, m) => ({ min: acc.min + m.annualSaving.min, max: acc.max + m.annualSaving.max }),
        { min: 0, max: 0 }
      );
      
      const avgCost = (totalCost.min + totalCost.max) / 2;
      const avgSaving = (annualSaving.min + annualSaving.max) / 2;
      const payback = avgSaving > 0 ? Math.round(avgCost / avgSaving) : 0;
      const carbonSaving = Math.round((avgSaving / 0.30) * 0.2);
      
      return NextResponse.json({
        success: true,
        savings: {
          totalCost,
          annualSaving,
          paybackYears: payback,
          carbonSavingKgCO2: carbonSaving,
        },
      });
    }
    
    return NextResponse.json(
      { error: 'Invalid action. Use: assess-energy, assess-renewables, part-l, calculate-savings' },
      { status: 400 }
    );
    
  } catch (error) {
    console.error('Sustainability API error:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  if (searchParams.get('measures') === 'true') {
    return NextResponse.json({
      availableMeasures: ENERGY_MEASURES.map(m => ({
        name: m.measure,
        heritageImpact: m.heritageImpact,
        planningRequired: m.planningRequired,
      })),
    });
  }
  
  if (searchParams.get('renewables') === 'true') {
    return NextResponse.json({
      renewableOptions: RENEWABLES.map(r => ({
        technology: r.technology,
        defaultSuitability: r.suitable,
        planningRequired: r.planningRequired,
      })),
    });
  }
  
  return NextResponse.json({
    service: 'Sustainability & Energy API',
    version: '1.0.0',
    description: 'Energy efficiency, renewables, and Part L compliance',
    endpoints: {
      'GET /api/sustainability': 'Service info',
      'GET /api/sustainability?measures=true': 'List energy measures',
      'GET /api/sustainability?renewables=true': 'List renewable options',
      'POST /api/sustainability (action: assess-energy)': 'Energy assessment',
      'POST /api/sustainability (action: assess-renewables)': 'Renewable assessment',
      'POST /api/sustainability (action: part-l)': 'Part L requirements',
      'POST /api/sustainability (action: calculate-savings)': 'Calculate savings',
    },
    energyRatings: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
    workTypes: ['new_build', 'extension', 'renovation'],
  });
}
