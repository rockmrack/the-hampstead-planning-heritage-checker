/**
 * Property History API
 * Planning and development history endpoints
 * GET/POST /api/property-history
 */

import { NextRequest, NextResponse } from 'next/server';

// Types
type ApplicationStatus = 'pending' | 'approved' | 'refused' | 'withdrawn' | 'appealed';
type ApplicationType = 'householder' | 'full_planning' | 'listed_building' | 'conservation_area' | 'tree_works';

interface PlanningApplication {
  reference: string;
  type: ApplicationType;
  description: string;
  status: ApplicationStatus;
  dateSubmitted: string;
  dateDecided?: string;
  decisionLevel: 'delegated' | 'committee';
  officer: string;
}

// Sample data
const SAMPLE_APPLICATIONS: Record<string, PlanningApplication[]> = {
  'NW3': [
    {
      reference: '2023/4567/HSE',
      type: 'householder',
      description: 'Single storey rear extension with roof lantern',
      status: 'approved',
      dateSubmitted: '2023-06-15',
      dateDecided: '2023-08-20',
      decisionLevel: 'delegated',
      officer: 'J Smith',
    },
    {
      reference: '2022/1234/P',
      type: 'full_planning',
      description: 'Basement extension and rear addition',
      status: 'refused',
      dateSubmitted: '2022-03-10',
      dateDecided: '2022-06-15',
      decisionLevel: 'committee',
      officer: 'M Brown',
    },
    {
      reference: '2021/7890/LBC',
      type: 'listed_building',
      description: 'Internal alterations and new rooflights',
      status: 'approved',
      dateSubmitted: '2021-09-01',
      dateDecided: '2021-12-01',
      decisionLevel: 'delegated',
      officer: 'S Wilson',
    },
  ],
  'N6': [
    {
      reference: '2023/5678/HSE',
      type: 'householder',
      description: 'Loft conversion with rear dormer',
      status: 'approved',
      dateSubmitted: '2023-04-01',
      dateDecided: '2023-06-15',
      decisionLevel: 'delegated',
      officer: 'A Johnson',
    },
  ],
};

const HISTORIC_EVENTS: Record<string, { year: number; event: string }[]> = {
  'NW3': [
    { year: 1890, event: 'Original construction of Victorian terraces' },
    { year: 1967, event: 'Area designated as Conservation Area' },
    { year: 1985, event: 'Article 4 Direction introduced' },
  ],
  'N6': [
    { year: 1800, event: 'Georgian development of High Street' },
    { year: 1968, event: 'Conservation Area designated' },
  ],
};

function extractAreaPrefix(postcode: string): string {
  const match = postcode.match(/^(NW\d{1,2}|N\d{1,2})/i);
  return match && match[1] ? match[1].toUpperCase() : 'NW3';
}

interface HistoryRequest {
  address: string;
  postcode: string;
  yearsBack?: number;
  includeAppeals?: boolean;
}

function getPropertyHistory(input: HistoryRequest) {
  const areaPrefix = extractAreaPrefix(input.postcode);
  const applications = SAMPLE_APPLICATIONS[areaPrefix] ?? SAMPLE_APPLICATIONS['NW3'] ?? [];
  const events = HISTORIC_EVENTS[areaPrefix] ?? HISTORIC_EVENTS['NW3'] ?? [];
  
  const approved = applications.filter(a => a.status === 'approved');
  const refused = applications.filter(a => a.status === 'refused');
  
  // Risk factors
  const riskFactors: { factor: string; risk: string; explanation: string }[] = [];
  
  if (refused.length > 0) {
    riskFactors.push({
      factor: 'Previous Refusals',
      risk: refused.length > 2 ? 'high' : 'medium',
      explanation: `${refused.length} previous application(s) refused`,
    });
  }
  
  const hasCommittee = applications.some(a => a.decisionLevel === 'committee');
  if (hasCommittee) {
    riskFactors.push({
      factor: 'Committee Attention',
      risk: 'medium',
      explanation: 'Property has received committee scrutiny',
    });
  }
  
  if (riskFactors.length === 0) {
    riskFactors.push({
      factor: 'Clean History',
      risk: 'low',
      explanation: 'No significant issues identified',
    });
  }
  
  return {
    property: {
      address: input.address,
      postcode: input.postcode,
    },
    summary: {
      totalApplications: applications.length,
      approved: approved.length,
      refused: refused.length,
    },
    planningApplications: applications,
    historicEvents: events,
    riskFactors,
    significantWorks: approved.map(a => ({
      year: new Date(a.dateDecided ?? a.dateSubmitted).getFullYear(),
      works: a.description,
    })),
  };
}

function getAreaStatistics(postcode: string) {
  const areaPrefix = extractAreaPrefix(postcode);
  
  return {
    area: areaPrefix,
    recentApplications: [
      { type: 'Householder', count: 145, approvalRate: 78 },
      { type: 'Listed Building', count: 32, approvalRate: 65 },
      { type: 'Full Planning', count: 67, approvalRate: 62 },
      { type: 'Tree Works', count: 89, approvalRate: 92 },
    ],
    trends: [
      'Basement applications receiving increased scrutiny',
      'Conservation officer requiring more detail on heritage statements',
      'Committee decisions trending stricter on extensions',
    ],
  };
}

export async function POST(request: NextRequest) {
  try {
    const body: HistoryRequest = await request.json();
    
    if (!body.address || !body.postcode) {
      return NextResponse.json(
        { error: 'Missing required fields: address, postcode' },
        { status: 400 }
      );
    }
    
    const history = getPropertyHistory(body);
    
    return NextResponse.json({
      success: true,
      history,
      generatedAt: new Date().toISOString(),
    });
    
  } catch (error) {
    console.error('Property history error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve property history' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const postcode = searchParams.get('postcode');
  const reference = searchParams.get('reference');
  
  if (reference) {
    // Search for specific application
    for (const apps of Object.values(SAMPLE_APPLICATIONS)) {
      const found = apps.find(a => a.reference === reference);
      if (found) {
        return NextResponse.json({ application: found });
      }
    }
    return NextResponse.json({ error: 'Application not found' }, { status: 404 });
  }
  
  if (postcode) {
    const stats = getAreaStatistics(postcode);
    return NextResponse.json(stats);
  }
  
  return NextResponse.json({
    service: 'Property History API',
    version: '1.0.0',
    description: 'Planning and development history',
    endpoints: {
      'GET /api/property-history': 'Service info',
      'GET /api/property-history?postcode=NW3': 'Area statistics',
      'GET /api/property-history?reference=2023/4567/HSE': 'Find application',
      'POST /api/property-history': 'Full property history',
    },
    areasCovered: Object.keys(SAMPLE_APPLICATIONS),
  });
}
