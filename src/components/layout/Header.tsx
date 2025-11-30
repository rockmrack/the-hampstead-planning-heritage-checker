/**
 * Header Component
 * Navigation and branding header with mega menu
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Phone, MapPin, ChevronDown } from 'lucide-react';

import { COMPANY_INFO } from '@/lib/config';
import { cn } from '@/lib/utils';

interface NavLink {
  href: string;
  label: string;
  children?: { href: string; label: string; description?: string }[];
}

const navLinks: NavLink[] = [
  { href: '/', label: 'Heritage Checker' },
  { 
    href: '/planning-tools', 
    label: 'Planning Tools',
    children: [
      { href: '/calculator', label: 'ROI Calculator', description: 'Calculate extension value increase' },
      { href: '/ask', label: 'Ask Questions', description: 'Natural language planning Q&A' },
      { href: '/can-i', label: 'Can I Build...?', description: 'Check what you can build' },
      { href: '/views', label: 'Protected Views', description: 'View corridor impact checker' },
      { href: '/neighbors', label: 'Neighbor Notification', description: 'Reduce objections' },
    ]
  },
  {
    href: '/local-intelligence',
    label: 'Local Intelligence',
    children: [
      { href: '/areas', label: 'Area Guides', description: 'NW London planning intelligence' },
      { href: '/conservation-areas', label: 'Conservation Areas', description: 'Detailed area profiles' },
      { href: '/street-history', label: 'Street Precedents', description: 'See what\'s been approved' },
      { href: '/officers', label: 'Officer Profiles', description: 'Know your planning officer' },
    ]
  },
  {
    href: '/resources',
    label: 'Resources',
    children: [
      { href: '/projects', label: 'Project Gallery', description: 'Before/after photos' },
      { href: '/builders', label: 'Compare Builders', description: 'Vetted local builders' },
      { href: '/about', label: 'About Us', description: 'Our story and expertise' },
    ]
  },
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
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <div key={link.href} className="relative group">
                {link.children ? (
                  <>
                    <button
                      className="flex items-center gap-1 text-gray-700 hover:text-[#D4AF37] font-medium transition py-2"
                    >
                      {link.label}
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    {/* Dropdown */}
                    <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-2 min-w-[280px]">
                        {link.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="block px-4 py-3 hover:bg-gray-50 rounded-lg transition"
                          >
                            <div className="font-medium text-gray-900">{child.label}</div>
                            {child.description && (
                              <div className="text-sm text-gray-500">{child.description}</div>
                            )}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <Link
                    href={link.href}
                    className="text-gray-700 hover:text-[#D4AF37] font-medium transition py-2"
                  >
                    {link.label}
                  </Link>
                )}
              </div>
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
            mobileMenuOpen ? 'max-h-[600px] mt-4' : 'max-h-0'
          )}
        >
          <div className="flex flex-col gap-2 py-4 border-t border-gray-200">
            {navLinks.map((link) => (
              <div key={link.href}>
                {link.children ? (
                  <div className="px-4 py-2">
                    <div className="font-semibold text-gray-900 mb-2">{link.label}</div>
                    <div className="space-y-1 pl-2">
                      {link.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block px-2 py-2 text-gray-600 hover:text-[#D4AF37] hover:bg-gray-50 rounded-lg transition text-sm"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    href={link.href}
                    className="px-4 py-2 text-gray-700 hover:text-[#D4AF37] hover:bg-gray-50 rounded-lg font-medium transition block"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                )}
              </div>
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

// Named export for compatibility with tests
export { Header };
