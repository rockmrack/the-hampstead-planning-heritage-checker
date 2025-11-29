/**
 * Community Projects Gallery Page
 * Browse before/after photos of local projects
 */

import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Project Gallery | Local Extension Photos | The Hampstead Planning & Heritage Checker',
  description: 'Browse before and after photos of real extension projects in Hampstead, Highgate, Muswell Hill and NW London. See costs, timelines and lessons learned.',
  keywords: 'extension photos, before after extension, Hampstead extensions, loft conversion photos, basement photos London',
};

const FEATURED_PROJECTS = [
  {
    id: 'proj-001',
    title: 'Victorian Terrace Rear Extension & Side Return',
    location: 'Flask Walk, Hampstead',
    type: 'wrap-around',
    cost: '£145,000',
    valueAdded: '£280,000',
    duration: '18 weeks',
    heritage: true,
    imageUrl: '/api/placeholder/600/400',
  },
  {
    id: 'proj-002',
    title: 'Edwardian Semi Loft Conversion',
    location: 'Creighton Avenue, Muswell Hill',
    type: 'loft-conversion',
    cost: '£78,000',
    valueAdded: '£180,000',
    duration: '10 weeks',
    heritage: false,
    imageUrl: '/api/placeholder/600/400',
  },
  {
    id: 'proj-003',
    title: 'Listed Georgian Townhouse Basement',
    location: 'Church Row, Hampstead',
    type: 'basement',
    cost: '£420,000',
    valueAdded: '£900,000',
    duration: '14 months',
    heritage: true,
    imageUrl: '/api/placeholder/600/400',
  },
  {
    id: 'proj-004',
    title: '1930s Semi Side Return',
    location: 'Colney Hatch Lane, Muswell Hill',
    type: 'side-return',
    cost: '£48,000',
    valueAdded: '£80,000',
    duration: '8 weeks',
    heritage: false,
    imageUrl: '/api/placeholder/600/400',
  },
  {
    id: 'proj-005',
    title: 'Victorian Conservation Area Extension',
    location: 'Bisham Gardens, Highgate',
    type: 'rear-extension',
    cost: '£95,000',
    valueAdded: '£250,000',
    duration: '12 weeks',
    heritage: true,
    imageUrl: '/api/placeholder/600/400',
  },
  {
    id: 'proj-006',
    title: 'Crouch End Terrace Double Extension',
    location: 'Weston Park, Crouch End',
    type: 'rear-extension-double',
    cost: '£125,000',
    valueAdded: '£220,000',
    duration: '20 weeks',
    heritage: false,
    imageUrl: '/api/placeholder/600/400',
  },
];

const PROJECT_TYPES = [
  { id: 'all', label: 'All Projects', count: 6 },
  { id: 'loft-conversion', label: 'Loft Conversions', count: 2 },
  { id: 'rear-extension', label: 'Rear Extensions', count: 3 },
  { id: 'basement', label: 'Basements', count: 1 },
  { id: 'side-return', label: 'Side Returns', count: 1 },
  { id: 'wrap-around', label: 'Wrap-Arounds', count: 1 },
];

const AREAS = [
  { id: 'all', label: 'All Areas' },
  { id: 'hampstead', label: 'Hampstead' },
  { id: 'highgate', label: 'Highgate' },
  { id: 'muswell-hill', label: 'Muswell Hill' },
  { id: 'crouch-end', label: 'Crouch End' },
];

export default function ProjectsGalleryPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gray-900 text-white py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <span className="inline-block bg-gray-800 text-gray-300 px-4 py-1 rounded-full text-sm font-medium mb-4">
              Real Projects • Real Results
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Community Project Gallery
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Browse before and after photos from real extension projects in North West London. 
              See what&apos;s possible, learn from others&apos; experiences, and get inspired.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-emerald-600 text-white py-6">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold">50+</div>
              <div className="text-emerald-100 text-sm">Projects Completed</div>
            </div>
            <div>
              <div className="text-3xl font-bold">£8.2m</div>
              <div className="text-emerald-100 text-sm">Total Value Added</div>
            </div>
            <div>
              <div className="text-3xl font-bold">92%</div>
              <div className="text-emerald-100 text-sm">Planning Success Rate</div>
            </div>
            <div>
              <div className="text-3xl font-bold">4.8★</div>
              <div className="text-emerald-100 text-sm">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 px-4 border-b border-gray-200 sticky top-0 bg-white z-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-2 flex-wrap">
              {PROJECT_TYPES.map(type => (
                <button
                  key={type.id}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    type.id === 'all'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {type.label} ({type.count})
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm">
                {AREAS.map(area => (
                  <option key={area.id} value={area.id}>{area.label}</option>
                ))}
              </select>
              <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm">
                <option>All Budgets</option>
                <option>Under £50k</option>
                <option>£50k - £100k</option>
                <option>£100k - £200k</option>
                <option>Over £200k</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURED_PROJECTS.map(project => (
              <Link 
                key={project.id} 
                href={`/projects/${project.id}`}
                className="group"
              >
                <article className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                  {/* Image Placeholder */}
                  <div className="aspect-[4/3] bg-gray-200 relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                      <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    {/* Tags */}
                    <div className="absolute top-4 left-4 flex gap-2">
                      {project.heritage && (
                        <span className="bg-amber-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                          Conservation Area
                        </span>
                      )}
                      <span className="bg-gray-900 text-white text-xs px-2 py-1 rounded-full font-medium capitalize">
                        {project.type.replace('-', ' ')}
                      </span>
                    </div>
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-emerald-600/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white font-semibold">View Project →</span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="font-bold text-lg mb-2 group-hover:text-emerald-600 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      📍 {project.location}
                    </p>
                    
                    <div className="grid grid-cols-3 gap-4 text-center border-t border-gray-100 pt-4">
                      <div>
                        <div className="text-xs text-gray-500">Cost</div>
                        <div className="font-semibold text-sm">{project.cost}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Value Add</div>
                        <div className="font-semibold text-sm text-emerald-600">{project.valueAdded}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Duration</div>
                        <div className="font-semibold text-sm">{project.duration}</div>
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
          
          {/* Load More */}
          <div className="text-center mt-12">
            <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-8 py-4 rounded-lg transition-colors">
              Load More Projects
            </button>
          </div>
        </div>
      </section>

      {/* Submit Your Project CTA */}
      <section className="py-16 px-4 bg-emerald-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Completed a Project in NW London?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Share your extension story to help other homeowners and feature in our gallery.
          </p>
          <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8 py-4 rounded-lg transition-colors">
            Submit Your Project
          </button>
        </div>
      </section>

      {/* Insights Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Insights from the Gallery</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="text-4xl mb-4">🏆</div>
              <h3 className="font-bold text-lg mb-2">Best ROI Project</h3>
              <p className="text-gray-600 text-sm mb-4">
                Loft conversions consistently deliver the best return on investment, 
                averaging 76% ROI across NW London.
              </p>
              <Link href="/calculator" className="text-emerald-600 font-medium text-sm hover:underline">
                Calculate your ROI →
              </Link>
            </div>
            
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="text-4xl mb-4">⏱️</div>
              <h3 className="font-bold text-lg mb-2">Fastest Completion</h3>
              <p className="text-gray-600 text-sm mb-4">
                Side return extensions are typically completed in 8-10 weeks, 
                making them ideal for quick transformations.
              </p>
              <Link href="/guides/side-return" className="text-emerald-600 font-medium text-sm hover:underline">
                Side return guide →
              </Link>
            </div>
            
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="text-4xl mb-4">🏛️</div>
              <h3 className="font-bold text-lg mb-2">Conservation Success</h3>
              <p className="text-gray-600 text-sm mb-4">
                85% of conservation area projects were approved. 
                Key: traditional materials and pre-application advice.
              </p>
              <Link href="/guides/conservation-area" className="text-emerald-600 font-medium text-sm hover:underline">
                Conservation guide →
              </Link>
            </div>
          </div>
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
