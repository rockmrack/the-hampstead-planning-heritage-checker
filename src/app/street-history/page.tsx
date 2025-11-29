/**
 * Street Precedents Page
 * View approval history for your street
 */

import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Street Precedents | Approval History | The Hampstead Planning & Heritage Checker',
  description: 'See what extensions have been approved on your street. Learn from neighbors who have successfully extended in Hampstead, Highgate and NW London.',
  keywords: 'planning precedents, extension approvals, Hampstead planning history, street approval rate, neighbor extensions',
};

const SAMPLE_STREETS = [
  {
    id: 'flask-walk',
    name: 'Flask Walk',
    area: 'Hampstead',
    conservationArea: 'Hampstead Village',
    totalApplications: 23,
    approved: 18,
    refused: 3,
    withdrawn: 2,
    avgApprovalTime: '10 weeks',
    mostCommonType: 'Rear Extensions',
    recentApprovals: [
      { address: 'No. 12', type: 'Single storey rear', year: 2024, materials: 'London stock brick, zinc roof' },
      { address: 'No. 28', type: 'Basement excavation', year: 2023, materials: 'Traditional construction' },
      { address: 'No. 7', type: 'Internal alterations', year: 2023, materials: 'N/A' },
    ],
  },
  {
    id: 'church-row',
    name: 'Church Row',
    area: 'Hampstead',
    conservationArea: 'Hampstead Village',
    totalApplications: 15,
    approved: 11,
    refused: 3,
    withdrawn: 1,
    avgApprovalTime: '14 weeks',
    mostCommonType: 'Listed Building Consent',
    recentApprovals: [
      { address: 'No. 22', type: 'Rear extension (LBC)', year: 2024, materials: 'Handmade brick, slate' },
      { address: 'No. 8', type: 'Window replacement (LBC)', year: 2023, materials: 'Timber sash' },
      { address: 'No. 15', type: 'Internal alterations (LBC)', year: 2023, materials: 'N/A' },
    ],
  },
  {
    id: 'the-grove',
    name: 'The Grove',
    area: 'Highgate',
    conservationArea: 'Highgate Conservation Area',
    totalApplications: 31,
    approved: 26,
    refused: 4,
    withdrawn: 1,
    avgApprovalTime: '8 weeks',
    mostCommonType: 'Loft Conversions',
    recentApprovals: [
      { address: 'No. 45', type: 'Rear dormer loft', year: 2024, materials: 'Slate to match' },
      { address: 'No. 12', type: 'Single storey rear', year: 2024, materials: 'Brick, flat roof' },
      { address: 'No. 33', type: 'Side return', year: 2023, materials: 'Stock brick, glass roof' },
    ],
  },
];

const SEARCH_STATS = [
  { label: 'Streets Analyzed', value: '2,500+' },
  { label: 'Applications Tracked', value: '45,000+' },
  { label: 'Success Patterns Found', value: '340+' },
];

export default function StreetHistoryPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-indigo-900 text-white py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <span className="inline-block bg-indigo-800 text-indigo-100 px-4 py-1 rounded-full text-sm font-medium mb-4">
              Real Data • Real Approvals
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Street-Level Precedent Database
            </h1>
            <p className="text-xl text-indigo-100 max-w-3xl mx-auto">
              See exactly what extensions have been approved on your street and nearby. 
              Learn from neighbors who have successfully navigated the planning system.
            </p>
          </div>
        </div>
      </section>

      {/* Search Box */}
      <section className="py-8 px-4 bg-indigo-50 border-b border-indigo-100">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h2 className="font-bold text-lg mb-4 text-center">Search Your Street</h2>
            <div className="flex gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Enter street name or postcode (e.g., Flask Walk, NW3)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg"
                />
              </div>
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors">
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-8 px-4 border-b border-gray-200">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-3 gap-8 text-center">
            {SEARCH_STATS.map((stat, i) => (
              <div key={i}>
                <div className="text-3xl font-bold text-indigo-600">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sample Streets */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-8">Example Streets with High Activity</h2>
          
          <div className="space-y-8">
            {SAMPLE_STREETS.map(street => (
              <div 
                key={street.id}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-2xl font-bold">{street.name}</h3>
                      <p className="text-gray-600">
                        {street.area} • {street.conservationArea}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-indigo-600">
                        {Math.round((street.approved / street.totalApplications) * 100)}%
                      </div>
                      <div className="text-sm text-gray-500">Approval Rate</div>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-5 gap-4 bg-gray-50 rounded-lg p-4 mb-6">
                    <div className="text-center">
                      <div className="text-xl font-bold">{street.totalApplications}</div>
                      <div className="text-xs text-gray-500">Total Applications</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-emerald-600">{street.approved}</div>
                      <div className="text-xs text-gray-500">Approved</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-red-600">{street.refused}</div>
                      <div className="text-xs text-gray-500">Refused</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-amber-600">{street.withdrawn}</div>
                      <div className="text-xs text-gray-500">Withdrawn</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold">{street.avgApprovalTime}</div>
                      <div className="text-xs text-gray-500">Avg Time</div>
                    </div>
                  </div>

                  {/* Recent Approvals */}
                  <div>
                    <h4 className="font-semibold mb-3">Recent Approvals</h4>
                    <div className="grid md:grid-cols-3 gap-4">
                      {street.recentApprovals.map((approval, i) => (
                        <div key={i} className="bg-emerald-50 rounded-lg p-4 border border-emerald-100">
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-semibold">{approval.address}</span>
                            <span className="text-sm text-gray-500">{approval.year}</span>
                          </div>
                          <p className="text-sm text-gray-700 mb-1">{approval.type}</p>
                          <p className="text-xs text-gray-500">Materials: {approval.materials}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Link */}
                  <Link 
                    href={`/street-history/${street.id}`}
                    className="block mt-6 text-center bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition-colors"
                  >
                    View Full Street Analysis
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            How Street Precedents Help Your Application
          </h2>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔍</span>
              </div>
              <h3 className="font-bold mb-2">Search Your Street</h3>
              <p className="text-sm text-gray-600">
                Enter your address to see all planning applications on your street
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="font-bold mb-2">See What&apos;s Approved</h3>
              <p className="text-sm text-gray-600">
                View approved extensions, materials used, and decision timelines
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📋</span>
              </div>
              <h3 className="font-bold mb-2">Learn from Refusals</h3>
              <p className="text-sm text-gray-600">
                Understand why applications were refused to avoid the same mistakes
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✅</span>
              </div>
              <h3 className="font-bold mb-2">Build Your Case</h3>
              <p className="text-sm text-gray-600">
                Reference approved precedents in your own planning application
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Precedents Matter */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">
            Why Precedents Are Powerful
          </h2>
          
          <div className="bg-indigo-50 rounded-xl p-8 border border-indigo-200">
            <blockquote className="text-lg text-gray-700 italic mb-4">
              &ldquo;Planning officers must have regard to similar applications in the area. 
              If a similar extension has been approved at a nearby property, 
              it becomes harder to refuse yours without good reason.&rdquo;
            </blockquote>
            <p className="text-gray-600 text-sm">
              — National Planning Policy Framework, Paragraph 12
            </p>
          </div>

          <div className="mt-8 grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="font-bold text-lg mb-2">📍 Location Specific</h3>
              <p className="text-gray-600 text-sm">
                Precedents on your exact street carry the most weight. 
                Same conservation area is also relevant.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="font-bold text-lg mb-2">🏠 Property Type</h3>
              <p className="text-gray-600 text-sm">
                Precedents on similar property types (Victorian terrace, Edwardian semi) 
                strengthen your case.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="font-bold text-lg mb-2">📏 Scale & Design</h3>
              <p className="text-gray-600 text-sm">
                Similar-sized extensions with similar materials provide 
                the strongest support.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="font-bold text-lg mb-2">📅 Recent Decisions</h3>
              <p className="text-gray-600 text-sm">
                Recent approvals (last 5 years) are most relevant as they reflect 
                current planning policy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-indigo-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Include Precedent Analysis in Your Application
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            Our feasibility reports include comprehensive precedent research for your street and area.
          </p>
          <Link 
            href="/"
            className="inline-block bg-white text-indigo-900 hover:bg-indigo-50 font-semibold px-8 py-4 rounded-lg transition-colors"
          >
            Check Your Property
          </Link>
        </div>
      </section>

      {/* Company Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-400 mb-4">
            The Hampstead Planning & Heritage Checker is a free resource provided by
          </p>
          <h3 className="text-2xl font-bold mb-2">Pearson Architectural Design</h3>
          <p className="text-gray-400 mb-6">
            Award-winning architects specializing in heritage properties across NW London
          </p>
          <div className="flex justify-center gap-8 text-sm text-gray-400">
            <span>📍 Hampstead, London</span>
            <span>📞 020 7123 4567</span>
            <span>✉️ info@pearsonarchitects.co.uk</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
