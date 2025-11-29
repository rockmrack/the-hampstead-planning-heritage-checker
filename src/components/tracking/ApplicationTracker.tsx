'use client';

import { useState, useEffect } from 'react';
import {
  TrackedApplication,
  ApplicationStatus,
  STATUS_CONFIG,
  getStatusProgress,
} from '@/lib/services/application-tracking';

interface ApplicationTrackerProps {
  applications: TrackedApplication[];
  onViewApplication?: (application: TrackedApplication) => void;
}

export default function ApplicationTracker({
  applications,
  onViewApplication,
}: ApplicationTrackerProps) {
  const [filter, setFilter] = useState<'all' | 'active' | 'decided'>('all');
  const [sortBy, setSortBy] = useState<'updated' | 'submitted' | 'decision'>('updated');

  const filteredApplications = applications
    .filter((app) => {
      if (filter === 'all') return true;
      if (filter === 'active') return !['decided', 'withdrawn', 'lapsed'].includes(app.status);
      if (filter === 'decided') return ['decided', 'withdrawn', 'lapsed'].includes(app.status);
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'updated') {
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }
      if (sortBy === 'submitted' && a.submittedDate && b.submittedDate) {
        return new Date(b.submittedDate).getTime() - new Date(a.submittedDate).getTime();
      }
      if (sortBy === 'decision' && a.targetDate && b.targetDate) {
        return new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime();
      }
      return 0;
    });

  const getStatusColor = (status: ApplicationStatus): string => {
    const statusInfo = STATUS_CONFIG[status];
    const colorMap: Record<string, string> = {
      gray: 'bg-gray-100 text-gray-700',
      blue: 'bg-blue-100 text-blue-700',
      green: 'bg-green-100 text-green-700',
      amber: 'bg-amber-100 text-amber-700',
      purple: 'bg-purple-100 text-purple-700',
      red: 'bg-red-100 text-red-700',
    };
    return colorMap[statusInfo.color] || 'bg-gray-100 text-gray-700';
  };

  const getDecisionBadge = (decision?: string) => {
    if (!decision) return null;
    
    const badges: Record<string, { text: string; className: string }> = {
      'approved': { text: 'Approved', className: 'bg-green-500 text-white' },
      'approved-with-conditions': { text: 'Approved*', className: 'bg-green-500 text-white' },
      'refused': { text: 'Refused', className: 'bg-red-500 text-white' },
      'withdrawn': { text: 'Withdrawn', className: 'bg-gray-500 text-white' },
      'permitted-development': { text: 'PD Confirmed', className: 'bg-blue-500 text-white' },
    };
    
    const badge = badges[decision];
    if (!badge) return null;
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${badge.className}`}>
        {badge.text}
      </span>
    );
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const getTimeRemaining = (targetDate?: string) => {
    if (!targetDate) return null;
    
    const target = new Date(targetDate);
    const now = new Date();
    const diffDays = Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return { text: `${Math.abs(diffDays)} days overdue`, urgent: true };
    }
    if (diffDays <= 7) {
      return { text: `${diffDays} days remaining`, urgent: true };
    }
    if (diffDays <= 14) {
      return { text: `${diffDays} days remaining`, urgent: false };
    }
    return { text: `${Math.ceil(diffDays / 7)} weeks remaining`, urgent: false };
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Your Applications</h2>
          <p className="text-gray-600 mt-1">
            Track the progress of your planning applications
          </p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
          + New Application
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-gray-900">{applications.length}</div>
          <div className="text-sm text-gray-500">Total Applications</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-blue-600">
            {applications.filter(a => !['decided', 'withdrawn', 'lapsed'].includes(a.status)).length}
          </div>
          <div className="text-sm text-gray-500">In Progress</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-green-600">
            {applications.filter(a => a.decision === 'approved' || a.decision === 'approved-with-conditions').length}
          </div>
          <div className="text-sm text-gray-500">Approved</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-amber-600">
            {applications.filter(a => {
              const remaining = getTimeRemaining(a.targetDate);
              return remaining?.urgent;
            }).length}
          </div>
          <div className="text-sm text-gray-500">Need Attention</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2">
          {[
            { value: 'all', label: 'All' },
            { value: 'active', label: 'Active' },
            { value: 'decided', label: 'Decided' },
          ].map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value as typeof filter)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === f.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white"
        >
          <option value="updated">Last Updated</option>
          <option value="submitted">Date Submitted</option>
          <option value="decision">Decision Due</option>
        </select>
      </div>

      {/* Application List */}
      <div className="space-y-4">
        {filteredApplications.map((app) => {
          const statusInfo = STATUS_CONFIG[app.status];
          const progress = getStatusProgress(app.status);
          const timeRemaining = getTimeRemaining(app.targetDate);

          return (
            <div
              key={app.id}
              className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-100 cursor-pointer"
              onClick={() => onViewApplication?.(app)}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {app.reference}
                    </h3>
                    {app.councilReference && (
                      <span className="text-sm text-gray-500">
                        (Council: {app.councilReference})
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 mt-1">{app.propertyAddress}</p>
                </div>
                <div className="flex items-center gap-2">
                  {app.decision ? (
                    getDecisionBadge(app.decision)
                  ) : (
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                      {statusInfo.icon} {statusInfo.label}
                    </span>
                  )}
                </div>
              </div>

              {/* Project Type */}
              <p className="text-gray-700 mb-4">{app.description}</p>

              {/* Progress Bar */}
              {!app.decision && (
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-600">{statusInfo.description}</span>
                    <span className="text-gray-500">{progress}% complete</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Timeline */}
              <div className="flex items-center gap-6 text-sm text-gray-500">
                {app.submittedDate && (
                  <div>
                    <span className="font-medium">Submitted:</span>{' '}
                    {formatDate(app.submittedDate)}
                  </div>
                )}
                {app.validatedDate && (
                  <div>
                    <span className="font-medium">Validated:</span>{' '}
                    {formatDate(app.validatedDate)}
                  </div>
                )}
                {app.targetDate && !app.decision && (
                  <div className={timeRemaining?.urgent ? 'text-red-600 font-medium' : ''}>
                    <span className="font-medium">Decision due:</span>{' '}
                    {formatDate(app.targetDate)}
                    {timeRemaining && (
                      <span className="ml-1">({timeRemaining.text})</span>
                    )}
                  </div>
                )}
                {app.decisionDate && (
                  <div>
                    <span className="font-medium">Decided:</span>{' '}
                    {formatDate(app.decisionDate)}
                  </div>
                )}
              </div>

              {/* Alerts */}
              {app.alerts.filter(a => !a.readAt).length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-amber-600">
                    <span>🔔</span>
                    <span className="text-sm font-medium">
                      {app.alerts.filter(a => !a.readAt).length} new notification{app.alerts.filter(a => !a.readAt).length > 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              )}

              {/* Comments Summary */}
              {app.publicComments.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-4 text-sm">
                  <span className="text-gray-500">
                    💬 {app.publicComments.length} comment{app.publicComments.length > 1 ? 's' : ''}
                  </span>
                  <span className="text-green-600">
                    {app.publicComments.filter(c => c.sentiment === 'support').length} support
                  </span>
                  <span className="text-red-600">
                    {app.publicComments.filter(c => c.sentiment === 'object').length} objections
                  </span>
                </div>
              )}
            </div>
          );
        })}

        {filteredApplications.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-2xl">
            <div className="text-4xl mb-4">📋</div>
            <p className="text-gray-500 text-lg">No applications found</p>
            <p className="text-gray-400 mt-2">Start a new application to begin tracking</p>
            <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
              Start Application
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
