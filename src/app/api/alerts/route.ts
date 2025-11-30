/**
 * Alerts Subscription API
 * /api/alerts
 */

import { NextRequest, NextResponse } from 'next/server';
import { 
  planningAlertService,
  AlertSubscription,
  SubscriptionType 
} from '@/lib/services/planning-alerts';
import { logger } from '@/lib/utils/logger';

/**
 * Get user's alerts and subscriptions
 * GET /api/alerts?userId=xxx
 */
export async function GET(request: NextRequest) {
  const requestId = crypto.randomUUID();
  
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const alertsOnly = searchParams.get('alertsOnly') === 'true';
    const unreadOnly = searchParams.get('unreadOnly') === 'true';
    const limit = parseInt(searchParams.get('limit') || '50');

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing userId parameter' },
        { status: 400 }
      );
    }

    const alerts = planningAlertService.getUserAlerts(userId, {
      unreadOnly,
      limit,
    });

    const subscriptions = alertsOnly 
      ? [] 
      : planningAlertService.getUserSubscriptions(userId);

    const stats = planningAlertService.getAlertStats(userId);

    logger.info('Alerts retrieved', {
      requestId,
      userId,
      alertsCount: alerts.length,
      subscriptionsCount: subscriptions.length,
    });

    return NextResponse.json({
      success: true,
      requestId,
      alerts,
      subscriptions,
      stats,
    });
  } catch (error) {
    logger.error('Alerts retrieval failed', {
      requestId,
      error: error instanceof Error ? error.message : 'Unknown error',
    });

    return NextResponse.json(
      { 
        error: 'Failed to retrieve alerts',
        requestId,
      },
      { status: 500 }
    );
  }
}

/**
 * Create a new alert subscription
 * POST /api/alerts
 */
export async function POST(request: NextRequest) {
  const requestId = crypto.randomUUID();
  
  try {
    const body = await request.json();
    
    const {
      userId,
      type,
      location,
      postcode,
      borough,
      filters,
      notificationChannels,
      frequency,
    } = body;

    // Validate required fields
    if (!userId) {
      return NextResponse.json(
        { error: 'Missing required field: userId' },
        { status: 400 }
      );
    }

    if (!type) {
      return NextResponse.json(
        { error: 'Missing required field: type' },
        { status: 400 }
      );
    }

    const validTypes: SubscriptionType[] = [
      'nearby-applications',
      'neighbor-applications',
      'conservation-area',
      'listed-building',
      'major-developments',
      'keyword',
    ];

    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: `Invalid subscription type. Must be one of: ${validTypes.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate location for nearby subscriptions
    if (type === 'nearby-applications' && !location) {
      return NextResponse.json(
        { error: 'Location required for nearby-applications subscription' },
        { status: 400 }
      );
    }

    logger.info('Creating alert subscription', {
      requestId,
      userId,
      type,
      hasLocation: !!location,
    });

    const subscription = planningAlertService.createSubscription({
      userId,
      type,
      location,
      postcode,
      borough,
      filters,
      notificationChannels: notificationChannels || ['email'],
      frequency: frequency || 'weekly',
    });

    logger.info('Alert subscription created', {
      requestId,
      subscriptionId: subscription.id,
    });

    return NextResponse.json({
      success: true,
      requestId,
      subscription,
    });
  } catch (error) {
    logger.error('Subscription creation failed', {
      requestId,
      error: error instanceof Error ? error.message : 'Unknown error',
    });

    return NextResponse.json(
      { 
        error: 'Failed to create subscription',
        requestId,
      },
      { status: 500 }
    );
  }
}

/**
 * Update subscription or mark alerts
 * PATCH /api/alerts
 */
export async function PATCH(request: NextRequest) {
  const requestId = crypto.randomUUID();
  
  try {
    const body = await request.json();
    const { action, subscriptionId, alertId, userId, updates } = body;

    if (action === 'toggle-subscription' && subscriptionId) {
      const subscription = planningAlertService.toggleSubscription(subscriptionId);
      if (!subscription) {
        return NextResponse.json(
          { error: 'Subscription not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, subscription });
    }

    if (action === 'mark-read' && alertId && userId) {
      const success = planningAlertService.markAsRead(alertId, userId);
      return NextResponse.json({ success });
    }

    if (action === 'dismiss' && alertId && userId) {
      const success = planningAlertService.dismissAlert(alertId, userId);
      return NextResponse.json({ success });
    }

    if (action === 'update-subscription' && subscriptionId && updates) {
      const subscription = planningAlertService.updateSubscription(subscriptionId, updates);
      if (!subscription) {
        return NextResponse.json(
          { error: 'Subscription not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, subscription });
    }

    return NextResponse.json(
      { error: 'Invalid action or missing parameters' },
      { status: 400 }
    );
  } catch (error) {
    logger.error('Alert update failed', {
      requestId,
      error: error instanceof Error ? error.message : 'Unknown error',
    });

    return NextResponse.json(
      { 
        error: 'Update failed',
        requestId,
      },
      { status: 500 }
    );
  }
}

/**
 * Delete subscription
 * DELETE /api/alerts?subscriptionId=xxx
 */
export async function DELETE(request: NextRequest) {
  const requestId = crypto.randomUUID();
  
  try {
    const searchParams = request.nextUrl.searchParams;
    const subscriptionId = searchParams.get('subscriptionId');

    if (!subscriptionId) {
      return NextResponse.json(
        { error: 'Missing subscriptionId parameter' },
        { status: 400 }
      );
    }

    const success = planningAlertService.deleteSubscription(subscriptionId);

    if (!success) {
      return NextResponse.json(
        { error: 'Subscription not found' },
        { status: 404 }
      );
    }

    logger.info('Subscription deleted', {
      requestId,
      subscriptionId,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error('Subscription deletion failed', {
      requestId,
      error: error instanceof Error ? error.message : 'Unknown error',
    });

    return NextResponse.json(
      { 
        error: 'Deletion failed',
        requestId,
      },
      { status: 500 }
    );
  }
}
