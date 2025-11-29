/**
 * Community Infrastructure Levy (CIL) Calculator Service
 * 
 * Comprehensive CIL calculation for developments in Camden Borough.
 * Calculates Mayoral CIL, Camden CIL, and provides exemption guidance.
 * 
 * Based on:
 * - Camden CIL Charging Schedule (2015, indexed)
 * - Mayoral CIL 2 Charging Schedule (2019)
 * - CIL Regulations 2010 (as amended)
 * - RICS CIL Guidance
 */

// Camden CIL rates by zone and use (£ per sqm, indexed to 2024)
const CAMDEN_CIL_RATES: Record<string, Record<string, number>> = {
  'zone_a': { // Prime areas including Hampstead
    residential: 500,
    studentAccommodation: 400,
    retail: 150,
    office: 75,
    hotel: 250,
    otherUses: 0
  },
  'zone_b': { // Secondary areas
    residential: 400,
    studentAccommodation: 300,
    retail: 100,
    office: 50,
    hotel: 200,
    otherUses: 0
  },
  'zone_c': { // Regeneration areas
    residential: 300,
    studentAccommodation: 200,
    retail: 50,
    office: 25,
    hotel: 150,
    otherUses: 0
  }
};

// Mayoral CIL 2 rates (April 2019, indexed)
const MAYORAL_CIL_RATES: Record<string, number> = {
  'zone_1': 80, // Central London
  'zone_2': 60, // Most of Camden including Hampstead
  'zone_3': 25  // Outer areas
};

// Postcode to CIL zone mapping
const POSTCODE_ZONES: Record<string, { camden: string; mayoral: string }> = {
  'NW3': { camden: 'zone_a', mayoral: 'zone_2' },
  'NW6': { camden: 'zone_b', mayoral: 'zone_2' },
  'NW8': { camden: 'zone_a', mayoral: 'zone_1' },
  'NW1': { camden: 'zone_b', mayoral: 'zone_1' },
  'NW2': { camden: 'zone_b', mayoral: 'zone_2' },
  'NW5': { camden: 'zone_b', mayoral: 'zone_2' },
  'NW11': { camden: 'zone_b', mayoral: 'zone_2' },
  'N2': { camden: 'zone_c', mayoral: 'zone_2' },
  'N6': { camden: 'zone_b', mayoral: 'zone_2' },
  'N10': { camden: 'zone_c', mayoral: 'zone_2' }
};

// CIL index values (BCIS All-in TPI)
const CIL_INDEX = {
  camdenBase: 259, // November 2014 base
  mayoralBase: 323, // January 2019 base
  currentIndex: 395 // Current index (approximate 2024)
};

// Exemptions and reliefs
const EXEMPTIONS = {
  socialHousing: {
    relief: 1.0, // 100% relief
    requiresClaim: true,
    conditions: [
      'Development must meet social housing definition in CIL Regs',
      'Must be let as social rent or affordable rent',
      'Relief must be claimed before commencement',
      'Clawback applies if conditions not met for 7 years'
    ]
  },
  selfBuild: {
    relief: 1.0, // 100% relief
    requiresClaim: true,
    conditions: [
      'Must be built or commissioned by individual',
      'Must be occupied as sole residence for 3 years',
      'Relief must be claimed before commencement',
      'Clawback applies if sold or let within 3 years'
    ]
  },
  charities: {
    relief: 1.0, // 100% relief for own use
    requiresClaim: true,
    conditions: [
      'Charity must own land',
      'Development must be for charitable purposes',
      'Material interest must not be sold/leased',
      'Clawback applies if used for other purposes'
    ]
  },
  minorDevelopment: {
    relief: 1.0, // Below threshold
    requiresClaim: false,
    conditions: [
      'Less than 100 sqm new build',
      'Not creating new dwelling',
      'Automatic exemption, no claim needed'
    ]
  },
  annex: {
    relief: 1.0,
    requiresClaim: false,
    conditions: [
      'Residential annex within curtilage of existing dwelling',
      'Occupied in connection with main dwelling',
      'Automatic exemption'
    ]
  }
};

// Payment schedule options
const PAYMENT_SCHEDULES = {
  standard: [
    { trigger: 'commencement', days: 60, percentage: 100 }
  ],
  phased_small: [
    { trigger: 'commencement', days: 60, percentage: 50 },
    { trigger: 'commencement', days: 240, percentage: 50 }
  ],
  phased_medium: [
    { trigger: 'commencement', days: 60, percentage: 25 },
    { trigger: 'commencement', days: 180, percentage: 25 },
    { trigger: 'commencement', days: 360, percentage: 25 },
    { trigger: 'commencement', days: 540, percentage: 25 }
  ],
  phased_large: [
    { trigger: 'commencement', days: 60, percentage: 20 },
    { trigger: 'commencement', days: 180, percentage: 20 },
    { trigger: 'commencement', days: 360, percentage: 20 },
    { trigger: 'commencement', days: 540, percentage: 20 },
    { trigger: 'commencement', days: 720, percentage: 20 }
  ]
};

interface DevelopmentDetails {
  grossInternalArea: number; // sqm of new development
  existingFloorspace?: number; // sqm of lawful existing
  existingInUse?: boolean; // In continuous lawful use for 6 months in past 3 years
  developmentType: 'residential' | 'studentAccommodation' | 'retail' | 'office' | 'hotel' | 'mixed' | 'other';
  numberOfUnits?: number;
  affordableUnits?: number;
  selfBuild?: boolean;
  charitableUse?: boolean;
  mixedUseBreakdown?: Array<{
    useType: string;
    floorspace: number;
  }>;
}

interface CILCalculationResult {
  summary: {
    totalCILPayable: number;
    camdenCIL: number;
    mayoralCIL: number;
    chargeableFloorspace: number;
    exemptFloorspace: number;
    indexationApplied: boolean;
  };
  camdenCalculation: {
    zone: string;
    ratePerSqm: number;
    chargeableArea: number;
    baseCharge: number;
    indexedCharge: number;
    indexFactor: number;
  };
  mayoralCalculation: {
    zone: string;
    ratePerSqm: number;
    chargeableArea: number;
    baseCharge: number;
    indexedCharge: number;
    indexFactor: number;
  };
  floorspaceCalculation: {
    grossInternalArea: number;
    existingFloorspace: number;
    deductibleExisting: number;
    socialHousingExempt: number;
    selfBuildExempt: number;
    netChargeableArea: number;
  };
  exemptionsApplied: Array<{
    type: string;
    floorspace: number;
    value: number;
    requiresClaim: boolean;
  }>;
  paymentSchedule: {
    scheduleType: string;
    payments: Array<{
      dueDate: string;
      daysFromCommencement: number;
      amount: number;
      percentage: number;
    }>;
  };
  administrativeRequirements: {
    forms: string[];
    deadlines: string[];
    notices: string[];
  };
  surchargesAndPenalties: {
    latePaymentSurcharge: string;
    commencementNoticeFailure: string;
    assumedCommencementDate: string;
  };
  guidance: string[];
  warnings: string[];
}

export class CILCalculatorService {
  
  /**
   * Calculate CIL liability
   */
  calculateCIL(
    address: string,
    developmentDetails: DevelopmentDetails
  ): CILCalculationResult {
    const postcode = this.extractPostcode(address);
    const postcodeDistrict = postcode.split(' ')[0] || 'NW3';
    
    // Get zones
    const defaultZones = { camden: 'zone_b', mayoral: 'zone_2' };
    const zonesLookup = POSTCODE_ZONES[postcodeDistrict];
    const zones = zonesLookup || defaultZones;
    
    // Calculate chargeable floorspace
    const floorspaceCalc = this.calculateChargeableFloorspace(developmentDetails);
    
    // Calculate Camden CIL
    const camdenCalc = this.calculateCamdenCIL(
      zones.camden,
      developmentDetails.developmentType,
      floorspaceCalc.netChargeableArea,
      developmentDetails.mixedUseBreakdown
    );
    
    // Calculate Mayoral CIL
    const mayoralCalc = this.calculateMayoralCIL(
      zones.mayoral,
      floorspaceCalc.netChargeableArea
    );
    
    // Determine exemptions
    const exemptions = this.determineExemptions(developmentDetails);
    
    // Calculate exempt values
    let exemptValue = 0;
    exemptions.forEach(ex => {
      exemptValue += ex.value;
    });
    
    // Determine payment schedule
    const totalCIL = camdenCalc.indexedCharge + mayoralCalc.indexedCharge;
    const paymentSchedule = this.determinePaymentSchedule(totalCIL);
    
    return {
      summary: {
        totalCILPayable: totalCIL,
        camdenCIL: camdenCalc.indexedCharge,
        mayoralCIL: mayoralCalc.indexedCharge,
        chargeableFloorspace: floorspaceCalc.netChargeableArea,
        exemptFloorspace: floorspaceCalc.socialHousingExempt + floorspaceCalc.selfBuildExempt,
        indexationApplied: true
      },
      camdenCalculation: camdenCalc,
      mayoralCalculation: mayoralCalc,
      floorspaceCalculation: floorspaceCalc,
      exemptionsApplied: exemptions,
      paymentSchedule,
      administrativeRequirements: this.getAdministrativeRequirements(),
      surchargesAndPenalties: this.getSurchargesInfo(),
      guidance: this.generateGuidance(developmentDetails, exemptions),
      warnings: this.generateWarnings(developmentDetails)
    };
  }
  
  /**
   * Calculate chargeable floorspace
   */
  private calculateChargeableFloorspace(details: DevelopmentDetails): {
    grossInternalArea: number;
    existingFloorspace: number;
    deductibleExisting: number;
    socialHousingExempt: number;
    selfBuildExempt: number;
    netChargeableArea: number;
  } {
    const gia = details.grossInternalArea;
    const existing = details.existingFloorspace || 0;
    
    // Existing can only be deducted if in lawful use
    const deductibleExisting = details.existingInUse ? existing : 0;
    
    // Calculate GIA after existing deduction (proportional method)
    let netArea = gia;
    if (deductibleExisting > 0 && gia > 0) {
      // CIL formula: CIL = R × A × Ip/Ic
      // Where A = GR - (GR × E/G) when existing in use
      const proportionalDeduction = (gia * deductibleExisting) / gia;
      netArea = gia - Math.min(proportionalDeduction, gia);
    }
    
    // Social housing exemption
    let socialHousingExempt = 0;
    if (details.affordableUnits && details.numberOfUnits && details.numberOfUnits > 0) {
      const affordableRatio = details.affordableUnits / details.numberOfUnits;
      socialHousingExempt = netArea * affordableRatio;
    }
    
    // Self-build exemption
    let selfBuildExempt = 0;
    if (details.selfBuild) {
      selfBuildExempt = netArea - socialHousingExempt;
    }
    
    const netChargeableArea = Math.max(0, netArea - socialHousingExempt - selfBuildExempt);
    
    return {
      grossInternalArea: gia,
      existingFloorspace: existing,
      deductibleExisting,
      socialHousingExempt,
      selfBuildExempt,
      netChargeableArea
    };
  }
  
  /**
   * Calculate Camden CIL
   */
  private calculateCamdenCIL(
    zone: string,
    useType: string,
    chargeableArea: number,
    mixedUseBreakdown?: Array<{ useType: string; floorspace: number }>
  ): {
    zone: string;
    ratePerSqm: number;
    chargeableArea: number;
    baseCharge: number;
    indexedCharge: number;
    indexFactor: number;
  } {
    const defaultRates = {
      residential: 400,
      studentAccommodation: 300,
      retail: 100,
      office: 50,
      hotel: 200,
      otherUses: 0
    };
    const zoneRates = CAMDEN_CIL_RATES[zone] || defaultRates;
    
    let baseCharge = 0;
    let effectiveRate = 0;
    
    if (mixedUseBreakdown && mixedUseBreakdown.length > 0) {
      // Calculate for each use
      mixedUseBreakdown.forEach(use => {
        const rate = zoneRates[use.useType as keyof typeof zoneRates] || 0;
        baseCharge += rate * use.floorspace;
      });
      effectiveRate = baseCharge / chargeableArea;
    } else {
      // Single use
      const useCategory = this.mapUseType(useType);
      effectiveRate = zoneRates[useCategory as keyof typeof zoneRates] || 0;
      baseCharge = effectiveRate * chargeableArea;
    }
    
    // Apply indexation
    const indexFactor = CIL_INDEX.currentIndex / CIL_INDEX.camdenBase;
    const indexedCharge = Math.round(baseCharge * indexFactor);
    
    return {
      zone,
      ratePerSqm: effectiveRate,
      chargeableArea,
      baseCharge,
      indexedCharge,
      indexFactor
    };
  }
  
  /**
   * Calculate Mayoral CIL
   */
  private calculateMayoralCIL(
    zone: string,
    chargeableArea: number
  ): {
    zone: string;
    ratePerSqm: number;
    chargeableArea: number;
    baseCharge: number;
    indexedCharge: number;
    indexFactor: number;
  } {
    const rate = MAYORAL_CIL_RATES[zone] || 60;
    const baseCharge = rate * chargeableArea;
    
    // Apply indexation
    const indexFactor = CIL_INDEX.currentIndex / CIL_INDEX.mayoralBase;
    const indexedCharge = Math.round(baseCharge * indexFactor);
    
    return {
      zone,
      ratePerSqm: rate,
      chargeableArea,
      baseCharge,
      indexedCharge,
      indexFactor
    };
  }
  
  /**
   * Determine applicable exemptions
   */
  private determineExemptions(details: DevelopmentDetails): Array<{
    type: string;
    floorspace: number;
    value: number;
    requiresClaim: boolean;
  }> {
    const exemptions: Array<{
      type: string;
      floorspace: number;
      value: number;
      requiresClaim: boolean;
    }> = [];
    
    // Check minor development exemption
    if (details.grossInternalArea < 100 && (!details.numberOfUnits || details.numberOfUnits === 0)) {
      exemptions.push({
        type: 'Minor Development (under 100 sqm)',
        floorspace: details.grossInternalArea,
        value: 0, // Exempt from calculation
        requiresClaim: false
      });
    }
    
    // Social housing relief
    if (details.affordableUnits && details.affordableUnits > 0 && details.numberOfUnits) {
      const affordableRatio = details.affordableUnits / details.numberOfUnits;
      const exemptFloorspace = details.grossInternalArea * affordableRatio;
      const estimatedSaving = exemptFloorspace * 500; // Approximate rate
      
      exemptions.push({
        type: 'Social Housing Relief',
        floorspace: exemptFloorspace,
        value: estimatedSaving,
        requiresClaim: true
      });
    }
    
    // Self-build exemption
    if (details.selfBuild) {
      const estimatedSaving = details.grossInternalArea * 500;
      
      exemptions.push({
        type: 'Self-Build Exemption',
        floorspace: details.grossInternalArea,
        value: estimatedSaving,
        requiresClaim: true
      });
    }
    
    // Charitable exemption
    if (details.charitableUse) {
      const estimatedSaving = details.grossInternalArea * 500;
      
      exemptions.push({
        type: 'Charitable Relief',
        floorspace: details.grossInternalArea,
        value: estimatedSaving,
        requiresClaim: true
      });
    }
    
    return exemptions;
  }
  
  /**
   * Determine payment schedule
   */
  private determinePaymentSchedule(totalCIL: number): {
    scheduleType: string;
    payments: Array<{
      dueDate: string;
      daysFromCommencement: number;
      amount: number;
      percentage: number;
    }>;
  } {
    let scheduleType: string;
    let schedule: Array<{ trigger: string; days: number; percentage: number }>;
    
    if (totalCIL <= 100000) {
      scheduleType = 'standard';
      schedule = PAYMENT_SCHEDULES.standard;
    } else if (totalCIL <= 250000) {
      scheduleType = 'phased_small';
      schedule = PAYMENT_SCHEDULES.phased_small;
    } else if (totalCIL <= 500000) {
      scheduleType = 'phased_medium';
      schedule = PAYMENT_SCHEDULES.phased_medium;
    } else {
      scheduleType = 'phased_large';
      schedule = PAYMENT_SCHEDULES.phased_large;
    }
    
    const payments = schedule.map(item => ({
      dueDate: `${item.days} days after commencement`,
      daysFromCommencement: item.days,
      amount: Math.round(totalCIL * (item.percentage / 100)),
      percentage: item.percentage
    }));
    
    return {
      scheduleType,
      payments
    };
  }
  
  /**
   * Map use type to CIL category
   */
  private mapUseType(useType: string): string {
    const mapping: Record<string, string> = {
      'residential': 'residential',
      'studentAccommodation': 'studentAccommodation',
      'retail': 'retail',
      'office': 'office',
      'hotel': 'hotel',
      'mixed': 'residential', // Default to residential for mixed
      'other': 'otherUses'
    };
    return mapping[useType] || 'residential';
  }
  
  /**
   * Get administrative requirements
   */
  private getAdministrativeRequirements(): {
    forms: string[];
    deadlines: string[];
    notices: string[];
  } {
    return {
      forms: [
        'Form 1: CIL Liability Notice - Issued by Council on grant of permission',
        'Form 2: Assumption of Liability - Submit before commencement',
        'Form 3: Withdrawal of Assumption - If liability transferred',
        'Form 4: Transfer of Liability - When selling development',
        'Form 5: Notice of Chargeable Development - For phased schemes',
        'Form 6: Commencement Notice - Submit before starting work',
        'Form 7: Self-build Exemption Claim - Part 1 (before) and Part 2 (after)',
        'Form 8: Social Housing Relief Claim - Before commencement'
      ],
      deadlines: [
        'Assumption of Liability (Form 2): Before commencement',
        'Commencement Notice (Form 6): Submitted before commencement',
        'Exemption/Relief Claims: Before commencement of development',
        'Payment: Per payment schedule from Demand Notice',
        'Appeal against CIL: 60 days from Liability Notice'
      ],
      notices: [
        'Liability Notice: Issued within 28 days of planning permission',
        'Demand Notice: Issued after valid Commencement Notice',
        'Payment reminders: Issued if payment overdue'
      ]
    };
  }
  
  /**
   * Get surcharges information
   */
  private getSurchargesInfo(): {
    latePaymentSurcharge: string;
    commencementNoticeFailure: string;
    assumedCommencementDate: string;
  } {
    return {
      latePaymentSurcharge: '5% of CIL amount, plus interest at 2.5% above Bank of England base rate',
      commencementNoticeFailure: 'Surcharge of 20% of CIL amount or £2,500 (whichever is greater)',
      assumedCommencementDate: 'If no Commencement Notice submitted, Council may deem commencement on earliest lawful date'
    };
  }
  
  /**
   * Generate guidance
   */
  private generateGuidance(
    details: DevelopmentDetails,
    exemptions: Array<{ type: string; requiresClaim: boolean }>
  ): string[] {
    const guidance: string[] = [
      'CIL is calculated on net additional floorspace (GIA) created by the development',
      'Existing lawful floorspace can be deducted if in continuous use for 6+ months in past 3 years',
      'Submit Assumption of Liability (Form 2) before commencing work',
      'Always submit Commencement Notice (Form 6) before starting any development'
    ];
    
    const claimableExemptions = exemptions.filter(ex => ex.requiresClaim);
    if (claimableExemptions.length > 0) {
      guidance.push('You have potential exemptions that require claims BEFORE commencement:');
      claimableExemptions.forEach(ex => {
        guidance.push(`  - ${ex.type}: Submit claim form before starting work`);
      });
    }
    
    if (details.developmentType === 'residential' && details.numberOfUnits && details.numberOfUnits >= 10) {
      guidance.push('Consider CIL impact on viability - include in viability assessment if applicable');
    }
    
    if (details.existingFloorspace && details.existingFloorspace > 0) {
      guidance.push('Obtain evidence of lawful existing use (utility bills, business rates, etc.) to claim deduction');
    }
    
    guidance.push('CIL is index-linked using BCIS All-in Tender Price Index');
    guidance.push('Camden Council accepts payment in instalments for larger developments');
    guidance.push('Appeal against CIL calculation within 60 days if you believe it is incorrect');
    
    return guidance;
  }
  
  /**
   * Generate warnings
   */
  private generateWarnings(details: DevelopmentDetails): string[] {
    const warnings: string[] = [];
    
    warnings.push('IMPORTANT: CIL liability arises on commencement of development');
    warnings.push('Failure to submit Commencement Notice results in 20% surcharge');
    warnings.push('Exemptions/reliefs MUST be claimed BEFORE development commences');
    
    if (details.selfBuild) {
      warnings.push('Self-build exemption has 3-year clawback if property sold or let');
    }
    
    if (details.affordableUnits && details.affordableUnits > 0) {
      warnings.push('Social housing relief has 7-year clawback if conditions not maintained');
    }
    
    if (details.existingFloorspace && !details.existingInUse) {
      warnings.push('Existing floorspace cannot be deducted unless in lawful use for 6+ months in past 3 years');
    }
    
    warnings.push('CIL is a debt to the Council and can be recovered through various means including Stop Notices');
    
    return warnings;
  }
  
  /**
   * Get exemption details
   */
  getExemptionDetails(): Record<string, {
    relief: number;
    requiresClaim: boolean;
    conditions: string[];
  }> {
    return EXEMPTIONS;
  }
  
  /**
   * Get CIL rates for an area
   */
  getCILRatesForArea(postcodeDistrict: string): {
    camdenZone: string;
    mayoralZone: string;
    camdenRates: Record<string, number>;
    mayoralRate: number;
  } {
    const defaultZones = { camden: 'zone_b', mayoral: 'zone_2' };
    const zones = POSTCODE_ZONES[postcodeDistrict] || defaultZones;
    const defaultRates = {
      residential: 400,
      studentAccommodation: 300,
      retail: 100,
      office: 50,
      hotel: 200,
      otherUses: 0
    };
    
    return {
      camdenZone: zones.camden,
      mayoralZone: zones.mayoral,
      camdenRates: CAMDEN_CIL_RATES[zones.camden] || defaultRates,
      mayoralRate: MAYORAL_CIL_RATES[zones.mayoral] || 60
    };
  }
  
  /**
   * Extract postcode from address
   */
  private extractPostcode(address: string): string {
    const postcodeRegex = /([A-Z]{1,2}[0-9][0-9A-Z]?\s?[0-9][A-Z]{2})/i;
    const match = address.match(postcodeRegex);
    return match && match[1] ? match[1].toUpperCase() : 'NW3 1AA';
  }
}

export default CILCalculatorService;
