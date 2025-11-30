/**
 * Trust Footer Component
 * The branded footer that appears on every page
 */

'use client';

import Link from 'next/link';
import { MapPin, Phone, Mail, MessageCircle, ExternalLink } from 'lucide-react';

import { COMPANY_INFO } from '@/lib/config';

export default function Footer() {
  return (
    <footer className="bg-[#0F172A] text-white py-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Column 1: Brand */}
        <div>
          <h3 className="font-serif text-xl font-bold text-[#D4AF37] mb-4">
            HAMPSTEAD RENOVATIONS
          </h3>
          <p className="text-gray-400 text-sm mb-4">
            {COMPANY_INFO.tagline}
          </p>
          <p className="text-xs text-gray-500">
            {COMPANY_INFO.legal.copyright}
            <br />
            Registered in England & Wales.
            <br />
            Company No: {COMPANY_INFO.legal.companyNumber}
          </p>
          
          {/* Social Links */}
          <div className="flex gap-4 mt-4">
            {COMPANY_INFO.social.instagram && (
              <a
                href={COMPANY_INFO.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#D4AF37] transition"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            )}
            {COMPANY_INFO.social.facebook && (
              <a
                href={COMPANY_INFO.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#D4AF37] transition"
                aria-label="Facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
            )}
            {COMPANY_INFO.social.linkedin && (
              <a
                href={COMPANY_INFO.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#D4AF37] transition"
                aria-label="LinkedIn"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            )}
          </div>
        </div>

        {/* Column 2: Location */}
        <div>
          <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#D4AF37]" />
            Head Office & Showroom
          </h4>
          <address className="not-italic text-gray-300 text-sm leading-relaxed">
            {COMPANY_INFO.address.line1}
            <br />
            {COMPANY_INFO.address.line2}
            <br />
            {COMPANY_INFO.address.city}
            <br />
            {COMPANY_INFO.address.postcode}
          </address>
          <a
            href={COMPANY_INFO.address.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#D4AF37] text-sm mt-3 inline-flex items-center gap-1 hover:underline"
          >
            <MapPin className="w-4 h-4" />
            View on Map
            <ExternalLink className="w-3 h-3" />
          </a>
          
          {/* Opening Hours */}
          <div className="mt-4">
            <h5 className="font-semibold text-sm text-gray-200 mb-2">Opening Hours</h5>
            <p className="text-gray-400 text-sm">
              Mon - Fri: 9:00 AM - 6:00 PM
              <br />
              Sat: 10:00 AM - 4:00 PM
              <br />
              Sun: By Appointment
            </p>
          </div>
        </div>

        {/* Column 3: Contact */}
        <div>
          <h4 className="font-bold text-lg mb-4">Expert Support</h4>
          <div className="flex flex-col gap-4">
            <a
              href={COMPANY_INFO.contact.phoneLink}
              className="flex items-center gap-3 text-xl font-bold hover:text-[#D4AF37] transition"
            >
              <Phone className="w-5 h-5" />
              {COMPANY_INFO.contact.phone}
            </a>
            <a
              href={`mailto:${COMPANY_INFO.contact.email}`}
              className="flex items-center gap-3 text-gray-300 hover:text-white transition"
            >
              <Mail className="w-5 h-5" />
              {COMPANY_INFO.contact.email}
            </a>
            <a
              href={COMPANY_INFO.contact.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white font-medium transition w-fit"
            >
              <MessageCircle className="w-5 h-5" />
              Chat on WhatsApp
            </a>
          </div>

          {/* Quick Links */}
          <div className="mt-6">
            <h5 className="font-semibold text-sm text-gray-200 mb-2">Quick Links</h5>
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              <Link
                href="/privacy"
                className="text-xs text-gray-500 hover:text-white transition"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-xs text-gray-500 hover:text-white transition"
              >
                Terms of Service
              </Link>
              <Link
                href="/cookies"
                className="text-xs text-gray-500 hover:text-white transition"
              >
                Cookie Policy
              </Link>
              <Link
                href="/accessibility"
                className="text-xs text-gray-500 hover:text-white transition"
              >
                Accessibility
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-6 mt-8 pt-6 border-t border-gray-800">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>
            This heritage checker tool provides indicative guidance only. Always verify with your local planning authority.
          </p>
          <p>
            Data sources: Historic England, London Datastore, Borough Planning Portals
          </p>
        </div>
      </div>
    </footer>
  );
}

// Named export for compatibility with tests
export { Footer };
