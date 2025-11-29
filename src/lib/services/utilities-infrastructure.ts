/**
 * Utilities Infrastructure Assessment Service
 * 
 * Provides guidance on utility connections and infrastructure
 * requirements for development projects.
 * 
 * Coverage: NW1-NW11, N2, N6, N10 postcodes
 */

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

interface UtilitiesProject {
  projectType?: 'extension' | 'loft' | 'basement' | 'new_build' | 'change_of_use';
  additionalUnits?: number;
  existingSupplyAdequate?: boolean;
  electricHeating?: boolean;
  evCharging?: boolean;
  solarPV?: boolean;
  heatPump?: boolean;
  gasSupplyRequired?: boolean;
  waterDemandIncrease?: 'none' | 'minor' | 'significant';
  drainageChanges?: boolean;
}

interface UtilityConnection {
  utility: string;
  provider: string;
  action: string;
  leadTime: string;
  estimatedCost: string;
  contactProcess: string;
}

interface CapacityAssessment {
  utility: string;
  existingCapacity: string;
  requiredCapacity: string;
  upgradeLikely: boolean;
  notes: string;
}

interface UtilitiesAnalysis {
  summary: UtilitiesSummary;
  electricityAssessment: ElectricityAssessment;
  gasAssessment: GasAssessment;
  waterAssessment: WaterAssessment;
  drainageAssessment: DrainageUtilityAssessment;
  telecoms: TelecomsAssessment;
  renewableIntegration: RenewableIntegration;
  connectionProcess: ConnectionProcess;
  costEstimates: CostEstimates;
  programmeImplications: ProgrammeImplications;
  conclusion: UtilitiesConclusion;
  recommendations: string[];
}

interface UtilitiesSummary {
  overallAssessment: string;
  keyConnections: string[];
  leadTimeIssues: string[];
  costAlerts: string[];
}

interface ElectricityAssessment {
  description: string;
  existingSupply: string;
  proposedDemand: string;
  capacityAssessment: CapacityAssessment;
  connectionType: string;
  dno: string;
  upgradeRequired: boolean;
}

interface GasAssessment {
  description: string;
  existingSupply: string;
  futureRequirement: string;
  recommendation: string;
  provider: string;
}

interface WaterAssessment {
  description: string;
  existingSupply: string;
  proposedDemand: string;
  meterUpgrade: boolean;
  provider: string;
  mainsSizeAdequate: boolean;
}

interface DrainageUtilityAssessment {
  description: string;
  foulDrainage: string;
  surfaceWater: string;
  existingConnection: string;
  upgradeRequired: boolean;
  s104Agreement: boolean;
}

interface TelecomsAssessment {
  description: string;
  broadbandOptions: string[];
  fibreAvailability: string;
  mobileSignal: string;
  recommendations: string[];
}

interface RenewableIntegration {
  description: string;
  solarPV: SolarPVGuidance;
  heatPump: HeatPumpGuidance;
  evCharging: EVChargingGuidance;
  batteryStorage: string;
}

interface SolarPVGuidance {
  gridConnection: string;
  exportArrangement: string;
  dnoCommunication: string;
  requirements: string[];
}

interface HeatPumpGuidance {
  electricalRequirements: string;
  capacityNeeded: string;
  upgradeImplications: string;
}

interface EVChargingGuidance {
  electricalRequirements: string;
  chargingTypes: string[];
  gridImpact: string;
}

interface ConnectionProcess {
  description: string;
  connections: UtilityConnection[];
  sequencing: string[];
}

interface CostEstimates {
  description: string;
  budgetRanges: CostRange[];
  variableFactors: string[];
}

interface CostRange {
  item: string;
  lowEstimate: string;
  highEstimate: string;
  notes: string;
}

interface ProgrammeImplications {
  description: string;
  criticalPath: string[];
  leadTimes: LeadTime[];
}

interface LeadTime {
  activity: string;
  duration: string;
  startTrigger: string;
}

interface UtilitiesConclusion {
  overallAssessment: string;
  feasibility: 'straightforward' | 'manageable' | 'complex';
  criticalActions: string[];
}

// =============================================================================
// UTILITY PROVIDERS DATABASE
// =============================================================================

const LONDON_UTILITIES = {
  electricity: {
    dno: 'UK Power Networks (UKPN)',
    area: 'London Power Networks',
    contact: 'ukpowernetworks.co.uk',
    phone: '0800 029 4285'
  },
  gas: {
    gdn: 'Cadent Gas',
    area: 'North Thames',
    contact: 'cadentgas.com',
    phone: '0800 389 8000'
  },
  water: {
    provider: 'Thames Water',
    area: 'Greater London',
    contact: 'thameswater.co.uk',
    phone: '0800 316 9800'
  }
};

// =============================================================================
// MAIN SERVICE FUNCTION
// =============================================================================

async function assessUtilities(
  address: string,
  postcode: string,
  projectType: string,
  projectDetails: UtilitiesProject = {}
): Promise<UtilitiesAnalysis> {
  const summary = generateSummary(projectDetails);
  const electricityAssessment = assessElectricity(projectDetails);
  const gasAssessment = assessGas(projectDetails);
  const waterAssessment = assessWater(projectDetails);
  const drainageAssessment = assessDrainageUtility(projectDetails);
  const telecoms = assessTelecoms();
  const renewableIntegration = assessRenewables(projectDetails);
  const connectionProcess = getConnectionProcess(projectDetails);
  const costEstimates = estimateCosts(projectDetails);
  const programmeImplications = assessProgramme(projectDetails);
  const conclusion = generateConclusion(summary, projectDetails);
  const recommendations = generateRecommendations(projectDetails);

  return {
    summary,
    electricityAssessment,
    gasAssessment,
    waterAssessment,
    drainageAssessment,
    telecoms,
    renewableIntegration,
    connectionProcess,
    costEstimates,
    programmeImplications,
    conclusion,
    recommendations
  };
}

// =============================================================================
// SUMMARY
// =============================================================================

function generateSummary(projectDetails: UtilitiesProject): UtilitiesSummary {
  const keyConnections: string[] = [];
  const leadTimeIssues: string[] = [];
  const costAlerts: string[] = [];

  if (projectDetails.heatPump || projectDetails.electricHeating) {
    keyConnections.push('Electricity supply upgrade likely');
    leadTimeIssues.push('DNO application: 6-12 weeks');
  }
  if (projectDetails.evCharging) {
    keyConnections.push('EV charging infrastructure');
  }
  if (projectDetails.additionalUnits) {
    keyConnections.push('New utility connections for additional units');
    leadTimeIssues.push('New connection applications: 8-16 weeks');
    costAlerts.push('Budget for utility infrastructure charges');
  }
  if (projectDetails.drainageChanges) {
    keyConnections.push('Drainage connection/modification');
  }

  return {
    overallAssessment: projectDetails.additionalUnits
      ? 'New connections required - early engagement essential'
      : 'Modifications to existing supplies likely sufficient',
    keyConnections: keyConnections.length > 0 ? keyConnections : ['Standard modifications expected'],
    leadTimeIssues: leadTimeIssues.length > 0 ? leadTimeIssues : ['Standard lead times apply'],
    costAlerts: costAlerts.length > 0 ? costAlerts : ['Standard connection charges apply']
  };
}

// =============================================================================
// ELECTRICITY ASSESSMENT
// =============================================================================

function assessElectricity(projectDetails: UtilitiesProject): ElectricityAssessment {
  const hasHighDemand = Boolean(projectDetails.heatPump) || 
                        Boolean(projectDetails.electricHeating) || 
                        Boolean(projectDetails.evCharging);
  const upgradeRequired = hasHighDemand || (projectDetails.additionalUnits || 0) > 0;

  return {
    description: 'Electricity supply assessment',
    existingSupply: 'Typical domestic: Single phase, 60-80A, 100A fuse',
    proposedDemand: hasHighDemand
      ? 'Increased demand - capacity assessment required'
      : 'Within existing capacity likely',
    capacityAssessment: {
      utility: 'Electricity',
      existingCapacity: '14-18 kVA typical domestic',
      requiredCapacity: hasHighDemand
        ? '20-30 kVA with heat pump/EV charging'
        : 'Existing capacity adequate',
      upgradeLikely: upgradeRequired,
      notes: upgradeRequired
        ? 'Apply to DNO for capacity increase'
        : 'Existing supply likely adequate'
    },
    connectionType: upgradeRequired
      ? 'Potential upgrade to 3-phase or higher capacity single phase'
      : 'Existing connection adequate',
    dno: `${LONDON_UTILITIES.electricity.dno} (${LONDON_UTILITIES.electricity.area})`,
    upgradeRequired
  };
}

// =============================================================================
// GAS ASSESSMENT
// =============================================================================

function assessGas(projectDetails: UtilitiesProject): GasAssessment {
  const heatPumpProposed = Boolean(projectDetails.heatPump);

  return {
    description: 'Gas supply assessment',
    existingSupply: 'Existing gas connection assumed',
    futureRequirement: heatPumpProposed
      ? 'Gas may be retained for cooking or discontinued'
      : projectDetails.gasSupplyRequired
        ? 'Gas supply to be maintained/upgraded'
        : 'Existing supply adequate or may be discontinued',
    recommendation: heatPumpProposed
      ? 'Consider full electrification - Future Homes Standard direction'
      : 'Gas boiler replacement with heat pump recommended',
    provider: `${LONDON_UTILITIES.gas.gdn} (${LONDON_UTILITIES.gas.area})`
  };
}

// =============================================================================
// WATER ASSESSMENT
// =============================================================================

function assessWater(projectDetails: UtilitiesProject): WaterAssessment {
  const significantIncrease = projectDetails.waterDemandIncrease === 'significant' ||
                              (projectDetails.additionalUnits || 0) > 0;

  return {
    description: 'Water supply assessment',
    existingSupply: 'Existing mains connection assumed',
    proposedDemand: significantIncrease
      ? 'Significant increase - mains capacity check recommended'
      : 'Within existing capacity',
    meterUpgrade: significantIncrease,
    provider: LONDON_UTILITIES.water.provider,
    mainsSizeAdequate: !significantIncrease
  };
}

// =============================================================================
// DRAINAGE ASSESSMENT
// =============================================================================

function assessDrainageUtility(projectDetails: UtilitiesProject): DrainageUtilityAssessment {
  const additionalConnections = (projectDetails.additionalUnits || 0) > 0;

  return {
    description: 'Drainage infrastructure assessment',
    foulDrainage: 'Connection to public sewer assumed',
    surfaceWater: projectDetails.drainageChanges
      ? 'SuDS approach required for new impermeable areas'
      : 'Existing arrangements continue',
    existingConnection: 'Combined or separate system - survey required',
    upgradeRequired: additionalConnections,
    s104Agreement: additionalConnections
  };
}

// =============================================================================
// TELECOMS ASSESSMENT
// =============================================================================

function assessTelecoms(): TelecomsAssessment {
  return {
    description: 'Telecommunications infrastructure assessment',
    broadbandOptions: [
      'Openreach FTTP (Fibre to Premises) - widely available',
      'Virgin Media cable - good coverage in Hampstead',
      'Community Fibre - expanding in Camden',
      'Hyperoptic - selected buildings'
    ],
    fibreAvailability: 'Full fibre widely available in NW3/NW11 area',
    mobileSignal: 'Good 4G/5G coverage from all major networks',
    recommendations: [
      'Provision Cat6a cabling for internal network',
      'Consider multiple ISP options for redundancy',
      'Install suitable ducting during construction'
    ]
  };
}

// =============================================================================
// RENEWABLES INTEGRATION
// =============================================================================

function assessRenewables(projectDetails: UtilitiesProject): RenewableIntegration {
  return {
    description: 'Renewable energy integration assessment',
    solarPV: {
      gridConnection: projectDetails.solarPV
        ? 'G98/G99 notification/application to DNO required'
        : 'Not applicable',
      exportArrangement: 'Smart Export Guarantee (SEG) registration for export payments',
      dnoCommunication: 'Systems <16A per phase: G98 notification (immediate)',
      requirements: projectDetails.solarPV
        ? ['MCS certified installer', 'G98/G99 compliance', 'Building Regs notification', 'DNO application if >3.68kW']
        : ['Not currently proposed']
    },
    heatPump: {
      electricalRequirements: projectDetails.heatPump
        ? 'Additional 15-20A circuit, potential supply upgrade'
        : 'Not applicable',
      capacityNeeded: '6-12kW typical for Hampstead Victorian property',
      upgradeImplications: 'May trigger DNO supply upgrade application'
    },
    evCharging: {
      electricalRequirements: projectDetails.evCharging
        ? '32A dedicated circuit (7kW charger typical)'
        : 'Not applicable',
      chargingTypes: ['7kW AC (home)', '22kW AC (if 3-phase)', '50kW+ DC (commercial)'],
      gridImpact: 'Load management may be required for multiple vehicles'
    },
    batteryStorage: projectDetails.solarPV
      ? 'Battery storage recommended for self-consumption optimization'
      : 'Can be added independently for arbitrage/backup'
  };
}

// =============================================================================
// CONNECTION PROCESS
// =============================================================================

function getConnectionProcess(projectDetails: UtilitiesProject): ConnectionProcess {
  const connections: UtilityConnection[] = [
    {
      utility: 'Electricity',
      provider: LONDON_UTILITIES.electricity.dno,
      action: projectDetails.heatPump || projectDetails.evCharging ? 'Capacity increase application' : 'Notification only',
      leadTime: '6-12 weeks for upgrade',
      estimatedCost: '£500-£3,000 for upgrade',
      contactProcess: 'Online application via UKPN Connect portal'
    },
    {
      utility: 'Water',
      provider: LONDON_UTILITIES.water.provider,
      action: 'Connection application if new supply',
      leadTime: '4-8 weeks',
      estimatedCost: '£300-£1,500',
      contactProcess: 'Online via Thames Water Developer Services'
    },
    {
      utility: 'Drainage',
      provider: LONDON_UTILITIES.water.provider,
      action: projectDetails.drainageChanges ? 'Build over agreement / connection' : 'As existing',
      leadTime: '4-8 weeks',
      estimatedCost: '£500-£2,000',
      contactProcess: 'Thames Water Build Over team'
    }
  ];

  if (projectDetails.gasSupplyRequired) {
    connections.push({
      utility: 'Gas',
      provider: LONDON_UTILITIES.gas.gdn,
      action: 'Maintain/modify existing',
      leadTime: '2-4 weeks for modification',
      estimatedCost: '£200-£800',
      contactProcess: 'Via gas supplier or Cadent direct'
    });
  }

  return {
    description: 'Utility connection process overview',
    connections,
    sequencing: [
      '1. Early engagement with utilities during design',
      '2. Submit applications 3-4 months before start on site',
      '3. Coordinate trenching/ducting with groundworks',
      '4. Final connections before occupation'
    ]
  };
}

// =============================================================================
// COST ESTIMATES
// =============================================================================

function estimateCosts(projectDetails: UtilitiesProject): CostEstimates {
  const budgetRanges: CostRange[] = [
    {
      item: 'Electricity supply upgrade',
      lowEstimate: '£500',
      highEstimate: '£5,000',
      notes: 'Depends on distance to network/capacity'
    },
    {
      item: 'New electricity connection',
      lowEstimate: '£1,500',
      highEstimate: '£15,000',
      notes: 'Plus infrastructure charge if applicable'
    },
    {
      item: 'Water connection/upgrade',
      lowEstimate: '£300',
      highEstimate: '£2,000',
      notes: 'Standard domestic connection'
    },
    {
      item: 'Drainage connection',
      lowEstimate: '£500',
      highEstimate: '£3,000',
      notes: 'Build over agreement additional'
    },
    {
      item: 'Telecom/fibre installation',
      lowEstimate: '£0',
      highEstimate: '£500',
      notes: 'Often free from providers'
    }
  ];

  return {
    description: 'Utility connection cost estimates',
    budgetRanges,
    variableFactors: [
      'Distance to existing network',
      'Ground conditions and obstructions',
      'Highway works requirements',
      'Concurrent works opportunities',
      'Infrastructure capacity charges'
    ]
  };
}

// =============================================================================
// PROGRAMME IMPLICATIONS
// =============================================================================

function assessProgramme(projectDetails: UtilitiesProject): ProgrammeImplications {
  const leadTimes: LeadTime[] = [
    {
      activity: 'DNO capacity assessment',
      duration: '2-4 weeks',
      startTrigger: 'Detailed design complete'
    },
    {
      activity: 'DNO supply upgrade',
      duration: '6-12 weeks',
      startTrigger: 'Accepted quotation'
    },
    {
      activity: 'Water connection',
      duration: '4-8 weeks',
      startTrigger: 'Application submitted'
    },
    {
      activity: 'Build over agreement',
      duration: '4-8 weeks',
      startTrigger: 'Foundation design finalized'
    }
  ];

  return {
    description: 'Programme implications of utility works',
    criticalPath: [
      'Electricity supply upgrade often critical for heat pump commissioning',
      'Drainage approvals needed before foundation design finalized',
      'Water connection required before testing/handover'
    ],
    leadTimes
  };
}

// =============================================================================
// CONCLUSION
// =============================================================================

function generateConclusion(
  summary: UtilitiesSummary,
  projectDetails: UtilitiesProject
): UtilitiesConclusion {
  const complexity = (projectDetails.additionalUnits || 0) > 0
    ? 'complex'
    : Boolean(projectDetails.heatPump) || Boolean(projectDetails.evCharging)
      ? 'manageable'
      : 'straightforward';

  return {
    overallAssessment: 'Utility connections achievable with early planning',
    feasibility: complexity,
    criticalActions: [
      'Engage with DNO early for capacity assessment',
      'Allow adequate programme time for applications',
      'Coordinate utility installations with construction sequence'
    ]
  };
}

// =============================================================================
// RECOMMENDATIONS
// =============================================================================

function generateRecommendations(projectDetails: UtilitiesProject): string[] {
  const recommendations = [
    'Contact UKPN early if electrical upgrade anticipated',
    'Request utility searches (Linesearch/mains records)',
    'Coordinate utility trenching with landscaping/drives',
    'Allow programme contingency for utility lead times'
  ];

  if (projectDetails.heatPump) {
    recommendations.push('Apply for DNO capacity increase before ordering heat pump');
  }

  if (projectDetails.solarPV) {
    recommendations.push('Use MCS certified installer for SEG eligibility');
    recommendations.push('Submit G98/G99 notification/application to UKPN');
  }

  if (projectDetails.evCharging) {
    recommendations.push('Consider smart charger with load management');
    recommendations.push('Check DNO requirements if multiple charge points');
  }

  recommendations.push('Request Pre-Development Enquiry if significant works');

  return recommendations;
}

// =============================================================================
// EXPORTS
// =============================================================================

const utilitiesInfrastructure = {
  assessUtilities,
  LONDON_UTILITIES
};

export default utilitiesInfrastructure;
