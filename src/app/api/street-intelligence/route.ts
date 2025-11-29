import { NextRequest, NextResponse } from 'next/server';
import { streetIntelligenceService } from '@/lib/services/street-intelligence';
import { StreetAPIResponse } from '@/types/street';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const slug = searchParams.get('slug');

  if (!slug) {
    return NextResponse.json(
      { success: false, error: 'Street slug is required' },
      { status: 400 }
    );
  }

  try {
    const streetData = await streetIntelligenceService.getStreetData(slug);

    if (!streetData) {
      return NextResponse.json(
        { success: false, error: 'Street not found' },
        { status: 404 }
      );
    }

    const response: StreetAPIResponse = {
      success: true,
      data: streetData,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching street data:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
