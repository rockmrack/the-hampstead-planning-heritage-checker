/**
 * Permit Tracker Service
 * 
 * Comprehensive tracking of planning permit lifecycle:
 * - Application submission status
 * - Validation tracking
 * - Consultation periods
 * - Officer assignments
 * - Decision timelines
 * - Conditions monitoring
 * - Compliance tracking
 */

// Types
export interface Permit {
  id: string;
  userId: string;
  applicationRef: string;
  propertyAddress: string;
  postcode: string;
  applicationType: ApplicationType;
  status: PermitStatus;
  currentStage: PermitStage;
  stages: StageProgress[];
  keyDates: KeyDates;
  officer?: OfficerInfo;
  consultees: ConsulteeResponse[];
  conditions: PermitCondition[];
  documents: PermitDocument[];
  fees: FeeInfo;
  notes: PermitNote[];
  createdAt: Date;
  updatedAt: Date;
}

export type ApplicationType = 
  | 'full_planning'
  | 'householder'
  | 'listed_building'
  | 'conservation_area'
  | 'prior_approval'
  | 'lawful_development'
  | 'advertisement'
  | 'tree_works'
  | 'discharge_conditions';

export type PermitStatus = 
  | 'draft'
  | 'submitted'
  | 'validated'
  | 'pending_decision'
  | 'approved'
  | 'approved_with_conditions'
  | 'refused'
  | 'withdrawn'
  | 'appealed';

export type PermitStage = 
  | 'preparation'
  | 'submission'
  | 'validation'
  | 'consultation'
  | 'assessment'
  | 'committee'
  | 'decision'
  | 'conditions_discharge'
  | 'completed';

export interface StageProgress {
  stage: PermitStage;
  status: 'not_started' | 'in_progress' | 'completed' | 'skipped';
  startDate?: Date;
  completedDate?: Date;
  estimatedDuration: number; // days
  actualDuration?: number;
  notes?: string;
}

export interface KeyDates {
  submitted?: Date;
  validated?: Date;
  targetDecision?: Date;
  consultationStart?: Date;
  consultationEnd?: Date;
  committeeDate?: Date;
  decisionDate?: Date;
  conditionsDeadline?: Date;
  expiryDate?: Date;
}

export interface OfficerInfo {
  name: string;
  email?: string;
  phone?: string;
  assignedDate: Date;
}

export interface ConsulteeResponse {
  consultee: string;
  type: 'statutory' | 'internal' | 'neighbor' | 'public';
  status: 'pending' | 'received' | 'no_response';
  responseDate?: Date;
  comment?: string;
  recommendation?: 'support' | 'object' | 'neutral';
}

export interface PermitCondition {
  id: string;
  number: number;
  title: string;
  description: string;
  type: 'pre_commencement' | 'pre_occupation' | 'ongoing' | 'informative';
  status: 'pending' | 'submitted' | 'approved' | 'discharged';
  deadline?: Date;
  submittedDate?: Date;
  dischargeRef?: string;
  notes?: string;
}

export interface PermitDocument {
  name: string;
  category: string;
  url: string;
  uploadDate: Date;
  status: 'pending' | 'approved' | 'rejected' | 'revision_required';
}

export interface FeeInfo {
  applicationFee: number;
  paid: boolean;
  paidDate?: Date;
  additionalFees?: { description: string; amount: number; paid: boolean }[];
}

export interface PermitNote {
  id: string;
  author: string;
  content: string;
  timestamp: Date;
  category: 'general' | 'officer_update' | 'user_note' | 'system';
}

export interface PermitSummary {
  totalPermits: number;
  byStatus: Record<PermitStatus, number>;
  byType: Record<ApplicationType, number>;
  avgProcessingDays: number;
  successRate: number;
  pendingDecisions: number;
  upcomingDeadlines: { permit: Permit; deadline: Date; type: string }[];
}

// Sample data
const SAMPLE_PERMITS: Permit[] = [
  {
    id: 'permit-1',
    userId: 'user-1',
    applicationRef: '2024/0123/H',
    propertyAddress: '45 Flask Walk, Hampstead',
    postcode: 'NW3 1HJ',
    applicationType: 'householder',
    status: 'pending_decision',
    currentStage: 'assessment',
    stages: [
      { stage: 'preparation', status: 'completed', startDate: new Date('2024-01-01'), completedDate: new Date('2024-01-10'), estimatedDuration: 14, actualDuration: 10 },
      { stage: 'submission', status: 'completed', startDate: new Date('2024-01-10'), completedDate: new Date('2024-01-10'), estimatedDuration: 1, actualDuration: 1 },
      { stage: 'validation', status: 'completed', startDate: new Date('2024-01-10'), completedDate: new Date('2024-01-15'), estimatedDuration: 5, actualDuration: 5 },
      { stage: 'consultation', status: 'completed', startDate: new Date('2024-01-15'), completedDate: new Date('2024-02-05'), estimatedDuration: 21, actualDuration: 21 },
      { stage: 'assessment', status: 'in_progress', startDate: new Date('2024-02-05'), estimatedDuration: 14 },
      { stage: 'decision', status: 'not_started', estimatedDuration: 7 },
    ],
    keyDates: {
      submitted: new Date('2024-01-10'),
      validated: new Date('2024-01-15'),
      targetDecision: new Date('2024-03-06'),
      consultationStart: new Date('2024-01-15'),
      consultationEnd: new Date('2024-02-05'),
    },
    officer: {
      name: 'Sarah Thompson',
      email: 'sarah.thompson@camden.gov.uk',
      assignedDate: new Date('2024-01-15'),
    },
    consultees: [
      { consultee: 'Conservation Officer', type: 'internal', status: 'received', responseDate: new Date('2024-01-25'), comment: 'Design acceptable', recommendation: 'support' },
      { consultee: 'Tree Officer', type: 'internal', status: 'received', responseDate: new Date('2024-01-30'), comment: 'No trees affected', recommendation: 'neutral' },
      { consultee: '47 Flask Walk', type: 'neighbor', status: 'received', responseDate: new Date('2024-02-01'), comment: 'Concerned about privacy', recommendation: 'object' },
      { consultee: '43 Flask Walk', type: 'neighbor', status: 'no_response' },
      { consultee: 'Hampstead Conservation Area Advisory Committee', type: 'public', status: 'received', responseDate: new Date('2024-02-04'), recommendation: 'support' },
    ],
    conditions: [],
    documents: [
      { name: 'Application Form', category: 'forms', url: '/docs/app-form.pdf', uploadDate: new Date('2024-01-10'), status: 'approved' },
      { name: 'Site Plan', category: 'drawings', url: '/docs/site-plan.pdf', uploadDate: new Date('2024-01-10'), status: 'approved' },
      { name: 'Proposed Plans', category: 'drawings', url: '/docs/proposed.pdf', uploadDate: new Date('2024-01-10'), status: 'approved' },
      { name: 'Heritage Statement', category: 'supporting', url: '/docs/heritage.pdf', uploadDate: new Date('2024-01-10'), status: 'approved' },
    ],
    fees: {
      applicationFee: 258,
      paid: true,
      paidDate: new Date('2024-01-10'),
    },
    notes: [
      { id: 'note-1', author: 'System', content: 'Application submitted successfully', timestamp: new Date('2024-01-10'), category: 'system' },
      { id: 'note-2', author: 'Sarah Thompson', content: 'Site visit scheduled for 20/01/2024', timestamp: new Date('2024-01-16'), category: 'officer_update' },
    ],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-02-05'),
  },
];

// Permit Tracker Service Implementation
class PermitTrackerService {
  private permits: Map<string, Permit> = new Map();

  constructor() {
    // Initialize with sample data
    SAMPLE_PERMITS.forEach(permit => this.permits.set(permit.id, permit));
  }

  /**
   * Get a permit by ID
   */
  async getPermit(permitId: string): Promise<Permit | null> {
    return this.permits.get(permitId) || null;
  }

  /**
   * Get permits for a user
   */
  async getUserPermits(userId: string): Promise<Permit[]> {
    return Array.from(this.permits.values())
      .filter(p => p.userId === userId)
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }

  /**
   * Create a new permit
   */
  async createPermit(data: {
    userId: string;
    propertyAddress: string;
    postcode: string;
    applicationType: ApplicationType;
  }): Promise<Permit> {
    const now = new Date();
    const permitId = `permit-${Date.now()}`;
    
    const permit: Permit = {
      id: permitId,
      userId: data.userId,
      applicationRef: '', // Assigned after submission
      propertyAddress: data.propertyAddress,
      postcode: data.postcode,
      applicationType: data.applicationType,
      status: 'draft',
      currentStage: 'preparation',
      stages: this.getDefaultStages(data.applicationType),
      keyDates: {},
      consultees: [],
      conditions: [],
      documents: [],
      fees: {
        applicationFee: this.calculateFee(data.applicationType),
        paid: false,
      },
      notes: [{
        id: `note-${Date.now()}`,
        author: 'System',
        content: 'Permit created',
        timestamp: now,
        category: 'system',
      }],
      createdAt: now,
      updatedAt: now,
    };

    this.permits.set(permitId, permit);
    return permit;
  }

  /**
   * Update permit status
   */
  async updatePermitStatus(permitId: string, status: PermitStatus, notes?: string): Promise<Permit | null> {
    const permit = this.permits.get(permitId);
    if (!permit) return null;

    const now = new Date();
    permit.status = status;
    permit.updatedAt = now;

    if (notes) {
      permit.notes.push({
        id: `note-${Date.now()}`,
        author: 'System',
        content: notes,
        timestamp: now,
        category: 'system',
      });
    }

    // Update key dates based on status
    switch (status) {
      case 'submitted':
        permit.keyDates.submitted = now;
        permit.currentStage = 'submission';
        break;
      case 'validated':
        permit.keyDates.validated = now;
        permit.currentStage = 'validation';
        // Set target decision date (8 weeks for householder, 13 weeks for major)
        const weeks = permit.applicationType === 'householder' ? 8 : 13;
        permit.keyDates.targetDecision = new Date(now.getTime() + weeks * 7 * 24 * 60 * 60 * 1000);
        break;
      case 'approved':
      case 'approved_with_conditions':
      case 'refused':
        permit.keyDates.decisionDate = now;
        permit.currentStage = 'decision';
        break;
    }

    this.updateStageProgress(permit);
    this.permits.set(permitId, permit);
    return permit;
  }

  /**
   * Add a condition to a permit
   */
  async addCondition(permitId: string, condition: Omit<PermitCondition, 'id' | 'status'>): Promise<Permit | null> {
    const permit = this.permits.get(permitId);
    if (!permit) return null;

    const newCondition: PermitCondition = {
      ...condition,
      id: `cond-${Date.now()}`,
      status: 'pending',
    };

    permit.conditions.push(newCondition);
    permit.updatedAt = new Date();
    this.permits.set(permitId, permit);
    return permit;
  }

  /**
   * Update condition status
   */
  async updateConditionStatus(
    permitId: string, 
    conditionId: string, 
    status: PermitCondition['status'],
    dischargeRef?: string
  ): Promise<Permit | null> {
    const permit = this.permits.get(permitId);
    if (!permit) return null;

    const condition = permit.conditions.find(c => c.id === conditionId);
    if (!condition) return null;

    condition.status = status;
    if (status === 'submitted') {
      condition.submittedDate = new Date();
    }
    if (status === 'discharged' && dischargeRef) {
      condition.dischargeRef = dischargeRef;
    }

    permit.updatedAt = new Date();
    this.permits.set(permitId, permit);
    return permit;
  }

  /**
   * Add consultee response
   */
  async addConsulteeResponse(permitId: string, response: ConsulteeResponse): Promise<Permit | null> {
    const permit = this.permits.get(permitId);
    if (!permit) return null;

    // Check if consultee already exists
    const existingIndex = permit.consultees.findIndex(c => c.consultee === response.consultee);
    if (existingIndex >= 0) {
      permit.consultees[existingIndex] = response;
    } else {
      permit.consultees.push(response);
    }

    permit.updatedAt = new Date();
    this.permits.set(permitId, permit);
    return permit;
  }

  /**
   * Add a note to a permit
   */
  async addNote(permitId: string, author: string, content: string, category: PermitNote['category'] = 'user_note'): Promise<Permit | null> {
    const permit = this.permits.get(permitId);
    if (!permit) return null;

    permit.notes.push({
      id: `note-${Date.now()}`,
      author,
      content,
      timestamp: new Date(),
      category,
    });

    permit.updatedAt = new Date();
    this.permits.set(permitId, permit);
    return permit;
  }

  /**
   * Get permit summary for a user
   */
  async getPermitSummary(userId: string): Promise<PermitSummary> {
    const userPermits = await this.getUserPermits(userId);
    
    const byStatus: Partial<Record<PermitStatus, number>> = {};
    const byType: Partial<Record<ApplicationType, number>> = {};
    let totalProcessingDays = 0;
    let decidedCount = 0;
    let approvedCount = 0;

    const upcomingDeadlines: { permit: Permit; deadline: Date; type: string }[] = [];
    const now = new Date();
    const twoWeeksFromNow = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);

    for (const permit of userPermits) {
      // Count by status
      byStatus[permit.status] = (byStatus[permit.status] || 0) + 1;
      
      // Count by type
      byType[permit.applicationType] = (byType[permit.applicationType] || 0) + 1;

      // Calculate processing time for decided applications
      if (['approved', 'approved_with_conditions', 'refused'].includes(permit.status) && 
          permit.keyDates.submitted && permit.keyDates.decisionDate) {
        const days = Math.floor(
          (permit.keyDates.decisionDate.getTime() - permit.keyDates.submitted.getTime()) / (24 * 60 * 60 * 1000)
        );
        totalProcessingDays += days;
        decidedCount++;
        
        if (['approved', 'approved_with_conditions'].includes(permit.status)) {
          approvedCount++;
        }
      }

      // Check for upcoming deadlines
      if (permit.keyDates.targetDecision && permit.keyDates.targetDecision <= twoWeeksFromNow && permit.status === 'pending_decision') {
        upcomingDeadlines.push({ permit, deadline: permit.keyDates.targetDecision, type: 'Decision Target' });
      }
      if (permit.keyDates.consultationEnd && permit.keyDates.consultationEnd <= twoWeeksFromNow && permit.keyDates.consultationEnd >= now) {
        upcomingDeadlines.push({ permit, deadline: permit.keyDates.consultationEnd, type: 'Consultation End' });
      }
      
      // Check condition deadlines
      for (const condition of permit.conditions) {
        if (condition.deadline && condition.deadline <= twoWeeksFromNow && condition.status === 'pending') {
          upcomingDeadlines.push({ permit, deadline: condition.deadline, type: `Condition ${condition.number}` });
        }
      }
    }

    upcomingDeadlines.sort((a, b) => a.deadline.getTime() - b.deadline.getTime());

    return {
      totalPermits: userPermits.length,
      byStatus: byStatus as Record<PermitStatus, number>,
      byType: byType as Record<ApplicationType, number>,
      avgProcessingDays: decidedCount > 0 ? Math.round(totalProcessingDays / decidedCount) : 0,
      successRate: decidedCount > 0 ? Math.round((approvedCount / decidedCount) * 100) : 0,
      pendingDecisions: userPermits.filter(p => p.status === 'pending_decision').length,
      upcomingDeadlines: upcomingDeadlines.slice(0, 10),
    };
  }

  /**
   * Get permit timeline
   */
  async getPermitTimeline(permitId: string): Promise<{
    events: { date: Date; event: string; type: string }[];
    estimatedCompletion?: Date;
  } | null> {
    const permit = this.permits.get(permitId);
    if (!permit) return null;

    const events: { date: Date; event: string; type: string }[] = [];

    // Add key dates as events
    if (permit.keyDates.submitted) {
      events.push({ date: permit.keyDates.submitted, event: 'Application Submitted', type: 'milestone' });
    }
    if (permit.keyDates.validated) {
      events.push({ date: permit.keyDates.validated, event: 'Application Validated', type: 'milestone' });
    }
    if (permit.keyDates.consultationStart) {
      events.push({ date: permit.keyDates.consultationStart, event: 'Consultation Started', type: 'milestone' });
    }
    if (permit.keyDates.consultationEnd) {
      events.push({ date: permit.keyDates.consultationEnd, event: 'Consultation Ended', type: 'milestone' });
    }
    if (permit.keyDates.decisionDate) {
      events.push({ date: permit.keyDates.decisionDate, event: `Decision: ${permit.status}`, type: 'decision' });
    }

    // Add consultee responses
    for (const consultee of permit.consultees) {
      if (consultee.responseDate) {
        events.push({ 
          date: consultee.responseDate, 
          event: `Response from ${consultee.consultee}`, 
          type: 'consultation' 
        });
      }
    }

    // Add notes
    for (const note of permit.notes) {
      events.push({ date: note.timestamp, event: note.content, type: note.category });
    }

    events.sort((a, b) => a.date.getTime() - b.date.getTime());

    return {
      events,
      estimatedCompletion: permit.keyDates.targetDecision,
    };
  }

  /**
   * Get default stages for application type
   */
  private getDefaultStages(applicationType: ApplicationType): StageProgress[] {
    const baseStages: StageProgress[] = [
      { stage: 'preparation', status: 'in_progress', estimatedDuration: 14 },
      { stage: 'submission', status: 'not_started', estimatedDuration: 1 },
      { stage: 'validation', status: 'not_started', estimatedDuration: 5 },
      { stage: 'consultation', status: 'not_started', estimatedDuration: 21 },
      { stage: 'assessment', status: 'not_started', estimatedDuration: 14 },
      { stage: 'decision', status: 'not_started', estimatedDuration: 7 },
    ];

    // Add committee stage for major applications
    if (['full_planning', 'listed_building'].includes(applicationType)) {
      baseStages.splice(5, 0, { stage: 'committee', status: 'not_started', estimatedDuration: 14 });
    }

    return baseStages;
  }

  /**
   * Update stage progress based on permit status
   */
  private updateStageProgress(permit: Permit): void {
    const now = new Date();
    
    for (const stage of permit.stages) {
      if (stage.stage === permit.currentStage) {
        stage.status = 'in_progress';
        if (!stage.startDate) {
          stage.startDate = now;
        }
      } else if (this.isStageBeforeCurrent(stage.stage, permit.currentStage)) {
        if (stage.status !== 'completed') {
          stage.status = 'completed';
          stage.completedDate = now;
        }
      }
    }
  }

  /**
   * Check if a stage comes before the current stage
   */
  private isStageBeforeCurrent(stage: PermitStage, currentStage: PermitStage): boolean {
    const stageOrder: PermitStage[] = [
      'preparation', 'submission', 'validation', 'consultation', 
      'assessment', 'committee', 'decision', 'conditions_discharge', 'completed'
    ];
    return stageOrder.indexOf(stage) < stageOrder.indexOf(currentStage);
  }

  /**
   * Calculate application fee
   */
  private calculateFee(applicationType: ApplicationType): number {
    const fees: Record<ApplicationType, number> = {
      full_planning: 578,
      householder: 258,
      listed_building: 0,
      conservation_area: 0,
      prior_approval: 120,
      lawful_development: 129,
      advertisement: 154,
      tree_works: 0,
      discharge_conditions: 43,
    };
    return fees[applicationType];
  }

  /**
   * Get processing statistics by area
   */
  async getAreaStatistics(postcode: string): Promise<{
    avgProcessingDays: number;
    successRate: number;
    commonConditions: string[];
    mostActiveOfficers: string[];
  }> {
    const parts = postcode.split(' ');
    const prefix = (parts[0] || 'NW3').toUpperCase();
    
    // Simulated area statistics
    const stats: Record<string, { avgDays: number; successRate: number }> = {
      'NW3': { avgDays: 52, successRate: 78 },
      'NW1': { avgDays: 48, successRate: 82 },
      'NW5': { avgDays: 45, successRate: 85 },
      'NW6': { avgDays: 47, successRate: 80 },
      'N6': { avgDays: 55, successRate: 72 },
      'default': { avgDays: 50, successRate: 78 },
    };

    const areaStats = stats[prefix] ?? stats['default']!;

    return {
      avgProcessingDays: areaStats.avgDays,
      successRate: areaStats.successRate,
      commonConditions: [
        'Materials to match existing',
        'Construction hours restriction',
        'Tree protection measures',
        'Obscure glazing to rear windows',
        'Landscaping scheme required',
      ],
      mostActiveOfficers: [
        'Sarah Thompson',
        'James Wilson',
        'Emily Chen',
      ],
    };
  }
}

// Export singleton instance
export const permitTrackerService = new PermitTrackerService();
