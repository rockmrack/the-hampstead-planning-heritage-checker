/**
 * Project Financing API
 * Development finance, mortgage options, and funding calculations
 * GET/POST /api/project-financing
 */

import { NextRequest, NextResponse } from 'next/server';

// Types
type FinanceType = 'development_finance' | 'bridging_loan' | 'refurbishment_loan' | 'commercial_mortgage' | 'self_build';

interface LenderCriteria {
  name: string;
  type: FinanceType;
  minLoan: number;
  maxLoan: number;
  ltv: number;
  ltc: number;
  interestRate: { min: number; max: number };
  termMonths: { min: number; max: number };
  fees: string[];
  criteria: string[];
  heritageExperience: boolean;
}

// Finance products
const FINANCE_PRODUCTS: LenderCriteria[] = [
  {
    name: 'Development Finance (Light)',
    type: 'development_finance',
    minLoan: 100000, maxLoan: 25000000,
    ltv: 70, ltc: 85,
    interestRate: { min: 0.75, max: 1.25 },
    termMonths: { min: 6, max: 24 },
    fees: ['Arrangement 1-2%', 'Exit 1%', 'Valuation £1,500+'],
    criteria: ['Experienced developer', 'Viable project', 'Clear exit'],
    heritageExperience: true,
  },
  {
    name: 'Bridging Loan',
    type: 'bridging_loan',
    minLoan: 50000, maxLoan: 25000000,
    ltv: 75, ltc: 0,
    interestRate: { min: 0.55, max: 1.0 },
    termMonths: { min: 1, max: 24 },
    fees: ['Arrangement 1-2%', 'Exit 0-1%'],
    criteria: ['Clear exit strategy', 'Acceptable security'],
    heritageExperience: false,
  },
  {
    name: 'Refurbishment Finance',
    type: 'refurbishment_loan',
    minLoan: 50000, maxLoan: 10000000,
    ltv: 70, ltc: 80,
    interestRate: { min: 0.65, max: 1.1 },
    termMonths: { min: 6, max: 18 },
    fees: ['Arrangement 1-1.5%', 'Exit 0.5-1%'],
    criteria: ['Viable refurb scheme', 'Planning if needed'],
    heritageExperience: false,
  },
  {
    name: 'Self-Build Mortgage',
    type: 'self_build',
    minLoan: 100000, maxLoan: 5000000,
    ltv: 75, ltc: 85,
    interestRate: { min: 4.5, max: 6.5 },
    termMonths: { min: 12, max: 36 },
    fees: ['Arrangement £999-2,000'],
    criteria: ['Owner occupier', 'Planning permission'],
    heritageExperience: false,
  },
];

// Heritage factors
const HERITAGE_FACTORS: Record<string, { ltvReduction: number; rateIncrease: number }> = {
  'Grade I': { ltvReduction: 10, rateIncrease: 0.25 },
  'Grade II*': { ltvReduction: 7, rateIncrease: 0.15 },
  'Grade II': { ltvReduction: 5, rateIncrease: 0.10 },
  'Conservation Area': { ltvReduction: 2, rateIncrease: 0.05 },
  'None': { ltvReduction: 0, rateIncrease: 0 },
};

function getSuitableProducts(projectCost: number, heritageStatus: string, hasPlanning: boolean) {
  let products = FINANCE_PRODUCTS.filter(p => 
    projectCost >= p.minLoan && projectCost <= p.maxLoan
  );
  
  const factor = HERITAGE_FACTORS[heritageStatus] ?? HERITAGE_FACTORS['None'] ?? { ltvReduction: 0, rateIncrease: 0 };
  
  products = products.map(p => ({
    ...p,
    ltv: p.ltv - factor.ltvReduction - (hasPlanning ? 0 : 10),
    interestRate: {
      min: p.interestRate.min + factor.rateIncrease,
      max: p.interestRate.max + factor.rateIncrease,
    },
  }));
  
  if (heritageStatus !== 'None') {
    products.sort((a, b) => (b.heritageExperience ? 1 : 0) - (a.heritageExperience ? 1 : 0));
  }
  
  return products;
}

function calculateFinance(projectCost: number, ltc: number, rate: number, termMonths: number) {
  const loanAmount = projectCost * (ltc / 100);
  const deposit = projectCost - loanAmount;
  const monthlyRate = rate / 100;
  const interestCost = loanAmount * monthlyRate * termMonths;
  const fees = loanAmount * 0.025;
  
  return {
    projectCost,
    deposit: Math.round(deposit),
    loanAmount: Math.round(loanAmount),
    interestCost: Math.round(interestCost),
    fees: Math.round(fees),
    totalFinanceCost: Math.round(deposit + interestCost + fees),
    monthlyPayment: Math.round((loanAmount * monthlyRate) + (loanAmount / termMonths)),
  };
}

function calculateSDLT(purchasePrice: number, isSecondHome: boolean) {
  const bands = [
    { threshold: 250000, rate: 0 },
    { threshold: 925000, rate: 5 },
    { threshold: 1500000, rate: 10 },
    { threshold: Infinity, rate: 12 },
  ];
  
  let tax = 0;
  let remaining = purchasePrice;
  let prevThreshold = 0;
  const breakdown: Array<{ band: string; tax: number }> = [];
  
  for (const band of bands) {
    if (remaining <= 0) break;
    const taxable = Math.min(remaining, band.threshold - prevThreshold);
    const bandTax = taxable * (band.rate / 100);
    if (taxable > 0) {
      breakdown.push({ band: `Up to £${band.threshold.toLocaleString()}`, tax: Math.round(bandTax) });
    }
    tax += bandTax;
    remaining -= taxable;
    prevThreshold = band.threshold;
  }
  
  const surcharge = isSecondHome ? purchasePrice * 0.05 : 0;
  
  return {
    sdlt: Math.round(tax + surcharge),
    surcharge: Math.round(surcharge),
    breakdown,
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;
    
    if (action === 'find-products') {
      const { projectCost, heritageStatus, hasPlanning } = body;
      if (!projectCost) {
        return NextResponse.json({ error: 'projectCost required' }, { status: 400 });
      }
      
      const products = getSuitableProducts(
        projectCost,
        heritageStatus || 'None',
        hasPlanning ?? true
      );
      
      return NextResponse.json({ success: true, products });
    }
    
    if (action === 'calculate') {
      const { projectCost, ltc, interestRate, termMonths } = body;
      if (!projectCost) {
        return NextResponse.json({ error: 'projectCost required' }, { status: 400 });
      }
      
      const calculation = calculateFinance(
        projectCost,
        ltc || 75,
        interestRate || 1.0,
        termMonths || 18
      );
      
      return NextResponse.json({ success: true, calculation });
    }
    
    if (action === 'full-report') {
      const { purchasePrice, buildCost, exitValue, heritageStatus, hasPlanning, projectType } = body;
      
      if (!purchasePrice || !buildCost) {
        return NextResponse.json({ error: 'purchasePrice and buildCost required' }, { status: 400 });
      }
      
      const projectCost = purchasePrice + buildCost;
      const profitMargin = exitValue ? Math.round(((exitValue - projectCost) / projectCost) * 100) : 0;
      
      const products = getSuitableProducts(projectCost, heritageStatus || 'None', hasPlanning ?? false);
      const bestProduct = products[0];
      
      const calculation = bestProduct
        ? calculateFinance(projectCost, bestProduct.ltc || 75, (bestProduct.interestRate.min + bestProduct.interestRate.max) / 2, 18)
        : calculateFinance(projectCost, 70, 1.0, 18);
      
      const sdlt = calculateSDLT(purchasePrice, true);
      
      const risks: string[] = [];
      if (profitMargin < 15) risks.push('Profit margin below lender requirement');
      if (!hasPlanning) risks.push('No planning - higher deposit required');
      if (heritageStatus && heritageStatus !== 'None' && heritageStatus !== 'Conservation Area') {
        risks.push('Listed building - specialist lender required');
      }
      
      return NextResponse.json({
        success: true,
        report: {
          projectType,
          projectCost,
          exitValue,
          profitMargin,
          products: products.slice(0, 5),
          calculation,
          sdlt,
          risks,
          recommendations: [
            'Obtain 3+ quotes from different lenders',
            hasPlanning ? 'Planning secured - good position' : 'Secure planning before approaching lenders',
          ],
        },
      });
    }
    
    if (action === 'sdlt') {
      const { purchasePrice, isSecondHome } = body;
      if (!purchasePrice) {
        return NextResponse.json({ error: 'purchasePrice required' }, { status: 400 });
      }
      
      const sdlt = calculateSDLT(purchasePrice, isSecondHome ?? true);
      return NextResponse.json({ success: true, sdlt });
    }
    
    return NextResponse.json(
      { error: 'Invalid action. Use: find-products, calculate, full-report, sdlt' },
      { status: 400 }
    );
    
  } catch (error) {
    console.error('Project Financing API error:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  if (searchParams.get('products') === 'true') {
    return NextResponse.json({
      products: FINANCE_PRODUCTS.map(p => ({
        name: p.name,
        type: p.type,
        loanRange: { min: p.minLoan, max: p.maxLoan },
        ltv: p.ltv,
        rateRange: p.interestRate,
      })),
    });
  }
  
  if (searchParams.get('heritage-factors') === 'true') {
    return NextResponse.json({ heritageFactors: HERITAGE_FACTORS });
  }
  
  return NextResponse.json({
    service: 'Project Financing API',
    version: '1.0.0',
    description: 'Development finance, mortgage options, and funding calculations',
    endpoints: {
      'GET /api/project-financing': 'Service info',
      'GET /api/project-financing?products=true': 'List finance products',
      'GET /api/project-financing?heritage-factors=true': 'Heritage impact factors',
      'POST (action: find-products)': 'Find suitable products',
      'POST (action: calculate)': 'Calculate finance costs',
      'POST (action: full-report)': 'Full finance report',
      'POST (action: sdlt)': 'Calculate Stamp Duty',
    },
    financeTypes: ['development_finance', 'bridging_loan', 'refurbishment_loan', 'self_build'],
    heritageStatuses: Object.keys(HERITAGE_FACTORS),
  });
}
