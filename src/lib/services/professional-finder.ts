/**
 * Professional Finder Service
 * Find architects, surveyors, and heritage consultants in Hampstead area
 */

// Professional types
type ProfessionalType = 
  | 'architect'
  | 'conservation_architect'
  | 'planning_consultant'
  | 'heritage_consultant'
  | 'structural_engineer'
  | 'surveyor'
  | 'party_wall_surveyor'
  | 'arboriculturist'
  | 'ecologist'
  | 'daylight_consultant';

type Accreditation =
  | 'RIBA'
  | 'ARB'
  | 'RICS'
  | 'RTPI'
  | 'IHBC'
  | 'ICE'
  | 'AABC'
  | 'CIAT';

// Professional profile
interface Professional {
  id: string;
  name: string;
  company: string;
  type: ProfessionalType;
  accreditations: Accreditation[];
  specialisms: string[];
  experience: {
    years: number;
    conservationAreaProjects: number;
    listedBuildingProjects: number;
    localProjects: number;
  };
  contact: {
    phone: string;
    email: string;
    website?: string;
    address: string;
  };
  ratings: {
    overall: number;
    communication: number;
    expertise: number;
    value: number;
    reviewCount: number;
  };
  portfolio: {
    projectName: string;
    location: string;
    type: string;
    year: number;
  }[];
  fees: {
    consultationFee?: number;
    hourlyRate?: { min: number; max: number };
    projectFee?: string;
  };
  availability: 'available' | 'limited' | 'booked';
}

// Search result
interface SearchResult {
  professionals: Professional[];
  totalCount: number;
  filters: {
    type?: ProfessionalType;
    minRating?: number;
    accreditation?: Accreditation;
  };
  recommendations: string[];
}

// Professionals database
const PROFESSIONALS_DATABASE: Professional[] = [
  // Conservation Architects
  {
    id: 'PRO-001',
    name: 'Sarah Thompson',
    company: 'Thompson Heritage Architects',
    type: 'conservation_architect',
    accreditations: ['RIBA', 'ARB', 'AABC'],
    specialisms: ['Listed buildings', 'Conservation areas', 'Georgian restoration', 'Hampstead specialist'],
    experience: {
      years: 18,
      conservationAreaProjects: 85,
      listedBuildingProjects: 42,
      localProjects: 65,
    },
    contact: {
      phone: '020 7123 4567',
      email: 'sarah@thompsonheritage.co.uk',
      website: 'www.thompsonheritage.co.uk',
      address: '15 Flask Walk, Hampstead, NW3 1HE',
    },
    ratings: {
      overall: 4.9,
      communication: 4.8,
      expertise: 5.0,
      value: 4.7,
      reviewCount: 47,
    },
    portfolio: [
      { projectName: 'Georgian Townhouse Restoration', location: 'NW3', type: 'Listed Grade II', year: 2023 },
      { projectName: 'Hampstead Heath Extension', location: 'NW3', type: 'Conservation Area', year: 2022 },
      { projectName: 'Highgate Village Conversion', location: 'N6', type: 'Listed Grade II*', year: 2021 },
    ],
    fees: {
      consultationFee: 350,
      hourlyRate: { min: 150, max: 200 },
      projectFee: 'From 8% of construction cost',
    },
    availability: 'limited',
  },
  {
    id: 'PRO-002',
    name: 'James Mitchell',
    company: 'Mitchell Conservation',
    type: 'conservation_architect',
    accreditations: ['RIBA', 'ARB', 'IHBC'],
    specialisms: ['Victorian properties', 'Arts & Crafts', 'Garden suburbs', 'Sustainable restoration'],
    experience: {
      years: 15,
      conservationAreaProjects: 72,
      listedBuildingProjects: 35,
      localProjects: 55,
    },
    contact: {
      phone: '020 7234 5678',
      email: 'james@mitchellconservation.co.uk',
      website: 'www.mitchellconservation.co.uk',
      address: '42 Belsize Lane, NW3 5BG',
    },
    ratings: {
      overall: 4.8,
      communication: 4.9,
      expertise: 4.8,
      value: 4.6,
      reviewCount: 38,
    },
    portfolio: [
      { projectName: 'Garden Suburb Extension', location: 'NW11', type: 'Conservation Area', year: 2023 },
      { projectName: 'Victorian Villa Basement', location: 'NW6', type: 'Conservation Area', year: 2022 },
    ],
    fees: {
      consultationFee: 300,
      hourlyRate: { min: 130, max: 180 },
      projectFee: 'From 7% of construction cost',
    },
    availability: 'available',
  },
  
  // Heritage Consultants
  {
    id: 'PRO-003',
    name: 'Dr. Elizabeth Ward',
    company: 'Ward Heritage Consulting',
    type: 'heritage_consultant',
    accreditations: ['IHBC'],
    specialisms: ['Heritage statements', 'Listed building applications', 'Conservation management plans', 'Expert witness'],
    experience: {
      years: 22,
      conservationAreaProjects: 120,
      listedBuildingProjects: 95,
      localProjects: 45,
    },
    contact: {
      phone: '020 7345 6789',
      email: 'elizabeth@wardheritage.co.uk',
      website: 'www.wardheritage.co.uk',
      address: '8 High Street, Highgate, N6 5JR',
    },
    ratings: {
      overall: 4.9,
      communication: 4.7,
      expertise: 5.0,
      value: 4.5,
      reviewCount: 52,
    },
    portfolio: [
      { projectName: 'Grade I Manor House', location: 'NW3', type: 'Heritage Statement', year: 2023 },
      { projectName: 'Kenwood Estate Works', location: 'NW3', type: 'Conservation Plan', year: 2022 },
    ],
    fees: {
      consultationFee: 400,
      hourlyRate: { min: 175, max: 250 },
      projectFee: 'Heritage statements from £2,500',
    },
    availability: 'limited',
  },
  
  // Planning Consultants
  {
    id: 'PRO-004',
    name: 'Robert Chen',
    company: 'Chen Planning Associates',
    type: 'planning_consultant',
    accreditations: ['RTPI'],
    specialisms: ['Planning applications', 'Appeals', 'Pre-application advice', 'Section 106'],
    experience: {
      years: 16,
      conservationAreaProjects: 95,
      listedBuildingProjects: 28,
      localProjects: 78,
    },
    contact: {
      phone: '020 7456 7890',
      email: 'robert@chenplanning.co.uk',
      website: 'www.chenplanning.co.uk',
      address: '22 Heath Street, Hampstead, NW3 6TE',
    },
    ratings: {
      overall: 4.7,
      communication: 4.8,
      expertise: 4.7,
      value: 4.6,
      reviewCount: 41,
    },
    portfolio: [
      { projectName: 'Basement Development', location: 'NW3', type: 'Full Planning', year: 2023 },
      { projectName: 'Appeal Success', location: 'NW6', type: 'Planning Appeal', year: 2023 },
    ],
    fees: {
      consultationFee: 250,
      hourlyRate: { min: 120, max: 160 },
      projectFee: 'From £1,500 for householder applications',
    },
    availability: 'available',
  },
  
  // Structural Engineers
  {
    id: 'PRO-005',
    name: 'David Palmer',
    company: 'Palmer Structural Engineering',
    type: 'structural_engineer',
    accreditations: ['ICE'],
    specialisms: ['Basement construction', 'Underpinning', 'Listed building structures', 'Party wall'],
    experience: {
      years: 20,
      conservationAreaProjects: 65,
      listedBuildingProjects: 38,
      localProjects: 85,
    },
    contact: {
      phone: '020 7567 8901',
      email: 'david@palmerstructural.co.uk',
      website: 'www.palmerstructural.co.uk',
      address: '10 Rosslyn Hill, Hampstead, NW3 1PB',
    },
    ratings: {
      overall: 4.8,
      communication: 4.6,
      expertise: 4.9,
      value: 4.7,
      reviewCount: 35,
    },
    portfolio: [
      { projectName: 'Double Basement', location: 'NW3', type: 'Structural Design', year: 2023 },
      { projectName: 'Georgian Underpinning', location: 'N6', type: 'Listed Building', year: 2022 },
    ],
    fees: {
      consultationFee: 350,
      hourlyRate: { min: 140, max: 180 },
      projectFee: 'From £3,000 for basement calculations',
    },
    availability: 'available',
  },
  
  // Party Wall Surveyors
  {
    id: 'PRO-006',
    name: 'Angela Martinez',
    company: 'Martinez Party Wall Surveyors',
    type: 'party_wall_surveyor',
    accreditations: ['RICS'],
    specialisms: ['Party Wall Act', 'Neighbour negotiations', 'Schedules of condition', 'Awards'],
    experience: {
      years: 12,
      conservationAreaProjects: 180,
      listedBuildingProjects: 45,
      localProjects: 150,
    },
    contact: {
      phone: '020 7678 9012',
      email: 'angela@martinezpw.co.uk',
      website: 'www.martinezpw.co.uk',
      address: '5 South End Road, Hampstead, NW3 2PT',
    },
    ratings: {
      overall: 4.6,
      communication: 4.8,
      expertise: 4.5,
      value: 4.5,
      reviewCount: 62,
    },
    portfolio: [
      { projectName: 'Terraced Basement', location: 'NW3', type: 'Party Wall Award', year: 2023 },
      { projectName: 'Extension Works', location: 'NW6', type: 'Party Wall Notice', year: 2023 },
    ],
    fees: {
      consultationFee: 150,
      hourlyRate: { min: 100, max: 140 },
      projectFee: 'Party Wall Notices from £600',
    },
    availability: 'available',
  },
  
  // Arboriculturists
  {
    id: 'PRO-007',
    name: 'Thomas Green',
    company: 'Green Tree Consulting',
    type: 'arboriculturist',
    accreditations: ['RICS'],
    specialisms: ['TPO assessments', 'Arboricultural impact', 'Tree surveys', 'Root protection'],
    experience: {
      years: 14,
      conservationAreaProjects: 95,
      listedBuildingProjects: 25,
      localProjects: 120,
    },
    contact: {
      phone: '020 7789 0123',
      email: 'thomas@greentree.co.uk',
      website: 'www.greentree.co.uk',
      address: '18 East Heath Road, Hampstead, NW3 1BN',
    },
    ratings: {
      overall: 4.7,
      communication: 4.6,
      expertise: 4.8,
      value: 4.7,
      reviewCount: 28,
    },
    portfolio: [
      { projectName: 'Development Impact', location: 'NW3', type: 'AIA Report', year: 2023 },
      { projectName: 'TPO Application', location: 'N6', type: 'Tree Survey', year: 2023 },
    ],
    fees: {
      consultationFee: 200,
      hourlyRate: { min: 80, max: 120 },
      projectFee: 'Tree surveys from £450',
    },
    availability: 'available',
  },
];

export class ProfessionalFinderService {
  /**
   * Search for professionals
   */
  search(filters: {
    type?: ProfessionalType;
    postcode?: string;
    minRating?: number;
    accreditation?: Accreditation;
    specialism?: string;
    maxConsultationFee?: number;
    availableOnly?: boolean;
  }): SearchResult {
    let results = [...PROFESSIONALS_DATABASE];
    
    // Filter by type
    if (filters.type) {
      results = results.filter(p => p.type === filters.type);
    }
    
    // Filter by rating
    if (filters.minRating !== undefined && filters.minRating !== null) {
      const minRating = filters.minRating;
      results = results.filter(p => p.ratings.overall >= minRating);
    }
    
    // Filter by accreditation
    if (filters.accreditation) {
      results = results.filter(p => p.accreditations.includes(filters.accreditation!));
    }
    
    // Filter by specialism
    if (filters.specialism) {
      const searchTerm = filters.specialism.toLowerCase();
      results = results.filter(p => 
        p.specialisms.some(s => s.toLowerCase().includes(searchTerm))
      );
    }
    
    // Filter by consultation fee
    if (filters.maxConsultationFee) {
      results = results.filter(p => 
        !p.fees.consultationFee || p.fees.consultationFee <= filters.maxConsultationFee!
      );
    }
    
    // Filter by availability
    if (filters.availableOnly) {
      results = results.filter(p => p.availability === 'available');
    }
    
    // Sort by rating
    results.sort((a, b) => b.ratings.overall - a.ratings.overall);
    
    // Generate recommendations
    const recommendations = this.generateRecommendations(filters);
    
    return {
      professionals: results,
      totalCount: results.length,
      filters,
      recommendations,
    };
  }
  
  /**
   * Get professional by ID
   */
  getProfessional(id: string): Professional | null {
    return PROFESSIONALS_DATABASE.find(p => p.id === id) ?? null;
  }
  
  /**
   * Get recommended team for project
   */
  getRecommendedTeam(projectType: string, isListed: boolean, inConservationArea: boolean): {
    essential: { type: ProfessionalType; reason: string; recommended: Professional | null }[];
    optional: { type: ProfessionalType; reason: string; recommended: Professional | null }[];
    estimatedTeamCost: { min: number; max: number };
  } {
    const essential: { type: ProfessionalType; reason: string; recommended: Professional | null }[] = [];
    const optional: { type: ProfessionalType; reason: string; recommended: Professional | null }[] = [];
    
    // Always need architect
    if (isListed) {
      essential.push({
        type: 'conservation_architect',
        reason: 'Conservation architect essential for listed building works',
        recommended: this.findTopProfessional('conservation_architect'),
      });
    } else if (inConservationArea) {
      essential.push({
        type: 'conservation_architect',
        reason: 'Conservation expertise recommended for heritage-sensitive area',
        recommended: this.findTopProfessional('conservation_architect'),
      });
    } else {
      essential.push({
        type: 'architect',
        reason: 'Architect for design and planning application',
        recommended: this.findTopProfessional('architect') ?? this.findTopProfessional('conservation_architect'),
      });
    }
    
    // Heritage consultant for listed
    if (isListed) {
      essential.push({
        type: 'heritage_consultant',
        reason: 'Heritage statement required for LBC application',
        recommended: this.findTopProfessional('heritage_consultant'),
      });
    }
    
    // Structural engineer for basements/extensions
    if (['basement', 'extension', 'loft'].includes(projectType)) {
      essential.push({
        type: 'structural_engineer',
        reason: 'Structural calculations and Building Regs',
        recommended: this.findTopProfessional('structural_engineer'),
      });
    }
    
    // Party wall surveyor for attached properties
    if (['basement', 'extension'].includes(projectType)) {
      essential.push({
        type: 'party_wall_surveyor',
        reason: 'Party Wall Act compliance',
        recommended: this.findTopProfessional('party_wall_surveyor'),
      });
    }
    
    // Optional: Planning consultant
    optional.push({
      type: 'planning_consultant',
      reason: 'For complex applications or appeals',
      recommended: this.findTopProfessional('planning_consultant'),
    });
    
    // Optional: Arboriculturist
    if (inConservationArea) {
      optional.push({
        type: 'arboriculturist',
        reason: 'Tree survey may be required',
        recommended: this.findTopProfessional('arboriculturist'),
      });
    }
    
    // Estimate team cost
    const estimatedTeamCost = this.estimateTeamCost(essential, projectType);
    
    return {
      essential,
      optional,
      estimatedTeamCost,
    };
  }
  
  /**
   * Find top professional of type
   */
  private findTopProfessional(type: ProfessionalType): Professional | null {
    const matches = PROFESSIONALS_DATABASE
      .filter(p => p.type === type)
      .sort((a, b) => b.ratings.overall - a.ratings.overall);
    
    return matches[0] ?? null;
  }
  
  /**
   * Estimate team cost
   */
  private estimateTeamCost(
    team: { type: ProfessionalType; recommended: Professional | null }[],
    projectType: string
  ): { min: number; max: number } {
    // Base costs by project type
    const baseCosts: Record<string, { min: number; max: number }> = {
      'basement': { min: 15000, max: 35000 },
      'extension': { min: 8000, max: 20000 },
      'loft': { min: 5000, max: 12000 },
      'refurbishment': { min: 4000, max: 10000 },
    };
    
    const base = baseCosts[projectType] ?? { min: 6000, max: 15000 };
    
    // Add consultation fees
    let consultationTotal = 0;
    for (const member of team) {
      if (member.recommended?.fees.consultationFee) {
        consultationTotal += member.recommended.fees.consultationFee;
      }
    }
    
    return {
      min: base.min + consultationTotal,
      max: base.max + consultationTotal * 2,
    };
  }
  
  /**
   * Generate search recommendations
   */
  private generateRecommendations(filters: { type?: ProfessionalType }): string[] {
    const recommendations: string[] = [];
    
    if (!filters.type) {
      recommendations.push('Consider which specialist you need first');
      recommendations.push('For listed buildings, start with a conservation architect');
    }
    
    recommendations.push('Check RIBA/RICS registers for accreditation verification');
    recommendations.push('Ask for references from similar local projects');
    recommendations.push('Get at least 3 quotes for comparison');
    
    return recommendations.slice(0, 4);
  }
}

// Export singleton
export const professionalFinderService = new ProfessionalFinderService();
