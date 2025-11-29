/**
 * Heritage Checker Home Page
 * The main landing page with split-screen search and map interface
 */

'use client';

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { toast, Toaster } from 'react-hot-toast';
import { ArrowRight, Shield, Clock, Award, CheckCircle } from 'lucide-react';

import { AddressSearch, StatusCard } from '@/components/search';
import { LeadCaptureModal } from '@/components/forms';
import { LoadingSpinner, ErrorBoundary } from '@/components/ui';
import { generatePropertyReport, downloadPDF, generatePDFFilename } from '@/services/pdf-generator';
import { COMPANY_INFO } from '@/lib/config';
import type { GeocodingResult, PropertyCheckResult, PropertyStatus } from '@/types';

// Dynamically import map to avoid SSR issues
const HeritageMap = dynamic(
  () => import('@/components/map/HeritageMap'),
  {
    loading: () => (
      <div className="w-full h-full min-h-[400px] flex items-center justify-center bg-gray-100 rounded-lg">
        <LoadingSpinner size="lg" />
      </div>
    ),
    ssr: false,
  }
);

export default function HomePage() {
  const [searchResult, setSearchResult] = useState<PropertyCheckResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);

  // Handle address selection and property check
  const handleAddressSelect = useCallback(async (result: GeocodingResult) => {
    setIsLoading(true);
    setSearchResult(null);

    try {
      const response = await fetch('/api/check-property', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address: result.placeName,
          postcode: result.postcode,
          coordinates: result.coordinates,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? 'Failed to check property');
      }

      setSearchResult(data.data);
      
      // Show toast based on status
      const statusMessages: Record<PropertyStatus, string> = {
        RED: '🏛️ This property is a Listed Building',
        AMBER: '🍂 This property is in a Conservation Area',
        GREEN: '✅ Standard planning zone - more flexibility available',
      };
      
      toast.success(statusMessages[data.data.status as PropertyStatus]);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An error occurred';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Handle PDF download
  const handleDownloadPDF = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  // Handle lead form submission and PDF generation
  const handleLeadSubmit = useCallback(async (formData: { email: string; name?: string; phone?: string; marketingConsent: boolean }) => {
    if (!searchResult) {
      return;
    }

    setIsPdfGenerating(true);

    try {
      // Capture the lead
      await fetch('/api/lead-capture', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          name: formData.name,
          phone: formData.phone,
          searchId: searchResult.searchId,
          source: 'pdf_download',
          propertyAddress: searchResult.address,
          propertyStatus: searchResult.status,
          marketingConsent: formData.marketingConsent,
        }),
      });

      // Generate PDF
      const pdfBlob = await generatePropertyReport({
        propertyResult: searchResult,
        userEmail: formData.email,
        generatedAt: new Date().toISOString(),
      });

      // Download PDF
      const filename = generatePDFFilename(searchResult);
      downloadPDF(pdfBlob, filename);

      toast.success('Report downloaded successfully!');
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error('Failed to generate report. Please try again.');
      throw error;
    } finally {
      setIsPdfGenerating(false);
    }
  }, [searchResult]);

  // Handle consultation booking
  const handleBookConsultation = useCallback(() => {
    window.location.href = '/consultation';
  }, []);

  return (
    <>
      <Toaster position="top-center" />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#0F172A] to-slate-800 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1 bg-[#D4AF37]/20 text-[#D4AF37] rounded-full text-sm font-medium mb-4">
              Free Heritage & Planning Check
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6 text-balance">
              Is Your Property Listed or in a{' '}
              <span className="text-[#D4AF37]">Conservation Area?</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Instantly discover the heritage and planning status of any property in North West London.
              Get expert guidance on what you can and cannot do.
            </p>
          </motion.div>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-6 mt-8">
            <div className="flex items-center gap-2 text-gray-400">
              <Shield className="w-5 h-5 text-[#D4AF37]" />
              <span className="text-sm">Same data as Planning Officers</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Clock className="w-5 h-5 text-[#D4AF37]" />
              <span className="text-sm">Results in seconds</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Award className="w-5 h-5 text-[#D4AF37]" />
              <span className="text-sm">100% Free</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content - Split Screen */}
      <section className="max-w-7xl mx-auto px-4 py-8 -mt-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid lg:grid-cols-2 min-h-[600px]">
            {/* Left Panel - Search & Results */}
            <div className="p-6 lg:p-8 border-r border-gray-100 flex flex-col">
              {/* Search Input */}
              <div className="mb-6">
                <h2 className="text-2xl font-serif font-bold text-gray-900 mb-2">
                  Check Your Property
                </h2>
                <p className="text-gray-600 mb-4">
                  Enter any address in NW London to discover its heritage status
                </p>
                <AddressSearch
                  onSelect={handleAddressSelect}
                  disabled={isLoading}
                />
              </div>

              {/* Results Area */}
              <div className="flex-1">
                <AnimatePresence mode="wait">
                  {isLoading && (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center justify-center h-full py-12"
                    >
                      <LoadingSpinner size="lg" />
                      <p className="text-gray-600 mt-4">Analyzing property...</p>
                      <p className="text-gray-400 text-sm mt-1">
                        Checking Listed Buildings & Conservation Areas
                      </p>
                    </motion.div>
                  )}

                  {!isLoading && searchResult && (
                    <motion.div
                      key="result"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                    >
                      <ErrorBoundary>
                        <StatusCard
                          result={searchResult}
                          onDownloadPDF={handleDownloadPDF}
                          onBookConsultation={handleBookConsultation}
                          className="card"
                        />
                      </ErrorBoundary>
                    </motion.div>
                  )}

                  {!isLoading && !searchResult && (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center justify-center h-full py-12 text-center"
                    >
                      <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                        <svg
                          className="w-10 h-10 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Search for a Property
                      </h3>
                      <p className="text-gray-500 max-w-xs">
                        Enter an address above to check if it&apos;s in a Conservation Area or Listed
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Right Panel - Map */}
            <div className="relative min-h-[400px] lg:min-h-0">
              <ErrorBoundary>
                <HeritageMap
                  className="absolute inset-0"
                  searchResult={searchResult}
                  showLegend={true}
                />
              </ErrorBoundary>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">
              Why Use Our Heritage Checker?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We use the same official data sources as Local Planning Authorities, giving you accurate,
              reliable information about your property&apos;s planning status.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Shield className="w-8 h-8" />,
                title: 'Official Data Sources',
                description:
                  'We pull directly from Historic England and London Borough records - the same sources used by planning officers.',
              },
              {
                icon: <Clock className="w-8 h-8" />,
                title: 'Instant Results',
                description:
                  'No more waiting for council responses. Get your property status in seconds, not weeks.',
              },
              {
                icon: <Award className="w-8 h-8" />,
                title: 'Expert Interpretation',
                description:
                  'We translate complex planning jargon into clear guidance on what you can and cannot do.',
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card p-6 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-[#D4AF37]/10 flex items-center justify-center mx-auto mb-4 text-[#D4AF37]">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Coverage Area Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">
                Covering North West London&apos;s Premium Belt
              </h2>
              <p className="text-gray-600 mb-6">
                Our checker covers the most sought-after areas in North West London, where heritage
                considerations are most critical for property owners and developers.
              </p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  { area: 'Hampstead', postcodes: 'NW3' },
                  { area: 'Primrose Hill', postcodes: 'NW1' },
                  { area: 'St John\'s Wood', postcodes: 'NW8' },
                  { area: 'Hampstead Garden Suburb', postcodes: 'NW11' },
                  { area: 'Highgate', postcodes: 'N6' },
                  { area: 'Muswell Hill', postcodes: 'N10' },
                ].map((location) => (
                  <div key={location.area} className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-gray-700">
                      <strong>{location.area}</strong>{' '}
                      <span className="text-gray-500">({location.postcodes})</span>
                    </span>
                  </div>
                ))}
              </div>

              <a
                href="/consultation"
                className="btn-primary inline-flex items-center gap-2"
              >
                Book a Free Consultation
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            <div className="bg-gray-100 rounded-2xl p-8">
              <h3 className="font-bold text-gray-900 mb-4">Our Expertise</h3>
              <ul className="space-y-3">
                {[
                  'Successfully delivered 200+ projects in Conservation Areas',
                  'Listed Building Consent specialists',
                  'Pre-application advice services',
                  'Planning appeals support',
                  'Heritage Impact Assessments',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#0F172A] text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
            Ready to Start Your Project?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Whether your property is Listed, in a Conservation Area, or standard zone, we can help you
            navigate the planning process.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={COMPANY_INFO.contact.phoneLink} className="btn-primary text-lg">
              Call {COMPANY_INFO.contact.phone}
            </a>
            <a href="/consultation" className="btn-outline border-white text-white hover:bg-white hover:text-[#0F172A] text-lg">
              Book Consultation
            </a>
          </div>
        </div>
      </section>

      {/* Lead Capture Modal */}
      {searchResult && (
        <LeadCaptureModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleLeadSubmit}
          propertyResult={searchResult}
          isLoading={isPdfGenerating}
        />
      )}
    </>
  );
}
