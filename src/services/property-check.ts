/**
 * Property Check Service
 * Core business logic for checking planning constraints
 */

import { v4 as uuidv4 } from 'uuid';

import { STATUS_CONFIG, EXPERT_OPINIONS, SEARCH_CONFIG } from '@/lib/config';
import { supabase, getSupabaseAdmin } from '@/lib/supabase';
import { cache, cacheKeys, cacheTTL, logSearch, logError } from '@/lib/utils';
import type {
  Coordinates,
  PropertyStatus,
  PropertyCheckResult,
  ListedBuilding,
  ConservationArea,
  GeoJSONPoint,
} from '@/types';

/**
 * Main property check function
 * Performs spatial queries to determine planning status
 */
export async function checkProperty(
  coordinates: Coordinates,
  address: string,
  postcode?: string
): Promise<PropertyCheckResult> {
  const startTime = Date.now();
  const searchId = uuidv4();

  // Check cache first
  const cacheKey = cacheKeys.propertyCheck(coordinates.latitude, coordinates.longitude);
  const cached = cache.get<PropertyCheckResult>(cacheKey);
  if (cached) {
    logSearch(address, cached.status, Date.now() - startTime, { cached: true });
    return { ...cached, searchId };
  }

  try {
    // Step 1: Check for Listed Building (radius query)
    const listedBuilding = await checkListedBuilding(coordinates);

    // Step 2: Check for Conservation Area (point-in-polygon)
    const conservationArea = await checkConservationArea(coordinates);

    // Step 3: Determine status
    let status: PropertyStatus;
    let hasArticle4 = false;
    let article4Details: string | undefined;

    if (listedBuilding) {
      status = 'RED';
    } else if (conservationArea) {
      status = 'AMBER';
      hasArticle4 = conservationArea.hasArticle4;
      article4Details = conservationArea.article4Details;
    } else {
      status = 'GREEN';
    }

    const result: PropertyCheckResult = {
      status,
      address,
      coordinates,
      postcode: postcode ?? '',
      borough: conservationArea?.borough ?? listedBuilding?.borough,
      listedBuilding: listedBuilding ?? null,
      conservationArea: conservationArea ?? null,
      hasArticle4,
      article4Details,
      timestamp: new Date().toISOString(),
      searchId,
    };

    // Cache the result
    cache.set(cacheKey, result, cacheTTL.propertyCheck);

    const duration = Date.now() - startTime;
    logSearch(address, status, duration, { searchId });

    return result;
  } catch (error) {
    logError('Property check failed', error instanceof Error ? error : new Error(String(error)), {
      coordinates,
      address,
    });
    throw error;
  }
}

/**
 * Check if coordinates are within radius of a Listed Building
 * Uses PostGIS ST_DWithin function
 */
async function checkListedBuilding(
  coordinates: Coordinates
): Promise<ListedBuilding | null> {
  const { longitude, latitude } = coordinates;
  const radiusMeters = SEARCH_CONFIG.listedBuildingRadius;

  try {
    // Use the custom function for spatial query
    const { data, error } = await supabase.rpc('check_listed_building_proximity', {
      lng: longitude,
      lat: latitude,
      radius_meters: radiusMeters,
    });

    if (error) {
      logError('Listed building check failed', new Error(error.message));
      
      // Fallback to direct query if function doesn't exist
      return await checkListedBuildingFallback(coordinates);
    }

    if (!data || data.length === 0) {
      return null;
    }

    const building = data[0];
    return {
      id: building.id,
      listEntryNumber: building.list_entry_number,
      name: building.name,
      grade: building.grade as 'I' | 'II*' | 'II',
      location: {
        type: 'Point',
        coordinates: [longitude, latitude],
      } as GeoJSONPoint,
      hyperlink: building.hyperlink,
      distanceMeters: building.distance_meters,
    };
  } catch (error) {
    logError('Listed building query error', error instanceof Error ? error : new Error(String(error)));
    return null;
  }
}

/**
 * Fallback query for listed buildings without stored function
 */
async function checkListedBuildingFallback(
  coordinates: Coordinates
): Promise<ListedBuilding | null> {
  const { longitude, latitude } = coordinates;
  const radiusMeters = SEARCH_CONFIG.listedBuildingRadius;

  // Raw SQL query using PostGIS
  const query = `
    SELECT 
      id,
      list_entry_number,
      name,
      grade,
      hyperlink,
      ST_Distance(location::geography, ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography) as distance_meters
    FROM listed_buildings
    WHERE ST_DWithin(
      location::geography,
      ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography,
      $3
    )
    ORDER BY distance_meters
    LIMIT 1
  `;

  const { data, error } = await supabase.rpc('exec_sql', {
    query,
    params: [longitude, latitude, radiusMeters],
  });

  if (error || !data || data.length === 0) {
    return null;
  }

  const building = data[0];
  return {
    id: building.id,
    listEntryNumber: building.list_entry_number,
    name: building.name,
    grade: building.grade as 'I' | 'II*' | 'II',
    location: {
      type: 'Point',
      coordinates: [longitude, latitude],
    } as GeoJSONPoint,
    hyperlink: building.hyperlink,
    distanceMeters: building.distance_meters,
  };
}

/**
 * Check if coordinates fall within a Conservation Area
 * Uses PostGIS ST_Intersects function
 */
async function checkConservationArea(
  coordinates: Coordinates
): Promise<ConservationArea | null> {
  const { longitude, latitude } = coordinates;

  try {
    // Use the custom function for spatial query
    const { data, error } = await supabase.rpc('check_conservation_area', {
      lng: longitude,
      lat: latitude,
    });

    if (error) {
      logError('Conservation area check failed', new Error(error.message));
      
      // Fallback to direct query
      return await checkConservationAreaFallback(coordinates);
    }

    if (!data || data.length === 0) {
      return null;
    }

    const area = data[0];
    return {
      id: area.id,
      name: area.name,
      borough: area.borough,
      hasArticle4: area.has_article_4,
      article4Details: area.article_4_details,
    };
  } catch (error) {
    logError('Conservation area query error', error instanceof Error ? error : new Error(String(error)));
    return null;
  }
}

/**
 * Fallback query for conservation areas without stored function
 */
async function checkConservationAreaFallback(
  coordinates: Coordinates
): Promise<ConservationArea | null> {
  const { longitude, latitude } = coordinates;

  // Simple query without spatial extension
  const { data, error } = await supabase
    .from('conservation_areas')
    .select('id, name, borough, has_article_4, article_4_details');

  if (error || !data) {
    return null;
  }

  // If no spatial query capability, return null
  // This is a fallback and won't provide accurate results
  return null;
}

/**
 * Get expert opinion text based on property status
 */
export function getExpertOpinion(result: PropertyCheckResult): string {
  if (result.status === 'RED' && result.listedBuilding) {
    const grade = result.listedBuilding.grade;
    return EXPERT_OPINIONS.listed[grade] ?? EXPERT_OPINIONS.listed['II'];
  }

  if (result.status === 'AMBER') {
    if (result.hasArticle4) {
      return EXPERT_OPINIONS.conservation.article4;
    }
    return EXPERT_OPINIONS.conservation.default;
  }

  return EXPERT_OPINIONS.standard;
}

/**
 * Get status configuration for display
 */
export function getStatusConfig(status: PropertyStatus) {
  return STATUS_CONFIG[status];
}

/**
 * Log search to database for analytics and lead generation
 */
export async function logSearchToDatabase(
  result: PropertyCheckResult,
  userAgent?: string,
  ipAddress?: string
): Promise<void> {
  try {
    const admin = getSupabaseAdmin();
    
    await admin.from('search_logs').insert({
      id: result.searchId,
      address_input: result.address,
      postcode: result.postcode,
      result_status: result.status,
      latitude: result.coordinates.latitude,
      longitude: result.coordinates.longitude,
      borough: result.borough,
      conservation_area_id: result.conservationArea?.id,
      listed_building_id: result.listedBuilding?.id,
      user_agent: userAgent,
      ip_address: ipAddress,
    });
  } catch (error) {
    // Non-blocking - don't fail the main request
    logError('Failed to log search', error instanceof Error ? error : new Error(String(error)));
  }
}

/**
 * Update search log with user email (for lead capture)
 */
export async function updateSearchWithEmail(
  searchId: string,
  email: string
): Promise<void> {
  try {
    const admin = getSupabaseAdmin();
    
    await admin
      .from('search_logs')
      .update({ user_email: email })
      .eq('id', searchId);
  } catch (error) {
    logError('Failed to update search with email', error instanceof Error ? error : new Error(String(error)));
  }
}

export default {
  checkProperty,
  getExpertOpinion,
  getStatusConfig,
  logSearchToDatabase,
  updateSearchWithEmail,
};
