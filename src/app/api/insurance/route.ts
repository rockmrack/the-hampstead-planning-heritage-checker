/**
 * Insurance Requirements API
 * Development insurance, warranties, and professional indemnity
 * GET/POST /api/insurance
 */

import { NextRequest, NextResponse } from 'next/server';

// Types
type InsuranceType = 'contract_works' | 'public_liability' | 'employers_liability' | 
  'professional_indemnity' | 'site_insurance' | 'structural_warranty' | 'latent_defects' | 'title_indemnity';

interface InsuranceProduct {
  type: InsuranceType;
  name: string;
  description: string;
  required: 'mandatory' | 'recommended' | 'optional';
  typicalCover: string;
  indicativeCost: { min: number; max: number };
  duration: string;
}

interface WarrantyProvider {
  name: string;
  types: string[];
  term: number;
  costPer100k: { min: number; max: number };
  acceptance: string;
}

// Insurance products
const INSURANCE_PRODUCTS: InsuranceProduct[] = [
  {
    type: 'contract_works',
    name: 'Contract Works Insurance',
    description: 'Covers works during construction against damage, theft, loss',
    required: 'mandatory',
    typicalCover: 'Full contract value',
    indicativeCost: { min: 0.15, max: 0.5 }, // % of contract
    duration: 'Duration of works',
  },
  {
    type: 'public_liability',
    name: 'Public Liability Insurance',
    description: 'Covers injury to third parties or property damage',
    required: 'mandatory',
    typicalCover: '£5m-£10m',
    indicativeCost: { min: 500, max: 2500 }, // £ per annum
    duration: 'Throughout project',
  },
  {
    type: 'employers_liability',
    name: "Employers' Liability Insurance",
    description: 'Compulsory cover for employees',
    required: 'mandatory',
    typicalCover: '£10m minimum',
    indicativeCost: { min: 300, max: 1500 },
    duration: 'Annual',
  },
  {
    type: 'professional_indemnity',
    name: 'Professional Indemnity',
    description: 'Covers professional negligence by designers',
    required: 'mandatory',
    typicalCover: '£1m-£10m',
    indicativeCost: { min: 1000, max: 5000 },
    duration: '6-12 years from completion',
  },
  {
    type: 'site_insurance',
    name: 'Site Insurance (Non-Negligence)',
    description: 'Covers existing structures during works',
    required: 'recommended',
    typicalCover: 'Property value',
    indicativeCost: { min: 0.1, max: 0.3 }, // % of value
    duration: 'Duration of works',
  },
  {
    type: 'structural_warranty',
    name: 'Structural Warranty',
    description: '10-year warranty for new build defects',
    required: 'mandatory',
    typicalCover: 'Rebuild cost',
    indicativeCost: { min: 0.5, max: 1.5 }, // % of build cost
    duration: '10 years',
  },
  {
    type: 'latent_defects',
    name: 'Latent Defects Insurance',
    description: 'Covers hidden defects in existing construction',
    required: 'recommended',
    typicalCover: 'Repair costs',
    indicativeCost: { min: 0.3, max: 0.8 }, // % of value
    duration: '10-12 years',
  },
  {
    type: 'title_indemnity',
    name: 'Title Indemnity',
    description: 'Covers defects in title, covenants',
    required: 'optional',
    typicalCover: 'Property value + costs',
    indicativeCost: { min: 150, max: 1000 }, // one-off
    duration: 'Perpetuity',
  },
];

// Warranty providers
const WARRANTY_PROVIDERS: WarrantyProvider[] = [
  { name: 'NHBC', types: ['new_build', 'conversion'], term: 10, costPer100k: { min: 800, max: 1200 }, acceptance: 'Required by most lenders' },
  { name: 'LABC Warranty', types: ['new_build', 'conversion', 'extension'], term: 10, costPer100k: { min: 600, max: 1000 }, acceptance: 'Accepted by most lenders' },
  { name: 'Premier Guarantee', types: ['new_build', 'conversion', 'refurbishment'], term: 10, costPer100k: { min: 500, max: 900 }, acceptance: 'CML accepted' },
  { name: 'Architect Certification', types: ['extension', 'refurbishment'], term: 6, costPer100k: { min: 0, max: 0 }, acceptance: 'Works under £100k' },
];

// Heritage factors
const HERITAGE_INSURANCE: Record<string, { premiumIncrease: number; additionalCover: string[] }> = {
  'Grade I': { premiumIncrease: 50, additionalCover: ['Historic fabric reinstatement', 'Heritage specialist rebuild'] },
  'Grade II*': { premiumIncrease: 35, additionalCover: ['Heritage materials cover'] },
  'Grade II': { premiumIncrease: 20, additionalCover: ['Traditional materials cover'] },
  'Conservation Area': { premiumIncrease: 10, additionalCover: ['External reinstatement'] },
  'None': { premiumIncrease: 0, additionalCover: [] },
};

function getRequirements(
  projectType: string,
  projectValue: number,
  buildCost: number,
  heritageStatus: string,
  isNewBuild: boolean
) {
  const heritageFactor = HERITAGE_INSURANCE[heritageStatus] ?? HERITAGE_INSURANCE['None'] ?? { premiumIncrease: 0, additionalCover: [] };
  
  return INSURANCE_PRODUCTS.map(product => {
    let relevance: 'essential' | 'important' | 'useful' = 'useful';
    let estimatedCost = 0;
    const notes: string[] = [];
    
    if (product.type === 'contract_works') {
      relevance = 'essential';
      const rate = (product.indicativeCost.min + product.indicativeCost.max) / 2 / 100;
      estimatedCost = Math.round(buildCost * rate * (1 + heritageFactor.premiumIncrease / 100));
      if (heritageFactor.premiumIncrease > 0) {
        notes.push(`Heritage premium: +${heritageFactor.premiumIncrease}%`);
      }
    }
    
    if (product.type === 'public_liability' || product.type === 'professional_indemnity') {
      relevance = 'essential';
      estimatedCost = (product.indicativeCost.min + product.indicativeCost.max) / 2;
    }
    
    if (product.type === 'employers_liability') {
      relevance = 'important';
      estimatedCost = (product.indicativeCost.min + product.indicativeCost.max) / 2;
      notes.push('Verify contractor has this');
    }
    
    if (product.type === 'site_insurance') {
      relevance = projectValue > 1000000 ? 'important' : 'useful';
      const rate = (product.indicativeCost.min + product.indicativeCost.max) / 2 / 100;
      estimatedCost = Math.round(projectValue * rate);
    }
    
    if (product.type === 'structural_warranty') {
      if (isNewBuild || projectType === 'conversion') {
        relevance = 'essential';
        const rate = (product.indicativeCost.min + product.indicativeCost.max) / 2 / 100;
        estimatedCost = Math.round(buildCost * rate);
        notes.push('Required by mortgage lenders');
      }
    }
    
    if (product.type === 'latent_defects') {
      relevance = heritageStatus !== 'None' ? 'important' : 'useful';
      const rate = (product.indicativeCost.min + product.indicativeCost.max) / 2 / 100;
      estimatedCost = Math.round(projectValue * rate);
    }
    
    if (product.type === 'title_indemnity') {
      estimatedCost = (product.indicativeCost.min + product.indicativeCost.max) / 2;
    }
    
    if (heritageFactor.additionalCover.length > 0 && 
        ['contract_works', 'site_insurance'].includes(product.type)) {
      notes.push(`Additional cover needed: ${heritageFactor.additionalCover.join(', ')}`);
    }
    
    return {
      insurance: product,
      relevance,
      estimatedCost: Math.round(estimatedCost),
      notes,
    };
  }).sort((a, b) => {
    const order = { essential: 0, important: 1, useful: 2 };
    return order[a.relevance] - order[b.relevance];
  });
}

function getSuitableWarranties(projectType: string, buildCost: number) {
  return WARRANTY_PROVIDERS
    .filter(w => w.types.some(t => projectType.includes(t) || t === projectType))
    .map(w => ({
      ...w,
      estimatedCost: {
        min: Math.round((buildCost / 100000) * w.costPer100k.min),
        max: Math.round((buildCost / 100000) * w.costPer100k.max),
      },
    }));
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;
    
    if (action === 'requirements') {
      const { projectType, projectValue, buildCost, heritageStatus, isNewBuild } = body;
      
      if (!projectValue || !buildCost) {
        return NextResponse.json({ error: 'projectValue and buildCost required' }, { status: 400 });
      }
      
      const requirements = getRequirements(
        projectType || 'extension',
        projectValue,
        buildCost,
        heritageStatus || 'None',
        isNewBuild ?? false
      );
      
      const total = requirements.reduce((sum, r) => sum + r.estimatedCost, 0);
      
      return NextResponse.json({
        success: true,
        requirements,
        totalEstimatedCost: total,
      });
    }
    
    if (action === 'warranties') {
      const { projectType, buildCost } = body;
      
      if (!buildCost) {
        return NextResponse.json({ error: 'buildCost required' }, { status: 400 });
      }
      
      const warranties = getSuitableWarranties(projectType || 'extension', buildCost);
      return NextResponse.json({ success: true, warranties });
    }
    
    if (action === 'full-report') {
      const { projectType, projectValue, buildCost, heritageStatus, isNewBuild } = body;
      
      if (!projectValue || !buildCost) {
        return NextResponse.json({ error: 'projectValue and buildCost required' }, { status: 400 });
      }
      
      const requirements = getRequirements(
        projectType || 'extension',
        projectValue,
        buildCost,
        heritageStatus || 'None',
        isNewBuild ?? false
      );
      
      const warranties = getSuitableWarranties(projectType || 'extension', buildCost);
      const total = requirements.reduce((sum, r) => sum + r.estimatedCost, 0);
      
      const recommendations: string[] = [
        'Use insurance broker for project-specific package',
      ];
      
      if (heritageStatus && heritageStatus !== 'None' && heritageStatus !== 'Conservation Area') {
        recommendations.push('Use specialist heritage insurer');
      }
      
      if (buildCost > 250000) {
        recommendations.push('Consider single project insurance policy');
      }
      
      return NextResponse.json({
        success: true,
        report: {
          projectType,
          projectValue,
          buildCost,
          requirements,
          warranties,
          totalEstimatedCost: total,
          timeline: [
            'Before start: Contract works, public liability, site insurance',
            'During works: Verify contractor insurances',
            'Before completion: Apply for structural warranty',
            'On completion: Obtain all certificates',
          ],
          recommendations,
        },
      });
    }
    
    return NextResponse.json(
      { error: 'Invalid action. Use: requirements, warranties, full-report' },
      { status: 400 }
    );
    
  } catch (error) {
    console.error('Insurance API error:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  if (searchParams.get('products') === 'true') {
    return NextResponse.json({
      products: INSURANCE_PRODUCTS.map(p => ({
        type: p.type,
        name: p.name,
        required: p.required,
        typicalCover: p.typicalCover,
      })),
    });
  }
  
  if (searchParams.get('warranties') === 'true') {
    return NextResponse.json({
      warranties: WARRANTY_PROVIDERS.map(w => ({
        name: w.name,
        types: w.types,
        term: w.term,
        acceptance: w.acceptance,
      })),
    });
  }
  
  if (searchParams.get('heritage-factors') === 'true') {
    return NextResponse.json({ heritageFactors: HERITAGE_INSURANCE });
  }
  
  return NextResponse.json({
    service: 'Insurance Requirements API',
    version: '1.0.0',
    description: 'Development insurance, warranties, and professional indemnity',
    endpoints: {
      'GET /api/insurance': 'Service info',
      'GET /api/insurance?products=true': 'List insurance products',
      'GET /api/insurance?warranties=true': 'List warranty providers',
      'GET /api/insurance?heritage-factors=true': 'Heritage premium factors',
      'POST (action: requirements)': 'Get insurance requirements',
      'POST (action: warranties)': 'Get suitable warranties',
      'POST (action: full-report)': 'Full insurance report',
    },
    insuranceTypes: INSURANCE_PRODUCTS.map(p => p.type),
    warrantyProviders: WARRANTY_PROVIDERS.map(w => w.name),
  });
}
