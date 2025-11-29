/**
 * Post-Occupancy Evaluation API
 * 
 * Provides guidance for post-completion evaluation and maintenance
 */

import { NextRequest, NextResponse } from 'next/server';
import postOccupancy from '@/lib/services/post-occupancy';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      address, 
      postcode, 
      projectType,
      completionDate,
      contractorDetails,
      warrantyProvider,
      hasUnderfloorHeating,
      hasMVHR,
      hasHeatPump,
      isBasement
    } = body;

    if (!address || !postcode || !projectType) {
      return NextResponse.json(
        { error: 'Address, postcode, and project type are required' },
        { status: 400 }
      );
    }

    const evaluation = await postOccupancy.getPostOccupancyEvaluation(
      address,
      postcode,
      projectType,
      {
        completionDate,
        contractorDetails,
        warrantyProvider,
        hasUnderfloorHeating,
        hasMVHR,
        hasHeatPump,
        isBasement
      }
    );

    return NextResponse.json({
      success: true,
      data: evaluation
    });
  } catch (error) {
    console.error('Post-occupancy evaluation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate post-occupancy evaluation' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'defects-template') {
      const template = await postOccupancy.getDefectsNotificationTemplate();

      return NextResponse.json({
        success: true,
        data: template
      });
    }

    return NextResponse.json(
      { error: 'Valid action parameter required (defects-template)' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Template retrieval error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve template' },
      { status: 500 }
    );
  }
}
