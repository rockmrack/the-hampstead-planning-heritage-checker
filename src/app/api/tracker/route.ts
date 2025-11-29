/**
 * Application Tracking API
 * 
 * POST /api/tracker - Create a new tracked application
 * GET /api/tracker - Get all applications for user
 * GET /api/tracker/[id] - Get specific application
 * PATCH /api/tracker/[id] - Update application status
 */

import { NextRequest, NextResponse } from 'next/server';
import { applicationTracker } from '@/lib/services/real-time-tracker';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.reference) {
      return NextResponse.json(
        { error: 'Application reference is required' },
        { status: 400 }
      );
    }
    
    if (!body.address) {
      return NextResponse.json(
        { error: 'Property address is required' },
        { status: 400 }
      );
    }
    
    // Create the tracked application
    const application = applicationTracker.createApplication({
      reference: body.reference,
      address: body.address,
      postcode: body.postcode || '',
      description: body.description || '',
      applicationType: body.applicationType || 'householder',
      submittedDate: body.submittedDate ? new Date(body.submittedDate) : new Date(),
      borough: body.borough || 'Camden',
      ward: body.ward || '',
      userId: body.userId || 'anonymous',
    });
    
    return NextResponse.json({
      success: true,
      application: {
        id: application.id,
        reference: application.reference,
        address: application.address,
        status: application.status,
        submittedDate: application.submittedDate.toISOString(),
        targetDecisionDate: application.targetDecisionDate.toISOString(),
        milestones: application.milestones,
      },
    });
    
  } catch (error) {
    console.error('Create application error:', error);
    return NextResponse.json(
      { error: 'Failed to create tracked application' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'anonymous';
    
    const applications = applicationTracker.getUserApplications(userId);
    const stats = applicationTracker.getUserStats(userId);
    
    return NextResponse.json({
      success: true,
      applications: applications.map(app => ({
        id: app.id,
        reference: app.reference,
        address: app.address,
        status: app.status,
        decision: app.decision,
        submittedDate: app.submittedDate.toISOString(),
        targetDecisionDate: app.targetDecisionDate.toISOString(),
        actualDecisionDate: app.actualDecisionDate?.toISOString(),
        pendingAlerts: app.alerts.filter(a => !a.readAt).length,
      })),
      stats,
    });
    
  } catch (error) {
    console.error('Get applications error:', error);
    return NextResponse.json(
      { error: 'Failed to get applications' },
      { status: 500 }
    );
  }
}
