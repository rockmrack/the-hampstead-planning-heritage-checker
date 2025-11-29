import type { Metadata, Viewport } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';

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
  manifest: '/site.webmanifest',
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
      <body className="min-h-screen flex flex-col antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
