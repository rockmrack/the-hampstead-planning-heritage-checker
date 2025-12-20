/**
 * Environment configuration with validation
 * Ensures all required environment variables are present
 */

import { z } from 'zod';

// During build, skip all validation. At runtime, validate properly.
const isBuildTime = process.env.NEXT_PHASE === 'phase-production-build';

const envSchema = z.object({
  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: z.string().default(''),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().default(''),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  
  // Mapbox
  NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN: z.string().default(''),
  MAPBOX_SECRET_TOKEN: z.string().optional(),
  
  // Application
  NEXT_PUBLIC_APP_URL: z.string().default('http://localhost:3000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  
  // Rate limiting
  RATE_LIMIT_MAX_REQUESTS: z.string().transform(Number).default('60'),
  RATE_LIMIT_WINDOW_SECONDS: z.string().transform(Number).default('60'),
  
  // Caching
  GEOCODING_CACHE_TTL: z.string().transform(Number).default('86400'),
  PROPERTY_CHECK_CACHE_TTL: z.string().transform(Number).default('3600'),
  
  // Email (optional)
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().transform(Number).optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASSWORD: z.string().optional(),
  EMAIL_FROM: z.string().default('hello@hampsteadrenovations.co.uk'),
  
  // Analytics (optional)
  NEXT_PUBLIC_GA_ID: z.string().optional(),
  NEXT_PUBLIC_MIXPANEL_TOKEN: z.string().optional(),
  
  // Monitoring (optional)
  NEXT_PUBLIC_SENTRY_DSN: z.string().optional(),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
});

export type Env = z.infer<typeof envSchema>;

let cachedEnv: Env | null = null;

function getEnvVars(): Env {
  // Skip during build
  if (isBuildTime) {
    return {
      NEXT_PUBLIC_SUPABASE_URL: '',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: '',
      SUPABASE_SERVICE_ROLE_KEY: '',
      NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN: '',
      MAPBOX_SECRET_TOKEN: '',
      NEXT_PUBLIC_APP_URL: 'http://localhost:3000',
      NODE_ENV: 'production' as 'production',
      RATE_LIMIT_MAX_REQUESTS: 60,
      RATE_LIMIT_WINDOW_SECONDS: 60,
      GEOCODING_CACHE_TTL: 86400,
      PROPERTY_CHECK_CACHE_TTL: 3600,
      SMTP_HOST: '',
      SMTP_PORT: 0,
      SMTP_USER: '',
      SMTP_PASSWORD: '',
      EMAIL_FROM: 'hello@hampsteadrenovations.co.uk',
      NEXT_PUBLIC_GA_ID: '',
      NEXT_PUBLIC_MIXPANEL_TOKEN: '',
      NEXT_PUBLIC_SENTRY_DSN: '',
      LOG_LEVEL: 'info' as 'info',
    };
  }
  
  if (cachedEnv) {
    return cachedEnv;
  }
  
  // In development, we provide defaults for non-critical vars
  const rawEnv = {
    NEXT_PUBLIC_SUPABASE_URL: process.env['NEXT_PUBLIC_SUPABASE_URL'] ?? '',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY'] ?? '',
    SUPABASE_SERVICE_ROLE_KEY: process.env['SUPABASE_SERVICE_ROLE_KEY'],
    NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN: process.env['NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN'] ?? '',
    MAPBOX_SECRET_TOKEN: process.env['MAPBOX_SECRET_TOKEN'],
    NEXT_PUBLIC_APP_URL: process.env['NEXT_PUBLIC_APP_URL'] ?? 'http://localhost:3000',
    NODE_ENV: process.env['NODE_ENV'] ?? 'development',
    RATE_LIMIT_MAX_REQUESTS: process.env['RATE_LIMIT_MAX_REQUESTS'] ?? '60',
    RATE_LIMIT_WINDOW_SECONDS: process.env['RATE_LIMIT_WINDOW_SECONDS'] ?? '60',
    GEOCODING_CACHE_TTL: process.env['GEOCODING_CACHE_TTL'] ?? '86400',
    PROPERTY_CHECK_CACHE_TTL: process.env['PROPERTY_CHECK_CACHE_TTL'] ?? '3600',
    SMTP_HOST: process.env['SMTP_HOST'],
    SMTP_PORT: process.env['SMTP_PORT'],
    SMTP_USER: process.env['SMTP_USER'],
    SMTP_PASSWORD: process.env['SMTP_PASSWORD'],
    EMAIL_FROM: process.env['EMAIL_FROM'],
    NEXT_PUBLIC_GA_ID: process.env['NEXT_PUBLIC_GA_ID'],
    NEXT_PUBLIC_MIXPANEL_TOKEN: process.env['NEXT_PUBLIC_MIXPANEL_TOKEN'],
    NEXT_PUBLIC_SENTRY_DSN: process.env['NEXT_PUBLIC_SENTRY_DSN'],
    LOG_LEVEL: process.env['LOG_LEVEL'] ?? 'info',
  };

  // Parse with schema to transform values
  cachedEnv = envSchema.parse(rawEnv);
  return cachedEnv;
}

// Lazy initialization - only evaluate when accessed
export const env = new Proxy({} as Env, {
  get(_target, prop: string) {
    const envVars = getEnvVars();
    return envVars[prop as keyof Env];
  }
});

/**
 * Validate environment variables on startup
 * Call this in your app initialization
 */
export function validateEnv(): void {
  try {
    envSchema.parse(env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors.map((e) => e.path.join('.')).join(', ');
      console.error(`❌ Missing or invalid environment variables: ${missingVars}`);
      throw new Error(`Environment validation failed: ${missingVars}`);
    }
    throw error;
  }
}

/**
 * Check if we're in production environment
 */
export const isProduction = env.NODE_ENV === 'production';

/**
 * Check if we're in development environment
 */
export const isDevelopment = env.NODE_ENV === 'development';

/**
 * Check if we're in test environment
 */
export const isTest = env.NODE_ENV === 'test';
