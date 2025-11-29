/**
 * Professionals API
 * Find architects, surveyors, and heritage consultants
 * GET/POST /api/professionals
 */

import { NextRequest, NextResponse } from 'next/server';

// Types
type ProfessionalType = 'architect' | 'surveyor' | 'heritage_consultant' | 'planning_consultant' | 'structural_engineer';
type Specialization = 'residential' | 'commercial' | 'heritage' | 'conservation' | 'listed_buildings' | 'extensions' | 'basements' | 'new_build';

interface Professional {
  id: string;
  name: string;
  company: string;
  type: ProfessionalType;
  specializations: Specialization[];
  heritageExperience: number; // years
  hampsteadProjects: number;
  rating: number;
  reviews: number;
  contact: {
    email: string;
    phone: string;
    website?: string;
  };
  accreditations: string[];
  areasCovered: string[];
  priceRange: 'budget' | 'mid_range' | 'premium';
}

// Sample professionals database
const PROFESSIONALS: Professional[] = [
  {
    id: 'arch-001',
    name: 'Sarah Mitchell',
    company: 'Mitchell Heritage Architects',
    type: 'architect',
    specializations: ['heritage', 'conservation', 'listed_buildings', 'extensions'],
    heritageExperience: 18,
    hampsteadProjects: 45,
    rating: 4.9,
    reviews: 127,
    contact: {
      email: 'sarah@mitchellheritage.co.uk',
      phone: '020 7946 0958',
      website: 'www.mitchellheritage.co.uk',
    },
    accreditations: ['RIBA', 'AABC', 'IHBC'],
    areasCovered: ['NW3', 'NW6', 'NW8', 'N6'],
    priceRange: 'premium',
  },
  {
    id: 'arch-002',
    name: 'James Patterson',
    company: 'Patterson & Co Architects',
    type: 'architect',
    specializations: ['residential', 'extensions', 'basements'],
    heritageExperience: 12,
    hampsteadProjects: 32,
    rating: 4.7,
    reviews: 89,
    contact: {
      email: 'james@pattersonco.co.uk',
      phone: '020 7946 1234',
    },
    accreditations: ['RIBA', 'ARB'],
    areasCovered: ['NW3', 'NW1', 'NW5', 'N6'],
    priceRange: 'mid_range',
  },
  {
    id: 'surv-001',
    name: 'David Chen',
    company: 'Chen Building Surveyors',
    type: 'surveyor',
    specializations: ['heritage', 'conservation'],
    heritageExperience: 15,
    hampsteadProjects: 78,
    rating: 4.8,
    reviews: 156,
    contact: {
      email: 'david@chensurveyors.co.uk',
      phone: '020 7946 5678',
      website: 'www.chensurveyors.co.uk',
    },
    accreditations: ['RICS', 'CIOB'],
    areasCovered: ['NW3', 'NW6', 'NW11', 'N2', 'N6'],
    priceRange: 'mid_range',
  },
  {
    id: 'hc-001',
    name: 'Dr. Elizabeth Grant',
    company: 'Grant Heritage Consulting',
    type: 'heritage_consultant',
    specializations: ['heritage', 'conservation', 'listed_buildings'],
    heritageExperience: 25,
    hampsteadProjects: 120,
    rating: 5.0,
    reviews: 67,
    contact: {
      email: 'elizabeth@granthc.co.uk',
      phone: '020 7946 9012',
      website: 'www.grantheritageconsulting.co.uk',
    },
    accreditations: ['IHBC', 'MCIfA', 'FSA'],
    areasCovered: ['NW3', 'NW6', 'NW8', 'NW11', 'N6', 'N10'],
    priceRange: 'premium',
  },
  {
    id: 'pc-001',
    name: 'Michael Roberts',
    company: 'Roberts Planning Ltd',
    type: 'planning_consultant',
    specializations: ['residential', 'conservation', 'extensions'],
    heritageExperience: 10,
    hampsteadProjects: 55,
    rating: 4.6,
    reviews: 93,
    contact: {
      email: 'michael@robertsplanning.co.uk',
      phone: '020 7946 3456',
    },
    accreditations: ['RTPI', 'RICS'],
    areasCovered: ['NW3', 'NW1', 'NW5', 'NW6'],
    priceRange: 'mid_range',
  },
  {
    id: 'se-001',
    name: 'Anna Williams',
    company: 'Williams Structural Engineers',
    type: 'structural_engineer',
    specializations: ['heritage', 'basements', 'conservation'],
    heritageExperience: 14,
    hampsteadProjects: 41,
    rating: 4.8,
    reviews: 72,
    contact: {
      email: 'anna@williamsstructural.co.uk',
      phone: '020 7946 7890',
      website: 'www.williamsstructural.co.uk',
    },
    accreditations: ['IStructE', 'CEng', 'MICE'],
    areasCovered: ['NW3', 'NW6', 'NW8', 'N6'],
    priceRange: 'premium',
  },
];

interface SearchCriteria {
  postcode?: string;
  type?: ProfessionalType;
  specialization?: Specialization;
  minRating?: number;
  priceRange?: 'budget' | 'mid_range' | 'premium';
  heritageExpertise?: boolean;
}

function findProfessionals(criteria: SearchCriteria): Professional[] {
  let results = [...PROFESSIONALS];
  
  if (criteria.type) {
    results = results.filter(p => p.type === criteria.type);
  }
  
  if (criteria.postcode) {
    const areaMatch = criteria.postcode.match(/^(NW\d{1,2}|N\d{1,2})/i);
    const area = areaMatch && areaMatch[1] ? areaMatch[1].toUpperCase() : null;
    if (area) {
      results = results.filter(p => p.areasCovered.includes(area));
    }
  }
  
  if (criteria.specialization) {
    results = results.filter(p => p.specializations.includes(criteria.specialization as Specialization));
  }
  
  if (criteria.minRating !== undefined && criteria.minRating !== null) {
    results = results.filter(p => p.rating >= criteria.minRating!);
  }
  
  if (criteria.priceRange) {
    results = results.filter(p => p.priceRange === criteria.priceRange);
  }
  
  if (criteria.heritageExpertise) {
    results = results.filter(p => 
      p.specializations.includes('heritage') || 
      p.specializations.includes('conservation') ||
      p.specializations.includes('listed_buildings')
    );
  }
  
  // Sort by rating and heritage experience
  results.sort((a, b) => {
    const scoreA = a.rating * 10 + a.heritageExperience;
    const scoreB = b.rating * 10 + b.heritageExperience;
    return scoreB - scoreA;
  });
  
  return results;
}

function getProfessionalById(id: string): Professional | undefined {
  return PROFESSIONALS.find(p => p.id === id);
}

function getRecommendationsForProject(projectType: string, postcode: string): Professional[] {
  const criteria: SearchCriteria = { postcode };
  
  // Determine specializations needed
  const lowerType = projectType.toLowerCase();
  if (lowerType.includes('listed') || lowerType.includes('heritage')) {
    criteria.heritageExpertise = true;
  }
  if (lowerType.includes('basement')) {
    criteria.specialization = 'basements';
  }
  if (lowerType.includes('extension')) {
    criteria.specialization = 'extensions';
  }
  
  criteria.minRating = 4.5;
  
  return findProfessionals(criteria).slice(0, 5);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;
    
    if (action === 'search') {
      const criteria: SearchCriteria = {
        postcode: body.postcode,
        type: body.type,
        specialization: body.specialization,
        minRating: body.minRating,
        priceRange: body.priceRange,
        heritageExpertise: body.heritageExpertise,
      };
      
      const professionals = findProfessionals(criteria);
      
      return NextResponse.json({
        success: true,
        count: professionals.length,
        professionals,
        filters: criteria,
      });
    }
    
    if (action === 'recommend') {
      if (!body.projectType || !body.postcode) {
        return NextResponse.json(
          { error: 'Missing required fields: projectType, postcode' },
          { status: 400 }
        );
      }
      
      const recommendations = getRecommendationsForProject(body.projectType, body.postcode);
      
      return NextResponse.json({
        success: true,
        projectType: body.projectType,
        recommendations,
        advice: 'For heritage properties, we recommend engaging a heritage consultant early in the process.',
      });
    }
    
    return NextResponse.json(
      { error: 'Invalid action. Use "search" or "recommend".' },
      { status: 400 }
    );
    
  } catch (error) {
    console.error('Professional finder error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const type = searchParams.get('type') as ProfessionalType | null;
  const postcode = searchParams.get('postcode');
  
  if (id) {
    const professional = getProfessionalById(id);
    if (professional) {
      return NextResponse.json({ professional });
    }
    return NextResponse.json({ error: 'Professional not found' }, { status: 404 });
  }
  
  if (type || postcode) {
    const criteria: SearchCriteria = {};
    if (type) criteria.type = type;
    if (postcode) criteria.postcode = postcode;
    
    const professionals = findProfessionals(criteria);
    return NextResponse.json({
      count: professionals.length,
      professionals,
    });
  }
  
  // Return service info
  return NextResponse.json({
    service: 'Professional Finder API',
    version: '1.0.0',
    description: 'Find architects, surveyors, and heritage consultants',
    endpoints: {
      'GET /api/professionals': 'Service info',
      'GET /api/professionals?id=arch-001': 'Get professional by ID',
      'GET /api/professionals?type=architect': 'List by type',
      'GET /api/professionals?postcode=NW3': 'List by area',
      'POST /api/professionals': 'Search or get recommendations',
    },
    professionalTypes: ['architect', 'surveyor', 'heritage_consultant', 'planning_consultant', 'structural_engineer'],
    specializations: ['residential', 'commercial', 'heritage', 'conservation', 'listed_buildings', 'extensions', 'basements', 'new_build'],
    totalProfessionals: PROFESSIONALS.length,
  });
}
