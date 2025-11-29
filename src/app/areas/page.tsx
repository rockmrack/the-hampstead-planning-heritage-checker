/**
 * Area Intelligence Page
 * Detailed planning intelligence for NW London areas
 */

import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Area Planning Intelligence | NW London Guide | The Hampstead Planning & Heritage Checker',
  description: 'Detailed planning intelligence for Hampstead, Highgate, Muswell Hill, Crouch End and NW London. Approval rates, common issues, and what works in each area.',
  keywords: 'Hampstead planning, Highgate extensions, Muswell Hill development, NW London planning, area planning guide',
};

const AREAS = [
  {
    id: 'hampstead',
    name: 'Hampstead',
    borough: 'Camden',
    avgPropertyValue: '£2.1m',
    avgExtensionROI: '185%',
    approvalRate: 72,
    conservationCoverage: 85,
    mostPopular: 'Single storey rear extension',
    avgProcessingTime: '10 weeks',
    keyConstraints: ['Multiple conservation areas', 'High listed building density', 'Basement SPD restrictions'],
    opportunities: ['Strong precedents for rear extensions', 'Premium materials add value'],
    localOfficers: ['James Anderson', 'Sarah Mitchell'],
    recentTrends: 'Basement applications stabilizing after SPD introduction. Rear extensions with flat roofs gaining acceptance.',
    priceMultiplier: 1.35,
  },
  {
    id: 'highgate',
    name: 'Highgate',
    borough: 'Camden/Haringey',
    avgPropertyValue: '£1.8m',
    avgExtensionROI: '175%',
    approvalRate: 76,
    conservationCoverage: 72,
    mostPopular: 'Loft conversion with rear dormer',
    avgProcessingTime: '8 weeks',
    keyConstraints: ['Split borough boundary', 'Highgate Bowl protected', 'Tree Preservation Orders prevalent'],
    opportunities: ['Good precedents for loft conversions', 'Views add significant value'],
    localOfficers: ['Rachel Green', 'David Wilson'],
    recentTrends: 'Increasing acceptance of contemporary materials. Protected view assessments becoming standard.',
    priceMultiplier: 1.25,
  },
  {
    id: 'muswell-hill',
    name: 'Muswell Hill',
    borough: 'Haringey',
    avgPropertyValue: '£1.2m',
    avgExtensionROI: '165%',
    approvalRate: 84,
    conservationCoverage: 45,
    mostPopular: 'Rear extension with side return',
    avgProcessingTime: '7 weeks',
    keyConstraints: ['Broadway conservation area strict', 'Parking often raised by neighbors'],
    opportunities: ['Many properties outside CA', 'Good for permitted development', 'Strong family market'],
    localOfficers: ['David Wilson'],
    recentTrends: 'Wrap-around extensions increasingly popular. Double storey approvals improving.',
    priceMultiplier: 1.15,
  },
  {
    id: 'crouch-end',
    name: 'Crouch End',
    borough: 'Haringey',
    avgPropertyValue: '£1.1m',
    avgExtensionROI: '160%',
    approvalRate: 86,
    conservationCoverage: 35,
    mostPopular: 'Side return kitchen extension',
    avgProcessingTime: '6 weeks',
    keyConstraints: ['Clock Tower area sensitive', 'Some Article 4 restrictions'],
    opportunities: ['Generally permissive attitude', 'Quick processing times'],
    localOfficers: ['David Wilson'],
    recentTrends: 'Strong demand for open-plan living. Garden rooms gaining popularity.',
    priceMultiplier: 1.10,
  },
  {
    id: 'hampstead-garden-suburb',
    name: 'Hampstead Garden Suburb',
    borough: 'Barnet',
    avgPropertyValue: '£2.8m',
    avgExtensionROI: '140%',
    approvalRate: 52,
    conservationCoverage: 100,
    mostPopular: 'Internal alterations',
    avgProcessingTime: '14 weeks',
    keyConstraints: ['HGS Trust consent required', 'Extremely strict controls', 'Very limited scope for external changes'],
    opportunities: ['Internal work feasible', 'Basement potential in some locations'],
    localOfficers: ['Emma Thompson'],
    recentTrends: 'Trust increasingly pragmatic about sustainability measures. Solar panels case-by-case.',
    priceMultiplier: 1.45,
  },
  {
    id: 'belsize-park',
    name: 'Belsize Park',
    borough: 'Camden',
    avgPropertyValue: '£1.9m',
    avgExtensionROI: '170%',
    approvalRate: 74,
    conservationCoverage: 80,
    mostPopular: 'Basement extension',
    avgProcessingTime: '10 weeks',
    keyConstraints: ['Conservation area coverage high', 'Basement restrictions apply'],
    opportunities: ['Victorian villas offer good potential', 'Strong market for extended properties'],
    localOfficers: ['James Anderson'],
    recentTrends: 'Basement SPD having effect. Focus shifting to rear and loft extensions.',
    priceMultiplier: 1.30,
  },
  {
    id: 'primrose-hill',
    name: 'Primrose Hill',
    borough: 'Camden',
    avgPropertyValue: '£3.2m',
    avgExtensionROI: '155%',
    approvalRate: 68,
    conservationCoverage: 90,
    mostPopular: 'Rear extension',
    avgProcessingTime: '11 weeks',
    keyConstraints: ['LVMF protected views', 'Very high heritage sensitivity', 'Celebrity area - high profile'],
    opportunities: ['Premium market values quality', 'Good precedents in specific streets'],
    localOfficers: ['James Anderson', 'Sarah Mitchell'],
    recentTrends: 'View protection assessments increasingly required. High quality contemporary gaining acceptance.',
    priceMultiplier: 1.50,
  },
  {
    id: 'golders-green',
    name: 'Golders Green',
    borough: 'Barnet',
    avgPropertyValue: '£950k',
    avgExtensionROI: '175%',
    approvalRate: 82,
    conservationCoverage: 25,
    mostPopular: 'Double storey rear extension',
    avgProcessingTime: '7 weeks',
    keyConstraints: ['HGS boundary sensitive', 'Some flood zone areas'],
    opportunities: ['Much not in conservation area', 'Good for larger extensions'],
    localOfficers: ['Michael Chen'],
    recentTrends: 'Strong demand for family-sized extensions. Quick turnaround times.',
    priceMultiplier: 1.08,
  },
];

export default function AreasPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-cyan-900 text-white py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <span className="inline-block bg-cyan-800 text-cyan-100 px-4 py-1 rounded-full text-sm font-medium mb-4">
              Hyper-Local Intelligence
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Area Planning Intelligence
            </h1>
            <p className="text-xl text-cyan-100 max-w-3xl mx-auto">
              Detailed planning intelligence for every neighborhood in NW London. 
              Understand what works, who decides, and how long it takes in your area.
            </p>
          </div>
        </div>
      </section>

      {/* Area Selector */}
      <section className="py-8 px-4 bg-cyan-50 border-b border-cyan-100">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap gap-2 justify-center">
            {AREAS.map(area => (
              <Link
                key={area.id}
                href={`#${area.id}`}
                className="px-4 py-2 bg-white rounded-full text-sm font-medium hover:bg-cyan-600 hover:text-white transition-colors border border-cyan-200"
              >
                {area.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Area Cards */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="space-y-8">
            {AREAS.map(area => (
              <div 
                key={area.id}
                id={area.id}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow scroll-mt-24"
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-3xl font-bold mb-2">{area.name}</h2>
                      <p className="text-gray-600">{area.borough}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-cyan-600">{area.approvalRate}%</div>
                      <div className="text-sm text-gray-500">Approval Rate</div>
                    </div>
                  </div>

                  {/* Key Stats */}
                  <div className="grid md:grid-cols-6 gap-4 bg-gray-50 rounded-lg p-4 mb-6">
                    <div className="text-center">
                      <div className="text-lg font-bold">{area.avgPropertyValue}</div>
                      <div className="text-xs text-gray-500">Avg Property Value</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-emerald-600">{area.avgExtensionROI}</div>
                      <div className="text-xs text-gray-500">Extension ROI</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold">{area.conservationCoverage}%</div>
                      <div className="text-xs text-gray-500">Conservation Coverage</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold">{area.avgProcessingTime}</div>
                      <div className="text-xs text-gray-500">Avg Processing</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold">{area.priceMultiplier}x</div>
                      <div className="text-xs text-gray-500">Build Cost Multiplier</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-semibold">{area.mostPopular}</div>
                      <div className="text-xs text-gray-500">Most Popular</div>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-red-50 rounded-lg p-4 border border-red-100">
                      <h3 className="font-semibold text-red-700 mb-2">⚠️ Key Constraints</h3>
                      <ul className="text-sm text-gray-700 space-y-1">
                        {area.keyConstraints.map((item, i) => (
                          <li key={i}>• {item}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-100">
                      <h3 className="font-semibold text-emerald-700 mb-2">💡 Opportunities</h3>
                      <ul className="text-sm text-gray-700 space-y-1">
                        {area.opportunities.map((item, i) => (
                          <li key={i}>• {item}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                      <h3 className="font-semibold text-blue-700 mb-2">👤 Local Officers</h3>
                      <ul className="text-sm text-gray-700 space-y-1">
                        {area.localOfficers.map((officer, i) => (
                          <li key={i}>• {officer}</li>
                        ))}
                      </ul>
                      <Link href="/officers" className="text-blue-600 text-sm hover:underline mt-2 inline-block">
                        View profiles →
                      </Link>
                    </div>
                  </div>

                  {/* Recent Trends */}
                  <div className="bg-cyan-50 rounded-lg p-4 border border-cyan-100">
                    <h3 className="font-semibold text-cyan-700 mb-2">📈 Recent Trends</h3>
                    <p className="text-gray-700">{area.recentTrends}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-4 mt-6">
                    <Link 
                      href={`/areas/${area.id}`}
                      className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white text-center font-semibold py-3 rounded-lg transition-colors"
                    >
                      Full Area Report
                    </Link>
                    <Link 
                      href={`/street-history?area=${area.id}`}
                      className="flex-1 border border-cyan-600 text-cyan-600 hover:bg-cyan-50 text-center font-semibold py-3 rounded-lg transition-colors"
                    >
                      View Street Precedents
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Quick Area Comparison</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-xl overflow-hidden shadow-lg">
              <thead className="bg-gray-900 text-white">
                <tr>
                  <th className="text-left px-4 py-3">Area</th>
                  <th className="text-center px-4 py-3">Approval Rate</th>
                  <th className="text-center px-4 py-3">Processing Time</th>
                  <th className="text-center px-4 py-3">Conservation %</th>
                  <th className="text-center px-4 py-3">ROI</th>
                  <th className="text-center px-4 py-3">Cost Multiplier</th>
                </tr>
              </thead>
              <tbody>
                {AREAS.sort((a, b) => b.approvalRate - a.approvalRate).map((area, index) => (
                  <tr key={area.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-3 font-medium">{area.name}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`font-semibold ${
                        area.approvalRate >= 80 ? 'text-emerald-600' :
                        area.approvalRate >= 70 ? 'text-amber-600' :
                        'text-red-600'
                      }`}>
                        {area.approvalRate}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">{area.avgProcessingTime}</td>
                    <td className="px-4 py-3 text-center">{area.conservationCoverage}%</td>
                    <td className="px-4 py-3 text-center text-emerald-600 font-semibold">{area.avgExtensionROI}</td>
                    <td className="px-4 py-3 text-center">{area.priceMultiplier}x</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-cyan-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Get Area-Specific Analysis For Your Property
          </h2>
          <p className="text-xl text-cyan-100 mb-8">
            Our feasibility reports include detailed local intelligence for your exact location.
          </p>
          <Link 
            href="/"
            className="inline-block bg-white text-cyan-900 hover:bg-cyan-50 font-semibold px-8 py-4 rounded-lg transition-colors"
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
