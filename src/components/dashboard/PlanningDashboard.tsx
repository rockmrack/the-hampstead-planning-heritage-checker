'use client';

/**
 * Planning Intelligence Dashboard Component
 * 
 * A comprehensive analytics dashboard showing approval rates, trends,
 * market intelligence, and predictive insights for heritage areas.
 */

import React, { useState, useEffect } from 'react';
import type {
  DashboardData,
  AreaAnalytics,
  MarketIntelligence,
  Insight,
  DashboardAlert
} from '@/lib/services/analytics-engine';

interface PlanningDashboardProps {
  defaultAreas?: string[];
  showMarketData?: boolean;
  compactMode?: boolean;
  onAreaSelect?: (areaCode: string) => void;
}

type ActiveTab = 'overview' | 'areas' | 'market' | 'insights';

export function PlanningDashboard({
  defaultAreas = ['NW3', 'NW6', 'NW8', 'N6'],
  showMarketData = true,
  compactMode = false,
  onAreaSelect
}: PlanningDashboardProps) {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [areaAnalytics, setAreaAnalytics] = useState<AreaAnalytics | null>(null);
  const [marketData, setMarketData] = useState<MarketIntelligence | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/analytics?type=dashboard&areas=${defaultAreas.join(',')}`
        );
        const data = await response.json();
        
        if (data.success) {
          setDashboardData(data.data);
        } else {
          setError(data.error);
        }
      } catch (err) {
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboard();
  }, [defaultAreas.join(',')]);

  // Fetch area-specific data when area selected
  useEffect(() => {
    if (!selectedArea) return;
    
    const fetchAreaData = async () => {
      try {
        const [areaRes, marketRes] = await Promise.all([
          fetch(`/api/analytics?type=area&area=${selectedArea}`),
          showMarketData ? fetch(`/api/analytics?type=market&area=${selectedArea}`) : Promise.resolve(null)
        ]);
        
        const areaData = await areaRes.json();
        if (areaData.success) {
          setAreaAnalytics(areaData.data);
        }
        
        if (marketRes) {
          const market = await marketRes.json();
          if (market.success) {
            setMarketData(market.data);
          }
        }
      } catch (err) {
        console.error('Failed to load area data:', err);
      }
    };
    
    fetchAreaData();
  }, [selectedArea, showMarketData]);

  const handleAreaClick = (areaCode: string) => {
    setSelectedArea(areaCode);
    setActiveTab('areas');
    onAreaSelect?.(areaCode);
  };

  if (loading) {
    return <DashboardSkeleton compactMode={compactMode} />;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <div className="text-red-600 font-medium">{error}</div>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!dashboardData) return null;

  return (
    <div className={`bg-white rounded-xl shadow-lg ${compactMode ? 'p-4' : 'p-6'}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Planning Intelligence</h2>
          <p className="text-gray-500 text-sm mt-1">
            Real-time analytics for heritage planning areas
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">
            Last updated: {new Date().toLocaleTimeString()}
          </span>
          <button
            onClick={() => window.location.reload()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Refresh"
          >
            🔄
          </button>
        </div>
      </div>

      {/* Alerts */}
      {dashboardData.alerts.length > 0 && (
        <AlertsSection alerts={dashboardData.alerts} />
      )}

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 mb-6">
        {(['overview', 'areas', 'market', 'insights'] as ActiveTab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <OverviewTab 
          data={dashboardData} 
          onAreaClick={handleAreaClick}
          compactMode={compactMode}
        />
      )}
      
      {activeTab === 'areas' && (
        <AreasTab 
          data={dashboardData}
          selectedArea={selectedArea}
          areaAnalytics={areaAnalytics}
          onAreaSelect={setSelectedArea}
          compactMode={compactMode}
        />
      )}
      
      {activeTab === 'market' && (
        <MarketTab 
          data={dashboardData}
          marketData={marketData}
          selectedArea={selectedArea}
          onAreaSelect={setSelectedArea}
          compactMode={compactMode}
        />
      )}
      
      {activeTab === 'insights' && (
        <InsightsTab 
          insights={dashboardData.insights}
          compactMode={compactMode}
        />
      )}
    </div>
  );
}

// Sub-components

function AlertsSection({ alerts }: { alerts: DashboardAlert[] }) {
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set());
  
  const visibleAlerts = alerts.filter(a => !dismissedAlerts.has(a.id));
  
  if (visibleAlerts.length === 0) return null;
  
  return (
    <div className="mb-6 space-y-2">
      {visibleAlerts.map((alert) => (
        <div
          key={alert.id}
          className={`p-4 rounded-lg flex items-start justify-between ${
            alert.severity === 'critical' ? 'bg-red-50 border border-red-200' :
            alert.severity === 'warning' ? 'bg-yellow-50 border border-yellow-200' :
            'bg-blue-50 border border-blue-200'
          }`}
        >
          <div className="flex items-start gap-3">
            <span className="text-xl">
              {alert.severity === 'critical' ? '🚨' : 
               alert.severity === 'warning' ? '⚠️' : 'ℹ️'}
            </span>
            <div>
              <h4 className="font-medium text-gray-900">{alert.title}</h4>
              <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
              {alert.actionUrl && (
                <a
                  href={alert.actionUrl}
                  className="text-sm text-blue-600 hover:underline mt-2 inline-block"
                >
                  Learn more →
                </a>
              )}
            </div>
          </div>
          <button
            onClick={() => setDismissedAlerts(prev => new Set([...prev, alert.id]))}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}

function OverviewTab({ 
  data, 
  onAreaClick,
  compactMode 
}: { 
  data: DashboardData; 
  onAreaClick: (area: string) => void;
  compactMode: boolean;
}) {
  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className={`grid ${compactMode ? 'grid-cols-2' : 'grid-cols-4'} gap-4`}>
        <MetricCard
          label="Applications YTD"
          value={data.overview.totalApplicationsThisYear.toLocaleString()}
          change={data.overview.monthlyChangePercent}
          icon="📊"
        />
        <MetricCard
          label="Approval Rate"
          value={`${Math.round(data.overview.overallApprovalRate * 100)}%`}
          icon="✅"
          highlight={data.overview.overallApprovalRate > 0.7}
        />
        <MetricCard
          label="Avg Processing"
          value={`${data.overview.averageProcessingTime} days`}
          icon="⏱️"
        />
        <MetricCard
          label="Monthly Change"
          value={`${data.overview.monthlyChangePercent > 0 ? '+' : ''}${data.overview.monthlyChangePercent}%`}
          icon={data.overview.monthlyChangePercent > 0 ? '📈' : '📉'}
          changePositive={data.overview.monthlyChangePercent > 0}
        />
      </div>

      {/* Area Breakdown Chart */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-4">Area Performance</h3>
        <div className="space-y-3">
          {data.areaBreakdown.map((area) => (
            <div 
              key={area.areaCode}
              onClick={() => onAreaClick(area.areaCode)}
              className="flex items-center gap-4 cursor-pointer hover:bg-gray-100 p-2 rounded-lg transition-colors"
            >
              <div className="w-16 font-medium text-gray-700">{area.areaCode}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm text-gray-600">{area.areaName}</span>
                  {area.highlight && (
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                      {area.highlight}
                    </span>
                  )}
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      area.approvalRate > 0.7 ? 'bg-green-500' :
                      area.approvalRate > 0.55 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${area.approvalRate * 100}%` }}
                  />
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium">{Math.round(area.approvalRate * 100)}%</div>
                <div className="text-xs text-gray-500">
                  {area.trend === 'up' ? '↑' : area.trend === 'down' ? '↓' : '→'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Project Types */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-4">Project Types</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {data.projectTypeBreakdown.map((type) => (
            <div key={type.type} className="text-center p-3 bg-white rounded-lg shadow-sm">
              <div className="text-2xl mb-1">{type.icon}</div>
              <div className="text-sm font-medium text-gray-800">{type.displayName}</div>
              <div className="text-lg font-bold text-blue-600">{type.count}</div>
              <div className="text-xs text-gray-500">{type.percentageOfTotal}% of total</div>
              <div className={`text-xs mt-1 ${
                type.approvalRate > 0.7 ? 'text-green-600' : 
                type.approvalRate > 0.55 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {Math.round(type.approvalRate * 100)}% approved
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {data.recentActivity.slice(0, 4).map((activity) => (
            <div key={activity.id} className="flex items-start gap-3 p-2">
              <span className="text-xl">
                {activity.type === 'approval' ? '✅' :
                 activity.type === 'rejection' ? '❌' :
                 activity.type === 'submission' ? '📝' : '🔔'}
              </span>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-800">{activity.projectType}</span>
                  <span className="text-xs bg-gray-200 px-2 py-0.5 rounded">{activity.area}</span>
                </div>
                <p className="text-sm text-gray-600">{activity.details}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(activity.date).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AreasTab({
  data,
  selectedArea,
  areaAnalytics,
  onAreaSelect,
  compactMode
}: {
  data: DashboardData;
  selectedArea: string | null;
  areaAnalytics: AreaAnalytics | null;
  onAreaSelect: (area: string) => void;
  compactMode: boolean;
}) {
  return (
    <div className="space-y-6">
      {/* Area Selector */}
      <div className="flex flex-wrap gap-2">
        {data.areaBreakdown.map((area) => (
          <button
            key={area.areaCode}
            onClick={() => onAreaSelect(area.areaCode)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedArea === area.areaCode
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {area.areaCode} - {area.areaName}
          </button>
        ))}
      </div>

      {/* Area Details */}
      {areaAnalytics ? (
        <div className="space-y-6">
          {/* Area Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold">{areaAnalytics.areaName}</h3>
                <p className="text-blue-100">{areaAnalytics.areaCode}</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">
                  {Math.round(areaAnalytics.approvalRate * 100)}%
                </div>
                <div className="text-blue-100">Approval Rate</div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="text-center">
                <div className="text-2xl font-bold">{areaAnalytics.totalApplications}</div>
                <div className="text-blue-100 text-sm">Total Applications</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{areaAnalytics.averageProcessingDays}</div>
                <div className="text-blue-100 text-sm">Avg Days</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold capitalize">{areaAnalytics.riskLevel}</div>
                <div className="text-blue-100 text-sm">Risk Level</div>
              </div>
            </div>
          </div>

          {/* Trend Chart */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-4">Monthly Trends</h4>
            <TrendChart data={areaAnalytics.monthlyTrends.slice(-12)} />
          </div>

          {/* Top Project Types */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-4">Project Type Performance</h4>
            <div className="space-y-3">
              {areaAnalytics.topProjectTypes.map((type) => (
                <div key={type.type} className="flex items-center justify-between p-2">
                  <div>
                    <div className="font-medium text-gray-800">{type.type}</div>
                    <div className="text-sm text-gray-500">{type.count} applications</div>
                  </div>
                  <div className="text-right">
                    <div className={`font-medium ${
                      type.approvalRate > 0.7 ? 'text-green-600' :
                      type.approvalRate > 0.55 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {Math.round(type.approvalRate * 100)}%
                    </div>
                    <div className="text-xs text-gray-500">{type.averageDays} days avg</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-3">📋 Area Recommendations</h4>
            <ul className="space-y-2">
              {areaAnalytics.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-blue-800">
                  <span>•</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          Select an area to view detailed analytics
        </div>
      )}
    </div>
  );
}

function MarketTab({
  data,
  marketData,
  selectedArea,
  onAreaSelect,
  compactMode
}: {
  data: DashboardData;
  marketData: MarketIntelligence | null;
  selectedArea: string | null;
  onAreaSelect: (area: string) => void;
  compactMode: boolean;
}) {
  return (
    <div className="space-y-6">
      {/* Area Selector */}
      <div className="flex flex-wrap gap-2">
        {data.areaBreakdown.map((area) => (
          <button
            key={area.areaCode}
            onClick={() => onAreaSelect(area.areaCode)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedArea === area.areaCode
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {area.areaCode}
          </button>
        ))}
      </div>

      {marketData ? (
        <div className="space-y-6">
          {/* Property Prices */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-4">💷 Property Market</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-white rounded-lg">
                <div className="text-2xl font-bold text-gray-800">
                  £{(marketData.propertyPrices.averagePrice / 1000000).toFixed(2)}m
                </div>
                <div className="text-sm text-gray-500">Avg Price</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg">
                <div className="text-2xl font-bold text-gray-800">
                  £{marketData.propertyPrices.pricePerSqft}
                </div>
                <div className="text-sm text-gray-500">Per Sq Ft</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg">
                <div className={`text-2xl font-bold ${
                  marketData.propertyPrices.yearOnYearChange > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {marketData.propertyPrices.yearOnYearChange > 0 ? '+' : ''}
                  {marketData.propertyPrices.yearOnYearChange}%
                </div>
                <div className="text-sm text-gray-500">YoY Change</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  +{marketData.propertyPrices.heritagePremium}%
                </div>
                <div className="text-sm text-gray-500">Heritage Premium</div>
              </div>
            </div>
          </div>

          {/* Development Activity */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-4">🏗️ Development Activity</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-white rounded-lg">
                <div className="text-2xl font-bold text-gray-800">
                  {marketData.developmentActivity.activeProjects}
                </div>
                <div className="text-sm text-gray-500">Active Projects</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {marketData.developmentActivity.recentApprovals}
                </div>
                <div className="text-sm text-gray-500">Recent Approvals</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">
                  {marketData.developmentActivity.pendingApplications}
                </div>
                <div className="text-sm text-gray-500">Pending</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {marketData.developmentActivity.hotspotScore}
                </div>
                <div className="text-sm text-gray-500">Hotspot Score</div>
              </div>
            </div>
          </div>

          {/* Investment Indicators */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-6 text-white">
            <h4 className="font-semibold mb-4">📈 Investment Indicators</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold">{marketData.investmentIndicators.roi}%</div>
                <div className="text-green-100 text-sm">Expected ROI</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">{marketData.investmentIndicators.riskScore}</div>
                <div className="text-green-100 text-sm">Risk Score</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">{marketData.investmentIndicators.opportunityScore}</div>
                <div className="text-green-100 text-sm">Opportunity</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold capitalize">
                  {marketData.investmentIndicators.marketTiming}
                </div>
                <div className="text-green-100 text-sm">Market Timing</div>
              </div>
            </div>
          </div>

          {/* Top Builders */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-4">👷 Top Builders in Area</h4>
            <div className="space-y-3">
              {marketData.competitorAnalysis.topBuilders.slice(0, 5).map((builder, index) => (
                <div key={builder.name} className="flex items-center justify-between p-2 bg-white rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </span>
                    <div>
                      <div className="font-medium text-gray-800">{builder.name}</div>
                      <div className="text-xs text-gray-500">
                        {builder.specializations.join(', ')}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-gray-800">{builder.projectCount} projects</div>
                    <div className="text-xs text-green-600">
                      {Math.round(builder.successRate * 100)}% success
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          Select an area to view market intelligence
        </div>
      )}
    </div>
  );
}

function InsightsTab({
  insights,
  compactMode
}: {
  insights: Insight[];
  compactMode: boolean;
}) {
  const categoryIcons: Record<string, string> = {
    opportunity: '💡',
    trend: '📊',
    risk: '⚠️',
    comparison: '⚖️'
  };
  
  const impactColors: Record<string, string> = {
    high: 'bg-red-100 text-red-700',
    medium: 'bg-yellow-100 text-yellow-700',
    low: 'bg-green-100 text-green-700'
  };

  return (
    <div className="space-y-4">
      {insights.map((insight) => (
        <div key={insight.id} className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-start gap-4">
            <span className="text-2xl">{categoryIcons[insight.category]}</span>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-semibold text-gray-900">{insight.title}</h4>
                <span className={`text-xs px-2 py-0.5 rounded-full ${impactColors[insight.impact]}`}>
                  {insight.impact} impact
                </span>
              </div>
              <p className="text-gray-600 text-sm">{insight.description}</p>
              {insight.dataPoint && (
                <div className="mt-2 text-lg font-bold text-blue-600">
                  {insight.dataPoint}
                </div>
              )}
              {insight.recommendation && (
                <div className="mt-3 p-2 bg-blue-50 rounded text-sm text-blue-800">
                  💡 {insight.recommendation}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Utility Components

function MetricCard({
  label,
  value,
  change,
  icon,
  highlight,
  changePositive
}: {
  label: string;
  value: string;
  change?: number;
  icon: string;
  highlight?: boolean;
  changePositive?: boolean;
}) {
  return (
    <div className={`p-4 rounded-lg ${highlight ? 'bg-green-50 border border-green-200' : 'bg-gray-50'}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl">{icon}</span>
        {change !== undefined && (
          <span className={`text-sm font-medium ${
            changePositive === undefined 
              ? (change > 0 ? 'text-green-600' : 'text-red-600')
              : (changePositive ? 'text-green-600' : 'text-red-600')
          }`}>
            {change > 0 ? '+' : ''}{change}%
          </span>
        )}
      </div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      <div className="text-sm text-gray-500">{label}</div>
    </div>
  );
}

interface MonthlyTrendData {
  month: string;
  year: number;
  applications: number;
  approvals: number;
  rejections: number;
}

function TrendChart({ data }: { data: MonthlyTrendData[] }) {
  const maxApps = Math.max(...data.map(d => d.applications));
  
  return (
    <div className="flex items-end gap-1 h-32">
      {data.map((month, index) => {
        const height = (month.applications / maxApps) * 100;
        const approvalHeight = (month.approvals / month.applications) * height;
        
        return (
          <div 
            key={`${month.month}-${month.year}`}
            className="flex-1 flex flex-col items-center gap-1"
            title={`${month.month} ${month.year}: ${month.applications} apps, ${month.approvals} approved`}
          >
            <div 
              className="w-full bg-gray-200 rounded-t relative"
              style={{ height: `${height}%` }}
            >
              <div 
                className="absolute bottom-0 left-0 right-0 bg-green-500 rounded-t"
                style={{ height: `${(approvalHeight / height) * 100}%` }}
              />
            </div>
            {index % 2 === 0 && (
              <span className="text-xs text-gray-400">{month.month.slice(0, 3)}</span>
            )}
          </div>
        );
      })}
    </div>
  );
}

function DashboardSkeleton({ compactMode }: { compactMode: boolean }) {
  return (
    <div className={`bg-white rounded-xl shadow-lg animate-pulse ${compactMode ? 'p-4' : 'p-6'}`}>
      <div className="h-8 bg-gray-200 rounded w-1/3 mb-6" />
      <div className={`grid ${compactMode ? 'grid-cols-2' : 'grid-cols-4'} gap-4 mb-6`}>
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-24 bg-gray-100 rounded-lg" />
        ))}
      </div>
      <div className="h-64 bg-gray-100 rounded-lg" />
    </div>
  );
}

export default PlanningDashboard;
