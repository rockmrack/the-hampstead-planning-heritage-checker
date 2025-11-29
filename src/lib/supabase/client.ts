/**
 * Supabase Client Configuration
 * Creates and exports Supabase client instances for browser and server use
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

import type { Database } from '@/types/database';

const supabaseUrl = process.env['NEXT_PUBLIC_SUPABASE_URL'];
const supabaseAnonKey = process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY'];
const supabaseServiceRoleKey = process.env['SUPABASE_SERVICE_ROLE_KEY'];

// Validate required environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

/**
 * Supabase client for browser/client-side use
 * Uses the anonymous key with Row Level Security (RLS)
 */
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
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

/**
 * Get Supabase admin client for server-side operations
 * Uses service role key to bypass RLS
 * NEVER expose this client to the browser
 */
export function getSupabaseAdmin(): SupabaseClient<Database> {
  if (!supabaseServiceRoleKey) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY for admin operations');
  }

  return createClient<Database>(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    db: {
      schema: 'public',
    },
  });
}

/**
 * Type-safe query builder for listed buildings
 */
export const listedBuildingsTable = () => supabase.from('listed_buildings');

/**
 * Type-safe query builder for conservation areas
 */
export const conservationAreasTable = () => supabase.from('conservation_areas');

/**
 * Type-safe query builder for search logs
 */
export const searchLogsTable = () => supabase.from('search_logs');
