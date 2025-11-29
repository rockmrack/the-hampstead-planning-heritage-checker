'use client';

import { useState } from 'react';
import {
  PlanningAlert,
  AlertSubscription,
  ImpactAssessment,
  planningAlertService,
} from '@/lib/services/planning-alerts';

interface PlanningAlertsProps {
  alerts: PlanningAlert[];
  subscriptions: AlertSubscription[];
  onMarkAsRead?: (alertId: string) => void;
  onDismiss?: (alertId: string) => void;
  onSubscribe?: () => void;
}

export default function PlanningAlerts({
  alerts,
  subscriptions,
  onMarkAsRead,
  onDismiss,
  onSubscribe,
}: PlanningAlertsProps) {
  const [showAll, setShowAll] = useState(false);
  const [filterImpact, setFilterImpact] = useState<'all' | 'high' | 'medium'>('all');

  const filteredAlerts = alerts
    .filter((alert) => !alert.dismissed)
    .filter((alert) => {
      if (filterImpact === 'all') return true;
      return alert.potentialImpact?.level === filterImpact;
    })
    .slice(0, showAll ? undefined : 5);

  const unreadCount = alerts.filter((a) => !a.read && !a.dismissed).length;
  const highImpactCount = alerts.filter((a) => a.potentialImpact?.level === 'high' && !a.dismissed).length;

  const getImpactBadge = (impact?: ImpactAssessment) => {
    if (!impact) return null;

    const badges: Record<ImpactAssessment['level'], { text: string; className: string }> = {
      high: { text: 'High Impact', className: 'bg-red-100 text-red-700 border-red-200' },
      medium: { text: 'Medium Impact', className: 'bg-amber-100 text-amber-700 border-amber-200' },
      low: { text: 'Low Impact', className: 'bg-blue-100 text-blue-700 border-blue-200' },
      minimal: { text: 'Minimal Impact', className: 'bg-gray-100 text-gray-600 border-gray-200' },
    };

    const badge = badges[impact.level];
    return (
      <span className={`px-2 py-1 rounded text-xs font-medium border ${badge.className}`}>
        {badge.text}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  };

  const formatDeadline = (dateString?: string) => {
    if (!dateString) return null;
    
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { text: 'Deadline passed', urgent: true };
    if (diffDays === 0) return { text: 'Due today', urgent: true };
    if (diffDays === 1) return { text: 'Due tomorrow', urgent: true };
    if (diffDays <= 7) return { text: `${diffDays} days left to respond`, urgent: true };
    return { text: `Deadline: ${date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`, urgent: false };
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            Planning Alerts
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-sm px-2 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </h2>
          <p className="text-gray-600 mt-1">
            Nearby planning applications that may affect you
          </p>
        </div>
        <button
          onClick={onSubscribe}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Manage Alerts
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-gray-900">{alerts.length}</div>
          <div className="text-sm text-gray-500">Total Alerts</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-red-600">{highImpactCount}</div>
          <div className="text-sm text-gray-500">High Impact</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-blue-600">{subscriptions.filter(s => s.active).length}</div>
          <div className="text-sm text-gray-500">Active Subscriptions</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-4">
        {[
          { value: 'all', label: 'All' },
          { value: 'high', label: '🔴 High Impact' },
          { value: 'medium', label: '🟡 Medium Impact' },
        ].map((f) => (
          <button
            key={f.value}
            onClick={() => setFilterImpact(f.value as typeof filterImpact)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterImpact === f.value
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Alert List */}
      <div className="space-y-4">
        {filteredAlerts.map((alert) => {
          const deadline = formatDeadline(alert.consultationDeadline);

          return (
            <div
              key={alert.id}
              className={`bg-white rounded-2xl shadow-sm hover:shadow-md transition-all p-5 border ${
                !alert.read ? 'border-blue-200 bg-blue-50/30' : 'border-gray-100'
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  {getImpactBadge(alert.potentialImpact)}
                  <span className="text-sm text-gray-500">
                    {formatDate(alert.createdAt)}
                  </span>
                  {!alert.read && (
                    <span className="w-2 h-2 bg-blue-500 rounded-full" />
                  )}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDismiss?.(alert.id);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              {/* Content */}
              <h3 className="font-semibold text-gray-900 mb-1">
                {alert.address}
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-medium">{alert.applicationType}</span>
                {' - '}
                {alert.description.length > 100
                  ? `${alert.description.slice(0, 100)}...`
                  : alert.description
                }
              </p>

              {/* Distance */}
              {alert.distanceMeters && (
                <p className="text-sm text-gray-500 mb-3">
                  📍 {Math.round(alert.distanceMeters)}m from your property
                </p>
              )}

              {/* Impact Factors */}
              {alert.potentialImpact && alert.potentialImpact.factors.length > 0 && (
                <div className="mb-3">
                  <div className="flex flex-wrap gap-2">
                    {alert.potentialImpact.factors.map((factor, index) => (
                      <span
                        key={index}
                        className={`px-2 py-1 rounded text-xs ${
                          factor.severity === 'high'
                            ? 'bg-red-50 text-red-700'
                            : factor.severity === 'medium'
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-gray-50 text-gray-600'
                        }`}
                      >
                        {factor.type.replace('-', ' ')}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendation */}
              {alert.potentialImpact?.recommendation && (
                <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700 mb-3">
                  💡 {alert.potentialImpact.recommendation}
                </div>
              )}

              {/* Deadline Warning */}
              {deadline && (
                <div className={`text-sm font-medium ${deadline.urgent ? 'text-red-600' : 'text-gray-500'}`}>
                  ⏰ {deadline.text}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 mt-4 pt-4 border-t border-gray-100">
                <button
                  onClick={() => {
                    onMarkAsRead?.(alert.id);
                    if (alert.applicationUrl) {
                      window.open(alert.applicationUrl, '_blank');
                    }
                  }}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm"
                >
                  View Application
                </button>
                <button className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm">
                  View on Map
                </button>
              </div>
            </div>
          );
        })}

        {filteredAlerts.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-2xl">
            <div className="text-4xl mb-4">🔔</div>
            <p className="text-gray-500 text-lg">No alerts to show</p>
            <p className="text-gray-400 mt-2">
              Set up alerts to get notified about nearby applications
            </p>
            <button
              onClick={onSubscribe}
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Set Up Alerts
            </button>
          </div>
        )}
      </div>

      {/* Show More */}
      {alerts.filter((a) => !a.dismissed).length > 5 && !showAll && (
        <button
          onClick={() => setShowAll(true)}
          className="w-full mt-4 py-3 text-blue-600 font-medium hover:bg-blue-50 rounded-lg transition-colors"
        >
          Show all {alerts.filter((a) => !a.dismissed).length} alerts
        </button>
      )}

      {/* Subscriptions Summary */}
      {subscriptions.length > 0 && (
        <div className="mt-8 p-6 bg-gray-50 rounded-2xl">
          <h3 className="font-semibold text-gray-900 mb-4">Your Alert Subscriptions</h3>
          <div className="space-y-3">
            {subscriptions.map((sub) => (
              <div
                key={sub.id}
                className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200"
              >
                <div className="flex items-center gap-3">
                  <span className={`w-2 h-2 rounded-full ${sub.active ? 'bg-green-500' : 'bg-gray-300'}`} />
                  <div>
                    <div className="font-medium text-gray-900">
                      {sub.type.replace('-', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                    </div>
                    <div className="text-sm text-gray-500">
                      {sub.location
                        ? `Within ${sub.location.radiusMeters}m`
                        : sub.borough || sub.postcode}
                      {' • '}
                      {sub.frequency}
                    </div>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
