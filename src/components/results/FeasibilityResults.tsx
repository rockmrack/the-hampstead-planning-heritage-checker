'use client';

import { useState, useMemo } from 'react';
import { 
  FeasibilityReport, 
  assessFeasibility,
  PropertyContext,
  ProjectSpecification 
} from '@/lib/services/feasibility-engine';
import { ProjectType } from '@/lib/config/project-types';

interface FeasibilityResultsProps {
  report: FeasibilityReport;
  onGetStarted?: () => void;
  onFindProfessional?: () => void;
}

export default function FeasibilityResults({
  report,
  onGetStarted,
  onFindProfessional,
}: FeasibilityResultsProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>('summary');

  const getStatusBadge = () => {
    if (report.permissionRequired === 'none') {
      return {
        text: 'Permitted Development',
        color: 'bg-green-100 text-green-800 border-green-200',
        icon: '✅',
      };
    }
    if (report.permissionRequired === 'prior-approval') {
      return {
        text: 'Prior Approval Required',
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: '📋',
      };
    }
    if (report.permissionRequired === 'listed-building-consent') {
      return {
        text: 'Listed Building Consent Required',
        color: 'bg-amber-100 text-amber-800 border-amber-200',
        icon: '🏛️',
      };
    }
    return {
      text: 'Planning Permission Required',
      color: 'bg-amber-100 text-amber-800 border-amber-200',
      icon: '📄',
    };
  };

  const statusBadge = getStatusBadge();

  const getApprovalColor = (probability: number): string => {
    if (probability >= 75) return 'text-green-600';
    if (probability >= 50) return 'text-amber-600';
    return 'text-red-600';
  };

  const getApprovalBgColor = (probability: number): string => {
    if (probability >= 75) return 'bg-green-500';
    if (probability >= 50) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      {/* Main Status Card */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-start justify-between">
            <div>
              <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border ${statusBadge.color}`}>
                <span className="mr-2">{statusBadge.icon}</span>
                {statusBadge.text}
              </span>
              <h2 className="text-2xl font-bold text-gray-900 mt-4">
                {report.projectAllowed ? 'You can do this!' : 'This may be challenging'}
              </h2>
              <p className="text-gray-600 mt-2">{report.summary}</p>
            </div>
          </div>
        </div>

        {/* Approval Prediction */}
        {report.approvalPrediction && (
          <div className="p-6 bg-gray-50 border-b border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Approval Chance</h3>
              <span className={`text-3xl font-bold ${getApprovalColor(report.approvalPrediction.approvalProbability)}`}>
                {report.approvalPrediction.approvalProbability}%
              </span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${getApprovalBgColor(report.approvalPrediction.approvalProbability)}`}
                style={{ width: `${report.approvalPrediction.approvalProbability}%` }}
              />
            </div>
            
            <p className="text-sm text-gray-500 mt-2">
              Based on similar applications in your area • 
              Confidence: {report.approvalPrediction.confidenceLevel}
            </p>
          </div>
        )}

        {/* Timeline and Fees */}
        <div className="grid grid-cols-2 divide-x divide-gray-100">
          <div className="p-6">
            <div className="text-sm text-gray-500 mb-1">Estimated Timeline</div>
            <div className="text-xl font-semibold text-gray-900">{report.estimatedTimeline}</div>
          </div>
          <div className="p-6">
            <div className="text-sm text-gray-500 mb-1">Estimated Fees</div>
            <div className="text-xl font-semibold text-gray-900">
              £{report.estimatedFees.total.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Risk Factors */}
      {report.approvalPrediction?.riskFactors && report.approvalPrediction.riskFactors.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-4">⚠️ Risk Factors</h3>
          <div className="space-y-3">
            {report.approvalPrediction.riskFactors.map((risk, index) => (
              <div
                key={index}
                className={`p-4 rounded-xl border ${
                  risk.impact === 'high'
                    ? 'bg-red-50 border-red-200'
                    : risk.impact === 'medium'
                    ? 'bg-amber-50 border-amber-200'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-medium text-gray-900">{risk.factor}</div>
                    <div className="text-sm text-gray-600 mt-1">{risk.description}</div>
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded ${
                    risk.impact === 'high'
                      ? 'bg-red-100 text-red-700'
                      : risk.impact === 'medium'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {risk.impact} impact
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Improvement Suggestions */}
      {report.approvalPrediction?.improvementSuggestions && report.approvalPrediction.improvementSuggestions.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-4">💡 How to Improve Your Chances</h3>
          <div className="space-y-3">
            {report.approvalPrediction.improvementSuggestions.map((suggestion, index) => (
              <div
                key={index}
                className="p-4 rounded-xl bg-green-50 border border-green-200"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-medium text-gray-900">{suggestion.action}</div>
                    <div className="text-sm text-gray-600 mt-1">{suggestion.description}</div>
                  </div>
                  <span className="text-green-600 font-semibold whitespace-nowrap ml-4">
                    +{suggestion.impactOnApproval}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Required Documents */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="font-semibold text-gray-900 mb-4">📋 Required Documents</h3>
        <div className="space-y-2">
          {report.requiredDocuments
            .filter((doc) => doc.required)
            .map((doc, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center">
                  <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm mr-3">
                    {index + 1}
                  </span>
                  <div>
                    <div className="font-medium text-gray-900">{doc.name}</div>
                    <div className="text-sm text-gray-500">{doc.description}</div>
                  </div>
                </div>
                {doc.estimatedCost && (
                  <span className="text-sm text-gray-500">{doc.estimatedCost}</span>
                )}
              </div>
            ))}
        </div>
      </div>

      {/* Recommended Actions */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="font-semibold text-gray-900 mb-4">🎯 Recommended Next Steps</h3>
        <div className="space-y-3">
          {report.recommendedActions.slice(0, 4).map((action, index) => (
            <div
              key={index}
              className="flex items-start p-4 rounded-xl bg-gray-50"
            >
              <span className={`
                w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium mr-4
                ${action.priority === 'high' ? 'bg-red-500' : action.priority === 'medium' ? 'bg-amber-500' : 'bg-gray-400'}
              `}>
                {index + 1}
              </span>
              <div className="flex-1">
                <div className="font-medium text-gray-900">{action.action}</div>
                <div className="text-sm text-gray-600 mt-1">{action.reason}</div>
                <div className="flex gap-4 mt-2 text-sm text-gray-500">
                  {action.estimatedCost && <span>💰 {action.estimatedCost}</span>}
                  {action.timeline && <span>⏱️ {action.timeline}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Warnings and Opportunities */}
      {(report.warnings.length > 0 || report.opportunities.length > 0) && (
        <div className="grid md:grid-cols-2 gap-4">
          {report.warnings.length > 0 && (
            <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200">
              <h3 className="font-semibold text-amber-800 mb-3">⚠️ Things to Watch</h3>
              <ul className="space-y-2">
                {report.warnings.map((warning, index) => (
                  <li key={index} className="text-sm text-amber-700">
                    • {warning}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {report.opportunities.length > 0 && (
            <div className="bg-green-50 rounded-2xl p-6 border border-green-200">
              <h3 className="font-semibold text-green-800 mb-3">✨ Opportunities</h3>
              <ul className="space-y-2">
                {report.opportunities.map((opp, index) => (
                  <li key={index} className="text-sm text-green-700">
                    • {opp}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* CTA Buttons */}
      <div className="flex gap-4">
        <button
          onClick={onGetStarted}
          className="flex-1 bg-blue-600 text-white py-4 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
        >
          Start Application
        </button>
        <button
          onClick={onFindProfessional}
          className="flex-1 bg-white text-gray-700 py-4 px-6 rounded-xl font-semibold border-2 border-gray-200 hover:border-gray-300 transition-colors"
        >
          Find a Professional
        </button>
      </div>
    </div>
  );
}
