/**
 * AI Planning Copilot Chat API
 * 
 * Provides intelligent planning guidance through conversational AI.
 * Supports context-aware responses based on property heritage status.
 */

import { NextRequest, NextResponse } from 'next/server';
import { aiCopilot } from '@/lib/services/ai-copilot';

// Rate limiting state (simple in-memory, use Redis in production)
const rateLimits = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const limit = rateLimits.get(ip);
  
  if (!limit || now > limit.resetAt) {
    rateLimits.set(ip, { count: 1, resetAt: now + 60000 }); // 1 minute window
    return true;
  }
  
  if (limit.count >= 30) { // 30 requests per minute
    return false;
  }
  
  limit.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'anonymous';
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please wait before sending more messages.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { message, context, conversationHistory } = body;

    // Validate required fields
    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required and must be a string' },
        { status: 400 }
      );
    }

    if (message.length > 2000) {
      return NextResponse.json(
        { error: 'Message is too long. Maximum 2000 characters.' },
        { status: 400 }
      );
    }

    // Get AI response
    const response = await aiCopilot.chat(
      message,
      context || undefined,
      conversationHistory || []
    );

    return NextResponse.json({
      success: true,
      data: response,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process chat message',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const topic = searchParams.get('topic');

  // Get suggested questions
  const suggestions = aiCopilot.getSuggestedQuestions(
    topic as 'listed_buildings' | 'conservation' | 'article_4' | 'permitted_development' | 'general' | undefined
  );

  return NextResponse.json({
    success: true,
    data: {
      suggestions,
      topics: [
        { id: 'general', name: 'General Planning' },
        { id: 'listed_buildings', name: 'Listed Buildings' },
        { id: 'conservation', name: 'Conservation Areas' },
        { id: 'article_4', name: 'Article 4 Directions' },
        { id: 'permitted_development', name: 'Permitted Development' },
      ],
    },
    timestamp: new Date().toISOString(),
  });
}
