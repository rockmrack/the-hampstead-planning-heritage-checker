import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { COMPANY_INFO, BOROUGHS } from '@/lib/config/constants';

export const metadata: Metadata = {
  title: `About Us | ${COMPANY_INFO.name}`,
  description: 'Learn about the Heritage & Planning Checker and our expertise in heritage planning consultancy.',
};

export default function AboutPage() {
  const stats = [
    { value: '15+', label: 'Years Experience' },
    { value: '500+', label: 'Projects Completed' },
    { value: '95%', label: 'Success Rate' },
    { value: '5', label: 'Borough Coverage' },
  ];

  const services = [
    {
      title: 'Listed Building Consent',
      description: 'Expert guidance on alterations to Grade I, II*, and II listed buildings.',
      icon: '🏛️',
    },
    {
      title: 'Conservation Area Planning',
      description: 'Navigate conservation area restrictions and Article 4 Directions.',
      icon: '🏡',
    },
    {
      title: 'Heritage Impact Assessments',
      description: 'Comprehensive assessments for planning applications.',
      icon: '📋',
    },
    {
      title: 'Planning Appeals',
      description: 'Support for planning appeals and enforcement matters.',
      icon: '⚖️',
    },
    {
      title: 'Design Consultancy',
      description: 'Sensitive design solutions respecting heritage character.',
      icon: '✏️',
    },
    {
      title: 'Pre-Application Advice',
      description: 'Strategic pre-application discussions with councils.',
      icon: '💬',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 text-white py-20">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">
                Heritage Planning Expertise You Can Trust
              </h1>
              <p className="text-xl text-primary-100 mb-8">
                With over 15 years of experience navigating London&apos;s complex heritage landscape, 
                we help homeowners and developers achieve their planning ambitions while respecting 
                our built heritage.
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 bg-accent-500 text-primary-900 px-6 py-3 rounded-lg font-semibold hover:bg-accent-400 transition-colors"
              >
                Try Our Free Heritage Checker
                <span>→</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-white border-b">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-primary-600 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-slate-600 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* About the Tool Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-serif font-bold text-slate-900 mb-6">
                  About the Heritage Checker
                </h2>
                <p className="text-slate-600 mb-4">
                  Our Heritage & Planning Checker is a free tool designed to give homeowners and 
                  property professionals instant insight into the heritage constraints affecting 
                  any property in North West and North London.
                </p>
                <p className="text-slate-600 mb-4">
                  Using data from Historic England and local council records, combined with 
                  advanced spatial analysis, we provide accurate information about:
                </p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-3">
                    <span className="text-status-red font-bold">🏛️</span>
                    <span className="text-slate-600">
                      <strong>Listed Buildings</strong> - Whether your property is a listed building 
                      (Grade I, II*, or II)
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-status-amber font-bold">🍂</span>
                    <span className="text-slate-600">
                      <strong>Conservation Areas</strong> - If your property falls within a 
                      designated conservation area
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-status-amber font-bold">📋</span>
                    <span className="text-slate-600">
                      <strong>Article 4 Directions</strong> - Any additional restrictions on 
                      permitted development rights
                    </span>
                  </li>
                </ul>
                <p className="text-sm text-slate-500 italic">
                  Note: This tool provides indicative information and should not replace 
                  professional planning advice.
                </p>
              </div>
              <div className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl p-8 h-80 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">🗺️</div>
                  <p className="text-slate-600">Interactive Heritage Map</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Coverage Area Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 max-w-6xl">
            <h2 className="text-3xl font-serif font-bold text-slate-900 mb-8 text-center">
              Our Coverage Area
            </h2>
            <p className="text-center text-slate-600 mb-12 max-w-2xl mx-auto">
              We specialize in heritage planning consultancy across North West and North London, 
              covering the following boroughs:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {Object.entries(BOROUGHS).map(([key, borough]) => (
                <div 
                  key={key}
                  className="bg-slate-50 rounded-lg p-4 text-center hover:shadow-md transition-shadow"
                >
                  <h3 className="font-semibold text-slate-900">{borough.name}</h3>
                  <p className="text-sm text-slate-500">{borough.postcodes.slice(0, 3).join(', ')}...</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-16 bg-slate-100">
          <div className="container mx-auto px-4 max-w-6xl">
            <h2 className="text-3xl font-serif font-bold text-slate-900 mb-4 text-center">
              Our Services
            </h2>
            <p className="text-center text-slate-600 mb-12 max-w-2xl mx-auto">
              Beyond the free Heritage Checker, we offer comprehensive planning consultancy services 
              for heritage properties.
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service, index) => (
                <div 
                  key={index}
                  className="bg-white rounded-xl p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="text-4xl mb-4">{service.icon}</div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">
                    {service.title}
                  </h3>
                  <p className="text-slate-600">{service.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-primary-900 text-white">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <h2 className="text-3xl font-serif font-bold mb-6">
              Ready to Start Your Heritage Project?
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              Whether you&apos;re planning renovations, an extension, or a change of use, 
              our team is here to guide you through the planning process.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 bg-accent-500 text-primary-900 px-8 py-4 rounded-lg font-semibold hover:bg-accent-400 transition-colors"
              >
                Check Your Property
              </Link>
              <a
                href={`mailto:${COMPANY_INFO.contact.email}`}
                className="inline-flex items-center justify-center gap-2 bg-white/10 text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/20 transition-colors"
              >
                Contact Us
              </a>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl font-serif font-bold text-slate-900 mb-6">
                  Get in Touch
                </h2>
                <p className="text-slate-600 mb-8">
                  Have questions about your heritage property? Our team of experienced planning 
                  consultants is ready to help.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <span className="text-2xl">📍</span>
                    <div>
                      <h3 className="font-semibold text-slate-900">Address</h3>
                      <p className="text-slate-600">{COMPANY_INFO.address.full}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <span className="text-2xl">📧</span>
                    <div>
                      <h3 className="font-semibold text-slate-900">Email</h3>
                      <a 
                        href={`mailto:${COMPANY_INFO.contact.email}`}
                        className="text-primary-600 hover:underline"
                      >
                        {COMPANY_INFO.contact.email}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <span className="text-2xl">📞</span>
                    <div>
                      <h3 className="font-semibold text-slate-900">Phone</h3>
                      <a 
                        href={`tel:${COMPANY_INFO.contact.phone}`}
                        className="text-primary-600 hover:underline"
                      >
                        {COMPANY_INFO.contact.phone}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <span className="text-2xl">🕒</span>
                    <div>
                      <h3 className="font-semibold text-slate-900">Office Hours</h3>
                      <p className="text-slate-600">Monday - Friday: 9:00 AM - 6:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-slate-100 rounded-2xl p-8">
                <h3 className="text-xl font-semibold text-slate-900 mb-6">
                  Request a Consultation
                </h3>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="you@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Property Address
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Property address"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Message
                    </label>
                    <textarea
                      rows={4}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Tell us about your project..."
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
