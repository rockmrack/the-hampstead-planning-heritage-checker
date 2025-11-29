/**
 * Rights of Light Service
 * 
 * Assesses Rights of Light implications for development.
 * Rights of Light is a common law right acquired after 20 years of uninterrupted
 * light enjoyment, separate from planning daylight/sunlight assessments.
 */

interface RightsOfLightProject {
  heightIncrease?: number;
  proximityToNeighbors?: number;
  affectedWindows?: number;
  existingObstructions?: string[];
  developmentType?: string;
}

interface LegalRisk {
  level: 'low' | 'medium' | 'high' | 'very-high';
  description: string;
  factors: string[];
  potentialClaims: string[];
}

interface InsuranceGuidance {
  recommended: boolean;
  estimatedPremium: string;
  indemnityType: string;
  coverage: string[];
  exclusions: string[];
}

interface MitigationOption {
  strategy: string;
  effectiveness: string;
  cost: string;
  timeline: string;
  considerations: string[];
}

interface RightsAssessment {
  address: string;
  postcode: string;
  area: string;
  projectType: string;
  riskLevel: LegalRisk;
  insurance: InsuranceGuidance;
  mitigationOptions: MitigationOption[];
  technicalAnalysis: {
    basisOfRight: string;
    testUsed: string;
    thresholds: {
      name: string;
      value: string;
      significance: string;
    }[];
  };
  affectedParties: {
    category: string;
    likelyNumber: number;
    compensationRange: string;
    negotiationApproach: string;
  }[];
  timeline: {
    phase: string;
    duration: string;
    activities: string[];
  }[];
  costs: {
    category: string;
    range: string;
    notes: string;
  }[];
  legalConsiderations: string[];
  recommendations: string[];
  hampsteadSpecifics: string[];
}

// Hampstead area characteristics affecting Rights of Light
const AREA_CHARACTERISTICS: Record<string, {
  density: string;
  avgPlotSize: string;
  typicalSeparation: string;
  windowOrientation: string;
  riskMultiplier: number;
}> = {
  'NW3': {
    density: 'Medium-High',
    avgPlotSize: 'Large',
    typicalSeparation: '8-15m',
    windowOrientation: 'Mixed Victorian/Edwardian patterns',
    riskMultiplier: 1.3
  },
  'NW6': {
    density: 'High',
    avgPlotSize: 'Medium',
    typicalSeparation: '5-10m',
    windowOrientation: 'Terrace pattern - rear windows critical',
    riskMultiplier: 1.5
  },
  'NW8': {
    density: 'Medium',
    avgPlotSize: 'Large',
    typicalSeparation: '10-20m',
    windowOrientation: 'Grand townhouse pattern',
    riskMultiplier: 1.2
  },
  'NW11': {
    density: 'Low-Medium',
    avgPlotSize: 'Large',
    typicalSeparation: '12-25m',
    windowOrientation: 'Suburban detached pattern',
    riskMultiplier: 0.9
  }
};

// Project types and their Rights of Light impact
const PROJECT_IMPACT: Record<string, {
  inherentRisk: 'low' | 'medium' | 'high' | 'very-high';
  typicalClaims: number;
  avgCompensation: string;
}> = {
  'basement-extension': {
    inherentRisk: 'low',
    typicalClaims: 0,
    avgCompensation: '£0'
  },
  'rear-extension': {
    inherentRisk: 'medium',
    typicalClaims: 1,
    avgCompensation: '£5,000-15,000'
  },
  'side-extension': {
    inherentRisk: 'medium',
    typicalClaims: 1,
    avgCompensation: '£3,000-10,000'
  },
  'loft-conversion': {
    inherentRisk: 'medium',
    typicalClaims: 1,
    avgCompensation: '£2,000-8,000'
  },
  'additional-storey': {
    inherentRisk: 'high',
    typicalClaims: 2,
    avgCompensation: '£15,000-50,000'
  },
  'new-build': {
    inherentRisk: 'very-high',
    typicalClaims: 3,
    avgCompensation: '£30,000-150,000+'
  },
  'infill-development': {
    inherentRisk: 'very-high',
    typicalClaims: 4,
    avgCompensation: '£50,000-200,000+'
  }
};

// Insurance market data
const INSURANCE_GUIDANCE: Record<string, {
  available: boolean;
  typicalPremium: string;
  excess: string;
  maxCover: string;
}> = {
  'low': {
    available: true,
    typicalPremium: '£500-1,500',
    excess: '£1,000',
    maxCover: '£100,000'
  },
  'medium': {
    available: true,
    typicalPremium: '£1,500-5,000',
    excess: '£2,500',
    maxCover: '£250,000'
  },
  'high': {
    available: true,
    typicalPremium: '£5,000-15,000',
    excess: '£5,000',
    maxCover: '£500,000'
  },
  'very-high': {
    available: false,
    typicalPremium: 'Bespoke - £15,000+',
    excess: '£10,000+',
    maxCover: 'Subject to survey'
  }
};

function extractOutcode(postcode: string): string {
  const cleaned = postcode.toUpperCase().replace(/\s+/g, '');
  const match = cleaned.match(/^([A-Z]{1,2}\d{1,2})/);
  return match && match[1] ? match[1] : 'NW3';
}

function assessLegalRisk(
  postcode: string,
  projectType: string,
  projectDetails: RightsOfLightProject
): LegalRisk {
  const outcode = extractOutcode(postcode);
  const defaultAreaChar = AREA_CHARACTERISTICS['NW3']!;
  const areaChar = AREA_CHARACTERISTICS[outcode] || defaultAreaChar;
  const defaultProjectImpact = PROJECT_IMPACT['rear-extension']!;
  const projectImpact = PROJECT_IMPACT[projectType] || defaultProjectImpact;
  
  let riskScore = 0;
  const factors: string[] = [];
  const potentialClaims: string[] = [];

  // Base risk from project type
  if (projectImpact.inherentRisk === 'low') riskScore += 1;
  else if (projectImpact.inherentRisk === 'medium') riskScore += 2;
  else if (projectImpact.inherentRisk === 'high') riskScore += 3;
  else riskScore += 4;
  factors.push(`Project type (${projectType}) has ${projectImpact.inherentRisk} inherent risk`);

  // Area density impact
  riskScore = Math.round(riskScore * areaChar.riskMultiplier);
  factors.push(`${outcode} area has ${areaChar.density} density (risk multiplier ${areaChar.riskMultiplier})`);

  // Height increase factor
  if (projectDetails.heightIncrease) {
    if (projectDetails.heightIncrease > 5) {
      riskScore += 2;
      factors.push(`Height increase >5m significantly increases obstruction angle`);
      potentialClaims.push('Upper floor windows likely affected');
    } else if (projectDetails.heightIncrease > 2) {
      riskScore += 1;
      factors.push(`Height increase ${projectDetails.heightIncrease}m moderately increases risk`);
    }
  }

  // Proximity to neighbors
  if (projectDetails.proximityToNeighbors) {
    if (projectDetails.proximityToNeighbors < 3) {
      riskScore += 2;
      factors.push(`Very close proximity (<3m) to neighbors - high impact likely`);
      potentialClaims.push('Direct neighbors on affected side');
    } else if (projectDetails.proximityToNeighbors < 6) {
      riskScore += 1;
      factors.push(`Close proximity (3-6m) to neighbors`);
    }
  }

  // Affected windows
  if (projectDetails.affectedWindows) {
    if (projectDetails.affectedWindows > 5) {
      riskScore += 2;
      factors.push(`Multiple windows (${projectDetails.affectedWindows}) potentially affected`);
      potentialClaims.push('Multiple rooms/occupiers may claim');
    } else if (projectDetails.affectedWindows > 2) {
      riskScore += 1;
      factors.push(`Several windows (${projectDetails.affectedWindows}) potentially affected`);
    }
  }

  // Determine final risk level
  let level: 'low' | 'medium' | 'high' | 'very-high';
  let description: string;

  if (riskScore <= 2) {
    level = 'low';
    description = 'Low risk of Rights of Light claims. Standard precautions recommended.';
  } else if (riskScore <= 4) {
    level = 'medium';
    description = 'Moderate risk of Rights of Light claims. Survey recommended before proceeding.';
    if (potentialClaims.length === 0) {
      potentialClaims.push('Adjacent property owners may have claims');
    }
  } else if (riskScore <= 6) {
    level = 'high';
    description = 'High risk of Rights of Light claims. Full survey and legal advice essential.';
    if (potentialClaims.length === 0) {
      potentialClaims.push('Multiple adjacent properties likely affected');
      potentialClaims.push('Potential for injunction if not addressed');
    }
  } else {
    level = 'very-high';
    description = 'Very high risk of Rights of Light claims. Project may need significant modification.';
    potentialClaims.push('Multiple properties likely to have actionable claims');
    potentialClaims.push('High risk of injunction preventing development');
    potentialClaims.push('Significant compensation likely required');
  }

  return {
    level,
    description,
    factors,
    potentialClaims
  };
}

function getInsuranceGuidance(riskLevel: string): InsuranceGuidance {
  const defaultInsurance = INSURANCE_GUIDANCE['medium']!;
  const insuranceData = INSURANCE_GUIDANCE[riskLevel] || defaultInsurance;

  return {
    recommended: true,
    estimatedPremium: insuranceData.typicalPremium,
    indemnityType: riskLevel === 'very-high' ? 'Bespoke Policy Required' : 'Standard Rights of Light Indemnity',
    coverage: [
      'Legal defence costs',
      'Compensation payments to affected parties',
      'Court-ordered modifications (if any)',
      'Expert witness fees',
      'Negotiation and settlement costs'
    ],
    exclusions: [
      'Known claims notified before policy inception',
      'Deliberate infringement after advice',
      'Works significantly different from surveyed scheme',
      'Criminal proceedings',
      'Injunction compliance costs (usually limited)'
    ]
  };
}

function getMitigationOptions(riskLevel: string, projectType: string): MitigationOption[] {
  const options: MitigationOption[] = [];

  // Design modification - always an option
  options.push({
    strategy: 'Design Modification',
    effectiveness: riskLevel === 'high' || riskLevel === 'very-high' ? 'Very Effective' : 'Moderately Effective',
    cost: '£2,000-10,000 redesign fees',
    timeline: '2-4 weeks',
    considerations: [
      'Reduce building height or footprint',
      'Step back upper floors from boundary',
      'Use pitched roofs sloping away from neighbors',
      'Consider alternative configurations',
      'May significantly reduce or eliminate claims'
    ]
  });

  // Negotiated release
  options.push({
    strategy: 'Negotiated Release',
    effectiveness: 'Very Effective if achieved',
    cost: '£5,000-50,000+ per affected party',
    timeline: '4-12 weeks',
    considerations: [
      'Approach neighbors early before planning/works',
      'Offer fair compensation for light reduction',
      'Obtain legal release document',
      'Consider ongoing relationship',
      'Some parties may refuse at any price'
    ]
  });

  // Deed of release
  if (riskLevel !== 'low') {
    options.push({
      strategy: 'Deed of Release/Easement',
      effectiveness: 'Definitive - eliminates specific claim',
      cost: '£2,000-5,000 legal fees + compensation',
      timeline: '4-8 weeks',
      considerations: [
        'Formal legal document registered against title',
        'Binds future owners of affected property',
        'Provides certainty for your development',
        'May be required by lenders',
        'Neighbor must agree to terms'
      ]
    });
  }

  // Rights of Light Survey
  options.push({
    strategy: 'Professional Survey',
    effectiveness: 'Diagnostic - informs other strategies',
    cost: '£3,000-15,000 depending on complexity',
    timeline: '2-4 weeks',
    considerations: [
      'Uses technical 50/50 rule assessment',
      'Identifies specific affected apertures',
      'Quantifies loss for compensation calculation',
      'Provides evidence for negotiations',
      'May identify unexpected risks or clearances'
    ]
  });

  // Insurance
  options.push({
    strategy: 'Rights of Light Insurance',
    effectiveness: riskLevel === 'very-high' ? 'Limited availability' : 'Effective risk transfer',
    cost: (INSURANCE_GUIDANCE[riskLevel] || INSURANCE_GUIDANCE['medium'])?.typicalPremium || '£2,000-10,000',
    timeline: '1-2 weeks',
    considerations: [
      'Transfers financial risk to insurer',
      'Does not prevent claims or injunctions',
      'Premium based on survey findings',
      'May have significant excess',
      'Lender may require as condition'
    ]
  });

  // Notional damages approach (for lower risk)
  if (riskLevel === 'medium' || riskLevel === 'low') {
    options.push({
      strategy: 'Proceed with Risk Reserve',
      effectiveness: 'Pragmatic for lower risk cases',
      cost: 'Reserve £10,000-30,000 for potential claims',
      timeline: 'Ongoing',
      considerations: [
        'Accept possibility of future claims',
        'Set aside funds for potential compensation',
        'Most small claims settle for modest sums',
        'Injunctions very rare for minor infringements',
        'Keep evidence of good faith efforts'
      ]
    });
  }

  return options;
}

function getHampsteadSpecifics(postcode: string): string[] {
  const outcode = extractOutcode(postcode);
  const specifics: string[] = [];

  // Conservation area impact
  specifics.push('Hampstead conservation areas have many historic properties with established light rights (20+ years)');

  // Property values
  specifics.push('High property values in NW3/NW6/NW8 mean higher compensation claims and greater motivation to pursue');

  // Victorian/Edwardian stock
  specifics.push('Victorian and Edwardian properties often have large windows designed for maximum daylight - sensitive to obstruction');

  // Area-specific
  if (outcode === 'NW3') {
    specifics.push('Hampstead Village: Close-knit community with sophisticated property owners likely to pursue claims');
    specifics.push('Many properties have historic rear additions already - check for prior releases');
  } else if (outcode === 'NW6') {
    specifics.push('West Hampstead: Dense Victorian terraces - rear extensions commonly affect multiple neighbors');
    specifics.push('Loft conversions frequently contested due to overlooking and light impact');
  } else if (outcode === 'NW8') {
    specifics.push('St Johns Wood: Larger plots but high expectations of privacy and light');
    specifics.push('Mansion blocks may have multiple affected units from single development');
  } else if (outcode === 'NW11') {
    specifics.push('Golders Green: Larger gardens provide buffer but multi-storey developments still contested');
  }

  specifics.push('Camden Council does not consider Rights of Light in planning decisions - this is a separate legal matter');
  specifics.push('Local solicitors specializing in Rights of Light include: Boodle Hatfield, Mishcon de Reya, Forsters');

  return specifics;
}

async function assessRightsOfLight(
  address: string,
  postcode: string,
  projectType: string,
  projectDetails: RightsOfLightProject = {}
): Promise<RightsAssessment> {
  const outcode = extractOutcode(postcode);
  const defaultAreaChar = AREA_CHARACTERISTICS['NW3']!;
  const areaChar = AREA_CHARACTERISTICS[outcode] || defaultAreaChar;
  const defaultProjectImpact = PROJECT_IMPACT['rear-extension']!;
  const projectImpact = PROJECT_IMPACT[projectType] || defaultProjectImpact;

  // Assess legal risk
  const riskLevel = assessLegalRisk(postcode, projectType, projectDetails);

  // Get insurance guidance
  const insurance = getInsuranceGuidance(riskLevel.level);

  // Get mitigation options
  const mitigationOptions = getMitigationOptions(riskLevel.level, projectType);

  // Technical analysis
  const technicalAnalysis = {
    basisOfRight: 'Prescription Act 1832 - right acquired after 20 years of uninterrupted light enjoyment',
    testUsed: '50/50 Rule (Percy Allen & Grymes)',
    thresholds: [
      {
        name: '50/50 Rule',
        value: '50% of room receives 1 lumen/sq ft',
        significance: 'Standard for adequate light - rooms falling below are actionably affected'
      },
      {
        name: 'Well-Lit vs Adequately Lit',
        value: 'Grumble line at 0.2% sky factor',
        significance: 'Distinction between comfortable and merely adequate lighting'
      },
      {
        name: 'Materiality Threshold',
        value: 'Generally >3% area loss',
        significance: 'Very minor losses may not be actionable - de minimis'
      }
    ]
  };

  // Affected parties estimate
  const affectedParties = [
    {
      category: 'Directly Adjacent Properties',
      likelyNumber: projectImpact.typicalClaims,
      compensationRange: projectImpact.avgCompensation,
      negotiationApproach: 'Direct approach before works, offer survey evidence and fair compensation'
    }
  ];

  if (riskLevel.level === 'high' || riskLevel.level === 'very-high') {
    affectedParties.push({
      category: 'Properties Further Affected',
      likelyNumber: Math.round(projectImpact.typicalClaims * 0.5),
      compensationRange: '£1,000-5,000',
      negotiationApproach: 'May emerge during or after works - reserve contingency funds'
    });
  }

  // Timeline
  const timeline = [
    {
      phase: 'Initial Assessment',
      duration: '1-2 weeks',
      activities: [
        'Identify potentially affected properties',
        'Review title documents for existing easements',
        'Commission preliminary Rights of Light survey'
      ]
    },
    {
      phase: 'Detailed Survey',
      duration: '2-4 weeks',
      activities: [
        'Full technical survey of affected apertures',
        'Calculation of light loss to each room',
        'Report on actionable infringements'
      ]
    },
    {
      phase: 'Negotiation',
      duration: '4-12 weeks',
      activities: [
        'Approach affected parties with evidence',
        'Negotiate releases and compensation',
        'Obtain legal documentation'
      ]
    },
    {
      phase: 'Resolution',
      duration: 'Variable',
      activities: [
        'Execute deeds of release',
        'Arrange insurance if needed',
        'Proceed with development'
      ]
    }
  ];

  // Costs
  const costs = [
    {
      category: 'Rights of Light Survey',
      range: '£3,000-15,000',
      notes: 'Depends on number of affected properties and complexity'
    },
    {
      category: 'Legal Advice',
      range: '£2,000-10,000',
      notes: 'Property solicitor with Rights of Light experience'
    },
    {
      category: 'Compensation Payments',
      range: projectImpact.avgCompensation,
      notes: 'Based on technical assessment of light loss value'
    },
    {
      category: 'Insurance Premium',
      range: insurance.estimatedPremium,
      notes: 'If insurance approach chosen'
    }
  ];

  // Legal considerations
  const legalConsiderations = [
    'Rights of Light is a property right - planning permission does not authorize infringement',
    'Injunction is possible remedy - can require demolition of infringing structure',
    'Courts increasingly award damages instead of injunctions (Coventry v Lawrence approach)',
    'Time limit: claims must be brought within limitation period (usually 6 years)',
    'Light obstruction notices can be registered to prevent right acquisition',
    'Existing easements may already permit or prohibit development',
    'Lease provisions may affect flat owners\' ability to claim'
  ];

  // Recommendations based on risk level
  const recommendations: string[] = [];
  
  if (riskLevel.level === 'low') {
    recommendations.push('Proceed with standard precautions - risk is manageable');
    recommendations.push('Consider basic Rights of Light insurance for peace of mind');
    recommendations.push('Document existing light conditions before works');
  } else if (riskLevel.level === 'medium') {
    recommendations.push('Commission professional Rights of Light survey before proceeding');
    recommendations.push('Consider approaching affected neighbors proactively');
    recommendations.push('Obtain Rights of Light insurance');
    recommendations.push('Reserve contingency budget of £10,000-20,000');
  } else if (riskLevel.level === 'high') {
    recommendations.push('Essential: Commission full Rights of Light survey immediately');
    recommendations.push('Engage specialist Rights of Light solicitor');
    recommendations.push('Consider design modifications to reduce impact');
    recommendations.push('Negotiate releases with affected parties before planning application');
    recommendations.push('Budget £30,000-50,000 for Rights of Light matters');
  } else {
    recommendations.push('Fundamental review of scheme required - current design carries unacceptable risk');
    recommendations.push('Major design modifications likely necessary');
    recommendations.push('Full professional team: surveyor, architect, solicitor essential');
    recommendations.push('Consider whether project is viable given Rights of Light constraints');
    recommendations.push('Budget £50,000+ for comprehensive rights resolution');
  }

  return {
    address,
    postcode,
    area: `${outcode} - ${areaChar.density} density, typical separation ${areaChar.typicalSeparation}`,
    projectType,
    riskLevel,
    insurance,
    mitigationOptions,
    technicalAnalysis,
    affectedParties,
    timeline,
    costs,
    legalConsiderations,
    recommendations,
    hampsteadSpecifics: getHampsteadSpecifics(postcode)
  };
}

// Export the service
const rightsOfLight = {
  assessRightsOfLight,
  AREA_CHARACTERISTICS,
  PROJECT_IMPACT,
  INSURANCE_GUIDANCE
};

export default rightsOfLight;
