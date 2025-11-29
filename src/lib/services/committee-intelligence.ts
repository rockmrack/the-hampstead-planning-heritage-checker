/**
 * Planning Committee Intelligence Service
 * Insights into committee decisions, member voting patterns, and meeting preparation
 */

// Types
export interface CommitteeMember {
  id: string;
  name: string;
  ward: string;
  party: string;
  position: 'chair' | 'vice_chair' | 'member';
  yearsOnCommittee: number;
  attendanceRate: number; // percentage
  votingPattern: {
    approvalRate: number;
    heritageStance: 'strict' | 'moderate' | 'permissive';
    keyIssues: string[];
  };
}

export interface CommitteeMeeting {
  date: string;
  type: 'planning' | 'sub_committee' | 'site_visit';
  venue: string;
  agenda: {
    itemNumber: number;
    applicationRef: string;
    address: string;
    description: string;
    recommendation: 'approve' | 'refuse' | 'defer';
    speaking?: { time: string; registration: string };
  }[];
  deadlines: {
    speakerRegistration: string;
    publicQuestions: string;
    additionalInfo: string;
  };
}

export interface CommitteeDecision {
  applicationRef: string;
  meetingDate: string;
  officerRecommendation: 'approve' | 'refuse';
  committeeDecision: 'approve' | 'refuse' | 'defer';
  overturned: boolean;
  voteSplit: { for: number; against: number; abstain: number };
  keyIssues: string[];
  conditions?: string[];
  reasons?: string[];
}

export interface SpeakingGuidance {
  timeAllowed: number; // minutes
  registrationDeadline: string;
  tips: string[];
  structure: { section: string; duration: number; keyPoints: string[] }[];
  doNots: string[];
}

// Sample committee members
const COMMITTEE_MEMBERS: CommitteeMember[] = [
  {
    id: 'cllr-001',
    name: 'Cllr Victoria Bennett',
    ward: 'Hampstead Town',
    party: 'Conservative',
    position: 'chair',
    yearsOnCommittee: 8,
    attendanceRate: 95,
    votingPattern: {
      approvalRate: 58,
      heritageStance: 'strict',
      keyIssues: ['Conservation area character', 'Listed buildings', 'Tree protection'],
    },
  },
  {
    id: 'cllr-002',
    name: 'Cllr James Morrison',
    ward: 'Belsize',
    party: 'Labour',
    position: 'vice_chair',
    yearsOnCommittee: 5,
    attendanceRate: 88,
    votingPattern: {
      approvalRate: 72,
      heritageStance: 'moderate',
      keyIssues: ['Affordable housing', 'Sustainability', 'Neighbour amenity'],
    },
  },
  {
    id: 'cllr-003',
    name: 'Cllr Sarah Chen',
    ward: 'Highgate',
    party: 'Liberal Democrat',
    position: 'member',
    yearsOnCommittee: 3,
    attendanceRate: 92,
    votingPattern: {
      approvalRate: 65,
      heritageStance: 'moderate',
      keyIssues: ['Environmental impact', 'Design quality', 'Community benefit'],
    },
  },
  {
    id: 'cllr-004',
    name: 'Cllr Robert Taylor',
    ward: 'Frognal and Fitzjohns',
    party: 'Conservative',
    position: 'member',
    yearsOnCommittee: 6,
    attendanceRate: 85,
    votingPattern: {
      approvalRate: 45,
      heritageStance: 'strict',
      keyIssues: ['Basement developments', 'Scale and bulk', 'Local character'],
    },
  },
  {
    id: 'cllr-005',
    name: 'Cllr Emma Wilson',
    ward: 'Gospel Oak',
    party: 'Labour',
    position: 'member',
    yearsOnCommittee: 2,
    attendanceRate: 90,
    votingPattern: {
      approvalRate: 78,
      heritageStance: 'permissive',
      keyIssues: ['Housing delivery', 'Accessibility', 'Modern design'],
    },
  },
];

// Sample upcoming meetings
const UPCOMING_MEETINGS: CommitteeMeeting[] = [
  {
    date: '2024-02-15',
    type: 'planning',
    venue: 'Camden Town Hall, Euston Road',
    agenda: [
      {
        itemNumber: 1,
        applicationRef: '2023/5678/P',
        address: '15 Holly Hill, NW3',
        description: 'Basement extension and rear conservatory',
        recommendation: 'approve',
        speaking: { time: '3 minutes', registration: '24 hours before' },
      },
      {
        itemNumber: 2,
        applicationRef: '2023/6789/LBC',
        address: '42 Church Row, NW3',
        description: 'Internal alterations to Grade II listed building',
        recommendation: 'approve',
        speaking: { time: '3 minutes', registration: '24 hours before' },
      },
    ],
    deadlines: {
      speakerRegistration: '2024-02-14 12:00',
      publicQuestions: '2024-02-14 12:00',
      additionalInfo: '2024-02-13 17:00',
    },
  },
];

// Historical decisions for pattern analysis
const HISTORICAL_DECISIONS: CommitteeDecision[] = [
  {
    applicationRef: '2023/1234/P',
    meetingDate: '2023-11-15',
    officerRecommendation: 'approve',
    committeeDecision: 'refuse',
    overturned: true,
    voteSplit: { for: 3, against: 5, abstain: 0 },
    keyIssues: ['Scale inappropriate for conservation area', 'Loss of garden space'],
    reasons: ['Contrary to CPG1 Design principles', 'Harmful to CA character'],
  },
  {
    applicationRef: '2023/2345/HSE',
    meetingDate: '2023-10-20',
    officerRecommendation: 'refuse',
    committeeDecision: 'approve',
    overturned: true,
    voteSplit: { for: 5, against: 3, abstain: 0 },
    keyIssues: ['Design quality improved', 'Precedent in immediate area'],
    conditions: ['Materials to match existing', 'Landscaping scheme required'],
  },
];

export class CommitteeIntelligenceService {
  /**
   * Get committee member profiles
   */
  getCommitteeMembers(): CommitteeMember[] {
    return COMMITTEE_MEMBERS;
  }

  /**
   * Get upcoming committee meetings
   */
  getUpcomingMeetings(): CommitteeMeeting[] {
    return UPCOMING_MEETINGS;
  }

  /**
   * Analyze committee voting patterns for similar applications
   */
  analyzeVotingPatterns(
    applicationCharacteristics: {
      isHeritage: boolean;
      isBasement: boolean;
      hasNeighbourObjections: boolean;
    }
  ): {
    predictedOutcome: 'approve' | 'refuse' | 'uncertain';
    confidence: number;
    keyFactors: string[];
    memberLikelyPositions: { member: string; likelyPosition: 'support' | 'oppose' | 'uncertain' }[];
  } {
    const factors: string[] = [];
    let approvalLikelihood = 60; // baseline
    const memberPositions: { member: string; likelyPosition: 'support' | 'oppose' | 'uncertain' }[] = [];
    
    // Heritage projects face more scrutiny
    if (applicationCharacteristics.isHeritage) {
      approvalLikelihood -= 10;
      factors.push('Heritage applications receive greater scrutiny');
    }
    
    // Basement applications are controversial
    if (applicationCharacteristics.isBasement) {
      approvalLikelihood -= 15;
      factors.push('Basement developments often face member concerns');
    }
    
    // Neighbour objections impact decisions
    if (applicationCharacteristics.hasNeighbourObjections) {
      approvalLikelihood -= 10;
      factors.push('Neighbour objections carry weight with committee');
    }
    
    // Analyze each member's likely position
    for (const member of COMMITTEE_MEMBERS) {
      let position: 'support' | 'oppose' | 'uncertain' = 'uncertain';
      
      if (applicationCharacteristics.isHeritage && member.votingPattern.heritageStance === 'strict') {
        position = 'oppose';
      } else if (member.votingPattern.approvalRate > 70) {
        position = 'support';
      } else if (member.votingPattern.approvalRate < 50) {
        position = 'oppose';
      }
      
      memberPositions.push({ member: member.name, likelyPosition: position });
    }
    
    const predictedOutcome = approvalLikelihood >= 60 ? 'approve' : approvalLikelihood >= 40 ? 'uncertain' : 'refuse';
    
    return {
      predictedOutcome,
      confidence: Math.abs(approvalLikelihood - 50) + 50,
      keyFactors: factors,
      memberLikelyPositions: memberPositions,
    };
  }

  /**
   * Get speaking guidance for committee meetings
   */
  getSpeakingGuidance(speakerType: 'applicant' | 'objector' | 'supporter'): SpeakingGuidance {
    const baseGuidance: SpeakingGuidance = {
      timeAllowed: 3,
      registrationDeadline: '24 hours before meeting',
      tips: [
        'Focus on planning merits, not personal matters',
        'Reference specific policies',
        'Be concise and factual',
        'Address members directly',
        'Have backup points if time permits',
      ],
      structure: [
        {
          section: 'Introduction',
          duration: 0.5,
          keyPoints: ['State name and connection to application'],
        },
        {
          section: 'Main Arguments',
          duration: 2,
          keyPoints: ['Focus on 2-3 key planning points', 'Reference relevant policies'],
        },
        {
          section: 'Summary',
          duration: 0.5,
          keyPoints: ['Clear request to committee', 'Thank members'],
        },
      ],
      doNots: [
        'Don\'t repeat points already in your written submission',
        'Don\'t attack individuals personally',
        'Don\'t discuss matters outside planning control',
        'Don\'t exceed time limit',
        'Don\'t bring props or visual aids without permission',
      ],
    };
    
    if (speakerType === 'applicant') {
      baseGuidance.tips.push('Emphasize benefits and policy compliance');
      baseGuidance.tips.push('Address any officer concerns proactively');
    } else if (speakerType === 'objector') {
      baseGuidance.tips.push('Focus on material planning considerations');
      baseGuidance.tips.push('Cite specific policy breaches');
    } else {
      baseGuidance.tips.push('Explain why you support the development');
      baseGuidance.tips.push('Address community benefits');
    }
    
    return baseGuidance;
  }

  /**
   * Get historical decision analysis for similar applications
   */
  getHistoricalAnalysis(
    applicationType: string,
    isConservationArea: boolean
  ): {
    totalDecisions: number;
    approvalRate: number;
    overturnRate: number;
    commonIssues: string[];
    recentTrends: string[];
  } {
    const decisions = HISTORICAL_DECISIONS;
    const total = decisions.length;
    const approved = decisions.filter(d => d.committeeDecision === 'approve').length;
    const overturned = decisions.filter(d => d.overturned).length;
    
    // Extract common issues
    const allIssues = decisions.flatMap(d => d.keyIssues);
    const issueCounts = new Map<string, number>();
    for (const issue of allIssues) {
      issueCounts.set(issue, (issueCounts.get(issue) || 0) + 1);
    }
    const commonIssues = Array.from(issueCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([issue]) => issue);
    
    const recentTrends: string[] = [
      'Increased focus on heritage impact statements',
      'Greater scrutiny of basement developments',
      'Design quality becoming decisive factor',
      'Sustainability measures gaining importance',
    ];
    
    if (isConservationArea) {
      recentTrends.push('Conservation area applications receiving more detailed review');
    }
    
    return {
      totalDecisions: total,
      approvalRate: total > 0 ? Math.round((approved / total) * 100) : 0,
      overturnRate: total > 0 ? Math.round((overturned / total) * 100) : 0,
      commonIssues,
      recentTrends,
    };
  }

  /**
   * Generate committee meeting preparation checklist
   */
  generatePreparationChecklist(role: 'applicant' | 'objector'): {
    timeline: { days: number; action: string; status: 'pending' | 'complete' }[];
    documents: string[];
    contactPoints: { entity: string; contact: string; purpose: string }[];
  } {
    const timeline = [
      { days: 14, action: 'Review officer report when published', status: 'pending' as const },
      { days: 7, action: 'Prepare speaking points', status: 'pending' as const },
      { days: 5, action: 'Register to speak if desired', status: 'pending' as const },
      { days: 3, action: 'Submit any additional written comments', status: 'pending' as const },
      { days: 1, action: 'Confirm registration and review final agenda', status: 'pending' as const },
      { days: 0, action: 'Attend committee meeting', status: 'pending' as const },
    ];
    
    const documents = [
      'Officer committee report',
      'Application drawings and documents',
      'Consultation responses summary',
      'Any late representations',
      'Relevant planning policies',
    ];
    
    if (role === 'applicant') {
      documents.push('Heritage statement (if applicable)');
      documents.push('Design and access statement');
    }
    
    const contactPoints = [
      {
        entity: 'Democratic Services',
        contact: 'democracy@camden.gov.uk',
        purpose: 'Speaker registration',
      },
      {
        entity: 'Case Officer',
        contact: 'See application file',
        purpose: 'Procedural queries',
      },
      {
        entity: 'Committee Services',
        contact: '020 7974 5545',
        purpose: 'Meeting logistics',
      },
    ];
    
    return { timeline, documents, contactPoints };
  }
}

export const committeeIntelligenceService = new CommitteeIntelligenceService();
