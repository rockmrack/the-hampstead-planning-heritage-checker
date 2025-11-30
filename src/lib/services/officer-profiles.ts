/**
 * Planning Officer Profiles Service
 * Track approval patterns by planning officer
 */

export interface OfficerProfile {
  id: string;
  name: string;
  title: string;
  department: string;
  borough: string;
  
  // Contact
  email?: string;
  phone?: string;
  
  // Statistics
  stats: {
    totalDecisions: number;
    approvalRate: number;
    refusalRate: number;
    withdrawnRate: number;
    averageDecisionTime: number; // days
    appealSuccessRate: number; // when officer's decision was overturned
  };
  
  // Specializations
  specializations: string[];
  handlesAreas: string[];
  typicalCaseload: string[];
  
  // Tendencies
  tendencies: {
    strictOnDesign: number; // 1-10
    strictOnMass: number;
    strictOnMaterials: number;
    strictOnNeighborImpact: number;
    strictOnHeritage: number;
    openToNegotiation: number;
    respondsToPreApp: number;
  };
  
  // What they approve/refuse
  approvalPatterns: {
    likelyToApprove: string[];
    likelyToRefuse: string[];
    keyConsiderations: string[];
  };
  
  // Working style
  workingStyle: {
    preAppAvailability: 'good' | 'limited' | 'poor';
    responseTime: 'fast' | 'average' | 'slow';
    communicationStyle: string;
    openToMeetings: boolean;
  };
  
  // Notable decisions
  notableDecisions: {
    applicationRef: string;
    address: string;
    outcome: 'approved' | 'refused' | 'withdrawn';
    significance: string;
  }[];
  
  // Tips for applicants
  tips: string[];
  
  // Last active
  lastActive: string;
  stillInPost: boolean;
}

export interface OfficerDecision {
  applicationRef: string;
  address: string;
  date: string;
  officerId: string;
  outcome: 'approved' | 'refused' | 'withdrawn' | 'delegated-approval' | 'committee-approval' | 'committee-refusal';
  projectType: string;
  conservationArea: boolean;
  listedBuilding: boolean;
  daysToDecision: number;
  neighborObjections: number;
  conditionsCount: number;
}

export interface OfficerTendencyReport {
  officer: OfficerProfile;
  relevantDecisions: OfficerDecision[];
  likelihood: {
    approval: number;
    conditions: string[];
    risks: string[];
    recommendations: string[];
  };
  comparison: {
    vsAverageApprovalRate: number;
    vsAverageDecisionTime: number;
  };
}

// ===========================================
// OFFICER DATABASE
// ===========================================

const OFFICERS: OfficerProfile[] = [
  {
    id: 'officer-001',
    name: 'Sarah Thompson',
    title: 'Senior Planning Officer',
    department: 'Development Management',
    borough: 'Camden',
    stats: {
      totalDecisions: 342,
      approvalRate: 74,
      refusalRate: 18,
      withdrawnRate: 8,
      averageDecisionTime: 52,
      appealSuccessRate: 23,
    },
    specializations: ['Conservation Areas', 'Listed Buildings', 'Residential Extensions'],
    handlesAreas: ['Hampstead', 'Belsize Park', 'South Hampstead'],
    typicalCaseload: ['extensions', 'loft-conversions', 'basement', 'change-of-use'],
    tendencies: {
      strictOnDesign: 8,
      strictOnMass: 7,
      strictOnMaterials: 9,
      strictOnNeighborImpact: 6,
      strictOnHeritage: 9,
      openToNegotiation: 7,
      respondsToPreApp: 8,
    },
    approvalPatterns: {
      likelyToApprove: [
        'Sympathetic rear extensions with traditional materials',
        'Loft conversions with rear dormers only',
        'Basement works with limited lightwell',
        'Like-for-like window replacements',
      ],
      likelyToRefuse: [
        'Large rear extensions visible from street',
        'Modern glazing on front elevations',
        'Roof extensions with front dormers',
        'uPVC in conservation areas',
      ],
      keyConsiderations: [
        'Extremely focused on material authenticity',
        'Wants to see heritage statement for all CA applications',
        'Particularly protective of Hampstead CA character',
        'Values pre-application engagement',
      ],
    },
    workingStyle: {
      preAppAvailability: 'good',
      responseTime: 'average',
      communicationStyle: 'Thorough and detailed. Provides clear reasoning in reports.',
      openToMeetings: true,
    },
    notableDecisions: [
      {
        applicationRef: '2023/4567/FUL',
        address: '42 Keats Grove, NW3',
        outcome: 'refused',
        significance: 'Refused basement despite S73 approval from inspector - rare double refusal',
      },
      {
        applicationRef: '2022/8901/LBC',
        address: '15 Church Row, NW3',
        outcome: 'approved',
        significance: 'Approved innovative basement under Grade II* - set precedent for area',
      },
    ],
    tips: [
      'Always submit a comprehensive heritage statement',
      'Pre-app is highly recommended for CA applications',
      'Be prepared to use traditional materials or justify alternatives thoroughly',
      'Include photos of similar approved schemes in the area',
      'Detailed CGIs showing street scene impact help significantly',
    ],
    lastActive: '2024-12-01',
    stillInPost: true,
  },
  {
    id: 'officer-002',
    name: 'James Mitchell',
    title: 'Principal Planning Officer',
    department: 'Development Management',
    borough: 'Camden',
    stats: {
      totalDecisions: 456,
      approvalRate: 78,
      refusalRate: 15,
      withdrawnRate: 7,
      averageDecisionTime: 45,
      appealSuccessRate: 18,
    },
    specializations: ['Major Applications', 'Residential', 'Commercial'],
    handlesAreas: ['Kentish Town', 'Camden Town', 'Gospel Oak'],
    typicalCaseload: ['extensions', 'new-build', 'change-of-use', 'commercial'],
    tendencies: {
      strictOnDesign: 6,
      strictOnMass: 7,
      strictOnMaterials: 5,
      strictOnNeighborImpact: 8,
      strictOnHeritage: 6,
      openToNegotiation: 8,
      respondsToPreApp: 7,
    },
    approvalPatterns: {
      likelyToApprove: [
        'Contemporary extensions with good design quality',
        'Modern materials if high quality',
        'Sustainable design features',
        'Basement extensions with good engineering',
      ],
      likelyToRefuse: [
        'Schemes with significant overlooking',
        'Loss of family housing',
        'Poor daylight/sunlight results',
        'Inadequate cycle storage',
      ],
      keyConsiderations: [
        'Very focused on neighbor amenity',
        'Requires BRE daylight/sunlight for any impact',
        'Supportive of sustainable design',
        'Less prescriptive about materials than heritage officers',
      ],
    },
    workingStyle: {
      preAppAvailability: 'good',
      responseTime: 'fast',
      communicationStyle: 'Pragmatic and solution-focused. Willing to negotiate.',
      openToMeetings: true,
    },
    notableDecisions: [
      {
        applicationRef: '2023/2345/FUL',
        address: '89 Fortress Road, NW5',
        outcome: 'approved',
        significance: 'Approved zinc-clad extension in Victorian terrace - contemporary design precedent',
      },
    ],
    tips: [
      'Commission BRE assessment early if any potential overshadowing',
      'Include sustainability statement',
      'Focus submission on neighbor impact mitigation',
      'Contemporary design is acceptable if high quality',
    ],
    lastActive: '2024-12-01',
    stillInPost: true,
  },
  {
    id: 'officer-003',
    name: 'Emma Williams',
    title: 'Conservation Officer',
    department: 'Conservation & Urban Design',
    borough: 'Camden',
    stats: {
      totalDecisions: 187,
      approvalRate: 68,
      refusalRate: 24,
      withdrawnRate: 8,
      averageDecisionTime: 62,
      appealSuccessRate: 15,
    },
    specializations: ['Listed Buildings', 'Conservation Areas', 'Heritage'],
    handlesAreas: ['All Camden Conservation Areas'],
    typicalCaseload: ['listed-building-consent', 'conservation-area', 'heritage-impact'],
    tendencies: {
      strictOnDesign: 9,
      strictOnMass: 8,
      strictOnMaterials: 10,
      strictOnNeighborImpact: 5,
      strictOnHeritage: 10,
      openToNegotiation: 5,
      respondsToPreApp: 9,
    },
    approvalPatterns: {
      likelyToApprove: [
        'Traditional repairs using original materials',
        'Sympathetic rear additions not visible from street',
        'Restoration of original features',
        'High-quality craftsmanship',
      ],
      likelyToRefuse: [
        'Any modern materials on front elevation',
        'Rooflights on front roof slopes',
        'Loss of original features',
        'Plastic windows in any form',
      ],
      keyConsiderations: [
        'SPAB principles are important',
        'Reversibility is a key consideration',
        'Original fabric preservation paramount',
        'Traditional lime mortars required',
      ],
    },
    workingStyle: {
      preAppAvailability: 'good',
      responseTime: 'slow',
      communicationStyle: 'Academic and principled. Cites conservation legislation extensively.',
      openToMeetings: true,
    },
    notableDecisions: [
      {
        applicationRef: '2022/1234/LBC',
        address: '8 Frognal, NW3',
        outcome: 'refused',
        significance: 'Refused aluminum windows on Grade II* - upheld at appeal',
      },
    ],
    tips: [
      'Never suggest plastic or aluminum on listed buildings',
      'Reference SPAB principles in your statement',
      'Commission heritage consultant for LBC applications',
      'Be prepared to use traditional lime mortar',
      'Photo documentation of existing condition is essential',
    ],
    lastActive: '2024-12-01',
    stillInPost: true,
  },
  {
    id: 'officer-004',
    name: 'David Patel',
    title: 'Area Planning Officer',
    department: 'Development Management',
    borough: 'Haringey',
    stats: {
      totalDecisions: 289,
      approvalRate: 82,
      refusalRate: 12,
      withdrawnRate: 6,
      averageDecisionTime: 42,
      appealSuccessRate: 30,
    },
    specializations: ['Residential Extensions', 'Householder'],
    handlesAreas: ['Muswell Hill', 'Crouch End', 'Highgate (Haringey side)'],
    typicalCaseload: ['extensions', 'loft-conversions', 'garden-rooms'],
    tendencies: {
      strictOnDesign: 5,
      strictOnMass: 6,
      strictOnMaterials: 4,
      strictOnNeighborImpact: 7,
      strictOnHeritage: 5,
      openToNegotiation: 9,
      respondsToPreApp: 8,
    },
    approvalPatterns: {
      likelyToApprove: [
        'Standard rear extensions',
        'Loft conversions with rear dormers',
        'Side return extensions',
        'Garden rooms under PD',
      ],
      likelyToRefuse: [
        'Overlooking rear neighbors significantly',
        'Schemes exceeding 45-degree line excessively',
        'Front garden parking on terraced streets',
      ],
      keyConsiderations: [
        'Generally supportive of householder applications',
        '45-degree rule is applied but with flexibility',
        'Parking concerns on narrow streets',
        'Less prescriptive on materials in non-CA areas',
      ],
    },
    workingStyle: {
      preAppAvailability: 'good',
      responseTime: 'fast',
      communicationStyle: 'Friendly and approachable. Tries to find ways to approve.',
      openToMeetings: true,
    },
    notableDecisions: [
      {
        applicationRef: 'HGY/2023/1234',
        address: '45 Muswell Road, N10',
        outcome: 'approved',
        significance: 'Approved double-storey extension in Article 4 area - flexible interpretation',
      },
    ],
    tips: [
      'Haringey is generally more supportive than Camden',
      'Focus on neighbor impact mitigation',
      'Include 45-degree diagrams in submissions',
      'Quick turnaround - good for simple applications',
    ],
    lastActive: '2024-12-01',
    stillInPost: true,
  },
  {
    id: 'officer-005',
    name: 'Rachel Green',
    title: 'Senior Conservation Officer',
    department: 'Planning & Building Control',
    borough: 'Haringey',
    stats: {
      totalDecisions: 156,
      approvalRate: 71,
      refusalRate: 21,
      withdrawnRate: 8,
      averageDecisionTime: 55,
      appealSuccessRate: 20,
    },
    specializations: ['Conservation Areas', 'Locally Listed Buildings'],
    handlesAreas: ['Highgate CA', 'Muswell Hill CA', 'Crouch End CA'],
    typicalCaseload: ['conservation-area', 'article-4', 'locally-listed'],
    tendencies: {
      strictOnDesign: 7,
      strictOnMass: 7,
      strictOnMaterials: 8,
      strictOnNeighborImpact: 5,
      strictOnHeritage: 8,
      openToNegotiation: 7,
      respondsToPreApp: 8,
    },
    approvalPatterns: {
      likelyToApprove: [
        'Sympathetic rear extensions',
        'Traditional materials in CA',
        'Restoration schemes',
        'Careful modern interventions',
      ],
      likelyToRefuse: [
        'uPVC windows in CA',
        'Inappropriate front elevation changes',
        'Large roof extensions',
        'Loss of front gardens to parking',
      ],
      keyConsiderations: [
        'More flexible than Camden conservation officers',
        'Accepts some modern materials if well-designed',
        'Values character area appraisals',
        'Prefers design and access statements',
      ],
    },
    workingStyle: {
      preAppAvailability: 'good',
      responseTime: 'average',
      communicationStyle: 'Balanced and reasonable. Explains decisions clearly.',
      openToMeetings: true,
    },
    notableDecisions: [
      {
        applicationRef: 'HGY/2023/5678',
        address: '12 The Grove, N6',
        outcome: 'approved',
        significance: 'Approved contemporary garden building in Highgate CA',
      },
    ],
    tips: [
      'Reference the relevant character area appraisal',
      'Modern design can be approved if subservient',
      'Pre-app is valuable for CA applications',
      'Less dogmatic than Camden - room for discussion',
    ],
    lastActive: '2024-12-01',
    stillInPost: true,
  },
];

// ===========================================
// OFFICER PROFILES SERVICE
// ===========================================

class OfficerProfilesService {
  /**
   * Get all officers for a borough
   */
  getOfficersByBorough(borough: string): OfficerProfile[] {
    return OFFICERS.filter(o => 
      o.borough.toLowerCase() === borough.toLowerCase() && o.stillInPost
    );
  }

  /**
   * Get officers for an area/postcode
   */
  getOfficersForArea(area: string): OfficerProfile[] {
    const normalizedArea = area.toUpperCase();
    
    // Map postcodes to areas
    const postcodeToArea: Record<string, string[]> = {
      'NW3': ['Hampstead', 'Belsize Park', 'South Hampstead'],
      'N6': ['Highgate'],
      'N10': ['Muswell Hill'],
      'N8': ['Crouch End'],
      'NW5': ['Kentish Town', 'Gospel Oak'],
      'NW1': ['Camden Town'],
    };
    
    const areasForPostcode = postcodeToArea[normalizedArea] || [normalizedArea];
    
    return OFFICERS.filter(o => 
      o.stillInPost &&
      o.handlesAreas.some(a => 
        areasForPostcode.some(target => 
          a.toLowerCase().includes(target.toLowerCase()) ||
          target.toLowerCase().includes(a.toLowerCase())
        )
      )
    );
  }

  /**
   * Get officer by ID
   */
  getOfficer(id: string): OfficerProfile | undefined {
    return OFFICERS.find(o => o.id === id);
  }

  /**
   * Get officer by name
   */
  getOfficerByName(name: string): OfficerProfile | undefined {
    return OFFICERS.find(o => 
      o.name.toLowerCase() === name.toLowerCase()
    );
  }

  /**
   * Generate tendency report for a project
   */
  generateTendencyReport(
    postcode: string,
    projectType: string,
    isConservationArea: boolean,
    isListedBuilding: boolean
  ): OfficerTendencyReport | null {
    const officers = this.getOfficersForArea(postcode);
    
    if (officers.length === 0) return null;
    
    // Find most relevant officer
    let relevantOfficer = officers[0]!;
    
    if (isListedBuilding || isConservationArea) {
      const conservationOfficer = officers.find(o => 
        o.specializations.some(s => 
          s.toLowerCase().includes('conservation') || 
          s.toLowerCase().includes('listed')
        )
      );
      if (conservationOfficer) relevantOfficer = conservationOfficer;
    }
    
    // Calculate likelihood based on tendencies and patterns
    const likelihood = this.calculateLikelihood(relevantOfficer, projectType, isConservationArea, isListedBuilding);
    
    // Generate relevant decisions (simulated)
    const relevantDecisions = this.simulateRelevantDecisions(relevantOfficer, projectType);
    
    // Calculate comparison
    const averageApprovalRate = OFFICERS.reduce((sum, o) => sum + o.stats.approvalRate, 0) / OFFICERS.length;
    const averageDecisionTime = OFFICERS.reduce((sum, o) => sum + o.stats.averageDecisionTime, 0) / OFFICERS.length;
    
    return {
      officer: relevantOfficer,
      relevantDecisions,
      likelihood,
      comparison: {
        vsAverageApprovalRate: relevantOfficer.stats.approvalRate - averageApprovalRate,
        vsAverageDecisionTime: relevantOfficer.stats.averageDecisionTime - averageDecisionTime,
      },
    };
  }

  /**
   * Calculate approval likelihood
   */
  private calculateLikelihood(
    officer: OfficerProfile,
    projectType: string,
    isConservationArea: boolean,
    isListedBuilding: boolean
  ): OfficerTendencyReport['likelihood'] {
    let baseApproval = officer.stats.approvalRate;
    const conditions: string[] = [];
    const risks: string[] = [];
    const recommendations: string[] = [];
    
    // Adjust based on heritage status
    if (isListedBuilding) {
      baseApproval -= 10;
      conditions.push('Listed building consent required');
      conditions.push('Heritage statement essential');
      risks.push('Traditional materials may be mandated');
      recommendations.push('Commission heritage consultant');
      recommendations.push('Request pre-application advice');
    }
    
    if (isConservationArea) {
      baseApproval -= 5;
      conditions.push('Design must preserve/enhance CA character');
      risks.push('Modern materials may be restricted');
      recommendations.push('Reference character area appraisal');
    }
    
    // Adjust based on officer tendencies
    const projectTendencies: Record<string, keyof OfficerProfile['tendencies']> = {
      'basement': 'strictOnMass',
      'loft-conversion': 'strictOnMass',
      'rear-extension-single': 'strictOnNeighborImpact',
      'rear-extension-double': 'strictOnNeighborImpact',
    };
    
    const relevantTendency = projectTendencies[projectType];
    if (relevantTendency) {
      const strictness = officer.tendencies[relevantTendency];
      if (strictness >= 8) {
        baseApproval -= 5;
        risks.push(`Officer is very strict on ${relevantTendency.replace('strictOn', '').toLowerCase()}`);
      } else if (strictness <= 4) {
        baseApproval += 3;
      }
    }
    
    // Add standard recommendations
    if (officer.tendencies.openToNegotiation >= 7) {
      recommendations.push('Officer is open to negotiation - engage early');
    }
    
    if (officer.tendencies.respondsToPreApp >= 7) {
      recommendations.push('Pre-application advice recommended');
    }
    
    // Add patterns
    officer.approvalPatterns.keyConsiderations.forEach(c => {
      conditions.push(c);
    });
    
    return {
      approval: Math.min(95, Math.max(30, baseApproval)),
      conditions,
      risks,
      recommendations,
    };
  }

  /**
   * Simulate relevant decisions for context
   */
  private simulateRelevantDecisions(officer: OfficerProfile, projectType: string): OfficerDecision[] {
    // In production, this would query actual planning database
    const decisions: OfficerDecision[] = [];
    
    const outcomes: Array<'approved' | 'refused' | 'delegated-approval'> = [
      'approved', 'approved', 'approved', 'delegated-approval', 'refused'
    ];
    
    for (let i = 0; i < 5; i++) {
      const isApproved = Math.random() < (officer.stats.approvalRate / 100);
      decisions.push({
        applicationRef: `2024/${1000 + i}/FUL`,
        address: `${10 + i} Example Street, ${officer.handlesAreas[0] || 'London'}`,
        date: new Date(Date.now() - i * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] ?? '',
        officerId: officer.id,
        outcome: isApproved ? (outcomes[Math.floor(Math.random() * 4)] ?? 'approved') : 'refused',
        projectType,
        conservationArea: Math.random() > 0.5,
        listedBuilding: Math.random() > 0.8,
        daysToDecision: Math.floor(officer.stats.averageDecisionTime * (0.8 + Math.random() * 0.4)),
        neighborObjections: Math.floor(Math.random() * 5),
        conditionsCount: isApproved ? Math.floor(5 + Math.random() * 10) : 0,
      });
    }
    
    return decisions;
  }

  /**
   * Get tips for working with an officer
   */
  getTipsForOfficer(officerId: string): string[] {
    const officer = this.getOfficer(officerId);
    if (!officer) return [];
    
    const tips = [...officer.tips];
    
    // Add generated tips based on tendencies
    if (officer.tendencies.strictOnMaterials >= 8) {
      tips.push('Always specify materials in detail - this officer scrutinizes material choices');
    }
    
    if (officer.tendencies.strictOnNeighborImpact >= 8) {
      tips.push('Include daylight/sunlight assessment and neighbor impact analysis');
    }
    
    if (officer.workingStyle.responseTime === 'slow') {
      tips.push('Allow extra time - this officer typically takes longer to respond');
    }
    
    return tips;
  }
}

// Export singleton
export const officerProfilesService = new OfficerProfilesService();
