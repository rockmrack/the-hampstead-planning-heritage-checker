/**
 * Professional Marketplace Service
 * 
 * Connects homeowners with verified professionals:
 * - Heritage architects
 * - Planning consultants
 * - Structural engineers
 * - Builders & contractors
 * - Surveyors
 * - Party wall surveyors
 * 
 * Features:
 * - Verified reviews and ratings
 * - Heritage specialization matching
 * - Quote comparison
 * - Availability tracking
 * 
 * @module services/professional-marketplace
 */

// ===========================================
// TYPES
// ===========================================

export type ProfessionalType = 
  | 'architect'
  | 'planning_consultant'
  | 'structural_engineer'
  | 'builder'
  | 'surveyor'
  | 'party_wall_surveyor'
  | 'heritage_consultant'
  | 'interior_designer'
  | 'landscape_architect'
  | 'm_and_e_engineer';

export type Specialization =
  | 'listed_buildings'
  | 'conservation_areas'
  | 'basement_extensions'
  | 'loft_conversions'
  | 'rear_extensions'
  | 'side_extensions'
  | 'new_build'
  | 'refurbishment'
  | 'sustainable_design'
  | 'period_properties'
  | 'modern_design'
  | 'commercial'
  | 'residential';

export type VerificationLevel = 'basic' | 'verified' | 'premium' | 'elite';

export interface Professional {
  id: string;
  type: ProfessionalType;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  website?: string;
  address: {
    street?: string;
    city: string;
    postcode: string;
  };
  coverageAreas: string[]; // Postcodes or boroughs
  specializations: Specialization[];
  qualifications: Qualification[];
  accreditations: Accreditation[];
  insurance: InsuranceInfo;
  verification: VerificationInfo;
  portfolio: PortfolioItem[];
  reviews: Review[];
  ratings: RatingsSummary;
  availability: AvailabilityInfo;
  pricing: PricingInfo;
  createdAt: Date;
  updatedAt: Date;
}

export interface Qualification {
  title: string;
  institution?: string;
  year?: number;
  verified: boolean;
}

export interface Accreditation {
  body: string; // e.g., "RIBA", "RICS", "ARB", "IHBC"
  membershipNumber?: string;
  level?: string; // e.g., "Chartered", "Fellow"
  verified: boolean;
  expiryDate?: Date;
}

export interface InsuranceInfo {
  professionalIndemnity: {
    covered: boolean;
    amount?: number;
    verified: boolean;
    expiryDate?: Date;
  };
  publicLiability: {
    covered: boolean;
    amount?: number;
    verified: boolean;
    expiryDate?: Date;
  };
}

export interface VerificationInfo {
  level: VerificationLevel;
  identityVerified: boolean;
  qualificationsVerified: boolean;
  insuranceVerified: boolean;
  referencesChecked: boolean;
  lastVerifiedDate?: Date;
  badges: string[];
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  projectType: string;
  heritageContext?: 'listed_building' | 'conservation_area' | 'article_4' | 'none';
  completionDate: Date;
  images: string[];
  clientTestimonial?: string;
  borough?: string;
  featured: boolean;
}

export interface Review {
  id: string;
  clientName: string;
  projectType: string;
  date: Date;
  rating: number; // 1-5
  title: string;
  content: string;
  response?: {
    content: string;
    date: Date;
  };
  verified: boolean;
  projectReference?: string;
}

export interface RatingsSummary {
  overall: number;
  count: number;
  breakdown: {
    quality: number;
    communication: number;
    value: number;
    timeliness: number;
    heritage?: number; // For heritage specialists
  };
  distribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  recommendationRate: number; // % who would recommend
}

export interface AvailabilityInfo {
  status: 'available' | 'limited' | 'busy' | 'unavailable';
  nextAvailable?: Date;
  leadTime: string; // e.g., "2-3 weeks"
  currentProjects: number;
  maxProjects: number;
}

export interface PricingInfo {
  model: 'fixed' | 'hourly' | 'percentage' | 'negotiable';
  currency: string;
  indicativeRates?: {
    minimum?: number;
    maximum?: number;
    typical?: number;
    unit?: string;
  };
  freeConsultation: boolean;
  freeQuote: boolean;
}

export interface SearchCriteria {
  type?: ProfessionalType;
  specializations?: Specialization[];
  postcode?: string;
  borough?: string;
  minRating?: number;
  verificationLevel?: VerificationLevel;
  heritageSpecialist?: boolean;
  availableNow?: boolean;
  maxLeadTime?: number; // days
  sortBy?: 'rating' | 'reviews' | 'distance' | 'availability' | 'price';
}

export interface SearchResult {
  professional: Professional;
  distance?: number;
  matchScore: number;
  matchReasons: string[];
}

export interface QuoteRequest {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  address: string;
  postcode: string;
  projectType: string;
  projectDescription: string;
  heritageContext?: string;
  budget?: { min?: number; max?: number };
  timeline?: string;
  selectedProfessionals: string[]; // Professional IDs
  status: 'pending' | 'sent' | 'responded' | 'expired';
  createdAt: Date;
  responses: QuoteResponse[];
}

export interface QuoteResponse {
  professionalId: string;
  status: 'pending' | 'quoted' | 'declined';
  estimatedFee?: { min: number; max: number };
  estimatedTimeline?: string;
  notes?: string;
  respondedAt?: Date;
}

// ===========================================
// SAMPLE DATA
// ===========================================

const SAMPLE_PROFESSIONALS: Professional[] = [
  {
    id: 'prof-001',
    type: 'architect',
    companyName: 'Heritage & Modern Architecture Ltd',
    contactName: 'Sarah Williams',
    email: 'sarah@heritagemodern.co.uk',
    phone: '020 7123 4567',
    website: 'https://heritagemodern.co.uk',
    address: { city: 'London', postcode: 'NW3 2QG' },
    coverageAreas: ['NW3', 'NW5', 'NW6', 'N6', 'N10', 'Camden', 'Haringey'],
    specializations: ['listed_buildings', 'conservation_areas', 'period_properties', 'sustainable_design'],
    qualifications: [
      { title: 'BA (Hons) Architecture', institution: 'University of Cambridge', year: 2005, verified: true },
      { title: 'MArch', institution: 'Bartlett School of Architecture', year: 2007, verified: true },
    ],
    accreditations: [
      { body: 'RIBA', membershipNumber: '12345678', level: 'Chartered', verified: true },
      { body: 'ARB', membershipNumber: '087654', verified: true },
      { body: 'IHBC', level: 'Full Member', verified: true },
    ],
    insurance: {
      professionalIndemnity: { covered: true, amount: 5000000, verified: true },
      publicLiability: { covered: true, amount: 10000000, verified: true },
    },
    verification: {
      level: 'elite',
      identityVerified: true,
      qualificationsVerified: true,
      insuranceVerified: true,
      referencesChecked: true,
      badges: ['Heritage Specialist', 'Camden Recommended', 'Top Rated 2024'],
    },
    portfolio: [
      {
        id: 'port-001',
        title: 'Grade II Listed Georgian Townhouse Extension',
        description: 'Sympathetic rear extension to a Grade II listed Georgian property in Hampstead',
        projectType: 'rear_extension',
        heritageContext: 'listed_building',
        completionDate: new Date('2023-06-15'),
        images: ['/portfolio/heritage-1.jpg'],
        clientTestimonial: 'Sarah understood exactly what we needed and navigated the complex listed building consent process brilliantly.',
        borough: 'Camden',
        featured: true,
      },
      {
        id: 'port-002',
        title: 'Conservation Area Loft Conversion',
        description: 'Dormer loft conversion within the Hampstead Conservation Area with Article 4 constraints',
        projectType: 'loft_conversion',
        heritageContext: 'conservation_area',
        completionDate: new Date('2023-09-20'),
        images: ['/portfolio/loft-1.jpg'],
        borough: 'Camden',
        featured: true,
      },
    ],
    reviews: [
      {
        id: 'rev-001',
        clientName: 'James & Emma T.',
        projectType: 'Listed building extension',
        date: new Date('2023-07-10'),
        rating: 5,
        title: 'Outstanding heritage expertise',
        content: 'Sarah was exceptional from start to finish. Her knowledge of listed buildings and the planning process meant we got approval first time.',
        verified: true,
        projectReference: 'HM-2023-042',
      },
      {
        id: 'rev-002',
        clientName: 'Michael R.',
        projectType: 'Loft conversion',
        date: new Date('2023-10-05'),
        rating: 5,
        title: 'Professional and creative',
        content: 'Navigated the conservation area restrictions brilliantly and designed something we absolutely love.',
        verified: true,
      },
    ],
    ratings: {
      overall: 4.9,
      count: 47,
      breakdown: { quality: 4.9, communication: 4.8, value: 4.7, timeliness: 4.8, heritage: 5.0 },
      distribution: { 5: 42, 4: 4, 3: 1, 2: 0, 1: 0 },
      recommendationRate: 98,
    },
    availability: {
      status: 'limited',
      nextAvailable: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      leadTime: '2-3 weeks',
      currentProjects: 8,
      maxProjects: 10,
    },
    pricing: {
      model: 'percentage',
      currency: 'GBP',
      indicativeRates: { minimum: 8, maximum: 12, typical: 10, unit: '% of construction cost' },
      freeConsultation: true,
      freeQuote: true,
    },
    createdAt: new Date('2020-03-15'),
    updatedAt: new Date(),
  },
  {
    id: 'prof-002',
    type: 'planning_consultant',
    companyName: 'Hampstead Planning Services',
    contactName: 'David Chen',
    email: 'david@hampsteadplanning.co.uk',
    phone: '020 7890 1234',
    website: 'https://hampsteadplanning.co.uk',
    address: { city: 'London', postcode: 'NW3 1EN' },
    coverageAreas: ['NW1', 'NW2', 'NW3', 'NW5', 'NW6', 'NW8', 'N2', 'N6', 'Camden', 'Barnet'],
    specializations: ['conservation_areas', 'listed_buildings', 'basement_extensions', 'residential'],
    qualifications: [
      { title: 'MSc Town Planning', institution: 'UCL', year: 2008, verified: true },
      { title: 'BA Geography', institution: 'Durham University', year: 2006, verified: true },
    ],
    accreditations: [
      { body: 'RTPI', membershipNumber: 'RTPI-45678', level: 'Chartered', verified: true },
    ],
    insurance: {
      professionalIndemnity: { covered: true, amount: 2000000, verified: true },
      publicLiability: { covered: true, amount: 5000000, verified: true },
    },
    verification: {
      level: 'verified',
      identityVerified: true,
      qualificationsVerified: true,
      insuranceVerified: true,
      referencesChecked: true,
      badges: ['Planning Expert', 'Quick Response'],
    },
    portfolio: [],
    reviews: [
      {
        id: 'rev-003',
        clientName: 'Sarah M.',
        projectType: 'Planning application support',
        date: new Date('2023-08-20'),
        rating: 5,
        title: 'Got us through a tricky application',
        content: 'David managed our application through Camden and dealt with all the heritage concerns. Approved in 8 weeks!',
        verified: true,
      },
    ],
    ratings: {
      overall: 4.7,
      count: 32,
      breakdown: { quality: 4.8, communication: 4.9, value: 4.5, timeliness: 4.6 },
      distribution: { 5: 24, 4: 6, 3: 2, 2: 0, 1: 0 },
      recommendationRate: 94,
    },
    availability: {
      status: 'available',
      leadTime: '1-2 weeks',
      currentProjects: 5,
      maxProjects: 12,
    },
    pricing: {
      model: 'fixed',
      currency: 'GBP',
      indicativeRates: { minimum: 1500, maximum: 5000, typical: 2500, unit: 'per application' },
      freeConsultation: true,
      freeQuote: true,
    },
    createdAt: new Date('2019-08-10'),
    updatedAt: new Date(),
  },
  {
    id: 'prof-003',
    type: 'builder',
    companyName: 'Hampstead Heritage Builders',
    contactName: 'Thomas Murphy',
    email: 'info@hampsteadbuilders.co.uk',
    phone: '020 7456 7890',
    website: 'https://hampsteadbuilders.co.uk',
    address: { city: 'London', postcode: 'NW5 2TJ' },
    coverageAreas: ['NW3', 'NW5', 'NW6', 'N6', 'Camden'],
    specializations: ['listed_buildings', 'conservation_areas', 'period_properties', 'refurbishment'],
    qualifications: [
      { title: 'City & Guilds Level 3 Construction', verified: true },
      { title: 'CSCS Gold Card', verified: true },
    ],
    accreditations: [
      { body: 'Federation of Master Builders', verified: true },
      { body: 'TrustMark', verified: true },
      { body: 'Checkatrade', verified: true },
    ],
    insurance: {
      professionalIndemnity: { covered: false, verified: false },
      publicLiability: { covered: true, amount: 10000000, verified: true },
    },
    verification: {
      level: 'verified',
      identityVerified: true,
      qualificationsVerified: true,
      insuranceVerified: true,
      referencesChecked: true,
      badges: ['Heritage Specialist', 'TrustMark Approved'],
    },
    portfolio: [
      {
        id: 'port-003',
        title: 'Victorian Terrace Full Renovation',
        description: 'Complete restoration and modernisation of a Victorian terrace in Hampstead',
        projectType: 'refurbishment',
        heritageContext: 'conservation_area',
        completionDate: new Date('2023-04-30'),
        images: ['/portfolio/build-1.jpg'],
        clientTestimonial: 'Amazing attention to detail with period features. Highly recommend.',
        borough: 'Camden',
        featured: true,
      },
    ],
    reviews: [
      {
        id: 'rev-004',
        clientName: 'Alexandra P.',
        projectType: 'Extension and renovation',
        date: new Date('2023-05-15'),
        rating: 5,
        title: 'Exceptional craftsmen',
        content: 'Tom and his team did an amazing job on our Victorian house. They understood the heritage aspects and the finish is beautiful.',
        verified: true,
      },
    ],
    ratings: {
      overall: 4.8,
      count: 56,
      breakdown: { quality: 4.9, communication: 4.7, value: 4.6, timeliness: 4.7, heritage: 4.9 },
      distribution: { 5: 48, 4: 6, 3: 2, 2: 0, 1: 0 },
      recommendationRate: 96,
    },
    availability: {
      status: 'busy',
      nextAvailable: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      leadTime: '2-3 months',
      currentProjects: 4,
      maxProjects: 4,
    },
    pricing: {
      model: 'fixed',
      currency: 'GBP',
      indicativeRates: { minimum: 50000, maximum: 500000, unit: 'per project' },
      freeConsultation: true,
      freeQuote: true,
    },
    createdAt: new Date('2018-05-20'),
    updatedAt: new Date(),
  },
];

// ===========================================
// PROFESSIONAL MARKETPLACE SERVICE
// ===========================================

class ProfessionalMarketplaceService {
  private professionals: Map<string, Professional> = new Map();
  private quoteRequests: Map<string, QuoteRequest> = new Map();
  
  constructor() {
    // Initialize with sample data
    for (const prof of SAMPLE_PROFESSIONALS) {
      this.professionals.set(prof.id, prof);
    }
  }
  
  /**
   * Search for professionals
   */
  search(criteria: SearchCriteria): SearchResult[] {
    let results: SearchResult[] = [];
    
    for (const professional of Array.from(this.professionals.values())) {
      // Apply filters
      if (criteria.type && professional.type !== criteria.type) continue;
      
      if (criteria.minRating && professional.ratings.overall < criteria.minRating) continue;
      
      if (criteria.verificationLevel) {
        const levels: VerificationLevel[] = ['basic', 'verified', 'premium', 'elite'];
        const minLevel = levels.indexOf(criteria.verificationLevel);
        const profLevel = levels.indexOf(professional.verification.level);
        if (profLevel < minLevel) continue;
      }
      
      if (criteria.heritageSpecialist) {
        const heritageSpecs: Specialization[] = ['listed_buildings', 'conservation_areas', 'period_properties'];
        const hasHeritageSpec = professional.specializations.some((s: Specialization) => heritageSpecs.includes(s));
        if (!hasHeritageSpec) continue;
      }
      
      if (criteria.availableNow && professional.availability.status === 'unavailable') continue;
      
      if (criteria.specializations?.length) {
        const hasSpec = criteria.specializations.some(s => professional.specializations.includes(s));
        if (!hasSpec) continue;
      }
      
      if (criteria.postcode) {
        const coversPc = professional.coverageAreas.some((area: string) => 
          criteria.postcode!.toUpperCase().startsWith(area.toUpperCase())
        );
        if (!coversPc) continue;
      }
      
      if (criteria.borough) {
        const coversBorough = professional.coverageAreas.some((area: string) =>
          area.toLowerCase() === criteria.borough!.toLowerCase()
        );
        if (!coversBorough) continue;
      }
      
      // Calculate match score
      const matchResult = this.calculateMatchScore(professional, criteria);
      
      results.push({
        professional,
        matchScore: matchResult.score,
        matchReasons: matchResult.reasons,
        distance: criteria.postcode ? this.estimateDistance(criteria.postcode, professional.address.postcode) : undefined,
      });
    }
    
    // Sort results
    results = this.sortResults(results, criteria.sortBy || 'rating');
    
    return results;
  }
  
  /**
   * Calculate match score for a professional
   */
  private calculateMatchScore(professional: Professional, criteria: SearchCriteria): { score: number; reasons: string[] } {
    let score = 0;
    const reasons: string[] = [];
    
    // Rating score (max 30)
    score += (professional.ratings.overall / 5) * 30;
    if (professional.ratings.overall >= 4.5) {
      reasons.push('Highly rated');
    }
    
    // Verification score (max 20)
    const verificationScores: Record<VerificationLevel, number> = {
      basic: 5,
      verified: 10,
      premium: 15,
      elite: 20,
    };
    score += verificationScores[professional.verification.level];
    if (professional.verification.level === 'elite') {
      reasons.push('Elite verified');
    }
    
    // Specialization match (max 20)
    if (criteria.specializations?.length) {
      const matchCount = criteria.specializations.filter(s => professional.specializations.includes(s)).length;
      score += (matchCount / criteria.specializations.length) * 20;
      if (matchCount === criteria.specializations.length) {
        reasons.push('All specializations matched');
      }
    } else {
      score += 10; // Neutral if no specializations specified
    }
    
    // Heritage expertise (max 15)
    const heritageSpecs: Specialization[] = ['listed_buildings', 'conservation_areas'];
    const heritageMatch = heritageSpecs.filter(s => professional.specializations.includes(s)).length;
    if (heritageMatch > 0) {
      score += heritageMatch * 7.5;
      reasons.push('Heritage specialist');
    }
    
    // Availability (max 10)
    const availabilityScores = {
      available: 10,
      limited: 7,
      busy: 4,
      unavailable: 0,
    };
    score += availabilityScores[professional.availability.status];
    if (professional.availability.status === 'available') {
      reasons.push('Available now');
    }
    
    // Review count bonus (max 5)
    score += Math.min(5, professional.ratings.count / 10);
    if (professional.ratings.count >= 30) {
      reasons.push('Well established');
    }
    
    return { score, reasons };
  }
  
  /**
   * Sort search results
   */
  private sortResults(results: SearchResult[], sortBy: string): SearchResult[] {
    switch (sortBy) {
      case 'rating':
        return results.sort((a, b) => b.professional.ratings.overall - a.professional.ratings.overall);
      case 'reviews':
        return results.sort((a, b) => b.professional.ratings.count - a.professional.ratings.count);
      case 'distance':
        return results.sort((a, b) => (a.distance || 999) - (b.distance || 999));
      case 'availability':
        const availOrder = { available: 0, limited: 1, busy: 2, unavailable: 3 };
        return results.sort((a, b) => 
          availOrder[a.professional.availability.status] - availOrder[b.professional.availability.status]
        );
      default:
        return results.sort((a, b) => b.matchScore - a.matchScore);
    }
  }
  
  /**
   * Estimate distance between postcodes
   */
  private estimateDistance(fromPostcode: string, toPostcode: string): number {
    // Simplified distance estimation
    // In production, use a proper geocoding service
    const from = fromPostcode.substring(0, 3).toUpperCase();
    const to = toPostcode.substring(0, 3).toUpperCase();
    
    if (from === to) return 0.5;
    if (from.substring(0, 2) === to.substring(0, 2)) return 2;
    return 5;
  }
  
  /**
   * Get professional by ID
   */
  getProfessional(id: string): Professional | null {
    return this.professionals.get(id) || null;
  }
  
  /**
   * Get professionals by type
   */
  getProfessionalsByType(type: ProfessionalType): Professional[] {
    return Array.from(this.professionals.values())
      .filter(p => p.type === type)
      .sort((a, b) => b.ratings.overall - a.ratings.overall);
  }
  
  /**
   * Get featured professionals
   */
  getFeatured(limit: number = 6): Professional[] {
    return Array.from(this.professionals.values())
      .filter(p => p.verification.level === 'elite' || p.verification.level === 'premium')
      .sort((a, b) => b.ratings.overall - a.ratings.overall)
      .slice(0, limit);
  }
  
  /**
   * Get heritage specialists
   */
  getHeritageSpecialists(postcode?: string): Professional[] {
    const heritageSpecs: Specialization[] = ['listed_buildings', 'conservation_areas', 'period_properties'];
    
    return Array.from(this.professionals.values())
      .filter(p => p.specializations.some(s => heritageSpecs.includes(s)))
      .filter(p => !postcode || p.coverageAreas.some(area => postcode.toUpperCase().startsWith(area.toUpperCase())))
      .sort((a, b) => b.ratings.overall - a.ratings.overall);
  }
  
  /**
   * Submit a quote request
   */
  submitQuoteRequest(request: Omit<QuoteRequest, 'id' | 'status' | 'createdAt' | 'responses'>): QuoteRequest {
    const id = `quote-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const quoteRequest: QuoteRequest = {
      ...request,
      id,
      status: 'pending',
      createdAt: new Date(),
      responses: request.selectedProfessionals.map(profId => ({
        professionalId: profId,
        status: 'pending',
      })),
    };
    
    this.quoteRequests.set(id, quoteRequest);
    
    // In production, send emails to selected professionals
    console.log('Quote request submitted:', id, 'to', request.selectedProfessionals.length, 'professionals');
    
    return quoteRequest;
  }
  
  /**
   * Get quote request by ID
   */
  getQuoteRequest(id: string): QuoteRequest | null {
    return this.quoteRequests.get(id) || null;
  }
  
  /**
   * Get recommended professionals for a project
   */
  getRecommendationsForProject(params: {
    projectType: string;
    postcode: string;
    heritageStatus: 'RED' | 'AMBER' | 'GREEN';
    budget?: number;
  }): { architects: SearchResult[]; builders: SearchResult[]; consultants: SearchResult[] } {
    const baseSpecializations: Specialization[] = [];
    
    // Add heritage specializations based on status
    if (params.heritageStatus === 'RED') {
      baseSpecializations.push('listed_buildings');
    }
    if (params.heritageStatus !== 'GREEN') {
      baseSpecializations.push('conservation_areas', 'period_properties');
    }
    
    // Add project type specializations
    if (params.projectType.toLowerCase().includes('loft')) {
      baseSpecializations.push('loft_conversions');
    }
    if (params.projectType.toLowerCase().includes('basement')) {
      baseSpecializations.push('basement_extensions');
    }
    if (params.projectType.toLowerCase().includes('extension')) {
      baseSpecializations.push('rear_extensions', 'side_extensions');
    }
    
    const architects = this.search({
      type: 'architect',
      postcode: params.postcode,
      specializations: baseSpecializations,
      heritageSpecialist: params.heritageStatus !== 'GREEN',
    }).slice(0, 5);
    
    const builders = this.search({
      type: 'builder',
      postcode: params.postcode,
      specializations: baseSpecializations,
      heritageSpecialist: params.heritageStatus !== 'GREEN',
    }).slice(0, 5);
    
    const consultants = this.search({
      type: 'planning_consultant',
      postcode: params.postcode,
      heritageSpecialist: params.heritageStatus !== 'GREEN',
    }).slice(0, 5);
    
    return { architects, builders, consultants };
  }
  
  /**
   * Get all professional types with counts
   */
  getProfessionalTypes(): { type: ProfessionalType; label: string; count: number }[] {
    const typeCounts = new Map<ProfessionalType, number>();
    
    for (const prof of Array.from(this.professionals.values())) {
      typeCounts.set(prof.type, (typeCounts.get(prof.type) || 0) + 1);
    }
    
    const typeLabels: Record<ProfessionalType, string> = {
      architect: 'Architects',
      planning_consultant: 'Planning Consultants',
      structural_engineer: 'Structural Engineers',
      builder: 'Builders',
      surveyor: 'Surveyors',
      party_wall_surveyor: 'Party Wall Surveyors',
      heritage_consultant: 'Heritage Consultants',
      interior_designer: 'Interior Designers',
      landscape_architect: 'Landscape Architects',
      m_and_e_engineer: 'M&E Engineers',
    };
    
    return Array.from(typeCounts.entries()).map(([type, count]) => ({
      type,
      label: typeLabels[type],
      count,
    }));
  }
}

// Export singleton
export const professionalMarketplace = new ProfessionalMarketplaceService();
