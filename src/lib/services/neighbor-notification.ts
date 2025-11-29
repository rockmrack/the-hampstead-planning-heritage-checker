/**
 * Neighbor Notification System Service
 * Help homeowners proactively notify and engage neighbors about planned works
 */

export interface Neighbor {
  id: string;
  address: string;
  distance: number; // meters from subject property
  position: 'immediate-left' | 'immediate-right' | 'rear' | 'opposite' | 'nearby';
  affectedBy: AffectType[];
  notificationRequired: boolean;
  partyWallRequired: boolean;
}

export type AffectType = 
  | 'party-wall'
  | 'light-impact'
  | 'noise-during-works'
  | 'access-required'
  | 'scaffolding'
  | 'crane-oversail'
  | 'view-impact'
  | 'privacy-impact'
  | 'parking-impact'
  | 'structural-monitoring';

export interface NotificationTemplate {
  type: 'initial-letter' | 'party-wall-notice' | 'pre-start' | 'during-works' | 'completion';
  subject: string;
  body: string;
  attachments: string[];
  timing: string;
  legalRequirement: boolean;
}

export interface PartyWallRequirement {
  required: boolean;
  type: 'line-of-junction' | 'party-structure' | 'adjacent-excavation' | 'none';
  noticeRequired: boolean;
  surveyor: {
    estimated: boolean;
    agreedSurveyor: boolean;
    separateSurveyors: boolean;
    cost: { low: number; high: number };
  };
}

export interface NotificationPlan {
  subjectAddress: string;
  projectType: string;
  neighbors: Neighbor[];
  partyWall: PartyWallRequirement;
  notifications: {
    neighbor: Neighbor;
    templates: NotificationTemplate[];
    timeline: { date: string; action: string }[];
  }[];
  totalCost: { low: number; high: number };
  timeline: NotificationTimeline;
  tips: string[];
}

export interface NotificationTimeline {
  idealStart: string;
  latestStart: string;
  phases: {
    phase: string;
    start: string;
    duration: string;
    actions: string[];
  }[];
}

// ===========================================
// NOTIFICATION TEMPLATES
// ===========================================

const TEMPLATES: Record<string, NotificationTemplate> = {
  'friendly-intro': {
    type: 'initial-letter',
    subject: 'Planned Building Works at [ADDRESS]',
    body: `Dear Neighbour,

I am writing to let you know that we are planning to [PROJECT_TYPE] at [ADDRESS].

We wanted to give you advance notice so you are aware of our plans and have the opportunity to discuss them with us if you have any questions or concerns.

Key details:
• Type of work: [PROJECT_DESCRIPTION]
• Anticipated start date: [START_DATE]
• Expected duration: [DURATION]
• Working hours: 8am-6pm Monday-Friday, 8am-1pm Saturday

We are committed to minimising disruption to you and your property. If you would like to discuss our plans or see the approved drawings, please don't hesitate to contact us.

Best regards,
[OWNER_NAME]
[PHONE]
[EMAIL]`,
    attachments: ['Approved plans (optional)', 'Contact card'],
    timing: '4-6 weeks before works start',
    legalRequirement: false,
  },
  'party-wall-notice-structure': {
    type: 'party-wall-notice',
    subject: 'Party Wall etc. Act 1996 - Notice of Adjacent Building Works',
    body: `PARTY STRUCTURE NOTICE
(Party Wall etc. Act 1996, Section 3)

To: The Owner(s) of [NEIGHBOR_ADDRESS]
From: [OWNER_NAME], Owner of [ADDRESS]

I/We give you notice under the above Act of my/our intention to:

[DESCRIPTION_OF_WORKS]

These works will commence on or after [START_DATE] (being not less than two months from the date of this notice).

Please respond within 14 days of receiving this notice to indicate whether you:
a) Consent to the works, OR
b) Dissent from the works (in which case surveyors will need to be appointed)

If no response is received within 14 days, a dispute is deemed to have arisen under the Act.

Signed: _______________________
Date: [DATE]

[OWNER_NAME]
[ADDRESS]`,
    attachments: ['Plans and drawings', 'Schedule of condition (if available)'],
    timing: 'Minimum 2 months before works',
    legalRequirement: true,
  },
  'party-wall-notice-excavation': {
    type: 'party-wall-notice',
    subject: 'Party Wall etc. Act 1996 - Notice of Excavation Works',
    body: `NOTICE OF ADJACENT EXCAVATION
(Party Wall etc. Act 1996, Section 6)

To: The Owner(s) of [NEIGHBOR_ADDRESS]
From: [OWNER_NAME], Owner of [ADDRESS]

I/We give you notice under the above Act of my/our intention to excavate:

[DESCRIPTION_OF_EXCAVATION]

The excavation will be within [DISTANCE]m of your property and will go below the bottom of your foundations.

These works will commence on or after [START_DATE] (being not less than one month from the date of this notice).

Please respond within 14 days of receiving this notice.

Signed: _______________________
Date: [DATE]`,
    attachments: ['Structural drawings', 'Foundation details'],
    timing: 'Minimum 1 month before works',
    legalRequirement: true,
  },
  'pre-start-courtesy': {
    type: 'pre-start',
    subject: 'Building Works Starting at [ADDRESS]',
    body: `Dear Neighbour,

This is a courtesy note to let you know that building works at [ADDRESS] will be starting on [START_DATE].

Contractor details:
• Company: [CONTRACTOR_NAME]
• Site Manager: [SITE_MANAGER]
• Contact: [CONTRACTOR_PHONE]

Working hours:
• Monday-Friday: 8am-6pm
• Saturday: 8am-1pm
• No work on Sundays or Bank Holidays

What to expect:
• [WEEK_1_ACTIVITIES]
• Deliveries will typically arrive [DELIVERY_TIMES]
• [PARKING_ARRANGEMENTS]

If you experience any issues or have concerns at any time, please contact us or the site manager directly.

Thank you for your patience and understanding.

Best regards,
[OWNER_NAME]`,
    attachments: ['Contractor contact card', 'Complaints procedure'],
    timing: '1 week before works start',
    legalRequirement: false,
  },
  'during-works-update': {
    type: 'during-works',
    subject: 'Building Works Update - [ADDRESS]',
    body: `Dear Neighbour,

I wanted to give you an update on the building works at [ADDRESS].

Progress so far:
• [COMPLETED_WORK]

Coming up:
• [UPCOMING_WORK]

We are currently [ON_TRACK/SLIGHTLY_DELAYED]. Expected completion remains [COMPLETION_DATE].

If you have any concerns or would like to visit the site, please let us know.

Best regards,
[OWNER_NAME]`,
    attachments: [],
    timing: 'Every 4-6 weeks during works',
    legalRequirement: false,
  },
  'completion-notice': {
    type: 'completion',
    subject: 'Building Works Completed at [ADDRESS]',
    body: `Dear Neighbour,

I am pleased to let you know that the building works at [ADDRESS] are now complete.

Thank you for your patience and understanding during the construction period.

If you notice any issues that may have been caused by the works (e.g., any cracks or damage to your property), please let us know immediately so we can investigate.

We will be conducting a final site clearance on [CLEARANCE_DATE].

Best regards,
[OWNER_NAME]`,
    attachments: ['Schedule of condition (if applicable)'],
    timing: 'Within 1 week of completion',
    legalRequirement: false,
  },
};

// ===========================================
// NEIGHBOR NOTIFICATION SERVICE
// ===========================================

class NeighborNotificationService {
  /**
   * Generate a complete notification plan for a project
   */
  generateNotificationPlan(
    address: string,
    projectType: string,
    projectDescription: string,
    startDate: Date,
    duration: string
  ): NotificationPlan {
    // Simulate neighbors based on project type
    const neighbors = this.identifyNeighbors(projectType);
    const partyWall = this.assessPartyWallRequirements(projectType);
    
    const notifications = neighbors.map(neighbor => ({
      neighbor,
      templates: this.getTemplatesForNeighbor(neighbor, partyWall),
      timeline: this.getTimelineForNeighbor(neighbor, startDate, partyWall),
    }));
    
    return {
      subjectAddress: address,
      projectType,
      neighbors,
      partyWall,
      notifications,
      totalCost: this.estimateCosts(partyWall, neighbors),
      timeline: this.generateOverallTimeline(startDate, partyWall),
      tips: this.generateTips(projectType, partyWall),
    };
  }

  /**
   * Identify affected neighbors based on project type
   */
  private identifyNeighbors(projectType: string): Neighbor[] {
    const baseNeighbors: Neighbor[] = [
      {
        id: 'neighbor-left',
        address: 'Property to the left',
        distance: 0,
        position: 'immediate-left',
        affectedBy: ['party-wall', 'noise-during-works', 'scaffolding'],
        notificationRequired: true,
        partyWallRequired: false,
      },
      {
        id: 'neighbor-right',
        address: 'Property to the right',
        distance: 0,
        position: 'immediate-right',
        affectedBy: ['party-wall', 'noise-during-works', 'scaffolding'],
        notificationRequired: true,
        partyWallRequired: false,
      },
      {
        id: 'neighbor-rear',
        address: 'Property to the rear',
        distance: 15,
        position: 'rear',
        affectedBy: ['noise-during-works', 'view-impact', 'privacy-impact'],
        notificationRequired: true,
        partyWallRequired: false,
      },
    ];
    
    // Adjust based on project type
    if (projectType === 'basement') {
      baseNeighbors[0].affectedBy.push('structural-monitoring', 'access-required');
      baseNeighbors[0].partyWallRequired = true;
      baseNeighbors[1].affectedBy.push('structural-monitoring', 'access-required');
      baseNeighbors[1].partyWallRequired = true;
      baseNeighbors[2].affectedBy.push('access-required');
    }
    
    if (['rear-extension-single', 'rear-extension-double', 'wrap-around'].includes(projectType)) {
      baseNeighbors[0].partyWallRequired = true;
      baseNeighbors[1].partyWallRequired = true;
      baseNeighbors[2].affectedBy.push('light-impact');
    }
    
    if (projectType === 'loft-conversion') {
      baseNeighbors[0].partyWallRequired = true;
      baseNeighbors[1].partyWallRequired = true;
      baseNeighbors.push({
        id: 'neighbor-opposite',
        address: 'Property opposite',
        distance: 20,
        position: 'opposite',
        affectedBy: ['crane-oversail', 'parking-impact'],
        notificationRequired: true,
        partyWallRequired: false,
      });
    }
    
    return baseNeighbors;
  }

  /**
   * Assess party wall requirements
   */
  private assessPartyWallRequirements(projectType: string): PartyWallRequirement {
    const requirements: Record<string, PartyWallRequirement> = {
      'rear-extension-single': {
        required: true,
        type: 'line-of-junction',
        noticeRequired: true,
        surveyor: {
          estimated: true,
          agreedSurveyor: true,
          separateSurveyors: false,
          cost: { low: 800, high: 1500 },
        },
      },
      'rear-extension-double': {
        required: true,
        type: 'line-of-junction',
        noticeRequired: true,
        surveyor: {
          estimated: true,
          agreedSurveyor: true,
          separateSurveyors: false,
          cost: { low: 1200, high: 2500 },
        },
      },
      'loft-conversion': {
        required: true,
        type: 'party-structure',
        noticeRequired: true,
        surveyor: {
          estimated: true,
          agreedSurveyor: true,
          separateSurveyors: false,
          cost: { low: 800, high: 1500 },
        },
      },
      'basement': {
        required: true,
        type: 'adjacent-excavation',
        noticeRequired: true,
        surveyor: {
          estimated: true,
          agreedSurveyor: false,
          separateSurveyors: true,
          cost: { low: 3000, high: 6000 },
        },
      },
      'side-return': {
        required: true,
        type: 'line-of-junction',
        noticeRequired: true,
        surveyor: {
          estimated: true,
          agreedSurveyor: true,
          separateSurveyors: false,
          cost: { low: 600, high: 1200 },
        },
      },
      'garden-room': {
        required: false,
        type: 'none',
        noticeRequired: false,
        surveyor: {
          estimated: false,
          agreedSurveyor: false,
          separateSurveyors: false,
          cost: { low: 0, high: 0 },
        },
      },
      'wrap-around': {
        required: true,
        type: 'line-of-junction',
        noticeRequired: true,
        surveyor: {
          estimated: true,
          agreedSurveyor: true,
          separateSurveyors: false,
          cost: { low: 1500, high: 3000 },
        },
      },
    };
    
    return requirements[projectType] || {
      required: false,
      type: 'none',
      noticeRequired: false,
      surveyor: {
        estimated: false,
        agreedSurveyor: false,
        separateSurveyors: false,
        cost: { low: 0, high: 0 },
      },
    };
  }

  /**
   * Get templates for a specific neighbor
   */
  private getTemplatesForNeighbor(neighbor: Neighbor, partyWall: PartyWallRequirement): NotificationTemplate[] {
    const templates: NotificationTemplate[] = [
      TEMPLATES['friendly-intro'],
      TEMPLATES['pre-start-courtesy'],
    ];
    
    if (neighbor.partyWallRequired && partyWall.required) {
      if (partyWall.type === 'adjacent-excavation') {
        templates.unshift(TEMPLATES['party-wall-notice-excavation']);
      } else {
        templates.unshift(TEMPLATES['party-wall-notice-structure']);
      }
    }
    
    templates.push(TEMPLATES['during-works-update']);
    templates.push(TEMPLATES['completion-notice']);
    
    return templates;
  }

  /**
   * Get timeline for a specific neighbor
   */
  private getTimelineForNeighbor(
    neighbor: Neighbor,
    startDate: Date,
    partyWall: PartyWallRequirement
  ): { date: string; action: string }[] {
    const timeline: { date: string; action: string }[] = [];
    
    if (neighbor.partyWallRequired && partyWall.required) {
      const partyWallNoticeDate = new Date(startDate);
      partyWallNoticeDate.setDate(partyWallNoticeDate.getDate() - 70); // 10 weeks before
      timeline.push({
        date: partyWallNoticeDate.toISOString().split('T')[0],
        action: 'Serve party wall notice',
      });
      
      const responseDeadline = new Date(partyWallNoticeDate);
      responseDeadline.setDate(responseDeadline.getDate() + 14);
      timeline.push({
        date: responseDeadline.toISOString().split('T')[0],
        action: 'Response deadline (14 days)',
      });
    }
    
    const introLetterDate = new Date(startDate);
    introLetterDate.setDate(introLetterDate.getDate() - 42); // 6 weeks before
    timeline.push({
      date: introLetterDate.toISOString().split('T')[0],
      action: 'Send friendly introduction letter',
    });
    
    const preStartDate = new Date(startDate);
    preStartDate.setDate(preStartDate.getDate() - 7); // 1 week before
    timeline.push({
      date: preStartDate.toISOString().split('T')[0],
      action: 'Send pre-start notification',
    });
    
    return timeline.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  /**
   * Estimate total costs
   */
  private estimateCosts(partyWall: PartyWallRequirement, neighbors: Neighbor[]): { low: number; high: number } {
    let low = 0;
    let high = 0;
    
    const partyWallNeighbors = neighbors.filter(n => n.partyWallRequired);
    
    if (partyWall.required && partyWallNeighbors.length > 0) {
      // Per-neighbor surveyor costs if separate surveyors needed
      if (partyWall.surveyor.separateSurveyors) {
        low += partyWall.surveyor.cost.low * partyWallNeighbors.length;
        high += partyWall.surveyor.cost.high * partyWallNeighbors.length;
      } else {
        low += partyWall.surveyor.cost.low;
        high += partyWall.surveyor.cost.high;
      }
    }
    
    // Add schedule of condition costs
    low += partyWallNeighbors.length * 300;
    high += partyWallNeighbors.length * 500;
    
    // Minor costs for printing/postage
    low += 50;
    high += 100;
    
    return { low, high };
  }

  /**
   * Generate overall timeline
   */
  private generateOverallTimeline(startDate: Date, partyWall: PartyWallRequirement): NotificationTimeline {
    const idealStart = new Date(startDate);
    idealStart.setDate(idealStart.getDate() - (partyWall.required ? 84 : 42)); // 12 or 6 weeks
    
    const latestStart = new Date(startDate);
    latestStart.setDate(latestStart.getDate() - (partyWall.required ? 63 : 14)); // 9 weeks or 2 weeks
    
    const phases = [];
    
    if (partyWall.required) {
      phases.push({
        phase: 'Party Wall Process',
        start: idealStart.toISOString().split('T')[0],
        duration: '6-8 weeks',
        actions: [
          'Appoint party wall surveyor',
          'Serve party wall notices',
          'Await responses (14 days)',
          'Negotiate and agree award',
          'Schedule of condition survey',
        ],
      });
    }
    
    const neighborOutreach = new Date(startDate);
    neighborOutreach.setDate(neighborOutreach.getDate() - 42);
    phases.push({
      phase: 'Neighbor Outreach',
      start: neighborOutreach.toISOString().split('T')[0],
      duration: '2 weeks',
      actions: [
        'Send introduction letters',
        'Offer to meet and discuss plans',
        'Address any concerns',
        'Share contractor details',
      ],
    });
    
    const preStart = new Date(startDate);
    preStart.setDate(preStart.getDate() - 7);
    phases.push({
      phase: 'Pre-Start Communications',
      start: preStart.toISOString().split('T')[0],
      duration: '1 week',
      actions: [
        'Final notification to all neighbors',
        'Contractor introduction',
        'Share contact details and working hours',
      ],
    });
    
    return {
      idealStart: idealStart.toISOString().split('T')[0],
      latestStart: latestStart.toISOString().split('T')[0],
      phases,
    };
  }

  /**
   * Generate helpful tips
   */
  private generateTips(projectType: string, partyWall: PartyWallRequirement): string[] {
    const tips: string[] = [
      'Personal contact is always better than just letters - knock on doors and introduce yourself',
      'Share your contact details and encourage neighbors to reach out with any concerns',
      'Consider hosting a small "show and tell" with your plans before works start',
      'Keep records of all communications in case of disputes later',
    ];
    
    if (partyWall.required) {
      tips.push('Party wall surveyors can often act as "agreed surveyors" for both parties, saving money');
      tips.push('Always get a schedule of condition done before works start to protect yourself');
      tips.push('Party wall notices should be served by recorded delivery for proof of receipt');
    }
    
    if (projectType === 'basement') {
      tips.push('Basement works often require access to neighboring properties for monitoring - discuss early');
      tips.push('Consider offering to cover neighbors\' surveyor fees as a goodwill gesture');
      tips.push('Weekly or fortnightly updates are essential for long projects');
    }
    
    if (projectType === 'loft-conversion') {
      tips.push('Discuss scaffolding placement with neighbors whose access may be affected');
      tips.push('If cranes are needed, notify all neighbors who may have vehicles oversailed');
    }
    
    tips.push('A small gift (wine, flowers, chocolates) at the end of works goes a long way');
    
    return tips;
  }

  /**
   * Get a specific template
   */
  getTemplate(templateKey: string): NotificationTemplate | undefined {
    return TEMPLATES[templateKey];
  }

  /**
   * Fill in a template with actual values
   */
  fillTemplate(template: NotificationTemplate, values: Record<string, string>): NotificationTemplate {
    let body = template.body;
    let subject = template.subject;
    
    for (const [key, value] of Object.entries(values)) {
      const placeholder = `[${key.toUpperCase().replace(/_/g, '_')}]`;
      body = body.replace(new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), value);
      subject = subject.replace(new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), value);
    }
    
    return {
      ...template,
      subject,
      body,
    };
  }
}

// Export singleton
export const neighborNotificationService = new NeighborNotificationService();
