/**
 * Professional API Service
 * Enterprise tier with enhanced rate limits and features
 */

export interface APITier {
  name: string;
  slug: 'free' | 'starter' | 'professional' | 'enterprise';
  price: {
    monthly: number;
    yearly: number;
  };
  limits: {
    requestsPerMinute: number;
    requestsPerDay: number;
    requestsPerMonth: number;
    maxConcurrent: number;
  };
  features: string[];
  support: string;
}

export const API_TIERS: Record<string, APITier> = {
  free: {
    name: 'Free',
    slug: 'free',
    price: { monthly: 0, yearly: 0 },
    limits: {
      requestsPerMinute: 10,
      requestsPerDay: 100,
      requestsPerMonth: 1000,
      maxConcurrent: 2,
    },
    features: [
      'Heritage status check',
      'Basic property lookup',
      'Conservation area info',
    ],
    support: 'Community',
  },
  starter: {
    name: 'Starter',
    slug: 'starter',
    price: { monthly: 29, yearly: 290 },
    limits: {
      requestsPerMinute: 30,
      requestsPerDay: 500,
      requestsPerMonth: 10000,
      maxConcurrent: 5,
    },
    features: [
      'Everything in Free',
      'Feasibility assessment',
      'Approval prediction',
      'Project type analysis',
      'PDF report export',
    ],
    support: 'Email',
  },
  professional: {
    name: 'Professional',
    slug: 'professional',
    price: { monthly: 99, yearly: 990 },
    limits: {
      requestsPerMinute: 100,
      requestsPerDay: 2000,
      requestsPerMonth: 50000,
      maxConcurrent: 20,
    },
    features: [
      'Everything in Starter',
      'Bulk property checks',
      'Application tracking',
      'Document generation',
      'Planning alerts API',
      'Webhook notifications',
      'Priority processing',
    ],
    support: 'Priority email + chat',
  },
  enterprise: {
    name: 'Enterprise',
    slug: 'enterprise',
    price: { monthly: 499, yearly: 4990 },
    limits: {
      requestsPerMinute: 500,
      requestsPerDay: 20000,
      requestsPerMonth: 500000,
      maxConcurrent: 100,
    },
    features: [
      'Everything in Professional',
      'Unlimited team members',
      'Custom integrations',
      'Dedicated infrastructure',
      'SLA guarantee (99.9%)',
      'Custom data exports',
      'White-label options',
      'Historical data access',
      'API analytics dashboard',
    ],
    support: 'Dedicated account manager',
  },
};

export interface APIKey {
  id: string;
  key: string;
  name: string;
  tier: APITier['slug'];
  userId: string;
  organizationId?: string;
  
  // Usage tracking
  usage: {
    today: number;
    thisMonth: number;
    total: number;
  };
  
  // Rate limiting
  lastRequest?: string;
  requestsInCurrentMinute: number;
  
  // Metadata
  createdAt: string;
  lastUsedAt?: string;
  expiresAt?: string;
  
  // Permissions
  permissions: string[];
  ipWhitelist?: string[];
  allowedOrigins?: string[];
}

export interface UsageRecord {
  id: string;
  apiKeyId: string;
  endpoint: string;
  method: string;
  statusCode: number;
  responseTime: number;
  timestamp: string;
  ip?: string;
  userAgent?: string;
}

// ===========================================
// RATE LIMITER
// ===========================================

export class RateLimiter {
  private windowMs = 60000; // 1 minute window
  private requests: Map<string, { count: number; windowStart: number }> = new Map();

  check(apiKey: APIKey): { allowed: boolean; remaining: number; resetAt: Date } {
    const tier = API_TIERS[apiKey.tier];
    const now = Date.now();
    const windowStart = Math.floor(now / this.windowMs) * this.windowMs;

    // If an unknown tier is provided, fail closed and report zero remaining
    if (!tier) {
      const resetAt = new Date(windowStart + this.windowMs);
      return { allowed: false, remaining: 0, resetAt };
    }

    const key = apiKey.id;
    let record = this.requests.get(key);

    // Reset window if needed
    if (!record || record.windowStart !== windowStart) {
      record = { count: 0, windowStart };
      this.requests.set(key, record);
    }

    const remaining = tier.limits.requestsPerMinute - record.count;
    const resetAt = new Date(windowStart + this.windowMs);

    if (record.count >= tier.limits.requestsPerMinute) {
      return { allowed: false, remaining: 0, resetAt };
    }

    record.count++;
    return { allowed: true, remaining: remaining - 1, resetAt };
  }

  checkDaily(apiKey: APIKey): boolean {
    const tier = API_TIERS[apiKey.tier];
    if (!tier) return false;
    return apiKey.usage.today < tier.limits.requestsPerDay;
  }

  checkMonthly(apiKey: APIKey): boolean {
    const tier = API_TIERS[apiKey.tier];
    if (!tier) return false;
    return apiKey.usage.thisMonth < tier.limits.requestsPerMonth;
  }
}

// ===========================================
// API KEY MANAGER
// ===========================================

export class APIKeyManager {
  private keys: Map<string, APIKey> = new Map();
  private rateLimiter = new RateLimiter();

  generateKey(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let key = 'hpe_';
    for (let i = 0; i < 32; i++) {
      key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return key;
  }

  createAPIKey(
    userId: string,
    name: string,
    tier: APITier['slug'] = 'free',
    options?: {
      organizationId?: string;
      expiresAt?: string;
      permissions?: string[];
      ipWhitelist?: string[];
      allowedOrigins?: string[];
    }
  ): APIKey {
    const id = `key_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const key = this.generateKey();

    const apiKey: APIKey = {
      id,
      key,
      name,
      tier,
      userId,
      organizationId: options?.organizationId,
      usage: {
        today: 0,
        thisMonth: 0,
        total: 0,
      },
      requestsInCurrentMinute: 0,
      createdAt: new Date().toISOString(),
      expiresAt: options?.expiresAt,
      permissions: options?.permissions || ['read'],
      ipWhitelist: options?.ipWhitelist,
      allowedOrigins: options?.allowedOrigins,
    };

    this.keys.set(key, apiKey);
    return apiKey;
  }

  validateKey(key: string): {
    valid: boolean;
    apiKey?: APIKey;
    error?: string;
  } {
    const apiKey = this.keys.get(key);

    if (!apiKey) {
      return { valid: false, error: 'Invalid API key' };
    }

    // Check expiration
    if (apiKey.expiresAt && new Date(apiKey.expiresAt) < new Date()) {
      return { valid: false, error: 'API key has expired' };
    }

    // Check rate limits
    const rateCheck = this.rateLimiter.check(apiKey);
    if (!rateCheck.allowed) {
      return { 
        valid: false, 
        error: `Rate limit exceeded. Resets at ${rateCheck.resetAt.toISOString()}`,
      };
    }

    if (!this.rateLimiter.checkDaily(apiKey)) {
      return { valid: false, error: 'Daily request limit exceeded' };
    }

    if (!this.rateLimiter.checkMonthly(apiKey)) {
      return { valid: false, error: 'Monthly request limit exceeded' };
    }

    return { valid: true, apiKey };
  }

  validateIP(apiKey: APIKey, ip: string): boolean {
    if (!apiKey.ipWhitelist || apiKey.ipWhitelist.length === 0) {
      return true;
    }
    return apiKey.ipWhitelist.includes(ip);
  }

  validateOrigin(apiKey: APIKey, origin: string): boolean {
    if (!apiKey.allowedOrigins || apiKey.allowedOrigins.length === 0) {
      return true;
    }
    return apiKey.allowedOrigins.some(allowed => {
      if (allowed.includes('*')) {
        const pattern = allowed.replace(/\*/g, '.*');
        return new RegExp(`^${pattern}$`).test(origin);
      }
      return allowed === origin;
    });
  }

  recordUsage(key: string): void {
    const apiKey = this.keys.get(key);
    if (apiKey) {
      apiKey.usage.today++;
      apiKey.usage.thisMonth++;
      apiKey.usage.total++;
      apiKey.lastUsedAt = new Date().toISOString();
    }
  }

  getUsageStats(key: string): {
    usage: APIKey['usage'];
    limits: APITier['limits'];
    percentUsed: {
      daily: number;
      monthly: number;
    };
  } | null {
    const apiKey = this.keys.get(key);
    if (!apiKey) return null;

    const tier = API_TIERS[apiKey.tier];
    return {
      usage: apiKey.usage,
      limits: tier.limits,
      percentUsed: {
        daily: (apiKey.usage.today / tier.limits.requestsPerDay) * 100,
        monthly: (apiKey.usage.thisMonth / tier.limits.requestsPerMonth) * 100,
      },
    };
  }

  revokeKey(key: string): boolean {
    return this.keys.delete(key);
  }

  getUserKeys(userId: string): APIKey[] {
    return Array.from(this.keys.values()).filter(k => k.userId === userId);
  }

  upgradeTier(key: string, newTier: APITier['slug']): APIKey | null {
    const apiKey = this.keys.get(key);
    if (!apiKey) return null;
    
    apiKey.tier = newTier;
    return apiKey;
  }
}

// Singleton instance
export const apiKeyManager = new APIKeyManager();

// ===========================================
// MIDDLEWARE HELPER
// ===========================================

export function createAPIMiddleware() {
  return async function validateAPIRequest(
    request: Request,
    options?: { requiredPermissions?: string[] }
  ): Promise<{
    valid: boolean;
    apiKey?: APIKey;
    tier?: APITier;
    error?: string;
    statusCode?: number;
  }> {
    // Extract API key from header
    const authHeader = request.headers.get('Authorization');
    const apiKeyHeader = request.headers.get('X-API-Key');
    
    let key: string | null = null;
    
    if (authHeader?.startsWith('Bearer ')) {
      key = authHeader.substring(7);
    } else if (apiKeyHeader) {
      key = apiKeyHeader;
    }

    if (!key) {
      return {
        valid: false,
        error: 'API key required. Provide via Authorization: Bearer <key> or X-API-Key header',
        statusCode: 401,
      };
    }

    // Validate the key
    const validation = apiKeyManager.validateKey(key);
    if (!validation.valid || !validation.apiKey) {
      return {
        valid: false,
        error: validation.error || 'Invalid API key',
        statusCode: validation.error?.includes('Rate limit') ? 429 : 401,
      };
    }

    const apiKey = validation.apiKey;
    const tier = API_TIERS[apiKey.tier];

    // Check IP whitelist
    const ip = request.headers.get('X-Forwarded-For')?.split(',')[0] || 
               request.headers.get('X-Real-IP') || 
               'unknown';
    
    if (!apiKeyManager.validateIP(apiKey, ip)) {
      return {
        valid: false,
        error: 'IP address not whitelisted',
        statusCode: 403,
      };
    }

    // Check origin
    const origin = request.headers.get('Origin') || '';
    if (origin && !apiKeyManager.validateOrigin(apiKey, origin)) {
      return {
        valid: false,
        error: 'Origin not allowed',
        statusCode: 403,
      };
    }

    // Check permissions
    if (options?.requiredPermissions) {
      const hasPermission = options.requiredPermissions.every(
        perm => apiKey.permissions.includes(perm) || apiKey.permissions.includes('admin')
      );
      if (!hasPermission) {
        return {
          valid: false,
          error: 'Insufficient permissions',
          statusCode: 403,
        };
      }
    }

    // Record usage
    apiKeyManager.recordUsage(key);

    return {
      valid: true,
      apiKey,
      tier,
    };
  };
}

// ===========================================
// API RESPONSE HELPERS
// ===========================================

export function addRateLimitHeaders(
  headers: Headers,
  apiKey: APIKey
): void {
  const tier = API_TIERS[apiKey.tier];
  const stats = apiKeyManager.getUsageStats(apiKey.key);
  
  if (stats) {
    headers.set('X-RateLimit-Limit', tier.limits.requestsPerMinute.toString());
    headers.set('X-RateLimit-Remaining', (tier.limits.requestsPerMinute - apiKey.requestsInCurrentMinute).toString());
    headers.set('X-RateLimit-Reset', new Date(Date.now() + 60000).toISOString());
    headers.set('X-Quota-Limit-Day', tier.limits.requestsPerDay.toString());
    headers.set('X-Quota-Remaining-Day', (tier.limits.requestsPerDay - stats.usage.today).toString());
    headers.set('X-Quota-Limit-Month', tier.limits.requestsPerMonth.toString());
    headers.set('X-Quota-Remaining-Month', (tier.limits.requestsPerMonth - stats.usage.thisMonth).toString());
  }
}

export function createErrorResponse(
  error: string,
  statusCode: number,
  requestId?: string
): Response {
  return new Response(
    JSON.stringify({
      success: false,
      error,
      requestId,
      timestamp: new Date().toISOString(),
    }),
    {
      status: statusCode,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}
