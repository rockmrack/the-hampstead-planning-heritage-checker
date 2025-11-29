/**
 * Planning Alerts System
 * Real-time notifications for nearby planning applications
 */

export interface AlertSubscription {
  id: string;
  userId: string;
  type: SubscriptionType;
  
  // Location criteria
  location?: {
    lat: number;
    lng: number;
    radiusMeters: number;
  };
  postcode?: string;
  borough?: string;
  
  // Filter criteria
  filters?: AlertFilters;
  
  // Notification preferences
  notificationChannels: NotificationChannel[];
  frequency: NotificationFrequency;
  
  // Status
  active: boolean;
  createdAt: string;
  lastNotified?: string;
}

export type SubscriptionType = 
  | 'nearby-applications'      // All applications near a location
  | 'neighbor-applications'    // Applications affecting specific property
  | 'conservation-area'        // All applications in a conservation area
  | 'listed-building'          // Applications to listed buildings
  | 'major-developments'       // Large-scale developments
  | 'keyword';                 // Specific keywords

export interface AlertFilters {
  applicationTypes?: string[];
  minSize?: number;
  maxSize?: number;
  includeApproved?: boolean;
  includeRefused?: boolean;
  includePending?: boolean;
  keywords?: string[];
  excludeKeywords?: string[];
}

export type NotificationChannel = 'email' | 'push' | 'sms' | 'webhook';
export type NotificationFrequency = 'instant' | 'daily' | 'weekly';

export interface PlanningAlert {
  id: string;
  subscriptionId: string;
  userId: string;
  
  // Application details
  applicationReference: string;
  applicationUrl?: string;
  
  // Property
  address: string;
  postcode: string;
  coordinates: { lat: number; lng: number };
  
  // Application info
  applicationType: string;
  description: string;
  status: string;
  
  // Distance
  distanceMeters?: number;
  
  // Impact assessment
  potentialImpact?: ImpactAssessment;
  
  // Timestamps
  applicationDate: string;
  consultationDeadline?: string;
  createdAt: string;
  
  // Status
  read: boolean;
  dismissed: boolean;
  responded: boolean;
}

export interface ImpactAssessment {
  level: 'high' | 'medium' | 'low' | 'minimal';
  factors: ImpactFactor[];
  recommendation: string;
}

export interface ImpactFactor {
  type: ImpactType;
  description: string;
  severity: 'high' | 'medium' | 'low';
}

export type ImpactType =
  | 'overlooking'           // Privacy impact
  | 'overshadowing'         // Light impact
  | 'noise'                 // During construction
  | 'traffic'               // Parking/traffic increase
  | 'visual'                // Visual impact
  | 'heritage'              // Impact on heritage
  | 'trees'                 // Tree removal
  | 'parking'               // Parking reduction
  | 'density'               // Increased density
  | 'use-change';           // Change of use

// ===========================================
// ALERT RULES ENGINE
// ===========================================

export function assessImpact(
  application: {
    type: string;
    description: string;
    size?: number;
    distanceMeters: number;
  },
  userProperty: {
    facing: 'north' | 'south' | 'east' | 'west';
    floors: number;
    hasGarden: boolean;
  }
): ImpactAssessment {
  const factors: ImpactFactor[] = [];
  
  // Closer applications have more impact
  const distance = application.distanceMeters;
  
  // Check for overlooking
  if (application.type.includes('extension') || application.type.includes('loft')) {
    if (distance < 15) {
      factors.push({
        type: 'overlooking',
        description: 'New windows may overlook your property',
        severity: distance < 10 ? 'high' : 'medium',
      });
    }
  }
  
  // Check for overshadowing
  if (application.type.includes('extension') || application.type.includes('storey')) {
    if (distance < 20) {
      factors.push({
        type: 'overshadowing',
        description: 'May reduce natural light to your property',
        severity: distance < 10 ? 'high' : 'medium',
      });
    }
  }
  
  // Construction noise
  if (application.type.includes('basement') || application.type.includes('demolition')) {
    factors.push({
      type: 'noise',
      description: 'Significant construction noise expected',
      severity: distance < 30 ? 'high' : 'medium',
    });
  } else if (distance < 50) {
    factors.push({
      type: 'noise',
      description: 'Some construction noise expected',
      severity: 'low',
    });
  }
  
  // Traffic for larger developments
  if (application.description.toLowerCase().includes('dwelling') ||
      application.description.toLowerCase().includes('flat')) {
    factors.push({
      type: 'traffic',
      description: 'May increase local traffic and parking pressure',
      severity: 'medium',
    });
  }
  
  // Determine overall level
  let level: ImpactAssessment['level'] = 'minimal';
  const highCount = factors.filter(f => f.severity === 'high').length;
  const mediumCount = factors.filter(f => f.severity === 'medium').length;
  
  if (highCount >= 2 || (highCount >= 1 && mediumCount >= 2)) {
    level = 'high';
  } else if (highCount >= 1 || mediumCount >= 2) {
    level = 'medium';
  } else if (factors.length > 0) {
    level = 'low';
  }
  
  // Generate recommendation
  let recommendation: string;
  if (level === 'high') {
    recommendation = 'Consider submitting a comment to the council before the consultation deadline.';
  } else if (level === 'medium') {
    recommendation = 'Review the plans to assess the actual impact on your property.';
  } else if (level === 'low') {
    recommendation = 'Minor impact expected. Monitor the application if interested.';
  } else {
    recommendation = 'No significant impact expected on your property.';
  }
  
  return { level, factors, recommendation };
}

// ===========================================
// ALERT SERVICE
// ===========================================

export class PlanningAlertService {
  private subscriptions: Map<string, AlertSubscription> = new Map();
  private alerts: Map<string, PlanningAlert[]> = new Map();

  /**
   * Create a new alert subscription
   */
  createSubscription(input: Omit<AlertSubscription, 'id' | 'createdAt' | 'active'>): AlertSubscription {
    const id = this.generateId();
    const subscription: AlertSubscription = {
      ...input,
      id,
      active: true,
      createdAt: new Date().toISOString(),
    };

    this.subscriptions.set(id, subscription);
    return subscription;
  }

  /**
   * Quick subscribe to nearby applications
   */
  subscribeToNearby(
    userId: string,
    lat: number,
    lng: number,
    radiusMeters: number = 100,
    email: string
  ): AlertSubscription {
    return this.createSubscription({
      userId,
      type: 'nearby-applications',
      location: { lat, lng, radiusMeters },
      notificationChannels: ['email'],
      frequency: 'weekly',
    });
  }

  /**
   * Subscribe to conservation area applications
   */
  subscribeToConservationArea(
    userId: string,
    conservationAreaName: string,
    borough: string
  ): AlertSubscription {
    return this.createSubscription({
      userId,
      type: 'conservation-area',
      borough,
      filters: {
        keywords: [conservationAreaName],
      },
      notificationChannels: ['email'],
      frequency: 'weekly',
    });
  }

  /**
   * Get user's subscriptions
   */
  getUserSubscriptions(userId: string): AlertSubscription[] {
    return Array.from(this.subscriptions.values())
      .filter(sub => sub.userId === userId);
  }

  /**
   * Update subscription
   */
  updateSubscription(
    subscriptionId: string,
    updates: Partial<AlertSubscription>
  ): AlertSubscription | null {
    const subscription = this.subscriptions.get(subscriptionId);
    if (!subscription) return null;

    const updated = { ...subscription, ...updates };
    this.subscriptions.set(subscriptionId, updated);
    return updated;
  }

  /**
   * Pause/unpause subscription
   */
  toggleSubscription(subscriptionId: string): AlertSubscription | null {
    const subscription = this.subscriptions.get(subscriptionId);
    if (!subscription) return null;

    subscription.active = !subscription.active;
    return subscription;
  }

  /**
   * Delete subscription
   */
  deleteSubscription(subscriptionId: string): boolean {
    return this.subscriptions.delete(subscriptionId);
  }

  /**
   * Create alert for matching subscription
   */
  createAlert(
    subscription: AlertSubscription,
    application: {
      reference: string;
      url?: string;
      address: string;
      postcode: string;
      lat: number;
      lng: number;
      type: string;
      description: string;
      status: string;
      applicationDate: string;
      consultationDeadline?: string;
    }
  ): PlanningAlert {
    const distanceMeters = subscription.location
      ? this.calculateDistance(
          subscription.location.lat,
          subscription.location.lng,
          application.lat,
          application.lng
        )
      : undefined;

    const potentialImpact = distanceMeters
      ? assessImpact(
          { 
            type: application.type, 
            description: application.description, 
            distanceMeters 
          },
          { facing: 'south', floors: 2, hasGarden: true } // Default assumptions
        )
      : undefined;

    const alert: PlanningAlert = {
      id: this.generateId(),
      subscriptionId: subscription.id,
      userId: subscription.userId,
      applicationReference: application.reference,
      applicationUrl: application.url,
      address: application.address,
      postcode: application.postcode,
      coordinates: { lat: application.lat, lng: application.lng },
      applicationType: application.type,
      description: application.description,
      status: application.status,
      distanceMeters,
      potentialImpact,
      applicationDate: application.applicationDate,
      consultationDeadline: application.consultationDeadline,
      createdAt: new Date().toISOString(),
      read: false,
      dismissed: false,
      responded: false,
    };

    // Store alert
    const userAlerts = this.alerts.get(subscription.userId) || [];
    userAlerts.push(alert);
    this.alerts.set(subscription.userId, userAlerts);

    return alert;
  }

  /**
   * Get user's alerts
   */
  getUserAlerts(
    userId: string,
    options?: {
      unreadOnly?: boolean;
      limit?: number;
      minImpact?: ImpactAssessment['level'];
    }
  ): PlanningAlert[] {
    let alerts = this.alerts.get(userId) || [];

    if (options?.unreadOnly) {
      alerts = alerts.filter(a => !a.read && !a.dismissed);
    }

    if (options?.minImpact) {
      const levelOrder = { high: 3, medium: 2, low: 1, minimal: 0 };
      const minLevel = levelOrder[options.minImpact];
      alerts = alerts.filter(a => {
        const alertLevel = a.potentialImpact?.level || 'minimal';
        return levelOrder[alertLevel] >= minLevel;
      });
    }

    // Sort by creation date, newest first
    alerts.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    if (options?.limit) {
      alerts = alerts.slice(0, options.limit);
    }

    return alerts;
  }

  /**
   * Mark alert as read
   */
  markAsRead(alertId: string, userId: string): boolean {
    const userAlerts = this.alerts.get(userId);
    if (!userAlerts) return false;

    const alert = userAlerts.find(a => a.id === alertId);
    if (alert) {
      alert.read = true;
      return true;
    }
    return false;
  }

  /**
   * Dismiss alert
   */
  dismissAlert(alertId: string, userId: string): boolean {
    const userAlerts = this.alerts.get(userId);
    if (!userAlerts) return false;

    const alert = userAlerts.find(a => a.id === alertId);
    if (alert) {
      alert.dismissed = true;
      return true;
    }
    return false;
  }

  /**
   * Get alert statistics
   */
  getAlertStats(userId: string): {
    total: number;
    unread: number;
    highImpact: number;
    thisWeek: number;
    respondedTo: number;
  } {
    const alerts = this.alerts.get(userId) || [];
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    return {
      total: alerts.length,
      unread: alerts.filter(a => !a.read && !a.dismissed).length,
      highImpact: alerts.filter(a => a.potentialImpact?.level === 'high').length,
      thisWeek: alerts.filter(a => new Date(a.createdAt) > oneWeekAgo).length,
      respondedTo: alerts.filter(a => a.responded).length,
    };
  }

  // ===========================================
  // PRIVATE HELPERS
  // ===========================================

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }

  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371000; // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lng2 - lng1) * Math.PI / 180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c; // Distance in meters
  }
}

// Singleton instance
export const planningAlertService = new PlanningAlertService();

// ===========================================
// EMAIL TEMPLATES
// ===========================================

export function generateAlertEmailHtml(alerts: PlanningAlert[]): string {
  const highImpact = alerts.filter(a => a.potentialImpact?.level === 'high');
  const otherAlerts = alerts.filter(a => a.potentialImpact?.level !== 'high');

  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .header { background: #1e3a5f; color: white; padding: 20px; }
    .alert { border: 1px solid #ddd; margin: 10px 0; padding: 15px; border-radius: 8px; }
    .alert.high { border-left: 4px solid #dc2626; }
    .alert.medium { border-left: 4px solid #f59e0b; }
    .alert.low { border-left: 4px solid #10b981; }
    .badge { display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 12px; }
    .badge.high { background: #fee2e2; color: #dc2626; }
    .badge.medium { background: #fef3c7; color: #d97706; }
    .button { background: #1e3a5f; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>🏠 Planning Alert</h1>
    <p>${alerts.length} new planning application${alerts.length > 1 ? 's' : ''} near you</p>
  </div>
  
  ${highImpact.length > 0 ? `
    <h2>⚠️ High Impact (${highImpact.length})</h2>
    ${highImpact.map(alert => `
      <div class="alert high">
        <span class="badge high">High Impact</span>
        <h3>${alert.address}</h3>
        <p><strong>${alert.applicationType}</strong></p>
        <p>${alert.description}</p>
        ${alert.distanceMeters ? `<p>📍 ${Math.round(alert.distanceMeters)}m from your property</p>` : ''}
        ${alert.consultationDeadline ? `<p>⏰ Respond by: ${new Date(alert.consultationDeadline).toLocaleDateString()}</p>` : ''}
        <p>${alert.potentialImpact?.recommendation}</p>
        ${alert.applicationUrl ? `<a href="${alert.applicationUrl}" class="button">View Application</a>` : ''}
      </div>
    `).join('')}
  ` : ''}
  
  ${otherAlerts.length > 0 ? `
    <h2>Other Applications (${otherAlerts.length})</h2>
    ${otherAlerts.slice(0, 5).map(alert => `
      <div class="alert ${alert.potentialImpact?.level || 'low'}">
        <h3>${alert.address}</h3>
        <p>${alert.applicationType} - ${alert.description.slice(0, 100)}...</p>
        ${alert.distanceMeters ? `<p>📍 ${Math.round(alert.distanceMeters)}m away</p>` : ''}
      </div>
    `).join('')}
  ` : ''}
  
  <hr>
  <p style="color: #666; font-size: 12px;">
    You're receiving this because you subscribed to planning alerts.
    <a href="#">Manage preferences</a> | <a href="#">Unsubscribe</a>
  </p>
</body>
</html>
  `.trim();
}
