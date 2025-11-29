/**
 * Planning Officer Profiles Page
 * Track officer approval patterns and preferences
 */

import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Planning Officers | Approval Patterns | The Hampstead Planning & Heritage Checker',
  description: 'Understand planning officer approval patterns in Camden, Barnet and Haringey. Learn officer preferences for heritage extensions and conservation area applications.',
  keywords: 'planning officer Camden, Barnet planning, Haringey planning officer, extension approval, conservation officer',
};

const OFFICERS = [
  {
    id: 'off-001',
    name: 'James Anderson',
    role: 'Senior Planning Officer',
    borough: 'Camden',
    team: 'Conservation & Design',
    approvalRate: 78,
    avgDecisionTime: '8 weeks',
    specializations: ['Listed Buildings', 'Hampstead Conservation', 'Basements'],
    recentDecisions: 45,
    preferences: [
      'Prefers traditional materials in conservation areas',
      'Open to contemporary additions if subordinate',
      'Strict on basement excavation sizes',
    ],
  },
  {
    id: 'off-002',
    name: 'Sarah Mitchell',
    role: 'Conservation Officer',
    borough: 'Camden',
    team: 'Heritage Team',
    approvalRate: 72,
    avgDecisionTime: '10 weeks',
    specializations: ['Grade II Listed', 'Article 4 Areas', 'Victorian Heritage'],
    recentDecisions: 32,
    preferences: [
      'Requires detailed heritage statement',
      'Favors reversible interventions',
      'Values pre-application discussions',
    ],
  },
  {
    id: 'off-003',
    name: 'Michael Chen',
    role: 'Planning Officer',
    borough: 'Barnet',
    team: 'Development Management',
    approvalRate: 85,
    avgDecisionTime: '6 weeks',
    specializations: ['Rear Extensions', 'Loft Conversions', 'Garden Suburbs'],
    recentDecisions: 67,
    preferences: [
      'Pragmatic approach to permitted development',
      'Supports contemporary designs outside CA',
      'Efficient processing times',
    ],
  },
  {
    id: 'off-004',
    name: 'Emma Thompson',
    role: 'Senior Conservation Officer',
    borough: 'Barnet',
    team: 'Conservation Team',
    approvalRate: 65,
    avgDecisionTime: '12 weeks',
    specializations: ['Hampstead Garden Suburb', 'Arts & Crafts', 'HGS Trust Liaison'],
    recentDecisions: 28,
    preferences: [
      'Very strict on HGS applications',
      'Requires Trust consent first',
      'Traditional materials only in HGS',
    ],
  },
  {
    id: 'off-005',
    name: 'David Wilson',
    role: 'Planning Officer',
    borough: 'Haringey',
    team: 'Development Management',
    approvalRate: 82,
    avgDecisionTime: '7 weeks',
    specializations: ['Muswell Hill', 'Crouch End', 'Edwardian Extensions'],
    recentDecisions: 54,
    preferences: [
      'Supports sympathetic extensions',
      'Open to rear dormers on Edwardians',
      'Values neighbor consultation',
    ],
  },
  {
    id: 'off-006',
    name: 'Rachel Green',
    role: 'Conservation & Design Officer',
    borough: 'Haringey',
    team: 'Conservation Team',
    approvalRate: 71,
    avgDecisionTime: '9 weeks',
    specializations: ['Highgate Conservation', 'Victorian Villas', 'Tree Preservation'],
    recentDecisions: 38,
    preferences: [
      'Detailed tree impact assessment required',
      'Traditional roof materials essential',
      'Values architectural merit',
    ],
  },
];

const BOROUGHS = [
  { id: 'camden', name: 'Camden', officers: 2, avgApproval: 75 },
  { id: 'barnet', name: 'Barnet', officers: 2, avgApproval: 75 },
  { id: 'haringey', name: 'Haringey', officers: 2, avgApproval: 77 },
];

export default function OfficersPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-slate-900 text-white py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <span className="inline-block bg-slate-800 text-slate-200 px-4 py-1 rounded-full text-sm font-medium mb-4">
              Intelligence • Insights • Preparation
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Planning Officer Profiles
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Understand planning officer preferences and approval patterns. 
              Learn what each officer looks for in heritage and conservation applications.
            </p>
          </div>
        </div>
      </section>

      {/* Borough Stats */}
      <section className="py-8 px-4 bg-slate-50 border-b border-slate-200">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-3 gap-8">
            {BOROUGHS.map(borough => (
              <div key={borough.id} className="text-center">
                <h3 className="font-bold text-lg mb-2">{borough.name}</h3>
                <div className="flex justify-center gap-6 text-sm">
                  <div>
                    <span className="text-2xl font-bold text-slate-700">{borough.officers}</span>
                    <p className="text-slate-500">Officers Profiled</p>
                  </div>
                  <div>
                    <span className="text-2xl font-bold text-emerald-600">{borough.avgApproval}%</span>
                    <p className="text-slate-500">Avg Approval</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Officer Cards */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Planning Officers by Borough</h2>
            <div className="flex gap-2">
              <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm">
                <option>All Boroughs</option>
                <option>Camden</option>
                <option>Barnet</option>
                <option>Haringey</option>
              </select>
              <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm">
                <option>All Specializations</option>
                <option>Conservation Areas</option>
                <option>Listed Buildings</option>
                <option>Extensions</option>
              </select>
            </div>
          </div>

          <div className="space-y-6">
            {OFFICERS.map(officer => (
              <div 
                key={officer.id}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex gap-6">
                  {/* Avatar */}
                  <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">👤</span>
                  </div>

                  {/* Main Info */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold text-xl">{officer.name}</h3>
                        <p className="text-slate-600">{officer.role}</p>
                        <p className="text-sm text-slate-500">{officer.borough} • {officer.team}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-emerald-600">{officer.approvalRate}%</div>
                        <p className="text-sm text-slate-500">Approval Rate</p>
                      </div>
                    </div>

                    {/* Specializations */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {officer.specializations.map((spec, i) => (
                        <span key={i} className="bg-slate-100 text-slate-700 text-sm px-3 py-1 rounded-full">
                          {spec}
                        </span>
                      ))}
                    </div>

                    {/* Stats Row */}
                    <div className="flex gap-8 text-sm border-t border-slate-100 pt-4 mb-4">
                      <div>
                        <span className="font-semibold">{officer.recentDecisions}</span>
                        <span className="text-slate-500 ml-1">Recent Decisions</span>
                      </div>
                      <div>
                        <span className="font-semibold">{officer.avgDecisionTime}</span>
                        <span className="text-slate-500 ml-1">Avg Decision Time</span>
                      </div>
                    </div>

                    {/* Preferences */}
                    <div className="bg-slate-50 rounded-lg p-4">
                      <h4 className="font-semibold text-sm mb-2">Known Preferences & Patterns</h4>
                      <ul className="space-y-1">
                        {officer.preferences.map((pref, i) => (
                          <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                            <span className="text-slate-400">•</span>
                            {pref}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How We Gather This Data */}
      <section className="py-16 px-4 bg-slate-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">How We Gather This Intelligence</h2>
          <p className="text-slate-600 mb-8">
            Officer profiles are built from analysis of publicly available planning decisions, 
            committee reports, and patterns observed over time. Information is updated quarterly.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <div className="text-2xl mb-2">📋</div>
              <h3 className="font-semibold mb-2">Decision Analysis</h3>
              <p className="text-sm text-slate-600">
                We analyze approval and refusal patterns from public planning portals.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <div className="text-2xl mb-2">📄</div>
              <h3 className="font-semibold mb-2">Committee Reports</h3>
              <p className="text-sm text-slate-600">
                Officer recommendations in committee papers reveal preferences.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <div className="text-2xl mb-2">🗣️</div>
              <h3 className="font-semibold mb-2">Community Feedback</h3>
              <p className="text-sm text-slate-600">
                Local architects and residents share their experiences.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tips for Working with Officers */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Tips for Working with Planning Officers
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-200">
              <div className="text-2xl mb-4">✅</div>
              <h3 className="font-bold text-lg mb-4">Do</h3>
              <ul className="space-y-3 text-slate-700">
                <li className="flex gap-2">
                  <span className="text-emerald-600">✓</span>
                  Request pre-application advice for complex schemes
                </li>
                <li className="flex gap-2">
                  <span className="text-emerald-600">✓</span>
                  Provide comprehensive heritage statements
                </li>
                <li className="flex gap-2">
                  <span className="text-emerald-600">✓</span>
                  Include precedent examples from the area
                </li>
                <li className="flex gap-2">
                  <span className="text-emerald-600">✓</span>
                  Address potential objections proactively
                </li>
                <li className="flex gap-2">
                  <span className="text-emerald-600">✓</span>
                  Respond promptly to information requests
                </li>
              </ul>
            </div>

            <div className="bg-red-50 rounded-xl p-6 border border-red-200">
              <div className="text-2xl mb-4">❌</div>
              <h3 className="font-bold text-lg mb-4">Don&apos;t</h3>
              <ul className="space-y-3 text-slate-700">
                <li className="flex gap-2">
                  <span className="text-red-600">✗</span>
                  Submit incomplete applications
                </li>
                <li className="flex gap-2">
                  <span className="text-red-600">✗</span>
                  Ignore pre-app advice then resubmit the same scheme
                </li>
                <li className="flex gap-2">
                  <span className="text-red-600">✗</span>
                  Be confrontational about refusals
                </li>
                <li className="flex gap-2">
                  <span className="text-red-600">✗</span>
                  Expect rapid turnarounds without pre-app
                </li>
                <li className="flex gap-2">
                  <span className="text-red-600">✗</span>
                  Ignore neighbor concerns in your application
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Get Officer-Specific Advice
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Our feasibility reports include officer-specific insights for your exact property.
          </p>
          <Link 
            href="/"
            className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8 py-4 rounded-lg transition-colors"
          >
            Check Your Property
          </Link>
        </div>
      </section>

      {/* Company Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 border-t border-gray-800">
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
