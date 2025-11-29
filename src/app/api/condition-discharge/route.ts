/**
 * Condition Discharge API
 * 
 * Guidance for discharging planning conditions
 */

import { NextRequest, NextResponse } from 'next/server';
import conditionDischarge from '@/lib/services/condition-discharge';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      address, 
      postcode, 
      applicationReference,
      conditions
    } = body;

    if (!address || !postcode) {
      return NextResponse.json(
        { error: 'Address and postcode are required' },
        { status: 400 }
      );
    }

    const guide = await conditionDischarge.getConditionDischargeGuide(
      address,
      postcode,
      applicationReference,
      conditions
    );

    return NextResponse.json({
      success: true,
      data: guide
    });
  } catch (error) {
    console.error('Condition discharge guide error:', error);
    return NextResponse.json(
      { error: 'Failed to generate condition discharge guide' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const reference = searchParams.get('reference');
    const conditionsParam = searchParams.get('conditions');

    if (!reference) {
      return NextResponse.json(
        { error: 'Application reference is required' },
        { status: 400 }
      );
    }

    const conditionNumbers = conditionsParam 
      ? conditionsParam.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n))
      : [];

    if (conditionNumbers.length === 0) {
      return NextResponse.json(
        { error: 'At least one condition number is required' },
        { status: 400 }
      );
    }

    const status = await conditionDischarge.checkConditionStatus(
      reference,
      conditionNumbers
    );

    return NextResponse.json({
      success: true,
      data: status
    });
  } catch (error) {
    console.error('Condition status check error:', error);
    return NextResponse.json(
      { error: 'Failed to check condition status' },
      { status: 500 }
    );
  }
}
