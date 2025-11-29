/**
 * Construction Logistics Service
 * Traffic management, scaffolding, skip permits, and construction planning
 */

// Types
export type PermitType = 'scaffolding' | 'skip' | 'hoarding' | 'crane' | 'road_closure' | 'parking_suspension';

export interface PermitRequirement {
  type: PermitType;
  required: boolean;
  authority: string;
  applicationProcess: string[];
  fees: { min: number; max: number; per?: string };
  leadTime: string;
  duration: string;
  conditions: string[];
}

export interface TrafficManagement {
  requiresPlan: boolean;
  complexity: 'simple' | 'moderate' | 'complex';
  requirements: string[];
  considerations: string[];
  estimatedCost: { min: number; max: number };
}

export interface DeliverySchedule {
  phase: string;
  deliveryTypes: string[];
  frequency: string;
  preferredTimes: string[];
  restrictions: string[];
}

export interface NeighbourProtocol {
  notifications: { when: string; method: string; content: string }[];
  contactArrangements: string[];
  complaintProcedure: string[];
  compensationConsiderations: string[];
}

export interface ConstructionManagementPlan {
  siteBoundary: string[];
  accessArrangements: string[];
  deliveryManagement: DeliverySchedule[];
  wasteManagement: string[];
  dustControl: string[];
  noiseControl: string[];
  workingHours: { standard: string; saturday: string; prohibited: string };
  emergencyProcedures: string[];
}

// Camden Council permit information
const PERMIT_INFO: Record<PermitType, Omit<PermitRequirement, 'required'>> = {
  scaffolding: {
    type: 'scaffolding',
    authority: 'Camden Council Highways',
    applicationProcess: [
      'Apply minimum 10 working days before erection',
      'Submit scaffold design and location plan',
      'Provide public liability insurance (£5m minimum)',
      'Agree pedestrian protection measures',
    ],
    fees: { min: 200, max: 800, per: 'per licence' },
    leadTime: '10 working days minimum',
    duration: 'Typically 3-6 months',
    conditions: [
      'Maintain minimum 2.4m height clearance',
      'Adequate lighting for pedestrians',
      'No obstruction to fire escape routes',
      'Regular safety inspections required',
    ],
  },
  skip: {
    type: 'skip',
    authority: 'Camden Council Highways',
    applicationProcess: [
      'Apply online via Camden website',
      'Specify location and duration',
      'Use approved skip contractor',
    ],
    fees: { min: 35, max: 85, per: 'per week' },
    leadTime: '3 working days',
    duration: '1-4 weeks typically',
    conditions: [
      'Reflective marking/lights required',
      'Not on double yellow lines without suspension',
      'Cover when containing dusty materials',
      'Remove promptly when full',
    ],
  },
  hoarding: {
    type: 'hoarding',
    authority: 'Camden Council Highways',
    applicationProcess: [
      'Submit hoarding design for approval',
      'Include pedestrian management plan',
      'Provide structural calculations if over 2m',
    ],
    fees: { min: 350, max: 1500, per: 'per licence' },
    leadTime: '15 working days',
    duration: 'Duration of works',
    conditions: [
      'Minimum 1.2m pedestrian walkway maintained',
      'Adequate lighting at all times',
      'Regular condition inspections',
      'Public art/decoration may be required',
    ],
  },
  crane: {
    type: 'crane',
    authority: 'Camden Council Highways + Planning',
    applicationProcess: [
      'Submit crane methodology',
      'Notify air traffic if in approach path',
      'Agree road closure times if needed',
      'Public notification requirements',
    ],
    fees: { min: 500, max: 3000, per: 'per operation' },
    leadTime: '20 working days',
    duration: 'Per lift operation',
    conditions: [
      'Weekend/early morning lifts preferred',
      'Banks-person required for road proximity',
      'Weather contingency planning',
      'No oversailing without consent',
    ],
  },
  road_closure: {
    type: 'road_closure',
    authority: 'Camden Council Highways',
    applicationProcess: [
      'Submit traffic management plan',
      'Minimum 3 months notice for major closures',
      'Public consultation may be required',
      'Diversion routes must be agreed',
    ],
    fees: { min: 1000, max: 5000, per: 'per closure' },
    leadTime: '3 months for major, 20 days for temporary',
    duration: 'As agreed',
    conditions: [
      'Emergency access must be maintained',
      'Local business consultation',
      'Signage as per TSRGD',
      'Staffing for traffic management',
    ],
  },
  parking_suspension: {
    type: 'parking_suspension',
    authority: 'Camden Council Parking',
    applicationProcess: [
      'Apply minimum 7 working days in advance',
      'Specify bays and duration required',
      'Pay fees in advance',
    ],
    fees: { min: 40, max: 80, per: 'per bay per day' },
    leadTime: '7 working days',
    duration: 'As required',
    conditions: [
      'No parking cones until suspension starts',
      'Bays must be for construction use only',
      'Refund for unused days possible',
    ],
  },
};

// Construction working hours (Camden)
const WORKING_HOURS = {
  standard: '08:00 - 18:00 Monday to Friday',
  saturday: '08:00 - 13:00',
  prohibited: 'Sundays, Bank Holidays, and outside standard hours',
  noisy_works: '09:00 - 17:00 weekdays only (for pile driving, demolition etc)',
};

export class ConstructionLogisticsService {
  /**
   * Assess permit requirements for a project
   */
  assessPermitRequirements(
    developmentType: string,
    propertyType: string,
    accessType: 'street' | 'mews' | 'private_road',
    hasBasement: boolean
  ): PermitRequirement[] {
    const permits: PermitRequirement[] = [];
    const devLower = developmentType.toLowerCase();
    const isLargeProject = hasBasement || devLower.includes('new_build');
    
    // Scaffolding - almost always needed
    if (devLower.includes('extension') || devLower.includes('loft') || devLower.includes('roof') || isLargeProject) {
      permits.push({
        ...PERMIT_INFO['scaffolding'],
        required: accessType === 'street' || accessType === 'mews',
      });
    }
    
    // Skip permit
    if (accessType === 'street' || accessType === 'mews') {
      permits.push({
        ...PERMIT_INFO['skip'],
        required: true,
      });
    }
    
    // Hoarding for larger projects
    if (isLargeProject) {
      permits.push({
        ...PERMIT_INFO['hoarding'],
        required: accessType === 'street',
      });
    }
    
    // Crane for basement/major works
    if (hasBasement) {
      permits.push({
        ...PERMIT_INFO['crane'],
        required: true, // For basement excavation equipment
      });
    }
    
    // Parking suspension
    permits.push({
      ...PERMIT_INFO['parking_suspension'],
      required: true, // Usually needed for deliveries
    });
    
    // Road closure for very large projects
    if (hasBasement && devLower.includes('large')) {
      permits.push({
        ...PERMIT_INFO['road_closure'],
        required: false, // May be needed
      });
    }
    
    return permits;
  }

  /**
   * Generate traffic management recommendations
   */
  generateTrafficManagement(
    streetType: 'main_road' | 'residential' | 'mews' | 'private',
    projectSize: 'small' | 'medium' | 'large',
    hasBasement: boolean
  ): TrafficManagement {
    let complexity: 'simple' | 'moderate' | 'complex' = 'simple';
    const requirements: string[] = [];
    const considerations: string[] = [];
    let cost = { min: 0, max: 500 };
    
    if (streetType === 'main_road' || hasBasement) {
      complexity = 'complex';
      requirements.push('Full traffic management plan required');
      requirements.push('Chapter 8 qualified operatives');
      requirements.push('Signed diversion routes if needed');
      requirements.push('Daily briefings and records');
      cost = { min: 2000, max: 10000 };
    } else if (streetType === 'residential' || projectSize === 'medium') {
      complexity = 'moderate';
      requirements.push('Delivery management plan');
      requirements.push('Banksman for reversing vehicles');
      requirements.push('Temporary signage during operations');
      cost = { min: 500, max: 2000 };
    } else {
      requirements.push('Basic site access management');
      requirements.push('Neighbour notification of deliveries');
    }
    
    // Common considerations
    considerations.push('School run times to be avoided (08:00-09:00, 15:00-16:00)');
    considerations.push('Market days if applicable');
    considerations.push('Refuse collection days');
    considerations.push('Local events and street closures');
    
    if (hasBasement) {
      considerations.push('Muck-away lorry frequency - typically 2-3 per day');
      considerations.push('Concrete pour days require continuous access');
    }
    
    return {
      requiresPlan: complexity !== 'simple',
      complexity,
      requirements,
      considerations,
      estimatedCost: cost,
    };
  }

  /**
   * Generate delivery schedule template
   */
  generateDeliverySchedule(
    developmentType: string,
    hasBasement: boolean
  ): DeliverySchedule[] {
    const schedules: DeliverySchedule[] = [];
    
    if (hasBasement) {
      schedules.push({
        phase: 'Excavation',
        deliveryTypes: ['Excavation equipment', 'Muck-away lorries', 'Support materials'],
        frequency: '2-3 muck-away trips per day',
        preferredTimes: ['07:30-09:00', '10:00-12:00', '14:00-16:00'],
        restrictions: ['Avoid school times', 'No HGVs before 08:00', 'Weight restrictions on local roads'],
      });
      
      schedules.push({
        phase: 'Concrete/Structure',
        deliveryTypes: ['Concrete mixer', 'Steel deliveries', 'Crane equipment'],
        frequency: 'As required - concrete pours are continuous',
        preferredTimes: ['Early morning for concrete (07:00 start if permitted)'],
        restrictions: ['Concrete cannot wait - continuous pour required', 'Pre-notify neighbours'],
      });
    }
    
    schedules.push({
      phase: 'Main Construction',
      deliveryTypes: ['Building materials', 'Windows/doors', 'Fixtures'],
      frequency: 'Daily to weekly depending on phase',
      preferredTimes: ['09:00-11:00', '14:00-16:00'],
      restrictions: ['Standard working hours', 'Coordinate with scaffold access'],
    });
    
    schedules.push({
      phase: 'Fit-out',
      deliveryTypes: ['Kitchen units', 'Bathroom fittings', 'Flooring'],
      frequency: '2-3 times per week',
      preferredTimes: ['Mid-morning preferred'],
      restrictions: ['Smaller vehicles may access mews/narrow streets'],
    });
    
    return schedules;
  }

  /**
   * Generate neighbour communication protocol
   */
  generateNeighbourProtocol(
    projectDuration: number, // months
    hasBasement: boolean
  ): NeighbourProtocol {
    const notifications = [
      {
        when: '4 weeks before start',
        method: 'Letter with site manager contact',
        content: 'Introduction, project overview, duration, working hours',
      },
      {
        when: '1 week before start',
        method: 'Door knock + letter',
        content: 'Confirm start date, key contacts, initial activities',
      },
      {
        when: 'Weekly during works',
        method: 'Email/WhatsApp group',
        content: 'Next week schedule, special activities, any disruption',
      },
    ];
    
    if (hasBasement) {
      notifications.push({
        when: 'Before noisy works',
        method: '48 hours written notice',
        content: 'Piling, breaking, concrete pours - specific dates and times',
      });
    }
    
    notifications.push({
      when: 'At completion',
      method: 'Letter + thank you gesture',
      content: 'Completion notice, any snagging access needs, contact for issues',
    });
    
    const contactArrangements = [
      'Site manager mobile available 07:00-18:00',
      'Emergency contact for out-of-hours',
      'Weekly update email service',
      'Complaint hotline displayed on hoarding',
    ];
    
    const complaintProcedure = [
      'Immediate response to safety concerns',
      'Acknowledge all complaints within 2 hours',
      'Investigate and respond within 24 hours',
      'Escalation to project manager if unresolved',
      'Record all complaints and resolutions',
    ];
    
    const compensationConsiderations = [
      'Deep cleaning offer at completion',
      'Flower/wine gesture for significant disruption',
      'Repair any damage caused promptly',
      'Consider temporary alternative arrangements if severe impact',
    ];
    
    return {
      notifications,
      contactArrangements,
      complaintProcedure,
      compensationConsiderations,
    };
  }

  /**
   * Generate construction management plan outline
   */
  generateConstructionManagementPlan(
    address: string,
    developmentType: string,
    hasBasement: boolean
  ): ConstructionManagementPlan {
    const siteBoundary = [
      'Hoarding to full site perimeter',
      'Security gate with intercom',
      'CCTV for site security',
      'Clear signage for site contact and emergency numbers',
    ];
    
    const accessArrangements = [
      'Single point of access for vehicles',
      'Separate pedestrian access maintained',
      'Banksman on duty for all vehicle movements',
      'Wheel washing facility to prevent mud on road',
    ];
    
    const wasteManagement = [
      'Segregated waste skips (general, recyclable, hazardous)',
      'Licensed waste carrier for all removals',
      'Waste transfer notes maintained',
      'Minimise waste through careful ordering',
    ];
    
    const dustControl = [
      'Water suppression during demolition/excavation',
      'Damping down in dry weather',
      'Covered skips for dusty materials',
      'Wheel washing to prevent road deposits',
      'Regular site sweeping',
    ];
    
    const noiseControl = [
      'Best practicable means to minimise noise',
      'Equipment selection - quietest suitable option',
      'Acoustic barriers around noisy equipment',
      'No radios or unnecessary noise',
      'Regular monitoring of noise levels',
    ];
    
    const emergencyProcedures = [
      'Fire assembly point identified',
      'First aider on site at all times',
      'Emergency contact list posted',
      'Gas/electric emergency numbers displayed',
      'Evacuation procedure established',
    ];
    
    return {
      siteBoundary,
      accessArrangements,
      deliveryManagement: this.generateDeliverySchedule(developmentType, hasBasement),
      wasteManagement,
      dustControl,
      noiseControl,
      workingHours: WORKING_HOURS,
      emergencyProcedures,
    };
  }

  /**
   * Get Camden Council working hours restrictions
   */
  getWorkingHoursRestrictions(): typeof WORKING_HOURS {
    return WORKING_HOURS;
  }

  /**
   * Estimate total permit costs
   */
  estimatePermitCosts(permits: PermitRequirement[]): {
    total: { min: number; max: number };
    breakdown: { type: string; cost: { min: number; max: number } }[];
  } {
    const breakdown = permits
      .filter(p => p.required)
      .map(p => ({
        type: p.type,
        cost: p.fees,
      }));
    
    const total = breakdown.reduce(
      (acc, item) => ({
        min: acc.min + item.cost.min,
        max: acc.max + item.cost.max,
      }),
      { min: 0, max: 0 }
    );
    
    return { total, breakdown };
  }
}

export const constructionLogisticsService = new ConstructionLogisticsService();
