/**
 * Neighbor Notification Page
 * Proactive neighbor engagement for planning applications
 */

import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Neighbor Notification | Planning Consultation | The Hampstead Planning & Heritage Checker',
  description: 'Proactively engage neighbors before submitting your planning application. Reduce objections and build community support in Hampstead and NW London.',
  keywords: 'neighbor notification, planning objections, party wall, neighbor consultation, planning support',
};

const NOTIFICATION_TEMPLATES = [
  {
    id: 'initial-notice',
    name: 'Initial Introduction Letter',
    description: 'Introduce yourself and explain your planned development',
    timing: '4-6 weeks before submission',
  },
  {
    id: 'detailed-plans',
    name: 'Detailed Plans Sharing',
    description: 'Share drawings and answer questions',
    timing: '2-3 weeks before submission',
  },
  {
    id: 'thank-you',
    name: 'Thank You & Update',
    description: 'Thank neighbors and provide timeline',
    timing: 'After submission',
  },
  {
    id: 'completion',
    name: 'Completion Notice',
    description: 'Let neighbors know work is finishing',
    timing: '2 weeks before completion',
  },
];

const OBJECTION_REASONS = [
  {
    reason: 'Loss of Light',
    percentage: 34,
    howToAddress: 'Commission a daylight/sunlight report. Share 45-degree rule compliance.',
  },
  {
    reason: 'Overlooking',
    percentage: 28,
    howToAddress: 'Show window positions and screening measures. Offer obscured glazing.',
  },
  {
    reason: 'Noise Disruption',
    percentage: 18,
    howToAddress: 'Share construction management plan with work hours and dust control.',
  },
  {
    reason: 'Size/Scale',
    percentage: 12,
    howToAddress: 'Reference similar approved extensions on the street.',
  },
  {
    reason: 'Parking Impact',
    percentage: 8,
    howToAddress: 'Provide parking survey and construction vehicle plan.',
  },
];

const SUCCESS_STORIES = [
  {
    location: 'Flask Walk, Hampstead',
    project: 'Rear Extension + Basement',
    neighbors: 6,
    initialConcerns: 3,
    finalObjections: 0,
    quote: 'Early engagement turned potential objectors into supporters.',
  },
  {
    location: 'The Grove, Highgate',
    project: 'Loft Conversion with Dormer',
    neighbors: 4,
    initialConcerns: 2,
    finalObjections: 0,
    quote: 'Sharing our plans early helped neighbors understand the minimal impact.',
  },
  {
    location: 'Muswell Hill Road',
    project: 'Double Storey Rear',
    neighbors: 5,
    initialConcerns: 4,
    finalObjections: 1,
    quote: 'We modified our design based on feedback, reducing overlooking concerns.',
  },
];

export default function NeighborNotificationPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-orange-900 text-white py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <span className="inline-block bg-orange-800 text-orange-100 px-4 py-1 rounded-full text-sm font-medium mb-4">
              Prevent Objections • Build Support
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Neighbor Notification System
            </h1>
            <p className="text-xl text-orange-100 max-w-3xl mx-auto">
              Proactively engage with neighbors before submitting your planning application. 
              Reduce objections and turn potential opponents into supporters.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-8 px-4 bg-orange-50 border-b border-orange-100">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-orange-600">73%</div>
              <div className="text-gray-600 text-sm">Fewer Objections</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600">4 weeks</div>
              <div className="text-gray-600 text-sm">Faster Decisions</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600">89%</div>
              <div className="text-gray-600 text-sm">Neighbor Satisfaction</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600">95%</div>
              <div className="text-gray-600 text-sm">Approval Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Why It Matters */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Neighbor Engagement Matters
          </h2>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-red-50 rounded-xl p-8 border border-red-200">
              <h3 className="font-bold text-xl mb-4 text-red-700">
                ❌ Without Neighbor Engagement
              </h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex gap-2">
                  <span className="text-red-500">•</span>
                  Neighbors surprised by formal council letters
                </li>
                <li className="flex gap-2">
                  <span className="text-red-500">•</span>
                  Fear and assumptions lead to objections
                </li>
                <li className="flex gap-2">
                  <span className="text-red-500">•</span>
                  Application referred to committee
                </li>
                <li className="flex gap-2">
                  <span className="text-red-500">•</span>
                  Delays and potential refusal
                </li>
                <li className="flex gap-2">
                  <span className="text-red-500">•</span>
                  Damaged relationships for years
                </li>
              </ul>
            </div>

            <div className="bg-emerald-50 rounded-xl p-8 border border-emerald-200">
              <h3 className="font-bold text-xl mb-4 text-emerald-700">
                ✅ With Neighbor Engagement
              </h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex gap-2">
                  <span className="text-emerald-500">•</span>
                  Neighbors feel respected and informed
                </li>
                <li className="flex gap-2">
                  <span className="text-emerald-500">•</span>
                  Concerns addressed before submission
                </li>
                <li className="flex gap-2">
                  <span className="text-emerald-500">•</span>
                  Delegated officer approval more likely
                </li>
                <li className="flex gap-2">
                  <span className="text-emerald-500">•</span>
                  Faster decision times
                </li>
                <li className="flex gap-2">
                  <span className="text-emerald-500">•</span>
                  Good community relationships maintained
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Notification Templates */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Notification Templates
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {NOTIFICATION_TEMPLATES.map(template => (
              <div 
                key={template.id}
                className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <div className="text-3xl mb-4">📬</div>
                <h3 className="font-bold text-lg mb-2">{template.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{template.description}</p>
                <div className="bg-orange-50 rounded-lg px-3 py-2 text-sm text-orange-700">
                  📅 {template.timing}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <button className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-8 py-4 rounded-lg transition-colors">
              Download All Templates
            </button>
          </div>
        </div>
      </section>

      {/* Top Objection Reasons */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">
            Top Reasons Neighbors Object
          </h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Understanding common concerns helps you address them proactively in your neighbor communications.
          </p>

          <div className="space-y-4">
            {OBJECTION_REASONS.map((item, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center gap-6">
                  <div className="w-32 flex-shrink-0">
                    <div className="text-3xl font-bold text-orange-600">{item.percentage}%</div>
                    <div className="h-2 bg-gray-100 rounded-full mt-2">
                      <div 
                        className="h-2 bg-orange-500 rounded-full"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{item.reason}</h3>
                    <p className="text-gray-600 text-sm mt-1">
                      <span className="font-medium text-emerald-600">How to address: </span>
                      {item.howToAddress}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-16 px-4 bg-orange-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Success Stories
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {SUCCESS_STORIES.map((story, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl p-6 border border-orange-200"
              >
                <div className="text-sm text-gray-500 mb-2">📍 {story.location}</div>
                <h3 className="font-bold text-lg mb-4">{story.project}</h3>
                
                <div className="grid grid-cols-3 gap-2 text-center mb-4 bg-gray-50 rounded-lg p-3">
                  <div>
                    <div className="text-lg font-bold">{story.neighbors}</div>
                    <div className="text-xs text-gray-500">Neighbors</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-amber-600">{story.initialConcerns}</div>
                    <div className="text-xs text-gray-500">Initial Concerns</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-emerald-600">{story.finalObjections}</div>
                    <div className="text-xs text-gray-500">Final Objections</div>
                  </div>
                </div>
                
                <blockquote className="text-gray-600 italic text-sm border-l-4 border-orange-300 pl-4">
                  &ldquo;{story.quote}&rdquo;
                </blockquote>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Recommended Engagement Timeline
          </h2>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-orange-200" />

            <div className="space-y-8">
              <div className="relative flex gap-6">
                <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 z-10">
                  1
                </div>
                <div className="bg-white rounded-xl p-6 border border-gray-200 flex-1">
                  <h3 className="font-bold text-lg">6 Weeks Before Submission</h3>
                  <p className="text-gray-600">
                    Send initial introduction letter. Explain who you are and what you&apos;re planning. 
                    Offer to discuss informally.
                  </p>
                </div>
              </div>

              <div className="relative flex gap-6">
                <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 z-10">
                  2
                </div>
                <div className="bg-white rounded-xl p-6 border border-gray-200 flex-1">
                  <h3 className="font-bold text-lg">4 Weeks Before Submission</h3>
                  <p className="text-gray-600">
                    Share draft drawings with affected neighbors. Host a coffee morning or 
                    drop-in session to answer questions.
                  </p>
                </div>
              </div>

              <div className="relative flex gap-6">
                <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 z-10">
                  3
                </div>
                <div className="bg-white rounded-xl p-6 border border-gray-200 flex-1">
                  <h3 className="font-bold text-lg">2 Weeks Before Submission</h3>
                  <p className="text-gray-600">
                    Address any concerns raised. Consider design amendments if reasonable. 
                    Thank neighbors for their input.
                  </p>
                </div>
              </div>

              <div className="relative flex gap-6">
                <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 z-10">
                  4
                </div>
                <div className="bg-white rounded-xl p-6 border border-gray-200 flex-1">
                  <h3 className="font-bold text-lg">At Submission</h3>
                  <p className="text-gray-600">
                    Let neighbors know you&apos;ve submitted. Provide application reference number. 
                    Share construction management plan if work is approved.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-orange-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Start Your Neighbor Notification Campaign
          </h2>
          <p className="text-xl text-orange-100 mb-8">
            We&apos;ll identify all affected neighbors and generate customized notification letters.
          </p>
          <Link 
            href="/"
            className="inline-block bg-white text-orange-600 hover:bg-orange-50 font-semibold px-8 py-4 rounded-lg transition-colors"
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
