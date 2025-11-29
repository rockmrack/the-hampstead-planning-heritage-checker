/**
 * Committee Intelligence API
 * Committee decisions, member patterns, and meeting preparation
 * GET/POST /api/committee
 */

import { NextRequest, NextResponse } from 'next/server';

// Types
interface CommitteeMember {
  id: string;
  name: string;
  ward: string;
  party: string;
  position: string;
  approvalRate: number;
  heritageStance: 'strict' | 'moderate' | 'permissive';
}

interface MeetingInfo {
  date: string;
  venue: string;
  registrationDeadline: string;
  speakingTime: number;
}

// Sample data
const COMMITTEE_MEMBERS: CommitteeMember[] = [
  {
    id: 'cllr-001',
    name: 'Cllr Victoria Bennett',
    ward: 'Hampstead Town',
    party: 'Conservative',
    position: 'Chair',
    approvalRate: 58,
    heritageStance: 'strict',
  },
  {
    id: 'cllr-002',
    name: 'Cllr James Morrison',
    ward: 'Belsize',
    party: 'Labour',
    position: 'Vice-Chair',
    approvalRate: 72,
    heritageStance: 'moderate',
  },
  {
    id: 'cllr-003',
    name: 'Cllr Sarah Chen',
    ward: 'Highgate',
    party: 'Liberal Democrat',
    position: 'Member',
    approvalRate: 65,
    heritageStance: 'moderate',
  },
  {
    id: 'cllr-004',
    name: 'Cllr Robert Taylor',
    ward: 'Frognal',
    party: 'Conservative',
    position: 'Member',
    approvalRate: 45,
    heritageStance: 'strict',
  },
  {
    id: 'cllr-005',
    name: 'Cllr Emma Wilson',
    ward: 'Gospel Oak',
    party: 'Labour',
    position: 'Member',
    approvalRate: 78,
    heritageStance: 'permissive',
  },
];

const UPCOMING_MEETINGS: MeetingInfo[] = [
  {
    date: '2024-02-15',
    venue: 'Camden Town Hall',
    registrationDeadline: '2024-02-14 12:00',
    speakingTime: 3,
  },
  {
    date: '2024-03-07',
    venue: 'Camden Town Hall',
    registrationDeadline: '2024-03-06 12:00',
    speakingTime: 3,
  },
];

function predictOutcome(isHeritage: boolean, isBasement: boolean, hasObjections: boolean) {
  let approvalLikelihood = 60;
  const factors: string[] = [];
  
  if (isHeritage) {
    approvalLikelihood -= 10;
    factors.push('Heritage applications face greater scrutiny');
  }
  
  if (isBasement) {
    approvalLikelihood -= 15;
    factors.push('Basement developments often controversial');
  }
  
  if (hasObjections) {
    approvalLikelihood -= 10;
    factors.push('Neighbour objections carry weight');
  }
  
  const memberPositions = COMMITTEE_MEMBERS.map(m => {
    let position: 'support' | 'oppose' | 'uncertain' = 'uncertain';
    if (isHeritage && m.heritageStance === 'strict') {
      position = 'oppose';
    } else if (m.approvalRate > 70) {
      position = 'support';
    } else if (m.approvalRate < 50) {
      position = 'oppose';
    }
    return { member: m.name, position };
  });
  
  return {
    predictedOutcome: approvalLikelihood >= 60 ? 'approve' : approvalLikelihood >= 40 ? 'uncertain' : 'refuse',
    confidence: Math.abs(approvalLikelihood - 50) + 50,
    factors,
    memberPositions,
    likelihood: approvalLikelihood,
  };
}

function getSpeakingGuidance(speakerType: 'applicant' | 'objector') {
  const tips = [
    'Focus on planning merits, not personal matters',
    'Reference specific policies',
    'Be concise and factual',
    'Address members directly',
  ];
  
  if (speakerType === 'applicant') {
    tips.push('Emphasize benefits and policy compliance');
    tips.push('Address officer concerns proactively');
  } else {
    tips.push('Focus on material planning considerations');
    tips.push('Cite specific policy breaches');
  }
  
  return {
    timeAllowed: 3,
    registrationDeadline: '24 hours before meeting',
    tips,
    structure: [
      { section: 'Introduction', duration: 30, points: ['State name and connection'] },
      { section: 'Main Arguments', duration: 120, points: ['2-3 key planning points'] },
      { section: 'Summary', duration: 30, points: ['Clear request to committee'] },
    ],
    doNots: [
      'Repeat written submission points',
      'Attack individuals personally',
      'Discuss non-planning matters',
      'Exceed time limit',
    ],
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;
    
    if (action === 'predict') {
      const { isHeritage, isBasement, hasObjections } = body;
      const prediction = predictOutcome(
        isHeritage || false,
        isBasement || false,
        hasObjections || false
      );
      
      return NextResponse.json({
        success: true,
        prediction,
      });
    }
    
    if (action === 'speaking-guidance') {
      const { speakerType } = body;
      if (!speakerType || !['applicant', 'objector'].includes(speakerType)) {
        return NextResponse.json(
          { error: 'Invalid speakerType. Use "applicant" or "objector"' },
          { status: 400 }
        );
      }
      
      const guidance = getSpeakingGuidance(speakerType as 'applicant' | 'objector');
      return NextResponse.json({ success: true, guidance });
    }
    
    if (action === 'preparation-checklist') {
      const { role } = body;
      const checklist = {
        timeline: [
          { days: 14, action: 'Review officer report when published' },
          { days: 7, action: 'Prepare speaking points' },
          { days: 5, action: 'Register to speak if desired' },
          { days: 3, action: 'Submit additional written comments' },
          { days: 1, action: 'Confirm registration and review agenda' },
          { days: 0, action: 'Attend committee meeting' },
        ],
        documents: [
          'Officer committee report',
          'Application drawings',
          'Consultation responses',
          'Relevant planning policies',
        ],
        contacts: [
          { entity: 'Democratic Services', purpose: 'Speaker registration' },
          { entity: 'Case Officer', purpose: 'Procedural queries' },
        ],
      };
      
      if (role === 'applicant') {
        checklist.documents.push('Heritage statement (if applicable)');
        checklist.documents.push('Design and access statement');
      }
      
      return NextResponse.json({ success: true, checklist });
    }
    
    return NextResponse.json(
      { error: 'Invalid action. Use: predict, speaking-guidance, preparation-checklist' },
      { status: 400 }
    );
    
  } catch (error) {
    console.error('Committee API error:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');
  
  if (query === 'members') {
    return NextResponse.json({
      count: COMMITTEE_MEMBERS.length,
      members: COMMITTEE_MEMBERS,
    });
  }
  
  if (query === 'meetings') {
    return NextResponse.json({
      upcomingMeetings: UPCOMING_MEETINGS,
    });
  }
  
  if (query === 'stats') {
    const avgApprovalRate = COMMITTEE_MEMBERS.reduce((sum, m) => sum + m.approvalRate, 0) / COMMITTEE_MEMBERS.length;
    const strictMembers = COMMITTEE_MEMBERS.filter(m => m.heritageStance === 'strict').length;
    
    return NextResponse.json({
      averageApprovalRate: Math.round(avgApprovalRate),
      strictHeritageMembers: strictMembers,
      moderateMembers: COMMITTEE_MEMBERS.filter(m => m.heritageStance === 'moderate').length,
      permissiveMembers: COMMITTEE_MEMBERS.filter(m => m.heritageStance === 'permissive').length,
    });
  }
  
  return NextResponse.json({
    service: 'Committee Intelligence API',
    version: '1.0.0',
    description: 'Planning committee insights and predictions',
    endpoints: {
      'GET /api/committee': 'Service info',
      'GET /api/committee?query=members': 'Committee member profiles',
      'GET /api/committee?query=meetings': 'Upcoming meetings',
      'GET /api/committee?query=stats': 'Committee statistics',
      'POST /api/committee (action: predict)': 'Predict committee outcome',
      'POST /api/committee (action: speaking-guidance)': 'Speaking guidance',
      'POST /api/committee (action: preparation-checklist)': 'Meeting preparation',
    },
  });
}
