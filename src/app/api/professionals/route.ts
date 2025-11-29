/**
 * Professionals API
 * GET /api/professionals
 */

import { NextRequest, NextResponse } from 'next/server';
import { 
  findProfessionals,
  getProfessionalsBySpecialization,
  Professional,
  ProfessionalCategory,
  PROFESSIONAL_DIRECTORY 
} from '@/lib/config/professionals';
import { logger } from '@/lib/logging';

export async function GET(request: NextRequest) {
  const requestId = crypto.randomUUID();
  
  try {
    const searchParams = request.nextUrl.searchParams;
    
    const category = searchParams.get('category') as ProfessionalCategory | null;
    const specialization = searchParams.get('specialization');
    const borough = searchParams.get('borough');
    const priceRange = searchParams.get('priceRange') as Professional['priceRange'] | null;
    const limit = parseInt(searchParams.get('limit') || '20');

    logger.info('Professionals search requested', {
      requestId,
      category,
      specialization,
      borough,
      priceRange,
    });

    let professionals: Professional[];

    if (specialization) {
      // Search by specialization
      professionals = getProfessionalsBySpecialization(specialization);
    } else if (category || borough || priceRange) {
      // Search with filters
      professionals = findProfessionals({
        category: category || undefined,
        borough: borough || undefined,
        priceRange: priceRange || undefined,
      });
    } else {
      // Return all
      professionals = Object.values(PROFESSIONAL_DIRECTORY).flat();
    }

    // Sort by rating by default
    professionals.sort((a, b) => b.rating - a.rating);

    // Apply limit
    professionals = professionals.slice(0, limit);

    logger.info('Professionals search completed', {
      requestId,
      resultsCount: professionals.length,
    });

    return NextResponse.json({
      success: true,
      requestId,
      count: professionals.length,
      professionals,
    });
  } catch (error) {
    logger.error('Professionals search failed', {
      requestId,
      error: error instanceof Error ? error.message : 'Unknown error',
    });

    return NextResponse.json(
      { 
        error: 'Search failed',
        requestId,
      },
      { status: 500 }
    );
  }
}

/**
 * Get professional by ID
 * GET /api/professionals/[id]
 */
export async function POST(request: NextRequest) {
  const requestId = crypto.randomUUID();
  
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Missing professional ID' },
        { status: 400 }
      );
    }

    const allProfessionals = Object.values(PROFESSIONAL_DIRECTORY).flat();
    const professional = allProfessionals.find(p => p.id === id);

    if (!professional) {
      return NextResponse.json(
        { error: 'Professional not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      requestId,
      professional,
    });
  } catch (error) {
    logger.error('Professional lookup failed', {
      requestId,
      error: error instanceof Error ? error.message : 'Unknown error',
    });

    return NextResponse.json(
      { 
        error: 'Lookup failed',
        requestId,
      },
      { status: 500 }
    );
  }
}
