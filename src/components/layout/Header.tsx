/**
 * Header Component
 * Navigation and branding header
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Phone, MapPin } from 'lucide-react';

import { COMPANY_INFO } from '@/lib/config';
import { cn } from '@/lib/utils';

interface NavLink {
  href: string;
  label: string;
}

const navLinks: NavLink[] = [
  { href: '/', label: 'Heritage Checker' },
  { href: '/about', label: 'About Us' },
  { href: '/services', label: 'Our Services' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/contact', label: 'Contact' },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      {/* Top Bar */}
      <div className="bg-[#0F172A] text-white py-2 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-sm">
          <div className="flex items-center gap-4">
            <a
              href={COMPANY_INFO.contact.phoneLink}
              className="flex items-center gap-1 hover:text-[#D4AF37] transition"
            >
              <Phone className="w-4 h-4" />
              <span className="hidden sm:inline">{COMPANY_INFO.contact.phone}</span>
            </a>
            <span className="hidden md:flex items-center gap-1 text-gray-400">
              <MapPin className="w-4 h-4" />
              {COMPANY_INFO.address.postcode}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-400 hidden sm:inline">
              Mon-Fri 9AM-6PM
            </span>
            <a
              href={`mailto:${COMPANY_INFO.contact.email}`}
              className="hover:text-[#D4AF37] transition"
            >
              {COMPANY_INFO.contact.email}
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="flex flex-col">
              <span className="font-serif text-xl font-bold text-[#0F172A]">
                HAMPSTEAD
              </span>
              <span className="font-serif text-sm font-bold text-[#D4AF37] -mt-1">
                RENOVATIONS
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-700 hover:text-[#D4AF37] font-medium transition"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden lg:flex items-center gap-4">
            <Link
              href="/consultation"
              className="btn-primary"
            >
              Book Consultation
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          className={cn(
            'lg:hidden transition-all duration-300 overflow-hidden',
            mobileMenuOpen ? 'max-h-96 mt-4' : 'max-h-0'
          )}
        >
          <div className="flex flex-col gap-2 py-4 border-t border-gray-200">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-gray-700 hover:text-[#D4AF37] hover:bg-gray-50 rounded-lg font-medium transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="px-4 pt-4 border-t border-gray-200 mt-2">
              <Link
                href="/consultation"
                className="btn-primary w-full text-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Book Consultation
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
