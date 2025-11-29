/**
 * Certificate of Lawfulness API
 * 
 * Guidance on CLEUD and CLOPUD applications
 */

import { NextRequest, NextResponse } from 'next/server';
import CertificateOfLawfulnessService from '@/lib/services/certificate-of-lawfulness';

const clService = new CertificateOfLawfulnessService();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      address,
      certificateType,
      developmentType,
      description,
      startDate,
      completionDate,
      isListedBuilding,
      isConservationArea,
      hasEnforcementHistory,
      evidenceAvailable,
      proposedPDClass
    } = body;
    
    if (!address || !certificateType || !developmentType) {
      return NextResponse.json(
        { error: 'Address, certificate type, and development type are required' },
        { status: 400 }
      );
    }
    
    const assessment = clService.generateCLEUDGuidance({
      address,
      certificateType,
      developmentType,
      description: description || 'Development as described',
      startDate,
      completionDate,
      isListedBuilding: isListedBuilding || false,
      isConservationArea: isConservationArea || false,
      hasEnforcementHistory: hasEnforcementHistory || false,
      evidenceAvailable,
      proposedPDClass
    });
    
    return NextResponse.json({
      success: true,
      data: assessment,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Certificate of lawfulness error:', error);
    return NextResponse.json(
      { error: 'Failed to generate certificate guidance' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    
    // Get certificate type information
    if (action === 'type') {
      const typeKey = searchParams.get('key');
      if (!typeKey) {
        return NextResponse.json(
          { error: 'Type key is required' },
          { status: 400 }
        );
      }
      
      const typeInfo = clService.getCertificateTypeInfo(typeKey);
      
      if (!typeInfo) {
        return NextResponse.json(
          { error: 'Unknown certificate type' },
          { status: 404 }
        );
      }
      
      return NextResponse.json({
        success: true,
        data: typeInfo,
        timestamp: new Date().toISOString()
      });
    }
    
    // Get time limit information
    if (action === 'time-limits') {
      const timeLimits = clService.getTimeLimitInfo();
      
      return NextResponse.json({
        success: true,
        data: timeLimits,
        timestamp: new Date().toISOString()
      });
    }
    
    // Get evidence guidance
    if (action === 'evidence') {
      const evidence = clService.getEvidenceGuidance();
      
      return NextResponse.json({
        success: true,
        data: evidence,
        timestamp: new Date().toISOString()
      });
    }
    
    // Get refusal reasons
    if (action === 'refusal-reasons') {
      const reasons = clService.getRefusalReasons();
      
      return NextResponse.json({
        success: true,
        data: reasons,
        timestamp: new Date().toISOString()
      });
    }
    
    // Default: return overview
    return NextResponse.json({
      success: true,
      data: {
        cleud: clService.getCertificateTypeInfo('cleud'),
        clopud: clService.getCertificateTypeInfo('clopud'),
        timeLimits: clService.getTimeLimitInfo(),
        evidenceGuidance: clService.getEvidenceGuidance()
      },
      message: 'Use POST to generate guidance for a specific case',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Certificate of lawfulness error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve certificate information' },
      { status: 500 }
    );
  }
}
