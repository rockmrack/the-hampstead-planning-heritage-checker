/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/heritage-check',
  reactStrictMode: true,
  poweredByHeader: false,

  // Set default env vars for build if not provided
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key',
    NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || 'placeholder-token',
  },

  // Ignore ESLint and TypeScript errors during build temporarily
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  /**
   * Enable experimental features for performance
   */
  experimental: {
    // Optimize package imports for faster builds
    optimizePackageImports: ['lucide-react', 'framer-motion', '@heroicons/react'],
  },

  /**
   * Compiler options for production optimization
   */
  compiler: {
    // Remove console.log in production
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn', 'log', 'info'],
    } : false,
  },

  /**
   * Output configuration - disable static optimization to avoid build-time data collection
   */
  output: 'standalone',

  /**
   * Logging configuration
   */
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  
  /**
   * Security headers following OWASP best practices
   */
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(self), interest-cohort=()'
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin'
          },
          {
            key: 'Cross-Origin-Resource-Policy',
            value: 'same-origin'
          }
        ]
      },
      // Cache static assets aggressively
      {
        source: '/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      // Cache images
      {
        source: '/_next/image(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, stale-while-revalidate=31536000'
          }
        ]
      }
    ];
  },

  /**
   * Image optimization configuration
   */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.mapbox.com',
      },
      {
        protocol: 'https',
        hostname: '*.tiles.mapbox.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    // Optimize image loading
    minimumCacheTTL: 86400,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  /**
   * Webpack configuration for Mapbox GL JS compatibility
   */
  webpack: (config, { isServer }) => {
    config.resolve.fallback = { 
      fs: false, 
      path: false,
      os: false,
    };
    
    // Optimize bundle size in production
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            mapbox: {
              test: /[\\/]node_modules[\\/](mapbox-gl|react-map-gl)[\\/]/,
              name: 'mapbox',
              priority: 20,
              reuseExistingChunk: true,
            },
            pdf: {
              test: /[\\/]node_modules[\\/](jspdf|html2canvas)[\\/]/,
              name: 'pdf-libs',
              priority: 15,
              reuseExistingChunk: true,
            },
            animations: {
              test: /[\\/]node_modules[\\/](framer-motion)[\\/]/,
              name: 'animations',
              priority: 15,
              reuseExistingChunk: true,
            },
            utils: {
              test: /[\\/]node_modules[\\/](date-fns|lodash|uuid)[\\/]/,
              name: 'utils',
              priority: 10,
              reuseExistingChunk: true,
            },
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              priority: -10,
              reuseExistingChunk: true,
            },
          },
        },
      };
    }
    
    return config;
  },

  /**
   * Redirects for SEO and URL normalization
   */
  async redirects() {
    return [
      // When deployed with a basePath, ensure the deployment root doesn't 404
      {
        source: '/',
        destination: '/heritage-check',
        permanent: false,
        basePath: false,
      },
      // Legacy entrypoints (unprefixed) -> basePath entry
      {
        source: '/check',
        destination: '/heritage-check',
        permanent: true,
        basePath: false,
      },
      {
        source: '/streets/:slug',
        destination: '/heritage-check/street/:slug',
        permanent: true,
        basePath: false,
      },
      // Redirect old URLs to new structure
      {
        source: '/check',
        destination: '/',
        permanent: true,
      },
      {
        source: '/streets/:slug',
        destination: '/street/:slug',
        permanent: true,
      },
    ];
  },

  /**
   * Environment variables exposed to the browser
   */
  env: {
    NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'https://hampsteadrenovations.com',
    NEXT_PUBLIC_BASE_PATH: '/heritage-check',
  },
};

module.exports = nextConfig;
