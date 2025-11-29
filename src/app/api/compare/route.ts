/**
 * Comparison Tool API
 * 
 * Compare properties, areas, and projects side-by-side.
 * 
 * GET /api/compare?type=quick&approvalRate=0.7&processingTime=10&constraints=2&cost=150000
 * POST /api/compare - Full comparison
 */

import { NextRequest, NextResponse } from 'next/server';
import { comparisonService } from '@/lib/services/comparison-tool';

/**
 * GET - Quick comparison score
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type') || 'quick';
    
    if (type === 'quick') {
      const approvalRate = parseFloat(searchParams.get('approvalRate') || '0.7');
      const processingTime = parseInt(searchParams.get('processingTime') || '10');
      const heritageConstraints = parseInt(searchParams.get('constraints') || '0');
      const cost = parseInt(searchParams.get('cost') || '100000');
      
      const result = comparisonService.getQuickScore({
        approvalRate,
        processingTime,
        heritageConstraints,
        cost
      });
      
      return NextResponse.json({
        success: true,
        ...result,
        inputs: {
          approvalRate,
          processingTime,
          heritageConstraints,
          cost
        }
      });
    }
    
    return NextResponse.json(
      { error: 'Invalid comparison type' },
      { status: 400 }
    );
    
  } catch (error) {
    console.error('Comparison GET error:', error);
    return NextResponse.json(
      { error: 'Comparison failed' },
      { status: 500 }
    );
  }
}

/**
 * POST - Full comparison
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, items } = body;
    
    if (!type || !items || !Array.isArray(items)) {
      return NextResponse.json(
        { error: 'Type and items array required' },
        { status: 400 }
      );
    }
    
    if (items.length < 2) {
      return NextResponse.json(
        { error: 'At least 2 items required for comparison' },
        { status: 400 }
      );
    }
    
    if (items.length > 5) {
      return NextResponse.json(
        { error: 'Maximum 5 items for comparison' },
        { status: 400 }
      );
    }
    
    let result;
    
    switch (type) {
      case 'properties':
        // Validate property inputs
        for (const item of items) {
          if (!item.address || !item.postcode) {
            return NextResponse.json(
              { error: 'Each property needs address and postcode' },
              { status: 400 }
            );
          }
        }
        result = await comparisonService.compareProperties(items);
        break;
        
      case 'areas':
        // Validate area inputs
        const postcodes = items.filter((item: unknown) => typeof item === 'string') as string[];
        if (postcodes.length !== items.length) {
          return NextResponse.json(
            { error: 'Areas comparison requires array of postcodes' },
            { status: 400 }
          );
        }
        result = await comparisonService.compareAreas(postcodes);
        break;
        
      case 'projects':
        // Validate project inputs
        for (const item of items) {
          if (!item.type || !item.postcode || !item.sizeSqm) {
            return NextResponse.json(
              { error: 'Each project needs type, postcode, and sizeSqm' },
              { status: 400 }
            );
          }
        }
        result = await comparisonService.compareProjects(items);
        break;
        
      default:
        return NextResponse.json(
          { error: 'Invalid comparison type. Use: properties, areas, or projects' },
          { status: 400 }
        );
    }
    
    return NextResponse.json({
      success: true,
      type,
      comparison: result
    });
    
  } catch (error) {
    console.error('Comparison POST error:', error);
    return NextResponse.json(
      { error: 'Comparison failed' },
      { status: 500 }
    );
  }
}
