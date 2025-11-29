/**
 * Planning Copilot API
 * 
 * Enhanced AI assistant endpoints for planning queries
 * with context-aware responses and suggested actions.
 * 
 * GET /api/copilot?sessionId=xxx - Get conversation history
 * POST /api/copilot - Send message to copilot
 * DELETE /api/copilot?sessionId=xxx - Clear conversation
 */

import { NextRequest, NextResponse } from 'next/server';
import { planningCopilot } from '@/lib/services/planning-copilot';

/**
 * GET - Get conversation history and suggested questions
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const sessionId = searchParams.get('sessionId');
    const action = searchParams.get('action') || 'history';
    
    if (!sessionId && action === 'history') {
      return NextResponse.json(
        { error: 'Session ID required' },
        { status: 400 }
      );
    }
    
    switch (action) {
      case 'history':
        const conversation = planningCopilot.getConversation(sessionId!);
        
        if (!conversation) {
          return NextResponse.json({
            sessionId,
            messages: [],
            suggestedQuestions: planningCopilot.getSuggestedQuestions()
          });
        }
        
        return NextResponse.json({
          sessionId: conversation.sessionId,
          messages: conversation.messages,
          extractedEntities: conversation.extractedEntities,
          suggestedQuestions: planningCopilot.getSuggestedQuestions({
            postcode: conversation.extractedEntities.postcodes[0],
            projectType: conversation.extractedEntities.projectTypes[0]
          })
        });
        
      case 'suggestions':
        const postcode = searchParams.get('postcode') || undefined;
        const projectType = searchParams.get('projectType') || undefined;
        const isConservationArea = searchParams.get('conservationArea') === 'true';
        const isListedBuilding = searchParams.get('listedBuilding') === 'true';
        
        const suggestions = planningCopilot.getSuggestedQuestions({
          postcode,
          projectType,
          isConservationArea,
          isListedBuilding
        });
        
        return NextResponse.json({ suggestions });
        
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
    
  } catch (error) {
    console.error('Copilot GET error:', error);
    return NextResponse.json(
      { error: 'Failed to get conversation' },
      { status: 500 }
    );
  }
}

/**
 * POST - Send message to copilot
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, message, userId, context } = body;
    
    // Validate required fields
    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID required' },
        { status: 400 }
      );
    }
    
    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message required' },
        { status: 400 }
      );
    }
    
    // Limit message length
    if (message.length > 2000) {
      return NextResponse.json(
        { error: 'Message too long (max 2000 characters)' },
        { status: 400 }
      );
    }
    
    // Get response from copilot
    const response = await planningCopilot.chat({
      sessionId,
      message,
      userId,
      context
    });
    
    return NextResponse.json({
      success: true,
      response: {
        message: response.message,
        confidence: response.confidence,
        sources: response.sources,
        suggestedActions: response.suggestedActions,
        followUpQuestions: response.followUpQuestions,
        relatedData: response.relatedData
      }
    });
    
  } catch (error) {
    console.error('Copilot POST error:', error);
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    );
  }
}

/**
 * DELETE - Clear conversation
 */
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const sessionId = searchParams.get('sessionId');
    
    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID required' },
        { status: 400 }
      );
    }
    
    const cleared = planningCopilot.clearConversation(sessionId);
    
    return NextResponse.json({
      success: true,
      cleared,
      message: cleared ? 'Conversation cleared' : 'No conversation found'
    });
    
  } catch (error) {
    console.error('Copilot DELETE error:', error);
    return NextResponse.json(
      { error: 'Failed to clear conversation' },
      { status: 500 }
    );
  }
}
