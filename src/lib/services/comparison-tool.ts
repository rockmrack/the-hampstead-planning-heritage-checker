/**
 * Comparison Tool Service
 * 
 * Compare properties, areas, and project outcomes side-by-side
 * to make informed planning decisions.
 */

// Types
interface PropertyComparison {
  address: string;
  postcode: string;
  conservationArea: boolean;
  conservationAreaName?: string;
  listedBuilding: boolean;
  listingGrade?: string;
  article4: boolean;
  treePreservation: boolean;
  approvalRate: number;
  avgProcessingTime: number;
  recentApplications: number;
  successfulProjects: string[];
}

interface AreaComparison {
  area: string;
  postcode: string;
  totalProperties: number;
  listedBuildings: number;
  conservationAreas: number;
  approvalRate: number;
  avgProcessingWeeks: number;
  dominantProjectTypes: string[];
  avgCostPerSqm: number;
  propertyPriceGrowth: number;
  planningDifficulty: 'low' | 'medium' | 'high' | 'very-high';
}

interface ProjectComparison {
  projectType: string;
  location: string;
  estimatedCost: number;
  approvalLikelihood: number;
  processingTime: number;
  requirements: string[];
  risks: string[];
  benefits: string[];
}

interface ComparisonResult<T> {
  items: T[];
  analysis: {
    bestOption: string;
    recommendation: string;
    factors: ComparisonFactor[];
    tradeoffs: string[];
  };
  metrics: {
    name: string;
    values: number[];
    winner: number;
    importance: 'high' | 'medium' | 'low';
  }[];
}

interface ComparisonFactor {
  factor: string;
  weight: number;
  scores: number[];
  description: string;
}

// Planning difficulty thresholds
const DIFFICULTY_THRESHOLDS = {
  approvalRate: { high: 0.75, medium: 0.6, low: 0.45 },
  processingTime: { low: 8, medium: 12, high: 16 },
  heritageConstraints: { low: 1, medium: 2, high: 3 }
};

// Project type characteristics
const PROJECT_CHARACTERISTICS = {
  'rear-extension': {
    avgCostPerSqm: 2500,
    avgProcessingWeeks: 9,
    heritageImpact: 'medium',
    neighborImpact: 'medium'
  },
  'side-extension': {
    avgCostPerSqm: 2800,
    avgProcessingWeeks: 10,
    heritageImpact: 'high',
    neighborImpact: 'high'
  },
  'loft-conversion': {
    avgCostPerSqm: 2200,
    avgProcessingWeeks: 10,
    heritageImpact: 'high',
    neighborImpact: 'low'
  },
  'basement': {
    avgCostPerSqm: 5500,
    avgProcessingWeeks: 14,
    heritageImpact: 'medium',
    neighborImpact: 'very-high'
  },
  'new-build': {
    avgCostPerSqm: 3500,
    avgProcessingWeeks: 16,
    heritageImpact: 'very-high',
    neighborImpact: 'high'
  }
} as Record<string, {
  avgCostPerSqm: number;
  avgProcessingWeeks: number;
  heritageImpact: string;
  neighborImpact: string;
}>;

// Area statistics by postcode (mock data - would come from DB)
const AREA_STATS = {
  'NW1': { properties: 12000, listed: 450, cas: 3, approvalRate: 0.68, avgWeeks: 11, growth: 0.05 },
  'NW3': { properties: 8500, listed: 620, cas: 4, approvalRate: 0.62, avgWeeks: 13, growth: 0.04 },
  'NW5': { properties: 6200, listed: 180, cas: 2, approvalRate: 0.72, avgWeeks: 10, growth: 0.06 },
  'NW6': { properties: 9800, listed: 340, cas: 3, approvalRate: 0.70, avgWeeks: 10, growth: 0.05 },
  'NW8': { properties: 7400, listed: 280, cas: 2, approvalRate: 0.65, avgWeeks: 12, growth: 0.03 },
  'NW11': { properties: 5600, listed: 120, cas: 1, approvalRate: 0.78, avgWeeks: 9, growth: 0.07 },
  'N2': { properties: 4800, listed: 95, cas: 1, approvalRate: 0.80, avgWeeks: 8, growth: 0.08 },
  'N6': { properties: 5200, listed: 410, cas: 2, approvalRate: 0.58, avgWeeks: 14, growth: 0.04 },
  'N10': { properties: 6100, listed: 85, cas: 1, approvalRate: 0.82, avgWeeks: 8, growth: 0.09 }
} as Record<string, {
  properties: number;
  listed: number;
  cas: number;
  approvalRate: number;
  avgWeeks: number;
  growth: number;
}>;

class ComparisonService {
  
  /**
   * Compare multiple properties
   */
  async compareProperties(addresses: Array<{
    address: string;
    postcode: string;
  }>): Promise<ComparisonResult<PropertyComparison>> {
    const items: PropertyComparison[] = [];
    
    for (const addr of addresses) {
      const property = await this.getPropertyData(addr.address, addr.postcode);
      items.push(property);
    }
    
    // Calculate metrics
    const metrics = this.calculatePropertyMetrics(items);
    
    // Analyze and recommend
    const analysis = this.analyzePropertyComparison(items, metrics);
    
    return { items, analysis, metrics };
  }
  
  /**
   * Compare multiple areas
   */
  async compareAreas(postcodes: string[]): Promise<ComparisonResult<AreaComparison>> {
    const items: AreaComparison[] = [];
    
    for (const postcode of postcodes) {
      const area = await this.getAreaData(postcode);
      items.push(area);
    }
    
    // Calculate metrics
    const metrics = this.calculateAreaMetrics(items);
    
    // Analyze and recommend
    const analysis = this.analyzeAreaComparison(items, metrics);
    
    return { items, analysis, metrics };
  }
  
  /**
   * Compare project options
   */
  async compareProjects(projects: Array<{
    type: string;
    postcode: string;
    sizeSqm: number;
    isConservationArea?: boolean;
    isListedBuilding?: boolean;
  }>): Promise<ComparisonResult<ProjectComparison>> {
    const items: ProjectComparison[] = [];
    
    for (const project of projects) {
      const comparison = this.getProjectData(project);
      items.push(comparison);
    }
    
    // Calculate metrics
    const metrics = this.calculateProjectMetrics(items);
    
    // Analyze and recommend
    const analysis = this.analyzeProjectComparison(items, metrics);
    
    return { items, analysis, metrics };
  }
  
  /**
   * Quick comparison score
   */
  getQuickScore(params: {
    approvalRate: number;
    processingTime: number;
    heritageConstraints: number;
    cost: number;
  }): {
    score: number;
    grade: 'A' | 'B' | 'C' | 'D' | 'F';
    recommendation: string;
  } {
    const { approvalRate, processingTime, heritageConstraints, cost } = params;
    
    // Weighted scoring
    let score = 0;
    score += approvalRate * 35; // 35% weight
    score += Math.max(0, (16 - processingTime) / 16) * 25; // 25% weight
    score += Math.max(0, (4 - heritageConstraints) / 4) * 20; // 20% weight
    score += Math.max(0, 1 - (cost / 500000)) * 20; // 20% weight
    
    // Normalize to 100
    score = Math.round(score);
    
    // Grade
    let grade: 'A' | 'B' | 'C' | 'D' | 'F';
    if (score >= 80) grade = 'A';
    else if (score >= 65) grade = 'B';
    else if (score >= 50) grade = 'C';
    else if (score >= 35) grade = 'D';
    else grade = 'F';
    
    // Recommendation
    let recommendation = '';
    if (grade === 'A') {
      recommendation = 'Excellent prospects. Proceed with confidence.';
    } else if (grade === 'B') {
      recommendation = 'Good prospects with manageable challenges.';
    } else if (grade === 'C') {
      recommendation = 'Moderate challenges. Consider pre-application advice.';
    } else if (grade === 'D') {
      recommendation = 'Significant challenges. Professional guidance recommended.';
    } else {
      recommendation = 'High risk. Consider alternative approaches.';
    }
    
    return { score, grade, recommendation };
  }
  
  // Private methods
  
  private async getPropertyData(address: string, postcode: string): Promise<PropertyComparison> {
    const prefix = postcode.split(' ')[0] || postcode.substring(0, 3);
    const defaultStats = { properties: 8500, listed: 620, cas: 4, approvalRate: 0.62, avgWeeks: 13, growth: 0.04 };
    const stats = AREA_STATS[prefix] ?? defaultStats;
    
    // Simulate property-specific data
    const isConservation = Math.random() > 0.4;
    const isListed = Math.random() > 0.85;
    
    return {
      address,
      postcode,
      conservationArea: isConservation,
      conservationAreaName: isConservation ? `${prefix} Conservation Area` : undefined,
      listedBuilding: isListed,
      listingGrade: isListed ? (Math.random() > 0.9 ? 'II*' : 'II') : undefined,
      article4: isConservation && Math.random() > 0.5,
      treePreservation: Math.random() > 0.7,
      approvalRate: stats.approvalRate + (Math.random() - 0.5) * 0.1,
      avgProcessingTime: stats.avgWeeks + Math.floor((Math.random() - 0.5) * 4),
      recentApplications: Math.floor(Math.random() * 10) + 1,
      successfulProjects: this.getCommonProjectTypes(isConservation, isListed)
    };
  }
  
  private async getAreaData(postcode: string): Promise<AreaComparison> {
    const prefix = postcode.split(' ')[0] || postcode.substring(0, 3);
    const defaultStats = { properties: 8500, listed: 620, cas: 4, approvalRate: 0.62, avgWeeks: 13, growth: 0.04 };
    const stats = AREA_STATS[prefix] ?? defaultStats;
    
    // Calculate difficulty
    let difficulty: 'low' | 'medium' | 'high' | 'very-high';
    const constraintScore = (stats.listed / stats.properties) * 100 + stats.cas * 10;
    
    if (stats.approvalRate > DIFFICULTY_THRESHOLDS.approvalRate.high && constraintScore < 15) {
      difficulty = 'low';
    } else if (stats.approvalRate > DIFFICULTY_THRESHOLDS.approvalRate.medium) {
      difficulty = 'medium';
    } else if (stats.approvalRate > DIFFICULTY_THRESHOLDS.approvalRate.low) {
      difficulty = 'high';
    } else {
      difficulty = 'very-high';
    }
    
    return {
      area: `${prefix} Area`,
      postcode: prefix,
      totalProperties: stats.properties,
      listedBuildings: stats.listed,
      conservationAreas: stats.cas,
      approvalRate: stats.approvalRate,
      avgProcessingWeeks: stats.avgWeeks,
      dominantProjectTypes: ['rear-extension', 'loft-conversion', 'internal-renovation'],
      avgCostPerSqm: 2800 + Math.floor(Math.random() * 800),
      propertyPriceGrowth: stats.growth,
      planningDifficulty: difficulty
    };
  }
  
  private getProjectData(project: {
    type: string;
    postcode: string;
    sizeSqm: number;
    isConservationArea?: boolean;
    isListedBuilding?: boolean;
  }): ProjectComparison {
    const defaultCharacteristics = { avgCostPerSqm: 2500, avgProcessingWeeks: 9, heritageImpact: 'medium', neighborImpact: 'medium' };
    const characteristics = PROJECT_CHARACTERISTICS[project.type] ?? defaultCharacteristics;
    const prefix = project.postcode.split(' ')[0] || project.postcode.substring(0, 3);
    const defaultStats = { properties: 8500, listed: 620, cas: 4, approvalRate: 0.62, avgWeeks: 13, growth: 0.04 };
    const stats = AREA_STATS[prefix] ?? defaultStats;
    
    // Calculate approval likelihood
    let approvalLikelihood = stats.approvalRate;
    if (project.isConservationArea) approvalLikelihood -= 0.1;
    if (project.isListedBuilding) approvalLikelihood -= 0.15;
    if (characteristics.heritageImpact === 'very-high') approvalLikelihood -= 0.1;
    approvalLikelihood = Math.max(0.2, Math.min(0.95, approvalLikelihood));
    
    // Calculate cost
    const baseCost = characteristics.avgCostPerSqm * project.sizeSqm;
    const heritagePremium = (project.isConservationArea ? 0.15 : 0) + (project.isListedBuilding ? 0.25 : 0);
    const estimatedCost = Math.round(baseCost * (1 + heritagePremium));
    
    // Processing time
    let processingTime = characteristics.avgProcessingWeeks;
    if (project.isConservationArea) processingTime += 2;
    if (project.isListedBuilding) processingTime += 4;
    
    return {
      projectType: project.type,
      location: project.postcode,
      estimatedCost,
      approvalLikelihood,
      processingTime,
      requirements: this.getRequirements(project.type, project.isConservationArea || false, project.isListedBuilding || false),
      risks: this.getRisks(project.type, project.isConservationArea || false, project.isListedBuilding || false),
      benefits: this.getBenefits(project.type)
    };
  }
  
  private getCommonProjectTypes(isConservation: boolean, isListed: boolean): string[] {
    if (isListed) {
      return ['internal-renovation', 'repair-restoration', 'like-for-like'];
    }
    if (isConservation) {
      return ['rear-extension', 'loft-conversion', 'basement'];
    }
    return ['rear-extension', 'side-extension', 'loft-conversion', 'basement'];
  }
  
  private getRequirements(type: string, isConservation: boolean, isListed: boolean): string[] {
    const base = ['Architectural drawings', 'Planning application form', 'Location plan'];
    
    if (isConservation) {
      base.push('Heritage statement', 'Design and access statement');
    }
    
    if (isListed) {
      base.push('Listed building consent application', 'Historic building survey', 'Conservation architect involvement');
    }
    
    if (type === 'basement') {
      base.push('Construction management plan', 'Structural methodology statement', 'Drainage assessment');
    }
    
    if (type === 'loft-conversion') {
      base.push('Roof plans', 'Street scene drawing');
    }
    
    return base;
  }
  
  private getRisks(type: string, isConservation: boolean, isListed: boolean): string[] {
    const risks: string[] = [];
    
    if (isListed) {
      risks.push('Listed building consent may be refused');
      risks.push('Historic England may object');
      risks.push('Reversibility requirements may add cost');
    }
    
    if (isConservation) {
      risks.push('Design may require modification');
      risks.push('Material choices may be restricted');
    }
    
    if (type === 'basement') {
      risks.push('Neighbor objections likely');
      risks.push('Construction disruption significant');
      risks.push('Groundwater issues possible');
    }
    
    if (type === 'loft-conversion' && isConservation) {
      risks.push('Dormer design heavily scrutinized');
      risks.push('Front-facing alterations unlikely');
    }
    
    if (risks.length === 0) {
      risks.push('Standard planning risks apply');
    }
    
    return risks;
  }
  
  private getBenefits(type: string): string[] {
    switch (type) {
      case 'rear-extension':
        return ['Increased living space', 'Improved kitchen/dining', 'Garden connection', 'Property value increase 5-10%'];
      case 'side-extension':
        return ['Significant space increase', 'Wider rooms', 'Property value increase 10-15%'];
      case 'loft-conversion':
        return ['Additional bedroom', 'No garden footprint', 'Property value increase 10-20%'];
      case 'basement':
        return ['Major space increase', 'Flexible use', 'Property value increase 15-25%', 'Cinema/gym potential'];
      case 'new-build':
        return ['Custom design', 'Modern standards', 'Energy efficiency', 'Maximum value'];
      default:
        return ['Improved living space', 'Property value increase'];
    }
  }
  
  private calculatePropertyMetrics(items: PropertyComparison[]): ComparisonResult<PropertyComparison>['metrics'] {
    if (items.length === 0) return [];
    
    return [
      {
        name: 'Approval Rate',
        values: items.map(i => Math.round(i.approvalRate * 100)),
        winner: items.reduce((best, curr, idx) => {
          const bestItem = items[best];
          return bestItem && curr.approvalRate > bestItem.approvalRate ? idx : best;
        }, 0),
        importance: 'high'
      },
      {
        name: 'Processing Time (weeks)',
        values: items.map(i => i.avgProcessingTime),
        winner: items.reduce((best, curr, idx) => {
          const bestItem = items[best];
          return bestItem && curr.avgProcessingTime < bestItem.avgProcessingTime ? idx : best;
        }, 0),
        importance: 'medium'
      },
      {
        name: 'Heritage Constraints',
        values: items.map(i => (i.conservationArea ? 1 : 0) + (i.listedBuilding ? 2 : 0) + (i.article4 ? 1 : 0)),
        winner: items.reduce((best, curr, idx) => {
          const bestItem = items[best];
          if (!bestItem) return idx;
          const currConstraints = (curr.conservationArea ? 1 : 0) + (curr.listedBuilding ? 2 : 0) + (curr.article4 ? 1 : 0);
          const bestConstraints = (bestItem.conservationArea ? 1 : 0) + (bestItem.listedBuilding ? 2 : 0) + (bestItem.article4 ? 1 : 0);
          return currConstraints < bestConstraints ? idx : best;
        }, 0),
        importance: 'high'
      }
    ];
  }
  
  private calculateAreaMetrics(items: AreaComparison[]): ComparisonResult<AreaComparison>['metrics'] {
    if (items.length === 0) return [];
    
    return [
      {
        name: 'Approval Rate',
        values: items.map(i => Math.round(i.approvalRate * 100)),
        winner: items.reduce((best, curr, idx) => {
          const bestItem = items[best];
          return bestItem && curr.approvalRate > bestItem.approvalRate ? idx : best;
        }, 0),
        importance: 'high'
      },
      {
        name: 'Avg Processing (weeks)',
        values: items.map(i => i.avgProcessingWeeks),
        winner: items.reduce((best, curr, idx) => {
          const bestItem = items[best];
          return bestItem && curr.avgProcessingWeeks < bestItem.avgProcessingWeeks ? idx : best;
        }, 0),
        importance: 'medium'
      },
      {
        name: 'Listed Buildings %',
        values: items.map(i => Math.round((i.listedBuildings / i.totalProperties) * 100)),
        winner: items.reduce((best, curr, idx) => {
          const bestItem = items[best];
          if (!bestItem) return idx;
          return (curr.listedBuildings / curr.totalProperties) < (bestItem.listedBuildings / bestItem.totalProperties) ? idx : best;
        }, 0),
        importance: 'medium'
      },
      {
        name: 'Property Growth %',
        values: items.map(i => Math.round(i.propertyPriceGrowth * 100)),
        winner: items.reduce((best, curr, idx) => {
          const bestItem = items[best];
          return bestItem && curr.propertyPriceGrowth > bestItem.propertyPriceGrowth ? idx : best;
        }, 0),
        importance: 'low'
      }
    ];
  }
  
  private calculateProjectMetrics(items: ProjectComparison[]): ComparisonResult<ProjectComparison>['metrics'] {
    if (items.length === 0) return [];
    
    return [
      {
        name: 'Approval Likelihood',
        values: items.map(i => Math.round(i.approvalLikelihood * 100)),
        winner: items.reduce((best, curr, idx) => {
          const bestItem = items[best];
          return bestItem && curr.approvalLikelihood > bestItem.approvalLikelihood ? idx : best;
        }, 0),
        importance: 'high'
      },
      {
        name: 'Estimated Cost (£)',
        values: items.map(i => i.estimatedCost),
        winner: items.reduce((best, curr, idx) => {
          const bestItem = items[best];
          return bestItem && curr.estimatedCost < bestItem.estimatedCost ? idx : best;
        }, 0),
        importance: 'high'
      },
      {
        name: 'Processing Time (weeks)',
        values: items.map(i => i.processingTime),
        winner: items.reduce((best, curr, idx) => {
          const bestItem = items[best];
          return bestItem && curr.processingTime < bestItem.processingTime ? idx : best;
        }, 0),
        importance: 'medium'
      },
      {
        name: 'Requirements Count',
        values: items.map(i => i.requirements.length),
        winner: items.reduce((best, curr, idx) => {
          const bestItem = items[best];
          return bestItem && curr.requirements.length < bestItem.requirements.length ? idx : best;
        }, 0),
        importance: 'low'
      }
    ];
  }
  
  private analyzePropertyComparison(items: PropertyComparison[], metrics: ComparisonResult<PropertyComparison>['metrics']): ComparisonResult<PropertyComparison>['analysis'] {
    if (items.length === 0) {
      return { bestOption: '', recommendation: 'No items to compare', factors: [], tradeoffs: [] };
    }
    
    // Calculate weighted scores
    const scores = items.map((item, idx) => {
      let score = 0;
      score += item.approvalRate * 40; // 40% weight
      score += Math.max(0, (16 - item.avgProcessingTime) / 16) * 30; // 30% weight
      const constraints = (item.conservationArea ? 1 : 0) + (item.listedBuilding ? 2 : 0) + (item.article4 ? 1 : 0);
      score += Math.max(0, (4 - constraints) / 4) * 30; // 30% weight
      return { idx, score };
    });
    
    scores.sort((a, b) => b.score - a.score);
    const firstScore = scores[0];
    if (!firstScore) {
      return { bestOption: '', recommendation: 'No items to compare', factors: [], tradeoffs: [] };
    }
    const bestIdx = firstScore.idx;
    const best = items[bestIdx];
    if (!best) {
      return { bestOption: '', recommendation: 'No items to compare', factors: [], tradeoffs: [] };
    }
    
    const factors: ComparisonFactor[] = [
      {
        factor: 'Planning Success Rate',
        weight: 40,
        scores: items.map(i => Math.round(i.approvalRate * 100)),
        description: 'Historical approval rate for similar applications'
      },
      {
        factor: 'Processing Speed',
        weight: 30,
        scores: items.map(i => Math.round((16 - i.avgProcessingTime) / 16 * 100)),
        description: 'Average time to planning decision'
      },
      {
        factor: 'Heritage Flexibility',
        weight: 30,
        scores: items.map(i => {
          const c = (i.conservationArea ? 1 : 0) + (i.listedBuilding ? 2 : 0) + (i.article4 ? 1 : 0);
          return Math.round((4 - c) / 4 * 100);
        }),
        description: 'Fewer heritage constraints = more flexibility'
      }
    ];
    
    const tradeoffs: string[] = [];
    if (best.conservationArea) {
      tradeoffs.push('Property is in conservation area - design scrutiny will be higher');
    }
    if (best.listedBuilding) {
      tradeoffs.push('Listed building status requires Listed Building Consent');
    }
    if (items.some(i => i.approvalRate > best.approvalRate + 0.1)) {
      tradeoffs.push('Higher approval rates available at other properties');
    }
    
    return {
      bestOption: best.address,
      recommendation: `${best.address} offers the best overall prospects with ${Math.round(best.approvalRate * 100)}% approval rate` +
                     (best.conservationArea ? ' (conservation area considerations apply)' : ''),
      factors,
      tradeoffs
    };
  }
  
  private analyzeAreaComparison(items: AreaComparison[], metrics: ComparisonResult<AreaComparison>['metrics']): ComparisonResult<AreaComparison>['analysis'] {
    if (items.length === 0) {
      return { bestOption: '', recommendation: 'No items to compare', factors: [], tradeoffs: [] };
    }
    
    const scores = items.map((item, idx) => {
      let score = 0;
      score += item.approvalRate * 35;
      score += Math.max(0, (16 - item.avgProcessingWeeks) / 16) * 25;
      score += Math.max(0, 1 - (item.listedBuildings / item.totalProperties)) * 20;
      score += item.propertyPriceGrowth * 200; // 20% weight
      return { idx, score };
    });
    
    scores.sort((a, b) => b.score - a.score);
    const firstScore = scores[0];
    if (!firstScore) {
      return { bestOption: '', recommendation: 'No items to compare', factors: [], tradeoffs: [] };
    }
    const bestIdx = firstScore.idx;
    const best = items[bestIdx];
    if (!best) {
      return { bestOption: '', recommendation: 'No items to compare', factors: [], tradeoffs: [] };
    }
    
    const factors: ComparisonFactor[] = [
      {
        factor: 'Planning Success',
        weight: 35,
        scores: items.map(i => Math.round(i.approvalRate * 100)),
        description: 'Area-wide approval rate'
      },
      {
        factor: 'Speed',
        weight: 25,
        scores: items.map(i => Math.round((16 - i.avgProcessingWeeks) / 16 * 100)),
        description: 'Average processing time'
      },
      {
        factor: 'Heritage Density',
        weight: 20,
        scores: items.map(i => Math.round((1 - i.listedBuildings / i.totalProperties) * 100)),
        description: 'Lower heritage density = easier planning'
      },
      {
        factor: 'Investment Value',
        weight: 20,
        scores: items.map(i => Math.round(i.propertyPriceGrowth * 1000)),
        description: 'Property price growth potential'
      }
    ];
    
    const tradeoffs: string[] = [];
    const difficultyOrder: Record<string, number> = { 'low': 0, 'medium': 1, 'high': 2, 'very-high': 3 };
    const firstItem = items[0];
    if (firstItem) {
      const worstDifficulty = items.reduce((worst, curr) => {
        if (!worst) return curr;
        const currDiff = difficultyOrder[curr.planningDifficulty] ?? 0;
        const worstDiff = difficultyOrder[worst.planningDifficulty] ?? 0;
        return currDiff > worstDiff ? curr : worst;
      }, firstItem);
    
      if (worstDifficulty && worstDifficulty.postcode !== best.postcode) {
        tradeoffs.push(`${worstDifficulty.postcode} has ${worstDifficulty.planningDifficulty} planning difficulty`);
      }
    }
    
    return {
      bestOption: best.postcode,
      recommendation: `${best.postcode} offers the best balance with ${Math.round(best.approvalRate * 100)}% approval rate, ` +
                     `${best.avgProcessingWeeks} week processing, and ${Math.round(best.propertyPriceGrowth * 100)}% price growth`,
      factors,
      tradeoffs
    };
  }
  
  private analyzeProjectComparison(items: ProjectComparison[], metrics: ComparisonResult<ProjectComparison>['metrics']): ComparisonResult<ProjectComparison>['analysis'] {
    if (items.length === 0) {
      return { bestOption: '', recommendation: 'No items to compare', factors: [], tradeoffs: [] };
    }
    
    const scores = items.map((item, idx) => {
      let score = 0;
      score += item.approvalLikelihood * 40;
      score += Math.max(0, 1 - (item.estimatedCost / 500000)) * 30;
      score += Math.max(0, (20 - item.processingTime) / 20) * 20;
      score += (10 - item.requirements.length) / 10 * 10;
      return { idx, score };
    });
    
    scores.sort((a, b) => b.score - a.score);
    const firstScore = scores[0];
    if (!firstScore) {
      return { bestOption: '', recommendation: 'No items to compare', factors: [], tradeoffs: [] };
    }
    const bestIdx = firstScore.idx;
    const best = items[bestIdx];
    if (!best) {
      return { bestOption: '', recommendation: 'No items to compare', factors: [], tradeoffs: [] };
    }
    
    const factors: ComparisonFactor[] = [
      {
        factor: 'Approval Likelihood',
        weight: 40,
        scores: items.map(i => Math.round(i.approvalLikelihood * 100)),
        description: 'Probability of planning approval'
      },
      {
        factor: 'Cost Efficiency',
        weight: 30,
        scores: items.map(i => Math.round((1 - i.estimatedCost / 500000) * 100)),
        description: 'Lower cost = higher score'
      },
      {
        factor: 'Speed',
        weight: 20,
        scores: items.map(i => Math.round((20 - i.processingTime) / 20 * 100)),
        description: 'Faster approval timeline'
      },
      {
        factor: 'Simplicity',
        weight: 10,
        scores: items.map(i => Math.round((10 - i.requirements.length) / 10 * 100)),
        description: 'Fewer requirements = simpler process'
      }
    ];
    
    const tradeoffs: string[] = [];
    const firstRisk = best.risks[0];
    if (firstRisk) {
      tradeoffs.push(`Key risk: ${firstRisk}`);
    }
    
    const firstItem = items[0];
    if (firstItem) {
      const cheapest = items.reduce((min, curr) => curr.estimatedCost < min.estimatedCost ? curr : min, firstItem);
      if (cheapest && cheapest.projectType !== best.projectType) {
        tradeoffs.push(`${cheapest.projectType} is £${(best.estimatedCost - cheapest.estimatedCost).toLocaleString()} cheaper`);
      }
    }
    
    return {
      bestOption: best.projectType,
      recommendation: `${best.projectType} offers the best overall value with ${Math.round(best.approvalLikelihood * 100)}% ` +
                     `approval likelihood and £${best.estimatedCost.toLocaleString()} estimated cost`,
      factors,
      tradeoffs
    };
  }
}

export const comparisonService = new ComparisonService();

export type {
  PropertyComparison,
  AreaComparison,
  ProjectComparison,
  ComparisonResult
};
