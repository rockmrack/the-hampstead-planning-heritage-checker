import { NextRequest, NextResponse } from 'next/server';
import { 
  permitTrackerService,
  type ApplicationType,
  type PermitStatus,
  type PermitNote,
  type ConsulteeResponse,
  type PermitCondition
} from '@/lib/services/permit-tracker';

export const dynamic = 'force-dynamic';

/**
 * Permit Tracker API
 * 
 * Comprehensive tracking of planning permit lifecycle:
 * - View and manage permits
 * - Track application status
 * - Monitor conditions
 * - View timelines
 */

// GET /api/permits - List permits or get specific permit
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const action = searchParams.get('action') || 'list';
    
    switch (action) {
      case 'list': {
        const userId = searchParams.get('userId');
        if (!userId) {
          return NextResponse.json(
            { success: false, error: 'User ID is required' },
            { status: 400 }
          );
        }
        
        const permits = await permitTrackerService.getUserPermits(userId);
        
        return NextResponse.json({
          success: true,
          data: permits,
        });
      }
      
      case 'get': {
        const permitId = searchParams.get('id');
        if (!permitId) {
          return NextResponse.json(
            { success: false, error: 'Permit ID is required' },
            { status: 400 }
          );
        }
        
        const permit = await permitTrackerService.getPermit(permitId);
        
        if (!permit) {
          return NextResponse.json(
            { success: false, error: 'Permit not found' },
            { status: 404 }
          );
        }
        
        return NextResponse.json({
          success: true,
          data: permit,
        });
      }
      
      case 'summary': {
        const userId = searchParams.get('userId');
        if (!userId) {
          return NextResponse.json(
            { success: false, error: 'User ID is required' },
            { status: 400 }
          );
        }
        
        const summary = await permitTrackerService.getPermitSummary(userId);
        
        return NextResponse.json({
          success: true,
          data: summary,
        });
      }
      
      case 'timeline': {
        const permitId = searchParams.get('id');
        if (!permitId) {
          return NextResponse.json(
            { success: false, error: 'Permit ID is required' },
            { status: 400 }
          );
        }
        
        const timeline = await permitTrackerService.getPermitTimeline(permitId);
        
        if (!timeline) {
          return NextResponse.json(
            { success: false, error: 'Permit not found' },
            { status: 404 }
          );
        }
        
        return NextResponse.json({
          success: true,
          data: timeline,
        });
      }
      
      case 'area-stats': {
        const postcode = searchParams.get('postcode');
        if (!postcode) {
          return NextResponse.json(
            { success: false, error: 'Postcode is required' },
            { status: 400 }
          );
        }
        
        const stats = await permitTrackerService.getAreaStatistics(postcode);
        
        return NextResponse.json({
          success: true,
          data: stats,
        });
      }
      
      default:
        return NextResponse.json(
          { success: false, error: 'Unknown action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Permits GET error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch permit data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// POST /api/permits - Create or update permit
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const action = body.action || 'create';
    
    switch (action) {
      case 'create': {
        const { userId, propertyAddress, postcode, applicationType } = body;
        
        if (!userId || !propertyAddress || !postcode || !applicationType) {
          return NextResponse.json(
            { 
              success: false, 
              error: 'Missing required fields: userId, propertyAddress, postcode, applicationType' 
            },
            { status: 400 }
          );
        }
        
        const permit = await permitTrackerService.createPermit({
          userId,
          propertyAddress,
          postcode,
          applicationType: applicationType as ApplicationType,
        });
        
        return NextResponse.json({
          success: true,
          data: permit,
        }, { status: 201 });
      }
      
      case 'update-status': {
        const { permitId, status, notes } = body;
        
        if (!permitId || !status) {
          return NextResponse.json(
            { success: false, error: 'Permit ID and status are required' },
            { status: 400 }
          );
        }
        
        const permit = await permitTrackerService.updatePermitStatus(
          permitId, 
          status as PermitStatus, 
          notes
        );
        
        if (!permit) {
          return NextResponse.json(
            { success: false, error: 'Permit not found' },
            { status: 404 }
          );
        }
        
        return NextResponse.json({
          success: true,
          data: permit,
        });
      }
      
      case 'add-condition': {
        const { permitId, condition } = body;
        
        if (!permitId || !condition) {
          return NextResponse.json(
            { success: false, error: 'Permit ID and condition are required' },
            { status: 400 }
          );
        }
        
        const permit = await permitTrackerService.addCondition(permitId, condition as Omit<PermitCondition, 'id' | 'status'>);
        
        if (!permit) {
          return NextResponse.json(
            { success: false, error: 'Permit not found' },
            { status: 404 }
          );
        }
        
        return NextResponse.json({
          success: true,
          data: permit,
        });
      }
      
      case 'update-condition': {
        const { permitId, conditionId, status, dischargeRef } = body;
        
        if (!permitId || !conditionId || !status) {
          return NextResponse.json(
            { success: false, error: 'Permit ID, condition ID, and status are required' },
            { status: 400 }
          );
        }
        
        const permit = await permitTrackerService.updateConditionStatus(
          permitId, 
          conditionId, 
          status as PermitCondition['status'],
          dischargeRef
        );
        
        if (!permit) {
          return NextResponse.json(
            { success: false, error: 'Permit or condition not found' },
            { status: 404 }
          );
        }
        
        return NextResponse.json({
          success: true,
          data: permit,
        });
      }
      
      case 'add-consultee': {
        const { permitId, consultee } = body;
        
        if (!permitId || !consultee) {
          return NextResponse.json(
            { success: false, error: 'Permit ID and consultee response are required' },
            { status: 400 }
          );
        }
        
        const permit = await permitTrackerService.addConsulteeResponse(permitId, consultee as ConsulteeResponse);
        
        if (!permit) {
          return NextResponse.json(
            { success: false, error: 'Permit not found' },
            { status: 404 }
          );
        }
        
        return NextResponse.json({
          success: true,
          data: permit,
        });
      }
      
      case 'add-note': {
        const { permitId, author, content, category } = body;
        
        if (!permitId || !author || !content) {
          return NextResponse.json(
            { success: false, error: 'Permit ID, author, and content are required' },
            { status: 400 }
          );
        }
        
        const permit = await permitTrackerService.addNote(
          permitId, 
          author, 
          content, 
          (category || 'user_note') as PermitNote['category']
        );
        
        if (!permit) {
          return NextResponse.json(
            { success: false, error: 'Permit not found' },
            { status: 404 }
          );
        }
        
        return NextResponse.json({
          success: true,
          data: permit,
        });
      }
      
      default:
        return NextResponse.json(
          { success: false, error: 'Unknown action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Permits POST error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to process permit request',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// OPTIONS - API documentation
export async function OPTIONS() {
  return NextResponse.json({
    success: true,
    endpoints: {
      listPermits: {
        method: 'GET',
        path: '/api/permits?action=list&userId={userId}',
      },
      getPermit: {
        method: 'GET',
        path: '/api/permits?action=get&id={permitId}',
      },
      getPermitSummary: {
        method: 'GET',
        path: '/api/permits?action=summary&userId={userId}',
      },
      getTimeline: {
        method: 'GET',
        path: '/api/permits?action=timeline&id={permitId}',
      },
      getAreaStats: {
        method: 'GET',
        path: '/api/permits?action=area-stats&postcode={postcode}',
      },
      createPermit: {
        method: 'POST',
        path: '/api/permits',
        body: {
          action: 'create',
          userId: 'string (required)',
          propertyAddress: 'string (required)',
          postcode: 'string (required)',
          applicationType: 'ApplicationType (required)'
        }
      },
      updateStatus: {
        method: 'POST',
        path: '/api/permits',
        body: {
          action: 'update-status',
          permitId: 'string (required)',
          status: 'PermitStatus (required)',
          notes: 'string (optional)'
        }
      },
      addCondition: {
        method: 'POST',
        path: '/api/permits',
        body: {
          action: 'add-condition',
          permitId: 'string (required)',
          condition: 'PermitCondition (required)'
        }
      },
      addNote: {
        method: 'POST',
        path: '/api/permits',
        body: {
          action: 'add-note',
          permitId: 'string (required)',
          author: 'string (required)',
          content: 'string (required)',
          category: 'general|officer_update|user_note|system (optional)'
        }
      }
    },
    applicationTypes: [
      'full_planning', 'householder', 'listed_building', 'conservation_area',
      'prior_approval', 'lawful_development', 'advertisement', 'tree_works', 'discharge_conditions'
    ],
    permitStatuses: [
      'draft', 'submitted', 'validated', 'pending_decision', 'approved',
      'approved_with_conditions', 'refused', 'withdrawn', 'appealed'
    ]
  });
}
