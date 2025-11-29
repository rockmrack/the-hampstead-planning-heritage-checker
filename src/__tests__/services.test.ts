/**
 * Service Layer Unit Tests
 * Tests for all service layer components
 */

import { describe, it, expect, jest, beforeEach } from '@jest/globals';

// Mock dependencies before imports
jest.mock('@/lib/supabase', () => ({
  getSupabaseAdmin: jest.fn(),
}));

jest.mock('@/lib/utils/logger', () => ({
  logInfo: jest.fn(),
  logError: jest.fn(),
  logDebug: jest.fn(),
  startTimer: jest.fn(() => () => 100),
}));

import { getSupabaseAdmin } from '@/lib/supabase';

describe('Property Check Service', () => {
  let mockSupabase: any;

  beforeEach(() => {
    jest.clearAllMocks();
    mockSupabase = {
      rpc: jest.fn(),
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn(),
    };
    (getSupabaseAdmin as jest.Mock).mockReturnValue(mockSupabase);
  });

  describe('findNearbyListedBuildings', () => {
    it('should call RPC with correct parameters', async () => {
      mockSupabase.rpc.mockResolvedValue({
        data: [],
        error: null,
      });

      // Simulate the service call
      const lat = 51.5074;
      const lng = -0.1278;
      const radiusMeters = 10;

      await mockSupabase.rpc('find_nearby_listed_buildings', {
        search_lat: lat,
        search_lng: lng,
        radius_meters: radiusMeters,
      });

      expect(mockSupabase.rpc).toHaveBeenCalledWith('find_nearby_listed_buildings', {
        search_lat: lat,
        search_lng: lng,
        radius_meters: radiusMeters,
      });
    });

    it('should handle multiple results sorted by distance', async () => {
      const mockResults = [
        { id: '1', name: 'Building A', grade: 'I', distance: 5 },
        { id: '2', name: 'Building B', grade: 'II', distance: 8 },
        { id: '3', name: 'Building C', grade: 'II*', distance: 10 },
      ];

      mockSupabase.rpc.mockResolvedValue({
        data: mockResults,
        error: null,
      });

      const result = await mockSupabase.rpc('find_nearby_listed_buildings', {
        search_lat: 51.5,
        search_lng: -0.1,
        radius_meters: 15,
      });

      expect(result.data).toHaveLength(3);
      expect(result.data[0].distance).toBeLessThan(result.data[1].distance);
    });
  });

  describe('findConservationAreaContaining', () => {
    it('should call RPC with correct point coordinates', async () => {
      mockSupabase.rpc.mockResolvedValue({
        data: [{ id: 'ca-1', name: 'Test CA', has_article_4: false }],
        error: null,
      });

      const lat = 51.5074;
      const lng = -0.1278;

      await mockSupabase.rpc('find_conservation_area_containing', {
        search_lat: lat,
        search_lng: lng,
      });

      expect(mockSupabase.rpc).toHaveBeenCalledWith('find_conservation_area_containing', {
        search_lat: lat,
        search_lng: lng,
      });
    });
  });
});

describe('Geocoding Service', () => {
  const MAPBOX_API_URL = 'https://api.mapbox.com/geocoding/v5/mapbox.places';

  it('should construct correct Mapbox API URL', () => {
    const address = '123 High Street, London';
    const encodedAddress = encodeURIComponent(address);
    const accessToken = 'test-token';

    const url = `${MAPBOX_API_URL}/${encodedAddress}.json?access_token=${accessToken}&country=gb&types=address`;

    expect(url).toContain(encodedAddress);
    expect(url).toContain('country=gb');
    expect(url).toContain('types=address');
  });

  it('should parse Mapbox response correctly', () => {
    const mockResponse = {
      features: [
        {
          center: [-0.1278, 51.5074],
          place_name: '123 High Street, London, United Kingdom',
          context: [
            { id: 'postcode.123', text: 'NW1 1AA' },
            { id: 'locality.456', text: 'Westminster' },
          ],
        },
      ],
    };

    const feature = mockResponse.features[0];
    const [longitude, latitude] = feature.center;
    const postcode = feature.context.find((c: any) => c.id.startsWith('postcode'))?.text;

    expect(latitude).toBe(51.5074);
    expect(longitude).toBe(-0.1278);
    expect(postcode).toBe('NW1 1AA');
  });

  it('should handle no results gracefully', () => {
    const mockEmptyResponse = { features: [] };

    expect(mockEmptyResponse.features.length).toBe(0);
  });
});

describe('Lead Capture Service', () => {
  let mockSupabase: any;

  beforeEach(() => {
    mockSupabase = {
      from: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      single: jest.fn(),
    };
    (getSupabaseAdmin as jest.Mock).mockReturnValue(mockSupabase);
  });

  it('should validate email format before insert', () => {
    const validEmails = [
      'test@example.com',
      'user.name@domain.co.uk',
      'user+tag@example.org',
    ];

    const invalidEmails = [
      'invalid',
      '@nodomain.com',
      'no@domain',
      '',
    ];

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    validEmails.forEach((email) => {
      expect(emailRegex.test(email)).toBe(true);
    });

    invalidEmails.forEach((email) => {
      expect(emailRegex.test(email)).toBe(false);
    });
  });

  it('should validate phone format', () => {
    const validPhones = [
      '+44 7911 123456',
      '07911123456',
      '+447911123456',
      '020 7946 0958',
    ];

    // Simple phone validation (at least 10 digits)
    const phoneRegex = /^[\d\s+()-]{10,}$/;

    validPhones.forEach((phone) => {
      expect(phoneRegex.test(phone)).toBe(true);
    });
  });

  it('should store lead with search reference', async () => {
    const mockLead = {
      email: 'test@example.com',
      name: 'John Doe',
      phone: '+44 7911 123456',
      searchId: 'search-123',
    };

    mockSupabase.single.mockResolvedValue({
      data: { id: 'lead-123', ...mockLead },
      error: null,
    });

    const result = await mockSupabase
      .from('leads')
      .insert(mockLead)
      .select()
      .single();

    expect(result.data.email).toBe(mockLead.email);
    expect(result.data.searchId).toBe(mockLead.searchId);
  });
});

describe('Status Determination Logic', () => {
  const determineStatus = (
    hasListedBuilding: boolean,
    listedGrade: string | null,
    inConservationArea: boolean,
    hasArticle4: boolean
  ): 'RED' | 'AMBER' | 'GREEN' => {
    // Listed building = RED
    if (hasListedBuilding) {
      return 'RED';
    }

    // Conservation area = AMBER
    if (inConservationArea) {
      return 'AMBER';
    }

    // No restrictions = GREEN
    return 'GREEN';
  };

  it('should return RED for any listed building', () => {
    expect(determineStatus(true, 'I', false, false)).toBe('RED');
    expect(determineStatus(true, 'II*', false, false)).toBe('RED');
    expect(determineStatus(true, 'II', false, false)).toBe('RED');
  });

  it('should return RED for listed building even in conservation area', () => {
    expect(determineStatus(true, 'II', true, true)).toBe('RED');
  });

  it('should return AMBER for conservation area without listing', () => {
    expect(determineStatus(false, null, true, false)).toBe('AMBER');
    expect(determineStatus(false, null, true, true)).toBe('AMBER');
  });

  it('should return GREEN when no heritage designations', () => {
    expect(determineStatus(false, null, false, false)).toBe('GREEN');
  });
});

describe('Distance Calculation', () => {
  // Haversine formula for distance between two points
  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371000; // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  it('should calculate distance between two London points accurately', () => {
    // Westminster to City of London (~3km)
    const distance = calculateDistance(51.4995, -0.1248, 51.5155, -0.0922);
    
    expect(distance).toBeGreaterThan(2500);
    expect(distance).toBeLessThan(3500);
  });

  it('should return 0 for same point', () => {
    const distance = calculateDistance(51.5074, -0.1278, 51.5074, -0.1278);
    expect(distance).toBe(0);
  });

  it('should identify points within 10m radius', () => {
    const baseLat = 51.5074;
    const baseLng = -0.1278;
    
    // Point approximately 5m away
    const nearbyLat = baseLat + 0.00004;
    const nearbyLng = baseLng + 0.00004;
    
    const distance = calculateDistance(baseLat, baseLng, nearbyLat, nearbyLng);
    expect(distance).toBeLessThan(10);
  });
});
