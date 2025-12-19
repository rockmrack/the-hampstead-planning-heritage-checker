/**
 * Property Status Card Component
 * Displays the heritage/planning status result with appropriate styling
 */

'use client';

import { motion } from 'framer-motion';
import {
  AlertTriangle,
  CheckCircle,
  Building2,
  TreeDeciduous,
  ExternalLink,
  Download,
  Phone,
  Info,
} from 'lucide-react';

import { STATUS_CONFIG, LISTED_GRADES, COMPANY_INFO } from '@/lib/config';
import { getExpertOpinion } from '@/services/property-check-utils';
import { cn } from '@/lib/utils/helpers';
import type { PropertyCheckResult, PropertyStatus } from '@/types';

interface StatusCardProps {
  result: PropertyCheckResult;
  onDownloadPDF?: () => void;
  onBookConsultation?: () => void;
  className?: string;
}

export default function StatusCard({
  result,
  onDownloadPDF,
  onBookConsultation,
  className,
}: StatusCardProps) {
  const config = STATUS_CONFIG[result.status];
  const expertOpinion = getExpertOpinion(result);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn('overflow-hidden', className)}
    >
      {/* Status Header */}
      <div
        className={cn(
          'p-6 border-l-4',
          result.status === 'RED' && 'bg-red-50 border-l-red-600',
          result.status === 'AMBER' && 'bg-amber-50 border-l-amber-500',
          result.status === 'GREEN' && 'bg-green-50 border-l-green-600'
        )}
      >
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div
            className={cn(
              'w-16 h-16 rounded-full flex items-center justify-center text-3xl flex-shrink-0',
              result.status === 'RED' && 'bg-red-100',
              result.status === 'AMBER' && 'bg-amber-100',
              result.status === 'GREEN' && 'bg-green-100'
            )}
          >
            {config.icon}
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={cn(
                  'badge',
                  result.status === 'RED' && 'badge-red',
                  result.status === 'AMBER' && 'badge-amber',
                  result.status === 'GREEN' && 'badge-green'
                )}
              >
                {config.label}
              </span>

              {result.status === 'RED' && result.listedBuilding && (
                <span className="badge bg-gray-100 text-gray-800 border border-gray-200">
                  {LISTED_GRADES[result.listedBuilding.grade].label}
                </span>
              )}

              {result.hasArticle4 && (
                <span className="badge bg-purple-100 text-purple-800 border border-purple-200">
                  Article 4 Direction
                </span>
              )}
            </div>

            <h2 className="text-xl font-bold mt-2 text-gray-900">
              {result.status === 'AMBER' && result.conservationArea
                ? `Located in ${result.conservationArea.name} Conservation Area`
                : config.headline}
            </h2>

            {/* Warning/Opportunity Message */}
            <p
              className={cn(
                'mt-2 text-sm',
                result.status === 'RED' && 'text-red-700',
                result.status === 'AMBER' && 'text-amber-700',
                result.status === 'GREEN' && 'text-green-700'
              )}
            >
              {result.status === 'GREEN'
                ? (config as typeof STATUS_CONFIG.GREEN).opportunity
                : (config as typeof STATUS_CONFIG.RED | typeof STATUS_CONFIG.AMBER).warning}
            </p>
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="p-6 bg-white border-t border-gray-100">
        {/* Listed Building Details */}
        {result.status === 'RED' && result.listedBuilding && (
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-3">
              <Building2 className="w-5 h-5 text-red-600" />
              Listed Building Details
            </h3>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-gray-500">Name</dt>
                <dd className="font-medium text-gray-900">
                  {result.listedBuilding.name}
                </dd>
              </div>
              <div>
                <dt className="text-gray-500">Grade</dt>
                <dd className="font-medium text-gray-900">
                  {LISTED_GRADES[result.listedBuilding.grade].label}
                  <span className="text-gray-500 font-normal ml-1">
                    ({LISTED_GRADES[result.listedBuilding.grade].description})
                  </span>
                </dd>
              </div>
              <div>
                <dt className="text-gray-500">List Entry Number</dt>
                <dd className="font-medium text-gray-900">
                  {result.listedBuilding.listEntryNumber}
                </dd>
              </div>
              {result.listedBuilding.hyperlink && (
                <div>
                  <dt className="text-gray-500">Official Record</dt>
                  <dd>
                    <a
                      href={result.listedBuilding.hyperlink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#D4AF37] hover:underline inline-flex items-center gap-1"
                    >
                      View on Historic England
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </dd>
                </div>
              )}
            </dl>
          </div>
        )}

        {/* Conservation Area Details */}
        {result.conservationArea && (
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-3">
              <TreeDeciduous className="w-5 h-5 text-amber-600" />
              Conservation Area Details
            </h3>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-gray-500">Area Name</dt>
                <dd className="font-medium text-gray-900">
                  {result.conservationArea.name}
                </dd>
              </div>
              <div>
                <dt className="text-gray-500">Borough</dt>
                <dd className="font-medium text-gray-900">
                  {result.conservationArea.borough}
                </dd>
              </div>
              <div>
                <dt className="text-gray-500">Article 4 Direction</dt>
                <dd className="font-medium text-gray-900">
                  {result.hasArticle4 ? (
                    <span className="text-red-600">Yes - Additional restrictions apply</span>
                  ) : (
                    'No'
                  )}
                </dd>
              </div>
              {result.hasArticle4 && result.article4Details && (
                <div className="sm:col-span-2">
                  <dt className="text-gray-500">Article 4 Restrictions</dt>
                  <dd className="font-medium text-gray-900">
                    {result.article4Details}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        )}

        {/* Expert Opinion */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-2">
            <Info className="w-5 h-5 text-[#D4AF37]" />
            Expert Assessment
          </h3>
          <p className="text-sm text-gray-700 italic">{expertOpinion}</p>
        </div>

        {/* Property Info */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-2">Property Searched</h3>
          <p className="text-sm text-gray-700">{result.address}</p>
          {result.postcode && (
            <p className="text-sm text-gray-500 mt-1">
              Postcode: {result.postcode}
              {result.borough && ` • ${result.borough}`}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          {onDownloadPDF && (
            <button
              onClick={onDownloadPDF}
              className="btn-outline flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              Download Full Report
            </button>
          )}
          {onBookConsultation && (
            <button
              onClick={onBookConsultation}
              className="btn-primary flex items-center justify-center gap-2"
            >
              <Phone className="w-5 h-5" />
              {config.cta}
            </button>
          )}
        </div>

        {/* Disclaimer */}
        <p className="mt-6 text-xs text-gray-500">
          This report is for informational purposes only and does not constitute legal or planning advice.
          Always consult with your local planning authority before starting any work.
        </p>
      </div>
    </motion.div>
  );
}

// Named export for compatibility with tests
export { StatusCard };
