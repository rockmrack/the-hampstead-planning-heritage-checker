/**
 * Sustainability & Energy Service
 * Energy efficiency, sustainable design, and Part L compliance
 */

// Types
export type EnergyRating = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';

export interface EnergyAssessment {
  currentRating: EnergyRating;
  potentialRating: EnergyRating;
  currentScore: number;
  recommendations: EnergyRecommendation[];
  heritageConsiderations: string[];
}

export interface EnergyRecommendation {
  measure: string;
  costRange: { min: number; max: number };
  annualSaving: { min: number; max: number };
  paybackYears: number;
  heritageImpact: 'none' | 'low' | 'medium' | 'high';
  planningRequired: boolean;
  notes: string;
}

export interface PartLCompliance {
  requiredUValues: {
    walls: number;
    roof: number;
    floor: number;
    windows: number;
  };
  airTightness: number;
  renewableRequirement: boolean;
  notionalBuildingComparison: boolean;
  bettermentRequired: boolean;
  heritageExemptions: string[];
}

export interface SustainableDesign {
  category: string;
  measures: {
    measure: string;
    description: string;
    heritageCompatible: boolean;
    cost: 'low' | 'medium' | 'high';
    effectiveness: 'low' | 'medium' | 'high';
  }[];
}

export interface RenewableOption {
  technology: string;
  suitable: boolean;
  heritageRestrictions: string[];
  installationCost: { min: number; max: number };
  annualSaving: { min: number; max: number };
  planningRequired: boolean;
  notes: string;
}

// Part L U-value requirements (2021 update)
const PART_L_REQUIREMENTS = {
  newBuild: {
    walls: 0.18,
    roof: 0.11,
    floor: 0.13,
    windows: 1.2,
    doors: 1.0,
    airTightness: 5.0, // m3/h.m2 at 50Pa
  },
  extension: {
    walls: 0.18,
    roof: 0.11,
    floor: 0.13,
    windows: 1.2,
    doors: 1.0,
    airTightness: 8.0,
  },
  existingBuilding: {
    walls: 0.30,
    roof: 0.16,
    floor: 0.25,
    windows: 1.4,
    doors: 1.4,
  },
};

// Heritage-compatible energy measures
const HERITAGE_ENERGY_MEASURES: EnergyRecommendation[] = [
  {
    measure: 'Internal wall insulation (breathable)',
    costRange: { min: 8000, max: 15000 },
    annualSaving: { min: 300, max: 600 },
    paybackYears: 20,
    heritageImpact: 'low',
    planningRequired: false,
    notes: 'Use breathable lime-based systems to avoid moisture issues',
  },
  {
    measure: 'Loft insulation (natural materials)',
    costRange: { min: 500, max: 1500 },
    annualSaving: { min: 200, max: 400 },
    paybackYears: 3,
    heritageImpact: 'none',
    planningRequired: false,
    notes: "Sheep's wool or hemp - breathable and reversible",
  },
  {
    measure: 'Secondary glazing',
    costRange: { min: 3000, max: 8000 },
    annualSaving: { min: 150, max: 350 },
    paybackYears: 15,
    heritageImpact: 'low',
    planningRequired: false,
    notes: 'Preserves original windows, reversible installation',
  },
  {
    measure: 'Draught proofing (traditional methods)',
    costRange: { min: 200, max: 800 },
    annualSaving: { min: 100, max: 250 },
    paybackYears: 3,
    heritageImpact: 'none',
    planningRequired: false,
    notes: 'Brush strips, compression seals - fully reversible',
  },
  {
    measure: 'Chimney sheep/balloon',
    costRange: { min: 30, max: 80 },
    annualSaving: { min: 50, max: 150 },
    paybackYears: 1,
    heritageImpact: 'none',
    planningRequired: false,
    notes: 'Simple, reversible, significant heat loss reduction',
  },
  {
    measure: 'Underfloor insulation (suspended floors)',
    costRange: { min: 1500, max: 4000 },
    annualSaving: { min: 150, max: 350 },
    paybackYears: 10,
    heritageImpact: 'low',
    planningRequired: false,
    notes: 'Natural materials between joists, maintain ventilation',
  },
  {
    measure: 'Heat pump (air source)',
    costRange: { min: 10000, max: 18000 },
    annualSaving: { min: 500, max: 1200 },
    paybackYears: 12,
    heritageImpact: 'medium',
    planningRequired: true,
    notes: 'External unit may need planning permission in conservation area',
  },
  {
    measure: 'Solar PV (heritage sensitive)',
    costRange: { min: 8000, max: 15000 },
    annualSaving: { min: 400, max: 900 },
    paybackYears: 12,
    heritageImpact: 'high',
    planningRequired: true,
    notes: 'Rear/hidden roof locations, in-roof systems preferred',
  },
  {
    measure: 'LED lighting throughout',
    costRange: { min: 500, max: 2000 },
    annualSaving: { min: 100, max: 300 },
    paybackYears: 3,
    heritageImpact: 'none',
    planningRequired: false,
    notes: 'Maintain traditional fitting styles where visible',
  },
  {
    measure: 'Smart heating controls',
    costRange: { min: 300, max: 1000 },
    annualSaving: { min: 150, max: 400 },
    paybackYears: 3,
    heritageImpact: 'none',
    planningRequired: false,
    notes: 'Zone control, learning thermostats, remote operation',
  },
];

// Renewable options for heritage properties
const RENEWABLE_OPTIONS: RenewableOption[] = [
  {
    technology: 'Air Source Heat Pump',
    suitable: true,
    heritageRestrictions: [
      'External unit location critical',
      'Avoid front elevations',
      'Screen with planting if visible',
      'Noise considerations for neighbours',
    ],
    installationCost: { min: 10000, max: 18000 },
    annualSaving: { min: 500, max: 1200 },
    planningRequired: true,
    notes: 'Generally acceptable in conservation areas if sensitively located',
  },
  {
    technology: 'Ground Source Heat Pump',
    suitable: true,
    heritageRestrictions: [
      'Garden archaeology may need assessment',
      'Minimal visual impact once installed',
      'Requires adequate garden space',
    ],
    installationCost: { min: 20000, max: 40000 },
    annualSaving: { min: 700, max: 1500 },
    planningRequired: false,
    notes: 'Usually permitted development, higher efficiency than ASHP',
  },
  {
    technology: 'Solar PV',
    suitable: false,
    heritageRestrictions: [
      'Front/visible roofs typically refused',
      'Rear roofs may be acceptable',
      'In-roof systems preferred over on-roof',
      'Listed buildings need LBC',
    ],
    installationCost: { min: 8000, max: 15000 },
    annualSaving: { min: 400, max: 900 },
    planningRequired: true,
    notes: 'Challenging in conservation areas, case-by-case assessment',
  },
  {
    technology: 'Solar Thermal',
    suitable: false,
    heritageRestrictions: [
      'Similar restrictions to PV',
      'Panels are less efficient use of roof space',
      'May suit some concealed locations',
    ],
    installationCost: { min: 4000, max: 7000 },
    annualSaving: { min: 200, max: 500 },
    planningRequired: true,
    notes: 'Consider heat pump alternative instead',
  },
  {
    technology: 'Battery Storage',
    suitable: true,
    heritageRestrictions: [
      'Internal installation only',
      'No visual impact',
    ],
    installationCost: { min: 5000, max: 10000 },
    annualSaving: { min: 100, max: 300 },
    planningRequired: false,
    notes: 'Useful with time-of-use tariffs or solar PV',
  },
];

export class SustainabilityService {
  /**
   * Assess energy improvement options
   */
  assessEnergyOptions(
    currentRating: EnergyRating,
    isListed: boolean,
    inConservationArea: boolean
  ): EnergyAssessment {
    // Filter measures based on heritage constraints
    let recommendations = [...HERITAGE_ENERGY_MEASURES];
    
    if (isListed) {
      recommendations = recommendations.filter(r => 
        r.heritageImpact === 'none' || r.heritageImpact === 'low'
      );
    } else if (inConservationArea) {
      recommendations = recommendations.filter(r => 
        r.heritageImpact !== 'high' || !r.planningRequired
      );
    }
    
    // Calculate potential rating improvement
    const ratingMap: Record<EnergyRating, number> = { A: 92, B: 81, C: 69, D: 55, E: 39, F: 21, G: 1 };
    const currentScore = ratingMap[currentRating];
    
    // Estimate improvement
    let potentialScore = currentScore;
    for (const rec of recommendations.slice(0, 5)) {
      potentialScore += (rec.annualSaving.max / 50); // Rough correlation
    }
    potentialScore = Math.min(potentialScore, 92);
    
    let potentialRating: EnergyRating = 'G';
    for (const [rating, minScore] of Object.entries(ratingMap) as [EnergyRating, number][]) {
      if (potentialScore >= minScore) {
        potentialRating = rating;
        break;
      }
    }
    
    const heritageConsiderations: string[] = [];
    if (isListed) {
      heritageConsiderations.push('Listed building consent required for most visible changes');
      heritageConsiderations.push('Prioritise reversible interventions');
      heritageConsiderations.push('Use breathable, traditional materials');
      heritageConsiderations.push('Consult conservation officer before works');
    } else if (inConservationArea) {
      heritageConsiderations.push('External changes may need planning permission');
      heritageConsiderations.push('Solar panels unlikely on front-facing roofs');
      heritageConsiderations.push('Air source heat pumps need careful positioning');
    }
    
    return {
      currentRating,
      potentialRating,
      currentScore,
      recommendations,
      heritageConsiderations,
    };
  }

  /**
   * Get Part L compliance requirements
   */
  getPartLRequirements(
    workType: 'new_build' | 'extension' | 'renovation',
    isListed: boolean
  ): PartLCompliance {
    let requirements = PART_L_REQUIREMENTS.extension;
    
    if (workType === 'new_build') {
      requirements = PART_L_REQUIREMENTS.newBuild;
    } else if (workType === 'renovation') {
      requirements = PART_L_REQUIREMENTS.existingBuilding;
    }
    
    const heritageExemptions: string[] = [];
    if (isListed) {
      heritageExemptions.push('Works exempt if compliance would unacceptably alter character');
      heritageExemptions.push('U-value targets may be relaxed for historic fabric');
      heritageExemptions.push('Document any exemptions claimed and justification');
    }
    
    return {
      requiredUValues: {
        walls: requirements.walls,
        roof: requirements.roof,
        floor: requirements.floor,
        windows: requirements.windows,
      },
      airTightness: 'airTightness' in requirements ? requirements.airTightness : 10,
      renewableRequirement: workType === 'new_build',
      notionalBuildingComparison: workType === 'new_build',
      bettermentRequired: workType !== 'renovation',
      heritageExemptions,
    };
  }

  /**
   * Assess renewable energy options
   */
  assessRenewables(
    isListed: boolean,
    inConservationArea: boolean,
    hasGarden: boolean,
    roofOrientation: 'north' | 'south' | 'east' | 'west' | 'flat'
  ): RenewableOption[] {
    let options = [...RENEWABLE_OPTIONS];
    
    // Adjust suitability based on context
    for (const option of options) {
      if (isListed) {
        if (option.technology.includes('Solar')) {
          option.suitable = false;
          option.notes = 'Generally not acceptable on listed buildings';
        }
        if (option.technology === 'Air Source Heat Pump') {
          option.suitable = false;
          option.notes = 'Very difficult to gain LBC approval';
        }
      } else if (inConservationArea) {
        if (option.technology.includes('Solar PV')) {
          option.suitable = roofOrientation === 'south' || roofOrientation === 'flat';
          option.notes = 'May be acceptable on rear-facing or hidden roofs only';
        }
      }
      
      if (option.technology === 'Ground Source Heat Pump' && !hasGarden) {
        option.suitable = false;
        option.notes = 'Requires adequate garden space for ground loops';
      }
      
      if (option.technology.includes('Solar') && roofOrientation === 'north') {
        option.suitable = false;
        option.notes = 'North-facing roofs not suitable for solar';
      }
    }
    
    return options;
  }

  /**
   * Generate sustainable design recommendations
   */
  getSustainableDesignGuidance(developmentType: string): SustainableDesign[] {
    const guidance: SustainableDesign[] = [
      {
        category: 'Building Fabric',
        measures: [
          {
            measure: 'Enhanced insulation',
            description: 'Exceed minimum Part L requirements where possible',
            heritageCompatible: true,
            cost: 'medium',
            effectiveness: 'high',
          },
          {
            measure: 'Thermal bridging reduction',
            description: 'Careful detailing at junctions to prevent cold bridges',
            heritageCompatible: true,
            cost: 'low',
            effectiveness: 'medium',
          },
          {
            measure: 'Airtightness strategy',
            description: 'Air barrier continuity throughout envelope',
            heritageCompatible: true,
            cost: 'low',
            effectiveness: 'high',
          },
        ],
      },
      {
        category: 'Windows & Glazing',
        measures: [
          {
            measure: 'High-performance glazing',
            description: 'Triple glazing or low-e coatings',
            heritageCompatible: false,
            cost: 'high',
            effectiveness: 'medium',
          },
          {
            measure: 'Secondary glazing',
            description: 'Reversible upgrade for existing windows',
            heritageCompatible: true,
            cost: 'medium',
            effectiveness: 'medium',
          },
          {
            measure: 'Slim profile double glazing',
            description: 'Replacement glazing in existing frames',
            heritageCompatible: true,
            cost: 'medium',
            effectiveness: 'medium',
          },
        ],
      },
      {
        category: 'Heating & Ventilation',
        measures: [
          {
            measure: 'MVHR system',
            description: 'Mechanical ventilation with heat recovery',
            heritageCompatible: true,
            cost: 'high',
            effectiveness: 'high',
          },
          {
            measure: 'Underfloor heating',
            description: 'Low temperature system ideal for heat pumps',
            heritageCompatible: true,
            cost: 'high',
            effectiveness: 'medium',
          },
          {
            measure: 'Smart controls',
            description: 'Zoned heating with learning thermostat',
            heritageCompatible: true,
            cost: 'low',
            effectiveness: 'medium',
          },
        ],
      },
      {
        category: 'Water',
        measures: [
          {
            measure: 'Rainwater harvesting',
            description: 'Collection for garden/toilet use',
            heritageCompatible: true,
            cost: 'medium',
            effectiveness: 'low',
          },
          {
            measure: 'Water-efficient fittings',
            description: 'Low-flow taps, dual-flush, efficient shower heads',
            heritageCompatible: true,
            cost: 'low',
            effectiveness: 'medium',
          },
          {
            measure: 'Greywater recycling',
            description: 'Reuse of washwater',
            heritageCompatible: true,
            cost: 'high',
            effectiveness: 'low',
          },
        ],
      },
      {
        category: 'Materials',
        measures: [
          {
            measure: 'Natural/breathable materials',
            description: 'Lime plaster, natural insulation, timber',
            heritageCompatible: true,
            cost: 'medium',
            effectiveness: 'medium',
          },
          {
            measure: 'Recycled content',
            description: 'Specify materials with recycled content',
            heritageCompatible: true,
            cost: 'low',
            effectiveness: 'low',
          },
          {
            measure: 'Local sourcing',
            description: 'Reduce transport emissions',
            heritageCompatible: true,
            cost: 'low',
            effectiveness: 'low',
          },
        ],
      },
    ];
    
    return guidance;
  }

  /**
   * Calculate potential energy cost savings
   */
  calculateSavings(measures: EnergyRecommendation[]): {
    totalCost: { min: number; max: number };
    annualSaving: { min: number; max: number };
    simplePayback: number;
    carbonSaving: number; // kg CO2 per year
  } {
    const totalCost = measures.reduce(
      (acc, m) => ({
        min: acc.min + m.costRange.min,
        max: acc.max + m.costRange.max,
      }),
      { min: 0, max: 0 }
    );
    
    const annualSaving = measures.reduce(
      (acc, m) => ({
        min: acc.min + m.annualSaving.min,
        max: acc.max + m.annualSaving.max,
      }),
      { min: 0, max: 0 }
    );
    
    const avgCost = (totalCost.min + totalCost.max) / 2;
    const avgSaving = (annualSaving.min + annualSaving.max) / 2;
    const simplePayback = avgSaving > 0 ? Math.round(avgCost / avgSaving) : 0;
    
    // Rough carbon calculation: ~0.2 kg CO2 per kWh, savings in £ / 0.30 per kWh
    const carbonSaving = Math.round((avgSaving / 0.30) * 0.2);
    
    return {
      totalCost,
      annualSaving,
      simplePayback,
      carbonSaving,
    };
  }
}

export const sustainabilityService = new SustainabilityService();
