'use client';

/**
 * Retry Button Client Component
 *
 * A client-side button that reloads the page when clicked.
 * Used on the offline fallback page.
 */

export function RetryButton() {
  return (
    <button
      onClick={() => window.location.reload()}
      className="w-full py-3 px-6 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
    >
      Try Again
    </button>
  );
}
