/**
 * Construction Phase Management API
 * 
 * Provides comprehensive guidance for managing construction phases
 */

import { NextRequest, NextResponse } from 'next/server';
import constructionPhase from '@/lib/services/construction-phase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      address, 
      postcode, 
      projectType,
      estimatedDuration,
      startDate,
      contractValue,
      numWorkers,
      hasBasement,
      partyWallsAffected,
      listedBuilding,
      conservationArea,
      planningConditions
    } = body;

    if (!address || !postcode || !projectType) {
      return NextResponse.json(
        { error: 'Address, postcode, and project type are required' },
        { status: 400 }
      );
    }

    const management = await constructionPhase.getConstructionManagement(
      address,
      postcode,
      projectType,
      {
        estimatedDuration,
        startDate,
        contractValue,
        numWorkers,
        hasBasement,
        partyWallsAffected,
        listedBuilding,
        conservationArea,
        planningConditions
      }
    );

    return NextResponse.json({
      success: true,
      data: management
    });
  } catch (error) {
    console.error('Construction phase management error:', error);
    return NextResponse.json(
      { error: 'Failed to generate construction management plan' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const phase = searchParams.get('phase');

    if (!phase) {
      return NextResponse.json(
        { error: 'Phase parameter is required' },
        { status: 400 }
      );
    }

    // Get phase-specific checklist
    const checklist = await constructionPhase.getPhaseChecklist(phase);

    return NextResponse.json({
      success: true,
      data: checklist
    });
  } catch (error) {
    console.error('Phase checklist error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve phase checklist' },
      { status: 500 }
    );
  }
}
