import type { Metadata, Viewport } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import Script from 'next/script';

import '@/styles/globals.css';
import { Header, Footer } from '@/components/layout';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

/**
 * JSON-LD Structured Data for Organization and WebSite
 */
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://hampsteadrenovations.com/#organization',
      name: 'Hampstead Renovations',
      url: 'https://hampsteadrenovations.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://hampsteadrenovations.com/logo.png',
        width: 512,
        height: 512,
      },
      sameAs: [
        'https://www.facebook.com/hampsteadrenovations',
        'https://www.instagram.com/hampsteadrenovations',
        'https://www.linkedin.com/company/hampstead-renovations',
      ],
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+44-20-XXXX-XXXX',
        contactType: 'customer service',
        areaServed: 'GB',
        availableLanguage: 'English',
      },
    },
    {
      '@type': 'WebSite',
      '@id': 'https://hampsteadrenovations.com/#website',
      url: 'https://hampsteadrenovations.com',
      name: 'Heritage & Planning Checker | Hampstead Renovations',
      description: 'Check if your property is Listed or in a Conservation Area. Instant heritage and planning status for North West London properties.',
      publisher: {
        '@id': 'https://hampsteadrenovations.com/#organization',
      },
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: 'https://hampsteadrenovations.com/?address={search_term_string}',
        },
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'WebApplication',
      '@id': 'https://hampsteadrenovations.com/#app',
      name: 'Heritage & Planning Checker',
      description: 'Free tool to check if your North West London property is Listed or in a Conservation Area',
      applicationCategory: 'UtilityApplication',
      operatingSystem: 'All',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'GBP',
      },
      featureList: [
        'Listed Building Check',
        'Conservation Area Check',
        'Article 4 Direction Detection',
        'Planning Permission Guidance',
        'Interactive Heritage Map',
        'PDF Report Generation',
      ],
      screenshot: 'https://hampsteadrenovations.com/og-image.png',
    },
    {
      '@type': ['LocalBusiness', 'HomeAndConstructionBusiness'],
      '@id': 'https://hampsteadrenovations.com/#localbusiness',
      name: 'Hampstead Renovations',
      image: 'https://hampsteadrenovations.com/og-image.png',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Hampstead',
        addressRegion: 'London',
        postalCode: 'NW3',
        addressCountry: 'GB',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 51.5565,
        longitude: -0.1781,
      },
      areaServed: [
        { '@type': 'PostalAddress', postalCode: 'NW1' },
        { '@type': 'PostalAddress', postalCode: 'NW3' },
        { '@type': 'PostalAddress', postalCode: 'NW6' },
        { '@type': 'PostalAddress', postalCode: 'NW8' },
        { '@type': 'PostalAddress', postalCode: 'NW11' },
        { '@type': 'PostalAddress', postalCode: 'N2' },
        { '@type': 'PostalAddress', postalCode: 'N6' },
        { '@type': 'PostalAddress', postalCode: 'N10' },
      ],
      priceRange: '££',
    },
  ],
};

export const metadata: Metadata = {
  title: {
    default: 'Heritage & Planning Checker | Hampstead Renovations',
    template: '%s | Hampstead Renovations',
  },
  description:
    'Check if your property is Listed or in a Conservation Area. Instant heritage and planning status for North West London properties. Free expert analysis.',
  keywords: [
    'heritage checker',
    'planning checker',
    'listed building',
    'conservation area',
    'NW London',
    'Hampstead',
    'Camden',
    'planning permission',
    'Article 4',
    'permitted development',
  ],
  authors: [{ name: 'Hampstead Renovations' }],
  creator: 'Hampstead Renovations',
  publisher: 'Hampstead Renovations Ltd.',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env['NEXT_PUBLIC_APP_URL'] ?? 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: '/',
    title: 'Heritage & Planning Checker | Hampstead Renovations',
    description:
      'Instantly check if your North West London property is Listed or in a Conservation Area. Free heritage status report.',
    siteName: 'Hampstead Renovations Heritage Checker',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Hampstead Renovations Heritage Checker',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Heritage & Planning Checker',
    description: 'Check your property\'s heritage and planning status instantly',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Planning Checker',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0F172A' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <Script
          id="json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* PWA Meta Tags */}
        <meta name="application-name" content="Planning Checker" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Planning Checker" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#1e3a5f" />
        <meta name="msapplication-tap-highlight" content="no" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-192x192.png" />
      </head>
      <body className="min-h-screen flex flex-col antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        {/* Service Worker Registration */}
        <Script
          id="sw-registration"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(
                    function(registration) {
                      console.log('ServiceWorker registration successful');
                    },
                    function(err) {
                      console.log('ServiceWorker registration failed: ', err);
                    }
                  );
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
