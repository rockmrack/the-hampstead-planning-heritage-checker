/**
 * Party Wall API
 * 
 * Assessment of Party Wall Act requirements
 */

import { NextRequest, NextResponse } from 'next/server';
import partyWall from '@/lib/services/party-wall';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      address, 
      postcode, 
      projectType,
      workDescription,
      excavationDepth,
      distanceFromBoundary,
      sharedWalls,
      adjacentProperties,
      existingRelationship
    } = body;

    if (!address || !postcode || !projectType) {
      return NextResponse.json(
        { error: 'Address, postcode, and project type are required' },
        { status: 400 }
      );
    }

    const assessment = await partyWall.assessPartyWallRequirements(
      address,
      postcode,
      projectType,
      {
        workDescription,
        excavationDepth,
        distanceFromBoundary,
        sharedWalls,
        adjacentProperties,
        existingRelationship
      }
    );

    return NextResponse.json({
      success: true,
      data: assessment
    });
  } catch (error) {
    console.error('Party wall assessment error:', error);
    return NextResponse.json(
      { error: 'Failed to assess party wall requirements' },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Return general party wall information
  return NextResponse.json({
    success: true,
    data: {
      sections: {
        section1: {
          name: 'Line of Junction',
          description: 'Building new wall on or at boundary',
          noticePeriod: '1 month',
          examples: ['New wall astride boundary', 'Wall up to boundary']
        },
        section2: {
          name: 'Party Structure Notice',
          description: 'Work to existing party wall or party fence wall',
          noticePeriod: '2 months',
          examples: ['Cutting into party wall', 'Raising party wall', 'Underpinning']
        },
        section6: {
          name: 'Adjacent Excavation',
          description: 'Excavation near neighboring buildings',
          noticePeriod: '1 month',
          examples: ['Basement excavation', 'Deep foundations within 3-6m']
        }
      },
      keyPrinciples: [
        'Building owner must serve notice before starting notifiable works',
        'Adjoining owner has 14 days to respond (consent or dissent)',
        'No response = deemed dissent - surveyors required',
        'Building owner pays surveyors fees (both parties)',
        'Schedule of Condition essential before works'
      ],
      costs: {
        agreedSurveyor: '£800-1,500',
        separateSurveyors: '£1,500-4,000+',
        scheduleOfCondition: '£200-600 per property'
      },
      timeline: {
        withConsent: '4-6 weeks',
        withSurveyors: '6-12 weeks',
        withDispute: '12+ weeks'
      }
    }
  });
}
