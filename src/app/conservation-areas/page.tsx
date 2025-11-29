/**
 * Conservation Areas Guide Page
 * Deep profiles of NW London conservation areas
 */

import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Conservation Areas | NW London Heritage Guide | The Hampstead Planning & Heritage Checker',
  description: 'Complete guide to conservation areas in Hampstead, Highgate, Muswell Hill and NW London. Understand restrictions, materials, and what extensions are allowed.',
  keywords: 'conservation area Hampstead, Highgate conservation, Article 4, heritage restrictions, Camden conservation',
};

const CONSERVATION_AREAS = [
  {
    id: 'hampstead-village',
    name: 'Hampstead Village',
    borough: 'Camden',
    designated: 1968,
    size: '92 hectares',
    listedBuildings: 420,
    restrictionLevel: 'Very High',
    article4: true,
    description: 'The historic heart of Hampstead with Georgian and Victorian architecture.',
    keyStreets: ['Flask Walk', 'Church Row', 'Well Walk', 'Heath Street'],
    allowedExtensions: 'Single storey rear only, traditional materials',
    forbiddenChanges: ['PVCu windows', 'Front dormers', 'Roof terraces visible from street'],
    materials: ['London stock brick', 'Natural slate', 'Timber sash windows', 'Lead flashings'],
    avgApprovalRate: 68,
  },
  {
    id: 'hampstead-garden-suburb',
    name: 'Hampstead Garden Suburb',
    borough: 'Barnet',
    designated: 1968,
    size: '243 hectares',
    listedBuildings: 120,
    restrictionLevel: 'Exceptional',
    article4: true,
    description: 'Unique planned suburb with Arts & Crafts architecture. HGS Trust approval required.',
    keyStreets: ['Meadway', 'Wildwood Road', 'Hampstead Way', 'Central Square'],
    allowedExtensions: 'Very limited - Trust consent required first',
    forbiddenChanges: ['Most external changes', 'Satellite dishes', 'Solar panels (without consent)'],
    materials: ['Per Trust guidelines', 'Traditional only', 'Must match original'],
    avgApprovalRate: 52,
  },
  {
    id: 'highgate',
    name: 'Highgate Conservation Area',
    borough: 'Camden/Haringey',
    designated: 1968,
    size: '156 hectares',
    listedBuildings: 280,
    restrictionLevel: 'High',
    article4: true,
    description: 'Historic hilltop village spanning two boroughs with medieval origins.',
    keyStreets: ['The Grove', 'Highgate High Street', 'Swain\'s Lane', 'South Grove'],
    allowedExtensions: 'Sympathetic rear extensions, rear dormers considered',
    forbiddenChanges: ['Visible roof alterations', 'uPVC', 'Inappropriate front boundary changes'],
    materials: ['Stock brick', 'Natural slate', 'Timber windows', 'Cast iron railings'],
    avgApprovalRate: 72,
  },
  {
    id: 'muswell-hill',
    name: 'Muswell Hill Conservation Area',
    borough: 'Haringey',
    designated: 1993,
    size: '68 hectares',
    listedBuildings: 15,
    restrictionLevel: 'Moderate',
    article4: false,
    description: 'Edwardian shopping centre and residential area with distinctive Broadway.',
    keyStreets: ['Muswell Hill Broadway', 'Queen\'s Avenue', 'Fortis Green'],
    allowedExtensions: 'Rear extensions, dormers to rear generally acceptable',
    forbiddenChanges: ['Shop front alterations without consent', 'Render removal'],
    materials: ['Red brick preferred', 'Slate/plain tiles', 'Timber or metal windows'],
    avgApprovalRate: 82,
  },
  {
    id: 'holly-lodge',
    name: 'Holly Lodge Estate',
    borough: 'Camden',
    designated: 1992,
    size: '12 hectares',
    listedBuildings: 8,
    restrictionLevel: 'High',
    article4: true,
    description: 'Unique private estate with distinctive character and management rules.',
    keyStreets: ['Hillway', 'Holly Lodge Gardens', 'Makepeace Avenue'],
    allowedExtensions: 'Limited, estate management approval also needed',
    forbiddenChanges: ['External paint colors (restricted palette)', 'Boundary changes'],
    materials: ['Brick to match', 'Natural materials only'],
    avgApprovalRate: 65,
  },
  {
    id: 'south-hill-park',
    name: 'South Hill Park',
    borough: 'Camden',
    designated: 1985,
    size: '18 hectares',
    listedBuildings: 25,
    restrictionLevel: 'High',
    article4: true,
    description: 'Victorian villas and mature gardens on southern slopes of Hampstead.',
    keyStreets: ['South Hill Park', 'Parliament Hill', 'Nassington Road'],
    allowedExtensions: 'Rear extensions, basement considered case-by-case',
    forbiddenChanges: ['Hard surfacing front gardens', 'Removal of boundary hedges'],
    materials: ['Victorian brick', 'Slate', 'Timber windows', 'Traditional boundaries'],
    avgApprovalRate: 70,
  },
  {
    id: 'crouch-end',
    name: 'Crouch End Conservation Area',
    borough: 'Haringey',
    designated: 1990,
    size: '42 hectares',
    listedBuildings: 12,
    restrictionLevel: 'Moderate',
    article4: false,
    description: 'Victorian/Edwardian suburb centred on the landmark Clock Tower.',
    keyStreets: ['Broadway Parade', 'Park Road', 'Weston Park'],
    allowedExtensions: 'Generally permissive for sympathetic extensions',
    forbiddenChanges: ['Shop front alterations', 'Loss of architectural details'],
    materials: ['Brick', 'Tile or slate roofing', 'Timber preferred for windows'],
    avgApprovalRate: 85,
  },
];

const RESTRICTION_COLORS = {
  'Very High': 'bg-red-100 text-red-700 border-red-200',
  'Exceptional': 'bg-purple-100 text-purple-700 border-purple-200',
  'High': 'bg-amber-100 text-amber-700 border-amber-200',
  'Moderate': 'bg-emerald-100 text-emerald-700 border-emerald-200',
};

export default function ConservationAreasPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-stone-900 text-white py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <span className="inline-block bg-stone-800 text-stone-200 px-4 py-1 rounded-full text-sm font-medium mb-4">
              37 Conservation Areas Covered
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Conservation Areas Guide
            </h1>
            <p className="text-xl text-stone-300 max-w-3xl mx-auto">
              Detailed profiles of every conservation area in Hampstead, Highgate, Muswell Hill 
              and surrounding areas. Understand restrictions before you plan.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Search */}
      <section className="py-8 px-4 bg-stone-50 border-b border-stone-200">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Search conservation areas or enter postcode..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg"
            />
            <select className="px-4 py-3 border border-gray-300 rounded-lg">
              <option>All Boroughs</option>
              <option>Camden</option>
              <option>Barnet</option>
              <option>Haringey</option>
            </select>
            <button className="bg-stone-700 hover:bg-stone-800 text-white font-semibold px-6 py-3 rounded-lg transition-colors">
              Search
            </button>
          </div>
        </div>
      </section>

      {/* Understanding Restrictions */}
      <section className="py-12 px-4 bg-stone-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Understanding Restriction Levels</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-4 border-2 border-emerald-200">
              <div className="font-bold text-emerald-700 mb-2">Moderate</div>
              <p className="text-sm text-gray-600">
                More flexibility for extensions. Rear development usually acceptable with 
                appropriate design.
              </p>
            </div>
            <div className="bg-white rounded-xl p-4 border-2 border-amber-200">
              <div className="font-bold text-amber-700 mb-2">High</div>
              <p className="text-sm text-gray-600">
                Careful design required. Traditional materials essential. 
                Pre-app advised for all but smallest works.
              </p>
            </div>
            <div className="bg-white rounded-xl p-4 border-2 border-red-200">
              <div className="font-bold text-red-700 mb-2">Very High</div>
              <p className="text-sm text-gray-600">
                Strict controls. Heritage statement required. Officer scrutiny 
                of all external changes.
              </p>
            </div>
            <div className="bg-white rounded-xl p-4 border-2 border-purple-200">
              <div className="font-bold text-purple-700 mb-2">Exceptional</div>
              <p className="text-sm text-gray-600">
                Additional consent bodies (e.g., HGS Trust). Very limited 
                scope for change. Expert guidance essential.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Conservation Area Cards */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-8">Featured Conservation Areas</h2>
          
          <div className="space-y-6">
            {CONSERVATION_AREAS.map(ca => (
              <div 
                key={ca.id}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-2xl font-bold">{ca.name}</h3>
                        {ca.article4 && (
                          <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full font-medium">
                            Article 4
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600">{ca.borough} • Designated {ca.designated}</p>
                    </div>
                    <div className={`px-4 py-2 rounded-lg border font-medium ${RESTRICTION_COLORS[ca.restrictionLevel as keyof typeof RESTRICTION_COLORS]}`}>
                      {ca.restrictionLevel} Restrictions
                    </div>
                  </div>

                  <p className="text-gray-700 mb-6">{ca.description}</p>

                  {/* Stats Grid */}
                  <div className="grid md:grid-cols-4 gap-4 bg-gray-50 rounded-lg p-4 mb-6">
                    <div>
                      <div className="text-sm text-gray-500">Size</div>
                      <div className="font-semibold">{ca.size}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Listed Buildings</div>
                      <div className="font-semibold">{ca.listedBuildings}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Avg Approval Rate</div>
                      <div className="font-semibold text-emerald-600">{ca.avgApprovalRate}%</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Key Streets</div>
                      <div className="font-semibold text-sm">{ca.keyStreets.slice(0, 2).join(', ')}</div>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <h4 className="font-semibold text-emerald-700 mb-2">✓ Typically Allowed</h4>
                      <p className="text-sm text-gray-600">{ca.allowedExtensions}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-red-700 mb-2">✗ Usually Refused</h4>
                      <ul className="text-sm text-gray-600">
                        {ca.forbiddenChanges.map((item, i) => (
                          <li key={i}>• {item}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-blue-700 mb-2">🧱 Required Materials</h4>
                      <ul className="text-sm text-gray-600">
                        {ca.materials.map((item, i) => (
                          <li key={i}>• {item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <Link 
                    href={`/conservation-areas/${ca.id}`}
                    className="block mt-6 text-center bg-stone-700 hover:bg-stone-800 text-white font-semibold py-3 rounded-lg transition-colors"
                  >
                    View Full Profile & Precedents
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What is Article 4? */}
      <section className="py-16 px-4 bg-red-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">
            What is Article 4 Direction?
          </h2>
          
          <div className="bg-white rounded-xl p-8 border border-red-200">
            <p className="text-gray-700 mb-6">
              An Article 4 Direction removes certain &ldquo;permitted development&rdquo; rights that 
              would normally allow minor changes without planning permission. In areas with 
              Article 4 directions, you need planning permission for:
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-red-50 rounded-lg p-4">
                <h3 className="font-bold text-red-700 mb-2">Common Article 4 Restrictions</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Replacing windows or doors</li>
                  <li>• Painting the exterior</li>
                  <li>• Adding or altering a porch</li>
                  <li>• Installing satellite dishes</li>
                  <li>• Changing boundary treatments</li>
                  <li>• Laying hardstanding</li>
                </ul>
              </div>
              <div className="bg-emerald-50 rounded-lg p-4">
                <h3 className="font-bold text-emerald-700 mb-2">What This Means For You</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Always check before any external work</li>
                  <li>• Even &ldquo;like for like&rdquo; may need consent</li>
                  <li>• Planning fees apply</li>
                  <li>• Pre-application advice recommended</li>
                  <li>• Heritage statement usually required</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tips Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Tips for Conservation Area Applications
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="text-3xl mb-4">📝</div>
              <h3 className="font-bold text-lg mb-2">Write a Strong Heritage Statement</h3>
              <p className="text-gray-600 text-sm">
                Explain how your proposal respects and enhances the character of the conservation area. 
                Reference the Conservation Area Appraisal.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="text-3xl mb-4">🏠</div>
              <h3 className="font-bold text-lg mb-2">Use Approved Precedents</h3>
              <p className="text-gray-600 text-sm">
                Reference similar extensions approved on your street or in your conservation area. 
                Officers appreciate consistency.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="text-3xl mb-4">🧱</div>
              <h3 className="font-bold text-lg mb-2">Specify Traditional Materials</h3>
              <p className="text-gray-600 text-sm">
                Name the exact materials you&apos;ll use. Conservation officers want to see 
                &ldquo;London stock brick&rdquo; not just &ldquo;brick to match&rdquo;.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="text-3xl mb-4">💬</div>
              <h3 className="font-bold text-lg mb-2">Request Pre-Application Advice</h3>
              <p className="text-gray-600 text-sm">
                £600-800 for formal pre-app is worthwhile. It tells you exactly what&apos;s 
                likely to be approved and avoids costly refusals.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="text-3xl mb-4">📸</div>
              <h3 className="font-bold text-lg mb-2">Include Quality Photos</h3>
              <p className="text-gray-600 text-sm">
                Show the existing context. Officers need to understand how your property 
                relates to neighbors and the streetscape.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="text-3xl mb-4">🎨</div>
              <h3 className="font-bold text-lg mb-2">Design Subordinately</h3>
              <p className="text-gray-600 text-sm">
                New additions should complement, not compete with, the original building. 
                &ldquo;Quietly confident&rdquo; design often wins approval.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-stone-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Check Your Conservation Area Constraints
          </h2>
          <p className="text-xl text-stone-300 mb-8">
            Enter your address to see exactly which restrictions apply to your property.
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
