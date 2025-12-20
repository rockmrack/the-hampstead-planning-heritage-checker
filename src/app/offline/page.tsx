/**
 * Offline Fallback Page
 * 
 * Displayed when user is offline and the requested page
 * is not available in the cache.
 */

import Link from 'next/link';
import { RetryButton } from '@/components/offline/RetryButton';

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* Offline Icon */}
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto bg-slate-100 rounded-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414"
              />
            </svg>
          </div>
        </div>

        {/* Message */}
        <h1 className="text-2xl font-bold text-slate-900 mb-4">
          You&apos;re Offline
        </h1>
        
        <p className="text-slate-600 mb-8">
          It looks like you&apos;ve lost your internet connection. 
          Some features are still available offline.
        </p>

        {/* Available Features */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8 text-left">
          <h2 className="font-semibold text-slate-900 mb-4">
            Available Offline:
          </h2>
          
          <ul className="space-y-3">
            <li className="flex items-center text-slate-700">
              <svg
                className="w-5 h-5 mr-3 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              View cached property results
            </li>
            <li className="flex items-center text-slate-700">
              <svg
                className="w-5 h-5 mr-3 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Read saved planning guides
            </li>
            <li className="flex items-center text-slate-700">
              <svg
                className="w-5 h-5 mr-3 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Access conservation area info
            </li>
            <li className="flex items-center text-slate-700">
              <svg
                className="w-5 h-5 mr-3 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Use cost calculator
            </li>
          </ul>
        </div>

        {/* Unavailable Features */}
        <div className="bg-slate-50 rounded-xl p-6 mb-8 text-left">
          <h2 className="font-semibold text-slate-900 mb-4">
            Requires Connection:
          </h2>
          
          <ul className="space-y-3">
            <li className="flex items-center text-slate-500">
              <svg
                className="w-5 h-5 mr-3 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              New property checks
            </li>
            <li className="flex items-center text-slate-500">
              <svg
                className="w-5 h-5 mr-3 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              Live planning copilot
            </li>
            <li className="flex items-center text-slate-500">
              <svg
                className="w-5 h-5 mr-3 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              Search professionals
            </li>
          </ul>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <RetryButton />

          <Link
            href="/"
            className="block w-full py-3 px-6 bg-white text-slate-700 rounded-lg font-medium border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            Go to Homepage
          </Link>
        </div>

        {/* Status Indicator */}
        <div className="mt-8 text-sm text-slate-500">
          <p>
            Your data will automatically sync when you&apos;re back online.
          </p>
        </div>
      </div>
    </div>
  );
}
