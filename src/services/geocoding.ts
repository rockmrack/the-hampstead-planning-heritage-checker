/**
 * Geocoding Service
 * Converts addresses to coordinates using Mapbox Geocoding API
 */

import { cache, cacheKeys, cacheTTL, logApiCall, logError } from '@/lib/utils';
import type { Coordinates, GeocodingResult } from '@/types';

import { SEARCH_CONFIG } from '@/lib/config';

const MAPBOX_GEOCODING_URL = 'https://api.mapbox.com/geocoding/v5/mapbox.places';

interface MapboxFeature {
  id: string;
  place_name: string;
  relevance: number;
  center: [number, number]; // [longitude, latitude]
  place_type: string[];
  text: string;
  context?: Array<{
    id: string;
    text: string;
    short_code?: string;
  }>;
  properties?: {
    accuracy?: string;
    address?: string;
  };
}

interface MapboxGeocodingResponse {
  type: 'FeatureCollection';
  features: MapboxFeature[];
  query: string[];
  attribution: string;
}

/**
 * Geocode an address string to coordinates
 */
export async function geocodeAddress(
  address: string,
  options: {
    limit?: number;
    proximity?: Coordinates;
    useCache?: boolean;
  } = {}
): Promise<GeocodingResult[]> {
  const {
    limit = SEARCH_CONFIG.autocompleteMaxResults,
    proximity,
    useCache = true,
  } = options;

  const startTime = Date.now();

  // Check cache first
  if (useCache) {
    const cacheKey = cacheKeys.geocoding(address);
    const cached = cache.get<GeocodingResult[]>(cacheKey);
    if (cached) {
      logApiCall('mapbox', 'geocoding', true, Date.now() - startTime, { cached: true });
      return cached;
    }
  }

  const accessToken = process.env['NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN'];
  if (!accessToken) {
    throw new Error('Mapbox access token is not configured');
  }

  // Build the URL with query parameters
  const params = new URLSearchParams({
    access_token: accessToken,
    country: SEARCH_CONFIG.geocodingCountry,
    types: 'address,poi',
    limit: limit.toString(),
    language: 'en',
    autocomplete: 'true',
  });

  // Add bounding box for NW London
  const bbox = SEARCH_CONFIG.geocodingBoundingBox;
  params.set('bbox', bbox.join(','));

  // Add proximity bias if provided
  if (proximity) {
    params.set('proximity', `${proximity.longitude},${proximity.latitude}`);
  }

  const encodedAddress = encodeURIComponent(address);
  const url = `${MAPBOX_GEOCODING_URL}/${encodedAddress}.json?${params.toString()}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Geocoding API error: ${response.status} - ${errorText}`);
    }

    const data: MapboxGeocodingResponse = await response.json() as MapboxGeocodingResponse;
    const duration = Date.now() - startTime;

    const results = data.features.map((feature) => parseMapboxFeature(feature));

    logApiCall('mapbox', 'geocoding', true, duration, {
      address,
      resultsCount: results.length,
    });

    // Cache the results
    if (useCache && results.length > 0) {
      cache.set(cacheKeys.geocoding(address), results, cacheTTL.geocoding);
    }

    return results;
  } catch (error) {
    const duration = Date.now() - startTime;
    logApiCall('mapbox', 'geocoding', false, duration, { address });
    logError('Geocoding failed', error instanceof Error ? error : new Error(String(error)));
    throw error;
  }
}

/**
 * Reverse geocode coordinates to an address
 */
export async function reverseGeocode(
  coordinates: Coordinates
): Promise<GeocodingResult | null> {
  const accessToken = process.env['NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN'];
  if (!accessToken) {
    throw new Error('Mapbox access token is not configured');
  }

  const startTime = Date.now();

  const params = new URLSearchParams({
    access_token: accessToken,
    types: 'address',
    limit: '1',
    language: 'en',
  });

  const url = `${MAPBOX_GEOCODING_URL}/${coordinates.longitude},${coordinates.latitude}.json?${params.toString()}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Reverse geocoding API error: ${response.status}`);
    }

    const data: MapboxGeocodingResponse = await response.json() as MapboxGeocodingResponse;
    const duration = Date.now() - startTime;

    logApiCall('mapbox', 'reverse-geocoding', true, duration);

    if (data.features.length === 0) {
      return null;
    }

    return parseMapboxFeature(data.features[0]!);
  } catch (error) {
    const duration = Date.now() - startTime;
    logApiCall('mapbox', 'reverse-geocoding', false, duration);
    logError('Reverse geocoding failed', error instanceof Error ? error : new Error(String(error)));
    throw error;
  }
}

/**
 * Parse a Mapbox feature into our GeocodingResult format
 */
function parseMapboxFeature(feature: MapboxFeature): GeocodingResult {
  // Extract postcode from context
  const postcode = feature.context?.find((c) => c.id.startsWith('postcode'))?.text;
  
  // Extract borough/locality from context
  const borough = feature.context?.find((c) => 
    c.id.startsWith('locality') || c.id.startsWith('place')
  )?.text;

  return {
    placeName: feature.place_name,
    coordinates: {
      latitude: feature.center[1],
      longitude: feature.center[0],
    },
    postcode,
    borough,
    address: feature.place_name,
    relevance: feature.relevance,
    placeType: feature.place_type,
  };
}

/**
 * Validate that coordinates are within the coverage area
 */
export function isWithinCoverageArea(coordinates: Coordinates): boolean {
  const [minLng, minLat, maxLng, maxLat] = SEARCH_CONFIG.geocodingBoundingBox;
  
  return (
    coordinates.longitude >= (minLng ?? -180) &&
    coordinates.longitude <= (maxLng ?? 180) &&
    coordinates.latitude >= (minLat ?? -90) &&
    coordinates.latitude <= (maxLat ?? 90)
  );
}

/**
 * Extract full address from geocoding result
 */
export function formatAddress(result: GeocodingResult): string {
  return result.placeName || result.address;
}

export default {
  geocodeAddress,
  reverseGeocode,
  isWithinCoverageArea,
  formatAddress,
};
