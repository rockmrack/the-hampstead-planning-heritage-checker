/**
 * Notifications API Routes
 * 
 * Manages user notifications, preferences, and subscriptions.
 */

import { NextRequest, NextResponse } from 'next/server';
import { notificationService } from '@/lib/services/notification-service';

// GET /api/notifications - Get user notifications
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'demo-user';
    const action = searchParams.get('action') || 'list';
    const status = searchParams.get('status') as 'unread' | 'read' | 'all' | undefined;
    const category = searchParams.get('category') as Parameters<typeof notificationService.getNotifications>[1]['category'];
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : undefined;
    
    switch (action) {
      case 'list': {
        const result = await notificationService.getNotifications(userId, {
          status: status || 'all',
          category,
          limit,
          offset
        });
        
        return NextResponse.json({
          success: true,
          data: result,
          timestamp: new Date().toISOString()
        });
      }
      
      case 'preferences': {
        const preferences = await notificationService.getPreferences(userId);
        
        return NextResponse.json({
          success: true,
          data: preferences,
          timestamp: new Date().toISOString()
        });
      }
      
      case 'statistics': {
        const statistics = await notificationService.getStatistics(userId);
        
        return NextResponse.json({
          success: true,
          data: statistics,
          timestamp: new Date().toISOString()
        });
      }
      
      default:
        return NextResponse.json(
          { success: false, error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }
    
  } catch (error) {
    console.error('Notifications GET error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to get notifications' 
      },
      { status: 500 }
    );
  }
}

// POST /api/notifications - Create notification or perform action
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action = 'create', userId = 'demo-user' } = body;
    
    switch (action) {
      case 'create': {
        const { type, title, message, priority, metadata, actionUrl, actionLabel, expiresAt } = body;
        
        if (!type || !title || !message) {
          return NextResponse.json(
            { success: false, error: 'Type, title, and message are required' },
            { status: 400 }
          );
        }
        
        const notification = await notificationService.createNotification({
          userId,
          type,
          title,
          message,
          priority,
          metadata,
          actionUrl,
          actionLabel,
          expiresAt: expiresAt ? new Date(expiresAt) : undefined
        });
        
        return NextResponse.json({
          success: true,
          data: notification,
          timestamp: new Date().toISOString()
        });
      }
      
      case 'deadline-reminder': {
        const { applicationId, propertyAddress, deadlineType, deadlineDate, actionRequired } = body;
        
        if (!applicationId || !deadlineDate) {
          return NextResponse.json(
            { success: false, error: 'applicationId and deadlineDate are required' },
            { status: 400 }
          );
        }
        
        const notification = await notificationService.createDeadlineReminder({
          userId,
          applicationId,
          propertyAddress: propertyAddress || 'Unknown Property',
          deadlineType: deadlineType || 'Submission',
          deadlineDate: new Date(deadlineDate),
          actionRequired: actionRequired || 'Action required'
        });
        
        return NextResponse.json({
          success: true,
          data: notification,
          timestamp: new Date().toISOString()
        });
      }
      
      case 'mark-read': {
        const { notificationId } = body;
        
        if (!notificationId) {
          return NextResponse.json(
            { success: false, error: 'notificationId is required' },
            { status: 400 }
          );
        }
        
        const success = await notificationService.markAsRead(userId, notificationId);
        
        return NextResponse.json({
          success,
          message: success ? 'Marked as read' : 'Notification not found',
          timestamp: new Date().toISOString()
        });
      }
      
      case 'mark-all-read': {
        const { category } = body;
        const count = await notificationService.markAllAsRead(userId, category);
        
        return NextResponse.json({
          success: true,
          data: { markedCount: count },
          timestamp: new Date().toISOString()
        });
      }
      
      case 'archive': {
        const { notificationId } = body;
        
        if (!notificationId) {
          return NextResponse.json(
            { success: false, error: 'notificationId is required' },
            { status: 400 }
          );
        }
        
        const success = await notificationService.archive(userId, notificationId);
        
        return NextResponse.json({
          success,
          message: success ? 'Archived' : 'Notification not found',
          timestamp: new Date().toISOString()
        });
      }
      
      case 'subscribe': {
        const { subscriptionType, value, notifyOn } = body;
        
        if (!subscriptionType || !value) {
          return NextResponse.json(
            { success: false, error: 'subscriptionType and value are required' },
            { status: 400 }
          );
        }
        
        const subscription = await notificationService.addSubscription(userId, {
          type: subscriptionType,
          value,
          notifyOn: notifyOn || ['application_update', 'policy_change'],
          active: true
        });
        
        return NextResponse.json({
          success: true,
          data: subscription,
          timestamp: new Date().toISOString()
        });
      }
      
      case 'unsubscribe': {
        const { subscriptionId } = body;
        
        if (!subscriptionId) {
          return NextResponse.json(
            { success: false, error: 'subscriptionId is required' },
            { status: 400 }
          );
        }
        
        const success = await notificationService.removeSubscription(userId, subscriptionId);
        
        return NextResponse.json({
          success,
          message: success ? 'Unsubscribed' : 'Subscription not found',
          timestamp: new Date().toISOString()
        });
      }
      
      default:
        return NextResponse.json(
          { success: false, error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }
    
  } catch (error) {
    console.error('Notifications POST error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to process notification action' 
      },
      { status: 500 }
    );
  }
}

// PATCH /api/notifications - Update preferences
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId = 'demo-user', ...updates } = body;
    
    const preferences = await notificationService.updatePreferences(userId, updates);
    
    return NextResponse.json({
      success: true,
      data: preferences,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Notifications PATCH error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to update preferences' 
      },
      { status: 500 }
    );
  }
}
