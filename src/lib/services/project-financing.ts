/**
 * Project Financing Service
 * Development finance, mortgage options, and funding calculations
 * For property development projects in Hampstead area
 */

// Types
type FinanceType = 
  | 'development_finance'
  | 'bridging_loan'
  | 'refurbishment_loan'
  | 'commercial_mortgage'
  | 'remortgage'
  | 'self_build';

interface LenderCriteria {
  name: string;
  type: FinanceType;
  minLoan: number;
  maxLoan: number;
  ltv: number; // Loan to value percentage
  ltc: number; // Loan to cost percentage
  interestRate: { min: number; max: number };
  termMonths: { min: number; max: number };
  fees: string[];
  criteria: string[];
  heritageExperience: boolean;
}

interface FinanceCalculation {
  projectCost: number;
  deposit: number;
  loanAmount: number;
  interestCost: number;
  fees: number;
  totalCost: number;
  monthlyPayment: number;
  exitStrategy: string[];
}

interface FinanceReport {
  projectType: string;
  projectCost: number;
  exitValue: number;
  profitMargin: number;
  recommendedFinance: FinanceType;
  lenders: LenderCriteria[];
  calculations: FinanceCalculation;
  risks: string[];
  recommendations: string[];
}

// Finance products
const FINANCE_PRODUCTS: LenderCriteria[] = [
  {
    name: 'Development Finance (Light)',
    type: 'development_finance',
    minLoan: 100000,
    maxLoan: 25000000,
    ltv: 70,
    ltc: 85,
    interestRate: { min: 0.75, max: 1.25 },
    termMonths: { min: 6, max: 24 },
    fees: ['Arrangement 1-2%', 'Exit 1%', 'Valuation £1,500+'],
    criteria: ['Experienced developer', 'Viable project', 'Clear exit'],
    heritageExperience: true,
  },
  {
    name: 'Development Finance (Heavy)',
    type: 'development_finance',
    minLoan: 250000,
    maxLoan: 50000000,
    ltv: 65,
    ltc: 80,
    interestRate: { min: 0.85, max: 1.5 },
    termMonths: { min: 12, max: 36 },
    fees: ['Arrangement 1.5-2.5%', 'Exit 1%', 'Monitoring £500/month'],
    criteria: ['Significant development experience', 'Planning secured', 'QS reports'],
    heritageExperience: true,
  },
  {
    name: 'Bridging Loan',
    type: 'bridging_loan',
    minLoan: 50000,
    maxLoan: 25000000,
    ltv: 75,
    ltc: 0,
    interestRate: { min: 0.55, max: 1.0 },
    termMonths: { min: 1, max: 24 },
    fees: ['Arrangement 1-2%', 'Exit 0-1%', 'Valuation £500-1,500'],
    criteria: ['Clear exit strategy', 'Acceptable security', 'No adverse credit'],
    heritageExperience: false,
  },
  {
    name: 'Refurbishment Finance',
    type: 'refurbishment_loan',
    minLoan: 50000,
    maxLoan: 10000000,
    ltv: 70,
    ltc: 80,
    interestRate: { min: 0.65, max: 1.1 },
    termMonths: { min: 6, max: 18 },
    fees: ['Arrangement 1-1.5%', 'Exit 0.5-1%'],
    criteria: ['Viable refurb scheme', 'Planning if needed', 'Experience preferred'],
    heritageExperience: false,
  },
  {
    name: 'Self-Build Mortgage',
    type: 'self_build',
    minLoan: 100000,
    maxLoan: 5000000,
    ltv: 75,
    ltc: 85,
    interestRate: { min: 4.5, max: 6.5 },
    termMonths: { min: 12, max: 36 },
    fees: ['Arrangement £999-2,000', 'Valuation included'],
    criteria: ['Owner occupier', 'Planning permission', 'Detailed build cost'],
    heritageExperience: false,
  },
  {
    name: 'Commercial Mortgage',
    type: 'commercial_mortgage',
    minLoan: 100000,
    maxLoan: 50000000,
    ltv: 65,
    ltc: 0,
    interestRate: { min: 5.0, max: 8.0 },
    termMonths: { min: 60, max: 300 },
    fees: ['Arrangement 0.5-1%', 'Valuation £2,000+'],
    criteria: ['Income producing property', 'Commercial use', 'Strong covenant'],
    heritageExperience: false,
  },
];

// Heritage property premiums/restrictions
const HERITAGE_FINANCE_FACTORS = {
  'Grade I': { ltvReduction: 10, rateIncrease: 0.25, additionalCriteria: ['Heritage specialist valuation', 'HE pre-app'] },
  'Grade II*': { ltvReduction: 7, rateIncrease: 0.15, additionalCriteria: ['Conservation architect'] },
  'Grade II': { ltvReduction: 5, rateIncrease: 0.10, additionalCriteria: ['LBC approval'] },
  'Conservation Area': { ltvReduction: 2, rateIncrease: 0.05, additionalCriteria: [] },
  'None': { ltvReduction: 0, rateIncrease: 0, additionalCriteria: [] },
};

// Service class
export class ProjectFinancingService {
  /**
   * Get suitable finance products
   */
  getSuitableProducts(
    projectType: string,
    projectCost: number,
    heritageStatus: keyof typeof HERITAGE_FINANCE_FACTORS = 'None',
    hasPlanning: boolean
  ): LenderCriteria[] {
    let products = FINANCE_PRODUCTS.filter(p => {
      // Filter by loan amount
      if (projectCost < p.minLoan || projectCost > p.maxLoan) return false;
      
      // Filter by project type
      if (projectType === 'new_build' && !['development_finance', 'self_build'].includes(p.type)) {
        return false;
      }
      if (projectType === 'basement' && p.type === 'bridging_loan') {
        return false; // Basements need development finance
      }
      
      return true;
    });
    
    // For heritage properties, prefer lenders with experience
    if (heritageStatus !== 'None') {
      // Sort heritage-experienced lenders first
      products.sort((a, b) => {
        if (a.heritageExperience && !b.heritageExperience) return -1;
        if (!a.heritageExperience && b.heritageExperience) return 1;
        return 0;
      });
    }
    
    // Adjust for heritage factors
    const heritageFactor = HERITAGE_FINANCE_FACTORS[heritageStatus];
    if (heritageFactor && heritageFactor.ltvReduction > 0) {
      products = products.map(p => ({
        ...p,
        ltv: p.ltv - heritageFactor.ltvReduction,
        interestRate: {
          min: p.interestRate.min + heritageFactor.rateIncrease,
          max: p.interestRate.max + heritageFactor.rateIncrease,
        },
        criteria: [...p.criteria, ...heritageFactor.additionalCriteria],
      }));
    }
    
    // Planning affects availability
    if (!hasPlanning) {
      products = products.map(p => ({
        ...p,
        ltv: Math.max(50, p.ltv - 10), // Reduce LTV without planning
        criteria: [...p.criteria, 'Planning permission recommended'],
      }));
    }
    
    return products;
  }

  /**
   * Calculate finance costs
   */
  calculateFinance(
    projectCost: number,
    product: LenderCriteria,
    termMonths: number
  ): FinanceCalculation {
    // Calculate loan based on LTC
    const maxLoanByLtc = projectCost * (product.ltc / 100) || projectCost * 0.75;
    const loanAmount = Math.min(maxLoanByLtc, product.maxLoan);
    const deposit = projectCost - loanAmount;
    
    // Calculate interest (using average rate, monthly compounding)
    const avgRate = (product.interestRate.min + product.interestRate.max) / 2 / 100;
    const monthlyRate = avgRate;
    const interestCost = loanAmount * monthlyRate * termMonths;
    
    // Estimate fees (using 1.5% arrangement + 1% exit as typical)
    const fees = loanAmount * 0.025;
    
    const totalCost = deposit + interestCost + fees;
    const monthlyPayment = (loanAmount * monthlyRate) + (loanAmount / termMonths);
    
    return {
      projectCost,
      deposit,
      loanAmount,
      interestCost: Math.round(interestCost),
      fees: Math.round(fees),
      totalCost: Math.round(totalCost),
      monthlyPayment: Math.round(monthlyPayment),
      exitStrategy: ['Sale on completion', 'Refinance to term loan', 'Let and hold'],
    };
  }

  /**
   * Get full finance report
   */
  getFinanceReport(
    projectType: string,
    purchasePrice: number,
    buildCost: number,
    exitValue: number,
    heritageStatus: keyof typeof HERITAGE_FINANCE_FACTORS = 'None',
    hasPlanning: boolean
  ): FinanceReport {
    const projectCost = purchasePrice + buildCost;
    const profitMargin = Math.round(((exitValue - projectCost) / projectCost) * 100);
    
    // Get suitable products
    const products = this.getSuitableProducts(
      projectType,
      projectCost,
      heritageStatus,
      hasPlanning
    );
    
    // Recommend finance type
    let recommendedFinance: FinanceType = 'bridging_loan';
    if (buildCost > projectCost * 0.3) {
      recommendedFinance = 'development_finance';
    }
    if (buildCost < 100000 && projectType === 'refurbishment') {
      recommendedFinance = 'refurbishment_loan';
    }
    
    // Get best matching product
    const bestProduct = products.find(p => p.type === recommendedFinance) || products[0];
    
    // Calculate finance
    const calculations = bestProduct 
      ? this.calculateFinance(projectCost, bestProduct, 18)
      : {
          projectCost,
          deposit: projectCost * 0.3,
          loanAmount: projectCost * 0.7,
          interestCost: 0,
          fees: 0,
          totalCost: projectCost,
          monthlyPayment: 0,
          exitStrategy: [],
        };
    
    // Identify risks
    const risks: string[] = [];
    if (profitMargin < 15) {
      risks.push('Profit margin below typical lender requirement (15-20%)');
    }
    if (!hasPlanning) {
      risks.push('No planning permission - higher deposit required');
    }
    if (heritageStatus !== 'None' && heritageStatus !== 'Conservation Area') {
      risks.push('Listed building - specialist lender required');
    }
    if (projectType === 'basement') {
      risks.push('Basement development - limited lender appetite');
    }
    
    // Build recommendations
    const recommendations: string[] = [];
    recommendations.push('Obtain 3+ quotes from different lenders');
    if (!hasPlanning) {
      recommendations.push('Secure planning before approaching development lenders');
    }
    if (heritageStatus !== 'None') {
      recommendations.push('Use broker with heritage property experience');
    }
    if (profitMargin > 25) {
      recommendations.push('Strong margin - consider higher gearing');
    }
    
    return {
      projectType,
      projectCost,
      exitValue,
      profitMargin,
      recommendedFinance,
      lenders: products.slice(0, 5),
      calculations,
      risks,
      recommendations,
    };
  }

  /**
   * Get SDLT (Stamp Duty) calculation
   */
  calculateSDLT(
    purchasePrice: number,
    isSecondHome: boolean,
    isCompany: boolean
  ): {
    sdlt: number;
    bands: Array<{ threshold: number; rate: number; tax: number }>;
    surcharge: number;
  } {
    // Residential SDLT bands (2024)
    const bands = [
      { threshold: 250000, rate: 0 },
      { threshold: 925000, rate: 5 },
      { threshold: 1500000, rate: 10 },
      { threshold: Infinity, rate: 12 },
    ];
    
    let totalTax = 0;
    let remaining = purchasePrice;
    let prevThreshold = 0;
    const breakdown: Array<{ threshold: number; rate: number; tax: number }> = [];
    
    for (const band of bands) {
      if (remaining <= 0) break;
      
      const taxableInBand = Math.min(remaining, band.threshold - prevThreshold);
      const tax = taxableInBand * (band.rate / 100);
      
      if (taxableInBand > 0) {
        breakdown.push({
          threshold: band.threshold,
          rate: band.rate,
          tax: Math.round(tax),
        });
      }
      
      totalTax += tax;
      remaining -= taxableInBand;
      prevThreshold = band.threshold;
    }
    
    // Second home/company surcharge (currently 5%)
    let surcharge = 0;
    if (isSecondHome || isCompany) {
      surcharge = purchasePrice * 0.05;
      totalTax += surcharge;
    }
    
    return {
      sdlt: Math.round(totalTax),
      bands: breakdown,
      surcharge: Math.round(surcharge),
    };
  }

  /**
   * Get finance products list
   */
  getFinanceProducts(): LenderCriteria[] {
    return FINANCE_PRODUCTS;
  }

  /**
   * Get heritage finance factors
   */
  getHeritageFactors(): typeof HERITAGE_FINANCE_FACTORS {
    return HERITAGE_FINANCE_FACTORS;
  }
}

// Export singleton instance
export const projectFinancingService = new ProjectFinancingService();
