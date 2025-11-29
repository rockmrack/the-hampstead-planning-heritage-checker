/**
 * Enforcement Response API
 * 
 * Guidance for responding to planning enforcement action
 */

import { NextRequest, NextResponse } from 'next/server';
import enforcementResponse from '@/lib/services/enforcement-response';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      address, 
      postcode, 
      enforcementType,
      noticeReceived,
      noticeDate,
      breachType,
      breachDate,
      complianceDeadline,
      currentStatus,
      developmentDescription
    } = body;

    if (!address || !postcode || !enforcementType) {
      return NextResponse.json(
        { error: 'Address, postcode, and enforcement type are required' },
        { status: 400 }
      );
    }

    const guide = await enforcementResponse.getEnforcementResponseGuide(
      address,
      postcode,
      enforcementType,
      {
        noticeReceived,
        noticeDate,
        breachType,
        breachDate,
        complianceDeadline,
        currentStatus,
        developmentDescription
      }
    );

    return NextResponse.json({
      success: true,
      data: guide
    });
  } catch (error) {
    console.error('Enforcement response guide error:', error);
    return NextResponse.json(
      { error: 'Failed to generate enforcement response guide' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const breachType = searchParams.get('breachType') as 'operational' | 'change-of-use' | 'breach-condition' | 'residential-dwelling' | null;
    const breachDate = searchParams.get('breachDate');
    const continuous = searchParams.get('continuous') === 'true';

    if (breachType && breachDate) {
      const immunity = await enforcementResponse.checkImmunity(
        breachType,
        breachDate,
        continuous
      );
      
      return NextResponse.json({
        success: true,
        data: immunity
      });
    }

    // Return general enforcement information
    return NextResponse.json({
      success: true,
      data: {
        noticeTypes: {
          enforcementNotice: {
            name: 'Enforcement Notice',
            description: 'Formal notice requiring breach to be remedied',
            appealable: true,
            compliancePeriod: '28 days minimum'
          },
          breachOfConditionNotice: {
            name: 'Breach of Condition Notice (BCN)',
            description: 'Notice for breach of planning condition',
            appealable: false,
            compliancePeriod: '28 days minimum'
          },
          planningContraventionNotice: {
            name: 'Planning Contravention Notice (PCN)',
            description: 'Request for information about alleged breach',
            appealable: false,
            responsePeriod: '21 days'
          },
          section215Notice: {
            name: 'Section 215 Notice',
            description: 'Notice to remedy untidy land/buildings',
            appealable: true,
            compliancePeriod: '28 days minimum'
          },
          stopNotice: {
            name: 'Stop Notice',
            description: 'Requires cessation of activity',
            appealable: false,
            effectivePeriod: '3-28 days'
          },
          temporaryStopNotice: {
            name: 'Temporary Stop Notice',
            description: 'Immediate prohibition (28 days max)',
            appealable: false,
            effectivePeriod: 'Immediate'
          }
        },
        immunityPeriods: {
          operations: { years: 4, description: 'Building works' },
          changeOfUse: { years: 10, description: 'Change of use' },
          breachOfCondition: { years: 10, description: 'Condition breach' },
          dwellingUse: { years: 4, description: 'Use as dwelling' }
        },
        keyAdvice: [
          'Never ignore enforcement notices',
          'Note all deadlines - especially appeal deadlines',
          'Seek professional advice promptly',
          'Consider all options before deciding approach',
          'Communicate constructively with enforcement team'
        ]
      }
    });
  } catch (error) {
    console.error('Enforcement info error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve enforcement information' },
      { status: 500 }
    );
  }
}
