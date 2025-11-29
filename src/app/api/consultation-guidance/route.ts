/**
 * Neighbour Consultation API
 * 
 * Guidance on planning consultation and making effective objections
 */

import { NextRequest, NextResponse } from 'next/server';
import NeighbourConsultationService from '@/lib/services/neighbour-consultation';

const consultationService = new NeighbourConsultationService();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      address,
      applicationReference,
      applicationType,
      proposalDescription,
      concernType,
      specificConcerns,
      isConservationArea,
      involveListedBuilding,
      numberOfObjectors
    } = body;
    
    if (!address || !proposalDescription || !concernType) {
      return NextResponse.json(
        { error: 'Address, proposal description, and concern type are required' },
        { status: 400 }
      );
    }
    
    const assessment = consultationService.generateConsultationGuidance({
      address,
      applicationReference,
      applicationType,
      proposalDescription,
      concernType,
      specificConcerns,
      isConservationArea: isConservationArea || false,
      involveListedBuilding: involveListedBuilding || false,
      numberOfObjectors
    });
    
    return NextResponse.json({
      success: true,
      data: assessment,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Neighbour consultation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate consultation guidance' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    
    // Get valid objection grounds
    if (action === 'valid-grounds') {
      const grounds = consultationService.getValidObjectionGrounds();
      
      return NextResponse.json({
        success: true,
        data: grounds,
        timestamp: new Date().toISOString()
      });
    }
    
    // Get invalid objection grounds
    if (action === 'invalid-grounds') {
      const grounds = consultationService.getInvalidObjectionGrounds();
      
      return NextResponse.json({
        success: true,
        data: grounds,
        timestamp: new Date().toISOString()
      });
    }
    
    // Get writing guidance
    if (action === 'writing-guidance') {
      const guidance = consultationService.getWritingGuidance();
      
      return NextResponse.json({
        success: true,
        data: guidance,
        timestamp: new Date().toISOString()
      });
    }
    
    // Get committee process info
    if (action === 'committee') {
      const process = consultationService.getCommitteeProcessInfo();
      
      return NextResponse.json({
        success: true,
        data: process,
        timestamp: new Date().toISOString()
      });
    }
    
    // Get timelines
    if (action === 'timelines') {
      const timelines = consultationService.getConsultationTimelines();
      
      return NextResponse.json({
        success: true,
        data: timelines,
        timestamp: new Date().toISOString()
      });
    }
    
    // Generate objection template
    if (action === 'template') {
      const applicantAddress = searchParams.get('address');
      const applicationRef = searchParams.get('ref');
      const concerns = searchParams.get('concerns');
      
      if (!applicantAddress || !applicationRef) {
        return NextResponse.json(
          { error: 'Address and reference are required for template' },
          { status: 400 }
        );
      }
      
      const concernList = concerns ? concerns.split(',') : ['[Describe your concerns here]'];
      const template = consultationService.generateObjectionTemplate(
        applicantAddress,
        applicationRef,
        concernList
      );
      
      return NextResponse.json({
        success: true,
        data: { template },
        timestamp: new Date().toISOString()
      });
    }
    
    // Default: return overview
    return NextResponse.json({
      success: true,
      data: {
        validGrounds: consultationService.getValidObjectionGrounds(),
        invalidGrounds: consultationService.getInvalidObjectionGrounds(),
        writingGuidance: consultationService.getWritingGuidance(),
        timelines: consultationService.getConsultationTimelines()
      },
      message: 'Use POST to generate guidance for a specific situation',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Neighbour consultation error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve consultation information' },
      { status: 500 }
    );
  }
}
