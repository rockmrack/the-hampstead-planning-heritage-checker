/**
 * Certificate of Lawfulness API
 * 
 * Assesses eligibility for CLEUD and CLOPUD certificates
 */

import { NextRequest, NextResponse } from 'next/server';
import certificateLawfulness from '@/lib/services/certificate-lawfulness';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      address, 
      postcode, 
      certificateType,
      development,
      developmentType,
      completionDate,
      continuousUse,
      evidenceAvailable,
      article4Direction,
      conservationArea,
      listedBuilding
    } = body;

    if (!address || !postcode || !certificateType || !development) {
      return NextResponse.json(
        { error: 'Address, postcode, certificate type, and development description are required' },
        { status: 400 }
      );
    }

    if (certificateType !== 'CLEUD' && certificateType !== 'CLOPUD') {
      return NextResponse.json(
        { error: 'Certificate type must be CLEUD or CLOPUD' },
        { status: 400 }
      );
    }

    const assessment = await certificateLawfulness.assessCertificateEligibility(
      address,
      postcode,
      certificateType,
      development,
      {
        developmentType,
        completionDate,
        continuousUse,
        evidenceAvailable,
        article4Direction,
        conservationArea,
        listedBuilding
      }
    );

    return NextResponse.json({
      success: true,
      data: assessment
    });
  } catch (error) {
    console.error('Certificate assessment error:', error);
    return NextResponse.json(
      { error: 'Failed to assess certificate eligibility' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const developmentType = searchParams.get('developmentType');

    if (developmentType) {
      const pdInfo = await certificateLawfulness.getPermittedDevelopmentInfo(developmentType);
      
      if (!pdInfo) {
        return NextResponse.json(
          { error: 'Development type not found in permitted development database' },
          { status: 404 }
        );
      }
      
      return NextResponse.json({
        success: true,
        data: pdInfo
      });
    }

    // Return general information about certificates
    return NextResponse.json({
      success: true,
      data: {
        CLEUD: {
          name: 'Certificate of Lawful Use or Development (Existing)',
          description: 'Confirms existing development or use is lawful due to immunity period',
          timePeriods: {
            operations: '4 years for building operations',
            changeOfUse: '10 years for change of use',
            dwelling: '4 years for use as dwelling'
          },
          fee: 289,
          determination: '8 weeks'
        },
        CLOPUD: {
          name: 'Certificate of Lawful Use or Development (Proposed)',
          description: 'Confirms proposed development is permitted development',
          purpose: 'Provides certainty before starting works',
          fee: 289,
          determination: '8 weeks',
          hampsteadNote: 'Article 4 directions restrict PD in most of Hampstead'
        },
        guidance: [
          'CLEUD requires strong evidence of dates and continuity',
          'CLOPUD requires demonstration of PD compliance',
          'Article 4 areas (common in Hampstead) restrict PD rights',
          'Listed buildings have no PD rights for most works',
          'Seek professional advice for borderline cases'
        ]
      }
    });
  } catch (error) {
    console.error('Certificate info error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve certificate information' },
      { status: 500 }
    );
  }
}
