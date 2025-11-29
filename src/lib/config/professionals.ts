/**
 * Professional Marketplace Types and Data
 * Connect homeowners with architects, builders, and consultants
 */

export type ProfessionalCategory = 
  | 'architect'
  | 'planning-consultant'
  | 'builder'
  | 'structural-engineer'
  | 'heritage-consultant'
  | 'surveyor'
  | 'interior-designer';

export interface Professional {
  id: string;
  name: string;
  company: string;
  category: ProfessionalCategory;
  specializations: string[];
  coverageAreas: string[];
  rating: number;
  reviewCount: number;
  verified: boolean;
  heritageExpert: boolean;
  listedBuildingExpert: boolean;
  conservationAreaExpert: boolean;
  description: string;
  website?: string;
  phone?: string;
  email?: string;
  minProjectValue?: number;
  responseTime: 'same-day' | 'next-day' | '2-3-days' | 'week';
  profileImage?: string;
  portfolioImages?: string[];
  accreditations: string[];
  insuranceVerified: boolean;
  yearsExperience: number;
}

export interface QuoteRequest {
  id: string;
  userId?: string;
  propertyAddress: string;
  propertyPostcode: string;
  heritageStatus: 'RED' | 'AMBER' | 'GREEN';
  hasArticle4: boolean;
  listedGrade?: 'I' | 'II*' | 'II';
  projectType: string;
  projectDescription: string;
  budget?: string;
  timeline?: string;
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  preferredContactMethod: 'email' | 'phone' | 'either';
  professionalIds: string[];
  createdAt: string;
  status: 'pending' | 'sent' | 'responded' | 'hired' | 'cancelled';
}

export const PROFESSIONAL_CATEGORIES = [
  {
    id: 'architect' as const,
    name: 'Architects',
    description: 'Design your project and prepare planning applications',
    icon: '📐',
    typicalFees: 'From £2,000 for small projects, 8-15% of build cost for larger',
  },
  {
    id: 'planning-consultant' as const,
    name: 'Planning Consultants',
    description: 'Navigate complex planning applications and appeals',
    icon: '📋',
    typicalFees: 'From £500 for advice, £1,500+ for full application support',
  },
  {
    id: 'heritage-consultant' as const,
    name: 'Heritage Consultants',
    description: 'Specialists in listed buildings and conservation areas',
    icon: '🏛️',
    typicalFees: 'From £750 for heritage statements, £2,000+ for full assessments',
  },
  {
    id: 'builder' as const,
    name: 'Builders & Contractors',
    description: 'Construct your extension or renovation',
    icon: '🔨',
    typicalFees: 'Varies by project - get multiple quotes',
  },
  {
    id: 'structural-engineer' as const,
    name: 'Structural Engineers',
    description: 'Calculate structural requirements and produce drawings',
    icon: '🏗️',
    typicalFees: 'From £400 for beam calculations, £800+ for full designs',
  },
  {
    id: 'surveyor' as const,
    name: 'Surveyors',
    description: 'Measured surveys, party wall agreements, valuations',
    icon: '📏',
    typicalFees: 'From £300 for party wall letters, £500+ for surveys',
  },
  {
    id: 'interior-designer' as const,
    name: 'Interior Designers',
    description: 'Design interior spaces and specify finishes',
    icon: '🎨',
    typicalFees: 'From £75/hour or percentage of fit-out cost',
  },
];

// Sample professionals (in production, from database)
export const SAMPLE_PROFESSIONALS: Professional[] = [
  {
    id: 'prof-001',
    name: 'Sarah Mitchell',
    company: 'Mitchell Heritage Architecture',
    category: 'architect',
    specializations: ['Listed Buildings', 'Conservation Areas', 'Period Properties', 'Extensions'],
    coverageAreas: ['Camden', 'Barnet', 'Westminster', 'Haringey', 'Islington'],
    rating: 4.9,
    reviewCount: 47,
    verified: true,
    heritageExpert: true,
    listedBuildingExpert: true,
    conservationAreaExpert: true,
    description: 'RIBA chartered architect specializing in sensitive alterations to heritage properties. 15+ years experience with Listed Building Consent applications in North London.',
    website: 'https://mitchellheritage.co.uk',
    phone: '020 7123 4567',
    email: 'sarah@mitchellheritage.co.uk',
    minProjectValue: 20000,
    responseTime: 'same-day',
    accreditations: ['RIBA', 'ARB', 'AABC Conservation Register'],
    insuranceVerified: true,
    yearsExperience: 15,
  },
  {
    id: 'prof-002',
    name: 'James Chen',
    company: 'Urban Space Architects',
    category: 'architect',
    specializations: ['Modern Extensions', 'Loft Conversions', 'New Build', 'Sustainable Design'],
    coverageAreas: ['Camden', 'Islington', 'Hackney', 'Haringey', 'Tower Hamlets'],
    rating: 4.8,
    reviewCount: 89,
    verified: true,
    heritageExpert: false,
    listedBuildingExpert: false,
    conservationAreaExpert: true,
    description: 'Contemporary design studio focused on maximizing space and light. Expert at navigating conservation area restrictions while delivering modern designs.',
    website: 'https://urbanspacearchitects.com',
    phone: '020 7234 5678',
    email: 'hello@urbanspacearchitects.com',
    minProjectValue: 15000,
    responseTime: 'next-day',
    accreditations: ['RIBA', 'ARB', 'Passivhaus Designer'],
    insuranceVerified: true,
    yearsExperience: 10,
  },
  {
    id: 'prof-003',
    name: 'Victoria Hartley',
    company: 'Hartley Heritage Consulting',
    category: 'heritage-consultant',
    specializations: ['Heritage Statements', 'Listed Building Consent', 'Conservation Area Appraisals', 'Historic England Liaison'],
    coverageAreas: ['Greater London', 'Hertfordshire', 'Surrey', 'Kent', 'Essex'],
    rating: 5.0,
    reviewCount: 32,
    verified: true,
    heritageExpert: true,
    listedBuildingExpert: true,
    conservationAreaExpert: true,
    description: 'Former Historic England inspector offering expert heritage consultancy. Exceptional success rate with difficult Listed Building Consent applications.',
    website: 'https://hartleyheritage.co.uk',
    phone: '020 7345 6789',
    email: 'victoria@hartleyheritage.co.uk',
    minProjectValue: 1500,
    responseTime: 'same-day',
    accreditations: ['IHBC', 'RICS', 'CIfA'],
    insuranceVerified: true,
    yearsExperience: 20,
  },
  {
    id: 'prof-004',
    name: 'David Okonkwo',
    company: 'Okonkwo Planning Services',
    category: 'planning-consultant',
    specializations: ['Planning Applications', 'Appeals', 'Pre-Application Advice', 'Policy Analysis'],
    coverageAreas: ['Camden', 'Barnet', 'Westminster', 'Brent', 'Harrow'],
    rating: 4.7,
    reviewCount: 56,
    verified: true,
    heritageExpert: false,
    listedBuildingExpert: false,
    conservationAreaExpert: true,
    description: 'Former Camden Council planning officer with insider knowledge of local planning policies. High success rate with challenging applications.',
    website: 'https://okonkwoplanning.co.uk',
    phone: '020 7456 7890',
    email: 'david@okonkwoplanning.co.uk',
    minProjectValue: 500,
    responseTime: 'same-day',
    accreditations: ['RTPI', 'RICS'],
    insuranceVerified: true,
    yearsExperience: 12,
  },
  {
    id: 'prof-005',
    name: 'Thompson & Sons',
    company: 'Thompson & Sons Builders',
    category: 'builder',
    specializations: ['Period Property Restoration', 'Extensions', 'Loft Conversions', 'Listed Building Works'],
    coverageAreas: ['Camden', 'Barnet', 'Haringey', 'Westminster'],
    rating: 4.8,
    reviewCount: 124,
    verified: true,
    heritageExpert: true,
    listedBuildingExpert: true,
    conservationAreaExpert: true,
    description: 'Third-generation family builders specializing in period properties. Trusted by conservation officers and heritage consultants throughout North London.',
    phone: '020 7567 8901',
    email: 'info@thompsonbuilders.co.uk',
    minProjectValue: 30000,
    responseTime: 'next-day',
    accreditations: ['FMB', 'TrustMark', 'NHBC'],
    insuranceVerified: true,
    yearsExperience: 45,
  },
  {
    id: 'prof-006',
    name: 'Emma Richardson',
    company: 'Richardson Structural Engineering',
    category: 'structural-engineer',
    specializations: ['Residential Structures', 'Loft Conversions', 'Wall Removal', 'Underpinning'],
    coverageAreas: ['Greater London'],
    rating: 4.9,
    reviewCount: 78,
    verified: true,
    heritageExpert: false,
    listedBuildingExpert: false,
    conservationAreaExpert: false,
    description: 'Chartered structural engineer with fast turnaround times. Specializes in residential alterations and working with period properties.',
    website: 'https://richardsonse.co.uk',
    phone: '020 7678 9012',
    email: 'emma@richardsonse.co.uk',
    minProjectValue: 400,
    responseTime: 'next-day',
    accreditations: ['ICE', 'IStructE'],
    insuranceVerified: true,
    yearsExperience: 8,
  },
  {
    id: 'prof-007',
    name: 'Marcus Webb',
    company: 'Webb Surveys Ltd',
    category: 'surveyor',
    specializations: ['Measured Surveys', 'Party Wall', 'Building Surveys', 'Valuations'],
    coverageAreas: ['Camden', 'Islington', 'Hackney', 'Westminster', 'Kensington'],
    rating: 4.6,
    reviewCount: 43,
    verified: true,
    heritageExpert: false,
    listedBuildingExpert: false,
    conservationAreaExpert: false,
    description: 'RICS chartered surveyor offering comprehensive survey services. Quick turnaround on measured surveys for planning applications.',
    website: 'https://webbsurveys.co.uk',
    phone: '020 7789 0123',
    email: 'marcus@webbsurveys.co.uk',
    minProjectValue: 300,
    responseTime: '2-3-days',
    accreditations: ['RICS', 'RPSA'],
    insuranceVerified: true,
    yearsExperience: 14,
  },
];

// ===========================================
// HELPER FUNCTIONS
// ===========================================

export function getProfessionalsByCategory(category: ProfessionalCategory): Professional[] {
  return SAMPLE_PROFESSIONALS.filter(p => p.category === category);
}

export function getHeritageExperts(): Professional[] {
  return SAMPLE_PROFESSIONALS.filter(p => p.heritageExpert || p.listedBuildingExpert);
}

export function getConservationAreaExperts(): Professional[] {
  return SAMPLE_PROFESSIONALS.filter(p => p.conservationAreaExpert);
}

export function getProfessionalsForProject(
  heritageStatus: 'RED' | 'AMBER' | 'GREEN',
  projectType: string,
  borough?: string
): Professional[] {
  let filtered = [...SAMPLE_PROFESSIONALS];

  // Filter by heritage expertise if needed
  if (heritageStatus === 'RED') {
    filtered = filtered.filter(p => p.listedBuildingExpert || p.heritageExpert);
  } else if (heritageStatus === 'AMBER') {
    filtered = filtered.filter(p => p.conservationAreaExpert || p.heritageExpert);
  }

  // Filter by coverage area if borough provided
  if (borough) {
    filtered = filtered.filter(p => 
      p.coverageAreas.some(area => 
        area.toLowerCase().includes(borough.toLowerCase()) ||
        area.toLowerCase() === 'greater london'
      )
    );
  }

  // Sort by rating
  return filtered.sort((a, b) => b.rating - a.rating);
}

export function getRecommendedProfessionalTypes(
  heritageStatus: 'RED' | 'AMBER' | 'GREEN',
  projectType: string
): ProfessionalCategory[] {
  const types: ProfessionalCategory[] = [];

  // Always need an architect for most projects
  if (!['internal-walls', 'windows-replacement', 'solar-panels'].includes(projectType)) {
    types.push('architect');
  }

  // Heritage consultant for listed buildings
  if (heritageStatus === 'RED') {
    types.push('heritage-consultant');
    types.push('planning-consultant');
  }

  // Planning consultant for conservation areas
  if (heritageStatus === 'AMBER') {
    types.push('planning-consultant');
  }

  // Structural engineer for structural work
  if (['rear-extension-single', 'rear-extension-double', 'loft-dormer', 'loft-hip-to-gable', 'internal-walls', 'basement'].includes(projectType)) {
    types.push('structural-engineer');
  }

  // Always need a builder for construction
  if (!['internal-walls'].includes(projectType)) {
    types.push('builder');
  }

  // Surveyor for party wall or measured surveys
  if (['rear-extension-double', 'side-extension', 'basement'].includes(projectType)) {
    types.push('surveyor');
  }

  return types;
}

export const BUDGET_RANGES = [
  { id: 'under-10k', label: 'Under £10,000' },
  { id: '10k-25k', label: '£10,000 - £25,000' },
  { id: '25k-50k', label: '£25,000 - £50,000' },
  { id: '50k-100k', label: '£50,000 - £100,000' },
  { id: '100k-250k', label: '£100,000 - £250,000' },
  { id: 'over-250k', label: 'Over £250,000' },
  { id: 'unsure', label: 'Not sure yet' },
];

export const TIMELINE_OPTIONS = [
  { id: 'asap', label: 'As soon as possible' },
  { id: '1-3-months', label: 'Within 1-3 months' },
  { id: '3-6-months', label: 'Within 3-6 months' },
  { id: '6-12-months', label: 'Within 6-12 months' },
  { id: 'over-12-months', label: 'Over 12 months away' },
  { id: 'just-exploring', label: 'Just exploring options' },
];
