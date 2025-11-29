/**
 * Analytics Engine Service
 * 
 * Provides comprehensive planning analytics, trends analysis,
 * success rate predictions, and market intelligence for heritage areas.
 */

// Area analytics types
interface AreaAnalytics {
  areaCode: string;
  areaName: string;
  totalApplications: number;
  approvalRate: number;
  averageProcessingDays: number;
  trendDirection: 'up' | 'down' | 'stable';
  trendPercentage: number;
  topProjectTypes: ProjectTypeStats[];
  monthlyTrends: MonthlyTrend[];
  riskLevel: 'low' | 'medium' | 'high';
  recommendations: string[];
}

interface ProjectTypeStats {
  type: string;
  count: number;
  approvalRate: number;
  averageDays: number;
  trend: 'increasing' | 'decreasing' | 'stable';
}

interface MonthlyTrend {
  month: string;
  year: number;
  applications: number;
  approvals: number;
  rejections: number;
  withdrawals: number;
  averageDays: number;
}

interface SuccessPrediction {
  probability: number;
  confidenceLevel: 'high' | 'medium' | 'low';
  factors: PredictionFactor[];
  comparableApprovals: number;
  comparableRejections: number;
  recommendedImprovements: string[];
  riskFactors: string[];
  timeEstimate: {
    optimistic: number;
    realistic: number;
    pessimistic: number;
  };
}

interface PredictionFactor {
  name: string;
  impact: 'positive' | 'negative' | 'neutral';
  weight: number;
  description: string;
}

interface MarketIntelligence {
  areaCode: string;
  propertyPrices: {
    averagePrice: number;
    pricePerSqft: number;
    yearOnYearChange: number;
    heritagePremium: number;
  };
  developmentActivity: {
    activeProjects: number;
    recentApprovals: number;
    pendingApplications: number;
    hotspotScore: number;
  };
  competitorAnalysis: {
    topBuilders: BuilderStats[];
    averageProjectSize: number;
    marketShare: Record<string, number>;
  };
  investmentIndicators: {
    roi: number;
    riskScore: number;
    opportunityScore: number;
    marketTiming: 'excellent' | 'good' | 'fair' | 'poor';
  };
}

interface BuilderStats {
  name: string;
  projectCount: number;
  successRate: number;
  specializations: string[];
  averageProjectValue: number;
}

interface DashboardData {
  overview: {
    totalApplicationsThisYear: number;
    overallApprovalRate: number;
    averageProcessingTime: number;
    monthlyChangePercent: number;
  };
  areaBreakdown: AreaSummary[];
  projectTypeBreakdown: ProjectTypeSummary[];
  recentActivity: ActivityItem[];
  alerts: DashboardAlert[];
  insights: Insight[];
}

interface AreaSummary {
  areaCode: string;
  areaName: string;
  applications: number;
  approvalRate: number;
  trend: 'up' | 'down' | 'stable';
  highlight?: string;
}

interface ProjectTypeSummary {
  type: string;
  displayName: string;
  count: number;
  percentageOfTotal: number;
  approvalRate: number;
  averageDays: number;
  icon: string;
}

interface ActivityItem {
  id: string;
  type: 'approval' | 'rejection' | 'submission' | 'decision' | 'appeal';
  projectType: string;
  area: string;
  address: string;
  date: string;
  details: string;
}

interface DashboardAlert {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  actionRequired: boolean;
  actionUrl?: string;
  expires?: string;
}

interface Insight {
  id: string;
  category: 'opportunity' | 'trend' | 'risk' | 'comparison';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  dataPoint?: string;
  recommendation?: string;
}

// Historical data for analytics (mock - would be from database in production)
const HISTORICAL_DATA: Record<string, MonthlyTrend[]> = {
  'NW3': generateHistoricalData('NW3', 0.72),
  'NW6': generateHistoricalData('NW6', 0.68),
  'NW8': generateHistoricalData('NW8', 0.75),
  'NW1': generateHistoricalData('NW1', 0.65),
  'NW2': generateHistoricalData('NW2', 0.70),
  'NW5': generateHistoricalData('NW5', 0.67),
  'N6': generateHistoricalData('N6', 0.73),
  'N2': generateHistoricalData('N2', 0.69),
};

function generateHistoricalData(area: string, baseApprovalRate: number): MonthlyTrend[] {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentYear = new Date().getFullYear();
  const data: MonthlyTrend[] = [];
  
  // Generate 24 months of data
  for (let yearOffset = -1; yearOffset <= 0; yearOffset++) {
    const year = currentYear + yearOffset;
    const monthsToGenerate = yearOffset === 0 ? new Date().getMonth() + 1 : 12;
    
    for (let m = 0; m < monthsToGenerate; m++) {
      const seasonalMultiplier = 1 + Math.sin((m - 3) * Math.PI / 6) * 0.2;
      const applications = Math.round(25 + Math.random() * 40 * seasonalMultiplier);
      const adjustedRate = baseApprovalRate + (Math.random() - 0.5) * 0.15;
      const approvals = Math.round(applications * adjustedRate);
      const rejections = Math.round((applications - approvals) * 0.7);
      const withdrawals = applications - approvals - rejections;
      const monthName = months[m] || 'Jan';
      
      data.push({
        month: monthName,
        year,
        applications,
        approvals,
        rejections,
        withdrawals,
        averageDays: Math.round(55 + Math.random() * 25)
      });
    }
  }
  
  return data;
}

// Project type approval rates by area characteristics
const PROJECT_TYPE_RATES: Record<string, Record<string, number>> = {
  extension: { conservation: 0.62, listed: 0.48, normal: 0.78 },
  loft_conversion: { conservation: 0.70, listed: 0.55, normal: 0.85 },
  basement: { conservation: 0.45, listed: 0.30, normal: 0.65 },
  new_build: { conservation: 0.35, listed: 0.20, normal: 0.70 },
  change_of_use: { conservation: 0.58, listed: 0.45, normal: 0.72 },
  demolition: { conservation: 0.25, listed: 0.15, normal: 0.55 },
  windows: { conservation: 0.75, listed: 0.60, normal: 0.90 },
  internal: { conservation: 0.88, listed: 0.72, normal: 0.95 }
};

class AnalyticsEngine {
  
  /**
   * Get comprehensive analytics for a specific area
   */
  async getAreaAnalytics(areaCode: string): Promise<AreaAnalytics> {
    const historicalData = HISTORICAL_DATA[areaCode] || generateHistoricalData(areaCode, 0.68);
    
    // Calculate totals and rates
    const totalApps = historicalData.reduce((sum, m) => sum + m.applications, 0);
    const totalApprovals = historicalData.reduce((sum, m) => sum + m.approvals, 0);
    const avgDays = Math.round(historicalData.reduce((sum, m) => sum + m.averageDays, 0) / historicalData.length);
    
    // Calculate trend
    const recentMonths = historicalData.slice(-6);
    const olderMonths = historicalData.slice(-12, -6);
    const recentRate = recentMonths.reduce((s, m) => s + m.approvals, 0) / recentMonths.reduce((s, m) => s + m.applications, 0);
    const olderRate = olderMonths.reduce((s, m) => s + m.approvals, 0) / olderMonths.reduce((s, m) => s + m.applications, 0);
    const trendPercent = ((recentRate - olderRate) / olderRate) * 100;
    
    const areaNames: Record<string, string> = {
      'NW3': 'Hampstead',
      'NW6': 'West Hampstead',
      'NW8': "St John's Wood",
      'NW1': 'Camden Town',
      'NW2': 'Cricklewood',
      'NW5': 'Kentish Town',
      'N6': 'Highgate',
      'N2': 'East Finchley'
    };
    
    return {
      areaCode,
      areaName: areaNames[areaCode] || areaCode,
      totalApplications: totalApps,
      approvalRate: totalApprovals / totalApps,
      averageProcessingDays: avgDays,
      trendDirection: trendPercent > 2 ? 'up' : trendPercent < -2 ? 'down' : 'stable',
      trendPercentage: Math.abs(trendPercent),
      topProjectTypes: this.getTopProjectTypes(areaCode),
      monthlyTrends: historicalData,
      riskLevel: recentRate > 0.7 ? 'low' : recentRate > 0.55 ? 'medium' : 'high',
      recommendations: this.generateAreaRecommendations(areaCode, recentRate)
    };
  }
  
  /**
   * Predict success probability for a specific project
   */
  async predictSuccess(params: {
    postcode: string;
    projectType: string;
    propertyType: string;
    isListedBuilding: boolean;
    isConservationArea: boolean;
    hasPreAppAdvice: boolean;
    includingHeritageStatement: boolean;
    projectValue: number;
    sqftImpact: number;
  }): Promise<SuccessPrediction> {
    const factors: PredictionFactor[] = [];
    let baseProbability = 0.65;
    
    // Determine area type
    const areaType = params.isListedBuilding ? 'listed' : 
                     params.isConservationArea ? 'conservation' : 'normal';
    
    // Project type base rate
    const projectTypeRates = PROJECT_TYPE_RATES[params.projectType] ?? PROJECT_TYPE_RATES['extension'];
    baseProbability = projectTypeRates?.[areaType] ?? 0.65;
    
    // Factor: Pre-application advice
    if (params.hasPreAppAdvice) {
      baseProbability += 0.12;
      factors.push({
        name: 'Pre-Application Advice',
        impact: 'positive',
        weight: 0.12,
        description: 'Having pre-app advice significantly improves approval chances'
      });
    } else {
      factors.push({
        name: 'No Pre-Application Advice',
        impact: 'negative',
        weight: -0.05,
        description: 'Consider getting pre-app advice for complex projects'
      });
    }
    
    // Factor: Heritage Statement
    if (params.isConservationArea || params.isListedBuilding) {
      if (params.includingHeritageStatement) {
        baseProbability += 0.08;
        factors.push({
          name: 'Heritage Statement Included',
          impact: 'positive',
          weight: 0.08,
          description: 'Heritage statement demonstrates understanding of local character'
        });
      } else {
        baseProbability -= 0.15;
        factors.push({
          name: 'Missing Heritage Statement',
          impact: 'negative',
          weight: -0.15,
          description: 'Heritage statement is essential for conservation area applications'
        });
      }
    }
    
    // Factor: Listed Building
    if (params.isListedBuilding) {
      factors.push({
        name: 'Listed Building Status',
        impact: 'negative',
        weight: -0.10,
        description: 'Listed buildings have stricter requirements and lower approval rates'
      });
    }
    
    // Factor: Conservation Area
    if (params.isConservationArea && !params.isListedBuilding) {
      factors.push({
        name: 'Conservation Area',
        impact: 'neutral',
        weight: -0.05,
        description: 'Conservation areas require sympathetic design approach'
      });
    }
    
    // Factor: Project Size
    if (params.sqftImpact > 100) {
      const sizePenalty = Math.min(0.15, (params.sqftImpact - 100) * 0.001);
      baseProbability -= sizePenalty;
      factors.push({
        name: 'Significant Size Increase',
        impact: 'negative',
        weight: -sizePenalty,
        description: 'Larger extensions face more scrutiny in heritage areas'
      });
    }
    
    // Calculate confidence
    const confidence = factors.length > 4 ? 'high' : factors.length > 2 ? 'medium' : 'low';
    
    // Clamp probability
    const finalProbability = Math.max(0.15, Math.min(0.95, baseProbability));
    
    // Time estimates based on complexity
    const baseTime = params.isListedBuilding ? 90 : params.isConservationArea ? 65 : 55;
    
    return {
      probability: Math.round(finalProbability * 100) / 100,
      confidenceLevel: confidence,
      factors,
      comparableApprovals: Math.round(45 + Math.random() * 30),
      comparableRejections: Math.round(15 + Math.random() * 20),
      recommendedImprovements: this.getRecommendedImprovements(params, factors),
      riskFactors: this.getRiskFactors(params),
      timeEstimate: {
        optimistic: Math.round(baseTime * 0.7),
        realistic: baseTime,
        pessimistic: Math.round(baseTime * 1.5)
      }
    };
  }
  
  /**
   * Get market intelligence for an area
   */
  async getMarketIntelligence(areaCode: string): Promise<MarketIntelligence> {
    // Market data (mock - would come from property databases in production)
    const marketData: Record<string, Partial<MarketIntelligence['propertyPrices']>> = {
      'NW3': { averagePrice: 2450000, pricePerSqft: 1250, yearOnYearChange: 4.2, heritagePremium: 18 },
      'NW6': { averagePrice: 1150000, pricePerSqft: 850, yearOnYearChange: 3.8, heritagePremium: 12 },
      'NW8': { averagePrice: 2800000, pricePerSqft: 1350, yearOnYearChange: 2.9, heritagePremium: 15 },
      'NW1': { averagePrice: 980000, pricePerSqft: 780, yearOnYearChange: 5.1, heritagePremium: 8 },
      'N6': { averagePrice: 1850000, pricePerSqft: 1050, yearOnYearChange: 3.5, heritagePremium: 14 },
      'N2': { averagePrice: 950000, pricePerSqft: 720, yearOnYearChange: 4.8, heritagePremium: 6 }
    };
    
    const defaultPrices = { averagePrice: 1500000, pricePerSqft: 900, yearOnYearChange: 3.5, heritagePremium: 10 };
    const prices = marketData[areaCode] ?? marketData['NW3'] ?? defaultPrices;
    const historicalData = HISTORICAL_DATA[areaCode] ?? HISTORICAL_DATA['NW3'] ?? generateHistoricalData(areaCode, 0.68);
    const recentMonths = historicalData.slice(-3);
    
    const activeProjects = recentMonths.reduce((s, m) => s + m.applications - m.approvals - m.rejections - m.withdrawals, 0);
    const recentApprovals = recentMonths.reduce((s, m) => s + m.approvals, 0);
    
    return {
      areaCode,
      propertyPrices: {
        averagePrice: prices.averagePrice ?? 1500000,
        pricePerSqft: prices.pricePerSqft ?? 900,
        yearOnYearChange: prices.yearOnYearChange ?? 3.5,
        heritagePremium: prices.heritagePremium ?? 10
      },
      developmentActivity: {
        activeProjects: Math.max(15, activeProjects),
        recentApprovals,
        pendingApplications: Math.round(25 + Math.random() * 20),
        hotspotScore: Math.round(50 + Math.random() * 40)
      },
      competitorAnalysis: {
        topBuilders: this.getTopBuilders(areaCode),
        averageProjectSize: 85 + Math.round(Math.random() * 40),
        marketShare: {
          'Extensions': 0.35,
          'Loft Conversions': 0.25,
          'Basements': 0.15,
          'Internal Works': 0.15,
          'Other': 0.10
        }
      },
      investmentIndicators: {
        roi: 15 + Math.round(Math.random() * 10),
        riskScore: Math.round(30 + Math.random() * 30),
        opportunityScore: Math.round(60 + Math.random() * 30),
        marketTiming: this.getMarketTiming(prices.yearOnYearChange ?? 3.5)
      }
    };
  }
  
  /**
   * Get comprehensive dashboard data
   */
  async getDashboardData(userPostcodes?: string[]): Promise<DashboardData> {
    const areas = userPostcodes || ['NW3', 'NW6', 'NW8', 'NW1', 'N6'];
    
    // Calculate overview metrics
    let totalApps = 0;
    let totalApprovals = 0;
    let totalDays = 0;
    let monthCount = 0;
    
    for (const area of areas) {
      const data = HISTORICAL_DATA[area] || generateHistoricalData(area, 0.68);
      const yearData = data.filter(d => d.year === new Date().getFullYear());
      totalApps += yearData.reduce((s, m) => s + m.applications, 0);
      totalApprovals += yearData.reduce((s, m) => s + m.approvals, 0);
      totalDays += yearData.reduce((s, m) => s + m.averageDays, 0);
      monthCount += yearData.length;
    }
    
    // Calculate monthly change
    const currentMonth = new Date().getMonth();
    let currentMonthApps = 0;
    let lastMonthApps = 0;
    
    for (const area of areas) {
      const data = HISTORICAL_DATA[area] || generateHistoricalData(area, 0.68);
      const current = data.find(d => d.year === new Date().getFullYear() && d.month === ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][currentMonth]);
      const last = data.find(d => d.month === ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][currentMonth - 1] || d.month === 'Dec');
      if (current) currentMonthApps += current.applications;
      if (last) lastMonthApps += last.applications;
    }
    
    const monthlyChange = lastMonthApps > 0 ? ((currentMonthApps - lastMonthApps) / lastMonthApps) * 100 : 0;
    
    return {
      overview: {
        totalApplicationsThisYear: totalApps,
        overallApprovalRate: totalApps > 0 ? totalApprovals / totalApps : 0,
        averageProcessingTime: monthCount > 0 ? Math.round(totalDays / monthCount) : 60,
        monthlyChangePercent: Math.round(monthlyChange * 10) / 10
      },
      areaBreakdown: await this.getAreaBreakdown(areas),
      projectTypeBreakdown: this.getProjectTypeBreakdown(),
      recentActivity: this.getRecentActivity(),
      alerts: this.getDashboardAlerts(),
      insights: this.generateInsights(areas)
    };
  }
  
  /**
   * Generate comparison report between areas
   */
  async compareAreas(areaCodes: string[]): Promise<{
    comparison: Array<{
      metric: string;
      values: Record<string, number | string>;
      winner: string;
      insight: string;
    }>;
    recommendation: string;
  }> {
    const analytics = await Promise.all(areaCodes.map(code => this.getAreaAnalytics(code)));
    
    const metrics = [
      {
        metric: 'Approval Rate',
        values: Object.fromEntries(analytics.map(a => [a.areaCode, `${Math.round(a.approvalRate * 100)}%`])),
        winner: analytics.reduce((best, a) => a.approvalRate > best.approvalRate ? a : best).areaCode,
        insight: 'Higher approval rates indicate more favorable planning environment'
      },
      {
        metric: 'Processing Time',
        values: Object.fromEntries(analytics.map(a => [a.areaCode, `${a.averageProcessingDays} days`])),
        winner: analytics.reduce((best, a) => a.averageProcessingDays < best.averageProcessingDays ? a : best).areaCode,
        insight: 'Faster processing reduces project uncertainty and holding costs'
      },
      {
        metric: 'Application Volume',
        values: Object.fromEntries(analytics.map(a => [a.areaCode, a.totalApplications])),
        winner: analytics.reduce((best, a) => a.totalApplications > best.totalApplications ? a : best).areaCode,
        insight: 'Higher volume indicates active development market'
      },
      {
        metric: 'Risk Level',
        values: Object.fromEntries(analytics.map(a => [a.areaCode, a.riskLevel])),
        winner: analytics.reduce((best, a) => {
          const riskOrder = { low: 3, medium: 2, high: 1 };
          return riskOrder[a.riskLevel] > riskOrder[best.riskLevel] ? a : best;
        }).areaCode,
        insight: 'Lower risk areas have more predictable outcomes'
      }
    ];
    
    const bestArea = analytics.reduce((best, a) => {
      const score = (a.approvalRate * 100) - (a.averageProcessingDays * 0.5) - (a.riskLevel === 'high' ? 10 : a.riskLevel === 'medium' ? 5 : 0);
      const bestScore = (best.approvalRate * 100) - (best.averageProcessingDays * 0.5) - (best.riskLevel === 'high' ? 10 : best.riskLevel === 'medium' ? 5 : 0);
      return score > bestScore ? a : best;
    });
    
    return {
      comparison: metrics,
      recommendation: `Based on comprehensive analysis, ${bestArea.areaName} (${bestArea.areaCode}) offers the best overall planning prospects with a ${Math.round(bestArea.approvalRate * 100)}% approval rate and ${bestArea.averageProcessingDays}-day average processing time.`
    };
  }
  
  // Private helper methods
  
  private getTopProjectTypes(areaCode: string): ProjectTypeStats[] {
    const types = [
      { type: 'extension', name: 'Rear/Side Extension' },
      { type: 'loft_conversion', name: 'Loft Conversion' },
      { type: 'basement', name: 'Basement Extension' },
      { type: 'windows', name: 'Window Replacement' },
      { type: 'internal', name: 'Internal Alterations' }
    ];
    
    return types.map(t => {
      const rates = PROJECT_TYPE_RATES[t.type];
      const baseRate = rates?.['conservation'] ?? 0.65;
      const trendValue = Math.random();
      const trend: 'increasing' | 'stable' | 'decreasing' = 
        trendValue > 0.6 ? 'increasing' : trendValue > 0.3 ? 'stable' : 'decreasing';
      
      return {
        type: t.name,
        count: Math.round(20 + Math.random() * 80),
        approvalRate: baseRate + (Math.random() - 0.5) * 0.1,
        averageDays: Math.round(50 + Math.random() * 30),
        trend
      };
    }).sort((a, b) => b.count - a.count);
  }
  
  private generateAreaRecommendations(areaCode: string, approvalRate: number): string[] {
    const recommendations: string[] = [];
    
    if (approvalRate < 0.6) {
      recommendations.push('Consider pre-application advice for all projects in this challenging area');
      recommendations.push('Engage a heritage consultant early in the design process');
    }
    
    if (approvalRate < 0.7) {
      recommendations.push('Loft conversions have higher success rates than basement extensions');
      recommendations.push('Traditional materials significantly improve approval chances');
    }
    
    recommendations.push('Review recent approvals on your street for design precedents');
    recommendations.push('Early engagement with conservation officers is strongly recommended');
    
    return recommendations.slice(0, 4);
  }
  
  private getRecommendedImprovements(params: Record<string, unknown>, factors: PredictionFactor[]): string[] {
    const improvements: string[] = [];
    
    if (!params['hasPreAppAdvice']) {
      improvements.push('Obtain pre-application advice from the local authority (typical cost £200-£400)');
    }
    
    if ((params['isConservationArea'] || params['isListedBuilding']) && !params['includingHeritageStatement']) {
      improvements.push('Commission a professional heritage impact assessment');
    }
    
    if (params['projectType'] === 'basement') {
      improvements.push('Include comprehensive structural and hydrological surveys');
      improvements.push('Consider reducing basement depth to minimize impact');
    }
    
    improvements.push('Use traditional materials matching existing property character');
    improvements.push('Include detailed CGI visualizations showing integration with streetscape');
    
    return improvements.slice(0, 5);
  }
  
  private getRiskFactors(params: Record<string, unknown>): string[] {
    const risks: string[] = [];
    
    if (params['isListedBuilding']) {
      risks.push('Listed Building Consent required in addition to planning permission');
      risks.push('Historic England may request modifications or object');
    }
    
    if (params['isConservationArea']) {
      risks.push('Enhanced scrutiny of external changes and materials');
      risks.push('Neighbor objections carry more weight in conservation areas');
    }
    
    if (params['projectType'] === 'basement') {
      risks.push('Potential Article 4 restrictions on basement developments');
      risks.push('Construction management conditions likely to be imposed');
    }
    
    if (Number(params['sqftImpact']) > 50) {
      risks.push('May exceed permitted development thresholds');
    }
    
    return risks.slice(0, 4);
  }
  
  private getTopBuilders(areaCode: string): BuilderStats[] {
    const builders = [
      'Heritage Home Extensions',
      'Conservation Builders Ltd',
      'Hampstead Build Co',
      'North London Developments',
      'Classic Home Improvements'
    ];
    
    return builders.map((name, i) => ({
      name,
      projectCount: 25 - i * 4 + Math.round(Math.random() * 5),
      successRate: 0.75 + Math.random() * 0.2,
      specializations: i % 2 === 0 ? ['Extensions', 'Loft Conversions'] : ['Basements', 'Renovations'],
      averageProjectValue: 150000 + Math.round(Math.random() * 200000)
    }));
  }
  
  private getMarketTiming(yearOnYearChange: number): 'excellent' | 'good' | 'fair' | 'poor' {
    if (yearOnYearChange > 4) return 'excellent';
    if (yearOnYearChange > 2) return 'good';
    if (yearOnYearChange > 0) return 'fair';
    return 'poor';
  }
  
  private async getAreaBreakdown(areas: string[]): Promise<AreaSummary[]> {
    const summaries: AreaSummary[] = [];
    
    const areaNames: Record<string, string> = {
      'NW3': 'Hampstead',
      'NW6': 'West Hampstead',
      'NW8': "St John's Wood",
      'NW1': 'Camden Town',
      'NW2': 'Cricklewood',
      'NW5': 'Kentish Town',
      'N6': 'Highgate',
      'N2': 'East Finchley'
    };
    
    for (const area of areas) {
      const data = HISTORICAL_DATA[area] || generateHistoricalData(area, 0.68);
      const recentData = data.slice(-6);
      const apps = recentData.reduce((s, m) => s + m.applications, 0);
      const approvals = recentData.reduce((s, m) => s + m.approvals, 0);
      const rate = apps > 0 ? approvals / apps : 0;
      
      // Calculate trend
      const firstHalf = data.slice(-6, -3);
      const secondHalf = data.slice(-3);
      const firstRate = firstHalf.reduce((s, m) => s + m.approvals, 0) / Math.max(1, firstHalf.reduce((s, m) => s + m.applications, 0));
      const secondRate = secondHalf.reduce((s, m) => s + m.approvals, 0) / Math.max(1, secondHalf.reduce((s, m) => s + m.applications, 0));
      
      summaries.push({
        areaCode: area,
        areaName: areaNames[area] || area,
        applications: apps,
        approvalRate: rate,
        trend: secondRate > firstRate + 0.03 ? 'up' : secondRate < firstRate - 0.03 ? 'down' : 'stable',
        highlight: rate > 0.75 ? 'High approval area' : rate < 0.55 ? 'Challenging area' : undefined
      });
    }
    
    return summaries.sort((a, b) => b.approvalRate - a.approvalRate);
  }
  
  private getProjectTypeBreakdown(): ProjectTypeSummary[] {
    return [
      { type: 'extension', displayName: 'Extensions', count: 245, percentageOfTotal: 35, approvalRate: 0.68, averageDays: 58, icon: '🏠' },
      { type: 'loft', displayName: 'Loft Conversions', count: 189, percentageOfTotal: 27, approvalRate: 0.75, averageDays: 52, icon: '🏗️' },
      { type: 'basement', displayName: 'Basements', count: 98, percentageOfTotal: 14, approvalRate: 0.52, averageDays: 78, icon: '⬇️' },
      { type: 'windows', displayName: 'Windows/Doors', count: 87, percentageOfTotal: 12, approvalRate: 0.82, averageDays: 42, icon: '🪟' },
      { type: 'other', displayName: 'Other Works', count: 81, percentageOfTotal: 12, approvalRate: 0.71, averageDays: 55, icon: '🔧' }
    ];
  }
  
  private getRecentActivity(): ActivityItem[] {
    const activities: ActivityItem[] = [
      {
        id: '1',
        type: 'approval',
        projectType: 'Rear Extension',
        area: 'NW3',
        address: '42 Hampstead High Street',
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        details: 'Single storey rear extension approved with conditions'
      },
      {
        id: '2',
        type: 'submission',
        projectType: 'Loft Conversion',
        area: 'NW6',
        address: '15 West End Lane',
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        details: 'New application for mansard loft conversion submitted'
      },
      {
        id: '3',
        type: 'rejection',
        projectType: 'Basement',
        area: 'NW3',
        address: '8 Church Row',
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        details: 'Refused due to impact on listed building setting'
      },
      {
        id: '4',
        type: 'decision',
        projectType: 'Change of Use',
        area: 'NW1',
        address: '123 Camden High Street',
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        details: 'Residential to commercial conversion under consideration'
      }
    ];
    
    return activities;
  }
  
  private getDashboardAlerts(): DashboardAlert[] {
    return [
      {
        id: '1',
        severity: 'warning',
        title: 'New Article 4 Direction',
        message: 'Camden Council is consulting on new Article 4 restrictions for basement developments in NW3',
        actionRequired: true,
        actionUrl: '/alerts',
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '2',
        severity: 'info',
        title: 'Processing Times Update',
        message: 'Average determination times have decreased by 8% across heritage areas',
        actionRequired: false
      },
      {
        id: '3',
        severity: 'critical',
        title: 'Listed Building Policy Change',
        message: 'Historic England has issued new guidance on solar panels for listed buildings',
        actionRequired: true,
        actionUrl: 'https://historicengland.org.uk'
      }
    ];
  }
  
  private generateInsights(areas: string[]): Insight[] {
    return [
      {
        id: '1',
        category: 'opportunity',
        title: 'Loft Conversion Window',
        description: 'Loft conversions in NW6 have seen 15% higher approval rates in the past quarter',
        impact: 'high',
        dataPoint: '+15% approval rate',
        recommendation: 'Consider prioritizing loft conversion projects in West Hampstead'
      },
      {
        id: '2',
        category: 'trend',
        title: 'Basement Restrictions Tightening',
        description: 'Applications for basement extensions are facing increased scrutiny across all heritage areas',
        impact: 'high',
        dataPoint: '-12% approval rate YoY',
        recommendation: 'Engage heritage consultants early for basement projects'
      },
      {
        id: '3',
        category: 'risk',
        title: 'Conservation Area Boundary Review',
        description: 'Hampstead Conservation Area boundary is under review - may expand to include additional streets',
        impact: 'medium',
        recommendation: 'Check if your property may be affected by potential expansion'
      },
      {
        id: '4',
        category: 'comparison',
        title: 'Cross-Borough Analysis',
        description: 'Camden has 8% higher approval rates than Barnet for comparable heritage projects',
        impact: 'medium',
        dataPoint: 'Camden 72% vs Barnet 64%',
        recommendation: 'Consider borough differences when selecting project locations'
      }
    ];
  }
}

export const analyticsEngine = new AnalyticsEngine();

export type {
  AreaAnalytics,
  SuccessPrediction,
  MarketIntelligence,
  DashboardData,
  PredictionFactor,
  MonthlyTrend,
  Insight,
  DashboardAlert
};
