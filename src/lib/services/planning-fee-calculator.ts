/**
 * Planning Fee Calculator Service
 * 
 * Calculates planning application fees based on current
 * fee regulations and development type.
 * 
 * Coverage: England (NW1-NW11, N2, N6, N10 postcodes)
 */

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

interface FeeProject {
  applicationType?: 'householder' | 'full' | 'outline' | 'reserved_matters' | 'listed_building' | 'conservation_area' | 'change_of_use' | 'advertisement' | 'prior_approval' | 'lawful_development' | 'tree_works';
  developmentType?: 'extension' | 'new_dwelling' | 'change_of_use' | 'alteration' | 'subdivision' | 'conversion';
  numberOfDwellings?: number;
  siteArea?: number;
  floorSpace?: number;
  existingUse?: string;
  proposedUse?: string;
  existingDwellings?: number;
  listedBuilding?: boolean;
  conservationArea?: boolean;
  isMinorAmendment?: boolean;
}

interface FeeBreakdown {
  item: string;
  calculation: string;
  amount: number;
}

interface AdditionalFee {
  feeType: string;
  amount: number;
  description: string;
  applicable: boolean;
}

interface FeeAnalysis {
  summary: FeeSummary;
  mainFee: MainFeeCalculation;
  additionalFees: AdditionalFeesAssessment;
  exemptions: ExemptionAssessment;
  feeRegulations: FeeRegulations;
  paymentGuidance: PaymentGuidance;
  preApplicationFees: PreApplicationFees;
  appealFees: AppealFees;
  conclusion: FeeConclusion;
  recommendations: string[];
}

interface FeeSummary {
  totalFee: number;
  applicationType: string;
  feeCategory: string;
  validFrom: string;
  notes: string[];
}

interface MainFeeCalculation {
  description: string;
  category: string;
  baseRate: number;
  calculation: string;
  breakdown: FeeBreakdown[];
  totalMainFee: number;
}

interface AdditionalFeesAssessment {
  description: string;
  fees: AdditionalFee[];
  totalAdditional: number;
}

interface ExemptionAssessment {
  description: string;
  exemptions: FeeExemption[];
  discounts: FeeDiscount[];
}

interface FeeExemption {
  exemption: string;
  conditions: string[];
  applicable: boolean;
}

interface FeeDiscount {
  discount: string;
  percentage: number;
  conditions: string[];
  applicable: boolean;
}

interface FeeRegulations {
  description: string;
  currentRegulation: string;
  effectiveDate: string;
  keyChanges: string[];
}

interface PaymentGuidance {
  description: string;
  paymentMethods: string[];
  refundPolicy: string;
  validityPeriod: string;
}

interface PreApplicationFees {
  description: string;
  householderFee: string;
  minorFee: string;
  majorFee: string;
  benefits: string[];
}

interface AppealFees {
  description: string;
  planningAppeal: string;
  enforcementAppeal: string;
  notes: string[];
}

interface FeeConclusion {
  totalPayable: number;
  payableOnSubmission: boolean;
  conditions: string[];
}

// =============================================================================
// FEE RATES DATABASE (2024 RATES)
// =============================================================================

const FEE_RATES = {
  householder: {
    single: 258,
    description: 'Alterations/extensions to a single dwellinghouse'
  },
  outline: {
    perHectare: 578,
    maxPerHectare: 462, // for sites over 2.5ha
    maxTotal: 202500,
    description: 'Outline application'
  },
  fullResidential: {
    perDwelling: 578,
    per10Dwellings: 462, // over 50
    maxTotal: 405000,
    description: 'Full application for dwellings'
  },
  changeOfUse: {
    standard: 578,
    description: 'Change of use (except to dwellings)'
  },
  changeOfUseToDwelling: {
    perDwelling: 578,
    description: 'Change of use to dwellings'
  },
  listedBuilding: {
    fee: 0,
    description: 'Listed Building Consent - no fee'
  },
  conservationArea: {
    demolition: 0,
    description: 'Conservation Area Consent - no fee'
  },
  priorApproval: {
    householder: 120,
    largerExtension: 120,
    officeToResidential: 125,
    description: 'Prior Approval applications'
  },
  lawfulDevelopment: {
    existing: 277,
    proposed: 277,
    description: 'Lawful Development Certificate'
  },
  advertisement: {
    standard: 146,
    description: 'Advertisement consent'
  },
  treeWorks: {
    fee: 0,
    description: 'Tree works in Conservation Area - no fee'
  },
  reservedMatters: {
    perHectare: 578,
    description: 'Reserved Matters application'
  }
};

// =============================================================================
// MAIN SERVICE FUNCTION
// =============================================================================

async function calculateFees(
  address: string,
  postcode: string,
  projectType: string,
  projectDetails: FeeProject = {}
): Promise<FeeAnalysis> {
  const mainFee = calculateMainFee(projectDetails);
  const additionalFees = assessAdditionalFees(projectDetails);
  const exemptions = assessExemptions(projectDetails);
  const summary = generateSummary(mainFee, additionalFees, exemptions, projectDetails);
  const feeRegulations = getFeeRegulations();
  const paymentGuidance = getPaymentGuidance();
  const preApplicationFees = getPreApplicationFees();
  const appealFees = getAppealFees();
  const conclusion = generateConclusion(summary);
  const recommendations = generateRecommendations(projectDetails);

  return {
    summary,
    mainFee,
    additionalFees,
    exemptions,
    feeRegulations,
    paymentGuidance,
    preApplicationFees,
    appealFees,
    conclusion,
    recommendations
  };
}

// =============================================================================
// MAIN FEE CALCULATION
// =============================================================================

function calculateMainFee(projectDetails: FeeProject): MainFeeCalculation {
  const appType = projectDetails.applicationType || 'householder';
  const breakdown: FeeBreakdown[] = [];
  let totalFee = 0;
  let category = '';
  let calculation = '';
  let baseRate = 0;

  switch (appType) {
    case 'householder':
      category = 'Householder';
      baseRate = FEE_RATES.householder.single;
      totalFee = baseRate;
      calculation = 'Flat fee for householder application';
      breakdown.push({
        item: 'Householder application fee',
        calculation: 'Flat rate',
        amount: baseRate
      });
      break;

    case 'full':
      if (projectDetails.developmentType === 'new_dwelling') {
        const dwellings = projectDetails.numberOfDwellings || 1;
        category = 'Full - New Dwellings';
        baseRate = FEE_RATES.fullResidential.perDwelling;
        
        if (dwellings <= 50) {
          totalFee = dwellings * baseRate;
          calculation = `${dwellings} dwellings × £${baseRate}`;
        } else {
          const first50 = 50 * baseRate;
          const additional = (dwellings - 50) * FEE_RATES.fullResidential.per10Dwellings;
          totalFee = Math.min(first50 + additional, FEE_RATES.fullResidential.maxTotal);
          calculation = `50 × £${baseRate} + ${dwellings - 50} × £${FEE_RATES.fullResidential.per10Dwellings}`;
        }
        
        breakdown.push({
          item: 'New dwelling(s) fee',
          calculation,
          amount: totalFee
        });
      } else {
        category = 'Full - Other';
        baseRate = FEE_RATES.changeOfUse.standard;
        totalFee = baseRate;
        calculation = 'Standard full application fee';
        breakdown.push({
          item: 'Full application fee',
          calculation: 'Standard rate',
          amount: baseRate
        });
      }
      break;

    case 'outline':
      category = 'Outline';
      const siteArea = projectDetails.siteArea || 0.1;
      baseRate = FEE_RATES.outline.perHectare;
      
      if (siteArea <= 2.5) {
        totalFee = Math.ceil(siteArea * 10) * (baseRate / 10);
        calculation = `${siteArea}ha × £${baseRate}/ha (per 0.1ha)`;
      } else {
        const first2_5 = 2.5 * baseRate;
        const additional = (siteArea - 2.5) * FEE_RATES.outline.maxPerHectare;
        totalFee = Math.min(first2_5 + additional, FEE_RATES.outline.maxTotal);
        calculation = `2.5ha × £${baseRate} + ${siteArea - 2.5}ha × £${FEE_RATES.outline.maxPerHectare}`;
      }
      
      breakdown.push({
        item: 'Outline application fee',
        calculation,
        amount: totalFee
      });
      break;

    case 'listed_building':
      category = 'Listed Building Consent';
      baseRate = 0;
      totalFee = 0;
      calculation = 'No fee for Listed Building Consent';
      breakdown.push({
        item: 'Listed Building Consent',
        calculation: 'Exempt from fees',
        amount: 0
      });
      break;

    case 'conservation_area':
      category = 'Conservation Area Consent';
      baseRate = 0;
      totalFee = 0;
      calculation = 'No fee for Conservation Area Consent';
      breakdown.push({
        item: 'Conservation Area Consent',
        calculation: 'Exempt from fees',
        amount: 0
      });
      break;

    case 'change_of_use':
      category = 'Change of Use';
      const dwellingsCreated = projectDetails.numberOfDwellings || 1;
      
      if (projectDetails.proposedUse === 'residential') {
        baseRate = FEE_RATES.changeOfUseToDwelling.perDwelling;
        totalFee = dwellingsCreated * baseRate;
        calculation = `${dwellingsCreated} dwelling(s) × £${baseRate}`;
      } else {
        baseRate = FEE_RATES.changeOfUse.standard;
        totalFee = baseRate;
        calculation = 'Standard change of use fee';
      }
      
      breakdown.push({
        item: 'Change of use fee',
        calculation,
        amount: totalFee
      });
      break;

    case 'prior_approval':
      category = 'Prior Approval';
      baseRate = FEE_RATES.priorApproval.householder;
      totalFee = baseRate;
      calculation = 'Flat fee for prior approval';
      breakdown.push({
        item: 'Prior approval fee',
        calculation: 'Flat rate',
        amount: baseRate
      });
      break;

    case 'lawful_development':
      category = 'Lawful Development Certificate';
      baseRate = FEE_RATES.lawfulDevelopment.existing;
      totalFee = baseRate;
      calculation = 'Flat fee for LDC';
      breakdown.push({
        item: 'LDC fee',
        calculation: 'Flat rate',
        amount: baseRate
      });
      break;

    case 'advertisement':
      category = 'Advertisement Consent';
      baseRate = FEE_RATES.advertisement.standard;
      totalFee = baseRate;
      calculation = 'Standard advertisement consent fee';
      breakdown.push({
        item: 'Advertisement consent fee',
        calculation: 'Flat rate',
        amount: baseRate
      });
      break;

    case 'tree_works':
      category = 'Tree Works';
      baseRate = 0;
      totalFee = 0;
      calculation = 'No fee for tree works in Conservation Area';
      breakdown.push({
        item: 'Tree works notification',
        calculation: 'Exempt from fees',
        amount: 0
      });
      break;

    default:
      category = 'Standard';
      baseRate = FEE_RATES.householder.single;
      totalFee = baseRate;
      calculation = 'Default householder rate';
      breakdown.push({
        item: 'Application fee',
        calculation: 'Default rate',
        amount: baseRate
      });
  }

  return {
    description: 'Main planning application fee calculation',
    category,
    baseRate,
    calculation,
    breakdown,
    totalMainFee: totalFee
  };
}

// =============================================================================
// ADDITIONAL FEES
// =============================================================================

function assessAdditionalFees(projectDetails: FeeProject): AdditionalFeesAssessment {
  const fees: AdditionalFee[] = [];
  let total = 0;

  // Concurrent application
  if (projectDetails.listedBuilding && projectDetails.applicationType !== 'listed_building') {
    fees.push({
      feeType: 'Concurrent Listed Building Application',
      amount: 0,
      description: 'LBC submitted with planning - no additional fee',
      applicable: true
    });
  }

  // CIL Liability (simplified estimate)
  if (projectDetails.developmentType === 'new_dwelling' || projectDetails.developmentType === 'extension') {
    const floorSpace = projectDetails.floorSpace || 30;
    const cilRate = 400; // Camden CIL estimate per m²
    const estimatedCIL = floorSpace > 100 ? floorSpace * cilRate : 0;
    
    if (estimatedCIL > 0) {
      fees.push({
        feeType: 'Community Infrastructure Levy (estimate)',
        amount: estimatedCIL,
        description: 'CIL payable on commencement - exact amount on CIL Liability Notice',
        applicable: true
      });
      total += estimatedCIL;
    }
  }

  return {
    description: 'Additional fees that may apply',
    fees,
    totalAdditional: total
  };
}

// =============================================================================
// EXEMPTIONS
// =============================================================================

function assessExemptions(projectDetails: FeeProject): ExemptionAssessment {
  const exemptions: FeeExemption[] = [
    {
      exemption: 'Works for disabled access',
      conditions: ['Application solely for disabled access improvements', 'Certified by relevant body'],
      applicable: false
    },
    {
      exemption: 'First resubmission',
      conditions: ['Within 12 months of refusal/withdrawal', 'Same site and similar proposal'],
      applicable: false
    },
    {
      exemption: 'Alternative application',
      conditions: ['Submitted within 12 months of grant', 'Same site and applicant'],
      applicable: false
    }
  ];

  const discounts: FeeDiscount[] = [
    {
      discount: 'Duplicate application on same site',
      percentage: 50,
      conditions: ['Multiple applications for similar development', 'Same day submission'],
      applicable: false
    },
    {
      discount: 'Community/parish council',
      percentage: 50,
      conditions: ['Application by parish/community council', 'For community benefit'],
      applicable: false
    }
  ];

  return {
    description: 'Potential fee exemptions and discounts',
    exemptions,
    discounts
  };
}

// =============================================================================
// SUMMARY
// =============================================================================

function generateSummary(
  mainFee: MainFeeCalculation,
  additionalFees: AdditionalFeesAssessment,
  exemptions: ExemptionAssessment,
  projectDetails: FeeProject
): FeeSummary {
  const total = mainFee.totalMainFee + additionalFees.totalAdditional;
  const notes: string[] = [];

  if (mainFee.totalMainFee === 0) {
    notes.push('This application type is exempt from planning fees');
  }
  if (additionalFees.totalAdditional > 0) {
    notes.push('CIL liability is an estimate - actual amount calculated by LPA');
  }
  if (projectDetails.isMinorAmendment) {
    notes.push('Minor amendments (S96A) have separate fee structure');
  }

  return {
    totalFee: total,
    applicationType: mainFee.category,
    feeCategory: mainFee.description,
    validFrom: '6 December 2023',
    notes: notes.length > 0 ? notes : ['Standard fee rates apply']
  };
}

// =============================================================================
// FEE REGULATIONS
// =============================================================================

function getFeeRegulations(): FeeRegulations {
  return {
    description: 'Current planning fee regulations',
    currentRegulation: 'The Town and Country Planning (Fees for Applications, Deemed Applications, Requests and Site Visits) (England) (Amendment) Regulations 2023',
    effectiveDate: '6 December 2023',
    keyChanges: [
      'Householder applications increased to £258',
      'Full applications increased by 35% (major) and 25% (other)',
      'Fees now subject to annual indexation',
      'New powers for councils to set higher fees'
    ]
  };
}

// =============================================================================
// PAYMENT GUIDANCE
// =============================================================================

function getPaymentGuidance(): PaymentGuidance {
  return {
    description: 'Payment guidance for planning applications',
    paymentMethods: [
      'Online card payment (preferred)',
      'Telephone card payment',
      'Cheque (allow extra processing time)',
      'BACS transfer (reference required)'
    ],
    refundPolicy: 'Fees non-refundable once application validated. Refund only if application cannot be made valid.',
    validityPeriod: 'Application must be validated within 28 days of fee receipt'
  };
}

// =============================================================================
// PRE-APPLICATION FEES
// =============================================================================

function getPreApplicationFees(): PreApplicationFees {
  return {
    description: 'Pre-application advice fees (vary by LPA)',
    householderFee: '£75-200 (Camden: £145)',
    minorFee: '£300-800 (Camden: £440-880)',
    majorFee: '£1,000-5,000+ (Camden: £2,200-8,800)',
    benefits: [
      'Early identification of issues',
      'Understanding officer position',
      'Potentially faster determination',
      'Written record of advice',
      'Reduced risk of refusal'
    ]
  };
}

// =============================================================================
// APPEAL FEES
// =============================================================================

function getAppealFees(): AppealFees {
  return {
    description: 'Planning appeal fee information',
    planningAppeal: 'Free - no fee for planning appeals to PINS',
    enforcementAppeal: 'Free - no fee for enforcement appeals',
    notes: [
      'Applicant may need to pay own costs',
      'Award of costs possible if unreasonable behavior',
      'Consider appeal consultant/solicitor costs'
    ]
  };
}

// =============================================================================
// CONCLUSION
// =============================================================================

function generateConclusion(summary: FeeSummary): FeeConclusion {
  return {
    totalPayable: summary.totalFee,
    payableOnSubmission: true,
    conditions: [
      'Fee payable with application submission',
      'Application not valid until fee cleared',
      'Keep payment receipt for records',
      'CIL (if applicable) payable on commencement'
    ]
  };
}

// =============================================================================
// RECOMMENDATIONS
// =============================================================================

function generateRecommendations(projectDetails: FeeProject): string[] {
  const recommendations = [
    'Confirm fee with LPA before submission - fees may change',
    'Use online Planning Portal for faster validation',
    'Request receipt of fee payment for records'
  ];

  if (!projectDetails.applicationType || projectDetails.applicationType === 'householder') {
    recommendations.push('Consider pre-application advice (£145 Camden) for complex proposals');
  }

  if (projectDetails.listedBuilding) {
    recommendations.push('Submit LBC concurrently with planning for no additional fee');
  }

  if (projectDetails.developmentType === 'new_dwelling') {
    recommendations.push('Budget for CIL liability in addition to planning fee');
    recommendations.push('Consider CIL exemption if self-build');
  }

  recommendations.push('Check if resubmission exemption applies (within 12 months of refusal)');

  return recommendations;
}

// =============================================================================
// EXPORTS
// =============================================================================

const planningFeeCalculator = {
  calculateFees,
  FEE_RATES
};

export default planningFeeCalculator;
