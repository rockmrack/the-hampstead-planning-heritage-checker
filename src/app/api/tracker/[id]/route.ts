/**
 * Application Tracking API - Individual Application
 * 
 * GET /api/tracker/[id] - Get application details and timeline
 * PATCH /api/tracker/[id] - Update application status
 * POST /api/tracker/[id]/communication - Log a communication
 * POST /api/tracker/[id]/document - Add a document
 */

import { NextRequest, NextResponse } from 'next/server';
import { applicationTracker } from '@/lib/services/real-time-tracker';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const application = applicationTracker.getApplication(id);
    
    if (!application) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      );
    }
    
    const timeline = applicationTracker.getTimeline(id);
    const pendingAlerts = applicationTracker.getPendingAlerts(id);
    
    return NextResponse.json({
      success: true,
      application: {
        id: application.id,
        reference: application.reference,
        address: application.address,
        postcode: application.postcode,
        description: application.description,
        applicationType: application.applicationType,
        status: application.status,
        decision: application.decision,
        submittedDate: application.submittedDate.toISOString(),
        validatedDate: application.validatedDate?.toISOString(),
        targetDecisionDate: application.targetDecisionDate.toISOString(),
        actualDecisionDate: application.actualDecisionDate?.toISOString(),
        officer: application.officer,
        conditions: application.conditions,
        milestones: application.milestones.map(m => ({
          ...m,
          scheduledDate: m.scheduledDate?.toISOString(),
          completedDate: m.completedDate?.toISOString(),
        })),
        documents: application.documents.map(d => ({
          ...d,
          uploadedDate: d.uploadedDate.toISOString(),
        })),
        communications: application.communications.map(c => ({
          ...c,
          date: c.date.toISOString(),
          actionDeadline: c.actionDeadline?.toISOString(),
        })),
        borough: application.borough,
        ward: application.ward,
        createdAt: application.createdAt.toISOString(),
        updatedAt: application.updatedAt.toISOString(),
      },
      timeline,
      alerts: pendingAlerts,
    });
    
  } catch (error) {
    console.error('Get application error:', error);
    return NextResponse.json(
      { error: 'Failed to get application' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    if (!body.status) {
      return NextResponse.json(
        { error: 'Status is required' },
        { status: 400 }
      );
    }
    
    const validStatuses = [
      'draft', 'submitted', 'validated', 'consultation', 'assessment',
      'committee', 'decision', 'approved', 'refused', 'withdrawn', 'appeal'
    ];
    
    if (!validStatuses.includes(body.status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }
    
    const application = applicationTracker.updateStatus(id, body.status, body.notes);
    
    if (!application) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      application: {
        id: application.id,
        reference: application.reference,
        status: application.status,
        updatedAt: application.updatedAt.toISOString(),
      },
    });
    
  } catch (error) {
    console.error('Update application error:', error);
    return NextResponse.json(
      { error: 'Failed to update application' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const action = body.action;
    
    if (action === 'communication') {
      // Log communication
      if (!body.type || !body.summary) {
        return NextResponse.json(
          { error: 'Communication type and summary are required' },
          { status: 400 }
        );
      }
      
      const application = applicationTracker.logCommunication(id, {
        type: body.type,
        direction: body.direction || 'incoming',
        date: body.date ? new Date(body.date) : new Date(),
        summary: body.summary,
        details: body.details,
        attachments: body.attachments,
        actionRequired: body.actionRequired || false,
        actionDeadline: body.actionDeadline ? new Date(body.actionDeadline) : undefined,
      });
      
      if (!application) {
        return NextResponse.json(
          { error: 'Application not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json({
        success: true,
        message: 'Communication logged',
      });
      
    } else if (action === 'document') {
      // Add document
      if (!body.name) {
        return NextResponse.json(
          { error: 'Document name is required' },
          { status: 400 }
        );
      }
      
      const application = applicationTracker.addDocument(id, {
        name: body.name,
        type: body.type || 'other',
        status: body.status || 'draft',
        uploadedDate: new Date(),
        url: body.url,
        notes: body.notes,
      });
      
      if (!application) {
        return NextResponse.json(
          { error: 'Application not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json({
        success: true,
        message: 'Document added',
      });
      
    } else if (action === 'read_alert') {
      // Mark alert as read
      if (!body.alertId) {
        return NextResponse.json(
          { error: 'Alert ID is required' },
          { status: 400 }
        );
      }
      
      applicationTracker.markAlertRead(id, body.alertId);
      
      return NextResponse.json({
        success: true,
        message: 'Alert marked as read',
      });
      
    } else {
      return NextResponse.json(
        { error: 'Invalid action. Use: communication, document, or read_alert' },
        { status: 400 }
      );
    }
    
  } catch (error) {
    console.error('Application action error:', error);
    return NextResponse.json(
      { error: 'Failed to perform action' },
      { status: 500 }
    );
  }
}
