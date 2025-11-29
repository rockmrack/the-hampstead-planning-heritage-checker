/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server';

// Mock Supabase client
jest.mock('@/lib/supabase/client', () => ({
  supabase: {
    from: jest.fn(),
    rpc: jest.fn(),
  },
  supabaseAdmin: {
    from: jest.fn(),
    rpc: jest.fn(),
  },
}));

// Mock logger
jest.mock('@/lib/utils/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
  },
}));

// Mock rate limiter
jest.mock('@/lib/utils/rate-limiter', () => ({
  rateLimit: jest.fn().mockResolvedValue({ success: true }),
}));

describe('Check Property API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/check-property', () => {
    it('should return 400 if address is missing', async () => {
      const { GET } = await import('@/app/api/check-property/route');
      
      const request = new NextRequest('http://localhost:3000/api/check-property');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Address is required');
    });

    it('should return 400 if address is too short', async () => {
      const { GET } = await import('@/app/api/check-property/route');
      
      const request = new NextRequest('http://localhost:3000/api/check-property?address=ab');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Address must be at least 3 characters');
    });

    it('should check property status for valid address', async () => {
      const { supabaseAdmin } = await import('@/lib/supabase/client');
      
      // Mock the property check service
      const mockListedBuildings = {
        data: [],
        error: null,
      };
      
      const mockConservationAreas = {
        data: [],
        error: null,
      };

      (supabaseAdmin.rpc as jest.Mock)
        .mockResolvedValueOnce(mockListedBuildings)
        .mockResolvedValueOnce(mockConservationAreas);

      const { GET } = await import('@/app/api/check-property/route');
      
      const request = new NextRequest(
        'http://localhost:3000/api/check-property?address=10%20Flask%20Walk%2C%20Hampstead&lat=51.5575&lng=-0.1780'
      );
      
      const response = await GET(request);
      
      expect(response.status).toBe(200);
    });
  });

  describe('POST /api/check-property', () => {
    it('should accept POST requests with body', async () => {
      const { POST } = await import('@/app/api/check-property/route');
      
      const request = new NextRequest('http://localhost:3000/api/check-property', {
        method: 'POST',
        body: JSON.stringify({
          address: '10 Flask Walk, Hampstead',
          latitude: 51.5575,
          longitude: -0.1780,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const response = await POST(request);
      
      // Should not return 400 for missing address
      expect(response.status).not.toBe(400);
    });
  });
});

describe('Health API', () => {
  it('should return health status', async () => {
    const { GET } = await import('@/app/api/health/route');
    
    const request = new NextRequest('http://localhost:3000/api/health');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.status).toBeDefined();
    expect(data.timestamp).toBeDefined();
  });
});

describe('Lead Capture API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 if email is missing', async () => {
    const { POST } = await import('@/app/api/lead-capture/route');
    
    const request = new NextRequest('http://localhost:3000/api/lead-capture', {
      method: 'POST',
      body: JSON.stringify({}),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain('email');
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
    expect(data.error).toContain('email');
  });

  it('should capture lead with valid data', async () => {
    const { supabaseAdmin } = await import('@/lib/supabase/client');
    
    (supabaseAdmin.from as jest.Mock).mockReturnValue({
      insert: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({
            data: { id: 'test-id' },
            error: null,
          }),
        }),
      }),
    });

    const { POST } = await import('@/app/api/lead-capture/route');
    
    const request = new NextRequest('http://localhost:3000/api/lead-capture', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        name: 'Test User',
        propertyAddress: '10 Flask Walk, Hampstead',
        propertyStatus: 'AMBER',
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    const response = await POST(request);
    
    expect(response.status).toBe(200);
  });
});
