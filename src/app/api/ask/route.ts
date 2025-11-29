/**
 * Natural Language Query API Route
 */

import { NextRequest, NextResponse } from 'next/server';
import { naturalLanguageQuery } from '@/lib/services/natural-language-query';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, context } = body;
    
    if (!query) {
      return NextResponse.json(
        { error: 'Missing required field: query' },
        { status: 400 }
      );
    }
    
    const result = naturalLanguageQuery.processQuery(query, context);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Natural language query error:', error);
    return NextResponse.json(
      { error: 'Failed to process query' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const partialQuery = searchParams.get('q') || '';
  
  // Return suggestions for partial queries
  const suggestions = naturalLanguageQuery.getSuggestions(partialQuery);
  
  return NextResponse.json({
    suggestions,
    examples: [
      'Can I build a 4m extension without planning?',
      'What are the rules for loft conversions in NW3?',
      'How much does a basement cost in Hampstead?',
      'Is my house in a conservation area?',
      'What are my chances of approval for a rear extension?',
      'Find similar extensions on my street',
    ],
  });
}
