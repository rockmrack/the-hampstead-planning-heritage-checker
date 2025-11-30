import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { COMPANY_INFO } from '@/lib/config/constants';

export const metadata: Metadata = {
  title: `Terms of Service | ${COMPANY_INFO.name}`,
  description: 'Terms of Service for the Heritage & Planning Checker service.',
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-12 max-w-4xl">
        <article className="prose prose-slate max-w-none">
          <h1 className="text-4xl font-serif font-bold text-slate-900 mb-8">
            Terms of Service
          </h1>
          
          <p className="text-slate-600 mb-8">
            Last updated: November 2024
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-800 mb-4">
              1. Acceptance of Terms
            </h2>
            <p className="text-slate-600">
              By accessing or using the Heritage & Planning Checker service provided by {COMPANY_INFO.name} 
              (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;), you agree to be bound by these Terms of Service. 
              If you do not agree to these terms, please do not use our service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-800 mb-4">
              2. Service Description
            </h2>
            <p className="text-slate-600 mb-4">
              The Heritage & Planning Checker is an informational tool that provides:
            </p>
            <ul className="list-disc pl-6 text-slate-600 space-y-2">
              <li>Listed Building status checks</li>
              <li>Conservation Area boundary information</li>
              <li>Article 4 Direction guidance</li>
              <li>Interactive mapping of heritage constraints</li>
              <li>PDF reports for planning reference</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-800 mb-4">
              3. Important Disclaimers
            </h2>
            
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
              <h3 className="text-lg font-medium text-amber-800 mb-2">
                ⚠️ Not a Substitute for Professional Advice
              </h3>
              <p className="text-amber-700">
                This service provides indicative information only and should NOT be relied upon 
                as definitive planning guidance. Always consult with qualified planning professionals 
                and your local planning authority before making any planning decisions or applications.
              </p>
            </div>

            <h3 className="text-xl font-medium text-slate-700 mb-3">
              3.1 Data Accuracy
            </h3>
            <p className="text-slate-600 mb-4">
              While we strive for accuracy, our data is sourced from third parties (Historic England, 
              local councils) and may not reflect the most recent changes. Conservation Area boundaries 
              and Listed Building designations can change. We recommend verifying all information with 
              your local planning authority.
            </p>

            <h3 className="text-xl font-medium text-slate-700 mb-3">
              3.2 Boundary Precision
            </h3>
            <p className="text-slate-600 mb-4">
              Conservation Area boundaries are approximate. Properties near boundaries may require 
              confirmation from the relevant local authority. Our 10-meter radius check for Listed 
              Buildings is indicative and does not constitute a formal curtilage assessment.
            </p>

            <h3 className="text-xl font-medium text-slate-700 mb-3">
              3.3 No Professional Relationship
            </h3>
            <p className="text-slate-600">
              Use of this service does not create a professional relationship between you and 
              {COMPANY_INFO.name}. For professional planning advice, please contact our team directly 
              to discuss your specific requirements.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-800 mb-4">
              4. Acceptable Use
            </h2>
            <p className="text-slate-600 mb-4">You agree NOT to:</p>
            <ul className="list-disc pl-6 text-slate-600 space-y-2">
              <li>Use the service for any unlawful purpose</li>
              <li>Attempt to access systems or data you are not authorized to access</li>
              <li>Interfere with the proper functioning of the service</li>
              <li>Scrape, harvest, or collect data from the service without permission</li>
              <li>Use automated systems or bots to access the service excessively</li>
              <li>Reproduce, duplicate, or resell the service without authorization</li>
              <li>Misrepresent your identity or affiliation</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-800 mb-4">
              5. Intellectual Property
            </h2>
            <p className="text-slate-600 mb-4">
              The service, including its design, code, and content, is owned by {COMPANY_INFO.name} 
              and protected by copyright and other intellectual property laws.
            </p>
            <p className="text-slate-600 mb-4">
              Data sources are attributed as follows:
            </p>
            <ul className="list-disc pl-6 text-slate-600 space-y-2">
              <li>Listed Buildings data: © Historic England</li>
              <li>Conservation Area data: © Respective Local Authorities</li>
              <li>Mapping: © Mapbox © OpenStreetMap contributors</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-800 mb-4">
              6. Limitation of Liability
            </h2>
            <p className="text-slate-600 mb-4">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW:
            </p>
            <ul className="list-disc pl-6 text-slate-600 space-y-2">
              <li>
                The service is provided &ldquo;as is&rdquo; without warranties of any kind, either 
                express or implied
              </li>
              <li>
                We do not warrant that the service will be uninterrupted, error-free, or 
                completely secure
              </li>
              <li>
                We shall not be liable for any indirect, incidental, special, consequential, 
                or punitive damages
              </li>
              <li>
                Our total liability for any claims shall not exceed the amount paid by you 
                (if any) for using the service
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-800 mb-4">
              7. Indemnification
            </h2>
            <p className="text-slate-600">
              You agree to indemnify and hold harmless {COMPANY_INFO.name}, its officers, directors, 
              employees, and agents from any claims, damages, losses, or expenses arising from your 
              use of the service or violation of these terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-800 mb-4">
              8. Service Modifications
            </h2>
            <p className="text-slate-600">
              We reserve the right to modify, suspend, or discontinue the service at any time 
              without notice. We may also modify these Terms at any time. Continued use after 
              changes constitutes acceptance of modified terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-800 mb-4">
              9. Third-Party Links
            </h2>
            <p className="text-slate-600">
              Our service may contain links to third-party websites or services. We are not 
              responsible for the content, privacy practices, or terms of any third-party sites.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-800 mb-4">
              10. Termination
            </h2>
            <p className="text-slate-600">
              We may terminate or suspend your access to the service immediately, without prior 
              notice, for conduct that we believe violates these Terms or is harmful to other 
              users, us, or third parties, or for any other reason at our sole discretion.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-800 mb-4">
              11. Governing Law
            </h2>
            <p className="text-slate-600">
              These Terms shall be governed by and construed in accordance with the laws of 
              England and Wales. Any disputes shall be subject to the exclusive jurisdiction 
              of the courts of England and Wales.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-800 mb-4">
              12. Severability
            </h2>
            <p className="text-slate-600">
              If any provision of these Terms is found to be unenforceable, the remaining 
              provisions will continue in full force and effect.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-800 mb-4">
              13. Contact Information
            </h2>
            <p className="text-slate-600">
              For questions about these Terms of Service, contact us at:
            </p>
            <address className="not-italic text-slate-600 mt-4">
              <strong>{COMPANY_INFO.name}</strong><br />
              {COMPANY_INFO.address.full}<br />
              Email: <a href={`mailto:${COMPANY_INFO.contact.email}`} className="text-primary-600 hover:underline">{COMPANY_INFO.contact.email}</a><br />
              Phone: <a href={`tel:${COMPANY_INFO.contact.phone}`} className="text-primary-600 hover:underline">{COMPANY_INFO.contact.phone}</a>
            </address>
          </section>

          <div className="mt-12 pt-8 border-t border-slate-200 flex gap-4">
            <Link 
              href="/"
              className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
            >
              ← Back to Heritage Checker
            </Link>
            <span className="text-slate-300">|</span>
            <Link 
              href="/privacy"
              className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
            >
              Privacy Policy →
            </Link>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
