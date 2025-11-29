/**
 * Application Tracking System
 * Track planning applications through the approval process
 */

export interface TrackedApplication {
  id: string;
  userId: string;
  
  // Application details
  reference: string;
  councilReference?: string;
  applicationType: ApplicationType;
  
  // Property
  propertyAddress: string;
  postcode: string;
  borough: string;
  uprn?: string;
  
  // Project
  projectType: string;
  description: string;
  
  // Status
  status: ApplicationStatus;
  statusHistory: StatusHistoryEntry[];
  
  // Dates
  submittedDate?: string;
  validatedDate?: string;
  targetDate?: string;
  decisionDate?: string;
  
  // Documents
  documents: ApplicationDocument[];
  
  // Consultation
  consultationEndDate?: string;
  publicComments: PublicComment[];
  
  // Decision
  decision?: ApplicationDecision;
  conditions?: string[];
  
  // Alerts
  alerts: ApplicationAlert[];
  
  // Metadata
  createdAt: string;
  updatedAt: string;
}

export type ApplicationType = 
  | 'householder'
  | 'prior-approval'
  | 'full-planning'
  | 'listed-building-consent'
  | 'certificate-lawful-development'
  | 'advertisement-consent'
  | 'tree-works';

export type ApplicationStatus =
  | 'draft'
  | 'ready-to-submit'
  | 'submitted'
  | 'registered'
  | 'validated'
  | 'consultation'
  | 'assessment'
  | 'committee-referral'
  | 'committee-scheduled'
  | 'decided'
  | 'appeal'
  | 'withdrawn'
  | 'lapsed';

export interface StatusHistoryEntry {
  status: ApplicationStatus;
  date: string;
  note?: string;
  source: 'system' | 'council' | 'user';
}

export interface ApplicationDocument {
  id: string;
  name: string;
  type: DocumentType;
  status: 'draft' | 'final' | 'submitted' | 'rejected';
  url?: string;
  uploadedAt: string;
  fileSize?: number;
  rejectionReason?: string;
}

export type DocumentType =
  | 'application-form'
  | 'site-plan'
  | 'block-plan'
  | 'floor-plans-existing'
  | 'floor-plans-proposed'
  | 'elevations-existing'
  | 'elevations-proposed'
  | 'heritage-statement'
  | 'design-access-statement'
  | 'tree-survey'
  | 'flood-risk-assessment'
  | 'other';

export interface PublicComment {
  date: string;
  name?: string;
  address?: string;
  sentiment: 'support' | 'object' | 'neutral';
  summary: string;
  fullText?: string;
}

export type ApplicationDecision = 
  | 'approved'
  | 'approved-with-conditions'
  | 'refused'
  | 'withdrawn'
  | 'invalid'
  | 'permitted-development';

export interface ApplicationAlert {
  id: string;
  type: AlertType;
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'urgent';
  createdAt: string;
  readAt?: string;
  actionRequired: boolean;
  actionDeadline?: string;
}

export type AlertType =
  | 'status-change'
  | 'consultation-ending'
  | 'document-rejected'
  | 'additional-info-requested'
  | 'decision-made'
  | 'deadline-approaching'
  | 'objection-received'
  | 'committee-date-set';

// ===========================================
// STATUS DISPLAY CONFIG
// ===========================================

export const STATUS_CONFIG: Record<ApplicationStatus, {
  label: string;
  color: string;
  description: string;
  icon: string;
}> = {
  'draft': {
    label: 'Draft',
    color: 'gray',
    description: 'Application is being prepared',
    icon: '📝',
  },
  'ready-to-submit': {
    label: 'Ready to Submit',
    color: 'blue',
    description: 'All documents uploaded, ready for submission',
    icon: '✅',
  },
  'submitted': {
    label: 'Submitted',
    color: 'blue',
    description: 'Application submitted to council',
    icon: '📤',
  },
  'registered': {
    label: 'Registered',
    color: 'blue',
    description: 'Council has registered the application',
    icon: '📋',
  },
  'validated': {
    label: 'Validated',
    color: 'green',
    description: 'Application is valid and being processed',
    icon: '✓',
  },
  'consultation': {
    label: 'Consultation',
    color: 'amber',
    description: 'Public consultation period active',
    icon: '💬',
  },
  'assessment': {
    label: 'Under Assessment',
    color: 'purple',
    description: 'Case officer is assessing the application',
    icon: '🔍',
  },
  'committee-referral': {
    label: 'Committee Referral',
    color: 'amber',
    description: 'Referred to planning committee for decision',
    icon: '👥',
  },
  'committee-scheduled': {
    label: 'Committee Scheduled',
    color: 'amber',
    description: 'Scheduled for planning committee meeting',
    icon: '📅',
  },
  'decided': {
    label: 'Decided',
    color: 'green',
    description: 'Decision has been made',
    icon: '⚖️',
  },
  'appeal': {
    label: 'Appeal',
    color: 'red',
    description: 'Appeal in progress',
    icon: '⚠️',
  },
  'withdrawn': {
    label: 'Withdrawn',
    color: 'gray',
    description: 'Application has been withdrawn',
    icon: '↩️',
  },
  'lapsed': {
    label: 'Lapsed',
    color: 'gray',
    description: 'Application has lapsed',
    icon: '⏰',
  },
};

// ===========================================
// APPLICATION SERVICE
// ===========================================

export class ApplicationTracker {
  private applications: Map<string, TrackedApplication> = new Map();

  /**
   * Create a new tracked application
   */
  createApplication(input: {
    userId: string;
    propertyAddress: string;
    postcode: string;
    borough: string;
    projectType: string;
    description: string;
    applicationType: ApplicationType;
  }): TrackedApplication {
    const id = this.generateId();
    const reference = this.generateReference();
    const now = new Date().toISOString();

    const application: TrackedApplication = {
      id,
      userId: input.userId,
      reference,
      applicationType: input.applicationType,
      propertyAddress: input.propertyAddress,
      postcode: input.postcode,
      borough: input.borough,
      projectType: input.projectType,
      description: input.description,
      status: 'draft',
      statusHistory: [{
        status: 'draft',
        date: now,
        note: 'Application created',
        source: 'system',
      }],
      documents: [],
      publicComments: [],
      alerts: [],
      createdAt: now,
      updatedAt: now,
    };

    this.applications.set(id, application);
    return application;
  }

  /**
   * Update application status
   */
  updateStatus(
    applicationId: string,
    newStatus: ApplicationStatus,
    note?: string,
    source: StatusHistoryEntry['source'] = 'system'
  ): TrackedApplication | null {
    const application = this.applications.get(applicationId);
    if (!application) return null;

    const now = new Date().toISOString();

    application.status = newStatus;
    application.statusHistory.push({
      status: newStatus,
      date: now,
      note,
      source,
    });
    application.updatedAt = now;

    // Create alert for status change
    application.alerts.push({
      id: this.generateId(),
      type: 'status-change',
      title: 'Status Updated',
      message: `Your application status has changed to: ${STATUS_CONFIG[newStatus].label}`,
      severity: 'info',
      createdAt: now,
      actionRequired: false,
    });

    return application;
  }

  /**
   * Add document to application
   */
  addDocument(
    applicationId: string,
    document: Omit<ApplicationDocument, 'id' | 'uploadedAt'>
  ): ApplicationDocument | null {
    const application = this.applications.get(applicationId);
    if (!application) return null;

    const now = new Date().toISOString();
    const newDocument: ApplicationDocument = {
      ...document,
      id: this.generateId(),
      uploadedAt: now,
    };

    application.documents.push(newDocument);
    application.updatedAt = now;

    // Check if all required documents are uploaded
    this.checkDocumentCompleteness(application);

    return newDocument;
  }

  /**
   * Link council reference
   */
  linkCouncilReference(
    applicationId: string,
    councilReference: string
  ): TrackedApplication | null {
    const application = this.applications.get(applicationId);
    if (!application) return null;

    application.councilReference = councilReference;
    application.updatedAt = new Date().toISOString();

    return application;
  }

  /**
   * Set decision
   */
  setDecision(
    applicationId: string,
    decision: ApplicationDecision,
    conditions?: string[]
  ): TrackedApplication | null {
    const application = this.applications.get(applicationId);
    if (!application) return null;

    const now = new Date().toISOString();

    application.decision = decision;
    application.conditions = conditions;
    application.decisionDate = now;

    this.updateStatus(applicationId, 'decided', `Decision: ${decision}`, 'council');

    // Add decision alert
    application.alerts.push({
      id: this.generateId(),
      type: 'decision-made',
      title: decision === 'approved' || decision === 'approved-with-conditions'
        ? '🎉 Application Approved!'
        : '📋 Decision Made',
      message: this.getDecisionMessage(decision),
      severity: decision === 'refused' ? 'warning' : 'info',
      createdAt: now,
      actionRequired: decision === 'refused',
    });

    return application;
  }

  /**
   * Add public comment
   */
  addPublicComment(
    applicationId: string,
    comment: Omit<PublicComment, 'date'>
  ): TrackedApplication | null {
    const application = this.applications.get(applicationId);
    if (!application) return null;

    const now = new Date().toISOString();

    application.publicComments.push({
      ...comment,
      date: now,
    });
    application.updatedAt = now;

    // Alert for objections
    if (comment.sentiment === 'object') {
      application.alerts.push({
        id: this.generateId(),
        type: 'objection-received',
        title: 'Objection Received',
        message: 'A neighbour objection has been submitted to your application',
        severity: 'warning',
        createdAt: now,
        actionRequired: false,
      });
    }

    return application;
  }

  /**
   * Get applications for user
   */
  getUserApplications(userId: string): TrackedApplication[] {
    return Array.from(this.applications.values())
      .filter(app => app.userId === userId)
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

  /**
   * Get application by ID
   */
  getApplication(applicationId: string): TrackedApplication | null {
    return this.applications.get(applicationId) || null;
  }

  /**
   * Get upcoming deadlines
   */
  getUpcomingDeadlines(userId: string): ApplicationAlert[] {
    const userApps = this.getUserApplications(userId);
    const alerts: ApplicationAlert[] = [];

    for (const app of userApps) {
      if (app.consultationEndDate) {
        const daysUntil = this.daysUntil(app.consultationEndDate);
        if (daysUntil > 0 && daysUntil <= 7) {
          alerts.push({
            id: this.generateId(),
            type: 'consultation-ending',
            title: 'Consultation Ending Soon',
            message: `Consultation for ${app.reference} ends in ${daysUntil} days`,
            severity: 'warning',
            createdAt: new Date().toISOString(),
            actionRequired: false,
          });
        }
      }

      if (app.targetDate) {
        const daysUntil = this.daysUntil(app.targetDate);
        if (daysUntil > 0 && daysUntil <= 14) {
          alerts.push({
            id: this.generateId(),
            type: 'deadline-approaching',
            title: 'Decision Due Soon',
            message: `Decision for ${app.reference} is due in ${daysUntil} days`,
            severity: 'info',
            createdAt: new Date().toISOString(),
            actionRequired: false,
          });
        }
      }
    }

    return alerts;
  }

  /**
   * Calculate application statistics
   */
  getStatistics(userId: string): {
    total: number;
    byStatus: Record<ApplicationStatus, number>;
    byDecision: Record<ApplicationDecision, number>;
    averageProcessingDays: number;
  } {
    const apps = this.getUserApplications(userId);
    
    const byStatus: Record<ApplicationStatus, number> = {} as Record<ApplicationStatus, number>;
    const byDecision: Record<ApplicationDecision, number> = {} as Record<ApplicationDecision, number>;
    
    let totalProcessingDays = 0;
    let decidedCount = 0;

    for (const app of apps) {
      // Count by status
      byStatus[app.status] = (byStatus[app.status] || 0) + 1;

      // Count by decision
      if (app.decision) {
        byDecision[app.decision] = (byDecision[app.decision] || 0) + 1;

        // Calculate processing time
        if (app.validatedDate && app.decisionDate) {
          const validated = new Date(app.validatedDate);
          const decided = new Date(app.decisionDate);
          const days = Math.floor((decided.getTime() - validated.getTime()) / (1000 * 60 * 60 * 24));
          totalProcessingDays += days;
          decidedCount++;
        }
      }
    }

    return {
      total: apps.length,
      byStatus,
      byDecision,
      averageProcessingDays: decidedCount > 0 ? Math.round(totalProcessingDays / decidedCount) : 0,
    };
  }

  // ===========================================
  // PRIVATE HELPERS
  // ===========================================

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }

  private generateReference(): string {
    const prefix = 'HPE';
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `${prefix}/${year}/${random}`;
  }

  private checkDocumentCompleteness(application: TrackedApplication): void {
    const requiredDocs: DocumentType[] = [
      'application-form',
      'site-plan',
      'floor-plans-proposed',
      'elevations-proposed',
    ];

    const uploadedTypes = new Set(application.documents.map(d => d.type));
    const hasAllRequired = requiredDocs.every(type => uploadedTypes.has(type));

    if (hasAllRequired && application.status === 'draft') {
      this.updateStatus(
        application.id,
        'ready-to-submit',
        'All required documents uploaded'
      );
    }
  }

  private getDecisionMessage(decision: ApplicationDecision): string {
    switch (decision) {
      case 'approved':
        return 'Congratulations! Your application has been approved with no conditions.';
      case 'approved-with-conditions':
        return 'Your application has been approved subject to conditions. Please review the conditions carefully.';
      case 'refused':
        return 'Unfortunately, your application has been refused. You may have the right to appeal within 6 months.';
      case 'withdrawn':
        return 'Your application has been withdrawn.';
      case 'invalid':
        return 'Your application has been marked as invalid. Please contact the council for details.';
      case 'permitted-development':
        return 'The council has confirmed your development is permitted development.';
    }
  }

  private daysUntil(dateString: string): number {
    const target = new Date(dateString);
    const now = new Date();
    return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  }
}

// Singleton instance
export const applicationTracker = new ApplicationTracker();

// ===========================================
// EXPORT FUNCTIONS
// ===========================================

export function getStatusProgress(status: ApplicationStatus): number {
  const statusOrder: ApplicationStatus[] = [
    'draft',
    'ready-to-submit',
    'submitted',
    'registered',
    'validated',
    'consultation',
    'assessment',
    'decided',
  ];

  const index = statusOrder.indexOf(status);
  if (index === -1) return 0;
  return Math.round((index / (statusOrder.length - 1)) * 100);
}

export function getEstimatedDecisionDate(validatedDate: string, applicationType: ApplicationType): string {
  const validated = new Date(validatedDate);
  
  const weeksToAdd = {
    'householder': 8,
    'prior-approval': 6,
    'full-planning': 13,
    'listed-building-consent': 8,
    'certificate-lawful-development': 8,
    'advertisement-consent': 8,
    'tree-works': 8,
  };

  const weeks = weeksToAdd[applicationType] || 8;
  validated.setDate(validated.getDate() + (weeks * 7));
  
  return validated.toISOString();
}
