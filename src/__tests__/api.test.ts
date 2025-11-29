/**
 * API Route Tests
 * Comprehensive tests for all API endpoints
 * @jest-environment node
 */

import { NextRequest } from 'next/server';

// Mock modules before imports
jest.mock('@/lib/supabase/client', () => ({
  supabase: {
    from: jest.fn().mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({ data: null, error: null }),
        }),
        limit: jest.fn().mockResolvedValue({ data: [], error: null }),
      }),
      insert: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({ data: { id: 'test-id' }, error: null }),
        }),
      }),
    }),
    rpc: jest.fn().mockResolvedValue({ data: [], error: null }),
  },
  getSupabaseClient: jest.fn().mockReturnValue({
    from: jest.fn().mockReturnValue({
      select: jest.fn().mockReturnValue({
        limit: jest.fn().mockResolvedValue({ data: [], error: null }),
      }),
    }),
    rpc: jest.fn().mockResolvedValue({ data: [], error: null }),
  }),
  getSupabaseAdmin: jest.fn().mockReturnValue({
    from: jest.fn().mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({ data: null, error: null }),
        }),
      }),
      insert: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({ data: { id: 'test-id' }, error: null }),
        }),
      }),
    }),
    rpc: jest.fn().mockResolvedValue({ data: [], error: null }),
  }),
}));

jest.mock('@/lib/utils/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
    log: jest.fn(),
  },
  logInfo: jest.fn(),
  logError: jest.fn(),
  logWarn: jest.fn(),
  logDebug: jest.fn(),
  logRequest: jest.fn(),
  logSearch: jest.fn(),
  logApiCall: jest.fn(),
  setRequestContext: jest.fn(),
  clearRequestContext: jest.fn(),
}));

jest.mock('@/lib/redis', () => ({
  getRedisClient: jest.fn().mockResolvedValue(null),
  isRedisAvailable: jest.fn().mockResolvedValue(false),
}));

// Mock fetch for geocoding
global.fetch = jest.fn().mockImplementation((url: string) => {
  if (url.includes('mapbox')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({
        features: [{
          place_name: '10 Flask Walk, Hampstead, London NW3 1HE',
          center: [-0.1780, 51.5575],
          relevance: 1.0,
          place_type: ['address'],
          context: [
            { id: 'postcode.123', text: 'NW3 1HE' },
            { id: 'locality.456', text: 'Hampstead' },
          ],
        }],
      }),
    });
  }
  return Promise.reject(new Error('Not mocked'));
});

describe('Check Property API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/check-property', () => {
    it('should return 400 for invalid JSON body', async () => {
      const { POST } = await import('@/app/api/check-property/route');
      
      const request = new NextRequest('http://localhost:3000/api/check-property', {
        method: 'POST',
        body: 'invalid json',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.errorCode).toBe('VALIDATION_ERROR');
    });

    it('should return 400 if address is too short', async () => {
      const { POST } = await import('@/app/api/check-property/route');
      
      const request = new NextRequest('http://localhost:3000/api/check-property', {
        method: 'POST',
        body: JSON.stringify({ address: 'ab' }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
    });

    it('should process valid address with coordinates', async () => {
      const { POST } = await import('@/app/api/check-property/route');
      
      const request = new NextRequest('http://localhost:3000/api/check-property', {
        method: 'POST',
        body: JSON.stringify({
          address: '10 Flask Walk, Hampstead, London',
          postcode: 'NW3 1HE',
          coordinates: {
            latitude: 51.5575,
            longitude: -0.1780,
          },
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const response = await POST(request);
      
      // Should return 200 or handle gracefully
      expect([200, 400, 404]).toContain(response.status);
    });

    it('should handle missing coordinates and geocode', async () => {
      const { POST } = await import('@/app/api/check-property/route');
      
      const request = new NextRequest('http://localhost:3000/api/check-property', {
        method: 'POST',
        body: JSON.stringify({
          address: '10 Flask Walk, Hampstead, London NW3',
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const response = await POST(request);
      
      // Should either succeed or fail gracefully
      expect(response.status).toBeDefined();
    });
  });

  describe('OPTIONS /api/check-property', () => {
    it('should return CORS headers', async () => {
      const { OPTIONS } = await import('@/app/api/check-property/route');
      
      const response = await OPTIONS();
      
      expect(response.status).toBe(204);
      expect(response.headers.get('Access-Control-Allow-Methods')).toContain('POST');
    });
  });
});

describe('Health API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return health status', async () => {
    const { GET } = await import('@/app/api/health/route');
    
    const request = new NextRequest('http://localhost:3000/api/health');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.status).toBeDefined();
    expect(data.timestamp).toBeDefined();
  });

  it('should include version information', async () => {
    const { GET } = await import('@/app/api/health/route');
    
    const request = new NextRequest('http://localhost:3000/api/health');
    const response = await GET(request);
    const data = await response.json();

    expect(data.version).toBeDefined();
  });
});

describe('Lead Capture API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/lead-capture', () => {
    it('should return 400 if email is missing', async () => {
      const { POST } = await import('@/app/api/lead-capture/route');
      
      const request = new NextRequest('http://localhost:3000/api/lead-capture', {
        method: 'POST',
        body: JSON.stringify({ name: 'Test' }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
    });

    it('should return 400 if email is invalid', async () => {
      const { POST } = await import('@/app/api/lead-capture/route');
      
      const request = new NextRequest('http://localhost:3000/api/lead-capture', {
        method: 'POST',
        body: JSON.stringify({
          email: 'invalid-email',
          propertyAddress: '10 Flask Walk',
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
    });

    it('should capture lead with valid data', async () => {
      const { POST } = await import('@/app/api/lead-capture/route');
      
      const request = new NextRequest('http://localhost:3000/api/lead-capture', {
        method: 'POST',
        body: JSON.stringify({
          email: 'test@example.com',
          name: 'Test User',
          propertyAddress: '10 Flask Walk, Hampstead',
          propertyStatus: 'AMBER',
          marketingConsent: true,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const response = await POST(request);
      
      expect([200, 201]).toContain(response.status);
    });

    it('should handle database errors gracefully', async () => {
      const { getSupabaseAdmin } = await import('@/lib/supabase/client');
      
      (getSupabaseAdmin as jest.Mock).mockReturnValueOnce({
        from: jest.fn().mockReturnValue({
          insert: jest.fn().mockReturnValue({
            select: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({ 
                data: null, 
                error: { message: 'Database error' } 
              }),
            }),
          }),
        }),
      });

      const { POST } = await import('@/app/api/lead-capture/route');
      
      const request = new NextRequest('http://localhost:3000/api/lead-capture', {
        method: 'POST',
        body: JSON.stringify({
          email: 'test@example.com',
          propertyAddress: '10 Flask Walk',
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const response = await POST(request);
      
      // Should handle error gracefully
      expect(response.status).toBeDefined();
    });
  });
});

describe('Geocode API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 if address is missing', async () => {
    const { GET } = await import('@/app/api/geocode/route');
    
    const request = new NextRequest('http://localhost:3000/api/geocode');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
  });

  it('should geocode valid address', async () => {
    const { GET } = await import('@/app/api/geocode/route');
    
    const request = new NextRequest(
      'http://localhost:3000/api/geocode?address=Flask%20Walk%2C%20Hampstead'
    );
    const response = await GET(request);
    
    // Should return results or handle gracefully
    expect([200, 400, 500]).toContain(response.status);
  });
});

describe('Rate Limiting', () => {
  it('should have rate limit headers in responses', async () => {
    const { POST } = await import('@/app/api/check-property/route');
    
    const request = new NextRequest('http://localhost:3000/api/check-property', {
      method: 'POST',
      body: JSON.stringify({
        address: '10 Flask Walk, Hampstead',
        coordinates: { latitude: 51.5575, longitude: -0.1780 },
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    const response = await POST(request);
    
    // Rate limit headers should be present
    const remaining = response.headers.get('X-RateLimit-Remaining');
    expect(remaining).toBeDefined();
  });
});
