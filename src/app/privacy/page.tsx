import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { COMPANY_INFO } from '@/lib/config/constants';

export const metadata: Metadata = {
  title: `Privacy Policy | ${COMPANY_INFO.name}`,
  description: 'Privacy Policy for the Heritage & Planning Checker service.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-12 max-w-4xl">
        <article className="prose prose-slate max-w-none">
          <h1 className="text-4xl font-serif font-bold text-slate-900 mb-8">
            Privacy Policy
          </h1>
          
          <p className="text-slate-600 mb-8">
            Last updated: November 2024
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-800 mb-4">
              1. Introduction
            </h2>
            <p className="text-slate-600 mb-4">
              {COMPANY_INFO.name} (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;) is committed to protecting 
              your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard 
              your information when you use our Heritage & Planning Checker service.
            </p>
            <p className="text-slate-600">
              Please read this privacy policy carefully. By using our service, you consent to the 
              practices described in this policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-800 mb-4">
              2. Information We Collect
            </h2>
            
            <h3 className="text-xl font-medium text-slate-700 mb-3">
              2.1 Information You Provide
            </h3>
            <ul className="list-disc pl-6 text-slate-600 mb-4 space-y-2">
              <li>Property addresses entered in the search tool</li>
              <li>Email address (when downloading reports)</li>
              <li>Name (optional, when downloading reports)</li>
              <li>Phone number (optional, for consultation requests)</li>
            </ul>

            <h3 className="text-xl font-medium text-slate-700 mb-3">
              2.2 Automatically Collected Information
            </h3>
            <ul className="list-disc pl-6 text-slate-600 space-y-2">
              <li>IP address (anonymized/hashed)</li>
              <li>Browser type and version</li>
              <li>Device information</li>
              <li>Pages visited and time spent</li>
              <li>Search queries and results</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-800 mb-4">
              3. How We Use Your Information
            </h2>
            <p className="text-slate-600 mb-4">We use the collected information to:</p>
            <ul className="list-disc pl-6 text-slate-600 space-y-2">
              <li>Provide property planning status checks</li>
              <li>Generate and deliver PDF reports</li>
              <li>Respond to consultation requests</li>
              <li>Improve our service and user experience</li>
              <li>Analyze usage patterns and trends</li>
              <li>Prevent fraud and ensure security</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-800 mb-4">
              4. Data Sharing
            </h2>
            <p className="text-slate-600 mb-4">
              We do not sell your personal information. We may share data with:
            </p>
            <ul className="list-disc pl-6 text-slate-600 space-y-2">
              <li>
                <strong>Service providers:</strong> Third-party services that help us operate 
                (e.g., hosting, analytics)
              </li>
              <li>
                <strong>Legal requirements:</strong> When required by law or to protect our rights
              </li>
              <li>
                <strong>Business transfers:</strong> In the event of a merger, acquisition, or sale
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-800 mb-4">
              5. Third-Party Services
            </h2>
            <p className="text-slate-600 mb-4">Our service uses the following third-party services:</p>
            <ul className="list-disc pl-6 text-slate-600 space-y-2">
              <li>
                <strong>Mapbox:</strong> For geocoding and map display 
                (<a href="https://www.mapbox.com/legal/privacy" className="text-primary-600 hover:underline" target="_blank" rel="noopener noreferrer">Privacy Policy</a>)
              </li>
              <li>
                <strong>Supabase:</strong> For data storage 
                (<a href="https://supabase.com/privacy" className="text-primary-600 hover:underline" target="_blank" rel="noopener noreferrer">Privacy Policy</a>)
              </li>
              <li>
                <strong>Vercel:</strong> For hosting 
                (<a href="https://vercel.com/legal/privacy-policy" className="text-primary-600 hover:underline" target="_blank" rel="noopener noreferrer">Privacy Policy</a>)
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-800 mb-4">
              6. Data Retention
            </h2>
            <p className="text-slate-600">
              We retain search logs for analytics purposes for up to 24 months. Personal contact 
              information is retained for as long as necessary to provide services and comply with 
              legal obligations. You may request deletion of your data at any time.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-800 mb-4">
              7. Your Rights (GDPR)
            </h2>
            <p className="text-slate-600 mb-4">Under GDPR, you have the right to:</p>
            <ul className="list-disc pl-6 text-slate-600 space-y-2">
              <li>Access your personal data</li>
              <li>Rectify inaccurate data</li>
              <li>Request erasure of your data</li>
              <li>Restrict processing</li>
              <li>Data portability</li>
              <li>Object to processing</li>
              <li>Withdraw consent</li>
            </ul>
            <p className="text-slate-600 mt-4">
              To exercise these rights, contact us at{' '}
              <a href={`mailto:${COMPANY_INFO.contact.email}`} className="text-primary-600 hover:underline">
                {COMPANY_INFO.contact.email}
              </a>
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-800 mb-4">
              8. Cookies
            </h2>
            <p className="text-slate-600">
              We use essential cookies for service functionality and analytics cookies to understand 
              usage. You can control cookie settings through your browser. Disabling essential 
              cookies may affect service functionality.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-800 mb-4">
              9. Security
            </h2>
            <p className="text-slate-600">
              We implement industry-standard security measures including encryption, secure hosting, 
              and access controls. However, no method of transmission over the Internet is 100% 
              secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-800 mb-4">
              10. Children&apos;s Privacy
            </h2>
            <p className="text-slate-600">
              Our service is not intended for children under 16. We do not knowingly collect 
              information from children under 16. If you believe we have collected such information, 
              please contact us immediately.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-800 mb-4">
              11. Changes to This Policy
            </h2>
            <p className="text-slate-600">
              We may update this policy periodically. We will notify you of significant changes 
              by posting a notice on our website. Your continued use of the service after changes 
              constitutes acceptance of the updated policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-800 mb-4">
              12. Contact Us
            </h2>
            <p className="text-slate-600">
              For questions about this Privacy Policy or our data practices, contact us at:
            </p>
            <address className="not-italic text-slate-600 mt-4">
              <strong>{COMPANY_INFO.name}</strong><br />
              {COMPANY_INFO.address.full}<br />
              Email: <a href={`mailto:${COMPANY_INFO.contact.email}`} className="text-primary-600 hover:underline">{COMPANY_INFO.contact.email}</a><br />
              Phone: <a href={`tel:${COMPANY_INFO.contact.phone}`} className="text-primary-600 hover:underline">{COMPANY_INFO.contact.phone}</a>
            </address>
          </section>

          <div className="mt-12 pt-8 border-t border-slate-200">
            <Link 
              href="/"
              className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
            >
              ← Back to Heritage Checker
            </Link>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
