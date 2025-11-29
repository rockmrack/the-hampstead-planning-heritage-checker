/**
 * Construction Logistics API
 * Permits, traffic management, and construction planning
 * GET/POST /api/construction-logistics
 */

import { NextRequest, NextResponse } from 'next/server';

// Types
type PermitType = 'scaffolding' | 'skip' | 'hoarding' | 'crane' | 'parking_suspension';

interface PermitInfo {
  type: PermitType;
  authority: string;
  leadTime: string;
  fees: { min: number; max: number };
  conditions: string[];
}

// Permit database
const PERMITS: Record<PermitType, PermitInfo> = {
  scaffolding: {
    type: 'scaffolding',
    authority: 'Camden Council Highways',
    leadTime: '10 working days',
    fees: { min: 200, max: 800 },
    conditions: [
      'Minimum 2.4m height clearance',
      'Adequate lighting for pedestrians',
      'Public liability insurance required',
    ],
  },
  skip: {
    type: 'skip',
    authority: 'Camden Council Highways',
    leadTime: '3 working days',
    fees: { min: 35, max: 85 },
    conditions: [
      'Reflective marking required',
      'Cover when containing dusty materials',
      'Licensed waste carrier only',
    ],
  },
  hoarding: {
    type: 'hoarding',
    authority: 'Camden Council Highways',
    leadTime: '15 working days',
    fees: { min: 350, max: 1500 },
    conditions: [
      'Minimum 1.2m pedestrian walkway',
      'Adequate lighting at all times',
      'Regular condition inspections',
    ],
  },
  crane: {
    type: 'crane',
    authority: 'Camden Council Highways + Planning',
    leadTime: '20 working days',
    fees: { min: 500, max: 3000 },
    conditions: [
      'Weekend/early morning lifts preferred',
      'Banksman required near roads',
      'Weather contingency planning',
    ],
  },
  parking_suspension: {
    type: 'parking_suspension',
    authority: 'Camden Council Parking',
    leadTime: '7 working days',
    fees: { min: 40, max: 80 },
    conditions: [
      'No cones until suspension starts',
      'Construction use only',
      'Refund possible for unused days',
    ],
  },
};

const WORKING_HOURS = {
  standard: '08:00 - 18:00 Monday to Friday',
  saturday: '08:00 - 13:00',
  prohibited: 'Sundays, Bank Holidays',
  noisyWorks: '09:00 - 17:00 weekdays only',
};

function assessPermits(
  developmentType: string,
  hasBasement: boolean,
  accessType: string
) {
  const required: PermitInfo[] = [];
  const devLower = developmentType.toLowerCase();
  const isStreet = accessType === 'street' || accessType === 'mews';
  
  // Scaffolding
  if (devLower.includes('extension') || devLower.includes('loft') || hasBasement) {
    if (isStreet) {
      required.push(PERMITS.scaffolding);
    }
  }
  
  // Skip
  if (isStreet) {
    required.push(PERMITS.skip);
  }
  
  // Hoarding for larger projects
  if (hasBasement || devLower.includes('new_build')) {
    required.push(PERMITS.hoarding);
  }
  
  // Crane for basement
  if (hasBasement) {
    required.push(PERMITS.crane);
  }
  
  // Parking always needed
  required.push(PERMITS.parking_suspension);
  
  const totalFees = required.reduce(
    (acc, p) => ({ min: acc.min + p.fees.min, max: acc.max + p.fees.max }),
    { min: 0, max: 0 }
  );
  
  return { permits: required, totalFees };
}

function getTrafficManagement(streetType: string, hasBasement: boolean) {
  let complexity: 'simple' | 'moderate' | 'complex' = 'simple';
  const requirements: string[] = [];
  
  if (streetType === 'main_road' || hasBasement) {
    complexity = 'complex';
    requirements.push('Full traffic management plan');
    requirements.push('Chapter 8 qualified operatives');
    requirements.push('Daily briefings and records');
  } else if (streetType === 'residential') {
    complexity = 'moderate';
    requirements.push('Delivery management plan');
    requirements.push('Banksman for reversing vehicles');
  } else {
    requirements.push('Basic site access management');
  }
  
  const considerations = [
    'School run times: 08:00-09:00, 15:00-16:00',
    'Market days',
    'Refuse collection days',
  ];
  
  return { complexity, requirements, considerations };
}

function getNeighbourProtocol(hasBasement: boolean) {
  const notifications = [
    { when: '4 weeks before', content: 'Introduction letter with contacts' },
    { when: '1 week before', content: 'Confirm start date and initial activities' },
    { when: 'Weekly', content: 'Schedule update and any disruption notices' },
  ];
  
  if (hasBasement) {
    notifications.push({
      when: '48 hours before noisy works',
      content: 'Piling, breaking, concrete pours - specific times',
    });
  }
  
  notifications.push({
    when: 'At completion',
    content: 'Thank you letter and contact for any issues',
  });
  
  return {
    notifications,
    contacts: [
      'Site manager mobile: 07:00-18:00',
      'Emergency contact for out-of-hours',
      'Weekly update email service',
    ],
    complaintProcess: [
      'Immediate response to safety concerns',
      'Acknowledge within 2 hours',
      'Investigate within 24 hours',
    ],
  };
}

function getConstructionPlan(hasBasement: boolean) {
  return {
    siteBoundary: [
      'Hoarding to perimeter',
      'Security gate with intercom',
      'Clear signage',
    ],
    access: [
      'Single point vehicle access',
      'Separate pedestrian access',
      'Banksman on duty',
      'Wheel washing facility',
    ],
    wasteManagement: [
      'Segregated waste skips',
      'Licensed waste carrier',
      'Waste transfer notes',
    ],
    dustControl: [
      'Water suppression',
      'Covered skips',
      'Regular sweeping',
    ],
    noiseControl: [
      'Best practicable means',
      'Quiet equipment selection',
      'No radios',
    ],
    workingHours: WORKING_HOURS,
    deliveryPhases: hasBasement
      ? ['Excavation', 'Structure', 'Main Build', 'Fit-out']
      : ['Main Build', 'Fit-out'],
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;
    
    if (action === 'permits') {
      const { developmentType, hasBasement, accessType } = body;
      const assessment = assessPermits(
        developmentType || 'extension',
        hasBasement || false,
        accessType || 'street'
      );
      
      return NextResponse.json({ success: true, ...assessment });
    }
    
    if (action === 'traffic') {
      const { streetType, hasBasement } = body;
      const traffic = getTrafficManagement(
        streetType || 'residential',
        hasBasement || false
      );
      
      return NextResponse.json({ success: true, trafficManagement: traffic });
    }
    
    if (action === 'neighbour-protocol') {
      const { hasBasement } = body;
      const protocol = getNeighbourProtocol(hasBasement || false);
      
      return NextResponse.json({ success: true, neighbourProtocol: protocol });
    }
    
    if (action === 'construction-plan') {
      const { hasBasement } = body;
      const plan = getConstructionPlan(hasBasement || false);
      
      return NextResponse.json({ success: true, constructionPlan: plan });
    }
    
    return NextResponse.json(
      { error: 'Invalid action. Use: permits, traffic, neighbour-protocol, construction-plan' },
      { status: 400 }
    );
    
  } catch (error) {
    console.error('Construction Logistics API error:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const permitType = searchParams.get('permit') as PermitType | null;
  
  if (permitType && PERMITS[permitType]) {
    return NextResponse.json({ permit: PERMITS[permitType] });
  }
  
  if (searchParams.get('hours') === 'true') {
    return NextResponse.json({ workingHours: WORKING_HOURS });
  }
  
  return NextResponse.json({
    service: 'Construction Logistics API',
    version: '1.0.0',
    description: 'Permits, traffic management, and construction planning',
    endpoints: {
      'GET /api/construction-logistics': 'Service info',
      'GET /api/construction-logistics?permit=scaffolding': 'Specific permit info',
      'GET /api/construction-logistics?hours=true': 'Working hours',
      'POST /api/construction-logistics (action: permits)': 'Assess permit requirements',
      'POST /api/construction-logistics (action: traffic)': 'Traffic management guidance',
      'POST /api/construction-logistics (action: neighbour-protocol)': 'Neighbour notification',
      'POST /api/construction-logistics (action: construction-plan)': 'Construction management plan',
    },
    permitTypes: Object.keys(PERMITS),
    camdenWorkingHours: WORKING_HOURS,
  });
}
