/**
 * Builder Cost Comparison Page
 * Compare local NW London builders and get quotes
 */

import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Compare Builders | NW London Extension Costs | The Hampstead Planning & Heritage Checker',
  description: 'Compare vetted builders specializing in heritage extensions in Hampstead, Highgate and NW London. Get real cost estimates and reviews from local homeowners.',
  keywords: 'builders Hampstead, extension builder NW London, loft conversion builder, conservation area builder, heritage builder London',
};

const FEATURED_BUILDERS = [
  {
    id: 'bldr-001',
    name: 'Heritage Craft Builders',
    rating: 4.9,
    reviews: 47,
    specialties: ['Conservation Areas', 'Listed Buildings', 'Victorian Extensions'],
    avgCost: '£££',
    projectsInArea: 23,
    yearsExperience: 18,
    response: '24 hours',
    location: 'Hampstead',
    verified: true,
    featured: true,
  },
  {
    id: 'bldr-002',
    name: 'North London Extensions Ltd',
    rating: 4.7,
    reviews: 82,
    specialties: ['Rear Extensions', 'Side Returns', 'Loft Conversions'],
    avgCost: '££',
    projectsInArea: 56,
    yearsExperience: 12,
    response: '48 hours',
    location: 'Crouch End',
    verified: true,
    featured: false,
  },
  {
    id: 'bldr-003',
    name: 'Edwardian Restoration Co',
    rating: 4.8,
    reviews: 34,
    specialties: ['Edwardian Properties', 'Period Features', 'Basements'],
    avgCost: '£££',
    projectsInArea: 28,
    yearsExperience: 22,
    response: '24 hours',
    location: 'Muswell Hill',
    verified: true,
    featured: true,
  },
  {
    id: 'bldr-004',
    name: 'Modern Living Builds',
    rating: 4.6,
    reviews: 61,
    specialties: ['Contemporary Extensions', 'Glass Boxes', 'Garden Rooms'],
    avgCost: '££',
    projectsInArea: 41,
    yearsExperience: 8,
    response: '24 hours',
    location: 'Highgate',
    verified: true,
    featured: false,
  },
  {
    id: 'bldr-005',
    name: 'Camden Heritage Builders',
    rating: 4.9,
    reviews: 29,
    specialties: ['Georgian Properties', 'Article 4 Areas', 'Grade II Listed'],
    avgCost: '££££',
    projectsInArea: 15,
    yearsExperience: 25,
    response: '72 hours',
    location: 'Belsize Park',
    verified: true,
    featured: true,
  },
  {
    id: 'bldr-006',
    name: 'Swift Extensions',
    rating: 4.5,
    reviews: 95,
    specialties: ['Permitted Development', 'Quick Builds', 'Budget Extensions'],
    avgCost: '£',
    projectsInArea: 78,
    yearsExperience: 6,
    response: '12 hours',
    location: 'Finchley',
    verified: true,
    featured: false,
  },
];

const COST_RANGES = [
  { project: 'Single Storey Rear Extension (4m)', low: '£40,000', mid: '£55,000', high: '£75,000', conservation: '+15-25%' },
  { project: 'Side Return Extension', low: '£35,000', mid: '£45,000', high: '£60,000', conservation: '+10-20%' },
  { project: 'Wrap-Around Extension', low: '£70,000', mid: '£95,000', high: '£130,000', conservation: '+20-30%' },
  { project: 'Loft Conversion (Dormer)', low: '£55,000', mid: '£70,000', high: '£90,000', conservation: '+15-25%' },
  { project: 'Basement Extension', low: '£200,000', mid: '£350,000', high: '£500,000', conservation: '+25-40%' },
  { project: 'Double Storey Extension', low: '£80,000', mid: '£110,000', high: '£150,000', conservation: '+20-30%' },
];

export default function BuildersPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-amber-900 text-white py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <span className="inline-block bg-amber-800 text-amber-100 px-4 py-1 rounded-full text-sm font-medium mb-4">
              Vetted • Local • Heritage Specialists
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Compare NW London Builders
            </h1>
            <p className="text-xl text-amber-100 max-w-3xl mx-auto">
              Find and compare builders who specialize in heritage properties and conservation areas. 
              All builders are vetted and reviewed by local homeowners.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Cost Calculator */}
      <section className="py-8 px-4 bg-amber-50 border-b border-amber-100">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Project Type</label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                <option>Rear Extension</option>
                <option>Side Return</option>
                <option>Loft Conversion</option>
                <option>Basement</option>
                <option>Double Storey</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Area</label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                <option>Hampstead</option>
                <option>Highgate</option>
                <option>Muswell Hill</option>
                <option>Crouch End</option>
                <option>Belsize Park</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Conservation Area?</label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                <option>Yes</option>
                <option>No</option>
                <option>Not Sure</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">&nbsp;</label>
              <button className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2 rounded-lg transition-colors">
                Get Estimates
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Builder Cards */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Featured Builders</h2>
            <div className="flex gap-2">
              <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm">
                <option>Sort by: Rating</option>
                <option>Most Reviews</option>
                <option>Most Projects</option>
                <option>Response Time</option>
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {FEATURED_BUILDERS.map(builder => (
              <div 
                key={builder.id} 
                className={`bg-white rounded-xl border-2 p-6 hover:shadow-lg transition-shadow ${
                  builder.featured ? 'border-amber-400' : 'border-gray-200'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {builder.featured && (
                        <span className="bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded-full font-medium">
                          Featured
                        </span>
                      )}
                      {builder.verified && (
                        <span className="bg-emerald-100 text-emerald-700 text-xs px-2 py-0.5 rounded-full font-medium">
                          ✓ Verified
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-xl">{builder.name}</h3>
                    <p className="text-gray-500 text-sm">📍 {builder.location}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-amber-500">
                      <span className="text-lg font-bold">{builder.rating}</span>
                      <span>★</span>
                    </div>
                    <p className="text-sm text-gray-500">{builder.reviews} reviews</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {builder.specialties.map((spec, i) => (
                    <span key={i} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                      {spec}
                    </span>
                  ))}
                </div>

                <div className="grid grid-cols-4 gap-4 text-center border-t border-gray-100 pt-4 mb-4">
                  <div>
                    <div className="text-xs text-gray-500">Price Range</div>
                    <div className="font-semibold text-amber-600">{builder.avgCost}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Local Projects</div>
                    <div className="font-semibold">{builder.projectsInArea}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Experience</div>
                    <div className="font-semibold">{builder.yearsExperience} yrs</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Response</div>
                    <div className="font-semibold text-emerald-600">{builder.response}</div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link 
                    href={`/builders/${builder.id}`}
                    className="flex-1 bg-amber-600 hover:bg-amber-700 text-white text-center font-semibold py-2 rounded-lg transition-colors"
                  >
                    View Profile
                  </Link>
                  <button className="flex-1 border border-amber-600 text-amber-600 hover:bg-amber-50 font-semibold py-2 rounded-lg transition-colors">
                    Request Quote
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cost Guide */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">NW London Cost Guide 2024</h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Real costs from completed projects in Hampstead, Highgate, Muswell Hill and surrounding areas. 
            Conservation areas typically add 15-40% to costs.
          </p>

          <div className="bg-white rounded-xl overflow-hidden shadow-lg">
            <table className="w-full">
              <thead className="bg-gray-900 text-white">
                <tr>
                  <th className="text-left px-6 py-4 font-semibold">Project Type</th>
                  <th className="text-center px-6 py-4 font-semibold">Budget</th>
                  <th className="text-center px-6 py-4 font-semibold">Mid-Range</th>
                  <th className="text-center px-6 py-4 font-semibold">Premium</th>
                  <th className="text-center px-6 py-4 font-semibold">Conservation Premium</th>
                </tr>
              </thead>
              <tbody>
                {COST_RANGES.map((row, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 font-medium">{row.project}</td>
                    <td className="px-6 py-4 text-center text-gray-600">{row.low}</td>
                    <td className="px-6 py-4 text-center font-semibold">{row.mid}</td>
                    <td className="px-6 py-4 text-center text-gray-600">{row.high}</td>
                    <td className="px-6 py-4 text-center text-amber-600">{row.conservation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-sm text-gray-500 text-center mt-4">
            * Costs include build only. Exclude architect fees (8-12%), planning fees, and structural engineer.
          </p>
        </div>
      </section>

      {/* Why Heritage Specialists Matter */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Heritage Experience Matters
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-amber-50 rounded-xl p-6 border border-amber-200">
              <div className="text-3xl mb-4">🏛️</div>
              <h3 className="font-bold text-lg mb-2">Conservation Compliance</h3>
              <p className="text-gray-600 text-sm">
                Heritage-experienced builders understand lime mortars, traditional construction methods, 
                and material specifications required by conservation officers.
              </p>
            </div>

            <div className="bg-amber-50 rounded-xl p-6 border border-amber-200">
              <div className="text-3xl mb-4">📋</div>
              <h3 className="font-bold text-lg mb-2">Planning Navigation</h3>
              <p className="text-gray-600 text-sm">
                Experienced builders know how to work within planning conditions, 
                handle discharge of conditions, and avoid enforcement issues.
              </p>
            </div>

            <div className="bg-amber-50 rounded-xl p-6 border border-amber-200">
              <div className="text-3xl mb-4">⏱️</div>
              <h3 className="font-bold text-lg mb-2">Fewer Surprises</h3>
              <p className="text-gray-600 text-sm">
                Local experience means they know common issues with Victorian, Georgian and Edwardian 
                properties—from party wall complications to underground springs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Request Multiple Quotes CTA */}
      <section className="py-16 px-4 bg-amber-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Get 3 Free Quotes
          </h2>
          <p className="text-xl text-amber-100 mb-8">
            Describe your project once and receive quotes from up to 3 vetted local builders.
          </p>
          <button className="bg-white text-amber-600 hover:bg-amber-50 font-semibold px-8 py-4 rounded-lg transition-colors text-lg">
            Start Your Quote Request
          </button>
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
