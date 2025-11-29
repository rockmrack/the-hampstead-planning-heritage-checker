/**
 * Insurance Requirements Service
 * Development insurance, warranty requirements, and professional indemnity
 * For construction and renovation projects
 */

// Types
type InsuranceType = 
  | 'site_insurance'
  | 'contract_works'
  | 'public_liability'
  | 'employers_liability'
  | 'professional_indemnity'
  | 'structural_warranty'
  | 'latent_defects'
  | 'title_indemnity';

interface InsuranceProduct {
  type: InsuranceType;
  name: string;
  description: string;
  required: 'mandatory' | 'recommended' | 'optional';
  typicalCover: string;
  costBasis: string;
  indicativeCost: { min: number; max: number };
  duration: string;
  provider: string[];
}

interface WarrantyProvider {
  name: string;
  types: string[];
  term: number;
  coverLevel: 'standard' | 'enhanced';
  requirements: string[];
  cost: { min: number; max: number }; // Per £100k build cost
  acceptance: string;
}

interface InsuranceRequirement {
  insurance: InsuranceProduct;
  projectRelevance: 'essential' | 'important' | 'useful';
  notes: string[];
  estimatedCost: number;
}

interface InsuranceReport {
  projectType: string;
  projectValue: number;
  requirements: InsuranceRequirement[];
  warranties: WarrantyProvider[];
  totalEstimatedCost: number;
  timeline: string[];
  recommendations: string[];
}

// Insurance products database
const INSURANCE_PRODUCTS: InsuranceProduct[] = [
  {
    type: 'contract_works',
    name: 'Contract Works Insurance',
    description: 'Covers the works during construction against damage, theft, and material loss',
    required: 'mandatory',
    typicalCover: 'Full contract value plus materials',
    costBasis: 'Percentage of contract value',
    indicativeCost: { min: 0.15, max: 0.5 }, // % of contract value
    duration: 'Duration of works plus defects period',
    provider: ['Zurich', 'AXA', 'Aviva', 'QBE'],
  },
  {
    type: 'public_liability',
    name: 'Public Liability Insurance',
    description: 'Covers injury to third parties or damage to property',
    required: 'mandatory',
    typicalCover: '£5m-£10m',
    costBasis: 'Fixed premium + project value',
    indicativeCost: { min: 500, max: 2500 }, // £ per annum
    duration: 'Annual, throughout project',
    provider: ['Contractor policy', 'Project-specific'],
  },
  {
    type: 'employers_liability',
    name: "Employers' Liability Insurance",
    description: 'Compulsory cover for employees injured at work',
    required: 'mandatory',
    typicalCover: '£10m minimum (legal requirement)',
    costBasis: 'Based on payroll',
    indicativeCost: { min: 300, max: 1500 }, // £ per annum
    duration: 'Annual',
    provider: ['Contractor policy'],
  },
  {
    type: 'professional_indemnity',
    name: 'Professional Indemnity Insurance',
    description: 'Covers professional negligence by designers/consultants',
    required: 'mandatory',
    typicalCover: '£1m-£10m depending on project size',
    costBasis: 'Based on fee income/project value',
    indicativeCost: { min: 1000, max: 5000 }, // £ per professional
    duration: '6-12 years from completion',
    provider: ['Individual professionals'],
  },
  {
    type: 'site_insurance',
    name: 'Site Insurance (Non-Negligence)',
    description: 'Covers damage to existing structures not caused by negligence',
    required: 'recommended',
    typicalCover: 'Existing building value',
    costBasis: 'Percentage of property value',
    indicativeCost: { min: 0.1, max: 0.3 }, // % of property value
    duration: 'Duration of works',
    provider: ['Zurich', 'Hiscox', 'CNA Hardy'],
  },
  {
    type: 'structural_warranty',
    name: 'Structural Warranty (New Build)',
    description: '10-year warranty for new build/conversion defects',
    required: 'mandatory',
    typicalCover: 'Rebuild cost for structural defects',
    costBasis: 'Percentage of build cost',
    indicativeCost: { min: 0.5, max: 1.5 }, // % of build cost
    duration: '10 years from completion',
    provider: ['NHBC', 'LABC', 'Premier', 'Protek'],
  },
  {
    type: 'latent_defects',
    name: 'Latent Defects Insurance',
    description: 'Covers hidden defects in existing construction',
    required: 'recommended',
    typicalCover: 'Repair costs for latent defects',
    costBasis: 'Based on property value and age',
    indicativeCost: { min: 0.3, max: 0.8 }, // % of property value
    duration: '10-12 years',
    provider: ['Allianz', 'Build-Zone', 'RICS schemes'],
  },
  {
    type: 'title_indemnity',
    name: 'Title Indemnity Insurance',
    description: 'Covers defects in title, restrictive covenants, easements',
    required: 'optional',
    typicalCover: 'Property value plus costs',
    costBasis: 'One-off premium',
    indicativeCost: { min: 150, max: 1000 }, // £ one-off
    duration: 'Perpetuity',
    provider: ['Stewart Title', 'First Title', 'Solicitors schemes'],
  },
];

// Warranty providers
const WARRANTY_PROVIDERS: WarrantyProvider[] = [
  {
    name: 'NHBC',
    types: ['new_build', 'conversion'],
    term: 10,
    coverLevel: 'standard',
    requirements: [
      'NHBC registered builder',
      'Build to NHBC standards',
      'Stage inspections',
    ],
    cost: { min: 800, max: 1200 },
    acceptance: 'Required by most mortgage lenders',
  },
  {
    name: 'LABC Warranty',
    types: ['new_build', 'conversion', 'extension'],
    term: 10,
    coverLevel: 'standard',
    requirements: [
      'Building Control approved',
      'Technical audit',
      'Site inspections',
    ],
    cost: { min: 600, max: 1000 },
    acceptance: 'Accepted by most lenders',
  },
  {
    name: 'Premier Guarantee',
    types: ['new_build', 'conversion', 'refurbishment'],
    term: 10,
    coverLevel: 'standard',
    requirements: [
      'Registered builder or self-build',
      'Technical review',
      'Stage inspections',
    ],
    cost: { min: 500, max: 900 },
    acceptance: 'CML accepted',
  },
  {
    name: 'Architect Certification',
    types: ['extension', 'refurbishment', 'loft_conversion'],
    term: 6,
    coverLevel: 'standard',
    requirements: [
      'RIBA/ARB registered architect',
      'Full supervision',
      'PI insurance in place',
    ],
    cost: { min: 0, max: 0 }, // Included in architect fees
    acceptance: 'Accepted by many lenders for works under £100k',
  },
  {
    name: 'Building Control Completion',
    types: ['extension', 'loft_conversion', 'basement'],
    term: 0,
    coverLevel: 'standard',
    requirements: [
      'Building Regulations compliance',
      'Final inspection passed',
    ],
    cost: { min: 0, max: 0 },
    acceptance: 'Basic requirement, not warranty',
  },
];

// Heritage-specific insurance considerations
const HERITAGE_INSURANCE: Record<string, {
  additionalCover: string[];
  premiumIncrease: number;
  specialistProviders: string[];
}> = {
  'Grade I': {
    additionalCover: [
      'Historic fabric reinstatement',
      'Heritage specialist rebuild',
      'Archaeology contingency',
    ],
    premiumIncrease: 50,
    specialistProviders: ['Ecclesiastical', 'NFU Mutual', 'Hiscox'],
  },
  'Grade II*': {
    additionalCover: [
      'Heritage materials cover',
      'Specialist contractor requirements',
    ],
    premiumIncrease: 35,
    specialistProviders: ['Ecclesiastical', 'NFU Mutual'],
  },
  'Grade II': {
    additionalCover: [
      'Traditional materials cover',
      'Conservation requirements',
    ],
    premiumIncrease: 20,
    specialistProviders: ['Standard providers with heritage endorsement'],
  },
  'Conservation Area': {
    additionalCover: ['External reinstatement to original'],
    premiumIncrease: 10,
    specialistProviders: ['Standard providers'],
  },
  'None': {
    additionalCover: [],
    premiumIncrease: 0,
    specialistProviders: ['Standard providers'],
  },
};

// Service class
export class InsuranceRequirementsService {
  /**
   * Get insurance requirements for project
   */
  getRequirements(
    projectType: string,
    projectValue: number,
    buildCost: number,
    heritageStatus: keyof typeof HERITAGE_INSURANCE = 'None',
    isNewBuild: boolean
  ): InsuranceRequirement[] {
    const requirements: InsuranceRequirement[] = [];
    const heritageFactor = HERITAGE_INSURANCE[heritageStatus];
    
    for (const product of INSURANCE_PRODUCTS) {
      // Determine relevance based on project type
      let relevance: InsuranceRequirement['projectRelevance'] = 'useful';
      let estimatedCost = 0;
      const notes: string[] = [];
      
      // Contract works - always essential for construction
      if (product.type === 'contract_works') {
        relevance = 'essential';
        const costPercent = (product.indicativeCost.min + product.indicativeCost.max) / 2 / 100;
        estimatedCost = Math.round(buildCost * costPercent);
        if (heritageFactor && heritageFactor.premiumIncrease > 0) {
          estimatedCost = Math.round(estimatedCost * (1 + heritageFactor.premiumIncrease / 100));
          notes.push(`Heritage premium of ${heritageFactor.premiumIncrease}% applies`);
        }
      }
      
      // Public liability - essential
      if (product.type === 'public_liability') {
        relevance = 'essential';
        estimatedCost = (product.indicativeCost.min + product.indicativeCost.max) / 2;
        notes.push('Ensure contractor has adequate cover');
      }
      
      // Employers liability - contractor should have
      if (product.type === 'employers_liability') {
        relevance = 'important';
        estimatedCost = (product.indicativeCost.min + product.indicativeCost.max) / 2;
        notes.push('Verify contractor policy before works start');
      }
      
      // PI - essential for professionals
      if (product.type === 'professional_indemnity') {
        relevance = 'essential';
        estimatedCost = (product.indicativeCost.min + product.indicativeCost.max) / 2;
        notes.push('Check architect/engineer PI before appointment');
        notes.push('Run-off cover needed for 6-12 years');
      }
      
      // Site insurance - important for valuable properties
      if (product.type === 'site_insurance') {
        relevance = projectValue > 1000000 ? 'important' : 'useful';
        const costPercent = (product.indicativeCost.min + product.indicativeCost.max) / 2 / 100;
        estimatedCost = Math.round(projectValue * costPercent);
        notes.push('Covers existing structure during works');
      }
      
      // Structural warranty - essential for new build/conversion
      if (product.type === 'structural_warranty') {
        if (isNewBuild || projectType === 'conversion') {
          relevance = 'essential';
          const costPercent = (product.indicativeCost.min + product.indicativeCost.max) / 2 / 100;
          estimatedCost = Math.round(buildCost * costPercent);
          notes.push('Required by mortgage lenders');
        } else {
          relevance = 'useful';
          estimatedCost = 0;
          notes.push('May not be required for extensions');
        }
      }
      
      // Latent defects - recommended for older properties
      if (product.type === 'latent_defects') {
        relevance = heritageStatus !== 'None' ? 'important' : 'useful';
        const costPercent = (product.indicativeCost.min + product.indicativeCost.max) / 2 / 100;
        estimatedCost = Math.round(projectValue * costPercent);
        if (heritageStatus !== 'None') {
          notes.push('Recommended for older/heritage properties');
        }
      }
      
      // Title indemnity - optional
      if (product.type === 'title_indemnity') {
        relevance = 'useful';
        estimatedCost = (product.indicativeCost.min + product.indicativeCost.max) / 2;
        notes.push('Consider if title issues identified');
      }
      
      // Add heritage notes
      if (heritageFactor && heritageFactor.additionalCover.length > 0) {
        notes.push(`Heritage cover needed: ${heritageFactor.additionalCover.join(', ')}`);
      }
      
      requirements.push({
        insurance: product,
        projectRelevance: relevance,
        notes,
        estimatedCost,
      });
    }
    
    // Sort by relevance
    const relevanceOrder = { essential: 0, important: 1, useful: 2 };
    requirements.sort((a, b) => relevanceOrder[a.projectRelevance] - relevanceOrder[b.projectRelevance]);
    
    return requirements;
  }

  /**
   * Get suitable warranty providers
   */
  getSuitableWarranties(
    projectType: string,
    buildCost: number
  ): WarrantyProvider[] {
    return WARRANTY_PROVIDERS.filter(w => {
      return w.types.includes(projectType) || w.types.includes('all');
    }).map(w => ({
      ...w,
      cost: {
        min: Math.round((buildCost / 100000) * w.cost.min),
        max: Math.round((buildCost / 100000) * w.cost.max),
      },
    }));
  }

  /**
   * Get full insurance report
   */
  getInsuranceReport(
    projectType: string,
    projectValue: number,
    buildCost: number,
    heritageStatus: keyof typeof HERITAGE_INSURANCE = 'None',
    isNewBuild: boolean
  ): InsuranceReport {
    const requirements = this.getRequirements(
      projectType,
      projectValue,
      buildCost,
      heritageStatus,
      isNewBuild
    );
    
    const warranties = this.getSuitableWarranties(projectType, buildCost);
    
    // Calculate total
    const totalCost = requirements.reduce((sum, r) => sum + r.estimatedCost, 0);
    
    // Timeline
    const timeline = [
      'Before start: Contract works, public liability, site insurance',
      'During works: Verify contractor insurances monthly',
      'Before completion: Apply for structural warranty',
      'On completion: Obtain all certificates and policies',
      'Post-completion: Maintain PI run-off for 6-12 years',
    ];
    
    // Recommendations
    const recommendations: string[] = [];
    recommendations.push('Use insurance broker for project-specific package');
    
    if (heritageStatus !== 'None' && heritageStatus !== 'Conservation Area') {
      recommendations.push('Use specialist heritage insurer');
    }
    
    if (buildCost > 250000) {
      recommendations.push('Consider single project insurance policy');
    }
    
    if (isNewBuild) {
      recommendations.push('Register with warranty provider before starting');
    }
    
    return {
      projectType,
      projectValue,
      requirements,
      warranties,
      totalEstimatedCost: totalCost,
      timeline,
      recommendations,
    };
  }

  /**
   * Get insurance products
   */
  getInsuranceProducts(): InsuranceProduct[] {
    return INSURANCE_PRODUCTS;
  }

  /**
   * Get warranty providers
   */
  getWarrantyProviders(): WarrantyProvider[] {
    return WARRANTY_PROVIDERS;
  }

  /**
   * Get heritage insurance info
   */
  getHeritageInsuranceInfo(): typeof HERITAGE_INSURANCE {
    return HERITAGE_INSURANCE;
  }
}

// Export singleton instance
export const insuranceRequirementsService = new InsuranceRequirementsService();
