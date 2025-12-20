/**
 * Supabase Client Configuration
 * Singleton pattern for Supabase client instances
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

import type { Database } from '@/types/database';

// Check if we're in build time
const isBuildTime = process.env.NEXT_PHASE === 'phase-production-build';

// Environment variables - use valid placeholder URLs during build to prevent URL validation errors
const supabaseUrl = isBuildTime 
  ? 'https://placeholder.supabase.co' 
  : (process.env['NEXT_PUBLIC_SUPABASE_URL'] || 'https://placeholder.supabase.co');
const supabaseAnonKey = isBuildTime 
  ? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDUxOTI4MDAsImV4cCI6MTk2MDc2ODgwMH0.placeholder'
  : (process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY'] || 'placeholder-key');
const supabaseServiceRoleKey = process.env['SUPABASE_SERVICE_ROLE_KEY'];

// Singleton instances
let supabaseClient: SupabaseClient<Database> | null = null;
let supabaseAdminClient: SupabaseClient<Database> | null = null;

/**
 * Validate environment at runtime
 */
function validateEnvironment(): void {
  if (isBuildTime) {
    return; // Skip validation during build
  }
  if (!supabaseUrl) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable');
  }
  if (!supabaseAnonKey) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable');
  }
}

/**
 * Get the singleton Supabase client for browser/client-side use
 * Uses the anonymous key with Row Level Security (RLS)
 */
export function getSupabaseClient(): SupabaseClient<Database> {
  if (isBuildTime) {
    // Return a mock client during build
    return null as any;
  }
  
  if (supabaseClient) {
    return supabaseClient;
  }

  validateEnvironment();

  supabaseClient = createClient<Database>(supabaseUrl!, supabaseAnonKey!, {
    auth: {
      persistSession: typeof window !== 'undefined',
      autoRefreshToken: typeof window !== 'undefined',
      detectSessionInUrl: typeof window !== 'undefined',
    },
    db: {
      schema: 'public',
    },
    global: {
      headers: {
        'x-client-info': 'hampstead-heritage-checker',
      },
    },
  });

  return supabaseClient;
}

/**
 * Get Supabase admin client singleton for server-side operations
 * Uses service role key to bypass RLS
 * NEVER expose this client to the browser
 */
export function getSupabaseAdmin(): SupabaseClient<Database> {
  if (isBuildTime) {
    // Return a mock client during build
    return null as any;
  }
  
  // Return existing singleton
  if (supabaseAdminClient) {
    return supabaseAdminClient;
  }

  validateEnvironment();

  if (!supabaseServiceRoleKey) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY for admin operations');
  }

  supabaseAdminClient = createClient<Database>(supabaseUrl!, supabaseServiceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    db: {
      schema: 'public',
    },
    global: {
      headers: {
        'x-client-info': 'hampstead-heritage-checker-admin',
      },
    },
  });

  return supabaseAdminClient;
}

/**
 * Legacy export for backward compatibility
 * Prefer using getSupabaseClient() for new code
 */
export const supabase = (() => {
  // Lazy initialization to avoid errors during module load
  let client: SupabaseClient<Database> | null = null;
  
  return new Proxy({} as SupabaseClient<Database>, {
    get(_, prop) {
      if (!client) {
        client = getSupabaseClient();
      }
      return (client as unknown as Record<string | symbol, unknown>)[prop];
    },
  });
})();

/**
 * Type-safe query builder for listed buildings
 */
export const listedBuildingsTable = () => getSupabaseClient().from('listed_buildings');

/**
 * Type-safe query builder for conservation areas
 */
export const conservationAreasTable = () => getSupabaseClient().from('conservation_areas');

/**
 * Type-safe query builder for search logs
 */
export const searchLogsTable = () => getSupabaseClient().from('search_logs');

/**
 * Type-safe query builder for leads
 */
export const leadsTable = () => getSupabaseClient().from('leads');

/**
 * Check if Supabase is properly configured
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl && supabaseAnonKey);
}

/**
 * Check database connectivity
 */
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    const client = getSupabaseClient();
    const { error } = await client.from('listed_buildings').select('id').limit(1);
    return !error;
  } catch {
    return false;
  }
}
