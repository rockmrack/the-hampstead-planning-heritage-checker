/**
 * Community Projects Gallery Service
 * Before/after photos of completed local projects
 */

export interface ProjectImage {
  url: string;
  caption: string;
  type: 'before' | 'after' | 'during' | 'detail' | 'plan';
  timestamp?: string;
}

export interface CommunityProject {
  id: string;
  title: string;
  address: string;
  postcode: string;
  area: string;
  borough: string;
  
  // Project details
  projectType: string;
  projectDescription: string;
  completedDate: string;
  duration: string;
  
  // Images
  images: {
    before: ProjectImage[];
    after: ProjectImage[];
    during?: ProjectImage[];
    plans?: ProjectImage[];
  };
  
  // Costs and value
  totalCost: number;
  propertyValueBefore?: number;
  propertyValueAfter?: number;
  estimatedValueAdd: number;
  
  // Details
  architect?: string;
  builder?: string;
  specifications: {
    sizeSqm: number;
    materials: string[];
    features: string[];
    sustainabilityFeatures?: string[];
  };
  
  // Planning context
  planning: {
    required: boolean;
    applicationRef?: string;
    conservationArea: boolean;
    listedBuilding: boolean;
    article4: boolean;
    challenges?: string[];
    approvalTime?: string;
  };
  
  // Owner feedback
  ownerTestimonial?: string;
  lessonsLearned?: string[];
  tips?: string[];
  rating: number; // 1-5
  
  // Engagement
  views: number;
  saves: number;
  featured: boolean;
}

export interface GalleryFilters {
  area?: string;
  projectType?: string;
  minBudget?: number;
  maxBudget?: number;
  conservationArea?: boolean;
  listedBuilding?: boolean;
  featured?: boolean;
}

export interface GalleryStats {
  totalProjects: number;
  averageCost: number;
  averageValueAdd: number;
  mostPopularType: string;
  topAreas: { area: string; count: number }[];
}

// ===========================================
// SAMPLE COMMUNITY PROJECTS
// ===========================================

const COMMUNITY_PROJECTS: CommunityProject[] = [
  {
    id: 'proj-001',
    title: 'Victorian Terrace Rear Extension & Side Return',
    address: '45 Flask Walk',
    postcode: 'NW3 1HE',
    area: 'Hampstead',
    borough: 'Camden',
    projectType: 'wrap-around',
    projectDescription: 'Stunning wrap-around extension to a Grade II curtilage Victorian terrace, creating an open-plan kitchen-diner with bi-fold doors to the garden. Traditional materials used to satisfy conservation officer requirements.',
    completedDate: '2024-03-15',
    duration: '18 weeks',
    images: {
      before: [
        { url: '/projects/flask-walk-before-1.jpg', caption: 'Original cramped galley kitchen', type: 'before' },
        { url: '/projects/flask-walk-before-2.jpg', caption: 'View from garden before works', type: 'before' },
      ],
      after: [
        { url: '/projects/flask-walk-after-1.jpg', caption: 'New open-plan living space', type: 'after' },
        { url: '/projects/flask-walk-after-2.jpg', caption: 'Bi-fold doors open to garden', type: 'after' },
        { url: '/projects/flask-walk-after-3.jpg', caption: 'Detail of slate roof matching original', type: 'after' },
      ],
      during: [
        { url: '/projects/flask-walk-during-1.jpg', caption: 'Structural steels going in', type: 'during' },
      ],
    },
    totalCost: 145000,
    propertyValueBefore: 2400000,
    propertyValueAfter: 2680000,
    estimatedValueAdd: 280000,
    architect: 'Studio A+B Architecture',
    builder: 'Hampstead Construction Ltd',
    specifications: {
      sizeSqm: 28,
      materials: ['Welsh slate roof', 'London stock brick', 'Crittall-style steel doors', 'Polished concrete floor'],
      features: ['Underfloor heating', 'Bi-fold doors', 'Roof lantern', 'Built-in storage'],
      sustainabilityFeatures: ['Triple glazing', 'Heat recovery ventilation', 'LED lighting throughout'],
    },
    planning: {
      required: true,
      applicationRef: '2023/1234/FUL',
      conservationArea: true,
      listedBuilding: false,
      article4: true,
      challenges: ['Conservation officer initially rejected flat roof design', 'Required slate to match existing'],
      approvalTime: '12 weeks',
    },
    ownerTestimonial: 'We are thrilled with the result. The extra space has transformed how we live. The conservation requirements actually resulted in a better design - the traditional materials tie in beautifully with the original house.',
    lessonsLearned: [
      'Get pre-application advice in conservation areas - saved us from a refusal',
      'Traditional materials cost more but worth it',
      'Winter build means interior work can continue regardless of weather',
    ],
    tips: [
      'Push back on conservation officer demands where reasonable',
      'Crittall-style doors can be thermally broken modern versions',
      'Consider a structural glass roof for maximum light',
    ],
    rating: 5,
    views: 2847,
    saves: 234,
    featured: true,
  },
  {
    id: 'proj-002',
    title: 'Edwardian Semi Loft Conversion with Rear Dormer',
    address: '23 Creighton Avenue',
    postcode: 'N10 1NU',
    area: 'Muswell Hill',
    borough: 'Haringey',
    projectType: 'loft-conversion',
    projectDescription: 'L-shaped rear dormer loft conversion creating a master bedroom suite with en-suite and walk-in wardrobe. Front Velux windows for additional light.',
    completedDate: '2024-01-20',
    duration: '10 weeks',
    images: {
      before: [
        { url: '/projects/creighton-before-1.jpg', caption: 'Original unused loft space', type: 'before' },
        { url: '/projects/creighton-before-2.jpg', caption: 'Rear of house before dormer', type: 'before' },
      ],
      after: [
        { url: '/projects/creighton-after-1.jpg', caption: 'New master bedroom', type: 'after' },
        { url: '/projects/creighton-after-2.jpg', caption: 'Luxurious en-suite bathroom', type: 'after' },
        { url: '/projects/creighton-after-3.jpg', caption: 'Rear dormer exterior', type: 'after' },
      ],
    },
    totalCost: 78000,
    propertyValueBefore: 1200000,
    propertyValueAfter: 1380000,
    estimatedValueAdd: 180000,
    architect: 'In-house (builder design)',
    builder: 'Modern Loft Conversions',
    specifications: {
      sizeSqm: 42,
      materials: ['GRP flat roof', 'Matching brick slips', 'White PVCu windows'],
      features: ['En-suite bathroom', 'Walk-in wardrobe', 'Juliet balcony'],
    },
    planning: {
      required: false,
      conservationArea: false,
      listedBuilding: false,
      article4: false,
      challenges: ['Party wall took longer than expected'],
      approvalTime: 'N/A - Permitted Development',
    },
    ownerTestimonial: 'Going from 3 beds to 4 was a game-changer for our growing family. The work was relatively quick and we could stay in the house throughout.',
    lessonsLearned: [
      'Start party wall process early',
      'PD rights meant we could start quickly',
      'Invest in good insulation - makes a huge difference',
    ],
    tips: [
      'Get a proper staircase not a space-saver',
      'Velux windows in front are better than dormers for PD compliance',
    ],
    rating: 5,
    views: 1923,
    saves: 167,
    featured: true,
  },
  {
    id: 'proj-003',
    title: 'Listed Georgian Townhouse Basement',
    address: '12 Church Row',
    postcode: 'NW3 6UP',
    area: 'Hampstead',
    borough: 'Camden',
    projectType: 'basement',
    projectDescription: 'Full basement excavation under a Grade II* listed Georgian townhouse, creating cinema room, gym, wine cellar and plant room. Incredible engineering challenges overcome.',
    completedDate: '2023-09-01',
    duration: '14 months',
    images: {
      before: [
        { url: '/projects/church-row-before-1.jpg', caption: 'Original coal cellar', type: 'before' },
      ],
      after: [
        { url: '/projects/church-row-after-1.jpg', caption: 'New cinema room', type: 'after' },
        { url: '/projects/church-row-after-2.jpg', caption: 'Gym with lightwell', type: 'after' },
        { url: '/projects/church-row-after-3.jpg', caption: 'Wine cellar', type: 'after' },
      ],
      during: [
        { url: '/projects/church-row-during-1.jpg', caption: 'Underpinning works', type: 'during' },
        { url: '/projects/church-row-during-2.jpg', caption: 'Micro-piling', type: 'during' },
      ],
    },
    totalCost: 420000,
    propertyValueBefore: 4500000,
    propertyValueAfter: 5400000,
    estimatedValueAdd: 900000,
    architect: 'Donald Insall Associates',
    builder: 'Camden Basement Specialists',
    specifications: {
      sizeSqm: 65,
      materials: ['Structural waterproof concrete', 'Reclaimed Georgian brick', 'Limestone floors'],
      features: ['Home cinema', 'Gym', 'Wine cellar', 'Plant room', 'Lightwells'],
      sustainabilityFeatures: ['Ground source heat pump', 'Mechanical ventilation', 'LED lighting'],
    },
    planning: {
      required: true,
      applicationRef: '2022/0456/LBC',
      conservationArea: true,
      listedBuilding: true,
      article4: true,
      challenges: [
        'Listed building consent took 6 months',
        'Historic England involvement',
        'Archaeological watching brief required',
        'Neighbor concerns about structural impact',
      ],
      approvalTime: '24 weeks',
    },
    ownerTestimonial: 'An incredibly complex project but the team managed it brilliantly. The basement has doubled our usable space without any impact on the historic fabric above ground.',
    lessonsLearned: [
      'Listed building consent is a long process - start early',
      'Specialist contractors for heritage buildings are essential',
      'Budget for overruns - we went 15% over',
      'Good neighbor relations are crucial for such disruptive works',
    ],
    tips: [
      'Use heritage specialists from day one',
      'Commission a full structural survey before starting',
      'Lightwells are expensive but essential for liveable space',
    ],
    rating: 5,
    views: 3456,
    saves: 298,
    featured: true,
  },
  {
    id: 'proj-004',
    title: '1930s Semi Side Return Kitchen Extension',
    address: '78 Colney Hatch Lane',
    postcode: 'N10 1ED',
    area: 'Muswell Hill',
    borough: 'Haringey',
    projectType: 'side-return',
    projectDescription: 'Simple but effective side return extension, infilling the alley to create a bright, modern kitchen with skylights.',
    completedDate: '2024-06-01',
    duration: '8 weeks',
    images: {
      before: [
        { url: '/projects/colney-before-1.jpg', caption: 'Original narrow kitchen', type: 'before' },
      ],
      after: [
        { url: '/projects/colney-after-1.jpg', caption: 'New open kitchen', type: 'after' },
        { url: '/projects/colney-after-2.jpg', caption: 'Skylights flood space with light', type: 'after' },
      ],
    },
    totalCost: 48000,
    propertyValueBefore: 850000,
    propertyValueAfter: 930000,
    estimatedValueAdd: 80000,
    architect: 'N/A - planning drawings by builder',
    builder: 'North London Extensions',
    specifications: {
      sizeSqm: 10,
      materials: ['Flat roof membrane', 'Brick to match', 'Aluminium bi-folds'],
      features: ['3 skylights', 'Underfloor heating', 'Quartz worktops'],
    },
    planning: {
      required: false,
      conservationArea: false,
      listedBuilding: false,
      article4: false,
    },
    ownerTestimonial: 'Best £48k we ever spent. The kitchen is now the heart of the home. Wish we\'d done it years ago.',
    lessonsLearned: [
      'Skylights make all the difference in a side return',
      'Get proper structural calculations even for small projects',
    ],
    tips: [
      'Three skylights better than one big one',
      'Position extraction directly above hob for best cooking experience',
    ],
    rating: 5,
    views: 1234,
    saves: 89,
    featured: false,
  },
  {
    id: 'proj-005',
    title: 'Victorian Conservation Area Rear Extension',
    address: '15 Bisham Gardens',
    postcode: 'N6 6DD',
    area: 'Highgate',
    borough: 'Haringey',
    projectType: 'rear-extension-single',
    projectDescription: 'Single-storey rear extension in conservation area, designed to be subservient to the original Victorian villa while providing contemporary living space.',
    completedDate: '2024-02-28',
    duration: '12 weeks',
    images: {
      before: [
        { url: '/projects/bisham-before-1.jpg', caption: 'Original rear of house', type: 'before' },
      ],
      after: [
        { url: '/projects/bisham-after-1.jpg', caption: 'New extension with traditional details', type: 'after' },
        { url: '/projects/bisham-after-2.jpg', caption: 'Interior showing height and light', type: 'after' },
      ],
    },
    totalCost: 95000,
    propertyValueBefore: 1800000,
    propertyValueAfter: 2050000,
    estimatedValueAdd: 250000,
    architect: 'Highgate Architecture',
    builder: 'Highgate Builders',
    specifications: {
      sizeSqm: 22,
      materials: ['Natural slate', 'London stock brick', 'Timber sash windows', 'Limestone floor'],
      features: ['Vaulted ceiling', 'Large skylight', 'French doors to garden'],
      sustainabilityFeatures: ['Sheep\'s wool insulation', 'Triple glazing'],
    },
    planning: {
      required: true,
      applicationRef: '2023/2345/FUL',
      conservationArea: true,
      listedBuilding: false,
      article4: true,
      challenges: ['Initial design rejected for being too large', 'Required traditional materials'],
      approvalTime: '10 weeks',
    },
    ownerTestimonial: 'The conservation constraints actually pushed us towards a better design. The traditional materials age beautifully and blend with the original house.',
    lessonsLearned: [
      'Conservation officers prefer traditional materials but will accept modern techniques',
      'Smaller footprint with higher ceiling can work better than large floor area',
    ],
    tips: [
      'Vaulted ceilings add drama without increasing footprint',
      'Good landscaping helps planning approval',
    ],
    rating: 4,
    views: 987,
    saves: 78,
    featured: false,
  },
  {
    id: 'proj-006',
    title: 'Crouch End Terrace Double Extension',
    address: '34 Weston Park',
    postcode: 'N8 9TB',
    area: 'Crouch End',
    borough: 'Haringey',
    projectType: 'rear-extension-double',
    projectDescription: 'Bold two-storey rear extension to Victorian terrace, adding bedroom above new kitchen-diner. Modern design approved despite Article 4 area.',
    completedDate: '2023-11-15',
    duration: '20 weeks',
    images: {
      before: [
        { url: '/projects/weston-before-1.jpg', caption: 'Original rear with outhouse', type: 'before' },
      ],
      after: [
        { url: '/projects/weston-after-1.jpg', caption: 'New double extension', type: 'after' },
        { url: '/projects/weston-after-2.jpg', caption: 'Ground floor kitchen-diner', type: 'after' },
        { url: '/projects/weston-after-3.jpg', caption: 'First floor bedroom', type: 'after' },
      ],
    },
    totalCost: 125000,
    propertyValueBefore: 1100000,
    propertyValueAfter: 1320000,
    estimatedValueAdd: 220000,
    architect: 'Paper House Project',
    builder: 'North London Extensions',
    specifications: {
      sizeSqm: 35,
      materials: ['Standing seam zinc', 'Timber cladding', 'Aluminium windows'],
      features: ['Open-plan ground floor', 'Master bedroom with en-suite', 'Juliet balcony'],
      sustainabilityFeatures: ['Air source heat pump', 'Solar PV', 'High-performance insulation'],
    },
    planning: {
      required: true,
      applicationRef: '2023/0789/FUL',
      conservationArea: false,
      listedBuilding: false,
      article4: true,
      challenges: ['Neighbor objection over overlooking - addressed with obscured glass'],
      approvalTime: '8 weeks',
    },
    ownerTestimonial: 'We gained 35sqm and it completely transformed the house. The zinc cladding looks amazing and requires zero maintenance.',
    lessonsLearned: [
      'Two-storey is more cost-effective per sqm than single-storey',
      'Modern materials can be approved even in sensitive areas',
      'Address neighbor concerns proactively',
    ],
    tips: [
      'Zinc roofing is expensive but lasts forever',
      'Get daylight/sunlight assessments done early',
    ],
    rating: 5,
    views: 1567,
    saves: 134,
    featured: true,
  },
];

// ===========================================
// COMMUNITY PROJECTS GALLERY SERVICE
// ===========================================

class CommunityProjectsGalleryService {
  /**
   * Get all projects with optional filters
   */
  getProjects(filters?: GalleryFilters): CommunityProject[] {
    let projects = [...COMMUNITY_PROJECTS];
    
    if (filters?.area) {
      projects = projects.filter(p => 
        p.area.toLowerCase() === filters.area!.toLowerCase() ||
        p.postcode.toUpperCase().startsWith(filters.area!.toUpperCase())
      );
    }
    
    if (filters?.projectType) {
      projects = projects.filter(p => p.projectType === filters.projectType);
    }
    
    if (filters?.minBudget) {
      projects = projects.filter(p => p.totalCost >= filters.minBudget!);
    }
    
    if (filters?.maxBudget) {
      projects = projects.filter(p => p.totalCost <= filters.maxBudget!);
    }
    
    if (filters?.conservationArea !== undefined) {
      projects = projects.filter(p => p.planning.conservationArea === filters.conservationArea);
    }
    
    if (filters?.listedBuilding !== undefined) {
      projects = projects.filter(p => p.planning.listedBuilding === filters.listedBuilding);
    }
    
    if (filters?.featured) {
      projects = projects.filter(p => p.featured);
    }
    
    return projects;
  }

  /**
   * Get a single project by ID
   */
  getProject(id: string): CommunityProject | undefined {
    return COMMUNITY_PROJECTS.find(p => p.id === id);
  }

  /**
   * Get featured projects
   */
  getFeaturedProjects(limit?: number): CommunityProject[] {
    const featured = COMMUNITY_PROJECTS.filter(p => p.featured)
      .sort((a, b) => b.views - a.views);
    return limit ? featured.slice(0, limit) : featured;
  }

  /**
   * Get projects by area
   */
  getProjectsByArea(area: string): CommunityProject[] {
    return COMMUNITY_PROJECTS.filter(p => 
      p.area.toLowerCase() === area.toLowerCase() ||
      p.postcode.toUpperCase().startsWith(area.toUpperCase())
    );
  }

  /**
   * Get projects by type
   */
  getProjectsByType(projectType: string): CommunityProject[] {
    return COMMUNITY_PROJECTS.filter(p => p.projectType === projectType);
  }

  /**
   * Get similar projects
   */
  getSimilarProjects(project: CommunityProject, limit: number = 4): CommunityProject[] {
    return COMMUNITY_PROJECTS
      .filter(p => p.id !== project.id)
      .map(p => ({
        project: p,
        score: this.calculateSimilarityScore(project, p),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(item => item.project);
  }

  /**
   * Calculate similarity score between two projects
   */
  private calculateSimilarityScore(a: CommunityProject, b: CommunityProject): number {
    let score = 0;
    
    // Same project type = 40 points
    if (a.projectType === b.projectType) score += 40;
    
    // Same area = 30 points
    if (a.area === b.area) score += 30;
    
    // Similar budget (within 30%) = 20 points
    const budgetDiff = Math.abs(a.totalCost - b.totalCost) / a.totalCost;
    if (budgetDiff <= 0.3) score += 20;
    
    // Same heritage status = 10 points
    if (a.planning.conservationArea === b.planning.conservationArea) score += 5;
    if (a.planning.listedBuilding === b.planning.listedBuilding) score += 5;
    
    return score;
  }

  /**
   * Get gallery statistics
   */
  getStats(): GalleryStats {
    const projects = COMMUNITY_PROJECTS;
    
    const totalCost = projects.reduce((sum, p) => sum + p.totalCost, 0);
    const totalValueAdd = projects.reduce((sum, p) => sum + p.estimatedValueAdd, 0);
    
    // Count project types
    const typeCounts: Record<string, number> = {};
    projects.forEach(p => {
      typeCounts[p.projectType] = (typeCounts[p.projectType] || 0) + 1;
    });
    const mostPopularType = Object.entries(typeCounts)
      .sort(([, a], [, b]) => b - a)[0]?.[0] || 'unknown';
    
    // Count areas
    const areaCounts: Record<string, number> = {};
    projects.forEach(p => {
      areaCounts[p.area] = (areaCounts[p.area] || 0) + 1;
    });
    const topAreas = Object.entries(areaCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([area, count]) => ({ area, count }));
    
    return {
      totalProjects: projects.length,
      averageCost: Math.round(totalCost / projects.length),
      averageValueAdd: Math.round(totalValueAdd / projects.length),
      mostPopularType,
      topAreas,
    };
  }

  /**
   * Search projects by keyword
   */
  searchProjects(query: string): CommunityProject[] {
    const lowerQuery = query.toLowerCase();
    return COMMUNITY_PROJECTS.filter(p =>
      p.title.toLowerCase().includes(lowerQuery) ||
      p.projectDescription.toLowerCase().includes(lowerQuery) ||
      p.area.toLowerCase().includes(lowerQuery) ||
      p.specifications.materials.some(m => m.toLowerCase().includes(lowerQuery)) ||
      p.specifications.features.some(f => f.toLowerCase().includes(lowerQuery))
    );
  }

  /**
   * Get projects with best ROI
   */
  getTopROIProjects(limit: number = 5): CommunityProject[] {
    return [...COMMUNITY_PROJECTS]
      .filter(p => p.estimatedValueAdd > 0 && p.totalCost > 0)
      .map(p => ({
        project: p,
        roi: (p.estimatedValueAdd - p.totalCost) / p.totalCost * 100,
      }))
      .sort((a, b) => b.roi - a.roi)
      .slice(0, limit)
      .map(item => item.project);
  }
}

// Export singleton
export const communityProjectsGallery = new CommunityProjectsGalleryService();
