/**
 * Smart Notifications Service
 * 
 * Handles real-time notifications, email alerts, and push notifications
 * for planning application updates, policy changes, and deadline reminders.
 */

// Notification types
interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  category: NotificationCategory;
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  metadata: NotificationMetadata;
  status: 'unread' | 'read' | 'archived' | 'acted';
  actionUrl?: string;
  actionLabel?: string;
  createdAt: Date;
  readAt?: Date;
  expiresAt?: Date;
}

type NotificationType = 
  | 'application_update'
  | 'deadline_reminder'
  | 'policy_change'
  | 'neighbor_comment'
  | 'officer_response'
  | 'document_required'
  | 'approval'
  | 'rejection'
  | 'appeal_update'
  | 'market_alert'
  | 'recommendation'
  | 'system';

type NotificationCategory = 
  | 'application'
  | 'policy'
  | 'deadline'
  | 'communication'
  | 'market'
  | 'system';

interface NotificationMetadata {
  applicationId?: string;
  propertyAddress?: string;
  areaCode?: string;
  officerName?: string;
  daysRemaining?: number;
  policyName?: string;
  changeType?: string;
  [key: string]: string | number | boolean | undefined;
}

interface NotificationPreferences {
  userId: string;
  email: {
    enabled: boolean;
    frequency: 'immediate' | 'daily' | 'weekly';
    categories: NotificationCategory[];
  };
  push: {
    enabled: boolean;
    categories: NotificationCategory[];
  };
  sms: {
    enabled: boolean;
    phoneNumber?: string;
    urgentOnly: boolean;
  };
  quietHours: {
    enabled: boolean;
    start: string; // HH:MM format
    end: string;
    timezone: string;
  };
  subscriptions: NotificationSubscription[];
}

interface NotificationSubscription {
  id: string;
  type: 'area' | 'application' | 'policy' | 'keyword';
  value: string;
  notifyOn: NotificationType[];
  active: boolean;
}

interface NotificationTemplate {
  id: string;
  type: NotificationType;
  subject: string;
  htmlBody: string;
  textBody: string;
  pushTitle: string;
  pushBody: string;
  variables: string[];
}

// In-memory storage (would be database in production)
const notifications = new Map<string, Notification[]>();
const preferences = new Map<string, NotificationPreferences>();
const subscriptions = new Map<string, NotificationSubscription[]>();

// Notification templates
const TEMPLATES: Record<NotificationType, NotificationTemplate> = {
  application_update: {
    id: 'tpl_app_update',
    type: 'application_update',
    subject: 'Update on your planning application - {{applicationRef}}',
    htmlBody: `
      <h2>Application Update</h2>
      <p>Your planning application for <strong>{{propertyAddress}}</strong> has been updated.</p>
      <p><strong>New Status:</strong> {{newStatus}}</p>
      <p><strong>Details:</strong> {{updateDetails}}</p>
      <a href="{{actionUrl}}">View Application Details</a>
    `,
    textBody: 'Your planning application for {{propertyAddress}} has been updated to: {{newStatus}}. {{updateDetails}}',
    pushTitle: 'Application Update',
    pushBody: '{{propertyAddress}}: {{newStatus}}',
    variables: ['applicationRef', 'propertyAddress', 'newStatus', 'updateDetails', 'actionUrl']
  },
  
  deadline_reminder: {
    id: 'tpl_deadline',
    type: 'deadline_reminder',
    subject: '⏰ Deadline Reminder: {{deadlineType}} in {{daysRemaining}} days',
    htmlBody: `
      <h2>Deadline Approaching</h2>
      <p>This is a reminder that your <strong>{{deadlineType}}</strong> deadline is in <strong>{{daysRemaining}} days</strong>.</p>
      <p><strong>Property:</strong> {{propertyAddress}}</p>
      <p><strong>Deadline Date:</strong> {{deadlineDate}}</p>
      <p><strong>Action Required:</strong> {{actionRequired}}</p>
      <a href="{{actionUrl}}">Take Action Now</a>
    `,
    textBody: 'Deadline reminder: {{deadlineType}} for {{propertyAddress}} is due in {{daysRemaining}} days.',
    pushTitle: '⏰ Deadline in {{daysRemaining}} days',
    pushBody: '{{deadlineType}} for {{propertyAddress}}',
    variables: ['deadlineType', 'daysRemaining', 'propertyAddress', 'deadlineDate', 'actionRequired', 'actionUrl']
  },
  
  policy_change: {
    id: 'tpl_policy',
    type: 'policy_change',
    subject: '📋 Planning Policy Update: {{policyName}}',
    htmlBody: `
      <h2>Policy Change Notification</h2>
      <p>A planning policy that may affect your interests has been updated.</p>
      <p><strong>Policy:</strong> {{policyName}}</p>
      <p><strong>Change Type:</strong> {{changeType}}</p>
      <p><strong>Affected Area:</strong> {{affectedArea}}</p>
      <p><strong>Summary:</strong> {{changeSummary}}</p>
      <p><strong>Effective Date:</strong> {{effectiveDate}}</p>
      <a href="{{actionUrl}}">Read Full Details</a>
    `,
    textBody: 'Policy update: {{policyName}} has been {{changeType}}. This affects {{affectedArea}}. Effective: {{effectiveDate}}',
    pushTitle: 'Policy Update: {{policyName}}',
    pushBody: '{{changeType}} affecting {{affectedArea}}',
    variables: ['policyName', 'changeType', 'affectedArea', 'changeSummary', 'effectiveDate', 'actionUrl']
  },
  
  neighbor_comment: {
    id: 'tpl_neighbor',
    type: 'neighbor_comment',
    subject: 'New comment on application near {{propertyAddress}}',
    htmlBody: `
      <h2>Neighbor Comment Received</h2>
      <p>A new comment has been submitted regarding a planning application near your property.</p>
      <p><strong>Application:</strong> {{applicationRef}}</p>
      <p><strong>Address:</strong> {{applicationAddress}}</p>
      <p><strong>Comment Type:</strong> {{commentType}}</p>
      <p><strong>Summary:</strong> {{commentSummary}}</p>
      <a href="{{actionUrl}}">View Full Comment</a>
    `,
    textBody: 'New {{commentType}} comment on application {{applicationRef}} near {{propertyAddress}}.',
    pushTitle: 'New Comment Nearby',
    pushBody: '{{commentType}} on {{applicationRef}}',
    variables: ['propertyAddress', 'applicationRef', 'applicationAddress', 'commentType', 'commentSummary', 'actionUrl']
  },
  
  officer_response: {
    id: 'tpl_officer',
    type: 'officer_response',
    subject: 'Response from Planning Officer - {{applicationRef}}',
    htmlBody: `
      <h2>Planning Officer Response</h2>
      <p><strong>{{officerName}}</strong> has responded to your application.</p>
      <p><strong>Application:</strong> {{applicationRef}}</p>
      <p><strong>Response Type:</strong> {{responseType}}</p>
      <p><strong>Message:</strong></p>
      <blockquote>{{officerMessage}}</blockquote>
      <a href="{{actionUrl}}">View and Respond</a>
    `,
    textBody: 'Planning Officer {{officerName}} has sent you a {{responseType}} regarding {{applicationRef}}.',
    pushTitle: 'Officer Response',
    pushBody: '{{officerName}}: {{responseType}}',
    variables: ['officerName', 'applicationRef', 'responseType', 'officerMessage', 'actionUrl']
  },
  
  document_required: {
    id: 'tpl_document',
    type: 'document_required',
    subject: '📄 Document Required: {{documentType}}',
    htmlBody: `
      <h2>Document Required</h2>
      <p>Additional documentation is required for your application to proceed.</p>
      <p><strong>Application:</strong> {{applicationRef}}</p>
      <p><strong>Document Type:</strong> {{documentType}}</p>
      <p><strong>Reason:</strong> {{reason}}</p>
      <p><strong>Deadline:</strong> {{deadline}}</p>
      <a href="{{actionUrl}}">Upload Document</a>
    `,
    textBody: '{{documentType}} required for {{applicationRef}}. Deadline: {{deadline}}',
    pushTitle: 'Document Required',
    pushBody: '{{documentType}} needed by {{deadline}}',
    variables: ['applicationRef', 'documentType', 'reason', 'deadline', 'actionUrl']
  },
  
  approval: {
    id: 'tpl_approval',
    type: 'approval',
    subject: '✅ Congratulations! Application {{applicationRef}} Approved',
    htmlBody: `
      <h2>Application Approved! 🎉</h2>
      <p>Great news! Your planning application has been <strong>approved</strong>.</p>
      <p><strong>Application:</strong> {{applicationRef}}</p>
      <p><strong>Property:</strong> {{propertyAddress}}</p>
      <p><strong>Project Type:</strong> {{projectType}}</p>
      <p><strong>Conditions:</strong> {{conditionsCount}} conditions attached</p>
      <h3>Next Steps</h3>
      <ul>
        <li>Review the decision notice and conditions</li>
        <li>You have 3 years to begin development</li>
        <li>Ensure compliance with all conditions</li>
      </ul>
      <a href="{{actionUrl}}">View Decision Notice</a>
    `,
    textBody: 'Your planning application {{applicationRef}} for {{propertyAddress}} has been APPROVED! View the decision notice for details.',
    pushTitle: '✅ Application Approved!',
    pushBody: '{{propertyAddress}} - {{projectType}}',
    variables: ['applicationRef', 'propertyAddress', 'projectType', 'conditionsCount', 'actionUrl']
  },
  
  rejection: {
    id: 'tpl_rejection',
    type: 'rejection',
    subject: '❌ Application {{applicationRef}} Decision',
    htmlBody: `
      <h2>Application Decision</h2>
      <p>We regret to inform you that your planning application has been <strong>refused</strong>.</p>
      <p><strong>Application:</strong> {{applicationRef}}</p>
      <p><strong>Property:</strong> {{propertyAddress}}</p>
      <p><strong>Reasons for Refusal:</strong></p>
      <ul>{{refusalReasons}}</ul>
      <h3>Your Options</h3>
      <ul>
        <li>Appeal the decision within 6 months</li>
        <li>Submit a revised application</li>
        <li>Request pre-application advice for improvements</li>
      </ul>
      <a href="{{actionUrl}}">View Full Decision</a>
    `,
    textBody: 'Your planning application {{applicationRef}} has been refused. You can appeal within 6 months.',
    pushTitle: '❌ Application Refused',
    pushBody: '{{propertyAddress}} - Appeal available',
    variables: ['applicationRef', 'propertyAddress', 'refusalReasons', 'actionUrl']
  },
  
  appeal_update: {
    id: 'tpl_appeal',
    type: 'appeal_update',
    subject: '⚖️ Appeal Update: {{applicationRef}}',
    htmlBody: `
      <h2>Appeal Update</h2>
      <p>There is an update on your planning appeal.</p>
      <p><strong>Appeal Reference:</strong> {{appealRef}}</p>
      <p><strong>Status:</strong> {{appealStatus}}</p>
      <p><strong>Update:</strong> {{updateDetails}}</p>
      <a href="{{actionUrl}}">View Appeal Details</a>
    `,
    textBody: 'Appeal update for {{applicationRef}}: {{appealStatus}}',
    pushTitle: 'Appeal Update',
    pushBody: '{{appealStatus}}',
    variables: ['applicationRef', 'appealRef', 'appealStatus', 'updateDetails', 'actionUrl']
  },
  
  market_alert: {
    id: 'tpl_market',
    type: 'market_alert',
    subject: '📊 Market Alert: {{alertTitle}}',
    htmlBody: `
      <h2>Market Intelligence Alert</h2>
      <p><strong>{{alertTitle}}</strong></p>
      <p>{{alertDescription}}</p>
      <p><strong>Area:</strong> {{areaCode}}</p>
      <p><strong>Impact:</strong> {{impactLevel}}</p>
      <p><strong>Data Point:</strong> {{dataPoint}}</p>
      <a href="{{actionUrl}}">View Full Analysis</a>
    `,
    textBody: 'Market Alert: {{alertTitle}} - {{areaCode}} - {{impactLevel}} impact',
    pushTitle: '📊 {{alertTitle}}',
    pushBody: '{{areaCode}}: {{dataPoint}}',
    variables: ['alertTitle', 'alertDescription', 'areaCode', 'impactLevel', 'dataPoint', 'actionUrl']
  },
  
  recommendation: {
    id: 'tpl_recommendation',
    type: 'recommendation',
    subject: '💡 Planning Recommendation: {{recommendationTitle}}',
    htmlBody: `
      <h2>Personalized Recommendation</h2>
      <p>Based on your interests and recent activity, we have a recommendation for you.</p>
      <p><strong>{{recommendationTitle}}</strong></p>
      <p>{{recommendationDetails}}</p>
      <p><strong>Why This Matters:</strong> {{rationale}}</p>
      <a href="{{actionUrl}}">Learn More</a>
    `,
    textBody: 'Recommendation: {{recommendationTitle}}. {{rationale}}',
    pushTitle: '💡 Recommendation',
    pushBody: '{{recommendationTitle}}',
    variables: ['recommendationTitle', 'recommendationDetails', 'rationale', 'actionUrl']
  },
  
  system: {
    id: 'tpl_system',
    type: 'system',
    subject: '{{systemTitle}}',
    htmlBody: '<h2>{{systemTitle}}</h2><p>{{systemMessage}}</p>',
    textBody: '{{systemTitle}}: {{systemMessage}}',
    pushTitle: '{{systemTitle}}',
    pushBody: '{{systemMessage}}',
    variables: ['systemTitle', 'systemMessage']
  }
};

class NotificationService {
  
  /**
   * Create a new notification
   */
  async createNotification(params: {
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
    priority?: 'low' | 'medium' | 'high' | 'urgent';
    metadata?: NotificationMetadata;
    actionUrl?: string;
    actionLabel?: string;
    expiresAt?: Date;
  }): Promise<Notification> {
    const notification: Notification = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: params.userId,
      type: params.type,
      category: this.getCategoryForType(params.type),
      title: params.title,
      message: params.message,
      priority: params.priority || 'medium',
      metadata: params.metadata || {},
      status: 'unread',
      actionUrl: params.actionUrl,
      actionLabel: params.actionLabel,
      createdAt: new Date(),
      expiresAt: params.expiresAt
    };
    
    // Store notification
    const userNotifications = notifications.get(params.userId) || [];
    userNotifications.unshift(notification);
    notifications.set(params.userId, userNotifications);
    
    // Check preferences and send appropriate notifications
    await this.processNotificationDelivery(notification);
    
    return notification;
  }
  
  /**
   * Create notifications for deadline reminders
   */
  async createDeadlineReminder(params: {
    userId: string;
    applicationId: string;
    propertyAddress: string;
    deadlineType: string;
    deadlineDate: Date;
    actionRequired: string;
  }): Promise<Notification> {
    const daysRemaining = Math.ceil(
      (params.deadlineDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );
    
    const priority = daysRemaining <= 1 ? 'urgent' : 
                     daysRemaining <= 3 ? 'high' : 
                     daysRemaining <= 7 ? 'medium' : 'low';
    
    return this.createNotification({
      userId: params.userId,
      type: 'deadline_reminder',
      title: `⏰ ${params.deadlineType} deadline in ${daysRemaining} days`,
      message: `Your ${params.deadlineType} for ${params.propertyAddress} is due on ${params.deadlineDate.toLocaleDateString()}. ${params.actionRequired}`,
      priority,
      metadata: {
        applicationId: params.applicationId,
        propertyAddress: params.propertyAddress,
        daysRemaining,
        deadlineType: params.deadlineType
      },
      actionUrl: `/tracker/${params.applicationId}`,
      actionLabel: 'View Application',
      expiresAt: params.deadlineDate
    });
  }
  
  /**
   * Create policy change notification
   */
  async createPolicyAlert(params: {
    affectedUserIds: string[];
    policyName: string;
    changeType: string;
    affectedArea: string;
    summary: string;
    effectiveDate: Date;
  }): Promise<Notification[]> {
    const notifications: Notification[] = [];
    
    for (const userId of params.affectedUserIds) {
      const notification = await this.createNotification({
        userId,
        type: 'policy_change',
        title: `📋 Policy Update: ${params.policyName}`,
        message: `${params.policyName} has been ${params.changeType}. This affects ${params.affectedArea}. Effective: ${params.effectiveDate.toLocaleDateString()}`,
        priority: 'high',
        metadata: {
          policyName: params.policyName,
          changeType: params.changeType,
          areaCode: params.affectedArea
        },
        actionUrl: '/alerts'
      });
      notifications.push(notification);
    }
    
    return notifications;
  }
  
  /**
   * Get notifications for a user
   */
  async getNotifications(
    userId: string,
    options?: {
      status?: 'unread' | 'read' | 'all';
      category?: NotificationCategory;
      limit?: number;
      offset?: number;
    }
  ): Promise<{
    notifications: Notification[];
    total: number;
    unreadCount: number;
  }> {
    let userNotifications = notifications.get(userId) || [];
    
    // Filter out expired
    const now = new Date();
    userNotifications = userNotifications.filter(
      n => !n.expiresAt || n.expiresAt > now
    );
    
    // Filter by status
    if (options?.status && options.status !== 'all') {
      userNotifications = userNotifications.filter(n => n.status === options.status);
    }
    
    // Filter by category
    if (options?.category) {
      userNotifications = userNotifications.filter(n => n.category === options.category);
    }
    
    const total = userNotifications.length;
    const unreadCount = userNotifications.filter(n => n.status === 'unread').length;
    
    // Pagination
    const offset = options?.offset || 0;
    const limit = options?.limit || 20;
    const paginatedNotifications = userNotifications.slice(offset, offset + limit);
    
    return {
      notifications: paginatedNotifications,
      total,
      unreadCount
    };
  }
  
  /**
   * Mark notification as read
   */
  async markAsRead(userId: string, notificationId: string): Promise<boolean> {
    const userNotifications = notifications.get(userId);
    if (!userNotifications) return false;
    
    const notification = userNotifications.find(n => n.id === notificationId);
    if (!notification) return false;
    
    notification.status = 'read';
    notification.readAt = new Date();
    
    return true;
  }
  
  /**
   * Mark all as read
   */
  async markAllAsRead(userId: string, category?: NotificationCategory): Promise<number> {
    const userNotifications = notifications.get(userId);
    if (!userNotifications) return 0;
    
    let count = 0;
    for (const notification of userNotifications) {
      if (notification.status === 'unread') {
        if (!category || notification.category === category) {
          notification.status = 'read';
          notification.readAt = new Date();
          count++;
        }
      }
    }
    
    return count;
  }
  
  /**
   * Archive notification
   */
  async archive(userId: string, notificationId: string): Promise<boolean> {
    const userNotifications = notifications.get(userId);
    if (!userNotifications) return false;
    
    const notification = userNotifications.find(n => n.id === notificationId);
    if (!notification) return false;
    
    notification.status = 'archived';
    
    return true;
  }
  
  /**
   * Get/Set user preferences
   */
  async getPreferences(userId: string): Promise<NotificationPreferences> {
    const existing = preferences.get(userId);
    if (existing) return existing;
    
    // Return defaults
    return {
      userId,
      email: {
        enabled: true,
        frequency: 'immediate',
        categories: ['application', 'deadline', 'policy', 'communication']
      },
      push: {
        enabled: true,
        categories: ['application', 'deadline', 'communication']
      },
      sms: {
        enabled: false,
        urgentOnly: true
      },
      quietHours: {
        enabled: false,
        start: '22:00',
        end: '08:00',
        timezone: 'Europe/London'
      },
      subscriptions: []
    };
  }
  
  async updatePreferences(
    userId: string,
    updates: Partial<NotificationPreferences>
  ): Promise<NotificationPreferences> {
    const current = await this.getPreferences(userId);
    const updated = { ...current, ...updates };
    preferences.set(userId, updated);
    return updated;
  }
  
  /**
   * Add subscription (watch an area, application, etc.)
   */
  async addSubscription(
    userId: string,
    subscription: Omit<NotificationSubscription, 'id'>
  ): Promise<NotificationSubscription> {
    const sub: NotificationSubscription = {
      ...subscription,
      id: `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
    
    const userSubs = subscriptions.get(userId) || [];
    userSubs.push(sub);
    subscriptions.set(userId, userSubs);
    
    // Update preferences
    const prefs = await this.getPreferences(userId);
    prefs.subscriptions.push(sub);
    preferences.set(userId, prefs);
    
    return sub;
  }
  
  /**
   * Remove subscription
   */
  async removeSubscription(userId: string, subscriptionId: string): Promise<boolean> {
    const userSubs = subscriptions.get(userId) || [];
    const index = userSubs.findIndex(s => s.id === subscriptionId);
    
    if (index === -1) return false;
    
    userSubs.splice(index, 1);
    subscriptions.set(userId, userSubs);
    
    // Update preferences
    const prefs = await this.getPreferences(userId);
    prefs.subscriptions = prefs.subscriptions.filter(s => s.id !== subscriptionId);
    preferences.set(userId, prefs);
    
    return true;
  }
  
  /**
   * Get notification statistics
   */
  async getStatistics(userId: string): Promise<{
    total: number;
    unread: number;
    byCategory: Record<NotificationCategory, number>;
    byType: Record<NotificationType, number>;
    thisWeek: number;
    avgResponseTime: number;
  }> {
    const userNotifications = notifications.get(userId) || [];
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const byCategory: Record<NotificationCategory, number> = {
      application: 0,
      policy: 0,
      deadline: 0,
      communication: 0,
      market: 0,
      system: 0
    };
    
    const byType: Partial<Record<NotificationType, number>> = {};
    
    let readCount = 0;
    let totalResponseTime = 0;
    
    for (const n of userNotifications) {
      byCategory[n.category]++;
      byType[n.type] = (byType[n.type] || 0) + 1;
      
      if (n.status === 'read' && n.readAt) {
        readCount++;
        totalResponseTime += n.readAt.getTime() - n.createdAt.getTime();
      }
    }
    
    return {
      total: userNotifications.length,
      unread: userNotifications.filter(n => n.status === 'unread').length,
      byCategory,
      byType: byType as Record<NotificationType, number>,
      thisWeek: userNotifications.filter(n => n.createdAt >= weekAgo).length,
      avgResponseTime: readCount > 0 ? Math.round(totalResponseTime / readCount / 1000 / 60) : 0 // minutes
    };
  }
  
  /**
   * Render notification content using template
   */
  renderTemplate(type: NotificationType, variables: Record<string, string | number>): {
    subject: string;
    htmlBody: string;
    textBody: string;
    pushTitle: string;
    pushBody: string;
  } {
    const template = TEMPLATES[type];
    if (!template) {
      return {
        subject: 'Notification',
        htmlBody: '<p>You have a new notification</p>',
        textBody: 'You have a new notification',
        pushTitle: 'Notification',
        pushBody: 'You have a new notification'
      };
    }
    
    const render = (text: string): string => {
      let result = text;
      for (const [key, value] of Object.entries(variables)) {
        result = result.replace(new RegExp(`{{${key}}}`, 'g'), String(value));
      }
      return result;
    };
    
    return {
      subject: render(template.subject),
      htmlBody: render(template.htmlBody),
      textBody: render(template.textBody),
      pushTitle: render(template.pushTitle),
      pushBody: render(template.pushBody)
    };
  }
  
  // Private methods
  
  private getCategoryForType(type: NotificationType): NotificationCategory {
    const mapping: Record<NotificationType, NotificationCategory> = {
      application_update: 'application',
      deadline_reminder: 'deadline',
      policy_change: 'policy',
      neighbor_comment: 'communication',
      officer_response: 'communication',
      document_required: 'application',
      approval: 'application',
      rejection: 'application',
      appeal_update: 'application',
      market_alert: 'market',
      recommendation: 'market',
      system: 'system'
    };
    
    return mapping[type];
  }
  
  private async processNotificationDelivery(notification: Notification): Promise<void> {
    const prefs = await this.getPreferences(notification.userId);
    
    // Check quiet hours
    if (prefs.quietHours.enabled && notification.priority !== 'urgent') {
      const now = new Date();
      const startParts = prefs.quietHours.start.split(':').map(Number);
      const endParts = prefs.quietHours.end.split(':').map(Number);
      const startHour = startParts[0] ?? 0;
      const startMin = startParts[1] ?? 0;
      const endHour = endParts[0] ?? 0;
      const endMin = endParts[1] ?? 0;
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      const startMinutes = startHour * 60 + startMin;
      const endMinutes = endHour * 60 + endMin;
      
      const isQuietTime = startMinutes > endMinutes
        ? currentMinutes >= startMinutes || currentMinutes < endMinutes
        : currentMinutes >= startMinutes && currentMinutes < endMinutes;
      
      if (isQuietTime) {
        // Queue for later delivery
        console.log(`Notification ${notification.id} queued for delivery after quiet hours`);
        return;
      }
    }
    
    // Email delivery
    if (prefs.email.enabled && prefs.email.categories.includes(notification.category)) {
      await this.sendEmail(notification);
    }
    
    // Push notification
    if (prefs.push.enabled && prefs.push.categories.includes(notification.category)) {
      await this.sendPush(notification);
    }
    
    // SMS for urgent only
    if (prefs.sms.enabled && notification.priority === 'urgent' && prefs.sms.phoneNumber) {
      await this.sendSMS(notification, prefs.sms.phoneNumber);
    }
  }
  
  private async sendEmail(notification: Notification): Promise<void> {
    // Would integrate with email service (SendGrid, AWS SES, etc.)
    console.log(`[Email] Would send: ${notification.title} to user ${notification.userId}`);
  }
  
  private async sendPush(notification: Notification): Promise<void> {
    // Would integrate with push notification service (Firebase, OneSignal, etc.)
    console.log(`[Push] Would send: ${notification.title} to user ${notification.userId}`);
  }
  
  private async sendSMS(notification: Notification, phoneNumber: string): Promise<void> {
    // Would integrate with SMS service (Twilio, etc.)
    console.log(`[SMS] Would send: ${notification.title} to ${phoneNumber}`);
  }
}

export const notificationService = new NotificationService();

export type {
  Notification,
  NotificationType,
  NotificationCategory,
  NotificationPreferences,
  NotificationSubscription,
  NotificationMetadata
};
