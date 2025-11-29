/**
 * Professional Marketplace API
 * 
 * GET /api/marketplace - Search professionals
 * GET /api/marketplace/featured - Get featured professionals
 * GET /api/marketplace/recommendations - Get project recommendations
 * POST /api/marketplace/quote - Submit quote request
 */

import { NextRequest, NextResponse } from 'next/server';
import { professionalMarketplace, ProfessionalType, SearchCriteria, Specialization, VerificationLevel } from '@/lib/services/professional-marketplace';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    
    if (action === 'featured') {
      // Get featured professionals
      const limit = parseInt(searchParams.get('limit') || '6');
      const featured = professionalMarketplace.getFeatured(limit);
      
      return NextResponse.json({
        success: true,
        professionals: featured.map(formatProfessional),
      });
    }
    
    if (action === 'heritage') {
      // Get heritage specialists
      const postcode = searchParams.get('postcode');
      const specialists = professionalMarketplace.getHeritageSpecialists(postcode || undefined);
      
      return NextResponse.json({
        success: true,
        professionals: specialists.map(formatProfessional),
      });
    }
    
    if (action === 'types') {
      // Get professional types with counts
      const types = professionalMarketplace.getProfessionalTypes();
      
      return NextResponse.json({
        success: true,
        types,
      });
    }
    
    if (action === 'recommendations') {
      // Get project recommendations
      const projectType = searchParams.get('projectType') || 'extension';
      const postcode = searchParams.get('postcode') || 'NW3';
      const heritageStatus = (searchParams.get('heritageStatus') || 'GREEN') as 'RED' | 'AMBER' | 'GREEN';
      const budget = searchParams.get('budget') ? parseInt(searchParams.get('budget')!) : undefined;
      
      const recommendations = professionalMarketplace.getRecommendationsForProject({
        projectType,
        postcode,
        heritageStatus,
        budget,
      });
      
      return NextResponse.json({
        success: true,
        recommendations: {
          architects: recommendations.architects.map(formatSearchResult),
          builders: recommendations.builders.map(formatSearchResult),
          consultants: recommendations.consultants.map(formatSearchResult),
        },
      });
    }
    
    // Default: Search professionals
    const criteria: SearchCriteria = {};
    
    if (searchParams.get('type')) {
      criteria.type = searchParams.get('type') as ProfessionalType;
    }
    
    if (searchParams.get('postcode')) {
      criteria.postcode = searchParams.get('postcode')!;
    }
    
    if (searchParams.get('borough')) {
      criteria.borough = searchParams.get('borough')!;
    }
    
    if (searchParams.get('minRating')) {
      criteria.minRating = parseFloat(searchParams.get('minRating')!);
    }
    
    if (searchParams.get('verificationLevel')) {
      criteria.verificationLevel = searchParams.get('verificationLevel') as VerificationLevel;
    }
    
    if (searchParams.get('heritageSpecialist') === 'true') {
      criteria.heritageSpecialist = true;
    }
    
    if (searchParams.get('availableNow') === 'true') {
      criteria.availableNow = true;
    }
    
    if (searchParams.get('specializations')) {
      criteria.specializations = searchParams.get('specializations')!.split(',') as Specialization[];
    }
    
    if (searchParams.get('sortBy')) {
      criteria.sortBy = searchParams.get('sortBy') as SearchCriteria['sortBy'];
    }
    
    const results = professionalMarketplace.search(criteria);
    
    return NextResponse.json({
      success: true,
      count: results.length,
      results: results.map(formatSearchResult),
    });
    
  } catch (error) {
    console.error('Marketplace search error:', error);
    return NextResponse.json(
      { error: 'Failed to search professionals' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields for quote request
    if (!body.clientName || !body.clientEmail) {
      return NextResponse.json(
        { error: 'Client name and email are required' },
        { status: 400 }
      );
    }
    
    if (!body.address || !body.postcode) {
      return NextResponse.json(
        { error: 'Property address and postcode are required' },
        { status: 400 }
      );
    }
    
    if (!body.projectDescription) {
      return NextResponse.json(
        { error: 'Project description is required' },
        { status: 400 }
      );
    }
    
    if (!body.selectedProfessionals?.length) {
      return NextResponse.json(
        { error: 'At least one professional must be selected' },
        { status: 400 }
      );
    }
    
    // Submit quote request
    const quoteRequest = professionalMarketplace.submitQuoteRequest({
      clientName: body.clientName,
      clientEmail: body.clientEmail,
      clientPhone: body.clientPhone,
      address: body.address,
      postcode: body.postcode,
      projectType: body.projectType || 'extension',
      projectDescription: body.projectDescription,
      heritageContext: body.heritageContext,
      budget: body.budget,
      timeline: body.timeline,
      selectedProfessionals: body.selectedProfessionals,
    });
    
    return NextResponse.json({
      success: true,
      quoteRequest: {
        id: quoteRequest.id,
        status: quoteRequest.status,
        selectedCount: quoteRequest.selectedProfessionals.length,
        createdAt: quoteRequest.createdAt.toISOString(),
      },
      message: `Quote request sent to ${quoteRequest.selectedProfessionals.length} professional(s). You will receive responses within 48 hours.`,
    });
    
  } catch (error) {
    console.error('Quote request error:', error);
    return NextResponse.json(
      { error: 'Failed to submit quote request' },
      { status: 500 }
    );
  }
}

// Helper functions
function formatProfessional(prof: ReturnType<typeof professionalMarketplace.getProfessional>) {
  if (!prof) return null;
  
  return {
    id: prof.id,
    type: prof.type,
    companyName: prof.companyName,
    contactName: prof.contactName,
    email: prof.email,
    phone: prof.phone,
    website: prof.website,
    address: prof.address,
    coverageAreas: prof.coverageAreas,
    specializations: prof.specializations,
    accreditations: prof.accreditations.map(a => ({
      body: a.body,
      level: a.level,
      verified: a.verified,
    })),
    verification: {
      level: prof.verification.level,
      badges: prof.verification.badges,
    },
    ratings: prof.ratings,
    availability: {
      status: prof.availability.status,
      leadTime: prof.availability.leadTime,
    },
    pricing: prof.pricing,
    portfolio: prof.portfolio.filter(p => p.featured).slice(0, 3),
    reviewHighlights: prof.reviews.slice(0, 2),
  };
}

function formatSearchResult(result: { professional: NonNullable<ReturnType<typeof professionalMarketplace.getProfessional>>; matchScore: number; matchReasons: string[]; distance?: number }) {
  return {
    ...formatProfessional(result.professional),
    matchScore: Math.round(result.matchScore),
    matchReasons: result.matchReasons,
    distance: result.distance,
  };
}
