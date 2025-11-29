/**
 * Real-Time Planning Application Tracker
 * 
 * Monitors and tracks planning application status with:
 * - Status updates and notifications
 * - Timeline visualization
 * - Document tracking
 * - Officer communication logging
 * - Milestone predictions
 * 
 * @module services/application-tracker
 */

// ===========================================
// TYPES
// ===========================================

export type ApplicationStatus = 
  | 'draft'
  | 'submitted'
  | 'validated'
  | 'consultation'
  | 'assessment'
  | 'committee'
  | 'decision'
  | 'approved'
  | 'refused'
  | 'withdrawn'
  | 'appeal';

export type MilestoneType =
  | 'submission'
  | 'validation'
  | 'consultation_start'
  | 'consultation_end'
  | 'site_visit'
  | 'officer_report'
  | 'committee_date'
  | 'decision'
  | 'conditions_discharge'
  | 'appeal_lodged'
  | 'appeal_decision';

export interface TrackedApplication {
  id: string;
  reference: string;
  address: string;
  postcode: string;
  description: string;
  applicationType: string;
  submittedDate: Date;
  validatedDate?: Date;
  targetDecisionDate: Date;
  actualDecisionDate?: Date;
  status: ApplicationStatus;
  decision?: 'approved' | 'refused' | 'withdrawn';
  conditions?: ApplicationCondition[];
  officer?: OfficerInfo;
  milestones: Milestone[];
  documents: ApplicationDocument[];
  communications: Communication[];
  alerts: ApplicationAlert[];
  borough: string;
  ward: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Milestone {
  id: string;
  type: MilestoneType;
  title: string;
  description?: string;
  scheduledDate?: Date;
  completedDate?: Date;
  status: 'pending' | 'in_progress' | 'completed' | 'delayed' | 'skipped';
  notes?: string;
}

export interface ApplicationCondition {
  id: string;
  number: number;
  description: string;
  type: 'pre_commencement' | 'pre_occupation' | 'ongoing' | 'informative';
  discharged: boolean;
  dischargedDate?: Date;
  notes?: string;
}

export interface OfficerInfo {
  name: string;
  email?: string;
  phone?: string;
  lastContact?: Date;
}

export interface ApplicationDocument {
  id: string;
  name: string;
  type: 'drawing' | 'statement' | 'report' | 'photograph' | 'form' | 'other';
  status: 'draft' | 'submitted' | 'accepted' | 'rejected' | 'amended';
  uploadedDate: Date;
  url?: string;
  notes?: string;
}

export interface Communication {
  id: string;
  type: 'email' | 'phone' | 'letter' | 'meeting' | 'portal';
  direction: 'incoming' | 'outgoing';
  date: Date;
  summary: string;
  details?: string;
  attachments?: string[];
  actionRequired?: boolean;
  actionDeadline?: Date;
}

export interface ApplicationAlert {
  id: string;
  type: 'deadline' | 'action_required' | 'status_change' | 'document_request' | 'consultation' | 'decision';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  title: string;
  message: string;
  createdAt: Date;
  readAt?: Date;
  actionUrl?: string;
}

export interface ApplicationTimeline {
  totalDays: number;
  elapsedDays: number;
  remainingDays: number;
  percentComplete: number;
  onTrack: boolean;
  predictedDecisionDate: Date;
  confidence: number;
  stages: TimelineStage[];
}

export interface TimelineStage {
  name: string;
  status: 'completed' | 'current' | 'upcoming' | 'delayed';
  startDate?: Date;
  endDate?: Date;
  expectedDuration: number;
  actualDuration?: number;
  description: string;
}

export interface ApplicationStats {
  totalApplications: number;
  byStatus: Record<ApplicationStatus, number>;
  averageDecisionTime: number;
  approvalRate: number;
  pendingActions: number;
}

// ===========================================
// STANDARD TIMELINES
// ===========================================

const STANDARD_TIMELINES: Record<string, number> = {
  'householder': 56, // 8 weeks
  'full': 91, // 13 weeks
  'listed_building': 56, // 8 weeks
  'conservation_area': 56, // 8 weeks
  'prior_approval': 42, // 6 weeks
  'lawful_development': 56, // 8 weeks
  'tree_works': 42, // 6 weeks
  'advertisement': 56, // 8 weeks
  'change_of_use': 56, // 8 weeks
  'major': 91, // 13 weeks (or 16 weeks if EIA)
};

const STAGE_DURATIONS = {
  validation: 5,
  consultation: 21,
  assessment: 14,
  officer_report: 7,
  committee: 14,
  decision: 7,
} as const;

// ===========================================
// APPLICATION TRACKER SERVICE
// ===========================================

class ApplicationTrackerService {
  private applications: Map<string, TrackedApplication> = new Map();
  
  /**
   * Create a new tracked application
   */
  createApplication(data: {
    reference: string;
    address: string;
    postcode: string;
    description: string;
    applicationType: string;
    submittedDate: Date;
    borough: string;
    ward: string;
    userId: string;
  }): TrackedApplication {
    const id = `app-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const standardTime = STANDARD_TIMELINES[data.applicationType] || 56;
    const targetDate = new Date(data.submittedDate);
    targetDate.setDate(targetDate.getDate() + standardTime);
    
    const application: TrackedApplication = {
      id,
      reference: data.reference,
      address: data.address,
      postcode: data.postcode,
      description: data.description,
      applicationType: data.applicationType,
      submittedDate: data.submittedDate,
      targetDecisionDate: targetDate,
      status: 'submitted',
      milestones: this.generateMilestones(data.submittedDate, data.applicationType),
      documents: [],
      communications: [],
      alerts: [],
      borough: data.borough,
      ward: data.ward,
      userId: data.userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    this.applications.set(id, application);
    return application;
  }
  
  /**
   * Generate standard milestones for an application
   */
  private generateMilestones(submittedDate: Date, applicationType: string): Milestone[] {
    const milestones: Milestone[] = [];
    let currentDate = new Date(submittedDate);
    
    // Submission
    milestones.push({
      id: 'milestone-1',
      type: 'submission',
      title: 'Application Submitted',
      status: 'completed',
      completedDate: submittedDate,
    });
    
    // Validation (typically 5 working days)
    currentDate.setDate(currentDate.getDate() + STAGE_DURATIONS.validation);
    milestones.push({
      id: 'milestone-2',
      type: 'validation',
      title: 'Application Validated',
      description: 'Council confirms all documents received and fees paid',
      scheduledDate: new Date(currentDate),
      status: 'pending',
    });
    
    // Consultation Start
    milestones.push({
      id: 'milestone-3',
      type: 'consultation_start',
      title: 'Consultation Period Starts',
      description: 'Neighbors and consultees notified',
      scheduledDate: new Date(currentDate),
      status: 'pending',
    });
    
    // Consultation End (typically 21 days)
    currentDate.setDate(currentDate.getDate() + STAGE_DURATIONS.consultation);
    milestones.push({
      id: 'milestone-4',
      type: 'consultation_end',
      title: 'Consultation Period Ends',
      description: 'Deadline for comments from neighbors and consultees',
      scheduledDate: new Date(currentDate),
      status: 'pending',
    });
    
    // Site Visit (usually during consultation)
    const siteVisitDate = new Date(submittedDate);
    siteVisitDate.setDate(siteVisitDate.getDate() + STAGE_DURATIONS.validation + 14);
    milestones.push({
      id: 'milestone-5',
      type: 'site_visit',
      title: 'Site Visit',
      description: 'Planning officer visits the property',
      scheduledDate: siteVisitDate,
      status: 'pending',
    });
    
    // Officer Report
    currentDate.setDate(currentDate.getDate() + STAGE_DURATIONS.officer_report);
    milestones.push({
      id: 'milestone-6',
      type: 'officer_report',
      title: 'Officer Report Prepared',
      description: 'Case officer prepares recommendation',
      scheduledDate: new Date(currentDate),
      status: 'pending',
    });
    
    // Decision (for delegated decisions)
    currentDate.setDate(currentDate.getDate() + STAGE_DURATIONS.decision);
    milestones.push({
      id: 'milestone-7',
      type: 'decision',
      title: 'Decision Issued',
      description: 'Planning decision published',
      scheduledDate: new Date(currentDate),
      status: 'pending',
    });
    
    return milestones;
  }
  
  /**
   * Update application status
   */
  updateStatus(applicationId: string, newStatus: ApplicationStatus, notes?: string): TrackedApplication | null {
    const app = this.applications.get(applicationId);
    if (!app) return null;
    
    const previousStatus = app.status;
    app.status = newStatus;
    app.updatedAt = new Date();
    
    // Create alert for status change
    app.alerts.push({
      id: `alert-${Date.now()}`,
      type: 'status_change',
      priority: 'high',
      title: 'Application Status Updated',
      message: `Status changed from "${previousStatus}" to "${newStatus}"${notes ? `: ${notes}` : ''}`,
      createdAt: new Date(),
    });
    
    // Update milestones based on status
    this.updateMilestonesForStatus(app, newStatus);
    
    return app;
  }
  
  /**
   * Update milestones when status changes
   */
  private updateMilestonesForStatus(app: TrackedApplication, status: ApplicationStatus): void {
    switch (status) {
      case 'validated':
        app.validatedDate = new Date();
        const validationMilestone = app.milestones.find(m => m.type === 'validation');
        if (validationMilestone) {
          validationMilestone.status = 'completed';
          validationMilestone.completedDate = new Date();
        }
        break;
        
      case 'consultation':
        const consultStartMilestone = app.milestones.find(m => m.type === 'consultation_start');
        if (consultStartMilestone) {
          consultStartMilestone.status = 'completed';
          consultStartMilestone.completedDate = new Date();
        }
        break;
        
      case 'assessment':
        const consultEndMilestone = app.milestones.find(m => m.type === 'consultation_end');
        if (consultEndMilestone) {
          consultEndMilestone.status = 'completed';
          consultEndMilestone.completedDate = new Date();
        }
        break;
        
      case 'approved':
      case 'refused':
        app.actualDecisionDate = new Date();
        app.decision = status === 'approved' ? 'approved' : 'refused';
        const decisionMilestone = app.milestones.find(m => m.type === 'decision');
        if (decisionMilestone) {
          decisionMilestone.status = 'completed';
          decisionMilestone.completedDate = new Date();
        }
        break;
    }
  }
  
  /**
   * Add a document to the application
   */
  addDocument(applicationId: string, document: Omit<ApplicationDocument, 'id'>): TrackedApplication | null {
    const app = this.applications.get(applicationId);
    if (!app) return null;
    
    app.documents.push({
      ...document,
      id: `doc-${Date.now()}`,
    });
    app.updatedAt = new Date();
    
    return app;
  }
  
  /**
   * Log a communication
   */
  logCommunication(applicationId: string, communication: Omit<Communication, 'id'>): TrackedApplication | null {
    const app = this.applications.get(applicationId);
    if (!app) return null;
    
    app.communications.push({
      ...communication,
      id: `comm-${Date.now()}`,
    });
    app.updatedAt = new Date();
    
    // Create alert if action required
    if (communication.actionRequired) {
      app.alerts.push({
        id: `alert-${Date.now()}`,
        type: 'action_required',
        priority: 'high',
        title: 'Action Required',
        message: `Response needed: ${communication.summary}`,
        createdAt: new Date(),
      });
    }
    
    return app;
  }
  
  /**
   * Get application timeline
   */
  getTimeline(applicationId: string): ApplicationTimeline | null {
    const app = this.applications.get(applicationId);
    if (!app) return null;
    
    const now = new Date();
    const submitted = new Date(app.submittedDate);
    const target = new Date(app.targetDecisionDate);
    
    const totalDays = Math.ceil((target.getTime() - submitted.getTime()) / (1000 * 60 * 60 * 24));
    const elapsedDays = Math.ceil((now.getTime() - submitted.getTime()) / (1000 * 60 * 60 * 24));
    const remainingDays = Math.max(0, totalDays - elapsedDays);
    const percentComplete = Math.min(100, Math.round((elapsedDays / totalDays) * 100));
    
    // Predict decision date based on current progress
    const predictedDate = this.predictDecisionDate(app);
    const onTrack = predictedDate <= target;
    
    // Generate stages
    const stages = this.generateTimelineStages(app);
    
    return {
      totalDays,
      elapsedDays,
      remainingDays,
      percentComplete,
      onTrack,
      predictedDecisionDate: predictedDate,
      confidence: this.calculatePredictionConfidence(app),
      stages,
    };
  }
  
  /**
   * Predict decision date
   */
  private predictDecisionDate(app: TrackedApplication): Date {
    // Simple prediction based on milestones
    const completedMilestones = app.milestones.filter(m => m.status === 'completed');
    const lastCompleted = completedMilestones[completedMilestones.length - 1];
    
    if (app.status === 'approved' || app.status === 'refused') {
      return app.actualDecisionDate || new Date();
    }
    
    // Calculate average delay
    let totalDelay = 0;
    let delayCount = 0;
    
    for (const milestone of completedMilestones) {
      if (milestone.scheduledDate && milestone.completedDate) {
        const delay = (milestone.completedDate.getTime() - milestone.scheduledDate.getTime()) / (1000 * 60 * 60 * 24);
        totalDelay += delay;
        delayCount++;
      }
    }
    
    const averageDelay = delayCount > 0 ? totalDelay / delayCount : 0;
    
    // Apply delay to target date
    const predictedDate = new Date(app.targetDecisionDate);
    predictedDate.setDate(predictedDate.getDate() + Math.round(averageDelay));
    
    return predictedDate;
  }
  
  /**
   * Calculate prediction confidence
   */
  private calculatePredictionConfidence(app: TrackedApplication): number {
    const completedMilestones = app.milestones.filter(m => m.status === 'completed').length;
    const totalMilestones = app.milestones.length;
    
    // More completed milestones = higher confidence
    const progressConfidence = (completedMilestones / totalMilestones) * 50;
    
    // Check if on schedule
    const now = new Date();
    const expected = this.getExpectedMilestoneCount(app.submittedDate, now, app.applicationType);
    const scheduleScore = completedMilestones >= expected ? 30 : 15;
    
    // Base confidence
    const baseConfidence = 20;
    
    return Math.min(95, baseConfidence + progressConfidence + scheduleScore);
  }
  
  /**
   * Get expected milestone count for a date
   */
  private getExpectedMilestoneCount(submitted: Date, now: Date, type: string): number {
    const daysSinceSubmission = Math.ceil((now.getTime() - submitted.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysSinceSubmission < 5) return 1; // Just submission
    if (daysSinceSubmission < 10) return 2; // + validation
    if (daysSinceSubmission < 30) return 4; // + consultation start, site visit
    if (daysSinceSubmission < 45) return 5; // + consultation end
    return 6; // + officer report
  }
  
  /**
   * Generate timeline stages
   */
  private generateTimelineStages(app: TrackedApplication): TimelineStage[] {
    const stages: TimelineStage[] = [
      {
        name: 'Submission',
        status: 'completed',
        startDate: app.submittedDate,
        endDate: app.submittedDate,
        expectedDuration: 0,
        actualDuration: 0,
        description: 'Application submitted to the council',
      },
      {
        name: 'Validation',
        status: app.validatedDate ? 'completed' : app.status === 'submitted' ? 'current' : 'upcoming',
        startDate: app.submittedDate,
        endDate: app.validatedDate,
        expectedDuration: STAGE_DURATIONS.validation,
        actualDuration: app.validatedDate 
          ? Math.ceil((app.validatedDate.getTime() - app.submittedDate.getTime()) / (1000 * 60 * 60 * 24))
          : undefined,
        description: 'Council checks documents and fees',
      },
      {
        name: 'Consultation',
        status: app.status === 'consultation' ? 'current' : 
               ['assessment', 'committee', 'decision', 'approved', 'refused'].includes(app.status) ? 'completed' : 'upcoming',
        expectedDuration: STAGE_DURATIONS.consultation,
        description: 'Neighbors and consultees provide comments',
      },
      {
        name: 'Assessment',
        status: app.status === 'assessment' ? 'current' :
               ['committee', 'decision', 'approved', 'refused'].includes(app.status) ? 'completed' : 'upcoming',
        expectedDuration: STAGE_DURATIONS.assessment + STAGE_DURATIONS.officer_report,
        description: 'Planning officer assesses the application',
      },
      {
        name: 'Decision',
        status: ['approved', 'refused'].includes(app.status) ? 'completed' :
               app.status === 'decision' ? 'current' : 'upcoming',
        endDate: app.actualDecisionDate,
        expectedDuration: STAGE_DURATIONS.decision,
        description: 'Decision issued by the council',
      },
    ];
    
    return stages;
  }
  
  /**
   * Get pending alerts for an application
   */
  getPendingAlerts(applicationId: string): ApplicationAlert[] {
    const app = this.applications.get(applicationId);
    if (!app) return [];
    
    return app.alerts.filter(alert => !alert.readAt);
  }
  
  /**
   * Mark alert as read
   */
  markAlertRead(applicationId: string, alertId: string): void {
    const app = this.applications.get(applicationId);
    if (!app) return;
    
    const alert = app.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.readAt = new Date();
    }
  }
  
  /**
   * Get application by ID
   */
  getApplication(applicationId: string): TrackedApplication | null {
    return this.applications.get(applicationId) || null;
  }
  
  /**
   * Get all applications for a user
   */
  getUserApplications(userId: string): TrackedApplication[] {
    return Array.from(this.applications.values())
      .filter(app => app.userId === userId)
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }
  
  /**
   * Get application statistics for a user
   */
  getUserStats(userId: string): ApplicationStats {
    const apps = this.getUserApplications(userId);
    
    const byStatus: Record<ApplicationStatus, number> = {
      draft: 0,
      submitted: 0,
      validated: 0,
      consultation: 0,
      assessment: 0,
      committee: 0,
      decision: 0,
      approved: 0,
      refused: 0,
      withdrawn: 0,
      appeal: 0,
    };
    
    let totalDecisionDays = 0;
    let decisionCount = 0;
    let approvedCount = 0;
    let pendingActions = 0;
    
    for (const app of apps) {
      byStatus[app.status]++;
      
      if (app.actualDecisionDate) {
        const days = Math.ceil(
          (app.actualDecisionDate.getTime() - app.submittedDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        totalDecisionDays += days;
        decisionCount++;
        
        if (app.decision === 'approved') {
          approvedCount++;
        }
      }
      
      // Count pending actions from alerts
      pendingActions += app.alerts.filter(a => !a.readAt && a.type === 'action_required').length;
    }
    
    return {
      totalApplications: apps.length,
      byStatus,
      averageDecisionTime: decisionCount > 0 ? Math.round(totalDecisionDays / decisionCount) : 0,
      approvalRate: decisionCount > 0 ? Math.round((approvedCount / decisionCount) * 100) : 0,
      pendingActions,
    };
  }
  
  /**
   * Check for deadline alerts
   */
  checkDeadlines(): ApplicationAlert[] {
    const alerts: ApplicationAlert[] = [];
    const now = new Date();
    const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
    
    for (const app of Array.from(this.applications.values())) {
      // Check target decision date
      if (app.status !== 'approved' && app.status !== 'refused' && app.status !== 'withdrawn') {
        const targetDate = new Date(app.targetDecisionDate);
        
        if (targetDate <= now) {
          alerts.push({
            id: `deadline-${app.id}-${Date.now()}`,
            type: 'deadline',
            priority: 'urgent',
            title: 'Target Decision Date Passed',
            message: `Application ${app.reference} has passed its target decision date`,
            createdAt: now,
          });
        } else if (targetDate <= threeDaysFromNow) {
          alerts.push({
            id: `deadline-${app.id}-${Date.now()}`,
            type: 'deadline',
            priority: 'high',
            title: 'Decision Due Soon',
            message: `Application ${app.reference} is due for a decision within 3 days`,
            createdAt: now,
          });
        }
      }
      
      // Check for pending actions with deadlines
      for (const comm of app.communications) {
        if (comm.actionRequired && comm.actionDeadline && !comm.actionDeadline) {
          const deadline = new Date(comm.actionDeadline);
          if (deadline <= threeDaysFromNow) {
            alerts.push({
              id: `action-${app.id}-${Date.now()}`,
              type: 'action_required',
              priority: deadline <= now ? 'urgent' : 'high',
              title: 'Action Deadline Approaching',
              message: `Action required for ${app.reference}: ${comm.summary}`,
              createdAt: now,
              actionUrl: `/tracker/${app.id}`,
            });
          }
        }
      }
    }
    
    return alerts;
  }
  
  /**
   * Import application from council portal
   */
  async importFromPortal(portalUrl: string, userId: string): Promise<TrackedApplication | null> {
    // This would integrate with council planning portals
    // For now, we'll simulate the import
    console.log('Importing application from:', portalUrl);
    
    // Extract reference from URL (simplified)
    const refMatch = portalUrl.match(/reference=([A-Z0-9/]+)/i);
    const reference = refMatch?.[1] ?? `IMPORT-${Date.now()}`;
    
    // In a real implementation, this would scrape or API-call the portal
    // For demo purposes, create a sample application
    return this.createApplication({
      reference,
      address: 'Imported Address',
      postcode: 'NW3 1AA',
      description: 'Imported application',
      applicationType: 'householder',
      submittedDate: new Date(),
      borough: 'Camden',
      ward: 'Hampstead Town',
      userId,
    });
  }
}

// Export singleton
export const applicationTracker = new ApplicationTrackerService();
