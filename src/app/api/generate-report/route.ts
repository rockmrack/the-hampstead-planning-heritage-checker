/**
 * Server-side Report Generation API
 * Generates property reports in PDF or HTML format
 * Uses native PDF generation without external dependencies
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { getSupabaseAdmin } from '@/lib/supabase';
import { logInfo, logError, startTimer } from '@/lib/utils/logger';
import { checkRateLimitAsync, getClientIdentifier, DEFAULT_RATE_LIMIT } from '@/lib/utils/rate-limiter';
import { cache, cacheTTL } from '@/lib/utils/cache';
import { COMPANY_INFO, STATUS_CONFIG, LISTED_GRADES } from '@/lib/config';
import type { PropertyCheckResult } from '@/types';

// Request validation schema
const requestSchema = z.object({
  searchId: z.string().uuid('Invalid search ID'),
  email: z.string().email('Invalid email format'),
  includeMap: z.boolean().optional().default(true),
  format: z.enum(['pdf', 'html', 'json']).optional().default('html'),
});

export async function POST(request: NextRequest) {
  const timer = startTimer();
  const clientId = getClientIdentifier(request);

  try {
    // Rate limiting
    const rateLimit = await checkRateLimitAsync(clientId, DEFAULT_RATE_LIMIT);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Rate limit exceeded', 
          errorCode: 'RATE_LIMITED' 
        },
        { 
          status: 429,
          headers: {
            'Retry-After': String(rateLimit.retryAfter ?? 60),
            'X-RateLimit-Remaining': '0',
          },
        }
      );
    }

    // Parse and validate request
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON body', errorCode: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    const validation = requestSchema.safeParse(body) as { success: boolean; data?: z.infer<typeof requestSchema>; error?: z.ZodError };
    if (!validation.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: validation.error?.errors[0]?.message ?? 'Validation failed',
          errorCode: 'VALIDATION_ERROR',
        },
        { status: 400 }
      );
    }

    const { searchId, email, format } = validation.data!;

    // Check cache first
    const cacheKey = `report:${searchId}`;
    const cachedResult = await cache.getAsync<PropertyCheckResult>(cacheKey);
    
    let propertyResult: PropertyCheckResult;

    if (cachedResult) {
      propertyResult = cachedResult;
      logInfo('Cache hit for report generation', { searchId });
    } else {
      // Fetch search result from database
      const supabase = getSupabaseAdmin();
      const { data, error } = await supabase
        .from('search_logs')
        .select('*')
        .eq('id', searchId)
        .single() as { 
          data: {
            status?: string;
            timestamp?: string;
            version?: string;
            search_address?: string;
            latitude?: number;
            longitude?: number;
            search_postcode?: string;
            borough?: string;
            has_article_4?: boolean;
            created_at?: string;
            id?: string;
            listed_building_id?: string;
            list_entry_number?: string;
            listed_building_name?: string;
            listed_building_grade?: string;
            conservation_area_id?: string;
            conservation_area_name?: string;
          } | null;
          error: { message?: string } | null;
        };

      if (error || !data) {
        return NextResponse.json(
          { success: false, error: 'Search result not found', errorCode: 'NOT_FOUND' },
          { status: 404 }
        );
      }

      // Reconstruct PropertyCheckResult
      propertyResult = {
        status: data.status as PropertyCheckResult['status'],
        address: data.search_address,
        coordinates: {
          latitude: data.latitude ?? 0,
          longitude: data.longitude ?? 0,
        },
        postcode: data.search_postcode ?? '',
        borough: data.borough,
        hasArticle4: data.has_article_4 ?? false,
        timestamp: data.created_at,
        searchId: data.id,
        listedBuilding: data.listed_building_id ? {
          id: data.listed_building_id,
          listEntryNumber: data.list_entry_number ?? '',
          name: data.listed_building_name ?? '',
          grade: (data.listed_building_grade ?? 'II') as 'I' | 'II' | 'II*',
          location: { type: 'Point' as const, coordinates: [data.longitude ?? 0, data.latitude ?? 0] },
          hyperlink: '',
        } : null,
        conservationArea: data.conservation_area_id ? {
          id: data.conservation_area_id,
          name: data.conservation_area_name ?? '',
          borough: data.borough ?? '',
          hasArticle4: data.has_article_4 ?? false,
        } : null,
      };

      // Cache for future requests
      await cache.setAsync(cacheKey, propertyResult, cacheTTL.propertyCheck);
    }

    // Return JSON if requested
    if (format === 'json') {
      return NextResponse.json({
        success: true,
        data: propertyResult,
        timestamp: new Date().toISOString(),
      });
    }

    // Generate HTML report (can be printed to PDF)
    const htmlReport = generateHTMLReport(propertyResult, email);
    
    const duration = timer();
    logInfo('Report generated', { 
      searchId, 
      email, 
      durationMs: duration,
      status: propertyResult.status,
      format,
    });

    // Return HTML
    return new NextResponse(htmlReport, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Disposition': `inline; filename="heritage-report-${searchId.slice(0, 8)}.html"`,
        'X-RateLimit-Remaining': String(rateLimit.remaining),
      },
    });

  } catch (error) {
    const duration = timer();
    logError('Report generation failed', error, { durationMs: duration });
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to generate report', 
        errorCode: 'SERVER_ERROR' 
      },
      { status: 500 }
    );
  }
}

/**
 * Generate HTML report (print-ready for PDF)
 */
function generateHTMLReport(result: PropertyCheckResult, userEmail: string): string {
  const statusConfig = STATUS_CONFIG[result.status];
  const statusColors = {
    RED: { bg: '#FEE2E2', text: '#991B1B', badge: '#DC2626' },
    AMBER: { bg: '#FEF3C7', text: '#92400E', badge: '#F59E0B' },
    GREEN: { bg: '#D1FAE5', text: '#065F46', badge: '#10B981' },
  };
  const colors = statusColors[result.status];

  const recommendations = result.status === 'RED' 
    ? [
        'Consult with a Listed Building specialist before planning any works',
        'Listed Building Consent is required for most alterations',
        'Consider a Heritage Impact Assessment',
        'Contact the Local Planning Authority for pre-application advice',
      ]
    : result.status === 'AMBER'
    ? [
        'Check local Conservation Area guidelines',
        'Planning permission may be needed for external alterations',
        'Tree works require notification to the council',
        'Consider impact on character of the area',
      ]
    : [
        'Standard permitted development rights apply',
        'Check specific conditions in your area',
        'Building regulations still apply to structural works',
        'Party wall agreements may be needed',
      ];

  const warningText = result.status === 'GREEN'
    ? (statusConfig as typeof STATUS_CONFIG.GREEN).opportunity
    : (statusConfig as typeof STATUS_CONFIG.RED | typeof STATUS_CONFIG.AMBER).warning;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Heritage Status Report - ${result.address}</title>
  <style>
    @page {
      size: A4;
      margin: 20mm;
    }
    
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #1F2937;
      background: #fff;
      padding: 40px;
      max-width: 800px;
      margin: 0 auto;
    }
    
    @media print {
      body {
        padding: 0;
      }
    }
    
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 32px;
      padding-bottom: 16px;
      border-bottom: 2px solid #E5E7EB;
    }
    
    .logo {
      font-size: 24px;
      font-weight: 700;
      color: #0F172A;
    }
    
    .logo span {
      color: #D4AF37;
    }
    
    .header-right {
      text-align: right;
      font-size: 12px;
      color: #6B7280;
    }
    
    .title {
      font-size: 28px;
      font-weight: 700;
      color: #0F172A;
      margin-bottom: 16px;
    }
    
    .status-badge {
      display: inline-block;
      padding: 8px 24px;
      border-radius: 24px;
      font-weight: 600;
      font-size: 14px;
      color: white;
      background: ${colors.badge};
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 24px;
    }
    
    .section {
      margin-bottom: 24px;
    }
    
    .section-title {
      font-size: 18px;
      font-weight: 600;
      color: #374151;
      margin-bottom: 12px;
      padding-bottom: 8px;
      border-bottom: 1px solid #E5E7EB;
    }
    
    .property-address {
      font-size: 20px;
      font-weight: 600;
      color: #0F172A;
      margin-bottom: 4px;
    }
    
    .property-details {
      color: #6B7280;
      font-size: 14px;
    }
    
    .status-box {
      background: ${colors.bg};
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 24px;
    }
    
    .status-headline {
      font-size: 16px;
      font-weight: 600;
      color: ${colors.text};
      margin-bottom: 8px;
    }
    
    .status-warning {
      font-size: 14px;
      color: ${colors.text};
    }
    
    .info-box {
      background: #F9FAFB;
      border: 1px solid #E5E7EB;
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 16px;
    }
    
    .info-box-title {
      font-size: 14px;
      font-weight: 600;
      color: #374151;
      margin-bottom: 8px;
    }
    
    .info-row {
      display: flex;
      justify-content: space-between;
      font-size: 13px;
      padding: 4px 0;
      border-bottom: 1px solid #F3F4F6;
    }
    
    .info-row:last-child {
      border-bottom: none;
    }
    
    .info-label {
      color: #6B7280;
    }
    
    .info-value {
      color: #1F2937;
      font-weight: 500;
    }
    
    .article4-badge {
      display: inline-block;
      background: #FEE2E2;
      color: #991B1B;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 500;
    }
    
    .recommendations-list {
      list-style: none;
      padding: 0;
    }
    
    .recommendations-list li {
      padding: 12px 16px;
      background: #F9FAFB;
      border-radius: 8px;
      margin-bottom: 8px;
      font-size: 14px;
      display: flex;
      align-items: flex-start;
    }
    
    .recommendations-list li::before {
      content: counter(recommendation);
      counter-increment: recommendation;
      background: #D4AF37;
      color: white;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 600;
      margin-right: 12px;
      flex-shrink: 0;
    }
    
    .recommendations-list {
      counter-reset: recommendation;
    }
    
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 2px solid #E5E7EB;
      font-size: 12px;
      color: #6B7280;
    }
    
    .footer-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
    }
    
    .disclaimer {
      text-align: center;
      margin-top: 16px;
      font-size: 11px;
      color: #9CA3AF;
      font-style: italic;
    }
    
    .print-button {
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: #0F172A;
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 8px;
      font-size: 14px;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }
    
    .print-button:hover {
      background: #1E293B;
    }
    
    @media print {
      .print-button {
        display: none;
      }
    }
  </style>
</head>
<body>
  <header class="header">
    <div class="logo">NW London <span>Heritage</span></div>
    <div class="header-right">
      <div>Property Status Report</div>
      <div>Generated: ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
    </div>
  </header>

  <h1 class="title">Heritage Status Report</h1>
  
  <div class="status-badge">${statusConfig.label}</div>

  <section class="section">
    <h2 class="section-title">Property Details</h2>
    <p class="property-address">${result.address}</p>
    <p class="property-details">
      ${result.postcode ? `${result.postcode}` : ''}
      ${result.borough ? ` • ${result.borough}` : ''}
    </p>
    ${result.coordinates.latitude && result.coordinates.longitude ? `
    <p class="property-details" style="margin-top: 4px;">
      Coordinates: ${result.coordinates.latitude.toFixed(6)}, ${result.coordinates.longitude.toFixed(6)}
    </p>
    ` : ''}
  </section>

  <div class="status-box">
    <p class="status-headline">${statusConfig.headline}</p>
    <p class="status-warning">${warningText}</p>
  </div>

  ${result.listedBuilding ? `
  <section class="section">
    <div class="info-box">
      <h3 class="info-box-title">Listed Building Details</h3>
      <div class="info-row">
        <span class="info-label">Name</span>
        <span class="info-value">${result.listedBuilding.name || 'Not specified'}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Grade</span>
        <span class="info-value">${LISTED_GRADES[result.listedBuilding.grade]?.label ?? result.listedBuilding.grade}</span>
      </div>
      <div class="info-row">
        <span class="info-label">List Entry Number</span>
        <span class="info-value">${result.listedBuilding.listEntryNumber || 'Not available'}</span>
      </div>
    </div>
  </section>
  ` : ''}

  ${result.conservationArea ? `
  <section class="section">
    <div class="info-box">
      <h3 class="info-box-title">Conservation Area Details</h3>
      <div class="info-row">
        <span class="info-label">Name</span>
        <span class="info-value">${result.conservationArea.name || 'Not specified'}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Borough</span>
        <span class="info-value">${result.conservationArea.borough}</span>
      </div>
      ${result.hasArticle4 ? `
      <div class="info-row">
        <span class="info-label">Article 4 Direction</span>
        <span class="info-value"><span class="article4-badge">Yes - Additional restrictions apply</span></span>
      </div>
      ` : ''}
    </div>
  </section>
  ` : ''}

  <section class="section">
    <h2 class="section-title">Recommendations</h2>
    <ul class="recommendations-list">
      ${recommendations.map(rec => `<li>${rec}</li>`).join('')}
    </ul>
  </section>

  <footer class="footer">
    <div class="footer-row">
      <span>Generated for: ${userEmail}</span>
      <span>Report ID: ${result.searchId?.slice(0, 8) || 'N/A'}</span>
    </div>
    <div class="footer-row">
      <span>${COMPANY_INFO.contact.phone}</span>
      <span>${COMPANY_INFO.contact.email}</span>
    </div>
    <p class="disclaimer">
      This report is for informational purposes only and does not constitute legal or planning advice. 
      Always consult with qualified professionals and your local planning authority before undertaking any works.
    </p>
  </footer>

  <button class="print-button" onclick="window.print()">
    📄 Download PDF
  </button>
</body>
</html>`;
}

// OPTIONS handler for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
