/**
 * Protected Views Monitor Page
 * Track protected views and view corridors affecting development
 */

import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Protected Views | London View Corridors | The Hampstead Planning & Heritage Checker',
  description: 'Check if protected views from Parliament Hill, Primrose Hill or other viewpoints affect your property. Understand London View Management Framework implications.',
  keywords: 'protected views London, view corridors Hampstead, Parliament Hill views, LVMF, view protection London',
};

const PROTECTED_VIEWPOINTS = [
  {
    id: 'parliament-hill',
    name: 'Parliament Hill',
    location: 'Hampstead Heath',
    protectedViews: 3,
    description: 'One of London\'s most protected viewpoints with views to St Paul\'s, Westminster and the City.',
    affectedAreas: ['Gospel Oak', 'Tufnell Park', 'Kentish Town', 'Camden'],
    restrictions: 'Buildings must not exceed defined height thresholds within view corridors.',
    status: 'LVMF Protected',
  },
  {
    id: 'primrose-hill',
    name: 'Primrose Hill Summit',
    location: 'Primrose Hill',
    protectedViews: 2,
    description: 'Strategic view of the Central London skyline from the summit.',
    affectedAreas: ['Primrose Hill', 'Chalk Farm', 'Camden Town', 'St John\'s Wood'],
    restrictions: 'Height restrictions apply to maintain silhouette of protected landmarks.',
    status: 'LVMF Protected',
  },
  {
    id: 'kenwood',
    name: 'Kenwood House',
    location: 'Hampstead Heath',
    protectedViews: 1,
    description: 'Historic view from Kenwood terrace across the heath toward London.',
    affectedAreas: ['Highgate', 'Hampstead', 'Gospel Oak'],
    restrictions: 'Development must preserve the historic setting and views.',
    status: 'Locally Protected',
  },
  {
    id: 'ally-pally',
    name: 'Alexandra Palace',
    location: 'Wood Green',
    protectedViews: 4,
    description: 'Panoramic views across London from the Palace terrace.',
    affectedAreas: ['Muswell Hill', 'Crouch End', 'Hornsey', 'Wood Green'],
    restrictions: 'LVMF protected viewing corridor toward Central London landmarks.',
    status: 'LVMF Protected',
  },
  {
    id: 'hampstead-heath-extension',
    name: 'Hampstead Heath Extension',
    location: 'North End',
    protectedViews: 2,
    description: 'Views across the heath extension toward Kenwood and the city.',
    affectedAreas: ['Hampstead Garden Suburb', 'North End', 'Golders Green'],
    restrictions: 'Local plan policies protect these landscape views.',
    status: 'Locally Protected',
  },
];

const VIEW_IMPACTS = [
  {
    type: 'Full Planning Required',
    description: 'Any development within primary view corridors',
    severity: 'high',
  },
  {
    type: 'Height Assessment',
    description: 'Development between wider setting consultation areas',
    severity: 'medium',
  },
  {
    type: 'Minimal Impact',
    description: 'Outside view corridors but within assessment zones',
    severity: 'low',
  },
];

export default function ViewsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-blue-900 text-white py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <span className="inline-block bg-blue-800 text-blue-100 px-4 py-1 rounded-full text-sm font-medium mb-4">
              LVMF & Local View Protection
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Protected Views Monitor
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Check if protected view corridors from Parliament Hill, Primrose Hill or other 
              viewpoints affect your development. Understand height restrictions before you plan.
            </p>
          </div>
        </div>
      </section>

      {/* Check Your Property */}
      <section className="py-8 px-4 bg-blue-50 border-b border-blue-100">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h2 className="font-bold text-lg mb-4 text-center">Check Your Property</h2>
            <div className="flex gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Enter your postcode (e.g., NW3 1QA)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg"
                />
              </div>
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors">
                Check Views
              </button>
            </div>
            <p className="text-sm text-gray-500 text-center mt-4">
              We&apos;ll check LVMF protected views and locally designated viewpoints affecting your area.
            </p>
          </div>
        </div>
      </section>

      {/* What is LVMF */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl font-bold mb-4">What is the LVMF?</h2>
              <p className="text-gray-600 mb-4">
                The London View Management Framework (LVMF) protects strategically important views 
                across London. It defines viewing corridors from designated viewpoints toward 
                protected landmarks like St Paul&apos;s Cathedral and the Palace of Westminster.
              </p>
              <p className="text-gray-600 mb-4">
                If your property falls within a protected view corridor, development may be 
                restricted in height or may require additional assessments to ensure it doesn&apos;t 
                impair the protected view.
              </p>
              <Link 
                href="https://www.london.gov.uk/what-we-do/planning/implementing-london-plan/supplementary-planning-guidance/london-view-management"
                className="text-blue-600 font-medium hover:underline"
                target="_blank"
              >
                Read the official LVMF guidance →
              </Link>
            </div>
            <div className="bg-blue-100 rounded-xl p-8">
              <div className="text-4xl mb-4">👁️</div>
              <h3 className="font-bold text-lg mb-2">Key LVMF Viewpoints Near NW London</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Parliament Hill (View 2A.1, 2A.2)</li>
                <li>• Primrose Hill Summit (View 4A.1)</li>
                <li>• Alexandra Palace (View 1A.1)</li>
                <li>• Kenwood (Local protection)</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Protected Viewpoints */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Protected Viewpoints in NW London</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PROTECTED_VIEWPOINTS.map(viewpoint => (
              <div 
                key={viewpoint.id}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Placeholder Map */}
                <div className="h-40 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                  <svg className="w-12 h-12 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg">{viewpoint.name}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      viewpoint.status === 'LVMF Protected' 
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {viewpoint.status}
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm mb-4">📍 {viewpoint.location}</p>
                  <p className="text-gray-600 text-sm mb-4">{viewpoint.description}</p>
                  
                  <div className="border-t border-gray-100 pt-4">
                    <div className="text-xs text-gray-500 mb-1">Affected Areas:</div>
                    <div className="flex flex-wrap gap-1">
                      {viewpoint.affectedAreas.map((area, i) => (
                        <span key={i} className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded">
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <Link 
                    href={`/views/${viewpoint.id}`}
                    className="block mt-4 text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Levels */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Understanding View Impact Levels</h2>
          
          <div className="space-y-4">
            {VIEW_IMPACTS.map((impact, index) => (
              <div 
                key={index}
                className={`p-6 rounded-xl border-2 ${
                  impact.severity === 'high' 
                    ? 'bg-red-50 border-red-200'
                    : impact.severity === 'medium'
                      ? 'bg-amber-50 border-amber-200'
                      : 'bg-emerald-50 border-emerald-200'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-4 h-4 rounded-full ${
                    impact.severity === 'high'
                      ? 'bg-red-500'
                      : impact.severity === 'medium'
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                  }`} />
                  <div>
                    <h3 className="font-bold">{impact.type}</h3>
                    <p className="text-gray-600 text-sm">{impact.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Affects Your Extension */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            How Protected Views Affect Extensions
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="text-3xl mb-4">🏠</div>
              <h3 className="font-bold text-lg mb-2">Single Storey Extensions</h3>
              <p className="text-gray-600 text-sm">
                Generally not affected by LVMF as they don&apos;t increase building height. 
                Focus is on overall building envelope changes.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="text-3xl mb-4">🏗️</div>
              <h3 className="font-bold text-lg mb-2">Loft Conversions & Dormers</h3>
              <p className="text-gray-600 text-sm">
                May be affected if they increase ridge height within a protected view corridor. 
                Check specific height thresholds for your location.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="text-3xl mb-4">🏢</div>
              <h3 className="font-bold text-lg mb-2">New Builds & Major Works</h3>
              <p className="text-gray-600 text-sm">
                Full assessment required. May need verified views analysis 
                and 3D modeling to demonstrate impact on protected views.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Map Placeholder */}
      <section className="py-16 px-4 bg-blue-900 text-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">View Corridors Map</h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Interactive map showing protected view corridors across NW London. 
            Enter your address to see if you&apos;re within a protected zone.
          </p>
          <div className="bg-blue-800 rounded-xl aspect-video flex items-center justify-center mb-8">
            <div className="text-center">
              <svg className="w-16 h-16 mx-auto text-blue-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              <p className="text-blue-300">Interactive map loading...</p>
            </div>
          </div>
          <Link 
            href="/"
            className="inline-block bg-white text-blue-900 hover:bg-blue-50 font-semibold px-8 py-4 rounded-lg transition-colors"
          >
            Check Your Address
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
