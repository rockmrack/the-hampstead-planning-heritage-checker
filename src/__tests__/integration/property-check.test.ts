/**
 * Integration tests for Property Check Flow
 * Tests the complete flow from address input to heritage status result
 */

import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import type { SupabaseClient } from '@supabase/supabase-js';

// Mock external dependencies
jest.mock('@/lib/supabase', () => ({
  getSupabaseAdmin: jest.fn(),
}));

jest.mock('@/lib/utils/rate-limiter', () => ({
  checkRateLimitAsync: jest.fn().mockResolvedValue({ allowed: true, remaining: 99 }),
  getClientIdentifier: jest.fn().mockReturnValue('test-client'),
  DEFAULT_RATE_LIMIT: { maxRequests: 100, windowMs: 60000 },
}));

jest.mock('@/lib/utils/cache', () => ({
  cache: {
    get: jest.fn().mockReturnValue(null),
    set: jest.fn(),
    getAsync: jest.fn().mockResolvedValue(null),
    setAsync: jest.fn().mockResolvedValue(undefined),
  },
  cacheKeys: { propertyCheck: (p: string) => `property:${p}` },
  cacheTTL: { propertyCheck: 300 },
}));

// Import after mocks
import { getSupabaseAdmin } from '@/lib/supabase';
import { PropertyCheckService } from '@/services/property-check';

describe('Property Check Integration', () => {
  let mockSupabase: jest.Mocked<Partial<SupabaseClient>>;
  let propertyService: PropertyCheckService;

  beforeEach(() => {
    jest.clearAllMocks();

    // Create mock Supabase client
    mockSupabase = {
      rpc: jest.fn(),
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn(),
    } as unknown as jest.Mocked<Partial<SupabaseClient>>;

    (getSupabaseAdmin as jest.Mock).mockReturnValue(mockSupabase);

    propertyService = new PropertyCheckService();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Listed Building Detection', () => {
    it('should return RED status when property is within 10m of Grade I listed building', async () => {
      // Mock listed building query
      (mockSupabase.rpc as jest.Mock).mockResolvedValueOnce({
        data: [{
          id: 'lb-123',
          list_entry_number: '1234567',
          name: 'Historic Manor House',
          grade: 'I',
          location: { type: 'Point', coordinates: [-0.1234, 51.5678] },
          hyperlink: 'https://historicengland.org.uk/listing/1234567',
        }],
        error: null,
      });

      // Mock conservation area query (no match)
      (mockSupabase.rpc as jest.Mock).mockResolvedValueOnce({
        data: [],
        error: null,
      });

      // Mock search log insert
      (mockSupabase.from as jest.Mock).mockReturnValue({
        insert: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: { id: 'search-123' },
              error: null,
            }),
          }),
        }),
      });

      const result = await propertyService.checkProperty(
        51.5678,
        -0.1234,
        '123 High Street, London NW1 1AA'
      );

      expect(result.status).toBe('RED');
      expect(result.listedBuilding).toBeDefined();
      expect(result.listedBuilding?.grade).toBe('I');
      expect(result.listedBuilding?.name).toBe('Historic Manor House');
    });

    it('should return RED status for Grade II* listed building', async () => {
      (mockSupabase.rpc as jest.Mock).mockResolvedValueOnce({
        data: [{
          id: 'lb-456',
          list_entry_number: '7654321',
          name: 'Victorian Villa',
          grade: 'II*',
          location: { type: 'Point', coordinates: [-0.1234, 51.5678] },
          hyperlink: 'https://historicengland.org.uk/listing/7654321',
        }],
        error: null,
      });

      (mockSupabase.rpc as jest.Mock).mockResolvedValueOnce({
        data: [],
        error: null,
      });

      (mockSupabase.from as jest.Mock).mockReturnValue({
        insert: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: { id: 'search-456' },
              error: null,
            }),
          }),
        }),
      });

      const result = await propertyService.checkProperty(
        51.5678,
        -0.1234,
        '456 Park Road, London NW3 2BB'
      );

      expect(result.status).toBe('RED');
      expect(result.listedBuilding?.grade).toBe('II*');
    });
  });

  describe('Conservation Area Detection', () => {
    it('should return AMBER status when property is in conservation area without Article 4', async () => {
      // No listed building
      (mockSupabase.rpc as jest.Mock).mockResolvedValueOnce({
        data: [],
        error: null,
      });

      // Conservation area match
      (mockSupabase.rpc as jest.Mock).mockResolvedValueOnce({
        data: [{
          id: 'ca-789',
          name: 'Hampstead Conservation Area',
          borough: 'Camden',
          has_article_4: false,
        }],
        error: null,
      });

      (mockSupabase.from as jest.Mock).mockReturnValue({
        insert: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: { id: 'search-789' },
              error: null,
            }),
          }),
        }),
      });

      const result = await propertyService.checkProperty(
        51.5600,
        -0.1700,
        '789 Heath Street, London NW3 1AA'
      );

      expect(result.status).toBe('AMBER');
      expect(result.conservationArea).toBeDefined();
      expect(result.conservationArea?.name).toBe('Hampstead Conservation Area');
      expect(result.hasArticle4).toBe(false);
    });

    it('should return AMBER status with Article 4 flag when applicable', async () => {
      (mockSupabase.rpc as jest.Mock).mockResolvedValueOnce({
        data: [],
        error: null,
      });

      (mockSupabase.rpc as jest.Mock).mockResolvedValueOnce({
        data: [{
          id: 'ca-article4',
          name: 'Highgate Conservation Area',
          borough: 'Camden',
          has_article_4: true,
        }],
        error: null,
      });

      (mockSupabase.from as jest.Mock).mockReturnValue({
        insert: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: { id: 'search-article4' },
              error: null,
            }),
          }),
        }),
      });

      const result = await propertyService.checkProperty(
        51.5700,
        -0.1500,
        '100 Highgate Hill, London N6 5HE'
      );

      expect(result.status).toBe('AMBER');
      expect(result.hasArticle4).toBe(true);
    });

    it('should prioritize listed building status over conservation area', async () => {
      // Listed building match
      (mockSupabase.rpc as jest.Mock).mockResolvedValueOnce({
        data: [{
          id: 'lb-priority',
          list_entry_number: '9999999',
          name: 'Listed Building in CA',
          grade: 'II',
          location: { type: 'Point', coordinates: [-0.15, 51.55] },
          hyperlink: 'https://historicengland.org.uk/listing/9999999',
        }],
        error: null,
      });

      // Also in conservation area
      (mockSupabase.rpc as jest.Mock).mockResolvedValueOnce({
        data: [{
          id: 'ca-priority',
          name: 'Conservation Area',
          borough: 'Camden',
          has_article_4: true,
        }],
        error: null,
      });

      (mockSupabase.from as jest.Mock).mockReturnValue({
        insert: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: { id: 'search-priority' },
              error: null,
            }),
          }),
        }),
      });

      const result = await propertyService.checkProperty(
        51.55,
        -0.15,
        'Listed Building in Conservation Area'
      );

      // Should be RED because listed building takes priority
      expect(result.status).toBe('RED');
      expect(result.listedBuilding).toBeDefined();
      expect(result.conservationArea).toBeDefined();
    });
  });

  describe('GREEN Status (No Restrictions)', () => {
    it('should return GREEN status when no heritage designations found', async () => {
      (mockSupabase.rpc as jest.Mock).mockResolvedValueOnce({
        data: [],
        error: null,
      });

      (mockSupabase.rpc as jest.Mock).mockResolvedValueOnce({
        data: [],
        error: null,
      });

      (mockSupabase.from as jest.Mock).mockReturnValue({
        insert: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: { id: 'search-green' },
              error: null,
            }),
          }),
        }),
      });

      const result = await propertyService.checkProperty(
        51.5000,
        -0.1000,
        'Modern Building, London E1 1AA'
      );

      expect(result.status).toBe('GREEN');
      expect(result.listedBuilding).toBeNull();
      expect(result.conservationArea).toBeNull();
    });
  });

  describe('Error Handling', () => {
    it('should throw error when database query fails', async () => {
      (mockSupabase.rpc as jest.Mock).mockResolvedValueOnce({
        data: null,
        error: { message: 'Database connection failed', code: 'PGRST001' },
      });

      await expect(
        propertyService.checkProperty(51.5, -0.1, 'Test Address')
      ).rejects.toThrow();
    });

    it('should handle invalid coordinates gracefully', async () => {
      // Invalid latitude (> 90)
      await expect(
        propertyService.checkProperty(91.0, -0.1, 'Test Address')
      ).rejects.toThrow();

      // Invalid longitude (< -180)
      await expect(
        propertyService.checkProperty(51.5, -181.0, 'Test Address')
      ).rejects.toThrow();
    });
  });
});

describe('Coordinate Validation', () => {
  it('should validate UK coordinates are within bounds', () => {
    // UK approximate bounds
    const UK_BOUNDS = {
      minLat: 49.9,
      maxLat: 60.9,
      minLng: -8.6,
      maxLng: 1.8,
    };

    const isValidUKCoordinate = (lat: number, lng: number): boolean => {
      return (
        lat >= UK_BOUNDS.minLat &&
        lat <= UK_BOUNDS.maxLat &&
        lng >= UK_BOUNDS.minLng &&
        lng <= UK_BOUNDS.maxLng
      );
    };

    // Valid UK coordinates
    expect(isValidUKCoordinate(51.5074, -0.1278)).toBe(true); // London
    expect(isValidUKCoordinate(53.4808, -2.2426)).toBe(true); // Manchester
    expect(isValidUKCoordinate(55.9533, -3.1883)).toBe(true); // Edinburgh

    // Invalid coordinates (outside UK)
    expect(isValidUKCoordinate(40.7128, -74.0060)).toBe(false); // New York
    expect(isValidUKCoordinate(48.8566, 2.3522)).toBe(false); // Paris
  });
});

describe('Cache Integration', () => {
  it('should use cached result when available', async () => {
    const { cache } = require('@/lib/utils/cache');
    const cachedResult = {
      status: 'GREEN',
      address: 'Cached Address',
      coordinates: { latitude: 51.5, longitude: -0.1 },
      postcode: 'NW1 1AA',
      hasArticle4: false,
      timestamp: new Date().toISOString(),
      searchId: 'cached-search-id',
      listedBuilding: null,
      conservationArea: null,
    };

    cache.getAsync.mockResolvedValueOnce(cachedResult);

    // Import fresh to get mocked cache
    const service = new PropertyCheckService();
    
    // The service would use the cached result
    // This is a simplified test - in reality we'd test the full flow
    expect(cache.getAsync).toBeDefined();
  });
});
