/**
 * Document Generation API
 * 
 * POST /api/documents - Generate a planning document
 * GET /api/documents/types - Get available document types
 */

import { NextRequest, NextResponse } from 'next/server';
import { documentGenerator, DocumentRequest, DocumentType } from '@/lib/services/document-generator';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.type) {
      return NextResponse.json(
        { error: 'Document type is required' },
        { status: 400 }
      );
    }
    
    if (!body.property?.address) {
      return NextResponse.json(
        { error: 'Property address is required' },
        { status: 400 }
      );
    }
    
    if (!body.project?.description) {
      return NextResponse.json(
        { error: 'Project description is required' },
        { status: 400 }
      );
    }
    
    if (!body.applicant?.name) {
      return NextResponse.json(
        { error: 'Applicant name is required' },
        { status: 400 }
      );
    }
    
    // Generate the document
    const documentRequest: DocumentRequest = {
      type: body.type as DocumentType,
      property: {
        address: body.property.address,
        postcode: body.property.postcode || '',
        borough: body.property.borough || 'Camden',
        heritageStatus: body.property.heritageStatus || 'GREEN',
        listedBuilding: body.property.listedBuilding || null,
        conservationArea: body.property.conservationArea || null,
        hasArticle4: body.property.hasArticle4 || false,
        propertyType: body.property.propertyType || 'terraced',
        buildYear: body.property.buildYear,
        architecturalStyle: body.property.architecturalStyle,
        existingCondition: body.property.existingCondition,
      },
      project: {
        type: body.project.type || 'extension',
        description: body.project.description,
        dimensions: body.project.dimensions,
        materials: body.project.materials,
        designRationale: body.project.designRationale,
        impactOnNeighbors: body.project.impactOnNeighbors,
        sustainabilityFeatures: body.project.sustainabilityFeatures,
      },
      applicant: {
        name: body.applicant.name,
        email: body.applicant.email,
        phone: body.applicant.phone,
        isOwner: body.applicant.isOwner ?? true,
        agentName: body.applicant.agentName,
        architectName: body.applicant.architectName,
      },
      options: body.options,
    };
    
    const document = await documentGenerator.generateDocument(documentRequest);
    
    return NextResponse.json({
      success: true,
      document: {
        id: document.id,
        type: document.type,
        title: document.title,
        content: document.content,
        sections: document.sections,
        metadata: document.metadata,
        createdAt: document.createdAt.toISOString(),
      },
    });
    
  } catch (error) {
    console.error('Document generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate document' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const heritageStatus = searchParams.get('heritageStatus') as 'RED' | 'AMBER' | 'GREEN' | null;
  
  // Return available document types with info
  const allTypes: DocumentType[] = [
    'heritage_statement',
    'design_access_statement',
    'planning_statement',
    'neighbor_letter',
    'party_wall_notice',
    'pre_application_letter',
  ];
  
  const documentsInfo = allTypes.map(type => ({
    type,
    ...documentGenerator.getDocumentInfo(type),
    recommended: type === 'heritage_statement' 
      ? heritageStatus === 'RED'
      : type === 'design_access_statement'
      ? heritageStatus !== 'GREEN'
      : type === 'neighbor_letter',
  }));
  
  return NextResponse.json({
    success: true,
    documents: documentsInfo,
  });
}
