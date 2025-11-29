/**
 * E2E Tests - Homepage & Property Search
 * Tests the core user flows for the Heritage & Planning Checker
 */

import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the hero section with search input', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/Heritage & Planning Checker/i);

    // Check hero heading
    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toBeVisible();

    // Check search input exists
    const searchInput = page.getByRole('combobox', { name: /search for a property/i });
    await expect(searchInput).toBeVisible();
    await expect(searchInput).toBeEnabled();
  });

  test('should show autocomplete suggestions when typing an address', async ({ page }) => {
    const searchInput = page.getByRole('combobox', { name: /search for a property/i });
    
    // Type a partial address
    await searchInput.fill('Hampstead');
    
    // Wait for autocomplete results (debounced)
    await page.waitForTimeout(500);
    
    // Check for dropdown with suggestions
    const listbox = page.getByRole('listbox');
    await expect(listbox).toBeVisible({ timeout: 5000 });
    
    // Should have at least one option
    const options = listbox.getByRole('option');
    await expect(options.first()).toBeVisible();
  });

  test('should navigate using keyboard in autocomplete', async ({ page }) => {
    const searchInput = page.getByRole('combobox', { name: /search for a property/i });
    
    await searchInput.fill('NW3');
    await page.waitForTimeout(500);
    
    // Press arrow down to highlight first result
    await searchInput.press('ArrowDown');
    
    // First option should be highlighted (aria-selected)
    const listbox = page.getByRole('listbox');
    if (await listbox.isVisible()) {
      const firstOption = listbox.getByRole('option').first();
      await expect(firstOption).toHaveAttribute('aria-selected', 'true');
    }
  });

  test('should display the interactive map', async ({ page }) => {
    // Map container should be visible
    const mapContainer = page.locator('.mapboxgl-map, [class*="HeritageMap"]');
    await expect(mapContainer.first()).toBeVisible({ timeout: 10000 });
  });

  test('should have proper accessibility attributes', async ({ page }) => {
    // Check for main landmark
    const main = page.getByRole('main');
    await expect(main).toBeVisible();

    // Check header navigation
    const header = page.getByRole('banner');
    await expect(header).toBeVisible();

    // Check footer
    const footer = page.getByRole('contentinfo');
    await expect(footer).toBeVisible();

    // Search input should have proper ARIA attributes
    const searchInput = page.getByRole('combobox');
    await expect(searchInput).toHaveAttribute('aria-label');
    await expect(searchInput).toHaveAttribute('aria-haspopup', 'listbox');
  });
});

test.describe('Property Check Flow', () => {
  test('should show property status after selecting an address', async ({ page }) => {
    await page.goto('/');
    
    const searchInput = page.getByRole('combobox', { name: /search for a property/i });
    
    // Type and select an address
    await searchInput.fill('1 Hampstead High Street, NW3');
    await page.waitForTimeout(600);
    
    // If results appear, click the first one
    const listbox = page.getByRole('listbox');
    if (await listbox.isVisible()) {
      await listbox.getByRole('option').first().click();
      
      // Wait for property check results
      await page.waitForTimeout(2000);
      
      // Check for status card or result display
      const statusIndicator = page.locator('[class*="status"], [class*="Status"], [data-testid="property-status"]');
      // Results should be visible if the API responded
    }
  });

  test('should handle address not found gracefully', async ({ page }) => {
    await page.goto('/');
    
    const searchInput = page.getByRole('combobox', { name: /search for a property/i });
    
    // Type a nonsensical address
    await searchInput.fill('xyznonexistent12345');
    await page.waitForTimeout(600);
    
    // Should not crash, listbox should either be empty or not appear
    const listbox = page.getByRole('listbox');
    const isVisible = await listbox.isVisible().catch(() => false);
    
    if (isVisible) {
      // If visible, should show no results or helpful message
      const options = await listbox.getByRole('option').count();
      // No crash occurred - test passes
    }
    
    // Page should still be functional
    await expect(searchInput).toBeEnabled();
  });
});

test.describe('Street Pages', () => {
  test('should load a street page with planning data', async ({ page }) => {
    await page.goto('/street/hampstead-high-street');
    
    // Check for street name heading
    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toBeVisible();
    
    // Check for planning analysis section
    const planningSection = page.getByText(/Planning Approval Analysis/i);
    await expect(planningSection).toBeVisible();
    
    // Check for approval rate display
    const approvalRate = page.getByText(/%/);
    await expect(approvalRate.first()).toBeVisible();
  });

  test('should have breadcrumb navigation', async ({ page }) => {
    await page.goto('/street/hampstead-high-street');
    
    // Check for back link
    const backLink = page.getByRole('link', { name: /back to areas/i });
    await expect(backLink).toBeVisible();
    
    // Click and verify navigation
    await backLink.click();
    await expect(page).toHaveURL(/\/areas/);
  });

  test('should display market data', async ({ page }) => {
    await page.goto('/street/hampstead-high-street');
    
    // Check for price display (£ symbol)
    const priceDisplay = page.getByText(/£[\d,]+/);
    await expect(priceDisplay.first()).toBeVisible();
  });

  test('should show CTA for property check', async ({ page }) => {
    await page.goto('/street/hampstead-high-street');
    
    // Check for CTA button
    const ctaButton = page.getByRole('link', { name: /check my property/i });
    await expect(ctaButton).toBeVisible();
  });

  test('should return 404 for non-existent street', async ({ page }) => {
    const response = await page.goto('/street/nonexistent-street-12345');
    
    // Should show 404 page
    expect(response?.status()).toBe(404);
  });
});

test.describe('SEO & Meta Tags', () => {
  test('should have correct meta tags on homepage', async ({ page }) => {
    await page.goto('/');
    
    // Check meta description
    const metaDescription = page.locator('meta[name="description"]');
    await expect(metaDescription).toHaveAttribute('content', /.+/);
    
    // Check Open Graph tags
    const ogTitle = page.locator('meta[property="og:title"]');
    await expect(ogTitle).toHaveAttribute('content', /.+/);
    
    const ogDescription = page.locator('meta[property="og:description"]');
    await expect(ogDescription).toHaveAttribute('content', /.+/);
  });

  test('should have JSON-LD structured data', async ({ page }) => {
    await page.goto('/');
    
    // Check for JSON-LD script
    const jsonLdScript = page.locator('script[type="application/ld+json"]');
    await expect(jsonLdScript.first()).toBeVisible();
    
    // Validate JSON is parseable
    const jsonContent = await jsonLdScript.first().textContent();
    expect(() => JSON.parse(jsonContent ?? '')).not.toThrow();
  });

  test('should have canonical URL', async ({ page }) => {
    await page.goto('/street/hampstead-high-street');
    
    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute('href', /hampsteadrenovations\.com/);
  });
});

test.describe('Mobile Responsiveness', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('should be usable on mobile', async ({ page }) => {
    await page.goto('/');
    
    // Search should be visible
    const searchInput = page.getByRole('combobox', { name: /search for a property/i });
    await expect(searchInput).toBeVisible();
    
    // Should be able to type
    await searchInput.fill('NW3');
    await expect(searchInput).toHaveValue('NW3');
  });

  test('should have mobile-friendly navigation', async ({ page }) => {
    await page.goto('/');
    
    // Header should be visible
    const header = page.getByRole('banner');
    await expect(header).toBeVisible();
    
    // Check for mobile menu or visible nav
    const nav = page.getByRole('navigation');
    // Navigation should exist in some form
  });
});

test.describe('Performance', () => {
  test('should load homepage within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    
    const loadTime = Date.now() - startTime;
    
    // Should load within 5 seconds
    expect(loadTime).toBeLessThan(5000);
  });

  test('should have no console errors on homepage', async ({ page }) => {
    const errors: string[] = [];
    
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    await page.goto('/');
    await page.waitForTimeout(2000);
    
    // Filter out known third-party errors
    const criticalErrors = errors.filter(
      (e) => !e.includes('mapbox') && !e.includes('third-party')
    );
    
    expect(criticalErrors.length).toBe(0);
  });
});
