/**
 * Natural Language Planning Q&A Page
 * Ask planning questions in plain English
 */

import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Ask Planning Questions | Free NW London Advice | The Hampstead Planning & Heritage Checker',
  description: 'Ask planning questions in plain English and get instant answers. Can I build an extension? Do I need planning permission? Free advice for Hampstead and NW London.',
  keywords: 'planning questions, do I need planning permission, Hampstead planning advice, extension allowed, permitted development',
};

const SAMPLE_QUESTIONS = [
  {
    question: 'Can I extend my Victorian terraced house in Hampstead by 4 metres?',
    category: 'Extensions',
    popular: true,
  },
  {
    question: 'Do I need planning permission for a loft conversion in a conservation area?',
    category: 'Loft Conversions',
    popular: true,
  },
  {
    question: 'What height limit applies to rear extensions in Highgate?',
    category: 'Regulations',
    popular: true,
  },
  {
    question: 'Can I build a basement under my garden in Hampstead Garden Suburb?',
    category: 'Basements',
    popular: false,
  },
  {
    question: 'What materials are acceptable for extensions in Church Row Conservation Area?',
    category: 'Materials',
    popular: false,
  },
  {
    question: 'How long does planning permission take in Camden?',
    category: 'Timeline',
    popular: false,
  },
];

const CATEGORIES = [
  { id: 'extensions', label: 'Extensions', icon: '🏠', questions: 45 },
  { id: 'loft', label: 'Loft Conversions', icon: '🏗️', questions: 32 },
  { id: 'basement', label: 'Basements', icon: '⛏️', questions: 28 },
  { id: 'conservation', label: 'Conservation Areas', icon: '🏛️', questions: 56 },
  { id: 'permitted', label: 'Permitted Development', icon: '✅', questions: 41 },
  { id: 'listed', label: 'Listed Buildings', icon: '📜', questions: 23 },
];

const RECENT_ANSWERS = [
  {
    question: 'Can I add a dormer window to my 1930s semi in Muswell Hill?',
    answer: 'Yes, dormer windows are generally permitted on 1930s semi-detached houses in Muswell Hill under permitted development rights, provided they don\'t exceed the highest part of the existing roof and don\'t face the highway on a principal elevation...',
    confidence: 95,
    area: 'Muswell Hill',
  },
  {
    question: 'What\'s the maximum size for a single storey rear extension without planning?',
    answer: 'For detached houses, you can extend up to 8 metres (or 4 metres for semi-detached/terraced) without planning permission under permitted development, subject to Prior Approval notification for extensions over 4m/6m...',
    confidence: 98,
    area: 'General NW London',
  },
  {
    question: 'Is my property in a conservation area?',
    answer: 'To check if your property is in a conservation area, enter your postcode above. Hampstead has multiple conservation areas including Holly Lodge Estate, South Hill Park, and Hampstead Village. Each has specific design guidelines...',
    confidence: 100,
    area: 'Hampstead',
  },
];

export default function AskPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Search */}
      <section className="relative bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-900 text-white py-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-block bg-emerald-700 text-emerald-100 px-4 py-1 rounded-full text-sm font-medium mb-4">
              AI-Powered Planning Advice
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Ask Anything About Planning
            </h1>
            <p className="text-xl text-emerald-100 max-w-2xl mx-auto">
              Get instant answers to your planning questions in plain English. 
              Our AI understands NW London&apos;s unique planning rules and conservation areas.
            </p>
          </div>
          
          {/* Search Input */}
          <div className="bg-white rounded-xl p-2 shadow-2xl">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Ask your planning question... e.g., 'Can I build a rear extension in Hampstead?'"
                  className="w-full pl-12 pr-4 py-4 text-gray-900 text-lg rounded-lg border-0 focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8 py-4 rounded-lg transition-colors whitespace-nowrap">
                Ask Question
              </button>
            </div>
          </div>
          
          {/* Popular Questions */}
          <div className="mt-6 flex flex-wrap gap-2 justify-center">
            <span className="text-emerald-200 text-sm">Popular:</span>
            {SAMPLE_QUESTIONS.filter(q => q.popular).map((q, i) => (
              <button 
                key={i}
                className="bg-emerald-700/50 hover:bg-emerald-700 text-emerald-100 text-sm px-3 py-1 rounded-full transition-colors"
              >
                {q.question.substring(0, 40)}...
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 px-4 bg-gray-50 border-b border-gray-200">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl font-bold text-center mb-8">Browse by Topic</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                className="bg-white rounded-xl p-4 border border-gray-200 hover:border-emerald-500 hover:shadow-lg transition-all text-center group"
              >
                <div className="text-3xl mb-2">{cat.icon}</div>
                <div className="font-semibold group-hover:text-emerald-600 transition-colors">
                  {cat.label}
                </div>
                <div className="text-sm text-gray-500">{cat.questions} questions</div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Answers */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-8">Recent Questions & Answers</h2>
          
          <div className="space-y-6">
            {RECENT_ANSWERS.map((item, index) => (
              <div key={index} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-emerald-100 rounded-full p-2 mt-1">
                      <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-2">{item.question}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                        <span className="bg-gray-100 px-2 py-1 rounded">📍 {item.area}</span>
                        <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded">
                          {item.confidence}% confidence
                        </span>
                      </div>
                      <p className="text-gray-600">{item.answer}</p>
                      <button className="text-emerald-600 font-medium text-sm mt-4 hover:underline">
                        Read full answer →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 bg-emerald-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-2xl">💬</span>
              </div>
              <h3 className="font-bold text-lg mb-2">1. Ask in Plain English</h3>
              <p className="text-gray-600">
                No jargon needed. Just ask your question the way you would ask a friend 
                who happens to be a planning expert.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-2xl">🔍</span>
              </div>
              <h3 className="font-bold text-lg mb-2">2. AI Searches Local Rules</h3>
              <p className="text-gray-600">
                Our AI searches through Camden, Barnet, and Haringey planning policies, 
                conservation area guidelines, and precedent decisions.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-2xl">✅</span>
              </div>
              <h3 className="font-bold text-lg mb-2">3. Get Clear Answers</h3>
              <p className="text-gray-600">
                Receive a clear, jargon-free answer with confidence level, 
                relevant regulations, and next steps.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sample Questions by Area */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-8">Questions by Area</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <span className="text-2xl">🏘️</span> Hampstead Questions
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link href="#" className="text-emerald-600 hover:underline">
                    What are the basement rules in Hampstead Village?
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-emerald-600 hover:underline">
                    Can I add a rear extension to my Grade II listed cottage?
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-emerald-600 hover:underline">
                    What materials are acceptable for windows in Holly Lodge Estate?
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-emerald-600 hover:underline">
                    How do I check if my property has Article 4 restrictions?
                  </Link>
                </li>
              </ul>
            </div>
            
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <span className="text-2xl">🌳</span> Highgate Questions
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link href="#" className="text-emerald-600 hover:underline">
                    Are dormer windows allowed in Highgate Conservation Area?
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-emerald-600 hover:underline">
                    What&apos;s the maximum extension depth on The Grove?
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-emerald-600 hover:underline">
                    Can I convert my garage in Highgate West Hill?
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-emerald-600 hover:underline">
                    Protected view corridors affecting my extension?
                  </Link>
                </li>
              </ul>
            </div>
            
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <span className="text-2xl">🌿</span> Hampstead Garden Suburb Questions
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link href="#" className="text-emerald-600 hover:underline">
                    What does the HGS Trust allow for extensions?
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-emerald-600 hover:underline">
                    Can I replace my windows with double glazing?
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-emerald-600 hover:underline">
                    Solar panels rules in Hampstead Garden Suburb?
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-emerald-600 hover:underline">
                    Boundary wall regulations in HGS?
                  </Link>
                </li>
              </ul>
            </div>
            
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <span className="text-2xl">🏡</span> Muswell Hill Questions
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link href="#" className="text-emerald-600 hover:underline">
                    Permitted development in Muswell Hill conservation area?
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-emerald-600 hover:underline">
                    Can I add a side extension to my Edwardian semi?
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-emerald-600 hover:underline">
                    Loft conversion rules in Haringey?
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-emerald-600 hover:underline">
                    Maximum roof extension height in Muswell Hill?
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Can&apos;t Find Your Answer?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Get personalized advice from our planning experts for your specific property.
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
