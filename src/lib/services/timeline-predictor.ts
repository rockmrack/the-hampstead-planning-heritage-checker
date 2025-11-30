/**
 * Timeline Predictor Service
 * 
 * Predicts accurate planning application timelines based on
 * project type, location, heritage status, and historical data.
 */

// Types
interface TimelinePrediction {
  projectType: string;
  location: string;
  totalWeeks: number;
  confidence: number;
  phases: TimelinePhase[];
  milestones: Milestone[];
  risks: TimelineRisk[];
  tips: string[];
}

interface TimelinePhase {
  name: string;
  description: string;
  startWeek: number;
  endWeek: number;
  duration: number;
  status: 'not-started' | 'in-progress' | 'completed';
  dependencies: string[];
}

interface Milestone {
  name: string;
  week: number;
  description: string;
  isKeyDecision: boolean;
  action?: string;
}

interface TimelineRisk {
  risk: string;
  probability: 'low' | 'medium' | 'high';
  impact: number; // Additional weeks if occurs
  mitigation: string;
}

interface TimelineFactors {
  projectType: string;
  postcode: string;
  isConservationArea?: boolean;
  isListedBuilding?: boolean;
  hasArticle4?: boolean;
  projectSize?: 'small' | 'medium' | 'large';
  hasPreApp?: boolean;
  isFullPlanning?: boolean;
  needsTreeWork?: boolean;
  hasPartyWall?: boolean;
}

// Base timelines by project type (in weeks)
const BASE_TIMELINES = {
  'householder': {
    preparation: 4,
    validation: 1,
    consultation: 3,
    determination: 4,
    total: 8
  },
  'listed-building': {
    preparation: 6,
    validation: 2,
    consultation: 4,
    historicEngland: 3,
    determination: 5,
    total: 13
  },
  'full-planning': {
    preparation: 6,
    validation: 2,
    consultation: 3,
    determination: 5,
    total: 13
  },
  'basement': {
    preparation: 8,
    validation: 2,
    consultation: 4,
    determination: 6,
    total: 16
  },
  'prior-approval': {
    preparation: 2,
    validation: 1,
    determination: 6,
    total: 8
  }
} as Record<string, Record<string, number>>;

// Area multipliers based on council performance
const AREA_MULTIPLIERS = {
  'NW1': 1.1,  // Camden - slightly slower
  'NW3': 1.2,  // Hampstead - complex heritage
  'NW5': 1.0,  // Kentish Town - average
  'NW6': 1.0,  // Kilburn - average
  'NW8': 1.1,  // St John's Wood - heritage
  'NW11': 0.9, // Golders Green - faster
  'N2': 0.9,   // East Finchley - efficient
  'N6': 1.15,  // Highgate - heritage complex
  'N10': 0.85  // Muswell Hill - quickest
} as Record<string, number>;

// Historical processing data (mock - would come from actual data)
const HISTORICAL_DATA = {
  'NW3': {
    avgWeeks: 12.5,
    validationDays: 8,
    consultationExtensions: 0.3,
    committeeReferralRate: 0.15
  },
  'NW1': {
    avgWeeks: 11.2,
    validationDays: 7,
    consultationExtensions: 0.25,
    committeeReferralRate: 0.12
  },
  'default': {
    avgWeeks: 10,
    validationDays: 5,
    consultationExtensions: 0.2,
    committeeReferralRate: 0.1
  }
} as Record<string, {
  avgWeeks: number;
  validationDays: number;
  consultationExtensions: number;
  committeeReferralRate: number;
}>;

class TimelinePredictor {
  
  /**
   * Predict timeline for a planning application
   */
  predictTimeline(factors: TimelineFactors): TimelinePrediction {
    // Get base timeline
    const applicationType = this.getApplicationType(factors);
    const baseTimeline = BASE_TIMELINES[applicationType] || BASE_TIMELINES['householder'] || {};
    
    // Apply modifiers
    const modifier = this.calculateModifier(factors);
    
    // Build phases
    const phases = this.buildPhases(baseTimeline, modifier, factors);
    
    // Calculate total
    const totalWeeks = Math.round(phases.reduce((sum, p) => Math.max(sum, p.endWeek), 0));
    
    // Generate milestones
    const milestones = this.generateMilestones(phases, factors);
    
    // Identify risks
    const risks = this.identifyRisks(factors);
    
    // Generate tips
    const tips = this.generateTips(factors, phases);
    
    // Calculate confidence
    const confidence = this.calculateConfidence(factors);
    
    return {
      projectType: applicationType,
      location: factors.postcode,
      totalWeeks,
      confidence,
      phases,
      milestones,
      risks,
      tips
    };
  }
  
  /**
   * Get estimated completion date
   */
  getCompletionDate(factors: TimelineFactors, startDate: Date = new Date()): {
    estimated: Date;
    earliest: Date;
    latest: Date;
    workingDays: number;
  } {
    const prediction = this.predictTimeline(factors);
    
    const workingDays = prediction.totalWeeks * 5;
    const calendarDays = prediction.totalWeeks * 7;
    
    // Account for bank holidays (roughly 8 per year)
    const additionalDays = Math.ceil(prediction.totalWeeks / 52 * 8);
    
    const estimated = new Date(startDate);
    estimated.setDate(estimated.getDate() + calendarDays + additionalDays);
    
    const earliest = new Date(startDate);
    earliest.setDate(earliest.getDate() + Math.round(calendarDays * 0.8));
    
    const latest = new Date(startDate);
    const worstCase = prediction.risks.reduce((sum, r) => sum + (r.probability === 'high' ? r.impact : 0), 0);
    latest.setDate(latest.getDate() + calendarDays + additionalDays + (worstCase * 7));
    
    return { estimated, earliest, latest, workingDays };
  }
  
  /**
   * Get phase breakdown with dates
   */
  getPhaseSchedule(factors: TimelineFactors, startDate: Date = new Date()): Array<{
    phase: TimelinePhase;
    startDate: Date;
    endDate: Date;
    isCritical: boolean;
  }> {
    const prediction = this.predictTimeline(factors);
    
    return prediction.phases.map(phase => {
      const phaseStart = new Date(startDate);
      phaseStart.setDate(phaseStart.getDate() + (phase.startWeek * 7));
      
      const phaseEnd = new Date(startDate);
      phaseEnd.setDate(phaseEnd.getDate() + (phase.endWeek * 7));
      
      const isCritical = phase.name.includes('Validation') || 
                        phase.name.includes('Determination') ||
                        phase.name.includes('Historic England');
      
      return {
        phase,
        startDate: phaseStart,
        endDate: phaseEnd,
        isCritical
      };
    });
  }
  
  /**
   * Compare timelines for different scenarios
   */
  compareScenarios(baseFactors: TimelineFactors, scenarios: Array<{
    name: string;
    changes: Partial<TimelineFactors>;
  }>): Array<{
    scenario: string;
    totalWeeks: number;
    difference: number;
    recommendation: string;
  }> {
    const basePrediction = this.predictTimeline(baseFactors);
    
    const results = scenarios.map(scenario => {
      const modifiedFactors = { ...baseFactors, ...scenario.changes };
      const prediction = this.predictTimeline(modifiedFactors);
      const difference = prediction.totalWeeks - basePrediction.totalWeeks;
      
      let recommendation = '';
      if (difference < -2) {
        recommendation = 'Significantly faster - recommended approach';
      } else if (difference < 0) {
        recommendation = 'Slightly faster option';
      } else if (difference === 0) {
        recommendation = 'No timeline impact';
      } else if (difference <= 2) {
        recommendation = 'Minor delay expected';
      } else {
        recommendation = 'Significant delay - consider alternatives';
      }
      
      return {
        scenario: scenario.name,
        totalWeeks: prediction.totalWeeks,
        difference,
        recommendation
      };
    });
    
    return [
      { scenario: 'Base case', totalWeeks: basePrediction.totalWeeks, difference: 0, recommendation: 'Current plan' },
      ...results
    ];
  }
  
  // Private methods
  
  private getApplicationType(factors: TimelineFactors): string {
    if (factors.isListedBuilding) return 'listed-building';
    if (factors.isFullPlanning) return 'full-planning';
    if (factors.projectType === 'basement') return 'basement';
    if (!factors.isConservationArea && !factors.hasArticle4) return 'prior-approval';
    return 'householder';
  }
  
  private calculateModifier(factors: TimelineFactors): number {
    let modifier = 1.0;
    
    // Area modifier
    const prefix = factors.postcode.split(' ')[0] || factors.postcode.substring(0, 3);
    modifier *= AREA_MULTIPLIERS[prefix] || 1.0;
    
    // Heritage modifiers
    if (factors.isConservationArea) modifier *= 1.1;
    if (factors.hasArticle4) modifier *= 1.05;
    
    // Size modifier
    if (factors.projectSize === 'large') modifier *= 1.15;
    if (factors.projectSize === 'small') modifier *= 0.9;
    
    // Pre-app benefit
    if (factors.hasPreApp) modifier *= 0.9;
    
    // Additional requirements
    if (factors.needsTreeWork) modifier *= 1.05;
    if (factors.hasPartyWall) modifier *= 1.0; // Parallel process usually
    
    return modifier;
  }
  
  private buildPhases(
    baseTimeline: Record<string, number>,
    modifier: number,
    factors: TimelineFactors
  ): TimelinePhase[] {
    const phases: TimelinePhase[] = [];
    let currentWeek = 0;
    
    // Preparation phase
    const prepWeeks = Math.round((baseTimeline['preparation'] ?? 4) * modifier);
    phases.push({
      name: 'Preparation & Design',
      description: 'Architectural drawings, surveys, and documentation',
      startWeek: currentWeek,
      endWeek: currentWeek + prepWeeks,
      duration: prepWeeks,
      status: 'not-started',
      dependencies: []
    });
    currentWeek += prepWeeks;
    
    // Validation phase
    const valWeeks = Math.round((baseTimeline['validation'] ?? 2) * modifier);
    phases.push({
      name: 'Validation',
      description: 'Council checks application completeness',
      startWeek: currentWeek,
      endWeek: currentWeek + valWeeks,
      duration: valWeeks,
      status: 'not-started',
      dependencies: ['Preparation & Design']
    });
    currentWeek += valWeeks;
    
    // Consultation phase
    if (baseTimeline['consultation']) {
      const consultWeeks = Math.round(baseTimeline['consultation'] * modifier);
      phases.push({
        name: 'Consultation Period',
        description: 'Neighbor notification and public comments',
        startWeek: currentWeek,
        endWeek: currentWeek + consultWeeks,
        duration: consultWeeks,
        status: 'not-started',
        dependencies: ['Validation']
      });
      currentWeek += consultWeeks;
    }
    
    // Historic England consultation (if listed)
    if (factors.isListedBuilding && baseTimeline['historicEngland']) {
      const heWeeks = Math.round(baseTimeline['historicEngland'] * modifier);
      phases.push({
        name: 'Historic England Consultation',
        description: 'Statutory consultation for listed building works',
        startWeek: currentWeek - 2, // Overlaps with consultation
        endWeek: currentWeek + heWeeks - 2,
        duration: heWeeks,
        status: 'not-started',
        dependencies: ['Validation']
      });
    }
    
    // Determination phase
    const detWeeks = Math.round((baseTimeline['determination'] ?? 8) * modifier);
    phases.push({
      name: 'Determination',
      description: 'Planning officer assessment and decision',
      startWeek: currentWeek,
      endWeek: currentWeek + detWeeks,
      duration: detWeeks,
      status: 'not-started',
      dependencies: ['Consultation Period']
    });
    
    return phases;
  }
  
  private generateMilestones(phases: TimelinePhase[], factors: TimelineFactors): Milestone[] {
    const milestones: Milestone[] = [];
    
    // Submission milestone
    milestones.push({
      name: 'Application Submission',
      week: phases[0]?.endWeek ?? 0,
      description: 'Submit complete application to council',
      isKeyDecision: true,
      action: 'Ensure all documents are ready'
    });
    
    // Validation milestone
    milestones.push({
      name: 'Application Validated',
      week: phases[1]?.endWeek ?? 0,
      description: 'Council confirms application is complete',
      isKeyDecision: false,
      action: 'Respond quickly to any requests for information'
    });
    
    // Consultation end
    const consultPhase = phases.find(p => p.name.includes('Consultation Period'));
    if (consultPhase) {
      milestones.push({
        name: 'Consultation Closes',
        week: consultPhase.endWeek,
        description: 'Deadline for neighbor comments',
        isKeyDecision: false
      });
    }
    
    // Officer report
    const detPhase = phases.find(p => p.name.includes('Determination'));
    if (detPhase) {
      milestones.push({
        name: 'Officer Report Expected',
        week: detPhase.startWeek + Math.round(detPhase.duration * 0.7),
        description: 'Planning officer prepares recommendation',
        isKeyDecision: false
      });
      
      milestones.push({
        name: 'Decision Due',
        week: detPhase.endWeek,
        description: 'Statutory deadline for decision',
        isKeyDecision: true,
        action: 'Chase council if no update'
      });
    }
    
    return milestones.sort((a, b) => a.week - b.week);
  }
  
  private identifyRisks(factors: TimelineFactors): TimelineRisk[] {
    const risks: TimelineRisk[] = [];
    
    // Validation delay risk
    risks.push({
      risk: 'Validation delays due to missing information',
      probability: factors.hasPreApp ? 'low' : 'medium',
      impact: 2,
      mitigation: 'Use application checklist and get pre-app advice'
    });
    
    // Neighbor objection risk
    if (factors.projectType === 'basement' || factors.projectSize === 'large') {
      risks.push({
        risk: 'Significant neighbor objections',
        probability: 'high',
        impact: 3,
        mitigation: 'Early neighbor engagement and considerate design'
      });
    } else {
      risks.push({
        risk: 'Neighbor objections',
        probability: 'medium',
        impact: 2,
        mitigation: 'Notify neighbors early and address concerns'
      });
    }
    
    // Committee referral risk
    if (factors.isConservationArea || factors.isListedBuilding) {
      risks.push({
        risk: 'Committee referral instead of delegated decision',
        probability: factors.isListedBuilding ? 'high' : 'medium',
        impact: 4,
        mitigation: 'Strong design justification and heritage statement'
      });
    }
    
    // Amendment request risk
    risks.push({
      risk: 'Officer requests design amendments',
      probability: factors.hasPreApp ? 'low' : 'high',
      impact: 3,
      mitigation: 'Follow pre-app advice and local design guidance'
    });
    
    // Historic England risk
    if (factors.isListedBuilding) {
      risks.push({
        risk: 'Historic England objects to proposal',
        probability: 'medium',
        impact: 6,
        mitigation: 'Engage conservation architect and prepare detailed justification'
      });
    }
    
    // Tree risk
    if (factors.needsTreeWork) {
      risks.push({
        risk: 'Tree officer objection',
        probability: 'medium',
        impact: 2,
        mitigation: 'Commission arboricultural report early'
      });
    }
    
    return risks;
  }
  
  private generateTips(factors: TimelineFactors, phases: TimelinePhase[]): string[] {
    const tips: string[] = [];
    
    if (!factors.hasPreApp) {
      tips.push('Get pre-application advice to reduce validation delays and identify issues early');
    }
    
    if (factors.isConservationArea) {
      tips.push('Review the Conservation Area Character Appraisal before submitting');
      tips.push('Use traditional materials and sympathetic design to speed up approval');
    }
    
    if (factors.isListedBuilding) {
      tips.push('Engage a conservation architect experienced with listed buildings');
      tips.push('Prepare a detailed heritage statement explaining your approach');
    }
    
    tips.push('Submit a complete application - missing info causes weeks of delay');
    tips.push('Respond to officer queries within 24-48 hours');
    
    if (factors.projectType === 'basement') {
      tips.push('Early neighbor notification can prevent formal objections');
      tips.push('Have your construction management plan ready at submission');
    }
    
    // Season tip
    const currentMonth = new Date().getMonth();
    if (currentMonth === 11 || currentMonth === 0) {
      tips.push('Consider December/January submissions may face holiday delays');
    }
    if (currentMonth >= 6 && currentMonth <= 8) {
      tips.push('Summer submissions may face reduced officer availability');
    }
    
    return tips.slice(0, 5);
  }
  
  private calculateConfidence(factors: TimelineFactors): number {
    let confidence = 0.85; // Base confidence
    
    // Pre-app increases confidence
    if (factors.hasPreApp) confidence += 0.05;
    
    // Complexity reduces confidence
    if (factors.isListedBuilding) confidence -= 0.1;
    if (factors.isConservationArea) confidence -= 0.05;
    if (factors.projectType === 'basement') confidence -= 0.05;
    if (factors.projectSize === 'large') confidence -= 0.05;
    
    // Known areas increase confidence
    const prefix = factors.postcode.split(' ')[0] ?? '';
    if (prefix && HISTORICAL_DATA[prefix]) confidence += 0.05;
    
    return Math.max(0.5, Math.min(0.95, confidence));
  }
}

export const timelinePredictor = new TimelinePredictor();

export type {
  TimelinePrediction,
  TimelinePhase,
  Milestone,
  TimelineRisk,
  TimelineFactors
};
