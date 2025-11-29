/**
 * Completion Certificate API
 * 
 * Provides guidance for obtaining completion certificates and sign-offs
 */

import { NextRequest, NextResponse } from 'next/server';
import completionCertificate from '@/lib/services/completion-certificate';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      address, 
      postcode, 
      projectType,
      buildingControlProvider,
      planningRef,
      conditions,
      hasGasWork,
      hasElectricalWork,
      isMultiUnit,
      hasBasement,
      warrantyProvider
    } = body;

    if (!address || !postcode || !projectType) {
      return NextResponse.json(
        { error: 'Address, postcode, and project type are required' },
        { status: 400 }
      );
    }

    const assessment = await completionCertificate.getCompletionAssessment(
      address,
      postcode,
      projectType,
      {
        buildingControlProvider,
        planningRef,
        conditions,
        hasGasWork,
        hasElectricalWork,
        isMultiUnit,
        hasBasement,
        warrantyProvider
      }
    );

    return NextResponse.json({
      success: true,
      data: assessment
    });
  } catch (error) {
    console.error('Completion assessment error:', error);
    return NextResponse.json(
      { error: 'Failed to generate completion assessment' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'occupancy-check') {
      const bcCertificateIssued = searchParams.get('bcCertificate') === 'true';
      const epcObtained = searchParams.get('epc') === 'true';
      const gasSafeCertificate = searchParams.get('gasSafe') === 'true';
      const electricalCertificate = searchParams.get('electrical') === 'true';
      const preOccupationConditionsMet = searchParams.get('conditions') === 'true';

      const readiness = await completionCertificate.checkOccupancyReadiness({
        bcCertificateIssued,
        epcObtained,
        gasSafeCertificate,
        electricalCertificate,
        preOccupationConditionsMet
      });

      return NextResponse.json({
        success: true,
        data: readiness
      });
    }

    return NextResponse.json(
      { error: 'Valid action parameter required' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Occupancy check error:', error);
    return NextResponse.json(
      { error: 'Failed to check occupancy readiness' },
      { status: 500 }
    );
  }
}
