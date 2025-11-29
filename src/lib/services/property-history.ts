/**
 * Property History Service
 * Complete planning and development history for properties
 */

// Planning application status
type ApplicationStatus = 
  | 'pending'
  | 'approved'
  | 'refused'
  | 'withdrawn'
  | 'appealed'
  | 'appeal_allowed'
  | 'appeal_dismissed';

type ApplicationType =
  | 'full_planning'
  | 'householder'
  | 'listed_building'
  | 'conservation_area'
  | 'certificate_lawful'
  | 'prior_approval'
  | 'tree_works'
  | 'advertisement';

// Planning application record
interface PlanningApplication {
  reference: string;
  type: ApplicationType;
  description: string;
  status: ApplicationStatus;
  dateSubmitted: string;
  dateDecided?: string;
  decisionLevel: 'delegated' | 'committee';
  officer: string;
  conditions?: string[];
  refusalReasons?: string[];
  appealRef?: string;
}

// Building control record
interface BuildingControlRecord {
  reference: string;
  type: 'full_plans' | 'building_notice' | 'regularisation';
  description: string;
  status: 'approved' | 'rejected' | 'completed' | 'pending';
  dateSubmitted: string;
  dateCompleted?: string;
  inspector: string;
}

// Historic event
interface HistoricEvent {
  year: number;
  event: string;
  source: string;
  significance: 'high' | 'medium' | 'low';
}

// Property history result
interface PropertyHistory {
  property: {
    address: string;
    postcode: string;
    uprn?: string;
  };
  summary: {
    totalApplications: number;
    approved: number;
    refused: number;
    appealed: number;
    listingHistory: string;
    conservationAreaHistory: string;
    significantWorks: string[];
  };
  planningApplications: PlanningApplication[];
  buildingControl: BuildingControlRecord[];
  historicEvents: HistoricEvent[];
  knownAlterations: {
    period: string;
    works: string;
    approved: boolean;
  }[];
  precedents: {
    applicationRef: string;
    relevance: string;
    outcome: ApplicationStatus;
    keyLearning: string;
  }[];
  riskFactors: {
    factor: string;
    risk: 'low' | 'medium' | 'high';
    explanation: string;
  }[];
}

// Sample planning applications database
const SAMPLE_APPLICATIONS: Record<string, PlanningApplication[]> = {
  'NW3': [
    {
      reference: '2023/4567/HSE',
      type: 'householder',
      description: 'Single storey rear extension with roof lantern',
      status: 'approved',
      dateSubmitted: '2023-06-15',
      dateDecided: '2023-08-20',
      decisionLevel: 'delegated',
      officer: 'J Smith',
      conditions: ['Materials to match existing', 'Landscaping scheme required'],
    },
    {
      reference: '2022/1234/P',
      type: 'full_planning',
      description: 'Basement extension and rear addition',
      status: 'refused',
      dateSubmitted: '2022-03-10',
      dateDecided: '2022-06-15',
      decisionLevel: 'committee',
      officer: 'M Brown',
      refusalReasons: ['Harm to conservation area character', 'Impact on neighbour amenity'],
      appealRef: 'APP/X5210/W/22/1234567',
    },
    {
      reference: '2021/7890/LBC',
      type: 'listed_building',
      description: 'Internal alterations and new rooflights',
      status: 'approved',
      dateSubmitted: '2021-09-01',
      dateDecided: '2021-12-01',
      decisionLevel: 'delegated',
      officer: 'S Wilson',
      conditions: ['Heritage consultant supervision', 'Recording of features'],
    },
  ],
};

// Historic events database
const HISTORIC_EVENTS: Record<string, HistoricEvent[]> = {
  'NW3': [
    { year: 1890, event: 'Original construction of Victorian terraces', source: 'OS Map', significance: 'high' },
    { year: 1920, event: 'Rear extensions added to several properties', source: 'Building records', significance: 'medium' },
    { year: 1967, event: 'Area designated as Conservation Area', source: 'Council records', significance: 'high' },
    { year: 1985, event: 'Article 4 Direction introduced', source: 'Council records', significance: 'high' },
    { year: 2010, event: 'Conservation Area boundary extended', source: 'Council records', significance: 'medium' },
  ],
  'N6': [
    { year: 1800, event: 'Georgian development of High Street', source: 'Historic records', significance: 'high' },
    { year: 1839, event: 'Cemetery established', source: 'Historic records', significance: 'high' },
    { year: 1968, event: 'Conservation Area designated', source: 'Council records', significance: 'high' },
    { year: 2015, event: 'Neighbourhood Plan adopted', source: 'Council records', significance: 'medium' },
  ],
};

export class PropertyHistoryService {
  /**
   * Get comprehensive property history
   */
  getPropertyHistory(input: {
    address: string;
    postcode: string;
    includeAppeals?: boolean;
    includeBuildingControl?: boolean;
    yearsBack?: number;
  }): PropertyHistory {
    const areaPrefix = this.extractAreaPrefix(input.postcode);
    const yearsBack = input.yearsBack ?? 10;
    
    // Get planning applications
    const planningApplications = this.getPlanningApplications(areaPrefix, yearsBack);
    
    // Get building control records
    const buildingControl = input.includeBuildingControl 
      ? this.getBuildingControlRecords(areaPrefix)
      : [];
    
    // Get historic events
    const historicEvents = this.getHistoricEvents(areaPrefix);
    
    // Identify known alterations
    const knownAlterations = this.identifyAlterations(planningApplications);
    
    // Find relevant precedents
    const precedents = this.findPrecedents(planningApplications);
    
    // Assess risk factors
    const riskFactors = this.assessRiskFactors(planningApplications);
    
    // Build summary
    const summary = this.buildSummary(planningApplications, areaPrefix);
    
    return {
      property: {
        address: input.address,
        postcode: input.postcode,
      },
      summary,
      planningApplications,
      buildingControl,
      historicEvents,
      knownAlterations,
      precedents,
      riskFactors,
    };
  }
  
  /**
   * Get recent applications in area
   */
  getRecentAreaApplications(postcode: string, months: number = 12): {
    area: string;
    applications: { type: string; count: number; approvalRate: number }[];
    trends: string[];
  } {
    const areaPrefix = this.extractAreaPrefix(postcode);
    
    // Simulated statistics
    return {
      area: areaPrefix,
      applications: [
        { type: 'Householder', count: 145, approvalRate: 78 },
        { type: 'Listed Building', count: 32, approvalRate: 65 },
        { type: 'Full Planning', count: 67, approvalRate: 62 },
        { type: 'Tree Works', count: 89, approvalRate: 92 },
        { type: 'Certificate Lawful', count: 23, approvalRate: 85 },
      ],
      trends: [
        'Basement applications receiving increased scrutiny',
        'Conservation officer requiring more detail on heritage statements',
        'Committee decisions trending stricter on extensions',
        'Article 4 enforcement being actively pursued',
      ],
    };
  }
  
  /**
   * Search for specific application
   */
  searchApplication(reference: string): PlanningApplication | null {
    for (const area of Object.values(SAMPLE_APPLICATIONS)) {
      const found = area.find(a => a.reference === reference);
      if (found) return found;
    }
    return null;
  }
  
  /**
   * Get planning applications for area
   */
  private getPlanningApplications(areaPrefix: string, yearsBack: number): PlanningApplication[] {
    const applications = SAMPLE_APPLICATIONS[areaPrefix] ?? SAMPLE_APPLICATIONS['NW3'] ?? [];
    
    const cutoffDate = new Date();
    cutoffDate.setFullYear(cutoffDate.getFullYear() - yearsBack);
    
    return applications.filter(a => new Date(a.dateSubmitted) >= cutoffDate);
  }
  
  /**
   * Get building control records
   */
  private getBuildingControlRecords(areaPrefix: string): BuildingControlRecord[] {
    // Simulated building control data
    return [
      {
        reference: `BC/${areaPrefix}/2023/001`,
        type: 'full_plans',
        description: 'Rear extension structural works',
        status: 'completed',
        dateSubmitted: '2023-04-01',
        dateCompleted: '2023-11-15',
        inspector: 'Building Control Team',
      },
      {
        reference: `BC/${areaPrefix}/2022/045`,
        type: 'regularisation',
        description: 'Loft conversion (retrospective)',
        status: 'approved',
        dateSubmitted: '2022-08-20',
        dateCompleted: '2022-10-01',
        inspector: 'Building Control Team',
      },
    ];
  }
  
  /**
   * Get historic events for area
   */
  private getHistoricEvents(areaPrefix: string): HistoricEvent[] {
    return HISTORIC_EVENTS[areaPrefix] ?? HISTORIC_EVENTS['NW3'] ?? [];
  }
  
  /**
   * Identify alterations from applications
   */
  private identifyAlterations(applications: PlanningApplication[]): PropertyHistory['knownAlterations'] {
    return applications
      .filter(a => a.status === 'approved')
      .map(a => ({
        period: new Date(a.dateDecided ?? a.dateSubmitted).getFullYear().toString(),
        works: a.description,
        approved: true,
      }));
  }
  
  /**
   * Find relevant precedents
   */
  private findPrecedents(applications: PlanningApplication[]): PropertyHistory['precedents'] {
    return applications
      .filter(a => a.status === 'approved' || a.status === 'appeal_allowed')
      .slice(0, 5)
      .map(a => ({
        applicationRef: a.reference,
        relevance: this.assessRelevance(a),
        outcome: a.status,
        keyLearning: this.getKeyLearning(a),
      }));
  }
  
  /**
   * Assess relevance of precedent
   */
  private assessRelevance(application: PlanningApplication): string {
    const typeRelevance: Record<ApplicationType, string> = {
      'householder': 'Similar householder extension approved',
      'full_planning': 'Full planning permission granted',
      'listed_building': 'Listed building consent demonstrates approach',
      'conservation_area': 'Conservation area approval sets precedent',
      'certificate_lawful': 'Lawful development certificate establishes rights',
      'prior_approval': 'Prior approval demonstrates permitted development',
      'tree_works': 'Tree works approved in area',
      'advertisement': 'Advertisement consent granted',
    };
    return typeRelevance[application.type] ?? 'Relevant application in area';
  }
  
  /**
   * Get key learning from precedent
   */
  private getKeyLearning(application: PlanningApplication): string {
    if (application.conditions && application.conditions.length > 0) {
      return `Approved with conditions: ${application.conditions[0]}`;
    }
    if (application.status === 'appeal_allowed') {
      return 'Appeal succeeded - inspector found original refusal unreasonable';
    }
    return 'Standard approval - design approach accepted';
  }
  
  /**
   * Assess risk factors from history
   */
  private assessRiskFactors(applications: PlanningApplication[]): PropertyHistory['riskFactors'] {
    const factors: PropertyHistory['riskFactors'] = [];
    
    // Check for refusals
    const refusals = applications.filter(a => a.status === 'refused');
    if (refusals.length > 0) {
      factors.push({
        factor: 'Previous Refusals',
        risk: refusals.length > 2 ? 'high' : 'medium',
        explanation: `${refusals.length} previous application(s) refused at this address`,
      });
    }
    
    // Check for committee decisions
    const committeeDecisions = applications.filter(a => a.decisionLevel === 'committee');
    if (committeeDecisions.length > 0) {
      factors.push({
        factor: 'Committee Attention',
        risk: 'medium',
        explanation: 'Property has received committee scrutiny previously',
      });
    }
    
    // Check for enforcement
    const hasEnforcement = applications.some(a => 
      a.type === 'certificate_lawful' || a.description.toLowerCase().includes('retrospective')
    );
    if (hasEnforcement) {
      factors.push({
        factor: 'Enforcement History',
        risk: 'high',
        explanation: 'Evidence of unauthorised works requiring regularisation',
      });
    }
    
    // Check for LBC applications
    const hasLBC = applications.some(a => a.type === 'listed_building');
    if (hasLBC) {
      factors.push({
        factor: 'Listed Building Status',
        risk: 'medium',
        explanation: 'Previous LBC applications indicate sensitive building',
      });
    }
    
    if (factors.length === 0) {
      factors.push({
        factor: 'Clean History',
        risk: 'low',
        explanation: 'No significant issues identified in planning history',
      });
    }
    
    return factors;
  }
  
  /**
   * Build history summary
   */
  private buildSummary(
    applications: PlanningApplication[],
    areaPrefix: string
  ): PropertyHistory['summary'] {
    const approved = applications.filter(a => a.status === 'approved' || a.status === 'appeal_allowed');
    const refused = applications.filter(a => a.status === 'refused' || a.status === 'appeal_dismissed');
    const appealed = applications.filter(a => a.appealRef);
    
    const significantWorks = approved
      .map(a => `${new Date(a.dateDecided ?? a.dateSubmitted).getFullYear()}: ${a.description}`)
      .slice(0, 5);
    
    const isHampstead = ['NW3', 'NW6', 'NW8'].includes(areaPrefix);
    const isHighgate = ['N6', 'N2', 'N10'].includes(areaPrefix);
    
    return {
      totalApplications: applications.length,
      approved: approved.length,
      refused: refused.length,
      appealed: appealed.length,
      listingHistory: isHampstead 
        ? 'Area contains Grade II and II* listed buildings' 
        : isHighgate 
        ? 'Historic village with significant listed buildings'
        : 'Check individual listing status',
      conservationAreaHistory: isHampstead || isHighgate
        ? 'Within Conservation Area since 1967/1968'
        : 'Verify Conservation Area status',
      significantWorks,
    };
  }
  
  /**
   * Extract area prefix from postcode
   */
  private extractAreaPrefix(postcode: string): string {
    const match = postcode.match(/^(NW\d{1,2}|N\d{1,2})/i);
    return match && match[1] ? match[1].toUpperCase() : 'NW3';
  }
}

// Export singleton
export const propertyHistoryService = new PropertyHistoryService();
